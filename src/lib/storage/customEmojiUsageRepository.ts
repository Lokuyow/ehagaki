import {
    createCustomEmojiUsageRecord,
    createCustomEmojiUsageRecordId,
    MAX_CUSTOM_EMOJI_USAGE_HISTORY,
    sortCustomEmojiUsageByRecency,
    toCustomEmojiUsageItem,
    type CustomEmojiSelection,
    type CustomEmojiUsageItem,
} from "../customEmojiUsage";
import { ehagakiDb, type EHagakiDB, type CustomEmojiUsageRecord } from "./ehagakiDb";

export interface CustomEmojiUsageRepository {
    getUsageHistory(pubkeyHex: string, limit?: number): Promise<CustomEmojiUsageItem[]>;
    recordUse(pubkeyHex: string, emoji: CustomEmojiSelection): Promise<CustomEmojiUsageItem[]>;
}

export class DexieCustomEmojiUsageRepository implements CustomEmojiUsageRepository {
    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
    ) { }

    async getUsageHistory(
        pubkeyHex: string,
        limit = MAX_CUSTOM_EMOJI_USAGE_HISTORY,
    ): Promise<CustomEmojiUsageItem[]> {
        if (!pubkeyHex || limit <= 0) return [];

        const records = await this.db.customEmojiUsage
            .where("pubkeyHex")
            .equals(pubkeyHex)
            .toArray();

        return records
            .sort(sortCustomEmojiUsageByRecency)
            .slice(0, limit)
            .map(toCustomEmojiUsageItem);
    }

    async recordUse(pubkeyHex: string, emoji: CustomEmojiSelection): Promise<CustomEmojiUsageItem[]> {
        if (!pubkeyHex) return [];

        const timestamp = this.now();
        const shortcodeLower = String(emoji.shortcode ?? "").replace(/^:+|:+$/g, "").trim().toLowerCase();
        if (!shortcodeLower || !emoji.src) return this.getUsageHistory(pubkeyHex);

        const id = createCustomEmojiUsageRecordId({
            pubkeyHex,
            shortcodeLower,
            src: emoji.src,
        });
        const existing = await this.db.customEmojiUsage.get(id);
        const record = createCustomEmojiUsageRecord({
            pubkeyHex,
            emoji,
            existing,
            now: timestamp,
        });
        if (!record) return this.getUsageHistory(pubkeyHex);

        await this.db.transaction("rw", this.db.customEmojiUsage, async () => {
            await this.db.customEmojiUsage.put(record);
            await this.trimToMax(pubkeyHex);
        });

        return this.getUsageHistory(pubkeyHex);
    }

    private async trimToMax(pubkeyHex: string): Promise<void> {
        const records = await this.db.customEmojiUsage
            .where("pubkeyHex")
            .equals(pubkeyHex)
            .toArray();
        const overflow = records
            .sort(sortCustomEmojiUsageByRecency)
            .slice(MAX_CUSTOM_EMOJI_USAGE_HISTORY);

        if (overflow.length === 0) return;
        await this.db.customEmojiUsage.bulkDelete(
            overflow.map((record: CustomEmojiUsageRecord) => record.id),
        );
    }
}

export const customEmojiUsageRepository = new DexieCustomEmojiUsageRepository();
