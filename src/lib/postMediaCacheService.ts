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

export class PostMediaCacheService {
    constructor(
        private repository: PostMediaCacheRepository = postMediaCacheRepository,
        private runtime: PostMediaCacheServiceRuntime = createDefaultRuntime(),
        private maxTotalSize = POST_MEDIA_CACHE_MAX_TOTAL_SIZE,
    ) { }

    canUsePersistentCache(): boolean {
        return Boolean(globalThis.isSecureContext) && typeof this.runtime.cacheStorage !== 'undefined';
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

        const response = await fetchFn(params.url);

        if (!response.ok) {
            return null;
        }

        const blob = await response.blob();
        return this.persistMediaBlob({
            url: params.url,
            file: blob,
            mimeType:
                params.mimeType ||
                response.headers.get('Content-Type') ||
                blob.type ||
                undefined,
            source: 'network',
        });
    }

    async getCachedMediaDescriptor(
        url: string,
    ): Promise<CachedPostMediaDescriptor | null> {
        const resolved = await this.getCachedRecordAndResponse(url);
        if (!resolved) {
            return null;
        }

        const { record, response } = resolved;
        const mimeType = record.mimeType || response.headers.get('Content-Type') || undefined;
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

    async createCachedMediaObjectUrl(
        url: string,
    ): Promise<CachedPostMediaObjectUrl | null> {
        const createObjectUrl = this.runtime.createObjectUrl;
        if (!createObjectUrl) {
            return null;
        }

        const resolved = await this.getCachedRecordAndResponse(url);
        if (!resolved) {
            return null;
        }

        const { record, response } = resolved;
        const blob = await response.blob();
        const mimeType = record.mimeType || blob.type || undefined;
        const objectUrl = createObjectUrl(blob);
        await this.repository.touch(record.cacheKey);

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
            objectUrl,
        };
    }

    revokeObjectUrl(url: string): void {
        this.runtime.revokeObjectUrl?.(url);
    }

    async deleteCachedMedia(url: string): Promise<void> {
        const cacheStorage = this.runtime.cacheStorage;
        const record = await this.repository.getByUrl(url);
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

        return {
            cacheKey: record.cacheKey,
            url: record.url,
            mimeType: record.mimeType,
            size: record.size,
            source: record.source,
            kind: inferPostMediaKind({
                url: record.url,
                mimeType: record.mimeType,
            }),
        };
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
            totalSize -= entry.size;

            if (totalSize <= this.maxTotalSize) {
                return;
            }
        }
    }

    private async getCachedRecordAndResponse(url: string): Promise<{
        record: Awaited<ReturnType<PostMediaCacheRepository['getByUrl']>> extends infer T
        ? Exclude<T, null>
        : never;
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
            return null;
        }

        return { record, response };
    }
}

export const postMediaCacheService = new PostMediaCacheService();