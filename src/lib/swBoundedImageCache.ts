import { OPAQUE_CACHE_RETENTION_MS, selectCacheEvictions } from './cacheRetention';
import type { ServiceWorkerImageCachePolicy } from './swImageCachePolicy';

const READABLE_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const MAINTENANCE_INTERVAL_MS = 60 * 60 * 1000;
const MIGRATION_KEY = 'https://ehagaki.invalid/image-cache/migrated';

interface ImageMetadata {
    url: string;
    size: number | null;
    savedAt: number;
    lastAccessedAt: number;
}

interface CachePair {
    body: Cache;
    metadata: Cache;
}

function metadataKey(url: string): string {
    return 'https://ehagaki.invalid/image-cache/entry?url=' + encodeURIComponent(url);
}

function expiresAt(entry: ImageMetadata): number {
    return entry.size === null
        ? entry.savedAt + OPAQUE_CACHE_RETENTION_MS
        : entry.lastAccessedAt + READABLE_RETENTION_MS;
}

function forRetention(entry: ImageMetadata) {
    return { ...entry, expiresAt: expiresAt(entry) };
}

async function measureImage(response: Response, maxBytes: number, preserveBody: boolean): Promise<number | null> {
    if (response.type === 'opaque') return null;
    if (!response.ok) throw new TypeError('Image response is not cacheable');

    const body = preserveBody ? response.clone().body : response.body;
    const reader = body?.getReader();
    if (!reader) return 0;
    let size = 0;
    try {
        while (true) {
            const chunk = await reader.read();
            if (chunk.done) return size;
            size += chunk.value.byteLength;
            if (size > maxBytes) {
                // Cancellation can wait on another branch of the response stream.
                void reader.cancel().catch(() => undefined);
                throw new RangeError('Image exceeds the cache item limit');
            }
        }
    } finally {
        reader.releaseLock();
    }
}

/** Keeps each current image cache and its private metadata in step. */
export class ServiceWorkerBoundedImageCache {
    private queue: Promise<unknown> = Promise.resolve();
    private nextSweepAt = 0;

    constructor(
        private readonly storage: CacheStorage,
        private readonly policy: ServiceWorkerImageCachePolicy,
        private readonly isAllowedUrl: (url: string) => boolean,
        private readonly now = Date.now,
    ) {}

    private serialize<T>(operation: () => Promise<T>): Promise<T> {
        const task = this.queue.then(operation);
        this.queue = task.catch(() => undefined);
        return task;
    }

    private async open(): Promise<CachePair> {
        const [body, metadata] = await Promise.all([
            this.storage.open(this.policy.bodyName),
            this.storage.open(this.policy.metadataName),
        ]);
        return { body, metadata };
    }

    private async readMetadata(response: Response | undefined, key: string): Promise<ImageMetadata | undefined> {
        try {
            const entry: ImageMetadata | null = await response?.json() ?? null;
            if (entry && typeof entry.url === 'string' && metadataKey(entry.url) === key
                && (entry.size === null || (Number.isSafeInteger(entry.size) && entry.size >= 0
                    && entry.size <= this.policy.maxImageBytes))
                && Number.isFinite(entry.savedAt) && Number.isFinite(entry.lastAccessedAt)) return entry;
        } catch {
            // Treat unreadable metadata like a missing cache entry.
        }
    }

    private async listMetadata(cache: Cache): Promise<ImageMetadata[]> {
        const [keys, values] = await Promise.all([cache.keys(), cache.matchAll()]);
        const entries = await Promise.all(keys.map(async (key, index) => {
            if (key.url === MIGRATION_KEY) return undefined;
            const entry = await this.readMetadata(values[index], key.url);
            if (!entry) await cache.delete(key);
            return entry;
        }));
        return entries.filter(entry => entry !== undefined);
    }

    private writeMetadata(cache: Cache, entry: ImageMetadata): Promise<void> {
        return cache.put(metadataKey(entry.url), new Response(JSON.stringify(entry)));
    }

    private async remove(pair: CachePair, url: string): Promise<void> {
        await pair.body.delete(url, { ignoreVary: true });
        await pair.metadata.delete(metadataKey(url));
    }

    async match(request: Request): Promise<Response | undefined> {
        return this.serialize(async () => {
            const pair = await this.open();
            await this.sweepIfDue(pair);
            const key = metadataKey(request.url);
            const [entry, response] = await Promise.all([
                pair.metadata.match(key).then(meta => this.readMetadata(meta, key)),
                pair.body.match(request),
            ]);
            const now = this.now();
            if (!entry || expiresAt(entry) <= now) {
                if (entry) await this.remove(pair, request.url);
                return undefined;
            }
            if (response && now > entry.lastAccessedAt) {
                await this.writeMetadata(pair.metadata, { ...entry, lastAccessedAt: now }).catch(() => undefined);
            }
            return response;
        });
    }

    async put(request: Request, response: Response): Promise<void> {
        const size = await measureImage(response, this.policy.maxImageBytes, true);
        await this.serialize(async () => {
            const pair = await this.open();
            await this.sweepIfDue(pair);
            const now = this.now();
            const entry = { url: request.url, size, savedAt: now, lastAccessedAt: now };
            const existing = (await this.listMetadata(pair.metadata)).filter(item => item.url !== entry.url);
            for (const victim of selectCacheEvictions(existing.map(forRetention), this.policy, now, forRetention(entry))) {
                await this.remove(pair, victim.url);
            }
            await this.remove(pair, entry.url);
            try {
                await pair.body.put(request, response);
                await this.writeMetadata(pair.metadata, entry);
            } catch (error) {
                this.nextSweepAt = 0;
                await this.remove(pair, entry.url).catch(() => undefined);
                throw error;
            }
        });
    }

    async clear(): Promise<boolean> {
        return this.serialize(async () => {
            this.nextSweepAt = 0;
            const deleted = await this.storage.delete(this.policy.bodyName);
            await this.storage.delete(this.policy.metadataName);
            return deleted;
        });
    }

    async keys(): Promise<readonly Request[]> {
        return this.serialize(async () => {
            const pair = await this.open();
            await this.sweepIfDue(pair);
            return pair.body.keys();
        });
    }

    async delete(request: Request): Promise<boolean> {
        return this.serialize(async () => {
            const pair = await this.open();
            const deleted = await pair.body.delete(request, { ignoreVary: true });
            await pair.metadata.delete(metadataKey(request.url));
            return deleted;
        });
    }

    reconcile(): Promise<void> {
        return this.serialize(async () => this.sweepIfDue(await this.open()));
    }

    private async sweepIfDue(pair: CachePair): Promise<void> {
        const now = this.now();
        if (now < this.nextSweepAt) return;

        const bodyRequests = await pair.body.keys();
        const bodyUrls = new Set(bodyRequests.map(request => request.url));
        const entries = await this.listMetadata(pair.metadata);
        const present = [];
        for (const entry of entries) {
            if (bodyUrls.has(entry.url)) present.push(forRetention(entry));
            else await pair.metadata.delete(metadataKey(entry.url));
        }
        const victims = selectCacheEvictions(present, this.policy, now);
        for (const victim of victims) {
            await this.remove(pair, victim.url);
            bodyUrls.delete(victim.url);
        }

        const managed = new Set(entries.map(entry => entry.url));
        const unmanaged = bodyRequests.filter(request => !managed.has(request.url));
        if (!await pair.metadata.match(MIGRATION_KEY)) {
            await this.adoptLegacyEntries(pair, unmanaged, present.filter(entry => bodyUrls.has(entry.url)), now);
            await pair.metadata.put(MIGRATION_KEY, new Response('1'));
        } else {
            for (const url of new Set(unmanaged.map(request => request.url))) {
                await this.remove(pair, url);
            }
        }
        this.nextSweepAt = now + MAINTENANCE_INTERVAL_MS;
    }

    private async adoptLegacyEntries(
        pair: CachePair,
        requests: Request[],
        retained: Array<ReturnType<typeof forRetention>>,
        now: number,
    ): Promise<void> {
        const variants = new Map<string, Request[]>();
        for (const request of requests.reverse()) {
            const group = variants.get(request.url) ?? [];
            group.push(request);
            variants.set(request.url, group);
        }
        const adopted = [];
        for (const [url, group] of variants) {
            if (retained.length >= this.policy.maxEntries || !this.isAllowedUrl(url)) {
                await this.remove(pair, url);
                continue;
            }
            const request = group[0];
            const response = await pair.body.match(request);
            let entry: ReturnType<typeof forRetention> | undefined;
            if (response) {
                try {
                    const size = await measureImage(response, this.policy.maxImageBytes, false);
                    entry = forRetention({ url, size, savedAt: now, lastAccessedAt: now });
                } catch {
                    // Evict responses that cannot be measured safely.
                }
            }
            if (!response || !entry || selectCacheEvictions(retained, this.policy, now, entry).length > 0) {
                await this.remove(pair, url);
                continue;
            }
            retained.push(entry);
            adopted.push({ entry, request, hasVariants: group.length > 1 });
        }
        // Free space from excluded legacy entries before writing new metadata.
        for (const { entry, request, hasVariants } of adopted) {
            if (hasVariants) {
                const response = await pair.body.match(request);
                await pair.body.delete(entry.url, { ignoreVary: true });
                if (!response) continue;
                await pair.body.put(request, response);
            }
            await this.writeMetadata(pair.metadata, entry);
        }
    }
}
