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

describe('postHistoryPrefetch', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('最新ページ 1 回分だけ media descriptor を prefetch する', async () => {
        const repository = {
            getPage: vi.fn().mockResolvedValue([
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

        const result = await prefetchLatestPostHistoryDescriptors({
            pubkeyHex: 'pubkey-1',
            postHistoryRepository: repository,
            postMediaCacheService: mediaCacheService,
        });

        expect(repository.getPage).toHaveBeenCalledWith({
            pubkeyHex: 'pubkey-1',
            page: 1,
            pageSize: POST_HISTORY_PAGE_SIZE,
        });
        expect(mediaCacheService.prefetchCachedMediaDescriptors).toHaveBeenCalledWith([
            'https://example.com/a.webp#fragment',
            'https://example.com/b.webp',
        ]);
        expect(result).toEqual({ status: 'prefetched', urlCount: 2 });
    });

    it('persistent cache を使えないときは skip する', async () => {
        const repository = {
            getPage: vi.fn(),
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

        expect(repository.getPage).not.toHaveBeenCalled();
        expect(mediaCacheService.prefetchCachedMediaDescriptors).not.toHaveBeenCalled();
        expect(result).toEqual({ status: 'skipped', urlCount: 0 });
    });

    it('latest page に media がなければ empty を返す', async () => {
        const repository = {
            getPage: vi.fn().mockResolvedValue([buildPost([])]),
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
        expect(result).toEqual({ status: 'empty', urlCount: 0 });
    });

    it('repository 読み込み失敗は failed に落として UI を止めない', async () => {
        const repository = {
            getPage: vi.fn().mockRejectedValue(new Error('db error')),
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

        expect(result).toEqual({ status: 'failed', urlCount: 0 });
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