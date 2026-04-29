function getTouchClientY(event: TouchEvent): number | null {
    const touch = event.touches?.[0] ?? event.changedTouches?.[0];
    return typeof touch?.clientY === "number" ? touch.clientY : null;
}

function getDocumentScrollTop(targetDocument: Document): number {
    return Math.max(
        0,
        targetDocument.defaultView?.scrollY ?? 0,
        targetDocument.documentElement?.scrollTop ?? 0,
        targetDocument.scrollingElement?.scrollTop ?? 0,
    );
}

function isDocumentPullToRefreshGesture(
    targetDocument: Document,
    deltaY: number,
): boolean {
    return deltaY > 0 && getDocumentScrollTop(targetDocument) <= 0;
}

export function resolveTouchScrollElements(
    target: EventTarget | null,
): HTMLElement[] {
    if (!(target instanceof Element)) {
        return [];
    }

    const elements: HTMLElement[] = [];
    const editorElement = target.closest(".tiptap-editor") as HTMLElement | null;
    if (editorElement) {
        elements.push(editorElement);
    }

    const composerScrollElement = target.closest(
        ".composer-scroll-region",
    ) as HTMLElement | null;
    if (composerScrollElement && composerScrollElement !== editorElement) {
        elements.push(composerScrollElement);
    }

    return elements;
}

export function canScrollElement(element: HTMLElement): boolean {
    return element.scrollHeight > element.clientHeight + 1;
}

export function canScrollElementInDirection(
    element: HTMLElement,
    deltaY: number,
): boolean {
    if (!canScrollElement(element)) {
        return false;
    }

    const maxScrollTop = element.scrollHeight - element.clientHeight;
    const isAtTop = element.scrollTop <= 0;
    const isAtBottom = element.scrollTop >= maxScrollTop - 1;

    if (deltaY > 0) {
        return !isAtTop;
    }

    if (deltaY < 0) {
        return !isAtBottom;
    }

    return true;
}

export function createKeyboardTouchScrollLock(
    targetDocument: Document = document,
) {
    let locked = false;
    let touchTarget: EventTarget | null = null;
    let lastClientY: number | null = null;

    function handleTouchStart(event: TouchEvent): void {
        if (!locked) {
            return;
        }

        touchTarget = event.target;
        lastClientY = getTouchClientY(event);
    }

    function handleTouchMove(event: TouchEvent): void {
        if (!locked) {
            return;
        }

        const currentClientY = getTouchClientY(event);
        const scrollElements = resolveTouchScrollElements(
            touchTarget ?? event.target,
        );

        if (currentClientY === null || lastClientY === null) {
            lastClientY = currentClientY;
            return;
        }

        const deltaY = currentClientY - lastClientY;
        lastClientY = currentClientY;

        if (scrollElements.length === 0) {
            if (!isDocumentPullToRefreshGesture(targetDocument, deltaY)) {
                event.preventDefault();
            }
            return;
        }

        const activeScrollElement = scrollElements.find((element) =>
            canScrollElementInDirection(element, deltaY),
        );

        if (!activeScrollElement) {
            event.preventDefault();
        }
    }

    function handleTouchEnd(): void {
        touchTarget = null;
        lastClientY = null;
    }

    function sync(shouldLock: boolean): void {
        if (shouldLock === locked) {
            return;
        }

        locked = shouldLock;

        if (shouldLock) {
            targetDocument.addEventListener("touchstart", handleTouchStart, {
                passive: false,
            });
            targetDocument.addEventListener("touchmove", handleTouchMove, {
                passive: false,
            });
            targetDocument.addEventListener("touchend", handleTouchEnd);
            targetDocument.addEventListener("touchcancel", handleTouchEnd);
            return;
        }

        targetDocument.removeEventListener("touchstart", handleTouchStart);
        targetDocument.removeEventListener("touchmove", handleTouchMove);
        targetDocument.removeEventListener("touchend", handleTouchEnd);
        targetDocument.removeEventListener("touchcancel", handleTouchEnd);
        touchTarget = null;
        lastClientY = null;
    }

    return {
        sync,
        dispose() {
            sync(false);
        },
    };
}
