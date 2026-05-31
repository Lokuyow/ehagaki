import type { RxNostr } from "rx-nostr";
import {
    postHistoryDeletionFetchService,
    type PostHistoryDeletionFetchService,
} from "./postHistoryDeletionFetchService";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryDirectReplyRecordsAdapter,
    type PostHistoryDirectReplyRecordsAdapter,
} from "./postHistoryChildInteractionsAdapter";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionsRepository,
} from "./storage/postHistoryChildInteractionsRepository";
import type { PostHistoryChildInteractionRecord } from "./storage/ehagakiDb";
import type { NostrEvent, RelayConfig } from "./types";

interface DirectReplyCleanupItem {
    parentEventId: string;
    record: PostHistoryChildInteractionRecord;
    targetEvent: NostrEvent;
}

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

const EMPTY_RESULT: PostHistoryDirectReplyDeletionCleanupResult = {
    status: "completed",
    checkedParentEventIds: [],
    deletedReplyEventIds: [],
    deletionConfirmationIncomplete: false,
};

function uniqueEventIds(eventIds: string[]): string[] {
    return Array.from(new Set(eventIds.filter((eventId) => !!eventId)));
}

function toTargetEvent(record: PostHistoryChildInteractionRecord): NostrEvent {
    return {
        id: record.eventId,
        pubkey: record.authorPubkey,
        created_at: record.createdAt,
        kind: record.kind,
        tags: record.tags.map((tag) => [...tag]),
        content: record.content,
        sig: "",
    };
}

function toDeletedReplyEventIds(
    items: DirectReplyCleanupItem[],
    deletedTargets: Map<string, Set<string>>,
): string[] {
    return uniqueEventIds(
        items
            .filter((item) =>
                deletedTargets.get(item.targetEvent.pubkey)?.has(item.targetEvent.id),
            )
            .map((item) => item.record.eventId),
    );
}

export class PostHistoryDirectReplyDeletionCleanupService {
    private directReplyRecordsAdapter: Pick<PostHistoryDirectReplyRecordsAdapter, "getDirectReplyRecords">;
    private deletionFetchService: Pick<PostHistoryDeletionFetchService, "fetchDeletionRequests">;
    private deletionRequestsRepository: Pick<
        PostHistoryDeletionRequestsRepository,
        "getDeletedTargets" | "upsertValidDeletionRequests"
    >;
    private childInteractionsRepository: Pick<
        PostHistoryChildInteractionsRepository,
        "deleteChildInteractionByEventId"
    >;

    constructor(deps: PostHistoryDirectReplyDeletionCleanupServiceDeps = {}) {
        this.directReplyRecordsAdapter =
            deps.directReplyRecordsAdapter ?? postHistoryDirectReplyRecordsAdapter;
        this.deletionFetchService = deps.deletionFetchService ?? postHistoryDeletionFetchService;
        this.deletionRequestsRepository =
            deps.deletionRequestsRepository ?? postHistoryDeletionRequestsRepository;
        this.childInteractionsRepository =
            deps.childInteractionsRepository ?? postHistoryChildInteractionsRepository;
    }

    async cleanupDirectReplyDeletions(
        rxNostr: RxNostr,
        params: PostHistoryDirectReplyDeletionCleanupRequest,
    ): Promise<PostHistoryDirectReplyDeletionCleanupResult> {
        const isActive = () => params.isActive?.() !== false;
        const checkedParentEventIds = uniqueEventIds(params.parentEventIds);
        const checkedReplyEventIds = uniqueEventIds(params.replyEventIds ?? []);
        if (checkedParentEventIds.length === 0) {
            return EMPTY_RESULT;
        }

        const allItems = await this.loadDirectReplyItems(
            checkedParentEventIds,
            checkedReplyEventIds,
        );
        if (!isActive()) {
            return {
                ...EMPTY_RESULT,
                status: "cancelled",
                checkedParentEventIds,
            };
        }

        const knownDeleted = await this.filterKnownDeletedReplies(allItems);
        if (!isActive()) {
            return {
                status: "cancelled",
                checkedParentEventIds,
                deletedReplyEventIds: knownDeleted.deletedReplyEventIds,
                deletionConfirmationIncomplete: false,
            };
        }

        if (knownDeleted.visibleItems.length === 0) {
            return {
                status: "completed",
                checkedParentEventIds,
                deletedReplyEventIds: knownDeleted.deletedReplyEventIds,
                deletionConfirmationIncomplete: false,
            };
        }

        const fetchTask = this.deletionFetchService.fetchDeletionRequests(rxNostr, {
            targets: knownDeleted.visibleItems.map((item) => ({
                event: item.targetEvent,
                relayUrls: item.record.relayUrls,
            })),
            relayConfig: params.relayConfig,
        });
        const fetchResult = await fetchTask.promise;
        if (!isActive() || fetchResult.status === "cancelled") {
            return {
                status: "cancelled",
                checkedParentEventIds,
                deletedReplyEventIds: knownDeleted.deletedReplyEventIds,
                deletionConfirmationIncomplete: fetchResult.status !== "success",
            };
        }

        if (fetchResult.events.length > 0) {
            await this.deletionRequestsRepository.upsertValidDeletionRequests({
                targetEvents: knownDeleted.visibleItems.map((item) => item.targetEvent),
                deletionEvents: fetchResult.events,
                fetchedAt: fetchResult.fetchedAt,
            });
        }

        if (!isActive()) {
            return {
                status: "cancelled",
                checkedParentEventIds,
                deletedReplyEventIds: knownDeleted.deletedReplyEventIds,
                deletionConfirmationIncomplete: fetchResult.status !== "success",
            };
        }

        const confirmedDeleted = await this.filterKnownDeletedReplies(knownDeleted.visibleItems);
        const deletedReplyEventIds = uniqueEventIds([
            ...knownDeleted.deletedReplyEventIds,
            ...confirmedDeleted.deletedReplyEventIds,
        ]);
        const deletionConfirmationIncomplete = fetchResult.status !== "success";

        return {
            status: deletionConfirmationIncomplete ? "partial" : "completed",
            checkedParentEventIds,
            deletedReplyEventIds,
            deletionConfirmationIncomplete,
        };
    }

    private async loadDirectReplyItems(
        parentEventIds: string[],
        replyEventIds: string[],
    ): Promise<DirectReplyCleanupItem[]> {
        const items: DirectReplyCleanupItem[] = [];
        const allowedReplyEventIdSet = replyEventIds.length > 0
            ? new Set(replyEventIds)
            : null;

        for (const parentEventId of parentEventIds) {
            const records = await this.directReplyRecordsAdapter.getDirectReplyRecords(parentEventId);
            for (const record of records) {
                if (
                    allowedReplyEventIdSet
                    && !allowedReplyEventIdSet.has(record.eventId)
                ) {
                    continue;
                }

                items.push({
                    parentEventId,
                    record,
                    targetEvent: toTargetEvent(record),
                });
            }
        }

        return items;
    }

    private async filterKnownDeletedReplies(
        items: DirectReplyCleanupItem[],
    ): Promise<{
        visibleItems: DirectReplyCleanupItem[];
        deletedReplyEventIds: string[];
    }> {
        if (items.length === 0) {
            return {
                visibleItems: [],
                deletedReplyEventIds: [],
            };
        }

        const deletedTargets = await this.deletionRequestsRepository.getDeletedTargets(
            items.map((item) => ({
                targetAuthorPubkey: item.targetEvent.pubkey,
                targetEventId: item.targetEvent.id,
            })),
        );
        const deletedReplyEventIds = toDeletedReplyEventIds(items, deletedTargets);
        await this.purgeDeletedReplyCache(deletedReplyEventIds);
        const deletedEventIdSet = new Set(deletedReplyEventIds);

        return {
            visibleItems: items.filter((item) => !deletedEventIdSet.has(item.record.eventId)),
            deletedReplyEventIds,
        };
    }

    private async purgeDeletedReplyCache(eventIds: string[]): Promise<void> {
        for (const eventId of uniqueEventIds(eventIds)) {
            await this.childInteractionsRepository.deleteChildInteractionByEventId(eventId);
        }
    }
}

export const postHistoryDirectReplyDeletionCleanupService =
    new PostHistoryDirectReplyDeletionCleanupService();
