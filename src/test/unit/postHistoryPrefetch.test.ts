import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST_HISTORY_PAGE_SIZE } from '../../lib/postHistoryRelayFetchService';
import {
    prefetchLatestPostHistoryDescriptors,
    schedulePostHistoryWarmupOnIdle,
} from '../../lib/postHistoryPrefetch';

function buildPost(urls: string[]) {
    return {
        media: urls.map((url) => ({ url })),
    };
}

function buildWarmupResult(overrides: Record<string, unknown> = {}) {
    return {
        status: 'prefetched' as const,
        urlCount: 2,
        latestPosts: [],
        visibleUntil: null,
        hasJumpCacheAnchors: false,
        ...overrides,
    };
}

describe('postHistoryPrefetch', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('最新ページ 1 回分だけ media descriptor を prefetch する', async () => {
        const repository = {
            getLatestVisibleChunk: vi.fn().mockResolvedValue([
                buildPost([
                    'https://example.com/a.webp#fragment',
                    'https://example.com/a.webp',
                    'https://example.com/b.webp',
                ]),
            ]),
        };
        const mediaCacheService = {
            canUsePersistentCache: vi.fn(() => true),
            prefetchCachedMediaDescriptors: vi.fn().mockResolvedValue(undefined),
        };
        const visibleRangeRepository = {
            get: vi.fn().mockResolvedValue({ visibleUntil: 123 }),
        };
        const jumpCacheAnchorRepository = {
            getForPubkey: vi.fn().mockResolvedValue([]),
        };

        const result = await prefetchLatestPostHistoryDescriptors({
            pubkeyHex: 'pubkey-1',
            postHistoryRepository: repository,
            postHistoryVisibleRangeRepository: visibleRangeRepository,
            postHistoryJumpCacheAnchorRepository: jumpCacheAnchorRepository,
            postMediaCacheService: mediaCacheService,
        });

        expect(repository.getLatestVisibleChunk).toHaveBeenCalledWith({
            pubkeyHex: 'pubkey-1',
            limit: POST_HISTORY_PAGE_SIZE,
            visibleUntil: 123,
        });
        expect(mediaCacheService.prefetchCachedMediaDescriptors).toHaveBeenCalledWith([
            'https://example.com/a.webp#fragment',
            'https://example.com/b.webp',
        ]);
        expect(result).toMatchObject(buildWarmupResult({
            latestPosts: expect.any(Array),
            visibleUntil: 123,
        }));
    });

    it('persistent cache を使えないときもローカル最新ページは warmup する', async () => {
        const repository = {
            getLatestVisibleChunk: vi.fn().mockResolvedValue([]),
        };
        const mediaCacheService = {
            canUsePersistentCache: vi.fn(() => false),
            prefetchCachedMediaDescriptors: vi.fn(),
        };

        const result = await prefetchLatestPostHistoryDescriptors({
            pubkeyHex: 'pubkey-1',
            postHistoryRepository: repository,
            postMediaCacheService: mediaCacheService,
        });

        expect(repository.getLatestVisibleChunk).toHaveBeenCalledOnce();
        expect(mediaCacheService.prefetchCachedMediaDescriptors).not.toHaveBeenCalled();
        expect(result).toMatchObject({ status: 'empty', urlCount: 0 });
    });

    it('latest page に media がなければ empty を返す', async () => {
        const repository = {
            getLatestVisibleChunk: vi.fn().mockResolvedValue([buildPost([])]),
        };
        const mediaCacheService = {
            canUsePersistentCache: vi.fn(() => true),
            prefetchCachedMediaDescriptors: vi.fn(),
        };

        const result = await prefetchLatestPostHistoryDescriptors({
            pubkeyHex: 'pubkey-1',
            postHistoryRepository: repository,
            postMediaCacheService: mediaCacheService,
        });

        expect(mediaCacheService.prefetchCachedMediaDescriptors).not.toHaveBeenCalled();
        expect(result).toMatchObject({ status: 'empty', urlCount: 0 });
    });

    it('repository 読み込み失敗は failed に落として UI を止めない', async () => {
        const repository = {
            getLatestVisibleChunk: vi.fn().mockRejectedValue(new Error('db error')),
        };
        const mediaCacheService = {
            canUsePersistentCache: vi.fn(() => true),
            prefetchCachedMediaDescriptors: vi.fn(),
        };

        const result = await prefetchLatestPostHistoryDescriptors({
            pubkeyHex: 'pubkey-1',
            postHistoryRepository: repository,
            postMediaCacheService: mediaCacheService,
        });

        expect(result).toMatchObject({ status: 'failed', urlCount: 0 });
    });

    it('requestIdleCallback があれば idle で warmup を開始できる', () => {
        const callbackRef: { current: (() => void) | null } = { current: null };
        const requestIdleCallback = vi.fn((callback: () => void) => {
            callbackRef.current = callback;
            return 17;
        });
        const cancelIdleCallback = vi.fn();
        const task = vi.fn();

        const scheduled = schedulePostHistoryWarmupOnIdle(task, {
            windowObj: {
                requestIdleCallback,
                cancelIdleCallback,
            },
        });

        expect(requestIdleCallback).toHaveBeenCalledOnce();
        callbackRef.current?.();

        expect(task).toHaveBeenCalledOnce();

        scheduled.cancel();
        expect(cancelIdleCallback).toHaveBeenCalledWith(17);
    });

    it('requestIdleCallback がなくても setTimeout fallback で warmup する', () => {
        vi.useFakeTimers();
        const task = vi.fn();

        schedulePostHistoryWarmupOnIdle(task, {
            windowObj: {},
        });

        vi.runAllTimers();

        expect(task).toHaveBeenCalledOnce();
    });
});
