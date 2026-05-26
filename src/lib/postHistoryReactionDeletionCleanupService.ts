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
    postHistoryReactionRecordsAdapter,
    type PostHistoryReactionRecordsAdapter,
} from "./postHistoryReplyEventsAdapter";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionsRepository,
} from "./storage/postHistoryReplyEventsRepository";
import type { PostHistoryReplyEventRecord } from "./storage/ehagakiDb";
import type { NostrEvent, RelayConfig } from "./types";

interface ReactionCleanupItem {
    parentEventId: string;
    record: PostHistoryReplyEventRecord;
    targetEvent: NostrEvent;
}

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

const EMPTY_RESULT: PostHistoryReactionDeletionCleanupResult = {
    status: "completed",
    checkedParentEventIds: [],
    deletedReactionEventIds: [],
    deletionConfirmationIncomplete: false,
};

function uniqueEventIds(eventIds: string[]): string[] {
    return Array.from(new Set(eventIds.filter((eventId) => !!eventId)));
}

function toTargetEvent(record: PostHistoryReplyEventRecord): NostrEvent {
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

function toDeletedReactionEventIds(
    items: ReactionCleanupItem[],
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

function toParentEventIds(items: ReactionCleanupItem[]): string[] {
    return uniqueEventIds(items.map((item) => item.parentEventId));
}

export class PostHistoryReactionDeletionCleanupService {
    private reactionRecordsAdapter: Pick<PostHistoryReactionRecordsAdapter, "getReactionRecords">;
    private deletionFetchService: Pick<PostHistoryDeletionFetchService, "fetchDeletionRequests">;
    private deletionRequestsRepository: Pick<
        PostHistoryDeletionRequestsRepository,
        "getDeletedTargets" | "upsertValidDeletionRequests"
    >;
    private childInteractionsRepository: Pick<
        PostHistoryChildInteractionsRepository,
        "deleteChildInteractionByEventId"
    >;

    constructor(deps: PostHistoryReactionDeletionCleanupServiceDeps = {}) {
        this.reactionRecordsAdapter = deps.reactionRecordsAdapter ?? postHistoryReactionRecordsAdapter;
        this.deletionFetchService = deps.deletionFetchService ?? postHistoryDeletionFetchService;
        this.deletionRequestsRepository =
            deps.deletionRequestsRepository ?? postHistoryDeletionRequestsRepository;
        this.childInteractionsRepository =
            deps.childInteractionsRepository ?? postHistoryChildInteractionsRepository;
    }

    async cleanupReactionDeletions(
        rxNostr: RxNostr,
        params: PostHistoryReactionDeletionCleanupRequest,
    ): Promise<PostHistoryReactionDeletionCleanupResult> {
        const isActive = () => params.isActive?.() !== false;
        const checkedParentEventIds = uniqueEventIds(params.parentEventIds);
        const checkedReactionEventIds = uniqueEventIds(params.reactionEventIds ?? []);
        if (checkedParentEventIds.length === 0) {
            return EMPTY_RESULT;
        }

        const allItems = await this.loadReactionItems(
            checkedParentEventIds,
            checkedReactionEventIds,
        );
        if (!isActive()) {
            return {
                ...EMPTY_RESULT,
                status: "cancelled",
                checkedParentEventIds,
            };
        }

        const knownDeleted = await this.filterKnownDeletedReactions(allItems);
        if (!isActive()) {
            return {
                status: "cancelled",
                checkedParentEventIds,
                deletedReactionEventIds: knownDeleted.deletedReactionEventIds,
                deletionConfirmationIncomplete: false,
            };
        }

        if (knownDeleted.visibleItems.length === 0) {
            return {
                status: "completed",
                checkedParentEventIds,
                deletedReactionEventIds: knownDeleted.deletedReactionEventIds,
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
                deletedReactionEventIds: knownDeleted.deletedReactionEventIds,
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
                deletedReactionEventIds: knownDeleted.deletedReactionEventIds,
                deletionConfirmationIncomplete: fetchResult.status !== "success",
            };
        }

        const confirmedDeleted = await this.filterKnownDeletedReactions(knownDeleted.visibleItems);
        const deletedReactionEventIds = uniqueEventIds([
            ...knownDeleted.deletedReactionEventIds,
            ...confirmedDeleted.deletedReactionEventIds,
        ]);
        const deletionConfirmationIncomplete = fetchResult.status !== "success";

        return {
            status: deletionConfirmationIncomplete ? "partial" : "completed",
            checkedParentEventIds,
            deletedReactionEventIds,
            deletionConfirmationIncomplete,
        };
    }

    private async loadReactionItems(
        parentEventIds: string[],
        reactionEventIds: string[],
    ): Promise<ReactionCleanupItem[]> {
        const items: ReactionCleanupItem[] = [];
        const allowedReactionEventIdSet = reactionEventIds.length > 0
            ? new Set(reactionEventIds)
            : null;

        for (const parentEventId of parentEventIds) {
            const records = await this.reactionRecordsAdapter.getReactionRecords(parentEventId);
            for (const record of records) {
                if (
                    allowedReactionEventIdSet
                    && !allowedReactionEventIdSet.has(record.eventId)
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

    private async filterKnownDeletedReactions(
        items: ReactionCleanupItem[],
    ): Promise<{
        visibleItems: ReactionCleanupItem[];
        deletedReactionEventIds: string[];
    }> {
        if (items.length === 0) {
            return {
                visibleItems: [],
                deletedReactionEventIds: [],
            };
        }

        const deletedTargets = await this.deletionRequestsRepository.getDeletedTargets(
            items.map((item) => ({
                targetAuthorPubkey: item.targetEvent.pubkey,
                targetEventId: item.targetEvent.id,
            })),
        );
        const deletedReactionEventIds = toDeletedReactionEventIds(items, deletedTargets);
        await this.purgeDeletedReactionCache(deletedReactionEventIds);
        const deletedEventIdSet = new Set(deletedReactionEventIds);

        return {
            visibleItems: items.filter((item) => !deletedEventIdSet.has(item.record.eventId)),
            deletedReactionEventIds,
        };
    }

    private async purgeDeletedReactionCache(eventIds: string[]): Promise<void> {
        for (const eventId of uniqueEventIds(eventIds)) {
            await this.childInteractionsRepository.deleteChildInteractionByEventId(eventId);
        }
    }
}

export const postHistoryReactionDeletionCleanupService =
    new PostHistoryReactionDeletionCleanupService();