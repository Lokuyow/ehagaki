import { beforeEach, describe, expect, it, vi } from 'vitest';

const repositoryMocks = vi.hoisted(() => ({
    getVisibleChunkFromCreatedAt: vi.fn(),
    getVisibleChunkAroundEventId: vi.fn(),
}));

vi.mock('../../lib/storage/postHistoryRepository', () => ({
    postHistoryRepository: repositoryMocks,
}));

import {
    createPostHistoryListingJumpController,
    didDateChunkMissTarget,
    type PostHistoryListingJumpControllerDeps,
    type PostHistoryListingJumpState,
} from '../../lib/postHistoryListingJumpController';
import type { PostHistoryRecord } from '../../lib/storage/ehagakiDb';

const OWNER = 'a'.repeat(64);

function post(eventId: string, createdAt: number): PostHistoryRecord {
    return { eventId, createdAt } as PostHistoryRecord;
}

function createState(): PostHistoryListingJumpState {
    return {
        listingMode: 'contiguous',
        sparseSource: null,
        loadedPosts: [],
        hasOlderLocal: true,
        hasNewerLocal: true,
        hasJumpCacheAnchors: false,
        syncStatus: 'idle',
    };
}

function createDeps(overrides: Partial<PostHistoryListingJumpControllerDeps> = {}) {
    let loadRequestId = 0;
    const deps: PostHistoryListingJumpControllerDeps = {
        state: createState(),
        pageSize: 10,
        maxVisiblePosts: 30,
        getShow: () => true,
        getPubkeyHex: () => OWNER,
        getRxNostr: () => undefined,
        getRelayConfig: () => null,
        getLoadRequestId: () => loadRequestId,
        beginLoadRequest: () => ++loadRequestId,
        beginFetchRequest: vi.fn(() => 1),
        isCurrentFetchRequest: () => true,
        getCurrentFetchTask: () => null,
        setCurrentFetchTask: vi.fn(),
        cancelCurrentSync: vi.fn(),
        clearContiguousProgress: vi.fn(),
        refreshVisibleUntil: vi.fn(async () => 500),
        createAuthoredScope: vi.fn(),
        refreshTotalCount: vi.fn(),
        resetOlderBackfillSearchState: vi.fn(),
        refreshTimelineAvailability: vi.fn(async () => undefined),
        repairJump: vi.fn(async () => undefined),
        ...overrides,
    };
    return {
        deps,
        bumpLoadRequest: () => {
            loadRequestId += 1;
        },
    };
}

describe('didDateChunkMissTarget', () => {
    it('空のチャンクや、最も古い投稿が目標より新しいチャンクは目標を外している', () => {
        expect(didDateChunkMissTarget([], 100)).toBe(true);
        expect(didDateChunkMissTarget([post('b', 300), post('a', 150)], 100)).toBe(true);
        expect(didDateChunkMissTarget([post('b', 300), post('a', Number.NaN)], 100)).toBe(true);
    });

    it('最も古い投稿が目標以前なら目標を含んでいる', () => {
        expect(didDateChunkMissTarget([post('b', 300), post('a', 100)], 100)).toBe(false);
        expect(didDateChunkMissTarget([post('a', 50)], 100)).toBe(false);
    });
});

describe('createPostHistoryListingJumpController', () => {
    beforeEach(() => {
        repositoryMocks.getVisibleChunkFromCreatedAt.mockReset();
        repositoryMocks.getVisibleChunkAroundEventId.mockReset();
    });

    it('日付が表示範囲内にあれば連続表示のまま一覧を差し替える', async () => {
        const posts = [post('b', 300), post('a', 100)];
        repositoryMocks.getVisibleChunkFromCreatedAt.mockResolvedValue(posts);
        const { deps } = createDeps();
        const controller = createPostHistoryListingJumpController(deps);

        await expect(controller.jumpToCreatedAt(200)).resolves.toBe(true);

        expect(deps.state.listingMode).toBe('contiguous');
        expect(deps.state.sparseSource).toBeNull();
        expect(deps.state.loadedPosts).toBe(posts);
        expect(deps.clearContiguousProgress).toHaveBeenCalledOnce();
        expect(deps.resetOlderBackfillSearchState).toHaveBeenCalledOnce();
        expect(deps.refreshTimelineAvailability).toHaveBeenCalledWith(OWNER, posts, 1);
    });

    it('読み込み中に別の読み込みが始まったら、日付ジャンプの結果を反映しない', async () => {
        const { deps, bumpLoadRequest } = createDeps();
        repositoryMocks.getVisibleChunkFromCreatedAt.mockImplementation(async () => {
            bumpLoadRequest();
            return [post('a', 100)];
        });
        const controller = createPostHistoryListingJumpController(deps);

        await expect(controller.jumpToCreatedAt(200)).resolves.toBe(false);

        expect(deps.state.loadedPosts).toEqual([]);
        expect(deps.refreshTotalCount).not.toHaveBeenCalled();
    });

    it('リレーが使えず日付が範囲外なら、取得した連続チャンクを表示する', async () => {
        const posts = [post('b', 300), post('a', 250)];
        repositoryMocks.getVisibleChunkFromCreatedAt.mockResolvedValue(posts);
        const { deps } = createDeps();
        const controller = createPostHistoryListingJumpController(deps);

        await expect(controller.jumpToCreatedAt(0)).resolves.toBe(true);

        expect(deps.state.listingMode).toBe('contiguous');
        expect(deps.state.loadedPosts).toBe(posts);
        expect(deps.beginFetchRequest).not.toHaveBeenCalled();
    });

    it('表示範囲外のイベントへは、範囲を外して探し直し sparse 表示にする', async () => {
        const target = post('target', 10);
        repositoryMocks.getVisibleChunkAroundEventId
            .mockResolvedValueOnce([post('other', 600)])
            .mockResolvedValueOnce([target]);
        const { deps } = createDeps();
        const controller = createPostHistoryListingJumpController(deps);

        await expect(controller.jumpToEventId('target')).resolves.toBe(true);

        expect(repositoryMocks.getVisibleChunkAroundEventId).toHaveBeenNthCalledWith(1, expect.objectContaining({
            visibleUntil: 500,
            eventId: 'target',
            limit: 30,
            keepAbove: 10,
        }));
        expect(repositoryMocks.getVisibleChunkAroundEventId).toHaveBeenNthCalledWith(2, expect.objectContaining({
            visibleUntil: null,
        }));
        expect(deps.refreshVisibleUntil).toHaveBeenCalledWith(OWNER, 1);
        expect(deps.state.listingMode).toBe('sparse');
        expect(deps.state.sparseSource).toBe('jump');
        expect(deps.state.loadedPosts).toEqual([target]);
        expect(deps.state.hasOlderLocal).toBe(false);
        expect(deps.state.hasNewerLocal).toBe(false);
    });

    it('イベントが見つからなければ一覧を変えない', async () => {
        repositoryMocks.getVisibleChunkAroundEventId.mockResolvedValue([]);
        const { deps } = createDeps({ refreshVisibleUntil: vi.fn(async () => null) });
        const controller = createPostHistoryListingJumpController(deps);

        await expect(controller.jumpToEventId('missing')).resolves.toBe(false);

        expect(repositoryMocks.getVisibleChunkAroundEventId).toHaveBeenCalledTimes(1);
        expect(deps.state.hasOlderLocal).toBe(true);
        expect(deps.refreshTotalCount).not.toHaveBeenCalled();
    });
});
