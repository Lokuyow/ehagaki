import { describe, expect, it, vi } from "vitest";
import {
    PostHistoryForegroundPeriodicSyncService,
} from "../../lib/postHistoryForegroundPeriodicSyncService";
import type { PostHistoryAuthoredSyncState } from "../../lib/storage/postHistoryAuthoredSyncStateRepository";
import type { NostrEvent } from "../../lib/types";

const OWNER_PUBKEY = "a".repeat(64);

function createEvent(createdAt = 950): NostrEvent {
    return {
        id: `${createdAt}`.padStart(64, "1"),
        pubkey: OWNER_PUBKEY,
        kind: 1,
        content: "remote self post",
        tags: [],
        created_at: createdAt,
        sig: "c".repeat(128),
    };
}

function createAuthoredResult(overrides: Record<string, unknown> = {}) {
    const event = createEvent();
    return {
        fetchResult: {
            status: "success",
            events: [{ event, relayUrls: [] }],
            fetchedAt: 2_000,
            nextUntil: null,
            hasMore: false,
            relayUrls: [],
            observedRelayUrls: [],
            rawCount: 1,
            uniqueCount: 1,
            duplicateCount: 0,
            perRelayCounts: [],
            oldestCreatedAt: event.created_at,
            newestCreatedAt: event.created_at,
            requestedRelayUrls: [],
            eventRelayUrls: [],
            eoseRelayUrls: [],
            closedRelayUrls: [],
            errorRelayUrls: [],
            downRelayUrls: [],
            completedByRxNostr: true,
            completedByLocalTimeout: false,
            hasAnyRelayResponse: true,
            allRelaysFailed: false,
            ...overrides,
        },
        upsertSummary: { insertedCount: 1, updatedCount: 0, unchangedCount: 0 },
        savedSelfPostEventIds: [event.id],
    } as any;
}

function createInboundResult() {
    return {
        status: "success",
        fetchedAt: 2_000,
        since: 100,
        limit: 100,
        relayUrls: [],
        rawCount: 0,
        uniqueCount: 0,
        saturated: false,
        maybeIncomplete: false,
        newestSeenCreatedAt: null,
        savedParentEventIds: [],
        savedDirectReplyCount: 0,
        classifications: {
            "direct-reply": 0,
            "direct-reply-candidate": 0,
            "mention-like": 0,
            reaction: 0,
            unsupported: 0,
        },
    } as const;
}

function createState(overrides: Partial<PostHistoryAuthoredSyncState> = {}): PostHistoryAuthoredSyncState {
    return {
        ownerPubkeyHex: OWNER_PUBKEY,
        completedThroughTimestamp: null,
        latestObservedCreatedAt: null,
        lastPeriodicSyncAt: null,
        pendingCatchup: null,
        saturated: false,
        maybeIncomplete: false,
        updatedAt: 0,
        schemaVersion: 1,
        ...overrides,
    };
}

function createCoordinator(options: {
    authoredResults?: any[];
    cooldown?: (lane: "authored" | "inbound") => boolean;
} = {}) {
    const authoredResults = [...(options.authoredResults ?? [createAuthoredResult()])];
    return {
        runAuthored: vi.fn(() => ({
            promise: Promise.resolve(authoredResults.shift() ?? createAuthoredResult()),
            cancel: vi.fn(),
            joinedExisting: false,
        })),
        runInbound: vi.fn(() => ({
            promise: Promise.resolve(createInboundResult()),
            cancel: vi.fn(),
            joinedExisting: false,
        })),
        isForegroundPeriodicCooldownActive: vi.fn((
            _ownerPubkeyHex: string,
            lane: "authored" | "inbound",
        ) => options.cooldown?.(lane) ?? false),
    };
}

describe("PostHistoryForegroundPeriodicSyncService", () => {
    it("advances a non-saturated fresh head to its request upper bound even with no authored events", async () => {
        const coordinator = createCoordinator({
            authoredResults: [createAuthoredResult({
                events: [],
                rawCount: 0,
                uniqueCount: 0,
                oldestCreatedAt: null,
                newestCreatedAt: null,
            })],
        });
        const save = vi.fn(async (_ownerPubkeyHex: string, patch: Record<string, unknown>) => createState(patch));
        const service = new PostHistoryForegroundPeriodicSyncService({
            lightweightSyncCoordinator: coordinator as any,
            authoredSyncStateRepository: {
                get: vi.fn(async () => null),
                save,
            },
            now: () => 1_000_000,
        });

        await service.sync({} as any, { ownerPubkeyHex: OWNER_PUBKEY }).promise;

        expect(coordinator.runAuthored).toHaveBeenCalledWith({} as any, expect.objectContaining({
            ownerPubkeyHex: OWNER_PUBKEY,
            reason: "foreground-periodic",
            since: 0,
            until: 1_000,
        }));
        expect(save).toHaveBeenCalledWith(OWNER_PUBKEY, expect.objectContaining({
            completedThroughTimestamp: 1_000,
            pendingCatchup: null,
            saturated: false,
            maybeIncomplete: false,
        }));
    });

    it("creates pending catchup from a saturated fresh head upper bound without advancing completion", async () => {
        const coordinator = createCoordinator({
            authoredResults: [createAuthoredResult({
                hasMore: true,
                nextUntil: 940,
            })],
        });
        const save = vi.fn(async (_ownerPubkeyHex: string, patch: Record<string, unknown>) => createState(patch));
        const service = new PostHistoryForegroundPeriodicSyncService({
            lightweightSyncCoordinator: coordinator as any,
            authoredSyncStateRepository: {
                get: vi.fn(async () => createState({ completedThroughTimestamp: 500 })),
                save,
            },
            now: () => 1_000_000,
        });

        await service.sync({} as any, { ownerPubkeyHex: OWNER_PUBKEY }).promise;

        expect(save).toHaveBeenCalledWith(OWNER_PUBKEY, expect.objectContaining({
            pendingCatchup: {
                since: 440,
                until: 1_000,
                targetUpperBoundTimestamp: 1_000,
                cursorUntil: 940,
                boundaryMaybeIncomplete: false,
            },
            saturated: true,
            maybeIncomplete: true,
        }));
        expect(save.mock.calls[0]?.[1]).not.toHaveProperty("completedThroughTimestamp");
    });

    it("keeps pending catchup separate from a fresh saturated head and fetches one pending page", async () => {
        const pending = {
            since: 100,
            until: 700,
            targetUpperBoundTimestamp: 700,
            cursorUntil: 600,
            boundaryMaybeIncomplete: false,
        };
        const coordinator = createCoordinator({
            authoredResults: [
                createAuthoredResult({ hasMore: true, nextUntil: 980 }),
                createAuthoredResult({ hasMore: false }),
            ],
        });
        const save = vi.fn(async (_ownerPubkeyHex: string, patch: Record<string, unknown>) => createState(patch));
        const service = new PostHistoryForegroundPeriodicSyncService({
            lightweightSyncCoordinator: coordinator as any,
            authoredSyncStateRepository: {
                get: vi.fn(async () => createState({
                    completedThroughTimestamp: 400,
                    pendingCatchup: pending,
                    saturated: true,
                    maybeIncomplete: true,
                })),
                save,
            },
            now: () => 1_000_000,
        });

        await service.sync({} as any, { ownerPubkeyHex: OWNER_PUBKEY }).promise;

        expect(coordinator.runAuthored).toHaveBeenCalledTimes(2);
        expect((coordinator.runAuthored.mock.calls as any[])[1]?.[1]).toEqual(expect.objectContaining({
            since: 100,
            until: 600,
        }));
        expect(save).toHaveBeenLastCalledWith(OWNER_PUBKEY, expect.objectContaining({
            completedThroughTimestamp: 700,
            pendingCatchup: null,
            saturated: true,
            maybeIncomplete: true,
        }));
    });

    it("runs only the lane outside periodic cooldown", async () => {
        const coordinator = createCoordinator({
            cooldown: (lane) => lane === "authored",
        });
        const service = new PostHistoryForegroundPeriodicSyncService({
            lightweightSyncCoordinator: coordinator as any,
            authoredSyncStateRepository: {
                get: vi.fn(),
                save: vi.fn(),
            },
        });

        const result = await service.sync({} as any, { ownerPubkeyHex: OWNER_PUBKEY }).promise;

        expect(result.authored.status).toBe("skipped-cooldown");
        expect(coordinator.runAuthored).not.toHaveBeenCalled();
        expect(coordinator.runInbound).toHaveBeenCalledOnce();
    });

    it("keeps a same-second pending boundary incomplete instead of advancing completion", async () => {
        const pending = {
            since: 100,
            until: 700,
            targetUpperBoundTimestamp: 700,
            cursorUntil: 600,
            boundaryMaybeIncomplete: false,
        };
        const coordinator = createCoordinator({
            authoredResults: [
                createAuthoredResult(),
                createAuthoredResult({ hasMore: true, nextUntil: 600, oldestCreatedAt: 600 }),
            ],
        });
        const save = vi.fn(async (_ownerPubkeyHex: string, patch: Record<string, unknown>) => createState(patch));
        const service = new PostHistoryForegroundPeriodicSyncService({
            lightweightSyncCoordinator: coordinator as any,
            authoredSyncStateRepository: {
                get: vi.fn(async () => createState({ pendingCatchup: pending })),
                save,
            },
        });

        await service.sync({} as any, { ownerPubkeyHex: OWNER_PUBKEY }).promise;

        expect(save).toHaveBeenLastCalledWith(OWNER_PUBKEY, expect.objectContaining({
            pendingCatchup: expect.objectContaining({
                cursorUntil: 600,
                boundaryMaybeIncomplete: true,
            }),
            saturated: true,
            maybeIncomplete: true,
        }));
        expect(save.mock.calls.at(-1)?.[1]).not.toHaveProperty("completedThroughTimestamp");
    });

    it("does not write authored periodic cursor state after the owner session turns stale", async () => {
        let active = true;
        let resolveAuthored!: (value: any) => void;
        const authoredPromise = new Promise<any>((resolve) => {
            resolveAuthored = resolve;
        });
        const coordinator = {
            runAuthored: vi.fn(() => ({
                promise: authoredPromise,
                cancel: vi.fn(),
                joinedExisting: false,
            })),
            runInbound: vi.fn(() => ({
                promise: Promise.resolve(createInboundResult()),
                cancel: vi.fn(),
                joinedExisting: false,
            })),
            isForegroundPeriodicCooldownActive: vi.fn(() => false),
        };
        const save = vi.fn();
        const service = new PostHistoryForegroundPeriodicSyncService({
            lightweightSyncCoordinator: coordinator as any,
            authoredSyncStateRepository: {
                get: vi.fn(async () => null),
                save,
            },
        });

        const task = service.sync({} as any, {
            ownerPubkeyHex: OWNER_PUBKEY,
            isActive: () => active,
        });
        active = false;
        resolveAuthored(createAuthoredResult());
        const result = await task.promise;

        expect(result.authored.status).toBe("cancelled");
        expect(save).not.toHaveBeenCalled();
    });
});
