import { describe, expect, it, vi } from 'vitest';

import { createPostHistoryWarmupController } from '../../lib/postHistoryWarmupController';

describe('createPostHistoryWarmupController', () => {
    it('pubkey がないと skipped を返す', async () => {
        const controller = createPostHistoryWarmupController({
            getCurrentPubkeyHex: () => null,
            prefetchLatestPostHistoryDescriptors: vi.fn(),
        });

        await expect(controller.warmLatestPostHistoryDescriptors()).resolves.toEqual({
            status: 'skipped',
            urlCount: 0,
        });
    });

    it('同じ pubkey では 1 回の warmup を使い回す', async () => {
        const prefetchLatestPostHistoryDescriptors = vi
            .fn()
            .mockResolvedValue({ status: 'prefetched', urlCount: 2 });
        let currentPubkeyHex = 'pubkey-1';
        const controller = createPostHistoryWarmupController({
            getCurrentPubkeyHex: () => currentPubkeyHex,
            prefetchLatestPostHistoryDescriptors,
        });

        const first = controller.warmLatestPostHistoryDescriptors();
        const second = controller.warmLatestPostHistoryDescriptors();

        await expect(first).resolves.toEqual({ status: 'prefetched', urlCount: 2 });
        await expect(second).resolves.toEqual({ status: 'prefetched', urlCount: 2 });
        expect(prefetchLatestPostHistoryDescriptors).toHaveBeenCalledTimes(1);

        const third = controller.warmLatestPostHistoryDescriptors();
        await expect(third).resolves.toEqual({ status: 'prefetched', urlCount: 2 });
        expect(prefetchLatestPostHistoryDescriptors).toHaveBeenCalledTimes(1);
    });

    it('pubkey が変わると新しい warmup を開始する', async () => {
        const prefetchLatestPostHistoryDescriptors = vi
            .fn()
            .mockResolvedValue({ status: 'prefetched', urlCount: 1 });
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
});
