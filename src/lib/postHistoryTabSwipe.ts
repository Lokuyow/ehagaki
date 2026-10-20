export const TAB_SWIPE_AXIS_SLOP_PX = 10;
export const TAB_SWIPE_EDGE_INSET_PX = 24;
export const TAB_SWIPE_COMMIT_RATIO = 0.22;
export const TAB_SWIPE_FLICK_VELOCITY_PX_PER_MS = 0.45;
export const TAB_SWIPE_FLICK_MIN_DISTANCE_PX = 24;
export const TAB_SWIPE_RUBBER_RESISTANCE = 0.33;
export const TAB_SWIPE_RUBBER_MAX_PX = 72;
export const TAB_SWIPE_SETTLE_MS = 200;

export type PostHistorySwipeTab = "posts" | "media";
export type TabSwipeAxis = "undecided" | "vertical" | "horizontal";

const BLOCKED_SWIPE_TARGET = [
    "input",
    "textarea",
    "select",
    "option",
    "video",
    "audio",
    "[contenteditable]:not([contenteditable='false'])",
    "[role='menu']",
    "[role='listbox']",
    ".ehagaki-pswp",
].join(", ");

export function isTabSwipeScreenEdge(clientX: number, viewportWidth: number): boolean {
    if (!Number.isFinite(clientX) || !(viewportWidth > TAB_SWIPE_EDGE_INSET_PX * 2)) return false;
    return clientX < TAB_SWIPE_EDGE_INSET_PX || clientX > viewportWidth - TAB_SWIPE_EDGE_INSET_PX;
}

export function swipeTargetBlocksTabSwipe(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false;
    return target.closest(BLOCKED_SWIPE_TARGET) !== null;
}

export function isTabSwipeOverlayOpen(root: ParentNode | null | undefined): boolean {
    return Boolean(root?.querySelector("[role='menu'], [role='listbox']"));
}

/** Equal movement stays with the vertical list so a diagonal scroll is not stolen. */
export function resolveTabSwipeAxis(dx: number, dy: number): TabSwipeAxis {
    const distanceX = Math.abs(dx);
    const distanceY = Math.abs(dy);
    if (distanceX < TAB_SWIPE_AXIS_SLOP_PX && distanceY < TAB_SWIPE_AXIS_SLOP_PX) return "undecided";
    if (distanceX > distanceY && distanceX >= TAB_SWIPE_AXIS_SLOP_PX) return "horizontal";
    if (distanceY >= TAB_SWIPE_AXIS_SLOP_PX) return "vertical";
    return "undecided";
}

export function neighborTab(tab: PostHistorySwipeTab, dx: number): PostHistorySwipeTab | null {
    if (dx < 0 && tab === "posts") return "media";
    if (dx > 0 && tab === "media") return "posts";
    return null;
}

export function rubberBandOffset(dx: number): number {
    if (dx === 0) return 0;
    const resisted = Math.abs(dx) * TAB_SWIPE_RUBBER_RESISTANCE;
    return Math.sign(dx) * Math.min(resisted, TAB_SWIPE_RUBBER_MAX_PX);
}

export function tabSwipeDragPx(tab: PostHistorySwipeTab, dx: number, width: number): number {
    if (!neighborTab(tab, dx)) return rubberBandOffset(dx);
    const limit = Math.max(width, 0);
    if (limit === 0) return 0;
    return Math.max(-limit, Math.min(limit, dx));
}

export interface TabSwipeReleaseInput {
    tab: PostHistorySwipeTab;
    dx: number;
    width: number;
    velocityX: number;
    reducedMotion: boolean;
}

export type TabSwipeRelease =
    | { type: "commit"; tab: PostHistorySwipeTab; animate: boolean }
    | { type: "cancel"; animate: boolean };

export function releaseTabSwipe(input: TabSwipeReleaseInput): TabSwipeRelease {
    const neighbor = neighborTab(input.tab, input.dx);
    const distance = Math.abs(input.dx);
    const threshold = Math.max(input.width, 0) * TAB_SWIPE_COMMIT_RATIO;
    const flickDirectionMatches = input.dx !== 0 && Math.sign(input.velocityX) === Math.sign(input.dx);
    const flick = neighbor !== null
        && flickDirectionMatches
        && Math.abs(input.velocityX) > TAB_SWIPE_FLICK_VELOCITY_PX_PER_MS
        && distance > TAB_SWIPE_FLICK_MIN_DISTANCE_PX;
    const animate = !input.reducedMotion;
    if (neighbor && (distance >= threshold || flick)) return { type: "commit", tab: neighbor, animate };
    return { type: "cancel", animate };
}

/** 0 is the posts tab and 1 is the media tab. Rubber-band drags may leave that range. */
export function tabIndicatorProgress(tab: PostHistorySwipeTab, dragPx: number, width: number): number {
    const base = tab === "media" ? 1 : 0;
    if (!(width > 0)) return base;
    return base + (-dragPx / width);
}

/**
 * Android Chrome reports clientX 0 from pointercancel, and sometimes from pointerup,
 * after the finger has already moved. The sampled points are the real position.
 */
export function swipeReleaseX(samples: readonly { x: number; t: number }[], reportedX: number): number {
    const last = samples[samples.length - 1]?.x;
    if (last === undefined) return Number.isFinite(reportedX) ? reportedX : 0;
    if (!Number.isFinite(reportedX) || (reportedX === 0 && last !== 0)) return last;
    return reportedX;
}

export function estimatePointerVelocity(samples: readonly { x: number; t: number }[]): number {
    if (samples.length < 2) return 0;
    const last = samples[samples.length - 1];
    let anchor = samples[0];
    for (let index = samples.length - 2; index >= 0; index -= 1) {
        anchor = samples[index];
        if (last.t - samples[index].t >= 32) break;
    }
    const elapsed = last.t - anchor.t;
    if (elapsed <= 0) return 0;
    return (last.x - anchor.x) / elapsed;
}
