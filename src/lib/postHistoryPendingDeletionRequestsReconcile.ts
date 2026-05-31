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
import {
    normalizeRelationLifecycleRecords,
} from "./postHistoryRelationLifecycleHelpers";
import {
    parsePostHistoryDirectReplyLifecycleRequestKey,
    type PostHistoryDirectReplyLifecycleCandidate,
    type PostHistoryDirectReplyLifecycleStateRecord,
} from "./postHistoryDirectReplyLifecycleTypes";
import {
    postHistoryDirectReplyDeletionConsistencyService,
    type PostHistoryDirectReplyDeletionConsistencyService,
} from "./postHistoryDirectReplyDeletionConsistencyService";
import {
    postHistoryDirectReplyDeletionStateRepository,
    type PostHistoryDirectReplyDeletionStateRepository,
} from "./storage/postHistoryDirectReplyDeletionStateRepository";

export interface PostHistoryPendingDeletionRequestsReconcileDeps {
    reactionDeletionStateRepository?: Pick<
        PostHistoryReactionDeletionStateRepository,
        "getMany" | "getForParentEventIds" | "saveMany" | "deleteMany"
    >;
    reactionDeletionConsistencyService?: Pick<
        PostHistoryReactionDeletionConsistencyService,
        "verifyConsistency"
    >;
    directReplyDeletionStateRepository?: Pick<
        PostHistoryDirectReplyDeletionStateRepository,
        "getMany" | "getForParentEventIds" | "saveMany" | "deleteMany"
    >;
    directReplyDeletionConsistencyService?: Pick<
        PostHistoryDirectReplyDeletionConsistencyService,
        "verifyConsistency"
    >;
}

function toReactionStoreEntries(
    records: PostHistoryReactionLifecycleStateRecord[],
): Record<string, PendingDeletionRequestStatus | undefined> {
    return Object.fromEntries(
        records.map((record) => [
            record.reactionEventId,
            record.status === "success" ? undefined : record.status,
        ]),
    );
}

function toReactionMissingEntries(requestKeys: string[]): Record<string, undefined> {
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

function toReplyStoreEntries(
    records: PostHistoryDirectReplyLifecycleStateRecord[],
): Record<string, PendingDeletionRequestStatus | undefined> {
    return Object.fromEntries(
        records.map((record) => [
            record.replyEventId,
            record.status === "success" ? undefined : record.status,
        ]),
    );
}

function toReplyMissingEntries(requestKeys: string[]): Record<string, undefined> {
    const entries: Record<string, undefined> = {};
    for (const requestKey of requestKeys) {
        const parsed = parsePostHistoryDirectReplyLifecycleRequestKey(requestKey);
        if (!parsed) {
            continue;
        }

        entries[parsed.replyEventId] = undefined;
    }

    return entries;
}

async function normalizeStaleReactionActiveStates(
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
    return normalizeRelationLifecycleRecords({
        records,
        toCandidate: (record) => ({
            requestKey: record.requestKey,
            parentEventId: record.parentEventId,
            reactionEventId: record.reactionEventId,
            reactionAuthorPubkey: record.reactionAuthorPubkey,
            kind: record.kind,
        }),
        verifyConsistency: (params) => consistencyService.verifyConsistency(params),
        saveMany: (patches) => repository.saveMany(patches),
        deleteMany: (requestKeys) => repository.deleteMany(requestKeys),
    });
}

async function normalizeStaleReplyActiveStates(
    repository: Pick<
        PostHistoryDirectReplyDeletionStateRepository,
        "saveMany" | "deleteMany"
    >,
    consistencyService: Pick<
        PostHistoryDirectReplyDeletionConsistencyService,
        "verifyConsistency"
    >,
    records: PostHistoryDirectReplyLifecycleStateRecord[],
): Promise<PostHistoryDirectReplyLifecycleStateRecord[]> {
    return normalizeRelationLifecycleRecords({
        records,
        toCandidate: (record): PostHistoryDirectReplyLifecycleCandidate => ({
            requestKey: record.requestKey,
            parentEventId: record.parentEventId,
            replyEventId: record.replyEventId,
            replyAuthorPubkey: record.replyAuthorPubkey,
            kind: record.kind,
        }),
        verifyConsistency: (params) => consistencyService.verifyConsistency(params),
        saveMany: (patches) => repository.saveMany(patches),
        deleteMany: (requestKeys) => repository.deleteMany(requestKeys),
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
    const normalizedReactionRecords = await normalizeStaleReactionActiveStates(
        reactionDeletionStateRepository,
        reactionDeletionConsistencyService,
        records,
    );

    const directReplyDeletionStateRepositoryInstance =
        deps.directReplyDeletionStateRepository ?? postHistoryDirectReplyDeletionStateRepository;
    const directReplyDeletionConsistencyServiceInstance =
        deps.directReplyDeletionConsistencyService ?? postHistoryDirectReplyDeletionConsistencyService;
    const replyRecords = await directReplyDeletionStateRepositoryInstance.getForParentEventIds(parentEventIds);
    const normalizedReplyRecords = await normalizeStaleReplyActiveStates(
        directReplyDeletionStateRepositoryInstance,
        directReplyDeletionConsistencyServiceInstance,
        replyRecords,
    );

    replacePendingDeletionRequests({
        ...toReactionStoreEntries(normalizedReactionRecords),
        ...toReplyStoreEntries(normalizedReplyRecords),
    });
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
    const normalizedReactionRecords = await normalizeStaleReactionActiveStates(
        reactionDeletionStateRepository,
        reactionDeletionConsistencyService,
        records,
    );

    const directReplyDeletionStateRepositoryInstance =
        deps.directReplyDeletionStateRepository ?? postHistoryDirectReplyDeletionStateRepository;
    const directReplyDeletionConsistencyServiceInstance =
        deps.directReplyDeletionConsistencyService ?? postHistoryDirectReplyDeletionConsistencyService;
    const replyRecords = await directReplyDeletionStateRepositoryInstance.getMany(requestKeys);
    const normalizedReplyRecords = await normalizeStaleReplyActiveStates(
        directReplyDeletionStateRepositoryInstance,
        directReplyDeletionConsistencyServiceInstance,
        replyRecords,
    );

    updatePendingDeletionRequests({
        ...toReactionMissingEntries(requestKeys),
        ...toReactionStoreEntries(normalizedReactionRecords),
        ...toReplyMissingEntries(requestKeys),
        ...toReplyStoreEntries(normalizedReplyRecords),
    });
}