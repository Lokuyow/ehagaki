export function createUploadAbortError(): Error {
    if (typeof DOMException !== "undefined") {
        return new DOMException("The operation was aborted.", "AbortError");
    }
    const error = new Error("The operation was aborted.");
    error.name = "AbortError";
    return error;
}

export function throwIfUploadAborted(signal?: AbortSignal): void {
    if (signal?.aborted) throw createUploadAbortError();
}

export function waitForUploadDelay(milliseconds: number, signal?: AbortSignal): Promise<void> {
    throwIfUploadAborted(signal);
    if (!signal) return new Promise((resolve) => setTimeout(resolve, milliseconds));

    return new Promise((resolve, reject) => {
        const finish = () => {
            signal.removeEventListener("abort", onAbort);
            resolve();
        };
        const timer = setTimeout(finish, milliseconds);
        const onAbort = () => {
            clearTimeout(timer);
            signal.removeEventListener("abort", onAbort);
            reject(createUploadAbortError());
        };
        signal.addEventListener("abort", onAbort, { once: true });
        if (signal.aborted) onAbort();
    });
}
