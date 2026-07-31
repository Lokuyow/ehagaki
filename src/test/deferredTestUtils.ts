export interface Deferred<T> {
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
}

export function createDeferred<T>(): Deferred<T> {
    let resolve!: (value?: T | PromiseLike<T>) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((resolvePromise, rejectPromise) => {
        resolve = (value?: T | PromiseLike<T>) => {
            resolvePromise(value as T | PromiseLike<T>);
        };
        reject = rejectPromise;
    });

    return { promise, resolve, reject };
}
