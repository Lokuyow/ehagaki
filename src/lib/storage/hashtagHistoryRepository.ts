import { STORAGE_KEYS } from "../constants";
import type { HashtagHistoryEntry } from "../types";
import { ehagakiDb, type EHagakiDB, type HashtagHistoryRecord } from "./ehagakiDb";

export const MAX_HASHTAG_HISTORY = 100;
export const MAX_HASHTAG_SUGGESTIONS = 5;
export const MAX_HASHTAG_LENGTH = 100;

const HASHTAG_HISTORY_SCHEMA_VERSION = 1;
const LEGACY_HASHTAG_HISTORY_MIGRATION_KEY = "migrated.localStorage.hashtagHistory.v1";

export interface HashtagHistoryRepository {
    getAll(): Promise<HashtagHistoryEntry[]>;
    save(hashtags: string[]): Promise<void>;
    getSuggestions(query: string): Promise<string[]>;
}

function normalizeTag(tag: string): string {
    return tag.toLowerCase();
}

function isLegacyEntry(value: unknown): value is HashtagHistoryEntry {
    return typeof (value as HashtagHistoryEntry | null)?.tag === "string"
        && typeof (value as HashtagHistoryEntry | null)?.lastUsed === "number";
}

function readLegacyHistory(
    storage: Pick<Storage, "getItem"> = localStorage,
): HashtagHistoryEntry[] {
    const raw = storage.getItem(STORAGE_KEYS.HASHTAG_HISTORY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(isLegacyEntry);
    } catch {
        return [];
    }
}

function toEntry(record: HashtagHistoryRecord): HashtagHistoryEntry {
    return {
        tag: record.tag,
        lastUsed: record.lastUsed,
        useCount: record.useCount,
    };
}

function toRecord(
    tag: string,
    useCount: number,
    lastUsed: number,
    now: () => number,
): HashtagHistoryRecord {
    const timestamp = now();

    return {
        tagLower: normalizeTag(tag),
        tag,
        useCount,
        lastUsed,
        createdAt: timestamp,
        updatedAt: timestamp,
        schemaVersion: HASHTAG_HISTORY_SCHEMA_VERSION,
    };
}

function sortHistoryRecords(a: HashtagHistoryRecord, b: HashtagHistoryRecord): number {
    if (b.useCount !== a.useCount) return b.useCount - a.useCount;
    if (b.lastUsed !== a.lastUsed) return b.lastUsed - a.lastUsed;
    return a.tagLower.localeCompare(b.tagLower);
}

function getMatchRank(tagLower: string, queryLower: string): number {
    if (!queryLower) return 0;
    if (tagLower === queryLower) return 0;
    if (tagLower.startsWith(queryLower)) return 1;
    if (tagLower.includes(queryLower)) return 2;
    return 3;
}

function sortSuggestions(query: string) {
    const queryLower = normalizeTag(query);

    return (a: HashtagHistoryRecord, b: HashtagHistoryRecord): number => {
        const rankDiff = getMatchRank(a.tagLower, queryLower) - getMatchRank(b.tagLower, queryLower);
        if (rankDiff !== 0) return rankDiff;
        return sortHistoryRecords(a, b);
    };
}

export class DexieHashtagHistoryRepository implements HashtagHistoryRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
        private getStorage: () => Pick<Storage, "getItem" | "removeItem"> = () => localStorage,
    ) { }

    async getAll(): Promise<HashtagHistoryEntry[]> {
        await this.ensureLegacyHistoryMigrated();
        const records = await this.db.hashtagHistory.toArray();
        return records
            .sort(sortHistoryRecords)
            .map(toEntry);
    }

    async save(hashtags: string[]): Promise<void> {
        if (!hashtags.length) return;

        await this.ensureLegacyHistoryMigrated();

        const timestamp = this.now();
        const tagLowers = [
            ...new Set(
                hashtags
                    .filter((tag) => typeof tag === "string" && tag.length > 0 && tag.length <= MAX_HASHTAG_LENGTH)
                    .map(normalizeTag),
            ),
        ];
        if (tagLowers.length === 0) return;

        const existingRecords = await this.db.hashtagHistory.bulkGet(tagLowers);
        const recordsByTagLower = new Map<string, HashtagHistoryRecord>();
        existingRecords.forEach((record) => {
            if (record) recordsByTagLower.set(record.tagLower, record);
        });

        const updatesByTagLower = new Map<string, HashtagHistoryRecord>();
        for (const tag of hashtags) {
            if (!tag) continue;
            if (tag.length > MAX_HASHTAG_LENGTH) continue;

            const tagLower = normalizeTag(tag);
            const existing = recordsByTagLower.get(tagLower);
            if (existing) {
                const updated = {
                    ...existing,
                    useCount: existing.useCount + 1,
                    lastUsed: timestamp,
                    updatedAt: timestamp,
                    schemaVersion: HASHTAG_HISTORY_SCHEMA_VERSION,
                };
                recordsByTagLower.set(tagLower, updated);
                updatesByTagLower.set(tagLower, updated);
            } else {
                const record = toRecord(tag, 1, timestamp, () => timestamp);
                recordsByTagLower.set(tagLower, record);
                updatesByTagLower.set(tagLower, record);
            }
        }

        const updates = [...updatesByTagLower.values()];
        if (updates.length === 0) return;

        await this.db.transaction("rw", this.db.hashtagHistory, async () => {
            await this.db.hashtagHistory.bulkPut(updates);
            await this.trimToMax();
        });
    }

    async getSuggestions(query: string): Promise<string[]> {
        await this.ensureLegacyHistoryMigrated();

        const queryLower = normalizeTag(query);
        const records = await this.db.hashtagHistory.toArray();
        return records
            .filter((record) => !queryLower || record.tagLower.includes(queryLower))
            .sort(sortSuggestions(query))
            .slice(0, MAX_HASHTAG_SUGGESTIONS)
            .map((record) => record.tag);
    }

    private async trimToMax(): Promise<void> {
        const records = await this.db.hashtagHistory.toArray();
        const overflow = records
            .sort(sortHistoryRecords)
            .slice(MAX_HASHTAG_HISTORY);

        if (overflow.length === 0) return;
        await this.db.hashtagHistory.bulkDelete(overflow.map((record) => record.tagLower));
    }

    private async ensureLegacyHistoryMigrated(): Promise<void> {
        const migrated = await this.db.meta.get(LEGACY_HASHTAG_HISTORY_MIGRATION_KEY);
        if (migrated?.value === true) return;

        const storage = this.getStorage();
        const legacyHistory = readLegacyHistory(storage);
        const recordsByTagLower = new Map<string, HashtagHistoryRecord>();

        for (const entry of legacyHistory) {
            if (!entry.tag || entry.tag.length > MAX_HASHTAG_LENGTH) continue;

            const tagLower = normalizeTag(entry.tag);
            const existing = recordsByTagLower.get(tagLower);
            const useCount = Math.max(1, entry.useCount ?? 1);
            if (!existing || entry.lastUsed > existing.lastUsed) {
                recordsByTagLower.set(tagLower, toRecord(entry.tag, useCount, entry.lastUsed, this.now));
            }
        }

        await this.db.transaction("rw", this.db.hashtagHistory, this.db.meta, async () => {
            const records = [...recordsByTagLower.values()]
                .sort(sortHistoryRecords)
                .slice(0, MAX_HASHTAG_HISTORY);
            if (records.length > 0) {
                await this.db.hashtagHistory.bulkPut(records);
            }
            await this.db.meta.put({
                key: LEGACY_HASHTAG_HISTORY_MIGRATION_KEY,
                value: true,
                updatedAt: this.now(),
            });
        });

        try {
            storage.removeItem(STORAGE_KEYS.HASHTAG_HISTORY);
        } catch {
            // Migration already succeeded; stale localStorage cleanup is best-effort.
        }
    }
}

export const hashtagHistoryRepository = new DexieHashtagHistoryRepository();
