import {
    hasInFlightPostHistoryReactionLifecycleRequest,
} from "./postHistoryReactionLifecycleState";
import {
    isActivePostHistoryReactionLifecycleStateStatus,
    parsePostHistoryReactionLifecycleRequestKey,
    type PostHistoryReactionLifecycleStateRecord,
} from "./postHistoryReactionLifecycleTypes";
import {
    postHistoryReactionDeletionStateRepository,
    type PostHistoryReactionDeletionStateRepository,
} from "./storage/postHistoryReactionDeletionStateRepository";
import {
    replacePendingDeletionRequests,
    updatePendingDeletionRequests,
    type PendingDeletionRequestStatus,
} from "../stores/postHistoryDeletionLifecycleStore.svelte";

export interface PostHistoryPendingDeletionRequestsReconcileDeps {
    reactionDeletionStateRepository?: Pick<
        PostHistoryReactionDeletionStateRepository,
        "getMany" | "getForParentEventIds" | "saveMany"
    >;
}

function toStoreEntries(
    records: PostHistoryReactionLifecycleStateRecord[],
): Record<string, PendingDeletionRequestStatus | undefined> {
    return Object.fromEntries(
        records.map((record) => [record.reactionEventId, record.status]),
    );
}

function toMissingEntries(requestKeys: string[]): Record<string, undefined> {
    const entries: Record<string, undefined> = {};
    for (const requestKey of requestKeys) {
        const parsed = parsePostHistoryReactionLifecycleRequestKey(requestKey);
        if (!parsed) {
            continue;
        }

        entries[parsed.reactionEventId] = undefined;
    }

    return entries;
}

async function normalizeStaleActiveStates(
    repository: Pick<PostHistoryReactionDeletionStateRepository, "saveMany">,
    records: PostHistoryReactionLifecycleStateRecord[],
): Promise<PostHistoryReactionLifecycleStateRecord[]> {
    const staleRecords = records.filter((record) =>
        isActivePostHistoryReactionLifecycleStateStatus(record.status)
        && !hasInFlightPostHistoryReactionLifecycleRequest(record.requestKey),
    );
    if (staleRecords.length === 0) {
        return records;
    }

    const normalizedRecords = await repository.saveMany(
        staleRecords.map((record) => ({
            requestKey: record.requestKey,
            parentEventId: record.parentEventId,
            reactionEventId: record.reactionEventId,
            source: record.source,
            status: "failed",
        })),
    );
    const normalizedRecordsByRequestKey = new Map(
        normalizedRecords.map((record) => [record.requestKey, record]),
    );

    return records.map((record) =>
        normalizedRecordsByRequestKey.get(record.requestKey) ?? record,
    );
}

export async function reconcilePendingDeletionRequestsForParentEventIds(
    parentEventIds: string[],
    deps: PostHistoryPendingDeletionRequestsReconcileDeps = {},
): Promise<void> {
    const reactionDeletionStateRepository =
        deps.reactionDeletionStateRepository ?? postHistoryReactionDeletionStateRepository;
    const records = await reactionDeletionStateRepository.getForParentEventIds(parentEventIds);
    const normalizedRecords = await normalizeStaleActiveStates(
        reactionDeletionStateRepository,
        records,
    );
    replacePendingDeletionRequests(toStoreEntries(normalizedRecords));
}

export async function reconcilePendingDeletionRequestsForRequestKeys(
    requestKeys: string[],
    deps: PostHistoryPendingDeletionRequestsReconcileDeps = {},
): Promise<void> {
    const reactionDeletionStateRepository =
        deps.reactionDeletionStateRepository ?? postHistoryReactionDeletionStateRepository;
    const records = await reactionDeletionStateRepository.getMany(requestKeys);
    const normalizedRecords = await normalizeStaleActiveStates(
        reactionDeletionStateRepository,
        records,
    );
    updatePendingDeletionRequests({
        ...toMissingEntries(requestKeys),
        ...toStoreEntries(normalizedRecords),
    });
}