import {
    createAcceptedServiceWorkerUpdateReloadController,
    type SwUpdateStatus,
} from "../lib/swUpdateDetectionUtils";
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

export function handleServiceWorkerControlChange() {
    return updateReloadController.handleControlChange();
}

export function setSwUpdateStatus(value: SwUpdateStatus) {
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

export function setDbUpgradeBlocked(value: boolean) {
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

let serviceWorkerEnabled = false;
let swUpdateServiceWorkerImpl: (reloadPage?: boolean) => void | Promise<void> =
    () => undefined;

export function enableServiceWorkerStore(): void {
    serviceWorkerEnabled = true;
}

export function configureSwUpdateServiceWorker(
    updateServiceWorker: (reloadPage?: boolean) => void | Promise<void>,
): void {
    swUpdateServiceWorkerImpl = updateServiceWorker;
}

export function swUpdateServiceWorker(reloadPage?: boolean): void | Promise<void> {
    return swUpdateServiceWorkerImpl(reloadPage);
}

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
    if (!serviceWorkerEnabled) return Promise.resolve(null);
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
