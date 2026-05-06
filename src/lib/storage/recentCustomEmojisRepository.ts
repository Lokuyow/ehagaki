import {
    createRecentCustomEmojiRecord,
    createRecentCustomEmojiRecordId,
    MAX_RECENT_CUSTOM_EMOJI_HISTORY,
    sortRecentCustomEmojiRecords,
    toRecentCustomEmojiItem,
    type CustomEmojiSelection,
    type RecentCustomEmojiItem,
} from "../recentCustomEmoji";
import { ehagakiDb, type EHagakiDB, type RecentCustomEmojiRecord } from "./ehagakiDb";

export interface RecentCustomEmojisRepository {
    getRecent(pubkeyHex: string, limit?: number): Promise<RecentCustomEmojiItem[]>;
    recordUse(pubkeyHex: string, emoji: CustomEmojiSelection): Promise<RecentCustomEmojiItem[]>;
}

export class DexieRecentCustomEmojisRepository implements RecentCustomEmojisRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async getRecent(
        pubkeyHex: string,
        limit = MAX_RECENT_CUSTOM_EMOJI_HISTORY,
    ): Promise<RecentCustomEmojiItem[]> {
        if (!pubkeyHex || limit <= 0) return [];

        const records = await this.db.recentCustomEmojis
            .where("pubkeyHex")
            .equals(pubkeyHex)
            .toArray();

        return records
            .sort(sortRecentCustomEmojiRecords)
            .slice(0, limit)
            .map(toRecentCustomEmojiItem);
    }

    async recordUse(pubkeyHex: string, emoji: CustomEmojiSelection): Promise<RecentCustomEmojiItem[]> {
        if (!pubkeyHex) return [];

        const timestamp = this.now();
        const shortcodeLower = String(emoji.shortcode ?? "").replace(/^:+|:+$/g, "").trim().toLowerCase();
        if (!shortcodeLower || !emoji.src) return this.getRecent(pubkeyHex);

        const id = createRecentCustomEmojiRecordId({
            pubkeyHex,
            shortcodeLower,
            src: emoji.src,
        });
        const existing = await this.db.recentCustomEmojis.get(id);
        const record = createRecentCustomEmojiRecord({
            pubkeyHex,
            emoji,
            existing,
            now: timestamp,
        });
        if (!record) return this.getRecent(pubkeyHex);

        await this.db.transaction("rw", this.db.recentCustomEmojis, async () => {
            await this.db.recentCustomEmojis.put(record);
            await this.trimToMax(pubkeyHex);
        });

        return this.getRecent(pubkeyHex);
    }

    private async trimToMax(pubkeyHex: string): Promise<void> {
        const records = await this.db.recentCustomEmojis
            .where("pubkeyHex")
            .equals(pubkeyHex)
            .toArray();
        const overflow = records
            .sort(sortRecentCustomEmojiRecords)
            .slice(MAX_RECENT_CUSTOM_EMOJI_HISTORY);

        if (overflow.length === 0) return;
        await this.db.recentCustomEmojis.bulkDelete(
            overflow.map((record: RecentCustomEmojiRecord) => record.id),
        );
    }
}

export const recentCustomEmojisRepository = new DexieRecentCustomEmojisRepository();
