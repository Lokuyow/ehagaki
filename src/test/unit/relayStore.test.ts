import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDeferred } from "../deferredTestUtils";

vi.unmock("../../stores/relayStore.svelte");

const authStateValue = vi.hoisted(() => ({
    isAuthenticated: true,
    pubkey: "account-a",
}));

vi.mock("../../stores/authStore.svelte", () => ({
    authState: {
        get value() {
            return authStateValue;
        },
    },
}));

import {
    loadRelayConfigFromStorage,
    relayConfigStore,
    relayListUpdatedStore,
    invalidatePendingRelayConfigOperations,
    resetRelayConfigStore,
    saveRelayConfigToStorage,
    setRelayManager,
    writeRelaysStore,
} from "../../stores/relayStore.svelte";

describe("relayStore", () => {
    beforeEach(() => {
        authStateValue.isAuthenticated = true;
        authStateValue.pubkey = "account-a";
        resetRelayConfigStore();
        relayListUpdatedStore.set(0);
    });

    it("keeps B relay state when an older A load succeeds after an account switch", async () => {
        const aResult = createDeferred<{ relayConfig: string[]; writeRelays: string[] } | null>();
        const bResult = createDeferred<{ relayConfig: string[]; writeRelays: string[] } | null>();
        setRelayManager({
            loadRelayConfigForUI: vi.fn((pubkeyHex: string) =>
                pubkeyHex === "account-a" ? aResult.promise : bResult.promise,
            ),
        } as never);

        const aLoad = loadRelayConfigFromStorage("account-a");
        authStateValue.pubkey = "account-b";
        const bLoad = loadRelayConfigFromStorage("account-b");
        bResult.resolve({ relayConfig: ["wss://b.example.com/"], writeRelays: ["wss://b.example.com/"] });
        await bLoad;
        aResult.resolve({ relayConfig: ["wss://a.example.com/"], writeRelays: ["wss://a.example.com/"] });
        await aLoad;

        expect(relayConfigStore.value).toEqual(["wss://b.example.com/"]);
        expect(writeRelaysStore.value).toEqual(["wss://b.example.com/"]);
    });

    it("does not let an older A failure alter B relay state", async () => {
        const aResult = createDeferred<{ relayConfig: string[]; writeRelays: string[] } | null>();
        setRelayManager({
            loadRelayConfigForUI: vi.fn((pubkeyHex: string) => {
                if (pubkeyHex === "account-a") return aResult.promise;
                return Promise.resolve({
                    relayConfig: ["wss://b.example.com/"],
                    writeRelays: ["wss://b.example.com/"],
                });
            }),
        } as never);

        const aLoad = loadRelayConfigFromStorage("account-a");
        authStateValue.pubkey = "account-b";
        await loadRelayConfigFromStorage("account-b");
        aResult.reject(new Error("A failed"));
        await expect(aLoad).resolves.toBeUndefined();

        expect(relayConfigStore.value).toEqual(["wss://b.example.com/"]);
        expect(writeRelaysStore.value).toEqual(["wss://b.example.com/"]);
    });

    it("does not restore relay state after reset invalidates a pending load", async () => {
        const result = createDeferred<{ relayConfig: string[]; writeRelays: string[] } | null>();
        setRelayManager({ loadRelayConfigForUI: vi.fn(() => result.promise) } as never);

        const load = loadRelayConfigFromStorage("account-a");
        resetRelayConfigStore();
        result.resolve({ relayConfig: ["wss://a.example.com/"], writeRelays: ["wss://a.example.com/"] });
        await load;

        expect(relayConfigStore.value).toBeNull();
        expect(writeRelaysStore.value).toEqual([]);
    });

    it("does not let an older same-account load overwrite the newer result", async () => {
        const firstResult = createDeferred<{ relayConfig: string[]; writeRelays: string[] } | null>();
        const secondResult = createDeferred<{ relayConfig: string[]; writeRelays: string[] } | null>();
        setRelayManager({
            loadRelayConfigForUI: vi.fn()
                .mockReturnValueOnce(firstResult.promise)
                .mockReturnValueOnce(secondResult.promise),
        } as never);

        const firstLoad = loadRelayConfigFromStorage("account-a");
        const secondLoad = loadRelayConfigFromStorage("account-a");
        secondResult.resolve({ relayConfig: ["wss://new.example.com/"], writeRelays: ["wss://new.example.com/"] });
        await secondLoad;
        firstResult.resolve({ relayConfig: ["wss://old.example.com/"], writeRelays: ["wss://old.example.com/"] });
        await firstLoad;

        expect(relayConfigStore.value).toEqual(["wss://new.example.com/"]);
        expect(writeRelaysStore.value).toEqual(["wss://new.example.com/"]);
    });

    it("ignores an old account's relay save callback", async () => {
        authStateValue.pubkey = "account-b";

        await saveRelayConfigToStorage("account-a", ["wss://a.example.com/"]);

        expect(relayConfigStore.value).toBeNull();
        expect(writeRelaysStore.value).toEqual([]);
        expect(relayListUpdatedStore.value).toBe(0);
    });

    it("invalidates pending relay loads without clearing the current relay state", async () => {
        await saveRelayConfigToStorage("account-a", ["wss://current.example.com/"]);
        const result = createDeferred<{ relayConfig: string[]; writeRelays: string[] } | null>();
        setRelayManager({ loadRelayConfigForUI: vi.fn(() => result.promise) } as never);

        const load = loadRelayConfigFromStorage("account-a");
        invalidatePendingRelayConfigOperations();
        result.resolve({ relayConfig: ["wss://stale.example.com/"], writeRelays: ["wss://stale.example.com/"] });
        await load;

        expect(relayConfigStore.value).toEqual(["wss://current.example.com/"]);
        expect(writeRelaysStore.value).toEqual(["wss://current.example.com/"]);
    });
});
