import {
    decideThreadGraphCachedRevalidate,
    isThreadGraphRevalidateStale,
    type ThreadGraphCachedRevalidateDecision,
    type ThreadGraphCachedRevalidateDecisionOptions,
} from "./postHistoryThreadGraphLoadDecision";

export interface ThreadGraphInFlightLoadOptions {
    loading: boolean;
    revalidating: boolean;
    onInFlight: () => void;
    onLoadingInFlight?: () => void;
}

export interface ThreadGraphLoadedStateRevalidateOptions {
    hasVisibleData: boolean;
    lastFetchedAt: number | null;
    ttlMs: number;
    now?: number;
}

export interface ThreadGraphRevalidateExecutionOptions {
    skipRevalidate: boolean;
    shouldShowInitialLoading: boolean;
    awaitWhenInitialLoading: boolean;
    runRevalidate: (input: { showInitialLoading: boolean }) => Promise<void>;
}

export interface ThreadGraphCachedRevalidateFlowOptions
    extends ThreadGraphCachedRevalidateDecisionOptions {
    awaitWhenInitialLoading: boolean;
    onSkipPrefetchReplyCounts?: () => void;
    runRevalidate: (input: { showInitialLoading: boolean }) => Promise<void>;
}

export function handleThreadGraphInFlightLoad(options: ThreadGraphInFlightLoadOptions): boolean {
    if (!options.loading && !options.revalidating) {
        return false;
    }

    options.onInFlight();
    if (options.loading) {
        options.onLoadingInFlight?.();
    }

    return true;
}

export function shouldRunThreadGraphBackgroundRevalidate(
    options: ThreadGraphLoadedStateRevalidateOptions,
): boolean {
    if (!options.hasVisibleData) {
        return false;
    }

    return isThreadGraphRevalidateStale({
        lastFetchedAt: options.lastFetchedAt,
        ttlMs: options.ttlMs,
        now: options.now,
    });
}

export async function coordinateThreadGraphRevalidateExecution(
    options: ThreadGraphRevalidateExecutionOptions,
): Promise<void> {
    if (options.skipRevalidate) {
        return;
    }

    const revalidatePromise = options.runRevalidate({
        showInitialLoading: options.shouldShowInitialLoading,
    });
    if (options.awaitWhenInitialLoading && options.shouldShowInitialLoading) {
        await revalidatePromise;
    }
}

export async function coordinateThreadGraphCachedRevalidateFlow(
    options: ThreadGraphCachedRevalidateFlowOptions,
): Promise<ThreadGraphCachedRevalidateDecision> {
    const decision = decideThreadGraphCachedRevalidate(options);
    if (decision.shouldPrefetchReplyCountsOnSkip) {
        options.onSkipPrefetchReplyCounts?.();
    }

    await coordinateThreadGraphRevalidateExecution({
        skipRevalidate: decision.skipRevalidate,
        shouldShowInitialLoading: decision.shouldShowInitialLoading,
        awaitWhenInitialLoading: options.awaitWhenInitialLoading,
        runRevalidate: options.runRevalidate,
    });

    return decision;
}
