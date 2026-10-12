import "fake-indexeddb/auto";
import Dexie from "dexie";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getPostHistorySearchRevision, resetPostHistoryLocalSearchRevisionsForTesting } from "../../lib/postHistoryLocalSearchRevision";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { DexieSensitivePayloadRepository } from "../../lib/storage/sensitivePayloadRepository";
import { DexiePostHistoryDeletionRequestsRepository } from "../../lib/storage/postHistoryDeletionRequestsRepository";
import * as reconciliation from "../../lib/storage/sensitivePayloadDeletionReconciler";
import { createMockConsole } from "../helpers";

const databases: EHagakiDB[] = [];
function createDb() {
    const db = new EHagakiDB(`post-history-revision-${Date.now()}-${Math.random()}`);
    databases.push(db);
    return db;
}

// main skips ordinary posts; exercise the post-commit reconciliation boundary
// with a real candidate Structure instead of relying on an ordinary-event scan.
function createStructureFixture() {
    return finalizeEvent({ kind: 1, created_at: 100, content: "",
        tags: [["content-warning"], ["c", "f".repeat(64)]] }, generateSecretKey());
}

beforeEach(resetPostHistoryLocalSearchRevisionsForTesting);
afterEach(async () => {
    vi.restoreAllMocks();
    for (const db of databases.splice(0)) { db.close(); await Dexie.delete(db.name); }
});

describe("fetched history transaction revision", () => {
    it("publishes the committed owner revision while reconciliation is still pending", async () => {
        const db = createDb(), repository = new DexiePostHistoryRepository(db);
        const event = createStructureFixture();
        let release!: () => void, started!: () => void;
        const pending = new Promise<void>(resolve => { release = resolve; });
        const entered = new Promise<void>(resolve => { started = resolve; });
        const reconcile = reconciliation.reconcileSensitivePayloadDeletionForStructure;
        vi.spyOn(reconciliation, "reconcileSensitivePayloadDeletionForStructure").mockImplementationOnce(async (...args) => {
            started(); await pending; return reconcile(...args);
        });
        let finished = false;
        const write = repository.upsertFetchedEvents({ events: [{ event }] }).then(result => { finished = true; return result; });
        try {
            await entered;
            expect(await db.postHistory.get(event.id)).toMatchObject({ eventId: event.id });
            expect(finished).toBe(false);
            expect(getPostHistorySearchRevision(event.pubkey)).toBe(1);
        } finally { release(); await write; }
        expect(getPostHistorySearchRevision(event.pubkey)).toBe(1);
        await repository.upsertFetchedEvents({ events: [{ event }] });
        expect(getPostHistorySearchRevision(event.pubkey)).toBe(1);
    });

    it("does not notify or reconcile a transaction that rolls back after writing rows", async () => {
        const db = createDb(), repository = new DexiePostHistoryRepository(db);
        const event = createStructureFixture();
        const bulkPut = db.postHistory.bulkPut.bind(db.postHistory);
        vi.spyOn(db.postHistory, "bulkPut").mockImplementationOnce((...args) =>
            bulkPut(...args).then(() => { throw new Error("rollback after write"); }),
        );
        const reconcile = vi.spyOn(reconciliation, "reconcileSensitivePayloadDeletionForStructure");
        await expect(repository.upsertFetchedEvents({ events: [{ event }] })).rejects.toThrow("rollback after write");
        expect(await db.postHistory.count()).toBe(0);
        expect(getPostHistorySearchRevision(event.pubkey)).toBe(0);
        expect(reconcile).not.toHaveBeenCalled();
    });

    it("retains the additional revision from an actual reconciled payload deletion", async () => {
        const db = createDb(), repository = new DexiePostHistoryRepository(db);
        const key = generateSecretKey();
        const payload = finalizeEvent({ kind: 36, created_at: 100, tags: [["k", "1"]], content: "payload fixture" }, key);
        const structure = finalizeEvent({ kind: 1, created_at: 101, tags: [["content-warning"], ["c", payload.id]], content: "" }, key);
        const deletion = finalizeEvent({ kind: 5, created_at: 200, tags: [["e", payload.id], ["k", "36"]], content: "" }, key);
        const payloads = new DexieSensitivePayloadRepository(db);
        await payloads.putCandidate({ event: payload });
        await new DexiePostHistoryDeletionRequestsRepository(db).upsertImportedDeletionEvents({
            ownerPubkeyHex: structure.pubkey, deletionEvents: [{ event: deletion }],
        });
        resetPostHistoryLocalSearchRevisionsForTesting();
        const reconcile = reconciliation.reconcileSensitivePayloadDeletionForStructure;
        let revisionBeforeReconciliation = -1;
        vi.spyOn(reconciliation, "reconcileSensitivePayloadDeletionForStructure").mockImplementationOnce(async (...args) => {
            revisionBeforeReconciliation = getPostHistorySearchRevision(structure.pubkey);
            return reconcile(...args);
        });
        await repository.upsertFetchedEvents({ events: [{ event: structure }] });
        expect(revisionBeforeReconciliation).toBe(1);
        expect(getPostHistorySearchRevision(structure.pubkey)).toBe(2);
        expect((await payloads.getByIds([payload.id]))[0]).toMatchObject({ deletedAt: 200_000, deletionEventId: deletion.id });
        expect((await repository.getByEventId(structure.id))?.deletedAt).toBeUndefined();
        await repository.upsertFetchedEvents({ events: [{ event: structure }] });
        expect(getPostHistorySearchRevision(structure.pubkey)).toBe(2);
    });

    it("keeps a committed write and its revision when reconciliation fails", async () => {
        const db = createDb(), logger = createMockConsole();
        const repository = new DexiePostHistoryRepository(db, Date.now, logger);
        const event = createStructureFixture();
        vi.spyOn(reconciliation, "reconcileSensitivePayloadDeletionForStructure").mockRejectedValueOnce(new Error("reconciliation failed"));
        await expect(repository.upsertFetchedEvents({ events: [{ event }] })).resolves.toMatchObject({ insertedCount: 1 });
        expect(await db.postHistory.count()).toBe(1);
        expect(getPostHistorySearchRevision(event.pubkey)).toBe(1);
        expect(logger.warn).toHaveBeenCalledWith("post_history_sensitive_payload_deletion_reconcile_failed", event.id);
    });
});
