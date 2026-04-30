import { ehagakiDb, type EHagakiDB, type EmojiCacheMetaRecord } from "./ehagakiDb";
import {
    createCustomEmojiRecordId,
    EMOJIS_CACHE_SCHEMA_VERSION,
    type CustomEmojiItem,
} from "../customEmoji";

export interface EmojisRepository {
    get(pubkeyHex: string): Promise<{ meta: EmojiCacheMetaRecord | null; items: CustomEmojiItem[] } | null>;
    put(pubkeyHex: string, items: CustomEmojiItem[]): Promise<void>;
    delete(pubkeyHex: string): Promise<void>;
}

export class DexieEmojisRepository implements EmojisRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async get(pubkeyHex: string): Promise<{ meta: EmojiCacheMetaRecord | null; items: CustomEmojiItem[] } | null> {
        if (!pubkeyHex) return null;

        try {
            const meta = await this.db.emojiCacheMeta.get(pubkeyHex) ?? null;
            if (!meta || meta.schemaVersion !== EMOJIS_CACHE_SCHEMA_VERSION) {
                return { meta, items: [] };
            }

            const records = await this.db.emojiItems
                .where("pubkeyHex")
                .equals(pubkeyHex)
                .sortBy("sortIndex");

            return {
                meta,
                items: records.map((record) => ({
                    identityKey: record.identityKey,
                    shortcode: record.shortcode,
                    shortcodeLower: record.shortcodeLower,
                    src: record.src,
                    setAddress: record.setAddress,
                    sortIndex: record.sortIndex,
                    sourceType: record.sourceType,
                    sourceAddress: record.sourceAddress,
                })),
            };
        } catch {
            return null;
        }
    }

    async put(pubkeyHex: string, items: CustomEmojiItem[]): Promise<void> {
        if (!pubkeyHex) return;

        const timestamp = this.now();
        try {
            await this.db.transaction("rw", this.db.emojiItems, this.db.emojiCacheMeta, async () => {
                await this.db.emojiItems.where("pubkeyHex").equals(pubkeyHex).delete();
                await this.db.emojiItems.bulkPut(
                    items.map((item, index) => ({
                        id: createCustomEmojiRecordId(pubkeyHex, item.identityKey),
                        pubkeyHex,
                        identityKey: item.identityKey,
                        shortcode: item.shortcode,
                        shortcodeLower: item.shortcodeLower,
                        src: item.src,
                        setAddress: item.setAddress,
                        sortIndex: index,
                        sourceType: item.sourceType,
                        sourceAddress: item.sourceAddress,
                        fetchedAt: timestamp,
                        updatedAt: timestamp,
                    })),
                );
                await this.db.emojiCacheMeta.put({
                    pubkeyHex,
                    fetchedAt: timestamp,
                    updatedAt: timestamp,
                    schemaVersion: EMOJIS_CACHE_SCHEMA_VERSION,
                });
            });
        } catch {
            // Custom emoji metadata is a best-effort cache.
        }
    }

    async delete(pubkeyHex: string): Promise<void> {
        if (!pubkeyHex) return;

        try {
            await this.db.transaction("rw", this.db.emojiItems, this.db.emojiCacheMeta, async () => {
                await this.db.emojiItems.where("pubkeyHex").equals(pubkeyHex).delete();
                await this.db.emojiCacheMeta.delete(pubkeyHex);
            });
        } catch {
            // Best-effort cache cleanup.
        }
    }
}

export const emojisRepository = new DexieEmojisRepository();
