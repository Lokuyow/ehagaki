import type { PostHistoryLocalLoadStatus } from "./hooks/usePostHistoryListing.svelte";
import { resolveSafePage } from "./postHistoryDialogUtils";
import {
    postHistoryLocalSearchService,
    type SearchLocalPostsResult,
} from "./postHistoryLocalSearchService";
import type { PostHistoryRecord } from "./storage/ehagakiDb";

/** The slice of the listing hook's reactive state that local search reads and writes. */
export interface PostHistoryListingSearchState {
    readonly searchQuery: string;
    searchPosts: PostHistoryRecord[];
    searchTotalCount: number;
    searchTotalCountKnown: boolean;
    searchHasNext: boolean;
    searchPage: number;
}

export interface PostHistoryListingSearchControllerDeps {
    state: PostHistoryListingSearchState;
    pageSize: number;
    getShow: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    /** The search generation shared with the hook's resets and restores. */
    getSearchLoadRequestId: () => number;
    /** Start a new search generation and return it. */
    beginSearchLoadRequest: () => number;
    setSearchPageLoading: (loading: boolean) => void;
    setSearchResultStatus: (status: PostHistoryLocalLoadStatus) => void;
    hasCompletedFirstPostPaint: () => boolean;
    waitForFirstPostPaint: (
        pubkeyHex: string,
        isCurrent: () => boolean,
        hasPosts: () => boolean,
    ) => Promise<boolean>;
}

/**
 * Local post history search pages. The hook owns the reactive state and the
 * search generation; this controller loads and rebuilds result pages against
 * them.
 */
export function createPostHistoryListingSearchController(
    deps: PostHistoryListingSearchControllerDeps,
) {
    const { state, pageSize } = deps;

    function mergeSearchPageResults(
        currentPosts: PostHistoryRecord[],
        nextPosts: PostHistoryRecord[],
    ): PostHistoryRecord[] {
        const mergedPosts = [...currentPosts];
        const knownEventIds = new Set(currentPosts.map((post) => post.eventId));

        for (const post of nextPosts) {
            if (knownEventIds.has(post.eventId)) {
                continue;
            }

            knownEventIds.add(post.eventId);
            mergedPosts.push(post);
        }

        return mergedPosts;
    }

    function isCurrentSearchLoad(
        requestId: number,
        query: string,
        pubkeyHex: string,
    ): boolean {
        return requestId === deps.getSearchLoadRequestId()
            && deps.getShow()
            && deps.getPubkeyHex() === pubkeyHex
            && query === state.searchQuery;
    }

    async function fetchSearchPage(
        page: number,
        query: string,
        requestId: number,
        showProgress = false,
    ): Promise<SearchLocalPostsResult | null> {
        const pubkeyHex = deps.getPubkeyHex();
        if (!pubkeyHex || !query) {
            return null;
        }

        const firstPageProgress: { items: PostHistoryRecord[] | null } = { items: null };
        const result = await postHistoryLocalSearchService.searchLocalPosts({
            pubkeyHex,
            query,
            page,
            pageSize,
            onProgress: showProgress
                ? async (progress) => {
                    if (!isCurrentSearchLoad(requestId, query, pubkeyHex)) return;
                    firstPageProgress.items = progress.items;
                    state.searchPosts = progress.items;
                    state.searchTotalCountKnown = false;
                    state.searchHasNext = false;
                    if (progress.phase === "partial" && !deps.hasCompletedFirstPostPaint()) {
                        await deps.waitForFirstPostPaint(
                            pubkeyHex,
                            () => isCurrentSearchLoad(requestId, query, pubkeyHex),
                            () => state.searchPosts.length > 0,
                        );
                    }
                }
                : undefined,
        });

        if (!isCurrentSearchLoad(requestId, query, pubkeyHex)) return null;
        // Count completion must not replace identical, already operable previews.
        const publishedPosts = firstPageProgress.items;
        if (publishedPosts !== null
            && publishedPosts.length === result.items.length
            && result.items.every((post, index) => post === publishedPosts[index])) {
            return { ...result, items: state.searchPosts };
        }
        return result;
    }

    async function loadSearchPage(page: number, query: string): Promise<boolean> {
        const pubkeyHex = deps.getPubkeyHex();
        if (!pubkeyHex || !query) {
            state.searchPosts = [];
            state.searchTotalCount = 0;
            state.searchTotalCountKnown = false;
            state.searchHasNext = false;
            return false;
        }

        const requestId = deps.beginSearchLoadRequest();
        const normalizedPage = Math.max(1, Math.trunc(page));
        deps.setSearchPageLoading(true);
        deps.setSearchResultStatus("loading");
        state.searchTotalCountKnown = false;
        try {
            const result = await fetchSearchPage(
                normalizedPage,
                query,
                requestId,
                normalizedPage === 1,
            );
            if (!result) {
                return false;
            }

            const safePage = resolveSafePage(
                normalizedPage,
                result.total,
                pageSize,
            );
            if (safePage !== normalizedPage) {
                if (
                    requestId === deps.getSearchLoadRequestId()
                    && isCurrentSearchLoad(requestId, query, pubkeyHex)
                ) {
                    deps.setSearchResultStatus("ready");
                }
                return false;
            }

            state.searchTotalCount = result.total;
            state.searchTotalCountKnown = true;
            state.searchPosts = normalizedPage === 1
                ? result.items
                : mergeSearchPageResults(state.searchPosts, result.items);
            state.searchPage = safePage;
            state.searchHasNext = result.hasNext;
            deps.setSearchResultStatus("ready");
            if (!deps.hasCompletedFirstPostPaint()) {
                if (!await deps.waitForFirstPostPaint(
                    pubkeyHex,
                    () => isCurrentSearchLoad(requestId, query, pubkeyHex),
                    () => state.searchPosts.length > 0,
                )) {
                    return false;
                }
            }
            return true;
        } catch {
            if (requestId === deps.getSearchLoadRequestId()) {
                deps.setSearchResultStatus("failed");
            }
            return false;
        } finally {
            if (requestId === deps.getSearchLoadRequestId()) {
                deps.setSearchPageLoading(false);
            }
        }
    }

    async function rebuildSearchResultsThroughPage(
        page: number,
        query: string,
        requestId: number = deps.beginSearchLoadRequest(),
    ): Promise<boolean> {
        const pubkeyHex = deps.getPubkeyHex();
        if (!pubkeyHex || !query) {
            return false;
        }
        const normalizedPage = Math.max(1, Math.trunc(page));
        deps.setSearchPageLoading(true);
        deps.setSearchResultStatus("loading");
        state.searchTotalCountKnown = false;

        try {
            const firstPage = await fetchSearchPage(1, query, requestId, normalizedPage === 1);
            if (!firstPage) {
                return false;
            }

            const lastPage = resolveSafePage(
                normalizedPage,
                firstPage.total,
                pageSize,
            );
            let rebuiltPosts = firstPage.items;
            let lastResult = firstPage;

            for (let currentPage = 2; currentPage <= lastPage; currentPage += 1) {
                const result = await fetchSearchPage(
                    currentPage,
                    query,
                    requestId,
                );
                if (!result) {
                    return false;
                }

                rebuiltPosts = mergeSearchPageResults(rebuiltPosts, result.items);
                lastResult = result;
            }

            state.searchPosts = rebuiltPosts;
            state.searchTotalCount = firstPage.total;
            state.searchTotalCountKnown = true;
            state.searchPage = lastPage;
            state.searchHasNext = lastResult.hasNext;
            deps.setSearchResultStatus("ready");
            if (!deps.hasCompletedFirstPostPaint()) {
                if (!await deps.waitForFirstPostPaint(
                    pubkeyHex,
                    () => isCurrentSearchLoad(requestId, query, pubkeyHex),
                    () => state.searchPosts.length > 0,
                )) {
                    return false;
                }
            }
            return true;
        } catch {
            if (requestId === deps.getSearchLoadRequestId()) {
                deps.setSearchResultStatus("failed");
            }
            return false;
        } finally {
            if (requestId === deps.getSearchLoadRequestId()) {
                deps.setSearchPageLoading(false);
            }
        }
    }

    return {
        isCurrentSearchLoad,
        loadSearchPage,
        rebuildSearchResultsThroughPage,
    };
}
