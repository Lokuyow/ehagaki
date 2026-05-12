import { describe, expect, it, vi } from "vitest";
import { PostHistoryRepairService } from "../../lib/postHistoryRepairService";

function createFetchResult(overrides: Record<string, any> = {}) {
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

function createCoverageRecord(overrides: Record<string, any> = {}) {
    return {
        id: Math.random().toString(36).slice(2),
        pubkeyHex: "a".repeat(64),
        requestKind: "older",
        requestedRelayUrls: ["wss://read.example.com/"],
        observedRelayUrls: ["wss://relay-a.example.com/"],
        relayKey: "wss://read.example.com/",
        kinds: [1, 42],
        kindsKey: "1,42",
        limit: 200,
        status: "timeout",
        rawCount: 1,
        uniqueCount: 1,
        duplicateCount: 0,
        perRelayCounts: [],
        fetchedAt: 5000,
        updatedAt: 5000,
        schemaVersion: 1,
        ...overrides,
    };
}

describe("PostHistoryRepairService", () => {
    it("timeout / error / partial / cancelled の順で未完了 range を再取得する", async () => {
        const fetchLatest = vi.fn()
            .mockReturnValueOnce({ promise: Promise.resolve(createFetchResult({ fetchedAt: 1000 })), cancel: vi.fn() })
            .mockReturnValueOnce({ promise: Promise.resolve(createFetchResult({ fetchedAt: 2000 })), cancel: vi.fn() })
            .mockReturnValueOnce({ promise: Promise.resolve(createFetchResult({ fetchedAt: 3000 })), cancel: vi.fn() })
            .mockReturnValueOnce({ promise: Promise.resolve(createFetchResult({ fetchedAt: 4000 })), cancel: vi.fn() });
        const listIncompleteAttempts = vi.fn().mockResolvedValue([
            createCoverageRecord({ status: "timeout", until: 400 }),
            createCoverageRecord({ status: "error", until: 300, fetchedAt: 4000 }),
            createCoverageRecord({ status: "partial", until: 200, fetchedAt: 3000 }),
            createCoverageRecord({ status: "cancelled", until: 100, fetchedAt: 2000 }),
        ]);
        const saveAttempt = vi.fn().mockImplementation(async ({ result }: any) =>
            createCoverageRecord({ status: result.status === "success" ? "complete" : result.status }),
        );
        const upsertFetchedEvents = vi.fn().mockResolvedValue({ insertedCount: 0, updatedCount: 0, unchangedCount: 0 });
        const service = new PostHistoryRepairService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistorySyncCoverageRepository: {
                listIncompleteAttempts,
                saveAttempt,
            },
            postHistoryRepository: { upsertFetchedEvents },
            now: () => 10_000,
        });

        const result = await service.repairFromRelays({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
        }).promise;

        expect(fetchLatest).toHaveBeenNthCalledWith(
            1,
            {} as any,
            expect.objectContaining({ until: 400 }),
        );
        expect(fetchLatest).toHaveBeenNthCalledWith(
            2,
            {} as any,
            expect.objectContaining({ until: 300 }),
        );
        expect(fetchLatest).toHaveBeenNthCalledWith(
            3,
            {} as any,
            expect.objectContaining({ until: 200 }),
        );
        expect(fetchLatest).toHaveBeenNthCalledWith(
            4,
            {} as any,
            expect.objectContaining({ until: 100 }),
        );
        expect(saveAttempt).toHaveBeenCalledTimes(4);
        expect(result.status).toBe("success");
    });

    it("未完了 coverage が無い場合は最近 30 日を日単位で再取得する", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                rawCount: 0,
                uniqueCount: 0,
                duplicateCount: 0,
                observedRelayUrls: [],
                perRelayCounts: [],
                oldestCreatedAt: null,
                newestCreatedAt: null,
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryRepairService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistorySyncCoverageRepository: {
                listIncompleteAttempts: vi.fn().mockResolvedValue([]),
                saveAttempt: vi.fn().mockResolvedValue(createCoverageRecord({ status: "complete" })),
            },
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn().mockResolvedValue({ insertedCount: 0, updatedCount: 0, unchangedCount: 0 }),
            },
            now: () => 30 * 24 * 60 * 60 * 1000,
        });

        const result = await service.repairFromRelays({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
        }).promise;

        expect(fetchLatest).toHaveBeenCalledTimes(30);
        expect(fetchLatest).toHaveBeenNthCalledWith(
            1,
            {} as any,
            expect.objectContaining({
                since: 29 * 24 * 60 * 60 + 1,
                until: 30 * 24 * 60 * 60,
            }),
        );
        expect(result.totalRangeCount).toBe(30);
    });
});