import { beforeEach, describe, expect, it, vi } from 'vitest';

const repositoryMocks = vi.hoisted(() => ({
    hasOlderVisiblePosts: vi.fn(),
    countVisibleForPubkey: vi.fn(),
    countForPubkey: vi.fn(),
    getOldestCreatedAt: vi.fn(),
}));
const fetchLatest = vi.hoisted(() => vi.fn());
const persistPostHistoryAuthoredFetch = vi.hoisted(() => vi.fn());

vi.mock('../../lib/storage/postHistoryRepository', () => ({
    postHistoryRepository: repositoryMocks,
}));

vi.mock('../../lib/postHistoryRelayFetchService', async (importOriginal) => ({
    ...(await importOriginal<typeof import('../../lib/postHistoryRelayFetchService')>()),
    postHistoryRelayFetchService: { fetchLatest },
}));

vi.mock('../../lib/postHistoryAuthoredFetchPersistence', () => ({
    persistPostHistoryAuthoredFetch,
}));

import type { RxNostr } from 'rx-nostr';
import { POST_HISTORY_OLDER_BACKFILL_INITIAL_WINDOW_SECONDS } from '../../lib/postHistoryListingOlderBackfill';
import {
    createPostHistoryListingOlderBackfillController,
    type PostHistoryListingOlderBackfillControllerDeps,
    type PostHistoryListingOlderBackfillState,
} from '../../lib/postHistoryListingOlderBackfillController';
import type { PostHistoryRelayFetchResult } from '../../lib/postHistoryRelayFetchService';

const OWNER = 'a'.repeat(64);
const RX_NOSTR = {} as RxNostr;
const REQUEST_ID = 7;

function createState(): PostHistoryListingOlderBackfillState {
    return {
        listingMode: 'contiguous',
        loadedPosts: [],
        visibleUntil: 1000,
        hasJumpCacheAnchors: false,
        searchQuery: '',
        searchPage: 1,
        sparseSource: null,
        // Stops the automatic retry for a small batch after one attempt.
        hasOlderLocal: true,
        latestOlderBackfillUiResult: null,
        nextUntil: 1000,
        hasMoreRemote: true,
    };
}

function createDeps() {
    const deps = {
        state: createState(),
        olderBackfillSearch: {
            windowSeconds: POST_HISTORY_OLDER_BACKFILL_INITIAL_WINDOW_SECONDS,
            nextUntil: null,
            consecutiveEmptyCount: 0,
            lastRange: null,
            continuationSince: null,
            exhausted: false,
        },
        pageSize: 10,
        maxVisiblePosts: 30,
        getRelayConfig: () => null,
        createAuthoredScope: vi.fn(async () => ({ isActive: () => true })),
        fetchSlot: {
            get: vi.fn(),
            set: vi.fn(),
        },
        coverage: {
            readExternalVisibleUntil: vi.fn(async () => 1000 as number | null),
            readExternalContinuity: vi.fn(async () => [{ since: 1000, until: 2000 }]),
            updateVisibleUntilFromFetch: vi.fn(async () => 900 as number | null),
            hasLocalBrowsingRanges: () => false,
            isSparseListingContext: () => false,
            getVisibleOldestCreatedAt: () => null,
        },
        contiguousProgress: {
            clear: vi.fn(),
            reconcileAfterDatabaseChange: vi.fn(async () => true),
        },
        reveal: {
            getLoadRequestId: () => 1,
            commitViewport: vi.fn((apply: () => Promise<void>) => apply()),
            loadOlderVisiblePosts: vi.fn(async () => true),
            loadOlderSavedPosts: vi.fn(async () => true),
            loadOlderSparsePosts: vi.fn(async () => true),
            rebuildSearchResultsThroughPage: vi.fn(async () => undefined),
            refreshTotalCount: vi.fn(),
            refreshTimelineAvailability: vi.fn(async () => undefined),
            refreshSavedPostsOutsideVisibleRange: vi.fn(async () => undefined),
        },
    };
    return deps satisfies Omit<PostHistoryListingOlderBackfillControllerDeps, 'createAuthoredScope'>;
}

function asControllerDeps(
    deps: ReturnType<typeof createDeps>,
): PostHistoryListingOlderBackfillControllerDeps {
    return deps as unknown as PostHistoryListingOlderBackfillControllerDeps;
}

function fetchResult(eventCount: number): PostHistoryRelayFetchResult {
    return {
        status: 'success',
        events: Array.from({ length: eventCount }, (_, index) => ({
            event: { id: `event-${index}`, created_at: 950 - index },
        })),
        rawCount: eventCount,
        uniqueCount: eventCount,
        perRelayCounts: [],
        hasMore: false,
        nextUntil: null,
    } as unknown as PostHistoryRelayFetchResult;
}

describe('createPostHistoryListingOlderBackfillController', () => {
    beforeEach(() => {
        vi.spyOn(console, 'debug').mockImplementation(() => undefined);
        for (const mock of Object.values(repositoryMocks)) mock.mockReset();
        fetchLatest.mockReset();
        persistPostHistoryAuthoredFetch.mockReset();
        repositoryMocks.hasOlderVisiblePosts.mockResolvedValue(false);
    });

    it('取得済みの範囲が先頭まで届いていれば、リレーへ問い合わせずにカーソルを閉じる', async () => {
        const deps = createDeps();
        deps.coverage.readExternalContinuity.mockResolvedValue([{ since: 0, until: 2000 }]);
        const onCompleted = vi.fn();
        const controller = createPostHistoryListingOlderBackfillController(asControllerDeps(deps));

        await expect(controller.fetchOlderFromRelaysForRequest(
            OWNER, RX_NOSTR, REQUEST_ID, () => true, {}, onCompleted,
        )).resolves.toBe(false);

        expect(fetchLatest).not.toHaveBeenCalled();
        expect(deps.olderBackfillSearch.exhausted).toBe(true);
        expect(deps.state.nextUntil).toBeNull();
        expect(deps.state.hasMoreRemote).toBe(false);
        expect(onCompleted).not.toHaveBeenCalled();
    });

    it('未取得の範囲を取得して保存し、増えた投稿を一覧へ反映する', async () => {
        const deps = createDeps();
        const result = fetchResult(1);
        const task = { promise: Promise.resolve(result), cancel: vi.fn() };
        fetchLatest.mockReturnValue(task);
        deps.fetchSlot.get.mockReturnValue(task);
        deps.coverage.readExternalVisibleUntil
            .mockResolvedValueOnce(1000)
            .mockResolvedValueOnce(1000)
            .mockResolvedValueOnce(1000)
            .mockResolvedValue(900);
        repositoryMocks.countVisibleForPubkey
            .mockResolvedValueOnce(5)
            .mockResolvedValueOnce(6);
        persistPostHistoryAuthoredFetch.mockResolvedValue({
            applied: true,
            insertedCount: 1,
            updatedCount: 0,
            unchangedCount: 0,
            appliedDeletionCount: 0,
        });
        const onCompleted = vi.fn();
        const controller = createPostHistoryListingOlderBackfillController(asControllerDeps(deps));

        await expect(controller.fetchOlderFromRelaysForRequest(
            OWNER, RX_NOSTR, REQUEST_ID, () => true, { anchorEventId: 'anchor' }, onCompleted,
        )).resolves.toBe(true);

        expect(fetchLatest).toHaveBeenCalledOnce();
        expect(fetchLatest.mock.calls[0][1]).toMatchObject({
            pubkeyHex: OWNER,
            reason: 'older-backfill',
            since: Math.max(0, 999 - POST_HISTORY_OLDER_BACKFILL_INITIAL_WINDOW_SECONDS),
            until: 999,
        });
        expect(deps.fetchSlot.set.mock.calls).toEqual([[task], [null]]);
        expect(repositoryMocks.countVisibleForPubkey.mock.calls).toEqual([
            [OWNER, 1000],
            [OWNER, 900],
        ]);
        expect(deps.contiguousProgress.reconcileAfterDatabaseChange).toHaveBeenCalledWith(
            OWNER, 900, { preserveReachedVisibleCount: true },
        );
        expect(deps.reveal.refreshSavedPostsOutsideVisibleRange).toHaveBeenCalledWith(
            OWNER, 900, null, REQUEST_ID,
        );
        expect(deps.reveal.refreshTotalCount).toHaveBeenCalledWith({ force: true });
        expect(deps.reveal.loadOlderVisiblePosts).toHaveBeenCalledWith(expect.objectContaining({
            anchorEventId: 'anchor',
            reason: 'normal-older-reveal',
            useContiguousProgress: false,
            preserveContiguousProgressAfterDatabaseChange: true,
        }));
        expect(deps.reveal.refreshTimelineAvailability).not.toHaveBeenCalled();
        expect(deps.state.nextUntil).toBe(900);
        expect(deps.state.hasMoreRemote).toBe(true);
        expect(deps.state.latestOlderBackfillUiResult).toMatchObject({
            changed: true,
            attemptIndex: 1,
            clickStartVisibleCount: 5,
            currentVisibleCount: 6,
            totalVisibleAdded: 1,
        });
        expect(onCompleted).toHaveBeenCalledExactlyOnceWith(true);
    });

    it('取得中に要求が古くなったら、結果を保存も反映もしない', async () => {
        const deps = createDeps();
        let active = true;
        let task: { promise: Promise<PostHistoryRelayFetchResult>; cancel: () => void } | null = null;
        fetchLatest.mockImplementation(() => {
            task = {
                promise: Promise.resolve().then(() => {
                    active = false;
                    return fetchResult(1);
                }),
                cancel: vi.fn(),
            };
            return task;
        });
        deps.fetchSlot.get.mockImplementation(() => task);
        repositoryMocks.countVisibleForPubkey.mockResolvedValue(5);
        const onCompleted = vi.fn();
        const controller = createPostHistoryListingOlderBackfillController(asControllerDeps(deps));

        await expect(controller.fetchOlderFromRelaysForRequest(
            OWNER, RX_NOSTR, REQUEST_ID, () => active, {}, onCompleted,
        )).resolves.toBe(false);

        expect(deps.fetchSlot.set.mock.calls).toEqual([[task]]);
        expect(persistPostHistoryAuthoredFetch).not.toHaveBeenCalled();
        expect(deps.reveal.commitViewport).not.toHaveBeenCalled();
        expect(deps.reveal.loadOlderVisiblePosts).not.toHaveBeenCalled();
        expect(deps.state.latestOlderBackfillUiResult).toBeNull();
        expect(deps.state.nextUntil).toBe(1000);
        expect(onCompleted).not.toHaveBeenCalled();
    });
});
