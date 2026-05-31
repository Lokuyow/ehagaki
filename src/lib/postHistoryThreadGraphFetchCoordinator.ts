import { isThreadGraphRevalidateStale } from "./postHistoryThreadGraphLoadDecision";

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
