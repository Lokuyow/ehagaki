import {
    hasInFlightPostHistoryReactionLifecycleRequest,
} from "./postHistoryReactionLifecycleState";
import {
    postHistoryReactionRecordsAdapter,
    type PostHistoryReactionRecordsAdapter,
} from "./postHistoryChildInteractionsAdapter";
import type { PostHistoryDeletionRequestsRepository } from "./storage/postHistoryDeletionRequestsRepository";
import type { PostHistoryChildInteractionsRepository } from "./storage/postHistoryChildInteractionsRepository";
import type {
    SavePostHistoryReactionLifecycleStateInput,
} from "./storage/postHistoryReactionDeletionStateRepository";
import {
    type PostHistoryReactionLifecycleCandidate,
    type PostHistoryReactionLifecycleStateRecord,
} from "./postHistoryReactionLifecycleTypes";
import { RelationDeletionConsistency } from "./postHistoryRelationDeletionLifecycle";

export interface VerifyPostHistoryReactionDeletionConsistencyRequest {
    candidates: PostHistoryReactionLifecycleCandidate[];
    statesByRequestKey: Map<string, PostHistoryReactionLifecycleStateRecord>;
    deletionConfirmationIncomplete?: boolean;
    isActive?: () => boolean;
}

export interface VerifyPostHistoryReactionDeletionConsistencyResult {
    deletedReactionEventIds: string[];
    correctedRequestKeys: string[];
    resolvedRequestKeys: string[];
    statePatches: SavePostHistoryReactionLifecycleStateInput[];
}

export interface PostHistoryReactionDeletionConsistencyServiceDeps {
    reactionRecordsAdapter?: Pick<PostHistoryReactionRecordsAdapter, "getReactionRecords">;
    deletionRequestsRepository?: Pick<
        PostHistoryDeletionRequestsRepository,
        "getDeletedTargets"
    >;
    childInteractionsRepository?: Pick<
        PostHistoryChildInteractionsRepository,
        "deleteChildInteractionByEventId"
    >;
}

function buildFailedStatePatch(
    candidate: PostHistoryReactionLifecycleCandidate,
    state: PostHistoryReactionLifecycleStateRecord,
): SavePostHistoryReactionLifecycleStateInput {
    return {
        requestKey: candidate.requestKey,
        parentEventId: candidate.parentEventId,
        reactionEventId: candidate.reactionEventId,
        reactionAuthorPubkey: candidate.reactionAuthorPubkey,
        source: state.source,
        status: "failed",
        attemptCount: state.attemptCount,
    };
}

export class PostHistoryReactionDeletionConsistencyService {
    private consistency: RelationDeletionConsistency<
        PostHistoryReactionLifecycleCandidate,
        PostHistoryReactionLifecycleStateRecord,
        SavePostHistoryReactionLifecycleStateInput
    >;

    constructor(deps: PostHistoryReactionDeletionConsistencyServiceDeps = {}) {
        const recordsAdapter = deps.reactionRecordsAdapter ?? postHistoryReactionRecordsAdapter;
        this.consistency = new RelationDeletionConsistency({
            getRecords: (parentEventId) => recordsAdapter.getReactionRecords(parentEventId),
            toTarget: (candidate) => ({
                requestKey: candidate.requestKey,
                parentEventId: candidate.parentEventId,
                targetEventId: candidate.reactionEventId,
                targetAuthorPubkey: candidate.reactionAuthorPubkey,
            }),
            hasInFlightRequest: (requestKey) =>
                hasInFlightPostHistoryReactionLifecycleRequest(requestKey),
            buildFailedStatePatch,
            deletionRequestsRepository: deps.deletionRequestsRepository,
            childInteractionsRepository: deps.childInteractionsRepository,
        });
    }

    async verifyConsistency(
        params: VerifyPostHistoryReactionDeletionConsistencyRequest,
    ): Promise<VerifyPostHistoryReactionDeletionConsistencyResult> {
        const { deletedEventIds, ...rest } = await this.consistency.verifyConsistency(params);
        return { deletedReactionEventIds: deletedEventIds, ...rest };
    }
}

export const postHistoryReactionDeletionConsistencyService =
    new PostHistoryReactionDeletionConsistencyService();
