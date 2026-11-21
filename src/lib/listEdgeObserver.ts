type Edge = "top" | "bottom";
type Rect = Pick<DOMRect, "left" | "right" | "top" | "bottom">;

export function isListEdgeInPrefetchRegion(
    edge: Edge, root: Rect, sentinel: Rect, distance: number,
): boolean {
    if (sentinel.left >= root.right || sentinel.right <= root.left) return false;
    return edge === "bottom"
        ? sentinel.top <= root.bottom + distance && sentinel.bottom >= root.top
        : sentinel.bottom >= root.top - distance && sentinel.top <= root.bottom;
}

function listEdgeRootMargin(edge: Edge, distance: number): string {
    return edge === "bottom" ? `0px 0px ${distance}px 0px` : `${distance}px 0px 0px 0px`;
}

interface ListEdgeObserverOptions {
    root: HTMLElement;
    sentinel: HTMLElement;
    edge: Edge;
    prefetchDistance: number;
    scrollPrefetchDistance?: number;
    onIntersection: (intersects: boolean, initial: boolean) => void;
    onScrollApproach: () => void;
    onLeaveRegion?: () => void;
}

export function observeListEdge({
    root, sentinel, edge, prefetchDistance, scrollPrefetchDistance = prefetchDistance,
    onIntersection, onScrollApproach, onLeaveRegion,
}: ListEdgeObserverOptions) {
    let active = true;
    let receivedEntry = false;
    let lastScrollTop = root.scrollTop;

    const isInRegion = (distance = prefetchDistance, rootRect = root.getBoundingClientRect()) =>
        isListEdgeInPrefetchRegion(edge, rootRect, sentinel.getBoundingClientRect(), distance);

    const observer = new IntersectionObserver(entries => {
        if (!active) return;
        const current = entries.filter(entry => entry.target === sentinel);
        for (const [index, entry] of current.entries()) {
            if (!active) return;
            const initial = !receivedEntry;
            receivedEntry = true;
            const rootRect = root.getBoundingClientRect();
            const inRegion = rootRect.width > 0 && rootRect.height > 0
                ? isInRegion(prefetchDistance, rootRect)
                : entry.isIntersecting;
            // Keep a real exit/re-entry pair, but ignore a stale queued entry on its own.
            if (!entry.isIntersecting && inRegion && !current.slice(index + 1).some(next => next.isIntersecting)) continue;
            if (entry.isIntersecting && !inRegion) continue;
            onIntersection(entry.isIntersecting, initial);
        }
    }, { root, rootMargin: listEdgeRootMargin(edge, prefetchDistance), threshold: 0 });

    const handleScroll = () => {
        const scrollTop = root.scrollTop;
        const movedToward = edge === "bottom" ? scrollTop > lastScrollTop : scrollTop < lastScrollTop;
        lastScrollTop = scrollTop;
        if (!movedToward && !onLeaveRegion) return;
        if (!isInRegion(movedToward ? scrollPrefetchDistance : prefetchDistance)) {
            onLeaveRegion?.();
        } else if (movedToward) {
            onScrollApproach();
        }
    };

    if (onLeaveRegion && !isInRegion()) onLeaveRegion();
    observer.observe(sentinel);
    root.addEventListener("scroll", handleScroll, { passive: true });
    return {
        isInRegion,
        hasReceivedEntry: () => receivedEntry,
        syncScrollPosition: () => { lastScrollTop = root.scrollTop; },
        dispose() {
            active = false;
            root.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        },
    };
}

/** Observe one batch at the bottom of a list. A new batch can attach its own sentinel. */
export function observeListEnd(root: HTMLElement | null, sentinel: HTMLElement, load: () => boolean) {
    if (!root || typeof IntersectionObserver === "undefined") return;
    let requested = false;
    const approach = () => {
        if (!requested && sentinel.isConnected && root.contains(sentinel)) requested = load();
    };
    return observeListEdge({
        root, sentinel, edge: "bottom", prefetchDistance: 600,
        onIntersection: intersects => { if (intersects) approach(); },
        onScrollApproach: approach,
    }).dispose;
}
