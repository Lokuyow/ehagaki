let restoreTimeoutId: ReturnType<typeof setTimeout> | null = null;
let suppressedEditor: [HTMLElement, string | null] | null = null;

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

function suppressEditorKeyboardForCurrentTap(event: Event): void {
    const keyboardHeight = Number.parseFloat(
        window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("--keyboard-height"),
    );
    if (
        (event.type !== "touchstart" &&
            (event as PointerEvent).pointerType !== "touch") ||
        keyboardHeight > 80
    ) {
        return;
    }

    const activeElement = document.activeElement as HTMLElement | null;
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

export function focusEditorWithoutKeyboardForCurrentTap(
    editorElement: HTMLElement,
): void {
    if (document.activeElement === editorElement) {
        return;
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
}
