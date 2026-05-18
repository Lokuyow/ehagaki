import type { RxNostr } from "rx-nostr";
import { ProfileManager } from "../profileManager";
import {
    postHistoryContextFetchService,
    type PostHistoryContextFetchService,
    type PostHistoryContextFetchTask,
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
    postHistoryReplyEventsAdapter,
    type PostHistoryReplyEventsAdapter,
} from "../postHistoryReplyEventsAdapter";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { NostrEvent, ProfileData, RelayConfig } from "../types";
import type { PostHistoryRecord } from "../storage/ehagakiDb";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "../storage/postHistoryRepository";
import {
    postHistoryReplyEventsRepository,
    type PostHistoryReplyEventsRepository,
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
    replyItems: PostHistoryThreadGraphReplyItem[];
    replyNodeStates: PostHistoryThreadGraphNodeState[];
}

interface UsePostHistoryThreadGraphParams {
    getShow: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    postHistoryRepositoryImpl?: Pick<PostHistoryRepository, "getByEventId">;
    replyEventsAdapterImpl?: PostHistoryReplyEventsAdapter;
    replyEventsRepositoryImpl?: Pick<
        PostHistoryReplyEventsRepository,
        "getDirectReplies" | "upsertDirectReplies" | "deleteByEventId"
    >;
    deletionRequestsRepositoryImpl?: Pick<
        PostHistoryDeletionRequestsRepository,
        "getDeletedTargets" | "upsertValidDeletionRequests"
    >;
    profilesRepositoryImpl?: Pick<ProfilesRepository, "get">;
    contextFetchService?: Pick<PostHistoryContextFetchService, "fetchEventById">;
    replyFetchService?: Pick<PostHistoryReplyFetchService, "fetchDirectReplies">;
    deletionFetchService?: Pick<PostHistoryDeletionFetchService, "fetchDeletionRequests">;
}

function buildInitialRepliesActionState(): PostHistoryThreadGraphRepliesActionState {
    return {
        status: "unloaded",
        visible: false,
        replies: [],
        error: null,
    };
}

function sanitizeRelayUrls(urls: string[]): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(urls, { limit: 8 });
}

function uniqueEventIds(eventIds: string[]): string[] {
    return Array.from(new Set(eventIds));
}

const POST_HISTORY_THREAD_GRAPH_MAX_PARENT_DEPTH = 20;
const POST_HISTORY_THREAD_GRAPH_MAX_CHILD_DEPTH = 20;

export function usePostHistoryThreadGraph({
    getShow,
    getPubkeyHex,
    getRxNostr,
    getRelayConfig,
    postHistoryRepositoryImpl = postHistoryRepository,
    replyEventsAdapterImpl = postHistoryReplyEventsAdapter,
    replyEventsRepositoryImpl = postHistoryReplyEventsRepository,
    deletionRequestsRepositoryImpl = postHistoryDeletionRequestsRepository,
    profilesRepositoryImpl = profilesRepository,
    contextFetchService = postHistoryContextFetchService,
    replyFetchService = postHistoryReplyFetchService,
    deletionFetchService = postHistoryDeletionFetchService,
}: UsePostHistoryThreadGraphParams) {
    let nodesById = $state.raw<Record<string, PostHistoryThreadGraphNode>>({});
    let parentByChildId = $state.raw<Record<string, string>>({});
    let childrenByParentId = $state.raw<Record<string, string[]>>({});
    let expansionByAnchorNodeKey =
        $state.raw<Record<string, PostHistoryThreadGraphExpansionState>>({});
    let deletedEventIdsByPubkey = $state.raw<Record<string, Record<string, true>>>({});
    const parentTasksByKey = new Map<string, PostHistoryContextFetchTask>();
    const childrenTasksByKey = new Map<string, PostHistoryReplyFetchTask>();
    const deletionTasksByKey = new Map<string, PostHistoryDeletionFetchTask>();
    const parentLoadingDelayTimersByKey = new Map<string, ReturnType<typeof setTimeout>>();
    let requestId = 0;

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

    async function resolveProfile(
        event: NostrEvent,
        additionalRelays: string[] = [],
    ): Promise<ProfileData | null> {
        try {
            const cachedProfile = await profilesRepositoryImpl.get(event.pubkey);
            if (cachedProfile) {
                return cachedProfile;
            }
        } catch {
            // Use network path when available.
        }

        const rxNostr = getRxNostr();
        if (!rxNostr) {
            return null;
        }

        try {
            const profileManager = new ProfileManager(rxNostr as never);
            return await profileManager.fetchProfileData(event.pubkey, {
                additionalRelays,
                forceRemote: false,
            });
        } catch {
            return null;
        }
    }

    async function upsertNodeWithProfile(input: {
        event: NostrEvent;
        relayUrls?: string[];
        sources: PostHistoryThreadGraphSource[];
    }): Promise<PostHistoryThreadGraphNode> {
        const relayUrls = sanitizeRelayUrls(input.relayUrls ?? []);
        const profile = await resolveProfile(input.event, relayUrls);
        return upsertNode({
            ...input,
            relayUrls,
            profile,
        });
    }

    function getParentRelayHints(post: PostHistoryRecord, node: PostHistoryThreadGraphNode): string[] {
        const references = parseKind1ThreadReferences(node.event);
        return sanitizeRelayUrls([
            ...(references.replyRelayHint ? [references.replyRelayHint] : []),
            ...(references.rootRelayHint ? [references.rootRelayHint] : []),
            ...node.relayUrls,
            ...references.relayHints,
            ...post.relayHints,
            ...post.acceptedRelays,
            ...(post.fetchedRelays ?? []),
        ]);
    }

    function getParentAuthorHint(node: PostHistoryThreadGraphNode): string | null {
        const references = parseKind1ThreadReferences(node.event);
        if (!references.parentId) {
            return null;
        }

        if (references.parentId === references.replyId) {
            return references.replyAuthorHint;
        }

        if (references.parentId === references.rootId) {
            return references.rootAuthorHint;
        }

        return references.replyAuthorHint ?? references.rootAuthorHint;
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
            .map((eventId) => nodesById[eventId])
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

    function getNodeState(
        anchorEventId: string,
        nodeEventId: string,
        currentPubkey: string,
        pathEventIds: string[] = [],
        depthFromAnchor = 0,
        renderedEventIds: Set<string> = new Set(),
    ): PostHistoryThreadGraphNodeState | null {
        const node = nodesById[nodeEventId];
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
        const childEventIds = toVisibleChildEventIds(nodeEventId);
        const replyNodeStates = expansion.visibleChildren
            && depthFromAnchor < POST_HISTORY_THREAD_GRAPH_MAX_CHILD_DEPTH
            ? childEventIds
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
                visible: expansion.visibleChildren,
                replies: childEventIds,
                error: expansion.childrenError,
            },
            replyNodeStates,
            isOwnReply: node.authorPubkey === currentPubkey,
            depthFromAnchor,
            cycleDetected: false,
        };
    }

    function getAnchorState(post: PostHistoryRecord): PostHistoryThreadGraphAnchorState {
        const anchorNode = nodesById[post.eventId] ?? buildAnchorNodeFromPost(post);
        const expansion = getExpansion(post.eventId, post.eventId);
        const currentPubkey = getPubkeyHex() ?? post.pubkeyHex;
        const replyItems = toReplyItems(post.eventId, currentPubkey);
        const renderedEventIds = new Set([post.eventId]);
        const parentTargetId = anchorNode.parentEventId;
        const parentNodeCandidate = parentTargetId ? nodesById[parentTargetId] ?? null : null;
        const parentNode = parentNodeCandidate
            && !isDeletedEvent(parentNodeCandidate.authorPubkey, parentNodeCandidate.eventId)
            ? parentNodeCandidate
            : null;
        const parentNodeState = parentNode && expansion.visibleParent
            ? getNodeState(post.eventId, parentNode.eventId, currentPubkey, [post.eventId], -1, renderedEventIds)
            : null;
        const replyNodeStates = expansion.visibleChildren
            ? toVisibleChildEventIds(post.eventId)
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
                visible: expansion.visibleChildren,
                replies: replyItems,
                error: expansion.childrenError,
            },
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

    async function loadDeletedTargetsFromRepository(events: NostrEvent[]): Promise<void> {
        const deletedTargets = await deletionRequestsRepositoryImpl.getDeletedTargets(
            events.map((event) => ({
                targetAuthorPubkey: event.pubkey,
                targetEventId: event.id,
            })),
        );
        hideDeletedTargets(deletedTargets);
    }

    async function fetchAndStoreDeletionRequests(
        anchorEventId: string,
        events: NostrEvent[],
        relayHints: string[],
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

        const key = `${anchorEventId}:deletions`;
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
                await replyEventsRepositoryImpl.deleteByEventId(event.id);
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

        await fetchAndStoreDeletionRequests(
            input.anchorEventId,
            [input.event],
            input.relayHints,
        );
        await loadDeletedTargetsFromRepository([input.event]);
        return !(await isHiddenOrDeletedEvent(input.event, {
            checkPostHistoryRepository: input.checkPostHistoryRepository,
        }));
    }

    async function isParentDeletedByAuthorHint(input: {
        anchorEventId: string;
        parentEventId: string;
        authorHint: string | null;
        relayHints: string[];
    }): Promise<boolean> {
        if (!input.authorHint) {
            return false;
        }

        const targetEvent: NostrEvent = {
            id: input.parentEventId,
            pubkey: input.authorHint,
            kind: 1,
            content: "",
            tags: [],
            created_at: 0,
            sig: "",
        };

        await loadDeletedTargetsFromRepository([targetEvent]);
        if (isDeletedEvent(input.authorHint, input.parentEventId)) {
            return true;
        }

        await fetchAndStoreDeletionRequests(
            input.anchorEventId,
            [targetEvent],
            input.relayHints,
        );
        await loadDeletedTargetsFromRepository([targetEvent]);
        return isDeletedEvent(input.authorHint, input.parentEventId);
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

    async function loadParentForNode(
        post: PostHistoryRecord,
        nodeEventId: string,
        options: { force?: boolean } = {},
    ): Promise<void> {
        const currentNode = nodeEventId === post.eventId
            ? ensureAnchorNode(post)
            : nodesById[nodeEventId];
        if (!currentNode) {
            return;
        }

        const parentEventId = currentNode.parentEventId;
        if (!parentEventId) {
            return;
        }

        const currentExpansion = getExpansion(post.eventId, nodeEventId);
        if (currentExpansion.loadingParent) {
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                visibleParent: true,
                showParentLoadingIndicator: false,
            }));
            scheduleParentLoadingIndicator(post.eventId, nodeEventId);
            return;
        }

        if (!options.force && currentExpansion.loadedParent) {
            const cachedParentNode = nodesById[parentEventId] ?? null;
            if (currentExpansion.parentDeleted) {
                setParentDeleted(post.eventId, nodeEventId);
                return;
            }

            if (cachedParentNode) {
                if (isDeletedEvent(cachedParentNode.authorPubkey, cachedParentNode.eventId)) {
                    setParentDeleted(post.eventId, nodeEventId);
                    return;
                }

                const isVisibleCachedParent = await isVisibleParentEvent({
                    anchorEventId: post.eventId,
                    event: cachedParentNode.event,
                    relayHints: sanitizeRelayUrls([
                        ...cachedParentNode.relayUrls,
                        ...getParentRelayHints(post, currentNode),
                    ]),
                    checkPostHistoryRepository: cachedParentNode.authorPubkey === getPubkeyHex(),
                });
                if (!getShow()) {
                    return;
                }

                if (!isVisibleCachedParent) {
                    setParentDeleted(post.eventId, nodeEventId);
                    return;
                }
            }

            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                visibleParent: true,
                showParentLoadingIndicator: false,
                parentDeleted: false,
            }));
            return;
        }

        const activeRequestId = ++requestId;
        const key = buildAnchorNodeKey(post.eventId, nodeEventId);
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

        const existingRecord = await postHistoryRepositoryImpl.getByEventId(parentEventId);
        if (activeRequestId !== requestId || !getShow()) {
            clearParentLoadingDelayTimer(key);
            return;
        }

        if (existingRecord) {
            const event = toEventFromPostHistoryRecord(existingRecord);
            const parentRelayHints = sanitizeRelayUrls([
                ...existingRecord.relayHints,
                ...existingRecord.acceptedRelays,
                ...(existingRecord.fetchedRelays ?? []),
                ...getParentRelayHints(post, currentNode),
            ]);
            if (typeof existingRecord.deletedAt === "number") {
                hideEvent(event.pubkey, event.id);
                markParentDeletedForEvent(event.id, event.pubkey, { revealKnownParent: true });
                setParentDeleted(post.eventId, nodeEventId);
                return;
            }

            const isVisibleParent = await isVisibleParentEvent({
                anchorEventId: post.eventId,
                event,
                relayHints: parentRelayHints,
                checkPostHistoryRepository: false,
            });
            if (activeRequestId !== requestId || !getShow()) {
                clearParentLoadingDelayTimer(key);
                return;
            }

            if (!isVisibleParent) {
                setParentDeleted(post.eventId, nodeEventId);
                return;
            }

            const node = await upsertNodeWithProfile({
                event,
                relayUrls: parentRelayHints,
                sources: ["history-record", "fetched-parent"],
            });
            upsertParentEdge(node.eventId, node.parentEventId);
            clearParentLoadingDelayTimer(key);
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                loadedParent: true,
                visibleParent: true,
                loadingParent: false,
                parentError: null,
                parentMissing: false,
                parentDeleted: false,
                showParentLoadingIndicator: false,
                lastFetchedParentAt: Date.now(),
            }));
            return;
        }

        const rxNostr = getRxNostr();
        if (!rxNostr) {
            clearParentLoadingDelayTimer(key);
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                loadingParent: false,
                parentError: "nostr_not_ready",
                showParentLoadingIndicator: false,
            }));
            return;
        }

        parentTasksByKey.get(key)?.cancel();
        const task = contextFetchService.fetchEventById(rxNostr, {
            eventId: parentEventId,
            relayHints: getParentRelayHints(post, currentNode),
            relayConfig: getRelayConfig(),
        });
        parentTasksByKey.set(key, task);

        const result = await task.promise;
        parentTasksByKey.delete(key);
        if (activeRequestId !== requestId || !getShow()) {
            clearParentLoadingDelayTimer(key);
            return;
        }

        clearParentLoadingDelayTimer(key);
        if (!result.event) {
            const parentAuthorHint = getParentAuthorHint(currentNode);
            const isDeletedByAuthorHint = await isParentDeletedByAuthorHint({
                anchorEventId: post.eventId,
                parentEventId,
                authorHint: parentAuthorHint,
                relayHints: getParentRelayHints(post, currentNode),
            });
            if (activeRequestId !== requestId || !getShow()) {
                return;
            }

            if (isDeletedByAuthorHint) {
                setParentDeleted(post.eventId, nodeEventId);
                return;
            }

            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                loadedParent: true,
                loadingParent: false,
                parentMissing: true,
                parentDeleted: false,
                showParentLoadingIndicator: false,
                lastFetchedParentAt: Date.now(),
            }));
            return;
        }

        const fetchedParentRelayHints = sanitizeRelayUrls([
            ...(result.relayUrl ? [result.relayUrl] : []),
            ...getParentRelayHints(post, currentNode),
        ]);
        const isVisibleParent = await isVisibleParentEvent({
            anchorEventId: post.eventId,
            event: result.event,
            relayHints: fetchedParentRelayHints,
        });
        if (activeRequestId !== requestId || !getShow()) {
            return;
        }

        if (!isVisibleParent) {
            setParentDeleted(post.eventId, nodeEventId);
            return;
        }

        const node = await upsertNodeWithProfile({
            event: result.event,
            relayUrls: fetchedParentRelayHints,
            sources: ["fetched-parent"],
        });
        upsertParentEdge(node.eventId, node.parentEventId);
        updateExpansion(post.eventId, nodeEventId, (state) => ({
            ...state,
            loadedParent: true,
            visibleParent: true,
            loadingParent: false,
            parentError: null,
            parentMissing: false,
            parentDeleted: false,
            showParentLoadingIndicator: false,
            lastFetchedParentAt: Date.now(),
        }));
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

    function toggleParent(post: PostHistoryRecord): void {
        const expansion = getExpansion(post.eventId, post.eventId);
        if (expansion.visibleParent) {
            hideParent(post);
            return;
        }

        void loadParent(post);
    }

    function retryParent(post: PostHistoryRecord): void {
        void loadParent(post, { force: true });
    }

    function toggleNodeParent(post: PostHistoryRecord, nodeEventId: string): void {
        const expansion = getExpansion(post.eventId, nodeEventId);
        if (expansion.visibleParent) {
            hideParentForNode(post.eventId, nodeEventId);
            return;
        }

        void loadParentForNode(post, nodeEventId);
    }

    function retryNodeParent(post: PostHistoryRecord, nodeEventId: string): void {
        void loadParentForNode(post, nodeEventId, { force: true });
    }

    async function loadChildrenForNode(
        post: PostHistoryRecord,
        nodeEventId: string,
        options: { force?: boolean } = {},
    ): Promise<void> {
        const currentNode = nodeEventId === post.eventId
            ? ensureAnchorNode(post)
            : nodesById[nodeEventId];
        if (!currentNode) {
            return;
        }

        const currentExpansion = getExpansion(post.eventId, nodeEventId);
        if (currentExpansion.loadingChildren) {
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                visibleChildren: true,
            }));
            return;
        }

        if (!options.force && currentExpansion.loadedChildren) {
            const hasReplies = toVisibleChildEventIds(nodeEventId).length > 0;
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                visibleChildren: hasReplies,
            }));
            return;
        }

        const activeRequestId = ++requestId;
        updateExpansion(post.eventId, nodeEventId, (state) => ({
            ...state,
            loadingChildren: true,
            visibleChildren: true,
            childrenError: null,
        }));

        try {
            const rawCachedRecords = await replyEventsAdapterImpl.getDirectReplyRecords(nodeEventId);
            await fetchAndStoreDeletionRequests(
                post.eventId,
                rawCachedRecords.map((record) => toEventFromReplyRecord(record)),
                getChildrenRelayHints(post, currentNode),
            );
            const cachedRecords = await filterVisibleReplyRecords(
                rawCachedRecords,
            );
            if (activeRequestId !== requestId || !getShow()) {
                return;
            }

            if (!options.force && cachedRecords.length > 0) {
                await upsertReplyRecords(nodeEventId, cachedRecords, ["reply-db"]);
                updateExpansion(post.eventId, nodeEventId, (state) => ({
                    ...state,
                    loadedChildren: true,
                    visibleChildren: true,
                    loadingChildren: false,
                    childrenError: null,
                    lastFetchedChildrenAt: Date.now(),
                }));
                return;
            }

            const rxNostr = getRxNostr();
            if (!rxNostr) {
                updateExpansion(post.eventId, nodeEventId, (state) => ({
                    ...state,
                    loadedChildren: cachedRecords.length > 0,
                    visibleChildren: cachedRecords.length > 0,
                    loadingChildren: false,
                    childrenError: cachedRecords.length > 0 ? null : "nostr_not_ready",
                }));
                return;
            }

            const key = buildAnchorNodeKey(post.eventId, nodeEventId);
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
            if (activeRequestId !== requestId || !getShow()) {
                return;
            }

            await fetchAndStoreDeletionRequests(
                post.eventId,
                result.events.map((item) => item.event),
                [
                    ...getChildrenRelayHints(post, currentNode),
                    ...result.relayUrls,
                ],
            );
            const fetchedEvents = await filterVisibleReplyItems(result.events);
            await replyEventsRepositoryImpl.upsertDirectReplies({
                parentEventId: nodeEventId,
                events: fetchedEvents,
                fetchedAt: result.fetchedAt,
            });
            const nextRecords = await filterVisibleReplyRecords(
                await replyEventsAdapterImpl.getDirectReplyRecords(nodeEventId),
            );
            if (activeRequestId !== requestId || !getShow()) {
                return;
            }

            await upsertReplyRecords(nodeEventId, nextRecords, ["reply-db", "fetched-child"]);
            const hasReplies = toVisibleChildEventIds(nodeEventId).length > 0;
            const latestExpansion = getExpansion(post.eventId, nodeEventId);
            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                loadedChildren: true,
                visibleChildren: hasReplies && latestExpansion.visibleChildren,
                loadingChildren: false,
                childrenError: null,
                lastFetchedChildrenAt: Date.now(),
            }));
        } catch {
            if (activeRequestId !== requestId || !getShow()) {
                return;
            }

            updateExpansion(post.eventId, nodeEventId, (state) => ({
                ...state,
                loadingChildren: false,
                visibleChildren: false,
                childrenError: "fetch_failed",
            }));
        }
    }

    async function loadChildren(post: PostHistoryRecord, options: { force?: boolean } = {}): Promise<void> {
        await loadChildrenForNode(post, post.eventId, options);
    }

    async function upsertReplyRecords(
        parentEventId: string,
        records: import("../storage/ehagakiDb").PostHistoryReplyEventRecord[],
        sources: PostHistoryThreadGraphSource[],
    ): Promise<void> {
        const childIds: string[] = [];
        for (const record of records) {
            const event = toEventFromReplyRecord(record);
            if (isDeletedEvent(event.pubkey, event.id)) {
                continue;
            }

            const node = await upsertNodeWithProfile({
                event,
                relayUrls: record.relayUrls,
                sources,
            });
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

        await replyEventsRepositoryImpl.upsertDirectReplies({
            parentEventId,
            events: [
                {
                    event,
                    relayUrls: references.relayHints,
                },
            ],
        });

        const nextRecords = await filterVisibleReplyRecords(
            await replyEventsAdapterImpl.getDirectReplyRecords(parentEventId),
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
        await replyEventsRepositoryImpl.deleteByEventId(input.eventId);
    }

    function cancelCurrentGraphFetches(): void {
        parentTasksByKey.forEach((task) => task.cancel());
        childrenTasksByKey.forEach((task) => task.cancel());
        deletionTasksByKey.forEach((task) => task.cancel());
        parentTasksByKey.clear();
        childrenTasksByKey.clear();
        deletionTasksByKey.clear();
        parentLoadingDelayTimersByKey.forEach((timer) => clearTimeout(timer));
        parentLoadingDelayTimersByKey.clear();
    }

    function resetState(): void {
        cancelCurrentGraphFetches();
        requestId += 1;
        nodesById = {};
        parentByChildId = {};
        childrenByParentId = {};
        expansionByAnchorNodeKey = {};
        deletedEventIdsByPubkey = {};
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
        cancelCurrentGraphFetches,
        resetState,
    };
}
