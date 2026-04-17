/**
 * UI関連の共有ストア
 * キーボード追従などのレイアウト状態を管理
 */

// --- 定数 ---
/** フッターの高さ（px） */
export const FOOTER_HEIGHT = 66;

/** キーボードボタンバーの高さ（px） */
export const KEYBOARD_BUTTON_BAR_HEIGHT = 50;

/** ReasonInput（Content Warning理由入力）の高さ（px） */
export const REASON_INPUT_HEIGHT = 50;

/** メインコンテンツ上部の余白（px） */
export const MAIN_CONTENT_TOP_SPACING = 8;

/** キーボードが開いていると判定する最小の高さ（px） */
const KEYBOARD_THRESHOLD = 100;

function setRootStyleProperty(name: string, value: string): void {
    if (typeof document === "undefined") {
        return;
    }

    document.documentElement.style.setProperty(name, value);
}

function getFooterReservedHeight(isKeyboardOpen: boolean): number {
    return isKeyboardOpen ? 0 : FOOTER_HEIGHT;
}

function syncLayoutCssVariables(
    isKeyboardOpen: boolean,
    viewportHeight?: number,
): void {
    const footerReservedHeight = getFooterReservedHeight(isKeyboardOpen);

    setRootStyleProperty("--footer-height", `${FOOTER_HEIGHT}px`);
    setRootStyleProperty(
        "--keyboard-button-bar-height",
        `${KEYBOARD_BUTTON_BAR_HEIGHT}px`,
    );
    setRootStyleProperty(
        "--reason-input-base-height",
        `${REASON_INPUT_HEIGHT}px`,
    );
    setRootStyleProperty(
        "--main-content-top-spacing",
        `${MAIN_CONTENT_TOP_SPACING}px`,
    );
    setRootStyleProperty(
        "--footer-reserved-height",
        `${footerReservedHeight}px`,
    );
    setRootStyleProperty(
        "--composer-bottom-reserved-height",
        `${footerReservedHeight + KEYBOARD_BUTTON_BAR_HEIGHT}px`,
    );
    setRootStyleProperty(
        "--reason-input-height",
        reasonInputVisible ? `${REASON_INPUT_HEIGHT}px` : "0px",
    );
    setRootStyleProperty("--keyboard-height", `${keyboardHeight}px`);

    if (viewportHeight !== undefined) {
        setRootStyleProperty("--visible-viewport-height", `${viewportHeight}px`);
    }
}

// --- reasonInputVisible ストア ---
/** ReasonInputが表示されているかどうか */
let reasonInputVisible = $state(false);

/**
 * ReasonInput表示状態ストア
 * Content Warningが有効な時にtrueになる
 */
export const reasonInputVisibleStore = {
    get value() {
        return reasonInputVisible;
    },
    set: (v: boolean) => {
        reasonInputVisible = v;
        syncLayoutCssVariables(keyboardHeight > 0);
    },
};

// --- bottomPosition ストア ---
let bottomPosition = $state(FOOTER_HEIGHT);

// --- keyboardHeight ストア ---
/** キーボードの高さ（px）。キーボードが閉じている時は 0 */
let keyboardHeight = $state(0);

syncLayoutCssVariables(false);

/**
 * キーボード高さストア
 * キーボードが開いている時のみ正の値、閉じている時は 0
 */
export const keyboardHeightStore = {
    get value() {
        return keyboardHeight;
    },
    set: (v: number) => {
        keyboardHeight = v;
    },
};

/**
 * キーボード追従のための位置調整ストア
 * visualViewportを監視してキーボード表示時に位置を調整
 */
export const bottomPositionStore = {
    get value() {
        return bottomPosition;
    },
    set: (v: number) => {
        bottomPosition = v;
    },
};

/**
 * visualViewportの監視を開始
 * コンポーネントの$effect内で呼び出す
 * @returns クリーンアップ関数
 */
export function setupViewportListener(): (() => void) | undefined {
    if (typeof window === "undefined" || !window.visualViewport) {
        return undefined;
    }

    let _rafId: number | null = null;

    function handleResize() {
        // throttle via requestAnimationFrame to avoid jank on iOS/Android
        if (_rafId) cancelAnimationFrame(_rafId);
        _rafId = requestAnimationFrame(() => {
            const viewport = window.visualViewport;
            if (!viewport) return;

            // visualViewport.offsetTop を考慮することで、キーボード表示時に
            // ビューがパン/スクロールしても正しいキーボード高さが得られる
            const visibleBottom = viewport.height + (viewport.offsetTop || 0);

            // キーボード高さはレイアウト（window.innerHeight）と可視領域の差分
            const calculatedKeyboardHeight = Math.max(0, window.innerHeight - visibleBottom);

            // キーボードが開いているかどうかを閾値で判定
            const isKeyboardOpen = calculatedKeyboardHeight > KEYBOARD_THRESHOLD;

            // キーボードが開いている時はキーボードの直上、閉じている時はフッターの直上
            // 閾値を設けて、PWAモードでの小さな差分を無視する
            bottomPosition = isKeyboardOpen ? calculatedKeyboardHeight : FOOTER_HEIGHT;

            // キーボード高さストアを更新（閾値以下は 0 として扱う）
            keyboardHeight = isKeyboardOpen ? calculatedKeyboardHeight : 0;

            syncLayoutCssVariables(isKeyboardOpen, viewport.height);
        });
    }

    // 初期値を設定
    handleResize();

    window.visualViewport.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("scroll", handleResize);

    return () => {
        window.visualViewport?.removeEventListener("resize", handleResize);
        window.visualViewport?.removeEventListener("scroll", handleResize);
        if (_rafId) cancelAnimationFrame(_rafId);
        _rafId = null;
    };
}
