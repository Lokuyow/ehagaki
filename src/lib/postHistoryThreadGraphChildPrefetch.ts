import { buildPostHistoryDirectReplyParentContext } from "./postHistoryDirectReplyRelationUtils";
import { parsePostHistoryThreadReferences } from "./postHistoryNip10Utils";
import type {
    PostHistoryReplyFetchedEvent,
    PostHistoryReplyFetchRequest,
} from "./postHistoryReplyFetchService";
import type { PostHistoryThreadGraphNode } from "./postHistoryThreadGraphUtils";
import type { RelayConfig } from "./types";

/** Build the direct-reply fetch request for one children prefetch batch. */
export function buildChildrenPrefetchFetchRequest(input: {
    batchEventIds: string[];
    batchNodes: PostHistoryThreadGraphNode[];
    relayHints: string[];
    relayConfig: RelayConfig | null | undefined;
}): PostHistoryReplyFetchRequest {
    return {
        eventId: input.batchEventIds[0] ?? "",
        eventIds: input.batchEventIds,
        createdAt: Math.min(...input.batchNodes.map((node) => node.event.created_at)),
        relayHints: input.relayHints,
        parents: input.batchNodes
            .map((node) => buildPostHistoryDirectReplyParentContext({
                event: node.event,
                relayHints: [
                    ...node.relayUrls,
                    ...parsePostHistoryThreadReferences(node.event).relayHints,
                ],
            }))
            .filter((context) => context !== null),
        relayConfig: input.relayConfig,
    };
}

/** Keep fetched replies whose parent is in the batch, dropping self-references. */
export function selectBatchDirectReplyItems<T extends PostHistoryReplyFetchedEvent>(
    items: T[],
    batchEventIds: string[],
): T[] {
    const batchEventIdSet = new Set(batchEventIds);
    return items.filter((item) => {
        return batchEventIdSet.has(item.parentEventId)
            && item.event.id !== item.parentEventId;
    });
}

/**
 * Group the visible replies by batch parent. The parent comes from the
 * pre-filter `directReplyItems`, matched by event id.
 */
export function groupVisibleDirectReplyItemsByParent<T extends { event: { id: string } }>(input: {
    batchEventIds: string[];
    directReplyItems: PostHistoryReplyFetchedEvent[];
    visibleItems: T[];
}): Map<string, T[]> {
    const batchEventIdSet = new Set(input.batchEventIds);
    const itemsByParentId = new Map<string, T[]>();
    const parentIdByEventId = new Map(
        input.directReplyItems.map((item) => [item.event.id, item.parentEventId]),
    );
    for (const item of input.visibleItems) {
        const parentId = parentIdByEventId.get(item.event.id);
        if (!parentId || !batchEventIdSet.has(parentId)) {
            continue;
        }

        const items = itemsByParentId.get(parentId) ?? [];
        items.push(item);
        itemsByParentId.set(parentId, items);
    }
    return itemsByParentId;
}

/**
 * A prefetched parent counts as loaded only when its fetch was complete or it
 * already shows children.
 */
export function resolvePrefetchedChildrenLoaded(input: {
    effectiveFetchedAt: number | null;
    visibleChildCount: number;
}): boolean {
    return input.effectiveFetchedAt !== null || input.visibleChildCount > 0;
}
