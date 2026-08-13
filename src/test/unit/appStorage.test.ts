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

    it("confines cleanup and legacy-looking keys to the documented v1 namespace", () => {
        const hostStorage = createMemoryStorage();
        const sentinels = {
            locale: "host-locale",
            themeMode: "host-theme",
            darkMode: "host-dark",
            firstVisit: "host-first-visit",
            "nostr-accounts": "host-accounts",
            "nostr-active-account": "host-active",
            "__nostrlogin_accounts": "host-legacy",
            "__nostrlogin_nip46": "host-session",
            "nl-dark-mode": "host-nl-theme",
        };
        for (const [key, value] of Object.entries(sentinels)) {
            hostStorage.setItem(key, value);
        }
        const scopedStorage = createWebComponentStorage(hostStorage);
        scopedStorage.setItem("__nostrlogin_accounts", "component-legacy");
        scopedStorage.removeItem("__nostrlogin_accounts");
        scopedStorage.clear();

        expect(EHAGAKI_WEB_COMPONENT_STORAGE_PREFIX).toBe(
            "ehagaki.web-component.v1:",
        );
        for (const [key, value] of Object.entries(sentinels)) {
            expect(hostStorage.getItem(key)).toBe(value);
        }
    });
});
