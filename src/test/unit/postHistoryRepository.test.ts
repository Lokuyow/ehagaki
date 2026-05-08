import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-post-history-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

function createSignedEvent(overrides: Record<string, any> = {}) {
    return {
        id: "a".repeat(64),
        pubkey: "b".repeat(64),
        kind: 1,
        content: "hello\nhttps://example.com/a.mp4",
        tags: [
            [
                "imeta",
                "url https://example.com/a.jpg",
                "m image/jpeg",
                "alt sample",
                "blurhash LEHV6nWB2yk8pyo0adR*.7kCMdnj",
                "dim 640x480",
                "size 1234",
                "uploadProtocol blossom",
            ],
        ],
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

describe("DexiePostHistoryRepository", () => {
    it("signed event を保存して pubkey ごとに postedAt 降順で取得する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);

        await repository.putPostedEvent({
            event: createSignedEvent({ id: "1".repeat(64), pubkey }),
            acceptedRelays: ["wss://relay1.example.com"],
            relayHints: ["wss://relay2.example.com"],
            postedAt: 1000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "2".repeat(64), pubkey }),
            postedAt: 2000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "3".repeat(64), pubkey: "d".repeat(64) }),
            postedAt: 3000,
        });

        const records = await repository.getAll({ pubkeyHex: pubkey });

        expect(records.map((record) => record.eventId)).toEqual([
            "2".repeat(64),
            "1".repeat(64),
        ]);
        expect(records[1].rawEvent).toMatchObject({
            id: "1".repeat(64),
            sig: "c".repeat(128),
        });
        expect(records[1].acceptedRelays).toEqual(["wss://relay1.example.com/"]);
        expect(records[1].relayHints).toEqual([
            "wss://relay2.example.com/",
            "wss://relay1.example.com/",
        ]);
        expect(records[1].media).toEqual([
            {
                url: "https://example.com/a.jpg",
                mimeType: "image/jpeg",
                alt: "sample",
                blurhash: "LEHV6nWB2yk8pyo0adR*.7kCMdnj",
                dim: "640x480",
                size: 1234,
                uploadProtocol: "blossom",
            },
            {
                url: "https://example.com/a.mp4",
                mimeType: "video/mp4",
            },
        ]);

        db.close();
    });

    it("markDeleted で削除情報を追記する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const eventId = "a".repeat(64);

        await repository.putPostedEvent({ event: createSignedEvent({ id: eventId }) });
        await repository.markDeleted(eventId, "d".repeat(64), 2000);

        const [record] = await repository.getAll({ pubkeyHex: "b".repeat(64) });
        expect(record.deletedAt).toBe(2000);
        expect(record.deletionEventId).toBe("d".repeat(64));

        db.close();
    });
});
