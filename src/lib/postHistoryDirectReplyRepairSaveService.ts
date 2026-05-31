import type { RxNostr } from "rx-nostr";
import {
    postHistoryDeletionFetchService,
    type PostHistoryDeletionFetchTask,
    type PostHistoryDeletionFetchService,
} from "./postHistoryDeletionFetchService";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionItem,
    type PostHistoryChildInteractionsRepository,
} from "./storage/postHistoryChildInteractionsRepository";
import type {
    PostHistoryDeletionAwareSaveRequest,
    PostHistoryDeletionAwareSaveResult,
    PostHistoryDeletionAwareSaveTask,
} from "./postHistoryDeletionAwareSaveTypes";

export interface PostHistoryDirectReplyRepairItem extends PostHistoryChildInteractionItem {
    parentEventId: string;
}

export interface PostHistoryDirectReplyRepairSaveRequest
    extends PostHistoryDeletionAwareSaveRequest<PostHistoryDirectReplyRepairItem> {}

export interface PostHistoryDirectReplyRepairSaveResult
    extends PostHistoryDeletionAwareSaveResult {
    savedParentEventIds: string[];
    savedDirectReplyCount: number;
}

export type PostHistoryDirectReplyRepairSaveTask =
    PostHistoryDeletionAwareSaveTask<PostHistoryDirectReplyRepairSaveResult>;

export interface PostHistoryDirectReplyRepairSaveServiceDeps {
    deletionFetchService?: Pick<PostHistoryDeletionFetchService, "fetchDeletionRequests">;
    deletionRequestsRepository?: Pick<
        PostHistoryDeletionRequestsRepository,
        "getDeletedTargets" | "upsertValidDeletionRequests"
    >;
    childInteractionsRepository?: Pick<
        PostHistoryChildInteractionsRepository,
        "upsertChildInteractions" | "deleteChildInteractionByEventId"
    >;
    now?: () => number;
}

type KnownDeletionFilterResult = {
    visibleItems: PostHistoryDirectReplyRepairItem[];
    deletedEventIds: string[];
};

const EMPTY_RESULT: PostHistoryDirectReplyRepairSaveResult = {
    status: "saved",
    savedParentEventIds: [],
    savedDirectReplyCount: 0,
    deletedEventIds: [],
    deletionConfirmationIncomplete: false,
};

function compactItems(items: PostHistoryDirectReplyRepairItem[]): PostHistoryDirectReplyRepairItem[] {
    const itemsByEventId = new Map<string, PostHistoryDirectReplyRepairItem>();

    for (const item of items) {
        if (!item.parentEventId || !item.event?.id || !item.event.pubkey || item.event.kind !== 1) {
            continue;
        }

        const existing = itemsByEventId.get(item.event.id);
        itemsByEventId.set(item.event.id, {
            parentEventId: item.parentEventId,
            event: item.event,
            relayUrls: Array.from(new Set([
                ...(existing?.relayUrls ?? []),
                ...(item.relayUrls ?? []),
            ])),
        });
    }

    return Array.from(itemsByEventId.values());
}

function toDeletedEventIds(
    items: PostHistoryDirectReplyRepairItem[],
    deletedTargets: Map<string, Set<string>>,
): string[] {
    return items
        .filter((item) => deletedTargets.get(item.event.pubkey)?.has(item.event.id))
        .map((item) => item.event.id);
}

function toCancelledResult(
    result: PostHistoryDirectReplyRepairSaveResult,
): PostHistoryDirectReplyRepairSaveResult {
    return {
        ...result,
        status: "cancelled",
        savedParentEventIds: [],
        savedDirectReplyCount: 0,
    };
}

export class PostHistoryDirectReplyRepairSaveService {
    private deletionFetchService: Pick<PostHistoryDeletionFetchService, "fetchDeletionRequests">;
    private deletionRequestsRepository: Pick<
        PostHistoryDeletionRequestsRepository,
        "getDeletedTargets" | "upsertValidDeletionRequests"
    >;
    private childInteractionsRepository: Pick<
        PostHistoryChildInteractionsRepository,
        "upsertChildInteractions" | "deleteChildInteractionByEventId"
    >;
    private now: () => number;

    constructor(deps: PostHistoryDirectReplyRepairSaveServiceDeps = {}) {
        this.deletionFetchService = deps.deletionFetchService ?? postHistoryDeletionFetchService;
        this.deletionRequestsRepository =
            deps.deletionRequestsRepository ?? postHistoryDeletionRequestsRepository;
        this.childInteractionsRepository =
            deps.childInteractionsRepository ?? postHistoryChildInteractionsRepository;
        this.now = deps.now ?? Date.now;
    }

    saveRepairDirectReplies(
        rxNostr: RxNostr,
        params: PostHistoryDirectReplyRepairSaveRequest,
    ): PostHistoryDirectReplyRepairSaveTask {
        let active = true;
        let deletionTask: PostHistoryDeletionFetchTask | null = null;
        const isActive = () => active && params.isActive?.() !== false;

        const promise = (async (): Promise<PostHistoryDirectReplyRepairSaveResult> => {
            const candidates = compactItems(params.items);
            if (candidates.length === 0) {
                return EMPTY_RESULT;
            }

            const knownFilter = await this.filterKnownDeletedDirectReplies(candidates);
            let deletedEventIds = knownFilter.deletedEventIds;
            if (!isActive()) {
                return toCancelledResult({
                    ...EMPTY_RESULT,
                    deletedEventIds,
                });
            }

            let visibleItems = knownFilter.visibleItems;
            let deletionConfirmationIncomplete = false;
            if (visibleItems.length > 0) {
                deletionTask = this.deletionFetchService.fetchDeletionRequests(rxNostr, {
                    targets: visibleItems.map((item) => ({
                        event: item.event,
                        relayUrls: item.relayUrls,
                    })),
                    relayHints: params.relayHints,
                    relayConfig: params.relayConfig,
                });
                const deletionResult = await deletionTask.promise;
                deletionTask = null;
                if (!isActive() || deletionResult.status === "cancelled") {
                    return toCancelledResult({
                        ...EMPTY_RESULT,
                        deletedEventIds,
                        deletionConfirmationIncomplete:
                            deletionConfirmationIncomplete || deletionResult.status !== "success",
                    });
                }

                deletionConfirmationIncomplete = deletionResult.status !== "success";
                if (deletionResult.events.length > 0) {
                    await this.deletionRequestsRepository.upsertValidDeletionRequests({
                        targetEvents: visibleItems.map((item) => item.event),
                        deletionEvents: deletionResult.events,
                        fetchedAt: deletionResult.fetchedAt,
                    });
                }
                if (!isActive()) {
                    return toCancelledResult({
                        ...EMPTY_RESULT,
                        deletedEventIds,
                        deletionConfirmationIncomplete,
                    });
                }

                const confirmedFilter = await this.filterKnownDeletedDirectReplies(visibleItems);
                visibleItems = confirmedFilter.visibleItems;
                deletedEventIds = Array.from(new Set([
                    ...deletedEventIds,
                    ...confirmedFilter.deletedEventIds,
                ]));
            }

            if (!isActive()) {
                return toCancelledResult({
                    ...EMPTY_RESULT,
                    deletedEventIds,
                    deletionConfirmationIncomplete,
                });
            }

            const saved = await this.saveVisibleDirectReplies(
                visibleItems,
                params.fetchedAt ?? this.now(),
                isActive,
            );

            return isActive()
                ? {
                    ...saved,
                    status: "saved",
                    deletedEventIds,
                    deletionConfirmationIncomplete,
                }
                : toCancelledResult({
                    ...saved,
                    deletedEventIds,
                    deletionConfirmationIncomplete,
                });
        })();

        return {
            promise,
            cancel: () => {
                active = false;
                deletionTask?.cancel();
            },
        };
    }

    private async filterKnownDeletedDirectReplies(
        items: PostHistoryDirectReplyRepairItem[],
    ): Promise<KnownDeletionFilterResult> {
        const deletedTargets = await this.deletionRequestsRepository.getDeletedTargets(
            items.map((item) => ({
                targetAuthorPubkey: item.event.pubkey,
                targetEventId: item.event.id,
            })),
        );
        const deletedEventIds = toDeletedEventIds(items, deletedTargets);
        await this.purgeDeletedReplyCache(deletedEventIds);
        const deletedEventIdSet = new Set(deletedEventIds);

        return {
            visibleItems: items.filter((item) => !deletedEventIdSet.has(item.event.id)),
            deletedEventIds,
        };
    }

    private async purgeDeletedReplyCache(eventIds: string[]): Promise<void> {
        for (const eventId of new Set(eventIds)) {
            await this.childInteractionsRepository.deleteChildInteractionByEventId(eventId);
        }
    }

    private async saveVisibleDirectReplies(
        items: PostHistoryDirectReplyRepairItem[],
        fetchedAt: number,
        isActive: () => boolean,
    ): Promise<Omit<PostHistoryDirectReplyRepairSaveResult, "deletedEventIds" | "deletionConfirmationIncomplete">> {
        const itemsByParentId = new Map<string, PostHistoryChildInteractionItem[]>();
        for (const item of items) {
            const parentItems = itemsByParentId.get(item.parentEventId) ?? [];
            parentItems.push({
                event: item.event,
                ...(item.relayUrls ? { relayUrls: item.relayUrls } : {}),
            });
            itemsByParentId.set(item.parentEventId, parentItems);
        }

        const savedParentEventIds: string[] = [];
        let savedDirectReplyCount = 0;
        for (const [parentEventId, events] of itemsByParentId.entries()) {
            if (!isActive()) {
                break;
            }

            const result = await this.childInteractionsRepository.upsertChildInteractions({
                parentEventId,
                events,
                fetchedAt,
            });
            const savedCount = result.insertedCount + result.updatedCount;
            if (savedCount > 0) {
                savedParentEventIds.push(parentEventId);
                savedDirectReplyCount += savedCount;
            }
        }

        return {
            status: "saved",
            savedParentEventIds,
            savedDirectReplyCount,
        };
    }
}

export const postHistoryDirectReplyRepairSaveService =
    new PostHistoryDirectReplyRepairSaveService();
