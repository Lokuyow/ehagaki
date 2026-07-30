import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const testState = vi.hoisted(() => ({
    dbUpgradeStateListener: undefined as undefined | ((blocked: boolean) => void),
    needRefreshListener: undefined as undefined | ((needRefresh: boolean) => void),
    registerOptions: undefined as undefined | {
        onNeedRefresh?: () => void;
    },
}));

vi.unmock("../../stores/swStore.svelte");

vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: vi.fn((options: typeof testState.registerOptions) => {
        testState.registerOptions = options;
        return {
            needRefresh: {
                subscribe(listener: (needRefresh: boolean) => void) {
                    testState.needRefreshListener = listener;
                    return () => undefined;
                },
            },
            updateServiceWorker: vi.fn(),
        };
    }),
}));

vi.mock("../../lib/storage/ehagakiDb", () => ({
    subscribeEHagakiDbUpgradeState(listener: (blocked: boolean) => void) {
        testState.dbUpgradeStateListener = listener;
        listener(false);
        return () => undefined;
    },
}));

describe("swStore DB upgrade blocked state", () => {
    let serviceWorkerEvents: EventTarget;
    let originalServiceWorker: PropertyDescriptor | undefined;

    beforeEach(() => {
        vi.resetModules();
        testState.dbUpgradeStateListener = undefined;
        testState.needRefreshListener = undefined;
        testState.registerOptions = undefined;
        serviceWorkerEvents = new EventTarget();
        originalServiceWorker = Object.getOwnPropertyDescriptor(navigator, "serviceWorker");
        Object.defineProperty(navigator, "serviceWorker", {
            configurable: true,
            value: serviceWorkerEvents,
        });
    });

    afterEach(() => {
        if (originalServiceWorker) {
            Object.defineProperty(navigator, "serviceWorker", originalServiceWorker);
        } else {
            Reflect.deleteProperty(navigator, "serviceWorker");
        }
    });

    it("DB blocked の解除で ready のSW更新状態を維持する", async () => {
        const store = await import("../../stores/swStore.svelte");
        const statuses: string[] = [];
        const blockedStates: boolean[] = [];
        const refreshStates: boolean[] = [];
        store.swUpdateStatus.subscribe((status) => statuses.push(status));
        store.dbUpgradeBlocked.subscribe((blocked) => blockedStates.push(blocked));
        store.swNeedRefresh.subscribe((needed) => refreshStates.push(needed));

        testState.registerOptions?.onNeedRefresh?.();
        testState.dbUpgradeStateListener?.(true);
        serviceWorkerEvents.dispatchEvent(new MessageEvent("message", {
            data: { type: "EHAGAKI_DB_UPGRADE_UNBLOCKED" },
        }));

        expect(statuses.at(-1)).toBe("ready");
        expect(blockedStates).toEqual([false, true, false]);
        expect(refreshStates.at(-1)).toBe(true);

        testState.needRefreshListener?.(false);

        expect(statuses.at(-1)).toBe("idle");
        expect(refreshStates.at(-1)).toBe(false);
    });
});
