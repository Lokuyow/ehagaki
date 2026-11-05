// Runtime policy is configured by the app hook; transport services remain UI independent.
let enabled = true;
const listeners = new Set<() => void>();
export function notificationsEnabled(): boolean { return enabled; }
export function configureNotifications(value: boolean): void {
    if (enabled === value) return;
    enabled = value;
    for (const listener of [...listeners]) listener();
}
export function subscribeNotificationMode(listener: () => void): () => void {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

/** Keep a history consumer alive while replacing its transport with the new filter. */
export function followNotificationMode<T, Task extends { promise: Promise<T>; cancel(): void }>(start: (enabled: boolean) => Task): Task {
    let current = start(enabled), revision = 0, active = true;
    const unsubscribe = subscribeNotificationMode(() => { revision++; current.cancel(); });
    const promise = (async () => {
        try {
            while (true) {
                const epoch = revision;
                try {
                    const result = await current.promise;
                    if (!active || epoch === revision) return result;
                } catch (error) { if (!active || epoch === revision) throw error; }
                current = start(enabled);
            }
        } finally { unsubscribe(); }
    })();
    const result = { ...current, promise, cancel: () => { active = false; unsubscribe(); current.cancel(); } } as Task;
    if ('joinedExisting' in current) Object.defineProperty(result, 'joinedExisting', { get: () => (current as Task & { joinedExisting: boolean }).joinedExisting });
    return result;
}
