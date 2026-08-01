import "fake-indexeddb/auto";
import Dexie, { cmp } from "dexie";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    getPostHistorySearchRevision,
    resetPostHistoryLocalSearchRevisionsForTesting,
} from "../../lib/postHistoryLocalSearchRevision";
import {
    clearPostHistoryShouldReturnToLatestAfterLocalPost,
    consumePostHistoryShouldReturnToLatestAfterLocalPost,
} from "../../lib/postHistoryLatestRequest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import type {
    PostHistoryChildInteractionRecord,
    PostHistoryRecord,
} from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryDeletionRequestsRepository } from "../../lib/storage/postHistoryDeletionRequestsRepository";
import {
    comparePostHistoryTimelineOrder,
    DexiePostHistoryRepository,
} from "../../lib/storage/postHistoryRepository";
import { POST_HISTORY_TIMELINE_INDEX } from "../../lib/storage/ehagakiDbConstants";

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

function createDeletionEvent(targetEventId: string, overrides: Record<string, any> = {}) {
    return {
        id: "d".repeat(64),
        pubkey: "b".repeat(64),
        kind: 5,
        content: "",
        tags: [["e", targetEventId]],
        created_at: 100,
        sig: "e".repeat(128),
        ...overrides,
    };
}

function createPostHistoryRecord(input: {
    eventId: string;
    pubkeyHex: string;
    createdAt: number;
    postedAt: number;
}): PostHistoryRecord {
    return {
        id: input.eventId,
        eventId: input.eventId,
        pubkeyHex: input.pubkeyHex,
        kind: 1,
        content: input.eventId,
        tags: [],
        createdAt: input.createdAt,
        postedAt: input.postedAt,
        relayHints: [],
        acceptedRelays: [],
        media: [],
        rawEvent: null,
        updatedAt: input.postedAt,
        schemaVersion: 2,
    };
}

function createInstrumentedTimelineDb(records: PostHistoryRecord[]) {
    const timelineKey = (record: PostHistoryRecord) => [
        record.pubkeyHex,
        record.postedAt,
        record.createdAt,
        record.eventId,
    ];
    const ascending = [...records].sort((left, right) =>
        cmp(timelineKey(left), timelineKey(right))
    );
    const materializedCounts: number[] = [];
    const queriedIndexes: string[] = [];

    class InstrumentedCollection {
        private reversed = false;
        private maximum = Number.POSITIVE_INFINITY;
        private predicates: Array<(record: PostHistoryRecord) => boolean> = [];

        constructor(
            private readonly lower: unknown,
            private readonly upper: unknown,
            private readonly includeLower: boolean,
            private readonly includeUpper: boolean,
        ) {}

        reverse() {
            this.reversed = !this.reversed;
            return this;
        }

        filter(predicate: (record: PostHistoryRecord) => boolean) {
            this.predicates.push(predicate);
            return this;
        }

        limit(limit: number) {
            this.maximum = Math.min(this.maximum, limit);
            return this;
        }

        private materialize(): PostHistoryRecord[] {
            const result: PostHistoryRecord[] = [];
            const source = this.reversed ? [...ascending].reverse() : ascending;
            for (const record of source) {
                const key = timelineKey(record);
                const lowerComparison = cmp(key, this.lower);
                const upperComparison = cmp(key, this.upper);
                if (
                    (lowerComparison < 0 || (!this.includeLower && lowerComparison === 0))
                    || (upperComparison > 0 || (!this.includeUpper && upperComparison === 0))
                    || this.predicates.some((predicate) => !predicate(record))
                ) {
                    continue;
                }

                result.push(record);
                if (result.length >= this.maximum) break;
            }
            materializedCounts.push(result.length);
            return result;
        }

        async toArray() {
            return this.materialize();
        }

        async first() {
            const previousMaximum = this.maximum;
            this.maximum = 1;
            const [first] = this.materialize();
            this.maximum = previousMaximum;
            return first;
        }
    }

    const postHistory = {
        where(index: string) {
            queriedIndexes.push(index);
            return {
                between(
                    lower: unknown,
                    upper: unknown,
                    includeLower = true,
                    includeUpper = true,
                ) {
                    return new InstrumentedCollection(
                        lower,
                        upper,
                        includeLower,
                        includeUpper,
                    );
                },
            };
        },
        async get(eventId: string) {
            return records.find((record) => record.eventId === eventId);
        },
    };

    return {
        db: {
            postHistory,
            transaction: async (_mode: string, _table: unknown, callback: () => unknown) => callback(),
        },
        materializedCounts,
        queriedIndexes,
    };
}

function monitorDeletionRequestTargetQueries(db: EHagakiDB) {
    const originalWhere = db.postHistoryDeletionRequests.where.bind(db.postHistoryDeletionRequests);
    const anyOfArgs: string[][] = [];
    const equalsArgs: string[] = [];
    const whereSpy = vi.spyOn(db.postHistoryDeletionRequests, "where");

    whereSpy.mockImplementation(((index: string) => {
        const clause = originalWhere(index as any) as any;
        const originalAnyOf = clause.anyOf.bind(clause);
        const originalEquals = clause.equals.bind(clause);

        clause.anyOf = ((keys: string[]) => {
            anyOfArgs.push([...keys]);
            return originalAnyOf(keys);
        }) as any;
        clause.equals = ((key: string) => {
            equalsArgs.push(key);
            return originalEquals(key);
        }) as any;

        return clause;
    }) as any);

    return { anyOfArgs, equalsArgs, whereSpy };
}

afterEach(async () => {
    clearPostHistoryShouldReturnToLatestAfterLocalPost();
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

beforeEach(() => {
    resetPostHistoryLocalSearchRevisionsForTesting();
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

    it("deleteLocalHistoryForPubkey は関連キャッシュを一括削除してから対象履歴だけを削除し、commit後に検索リビジョンを更新する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);
        const otherPubkey = "d".repeat(64);
        const ownerEventIds = ["1".repeat(64), "2".repeat(64)];
        const otherEventId = "3".repeat(64);

        for (const [index, eventId] of ownerEventIds.entries()) {
            await repository.putPostedEvent({
                event: createSignedEvent({
                    id: eventId,
                    pubkey,
                    created_at: 100 + index,
                }),
            });
        }
        await repository.putPostedEvent({
            event: createSignedEvent({ id: otherEventId, pubkey: otherPubkey }),
        });

        const createChild = (
            eventId: string,
            parentEventId: string,
        ): PostHistoryChildInteractionRecord => ({
            id: eventId,
            eventId,
            parentEventId,
            authorPubkey: "e".repeat(64),
            kind: 1,
            content: "reply",
            tags: [],
            createdAt: 100,
            relayUrls: [],
            discoveredAs: ["direct-reply"],
            rawEvent: {},
            fetchedAt: 1000,
            updatedAt: 1000,
            schemaVersion: 1,
        });
        await db.postHistoryChildInteractions.bulkPut([
            createChild("4".repeat(64), ownerEventIds[0]),
            createChild("5".repeat(64), ownerEventIds[1]),
            createChild("6".repeat(64), otherEventId),
        ]);

        const transactionSpy = vi.spyOn(db, "transaction");
        const revisionBefore = getPostHistorySearchRevision(pubkey);

        await repository.deleteLocalHistoryForPubkey(pubkey);

        expect(transactionSpy).toHaveBeenCalledOnce();
        await expect(repository.getAll({ pubkeyHex: pubkey })).resolves.toEqual([]);
        await expect(repository.getAll({ pubkeyHex: otherPubkey })).resolves.toHaveLength(1);
        await expect(
            db.postHistoryChildInteractions.where("parentEventId").equals(ownerEventIds[0]).count(),
        ).resolves.toBe(0);
        await expect(
            db.postHistoryChildInteractions.where("parentEventId").equals(ownerEventIds[1]).count(),
        ).resolves.toBe(0);
        await expect(
            db.postHistoryChildInteractions.where("parentEventId").equals(otherEventId).count(),
        ).resolves.toBe(1);
        expect(getPostHistorySearchRevision(pubkey)).toBeGreaterThan(revisionBefore);

        db.close();
    });

    it("deleteLocalHistoryForPubkey はtransaction失敗時に検索リビジョンを更新しない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "1".repeat(64), pubkey }),
        });
        const revisionBefore = getPostHistorySearchRevision(pubkey);
        const transactionSpy = vi
            .spyOn(db, "transaction")
            .mockRejectedValueOnce(new Error("transaction failed"));

        await expect(repository.deleteLocalHistoryForPubkey(pubkey)).rejects.toThrow(
            "transaction failed",
        );
        expect(transactionSpy).toHaveBeenCalledOnce();
        expect(getPostHistorySearchRevision(pubkey)).toBe(revisionBefore);
        await expect(repository.getAll({ pubkeyHex: pubkey })).resolves.toHaveLength(1);

        transactionSpy.mockRestore();
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

    it("countVisibleForPubkey は visibleUntil 境界を inclusive に扱い他 pubkey を含めない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);
        const otherPubkey = "c".repeat(64);

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
        await repository.putPostedEvent({
            event: createSignedEvent({ id: "5".repeat(64), pubkey: otherPubkey, created_at: 1500 }),
            postedAt: 1500000,
        });

        await expect(repository.countVisibleForPubkey(pubkey, 1000)).resolves.toBe(3);
        await expect(repository.countVisibleForPubkey(pubkey, 1001)).resolves.toBe(2);
        await expect(repository.countVisibleForPubkey(otherPubkey, 1000)).resolves.toBe(1);

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
            appliedDeletionCount: 0,
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
        const channelEventId = "c".repeat(64);

        const result = await repository.upsertFetchedEvents({
            events: [
                {
                    event: createSignedEvent({
                        id: "4".repeat(64),
                        pubkey,
                        kind: 42,
                        tags: [
                            ["e", channelEventId, "wss://channel.example.com", "root"],
                            ["e", "d".repeat(64), "wss://reply.example.com", "reply"],
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
            appliedDeletionCount: 0,
        });
        expect(record.kind).toBe(42);
        expect(record.channelEventId).toBe(channelEventId);
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
            appliedDeletionCount: 0,
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

    it("markDeleted は primary key で所有者を特定し、実際の変更時だけその pubkey の revision を進める", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const eventId = "a".repeat(64);
        const pubkey = "b".repeat(64);
        const otherPubkey = "c".repeat(64);

        await repository.putPostedEvent({ event: createSignedEvent({ id: eventId, pubkey }) });
        resetPostHistoryLocalSearchRevisionsForTesting();
        const getSpy = vi.spyOn(db.postHistory, "get");

        await repository.markDeleted(eventId, "d".repeat(64), 2000);
        expect(getSpy).toHaveBeenCalledWith(eventId);
        expect(getPostHistorySearchRevision(pubkey)).toBe(1);
        expect(getPostHistorySearchRevision(otherPubkey)).toBe(0);

        await repository.markDeleted(eventId, "d".repeat(64), 2000);
        await repository.markDeleted("missing", "e".repeat(64), 3000);
        expect(getPostHistorySearchRevision(pubkey)).toBe(1);

        db.close();
    });

    it("markDeleted の DB 更新失敗時は revision を進めない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const eventId = "a".repeat(64);
        const pubkey = "b".repeat(64);

        await repository.putPostedEvent({ event: createSignedEvent({ id: eventId, pubkey }) });
        resetPostHistoryLocalSearchRevisionsForTesting();
        vi.spyOn(db.postHistory, "put").mockRejectedValueOnce(new Error("write failed"));

        await expect(repository.markDeleted(eventId, "d".repeat(64), 2000))
            .rejects.toThrow("write failed");
        expect(getPostHistorySearchRevision(pubkey)).toBe(0);

        db.close();
    });

    it("upsertFetchedEvents は insert・material update・適用済み削除の pubkey だけ revision を進める", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const existingPubkey = "b".repeat(64);
        const insertedPubkey = "c".repeat(64);
        const existingEvent = createSignedEvent({
            id: "a".repeat(64),
            pubkey: existingPubkey,
        });

        await repository.putPostedEvent({ event: existingEvent });
        resetPostHistoryLocalSearchRevisionsForTesting();

        await repository.upsertFetchedEvents({
            events: [
                { event: existingEvent },
                {
                    event: createSignedEvent({
                        id: "d".repeat(64),
                        pubkey: insertedPubkey,
                    }),
                },
            ],
        });

        expect(getPostHistorySearchRevision(existingPubkey)).toBe(0);
        expect(getPostHistorySearchRevision(insertedPubkey)).toBe(1);

        db.close();
    });

    it("canonical comparator と compound cursor は tie group の全文字列キーを同じ順序でページングする", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);
        const otherPubkey = "c".repeat(64);
        const eventIds = [
            "0".repeat(64),
            "9".repeat(64),
            "a".repeat(64),
            "f".repeat(64),
            "A".repeat(64),
            "g".repeat(64),
        ];
        const records = eventIds.map((eventId) => createPostHistoryRecord({
            eventId,
            pubkeyHex: pubkey,
            postedAt: 5_000,
            createdAt: 1_000,
        }));
        await db.postHistory.bulkPut([
            ...records,
            createPostHistoryRecord({
                eventId: "z".repeat(64),
                pubkeyHex: otherPubkey,
                postedAt: 5_000,
                createdAt: 1_000,
            }),
        ]);

        const expected = [...records].sort(comparePostHistoryTimelineOrder);
        const indexOrder = await db.postHistory
            .where(POST_HISTORY_TIMELINE_INDEX)
            .between([pubkey], [pubkey, Dexie.maxKey])
            .reverse()
            .toArray();
        expect(indexOrder.map((record) => record.eventId)).toEqual(
            expected.map((record) => record.eventId),
        );

        for (const limit of [1, 3, eventIds.length]) {
            await expect(repository.getLatestVisibleChunk({
                pubkeyHex: pubkey,
                limit,
            })).resolves.toEqual(expected.slice(0, limit));
        }
        await expect(repository.getPage({
            pubkeyHex: pubkey,
            page: 1,
            pageSize: 3,
        })).resolves.toEqual(expected.slice(0, 3));

        const paged: PostHistoryRecord[] = [];
        let cursor: PostHistoryRecord | undefined;
        do {
            const chunk = cursor
                ? await repository.getOlderVisibleChunk({
                    pubkeyHex: pubkey,
                    cursor,
                    limit: 2,
                })
                : await repository.getLatestVisibleChunk({
                    pubkeyHex: pubkey,
                    limit: 2,
                });
            paged.push(...chunk);
            cursor = chunk[chunk.length - 1];
            if (chunk.length < 2) break;
        } while (cursor);

        expect(paged).toEqual(expected);
        expect(new Set(paged.map((record) => record.eventId)).size).toBe(expected.length);

        const boundary = expected[4]!;
        await expect(repository.getNewerVisibleChunk({
            pubkeyHex: pubkey,
            cursor: boundary,
            limit: 2,
        })).resolves.toEqual(expected.slice(2, 4));
        await expect(repository.getVisibleChunkAroundEventId({
            pubkeyHex: pubkey,
            eventId: boundary.eventId,
            keepAbove: 2,
            limit: 4,
        })).resolves.toEqual(expected.slice(2, 6));

        db.close();
    });

    it("67,000件でも通常window queryは全件取得APIを経由せずlimit内を返す", async () => {
        const pubkey = "b".repeat(64);
        const total = 67_000;
        const records = Array.from({ length: total }, (_, index) => {
            const order = total - index;
            return createPostHistoryRecord({
                eventId: order.toString(16).padStart(64, "0"),
                pubkeyHex: pubkey,
                postedAt: order,
                createdAt: order,
            });
        });
        const { db, materializedCounts, queriedIndexes } = createInstrumentedTimelineDb(records);
        const repository = new DexiePostHistoryRepository(db as any, () => 1000);

        const latest = await repository.getLatestVisibleChunk({
            pubkeyHex: pubkey,
            visibleUntil: 1,
            limit: 25,
        });
        const older = await repository.getOlderVisibleChunk({
            pubkeyHex: pubkey,
            visibleUntil: 1,
            cursor: latest.at(-1)!,
            limit: 25,
        });
        const newer = await repository.getNewerVisibleChunk({
            pubkeyHex: pubkey,
            visibleUntil: 1,
            cursor: older[0]!,
            limit: 10,
        });
        const dateChunk = await repository.getVisibleChunkFromCreatedAt({
            pubkeyHex: pubkey,
            visibleUntil: 1,
            createdAt: 33_500,
            limit: 25,
        });
        const around = await repository.getVisibleChunkAroundEventId({
            pubkeyHex: pubkey,
            visibleUntil: 1,
            eventId: records[33_500]!.eventId,
            keepAbove: 5,
            limit: 25,
        });

        expect([latest, older, dateChunk, around].map((chunk) => chunk.length))
            .toEqual([25, 25, 25, 25]);
        expect(newer).toHaveLength(10);
        expect(queriedIndexes).not.toContain("[pubkeyHex+postedAt]");
        expect(queriedIndexes.every((index) => index === POST_HISTORY_TIMELINE_INDEX))
            .toBe(true);
        expect(Math.max(...materializedCounts)).toBeLessThanOrEqual(25);
    });

    it("visibleUntil より古い保存投稿を index で検出し、sparse chunk を前後へ移動できる", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);

        for (const [id, createdAt] of [["1", 1200], ["2", 1100], ["3", 900], ["4", 800], ["5", 700]] as const) {
            await repository.putPostedEvent({
                event: createSignedEvent({ id: id.repeat(64), pubkey, created_at: createdAt }),
                postedAt: createdAt * 1000,
            });
        }

        await expect(repository.hasPostsBeforeCreatedAt(pubkey, 1000)).resolves.toBe(true);
        await expect(repository.hasPostsBeforeCreatedAt(pubkey, 700)).resolves.toBe(false);

        const nearest = await repository.getSparseChunk({
            pubkeyHex: pubkey,
            visibleUntil: 1000,
            direction: "latest",
            limit: 1,
        });
        expect(nearest).toMatchObject([{ eventId: "3".repeat(64), createdAt: 900 }]);

        const older = await repository.getSparseChunk({
            pubkeyHex: pubkey,
            visibleUntil: 1000,
            direction: "older",
            cursor: nearest[0]!,
            limit: 1,
        });
        expect(older).toMatchObject([{ eventId: "4".repeat(64), createdAt: 800 }]);

        const newer = await repository.getSparseChunk({
            pubkeyHex: pubkey,
            visibleUntil: 1000,
            direction: "newer",
            cursor: older[0]!,
            limit: 1,
        });
        expect(newer).toMatchObject([{ eventId: "3".repeat(64), createdAt: 900 }]);
        db.close();
    });

    it("sparse query を対象pubkeyへ限定し、大量投稿と同一時刻をchunk単位で往復する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const smallerPubkey = "a".repeat(64);
        const pubkey = "b".repeat(64);
        const largerPubkey = "c".repeat(64);
        const id = (value: number) => value.toString(16).padStart(64, "0");
        const targetRecords: PostHistoryRecord[] = [
            createPostHistoryRecord({ eventId: "f".repeat(64), pubkeyHex: pubkey, createdAt: 900, postedAt: 5_000 }),
            createPostHistoryRecord({ eventId: "e".repeat(64), pubkeyHex: pubkey, createdAt: 900, postedAt: 5_000 }),
            createPostHistoryRecord({ eventId: "d".repeat(64), pubkeyHex: pubkey, createdAt: 800, postedAt: 5_000 }),
            ...Array.from({ length: 2_000 }, (_, index) => createPostHistoryRecord({
                eventId: id(index + 1),
                pubkeyHex: pubkey,
                createdAt: 700 - index,
                postedAt: 4_000 - index,
            })),
        ];
        const foreignRecords = [
            createPostHistoryRecord({ eventId: "8".repeat(64), pubkeyHex: smallerPubkey, createdAt: 950, postedAt: 9_000 }),
            createPostHistoryRecord({ eventId: "9".repeat(64), pubkeyHex: largerPubkey, createdAt: 940, postedAt: 8_000 }),
        ];
        await db.postHistory.bulkPut([...targetRecords, ...foreignRecords]);

        const latest = await repository.getSparseChunk({
            pubkeyHex: pubkey,
            visibleUntil: 1_000,
            direction: "latest",
            limit: 2,
        });
        expect(latest.map((record) => record.eventId)).toEqual([
            "f".repeat(64),
            "e".repeat(64),
        ]);

        const older = await repository.getSparseChunk({
            pubkeyHex: pubkey,
            visibleUntil: 1_000,
            direction: "older",
            cursor: latest[1]!,
            limit: 2,
        });
        expect(older.map((record) => record.eventId)).toEqual([
            "d".repeat(64),
            id(1),
        ]);

        const newer = await repository.getSparseChunk({
            pubkeyHex: pubkey,
            visibleUntil: 1_000,
            direction: "newer",
            cursor: older[0]!,
            limit: 2,
        });
        expect(newer.map((record) => record.eventId)).toEqual([
            "f".repeat(64),
            "e".repeat(64),
        ]);

        for (const chunk of [latest, older, newer]) {
            expect(chunk).toHaveLength(2);
            expect(chunk.every((record) => record.pubkeyHex === pubkey)).toBe(true);
            expect(new Set(chunk.map((record) => record.eventId)).size).toBe(chunk.length);
        }

        db.close();
    });

    it("範囲外投稿の存在判定へ辞書順が前後する別pubkeyを混入させない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 1000);
        const pubkey = "b".repeat(64);
        await db.postHistory.bulkPut([
            createPostHistoryRecord({ eventId: "1".repeat(64), pubkeyHex: "a".repeat(64), createdAt: 100, postedAt: 100 }),
            createPostHistoryRecord({ eventId: "2".repeat(64), pubkeyHex: "c".repeat(64), createdAt: 100, postedAt: 100 }),
            createPostHistoryRecord({ eventId: "3".repeat(64), pubkeyHex: pubkey, createdAt: 1_100, postedAt: 1_100 }),
        ]);

        await expect(repository.hasPostsBeforeCreatedAt(pubkey, 1_000)).resolves.toBe(false);

        await db.postHistory.put(createPostHistoryRecord({
            eventId: "4".repeat(64),
            pubkeyHex: pubkey,
            createdAt: 900,
            postedAt: 900,
        }));
        await expect(repository.hasPostsBeforeCreatedAt(pubkey, 1_000)).resolves.toBe(true);

        db.close();
    });

    it("複数 fetched event を一括 upsert しても削除要求取得は targetEventId index の batch query 1回で済む", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 2000);
        const deletionRepository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const pubkey = "b".repeat(64);
        const foreignPubkey = "c".repeat(64);
        const unchangedEvent = createSignedEvent({ id: "1".repeat(64), pubkey, content: "same", created_at: 100 });
        const updatedEvent = createSignedEvent({ id: "2".repeat(64), pubkey, content: "same", created_at: 200 });
        const insertedEvent = createSignedEvent({ id: "3".repeat(64), pubkey, content: "new", created_at: 300 });
        const unmatchedEvent = createSignedEvent({
            id: "4".repeat(64),
            pubkey: foreignPubkey,
            content: "foreign",
            created_at: 400,
        });

        await deletionRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: pubkey,
            deletionEvents: [
                createDeletionEvent(unchangedEvent.id, {
                    id: "a".repeat(64),
                    pubkey,
                    created_at: 700,
                }),
                createDeletionEvent(updatedEvent.id, {
                    id: "b".repeat(64),
                    pubkey,
                    created_at: 900,
                }),
                createDeletionEvent(updatedEvent.id, {
                    id: "c".repeat(64),
                    pubkey,
                    created_at: 800,
                }),
                createDeletionEvent(unmatchedEvent.id, {
                    id: "f".repeat(64),
                    pubkey,
                    created_at: 600,
                }),
            ],
        });
        await repository.putPostedEvent({ event: unchangedEvent });
        await repository.putPostedEvent({ event: updatedEvent });

        const { anyOfArgs, equalsArgs, whereSpy } = monitorDeletionRequestTargetQueries(db);

        const result = await repository.upsertFetchedEvents({
            events: [
                { event: unchangedEvent },
                { event: updatedEvent, relayUrls: ["wss://updated.example.com"] },
                { event: insertedEvent },
                { event: insertedEvent, relayUrls: ["wss://dedup.example.com"] },
                { event: unmatchedEvent },
            ],
        });

        expect(whereSpy).toHaveBeenCalledTimes(1);
        expect(whereSpy).toHaveBeenCalledWith("targetEventId");
        expect(anyOfArgs).toEqual([[
            unchangedEvent.id,
            updatedEvent.id,
            insertedEvent.id,
            unmatchedEvent.id,
        ]]);
        expect(equalsArgs).toEqual([]);
        expect(result).toEqual({
            insertedCount: 2,
            updatedCount: 1,
            unchangedCount: 1,
            appliedDeletionCount: 2,
        });

        await expect(db.postHistory.get(unchangedEvent.id)).resolves.toMatchObject({
            deletedAt: 700_000,
            deletionEventId: "a".repeat(64),
        });
        await expect(db.postHistory.get(updatedEvent.id)).resolves.toMatchObject({
            deletedAt: 800_000,
            deletionEventId: "c".repeat(64),
            fetchedRelays: ["wss://updated.example.com/"],
        });
        await expect(db.postHistory.get(insertedEvent.id)).resolves.toMatchObject({
            fetchedRelays: ["wss://dedup.example.com/"],
        });
        const savedUnmatched = await db.postHistory.get(unmatchedEvent.id);
        expect(savedUnmatched).toBeDefined();
        expect(savedUnmatched).not.toHaveProperty("deletedAt");

        const deletionRecords = await db.postHistoryDeletionRequests.toArray();
        expect(deletionRecords).toEqual(expect.arrayContaining([
            expect.objectContaining({
                targetEventId: unchangedEvent.id,
                deletionEventId: "a".repeat(64),
                targetVerified: true,
            }),
            expect.objectContaining({
                targetEventId: updatedEvent.id,
                deletionEventId: "b".repeat(64),
                targetVerified: true,
            }),
            expect.objectContaining({
                targetEventId: updatedEvent.id,
                deletionEventId: "c".repeat(64),
                targetVerified: true,
            }),
            expect.objectContaining({
                targetEventId: unmatchedEvent.id,
                deletionEventId: "f".repeat(64),
                targetVerified: false,
            }),
        ]));

        whereSpy.mockRestore();
        db.close();
    });

    it("削除要求が0件でも複数 fetched event を batch 保存できる", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 2000);
        const firstEvent = createSignedEvent({ id: "5".repeat(64), created_at: 500 });
        const secondEvent = createSignedEvent({ id: "6".repeat(64), created_at: 600 });
        const { anyOfArgs, equalsArgs, whereSpy } = monitorDeletionRequestTargetQueries(db);

        const result = await repository.upsertFetchedEvents({
            events: [{ event: firstEvent }, { event: secondEvent }],
        });

        expect(whereSpy).toHaveBeenCalledTimes(1);
        expect(anyOfArgs).toEqual([[firstEvent.id, secondEvent.id]]);
        expect(equalsArgs).toEqual([]);
        expect(result).toEqual({
            insertedCount: 2,
            updatedCount: 0,
            unchangedCount: 0,
            appliedDeletionCount: 0,
        });
        await expect(db.postHistory.bulkGet([firstEvent.id, secondEvent.id])).resolves.toEqual([
            expect.objectContaining({ eventId: firstEvent.id }),
            expect.objectContaining({ eventId: secondEvent.id }),
        ]);

        whereSpy.mockRestore();
        db.close();
    });

    it("後着した新規投稿とpending削除を同時適用して基本分類と削除件数を分離する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 2000);
        const deletionRepository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const event = createSignedEvent({ id: "1".repeat(64), content: "late" });
        const deletionEvent = {
            id: "5".repeat(64),
            pubkey: event.pubkey,
            kind: 5,
            content: "deleted",
            tags: [["e", event.id]],
            created_at: 1_700_000_000,
            sig: "c".repeat(128),
        };
        await deletionRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: event.pubkey,
            deletionEvents: [deletionEvent],
        });

        const result = await repository.upsertFetchedEvents({
            events: [{ event }],
        });

        expect(result).toEqual({
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            appliedDeletionCount: 1,
        });
        await expect(db.postHistory.get(event.id)).resolves.toMatchObject({
            deletedAt: 1_700_000_000_000,
            deletionEventId: deletionEvent.id,
        });
        await expect(db.postHistoryDeletionRequests.toArray()).resolves.toMatchObject([
            { targetVerified: true },
        ]);

        db.close();
    });

    it("kind 42の対象イベントが後着した場合もpendingを検証済みにして削除適用する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 2000);
        const deletionRepository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const event = createSignedEvent({ id: "b".repeat(64), kind: 42 });
        const deletionEvent = {
            id: "c".repeat(64),
            pubkey: event.pubkey,
            kind: 5,
            content: "",
            tags: [["e", event.id], ["k", "42"]],
            created_at: 700,
            sig: "d".repeat(128),
        };
        await deletionRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
        });

        const result = await repository.upsertFetchedEvents({
            events: [{ event }],
        });

        expect(result.appliedDeletionCount).toBe(1);
        await expect(db.postHistory.get(event.id)).resolves.toMatchObject({
            deletedAt: 700_000,
            deletionEventId: deletionEvent.id,
        });
        await expect(db.postHistoryDeletionRequests.toArray()).resolves.toMatchObject([
            { targetVerified: true },
        ]);

        db.close();
    });

    it("既存同一投稿へpending削除だけを適用してunchangedを維持する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 2000);
        const deletionRepository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const event = createSignedEvent({ id: "2".repeat(64), content: "same" });
        const deletionEvent = {
            id: "6".repeat(64),
            pubkey: event.pubkey,
            kind: 5,
            content: "",
            tags: [["e", event.id]],
            created_at: 300,
            sig: "c".repeat(128),
        };
        await deletionRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: event.pubkey,
            deletionEvents: [deletionEvent],
        });
        await repository.putPostedEvent({ event });

        const result = await repository.upsertFetchedEvents({
            events: [{ event }],
        });

        expect(result).toEqual({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 1,
            appliedDeletionCount: 1,
        });

        db.close();
    });

    it("基本投稿更新とpending削除が同時でもupdatedと削除件数を分離する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 2000);
        const deletionRepository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const event = createSignedEvent({ id: "3".repeat(64), content: "same" });
        const deletionEvent = {
            id: "7".repeat(64),
            pubkey: event.pubkey,
            kind: 5,
            content: "",
            tags: [["e", event.id]],
            created_at: 400,
            sig: "c".repeat(128),
        };
        await deletionRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: event.pubkey,
            deletionEvents: [deletionEvent],
        });
        await repository.putPostedEvent({ event });

        const result = await repository.upsertFetchedEvents({
            events: [{ event, relayUrls: ["wss://new.example.com"] }],
        });

        expect(result).toEqual({
            insertedCount: 0,
            updatedCount: 1,
            unchangedCount: 0,
            appliedDeletionCount: 1,
        });

        db.close();
    });

    it("削除済み投稿の再処理は削除状態を上書きせずappliedDeletionを増やさない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 2000);
        const event = createSignedEvent({ id: "4".repeat(64), content: "same" });
        await repository.putPostedEvent({ event });
        await repository.markDeleted(event.id, "8".repeat(64), 123_000);

        const result = await repository.upsertFetchedEvents({
            events: [{ event }],
        });

        expect(result).toEqual({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 1,
            appliedDeletionCount: 0,
        });
        await expect(db.postHistory.get(event.id)).resolves.toMatchObject({
            deletedAt: 123_000,
            deletionEventId: "8".repeat(64),
        });

        db.close();
    });

    it("別pubkeyの後着投稿ではpendingを検証済みにせず削除適用しない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 2000);
        const deletionRepository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const event = createSignedEvent({ id: "9".repeat(64), pubkey: "d".repeat(64) });
        const deletionEvent = {
            id: "e".repeat(64),
            pubkey: "b".repeat(64),
            kind: 5,
            content: "",
            tags: [["e", event.id]],
            created_at: 500,
            sig: "c".repeat(128),
        };
        await deletionRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
        });

        const result = await repository.upsertFetchedEvents({
            events: [{ event }],
        });

        expect(result.appliedDeletionCount).toBe(0);
        await expect(db.postHistory.get(event.id)).resolves.not.toHaveProperty("deletedAt");
        await expect(db.postHistoryDeletionRequests.toArray()).resolves.toMatchObject([
            { targetVerified: false },
        ]);

        db.close();
    });

    it("保存対象外kindの後着イベントではpendingを検証済みにせず削除適用しない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 2000);
        const deletionRepository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const event = createSignedEvent({ id: "a".repeat(64), kind: 31234 });
        const deletionEvent = {
            id: "f".repeat(64),
            pubkey: event.pubkey,
            kind: 5,
            content: "",
            tags: [["e", event.id]],
            created_at: 600,
            sig: "c".repeat(128),
        };
        await deletionRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: deletionEvent.pubkey,
            deletionEvents: [deletionEvent],
        });

        const result = await repository.upsertFetchedEvents({
            events: [{ event }],
        });

        expect(result.appliedDeletionCount).toBe(0);
        await expect(db.postHistory.get(event.id)).resolves.not.toHaveProperty("deletedAt");
        await expect(db.postHistoryDeletionRequests.toArray()).resolves.toMatchObject([
            { targetVerified: false },
        ]);

        db.close();
    });

    it("upsertFetchedEvents の transaction が失敗した場合は verified 更新も投稿保存も巻き戻す", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistoryRepository(db, () => 2000);
        const deletionRepository = new DexiePostHistoryDeletionRequestsRepository(db, () => 1000);
        const event = createSignedEvent({ id: "7".repeat(64) });
        await deletionRepository.upsertImportedDeletionEvents({
            ownerPubkeyHex: event.pubkey,
            deletionEvents: [createDeletionEvent(event.id, {
                id: "8".repeat(64),
                pubkey: event.pubkey,
                created_at: 300,
            })],
        });

        const bulkPutSpy = vi.spyOn(db.postHistory, "bulkPut")
            .mockRejectedValue(new Error("post history bulkPut failed"));

        await expect(repository.upsertFetchedEvents({
            events: [{ event }],
        })).rejects.toThrow("post history bulkPut failed");

        bulkPutSpy.mockRestore();

        await expect(db.postHistory.get(event.id)).resolves.toBeUndefined();
        await expect(db.postHistoryDeletionRequests.toArray()).resolves.toEqual([
            expect.objectContaining({
                targetEventId: event.id,
                targetVerified: false,
            }),
        ]);

        db.close();
    });
});
