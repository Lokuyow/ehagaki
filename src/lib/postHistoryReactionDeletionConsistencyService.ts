import {
    hasInFlightPostHistoryReactionLifecycleRequest,
} from "./postHistoryReactionLifecycleState";
import {
    postHistoryReactionRecordsAdapter,
    type PostHistoryReactionRecordsAdapter,
} from "./postHistoryReplyEventsAdapter";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionsRepository,
} from "./storage/postHistoryReplyEventsRepository";
import type {
    PostHistoryReplyEventRecord,
} from "./storage/ehagakiDb";
import type {
    SavePostHistoryReactionLifecycleStateInput,
} from "./storage/postHistoryReactionDeletionStateRepository";
import {
    type PostHistoryReactionLifecycleCandidate,
    type PostHistoryReactionLifecycleStateRecord,
} from "./postHistoryReactionLifecycleTypes";

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

function uniqueEventIds(eventIds: string[]): string[] {
    return Array.from(new Set(eventIds.filter((eventId) => !!eventId)));
}

function uniqueRequestKeys(requestKeys: string[]): string[] {
    return Array.from(new Set(requestKeys.filter((requestKey) => !!requestKey)));
}

function toReactionRecordsByParent(
    parentEventIds: string[],
    recordsByParentEventId: Map<string, PostHistoryReplyEventRecord[]>,
): Map<string, Map<string, PostHistoryReplyEventRecord>> {
    const rowsByParentEventId = new Map<string, Map<string, PostHistoryReplyEventRecord>>();
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
    private reactionRecordsAdapter: Pick<PostHistoryReactionRecordsAdapter, "getReactionRecords">;
    private deletionRequestsRepository: Pick<
        PostHistoryDeletionRequestsRepository,
        "getDeletedTargets"
    >;
    private childInteractionsRepository: Pick<
        PostHistoryChildInteractionsRepository,
        "deleteChildInteractionByEventId"
    >;

    constructor(deps: PostHistoryReactionDeletionConsistencyServiceDeps = {}) {
        this.reactionRecordsAdapter = deps.reactionRecordsAdapter ?? postHistoryReactionRecordsAdapter;
        this.deletionRequestsRepository =
            deps.deletionRequestsRepository ?? postHistoryDeletionRequestsRepository;
        this.childInteractionsRepository =
            deps.childInteractionsRepository ?? postHistoryChildInteractionsRepository;
    }

    async verifyConsistency(
        params: VerifyPostHistoryReactionDeletionConsistencyRequest,
    ): Promise<VerifyPostHistoryReactionDeletionConsistencyResult> {
        const isActive = () => params.isActive?.() !== false;
        const uniqueCandidates = Array.from(new Map(
            params.candidates.map((candidate) => [candidate.requestKey, candidate]),
        ).values());
        if (uniqueCandidates.length === 0) {
            return {
                deletedReactionEventIds: [],
                correctedRequestKeys: [],
                resolvedRequestKeys: [],
                statePatches: [],
            };
        }

        const uniqueParentEventIds = uniqueEventIds(
            uniqueCandidates.map((candidate) => candidate.parentEventId),
        );
        const recordsByParentEventId = new Map<string, PostHistoryReplyEventRecord[]>();
        for (const parentEventId of uniqueParentEventIds) {
            recordsByParentEventId.set(
                parentEventId,
                await this.reactionRecordsAdapter.getReactionRecords(parentEventId),
            );
        }
        if (!isActive()) {
            return {
                deletedReactionEventIds: [],
                correctedRequestKeys: [],
                resolvedRequestKeys: [],
                statePatches: [],
            };
        }

        const rowsByParentEventId = toReactionRecordsByParent(
            uniqueParentEventIds,
            recordsByParentEventId,
        );
        const deletedTargets = await this.deletionRequestsRepository.getDeletedTargets(
            uniqueCandidates.map((candidate) => ({
                targetAuthorPubkey: candidate.reactionAuthorPubkey,
                targetEventId: candidate.reactionEventId,
            })),
        );

        const deletedReactionEventIds: string[] = [];
        const correctedRequestKeys: string[] = [];
        const resolvedRequestKeys: string[] = [];
        const statePatches: SavePostHistoryReactionLifecycleStateInput[] = [];
        for (const candidate of uniqueCandidates) {
            const currentState = params.statesByRequestKey.get(candidate.requestKey);
            if (!currentState) {
                continue;
            }

            const rowsByEventId = rowsByParentEventId.get(candidate.parentEventId) ?? new Map();
            const reactionRowExists = rowsByEventId.has(candidate.reactionEventId);
            const deletionRequestExists =
                deletedTargets.get(candidate.reactionAuthorPubkey)?.has(candidate.reactionEventId)
                ?? false;

            let nextReactionRowExists = reactionRowExists;
            if (deletionRequestExists && reactionRowExists) {
                await this.childInteractionsRepository.deleteChildInteractionByEventId(
                    candidate.reactionEventId,
                );
                nextReactionRowExists = false;
                correctedRequestKeys.push(candidate.requestKey);
                deletedReactionEventIds.push(candidate.reactionEventId);
            }

            if (deletionRequestExists || !nextReactionRowExists || currentState.status === "success") {
                resolvedRequestKeys.push(candidate.requestKey);
                continue;
            }

            const isInFlight = hasInFlightPostHistoryReactionLifecycleRequest(candidate.requestKey);
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
            deletedReactionEventIds: uniqueEventIds(deletedReactionEventIds),
            correctedRequestKeys: uniqueRequestKeys(correctedRequestKeys),
            resolvedRequestKeys: uniqueRequestKeys(resolvedRequestKeys),
            statePatches,
        };
    }
}

export const postHistoryReactionDeletionConsistencyService =
    new PostHistoryReactionDeletionConsistencyService();