import {
    TAB_SWIPE_SETTLE_MS,
    estimatePointerVelocity,
    isTabSwipeOverlayOpen,
    isTabSwipeScreenEdge,
    releaseTabSwipe,
    resolveTabSwipeAxis,
    swipeReleaseX,
    swipeTargetBlocksTabSwipe,
    tabIndicatorProgress,
    tabSwipeDragPx,
    type PostHistorySwipeTab,
} from "../postHistoryTabSwipe";

const COARSE_POINTER_QUERY = "(hover: none) and (pointer: coarse)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const CLICK_SUPPRESSION_MS = 400;

interface UsePostHistoryTabSwipeOptions {
    getOpen: () => boolean;
    getTab: () => PostHistorySwipeTab;
    getGestureBlocked: () => boolean;
    onCommit: (tab: PostHistorySwipeTab) => void;
}

interface SwipeSession {
    pointerId: number;
    startX: number;
    startY: number;
    tab: PostHistorySwipeTab;
    axis: "pending" | "vertical" | "horizontal";
    samples: { x: number; t: number }[];
    width: number;
}

function matches(query: string): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    try { return window.matchMedia(query).matches; } catch { return false; }
}

function rememberRecentSample(samples: { x: number; t: number }[], point: { x: number; t: number }): void {
    samples.push(point);
    const latest = point.t;
    while (samples.length > 1 && latest - samples[0].t > 120) samples.shift();
}

function suppressFollowingClick(node: HTMLElement): void {
    const stop = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    node.addEventListener("click", stop, true);
    window.setTimeout(() => node.removeEventListener("click", stop, true), CLICK_SUPPRESSION_MS);
}

/**
 * Horizontal tab swipe for the open history dialog on a coarse pointer.
 * The active panel follows the finger; the other tab stays unmounted until release.
 */
export function usePostHistoryTabSwipe(options: UsePostHistoryTabSwipeOptions) {
    let dragPx = $state(0);
    let dragging = $state(false);
    let widthPx = $state(0);
    let node = $state<HTMLElement | null>(null);

    $effect(() => {
        const current = node;
        const open = options.getOpen();
        if (!current || !open) {
            dragPx = 0;
            dragging = false;
            return;
        }

        let session: SwipeSession | null = null;
        let frame = 0;
        let generation = 0;

        const stopSettle = () => { generation += 1; if (frame) cancelAnimationFrame(frame); frame = 0; };

        const settle = (from: number, to: number, animate: boolean, done: () => void) => {
            const token = ++generation;
            if (!animate) {
                dragPx = to;
                if (token === generation) done();
                return;
            }
            const startedAt = performance.now();
            const step = (now: number) => {
                if (token !== generation) return;
                const progress = Math.min(1, (now - startedAt) / TAB_SWIPE_SETTLE_MS);
                const eased = 1 - (1 - progress) ** 3;
                dragPx = from + (to - from) * eased;
                if (progress < 1) frame = requestAnimationFrame(step);
                else done();
            };
            frame = requestAnimationFrame(step);
        };

        const endGesture = (reportedX: number, timeStamp: number, commitAllowed: boolean) => {
            const finished = session;
            if (!finished) return;
            session = null;
            dragging = false;
            if (finished.axis !== "horizontal") {
                dragPx = 0;
                return;
            }
            suppressFollowingClick(current);
            widthPx = finished.width;
            const x = swipeReleaseX(finished.samples, reportedX);
            const dx = x - finished.startX;
            rememberRecentSample(finished.samples, { x, t: timeStamp });
            const from = tabSwipeDragPx(finished.tab, dx, finished.width);
            dragPx = from;
            if (!commitAllowed || options.getGestureBlocked()) {
                settle(from, 0, !matches(REDUCED_MOTION_QUERY), () => { dragPx = 0; });
                return;
            }
            const decision = releaseTabSwipe({
                tab: finished.tab,
                dx,
                width: finished.width,
                velocityX: estimatePointerVelocity(finished.samples),
                reducedMotion: matches(REDUCED_MOTION_QUERY),
            });
            if (decision.type === "cancel") {
                settle(from, 0, decision.animate, () => { dragPx = 0; });
                return;
            }
            const target = Math.sign(dx) * finished.width;
            settle(from, target, decision.animate, () => {
                dragPx = 0;
                options.onCommit(decision.tab);
            });
        };

        const trackPoint = (x: number, y: number, timeStamp: number) => {
            if (!session || session.axis === "vertical") return;
            const dx = x - session.startX;
            const dy = y - session.startY;
            if (session.axis === "pending") {
                const axis = resolveTabSwipeAxis(dx, dy);
                if (axis === "undecided") return;
                session.axis = axis;
                if (axis === "vertical") return;
            }
            dragging = true;
            rememberRecentSample(session.samples, { x, t: timeStamp });
            dragPx = tabSwipeDragPx(session.tab, dx, session.width);
        };

        const onDown = (event: PointerEvent) => {
            if (session && event.pointerId !== session.pointerId) {
                if (event.pointerType === "touch") {
                    const lastX = session.samples.at(-1)?.x ?? session.startX;
                    endGesture(lastX, event.timeStamp, false);
                }
                return;
            }
            if (!event.isPrimary || event.button !== 0 || event.pointerType === "mouse") return;
            if (session || !matches(COARSE_POINTER_QUERY)) return;
            if (options.getGestureBlocked() || isTabSwipeOverlayOpen(current.ownerDocument)) return;
            if (isTabSwipeScreenEdge(event.clientX, window.innerWidth)) return;
            if (swipeTargetBlocksTabSwipe(event.target)) return;
            const width = current.clientWidth;
            if (!(width > 0)) return;
            session = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                tab: options.getTab(),
                axis: "pending",
                samples: [{ x: event.clientX, t: event.timeStamp }],
                width,
            };
            widthPx = width;
        };

        const onMove = (event: PointerEvent) => {
            if (!session || event.pointerId !== session.pointerId) return;
            trackPoint(event.clientX, event.clientY, event.timeStamp);
        };
        const onUp = (event: PointerEvent) => {
            if (!session || event.pointerId !== session.pointerId) return;
            endGesture(event.clientX, event.timeStamp, true);
        };
        // Android Chrome ends a horizontal swipe with pointercancel and clientX 0.
        // Commit from the last real sample instead of treating that as a cancelled drag.
        const onCancel = (event: PointerEvent) => {
            if (!session || event.pointerId !== session.pointerId) return;
            endGesture(event.clientX, event.timeStamp, true);
        };

        current.addEventListener("pointerdown", onDown);
        current.addEventListener("pointermove", onMove);
        current.addEventListener("pointerup", onUp);
        current.addEventListener("pointercancel", onCancel);
        return () => {
            stopSettle();
            session = null;
            current.removeEventListener("pointerdown", onDown);
            current.removeEventListener("pointermove", onMove);
            current.removeEventListener("pointerup", onUp);
            current.removeEventListener("pointercancel", onCancel);
        };
    });

    const indicatorProgress = $derived(tabIndicatorProgress(options.getTab(), dragPx, widthPx));

    return {
        attachment: (element: HTMLElement) => {
            node = element;
            return () => { if (node === element) node = null; };
        },
        get dragPx() { return dragPx; },
        get dragging() { return dragging; },
        get indicatorProgress() { return indicatorProgress; },
    };
}
