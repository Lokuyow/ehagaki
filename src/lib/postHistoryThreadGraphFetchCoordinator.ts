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

export interface ThreadGraphRevalidateTemplateContext {
    ensureActive: () => boolean;
}

export interface ThreadGraphRevalidateTemplateOptions {
    isActive: () => boolean;
    run: (context: ThreadGraphRevalidateTemplateContext) => Promise<void>;
    onInactive?: () => void;
    onError?: (error: unknown) => void | Promise<void>;
    cleanup?: () => void;
}

export interface ThreadGraphBatchLifecycleContext {
    ensureActive: () => boolean;
}

export interface ThreadGraphBatchLifecycleOptions<TItem, TToken = undefined> {
    items: readonly TItem[];
    isActive: () => boolean;
    run: (context: ThreadGraphBatchLifecycleContext) => Promise<void>;
    prepareItem?: (item: TItem) => TToken;
    completeBatch?: (loaded: boolean) => void;
    cleanupItem?: (item: TItem, token: TToken) => void;
    onInactive?: () => void;
    onError?: (error: unknown) => void | Promise<void>;
    cleanup?: () => void;
}

export interface ThreadGraphNodeLoadExecutionOptions {
    loading: boolean;
    revalidating: boolean;
    onInFlight: () => void;
    onLoadingInFlight?: () => void;
    shouldHandleLoadedState: boolean;
    handleLoadedState: () => Promise<boolean>;
    prepareFreshLoadState: () => void;
    displayCachedForFreshLoad: () => Promise<{ displayedCached: boolean; lastFetchedAt: number | null }>;
    force: boolean;
    ttlMs: number;
    prefetchOnly?: boolean;
    now?: number;
    awaitWhenInitialLoading: boolean;
    onSkipPrefetchReplyCounts?: () => void;
    runRevalidate: (input: { showInitialLoading: boolean }) => Promise<void>;
}

export interface ThreadGraphStatusStrategyOptions<TStatus extends string> {
    status: TStatus;
    strategies: Partial<Record<TStatus, () => void | Promise<void>>>;
    fallback?: () => void | Promise<void>;
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

export async function coordinateThreadGraphRevalidateTemplate(
    options: ThreadGraphRevalidateTemplateOptions,
): Promise<void> {
    let inactiveNotified = false;
    const ensureActive = (): boolean => {
        const active = options.isActive();
        if (!active && !inactiveNotified) {
            inactiveNotified = true;
            options.onInactive?.();
        }
        return active;
    };

    try {
        await options.run({ ensureActive });
    } catch (error) {
        if (ensureActive()) {
            await options.onError?.(error);
        }
    } finally {
        options.cleanup?.();
    }
}

export async function coordinateThreadGraphBatchLifecycle<TItem, TToken = undefined>(
    options: ThreadGraphBatchLifecycleOptions<TItem, TToken>,
): Promise<void> {
    let inactiveNotified = false;
    const ensureActive = (): boolean => {
        const active = options.isActive();
        if (!active && !inactiveNotified) {
            inactiveNotified = true;
            options.onInactive?.();
        }
        return active;
    };

    const itemTokens = new Map<TItem, TToken>();
    if (options.prepareItem) {
        for (const item of options.items) {
            itemTokens.set(item, options.prepareItem(item));
        }
    }

    try {
        await options.run({ ensureActive });
        if (ensureActive()) {
            options.completeBatch?.(true);
        }
    } catch (error) {
        if (ensureActive()) {
            options.completeBatch?.(false);
            await options.onError?.(error);
        }
    } finally {
        if (options.cleanupItem) {
            for (const item of options.items) {
                if (itemTokens.has(item)) {
                    options.cleanupItem(item, itemTokens.get(item) as TToken);
                }
            }
        }
        options.cleanup?.();
    }
}

export async function coordinateThreadGraphStatusStrategy<TStatus extends string>(
    options: ThreadGraphStatusStrategyOptions<TStatus>,
): Promise<void> {
    const strategy = options.strategies[options.status] ?? options.fallback;
    if (!strategy) {
        return;
    }

    await strategy();
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

export async function coordinateThreadGraphNodeLoadExecution(
    options: ThreadGraphNodeLoadExecutionOptions,
): Promise<void> {
    if (handleThreadGraphInFlightLoad({
        loading: options.loading,
        revalidating: options.revalidating,
        onInFlight: options.onInFlight,
        onLoadingInFlight: options.onLoadingInFlight,
    })) {
        return;
    }

    if (options.shouldHandleLoadedState) {
        const handledLoadedState = await options.handleLoadedState();
        if (handledLoadedState) {
            return;
        }
    }

    options.prepareFreshLoadState();
    const cached = await options.displayCachedForFreshLoad();
    await coordinateThreadGraphCachedRevalidateFlow({
        displayedCached: cached.displayedCached,
        force: options.force,
        lastFetchedAt: cached.lastFetchedAt,
        ttlMs: options.ttlMs,
        prefetchOnly: options.prefetchOnly,
        now: options.now,
        awaitWhenInitialLoading: options.awaitWhenInitialLoading,
        onSkipPrefetchReplyCounts: options.onSkipPrefetchReplyCounts,
        runRevalidate: options.runRevalidate,
    });
}
