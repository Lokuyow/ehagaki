/**
 * Watches one post history auto-load sentinel (the older tail or the newer
 * head) with an IntersectionObserver plus a scroll listener, and asks the
 * owner to load the next chunk when the sentinel approaches the viewport.
 *
 * The owner keeps the loading flags; this module only keeps the per-observer
 * state (initial entry, resize suppression, pending approach, last scrollTop).
 */
export type PostHistoryAutoLoadDirection = "older" | "newer";

export interface PostHistoryAutoLoadSentinelObserverContext {
    root: HTMLElement;
    sentinel: HTMLElement;
    resizeGeneration: number;
    scrollTop: number;
    /** Re-check the sentinel after a viewport commit moved the window. */
    reconcileAfterCommit: () => void;
    /** Retry an approach that arrived while a load was running. */
    resumeAfterLoad: () => void;
    /**
     * Request the next chunk when the window was replaced while the sentinel
     * stayed in the prefetch region (no intersection change follows).
     */
    reconcileAfterWindowChange: () => void;
}

export interface ObservePostHistoryAutoLoadSentinelOptions {
    direction: PostHistoryAutoLoadDirection;
    root: HTMLElement;
    sentinel: HTMLElement;
    rootHeight: number;
    resizeGeneration: number;
    /** The context of the observer this one replaces, if any. */
    previousContext: PostHistoryAutoLoadSentinelObserverContext | null;
    isAutoLoading(): boolean;
    isAwaitingExit(): boolean;
    clearAwaitingExit(): void;
    setSentinelIntersecting(isIntersecting: boolean): void;
    canAutoLoad(): boolean;
    load(): void;
}

export interface PostHistoryAutoLoadSentinelObservation {
    context: PostHistoryAutoLoadSentinelObserverContext;
    dispose(): void;
}

export function isPostHistoryAutoLoadSentinelInPrefetchRegion(input: {
    direction: PostHistoryAutoLoadDirection;
    rootRect: Pick<DOMRect, "left" | "right" | "top" | "bottom">;
    sentinelRect: Pick<DOMRect, "left" | "right" | "top" | "bottom">;
    rootHeight: number;
}): boolean {
    const { rootRect, sentinelRect, rootHeight } = input;
    const overlapsHorizontally = sentinelRect.left < rootRect.right
        && sentinelRect.right > rootRect.left;
    if (input.direction === "older") {
        return overlapsHorizontally
            && sentinelRect.top <= rootRect.bottom + rootHeight * 2
            && sentinelRect.bottom >= rootRect.top;
    }
    return overlapsHorizontally
        && sentinelRect.bottom >= rootRect.top - rootHeight * 2
        && sentinelRect.top <= rootRect.bottom;
}

export function buildPostHistoryAutoLoadRootMargin(
    direction: PostHistoryAutoLoadDirection,
    rootHeight: number,
): string {
    return direction === "older"
        ? `0px 0px ${rootHeight * 2}px 0px`
        : `${rootHeight * 2}px 0px 0px 0px`;
}

export function observePostHistoryAutoLoadSentinel(
    options: ObservePostHistoryAutoLoadSentinelOptions,
): PostHistoryAutoLoadSentinelObservation {
    const { direction, root, sentinel, rootHeight, resizeGeneration, previousContext } = options;
    const previousScrollTop = previousContext?.scrollTop;
    const suppressInitialIntersectionForResize =
        previousContext?.root === root
        && previousContext.sentinel === sentinel
        && previousContext.resizeGeneration !== resizeGeneration;
    let receivedInitialEntry = false;
    let isObserverActive = true;
    let awaitingResizeApproach = false;
    let hasPendingApproach = false;
    let lastScrollTop = root.scrollTop;

    const isSentinelInPrefetchRegion = () => isPostHistoryAutoLoadSentinelInPrefetchRegion({
        direction,
        rootRect: root.getBoundingClientRect(),
        sentinelRect: sentinel.getBoundingClientRect(),
        rootHeight,
    });

    const recordExit = () => {
        options.setSentinelIntersecting(false);
        options.clearAwaitingExit();
        awaitingResizeApproach = false;
        hasPendingApproach = false;
    };

    const requestApproach = () => {
        if (!isObserverActive || awaitingResizeApproach) {
            return;
        }
        // The two directions check "awaiting exit" at different points: an
        // older approach is remembered while a load runs even if it still
        // awaits exit, a newer one is not.
        if (direction === "newer" && options.isAwaitingExit()) {
            return;
        }
        if (!options.canAutoLoad()) {
            return;
        }
        if (options.isAutoLoading()) {
            hasPendingApproach = true;
            return;
        }
        if (direction === "older" && options.isAwaitingExit()) {
            return;
        }
        hasPendingApproach = false;
        options.load();
    };

    const movedTowardTarget = (scrollTop: number) => direction === "older"
        ? scrollTop > lastScrollTop
        : scrollTop < lastScrollTop;

    const context: PostHistoryAutoLoadSentinelObserverContext = {
        root,
        sentinel,
        resizeGeneration,
        scrollTop: root.scrollTop,
        reconcileAfterCommit: () => {
            if (!isObserverActive) {
                return;
            }
            // Observe the exit before a fast scroll can return to the new
            // edge between IntersectionObserver notifications.
            lastScrollTop = root.scrollTop;
            if (!isSentinelInPrefetchRegion()) {
                recordExit();
            }
        },
        resumeAfterLoad: () => {
            if (!isObserverActive || !hasPendingApproach) {
                return;
            }
            hasPendingApproach = false;
            if (!isSentinelInPrefetchRegion()) {
                recordExit();
                return;
            }
            requestApproach();
        },
        reconcileAfterWindowChange: () => {
            if (!isObserverActive || !receivedInitialEntry || awaitingResizeApproach) {
                return;
            }
            if (!isSentinelInPrefetchRegion()) {
                recordExit();
                return;
            }
            options.setSentinelIntersecting(true);
            requestApproach();
        },
    };

    const handleScrollApproach = () => {
        if (!isObserverActive) {
            return;
        }

        const scrollTop = root.scrollTop;
        const movedToward = movedTowardTarget(scrollTop);
        lastScrollTop = scrollTop;

        if (!isSentinelInPrefetchRegion()) {
            recordExit();
            return;
        }
        if (!movedToward) {
            return;
        }

        awaitingResizeApproach = false;
        options.setSentinelIntersecting(true);
        requestApproach();
    };

    const isScrolledBackSinceResize = () => typeof previousScrollTop === "number"
        && (direction === "older"
            ? root.scrollTop <= previousScrollTop
            : root.scrollTop >= previousScrollTop);

    const observer = new IntersectionObserver(
        (entries) => {
            if (!isObserverActive) {
                return;
            }

            const currentEntries = entries.filter((entry) => entry.target === sentinel);
            for (const [index, entry] of currentEntries.entries()) {
                const isInitialEntry = !receivedInitialEntry;
                receivedInitialEntry = true;
                const rootRect = root.getBoundingClientRect();
                const isCurrentlyInPrefetchRegion = rootRect.width > 0 && rootRect.height > 0
                    ? isSentinelInPrefetchRegion()
                    : entry.isIntersecting;
                const hasLaterIntersection = currentEntries.slice(index + 1)
                    .some((laterEntry) => laterEntry.isIntersecting);

                // Ignore a queued exit if the sentinel has already returned,
                // while preserving a real exit/re-entry pair delivered
                // together in one callback.
                if (!entry.isIntersecting && isCurrentlyInPrefetchRegion && !hasLaterIntersection) {
                    continue;
                }
                if (entry.isIntersecting && !isCurrentlyInPrefetchRegion) {
                    continue;
                }
                options.setSentinelIntersecting(entry.isIntersecting);

                if (!entry.isIntersecting) {
                    recordExit();
                    continue;
                }

                if (
                    isInitialEntry
                    && suppressInitialIntersectionForResize
                    && isScrolledBackSinceResize()
                ) {
                    awaitingResizeApproach = true;
                    continue;
                }

                awaitingResizeApproach = false;
                requestApproach();
            }
        },
        {
            root,
            rootMargin: buildPostHistoryAutoLoadRootMargin(direction, rootHeight),
            threshold: 0,
        },
    );
    if (!isSentinelInPrefetchRegion()) {
        recordExit();
    }
    observer.observe(sentinel);
    root.addEventListener("scroll", handleScrollApproach, { passive: true });

    return {
        context,
        dispose: () => {
            isObserverActive = false;
            awaitingResizeApproach = false;
            hasPendingApproach = false;
            root.removeEventListener("scroll", handleScrollApproach);
            observer.disconnect();
        },
    };
}
