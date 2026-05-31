export interface ThreadGraphRevalidateDecisionOptions {
    lastFetchedAt: number | null;
    ttlMs: number;
    now?: number;
}

export interface ThreadGraphCachedRevalidateDecisionOptions {
    displayedCached: boolean;
    force: boolean;
    lastFetchedAt: number | null;
    ttlMs: number;
    prefetchOnly?: boolean;
    now?: number;
}

export interface ThreadGraphCachedRevalidateDecision {
    skipRevalidate: boolean;
    shouldShowInitialLoading: boolean;
    shouldPrefetchReplyCountsOnSkip: boolean;
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

export function shouldSkipRevalidateAfterDisplayingCache(
    options: ThreadGraphCachedRevalidateDecisionOptions,
): boolean {
    if (!options.displayedCached || options.force) {
        return false;
    }

    return !isThreadGraphRevalidateStale({
        lastFetchedAt: options.lastFetchedAt,
        ttlMs: options.ttlMs,
        now: options.now,
    });
}

export function decideThreadGraphCachedRevalidate(
    options: ThreadGraphCachedRevalidateDecisionOptions,
): ThreadGraphCachedRevalidateDecision {
    const skipRevalidate = shouldSkipRevalidateAfterDisplayingCache(options);
    return {
        skipRevalidate,
        shouldShowInitialLoading: !options.displayedCached,
        shouldPrefetchReplyCountsOnSkip: skipRevalidate && !options.prefetchOnly,
    };
}
