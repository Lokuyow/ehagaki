import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import type { RxNostr, RxReq } from "rx-nostr";
import { Subject } from "rxjs";
import type { NostrEvent } from "../../lib/types";
import { postHistoryRepository, DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { ehagakiDb, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { postHistoryRelayCoverageRepository } from "../../lib/storage/postHistoryRelayCoverageRepository";
import { buildPostHistoryVisibleKindsKey } from "../../lib/storage/postHistoryVisibleRangeRepository";
import { POST_HISTORY_FETCH_KINDS } from "../../lib/postHistoryRelayFetchService";
import { postHistoryImportedRangesRepository, DexiePostHistoryImportedRangesRepository } from "../../lib/storage/postHistoryImportedRangesRepository";
import { getPostHistoryLocalRevision } from "../../lib/storage/postHistoryLocalWriteScope";
import { PostHistoryJsonlImportService } from "../../lib/postHistoryJsonlImportService";

const fixtureKeyPrefix = "post-history-coverage-signed-fixture";
type Fixture = { owner: string; events: NostrEvent[]; farOlder: NostrEvent; localPost: NostrEvent; otherAccountPost: NostrEvent; futurePost: NostrEvent };
const relayUrls = Array.from({ length: 5 }, (_, i) => `wss://coverage-${i}.example.test/`);
const kindsKey = buildPostHistoryVisibleKindsKey([...POST_HISTORY_FETCH_KINDS]);

/** Only public data and signed events survive reload; no signing key is stored. */
export function createPostHistoryCoverageHarness(secret: Uint8Array, scenario: "gap" | "empty-gap" | "new-head" | "sync-footer" | "bounded-gap" | "citrine" | "citrine-gap" | "citrine-head" = "gap") {
    const isCitrine = scenario.startsWith("citrine");
    const isHeadScenario = scenario === "new-head" || scenario === "sync-footer" || scenario === "citrine-head";
    const savedHeadEnd = scenario === "sync-footer" ? 109 : 309;
    const gapStart = scenario === "bounded-gap" ? 150 : 100;
    const gapEnd = gapStart + 10;
    const fixtureKey = `${fixtureKeyPrefix}:${scenario}`;
    const stored = sessionStorage.getItem(fixtureKey);
    const fixture: Fixture = stored ? JSON.parse(stored) : (() => {
        const base = Math.floor(Date.now() / 1000) - 60;
        const owner = getPublicKey(secret);
        const events = Array.from({ length: 310 }, (_, i) => finalizeEvent({
            kind: 1, tags: [], content: `coverage post ${i}`, created_at: base - i * 60,
        }, secret));
        const farOlder = finalizeEvent({ kind: 1, tags: [], content: "coverage next saved area", created_at: base - 2000 * 60 }, secret);
        const localPost = finalizeEvent({ kind: 1, tags: [], content: "coverage local post", created_at: base + 1 }, secret);
        const otherAccountPost = finalizeEvent({ kind: 1, tags: [], content: "other account saved post", created_at: base }, generateSecretKey());
        const futurePost = finalizeEvent({ kind: 1, tags: [], content: "coverage future post", created_at: base + 365 * 86400 }, secret);
        return { owner, events, farOlder, localPost, otherAccountPost, futurePost };
    })();
    if (!stored) sessionStorage.setItem(fixtureKey, JSON.stringify(fixture));
    const messages = new Subject<any>();
    const errors = new Subject<any>();
    const connections = new Subject<any>();
    const pending: (() => void)[] = [];
    const preparation = { hold: false, entered: false, checks: 0, coveredGapReads: 0, release: null as (() => void) | null };
    let localPosted = false;
    const control = { owner: fixture.owner, eventIds: fixture.events.map((event) => event.id), headRequests: 0,
        backupJsonl: fixture.events.slice(scenario === "citrine-gap" ? 110 : 60).map((event) => JSON.stringify(event)).join("\n") + "\n",
        backupRange: { since: fixture.events[309].created_at, until: fixture.events[scenario === "citrine-gap" ? 110 : 60].created_at },
        futurePostJsonl: JSON.stringify(fixture.futurePost) + "\n",
        readFuturePost: () => ehagakiDb.postHistory.get(fixture.futurePost.id),
        importFromSecondConnection: async () => {
            const second = new EHagakiDB(ehagakiDb.name);
            try {
                return await new PostHistoryJsonlImportService({
                    postHistoryRepository: new DexiePostHistoryRepository(second),
                    importedRangesRepository: new DexiePostHistoryImportedRangesRepository(second),
                    getLocalRevision: (owner) => getPostHistoryLocalRevision(second, owner),
                }).importFile({ ownerPubkeyHex: fixture.owner, getCurrentPubkeyHex: () => fixture.owner,
                    // Keep this test about publication during an active query;
                    // a large signature batch can outlast its normal 6s timeout.
                    file: new File([fixture.events[60], fixture.events[309]].map((event) => JSON.stringify(event) + "\n"), `citrine-${Date.now()}.jsonl`) });
            } finally { second.close(); }
        },
        readRestoredRanges: async () => (await postHistoryImportedRangesRepository.get(fixture.owner, kindsKey)).ranges,
        readSavedCount: () => postHistoryRepository.countForPubkey(fixture.owner),
        readOtherAccountSavedCount: () => postHistoryRepository.countForPubkey(fixture.otherAccountPost.pubkey),
        removeOtherAccountHistory: () => postHistoryRepository.deleteLocalHistoryForPubkey(fixture.otherAccountPost.pubkey),
        authoredRequests: [] as { since?: number; until?: number; limit?: number }[],
        preparation,
        coverGap: async () => {
            const expectedRevision = await postHistoryRelayCoverageRepository.getLocalRevision(fixture.owner);
            await ehagakiDb.transaction("rw", ehagakiDb.meta, async () => postHistoryRelayCoverageRepository.record({
                ownerPubkeyHex: fixture.owner, kindsKey, expectedRevision, isActive: () => true,
                relays: relayUrls.map((relayUrl) => ({ relayUrl, ranges: [{
                    since: fixture.events[gapEnd].created_at, until: fixture.events[gapStart - 1].created_at,
                }] })),
            }));
        },
        olderRequests: [] as { relayUrl: string; since: number; until: number }[],
        catchupRequests: [] as { relayUrl: string; since: number; until: number }[],
        postLocal: async () => {
            await postHistoryRepository.putPostedEvent({ event: fixture.localPost, acceptedRelays: [], relayHints: [] });
            localPosted = true;
            return fixture.localPost.id;
        },
        release: () => { for (const complete of pending.splice(0)) complete(); } };
    const rxNostr = {
        createAllMessageObservable: () => messages,
        createAllErrorObservable: () => errors,
        createConnectionStateObservable: () => connections,
        use: (req: RxReq, options: any) => {
            const stream = new Subject<any>();
            const relayUrl = options?.on?.relays?.[0];
            const subId = `${req.rxReqId}:0`;
            req.getReqPacketObservable().subscribe(({ filters }) => {
                const filter = filters[0] as { authors?: string[]; kinds?: number[]; since?: number; until?: number; limit?: number };
                if (!filter || !relayUrl) return;
                const authored = filter.authors?.includes(fixture.owner) && filter.kinds?.includes(1);
                if (authored) control.authoredRequests.push({ since: filter.since, until: filter.until, limit: filter.limit });
                const latestSavedTimestamp = fixture.events[isHeadScenario ? 60 : 0].created_at;
                const catchup = authored && filter.limit === 150 && filter.since !== undefined
                    && (scenario === "citrine-head" || filter.since >= latestSavedTimestamp);
                const older = authored && !catchup && filter.since !== undefined && filter.until !== undefined && filter.limit === 150;
                if (authored && filter.limit === 30) control.headRequests += 1;
                const complete = () => {
                    if (relayUrls.indexOf(relayUrl) >= 3) {
                        errors.next({ from: relayUrl }); stream.complete(); return;
                    }
                    const candidates = older ? (scenario === "empty-gap" ? [] : fixture.events.slice(gapStart, gapEnd))
                        : isHeadScenario && authored ? fixture.events.slice(0, 60)
                            : authored && localPosted ? [fixture.localPost] : [];
                    const events = candidates.filter((event) =>
                        (filter.since === undefined || event.created_at >= filter.since)
                        && (filter.until === undefined || event.created_at <= filter.until),
                    ).slice(0, filter.limit);
                    for (const event of events) {
                        messages.next({ type: "EVENT", from: relayUrl, subId, message: ["EVENT", subId, event] });
                        stream.next({ from: relayUrl, event });
                    }
                    // Exercise rx-nostr's auto-close ordering after verification has drained.
                    stream.complete();
                    messages.next({ type: "EOSE", from: relayUrl, subId, message: ["EOSE", subId] });
                };
                if (older || catchup) {
                    (catchup ? control.catchupRequests : control.olderRequests)
                        .push({ relayUrl, since: filter.since!, until: filter.until! });
                    pending.push(complete);
                } else queueMicrotask(complete);
            });
            return stream;
        },
    } as unknown as RxNostr;
    return { rxNostr, control, relayConfig: Object.fromEntries(relayUrls.map((url) => [url, { read: true, write: true }])),
        initialize: async () => {
            const getCoverage = postHistoryRelayCoverageRepository.get.bind(postHistoryRelayCoverageRepository);
            postHistoryRelayCoverageRepository.get = async (owner, key) => {
                const record = await getCoverage(owner, key);
                if (owner === fixture.owner && record.relays.some((relay) => relay.ranges.some((range) =>
                    range.since <= fixture.events[gapEnd].created_at && range.until >= fixture.events[gapStart - 1].created_at))) {
                    preparation.coveredGapReads += 1;
                }
                return record;
            };
            const hasOlderVisiblePosts = postHistoryRepository.hasOlderVisiblePosts.bind(postHistoryRepository);
            postHistoryRepository.hasOlderVisiblePosts = async (options) => {
                if (options.pubkeyHex === fixture.owner) {
                    preparation.checks += 1;
                    if (preparation.hold) {
                        preparation.hold = false;
                        preparation.entered = true;
                        await new Promise<void>((resolve) => { preparation.release = resolve; });
                        preparation.release = null;
                    }
                }
                return hasOlderVisiblePosts(options);
            };
            if (stored) return;
            await postHistoryRepository.deleteLocalHistoryForPubkey(fixture.owner);
            const savedEvents = isCitrine ? (isHeadScenario ? fixture.events.slice(60, 110) : fixture.events.slice(0, scenario === "citrine-gap" ? 100 : 60))
                : isHeadScenario ? fixture.events.slice(60, savedHeadEnd + 1)
                : [...fixture.events.slice(0, gapStart), ...fixture.events.slice(gapEnd)];
            await ehagakiDb.postHistory.bulkPut([...savedEvents, fixture.farOlder, ...(isCitrine ? [fixture.otherAccountPost] : [])].map((event) => ({
                id: event.id, eventId: event.id, pubkeyHex: event.pubkey, kind: event.kind, content: event.content,
                tags: event.tags, createdAt: event.created_at, postedAt: event.created_at * 1000,
                relayHints: [], acceptedRelays: [], media: [], rawEvent: event, updatedAt: Date.now(), schemaVersion: 2,
            })));
            const expectedRevision = await postHistoryRelayCoverageRepository.getLocalRevision(fixture.owner);
            await ehagakiDb.transaction("rw", ehagakiDb.meta, async () => { await postHistoryRelayCoverageRepository.record({
                ownerPubkeyHex: fixture.owner, kindsKey, expectedRevision, isActive: () => true,
                relays: relayUrls.map((relayUrl) => ({ relayUrl, ranges: isCitrine
                    ? (isHeadScenario ? [{ since: fixture.farOlder.created_at, until: fixture.farOlder.created_at }]
                        : [{ since: scenario === "citrine-gap" ? fixture.events[99].created_at : fixture.events[60].created_at + 1, until: fixture.events[0].created_at }])
                    : isHeadScenario
                    ? [{ since: fixture.events[savedHeadEnd].created_at, until: fixture.events[60].created_at }]
                    : [
                        { since: fixture.events[gapStart - 1].created_at, until: fixture.events[0].created_at },
                        { since: fixture.events[309].created_at, until: fixture.events[gapEnd].created_at },
                    ] })),
            }); });
        } };
}
