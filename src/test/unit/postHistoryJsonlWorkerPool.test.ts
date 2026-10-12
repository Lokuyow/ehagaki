import { afterEach, describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { createVerificationServiceClient } from "@rx-nostr/crypto";
import { createPostHistoryJsonlVerificationSession, isCurrentPostHistoryRawEventAttestation } from "../../lib/postHistoryRawEventVerification";
import { PostHistoryJsonlVerificationWorkerMock as MockWorker } from "../mocks/postHistoryJsonlVerificationWorker";

vi.mock("@rx-nostr/crypto", async importOriginal => {
    const actual = await importOriginal<typeof import("@rx-nostr/crypto")>();
    return { ...actual, createVerificationServiceClient: vi.fn(actual.createVerificationServiceClient) };
});

const signed = finalizeEvent({ kind: 1, content: "pool fixture", tags: [["t", "test"]], created_at: 123 }, generateSecretKey());
const counts = [1, 2, 4] as const;

class TrackedWorker extends MockWorker {
    listeners = new Map<string, Set<EventListenerOrEventListenerObject>>();
    override addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
        if (listener) {
            const listeners = this.listeners.get(type) ?? new Set();
            listeners.add(listener); this.listeners.set(type, listeners);
        }
        super.addEventListener(type, listener, options);
    }
    override removeEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions): void {
        if (listener) this.listeners.get(type)?.delete(listener);
        super.removeEventListener(type, listener, options);
    }
    get listenerCount(): number { return [...this.listeners.values()].reduce((sum, listeners) => sum + listeners.size, 0); }
}

afterEach(() => { vi.useRealTimers(); });

describe("JSONL Worker pool", () => {
    it("defaults to four Workers and dispatches single-event RPCs round-robin", async () => {
        const workers: TrackedWorker[] = [];
        const session = createPostHistoryJsonlVerificationSession({ workerFactory: () => {
            const worker = new TrackedWorker(); workers.push(worker); return worker;
        } });
        await session.ready;
        expect(workers).toHaveLength(4);
        const inputs = Array.from({ length: 12 }, (_, index) => ({ ...signed, content: String(index) }));
        expect(await Promise.all(inputs.map(event => session.verify(event)))).toEqual(Array(12).fill(null));
        expect(workers.map(worker => worker.requests.map(request => request.event.content))).toEqual([
            ["0", "4", "8"], ["1", "5", "9"], ["2", "6", "10"], ["3", "7", "11"],
        ]);
        expect(await session.verify(signed)).not.toBeNull();
        session.dispose();
        expect(workers.every(worker => worker.terminated && worker.listenerCount === 0)).toBe(true);
    });

    it.each(counts)("waits for every pong and isolates snapshots with %i Workers", async workerCount => {
        const workers = Array.from({ length: workerCount }, () => new TrackedWorker());
        workers.forEach(worker => { vi.spyOn(worker, "postMessage").mockImplementationOnce(() => undefined); });
        let index = 0;
        const session = createPostHistoryJsonlVerificationSession({ workerCount, workerFactory: () => workers[index++] });
        const source = { ...signed, tags: signed.tags.map(tag => [...tag]) };
        const operation = session.verify(source);
        source.content = "mutated"; source.tags[0][1] = "mutated";
        for (const worker of workers.slice(0, -1)) worker.reply("pong");
        await Promise.resolve(); await Promise.resolve();
        expect(workers.every(worker => worker.requests.length === 0)).toBe(true);
        workers.at(-1)!.reply("pong");
        const result = await operation;
        expect(result?.event.content).toBe(signed.content);
        expect(isCurrentPostHistoryRawEventAttestation(result!.event, result!.attestation)).toBe(true);
        session.dispose();
    });

    for (const phase of ["creation", "start", "prepare", "fatal during prepare", "fatal during start"] as const) {
        it.each([2, 3, 4])(`atomically cleans up ${phase} failure at child %i`, async failedChild => {
            vi.useFakeTimers();
            const workers: TrackedWorker[] = [];
            const controller = new AbortController();
            const removeAbort = vi.spyOn(controller.signal, "removeEventListener");
            const cleanupAtFatal: {cleaned: boolean; timers: number}[] = [];
            const fatal = vi.fn(() => { cleanupAtFatal.push({
                cleaned: workers.every(worker => worker.terminated && worker.listenerCount === 0), timers: vi.getTimerCount(),
            }); });
            const factory = vi.fn(() => {
                if (factory.mock.calls.length === failedChild && phase === "creation") throw new Error("creation failed");
                const worker = new TrackedWorker(); workers.push(worker);
                if (workers.length === failedChild) {
                    if (phase === "prepare") {
                        const addListener = worker.addEventListener.bind(worker);
                        vi.spyOn(worker, "addEventListener").mockImplementationOnce((...args) => { addListener(...args); throw new Error("prepare failed"); });
                    }
                    else if (phase === "fatal during prepare") {
                        const addListener = worker.addEventListener.bind(worker);
                        vi.spyOn(worker, "addEventListener").mockImplementation((...args) => {
                            addListener(...args);
                            if (args[0] === "error") worker.dispatchEvent(new Event("error"));
                        });
                    }
                    else if (phase === "start") vi.spyOn(worker, "postMessage").mockImplementationOnce(() => { throw new Error("start failed"); });
                    else if (phase === "fatal during start") vi.spyOn(worker, "postMessage").mockImplementationOnce(() => { worker.dispatchEvent(new Event("error")); });
                }
                return worker;
            });
            const session = createPostHistoryJsonlVerificationSession({ workerFactory: factory, signal: controller.signal, onFatal: fatal });
            await expect(session.ready).rejects.toThrow("worker_failed");
            await expect(session.verify(signed)).rejects.toThrow("worker_failed");
            expect(factory).toHaveBeenCalledTimes(failedChild);
            expect(workers).toHaveLength(phase === "creation" ? failedChild - 1 : failedChild);
            expect(fatal).toHaveBeenCalledOnce();
            expect(cleanupAtFatal).toEqual([{cleaned:true,timers:0}]);
            expect(removeAbort).toHaveBeenCalledWith("abort", expect.any(Function));
            session.dispose(); session.dispose(); controller.abort();
            for (const worker of workers) {
                worker.dispatchEvent(new Event("error"));
                worker.dispatchEvent(new MessageEvent("message", { data: { reqId: 1, ok: false, error: "late failure" } }));
            }
            await vi.advanceTimersByTimeAsync(20_000);
            expect(fatal).toHaveBeenCalledOnce();
            expect(vi.getTimerCount()).toBe(0);
            expect(workers.every(worker => worker.terminated && worker.requests.length === 0 && worker.listenerCount === 0)).toBe(true);
        });
    }

    it.each(counts)("cleans up the whole pool on readiness/request deadlines with %i Workers", async workerCount => {
        vi.useFakeTimers();
        for (const phase of ["ready", "request"]) {
            const workers = Array.from({ length: workerCount }, () => new TrackedWorker());
            workers.forEach(worker => { worker.hold = true; });
            if (phase === "ready") vi.spyOn(workers.at(-1)!, "postMessage").mockImplementationOnce(() => undefined);
            let index = 0; const fatal = vi.fn();
            const session = createPostHistoryJsonlVerificationSession({ workerCount, workerFactory: () => workers[index++], onFatal: fatal });
            const operation = phase === "ready" ? session.ready : session.verify(signed);
            const assertion = expect(operation).rejects.toThrow(/timeout/);
            await vi.advanceTimersByTimeAsync(10_000); await assertion;
            expect(fatal).toHaveBeenCalledOnce();
            expect(workers.every(worker => worker.terminated && worker.listenerCount === 0)).toBe(true);
            expect(vi.getTimerCount()).toBe(0);
        }
    });

    it("does not allocate Workers for an already aborted invocation", async () => {
        const controller = new AbortController(); controller.abort();
        const factory = vi.fn(() => new TrackedWorker()); const fatal = vi.fn();
        const session = createPostHistoryJsonlVerificationSession({ signal: controller.signal, workerFactory: factory, onFatal: fatal });
        await expect(session.ready).rejects.toMatchObject({name:"AbortError"});
        await expect(session.verify(signed)).rejects.toMatchObject({name:"AbortError"});
        expect(factory).not.toHaveBeenCalled(); expect(fatal).not.toHaveBeenCalled(); session.dispose();
    });

    it.each(counts)("disposes verification waiting for pool readiness with %i Workers", async workerCount => {
        vi.useFakeTimers();
        const workers: TrackedWorker[] = [];
        const session = createPostHistoryJsonlVerificationSession({workerCount,workerFactory:()=>{
            const worker = new TrackedWorker(); workers.push(worker);
            vi.spyOn(worker,"postMessage").mockImplementationOnce(()=>undefined); return worker;
        }});
        const pending = Promise.allSettled([session.ready,session.verify(signed)]);
        session.dispose();
        expect((await pending).every(result=>result.status==="rejected")).toBe(true);
        expect(workers.every(worker=>worker.terminated&&worker.listenerCount===0&&worker.requests.length===0)).toBe(true);
        expect(vi.getTimerCount()).toBe(0);
    });

    for (const workerCount of counts) {
        for (let failed = 0; failed < workerCount; failed++) {
            it.each(["error", "messageerror", "host error", "client reject", "abort", "dispose"])(`${workerCount} Workers: child ${failed + 1} %s ends all pending and wins over false`, async reason => {
                const workers = Array.from({ length: workerCount }, () => new TrackedWorker());
                workers.forEach(worker => { worker.hold = true; });
                let index = 0; const fatal = vi.fn(); const controller = new AbortController();
                const session = createPostHistoryJsonlVerificationSession({ workerCount, workerFactory: () => workers[index++], onFatal: fatal, signal: controller.signal });
                await session.ready;
                const operations = Array.from({ length: workerCount * 2 }, () => session.verify(signed));
                const settled = Promise.allSettled(operations);
                await vi.waitFor(() => expect(workers.every(worker => worker.requests.length === 2)).toBe(true));
                if (reason !== "client reject") workers[0].reply({ reqId: 1, ok: false });
                if (reason === "abort") controller.abort();
                else if (reason === "dispose") session.dispose();
                else if (reason === "host error") workers[failed].reply({ reqId: 2, ok: false, error: "unexpected failure" });
                else if (reason === "client reject") {
                    vi.spyOn(workers[failed], "postMessage").mockImplementation(() => { throw new Error("request failed"); });
                    // Advance round-robin to the selected child without consuming false.
                    operations.push(...Array.from({ length: failed + 1 }, () => session.verify(signed)));
                    await Promise.allSettled(operations.slice(workerCount * 2));
                } else workers[failed].dispatchEvent(new Event(reason));
                const outcomes = await settled;
                expect(outcomes.every(outcome => outcome.status === "rejected")).toBe(true);
                expect(fatal).toHaveBeenCalledTimes(reason === "abort" || reason === "dispose" ? 0 : 1);
                expect(workers.every(worker => worker.terminated && worker.listenerCount === 0)).toBe(true);
                workers.forEach(worker => worker.release());
                await expect(session.verify(signed)).rejects.toThrow();
                session.dispose();
            });
        }
    }

    it("observes a late client rejection after pool disposal", async () => {
        const original = vi.mocked(createVerificationServiceClient).getMockImplementation()!;
        let rejectLate!: (error: Error) => void;
        vi.mocked(createVerificationServiceClient).mockImplementationOnce(options => {
            const client = original(options);
            client.verifier = () => new Promise<boolean>((_, reject) => { rejectLate = reject; });
            return client;
        });
        const session = createPostHistoryJsonlVerificationSession({ workerFactory: () => new TrackedWorker() });
        await session.ready;
        const operation = session.verify(signed);
        const assertion = expect(operation).rejects.toThrow("disposed");
        await vi.waitFor(() => expect(rejectLate).toBeTypeOf("function"));
        session.dispose(); await assertion;
        rejectLate(new Error("late rejection"));
        await Promise.resolve(); await Promise.resolve();
    });
});
