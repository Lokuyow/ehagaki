import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
    createRecentCustomEmojiRecord,
    createRecentCustomEmojiRecordId,
    MAX_RECENT_CUSTOM_EMOJI_HISTORY,
    RECENT_CUSTOM_EMOJI_DISPLAY_LIMIT,
} from "../../lib/recentCustomEmoji";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexieRecentCustomEmojisRepository } from "../../lib/storage/recentCustomEmojisRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-recent-custom-emoji-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

describe("recentCustomEmoji", () => {
    let db: EHagakiDB;
    let nowValue: number;
    let repository: DexieRecentCustomEmojisRepository;

    beforeEach(() => {
        db = createTestDb();
        nowValue = 1000;
        repository = new DexieRecentCustomEmojisRepository(db, () => nowValue);
    });

    afterEach(async () => {
        db.close();
        for (const name of testDbNames) {
            await Dexie.delete(name);
        }
        testDbNames.clear();
    });

    it("uses pubkey + shortcodeLower + src as the recent record identity", () => {
        expect(createRecentCustomEmojiRecordId({
            pubkeyHex: "pubkey",
            shortcodeLower: "blobcat",
            src: "https://example.com/blobcat.webp",
        })).toBe("pubkey|blobcat|https%3A%2F%2Fexample.com%2Fblobcat.webp");
    });

    it("creates normalized records and preserves setAddress", () => {
        expect(createRecentCustomEmojiRecord({
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

        await expect(repository.getRecent("pubkey")).resolves.toEqual([
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

        await expect(repository.getRecent("pubkey")).resolves.toMatchObject([
            { shortcode: "blobcat", src: "https://example.com/b.webp", count: 1 },
            { shortcode: "blobcat", src: "https://example.com/a.webp", count: 1 },
        ]);
    });

    it("returns display recent items in lastUsedAt descending order with default limit 16", async () => {
        for (let index = 1; index <= RECENT_CUSTOM_EMOJI_DISPLAY_LIMIT + 1; index += 1) {
            nowValue = index * 1000;
            await repository.recordUse("pubkey", {
                shortcode: `emoji${index}`,
                src: `https://example.com/emoji${index}.webp`,
            });
        }

        const recent = await repository.getRecent("pubkey");
        expect(recent).toHaveLength(RECENT_CUSTOM_EMOJI_DISPLAY_LIMIT);
        expect(recent[0].shortcode).toBe("emoji17");
        expect(recent.at(-1)?.shortcode).toBe("emoji2");
    });

    it("trims stored history to the maximum history size", async () => {
        for (let index = 1; index <= MAX_RECENT_CUSTOM_EMOJI_HISTORY + 1; index += 1) {
            nowValue = index * 1000;
            await repository.recordUse("pubkey", {
                shortcode: `emoji${index}`,
                src: `https://example.com/emoji${index}.webp`,
            });
        }

        const records = await db.recentCustomEmojis.where("pubkeyHex").equals("pubkey").toArray();
        expect(records).toHaveLength(MAX_RECENT_CUSTOM_EMOJI_HISTORY);
        expect(records.map((record) => record.shortcode)).not.toContain("emoji1");
    });
});
