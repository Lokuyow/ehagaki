import {
    parsePostHistoryReactionLifecycleRequestKey,
    type PostHistoryReactionLifecycleCandidate,
    type PostHistoryReactionLifecycleStateRecord,
} from "./postHistoryReactionLifecycleTypes";
import {
    postHistoryReactionDeletionConsistencyService,
    type PostHistoryReactionDeletionConsistencyService,
} from "./postHistoryReactionDeletionConsistencyService";
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
        "getMany" | "getForParentEventIds" | "saveMany" | "deleteMany"
    >;
    reactionDeletionConsistencyService?: Pick<
        PostHistoryReactionDeletionConsistencyService,
        "verifyConsistency"
    >;
}

function toStoreEntries(
    records: PostHistoryReactionLifecycleStateRecord[],
): Record<string, PendingDeletionRequestStatus | undefined> {
    return Object.fromEntries(
        records.map((record) => [
            record.reactionEventId,
            record.status === "success" ? undefined : record.status,
        ]),
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
    repository: Pick<
        PostHistoryReactionDeletionStateRepository,
        "saveMany" | "deleteMany"
    >,
    consistencyService: Pick<
        PostHistoryReactionDeletionConsistencyService,
        "verifyConsistency"
    >,
    records: PostHistoryReactionLifecycleStateRecord[],
): Promise<PostHistoryReactionLifecycleStateRecord[]> {
    if (records.length === 0) {
        return records;
    }

    const verificationResult = await consistencyService.verifyConsistency({
        candidates: records.map((record) => ({
            requestKey: record.requestKey,
            parentEventId: record.parentEventId,
            reactionEventId: record.reactionEventId,
            reactionAuthorPubkey: record.reactionAuthorPubkey,
            kind: record.kind,
        })),
        statesByRequestKey: new Map(
            records.map((record) => [record.requestKey, record]),
        ),
    });
    const resolvedRequestKeys = verificationResult.resolvedRequestKeys ?? [];
    if (verificationResult.statePatches.length === 0) {
        if (resolvedRequestKeys.length === 0) {
            return records;
        }

        await repository.deleteMany(resolvedRequestKeys);
        const resolvedRequestKeySet = new Set(resolvedRequestKeys);
        return records.filter((record) => !resolvedRequestKeySet.has(record.requestKey));
    }

    const normalizedRecords = await repository.saveMany(verificationResult.statePatches);
    if (resolvedRequestKeys.length > 0) {
        await repository.deleteMany(resolvedRequestKeys);
    }
    const normalizedRecordsByRequestKey = new Map(
        normalizedRecords.map((record) => [record.requestKey, record]),
    );
    const resolvedRequestKeySet = new Set(resolvedRequestKeys);

    return records.flatMap((record) => {
        if (resolvedRequestKeySet.has(record.requestKey)) {
            return [];
        }

        return [normalizedRecordsByRequestKey.get(record.requestKey) ?? record];
    });
}

export async function reconcilePendingDeletionRequestsForParentEventIds(
    parentEventIds: string[],
    deps: PostHistoryPendingDeletionRequestsReconcileDeps = {},
): Promise<void> {
    const reactionDeletionStateRepository =
        deps.reactionDeletionStateRepository ?? postHistoryReactionDeletionStateRepository;
    const reactionDeletionConsistencyService =
        deps.reactionDeletionConsistencyService
        ?? postHistoryReactionDeletionConsistencyService;
    const records = await reactionDeletionStateRepository.getForParentEventIds(parentEventIds);
    const normalizedRecords = await normalizeStaleActiveStates(
        reactionDeletionStateRepository,
        reactionDeletionConsistencyService,
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
    const reactionDeletionConsistencyService =
        deps.reactionDeletionConsistencyService
        ?? postHistoryReactionDeletionConsistencyService;
    const records = await reactionDeletionStateRepository.getMany(requestKeys);
    const normalizedRecords = await normalizeStaleActiveStates(
        reactionDeletionStateRepository,
        reactionDeletionConsistencyService,
        records,
    );
    updatePendingDeletionRequests({
        ...toMissingEntries(requestKeys),
        ...toStoreEntries(normalizedRecords),
    });
}