import { getAppRuntimeEnvironment } from "../appRuntimeEnvironment";
import en from "../i18n/en.json";
import ja from "../i18n/ja.json";
import { setEHagakiDbUpgradeBlocked } from "./ehagakiDb";
import { EHAGAKI_DB_NAME, EHAGAKI_DB_NATIVE_VERSION } from "./ehagakiDbConstants";
import { upgradeEhagakiDatabase } from "./ehagakiDbMigration";
import { installEhagakiDbOpenGate } from "./ehagakiDbOpenGate";
import {
    EHAGAKI_DB_CAPABILITY_PROBE,
    EHAGAKI_DB_CAPABILITY_REPORT,
    EHAGAKI_DB_UPGRADE_COMPLETE,
    EHAGAKI_DB_UPGRADE_REQUEST,
} from "./ehagakiDbUpgradeController";

export const EHAGAKI_DB_GATE_CONTROLLER_WAIT_MS = 8_000;
const NOTICE_ID = "ehagaki-db-gate-notice";

export interface EhagakiDatabaseGateOptions {
    databaseName?: string;
    indexedDb?: IDBFactory;
    controllerWaitMs?: number;
    /**
     * Production and preview register a service worker that performs the upgrade.
     * Vite dev does not, so the page must run the shared migration itself.
     */
    serviceWorkerUpgrade?: boolean;
}

export function installAppOriginEhagakiDatabaseGate(
    target: Window = window,
    options: EhagakiDatabaseGateOptions = {},
): void {
    installEhagakiDbOpenGate(() => runAppOriginDatabaseGate(target, options));
}

export function installExternalHostEhagakiDatabaseGate(
    indexedDb: IDBFactory = indexedDB,
    databaseName = EHAGAKI_DB_NAME,
): void {
    installEhagakiDbOpenGate(() => upgradeEhagakiDatabase(indexedDb, { databaseName }));
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

function runAppOriginDatabaseGate(
    target: Window,
    options: EhagakiDatabaseGateOptions,
): Promise<void> {
    const databaseName = options.databaseName ?? EHAGAKI_DB_NAME;
    const indexedDb = options.indexedDb ?? target.indexedDB;
    return new Promise((resolve) => {
        let settled = false;
        let newerDatabase = false;
        let attempt: Promise<void> | null = null;
        const finish = () => {
            if (settled || newerDatabase) return;
            settled = true;
            hideEhagakiDatabaseGateNotice(target.document);
            setEHagakiDbUpgradeBlocked(false);
            resolve();
        };
        const serviceWorker = target.navigator.serviceWorker;

        const migrateFromPage = () => {
            if (settled || newerDatabase) return;
            if (attempt) return;
            attempt = upgradeEhagakiDatabase(indexedDb, {
                databaseName,
                onBlocked: () => {
                    showEhagakiDatabaseGateNotice(target, "blocked");
                    setEHagakiDbUpgradeBlocked(true);
                },
                onBlockedResolved: () => setEHagakiDbUpgradeBlocked(false),
            }).then(() => {
                attempt = null;
                finish();
            }).catch((error: unknown) => {
                attempt = null;
                if (settled) return;
                if (isVersionError(error)) {
                    newerDatabase = true;
                    showEhagakiDatabaseGateNotice(target, "versionError");
                    return;
                }
                showEhagakiDatabaseGateNotice(target, "retry", () => migrateFromPage());
            });
        };

        migrateFromPage();
        if (!serviceWorker || options.serviceWorkerUpgrade === false) {
            return;
        }

        const onMessage = (event: Event) => {
            const message = event as MessageEvent;
            const data = message.data as { type?: string } | undefined;
            if (data?.type === EHAGAKI_DB_CAPABILITY_PROBE) {
                const source = message.source as { postMessage?: (payload: unknown) => void } | null;
                source?.postMessage?.({
                    type: EHAGAKI_DB_CAPABILITY_REPORT,
                    supportedNativeVersion: EHAGAKI_DB_NATIVE_VERSION,
                });
            }
            // The worker's completion message is not proof this page can open
            // the database. A newer native version still has to stay closed.
            if (data?.type === EHAGAKI_DB_UPGRADE_COMPLETE) migrateFromPage();
        };
        const requestUpgrade = () => {
            serviceWorker.controller?.postMessage({ type: EHAGAKI_DB_UPGRADE_REQUEST });
        };
        serviceWorker.addEventListener("message", onMessage);
        serviceWorker.addEventListener("controllerchange", requestUpgrade);
        requestUpgrade();
    });
}

function isVersionError(error: unknown): boolean {
    return typeof error === "object"
        && error !== null
        && "name" in error
        && (error as { name?: string }).name === "VersionError";
}

function gateCopy(storage: Storage | undefined) {
    const locale = storage?.getItem("locale") ?? "";
    return locale.toLowerCase().startsWith("en") ? en.databaseGate : ja.databaseGate;
}

function showEhagakiDatabaseGateNotice(
    target: Window,
    kind: "blocked" | "retry" | "versionError",
    retry?: () => void,
): void {
    const copy = gateCopy(target.localStorage);
    const notice = target.document.getElementById(NOTICE_ID) ?? target.document.createElement("div");
    notice.id = NOTICE_ID;
    notice.setAttribute("role", "alert");
    notice.dataset.ehagakiDbGate = kind;
    notice.style.position = "fixed";
    notice.style.zIndex = "11000";
    notice.style.left = "16px";
    notice.style.right = "16px";
    notice.style.bottom = "16px";
    notice.style.padding = "12px 16px";
    notice.style.borderRadius = "12px";
    notice.style.background = "var(--dialog-bg, #fff)";
    notice.style.color = "var(--text, #111)";
    notice.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.28)";
    const message = kind === "blocked"
        ? copy.blocked
        : kind === "versionError"
            ? copy.versionError
            : copy.retry;
    notice.replaceChildren();
    const paragraph = target.document.createElement("p");
    paragraph.textContent = message;
    notice.append(paragraph);
    if (retry && kind !== "blocked") {
        const button = target.document.createElement("button");
        button.type = "button";
        button.textContent = copy.retryButton;
        // Global button rules use height: 100%. This notice has no explicit
        // height, and WebKit can give that button no hit target.
        button.style.height = "auto";
        button.style.minHeight = "44px";
        button.style.padding = "8px 0";
        button.style.justifyContent = "flex-start";
        button.addEventListener("click", retry);
        notice.append(button);
    }
    if (!notice.isConnected) target.document.body.append(notice);
}

function hideEhagakiDatabaseGateNotice(documentRef: Document): void {
    documentRef.getElementById(NOTICE_ID)?.remove();
}
