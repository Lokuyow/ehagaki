import type { RxNostr } from "rx-nostr";
import type { PostHistorySyncStatus } from "./hooks/usePostHistoryListing.svelte";
import {
    persistPostHistoryAuthoredFetch,
    type createPostHistoryAuthoredFetchScope,
} from "./postHistoryAuthoredFetchPersistence";
import type { PostHistoryLightweightAuthoredSyncTask } from "./postHistoryLightweightSyncCoordinator";
import {
    postHistoryRelayFetchService,
    type PostHistoryRelayFetchTask,
} from "./postHistoryRelayFetchService";
import type { PostHistoryCurrentViewRelationRepairRequest } from "./postHistoryVisibleRangeRelationRepairCoordinator";
import { ehagakiDb, type PostHistoryRecord } from "./storage/ehagakiDb";
import { postHistoryJumpCacheAnchorRepository } from "./storage/postHistoryJumpCacheAnchorRepository";
import { getPostHistoryLocalRevision } from "./storage/postHistoryLocalWriteScope";
import { postHistoryRepository } from "./storage/postHistoryRepository";
import type { RelayConfig } from "./types";

const POST_HISTORY_JUMP_FETCH_RADIUS_SECONDS = 3 * 24 * 60 * 60;
const POST_HISTORY_JUMP_FETCH_LIMIT = 100;

type PostHistoryListingFetchTask =
    | PostHistoryRelayFetchTask
    | PostHistoryLightweightAuthoredSyncTask;

/** A date chunk misses its target when it is empty or starts after it. */
export function didDateChunkMissTarget(
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

/** The slice of the listing hook's reactive state that jumps read and write. */
export interface PostHistoryListingJumpState {
    listingMode: "contiguous" | "sparse";
    sparseSource: "jump" | "saved" | null;
    loadedPosts: PostHistoryRecord[];
    hasOlderLocal: boolean;
    hasNewerLocal: boolean;
    hasJumpCacheAnchors: boolean;
    syncStatus: PostHistorySyncStatus;
}

export interface PostHistoryListingJumpControllerDeps {
    state: PostHistoryListingJumpState;
    pageSize: number;
    maxVisiblePosts: number;
    getShow: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    getRxNostr: () => RxNostr | undefined;
    getRelayConfig: () => RelayConfig | null | undefined;
    /** The local load generation shared with the hook's other loads. */
    getLoadRequestId: () => number;
    /** Start a new local load generation and return it. */
    beginLoadRequest: () => number;
    /** Start a new relay fetch generation and return it. */
    beginFetchRequest: () => number;
    isCurrentFetchRequest: (requestId: number) => boolean;
    /** The external fetch slot is shared with the hook's other relay fetches. */
    getCurrentFetchTask: () => PostHistoryListingFetchTask | null;
    setCurrentFetchTask: (task: PostHistoryListingFetchTask | null) => void;
    cancelCurrentSync: () => void;
    clearContiguousProgress: () => void;
    refreshVisibleUntil: (
        pubkeyHex: string,
        expectedRequestId?: number | null,
    ) => Promise<number | null>;
    createAuthoredScope: (
        pubkeyHex: string,
        rxNostr: RxNostr,
        requestId: number,
    ) => ReturnType<typeof createPostHistoryAuthoredFetchScope>;
    refreshTotalCount: (options?: { force?: boolean }) => void;
    resetOlderBackfillSearchState: () => void;
    refreshTimelineAvailability: (
        pubkeyHex: string,
        currentPosts: PostHistoryRecord[],
        expectedRequestId: number | null,
    ) => Promise<void>;
    repairJump: (request: PostHistoryCurrentViewRelationRepairRequest) => Promise<void>;
}

/**
 * Jumps to a date or an event in the post history listing. The hook owns the
 * reactive state and the request generations; this controller only runs the
 * jump flows against them.
 */
export function createPostHistoryListingJumpController(
    deps: PostHistoryListingJumpControllerDeps,
) {
    const { state, pageSize, maxVisiblePosts, getShow, getPubkeyHex, getRxNostr, getRelayConfig } = deps;

    async function jumpToCreatedAt(createdAt: number): Promise<boolean> {
        deps.clearContiguousProgress();
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex) {
            return false;
        }

        const requestId = deps.beginLoadRequest();
        const visibleUntil = await deps.refreshVisibleUntil(pubkeyHex);
        const contiguousDatePosts = await postHistoryRepository.getVisibleChunkFromCreatedAt({
                pubkeyHex,
                visibleUntil,
                createdAt,
                limit: pageSize,
            });

        if (!getShow() || requestId !== deps.getLoadRequestId()) {
            return false;
        }

        if (contiguousDatePosts.length === 0) {
            deps.refreshTotalCount();
            state.loadedPosts = [];
            state.hasOlderLocal = false;
            state.hasNewerLocal = false;
            return false;
        }

        if (!didDateChunkMissTarget(contiguousDatePosts, createdAt)) {
            deps.refreshTotalCount();
            state.listingMode = "contiguous";
            state.sparseSource = null;
            state.loadedPosts = contiguousDatePosts;
            deps.resetOlderBackfillSearchState();
            await deps.refreshTimelineAvailability(pubkeyHex, contiguousDatePosts, requestId);
            return true;
        }

        if (createdAt <= 0) {
            deps.refreshTotalCount();
            state.listingMode = "contiguous";
            state.sparseSource = null;
            state.loadedPosts = contiguousDatePosts;
            deps.resetOlderBackfillSearchState();
            await deps.refreshTimelineAvailability(pubkeyHex, contiguousDatePosts, requestId);
            return true;
        }

        const hasNearbyJumpCacheAnchor =
            await postHistoryJumpCacheAnchorRepository.hasNearbyAnchorForPubkey({
                pubkeyHex,
                targetCreatedAt: createdAt,
            });
        if (!getShow() || requestId !== deps.getLoadRequestId()) {
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

            if (!getShow() || requestId !== deps.getLoadRequestId()) {
                return false;
            }

            if (!didDateChunkMissTarget(sparseDatePosts, createdAt)) {
                deps.refreshTotalCount();
                state.listingMode = "sparse";
                state.sparseSource = "jump";
                state.loadedPosts = sparseDatePosts;
                deps.resetOlderBackfillSearchState();
                await deps.refreshTimelineAvailability(pubkeyHex, sparseDatePosts, requestId);
                return true;
            }
        }

        const rxNostr = getRxNostr();
        if (!rxNostr) {
            deps.refreshTotalCount();
            state.listingMode = "contiguous";
            state.sparseSource = null;
            state.loadedPosts = contiguousDatePosts;
            deps.resetOlderBackfillSearchState();
            await deps.refreshTimelineAvailability(pubkeyHex, contiguousDatePosts, requestId);
            return true;
        }

        deps.cancelCurrentSync();
        const syncRequestId = deps.beginFetchRequest();
        state.syncStatus = "syncing";

        const repairSince = Math.max(
            0,
            createdAt - POST_HISTORY_JUMP_FETCH_RADIUS_SECONDS,
        );
        const repairUntil = createdAt;

        const expectedJumpRevision = await getPostHistoryLocalRevision(ehagakiDb, pubkeyHex);
        const authoredScope = await deps.createAuthoredScope(pubkeyHex, rxNostr, syncRequestId);
        if (!authoredScope.isActive()) return false;
        const task = postHistoryRelayFetchService.fetchLatest(rxNostr, {
            pubkeyHex,
            relayConfig: getRelayConfig(),
            reason: "repair-visible-range",
            limit: POST_HISTORY_JUMP_FETCH_LIMIT,
            since: repairSince,
            until: repairUntil,
        });
        deps.setCurrentFetchTask(task);
        const relayResult = await task.promise;
        if (!deps.isCurrentFetchRequest(syncRequestId) || deps.getCurrentFetchTask() !== task) {
            return false;
        }

        deps.setCurrentFetchTask(null);
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

        if (!getShow() || requestId !== deps.getLoadRequestId()) {
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

        if (!getShow() || requestId !== deps.getLoadRequestId()) {
            state.syncStatus = "idle";
            return false;
        }

        state.syncStatus = "idle";
        if (didDateChunkMissTarget(sparseDatePosts, createdAt)) {
            return false;
        }

        deps.refreshTotalCount({ force: relayResult.events.length > 0 });
        state.listingMode = "sparse";
        state.sparseSource = "jump";
        state.loadedPosts = sparseDatePosts;
        deps.resetOlderBackfillSearchState();
        await deps.refreshTimelineAvailability(pubkeyHex, sparseDatePosts, requestId);
        void deps.repairJump({
            ownerPubkeyHex: pubkeyHex,
            rxNostr,
            visiblePosts: sparseDatePosts,
            isActive: () => (
                getShow()
                && getPubkeyHex() === pubkeyHex
                && getRxNostr() === rxNostr
                && requestId === deps.getLoadRequestId()
            ),
        }).catch(() => undefined);
        return true;
    }

    async function jumpToEventId(eventId: string): Promise<boolean> {
        deps.clearContiguousProgress();
        const pubkeyHex = getPubkeyHex();
        if (!pubkeyHex || !eventId) {
            return false;
        }

        const requestId = deps.beginLoadRequest();
        const visibleUntil = await deps.refreshVisibleUntil(pubkeyHex, requestId);
        const getPostsAroundEvent = (range: number | null) =>
            postHistoryRepository.getVisibleChunkAroundEventId({
                pubkeyHex,
                visibleUntil: range,
                eventId,
                limit: maxVisiblePosts,
                keepAbove: pageSize,
            });

        let targetPosts = await getPostsAroundEvent(visibleUntil);
        if (!getShow() || requestId !== deps.getLoadRequestId()) {
            return false;
        }

        const targetWasInVisibleRange = targetPosts.some(
            (post) => post.eventId === eventId,
        );
        let isSparseJump = false;
        if (!targetWasInVisibleRange && typeof visibleUntil === "number") {
            targetPosts = await getPostsAroundEvent(null);
            isSparseJump = true;
            if (!getShow() || requestId !== deps.getLoadRequestId()) {
                return false;
            }
        }

        if (!targetPosts.some((post) => post.eventId === eventId)) {
            return false;
        }

        deps.refreshTotalCount();
        state.listingMode = isSparseJump ? "sparse" : "contiguous";
        state.sparseSource = isSparseJump ? "jump" : null;
        state.loadedPosts = targetPosts;
        state.hasOlderLocal = false;
        state.hasNewerLocal = false;
        deps.resetOlderBackfillSearchState();
        void deps.refreshTimelineAvailability(pubkeyHex, targetPosts, requestId)
            .catch(() => undefined);
        return true;
    }

    return { jumpToCreatedAt, jumpToEventId };
}
