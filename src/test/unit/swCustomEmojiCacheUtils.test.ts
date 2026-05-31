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

    it('cacheCustomEmojiImagesBatch keeps query parameters for query-dependent emoji URLs', async () => {
        const cache = {
            put: vi.fn().mockResolvedValue(undefined),
        };
        const cacheStorage = {
            open: vi.fn().mockResolvedValue(cache),
        };
        const fetchRequest = vi.fn().mockResolvedValue(
            new Response('emoji', {
                status: 200,
                headers: { 'Content-Type': 'image/png' },
            }),
        );

        const result = await cacheCustomEmojiImagesBatch({
            urls: [
                'https://github.com/invertedtriangle358/images/blob/main/EMOJI/%E3%81%9B%E3%82%84%E3%81%8B%E3%81%A6%E9%A7%86%E5%8B%95%E9%96%8B%E7%99%BA.png?raw=true',
            ],
            cacheStorage,
            cacheName: 'emoji-cache',
            fetchRequest,
            createRequest: (url, options) => new Request(url, { method: 'GET', ...options }),
            getBaseUrl: (url) => {
                const parsed = new URL(url);
                parsed.hash = '';
                return parsed.toString();
            },
            isCacheableCustomEmojiResponse: vi.fn().mockResolvedValue(true),
            cacheOpaqueImage: vi.fn().mockResolvedValue(false),
            logger: { warn: vi.fn() },
        });

        expect(result).toEqual({ success: true, cached: 1, failed: 0 });
        expect(fetchRequest).toHaveBeenCalledTimes(1);
        expect(fetchRequest.mock.calls[0][0].url).toBe(
            'https://github.com/invertedtriangle358/images/blob/main/EMOJI/%E3%81%9B%E3%82%84%E3%81%8B%E3%81%A6%E9%A7%86%E5%8B%95%E9%96%8B%E7%99%BA.png?raw=true',
        );
        expect(cache.put).toHaveBeenCalledTimes(1);
        expect(cache.put.mock.calls[0][0].url).toBe(
            'https://github.com/invertedtriangle358/images/blob/main/EMOJI/%E3%81%9B%E3%82%84%E3%81%8B%E3%81%A6%E9%A7%86%E5%8B%95%E9%96%8B%E7%99%BA.png?raw=true',
        );
    });
});