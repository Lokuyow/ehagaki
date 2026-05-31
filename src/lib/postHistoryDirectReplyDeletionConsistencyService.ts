import {
    hasInFlightPostHistoryDirectReplyLifecycleRequest,
} from "./postHistoryDirectReplyLifecycleState";
import {
    postHistoryDirectReplyRecordsAdapter,
    type PostHistoryDirectReplyRecordsAdapter,
} from "./postHistoryChildInteractionsAdapter";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionsRepository,
} from "./storage/postHistoryChildInteractionsRepository";
import type {
    PostHistoryChildInteractionRecord,
} from "./storage/ehagakiDb";
import type {
    SavePostHistoryDirectReplyLifecycleStateInput,
} from "./storage/postHistoryDirectReplyDeletionStateRepository";
import {
    type PostHistoryDirectReplyLifecycleCandidate,
    type PostHistoryDirectReplyLifecycleStateRecord,
} from "./postHistoryDirectReplyLifecycleTypes";

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

function uniqueEventIds(eventIds: string[]): string[] {
    return Array.from(new Set(eventIds.filter((eventId) => !!eventId)));
}

function uniqueRequestKeys(requestKeys: string[]): string[] {
    return Array.from(new Set(requestKeys.filter((requestKey) => !!requestKey)));
}

function toDirectReplyRecordsByParent(
    parentEventIds: string[],
    recordsByParentEventId: Map<string, PostHistoryChildInteractionRecord[]>,
): Map<string, Map<string, PostHistoryChildInteractionRecord>> {
    const rowsByParentEventId = new Map<string, Map<string, PostHistoryChildInteractionRecord>>();
    for (const parentEventId of parentEventIds) {
        rowsByParentEventId.set(
            parentEventId,
            new Map(
                (recordsByParentEventId.get(parentEventId) ?? []).map((record) => [
                    record.eventId,
                    record,
                ]),
            ),
        );
    }

    return rowsByParentEventId;
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
    private directReplyRecordsAdapter: Pick<PostHistoryDirectReplyRecordsAdapter, "getDirectReplyRecords">;
    private deletionRequestsRepository: Pick<
        PostHistoryDeletionRequestsRepository,
        "getDeletedTargets"
    >;
    private childInteractionsRepository: Pick<
        PostHistoryChildInteractionsRepository,
        "deleteChildInteractionByEventId"
    >;

    constructor(deps: PostHistoryDirectReplyDeletionConsistencyServiceDeps = {}) {
        this.directReplyRecordsAdapter =
            deps.directReplyRecordsAdapter ?? postHistoryDirectReplyRecordsAdapter;
        this.deletionRequestsRepository =
            deps.deletionRequestsRepository ?? postHistoryDeletionRequestsRepository;
        this.childInteractionsRepository =
            deps.childInteractionsRepository ?? postHistoryChildInteractionsRepository;
    }

    async verifyConsistency(
        params: VerifyPostHistoryDirectReplyDeletionConsistencyRequest,
    ): Promise<VerifyPostHistoryDirectReplyDeletionConsistencyResult> {
        const isActive = () => params.isActive?.() !== false;
        const uniqueCandidates = Array.from(new Map(
            params.candidates.map((candidate) => [candidate.requestKey, candidate]),
        ).values());
        if (uniqueCandidates.length === 0) {
            return {
                deletedReplyEventIds: [],
                correctedRequestKeys: [],
                resolvedRequestKeys: [],
                statePatches: [],
            };
        }

        const uniqueParentEventIds = uniqueEventIds(
            uniqueCandidates.map((candidate) => candidate.parentEventId),
        );
        const recordsByParentEventId = new Map<string, PostHistoryChildInteractionRecord[]>();
        for (const parentEventId of uniqueParentEventIds) {
            recordsByParentEventId.set(
                parentEventId,
                await this.directReplyRecordsAdapter.getDirectReplyRecords(parentEventId),
            );
        }
        if (!isActive()) {
            return {
                deletedReplyEventIds: [],
                correctedRequestKeys: [],
                resolvedRequestKeys: [],
                statePatches: [],
            };
        }

        const rowsByParentEventId = toDirectReplyRecordsByParent(
            uniqueParentEventIds,
            recordsByParentEventId,
        );
        const deletedTargets = await this.deletionRequestsRepository.getDeletedTargets(
            uniqueCandidates.map((candidate) => ({
                targetAuthorPubkey: candidate.replyAuthorPubkey,
                targetEventId: candidate.replyEventId,
            })),
        );

        const deletedReplyEventIds: string[] = [];
        const correctedRequestKeys: string[] = [];
        const resolvedRequestKeys: string[] = [];
        const statePatches: SavePostHistoryDirectReplyLifecycleStateInput[] = [];
        for (const candidate of uniqueCandidates) {
            const currentState = params.statesByRequestKey.get(candidate.requestKey);
            if (!currentState) {
                continue;
            }

            const rowsByEventId = rowsByParentEventId.get(candidate.parentEventId) ?? new Map();
            const replyRowExists = rowsByEventId.has(candidate.replyEventId);
            const deletionRequestExists =
                deletedTargets.get(candidate.replyAuthorPubkey)?.has(candidate.replyEventId)
                ?? false;

            let nextReplyRowExists = replyRowExists;
            if (deletionRequestExists && replyRowExists) {
                await this.childInteractionsRepository.deleteChildInteractionByEventId(
                    candidate.replyEventId,
                );
                nextReplyRowExists = false;
                correctedRequestKeys.push(candidate.requestKey);
                deletedReplyEventIds.push(candidate.replyEventId);
            }

            if (deletionRequestExists || !nextReplyRowExists || currentState.status === "success") {
                resolvedRequestKeys.push(candidate.requestKey);
                continue;
            }

            const isInFlight = hasInFlightPostHistoryDirectReplyLifecycleRequest(candidate.requestKey);
            const shouldPersistFailure =
                params.deletionConfirmationIncomplete === true
                || (
                    (currentState.status === "pending" || currentState.status === "processing")
                    && !isInFlight
                );

            if (!shouldPersistFailure) {
                resolvedRequestKeys.push(candidate.requestKey);
                continue;
            }

            if (currentState.status === "failed") {
                continue;
            }

            statePatches.push(buildFailedStatePatch(candidate, currentState));
        }

        return {
            deletedReplyEventIds: uniqueEventIds(deletedReplyEventIds),
            correctedRequestKeys: uniqueRequestKeys(correctedRequestKeys),
            resolvedRequestKeys: uniqueRequestKeys(resolvedRequestKeys),
            statePatches,
        };
    }
}

export const postHistoryDirectReplyDeletionConsistencyService =
    new PostHistoryDirectReplyDeletionConsistencyService();
