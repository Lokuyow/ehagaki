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
    type PostHistoryDirectReplyRecordsAdapter,
} from "./postHistoryChildInteractionsAdapter";
import {
    addInFlightPostHistoryDirectReplyLifecycleRequests,
    hasInFlightPostHistoryDirectReplyLifecycleRequest,
    removeInFlightPostHistoryDirectReplyLifecycleRequests,
} from "./postHistoryDirectReplyLifecycleState";
import {
    buildPostHistoryDirectReplyLifecycleRequestKey,
    canRetryPostHistoryDirectReplyLifecycle,
    POST_HISTORY_DIRECT_REPLY_LIFECYCLE_KIND,
    type PostHistoryDirectReplyLifecycleCandidate,
    type PostHistoryDirectReplyLifecycleSource,
    type PostHistoryDirectReplyLifecycleStateRecord,
} from "./postHistoryDirectReplyLifecycleTypes";
import {
    mapStateRecordsByRequestKey,
    normalizeNonEmptyEventIds,
    partitionRelationLifecycleCandidates,
    uniqueRequestKeysFromCandidates,
} from "./postHistoryRelationLifecycleHelpers";
import {
    reconcilePendingDeletionRequestsForRequestKeys,
} from "./postHistoryPendingDeletionRequestsReconcile";
import {
    postHistoryDirectReplyDeletionStateRepository,
    type SavePostHistoryDirectReplyLifecycleStateInput,
    type PostHistoryDirectReplyDeletionStateRepository,
} from "./storage/postHistoryDirectReplyDeletionStateRepository";
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

function normalizeParentEventIds(parentEventIds: string[]): string[] {
    return normalizeNonEmptyEventIds(parentEventIds);
}

async function loadDirectReplyLifecycleCandidates(
    parentEventIds: string[],
    directReplyRecordsAdapter: Pick<PostHistoryDirectReplyRecordsAdapter, "getDirectReplyRecords">,
): Promise<PostHistoryDirectReplyLifecycleCandidate[]> {
    const candidates: PostHistoryDirectReplyLifecycleCandidate[] = [];

    for (const parentEventId of parentEventIds) {
        const records = await directReplyRecordsAdapter.getDirectReplyRecords(parentEventId);
        for (const record of records) {
            candidates.push({
                requestKey: buildPostHistoryDirectReplyLifecycleRequestKey(
                    parentEventId,
                    record.eventId,
                ),
                parentEventId,
                replyEventId: record.eventId,
                replyAuthorPubkey: record.authorPubkey,
                kind: POST_HISTORY_DIRECT_REPLY_LIFECYCLE_KIND,
            });
        }
    }

    return Array.from(new Map(
        candidates.map((candidate) => [candidate.requestKey, candidate]),
    ).values());
}

async function saveLifecycleStateTransitions(
    directReplyDeletionStateRepository: Pick<PostHistoryDirectReplyDeletionStateRepository, "saveMany">,
    source: PostHistoryDirectReplyLifecycleSource,
    candidates: PostHistoryDirectReplyLifecycleCandidate[],
    inputFactory: (
        candidate: PostHistoryDirectReplyLifecycleCandidate,
    ) => Omit<
        SavePostHistoryDirectReplyLifecycleStateInput,
        "requestKey"
        | "parentEventId"
        | "replyEventId"
        | "replyAuthorPubkey"
        | "source"
    >,
): Promise<PostHistoryDirectReplyLifecycleStateRecord[]> {
    if (candidates.length === 0) {
        return [];
    }

    return directReplyDeletionStateRepository.saveMany(
        candidates.map((candidate) => ({
            ...inputFactory(candidate),
            requestKey: candidate.requestKey,
            parentEventId: candidate.parentEventId,
            replyEventId: candidate.replyEventId,
            replyAuthorPubkey: candidate.replyAuthorPubkey,
            source,
        })),
    );
}

export async function triggerPostHistoryDirectReplyLifecycle(
    request: PostHistoryDirectReplyLifecycleTriggerRequest,
): Promise<PostHistoryDirectReplyLifecycleTriggerResult> {
    const directReplyRecordsAdapterInstance = postHistoryDirectReplyRecordsAdapter;
    const directReplyDeletionStateRepositoryInstance = postHistoryDirectReplyDeletionStateRepository;
    const parentEventIds = normalizeParentEventIds(request.parentEventIds);
    if (parentEventIds.length === 0) {
        return {
            source: request.source,
            status: "completed",
            checkedParentEventIds: parentEventIds,
            deletedReplyEventIds: [],
            deletionConfirmationIncomplete: false,
        };
    }

    const candidates = await loadDirectReplyLifecycleCandidates(
        parentEventIds,
        directReplyRecordsAdapterInstance,
    );
    const existingStateRecords = await directReplyDeletionStateRepositoryInstance.getMany(
        uniqueRequestKeysFromCandidates(candidates),
    );
    const existingStateByRequestKey = mapStateRecordsByRequestKey(existingStateRecords);
    const {
        skippedCandidates,
        admittedCandidates,
    } = partitionRelationLifecycleCandidates({
        candidates,
        existingStateByRequestKey,
        hasInFlightRequest: hasInFlightPostHistoryDirectReplyLifecycleRequest,
        isFailedState: (state) => state.status === "failed",
        canRetryFailedState: canRetryPostHistoryDirectReplyLifecycle,
    });

    if (!request.rxNostr || admittedCandidates.length === 0) {
        await reconcilePendingDeletionRequestsForRequestKeys(
            uniqueRequestKeysFromCandidates(candidates),
        ).catch(() => undefined);

        return {
            source: request.source,
            status: "completed",
            checkedParentEventIds: parentEventIds,
            deletedReplyEventIds: [],
            deletionConfirmationIncomplete: false,
        };
    }

    const admittedRequestKeys = uniqueRequestKeysFromCandidates(admittedCandidates);
    addInFlightPostHistoryDirectReplyLifecycleRequests(admittedRequestKeys);

    try {
        const pendingStateRecords = await saveLifecycleStateTransitions(
            directReplyDeletionStateRepositoryInstance,
            request.source,
            admittedCandidates,
            (candidate) => ({
                status: "pending",
                attemptCount:
                    (existingStateByRequestKey.get(candidate.requestKey)?.attemptCount ?? 0) + 1,
            }),
        );
        await reconcilePendingDeletionRequestsForRequestKeys(admittedRequestKeys)
            .catch(() => undefined);

        const pendingStateByRequestKey = new Map(
            pendingStateRecords.map((record) => [record.requestKey, record]),
        );
        const processingStateRecords = await saveLifecycleStateTransitions(
            directReplyDeletionStateRepositoryInstance,
            request.source,
            admittedCandidates,
            () => ({
                status: "processing",
            }),
        );
        await reconcilePendingDeletionRequestsForRequestKeys(admittedRequestKeys)
            .catch(() => undefined);

        const processingStateByRequestKey = new Map(
            [...pendingStateByRequestKey.values(), ...processingStateRecords]
                .map((record) => [record.requestKey, record]),
        );

        const result = await postHistoryDirectReplyDeletionCleanupService.cleanupDirectReplyDeletions(
            request.rxNostr,
            {
                parentEventIds: Array.from(new Set(
                    admittedCandidates.map((candidate) => candidate.parentEventId),
                )),
                replyEventIds: admittedCandidates.map((candidate) => candidate.replyEventId),
                relayConfig: request.relayConfig,
                isActive: request.isActive,
            },
        );

        if (result.status === "cancelled") {
            await saveLifecycleStateTransitions(
                directReplyDeletionStateRepositoryInstance,
                request.source,
                admittedCandidates,
                () => ({
                    status: "failed",
                }),
            );

            return {
                source: request.source,
                ...result,
            };
        }

        const consistencyResult =
            await postHistoryDirectReplyDeletionConsistencyService.verifyConsistency({
                candidates: admittedCandidates,
                statesByRequestKey: processingStateByRequestKey,
                deletionConfirmationIncomplete:
                    result.status !== "completed"
                    || result.deletionConfirmationIncomplete,
                isActive: request.isActive,
            });
        const resolvedRequestKeys = consistencyResult.resolvedRequestKeys ?? [];
        const finalStateRecords = consistencyResult.statePatches.length > 0
            ? await directReplyDeletionStateRepositoryInstance.saveMany(consistencyResult.statePatches)
            : [];
        if (resolvedRequestKeys.length > 0) {
            await directReplyDeletionStateRepositoryInstance.deleteMany(resolvedRequestKeys);
        }
        const deletedReplyEventIds = Array.from(new Set([
            ...result.deletedReplyEventIds,
            ...consistencyResult.deletedReplyEventIds,
        ]));
        const hasFailedState = finalStateRecords.some((record) => record.status === "failed");

        return {
            source: request.source,
            status:
                result.deletionConfirmationIncomplete || hasFailedState
                    ? "partial"
                    : "completed",
            checkedParentEventIds: Array.from(new Set(
                admittedCandidates.map((candidate) => candidate.parentEventId),
            )),
            deletedReplyEventIds,
            deletionConfirmationIncomplete:
                result.deletionConfirmationIncomplete || hasFailedState,
        };
    } catch {
        await saveLifecycleStateTransitions(
            directReplyDeletionStateRepositoryInstance,
            request.source,
            admittedCandidates,
            () => ({
                status: "failed",
            }),
        ).catch(() => undefined);

        return {
            source: request.source,
            status: "partial",
            checkedParentEventIds: Array.from(new Set(
                admittedCandidates.map((candidate) => candidate.parentEventId),
            )),
            deletedReplyEventIds: [],
            deletionConfirmationIncomplete: true,
        };
    } finally {
        removeInFlightPostHistoryDirectReplyLifecycleRequests(admittedRequestKeys);
    }
}
