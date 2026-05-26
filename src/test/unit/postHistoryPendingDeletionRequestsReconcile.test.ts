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
                kind: 7 as const,
                source: "listing-current-view" as const,
                status: "success" as const,
                updatedAt: 100,
                schemaVersion: 1,
            }]),
            getMany: vi.fn(),
            saveMany: vi.fn(),
        };

        await reconcilePendingDeletionRequestsForParentEventIds([PARENT_ID], {
            reactionDeletionStateRepository: repository,
        });

        expect(repository.getForParentEventIds).toHaveBeenCalledWith([PARENT_ID]);
        expect(pendingDeletionRequestsState[REACTION_ID]).toBe("success");
    });

    it("stale processing は reconcile 時に failed へ正規化する", async () => {
        const repository = {
            getForParentEventIds: vi.fn(),
            getMany: vi.fn(async () => [{
                requestKey: REQUEST_KEY,
                parentEventId: PARENT_ID,
                reactionEventId: REACTION_ID,
                kind: 7 as const,
                source: "inbound-realtime" as const,
                status: "processing" as const,
                updatedAt: 100,
                schemaVersion: 1,
            }]),
            saveMany: vi.fn(async () => [{
                requestKey: REQUEST_KEY,
                parentEventId: PARENT_ID,
                reactionEventId: REACTION_ID,
                kind: 7 as const,
                source: "inbound-realtime" as const,
                status: "failed" as const,
                updatedAt: 200,
                schemaVersion: 1,
            }]),
        };

        await reconcilePendingDeletionRequestsForRequestKeys([REQUEST_KEY], {
            reactionDeletionStateRepository: repository,
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