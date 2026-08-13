/// <reference types="vite/client" />
// @ts-expect-error: virtual module provided by Vite plugin
import { useRegisterSW } from "virtual:pwa-register/svelte";
import { subscribeEHagakiDbUpgradeState } from "../storage/ehagakiDb";
import {
    createAcceptedServiceWorkerUpdateReloadController,
    watchServiceWorkerUpdateInstallation,
} from "../swUpdateDetectionUtils";
import {
    configureSwUpdateServiceWorker,
    enableServiceWorkerStore,
    setDbUpgradeBlocked,
    setSwUpdateStatus,
} from "../../stores/swStore.svelte";
import { requestStaleReloadPrompt, markStaleAssetReloadRequired } from "../../stores/staleAssetReloadStore.svelte";

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

    const updateReloadController = createAcceptedServiceWorkerUpdateReloadController(
        () => window.location.reload(),
        () => {
            if (markStaleAssetReloadRequired()) {
                requestStaleReloadPrompt();
            }
        },
    );

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
                updateReloadController.handleControlChange();
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
