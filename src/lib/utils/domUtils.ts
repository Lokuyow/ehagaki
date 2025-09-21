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
