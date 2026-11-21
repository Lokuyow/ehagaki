import { observeListEdge } from "./listEdgeObserver";

export type PostHistoryAutoLoadDirection = "older" | "newer";

const PREFETCH_VIEWPORTS = 2;
const OLDER_SCROLL_PREFETCH_VIEWPORTS = 5;

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

/** Apply history's window, resize, and loading rules to the shared edge observer. */
export function observePostHistoryAutoLoadSentinel(
    options: ObservePostHistoryAutoLoadSentinelOptions,
): PostHistoryAutoLoadSentinelObservation {
    const { direction, root, sentinel, rootHeight, resizeGeneration, previousContext } = options;
    const previousScrollTop = previousContext?.scrollTop;
    const suppressInitialIntersectionForResize =
        previousContext?.root === root
        && previousContext.sentinel === sentinel
        && previousContext.resizeGeneration !== resizeGeneration;
    let isObserverActive = true;
    let awaitingResizeApproach = false;
    let hasPendingApproach = false;
    const initialScrollTop = root.scrollTop;

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

    const isScrolledBackSinceResize = () => typeof previousScrollTop === "number"
        && (direction === "older"
            ? root.scrollTop <= previousScrollTop
            : root.scrollTop >= previousScrollTop);

    const observation = observeListEdge({
        root,
        sentinel,
        edge: direction === "older" ? "bottom" : "top",
        prefetchDistance: rootHeight * PREFETCH_VIEWPORTS,
        // Only downward scrolling gets the longer lead.
        scrollPrefetchDistance: rootHeight * (direction === "older" ? OLDER_SCROLL_PREFETCH_VIEWPORTS : PREFETCH_VIEWPORTS),
        onLeaveRegion: recordExit,
        onScrollApproach: () => {
            awaitingResizeApproach = false;
            options.setSentinelIntersecting(true);
            requestApproach();
        },
        onIntersection: (intersecting, initial) => {
            if (!intersecting) {
                recordExit();
                return;
            }
            options.setSentinelIntersecting(true);
            awaitingResizeApproach = initial && suppressInitialIntersectionForResize && isScrolledBackSinceResize();
            requestApproach();
        },
    });

    const context: PostHistoryAutoLoadSentinelObserverContext = {
        root,
        sentinel,
        resizeGeneration,
        scrollTop: initialScrollTop,
        reconcileAfterCommit: () => {
            if (!isObserverActive) {
                return;
            }
            // Observe the exit before a fast scroll can return to the new
            // edge between IntersectionObserver notifications.
            observation.syncScrollPosition();
            if (!observation.isInRegion()) {
                recordExit();
            }
        },
        resumeAfterLoad: () => {
            if (!isObserverActive || !hasPendingApproach) {
                return;
            }
            hasPendingApproach = false;
            if (!observation.isInRegion()) {
                recordExit();
                return;
            }
            requestApproach();
        },
        reconcileAfterWindowChange: () => {
            if (!isObserverActive || !observation.hasReceivedEntry() || awaitingResizeApproach) {
                return;
            }
            if (!observation.isInRegion()) {
                recordExit();
                return;
            }
            options.setSentinelIntersecting(true);
            requestApproach();
        },
    };

    return {
        context,
        dispose: () => {
            isObserverActive = false;
            awaitingResizeApproach = false;
            hasPendingApproach = false;
            observation.dispose();
        },
    };
}
