import { getAppRuntimeEnvironment } from "../appRuntimeEnvironment";
import { EHAGAKI_DB_NATIVE_VERSION } from "./ehagakiDbConstants";
import { upgradeEhagakiDatabase } from "./ehagakiDbMigration";
import { installEhagakiDbOpenGate } from "./ehagakiDbOpenGate";
import {
    EHAGAKI_DB_CAPABILITY_PROBE,
    EHAGAKI_DB_CAPABILITY_REPORT,
    EHAGAKI_DB_UPGRADE_COMPLETE,
    EHAGAKI_DB_UPGRADE_REQUEST,
} from "./ehagakiDbUpgradeController";

export function installAppOriginEhagakiDatabaseGate(target: Window = window): void {
    installEhagakiDbOpenGate(() => waitForServiceWorkerDatabaseUpgrade(target));
}

export function installExternalHostEhagakiDatabaseGate(indexedDb: IDBFactory = indexedDB): void {
    installEhagakiDbOpenGate(() => upgradeEhagakiDatabase(indexedDb));
}

export async function installEhagakiDatabaseGateForRuntime(assetBase: URL): Promise<void> {
    if (getAppRuntimeEnvironment().serviceWorkerEnabled || await pageHasEhagakiServiceWorker(assetBase)) {
        installAppOriginEhagakiDatabaseGate();
        return;
    }
    installExternalHostEhagakiDatabaseGate();
}

async function pageHasEhagakiServiceWorker(assetBase: URL): Promise<boolean> {
    if (typeof navigator === "undefined" || !navigator.serviceWorker?.getRegistrations) return false;
    if (assetBase.origin !== window.location.origin) return false;
    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations.some((registration) => {
        const script = registration.active?.scriptURL
            ?? registration.waiting?.scriptURL
            ?? registration.installing?.scriptURL
            ?? "";
        return script.startsWith(assetBase.origin) && script.endsWith("/sw.js");
    });
}

function waitForServiceWorkerDatabaseUpgrade(target: Window): Promise<void> {
    const serviceWorker = target.navigator.serviceWorker;
    if (!serviceWorker) return Promise.resolve();
    return new Promise((resolve) => {
        let timer = 0;
        const requestUpgrade = () => {
            serviceWorker.controller?.postMessage({ type: EHAGAKI_DB_UPGRADE_REQUEST });
        };
        const onMessage = (event: Event) => {
            const data = (event as MessageEvent).data as { type?: string } | undefined;
            if (data?.type === EHAGAKI_DB_CAPABILITY_PROBE) {
                const source = (event as MessageEvent).source as { postMessage?: (message: unknown) => void } | null;
                source?.postMessage?.({
                    type: EHAGAKI_DB_CAPABILITY_REPORT,
                    supportedNativeVersion: EHAGAKI_DB_NATIVE_VERSION,
                });
            }
            if (data?.type === EHAGAKI_DB_UPGRADE_COMPLETE) {
                serviceWorker.removeEventListener("message", onMessage);
                serviceWorker.removeEventListener("controllerchange", requestUpgrade);
                target.clearInterval(timer);
                resolve();
            }
        };
        serviceWorker.addEventListener("message", onMessage);
        serviceWorker.addEventListener("controllerchange", requestUpgrade);
        timer = target.setInterval(requestUpgrade, 2000);
        requestUpgrade();
    });
}
