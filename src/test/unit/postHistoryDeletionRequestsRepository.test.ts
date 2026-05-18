import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryDeletionRequestsRepository } from "../../lib/storage/postHistoryDeletionRequestsRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-post-history-deletions-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

function createSignedEvent(overrides: Record<string, any> = {}) {
    return {
        id: "1".repeat(64),
        pubkey: "a".repeat(64),
        kind: 1,
        content: "reply",
        tags: [],
        created_at: 100,
        sig: "b".repeat(128),
        ...overrides,
    };
}

function createDeletionEvent(overrides: Record<string, any> = {}) {
    return {
        id: "5".repeat(64),
        pubkey: "a".repeat(64),
        kind: 5,
        content: "deleted",
        tags: [["e", "1".repeat(64)]],
        created_at: 200,
        sig: "c".repeat(128),
        ...overrides,
    };
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexiePostHistoryDeletionRequestsRepository", () => {
    it("validなkind:5 tombstoneをglobal tableに保存し、targetAuthorPubkey+targetEventIdで取得する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const targetEvent = createSignedEvent();
        const deletionEvent = createDeletionEvent({
            tags: [["e", targetEvent.id]],
            content: "reason",
            created_at: 250,
        });

        const result = await repository.upsertValidDeletionRequests({
            targetEvents: [targetEvent],
            deletionEvents: [{ event: deletionEvent, relayUrls: ["wss://relay.example.com"] }],
            fetchedAt: 900,
        });

        expect(result).toMatchObject({
            insertedCount: 1,
            ignoredCount: 0,
        });
        const deletedTargets = await repository.getDeletedTargets([{
            targetAuthorPubkey: targetEvent.pubkey,
            targetEventId: targetEvent.id,
        }]);
        expect(deletedTargets.get(targetEvent.pubkey)?.has(targetEvent.id)).toBe(true);

        const records = await db.postHistoryDeletionRequests.toArray();
        expect(records).toHaveLength(1);
        expect(records[0]).toMatchObject({
            targetAuthorPubkey: targetEvent.pubkey,
            targetEventId: targetEvent.id,
            deletionEventId: deletionEvent.id,
            deletionEventPubkey: targetEvent.pubkey,
            deletedAt: deletionEvent.created_at,
            fetchedAt: 900,
            reason: "reason",
            relayUrls: ["wss://relay.example.com/"],
        });
        expect(records[0]).not.toHaveProperty("ownerPubkeyHex");

        db.close();
    });

    it("pubkey不一致、e tag不一致、kind不一致は保存しない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const targetEvent = createSignedEvent();

        const result = await repository.upsertValidDeletionRequests({
            targetEvents: [targetEvent],
            deletionEvents: [
                { event: createDeletionEvent({ pubkey: "9".repeat(64) }) },
                { event: createDeletionEvent({ id: "6".repeat(64), tags: [["e", "2".repeat(64)]] }) },
                { event: createDeletionEvent({ id: "7".repeat(64), kind: 1 }) },
            ],
            fetchedAt: 900,
        });

        expect(result).toMatchObject({
            insertedCount: 0,
            ignoredCount: 3,
        });
        await expect(db.postHistoryDeletionRequests.count()).resolves.toBe(0);

        db.close();
    });

    it("k tagがなくても必須条件を満たすkind:5はvalidとして扱う", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const targetEvent = createSignedEvent();
        const deletionEvent = createDeletionEvent({
            tags: [["e", targetEvent.id]],
        });

        await repository.upsertValidDeletionRequests({
            targetEvents: [targetEvent],
            deletionEvents: [{ event: deletionEvent }],
            fetchedAt: 900,
        });

        await expect(db.postHistoryDeletionRequests.count()).resolves.toBe(1);

        db.close();
    });
});
