export type SwUpdateStatus = "idle" | "installing" | "ready";

export interface ServiceWorkerLike extends EventTarget {
    state: ServiceWorkerState;
}

export interface ServiceWorkerRegistrationLike extends EventTarget {
    active?: ServiceWorkerLike | null;
    installing?: ServiceWorkerLike | null;
    waiting?: ServiceWorkerLike | null;
}

export function getStatusForServiceWorkerState(
    state: ServiceWorkerState,
): SwUpdateStatus | null {
    if (state === "installed") {
        return "ready";
    }

    if (state === "installing" || state === "parsed") {
        return "installing";
    }

    if (state === "redundant") {
        return "idle";
    }

    return null;
}

export function watchServiceWorkerUpdateInstallation({
    registration,
    hasController,
    setStatus,
}: {
    registration: ServiceWorkerRegistrationLike;
    hasController: boolean;
    setStatus: (status: SwUpdateStatus) => void;
}): () => void {
    if (!hasController && !registration.active) {
        return () => {};
    }

    const cleanupCallbacks: Array<() => void> = [];

    const watchWorker = (worker: ServiceWorkerLike | null | undefined) => {
        if (!worker) {
            return;
        }

        const applyWorkerState = () => {
            const status = getStatusForServiceWorkerState(worker.state);
            if (status) {
                setStatus(status);
            }
        };

        applyWorkerState();
        worker.addEventListener("statechange", applyWorkerState);
        cleanupCallbacks.push(() =>
            worker.removeEventListener("statechange", applyWorkerState),
        );
    };

    if (registration.waiting) {
        setStatus("ready");
    }

    watchWorker(registration.installing);

    const handleUpdateFound = () => {
        watchWorker(registration.installing);
    };

    registration.addEventListener("updatefound", handleUpdateFound);
    cleanupCallbacks.push(() =>
        registration.removeEventListener("updatefound", handleUpdateFound),
    );

    return () => {
        for (const cleanup of cleanupCallbacks.splice(0)) {
            cleanup();
        }
    };
}
