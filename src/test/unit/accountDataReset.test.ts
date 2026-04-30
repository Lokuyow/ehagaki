import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SHARE_HANDLER_CONFIG, STORAGE_KEYS } from "../../lib/constants";
import { resetManagedAccountData } from "../../lib/accountDataReset";
import { EHAGAKI_DB_NAME, ehagakiDb } from "../../lib/storage/ehagakiDb";
import { MockStorage } from "../helpers";

function createCachesMock() {
    return {
        delete: vi.fn().mockResolvedValue(true),
    } as unknown as CacheStorage;
}

async function createSharedMediaDb(databaseName: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        const request = indexedDB.open(databaseName, 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore("flags", { keyPath: "id" });
        };
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            request.result.close();
            resolve();
        };
    });
}

function sharedMediaDbHasFlagsStore(databaseName: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        const request = indexedDB.open(databaseName, 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const exists = request.result.objectStoreNames.contains("flags");
            request.result.close();
            resolve(exists);
        };
    });
}

afterEach(async () => {
    ehagakiDb.close();
    await Dexie.delete(EHAGAKI_DB_NAME);
    await new Promise<void>((resolve) => {
        const request = indexedDB.deleteDatabase("eHagakiSharedData");
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
        request.onblocked = () => resolve();
    });
    await new Promise<void>((resolve) => {
        const request = indexedDB.deleteDatabase(SHARE_HANDLER_CONFIG.INDEXEDDB_NAME);
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
        request.onblocked = () => resolve();
    });
    vi.clearAllMocks();
});

describe("resetManagedAccountData", () => {
    it("STORAGE_KEYS の固定キーと prefix 一致キーだけを localStorage から削除する", async () => {
        const storage = new MockStorage();
        const caches = createCachesMock();

        storage.setItem(STORAGE_KEYS.LOCALE, "ja");
        storage.setItem(STORAGE_KEYS.NOSTR_ACCOUNTS, "[]");
        storage.setItem(STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX + "pubkey1", "nsec");
        storage.setItem(STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX + "pubkey1", "{}");
        storage.setItem(STORAGE_KEYS.NOSTR_PARENT_CLIENT_SESSION_PREFIX + "pubkey1", "{}");
        storage.setItem(STORAGE_KEYS.NOSTR_RELAYS + "pubkey1", "[]");
        storage.setItem(STORAGE_KEYS.NOSTR_PROFILE + "pubkey1", "{}");
        storage.setItem("external-app-key", "keep");

        await resetManagedAccountData({
            localStorage: storage,
            indexedDB,
            caches,
        });

        expect(storage.getItem(STORAGE_KEYS.LOCALE)).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.NOSTR_ACCOUNTS)).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX + "pubkey1")).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX + "pubkey1")).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.NOSTR_PARENT_CLIENT_SESSION_PREFIX + "pubkey1")).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.NOSTR_RELAYS + "pubkey1")).toBeNull();
        expect(storage.getItem(STORAGE_KEYS.NOSTR_PROFILE + "pubkey1")).toBeNull();
        expect(storage.getItem("external-app-key")).toBe("keep");
    });

    it("eHagakiDB、共有メディア DB、関連画像キャッシュを削除する", async () => {
        const storage = new MockStorage();
        const caches = createCachesMock();

        await ehagakiDb.open();
        await ehagakiDb.meta.put({ key: "test", value: true, updatedAt: 1 });
        await createSharedMediaDb("eHagakiSharedData");
        await createSharedMediaDb(SHARE_HANDLER_CONFIG.INDEXEDDB_NAME);

        await resetManagedAccountData({
            localStorage: storage,
            indexedDB,
            caches,
        });

        expect(await Dexie.exists(EHAGAKI_DB_NAME)).toBe(false);
        await expect(sharedMediaDbHasFlagsStore("eHagakiSharedData")).resolves.toBe(false);
        await expect(sharedMediaDbHasFlagsStore(SHARE_HANDLER_CONFIG.INDEXEDDB_NAME)).resolves.toBe(false);
        expect(caches.delete).toHaveBeenCalledWith("ehagaki-profile-images-v2");
        expect(caches.delete).toHaveBeenCalledWith("ehagaki-profile-images");
        expect(caches.delete).toHaveBeenCalledWith("ehagaki-custom-emoji-images-v2");
        expect(caches.delete).toHaveBeenCalledWith("ehagaki-custom-emoji-images");
    });

    it("削除失敗時は reject する", async () => {
        const storage = new MockStorage();
        const caches = {
            delete: vi.fn().mockRejectedValue(new Error("cache failure")),
        } as unknown as CacheStorage;

        await expect(
            resetManagedAccountData({
                localStorage: storage,
                indexedDB,
                caches,
            }),
        ).rejects.toThrow("cache failure");
    });
});
