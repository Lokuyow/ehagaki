import { finalizeEvent, getPublicKey } from "nostr-tools";
import type { RxNostr, RxReq } from "rx-nostr";
import { Subject } from "rxjs";
import type { NostrEvent } from "../../lib/types";
import { postHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { ehagakiDb } from "../../lib/storage/ehagakiDb";
import { postHistoryRelayCoverageRepository } from "../../lib/storage/postHistoryRelayCoverageRepository";

const fixtureKeyPrefix = "post-history-coverage-signed-fixture";
type Fixture = { owner: string; events: NostrEvent[]; farOlder: NostrEvent };
const relayUrls = Array.from({ length: 5 }, (_, i) => `wss://coverage-${i}.example.test/`);

/** Only public data and signed events survive reload; no signing key is stored. */
export function createPostHistoryCoverageHarness(secret: Uint8Array, scenario: "gap" | "empty-gap" | "new-head" = "gap") {
    const fixtureKey = `${fixtureKeyPrefix}:${scenario}`;
    const stored = sessionStorage.getItem(fixtureKey);
    const fixture: Fixture = stored ? JSON.parse(stored) : (() => {
        const base = Math.floor(Date.now() / 1000) - 60;
        const owner = getPublicKey(secret);
        const events = Array.from({ length: 310 }, (_, i) => finalizeEvent({
            kind: 1, tags: [], content: `coverage post ${i}`, created_at: base - i * 60,
        }, secret));
        const farOlder = finalizeEvent({ kind: 1, tags: [], content: "coverage next saved area", created_at: base - 2000 * 60 }, secret);
        return { owner, events, farOlder };
    })();
    if (!stored) sessionStorage.setItem(fixtureKey, JSON.stringify(fixture));
    const messages = new Subject<any>();
    const errors = new Subject<any>();
    const connections = new Subject<any>();
    const pending: (() => void)[] = [];
    const control = { owner: fixture.owner, eventIds: fixture.events.map((event) => event.id), headRequests: 0,
        olderRequests: [] as { relayUrl: string; since: number; until: number }[],
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
                const older = authored && filter.since !== undefined && filter.until !== undefined && filter.limit === 150;
                if (authored && filter.since === undefined) control.headRequests += 1;
                const complete = () => {
                    if (relayUrls.indexOf(relayUrl) >= 3) {
                        errors.next({ from: relayUrl }); stream.complete(); return;
                    }
                    const candidates = older ? (scenario === "empty-gap" ? [] : fixture.events.slice(100, 110))
                        : scenario === "new-head" && authored && filter.since === undefined
                            ? fixture.events.slice(relayUrls.indexOf(relayUrl) * 20, (relayUrls.indexOf(relayUrl) + 1) * 20) : [];
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
                if (older) {
                    control.olderRequests.push({ relayUrl, since: filter.since!, until: filter.until! });
                    pending.push(complete);
                } else queueMicrotask(complete);
            });
            return stream;
        },
    } as unknown as RxNostr;
    return { rxNostr, control, relayConfig: Object.fromEntries(relayUrls.map((url) => [url, { read: true, write: true }])),
        initialize: async () => {
            if (stored) return;
            await postHistoryRepository.deleteLocalHistoryForPubkey(fixture.owner);
            const savedEvents = scenario === "new-head" ? fixture.events.slice(60)
                : [...fixture.events.slice(0, 100), ...fixture.events.slice(110)];
            await ehagakiDb.postHistory.bulkPut([...savedEvents, fixture.farOlder].map((event) => ({
                id: event.id, eventId: event.id, pubkeyHex: fixture.owner, kind: event.kind, content: event.content,
                tags: event.tags, createdAt: event.created_at, postedAt: event.created_at * 1000,
                relayHints: [], acceptedRelays: [], media: [], rawEvent: event, updatedAt: Date.now(), schemaVersion: 2,
            })));
            const expectedRevision = await postHistoryRelayCoverageRepository.getLocalRevision(fixture.owner);
            await ehagakiDb.transaction("rw", ehagakiDb.meta, async () => { await postHistoryRelayCoverageRepository.record({
                ownerPubkeyHex: fixture.owner, kindsKey: "1,42,1111", expectedRevision, isActive: () => true,
                relays: relayUrls.map((relayUrl) => ({ relayUrl, ranges: scenario === "new-head"
                    ? [{ since: fixture.events[309].created_at, until: fixture.events[60].created_at }]
                    : [
                        { since: fixture.events[99].created_at, until: fixture.events[0].created_at },
                        { since: fixture.events[309].created_at, until: fixture.events[110].created_at },
                    ] })),
            }); });
        } };
}
