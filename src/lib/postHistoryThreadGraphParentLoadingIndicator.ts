type TimerHandle = ReturnType<typeof setTimeout>;

interface PostHistoryThreadGraphParentLoadingIndicatorDeps {
    setTimeoutFn?: (callback: () => void, delayMs: number) => TimerHandle;
    clearTimeoutFn?: (handle: TimerHandle) => void;
}

export interface PostHistoryThreadGraphParentLoadingIndicator {
    schedule(key: string, callback: () => void, delayMs?: number): void;
    clear(key: string): void;
    clearAll(): void;
}

export function createPostHistoryThreadGraphParentLoadingIndicator(
    deps: PostHistoryThreadGraphParentLoadingIndicatorDeps = {},
): PostHistoryThreadGraphParentLoadingIndicator {
    const setTimeoutFn = deps.setTimeoutFn ?? ((callback, delayMs) => setTimeout(callback, delayMs));
    const clearTimeoutFn = deps.clearTimeoutFn ?? ((handle) => clearTimeout(handle));
    const timersByKey = new Map<string, TimerHandle>();

    function clear(key: string): void {
        const timer = timersByKey.get(key);
        if (!timer) {
            return;
        }

        clearTimeoutFn(timer);
        timersByKey.delete(key);
    }

    return {
        schedule(key: string, callback: () => void, delayMs = 400): void {
            clear(key);

            const timer = setTimeoutFn(() => {
                timersByKey.delete(key);
                callback();
            }, delayMs);
            timersByKey.set(key, timer);
        },

        clear,

        clearAll(): void {
            timersByKey.forEach((timer) => clearTimeoutFn(timer));
            timersByKey.clear();
        },
    };
}
