import { getAppRuntimeEnvironment } from "../appRuntimeEnvironment";

let restoreTimeoutId: ReturnType<typeof setTimeout> | null = null;
let suppressedEditor: [HTMLElement, string | null] | null = null;

export const POST_EDITOR_ROOT_SELECTOR = "[data-post-editor-root]";
const COMPOSER_KEYBOARD_VISIBLE_THRESHOLD = 80;

function getElementForNode(node: Node | null): Element | null {
    if (node instanceof Element) {
        return node;
    }

    return node?.parentElement ?? null;
}

export function isPostEditorFocusActive(): boolean {
    const runtimeEnvironment = getAppRuntimeEnvironment();
    const root = runtimeEnvironment.domRoot;
    const doc = runtimeEnvironment.document;
    const activeElement = root && "activeElement" in root
        ? root.activeElement
        : doc?.activeElement;

    if (activeElement?.closest(POST_EDITOR_ROOT_SELECTOR)) {
        return true;
    }

    if (
        activeElement &&
        activeElement !== doc?.body &&
        activeElement !== doc?.documentElement
    ) {
        return false;
    }

    const selection = doc?.getSelection();
    return Boolean(
        selection?.rangeCount &&
            getElementForNode(selection.anchorNode)?.closest(
                POST_EDITOR_ROOT_SELECTOR,
            ),
    );
}

export function readComposerKeyboardHeight(): number {
    const runtimeEnvironment = getAppRuntimeEnvironment();
    const rawValue = runtimeEnvironment.window
        ?.getComputedStyle(runtimeEnvironment.styleTarget)
        .getPropertyValue("--keyboard-height")
        .trim()
        ?? runtimeEnvironment.styleTarget.style
            .getPropertyValue("--keyboard-height")
            .trim();
    const value = Number.parseFloat(rawValue);

    return Number.isFinite(value) ? value : 0;
}

export function isComposerKeyboardVisible(): boolean {
    return readComposerKeyboardHeight() > COMPOSER_KEYBOARD_VISIBLE_THRESHOLD;
}

function restoreEditorKeyboardInput(): void {
    if (!suppressedEditor) {
        return;
    }

    const [element, inputMode] = suppressedEditor;

    if (inputMode === null) {
        element.removeAttribute("inputmode");
    } else {
        element.setAttribute("inputmode", inputMode);
    }

    suppressedEditor = null;
}

function getActiveElementForEvent(event: Event): HTMLElement | null {
    const target = event.target;
    const root = target instanceof Node ? target.getRootNode() : document;
    const activeElement = root instanceof ShadowRoot
        ? root.activeElement
        : document.activeElement;

    return activeElement instanceof HTMLElement ? activeElement : null;
}

function suppressEditorKeyboardForCurrentTap(event: Event): void {
    if (
        (event.type !== "touchstart" &&
            (event as PointerEvent).pointerType !== "touch") ||
        isComposerKeyboardVisible()
    ) {
        return;
    }

    const activeElement = getActiveElementForEvent(event);
    if (!activeElement?.classList?.contains("tiptap-editor")) {
        return;
    }

    if (!suppressedEditor) {
        suppressedEditor = [activeElement, activeElement.getAttribute("inputmode")];
    }

    activeElement.setAttribute("inputmode", "none");

    if (restoreTimeoutId !== null) {
        clearTimeout(restoreTimeoutId);
    }

    restoreTimeoutId = setTimeout(() => {
        restoreTimeoutId = null;
        restoreEditorKeyboardInput();
    }, 400);
}

export function preventKeyboardFocusChange(event: Event): void {
    event.preventDefault();
    suppressEditorKeyboardForCurrentTap(event);
}

export function preserveKeyboardForScrollableTouch(event: Event): void {
    suppressEditorKeyboardForCurrentTap(event);
}

export function isIosTouchDevice(): boolean {
    if (typeof navigator === "undefined") {
        return false;
    }

    const userAgent = navigator.userAgent ?? "";
    const platform = navigator.platform ?? "";

    return (
        /iPad|iPhone|iPod/.test(userAgent) ||
        (platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
}

export function focusEditorWithoutKeyboardForCurrentTap(
    editorElement: HTMLElement,
): boolean {
    if (document.activeElement === editorElement) {
        return true;
    }

    if (isIosTouchDevice()) {
        return false;
    }

    if (!suppressedEditor) {
        suppressedEditor = [editorElement, editorElement.getAttribute("inputmode")];
    }

    editorElement.setAttribute("inputmode", "none");
    editorElement.focus({ preventScroll: true });

    if (restoreTimeoutId !== null) {
        clearTimeout(restoreTimeoutId);
    }

    restoreTimeoutId = setTimeout(() => {
        restoreTimeoutId = null;
        restoreEditorKeyboardInput();
    }, 400);

    return document.activeElement === editorElement;
}
