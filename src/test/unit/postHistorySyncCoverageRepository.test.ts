import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import type { PostHistoryRelayFetchResult } from "../../lib/postHistoryRelayFetchService";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import {
    DexiePostHistorySyncCoverageRepository,
} from "../../lib/storage/postHistorySyncCoverageRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-post-history-sync-coverage-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

function createFetchResult(
    overrides: Partial<PostHistoryRelayFetchResult> = {},
): PostHistoryRelayFetchResult {
    return {
        status: "success",
        events: [],
        fetchedAt: 5000,
        nextUntil: null,
        hasMore: false,
        relayUrls: ["wss://read.example.com/"],
        observedRelayUrls: ["wss://relay-a.example.com/"],
        rawCount: 1,
        uniqueCount: 1,
        duplicateCount: 0,
        perRelayCounts: [
            {
                relayUrl: "wss://relay-a.example.com/",
                rawCount: 1,
                uniqueCount: 1,
            },
        ],
        oldestCreatedAt: 100,
        newestCreatedAt: 100,
        ...overrides,
    };
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexiePostHistorySyncCoverageRepository", () => {
    it("complete / partial / timeout / error / cancelled を attempt-level row として保存する", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistorySyncCoverageRepository(
            db,
            () => 6000,
            ((index) => () => `coverage-${index += 1}`)(0),
        );

        await repository.saveAttempt({
            pubkeyHex: "a".repeat(64),
            requestKind: "initial",
            kinds: [42, 1, 1],
            limit: 200,
            result: createFetchResult(),
        });
        await repository.saveAttempt({
            pubkeyHex: "a".repeat(64),
            requestKind: "older",
            kinds: [1, 42],
            until: 100,
            limit: 2,
            result: createFetchResult({
                hasMore: true,
                rawCount: 2,
                uniqueCount: 2,
            }),
        });
        await repository.saveAttempt({
            pubkeyHex: "a".repeat(64),
            requestKind: "older",
            kinds: [1, 42],
            until: 99,
            limit: 200,
            result: createFetchResult({ status: "timeout", fetchedAt: 7000, nextUntil: 99 }),
        });
        await repository.saveAttempt({
            pubkeyHex: "a".repeat(64),
            requestKind: "older",
            kinds: [1, 42],
            until: 98,
            limit: 200,
            result: createFetchResult({ status: "error", fetchedAt: 8000, rawCount: 0, uniqueCount: 0, duplicateCount: 0, observedRelayUrls: [], perRelayCounts: [], oldestCreatedAt: null, newestCreatedAt: null }),
        });
        await repository.saveAttempt({
            pubkeyHex: "a".repeat(64),
            requestKind: "repair",
            kinds: [1, 42],
            since: 1,
            until: 97,
            limit: 200,
            result: createFetchResult({ status: "cancelled", fetchedAt: 9000, rawCount: 0, uniqueCount: 0, duplicateCount: 0, observedRelayUrls: [], perRelayCounts: [], oldestCreatedAt: null, newestCreatedAt: null }),
        });

        const records = await db.postHistorySyncCoverage.orderBy("fetchedAt").toArray();

        expect(records.map((record) => record.status)).toEqual([
            "complete",
            "partial",
            "timeout",
            "error",
            "cancelled",
        ]);
        expect(records[0].kinds).toEqual([1, 42]);
        expect(records[0].kindsKey).toBe("1,42");
        expect(records[0].relayKey).toBe("wss://read.example.com/");
        expect(records[1].until).toBe(100);
        expect(records[2].nextUntil).toBe(99);

        db.close();
    });

    it("未完了 coverage を timeout -> error -> partial -> cancelled の優先順で返す", async () => {
        const db = createTestDb();
        const repository = new DexiePostHistorySyncCoverageRepository(
            db,
            () => 9000,
            ((index) => () => `coverage-${index += 1}`)(0),
        );
        const pubkeyHex = "a".repeat(64);

        await repository.saveAttempt({
            pubkeyHex,
            requestKind: "older",
            kinds: [1, 42],
            limit: 200,
            result: createFetchResult({ fetchedAt: 2000, hasMore: true, rawCount: 200, uniqueCount: 200 }),
        });
        await repository.saveAttempt({
            pubkeyHex,
            requestKind: "older",
            kinds: [1, 42],
            limit: 200,
            result: createFetchResult({ status: "cancelled", fetchedAt: 3000, rawCount: 0, uniqueCount: 0, duplicateCount: 0, observedRelayUrls: [], perRelayCounts: [], oldestCreatedAt: null, newestCreatedAt: null }),
        });
        await repository.saveAttempt({
            pubkeyHex,
            requestKind: "older",
            kinds: [1, 42],
            limit: 200,
            result: createFetchResult({ status: "timeout", fetchedAt: 4000 }),
        });
        await repository.saveAttempt({
            pubkeyHex,
            requestKind: "older",
            kinds: [1, 42],
            limit: 200,
            result: createFetchResult({ status: "error", fetchedAt: 5000, rawCount: 0, uniqueCount: 0, duplicateCount: 0, observedRelayUrls: [], perRelayCounts: [], oldestCreatedAt: null, newestCreatedAt: null }),
        });
        await repository.saveAttempt({
            pubkeyHex,
            requestKind: "older",
            kinds: [1, 42],
            limit: 200,
            result: createFetchResult({ fetchedAt: 6000 }),
        });

        const records = await repository.listIncompleteAttempts({ pubkeyHex });

        expect(records.map((record) => record.status)).toEqual([
            "timeout",
            "error",
            "partial",
            "cancelled",
        ]);
        expect(records.map((record) => record.fetchedAt)).toEqual([4000, 5000, 2000, 3000]);

        db.close();
    });
});