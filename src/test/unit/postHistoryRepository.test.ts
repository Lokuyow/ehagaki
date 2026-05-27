import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    clearPostHistoryShouldReturnToLatestAfterLocalPost,
    consumePostHistoryShouldReturnToLatestAfterLocalPost,
} from "../../lib/postHistoryLatestRequest";
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
    clearPostHistoryShouldReturnToLatestAfterLocalPost();
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexiePostHistoryRepository", () => {
    it("default console 依存で初期化できる", () => {
        const db = createTestDb();

        expect(() => new DexiePostHistoryRepository(db, () => 1000)).not.toThrow();

        db.close();
    });

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
        expect(records[1].schemaVersion).toBe(2);

        db.close();
    });

    it("putPostedEvent 成功後に次回投稿履歴を latest に戻す one-shot marker を立てる", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);
        const eventId = "1".repeat(64);

        await repository.putPostedEvent({
            event: createSignedEvent({ id: eventId, pubkey }),
        });

        expect(
            consumePostHistoryShouldReturnToLatestAfterLocalPost(pubkey),
        ).toMatchObject({
            pubkeyHex: pubkey,
            eventId,
        });
        expect(
            consumePostHistoryShouldReturnToLatestAfterLocalPost(pubkey),
        ).toBeNull();

        db.close();
    });

    it("eventId で投稿履歴 record を取得できる", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const eventId = "1".repeat(64);

        await repository.putPostedEvent({
            event: createSignedEvent({ id: eventId }),
        });

        await expect(repository.getByEventId(eventId)).resolves.toMatchObject({
            eventId,
            rawEvent: { id: eventId },
        });
        await expect(repository.getByEventId("2".repeat(64))).resolves.toBeNull();

        db.close();
    });

    it("owner-scoped parent existence確認は指定pubkeyのeventIdだけを返す", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const ownerPubkey = "b".repeat(64);
        const otherPubkey = "d".repeat(64);
        const ownerEventId = "1".repeat(64);
        const otherEventId = "2".repeat(64);

        await repository.putPostedEvent({
            event: createSignedEvent({ id: ownerEventId, pubkey: ownerPubkey }),
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: otherEventId, pubkey: otherPubkey }),
        });

        await expect(repository.getExistingEventIdsForPubkey({
            pubkeyHex: ownerPubkey,
            eventIds: [ownerEventId, otherEventId, "3".repeat(64)],
        })).resolves.toEqual([ownerEventId]);

        db.close();
    });

    it("deleteForPubkey は指定 pubkey の投稿履歴だけを削除する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);
        const otherPubkey = "d".repeat(64);

        await repository.putPostedEvent({
            event: createSignedEvent({ id: "1".repeat(64), pubkey }),
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "2".repeat(64), pubkey: otherPubkey }),
        });

        await repository.deleteForPubkey(pubkey);

        await expect(repository.getAll({ pubkeyHex: pubkey })).resolves.toEqual([]);
        await expect(repository.getAll({ pubkeyHex: otherPubkey })).resolves.toHaveLength(1);

        db.close();
    });

    it("page 単位取得と件数取得、oldest createdAt 取得ができる", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);

        await repository.putPostedEvent({
            event: createSignedEvent({ id: "1".repeat(64), pubkey, created_at: 100 }),
            postedAt: 1000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "2".repeat(64), pubkey, created_at: 200 }),
            postedAt: 2000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "3".repeat(64), pubkey, created_at: 300 }),
            postedAt: 3000,
        });

        await expect(repository.countForPubkey(pubkey)).resolves.toBe(3);
        await expect(repository.getPage({ pubkeyHex: pubkey, page: 1, pageSize: 2 }))
            .resolves.toMatchObject([
                { eventId: "3".repeat(64) },
                { eventId: "2".repeat(64) },
            ]);
        await expect(repository.getPage({ pubkeyHex: pubkey, page: 2, pageSize: 2 }))
            .resolves.toMatchObject([
                { eventId: "1".repeat(64) },
            ]);
        await expect(repository.getOldestCreatedAt(pubkey)).resolves.toBe(100);

        db.close();
    });

    it("visibleUntil を指定した件数取得とページ取得は createdAt inclusive で絞り込む", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);

        await repository.putPostedEvent({
            event: createSignedEvent({ id: "1".repeat(64), pubkey, created_at: 500 }),
            postedAt: 500000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "2".repeat(64), pubkey, created_at: 1000 }),
            postedAt: 1000000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "3".repeat(64), pubkey, created_at: 1100 }),
            postedAt: 1100000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "4".repeat(64), pubkey, created_at: 1200 }),
            postedAt: 1200000,
        });

        await expect(repository.countVisibleForPubkey(pubkey, 1000)).resolves.toBe(3);
        await expect(repository.getVisiblePage({
            pubkeyHex: pubkey,
            visibleUntil: 1000,
            page: 1,
            pageSize: 10,
        })).resolves.toMatchObject([
            { eventId: "4".repeat(64), createdAt: 1200 },
            { eventId: "3".repeat(64), createdAt: 1100 },
            { eventId: "2".repeat(64), createdAt: 1000 },
        ]);
        await expect(repository.getVisiblePage({
            pubkeyHex: pubkey,
            visibleUntil: 1000,
            page: 2,
            pageSize: 2,
        })).resolves.toMatchObject([
            { eventId: "2".repeat(64), createdAt: 1000 },
        ]);

        db.close();
    });

    it("visible query でも表示順は postedAt desc / createdAt desc を維持する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);

        await repository.putPostedEvent({
            event: createSignedEvent({ id: "1".repeat(64), pubkey, created_at: 1000 }),
            postedAt: 4000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "2".repeat(64), pubkey, created_at: 1100 }),
            postedAt: 3000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "3".repeat(64), pubkey, created_at: 1050 }),
            postedAt: 4000,
        });

        const records = await repository.getVisibleAll({
            pubkeyHex: pubkey,
            visibleUntil: 1000,
        });

        expect(records.map((record) => record.eventId)).toEqual([
            "3".repeat(64),
            "1".repeat(64),
            "2".repeat(64),
        ]);

        db.close();
    });

    it("timeline chunk API は stable cursor で older/newer window を返す", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);

        await repository.putPostedEvent({
            event: createSignedEvent({ id: "1".repeat(64), pubkey, created_at: 1000 }),
            postedAt: 5000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "2".repeat(64), pubkey, created_at: 1100 }),
            postedAt: 5000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "3".repeat(64), pubkey, created_at: 1100 }),
            postedAt: 5000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "4".repeat(64), pubkey, created_at: 900 }),
            postedAt: 4000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "5".repeat(64), pubkey, created_at: 800 }),
            postedAt: 3000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "6".repeat(64), pubkey, created_at: 700 }),
            postedAt: 2000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "7".repeat(64), pubkey, created_at: 600 }),
            postedAt: 1000,
        });

        await expect(repository.getLatestVisibleChunk({
            pubkeyHex: pubkey,
            limit: 3,
        })).resolves.toMatchObject([
            { eventId: "3".repeat(64), postedAt: 5000, createdAt: 1100 },
            { eventId: "2".repeat(64), postedAt: 5000, createdAt: 1100 },
            { eventId: "1".repeat(64), postedAt: 5000, createdAt: 1000 },
        ]);

        await expect(repository.getOlderVisibleChunk({
            pubkeyHex: pubkey,
            limit: 2,
            cursor: {
                eventId: "2".repeat(64),
                postedAt: 5000,
                createdAt: 1100,
            },
        })).resolves.toMatchObject([
            { eventId: "1".repeat(64), postedAt: 5000, createdAt: 1000 },
            { eventId: "4".repeat(64), postedAt: 4000, createdAt: 900 },
        ]);

        await expect(repository.getNewerVisibleChunk({
            pubkeyHex: pubkey,
            limit: 2,
            cursor: {
                eventId: "7".repeat(64),
                postedAt: 1000,
                createdAt: 600,
            },
        })).resolves.toMatchObject([
            { eventId: "5".repeat(64), postedAt: 3000, createdAt: 800 },
            { eventId: "6".repeat(64), postedAt: 2000, createdAt: 700 },
        ]);

        await expect(repository.getVisibleChunkAroundEventId({
            pubkeyHex: pubkey,
            eventId: "5".repeat(64),
            limit: 3,
            keepAbove: 1,
        })).resolves.toMatchObject([
            { eventId: "4".repeat(64), postedAt: 4000, createdAt: 900 },
            { eventId: "5".repeat(64), postedAt: 3000, createdAt: 800 },
            { eventId: "6".repeat(64), postedAt: 2000, createdAt: 700 },
        ]);

        db.close();
    });

    it("date chunk API は visibleUntil を守って指定日時以前の local chunk を返す", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);

        await repository.putPostedEvent({
            event: createSignedEvent({ id: "1".repeat(64), pubkey, created_at: 900 }),
            postedAt: 9000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "2".repeat(64), pubkey, created_at: 1000 }),
            postedAt: 10000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "3".repeat(64), pubkey, created_at: 1100 }),
            postedAt: 11000,
        });
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "4".repeat(64), pubkey, created_at: 1200 }),
            postedAt: 12000,
        });

        await expect(repository.getVisibleChunkFromCreatedAt({
            pubkeyHex: pubkey,
            visibleUntil: 1000,
            createdAt: 1150,
            limit: 2,
        })).resolves.toMatchObject([
            { eventId: "3".repeat(64), createdAt: 1100 },
            { eventId: "2".repeat(64), createdAt: 1000 },
        ]);

        await expect(repository.getVisibleChunkFromCreatedAt({
            pubkeyHex: pubkey,
            visibleUntil: 1000,
            createdAt: 950,
            limit: 2,
        })).resolves.toMatchObject([
            { eventId: "3".repeat(64), createdAt: 1100 },
            { eventId: "2".repeat(64), createdAt: 1000 },
        ]);

        await expect(repository.getVisibleChunkFromCreatedAt({
            pubkeyHex: pubkey,
            visibleUntil: 1000,
            createdAt: 950,
            limit: 2,
            query: {
                contiguous: false,
            },
        })).resolves.toMatchObject([
            { eventId: "1".repeat(64), createdAt: 900 },
        ]);

        db.close();
    });

    it("relay 取得イベントを upsert しても既存 local record の主要フィールドを壊さない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 7000);
        const pubkey = "b".repeat(64);
        const eventId = "1".repeat(64);

        await repository.putPostedEvent({
            event: createSignedEvent({
                id: eventId,
                pubkey,
                content: "local content",
                created_at: 100,
            }),
            acceptedRelays: ["wss://accepted.example.com"],
            relayHints: ["wss://hint.example.com"],
            postedAt: 5000,
        });
        await repository.markDeleted(eventId, "d".repeat(64), 6000);

        const result = await repository.upsertFetchedEvents({
            events: [
                {
                    event: createSignedEvent({
                        id: eventId,
                        pubkey,
                        content: "local content",
                        created_at: 100,
                    }),
                    relayUrls: ["wss://fetched.example.com"],
                },
            ],
            fetchedAt: 7000,
        });

        const [record] = await repository.getAll({ pubkeyHex: pubkey });

        expect(result).toEqual({
            insertedCount: 0,
            updatedCount: 1,
            unchangedCount: 0,
        });
        expect(record.acceptedRelays).toEqual(["wss://accepted.example.com/"]);
        expect(record.relayHints).toEqual([
            "wss://hint.example.com/",
            "wss://accepted.example.com/",
            "wss://fetched.example.com/",
        ]);
        expect(record.fetchedRelays).toEqual(["wss://fetched.example.com/"]);
        expect(record.postedAt).toBe(5000);
        expect(record.deletedAt).toBe(6000);
        expect(record.deletionEventId).toBe("d".repeat(64));
        expect(record.fetchedAt).toBe(7000);
        expect(record.lastSeenAt).toBe(7000);
        expect(record.rawEvent).toMatchObject({
            id: eventId,
            content: "local content",
        });
        await expect(repository.countForPubkey(pubkey)).resolves.toBe(1);

        db.close();
    });

    it("kind:42 の root e tag から channel 情報を保存する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 9000);
        const pubkey = "b".repeat(64);

        const result = await repository.upsertFetchedEvents({
            events: [
                {
                    event: createSignedEvent({
                        id: "4".repeat(64),
                        pubkey,
                        kind: 42,
                        tags: [
                            ["e", "channel-id", "wss://channel.example.com", "root"],
                            ["e", "reply-id", "wss://reply.example.com", "reply"],
                        ],
                        created_at: 321,
                    }),
                    relayUrls: ["wss://relay.example.com"],
                },
            ],
            fetchedAt: 9000,
        });

        const [record] = await repository.getAll({ pubkeyHex: pubkey });

        expect(result).toEqual({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
        });
        expect(record.kind).toBe(42);
        expect(record.channelEventId).toBe("channel-id");
        expect(record.channelRelayHints).toEqual(["wss://channel.example.com/"]);
        expect(record).not.toHaveProperty("channelName");
        expect(record.postedAt).toBe(321000);

        db.close();
    });

    it("同一 fetched event を再 upsert しても実質変更がなければ unchanged として返す", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 9000);
        const pubkey = "b".repeat(64);

        await repository.upsertFetchedEvents({
            events: [
                {
                    event: createSignedEvent({
                        id: "5".repeat(64),
                        pubkey,
                        created_at: 654,
                    }),
                    relayUrls: ["wss://relay.example.com"],
                },
            ],
            fetchedAt: 9000,
        });

        const result = await repository.upsertFetchedEvents({
            events: [
                {
                    event: createSignedEvent({
                        id: "5".repeat(64),
                        pubkey,
                        created_at: 654,
                    }),
                    relayUrls: ["wss://relay.example.com"],
                },
            ],
            fetchedAt: 9500,
        });

        expect(result).toEqual({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 1,
        });

        db.close();
    });

    it("同一 eventId の fetched event が矛盾した場合は既存 rawEvent を維持する", async () => {
        const db = createTestDb();
        const mockConsole = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        } as unknown as Console;
        const repository = new DexiePostHistoryRepository(db, () => 7000, mockConsole);
        const pubkey = "b".repeat(64);
        const eventId = "1".repeat(64);

        await repository.putPostedEvent({
            event: createSignedEvent({
                id: eventId,
                pubkey,
                content: "local content",
                created_at: 100,
            }),
            postedAt: 5000,
        });

        await repository.upsertFetchedEvents({
            events: [
                {
                    event: createSignedEvent({
                        id: eventId,
                        pubkey,
                        content: "remote different content",
                        created_at: 100,
                    }),
                    relayUrls: ["wss://fetched.example.com"],
                },
            ],
            fetchedAt: 7000,
        });

        const [record] = await repository.getAll({ pubkeyHex: pubkey });
        expect(record.content).toBe("local content");
        expect(record.rawEvent).toMatchObject({ content: "local content" });
        expect(mockConsole.warn).toHaveBeenCalledWith("post_history_raw_event_conflict", eventId);

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
