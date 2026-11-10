import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requestServiceWorker } from "../../lib/utils/serviceWorkerRequest";

class FakeChannel {
    static last: FakeChannel | null = null;
    port1 = {
        onmessage: null as ((event: { data: unknown }) => void) | null,
        onmessageerror: null as ((event: unknown) => void) | null,
        close: vi.fn(),
    };
    port2 = {};
    constructor() {
        FakeChannel.last = this;
    }
}

beforeEach(() => {
    FakeChannel.last = null;
    vi.stubGlobal("MessageChannel", FakeChannel);
    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

describe("requestServiceWorker", () => {
    it("resolves the first reply, transfers port2, and closes the port", async () => {
        const target = { postMessage: vi.fn() };
        const pending = requestServiceWorker(target, { type: "PING" }, 1000);
        const channel = FakeChannel.last!;

        expect(target.postMessage).toHaveBeenCalledWith({ type: "PING" }, [channel.port2]);
        channel.port1.onmessage?.({ data: { ok: true } });

        await expect(pending).resolves.toEqual({ status: "reply", data: { ok: true } });
        expect(channel.port1.close).toHaveBeenCalledOnce();
        expect(channel.port1.onmessage).toBeNull();
        expect(vi.getTimerCount()).toBe(0);
    });

    it("times out once, clears the timer, and ignores late replies", async () => {
        const pending = requestServiceWorker({ postMessage: vi.fn() }, {}, 1000);
        const channel = FakeChannel.last!;
        const lateHandler = channel.port1.onmessage;

        vi.advanceTimersByTime(1000);
        await expect(pending).resolves.toEqual({ status: "timeout" });
        lateHandler?.({ data: "late" });

        expect(channel.port1.close).toHaveBeenCalledOnce();
        expect(vi.getTimerCount()).toBe(0);
    });

    it("reports postMessage failures without waiting for the timeout", async () => {
        const failure = new Error("detached");
        const pending = requestServiceWorker({
            postMessage: () => { throw failure; },
        }, {}, 1000);

        await expect(pending).resolves.toEqual({ status: "error", error: failure });
        expect(FakeChannel.last!.port1.close).toHaveBeenCalledOnce();
        expect(vi.getTimerCount()).toBe(0);
    });

    it("reports message errors", async () => {
        const pending = requestServiceWorker({ postMessage: vi.fn() }, {}, 1000);
        const errorEvent = { type: "messageerror" };
        FakeChannel.last!.port1.onmessageerror?.(errorEvent);

        await expect(pending).resolves.toEqual({ status: "error", error: errorEvent });
    });
});
