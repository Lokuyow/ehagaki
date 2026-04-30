import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexieEmojisRepository } from "../../lib/storage/emojisRepository";
import { DexieProfilesRepository } from "../../lib/storage/profilesRepository";
import { DexieRelayConfigsRepository } from "../../lib/storage/relayConfigsRepository";
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
            "profiles",
            "relayConfigs",
            "sharedMedia",
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

    it("stores profiles by pubkeyHex", async () => {
        const db = createTestDb();
        const repository = new DexieProfilesRepository(db, () => 1234);

        await repository.put("pubkey", {
            name: "alice",
            displayName: "Alice",
            picture: "https://example.com/alice.png?profile=true",
            npub: "npub1alice",
            nprofile: "nprofile1alice",
            profileRelays: ["wss://relay.example.com/"],
            fetchedAt: 1000,
            updatedAtFromEvent: 900,
        });

        await expect(repository.get("pubkey")).resolves.toEqual({
            name: "alice",
            displayName: "Alice",
            picture: "https://example.com/alice.png?profile=true",
            npub: "npub1alice",
            nprofile: "nprofile1alice",
            profileRelays: ["wss://relay.example.com/"],
            fetchedAt: 1000,
            updatedAtFromEvent: 900,
        });

        db.close();
    });

    it("stores relay configs with read/write relay lists by pubkeyHex", async () => {
        const db = createTestDb();
        const repository = new DexieRelayConfigsRepository(db, () => 1234);
        const config = {
            "wss://read.example.com/": { read: true, write: false },
            "wss://write.example.com/": { read: false, write: true },
            "wss://both.example.com/": { read: true, write: true },
        };

        await repository.put("pubkey", config, {
            source: "kind10002",
            updatedAtFromEvent: 900,
        });

        await expect(repository.get("pubkey")).resolves.toEqual({
            config,
            readRelays: ["wss://read.example.com/", "wss://both.example.com/"],
            writeRelays: ["wss://write.example.com/", "wss://both.example.com/"],
            source: "kind10002",
            fetchedAt: 1234,
            updatedAtFromEvent: 900,
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
