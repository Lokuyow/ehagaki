import Dexie from "dexie";
import { STORAGE_KEYS } from "./constants";
import { EHAGAKI_DB_NAME, ehagakiDb } from "./storage/ehagakiDb";

const PROFILE_CACHE_NAMES = [
    "ehagaki-profile-images-v2",
    "ehagaki-profile-images",
] as const;

const CUSTOM_EMOJI_CACHE_NAMES = [
    "ehagaki-custom-emoji-images-v2",
    "ehagaki-custom-emoji-images",
] as const;

const LOCAL_STORAGE_PREFIX_KEYS = [
    STORAGE_KEYS.NOSTR_RELAYS,
    STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX,
    STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX,
    STORAGE_KEYS.NOSTR_PARENT_CLIENT_SESSION_PREFIX,
    STORAGE_KEYS.NOSTR_PROFILE,
] as const;

const LOCAL_STORAGE_FIXED_KEYS = Object.values(STORAGE_KEYS).filter(
    (key) => !LOCAL_STORAGE_PREFIX_KEYS.includes(key as typeof LOCAL_STORAGE_PREFIX_KEYS[number]),
);

export interface AccountDataResetDependencies {
    localStorage?: Storage;
    indexedDB?: IDBFactory;
    caches?: CacheStorage;
    console?: Pick<Console, "error">;
}

function removeManagedLocalStorageKeys(localStorage: Storage): void {
    for (const key of LOCAL_STORAGE_FIXED_KEYS) {
        localStorage.removeItem(key);
    }

    const keysToRemove: string[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index);
        if (key && LOCAL_STORAGE_PREFIX_KEYS.some((prefix) => key.startsWith(prefix))) {
            keysToRemove.push(key);
        }
    }

    for (const key of keysToRemove) {
        localStorage.removeItem(key);
    }
}

export async function resetManagedAccountData(
    deps: AccountDataResetDependencies = {},
): Promise<void> {
    const localStorage = deps.localStorage ?? globalThis.localStorage;
    const cacheStorage = deps.caches ?? globalThis.caches;

    removeManagedLocalStorageKeys(localStorage);

    ehagakiDb.close();
    await Dexie.delete(EHAGAKI_DB_NAME);

    await Promise.all(
        [...PROFILE_CACHE_NAMES, ...CUSTOM_EMOJI_CACHE_NAMES].map((cacheName) =>
            cacheStorage.delete(cacheName),
        ),
    );
}

export const accountDataResetInternals = {
    LOCAL_STORAGE_FIXED_KEYS,
    LOCAL_STORAGE_PREFIX_KEYS,
    PROFILE_CACHE_NAMES,
    CUSTOM_EMOJI_CACHE_NAMES,
    removeManagedLocalStorageKeys,
};
