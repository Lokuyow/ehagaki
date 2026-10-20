import { describe, expect, it } from "vitest";
import {
    estimatePointerVelocity,
    isTabSwipeOverlayOpen,
    swipeReleaseX,
    isTabSwipeScreenEdge,
    releaseTabSwipe,
    resolveTabSwipeAxis,
    rubberBandOffset,
    swipeTargetBlocksTabSwipe,
    tabIndicatorProgress,
    tabSwipeDragPx,
} from "../../lib/postHistoryTabSwipe";

describe("post history tab swipe", () => {
    it("keeps a short or vertical move on the list", () => {
        expect(resolveTabSwipeAxis(9, 9)).toBe("undecided");
        expect(resolveTabSwipeAxis(4, 30)).toBe("vertical");
        expect(resolveTabSwipeAxis(12, 12)).toBe("vertical");
    });

    it("locks a horizontal move once it passes the slop", () => {
        expect(resolveTabSwipeAxis(-11, 4)).toBe("horizontal");
        expect(resolveTabSwipeAxis(18, 17)).toBe("horizontal");
    });

    it("ignores a gesture that starts in the screen-edge back zone", () => {
        expect(isTabSwipeScreenEdge(10, 390)).toBe(true);
        expect(isTabSwipeScreenEdge(370, 390)).toBe(true);
        expect(isTabSwipeScreenEdge(200, 390)).toBe(false);
        expect(isTabSwipeScreenEdge(10, 40)).toBe(false);
    });

    it("does not start on text entry, media controls, menus, or fullscreen", () => {
        const field = document.createElement("input");
        const editable = document.createElement("div");
        editable.setAttribute("contenteditable", "true");
        const text = document.createElement("span");
        editable.append(text);
        const plain = document.createElement("div");
        plain.setAttribute("contenteditable", "false");
        const video = document.createElement("video");
        const menu = document.createElement("div");
        menu.setAttribute("role", "menu");
        const item = document.createElement("button");
        menu.append(item);
        const fullscreen = document.createElement("div");
        fullscreen.className = "ehagaki-pswp";
        document.body.append(field, editable, plain, video, menu, fullscreen);

        expect(swipeTargetBlocksTabSwipe(field)).toBe(true);
        expect(swipeTargetBlocksTabSwipe(text)).toBe(true);
        expect(swipeTargetBlocksTabSwipe(plain)).toBe(false);
        expect(swipeTargetBlocksTabSwipe(video)).toBe(true);
        expect(swipeTargetBlocksTabSwipe(item)).toBe(true);
        expect(swipeTargetBlocksTabSwipe(fullscreen)).toBe(true);
        expect(swipeTargetBlocksTabSwipe(document.createTextNode("x"))).toBe(false);
        expect(isTabSwipeOverlayOpen(document.body)).toBe(true);
        for (const node of [field, editable, plain, video, menu, fullscreen]) node.remove();
        expect(isTabSwipeOverlayOpen(document.body)).toBe(false);
    });

    it("commits a left swipe from posts and a right swipe from media", () => {
        expect(releaseTabSwipe({ tab: "posts", dx: -66, width: 300, velocityX: 0, reducedMotion: false }))
            .toEqual({ type: "commit", tab: "media", animate: true });
        expect(releaseTabSwipe({ tab: "media", dx: 66, width: 300, velocityX: 0, reducedMotion: false }))
            .toEqual({ type: "commit", tab: "posts", animate: true });
    });

    it("cancels a short swipe and the direction that has no neighbor", () => {
        expect(releaseTabSwipe({ tab: "posts", dx: -65, width: 300, velocityX: 0, reducedMotion: false }))
            .toEqual({ type: "cancel", animate: true });
        expect(releaseTabSwipe({ tab: "posts", dx: 80, width: 300, velocityX: 0.8, reducedMotion: false }).type)
            .toBe("cancel");
        expect(releaseTabSwipe({ tab: "media", dx: -80, width: 300, velocityX: -0.8, reducedMotion: false }).type)
            .toBe("cancel");
    });

    it("commits a fast flick without waiting for the distance threshold", () => {
        expect(releaseTabSwipe({ tab: "posts", dx: -25, width: 300, velocityX: -0.46, reducedMotion: false }))
            .toEqual({ type: "commit", tab: "media", animate: true });
        expect(releaseTabSwipe({ tab: "posts", dx: -24, width: 300, velocityX: -0.8, reducedMotion: false }).type)
            .toBe("cancel");
        expect(releaseTabSwipe({ tab: "posts", dx: -40, width: 300, velocityX: 0.8, reducedMotion: false }).type)
            .toBe("cancel");
    });

    it("skips the settle animation when reduced motion is requested", () => {
        expect(releaseTabSwipe({ tab: "posts", dx: -90, width: 300, velocityX: 0, reducedMotion: true }))
            .toEqual({ type: "commit", tab: "media", animate: false });
        expect(releaseTabSwipe({ tab: "posts", dx: -10, width: 300, velocityX: 0, reducedMotion: true }).animate)
            .toBe(false);
    });

    it("follows the finger toward a neighbor and resists the closed end", () => {
        expect(tabSwipeDragPx("posts", -250, 200)).toBe(-200);
        expect(tabSwipeDragPx("posts", 300, 200)).toBe(72);
        expect(rubberBandOffset(-300)).toBe(-72);
        expect(tabSwipeDragPx("media", 40, 0)).toBe(0);
    });

    it("moves the underline from posts toward media as the panel slides left", () => {
        expect(tabIndicatorProgress("posts", 0, 0)).toBe(0);
        expect(tabIndicatorProgress("media", 0, 200)).toBe(1);
        expect(tabIndicatorProgress("posts", -50, 200)).toBeCloseTo(0.25);
        expect(tabIndicatorProgress("posts", 72, 360)).toBeCloseTo(-0.2);
    });

    it("keeps the last sampled point when a cancelled touch reports x 0", () => {
        const samples = [{ x: 180, t: 0 }, { x: 40, t: 40 }];
        expect(swipeReleaseX(samples, 0)).toBe(40);
        expect(swipeReleaseX(samples, 36)).toBe(36);
        expect(swipeReleaseX([], 120)).toBe(120);
    });

    it("estimates velocity from the recent samples", () => {
        expect(estimatePointerVelocity([{ x: 0, t: 0 }])).toBe(0);
        expect(estimatePointerVelocity([
            { x: 0, t: 0 },
            { x: 10, t: 20 },
            { x: 30, t: 60 },
        ])).toBeCloseTo(0.5);
    });
});
