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
        const sharedItem = shareValue(previous[index], nextItem);
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
        const sharedValue = shareValue(previous[key], next[key]);
        shared[key] = sharedValue;
        equal &&= sharedValue === previous[key] && Object.hasOwn(previous, key);
        replaced ||= sharedValue !== next[key];
    }

    if (equal) {
        return previous;
    }
    return replaced ? shared : next;
}

function shareValue(previous: unknown, next: unknown): unknown {
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
 * Keeps object identity stable across recomputations of derived plain data.
 * Returns `previous` when `next` holds the same data, otherwise `next` with every
 * unchanged sub-tree taken from `previous`. Plain objects and arrays are compared
 * structurally; any other value (class instances, functions, events held by
 * reference) is compared by identity. Neither argument is mutated.
 */
export function shareStructure<T>(previous: T | undefined, next: T): T {
    return previous === undefined ? next : shareValue(previous, next) as T;
}
