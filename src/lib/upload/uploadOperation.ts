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

/** Stops waiting for an operation-local external Promise without cancelling its owner. */
export function awaitUploadOperation<T>(
    operation: PromiseLike<T>,
    signal?: AbortSignal,
): Promise<T> {
    throwIfUploadAborted(signal);
    if (!signal) return Promise.resolve(operation);

    return new Promise<T>((resolve, reject) => {
        let settled = false;
        const cleanup = () => signal.removeEventListener("abort", onAbort);
        const onAbort = () => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(createUploadAbortError());
        };
        const finish = (complete: () => void) => {
            if (settled) return;
            if (signal.aborted) {
                onAbort();
                return;
            }
            settled = true;
            cleanup();
            complete();
        };

        signal.addEventListener("abort", onAbort, { once: true });
        if (signal.aborted) {
            onAbort();
            return;
        }

        Promise.resolve(operation).then(
            (value) => finish(() => resolve(value)),
            (error: unknown) => finish(() => reject(error)),
        );
    });
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
