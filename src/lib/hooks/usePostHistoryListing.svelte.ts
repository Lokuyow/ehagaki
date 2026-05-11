import type { RxNostr } from "rx-nostr";
import {
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
    readPersistedPostHistoryViewState,
    writePersistedPostHistoryViewState,
} from "../postHistoryDialogViewState";
import { postHistoryLocalSearchService } from "../postHistoryLocalSearchService";
import { postHistoryRepository } from "../storage/postHistoryRepository";
import type { PostHistoryRecord } from "../storage/ehagakiDb";
import type { RelayConfig } from "../types";

export type PostHistorySyncStatus =
    | "idle"
    | "syncing"
    | "older-syncing"
    | "synced"
    | "failed"
    | "no-more";

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
    hasMoreRemote: boolean;
    nextUntil: number | null;
}

const DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT: PersistedPostHistoryListingSnapshot = {
    loadedPosts: [],
    searchPosts: [],
    totalCount: 0,
    searchTotalCount: 0,
    hasMoreRemote: false,
    nextUntil: null,
};

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
        hasMoreRemote: snapshot.hasMoreRemote,
        nextUntil: snapshot.nextUntil,
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
        currentPage: persistedViewState.currentPage,
        searchPage: persistedViewState.searchPage,
        totalCount: persistedListingSnapshot.totalCount,
        searchTotalCount: persistedListingSnapshot.searchTotalCount,
        syncStatus: "idle" as PostHistorySyncStatus,
        hasMoreRemote: persistedListingSnapshot.hasMoreRemote,
        nextUntil: persistedListingSnapshot.nextUntil,
    });

    let loadRequestId = 0;
    let searchLoadRequestId = 0;
    let hasStartedInitialSync = false;
    let currentFetchTask: PostHistoryRelayFetchTask | null = null;
    let appliedSearchQuery = "";

    const isSearchMode = $derived(state.searchQuery.length > 0);
    const posts = $derived(
        isSearchMode ? state.searchPosts : state.loadedPosts,
    );
    const displayPage = $derived(
        isSearchMode ? state.searchPage : state.currentPage,
    );
    const displayTotalCount = $derived(
        isSearchMode ? state.searchTotalCount : state.totalCount,
    );
    const totalPages = $derived(
        Math.max(1, Math.ceil(displayTotalCount / pageSize)),
    );
    const canGoPrevious = $derived(displayPage > 1);
    const canGoNext = $derived(
        isSearchMode
            ? displayPage < totalPages
            : state.currentPage < totalPages || state.hasMoreRemote,
    );
    const showPaging = $derived(displayTotalCount > 0);
    const syncStatusMessageKey = $derived(
        isSearchMode || state.syncStatus === "idle"
            ? null
            : state.syncStatus === "syncing" ||
                state.syncStatus === "older-syncing"
                ? "postHistory.syncing"
                : state.syncStatus === "synced"
                    ? "postHistory.synced"
                    : state.syncStatus === "no-more"
                        ? "postHistory.noMorePosts"
                        : "postHistory.syncFailed",
    );
    const showSyncLoader = $derived(
        !isSearchMode &&
        (state.syncStatus === "syncing" ||
            state.syncStatus === "older-syncing"),
    );

    function cancelCurrentSync(): void {
        currentFetchTask?.cancel();
        currentFetchTask = null;
    }

    function resetSearchState(): void {
        state.searchInput = "";
        state.searchQuery = "";
        state.searchPage = 1;
        state.searchPosts = [];
        state.searchTotalCount = 0;
        appliedSearchQuery = "";
    }

    function resetState(): void {
        cancelCurrentSync();
        state.syncStatus = "idle";
        hasStartedInitialSync = false;
    }

    function updateRelayHistoryCursor(
        result: PostHistoryRelayFetchResult,
    ): void {
        const canContinue = canContinueRelayHistory(result);
        state.hasMoreRemote = canContinue;
        state.nextUntil = canContinue ? result.nextUntil : null;
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

    async function loadPage(page: number): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex) {
            state.loadedPosts = [];
            state.totalCount = 0;
            return;
        }

        const requestId = ++loadRequestId;
        const normalizedPage = Math.max(1, Math.trunc(page));
        const [count, pagePosts] = await Promise.all([
            postHistoryRepository.countForPubkey(pubkeyHex),
            postHistoryRepository.getPage({
                pubkeyHex,
                page: normalizedPage,
                pageSize,
            }),
        ]);

        if (!getShow() || requestId !== loadRequestId) {
            return;
        }

        const safePage = resolveSafePage(normalizedPage, count, pageSize);
        if (safePage !== normalizedPage) {
            state.currentPage = safePage;
            return;
        }

        await prefetchCurrentPageMedia(pagePosts);
        if (!getShow() || requestId !== loadRequestId) {
            return;
        }

        state.totalCount = count;
        state.loadedPosts = pagePosts;
    }

    async function loadSearchPage(page: number, query: string): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || !query) {
            state.searchPosts = [];
            state.searchTotalCount = 0;
            return;
        }

        const requestId = ++searchLoadRequestId;
        const normalizedPage = Math.max(1, Math.trunc(page));
        const result = await postHistoryLocalSearchService.searchLocalPosts({
            pubkeyHex,
            query,
            page: normalizedPage,
            pageSize,
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
    }

    async function syncFromRelays(): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!pubkeyHex || !rxNostr) {
            return;
        }

        cancelCurrentSync();
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

        if (currentFetchTask !== task) {
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

        updateRelayHistoryCursor(result);

        if (state.searchQuery) {
            await loadSearchPage(state.searchPage, state.searchQuery);
        } else {
            await loadPage(state.currentPage);
        }

        state.syncStatus = resolveSyncStatusAfterFetch(
            result,
            upsertSummary.insertedCount + upsertSummary.updatedCount > 0,
        );
    }

    async function ensurePageAvailable(targetPage: number): Promise<boolean> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex) {
            return false;
        }

        const requiredCount = (targetPage - 1) * pageSize + 1;
        let currentCount = await postHistoryRepository.countForPubkey(pubkeyHex);

        if (currentCount >= requiredCount) {
            return true;
        }

        const rxNostr = getRxNostr();
        if (!rxNostr || !state.hasMoreRemote || state.nextUntil === null) {
            state.syncStatus = "no-more";
            return false;
        }

        while (
            getShow() &&
            currentCount < requiredCount &&
            state.hasMoreRemote &&
            state.nextUntil !== null
        ) {
            cancelCurrentSync();
            state.syncStatus = "older-syncing";
            let didMateriallyChange = false;

            const task = postHistoryRelayFetchService.fetchLatest(rxNostr, {
                pubkeyHex,
                relayConfig: getRelayConfig(),
                limit: POST_HISTORY_RELAY_FETCH_LIMIT,
                until: state.nextUntil,
            });
            currentFetchTask = task;

            const result = await task.promise;
            if (currentFetchTask !== task) {
                return false;
            }

            currentFetchTask = null;
            if (!getShow() || result.status === "cancelled") {
                return false;
            }

            updateRelayHistoryCursor(result);

            if (result.events.length > 0) {
                const upsertSummary =
                    await postHistoryRepository.upsertFetchedEvents({
                        events: result.events,
                        fetchedAt: result.fetchedAt,
                    });
                didMateriallyChange =
                    upsertSummary.insertedCount + upsertSummary.updatedCount >
                    0;
            }

            currentCount = await postHistoryRepository.countForPubkey(pubkeyHex);

            if (currentCount >= requiredCount) {
                state.syncStatus = resolveSyncStatusAfterFetch(
                    result,
                    didMateriallyChange,
                );
                return true;
            }

            if (result.status !== "success") {
                state.syncStatus = "failed";
                return false;
            }
        }

        if (currentCount >= requiredCount) {
            if (state.syncStatus === "older-syncing") {
                state.syncStatus = "idle";
            }
            return true;
        }

        state.syncStatus = "no-more";
        return false;
    }

    function goPreviousPage(): boolean {
        if (!canGoPrevious) {
            return false;
        }

        if (isSearchMode) {
            state.searchPage -= 1;
            return true;
        }

        state.currentPage -= 1;
        return true;
    }

    async function goToNextPage(): Promise<boolean> {
        if (!canGoNext) {
            return false;
        }

        const targetPage = displayPage + 1;
        if (isSearchMode) {
            state.searchPage = targetPage;
            return true;
        }

        if (targetPage <= totalPages) {
            state.currentPage = targetPage;
            return true;
        }

        const pageReady = await ensurePageAvailable(targetPage);
        if (pageReady) {
            state.currentPage = targetPage;
            return true;
        }

        await loadPage(state.currentPage);
        return false;
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
            hasMoreRemote: state.hasMoreRemote,
            nextUntil: state.nextUntil,
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
        if (!getShow() || isSearchMode) {
            return;
        }

        void loadPage(state.currentPage);
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
        get displayPage() {
            return displayPage;
        },
        get totalPages() {
            return totalPages;
        },
        get canGoPrevious() {
            return canGoPrevious;
        },
        get canGoNext() {
            return canGoNext;
        },
        get showPaging() {
            return showPaging;
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
        cancelCurrentSync,
        goPreviousPage,
        goToNextPage,
        patchDeletedPost,
    };
}