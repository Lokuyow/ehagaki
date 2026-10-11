import { createVerificationServiceClient, type VerificationResponse } from "@rx-nostr/crypto";
import type { NostrEvent } from "./types";

const DEADLINE_MS = 10_000;

export interface PostHistoryJsonlWorkerVerificationOptions {
    signal?: AbortSignal;
    workerFactory?: () => Worker;
    onFatal?: (error: Error) => void;
}

/** Owns only the official verifier transport, never runtime attestations. */
export function createPostHistoryJsonlWorkerVerification(options: PostHistoryJsonlWorkerVerificationOptions = {}) {
    const worker = options.workerFactory?.() ?? new Worker(
        new URL("./postHistoryJsonlVerificationWorker.ts", import.meta.url),
        { type: "module" },
    );
    const client = createVerificationServiceClient({
        worker, timeout: DEADLINE_MS,
        fallback: async () => { throw new Error("post_history_import_worker_unavailable"); },
    });
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
    const readyTimer = setTimeout(() => stop(new Error("post_history_import_worker_readiness_timeout"), true), DEADLINE_MS);

    function stop(error: Error, fatal: boolean): void {
        if (terminal) return;
        terminal = error;
        active = false;
        clearTimeout(readyTimer);
        rejectReady(error);
        for (const reject of pending) reject(error);
        pending.clear();
        worker.removeEventListener("message", onMessage);
        worker.removeEventListener("message", onPong);
        worker.removeEventListener("error", onError);
        worker.removeEventListener("messageerror", onError);
        options.signal?.removeEventListener("abort", onAbort);
        client.dispose();
        if (fatal) options.onFatal?.(error);
    }
    function assertActive(): void {
        if (terminal) throw terminal;
        if (!active || client.status !== "active") throw new Error("post_history_import_worker_unavailable");
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
                if (client.status !== "active") {
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
    function onAbort(): void { stop(new DOMException("Import aborted", "AbortError"), false); }

    // Observe fatal responses before the client can resolve their `ok: false`.
    worker.addEventListener("message", onMessage);
    worker.addEventListener("error", onError);
    worker.addEventListener("messageerror", onError);
    options.signal?.addEventListener("abort", onAbort, { once: true });
    if (options.signal?.aborted) onAbort();
    else {
        try {
            client.start();
            worker.addEventListener("message", onPong);
        } catch { onError(); }
    }

    return {
        ready,
        assertActive,
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
                    Promise.resolve(client.verifier(event)).then(
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
