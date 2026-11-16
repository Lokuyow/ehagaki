function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}

function shareArray(previous: unknown[], next: unknown[]): unknown[] {
    let equal = previous.length === next.length;
    let replaced = false;
    const shared = next.map((nextItem, index) => {
        const sharedItem = shareStructure(previous[index], nextItem);
        equal &&= sharedItem === previous[index];
        replaced ||= sharedItem !== nextItem;
        return sharedItem;
    });

    if (equal) {
        return previous;
    }
    return replaced ? shared : next;
}

function shareObject(
    previous: Record<string, unknown>,
    next: Record<string, unknown>,
): Record<string, unknown> {
    const nextKeys = Object.keys(next);
    let equal = Object.keys(previous).length === nextKeys.length;
    let replaced = false;
    const shared: Record<string, unknown> = {};
    for (const key of nextKeys) {
        const sharedValue = shareStructure(previous[key], next[key]);
        shared[key] = sharedValue;
        equal &&= sharedValue === previous[key] && Object.hasOwn(previous, key);
        replaced ||= sharedValue !== next[key];
    }

    if (equal) {
        return previous;
    }
    return replaced ? shared : next;
}

function shareStructure(previous: unknown, next: unknown): unknown {
    if (Object.is(previous, next)) {
        return previous;
    }
    if (Array.isArray(previous) && Array.isArray(next)) {
        return shareArray(previous, next);
    }
    if (isPlainObject(previous) && isPlainObject(next)) {
        return shareObject(previous, next);
    }
    return next;
}

/**
 * Keeps object identity stable across recomputations of a thread graph state.
 * Returns `previous` when `next` holds the same data, otherwise `next` with every
 * unchanged sub-tree taken from `previous`. Neither argument is mutated.
 */
export function sharePostHistoryThreadGraphState<T>(previous: T | undefined, next: T): T {
    return previous === undefined ? next : shareStructure(previous, next) as T;
}
