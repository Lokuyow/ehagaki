import type { PostHistoryThreadGraphNode } from "./postHistoryThreadGraphUtils";

/** Deleted event ids, grouped by the author whose deletion request covers them. */
export type DeletedEventIdsByPubkey = Record<string, Record<string, true>>;

export function isDeletedThreadGraphEvent(
    deletedEventIdsByPubkey: DeletedEventIdsByPubkey,
    authorPubkey: string | null | undefined,
    eventId: string | null | undefined,
): boolean {
    if (!authorPubkey || !eventId) {
        return false;
    }

    return !!deletedEventIdsByPubkey[authorPubkey]?.[eventId];
}

/**
 * Add deleted targets. Returns the same object when nothing was added, so a
 * caller can skip the state write and its follow-up work.
 */
export function addDeletedThreadGraphTargets(
    deletedEventIdsByPubkey: DeletedEventIdsByPubkey,
    deletedTargets: Map<string, Set<string>>,
): DeletedEventIdsByPubkey {
    let nextDeletedEventIdsByPubkey = deletedEventIdsByPubkey;
    for (const [authorPubkey, eventIds] of deletedTargets.entries()) {
        const currentEventIds = nextDeletedEventIdsByPubkey[authorPubkey] ?? {};
        let nextEventIds = currentEventIds;
        for (const eventId of eventIds) {
            if (nextEventIds[eventId]) {
                continue;
            }

            nextEventIds = {
                ...nextEventIds,
                [eventId]: true,
            };
        }

        if (nextEventIds !== currentEventIds) {
            nextDeletedEventIdsByPubkey = {
                ...nextDeletedEventIdsByPubkey,
                [authorPubkey]: nextEventIds,
            };
        }
    }

    return nextDeletedEventIdsByPubkey;
}

/**
 * Drop an event from every child list and from the child-to-parent map.
 * Each map is returned unchanged (same object) when it did not contain the event.
 */
export function removeThreadGraphEventFromRelations(
    relations: {
        childrenByParentId: Record<string, string[]>;
        parentByChildId: Record<string, string>;
    },
    eventId: string,
): {
    childrenByParentId: Record<string, string[]>;
    parentByChildId: Record<string, string>;
} {
    const nextChildrenByParentId: Record<string, string[]> = {};
    let changedChildren = false;
    for (const [parentEventId, childEventIds] of Object.entries(relations.childrenByParentId)) {
        const nextChildEventIds = childEventIds.filter((childEventId) => childEventId !== eventId);
        nextChildrenByParentId[parentEventId] = nextChildEventIds;
        if (nextChildEventIds.length !== childEventIds.length) {
            changedChildren = true;
        }
    }

    let nextParentByChildId = relations.parentByChildId;
    if (relations.parentByChildId[eventId]) {
        const { [eventId]: _removed, ...rest } = relations.parentByChildId;
        nextParentByChildId = rest;
    }

    return {
        childrenByParentId: changedChildren
            ? nextChildrenByParentId
            : relations.childrenByParentId,
        parentByChildId: nextParentByChildId,
    };
}

/**
 * Children whose known parent is the deleted event. When the deletion names
 * an author, a parent node recorded under a different author does not count.
 */
export function collectThreadGraphChildrenOfDeletedParent(input: {
    parentByChildId: Record<string, string>;
    nodesById: Record<string, Pick<PostHistoryThreadGraphNode, "authorPubkey">>;
    eventId: string;
    authorPubkey: string | null | undefined;
}): Set<string> {
    const affectedChildEventIds = new Set<string>();
    for (const [childEventId, parentEventId] of Object.entries(input.parentByChildId)) {
        if (parentEventId !== input.eventId) {
            continue;
        }

        const node = input.nodesById[input.eventId];
        if (input.authorPubkey && node && node.authorPubkey !== input.authorPubkey) {
            continue;
        }

        affectedChildEventIds.add(childEventId);
    }

    return affectedChildEventIds;
}

/** Keep the items whose event id is in the visible set, in their original order. */
export function keepVisibleThreadGraphItems<T>(
    items: T[],
    visibleEventIds: ReadonlySet<string>,
    getEventId: (item: T) => string,
): T[] {
    const visibleItems: T[] = [];
    for (const item of items) {
        if (!visibleEventIds.has(getEventId(item))) {
            continue;
        }

        visibleItems.push(item);
    }

    return visibleItems;
}
