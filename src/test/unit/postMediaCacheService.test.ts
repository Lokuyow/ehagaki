import 'fake-indexeddb/auto';
import { describe, expect, it, vi } from 'vitest';
import { EHagakiDB } from '../../lib/storage/ehagakiDb';
import { DexiePostMediaCacheRepository } from '../../lib/storage/postMediaCacheRepository';
import { OPAQUE_CACHE_RETENTION_MS } from '../../lib/cacheRetention';
import {
    PostMediaCacheService,
    POST_MEDIA_CACHE_NAME,
    POST_MEDIA_CACHE_MAX_TOTAL_SIZE,
} from '../../lib/postMediaCacheService';

class FakeCache {
    private store = new Map<string, Response>();

    async keys(): Promise<Request[]> {
        return [...this.store.keys()].map(url => new Request(url));
    }

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
    it('cleans a failed write without fetching a second time and can cache on retry', async () => {
        const db = new EHagakiDB('test-post-cache-failed-write');
        const repository = new DexiePostMediaCacheRepository(db);
        const cacheStorage = new FakeCacheStorage();
        const url = 'https://example.com/retry.webp';
        const fetch = vi.fn(async () => new Response(new Uint8Array([1])));
        const service = new PostMediaCacheService(repository, { cacheStorage, fetch });
        const upsert = vi.spyOn(repository, 'upsert');
        upsert.mockRejectedValueOnce(new DOMException('quota', 'QuotaExceededError'));
        try {
            await expect(service.fetchAndCacheMedia({ url })).rejects.toThrow('quota');
            expect(fetch).toHaveBeenCalledTimes(1);
            expect(cacheStorage.cache.has(url)).toBe(false);
            await expect(repository.getByUrl(url)).resolves.toBeNull();
            await expect(service.fetchAndCacheMedia({ url })).resolves.toMatchObject({ size: 1 });
        } finally {
            await db.delete();
        }
    });

    it('cleans orphaned bodies and metadata and limits legacy and new opaque entries', async () => {
        const db = new EHagakiDB('test-post-cache-reconcile');
        const repository = new DexiePostMediaCacheRepository(db);
        const cacheStorage = new FakeCacheStorage();
        const opaque = (): Response => ({ type: 'opaque', clone: opaque }) as Response;
        const url = (name: string) => `https://example.com/${name}.webp`;
        const seed = (name: string, createdAt: number) => repository.upsert({
            cacheKey: url(name), url: url(name), size: 0, source: 'network', createdAt,
        });
        const now = Date.now();
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(now);
        try {
            await cacheStorage.cache.put(url('orphan-body'), opaque());
            await seed('orphan-metadata', now);
            await cacheStorage.cache.put(url('expired'), opaque());
            await seed('expired', now - OPAQUE_CACHE_RETENTION_MS);
            await cacheStorage.cache.put(url('empty-readable'), new Response());
            await seed('empty-readable', now - OPAQUE_CACHE_RETENTION_MS);
            for (let index = 0; index < 8; index++) {
                await cacheStorage.cache.put(url(`legacy-${index}`), opaque());
                await seed(`legacy-${index}`, now - 8 + index);
            }
            const service = new PostMediaCacheService(repository, { cacheStorage, fetch: async () => opaque() });
            await service.getCachedMediaDescriptor(url('empty-readable'));
            expect(cacheStorage.cache.has(url('orphan-body'))).toBe(false);
            expect(await repository.getByUrl(url('orphan-metadata'))).toBeNull();
            expect(cacheStorage.cache.has(url('expired'))).toBe(false);
            expect(cacheStorage.cache.has(url('empty-readable'))).toBe(true);

            await Promise.all([service.fetchAndCacheMedia({ url: url('new-1') }), service.fetchAndCacheMedia({ url: url('new-2') })]);
            expect(await cacheStorage.cache.keys()).toHaveLength(9);
            expect(await repository.getByUrl(url('legacy-0'))).toBeNull();
            expect(await repository.getByUrl(url('legacy-1'))).toBeNull();
            vi.setSystemTime(now + OPAQUE_CACHE_RETENTION_MS);
            await expect(service.getCachedMediaDescriptor(url('new-1'))).resolves.toBeNull();
        } finally {
            vi.useRealTimers();
            await db.delete();
        }
    });

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
            eventIds: ['event-1'],
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
        expect(revokeObjectUrl).not.toHaveBeenCalled();
    });

    it('prefetch stores descriptor snapshots by normalized url and expires them by ttl', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
        vi.stubGlobal('isSecureContext', true);

        const cacheStorage = new FakeCacheStorage();
        await cacheStorage.cache.put(
            'https://example.com/media/hit.webp',
            new Response(new Blob([new Uint8Array([1, 2, 3])], {
                type: 'image/webp',
            })),
        );

        const record = {
            cacheKey: 'https://example.com/media/hit.webp',
            url: 'https://example.com/media/hit.webp#saved',
            normalizedUrl: 'https://example.com/media/hit.webp',
            size: 3,
            mimeType: 'image/webp',
            createdAt: 10,
            lastAccessedAt: 10,
            source: 'uploaded' as const,
            eventIds: [],
            updatedAt: 10,
            schemaVersion: 1,
        };
        const repository = {
            getByUrl: vi.fn(async (url: string) => url.replace(/#.*$/, '') === record.cacheKey ? record : null),
            listByLastAccessed: vi.fn(async () => [record]),
            upsert: vi.fn(async () => {
                throw new Error('upsert should not be called');
            }),
            touch: vi.fn(async () => undefined),
            deleteByCacheKey: vi.fn(async () => undefined),
        };

        const service = new PostMediaCacheService(
            repository as never,
            { cacheStorage },
            POST_MEDIA_CACHE_MAX_TOTAL_SIZE,
            { descriptorSnapshotTtlMs: 100 },
        );

        await service.prefetchCachedMediaDescriptors([
            'https://example.com/media/hit.webp#one',
            'https://example.com/media/hit.webp#two',
            'https://example.com/media/miss.webp',
        ]);

        expect(repository.getByUrl).toHaveBeenCalledTimes(2);
        expect(
            service.getCachedMediaDescriptorSnapshot(
                'https://example.com/media/hit.webp#three',
            ),
        ).toMatchObject({
            cacheKey: 'https://example.com/media/hit.webp',
            url: 'https://example.com/media/hit.webp#saved',
            kind: 'image',
        });
        expect(
            service.getCachedMediaDescriptorSnapshot(
                'https://example.com/media/miss.webp',
            ),
        ).toBeNull();
        expect(
            service.getCachedMediaDescriptorSnapshot(
                'https://example.com/media/unknown.webp',
            ),
        ).toBeUndefined();

        vi.setSystemTime(new Date('2025-01-01T00:00:00.101Z'));

        expect(
            service.getCachedMediaDescriptorSnapshot(
                'https://example.com/media/hit.webp',
            ),
        ).toBeUndefined();
        expect(
            service.getCachedMediaDescriptorSnapshot(
                'https://example.com/media/miss.webp',
            ),
        ).toBeUndefined();

        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('reuses short-lived image object urls until ttl expiry', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));

        const cacheStorage = new FakeCacheStorage();
        await cacheStorage.cache.put(
            'https://example.com/media/shared.webp',
            new Response(new Blob([new Uint8Array([1, 2, 3, 4])], {
                type: 'image/webp',
            })),
        );

        const record = {
            cacheKey: 'https://example.com/media/shared.webp',
            url: 'https://example.com/media/shared.webp',
            normalizedUrl: 'https://example.com/media/shared.webp',
            size: 4,
            mimeType: 'image/webp',
            createdAt: 10,
            lastAccessedAt: 10,
            source: 'uploaded' as const,
            eventIds: [],
            updatedAt: 10,
            schemaVersion: 1,
        };
        const repository = {
            getByUrl: vi.fn(async (url: string) => url.replace(/#.*$/, '') === record.cacheKey ? record : null),
            listByLastAccessed: vi.fn(async () => [record]),
            upsert: vi.fn(async () => {
                throw new Error('upsert should not be called');
            }),
            touch: vi.fn(async () => undefined),
            deleteByCacheKey: vi.fn(async () => undefined),
        };
        const createObjectUrl = vi.fn(() => 'blob:shared-image');
        const revokeObjectUrl = vi.fn();
        const service = new PostMediaCacheService(
            repository as never,
            {
                cacheStorage,
                createObjectUrl,
                revokeObjectUrl,
            },
            POST_MEDIA_CACHE_MAX_TOTAL_SIZE,
            { objectUrlTtlMs: 100 },
        );

        const first = await service.createCachedMediaObjectUrl(
            'https://example.com/media/shared.webp',
        );
        expect(first?.objectUrl).toBe('blob:shared-image');

        service.revokeObjectUrl('blob:shared-image');
        expect(revokeObjectUrl).not.toHaveBeenCalled();

        const second = service.getCachedMediaObjectUrlSnapshot(
            'https://example.com/media/shared.webp#reopen',
        );
        expect(second?.objectUrl).toBe('blob:shared-image');
        expect(createObjectUrl).toHaveBeenCalledTimes(1);

        service.revokeObjectUrl('blob:shared-image');

        vi.setSystemTime(new Date('2025-01-01T00:00:00.101Z'));

        expect(
            service.getCachedMediaObjectUrlSnapshot(
                'https://example.com/media/shared.webp',
            ),
        ).toBeNull();
        expect(revokeObjectUrl).toHaveBeenCalledWith('blob:shared-image');

        vi.useRealTimers();
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

    it('CORS 失敗時は no-cors の opaque 画像を保存し、直接 URL として再利用できる', async () => {
        const cacheStorage = new FakeCacheStorage();
        const records = new Map<string, {
            cacheKey: string;
            url: string;
            normalizedUrl: string;
            size: number;
            mimeType?: string;
            createdAt: number;
            lastAccessedAt: number;
            source: 'uploaded' | 'network';
            eventIds: string[];
            updatedAt: number;
            schemaVersion: number;
        }>();
        const repository = {
            getByUrl: vi.fn(async (url: string) => {
                const normalized = url.replace(/#.*$/, '');
                return records.get(normalized) ?? null;
            }),
            listByLastAccessed: vi.fn(async () => []),
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
        let opaqueResponse: {
            type: 'opaque';
            clone: () => unknown;
            headers: { get: (name: string) => string | null };
        };
        opaqueResponse = {
            type: 'opaque',
            clone: vi.fn(() => opaqueResponse),
            headers: {
                get: vi.fn(() => null),
            },
        };
        const fetchMock = vi.fn()
            .mockRejectedValueOnce(new TypeError('Failed to fetch'))
            .mockResolvedValueOnce(opaqueResponse);
        const service = new PostMediaCacheService(repository as never, {
            cacheStorage,
            fetch: fetchMock,
        }, 11);

        const url = 'https://example.com/media/cors.webp';
        await expect(service.getCachedMediaDescriptor(url)).resolves.toBeNull();
        expect(service.getCachedMediaDescriptorSnapshot(url)).toBeNull();

        const descriptor = await service.fetchAndCacheMedia({
            url,
        });

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock.mock.calls[0][0]).toBe('https://example.com/media/cors.webp');
        expect(fetchMock.mock.calls[1][0]).toBeInstanceOf(Request);
        expect((fetchMock.mock.calls[1][0] as Request).mode).toBe('no-cors');
        expect(descriptor).toMatchObject({
            cacheKey: 'https://example.com/media/cors.webp',
            source: 'network',
            kind: 'image',
            size: 0,
        });
        expect(cacheStorage.cache.has('https://example.com/media/cors.webp')).toBe(true);
        expect(service.getCachedMediaDescriptorSnapshot(url)).toBeUndefined();
        await expect(service.getCachedMediaDescriptor(url)).resolves.toEqual(descriptor);
        expect(service.getCachedMediaDescriptorSnapshot(url)).toBeUndefined();

        const objectUrl = await service.createCachedMediaObjectUrl(
            'https://example.com/media/cors.webp',
        );

        expect(objectUrl).toMatchObject({
            cacheKey: 'https://example.com/media/cors.webp',
            url: 'https://example.com/media/cors.webp',
            source: 'network',
            kind: 'image',
            objectUrl: 'https://example.com/media/cors.webp',
        });
        expect(repository.touch).toHaveBeenCalledWith('https://example.com/media/cors.webp');
    });
});
