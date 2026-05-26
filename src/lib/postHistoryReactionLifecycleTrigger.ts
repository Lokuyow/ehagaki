import type { RxNostr } from "rx-nostr";
import {
    postHistoryReactionDeletionCleanupService,
    type PostHistoryReactionDeletionCleanupResult,
} from "./postHistoryReactionDeletionCleanupService";
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
    type PostHistoryReactionLifecycleCandidate,
    type PostHistoryReactionLifecycleSource,
} from "./postHistoryReactionLifecycleTypes";
import {
    reconcilePendingDeletionRequestsForRequestKeys,
} from "./postHistoryPendingDeletionRequestsReconcile";
import {
    postHistoryReactionDeletionStateRepository,
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
                kind: 7,
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
    status: "pending" | "processing" | "success" | "failed",
): Promise<void> {
    if (candidates.length === 0) {
        return;
    }

    await reactionDeletionStateRepository.saveMany(
        candidates.map((candidate) => ({
            requestKey: candidate.requestKey,
            parentEventId: candidate.parentEventId,
            reactionEventId: candidate.reactionEventId,
            source,
            status,
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
    const skippedCandidates = candidates.filter((candidate) =>
        hasInFlightPostHistoryReactionLifecycleRequest(candidate.requestKey),
    );
    const admittedCandidates = candidates.filter((candidate) =>
        !hasInFlightPostHistoryReactionLifecycleRequest(candidate.requestKey),
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
        await saveLifecycleStateTransitions(
            reactionDeletionStateRepository,
            request.source,
            admittedCandidates,
            "pending",
        );
        await reconcilePendingDeletionRequestsForRequestKeys(admittedRequestKeys)
            .catch(() => undefined);

        await saveLifecycleStateTransitions(
            reactionDeletionStateRepository,
            request.source,
            admittedCandidates,
            "processing",
        );
        await reconcilePendingDeletionRequestsForRequestKeys(admittedRequestKeys)
            .catch(() => undefined);

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

        await saveLifecycleStateTransitions(
            reactionDeletionStateRepository,
            request.source,
            admittedCandidates,
            result.status === "completed" ? "success" : "failed",
        );

        return {
            source: request.source,
            ...result,
        };
    } catch {
        await saveLifecycleStateTransitions(
            reactionDeletionStateRepository,
            request.source,
            admittedCandidates,
            "failed",
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