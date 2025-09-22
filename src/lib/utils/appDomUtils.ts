/**
 * DOM操作ユーティリティ（テスト時にモック可能）
 */
export const domUtils = {
    setBodyStyle(property: string, value: string): void {
        document.body.style.setProperty(property, value);
    },

    querySelector(selector: string): HTMLElement | null {
        return document.querySelector(selector) as HTMLElement;
    },

    querySelectorAll(selector: string): NodeListOf<HTMLElement> {
        return document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
    },

    focusElement(element: HTMLElement): void {
        element.focus();
    }
};

export function setBodyStyle(property: string, value: string): void {
    domUtils.setBodyStyle(property, value);
}

export function clearBodyStyles(): void {
    setBodyStyle("overflow", "");
    setBodyStyle("user-select", "");
    setBodyStyle("-webkit-user-select", "");
}

// === 追加: DOM操作の抽象化 ===
export function getActiveElement(): HTMLElement | null {
    return document.activeElement as HTMLElement | null;
}

export function isEditorElement(element: HTMLElement): boolean {
    return element.classList?.contains?.("tiptap-editor") || !!element.closest?.(".tiptap-editor");
}

export function isFormControl(element: HTMLElement): boolean {
    return ["INPUT", "TEXTAREA"].includes(element.tagName) || element.isContentEditable;
}

export function blurActiveElement(): void {
    const active = getActiveElement();
    if (active && (isEditorElement(active) || isFormControl(active))) {
        active.blur?.();
        (document.body as HTMLElement)?.focus?.();
    }
}

export function isTouchDevice(): boolean {
    return (
        typeof window !== "undefined" &&
        ("ontouchstart" in window ||
            (navigator && navigator.maxTouchPoints > 0) ||
            (navigator && !!navigator.userAgent.match(/Android|iPhone|iPad|iPod|Mobile/i)))
    );
}

export function blurEditorAndBody() {
    try {
        blurActiveElement();
        // タッチデバイスでのキーボード非表示を強化
        if (isTouchDevice()) {
            // エディター要素を明示的にblur
            const editorElement = document.querySelector('.tiptap-editor') as HTMLElement;
            if (editorElement) {
                editorElement.blur?.();
            }
        }
    } catch (e) {
        // ignore
    }
}

// デフォルトアダプター実装
export const defaultTimeoutAdapter = {
    setTimeout: (callback: () => void, delay: number) => setTimeout(callback, delay)
};

export function focusEditor(
    selector: string,
    delay: number,
    timeoutAdapter = defaultTimeoutAdapter
): void {
    timeoutAdapter.setTimeout(() => {
        const editorElement = domUtils.querySelector(selector);
        if (editorElement) {
            domUtils.focusElement(editorElement);
        }
    }, delay);
}
