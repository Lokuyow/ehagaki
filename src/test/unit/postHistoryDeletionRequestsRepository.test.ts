import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import {
    getPostHistorySearchRevision,
    resetPostHistoryLocalSearchRevisionsForTesting,
} from "../../lib/postHistoryLocalSearchRevision";
import { DexiePostHistoryDeletionRequestsRepository } from "../../lib/storage/postHistoryDeletionRequestsRepository";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";

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

    it("JSONL由来の対象未取得kind:5を未検証pendingとして保存し削除済み判定へ返さない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const deletionEvent = createDeletionEvent({ created_at: 1_700_000_000 });

        const result = await repository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
            fetchedAt: 900,
        });

        expect(result).toEqual({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
            appliedDeletionCount: 0,
        });
        const [record] = await db.postHistoryDeletionRequests.toArray();
        expect(record).toMatchObject({
            targetVerified: false,
            deletedAt: 1_700_000_000,
            relayUrls: [],
            schemaVersion: 2,
        });
        await expect(repository.getDeletedTargets([{
            targetAuthorPubkey: deletionEvent.pubkey,
            targetEventId: deletionEvent.tags[0][1],
        }])).resolves.toEqual(new Map());

        db.close();
    });

    it.each([1, 6, 7, 16, 20, 21, 22, 42])(
        "対象未取得でk=%iのJSONL由来kind:5をpending保存する",
        async (targetKind) => {
            const db = createTestDb();
            const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
            const deletionEvent = createDeletionEvent({
                tags: [
                    ["e", "2".repeat(64)],
                    ["k", String(targetKind)],
                ],
            });

            const result = await repository.upsertImportedDeletionEvents({
                ownerPubkeyHex: deletionEvent.pubkey,
                deletionEvents: [deletionEvent],
            });

            expect(result).toMatchObject({ insertedCount: 1, ignoredCount: 0 });
            await expect(db.postHistoryDeletionRequests.toArray()).resolves.toMatchObject([
                { targetVerified: false },
            ]);

            db.close();
        },
    );

    it.each([
        {
            name: "保存対象外kindが1件",
            kindTags: [["k", "31234"]],
        },
        {
            name: "保存対象外kindが複数",
            kindTags: [["k", "31234"], ["k", "43"]],
        },
    ])("対象未取得で$nameなら削除要求を保存しない", async ({ kindTags }) => {
        const db = createTestDb();
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const deletionEvent = createDeletionEvent({
            tags: [["e", "2".repeat(64)], ...kindTags],
        });

        const result = await repository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
        });

        expect(result).toEqual({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 1,
            appliedDeletionCount: 0,
        });
        await expect(db.postHistoryDeletionRequests.count()).resolves.toBe(0);

        db.close();
    });

    it("保存対象kindと保存対象外kindが混在する場合はpending保存する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const deletionEvent = createDeletionEvent({
            tags: [
                ["e", "2".repeat(64)],
                ["k", "7"],
                ["k", "31234"],
            ],
        });

        const result = await repository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
        });

        expect(result).toMatchObject({ insertedCount: 1, ignoredCount: 0 });
        await expect(db.postHistoryDeletionRequests.toArray()).resolves.toMatchObject([
            { targetVerified: false },
        ]);

        db.close();
    });

    it.each([
        {
            name: "不正なkタグだけ",
            kindTags: [
                ["k", "not-a-kind"],
                ["k", ""],
                ["k", "-1"],
                ["k", "1.5"],
                ["k", "65536"],
            ],
        },
        {
            name: "不正なkタグと保存対象外kindの混在",
            kindTags: [["k", "invalid"], ["k", "31234"]],
        },
    ])("対象未取得で$nameなら対象kind不明としてpending保存する", async ({ kindTags }) => {
        const db = createTestDb();
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const deletionEvent = createDeletionEvent({
            tags: [["e", "2".repeat(64)], ...kindTags],
        });

        const result = await repository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
        });

        expect(result).toMatchObject({ insertedCount: 1, ignoredCount: 0 });
        await expect(db.postHistoryDeletionRequests.toArray()).resolves.toMatchObject([
            { targetVerified: false },
        ]);

        db.close();
    });

    it("対象実体が保存対象kindなら対象外kタグより実kindを優先する", async () => {
        const db = createTestDb();
        const postRepository = new DexiePostHistoryRepository(db, () => 1000);
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const targetEvent = createSignedEvent({ kind: 1 });
        const deletionEvent = createDeletionEvent({
            tags: [["e", targetEvent.id], ["k", "31234"]],
        });
        await postRepository.putPostedEvent({ event: targetEvent });

        const result = await repository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
        });

        expect(result).toMatchObject({
            insertedCount: 1,
            ignoredCount: 0,
            appliedDeletionCount: 1,
        });
        await expect(db.postHistoryDeletionRequests.toArray()).resolves.toMatchObject([
            { targetVerified: true },
        ]);

        db.close();
    });

    it("対象実体が保存対象外kindなら対象kタグに関係なく保存しない", async () => {
        const db = createTestDb();
        const postRepository = new DexiePostHistoryRepository(db, () => 1000);
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const targetEvent = createSignedEvent({ kind: 31234 });
        const deletionEvent = createDeletionEvent({
            tags: [["e", targetEvent.id], ["k", "1"]],
        });
        await postRepository.putPostedEvent({ event: targetEvent });

        const result = await repository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
        });

        expect(result).toEqual({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 1,
            appliedDeletionCount: 0,
        });
        await expect(db.postHistoryDeletionRequests.count()).resolves.toBe(0);
        await expect(db.postHistory.get(targetEvent.id)).resolves.not.toHaveProperty("deletedAt");

        db.close();
    });

    it("対象投稿が先に存在すればJSONL由来kind:5を検証済みにしてミリ秒で削除適用する", async () => {
        const db = createTestDb();
        const postRepository = new DexiePostHistoryRepository(db, () => 1000);
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const targetEvent = createSignedEvent();
        const deletionEvent = createDeletionEvent({
            tags: [["e", targetEvent.id]],
            created_at: 1_700_000_000,
        });
        await postRepository.putPostedEvent({ event: targetEvent });

        const result = await repository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
        });

        expect(result.appliedDeletionCount).toBe(1);
        await expect(db.postHistoryDeletionRequests.get(
            `${targetEvent.pubkey}:${targetEvent.id}:${deletionEvent.id}`,
        )).resolves.toMatchObject({ targetVerified: true });
        await expect(db.postHistory.get(targetEvent.id)).resolves.toMatchObject({
            deletedAt: 1_700_000_000_000,
            deletionEventId: deletionEvent.id,
        });

        db.close();
    });

    it("対象投稿のpubkeyが異なる場合はpendingのまま削除適用しない", async () => {
        const db = createTestDb();
        const postRepository = new DexiePostHistoryRepository(db, () => 1000);
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const targetEvent = createSignedEvent({ pubkey: "9".repeat(64) });
        const deletionEvent = createDeletionEvent({ tags: [["e", targetEvent.id]] });
        await postRepository.putPostedEvent({ event: targetEvent });

        const result = await repository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
        });

        expect(result.appliedDeletionCount).toBe(0);
        await expect(db.postHistoryDeletionRequests.toArray()).resolves.toMatchObject([
            { targetVerified: false },
        ]);
        await expect(db.postHistory.get(targetEvent.id)).resolves.not.toHaveProperty("deletedAt");

        db.close();
    });

    it("既存経路とlegacyレコードを検証済みとして削除済み判定へ使用する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const targetEvent = createSignedEvent();
        const deletionEvent = createDeletionEvent({ tags: [["e", targetEvent.id]] });
        await repository.upsertValidDeletionRequests({
            targetEvents: [targetEvent],
            deletionEvents: [{ event: deletionEvent }],
        });
        const saved = await db.postHistoryDeletionRequests.toArray();
        expect(saved[0].targetVerified).toBe(true);

        const legacyId = `${targetEvent.pubkey}:${"2".repeat(64)}:${"6".repeat(64)}`;
        await db.postHistoryDeletionRequests.put({
            ...saved[0],
            id: legacyId,
            targetEventId: "2".repeat(64),
            deletionEventId: "6".repeat(64),
            targetVerified: undefined,
            schemaVersion: 1,
        });
        const deletedTargets = await repository.getDeletedTargets([
            { targetAuthorPubkey: targetEvent.pubkey, targetEventId: targetEvent.id },
            { targetAuthorPubkey: targetEvent.pubkey, targetEventId: "2".repeat(64) },
        ]);
        expect(deletedTargets.get(targetEvent.pubkey)).toEqual(new Set([
            targetEvent.id,
            "2".repeat(64),
        ]));

        db.close();
    });

    it("pendingから検証済みへ同じIDで昇格し既存relay URLを維持する", async () => {
        const db = createTestDb();
        const postRepository = new DexiePostHistoryRepository(db, () => 1000);
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const targetEvent = createSignedEvent();
        const deletionEvent = createDeletionEvent({ tags: [["e", targetEvent.id]] });
        await repository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
        });
        const [pending] = await db.postHistoryDeletionRequests.toArray();
        await db.postHistoryDeletionRequests.update(pending.id, {
            relayUrls: ["wss://existing.example.com/"],
        });
        await postRepository.putPostedEvent({ event: targetEvent });

        const result = await repository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
        });

        expect(result).toMatchObject({
            insertedCount: 0,
            updatedCount: 1,
            unchangedCount: 0,
            appliedDeletionCount: 1,
        });
        await expect(db.postHistoryDeletionRequests.count()).resolves.toBe(1);
        await expect(db.postHistoryDeletionRequests.get(pending.id)).resolves.toMatchObject({
            targetVerified: true,
            relayUrls: ["wss://existing.example.com/"],
        });

        db.close();
    });

    it("local kind:5保存ではrequestの秒と投稿の送信成功時刻msを分離しrevisionを更新する", async () => {
        const db = createTestDb();
        resetPostHistoryLocalSearchRevisionsForTesting();
        const postRepository = new DexiePostHistoryRepository(db, () => 1000);
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 2000);
        const targetEvent = createSignedEvent();
        const deletionEvent = createDeletionEvent({
            tags: [["e", targetEvent.id]],
            created_at: 250,
        });
        await postRepository.putPostedEvent({ event: targetEvent });
        const revisionBefore = getPostHistorySearchRevision(targetEvent.pubkey);

        await repository.saveLocalDeletion({
            targetEventId: targetEvent.id,
            deletionEvent,
            deletedAt: 987654321,
        });

        await expect(db.postHistoryDeletionRequests.get(
            `${targetEvent.pubkey}:${targetEvent.id}:${deletionEvent.id}`,
        )).resolves.toMatchObject({
            deletedAt: 250,
            rawEvent: deletionEvent,
        });
        await expect(db.postHistory.get(targetEvent.id)).resolves.toMatchObject({
            deletedAt: 987654321,
            deletionEventId: deletionEvent.id,
        });
        expect(getPostHistorySearchRevision(targetEvent.pubkey)).toBe(revisionBefore + 1);

        db.close();
    });

    it("local kind:5保存のtransaction失敗時は片側だけ残さずrevisionも更新しない", async () => {
        const db = createTestDb();
        resetPostHistoryLocalSearchRevisionsForTesting();
        const postRepository = new DexiePostHistoryRepository(db, () => 1000);
        const repository = new DexiePostHistoryDeletionRequestsRepository(db, () => 2000);
        const targetEvent = createSignedEvent();
        const deletionEvent = createDeletionEvent({ tags: [["e", targetEvent.id]] });
        await postRepository.putPostedEvent({ event: targetEvent });
        const revisionBefore = getPostHistorySearchRevision(targetEvent.pubkey);
        db.postHistory.put = (() => Promise.reject(new Error("forced_post_history_failure"))) as unknown as typeof db.postHistory.put;

        await expect(repository.saveLocalDeletion({
            targetEventId: targetEvent.id,
            deletionEvent,
            deletedAt: 987654321,
        })).rejects.toThrow("forced_post_history_failure");
        await expect(db.postHistoryDeletionRequests.count()).resolves.toBe(0);
        await expect(db.postHistory.get(targetEvent.id)).resolves.not.toHaveProperty("deletionEventId");
        expect(getPostHistorySearchRevision(targetEvent.pubkey)).toBe(revisionBefore);

        db.close();
    });
});
