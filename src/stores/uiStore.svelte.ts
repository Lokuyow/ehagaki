/**
 * UI関連の共有ストア
 * キーボード追従などのレイアウト状態を管理
 */

import { createKeyboardTouchScrollLock } from "../lib/utils/keyboardTouchScrollLock";
import {
    getEffectiveViewportOffsetTop,
    getLayoutViewportHeight,
    isNonPwaIPhoneSafari,
} from "../lib/utils/viewportLayout";

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

let lastViewportHeight: number | undefined;
let lastViewportOffsetTop = 0;
let lastLayoutViewportHeight: number | undefined;
const keyboardTouchScrollLock =
    typeof document === "undefined"
        ? null
        : createKeyboardTouchScrollLock(document);

function syncKeyboardTouchScrollLock(shouldLock: boolean): void {
    keyboardTouchScrollLock?.sync(shouldLock);
}

function setRootStyleProperty(name: string, value: string): void {
    if (typeof document === "undefined") {
        return;
    }

    document.documentElement.style.setProperty(name, value);
}

function getFooterReservedHeight(isKeyboardOpen: boolean): number {
    return isKeyboardOpen ? 0 : FOOTER_HEIGHT;
}

function shouldLockAppRootForKeyboard(isKeyboardVisible: boolean): boolean {
    return isKeyboardVisible && lastViewportHeight !== undefined;
}

function syncLayoutCssVariables(
    isKeyboardVisible: boolean,
    viewportMetrics: {
        height?: number;
        offsetTop?: number;
        layoutViewportHeight?: number;
    } = {},
): void {
    if (viewportMetrics.height !== undefined) {
        lastViewportHeight = viewportMetrics.height;
    }

    if (viewportMetrics.offsetTop !== undefined) {
        lastViewportOffsetTop = viewportMetrics.offsetTop;
    }

    if (viewportMetrics.layoutViewportHeight !== undefined) {
        lastLayoutViewportHeight = viewportMetrics.layoutViewportHeight;
    }

    const footerReservedHeight = getFooterReservedHeight(isKeyboardVisible);
    const isSafariViewportMode = isNonPwaIPhoneSafari();
    const shouldLockAppRoot = shouldLockAppRootForKeyboard(isKeyboardVisible);

    syncKeyboardTouchScrollLock(shouldLockAppRoot && isSafariViewportMode);
    const keyboardButtonBarBottom = shouldLockAppRoot
        ? "0px"
        : `${bottomPosition}px`;
    const reasonInputBottom = shouldLockAppRoot
        ? `${KEYBOARD_BUTTON_BAR_HEIGHT}px`
        : `${bottomPosition + KEYBOARD_BUTTON_BAR_HEIGHT}px`;
    const footerBottom = shouldLockAppRoot
        ? `${-FOOTER_HEIGHT}px`
        : "0px";

    setRootStyleProperty(
        "--app-root-height",
        shouldLockAppRoot ? `${lastViewportHeight}px` : "100%",
    );
    setRootStyleProperty(
        "--app-root-top",
        shouldLockAppRoot ? `${lastViewportOffsetTop}px` : "0px",
    );
    setRootStyleProperty(
        "--app-root-overflow-y",
        shouldLockAppRoot ? "hidden" : "visible",
    );
    setRootStyleProperty(
        "--app-main-height",
        shouldLockAppRoot ? `${lastViewportHeight}px` : "100svh",
    );
    setRootStyleProperty(
        "--app-body-position",
        shouldLockAppRoot ? "fixed" : "static",
    );
    setRootStyleProperty(
        "--app-body-inset",
        shouldLockAppRoot ? "0" : "auto",
    );
    setRootStyleProperty(
        "--app-body-width",
        shouldLockAppRoot ? "100%" : "auto",
    );
    setRootStyleProperty(
        "--app-overlay-position",
        shouldLockAppRoot ? "absolute" : "fixed",
    );
    setRootStyleProperty(
        "--app-overscroll-behavior",
        shouldLockAppRoot ? "none" : "auto",
    );
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
        "--composer-bottom-reserved-height",
        `${footerReservedHeight + KEYBOARD_BUTTON_BAR_HEIGHT}px`,
    );
    setRootStyleProperty(
        "--main-content-keyboard-adjustment",
        shouldLockAppRoot ? "0px" : `${keyboardHeight}px`,
    );
    setRootStyleProperty("--footer-bottom", footerBottom);
    setRootStyleProperty(
        "--reason-input-height",
        reasonInputVisible ? `${REASON_INPUT_HEIGHT}px` : "0px",
    );
    setRootStyleProperty(
        "--reason-input-bottom",
        reasonInputBottom,
    );
    setRootStyleProperty("--keyboard-height", `${keyboardHeight}px`);
    setRootStyleProperty(
        "--keyboard-button-bar-bottom",
        keyboardButtonBarBottom,
    );
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
        const isSafariViewportMode = isNonPwaIPhoneSafari();
        const isSafariKeyboardViewportReduced =
            (lastLayoutViewportHeight ?? 0) - (lastViewportHeight ?? 0) >
            KEYBOARD_THRESHOLD;

        syncLayoutCssVariables(
            keyboardHeight > 0 ||
            (isSafariViewportMode && isSafariKeyboardViewportReduced),
        );
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

    const isSafariViewportMode = isNonPwaIPhoneSafari();
    let _rafId: number | null = null;

    function scheduleViewportSync() {
        // throttle via requestAnimationFrame to avoid jank on iOS/Android
        if (_rafId) cancelAnimationFrame(_rafId);
        _rafId = requestAnimationFrame(() => {
            const viewport = window.visualViewport;
            if (!viewport) return;

            const layoutViewportHeight = isSafariViewportMode
                ? getLayoutViewportHeight()
                : window.innerHeight;
            const viewportOffsetTop = isSafariViewportMode
                ? getEffectiveViewportOffsetTop(viewport)
                : (viewport.offsetTop ?? 0);

            // visualViewport.offsetTop を考慮することで、キーボード表示時に
            // ビューがパン/スクロールしても正しいキーボード高さが得られる
            const visibleBottom = viewport.height + viewportOffsetTop;

            // キーボード直上へ固定バーを置くための bottom gap
            const calculatedKeyboardHeight = Math.max(
                0,
                layoutViewportHeight - visibleBottom,
            );

            // Safari の自動パンで visibleBottom が layout viewport の下端へ近づいても、
            // viewport 自体が十分縮んでいればキーボード表示状態は継続している。
            const keyboardViewportReduction = Math.max(
                0,
                layoutViewportHeight - viewport.height,
            );

            // キーボードが開いているかどうかを閾値で判定
            const isKeyboardOpen = isSafariViewportMode
                ? keyboardViewportReduction > KEYBOARD_THRESHOLD
                : calculatedKeyboardHeight > KEYBOARD_THRESHOLD;
            const keyboardStoreHeight = isSafariViewportMode
                ? keyboardViewportReduction
                : calculatedKeyboardHeight;

            // キーボードが開いている時はキーボードの直上、閉じている時はフッターの直上
            // 閾値を設けて、PWAモードでの小さな差分を無視する
            bottomPosition = isKeyboardOpen ? calculatedKeyboardHeight : FOOTER_HEIGHT;

            // キーボード高さストアを更新（閾値以下は 0 として扱う）
            keyboardHeight = isKeyboardOpen ? keyboardStoreHeight : 0;

            syncLayoutCssVariables(isKeyboardOpen, {
                height: viewport.height,
                offsetTop: isSafariViewportMode ? viewportOffsetTop : 0,
                layoutViewportHeight: isSafariViewportMode
                    ? layoutViewportHeight
                    : undefined,
            });
        });
    }

    const handleViewportResize = () => scheduleViewportSync();
    const handleViewportScroll = () => scheduleViewportSync();
    const handleWindowResize = () => scheduleViewportSync();
    const handleWindowScroll = () => scheduleViewportSync();

    // 初期値を設定
    scheduleViewportSync();

    window.visualViewport.addEventListener("resize", handleViewportResize);
    window.visualViewport.addEventListener("scroll", handleViewportScroll);

    if (isSafariViewportMode) {
        window.addEventListener("resize", handleWindowResize);
        window.addEventListener("scroll", handleWindowScroll, { passive: true });
    }

    return () => {
        keyboardTouchScrollLock?.dispose();
        window.visualViewport?.removeEventListener("resize", handleViewportResize);
        window.visualViewport?.removeEventListener("scroll", handleViewportScroll);

        if (isSafariViewportMode) {
            window.removeEventListener("resize", handleWindowResize);
            window.removeEventListener("scroll", handleWindowScroll);
        }

        if (_rafId) cancelAnimationFrame(_rafId);
        _rafId = null;
    };
}
