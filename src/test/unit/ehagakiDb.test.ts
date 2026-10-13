import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    EHAGAKI_DB_NAME,
    EHagakiDB,
} from "../../lib/storage/ehagakiDb";
import {
    EHAGAKI_DB_NATIVE_VERSION,
    EHAGAKI_DB_VERSION,
    POST_HISTORY_TIMELINE_INDEX,
} from "../../lib/storage/ehagakiDbConstants";
import { DexieEmojisRepository } from "../../lib/storage/emojisRepository";
import { DexieHashtagHistoryRepository } from "../../lib/storage/hashtagHistoryRepository";
import { DexieProfilesRepository } from "../../lib/storage/profilesRepository";
import { DexieRelayConfigsRepository } from "../../lib/storage/relayConfigsRepository";
import { createCustomEmojiItem, EMOJIS_CACHE_SCHEMA_VERSION } from "../../lib/customEmoji";
import { ensureCurrentEHagakiDbSchema } from "../../lib/swIndexedDbSchema";
import { migrateEhagakiIndexedDb } from "../../lib/storage/ehagakiDbMigration";
import { LEGACY_DRAFTS_IMPORT_ID } from "../../lib/storage/legacyImportMarkers";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

const V14_STORES = {
    meta: "key, updatedAt",
    emojiItems: "id, pubkeyHex, identityKey, shortcodeLower, sortIndex, sourceType, sourceAddress, fetchedAt, updatedAt, [pubkeyHex+sortIndex], [pubkeyHex+identityKey]",
    emojiCacheMeta: "pubkeyHex, fetchedAt, updatedAt, schemaVersion",
    drafts: "id, scopeKey, pubkeyHex, updatedAt, timestamp, [scopeKey+updatedAt]",
    profiles: "pubkeyHex, fetchedAt, updatedAt, updatedAtFromEvent, schemaVersion",
    relayConfigs: "pubkeyHex, fetchedAt, updatedAt, updatedAtFromEvent, schemaVersion",
    sharedMedia: "id, createdAt, updatedAt, schemaVersion",
    hashtagHistory: "tagLower, useCount, lastUsed, updatedAt, schemaVersion",
    customEmojiUsage: "id, pubkeyHex, shortcodeLower, src, lastUsedAt, count, updatedAt, schemaVersion, [pubkeyHex+lastUsedAt], [pubkeyHex+shortcodeLower+src]",
    customEmojiImageMeta: "url, width, height, aspectRatio, fetchedAt, lastAccessedAt, updatedAt, schemaVersion",
    uploadDestinations: "id, scopeKey, pubkeyHex, protocol, presetId, isDefault, enabled, updatedAt, [scopeKey+isDefault], [scopeKey+enabled]",
    postHistory: "id, eventId, pubkeyHex, kind, createdAt, postedAt, updatedAt, deletedAt, fetchedAt, lastSeenAt, schemaVersion, [pubkeyHex+postedAt], [pubkeyHex+createdAt]",
    postHistoryChildInteractions: "id, eventId, parentEventId, rootEventId, authorPubkey, kind, createdAt, fetchedAt, updatedAt, schemaVersion, [parentEventId+createdAt]",
    postHistoryDeletionRequests: "id, targetEventId, targetAuthorPubkey, deletionEventId, fetchedAt, [targetAuthorPubkey+targetEventId]",
    postMediaCache: "cacheKey, url, normalizedUrl, size, createdAt, lastAccessedAt, updatedAt, source, schemaVersion",
    channelMetadata: "channelEventId, fetchedAt, metadataCreatedAt, creatorPubkey, updatedAt, schemaVersion",
    channelImageCacheMeta: "url, responseType, fetchedAt, lastAttemptAt, lastAccessedAt, schemaVersion",
} as const;

function createV14Db(name: string): Dexie {
    const db = new Dexie(name);
    db.version(14).stores(V14_STORES);
    return db;
}

function upgradeWithSharedMigrator(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, EHAGAKI_DB_NATIVE_VERSION);
        request.onupgradeneeded = (event) => {
            migrateEhagakiIndexedDb(request.result, request.transaction, event.oldVersion);
        };
        request.onsuccess = () => {
            request.result.close();
            resolve();
        };
        request.onerror = () => reject(request.error);
    });
}

const V14_FIXTURES: Record<string, Record<string, unknown>> = {
    meta: { key: "fixture", updatedAt: 1 },
    emojiItems: { id: "emoji", pubkeyHex: "owner", updatedAt: 1 },
    emojiCacheMeta: { pubkeyHex: "owner", updatedAt: 1 },
    drafts: { id: "draft", scopeKey: "owner", updatedAt: 1 },
    profiles: { pubkeyHex: "owner", updatedAt: 1 },
    relayConfigs: { pubkeyHex: "owner", updatedAt: 1 },
    sharedMedia: { id: "latest", updatedAt: 1 },
    hashtagHistory: { tagLower: "nostr", updatedAt: 1 },
    customEmojiUsage: { id: "usage", pubkeyHex: "owner", updatedAt: 1 },
    customEmojiImageMeta: { url: "https://example.com/emoji.webp", updatedAt: 1 },
    uploadDestinations: { id: "upload", scopeKey: "owner", updatedAt: 1 },
    postHistory: {
        id: "event-v14",
        eventId: "event-v14",
        pubkeyHex: "owner",
        kind: 1,
        createdAt: 100,
        postedAt: 200,
        updatedAt: 1,
    },
    postHistoryChildInteractions: { id: "child", eventId: "child", updatedAt: 1 },
    postHistoryDeletionRequests: { id: "delete", targetEventId: "event-v14" },
    postMediaCache: { cacheKey: "media", url: "https://example.com/media", updatedAt: 1 },
    channelMetadata: { channelEventId: "channel", updatedAt: 1 },
    channelImageCacheMeta: { url: "https://example.com/channel.webp", updatedAt: 1 },
};

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("EHagakiDB", () => {
    it("uses logical v17 and native v170", () => {
        expect(EHAGAKI_DB_VERSION).toBe(17);
        expect(EHAGAKI_DB_NATIVE_VERSION).toBe(170);
    });

    it("opens one app database with currently used stores", async () => {
        const db = createTestDb();
        await db.open();

        expect(db.name).toBeTypeOf("string");
        expect(db.tables.map((table) => table.name).sort()).toEqual([
            "channelImageCacheMeta",
            "channelMetadata",
            "customEmojiImageMeta",
            "customEmojiUsage",
            "drafts",
            "emojiCacheMeta",
            "emojiItems",
            "hashtagHistory",
            "legacyImportState",
            "postHistory",
            "postHistoryAuthoredSyncCursor",
            "postHistoryChildInteractions",
            "postHistoryChildWriteGeneration",
            "postHistoryCitrineRanges",
            "postHistoryDeletionRequests",
            "postHistoryDirectReplyFetchMeta",
            "postHistoryExternalCoverage",
            "postHistoryInboundSyncCursor",
            "postHistoryJumpAnchors",
            "postHistoryLocalBrowsingRanges",
            "postHistoryLocalResumeCursor",
            "postHistoryReactionDeletionAttempts",
            "postHistoryReplyDeletionAttempts",
            "postHistoryWriteGeneration",
            "postMediaCache",
            "profiles",
            "relayConfigs",
            "sensitivePayloads",
            "sharedMedia",
            "uploadDestinations",
        ]);

        db.close();
    });

    it("v14 から表示用履歴だけを空にし draft と deletion request と marker を残す", async () => {
        const name = `${EHAGAKI_DB_NAME}-upgrade-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        testDbNames.add(name);
        const v14 = createV14Db(name);
        await v14.open();
        for (const [storeName, record] of Object.entries(V14_FIXTURES)) {
            await v14.table(storeName).put(structuredClone(record));
        }
        await v14.table("meta").put({
            key: LEGACY_DRAFTS_IMPORT_ID,
            value: true,
            updatedAt: 4,
        });
        await v14.table("meta").put({
            key: "postHistoryLocalRevision:owner",
            value: 9,
            updatedAt: 4,
        });
        v14.close();

        await upgradeWithSharedMigrator(name);
        const upgraded = new EHagakiDB(name);
        await upgraded.open();
        expect(upgraded.backendDB().version).toBe(170);
        expect(upgraded.backendDB().objectStoreNames.contains("meta")).toBe(false);
        expect(upgraded.postHistory.schema.idxByName[POST_HISTORY_TIMELINE_INDEX]).toBeDefined();
        await expect(upgraded.postHistory.count()).resolves.toBe(0);
        await expect(upgraded.postHistoryChildInteractions.count()).resolves.toBe(0);
        await expect(upgraded.drafts.get("draft")).resolves.toMatchObject({ id: "draft" });
        await expect(upgraded.postHistoryDeletionRequests.get("delete")).resolves.toMatchObject({
            targetEventId: "event-v14",
        });
        await expect(upgraded.sharedMedia.get("latest")).resolves.toMatchObject({ id: "latest" });
        await expect(upgraded.legacyImportState.get(LEGACY_DRAFTS_IMPORT_ID)).resolves.toMatchObject({
            done: true,
            updatedAt: 4,
        });
        await expect(upgraded.postHistoryWriteGeneration.count()).resolves.toBe(0);
        upgraded.close();
    });

    it("versionless 作成のあと open(170) は sharedMedia を残し履歴消去を再実行しない", async () => {
        const name = `${EHAGAKI_DB_NAME}-versionless-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        testDbNames.add(name);
        const created = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(name);
            request.onupgradeneeded = (event) => {
                migrateEhagakiIndexedDb(request.result, request.transaction, event.oldVersion);
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        await new Promise<void>((resolve, reject) => {
            const tx = created.transaction(["sharedMedia", "postHistory"], "readwrite");
            tx.objectStore("sharedMedia").put({ id: "latest", updatedAt: 1 });
            tx.objectStore("postHistory").put({
                id: "kept",
                eventId: "kept",
                pubkeyHex: "owner",
                createdAt: 1,
                postedAt: 1,
                updatedAt: 1,
            });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
        created.close();

        await upgradeWithSharedMigrator(name);
        const upgraded = new EHagakiDB(name);
        await upgraded.open();
        expect(upgraded.backendDB().version).toBe(170);
        await expect(upgraded.sharedMedia.get("latest")).resolves.toMatchObject({ id: "latest" });
        await expect(upgraded.postHistory.get("kept")).resolves.toMatchObject({ eventId: "kept" });
        upgraded.close();
    });

    it("Service Worker先行でもDexie先行でもnative v170の同じschemaを開く", async () => {
        const swFirstName = `${EHAGAKI_DB_NAME}-sw-first-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const dexieFirstName = `${EHAGAKI_DB_NAME}-dexie-first-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        testDbNames.add(swFirstName);
        testDbNames.add(dexieFirstName);

        const swFirstRaw = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(swFirstName, EHAGAKI_DB_NATIVE_VERSION);
            request.onupgradeneeded = () => ensureCurrentEHagakiDbSchema(
                request.result,
                "sharedMedia",
                request.transaction,
            );
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        swFirstRaw.close();
        const swFirstDexie = new EHagakiDB(swFirstName);
        await swFirstDexie.open();
        expect(swFirstDexie.postHistory.schema.idxByName[POST_HISTORY_TIMELINE_INDEX])
            .toBeDefined();
        expect(swFirstDexie.sensitivePayloads).toBeDefined();
        swFirstDexie.close();

        const dexieFirst = new EHagakiDB(dexieFirstName);
        await dexieFirst.open();
        dexieFirst.close();
        const dexieFirstRaw = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(dexieFirstName, EHAGAKI_DB_NATIVE_VERSION);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        const indexNames = dexieFirstRaw
            .transaction("postHistory")
            .objectStore("postHistory")
            .indexNames;
        expect(indexNames.contains(POST_HISTORY_TIMELINE_INDEX)).toBe(true);
        expect(dexieFirstRaw.objectStoreNames.contains("sensitivePayloads")).toBe(true);
        dexieFirstRaw.close();
    });

    it("blocked では要求を待ってから upgrade を完了する", async () => {
        const name = `${EHAGAKI_DB_NAME}-blocked-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        testDbNames.add(name);
        const v14 = createV14Db(name);
        await v14.open();
        await v14.table("drafts").put(V14_FIXTURES.drafts);
        await v14.table("postHistory").put(V14_FIXTURES.postHistory);
        v14.close();

        const blocker = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(name, 140);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        blocker.onversionchange = () => undefined;

        let settled = false;
        const opening = upgradeWithSharedMigrator(name).then(() => {
            settled = true;
        });
        await new Promise((resolve) => setTimeout(resolve, 20));
        expect(settled).toBe(false);

        blocker.close();
        await opening;
        const upgraded = new EHagakiDB(name);
        await upgraded.open();
        expect(upgraded.backendDB().version).toBe(170);
        await expect(upgraded.drafts.get("draft")).resolves.toMatchObject({ id: "draft" });
        await expect(upgraded.postHistory.count()).resolves.toBe(0);
        upgraded.close();
    });

    it("v14 Dexie connection は versionchange を受けて閉じ upgrade を妨げない", async () => {
        const name = `${EHAGAKI_DB_NAME}-versionchange-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        testDbNames.add(name);
        const v14 = createV14Db(name);
        await v14.open();
        const versionChanged = new Promise<void>((resolve) => {
            v14.on("versionchange", () => resolve());
        });

        const opening = upgradeWithSharedMigrator(name);
        await versionChanged;
        await opening;

        expect(v14.isOpen()).toBe(false);
        const upgraded = new EHagakiDB(name);
        await upgraded.open();
        expect(upgraded.backendDB().version).toBe(170);
        upgraded.close();
    });

    it("native v140 の VersionError 後もDBを削除せずv170で再openできる", async () => {
        const db = createTestDb();
        await db.drafts.put(V14_FIXTURES.drafts as never);
        await db.open();
        const name = db.name;
        db.close();

        const versionError = await new Promise<DOMException | null>((resolve) => {
            const request = indexedDB.open(name, 140);
            request.onsuccess = () => {
                request.result.close();
                resolve(null);
            };
            request.onerror = () => resolve(request.error);
        });
        expect(versionError?.name).toBe("VersionError");

        const reopened = new EHagakiDB(name);
        await reopened.open();
        expect(reopened.backendDB().version).toBe(170);
        await expect(reopened.drafts.get("draft")).resolves.toMatchObject({ id: "draft" });
        reopened.close();
    });

    it("v17 upgrade transaction が失敗してもv14 DBとrecordを維持する", async () => {
        const name = `${EHAGAKI_DB_NAME}-abort-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        testDbNames.add(name);
        const v14 = createV14Db(name);
        await v14.open();
        await v14.table("drafts").put(V14_FIXTURES.drafts);
        await v14.table("postHistory").put(V14_FIXTURES.postHistory);
        v14.close();

        const upgradeError = await new Promise<DOMException | null>((resolve) => {
            const request = indexedDB.open(name, EHAGAKI_DB_NATIVE_VERSION);
            request.onupgradeneeded = () => request.transaction?.abort();
            request.onsuccess = () => {
                request.result.close();
                resolve(null);
            };
            request.onerror = () => resolve(request.error);
        });
        expect(upgradeError?.name).toBe("AbortError");

        const unchanged = createV14Db(name);
        await unchanged.open();
        expect(unchanged.backendDB().version).toBe(140);
        await expect(unchanged.table("drafts").get("draft")).resolves.toMatchObject({ id: "draft" });
        await expect(unchanged.table("postHistory").get("event-v14")).resolves.toMatchObject({
            eventId: "event-v14",
        });
        unchanged.close();
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

    it("stores hashtag history with use counts", async () => {
        const db = createTestDb();
        const repository = new DexieHashtagHistoryRepository(db, () => 1234, () => ({
            getItem: () => null,
            removeItem: () => undefined,
        }));

        await repository.save(["Nostr"]);
        await repository.save(["nostr"]);

        await expect(repository.getAll()).resolves.toEqual([
            { tag: "Nostr", lastUsed: 1234, useCount: 2 },
        ]);

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
