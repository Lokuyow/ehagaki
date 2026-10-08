import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { DexiePostHistoryRelayCoverageRepository, type PostHistoryCoverageWrite } from "../../lib/storage/postHistoryRelayCoverageRepository";
import { getPostHistorySearchRevision } from "../../lib/postHistoryLocalSearchRevision";

const databases = new Set<EHagakiDB>();
const event = finalizeEvent({ kind: 1, created_at: 100, content: "coverage fixture", tags: [] }, generateSecretKey());
const relayUrl = "wss://relay.example.com/";
function setup() {
    const db = new EHagakiDB(`history-coverage-test-${crypto.randomUUID()}`);
    databases.add(db);
    const repository = new DexiePostHistoryRepository(db);
    const coverage = new DexiePostHistoryRelayCoverageRepository(db);
    const write: PostHistoryCoverageWrite = { ownerPubkeyHex: event.pubkey, kindsKey: "1,42,1111",
        relays: [{ relayUrl, ranges: [{ since: 10, until: 200 }] }], expectedRevision: 0, isActive: () => true };
    const save = (input = write) => repository.upsertFetchedEvents({ events: [{ event, relayUrls: [relayUrl] }], relayFetchCoverage: input });
    return { db, repository, coverage, write, save };
}
afterEach(async () => {
    vi.restoreAllMocks();
    for (const db of databases) { db.close(); await Dexie.delete(db.name); }
    databases.clear();
});

describe("persisted authored relay query coverage", () => {
    it("commits events before coverage and retains evidence across reopening", async () => {
        const h = setup();
        await h.save();
        expect(await h.db.postHistory.count()).toBe(1);
        h.db.close(); await h.db.open();
        expect((await h.coverage.get(event.pubkey, h.write.kindsKey)).relays).toEqual(h.write.relays);
        await h.save();
        expect(await h.db.postHistory.count()).toBe(1);
        expect((await h.coverage.get(event.pubkey, h.write.kindsKey)).relays).toEqual(h.write.relays);
    });
    it("records bounded zero-event EOSE evidence without requiring a post", async () => {
        const h = setup();
        await h.repository.upsertFetchedEvents({ events: [], relayFetchCoverage: h.write });
        expect(await h.db.postHistory.count()).toBe(0);
        expect((await h.coverage.get(event.pubkey, h.write.kindsKey)).relays).toEqual(h.write.relays);
    });
    it("never synthesizes evidence from legacy posts, visible boundaries or jump anchors", async () => {
        const h = setup();
        await h.repository.upsertFetchedEvents({ events: [{ event }] });
        await h.db.meta.bulkPut([
            { key: `postHistoryVisibleRange:${event.pubkey}:1,42,1111`, value: { visibleUntil: 0 }, updatedAt: 1 },
            { key: `postHistoryJumpCacheAnchors:${event.pubkey}`, value: { anchors: [{ centerCreatedAt: 100, radiusSec: 200 }] }, updatedAt: 1 },
        ]);
        expect((await h.coverage.get(event.pubkey, h.write.kindsKey)).relays).toEqual([]);
    });
    it.each(["event", "coverage"])("rolls back both data and post-commit search revision after %s persistence failure", async (failure) => {
        const h = setup();
        const revision = getPostHistorySearchRevision(event.pubkey);
        if (failure === "event") vi.spyOn(h.db.postHistory, "bulkPut").mockRejectedValueOnce(new Error("synthetic storage failure"));
        else vi.spyOn(h.db.meta, "put").mockRejectedValueOnce(new Error("synthetic storage failure"));
        await expect(h.save()).rejects.toThrow("synthetic storage failure");
        expect(await h.db.postHistory.count()).toBe(0);
        expect((await h.coverage.get(event.pubkey, h.write.kindsKey)).relays).toEqual([]);
        expect(getPostHistorySearchRevision(event.pubkey)).toBe(revision);
    });
    it("merges concurrent writers without sharing accounts or kind sets", async () => {
        const h = setup();
        await Promise.all([
            h.save(), h.save({ ...h.write, relays: [{ relayUrl, ranges: [{ since: 201, until: 300 }] }] }),
            h.save({ ...h.write, kindsKey: "1", relays: [{ relayUrl, ranges: [{ since: 1, until: 5 }] }] }),
        ]);
        expect((await h.coverage.get(event.pubkey, h.write.kindsKey)).relays).toEqual([{ relayUrl, ranges: [{ since: 10, until: 300 }] }]);
        expect((await h.coverage.get(event.pubkey, "1")).relays[0].ranges).toEqual([{ since: 1, until: 5 }]);
        expect((await h.coverage.get("other-owner", "1")).relays).toEqual([]);
    });
    it("deletion removes all owner coverage and legacy metadata, even when posts are empty", async () => {
        const h = setup();
        await h.repository.upsertFetchedEvents({ events: [], relayFetchCoverage: h.write });
        await h.db.meta.bulkPut([
            { key: `postHistoryVisibleRange:${event.pubkey}:1`, value: {}, updatedAt: 1 },
            { key: `postHistoryJumpCacheAnchors:${event.pubkey}`, value: {}, updatedAt: 1 },
            { key: "postHistoryRelayCoverage:other-owner:1", value: {}, updatedAt: 1 },
        ]);
        await h.repository.deleteLocalHistoryForPubkey(event.pubkey);
        expect((await h.coverage.get(event.pubkey, h.write.kindsKey)).relays).toEqual([]);
        expect(await h.coverage.getLocalRevision(event.pubkey)).toBe(1);
        expect(await h.db.meta.get(`postHistoryVisibleRange:${event.pubkey}:1`)).toBeUndefined();
        expect(await h.db.meta.get(`postHistoryJumpCacheAnchors:${event.pubkey}`)).toBeUndefined();
        expect(await h.db.meta.get("postHistoryRelayCoverage:other-owner:1")).toBeDefined();
        expect((await h.save()).applied).toBe(false);
        expect(await h.db.postHistory.count()).toBe(0);
    });
    it("a second connection cannot restore a pre-delete fetch", async () => {
        const h = setup(); await h.save();
        const second = new EHagakiDB(h.db.name); databases.add(second);
        await new DexiePostHistoryRepository(second).deleteLocalHistoryForPubkey(event.pubkey);
        expect((await h.save()).applied).toBe(false);
        expect(await h.db.postHistory.count()).toBe(0);
    });
    it("rolls back an operation invalidated during event persistence", async () => {
        const h = setup(); let active = true;
        const original = h.db.postHistory.bulkPut.bind(h.db.postHistory);
        vi.spyOn(h.db.postHistory, "bulkPut").mockImplementation(((...args: any[]) => {
            active = false;
            return original(...args as [any]);
        }) as any);
        expect((await h.save({ ...h.write, isActive: () => active })).applied).toBe(false);
        expect(await h.db.postHistory.count()).toBe(0);
        expect((await h.coverage.get(event.pubkey, h.write.kindsKey)).relays).toEqual([]);
    });
});
