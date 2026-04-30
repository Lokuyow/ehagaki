import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB, SHARED_MEDIA_RECORD_ID } from "../../lib/storage/ehagakiDb";
import { DexieSharedMediaRepository } from "../../lib/storage/sharedMediaRepository";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-shared-media-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("DexieSharedMediaRepository", () => {
    it("stores File data as ArrayBuffer records and restores File instances", async () => {
        const db = createTestDb();
        const repository = new DexieSharedMediaRepository(db, () => 1234);
        const file = new File(["image-bytes"], "share.jpg", {
            type: "image/jpeg",
            lastModified: 1000,
        });

        await repository.putLatest({
            images: [file],
            metadata: [{ name: "share.jpg", type: "image/jpeg", size: file.size, timestamp: "2026-04-30T00:00:00.000Z" }],
        });

        const record = await db.sharedMedia.get(SHARED_MEDIA_RECORD_ID);
        expect(record).toMatchObject({
            id: SHARED_MEDIA_RECORD_ID,
            createdAt: 1234,
            updatedAt: 1234,
            schemaVersion: 1,
        });
        expect(record?.images[0]).toMatchObject({
            name: "share.jpg",
            type: "image/jpeg",
            size: file.size,
            lastModified: 1000,
        });
        expect(record?.images[0].arrayBuffer.byteLength).toBe(file.size);

        const restored = await repository.getLatest();
        expect(restored?.images).toHaveLength(1);
        expect(restored?.images[0]).toBeInstanceOf(File);
        expect(restored?.images[0].name).toBe("share.jpg");
        expect(restored?.images[0].type).toBe("image/jpeg");
        expect(restored?.images[0].size).toBe(file.size);
        expect(restored?.metadata).toEqual([
            { name: "share.jpg", type: "image/jpeg", size: file.size, timestamp: "2026-04-30T00:00:00.000Z" },
        ]);

        db.close();
    });

    it("uses the latest record as the shared media existence marker and clears it after read", async () => {
        const db = createTestDb();
        const repository = new DexieSharedMediaRepository(db, () => 1234);

        await expect(repository.getLatest()).resolves.toBeNull();

        await repository.putLatest({
            images: [new File(["x"], "x.png", { type: "image/png" })],
        });
        await expect(db.sharedMedia.get(SHARED_MEDIA_RECORD_ID)).resolves.toBeDefined();

        const media = await repository.getAndClearLatest();
        expect(media?.images[0].name).toBe("x.png");
        await expect(db.sharedMedia.get(SHARED_MEDIA_RECORD_ID)).resolves.toBeUndefined();

        db.close();
    });
});
