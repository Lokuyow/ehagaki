import { liveQuery } from "dexie";
import { postHistoryLocalRelayService, type LocalRelayHistoryReadResult } from "../postHistoryLocalRelayService";
import type { LocalRelayTask } from "../localRelayTransport";
import { settingsStore } from "../../stores/settingsStore.svelte";
import { isSignedNostrEvent } from "../postHistoryEventUtils";
import { createPostHistoryAuthoredFetchScope, persistPostHistoryAuthoredFetch } from "../postHistoryAuthoredFetchPersistence";
import { getPostHistoryAuthoredRelayScopeKey, resolvePostHistoryAuthoredRelayUrls } from "../postHistoryRelayResolver";
import { getPostHistoryQuorumCoverage, getPostHistoryConnectedCoverageUntil, mergePostHistoryCoverageRanges, type PostHistoryCoverageRange } from "../postHistoryRelayCoverage";
import { postHistoryRelayCoverageRepository } from "../storage/postHistoryRelayCoverageRepository";
import { postHistoryImportedRangesRepository } from "../storage/postHistoryImportedRangesRepository";
import { postHistoryLocalBrowsingRangesRepository, type PostHistoryLocalBrowsingRanges } from "../storage/postHistoryLocalBrowsingRangesRepository";
import { normalizeLocalRelayUrl } from "../localRelayUrl";
import { getAppRuntimeEnvironment } from "../appRuntimeEnvironment";
import { getPostHistoryLocalRevision } from "../storage/postHistoryLocalWriteScope";
import { postHistoryContinuityTables } from "../storage/postHistoryPersistenceCoordinator";
import { getPostHistoryBrowsingContinuity, getPostHistoryOlderUncoveredRange } from "../postHistoryBrowsingContinuity";
import type { PostHistoryJsonlImportResult } from "../postHistoryJsonlImportService";
import type { PostHistoryFullScanResult } from "../postHistoryRelayFullScanService";
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
import { resolvePostHistoryDialogOpenRefreshDecision } from "../postHistoryDialogOpenRefreshDecision";
import type { PostHistoryDialogScrollState } from "../postHistoryDialogScrollState";
import {
    postHistoryLocalSearchService,
    type SearchLocalPostsResult,
} from "../postHistoryLocalSearchService";
import {
    consumePostHistoryShouldReturnToLatestAfterLocalPost,
    type PendingPostHistoryLatestRequest,
} from "../postHistoryLatestRequest";
import {
    postHistoryCurrentViewRefetchService,
    type PostHistoryCurrentViewRefetchTask,
} from "../postHistoryCurrentViewRefetchService";
import { getPostHistorySearchRevision } from "../postHistoryLocalSearchRevision";
import {
    type PostHistoryVisibleRangeRelationRepairRequest,
} from "../postHistoryVisibleRangeChildInteractionRepairService";
import {
    createPostHistoryVisibleRangeRelationRepairCoordinator,
    type PostHistoryRelationRepairSummary,
} from "../postHistoryVisibleRangeRelationRepairCoordinator";
import {
    postHistoryRepository,
    type PostHistoryTimelineCursor,
} from "../storage/postHistoryRepository";
import { postHistoryJumpCacheAnchorRepository } from "../storage/postHistoryJumpCacheAnchorRepository";
import {
    buildPostHistoryVisibleKindsKey,
    postHistoryVisibleRangeRepository,
} from "../storage/postHistoryVisibleRangeRepository";
import { ehagakiDb, type PostHistoryRecord } from "../storage/ehagakiDb";
import type { RelayConfig } from "../types";
import { onDestroy, tick, untrack } from "svelte";

export type PostHistorySyncStatus =
    | "idle"
    | "syncing"
    | "older-syncing"
    | "synced"
    | "failed"
    | "no-more";

export type PostHistoryTotalCountStatus =
    | "unknown"
    | "loading"
    | "ready"
    | "refreshing"
    | "failed";

export type PostHistoryLocalLoadStatus =
    | "idle"
    | "loading"
    | "ready"
    | "failed";

type PostHistoryListingMode = "contiguous" | "sparse";
type PostHistorySparseSource = "jump" | "saved" | null;

type PostHistoryCurrentViewRefetchMessageValues = Record<
    string,
    string | number | boolean | Date | null | undefined
>;

interface UsePostHistoryListingParams {
    getShow: () => boolean;
    getSessionOpen?: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    getSessionScrollState?: () => PostHistoryDialogScrollState | null;
    onSessionScrollStateInvalidated?: () => void;
    onSavedAuthoredPosts?: (eventIds: string[]) => void | Promise<void>;
    onLocalHistoryChanged?: (apply: () => Promise<void>) => Promise<void>;
    onChildInteractionBadgeRefreshRequested?: (
        posts: PostHistoryRecord[],
        parentEventIds: string[],
    ) => void | Promise<void>;
    onQuoteVisibleRangeRefreshRequested?: (
        posts: PostHistoryRecord[],
    ) => void | Promise<void>;
    quoteVisibleRangeRepairExecutor?: (
        rxNostr: RxNostr,
        params: PostHistoryVisibleRangeRelationRepairRequest,
    ) => Promise<void>;
    pageSize?: number;
    searchDebounceMs?: number;
}

type PostHistoryManualRepairPhase =
    | "visible-range-state"
    | "primary-fetch"
    | "primary-persist"
    | "visible-window-reload"
    | "relation-repair"
    | "badge-refresh";

export function createPostHistoryManualRepairPhaseTelemetry(params: {
    phase: PostHistoryManualRepairPhase;
    startedAt: number;
    finishedAt?: number;
    durationMs?: number;
    error?: unknown;
    errorClass?: string;
    counts?: Record<string, number | boolean>;
}): Record<string, string | number | boolean> {
    const error = params.error;
    const errorClass = params.errorClass ?? (error instanceof Error
        ? error.name
        : error === undefined
            ? undefined
            : typeof error);
    // Deliberately exclude event/auth payloads. This is phase timing and relay
    // summary telemetry for diagnosing manual repair only.
    return {
        phase: params.phase,
        durationMs: params.durationMs ?? Math.max(
            0,
            (params.finishedAt ?? Date.now()) - params.startedAt,
        ),
        ...(errorClass ? { errorClass } : {}),
        ...(params.counts ?? {}),
    };
}

function reportPostHistoryManualRepairPhase(
    params: Parameters<typeof createPostHistoryManualRepairPhaseTelemetry>[0],
): void {
    const telemetry = createPostHistoryManualRepairPhaseTelemetry(params);
    if ("errorClass" in telemetry) {
        console.warn("post_history_manual_repair_phase", telemetry);
    } else {
        console.debug("post_history_manual_repair_phase", telemetry);
    }
}

interface PersistedPostHistoryListingSnapshot {
    coverageAnchorCreatedAt?: number | null;
    loadedPosts: PostHistoryRecord[];
    searchPosts: PostHistoryRecord[];
    searchQuery: string;
    totalCount: number;
    totalCountKnown?: boolean;
    totalCountFailed?: boolean;
    searchTotalCount: number;
    searchTotalCountKnown?: boolean;
    searchHasNext: boolean;
    hasMoreRemote: boolean;
    nextUntil: number | null;
    lastDialogOpenRefreshAt: number | null;
    visibleUntil: number | null;
    hasJumpCacheAnchors: boolean;
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
    autoLoadViewportCommit?: AutoLoadViewportCommit;
    relayFetchViewportCommit?: OlderRelayFetchViewportCommit;
    metrics?: LoadOlderVisiblePostsMetrics;
    reason?: LoadOlderVisiblePostsReason;
    useContiguousProgress?: boolean;
    preserveContiguousProgressAfterDatabaseChange?: boolean;
}

interface AutoLoadViewportCommit {
    captureAnchorEventId: () => string | null;
    canCommitWindowChange: (
        direction: "older" | "newer",
        currentPosts: PostHistoryRecord[],
        nextPosts: PostHistoryRecord[],
    ) => boolean;
    onCommitted: () => void;
}

interface ContiguousProgressSnapshot {
    pubkeyHex: string;
    visibleUntil: number | null;
    revision: number;
    totalVisibleCount: number;
    reachedVisibleCount: number;
    oldestCursor: PostHistoryTimelineCursor;
    latestEventId: string | null;
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
    viewportCommit?: OlderRelayFetchViewportCommit;
}

interface OlderRelayFetchViewportCommit {
    captureAnchorEventId: () => string | null;
    onCommitted: () => void;
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

const DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT: PersistedPostHistoryListingSnapshot = {
    loadedPosts: [],
    searchPosts: [],
    searchQuery: "",
    totalCount: 0,
    totalCountKnown: false,
    totalCountFailed: false,
    searchTotalCount: 0,
    searchTotalCountKnown: false,
    searchHasNext: false,
    hasMoreRemote: false,
    nextUntil: null,
    lastDialogOpenRefreshAt: null,
    visibleUntil: null,
    hasJumpCacheAnchors: false,
    hasOlderLocal: false,
    hasNewerLocal: false,
};

const POST_HISTORY_VISIBLE_KINDS_KEY = buildPostHistoryVisibleKindsKey([
    ...POST_HISTORY_FETCH_KINDS,
]);
const POST_HISTORY_REPAIR_PREFERRED_PADDING_SECONDS = 24 * 60 * 60;
const POST_HISTORY_JUMP_FETCH_RADIUS_SECONDS = 3 * 24 * 60 * 60;
const POST_HISTORY_JUMP_FETCH_LIMIT = 100;
function didDateChunkMissTarget(
    chunk: PostHistoryRecord[],
    targetCreatedAt: number,
): boolean {
    if (chunk.length === 0) {
        return true;
    }

    const oldestChunkCreatedAt = chunk[chunk.length - 1]?.createdAt;
    if (!Number.isFinite(oldestChunkCreatedAt)) {
        return true;
    }

    return (oldestChunkCreatedAt ?? 0) > targetCreatedAt;
}

export const POST_HISTORY_OLDER_BACKFILL_INITIAL_WINDOW_SECONDS = 12 * 60 * 60;
// Keep expanded scans bounded so older-backfill stays a windowed author query instead of drifting back to a wide until-only search.
const POST_HISTORY_OLDER_BACKFILL_MIN_CONTINUATION_SECONDS = 60 * 60;
const POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE = [
    12 * 60 * 60,
    24 * 60 * 60,
    3 * 24 * 60 * 60,
    7 * 24 * 60 * 60,
    14 * 24 * 60 * 60,
    30 * 24 * 60 * 60,
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
        searchQuery: snapshot.searchQuery ?? "",
        totalCount: snapshot.totalCount,
        // Older in-memory snapshots did not distinguish a zero count from an
        // unavailable count. A positive legacy value is safe to preserve; a
        // legacy zero is deliberately treated as unknown until refreshed.
        totalCountKnown: snapshot.totalCountKnown ?? snapshot.totalCount > 0,
        totalCountFailed: snapshot.totalCountFailed ?? false,
        searchTotalCount: snapshot.searchTotalCount,
        searchTotalCountKnown: snapshot.searchTotalCountKnown ?? snapshot.searchTotalCount > 0,
        searchHasNext: snapshot.searchHasNext,
        hasMoreRemote: snapshot.hasMoreRemote,
        nextUntil: snapshot.nextUntil,
        lastDialogOpenRefreshAt: snapshot.lastDialogOpenRefreshAt,
        visibleUntil: snapshot.visibleUntil,
        coverageAnchorCreatedAt: snapshot.coverageAnchorCreatedAt ?? null,
        hasJumpCacheAnchors: snapshot.hasJumpCacheAnchors ?? false,
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

export function readPersistedPostHistoryListingSnapshotForPubkey(
    pubkeyHex: string | null | undefined,
): PersistedPostHistoryListingSnapshot {
    return readPersistedListingSnapshot(pubkeyHex);
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
    getSessionOpen = getShow,
    getPubkeyHex,
    getRxNostr,
    getRelayConfig,
    getSessionScrollState = () => null,
    onSessionScrollStateInvalidated = () => { },
    onSavedAuthoredPosts = () => undefined,
    onLocalHistoryChanged = (apply) => apply(),
    onChildInteractionBadgeRefreshRequested = () => undefined,
    onQuoteVisibleRangeRefreshRequested = () => undefined,
    quoteVisibleRangeRepairExecutor = undefined,
    pageSize = POST_HISTORY_PAGE_SIZE,
    searchDebounceMs = 250,
}: UsePostHistoryListingParams) {
    const persistedViewState = readPersistedPostHistoryViewState(
        getPubkeyHex(),
    );
    const persistedListingSnapshot = readPersistedListingSnapshot(
        getPubkeyHex(),
    );
    const restoredSearchState =
        persistedListingSnapshot.searchQuery === persistedViewState.searchQuery
        && persistedViewState.searchQuery.length > 0;
    const persistedTotalCountKnown =
        persistedListingSnapshot.totalCountKnown ??
        persistedListingSnapshot.totalCount > 0;
    const persistedTotalCountStatus: PostHistoryTotalCountStatus =
        persistedListingSnapshot.totalCountFailed
            ? "failed"
            : persistedTotalCountKnown
              ? "ready"
              : "unknown";
    const state = $state({
        loadedPosts: persistedListingSnapshot.loadedPosts,
        searchPosts: restoredSearchState
            ? persistedListingSnapshot.searchPosts
            : [],
        searchInput: persistedViewState.searchInput,
        searchQuery: persistedViewState.searchQuery,
        currentPage: 1,
        searchPage: restoredSearchState ? persistedViewState.searchPage : 1,
        totalCount: persistedListingSnapshot.totalCount,
        totalCountKnown: persistedTotalCountKnown,
        totalCountStatus: persistedTotalCountStatus as PostHistoryTotalCountStatus,
        searchTotalCount: persistedListingSnapshot.searchTotalCount,
        searchTotalCountKnown: restoredSearchState
            && (persistedListingSnapshot.searchTotalCountKnown ?? persistedListingSnapshot.searchTotalCount > 0),
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
        hasJumpCacheAnchors: persistedListingSnapshot.hasJumpCacheAnchors,
        hasOlderLocal: persistedListingSnapshot.hasOlderLocal,
        hasNewerLocal: persistedListingSnapshot.hasNewerLocal,
        listingMode: "contiguous" as PostHistoryListingMode,
        sparseSource: null as PostHistorySparseSource,
        hasSavedPostsOutsideVisibleRange: false,
        latestOlderBackfillUiResult: null as OlderBackfillUiResult | null,
    });

    let coverageAnchorCreatedAt = $state<number | null>(persistedListingSnapshot.coverageAnchorCreatedAt ?? null);
    let quorumCoverage = $state<PostHistoryCoverageRange[]>([]);
    let restoredRanges = $state<PostHistoryCoverageRange[]>([]);
    let localBrowsingRanges = $state<PostHistoryCoverageRange[]>([]);
    let localBrowsingRevision: number | null = null;
    let observedLocalRevision: number | null = null;
    let localSessionGeneration = $state(postHistoryLocalRelayService.getSessionGeneration());
    const externalContinuity = $derived(getPostHistoryBrowsingContinuity(quorumCoverage, restoredRanges));
    const browsingContinuity = $derived(getPostHistoryBrowsingContinuity(quorumCoverage, restoredRanges, localBrowsingRanges));
    let openRefreshRequestId: number | null = null;
    let openRefreshSince: number | undefined;
    let activeCoverageRelayKey = getPostHistoryAuthoredRelayScopeKey(getRelayConfig());
    let activeCoverageOwner = getPubkeyHex();
    let activeCoverageRuntime = getRxNostr();
    let coverageGeneration = 0;
    let isDestroyed = false;
    let loadRequestId = 0;
    let hasCompletedFirstPostPaint = false;
    let mediaPrefetchReady = $state(false);
    let firstPaintPubkeyKey = $state<string | null>(null);
    let lastPrefetchedMediaUrlsKey: string | null = null;
    let totalCountRequestId = 0;
    let currentTotalCountRequest:
        | { requestId: number; pubkeyHex: string; promise: Promise<void> }
        | null = null;
    let searchLoadRequestId = 0;
    let isSearchPageLoading = $state(false);
    let searchResultStatus = $state<PostHistoryLocalLoadStatus>("idle");
    let hasStartedInitialSync = false;
    let forceDialogOpenRefreshAfterLocalPost = false;
    let hasAttemptedInitialLocalLoad = false;
    let initialLocalLoadKey: string | null = null;
    let initialLocalLoadStatus = $state<PostHistoryLocalLoadStatus>("idle");
    let initialLocalLoadGeneration = 0;
    let activePubkeyKey = resolveListingSnapshotKey(getPubkeyHex());
    let stateOwnerPubkeyKey = $state<string | null>(activePubkeyKey);
    let forceLatestInitialLoadKey: string | null = null;
    let currentFetchTask: PostHistoryRelayFetchTask | PostHistoryLightweightAuthoredSyncTask | null = null;
    let currentLocalFetchTask: LocalRelayTask<LocalRelayHistoryReadResult> | null = null;
    let localFetchGeneration = 0;
    // Resume hint only; session-local localHasMore supplies the continuation guard.
    let localNextUntil = $state<number | null>(null);
    let localHasMore = $state(true);
    let localReadBusy = $state(false);
    let previousLocalRelayUrl = settingsStore.localRelayUrl;
    let previousLocalRelayRuntime = getRxNostr();
    let previousLocalRelaySession = postHistoryLocalRelayService.getSessionGeneration();
    let externalReadBusy = $state(false);
    let externalOperation = 0;
    let viewportCommitChain = Promise.resolve();
    let foregroundFeedback: {
        pending: number; succeeded: boolean; changed: boolean;
        resolve(changed: boolean): void; promise: Promise<boolean>;
    } | null = null;
    let fetchRequestId = 0;
    let currentViewRefetchTask: PostHistoryCurrentViewRefetchTask | null = null;
    let contiguousProgress: ContiguousProgressSnapshot | null = null;
    let currentViewRefetchMessageClearTimeout: ReturnType<typeof setTimeout> | null = null;
    let syncStatusMessageClearTimeout: ReturnType<typeof setTimeout> | null = null;
    let activeOlderRevealChildInteractionRepairRxNostr = getRxNostr();
    let appliedSearchQuery = restoredSearchState
        ? persistedViewState.searchQuery
        : "";
    let searchResultsInitialized = !restoredSearchState;
    const olderBackfillSearch = $state<OlderBackfillSearchState>({
        windowSeconds: POST_HISTORY_OLDER_BACKFILL_INITIAL_WINDOW_SECONDS,
        nextUntil: null,
        consecutiveEmptyCount: 0,
        lastRange: null,
        continuationSince: null,
        exhausted: false,
    });
    const maxVisiblePosts = Math.max(pageSize * 3, pageSize);
    const relationRepairCoordinator =
        createPostHistoryVisibleRangeRelationRepairCoordinator({
            getShow,
            getPubkeyHex,
            getRxNostr,
            getRelayConfig,
            getLoadedPosts: () => state.loadedPosts,
            onChildInteractionBadgeRefreshRequested,
            onQuoteVisibleRangeRefreshRequested,
            quoteVisibleRangeRepairExecutor,
        });

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
        !isRefetchingAroundCurrentView
        && !isSearchPageLoading
        && isSearchMode
        && state.searchHasNext,
    );
    const canGoLast = $derived(canGoNext);
    const showPaging = $derived(false);
    const canLoadOlder = $derived(
        !isRefetchingAroundCurrentView
        && (isSearchMode
            ? !isSearchPageLoading && state.searchHasNext
            : state.hasOlderLocal),
    );
    const canLoadNewer = $derived(
        !isRefetchingAroundCurrentView && !isSearchMode && state.hasNewerLocal,
    );
    const canReturnToLatest = $derived(
        !isSearchMode
        && !isRefetchingAroundCurrentView
        && (state.listingMode === "sparse" || state.hasNewerLocal),
    );
    const visibleNewestCreatedAt = $derived(posts[0]?.createdAt ?? null);
    const visibleOldestCreatedAt = $derived(
        posts.length > 0 ? posts[posts.length - 1]?.createdAt ?? null : null,
    );
    const canJumpToOldest = $derived(
        !isSearchMode
        && !isRefetchingAroundCurrentView
        && state.hasOlderLocal
        && (
            state.listingMode === "sparse"
            || !(
                typeof visibleOldestCreatedAt === "number"
                && (
                    state.visibleUntil === null
                        ? state.hasJumpCacheAnchors
                        : visibleOldestCreatedAt < state.visibleUntil
                )
            )
        ),
    );
    const canFetchOlderFromRelays = $derived(
        !isSearchMode &&
        !!getPubkeyHex() &&
        !isRefetchingAroundCurrentView &&
        (foregroundFeedback !== null || (state.syncStatus !== "syncing" && state.syncStatus !== "older-syncing")) &&
        ((!!getRxNostr() && !externalReadBusy && !olderBackfillSearch.exhausted)
            || (!!settingsStore.localRelayUrl && localSessionGeneration === postHistoryLocalRelayService.getSessionGeneration() && !localReadBusy && localHasMore
                && postHistoryLocalRelayService.isConfigured(getPubkeyHex()))),
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
        state.listingMode === "contiguous" &&
        state.loadedPosts.length > 0 &&
        !state.hasOlderLocal &&
        state.syncStatus !== "syncing",
    );
    const showSavedPostsBoundary = $derived(
        !isSearchMode
        && state.syncStatus !== "syncing"
        && state.listingMode === "contiguous"
        && typeof state.visibleUntil === "number"
        && state.loadedPosts.length > 0
        && !state.hasOlderLocal
        && state.hasSavedPostsOutsideVisibleRange,
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
        foregroundFeedback?.resolve(false);
        foregroundFeedback = null;
        externalOperation += 1;
        externalReadBusy = false;
        localReadBusy = false;
        localFetchGeneration += 1;
        currentLocalFetchTask?.cancel();
        currentLocalFetchTask = null;
        openRefreshRequestId = null;
        openRefreshSince = undefined;
        fetchRequestId += 1;
        currentFetchTask?.cancel();
        currentFetchTask = null;
        if (state.syncStatus === "older-syncing") state.syncStatus = "idle";
    }

    function beginHistoryFeedback(loading: "syncing" | "older-syncing", peers: number) {
        foregroundFeedback?.resolve(false);
        let resolve!: (changed: boolean) => void;
        const promise = new Promise<boolean>((done) => { resolve = done; });
        const feedback = { pending: peers, succeeded: false, changed: false, resolve, promise };
        foregroundFeedback = feedback;
        state.syncStatus = loading;
        return feedback;
    }

    function finishHistoryPeer(feedback: NonNullable<typeof foregroundFeedback>, success: boolean, changed: boolean): void {
        feedback.pending -= 1;
        feedback.succeeded ||= success;
        feedback.changed ||= success && changed;
        if (success || feedback.pending === 0) feedback.resolve(feedback.changed);
        if (foregroundFeedback !== feedback || isDestroyed || !getShow()) return;
        if (feedback.succeeded) state.syncStatus = feedback.changed ? "synced" : "idle";
        else if (feedback.pending === 0) state.syncStatus = "failed";
        scheduleSyncStatusMessageClearIfNeeded();
    }

    function commitHistoryViewport(apply: () => Promise<void>): Promise<void> {
        const commit = viewportCommitChain.then(apply);
        viewportCommitChain = commit.catch(() => undefined);
        return commit;
    }

    function resetLocalContinuity(): void {
        localFetchGeneration += 1;
        currentLocalFetchTask?.cancel();
        currentLocalFetchTask = null;
        localReadBusy = false;
        localBrowsingRanges = [];
        localBrowsingRevision = null;
        localNextUntil = null;
        localHasMore = true;
        clearContiguousProgress();
    }

    function startLocalHistoryRead(
        reason: "bootstrap" | "dialog-open-refresh" | "older-backfill" | "repair-visible-range",
        bounds: { since?: number; until?: number } = {},
        options: FetchOlderFromRelaysOptions = {},
    ): LocalRelayTask<LocalRelayHistoryReadResult> | null {
        const owner = getPubkeyHex();
        if (isDestroyed || !getShow() || !owner || !postHistoryLocalRelayService.isConfigured(owner)) return null;
        if (currentLocalFetchTask) return currentLocalFetchTask;
        if (reason === "older-backfill" && !localHasMore) return null;
        const generation = ++localFetchGeneration;
        const runtime = getRxNostr();
        const url = settingsStore.localRelayUrl;
        const sessionGeneration = postHistoryLocalRelayService.getSessionGeneration();
        const previousNextUntil = localNextUntil;
        const isActive = () => !isDestroyed && getShow() && getPubkeyHex() === owner
            && getRxNostr() === runtime && generation === localFetchGeneration
            && settingsStore.localRelayUrl === url && postHistoryLocalRelayService.getSessionGeneration() === sessionGeneration;
        // After a clear/session reset, a manual read starts at the latest page.
        const task = postHistoryLocalRelayService.read({ pubkeyHex: owner, reason,
            ...(reason === "older-backfill" && previousNextUntil === null ? {} : bounds),
            limit: reason === "dialog-open-refresh" ? POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT
                : reason === "repair-visible-range" ? POST_HISTORY_REPAIR_FETCH_LIMIT : POST_HISTORY_OLDER_FETCH_LIMIT,
            targets: state.loadedPosts.flatMap((post) => isSignedNostrEvent(post.rawEvent) ? [post.rawEvent] : []), isActive });
        localReadBusy = true;
        const committedTask: LocalRelayTask<LocalRelayHistoryReadResult> = { cancel: task.cancel, promise: task.promise.then(async (result) => {
            if (!result || !isActive() || result.sessionGeneration !== sessionGeneration) return null;
            if (await postHistoryRelayCoverageRepository.getLocalRevision(owner) !== result.localRevision || !isActive()) return null;
            // This query's meta write can seed a hint before its result arrives.
            // Decide head continuation from the cursor captured at request start.
            if (reason !== "repair-visible-range" && (reason !== "dialog-open-refresh" || previousNextUntil === null)) {
                localHasMore = result.hasMore && (reason !== "older-backfill"
                    || previousNextUntil === null || (result.nextUntil !== null && result.nextUntil < previousNextUntil));
                // A durable hint may have been restored while this head read was in flight.
                // Keep the oldest resume bound rather than overwriting it with the head cursor.
                if (result.nextUntil !== null) localNextUntil = Math.min(localNextUntil ?? result.nextUntil, result.nextUntil);
            }
            let browsingChanged = false;
            await commitHistoryViewport(() => isActive() ? onLocalHistoryChanged(async () => {
                if (!isActive()) return;
                if (await postHistoryRelayCoverageRepository.getLocalRevision(owner) !== result.localRevision || !isActive()) return;
                localBrowsingRevision = result.localRevision;
                const merged = getPostHistoryBrowsingContinuity(localBrowsingRanges, result.browsingRanges);
                browsingChanged = JSON.stringify(merged) !== JSON.stringify(localBrowsingRanges);
                localBrowsingRanges = merged;
                clearContiguousProgress();
                if (coverageAnchorCreatedAt === null) {
                    const entry = await postHistoryRepository.getLatestVisibleChunk({ pubkeyHex: owner, visibleUntil: null, limit: pageSize });
                    if (!isActive()) return;
                    coverageAnchorCreatedAt = entry.at(-1)?.createdAt ?? null;
                }
                await refreshVisibleUntil(owner);
                if (!isActive()) return;
                if (reason === "older-backfill" && state.loadedPosts.length) {
                    await loadOlderVisiblePosts({ anchorEventId: options.anchorEventId,
                        relayFetchViewportCommit: options.viewportCommit, useContiguousProgress: false });
                } else if (!state.loadedPosts.length || (state.loadedPosts.length <= pageSize
                    && !state.hasNewerLocal && state.sparseSource === null)) {
                    await loadLatestVisiblePosts({ forceTotalCount: true });
                } else {
                    const records = await Promise.all(state.loadedPosts.map((post) => postHistoryRepository.getByEventId(post.eventId)));
                    if (!isActive()) return;
                    state.loadedPosts = records.flatMap((record) => record?.pubkeyHex === owner ? [record] : []);
                }
                if (!isActive()) return;
                refreshTotalCountFromRepository({ force: true });
                await refreshTimelineAvailability(owner);
                if (!isActive()) return;
                await refreshSavedPostsOutsideVisibleRange(owner, state.visibleUntil);
            }) : Promise.resolve());
            if (!isActive() || await postHistoryRelayCoverageRepository.getLocalRevision(owner) !== result.localRevision) return null;
            if (isActive() && result.eventIds.length) await onSavedAuthoredPosts(result.eventIds);
            return { ...result, changed: result.changed || browsingChanged };
        }).catch(() => null).finally(() => {
            if (currentLocalFetchTask === committedTask) { currentLocalFetchTask = null; localReadBusy = false; }
        }) };
        currentLocalFetchTask = committedTask;
        return committedTask;
    }

    function clearContiguousProgress(): void {
        contiguousProgress = null;
    }

    function sameTimelineCursor(
        left: PostHistoryTimelineCursor | null | undefined,
        right: PostHistoryTimelineCursor | null | undefined,
    ): boolean {
        return !!left && !!right
            && left.postedAt === right.postedAt
            && left.createdAt === right.createdAt
            && left.eventId === right.eventId;
    }

    function isCurrentFetchRequest(requestId: number): boolean {
        return requestId === fetchRequestId;
    }

    function isCurrentPostHistoryLoad(
        pubkeyHex: string,
        requestId: number,
    ): boolean {
        return getShow()
            && getPubkeyHex() === pubkeyHex
            && requestId === loadRequestId;
    }

    function resetFirstPostPaintState(): void {
        hasCompletedFirstPostPaint = false;
        mediaPrefetchReady = false;
        firstPaintPubkeyKey = null;
        lastPrefetchedMediaUrlsKey = null;
    }

    async function waitForFirstPostPaint(
        pubkeyHex: string,
        isCurrent: () => boolean,
        hasPosts: () => boolean,
    ): Promise<boolean> {
        await tick();
        if (!isCurrent()) {
            return false;
        }

        if (hasCompletedFirstPostPaint) {
            firstPaintPubkeyKey = resolveListingSnapshotKey(pubkeyHex);
            return true;
        }

        if (!hasPosts()) {
            hasCompletedFirstPostPaint = true;
            firstPaintPubkeyKey = resolveListingSnapshotKey(pubkeyHex);
            mediaPrefetchReady = true;
            return true;
        }

        await new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
        if (!isCurrent()) {
            return false;
        }

        hasCompletedFirstPostPaint = true;
        firstPaintPubkeyKey = resolveListingSnapshotKey(pubkeyHex);
        mediaPrefetchReady = true;
        return true;
    }

    function cancelCurrentViewRefetch(): void {
        currentViewRefetchTask?.cancel();
        currentViewRefetchTask = null;
        relationRepairCoordinator.cancelCurrentViewRepair();
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
            "postHistory.repairChildInteractionsAdded",
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
        searchLoadRequestId += 1;
        isSearchPageLoading = false;
        searchResultStatus = "idle";
        postHistoryLocalSearchService.clearCache?.();
        resetFirstPostPaintState();
        state.searchInput = "";
        state.searchQuery = "";
        state.searchPage = 1;
        state.searchPosts = [];
        state.searchTotalCount = 0;
        state.searchTotalCountKnown = false;
        state.searchHasNext = false;
        appliedSearchQuery = "";
        persistCurrentViewState();
        persistCurrentListingSnapshot();
    }

    function clearCurrentListingState(): void {
        clearContiguousProgress();
        invalidateTotalCountRequest();
        state.loadedPosts = [];
        setTotalCountState({ known: false, status: "unknown" });
        state.currentPage = 1;
        state.syncStatus = "idle";
        state.hasMoreRemote = false;
        state.nextUntil = null;
        state.lastDialogOpenRefreshAt = null;
        state.visibleUntil = null;
        coverageAnchorCreatedAt = null;
        quorumCoverage = [];
        restoredRanges = [];
        state.hasJumpCacheAnchors = false;
        state.hasOlderLocal = false;
        state.hasNewerLocal = false;
        state.listingMode = "contiguous";
        state.sparseSource = null;
        state.hasSavedPostsOutsideVisibleRange = false;
        state.latestOlderBackfillUiResult = null;
        resetSearchState();
    }

    function canPersistStateForCurrentPubkey(): boolean {
        const currentPubkeyKey = resolveListingSnapshotKey(getPubkeyHex());
        return !!currentPubkeyKey && currentPubkeyKey === stateOwnerPubkeyKey;
    }

    function persistCurrentViewState(): void {
        if (!canPersistStateForCurrentPubkey()) {
            return;
        }

        writePersistedPostHistoryViewState(getPubkeyHex(), {
            searchInput: state.searchInput,
            searchQuery: state.searchQuery,
            currentPage: state.currentPage,
            searchPage: state.searchPage,
        });
    }

    function persistCurrentListingSnapshot(): void {
        if (!canPersistStateForCurrentPubkey()) {
            return;
        }

        writePersistedListingSnapshot(getPubkeyHex(), {
            loadedPosts: state.loadedPosts,
            searchPosts: state.searchPosts,
            searchQuery: state.searchQuery,
            totalCount: state.totalCount,
            totalCountKnown: state.totalCountKnown,
            totalCountFailed: state.totalCountStatus === "failed",
            searchTotalCount: state.searchTotalCount,
            searchTotalCountKnown: state.searchTotalCountKnown,
            searchHasNext: state.searchHasNext,
            hasMoreRemote: state.hasMoreRemote,
            nextUntil: state.nextUntil,
            lastDialogOpenRefreshAt: state.lastDialogOpenRefreshAt,
            visibleUntil: state.visibleUntil,
            coverageAnchorCreatedAt,
            hasJumpCacheAnchors: state.hasJumpCacheAnchors,
            hasOlderLocal: state.hasOlderLocal,
            hasNewerLocal: state.hasNewerLocal,
        });
    }

    function markStateOwner(pubkeyHex: string | null | undefined): void {
        stateOwnerPubkeyKey = resolveListingSnapshotKey(pubkeyHex);
    }

    function resetListingStateAfterLocalDelete(): void {
        resetLocalContinuity();
        coverageAnchorCreatedAt = null;
        quorumCoverage = [];
        restoredRanges = [];
        clearContiguousProgress();
        invalidateTotalCountRequest();
        relationRepairCoordinator.resetOlderRevealRepairContext();
        state.loadedPosts = [];
        state.searchPosts = [];
        setTotalCountState({ count: 0, known: true, status: "ready" });
        state.searchTotalCount = 0;
        state.searchTotalCountKnown = false;
        state.searchHasNext = false;
        state.currentPage = 1;
        state.searchPage = 1;
        state.hasMoreRemote = false;
        state.nextUntil = null;
        state.lastDialogOpenRefreshAt = null;
        state.visibleUntil = null;
        state.hasJumpCacheAnchors = false;
        state.hasOlderLocal = false;
        state.hasNewerLocal = false;
        state.listingMode = "contiguous";
        state.sparseSource = null;
        state.hasSavedPostsOutsideVisibleRange = false;
        state.syncStatus = "idle";
        resetOlderBackfillSearchState();
        clearCurrentViewRefetchFeedback();
        clearSyncStatusMessageClearTimeout();
        resetSearchState();
        hasStartedInitialSync = true;
    }

    function isSparseListingRestoreStateActive(): boolean {
        return state.listingMode === "sparse"
            && (state.sparseSource === "saved" || state.sparseSource === "jump");
    }

    function discardSparseListingRestoreState(): boolean {
        if (!isSparseListingRestoreStateActive()) {
            return false;
        }

        const pubkeyHex = getPubkeyHex();

        clearCurrentListingState();
        resetOlderBackfillSearchState();
        clearCurrentViewRefetchFeedback();
        clearSyncStatusMessageClearTimeout();

        clearPersistedPostHistoryViewStateForPubkey(pubkeyHex);
        writePersistedListingSnapshot(pubkeyHex, {
            ...DEFAULT_PERSISTED_POST_HISTORY_LISTING_SNAPSHOT,
        });

        return true;
    }

    function invalidatePendingLoadRequests(): void {
        clearContiguousProgress();
        loadRequestId += 1;
        searchLoadRequestId += 1;
        isSearchPageLoading = false;
        searchResultStatus = "idle";
    }

    function suspend(): void {
        coverageGeneration++;
        cancelCurrentSync();
        cancelCurrentViewRefetch();
        invalidatePendingLoadRequests();
        invalidateTotalCountRequest();
        initialLocalLoadGeneration++;
        if (initialLocalLoadStatus === "loading") {
            initialLocalLoadStatus = "idle";
            hasAttemptedInitialLocalLoad = false;
        }
        state.syncStatus = "idle";
        clearCurrentViewRefetchFeedback();
        clearSyncStatusMessageClearTimeout();
        relationRepairCoordinator.resetOlderRevealRepairContext();
    }
    function prepareForClose(): boolean {
        resetLocalContinuity();
        coverageGeneration += 1;
        const shouldClearAllSessionScrollState = discardSparseListingRestoreState();
        cancelCurrentSync();
        cancelCurrentViewRefetch();
        invalidatePendingLoadRequests();
        invalidateTotalCountRequest();
        postHistoryLocalSearchService.clearCache?.();
        relationRepairCoordinator.resetOlderRevealRepairContext();
        return shouldClearAllSessionScrollState;
    }

    function resetState(): void {
        resetLocalContinuity();
        coverageGeneration += 1;
        discardSparseListingRestoreState();
        cancelCurrentSync();
        cancelCurrentViewRefetch();
        invalidatePendingLoadRequests();
        invalidateTotalCountRequest();
        postHistoryLocalSearchService.clearCache?.();
        relationRepairCoordinator.resetOlderRevealRepairContext();
        state.syncStatus = "idle";
        resetOlderBackfillSearchState();
        clearCurrentViewRefetchFeedback();
        clearSyncStatusMessageClearTimeout();
        hasStartedInitialSync = false;
        forceDialogOpenRefreshAfterLocalPost = false;
        hasAttemptedInitialLocalLoad = false;
        initialLocalLoadKey = null;
        initialLocalLoadGeneration += 1;
        initialLocalLoadStatus = "idle";
        searchResultsInitialized = false;
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
        planningFloor = state.visibleUntil,
    ): Promise<number | null> {
        if (
            (!localBrowsingRanges.length || isSparseListingContext(state.visibleUntil))
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

    async function readContinuityRecords(pubkeyHex: string) {
        // One snapshot also keeps every source observable by liveQuery.
        const url = getLocalBrowsingUrl();
        return ehagakiDb.transaction("r", postHistoryContinuityTables(ehagakiDb), async () => {
            const revision = await getPostHistoryLocalRevision(ehagakiDb, pubkeyHex);
            const coverage = await postHistoryRelayCoverageRepository.get(pubkeyHex, POST_HISTORY_VISIBLE_KINDS_KEY);
            const restored = await postHistoryImportedRangesRepository.get(pubkeyHex, POST_HISTORY_VISIBLE_KINDS_KEY);
            const local = url ? await postHistoryLocalBrowsingRangesRepository.get(pubkeyHex, POST_HISTORY_VISIBLE_KINDS_KEY, url) : null;
            return [coverage, restored, revision, local, url] as const;
        });
    }

    function getLocalBrowsingUrl(): string | null {
        return getAppRuntimeEnvironment().runtimeKind === "standalone"
            ? normalizeLocalRelayUrl(settingsStore.localRelayUrl ?? "") : null;
    }

    function restoreLocalBrowsingRecord(record: PostHistoryLocalBrowsingRanges | null): void {
        if (!record || record.localRelayUrl !== getLocalBrowsingUrl() || record.localRevision !== observedLocalRevision) return;
        // A liveQuery callback can finish its revision read after a newer page
        // commits. Evidence only grows within this URL/revision; an older
        // snapshot must not retract continuity already adopted by the listing.
        localBrowsingRanges = getPostHistoryBrowsingContinuity(
            localBrowsingRevision === record.localRevision ? localBrowsingRanges : [],
            record.browsingRanges,
        );
        localBrowsingRevision = record.localRevision;
        // Never restore a hasMore/exhausted decision. A new session can recheck the relay.
        if (record.resumeHint) localNextUntil = localNextUntil === null ? record.resumeHint.nextUntil
            : Math.min(localNextUntil, record.resumeHint.nextUntil);
    }

    async function readExternalContinuity(pubkeyHex: string): Promise<PostHistoryCoverageRange[]> {
        if (isDestroyed) return [];
        const generation = coverageGeneration;
        const relays = resolvePostHistoryAuthoredRelayUrls(getRelayConfig());
        const [record, restored, beforeRevision, local, url] = await readContinuityRecords(pubkeyHex);
        const ranges = getPostHistoryQuorumCoverage(record.relays, relays);
        const revision = await postHistoryRelayCoverageRepository.getLocalRevision(pubkeyHex);
        if (revision !== beforeRevision || revision !== restored.localRevision) return [];
        if (isDestroyed || generation !== coverageGeneration || !getShow() || getPubkeyHex() !== pubkeyHex) return [];
        quorumCoverage = ranges;
        restoredRanges = restored.ranges;
        if (observedLocalRevision !== null && observedLocalRevision !== revision) resetLocalContinuity();
        observedLocalRevision = revision;
        if (url === getLocalBrowsingUrl()) restoreLocalBrowsingRecord(local);
        return getPostHistoryBrowsingContinuity(ranges, restored.ranges);
    }

    async function readBrowsingContinuity(pubkeyHex: string): Promise<PostHistoryCoverageRange[]> {
        const external = await readExternalContinuity(pubkeyHex);
        const local = localBrowsingRevision === observedLocalRevision
            && getLocalBrowsingUrl() ? localBrowsingRanges : [];
        return getPostHistoryBrowsingContinuity(external, local);
    }

    async function readExternalVisibleUntil(pubkeyHex: string): Promise<number | null> {
        if (coverageAnchorCreatedAt === null) return readVisibleUntil(pubkeyHex);
        return getPostHistoryConnectedCoverageUntil(await readExternalContinuity(pubkeyHex), coverageAnchorCreatedAt);
    }

    async function readCertifiedVisibleUntil(pubkeyHex: string): Promise<number | null> {
        return (await postHistoryVisibleRangeRepository.get(pubkeyHex, POST_HISTORY_VISIBLE_KINDS_KEY))?.visibleUntil ?? null;
    }

    async function readVisibleUntil(pubkeyHex: string): Promise<number | null> {
        if (coverageAnchorCreatedAt === null) {
            // Legacy state may limit the entry window, but never certifies its continuation.
            return readCertifiedVisibleUntil(pubkeyHex);
        }
        const anchor = coverageAnchorCreatedAt;
        return getPostHistoryConnectedCoverageUntil(await readBrowsingContinuity(pubkeyHex), anchor);
    }

    async function resolveVisibleUntilForSavedOlderPosts(
        pubkeyHex: string,
    ): Promise<number | null> {
        const headCreatedAt = state.loadedPosts[0]?.createdAt;
        if (typeof headCreatedAt === "number") {
            const coveredSince = mergePostHistoryCoverageRanges(await readExternalContinuity(pubkeyHex))
                .find((range) => range.since <= headCreatedAt && range.until >= headCreatedAt)
                ?.since;
            if (typeof coveredSince === "number") return coveredSince;
        }

        if (
            contiguousProgress?.pubkeyHex === pubkeyHex
            && typeof contiguousProgress.visibleUntil === "number"
        ) {
            return contiguousProgress.visibleUntil;
        }

        return refreshVisibleUntil(pubkeyHex);
    }

    async function createAuthoredScope(pubkeyHex: string, rxNostr: RxNostr, requestId: number, kinds = [...POST_HISTORY_FETCH_KINDS] as number[]) {
        const relayConfig = getRelayConfig();
        const generation = coverageGeneration;
        return createPostHistoryAuthoredFetchScope({ ownerPubkeyHex: pubkeyHex, rxNostr, kinds, relayConfig,
            getRelayConfig, isActive: () => generation === coverageGeneration && isCurrentFetchRequest(requestId)
                && getShow() && getPubkeyHex() === pubkeyHex && getRxNostr() === rxNostr });
    }

    async function refreshVisibleUntil(
        pubkeyHex: string,
        expectedRequestId: number | null = null,
    ): Promise<number | null> {
        const generation = coverageGeneration;
        const visibleUntil = await readVisibleUntil(pubkeyHex);

        if (
            !isDestroyed && generation === coverageGeneration && getShow()
            && getPubkeyHex() === pubkeyHex
            && (expectedRequestId === null || expectedRequestId === loadRequestId)
        ) {
            state.visibleUntil = visibleUntil;
        }

        return visibleUntil;
    }

    async function refreshJumpCacheAnchorAvailability(
        pubkeyHex: string,
        expectedRequestId: number | null = null,
    ): Promise<boolean> {
        const anchors = await postHistoryJumpCacheAnchorRepository.getForPubkey(
            pubkeyHex,
            {
                maxCount: 1,
            },
        );
        const hasJumpCacheAnchors = anchors.length > 0;

        if (
            getShow()
            && getPubkeyHex() === pubkeyHex
            && (expectedRequestId === null || expectedRequestId === loadRequestId)
        ) {
            state.hasJumpCacheAnchors = hasJumpCacheAnchors;
        }

        return hasJumpCacheAnchors;
    }

    async function updateVisibleUntilFromFetch(pubkeyHex: string, _result: PostHistoryRelayFetchResult): Promise<number | null> {
        const generation = coverageGeneration;
        const requestId = fetchRequestId;
        const isCurrent = () => !isDestroyed && generation === coverageGeneration && requestId === fetchRequestId
            && getShow() && getPubkeyHex() === pubkeyHex;
        if (coverageAnchorCreatedAt === null) {
            const entryPosts = await postHistoryRepository.getLatestVisibleChunk({ pubkeyHex, visibleUntil: null, limit: pageSize });
            if (!isCurrent()) return null;
            coverageAnchorCreatedAt = entryPosts.length ? Math.min(...entryPosts.map((post) => post.createdAt)) : null;
        }
        const next = await readVisibleUntil(pubkeyHex);
        if (isCurrent()) state.visibleUntil = next;
        return next;
    }

    async function updateVisibleUntilFromOlderBackfillFetch(pubkeyHex: string, result: PostHistoryRelayFetchResult) {
        return updateVisibleUntilFromFetch(pubkeyHex, result);
    }

    async function maybeExtendVisibleUntilFromCurrentViewRefetchResult(
        pubkeyHex: string, _previousVisibleUntil: number | null,
        _processedRanges: Array<{ source: string; status: string; since?: number; until?: number }>,
    ): Promise<number | null> {
        const generation = coverageGeneration;
        const task = currentViewRefetchTask;
        const next = await readVisibleUntil(pubkeyHex);
        if (!isDestroyed && generation === coverageGeneration && task === currentViewRefetchTask
            && getShow() && getPubkeyHex() === pubkeyHex) state.visibleUntil = next;
        return next;
    }

    async function countVisiblePosts(
        pubkeyHex: string,
        visibleUntil: number | null,
    ): Promise<number> {
        return typeof visibleUntil === "number"
            ? postHistoryRepository.countVisibleForPubkey(pubkeyHex, visibleUntil)
            : postHistoryRepository.countForPubkey(pubkeyHex);
    }

    async function countVisiblePostsForProgress(
        pubkeyHex: string,
        visibleUntil: number | null,
    ): Promise<number> {
        if (typeof visibleUntil === "number") {
            return postHistoryRepository.countVisibleForPubkey(
                pubkeyHex,
                visibleUntil,
            );
        }

        const pendingTotalCount = currentTotalCountRequest;
        if (pendingTotalCount?.pubkeyHex === pubkeyHex) {
            await pendingTotalCount.promise;
            if (state.totalCountKnown) {
                return state.totalCount;
            }
        }

        if (state.totalCountKnown) {
            return state.totalCount;
        }

        return postHistoryRepository.countForPubkey(pubkeyHex);
    }

    function isContiguousProgressShapeValid(
        pubkeyHex: string,
        snapshot: ContiguousProgressSnapshot,
    ): boolean {
        if (
            isSearchMode
            || state.listingMode !== "contiguous"
            || state.sparseSource !== null
            || getPubkeyHex() !== pubkeyHex
            || state.visibleUntil !== snapshot.visibleUntil
        ) {
            return false;
        }

        const oldestCursor = toTimelineCursor(
            state.loadedPosts[state.loadedPosts.length - 1],
        );
        return sameTimelineCursor(oldestCursor, snapshot.oldestCursor);
    }

    async function validateContiguousProgress(
        pubkeyHex: string,
        expectedRequestId: number,
    ): Promise<ContiguousProgressSnapshot | null> {
        const snapshot = contiguousProgress;
        if (!snapshot || snapshot.pubkeyHex !== pubkeyHex) {
            return null;
        }

        const visibleUntil = await refreshVisibleUntil(
            pubkeyHex,
            expectedRequestId,
        );
        if (
            !getShow()
            || getPubkeyHex() !== pubkeyHex
            || expectedRequestId !== loadRequestId
            || !isContiguousProgressShapeValid(pubkeyHex, snapshot)
        ) {
            return null;
        }

        const [revision, totalVisibleCount] = await Promise.all([
            Promise.resolve(getPostHistorySearchRevision(pubkeyHex)),
            countVisiblePostsForProgress(pubkeyHex, visibleUntil),
        ]);
        if (
            !isContiguousProgressShapeValid(pubkeyHex, snapshot)
            || revision !== snapshot.revision
            || totalVisibleCount !== snapshot.totalVisibleCount
        ) {
            return null;
        }

        return snapshot;
    }

    async function establishContiguousProgress(
        pubkeyHex: string,
        requestId: number,
        latestPosts: PostHistoryRecord[],
        visibleUntil: number | null,
        revisionBeforeQuery: number,
    ): Promise<boolean> {
        clearContiguousProgress();
        if (
            latestPosts.length === 0
            || !getShow()
            || getPubkeyHex() !== pubkeyHex
            || requestId !== loadRequestId
            || state.listingMode !== "contiguous"
            || state.sparseSource !== null
        ) {
            return false;
        }

        const totalVisibleCount = await countVisiblePostsForProgress(
            pubkeyHex,
            visibleUntil,
        );
        // The snapshot retains the display floor; every use validates against
        // fresh persisted coverage before querying an older page.
        const currentVisibleUntil = state.visibleUntil;
        const revisionAfterQuery = getPostHistorySearchRevision(pubkeyHex);
        if (
            revisionAfterQuery !== revisionBeforeQuery
            || currentVisibleUntil !== visibleUntil
            || !getShow()
            || getPubkeyHex() !== pubkeyHex
            || requestId !== loadRequestId
            || state.listingMode !== "contiguous"
            || state.sparseSource !== null
            || state.loadedPosts[0]?.eventId !== latestPosts[0]?.eventId
            || state.loadedPosts[state.loadedPosts.length - 1]?.eventId !==
                latestPosts[latestPosts.length - 1]?.eventId
        ) {
            return false;
        }

        const oldestCursor = toTimelineCursor(
            latestPosts[latestPosts.length - 1],
        );
        if (!oldestCursor) {
            return false;
        }

        contiguousProgress = {
            pubkeyHex,
            visibleUntil,
            revision: revisionAfterQuery,
            totalVisibleCount,
            reachedVisibleCount: latestPosts.length,
            oldestCursor,
            latestEventId: latestPosts[0]?.eventId ?? null,
        };
        return true;
    }

    async function reconcileContiguousProgressAfterDatabaseChange(
        pubkeyHex: string,
        visibleUntil: number | null,
        options: { preserveReachedVisibleCount: boolean },
    ): Promise<boolean> {
        const snapshot = contiguousProgress;
        if (
            !snapshot
            || snapshot.pubkeyHex !== pubkeyHex
            || isSearchMode
            || state.listingMode !== "contiguous"
            || state.sparseSource !== null
            || getPubkeyHex() !== pubkeyHex
        ) {
            return false;
        }

        // Only the older relay backfill path can prove that new visible
        // records are strictly older than the current cursor. Other DB
        // changes may add or reorder records above the cursor and must rebase.
        if (!options.preserveReachedVisibleCount) {
            return false;
        }

        const oldestCursor = toTimelineCursor(
            state.loadedPosts[state.loadedPosts.length - 1],
        );
        if (!sameTimelineCursor(oldestCursor, snapshot.oldestCursor)) {
            return false;
        }

        const totalVisibleCount = await countVisiblePostsForProgress(
            pubkeyHex,
            visibleUntil,
        );
        if (
            !getShow()
            || getPubkeyHex() !== pubkeyHex
            || !sameTimelineCursor(
                oldestCursor,
                toTimelineCursor(state.loadedPosts[state.loadedPosts.length - 1]),
            )
        ) {
            return false;
        }

        contiguousProgress = {
            ...snapshot,
            visibleUntil,
            revision: getPostHistorySearchRevision(pubkeyHex),
            totalVisibleCount,
        };
        return true;
    }

    async function rebaseContiguousProgress(): Promise<void> {
        clearContiguousProgress();
        await loadLatestVisiblePosts();
    }

    function isSparseListingContext(
        visibleUntil: number | null,
        currentPosts: PostHistoryRecord[] = state.loadedPosts,
    ): boolean {
        if (state.listingMode === "sparse") {
            return true;
        }

        if (state.hasJumpCacheAnchors) {
            return true;
        }

        const currentOldestCreatedAt =
            currentPosts.length > 0
                ? currentPosts[currentPosts.length - 1]?.createdAt ?? null
                : null;
        if (typeof currentOldestCreatedAt !== "number") {
            return false;
        }

        return visibleUntil === null
            ? state.hasJumpCacheAnchors
            : currentOldestCreatedAt < visibleUntil;
    }

    function setTotalCountState({
        count,
        known,
        status,
    }: {
        count?: number;
        known: boolean;
        status: PostHistoryTotalCountStatus;
    }): void {
        if (typeof count === "number") {
            state.totalCount = count;
        }
        state.totalCountKnown = known;
        state.totalCountStatus = status;
    }

    function invalidateTotalCountRequest(): void {
        totalCountRequestId += 1;
        currentTotalCountRequest = null;
        setTotalCountState({
            known: state.totalCountKnown,
            status: state.totalCountKnown ? "ready" : "unknown",
        });
    }

    function requestTotalCount(
        pubkeyHex: string,
        { force = false }: { force?: boolean } = {},
    ): void {
        if (!getShow() || getPubkeyHex() !== pubkeyHex) {
            return;
        }

        if (!force && currentTotalCountRequest?.pubkeyHex === pubkeyHex) {
            return;
        }

        const requestId = ++totalCountRequestId;
        setTotalCountState({
            known: state.totalCountKnown,
            status: state.totalCountKnown ? "refreshing" : "loading",
        });

        const promise = postHistoryRepository.countForPubkey(pubkeyHex)
            .then((count) => {
                if (
                    requestId !== totalCountRequestId
                    || !getShow()
                    || getPubkeyHex() !== pubkeyHex
                ) {
                    return;
                }

                setTotalCountState({
                    count,
                    known: true,
                    status: "ready",
                });
            })
            .catch(() => {
                if (
                    requestId !== totalCountRequestId
                    || !getShow()
                    || getPubkeyHex() !== pubkeyHex
                ) {
                    return;
                }

                setTotalCountState({
                    known: state.totalCountKnown,
                    status: "failed",
                });
            })
            .finally(() => {
                if (currentTotalCountRequest?.requestId === requestId) {
                    currentTotalCountRequest = null;
                }
            });

        currentTotalCountRequest = { requestId, pubkeyHex, promise };
    }

    function refreshTotalCountFromRepository(
        { force = false }: { force?: boolean } = {},
    ): void {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || !getShow()) {
            return;
        }

        requestTotalCount(pubkeyHex, { force });
    }

    async function refreshSavedPostsOutsideVisibleRange(
        pubkeyHex: string,
        visibleUntil: number | null,
        expectedRequestId: number | null = null,
        expectedFetchRequestId: number | null = null,
    ): Promise<void> {
        const hasSavedPostsOutsideVisibleRange = typeof visibleUntil === "number"
            ? await postHistoryRepository.hasPostsBeforeCreatedAt(
                pubkeyHex,
                visibleUntil,
            )
            : false;
        if (
            !getShow()
            || getPubkeyHex() !== pubkeyHex
            || (expectedRequestId !== null && expectedRequestId !== loadRequestId)
            || (
                expectedFetchRequestId !== null
                && !isCurrentFetchRequest(expectedFetchRequestId)
            )
        ) {
            return;
        }

        state.hasSavedPostsOutsideVisibleRange = hasSavedPostsOutsideVisibleRange;
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
        options: {
            skipOlderCheck?: boolean;
            deferDuringOlderRelayFetch?: boolean;
            retried?: boolean;
        } = {},
    ): Promise<void> {
        const generation = coverageGeneration;
        const syncRequestId = fetchRequestId;
        if (isDestroyed || !getShow()) {
            return;
        }
        if (options.deferDuringOlderRelayFetch && isFetchingOlderFromRelays) {
            return;
        }
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
        const newerPostsPromise = state.sparseSource === "saved" && typeof visibleUntil === "number"
            ? newestCursor
                ? postHistoryRepository.getSparseChunk({
                    pubkeyHex,
                    visibleUntil,
                    cursor: newestCursor,
                    direction: "newer",
                    limit: 1,
                })
                : Promise.resolve([])
            : newestCursor
                ? postHistoryRepository.getNewerVisibleChunk({
                    pubkeyHex,
                    visibleUntil,
                    cursor: newestCursor,
                    limit: 1,
                })
                : Promise.resolve([]);
        const olderPostsPromise = options.skipOlderCheck
            ? Promise.resolve([])
            : state.sparseSource === "saved" && typeof visibleUntil === "number"
                ? oldestCursor
                    ? postHistoryRepository.getSparseChunk({
                        pubkeyHex,
                        visibleUntil,
                        cursor: oldestCursor,
                        direction: "older",
                        limit: 1,
                    })
                    : Promise.resolve([])
                : state.sparseSource === "jump"
                    ? oldestCursor
                        ? postHistoryRepository.getOlderVisibleChunk({
                            pubkeyHex,
                            visibleUntil: null,
                            cursor: oldestCursor,
                            limit: 1,
                        })
                        : Promise.resolve([])
                : oldestCursor
                    ? postHistoryRepository.getOlderVisibleChunk({
                        pubkeyHex,
                        visibleUntil,
                        cursor: oldestCursor,
                        limit: 1,
                    })
                    : Promise.resolve([]);
        const [newerPosts, olderPosts] = await Promise.all([
            newerPostsPromise,
            olderPostsPromise,
        ]);

        const measuredNewestEventId = currentPosts[0]?.eventId ?? null;
        const measuredOldestEventId = currentPosts[currentPosts.length - 1]?.eventId ?? null;
        const shownPosts = state.loadedPosts;
        const showsMeasuredWindow = shownPosts.length === currentPosts.length
            && (shownPosts[0]?.eventId ?? null) === measuredNewestEventId
            && (shownPosts[shownPosts.length - 1]?.eventId ?? null) === measuredOldestEventId;
        if (!showsMeasuredWindow) {
            // The visible window may change while the IndexedDB availability
            // reads are in flight. Recheck the current window once so a stale
            // read cannot leave its navigation controls out of sync.
            if (
                options.retried
                || (expectedRequestId !== null && expectedRequestId !== loadRequestId)
            ) {
                return;
            }
            return refreshTimelineAvailability(pubkeyHex, shownPosts, expectedRequestId, {
                ...options,
                retried: true,
            });
        }

        if (visibleUntil !== state.visibleUntil) {
            if (options.retried || (expectedRequestId !== null && expectedRequestId !== loadRequestId)) {
                return;
            }
            return refreshTimelineAvailability(pubkeyHex, shownPosts, expectedRequestId, {
                ...options,
                retried: true,
            });
        }

        if (
            isDestroyed || generation !== coverageGeneration ||
            (options.deferDuringOlderRelayFetch
                && (isFetchingOlderFromRelays || syncRequestId !== fetchRequestId)) ||
            !getShow() ||
            getPubkeyHex() !== pubkeyHex ||
            (expectedRequestId !== null && expectedRequestId !== loadRequestId)
        ) {
            return;
        }

        state.hasNewerLocal = newerPosts.length > 0;
        if (!options.skipOlderCheck) {
            state.hasOlderLocal = olderPosts.length > 0;
        }
    }

    async function loadLatestVisiblePosts(
        {
            forceTotalCount = false,
            skipTotalCountRefresh = false,
            skipOlderAvailabilityCheck = false,
            awaitProgress = false,
            awaitAvailability = false,
        }: {
            forceTotalCount?: boolean;
            skipTotalCountRefresh?: boolean;
            skipOlderAvailabilityCheck?: boolean;
            awaitProgress?: boolean;
            awaitAvailability?: boolean;
        } = {},
    ): Promise<void> {
        clearContiguousProgress();
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex) {
            stateOwnerPubkeyKey = null;
            clearCurrentListingState();
            return;
        }

        const requestId = ++loadRequestId;
        let visibleUntil = await refreshVisibleUntil(pubkeyHex, requestId);
        const revisionBeforeLatestQuery = getPostHistorySearchRevision(pubkeyHex);
        const latestPosts = await postHistoryRepository.getLatestVisibleChunk({
            pubkeyHex,
            limit: pageSize,
            visibleUntil,
        });

        if (
            !getShow()
            || getPubkeyHex() !== pubkeyHex
            || requestId !== loadRequestId
        ) {
            return;
        }

        markStateOwner(pubkeyHex);
        state.listingMode = "contiguous";
        state.sparseSource = null;
        state.loadedPosts = latestPosts;
        state.hasNewerLocal = false;
        const nextCoverageAnchor = latestPosts.length > 0
            ? Math.min(...latestPosts.map((post) => post.createdAt)) : null;
        const needsCoverageProjection = coverageAnchorCreatedAt !== nextCoverageAnchor;
        // A rebuilt latest window must not inherit an older window's continuity
        // across an uncovered gap, even when that older coverage remains valid.
        coverageAnchorCreatedAt = nextCoverageAnchor;
        if (!await waitForFirstPostPaint(
            pubkeyHex,
            () => isCurrentPostHistoryLoad(pubkeyHex, requestId),
            () => state.loadedPosts.length > 0,
        )) {
            return;
        }
        if (needsCoverageProjection) {
            visibleUntil = await refreshVisibleUntil(pubkeyHex, requestId);
            if (!isCurrentPostHistoryLoad(pubkeyHex, requestId)) return;
        }
        if (!skipTotalCountRefresh) {
            refreshTotalCountFromRepository({ force: forceTotalCount });
        }

        void refreshJumpCacheAnchorAvailability(pubkeyHex, requestId).catch(() => {
            // Anchor availability is auxiliary and must not delay the first post.
        });

        const progressReady = establishContiguousProgress(
            pubkeyHex,
            requestId,
            latestPosts,
            visibleUntil,
            revisionBeforeLatestQuery,
        );
        let progressEstablished = false;
        if (awaitProgress) {
            progressEstablished = await progressReady.catch(() => {
                clearContiguousProgress();
                return false;
            });
        } else {
            void progressReady.catch(() => { clearContiguousProgress(); });
        }

        const canSkipOlderAvailability =
            skipOlderAvailabilityCheck && progressEstablished;
        if (skipOlderAvailabilityCheck && !canSkipOlderAvailability) {
            // A failed/stale rebase must not leave the previous window's
            // availability value visible while the safe query recomputes it.
            state.hasOlderLocal = false;
        } else if (canSkipOlderAvailability && contiguousProgress) {
            // The awaited snapshot describes this exact latest window, so its
            // remaining visible count is the authoritative older availability.
            state.hasOlderLocal =
                contiguousProgress.totalVisibleCount
                > contiguousProgress.reachedVisibleCount;
        }

        const savedAvailability = refreshSavedPostsOutsideVisibleRange(
            pubkeyHex,
            visibleUntil,
            requestId,
        ).catch(() => {
            // Saved-range detection is auxiliary and must not delay the first post.
        });

        const timelineAvailability = refreshTimelineAvailability(
            pubkeyHex,
            latestPosts,
            requestId,
            { skipOlderCheck: canSkipOlderAvailability },
        )
            .then(() => {
                if (
                    !getShow()
                    || getPubkeyHex() !== pubkeyHex
                    || requestId !== loadRequestId
                ) {
                    return;
                }

                startOpenRelayFetchAfterLocalLoad(pubkeyHex, latestPosts);
            })
            .catch(() => {
                // Preserve the existing behavior: no relay refresh follows a
                // failed timeline availability check.
            });
        if (awaitAvailability) await Promise.all([savedAvailability, timelineAvailability]);
    }

    async function reloadVisibleWindowFromCurrentNewest(
        { skipTotalCountRefresh = false }: { skipTotalCountRefresh?: boolean } = {},
    ): Promise<void> {
        clearContiguousProgress();
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || state.loadedPosts.length === 0) {
            await loadLatestVisiblePosts({ skipTotalCountRefresh });
            return;
        }

        const newestPost = state.loadedPosts[0];
        const newestCursor = toTimelineCursor(newestPost);
        if (!newestCursor) {
            await loadLatestVisiblePosts({ skipTotalCountRefresh });
            return;
        }

        const requestId = ++loadRequestId;
        const visibleUntil = await refreshVisibleUntil(pubkeyHex);
        const isSparseContext = isSparseListingContext(
            visibleUntil,
            state.loadedPosts,
        );
        const nextPosts = isSparseContext
            ? await postHistoryRepository.getVisibleChunkFromCreatedAt({
                    pubkeyHex,
                    visibleUntil,
                    createdAt: newestPost.createdAt,
                    limit: state.loadedPosts.length,
                    query: {
                        contiguous: false,
                    },
                })
            : await (state.loadedPosts.length > 1
                    ? postHistoryRepository.getOlderVisibleChunk({
                        pubkeyHex,
                        visibleUntil,
                        cursor: newestCursor,
                        limit: state.loadedPosts.length - 1,
                    }).then((olderPosts) => [newestPost, ...olderPosts])
                    : Promise.resolve([newestPost]));

        if (!getShow() || requestId !== loadRequestId) {
            return;
        }

        state.loadedPosts = nextPosts;
        if (!await waitForFirstPostPaint(
            pubkeyHex,
            () => isCurrentPostHistoryLoad(pubkeyHex, requestId),
            () => state.loadedPosts.length > 0,
        )) {
            return;
        }
        if (!skipTotalCountRefresh) {
            refreshTotalCountFromRepository();
        }
        await refreshTimelineAvailability(pubkeyHex, nextPosts, requestId);
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
        clearContiguousProgress();
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
        if (!getShow() || requestId !== loadRequestId) {
            return;
        }

        if (shouldApplyPendingLatestRequest(pendingLatestRequest, scrollState)) {
            onSessionScrollStateInvalidated();
            await loadLatestVisiblePosts();
            return;
        }

        state.hasNewerLocal = newerPosts.length > 0;
        state.hasOlderLocal = olderPosts.length > 0;
        if (!await waitForFirstPostPaint(
            pubkeyHex,
            () => isCurrentPostHistoryLoad(pubkeyHex, requestId),
            () => state.loadedPosts.length > 0,
        )) {
            return;
        }
        refreshTotalCountFromRepository();
        await refreshTimelineAvailability(pubkeyHex, state.loadedPosts, requestId);
        if (!isCurrentPostHistoryLoad(pubkeyHex, requestId)) {
            return;
        }
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
        clearContiguousProgress();
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || !getShow()) {
            return false;
        }

        const requestId = ++loadRequestId;
        const visibleUntil = await refreshVisibleUntil(pubkeyHex);
        const restoredPosts = await postHistoryRepository.getVisibleChunkAroundEventId({
                pubkeyHex,
                visibleUntil,
                eventId: scrollState.anchor.eventId,
                limit: maxVisiblePosts,
                keepAbove: pageSize,
            });

        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        if (restoredPosts.length === 0) {
            onSessionScrollStateInvalidated();
            await loadLatestVisiblePosts();
            return false;
        }

        state.loadedPosts = restoredPosts;
        if (!await waitForFirstPostPaint(
            pubkeyHex,
            () => isCurrentPostHistoryLoad(pubkeyHex, requestId),
            () => state.loadedPosts.length > 0,
        )) {
            return false;
        }
        refreshTotalCountFromRepository();
        await refreshTimelineAvailability(pubkeyHex, restoredPosts, requestId);
        if (!isCurrentPostHistoryLoad(pubkeyHex, requestId)) {
            return false;
        }
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

        const useContiguousProgress = options.useContiguousProgress !== false
            && contiguousProgress !== null;
        const progressToExtend = options.preserveContiguousProgressAfterDatabaseChange
            ? contiguousProgress
            : null;

        const requestId = ++loadRequestId;
        const progress = useContiguousProgress
            ? await validateContiguousProgress(pubkeyHex, requestId)
            : null;
        if (useContiguousProgress && !progress) {
            await rebaseContiguousProgress();
            if (metrics) {
                metrics.loadedPostsAfterLength = state.loadedPosts.length;
                metrics.visibleOldestAfter = state.loadedPosts.length > 0
                    ? state.loadedPosts[state.loadedPosts.length - 1]?.createdAt ?? null
                    : null;
            }
            return false;
        }

        const visibleUntil = progress?.visibleUntil ??
            await refreshVisibleUntil(pubkeyHex, requestId);
        const remainingVisibleCount = progress
            ? Math.max(
                0,
                progress.totalVisibleCount - progress.reachedVisibleCount,
            )
            : pageSize;
        if (progress && remainingVisibleCount === 0) {
            state.hasOlderLocal = false;
            if (metrics) {
                metrics.loadedPostsAfterLength = state.loadedPosts.length;
                metrics.visibleOldestAfter = state.loadedPosts.length > 0
                    ? state.loadedPosts[state.loadedPosts.length - 1]?.createdAt ?? null
                    : null;
            }
            await refreshTimelineAvailability(
                pubkeyHex,
                state.loadedPosts,
                requestId,
                { skipOlderCheck: true },
            );
            return false;
        }

        const queryLimit = Math.min(pageSize, remainingVisibleCount);
        const olderPosts = await postHistoryRepository.getOlderVisibleChunk({
            pubkeyHex,
            visibleUntil,
            cursor: oldestCursor,
            limit: queryLimit,
        });
        if (metrics) {
            metrics.olderPostsLength = olderPosts.length;
        }

        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        const progressAfterQuery = progress
            ? await validateContiguousProgress(pubkeyHex, requestId)
            : null;
        if (progress && !progressAfterQuery) {
            await rebaseContiguousProgress();
            return false;
        }

        if (olderPosts.length === 0) {
            if (progress) {
                // A non-zero remaining count is an invariant violation unless
                // the database changed between the bounded query and this
                // check. Do not convert it into a false end-of-history result.
                await rebaseContiguousProgress();
            } else {
                state.hasOlderLocal = false;
            }
            if (metrics) {
                metrics.loadedPostsAfterLength = state.loadedPosts.length;
                metrics.visibleOldestAfter =
                    state.loadedPosts.length > 0
                        ? state.loadedPosts[state.loadedPosts.length - 1]?.createdAt ?? null
                        : null;
            }
            return false;
        }

        const autoLoadAnchorEventId = options.autoLoadViewportCommit
            ? options.autoLoadViewportCommit.captureAnchorEventId()
            : null;
        if (options.autoLoadViewportCommit && !autoLoadAnchorEventId) {
            return false;
        }

        const relayFetchAnchorEventId =
            options.relayFetchViewportCommit?.captureAnchorEventId();
        const mergedResult = mergeOlderVisiblePostsForState(
            currentLoadedPosts,
            olderPosts,
            autoLoadAnchorEventId ?? relayFetchAnchorEventId ?? options.anchorEventId,
        );
        const newlyVisibleOlderPosts =
            options.reason === "normal-older-reveal"
                ? resolveNewlyVisibleOlderPosts(
                    currentLoadedPosts,
                    mergedResult.posts,
                )
                : [];
        if (
            options.autoLoadViewportCommit
            && (!autoLoadAnchorEventId
                || !mergedResult.posts.some(
                    (post) => post.eventId === autoLoadAnchorEventId,
                )
                || newlyVisibleOlderPosts.length === 0)
        ) {
            return false;
        }
        if (
            options.autoLoadViewportCommit
            && !options.autoLoadViewportCommit.canCommitWindowChange(
                "older",
                currentLoadedPosts,
                mergedResult.posts,
            )
        ) {
            return false;
        }
        state.loadedPosts = mergedResult.posts;
        if (newlyVisibleOlderPosts.length > 0) {
            relationRepairCoordinator.scheduleOlderRevealRepair(
                newlyVisibleOlderPosts,
            );
        }
        if (mergedResult.didDeferOlderPosts) {
            state.hasOlderLocal = true;
        }
        if (mergedResult.didTrimForOlderAppend) {
            // The bounded window just discarded known local posts from its
            // newer side. Publish that availability before the caller restores
            // the scroll anchor; the background confirmation must not insert
            // the newer-navigation control afterwards and move the anchor.
            state.hasNewerLocal = true;
        }
        const newlyVisibleCount = newlyVisibleOlderPosts.length;
        if (progressAfterQuery) {
            contiguousProgress = {
                ...progressAfterQuery,
                reachedVisibleCount: Math.min(
                    progressAfterQuery.totalVisibleCount,
                    progressAfterQuery.reachedVisibleCount + newlyVisibleCount,
                ),
                oldestCursor: toTimelineCursor(
                    mergedResult.posts[mergedResult.posts.length - 1],
                ) ?? progressAfterQuery.oldestCursor,
            };
        } else if (
            !useContiguousProgress
            && progressToExtend
            && getPostHistorySearchRevision(pubkeyHex) === progressToExtend.revision
        ) {
            if (sameTimelineCursor(oldestCursor, progressToExtend.oldestCursor)) {
                contiguousProgress = {
                    ...progressToExtend,
                    reachedVisibleCount: Math.min(
                        progressToExtend.totalVisibleCount,
                        progressToExtend.reachedVisibleCount + newlyVisibleCount,
                    ),
                    oldestCursor: toTimelineCursor(
                        mergedResult.posts[mergedResult.posts.length - 1],
                    ) ?? progressToExtend.oldestCursor,
                };
            } else {
                clearContiguousProgress();
            }
        }
        const canDeriveOlderAvailability = useContiguousProgress
            && progressAfterQuery !== null
            && contiguousProgress !== null;
        const hasReachedVisibleEnd = !!contiguousProgress
            && contiguousProgress.reachedVisibleCount >=
                contiguousProgress.totalVisibleCount;
        if (canDeriveOlderAvailability && contiguousProgress) {
            state.hasOlderLocal =
                contiguousProgress.totalVisibleCount
                > contiguousProgress.reachedVisibleCount;
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
        options.autoLoadViewportCommit?.onCommitted();
        options.relayFetchViewportCommit?.onCommitted();
        if (canDeriveOlderAvailability) {
            void refreshTimelineAvailability(
                pubkeyHex,
                mergedResult.posts,
                requestId,
                { skipOlderCheck: true },
            ).catch(() => undefined);
            return true;
        }

        await refreshTimelineAvailability(
            pubkeyHex,
            mergedResult.posts,
            requestId,
            { skipOlderCheck: useContiguousProgress && hasReachedVisibleEnd },
        );
        return true;
    }

    async function loadOlderSparsePosts(
        pubkeyHex: string,
        requestId: number,
        options: LoadOlderVisiblePostsOptions = {},
    ): Promise<boolean> {
        clearContiguousProgress();
        const currentLoadedPosts = state.loadedPosts;
        const oldestCreatedAt =
            currentLoadedPosts.length > 0
                ? currentLoadedPosts[currentLoadedPosts.length - 1]?.createdAt ?? null
                : null;
        if (typeof oldestCreatedAt !== "number") {
            return false;
        }

        const olderPosts = await postHistoryRepository.getVisibleChunkFromCreatedAt({
            pubkeyHex,
            visibleUntil: state.visibleUntil,
            createdAt: Math.max(0, oldestCreatedAt - 1),
            limit: pageSize,
            query: {
                contiguous: false,
            },
        });

        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        if (olderPosts.length === 0) {
            state.hasOlderLocal = false;
            return false;
        }

        const mergedResult = mergeOlderVisiblePostsForState(
            currentLoadedPosts,
            olderPosts,
            options.relayFetchViewportCommit?.captureAnchorEventId()
                ?? options.anchorEventId,
        );
        state.loadedPosts = mergedResult.posts;
        if (options.relayFetchViewportCommit && mergedResult.didTrimForOlderAppend) {
            state.hasNewerLocal = true;
        }
        options.relayFetchViewportCommit?.onCommitted();
        await refreshTimelineAvailability(pubkeyHex, mergedResult.posts, requestId);
        if (mergedResult.didDeferOlderPosts) {
            state.hasOlderLocal = true;
        }

        return true;
    }

    async function loadOlderSavedPosts(
        pubkeyHex: string,
        requestId: number,
        options: LoadOlderVisiblePostsOptions = {},
    ): Promise<boolean> {
        clearContiguousProgress();
        const currentLoadedPosts = state.loadedPosts;
        if (typeof state.visibleUntil !== "number") {
            return false;
        }

        const oldestCursor = toTimelineCursor(
            currentLoadedPosts[currentLoadedPosts.length - 1],
        );
        if (!oldestCursor) {
            return false;
        }

        const olderPosts = await postHistoryRepository.getSparseChunk({
            pubkeyHex,
            visibleUntil: state.visibleUntil,
            cursor: oldestCursor,
            direction: "older",
            limit: pageSize,
        });

        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        if (olderPosts.length === 0) {
            state.hasOlderLocal = false;
            return false;
        }

        const mergedResult = mergeOlderVisiblePostsForState(
            currentLoadedPosts,
            olderPosts,
            options.relayFetchViewportCommit?.captureAnchorEventId()
                ?? options.anchorEventId,
        );
        state.loadedPosts = mergedResult.posts;
        if (options.relayFetchViewportCommit && mergedResult.didTrimForOlderAppend) {
            state.hasNewerLocal = true;
        }
        options.relayFetchViewportCommit?.onCommitted();
        await refreshTimelineAvailability(pubkeyHex, mergedResult.posts, requestId);
        if (mergedResult.didDeferOlderPosts) {
            state.hasOlderLocal = true;
        }

        return true;
    }

    async function loadNewerVisiblePosts(
        autoLoadViewportCommit?: AutoLoadViewportCommit,
    ): Promise<boolean> {
        const pubkeyHex = getPubkeyHex();
        const newestCursor = toTimelineCursor(state.loadedPosts[0]);
        if (!pubkeyHex || !newestCursor) {
            return false;
        }

        const requestId = ++loadRequestId;
        const progressBefore = contiguousProgress;
        const progress = progressBefore
            ? await validateContiguousProgress(pubkeyHex, requestId)
            : null;
        if (progressBefore && !progress) {
            await rebaseContiguousProgress();
            return false;
        }
        const visibleUntil = progress?.visibleUntil ??
            await refreshVisibleUntil(pubkeyHex, requestId);
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

        if (progress) {
            const progressAfterQuery = await validateContiguousProgress(
                pubkeyHex,
                requestId,
            );
            if (!progressAfterQuery) {
                await rebaseContiguousProgress();
                return false;
            }
        }

        const anchorEventId = autoLoadViewportCommit?.captureAnchorEventId();
        if (autoLoadViewportCommit && !anchorEventId) {
            return false;
        }

        const currentPosts = state.loadedPosts;
        const nextPosts = trimVisiblePosts(
            [...newerPosts, ...currentPosts],
            "newer",
        );
        if (
            autoLoadViewportCommit
            && !nextPosts.some((post) => post.eventId === anchorEventId)
        ) {
            return false;
        }
        if (
            autoLoadViewportCommit
            && !autoLoadViewportCommit.canCommitWindowChange(
                "newer",
                currentPosts,
                nextPosts,
            )
        ) {
            return false;
        }
        state.loadedPosts = nextPosts;
        const removedOlderCount = Math.max(
            0,
            currentPosts.length + newerPosts.length - nextPosts.length,
        );
        if (progress) {
            contiguousProgress = {
                ...progress,
                reachedVisibleCount: Math.max(
                    0,
                    progress.reachedVisibleCount - removedOlderCount,
                ),
                oldestCursor: toTimelineCursor(
                    nextPosts[nextPosts.length - 1],
                ) ?? progress.oldestCursor,
            };
        }
        if (autoLoadViewportCommit && removedOlderCount > 0) {
            state.hasOlderLocal = true;
        }
        autoLoadViewportCommit?.onCommitted();
        await refreshTimelineAvailability(pubkeyHex, nextPosts, requestId);
        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }
        return true;
    }

    async function jumpToCreatedAt(createdAt: number): Promise<boolean> {
        clearContiguousProgress();
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex) {
            return false;
        }

        const requestId = ++loadRequestId;
        const visibleUntil = await refreshVisibleUntil(pubkeyHex);
        const contiguousDatePosts = await postHistoryRepository.getVisibleChunkFromCreatedAt({
                pubkeyHex,
                visibleUntil,
                createdAt,
                limit: pageSize,
            });

        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        if (contiguousDatePosts.length === 0) {
            refreshTotalCountFromRepository();
            state.loadedPosts = [];
            state.hasOlderLocal = false;
            state.hasNewerLocal = false;
            return false;
        }

        if (!didDateChunkMissTarget(contiguousDatePosts, createdAt)) {
            refreshTotalCountFromRepository();
            state.listingMode = "contiguous";
            state.sparseSource = null;
            state.loadedPosts = contiguousDatePosts;
            resetOlderBackfillSearchState();
            await refreshTimelineAvailability(pubkeyHex, contiguousDatePosts, requestId);
            return true;
        }

        if (createdAt <= 0) {
            refreshTotalCountFromRepository();
            state.listingMode = "contiguous";
            state.sparseSource = null;
            state.loadedPosts = contiguousDatePosts;
            resetOlderBackfillSearchState();
            await refreshTimelineAvailability(pubkeyHex, contiguousDatePosts, requestId);
            return true;
        }

        const hasNearbyJumpCacheAnchor =
            await postHistoryJumpCacheAnchorRepository.hasNearbyAnchorForPubkey({
                pubkeyHex,
                targetCreatedAt: createdAt,
            });
        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        if (hasNearbyJumpCacheAnchor) {
            const sparseDatePosts =
                await postHistoryRepository.getVisibleChunkFromCreatedAt({
                    pubkeyHex,
                    visibleUntil,
                    createdAt,
                    limit: pageSize,
                    query: {
                        contiguous: false,
                    },
                });

            if (!getShow() || requestId !== loadRequestId) {
                return false;
            }

            if (!didDateChunkMissTarget(sparseDatePosts, createdAt)) {
                refreshTotalCountFromRepository();
                state.listingMode = "sparse";
                state.sparseSource = "jump";
                state.loadedPosts = sparseDatePosts;
                resetOlderBackfillSearchState();
                await refreshTimelineAvailability(pubkeyHex, sparseDatePosts, requestId);
                return true;
            }
        }

        const rxNostr = getRxNostr();
        if (!rxNostr) {
            refreshTotalCountFromRepository();
            state.listingMode = "contiguous";
            state.sparseSource = null;
            state.loadedPosts = contiguousDatePosts;
            resetOlderBackfillSearchState();
            await refreshTimelineAvailability(pubkeyHex, contiguousDatePosts, requestId);
            return true;
        }

        cancelCurrentSync();
        const syncRequestId = ++fetchRequestId;
        state.syncStatus = "syncing";

        const repairSince = Math.max(
            0,
            createdAt - POST_HISTORY_JUMP_FETCH_RADIUS_SECONDS,
        );
        const repairUntil = createdAt;

        const expectedJumpRevision = await getPostHistoryLocalRevision(ehagakiDb, pubkeyHex);
        const authoredScope = await createAuthoredScope(pubkeyHex, rxNostr, syncRequestId);
        if (!authoredScope.isActive()) return false;
        const task = postHistoryRelayFetchService.fetchLatest(rxNostr, {
            pubkeyHex,
            relayConfig: getRelayConfig(),
            reason: "repair-visible-range",
            limit: POST_HISTORY_JUMP_FETCH_LIMIT,
            since: repairSince,
            until: repairUntil,
        });
        currentFetchTask = task;
        const relayResult = await task.promise;
        if (!isCurrentFetchRequest(syncRequestId) || currentFetchTask !== task) {
            return false;
        }

        currentFetchTask = null;
        if (!authoredScope.isActive() || relayResult.status === "cancelled") {
            state.syncStatus = "idle";
            return false;
        }

        if (relayResult.events.length > 0 || relayResult.relayFetchCoverage?.length) {
            const saved = await persistPostHistoryAuthoredFetch(relayResult, authoredScope);
            if (saved.applied === false || !authoredScope.isActive()) return false;
            await postHistoryJumpCacheAnchorRepository.addForPubkey({
                pubkeyHex,
                centerCreatedAt: createdAt,
                radiusSec: POST_HISTORY_JUMP_FETCH_RADIUS_SECONDS,
                fetchedAt: relayResult.fetchedAt,
                localWriteScope: {
                    ownerPubkeyHex: pubkeyHex,
                    expectedRevision: expectedJumpRevision,
                    isActive: () => authoredScope.isActive(),
                },
            });
            state.hasJumpCacheAnchors = true;
        }

        if (!getShow() || requestId !== loadRequestId) {
            state.syncStatus = "idle";
            return false;
        }

        const sparseDatePosts = await postHistoryRepository.getVisibleChunkFromCreatedAt({
            pubkeyHex,
            visibleUntil,
            createdAt,
            limit: pageSize,
            query: {
                contiguous: false,
            },
        });

        if (!getShow() || requestId !== loadRequestId) {
            state.syncStatus = "idle";
            return false;
        }

        state.syncStatus = "idle";
        if (didDateChunkMissTarget(sparseDatePosts, createdAt)) {
            return false;
        }

        refreshTotalCountFromRepository({ force: relayResult.events.length > 0 });
        state.listingMode = "sparse";
        state.sparseSource = "jump";
        state.loadedPosts = sparseDatePosts;
        resetOlderBackfillSearchState();
        await refreshTimelineAvailability(pubkeyHex, sparseDatePosts, requestId);
        void relationRepairCoordinator.repairJump({
            ownerPubkeyHex: pubkeyHex,
            rxNostr,
            visiblePosts: sparseDatePosts,
            isActive: () => (
                getShow()
                && getPubkeyHex() === pubkeyHex
                && getRxNostr() === rxNostr
                && requestId === loadRequestId
            ),
        }).catch(() => undefined);
        return true;
    }

    async function jumpToEventId(eventId: string): Promise<boolean> {
        clearContiguousProgress();
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || !eventId) {
            return false;
        }

        const requestId = ++loadRequestId;
        const visibleUntil = await refreshVisibleUntil(pubkeyHex, requestId);
        const getPostsAroundEvent = (range: number | null) =>
            postHistoryRepository.getVisibleChunkAroundEventId({
                pubkeyHex,
                visibleUntil: range,
                eventId,
                limit: maxVisiblePosts,
                keepAbove: pageSize,
            });

        let targetPosts = await getPostsAroundEvent(visibleUntil);
        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        const targetWasInVisibleRange = targetPosts.some(
            (post) => post.eventId === eventId,
        );
        let isSparseJump = false;
        if (!targetWasInVisibleRange && typeof visibleUntil === "number") {
            targetPosts = await getPostsAroundEvent(null);
            isSparseJump = true;
            if (!getShow() || requestId !== loadRequestId) {
                return false;
            }
        }

        if (!targetPosts.some((post) => post.eventId === eventId)) {
            return false;
        }

        refreshTotalCountFromRepository();
        state.listingMode = isSparseJump ? "sparse" : "contiguous";
        state.sparseSource = isSparseJump ? "jump" : null;
        state.loadedPosts = targetPosts;
        state.hasOlderLocal = false;
        state.hasNewerLocal = false;
        resetOlderBackfillSearchState();
        void refreshTimelineAvailability(pubkeyHex, targetPosts, requestId)
            .catch(() => undefined);
        return true;
    }

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
        return requestId === searchLoadRequestId
            && getShow()
            && getPubkeyHex() === pubkeyHex
            && query === state.searchQuery;
    }

    async function fetchSearchPage(
        page: number,
        query: string,
        requestId: number,
        showProgress = false,
    ): Promise<SearchLocalPostsResult | null> {
        const pubkeyHex = getPubkeyHex();
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
                    if (progress.phase === "partial" && !hasCompletedFirstPostPaint) {
                        await waitForFirstPostPaint(
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
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || !query) {
            state.searchPosts = [];
            state.searchTotalCount = 0;
            state.searchTotalCountKnown = false;
            state.searchHasNext = false;
            return false;
        }

        const requestId = ++searchLoadRequestId;
        const normalizedPage = Math.max(1, Math.trunc(page));
        isSearchPageLoading = true;
        searchResultStatus = "loading";
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
                    requestId === searchLoadRequestId
                    && isCurrentSearchLoad(requestId, query, pubkeyHex)
                ) {
                    searchResultStatus = "ready";
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
            searchResultStatus = "ready";
            if (!hasCompletedFirstPostPaint) {
                if (!await waitForFirstPostPaint(
                    pubkeyHex,
                    () => isCurrentSearchLoad(requestId, query, pubkeyHex),
                    () => state.searchPosts.length > 0,
                )) {
                    return false;
                }
            }
            return true;
        } catch {
            if (requestId === searchLoadRequestId) {
                searchResultStatus = "failed";
            }
            return false;
        } finally {
            if (requestId === searchLoadRequestId) {
                isSearchPageLoading = false;
            }
        }
    }

    async function rebuildSearchResultsThroughPage(
        page: number,
        query: string,
        requestId: number = ++searchLoadRequestId,
    ): Promise<boolean> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || !query) {
            return false;
        }
        const normalizedPage = Math.max(1, Math.trunc(page));
        isSearchPageLoading = true;
        searchResultStatus = "loading";
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
            searchResultStatus = "ready";
            if (!hasCompletedFirstPostPaint) {
                if (!await waitForFirstPostPaint(
                    pubkeyHex,
                    () => isCurrentSearchLoad(requestId, query, pubkeyHex),
                    () => state.searchPosts.length > 0,
                )) {
                    return false;
                }
            }
            return true;
        } catch {
            if (requestId === searchLoadRequestId) {
                searchResultStatus = "failed";
            }
            return false;
        } finally {
            if (requestId === searchLoadRequestId) {
                isSearchPageLoading = false;
            }
        }
    }

    async function bootstrapFromRelays(): Promise<void> {
        clearContiguousProgress();
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!pubkeyHex || !rxNostr) {
            return;
        }

        cancelCurrentSync();
        const requestId = ++fetchRequestId;
        const localTask = startLocalHistoryRead("bootstrap");
        const feedback = beginHistoryFeedback("syncing", localTask ? 2 : 1);
        if (localTask) void localTask.promise.then(result => finishHistoryPeer(feedback, !!result, result?.changed ?? false));
        const operation = ++externalOperation;
        externalReadBusy = true;
        let externalSuccess = false;
        let externalChanged = false;
        try {
            const previousVisibleUntil = await refreshVisibleUntil(pubkeyHex);
            if (
                !isCurrentFetchRequest(requestId) ||
                !getShow() ||
                getPubkeyHex() !== pubkeyHex
            ) {
                return;
            }

            const authoredScope = await createAuthoredScope(pubkeyHex, rxNostr, requestId);
            if (!authoredScope.isActive()) return;
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
                appliedDeletionCount: 0,
            };

            if (!isCurrentFetchRequest(requestId) || currentFetchTask !== task) {
                return;
            }

            currentFetchTask = null;
            if (!authoredScope.isActive() || result.status === "cancelled") {
                return;
            }

            if (result.events.length > 0 || result.relayFetchCoverage?.length) {
                const saved = await persistPostHistoryAuthoredFetch(result, authoredScope);
                if (saved.applied === false || !authoredScope.isActive()) return;
                upsertSummary = saved;
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

            await commitHistoryViewport(async () => {
                if (!authoredScope.isActive()) return;
                if (state.searchQuery) {
                    await rebuildSearchResultsThroughPage(
                        state.searchPage,
                        state.searchQuery,
                    );
                } else if (state.loadedPosts.length === 0 || (!state.hasNewerLocal
                    && (!localBrowsingRanges.length || state.loadedPosts.length <= pageSize))) {
                    await loadLatestVisiblePosts({
                        forceTotalCount:
                            upsertSummary.insertedCount + upsertSummary.updatedCount > 0,
                    });
                } else {
                    refreshTotalCountFromRepository({
                        force: upsertSummary.insertedCount + upsertSummary.updatedCount > 0,
                    });
                    await refreshTimelineAvailability(pubkeyHex);
                }
            });
            externalSuccess = result.status === "success" && authoredScope.isActive();
            externalChanged = upsertSummary.insertedCount + upsertSummary.updatedCount > 0 || didVisibleMateriallyChange;
        } finally {
            if (operation === externalOperation) externalReadBusy = false;
            finishHistoryPeer(feedback, externalSuccess, externalChanged);
        }
    }

    function getDialogOpenConnectionRange(ranges: PostHistoryCoverageRange[], anchor: number | null): PostHistoryCoverageRange | undefined {
        return anchor === null ? ranges.at(-1)
            : ranges.find((range) => range.since <= anchor && range.until >= anchor)
            ?? ranges.filter((range) => range.until < anchor).at(-1)
            ?? ranges.at(-1);
    }

    function shouldReplanActiveOpenRefresh(): boolean {
        if (openRefreshRequestId === null || (openRefreshSince === undefined && currentFetchTask === null)) return false;
        const range = getDialogOpenConnectionRange(externalContinuity, coverageAnchorCreatedAt);
        return range !== undefined
            && restoredRanges.some((restored) => restored.since <= range.until && restored.until >= range.until)
            && (openRefreshSince === undefined || range.until + 1 > openRefreshSince);
    }

    async function refreshRecentFromRelaysOnDialogOpen(): Promise<void> {
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!pubkeyHex || !rxNostr) {
            return;
        }

        cancelCurrentSync();
        const requestId = ++fetchRequestId;
        openRefreshRequestId = requestId;
        const localTask = startLocalHistoryRead("dialog-open-refresh");
        const feedback = beginHistoryFeedback("syncing", localTask ? 2 : 1);
        if (localTask) void localTask.promise.then(result => finishHistoryPeer(feedback, !!result, result?.changed ?? false));
        const operation = ++externalOperation;
        externalReadBusy = true;
        let externalSuccess = false;
        let externalChanged = false;
        try {
            state.lastDialogOpenRefreshAt = Date.now();
            const upperBound = Math.floor(state.lastDialogOpenRefreshAt / 1000);
            const generation = coverageGeneration;
            const relayConfig = getRelayConfig();
            const isActive = () => !isDestroyed && generation === coverageGeneration
                && isCurrentFetchRequest(requestId) && getShow()
                && getPubkeyHex() === pubkeyHex && getRxNostr() === rxNostr;
            const expectedLocalRevision = await postHistoryRelayCoverageRepository.getLocalRevision(pubkeyHex);
            const previousVisibleUntil = await refreshVisibleUntil(pubkeyHex);
            const previousCoverage = await readExternalContinuity(pubkeyHex);
            const restoredBeforeRefresh = [...restoredRanges];
            const anchor = coverageAnchorCreatedAt;
            // A partial recent query can leave a separate head above the entry
            // window. Reconnect to its saved component, not to that detached head.
            const previousRange = getDialogOpenConnectionRange(previousCoverage, anchor);
            // An explicit lower bound also certifies empty seconds between the new
            // head and the previous range. Backup restoration supplies only the
            // browsing boundary; the query still produces its own relay evidence.
            const restoredUpper = previousRange && restoredRanges.some((range) => range.since <= previousRange.until && range.until >= previousRange.until);
            const since = previousRange ? Math.min(previousRange.until, upperBound) + (restoredUpper ? 1 : 0) : undefined;
            openRefreshSince = since;
            if (!isActive()) return;
            if (since !== undefined && since > upperBound) {
                externalSuccess = true;
                openRefreshRequestId = null;
                return;
            }

            let until = upperBound;
            let frontier = upperBound + 1;
            let catchingUp = false;
            let result: PostHistoryRelayFetchResult;
            const upsertSummary = { insertedCount: 0, updatedCount: 0 };
            while (true) {
                const task = postHistoryLightweightSyncCoordinator.runAuthored(rxNostr, {
                    ownerPubkeyHex: pubkeyHex, relayConfig, getRelayConfig, isActive,
                    expectedLocalRevision,
                    reason: catchingUp ? "dialog-open-catchup" : "dialog-open-refresh",
                    ...(since === undefined ? {} : { since }), until,
                    limit: catchingUp ? POST_HISTORY_OLDER_FETCH_LIMIT : POST_HISTORY_DIALOG_OPEN_REFRESH_LIMIT,
                    timeoutMs: POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS,
                    onSavedSelfPosts: onSavedAuthoredPosts,
                });
                currentFetchTask = task;
                const page = await task.promise;
                if (!isActive() || currentFetchTask !== task) return;
                currentFetchTask = null;
                result = page.fetchResult;
                if (result.status === "cancelled") {
                    openRefreshRequestId = null;
                    return;
                }
                upsertSummary.insertedCount += page.upsertSummary.insertedCount;
                upsertSummary.updatedCount += page.upsertSummary.updatedCount;
                if (since === undefined) break;

                const ranges = await readExternalContinuity(pubkeyHex);
                if (!isActive()) return;
                const nextFrontier = ranges.find((range) => range.since <= upperBound && range.until >= upperBound)?.since
                    ?? upperBound + 1;
                if (nextFrontier <= since || (catchingUp && nextFrontier >= frontier)) break;
                frontier = nextFrontier;
                // Requery the saturated boundary second; until - 1 here skips only
                // seconds already covered, never an unresolved same-second limit.
                until = Math.min(upperBound, frontier - 1);
                catchingUp = true;
            }

            const nextVisibleUntil = await updateVisibleUntilFromFetch(
                pubkeyHex,
                result,
            );
            if (!isCurrentFetchRequest(requestId) || !getShow()) {
                return;
            }

            // An import may have already exposed older saved rows while this query
            // was pending. Its metadata alone must not reset that browsing window.
            const visibleUntilFromRelayRefresh = anchor === null ? nextVisibleUntil
                : getPostHistoryConnectedCoverageUntil(
                    getPostHistoryBrowsingContinuity(quorumCoverage, restoredBeforeRefresh), anchor,
                );
            const refreshDecision = resolvePostHistoryDialogOpenRefreshDecision({
                insertedCount: upsertSummary.insertedCount,
                updatedCount: upsertSummary.updatedCount,
                previousVisibleUntil,
                nextVisibleUntil: visibleUntilFromRelayRefresh,
                searchQuery: state.searchQuery,
                loadedPostsLength: state.loadedPosts.length,
                hasNewerLocal: state.hasNewerLocal,
            });

            updateRelayHistoryCursorAfterDialogRefresh(result);

            await commitHistoryViewport(async () => {
                if (!isActive()) return;
                if (localBrowsingRanges.length && (state.loadedPosts.length > pageSize || state.hasNewerLocal)) {
                    clearContiguousProgress();
                    refreshTotalCountFromRepository({ force: refreshDecision.didMateriallyChange });
                    await refreshTimelineAvailability(pubkeyHex);
                } else if (refreshDecision.applyAction === "reload-search-page") {
                    await rebuildSearchResultsThroughPage(
                        state.searchPage,
                        state.searchQuery,
                    );
                } else if (refreshDecision.applyAction === "load-latest-visible-posts") {
                    const requiresBoundedRebase =
                        refreshDecision.didMateriallyChange
                        && !refreshDecision.didVisibleMateriallyChange;
                    await loadLatestVisiblePosts({
                        forceTotalCount: refreshDecision.didMateriallyChange,
                        skipOlderAvailabilityCheck: requiresBoundedRebase,
                        awaitProgress: requiresBoundedRebase,
                        awaitAvailability: true,
                    });
                } else if (
                    refreshDecision.applyAction === "refresh-count-and-availability"
                ) {
                    if (refreshDecision.didMateriallyChange) {
                        // Any dialog-open insert/update can add or reorder records above
                        // the current cursor. Rebuild the latest window and establish a
                        // fresh progress snapshot instead of carrying reached forward.
                        await loadLatestVisiblePosts({
                            forceTotalCount: refreshDecision.didMateriallyChange,
                            skipOlderAvailabilityCheck:
                                !refreshDecision.didVisibleMateriallyChange,
                            awaitProgress: !refreshDecision.didVisibleMateriallyChange,
                            awaitAvailability: true,
                        });
                    } else {
                        clearContiguousProgress();
                        refreshTotalCountFromRepository({
                            force: refreshDecision.didMateriallyChange,
                        });
                        await refreshTimelineAvailability(pubkeyHex);
                    }
                }
            });
            if (!isActive()) return;
            externalSuccess = result.status === "success";
            externalChanged = refreshDecision.didMateriallyChange;
            openRefreshRequestId = null;
        } finally {
            if (operation === externalOperation) externalReadBusy = false;
            finishHistoryPeer(feedback, externalSuccess, externalChanged);
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

        const latestCoveredUntil = externalContinuity.at(-1)?.until;
        const latestAnchor = coverageAnchorCreatedAt;
        const hasUncoveredLatest = (latestCoveredUntil !== undefined
            && localPosts.some((post) => post.createdAt > latestCoveredUntil))
            || (latestAnchor !== null && !externalContinuity.some((range) =>
                range.since <= latestAnchor && range.until >= latestAnchor));
        if (forceDialogOpenRefreshAfterLocalPost || hasUncoveredLatest || shouldRunDialogOpenRefresh()) {
            forceDialogOpenRefreshAfterLocalPost = false;
            void refreshRecentFromRelaysOnDialogOpen();
        } else {
            const task = startLocalHistoryRead("dialog-open-refresh");
            if (task) {
                const feedback = beginHistoryFeedback("syncing", 1);
                void task.promise.then(result => finishHistoryPeer(feedback, !!result, result?.changed ?? false));
            }
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

        const nextPage = state.searchPage + 1;
        return loadSearchPage(nextPage, state.searchQuery);
    }

    async function goToLastPage(): Promise<boolean> {
        if (!isSearchMode || !canGoLast) {
            return false;
        }

        state.searchPage = totalPages;
        return true;
    }

    async function loadOlder(
        autoLoadViewportCommit?: AutoLoadViewportCommit,
    ): Promise<boolean> {
        if (!isSearchMode && localBrowsingRanges.length) {
            let changed = false;
            const owner = getPubkeyHex();
            await commitHistoryViewport(async () => {
                if (!isDestroyed && getShow() && getPubkeyHex() === owner) changed = await loadOlderForCurrentWindow(autoLoadViewportCommit);
            });
            return changed;
        }
        return loadOlderForCurrentWindow(autoLoadViewportCommit);
    }

    async function loadOlderForCurrentWindow(autoLoadViewportCommit?: AutoLoadViewportCommit): Promise<boolean> {
        if (isSearchMode) {
            return goToNextPage();
        }

        if (state.sparseSource === "saved") {
            const pubkeyHex = getPubkeyHex();
            if (!pubkeyHex) {
                return false;
            }
            return loadOlderSavedPosts(pubkeyHex, ++loadRequestId, {
                reason: "normal-older-reveal",
            });
        }

        if (state.sparseSource === "jump") {
            const pubkeyHex = getPubkeyHex();
            if (!pubkeyHex) {
                return false;
            }
            return loadOlderSparsePosts(pubkeyHex, ++loadRequestId, {
                reason: "normal-older-reveal",
            });
        }

        return loadOlderVisiblePosts({
            reason: "normal-older-reveal",
            autoLoadViewportCommit,
        });
    }

    async function loadNewer(
        autoLoadViewportCommit?: AutoLoadViewportCommit,
    ): Promise<boolean> {
        if (isSearchMode) {
            return Promise.resolve(goPreviousPage());
        }

        return state.sparseSource === "saved"
            ? loadNewerSparsePosts()
            : loadNewerVisiblePosts(autoLoadViewportCommit);
    }

    async function returnToLatest(): Promise<boolean> {
        if (isSearchMode) {
            return Promise.resolve(goFirstPage());
        }

        await loadLatestVisiblePosts();
        return true;
    }

    async function showSavedOlderPosts(): Promise<boolean> {
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex) {
            return false;
        }
        const visibleUntil = await resolveVisibleUntilForSavedOlderPosts(pubkeyHex);
        if (typeof visibleUntil !== "number") return false;

        const requestId = ++loadRequestId;
        const posts = await postHistoryRepository.getSparseChunk({
            pubkeyHex,
            visibleUntil,
            direction: "latest",
            limit: pageSize,
        });
        if (!getShow() || getPubkeyHex() !== pubkeyHex || requestId !== loadRequestId) {
            return false;
        }

        if (posts.length === 0) {
            state.hasSavedPostsOutsideVisibleRange = false;
            return false;
        }

        state.listingMode = "sparse";
        state.sparseSource = "saved";
        state.loadedPosts = posts;
        refreshTotalCountFromRepository();
        await refreshTimelineAvailability(pubkeyHex, posts, requestId);
        await refreshSavedPostsOutsideVisibleRange(pubkeyHex, visibleUntil, requestId);
        return true;
    }

    async function jumpToOldest(): Promise<boolean> {
        if (isSearchMode || !canJumpToOldest) {
            return false;
        }

        if (state.listingMode === "sparse") {
            clearContiguousProgress();
            const pubkeyHex = getPubkeyHex();
            if (!pubkeyHex) {
                return false;
            }

            const requestId = ++loadRequestId;
            const posts = await postHistoryRepository.getOldestVisibleChunk({
                pubkeyHex,
                visibleUntil: state.visibleUntil,
                limit: pageSize,
                query: {
                    contiguous: false,
                },
            });

            if (!getShow() || requestId !== loadRequestId) {
                return false;
            }

            if (posts.length === 0) {
                return false;
            }

            refreshTotalCountFromRepository();
            state.loadedPosts = posts;
            resetOlderBackfillSearchState();
            state.hasOlderLocal = false;
            await refreshTimelineAvailability(
                pubkeyHex,
                posts,
                requestId,
                { skipOlderCheck: true },
            );
            return true;
        }

        clearContiguousProgress();
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex) {
            return false;
        }

        const requestId = ++loadRequestId;
        const visibleUntil = await refreshVisibleUntil(pubkeyHex, requestId);
        const posts = await postHistoryRepository.getOldestVisibleChunk({
            pubkeyHex,
            visibleUntil,
            limit: pageSize,
        });

        if (!getShow() || requestId !== loadRequestId) {
            return false;
        }

        if (posts.length === 0) {
            refreshTotalCountFromRepository();
            state.loadedPosts = [];
            state.hasOlderLocal = false;
            state.hasNewerLocal = false;
            return false;
        }

        refreshTotalCountFromRepository();
        state.listingMode = "contiguous";
        state.sparseSource = null;
        state.loadedPosts = posts;
        resetOlderBackfillSearchState();
        state.hasOlderLocal = false;
        await refreshTimelineAvailability(
            pubkeyHex,
            posts,
            requestId,
            { skipOlderCheck: true },
        );
        return true;
    }

    async function fetchOlderFromRelays(
        options: FetchOlderFromRelaysOptions = {},
    ): Promise<boolean> {
        const pubkeyHex = getPubkeyHex();
        const rxNostr = getRxNostr();
        if (!getShow() || !pubkeyHex || !canFetchOlderFromRelays) {
            return false;
        }

        const runExternal = !!rxNostr && !externalReadBusy && !olderBackfillSearch.exhausted;
        const runLocal = !localReadBusy && localHasMore && postHistoryLocalRelayService.isConfigured(pubkeyHex);
        if (!runExternal && !runLocal) return false;
        const feedback = beginHistoryFeedback("older-syncing", Number(runExternal) + Number(runLocal));
        // A local-only operation must not invalidate the pending external peer.
        const requestId = runExternal ? ++fetchRequestId : fetchRequestId;
        const generation = coverageGeneration;
        const relayScopeKey = getPostHistoryAuthoredRelayScopeKey(getRelayConfig());
        const isActive = () => !isDestroyed && generation === coverageGeneration
            && isCurrentFetchRequest(requestId) && getShow()
            && getPubkeyHex() === pubkeyHex && getRxNostr() === rxNostr
            && getPostHistoryAuthoredRelayScopeKey(getRelayConfig()) === relayScopeKey;
        const localTask = runLocal ? startLocalHistoryRead("older-backfill", {
            until: localNextUntil ?? Math.floor(Date.now() / 1000),
        }, options) : null;
        if (runLocal) {
            void (localTask?.promise ?? Promise.resolve(null)).then(result => finishHistoryPeer(feedback, !!result, result?.changed ?? false));
        }
        if (runExternal && rxNostr) {
            const operation = ++externalOperation;
            externalReadBusy = true;
            let success = true;
            void fetchOlderFromRelaysForRequest(pubkeyHex, rxNostr, requestId, isActive, options,
                (completed) => { success = completed; })
                .then(changed => finishHistoryPeer(feedback, success && isActive(), changed))
                .catch(() => finishHistoryPeer(feedback, false, false))
                .finally(() => { if (operation === externalOperation) externalReadBusy = false; });
        }
        return feedback.promise;
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
            const externalFloor = await readExternalVisibleUntil(pubkeyHex);
            if (!isActive()) return false;
            const cursor = toTimelineCursor(state.loadedPosts.at(-1));
            const hasOlderLocal = cursor ? await postHistoryRepository.hasOlderVisiblePosts({
                pubkeyHex, visibleUntil: externalFloor, cursor,
            }) : false;
            if (!isActive()) return false;
            // The DB check may outlive a background external coverage update.
            // Compare external floors; state.visibleUntil also includes local browsing.
            const nextExternalFloor = await readExternalVisibleUntil(pubkeyHex);
            if (!isActive()) return false;
            if (state.listingMode !== "contiguous") break;
            if (nextExternalFloor !== externalFloor
                || (cursor && !sameTimelineCursor(cursor, toTimelineCursor(state.loadedPosts.at(-1))))) continue;
            preparedVisibleUntil = externalFloor;
            if (hasOlderLocal) {
                clearContiguousProgress();
                let changed = false;
                await commitHistoryViewport(async () => {
                    if (!isActive()) return;
                    changed = await loadOlderVisiblePosts({
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
        const targetVisibleAdded = Math.max(1, Math.min(pageSize, 30));
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
            const planningFloor = await readExternalVisibleUntil(pubkeyHex);
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

            const effectiveFetchUntil = (() => {
                if (typeof previousVisibleUntil === "number" && !(localBrowsingRanges.length
                    ? isSparseListingContext(state.visibleUntil) : isSparseListingContext(previousVisibleUntil))) {
                    return previousVisibleUntil;
                }
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
                return batchChanged;
            }

            const rangesBeforeFetch = await readExternalContinuity(pubkeyHex);
            if (!isActive()) return batchChanged;

            const windowIndex = Math.min(
                batchWindowIndex,
                POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE.length - 1,
            );
            const windowSeconds =
                POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE[windowIndex];
            const uncovered = getPostHistoryOlderUncoveredRange(rangesBeforeFetch, Math.trunc(effectiveFetchUntil), windowSeconds, batchContinuationSince);
            if (!uncovered) {
                setOlderBackfillNextCursor(null, null);
                return batchChanged;
            }
            const fetchRange: OlderBackfillSearchRange = {
                ...uncovered,
                windowSeconds,
            };

            const previousCount = await countVisiblePosts(pubkeyHex, previousVisibleUntil);
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

            const authoredScope = await createAuthoredScope(pubkeyHex, rxNostr, requestId);
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
            currentFetchTask = task;

            const result = await task.promise;
            if (!isActive() || currentFetchTask !== task) {
                return batchChanged;
            }

            currentFetchTask = null;
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

            const isSparseBackfillContext =
                typeof visibleOldestCreatedAt === "number"
                && (
                    state.visibleUntil === null
                        ? state.hasJumpCacheAnchors
                        : visibleOldestCreatedAt < state.visibleUntil
                );

            const nextVisibleUntil = isSparseBackfillContext
                ? previousVisibleUntil
                : await updateVisibleUntilFromOlderBackfillFetch(
                    pubkeyHex,
                    result,
                );
            if (!isActive()) {
                return batchChanged;
            }

            const effectiveVisibleUntil = nextVisibleUntil;

            const nextCount = await countVisiblePosts(pubkeyHex, effectiveVisibleUntil);
            if (!isActive()) {
                return batchChanged;
            }

            let canPreserveContiguousProgress = false;
            if (!isSparseBackfillContext) {
                canPreserveContiguousProgress =
                    await reconcileContiguousProgressAfterDatabaseChange(
                        pubkeyHex,
                        effectiveVisibleUntil,
                        { preserveReachedVisibleCount: true },
                    );
            }

            await refreshSavedPostsOutsideVisibleRange(
                pubkeyHex,
                effectiveVisibleUntil,
                null,
                requestId,
            );
            if (!isActive()) {
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
            const nextExternalFloor = await readExternalVisibleUntil(pubkeyHex);
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
                maxVisiblePosts,
            };

            await commitHistoryViewport(async () => {
                if (!isActive()) return;
                if (state.searchQuery) {
                    await rebuildSearchResultsThroughPage(
                        state.searchPage,
                        state.searchQuery,
                    );
                } else {
                    refreshTotalCountFromRepository({ force: didMateriallyChange });
                    if (didVisibleCountIncrease || didMateriallyChange) {
                        didLoadFetchedOlderPosts = state.sparseSource === "saved"
                            ? await loadOlderSavedPosts(pubkeyHex, loadRequestId, {
                                anchorEventId: options.anchorEventId,
                                relayFetchViewportCommit: options.viewportCommit,
                            })
                            : isSparseBackfillContext
                                ? await loadOlderSparsePosts(pubkeyHex, loadRequestId, {
                                    anchorEventId: options.anchorEventId,
                                    relayFetchViewportCommit: options.viewportCommit,
                                })
                                : await loadOlderVisiblePosts({
                                    anchorEventId: options.anchorEventId,
                                    relayFetchViewportCommit: options.viewportCommit,
                                    metrics: olderLoadMetrics,
                                    reason: "normal-older-reveal",
                                    useContiguousProgress: false,
                                    preserveContiguousProgressAfterDatabaseChange:
                                        canPreserveContiguousProgress,
                                });
                    } else {
                        await refreshTimelineAvailability(pubkeyHex);
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
            const didCursorAdvanceOlder =
                typeof nextUntilCursor === "number" &&
                nextUntilCursor < effectiveFetchUntil;
            const currentVisibleCount = nextCount;
            const totalVisibleAdded = Math.max(
                0,
                currentVisibleCount - (clickStartVisibleCount ?? currentVisibleCount),
            );
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
            const connectedSavedRange = typeof nextExternalFloor === "number" && typeof previousVisibleUntil === "number"
                && rangesBeforeFetch.some((range) => range.until < previousVisibleUntil && nextExternalFloor <= range.since);
            const coverageAdvanced = typeof nextExternalFloor === "number" && typeof previousVisibleUntil === "number"
                && nextExternalFloor < previousVisibleUntil;
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
                    batchWindowIndex = Math.min(
                        batchWindowIndex + 1,
                        POST_HISTORY_OLDER_BACKFILL_WINDOW_SEQUENCE.length - 1,
                    );
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

    async function refetchAroundCurrentView(): Promise<void> {
        clearContiguousProgress();
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
        let reportedFailurePhase: PostHistoryManualRepairPhase | null = null;
        let previousVisibleUntil: number | null;
        const initialVisibleRangeStateStartedAt = Date.now();
        try {
            previousVisibleUntil = await refreshVisibleUntil(pubkeyHex);
            reportPostHistoryManualRepairPhase({
                phase: "visible-range-state",
                startedAt: initialVisibleRangeStateStartedAt,
            });
        } catch (error) {
            reportPostHistoryManualRepairPhase({
                phase: "visible-range-state",
                startedAt: initialVisibleRangeStateStartedAt,
                error,
            });
            state.currentViewRefetchStatus = "idle";
            state.currentViewRefetchMessageKey = "postHistory.repairFetchFailed";
            state.currentViewRefetchMessageValues = null;
            scheduleCurrentViewRefetchMessageClearIfNeeded();
            return;
        }

        let task: PostHistoryCurrentViewRefetchTask;
        const primaryFetchStartedAt = Date.now();
        try {
            task = postHistoryCurrentViewRefetchService.refetchAroundCurrentView(rxNostr, {
                pubkeyHex,
                relayConfig: getRelayConfig(),
                preferredRanges,
                getRelayConfig,
                isActive: () => getShow() && getPubkeyHex() === pubkeyHex && getRxNostr() === rxNostr,
                onProgress: async () => undefined,
            });
        } catch (error) {
            reportPostHistoryManualRepairPhase({
                phase: "primary-fetch",
                startedAt: primaryFetchStartedAt,
                error,
            });
            state.currentViewRefetchStatus = "idle";
            state.currentViewRefetchMessageKey = "postHistory.repairFetchFailed";
            state.currentViewRefetchMessageValues = null;
            scheduleCurrentViewRefetchMessageClearIfNeeded();
            return;
        }
        currentViewRefetchTask = task;
        startLocalHistoryRead("repair-visible-range", {
            since: Math.min(...preferredRanges.map((range) => range.since)),
            until: Math.max(...preferredRanges.map((range) => range.until)),
        });
        let primaryRefetchReloadCompleted = false;
        let activePhaseStartedAt = primaryFetchStartedAt;

        try {
            const result = await task.promise;
            if (currentViewRefetchTask !== task) {
                return;
            }

            reportPostHistoryManualRepairPhase({
                phase: "primary-fetch",
                startedAt: primaryFetchStartedAt,
                durationMs: result.timing?.primaryFetchDurationMs ?? 0,
                counts: {
                    processedRangeCount: result.processedRangeCount,
                    rawCount: result.processedRanges.reduce(
                        (count, range) => count + (range.rawCount ?? 0),
                        0,
                    ),
                    uniqueCount: result.processedRanges.reduce(
                        (count, range) => count + (range.uniqueCount ?? 0),
                        0,
                    ),
                    requestedRelayCount: result.processedRanges.reduce(
                        (count, range) => count + (range.requestedRelayUrls?.length ?? 0),
                        0,
                    ),
                    eoseRelayCount: result.processedRanges.reduce(
                        (count, range) => count + (range.eoseRelayUrls?.length ?? 0),
                        0,
                    ),
                },
            });
            if ((result.timing?.primaryPersistAttemptCount ?? 0) > 0) {
                reportPostHistoryManualRepairPhase({
                    phase: "primary-persist",
                    startedAt: primaryFetchStartedAt,
                    durationMs: result.timing?.primaryPersistDurationMs ?? 0,
                    counts: {
                        persistedRangeCount: result.timing?.primaryPersistAttemptCount ?? 0,
                    },
                });
            }

            if (!getShow() || result.status === "cancelled") {
                currentViewRefetchTask = null;
                state.currentViewRefetchStatus = "idle";
                return;
            }

            const visibleRangeStateStartedAt = Date.now();
            activePhaseStartedAt = visibleRangeStateStartedAt;
            try {
                await maybeExtendVisibleUntilFromCurrentViewRefetchResult(
                    pubkeyHex,
                    previousVisibleUntil,
                    result.processedRanges,
                );
                reportPostHistoryManualRepairPhase({
                    phase: "visible-range-state",
                    startedAt: visibleRangeStateStartedAt,
                    counts: { processedRangeCount: result.processedRangeCount },
                });
            } catch (error) {
                reportedFailurePhase = "visible-range-state";
                reportPostHistoryManualRepairPhase({
                    phase: "visible-range-state",
                    startedAt: visibleRangeStateStartedAt,
                    error,
                    counts: { processedRangeCount: result.processedRangeCount },
                });
                throw error;
            }

            const visibleWindowReloadStartedAt = Date.now();
            activePhaseStartedAt = visibleWindowReloadStartedAt;
            try {
                if (state.searchQuery) {
                    await rebuildSearchResultsThroughPage(
                        state.searchPage,
                        state.searchQuery,
                    );
                } else if (state.loadedPosts.length === 0 || !state.hasNewerLocal) {
                    await loadLatestVisiblePosts({ skipTotalCountRefresh: true });
                } else {
                    await reloadVisibleWindowFromCurrentNewest({ skipTotalCountRefresh: true });
                }
                reportPostHistoryManualRepairPhase({
                    phase: "visible-window-reload",
                    startedAt: visibleWindowReloadStartedAt,
                    counts: { processedRangeCount: result.processedRangeCount },
                });
            } catch (error) {
                reportedFailurePhase = "visible-window-reload";
                reportPostHistoryManualRepairPhase({
                    phase: "visible-window-reload",
                    startedAt: visibleWindowReloadStartedAt,
                    error,
                    counts: { processedRangeCount: result.processedRangeCount },
                });
                throw error;
            }
            primaryRefetchReloadCompleted = true;

            let childInteractionRepairResult: PostHistoryRelationRepairSummary | null = null;
            if (
                currentViewRefetchTask === task
                && getShow()
                && getPubkeyHex() === pubkeyHex
                && getRxNostr() === rxNostr
                && state.loadedPosts.length > 0
            ) {
                const relationRepairStartedAt = Date.now();
                activePhaseStartedAt = relationRepairStartedAt;
                childInteractionRepairResult =
                    await relationRepairCoordinator.repairCurrentView({
                        ownerPubkeyHex: pubkeyHex,
                        rxNostr,
                        visiblePosts: state.loadedPosts,
                        isActive: () =>
                            currentViewRefetchTask === task
                            && getShow()
                            && getPubkeyHex() === pubkeyHex
                            && getRxNostr() === rxNostr,
                    });
                if (
                    currentViewRefetchTask !== task
                    || childInteractionRepairResult.status === "cancelled"
                    || !getShow()
                ) {
                    return;
                }
                reportPostHistoryManualRepairPhase({
                    phase: "relation-repair",
                    startedAt: relationRepairStartedAt,
                    durationMs: childInteractionRepairResult.relationRepairDurationMs
                        ?? (childInteractionRepairResult.failurePhase === "relation-repair"
                            ? childInteractionRepairResult.failureDurationMs
                            : undefined),
                    errorClass: childInteractionRepairResult.failurePhase === "relation-repair"
                        ? childInteractionRepairResult.failureErrorClass
                        : undefined,
                    counts: {
                        savedDirectReplyCount:
                            childInteractionRepairResult.savedDirectReplyCount,
                    },
                });
                if (
                    typeof childInteractionRepairResult.badgeRefreshDurationMs === "number"
                    || childInteractionRepairResult.failurePhase === "badge-refresh"
                ) {
                    reportPostHistoryManualRepairPhase({
                        phase: "badge-refresh",
                        startedAt: relationRepairStartedAt,
                        durationMs: childInteractionRepairResult.badgeRefreshDurationMs
                            ?? childInteractionRepairResult.failureDurationMs,
                        errorClass: childInteractionRepairResult.failurePhase === "badge-refresh"
                            ? childInteractionRepairResult.failureErrorClass
                            : undefined,
                    });
                }
            }

            if (
                currentViewRefetchTask !== task
                || !getShow()
                || getPubkeyHex() !== pubkeyHex
                || getRxNostr() !== rxNostr
            ) {
                return;
            }

            if (!state.searchQuery) {
                refreshTotalCountFromRepository({ force: true });
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
            } else if ((childInteractionRepairResult?.savedDirectReplyCount ?? 0) > 0) {
                state.currentViewRefetchMessageKey = "postHistory.repairChildInteractionsAdded";
                state.currentViewRefetchMessageValues = {
                    count: childInteractionRepairResult?.savedDirectReplyCount ?? 0,
                };
            } else if (result.fetchFailed) {
                state.currentViewRefetchMessageKey = "postHistory.repairFetchFailed";
                state.currentViewRefetchMessageValues = null;
            } else {
                state.currentViewRefetchMessageKey = "postHistory.repairNoChanges";
                state.currentViewRefetchMessageValues = {
                    processedRangeCount: result.processedRangeCount,
                    updatedCount: result.updatedCount,
                };
            }

            scheduleCurrentViewRefetchMessageClearIfNeeded();
        } catch (error) {
            if (currentViewRefetchTask !== task) {
                return;
            }

            const taggedPhase = typeof error === "object" && error !== null
                ? (error as { phase?: unknown }).phase
                : undefined;
            const taggedPhaseStartedAt = typeof error === "object" && error !== null
                && typeof (error as { phaseStartedAt?: unknown }).phaseStartedAt === "number"
                ? (error as { phaseStartedAt: number }).phaseStartedAt
                : activePhaseStartedAt;
            const taggedErrorClass = typeof error === "object" && error !== null
                && typeof (error as { errorClass?: unknown }).errorClass === "string"
                ? (error as { errorClass: string }).errorClass
                : undefined;
            const phase = reportedFailurePhase ?? (taggedPhase === "primary-fetch"
                || taggedPhase === "primary-persist"
                ? taggedPhase
                : primaryRefetchReloadCompleted
                    ? "relation-repair"
                    : "primary-fetch");
            if (!reportedFailurePhase) {
                reportPostHistoryManualRepairPhase({
                    phase,
                    startedAt: taggedPhaseStartedAt,
                    error,
                    errorClass: taggedErrorClass,
                });
            }

            if (
                primaryRefetchReloadCompleted
                && !state.searchQuery
                && getShow()
                && getPubkeyHex() === pubkeyHex
                && getRxNostr() === rxNostr
            ) {
                refreshTotalCountFromRepository({ force: true });
            }

            currentViewRefetchTask = null;
            state.currentViewRefetchStatus = "idle";
            state.currentViewRefetchMessageKey = primaryRefetchReloadCompleted
                ? "postHistory.repairNoChanges"
                : "postHistory.repairFetchFailed";
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
        invalidatePendingLoadRequests();
        const generation = coverageGeneration;
        const canApply = () => !isDestroyed && getShow() && getPubkeyHex() === pubkeyHex
            && generation === coverageGeneration;

        postHistoryLightweightSyncCoordinator.cancelOwnerTasks(pubkeyHex);
        const results = await Promise.allSettled([
            postHistoryRepository.deleteLocalHistoryForPubkey(pubkeyHex),
        ]);

        if (results.some((result) => result.status === "rejected")) {
            if (!canApply()) return false;
            if (getShow() && getPubkeyHex() === pubkeyHex) {
                invalidateTotalCountRequest();
                setTotalCountState({
                    known: state.totalCountKnown,
                    status: "failed",
                });
            }
            clearCurrentViewRefetchFeedback();
            state.currentViewRefetchMessageKey = "postHistory.deleteLocalHistoryFailed";
            state.currentViewRefetchMessageValues = null;
            return false;
        }

        clearPersistedPostHistoryViewStateForPubkey(pubkeyHex);
        clearPersistedPostHistoryListingSnapshotForPubkey(pubkeyHex);
        if (!canApply()) return true;
        invalidatePendingLoadRequests();
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
            totalCount: 0,
            totalCountKnown: true,
            totalCountFailed: false,
        });
        return true;
    }

    async function loadNewerSparsePosts(): Promise<boolean> {
        clearContiguousProgress();
        const pubkeyHex = getPubkeyHex();
        const newestCursor = toTimelineCursor(state.loadedPosts[0]);
        if (!pubkeyHex || !newestCursor || typeof state.visibleUntil !== "number") {
            return false;
        }

        const requestId = ++loadRequestId;
        const newerPosts = await postHistoryRepository.getSparseChunk({
            pubkeyHex,
            visibleUntil: state.visibleUntil,
            cursor: newestCursor,
            direction: "newer",
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
        state.loadedPosts = nextPosts;
        await refreshTimelineAvailability(pubkeyHex, nextPosts, requestId);
        return true;
    }

    async function refreshAfterRelayScan(result: PostHistoryFullScanResult): Promise<void> {
        const owner = getPubkeyHex();
        const generation = coverageGeneration;
        let requestId = loadRequestId;
        const current = () => !isDestroyed && getShow() && getPubkeyHex() === owner
            && generation === coverageGeneration && requestId === loadRequestId;
        if (!owner || owner !== result.ownerPubkeyHex || !current()
            || await postHistoryRelayCoverageRepository.getLocalRevision(owner) !== result.localRevision || !current()) return;
        invalidatePendingLoadRequests(); clearContiguousProgress();
        requestId = loadRequestId;
        if (state.searchQuery) {
            await rebuildSearchResultsThroughPage(state.searchPage, state.searchQuery);
            return;
        }
        const posts = state.loadedPosts;
        const records = await Promise.all(posts.map((post) => postHistoryRepository.getByEventId(post.eventId)));
        if (!current() || state.loadedPosts !== posts) return;
        state.loadedPosts = records.flatMap((record) => record?.pubkeyHex === owner ? [record] : []);
        if (!posts.length) { await loadLatestVisiblePosts({ forceTotalCount: true }); return; }
        const visibleUntil = await refreshVisibleUntil(owner);
        if (!current()) return;
        refreshTotalCountFromRepository({ force: true });
        await refreshTimelineAvailability(owner, state.loadedPosts, requestId);
        if (current()) await refreshSavedPostsOutsideVisibleRange(owner, visibleUntil, requestId);
    }

    async function refreshAfterLocalImport(result?: PostHistoryJsonlImportResult): Promise<void> {
        const owner = getPubkeyHex();
        if (!owner || !getShow()) return;
        const generation = coverageGeneration;
        if (result?.localRevision !== undefined
            && await postHistoryRelayCoverageRepository.getLocalRevision(owner) !== result.localRevision) return;
        if (isDestroyed || generation !== coverageGeneration || getPubkeyHex() !== owner || !getShow()) return;
        if (result?.restoredRangeChanged) await readBrowsingContinuity(owner);
        if (isDestroyed || generation !== coverageGeneration || getPubkeyHex() !== owner || !getShow()) return;
        const resumeOpenRefresh = result?.restoredRangeChanged === true && shouldReplanActiveOpenRefresh();
        if (resumeOpenRefresh) { cancelCurrentSync(); state.syncStatus = "idle"; }
        invalidatePendingLoadRequests();
        if (result?.restoredRangeChanged && result.insertedPostCount + result.updatedPostCount + result.appliedDeletionPostCount === 0) {
            await refreshVisibleUntil(owner);
            await refreshTimelineAvailability(owner);
        } else await refreshLocalImportListing();
        if (result?.localRevision !== undefined
            && await postHistoryRelayCoverageRepository.getLocalRevision(owner) !== result.localRevision) return;
        const newest = state.loadedPosts[0]?.createdAt;
        const newestRange = newest === undefined ? undefined : externalContinuity.find((range) => range.since <= newest && range.until >= newest);
        // A slow import can finish after the previous open query timed out.
        // Reconnect a detached head inside the entry window even inside TTL.
        const hasDetachedEntryHead = !isSearchMode && state.listingMode === "contiguous"
            && newest !== undefined && coverageAnchorCreatedAt !== null
            && (!newestRange || newestRange.since > coverageAnchorCreatedAt);
        if (result?.restoredRangeChanged && (resumeOpenRefresh || (hasDetachedEntryHead && openRefreshRequestId === null))
            && !isDestroyed && generation === coverageGeneration && getPubkeyHex() === owner && getShow()) {
            void refreshRecentFromRelaysOnDialogOpen();
        }
    }

    async function refreshLocalImportListing(): Promise<void> {
        clearContiguousProgress();
        if (!getPubkeyHex()) {
            return;
        }

        if (state.searchQuery) {
            await rebuildSearchResultsThroughPage(
                state.searchPage,
                state.searchQuery,
            );
            return;
        }

        if (state.sparseSource === "saved") {
            const pubkeyHex = getPubkeyHex();
            if (!pubkeyHex) return;
            const visibleUntil = await refreshVisibleUntil(pubkeyHex);
            refreshTotalCountFromRepository({ force: true });
            await refreshTimelineAvailability(pubkeyHex);
            await refreshSavedPostsOutsideVisibleRange(pubkeyHex, visibleUntil);
            return;
        }

        await loadLatestVisiblePosts({ forceTotalCount: true });
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

    function startInitialLocalLoad(load: () => Promise<unknown>): void {
        const pubkeyHex = getPubkeyHex();
        const pubkeyKey = resolveListingSnapshotKey(pubkeyHex);
        if (!pubkeyHex || !pubkeyKey) {
            return;
        }

        const generation = ++initialLocalLoadGeneration;
        initialLocalLoadStatus = "loading";
        void load()
            .then(() => {
                if (
                    getShow()
                    && getPubkeyHex() === pubkeyHex
                    && initialLocalLoadKey === pubkeyKey
                    && generation === initialLocalLoadGeneration
                ) {
                    initialLocalLoadStatus = "ready";
                }
            })
            .catch(() => {
                if (
                    getShow()
                    && getPubkeyHex() === pubkeyHex
                    && initialLocalLoadKey === pubkeyKey
                    && generation === initialLocalLoadGeneration
                ) {
                    initialLocalLoadStatus = "failed";
                }
            });
    }

    $effect(() => {
        const key = getPostHistoryAuthoredRelayScopeKey(getRelayConfig());
        const owner = getPubkeyHex();
        const runtime = getRxNostr();
        const localUrl = getLocalBrowsingUrl();
        if (key !== activeCoverageRelayKey || owner !== activeCoverageOwner || runtime !== activeCoverageRuntime) {
            activeCoverageRelayKey = key;
            activeCoverageOwner = owner;
            activeCoverageRuntime = runtime;
            coverageGeneration += 1;
            untrack(() => {
                cancelCurrentSync(); cancelCurrentViewRefetch(); invalidatePendingLoadRequests();
                if (state.syncStatus === "syncing") state.syncStatus = "idle";
            });
        }
        if (!getShow() || !owner) return;
        const generation = coverageGeneration;
        const relays = resolvePostHistoryAuthoredRelayUrls(getRelayConfig());
        // Dexie must retain its observation context across both async reads.
        const subscription = liveQuery(async () => await readContinuityRecords(owner))
            .subscribe({ next: async ([record, restored, beforeRevision, local, url]) => {
                try {
                    const revision = await postHistoryRelayCoverageRepository.getLocalRevision(owner);
                    if (revision !== beforeRevision || revision !== restored.localRevision) return;
                } catch { return; }
                if (isDestroyed || generation !== coverageGeneration || !getShow() || getPubkeyHex() !== owner
                    || url !== localUrl || url !== getLocalBrowsingUrl()) return;
                quorumCoverage = getPostHistoryQuorumCoverage(record.relays, relays);
                restoredRanges = restored.ranges;
                if (observedLocalRevision !== null && observedLocalRevision !== beforeRevision) resetLocalContinuity();
                observedLocalRevision = beforeRevision;
                restoreLocalBrowsingRecord(local);
                // The same boundary check also handles restoration committed by
                // another tab, without restarting a head query for older ranges.
                if (shouldReplanActiveOpenRefresh()) void refreshRecentFromRelaysOnDialogOpen();
                if (coverageAnchorCreatedAt === null) return;
                const next = getPostHistoryConnectedCoverageUntil(browsingContinuity, coverageAnchorCreatedAt);
                if (next === state.visibleUntil) return;
                state.visibleUntil = next; clearContiguousProgress();
                // The active backfill owns availability for the rows it commits.
                // Publishing it against the old rows can remove the bottom
                // controls and clamp scrollTop before that page is appended.
                if (hasCompletedFirstPostPaint) void refreshTimelineAvailability(
                    owner,
                    state.loadedPosts,
                    null,
                    { deferDuringOlderRelayFetch: true },
                );
            }, error: () => { /* A failed read grants no additional coverage. */ } });
        return () => subscription.unsubscribe();
    });

    $effect(() => {
        const nextPubkeyKey = resolveListingSnapshotKey(getPubkeyHex());
        if (nextPubkeyKey === activePubkeyKey) {
            return;
        }

        activePubkeyKey = nextPubkeyKey;
        resetFirstPostPaintState();
        resetLocalContinuity();
        stateOwnerPubkeyKey = null;
        forceLatestInitialLoadKey = nextPubkeyKey;
        cancelCurrentSync();
        cancelCurrentViewRefetch();
        invalidatePendingLoadRequests();
        clearCurrentListingState();
        clearCurrentViewRefetchFeedback();
        clearSyncStatusMessageClearTimeout();
        resetOlderBackfillSearchState();
        relationRepairCoordinator.resetOlderRevealRepairContext();
        hasStartedInitialSync = false;
        forceDialogOpenRefreshAfterLocalPost = false;
        hasAttemptedInitialLocalLoad = false;
        initialLocalLoadKey = null;
        initialLocalLoadGeneration += 1;
        initialLocalLoadStatus = "idle";
    });

    $effect(() => {
        const nextRxNostr = getRxNostr();
        if (nextRxNostr === activeOlderRevealChildInteractionRepairRxNostr) {
            return;
        }

        activeOlderRevealChildInteractionRepairRxNostr = nextRxNostr;
        relationRepairCoordinator.resetOlderRevealRepairContext();
    });

    $effect(() => {
        persistCurrentViewState();
    });

    $effect(() => {
        persistCurrentListingSnapshot();
    });

    $effect(() => {
        if (getSessionOpen()) return;
        untrack(resetState);
    });

    $effect(() => {
        const url = settingsStore.localRelayUrl;
        const runtime = getRxNostr();
        if (!getShow()) return;
        untrack(() => {
            const session = postHistoryLocalRelayService.getSessionGeneration();
            if (url !== previousLocalRelayUrl || runtime !== previousLocalRelayRuntime || session !== previousLocalRelaySession) resetLocalContinuity();
            previousLocalRelayUrl = url;
            previousLocalRelayRuntime = runtime;
            previousLocalRelaySession = session;
            localSessionGeneration = session;
        });
        const unsubscribe = postHistoryLocalRelayService.onSessionInvalidated(() => {
            const hadLocalRead = localBrowsingRevision !== null || currentLocalFetchTask !== null;
            resetLocalContinuity();
            localSessionGeneration = postHistoryLocalRelayService.getSessionGeneration();
            previousLocalRelaySession = localSessionGeneration;
            const owner = getPubkeyHex();
            const generation = coverageGeneration;
            const isActive = () => !isDestroyed && getShow() && coverageGeneration === generation
                && getPubkeyHex() === owner && getRxNostr() === runtime && settingsStore.localRelayUrl === url;
            if (hadLocalRead && isActive() && owner) void refreshVisibleUntil(owner)
                .then(() => { if (isActive()) return refreshTimelineAvailability(owner); }).catch(() => undefined);
        });
        return () => {
            unsubscribe();
            untrack(() => {
                localFetchGeneration++;
                currentLocalFetchTask?.cancel();
                currentLocalFetchTask = null;
                localReadBusy = false;
                if (!getSessionOpen()) resetLocalContinuity();
            });
        };
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
            relationRepairCoordinator.dispose();
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
        if (nextSearchQuery !== state.searchQuery) {
            searchResultStatus = "loading";
        }
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

        if (forceLatestInitialLoadKey === nextInitialLoadKey) {
            forceLatestInitialLoadKey = null;
            startInitialLocalLoad(loadLatestVisiblePosts);
            return;
        }

        const sessionScrollState = getNormalSessionScrollStateForCurrentPubkey();
        const pendingLatestRequest =
            consumePostHistoryShouldReturnToLatestAfterLocalPost(getPubkeyHex());
        if (shouldApplyPendingLatestRequest(pendingLatestRequest, sessionScrollState)) {
            forceDialogOpenRefreshAfterLocalPost = true;
            onSessionScrollStateInvalidated();
            startInitialLocalLoad(loadLatestVisiblePosts);
            return;
        }

        if (canPreserveSessionVisibleWindow(sessionScrollState)) {
            startInitialLocalLoad(() =>
                refreshPreservedVisibleWindow(
                    sessionScrollState,
                    pendingLatestRequest,
                ),
            );
            return;
        }

        if (sessionScrollState) {
            startInitialLocalLoad(() =>
                loadVisibleWindowAroundSessionAnchor(sessionScrollState),
            );
            return;
        }

        startInitialLocalLoad(loadLatestVisiblePosts);
    });

    $effect(() => {
        if (getShow()) {
            return;
        }

        resetFirstPostPaintState();
    });

    $effect(() => {
        if (!getShow()
            || !mediaPrefetchReady
            || firstPaintPubkeyKey !== resolveListingSnapshotKey(getPubkeyHex())) {
            return;
        }

        const currentPosts = posts;
        if (currentPosts.length === 0) {
            return;
        }

        if (!postMediaCacheService.canUsePersistentCache()) {
            return;
        }

        const urls = collectPostHistoryMediaUrls(currentPosts);
        if (urls.length === 0) {
            return;
        }

        const urlsKey = [...urls].sort().join("\u0000");
        if (urlsKey === lastPrefetchedMediaUrlsKey) {
            return;
        }
        lastPrefetchedMediaUrlsKey = urlsKey;

        void Promise.resolve(
            postMediaCacheService.prefetchCachedMediaDescriptors(urls),
        ).catch(() => {
            // Media descriptor prefetch is best-effort and must not block listing updates.
        });
    });

    onDestroy(() => {
        isDestroyed = true;
        resetLocalContinuity();
        coverageGeneration += 1;
        cancelCurrentSync();
        cancelCurrentViewRefetch();
        loadRequestId += 1;
        searchLoadRequestId += 1;
        initialLocalLoadGeneration += 1;
        postHistoryLocalSearchService.clearCache?.();
        initialLocalLoadStatus = "idle";
        firstPaintPubkeyKey = null;
        mediaPrefetchReady = false;
    });

    $effect(() => {
        if (!getShow()) {
            return;
        }

        if (!state.searchQuery) {
            const wasSearchMode = appliedSearchQuery !== "";
            resetFirstPostPaintState();
            searchLoadRequestId += 1;
            isSearchPageLoading = false;
            searchResultStatus = "idle";
            postHistoryLocalSearchService.clearCache?.();
            appliedSearchQuery = "";
            searchResultsInitialized = false;
            if (state.searchPage !== 1) {
                state.searchPage = 1;
                if (wasSearchMode) {
                    const pubkeyHex = getPubkeyHex();
                    if (pubkeyHex) {
                        void waitForFirstPostPaint(
                            pubkeyHex,
                            () => isCurrentPostHistoryLoad(pubkeyHex, loadRequestId),
                            () => state.loadedPosts.length > 0,
                        );
                    }
                }
                return;
            }

            state.searchPosts = [];
            state.searchTotalCount = 0;
            state.searchTotalCountKnown = false;
            state.searchHasNext = false;
            if (wasSearchMode) {
                const pubkeyHex = getPubkeyHex();
                if (pubkeyHex) {
                    void waitForFirstPostPaint(
                        pubkeyHex,
                        () => isCurrentPostHistoryLoad(pubkeyHex, loadRequestId),
                        () => state.loadedPosts.length > 0,
                    );
                }
            }
            return;
        }

        if (state.searchQuery !== appliedSearchQuery) {
            resetFirstPostPaintState();
            if (appliedSearchQuery === "" && state.searchPosts.length === 0) {
                state.searchPosts = state.loadedPosts;
            }
            appliedSearchQuery = state.searchQuery;
            state.searchPage = 1;
            searchResultsInitialized = true;
            void loadSearchPage(1, state.searchQuery);
            return;
        }

        appliedSearchQuery = state.searchQuery;
        if (!searchResultsInitialized) {
            searchResultsInitialized = true;
            const pubkeyHex = getPubkeyHex();
            const query = state.searchQuery;
            const requestId = ++searchLoadRequestId;
            const hasRestoredSearchPosts = state.searchPosts.length > 0;
            if (pubkeyHex && hasRestoredSearchPosts) {
                void waitForFirstPostPaint(
                    pubkeyHex,
                    () => isCurrentSearchLoad(requestId, query, pubkeyHex),
                    () => state.searchPosts.length > 0,
                );
            }
            void rebuildSearchResultsThroughPage(
                state.searchPage,
                query,
                requestId,
            );
        }
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
        get displayTotalCountKnown() {
            return isSearchMode ? state.searchTotalCountKnown : state.totalCountKnown;
        },
        get displayTotalCountStatus(): PostHistoryTotalCountStatus {
            return isSearchMode
                ? state.searchTotalCountKnown
                    ? "ready"
                    : searchResultStatus === "failed" ? "failed" : "loading"
                : state.totalCountStatus;
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
        get showSavedPostsBoundary() {
            return showSavedPostsBoundary;
        },
        get isShowingSavedOlderPosts() {
            return state.listingMode === "sparse" && state.sparseSource === "saved";
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
        get isSearchPageLoading() {
            return isSearchPageLoading;
        },
        get searchResultStatus() {
            return searchResultStatus;
        },
        get initialLocalLoadStatus() {
            return initialLocalLoadStatus;
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
        prepareForClose,
        suspend,
        cancelCurrentSync,
        cancelCurrentViewRefetch,
        loadOlder,
        loadNewer,
        returnToLatest,
        showSavedOlderPosts,
        jumpToOldest,
        jumpToCreatedAt,
        jumpToEventId,
        fetchOlderFromRelays,
        goFirstPage,
        goPreviousPage,
        goToNextPage,
        goToLastPage,
        refetchAroundCurrentView,
        resetSearchState,
        refreshAfterLocalImport,
        refreshAfterRelayScan,
        deleteLocalHistory,
        patchDeletedPost,
    };
}
