import { onDestroy } from "svelte";
import type { RxNostr } from "rx-nostr";
import { ProfileManager } from "../profileManager";
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
    type PostHistoryReplyFetchTask,
} from "../postHistoryReplyFetchService";
import {
    postHistoryDeletionFetchService,
    type PostHistoryDeletionFetchService,
    type PostHistoryDeletionFetchTask,
} from "../postHistoryDeletionFetchService";
import {
    postHistoryDirectReplyRecordsAdapter,
    postHistoryReactionRecordsAdapter,
    type PostHistoryDirectReplyRecordsAdapter,
    type PostHistoryReactionRecordsAdapter,
} from "../postHistoryReplyEventsAdapter";
import { RelayConfigUtils } from "../relayConfigUtils";
import { postHistoryReplyParentTargetDiscoveryAdapter } from "../postHistoryRelatedTargetDiscoveryAdapter";
import type { NostrEvent, ProfileData, RelayConfig } from "../types";
import type { PostHistoryRecord, PostHistoryReplyEventRecord } from "../storage/ehagakiDb";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "../storage/postHistoryRepository";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionsRepository,
} from "../storage/postHistoryReplyEventsRepository";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "../storage/postHistoryDeletionRequestsRepository";
import {
    profilesRepository,
    type ProfilesRepository,
} from "../storage/profilesRepository";
import { parseKind1ThreadReferences } from "../postHistoryNip10Utils";
import {
    EMPTY_POST_HISTORY_REACTION_SUMMARY,
    type PostHistoryReactionSummary,
    summarizePostHistoryReactionRecords,
} from "../postHistoryReactionSummary";
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
    profilesRepositoryImpl?: Pick<ProfilesRepository, "get">;
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
const POST_HISTORY_CHILD_REPLY_PREFETCH_TIMEOUT_MS = 2_000;
const POST_HISTORY_CHILD_REPLY_PREFETCH_RELAY_LIMIT = 4;
const POST_HISTORY_CHILD_REPLY_PREFETCH_FRESH_MS = 5 * 60 * 1_000;
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
    profilesRepositoryImpl = profilesRepository,
    contextFetchService = postHistoryContextFetchService,
    replyFetchService = postHistoryReplyFetchService,
    deletionFetchService = postHistoryDeletionFetchService,
    relatedTargetResolver = undefined,
}: UsePostHistoryThreadGraphParams) {
    const resolver = relatedTargetResolver
        ?? createPostHistoryRelatedTargetResolver({
            getShow,
            getRxNostr,
            getRelayConfig,
            postHistoryRepositoryImpl,
            contextFetchService,
            deletionRequestsRepositoryImpl,
            deletionFetchService,
            profilesRepositoryImpl,
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
    const childrenTasksByKey = new Map<string, PostHistoryReplyFetchTask>();
    const deletionTasksByKey = new Map<string, PostHistoryDeletionFetchTask>();
    const parentLoadingDelayTimersByKey = new Map<string, ReturnType<typeof setTimeout>>();
    const profileRefreshTasksByPubkey = new Map<string, Promise<void>>();
    const replyBadgePreloadKeys = new Set<string>();
    let reactionSummaryByParentId =
        $state.raw<Record<string, PostHistoryReactionSummary>>({});
    let requestId = 0;
    let childRequestId = 0;
    const childrenRequestIdsByKey = new Map<string, number>();

    function setReactionSummary(
        parentEventId: string,
        records: PostHistoryReplyEventRecord[],
    ): void {
        reactionSummaryByParentId = {
            ...reactionSummaryByParentId,
            [parentEventId]: summarizePostHistoryReactionRecords(records),
        };
    }

    function getReactionSummary(parentEventId: string): PostHistoryReactionSummary {
        return reactionSummaryByParentId[parentEventId]
            ?? EMPTY_POST_HISTORY_REACTION_SUMMARY;
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
        if (!pubkey || profileRefreshTasksByPubkey.has(pubkey)) {
            return;
        }

        const activeRequestId = requestId;

        const task = (async () => {
            try {
                const cachedProfile = await profilesRepositoryImpl.get(pubkey);
                if (cachedProfile && activeRequestId === requestId && getShow()) {
                    mergeProfileForPubkey(pubkey, cachedProfile);
                }
            } catch {
                // Network profile lookup below is still allowed to refresh the visible node.
            }

            const rxNostr = getRxNostr();
            if (!rxNostr || activeRequestId !== requestId || !getShow()) {
                return;
            }

            const profileManager = new ProfileManager(rxNostr as never);
            const profile = await profileManager.fetchProfileData(pubkey, {
                additionalRelays,
                forceRemote: false,
            });
            if (!profile || activeRequestId !== requestId || !getShow()) {
                return;
            }

            mergeProfileForPubkey(pubkey, profile);
        })()
            .catch(() => undefined)
            .finally(() => {
                profileRefreshTasksByPubkey.delete(pubkey);
            });
        profileRefreshTasksByPubkey.set(pubkey, task);
    }

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
        const references = parseKind1ThreadReferences(node.event);
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
                const references = parseKind1ThreadReferences(node.event);
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
        const timer = parentLoadingDelayTimersByKey.get(key);
        if (!timer) {
            return;
        }

        clearTimeout(timer);
        parentLoadingDelayTimersByKey.delete(key);
    }

    function scheduleParentLoadingIndicator(anchorEventId: string, nodeEventId: string): void {
        const key = buildAnchorNodeKey(anchorEventId, nodeEventId);
        clearParentLoadingDelayTimer(key);

        const timer = setTimeout(() => {
            parentLoadingDelayTimersByKey.delete(key);
            const current = getExpansion(anchorEventId, nodeEventId);
            if (!current.loadingParent || !current.visibleParent) {
                return;
            }

            updateExpansion(anchorEventId, nodeEventId, (state) => ({
                ...state,
                showParentLoadingIndicator: true,
            }));
        }, 400);

        parentLoadingDelayTimersByKey.set(key, timer);
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

            updateExpansion(anchorEventId, nodeEventId, (state) => ({
                ...state,
                loadedParent: true,
                visibleParent: options.revealKnownParent ? true : state.visibleParent,
                loadingParent: false,
                parentMissing: false,
                parentDeleted: true,
                parentError: null,
                showParentLoadingIndicator: false,
                lastFetchedParentAt: Date.now(),
            }));
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
        deletionTasksByKey.get(key)?.cancel();
        const task = deletionFetchService.fetchDeletionRequests(rxNostr, {
            targets: visibleEvents.map((event) => ({
                event,
                relayUrls: nodesById[event.id]?.relayUrls ?? [],
            })),
            relayHints,
            relayConfig: getRelayConfig(),
        });
        deletionTasksByKey.set(key, task);

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
            deletionTasksByKey.delete(key);
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
        records: import("../storage/ehagakiDb").PostHistoryReplyEventRecord[],
    ): Promise<import("../storage/ehagakiDb").PostHistoryReplyEventRecord[]> {
        const events = records.map((record) => toEventFromReplyRecord(record));
        const visibleEvents = await filterVisibleReplyEvents(events);
        const visibleEventIds = new Set(visibleEvents.map((event) => event.id));
        const visibleRecords: import("../storage/ehagakiDb").PostHistoryReplyEventRecord[] = [];
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
            ...state,
            loadedParent: true,
            visibleParent: true,
            loadingParent: false,
            parentMissing: false,
            parentDeleted: true,
            parentError: null,
            showParentLoadingIndicator: false,
            lastFetchedParentAt: Date.now(),
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
                ...state,
                loadedParent: true,
                visibleParent: state.visibleParent,
                loadingParent: false,
                revalidatingParent: state.revalidatingParent,
                parentError: null,
                parentMissing: false,
                parentDeleted: state.parentDeleted,
                showParentLoadingIndicator: false,
                lastFetchedParentAt: parentSnapshot?.updatedAt ?? state.lastFetchedParentAt,
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
            const node = upsertNode({
                event: parentSnapshot.event,
                relayUrls: parentSnapshot.relayHints,
                sources: ["fetched-parent"],
                profile: parentSnapshot.profile,
            });
            upsertParentEdge(node.eventId, node.parentEventId);
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                loadedParent: true,
                visibleParent: state.visibleParent,
                loadingParent: false,
                revalidatingParent: state.revalidatingParent,
                parentError: null,
                parentMissing: false,
                parentDeleted: false,
                showParentLoadingIndicator: false,
                lastFetchedParentAt: parentSnapshot.updatedAt ?? state.lastFetchedParentAt,
            }));
            return true;
        }

        if (parentSnapshot.status === "not-found") {
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                loadedParent: true,
                visibleParent: state.visibleParent,
                loadingParent: false,
                revalidatingParent: state.revalidatingParent,
                parentError: null,
                parentMissing: true,
                parentDeleted: false,
                showParentLoadingIndicator: false,
                lastFetchedParentAt: parentSnapshot.updatedAt ?? state.lastFetchedParentAt,
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

        const activeRequestId = ++requestId;
        const key = buildAnchorNodeKey(post.eventId, nodeEventId);
        updateExpansion(post.eventId, nodeEventId, (state) => ({
            ...state,
            loadingParent: !!options.showInitialLoading,
            revalidatingParent: !options.showInitialLoading,
            visibleParent: state.visibleParent || !!options.showInitialLoading,
            parentError: null,
            parentMissing: false,
            parentDeleted: false,
            showParentLoadingIndicator: false,
        }));
        if (options.showInitialLoading) {
            scheduleParentLoadingIndicator(post.eventId, nodeEventId);
        }

        try {
            const descriptor = buildParentTargetDescriptor(post, nodeEventId, currentNode);
            if (!descriptor) {
                return;
            }

            const snapshot = await resolver.ensureTarget(descriptor, {
                force: true,
                background: !options.showInitialLoading,
            });
            if (activeRequestId !== requestId || !getShow()) {
                clearParentLoadingDelayTimer(key);
                return;
            }

            clearParentLoadingDelayTimer(key);
            if (!snapshot) {
                return;
            }

            if (snapshot.status === "deleted") {
                if (snapshot.authorPubkey) {
                    hideEvent(snapshot.authorPubkey, parentEventId);
                    markParentDeletedForEvent(parentEventId, snapshot.authorPubkey, {
                        revealKnownParent: true,
                    });
                }
                setParentDeleted(post.eventId, nodeEventId);
                return;
            }

            if (snapshot.status === "not-found") {
                updateExpansion(post.eventId, nodeEventId, (state) => ({
                    ...state,
                    loadedParent: true,
                    loadingParent: false,
                    revalidatingParent: false,
                    parentMissing: options.showInitialLoading ? true : state.parentMissing,
                    parentDeleted: false,
                    showParentLoadingIndicator: false,
                    lastFetchedParentAt: snapshot.updatedAt ?? Date.now(),
                }));
                return;
            }

            if (snapshot.status === "resolved" && snapshot.event) {
                if (snapshot.authorPubkey && isDeletedEvent(snapshot.authorPubkey, parentEventId)) {
                    setParentDeleted(post.eventId, nodeEventId);
                    return;
                }

                const node = upsertNode({
                    event: snapshot.event,
                    relayUrls: snapshot.relayHints,
                    sources: ["fetched-parent"],
                    profile: snapshot.profile,
                });
                upsertParentEdge(node.eventId, node.parentEventId);
                updateExpansion(post.eventId, nodeEventId, (state) => ({
                    ...state,
                    loadedParent: true,
                    visibleParent: state.visibleParent,
                    loadingParent: false,
                    revalidatingParent: false,
                    parentError: null,
                    parentMissing: false,
                    parentDeleted: false,
                    showParentLoadingIndicator: false,
                    lastFetchedParentAt: snapshot.updatedAt ?? Date.now(),
                }));
                return;
            }

            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                loadingParent: false,
                revalidatingParent: false,
                visibleParent: state.visibleParent,
                parentError: options.showInitialLoading
                    ? snapshot.errorCode ?? "fetch_failed"
                    : state.parentError,
                showParentLoadingIndicator: false,
            }));
        } finally {
            clearParentLoadingDelayTimer(key);
        }
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
        if (currentExpansion.loadingParent || currentExpansion.revalidatingParent) {
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                visibleParent: true,
                showParentLoadingIndicator: false,
            }));
            if (currentExpansion.loadingParent) {
                scheduleParentLoadingIndicator(post.eventId, nodeEventId);
            }
            return;
        }

        if (!options.force && currentExpansion.loadedParent) {
            if (currentExpansion.parentDeleted) {
                setParentDeleted(post.eventId, nodeEventId);
                return;
            }

            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                visibleParent: true,
                showParentLoadingIndicator: false,
            }));
            const displayedParent = await displayCachedParentForNode(post, nodeEventId, currentNode);
            if (displayedParent && isThreadGraphRevalidateStale(currentExpansion.lastFetchedParentAt)) {
                void revalidateParentForNodeInBackground(post, nodeEventId, currentNode);
            }
            return;
        }

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
        const displayedCachedParent = await displayCachedParentForNode(post, nodeEventId, currentNode);
        const latestExpansion = getExpansion(post.eventId, nodeEventId);
        if (displayedCachedParent && !options.force && !isThreadGraphRevalidateStale(latestExpansion.lastFetchedParentAt)) {
            return;
        }

        const revalidatePromise = revalidateParentForNodeInBackground(post, nodeEventId, currentNode, {
            showInitialLoading: !displayedCachedParent,
        });
        if (!displayedCachedParent) {
            await revalidatePromise;
        }
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

    function isThreadGraphRevalidateStale(lastFetchedAt: number | null): boolean {
        return typeof lastFetchedAt !== "number"
            || Date.now() - lastFetchedAt >= POST_HISTORY_THREAD_GRAPH_REVALIDATE_TTL_MS;
    }

    function resolveCachedReplyFetchedAt(records: PostHistoryReplyEventRecord[]): number | null {
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

        await upsertReplyRecords(nodeEventId, cachedRecords, ["reply-db"], {
            resolveProfiles: !options.prefetchOnly,
        });
        if (!getShow()) {
            return true;
        }

        updateExpansion(post.eventId, nodeEventId, (state) => ({
            ...state,
            loadedChildren: true,
            visibleChildren: options.prefetchOnly ? state.visibleChildren : true,
            loadingChildren: false,
            revalidatingChildren: state.revalidatingChildren,
            childrenError: null,
            lastFetchedChildrenAt: resolveCachedReplyFetchedAt(cachedRecords) ?? state.lastFetchedChildrenAt,
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
        const activeGraphRequestId = requestId;
        const activeChildRequestId = ++childRequestId;
        childrenRequestIdsByKey.set(key, activeChildRequestId);
        updateExpansion(post.eventId, nodeEventId, (state) => ({
            ...state,
            loadingChildren: !!options.showInitialLoading,
            revalidatingChildren: !options.showInitialLoading,
            visibleChildren: options.prefetchOnly ? state.visibleChildren : state.visibleChildren || !!options.showInitialLoading,
            childrenError: null,
        }));

        try {
            const rxNostr = getRxNostr();
            if (!rxNostr) {
                updateExpansion(post.eventId, nodeEventId, (state) => ({
                    ...state,
                    loadingChildren: false,
                    revalidatingChildren: false,
                    childrenError: options.showInitialLoading && !options.prefetchOnly ? "nostr_not_ready" : null,
                }));
                return;
            }

            childrenTasksByKey.get(key)?.cancel();
            const task = replyFetchService.fetchDirectReplies(rxNostr, {
                eventId: nodeEventId,
                createdAt: currentNode.event.created_at,
                relayHints: getChildrenRelayHints(post, currentNode),
                relayConfig: getRelayConfig(),
            });
            childrenTasksByKey.set(key, task);

            const result = await task.promise;
            childrenTasksByKey.delete(key);
            if (
                activeGraphRequestId !== requestId ||
                childrenRequestIdsByKey.get(key) !== activeChildRequestId ||
                !getShow()
            ) {
                return;
            }

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
            if (
                activeGraphRequestId !== requestId ||
                childrenRequestIdsByKey.get(key) !== activeChildRequestId ||
                !getShow()
            ) {
                return;
            }

            if (nextRecords.length > 0) {
                await upsertReplyRecords(nodeEventId, nextRecords, ["reply-db", "fetched-child"], {
                    resolveProfiles: !options.prefetchOnly,
                });
            }
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                loadedChildren: true,
                visibleChildren: state.visibleChildren,
                loadingChildren: false,
                revalidatingChildren: false,
                childrenError: null,
                lastFetchedChildrenAt: result.fetchedAt,
            }));
            if (!options.prefetchOnly) {
                void prefetchChildReplyCounts(post, nodeEventId);
            }
        } catch {
            if (
                activeGraphRequestId !== requestId ||
                childrenRequestIdsByKey.get(key) !== activeChildRequestId ||
                !getShow()
            ) {
                return;
            }

            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                loadingChildren: false,
                revalidatingChildren: false,
                visibleChildren: state.visibleChildren,
                childrenError: options.showInitialLoading && !options.prefetchOnly ? "fetch_failed" : state.childrenError,
            }));
        } finally {
            childrenTasksByKey.delete(key);
            childrenRequestIdsByKey.delete(key);
        }
    }

    async function loadChildrenForNode(
        post: PostHistoryRecord,
        nodeEventId: string,
        options: { force?: boolean; prefetchOnly?: boolean } = {},
    ): Promise<void> {
        const currentNode = nodeEventId === post.eventId
            ? ensureAnchorNode(post)
            : nodesById[nodeEventId];
        if (!currentNode) {
            return;
        }

        const currentExpansion = getExpansion(post.eventId, nodeEventId);
        if (currentExpansion.loadingChildren || currentExpansion.revalidatingChildren) {
            if (!options.prefetchOnly) {
                updateExpansion(post.eventId, nodeEventId, (state) => ({
                    ...state,
                    visibleChildren: true,
                }));
            }
            return;
        }

        if (!options.force && currentExpansion.loadedChildren) {
            if (options.prefetchOnly) {
                return;
            }

            const hasReplies = toVisibleChildEventIds(nodeEventId).length > 0;
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                visibleChildren: hasReplies,
            }));
            if (hasReplies) {
                void prefetchChildReplyCounts(post, nodeEventId);
            }
            if (hasReplies && isThreadGraphRevalidateStale(currentExpansion.lastFetchedChildrenAt)) {
                void revalidateChildrenForNodeInBackground(post, nodeEventId, currentNode);
            }
            return;
        }

        const displayedCachedChildren = await displayCachedChildrenForNode(post, nodeEventId, currentNode, options);
        const latestExpansion = getExpansion(post.eventId, nodeEventId);
        if (displayedCachedChildren && !options.force && !isThreadGraphRevalidateStale(latestExpansion.lastFetchedChildrenAt)) {
            if (!options.prefetchOnly) {
                void prefetchChildReplyCounts(post, nodeEventId);
            }
            return;
        }

        void revalidateChildrenForNodeInBackground(post, nodeEventId, currentNode, {
            prefetchOnly: options.prefetchOnly,
            showInitialLoading: !displayedCachedChildren,
        });
    }

    async function loadChildren(post: PostHistoryRecord, options: { force?: boolean } = {}): Promise<void> {
        await loadChildrenForNode(post, post.eventId, options);
    }

    async function prefetchChildReplyCounts(
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

        await upsertReplyRecords(nodeEventId, cachedRecords, ["reply-db"], {
            resolveProfiles: false,
        });
        if (!getShow()) {
            return true;
        }

        updateExpansion(post.eventId, nodeEventId, (state) => ({
            ...state,
            loadedChildren: true,
            visibleChildren: state.visibleChildren,
            loadingChildren: false,
            childrenError: null,
            lastFetchedChildrenAt: Date.now(),
        }));
        return true;
    }

    function preloadCachedReactionSummaryForParent(
        parentEventId: string,
        cachedRecords: PostHistoryReplyEventRecord[],
    ): void {
        setReactionSummary(parentEventId, cachedRecords);
    }

    async function preloadCachedDirectReplyStateForParent(input: {
        post: PostHistoryRecord;
        parentEventId: string;
        cachedRecords: PostHistoryReplyEventRecord[];
        anchorNode: PostHistoryThreadGraphNode;
        activeRequestId: number;
    }): Promise<void> {
        const cachedDirectReplies = input.cachedRecords.filter((record) => record.kind === 1);
        if (cachedDirectReplies.length === 0) {
            return;
        }

        await upsertReplyRecords(input.parentEventId, cachedDirectReplies, ["reply-db", "inbound-sync"], {
            resolveProfiles: false,
        });
        if (input.activeRequestId !== requestId || !getShow()) {
            return;
        }

        updateExpansion(input.post.eventId, input.parentEventId, (state) => ({
            ...state,
            loadedChildren: true,
            visibleChildren: state.visibleChildren,
            loadingChildren: false,
            revalidatingChildren: state.revalidatingChildren,
            childrenError: null,
            lastFetchedChildrenAt: resolveCachedReplyFetchedAt(cachedDirectReplies) ?? state.lastFetchedChildrenAt,
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

        const activeRequestId = requestId;
        const isTargetedRefresh = !!parentEventIds?.length;
        const postByEventId = new Map(posts.map((post) => [post.eventId, post]));
        for (const parentEventId of targetParentIds) {
            const post = postByEventId.get(parentEventId);
            if (!post || activeRequestId !== requestId || !getShow()) {
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
                reactionRecordsAdapterImpl.getReactionRecords(parentEventId),
                directReplyRecordsAdapterImpl.getDirectReplyRecords(parentEventId),
            ]);
            if (activeRequestId !== requestId || !getShow()) {
                continue;
            }

            const [cachedReactionRecords, cachedDirectReplyRecords] = await Promise.all([
                filterVisibleReplyRecords(rawCachedReactionRecords),
                filterVisibleReplyRecords(rawCachedDirectReplyRecords),
            ]);
            if (activeRequestId !== requestId || !getShow()) {
                continue;
            }

            preloadCachedReactionSummaryForParent(parentEventId, cachedReactionRecords);

            await preloadCachedDirectReplyStateForParent({
                post,
                parentEventId,
                cachedRecords: cachedDirectReplyRecords,
                anchorNode,
                activeRequestId,
            });
        }
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

        const activeGraphRequestId = requestId;
        const requestTokens = new Map<string, number>();
        for (const eventId of batchEventIds) {
            const key = buildAnchorNodeKey(post.eventId, eventId);
            const activeChildRequestId = ++childRequestId;
            requestTokens.set(eventId, activeChildRequestId);
            childrenRequestIdsByKey.set(key, activeChildRequestId);
            updateExpansion(post.eventId, eventId, (state) => ({
                ...state,
                revalidatingChildren: true,
                visibleChildren: state.visibleChildren,
                childrenError: null,
            }));
        }

        const rxNostr = getRxNostr();
        if (!rxNostr) {
            completePrefetchBatch(post.eventId, batchEventIds, activeGraphRequestId, requestTokens, false);
            return;
        }

        const relayHints = getChildrenPrefetchRelayHints(post, batchNodes);
        const taskKey = `${post.eventId}:children-prefetch:${batchEventIds.join(",")}`;
        childrenTasksByKey.get(taskKey)?.cancel();
        const task = replyFetchService.fetchDirectReplies(rxNostr, {
            eventId: batchEventIds[0] ?? "",
            eventIds: batchEventIds,
            createdAt: Math.min(...batchNodes.map((node) => node.event.created_at)),
            relayHints,
            relayConfig: null,
            timeoutMs: POST_HISTORY_CHILD_REPLY_PREFETCH_TIMEOUT_MS,
            relayLimit: POST_HISTORY_CHILD_REPLY_PREFETCH_RELAY_LIMIT,
        });
        childrenTasksByKey.set(taskKey, task);

        try {
            const result = await task.promise;
            childrenTasksByKey.delete(taskKey);
            if (!isPrefetchBatchCurrent(post.eventId, batchEventIds, activeGraphRequestId, requestTokens)) {
                return;
            }

            const batchEventIdSet = new Set(batchEventIds);
            const directReplyItems = result.events.filter((item) => {
                const parentId = parseKind1ThreadReferences(item.event).parentId;
                return !!parentId && batchEventIdSet.has(parentId) && item.event.id !== parentId;
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
            if (!isPrefetchBatchCurrent(post.eventId, batchEventIds, activeGraphRequestId, requestTokens)) {
                return;
            }

            const itemsByParentId = new Map<string, typeof visibleItems>();
            for (const item of visibleItems) {
                const parentId = parseKind1ThreadReferences(item.event).parentId;
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
                await upsertReplyRecords(eventId, nextRecords, ["reply-db", "fetched-child"], {
                    resolveProfiles: false,
                });
            }
            completePrefetchBatch(post.eventId, batchEventIds, activeGraphRequestId, requestTokens, true);
        } catch {
            completePrefetchBatch(post.eventId, batchEventIds, activeGraphRequestId, requestTokens, false);
        } finally {
            childrenTasksByKey.delete(taskKey);
        }
    }

    function isPrefetchBatchCurrent(
        anchorEventId: string,
        eventIds: string[],
        activeGraphRequestId: number,
        requestTokens: Map<string, number>,
    ): boolean {
        if (activeGraphRequestId !== requestId || !getShow()) {
            return false;
        }

        return eventIds.every((eventId) =>
            childrenRequestIdsByKey.get(buildAnchorNodeKey(anchorEventId, eventId)) === requestTokens.get(eventId),
        );
    }

    function completePrefetchBatch(
        anchorEventId: string,
        eventIds: string[],
        activeGraphRequestId: number,
        requestTokens: Map<string, number>,
        loadedChildren: boolean,
    ): void {
        if (!isPrefetchBatchCurrent(anchorEventId, eventIds, activeGraphRequestId, requestTokens)) {
            return;
        }

        for (const eventId of eventIds) {
            const key = buildAnchorNodeKey(anchorEventId, eventId);
            updateExpansion(anchorEventId, eventId, (state) => ({
                ...state,
                loadedChildren,
                visibleChildren: state.visibleChildren,
                loadingChildren: false,
                revalidatingChildren: false,
                childrenError: null,
                lastFetchedChildrenAt: Date.now(),
            }));
            childrenRequestIdsByKey.delete(key);
        }
    }

    async function upsertReplyRecords(
        parentEventId: string,
        records: PostHistoryReplyEventRecord[],
        sources: PostHistoryThreadGraphSource[],
        options: { resolveProfiles?: boolean } = {},
    ): Promise<void> {
        const childIds: string[] = [];
        const shouldResolveProfiles = options.resolveProfiles !== false;
        for (const record of records) {
            const event = toEventFromReplyRecord(record);
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
        }

        upsertChildren(parentEventId, childIds);
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
        if (!event?.id || event.kind !== 1) {
            return true;
        }

        const references = parseKind1ThreadReferences(event);
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

        await upsertReplyRecords(parentEventId, nextRecords, ["reply-db", "posted-reply"]);
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
        childrenTasksByKey.forEach((task) => task.cancel());
        deletionTasksByKey.forEach((task) => task.cancel());
        childrenTasksByKey.clear();
        childrenRequestIdsByKey.clear();
        deletionTasksByKey.clear();
        profileRefreshTasksByPubkey.clear();
        parentLoadingDelayTimersByKey.forEach((timer) => clearTimeout(timer));
        parentLoadingDelayTimersByKey.clear();
    }

    function resetState(): void {
        cancelCurrentGraphFetches();
        if (ownsResolver) {
            resolver.reset();
        }
        requestId += 1;
        nodesById = {};
        parentByChildId = {};
        childrenByParentId = {};
        expansionByAnchorNodeKey = {};
        deletedEventIdsByPubkey = {};
        reactionSummaryByParentId = {};
        replyBadgePreloadKeys.clear();
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
        if (ownsResolver) {
            resolver.reset();
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
