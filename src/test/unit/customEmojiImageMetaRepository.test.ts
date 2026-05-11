import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import {
    CUSTOM_EMOJI_IMAGE_META_SCHEMA_VERSION,
    DexieCustomEmojiImageMetaRepository,
} from "../../lib/storage/customEmojiImageMetaRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-custom-emoji-image-meta-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

describe("DexieCustomEmojiImageMetaRepository", () => {
    let db: EHagakiDB;
    let nowValue: number;
    let repository: DexieCustomEmojiImageMetaRepository;

    beforeEach(() => {
        db = createTestDb();
        nowValue = 1000;
        repository = new DexieCustomEmojiImageMetaRepository(db, () => nowValue);
    });

    afterEach(async () => {
        db.close();

        for (const name of testDbNames) {
            await Dexie.delete(name);
        }

        testDbNames.clear();
    });

    it("stores image dimensions and computed aspect ratio by url", async () => {
        await repository.upsert({
            url: "https://example.com/blobcat.webp",
            width: 96,
            height: 48,
        });

        await expect(
            repository.get("https://example.com/blobcat.webp"),
        ).resolves.toEqual({
            url: "https://example.com/blobcat.webp",
            width: 96,
            height: 48,
            aspectRatio: 2,
            fetchedAt: 1000,
            lastAccessedAt: 1000,
            updatedAt: 1000,
            schemaVersion: CUSTOM_EMOJI_IMAGE_META_SCHEMA_VERSION,
        });
    });

    it("ignores invalid widths and heights", async () => {
        await expect(
            repository.upsert({
                url: "https://example.com/blobcat.webp",
                width: 0,
                height: 48,
            }),
        ).resolves.toBeNull();
        await expect(
            repository.upsert({
                url: "https://example.com/blobcat.webp",
                width: 48.5,
                height: 48,
            }),
        ).resolves.toBeNull();

        await expect(
            repository.get("https://example.com/blobcat.webp"),
        ).resolves.toBeNull();
    });

    it("loads multiple records and updates last accessed timestamps", async () => {
        await repository.upsert({
            url: "https://example.com/a.webp",
            width: 96,
            height: 48,
        });
        nowValue = 1100;
        await repository.upsert({
            url: "https://example.com/b.webp",
            width: 48,
            height: 48,
        });
        nowValue = 1200;

        const result = await repository.getMany([
            "https://example.com/a.webp",
            "https://example.com/b.webp",
            "not-a-url",
        ]);

        expect(Object.keys(result).sort()).toEqual([
            "https://example.com/a.webp",
            "https://example.com/b.webp",
        ]);

        await repository.touchMany([
            "https://example.com/a.webp",
            "https://example.com/b.webp",
        ]);

        await expect(repository.get("https://example.com/a.webp")).resolves.toMatchObject({
            lastAccessedAt: 1200,
            updatedAt: 1200,
        });
        await expect(repository.get("https://example.com/b.webp")).resolves.toMatchObject({
            lastAccessedAt: 1200,
            updatedAt: 1200,
        });
    });

    it("prunes least recently accessed records when the max size is exceeded", async () => {
        repository = new DexieCustomEmojiImageMetaRepository(
            db,
            () => nowValue,
            2,
            90 * 24 * 60 * 60 * 1000,
        );

        await repository.upsert({
            url: "https://example.com/old.webp",
            width: 32,
            height: 32,
            lastAccessedAt: 900,
        });
        nowValue = 1100;
        await repository.upsert({
            url: "https://example.com/middle.webp",
            width: 48,
            height: 48,
            lastAccessedAt: 1000,
        });
        nowValue = 1200;
        await repository.upsert({
            url: "https://example.com/new.webp",
            width: 64,
            height: 32,
            lastAccessedAt: 1200,
        });

        const result = await repository.getMany([
            "https://example.com/old.webp",
            "https://example.com/middle.webp",
            "https://example.com/new.webp",
        ]);

        expect(Object.keys(result).sort()).toEqual([
            "https://example.com/middle.webp",
            "https://example.com/new.webp",
        ]);
    });

    it("prunes expired records by lastAccessedAt", async () => {
        repository = new DexieCustomEmojiImageMetaRepository(db, () => nowValue, 10, 100);

        await repository.upsert({
            url: "https://example.com/stale.webp",
            width: 64,
            height: 64,
            lastAccessedAt: 800,
        });
        nowValue = 1000;
        await repository.upsert({
            url: "https://example.com/fresh.webp",
            width: 64,
            height: 32,
            lastAccessedAt: 1150,
        });
        nowValue = 1200;

        await repository.prune();

        await expect(repository.get("https://example.com/stale.webp")).resolves.toBeNull();
        await expect(repository.get("https://example.com/fresh.webp")).resolves.toMatchObject({
            aspectRatio: 2,
        });
    });
});