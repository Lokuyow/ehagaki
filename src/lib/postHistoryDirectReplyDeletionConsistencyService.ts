import {
    hasInFlightPostHistoryDirectReplyLifecycleRequest,
} from "./postHistoryDirectReplyLifecycleState";
import {
    postHistoryDirectReplyRecordsAdapter,
    type PostHistoryDirectReplyRecordsAdapter,
} from "./postHistoryChildInteractionsAdapter";
import type { PostHistoryDeletionRequestsRepository } from "./storage/postHistoryDeletionRequestsRepository";
import type { PostHistoryChildInteractionsRepository } from "./storage/postHistoryChildInteractionsRepository";
import type {
    SavePostHistoryDirectReplyLifecycleStateInput,
} from "./storage/postHistoryDirectReplyDeletionStateRepository";
import {
    type PostHistoryDirectReplyLifecycleCandidate,
    type PostHistoryDirectReplyLifecycleStateRecord,
} from "./postHistoryDirectReplyLifecycleTypes";
import { RelationDeletionConsistency } from "./postHistoryRelationDeletionLifecycle";

export interface VerifyPostHistoryDirectReplyDeletionConsistencyRequest {
    candidates: PostHistoryDirectReplyLifecycleCandidate[];
    statesByRequestKey: Map<string, PostHistoryDirectReplyLifecycleStateRecord>;
    deletionConfirmationIncomplete?: boolean;
    isActive?: () => boolean;
}

export interface VerifyPostHistoryDirectReplyDeletionConsistencyResult {
    deletedReplyEventIds: string[];
    correctedRequestKeys: string[];
    resolvedRequestKeys: string[];
    statePatches: SavePostHistoryDirectReplyLifecycleStateInput[];
}

export interface PostHistoryDirectReplyDeletionConsistencyServiceDeps {
    directReplyRecordsAdapter?: Pick<PostHistoryDirectReplyRecordsAdapter, "getDirectReplyRecords">;
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
    candidate: PostHistoryDirectReplyLifecycleCandidate,
    state: PostHistoryDirectReplyLifecycleStateRecord,
): SavePostHistoryDirectReplyLifecycleStateInput {
    return {
        requestKey: candidate.requestKey,
        parentEventId: candidate.parentEventId,
        replyEventId: candidate.replyEventId,
        replyAuthorPubkey: candidate.replyAuthorPubkey,
        source: state.source,
        status: "failed",
        attemptCount: state.attemptCount,
    };
}

export class PostHistoryDirectReplyDeletionConsistencyService {
    private consistency: RelationDeletionConsistency<
        PostHistoryDirectReplyLifecycleCandidate,
        PostHistoryDirectReplyLifecycleStateRecord,
        SavePostHistoryDirectReplyLifecycleStateInput
    >;

    constructor(deps: PostHistoryDirectReplyDeletionConsistencyServiceDeps = {}) {
        const recordsAdapter = deps.directReplyRecordsAdapter ?? postHistoryDirectReplyRecordsAdapter;
        this.consistency = new RelationDeletionConsistency({
            getRecords: (parentEventId) => recordsAdapter.getDirectReplyRecords(parentEventId),
            toTarget: (candidate) => ({
                requestKey: candidate.requestKey,
                parentEventId: candidate.parentEventId,
                targetEventId: candidate.replyEventId,
                targetAuthorPubkey: candidate.replyAuthorPubkey,
            }),
            hasInFlightRequest: (requestKey) =>
                hasInFlightPostHistoryDirectReplyLifecycleRequest(requestKey),
            buildFailedStatePatch,
            deletionRequestsRepository: deps.deletionRequestsRepository,
            childInteractionsRepository: deps.childInteractionsRepository,
        });
    }

    async verifyConsistency(
        params: VerifyPostHistoryDirectReplyDeletionConsistencyRequest,
    ): Promise<VerifyPostHistoryDirectReplyDeletionConsistencyResult> {
        const { deletedEventIds, ...rest } = await this.consistency.verifyConsistency(params);
        return { deletedReplyEventIds: deletedEventIds, ...rest };
    }
}

export const postHistoryDirectReplyDeletionConsistencyService =
    new PostHistoryDirectReplyDeletionConsistencyService();
