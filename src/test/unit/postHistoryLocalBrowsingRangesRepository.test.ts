import "fake-indexeddb/auto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { DexiePostHistoryLocalBrowsingRangesRepository, type PostHistoryLocalBrowsingWrite } from "../../lib/storage/postHistoryLocalBrowsingRangesRepository";
import { DexiePostHistoryRelayCoverageRepository } from "../../lib/storage/postHistoryRelayCoverageRepository";
import { DexiePostHistoryImportedRangesRepository } from "../../lib/storage/postHistoryImportedRangesRepository";

const databases = new Set<EHagakiDB>();
const event = finalizeEvent({ kind: 1, created_at: 100, tags: [], content: "local browsing fixture" }, generateSecretKey());
const url = "ws://127.0.0.1:4869/";
function setup() {
    const db = new EHagakiDB(`local-browsing-${crypto.randomUUID()}`); databases.add(db);
    const repository = new DexiePostHistoryRepository(db), local = new DexiePostHistoryLocalBrowsingRangesRepository(db);
    const write: PostHistoryLocalBrowsingWrite = { ownerPubkeyHex: event.pubkey, kindsKey: "1,6,16,42,1111",
        localRelayUrl: url, expectedRevision: 0, isActive: () => true,
        browsingRanges: [{ since: 100, until: 200 }], resumeHint: { nextUntil: 100 } };
    const save = (input = write, events = [{ event }]) => repository.upsertFetchedEvents({ events, localBrowsingWrite: input });
    const get = () => local.get(event.pubkey, write.kindsKey, url);
    return { db, repository, local, write, save, get };
}
afterEach(async () => { vi.restoreAllMocks(); for (const db of databases) await db.delete(); databases.clear(); });

describe("persistent local browsing evidence", () => {
    it("atomically retains events and positive evidence across reopening without external or restored provenance", async () => {
        const h = setup(); await h.save(); h.db.close(); await h.db.open();
        expect(await h.db.postHistory.count()).toBe(1);
        expect(await h.get()).toMatchObject({ browsingRanges: h.write.browsingRanges, resumeHint: { nextUntil: 100 } });
        expect((await new DexiePostHistoryRelayCoverageRepository(h.db).get(event.pubkey, h.write.kindsKey)).relays).toEqual([]);
        expect((await new DexiePostHistoryImportedRangesRepository(h.db).get(event.pubkey, h.write.kindsKey)).ranges).toEqual([]);
        const row = await h.repository.getByEventId(event.id);
        expect([...(row?.acceptedRelays ?? []), ...(row?.fetchedRelays ?? []), ...(row?.relayHints ?? [])]).not.toContain(url);
        const evidence = (await h.db.postHistoryLocalBrowsingRanges.toArray())[0]?.value as Record<string, unknown>;
        const cursor = (await h.db.postHistoryLocalResumeCursor.toArray())[0]?.value;
        expect(Object.keys(evidence).sort()).toEqual(["schemaVersion", "source", "ownerPubkeyHex", "kindsKey", "localRelayUrl", "localRevision", "browsingRanges"].sort());
        expect(cursor).toEqual({ nextUntil: 100 });
    });
    it("updates duplicate-only and bounded empty page evidence", async () => {
        const h = setup(); await h.save();
        const result = await h.save({ ...h.write, browsingRanges: [{ since: 80, until: 100 }], resumeHint: { nextUntil: 80 } });
        expect(result.insertedCount).toBe(0); expect(result.updatedCount).toBe(0);
        await h.save({ ...h.write, browsingRanges: [{ since: 50, until: 79 }], resumeHint: { nextUntil: 80 } }, []);
        expect((await h.get()).browsingRanges).toEqual([{ since: 50, until: 200 }]);
        expect(await h.db.postHistory.count()).toBe(1);
    });
    it("keeps resume hints separate from ranges and does not rewind them on head refresh", async () => {
        const h = setup(); await h.save();
        await h.save({ ...h.write, browsingRanges: [], resumeHint: { nextUntil: 30 } }, []);
        await h.save({ ...h.write, initializeResumeHintOnly: true }, []);
        expect(await h.get()).toMatchObject({ browsingRanges: [{ since: 100, until: 200 }], resumeHint: { nextUntil: 30 } });
        await h.save({ ...h.write, resumeHint: undefined, browsingRanges: [] }, []);
        expect((await h.get()).resumeHint).toEqual({ nextUntil: 30 });
    });
    it("scopes normalized URLs, owners, kinds and revisions without synthesizing evidence from rows", async () => {
        const h = setup(); await h.repository.upsertFetchedEvents({ events: [{ event }] });
        expect((await h.get()).browsingRanges).toEqual([]); await h.save();
        expect((await h.local.get(event.pubkey, h.write.kindsKey, " WS://127.0.0.1:4869 ")).browsingRanges).toEqual(h.write.browsingRanges);
        for (const [owner, kinds, target] of [["other", h.write.kindsKey, url], [event.pubkey, "1", url], [event.pubkey, h.write.kindsKey, "ws://127.0.0.1:4870/"]]) {
            expect((await h.local.get(owner, kinds, target)).browsingRanges).toEqual([]);
        }
        await h.db.postHistoryWriteGeneration.put({ id: event.pubkey, value: 1, updatedAt: 1 });
        expect((await h.get()).browsingRanges).toEqual([]);
        expect((await h.save()).applied).toBe(false);
    });
    it.each(["event", "evidence"])("rolls back event and evidence after %s persistence failure", async failure => {
        const h = setup();
        if (failure === "event") vi.spyOn(h.db.postHistory, "bulkPut").mockRejectedValueOnce(new Error("synthetic failure"));
        else vi.spyOn(h.db.postHistoryLocalBrowsingRanges, "put").mockRejectedValueOnce(new Error("synthetic failure"));
        await expect(h.save()).rejects.toThrow("synthetic failure");
        expect(await h.db.postHistory.count()).toBe(0); expect((await h.get()).browsingRanges).toEqual([]);
    });
    it("rejects cancellation during persistence and commits neither events nor evidence", async () => {
        const h = setup(); let active = true; const original = h.db.postHistory.bulkPut.bind(h.db.postHistory);
        vi.spyOn(h.db.postHistory, "bulkPut").mockImplementation(((...args: any[]) => {
            active = false; return original(...args as [any]);
        }) as any);
        expect((await h.save({ ...h.write, isActive: () => active })).applied).toBe(false);
        expect(await h.db.postHistory.count()).toBe(0); expect((await h.get()).browsingRanges).toEqual([]);
    });
    it("clears all local URL records with events and invalidates a second connection's old write", async () => {
        const h = setup(); await h.save(); await h.save({ ...h.write, localRelayUrl: "ws://127.0.0.1:4870/" });
        await h.save({ ...h.write, ownerPubkeyHex: "other" }, []);
        const second = new EHagakiDB(h.db.name); databases.add(second);
        await new DexiePostHistoryRepository(second).deleteLocalHistoryForPubkey(event.pubkey);
        expect(await h.db.postHistory.count()).toBe(0); expect((await h.get()).browsingRanges).toEqual([]);
        expect((await h.local.get(event.pubkey, h.write.kindsKey, "ws://127.0.0.1:4870/")).browsingRanges).toEqual([]);
        expect((await h.local.get("other", h.write.kindsKey, url)).browsingRanges).toEqual(h.write.browsingRanges);
        expect((await h.save()).applied).toBe(false);
    });
    it("rolls back history deletion if evidence removal fails", async () => {
        const h = setup(); await h.save();
        vi.spyOn(h.db.postHistoryLocalBrowsingRanges, "where").mockImplementation(() => {
            throw new Error("synthetic clear failure");
        });
        await expect(h.repository.deleteLocalHistoryForPubkey(event.pubkey)).rejects.toThrow("synthetic clear failure");
        expect(await h.db.postHistory.count()).toBe(1); expect((await h.get()).browsingRanges).toEqual(h.write.browsingRanges);
    });
});
