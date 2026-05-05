import { describe, expect, it, vi } from 'vitest';

import {
    cleanupServiceWorkerDuplicateProfileCache,
    clearServiceWorkerProfileCache,
} from '../../lib/swProfileCacheActionUtils';

describe('swProfileCacheActionUtils', () => {
    it('clearServiceWorkerProfileCache deletes the profile cache and reports success', async () => {
        const cacheStorage = {
            delete: vi.fn().mockResolvedValue(true),
        };
        const logger = {
            log: vi.fn(),
            error: vi.fn(),
        };

        const result = await clearServiceWorkerProfileCache({
            cacheStorage,
            cacheName: 'profile-cache',
            logger,
        });

        expect(result).toEqual({ success: true });
        expect(cacheStorage.delete).toHaveBeenCalledWith('profile-cache');
        expect(logger.log).toHaveBeenCalledWith('プロフィール画像キャッシュクリア:', true);
    });

    it('cleanupServiceWorkerDuplicateProfileCache deletes only duplicate query requests', async () => {
        const baseRequest = { url: 'https://example.com/profile.jpg' };
        const duplicateRequest = { url: 'https://example.com/profile.jpg?profile=true' };
        const unrelatedRequest = { url: 'https://example.com/other.jpg?profile=true' };
        const cache = {
            keys: vi.fn().mockResolvedValue([baseRequest, duplicateRequest, unrelatedRequest]),
            delete: vi.fn().mockResolvedValue(true),
        };
        const cacheStorage = {
            open: vi.fn().mockResolvedValue(cache),
        };
        const logger = {
            log: vi.fn(),
            error: vi.fn(),
        };

        const result = await cleanupServiceWorkerDuplicateProfileCache({
            cacheStorage,
            cacheName: 'profile-cache',
            logger,
            getBaseUrl: (url) => {
                const parsed = new URL(url);
                return `${parsed.origin}${parsed.pathname}`;
            },
        });

        expect(result).toEqual({ success: true, deletedCount: 1 });
        expect(cacheStorage.open).toHaveBeenCalledWith('profile-cache');
        expect(cache.delete).toHaveBeenCalledTimes(1);
        expect(cache.delete).toHaveBeenCalledWith(duplicateRequest);
        expect(logger.log).toHaveBeenCalledWith('重複キャッシュを削除:', duplicateRequest.url);
        expect(logger.log).toHaveBeenCalledWith('重複プロフィールキャッシュクリーンアップ完了: 1件削除');
    });
});