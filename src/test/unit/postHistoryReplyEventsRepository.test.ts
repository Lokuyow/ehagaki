import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryReplyEventsRepository } from "../../lib/storage/postHistoryReplyEventsRepository";

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

describe("DexiePostHistoryReplyEventsRepository", () => {
    it("parentId が一致する kind:1 直接リプライだけを保存し、古い順で取得する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryReplyEventsRepository(db, () => 1000);
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

        const result = await repository.upsertDirectReplies({
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

        const replies = await repository.getDirectReplies(parentEventId);
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

    it("同じeventを再保存してもPostHistoryRecordには混ぜない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryReplyEventsRepository(db, () => 1000);
        const parentEventId = "1".repeat(64);
        const reply = createSignedEvent({
            id: "2".repeat(64),
            tags: [["e", parentEventId, "", "reply"]],
        });

        await repository.upsertDirectReplies({
            parentEventId,
            events: [{ event: reply }],
        });
        await repository.upsertDirectReplies({
            parentEventId,
            events: [{ event: reply, relayUrls: ["wss://relay.example.com"] }],
        });

        await expect(db.postHistory.count()).resolves.toBe(0);
        await expect(repository.getDirectReplies(parentEventId)).resolves.toHaveLength(1);

        db.close();
    });
});
