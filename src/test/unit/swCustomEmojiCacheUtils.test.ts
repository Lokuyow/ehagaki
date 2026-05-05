import { describe, expect, it, vi } from 'vitest';

import {
    cacheCustomEmojiImagesBatch,
    cacheOpaqueCustomEmojiImage,
} from '../../lib/swCustomEmojiCacheUtils';

describe('swCustomEmojiCacheUtils', () => {
    it('cacheOpaqueCustomEmojiImage stores opaque responses with no-cors cache keys', async () => {
        const cache = {
            put: vi.fn().mockResolvedValue(undefined),
        };
        const response = {
            type: 'opaque',
            clone: vi.fn(() => ({ type: 'opaque' })),
        };

        const result = await cacheOpaqueCustomEmojiImage({
            cache,
            baseUrl: 'https://example.com/emoji.webp',
            fetchRequest: vi.fn().mockResolvedValue(response),
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
        });

        expect(result).toBe(true);
        expect(cache.put).toHaveBeenCalledTimes(1);
        expect(cache.put.mock.calls[0][0].url).toBe('https://example.com/emoji.webp');
        expect(cache.put.mock.calls[0][0].mode).toBe('no-cors');
    });

    it('cacheCustomEmojiImagesBatch deduplicates urls and caches only cacheable responses', async () => {
        const cache = {
            put: vi.fn().mockResolvedValue(undefined),
        };
        const cacheStorage = {
            open: vi.fn().mockResolvedValue(cache),
        };

        const result = await cacheCustomEmojiImagesBatch({
            urls: [
                'https://example.com/emoji.webp?size=small',
                'https://example.com/emoji.webp?size=small',
            ],
            cacheStorage,
            cacheName: 'emoji-cache',
            fetchRequest: vi.fn().mockResolvedValue(
                new Response('emoji', {
                    status: 200,
                    headers: { 'Content-Type': 'image/webp' },
                }),
            ),
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
            getBaseUrl: (url) => {
                const parsed = new URL(url);
                return `${parsed.origin}${parsed.pathname}`;
            },
            isCacheableCustomEmojiResponse: vi.fn().mockResolvedValue(true),
            cacheOpaqueImage: vi.fn().mockResolvedValue(false),
            logger: { warn: vi.fn() },
        });

        expect(result).toEqual({ success: true, cached: 1, failed: 0 });
        expect(cacheStorage.open).toHaveBeenCalledWith('emoji-cache');
        expect(cache.put).toHaveBeenCalledTimes(1);
    });
});