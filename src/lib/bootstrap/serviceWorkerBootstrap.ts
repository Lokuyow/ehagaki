/// <reference types="vite/client" />
// @ts-expect-error: virtual module provided by Vite plugin
import { useRegisterSW } from "virtual:pwa-register/svelte";
import { subscribeEHagakiDbUpgradeState } from "../storage/ehagakiDb";
import {
    watchServiceWorkerUpdateInstallation,
} from "../swUpdateDetectionUtils";
import {
    configureSwUpdateServiceWorker,
    enableServiceWorkerStore,
    handleServiceWorkerControlChange,
    setDbUpgradeBlocked,
    setSwUpdateStatus,
} from "../../stores/swStore.svelte";

let started = false;

export function startServiceWorkerRegistration(): void {
    if (started) return;
    started = true;
    enableServiceWorkerStore();

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

    try {
        if (typeof useRegisterSW !== "function") return;
        const register = useRegisterSW({
            onRegistered: (registration: ServiceWorkerRegistration | undefined) => {
                console.log("SW registered successfully", registration);
                if (registration) {
                    watchServiceWorkerUpdateInstallation({
                        registration,
                        hasController: Boolean(navigator.serviceWorker?.controller),
                        setStatus: setSwUpdateStatus,
                    });
                }
            },
            onRegisterError(error: Error) {
                console.warn("SW registration error", error);
            },
            onNeedRefresh() {
                console.log("SW needs refresh - showing prompt");
                setSwUpdateStatus("ready");
            },
            onNeedReload() {
                return handleServiceWorkerControlChange();
            },
            immediate: true,
            onOfflineReady() {
                console.log("App ready to work offline");
            },
        });

        configureSwUpdateServiceWorker(register.updateServiceWorker);
        register.needRefresh.subscribe((needRefresh: boolean) => {
            if (needRefresh) {
                setSwUpdateStatus("ready");
            } else {
                setSwUpdateStatus("idle");
            }
        });
    } catch (error) {
        console.warn("Failed to initialize Service Worker:", error);
    }
}
