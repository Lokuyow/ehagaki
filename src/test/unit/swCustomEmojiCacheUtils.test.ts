import { describe, expect, it, vi } from 'vitest';

import {
    cacheCustomEmojiImagesBatch,
    cacheOpaqueCustomEmojiImage,
    prepareCustomEmojiResponseForCache,
} from '../../lib/swCustomEmojiCacheUtils';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function createTestWebPBytes(): ArrayBuffer {
    const bytes = new Uint8Array(26);
    bytes.set([0x52, 0x49, 0x46, 0x46], 0);
    new DataView(bytes.buffer).setUint32(4, 18, true);
    bytes.set([0x57, 0x45, 0x42, 0x50], 8);
    bytes.set([0x56, 0x50, 0x38, 0x4c], 12);
    new DataView(bytes.buffer).setUint32(16, 5, true);
    bytes.set([0x2f, 0, 0, 0, 0], 20);
    return bytes.buffer;
}

function createTestWebPResponse(headers: Record<string, string> = {}): Response {
    return new Response(createTestWebPBytes(), {
        status: 200,
        headers: {
            'Content-Type': 'image/webp',
            ...headers,
        },
    });
}

type BatchParams = Omit<Parameters<typeof cacheCustomEmojiImagesBatch>[0], 'urls'>;

function createBatchDependencies(overrides: {
    cache?: { match?: ReturnType<typeof vi.fn>; put: ReturnType<typeof vi.fn> };
    fetchRequest?: (request: Request) => Promise<unknown>;
    cacheOpaqueImage?: BatchParams['cacheOpaqueImage'];
} = {}) {
    const cache = overrides.cache ?? { put: vi.fn().mockResolvedValue(undefined) };
    const fetchRequest: (request: Request) => Promise<unknown> = overrides.fetchRequest ??
        vi.fn().mockResolvedValue(createTestWebPResponse());
    const cacheOpaqueImage: BatchParams['cacheOpaqueImage'] = overrides.cacheOpaqueImage ??
        vi.fn().mockResolvedValue(false);
    const logger = { warn: vi.fn() };
    const params: BatchParams = {
        cacheStorage: { open: vi.fn().mockResolvedValue(cache) },
        cacheName: 'emoji-cache',
        fetchRequest: (request) => fetchRequest(request),
        createRequest: (url: string, options?: RequestInit) =>
            new Request(url, { method: 'GET', ...options }),
        getBaseUrl: (url: string) => {
            const parsed = new URL(url);
            parsed.hash = '';
            return parsed.toString();
        },
        maxImageBytes: MAX_IMAGE_BYTES,
        cacheOpaqueImage: (targetCache, baseUrl) => cacheOpaqueImage(targetCache, baseUrl),
        logger,
    };
    return {
        cache,
        fetchRequest,
        cacheOpaqueImage,
        logger,
        params,
    };
}

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

    it('caches a readable CORS image response and keeps query parameters while deduplicating', async () => {
        const deps = createBatchDependencies();
        const url = 'https://example.com/emoji.webp?size=small#preview';

        const result = await cacheCustomEmojiImagesBatch({
            urls: [url, url],
            ...deps.params,
        });

        expect(result).toEqual({ success: true, cached: 1, failed: 0 });
        expect(deps.fetchRequest).toHaveBeenCalledTimes(1);
        expect(vi.mocked(deps.fetchRequest).mock.calls[0][0].url).toBe(
            'https://example.com/emoji.webp?size=small',
        );
        expect(deps.cache.put.mock.calls[0][0].url).toBe(
            'https://example.com/emoji.webp?size=small',
        );
        expect(deps.cacheOpaqueImage).not.toHaveBeenCalled();
    });

    it('falls back to opaque caching only when the CORS fetch throws', async () => {
        const deps = createBatchDependencies({
            fetchRequest: vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
            cacheOpaqueImage: vi.fn().mockResolvedValue(true),
        });

        const result = await cacheCustomEmojiImagesBatch({
            urls: ['https://example.com/emoji.webp?variant=1'],
            ...deps.params,
        });

        expect(result).toEqual({ success: true, cached: 1, failed: 0 });
        expect(deps.cacheOpaqueImage).toHaveBeenCalledWith(
            deps.cache,
            'https://example.com/emoji.webp?variant=1',
        );
    });

    it('does not refetch an image that is already stored under a no-cors cache key', async () => {
        const cachedResponse = { type: 'opaque' };
        const cache = {
            match: vi.fn(async (request: Request) =>
                request.mode === 'no-cors' ? cachedResponse : undefined),
            put: vi.fn().mockResolvedValue(undefined),
        };
        const deps = createBatchDependencies({ cache });

        const result = await cacheCustomEmojiImagesBatch({
            urls: ['https://example.com/already-cached.webp'],
            ...deps.params,
        });

        expect(result).toEqual({ success: true, cached: 1, failed: 0 });
        expect(cache.match).toHaveBeenCalledTimes(2);
        expect(cache.match.mock.calls[0][0].mode).toBe('cors');
        expect(cache.match.mock.calls[1][0].mode).toBe('no-cors');
        expect(deps.fetchRequest).not.toHaveBeenCalled();
        expect(cache.put).not.toHaveBeenCalled();
    });

    it('does not use opaque fallback for an observable HTTP error', async () => {
        const response = new Response('missing', { status: 404 });
        const deps = createBatchDependencies({ fetchRequest: vi.fn().mockResolvedValue(response) });

        const result = await cacheCustomEmojiImagesBatch({
            urls: ['https://example.com/missing.webp'],
            ...deps.params,
        });

        expect(result).toEqual({ success: true, cached: 0, failed: 1 });
        expect(deps.cache.put).not.toHaveBeenCalled();
        expect(deps.cacheOpaqueImage).not.toHaveBeenCalled();
        await expect(prepareCustomEmojiResponseForCache(response, MAX_IMAGE_BYTES)).resolves.toEqual({
            cacheable: false,
            reason: 'http-error',
        });
    });

    it('rejects an image over the Content-Length limit without reading or opaque fallback', async () => {
        const response = createTestWebPResponse({
            'Content-Length': String(MAX_IMAGE_BYTES + 1),
        });
        const clone = vi.spyOn(response, 'clone');
        const deps = createBatchDependencies({ fetchRequest: vi.fn().mockResolvedValue(response) });

        const result = await cacheCustomEmojiImagesBatch({
            urls: ['https://example.com/large.webp'],
            ...deps.params,
        });

        expect(result).toEqual({ success: true, cached: 0, failed: 1 });
        expect(clone).not.toHaveBeenCalled();
        expect(deps.cacheOpaqueImage).not.toHaveBeenCalled();
    });

    it('rejects an image whose read body exceeds the size limit', async () => {
        const response = createTestWebPResponse();
        const assessment = await prepareCustomEmojiResponseForCache(response, 10);

        expect(assessment).toEqual({ cacheable: false, reason: 'too-large' });
    });

    it('distinguishes an unreadable response body without opaque fallback', async () => {
        const response = {
            ok: true,
            status: 200,
            statusText: 'OK',
            type: 'cors',
            headers: new Headers({ 'Content-Type': 'image/webp' }),
            clone: () => ({
                arrayBuffer: () => Promise.reject(new TypeError('body unavailable')),
            }),
        } as unknown as Response;
        const deps = createBatchDependencies({ fetchRequest: vi.fn().mockResolvedValue(response) });

        const result = await cacheCustomEmojiImagesBatch({
            urls: ['https://example.com/unreadable.webp'],
            ...deps.params,
        });

        expect(result).toEqual({ success: true, cached: 0, failed: 1 });
        expect(deps.cacheOpaqueImage).not.toHaveBeenCalled();
        await expect(prepareCustomEmojiResponseForCache(response, MAX_IMAGE_BYTES)).resolves.toEqual({
            cacheable: false,
            reason: 'body-unreadable',
        });
    });

    it('normalizes a verified WebP body with a mismatched Content-Type', async () => {
        const response = createTestWebPResponse({
            'Content-Type': 'image/png',
            'Content-Length': '26',
            'Content-Encoding': 'gzip',
            'X-Test': 'preserved',
        });

        const assessment = await prepareCustomEmojiResponseForCache(response, MAX_IMAGE_BYTES);

        expect(assessment.cacheable).toBe(true);
        if (!assessment.cacheable) return;
        expect(assessment.response).not.toBe(response);
        expect(assessment.response.headers.get('Content-Type')).toBe('image/webp');
        expect(assessment.response.headers.get('Content-Length')).toBeNull();
        expect(assessment.response.headers.get('Content-Encoding')).toBeNull();
        expect(assessment.response.headers.get('X-Test')).toBe('preserved');
        expect(await assessment.response.arrayBuffer()).toEqual(createTestWebPBytes());
    });

    it('normalizes a verified WebP body when Content-Type is missing', async () => {
        const response = new Response(createTestWebPBytes(), { status: 200 });

        const assessment = await prepareCustomEmojiResponseForCache(response, MAX_IMAGE_BYTES);

        expect(assessment.cacheable).toBe(true);
        if (!assessment.cacheable) return;
        expect(assessment.response.headers.get('Content-Type')).toBe('image/webp');
    });

    it('rejects non-image content even when the URL ends in .webp', async () => {
        const response = new Response('<html>not an image</html>', {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
        });

        await expect(prepareCustomEmojiResponseForCache(response, MAX_IMAGE_BYTES)).resolves.toEqual({
            cacheable: false,
            reason: 'invalid-content-type',
        });
    });

    it('rejects an invalid body declared as image/webp', async () => {
        const response = new Response('not webp', {
            status: 200,
            headers: { 'Content-Type': 'image/webp' },
        });

        await expect(prepareCustomEmojiResponseForCache(response, MAX_IMAGE_BYTES)).resolves.toEqual({
            cacheable: false,
            reason: 'invalid-content-type',
        });
    });

    it('keeps the existing path for a non-WebP response with another image Content-Type', async () => {
        const response = new Response('png bytes are decoded by the browser', {
            status: 200,
            headers: { 'Content-Type': 'image/png' },
        });

        const assessment = await prepareCustomEmojiResponseForCache(response, MAX_IMAGE_BYTES);

        expect(assessment).toEqual({ cacheable: true, response });
    });

    it('continues with later images after CacheStorage.put fails', async () => {
        const cache = {
            put: vi.fn()
                .mockRejectedValueOnce(new Error('quota exceeded'))
                .mockResolvedValueOnce(undefined),
        };
        const deps = createBatchDependencies({
            cache,
            fetchRequest: vi.fn().mockImplementation(() => Promise.resolve(createTestWebPResponse())),
        });

        const result = await cacheCustomEmojiImagesBatch({
            urls: [
                'https://example.com/first.webp',
                'https://example.com/second.webp',
            ],
            ...deps.params,
        });

        expect(result).toEqual({ success: true, cached: 1, failed: 1 });
        expect(deps.fetchRequest).toHaveBeenCalledTimes(2);
        expect(deps.cacheOpaqueImage).not.toHaveBeenCalled();
        expect(deps.logger.warn).toHaveBeenCalledTimes(1);
    });

    it('limits each batch to 300 unique URLs', async () => {
        const deps = createBatchDependencies({
            fetchRequest: vi.fn().mockImplementation(() => Promise.resolve(
                new Response('image', { headers: { 'Content-Type': 'image/png' } }),
            )),
        });
        const urls = Array.from({ length: 301 }, (_, index) =>
            `https://example.com/${index}.png?raw=true`);

        const result = await cacheCustomEmojiImagesBatch({
            urls,
            ...deps.params,
        });

        expect(result).toEqual({ success: true, cached: 300, failed: 0 });
        expect(deps.fetchRequest).toHaveBeenCalledTimes(300);
        expect(deps.cache.put).toHaveBeenCalledTimes(300);
    });
});
