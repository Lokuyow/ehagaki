import {
    buildPostHistoryReactionReadModel,
    type PostHistoryReactionReadModel,
} from "./postHistoryReactionReadModel";
import {
    summarizePostHistoryReactionRecords,
    type PostHistoryReactionSummary,
} from "./postHistoryReactionSummary";
import { buildChildrenLoadedExpansionState } from "./postHistoryThreadGraphChildrenExpansionState";
import {
    isDeletedThreadGraphEvent,
    type DeletedEventIdsByPubkey,
} from "./postHistoryThreadGraphDeletionState";
import {
    buildAnchorNodeKey,
    buildInitialExpansionState,
    buildThreadGraphNode,
    mergeThreadGraphNode,
    sortEventIdsByEvent,
    toEventFromReplyRecord,
    type PostHistoryThreadGraphExpansionState,
    type PostHistoryThreadGraphNode,
} from "./postHistoryThreadGraphUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { PostHistoryChildInteractionRecord, PostHistoryRecord } from "./storage/ehagakiDb";
import type { PostHistoryDirectReplyFetchMetadata } from "./storage/postHistoryDirectReplyFetchMetadataRepository";
import type { ProfileData } from "./types";

/** The thread graph state that cached child interactions read and update. */
export interface ThreadGraphCachedChildState {
    nodesById: Record<string, PostHistoryThreadGraphNode>;
    parentByChildId: Record<string, string>;
    childrenByParentId: Record<string, string[]>;
    expansionByAnchorNodeKey: Record<string, PostHistoryThreadGraphExpansionState>;
    reactionSummaryByParentId: Record<string, PostHistoryReactionSummary>;
    reactionRecordsByParentId: Record<string, PostHistoryChildInteractionRecord[]>;
    reactionProfilesByPubkey: Record<string, ProfileData | null>;
    reactionReadModelByParentId: Record<string, PostHistoryReactionReadModel>;
    /** Read only: decides which cached replies are skipped. */
    deletedEventIdsByPubkey: DeletedEventIdsByPubkey;
}

export function sanitizeRelayUrls(urls: string[]): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(urls, { limit: 8 });
}

export function uniqueEventIds(eventIds: string[]): string[] {
    return Array.from(new Set(eventIds));
}

export function resolveEffectiveDirectReplyFetchedAt(
    metadata: { completeness: "complete" | "partial"; fetchedAt: number } | null,
): number | null {
    return metadata?.completeness === "complete" ? metadata.fetchedAt : null;
}
export function resolveCachedReplyFetchedAt(records: PostHistoryChildInteractionRecord[]): number | null {
    const fetchedAtValues = records
        .map((record) => record.fetchedAt)
        .filter((value) => Number.isFinite(value));
    return fetchedAtValues.length > 0
        ? Math.max(...fetchedAtValues)
        : null;
}

export function groupCachedChildInteractionRecords(
    records: PostHistoryChildInteractionRecord[],
    parentEventIds: string[],
): Map<string, PostHistoryChildInteractionRecord[]> {
    const targetParentIds = new Set(parentEventIds);
    const recordsByParentId = new Map<string, PostHistoryChildInteractionRecord[]>();
    for (const record of records) {
        if (!targetParentIds.has(record.parentEventId)) {
            continue;
        }
        const parentRecords = recordsByParentId.get(record.parentEventId) ?? [];
        parentRecords.push(record);
        recordsByParentId.set(record.parentEventId, parentRecords);
    }
    for (const parentRecords of recordsByParentId.values()) {
        parentRecords.sort((left, right) => {
            if (left.createdAt !== right.createdAt) {
                return left.createdAt - right.createdAt;
            }
            return left.eventId.localeCompare(right.eventId);
        });
    }
    return recordsByParentId;
}

export interface CachedChildInteractionBatchInput {
    postsByParentId: Map<string, PostHistoryRecord>;
    targetParentIds: string[];
    anchorNodesByParentId: Map<string, PostHistoryThreadGraphNode>;
    reactionRecordsByParentId: Map<string, PostHistoryChildInteractionRecord[]>;
    directReplyRecordsByParentId: Map<string, PostHistoryChildInteractionRecord[]>;
    metadataByParentId: Map<string, PostHistoryDirectReplyFetchMetadata>;
    metadataReadFailedParentIds: Set<string>;
    cachedReactionProfilesByPubkey: Record<string, ProfileData | null>;
    knownNodeProfilesByPubkey: Map<string, ProfileData | null>;
}

/**
 * Fold cached reactions and direct replies for a batch of parents into the
 * thread graph state. Graph maps that end up unchanged are returned as the
 * same object, so the caller can skip those state writes; the reaction maps
 * are always new objects.
 */
export function applyCachedChildInteractionBatch(
    current: ThreadGraphCachedChildState,
    input: CachedChildInteractionBatchInput,
): Omit<ThreadGraphCachedChildState, "deletedEventIdsByPubkey"> {
    const isDeletedNodeEventId = (eventId: string): boolean => {
        const node = current.nodesById[eventId];
        return node
            ? isDeletedThreadGraphEvent(current.deletedEventIdsByPubkey, node.authorPubkey, eventId)
            : false;
    };
    const nextNodesById = { ...current.nodesById };
    const nextParentByChildId = { ...current.parentByChildId };
    const nextChildrenByParentId = { ...current.childrenByParentId };
    const nextExpansionByAnchorNodeKey = { ...current.expansionByAnchorNodeKey };
    const nextReactionSummaryByParentId = { ...current.reactionSummaryByParentId };
    const nextReactionRecordsByParentId = { ...current.reactionRecordsByParentId };
    const nextReactionProfilesByPubkey = { ...current.reactionProfilesByPubkey };
    const nextReactionReadModelByParentId = { ...current.reactionReadModelByParentId };
    let nodesChanged = false;
    let parentEdgesChanged = false;
    let childrenChanged = false;
    let expansionsChanged = false;
    const childIdsByParentId = new Map<string, string[]>();

    const upsertDraftNode = (nextNode: PostHistoryThreadGraphNode) => {
        const mergedNode = mergeThreadGraphNode(
            nextNodesById[nextNode.eventId],
            nextNode,
        );
        nextNodesById[mergedNode.eventId] = mergedNode;
        nodesChanged = true;
        return mergedNode;
    };
    const upsertDraftParentEdge = (
        childEventId: string,
        parentEventId: string | null,
    ) => {
        if (!parentEventId) {
            return;
        }
        nextParentByChildId[childEventId] = parentEventId;
        parentEdgesChanged = true;
    };

    for (const parentEventId of input.targetParentIds) {
        const anchorNode = input.anchorNodesByParentId.get(parentEventId);
        if (!anchorNode) {
            continue;
        }
        const mergedAnchorNode = upsertDraftNode(anchorNode);
        upsertDraftParentEdge(
            mergedAnchorNode.eventId,
            mergedAnchorNode.parentEventId,
        );

        const reactionRecords = input.reactionRecordsByParentId.get(parentEventId) ?? [];
        nextReactionSummaryByParentId[parentEventId] =
            summarizePostHistoryReactionRecords(reactionRecords);
        nextReactionRecordsByParentId[parentEventId] = reactionRecords;
    }

    for (const [pubkey, profile] of Object.entries(
        input.cachedReactionProfilesByPubkey,
    )) {
        nextReactionProfilesByPubkey[pubkey] = profile;
    }

    for (const parentEventId of input.targetParentIds) {
        const anchorNode = input.anchorNodesByParentId.get(parentEventId);
        if (!anchorNode) {
            continue;
        }
        const acceptedRecords: PostHistoryChildInteractionRecord[] = [];
        const childEventIds: string[] = [];
        for (const record of input.directReplyRecordsByParentId.get(parentEventId) ?? []) {
            const event = toEventFromReplyRecord(record);
            if (isDeletedThreadGraphEvent(current.deletedEventIdsByPubkey, event.pubkey, event.id)) {
                continue;
            }
            const childNode = upsertDraftNode(buildThreadGraphNode({
                event,
                relayUrls: sanitizeRelayUrls(record.relayUrls),
                sources: ["reply-db", "inbound-sync"],
            }));
            if (childNode.eventId === parentEventId) {
                continue;
            }
            upsertDraftParentEdge(childNode.eventId, parentEventId);
            childEventIds.push(childNode.eventId);
            acceptedRecords.push(record);
        }
        childIdsByParentId.set(parentEventId, childEventIds);

        const metadata = input.metadataByParentId.get(parentEventId) ?? null;
        const metadataReadFailed = input.metadataReadFailedParentIds.has(parentEventId);
        if (acceptedRecords.length === 0 && !metadata) {
            continue;
        }
        const post = input.postsByParentId.get(parentEventId);
        if (!post) {
            continue;
        }
        const expansionKey = buildAnchorNodeKey(post.eventId, parentEventId);
        const currentExpansion = nextExpansionByAnchorNodeKey[expansionKey]
            ?? buildInitialExpansionState();
        nextExpansionByAnchorNodeKey[expansionKey] =
            metadata?.completeness === "partial" && acceptedRecords.length === 0
                ? {
                    ...currentExpansion,
                    loadedChildren: false,
                    loadingChildren: false,
                    revalidatingChildren: false,
                    childrenError: null,
                    lastFetchedChildrenAt: null,
                }
                : buildChildrenLoadedExpansionState(currentExpansion, {
                    lastFetchedChildrenAt: metadataReadFailed
                        ? null
                        : metadata
                            ? resolveEffectiveDirectReplyFetchedAt(metadata)
                            : resolveCachedReplyFetchedAt(acceptedRecords),
                });
        expansionsChanged = true;
    }

    for (const [parentEventId, childEventIds] of childIdsByParentId) {
        const currentChildEventIds = nextChildrenByParentId[parentEventId] ?? [];
        nextChildrenByParentId[parentEventId] = sortEventIdsByEvent(
            uniqueEventIds([...currentChildEventIds, ...childEventIds]).filter(
                (eventId) =>
                    eventId !== parentEventId
                    && !isDeletedNodeEventId(eventId),
            ),
            nextNodesById,
        );
        childrenChanged = true;
    }

    for (const [pubkey, profile] of input.knownNodeProfilesByPubkey) {
        if (!profile) {
            continue;
        }
        for (const [eventId, node] of Object.entries(nextNodesById)) {
            if (node.authorPubkey === pubkey) {
                nextNodesById[eventId] = mergeThreadGraphNode(node, {
                    ...node,
                    profile,
                });
                nodesChanged = true;
            }
        }
    }

    for (const parentEventId of input.targetParentIds) {
        nextReactionReadModelByParentId[parentEventId] =
            buildPostHistoryReactionReadModel(
                nextReactionRecordsByParentId[parentEventId] ?? [],
                nextReactionProfilesByPubkey,
            );
    }

    return {
        nodesById: nodesChanged ? nextNodesById : current.nodesById,
        parentByChildId: parentEdgesChanged ? nextParentByChildId : current.parentByChildId,
        childrenByParentId: childrenChanged ? nextChildrenByParentId : current.childrenByParentId,
        expansionByAnchorNodeKey: expansionsChanged
            ? nextExpansionByAnchorNodeKey
            : current.expansionByAnchorNodeKey,
        reactionSummaryByParentId: nextReactionSummaryByParentId,
        reactionRecordsByParentId: nextReactionRecordsByParentId,
        reactionProfilesByPubkey: nextReactionProfilesByPubkey,
        reactionReadModelByParentId: nextReactionReadModelByParentId,
    };
}
