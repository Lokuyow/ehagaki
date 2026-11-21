import { createRxBackwardReq, type RxNostr } from "rx-nostr";
import { nip19 } from "nostr-tools";
import { getHostReadRelayDefaults, isHostRelayConfigActive } from "./hostRelayRuntime";
import { profileMentionLabel, type ProfileMentionCandidate } from "./profileMention";
import { profileMetadataCache } from "./profileMetadataCache.svelte";
import { useRelayQuery, type RelayQuerySummary } from "./relay/query";
import { RelayConfigUtils } from "./relayConfigUtils";
import { BOOTSTRAP_RELAYS } from "./relayLists";
import { verifyRelatedEvent } from "./relatedEventVerification";
import { ehagakiDb, type EHagakiDB } from "./storage/ehagakiDb";
import { profilesRepository } from "./storage/profilesRepository";
import type { NostrEvent } from "./types";
import { isLowerHex64 } from "./utils/nostrHexUtils";

const PROFILE_BATCH_SIZE = 100;
const SUGGESTION_LIMIT = 8;

interface FollowedProfile {
    pubkey: string;
    relayHints: string[];
    petname: string;
}

export type FollowListUpdateResult = "updated" | "not-found" | "unavailable" | "cancelled";

function getFollowedProfiles(event: NostrEvent): FollowedProfile[] {
    const profiles = new Map<string, FollowedProfile>();
    for (const [key, pubkey, hint, petname] of event.tags) {
        if (key !== "p" || !isLowerHex64(pubkey) || profiles.has(pubkey)) continue;
        profiles.set(pubkey, {
            pubkey,
            relayHints: RelayConfigUtils.sanitizeExternalRelayUrls(hint ? [hint] : []),
            petname: petname ?? "",
        });
    }
    return [...profiles.values()];
}

function isNewer(candidate: NostrEvent, current: NostrEvent | null): boolean {
    return !current || candidate.created_at > current.created_at
        || (candidate.created_at === current.created_at && candidate.id < current.id);
}

function getFollowListRelays(runtime: RxNostr): string[] {
    if (isHostRelayConfigActive()) return getHostReadRelayDefaults();
    const defaults = Object.values(runtime.getDefaultRelays());
    return RelayConfigUtils.sanitizeExternalRelayUrls([
        ...defaults.filter(relay => relay.write).map(relay => relay.url),
        ...BOOTSTRAP_RELAYS,
        ...defaults.filter(relay => relay.read).map(relay => relay.url),
    ]);
}

function fetchFollowList(rxNostr: RxNostr, ownerPubkey: string, signal: AbortSignal) {
    const relays = getFollowListRelays(rxNostr);
    const until = Math.floor(Date.now() / 1_000);
    return new Promise<{ event: NostrEvent | null; complete: boolean }>(resolve => {
        if (signal.aborted || !relays.length) {
            resolve({ event: null, complete: false });
            return;
        }
        const request = createRxBackwardReq();
        let event: NostrEvent | null = null;
        let summary: RelayQuerySummary | undefined;
        const subscription = useRelayQuery(rxNostr, request, { on: { relays } }, {
            signal,
            quorum: false,
            onEnd: result => { summary = result; },
        }).subscribe({
            next: packet => {
                const candidate = packet.event;
                if (candidate.kind !== 3 || candidate.pubkey !== ownerPubkey
                    || candidate.created_at > until
                    || !isNewer(candidate, event)) return;
                const verified = verifyRelatedEvent(candidate);
                if (!verified) return;
                event = verified.event;
            },
            complete: () => resolve({ event, complete: summary?.complete === true }),
            error: () => resolve({ event, complete: false }),
        });
        if (!subscription.closed) {
            request.emit({ kinds: [3], authors: [ownerPubkey], until, limit: 1 });
            request.over();
        }
    });
}

function normalizeSearch(value: string): string {
    return value.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
}

export function createFollowListSession(
    rxNostr: RxNostr,
    ownerPubkey: string,
    signal: AbortSignal,
    db: EHagakiDB = ehagakiDb,
) {
    let eventId: string | undefined;
    let contacts: FollowedProfile[] = [];
    let update: { manual: boolean; promise: Promise<FollowListUpdateResult> } | undefined;
    let metadata: AbortController | undefined;
    signal.addEventListener("abort", () => {
        contacts = [];
        metadata?.abort();
    }, { once: true });

    function setContacts(event: NostrEvent | null): void {
        if (signal.aborted || eventId === event?.id) return;
        eventId = event?.id;
        contacts = event ? getFollowedProfiles(event) : [];
    }

    async function loadProfiles(refresh: boolean, fetchMissing: boolean): Promise<void> {
        metadata?.abort();
        metadata = new AbortController();
        const { signal: profileSignal } = metadata;
        const snapshot = contacts;
        for (let offset = 0; offset < snapshot.length && !profileSignal.aborted && !signal.aborted; offset += PROFILE_BATCH_SIZE) {
            const batch = snapshot.slice(offset, offset + PROFILE_BATCH_SIZE);
            const pubkeys = batch.map(contact => contact.pubkey);
            const cached = await profileMetadataCache.getCachedProfiles(pubkeys);
            if (profileSignal.aborted || signal.aborted) return;
            if (!fetchMissing) continue;

            const targets = batch.filter(contact => refresh || cached[contact.pubkey]?.nip05 === undefined);
            if (!targets.length) continue;
            const stored = refresh ? [] : await profilesRepository.bulkGetRecords(targets.map(contact => contact.pubkey));
            if (profileSignal.aborted || signal.aborted) return;
            // A batch is bounded and all publishing profiles are resolved via the shared cache.
            // Kind 3's relay hint is specific to the contact that supplied it.
            await profileMetadataCache.getProfiles(
                targets.filter((_, index) => refresh || stored[index]?.nip05 === undefined).map(contact => contact.pubkey),
                {
                    rxNostr,
                    signal: profileSignal,
                    forceRefresh: true,
                    allowBackgroundRefresh: false,
                    additionalRelays: isHostRelayConfigActive() ? getHostReadRelayDefaults() : undefined,
                    relayOptionsByPubkey: Object.fromEntries(targets.map(contact => [
                        contact.pubkey, { additionalRelays: contact.relayHints },
                    ])),
                },
            );
        }
    }

    function refresh(manual: boolean): Promise<FollowListUpdateResult> {
        if (update) return manual && !update.manual
            ? update.promise.then(() => refresh(true))
            : update.promise;
        const promise = (async (): Promise<FollowListUpdateResult> => {
            const cached = await db.followLists.get(ownerPubkey);
            if (signal.aborted) return "cancelled";
            setContacts(cached?.event ?? null);
            if (cached && !manual) {
                void loadProfiles(false, true).catch(() => undefined);
                return cached.event ? "updated" : "not-found";
            }
            if (cached?.event) void loadProfiles(false, false).catch(() => undefined);

            const result = await fetchFollowList(rxNostr, ownerPubkey, signal);
            if (signal.aborted) return "cancelled";
            if (!result.event && !result.complete) return "unavailable";
            const saved = await db.transaction("rw", db.followLists, async tx => {
                const current = await db.followLists.get(ownerPubkey);
                if (signal.aborted) return null;
                if (result.event ? isNewer(result.event, current?.event ?? null) : !current) {
                    await db.followLists.put({ ownerPubkey, event: result.event });
                    if (signal.aborted) tx.abort();
                    return result.event;
                }
                return current?.event ?? null;
            });
            if (signal.aborted) return "cancelled";
            setContacts(saved);
            if (saved) void loadProfiles(manual, true).catch(() => undefined);
            return result.event ? "updated" : "not-found";
        })().catch((): FollowListUpdateResult => signal.aborted ? "cancelled" : "unavailable")
            .finally(() => { update = undefined; });
        update = { manual, promise };
        return promise;
    }

    function getSuggestions(query: string): ProfileMentionCandidate[] {
        if (signal.aborted) return [];
        const normalized = normalizeSearch(query);
        if (!normalized) return [];
        const ranked: ProfileMentionCandidate[][] = [[], [], []];
        for (const contact of contacts) {
            const profile = profileMetadataCache.getReactiveEntry(contact.pubkey)?.profile;
            const npub = normalized.startsWith("npub") ? nip19.npubEncode(contact.pubkey) : undefined;
            const fields = [profile?.name, profile?.displayName, profile?.nip05, contact.petname, npub]
                .filter((field): field is string => Boolean(field)).map(normalizeSearch);
            const rank = fields.includes(normalized) ? 0
                : fields.some(field => field.startsWith(normalized)) ? 1
                : fields.some(field => field.includes(normalized)) ? 2 : -1;
            if (rank < 0 || ranked[rank]!.length >= SUGGESTION_LIMIT) continue;
            ranked[rank]!.push({
                pubkey: contact.pubkey,
                relayHints: contact.relayHints,
                label: profileMentionLabel(contact.pubkey, profile, contact.petname),
            });
            if (ranked[0]!.length === SUGGESTION_LIMIT) break;
        }
        return ranked.flat().slice(0, SUGGESTION_LIMIT);
    }

    return { ownerPubkey, refresh, getSuggestions };
}
