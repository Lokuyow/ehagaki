import { ehagakiDb, type EHagakiDB, type EmojisRecord } from "./ehagakiDb";
import type { CustomEmojiItem } from "../customEmoji";

const EMOJIS_SCHEMA_VERSION = 1;

export interface EmojisRepository {
    get(pubkeyHex: string): Promise<EmojisRecord | null>;
    put(pubkeyHex: string, items: CustomEmojiItem[]): Promise<void>;
    delete(pubkeyHex: string): Promise<void>;
}

export class DexieEmojisRepository implements EmojisRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async get(pubkeyHex: string): Promise<EmojisRecord | null> {
        if (!pubkeyHex) return null;

        try {
            return await this.db.emojis.get(pubkeyHex) ?? null;
        } catch {
            return null;
        }
    }

    async put(pubkeyHex: string, items: CustomEmojiItem[]): Promise<void> {
        if (!pubkeyHex) return;

        const timestamp = this.now();
        try {
            await this.db.emojis.put({
                pubkeyHex,
                items,
                fetchedAt: timestamp,
                updatedAt: timestamp,
                schemaVersion: EMOJIS_SCHEMA_VERSION,
            });
        } catch {
            // Custom emoji metadata is a best-effort cache.
        }
    }

    async delete(pubkeyHex: string): Promise<void> {
        if (!pubkeyHex) return;

        try {
            await this.db.emojis.delete(pubkeyHex);
        } catch {
            // Best-effort cache cleanup.
        }
    }
}

export const emojisRepository = new DexieEmojisRepository();
