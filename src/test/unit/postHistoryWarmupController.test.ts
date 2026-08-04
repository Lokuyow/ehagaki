import { describe, expect, it, vi } from 'vitest';

import { createPostHistoryWarmupController } from '../../lib/postHistoryWarmupController';

const warmupResult = {
    status: 'prefetched' as const,
    urlCount: 2,
    latestPosts: [],
    visibleUntil: null,
    hasJumpCacheAnchors: false,
};

describe('createPostHistoryWarmupController', () => {
    it('pubkey がないと skipped を返す', async () => {
        const controller = createPostHistoryWarmupController({
            getCurrentPubkeyHex: () => null,
            prefetchLatestPostHistoryDescriptors: vi.fn(),
        });

        await expect(controller.warmLatestPostHistoryDescriptors()).resolves.toEqual({
            status: 'skipped',
            urlCount: 0,
            latestPosts: [],
            visibleUntil: null,
            hasJumpCacheAnchors: false,
        });
    });

    it('同じ pubkey では 1 回の warmup を使い回す', async () => {
        const prefetchLatestPostHistoryDescriptors = vi
            .fn()
            .mockResolvedValue(warmupResult);
        let currentPubkeyHex = 'pubkey-1';
        const controller = createPostHistoryWarmupController({
            getCurrentPubkeyHex: () => currentPubkeyHex,
            prefetchLatestPostHistoryDescriptors,
        });

        const first = controller.warmLatestPostHistoryDescriptors();
        const second = controller.warmLatestPostHistoryDescriptors();

        await expect(first).resolves.toEqual(warmupResult);
        await expect(second).resolves.toEqual(warmupResult);
        expect(prefetchLatestPostHistoryDescriptors).toHaveBeenCalledTimes(1);

        const third = controller.warmLatestPostHistoryDescriptors();
        await expect(third).resolves.toEqual(warmupResult);
        expect(prefetchLatestPostHistoryDescriptors).toHaveBeenCalledTimes(1);
        await expect(controller.getWarmupResultForPubkey('pubkey-1')).resolves.toEqual(warmupResult);
    });

    it('pubkey が変わると新しい warmup を開始する', async () => {
        const prefetchLatestPostHistoryDescriptors = vi
            .fn()
            .mockResolvedValue({ ...warmupResult, urlCount: 1 });
        let currentPubkeyHex = 'pubkey-1';
        const controller = createPostHistoryWarmupController({
            getCurrentPubkeyHex: () => currentPubkeyHex,
            prefetchLatestPostHistoryDescriptors,
        });

        await controller.warmLatestPostHistoryDescriptors();
        currentPubkeyHex = 'pubkey-2';
        await controller.warmLatestPostHistoryDescriptors();

        expect(prefetchLatestPostHistoryDescriptors).toHaveBeenCalledTimes(2);
        expect(prefetchLatestPostHistoryDescriptors).toHaveBeenNthCalledWith(1, 'pubkey-1');
        expect(prefetchLatestPostHistoryDescriptors).toHaveBeenNthCalledWith(2, 'pubkey-2');
    });

    it('invalidate 後は古い結果を再利用しない', async () => {
        const prefetchLatestPostHistoryDescriptors = vi
            .fn()
            .mockResolvedValue(warmupResult);
        const controller = createPostHistoryWarmupController({
            getCurrentPubkeyHex: () => 'pubkey-1',
            prefetchLatestPostHistoryDescriptors,
        });

        await controller.warmLatestPostHistoryDescriptors();
        controller.invalidate('pubkey-1');

        await expect(controller.getWarmupResultForPubkey('pubkey-1')).resolves.toBeNull();
    });
});
