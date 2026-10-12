/** Best-effort screen wake lock shared by long-running post-history UI operations. */
export function createPostHistoryOperationWakeLock() {
    let leaseCount = 0;
    let generation = 0;
    let requestPending = false;
    let activeDocument: Document | null = null;
    let sentinel: WakeLockSentinel | null = null;
    let removeReleaseListener: (() => void) | null = null;

    async function release(lock: WakeLockSentinel): Promise<void> {
        if (lock.released) return;
        try { await lock.release(); } catch { /* Wake lock failures never affect the operation. */ }
    }

    function clearSentinel(): WakeLockSentinel | null {
        const lock = sentinel;
        sentinel = null;
        removeReleaseListener?.();
        removeReleaseListener = null;
        return lock;
    }

    function releaseSentinel(): void {
        const lock = clearSentinel();
        if (lock) void release(lock);
    }

    async function request(): Promise<void> {
        if (leaseCount === 0 || activeDocument?.visibilityState !== "visible" || requestPending) return;
        if (sentinel && !sentinel.released) return;
        clearSentinel();
        requestPending = true;
        const requestedGeneration = generation;
        try {
            if (typeof navigator === "undefined" || typeof navigator.wakeLock?.request !== "function") return;
            const lock = await navigator.wakeLock.request("screen");
            // A cancelled operation or hidden document must not retain a late request.
            if (requestedGeneration !== generation || leaseCount === 0
                || activeDocument?.visibilityState !== "visible" || lock.released) {
                await release(lock);
                return;
            }
            sentinel = lock;
            const onRelease = () => {
                if (sentinel === lock) clearSentinel();
                // Do not retry automatically here: the UA may be conserving battery.
            };
            lock.addEventListener("release", onRelease);
            removeReleaseListener = () => lock.removeEventListener("release", onRelease);
        } catch { /* Unsupported, denied or unavailable wake locks are best-effort. */ }
        finally {
            requestPending = false;
            // A new lease or visibility cycle may have arrived while the old request was pending.
            if (requestedGeneration !== generation) void request();
        }
    }

    function onVisibilityChange(): void {
        if (activeDocument?.visibilityState === "visible") {
            void request();
        } else {
            generation += 1;
            releaseSentinel();
        }
    }

    return {
        acquire(): () => void {
            if (leaseCount++ === 0) {
                activeDocument = typeof document === "undefined" ? null : document;
                activeDocument?.addEventListener("visibilitychange", onVisibilityChange);
            }
            void request();
            let ended = false;
            return () => {
                if (ended) return;
                ended = true;
                if (--leaseCount > 0) return;
                generation += 1;
                activeDocument?.removeEventListener("visibilitychange", onVisibilityChange);
                activeDocument = null;
                releaseSentinel();
            };
        },
    };
}

export const postHistoryOperationWakeLock = createPostHistoryOperationWakeLock();
