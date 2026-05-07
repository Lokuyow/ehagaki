import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
    createCustomEmojiUsageRecord,
    createCustomEmojiUsageRecordId,
    getCustomEmojiUsageDisplayLimit,
    MAX_CUSTOM_EMOJI_USAGE_HISTORY,
    sortCustomEmojiUsageByFrequency,
    type CustomEmojiUsageItem,
} from "../../lib/customEmojiUsage";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexieCustomEmojiUsageRepository } from "../../lib/storage/customEmojiUsageRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-custom-emoji-usage-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

describe("customEmojiUsage", () => {
    let db: EHagakiDB;
    let nowValue: number;
    let repository: DexieCustomEmojiUsageRepository;

    beforeEach(() => {
        db = createTestDb();
        nowValue = 1000;
        repository = new DexieCustomEmojiUsageRepository(db, () => nowValue);
    });

    afterEach(async () => {
        db.close();
        for (const name of testDbNames) {
            await Dexie.delete(name);
        }
        testDbNames.clear();
    });

    it("uses pubkey + shortcodeLower + src as the recent record identity", () => {
        expect(createCustomEmojiUsageRecordId({
            pubkeyHex: "pubkey",
            shortcodeLower: "blobcat",
            src: "https://example.com/blobcat.webp",
        })).toBe("pubkey|blobcat|https%3A%2F%2Fexample.com%2Fblobcat.webp");
    });

    it("creates normalized records and preserves setAddress", () => {
        expect(createCustomEmojiUsageRecord({
            pubkeyHex: "pubkey",
            emoji: {
                shortcode: ":BlobCat:",
                src: "https://example.com/blobcat.webp",
                setAddress: "30030:pubkey:set",
            },
            now: 1234,
        })).toMatchObject({
            pubkeyHex: "pubkey",
            shortcode: "BlobCat",
            shortcodeLower: "blobcat",
            src: "https://example.com/blobcat.webp",
            setAddress: "30030:pubkey:set",
            lastUsedAt: 1234,
            count: 1,
        });
    });

    it("updates the same emoji URL + shortcode record", async () => {
        await repository.recordUse("pubkey", {
            shortcode: "BlobCat",
            src: "https://example.com/blobcat.webp",
            setAddress: "30030:pubkey:old",
        });
        nowValue = 2000;

        await repository.recordUse("pubkey", {
            shortcode: "blobcat",
            src: "https://example.com/blobcat.webp",
            setAddress: "30030:pubkey:new",
        });

        await expect(repository.getUsageHistory("pubkey")).resolves.toEqual([
            expect.objectContaining({
                shortcode: "blobcat",
                src: "https://example.com/blobcat.webp",
                setAddress: "30030:pubkey:new",
                lastUsedAt: 2000,
                count: 2,
            }),
        ]);
    });

    it("keeps same shortcode with different emoji URLs separate", async () => {
        await repository.recordUse("pubkey", {
            shortcode: "blobcat",
            src: "https://example.com/a.webp",
        });
        nowValue = 2000;
        await repository.recordUse("pubkey", {
            shortcode: "blobcat",
            src: "https://example.com/b.webp",
        });

        await expect(repository.getUsageHistory("pubkey")).resolves.toMatchObject([
            { shortcode: "blobcat", src: "https://example.com/b.webp", count: 1 },
            { shortcode: "blobcat", src: "https://example.com/a.webp", count: 1 },
        ]);
    });

    it("calculates the display limit from the current column count as two rows", () => {
        expect(getCustomEmojiUsageDisplayLimit(4)).toBe(8);
        expect(getCustomEmojiUsageDisplayLimit(20)).toBe(40);
        expect(getCustomEmojiUsageDisplayLimit(20.8)).toBe(40);
    });

    it("sorts frequent display items by count and then lastUsedAt", () => {
        const items: CustomEmojiUsageItem[] = [
            {
                identityKey: "newest",
                shortcode: "newest",
                shortcodeLower: "newest",
                src: "https://example.com/newest.webp",
                setAddress: null,
                lastUsedAt: 4000,
                count: 1,
            },
            {
                identityKey: "often",
                shortcode: "often",
                shortcodeLower: "often",
                src: "https://example.com/often.webp",
                setAddress: null,
                lastUsedAt: 3000,
                count: 2,
            },
            {
                identityKey: "newer",
                shortcode: "newer",
                shortcodeLower: "newer",
                src: "https://example.com/newer.webp",
                setAddress: null,
                lastUsedAt: 2000,
                count: 1,
            },
        ];

        expect(items.sort(sortCustomEmojiUsageByFrequency).map((item) => item.shortcode)).toEqual([
            "often",
            "newest",
            "newer",
        ]);
    });

    it("returns recent items in lastUsedAt order", async () => {
        await repository.recordUse("pubkey", {
            shortcode: "often",
            src: "https://example.com/often.webp",
        });
        nowValue = 2000;
        await repository.recordUse("pubkey", {
            shortcode: "newer",
            src: "https://example.com/newer.webp",
        });
        nowValue = 3000;
        await repository.recordUse("pubkey", {
            shortcode: "often",
            src: "https://example.com/often.webp",
        });
        nowValue = 4000;
        await repository.recordUse("pubkey", {
            shortcode: "newest",
            src: "https://example.com/newest.webp",
        });

        await expect(repository.getUsageHistory("pubkey")).resolves.toMatchObject([
            { shortcode: "newest", count: 1 },
            { shortcode: "often", count: 2 },
            { shortcode: "newer", count: 1 },
        ]);
    });

    it("returns same-count items in lastUsedAt descending order up to the history limit by default", async () => {
        for (let index = 1; index <= MAX_CUSTOM_EMOJI_USAGE_HISTORY + 1; index += 1) {
            nowValue = index * 1000;
            await repository.recordUse("pubkey", {
                shortcode: `emoji${index}`,
                src: `https://example.com/emoji${index}.webp`,
            });
        }

        const recent = await repository.getUsageHistory("pubkey");
        expect(recent).toHaveLength(MAX_CUSTOM_EMOJI_USAGE_HISTORY);
        expect(recent[0].shortcode).toBe("emoji101");
        expect(recent.at(-1)?.shortcode).toBe("emoji2");
    });

    it("trims stored history to the maximum history size", async () => {
        for (let index = 1; index <= MAX_CUSTOM_EMOJI_USAGE_HISTORY + 1; index += 1) {
            nowValue = index * 1000;
            await repository.recordUse("pubkey", {
                shortcode: `emoji${index}`,
                src: `https://example.com/emoji${index}.webp`,
            });
        }

        const records = await db.customEmojiUsage.where("pubkeyHex").equals("pubkey").toArray();
        expect(records).toHaveLength(MAX_CUSTOM_EMOJI_USAGE_HISTORY);
        expect(records.map((record) => record.shortcode)).not.toContain("emoji1");
    });
});
