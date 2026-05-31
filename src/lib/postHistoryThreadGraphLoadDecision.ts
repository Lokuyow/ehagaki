export interface ThreadGraphRevalidateDecisionOptions {
    lastFetchedAt: number | null;
    ttlMs: number;
    now?: number;
}

export function isThreadGraphRevalidateStale(
    options: ThreadGraphRevalidateDecisionOptions,
): boolean {
    if (typeof options.lastFetchedAt !== "number") {
        return true;
    }

    const currentNow = options.now ?? Date.now();
    return currentNow - options.lastFetchedAt >= options.ttlMs;
}

export function shouldSkipRevalidateAfterDisplayingCache(options: {
    displayedCached: boolean;
    force: boolean;
    lastFetchedAt: number | null;
    ttlMs: number;
    now?: number;
}): boolean {
    if (!options.displayedCached || options.force) {
        return false;
    }

    return !isThreadGraphRevalidateStale({
        lastFetchedAt: options.lastFetchedAt,
        ttlMs: options.ttlMs,
        now: options.now,
    });
}
