import { describe, expect, it, vi } from 'vitest';
import { ServiceWorkerBoundedImageCache } from '../../lib/swBoundedImageCache';
import { OPAQUE_CACHE_RETENTION_MS } from '../../lib/cacheRetention';
import { resolveCustomEmojiImageRequestResponse } from '../../lib/swCustomEmojiRequestUtils';

class MemoryCache {
    private entries = new Map<string, Response>();

    async keys() { return [...this.entries.keys()].map(url => new Request(url)); }
    async matchAll() { return [...this.entries.values()].map(response => response.clone()); }
    async match(key: Request | string) { return this.entries.get(typeof key === 'string' ? key : key.url)?.clone(); }
    async delete(key: Request | string) { return this.entries.delete(typeof key === 'string' ? key : key.url); }
    async put(key: Request | string, response: Response) {
        const url = typeof key === 'string' ? key : key.url;
        this.entries.delete(url);
        this.entries.set(url, response.clone());
    }
}

const request = (name: string) => new Request('https://images.example/' + name);
const readable = (size: number) => new Response(new Uint8Array(size));
const opaque = (): Response => ({ type: 'opaque', clone: opaque }) as Response;

function setup() {
    const body = new MemoryCache();
    const metadata = new MemoryCache();
    let now = 100;
    const storage = {
        open: async (name: string) => name === 'body' ? body : metadata,
        delete: async (name: string) => {
            const cache = name === 'body' ? body : metadata;
            for (const key of await cache.keys()) await cache.delete(key);
            return true;
        },
    } as unknown as CacheStorage;
    const createCache = () => new ServiceWorkerBoundedImageCache(storage, {
        bodyName: 'body', metadataName: 'meta', maxEntries: 3, maxReadableBytes: 6,
        maxImageBytes: 4, maxOpaqueEntries: 1,
    }, () => true, () => now);
    return { body, metadata, createCache, advance: (ms: number) => { now += ms; } };
}

describe('Service Worker image cache retention', () => {
    it('serves other cached images and starts network fallback during an uncommitted replacement', async () => {
        const { createCache, metadata, advance } = setup();
        const cache = createCache();
        await cache.put(request('stable'), readable(1));
        await cache.put(request('replacement'), readable(1));
        advance(1);

        const put = metadata.put.bind(metadata);
        const held = Promise.withResolvers<void>();
        const release = Promise.withResolvers<void>();
        vi.spyOn(metadata, 'put').mockImplementationOnce(async (key, response) => {
            held.resolve();
            await release.promise;
            await put(key, response);
        });
        const replacement = cache.put(request('replacement'), readable(2));
        await held.promise;

        try {
            await expect(cache.match(request('replacement'))).resolves.toBeUndefined();
            const background: Promise<unknown>[] = [];
            await expect(cache.match(request('stable'), work => background.push(work))).resolves.toBeDefined();
            advance(1);
            await expect(cache.match(request('stable'), work => background.push(work))).resolves.toBeDefined();
            expect(background).toHaveLength(2);
            expect(background[1]).toBe(background[0]);

            const network = vi.fn(async () => readable(3));
            const response = await resolveCustomEmojiImageRequestResponse({
                request: request('missing'), cache, getBaseUrl: url => url, createRequest: url => new Request(url),
                fetchRequest: network,
            });
            expect(network).toHaveBeenCalledOnce();
            expect((await response.arrayBuffer()).byteLength).toBe(3);
            release.resolve();
            await replacement;
            await Promise.all(background);
            const updates = await Promise.all((await metadata.matchAll()).map(async response => await response.text()));
            expect(updates.some(value => value.includes('"lastAccessedAt":102'))).toBe(true);
        } finally {
            release.resolve();
            await replacement;
        }
    });

    it('discards a lookup that overlaps a cache clear', async () => {
        const { createCache, body, metadata, advance } = setup();
        const cache = createCache();
        await cache.put(request('image'), readable(1));
        advance(1);
        const match = body.match.bind(body);
        const started = Promise.withResolvers<void>();
        const release = Promise.withResolvers<void>();
        vi.spyOn(body, 'match').mockImplementationOnce(async key => {
            const old = await match(key);
            started.resolve();
            await release.promise;
            return old;
        });
        const registerWork = vi.fn();
        const lookup = cache.match(request('image'), registerWork);
        await started.promise;
        try {
            await cache.clear();
        } finally {
            release.resolve();
        }
        await expect(lookup).resolves.toBeUndefined();
        expect(registerWork).not.toHaveBeenCalled();
        expect(await metadata.keys()).toHaveLength(0);
    });

    it('adopts the newest fitting legacy bodies and resumes a partial migration', async () => {
        const { body, metadata, createCache } = setup();
        await body.put(request('old'), readable(4));
        await body.put(request('older-opaque'), opaque());
        await body.put(request('large'), readable(5));
        await body.put(request('recent'), readable(4));
        await body.put(request('recent-opaque'), opaque());

        const write = vi.spyOn(metadata, 'put');
        write.mockRejectedValueOnce(new DOMException('quota', 'QuotaExceededError'));
        await expect(createCache().reconcile()).rejects.toThrow('quota');
        const cache = createCache();
        await cache.reconcile();
        expect((await body.keys()).map(key => key.url)).toEqual([request('recent').url, request('recent-opaque').url]);
        expect((await cache.match(request('recent-opaque')))?.type).toBe('opaque');
        expect(await (await cache.match(request('recent')))?.arrayBuffer()).toHaveProperty('byteLength', 4);
    });

    it('enforces size, count and opaque limits across simultaneous saves', async () => {
        const { body, createCache, advance } = setup();
        const cache = createCache();
        await expect(cache.put(request('unsupported-size'), readable(5))).rejects.toThrow(RangeError);
        await cache.put(request('old'), readable(4));
        advance(1);
        await cache.put(request('opaque'), opaque());
        advance(1);
        await Promise.all([
            cache.put(request('current'), readable(4)),
            cache.put(request('little'), readable(2)),
            cache.put(request('new-opaque'), opaque()),
        ]);
        expect((await body.keys()).map(key => key.url).sort()).toEqual(
            ['current', 'little', 'new-opaque'].map(name => request(name).url),
        );
        await cache.put(request('empty'), readable(0));
        expect(await body.keys()).toHaveLength(3);
    });

    it('expires opaque responses from save time and readable ones from last use', async () => {
        const { createCache, advance } = setup();
        const cache = createCache();
        await cache.put(request('opaque'), opaque());
        await cache.put(request('readable'), readable(1));
        advance(OPAQUE_CACHE_RETENTION_MS - 1);
        expect(await cache.match(request('opaque'))).toBeDefined();
        const background: Promise<unknown>[] = [];
        expect(await cache.match(request('readable'), work => background.push(work))).toBeDefined();
        await Promise.all(background);
        advance(1);
        expect(await cache.match(request('opaque'))).toBeUndefined();
        advance(30 * OPAQUE_CACHE_RETENTION_MS - 1);
        expect(await cache.match(request('readable'))).toBeUndefined();
    });

    it('cleans up the body after a failed metadata write and can retry', async () => {
        const { body, metadata, createCache } = setup();
        const cache = createCache();
        await cache.reconcile();
        vi.spyOn(metadata, 'put').mockRejectedValueOnce(new DOMException('quota', 'QuotaExceededError'));
        await expect(cache.put(request('image'), readable(4))).rejects.toThrow('quota');
        expect(await body.keys()).toHaveLength(0);
        await cache.put(request('image'), readable(4));
        expect(await cache.match(request('image'))).toBeDefined();
    });
});
