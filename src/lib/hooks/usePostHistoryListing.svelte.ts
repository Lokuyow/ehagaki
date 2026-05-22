import type { RxNostr } from "rx-nostr";
import {
    POST_HISTORY_BOOTSTRAP_FETCH_LIMIT,
    POST_HISTORY_BOOTSTRAP_FETCH_TIMEOUT_MS,
    POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT,
    POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS,
    POST_HISTORY_DIALOG_OPEN_REFRESH_TTL_MS,
    POST_HISTORY_OLDER_FETCH_LIMIT,
    POST_HISTORY_OLDER_FETCH_TIMEOUT_MS,
    POST_HISTORY_FETCH_KINDS,
    POST_HISTORY_PAGE_SIZE,
    POST_HISTORY_REPAIR_FETCH_LIMIT,
    postHistoryRelayFetchService,
    type PostHistoryRelayFetchResult,
    type PostHistoryRelayFetchTask,
} from "../postHistoryRelayFetchService";
import {
    postHistoryLightweightSyncCoordinator,
    type PostHistoryLightweightAuthoredSyncTask,
} from "../postHistoryLightweightSyncCoordinator";
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
import type { PostHistoryDialogScrollState } from "../postHistoryDialogScrollState";
import { postHistoryLocalSearchService } from "../postHistoryLocalSearchService";
import {
    consumePostHistoryShouldReturnToLatestAfterLocalPost,
    type PendingPostHistoryLatestRequest,
} from "../postHistoryLatestRequest";
import {
    postHistoryCurrentViewRefetchService,
    type PostHistoryCurrentViewRefetchTask,
} from "../postHistoryCurrentViewRefetchService";
import {
    postHistoryVisibleRangeReplyRepairService,
    type PostHistoryVisibleRangeReplyRepairResult,
    type PostHistoryVisibleRangeReplyRepairTask,
} from "../postHistoryVisibleRangeReplyRepairService";
import {
    postHistoryRepository,
    type PostHistoryTimelineCursor,
} from "../storage/postHistoryRepository";
import { postHistoryReplyEventsRepository } from "../storage/postHistoryReplyEventsRepository";
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
    getSessionScrollState?: () => PostHistoryDialogScrollState | null;
    onSessionScrollStateInvalidated?: () => void;
    onSavedAuthoredPosts?: (eventIds: string[]) => void | Promise<void>;
    onReplyBadgeRefreshRequested?: (
        posts: PostHistoryRecord[],
        parentEventIds: string[],
    ) => void | Promise<void>;
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
    lastDialogOpenRefreshAt: number | null;
    visibleUntil: number | null;
    hasOlderLocal: boolean;
    hasNewerLocal: boolean;
}

interface OlderBackfillSearchRange {
    since: number;
    until: number;
    windowSeconds: number;
}

interface OlderBackfillLastRange extends OlderBackfillSearchRange {
    hitLimit: boolean;
}

interface OlderBackfillSearchState {
    windowSeconds: number;
    nextUntil: number | null;
    consecutiveEmptyCount: number;
    lastRange: OlderBackfillLastRange | null;
    continuationSince: number | null;
    exhausted: boolean;
}

interface LoadOlderVisiblePostsMetrics {
    loadedPostsBeforeLength: number;
    loadedPostsAfterLength: number;
    olderPostsLength: number;
    visibleOldestBefore: number | null;
    visibleOldestAfter: number | null;
    didTrimForOlderAppend: boolean;
    didDeferOlderPosts: boolean;
    maxVisiblePosts: number;
}

interface LoadOlderVisiblePostsOptions {
    anchorEventId?: string | null;
    metrics?: LoadOlderVisiblePostsMetrics;
    reason?: LoadOlderVisiblePostsReason;
}

type LoadOlderVisiblePostsReason = "normal-older-reveal";

interface OlderVisiblePostsMergeResult {
    posts: PostHistoryRecord[];
    didTrimForOlderAppend: boolean;
    didDeferOlderPosts: boolean;
}

interface MergeOlderVisiblePostsParams {
    currentPosts: PostHistoryRecord[];
    olderPosts: PostHistoryRecord[];
    anchorEventId?: string | null;
    maxVisiblePosts: number;
    keepAbove: number;
}

interface OlderBackfillUiResult {
    changed: boolean;
    didTrimForOlderAppend: boolean;
    didDeferOlderPosts: boolean;
    loadedPostsBeforeLength: number;
    loadedPostsAfterLength: number;
    maxVisiblePosts: number;
    autoRetryCount: number;
    autoRetryReason: string | null;
    attemptIndex: number;
    maxAttempts: number;
    clickStartVisibleCount: number;
    currentVisibleCount: number;
    totalVisibleAdded: number;
    targetVisibleAdded: number;
    shouldContinueForSmallBatch: boolean;
    exploredSeconds: number;
    maxExploreSeconds: number;
}

interface FetchOlderFromRelaysOptions {
    anchorEventId?: string | null;
}

function resolveFetchedAuthoredEventIds(
    events: Array<{ event?: { id?: string } }>,
): string[] {
    return events
        .map((item) => item.event?.id)
        .filter((eventId): eventId is string => !!eventId);
}

const SHOULD_DEBUG_POST_HISTORY_BACKFILL = import.meta.env.DEV;

export function mergeOlderVisiblePosts({
    currentPosts,
    olderPosts,
    anchorEventId = null,
    maxVisiblePosts,
    keepAbove,
}: MergeOlderVisiblePostsParams): OlderVisiblePostsMergeResult {
    const mergedPosts = [...currentPosts, ...olderPosts];
    if (mergedPosts.length <= maxVisiblePosts) {
        return {
            posts: mergedPosts,
            didTrimForOlderAppend: false,
            didDeferOlderPosts: false,
        };
    }

    if (currentPosts.length < maxVisiblePosts) {
        const availableSlots = Math.max(0, maxVisiblePosts - currentPosts.length);
        const appendedOlderPosts = olderPosts.slice(0, availableSlots);

        return {
            posts: [...currentPosts, ...appendedOlderPosts],
            didTrimForOlderAppend: false,
            didDeferOlderPosts: appendedOlderPosts.length < olderPosts.length,
        };
    }

    const anchorIndex = typeof anchorEventId === "string"
        ? mergedPosts.findIndex((post) => post.eventId === anchorEventId)
        : -1;

    const buildTrimmedResult = (startIndex: number): OlderVisiblePostsMergeResult => {
        const trimmed = mergedPosts.slice(startIndex, startIndex + maxVisiblePosts);
        const includedOlderCount = Math.max(
            0,
            trimmed.length - Math.max(0, currentPosts.length - startIndex),
        );

        return {
            posts: trimmed,
            didTrimForOlderAppend: true,
            didDeferOlderPosts: includedOlderCount < olderPosts.length,
        };
    };

    if (anchorIndex < 0) {
        return buildTrimmedResult(mergedPosts.length - maxVisiblePosts);
    }

    const maxStartIndex = Math.max(0, mergedPosts.length - maxVisiblePosts);
    const startIndex = Math.min(
        maxStartIndex,
        Math.max(0, anchorIndex - keepAbove),
    );

    return buildTrimmedResult(startIndex);
}

export function resolveNewlyVisibleOlderPosts(
    currentPosts: Array<Pick<PostHistoryRecord, "eventId">>,
    nextPosts: PostHistoryRecord[],
): PostHistoryRecord[] {
    const currentPostIds = new Set(currentPosts.map((post) => post.eventId));

    return nextPosts.filter((post) => !currentPostIds.has(post.eventId));
}

export function resolveVisibleOlderRevealReplyRepairParentPosts(
    ownerPubkeyHex: string,
    candidatePosts: PostHistoryRecord[],
    currentVisiblePosts: Array<Pick<PostHistoryRecord, "eventId">>,
): PostHistoryRecord[] {
    const currentVisiblePostIds = new Set(
        currentVisiblePosts.map((post) => post.eventId),
    );
    const parentPostsByEventId = new Map<string, PostHistoryRecord>();

    for (const post of candidatePosts) {
        if (
            post.kind !== 1
            || post.pubkeyHex !== ownerPubkeyHex
            || !currentVisiblePostIds.has(post.eventId)
            || parentPostsByEventId.has(post.eventId)
        ) {
            continue;
        }

        parentPostsByEventId.set(post.eventId, post);
    }

    return Array.from(parentPostsByEventId.values());
}

const DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT: PersistedPostHistoryListingSnapshot = {
    loadedPosts: [],
    searchPosts: [],
    totalCount: 0,
    searchTotalCount: 0,
    searchHasNext: false,
    hasMoreRemote: false,
    nextUntil: null,
    lastDialogOpenRefreshAt: null,
    visibleUntil: null,
    hasOlderLocal: false,
    hasNewerLocal: false,
};

const POST_HISTORY_VISIBLE_KINDS_KEY = buildPostHistoryVisibleKindsKey([
    ...POST_HISTORY_FETCH_KINDS,
]);
const POST_HISTORY_REPAIR_PREFERRED_PADDING_SECONDS = 24 * 60 * 60;
export const POST_HISTORY_OLDER_REVEAL_REPLY_REPAIR_FRESHNESS_TTL_MS =
    5 * 60 * 1000;

export function resolveOlderRevealReplyRepairNetworkParentIds(
    parentEventIds: string[],
    freshnessByParentId: ReadonlyMap<string, number>,
    inFlightParentIds: ReadonlySet<string>,
    nowMs: number,
    freshnessTtlMs = POST_HISTORY_OLDER_REVEAL_REPLY_REPAIR_FRESHNESS_TTL_MS,
): string[] {
    return parentEventIds.filter((eventId) => {
        if (inFlightParentIds.has(eventId)) {
            return false;
        }

        const checkedAt = freshnessByParentId.get(eventId);
        return typeof checkedAt !== "number"
            || nowMs - checkedAt >= freshnessTtlMs;
    });
}
export const POST_HISTORY_OLDER_BACKFILL_INITIAL_WINDOW_SECONDS = 12 * 60 * 60;
// Keep expanded scans bounded so older-backfill stays a windowed author query instead of drifting back to a wide until-only search.
const POST_HISTORY_OLDER_BACKFILL_MAX_WINDOW_SECONDS = 30 * 24 * 60 * 60;
const POST_HISTORY_OLDER_BACKFILL_MIN_CONTINUATION_SECONDS = 60 * 60;
const POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE = [
    12 * 60 * 60,
    24 * 60 * 60,
    3 * 24 * 60 * 60,
    7 * 24 * 60 * 60,
    14 * 24 * 60 * 60,
    30 * 24 * 60 * 60,
] as const;
const POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE_LABELS = [
    "12h",
    "1d",
    "3d",
    "7d",
    "14d",
    "30d",
] as const;
const POST_HISTORY_OLDER_BACKFILL_MAX_ATTEMPTS_PER_CLICK = 6;
const POST_HISTORY_OLDER_BACKFILL_MAX_AUTO_EXPLORE_SECONDS =
    30 * 24 * 60 * 60;

interface ResolveOlderBackfillAutoRetryDecisionParams {
    status: PostHistoryRelayFetchResult["status"];
    changed: boolean;
    didCursorAdvanceOlder: boolean;
    hitLimit: boolean;
    continuedWithinWindow: boolean;
    attemptIndex: number;
    maxAttempts: number;
    totalVisibleAdded: number;
    targetVisibleAdded: number;
    exploredSeconds: number;
    maxExploreSeconds: number;
}

interface ResolveOlderBackfillAutoRetryDecisionResult {
    shouldContinue: boolean;
    reason: string;
}

export function resolveOlderBackfillAutoRetryDecision({
    status,
    changed,
    didCursorAdvanceOlder,
    hitLimit,
    continuedWithinWindow,
    attemptIndex,
    maxAttempts,
    totalVisibleAdded,
    targetVisibleAdded,
    exploredSeconds,
    maxExploreSeconds,
}: ResolveOlderBackfillAutoRetryDecisionParams): ResolveOlderBackfillAutoRetryDecisionResult {
    if (status !== "success") {
        return {
            shouldContinue: false,
            reason: `status-${status}`,
        };
    }

    if (!didCursorAdvanceOlder) {
        return {
            shouldContinue: false,
            reason: "cursor-not-advanced",
        };
    }

    if (hitLimit && !continuedWithinWindow) {
        return {
            shouldContinue: false,
            reason: "hit-limit-continuation-unavailable",
        };
    }

    if (totalVisibleAdded >= targetVisibleAdded) {
        return {
            shouldContinue: false,
            reason: "target-visible-added-reached",
        };
    }

    if (exploredSeconds >= maxExploreSeconds) {
        return {
            shouldContinue: false,
            reason: "max-explore-seconds-reached",
        };
    }

    if (attemptIndex >= maxAttempts) {
        return {
            shouldContinue: false,
            reason: "max-attempts-reached",
        };
    }

    return {
        shouldContinue: true,
        reason: changed
            ? "small-batch-continue"
            : "empty-window-continue",
    };
}

const persistedListingSnapshotByPubkey = new Map<
    string,
    PersistedPostHistoryListingSnapshot
>();

interface ResolvePostHistoryOlderRelayFetchUntilParams {
    nextUntil: number | null;
    visibleOldestCreatedAt: number | null;
    pubkeyHex: string;
    getOldestCreatedAt: (pubkeyHex: string) => Promise<number | null>;
    getNowSeconds?: () => number;
}

export async function resolvePostHistoryOlderRelayFetchUntil({
    nextUntil,
    visibleOldestCreatedAt,
    pubkeyHex,
    getOldestCreatedAt,
    getNowSeconds = () => Math.floor(Date.now() / 1000),
}: ResolvePostHistoryOlderRelayFetchUntilParams): Promise<number | null> {
    if (typeof nextUntil === "number") {
        return nextUntil;
    }

    if (typeof visibleOldestCreatedAt === "number") {
        return visibleOldestCreatedAt;
    }

    const dbOldestCreatedAt = await getOldestCreatedAt(pubkeyHex);
    if (typeof dbOldestCreatedAt === "number") {
        return dbOldestCreatedAt;
    }

    const nowSeconds = getNowSeconds();
    return Number.isFinite(nowSeconds) ? nowSeconds : null;
}

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
        lastDialogOpenRefreshAt: snapshot.lastDialogOpenRefreshAt,
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
    getSessionScrollState = () => null,
    onSessionScrollStateInvalidated = () => { },
    onSavedAuthoredPosts = () => undefined,
    onReplyBadgeRefreshRequested = () => undefined,
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
        lastDialogOpenRefreshAt: persistedListingSnapshot.lastDialogOpenRefreshAt,
        visibleUntil: persistedListingSnapshot.visibleUntil,
        hasOlderLocal: persistedListingSnapshot.hasOlderLocal,
        hasNewerLocal: persistedListingSnapshot.hasNewerLocal,
        latestOlderBackfillUiResult: null as OlderBackfillUiResult | null,
    });

    let loadRequestId = 0;
    let searchLoadRequestId = 0;
    let hasStartedInitialSync = false;
    let hasAttemptedInitialLocalLoad = false;
    let initialLocalLoadKey: string | null = null;
    let activePubkeyKey = resolveListingSnapshotKey(getPubkeyHex());
    let currentFetchTask: PostHistoryRelayFetchTask | PostHistoryLightweightAuthoredSyncTask | null = null;
    let fetchRequestId = 0;
    let currentViewRefetchTask: PostHistoryCurrentViewRefetchTask | null = null;
    let currentViewReplyRepairTask: PostHistoryVisibleRangeReplyRepairTask | null = null;
    let currentViewRefetchMessageClearTimeout: ReturnType<typeof setTimeout> | null = null;
    let syncStatusMessageClearTimeout: ReturnType<typeof setTimeout> | null = null;
    let olderRevealReplyRepairScopeId = 0;
    let activeOlderRevealReplyRepairRxNostr = getRxNostr();
    let appliedSearchQuery = "";
    const olderRevealReplyRepairTasks = new Set<PostHistoryVisibleRangeReplyRepairTask>();
    const olderRevealReplyRepairFreshnessByParentId = new Map<string, number>();
    const olderRevealReplyRepairInFlightParentIds = new Set<string>();
    const olderBackfillSearch = $state<OlderBackfillSearchState>({
        windowSeconds: POST_HISTORY_OLDER_BACKFILL_INITIAL_WINDOW_SECONDS,
        nextUntil: null,
        consecutiveEmptyCount: 0,
        lastRange: null,
        continuationSince: null,
        exhausted: false,
    });
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
        !olderBackfillSearch.exhausted &&
        state.syncStatus !== "syncing" &&
        state.syncStatus !== "older-syncing",
    );
    const isFetchingOlderFromRelays = $derived(
        !isSearchMode && state.syncStatus === "older-syncing",
    );
    const isFetchingFromRelays = $derived(
        !isSearchMode &&
        (state.syncStatus === "syncing" || state.syncStatus === "older-syncing"),
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
        currentViewReplyRepairTask?.cancel();
        currentViewReplyRepairTask = null;
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

    function clearSyncStatusMessageClearTimeout(): void {
        if (syncStatusMessageClearTimeout !== null) {
            clearTimeout(syncStatusMessageClearTimeout);
            syncStatusMessageClearTimeout = null;
        }
    }

    function clearOlderRevealReplyRepairState(): void {
        olderRevealReplyRepairScopeId += 1;
        olderRevealReplyRepairTasks.forEach((task) => task.cancel());
        olderRevealReplyRepairTasks.clear();
        olderRevealReplyRepairFreshnessByParentId.clear();
        olderRevealReplyRepairInFlightParentIds.clear();
    }

    function isActiveOlderRevealReplyRepairScope(
        scopeId: number,
        pubkeyHex: string,
        rxNostr: RxNostr,
    ): boolean {
        return (
            scopeId === olderRevealReplyRepairScopeId
            && getShow()
            && getPubkeyHex() === pubkeyHex
            && getRxNostr() === rxNostr
        );
    }

    function requestReplyBadgeRefresh(
        posts: PostHistoryRecord[],
        parentEventIds: string[],
    ): void {
        if (posts.length === 0 || parentEventIds.length === 0) {
            return;
        }

        void Promise.resolve(
            onReplyBadgeRefreshRequested(posts, parentEventIds),
        ).catch(() => undefined);
    }

    function resolveOlderRevealReplyRepairNetworkParentPosts(
        parentPosts: PostHistoryRecord[],
        nowMs: number,
    ): PostHistoryRecord[] {
        const networkParentIds = resolveOlderRevealReplyRepairNetworkParentIds(
            parentPosts.map((post) => post.eventId),
            olderRevealReplyRepairFreshnessByParentId,
            olderRevealReplyRepairInFlightParentIds,
            nowMs,
        );
        const networkParentIdSet = new Set(networkParentIds);

        return parentPosts.filter((post) => networkParentIdSet.has(post.eventId));
    }

    function markOlderRevealReplyRepairParentsChecked(
        parentEventIds: string[],
        checkedAt: number,
    ): void {
        parentEventIds.forEach((eventId) => {
            olderRevealReplyRepairFreshnessByParentId.set(eventId, checkedAt);
        });
    }

    function scheduleOlderRevealReplyRepair(
        candidatePosts: PostHistoryRecord[],
    ): void {
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!pubkeyHex || candidatePosts.length === 0) {
            return;
        }

        const visibleParentPosts = resolveVisibleOlderRevealReplyRepairParentPosts(
            pubkeyHex,
            candidatePosts,
            state.loadedPosts,
        );
        if (visibleParentPosts.length === 0) {
            return;
        }

        requestReplyBadgeRefresh(
            state.loadedPosts,
            visibleParentPosts.map((post) => post.eventId),
        );

        if (!rxNostr) {
            return;
        }

        const networkParentPosts = resolveOlderRevealReplyRepairNetworkParentPosts(
            visibleParentPosts,
            Date.now(),
        );
        if (networkParentPosts.length === 0) {
            return;
        }

        networkParentPosts.forEach((post) => {
            olderRevealReplyRepairInFlightParentIds.add(post.eventId);
        });

        const scopeId = olderRevealReplyRepairScopeId;
        const task =
            postHistoryVisibleRangeReplyRepairService.repairVisibleKind1DirectReplies(
                rxNostr,
                {
                    ownerPubkeyHex: pubkeyHex,
                    visiblePosts: networkParentPosts,
                    relayConfig: getRelayConfig(),
                    isActive: () =>
                        isActiveOlderRevealReplyRepairScope(
                            scopeId,
                            pubkeyHex,
                            rxNostr,
                        ),
                },
            );
        olderRevealReplyRepairTasks.add(task);

        void task.promise
            .then((result) => {
                olderRevealReplyRepairTasks.delete(task);
                networkParentPosts.forEach((post) => {
                    olderRevealReplyRepairInFlightParentIds.delete(post.eventId);
                });

                if (
                    !isActiveOlderRevealReplyRepairScope(
                        scopeId,
                        pubkeyHex,
                        rxNostr,
                    )
                    || result.status === "cancelled"
                ) {
                    return;
                }

                if (result.savedParentEventIds.length > 0) {
                    requestReplyBadgeRefresh(
                        state.loadedPosts,
                        result.savedParentEventIds,
                    );
                }

                if (result.checkedParentEventIds.length > 0) {
                    markOlderRevealReplyRepairParentsChecked(
                        result.checkedParentEventIds,
                        Date.now(),
                    );
                }
            })
            .catch(() => {
                olderRevealReplyRepairTasks.delete(task);
                networkParentPosts.forEach((post) => {
                    olderRevealReplyRepairInFlightParentIds.delete(post.eventId);
                });
            });
    }

    function resetOlderBackfillSearchState(): void {
        olderBackfillSearch.windowSeconds =
            POST_HISTORY_OLDER_BACKFILL_INITIAL_WINDOW_SECONDS;
        olderBackfillSearch.nextUntil = null;
        olderBackfillSearch.consecutiveEmptyCount = 0;
        olderBackfillSearch.lastRange = null;
        olderBackfillSearch.continuationSince = null;
        olderBackfillSearch.exhausted = false;
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
            "postHistory.repairRepliesAdded",
            "postHistory.repairPartialFailure",
            "postHistory.repairFetchFailed",
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

    function scheduleSyncStatusMessageClearIfNeeded(): void {
        clearSyncStatusMessageClearTimeout();

        if (state.syncStatus !== "synced" && state.syncStatus !== "failed") {
            return;
        }

        syncStatusMessageClearTimeout = setTimeout(() => {
            if (state.syncStatus === "synced" || state.syncStatus === "failed") {
                state.syncStatus = "idle";
            }
            syncStatusMessageClearTimeout = null;
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
        clearOlderRevealReplyRepairState();
        state.loadedPosts = [];
        state.searchPosts = [];
        state.totalCount = 0;
        state.searchTotalCount = 0;
        state.searchHasNext = false;
        state.currentPage = 1;
        state.searchPage = 1;
        state.hasMoreRemote = false;
        state.nextUntil = null;
        state.lastDialogOpenRefreshAt = null;
        state.visibleUntil = null;
        state.hasOlderLocal = false;
        state.hasNewerLocal = false;
        state.syncStatus = "idle";
        resetOlderBackfillSearchState();
        clearCurrentViewRefetchFeedback();
        clearSyncStatusMessageClearTimeout();
        resetSearchState();
        hasStartedInitialSync = true;
    }

    function resetState(): void {
        cancelCurrentSync();
        cancelCurrentViewRefetch();
        clearOlderRevealReplyRepairState();
        state.syncStatus = "idle";
        resetOlderBackfillSearchState();
        clearCurrentViewRefetchFeedback();
        clearSyncStatusMessageClearTimeout();
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

    function updateRelayHistoryCursorAfterDialogRefresh(
        result: PostHistoryRelayFetchResult,
    ): void {
        const canContinue = canContinueRelayHistory(result);
        if (!canContinue) {
            return;
        }

        if (state.nextUntil === null) {
            state.hasMoreRemote = true;
            state.nextUntil = result.nextUntil;
        }
    }

    async function resolveOlderRelayFetchUntil(
        pubkeyHex: string,
    ): Promise<number | null> {
        if (typeof olderBackfillSearch.nextUntil === "number") {
            return olderBackfillSearch.nextUntil;
        }

        return resolvePostHistoryOlderRelayFetchUntil({
            nextUntil: state.nextUntil,
            visibleOldestCreatedAt,
            pubkeyHex,
            getOldestCreatedAt: (targetPubkeyHex) =>
                postHistoryRepository.getOldestCreatedAt(targetPubkeyHex),
        });
    }

    function buildOlderBackfillSearchRange(
        fetchUntil: number,
    ): OlderBackfillSearchRange | null {
        if (!Number.isFinite(fetchUntil)) {
            return null;
        }

        const until = Math.trunc(fetchUntil) - 1;
        if (until < 0) {
            return null;
        }

        const continuationSince =
            typeof olderBackfillSearch.continuationSince === "number" &&
                olderBackfillSearch.continuationSince <= until
                ? olderBackfillSearch.continuationSince
                : null;

        return {
            since: continuationSince ?? Math.max(
                0,
                until - olderBackfillSearch.windowSeconds,
            ),
            until,
            windowSeconds: olderBackfillSearch.windowSeconds,
        };
    }

    function resolveOlderBackfillLimitHitReasons(
        result: PostHistoryRelayFetchResult,
        limit: number,
    ): string[] {
        const reasons: string[] = [];

        if (result.hasMore) {
            reasons.push("hasMore");
        }

        if (result.rawCount >= limit) {
            reasons.push("rawCount");
        }

        if (result.perRelayCounts.some((item) => item.rawCount >= limit)) {
            reasons.push("perRelayRawCount");
        }

        return reasons;
    }

    function resolveOldestCreatedAtFromFetchResult(
        result: PostHistoryRelayFetchResult,
    ): number | null {
        if (typeof result.oldestCreatedAt === "number") {
            return result.oldestCreatedAt;
        }

        return result.events.reduce<number | null>((oldest, item) => {
            const createdAt = item.event.created_at;
            if (!Number.isFinite(createdAt)) {
                return oldest;
            }

            return oldest === null || createdAt < oldest
                ? Math.trunc(createdAt)
                : oldest;
        }, null);
    }

    function setOlderBackfillNextCursor(
        nextUntil: number | null,
        continuationSince: number | null,
    ): void {
        olderBackfillSearch.nextUntil = nextUntil;
        olderBackfillSearch.continuationSince = continuationSince;
        olderBackfillSearch.exhausted = nextUntil === null;
        state.nextUntil = nextUntil;
        state.hasMoreRemote = nextUntil !== null;
    }

    function updateOlderBackfillSearchState(
        result: PostHistoryRelayFetchResult,
        range: OlderBackfillSearchRange,
        limit: number,
    ): void {
        const hitLimitReasons = resolveOlderBackfillLimitHitReasons(result, limit);
        const hitLimit = hitLimitReasons.length > 0;
        const oldestCreatedAt = resolveOldestCreatedAtFromFetchResult(result);
        const remainingWindowSeconds =
            typeof oldestCreatedAt === "number" && oldestCreatedAt > range.since
                ? oldestCreatedAt - range.since
                : 0;
        const defaultOlderCursor = range.since > 0 ? range.since : null;
        let nextUntil = defaultOlderCursor;
        let continuationSince: number | null = null;

        olderBackfillSearch.lastRange = {
            ...range,
            hitLimit,
        };

        if (result.status === "success" && result.events.length === 0) {
            olderBackfillSearch.consecutiveEmptyCount += 1;
            olderBackfillSearch.windowSeconds = Math.min(
                olderBackfillSearch.windowSeconds * 2,
                POST_HISTORY_OLDER_BACKFILL_MAX_WINDOW_SECONDS,
            );
            setOlderBackfillNextCursor(nextUntil, null);
            return;
        }

        if (result.events.length > 0) {
            olderBackfillSearch.consecutiveEmptyCount = 0;
            olderBackfillSearch.windowSeconds =
                POST_HISTORY_OLDER_BACKFILL_INITIAL_WINDOW_SECONDS;

            if (
                (hitLimit || result.status !== "success") &&
                typeof oldestCreatedAt === "number" &&
                oldestCreatedAt > range.since &&
                remainingWindowSeconds >= POST_HISTORY_OLDER_BACKFILL_MIN_CONTINUATION_SECONDS
            ) {
                nextUntil = oldestCreatedAt;
                continuationSince = range.since;
            }

            setOlderBackfillNextCursor(nextUntil, continuationSince);
            return;
        }

        const retryUntil = range.until + 1;
        setOlderBackfillNextCursor(retryUntil, olderBackfillSearch.continuationSince);
    }

    function logOlderBackfillResult(
        range: OlderBackfillSearchRange,
        result: PostHistoryRelayFetchResult,
        limit: number,
    ): void {
        const hitLimitReasons = resolveOlderBackfillLimitHitReasons(result, limit);
        const oldestCreatedAt = resolveOldestCreatedAtFromFetchResult(result);
        const oldestSinceGapSeconds =
            typeof oldestCreatedAt === "number" ? oldestCreatedAt - range.since : null;
        const rawCount = result.rawCount ?? result.events.length;
        const uniqueCount = result.uniqueCount ?? result.events.length;
        const nextRange = typeof olderBackfillSearch.nextUntil === "number"
            ? buildOlderBackfillSearchRange(olderBackfillSearch.nextUntil)
            : null;

        if (!SHOULD_DEBUG_POST_HISTORY_BACKFILL) {
            return;
        }

        globalThis.console?.debug?.("post_history_older_backfill", {
            reason: "older-backfill",
            since: range.since,
            until: range.until,
            limit,
            resultStatus: result.status,
            eventsLength: result.events.length,
            rawCount,
            uniqueCount,
            rawUniqueGap: rawCount - uniqueCount,
            hasMore: result.hasMore,
            nextUntil: result.nextUntil,
            oldestCreatedAt,
            newestCreatedAt: result.newestCreatedAt,
            hitLimit: hitLimitReasons.length > 0,
            hitLimitReasons,
            oldestSinceGapSeconds,
            continuationThresholdSeconds:
                POST_HISTORY_OLDER_BACKFILL_MIN_CONTINUATION_SECONDS,
            continuedWithinWindow: olderBackfillSearch.continuationSince !== null,
            requestedRelayUrls: result.requestedRelayUrls ?? result.relayUrls ?? [],
            observedRelayUrls: result.observedRelayUrls ?? [],
            eoseRelayUrls: result.eoseRelayUrls ?? [],
            closedRelayUrls: result.closedRelayUrls ?? [],
            errorRelayUrls: result.errorRelayUrls ?? [],
            nextPlannedSince: nextRange?.since ?? null,
            nextPlannedUntil: nextRange?.until ?? null,
            nextWindowSeconds: olderBackfillSearch.windowSeconds,
            consecutiveEmptyCount: olderBackfillSearch.consecutiveEmptyCount,
            exhausted: olderBackfillSearch.exhausted,
        });
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
            limit: POST_HISTORY_REPAIR_FETCH_LIMIT,
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
        const candidateVisibleUntil = (() => {
            if (result.events.length === 0) {
                return null;
            }

            if (canContinueRelayHistory(result)) {
                return result.nextUntil;
            }

            return typeof result.oldestCreatedAt === "number"
                ? result.oldestCreatedAt
                : null;
        })();
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

    async function updateVisibleUntilFromOlderBackfillFetch(
        pubkeyHex: string,
        result: PostHistoryRelayFetchResult,
    ): Promise<number | null> {
        const currentVisibleUntil = await readVisibleUntil(pubkeyHex);
        const oldestCreatedAt = resolveOldestCreatedAtFromFetchResult(result);
        const nextVisibleUntil = typeof oldestCreatedAt === "number"
            ? typeof currentVisibleUntil === "number"
                ? Math.min(currentVisibleUntil, oldestCreatedAt)
                : oldestCreatedAt
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

    function mergeOlderVisiblePostsForState(
        currentPosts: PostHistoryRecord[],
        olderPosts: PostHistoryRecord[],
        anchorEventId?: string | null,
    ): OlderVisiblePostsMergeResult {
        return mergeOlderVisiblePosts({
            currentPosts,
            olderPosts,
            anchorEventId,
            maxVisiblePosts,
            keepAbove: pageSize,
        });
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

        state.totalCount = count;
        state.loadedPosts = latestPosts;
        void prefetchCurrentPageMedia(latestPosts);
        await refreshTimelineAvailability(pubkeyHex, latestPosts, requestId);
        void startOpenRelayFetchAfterLocalLoad(pubkeyHex, latestPosts);
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
        state.totalCount = count;
        state.loadedPosts = nextPosts;
        void prefetchCurrentPageMedia(nextPosts);
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

    function shouldApplyPendingLatestRequest(
        pendingRequest: PendingPostHistoryLatestRequest | null,
        scrollState: PostHistoryDialogScrollState | null,
    ): pendingRequest is PendingPostHistoryLatestRequest {
        return !!pendingRequest
            && (!scrollState || pendingRequest.requestedAt > scrollState.savedAt);
    }

    async function refreshPreservedVisibleWindow(
        scrollState: PostHistoryDialogScrollState | null,
        pendingLatestRequest: PendingPostHistoryLatestRequest | null,
    ): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        const currentPosts = state.loadedPosts;
        const newestCursor = toTimelineCursor(currentPosts[0]);
        const oldestCursor = toTimelineCursor(
            currentPosts[currentPosts.length - 1],
        );
        if (!pubkeyHex || !getShow() || currentPosts.length === 0) {
            return;
        }

        const requestId = ++loadRequestId;
        const visibleUntil = await refreshVisibleUntil(pubkeyHex);
        const [count, newerPosts, olderPosts] = await Promise.all([
            countVisiblePosts(pubkeyHex, visibleUntil),
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
        if (!getShow() || requestId !== loadRequestId) {
            return;
        }

        if (shouldApplyPendingLatestRequest(pendingLatestRequest, scrollState)) {
            onSessionScrollStateInvalidated();
            await loadLatestVisiblePosts();
            return;
        }

        state.totalCount = count;
        state.hasNewerLocal = newerPosts.length > 0;
        state.hasOlderLocal = olderPosts.length > 0;
        void prefetchCurrentPageMedia(currentPosts);
        startOpenRelayFetchAfterLocalLoad(pubkeyHex, state.loadedPosts);
    }

    function getNormalSessionScrollStateForCurrentPubkey(): PostHistoryDialogScrollState | null {
        const scrollState = getSessionScrollState();
        if (
            !scrollState ||
            scrollState.mode !== "normal" ||
            scrollState.pubkeyHex !== getPubkeyHex()
        ) {
            return null;
        }

        return scrollState;
    }

    function canPreserveSessionVisibleWindow(
        scrollState: PostHistoryDialogScrollState | null,
    ): scrollState is PostHistoryDialogScrollState {
        if (isSearchMode || state.loadedPosts.length === 0) {
            return false;
        }

        if (!scrollState) {
            return false;
        }

        return state.loadedPosts.some(
            (post) => post.eventId === scrollState.anchor.eventId,
        );
    }

    async function loadVisibleWindowAroundSessionAnchor(
        scrollState: PostHistoryDialogScrollState,
    ): Promise<boolean> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || !getShow()) {
            return false;
        }

        const requestId = ++loadRequestId;
        const visibleUntil = await refreshVisibleUntil(pubkeyHex);
        const [count, restoredPosts] = await Promise.all([
            countVisiblePosts(pubkeyHex, visibleUntil),
            postHistoryRepository.getVisibleChunkAroundEventId({
                pubkeyHex,
                visibleUntil,
                eventId: scrollState.anchor.eventId,
                limit: maxVisiblePosts,
                keepAbove: pageSize,
            }),
        ]);

        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        if (restoredPosts.length === 0) {
            onSessionScrollStateInvalidated();
            await loadLatestVisiblePosts();
            return false;
        }

        state.totalCount = count;
        state.loadedPosts = restoredPosts;
        void prefetchCurrentPageMedia(restoredPosts);
        await refreshTimelineAvailability(pubkeyHex, restoredPosts, requestId);
        void startOpenRelayFetchAfterLocalLoad(pubkeyHex, restoredPosts);
        return true;
    }

    async function loadOlderVisiblePosts(
        options: LoadOlderVisiblePostsOptions = {},
    ): Promise<boolean> {
        const currentLoadedPosts = state.loadedPosts;
        const metrics = options.metrics;
        if (metrics) {
            metrics.loadedPostsBeforeLength = currentLoadedPosts.length;
            metrics.loadedPostsAfterLength = currentLoadedPosts.length;
            metrics.olderPostsLength = 0;
            metrics.visibleOldestBefore =
                currentLoadedPosts.length > 0
                    ? currentLoadedPosts[currentLoadedPosts.length - 1]?.createdAt ?? null
                    : null;
            metrics.visibleOldestAfter =
                currentLoadedPosts.length > 0
                    ? currentLoadedPosts[currentLoadedPosts.length - 1]?.createdAt ?? null
                    : null;
            metrics.didTrimForOlderAppend = false;
            metrics.didDeferOlderPosts = false;
            metrics.maxVisiblePosts = maxVisiblePosts;
        }

        const pubkeyHex = getPubkeyHex();
        const oldestCursor = toTimelineCursor(
            state.loadedPosts[state.loadedPosts.length - 1],
        );
        if (!pubkeyHex || !oldestCursor) {
            await loadLatestVisiblePosts();
            if (metrics) {
                metrics.loadedPostsAfterLength = state.loadedPosts.length;
                metrics.olderPostsLength = state.loadedPosts.length;
                metrics.visibleOldestAfter =
                    state.loadedPosts.length > 0
                        ? state.loadedPosts[state.loadedPosts.length - 1]?.createdAt ?? null
                        : null;
            }
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
        if (metrics) {
            metrics.olderPostsLength = olderPosts.length;
        }

        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        if (olderPosts.length === 0) {
            state.hasOlderLocal = false;
            if (metrics) {
                metrics.loadedPostsAfterLength = state.loadedPosts.length;
                metrics.visibleOldestAfter =
                    state.loadedPosts.length > 0
                        ? state.loadedPosts[state.loadedPosts.length - 1]?.createdAt ?? null
                        : null;
            }
            return false;
        }

        const mergedResult = mergeOlderVisiblePostsForState(
            currentLoadedPosts,
            olderPosts,
            options.anchorEventId,
        );
        const newlyVisibleOlderPosts =
            options.reason === "normal-older-reveal"
                ? resolveNewlyVisibleOlderPosts(
                    currentLoadedPosts,
                    mergedResult.posts,
                )
                : [];
        state.loadedPosts = mergedResult.posts;
        if (newlyVisibleOlderPosts.length > 0) {
            scheduleOlderRevealReplyRepair(newlyVisibleOlderPosts);
        }
        if (mergedResult.didDeferOlderPosts) {
            state.hasOlderLocal = true;
        }
        if (metrics) {
            metrics.loadedPostsAfterLength = mergedResult.posts.length;
            metrics.visibleOldestAfter =
                mergedResult.posts.length > 0
                    ? mergedResult.posts[mergedResult.posts.length - 1]?.createdAt ?? null
                    : null;
            metrics.didTrimForOlderAppend = mergedResult.didTrimForOlderAppend;
            metrics.didDeferOlderPosts = mergedResult.didDeferOlderPosts;
        }
        void prefetchCurrentPageMedia(mergedResult.posts);
        await refreshTimelineAvailability(pubkeyHex, mergedResult.posts, requestId);
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
        await refreshTimelineAvailability(pubkeyHex, nextPosts, requestId);
        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        state.loadedPosts = nextPosts;
        void prefetchCurrentPageMedia(nextPosts);
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

        state.totalCount = count;
        state.loadedPosts = datePosts;
        void prefetchCurrentPageMedia(datePosts);
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

        state.searchTotalCount = result.total;
        state.searchPosts = result.items;
        state.searchHasNext = result.hasNext;
        void prefetchCurrentPageMedia(result.items);
    }

    async function bootstrapFromRelays(): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!pubkeyHex || !rxNostr) {
            return;
        }

        cancelCurrentSync();
        const requestId = ++fetchRequestId;
        state.syncStatus = "syncing";
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
            reason: "bootstrap",
            limit: POST_HISTORY_BOOTSTRAP_FETCH_LIMIT,
            timeoutMs: POST_HISTORY_BOOTSTRAP_FETCH_TIMEOUT_MS,
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
            const savedEventIds = resolveFetchedAuthoredEventIds(result.events);
            if (savedEventIds.length > 0) {
                await onSavedAuthoredPosts(savedEventIds);
            }
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

    async function refreshRecentFromRelaysOnDialogOpen(): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!pubkeyHex || !rxNostr) {
            return;
        }

        cancelCurrentSync();
        const requestId = ++fetchRequestId;
        state.syncStatus = "syncing";
        state.lastDialogOpenRefreshAt = Date.now();
        const previousVisibleUntil = await refreshVisibleUntil(pubkeyHex);
        if (
            !isCurrentFetchRequest(requestId) ||
            !getShow() ||
            getPubkeyHex() !== pubkeyHex
        ) {
            return;
        }

        const task = postHistoryLightweightSyncCoordinator.runAuthored(rxNostr, {
            ownerPubkeyHex: pubkeyHex,
            relayConfig: getRelayConfig(),
            reason: "dialog-open-refresh",
            limit: POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT,
            timeoutMs: POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS,
            onSavedSelfPosts: onSavedAuthoredPosts,
        });
        currentFetchTask = task;

        const lightweightResult = await task.promise;
        const result = lightweightResult.fetchResult;
        const upsertSummary = lightweightResult.upsertSummary;

        if (!isCurrentFetchRequest(requestId) || currentFetchTask !== task) {
            return;
        }

        currentFetchTask = null;
        if (!getShow() || result.status === "cancelled") {
            return;
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
        const didMateriallyChange =
            upsertSummary.insertedCount + upsertSummary.updatedCount > 0
            || didVisibleMateriallyChange;

        updateRelayHistoryCursorAfterDialogRefresh(result);

        state.syncStatus = resolveSyncStatusAfterFetch(result, didMateriallyChange);
        scheduleSyncStatusMessageClearIfNeeded();

        if (didMateriallyChange) {
            if (state.searchQuery) {
                await loadSearchPage(state.searchPage, state.searchQuery);
            } else if (state.loadedPosts.length === 0 || !state.hasNewerLocal) {
                await loadLatestVisiblePosts();
            } else {
                await refreshTotalCountFromRepository();
                await refreshTimelineAvailability(pubkeyHex);
            }
        }
    }

    function shouldRunDialogOpenRefresh(): boolean {
        if (typeof state.lastDialogOpenRefreshAt !== "number") {
            return true;
        }

        return Date.now() - state.lastDialogOpenRefreshAt >=
            POST_HISTORY_DIALOG_OPEN_REFRESH_TTL_MS;
    }

    function startOpenRelayFetchAfterLocalLoad(
        pubkeyHex: string,
        localPosts: PostHistoryRecord[],
    ): void {
        if (
            hasStartedInitialSync ||
            !getShow() ||
            getPubkeyHex() !== pubkeyHex ||
            !getRxNostr()
        ) {
            return;
        }

        hasStartedInitialSync = true;
        if (localPosts.length === 0) {
            void bootstrapFromRelays();
            return;
        }

        if (shouldRunDialogOpenRefresh()) {
            void refreshRecentFromRelaysOnDialogOpen();
        }
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

        return loadOlderVisiblePosts({
            reason: "normal-older-reveal",
        });
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

    async function fetchOlderFromRelays(
        options: FetchOlderFromRelaysOptions = {},
    ): Promise<boolean> {
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!pubkeyHex || !rxNostr || !canFetchOlderFromRelays) {
            return false;
        }

        cancelCurrentSync();
        const requestId = ++fetchRequestId;
        state.syncStatus = "older-syncing";
        const maxAttempts = POST_HISTORY_OLDER_BACKFILL_MAX_ATTEMPTS_PER_CLICK;
        const maxExploreSeconds = POST_HISTORY_OLDER_BACKFILL_MAX_AUTO_EXPLORE_SECONDS;
        const targetVisibleAdded = Math.max(1, Math.min(pageSize, 30));
        let clickStartVisibleCount: number | null = null;
        let attemptIndex = 0;
        let exploredSeconds = 0;
        let batchWindowIndex = 0;
        let batchNextUntil: number | null = null;
        let batchContinuationSince: number | null = null;
        let batchChanged = false;
        let batchStoppedReason: string | null = null;
        let autoRetryCount = 0;
        let autoRetryReason: string | null = null;

        while (true) {
            attemptIndex += 1;
            const resolvedFetchUntil =
                batchNextUntil ?? await resolveOlderRelayFetchUntil(pubkeyHex);
            const usingBatchCursor = typeof batchNextUntil === "number";
            const previousVisibleUntil = await refreshVisibleUntil(pubkeyHex);
            if (
                !isCurrentFetchRequest(requestId) ||
                !getShow() ||
                getPubkeyHex() !== pubkeyHex
            ) {
                return batchChanged;
            }

            const effectiveFetchUntil = (() => {
                if (typeof resolvedFetchUntil === "number") {
                    if (usingBatchCursor) {
                        return resolvedFetchUntil;
                    }
                    return typeof previousVisibleUntil === "number"
                        ? Math.min(resolvedFetchUntil, previousVisibleUntil)
                        : resolvedFetchUntil;
                }

                return previousVisibleUntil;
            })();

            if (typeof effectiveFetchUntil !== "number") {
                state.syncStatus = "idle";
                return batchChanged;
            }

            const until = Math.trunc(effectiveFetchUntil) - 1;
            if (until < 0) {
                setOlderBackfillNextCursor(null, null);
                state.syncStatus = "idle";
                return batchChanged;
            }

            const windowIndex = Math.min(
                batchWindowIndex,
                POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE.length - 1,
            );
            const windowSeconds =
                POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE[windowIndex];
            const windowLabel =
                POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE_LABELS[windowIndex];
            const continuationSince =
                typeof batchContinuationSince === "number" &&
                    batchContinuationSince <= until
                    ? batchContinuationSince
                    : null;
            const fetchRange: OlderBackfillSearchRange = {
                since: continuationSince ?? Math.max(0, until - windowSeconds),
                until,
                windowSeconds,
            };

            const previousCount = await countVisiblePosts(pubkeyHex, previousVisibleUntil);
            if (
                !isCurrentFetchRequest(requestId) ||
                !getShow() ||
                getPubkeyHex() !== pubkeyHex
            ) {
                return batchChanged;
            }

            if (clickStartVisibleCount === null) {
                clickStartVisibleCount = previousCount;
            }

            const previousStoredCount = await postHistoryRepository.countForPubkey(pubkeyHex);
            if (
                !isCurrentFetchRequest(requestId) ||
                !getShow() ||
                getPubkeyHex() !== pubkeyHex
            ) {
                return batchChanged;
            }

            let didMateriallyChange = false;
            let upsertSummary = {
                insertedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
            };

            const task = postHistoryRelayFetchService.fetchLatest(rxNostr, {
                pubkeyHex,
                relayConfig: getRelayConfig(),
                reason: "older-backfill",
                limit: POST_HISTORY_OLDER_FETCH_LIMIT,
                timeoutMs: POST_HISTORY_OLDER_FETCH_TIMEOUT_MS,
                since: fetchRange.since,
                until: fetchRange.until,
            });
            currentFetchTask = task;

            const result = await task.promise;
            if (!isCurrentFetchRequest(requestId) || currentFetchTask !== task) {
                return batchChanged;
            }

            currentFetchTask = null;
            if (!getShow() || result.status === "cancelled") {
                batchStoppedReason = "status-cancelled";
                return batchChanged;
            }

            if (result.events.length > 0) {
                upsertSummary = await postHistoryRepository.upsertFetchedEvents({
                    events: result.events,
                    fetchedAt: result.fetchedAt,
                });
                didMateriallyChange =
                    upsertSummary.insertedCount + upsertSummary.updatedCount > 0;
            }
            if (!isCurrentFetchRequest(requestId) || !getShow()) {
                return batchChanged;
            }

            const nextVisibleUntil = await updateVisibleUntilFromOlderBackfillFetch(
                pubkeyHex,
                result,
            );
            if (!isCurrentFetchRequest(requestId) || !getShow()) {
                return batchChanged;
            }

            const nextCount = await countVisiblePosts(pubkeyHex, nextVisibleUntil);
            if (!isCurrentFetchRequest(requestId) || !getShow()) {
                return batchChanged;
            }

            const nextStoredCount = await postHistoryRepository.countForPubkey(pubkeyHex);
            if (!isCurrentFetchRequest(requestId) || !getShow()) {
                return batchChanged;
            }

            const didVisibleCountIncrease = nextCount > previousCount;
            const hitLimitReasons = resolveOlderBackfillLimitHitReasons(
                result,
                POST_HISTORY_OLDER_FETCH_LIMIT,
            );
            const hitLimit = hitLimitReasons.length > 0;
            const oldestCreatedAt = resolveOldestCreatedAtFromFetchResult(result);
            const remainingWindowSeconds =
                typeof oldestCreatedAt === "number" && oldestCreatedAt > fetchRange.since
                    ? oldestCreatedAt - fetchRange.since
                    : 0;
            const canContinueWithinWindow =
                result.status === "success" &&
                hitLimit &&
                typeof oldestCreatedAt === "number" &&
                oldestCreatedAt > fetchRange.since &&
                remainingWindowSeconds >=
                POST_HISTORY_OLDER_BACKFILL_MIN_CONTINUATION_SECONDS;

            let nextUntilCursor = fetchRange.since > 0 ? fetchRange.since : null;
            let nextContinuationSince: number | null = null;
            if (canContinueWithinWindow && typeof oldestCreatedAt === "number") {
                nextUntilCursor = oldestCreatedAt;
                nextContinuationSince = fetchRange.since;
            }

            olderBackfillSearch.windowSeconds = windowSeconds;
            olderBackfillSearch.lastRange = {
                ...fetchRange,
                hitLimit,
            };
            if (result.status === "success" && result.events.length === 0) {
                olderBackfillSearch.consecutiveEmptyCount += 1;
            } else if (result.events.length > 0) {
                olderBackfillSearch.consecutiveEmptyCount = 0;
            }
            setOlderBackfillNextCursor(nextUntilCursor, nextContinuationSince);

            logOlderBackfillResult(
                fetchRange,
                result,
                POST_HISTORY_OLDER_FETCH_LIMIT,
            );

            let didLoadFetchedOlderPosts = false;
            const olderLoadMetrics: LoadOlderVisiblePostsMetrics = {
                loadedPostsBeforeLength: state.loadedPosts.length,
                loadedPostsAfterLength: state.loadedPosts.length,
                olderPostsLength: 0,
                visibleOldestBefore:
                    state.loadedPosts.length > 0
                        ? state.loadedPosts[state.loadedPosts.length - 1]?.createdAt ?? null
                        : null,
                visibleOldestAfter:
                    state.loadedPosts.length > 0
                        ? state.loadedPosts[state.loadedPosts.length - 1]?.createdAt ?? null
                        : null,
                didTrimForOlderAppend: false,
                didDeferOlderPosts: false,
                maxVisiblePosts,
            };

            if (state.searchQuery) {
                await loadSearchPage(state.searchPage, state.searchQuery);
            } else {
                state.totalCount = nextCount;
                if (didVisibleCountIncrease || didMateriallyChange) {
                    didLoadFetchedOlderPosts = await loadOlderVisiblePosts(
                        {
                            anchorEventId: options.anchorEventId,
                            metrics: olderLoadMetrics,
                            reason: "normal-older-reveal",
                        },
                    );
                } else {
                    await refreshTimelineAvailability(pubkeyHex);
                }
            }

            const attemptChanged =
                didLoadFetchedOlderPosts ||
                didVisibleCountIncrease ||
                didMateriallyChange;
            const nextBatchChanged: boolean =
                batchChanged || attemptChanged;
            const didCursorAdvanceOlder =
                typeof nextUntilCursor === "number" &&
                nextUntilCursor < effectiveFetchUntil;
            const currentVisibleCount = nextCount;
            const visibleAddedThisAttempt = Math.max(0, nextCount - previousCount);
            const totalVisibleAdded = Math.max(
                0,
                currentVisibleCount - (clickStartVisibleCount ?? currentVisibleCount),
            );
            const postsPerDay = fetchRange.windowSeconds > 0
                ? visibleAddedThisAttempt / (fetchRange.windowSeconds / (24 * 60 * 60))
                : null;
            const cursorAdvancedSeconds = typeof nextUntilCursor === "number"
                ? Math.max(0, effectiveFetchUntil - nextUntilCursor)
                : Math.max(0, effectiveFetchUntil);
            const nextExploredSeconds = exploredSeconds + cursorAdvancedSeconds;
            const retryDecision = resolveOlderBackfillAutoRetryDecision({
                status: result.status,
                changed: attemptChanged,
                didCursorAdvanceOlder,
                hitLimit,
                continuedWithinWindow: canContinueWithinWindow,
                attemptIndex,
                maxAttempts,
                totalVisibleAdded,
                targetVisibleAdded,
                exploredSeconds: nextExploredSeconds,
                maxExploreSeconds,
            });
            const shouldContinueForSmallBatch = retryDecision.shouldContinue;
            const nextAutoRetryCount = shouldContinueForSmallBatch
                ? autoRetryCount + 1
                : autoRetryCount;

            exploredSeconds = nextExploredSeconds;

            if (shouldContinueForSmallBatch) {
                state.latestOlderBackfillUiResult = {
                    changed: nextBatchChanged,
                    didTrimForOlderAppend: olderLoadMetrics.didTrimForOlderAppend,
                    didDeferOlderPosts: olderLoadMetrics.didDeferOlderPosts,
                    loadedPostsBeforeLength: olderLoadMetrics.loadedPostsBeforeLength,
                    loadedPostsAfterLength: olderLoadMetrics.loadedPostsAfterLength,
                    maxVisiblePosts: olderLoadMetrics.maxVisiblePosts,
                    autoRetryCount: nextAutoRetryCount,
                    autoRetryReason: retryDecision.reason,
                    attemptIndex,
                    maxAttempts,
                    clickStartVisibleCount:
                        clickStartVisibleCount ?? currentVisibleCount,
                    currentVisibleCount,
                    totalVisibleAdded,
                    targetVisibleAdded,
                    shouldContinueForSmallBatch,
                    exploredSeconds,
                    maxExploreSeconds,
                };

                autoRetryCount = nextAutoRetryCount;
                autoRetryReason = retryDecision.reason;
                batchChanged = nextBatchChanged;
                batchStoppedReason = null;
                batchNextUntil = nextUntilCursor;
                batchContinuationSince = nextContinuationSince;
                if (!canContinueWithinWindow) {
                    batchWindowIndex = Math.min(
                        batchWindowIndex + 1,
                        POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE.length - 1,
                    );
                }
                continue;
            }

            autoRetryReason = retryDecision.reason;
            batchChanged = nextBatchChanged;
            batchStoppedReason = retryDecision.reason;

            state.latestOlderBackfillUiResult = {
                changed: batchChanged,
                didTrimForOlderAppend: olderLoadMetrics.didTrimForOlderAppend,
                didDeferOlderPosts: olderLoadMetrics.didDeferOlderPosts,
                loadedPostsBeforeLength: olderLoadMetrics.loadedPostsBeforeLength,
                loadedPostsAfterLength: olderLoadMetrics.loadedPostsAfterLength,
                maxVisiblePosts: olderLoadMetrics.maxVisiblePosts,
                autoRetryCount,
                autoRetryReason,
                attemptIndex,
                maxAttempts,
                clickStartVisibleCount:
                    clickStartVisibleCount ?? currentVisibleCount,
                currentVisibleCount,
                totalVisibleAdded,
                targetVisibleAdded,
                shouldContinueForSmallBatch,
                exploredSeconds,
                maxExploreSeconds,
            };

            if (result.status !== "success") {
                state.syncStatus = "failed";
                scheduleSyncStatusMessageClearIfNeeded();
                return batchChanged;
            }

            state.syncStatus = batchChanged
                ? resolveSyncStatusAfterFetch(result, true)
                : "idle";
            scheduleSyncStatusMessageClearIfNeeded();

            return batchChanged;
        }
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

            if (!getShow() || result.status === "cancelled") {
                currentViewRefetchTask = null;
                state.currentViewRefetchStatus = "idle";
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

            let replyRepairResult: PostHistoryVisibleRangeReplyRepairResult | null = null;
            if (
                currentViewRefetchTask === task
                && getShow()
                && getPubkeyHex() === pubkeyHex
                && getRxNostr() === rxNostr
                && state.loadedPosts.length > 0
            ) {
                const replyRepairTask =
                    postHistoryVisibleRangeReplyRepairService.repairVisibleKind1DirectReplies(
                        rxNostr,
                        {
                            ownerPubkeyHex: pubkeyHex,
                            visiblePosts: state.loadedPosts,
                            relayConfig: getRelayConfig(),
                            isActive: () =>
                                currentViewRefetchTask === task
                                && getShow()
                                && getPubkeyHex() === pubkeyHex
                                && getRxNostr() === rxNostr,
                        },
                    );
                currentViewReplyRepairTask = replyRepairTask;
                replyRepairResult = await replyRepairTask.promise;
                if (currentViewReplyRepairTask === replyRepairTask) {
                    currentViewReplyRepairTask = null;
                }
                if (
                    currentViewRefetchTask !== task
                    || replyRepairResult.status === "cancelled"
                    || !getShow()
                ) {
                    return;
                }

                if (replyRepairResult.savedParentEventIds.length > 0) {
                    await onReplyBadgeRefreshRequested(
                        state.loadedPosts,
                        replyRepairResult.savedParentEventIds,
                    );
                }
            }

            currentViewRefetchTask = null;
            state.currentViewRefetchStatus = "idle";

            if (result.addedCount > 0) {
                state.currentViewRefetchMessageKey = "postHistory.repairAdded";
                state.currentViewRefetchMessageValues = {
                    count: result.addedCount,
                    processedRangeCount: result.processedRangeCount,
                    updatedCount: result.updatedCount,
                };
            } else if ((replyRepairResult?.savedDirectReplyCount ?? 0) > 0) {
                state.currentViewRefetchMessageKey = "postHistory.repairRepliesAdded";
                state.currentViewRefetchMessageValues = {
                    count: replyRepairResult?.savedDirectReplyCount ?? 0,
                };
            } else if (result.fetchFailed) {
                state.currentViewRefetchMessageKey = "postHistory.repairFetchFailed";
                state.currentViewRefetchMessageValues = null;
            } else if (
                result.hadUnfinishedRanges
                || replyRepairResult?.status === "partial"
            ) {
                state.currentViewRefetchMessageKey = "postHistory.repairPartialFailure";
                state.currentViewRefetchMessageValues = null;
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
            state.currentViewRefetchMessageKey = "postHistory.repairFetchFailed";
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
                postHistoryReplyEventsRepository.deleteForPostHistoryPubkey(pubkeyHex),
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
        const nextPubkeyKey = resolveListingSnapshotKey(getPubkeyHex());
        if (nextPubkeyKey === activePubkeyKey) {
            return;
        }

        activePubkeyKey = nextPubkeyKey;
        state.lastDialogOpenRefreshAt = null;
        resetOlderBackfillSearchState();
        clearOlderRevealReplyRepairState();
    });

    $effect(() => {
        const nextRxNostr = getRxNostr();
        if (nextRxNostr === activeOlderRevealReplyRepairRxNostr) {
            return;
        }

        activeOlderRevealReplyRepairRxNostr = nextRxNostr;
        clearOlderRevealReplyRepairState();
    });

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
            lastDialogOpenRefreshAt: state.lastDialogOpenRefreshAt,
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
        return () => {
            clearOlderRevealReplyRepairState();
        };
    });

    $effect(() => {
        if (!getShow()) {
            clearSyncStatusMessageClearTimeout();
            return;
        }

        scheduleSyncStatusMessageClearIfNeeded();
        return () => {
            clearSyncStatusMessageClearTimeout();
        };
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

        const nextInitialLoadKey = resolveListingSnapshotKey(getPubkeyHex()) ?? "";
        if (
            hasAttemptedInitialLocalLoad
            && initialLocalLoadKey === nextInitialLoadKey
        ) {
            return;
        }

        hasAttemptedInitialLocalLoad = true;
        initialLocalLoadKey = nextInitialLoadKey;

        const sessionScrollState = getNormalSessionScrollStateForCurrentPubkey();
        const pendingLatestRequest =
            consumePostHistoryShouldReturnToLatestAfterLocalPost(getPubkeyHex());
        if (shouldApplyPendingLatestRequest(pendingLatestRequest, sessionScrollState)) {
            onSessionScrollStateInvalidated();
            void loadLatestVisiblePosts();
            return;
        }

        if (canPreserveSessionVisibleWindow(sessionScrollState)) {
            void refreshPreservedVisibleWindow(
                sessionScrollState,
                pendingLatestRequest,
            );
            return;
        }

        if (sessionScrollState) {
            void loadVisibleWindowAroundSessionAnchor(sessionScrollState);
            return;
        }

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
        get isFetchingFromRelays() {
            return isFetchingFromRelays;
        },
        get isRefetchingAroundCurrentView() {
            return isRefetchingAroundCurrentView;
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
        get latestOlderBackfillUiResult() {
            return state.latestOlderBackfillUiResult;
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
