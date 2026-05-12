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
    readPersistedPostHistoryViewState,
    writePersistedPostHistoryViewState,
} from "../postHistoryDialogViewState";
import { postHistoryLocalSearchService } from "../postHistoryLocalSearchService";
import { postHistoryRepairService, type PostHistoryRepairTask } from "../postHistoryRepairService";
import { postHistoryRepository } from "../storage/postHistoryRepository";
import { postHistorySyncCoverageRepository } from "../storage/postHistorySyncCoverageRepository";
import type { PostHistoryRecord } from "../storage/ehagakiDb";
import type { RelayConfig } from "../types";

export type PostHistorySyncStatus =
    | "idle"
    | "syncing"
    | "older-syncing"
    | "synced"
    | "failed"
    | "no-more";

type PostHistoryRepairMessageValues = Record<
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
        repairStatus: "idle" as "idle" | "repairing",
        repairMessageKey: null as string | null,
        repairMessageValues: null as PostHistoryRepairMessageValues | null,
        hasMoreRemote: persistedListingSnapshot.hasMoreRemote,
        nextUntil: persistedListingSnapshot.nextUntil,
    });

    let loadRequestId = 0;
    let searchLoadRequestId = 0;
    let hasStartedInitialSync = false;
    let currentFetchTask: PostHistoryRelayFetchTask | null = null;
    let currentRepairTask: PostHistoryRepairTask | null = null;
    let appliedSearchQuery = "";

    const isSearchMode = $derived(state.searchQuery.length > 0);
    const isRepairing = $derived(state.repairStatus === "repairing");
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
    const canGoPrevious = $derived(!isRepairing && displayPage > 1);
    const canGoFirst = $derived(canGoPrevious);
    const canGoNext = $derived(
        !isRepairing && (isSearchMode
            ? displayPage < totalPages
            : state.currentPage < totalPages || state.hasMoreRemote),
    );
    const canGoLast = $derived(!isRepairing && displayPage < totalPages);
    const showPaging = $derived(displayTotalCount > 0);
    const canRepair = $derived(
        !!getPubkeyHex() &&
        !!getRxNostr() &&
        !isRepairing &&
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
                        ? "postHistory.noMorePosts"
                        : "postHistory.syncFailed",
    );
    const showSyncLoader = $derived(
        !isSearchMode &&
        (state.syncStatus === "syncing" ||
            state.syncStatus === "older-syncing"),
    );
    const showStatusLoader = $derived(showSyncLoader || isRepairing);
    const repairStatusMessageKey = $derived(
        state.repairStatus === "repairing"
            ? "postHistory.repairing"
            : state.repairMessageKey,
    );
    const repairStatusMessageValues = $derived(
        state.repairStatus === "repairing"
            ? null
            : state.repairMessageValues,
    );

    function cancelCurrentSync(): void {
        currentFetchTask?.cancel();
        currentFetchTask = null;
    }

    function cancelCurrentRepair(): void {
        currentRepairTask?.cancel();
        currentRepairTask = null;
        if (state.repairStatus === "repairing") {
            state.repairStatus = "idle";
        }
    }

    function clearRepairFeedback(): void {
        state.repairMessageKey = null;
        state.repairMessageValues = null;
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
        cancelCurrentRepair();
        state.syncStatus = "idle";
        clearRepairFeedback();
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

    async function refreshTotalCountFromRepository(): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || !getShow()) {
            return;
        }

        const count = await postHistoryRepository.countForPubkey(pubkeyHex);
        if (!getShow()) {
            return;
        }

        state.totalCount = count;
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
        await postHistorySyncCoverageRepository.saveAttempt({
            pubkeyHex,
            requestKind: "initial",
            kinds: [...POST_HISTORY_FETCH_KINDS],
            limit: POST_HISTORY_INITIAL_FETCH_LIMIT,
            result,
        });
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
            const fetchUntil: number = state.nextUntil;
            cancelCurrentSync();
            state.syncStatus = "older-syncing";
            let didMateriallyChange = false;

            const task = postHistoryRelayFetchService.fetchLatest(rxNostr, {
                pubkeyHex,
                relayConfig: getRelayConfig(),
                limit: POST_HISTORY_RELAY_FETCH_LIMIT,
                until: fetchUntil,
            });
            currentFetchTask = task;

            const result = await task.promise;
            await postHistorySyncCoverageRepository.saveAttempt({
                pubkeyHex,
                requestKind: "older",
                kinds: [...POST_HISTORY_FETCH_KINDS],
                until: fetchUntil,
                limit: POST_HISTORY_RELAY_FETCH_LIMIT,
                result,
            });
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

            if (
                result.status === "success" &&
                !didMateriallyChange &&
                typeof fetchUntil === "number" &&
                result.nextUntil === fetchUntil
            ) {
                state.nextUntil = fetchUntil > 0 ? fetchUntil - 1 : null;
                state.hasMoreRemote = state.nextUntil !== null;
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

    function goFirstPage(): boolean {
        if (!canGoFirst) {
            return false;
        }

        if (isSearchMode) {
            state.searchPage = 1;
            return true;
        }

        state.currentPage = 1;
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

    function goToLastPage(): boolean {
        if (!canGoLast) {
            return false;
        }

        if (isSearchMode) {
            state.searchPage = totalPages;
            return true;
        }

        state.currentPage = totalPages;
        return true;
    }

    async function repairFromRelays(): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!pubkeyHex || !rxNostr || !canRepair) {
            return;
        }

        clearRepairFeedback();
        state.repairStatus = "repairing";
        const task = postHistoryRepairService.repairFromRelays(rxNostr, {
            pubkeyHex,
            relayConfig: getRelayConfig(),
            onProgress: async () => {
                await refreshTotalCountFromRepository();
            },
        });
        currentRepairTask = task;

        try {
            const result = await task.promise;
            if (currentRepairTask !== task) {
                return;
            }

            currentRepairTask = null;
            state.repairStatus = "idle";

            if (!getShow() || result.status === "cancelled") {
                return;
            }

            if (state.searchQuery) {
                await loadSearchPage(state.searchPage, state.searchQuery);
            } else {
                await loadPage(state.currentPage);
            }

            if (result.hadFailures) {
                state.repairMessageKey = "postHistory.repairPartialFailure";
                state.repairMessageValues = null;
            } else if (result.hasRemainingRanges) {
                state.repairMessageKey = "postHistory.repairContinueLater";
                state.repairMessageValues = {
                    processedRangeCount: result.processedRangeCount,
                    remainingRangeCount: result.remainingRangeCount,
                    addedCount: result.addedCount,
                    updatedCount: result.updatedCount,
                    nextCursorUntil: result.nextCursorUntil,
                };
            } else if (result.addedCount > 0) {
                state.repairMessageKey = "postHistory.repairAdded";
                state.repairMessageValues = {
                    count: result.addedCount,
                    processedRangeCount: result.processedRangeCount,
                    updatedCount: result.updatedCount,
                };
            } else {
                state.repairMessageKey = "postHistory.repairNoChanges";
                state.repairMessageValues = {
                    processedRangeCount: result.processedRangeCount,
                    updatedCount: result.updatedCount,
                };
            }
        } catch {
            if (currentRepairTask !== task) {
                return;
            }

            currentRepairTask = null;
            state.repairStatus = "idle";
            state.repairMessageKey = "postHistory.repairPartialFailure";
            state.repairMessageValues = null;
        }
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
        get isRepairing() {
            return isRepairing;
        },
        get canRepair() {
            return canRepair;
        },
        get repairStatusMessageKey() {
            return repairStatusMessageKey;
        },
        get repairStatusMessageValues() {
            return repairStatusMessageValues;
        },
        cancelCurrentSync,
        cancelCurrentRepair,
        goFirstPage,
        goPreviousPage,
        goToNextPage,
        goToLastPage,
        repairFromRelays,
        patchDeletedPost,
    };
}
