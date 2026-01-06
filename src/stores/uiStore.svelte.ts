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

    function handleResize() {
        const viewport = window.visualViewport;
        if (!viewport) return;

        // キーボードが開いている場合、viewportの高さが変わる
        const keyboardHeight = window.innerHeight - viewport.height;

        // キーボードが開いている時はキーボードの直上、閉じている時はフッターの直上
        // 閾値を設けて、PWAモードでの小さな差分を無視する
        bottomPosition =
            keyboardHeight > KEYBOARD_THRESHOLD ? keyboardHeight : FOOTER_HEIGHT;
    }

    // 初期値を設定
    handleResize();

    window.visualViewport.addEventListener("resize", handleResize);
    window.visualViewport.addEventListener("scroll", handleResize);

    return () => {
        window.visualViewport?.removeEventListener("resize", handleResize);
        window.visualViewport?.removeEventListener("scroll", handleResize);
    };
}
