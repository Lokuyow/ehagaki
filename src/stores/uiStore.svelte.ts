/**
 * UI関連の共有ストア
 * キーボード追従などのレイアウト状態を管理
 */

// --- 定数 ---
/** フッターの高さ（px） */
export const FOOTER_HEIGHT = 66;

/** キーボードボタンバーの高さ（px） */
export const KEYBOARD_BUTTON_BAR_HEIGHT = 50;

/** キーボードが開いていると判定する最小の高さ（px） */
const KEYBOARD_THRESHOLD = 100;

// --- bottomPosition ストア ---
let bottomPosition = $state(FOOTER_HEIGHT);

// --- keyboardHeight ストア ---
/** キーボードの高さ（px）。キーボードが閉じている時は 0 */
let keyboardHeight = $state(0);

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

            // CSS 変数を更新（エディターの高さ調整に使用）
            const root = document.documentElement;
            root.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
            root.style.setProperty('--visible-viewport-height', `${viewport.height}px`);
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
