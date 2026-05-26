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
    type PostHistoryReactionRecordsAdapter,
} from "./postHistoryReplyEventsAdapter";
import {
    addInFlightPostHistoryReactionLifecycleRequests,
    hasInFlightPostHistoryReactionLifecycleRequest,
    removeInFlightPostHistoryReactionLifecycleRequests,
} from "./postHistoryReactionLifecycleState";
import {
    buildPostHistoryReactionLifecycleRequestKey,
    canRetryPostHistoryReactionLifecycle,
    isReactionDeletionUiGuaranteed,
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
    type PostHistoryReactionDeletionStateRepository,
} from "./storage/postHistoryReactionDeletionStateRepository";
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

function normalizeParentEventIds(parentEventIds: string[]): string[] {
    return Array.from(new Set(parentEventIds.filter((eventId) => !!eventId)));
}

function uniqueRequestKeys(candidates: PostHistoryReactionLifecycleCandidate[]): string[] {
    return Array.from(new Set(candidates.map((candidate) => candidate.requestKey)));
}

async function loadReactionLifecycleCandidates(
    parentEventIds: string[],
    reactionRecordsAdapter: Pick<PostHistoryReactionRecordsAdapter, "getReactionRecords">,
): Promise<PostHistoryReactionLifecycleCandidate[]> {
    const candidates: PostHistoryReactionLifecycleCandidate[] = [];

    for (const parentEventId of parentEventIds) {
        const records = await reactionRecordsAdapter.getReactionRecords(parentEventId);
        for (const record of records) {
            candidates.push({
                requestKey: buildPostHistoryReactionLifecycleRequestKey(
                    parentEventId,
                    record.eventId,
                ),
                parentEventId,
                reactionEventId: record.eventId,
                reactionAuthorPubkey: record.authorPubkey,
                kind: POST_HISTORY_REACTION_LIFECYCLE_KIND,
            });
        }
    }

    return Array.from(new Map(
        candidates.map((candidate) => [candidate.requestKey, candidate]),
    ).values());
}

async function saveLifecycleStateTransitions(
    reactionDeletionStateRepository: Pick<PostHistoryReactionDeletionStateRepository, "saveMany">,
    source: PostHistoryReactionLifecycleSource,
    candidates: PostHistoryReactionLifecycleCandidate[],
    inputFactory: (
        candidate: PostHistoryReactionLifecycleCandidate,
    ) => Omit<
        SavePostHistoryReactionLifecycleStateInput,
        "requestKey"
        | "parentEventId"
        | "reactionEventId"
        | "reactionAuthorPubkey"
        | "source"
    >,
): Promise<PostHistoryReactionLifecycleStateRecord[]> {
    if (candidates.length === 0) {
        return [];
    }

    return reactionDeletionStateRepository.saveMany(
        candidates.map((candidate) => ({
            ...inputFactory(candidate),
            requestKey: candidate.requestKey,
            parentEventId: candidate.parentEventId,
            reactionEventId: candidate.reactionEventId,
            reactionAuthorPubkey: candidate.reactionAuthorPubkey,
            source,
        })),
    );
}

export async function triggerPostHistoryReactionLifecycle(
    request: PostHistoryReactionLifecycleTriggerRequest,
): Promise<PostHistoryReactionLifecycleTriggerResult> {
    const reactionRecordsAdapter = postHistoryReactionRecordsAdapter;
    const reactionDeletionStateRepository = postHistoryReactionDeletionStateRepository;
    const parentEventIds = normalizeParentEventIds(request.parentEventIds);
    if (parentEventIds.length === 0) {
        return {
            source: request.source,
            status: "completed",
            checkedParentEventIds: parentEventIds,
            deletedReactionEventIds: [],
            deletionConfirmationIncomplete: false,
        };
    }

    const candidates = await loadReactionLifecycleCandidates(
        parentEventIds,
        reactionRecordsAdapter,
    );
    const existingStateRecords = await reactionDeletionStateRepository.getMany(
        uniqueRequestKeys(candidates),
    );
    const existingStateByRequestKey = new Map(
        existingStateRecords.map((record) => [record.requestKey, record]),
    );
    const skippedCandidates = candidates.filter((candidate) =>
        hasInFlightPostHistoryReactionLifecycleRequest(candidate.requestKey)
        || (
            existingStateByRequestKey.has(candidate.requestKey)
            && existingStateByRequestKey.get(candidate.requestKey)?.status === "failed"
            && !canRetryPostHistoryReactionLifecycle(
                existingStateByRequestKey.get(candidate.requestKey)!,
            )
        ),
    );
    const admittedCandidates = candidates.filter((candidate) =>
        !hasInFlightPostHistoryReactionLifecycleRequest(candidate.requestKey)
        && (
            !existingStateByRequestKey.has(candidate.requestKey)
            || existingStateByRequestKey.get(candidate.requestKey)?.status !== "failed"
            || canRetryPostHistoryReactionLifecycle(
                existingStateByRequestKey.get(candidate.requestKey)!,
            )
        ),
    );

    if (!request.rxNostr || admittedCandidates.length === 0) {
        await reconcilePendingDeletionRequestsForRequestKeys(
            uniqueRequestKeys(candidates),
        ).catch(() => undefined);

        return {
            source: request.source,
            status: "completed",
            checkedParentEventIds: parentEventIds,
            deletedReactionEventIds: [],
            deletionConfirmationIncomplete: false,
        };
    }

    const admittedRequestKeys = uniqueRequestKeys(admittedCandidates);
    addInFlightPostHistoryReactionLifecycleRequests(admittedRequestKeys);

    try {
        const pendingStateRecords = await saveLifecycleStateTransitions(
            reactionDeletionStateRepository,
            request.source,
            admittedCandidates,
            (candidate) => ({
                status: "pending",
                attemptCount:
                    (existingStateByRequestKey.get(candidate.requestKey)?.attemptCount ?? 0) + 1,
                deletionConfirmed: false,
                consistencyStatus: "pending-allowed",
                verifiedAt: null,
            }),
        );
        await reconcilePendingDeletionRequestsForRequestKeys(admittedRequestKeys)
            .catch(() => undefined);

        const pendingStateByRequestKey = new Map(
            pendingStateRecords.map((record) => [record.requestKey, record]),
        );
        const processingStateRecords = await saveLifecycleStateTransitions(
            reactionDeletionStateRepository,
            request.source,
            admittedCandidates,
            () => ({
                status: "processing",
                consistencyStatus: "processing-allowed",
                verifiedAt: null,
            }),
        );
        await reconcilePendingDeletionRequestsForRequestKeys(admittedRequestKeys)
            .catch(() => undefined);

        const processingStateByRequestKey = new Map(
            [...pendingStateByRequestKey.values(), ...processingStateRecords]
                .map((record) => [record.requestKey, record]),
        );

        const result = await postHistoryReactionDeletionCleanupService.cleanupReactionDeletions(
            request.rxNostr,
            {
                parentEventIds: Array.from(new Set(
                    admittedCandidates.map((candidate) => candidate.parentEventId),
                )),
                reactionEventIds: admittedCandidates.map((candidate) => candidate.reactionEventId),
                relayConfig: request.relayConfig,
                isActive: request.isActive,
            },
        );

        if (result.status === "cancelled") {
            await saveLifecycleStateTransitions(
                reactionDeletionStateRepository,
                request.source,
                admittedCandidates,
                () => ({
                    status: "failed",
                    deletionConfirmed: false,
                    consistencyStatus: "retryable-failed",
                    verifiedAt: Date.now(),
                }),
            );

            return {
                source: request.source,
                ...result,
            };
        }

        const consistencyResult =
            await postHistoryReactionDeletionConsistencyService.verifyConsistency({
                candidates: admittedCandidates,
                statesByRequestKey: processingStateByRequestKey,
                deletionConfirmationIncomplete:
                    result.status !== "completed"
                    || result.deletionConfirmationIncomplete,
                isActive: request.isActive,
            });
        const finalStateRecords = consistencyResult.statePatches.length > 0
            ? await reactionDeletionStateRepository.saveMany(consistencyResult.statePatches)
            : await saveLifecycleStateTransitions(
                reactionDeletionStateRepository,
                request.source,
                admittedCandidates,
                () => ({
                    status: "failed",
                    deletionConfirmed: false,
                    consistencyStatus: "retryable-failed",
                    verifiedAt: Date.now(),
                }),
            );
        const deletedReactionEventIds = Array.from(new Set([
            ...result.deletedReactionEventIds,
            ...consistencyResult.deletedReactionEventIds,
            ...finalStateRecords
                .filter((record) => isReactionDeletionUiGuaranteed(record))
                .map((record) => record.reactionEventId),
        ]));
        const hasFailedState = finalStateRecords.some((record) => record.status === "failed");

        return {
            source: request.source,
            status: hasFailedState ? "partial" : "completed",
            checkedParentEventIds: Array.from(new Set(
                admittedCandidates.map((candidate) => candidate.parentEventId),
            )),
            deletedReactionEventIds,
            deletionConfirmationIncomplete:
                result.deletionConfirmationIncomplete || hasFailedState,
        };
    } catch {
        await saveLifecycleStateTransitions(
            reactionDeletionStateRepository,
            request.source,
            admittedCandidates,
            () => ({
                status: "failed",
                deletionConfirmed: false,
                consistencyStatus: "retryable-failed",
                verifiedAt: Date.now(),
            }),
        ).catch(() => undefined);

        return {
            source: request.source,
            status: "partial",
            checkedParentEventIds: Array.from(new Set(
                admittedCandidates.map((candidate) => candidate.parentEventId),
            )),
            deletedReactionEventIds: [],
            deletionConfirmationIncomplete: true,
        };
    } finally {
        removeInFlightPostHistoryReactionLifecycleRequests(admittedRequestKeys);
        await reconcilePendingDeletionRequestsForRequestKeys([
            ...admittedRequestKeys,
            ...uniqueRequestKeys(skippedCandidates),
        ]).catch(() => undefined);
    }
}