export function getLayoutViewportHeight(): number {
    if (typeof window === "undefined") {
        return 0;
    }

    return Math.max(
        document.documentElement?.clientHeight ?? 0,
        window.innerHeight,
        window.visualViewport?.height ?? 0,
    );
}

export function getEffectiveViewportOffsetTop(
    viewport?: VisualViewport | null,
): number {
    if (typeof window === "undefined") {
        return 0;
    }

    return Math.max(
        viewport?.offsetTop ?? 0,
        viewport?.pageTop ?? 0,
        window.scrollY,
        document.documentElement?.scrollTop ?? 0,
        document.scrollingElement?.scrollTop ?? 0,
    );
}

export function isNonPwaIPhoneSafari(): boolean {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return false;
    }

    const userAgent = navigator.userAgent;
    const isIPhone = /iPhone/i.test(userAgent);
    const isWebKit = /WebKit/i.test(userAgent);
    const isCriOS = /CriOS/i.test(userAgent);
    const isFxiOS = /FxiOS/i.test(userAgent);
    const isEdgiOS = /EdgiOS/i.test(userAgent);
    const isStandalone =
        window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true;

    return isIPhone && isWebKit && !isCriOS && !isFxiOS && !isEdgiOS && !isStandalone;
}