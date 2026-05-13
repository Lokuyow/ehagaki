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
                limit: 200,
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
                limit: 200,
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

    it("relay 結果が partial なら partial result を返す", async () => {
        const fetchLatest = vi.fn().mockReturnValue({
            promise: Promise.resolve(createFetchResult({
                hasMore: true,
                rawCount: 200,
                uniqueCount: 80,
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
                limit: 200,
            }],
        }).promise;

        expect(result).toEqual(expect.objectContaining({
            status: "partial",
            hadFailures: true,
            processedRangeCount: 1,
            processedRanges: [
                expect.objectContaining({
                    status: "partial",
                }),
            ],
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
            processedRanges: [],
        });
    });
});