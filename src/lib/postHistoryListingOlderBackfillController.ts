import type { RxNostr } from "rx-nostr";
import {
    persistPostHistoryAuthoredFetch,
    type createPostHistoryAuthoredFetchScope,
} from "./postHistoryAuthoredFetchPersistence";
import { getPostHistoryOlderUncoveredRange } from "./postHistoryBrowsingContinuity";
import type { PostHistoryLightweightAuthoredSyncTask } from "./postHistoryLightweightSyncCoordinator";
import {
    POST_HISTORY_OLDER_BACKFILL_INITIAL_WINDOW_SECONDS,
    POST_HISTORY_OLDER_BACKFILL_MAX_ATTEMPTS_PER_CLICK,
    POST_HISTORY_OLDER_BACKFILL_MAX_AUTO_EXPLORE_SECONDS,
    POST_HISTORY_OLDER_BACKFILL_MIN_CONTINUATION_SECONDS,
    resolveNextOlderBackfillWindowIndex,
    resolveOlderBackfillAttemptProgress,
    resolveOlderBackfillAutoRetryDecision,
    resolveOlderBackfillContinuation,
    resolveOlderBackfillCoverageProgress,
    resolveOlderBackfillEffectiveFetchUntil,
    resolveOlderBackfillLimitHitReasons,
    resolveOlderBackfillWindowSeconds,
    resolveOldestCreatedAtFromFetchResult,
    resolvePostHistoryOlderRelayFetchUntil,
    type OlderBackfillSearchRange,
    type OlderBackfillSearchState,
    type OlderBackfillUiResult,
} from "./postHistoryListingOlderBackfill";
import type { PostHistoryCoverageRange } from "./postHistoryRelayCoverage";
import {
    POST_HISTORY_OLDER_FETCH_LIMIT,
    POST_HISTORY_OLDER_FETCH_TIMEOUT_MS,
    postHistoryRelayFetchService,
    type PostHistoryRelayFetchResult,
    type PostHistoryRelayFetchTask,
} from "./postHistoryRelayFetchService";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import {
    postHistoryRepository,
    type PostHistoryTimelineCursor,
} from "./storage/postHistoryRepository";
import type { RelayConfig } from "./types";

export interface LoadOlderVisiblePostsMetrics {
    loadedPostsBeforeLength: number;
    loadedPostsAfterLength: number;
    olderPostsLength: number;
    visibleOldestBefore: number | null;
    visibleOldestAfter: number | null;
    didTrimForOlderAppend: boolean;
    didDeferOlderPosts: boolean;
    maxVisiblePosts: number;
}

export interface LoadOlderVisiblePostsOptions {
    anchorEventId?: string | null;
    autoLoadViewportCommit?: AutoLoadViewportCommit;
    relayFetchViewportCommit?: OlderRelayFetchViewportCommit;
    metrics?: LoadOlderVisiblePostsMetrics;
    reason?: LoadOlderVisiblePostsReason;
    useContiguousProgress?: boolean;
    preserveContiguousProgressAfterDatabaseChange?: boolean;
}

export interface AutoLoadViewportCommit {
    captureAnchorEventId: () => string | null;
    canCommitWindowChange: (
        direction: "older" | "newer",
        currentPosts: PostHistoryRecord[],
        nextPosts: PostHistoryRecord[],
    ) => boolean;
    onCommitted: () => void;
}

export type LoadOlderVisiblePostsReason = "normal-older-reveal";

export interface FetchOlderFromRelaysOptions {
    anchorEventId?: string | null;
    viewportCommit?: OlderRelayFetchViewportCommit;
}

export interface OlderRelayFetchViewportCommit {
    captureAnchorEventId: () => string | null;
    onCommitted: () => void;
}

const SHOULD_DEBUG_POST_HISTORY_BACKFILL = import.meta.env.DEV;

type PostHistoryListingFetchTask =
    | PostHistoryRelayFetchTask
    | PostHistoryLightweightAuthoredSyncTask;

/** The slice of the listing hook's reactive state that older backfill reads and writes. */
export interface PostHistoryListingOlderBackfillState {
    readonly listingMode: "contiguous" | "sparse";
    readonly loadedPosts: PostHistoryRecord[];
    readonly visibleUntil: number | null;
    readonly hasJumpCacheAnchors: boolean;
    readonly searchQuery: string;
    readonly searchPage: number;
    readonly sparseSource: "jump" | "saved" | null;
    readonly hasOlderLocal: boolean;
    latestOlderBackfillUiResult: OlderBackfillUiResult | null;
    nextUntil: number | null;
    hasMoreRemote: boolean;
}

export interface PostHistoryListingOlderBackfillControllerDeps {
    state: PostHistoryListingOlderBackfillState;
    /** Reactive search cursor owned by the hook; this controller mutates it. */
    olderBackfillSearch: OlderBackfillSearchState;
    pageSize: number;
    maxVisiblePosts: number;
    getRelayConfig: () => RelayConfig | null | undefined;
    getVisibleOldestCreatedAt: () => number | null;
    hasLocalBrowsingRanges: () => boolean;
    getLoadRequestId: () => number;
    /** The external fetch slot is shared with the hook's other relay fetches. */
    getCurrentFetchTask: () => PostHistoryListingFetchTask | null;
    setCurrentFetchTask: (task: PostHistoryListingFetchTask | null) => void;
    isSparseListingContext: (visibleUntil: number | null) => boolean;
    toTimelineCursor: (
        post: PostHistoryRecord | null | undefined,
    ) => PostHistoryTimelineCursor | null;
    sameTimelineCursor: (
        left: PostHistoryTimelineCursor | null | undefined,
        right: PostHistoryTimelineCursor | null | undefined,
    ) => boolean;
    clearContiguousProgress: () => void;
    commitHistoryViewport: (apply: () => Promise<void>) => Promise<void>;
    readExternalVisibleUntil: (pubkeyHex: string) => Promise<number | null>;
    readExternalContinuity: (pubkeyHex: string) => Promise<PostHistoryCoverageRange[]>;
    countVisiblePosts: (pubkeyHex: string, visibleUntil: number | null) => Promise<number>;
    createAuthoredScope: (
        pubkeyHex: string,
        rxNostr: RxNostr,
        requestId: number,
    ) => ReturnType<typeof createPostHistoryAuthoredFetchScope>;
    updateVisibleUntilFromOlderBackfillFetch: (
        pubkeyHex: string,
        result: PostHistoryRelayFetchResult,
    ) => Promise<number | null>;
    reconcileContiguousProgressAfterDatabaseChange: (
        pubkeyHex: string,
        visibleUntil: number | null,
        options: { preserveReachedVisibleCount: boolean },
    ) => Promise<boolean>;
    refreshSavedPostsOutsideVisibleRange: (
        pubkeyHex: string,
        visibleUntil: number | null,
        expectedRequestId: number | null,
        expectedFetchRequestId: number | null,
    ) => Promise<void>;
    rebuildSearchResultsThroughPage: (page: number, query: string) => Promise<unknown>;
    refreshTotalCount: (options: { force: boolean }) => void;
    loadOlderVisiblePosts: (options: LoadOlderVisiblePostsOptions) => Promise<boolean>;
    loadOlderSavedPosts: (
        pubkeyHex: string,
        requestId: number,
        options: LoadOlderVisiblePostsOptions,
    ) => Promise<boolean>;
    loadOlderSparsePosts: (
        pubkeyHex: string,
        requestId: number,
        options: LoadOlderVisiblePostsOptions,
    ) => Promise<boolean>;
    refreshTimelineAvailability: (pubkeyHex: string) => Promise<void>;
}

/**
 * Older backfill from external relays: plans each windowed query, persists the
 * result, and reveals the fetched rows. The hook decides when a backfill runs
 * and whether it is still current (isActive); listing state stays in the hook
 * and is reached through deps.
 */
export function createPostHistoryListingOlderBackfillController(
    deps: PostHistoryListingOlderBackfillControllerDeps,
) {
    const { state, olderBackfillSearch, getRelayConfig } = deps;

    function resetOlderBackfillSearchState(): void {
        olderBackfillSearch.windowSeconds =
            POST_HISTORY_OLDER_BACKFILL_INITIAL_WINDOW_SECONDS;
        olderBackfillSearch.nextUntil = null;
        olderBackfillSearch.consecutiveEmptyCount = 0;
        olderBackfillSearch.lastRange = null;
        olderBackfillSearch.continuationSince = null;
        olderBackfillSearch.exhausted = false;
    }

    async function resolveOlderRelayFetchUntil(
        pubkeyHex: string,
        planningFloor = state.visibleUntil,
    ): Promise<number | null> {
        const visibleOldestCreatedAt = deps.getVisibleOldestCreatedAt();
        if (
            (!deps.hasLocalBrowsingRanges() || deps.isSparseListingContext(state.visibleUntil))
            &&
            typeof visibleOldestCreatedAt === "number"
            && (
                planningFloor === null
                    ? state.hasJumpCacheAnchors
                    : visibleOldestCreatedAt < planningFloor
            )
        ) {
            return visibleOldestCreatedAt;
        }

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

    async function fetchOlderFromRelaysForRequest(
        pubkeyHex: string,
        rxNostr: RxNostr,
        requestId: number,
        isActive: () => boolean,
        options: FetchOlderFromRelaysOptions,
        onCompleted: (success: boolean) => void,
    ): Promise<boolean> {
        let preparedVisibleUntil: number | null | undefined;
        // A background query or reopened session may already have bridged the gap.
        // Check only the older side, without publishing availability against the
        // old rows before the local page and its viewport anchor are committed.
        while (state.listingMode === "contiguous") {
            const externalFloor = await deps.readExternalVisibleUntil(pubkeyHex);
            if (!isActive()) return false;
            const cursor = deps.toTimelineCursor(state.loadedPosts.at(-1));
            const hasOlderLocal = cursor ? await postHistoryRepository.hasOlderVisiblePosts({
                pubkeyHex, visibleUntil: externalFloor, cursor,
            }) : false;
            if (!isActive()) return false;
            // The DB check may outlive a background external coverage update.
            // Compare external floors; state.visibleUntil also includes local browsing.
            const nextExternalFloor = await deps.readExternalVisibleUntil(pubkeyHex);
            if (!isActive()) return false;
            if (state.listingMode !== "contiguous") break;
            if (nextExternalFloor !== externalFloor
                || (cursor && !deps.sameTimelineCursor(cursor, deps.toTimelineCursor(state.loadedPosts.at(-1))))) continue;
            preparedVisibleUntil = externalFloor;
            if (hasOlderLocal) {
                deps.clearContiguousProgress();
                let changed = false;
                await deps.commitHistoryViewport(async () => {
                    if (!isActive()) return;
                    changed = await deps.loadOlderVisiblePosts({
                        anchorEventId: options.anchorEventId,
                        relayFetchViewportCommit: options.viewportCommit,
                        useContiguousProgress: false,
                    });
                });
                return changed;
            }
            break;
        }

        const maxAttempts = POST_HISTORY_OLDER_BACKFILL_MAX_ATTEMPTS_PER_CLICK;
        const maxExploreSeconds = POST_HISTORY_OLDER_BACKFILL_MAX_AUTO_EXPLORE_SECONDS;
        const targetVisibleAdded = Math.max(1, Math.min(deps.pageSize, 30));
        let clickStartVisibleCount: number | null = null;
        let attemptIndex = 0;
        let exploredSeconds = 0;
        let batchWindowIndex = 0;
        let batchNextUntil: number | null = null;
        let batchContinuationSince: number | null = null;
        let batchChanged = false;
        let autoRetryCount = 0;
        let autoRetryReason: string | null = null;

        while (true) {
            attemptIndex += 1;
            const planningFloor = await deps.readExternalVisibleUntil(pubkeyHex);
            const resolvedFetchUntil =
                batchNextUntil ?? await resolveOlderRelayFetchUntil(pubkeyHex, planningFloor);
            const usingBatchCursor = typeof batchNextUntil === "number";
            const previousVisibleUntil = attemptIndex === 1
                && preparedVisibleUntil !== undefined && preparedVisibleUntil === planningFloor
                ? preparedVisibleUntil
                : planningFloor;
            if (!isActive()) {
                return batchChanged;
            }

            const effectiveFetchUntil = resolveOlderBackfillEffectiveFetchUntil({
                previousVisibleUntil,
                resolvedFetchUntil,
                usingBatchCursor,
                isSparseListing: () => deps.hasLocalBrowsingRanges()
                    ? deps.isSparseListingContext(state.visibleUntil)
                    : deps.isSparseListingContext(previousVisibleUntil),
            });

            if (typeof effectiveFetchUntil !== "number") {
                return batchChanged;
            }

            const rangesBeforeFetch = await deps.readExternalContinuity(pubkeyHex);
            if (!isActive()) return batchChanged;

            const windowSeconds = resolveOlderBackfillWindowSeconds(batchWindowIndex);
            const uncovered = getPostHistoryOlderUncoveredRange(rangesBeforeFetch, Math.trunc(effectiveFetchUntil), windowSeconds, batchContinuationSince);
            if (!uncovered) {
                setOlderBackfillNextCursor(null, null);
                return batchChanged;
            }
            const fetchRange: OlderBackfillSearchRange = {
                ...uncovered,
                windowSeconds,
            };

            const previousCount = await deps.countVisiblePosts(pubkeyHex, previousVisibleUntil);
            if (!isActive()) {
                return batchChanged;
            }

            if (clickStartVisibleCount === null) {
                clickStartVisibleCount = previousCount;
            }

            let didMateriallyChange = false;
            let upsertSummary = {
                insertedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                appliedDeletionCount: 0,
            };

            const authoredScope = await deps.createAuthoredScope(pubkeyHex, rxNostr, requestId);
            if (!isActive() || !authoredScope.isActive()) return batchChanged;
            const task = postHistoryRelayFetchService.fetchLatest(rxNostr, {
                pubkeyHex,
                relayConfig: getRelayConfig(),
                reason: "older-backfill",
                limit: POST_HISTORY_OLDER_FETCH_LIMIT,
                timeoutMs: POST_HISTORY_OLDER_FETCH_TIMEOUT_MS,
                since: fetchRange.since,
                until: fetchRange.until,
            });
            deps.setCurrentFetchTask(task);

            const result = await task.promise;
            if (!isActive() || deps.getCurrentFetchTask() !== task) {
                return batchChanged;
            }

            deps.setCurrentFetchTask(null);
            if (!authoredScope.isActive() || result.status === "cancelled") {
                return batchChanged;
            }

            if (result.events.length > 0 || result.relayFetchCoverage?.length) {
                const saved = await persistPostHistoryAuthoredFetch(result, authoredScope);
                if (saved.applied === false || !authoredScope.isActive()) return batchChanged;
                upsertSummary = saved;
                didMateriallyChange =
                    upsertSummary.insertedCount + upsertSummary.updatedCount > 0;
            }
            if (!isActive()) {
                return batchChanged;
            }

            const visibleOldestCreatedAt = deps.getVisibleOldestCreatedAt();
            const isSparseBackfillContext =
                typeof visibleOldestCreatedAt === "number"
                && (
                    state.visibleUntil === null
                        ? state.hasJumpCacheAnchors
                        : visibleOldestCreatedAt < state.visibleUntil
                );

            const nextVisibleUntil = isSparseBackfillContext
                ? previousVisibleUntil
                : await deps.updateVisibleUntilFromOlderBackfillFetch(
                    pubkeyHex,
                    result,
                );
            if (!isActive()) {
                return batchChanged;
            }

            const effectiveVisibleUntil = nextVisibleUntil;

            const nextCount = await deps.countVisiblePosts(pubkeyHex, effectiveVisibleUntil);
            if (!isActive()) {
                return batchChanged;
            }

            let canPreserveContiguousProgress = false;
            if (!isSparseBackfillContext) {
                canPreserveContiguousProgress =
                    await deps.reconcileContiguousProgressAfterDatabaseChange(
                        pubkeyHex,
                        effectiveVisibleUntil,
                        { preserveReachedVisibleCount: true },
                    );
            }

            await deps.refreshSavedPostsOutsideVisibleRange(
                pubkeyHex,
                effectiveVisibleUntil,
                null,
                requestId,
            );
            if (!isActive()) {
                return batchChanged;
            }

            const didVisibleCountIncrease = nextCount > previousCount;
            const continuation = resolveOlderBackfillContinuation(
                result,
                fetchRange,
                POST_HISTORY_OLDER_FETCH_LIMIT,
            );
            const { hitLimit, canContinueWithinWindow, nextContinuationSince } = continuation;
            let nextUntilCursor = continuation.nextUntilCursor;

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
            const nextExternalFloor = await deps.readExternalVisibleUntil(pubkeyHex);
            if (!isActive()) return batchChanged;
            if (typeof nextExternalFloor === "number" && !isSparseBackfillContext) nextUntilCursor = nextExternalFloor;
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
                maxVisiblePosts: deps.maxVisiblePosts,
            };

            await deps.commitHistoryViewport(async () => {
                if (!isActive()) return;
                if (state.searchQuery) {
                    await deps.rebuildSearchResultsThroughPage(
                        state.searchPage,
                        state.searchQuery,
                    );
                } else {
                    deps.refreshTotalCount({ force: didMateriallyChange });
                    if (didVisibleCountIncrease || didMateriallyChange) {
                        didLoadFetchedOlderPosts = state.sparseSource === "saved"
                            ? await deps.loadOlderSavedPosts(pubkeyHex, deps.getLoadRequestId(), {
                                anchorEventId: options.anchorEventId,
                                relayFetchViewportCommit: options.viewportCommit,
                            })
                            : isSparseBackfillContext
                                ? await deps.loadOlderSparsePosts(pubkeyHex, deps.getLoadRequestId(), {
                                    anchorEventId: options.anchorEventId,
                                    relayFetchViewportCommit: options.viewportCommit,
                                })
                                : await deps.loadOlderVisiblePosts({
                                    anchorEventId: options.anchorEventId,
                                    relayFetchViewportCommit: options.viewportCommit,
                                    metrics: olderLoadMetrics,
                                    reason: "normal-older-reveal",
                                    useContiguousProgress: false,
                                    preserveContiguousProgressAfterDatabaseChange:
                                        canPreserveContiguousProgress,
                                });
                    } else {
                        await deps.refreshTimelineAvailability(pubkeyHex);
                    }
                }
            });

            if (!isActive()) return batchChanged;
            const attemptChanged =
                didLoadFetchedOlderPosts ||
                didVisibleCountIncrease ||
                didMateriallyChange;
            const nextBatchChanged: boolean =
                batchChanged || attemptChanged;
            const currentVisibleCount = nextCount;
            const { didCursorAdvanceOlder, totalVisibleAdded, nextExploredSeconds } =
                resolveOlderBackfillAttemptProgress({
                    nextUntilCursor,
                    effectiveFetchUntil,
                    currentVisibleCount,
                    clickStartVisibleCount,
                    exploredSeconds,
                });
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
            const { connectedSavedRange, coverageAdvanced } =
                resolveOlderBackfillCoverageProgress({
                    nextExternalFloor,
                    previousVisibleUntil,
                    rangesBeforeFetch,
                });
            const shouldContinueForSmallBatch = retryDecision.shouldContinue && coverageAdvanced
                && !state.hasOlderLocal && !connectedSavedRange;
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
                batchNextUntil = nextUntilCursor;
                batchContinuationSince = nextContinuationSince;
                if (!canContinueWithinWindow) {
                    batchWindowIndex = resolveNextOlderBackfillWindowIndex(batchWindowIndex);
                }
                continue;
            }

            autoRetryReason = retryDecision.reason;
            batchChanged = nextBatchChanged;

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
                onCompleted(false);
                return batchChanged;
            }
            onCompleted(true);

            return batchChanged;
        }
    }

    return {
        resetOlderBackfillSearchState,
        fetchOlderFromRelaysForRequest,
    };
}
