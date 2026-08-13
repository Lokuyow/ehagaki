import { afterEach, describe, expect, it } from "vitest";
import {
    configureAppStorage,
    createWebComponentStorage,
    EHAGAKI_WEB_COMPONENT_STORAGE_PREFIX,
    getAppStorage,
    resetAppStorage,
} from "../../lib/appStorage";

function createMemoryStorage(): Storage {
    const values = new Map<string, string>();
    return {
        get length() {
            return values.size;
        },
        clear() {
            values.clear();
        },
        getItem(key) {
            return values.get(key) ?? null;
        },
        key(index) {
            return [...values.keys()][index] ?? null;
        },
        removeItem(key) {
            values.delete(key);
        },
        setItem(key, value) {
            values.set(key, String(value));
        },
    };
}

afterEach(() => {
    resetAppStorage();
});

describe("app storage boundary", () => {
    it("allows an entry point to inject a storage implementation", () => {
        const storage = createMemoryStorage();
        configureAppStorage(storage);

        expect(getAppStorage()).toBe(storage);
    });

    it("isolates a future embedding namespace without changing host keys", () => {
        const hostStorage = createMemoryStorage();
        hostStorage.setItem("locale", "host-locale");
        hostStorage.setItem("nostr-accounts", "host-accounts");
        const scopedStorage = createWebComponentStorage(hostStorage);

        scopedStorage.setItem("locale", "ja");
        scopedStorage.setItem("nostr-accounts", "component-accounts");

        expect(hostStorage.getItem("locale")).toBe("host-locale");
        expect(hostStorage.getItem("nostr-accounts")).toBe("host-accounts");
        expect(
            hostStorage.getItem(`${EHAGAKI_WEB_COMPONENT_STORAGE_PREFIX}locale`),
        ).toBe("ja");
        expect(scopedStorage.getItem("locale")).toBe("ja");

        scopedStorage.clear();
        expect(hostStorage.getItem("locale")).toBe("host-locale");
        expect(hostStorage.getItem("nostr-accounts")).toBe("host-accounts");
    });
});
