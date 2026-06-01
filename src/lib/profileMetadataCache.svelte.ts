import { createRxBackwardReq, type RxNostr } from "rx-nostr";
import { filter } from "rxjs";
import { addProfilePictureMarker } from "./profilePictureUrlUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import { profilesRepository } from "./storage/profilesRepository";
import type { ProfileData } from "./types";
import { toNprofile, toNpub } from "./utils/nostrUtils";

const PROFILE_CACHE_STALE_MS = 5 * 60 * 1_000;
const PROFILE_CACHE_GC_MS = 30 * 60 * 1_000;
const PROFILE_CACHE_NEGATIVE_TTL_MS = 60 * 1_000;
const PROFILE_CACHE_BATCH_WINDOW_MS = 30;
const PROFILE_CACHE_BATCH_TIMEOUT_MS = 4_000;
const PROFILE_CACHE_MAX_RELAYS = 12;
const ALLOWED_FUTURE_MARGIN_SEC = 10 * 60;

export type ProfileMetadataCacheStatus =
    | "hit"
    | "stale"
    | "miss"
    | "negative"
    | "invalid-future-ts"
    | "parse-error";

export interface ProfileMetadataSummary {
    name: string;
    displayName: string;
    picture: string;
}

export interface ProfileMetadataCacheEntry {
    pubkey: string;
    status: ProfileMetadataCacheStatus;
    profile: ProfileData | null;
    profileSummary: ProfileMetadataSummary | null;
    metadataRaw: string | null;
    fetchedAtMs: number;
    sourceEventCreatedAtSec: number | null;
    staleAtMs: number;
    expireAtMs: number;
    negativeUntilMs: number | null;
    sourceRelay: string | null;
    lastValidatedAtMs: number;
}

interface GetProfileOptions {
    rxNostr?: RxNostr;
    additionalRelays?: string[];
    writeRelays?: string[];
    forceRefresh?: boolean;
    allowBackgroundRefresh?: boolean;
}

interface GetProfilesOptions {
    rxNostr?: RxNostr;
    additionalRelays?: string[];
    writeRelays?: string[];
    forceRefresh?: boolean;
    allowBackgroundRefresh?: boolean;
}

interface PendingBatchRequest {
    rxNostr: RxNostr;
    pubkey: string;
    relays: string[];
    writeRelays: string[];
    resolve: (profile: ProfileData | null) => void;
    reject: (error: unknown) => void;
}

interface BatchNetworkResult {
    profile: ProfileData | null;
    metadataRaw: string | null;
    sourceEventCreatedAtSec: number | null;
    sourceRelay: string | null;
    rejectedFutureTimestamp: boolean;
    parseError: boolean;
}

let entriesByPubkey = $state.raw<Record<string, ProfileMetadataCacheEntry>>({});

const pendingByPubkey = new Map<string, Promise<ProfileData | null>>();
const subscribersByPubkey = new Map<string, Set<(profile: ProfileData | null) => void>>();
let pendingBatchRequests: PendingBatchRequest[] = [];
let pendingBatchTimer: ReturnType<typeof setTimeout> | null = null;

function nowMs(): number {
    return Date.now();
}

function nowSec(): number {
    return Math.floor(nowMs() / 1000);
}

function toProfileSummary(profile: ProfileData | null): ProfileMetadataSummary | null {
    if (!profile) {
        return null;
    }

    return {
        name: profile.name,
        displayName: profile.displayName,
        picture: profile.picture,
    };
}

function sanitizeRelays(relays: string[] = []): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(relays, {
        limit: PROFILE_CACHE_MAX_RELAYS,
    });
}

function isEntryExpired(entry: ProfileMetadataCacheEntry, now: number): boolean {
    return entry.expireAtMs <= now;
}

function isEntryStale(entry: ProfileMetadataCacheEntry, now: number): boolean {
    return entry.staleAtMs <= now;
}

function isNegativeEntryActive(entry: ProfileMetadataCacheEntry, now: number): boolean {
    return entry.status === "negative" && !!entry.negativeUntilMs && entry.negativeUntilMs > now;
}

function resolveProfileFetchedAtMs(profile: ProfileData, fallback: number): number {
    return typeof profile.fetchedAt === "number" && Number.isFinite(profile.fetchedAt)
        ? profile.fetchedAt
        : fallback;
}

function shouldAcceptProfileEvent(
    pubkey: string,
    sourceEventCreatedAtSec: number | null,
): boolean {
    if (sourceEventCreatedAtSec === null) {
        return true;
    }

    const currentSourceEventCreatedAtSec = entriesByPubkey[pubkey]?.sourceEventCreatedAtSec;
    return (
        typeof currentSourceEventCreatedAtSec !== "number"
        || sourceEventCreatedAtSec >= currentSourceEventCreatedAtSec
    );
}

function setEntry(pubkey: string, entry: ProfileMetadataCacheEntry): void {
    entriesByPubkey = {
        ...entriesByPubkey,
        [pubkey]: entry,
    };

    const subscribers = subscribersByPubkey.get(pubkey);
    if (!subscribers || subscribers.size === 0) {
        return;
    }

    for (const subscriber of subscribers) {
        subscriber(entry.profile);
    }
}

function setNegativeEntry(pubkey: string): void {
    const now = nowMs();
    setEntry(pubkey, {
        pubkey,
        status: "negative",
        profile: null,
        profileSummary: null,
        metadataRaw: null,
        fetchedAtMs: now,
        sourceEventCreatedAtSec: null,
        staleAtMs: now + PROFILE_CACHE_NEGATIVE_TTL_MS,
        expireAtMs: now + PROFILE_CACHE_NEGATIVE_TTL_MS,
        negativeUntilMs: now + PROFILE_CACHE_NEGATIVE_TTL_MS,
        sourceRelay: null,
        lastValidatedAtMs: now,
    });
}

function setProfileEntry(params: {
    pubkey: string;
    profile: ProfileData;
    metadataRaw: string | null;
    sourceEventCreatedAtSec: number | null;
    sourceRelay: string | null;
    fetchedAtMs?: number;
}): void {
    const now = nowMs();
    const fetchedAtMs = params.fetchedAtMs ?? now;
    const normalizedProfile: ProfileData = {
        ...params.profile,
        fetchedAt: params.profile.fetchedAt ?? fetchedAtMs,
        updatedAtFromEvent: params.sourceEventCreatedAtSec ?? params.profile.updatedAtFromEvent,
    };

    setEntry(params.pubkey, {
        pubkey: params.pubkey,
        status: "hit",
        profile: normalizedProfile,
        profileSummary: toProfileSummary(normalizedProfile),
        metadataRaw: params.metadataRaw,
        fetchedAtMs,
        sourceEventCreatedAtSec: params.sourceEventCreatedAtSec,
        staleAtMs: fetchedAtMs + PROFILE_CACHE_STALE_MS,
        expireAtMs: fetchedAtMs + PROFILE_CACHE_GC_MS,
        negativeUntilMs: null,
        sourceRelay: params.sourceRelay,
        lastValidatedAtMs: fetchedAtMs,
    });
}

function markEntryStatus(pubkey: string, status: ProfileMetadataCacheStatus): void {
    const current = entriesByPubkey[pubkey];
    if (!current) {
        return;
    }

    const now = nowMs();
    setEntry(pubkey, {
        ...current,
        status,
        lastValidatedAtMs: now,
    });
}

function gcExpiredEntries(): void {
    const now = nowMs();
    const active = Object.entries(entriesByPubkey).filter(([, entry]) => !isEntryExpired(entry, now));
    if (active.length === Object.keys(entriesByPubkey).length) {
        return;
    }

    entriesByPubkey = Object.fromEntries(active);
}

function toProfileFromEvent(params: {
    pubkey: string;
    content: string;
    createdAtSec: number;
    relay: string | null;
    writeRelays: string[];
}): ProfileData | null {
    try {
        const parsed = JSON.parse(params.content) as {
            picture?: unknown;
            name?: unknown;
            display_name?: unknown;
        };
        const profileRelays = params.relay ? [params.relay.endsWith("/") ? params.relay : `${params.relay}/`] : [];
        const rawPicture = typeof parsed.picture === "string" ? parsed.picture : "";
        const picture = rawPicture
            ? addProfilePictureMarker(rawPicture, {
                forceRemote: false,
                navigatorOnline: true,
            })
            : "";
        const profile: ProfileData = {
            name: typeof parsed.name === "string" ? parsed.name : "",
            displayName: typeof parsed.display_name === "string" ? parsed.display_name : "",
            picture,
            npub: toNpub(params.pubkey),
            nprofile: toNprofile(params.pubkey, profileRelays, params.writeRelays),
            profileRelays: profileRelays.length > 0 ? profileRelays : undefined,
        };

        profile.fetchedAt = nowMs();
        profile.updatedAtFromEvent = params.createdAtSec;
        return profile;
    } catch {
        return null;
    }
}

async function fetchBatchFromNetwork(
    rxNostr: RxNostr,
    pubkeys: string[],
    relayHints: string[],
    writeRelaysByPubkey: Record<string, string[]>,
): Promise<Record<string, BatchNetworkResult>> {
    const authors = Array.from(new Set(pubkeys.filter((pubkey) => !!pubkey)));
    const results: Record<string, BatchNetworkResult> = {};

    for (const pubkey of authors) {
        results[pubkey] = {
            profile: null,
            metadataRaw: null,
            sourceEventCreatedAtSec: null,
            sourceRelay: null,
            rejectedFutureTimestamp: false,
            parseError: false,
        };
    }

    if (authors.length === 0) {
        return results;
    }

    await new Promise<void>((resolve) => {
        const rxReq = createRxBackwardReq();
        let settled = false;
        let subscription: { unsubscribe: () => void } | null = null;

        const done = () => {
            if (settled) {
                return;
            }
            settled = true;
            subscription?.unsubscribe();
            resolve();
        };

        const timeoutId = setTimeout(() => {
            done();
        }, PROFILE_CACHE_BATCH_TIMEOUT_MS);

        const isValidTimestampPacket = (packet: { event?: { created_at?: number; pubkey?: string } }): boolean => {
            const createdAt = packet.event?.created_at;
            if (typeof createdAt !== "number") {
                return false;
            }

            const allow = createdAt <= nowSec() + ALLOWED_FUTURE_MARGIN_SEC;
            if (!allow) {
                const pubkey = packet.event?.pubkey;
                if (pubkey && results[pubkey]) {
                    results[pubkey] = {
                        ...results[pubkey],
                        rejectedFutureTimestamp: true,
                    };
                }
            }

            return allow;
        };

        const source = rxNostr.use(
            rxReq,
            relayHints.length > 0
                ? { on: { relays: relayHints } }
                : { on: { defaultReadRelays: true } },
        ) as { pipe?: (op: unknown) => { subscribe: (observer: unknown) => { unsubscribe: () => void } }; subscribe: (observer: unknown) => { unsubscribe: () => void } };

        const stream = typeof source.pipe === "function"
            // Upstream guard: reject bogus future kind:0 events before latest-selection.
            ? source.pipe(filter(isValidTimestampPacket))
            : source;

        subscription = stream.subscribe({
                next: (packet: { event?: { pubkey?: string; kind?: number; content?: string; created_at?: number }; from?: string }) => {
                    if (!isValidTimestampPacket(packet)) {
                        return;
                    }

                    const event = packet.event;
                    if (!event || event.kind !== 0 || !event.pubkey || !authors.includes(event.pubkey)) {
                        return;
                    }

                    const existing = results[event.pubkey];
                    if (
                        existing.sourceEventCreatedAtSec !== null
                        && typeof event.created_at === "number"
                        && event.created_at <= existing.sourceEventCreatedAtSec
                    ) {
                        return;
                    }

                    if (typeof event.created_at !== "number") {
                        return;
                    }

                    const profile = toProfileFromEvent({
                        pubkey: event.pubkey,
                        content: event.content ?? "",
                        createdAtSec: event.created_at,
                        relay: typeof packet.from === "string" ? packet.from : null,
                        writeRelays: writeRelaysByPubkey[event.pubkey] ?? [],
                    });

                    if (!profile) {
                        results[event.pubkey] = {
                            ...existing,
                            parseError: true,
                        };
                        return;
                    }

                    results[event.pubkey] = {
                        profile,
                        metadataRaw: event.content ?? null,
                        sourceEventCreatedAtSec: event.created_at,
                        sourceRelay: typeof packet.from === "string" ? packet.from : null,
                        rejectedFutureTimestamp: false,
                        parseError: false,
                    };
                },
                complete: () => {
                    clearTimeout(timeoutId);
                    done();
                },
                error: () => {
                    clearTimeout(timeoutId);
                    done();
                },
            });

        rxReq.emit({
            kinds: [0],
            authors,
            until: nowSec() + ALLOWED_FUTURE_MARGIN_SEC,
            limit: Math.max(24, authors.length * 4),
        } as never);
        rxReq.over();
    });

    return results;
}

async function flushPendingBatch(): Promise<void> {
    const batch = pendingBatchRequests;
    pendingBatchRequests = [];
    pendingBatchTimer = null;

    if (batch.length === 0) {
        return;
    }

    const groupedByRx = new Map<RxNostr, PendingBatchRequest[]>();
    for (const request of batch) {
        const current = groupedByRx.get(request.rxNostr) ?? [];
        current.push(request);
        groupedByRx.set(request.rxNostr, current);
    }

    for (const rxBatch of groupedByRx.values()) {
        const groupedByPubkey = new Map<string, PendingBatchRequest[]>();
        const relaySet = new Set<string>();
        const writeRelaysByPubkey: Record<string, string[]> = {};

        for (const request of rxBatch) {
            const current = groupedByPubkey.get(request.pubkey) ?? [];
            current.push(request);
            groupedByPubkey.set(request.pubkey, current);

            for (const relay of request.relays) {
                relaySet.add(relay);
            }

            const mergedWriteRelays = new Set([
                ...(writeRelaysByPubkey[request.pubkey] ?? []),
                ...request.writeRelays,
            ]);
            writeRelaysByPubkey[request.pubkey] = Array.from(mergedWriteRelays);
        }

        const pubkeys = Array.from(groupedByPubkey.keys());

        try {
            const results = await fetchBatchFromNetwork(
                rxBatch[0].rxNostr,
                pubkeys,
                sanitizeRelays(Array.from(relaySet)),
                writeRelaysByPubkey,
            );

            for (const pubkey of pubkeys) {
                const result = results[pubkey];
                const requests = groupedByPubkey.get(pubkey) ?? [];

                if (result?.profile) {
                    if (!shouldAcceptProfileEvent(pubkey, result.sourceEventCreatedAtSec)) {
                        for (const request of requests) {
                            request.resolve(entriesByPubkey[pubkey]?.profile ?? null);
                        }
                        continue;
                    }

                    setProfileEntry({
                        pubkey,
                        profile: result.profile,
                        metadataRaw: result.metadataRaw,
                        sourceEventCreatedAtSec: result.sourceEventCreatedAtSec,
                        sourceRelay: result.sourceRelay,
                    });
                    await profilesRepository.put(pubkey, result.profile);
                    for (const request of requests) {
                        request.resolve(result.profile);
                    }
                    continue;
                }

                if (result?.parseError) {
                    markEntryStatus(pubkey, "parse-error");
                } else if (result?.rejectedFutureTimestamp) {
                    markEntryStatus(pubkey, "invalid-future-ts");
                } else {
                    setNegativeEntry(pubkey);
                }

                for (const request of requests) {
                    request.resolve(null);
                }
            }
        } catch (error) {
            for (const requests of groupedByPubkey.values()) {
                for (const request of requests) {
                    request.reject(error);
                }
            }
        }
    }
}

function enqueueBatchRequest(
    pubkey: string,
    rxNostr: RxNostr,
    relays: string[],
    writeRelays: string[],
): Promise<ProfileData | null> {
    return new Promise<ProfileData | null>((resolve, reject) => {
        pendingBatchRequests.push({
            rxNostr,
            pubkey,
            relays: [...relays],
            writeRelays: [...writeRelays],
            resolve,
            reject,
        });

        if (pendingBatchTimer) {
            return;
        }

        pendingBatchTimer = setTimeout(() => {
            void flushPendingBatch();
        }, PROFILE_CACHE_BATCH_WINDOW_MS);
    });
}

async function ensureFreshProfile(
    pubkey: string,
    options: GetProfileOptions,
): Promise<ProfileData | null> {
    if (!pubkey || !options.rxNostr) {
        return null;
    }

    const pending = pendingByPubkey.get(pubkey);
    if (pending) {
        return pending;
    }

    const task = enqueueBatchRequest(
        pubkey,
        options.rxNostr,
        sanitizeRelays(options.additionalRelays ?? []),
        sanitizeRelays(options.writeRelays ?? []),
    ).finally(() => {
        pendingByPubkey.delete(pubkey);
        gcExpiredEntries();
    });

    pendingByPubkey.set(pubkey, task);
    return task;
}

async function getProfile(pubkey: string, options: GetProfileOptions = {}): Promise<ProfileData | null> {
    const now = nowMs();
    const entry = entriesByPubkey[pubkey];

    if (!options.forceRefresh && entry && !isEntryExpired(entry, now)) {
        if (isNegativeEntryActive(entry, now)) {
            return null;
        }

        if (entry.profile && !isEntryStale(entry, now)) {
            return entry.profile;
        }

        if (entry.profile && options.allowBackgroundRefresh !== false && options.rxNostr) {
            void ensureFreshProfile(pubkey, options);
            markEntryStatus(pubkey, "stale");
            return entry.profile;
        }
    }

    if (!options.forceRefresh) {
        const cachedProfile = await profilesRepository.get(pubkey);
        if (cachedProfile) {
            const cachedProfileRelays = sanitizeRelays(cachedProfile.profileRelays ?? []);
            const refreshOptions: GetProfileOptions = {
                ...options,
                additionalRelays: sanitizeRelays([
                    ...(options.additionalRelays ?? []),
                    ...cachedProfileRelays,
                ]),
            };
            const cachedFetchedAtMs = resolveProfileFetchedAtMs(cachedProfile, now);

            setProfileEntry({
                pubkey,
                profile: cachedProfile,
                metadataRaw: null,
                sourceEventCreatedAtSec: cachedProfile.updatedAtFromEvent ?? null,
                sourceRelay: null,
                fetchedAtMs: cachedFetchedAtMs,
            });

            const restoredEntry = entriesByPubkey[pubkey];
            if (
                restoredEntry
                && isEntryStale(restoredEntry, now)
                && options.allowBackgroundRefresh !== false
                && options.rxNostr
            ) {
                void ensureFreshProfile(pubkey, refreshOptions);
                markEntryStatus(pubkey, "stale");
            }
            return cachedProfile;
        }
    }

    if (!options.rxNostr) {
        return null;
    }

    return await ensureFreshProfile(pubkey, options);
}

async function getProfiles(
    pubkeys: string[],
    options: GetProfilesOptions = {},
): Promise<Record<string, ProfileData | null>> {
    const uniquePubkeys = Array.from(new Set(pubkeys.filter((pubkey) => !!pubkey)));
    const entries = await Promise.all(
        uniquePubkeys.map(async (pubkey) => {
            const profile = await getProfile(pubkey, {
                rxNostr: options.rxNostr,
                additionalRelays: options.additionalRelays,
                writeRelays: options.writeRelays,
                forceRefresh: options.forceRefresh,
                allowBackgroundRefresh: options.allowBackgroundRefresh,
            });
            return [pubkey, profile] as const;
        }),
    );

    return Object.fromEntries(entries);
}

function subscribe(pubkey: string, callback: (profile: ProfileData | null) => void): () => void {
    const current = subscribersByPubkey.get(pubkey) ?? new Set<(profile: ProfileData | null) => void>();
    current.add(callback);
    subscribersByPubkey.set(pubkey, current);

    const entry = entriesByPubkey[pubkey];
    if (entry) {
        callback(entry.profile);
    }

    return () => {
        const targets = subscribersByPubkey.get(pubkey);
        if (!targets) {
            return;
        }

        targets.delete(callback);
        if (targets.size === 0) {
            subscribersByPubkey.delete(pubkey);
        }
    };
}

function getReactiveEntry(pubkey: string): ProfileMetadataCacheEntry | null {
    return entriesByPubkey[pubkey] ?? null;
}

function resetForTests(): void {
    if (pendingBatchTimer) {
        clearTimeout(pendingBatchTimer);
        pendingBatchTimer = null;
    }

    entriesByPubkey = {};
    pendingByPubkey.clear();
    subscribersByPubkey.clear();
    pendingBatchRequests = [];
}

export const profileMetadataCache = {
    getProfile,
    getProfiles,
    getReactiveEntry,
    subscribe,
};

export const profileMetadataCacheInternals = {
    ALLOWED_FUTURE_MARGIN_SEC,
    PROFILE_CACHE_NEGATIVE_TTL_MS,
    PROFILE_CACHE_STALE_MS,
    PROFILE_CACHE_GC_MS,
    resetForTests,
};
