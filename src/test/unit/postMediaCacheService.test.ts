import { describe, expect, it, vi } from 'vitest';
import {
    PostMediaCacheService,
    POST_MEDIA_CACHE_NAME,
} from '../../lib/postMediaCacheService';

class FakeCache {
    private store = new Map<string, Response>();

    async put(request: RequestInfo | URL, response: Response): Promise<void> {
        this.store.set(resolveRequestKey(request), response.clone());
    }

    async match(request: RequestInfo | URL): Promise<Response | undefined> {
        return this.store.get(resolveRequestKey(request))?.clone();
    }

    async delete(request: RequestInfo | URL): Promise<boolean> {
        return this.store.delete(resolveRequestKey(request));
    }
}

class FakeCacheStorage {
    cacheName: string | null = null;
    cache = new FakeCache();

    async open(cacheName: string): Promise<FakeCache> {
        this.cacheName = cacheName;
        return this.cache;
    }
}

function resolveRequestKey(request: RequestInfo | URL): string {
    if (typeof request === 'string') {
        return request;
    }

    if (request instanceof URL) {
        return request.toString();
    }

    return request.url;
}

describe('PostMediaCacheService', () => {
    it('persists uploaded media in dedicated cache and creates object urls from cached content', async () => {
        const cacheStorage = new FakeCacheStorage();
        const repository = {
            upsert: vi.fn(async (input) => ({
                ...input,
                normalizedUrl: input.normalizedUrl,
                createdAt: input.createdAt,
                lastAccessedAt: input.lastAccessedAt,
                updatedAt: input.lastAccessedAt,
                eventIds: input.eventIds ?? [],
                schemaVersion: 1,
            })),
            getByUrl: vi.fn(async () => ({
                cacheKey: 'https://example.com/media/test.webp',
                url: 'https://example.com/media/test.webp#fragment',
                normalizedUrl: 'https://example.com/media/test.webp',
                size: 4,
                mimeType: 'image/webp',
                createdAt: 10,
                lastAccessedAt: 10,
                source: 'uploaded' as const,
                eventIds: ['event-1'],
                updatedAt: 10,
                schemaVersion: 1,
            })),
            touch: vi.fn(async () => undefined),
            deleteByCacheKey: vi.fn(async () => undefined),
        };
        const createObjectUrl = vi.fn(() => 'blob:cached-media');
        const revokeObjectUrl = vi.fn();
        const service = new PostMediaCacheService(repository as never, {
            cacheStorage,
            createObjectUrl,
            revokeObjectUrl,
        });

        const file = new File([new Uint8Array([1, 2, 3, 4])], 'test.webp', {
            type: 'image/webp',
        });

        const descriptor = await service.persistUploadedMedia({
            url: 'https://example.com/media/test.webp#fragment',
            file,
        });
        const objectUrl = await service.createCachedMediaObjectUrl(
            'https://example.com/media/test.webp#other',
        );

        expect(cacheStorage.cacheName).toBe(POST_MEDIA_CACHE_NAME);
        expect(repository.upsert).toHaveBeenCalledWith({
            cacheKey: 'https://example.com/media/test.webp',
            url: 'https://example.com/media/test.webp#fragment',
            normalizedUrl: 'https://example.com/media/test.webp',
            size: 4,
            mimeType: 'image/webp',
            createdAt: expect.any(Number),
            lastAccessedAt: expect.any(Number),
            source: 'uploaded',
        });
        expect(descriptor).toMatchObject({
            cacheKey: 'https://example.com/media/test.webp',
            kind: 'image',
            source: 'uploaded',
        });
        expect(objectUrl).toEqual({
            cacheKey: 'https://example.com/media/test.webp',
            url: 'https://example.com/media/test.webp#fragment',
            mimeType: 'image/webp',
            size: 4,
            source: 'uploaded',
            kind: 'image',
            objectUrl: 'blob:cached-media',
        });
        expect(repository.touch).toHaveBeenCalledWith(
            'https://example.com/media/test.webp',
        );

        service.revokeObjectUrl('blob:cached-media');
        expect(revokeObjectUrl).toHaveBeenCalledWith('blob:cached-media');
    });
});