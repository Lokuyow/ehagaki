import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import {
    createPostHistorySearchRecord,
    getPostHistorySearchIndexMetaKey,
    POST_HISTORY_SEARCH_INDEX_FORMAT_VERSION,
} from "../../lib/postHistorySearchIndex";
import { EHAGAKI_DB_NAME, EHagakiDB, type PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import { DexiePostHistorySearchRepository } from "../../lib/storage/postHistorySearchRepository";
import { comparePostHistoryTimelineOrder } from "../../lib/storage/postHistoryRepository";

const testDbNames = new Set<string>();
const PUBKEY = "a".repeat(64);

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-post-history-search-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

function createRecord(overrides: Partial<PostHistoryRecord> = {}): PostHistoryRecord {
    const eventId = overrides.eventId ?? "1".repeat(64);
    return {
        eventId,
        pubkeyHex: PUBKEY,
        kind: 1,
        content: "Body text",
        tags: [["t", "Topic"]],
        createdAt: 100,
        postedAt: 200,
        relayHints: ["wss://hint.example.com/"],
        acceptedRelays: ["wss://accepted.example.com/"],
        media: [{ url: "https://example.com/image.jpg", alt: "Alt text" }],
        rawEvent: { ignored: true },
        updatedAt: 300,
        schemaVersion: 2,
        ...overrides,
        id: eventId,
    };
}

afterEach(async () => {
    for (const name of testDbNames) await Dexie.delete(name);
    testDbNames.clear();
});

describe("post history search index", () => {
    it("検索文字列へ必要な投稿由来フィールドだけを重複なしで保存する", () => {
        const record = createPostHistorySearchRecord(createRecord({
            eventId: "event-id-not-in-text",
            kind: 42,
            channelEventId: "channel-id-not-in-text",
            fetchedRelays: ["wss://fetched.example.com/"],
        }));

        expect(record).toMatchObject({
            eventId: "event-id-not-in-text",
            kind: 42,
            channelEventId: "channel-id-not-in-text",
        });
        expect(record.searchText).toContain("body text");
        expect(record.searchText).toContain("topic");
        expect(record.searchText).toContain("image.jpg");
        expect(record.searchText).toContain("fetched.example.com");
        expect(record.searchText).not.toContain("event-id-not-in-text");
        expect(record.searchText).not.toContain("channel-id-not-in-text");
        expect(record.searchText).not.toContain("42");
        expect(createPostHistorySearchRecord(createRecord())).not.toHaveProperty("channelEventId");
    });

    it("eventId を含まない timeline index でも現行の tie-break 順を維持する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistorySearchRepository(db);
        const records = ["f", "e", "d", "a"].map((id) => createRecord({
            eventId: id.repeat(64),
            postedAt: 500,
            createdAt: 100,
        }));
        await db.postHistorySearch.bulkPut(records.map(createPostHistorySearchRecord));

        const indexOrder = await repository.getForPubkey(PUBKEY);
        expect(indexOrder.map((record) => record.eventId)).toEqual(
            [...records].sort(comparePostHistoryTimelineOrder).map((record) => record.eventId),
        );
        db.close();
    });

    it("既存正本を短い transaction の backfill で ready にし、件数不一致時は再構築する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistorySearchRepository(db, () => 1_000);
        const records = Array.from({ length: 501 }, (_, index) => createRecord({
            eventId: (index + 1).toString(16).padStart(64, "0"),
            postedAt: 1_000 - index,
            createdAt: 1_000 - index,
        }));
        await db.postHistory.bulkPut(records);
        const progress: number[] = [];

        await expect(repository.ensureReady({
            pubkeyHex: PUBKEY,
            onProgress: ({ processedCount }) => progress.push(processedCount),
        })).resolves.toBe("ready");
        await expect(db.postHistorySearch.count()).resolves.toBe(501);
        await expect(db.meta.get(getPostHistorySearchIndexMetaKey(PUBKEY))).resolves.toMatchObject({
            value: expect.objectContaining({ status: "ready", processedCount: 501 }),
        });
        expect(progress).toContain(500);

        await db.postHistory.put(createRecord({ eventId: "f".repeat(64), postedAt: 2_000 }));
        await expect(repository.ensureReady({ pubkeyHex: PUBKEY })).resolves.toBe("ready");
        await expect(db.postHistorySearch.count()).resolves.toBe(502);
        db.close();
    });

    it("format 不一致の既存 index を clearing してから再構築する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistorySearchRepository(db, () => 1_000);
        await db.postHistory.put(createRecord({ eventId: "source".repeat(10) }));
        await db.postHistorySearch.put({
            eventId: "orphan".repeat(10),
            pubkeyHex: PUBKEY,
            postedAt: 10,
            createdAt: 10,
            kind: 1,
            searchText: "stale",
        });
        await db.meta.put({
            key: getPostHistorySearchIndexMetaKey(PUBKEY),
            value: { formatVersion: 0, status: "ready", processedCount: 1 },
            updatedAt: 1,
        });

        await expect(repository.ensureReady({ pubkeyHex: PUBKEY })).resolves.toBe("ready");
        const rebuiltRecords = await db.postHistorySearch.toArray();
        expect(rebuiltRecords).toHaveLength(1);
        expect(rebuiltRecords[0]).toMatchObject({ eventId: "source".repeat(10) });
        expect(rebuiltRecords[0]?.searchText).toContain("body text");
        await expect(db.meta.get(getPostHistorySearchIndexMetaKey(PUBKEY))).resolves.toMatchObject({
            value: expect.objectContaining({ formatVersion: POST_HISTORY_SEARCH_INDEX_FORMAT_VERSION }),
        });
        db.close();
    });

    it("別タブの有効な lease 中は index を書き込まない", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistorySearchRepository(db, () => 1_000);
        await db.postHistory.put(createRecord());
        await db.meta.put({
            key: getPostHistorySearchIndexMetaKey(PUBKEY),
            value: {
                formatVersion: POST_HISTORY_SEARCH_INDEX_FORMAT_VERSION,
                status: "building",
                processedCount: 0,
                leaseOwner: "other-tab",
                leaseExpiresAt: 2_000,
            },
            updatedAt: 1,
        });
        let shouldContinueCalls = 0;

        await expect(repository.ensureReady({
            pubkeyHex: PUBKEY,
            shouldContinue: () => shouldContinueCalls++ === 0,
        })).resolves.toBe("cancelled");
        await expect(db.postHistorySearch.count()).resolves.toBe(0);
        await expect(db.meta.get(getPostHistorySearchIndexMetaKey(PUBKEY))).resolves.toMatchObject({
            value: expect.objectContaining({ leaseOwner: "other-tab", leaseExpiresAt: 2_000 }),
        });
        db.close();
    });
});
