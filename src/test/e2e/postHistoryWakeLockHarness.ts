import type { Page } from "@playwright/test";

export interface PostHistoryWakeLockProbe {
    requests: number;
    releases: number;
    held: number;
    visibility: DocumentVisibilityState;
    setVisibility: (state: DocumentVisibilityState) => void;
}

export async function installPostHistoryWakeLockProbe(page: Page): Promise<void> {
    await page.addInitScript(() => {
        const locks = new Set<ProbeSentinel>();
        const state = { requests: 0, releases: 0, held: 0, visibility: "visible" as DocumentVisibilityState,
            setVisibility: (visibility: DocumentVisibilityState) => {
                state.visibility = visibility;
                if (visibility === "hidden") for (const lock of locks) void lock.release();
                document.dispatchEvent(new Event("visibilitychange"));
            } };
        class ProbeSentinel extends EventTarget {
            released = false;
            async release() {
                if (this.released) return;
                this.released = true; locks.delete(this); state.releases++; state.held--;
                this.dispatchEvent(new Event("release"));
            }
        }
        Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state.visibility });
        Object.defineProperty(navigator, "wakeLock", { configurable: true, value: {
            request: async (type: string) => {
                if (type !== "screen" || state.visibility !== "visible") throw new Error("invalid wake lock request");
                state.requests++; state.held++;
                const lock = new ProbeSentinel(); locks.add(lock); return lock;
            },
        } });
        Reflect.set(window, "__POST_HISTORY_WAKE_LOCK__", state);
    });
}

export function readPostHistoryWakeLockProbe(page: Page) {
    return page.evaluate(() => {
        const { requests, releases, held } = Reflect.get(window, "__POST_HISTORY_WAKE_LOCK__") as PostHistoryWakeLockProbe;
        return { requests, releases, held };
    });
}
