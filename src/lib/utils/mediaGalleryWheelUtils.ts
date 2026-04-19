type HorizontalScrollElement = Pick<
    HTMLElement,
    "scrollLeft" | "scrollWidth" | "clientWidth"
>;

type VerticalScrollElement = Pick<
    HTMLElement,
    "scrollTop" | "scrollHeight" | "clientHeight"
>;

type WheelInput = Pick<WheelEvent, "deltaX" | "deltaY">;

export function resolveMediaGalleryWheelDelta(event: WheelInput): number {
    return Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;
}

export function canScrollElementVerticallyWithWheel(
    element: VerticalScrollElement,
    deltaY: number,
): boolean {
    const maxScrollTop = element.scrollHeight - element.clientHeight;

    if (maxScrollTop <= 1) {
        return false;
    }

    const isAtTop = element.scrollTop <= 0;
    const isAtBottom = element.scrollTop >= maxScrollTop - 1;

    if (deltaY > 0) {
        return !isAtBottom;
    }

    if (deltaY < 0) {
        return !isAtTop;
    }

    return false;
}

export function canScrollMediaGalleryHorizontally(
    element: HorizontalScrollElement,
    delta: number,
): boolean {
    const maxScrollLeft = element.scrollWidth - element.clientWidth;

    if (maxScrollLeft <= 1) {
        return false;
    }

    const isAtLeft = element.scrollLeft <= 0;
    const isAtRight = element.scrollLeft >= maxScrollLeft - 1;

    if (delta > 0) {
        return !isAtRight;
    }

    if (delta < 0) {
        return !isAtLeft;
    }

    return false;
}

export function consumeMediaGalleryWheelScroll(
    galleryElement: HorizontalScrollElement,
    event: WheelInput,
    composerScrollRegion: VerticalScrollElement | null = null,
): boolean {
    if (
        composerScrollRegion &&
        canScrollElementVerticallyWithWheel(composerScrollRegion, event.deltaY)
    ) {
        return false;
    }

    const wheelDelta = resolveMediaGalleryWheelDelta(event);

    if (!canScrollMediaGalleryHorizontally(galleryElement, wheelDelta)) {
        return false;
    }

    const maxScrollLeft = Math.max(
        0,
        galleryElement.scrollWidth - galleryElement.clientWidth,
    );
    galleryElement.scrollLeft = Math.min(
        maxScrollLeft,
        Math.max(0, galleryElement.scrollLeft + wheelDelta),
    );

    return true;
}