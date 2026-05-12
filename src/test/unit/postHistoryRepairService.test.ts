import { describe, expect, it, vi } from "vitest";
import {
    POST_HISTORY_REPAIR_MAX_RANGES_PER_RUN,
    PostHistoryRepairService,
} from "../../lib/postHistoryRepairService";

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
        rangeKey: "1,42|||200",
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
        const debug = vi.fn();
        let unresolved = [
            createCoverageRecord({ id: "timeout-range", status: "timeout", until: 400 }),
            createCoverageRecord({ id: "error-range", status: "error", until: 300, fetchedAt: 4000 }),
            createCoverageRecord({ id: "partial-range", status: "partial", until: 200, fetchedAt: 3000 }),
            createCoverageRecord({ id: "cancelled-range", status: "cancelled", until: 100, fetchedAt: 2000 }),
        ];
        const fetchLatest = vi.fn()
            .mockReturnValueOnce({ promise: Promise.resolve(createFetchResult({ fetchedAt: 1000 })), cancel: vi.fn() })
            .mockReturnValueOnce({ promise: Promise.resolve(createFetchResult({ fetchedAt: 2000 })), cancel: vi.fn() })
            .mockReturnValueOnce({ promise: Promise.resolve(createFetchResult({ fetchedAt: 3000 })), cancel: vi.fn() })
            .mockReturnValueOnce({ promise: Promise.resolve(createFetchResult({ fetchedAt: 4000 })), cancel: vi.fn() });
        const listIncompleteAttempts = vi.fn().mockImplementation(async () => unresolved);
        const markResolved = vi.fn().mockImplementation(async (id: string) => {
            unresolved = unresolved.filter((record) => record.id !== id);
        });
        const saveAttempt = vi.fn().mockImplementation(async ({ result }: any) =>
            createCoverageRecord({ status: result.status === "success" ? "complete" : result.status }),
        );
        const upsertFetchedEvents = vi.fn().mockResolvedValue({ insertedCount: 0, updatedCount: 0, unchangedCount: 0 });
        const service = new PostHistoryRepairService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistorySyncCoverageRepository: {
                listIncompleteAttempts,
                saveAttempt,
                enqueuePendingRanges: vi.fn(),
                markResolved,
            },
            postHistoryRepository: {
                upsertFetchedEvents,
                getOldestCreatedAt: vi.fn().mockResolvedValue(null),
            },
            postHistoryRepairCursorRepository: {
                get: vi.fn().mockResolvedValue(null),
                save: vi.fn(),
            },
            now: () => 10_000,
            console: { debug },
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
        expect(result.processedRangeCount).toBe(4);
        expect(result.hasRemainingRanges).toBe(false);
        expect(result.hasRemainingWork).toBe(false);
        expect(result.remainingRangeCount).toBe(0);
        expect(result.nextCursorUntil).toBeNull();
        expect(result.processedRanges).toEqual([
            expect.objectContaining({ until: 400, status: "complete" }),
            expect.objectContaining({ until: 300, status: "complete" }),
            expect.objectContaining({ until: 200, status: "complete" }),
            expect.objectContaining({ until: 100, status: "complete" }),
        ]);
        expect(debug).toHaveBeenCalledWith(
            "post_history_repair_summary",
            expect.objectContaining({
                processedRangeCount: 4,
                hasRemainingRanges: false,
            }),
        );
    });

    it("partial range は次回用の細分 range に分割してから pending range を取得する", async () => {
        const enqueuePendingRanges = vi.fn().mockResolvedValue([]);
        const markResolved = vi.fn().mockResolvedValue(undefined);
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
        const listIncompleteAttempts = vi.fn()
            .mockResolvedValueOnce([
                createCoverageRecord({
                    id: "partial-range",
                    status: "partial",
                    requestKind: "repair",
                    rangeUnit: "month",
                    since: 1,
                    until: 20 * 24 * 60 * 60,
                    rangeKey: `1,42|1|${20 * 24 * 60 * 60}|200`,
                }),
            ])
            .mockResolvedValueOnce([
                createCoverageRecord({
                    id: "pending-week-1",
                    status: "pending",
                    requestKind: "repair",
                    rangeUnit: "week",
                    since: 1,
                    until: 7 * 24 * 60 * 60,
                    rangeKey: `1,42|1|${7 * 24 * 60 * 60}|200`,
                    rawCount: 0,
                    uniqueCount: 0,
                    duplicateCount: 0,
                }),
            ])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([]);
        const service = new PostHistoryRepairService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistorySyncCoverageRepository: {
                listIncompleteAttempts,
                saveAttempt: vi.fn().mockResolvedValue(createCoverageRecord({ status: "complete" })),
                enqueuePendingRanges,
                markResolved,
            },
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn().mockResolvedValue({ insertedCount: 0, updatedCount: 0, unchangedCount: 0 }),
                getOldestCreatedAt: vi.fn().mockResolvedValue(null),
            },
            postHistoryRepairCursorRepository: {
                get: vi.fn().mockResolvedValue(null),
                save: vi.fn(),
            },
            now: () => 21 * 24 * 60 * 60 * 1000,
        });

        const result = await service.repairFromRelays({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
        }).promise;

        expect(enqueuePendingRanges).toHaveBeenCalledWith([
            expect.objectContaining({
                rangeUnit: "week",
                since: 1,
                until: 7 * 24 * 60 * 60,
            }),
            expect.objectContaining({
                rangeUnit: "week",
                since: 7 * 24 * 60 * 60 + 1,
                until: 14 * 24 * 60 * 60,
            }),
            expect.objectContaining({
                rangeUnit: "week",
                since: 14 * 24 * 60 * 60 + 1,
                until: 20 * 24 * 60 * 60,
            }),
        ]);
        expect(fetchLatest).toHaveBeenCalledTimes(1);
        expect(fetchLatest).toHaveBeenCalledWith(
            {} as any,
            expect.objectContaining({
                since: 1,
                until: 7 * 24 * 60 * 60,
            }),
        );
        expect(markResolved).toHaveBeenCalledWith("partial-range");
        expect(result.attemptedRangeCount).toBe(1);
    });

    it("partial day range は nextUntil で狭めた pending range に置き換えてから再取得する", async () => {
        let unresolved = [
            createCoverageRecord({
                id: "partial-day",
                status: "partial",
                requestKind: "repair",
                rangeUnit: "day",
                since: 100,
                until: 200,
                nextUntil: 150,
                rangeKey: "1,42|100|200|200",
            }),
        ];
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                fetchedAt: 9_000,
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
        const listIncompleteAttempts = vi.fn().mockImplementation(async () => unresolved);
        const enqueuePendingRanges = vi.fn().mockImplementation(async (inputs: any[]) => {
            const records = inputs.map((input, index) => createCoverageRecord({
                id: `pending-narrowed-${index}`,
                status: "pending",
                requestKind: "repair",
                rangeUnit: input.rangeUnit,
                since: input.since,
                until: input.until,
                limit: input.limit,
                rangeKey: `${input.kinds.join(",")}|${input.since ?? ""}|${input.until ?? ""}|${input.limit}`,
                rawCount: 0,
                uniqueCount: 0,
                duplicateCount: 0,
                fetchedAt: 6_000 + index,
            }));
            unresolved = [...unresolved, ...records];
            return records;
        });
        const markResolved = vi.fn().mockImplementation(async (id: string) => {
            unresolved = unresolved.filter((record) => record.id !== id);
        });
        const saveAttempt = vi.fn().mockResolvedValue(createCoverageRecord({
            id: "complete-after-narrow",
            status: "complete",
            requestKind: "repair",
            rangeUnit: "day",
            since: 100,
            until: 150,
            rangeKey: "1,42|100|150|200",
        }));
        const service = new PostHistoryRepairService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistorySyncCoverageRepository: {
                listIncompleteAttempts,
                saveAttempt,
                enqueuePendingRanges,
                markResolved,
            },
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn().mockResolvedValue({ insertedCount: 0, updatedCount: 0, unchangedCount: 0 }),
                getOldestCreatedAt: vi.fn().mockResolvedValue(null),
            },
            postHistoryRepairCursorRepository: {
                get: vi.fn().mockResolvedValue(null),
                save: vi.fn(),
            },
            now: () => 10_000,
        });

        const result = await service.repairFromRelays({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
        }).promise;

        expect(enqueuePendingRanges).toHaveBeenCalledWith([
            expect.objectContaining({
                since: 100,
                until: 150,
                rangeUnit: "day",
            }),
        ]);
        expect(fetchLatest).toHaveBeenCalledTimes(1);
        expect(fetchLatest).toHaveBeenCalledWith(
            {} as any,
            expect.objectContaining({
                since: 100,
                until: 150,
            }),
        );
        expect(result.processedRangeCount).toBe(1);
        expect(result.hasRemainingRanges).toBe(false);
    });

    it("進展が無い partial day range は nextUntil - 1 の pending range に逃がす", async () => {
        let unresolved = [
            createCoverageRecord({
                id: "pending-day",
                status: "pending",
                requestKind: "repair",
                rangeUnit: "day",
                since: 100,
                until: 200,
                rangeKey: "1,42|100|200|200",
                fetchedAt: 7_000,
            }),
        ];
        const fetchLatest = vi.fn()
            .mockReturnValueOnce({
                promise: Promise.resolve(createFetchResult({
                    fetchedAt: 8_000,
                    nextUntil: 200,
                    rawCount: 0,
                    uniqueCount: 0,
                    duplicateCount: 0,
                    observedRelayUrls: [],
                    perRelayCounts: [],
                    oldestCreatedAt: null,
                    newestCreatedAt: null,
                })),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve(createFetchResult({
                    fetchedAt: 9_000,
                    nextUntil: 199,
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
        const listIncompleteAttempts = vi.fn().mockImplementation(async () => unresolved);
        const enqueuePendingRanges = vi.fn().mockImplementation(async (inputs: any[]) => {
            const records = inputs.map((input, index) => createCoverageRecord({
                id: `pending-escaped-${index}`,
                status: "pending",
                requestKind: "repair",
                rangeUnit: input.rangeUnit,
                since: input.since,
                until: input.until,
                limit: input.limit,
                rangeKey: `${input.kinds.join(",")}|${input.since ?? ""}|${input.until ?? ""}|${input.limit}`,
                rawCount: 0,
                uniqueCount: 0,
                duplicateCount: 0,
                fetchedAt: 8_100 + index,
            }));
            unresolved = [...unresolved, ...records];
            return records;
        });
        const markResolved = vi.fn().mockImplementation(async (id: string) => {
            unresolved = unresolved.filter((record) => record.id !== id);
        });
        const saveAttempt = vi.fn()
            .mockResolvedValueOnce(createCoverageRecord({
                id: "partial-after-200",
                status: "partial",
                requestKind: "repair",
                rangeUnit: "day",
                since: 100,
                until: 200,
                nextUntil: 200,
                rangeKey: "1,42|100|200|200",
            }))
            .mockResolvedValueOnce(createCoverageRecord({
                id: "complete-after-199",
                status: "complete",
                requestKind: "repair",
                rangeUnit: "day",
                since: 100,
                until: 199,
                rangeKey: "1,42|100|199|200",
            }));
        const service = new PostHistoryRepairService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistorySyncCoverageRepository: {
                listIncompleteAttempts,
                saveAttempt,
                enqueuePendingRanges,
                markResolved,
            },
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn().mockResolvedValue({ insertedCount: 0, updatedCount: 0, unchangedCount: 0 }),
                getOldestCreatedAt: vi.fn().mockResolvedValue(null),
            },
            postHistoryRepairCursorRepository: {
                get: vi.fn().mockResolvedValue(null),
                save: vi.fn(),
            },
            now: () => 10_000,
        });

        const result = await service.repairFromRelays({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
        }).promise;

        expect(enqueuePendingRanges).toHaveBeenCalledWith([
            expect.objectContaining({
                since: 100,
                until: 199,
                rangeUnit: "day",
            }),
        ]);
        expect(fetchLatest).toHaveBeenNthCalledWith(
            1,
            {} as any,
            expect.objectContaining({
                since: 100,
                until: 200,
            }),
        );
        expect(fetchLatest).toHaveBeenNthCalledWith(
            2,
            {} as any,
            expect.objectContaining({
                since: 100,
                until: 199,
            }),
        );
        expect(result.processedRangeCount).toBe(2);
        expect(result.hasRemainingRanges).toBe(false);
    });

    it("未完了 coverage が無い場合は now から local oldestCreatedAt に向かって新しい月から古い月へ最大 5 range を再取得し、cursor は次の古い月を指す", async () => {
        const debug = vi.fn();
        const setTimeoutFn = vi.fn((callback: () => void) => {
            callback();
            return 1 as unknown as ReturnType<typeof setTimeout>;
        });
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
        let currentCursor: {
            pubkeyHex: string;
            targetOldestCreatedAt: number;
            nextUntil: number | null;
            updatedAt: number;
        } | null = null;
        const cursorGet = vi.fn().mockImplementation(async () => currentCursor);
        const cursorSave = vi.fn().mockImplementation(async (cursor) => {
            currentCursor = {
                ...cursor,
                updatedAt: 1,
            };
            return currentCursor;
        });
        const service = new PostHistoryRepairService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistorySyncCoverageRepository: {
                listIncompleteAttempts: vi.fn().mockResolvedValue([]),
                saveAttempt: vi.fn().mockResolvedValue(createCoverageRecord({ status: "complete" })),
                enqueuePendingRanges: vi.fn(),
                markResolved: vi.fn(),
            },
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn().mockResolvedValue({ insertedCount: 0, updatedCount: 0, unchangedCount: 0 }),
                getOldestCreatedAt: vi.fn().mockResolvedValue(Math.floor(Date.UTC(2025, 10, 15) / 1000)),
            },
            postHistoryRepairCursorRepository: {
                get: cursorGet,
                save: cursorSave,
            },
            now: () => Date.UTC(2026, 4, 12, 12, 0, 0),
            setTimeoutFn: setTimeoutFn as unknown as typeof setTimeout,
            clearTimeoutFn: vi.fn() as unknown as typeof clearTimeout,
            console: { debug },
        });

        const result = await service.repairFromRelays({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
        }).promise;

        expect(fetchLatest).toHaveBeenCalledTimes(POST_HISTORY_REPAIR_MAX_RANGES_PER_RUN);
        expect(fetchLatest).toHaveBeenNthCalledWith(
            1,
            {} as any,
            expect.objectContaining({
                since: Math.floor(Date.UTC(2026, 4, 1) / 1000),
                until: Math.floor(Date.UTC(2026, 4, 12, 12, 0, 0) / 1000),
            }),
        );
        expect(fetchLatest).toHaveBeenNthCalledWith(
            2,
            {} as any,
            expect.objectContaining({
                since: Math.floor(Date.UTC(2026, 3, 1) / 1000),
                until: Math.floor(Date.UTC(2026, 4, 1) / 1000) - 1,
            }),
        );
        expect(fetchLatest).toHaveBeenNthCalledWith(
            3,
            {} as any,
            expect.objectContaining({
                since: Math.floor(Date.UTC(2026, 2, 1) / 1000),
                until: Math.floor(Date.UTC(2026, 3, 1) / 1000) - 1,
            }),
        );
        expect(fetchLatest).toHaveBeenNthCalledWith(
            4,
            {} as any,
            expect.objectContaining({
                since: Math.floor(Date.UTC(2026, 1, 1) / 1000),
                until: Math.floor(Date.UTC(2026, 2, 1) / 1000) - 1,
            }),
        );
        expect(fetchLatest).toHaveBeenNthCalledWith(
            5,
            {} as any,
            expect.objectContaining({
                since: Math.floor(Date.UTC(2026, 0, 1) / 1000),
                until: Math.floor(Date.UTC(2026, 1, 1) / 1000) - 1,
            }),
        );
        expect(setTimeoutFn).toHaveBeenCalledTimes(POST_HISTORY_REPAIR_MAX_RANGES_PER_RUN - 1);
        expect(cursorSave).toHaveBeenCalled();
        expect(currentCursor).toEqual(expect.objectContaining({
            targetOldestCreatedAt: Math.floor(Date.UTC(2025, 10, 15) / 1000),
            nextUntil: Math.floor(Date.UTC(2026, 0, 1) / 1000) - 1,
        }));
        expect(result.attemptedRangeCount).toBe(POST_HISTORY_REPAIR_MAX_RANGES_PER_RUN);
        expect(result.processedRangeCount).toBe(POST_HISTORY_REPAIR_MAX_RANGES_PER_RUN);
        expect(result.hasRemainingRanges).toBe(true);
        expect(result.hasRemainingWork).toBe(true);
        expect(result.remainingRangeCount).toBeGreaterThan(0);
        expect(result.nextCursorUntil).not.toBeNull();
        expect(result.status).toBe("success");
        expect(debug).toHaveBeenCalledWith(
            "post_history_repair_summary",
            expect.objectContaining({
                hasRemainingRanges: true,
                remainingRangeCount: expect.any(Number),
                nextCursorUntil: expect.any(Number),
            }),
        );
    });
});