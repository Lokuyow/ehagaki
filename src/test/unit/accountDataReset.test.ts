import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEYS } from "../../lib/constants";
import { resetManagedAccountData } from "../../lib/accountDataReset";
import { EHAGAKI_DB_NAME, ehagakiDb } from "../../lib/storage/ehagakiDb";
import { MockStorage } from "../helpers";

function createCachesMock() {
    return {
        delete: vi.fn().mockResolvedValue(true),
    } as unknown as CacheStorage;
}

afterEach(async () => {
    ehagakiDb.close();
    await Dexie.delete(EHAGAKI_DB_NAME);
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

    it("eHagakiDB と関連画像キャッシュを削除する", async () => {
        const storage = new MockStorage();
        const caches = createCachesMock();

        await ehagakiDb.open();
        await ehagakiDb.meta.put({ key: "test", value: true, updatedAt: 1 });
        await ehagakiDb.sharedMedia.put({
            id: "latest",
            images: [],
            createdAt: 1,
            updatedAt: 1,
            schemaVersion: 1,
        });

        await resetManagedAccountData({
            localStorage: storage,
            indexedDB,
            caches,
        });

        expect(await Dexie.exists(EHAGAKI_DB_NAME)).toBe(false);
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
