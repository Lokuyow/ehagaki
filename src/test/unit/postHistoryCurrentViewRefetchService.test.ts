import { describe, expect, it, vi } from "vitest";
import {
    PostHistoryCurrentViewRefetchService,
} from "../../lib/postHistoryCurrentViewRefetchService";

function createFetchResult(overrides: Record<string, any> = {}) {
    return {
        status: "success",
        events: [],
        fetchedAt: 5000,
        nextUntil: null,
        hasMore: false,
        relayUrls: ["wss://read.example.com/"],
        requestedRelayUrls: ["wss://read.example.com/"],
        observedRelayUrls: ["wss://relay-a.example.com/"],
        eventRelayUrls: ["wss://relay-a.example.com/"],
        eoseRelayUrls: [],
        closedRelayUrls: [],
        errorRelayUrls: [],
        downRelayUrls: [],
        completedByRxNostr: true,
        completedByLocalTimeout: false,
        hasAnyRelayResponse: true,
        allRelaysFailed: false,
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

describe("PostHistoryCurrentViewRefetchService", () => {
    it("preferred range の upsert 後に onProgress を呼ぶ", async () => {
        const onProgress = vi.fn();
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                events: [
                    {
                        event: {
                            id: "b".repeat(64),
                            pubkey: "a".repeat(64),
                            kind: 1,
                            content: "投稿本文",
                            tags: [],
                            created_at: 1_700_000_000,
                            sig: "c".repeat(128),
                        },
                        relayUrls: ["wss://relay.example.com/"],
                    },
                ],
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn().mockResolvedValue({
                    insertedCount: 2,
                    updatedCount: 1,
                    unchangedCount: 3,
                }),
            } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42],
                rangeUnit: "custom",
                since: 100,
                until: 200,
                limit: 250,
            }],
            onProgress,
        }).promise;

        expect(fetchLatest).toHaveBeenCalledWith(
            {} as any,
            expect.objectContaining({
                pubkeyHex: "a".repeat(64),
                kinds: [1, 42],
                since: 100,
                until: 200,
                limit: 250,
            }),
        );
        expect(onProgress).toHaveBeenCalledWith({
            insertedCount: 2,
            updatedCount: 1,
            unchangedCount: 3,
            processedRangeCount: 1,
            attemptedRangeCount: 1,
            addedCount: 2,
            totalUpdatedCount: 1,
            totalUnchangedCount: 3,
        });
        expect(result).toEqual(expect.objectContaining({
            status: "success",
            addedCount: 2,
            updatedCount: 1,
            unchangedCount: 3,
            processedRangeCount: 1,
            attemptedRangeCount: 1,
            hadFailures: false,
            limitReached: false,
            hadFetchError: false,
            fetchFailed: false,
            hadTimeout: false,
            hadUnfinishedRanges: false,
            splitRetryCount: 0,
            processedRanges: [
                expect.objectContaining({
                    source: "preferred",
                    rangeUnit: "custom",
                    since: 100,
                    until: 200,
                    status: "complete",
                    insertedCount: 2,
                    updatedCount: 1,
                    unchangedCount: 3,
                }),
            ],
        }));
    });

    it("上限到達 range を分割できなければ未確認 range として返す", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                hasMore: true,
                rawCount: 250,
                uniqueCount: 80,
                perRelayCounts: [
                    {
                        relayUrl: "wss://relay-a.example.com/",
                        rawCount: 250,
                        uniqueCount: 80,
                    },
                ],
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn().mockResolvedValue({
                    insertedCount: 0,
                    updatedCount: 0,
                    unchangedCount: 0,
                }),
            } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42],
                rangeUnit: "custom",
                since: 100,
                until: 200,
                limit: 250,
            }],
        }).promise;

        expect(result).toEqual(expect.objectContaining({
            status: "partial",
            hadFailures: true,
            limitReached: true,
            hadUnfinishedRanges: true,
            processedRangeCount: 1,
            processedRanges: [
                expect.objectContaining({
                    status: "limit",
                }),
            ],
        }));
    });

    it("上限到達 range だけを2分割して確認できれば partial にしない", async () => {
        const fetchLatest = vi.fn()
            .mockReturnValueOnce({
                promise: Promise.resolve(createFetchResult({
                    hasMore: true,
                    rawCount: 250,
                    uniqueCount: 250,
                    perRelayCounts: [
                        {
                            relayUrl: "wss://relay-a.example.com/",
                            rawCount: 250,
                            uniqueCount: 250,
                        },
                    ],
                })),
                cancel: vi.fn(),
            })
            .mockReturnValue({
                promise: Promise.resolve(createFetchResult({
                    hasMore: false,
                    rawCount: 20,
                    uniqueCount: 20,
                    perRelayCounts: [
                        {
                            relayUrl: "wss://relay-a.example.com/",
                            rawCount: 20,
                            uniqueCount: 20,
                        },
                    ],
                })),
                cancel: vi.fn(),
            });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn().mockResolvedValue({
                    insertedCount: 0,
                    updatedCount: 0,
                    unchangedCount: 0,
                }),
            } as any,
            setTimeoutFn: ((fn: () => void) => {
                fn();
                return 0 as any;
            }) as any,
            clearTimeoutFn: vi.fn() as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42],
                rangeUnit: "custom",
                since: 0,
                until: 10_000,
                limit: 250,
            }],
        }).promise;

        expect(fetchLatest).toHaveBeenCalledTimes(3);
        expect(fetchLatest.mock.calls[1][1]).toEqual(expect.objectContaining({
            since: 0,
            until: 5_000,
        }));
        expect(fetchLatest.mock.calls[2][1]).toEqual(expect.objectContaining({
            since: 5_001,
            until: 10_000,
        }));
        expect(result).toEqual(expect.objectContaining({
            status: "success",
            hadFailures: false,
            limitReached: true,
            hadUnfinishedRanges: false,
            splitRetryCount: 2,
            processedRangeCount: 3,
        }));
        expect(result.processedRanges.map((range) => range.status)).toEqual([
            "limit",
            "complete",
            "complete",
        ]);
    });

    it("全体エラーで有効な応答がなければ fetchFailed を返す", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                status: "error",
                events: [],
                observedRelayUrls: [],
                eventRelayUrls: [],
                hasAnyRelayResponse: false,
                allRelaysFailed: true,
                rawCount: 0,
                uniqueCount: 0,
                perRelayCounts: [],
                oldestCreatedAt: null,
                newestCreatedAt: null,
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn(),
            } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42],
                rangeUnit: "custom",
                since: 100,
                until: 200,
                limit: 250,
            }],
        }).promise;

        expect(result).toEqual(expect.objectContaining({
            status: "partial",
            hadFetchError: true,
            fetchFailed: true,
        }));
    });

    it("baseline coverage が timeout の場合は fetchFailed ではなく partial にする", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                status: "timeout",
                events: [],
                observedRelayUrls: ["wss://relay-a.example.com/"],
                eventRelayUrls: [],
                eoseRelayUrls: ["wss://relay-a.example.com/"],
                hasAnyRelayResponse: true,
                rawCount: 0,
                uniqueCount: 0,
                perRelayCounts: [
                    {
                        relayUrl: "wss://relay-a.example.com/",
                        rawCount: 0,
                        uniqueCount: 0,
                    },
                ],
                oldestCreatedAt: null,
                newestCreatedAt: null,
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn(),
            } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42],
                rangeUnit: "custom",
                since: 100,
                until: 200,
                limit: 250,
            }],
        }).promise;

        expect(result).toEqual(expect.objectContaining({
            status: "partial",
            hadTimeout: true,
            fetchFailed: false,
            hadUnfinishedRanges: false,
        }));
    });

    it("baseline timeout と 0件は 追加なし ではなく partial にする", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                status: "timeout",
                events: [],
                observedRelayUrls: [],
                eventRelayUrls: [],
                eoseRelayUrls: [],
                rawCount: 0,
                uniqueCount: 0,
                perRelayCounts: [],
                oldestCreatedAt: null,
                newestCreatedAt: null,
                completedByRxNostr: false,
                completedByLocalTimeout: true,
                hasAnyRelayResponse: false,
                allRelaysFailed: false,
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn(),
            } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42],
                rangeUnit: "custom",
                since: 100,
                until: 200,
                limit: 250,
            }],
        }).promise;

        expect(result).toEqual(expect.objectContaining({
            status: "partial",
            hadTimeout: true,
            fetchFailed: false,
            hadUnfinishedRanges: false,
        }));
    });

    it("EVENT 0件でも EOSE があれば repair no changes 相当の success にする", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                status: "success",
                events: [],
                observedRelayUrls: [],
                eventRelayUrls: [],
                eoseRelayUrls: ["wss://read.example.com/"],
                rawCount: 0,
                uniqueCount: 0,
                perRelayCounts: [],
                oldestCreatedAt: null,
                newestCreatedAt: null,
                hasAnyRelayResponse: true,
                allRelaysFailed: false,
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn(),
            } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42],
                rangeUnit: "custom",
                since: 100,
                until: 200,
                limit: 250,
            }],
        }).promise;

        expect(result).toEqual(expect.objectContaining({
            status: "success",
            addedCount: 0,
            fetchFailed: false,
            hadUnfinishedRanges: false,
        }));
    });

    it("全リレーが明確に失敗し有効応答がなければ fetchFailed にする", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                status: "success",
                requestedRelayUrls: ["wss://relay-a.example.com/", "wss://relay-b.example.com/"],
                relayUrls: ["wss://relay-a.example.com/", "wss://relay-b.example.com/"],
                events: [],
                observedRelayUrls: [],
                eventRelayUrls: [],
                eoseRelayUrls: [],
                closedRelayUrls: ["wss://relay-a.example.com/"],
                errorRelayUrls: ["wss://relay-b.example.com/"],
                rawCount: 0,
                uniqueCount: 0,
                perRelayCounts: [],
                oldestCreatedAt: null,
                newestCreatedAt: null,
                hasAnyRelayResponse: false,
                allRelaysFailed: true,
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn(),
            } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42],
                rangeUnit: "custom",
                since: 100,
                until: 200,
                limit: 250,
            }],
        }).promise;

        expect(result).toEqual(expect.objectContaining({
            status: "partial",
            hadFailures: true,
            fetchFailed: true,
        }));
    });

    it("一部リレー失敗だけでは fetchFailed にしない", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                status: "success",
                requestedRelayUrls: ["wss://relay-a.example.com/", "wss://relay-b.example.com/"],
                relayUrls: ["wss://relay-a.example.com/", "wss://relay-b.example.com/"],
                events: [],
                observedRelayUrls: [],
                eventRelayUrls: [],
                eoseRelayUrls: ["wss://relay-a.example.com/"],
                errorRelayUrls: ["wss://relay-b.example.com/"],
                rawCount: 0,
                uniqueCount: 0,
                perRelayCounts: [],
                oldestCreatedAt: null,
                newestCreatedAt: null,
                hasAnyRelayResponse: true,
                allRelaysFailed: false,
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn(),
            } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42],
                rangeUnit: "custom",
                since: 100,
                until: 200,
                limit: 250,
            }],
        }).promise;

        expect(result).toEqual(expect.objectContaining({
            status: "success",
            fetchFailed: false,
            hadUnfinishedRanges: false,
        }));
    });

    it("追加ありならリレー失敗情報があっても addedCount を保持する", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                requestedRelayUrls: ["wss://relay-a.example.com/", "wss://relay-b.example.com/"],
                relayUrls: ["wss://relay-a.example.com/", "wss://relay-b.example.com/"],
                events: [
                    {
                        event: {
                            id: "d".repeat(64),
                            pubkey: "a".repeat(64),
                            kind: 1,
                            content: "new",
                            tags: [],
                            created_at: 150,
                            sig: "e".repeat(128),
                        },
                        relayUrls: ["wss://relay-a.example.com/"],
                    },
                ],
                errorRelayUrls: ["wss://relay-b.example.com/"],
                hasAnyRelayResponse: true,
                allRelaysFailed: false,
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn().mockResolvedValue({
                    insertedCount: 1,
                    updatedCount: 0,
                    unchangedCount: 0,
                }),
            } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42],
                rangeUnit: "custom",
                since: 100,
                until: 200,
                limit: 250,
            }],
        }).promise;

        expect(result).toEqual(expect.objectContaining({
            status: "success",
            addedCount: 1,
            fetchFailed: false,
            hadUnfinishedRanges: false,
        }));
    });

    it("保存処理例外は呼び出し側が repairFetchFailed として扱えるよう reject する", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                events: [
                    {
                        event: {
                            id: "f".repeat(64),
                            pubkey: "a".repeat(64),
                            kind: 1,
                            content: "new",
                            tags: [],
                            created_at: 150,
                            sig: "e".repeat(128),
                        },
                        relayUrls: ["wss://relay-a.example.com/"],
                    },
                ],
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn().mockRejectedValue(new Error("db failed")),
            } as any,
        });

        await expect(service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{
                kinds: [1, 42],
                rangeUnit: "custom",
                since: 100,
                until: 200,
                limit: 250,
            }],
        }).promise).rejects.toMatchObject({
            phase: "primary-persist",
        });
    });

    it("Relay fetch と successful primary persistence の時間を current-view result で分離する", async () => {
        let resolveFetch!: (result: ReturnType<typeof createFetchResult>) => void;
        const fetchPromise = new Promise<ReturnType<typeof createFetchResult>>((resolve) => {
            resolveFetch = resolve;
        });
        let resolvePersist!: (summary: { insertedCount: number; updatedCount: number; unchangedCount: number }) => void;
        const persistPromise = new Promise<{ insertedCount: number; updatedCount: number; unchangedCount: number }>((resolve) => {
            resolvePersist = resolve;
        });
        let now = 0;
        const upsertFetchedEvents = vi.fn().mockReturnValue(persistPromise);
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: {
                fetchLatest: vi.fn().mockReturnValue({ promise: fetchPromise, cancel: vi.fn() }),
            } as any,
            postHistoryRepository: { upsertFetchedEvents } as any,
            now: () => now,
        });

        const task = service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{ kinds: [1, 42], rangeUnit: "custom", since: 100, until: 200, limit: 250 }],
        });

        now = 100;
        resolveFetch(createFetchResult({
            events: [{
                event: {
                    id: "d".repeat(64), pubkey: "a".repeat(64), kind: 1, content: "new", tags: [],
                    created_at: 150, sig: "e".repeat(128),
                },
                relayUrls: ["wss://relay-a.example.com/"],
            }],
        }));
        await vi.waitFor(() => expect(upsertFetchedEvents).toHaveBeenCalledTimes(1));

        now = 130;
        resolvePersist({ insertedCount: 1, updatedCount: 0, unchangedCount: 0 });

        await expect(task.promise).resolves.toMatchObject({
            status: "success",
            timing: {
                primaryFetchDurationMs: 100,
                primaryPersistDurationMs: 30,
                primaryPersistAttemptCount: 1,
            },
        });
    });

    it("repair coverage fields で EOSE 未完了を partial として集約する", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                events: [],
                coverageRelayUrls: ["wss://write.example.com/"],
                coverageEoseRelayUrls: [],
                coverageComplete: false,
                coverageSaturated: false,
                allCoverageRelaysFailed: false,
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: { upsertFetchedEvents: vi.fn() } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{ kinds: [1, 42], rangeUnit: "custom", since: 100, until: 200, limit: 250 }],
        }).promise;

        expect(result).toEqual(expect.objectContaining({
            status: "partial",
            hadFailures: true,
            fetchFailed: false,
            processedRanges: [expect.objectContaining({
                status: "partial",
                coverageComplete: false,
            })],
        }));
    });

    it("best-effort EOSE があっても baseline 全明示失敗は fetchFailed にする", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                events: [],
                requestedRelayUrls: ["wss://write.example.com/", "wss://read.example.com/"],
                eoseRelayUrls: ["wss://read.example.com/"],
                hasAnyRelayResponse: true,
                coverageRelayUrls: ["wss://write.example.com/"],
                coverageEoseRelayUrls: [],
                bestEffortRelayUrls: ["wss://read.example.com/"],
                coverageComplete: false,
                coverageSaturated: false,
                allCoverageRelaysFailed: true,
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: { upsertFetchedEvents: vi.fn() } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{ kinds: [1, 42], rangeUnit: "custom", since: 100, until: 200, limit: 250 }],
        }).promise;

        expect(result).toEqual(expect.objectContaining({
            status: "partial",
            fetchFailed: true,
            hadFailures: true,
            processedRanges: [expect.objectContaining({
                allCoverageRelaysFailed: true,
                eoseRelayUrls: ["wss://read.example.com/"],
            })],
        }));
    });

    it("best-effort saturation alone does not split a complete coverage range", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                rawCount: 250,
                coverageRelayUrls: ["wss://write.example.com/"],
                bestEffortRelayUrls: ["wss://read.example.com/"],
                coverageEoseRelayUrls: ["wss://write.example.com/"],
                coverageComplete: true,
                coverageSaturated: false,
            })),
            cancel: vi.fn(),
        });
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: { upsertFetchedEvents: vi.fn() } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [{ kinds: [1, 42], rangeUnit: "custom", since: 0, until: 10_000, limit: 250 }],
        }).promise;

        expect(fetchLatest).toHaveBeenCalledOnce();
        expect(result).toEqual(expect.objectContaining({
            status: "success",
            limitReached: false,
            processedRanges: [expect.objectContaining({ status: "complete" })],
        }));
    });

    it("preferredRanges が空なら fetch せず no-op success を返す", async () => {
        const fetchLatest = vi.fn();
        const service = new PostHistoryCurrentViewRefetchService({
            postHistoryRelayFetchService: { fetchLatest } as any,
            postHistoryRepository: {
                upsertFetchedEvents: vi.fn(),
            } as any,
        });

        const result = await service.refetchAroundCurrentView({} as any, {
            pubkeyHex: "a".repeat(64),
            relayConfig: null,
            preferredRanges: [],
        }).promise;

        expect(fetchLatest).not.toHaveBeenCalled();
        expect(result).toEqual({
            status: "success",
            addedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
            processedRangeCount: 0,
            attemptedRangeCount: 0,
            hadFailures: false,
            limitReached: false,
            hadFetchError: false,
            fetchFailed: false,
            hadTimeout: false,
            hadUnfinishedRanges: false,
            splitRetryCount: 0,
            processedRanges: [],
            timing: {
                primaryFetchDurationMs: 0,
                primaryPersistDurationMs: 0,
                primaryPersistAttemptCount: 0,
            },
        });
    });
});
