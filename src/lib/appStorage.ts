/**
 * Storage used by the eHagaki application runtime.
 *
 * The default remains the current window localStorage so PWA and iframe
 * behavior is unchanged. A future embedding entry can configure another
 * Storage implementation before importing App.svelte.
 */

let configuredStorage: Storage | undefined;

/** Reserved prefix for the future same-origin Web Component entry. */
export const EHAGAKI_WEB_COMPONENT_STORAGE_PREFIX = "ehagaki-web-component:";

const memoryStorage = new Map<string, string>();

const fallbackStorage: Storage = {
    get length() {
        return memoryStorage.size;
    },
    clear() {
        memoryStorage.clear();
    },
    getItem(key: string) {
        return memoryStorage.get(key) ?? null;
    },
    key(index: number) {
        return [...memoryStorage.keys()][index] ?? null;
    },
    removeItem(key: string) {
        memoryStorage.delete(key);
    },
    setItem(key: string, value: string) {
        memoryStorage.set(key, String(value));
    },
};

function resolveDefaultStorage(): Storage {
    if (typeof globalThis !== "undefined") {
        const storage = (globalThis as typeof globalThis & {
            localStorage?: Storage;
        }).localStorage;
        if (storage) {
            return storage;
        }
    }

    return fallbackStorage;
}

export function getAppStorage(): Storage {
    return configuredStorage ?? resolveDefaultStorage();
}

export function configureAppStorage(storage: Storage): void {
    configuredStorage = storage;
}

export function resetAppStorage(): void {
    configuredStorage = undefined;
}

function getNamespacedKeys(storage: Storage, prefix: string): string[] {
    const keys: string[] = [];
    for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);
        if (key?.startsWith(prefix)) {
            keys.push(key.slice(prefix.length));
        }
    }
    return keys;
}

/**
 * Creates a Storage facade that exposes only keys under `prefix`.
 *
 * This is intentionally a small adapter rather than a repository-wide
 * storage abstraction. It lets a future Web Component entry isolate its
 * localStorage keys while PWA and iframe entries continue using raw storage.
 */
export function createNamespacedStorage(
    storage: Storage,
    prefix: string,
): Storage {
    return {
        get length() {
            return getNamespacedKeys(storage, prefix).length;
        },
        clear() {
            const keys = getNamespacedKeys(storage, prefix);
            for (const key of keys) {
                storage.removeItem(`${prefix}${key}`);
            }
        },
        getItem(key: string) {
            return storage.getItem(`${prefix}${key}`);
        },
        key(index: number) {
            return getNamespacedKeys(storage, prefix)[index] ?? null;
        },
        removeItem(key: string) {
            storage.removeItem(`${prefix}${key}`);
        },
        setItem(key: string, value: string) {
            storage.setItem(`${prefix}${key}`, String(value));
        },
    };
}

export function createWebComponentStorage(storage: Storage): Storage {
    return createNamespacedStorage(
        storage,
        EHAGAKI_WEB_COMPONENT_STORAGE_PREFIX,
    );
}
