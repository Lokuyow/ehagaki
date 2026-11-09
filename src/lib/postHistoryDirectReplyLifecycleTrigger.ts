import type { RxNostr } from "rx-nostr";
import {
    postHistoryDirectReplyDeletionCleanupService,
    type PostHistoryDirectReplyDeletionCleanupResult,
} from "./postHistoryDirectReplyDeletionCleanupService";
import {
    postHistoryDirectReplyDeletionConsistencyService,
} from "./postHistoryDirectReplyDeletionConsistencyService";
import {
    postHistoryDirectReplyRecordsAdapter,
} from "./postHistoryChildInteractionsAdapter";
import {
    addInFlightPostHistoryDirectReplyLifecycleRequests,
    hasInFlightPostHistoryDirectReplyLifecycleRequest,
    removeInFlightPostHistoryDirectReplyLifecycleRequests,
} from "./postHistoryDirectReplyLifecycleState";
import {
    buildPostHistoryDirectReplyLifecycleRequestKey,
    canRetryPostHistoryDirectReplyLifecycle,
    type PostHistoryDirectReplyLifecycleCandidate,
    type PostHistoryDirectReplyLifecycleKind,
    type PostHistoryDirectReplyLifecycleSource,
    type PostHistoryDirectReplyLifecycleStateRecord,
} from "./postHistoryDirectReplyLifecycleTypes";
import {
    reconcilePendingDeletionRequestsForRequestKeys,
} from "./postHistoryPendingDeletionRequestsReconcile";
import {
    postHistoryDirectReplyDeletionStateRepository,
    type SavePostHistoryDirectReplyLifecycleStateInput,
} from "./storage/postHistoryDirectReplyDeletionStateRepository";
import { createRelationLifecycleTrigger } from "./postHistoryRelationDeletionLifecycle";
import type { RelayConfig } from "./types";

export interface PostHistoryDirectReplyLifecycleTriggerRequest {
    source: PostHistoryDirectReplyLifecycleSource;
    parentEventIds: string[];
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
    isActive?: () => boolean;
}

export interface PostHistoryDirectReplyLifecycleTriggerResult
    extends PostHistoryDirectReplyDeletionCleanupResult {
    source: PostHistoryDirectReplyLifecycleSource;
}

// Route A contract: this is the only production entry point for direct reply
// deletion callers. Keep dialog, sync, realtime, and listing flows routed here.
const runDirectReplyLifecycle = createRelationLifecycleTrigger<
    PostHistoryDirectReplyLifecycleCandidate,
    PostHistoryDirectReplyLifecycleStateRecord,
    SavePostHistoryDirectReplyLifecycleStateInput
>({
    getRecordsSource: () => {
        const adapter = postHistoryDirectReplyRecordsAdapter;
        const getRecordsForParents = adapter.getDirectReplyRecordsForParents;
        return {
            getRecords: (parentEventId) => adapter.getDirectReplyRecords(parentEventId),
            getRecordsForParents: getRecordsForParents
                ? (parentEventIds) => getRecordsForParents.call(adapter, parentEventIds)
                : undefined,
        };
    },
    getStateRepository: () => postHistoryDirectReplyDeletionStateRepository,
    toCandidate: (parentEventId, record) => {
        const kind = record.kind as PostHistoryDirectReplyLifecycleKind;
        return {
            requestKey: buildPostHistoryDirectReplyLifecycleRequestKey(
                parentEventId,
                record.eventId,
                kind,
            ),
            parentEventId,
            replyEventId: record.eventId,
            replyAuthorPubkey: record.authorPubkey,
            kind,
        };
    },
    getTargetEventId: (candidate) => candidate.replyEventId,
    toStateInput: (candidate, source, transition) => ({
        ...transition,
        requestKey: candidate.requestKey,
        parentEventId: candidate.parentEventId,
        replyEventId: candidate.replyEventId,
        replyAuthorPubkey: candidate.replyAuthorPubkey,
        source,
        kind: candidate.kind,
    }),
    inFlight: {
        has: (requestKey) => hasInFlightPostHistoryDirectReplyLifecycleRequest(requestKey),
        add: (requestKeys) => addInFlightPostHistoryDirectReplyLifecycleRequests(requestKeys),
        remove: (requestKeys) => removeInFlightPostHistoryDirectReplyLifecycleRequests(requestKeys),
    },
    canRetryFailedState: (state) => canRetryPostHistoryDirectReplyLifecycle(state),
    cleanup: async (rxNostr, params) => {
        const { deletedReplyEventIds, ...rest } =
            await postHistoryDirectReplyDeletionCleanupService.cleanupDirectReplyDeletions(rxNostr, {
                parentEventIds: params.parentEventIds,
                replyEventIds: params.targetEventIds,
                relayConfig: params.relayConfig,
                isActive: params.isActive,
            });
        return { ...rest, deletedEventIds: deletedReplyEventIds };
    },
    verifyConsistency: async (params) => {
        const { deletedReplyEventIds, ...rest } =
            await postHistoryDirectReplyDeletionConsistencyService.verifyConsistency(params);
        return { ...rest, deletedEventIds: deletedReplyEventIds };
    },
    reconcilePendingDeletionRequests: (requestKeys) =>
        reconcilePendingDeletionRequestsForRequestKeys(requestKeys),
});

export async function triggerPostHistoryDirectReplyLifecycle(
    request: PostHistoryDirectReplyLifecycleTriggerRequest,
): Promise<PostHistoryDirectReplyLifecycleTriggerResult> {
    const { deletedEventIds, ...rest } = await runDirectReplyLifecycle(request);
    return { ...rest, deletedReplyEventIds: deletedEventIds };
}
