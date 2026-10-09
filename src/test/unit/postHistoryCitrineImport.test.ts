import "fake-indexeddb/auto";
import Dexie from "dexie";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PostHistoryJsonlImportService } from "../../lib/postHistoryJsonlImportService";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { DexiePostHistoryDeletionRequestsRepository } from "../../lib/storage/postHistoryDeletionRequestsRepository";
import { DexieSensitivePayloadRepository } from "../../lib/storage/sensitivePayloadRepository";
import { DexiePostHistoryImportedRangesRepository } from "../../lib/storage/postHistoryImportedRangesRepository";
import { DexiePostHistoryRelayCoverageRepository } from "../../lib/storage/postHistoryRelayCoverageRepository";
import { getPostHistoryLocalRevision, PostHistoryLocalWriteStaleError } from "../../lib/storage/postHistoryLocalWriteScope";
import { buildPostHistoryVisibleKindsKey } from "../../lib/storage/postHistoryVisibleRangeRepository";
import { POST_HISTORY_FETCH_KINDS } from "../../lib/postHistoryRelayFetchService";

const databases = new Set<EHagakiDB>();
const kindsKey = buildPostHistoryVisibleKindsKey([...POST_HISTORY_FETCH_KINDS]);
const multiBatchSecret = generateSecretKey();
const multiBatchJsonl = `${Array.from({ length: 501 }, (_, index) => JSON.stringify(finalizeEvent({
    created_at: 100 + index,
    kind: 1,
    tags: [],
    content: `post ${100 + index}`,
}, multiBatchSecret))).join("\n")}\n`;

function setup(secret = generateSecretKey()) {
    const db = new EHagakiDB(`citrine-import-${crypto.randomUUID()}`);
    databases.add(db);
    const owner = getPublicKey(secret);
    const post = (time: number, kind = 1) => finalizeEvent({ created_at: time, kind, tags: [], content: `post ${time}` }, secret);
    const repository = new DexiePostHistoryRepository(db);
    const ranges = new DexiePostHistoryImportedRangesRepository(db);
    const deletions = new DexiePostHistoryDeletionRequestsRepository(db);
    const payloads = new DexieSensitivePayloadRepository(db);
    const service = new PostHistoryJsonlImportService({ postHistoryRepository: repository,
        deletionRequestsRepository: deletions, sensitivePayloadRepository: payloads, importedRangesRepository: ranges,
        getLocalRevision: (pubkey) => getPostHistoryLocalRevision(db, pubkey) });
    const run = (content: string, name = "citrine-1700000000000.jsonl", overrides = {}) => {
        const bytes = new TextEncoder().encode(content);
        return service.importFile({ ownerPubkeyHex: owner, getCurrentPubkeyHex: () => owner,
            file: { name, size: bytes.length, stream: () => new ReadableStream({ start(c) { c.enqueue(bytes); c.close(); } }) },
            ...overrides });
    };
    const jsonl = (events: unknown[]) => events.map((event) => JSON.stringify(event)).join("\n") + "\n";
    return { db, secret, owner, post, repository, ranges, deletions, payloads, service, run, jsonl };
}
afterEach(async () => {
    vi.restoreAllMocks();
    for (const db of databases) { db.close(); await Dexie.delete(db.name); }
    databases.clear();
});

describe("Citrine import restoration", () => {
    it("uses only owner post timestamps, accepts ordinary DB exports, and creates no relay evidence", async () => {
        const h = setup();
        const other = finalizeEvent({ kind: 1, created_at: 1, content: "other", tags: [] }, generateSecretKey());
        const payload = finalizeEvent({ kind: 36, created_at: 2, content: "payload", tags: [["k", "1"]] }, h.secret);
        const deletion = finalizeEvent({ kind: 5, created_at: 3000, content: "", tags: [["e", h.post(100).id]] }, h.secret);
        const result = await h.run(h.jsonl([h.post(200, 42), other, h.post(1, 0), payload, deletion, h.post(100), h.post(150, 1111)]));
        expect(result).toMatchObject({ status: "completed", insertedPostCount: 3, otherAccountCount: 1,
            unsupportedKindCount: 1, restoredRangeChanged: true });
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([{ since: 100, until: 200 }]);
        expect((await new DexiePostHistoryRelayCoverageRepository(h.db).get(h.owner, kindsKey)).relays).toEqual([]);
        h.db.close(); await h.db.open();
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([{ since: 100, until: 200 }]);
    });
    it.each(["history.jsonl", "citrine.jsonl", "citrine-1700000000000 (1).jsonl", "citrine-01.jsonl", "citrine-999999999999999999.jsonl", "Citrine-1700000000000.jsonl"])
        ("does not grant restoration to %s", async (name) => {
            const h = setup();
            expect((await h.run(h.jsonl([h.post(100), h.post(200)]), name)).status).toBe("completed");
            expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([]);
        });
    it.each([1_700_000_050, 1_700_000_200])("saves future posts but bounds restoration by export time %s and import time", async (exportSecond) => {
        const h = setup();
        const now = 1_700_000_100;
        vi.spyOn(Date, "now").mockReturnValue(now * 1000);
        const historical = [h.post(now - 200), h.post(now - 100)];
        const afterExport = h.post(now - 25);
        const future = h.post(now + 75);
        const result = await h.run(h.jsonl([...historical, afterExport, future]), `citrine-${exportSecond * 1000}.jsonl`);
        expect(result).toMatchObject({ status: "completed", insertedPostCount: 4, failedPostEventCount: 0, restoredRangeChanged: true });
        expect((await h.db.postHistory.get(future.id))?.rawEvent).toEqual(JSON.parse(JSON.stringify(future)));
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([{
            since: historical[0].created_at,
            until: exportSecond < now ? historical[1].created_at : afterExport.created_at,
        }]);
    });
    it("creates no restoration range when every post is newer than the candidate ceiling", async () => {
        const h = setup(); const now = 1_700_000_100;
        vi.spyOn(Date, "now").mockReturnValue(now * 1000);
        expect(await h.run(h.jsonl([h.post(now + 1), h.post(now + 200)]), `citrine-${(now + 1000) * 1000}.jsonl`))
            .toMatchObject({ status: "completed", insertedPostCount: 2 });
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([]);
    });
    it("registers a backup on an all-unchanged reimport and keeps gaps between files", async () => {
        const h = setup(); const first = h.jsonl([h.post(100), h.post(200)]);
        await h.run(first, "history.jsonl");
        expect(await h.run(first)).toMatchObject({ insertedPostCount: 0, unchangedPostCount: 2, restoredRangeChanged: true });
        expect(await h.run(first)).toMatchObject({ restoredRangeChanged: false });
        await h.run(h.jsonl([h.post(10), h.post(20)]));
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([{ since: 10, until: 20 }, { since: 100, until: 200 }]);
    });
    it("does not publish until every batch has succeeded", async () => {
        const h = setup(multiBatchSecret);
        const observations: unknown[] = [];
        const original = h.repository.upsertFetchedEvents.bind(h.repository);
        vi.spyOn(h.repository, "upsertFetchedEvents").mockImplementation(async (input) => {
            observations.push((await h.ranges.get(h.owner, kindsKey)).ranges);
            return original(input);
        });
        expect(await h.run(multiBatchJsonl)).toMatchObject({ status: "completed", insertedPostCount: 501 });
        expect(observations).toEqual([[], []]);
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([{ since: 100, until: 600 }]);
    });
    it.each(["json", "signature", "save", "stream", "utf8", "size"])("never extends restoration after %s failure", async (failure) => {
        const h = setup(); await h.run(h.jsonl([h.post(100), h.post(200)]));
        let content = h.jsonl([h.post(1), h.post(500)]);
        let overrides = {};
        if (failure === "json") content += "broken\n";
        if (failure === "signature") content += JSON.stringify({ ...h.post(600), sig: "f".repeat(128) });
        if (failure === "save") vi.spyOn(h.repository, "upsertFetchedEvents").mockRejectedValueOnce(new Error("save failed"));
        if (["stream", "utf8", "size"].includes(failure)) {
            const bytes = new TextEncoder().encode(content);
            overrides = { file: { name: "citrine-1700000000000.jsonl", size: bytes.length + 5,
                stream: () => new ReadableStream<Uint8Array>({ start(c) { c.enqueue(bytes);
                    if (failure === "utf8") c.enqueue(new Uint8Array([0xff]));
                    c.close(); } }) } };
            let first = true;
            if (failure === "stream") overrides = { file: { name: "citrine-1700000000000.jsonl", size: bytes.length,
                stream: () => new ReadableStream<Uint8Array>({ pull(c) {
                    if (first) { first = false; c.enqueue(bytes); }
                    else c.error(new Error("stream failed"));
                } }) } };
        }
        const result = await h.run(content, undefined, overrides);
        expect(result.restoredRangeChanged).not.toBe(true);
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([{ since: 100, until: 200 }]);
    });
    it("reports metadata failure separately without claiming any post failed", async () => {
        const h = setup();
        vi.spyOn(h.db.meta, "put").mockRejectedValueOnce(new Error("metadata save failed"));
        expect(await h.run(h.jsonl([h.post(100), h.post(200)]))).toMatchObject({ status: "partial",
            insertedPostCount: 2, failedPostEventCount: 0, restoredRangeSaveFailed: true });
        expect(await h.db.postHistory.count()).toBe(2);
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([]);
    });
    it("does not infer a range when the backup contains no owner posts", async () => {
        const h = setup();
        expect(await h.run(h.jsonl([h.post(100, 0)]))).toMatchObject({ status: "completed", unsupportedKindCount: 1 });
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([]);
    });
    it("returns a failure result instead of writing when the revision cannot be checked", async () => {
        const h = setup();
        const getLocalRevision = vi.fn().mockResolvedValueOnce(0).mockRejectedValue(new Error("revision read failed"));
        const service = new PostHistoryJsonlImportService({ postHistoryRepository: h.repository, importedRangesRepository: h.ranges, getLocalRevision });
        const bytes = new TextEncoder().encode(h.jsonl([h.post(100)]));
        expect(await service.importFile({ ownerPubkeyHex: h.owner, getCurrentPubkeyHex: () => h.owner,
            file: { name: "citrine-1700000000000.jsonl", size: bytes.length, stream: () => new ReadableStream({ start(c) { c.enqueue(bytes); c.close(); } }) } }))
            .toMatchObject({ status: "partial", insertedPostCount: 0 });
        expect(await h.db.postHistory.count()).toBe(0);
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([]);
    });
    it("rolls back an import invalidated during post persistence", async () => {
        const h = setup(); let current = h.owner;
        const original = h.db.postHistory.bulkPut.bind(h.db.postHistory);
        vi.spyOn(h.db.postHistory, "bulkPut").mockImplementation(((...args: any[]) => {
            current = "b".repeat(64);
            return original(...args as [any]);
        }) as any);
        expect(await h.run(h.jsonl([h.post(100)]), undefined, { getCurrentPubkeyHex: () => current })).toMatchObject({ status: "account-changed", insertedPostCount: 0 });
        expect(await h.db.postHistory.count()).toBe(0);
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([]);
    });
    it("rolls back metadata invalidated during its commit", async () => {
        const h = setup(); let active = true;
        const original = h.db.meta.put.bind(h.db.meta);
        vi.spyOn(h.db.meta, "put").mockImplementation(((...args: any[]) => {
            active = false;
            return original(...args as [any]);
        }) as any);
        await expect(h.ranges.record({ ownerPubkeyHex: h.owner, kindsKey, expectedRevision: 0,
            isActive: () => active, range: { since: 100, until: 200 } })).rejects.toBeInstanceOf(PostHistoryLocalWriteStaleError);
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([]);
    });
    it.each(["cancel", "account", "delete"])("stops a multi-batch import after %s", async (change) => {
        const h = setup(multiBatchSecret); const abort = new AbortController(); let current = h.owner;
        const original = h.repository.upsertFetchedEvents.bind(h.repository);
        vi.spyOn(h.repository, "upsertFetchedEvents").mockImplementation(async (input) => {
            const saved = await original(input);
            if (change === "cancel") abort.abort();
            if (change === "account") current = "b".repeat(64);
            if (change === "delete") await h.repository.deleteLocalHistoryForPubkey(h.owner);
            return saved;
        });
        const result = await h.run(multiBatchJsonl, undefined,
            { signal: abort.signal, getCurrentPubkeyHex: () => current });
        expect(result.status).toBe(change === "account" ? "account-changed" : "cancelled");
        expect(h.repository.upsertFetchedEvents).toHaveBeenCalledOnce();
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([]);
        if (change === "delete") expect(await h.db.postHistory.count()).toBe(0);
    });
    it("rejects final metadata after deletion from a second connection", async () => {
        const h = setup(); const second = new EHagakiDB(h.db.name); databases.add(second);
        const original = h.ranges.record.bind(h.ranges);
        vi.spyOn(h.ranges, "record").mockImplementation(async (input) => {
            await new DexiePostHistoryRepository(second).deleteLocalHistoryForPubkey(h.owner);
            return original(input);
        });
        expect(await h.run(h.jsonl([h.post(100), h.post(200)]))).toMatchObject({ status: "cancelled" });
        expect(await h.db.postHistory.count()).toBe(0);
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([]);
    });
    it("rejects stale post, deletion and payload saves inside their transactions", async () => {
        const h = setup(); const scope = { ownerPubkeyHex: h.owner, expectedRevision: 0, isActive: () => true };
        await h.repository.deleteLocalHistoryForPubkey(h.owner);
        expect(await h.repository.upsertFetchedEvents({ events: [{ event: h.post(100) }], localWriteScope: scope })).toMatchObject({ applied: false });
        const deletion = finalizeEvent({ kind: 5, created_at: 300, content: "", tags: [["e", h.post(100).id]] }, h.secret);
        await expect(h.deletions.upsertImportedDeletionEvents({ ownerPubkeyHex: h.owner, deletionEvents: [deletion], localWriteScope: scope })).rejects.toBeInstanceOf(PostHistoryLocalWriteStaleError);
        const payload = finalizeEvent({ kind: 36, created_at: 100, content: "payload", tags: [["k", "1"]] }, h.secret);
        await expect(h.payloads.putCandidate({ event: payload, localWriteScope: scope })).rejects.toBeInstanceOf(PostHistoryLocalWriteStaleError);
        expect(await h.db.postHistory.count()).toBe(0);
        expect(await h.db.postHistoryDeletionRequests.count()).toBe(0);
        expect(await h.db.sensitivePayloads.count()).toBe(0);
    });
    it("merges concurrent ranges, isolates accounts and kind sets, and invalidates revision-mismatched metadata", async () => {
        const h = setup(); const scope = { ownerPubkeyHex: h.owner, kindsKey, expectedRevision: 0, isActive: () => true };
        await Promise.all([h.ranges.record({ ...scope, range: { since: 10, until: 20 } }),
            h.ranges.record({ ...scope, range: { since: 21, until: 30 } })]);
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([{ since: 10, until: 30 }]);
        expect((await h.ranges.get("other", kindsKey)).ranges).toEqual([]);
        expect((await h.ranges.get(h.owner, "1")).ranges).toEqual([]);
        await h.db.meta.put({ key: `postHistoryLocalRevision:${h.owner}`, value: 1, updatedAt: Date.now() });
        expect((await h.ranges.get(h.owner, kindsKey)).ranges).toEqual([]);
        await h.repository.deleteLocalHistoryForPubkey(h.owner);
        expect(await h.db.meta.get(`postHistoryImportedRanges:${h.owner}:${kindsKey}`)).toBeUndefined();
    });
});
