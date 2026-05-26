import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    reconcilePendingDeletionRequestsForParentEventIds,
    reconcilePendingDeletionRequestsForRequestKeys,
} from "../../lib/postHistoryPendingDeletionRequestsReconcile";
import {
    resetInFlightPostHistoryReactionLifecycleRequests,
} from "../../lib/postHistoryReactionLifecycleState";
import {
    buildPostHistoryReactionLifecycleRequestKey,
} from "../../lib/postHistoryReactionLifecycleTypes";
import {
    pendingDeletionRequestsState,
    resetPendingDeletionRequests,
} from "../../stores/postHistoryDeletionLifecycleStore.svelte";

const PARENT_ID = "1".repeat(64);
const REACTION_ID = "2".repeat(64);
const REQUEST_KEY = buildPostHistoryReactionLifecycleRequestKey(PARENT_ID, REACTION_ID);

describe("postHistoryPendingDeletionRequestsReconcile", () => {
    beforeEach(() => {
        resetPendingDeletionRequests();
        resetInFlightPostHistoryReactionLifecycleRequests();
        vi.clearAllMocks();
    });

    it("UI load 時は parent scope の DB 状態で cache を置き換える", async () => {
        const repository = {
            getForParentEventIds: vi.fn(async () => [{
                requestKey: REQUEST_KEY,
                parentEventId: PARENT_ID,
                reactionEventId: REACTION_ID,
                reactionAuthorPubkey: "a".repeat(64),
                kind: 7 as const,
                source: "listing-current-view" as const,
                status: "success" as const,
                attemptCount: 1,
                updatedAt: 100,
                schemaVersion: 1,
            }]),
            getMany: vi.fn(),
            deleteMany: vi.fn(async () => undefined),
            saveMany: vi.fn(),
        };
        const consistencyService = {
            verifyConsistency: vi.fn(async () => ({
                deletedReactionEventIds: [],
                correctedRequestKeys: [],
                resolvedRequestKeys: [REQUEST_KEY],
                statePatches: [],
            })),
        };

        await reconcilePendingDeletionRequestsForParentEventIds([PARENT_ID], {
            reactionDeletionStateRepository: repository,
            reactionDeletionConsistencyService: consistencyService,
        });

        expect(repository.getForParentEventIds).toHaveBeenCalledWith([PARENT_ID]);
        expect(repository.deleteMany).toHaveBeenCalledWith([REQUEST_KEY]);
        expect(pendingDeletionRequestsState[REACTION_ID]).toBeUndefined();
    });

    it("reconcile は consistency diff を保存して cache へ反映する", async () => {
        const repository = {
            getForParentEventIds: vi.fn(),
            getMany: vi.fn(async () => [{
                requestKey: REQUEST_KEY,
                parentEventId: PARENT_ID,
                reactionEventId: REACTION_ID,
                reactionAuthorPubkey: "a".repeat(64),
                kind: 7 as const,
                source: "inbound-realtime" as const,
                status: "processing" as const,
                attemptCount: 1,
                updatedAt: 100,
                schemaVersion: 1,
            }]),
            deleteMany: vi.fn(async () => undefined),
            saveMany: vi.fn(async () => [{
                requestKey: REQUEST_KEY,
                parentEventId: PARENT_ID,
                reactionEventId: REACTION_ID,
                reactionAuthorPubkey: "a".repeat(64),
                kind: 7 as const,
                source: "inbound-realtime" as const,
                status: "failed" as const,
                attemptCount: 1,
                updatedAt: 200,
                schemaVersion: 1,
            }]),
        };
        const consistencyService = {
            verifyConsistency: vi.fn(async () => ({
                deletedReactionEventIds: [],
                correctedRequestKeys: [REQUEST_KEY],
                resolvedRequestKeys: [],
                statePatches: [{
                    requestKey: REQUEST_KEY,
                    parentEventId: PARENT_ID,
                    reactionEventId: REACTION_ID,
                    reactionAuthorPubkey: "a".repeat(64),
                    source: "inbound-realtime" as const,
                    status: "failed" as const,
                }],
            })),
        };

        await reconcilePendingDeletionRequestsForRequestKeys([REQUEST_KEY], {
            reactionDeletionStateRepository: repository,
            reactionDeletionConsistencyService: consistencyService,
        });

        expect(repository.saveMany).toHaveBeenCalledWith([
            expect.objectContaining({
                requestKey: REQUEST_KEY,
                status: "failed",
            }),
        ]);
        expect(pendingDeletionRequestsState[REACTION_ID]).toBe("failed");
    });
});