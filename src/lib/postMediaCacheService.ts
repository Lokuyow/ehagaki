import {
    inferPostMediaKind,
    normalizePostMediaUrl,
    type PostMediaKind,
} from './postMediaCacheUtils';
import {
    postMediaCacheRepository,
    type PostMediaCacheRepository,
} from './storage/postMediaCacheRepository';

export const POST_MEDIA_CACHE_NAME = 'ehagaki-post-media-v1';
export const POST_MEDIA_CACHE_MAX_TOTAL_SIZE = 128 * 1024 * 1024;
export const POST_MEDIA_DESCRIPTOR_SNAPSHOT_TTL_MS = 60_000;
export const POST_MEDIA_DESCRIPTOR_SNAPSHOT_MAX_ENTRIES = 256;
export const POST_MEDIA_SHORT_LIVED_OBJECT_URL_TTL_MS = 45_000;
export const POST_MEDIA_SHORT_LIVED_OBJECT_URL_MAX_ENTRIES = 16;
export const POST_MEDIA_SHORT_LIVED_OBJECT_URL_MAX_TOTAL_SIZE =
    24 * 1024 * 1024;

type FetchLike = (
    input: RequestInfo | URL,
    init?: RequestInit,
) => Promise<Response>;

interface CacheLike {
    put(request: RequestInfo | URL, response: Response): Promise<void>;
    match(request: RequestInfo | URL): Promise<Response | undefined>;
    delete(request: RequestInfo | URL): Promise<boolean>;
}

interface CacheStorageLike {
    open(cacheName: string): Promise<CacheLike>;
}

interface PostMediaCacheServiceRuntime {
    cacheStorage?: CacheStorageLike;
    fetch?: FetchLike;
    createObjectUrl?: (blob: Blob) => string;
    revokeObjectUrl?: (url: string) => void;
}

export interface CachedPostMediaDescriptor {
    cacheKey: string;
    url: string;
    mimeType?: string;
    size: number;
    source: 'uploaded' | 'network';
    kind: PostMediaKind;
}

export interface CachedPostMediaObjectUrl extends CachedPostMediaDescriptor {
    objectUrl: string;
}

interface PostMediaCacheServiceOptions {
    descriptorSnapshotTtlMs?: number;
    descriptorSnapshotMaxEntries?: number;
    objectUrlTtlMs?: number;
    objectUrlMaxEntries?: number;
    objectUrlMaxTotalSize?: number;
}

interface DescriptorSnapshotEntry {
    value: CachedPostMediaDescriptor | null;
    expiresAt: number;
    lastAccessedAt: number;
    resolvedAt: number;
}

interface SharedObjectUrlEntry {
    descriptor: CachedPostMediaDescriptor;
    objectUrl: string;
    size: number;
    expiresAt: number;
    lastAccessedAt: number;
    activeLeases: number;
}

type ObjectUrlOwnership =
    | {
        kind: 'shared';
        cacheKey: string;
    }
    | {
        kind: 'ephemeral';
    };

type CachedPostMediaRecord = NonNullable<
    Awaited<ReturnType<PostMediaCacheRepository['getByUrl']>>
>;

function createDefaultRuntime(): PostMediaCacheServiceRuntime {
    const canCreateObjectUrl =
        typeof URL !== 'undefined' &&
        typeof URL.createObjectURL === 'function';
    const canRevokeObjectUrl =
        typeof URL !== 'undefined' &&
        typeof URL.revokeObjectURL === 'function';

    return {
        cacheStorage: typeof caches === 'undefined' ? undefined : caches,
        fetch: typeof globalThis.fetch === 'function'
            ? globalThis.fetch.bind(globalThis)
            : undefined,
        createObjectUrl: canCreateObjectUrl
            ? URL.createObjectURL.bind(URL)
            : undefined,
        revokeObjectUrl: canRevokeObjectUrl
            ? URL.revokeObjectURL.bind(URL)
            : undefined,
    };
}

function resolveTransientCacheKey(url: string): string {
    return normalizePostMediaUrl(url) || String(url ?? '').trim();
}

function cloneDescriptor(
    descriptor: CachedPostMediaDescriptor,
): CachedPostMediaDescriptor {
    return { ...descriptor };
}

function cloneObjectUrlDescriptor(
    descriptor: CachedPostMediaObjectUrl,
): CachedPostMediaObjectUrl {
    return { ...descriptor };
}

async function runWithConcurrencyLimit<T>(
    items: readonly T[],
    limit: number,
    handler: (item: T) => Promise<void>,
): Promise<void> {
    if (items.length === 0) {
        return;
    }

    const workerCount = Math.max(1, Math.min(limit, items.length));
    let nextIndex = 0;

    const workers = Array.from({ length: workerCount }, async () => {
        while (nextIndex < items.length) {
            const currentIndex = nextIndex;
            nextIndex += 1;
            await handler(items[currentIndex]);
        }
    });

    await Promise.all(workers);
}

export class PostMediaCacheService {
    private readonly descriptorSnapshotTtlMs: number;
    private readonly descriptorSnapshotMaxEntries: number;
    private readonly objectUrlTtlMs: number;
    private readonly objectUrlMaxEntries: number;
    private readonly objectUrlMaxTotalSize: number;
    private readonly descriptorSnapshotByCacheKey =
        new Map<string, DescriptorSnapshotEntry>();
    private readonly descriptorLookupPromises =
        new Map<string, Promise<CachedPostMediaDescriptor | null>>();
    private readonly sharedObjectUrlByCacheKey =
        new Map<string, SharedObjectUrlEntry>();
    private readonly objectUrlOwners = new Map<string, ObjectUrlOwnership>();

    constructor(
        private repository: PostMediaCacheRepository = postMediaCacheRepository,
        private runtime: PostMediaCacheServiceRuntime = createDefaultRuntime(),
        private maxTotalSize = POST_MEDIA_CACHE_MAX_TOTAL_SIZE,
        options: PostMediaCacheServiceOptions = {},
    ) {
        this.descriptorSnapshotTtlMs = Math.max(
            0,
            Math.trunc(
                options.descriptorSnapshotTtlMs ??
                POST_MEDIA_DESCRIPTOR_SNAPSHOT_TTL_MS,
            ),
        );
        this.descriptorSnapshotMaxEntries = Math.max(
            0,
            Math.trunc(
                options.descriptorSnapshotMaxEntries ??
                POST_MEDIA_DESCRIPTOR_SNAPSHOT_MAX_ENTRIES,
            ),
        );
        this.objectUrlTtlMs = Math.max(
            0,
            Math.trunc(
                options.objectUrlTtlMs ??
                POST_MEDIA_SHORT_LIVED_OBJECT_URL_TTL_MS,
            ),
        );
        this.objectUrlMaxEntries = Math.max(
            0,
            Math.trunc(
                options.objectUrlMaxEntries ??
                POST_MEDIA_SHORT_LIVED_OBJECT_URL_MAX_ENTRIES,
            ),
        );
        this.objectUrlMaxTotalSize = Math.max(
            0,
            Math.trunc(
                options.objectUrlMaxTotalSize ??
                POST_MEDIA_SHORT_LIVED_OBJECT_URL_MAX_TOTAL_SIZE,
            ),
        );
    }

    canUsePersistentCache(): boolean {
        return Boolean(globalThis.isSecureContext) &&
            typeof this.runtime.cacheStorage !== 'undefined';
    }

    async prefetchCachedMediaDescriptors(urls: string[]): Promise<void> {
        if (!this.canUsePersistentCache()) {
            return;
        }

        this.cleanupTransientState();

        const uniqueUrls = new Map<string, string>();
        for (const url of urls) {
            const cacheKey = resolveTransientCacheKey(url);
            if (!cacheKey || uniqueUrls.has(cacheKey)) {
                continue;
            }

            if (this.readDescriptorSnapshot(cacheKey) !== undefined) {
                continue;
            }

            uniqueUrls.set(cacheKey, url);
        }

        await runWithConcurrencyLimit(
            [...uniqueUrls.entries()],
            4,
            async ([cacheKey, url]) => {
                try {
                    await this.resolveCachedMediaDescriptor(url, cacheKey);
                } catch {
                    // Descriptor prefetch is best-effort and must not disrupt UI loading.
                }
            },
        );
    }

    getCachedMediaDescriptorSnapshot(
        url: string,
    ): CachedPostMediaDescriptor | null | undefined {
        this.cleanupTransientState();
        const cacheKey = resolveTransientCacheKey(url);
        if (!cacheKey) {
            return undefined;
        }

        return this.readDescriptorSnapshot(cacheKey);
    }

    getCachedMediaObjectUrlSnapshot(
        url: string,
    ): CachedPostMediaObjectUrl | null {
        this.cleanupTransientState();
        const cacheKey = resolveTransientCacheKey(url);
        if (!cacheKey) {
            return null;
        }

        const entry = this.sharedObjectUrlByCacheKey.get(cacheKey);
        const now = Date.now();
        if (!entry) {
            return null;
        }

        if (entry.expiresAt <= now) {
            if (entry.activeLeases === 0) {
                this.revokeSharedObjectUrl(cacheKey);
            }
            return null;
        }

        entry.activeLeases += 1;
        entry.lastAccessedAt = now;
        entry.expiresAt = now + this.objectUrlTtlMs;

        return cloneObjectUrlDescriptor({
            ...entry.descriptor,
            objectUrl: entry.objectUrl,
        });
    }

    async persistUploadedMedia(params: {
        url: string;
        file: Blob;
        mimeType?: string;
    }): Promise<CachedPostMediaDescriptor | null> {
        return this.persistMediaBlob({
            url: params.url,
            file: params.file,
            mimeType: params.mimeType || params.file.type || undefined,
            source: 'uploaded',
        });
    }

    async fetchAndCacheMedia(params: {
        url: string;
        mimeType?: string;
    }): Promise<CachedPostMediaDescriptor | null> {
        const fetchFn = this.runtime.fetch;
        if (!fetchFn) {
            return null;
        }

        try {
            const response = await fetchFn(params.url);

            if (response.type === 'opaque') {
                return await this.persistOpaqueMediaResponse({
                    url: params.url,
                    response,
                    mimeType: params.mimeType,
                    source: 'network',
                });
            }

            if (!response.ok) {
                return null;
            }

            const blob = await response.blob();
            return await this.persistMediaBlob({
                url: params.url,
                file: blob,
                mimeType:
                    params.mimeType ||
                    response.headers.get('Content-Type') ||
                    blob.type ||
                    undefined,
                source: 'network',
            });
        } catch (error) {
            const opaqueResponse = await this.fetchOpaqueMediaResponse({
                url: params.url,
                mimeType: params.mimeType,
            });

            if (opaqueResponse) {
                return opaqueResponse;
            }

            throw error;
        }
    }

    async getCachedMediaDescriptor(
        url: string,
    ): Promise<CachedPostMediaDescriptor | null> {
        this.cleanupTransientState();

        const cacheKey = resolveTransientCacheKey(url);
        if (!cacheKey) {
            return null;
        }

        const snapshot = this.readDescriptorSnapshot(cacheKey);
        if (snapshot !== undefined) {
            return snapshot;
        }

        return this.resolveCachedMediaDescriptor(url, cacheKey);
    }

    async createCachedMediaObjectUrl(
        url: string,
        options: {
            reuseShortLived?: boolean;
        } = {},
    ): Promise<CachedPostMediaObjectUrl | null> {
        this.cleanupTransientState();

        const reuseShortLived = options.reuseShortLived ?? true;
        if (reuseShortLived) {
            const pooled = this.getCachedMediaObjectUrlSnapshot(url);
            if (pooled) {
                await this.repository.touch(pooled.cacheKey);
                return pooled;
            }
        }

        const resolved = await this.getCachedRecordAndResponse(url);
        const cacheKey = resolveTransientCacheKey(url);
        if (!resolved) {
            if (cacheKey) {
                this.writeDescriptorSnapshot(cacheKey, null);
                this.revokeSharedObjectUrl(cacheKey);
            }
            return null;
        }

        const { record, response } = resolved;
        const descriptor = this.toCachedMediaDescriptor({
            record,
            mimeType: record.mimeType || response.headers.get('Content-Type') || undefined,
        });
        this.writeDescriptorSnapshot(record.cacheKey, descriptor);

        if (response.type === 'opaque') {
            await this.repository.touch(record.cacheKey);

            return {
                ...descriptor,
                objectUrl: record.url,
            };
        }

        const createObjectUrl = this.runtime.createObjectUrl;
        if (!createObjectUrl) {
            return null;
        }

        const blob = await response.blob();
        const blobMimeType = descriptor.mimeType || blob.type || undefined;
        const resolvedDescriptor = this.toCachedMediaDescriptor({
            record,
            mimeType: blobMimeType,
        });
        this.writeDescriptorSnapshot(record.cacheKey, resolvedDescriptor);

        if (
            reuseShortLived &&
            this.shouldPoolObjectUrl({
                descriptor: resolvedDescriptor,
                size: blob.size,
            }) &&
            !this.sharedObjectUrlByCacheKey.has(record.cacheKey) &&
            this.ensureSharedObjectUrlCapacity({
                requiredCount: 1,
                requiredSize: blob.size,
                protectedCacheKey: record.cacheKey,
            })
        ) {
            const objectUrl = createObjectUrl(blob);
            this.sharedObjectUrlByCacheKey.set(record.cacheKey, {
                descriptor: resolvedDescriptor,
                objectUrl,
                size: blob.size,
                expiresAt: Date.now() + this.objectUrlTtlMs,
                lastAccessedAt: Date.now(),
                activeLeases: 1,
            });
            this.objectUrlOwners.set(objectUrl, {
                kind: 'shared',
                cacheKey: record.cacheKey,
            });
            await this.repository.touch(record.cacheKey);

            return {
                ...resolvedDescriptor,
                objectUrl,
            };
        }

        const objectUrl = createObjectUrl(blob);
        this.objectUrlOwners.set(objectUrl, { kind: 'ephemeral' });
        await this.repository.touch(record.cacheKey);

        return {
            ...resolvedDescriptor,
            objectUrl,
        };
    }

    revokeObjectUrl(url: string): void {
        if (!url.startsWith('blob:')) {
            return;
        }

        const owner = this.objectUrlOwners.get(url);
        if (!owner) {
            this.runtime.revokeObjectUrl?.(url);
            return;
        }

        if (owner.kind === 'ephemeral') {
            this.objectUrlOwners.delete(url);
            this.runtime.revokeObjectUrl?.(url);
            return;
        }

        const entry = this.sharedObjectUrlByCacheKey.get(owner.cacheKey);
        if (!entry || entry.objectUrl !== url) {
            this.objectUrlOwners.delete(url);
            this.runtime.revokeObjectUrl?.(url);
            return;
        }

        entry.activeLeases = Math.max(0, entry.activeLeases - 1);
        entry.lastAccessedAt = Date.now();
        this.cleanupSharedObjectUrlEntries();
    }

    async deleteCachedMedia(url: string): Promise<void> {
        this.cleanupTransientState();

        const cacheStorage = this.runtime.cacheStorage;
        const record = await this.repository.getByUrl(url);
        const cacheKey = record?.cacheKey ?? resolveTransientCacheKey(url);
        if (cacheKey) {
            this.writeDescriptorSnapshot(cacheKey, null);
            this.revokeSharedObjectUrl(cacheKey);
        }

        if (!cacheStorage || !record) {
            return;
        }

        const cache = await cacheStorage.open(POST_MEDIA_CACHE_NAME);
        await cache.delete(record.cacheKey);
        await this.repository.deleteByCacheKey(record.cacheKey);
    }

    private async persistMediaBlob(params: {
        url: string;
        file: Blob;
        mimeType?: string;
        source: 'uploaded' | 'network';
    }): Promise<CachedPostMediaDescriptor | null> {
        const cacheStorage = this.runtime.cacheStorage;
        const normalizedUrl = normalizePostMediaUrl(params.url);
        if (!cacheStorage || !normalizedUrl) {
            return null;
        }

        if (params.file.size > this.maxTotalSize) {
            return null;
        }

        const cache = await cacheStorage.open(POST_MEDIA_CACHE_NAME);
        const timestamp = Date.now();
        const response = new Response(params.file, {
            headers: params.mimeType
                ? { 'Content-Type': params.mimeType }
                : undefined,
        });

        await cache.put(normalizedUrl, response);
        const record = await this.repository.upsert({
            cacheKey: normalizedUrl,
            url: params.url,
            normalizedUrl,
            size: params.file.size,
            mimeType: params.mimeType,
            createdAt: timestamp,
            lastAccessedAt: timestamp,
            source: params.source,
        });
        await this.evictOverflowEntries(normalizedUrl);

        const descriptor = this.toCachedMediaDescriptor({
            record,
            mimeType: record.mimeType,
        });
        this.writeDescriptorSnapshot(record.cacheKey, descriptor);
        return descriptor;
    }

    private async fetchOpaqueMediaResponse(params: {
        url: string;
        mimeType?: string;
    }): Promise<CachedPostMediaDescriptor | null> {
        const fetchFn = this.runtime.fetch;
        if (!fetchFn) {
            return null;
        }

        try {
            const response = await fetchFn(new Request(params.url, {
                mode: 'no-cors',
                cache: 'reload',
            }));

            if (response.type !== 'opaque') {
                return null;
            }

            return await this.persistOpaqueMediaResponse({
                url: params.url,
                response,
                mimeType: params.mimeType,
                source: 'network',
            });
        } catch {
            return null;
        }
    }

    private async persistOpaqueMediaResponse(params: {
        url: string;
        response: Response;
        mimeType?: string;
        source: 'uploaded' | 'network';
    }): Promise<CachedPostMediaDescriptor | null> {
        const cacheStorage = this.runtime.cacheStorage;
        const normalizedUrl = normalizePostMediaUrl(params.url);
        if (!cacheStorage || !normalizedUrl) {
            return null;
        }

        const cache = await cacheStorage.open(POST_MEDIA_CACHE_NAME);
        const timestamp = Date.now();
        await cache.put(
            normalizedUrl,
            typeof params.response.clone === 'function'
                ? params.response.clone()
                : params.response,
        );

        const record = await this.repository.upsert({
            cacheKey: normalizedUrl,
            url: params.url,
            normalizedUrl,
            size: 0,
            mimeType: params.mimeType,
            createdAt: timestamp,
            lastAccessedAt: timestamp,
            source: params.source,
        });
        await this.evictOverflowEntries(normalizedUrl);

        const descriptor = this.toCachedMediaDescriptor({
            record,
            mimeType: record.mimeType,
        });
        this.writeDescriptorSnapshot(record.cacheKey, descriptor);
        return descriptor;
    }

    private async resolveCachedMediaDescriptor(
        url: string,
        cacheKey = resolveTransientCacheKey(url),
    ): Promise<CachedPostMediaDescriptor | null> {
        if (!cacheKey) {
            return this.loadCachedMediaDescriptor(url);
        }

        const pending = this.descriptorLookupPromises.get(cacheKey);
        if (pending) {
            return pending;
        }

        const promise = (async () => {
            const descriptor = await this.loadCachedMediaDescriptor(url);
            this.writeDescriptorSnapshot(cacheKey, descriptor);
            return descriptor;
        })().finally(() => {
            this.descriptorLookupPromises.delete(cacheKey);
        });

        this.descriptorLookupPromises.set(cacheKey, promise);
        return promise;
    }

    private async loadCachedMediaDescriptor(
        url: string,
    ): Promise<CachedPostMediaDescriptor | null> {
        const resolved = await this.getCachedRecordAndResponse(url);
        if (!resolved) {
            return null;
        }

        const { record, response } = resolved;
        return this.toCachedMediaDescriptor({
            record,
            mimeType: record.mimeType || response.headers.get('Content-Type') || undefined,
        });
    }

    private toCachedMediaDescriptor(params: {
        record: CachedPostMediaRecord;
        mimeType?: string;
    }): CachedPostMediaDescriptor {
        const { record, mimeType } = params;
        return {
            cacheKey: record.cacheKey,
            url: record.url,
            mimeType,
            size: record.size,
            source: record.source,
            kind: inferPostMediaKind({
                url: record.url,
                mimeType,
            }),
        };
    }

    private writeDescriptorSnapshot(
        cacheKey: string,
        value: CachedPostMediaDescriptor | null,
    ): void {
        if (!cacheKey || this.descriptorSnapshotTtlMs <= 0 || this.descriptorSnapshotMaxEntries <= 0) {
            this.descriptorSnapshotByCacheKey.delete(cacheKey);
            return;
        }

        const now = Date.now();
        this.descriptorSnapshotByCacheKey.set(cacheKey, {
            value: value ? cloneDescriptor(value) : null,
            expiresAt: now + this.descriptorSnapshotTtlMs,
            lastAccessedAt: now,
            resolvedAt: now,
        });
        this.cleanupDescriptorSnapshots();
    }

    private readDescriptorSnapshot(
        cacheKey: string,
    ): CachedPostMediaDescriptor | null | undefined {
        if (!cacheKey) {
            return undefined;
        }

        const entry = this.descriptorSnapshotByCacheKey.get(cacheKey);
        const now = Date.now();
        if (!entry) {
            return undefined;
        }

        if (entry.expiresAt <= now) {
            this.descriptorSnapshotByCacheKey.delete(cacheKey);
            return undefined;
        }

        entry.lastAccessedAt = now;
        entry.expiresAt = now + this.descriptorSnapshotTtlMs;
        return entry.value ? cloneDescriptor(entry.value) : null;
    }

    private shouldPoolObjectUrl(params: {
        descriptor: CachedPostMediaDescriptor;
        size: number;
    }): boolean {
        return params.descriptor.kind === 'image' &&
            params.size > 0 &&
            params.size <= this.objectUrlMaxTotalSize &&
            this.objectUrlMaxEntries > 0 &&
            this.objectUrlTtlMs > 0;
    }

    private ensureSharedObjectUrlCapacity(params: {
        requiredCount: number;
        requiredSize: number;
        protectedCacheKey?: string;
    }): boolean {
        if (this.objectUrlMaxEntries <= 0 || this.objectUrlMaxTotalSize <= 0) {
            return false;
        }

        this.cleanupSharedObjectUrlEntries();

        let totalCount = this.sharedObjectUrlByCacheKey.size;
        let totalSize = [...this.sharedObjectUrlByCacheKey.values()]
            .reduce((sum, entry) => sum + entry.size, 0);
        if (
            totalCount + params.requiredCount <= this.objectUrlMaxEntries &&
            totalSize + params.requiredSize <= this.objectUrlMaxTotalSize
        ) {
            return true;
        }

        const candidates = [...this.sharedObjectUrlByCacheKey.entries()]
            .filter(([cacheKey, entry]) =>
                cacheKey !== params.protectedCacheKey && entry.activeLeases === 0,
            )
            .sort((left, right) =>
                left[1].lastAccessedAt - right[1].lastAccessedAt,
            );

        for (const [cacheKey, entry] of candidates) {
            this.revokeSharedObjectUrl(cacheKey);
            totalCount -= 1;
            totalSize -= entry.size;

            if (
                totalCount + params.requiredCount <= this.objectUrlMaxEntries &&
                totalSize + params.requiredSize <= this.objectUrlMaxTotalSize
            ) {
                return true;
            }
        }

        return false;
    }

    private cleanupTransientState(): void {
        this.cleanupDescriptorSnapshots();
        this.cleanupSharedObjectUrlEntries();
    }

    private cleanupDescriptorSnapshots(): void {
        const now = Date.now();
        for (const [cacheKey, entry] of this.descriptorSnapshotByCacheKey) {
            if (entry.expiresAt <= now) {
                this.descriptorSnapshotByCacheKey.delete(cacheKey);
            }
        }

        if (this.descriptorSnapshotByCacheKey.size <= this.descriptorSnapshotMaxEntries) {
            return;
        }

        const entries = [...this.descriptorSnapshotByCacheKey.entries()]
            .sort((left, right) => left[1].lastAccessedAt - right[1].lastAccessedAt);
        while (this.descriptorSnapshotByCacheKey.size > this.descriptorSnapshotMaxEntries) {
            const oldest = entries.shift();
            if (!oldest) {
                return;
            }

            this.descriptorSnapshotByCacheKey.delete(oldest[0]);
        }
    }

    private cleanupSharedObjectUrlEntries(): void {
        const now = Date.now();
        for (const [cacheKey, entry] of this.sharedObjectUrlByCacheKey) {
            if (entry.activeLeases === 0 && entry.expiresAt <= now) {
                this.revokeSharedObjectUrl(cacheKey);
            }
        }

        if (
            this.sharedObjectUrlByCacheKey.size <= this.objectUrlMaxEntries &&
            [...this.sharedObjectUrlByCacheKey.values()]
                .reduce((sum, entry) => sum + entry.size, 0) <=
            this.objectUrlMaxTotalSize
        ) {
            return;
        }

        const candidates = [...this.sharedObjectUrlByCacheKey.entries()]
            .filter(([, entry]) => entry.activeLeases === 0)
            .sort((left, right) => left[1].lastAccessedAt - right[1].lastAccessedAt);
        let totalCount = this.sharedObjectUrlByCacheKey.size;
        let totalSize = [...this.sharedObjectUrlByCacheKey.values()]
            .reduce((sum, entry) => sum + entry.size, 0);

        for (const [cacheKey, entry] of candidates) {
            if (
                totalCount <= this.objectUrlMaxEntries &&
                totalSize <= this.objectUrlMaxTotalSize
            ) {
                return;
            }

            this.revokeSharedObjectUrl(cacheKey);
            totalCount -= 1;
            totalSize -= entry.size;
        }
    }

    private revokeSharedObjectUrl(cacheKey: string): void {
        const entry = this.sharedObjectUrlByCacheKey.get(cacheKey);
        if (!entry) {
            return;
        }

        this.sharedObjectUrlByCacheKey.delete(cacheKey);
        this.objectUrlOwners.delete(entry.objectUrl);
        this.runtime.revokeObjectUrl?.(entry.objectUrl);
    }

    private async evictOverflowEntries(protectedCacheKey: string): Promise<void> {
        const cacheStorage = this.runtime.cacheStorage;
        if (!cacheStorage) {
            return;
        }

        const entries = await this.repository.listByLastAccessed();
        let totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
        if (totalSize <= this.maxTotalSize) {
            return;
        }

        const cache = await cacheStorage.open(POST_MEDIA_CACHE_NAME);
        for (const entry of entries) {
            if (entry.cacheKey === protectedCacheKey) {
                continue;
            }

            await cache.delete(entry.cacheKey);
            await this.repository.deleteByCacheKey(entry.cacheKey);
            this.writeDescriptorSnapshot(entry.cacheKey, null);
            this.revokeSharedObjectUrl(entry.cacheKey);
            totalSize -= entry.size;

            if (totalSize <= this.maxTotalSize) {
                return;
            }
        }
    }

    private async getCachedRecordAndResponse(url: string): Promise<{
        record: CachedPostMediaRecord;
        response: Response;
    } | null> {
        const cacheStorage = this.runtime.cacheStorage;
        if (!cacheStorage) {
            return null;
        }

        const record = await this.repository.getByUrl(url);
        if (!record) {
            return null;
        }

        const cache = await cacheStorage.open(POST_MEDIA_CACHE_NAME);
        const response = await cache.match(record.cacheKey);
        if (!response) {
            await this.repository.deleteByCacheKey(record.cacheKey);
            this.writeDescriptorSnapshot(record.cacheKey, null);
            this.revokeSharedObjectUrl(record.cacheKey);
            return null;
        }

        return { record, response };
    }
}

export const postMediaCacheService = new PostMediaCacheService();