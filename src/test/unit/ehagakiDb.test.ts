import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    EHAGAKI_DB_NAME,
    EHagakiDB,
    subscribeEHagakiDbUpgradeBlocked,
    subscribeEHagakiDbUpgradeState,
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

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

const V15_STORES = {
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
    postHistory: "id, eventId, pubkeyHex, kind, createdAt, postedAt, updatedAt, deletedAt, fetchedAt, lastSeenAt, schemaVersion, [pubkeyHex+postedAt], [pubkeyHex+createdAt], [pubkeyHex+postedAt+createdAt+eventId]",
    postHistoryChildInteractions: "id, eventId, parentEventId, rootEventId, authorPubkey, kind, createdAt, fetchedAt, updatedAt, schemaVersion, [parentEventId+createdAt]",
    postHistoryDeletionRequests: "id, targetEventId, targetAuthorPubkey, deletionEventId, fetchedAt, [targetAuthorPubkey+targetEventId]",
    postMediaCache: "cacheKey, url, normalizedUrl, size, createdAt, lastAccessedAt, updatedAt, source, schemaVersion",
    channelMetadata: "channelEventId, fetchedAt, metadataCreatedAt, creatorPubkey, updatedAt, schemaVersion",
    channelImageCacheMeta: "url, responseType, fetchedAt, lastAttemptAt, lastAccessedAt, schemaVersion",
} as const;

function createV15Db(name: string): Dexie {
    const db = new Dexie(name);
    db.version(15).stores(V15_STORES);
    return db;
}

const V15_FIXTURES: Record<string, Record<string, unknown>> = {
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
    it("uses logical v16 and native v160", () => {
        expect(EHAGAKI_DB_VERSION).toBe(16);
        expect(EHAGAKI_DB_NATIVE_VERSION).toBe(160);
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
            "meta",
            "postHistory",
            "postHistoryChildInteractions",
            "postHistoryDeletionRequests",
            "postHistorySearch",
            "postMediaCache",
            "profiles",
            "relayConfigs",
            "sharedMedia",
            "uploadDestinations",
        ]);

        db.close();
    });

    it("v15 の全storeとrecordを保ったまま search store を追加し旧v15 read/writeも継続する", async () => {
        const name = `${EHAGAKI_DB_NAME}-upgrade-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        testDbNames.add(name);
        const v15 = createV15Db(name);
        await v15.open();
        for (const [storeName, record] of Object.entries(V15_FIXTURES)) {
            await v15.table(storeName).put(structuredClone(record));
        }
        const before = Object.fromEntries(await Promise.all(
            Object.keys(V15_FIXTURES).map(async (storeName) => [
                storeName,
                await v15.table(storeName).toArray(),
            ]),
        ));
        v15.close();

        const v16 = new EHagakiDB(name);
        await v16.open();
        expect(v16.backendDB().version).toBe(160);
        expect(v16.postHistory.schema.idxByName[POST_HISTORY_TIMELINE_INDEX]).toBeDefined();
        for (const storeName of Object.keys(V15_FIXTURES)) {
            await expect(v16.table(storeName).toArray()).resolves.toEqual(before[storeName]);
        }
        await expect(v16.postHistory
            .where(POST_HISTORY_TIMELINE_INDEX)
            .between(["owner"], ["owner", Dexie.maxKey])
            .toArray()).resolves.toMatchObject([{ eventId: "event-v14" }]);
        v16.close();

        const staleV15 = createV15Db(name);
        await staleV15.open();
        await expect(staleV15.table("postHistory")
            .where("[pubkeyHex+postedAt]")
            .equals(["owner", 200])
            .toArray()).resolves.toMatchObject([{ eventId: "event-v14" }]);
        await staleV15.table("postHistory").put({
            ...V15_FIXTURES.postHistory,
            id: "event-added-by-v15",
            eventId: "event-added-by-v15",
            postedAt: 300,
        });
        staleV15.close();

        const reopenedV16 = new EHagakiDB(name);
        await reopenedV16.open();
        await expect(reopenedV16.postHistory
            .where(POST_HISTORY_TIMELINE_INDEX)
            .between(["owner"], ["owner", Dexie.maxKey])
            .reverse()
            .toArray()).resolves.toMatchObject([
            { eventId: "event-added-by-v15", postedAt: 300 },
            { eventId: "event-v14", postedAt: 200 },
        ]);
        reopenedV16.close();
    });

    it("Service Worker先行でもDexie先行でもnative v160の同じschemaを開く", async () => {
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
        dexieFirstRaw.close();
    });

    it("blocked を通知し blocker close 後に同じv16 upgradeを完了する", async () => {
        const name = `${EHAGAKI_DB_NAME}-blocked-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        testDbNames.add(name);
        const v15 = createV15Db(name);
        await v15.open();
        await v15.table("meta").put(V15_FIXTURES.meta);
        v15.close();

        const blocker = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(name, 150);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        blocker.onversionchange = () => undefined;

        const v16 = new EHagakiDB(name);
        const blockedSubscriber = vi.fn();
        const upgradeStates: boolean[] = [];
        const unsubscribeBlocked = subscribeEHagakiDbUpgradeBlocked(blockedSubscriber);
        const unsubscribeUpgradeState = subscribeEHagakiDbUpgradeState((blocked) => {
            upgradeStates.push(blocked);
        });
        const blocked = new Promise<void>((resolve) => {
            v16.on("blocked", () => resolve());
        });
        const opening = v16.open();
        await blocked;
        expect(v16.isOpen()).toBe(false);
        expect(blockedSubscriber).toHaveBeenCalledOnce();
        expect(upgradeStates).toEqual([false, true]);

        blocker.close();
        await opening;
        expect(v16.backendDB().version).toBe(160);
        await expect(v16.meta.get("fixture")).resolves.toEqual(V15_FIXTURES.meta);
        expect(upgradeStates).toEqual([false, true, false]);
        unsubscribeBlocked();
        unsubscribeUpgradeState();
        v16.close();
    });

    it("v15 Dexie connection は versionchange を受けて閉じ upgrade を妨げない", async () => {
        const name = `${EHAGAKI_DB_NAME}-versionchange-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        testDbNames.add(name);
        const v15 = createV15Db(name);
        await v15.open();
        const versionChanged = new Promise<void>((resolve) => {
            v15.on("versionchange", () => resolve());
        });

        const v16 = new EHagakiDB(name);
        await v16.open();
        await versionChanged;

        expect(v15.isOpen()).toBe(false);
        expect(v16.backendDB().version).toBe(160);
        v16.close();
    });

    it("native v150 の VersionError 後もDBを削除せずv160で再openできる", async () => {
        const db = createTestDb();
        await db.meta.put(V15_FIXTURES.meta as any);
        await db.open();
        const name = db.name;
        db.close();

        const versionError = await new Promise<DOMException | null>((resolve) => {
            const request = indexedDB.open(name, 150);
            request.onsuccess = () => {
                request.result.close();
                resolve(null);
            };
            request.onerror = () => resolve(request.error);
        });
        expect(versionError?.name).toBe("VersionError");

        const reopened = await new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(name, 160);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        expect(reopened.version).toBe(160);
        const record = await new Promise((resolve, reject) => {
            const request = reopened.transaction("meta").objectStore("meta").get("fixture");
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        expect(record).toEqual(V15_FIXTURES.meta);
        reopened.close();
    });

    it("v16 upgrade transaction が失敗してもv15 DBとrecordを維持する", async () => {
        const name = `${EHAGAKI_DB_NAME}-abort-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        testDbNames.add(name);
        const v15 = createV15Db(name);
        await v15.open();
        await v15.table("meta").put(V15_FIXTURES.meta);
        v15.close();

        const upgradeError = await new Promise<DOMException | null>((resolve) => {
            const request = indexedDB.open(name, 160);
            request.onupgradeneeded = () => request.transaction?.abort();
            request.onsuccess = () => {
                request.result.close();
                resolve(null);
            };
            request.onerror = () => resolve(request.error);
        });
        expect(upgradeError?.name).toBe("AbortError");

        const unchanged = createV15Db(name);
        await unchanged.open();
        expect(unchanged.backendDB().version).toBe(150);
        await expect(unchanged.table("meta").get("fixture"))
            .resolves.toEqual(V15_FIXTURES.meta);
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
