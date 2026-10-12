import "fake-indexeddb/auto";
import Dexie from "dexie";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import type { RxNostr } from "rx-nostr";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { DexiePostHistoryRelayCoverageRepository } from "../../lib/storage/postHistoryRelayCoverageRepository";
import { PostHistoryRelayFullScanService } from "../../lib/postHistoryRelayFullScanService";
import { persistPostHistoryAuthoredBatch } from "../../lib/postHistoryAuthoredFetchPersistence";
import { postHistoryLocalRelayService } from "../../lib/postHistoryLocalRelayService";
import { createAuthoredFetchResult } from "../postHistorySyncResultTestUtils";

const databases = new Set<EHagakiDB>();
afterEach(async () => {
    vi.restoreAllMocks();
    for (const db of databases) { db.close(); await Dexie.delete(db.name); } databases.clear();
});
function setup() {
    const db = new EHagakiDB(`full-scan-persistence-${crypto.randomUUID()}`); databases.add(db);
    const repository = new DexiePostHistoryRepository(db);
    const coverage = new DexiePostHistoryRelayCoverageRepository(db);
    const event = finalizeEvent({ kind: 1, created_at: 50, content: "synthetic full scan", tags: [] }, generateSecretKey());
    const relayUrl = "wss://scan.example/"; const relayConfig = { [relayUrl]: { read: true, write: true } };
    const runtime = {} as RxNostr;
    let release!: () => void;
    const service = new PostHistoryRelayFullScanService({ now: () => 100_000, options: { windowSeconds: 101 },
        createScope: async (input) => ({ ownerPubkeyHex: event.pubkey, kindsKey: input.kinds.join(","),
            expectedRevision: await coverage.getLocalRevision(event.pubkey), isActive: input.isActive }),
        fetchRelayPage: () => ({ promise: new Promise((resolve) => { release = () => resolve(createAuthoredFetchResult(event, {
            events: [{ event, relayUrls: [relayUrl] }], rawCount: 1, oldestCreatedAt: 50,
            relayOutcomes: [{ relayUrl, eoseReceived: true, verificationDrained: true, termination: "eose", rawCount: 1, oldestCreatedAt: 50, saturated: false }],
            page: { subscriptionId: "scan:0", hints: ["finish"], authRequired: false, authAutoResent: false, bufferLimited: false },
        })); }), cancel: () => release?.() }),
        persistBatch: (events, at, ranges, scope) => persistPostHistoryAuthoredBatch(events, at, ranges, scope, repository),
    });
    const task = service.start({ ownerPubkeyHex: event.pubkey, rxNostr: runtime, relayConfig,
        getCurrentScope: () => ({ ownerPubkeyHex: event.pubkey, rxNostr: runtime, relayConfig }) });
    return { db, repository, coverage, event, relayUrl, task, release: () => release(), ready: () => !!release };
}
describe("full scan persistence in IndexedDB", () => {
    it("completes external persistence without awaiting a pending local archive", async () => {
        const archive = vi.spyOn(postHistoryLocalRelayService, "archiveAdoptedAuthored")
            .mockReturnValue(new Promise<void>(() => undefined));
        const h = setup(); await vi.waitFor(() => expect(h.ready()).toBe(true));
        h.release();
        expect((await h.task.promise).status).toBe("completed");
        expect(await h.db.postHistory.count()).toBe(1);
        expect(archive).toHaveBeenCalledOnce();
    });
    it("shares upsert with ordinary synchronization and keeps provenance", async () => {
        const h = setup(); await vi.waitFor(() => expect(h.ready()).toBe(true));
        const ordinary = h.repository.upsertFetchedEvents({ events: [{ event: h.event, relayUrls: ["wss://ordinary.example/"] }] });
        h.release(); await ordinary;
        expect((await h.task.promise).status).toBe("completed");
        expect(await h.db.postHistory.count()).toBe(1);
        expect((await h.repository.getByEventId(h.event.id))?.fetchedRelays).toEqual(expect.arrayContaining([h.relayUrl, "wss://ordinary.example/"]));
        expect((await h.coverage.get(h.event.pubkey, "1,6,16,42,1111")).relays[0].ranges).toEqual([{ since: 0, until: 100 }]);
    });
    it("cannot repopulate history after deletion changed the local revision", async () => {
        const h = setup(); await vi.waitFor(() => expect(h.ready()).toBe(true));
        await h.repository.deleteLocalHistoryForPubkey(h.event.pubkey); h.release();
        expect((await h.task.promise).status).toBe("stale-cancelled"); expect(await h.db.postHistory.count()).toBe(0);
        expect((await h.coverage.get(h.event.pubkey, "1,6,16,42,1111")).relays).toEqual([]);
    });
    it("rolls back event and coverage when cancellation occurs inside the transaction", async () => {
        const h = setup(); await vi.waitFor(() => expect(h.ready()).toBe(true));
        const put = h.db.postHistory.bulkPut.bind(h.db.postHistory);
        vi.spyOn(h.db.postHistory, "bulkPut").mockImplementation((...args: Parameters<typeof put>) => {
            h.task.cancel(); return put(...args);
        });
        h.release(); expect((await h.task.promise).status).toBe("cancelled");
        expect(await h.db.postHistory.count()).toBe(0);
        expect((await h.coverage.get(h.event.pubkey, "1,6,16,42,1111")).relays).toEqual([]);
    });
    it("does not record coverage after an IndexedDB failure", async () => {
        const h = setup(); await vi.waitFor(() => expect(h.ready()).toBe(true));
        vi.spyOn(h.db.postHistory, "bulkPut").mockRejectedValueOnce(new Error("synthetic storage failure"));
        h.release(); expect((await h.task.promise).status).toBe("failed");
        expect(await h.db.postHistory.count()).toBe(0);
        expect((await h.coverage.get(h.event.pubkey, "1,6,16,42,1111")).relays).toEqual([]);
    });
});
