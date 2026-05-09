import type { EHagakiDB, PostMediaCacheEntryRecord } from './ehagakiDb';
import { ehagakiDb } from './ehagakiDb';
import { normalizePostMediaUrl } from '../postMediaCacheUtils';

export const POST_MEDIA_CACHE_SCHEMA_VERSION = 1;

export interface PostMediaCacheRepository {
    getByCacheKey(cacheKey: string): Promise<PostMediaCacheEntryRecord | null>;
    getByUrl(url: string): Promise<PostMediaCacheEntryRecord | null>;
    listByLastAccessed(): Promise<PostMediaCacheEntryRecord[]>;
    upsert(input: {
        cacheKey: string;
        url: string;
        normalizedUrl?: string;
        size: number;
        mimeType?: string;
        createdAt?: number;
        lastAccessedAt?: number;
        source: PostMediaCacheEntryRecord['source'];
        eventIds?: string[];
    }): Promise<PostMediaCacheEntryRecord>;
    touch(cacheKey: string, accessedAt?: number): Promise<void>;
    linkEventIdByUrls(input: { eventId: string; urls: string[] }): Promise<void>;
    deleteByCacheKey(cacheKey: string): Promise<void>;
}

function cloneEntry(
    record: PostMediaCacheEntryRecord,
): PostMediaCacheEntryRecord {
    return {
        ...record,
        eventIds: [...record.eventIds],
    };
}

function mergeEventIds(
    existing: string[],
    next: string[],
): string[] {
    return Array.from(new Set([...existing, ...next].filter(Boolean)));
}

export class DexiePostMediaCacheRepository
implements PostMediaCacheRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async getByCacheKey(cacheKey: string): Promise<PostMediaCacheEntryRecord | null> {
        if (!cacheKey) {
            return null;
        }

        const record = await this.db.postMediaCache.get(cacheKey);
        return record ? cloneEntry(record) : null;
    }

    async getByUrl(url: string): Promise<PostMediaCacheEntryRecord | null> {
        const normalizedUrl = normalizePostMediaUrl(url);
        if (!normalizedUrl) {
            return null;
        }

        const record = await this.db.postMediaCache
            .where('normalizedUrl')
            .equals(normalizedUrl)
            .first();

        return record ? cloneEntry(record) : null;
    }

    async listByLastAccessed(): Promise<PostMediaCacheEntryRecord[]> {
        const records = await this.db.postMediaCache
            .orderBy('lastAccessedAt')
            .toArray();
        return records.map(cloneEntry);
    }

    async upsert(input: {
        cacheKey: string;
        url: string;
        normalizedUrl?: string;
        size: number;
        mimeType?: string;
        createdAt?: number;
        lastAccessedAt?: number;
        source: PostMediaCacheEntryRecord['source'];
        eventIds?: string[];
    }): Promise<PostMediaCacheEntryRecord> {
        const timestamp = this.now();
        const normalizedUrl = input.normalizedUrl ?? normalizePostMediaUrl(input.url);
        const existing = await this.db.postMediaCache.get(input.cacheKey);
        const createdAt = input.createdAt ?? existing?.createdAt ?? timestamp;
        const lastAccessedAt = input.lastAccessedAt ?? existing?.lastAccessedAt ?? createdAt;

        const record: PostMediaCacheEntryRecord = {
            cacheKey: input.cacheKey,
            url: input.url,
            normalizedUrl,
            size: input.size,
            mimeType: input.mimeType ?? existing?.mimeType,
            createdAt,
            lastAccessedAt,
            source: input.source,
            eventIds: mergeEventIds(existing?.eventIds ?? [], input.eventIds ?? []),
            updatedAt: timestamp,
            schemaVersion: POST_MEDIA_CACHE_SCHEMA_VERSION,
        };

        await this.db.postMediaCache.put(record);
        return cloneEntry(record);
    }

    async touch(cacheKey: string, accessedAt = this.now()): Promise<void> {
        if (!cacheKey) {
            return;
        }

        const existing = await this.db.postMediaCache.get(cacheKey);
        if (!existing) {
            return;
        }

        await this.db.postMediaCache.put({
            ...existing,
            lastAccessedAt: accessedAt,
            updatedAt: accessedAt,
        });
    }

    async linkEventIdByUrls(input: { eventId: string; urls: string[] }): Promise<void> {
        if (!input.eventId) {
            return;
        }

        const normalizedUrls = Array.from(
            new Set(input.urls.map(normalizePostMediaUrl).filter(Boolean)),
        );
        if (normalizedUrls.length === 0) {
            return;
        }

        const timestamp = this.now();
        await this.db.transaction('rw', this.db.postMediaCache, async () => {
            for (const normalizedUrl of normalizedUrls) {
                const existing = await this.db.postMediaCache
                    .where('normalizedUrl')
                    .equals(normalizedUrl)
                    .first();
                if (!existing) {
                    continue;
                }

                const eventIds = mergeEventIds(existing.eventIds, [input.eventId]);
                if (eventIds.length === existing.eventIds.length) {
                    continue;
                }

                await this.db.postMediaCache.put({
                    ...existing,
                    eventIds,
                    updatedAt: timestamp,
                });
            }
        });
    }

    async deleteByCacheKey(cacheKey: string): Promise<void> {
        if (!cacheKey) {
            return;
        }

        await this.db.postMediaCache.delete(cacheKey);
    }
}

export const postMediaCacheRepository = new DexiePostMediaCacheRepository();