import { describe, expect, it, vi } from "vitest";

import {
    getStatusForServiceWorkerState,
    watchServiceWorkerUpdateInstallation,
    type ServiceWorkerLike,
    type ServiceWorkerRegistrationLike,
} from "../../lib/swUpdateDetectionUtils";

class MockServiceWorker extends EventTarget implements ServiceWorkerLike {
    state: ServiceWorkerState;

    constructor(state: ServiceWorkerState) {
        super();
        this.state = state;
    }

    setState(state: ServiceWorkerState) {
        this.state = state;
        this.dispatchEvent(new Event("statechange"));
    }
}

class MockServiceWorkerRegistration
    extends EventTarget
    implements ServiceWorkerRegistrationLike
{
    active: ServiceWorkerLike | null = null;
    installing: ServiceWorkerLike | null = null;
    waiting: ServiceWorkerLike | null = null;

    findUpdate(worker: ServiceWorkerLike) {
        this.installing = worker;
        this.dispatchEvent(new Event("updatefound"));
    }
}

describe("swUpdateDetectionUtils", () => {
    it("Service Worker の state から更新UI状態を返す", () => {
        expect(getStatusForServiceWorkerState("parsed")).toBe("installing");
        expect(getStatusForServiceWorkerState("installing")).toBe(
            "installing",
        );
        expect(getStatusForServiceWorkerState("installed")).toBe("ready");
        expect(getStatusForServiceWorkerState("redundant")).toBe("idle");
        expect(getStatusForServiceWorkerState("activated")).toBeNull();
    });

    it("既存 controller がない初回 install は更新として扱わない", () => {
        const registration = new MockServiceWorkerRegistration();
        registration.installing = new MockServiceWorker("installing");
        const setStatus = vi.fn();

        watchServiceWorkerUpdateInstallation({
            registration,
            hasController: false,
            setStatus,
        });

        expect(setStatus).not.toHaveBeenCalled();
    });

    it("updatefound 直後に installing、installed で ready を通知する", () => {
        const registration = new MockServiceWorkerRegistration();
        registration.active = new MockServiceWorker("activated");
        const setStatus = vi.fn();

        watchServiceWorkerUpdateInstallation({
            registration,
            hasController: true,
            setStatus,
        });

        const worker = new MockServiceWorker("installing");
        registration.findUpdate(worker);
        worker.setState("installed");

        expect(setStatus).toHaveBeenNthCalledWith(1, "installing");
        expect(setStatus).toHaveBeenNthCalledWith(2, "ready");
    });

    it("waiting worker が既にある場合は ready を通知する", () => {
        const registration = new MockServiceWorkerRegistration();
        registration.active = new MockServiceWorker("activated");
        registration.waiting = new MockServiceWorker("installed");
        const setStatus = vi.fn();

        watchServiceWorkerUpdateInstallation({
            registration,
            hasController: true,
            setStatus,
        });

        expect(setStatus).toHaveBeenCalledWith("ready");
    });
});
