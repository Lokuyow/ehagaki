import type { RxNostr } from "rx-nostr";
import type { PostHistoryDeletionFetchService } from "./postHistoryDeletionFetchService";
import type { PostHistoryDeletionRequestsRepository } from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryReactionRecordsAdapter,
    type PostHistoryReactionRecordsAdapter,
} from "./postHistoryChildInteractionsAdapter";
import type { PostHistoryChildInteractionsRepository } from "./storage/postHistoryChildInteractionsRepository";
import {
    RelationDeletionCleanup,
    type RelationDeletionCleanupResult,
} from "./postHistoryRelationDeletionLifecycle";
import type { RelayConfig } from "./types";

export interface PostHistoryReactionDeletionCleanupRequest {
    parentEventIds: string[];
    reactionEventIds?: string[];
    relayConfig?: RelayConfig | null;
    isActive?: () => boolean;
}

export interface PostHistoryReactionDeletionCleanupResult {
    status: "completed" | "partial" | "cancelled";
    checkedParentEventIds: string[];
    deletedReactionEventIds: string[];
    deletionConfirmationIncomplete: boolean;
}

// Route A contract: production callers must enter reaction cleanup through
// triggerPostHistoryReactionLifecycle so dedupe and retry gating stay centralized.
export interface PostHistoryReactionDeletionCleanupServiceDeps {
    reactionRecordsAdapter?: Pick<PostHistoryReactionRecordsAdapter, "getReactionRecords">;
    deletionFetchService?: Pick<PostHistoryDeletionFetchService, "fetchDeletionRequests">;
    deletionRequestsRepository?: Pick<
        PostHistoryDeletionRequestsRepository,
        "getDeletedTargets" | "upsertValidDeletionRequests"
    >;
    childInteractionsRepository?: Pick<
        PostHistoryChildInteractionsRepository,
        "deleteChildInteractionByEventId"
    >;
}

export function toReactionDeletionCleanupResult(
    result: RelationDeletionCleanupResult,
): PostHistoryReactionDeletionCleanupResult {
    const { deletedEventIds, ...rest } = result;
    return { ...rest, deletedReactionEventIds: deletedEventIds };
}

export class PostHistoryReactionDeletionCleanupService {
    private cleanup: RelationDeletionCleanup;

    constructor(deps: PostHistoryReactionDeletionCleanupServiceDeps = {}) {
        const recordsAdapter = deps.reactionRecordsAdapter ?? postHistoryReactionRecordsAdapter;
        this.cleanup = new RelationDeletionCleanup({
            getRecords: (parentEventId) => recordsAdapter.getReactionRecords(parentEventId),
            deletionFetchService: deps.deletionFetchService,
            deletionRequestsRepository: deps.deletionRequestsRepository,
            childInteractionsRepository: deps.childInteractionsRepository,
        });
    }

    async cleanupReactionDeletions(
        rxNostr: RxNostr,
        params: PostHistoryReactionDeletionCleanupRequest,
    ): Promise<PostHistoryReactionDeletionCleanupResult> {
        return toReactionDeletionCleanupResult(await this.cleanup.cleanup(rxNostr, {
            parentEventIds: params.parentEventIds,
            targetEventIds: params.reactionEventIds,
            relayConfig: params.relayConfig,
            isActive: params.isActive,
        }));
    }
}

export const postHistoryReactionDeletionCleanupService =
    new PostHistoryReactionDeletionCleanupService();
