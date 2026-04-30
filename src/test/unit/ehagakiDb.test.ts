import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexieEmojisRepository } from "../../lib/storage/emojisRepository";
import { createCustomEmojiItem, EMOJIS_CACHE_SCHEMA_VERSION } from "../../lib/customEmoji";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("EHagakiDB", () => {
    it("opens one app database with currently used stores", async () => {
        const db = createTestDb();
        await db.open();

        expect(db.name).toBeTypeOf("string");
        expect(db.tables.map((table) => table.name).sort()).toEqual([
            "drafts",
            "emojiCacheMeta",
            "emojiItems",
            "meta",
        ]);

        db.close();
    });

    it("stores NIP-51 emojis by pubkeyHex", async () => {
        const db = createTestDb();
        const repository = new DexieEmojisRepository(db, () => 1234);
        const item = createCustomEmojiItem({
            shortcode: "blobcat",
            src: "https://example.com/blobcat.webp",
            sortIndex: 0,
        });
        if (!item) throw new Error("Invalid emoji fixture");

        await repository.put("pubkey", [item]);

        await expect(repository.get("pubkey")).resolves.toEqual({
            meta: {
                pubkeyHex: "pubkey",
                fetchedAt: 1234,
                updatedAt: 1234,
                schemaVersion: EMOJIS_CACHE_SCHEMA_VERSION,
            },
            items: [item],
        });

        db.close();
    });

    it("treats IndexedDB failures as cache misses", async () => {
        const db = createTestDb();
        db.close();
        const repository = new DexieEmojisRepository(db);
        await Dexie.delete(db.name);

        await expect(repository.get("pubkey")).resolves.toBeNull();
    });
});
