import { isValidCustomEmojiUrl } from "../customEmoji";
import {
    ehagakiDb,
    type CustomEmojiImageMetaRecord,
    type EHagakiDB,
} from "./ehagakiDb";

export const CUSTOM_EMOJI_IMAGE_META_SCHEMA_VERSION = 1;
export const MAX_CUSTOM_EMOJI_IMAGE_META_RECORDS = 1000;
export const CUSTOM_EMOJI_IMAGE_META_TTL_MS = 90 * 24 * 60 * 60 * 1000;

export interface CustomEmojiImageMetaRepository {
    get(url: string): Promise<CustomEmojiImageMetaRecord | null>;
    getMany(urls: string[]): Promise<Record<string, CustomEmojiImageMetaRecord>>;
    upsert(input: {
        url: string;
        width: number;
        height: number;
        fetchedAt?: number;
        lastAccessedAt?: number;
    }): Promise<CustomEmojiImageMetaRecord | null>;
    touchMany(urls: string[], accessedAt?: number): Promise<void>;
    prune(now?: number): Promise<void>;
}

function isValidDimension(value: number): boolean {
    return Number.isSafeInteger(value) && value > 0;
}

function cloneRecord(
    record: CustomEmojiImageMetaRecord,
): CustomEmojiImageMetaRecord {
    return { ...record };
}

function uniqueValidUrls(urls: string[]): string[] {
    return Array.from(new Set(urls.filter(isValidCustomEmojiUrl)));
}

export class DexieCustomEmojiImageMetaRepository
    implements CustomEmojiImageMetaRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
        private maxRecords = MAX_CUSTOM_EMOJI_IMAGE_META_RECORDS,
        private ttlMs = CUSTOM_EMOJI_IMAGE_META_TTL_MS,
    ) { }

    async get(url: string): Promise<CustomEmojiImageMetaRecord | null> {
        if (!isValidCustomEmojiUrl(url)) {
            return null;
        }

        const record = await this.db.customEmojiImageMeta.get(url);
        return record ? cloneRecord(record) : null;
    }

    async getMany(
        urls: string[],
    ): Promise<Record<string, CustomEmojiImageMetaRecord>> {
        const normalizedUrls = uniqueValidUrls(urls);
        if (normalizedUrls.length === 0) {
            return {};
        }

        const records = await this.db.customEmojiImageMeta.bulkGet(normalizedUrls);
        const nextRecords: Record<string, CustomEmojiImageMetaRecord> = {};

        records.forEach((record) => {
            if (!record) {
                return;
            }

            nextRecords[record.url] = cloneRecord(record);
        });

        return nextRecords;
    }

    async upsert(input: {
        url: string;
        width: number;
        height: number;
        fetchedAt?: number;
        lastAccessedAt?: number;
    }): Promise<CustomEmojiImageMetaRecord | null> {
        if (
            !isValidCustomEmojiUrl(input.url) ||
            !isValidDimension(input.width) ||
            !isValidDimension(input.height)
        ) {
            return null;
        }

        const timestamp = this.now();
        const existing = await this.db.customEmojiImageMeta.get(input.url);
        const record: CustomEmojiImageMetaRecord = {
            url: input.url,
            width: input.width,
            height: input.height,
            aspectRatio: input.width / input.height,
            fetchedAt: input.fetchedAt ?? existing?.fetchedAt ?? timestamp,
            lastAccessedAt: input.lastAccessedAt ?? timestamp,
            updatedAt: timestamp,
            schemaVersion: CUSTOM_EMOJI_IMAGE_META_SCHEMA_VERSION,
        };

        await this.db.transaction("rw", this.db.customEmojiImageMeta, async () => {
            await this.db.customEmojiImageMeta.put(record);
            await this.pruneInTransaction(timestamp);
        });

        return cloneRecord(record);
    }

    async touchMany(urls: string[], accessedAt = this.now()): Promise<void> {
        const normalizedUrls = uniqueValidUrls(urls);
        if (normalizedUrls.length === 0) {
            return;
        }

        await this.db.transaction("rw", this.db.customEmojiImageMeta, async () => {
            const records = await this.db.customEmojiImageMeta.bulkGet(normalizedUrls);

            await Promise.all(records.map(async (record) => {
                if (!record) {
                    return;
                }

                await this.db.customEmojiImageMeta.put({
                    ...record,
                    lastAccessedAt: accessedAt,
                    updatedAt: accessedAt,
                });
            }));

            await this.pruneInTransaction(accessedAt);
        });
    }

    async prune(now = this.now()): Promise<void> {
        await this.db.transaction("rw", this.db.customEmojiImageMeta, async () => {
            await this.pruneInTransaction(now);
        });
    }

    private async pruneInTransaction(now: number): Promise<void> {
        const expirationThreshold = now - this.ttlMs;
        if (this.ttlMs > 0) {
            const expiredKeys = await this.db.customEmojiImageMeta
                .where("lastAccessedAt")
                .below(expirationThreshold)
                .primaryKeys();

            if (expiredKeys.length > 0) {
                await this.db.customEmojiImageMeta.bulkDelete(expiredKeys as string[]);
            }
        }

        if (this.maxRecords <= 0) {
            await this.db.customEmojiImageMeta.clear();
            return;
        }

        const records = await this.db.customEmojiImageMeta
            .orderBy("lastAccessedAt")
            .toArray();
        const overflow = records.length - this.maxRecords;

        if (overflow <= 0) {
            return;
        }

        await this.db.customEmojiImageMeta.bulkDelete(
            records.slice(0, overflow).map((record) => record.url),
        );
    }
}

export const customEmojiImageMetaRepository =
    new DexieCustomEmojiImageMetaRepository();