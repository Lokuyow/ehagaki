import type { RxNostr } from "rx-nostr";
import {
    postHistoryReactionDeletionCleanupService,
    type PostHistoryReactionDeletionCleanupResult,
} from "./postHistoryReactionDeletionCleanupService";
import {
    postHistoryReactionDeletionConsistencyService,
} from "./postHistoryReactionDeletionConsistencyService";
import {
    postHistoryReactionRecordsAdapter,
} from "./postHistoryChildInteractionsAdapter";
import {
    addInFlightPostHistoryReactionLifecycleRequests,
    hasInFlightPostHistoryReactionLifecycleRequest,
    removeInFlightPostHistoryReactionLifecycleRequests,
} from "./postHistoryReactionLifecycleState";
import {
    buildPostHistoryReactionLifecycleRequestKey,
    canRetryPostHistoryReactionLifecycle,
    POST_HISTORY_REACTION_LIFECYCLE_KIND,
    type PostHistoryReactionLifecycleCandidate,
    type PostHistoryReactionLifecycleSource,
    type PostHistoryReactionLifecycleStateRecord,
} from "./postHistoryReactionLifecycleTypes";
import {
    reconcilePendingDeletionRequestsForRequestKeys,
} from "./postHistoryPendingDeletionRequestsReconcile";
import {
    postHistoryReactionDeletionStateRepository,
    type SavePostHistoryReactionLifecycleStateInput,
} from "./storage/postHistoryReactionDeletionStateRepository";
import { createRelationLifecycleTrigger } from "./postHistoryRelationDeletionLifecycle";
import type { RelayConfig } from "./types";

export interface PostHistoryReactionLifecycleTriggerRequest {
    source: PostHistoryReactionLifecycleSource;
    parentEventIds: string[];
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
    isActive?: () => boolean;
}

export interface PostHistoryReactionLifecycleTriggerResult
    extends PostHistoryReactionDeletionCleanupResult {
    source: PostHistoryReactionLifecycleSource;
}

// Route A contract: this is the only production entry point for reaction
// deletion callers. Keep dialog, sync, realtime, and listing flows routed here.
const runReactionLifecycle = createRelationLifecycleTrigger<
    PostHistoryReactionLifecycleCandidate,
    PostHistoryReactionLifecycleStateRecord,
    SavePostHistoryReactionLifecycleStateInput
>({
    getRecordsSource: () => {
        const adapter = postHistoryReactionRecordsAdapter;
        const getRecordsForParents = adapter.getReactionRecordsForParents;
        return {
            getRecords: (parentEventId) => adapter.getReactionRecords(parentEventId),
            getRecordsForParents: getRecordsForParents
                ? (parentEventIds) => getRecordsForParents.call(adapter, parentEventIds)
                : undefined,
        };
    },
    getStateRepository: () => postHistoryReactionDeletionStateRepository,
    toCandidate: (parentEventId, record) => ({
        requestKey: buildPostHistoryReactionLifecycleRequestKey(parentEventId, record.eventId),
        parentEventId,
        reactionEventId: record.eventId,
        reactionAuthorPubkey: record.authorPubkey,
        kind: POST_HISTORY_REACTION_LIFECYCLE_KIND,
    }),
    getTargetEventId: (candidate) => candidate.reactionEventId,
    toStateInput: (candidate, source, transition) => ({
        ...transition,
        requestKey: candidate.requestKey,
        parentEventId: candidate.parentEventId,
        reactionEventId: candidate.reactionEventId,
        reactionAuthorPubkey: candidate.reactionAuthorPubkey,
        source,
    }),
    inFlight: {
        has: (requestKey) => hasInFlightPostHistoryReactionLifecycleRequest(requestKey),
        add: (requestKeys) => addInFlightPostHistoryReactionLifecycleRequests(requestKeys),
        remove: (requestKeys) => removeInFlightPostHistoryReactionLifecycleRequests(requestKeys),
    },
    canRetryFailedState: (state) => canRetryPostHistoryReactionLifecycle(state),
    cleanup: async (rxNostr, params) => {
        const { deletedReactionEventIds, ...rest } =
            await postHistoryReactionDeletionCleanupService.cleanupReactionDeletions(rxNostr, {
                parentEventIds: params.parentEventIds,
                reactionEventIds: params.targetEventIds,
                relayConfig: params.relayConfig,
                isActive: params.isActive,
            });
        return { ...rest, deletedEventIds: deletedReactionEventIds };
    },
    verifyConsistency: async (params) => {
        const { deletedReactionEventIds, ...rest } =
            await postHistoryReactionDeletionConsistencyService.verifyConsistency(params);
        return { ...rest, deletedEventIds: deletedReactionEventIds };
    },
    reconcilePendingDeletionRequests: (requestKeys) =>
        reconcilePendingDeletionRequestsForRequestKeys(requestKeys),
});

export async function triggerPostHistoryReactionLifecycle(
    request: PostHistoryReactionLifecycleTriggerRequest,
): Promise<PostHistoryReactionLifecycleTriggerResult> {
    const { deletedEventIds, ...rest } = await runReactionLifecycle(request);
    return { ...rest, deletedReactionEventIds: deletedEventIds };
}
