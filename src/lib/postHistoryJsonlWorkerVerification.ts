import { createVerificationServiceClient, type VerificationResponse, type VerificationServiceClient } from "@rx-nostr/crypto";
import type { NostrEvent } from "./types";

const DEADLINE_MS = 10_000;

export interface PostHistoryJsonlWorkerVerificationOptions {
    signal?: AbortSignal;
    workerCount?: 1 | 2 | 4;
    workerFactory?: () => Worker;
    onFatal?: (error: Error) => void;
}

/** Prepare separately so the pool owns cleanup before any child starts. */
function prepareWorker(options: Pick<PostHistoryJsonlWorkerVerificationOptions, "workerFactory" | "onFatal">) {
    let worker: Worker | undefined;
    let client: VerificationServiceClient | undefined;
    const pending = new Set<(error: Error) => void>();
    let terminal: Error | null = null;
    let active = false;
    let resolveReady!: () => void;
    let rejectReady!: (error: Error) => void;
    const ready = new Promise<void>((resolve, reject) => {
        resolveReady = resolve;
        rejectReady = reject;
    });
    // Also observe rejection when a caller disposes before awaiting readiness.
    void ready.catch(() => undefined);
    let readyTimer: ReturnType<typeof setTimeout> | undefined;

    function stop(error: Error, fatal: boolean): void {
        if (terminal) return;
        terminal = error;
        active = false;
        clearTimeout(readyTimer);
        rejectReady(error);
        for (const reject of pending) reject(error);
        pending.clear();
        worker?.removeEventListener("message", onMessage);
        worker?.removeEventListener("message", onPong);
        worker?.removeEventListener("error", onError);
        worker?.removeEventListener("messageerror", onError);
        if (client) client.dispose();
        else worker?.terminate();
        if (fatal) options.onFatal?.(error);
    }
    function assertActive(): void {
        if (terminal) throw terminal;
        if (!active || client?.status !== "active") throw new Error("post_history_import_worker_unavailable");
    }
    function onMessage(event: MessageEvent<VerificationResponse | "pong">): void {
        if (terminal) return;
        if (event.data !== "pong" && typeof event.data?.error === "string") {
            // Do not expose a host's serialized exception or event contents.
            stop(new Error("post_history_import_worker_host_failed"), true);
        }
    }
    function onPong(event: MessageEvent<VerificationResponse | "pong">): void {
        if (event.data === "pong") {
            // Native event dispatch can checkpoint microtasks between listeners.
            // This listener follows the client's pong handler; fatal monitoring
            // remains before the client so error responses cannot become false.
            queueMicrotask(() => {
                if (terminal) return;
                if (client?.status !== "active") {
                    stop(new Error("post_history_import_worker_unavailable"), true);
                    return;
                }
                active = true;
                clearTimeout(readyTimer);
                resolveReady();
            });
        }
    }
    function onError(): void { stop(new Error("post_history_import_worker_failed"), true); }
    try {
        worker = options.workerFactory?.() ?? new Worker(
            new URL("./postHistoryJsonlVerificationWorker.ts", import.meta.url),
            { type: "module" },
        );
        client = createVerificationServiceClient({
            worker, timeout: DEADLINE_MS,
            fallback: async () => { throw new Error("post_history_import_worker_unavailable"); },
        });
        // Observe fatal responses before the client can resolve `ok: false`.
        worker.addEventListener("message", onMessage);
        if (!terminal) worker.addEventListener("error", onError);
        if (!terminal) worker.addEventListener("messageerror", onError);
    } catch {
        // This child has not yet been returned to the pool's cleanup list.
        const error = new Error("post_history_import_worker_failed");
        stop(error, false);
        throw error;
    }

    return {
        ready,
        assertActive,
        start(): void {
            if (terminal) return;
            readyTimer = setTimeout(() => stop(new Error("post_history_import_worker_readiness_timeout"), true), DEADLINE_MS);
            try {
                client!.start();
                // A synchronous error event during start may already stop us.
                if (!terminal) worker!.addEventListener("message", onPong);
            } catch { onError(); }
        },
        async verify(event: NostrEvent): Promise<boolean> {
            await ready;
            assertActive();
            const ok = await new Promise<boolean>((resolve, reject) => {
                const finish = (error?: Error, result?: boolean) => {
                    clearTimeout(timer);
                    pending.delete(cancel);
                    if (error) reject(error);
                    else resolve(result!);
                };
                const cancel = (error: Error) => finish(error);
                const timer = setTimeout(() => stop(new Error("post_history_import_worker_verification_timeout"), true), DEADLINE_MS);
                pending.add(cancel);
                try {
                    Promise.resolve(client!.verifier(event)).then(
                        result => finish(terminal ?? undefined, result),
                        () => stop(new Error("post_history_import_worker_verification_failed"), true),
                    );
                } catch { stop(new Error("post_history_import_worker_verification_failed"), true); }
            });
            assertActive();
            return ok;
        },
        dispose(): void { stop(new Error("post_history_import_worker_disposed"), false); },
    };
}

/** Owns the pool's transport and lifetime, never runtime attestations. */
export function createPostHistoryJsonlWorkerVerification(options: PostHistoryJsonlWorkerVerificationOptions = {}) {
    const children: ReturnType<typeof prepareWorker>[] = [];
    const pending = new Set<(error: Error) => void>();
    let terminal: Error | null = null;
    let active = false;
    let nextWorker = 0;
    let resolveReady!: () => void;
    let rejectReady!: (error: Error) => void;
    const ready = new Promise<void>((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
    void ready.catch(() => undefined);

    function stop(error: Error, fatal: boolean): void {
        if (terminal) return;
        terminal = error;
        active = false;
        rejectReady(error);
        for (const reject of pending) reject(error);
        pending.clear();
        options.signal?.removeEventListener("abort", onAbort);
        for (const child of children) child.dispose();
        // Notify only after every generated child has released its resources.
        if (fatal) options.onFatal?.(error);
    }
    function assertActive(): void {
        if (terminal) throw terminal;
        if (!active) throw new Error("post_history_import_worker_unavailable");
        for (const child of children) child.assertActive();
    }
    function onAbort(): void { stop(new DOMException("Import aborted", "AbortError"), false); }
    const onFatal = (error: Error) => stop(error, true);

    options.signal?.addEventListener("abort", onAbort, { once: true });
    if (options.signal?.aborted) onAbort();
    try {
        for (let index = 0; index < (options.workerCount ?? 4) && !terminal; index++) {
            const child = prepareWorker({ workerFactory: options.workerFactory, onFatal });
            children.push(child);
            if (terminal) child.dispose();
            else child.start();
        }
    } catch { onFatal(new Error("post_history_import_worker_failed")); }
    // Observe every readiness rejection, including construction failures.
    void Promise.all(children.map(child => child.ready)).then(() => {
        if (terminal) return;
        active = true;
        resolveReady();
    }, onFatal);

    return {
        ready,
        assertActive,
        async verify(event: NostrEvent): Promise<boolean> {
            await ready;
            assertActive();
            const child = children[nextWorker];
            nextWorker = (nextWorker + 1) % children.length;
            const ok = await new Promise<boolean>((resolve, reject) => {
                const cancel = (error: Error) => { pending.delete(cancel); reject(error); };
                pending.add(cancel);
                void child.verify(event).then(result => {
                    pending.delete(cancel);
                    if (terminal) reject(terminal);
                    else resolve(result);
                }, error => {
                    pending.delete(cancel);
                    if (!terminal) onFatal(new Error("post_history_import_worker_verification_failed"));
                    reject(terminal ?? error);
                });
            });
            // A different child may have failed while this one returned false.
            assertActive();
            return ok;
        },
        dispose(): void { stop(new Error("post_history_import_worker_disposed"), false); },
    };
}
