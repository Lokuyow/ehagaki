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
    replies: PostHistoryThreadGraphReplyItem[];
    error: string | null;
}

export interface PostHistoryThreadGraphAnchorState {
    anchorEventId: string;
    parentTargetId: string | null;
    parentNode: PostHistoryThreadGraphNode | null;
    parentExpansion: PostHistoryThreadGraphExpansionState;
    repliesActionState: PostHistoryThreadGraphRepliesActionState;
    replyItems: PostHistoryThreadGraphReplyItem[];
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

    function getAnchorState(post: PostHistoryRecord): PostHistoryThreadGraphAnchorState {
        const anchorNode = nodesById[post.eventId] ?? buildAnchorNodeFromPost(post);
        const expansion = getExpansion(post.eventId, post.eventId);
        const replyItems = toReplyItems(post.eventId, getPubkeyHex() ?? post.pubkeyHex);
        const parentTargetId = anchorNode.parentEventId;
        const parentNode = parentTargetId ? nodesById[parentTargetId] ?? null : null;

        return {
            anchorEventId: post.eventId,
            parentTargetId,
            parentNode,
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

    async function loadParent(post: PostHistoryRecord, options: { force?: boolean } = {}): Promise<void> {
        const anchorNode = ensureAnchorNode(post);
        const parentEventId = anchorNode.parentEventId;
        if (!parentEventId) {
            return;
        }

        const currentExpansion = getExpansion(post.eventId, post.eventId);
        if (currentExpansion.loadingParent) {
            updateExpansion(post.eventId, post.eventId, (state) => ({
                ...state,
                visibleParent: true,
                showParentLoadingIndicator: false,
            }));
            scheduleParentLoadingIndicator(post.eventId, post.eventId);
            return;
        }

        if (!options.force && currentExpansion.loadedParent) {
            updateExpansion(post.eventId, post.eventId, (state) => ({
                ...state,
                visibleParent: true,
                showParentLoadingIndicator: false,
            }));
            return;
        }

        const activeRequestId = ++requestId;
        const key = buildAnchorNodeKey(post.eventId, post.eventId);
        updateExpansion(post.eventId, post.eventId, (state) => ({
            ...state,
            visibleParent: true,
            loadingParent: true,
            parentError: null,
            parentMissing: false,
            showParentLoadingIndicator: false,
        }));
        scheduleParentLoadingIndicator(post.eventId, post.eventId);

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
                ...getParentRelayHints(post, anchorNode),
            ]);
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
                clearParentLoadingDelayTimer(key);
                updateExpansion(post.eventId, post.eventId, (state) => ({
                    ...state,
                    loadedParent: true,
                    visibleParent: true,
                    loadingParent: false,
                    parentMissing: true,
                    showParentLoadingIndicator: false,
                    lastFetchedParentAt: Date.now(),
                }));
                return;
            }

            const node = await upsertNodeWithProfile({
                event,
                relayUrls: parentRelayHints,
                sources: ["history-record", "fetched-parent"],
            });
            upsertParentEdge(node.eventId, node.parentEventId);
            clearParentLoadingDelayTimer(key);
            updateExpansion(post.eventId, post.eventId, (state) => ({
                ...state,
                loadedParent: true,
                visibleParent: true,
                loadingParent: false,
                parentError: null,
                parentMissing: false,
                showParentLoadingIndicator: false,
                lastFetchedParentAt: Date.now(),
            }));
            return;
        }

        const rxNostr = getRxNostr();
        if (!rxNostr) {
            clearParentLoadingDelayTimer(key);
            updateExpansion(post.eventId, post.eventId, (state) => ({
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
            relayHints: getParentRelayHints(post, anchorNode),
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
            updateExpansion(post.eventId, post.eventId, (state) => ({
                ...state,
                loadedParent: true,
                loadingParent: false,
                parentMissing: true,
                showParentLoadingIndicator: false,
                lastFetchedParentAt: Date.now(),
            }));
            return;
        }

        const fetchedParentRelayHints = sanitizeRelayUrls([
            ...(result.relayUrl ? [result.relayUrl] : []),
            ...getParentRelayHints(post, anchorNode),
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
            updateExpansion(post.eventId, post.eventId, (state) => ({
                ...state,
                loadedParent: true,
                visibleParent: true,
                loadingParent: false,
                parentMissing: true,
                parentError: null,
                showParentLoadingIndicator: false,
                lastFetchedParentAt: Date.now(),
            }));
            return;
        }

        const node = await upsertNodeWithProfile({
            event: result.event,
            relayUrls: fetchedParentRelayHints,
            sources: ["fetched-parent"],
        });
        upsertParentEdge(node.eventId, node.parentEventId);
        updateExpansion(post.eventId, post.eventId, (state) => ({
            ...state,
            loadedParent: true,
            visibleParent: true,
            loadingParent: false,
            parentError: null,
            parentMissing: false,
            showParentLoadingIndicator: false,
            lastFetchedParentAt: Date.now(),
        }));
    }

    function hideParent(post: PostHistoryRecord): void {
        clearParentLoadingDelayTimer(buildAnchorNodeKey(post.eventId, post.eventId));
        updateExpansion(post.eventId, post.eventId, (state) => ({
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

    async function loadChildren(post: PostHistoryRecord, options: { force?: boolean } = {}): Promise<void> {
        const anchorNode = ensureAnchorNode(post);
        const currentExpansion = getExpansion(post.eventId, post.eventId);
        if (currentExpansion.loadingChildren) {
            updateExpansion(post.eventId, post.eventId, (state) => ({
                ...state,
                visibleChildren: true,
            }));
            return;
        }

        if (!options.force && currentExpansion.loadedChildren) {
            const hasReplies = (childrenByParentId[post.eventId] ?? []).length > 0;
            updateExpansion(post.eventId, post.eventId, (state) => ({
                ...state,
                visibleChildren: hasReplies,
            }));
            return;
        }

        const activeRequestId = ++requestId;
        updateExpansion(post.eventId, post.eventId, (state) => ({
            ...state,
            loadingChildren: true,
            visibleChildren: true,
            childrenError: null,
        }));

        try {
            const rawCachedRecords = await replyEventsAdapterImpl.getDirectReplyRecords(post.eventId);
            await fetchAndStoreDeletionRequests(
                post.eventId,
                rawCachedRecords.map((record) => toEventFromReplyRecord(record)),
                getChildrenRelayHints(post, anchorNode),
            );
            const cachedRecords = await filterVisibleReplyRecords(
                rawCachedRecords,
            );
            if (activeRequestId !== requestId || !getShow()) {
                return;
            }

            if (!options.force && cachedRecords.length > 0) {
                await upsertReplyRecords(post.eventId, cachedRecords, ["reply-db"]);
                updateExpansion(post.eventId, post.eventId, (state) => ({
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
                updateExpansion(post.eventId, post.eventId, (state) => ({
                    ...state,
                    loadedChildren: cachedRecords.length > 0,
                    visibleChildren: cachedRecords.length > 0,
                    loadingChildren: false,
                    childrenError: cachedRecords.length > 0 ? null : "nostr_not_ready",
                }));
                return;
            }

            const key = buildAnchorNodeKey(post.eventId, post.eventId);
            childrenTasksByKey.get(key)?.cancel();
            const task = replyFetchService.fetchDirectReplies(rxNostr, {
                eventId: post.eventId,
                createdAt: post.createdAt,
                relayHints: getChildrenRelayHints(post, anchorNode),
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
                    ...getChildrenRelayHints(post, anchorNode),
                    ...result.relayUrls,
                ],
            );
            const fetchedEvents = await filterVisibleReplyItems(result.events);
            await replyEventsRepositoryImpl.upsertDirectReplies({
                parentEventId: post.eventId,
                events: fetchedEvents,
                fetchedAt: result.fetchedAt,
            });
            const nextRecords = await filterVisibleReplyRecords(
                await replyEventsAdapterImpl.getDirectReplyRecords(post.eventId),
            );
            if (activeRequestId !== requestId || !getShow()) {
                return;
            }

            await upsertReplyRecords(post.eventId, nextRecords, ["reply-db", "fetched-child"]);
            const hasReplies = (childrenByParentId[post.eventId] ?? []).length > 0;
            const latestExpansion = getExpansion(post.eventId, post.eventId);
            updateExpansion(post.eventId, post.eventId, (state) => ({
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

            updateExpansion(post.eventId, post.eventId, (state) => ({
                ...state,
                loadingChildren: false,
                visibleChildren: false,
                childrenError: "fetch_failed",
            }));
        }
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
        updateExpansion(post.eventId, post.eventId, (state) => ({
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
        const parentExpansion = expansionByAnchorNodeKey[buildAnchorNodeKey(parentEventId, parentEventId)];
        if (!parentPost && !parentExpansion) {
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
        updateExpansion(parentEventId, parentEventId, (state) => ({
            ...state,
            loadedChildren: true,
            loadingChildren: false,
            childrenError: null,
        }));

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
        toggleChildren,
        retryChildren,
        recordPostedReply,
        recordDeletedEvent,
        cancelCurrentGraphFetches,
        resetState,
    };
}
