import { createRxBackwardReq, type RxNostr } from "rx-nostr";
import { filter } from "rxjs";
import { addProfilePictureMarker } from "./profilePictureUrlUtils";
import {
    buildProfileRelayTiers,
    groupPubkeysByRelaySet,
    type ProfileRelayRequestGroup,
} from "./profileRelayTiers";
import { RelayConfigUtils } from "./relayConfigUtils";
import {
    profileRecordToProfileData,
    profilesRepository,
    type ProfileUpsertResult,
} from "./storage/profilesRepository";
import type { ProfileData } from "./types";
import { toNprofile, toNpub } from "./utils/nostrUtils";

const PROFILE_CACHE_STALE_MS = 5 * 60 * 1_000;
const PROFILE_CACHE_GC_MS = 30 * 60 * 1_000;
const PROFILE_CACHE_NEGATIVE_TTL_MS = 60 * 1_000;
const PROFILE_CACHE_BATCH_WINDOW_MS = 30;
const PROFILE_CACHE_BATCH_TIMEOUT_MS = 4_000;
const PROFILE_CACHE_MAX_RELAYS = 12;
const PROFILE_CACHE_NETWORK_PUBKEY_BATCH_SIZE = 50;
const PROFILE_CACHE_NETWORK_CONCURRENCY = 2;
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
    sourceEventId: string | null;
    staleAtMs: number;
    expireAtMs: number;
    negativeUntilMs: number | null;
    sourceRelay: string | null;
    lastValidatedAtMs: number;
    persistence: "persisted" | "temporary";
}

interface GetProfileOptions {
    rxNostr?: RxNostr;
    additionalRelays?: string[];
    fallbackRelays?: string[];
    writeRelays?: string[];
    forceRefresh?: boolean;
    allowBackgroundRefresh?: boolean;
}

interface ProfileBatchRelayOptions {
    additionalRelays?: string[];
    fallbackRelays?: string[];
    writeRelays?: string[];
}

interface GetProfilesOptions extends GetProfileOptions {
    relayOptionsByPubkey?: Readonly<Record<string, ProfileBatchRelayOptions>>;
}

interface PendingBatchRequest {
    rxNostr: RxNostr;
    pubkey: string;
    relays: string[];
    fallbackRelays: string[];
    writeRelays: string[];
    existingSnapshot: ProfileData | null;
    resolve: (profile: ProfileData | null) => void;
    reject: (error: unknown) => void;
}

interface BatchNetworkResult {
    profile: ProfileData | null;
    metadataRaw: string | null;
    sourceEventCreatedAtSec: number | null;
    sourceEventId: string | null;
    sourceRelay: string | null;
    observedRelays: string[];
    rejectedFutureTimestamp: boolean;
    parseError: boolean;
    networkError: boolean;
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

function normalizeRelaysPreservingOrder(relays: string[] = []): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(relays);
}

function sanitizeRelays(relays: string[] = []): string[] {
    return normalizeRelaysPreservingOrder(relays).slice(0, PROFILE_CACHE_MAX_RELAYS);
}

function chunkProfileRelayGroups(
    groups: ProfileRelayRequestGroup[],
): ProfileRelayRequestGroup[] {
    return groups.flatMap((group) => {
        const chunks: ProfileRelayRequestGroup[] = [];
        for (let index = 0; index < group.pubkeys.length; index += PROFILE_CACHE_NETWORK_PUBKEY_BATCH_SIZE) {
            chunks.push({
                relays: group.relays,
                pubkeys: group.pubkeys.slice(index, index + PROFILE_CACHE_NETWORK_PUBKEY_BATCH_SIZE),
            });
        }
        return chunks;
    });
}

async function mapWithConcurrency<T, R>(
    values: T[],
    concurrency: number,
    mapper: (value: T) => Promise<R>,
): Promise<R[]> {
    const results = new Array<R>(values.length);
    let nextIndex = 0;
    const workers = Array.from(
        { length: Math.min(concurrency, values.length) },
        async () => {
            while (nextIndex < values.length) {
                const index = nextIndex;
                nextIndex += 1;
                results[index] = await mapper(values[index]);
            }
        },
    );
    await Promise.all(workers);
    return results;
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

function setEntry(
    pubkey: string,
    entry: ProfileMetadataCacheEntry,
    notifySubscribers = true,
): void {
    entriesByPubkey = {
        ...entriesByPubkey,
        [pubkey]: entry,
    };

    if (!notifySubscribers) {
        return;
    }

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
        sourceEventId: null,
        staleAtMs: now + PROFILE_CACHE_NEGATIVE_TTL_MS,
        expireAtMs: now + PROFILE_CACHE_NEGATIVE_TTL_MS,
        negativeUntilMs: now + PROFILE_CACHE_NEGATIVE_TTL_MS,
        sourceRelay: null,
        lastValidatedAtMs: now,
        persistence: "persisted",
    });
}

function setProfileEntry(params: {
    pubkey: string;
    profile: ProfileData;
    metadataRaw: string | null;
    sourceEventCreatedAtSec: number | null;
    sourceEventId?: string | null;
    sourceRelay: string | null;
    fetchedAtMs?: number;
    persistence?: "persisted" | "temporary";
    notifySubscribers?: boolean;
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
        sourceEventId: params.sourceEventId ?? null,
        staleAtMs: params.persistence === "temporary"
            ? now
            : fetchedAtMs + PROFILE_CACHE_STALE_MS,
        expireAtMs: fetchedAtMs + PROFILE_CACHE_GC_MS,
        negativeUntilMs: null,
        sourceRelay: params.sourceRelay,
        lastValidatedAtMs: fetchedAtMs,
        persistence: params.persistence ?? "persisted",
    }, params.notifySubscribers ?? true);
}

function areDisplayedProfilesEqual(left: ProfileData | null, right: ProfileData): boolean {
    if (!left) {
        return false;
    }

    const leftRelays = left.profileRelays ?? [];
    const rightRelays = right.profileRelays ?? [];
    return left.name === right.name
        && left.displayName === right.displayName
        && left.picture === right.picture
        && left.npub === right.npub
        && left.nprofile === right.nprofile
        && leftRelays.length === rightRelays.length
        && leftRelays.every((relay, index) => relay === rightRelays[index]);
}

function resolveExistingSnapshot(
    pubkey: string,
    requests: PendingBatchRequest[],
): ProfileData | null {
    return entriesByPubkey[pubkey]?.profile
        ?? requests.find((request) => request.existingSnapshot)?.existingSnapshot
        ?? null;
}

function restoreSnapshotEntry(pubkey: string, snapshot: ProfileData): ProfileData {
    const current = entriesByPubkey[pubkey];
    if (current?.profile) {
        return current.profile;
    }

    const fetchedAtMs = resolveProfileFetchedAtMs(snapshot, nowMs());
    setProfileEntry({
        pubkey,
        profile: snapshot,
        metadataRaw: null,
        sourceEventCreatedAtSec: snapshot.updatedAtFromEvent ?? null,
        sourceEventId: null,
        sourceRelay: null,
        fetchedAtMs,
    });
    return entriesByPubkey[pubkey]?.profile ?? snapshot;
}

function applyAcceptedProfile(
    pubkey: string,
    upsertResult: ProfileUpsertResult,
    observation: Pick<
        ProfileMetadataCacheEntry,
        "metadataRaw" | "sourceEventId" | "sourceRelay"
    >,
): ProfileData | null {
    const acceptedProfile = upsertResult.acceptedProfile;
    if (!acceptedProfile) {
        return null;
    }

    const current = entriesByPubkey[pubkey];
    const acceptedRecord = upsertResult.acceptedRecord;
    const observationMatchesAccepted = !!observation.sourceEventId
        && observation.sourceEventId === acceptedRecord?.sourceEventId;
    const canReuseObservation = upsertResult.currentEventConfirmed
        || observationMatchesAccepted;
    const fetchedAtMs = acceptedRecord?.fetchedAt
        ?? resolveProfileFetchedAtMs(acceptedProfile, nowMs());
    const normalizedAcceptedProfile: ProfileData = {
        ...acceptedProfile,
        fetchedAt: acceptedProfile.fetchedAt ?? fetchedAtMs,
        updatedAtFromEvent: acceptedRecord?.updatedAtFromEvent
            ?? acceptedProfile.updatedAtFromEvent,
    };

    setProfileEntry({
        pubkey,
        profile: normalizedAcceptedProfile,
        metadataRaw: canReuseObservation ? observation.metadataRaw : null,
        sourceEventCreatedAtSec: acceptedRecord?.updatedAtFromEvent
            ?? acceptedProfile.updatedAtFromEvent
            ?? null,
        sourceEventId: acceptedRecord?.sourceEventId
            ?? (canReuseObservation ? observation.sourceEventId : null),
        sourceRelay: canReuseObservation ? observation.sourceRelay : null,
        fetchedAtMs,
        persistence: "persisted",
        notifySubscribers: !areDisplayedProfilesEqual(current?.profile ?? null, normalizedAcceptedProfile),
    });

    return entriesByPubkey[pubkey]?.profile ?? acceptedProfile;
}

interface TemporaryEntryPersistenceResult {
    profile: ProfileData | null;
    acceptedRecord: ProfileUpsertResult["acceptedRecord"];
    persistence: "persisted" | "temporary" | null;
    dbError: boolean;
}

async function persistTemporaryEntryIfPossible(
    pubkey: string,
): Promise<TemporaryEntryPersistenceResult> {
    const entry = entriesByPubkey[pubkey];
    if (
        entry?.persistence !== "temporary"
        || !entry.profile
        || !entry.sourceEventId
        || entry.sourceEventCreatedAtSec === null
    ) {
        return {
            profile: entry?.profile ?? null,
            acceptedRecord: null,
            persistence: entry?.persistence ?? null,
            dbError: false,
        };
    }

    try {
        const observedRelays = sanitizeRelays([
            ...(entry.profile.profileRelays ?? []),
            ...(entry.sourceRelay ? [entry.sourceRelay] : []),
        ]);
        const upsertResult = await profilesRepository.upsertCandidate(pubkey, {
            pubkeyHex: pubkey,
            profile: entry.profile,
            sourceEventId: entry.sourceEventId,
            updatedAtFromEvent: entry.sourceEventCreatedAtSec,
            observedRelays,
            fetchedAt: entry.fetchedAtMs,
        });

        if (upsertResult.acceptedProfile && upsertResult.acceptedRecord) {
            const profile = applyAcceptedProfile(pubkey, upsertResult, entry);
            return {
                profile,
                acceptedRecord: upsertResult.acceptedRecord,
                persistence: "persisted",
                dbError: false,
            };
        }

        return {
            profile: entry.profile,
            acceptedRecord: null,
            persistence: "temporary",
            dbError: false,
        };
    } catch {
        return {
            profile: entry.profile,
            acceptedRecord: null,
            persistence: "temporary",
            dbError: true,
        };
    }
}

function setTemporaryNetworkProfile(
    pubkey: string,
    networkResult: BatchNetworkResult,
): ProfileData {
    const profileRelays = RelayConfigUtils.sanitizeExternalRelayUrls([
        ...(networkResult.profile?.profileRelays ?? []),
        ...networkResult.observedRelays,
    ]);
    const temporaryProfile: ProfileData = {
        ...networkResult.profile!,
        profileRelays: profileRelays.length > 0 ? profileRelays : undefined,
    };

    setProfileEntry({
        pubkey,
        profile: temporaryProfile,
        metadataRaw: networkResult.metadataRaw,
        sourceEventCreatedAtSec: networkResult.sourceEventCreatedAtSec,
        sourceEventId: networkResult.sourceEventId,
        sourceRelay: networkResult.sourceRelay,
        persistence: "temporary",
    });

    return entriesByPubkey[pubkey]?.profile ?? temporaryProfile;
}

function markEntryStatus(
    pubkey: string,
    status: ProfileMetadataCacheStatus,
    notifySubscribers = true,
): void {
    const current = entriesByPubkey[pubkey];
    if (!current) {
        return;
    }

    const now = nowMs();
    setEntry(pubkey, {
        ...current,
        status,
        lastValidatedAtMs: now,
    }, notifySubscribers);
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
    timeoutMs: number,
    onRequestStarted?: (authors: string[]) => void,
): Promise<Record<string, BatchNetworkResult>> {
    const authors = Array.from(new Set(pubkeys.filter((pubkey) => !!pubkey)));
    const results: Record<string, BatchNetworkResult> = {};

    for (const pubkey of authors) {
        results[pubkey] = {
            profile: null,
            metadataRaw: null,
            sourceEventCreatedAtSec: null,
            sourceEventId: null,
            sourceRelay: null,
            observedRelays: [],
            rejectedFutureTimestamp: false,
            parseError: false,
            networkError: false,
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
        }, Math.max(1, timeoutMs));

        const markNetworkError = () => {
            for (const pubkey of authors) {
                results[pubkey] = {
                    ...results[pubkey],
                    networkError: true,
                };
            }
        };

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

        try {
            const source = rxNostr.use(
                rxReq,
                { on: { relays: relayHints } },
            ) as { pipe?: (op: unknown) => { subscribe: (observer: unknown) => { unsubscribe: () => void } }; subscribe: (observer: unknown) => { unsubscribe: () => void } };

            const stream = typeof source.pipe === "function"
                // Upstream guard: reject bogus future kind:0 events before latest-selection.
                ? source.pipe(filter(isValidTimestampPacket))
                : source;

            subscription = stream.subscribe({
                next: (packet: { event?: { id?: string; pubkey?: string; kind?: number; content?: string; created_at?: number }; from?: string }) => {
                    if (!isValidTimestampPacket(packet)) {
                        return;
                    }

                    const event = packet.event;
                    if (!event || event.kind !== 0 || !event.pubkey || !authors.includes(event.pubkey)) {
                        return;
                    }

                    const existing = results[event.pubkey];
                    if (typeof event.created_at !== "number" || typeof event.id !== "string") {
                        return;
                    }

                    const relay = typeof packet.from === "string" ? packet.from : null;
                    if (
                        existing.sourceEventCreatedAtSec === event.created_at
                        && existing.sourceEventId === event.id
                    ) {
                        results[event.pubkey] = {
                            ...existing,
                            observedRelays: relay
                                ? [...existing.observedRelays, relay]
                                : existing.observedRelays,
                        };
                        return;
                    }

                    if (existing.sourceEventCreatedAtSec !== null) {
                        if (event.created_at < existing.sourceEventCreatedAtSec) {
                            return;
                        }

                        if (
                            event.created_at === existing.sourceEventCreatedAtSec
                            && existing.sourceEventId !== null
                            && event.id > existing.sourceEventId
                        ) {
                            return;
                        }
                    }

                    const profile = toProfileFromEvent({
                        pubkey: event.pubkey,
                        content: event.content ?? "",
                        createdAtSec: event.created_at,
                        relay,
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
                        sourceEventId: event.id,
                        sourceRelay: relay,
                        observedRelays: relay ? [relay] : [],
                        rejectedFutureTimestamp: false,
                        parseError: false,
                        networkError: false,
                    };
                },
                complete: () => {
                    clearTimeout(timeoutId);
                    done();
                },
                error: () => {
                    markNetworkError();
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
            onRequestStarted?.(authors);
        } catch {
            markNetworkError();
            clearTimeout(timeoutId);
            done();
        }
    });

    return results;
}

export type ProfileTierStopReason =
    | "current-event-confirmed"
    | "persistence-unavailable"
    | null;

export interface ProfileTierResolution {
    profile: ProfileData | null;
    stopReason: ProfileTierStopReason;
    parseError: boolean;
    rejectedFutureTimestamp: boolean;
    networkError: boolean;
}

async function applyTierNetworkResult(
    pubkey: string,
    result: BatchNetworkResult,
    requests: PendingBatchRequest[],
): Promise<ProfileTierResolution> {
    if (
        result.profile
        && result.sourceEventId !== null
        && result.sourceEventCreatedAtSec !== null
    ) {
        try {
            const upsertResult = await profilesRepository.upsertCandidate(pubkey, {
                pubkeyHex: pubkey,
                profile: result.profile,
                sourceEventId: result.sourceEventId,
                updatedAtFromEvent: result.sourceEventCreatedAtSec,
                observedRelays: result.observedRelays,
                fetchedAt: resolveProfileFetchedAtMs(result.profile, nowMs()),
            });
            const acceptedProfile = applyAcceptedProfile(pubkey, upsertResult, result);
            return {
                profile: acceptedProfile,
                stopReason: upsertResult.currentEventConfirmed && acceptedProfile !== null
                    ? "current-event-confirmed"
                    : null,
                parseError: false,
                rejectedFutureTimestamp: false,
                networkError: false,
            };
        } catch {
            const snapshot = resolveExistingSnapshot(pubkey, requests);
            return {
                profile: snapshot
                    ? restoreSnapshotEntry(pubkey, snapshot)
                    : setTemporaryNetworkProfile(pubkey, result),
                stopReason: "persistence-unavailable",
                parseError: false,
                rejectedFutureTimestamp: false,
                networkError: false,
            };
        }
    }

    return {
        profile: resolveExistingSnapshot(pubkey, requests),
        stopReason: null,
        parseError: result.parseError,
        rejectedFutureTimestamp: result.rejectedFutureTimestamp,
        networkError: result.networkError,
    };
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
        const writeRelaysByPubkey: Record<string, string[]> = {};
        const contextualRelaysByPubkey: Record<string, string[]> = {};
        const fallbackRelaysByPubkey: Record<string, string[]> = {};

        for (const request of rxBatch) {
            const current = groupedByPubkey.get(request.pubkey) ?? [];
            current.push(request);
            groupedByPubkey.set(request.pubkey, current);

            contextualRelaysByPubkey[request.pubkey] = normalizeRelaysPreservingOrder([
                ...(contextualRelaysByPubkey[request.pubkey] ?? []),
                ...request.relays,
            ]);
            fallbackRelaysByPubkey[request.pubkey] = sanitizeRelays([
                ...(fallbackRelaysByPubkey[request.pubkey] ?? []),
                ...request.fallbackRelays,
            ]);

            const mergedWriteRelays = new Set([
                ...(writeRelaysByPubkey[request.pubkey] ?? []),
                ...request.writeRelays,
            ]);
            writeRelaysByPubkey[request.pubkey] = Array.from(mergedWriteRelays);
        }

        const pubkeys = Array.from(groupedByPubkey.keys());
        const tiersByPubkey = Object.fromEntries(pubkeys.map((pubkey) => [
            pubkey,
            buildProfileRelayTiers({
                contextualRelays: contextualRelaysByPubkey[pubkey] ?? [],
                fallbackRelays: fallbackRelaysByPubkey[pubkey] ?? [],
                contextualRelayLimit: PROFILE_CACHE_MAX_RELAYS,
            }),
        ]));
        const commonTiers = buildProfileRelayTiers({
            contextualRelays: [],
            contextualRelayLimit: PROFILE_CACHE_MAX_RELAYS,
        });
        const unresolvedPubkeys = new Set(pubkeys);
        const resolvedProfiles: Record<string, ProfileData | null> = {};
        const parseErrors = new Set<string>();
        const rejectedFutureTimestamps = new Set<string>();
        const queriedPubkeys = new Set<string>();
        const tierNames = ["bootstrap", "contextual", "fallback"] as const;

        const getRelayGroups = (
            tierName: typeof tierNames[number],
            targets: string[],
        ): ProfileRelayRequestGroup[] => {
            if (tierName === "bootstrap") {
                return commonTiers.bootstrap.length > 0
                    ? [{ relays: commonTiers.bootstrap, pubkeys: targets }]
                    : [];
            }

            const relaysByPubkey = Object.fromEntries(targets.map((pubkey) => [
                pubkey,
                tiersByPubkey[pubkey][tierName],
            ]));
            return groupPubkeysByRelaySet(targets, relaysByPubkey);
        };

        try {
            for (const tierName of tierNames) {
                const targets = Array.from(unresolvedPubkeys);
                const groups = chunkProfileRelayGroups(getRelayGroups(tierName, targets));

                const fetchedGroups = await mapWithConcurrency(
                    groups,
                    PROFILE_CACHE_NETWORK_CONCURRENCY,
                    async (group) => {
                        const activeTargets = group.pubkeys.filter((pubkey) => unresolvedPubkeys.has(pubkey));
                        if (activeTargets.length === 0) {
                            return null;
                        }
                        const results = await fetchBatchFromNetwork(
                            rxBatch[0].rxNostr,
                            activeTargets,
                            group.relays,
                            writeRelaysByPubkey,
                            PROFILE_CACHE_BATCH_TIMEOUT_MS,
                            (authors) => {
                                for (const pubkey of authors) {
                                    queriedPubkeys.add(pubkey);
                                }
                            },
                        );
                        return { activeTargets, results };
                    },
                );

                for (const fetchedGroup of fetchedGroups) {
                    if (!fetchedGroup) {
                        continue;
                    }
                    for (const pubkey of fetchedGroup.activeTargets) {
                        const requests = groupedByPubkey.get(pubkey) ?? [];
                        const resolution = await applyTierNetworkResult(
                            pubkey,
                            fetchedGroup.results[pubkey],
                            requests,
                        );
                        resolvedProfiles[pubkey] = resolution.profile;
                        if (resolution.parseError) {
                            parseErrors.add(pubkey);
                        }
                        if (resolution.rejectedFutureTimestamp) {
                            rejectedFutureTimestamps.add(pubkey);
                        }
                        if (resolution.stopReason !== null) {
                            unresolvedPubkeys.delete(pubkey);
                        }
                    }
                }
            }

            for (const pubkey of unresolvedPubkeys) {
                const requests = groupedByPubkey.get(pubkey) ?? [];
                const snapshot = resolveExistingSnapshot(pubkey, requests);
                if (parseErrors.has(pubkey)) {
                    markEntryStatus(pubkey, "parse-error");
                } else if (rejectedFutureTimestamps.has(pubkey)) {
                    markEntryStatus(pubkey, "invalid-future-ts");
                } else if (!snapshot && queriedPubkeys.has(pubkey)) {
                    setNegativeEntry(pubkey);
                }
                resolvedProfiles[pubkey] = snapshot
                    ? restoreSnapshotEntry(pubkey, snapshot)
                    : null;
            }

            for (const [pubkey, requests] of groupedByPubkey.entries()) {
                for (const request of requests) {
                    request.resolve(resolvedProfiles[pubkey] ?? null);
                }
            }
        } catch {
            for (const [pubkey, requests] of groupedByPubkey.entries()) {
                const snapshot = resolveExistingSnapshot(pubkey, requests);
                for (const request of requests) {
                    request.resolve(snapshot ? restoreSnapshotEntry(pubkey, snapshot) : null);
                }
            }
        }
    }
}

function enqueueBatchRequest(
    pubkey: string,
    rxNostr: RxNostr,
    relays: string[],
    fallbackRelays: string[],
    writeRelays: string[],
    existingSnapshot: ProfileData | null,
): Promise<ProfileData | null> {
    return new Promise<ProfileData | null>((resolve, reject) => {
        pendingBatchRequests.push({
            rxNostr,
            pubkey,
            relays: [...relays],
            fallbackRelays: [...fallbackRelays],
            writeRelays: [...writeRelays],
            existingSnapshot,
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
    knownPersistedProfile: ProfileData | null | undefined = undefined,
): Promise<ProfileData | null> {
    if (!pubkey || !options.rxNostr) {
        return null;
    }

    const pending = pendingByPubkey.get(pubkey);
    if (pending) {
        return pending;
    }

    const task = (async () => {
        let persistedProfile = knownPersistedProfile;
        if (persistedProfile === undefined) {
            try {
                persistedProfile = await profilesRepository.get(pubkey);
            } catch {
                persistedProfile = null;
                // A network candidate can still be exposed temporarily when no snapshot exists.
            }
        }

        const temporaryPersistence = await persistTemporaryEntryIfPossible(pubkey);
        const existingSnapshot = temporaryPersistence.profile
            ?? entriesByPubkey[pubkey]?.profile
            ?? persistedProfile;
        const contextualRelays = normalizeRelaysPreservingOrder([
            ...(options.additionalRelays ?? []),
            ...(existingSnapshot?.profileRelays ?? []),
        ]);
        return enqueueBatchRequest(
            pubkey,
            options.rxNostr!,
            contextualRelays,
            sanitizeRelays(options.fallbackRelays ?? []),
            sanitizeRelays(options.writeRelays ?? []),
            existingSnapshot,
        );
    })().finally(() => {
        pendingByPubkey.delete(pubkey);
        gcExpiredEntries();
    });

    pendingByPubkey.set(pubkey, task);
    return task;
}

async function getProfileInternal(
    pubkey: string,
    options: GetProfileOptions,
    repositoryLookupCompleted: boolean,
): Promise<ProfileData | null> {
    const now = nowMs();
    const entry = entriesByPubkey[pubkey];

    if (!options.forceRefresh && entry && !isEntryExpired(entry, now)) {
        if (isNegativeEntryActive(entry, now)) {
            return null;
        }

        if (entry.profile && entry.persistence === "temporary") {
            if (options.allowBackgroundRefresh !== false && options.rxNostr) {
                void ensureFreshProfile(
                    pubkey,
                    options,
                    repositoryLookupCompleted ? entry.profile : undefined,
                );
                markEntryStatus(pubkey, "stale", false);
            }
            return entry.profile;
        }

        if (entry.profile && !isEntryStale(entry, now)) {
            return entry.profile;
        }

        if (entry.profile) {
            if (options.allowBackgroundRefresh !== false && options.rxNostr) {
                void ensureFreshProfile(
                    pubkey,
                    options,
                    repositoryLookupCompleted ? entry.profile : undefined,
                );
                markEntryStatus(pubkey, "stale");
            }
            return entry.profile;
        }
    }

    if (!options.forceRefresh && !repositoryLookupCompleted) {
        const cachedProfile = await profilesRepository.get(pubkey);
        if (cachedProfile) {
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
                void ensureFreshProfile(pubkey, options, cachedProfile);
                markEntryStatus(pubkey, "stale");
            }
            return cachedProfile;
        }
    }

    if (!options.rxNostr) {
        return null;
    }

    return await ensureFreshProfile(
        pubkey,
        options,
        repositoryLookupCompleted ? (entriesByPubkey[pubkey]?.profile ?? null) : undefined,
    );
}

async function getProfile(pubkey: string, options: GetProfileOptions = {}): Promise<ProfileData | null> {
    return getProfileInternal(pubkey, options, false);
}

async function getProfiles(
    pubkeys: string[],
    options: GetProfilesOptions = {},
): Promise<Record<string, ProfileData | null>> {
    const uniquePubkeys = Array.from(new Set(pubkeys.filter((pubkey) => !!pubkey)));
    if (uniquePubkeys.length === 0) {
        return {};
    }

    if (!options.forceRefresh) {
        const now = nowMs();
        const repositoryPubkeys = uniquePubkeys.filter((pubkey) => {
            const entry = entriesByPubkey[pubkey];
            return !entry || isEntryExpired(entry, now);
        });
        if (repositoryPubkeys.length > 0) {
            try {
                const records = await profilesRepository.bulkGetRecords(repositoryPubkeys);
                records.forEach((record, index) => {
                    if (!record) {
                        return;
                    }
                    const profile = profileRecordToProfileData(record);
                    setProfileEntry({
                        pubkey: repositoryPubkeys[index],
                        profile,
                        metadataRaw: null,
                        sourceEventCreatedAtSec: profile.updatedAtFromEvent ?? null,
                        sourceEventId: record.sourceEventId ?? null,
                        sourceRelay: null,
                        fetchedAtMs: resolveProfileFetchedAtMs(profile, now),
                    });
                });
            } catch {
                // Network resolution can continue when IndexedDB bulk access is unavailable.
            }
        }
    }

    const entries = await Promise.all(
        uniquePubkeys.map(async (pubkey) => {
            const relayOptions = options.relayOptionsByPubkey?.[pubkey];
            const profile = await getProfileInternal(pubkey, {
                rxNostr: options.rxNostr,
                additionalRelays: normalizeRelaysPreservingOrder([
                    ...(relayOptions?.additionalRelays ?? []),
                    ...(options.additionalRelays ?? []),
                ]),
                fallbackRelays: normalizeRelaysPreservingOrder([
                    ...(relayOptions?.fallbackRelays ?? []),
                    ...(options.fallbackRelays ?? []),
                ]),
                writeRelays: normalizeRelaysPreservingOrder([
                    ...(relayOptions?.writeRelays ?? []),
                    ...(options.writeRelays ?? []),
                ]),
                forceRefresh: options.forceRefresh,
                allowBackgroundRefresh: options.allowBackgroundRefresh,
            }, !options.forceRefresh);
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

function subscribeProfiles(
    pubkeys: string[],
    callback: (pubkey: string, profile: ProfileData | null) => void,
): () => void {
    const uniquePubkeys = Array.from(new Set(pubkeys.filter((pubkey) => !!pubkey)));
    const unsubscribes = uniquePubkeys.map((pubkey) =>
        subscribe(pubkey, (profile) => callback(pubkey, profile)),
    );
    return () => {
        for (const unsubscribe of unsubscribes) {
            unsubscribe();
        }
    };
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
    subscribeProfiles,
};

export const profileMetadataCacheInternals = {
    ALLOWED_FUTURE_MARGIN_SEC,
    PROFILE_CACHE_BATCH_TIMEOUT_MS,
    PROFILE_CACHE_NEGATIVE_TTL_MS,
    PROFILE_CACHE_STALE_MS,
    PROFILE_CACHE_GC_MS,
    PROFILE_CACHE_NETWORK_PUBKEY_BATCH_SIZE,
    PROFILE_CACHE_NETWORK_CONCURRENCY,
    applyTierNetworkResult,
    resetForTests,
    getPendingProfileCountForTests: () => pendingByPubkey.size,
    getSubscriberCountForTests: () => subscribersByPubkey.size,
};
