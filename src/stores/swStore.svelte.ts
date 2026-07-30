/// <reference types="vite/client" />
// @ts-expect-error: virtual module provided by Vite plugin
import { useRegisterSW } from "virtual:pwa-register/svelte";
import {
    createAcceptedServiceWorkerUpdateReloadController,
    watchServiceWorkerUpdateInstallation,
    type SwUpdateStatus,
} from "../lib/swUpdateDetectionUtils";
import { subscribeEHagakiDbUpgradeState } from "../lib/storage/ehagakiDb";
import {
    markStaleAssetReloadRequired,
    requestStaleReloadPrompt,
    staleAssetReloadState,
} from "./staleAssetReloadStore.svelte";

type StoreSubscriber<T> = (value: T) => void;

const swUpdateStatusSubscribers = new Set<StoreSubscriber<SwUpdateStatus>>();
let swUpdateStatusValue: SwUpdateStatus = "idle";
const dbUpgradeBlockedSubscribers = new Set<StoreSubscriber<boolean>>();
let dbUpgradeBlockedValue = false;
const swNeedRefreshSubscribers = new Set<StoreSubscriber<boolean>>();
const updateReloadController = createAcceptedServiceWorkerUpdateReloadController(
    () => window.location.reload(),
    () => {
        if (markStaleAssetReloadRequired()) {
            requestStaleReloadPrompt();
        }
    },
);

function setSwUpdateStatus(value: SwUpdateStatus) {
    if (swUpdateStatusValue === "ready" && value === "installing") {
        return;
    }

    if (swUpdateStatusValue === value) {
        return;
    }

    swUpdateStatusValue = value;
    swUpdateStatusSubscribers.forEach((subscriber) => subscriber(value));
    notifySwNeedRefreshSubscribers();
}

function setDbUpgradeBlocked(value: boolean) {
    if (dbUpgradeBlockedValue === value) {
        return;
    }

    dbUpgradeBlockedValue = value;
    dbUpgradeBlockedSubscribers.forEach((subscriber) => subscriber(value));
    notifySwNeedRefreshSubscribers();
}

function getSwNeedRefreshValue() {
    return swUpdateStatusValue !== "idle" || dbUpgradeBlockedValue;
}

function notifySwNeedRefreshSubscribers() {
    const value = getSwNeedRefreshValue();
    swNeedRefreshSubscribers.forEach((subscriber) => subscriber(value));
}

export const swUpdateStatus = {
    subscribe(run: StoreSubscriber<SwUpdateStatus>) {
        run(swUpdateStatusValue);
        swUpdateStatusSubscribers.add(run);
        return () => swUpdateStatusSubscribers.delete(run);
    },
    set: setSwUpdateStatus,
};

export const swNeedRefresh = {
    subscribe(run: StoreSubscriber<boolean>) {
        run(getSwNeedRefreshValue());
        swNeedRefreshSubscribers.add(run);
        return () => swNeedRefreshSubscribers.delete(run);
    },
    set(value: boolean) {
        setSwUpdateStatus(value ? "ready" : "idle");
    },
};

export const dbUpgradeBlocked = {
    subscribe(run: StoreSubscriber<boolean>) {
        run(dbUpgradeBlockedValue);
        dbUpgradeBlockedSubscribers.add(run);
        return () => dbUpgradeBlockedSubscribers.delete(run);
    },
    set: setDbUpgradeBlocked,
};

function watchRegistrationUpdate(registration: ServiceWorkerRegistration | undefined) {
    if (!registration) {
        return;
    }

    watchServiceWorkerUpdateInstallation({
        registration,
        hasController: Boolean(navigator.serviceWorker?.controller),
        setStatus: setSwUpdateStatus,
    });
}

subscribeEHagakiDbUpgradeState(setDbUpgradeBlocked);

if (typeof navigator !== "undefined" && navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "EHAGAKI_DB_UPGRADE_BLOCKED") {
            setDbUpgradeBlocked(true);
        } else if (event.data?.type === "EHAGAKI_DB_UPGRADE_UNBLOCKED") {
            setDbUpgradeBlocked(false);
        }
    });
}

// --- Service Worker管理 ---
const swRegister = (() => {
    try {
        if (typeof useRegisterSW === 'function') {
            const register = useRegisterSW({
                onRegistered: (r: ServiceWorkerRegistration | undefined) => {
                    console.log("SW registered successfully", r);
                    watchRegistrationUpdate(r);
                },
                onRegisterError(error: Error) {
                    console.warn("SW registration error", error);
                },
                onNeedRefresh() {
                    console.log("SW needs refresh - showing prompt");
                    setSwUpdateStatus("ready");
                },
                onNeedReload() {
                    updateReloadController.handleControlChange();
                },
                immediate: true,
                onOfflineReady() {
                    console.log("App ready to work offline");
                }
            });

            register.needRefresh.subscribe((needRefresh: boolean) => {
                if (needRefresh) {
                    setSwUpdateStatus("ready");
                } else if (swUpdateStatusValue === "ready") {
                    setSwUpdateStatus("idle");
                }
            });

            return register;
        }
    } catch (error) {
        console.warn("Failed to initialize Service Worker:", error);
    }

    // フォールバック（テスト環境やエラー時）
    return {
        needRefresh: { subscribe: () => { } },
        updateServiceWorker: () => { }
    };
})();

export const swUpdateServiceWorker = swRegister.updateServiceWorker;

let swVersion = $state<string | null>(null);

export const swVersionStore = {
    get value() { return swVersion; },
    set: (value: string | null) => { swVersion = value; }
};

export function handleSwUpdate() {
    if (staleAssetReloadState.required) {
        requestStaleReloadPrompt();
        return Promise.resolve();
    }
    updateReloadController.markAccepted();
    return swUpdateServiceWorker(true);
}

export function fetchSwVersion(): Promise<string | null> {
    if (!navigator.serviceWorker?.controller) return Promise.resolve(null);
    return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
            if (event.data?.version) {
                swVersionStore.set(event.data.version);
                resolve(event.data.version);
            } else {
                resolve(null);
            }
        };
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(
                { type: 'GET_VERSION' },
                [messageChannel.port2]
            );
        } else {
            resolve(null);
            return;
        }
        setTimeout(() => resolve(null), 2000);
    });
}
