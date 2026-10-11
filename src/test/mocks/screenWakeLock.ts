import { vi } from "vitest";

export class TestWakeLockSentinel extends EventTarget implements WakeLockSentinel {
    readonly type = "screen";
    released = false;
    onrelease: WakeLockSentinel["onrelease"] = null;
    autoRelease(): void {
        this.released = true;
        this.dispatchEvent(new Event("release"));
    }
    release = vi.fn(async () => { this.autoRelease(); });
}

export function installScreenWakeLockMock() {
    const original = Object.getOwnPropertyDescriptor(navigator, "wakeLock");
    const request = vi.fn<WakeLock["request"]>().mockImplementation(async () => new TestWakeLockSentinel());
    const set = (wakeLock: Pick<WakeLock, "request"> | undefined) => {
        Object.defineProperty(navigator, "wakeLock", { configurable: true, value: wakeLock });
    };
    set({ request });
    return { request, set, restore: () => {
        if (original) Object.defineProperty(navigator, "wakeLock", original);
        else Reflect.deleteProperty(navigator, "wakeLock");
    } };
}

export function deferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (reason: unknown) => void;
    const promise = new Promise<T>((resolveFn, rejectFn) => { resolve = resolveFn; reject = rejectFn; });
    return { promise, resolve, reject };
}
