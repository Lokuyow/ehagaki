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

    has(request: RequestInfo | URL): boolean {
        return this.store.has(resolveRequestKey(request));
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
            listByLastAccessed: vi.fn(async () => [{
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
            }]),
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

    it('fetches network media on demand and evicts least recently used entries when over capacity', async () => {
        const cacheStorage = new FakeCacheStorage();
        await cacheStorage.cache.put(
            'https://example.com/media/old.webp',
            new Response(new Blob([new Uint8Array([1, 2, 3, 4, 5, 6])], {
                type: 'image/webp',
            })),
        );

        const records = new Map([
            ['https://example.com/media/old.webp', {
                cacheKey: 'https://example.com/media/old.webp',
                url: 'https://example.com/media/old.webp',
                normalizedUrl: 'https://example.com/media/old.webp',
                size: 6,
                mimeType: 'image/webp',
                createdAt: 1,
                lastAccessedAt: 1,
                source: 'uploaded' as const,
                eventIds: [],
                updatedAt: 1,
                schemaVersion: 1,
            }],
        ]);
        const repository = {
            getByCacheKey: vi.fn(async (cacheKey: string) => records.get(cacheKey) ?? null),
            getByUrl: vi.fn(async (url: string) => {
                const normalized = url.replace(/#.*$/, '');
                return records.get(normalized) ?? null;
            }),
            listByLastAccessed: vi.fn(async () =>
                Array.from(records.values()).sort((left, right) => left.lastAccessedAt - right.lastAccessedAt),
            ),
            upsert: vi.fn(async (input) => {
                const record = {
                    cacheKey: input.cacheKey,
                    url: input.url,
                    normalizedUrl: input.normalizedUrl ?? input.url,
                    size: input.size,
                    mimeType: input.mimeType,
                    createdAt: input.createdAt ?? 100,
                    lastAccessedAt: input.lastAccessedAt ?? 100,
                    source: input.source,
                    eventIds: input.eventIds ?? [],
                    updatedAt: input.lastAccessedAt ?? 100,
                    schemaVersion: 1,
                };
                records.set(record.cacheKey, record);
                return record;
            }),
            touch: vi.fn(async () => undefined),
            deleteByCacheKey: vi.fn(async (cacheKey: string) => {
                records.delete(cacheKey);
            }),
        };
        const fetchMock = vi.fn(async () => new Response(
            new Uint8Array([9, 8, 7, 6, 5, 4]),
            {
                status: 200,
                headers: { 'Content-Type': 'image/webp' },
            },
        ));
        const service = new PostMediaCacheService(repository as never, {
            cacheStorage,
            fetch: fetchMock,
        }, 11);

        const descriptor = await service.fetchAndCacheMedia({
            url: 'https://example.com/media/new.webp#fragment',
        });

        expect(fetchMock).toHaveBeenCalledWith(
            'https://example.com/media/new.webp#fragment',
        );
        expect(descriptor).toMatchObject({
            cacheKey: 'https://example.com/media/new.webp',
            source: 'network',
            kind: 'image',
            size: 6,
        });
        expect(repository.deleteByCacheKey).toHaveBeenCalledWith(
            'https://example.com/media/old.webp',
        );
        expect(cacheStorage.cache.has('https://example.com/media/old.webp')).toBe(false);
        expect(cacheStorage.cache.has('https://example.com/media/new.webp')).toBe(true);
    });
    
    it('fetch が失敗した場合は例外を呼び出し元へ伝える', async () => {
        const cacheStorage = new FakeCacheStorage();
        const repository = {
            upsert: vi.fn(),
        };
        const fetchError = new TypeError('Failed to fetch');
        const fetchMock = vi.fn(async () => {
            throw fetchError;
        });
        const service = new PostMediaCacheService(repository as never, {
            cacheStorage,
            fetch: fetchMock,
        }, 11);

        await expect(service.fetchAndCacheMedia({
            url: 'https://example.com/media/cors.webp',
        })).rejects.toThrow(fetchError);

        expect(repository.upsert).not.toHaveBeenCalled();
        expect(cacheStorage.cache.has('https://example.com/media/cors.webp')).toBe(false);
    });
});