import type { RxNostr } from "rx-nostr";
import {
    POST_HISTORY_FETCH_KINDS,
    POST_HISTORY_INITIAL_FETCH_LIMIT,
    POST_HISTORY_PAGE_SIZE,
    POST_HISTORY_RELAY_FETCH_LIMIT,
    postHistoryRelayFetchService,
    type PostHistoryRelayFetchResult,
    type PostHistoryRelayFetchTask,
} from "../postHistoryRelayFetchService";
import {
    collectPostHistoryMediaUrls,
    resolveSafePage,
    canContinueRelayHistory,
    resolveSyncStatusAfterFetch,
} from "../postHistoryDialogUtils";
import { postMediaCacheService } from "../postMediaCacheService";
import {
    clearPersistedPostHistoryViewStateForPubkey,
    readPersistedPostHistoryViewState,
    writePersistedPostHistoryViewState,
} from "../postHistoryDialogViewState";
import { postHistoryLocalSearchService } from "../postHistoryLocalSearchService";
import {
    postHistoryCurrentViewRefetchService,
    type PostHistoryCurrentViewRefetchTask,
} from "../postHistoryCurrentViewRefetchService";
import {
    postHistoryRepository,
    type PostHistoryTimelineCursor,
} from "../storage/postHistoryRepository";
import {
    buildPostHistoryVisibleKindsKey,
    postHistoryVisibleRangeRepository,
} from "../storage/postHistoryVisibleRangeRepository";
import type { PostHistoryRecord } from "../storage/ehagakiDb";
import type { RelayConfig } from "../types";

export type PostHistorySyncStatus =
    | "idle"
    | "syncing"
    | "older-syncing"
    | "synced"
    | "failed"
    | "no-more";

type PostHistoryCurrentViewRefetchMessageValues = Record<
    string,
    string | number | boolean | Date | null | undefined
>;

interface UsePostHistoryListingParams {
    getShow: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    pageSize?: number;
    searchDebounceMs?: number;
}

interface PersistedPostHistoryListingSnapshot {
    loadedPosts: PostHistoryRecord[];
    searchPosts: PostHistoryRecord[];
    totalCount: number;
    searchTotalCount: number;
    searchHasNext: boolean;
    hasMoreRemote: boolean;
    nextUntil: number | null;
    visibleUntil: number | null;
    hasOlderLocal: boolean;
    hasNewerLocal: boolean;
}

const DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT: PersistedPostHistoryListingSnapshot = {
    loadedPosts: [],
    searchPosts: [],
    totalCount: 0,
    searchTotalCount: 0,
    searchHasNext: false,
    hasMoreRemote: false,
    nextUntil: null,
    visibleUntil: null,
    hasOlderLocal: false,
    hasNewerLocal: false,
};

const POST_HISTORY_VISIBLE_KINDS_KEY = buildPostHistoryVisibleKindsKey([
    ...POST_HISTORY_FETCH_KINDS,
]);
const POST_HISTORY_REPAIR_PREFERRED_PADDING_SECONDS = 24 * 60 * 60;

const persistedListingSnapshotByPubkey = new Map<
    string,
    PersistedPostHistoryListingSnapshot
>();

function resolveListingSnapshotKey(
    pubkeyHex: string | null | undefined,
): string | null {
    if (typeof pubkeyHex !== "string") {
        return null;
    }

    const normalizedPubkeyHex = pubkeyHex.trim();
    return normalizedPubkeyHex.length > 0 ? normalizedPubkeyHex : null;
}

function cloneListingSnapshot(
    snapshot: PersistedPostHistoryListingSnapshot,
): PersistedPostHistoryListingSnapshot {
    return {
        loadedPosts: [...snapshot.loadedPosts],
        searchPosts: [...snapshot.searchPosts],
        totalCount: snapshot.totalCount,
        searchTotalCount: snapshot.searchTotalCount,
        searchHasNext: snapshot.searchHasNext,
        hasMoreRemote: snapshot.hasMoreRemote,
        nextUntil: snapshot.nextUntil,
        visibleUntil: snapshot.visibleUntil,
        hasOlderLocal: snapshot.hasOlderLocal,
        hasNewerLocal: snapshot.hasNewerLocal,
    };
}

function readPersistedListingSnapshot(
    pubkeyHex: string | null | undefined,
): PersistedPostHistoryListingSnapshot {
    const key = resolveListingSnapshotKey(pubkeyHex);
    if (!key) {
        return cloneListingSnapshot(
            DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT,
        );
    }

    return cloneListingSnapshot(
        persistedListingSnapshotByPubkey.get(key) ??
        DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT,
    );
}

function writePersistedListingSnapshot(
    pubkeyHex: string | null | undefined,
    snapshot: PersistedPostHistoryListingSnapshot,
): void {
    const key = resolveListingSnapshotKey(pubkeyHex);
    if (!key) {
        return;
    }

    persistedListingSnapshotByPubkey.set(key, cloneListingSnapshot(snapshot));
}

export function clearPersistedPostHistoryListingSnapshots(): void {
    persistedListingSnapshotByPubkey.clear();
}

export function clearPersistedPostHistoryListingSnapshotForPubkey(
    pubkeyHex: string | null | undefined,
): void {
    const key = resolveListingSnapshotKey(pubkeyHex);
    if (!key) {
        return;
    }

    persistedListingSnapshotByPubkey.delete(key);
}

export function usePostHistoryListing({
    getShow,
    getPubkeyHex,
    getRxNostr,
    getRelayConfig,
    pageSize = POST_HISTORY_PAGE_SIZE,
    searchDebounceMs = 250,
}: UsePostHistoryListingParams) {
    const persistedViewState = readPersistedPostHistoryViewState(
        getPubkeyHex(),
    );
    const persistedListingSnapshot = readPersistedListingSnapshot(
        getPubkeyHex(),
    );
    const state = $state({
        loadedPosts: persistedListingSnapshot.loadedPosts,
        searchPosts: persistedListingSnapshot.searchPosts,
        searchInput: persistedViewState.searchInput,
        searchQuery: persistedViewState.searchQuery,
        currentPage: 1,
        searchPage: persistedViewState.searchPage,
        totalCount: persistedListingSnapshot.totalCount,
        searchTotalCount: persistedListingSnapshot.searchTotalCount,
        searchHasNext: persistedListingSnapshot.searchHasNext,
        syncStatus: "idle" as PostHistorySyncStatus,
        currentViewRefetchStatus: "idle" as "idle" | "refetching",
        currentViewRefetchMessageKey: null as string | null,
        currentViewRefetchMessageValues:
            null as PostHistoryCurrentViewRefetchMessageValues | null,
        hasMoreRemote: persistedListingSnapshot.hasMoreRemote,
        nextUntil: persistedListingSnapshot.nextUntil,
        visibleUntil: persistedListingSnapshot.visibleUntil,
        hasOlderLocal: persistedListingSnapshot.hasOlderLocal,
        hasNewerLocal: persistedListingSnapshot.hasNewerLocal,
    });

    let loadRequestId = 0;
    let searchLoadRequestId = 0;
    let hasStartedInitialSync = false;
    let hasAttemptedInitialLocalLoad = false;
    let initialLocalLoadKey: string | null = null;
    let currentFetchTask: PostHistoryRelayFetchTask | null = null;
    let fetchRequestId = 0;
    let currentViewRefetchTask: PostHistoryCurrentViewRefetchTask | null = null;
    let currentViewRefetchMessageClearTimeout: ReturnType<typeof setTimeout> | null = null;
    let appliedSearchQuery = "";
    const maxVisiblePosts = Math.max(pageSize * 3, pageSize);

    const isSearchMode = $derived(state.searchQuery.length > 0);
    const isRefetchingAroundCurrentView = $derived(
        state.currentViewRefetchStatus === "refetching",
    );
    const posts = $derived(
        isSearchMode ? state.searchPosts : state.loadedPosts,
    );
    const displayPage = $derived(
        isSearchMode ? state.searchPage : 1,
    );
    const displayTotalCount = $derived(
        isSearchMode ? state.searchTotalCount : state.totalCount,
    );
    const totalPages = $derived(
        isSearchMode
            ? Math.max(1, Math.ceil(state.searchTotalCount / pageSize))
            : 1,
    );
    const canGoPrevious = $derived(
        !isRefetchingAroundCurrentView && isSearchMode && state.searchPage > 1,
    );
    const canGoFirst = $derived(canGoPrevious);
    const canGoNext = $derived(
        !isRefetchingAroundCurrentView && isSearchMode && state.searchHasNext,
    );
    const canGoLast = $derived(canGoNext);
    const showPaging = $derived(false);
    const canLoadOlder = $derived(
        !isRefetchingAroundCurrentView && (isSearchMode ? state.searchHasNext : state.hasOlderLocal),
    );
    const canLoadNewer = $derived(
        !isRefetchingAroundCurrentView && (isSearchMode ? state.searchPage > 1 : state.hasNewerLocal),
    );
    const canReturnToLatest = $derived(
        !isSearchMode && !isRefetchingAroundCurrentView && state.hasNewerLocal,
    );
    const canJumpToOldest = $derived(
        !isSearchMode && !isRefetchingAroundCurrentView && state.hasOlderLocal,
    );
    const canFetchOlderFromRelays = $derived(
        !isSearchMode &&
        !!getPubkeyHex() &&
        !!getRxNostr() &&
        !isRefetchingAroundCurrentView &&
        state.syncStatus !== "syncing" &&
        state.syncStatus !== "older-syncing" &&
        state.syncStatus !== "no-more" &&
        state.hasMoreRemote &&
        state.nextUntil !== null,
    );
    const isFetchingOlderFromRelays = $derived(
        !isSearchMode && state.syncStatus === "older-syncing",
    );
    const showLocalExhaustedState = $derived(
        !isSearchMode &&
        state.loadedPosts.length > 0 &&
        !state.hasOlderLocal &&
        state.syncStatus !== "syncing",
    );
    const visibleNewestCreatedAt = $derived(posts[0]?.createdAt ?? null);
    const visibleOldestCreatedAt = $derived(
        posts.length > 0 ? posts[posts.length - 1]?.createdAt ?? null : null,
    );
    const visiblePostCount = $derived(posts.length);
    const canRefetchAroundCurrentView = $derived(
        !!getPubkeyHex() &&
        !!getRxNostr() &&
        !isSearchMode &&
        state.loadedPosts.length > 0 &&
        !isRefetchingAroundCurrentView &&
        state.syncStatus !== "syncing" &&
        state.syncStatus !== "older-syncing",
    );
    const syncStatusMessageKey = $derived(
        isSearchMode || state.syncStatus === "idle"
            ? null
            : state.syncStatus === "syncing" ||
                state.syncStatus === "older-syncing"
                ? "postHistory.syncing"
                : state.syncStatus === "synced"
                    ? "postHistory.synced"
                    : state.syncStatus === "no-more"
                        ? null
                        : "postHistory.syncFailed",
    );
    const showSyncLoader = $derived(
        !isSearchMode &&
        (state.syncStatus === "syncing" ||
            state.syncStatus === "older-syncing"),
    );
    const showStatusLoader = $derived(
        showSyncLoader || isRefetchingAroundCurrentView,
    );
    const currentViewRefetchStatusMessageKey = $derived(
        state.currentViewRefetchStatus === "refetching"
            ? "postHistory.repairing"
            : state.currentViewRefetchMessageKey,
    );
    const currentViewRefetchStatusMessageValues = $derived(
        state.currentViewRefetchStatus === "refetching"
            ? null
            : state.currentViewRefetchMessageValues,
    );

    function cancelCurrentSync(): void {
        fetchRequestId += 1;
        currentFetchTask?.cancel();
        currentFetchTask = null;
    }

    function isCurrentFetchRequest(requestId: number): boolean {
        return requestId === fetchRequestId;
    }

    function cancelCurrentViewRefetch(): void {
        currentViewRefetchTask?.cancel();
        currentViewRefetchTask = null;
        if (state.currentViewRefetchStatus === "refetching") {
            state.currentViewRefetchStatus = "idle";
        }
        clearCurrentViewRefetchMessageClearTimeout();
    }

    function clearCurrentViewRefetchMessageClearTimeout(): void {
        if (currentViewRefetchMessageClearTimeout !== null) {
            clearTimeout(currentViewRefetchMessageClearTimeout);
            currentViewRefetchMessageClearTimeout = null;
        }
    }

    function clearCurrentViewRefetchFeedback(): void {
        state.currentViewRefetchMessageKey = null;
        state.currentViewRefetchMessageValues = null;
        clearCurrentViewRefetchMessageClearTimeout();
    }

    function scheduleCurrentViewRefetchMessageClearIfNeeded(): void {
        clearCurrentViewRefetchMessageClearTimeout();

        const autoHideMessageKeys = new Set([
            "postHistory.repairNoChanges",
            "postHistory.repairAdded",
            "postHistory.repairPartialFailure",
        ]);

        if (!autoHideMessageKeys.has(state.currentViewRefetchMessageKey ?? "")) {
            return;
        }

        currentViewRefetchMessageClearTimeout = setTimeout(() => {
            if (state.currentViewRefetchMessageKey !== null && autoHideMessageKeys.has(state.currentViewRefetchMessageKey)) {
                state.currentViewRefetchMessageKey = null;
                state.currentViewRefetchMessageValues = null;
            }
            currentViewRefetchMessageClearTimeout = null;
        }, 3500);
    }

    function resetSearchState(): void {
        state.searchInput = "";
        state.searchQuery = "";
        state.searchPage = 1;
        state.searchPosts = [];
        state.searchTotalCount = 0;
        state.searchHasNext = false;
        appliedSearchQuery = "";
    }

    function resetListingStateAfterLocalDelete(): void {
        state.loadedPosts = [];
        state.searchPosts = [];
        state.totalCount = 0;
        state.searchTotalCount = 0;
        state.searchHasNext = false;
        state.currentPage = 1;
        state.searchPage = 1;
        state.hasMoreRemote = false;
        state.nextUntil = null;
        state.visibleUntil = null;
        state.hasOlderLocal = false;
        state.hasNewerLocal = false;
        state.syncStatus = "idle";
        clearCurrentViewRefetchFeedback();
        resetSearchState();
        hasStartedInitialSync = true;
    }

    function resetState(): void {
        cancelCurrentSync();
        cancelCurrentViewRefetch();
        state.syncStatus = "idle";
        clearCurrentViewRefetchFeedback();
        hasStartedInitialSync = false;
        hasAttemptedInitialLocalLoad = false;
        initialLocalLoadKey = null;
    }

    function updateRelayHistoryCursor(
        result: PostHistoryRelayFetchResult,
    ): void {
        const canContinue = canContinueRelayHistory(result);
        state.hasMoreRemote = canContinue;
        state.nextUntil = canContinue ? result.nextUntil : null;
    }

    function buildCurrentPagePreferredRanges() {
        if (state.searchQuery) {
            return [];
        }

        const createdAtValues = state.loadedPosts
            .map((post) => post.createdAt)
            .filter((createdAt) => Number.isFinite(createdAt))
            .map((createdAt) => Math.trunc(createdAt));

        if (createdAtValues.length === 0) {
            return [];
        }

        const minCreatedAt = Math.min(...createdAtValues);
        const maxCreatedAt = Math.max(...createdAtValues);

        return [{
            kinds: [...POST_HISTORY_FETCH_KINDS],
            rangeUnit: "custom" as const,
            since: Math.max(
                0,
                minCreatedAt - POST_HISTORY_REPAIR_PREFERRED_PADDING_SECONDS,
            ),
            until: maxCreatedAt + POST_HISTORY_REPAIR_PREFERRED_PADDING_SECONDS,
            limit: POST_HISTORY_RELAY_FETCH_LIMIT,
        }];
    }

    async function readVisibleUntil(pubkeyHex: string): Promise<number | null> {
        const visibleRange = await postHistoryVisibleRangeRepository.get(
            pubkeyHex,
            POST_HISTORY_VISIBLE_KINDS_KEY,
        );

        return visibleRange?.visibleUntil ?? null;
    }

    async function refreshVisibleUntil(pubkeyHex: string): Promise<number | null> {
        const visibleUntil = await readVisibleUntil(pubkeyHex);

        if (getShow() && getPubkeyHex() === pubkeyHex) {
            state.visibleUntil = visibleUntil;
        }

        return visibleUntil;
    }

    async function updateVisibleUntilFromFetch(
        pubkeyHex: string,
        result: PostHistoryRelayFetchResult,
    ): Promise<number | null> {
        const currentVisibleUntil = await readVisibleUntil(pubkeyHex);
        const candidateVisibleUntil = result.events.length > 0
            && typeof result.nextUntil === "number"
            ? result.nextUntil
            : null;
        const nextVisibleUntil = typeof candidateVisibleUntil === "number"
            ? typeof currentVisibleUntil === "number"
                ? Math.min(currentVisibleUntil, candidateVisibleUntil)
                : candidateVisibleUntil
            : currentVisibleUntil;

        if (nextVisibleUntil !== currentVisibleUntil) {
            await postHistoryVisibleRangeRepository.save({
                pubkeyHex,
                kindsKey: POST_HISTORY_VISIBLE_KINDS_KEY,
                visibleUntil: nextVisibleUntil,
            });
        }

        state.visibleUntil = nextVisibleUntil;
        return nextVisibleUntil;
    }

    async function maybeExtendVisibleUntilFromCurrentViewRefetchResult(
        pubkeyHex: string,
        previousVisibleUntil: number | null,
        processedRanges: Array<{
            source: string;
            status: string;
            since?: number;
            until?: number;
        }>,
    ): Promise<number | null> {
        if (typeof previousVisibleUntil !== "number") {
            return previousVisibleUntil;
        }

        const candidateVisibleUntils = processedRanges
            .filter((range) =>
                range.source === "preferred"
                && range.status === "complete"
                && typeof range.since === "number"
                && typeof range.until === "number"
                && range.until >= previousVisibleUntil - 1,
            )
            .map((range) => range.since as number);

        if (candidateVisibleUntils.length === 0) {
            return previousVisibleUntil;
        }

        const nextVisibleUntil = Math.min(
            previousVisibleUntil,
            ...candidateVisibleUntils,
        );
        if (nextVisibleUntil === previousVisibleUntil) {
            return previousVisibleUntil;
        }

        await postHistoryVisibleRangeRepository.save({
            pubkeyHex,
            kindsKey: POST_HISTORY_VISIBLE_KINDS_KEY,
            visibleUntil: nextVisibleUntil,
        });
        state.visibleUntil = nextVisibleUntil;
        return nextVisibleUntil;
    }

    async function countVisiblePosts(
        pubkeyHex: string,
        visibleUntil: number | null,
    ): Promise<number> {
        return typeof visibleUntil === "number"
            ? postHistoryRepository.countVisibleForPubkey(pubkeyHex, visibleUntil)
            : postHistoryRepository.countForPubkey(pubkeyHex);
    }

    async function prefetchCurrentPageMedia(
        posts: PostHistoryRecord[],
    ): Promise<void> {
        if (!postMediaCacheService.canUsePersistentCache()) {
            return;
        }

        const urls = collectPostHistoryMediaUrls(posts);
        if (urls.length === 0) {
            return;
        }

        try {
            await postMediaCacheService.prefetchCachedMediaDescriptors(urls);
        } catch {
            // Media descriptor prefetch is best-effort and must not block listing updates.
        }
    }

    function toTimelineCursor(
        post: PostHistoryRecord | null | undefined,
    ): PostHistoryTimelineCursor | null {
        if (!post) {
            return null;
        }

        return {
            eventId: post.eventId,
            postedAt: post.postedAt,
            createdAt: post.createdAt,
        };
    }

    function trimVisiblePosts(
        nextPosts: PostHistoryRecord[],
        direction: "older" | "newer",
    ): PostHistoryRecord[] {
        if (nextPosts.length <= maxVisiblePosts) {
            return nextPosts;
        }

        return direction === "older"
            ? nextPosts.slice(nextPosts.length - maxVisiblePosts)
            : nextPosts.slice(0, maxVisiblePosts);
    }

    async function refreshTimelineAvailability(
        pubkeyHex: string,
        currentPosts: PostHistoryRecord[] = state.loadedPosts,
        expectedRequestId: number | null = null,
    ): Promise<void> {
        if (currentPosts.length === 0) {
            if (
                getShow() &&
                getPubkeyHex() === pubkeyHex &&
                (expectedRequestId === null || expectedRequestId === loadRequestId)
            ) {
                state.hasOlderLocal = false;
                state.hasNewerLocal = false;
            }
            return;
        }

        const newestCursor = toTimelineCursor(currentPosts[0]);
        const oldestCursor = toTimelineCursor(currentPosts[currentPosts.length - 1]);
        const visibleUntil = state.visibleUntil;
        const [newerPosts, olderPosts] = await Promise.all([
            newestCursor
                ? postHistoryRepository.getNewerVisibleChunk({
                    pubkeyHex,
                    visibleUntil,
                    cursor: newestCursor,
                    limit: 1,
                })
                : Promise.resolve([]),
            oldestCursor
                ? postHistoryRepository.getOlderVisibleChunk({
                    pubkeyHex,
                    visibleUntil,
                    cursor: oldestCursor,
                    limit: 1,
                })
                : Promise.resolve([]),
        ]);

        if (
            !getShow() ||
            getPubkeyHex() !== pubkeyHex ||
            (expectedRequestId !== null && expectedRequestId !== loadRequestId)
        ) {
            return;
        }

        state.hasNewerLocal = newerPosts.length > 0;
        state.hasOlderLocal = olderPosts.length > 0;
    }

    async function loadLatestVisiblePosts(): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex) {
            state.loadedPosts = [];
            state.totalCount = 0;
            state.visibleUntil = null;
            state.hasOlderLocal = false;
            state.hasNewerLocal = false;
            return;
        }

        const requestId = ++loadRequestId;
        const visibleUntil = await refreshVisibleUntil(pubkeyHex);
        const [count, latestPosts] = await Promise.all([
            countVisiblePosts(pubkeyHex, visibleUntil),
            postHistoryRepository.getLatestVisibleChunk({
                pubkeyHex,
                limit: pageSize,
                visibleUntil,
            }),
        ]);

        if (!getShow() || requestId !== loadRequestId) {
            return;
        }

        await prefetchCurrentPageMedia(latestPosts);
        if (!getShow() || requestId !== loadRequestId) {
            return;
        }

        state.totalCount = count;
        state.loadedPosts = latestPosts;
        await refreshTimelineAvailability(pubkeyHex, latestPosts, requestId);
    }

    async function reloadVisibleWindowFromCurrentNewest(): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || state.loadedPosts.length === 0) {
            await loadLatestVisiblePosts();
            return;
        }

        const newestPost = state.loadedPosts[0];
        const newestCursor = toTimelineCursor(newestPost);
        if (!newestCursor) {
            await loadLatestVisiblePosts();
            return;
        }

        const requestId = ++loadRequestId;
        const visibleUntil = await refreshVisibleUntil(pubkeyHex);
        const [count, olderPosts] = await Promise.all([
            countVisiblePosts(pubkeyHex, visibleUntil),
            state.loadedPosts.length > 1
                ? postHistoryRepository.getOlderVisibleChunk({
                    pubkeyHex,
                    visibleUntil,
                    cursor: newestCursor,
                    limit: state.loadedPosts.length - 1,
                })
                : Promise.resolve([]),
        ]);

        if (!getShow() || requestId !== loadRequestId) {
            return;
        }

        const nextPosts = [newestPost, ...olderPosts];
        await prefetchCurrentPageMedia(nextPosts);
        if (!getShow() || requestId !== loadRequestId) {
            return;
        }

        state.totalCount = count;
        state.loadedPosts = nextPosts;
        await refreshTimelineAvailability(pubkeyHex, nextPosts, requestId);
    }

    async function refreshTotalCountFromRepository(): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || !getShow()) {
            return;
        }

        const visibleUntil = await refreshVisibleUntil(pubkeyHex);
        const count = await countVisiblePosts(pubkeyHex, visibleUntil);
        if (!getShow()) {
            return;
        }

        state.totalCount = count;
    }

    async function loadOlderVisiblePosts(): Promise<boolean> {
        const pubkeyHex = getPubkeyHex();
        const oldestCursor = toTimelineCursor(
            state.loadedPosts[state.loadedPosts.length - 1],
        );
        if (!pubkeyHex || !oldestCursor) {
            await loadLatestVisiblePosts();
            return state.loadedPosts.length > 0;
        }

        const requestId = ++loadRequestId;
        const visibleUntil = await refreshVisibleUntil(pubkeyHex);
        const olderPosts = await postHistoryRepository.getOlderVisibleChunk({
            pubkeyHex,
            visibleUntil,
            cursor: oldestCursor,
            limit: pageSize,
        });

        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        if (olderPosts.length === 0) {
            state.hasOlderLocal = false;
            return false;
        }

        const nextPosts = trimVisiblePosts(
            [...state.loadedPosts, ...olderPosts],
            "older",
        );
        await prefetchCurrentPageMedia(nextPosts);
        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        state.loadedPosts = nextPosts;
        await refreshTimelineAvailability(pubkeyHex, nextPosts, requestId);
        return true;
    }

    async function loadNewerVisiblePosts(): Promise<boolean> {
        const pubkeyHex = getPubkeyHex();
        const newestCursor = toTimelineCursor(state.loadedPosts[0]);
        if (!pubkeyHex || !newestCursor) {
            return false;
        }

        const requestId = ++loadRequestId;
        const visibleUntil = await refreshVisibleUntil(pubkeyHex);
        const newerPosts = await postHistoryRepository.getNewerVisibleChunk({
            pubkeyHex,
            visibleUntil,
            cursor: newestCursor,
            limit: pageSize,
        });

        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        if (newerPosts.length === 0) {
            state.hasNewerLocal = false;
            return false;
        }

        const nextPosts = trimVisiblePosts(
            [...newerPosts, ...state.loadedPosts],
            "newer",
        );
        await prefetchCurrentPageMedia(nextPosts);
        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        state.loadedPosts = nextPosts;
        await refreshTimelineAvailability(pubkeyHex, nextPosts, requestId);
        return true;
    }

    async function jumpToCreatedAt(createdAt: number): Promise<boolean> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex) {
            return false;
        }

        const requestId = ++loadRequestId;
        const visibleUntil = await refreshVisibleUntil(pubkeyHex);
        const [count, datePosts] = await Promise.all([
            countVisiblePosts(pubkeyHex, visibleUntil),
            postHistoryRepository.getVisibleChunkFromCreatedAt({
                pubkeyHex,
                visibleUntil,
                createdAt,
                limit: pageSize,
            }),
        ]);

        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        if (datePosts.length === 0) {
            state.totalCount = count;
            state.loadedPosts = [];
            state.hasOlderLocal = false;
            state.hasNewerLocal = false;
            return false;
        }

        await prefetchCurrentPageMedia(datePosts);
        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        state.totalCount = count;
        state.loadedPosts = datePosts;
        await refreshTimelineAvailability(pubkeyHex, datePosts, requestId);
        return true;
    }

    async function loadSearchPage(page: number, query: string): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || !query) {
            state.searchPosts = [];
            state.searchTotalCount = 0;
            state.searchHasNext = false;
            return;
        }

        const requestId = ++searchLoadRequestId;
        const normalizedPage = Math.max(1, Math.trunc(page));
        const visibleUntil = await refreshVisibleUntil(pubkeyHex);
        const result = await postHistoryLocalSearchService.searchLocalPosts({
            pubkeyHex,
            query,
            page: normalizedPage,
            pageSize,
            ...(typeof visibleUntil === "number" ? { visibleUntil } : {}),
        });

        if (
            !getShow() ||
            requestId !== searchLoadRequestId ||
            query !== state.searchQuery
        ) {
            return;
        }

        const safePage = resolveSafePage(
            normalizedPage,
            result.total,
            pageSize,
        );
        if (safePage !== normalizedPage) {
            state.searchPage = safePage;
            return;
        }

        await prefetchCurrentPageMedia(result.items);
        if (
            !getShow() ||
            requestId !== searchLoadRequestId ||
            query !== state.searchQuery
        ) {
            return;
        }

        state.searchTotalCount = result.total;
        state.searchPosts = result.items;
        state.searchHasNext = result.hasNext;
    }

    async function syncFromRelays(): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!pubkeyHex || !rxNostr) {
            return;
        }

        cancelCurrentSync();
        const requestId = ++fetchRequestId;
        const previousVisibleUntil = await refreshVisibleUntil(pubkeyHex);
        if (
            !isCurrentFetchRequest(requestId) ||
            !getShow() ||
            getPubkeyHex() !== pubkeyHex
        ) {
            return;
        }

        const task = postHistoryRelayFetchService.fetchLatest(rxNostr, {
            pubkeyHex,
            relayConfig: getRelayConfig(),
            limit: POST_HISTORY_INITIAL_FETCH_LIMIT,
        });
        currentFetchTask = task;

        const result = await task.promise;
        let upsertSummary = {
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
        };

        if (!isCurrentFetchRequest(requestId) || currentFetchTask !== task) {
            return;
        }

        currentFetchTask = null;
        if (!getShow() || result.status === "cancelled") {
            return;
        }

        if (result.events.length > 0) {
            upsertSummary = await postHistoryRepository.upsertFetchedEvents({
                events: result.events,
                fetchedAt: result.fetchedAt,
            });
        }
        if (!isCurrentFetchRequest(requestId) || !getShow()) {
            return;
        }

        const nextVisibleUntil = await updateVisibleUntilFromFetch(
            pubkeyHex,
            result,
        );
        if (!isCurrentFetchRequest(requestId) || !getShow()) {
            return;
        }

        const didVisibleMateriallyChange =
            nextVisibleUntil !== previousVisibleUntil;

        updateRelayHistoryCursor(result);

        if (state.searchQuery) {
            await loadSearchPage(state.searchPage, state.searchQuery);
        } else if (state.loadedPosts.length === 0 || !state.hasNewerLocal) {
            await loadLatestVisiblePosts();
        } else {
            await refreshTotalCountFromRepository();
            await refreshTimelineAvailability(pubkeyHex);
        }

        state.syncStatus = resolveSyncStatusAfterFetch(
            result,
            upsertSummary.insertedCount + upsertSummary.updatedCount > 0
            || didVisibleMateriallyChange,
        );
    }

    function goPreviousPage(): boolean {
        if (!isSearchMode || !canGoPrevious) {
            return false;
        }

        state.searchPage -= 1;
        return true;
    }

    function goFirstPage(): boolean {
        if (!isSearchMode || !canGoFirst) {
            return false;
        }

        state.searchPage = 1;
        return true;
    }

    async function goToNextPage(): Promise<boolean> {
        if (!isSearchMode || !canGoNext) {
            return false;
        }

        state.searchPage += 1;
        return true;
    }

    async function goToLastPage(): Promise<boolean> {
        if (!isSearchMode || !canGoLast) {
            return false;
        }

        state.searchPage = totalPages;
        return true;
    }

    async function loadOlder(): Promise<boolean> {
        if (isSearchMode) {
            return goToNextPage();
        }

        return loadOlderVisiblePosts();
    }

    async function loadNewer(): Promise<boolean> {
        if (isSearchMode) {
            return Promise.resolve(goPreviousPage());
        }

        return loadNewerVisiblePosts();
    }

    async function returnToLatest(): Promise<boolean> {
        if (isSearchMode) {
            return Promise.resolve(goFirstPage());
        }

        await loadLatestVisiblePosts();
        return true;
    }

    async function jumpToOldest(): Promise<boolean> {
        if (isSearchMode || !canJumpToOldest) {
            return false;
        }

        return jumpToCreatedAt(0);
    }

    async function fetchOlderFromRelays(): Promise<boolean> {
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!pubkeyHex || !rxNostr || !canFetchOlderFromRelays) {
            return false;
        }

        const fetchUntil = state.nextUntil;
        if (typeof fetchUntil !== "number") {
            state.syncStatus = "no-more";
            return false;
        }

        cancelCurrentSync();
        const requestId = ++fetchRequestId;
        state.syncStatus = "older-syncing";
        const previousVisibleUntil = await refreshVisibleUntil(pubkeyHex);
        if (
            !isCurrentFetchRequest(requestId) ||
            !getShow() ||
            getPubkeyHex() !== pubkeyHex
        ) {
            return false;
        }

        const previousCount = await countVisiblePosts(pubkeyHex, previousVisibleUntil);
        if (
            !isCurrentFetchRequest(requestId) ||
            !getShow() ||
            getPubkeyHex() !== pubkeyHex
        ) {
            return false;
        }

        let didMateriallyChange = false;

        const task = postHistoryRelayFetchService.fetchLatest(rxNostr, {
            pubkeyHex,
            relayConfig: getRelayConfig(),
            limit: POST_HISTORY_RELAY_FETCH_LIMIT,
            until: fetchUntil,
        });
        currentFetchTask = task;

        const result = await task.promise;
        if (!isCurrentFetchRequest(requestId) || currentFetchTask !== task) {
            return false;
        }

        currentFetchTask = null;
        if (!getShow() || result.status === "cancelled") {
            return false;
        }

        updateRelayHistoryCursor(result);

        if (result.events.length > 0) {
            const upsertSummary = await postHistoryRepository.upsertFetchedEvents({
                events: result.events,
                fetchedAt: result.fetchedAt,
            });
            didMateriallyChange =
                upsertSummary.insertedCount + upsertSummary.updatedCount > 0;
        }
        if (!isCurrentFetchRequest(requestId) || !getShow()) {
            return false;
        }

        const nextVisibleUntil = await updateVisibleUntilFromFetch(
            pubkeyHex,
            result,
        );
        if (!isCurrentFetchRequest(requestId) || !getShow()) {
            return false;
        }

        const nextCount = await countVisiblePosts(pubkeyHex, nextVisibleUntil);
        if (!isCurrentFetchRequest(requestId) || !getShow()) {
            return false;
        }

        const didVisibleCountIncrease = nextCount > previousCount;

        if (
            result.status === "success" &&
            !didVisibleCountIncrease &&
            !didMateriallyChange
        ) {
            if (state.hasMoreRemote && result.nextUntil === fetchUntil) {
                state.nextUntil = fetchUntil > 0 ? fetchUntil - 1 : null;
                state.hasMoreRemote = state.nextUntil !== null;
            }

            if (!state.hasMoreRemote) {
                state.nextUntil = null;
            }
        }

        let didLoadFetchedOlderPosts = false;

        if (state.searchQuery) {
            await loadSearchPage(state.searchPage, state.searchQuery);
        } else {
            state.totalCount = nextCount;
            if (didVisibleCountIncrease || didMateriallyChange) {
                didLoadFetchedOlderPosts = await loadOlderVisiblePosts();
            } else {
                await refreshTimelineAvailability(pubkeyHex);
            }
        }

        if (result.status !== "success") {
            state.syncStatus = "failed";
            return false;
        }

        state.syncStatus = didVisibleCountIncrease || didMateriallyChange
            ? resolveSyncStatusAfterFetch(result, true)
            : state.hasMoreRemote
                ? "idle"
                : "no-more";

        return didLoadFetchedOlderPosts ||
            didVisibleCountIncrease ||
            didMateriallyChange;
    }

    async function refetchAroundCurrentView(): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!pubkeyHex || !rxNostr || !canRefetchAroundCurrentView) {
            return;
        }

        const preferredRanges = buildCurrentPagePreferredRanges();
        if (preferredRanges.length === 0) {
            return;
        }

        clearCurrentViewRefetchFeedback();
        state.currentViewRefetchStatus = "refetching";
        const previousVisibleUntil = await refreshVisibleUntil(pubkeyHex);
        const task = postHistoryCurrentViewRefetchService.refetchAroundCurrentView(rxNostr, {
            pubkeyHex,
            relayConfig: getRelayConfig(),
            preferredRanges,
            onProgress: async () => {
                await refreshTotalCountFromRepository();
            },
        });
        currentViewRefetchTask = task;

        try {
            const result = await task.promise;
            if (currentViewRefetchTask !== task) {
                return;
            }

            currentViewRefetchTask = null;
            state.currentViewRefetchStatus = "idle";

            if (!getShow() || result.status === "cancelled") {
                return;
            }

            await maybeExtendVisibleUntilFromCurrentViewRefetchResult(
                pubkeyHex,
                previousVisibleUntil,
                result.processedRanges,
            );

            if (state.searchQuery) {
                await loadSearchPage(state.searchPage, state.searchQuery);
            } else if (state.loadedPosts.length === 0 || !state.hasNewerLocal) {
                await loadLatestVisiblePosts();
            } else {
                await reloadVisibleWindowFromCurrentNewest();
            }

            if (result.hadFailures) {
                state.currentViewRefetchMessageKey = "postHistory.repairPartialFailure";
                state.currentViewRefetchMessageValues = null;
            } else if (result.addedCount > 0) {
                state.currentViewRefetchMessageKey = "postHistory.repairAdded";
                state.currentViewRefetchMessageValues = {
                    count: result.addedCount,
                    processedRangeCount: result.processedRangeCount,
                    updatedCount: result.updatedCount,
                };
            } else {
                state.currentViewRefetchMessageKey = "postHistory.repairNoChanges";
                state.currentViewRefetchMessageValues = {
                    processedRangeCount: result.processedRangeCount,
                    updatedCount: result.updatedCount,
                };
            }

            scheduleCurrentViewRefetchMessageClearIfNeeded();
        } catch {
            if (currentViewRefetchTask !== task) {
                return;
            }

            currentViewRefetchTask = null;
            state.currentViewRefetchStatus = "idle";
            state.currentViewRefetchMessageKey = "postHistory.repairPartialFailure";
            state.currentViewRefetchMessageValues = null;
            scheduleCurrentViewRefetchMessageClearIfNeeded();
        }
    }

    async function deleteLocalHistory(): Promise<boolean> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex) {
            return false;
        }

        cancelCurrentSync();
        cancelCurrentViewRefetch();

        try {
            await Promise.all([
                postHistoryRepository.deleteForPubkey(pubkeyHex),
                postHistoryVisibleRangeRepository.clearForPubkey(pubkeyHex),
            ]);
        } catch {
            clearCurrentViewRefetchFeedback();
            state.currentViewRefetchMessageKey = "postHistory.deleteLocalHistoryFailed";
            state.currentViewRefetchMessageValues = null;
            return false;
        }

        clearPersistedPostHistoryViewStateForPubkey(pubkeyHex);
        clearPersistedPostHistoryListingSnapshotForPubkey(pubkeyHex);
        resetListingStateAfterLocalDelete();
        state.currentViewRefetchMessageKey = "postHistory.deleteLocalHistorySuccess";
        state.currentViewRefetchMessageValues = null;
        writePersistedPostHistoryViewState(pubkeyHex, {
            currentPage: 1,
            searchPage: 1,
            searchInput: "",
            searchQuery: "",
        });
        writePersistedListingSnapshot(pubkeyHex, {
            ...DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT,
        });
        return true;
    }

    function patchDeletedPost(
        eventId: string,
        deletedAt: number,
        deletionEventId: string,
    ): void {
        const applyDeletedState = (items: PostHistoryRecord[]) =>
            items.map((post) =>
                post.eventId === eventId
                    ? {
                        ...post,
                        deletedAt,
                        deletionEventId,
                    }
                    : post,
            );

        state.loadedPosts = applyDeletedState(state.loadedPosts);
        state.searchPosts = applyDeletedState(state.searchPosts);
    }

    $effect(() => {
        writePersistedPostHistoryViewState(getPubkeyHex(), {
            searchInput: state.searchInput,
            searchQuery: state.searchQuery,
            currentPage: state.currentPage,
            searchPage: state.searchPage,
        });
    });

    $effect(() => {
        writePersistedListingSnapshot(getPubkeyHex(), {
            loadedPosts: state.loadedPosts,
            searchPosts: state.searchPosts,
            totalCount: state.totalCount,
            searchTotalCount: state.searchTotalCount,
            searchHasNext: state.searchHasNext,
            hasMoreRemote: state.hasMoreRemote,
            nextUntil: state.nextUntil,
            visibleUntil: state.visibleUntil,
            hasOlderLocal: state.hasOlderLocal,
            hasNewerLocal: state.hasNewerLocal,
        });
    });

    $effect(() => {
        if (getShow()) {
            return;
        }

        resetState();
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        return () => {
            cancelCurrentSync();
        };
    });

    $effect(() => {
        if (!getShow() || !getPubkeyHex() || !getRxNostr() || hasStartedInitialSync) {
            return;
        }

        hasStartedInitialSync = true;
        state.syncStatus = "syncing";
        void syncFromRelays();
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        const nextSearchQuery = state.searchInput.trim();
        const timeoutId = setTimeout(() => {
            state.searchQuery = nextSearchQuery;
        }, searchDebounceMs);

        return () => {
            clearTimeout(timeoutId);
        };
    });

    $effect(() => {
        if (!getShow() || isSearchMode || state.loadedPosts.length > 0) {
            if (state.loadedPosts.length > 0) {
                hasAttemptedInitialLocalLoad = true;
                initialLocalLoadKey = resolveListingSnapshotKey(getPubkeyHex()) ?? "";
            }
            return;
        }

        const nextInitialLoadKey = resolveListingSnapshotKey(getPubkeyHex()) ?? "";
        if (
            hasAttemptedInitialLocalLoad
            && initialLocalLoadKey === nextInitialLoadKey
        ) {
            return;
        }

        hasAttemptedInitialLocalLoad = true;
        initialLocalLoadKey = nextInitialLoadKey;

        void loadLatestVisiblePosts();
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        const currentPosts = posts;
        if (currentPosts.length === 0) {
            return;
        }

        void prefetchCurrentPageMedia(currentPosts);
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        if (!state.searchQuery) {
            appliedSearchQuery = "";
            if (state.searchPage !== 1) {
                state.searchPage = 1;
                return;
            }

            state.searchPosts = [];
            state.searchTotalCount = 0;
            state.searchHasNext = false;
            return;
        }

        if (state.searchQuery !== appliedSearchQuery && state.searchPage !== 1) {
            appliedSearchQuery = state.searchQuery;
            state.searchPage = 1;
            return;
        }

        appliedSearchQuery = state.searchQuery;
        void loadSearchPage(state.searchPage, state.searchQuery);
    });

    return {
        state,
        get isSearchMode() {
            return isSearchMode;
        },
        get posts() {
            return posts;
        },
        get displayTotalCount() {
            return displayTotalCount;
        },
        get displayPage() {
            return displayPage;
        },
        get totalPages() {
            return totalPages;
        },
        get canGoPrevious() {
            return canGoPrevious;
        },
        get canGoFirst() {
            return canGoFirst;
        },
        get canGoNext() {
            return canGoNext;
        },
        get canGoLast() {
            return canGoLast;
        },
        get showPaging() {
            return showPaging;
        },
        get canLoadOlder() {
            return canLoadOlder;
        },
        get canLoadNewer() {
            return canLoadNewer;
        },
        get canReturnToLatest() {
            return canReturnToLatest;
        },
        get canJumpToOldest() {
            return canJumpToOldest;
        },
        get canFetchOlderFromRelays() {
            return canFetchOlderFromRelays;
        },
        get isFetchingOlderFromRelays() {
            return isFetchingOlderFromRelays;
        },
        get showLocalExhaustedState() {
            return showLocalExhaustedState;
        },
        get visibleNewestCreatedAt() {
            return visibleNewestCreatedAt;
        },
        get visibleOldestCreatedAt() {
            return visibleOldestCreatedAt;
        },
        get visiblePostCount() {
            return visiblePostCount;
        },
        get syncStatus() {
            return state.syncStatus;
        },
        get syncStatusMessageKey() {
            return syncStatusMessageKey;
        },
        get showSyncLoader() {
            return showSyncLoader;
        },
        get showStatusLoader() {
            return showStatusLoader;
        },
        get isRefetchingAroundCurrentView() {
            return isRefetchingAroundCurrentView;
        },
        get canRefetchAroundCurrentView() {
            return canRefetchAroundCurrentView;
        },
        get currentViewRefetchStatusMessageKey() {
            return currentViewRefetchStatusMessageKey;
        },
        get currentViewRefetchStatusMessageValues() {
            return currentViewRefetchStatusMessageValues;
        },
        cancelCurrentSync,
        cancelCurrentViewRefetch,
        loadOlder,
        loadNewer,
        returnToLatest,
        jumpToOldest,
        jumpToCreatedAt,
        fetchOlderFromRelays,
        goFirstPage,
        goPreviousPage,
        goToNextPage,
        goToLastPage,
        refetchAroundCurrentView,
        resetSearchState,
        deleteLocalHistory,
        patchDeletedPost,
    };
}
