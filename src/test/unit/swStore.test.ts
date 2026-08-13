import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const testState = vi.hoisted(() => ({
    dbUpgradeStateListener: undefined as undefined | ((blocked: boolean) => void),
    needRefreshListener: undefined as undefined | ((needRefresh: boolean) => void),
    registerOptions: undefined as undefined | {
        onNeedRefresh?: () => void;
        onNeedReload?: () => void;
    },
    updateServiceWorker: vi.fn(),
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
            updateServiceWorker: testState.updateServiceWorker,
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
        testState.updateServiceWorker.mockReset();
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

    it("state import alone does not register a Service Worker", async () => {
        await import("../../stores/swStore.svelte");

        expect(testState.registerOptions).toBeUndefined();
        expect(testState.dbUpgradeStateListener).toBeUndefined();
    });

    it("DB blocked の解除で ready のSW更新状態を維持する", async () => {
        const store = await import("../../stores/swStore.svelte");
        const bootstrap = await import("../../lib/bootstrap/serviceWorkerBootstrap");
        bootstrap.startServiceWorkerRegistration();
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

    it("未承認controllerchangeは一度だけstale化し、更新操作をreload promptへ振り分ける", async () => {
        const store = await import("../../stores/swStore.svelte");
        const bootstrap = await import("../../lib/bootstrap/serviceWorkerBootstrap");
        bootstrap.startServiceWorkerRegistration();
        const staleStore = await import(
            "../../stores/staleAssetReloadStore.svelte"
        );

        testState.registerOptions?.onNeedReload?.();

        expect(staleStore.staleAssetReloadState.required).toBe(true);
        expect(staleStore.staleAssetReloadState.promptRevision).toBe(1);

        testState.registerOptions?.onNeedReload?.();
        expect(staleStore.staleAssetReloadState.promptRevision).toBe(1);

        await store.handleSwUpdate();

        expect(staleStore.staleAssetReloadState.promptRevision).toBe(2);
        expect(testState.updateServiceWorker).not.toHaveBeenCalled();
    });
});
