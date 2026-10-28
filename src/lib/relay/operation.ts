/** One operation owns one timer, including all of its phases and delivery waves. */
export interface RelayClock {
    now?: () => number;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (timer: ReturnType<typeof setTimeout>) => void;
}

export type RelayEnd = "complete" | "quorum" | "timeout" | "error" | "cancelled";
export const RELAY_QUERY_TIMEOUT_MS = 6_000;
export const RELAY_QUERY_GRACE_MS = 300;

export class RelayOperation {
    readonly now: () => number;
    readonly startedAt: number;
    readonly signal: AbortSignal;
    reason?: RelayEnd;
    private controller = new AbortController();
    private deadlines = new Map<object | string, { at: number; run: () => void }>();
    private cleanups = new Set<() => void>();
    private timer?: ReturnType<typeof setTimeout>;
    private firing = false;
    private setTimer: NonNullable<RelayClock["setTimeoutFn"]>;
    private clearTimer: NonNullable<RelayClock["clearTimeoutFn"]>;

    constructor(timeoutMs: number, private onEnd: (reason: RelayEnd) => void, clock: RelayClock = {}) {
        this.now = clock.now ?? Date.now;
        this.startedAt = this.now();
        this.signal = this.controller.signal;
        // Native browser timers must not receive this operation as their receiver.
        const schedule = clock.setTimeoutFn ?? setTimeout;
        const cancel = clock.clearTimeoutFn ?? clearTimeout;
        this.setTimer = (fn, ms) => schedule(fn, ms);
        this.clearTimer = timer => cancel(timer);
        this.setDeadline(this.startedAt + timeoutMs);
    }

    add(cleanup: () => void): () => void {
        if (this.reason) cleanup();
        else this.cleanups.add(cleanup);
        return () => this.cleanups.delete(cleanup);
    }

    bind(signal?: AbortSignal): void {
        if (!signal) return;
        const cancel = () => this.finish("cancelled");
        signal.addEventListener("abort", cancel, { once: true });
        this.add(() => signal.removeEventListener("abort", cancel));
        if (signal.aborted) cancel();
    }

    setDeadline(at: number): void {
        this.schedule("deadline", at, () => this.finish("timeout"));
    }

    schedule(key: object | string, at: number, run: () => void): void {
        if (this.reason) return;
        this.deadlines.set(key, { at, run });
        this.arm();
    }

    unschedule(key: object | string): void {
        this.deadlines.delete(key);
        this.arm();
    }

    finish(reason: RelayEnd = "complete"): void {
        if (this.reason) return;
        this.reason = reason;
        if (this.timer !== undefined) this.clearTimer(this.timer);
        this.timer = undefined;
        this.deadlines.clear();
        this.controller.abort();
        for (const cleanup of this.cleanups) cleanup();
        this.cleanups.clear();
        this.onEnd(reason);
    }

    private arm(): void {
        if (this.firing) return;
        if (this.timer !== undefined) this.clearTimer(this.timer);
        this.timer = undefined;
        if (this.reason || !this.deadlines.size) return;
        const [key, next] = [...this.deadlines].sort((a, b) => a[1].at - b[1].at)[0];
        this.timer = this.setTimer(() => {
            this.timer = undefined;
            this.firing = true;
            try {
                this.deadlines.delete(key);
                next.run();
                // Several phases can share the same absolute deadline. Drain them
                // in this dispatch instead of scheduling another zero-delay timer.
                while (!this.reason) {
                    const due = [...this.deadlines].sort((a, b) => a[1].at - b[1].at)[0];
                    if (!due || due[1].at > Math.max(this.now(), next.at)) break;
                    this.deadlines.delete(due[0]);
                    due[1].run();
                }
            } finally { this.firing = false; this.arm(); }
        }, Math.max(0, next.at - this.now()));
    }
}

export interface RelayQueryState { eoseReceived: boolean; verificationDrained: boolean; finished: boolean; failed?: boolean }

/** EOSE and verification drainage are separate evidence. Failures never lower the denominator. */
export function createRelayQueryCompletion(operation: RelayOperation, states: readonly RelayQueryState[], quorum: boolean, finish = (reason: RelayEnd) => operation.finish(reason)): () => void {
    let scheduled = false;
    let graceStarted = false;
    const grace = {};
    return () => {
        if (operation.reason || scheduled) return;
        scheduled = true;
        queueMicrotask(() => {
            scheduled = false;
            if (operation.reason) return;
            if (states.every(state => state.finished)) { finish(states.every(state => state.failed) ? "error" : "complete"); return; }
            if (quorum && !graceStarted && states.filter(state => state.eoseReceived && state.verificationDrained).length >= Math.ceil(states.length * 0.6)) {
                graceStarted = true;
                operation.schedule(grace, operation.now() + RELAY_QUERY_GRACE_MS, () => finish("quorum"));
            }
        });
    };
}
