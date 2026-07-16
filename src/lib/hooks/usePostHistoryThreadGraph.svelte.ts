import { onDestroy } from "svelte";
import type { RxNostr } from "rx-nostr";
import {
    createPostHistoryRelatedTargetResolver,
    type PostHistoryRelatedTargetResolver,
    type PostHistoryRelatedTargetSnapshot,
    type RelatedTargetDescriptor,
} from "../postHistoryRelatedTargetResolver.svelte";
import {
    postHistoryContextFetchService,
    type PostHistoryContextFetchService,
} from "../postHistoryContextFetchService";
import {
    postHistoryReplyFetchService,
    type PostHistoryReplyFetchService,
} from "../postHistoryReplyFetchService";
import {
    postHistoryDeletionFetchService,
    type PostHistoryDeletionFetchService,
} from "../postHistoryDeletionFetchService";
import {
    postHistoryDirectReplyRecordsAdapter,
    postHistoryReactionRecordsAdapter,
    type PostHistoryDirectReplyRecordsAdapter,
    type PostHistoryReactionRecordsAdapter,
} from "../postHistoryChildInteractionsAdapter";
import { RelayConfigUtils } from "../relayConfigUtils";
import { postHistoryReplyParentTargetDiscoveryAdapter } from "../postHistoryRelatedTargetDiscoveryAdapter";
import type { NostrEvent, ProfileData, RelayConfig } from "../types";
import type { PostHistoryRecord, PostHistoryChildInteractionRecord } from "../storage/ehagakiDb";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "../storage/postHistoryRepository";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionsRepository,
} from "../storage/postHistoryChildInteractionsRepository";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "../storage/postHistoryDeletionRequestsRepository";
import { parsePostHistoryThreadReferences } from "../postHistoryNip10Utils";
import {
    buildPostHistoryDirectReplyParentContext,
    validatePostHistoryDirectReplyRelation,
} from "../postHistoryDirectReplyRelationUtils";
import {
    EMPTY_POST_HISTORY_REACTION_SUMMARY,
    type PostHistoryReactionSummary,
    summarizePostHistoryReactionRecords,
} from "../postHistoryReactionSummary";
import {
    EMPTY_POST_HISTORY_REACTION_READ_MODEL,
    buildPostHistoryReactionReadModel,
    selectPostHistoryReactionRecords,
    type PostHistoryReactionReadModel,
} from "../postHistoryReactionReadModel";
import {
    buildAnchorNodeKey,
    buildInitialExpansionState,
    buildThreadGraphNode,
    mergeThreadGraphNode,
    sortEventIdsByEvent,
    toEventFromPostHistoryRecord,
    toEventFromReplyRecord,
    type PostHistoryThreadGraphExpansionState,
    type PostHistoryThreadGraphNode,
    type PostHistoryThreadGraphSource,
} from "../postHistoryThreadGraphUtils";
import { createPostHistoryThreadGraphTaskTracker } from "../postHistoryThreadGraphTaskTracker";
import { createPostHistoryThreadGraphParentLoadingIndicator } from "../postHistoryThreadGraphParentLoadingIndicator";
import {
    buildParentLoadedExpansionState,
    buildParentLoadingExpansionState,
} from "../postHistoryThreadGraphParentExpansionState";
import {
    buildChildrenFailedExpansionState,
    buildChildrenLoadedExpansionState,
    buildChildrenLoadingExpansionState,
} from "../postHistoryThreadGraphChildrenExpansionState";
import {
    applyChildrenRevalidateErrorState,
    applyParentRevalidateErrorState,
    createChildrenRevalidateStatusStrategies,
    createParentRevalidateStatusStrategies,
    resolveChildrenRevalidateStatus,
    resolveParentRevalidateStatus,
} from "../postHistoryThreadGraphApplyStrategies";
import {
    coordinateThreadGraphNodeLoadExecution,
    coordinateThreadGraphBatchLifecycle,
    coordinateThreadGraphRevalidateTemplate,
    coordinateThreadGraphStatusStrategy,
    shouldRunThreadGraphBackgroundRevalidate,
} from "../postHistoryThreadGraphFetchCoordinator";
import { profileMetadataCache } from "../profileMetadataCache.svelte";
import {
    createPostHistoryProfileSyncCoordinator,
    type PostHistoryProfileSyncCoordinator,
} from "../postHistoryProfileSync";

export type PostHistoryThreadGraphRepliesStatus =
    | "unloaded"
    | "loading"
    | "loaded"
    | "failed";

export interface PostHistoryThreadGraphReplyItem {
    event: NostrEvent;
    profile: ProfileData | null;
    relayUrls: string[];
    isOwnReply: boolean;
}

export interface PostHistoryThreadGraphRepliesActionState {
    status: PostHistoryThreadGraphRepliesStatus;
    visible: boolean;
    replies: Array<PostHistoryThreadGraphReplyItem | string>;
    replyCount: number;
    error: string | null;
}

export interface PostHistoryThreadGraphNodeState {
    anchorEventId: string;
    node: PostHistoryThreadGraphNode;
    parentTargetId: string | null;
    parentNodeState: PostHistoryThreadGraphNodeState | null;
    parentExpansion: PostHistoryThreadGraphExpansionState;
    parentAlreadyInPath: boolean;
    repliesActionState: PostHistoryThreadGraphRepliesActionState;
    replyNodeStates: PostHistoryThreadGraphNodeState[];
    isOwnReply: boolean;
    depthFromAnchor: number;
    cycleDetected: boolean;
}

export interface PostHistoryThreadGraphAnchorState {
    anchorEventId: string;
    parentTargetId: string | null;
    parentNode: PostHistoryThreadGraphNode | null;
    parentNodeState: PostHistoryThreadGraphNodeState | null;
    parentExpansion: PostHistoryThreadGraphExpansionState;
    repliesActionState: PostHistoryThreadGraphRepliesActionState;
    reactionSummary: PostHistoryReactionSummary;
    reactionReadModel: PostHistoryReactionReadModel;
    replyItems: PostHistoryThreadGraphReplyItem[];
    replyNodeStates: PostHistoryThreadGraphNodeState[];
}

interface UsePostHistoryThreadGraphParams {
    getShow: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    postHistoryRepositoryImpl?: Pick<PostHistoryRepository, "getByEventId">;
    directReplyRecordsAdapterImpl?: PostHistoryDirectReplyRecordsAdapter;
    reactionRecordsAdapterImpl?: PostHistoryReactionRecordsAdapter;
    childInteractionsRepositoryImpl?: Pick<
        PostHistoryChildInteractionsRepository,
        "upsertChildInteractions" | "deleteChildInteractionByEventId"
    >;
    deletionRequestsRepositoryImpl?: Pick<
        PostHistoryDeletionRequestsRepository,
        "getDeletedTargets" | "upsertValidDeletionRequests"
    >;
    profileSyncCoordinator?: PostHistoryProfileSyncCoordinator;
    contextFetchService?: Pick<PostHistoryContextFetchService, "fetchEventById">;
    replyFetchService?: Pick<PostHistoryReplyFetchService, "fetchDirectReplies">;
    deletionFetchService?: Pick<PostHistoryDeletionFetchService, "fetchDeletionRequests">;
    relatedTargetResolver?: PostHistoryRelatedTargetResolver;
}

function buildInitialRepliesActionState(): PostHistoryThreadGraphRepliesActionState {
    return {
        status: "unloaded",
        visible: false,
        replies: [],
        replyCount: 0,
        error: null,
    };
}

function sanitizeRelayUrls(urls: string[]): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(urls, { limit: 8 });
}

function areStringArraysEqual(left: string[], right: string[]): boolean {
    if (left.length !== right.length) {
        return false;
    }

    return left.every((value, index) => value === right[index]);
}

function uniqueEventIds(eventIds: string[]): string[] {
    return Array.from(new Set(eventIds));
}

const POST_HISTORY_THREAD_GRAPH_MAX_PARENT_DEPTH = 20;
const POST_HISTORY_THREAD_GRAPH_MAX_CHILD_DEPTH = 20;
const POST_HISTORY_CHILD_REPLY_PREFETCH_LIMIT = 12;
const POST_HISTORY_CHILD_REPLY_PREFETCH_CONCURRENCY = 2;
const POST_HISTORY_CHILD_REPLY_PREFETCH_BATCH_SIZE = 4;
const POST_HISTORY_CHILD_REPLY_PREFETCH_RELAY_LIMIT = 4;
const POST_HISTORY_CHILD_REPLY_PREFETCH_FRESH_MS = 5 * 60 * 1_000;

function assertPostHistoryReplyFetchDidNotFail(status: string): void {
    if (status === "failed") {
        throw new Error("post_history_reply_fetch_failed");
    }
}
const POST_HISTORY_THREAD_GRAPH_REVALIDATE_TTL_MS = 5 * 60 * 1_000;
let nextThreadGraphParentResolverScopeId = 0;

export function resolvePostHistoryReplyBadgePreloadParentIds(
    posts: Pick<PostHistoryRecord, "eventId">[],
    parentEventIds?: string[],
): string[] {
    const currentPostIds = new Set(posts.map((post) => post.eventId));

    return (parentEventIds && parentEventIds.length > 0
        ? Array.from(new Set(parentEventIds))
        : Array.from(currentPostIds))
        .filter((eventId) => currentPostIds.has(eventId));
}

export function isValidPostHistoryCachedDirectReply(input: {
    parentNode: PostHistoryThreadGraphNode;
    record: PostHistoryChildInteractionRecord;
}): boolean {
    const parentContext = buildPostHistoryDirectReplyParentContext({
        event: input.parentNode.event,
        relayHints: input.parentNode.relayUrls,
    });
    return !!parentContext
        && validatePostHistoryDirectReplyRelation({
            child: toEventFromReplyRecord(input.record),
            parent: parentContext,
        }).valid;
}

export function usePostHistoryThreadGraph({
    getShow,
    getPubkeyHex,
    getRxNostr,
    getRelayConfig,
    postHistoryRepositoryImpl = postHistoryRepository,
    directReplyRecordsAdapterImpl = postHistoryDirectReplyRecordsAdapter,
    reactionRecordsAdapterImpl = postHistoryReactionRecordsAdapter,
    childInteractionsRepositoryImpl = postHistoryChildInteractionsRepository,
    deletionRequestsRepositoryImpl = postHistoryDeletionRequestsRepository,
    profileSyncCoordinator = undefined,
    contextFetchService = postHistoryContextFetchService,
    replyFetchService = postHistoryReplyFetchService,
    deletionFetchService = postHistoryDeletionFetchService,
    relatedTargetResolver = undefined,
}: UsePostHistoryThreadGraphParams) {
    const profileSync = profileSyncCoordinator
        ?? createPostHistoryProfileSyncCoordinator({ getShow, getRxNostr });
    const ownsProfileSync = !profileSyncCoordinator;
    const resolver = relatedTargetResolver
        ?? createPostHistoryRelatedTargetResolver({
            getShow,
            getRxNostr,
            getRelayConfig,
            postHistoryRepositoryImpl,
            contextFetchService,
            deletionRequestsRepositoryImpl,
            deletionFetchService,
            profileSyncCoordinator: profileSync,
        });
    const ownsResolver = !relatedTargetResolver;
    const parentResolverScopeKey =
        `post-history-thread-graph-parent:${++nextThreadGraphParentResolverScopeId}`;

    let nodesById = $state.raw<Record<string, PostHistoryThreadGraphNode>>({});
    let parentByChildId = $state.raw<Record<string, string>>({});
    let childrenByParentId = $state.raw<Record<string, string[]>>({});
    let expansionByAnchorNodeKey =
        $state.raw<Record<string, PostHistoryThreadGraphExpansionState>>({});
    let deletedEventIdsByPubkey = $state.raw<Record<string, Record<string, true>>>({});
    let parentResolverRevision = $state(0);
    const parentLoadingIndicator = createPostHistoryThreadGraphParentLoadingIndicator();
    const replyBadgePreloadKeys = new Set<string>();
    const childReplyCountPrefetchKeys = new Set<string>();
    let reactionSummaryByParentId =
        $state.raw<Record<string, PostHistoryReactionSummary>>({});
    let reactionRecordsByParentId =
        $state.raw<Record<string, PostHistoryChildInteractionRecord[]>>({});
    let reactionProfilesByPubkey =
        $state.raw<Record<string, ProfileData | null>>({});
    let reactionReadModelByParentId =
        $state.raw<Record<string, PostHistoryReactionReadModel>>({});
    const taskTracker = createPostHistoryThreadGraphTaskTracker();

    function rebuildReactionReadModelForParent(parentEventId: string): void {
        const records = reactionRecordsByParentId[parentEventId] ?? [];
        reactionReadModelByParentId = {
            ...reactionReadModelByParentId,
            [parentEventId]: buildPostHistoryReactionReadModel(
                records,
                reactionProfilesByPubkey,
            ),
        };
    }

    function setReactionSummary(
        parentEventId: string,
        records: PostHistoryChildInteractionRecord[],
    ): void {
        reactionSummaryByParentId = {
            ...reactionSummaryByParentId,
            [parentEventId]: summarizePostHistoryReactionRecords(records),
        };
    }

    function setReactionRecords(
        parentEventId: string,
        records: PostHistoryChildInteractionRecord[],
    ): void {
        reactionRecordsByParentId = {
            ...reactionRecordsByParentId,
            [parentEventId]: records,
        };
        rebuildReactionReadModelForParent(parentEventId);
    }

    function setReactionProfile(pubkey: string, profile: ProfileData | null): void {
        reactionProfilesByPubkey = {
            ...reactionProfilesByPubkey,
            [pubkey]: profile,
        };
        for (const [parentEventId, records] of Object.entries(reactionRecordsByParentId)) {
            if (records.some((record) => record.authorPubkey === pubkey)) {
                rebuildReactionReadModelForParent(parentEventId);
            }
        }
    }

    function getReactionSummary(parentEventId: string): PostHistoryReactionSummary {
        return reactionSummaryByParentId[parentEventId]
            ?? EMPTY_POST_HISTORY_REACTION_SUMMARY;
    }

    function getReactionReadModel(parentEventId: string): PostHistoryReactionReadModel {
        return reactionReadModelByParentId[parentEventId]
            ?? EMPTY_POST_HISTORY_REACTION_READ_MODEL;
    }

    function getExpansion(anchorEventId: string, nodeEventId: string): PostHistoryThreadGraphExpansionState {
        return expansionByAnchorNodeKey[buildAnchorNodeKey(anchorEventId, nodeEventId)]
            ?? buildInitialExpansionState();
    }

    function updateExpansion(
        anchorEventId: string,
        nodeEventId: string,
        updater: (current: PostHistoryThreadGraphExpansionState) => PostHistoryThreadGraphExpansionState,
    ): void {
        const key = buildAnchorNodeKey(anchorEventId, nodeEventId);
        expansionByAnchorNodeKey = {
            ...expansionByAnchorNodeKey,
            [key]: updater(expansionByAnchorNodeKey[key] ?? buildInitialExpansionState()),
        };
    }

    function upsertNode(input: {
        event: NostrEvent;
        relayUrls?: string[];
        sources: PostHistoryThreadGraphSource[];
        profile?: ProfileData | null;
    }): PostHistoryThreadGraphNode {
        const next = buildThreadGraphNode(input);
        const merged = mergeThreadGraphNode(nodesById[next.eventId], next);
        nodesById = {
            ...nodesById,
            [merged.eventId]: merged,
        };
        return merged;
    }

    function upsertParentEdge(childEventId: string, parentEventId: string | null): void {
        if (!parentEventId) {
            return;
        }

        parentByChildId = {
            ...parentByChildId,
            [childEventId]: parentEventId,
        };
    }

    function upsertChildren(parentEventId: string, childEventIds: string[]): void {
        const current = childrenByParentId[parentEventId] ?? [];
        const merged = sortEventIdsByEvent(
            uniqueEventIds([...current, ...childEventIds]).filter((eventId) =>
                eventId !== parentEventId && !isDeletedNodeEventId(eventId),
            ),
            nodesById,
        );

        childrenByParentId = {
            ...childrenByParentId,
            [parentEventId]: merged,
        };
    }

    function buildAnchorNodeFromPost(post: PostHistoryRecord): PostHistoryThreadGraphNode {
        const event = toEventFromPostHistoryRecord(post);
        return buildThreadGraphNode({
            event,
            relayUrls: sanitizeRelayUrls([
                ...post.relayHints,
                ...post.acceptedRelays,
                ...(post.fetchedRelays ?? []),
            ]),
            sources: ["anchor", "history-record"],
        });
    }

    function ensureAnchorNode(post: PostHistoryRecord): PostHistoryThreadGraphNode {
        const anchorNode = buildAnchorNodeFromPost(post);
        const node = upsertNode({
            event: anchorNode.event,
            relayUrls: anchorNode.relayUrls,
            sources: anchorNode.sources,
        });
        upsertParentEdge(node.eventId, node.parentEventId);
        refreshProfileForPubkeyInBackground(node.authorPubkey, node.relayUrls);
        return node;
    }

    function mergeProfileForPubkey(pubkey: string, profile: ProfileData | null): void {
        if (!pubkey || !profile) {
            return;
        }

        let changed = false;
        const nextNodesById = { ...nodesById };
        for (const [eventId, node] of Object.entries(nodesById)) {
            if (node.authorPubkey !== pubkey) {
                continue;
            }

            nextNodesById[eventId] = mergeThreadGraphNode(node, {
                ...node,
                profile,
            });
            changed = true;
        }

        if (changed) {
            nodesById = nextNodesById;
        }
    }

    function refreshProfileForPubkeyInBackground(
        pubkey: string,
        additionalRelays: string[] = [],
    ): void {
        const knownProfile = profileSync.ensureProfile(pubkey, additionalRelays);
        mergeProfileForPubkey(pubkey, knownProfile);
    }

    const unsubscribeProfileUpdates = profileSync.subscribe((pubkey, profile) => {
        if (!getShow()) {
            return;
        }
        mergeProfileForPubkey(pubkey, profile);
        setReactionProfile(pubkey, profile);
    });

    async function upsertNodeWithProfile(input: {
        event: NostrEvent;
        relayUrls?: string[];
        sources: PostHistoryThreadGraphSource[];
    }): Promise<PostHistoryThreadGraphNode> {
        const relayUrls = sanitizeRelayUrls(input.relayUrls ?? []);
        const node = upsertNode({
            ...input,
            relayUrls,
        });
        refreshProfileForPubkeyInBackground(input.event.pubkey, relayUrls);
        return node;
    }

    function buildParentTargetDescriptor(
        post: PostHistoryRecord,
        nodeEventId: string,
        node: PostHistoryThreadGraphNode,
    ): RelatedTargetDescriptor | null {
        const context = postHistoryReplyParentTargetDiscoveryAdapter.buildContext(
            post,
            nodeEventId,
            node,
        );
        if (!context) {
            return null;
        }

        return postHistoryReplyParentTargetDiscoveryAdapter.toDescriptor(
            context,
            parentResolverScopeKey,
        );
    }

    function resolveNodeWithParentTargetSnapshot(
        node: PostHistoryThreadGraphNode | null | undefined,
    ): PostHistoryThreadGraphNode | null {
        if (!node) {
            return null;
        }

        const snapshot = resolver.getTargetSnapshot(node.eventId);
        if (snapshot?.status !== "resolved" || !snapshot.event) {
            return node;
        }

        const nextRelayUrls = sanitizeRelayUrls([
            ...node.relayUrls,
            ...snapshot.relayHints,
        ]);
        const nextProfile = snapshot.profile ?? node.profile ?? null;
        if (
            node.event === snapshot.event
            && node.profile === nextProfile
            && areStringArraysEqual(node.relayUrls, nextRelayUrls)
        ) {
            return node;
        }

        return mergeThreadGraphNode(node, {
            ...node,
            event: snapshot.event,
            relayUrls: nextRelayUrls,
            profile: nextProfile,
        });
    }

    function getParentRelayHints(post: PostHistoryRecord, node: PostHistoryThreadGraphNode): string[] {
        return postHistoryReplyParentTargetDiscoveryAdapter.getRelayHints(post, node);
    }

    function getParentAuthorHint(node: PostHistoryThreadGraphNode): string | null {
        return postHistoryReplyParentTargetDiscoveryAdapter.getAuthorHint(node);
    }

    function getChildrenRelayHints(post: PostHistoryRecord, node: PostHistoryThreadGraphNode): string[] {
        const references = parsePostHistoryThreadReferences(node.event);
        return sanitizeRelayUrls([
            ...node.relayUrls,
            ...references.relayHints,
            ...post.relayHints,
            ...post.acceptedRelays,
            ...(post.fetchedRelays ?? []),
        ]);
    }

    function getChildrenPrefetchRelayHints(post: PostHistoryRecord, nodes: PostHistoryThreadGraphNode[]): string[] {
        return RelayConfigUtils.sanitizeExternalRelayUrls([
            ...nodes.flatMap((node) => {
                const references = parsePostHistoryThreadReferences(node.event);
                return [
                    ...node.relayUrls,
                    ...references.relayHints,
                ];
            }),
            ...post.relayHints,
            ...post.acceptedRelays,
            ...(post.fetchedRelays ?? []),
        ], { limit: POST_HISTORY_CHILD_REPLY_PREFETCH_RELAY_LIMIT });
    }

    function clearParentLoadingDelayTimer(key: string): void {
        parentLoadingIndicator.clear(key);
    }

    function scheduleParentLoadingIndicator(anchorEventId: string, nodeEventId: string): void {
        const key = buildAnchorNodeKey(anchorEventId, nodeEventId);
        parentLoadingIndicator.schedule(key, () => {
            const current = getExpansion(anchorEventId, nodeEventId);
            if (!current.loadingParent || !current.visibleParent) {
                return;
            }

            updateExpansion(anchorEventId, nodeEventId, (state) => ({
                ...state,
                showParentLoadingIndicator: true,
            }));
        });
    }

    function toReplyItems(
        anchorEventId: string,
        currentPubkey: string,
    ): PostHistoryThreadGraphReplyItem[] {
        const eventIds = childrenByParentId[anchorEventId] ?? [];
        return eventIds
            .map((eventId) => resolveNodeWithParentTargetSnapshot(nodesById[eventId]))
            .filter((node): node is PostHistoryThreadGraphNode => !!node)
            .filter((node) => !isDeletedEvent(node.authorPubkey, node.eventId))
            .map((node) => ({
                event: node.event,
                profile: node.profile,
                relayUrls: [...node.relayUrls],
                isOwnReply: node.authorPubkey === currentPubkey,
            }));
    }

    function toVisibleChildEventIds(parentEventId: string): string[] {
        return (childrenByParentId[parentEventId] ?? [])
            .filter((eventId) => {
                const node = nodesById[eventId];
                return node && !isDeletedEvent(node.authorPubkey, node.eventId);
            });
    }

    function toRenderableChildEventIds(
        parentEventId: string,
        pathEventIds: string[],
        renderedEventIds: Set<string>,
    ): string[] {
        return toVisibleChildEventIds(parentEventId)
            .filter((eventId) =>
                !pathEventIds.includes(eventId) && !renderedEventIds.has(eventId),
            );
    }

    function getNodeState(
        anchorEventId: string,
        nodeEventId: string,
        currentPubkey: string,
        pathEventIds: string[] = [],
        depthFromAnchor = 0,
        renderedEventIds: Set<string> = new Set(),
    ): PostHistoryThreadGraphNodeState | null {
        const node = resolveNodeWithParentTargetSnapshot(nodesById[nodeEventId]);
        if (!node || isDeletedEvent(node.authorPubkey, node.eventId)) {
            return null;
        }

        if (pathEventIds.includes(nodeEventId) || renderedEventIds.has(nodeEventId)) {
            return null;
        }

        renderedEventIds.add(nodeEventId);
        const nextPath = [...pathEventIds, nodeEventId];
        const expansion = getExpansion(anchorEventId, nodeEventId);
        const parentTargetId = node.parentEventId;
        const parentAlreadyInPath = parentTargetId
            ? pathEventIds.includes(parentTargetId)
            : false;
        const parentNodeState = expansion.visibleParent
            && parentTargetId
            && !parentAlreadyInPath
            && depthFromAnchor > -POST_HISTORY_THREAD_GRAPH_MAX_PARENT_DEPTH
            ? getNodeState(
                anchorEventId,
                parentTargetId,
                currentPubkey,
                nextPath,
                depthFromAnchor - 1,
                renderedEventIds,
            )
            : null;
        const renderableChildEventIds = depthFromAnchor < POST_HISTORY_THREAD_GRAPH_MAX_CHILD_DEPTH
            ? toRenderableChildEventIds(nodeEventId, nextPath, renderedEventIds)
            : [];
        const renderableChildReplyCount = renderableChildEventIds.length;
        const visibleChildren = expansion.visibleChildren && renderableChildReplyCount > 0;
        const replyNodeStates = visibleChildren
            ? renderableChildEventIds
                .map((childEventId) =>
                    getNodeState(
                        anchorEventId,
                        childEventId,
                        currentPubkey,
                        nextPath,
                        depthFromAnchor + 1,
                        renderedEventIds,
                    ))
                .filter((childState): childState is PostHistoryThreadGraphNodeState =>
                    childState !== null,
                )
            : [];

        return {
            anchorEventId,
            node,
            parentTargetId,
            parentNodeState,
            parentExpansion: expansion,
            parentAlreadyInPath,
            repliesActionState: {
                status: expansion.loadingChildren
                    ? "loading"
                    : expansion.childrenError
                        ? "failed"
                        : expansion.loadedChildren
                            ? "loaded"
                            : "unloaded",
                visible: visibleChildren,
                replies: renderableChildEventIds,
                replyCount: renderableChildReplyCount,
                error: expansion.childrenError,
            },
            replyNodeStates,
            isOwnReply: node.authorPubkey === currentPubkey,
            depthFromAnchor,
            cycleDetected: false,
        };
    }

    function getAnchorState(post: PostHistoryRecord): PostHistoryThreadGraphAnchorState {
        parentResolverRevision;

        const anchorNode = resolveNodeWithParentTargetSnapshot(nodesById[post.eventId])
            ?? buildAnchorNodeFromPost(post);
        const expansion = getExpansion(post.eventId, post.eventId);
        const currentPubkey = getPubkeyHex() ?? post.pubkeyHex;
        const renderedEventIds = new Set([post.eventId]);
        const parentTargetId = anchorNode.parentEventId;
        const parentNodeCandidate = parentTargetId
            ? resolveNodeWithParentTargetSnapshot(nodesById[parentTargetId] ?? null)
            : null;
        const parentNode = parentNodeCandidate
            && !isDeletedEvent(parentNodeCandidate.authorPubkey, parentNodeCandidate.eventId)
            ? parentNodeCandidate
            : null;
        const parentNodeState = parentNode && expansion.visibleParent
            ? getNodeState(post.eventId, parentNode.eventId, currentPubkey, [post.eventId], -1, renderedEventIds)
            : null;
        const renderableChildEventIds = toRenderableChildEventIds(
            post.eventId,
            [post.eventId],
            renderedEventIds,
        );
        const renderableChildEventIdSet = new Set(renderableChildEventIds);
        const replyItems = toReplyItems(post.eventId, currentPubkey)
            .filter((item) => renderableChildEventIdSet.has(item.event.id));
        const replyCount = renderableChildEventIds.length;
        const visibleChildren = expansion.visibleChildren && replyCount > 0;
        const replyNodeStates = visibleChildren
            ? renderableChildEventIds
                .map((eventId) =>
                    getNodeState(post.eventId, eventId, currentPubkey, [post.eventId], 1, renderedEventIds))
                .filter((nodeState): nodeState is PostHistoryThreadGraphNodeState =>
                    nodeState !== null,
                )
            : [];

        return {
            anchorEventId: post.eventId,
            parentTargetId,
            parentNode,
            parentNodeState,
            parentExpansion: expansion,
            repliesActionState: {
                status: expansion.loadingChildren
                    ? "loading"
                    : expansion.childrenError
                        ? "failed"
                        : expansion.loadedChildren
                            ? "loaded"
                            : "unloaded",
                visible: visibleChildren,
                replies: replyItems,
                replyCount,
                error: expansion.childrenError,
            },
            reactionSummary: getReactionSummary(post.eventId),
            reactionReadModel: getReactionReadModel(post.eventId),
            replyItems,
            replyNodeStates,
        };
    }

    function isDeletedEvent(authorPubkey: string | null | undefined, eventId: string | null | undefined): boolean {
        if (!authorPubkey || !eventId) {
            return false;
        }

        return !!deletedEventIdsByPubkey[authorPubkey]?.[eventId];
    }

    function isDeletedNodeEventId(eventId: string): boolean {
        const node = nodesById[eventId];
        return node ? isDeletedEvent(node.authorPubkey, eventId) : false;
    }

    function hideEvent(authorPubkey: string, eventId: string): void {
        if (!authorPubkey || !eventId || isDeletedEvent(authorPubkey, eventId)) {
            return;
        }

        deletedEventIdsByPubkey = {
            ...deletedEventIdsByPubkey,
            [authorPubkey]: {
                ...(deletedEventIdsByPubkey[authorPubkey] ?? {}),
                [eventId]: true,
            },
        };
    }

    function markParentDeletedForEvent(
        eventId: string,
        authorPubkey: string | null | undefined,
        options: { revealKnownParent?: boolean } = {},
    ): void {
        const affectedChildEventIds = new Set<string>();
        for (const [childEventId, parentEventId] of Object.entries(parentByChildId)) {
            if (parentEventId !== eventId) {
                continue;
            }

            const node = nodesById[eventId];
            if (authorPubkey && node && node.authorPubkey !== authorPubkey) {
                continue;
            }

            affectedChildEventIds.add(childEventId);
        }

        if (affectedChildEventIds.size === 0) {
            return;
        }

        for (const [key, current] of Object.entries(expansionByAnchorNodeKey)) {
            const separatorIndex = key.indexOf(":");
            if (separatorIndex < 0) {
                continue;
            }

            const anchorEventId = key.slice(0, separatorIndex);
            const nodeEventId = key.slice(separatorIndex + 1);
            if (!affectedChildEventIds.has(nodeEventId)) {
                continue;
            }

            if (!current?.loadedParent && !current?.visibleParent) {
                continue;
            }

            updateExpansion(anchorEventId, nodeEventId, (state) => {
                return buildParentLoadedExpansionState(state, {
                    visibleParent: options.revealKnownParent ? true : state.visibleParent,
                    parentDeleted: true,
                    lastFetchedParentAt: Date.now(),
                });
            });
        }
    }

    function markParentDeletedForTargets(
        deletedTargets: Map<string, Set<string>>,
        options: { revealKnownParent?: boolean } = {},
    ): void {
        for (const [authorPubkey, eventIds] of deletedTargets.entries()) {
            for (const eventId of eventIds) {
                markParentDeletedForEvent(eventId, authorPubkey, options);
            }
        }
    }

    function hideDeletedTargets(deletedTargets: Map<string, Set<string>>): void {
        let nextDeletedEventIdsByPubkey = deletedEventIdsByPubkey;
        let changed = false;
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
                changed = true;
            }

            if (nextEventIds !== currentEventIds) {
                nextDeletedEventIdsByPubkey = {
                    ...nextDeletedEventIdsByPubkey,
                    [authorPubkey]: nextEventIds,
                };
            }
        }

        if (changed) {
            deletedEventIdsByPubkey = nextDeletedEventIdsByPubkey;
            markParentDeletedForTargets(deletedTargets);
        }
    }

    function removeEventIdFromChildren(eventId: string): void {
        const nextChildrenByParentId: Record<string, string[]> = {};
        let changedChildren = false;
        for (const [parentEventId, childEventIds] of Object.entries(childrenByParentId)) {
            const nextChildEventIds = childEventIds.filter((childEventId) => childEventId !== eventId);
            nextChildrenByParentId[parentEventId] = nextChildEventIds;
            if (nextChildEventIds.length !== childEventIds.length) {
                changedChildren = true;
            }
        }

        if (changedChildren) {
            childrenByParentId = nextChildrenByParentId;
        }

        if (parentByChildId[eventId]) {
            const { [eventId]: _removed, ...nextParentByChildId } = parentByChildId;
            parentByChildId = nextParentByChildId;
        }
    }

    async function isHiddenOrDeletedEvent(
        event: NostrEvent,
        options: { checkPostHistoryRepository?: boolean } = {},
    ): Promise<boolean> {
        if (!event?.id) {
            return true;
        }

        if (isDeletedEvent(event.pubkey, event.id)) {
            return true;
        }

        if (options.checkPostHistoryRepository === false) {
            return false;
        }

        try {
            const record = await postHistoryRepositoryImpl.getByEventId(event.id);
            if (typeof record?.deletedAt === "number") {
                hideEvent(event.pubkey, event.id);
                removeEventIdFromChildren(event.id);
                return true;
            }
        } catch {
            // If the history lookup fails, keep the event visible; network/cache errors are handled elsewhere.
        }

        return false;
    }

    async function applyDeletedTargets(deletedTargets: Map<string, Set<string>>): Promise<void> {
        hideDeletedTargets(deletedTargets);
        for (const eventIds of deletedTargets.values()) {
            for (const eventId of eventIds) {
                removeEventIdFromChildren(eventId);
                await childInteractionsRepositoryImpl.deleteChildInteractionByEventId(eventId);
            }
        }
    }

    async function loadDeletedTargetsFromRepository(events: NostrEvent[]): Promise<void> {
        const deletedTargets = await deletionRequestsRepositoryImpl.getDeletedTargets(
            events.map((event) => ({
                targetAuthorPubkey: event.pubkey,
                targetEventId: event.id,
            })),
        );
        await applyDeletedTargets(deletedTargets);
    }

    async function fetchAndStoreDeletionRequests(
        anchorEventId: string,
        events: NostrEvent[],
        relayHints: string[],
        taskKeySuffix = "default",
    ): Promise<void> {
        if (events.length === 0) {
            return;
        }

        const rxNostr = getRxNostr();
        if (!rxNostr) {
            return;
        }

        const visibleEvents = events.filter((event) => !isDeletedEvent(event.pubkey, event.id));
        if (visibleEvents.length === 0) {
            return;
        }

        const key = `${anchorEventId}:deletions:${taskKeySuffix}`;
        const task = deletionFetchService.fetchDeletionRequests(rxNostr, {
            targets: visibleEvents.map((event) => ({
                event,
                relayUrls: nodesById[event.id]?.relayUrls ?? [],
            })),
            relayHints,
            relayConfig: getRelayConfig(),
        });
        taskTracker.replaceDeletionFetchTask(key, task);

        try {
            const result = await task.promise;
            if (!getShow()) {
                return;
            }

            await deletionRequestsRepositoryImpl.upsertValidDeletionRequests({
                targetEvents: visibleEvents,
                deletionEvents: result.events,
                fetchedAt: result.fetchedAt,
            });
        } catch {
            return;
        } finally {
            taskTracker.deleteDeletionFetchTask(key);
        }

        if (!getShow()) {
            return;
        }

        await loadDeletedTargetsFromRepository(visibleEvents);
    }

    async function filterVisibleReplyEvents(
        events: NostrEvent[],
    ): Promise<NostrEvent[]> {
        await loadDeletedTargetsFromRepository(events);
        const visibleEvents: NostrEvent[] = [];
        for (const event of events) {
            if (await isHiddenOrDeletedEvent(event)) {
                await childInteractionsRepositoryImpl.deleteChildInteractionByEventId(event.id);
                continue;
            }

            visibleEvents.push(event);
        }

        return visibleEvents;
    }

    async function filterVisibleReplyRecords(
        records: import("../storage/ehagakiDb").PostHistoryChildInteractionRecord[],
    ): Promise<import("../storage/ehagakiDb").PostHistoryChildInteractionRecord[]> {
        const events = records.map((record) => toEventFromReplyRecord(record));
        const visibleEvents = await filterVisibleReplyEvents(events);
        const visibleEventIds = new Set(visibleEvents.map((event) => event.id));
        const visibleRecords: import("../storage/ehagakiDb").PostHistoryChildInteractionRecord[] = [];
        for (const record of records) {
            if (!visibleEventIds.has(record.eventId)) {
                continue;
            }

            visibleRecords.push(record);
        }

        return visibleRecords;
    }

    async function filterVisibleReplyItems(
        items: Array<{ event: NostrEvent; relayUrls?: string[] }>,
    ): Promise<Array<{ event: NostrEvent; relayUrls?: string[] }>> {
        const visibleEvents = await filterVisibleReplyEvents(items.map((item) => item.event));
        const visibleEventIds = new Set(visibleEvents.map((event) => event.id));
        const visibleItems: Array<{ event: NostrEvent; relayUrls?: string[] }> = [];
        for (const item of items) {
            if (!visibleEventIds.has(item.event.id)) {
                continue;
            }

            visibleItems.push(item);
        }

        return visibleItems;
    }

    async function isVisibleParentEvent(input: {
        anchorEventId: string;
        event: NostrEvent;
        relayHints: string[];
        checkPostHistoryRepository?: boolean;
    }): Promise<boolean> {
        await loadDeletedTargetsFromRepository([input.event]);
        if (await isHiddenOrDeletedEvent(input.event, {
            checkPostHistoryRepository: input.checkPostHistoryRepository,
        })) {
            return false;
        }

        void fetchAndStoreDeletionRequests(
            input.anchorEventId,
            [input.event],
            input.relayHints,
        );
        return true;
    }

    function setParentDeleted(anchorEventId: string, nodeEventId: string = anchorEventId): void {
        clearParentLoadingDelayTimer(buildAnchorNodeKey(anchorEventId, nodeEventId));
        updateExpansion(anchorEventId, nodeEventId, (state) => ({
            ...buildParentLoadedExpansionState(state, {
                visibleParent: true,
                parentDeleted: true,
                lastFetchedParentAt: Date.now(),
            }),
        }));
    }

    async function displayCachedParentForNode(
        post: PostHistoryRecord,
        nodeEventId: string,
        currentNode: PostHistoryThreadGraphNode,
    ): Promise<boolean> {
        const parentEventId = currentNode.parentEventId;
        if (!parentEventId) {
            return false;
        }

        const parentSnapshot = resolver.getTargetSnapshot(parentEventId);
        if (parentSnapshot?.status === "deleted") {
            if (parentSnapshot.authorPubkey) {
                hideEvent(parentSnapshot.authorPubkey, parentEventId);
                markParentDeletedForEvent(parentEventId, parentSnapshot.authorPubkey, {
                    revealKnownParent: true,
                });
            }
            setParentDeleted(post.eventId, nodeEventId);
            return true;
        }

        const cachedParentNode = resolveNodeWithParentTargetSnapshot(nodesById[parentEventId] ?? null);
        if (cachedParentNode) {
            const parentContext = buildPostHistoryDirectReplyParentContext({
                event: cachedParentNode.event,
                relayHints: cachedParentNode.relayUrls,
            });
            if (
                !parentContext
                || !validatePostHistoryDirectReplyRelation({
                    child: currentNode.event,
                    parent: parentContext,
                }).valid
            ) {
                return false;
            }
            const relayHints = sanitizeRelayUrls([
                ...cachedParentNode.relayUrls,
                ...getParentRelayHints(post, currentNode),
            ]);
            const isVisibleCachedParent = await isVisibleParentEvent({
                anchorEventId: post.eventId,
                event: cachedParentNode.event,
                relayHints,
                checkPostHistoryRepository: cachedParentNode.authorPubkey === getPubkeyHex(),
            });
            if (!getShow()) {
                return false;
            }

            if (!isVisibleCachedParent) {
                setParentDeleted(post.eventId, nodeEventId);
                return true;
            }

            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...buildParentLoadedExpansionState(state, {
                    parentDeleted: state.parentDeleted,
                    lastFetchedParentAt:
                        parentSnapshot?.updatedAt ?? state.lastFetchedParentAt,
                }),
            }));
            return true;
        }

        if (!parentSnapshot) {
            return false;
        }

        if (parentSnapshot.authorPubkey && isDeletedEvent(parentSnapshot.authorPubkey, parentEventId)) {
            setParentDeleted(post.eventId, nodeEventId);
            return true;
        }

        if (parentSnapshot.status === "resolved" && parentSnapshot.event) {
            const parentContext = buildPostHistoryDirectReplyParentContext({
                event: parentSnapshot.event,
                relayHints: parentSnapshot.relayHints,
            });
            if (
                !parentContext
                || !validatePostHistoryDirectReplyRelation({
                    child: currentNode.event,
                    parent: parentContext,
                }).valid
            ) {
                return false;
            }
            const node = upsertNode({
                event: parentSnapshot.event,
                relayUrls: parentSnapshot.relayHints,
                sources: ["fetched-parent"],
                profile: parentSnapshot.profile,
            });
            upsertParentEdge(node.eventId, node.parentEventId);
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...buildParentLoadedExpansionState(state, {
                    parentDeleted: false,
                    lastFetchedParentAt:
                        parentSnapshot.updatedAt ?? state.lastFetchedParentAt,
                }),
            }));
            return true;
        }

        if (parentSnapshot.status === "not-found") {
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...buildParentLoadedExpansionState(state, {
                    parentMissing: true,
                    parentDeleted: false,
                    lastFetchedParentAt:
                        parentSnapshot.updatedAt ?? state.lastFetchedParentAt,
                }),
            }));
            return true;
        }

        return false;
    }

    async function revalidateParentForNodeInBackground(
        post: PostHistoryRecord,
        nodeEventId: string,
        currentNode: PostHistoryThreadGraphNode,
        options: { showInitialLoading?: boolean } = {},
    ): Promise<void> {
        const parentEventId = currentNode.parentEventId;
        if (!parentEventId) {
            return;
        }

        const activeRequestId = taskTracker.incrementRequestId();
        const key = buildAnchorNodeKey(post.eventId, nodeEventId);
        updateExpansion(post.eventId, nodeEventId, (state) => ({
            ...buildParentLoadingExpansionState(state, {
                showInitialLoading: !!options.showInitialLoading,
            }),
        }));
        if (options.showInitialLoading) {
            scheduleParentLoadingIndicator(post.eventId, nodeEventId);
        }

        await coordinateThreadGraphRevalidateTemplate({
            isActive: () => activeRequestId === taskTracker.getRequestId() && getShow(),
            cleanup: () => {
                clearParentLoadingDelayTimer(key);
            },
            onError: () => {
                applyParentRevalidateErrorState({
                    updateExpansion: (updater) => updateExpansion(post.eventId, nodeEventId, updater),
                    showInitialLoading: !!options.showInitialLoading,
                    errorCode: "fetch_failed",
                });
            },
            run: async ({ ensureActive }) => {
                const descriptor = buildParentTargetDescriptor(post, nodeEventId, currentNode);
                if (!descriptor) {
                    return;
                }

                const snapshot = await resolver.ensureTarget(descriptor, {
                    force: true,
                    background: !options.showInitialLoading,
                });
                if (!ensureActive()) {
                    return;
                }

                clearParentLoadingDelayTimer(key);
                if (!snapshot) {
                    return;
                }

                if (snapshot.status === "resolved" && snapshot.event) {
                    const parentContext = buildPostHistoryDirectReplyParentContext({
                        event: snapshot.event,
                        relayHints: snapshot.relayHints,
                    });
                    if (
                        !parentContext
                        || !validatePostHistoryDirectReplyRelation({
                            child: currentNode.event,
                            parent: parentContext,
                        }).valid
                    ) {
                        throw new Error("post_history_parent_relation_mismatch");
                    }
                }

                const parentStatus = resolveParentRevalidateStatus(snapshot);
                await coordinateThreadGraphStatusStrategy({
                    status: parentStatus,
                    strategies: createParentRevalidateStatusStrategies({
                        snapshot,
                        parentEventId,
                        showInitialLoading: !!options.showInitialLoading,
                        updateExpansion: (updater) => {
                            updateExpansion(post.eventId, nodeEventId, updater);
                        },
                        hideEvent,
                        markParentDeletedForEvent,
                        setParentDeleted: () => {
                            setParentDeleted(post.eventId, nodeEventId);
                        },
                        isDeletedEvent,
                        upsertNode: () => upsertNode({
                            event: snapshot.event!,
                            relayUrls: snapshot.relayHints,
                            sources: ["fetched-parent"],
                            profile: snapshot.profile,
                        }),
                        upsertParentEdge,
                    }),
                });
            },
        });
    }

    async function loadParentForNode(
        post: PostHistoryRecord,
        nodeEventId: string,
        options: { force?: boolean } = {},
    ): Promise<void> {
        const currentNode = nodeEventId === post.eventId
            ? ensureAnchorNode(post)
            : nodesById[nodeEventId];
        if (!currentNode?.parentEventId) {
            return;
        }

        const currentExpansion = getExpansion(post.eventId, nodeEventId);
        await coordinateThreadGraphNodeLoadExecution({
            loading: currentExpansion.loadingParent,
            revalidating: currentExpansion.revalidatingParent,
            onInFlight: () => {
                updateExpansion(post.eventId, nodeEventId, (state) => ({
                    ...state,
                    visibleParent: true,
                    showParentLoadingIndicator: false,
                }));
            },
            onLoadingInFlight: () => {
                scheduleParentLoadingIndicator(post.eventId, nodeEventId);
            },
            shouldHandleLoadedState: !options.force && currentExpansion.loadedParent,
            handleLoadedState: async () => {
                if (currentExpansion.parentDeleted) {
                    setParentDeleted(post.eventId, nodeEventId);
                    return true;
                }

                updateExpansion(post.eventId, nodeEventId, (state) => ({
                    ...state,
                    visibleParent: true,
                    showParentLoadingIndicator: false,
                }));
                const displayedParent = await displayCachedParentForNode(post, nodeEventId, currentNode);
                if (shouldRunThreadGraphBackgroundRevalidate({
                    hasVisibleData: displayedParent,
                    lastFetchedAt: currentExpansion.lastFetchedParentAt,
                    ttlMs: POST_HISTORY_THREAD_GRAPH_REVALIDATE_TTL_MS,
                })) {
                    void revalidateParentForNodeInBackground(post, nodeEventId, currentNode);
                }
                return true;
            },
            prepareFreshLoadState: () => {
                updateExpansion(post.eventId, nodeEventId, (state) => ({
                    ...state,
                    visibleParent: true,
                    loadingParent: true,
                    parentError: null,
                    parentMissing: false,
                    parentDeleted: false,
                    showParentLoadingIndicator: false,
                }));
                scheduleParentLoadingIndicator(post.eventId, nodeEventId);
            },
            displayCachedForFreshLoad: async () => {
                const displayedCachedParent = await displayCachedParentForNode(post, nodeEventId, currentNode);
                const latestExpansion = getExpansion(post.eventId, nodeEventId);
                return {
                    displayedCached: displayedCachedParent,
                    lastFetchedAt: latestExpansion.lastFetchedParentAt,
                };
            },
            force: !!options.force,
            ttlMs: POST_HISTORY_THREAD_GRAPH_REVALIDATE_TTL_MS,
            awaitWhenInitialLoading: true,
            runRevalidate: ({ showInitialLoading }) => revalidateParentForNodeInBackground(
                post,
                nodeEventId,
                currentNode,
                { showInitialLoading },
            ),
        });
    }

    async function loadParent(post: PostHistoryRecord, options: { force?: boolean } = {}): Promise<void> {
        await loadParentForNode(post, post.eventId, options);
    }

    function hideParent(post: PostHistoryRecord): void {
        hideParentForNode(post.eventId, post.eventId);
    }

    function hideParentForNode(anchorEventId: string, nodeEventId: string): void {
        clearParentLoadingDelayTimer(buildAnchorNodeKey(anchorEventId, nodeEventId));
        updateExpansion(anchorEventId, nodeEventId, (state) => ({
            ...state,
            visibleParent: false,
            showParentLoadingIndicator: false,
        }));
    }

    async function toggleParent(post: PostHistoryRecord): Promise<void> {
        const expansion = getExpansion(post.eventId, post.eventId);
        if (expansion.visibleParent) {
            hideParent(post);
            return;
        }

        await loadParent(post);
    }

    function retryParent(post: PostHistoryRecord): void {
        void loadParent(post, { force: true });
    }

    async function toggleNodeParent(post: PostHistoryRecord, nodeEventId: string): Promise<void> {
        const expansion = getExpansion(post.eventId, nodeEventId);
        if (expansion.visibleParent) {
            hideParentForNode(post.eventId, nodeEventId);
            return;
        }

        await loadParentForNode(post, nodeEventId);
    }

    function retryNodeParent(post: PostHistoryRecord, nodeEventId: string): void {
        void loadParentForNode(post, nodeEventId, { force: true });
    }

    function resolveCachedReplyFetchedAt(records: PostHistoryChildInteractionRecord[]): number | null {
        const fetchedAtValues = records
            .map((record) => record.fetchedAt)
            .filter((value) => Number.isFinite(value));
        return fetchedAtValues.length > 0
            ? Math.max(...fetchedAtValues)
            : null;
    }

    async function displayCachedChildrenForNode(
        post: PostHistoryRecord,
        nodeEventId: string,
        currentNode: PostHistoryThreadGraphNode,
        options: { prefetchOnly?: boolean } = {},
    ): Promise<boolean> {
        const rawCachedRecords = await directReplyRecordsAdapterImpl.getDirectReplyRecords(nodeEventId);
        void fetchAndStoreDeletionRequests(
            post.eventId,
            rawCachedRecords.map((record) => toEventFromReplyRecord(record)),
            getChildrenRelayHints(post, currentNode),
        );

        const cachedRecords = await filterVisibleReplyRecords(rawCachedRecords);
        if (!getShow() || cachedRecords.length === 0) {
            return false;
        }

        const acceptedRecords = await upsertReplyRecords(currentNode, cachedRecords, ["reply-db"], {
            resolveProfiles: !options.prefetchOnly,
        });
        if (!getShow() || acceptedRecords.length === 0) {
            return false;
        }
        if (!getShow()) {
            return true;
        }

        updateExpansion(post.eventId, nodeEventId, (state) => ({
            ...buildChildrenLoadedExpansionState(state, {
                visibleChildren: options.prefetchOnly ? state.visibleChildren : true,
                lastFetchedChildrenAt:
                    resolveCachedReplyFetchedAt(acceptedRecords)
                    ?? state.lastFetchedChildrenAt,
            }),
        }));
        return true;
    }

    async function revalidateChildrenForNodeInBackground(
        post: PostHistoryRecord,
        nodeEventId: string,
        currentNode: PostHistoryThreadGraphNode,
        options: { prefetchOnly?: boolean; showInitialLoading?: boolean } = {},
    ): Promise<void> {
        const key = buildAnchorNodeKey(post.eventId, nodeEventId);
        const activeGraphRequestId = taskTracker.getRequestId();
        const activeChildRequestId = taskTracker.createChildRequestToken(key);
        updateExpansion(post.eventId, nodeEventId, (state) => ({
            ...buildChildrenLoadingExpansionState(state, {
                showInitialLoading: !!options.showInitialLoading,
                prefetchOnly: !!options.prefetchOnly,
            }),
        }));

        await coordinateThreadGraphRevalidateTemplate({
            isActive: () => (
                activeGraphRequestId === taskTracker.getRequestId() &&
                taskTracker.getChildRequestToken(key) === activeChildRequestId &&
                getShow()
            ),
            cleanup: () => {
                taskTracker.deleteChildrenFetchTask(key);
                taskTracker.deleteChildRequestToken(key);
            },
            onError: () => {
                applyChildrenRevalidateErrorState({
                    updateExpansion: (updater) => updateExpansion(post.eventId, nodeEventId, updater),
                    showInitialLoading: !!options.showInitialLoading,
                    prefetchOnly: !!options.prefetchOnly,
                    errorCode: "fetch_failed",
                });
            },
            run: async ({ ensureActive }) => {
                const rxNostr = getRxNostr();
                if (!rxNostr) {
                    updateExpansion(post.eventId, nodeEventId, (state) => ({
                        ...buildChildrenFailedExpansionState(state, {
                            nextError:
                                options.showInitialLoading && !options.prefetchOnly
                                    ? "nostr_not_ready"
                                    : null,
                        }),
                    }));
                    return;
                }

                const task = replyFetchService.fetchDirectReplies(rxNostr, {
                    eventId: nodeEventId,
                    createdAt: currentNode.event.created_at,
                    relayHints: getChildrenRelayHints(post, currentNode),
                    parents: [buildPostHistoryDirectReplyParentContext({
                        event: currentNode.event,
                        relayHints: getChildrenRelayHints(post, currentNode),
                    })].filter((context) => context !== null),
                    relayConfig: getRelayConfig(),
                });
                taskTracker.replaceChildrenFetchTask(key, task);

                const result = await task.promise;
                taskTracker.deleteChildrenFetchTask(key);
                if (!ensureActive()) {
                    return;
                }
                assertPostHistoryReplyFetchDidNotFail(result.status);

                void fetchAndStoreDeletionRequests(
                    post.eventId,
                    result.events.map((item) => item.event),
                    [
                        ...getChildrenRelayHints(post, currentNode),
                        ...result.relayUrls,
                    ],
                );
                const fetchedEvents = await filterVisibleReplyItems(result.events);
                if (result.events.length > 0) {
                    await childInteractionsRepositoryImpl.upsertChildInteractions({
                        parentEventId: nodeEventId,
                        events: fetchedEvents,
                        fetchedAt: result.fetchedAt,
                    });
                }

                const nextRecords = await filterVisibleReplyRecords(
                    await directReplyRecordsAdapterImpl.getDirectReplyRecords(nodeEventId),
                );
                if (!ensureActive()) {
                    return;
                }

                if (nextRecords.length > 0) {
                    await upsertReplyRecords(currentNode, nextRecords, ["reply-db", "fetched-child"], {
                        resolveProfiles: !options.prefetchOnly,
                    });
                }

                const childrenStatus = resolveChildrenRevalidateStatus({
                    nextRecordsLength: nextRecords.length,
                    resultEventsLength: result.events.length,
                });
                await coordinateThreadGraphStatusStrategy({
                    status: childrenStatus,
                    strategies: createChildrenRevalidateStatusStrategies({
                        fetchedAt: result.status === "partial" ? null : result.fetchedAt,
                        prefetchOnly: !!options.prefetchOnly,
                        updateExpansion: (updater) => {
                            updateExpansion(post.eventId, nodeEventId, updater);
                        },
                        prefetchChildReplyCounts: () => {
                            void prefetchChildReplyCounts(post, nodeEventId);
                        },
                    }),
                });
            },
        });
    }

    function handleActiveChildRequest(
        post: PostHistoryRecord,
        nodeEventId: string,
        prefetchOnly: boolean,
    ): boolean {
        const requestKey = buildAnchorNodeKey(post.eventId, nodeEventId);
        if (taskTracker.getChildRequestToken(requestKey) === undefined) {
            return false;
        }

        if (!prefetchOnly) {
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                visibleChildren: toVisibleChildEventIds(nodeEventId).length > 0,
            }));
        }
        return true;
    }

    function resolveChildParentNode(
        post: PostHistoryRecord,
        nodeEventId: string,
    ): PostHistoryThreadGraphNode | undefined {
        return nodeEventId === post.eventId
            ? ensureAnchorNode(post)
            : nodesById[nodeEventId];
    }

    async function loadChildrenForNode(
        post: PostHistoryRecord,
        nodeEventId: string,
        options: { force?: boolean; prefetchOnly?: boolean } = {},
    ): Promise<void> {
        const currentNode = resolveChildParentNode(post, nodeEventId);
        if (!currentNode) {
            return;
        }

        if (handleActiveChildRequest(post, nodeEventId, !!options.prefetchOnly)) {
            return;
        }

        const currentExpansion = getExpansion(post.eventId, nodeEventId);
        await coordinateThreadGraphNodeLoadExecution({
            loading: currentExpansion.loadingChildren,
            revalidating: currentExpansion.revalidatingChildren,
            onInFlight: options.prefetchOnly
                ? () => undefined
                : () => {
                    updateExpansion(post.eventId, nodeEventId, (state) => ({
                        ...state,
                        visibleChildren: true,
                    }));
                },
            shouldHandleLoadedState: !options.force && currentExpansion.loadedChildren,
            handleLoadedState: async () => {
                if (options.prefetchOnly) {
                    return true;
                }

                const hasReplies = toVisibleChildEventIds(nodeEventId).length > 0;
                updateExpansion(post.eventId, nodeEventId, (state) => ({
                    ...state,
                    visibleChildren: hasReplies,
                }));
                if (hasReplies) {
                    void prefetchChildReplyCounts(post, nodeEventId);
                }
                if (shouldRunThreadGraphBackgroundRevalidate({
                    hasVisibleData: hasReplies,
                    lastFetchedAt: currentExpansion.lastFetchedChildrenAt,
                    ttlMs: POST_HISTORY_THREAD_GRAPH_REVALIDATE_TTL_MS,
                })) {
                    void revalidateChildrenForNodeInBackground(post, nodeEventId, currentNode);
                }
                return true;
            },
            prepareFreshLoadState: () => undefined,
            displayCachedForFreshLoad: async () => {
                const displayedCachedChildren = await displayCachedChildrenForNode(post, nodeEventId, currentNode, options);
                const latestExpansion = getExpansion(post.eventId, nodeEventId);
                return {
                    displayedCached: displayedCachedChildren,
                    lastFetchedAt: latestExpansion.lastFetchedChildrenAt,
                };
            },
            force: !!options.force,
            ttlMs: POST_HISTORY_THREAD_GRAPH_REVALIDATE_TTL_MS,
            prefetchOnly: !!options.prefetchOnly,
            awaitWhenInitialLoading: false,
            onSkipPrefetchReplyCounts: () => {
                void prefetchChildReplyCounts(post, nodeEventId);
            },
            runRevalidate: ({ showInitialLoading }) => revalidateChildrenForNodeInBackground(
                post,
                nodeEventId,
                currentNode,
                {
                    prefetchOnly: options.prefetchOnly,
                    showInitialLoading,
                },
            ),
        });
    }

    async function loadChildren(post: PostHistoryRecord, options: { force?: boolean } = {}): Promise<void> {
        await loadChildrenForNode(post, post.eventId, options);
    }

    async function prefetchChildReplyCounts(
        post: PostHistoryRecord,
        parentNodeEventId: string,
    ): Promise<void> {
        const prefetchKey = buildAnchorNodeKey(post.eventId, parentNodeEventId);
        if (childReplyCountPrefetchKeys.has(prefetchKey)) {
            return;
        }

        childReplyCountPrefetchKeys.add(prefetchKey);
        try {
            await prefetchChildReplyCountsInternal(post, parentNodeEventId);
        } finally {
            childReplyCountPrefetchKeys.delete(prefetchKey);
        }
    }

    async function prefetchChildReplyCountsInternal(
        post: PostHistoryRecord,
        parentNodeEventId: string,
    ): Promise<void> {
        const now = Date.now();
        const candidateEventIds = toVisibleChildEventIds(parentNodeEventId)
            .filter((eventId) => {
                const expansion = getExpansion(post.eventId, eventId);
                const recentlyChecked = typeof expansion.lastFetchedChildrenAt === "number" &&
                    now - expansion.lastFetchedChildrenAt < POST_HISTORY_CHILD_REPLY_PREFETCH_FRESH_MS;
                return !expansion.loadedChildren
                    && !expansion.loadingChildren
                    && !expansion.revalidatingChildren
                    && !recentlyChecked;
            });
        if (candidateEventIds.length === 0) {
            return;
        }

        const remainingEventIds: string[] = [];
        await Promise.all(candidateEventIds.map(async (eventId) => {
            if (!getShow()) {
                return;
            }

            const hasCachedReplies = await prefetchChildrenFromCache(post, eventId);
            if (!hasCachedReplies) {
                remainingEventIds.push(eventId);
            }
        }));
        remainingEventIds.splice(POST_HISTORY_CHILD_REPLY_PREFETCH_LIMIT);
        if (!getShow() || remainingEventIds.length === 0) {
            return;
        }

        const batches: string[][] = [];
        for (let index = 0; index < remainingEventIds.length; index += POST_HISTORY_CHILD_REPLY_PREFETCH_BATCH_SIZE) {
            batches.push(remainingEventIds.slice(index, index + POST_HISTORY_CHILD_REPLY_PREFETCH_BATCH_SIZE));
        }

        let nextBatchIndex = 0;
        const workerCount = Math.min(POST_HISTORY_CHILD_REPLY_PREFETCH_CONCURRENCY, batches.length);
        const runWorker = async (): Promise<void> => {
            while (getShow()) {
                const index = nextBatchIndex;
                nextBatchIndex += 1;
                const batchEventIds = batches[index];
                if (!batchEventIds) {
                    return;
                }

                await prefetchChildrenBatch(post, batchEventIds);
            }
        };

        await Promise.all(Array.from({ length: workerCount }, () => runWorker()));
    }

    async function prefetchChildrenFromCache(
        post: PostHistoryRecord,
        nodeEventId: string,
    ): Promise<boolean> {
        const rawCachedRecords = await directReplyRecordsAdapterImpl.getDirectReplyRecords(nodeEventId);
        if (!getShow()) {
            return false;
        }

        const cachedRecords = await filterVisibleReplyRecords(rawCachedRecords);
        if (!getShow() || cachedRecords.length === 0) {
            return false;
        }

        const parentNode = nodesById[nodeEventId];
        if (!parentNode) {
            return false;
        }
        const acceptedRecords = await upsertReplyRecords(parentNode, cachedRecords, ["reply-db"], {
            resolveProfiles: false,
        });
        if (!getShow() || acceptedRecords.length === 0) {
            return false;
        }
        if (!getShow()) {
            return true;
        }

        updateExpansion(post.eventId, nodeEventId, (state) => ({
            ...buildChildrenLoadedExpansionState(state, {
                lastFetchedChildrenAt: Date.now(),
            }),
        }));
        return true;
    }

    function preloadCachedReactionSummaryForParent(
        parentEventId: string,
        cachedRecords: PostHistoryChildInteractionRecord[],
    ): void {
        setReactionSummary(parentEventId, cachedRecords);
        setReactionRecords(parentEventId, cachedRecords);
    }

    async function preloadCachedDirectReplyStateForParent(input: {
        post: PostHistoryRecord;
        parentEventId: string;
        cachedRecords: PostHistoryChildInteractionRecord[];
        anchorNode: PostHistoryThreadGraphNode;
        ensureActive: () => boolean;
    }): Promise<void> {
        const cachedDirectReplies = input.cachedRecords.filter(
            (record) => record.kind === 1 || record.kind === 42,
        );
        if (cachedDirectReplies.length === 0) {
            return;
        }

        const acceptedRecords = await upsertReplyRecords(
            input.anchorNode,
            cachedDirectReplies,
            ["reply-db", "inbound-sync"],
            {
            resolveProfiles: false,
            },
        );
        if (!input.ensureActive() || acceptedRecords.length === 0) {
            return;
        }

        updateExpansion(input.post.eventId, input.parentEventId, (state) => ({
            ...buildChildrenLoadedExpansionState(state, {
                lastFetchedChildrenAt:
                    resolveCachedReplyFetchedAt(acceptedRecords)
                    ?? state.lastFetchedChildrenAt,
            }),
        }));
        refreshProfileForPubkeyInBackground(input.anchorNode.authorPubkey, input.anchorNode.relayUrls);
    }

    async function loadCachedChildInteractionStateForPosts(
        posts: PostHistoryRecord[],
        parentEventIds?: string[],
    ): Promise<void> {
        if (!getShow() || posts.length === 0) {
            return;
        }

        const targetParentIds = resolvePostHistoryReplyBadgePreloadParentIds(posts, parentEventIds);
        if (targetParentIds.length === 0) {
            return;
        }

        const activeRequestId = taskTracker.getRequestId();
        const isTargetedRefresh = !!parentEventIds?.length;
        const postByEventId = new Map(posts.map((post) => [post.eventId, post]));

        await coordinateThreadGraphBatchLifecycle({
            items: targetParentIds,
            isActive: () => activeRequestId === taskTracker.getRequestId() && getShow(),
            run: async ({ ensureActive }) => {
                for (const parentEventId of targetParentIds) {
                    const post = postByEventId.get(parentEventId);
                    if (!post || !ensureActive()) {
                        continue;
                    }

                    const preloadKey = buildAnchorNodeKey(post.eventId, parentEventId);
                    const expansion = getExpansion(post.eventId, parentEventId);
                    if (
                        !isTargetedRefresh
                        && (
                            replyBadgePreloadKeys.has(preloadKey)
                            || expansion.loadedChildren
                            || expansion.loadingChildren
                            || expansion.revalidatingChildren
                        )
                    ) {
                        replyBadgePreloadKeys.add(preloadKey);
                        continue;
                    }

                    replyBadgePreloadKeys.add(preloadKey);

                    const anchorNode = ensureAnchorNode(post);
                    const [rawCachedReactionRecords, rawCachedDirectReplyRecords] = await Promise.all([
                        selectPostHistoryReactionRecords(parentEventId, reactionRecordsAdapterImpl),
                        directReplyRecordsAdapterImpl.getDirectReplyRecords(parentEventId),
                    ]);
                    if (!ensureActive()) {
                        continue;
                    }

                    const [cachedReactionRecords, cachedDirectReplyRecords] = await Promise.all([
                        filterVisibleReplyRecords(rawCachedReactionRecords),
                        filterVisibleReplyRecords(rawCachedDirectReplyRecords),
                    ]);
                    if (!ensureActive()) {
                        continue;
                    }

                    preloadCachedReactionSummaryForParent(parentEventId, cachedReactionRecords);

                    const reactionAuthorPubkeys = Array.from(new Set(
                        cachedReactionRecords
                            .map((record) => record.authorPubkey)
                            .filter((pubkey): pubkey is string => !!pubkey),
                    ));
                    if (reactionAuthorPubkeys.length > 0) {
                        const cachedProfilesByPubkey = await profileMetadataCache.getProfiles(
                            reactionAuthorPubkeys,
                            {
                                allowBackgroundRefresh: false,
                            },
                        );
                        if (!ensureActive()) {
                            continue;
                        }

                        for (const pubkey of reactionAuthorPubkeys) {
                            const profile = cachedProfilesByPubkey[pubkey] ?? null;
                            setReactionProfile(pubkey, profile);
                            refreshProfileForPubkeyInBackground(
                                pubkey,
                                anchorNode.relayUrls,
                            );
                        }
                    }

                    await preloadCachedDirectReplyStateForParent({
                        post,
                        parentEventId,
                        cachedRecords: cachedDirectReplyRecords,
                        anchorNode,
                        ensureActive,
                    });
                }
            },
        });
    }

    async function prefetchChildrenBatch(
        post: PostHistoryRecord,
        batchEventIds: string[],
    ): Promise<void> {
        const batchNodes = batchEventIds
            .map((eventId) => nodesById[eventId])
            .filter((node): node is PostHistoryThreadGraphNode => !!node);
        if (batchNodes.length === 0) {
            return;
        }

        const activeGraphRequestId = taskTracker.getRequestId();
        const requestTokens = new Map<string, number>();
        let completedFetchAt: number | null = null;

        const taskKey = `${post.eventId}:children-prefetch:${batchEventIds.join(",")}`;
        const isPrefetchBatchActive = (): boolean => {
            if (activeGraphRequestId !== taskTracker.getRequestId() || !getShow()) {
                return false;
            }

            return batchEventIds.every((eventId) =>
                taskTracker.getChildRequestToken(buildAnchorNodeKey(post.eventId, eventId)) === requestTokens.get(eventId),
            );
        };

        const applyPrefetchBatchErrorState = (errorCode: string): void => {
            for (const eventId of batchEventIds) {
                applyChildrenRevalidateErrorState({
                    updateExpansion: (updater) => updateExpansion(post.eventId, eventId, updater),
                    showInitialLoading: false,
                    prefetchOnly: true,
                    errorCode,
                });
            }
        };

        await coordinateThreadGraphBatchLifecycle({
            items: batchEventIds,
            isActive: isPrefetchBatchActive,
            prepareItem: (eventId) => {
                const key = buildAnchorNodeKey(post.eventId, eventId);
                const activeChildRequestId = taskTracker.createChildRequestToken(key);
                requestTokens.set(eventId, activeChildRequestId);
                updateExpansion(post.eventId, eventId, (state) => ({
                    ...buildChildrenLoadingExpansionState(state, {
                        showInitialLoading: false,
                        prefetchOnly: true,
                    }),
                }));
                return activeChildRequestId;
            },
            completeBatch: (loadedChildren) => {
                if (!loadedChildren) {
                    return;
                }

                if (!isPrefetchBatchActive()) {
                    return;
                }

                for (const eventId of batchEventIds) {
                    updateExpansion(post.eventId, eventId, (state) => ({
                        ...buildChildrenLoadedExpansionState(state, {
                            loadedChildren,
                            revalidatingChildren: false,
                            lastFetchedChildrenAt: completedFetchAt,
                        }),
                    }));
                }
            },
            cleanupItem: (eventId, activeChildRequestId) => {
                const key = buildAnchorNodeKey(post.eventId, eventId);
                if (taskTracker.getChildRequestToken(key) === activeChildRequestId) {
                    taskTracker.deleteChildRequestToken(key);
                }
            },
            cleanup: () => {
                taskTracker.deleteChildrenFetchTask(taskKey);
            },
            onError: () => {
                applyPrefetchBatchErrorState("fetch_failed");
            },
            run: async ({ ensureActive }) => {
                const rxNostr = getRxNostr();
                if (!rxNostr) {
                    applyPrefetchBatchErrorState("nostr_not_ready");
                    return;
                }

                const relayHints = getChildrenPrefetchRelayHints(post, batchNodes);
                const task = replyFetchService.fetchDirectReplies(rxNostr, {
                    eventId: batchEventIds[0] ?? "",
                    eventIds: batchEventIds,
                    createdAt: Math.min(...batchNodes.map((node) => node.event.created_at)),
                    relayHints,
                    parents: batchNodes
                        .map((node) => buildPostHistoryDirectReplyParentContext({
                            event: node.event,
                            relayHints: [
                                ...node.relayUrls,
                                ...parsePostHistoryThreadReferences(node.event).relayHints,
                            ],
                        }))
                        .filter((context) => context !== null),
                    relayConfig: getRelayConfig(),
                });
                taskTracker.replaceChildrenFetchTask(taskKey, task);

                const result = await task.promise;
                taskTracker.deleteChildrenFetchTask(taskKey);
                if (!ensureActive()) {
                    return;
                }
                assertPostHistoryReplyFetchDidNotFail(result.status);
                completedFetchAt = result.status === "partial" ? null : result.fetchedAt;
                for (const eventId of batchEventIds) {
                    updateExpansion(post.eventId, eventId, (state) => ({
                        ...buildChildrenLoadedExpansionState(state, {
                            revalidatingChildren: false,
                            lastFetchedChildrenAt: completedFetchAt,
                        }),
                    }));
                }

                const batchEventIdSet = new Set(batchEventIds);
                const directReplyItems = result.events.filter((item) => {
                    return batchEventIdSet.has(item.parentEventId)
                        && item.event.id !== item.parentEventId;
                });
                if (directReplyItems.length > 0) {
                    await fetchAndStoreDeletionRequests(
                        post.eventId,
                        directReplyItems.map((item) => item.event),
                        [...relayHints, ...result.relayUrls],
                        `children-prefetch:${batchEventIds.join(",")}`,
                    );
                }
                const visibleItems = await filterVisibleReplyItems(directReplyItems);
                if (!ensureActive()) {
                    return;
                }

                const itemsByParentId = new Map<string, typeof visibleItems>();
                const parentIdByEventId = new Map(
                    directReplyItems.map((item) => [item.event.id, item.parentEventId]),
                );
                for (const item of visibleItems) {
                    const parentId = parentIdByEventId.get(item.event.id);
                    if (!parentId || !batchEventIdSet.has(parentId)) {
                        continue;
                    }

                    const items = itemsByParentId.get(parentId) ?? [];
                    items.push(item);
                    itemsByParentId.set(parentId, items);
                }

                for (const eventId of batchEventIds) {
                    const items = itemsByParentId.get(eventId) ?? [];
                    if (items.length > 0) {
                        await childInteractionsRepositoryImpl.upsertChildInteractions({
                            parentEventId: eventId,
                            events: items,
                            fetchedAt: result.fetchedAt,
                        });
                    }

                    const nextRecords = await filterVisibleReplyRecords(
                        await directReplyRecordsAdapterImpl.getDirectReplyRecords(eventId),
                    );
                    const parentNode = nodesById[eventId];
                    if (!parentNode) {
                        continue;
                    }
                    await upsertReplyRecords(parentNode, nextRecords, ["reply-db", "fetched-child"], {
                        resolveProfiles: false,
                    });
                }
                if (!ensureActive()) {
                    return;
                }
            },
        });
    }

    async function upsertReplyRecords(
        parentNode: PostHistoryThreadGraphNode,
        records: PostHistoryChildInteractionRecord[],
        sources: PostHistoryThreadGraphSource[],
        options: { resolveProfiles?: boolean } = {},
    ): Promise<PostHistoryChildInteractionRecord[]> {
        const parentEventId = parentNode.eventId;
        const childIds: string[] = [];
        const acceptedRecords: PostHistoryChildInteractionRecord[] = [];
        const shouldResolveProfiles = options.resolveProfiles !== false;
        for (const record of records) {
            const event = toEventFromReplyRecord(record);
            if (!isValidPostHistoryCachedDirectReply({ parentNode, record })) {
                await childInteractionsRepositoryImpl.deleteChildInteractionByEventId(record.eventId);
                continue;
            }
            if (isDeletedEvent(event.pubkey, event.id)) {
                continue;
            }

            const node = shouldResolveProfiles
                ? await upsertNodeWithProfile({
                    event,
                    relayUrls: record.relayUrls,
                    sources,
                })
                : upsertNode({
                    event,
                    relayUrls: sanitizeRelayUrls(record.relayUrls),
                    sources,
                });
            if (!shouldResolveProfiles) {
                refreshProfileForPubkeyInBackground(
                    event.pubkey,
                    sanitizeRelayUrls(record.relayUrls),
                );
            }
            if (node.eventId === parentEventId) {
                continue;
            }
            upsertParentEdge(node.eventId, parentEventId);
            childIds.push(node.eventId);
            acceptedRecords.push(record);
        }

        upsertChildren(parentEventId, childIds);
        return acceptedRecords;
    }

    function hideChildren(post: PostHistoryRecord): void {
        hideChildrenForNode(post.eventId, post.eventId);
    }

    function hideChildrenForNode(anchorEventId: string, nodeEventId: string): void {
        updateExpansion(anchorEventId, nodeEventId, (state) => ({
            ...state,
            visibleChildren: false,
        }));
    }

    function toggleChildren(post: PostHistoryRecord): void {
        const expansion = getExpansion(post.eventId, post.eventId);
        if (expansion.visibleChildren) {
            hideChildren(post);
            return;
        }

        void loadChildren(post);
    }

    function retryChildren(post: PostHistoryRecord): void {
        void loadChildren(post, { force: true });
    }

    function toggleNodeChildren(post: PostHistoryRecord, nodeEventId: string): void {
        const expansion = getExpansion(post.eventId, nodeEventId);
        if (expansion.visibleChildren) {
            hideChildrenForNode(post.eventId, nodeEventId);
            return;
        }

        void loadChildrenForNode(post, nodeEventId);
    }

    function retryNodeChildren(post: PostHistoryRecord, nodeEventId: string): void {
        void loadChildrenForNode(post, nodeEventId, { force: true });
    }

    async function recordPostedReply(
        event: NostrEvent | null | undefined,
        posts: PostHistoryRecord[] = [],
    ): Promise<boolean> {
        if (!event?.id || (event.kind !== 1 && event.kind !== 42)) {
            return true;
        }

        const references = parsePostHistoryThreadReferences(event);
        const parentEventId = references.parentId;
        if (!parentEventId) {
            return true;
        }

        const parentPost = posts.find((post) => post.eventId === parentEventId) ?? null;
        const parentExpansionKeys = Object.keys(expansionByAnchorNodeKey).filter((key) =>
            key.endsWith(`:${parentEventId}`),
        );
        if (!parentPost && parentExpansionKeys.length === 0) {
            return false;
        }

        const resolvedParentSnapshot = resolver.getTargetSnapshot(parentEventId);
        const parentNode = parentPost
            ? nodesById[parentEventId] ?? buildThreadGraphNode({
                event: toEventFromPostHistoryRecord(parentPost),
                relayUrls: sanitizeRelayUrls([
                    ...parentPost.relayHints,
                    ...parentPost.acceptedRelays,
                    ...(parentPost.fetchedRelays ?? []),
                ]),
                sources: ["history-record"],
            })
            : nodesById[parentEventId]
                ?? (resolvedParentSnapshot?.status === "resolved" && resolvedParentSnapshot.event
                    ? buildThreadGraphNode({
                        event: resolvedParentSnapshot.event,
                        relayUrls: resolvedParentSnapshot.relayHints,
                        sources: ["fetched-parent"],
                    })
                    : null);
        if (!parentNode) {
            return false;
        }
        const parentContext = buildPostHistoryDirectReplyParentContext({
            event: parentNode.event,
            relayHints: parentNode.relayUrls,
        });
        if (
            !parentContext
            || !validatePostHistoryDirectReplyRelation({ child: event, parent: parentContext }).valid
        ) {
            return false;
        }

        if ((await filterVisibleReplyEvents([event])).length === 0) {
            return false;
        }

        await childInteractionsRepositoryImpl.upsertChildInteractions({
            parentEventId,
            events: [
                {
                    event,
                    relayUrls: references.relayHints,
                },
            ],
        });

        const nextRecords = await filterVisibleReplyRecords(
            await directReplyRecordsAdapterImpl.getDirectReplyRecords(parentEventId),
        );
        if (!getShow()) {
            return false;
        }

        await upsertReplyRecords(parentNode, nextRecords, ["reply-db", "posted-reply"]);
        const updateParentChildrenState = (anchorEventId: string, nodeEventId: string) => {
            updateExpansion(anchorEventId, nodeEventId, (state) => ({
                ...state,
                loadedChildren: true,
                loadingChildren: false,
                childrenError: null,
            }));
        };
        if (parentPost) {
            updateParentChildrenState(parentPost.eventId, parentPost.eventId);
        }
        for (const key of parentExpansionKeys) {
            const separatorIndex = key.indexOf(":");
            if (separatorIndex < 0) {
                continue;
            }

            updateParentChildrenState(
                key.slice(0, separatorIndex),
                key.slice(separatorIndex + 1),
            );
        }

        return true;
    }

    async function recordDeletedEvent(input: {
        eventId: string;
        authorPubkey: string;
        deletionEvent?: NostrEvent | null;
    }): Promise<void> {
        if (!input.eventId || !input.authorPubkey) {
            return;
        }

        hideEvent(input.authorPubkey, input.eventId);
        removeEventIdFromChildren(input.eventId);
        markParentDeletedForEvent(input.eventId, input.authorPubkey, { revealKnownParent: true });
        if (input.deletionEvent) {
            await deletionRequestsRepositoryImpl.upsertValidDeletionRequests({
                targetEvents: [{
                    id: input.eventId,
                    pubkey: input.authorPubkey,
                    kind: 1,
                    content: "",
                    tags: [],
                    created_at: input.deletionEvent.created_at,
                    sig: "",
                }],
                deletionEvents: [{ event: input.deletionEvent }],
                fetchedAt: Date.now(),
            });
        }
        await childInteractionsRepositoryImpl.deleteChildInteractionByEventId(input.eventId);
    }

    $effect(() => {
        if (!getShow()) {
            return;
        }

        parentResolverRevision = resolver.getScopeRevision(parentResolverScopeKey);
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        parentResolverRevision;
        for (const anchorNodeKey of Object.keys(expansionByAnchorNodeKey)) {
            const [anchorEventId, nodeEventId] = anchorNodeKey.split(":");
            const node = nodesById[nodeEventId];
            const parentEventId = node?.parentEventId;
            if (!parentEventId) {
                continue;
            }

            const snapshot = resolver.getTargetSnapshot(parentEventId);
            if (snapshot?.status !== "deleted") {
                continue;
            }

            if (getExpansion(anchorEventId, nodeEventId).parentDeleted) {
                continue;
            }

            if (snapshot.authorPubkey) {
                hideEvent(snapshot.authorPubkey, parentEventId);
                markParentDeletedForEvent(parentEventId, snapshot.authorPubkey, {
                    revealKnownParent: true,
                });
            }
            setParentDeleted(anchorEventId, nodeEventId);
        }
    });

    function cancelCurrentGraphFetches(): void {
        taskTracker.cancelAndClearFetchTasks();
        taskTracker.clearChildRequestTokens();
        if (ownsProfileSync) {
            profileSync.reset();
        }
        parentLoadingIndicator.clearAll();
    }

    function resetState(): void {
        cancelCurrentGraphFetches();
        if (ownsResolver) {
            resolver.reset();
        }
        taskTracker.incrementRequestId();
        nodesById = {};
        parentByChildId = {};
        childrenByParentId = {};
        expansionByAnchorNodeKey = {};
        deletedEventIdsByPubkey = {};
        reactionSummaryByParentId = {};
        reactionRecordsByParentId = {};
        reactionProfilesByPubkey = {};
        replyBadgePreloadKeys.clear();
        childReplyCountPrefetchKeys.clear();
    }

    $effect(() => {
        if (!getShow()) {
            resetState();
        }
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        return () => {
            cancelCurrentGraphFetches();
        };
    });

    onDestroy(() => {
        resolver.invalidateScope(parentResolverScopeKey);
        cancelCurrentGraphFetches();
        unsubscribeProfileUpdates();
        if (ownsResolver) {
            resolver.reset();
        }
        if (ownsProfileSync) {
            profileSync.dispose();
        }
    });

    return {
        getAnchorState,
        toggleParent,
        retryParent,
        toggleNodeParent,
        retryNodeParent,
        toggleChildren,
        retryChildren,
        toggleNodeChildren,
        retryNodeChildren,
        recordPostedReply,
        recordDeletedEvent,
        loadCachedChildInteractionStateForPosts,
        cancelCurrentGraphFetches,
        resetState,
    };
}
