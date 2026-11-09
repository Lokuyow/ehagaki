import type { RxNostr } from "rx-nostr";
import type { PostHistoryDeletionFetchService } from "./postHistoryDeletionFetchService";
import type { PostHistoryDeletionRequestsRepository } from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryDirectReplyRecordsAdapter,
    type PostHistoryDirectReplyRecordsAdapter,
} from "./postHistoryChildInteractionsAdapter";
import type { PostHistoryChildInteractionsRepository } from "./storage/postHistoryChildInteractionsRepository";
import {
    RelationDeletionCleanup,
    type RelationDeletionCleanupResult,
} from "./postHistoryRelationDeletionLifecycle";
import type { RelayConfig } from "./types";

export interface PostHistoryDirectReplyDeletionCleanupRequest {
    parentEventIds: string[];
    replyEventIds?: string[];
    relayConfig?: RelayConfig | null;
    isActive?: () => boolean;
}

export interface PostHistoryDirectReplyDeletionCleanupResult {
    status: "completed" | "partial" | "cancelled";
    checkedParentEventIds: string[];
    deletedReplyEventIds: string[];
    deletionConfirmationIncomplete: boolean;
}

// Route A contract: production callers must enter direct reply cleanup through
// triggerPostHistoryDirectReplyLifecycle so dedupe and retry gating stay centralized.
export interface PostHistoryDirectReplyDeletionCleanupServiceDeps {
    directReplyRecordsAdapter?: Pick<PostHistoryDirectReplyRecordsAdapter, "getDirectReplyRecords">;
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

export function toDirectReplyDeletionCleanupResult(
    result: RelationDeletionCleanupResult,
): PostHistoryDirectReplyDeletionCleanupResult {
    const { deletedEventIds, ...rest } = result;
    return { ...rest, deletedReplyEventIds: deletedEventIds };
}

export class PostHistoryDirectReplyDeletionCleanupService {
    private cleanup: RelationDeletionCleanup;

    constructor(deps: PostHistoryDirectReplyDeletionCleanupServiceDeps = {}) {
        const recordsAdapter = deps.directReplyRecordsAdapter ?? postHistoryDirectReplyRecordsAdapter;
        this.cleanup = new RelationDeletionCleanup({
            getRecords: (parentEventId) => recordsAdapter.getDirectReplyRecords(parentEventId),
            deletionFetchService: deps.deletionFetchService,
            deletionRequestsRepository: deps.deletionRequestsRepository,
            childInteractionsRepository: deps.childInteractionsRepository,
        });
    }

    async cleanupDirectReplyDeletions(
        rxNostr: RxNostr,
        params: PostHistoryDirectReplyDeletionCleanupRequest,
    ): Promise<PostHistoryDirectReplyDeletionCleanupResult> {
        return toDirectReplyDeletionCleanupResult(await this.cleanup.cleanup(rxNostr, {
            parentEventIds: params.parentEventIds,
            targetEventIds: params.replyEventIds,
            relayConfig: params.relayConfig,
            isActive: params.isActive,
        }));
    }
}

export const postHistoryDirectReplyDeletionCleanupService =
    new PostHistoryDirectReplyDeletionCleanupService();
