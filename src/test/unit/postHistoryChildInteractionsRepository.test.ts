import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryChildInteractionsRepository } from "../../lib/storage/postHistoryChildInteractionsRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-post-history-replies-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

function createSignedEvent(overrides: Record<string, any> = {}) {
    return {
        id: "a".repeat(64),
        pubkey: "b".repeat(64),
        kind: 1,
        content: "reply",
        tags: [],
        created_at: 100,
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

describe("DexiePostHistoryChildInteractionsRepository", () => {
    it("parentId が一致する kind:1 直接リプライだけを保存し、古い順で取得する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryChildInteractionsRepository(db, () => 1000);
        const parentEventId = "1".repeat(64);
        const rootEventId = "9".repeat(64);
        const directReply = createSignedEvent({
            id: "2".repeat(64),
            content: "direct reply",
            tags: [
                ["e", rootEventId, "wss://root.example.com/", "root"],
                ["e", parentEventId, "wss://parent.example.com/", "reply"],
            ],
            created_at: 200,
        });
        const olderDirectReply = createSignedEvent({
            id: "3".repeat(64),
            content: "older direct reply",
            tags: [["e", parentEventId, "wss://parent.example.com/", "reply"]],
            created_at: 150,
        });
        const mentionOnly = createSignedEvent({
            id: "4".repeat(64),
            content: "mention",
            tags: [["e", parentEventId, "", "mention"]],
            created_at: 210,
        });
        const descendant = createSignedEvent({
            id: "5".repeat(64),
            content: "descendant",
            tags: [
                ["e", parentEventId, "wss://parent.example.com/", "root"],
                ["e", "6".repeat(64), "wss://child.example.com/", "reply"],
            ],
            created_at: 220,
        });

        const result = await repository.upsertChildInteractions({
            parentEventId,
            events: [
                { event: directReply, relayUrls: ["wss://relay.example.com"] },
                { event: olderDirectReply },
                { event: mentionOnly },
                { event: descendant },
                { event: createSignedEvent({ id: "7".repeat(64), kind: 42 }) },
            ],
            fetchedAt: 900,
        });

        expect(result).toMatchObject({
            insertedCount: 2,
            ignoredCount: 3,
        });

        const replies = await repository.getDirectReplyInteractions(parentEventId);
        expect(replies.map((record) => record.eventId)).toEqual([
            "3".repeat(64),
            "2".repeat(64),
        ]);
        expect(replies[1]).toMatchObject({
            parentEventId,
            rootEventId,
            authorPubkey: "b".repeat(64),
            content: "direct reply",
            relayUrls: ["wss://relay.example.com/"],
            discoveredAs: ["direct-reply"],
            rawEvent: { id: "2".repeat(64) },
        });

        db.close();
    });

    it("kind:7 reactionをrelated eventとして保存し、direct reply取得には混ぜない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryChildInteractionsRepository(db, () => 1000);
        const parentEventId = "1".repeat(64);
        const directReply = createSignedEvent({
            id: "2".repeat(64),
            content: "direct reply",
            tags: [["e", parentEventId, "", "reply"]],
            created_at: 200,
        });
        const reaction = createSignedEvent({
            id: "3".repeat(64),
            kind: 7,
            content: "+",
            tags: [
                ["p", "d".repeat(64)],
                ["e", parentEventId],
            ],
            created_at: 210,
        });

        const result = await repository.upsertChildInteractions({
            parentEventId,
            events: [
                { event: directReply },
                { event: reaction, relayUrls: ["wss://relay.example.com"] },
            ],
            fetchedAt: 900,
        });

        expect(result).toMatchObject({
            insertedCount: 2,
            ignoredCount: 0,
        });

        await expect(repository.getDirectReplyInteractions(parentEventId)).resolves.toMatchObject([
            { eventId: directReply.id },
        ]);

        await expect(repository.getChildInteractions(parentEventId)).resolves.toMatchObject([
            { eventId: directReply.id, discoveredAs: ["direct-reply"] },
            {
                eventId: reaction.id,
                kind: 7,
                content: "+",
                relayUrls: ["wss://relay.example.com/"],
                discoveredAs: ["reaction"],
            },
        ]);

        db.close();
    });

    it("kind:42 direct replyをchannel rootではなくreply targetへ保存する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryChildInteractionsRepository(db, () => 1000);
        const channelEventId = "8".repeat(64);
        const parentEventId = "1".repeat(64);
        const reply = createSignedEvent({
            id: "2".repeat(64),
            kind: 42,
            tags: [
                ["e", channelEventId, "wss://channel.example.com", "root"],
                ["e", parentEventId, "wss://parent.example.com", "reply"],
            ],
        });

        const result = await repository.upsertChildInteractions({
            parentEventId,
            events: [{ event: reply }],
        });

        expect(result).toMatchObject({ insertedCount: 1, ignoredCount: 0 });
        await expect(repository.getDirectReplyInteractions(parentEventId)).resolves.toMatchObject([{
            eventId: reply.id,
            parentEventId,
            kind: 42,
        }]);
        expect((await repository.getDirectReplyInteractions(parentEventId))[0])
            .not.toHaveProperty("rootEventId");
        await expect(repository.getDirectReplyInteractions(channelEventId)).resolves.toEqual([]);

        db.close();
    });

    it("root付きkind:7 reactionは末尾の対象e tagに紐づけて保存する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryChildInteractionsRepository(db, () => 1000);
        const rootEventId = "8".repeat(64);
        const parentEventId = "1".repeat(64);
        const reaction = createSignedEvent({
            id: "4".repeat(64),
            pubkey: "d".repeat(64),
            kind: 7,
            content: "+",
            tags: [
                ["e", rootEventId, "wss://root.example.com/", "root", "b".repeat(64)],
                ["p", "b".repeat(64)],
                ["e", parentEventId, "wss://parent.example.com/", "b".repeat(64)],
            ],
            created_at: 220,
        });

        const result = await repository.upsertChildInteractions({
            parentEventId,
            events: [{ event: reaction, relayUrls: ["wss://relay.example.com"] }],
            fetchedAt: 900,
        });

        expect(result).toMatchObject({
            insertedCount: 1,
            ignoredCount: 0,
        });

        await expect(repository.getChildInteractions(parentEventId)).resolves.toMatchObject([
            {
                eventId: reaction.id,
                parentEventId,
                kind: 7,
                discoveredAs: ["reaction"],
            },
        ]);

        db.close();
    });

    it("同じeventを再保存してもPostHistoryRecordには混ぜない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryChildInteractionsRepository(db, () => 1000);
        const parentEventId = "1".repeat(64);
        const reply = createSignedEvent({
            id: "2".repeat(64),
            tags: [["e", parentEventId, "", "reply"]],
        });

        await repository.upsertChildInteractions({
            parentEventId,
            events: [{ event: reply }],
        });
        await repository.upsertChildInteractions({
            parentEventId,
            events: [{ event: reply, relayUrls: ["wss://relay.example.com"] }],
        });

        await expect(db.postHistory.count()).resolves.toBe(0);
        await expect(repository.getDirectReplyInteractions(parentEventId)).resolves.toHaveLength(1);

        db.close();
    });

    it("self-parent eventはdirect replyとして保存しない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryChildInteractionsRepository(db, () => 1000);
        const parentEventId = "1".repeat(64);
        const selfParent = createSignedEvent({
            id: parentEventId,
            tags: [["e", parentEventId, "", "reply"]],
        });

        const result = await repository.upsertChildInteractions({
            parentEventId,
            events: [{ event: selfParent }],
        });

        expect(result).toMatchObject({
            insertedCount: 0,
            ignoredCount: 1,
        });
        await expect(repository.getDirectReplyInteractions(parentEventId)).resolves.toEqual([]);

        db.close();
    });

    it("指定pubkeyのpostHistory parentに紐づくreply cacheだけを削除する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryChildInteractionsRepository(db, () => 1000);
        const ownerPubkey = "a".repeat(64);
        const otherPubkey = "b".repeat(64);
        const ownerParentId = "1".repeat(64);
        const otherParentId = "9".repeat(64);

        await db.postHistory.bulkPut([
            {
                id: ownerParentId,
                eventId: ownerParentId,
                pubkeyHex: ownerPubkey,
                kind: 1,
                content: "owner post",
                tags: [],
                createdAt: 100,
                postedAt: 100_000,
                relayHints: [],
                acceptedRelays: [],
                media: [],
                rawEvent: {},
                updatedAt: 1000,
                schemaVersion: 2,
            },
            {
                id: otherParentId,
                eventId: otherParentId,
                pubkeyHex: otherPubkey,
                kind: 1,
                content: "other post",
                tags: [],
                createdAt: 100,
                postedAt: 100_000,
                relayHints: [],
                acceptedRelays: [],
                media: [],
                rawEvent: {},
                updatedAt: 1000,
                schemaVersion: 2,
            },
        ]);
        await repository.upsertChildInteractions({
            parentEventId: ownerParentId,
            events: [{ event: createSignedEvent({ id: "2".repeat(64), tags: [["e", ownerParentId, "", "reply"]] }) }],
        });
        await repository.upsertChildInteractions({
            parentEventId: otherParentId,
            events: [{ event: createSignedEvent({ id: "3".repeat(64), tags: [["e", otherParentId, "", "reply"]] }) }],
        });

        await repository.deleteChildInteractionsForPostHistoryPubkey(ownerPubkey);

        await expect(repository.getDirectReplyInteractions(ownerParentId)).resolves.toEqual([]);
        await expect(repository.getDirectReplyInteractions(otherParentId)).resolves.toHaveLength(1);

        db.close();
    });

    it("eventId指定でdirect reply cacheだけを削除し、PostHistoryRecordには影響しない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryChildInteractionsRepository(db, () => 1000);
        const parentEventId = "1".repeat(64);
        const deletedReply = createSignedEvent({
            id: "2".repeat(64),
            content: "deleted reply",
            tags: [["e", parentEventId, "", "reply"]],
            created_at: 200,
        });
        const remainingReply = createSignedEvent({
            id: "3".repeat(64),
            content: "remaining reply",
            tags: [["e", parentEventId, "", "reply"]],
            created_at: 210,
        });

        await repository.upsertChildInteractions({
            parentEventId,
            events: [
                { event: deletedReply },
                { event: remainingReply },
            ],
        });
        await repository.deleteChildInteractionByEventId(deletedReply.id);

        await expect(repository.getDirectReplyInteractions(parentEventId)).resolves.toMatchObject([
            { eventId: remainingReply.id },
        ]);
        await expect(db.postHistory.count()).resolves.toBe(0);

        db.close();
    });

    it("partial取得の新規replyはeventとrelayを保存するがfreshにはしない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryChildInteractionsRepository(db, () => 1000);
        const parentEventId = "1".repeat(64);
        const reply = createSignedEvent({
            id: "2".repeat(64),
            tags: [["e", parentEventId, "", "reply"]],
        });

        await repository.upsertChildInteractions({
            parentEventId,
            events: [{
                event: reply,
                relayUrls: ["wss://partial.example.com"],
            }],
            fetchedAt: null,
        });

        await expect(repository.getDirectReplyInteractions(parentEventId)).resolves.toMatchObject([{
            eventId: reply.id,
            fetchedAt: 0,
            relayUrls: ["wss://partial.example.com/"],
        }]);

        db.close();
    });

    it("partial取得は既存success freshnessを更新せずrelayだけを統合する", async () => {
        const db = createTestDb();
        let now = 1000;
        const repository = new DexiePostHistoryChildInteractionsRepository(db, () => now);
        const parentEventId = "1".repeat(64);
        const reply = createSignedEvent({
            id: "2".repeat(64),
            tags: [["e", parentEventId, "", "reply"]],
        });

        await repository.upsertChildInteractions({
            parentEventId,
            events: [{
                event: reply,
                relayUrls: ["wss://success.example.com"],
            }],
            fetchedAt: 900,
        });
        now = 1100;
        await repository.upsertChildInteractions({
            parentEventId,
            events: [{
                event: reply,
                relayUrls: ["wss://partial.example.com"],
            }],
            fetchedAt: null,
        });

        await expect(repository.getDirectReplyInteractions(parentEventId)).resolves.toMatchObject([{
            eventId: reply.id,
            fetchedAt: 900,
            relayUrls: [
                "wss://success.example.com/",
                "wss://partial.example.com/",
            ],
        }]);

        db.close();
    });
});
