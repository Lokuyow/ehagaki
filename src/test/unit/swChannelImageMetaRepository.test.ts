import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { EHAGAKI_DB_NATIVE_VERSION } from "../../lib/storage/ehagakiDbConstants";
import { ServiceWorkerChannelImageMetaRepository } from "../../lib/swChannelImageMetaRepository";
import { ensureCurrentEHagakiDbSchema } from "../../lib/swIndexedDbSchema";

const databaseNames = new Set<string>();

afterEach(async () => {
    for (const name of databaseNames) await Dexie.delete(name);
    databaseNames.clear();
});

describe("ServiceWorkerChannelImageMetaRepository", () => {
    it("Dexieと共有するversion 14 schemaで認可metadataと画像metadataを読み書きする", async () => {
        const name = `channel-image-meta-${Date.now()}-${Math.random()}`;
        databaseNames.add(name);
        const db = new EHagakiDB(name);
        await db.channelMetadata.put({
            channelEventId: "a".repeat(64),
            name: "General",
            about: null,
            picture: "https://images.example.com/channel.png",
            relays: [],
            relayHints: [],
            resolutionQuality: "verified-metadata",
            updatedAt: 1,
            schemaVersion: 2,
        });
        db.close();

        const repository = new ServiceWorkerChannelImageMetaRepository(
            indexedDB,
            name,
            EHAGAKI_DB_NATIVE_VERSION,
            ensureCurrentEHagakiDbSchema,
        );
        await expect(repository.getChannelMetadata("a".repeat(64)))
            .resolves.toMatchObject({
                resolutionQuality: "verified-metadata",
                picture: "https://images.example.com/channel.png",
            });

        const metadata = {
            url: "https://images.example.com/channel.png",
            responseType: "readable" as const,
            verifiedSize: 123,
            fetchedAt: 10,
            lastAttemptAt: 10,
            lastAccessedAt: 10,
            schemaVersion: 1,
        };
        await repository.put(metadata);
        await expect(repository.get(metadata.url)).resolves.toEqual(metadata);
        await expect(repository.getAll()).resolves.toEqual([metadata]);
        await repository.delete(metadata.url);
        await expect(repository.get(metadata.url)).resolves.toBeNull();
    });

    it("SWが先にversion 14 DBを作成してもDexieが同じschemaを開ける", async () => {
        const name = `channel-image-meta-sw-first-${Date.now()}-${Math.random()}`;
        databaseNames.add(name);
        const repository = new ServiceWorkerChannelImageMetaRepository(
            indexedDB,
            name,
            EHAGAKI_DB_NATIVE_VERSION,
            ensureCurrentEHagakiDbSchema,
        );
        await expect(repository.getChannelMetadata("b".repeat(64)))
            .resolves.toBeNull();

        const db = new EHagakiDB(name);
        await expect(db.open()).resolves.toBe(db);
        expect(db.tables.map((table) => table.name)).toContain("channelImageCacheMeta");
        expect(db.tables.map((table) => table.name)).toContain(
            "postHistoryChildInteractions",
        );
        expect(db.tables.map((table) => table.name)).toContain(
            "postHistoryDeletionRequests",
        );
        db.close();
    });
});
