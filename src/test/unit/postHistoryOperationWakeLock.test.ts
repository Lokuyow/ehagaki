import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { createPostHistoryOperationWakeLock } from "../../lib/postHistoryOperationWakeLock";
import { deferred, installScreenWakeLockMock, TestWakeLockSentinel } from "../mocks/screenWakeLock";

describe("post-history operation screen wake lock", () => {
    let manager: ReturnType<typeof createPostHistoryOperationWakeLock>;
    let mock: ReturnType<typeof installScreenWakeLockMock>;
    let visibility: MockInstance<() => DocumentVisibilityState>;
    let leases: Array<() => void>;
    const acquire = () => {
        const end = manager.acquire(); leases.push(end); return end;
    };
    const setVisibility = (state: DocumentVisibilityState) => {
        visibility.mockReturnValue(state);
        document.dispatchEvent(new Event("visibilitychange"));
    };
    const flush = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };

    beforeEach(() => {
        manager = createPostHistoryOperationWakeLock();
        mock = installScreenWakeLockMock();
        visibility = vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
        leases = [];
    });
    afterEach(() => {
        leases.forEach(end => end());
        mock.restore(); vi.restoreAllMocks();
    });

    it("requests once for overlapping leases and releases only when the last ends", async () => {
        const lock = new TestWakeLockSentinel(); mock.request.mockResolvedValue(lock);
        const first = acquire(); const second = acquire();
        expect(mock.request).toHaveBeenCalledExactlyOnceWith("screen");
        await flush();
        first(); first();
        expect(lock.release).not.toHaveBeenCalled();
        second(); second();
        expect(lock.release).toHaveBeenCalledOnce();
    });

    it("reacquires a new sentinel on visible after hidden auto-release while a lease remains", async () => {
        const first = new TestWakeLockSentinel(); const second = new TestWakeLockSentinel();
        mock.request.mockResolvedValueOnce(first).mockResolvedValueOnce(second);
        const end = acquire(); await flush();
        first.autoRelease(); setVisibility("hidden");
        expect(mock.request).toHaveBeenCalledTimes(1);
        setVisibility("visible"); await flush();
        expect(mock.request).toHaveBeenCalledTimes(2);
        end(); expect(second.release).toHaveBeenCalledOnce();
    });

    it("does not reacquire on visible after all leases ended", async () => {
        const end = acquire(); await flush();
        setVisibility("hidden"); end(); setVisibility("visible"); await flush();
        expect(mock.request).toHaveBeenCalledTimes(1);
    });

    it("waits for visible when an operation starts hidden", async () => {
        setVisibility("hidden"); acquire();
        expect(mock.request).not.toHaveBeenCalled();
        setVisibility("visible"); await flush();
        expect(mock.request).toHaveBeenCalledExactlyOnceWith("screen");
    });

    it("keeps the caller running when the API is unsupported", async () => {
        mock.set(undefined);
        const end = acquire(); await flush(); end();
        expect(mock.request).not.toHaveBeenCalled();
    });

    it.each(["reject", "throw"])("ignores request %s without retrying in a loop", async (failure) => {
        if (failure === "reject") mock.request.mockRejectedValue(new Error("denied"));
        else mock.request.mockImplementation(() => { throw new Error("unavailable"); });
        const end = acquire(); await flush(); end();
        expect(mock.request).toHaveBeenCalledOnce();
    });

    it("immediately releases a sentinel acquired after the last lease ended", async () => {
        const pending = deferred<WakeLockSentinel>(); mock.request.mockReturnValue(pending.promise);
        const end = acquire(); end();
        const late = new TestWakeLockSentinel(); pending.resolve(late); await flush();
        expect(late.release).toHaveBeenCalledOnce();
        setVisibility("visible"); expect(mock.request).toHaveBeenCalledOnce();
    });

    it("coalesces repeated visible events while a request is pending", async () => {
        const pending = deferred<WakeLockSentinel>(); mock.request.mockReturnValue(pending.promise);
        acquire();
        for (let i = 0; i < 10; i++) setVisibility("visible");
        expect(mock.request).toHaveBeenCalledOnce();
        pending.resolve(new TestWakeLockSentinel()); await flush();
        expect(mock.request).toHaveBeenCalledOnce();
    });

    it("serializes visibility churn behind a pending request and discards its stale sentinel", async () => {
        const pending = deferred<WakeLockSentinel>();
        mock.request.mockReturnValueOnce(pending.promise);
        acquire(); setVisibility("hidden"); setVisibility("visible");
        setVisibility("hidden"); setVisibility("visible");
        expect(mock.request).toHaveBeenCalledOnce();
        const stale = new TestWakeLockSentinel(); pending.resolve(stale); await flush();
        expect(stale.release).toHaveBeenCalledOnce();
        expect(mock.request).toHaveBeenCalledTimes(2);
    });

    it("retries a stale rejected request once after returning visible", async () => {
        const pending = deferred<WakeLockSentinel>(); mock.request.mockReturnValueOnce(pending.promise);
        acquire(); setVisibility("hidden"); setVisibility("visible");
        pending.reject(new Error("hidden")); await flush();
        expect(mock.request).toHaveBeenCalledTimes(2);
    });

    it("does not keep an old request when a new operation starts after an idle gap", async () => {
        const pending = deferred<WakeLockSentinel>(); mock.request.mockReturnValueOnce(pending.promise);
        const end = acquire(); end(); acquire();
        expect(mock.request).toHaveBeenCalledOnce();
        const stale = new TestWakeLockSentinel(); pending.resolve(stale); await flush();
        expect(stale.release).toHaveBeenCalledOnce(); expect(mock.request).toHaveBeenCalledTimes(2);
    });

    it("ignores delayed release events from an old sentinel after a new lock was acquired", async () => {
        const first = new TestWakeLockSentinel(); const second = new TestWakeLockSentinel();
        mock.request.mockResolvedValueOnce(first).mockResolvedValueOnce(second);
        const end = acquire(); await flush();
        setVisibility("hidden"); setVisibility("visible"); await flush();
        first.autoRelease(); end();
        expect(second.release).toHaveBeenCalledOnce(); expect(mock.request).toHaveBeenCalledTimes(2);
    });

    it("does not reuse a sentinel already released before request resolved", async () => {
        const lock = new TestWakeLockSentinel(); lock.autoRelease();
        mock.request.mockResolvedValueOnce(lock);
        acquire(); await flush();
        setVisibility("visible"); await flush();
        expect(mock.request).toHaveBeenCalledTimes(2);
    });

    it.each(["reject", "throw"])("ignores release %s and can serve a later operation", async (failure) => {
        const lock = new TestWakeLockSentinel(); mock.request.mockResolvedValueOnce(lock);
        if (failure === "reject") lock.release.mockRejectedValue(new Error("release failed"));
        else lock.release.mockImplementation(() => { throw new Error("release failed"); });
        const end = acquire(); await flush(); end(); await flush();
        acquire(); await flush(); expect(mock.request).toHaveBeenCalledTimes(2);
    });

    it("ignores reacquisition failure and does not retry after the operation ends", async () => {
        const end = acquire(); await flush();
        setVisibility("hidden"); mock.request.mockRejectedValue(new Error("battery low"));
        setVisibility("visible"); await flush(); end();
        setVisibility("hidden"); setVisibility("visible"); await flush();
        expect(mock.request).toHaveBeenCalledTimes(2);
    });
});
