/**
 * UI関連の共有ストア
 * キーボード追従などのレイアウト状態を管理
 */

import {
    getEffectiveViewportOffsetTop,
    getLayoutViewportHeight,
    getVirtualKeyboardLayoutInset,
    isNonPwaAndroidChrome,
    isNonPwaIPhoneSafari,
} from "../lib/utils/viewportLayout";
import { createKeyboardTouchScrollLock } from "../lib/utils/keyboardTouchScrollLock";

// --- 定数 ---
/** フッターの高さ（px） */
export const FOOTER_HEIGHT = 66;

/** キーボードボタンバーの高さ（px） */
export const KEYBOARD_BUTTON_BAR_HEIGHT = 50;

/** ReasonInput（Content Warning理由入力）の高さ（px） */
export const REASON_INPUT_HEIGHT = 50;

/** メインコンテンツ上部の余白（px） */
export const MAIN_CONTENT_TOP_SPACING = 6;

/** キーボードが開いていると判定する最小の高さ（px） */
const KEYBOARD_THRESHOLD = 100;

let lastViewportHeight: number | undefined;
let lastLayoutViewportHeight: number | undefined;
let debugSequence = 0;
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

function isVirtualKeyboardOverlayActive(): boolean {
    const virtualKeyboard = (
        navigator as Navigator & {
            virtualKeyboard?: { overlaysContent?: boolean };
        }
    ).virtualKeyboard;

    return isNonPwaAndroidChrome() && virtualKeyboard?.overlaysContent === true;
}

function getFooterReservedHeight(isKeyboardOpen: boolean): number {
    return isKeyboardOpen ? 0 : FOOTER_HEIGHT;
}

function syncLayoutCssVariables(
    isKeyboardVisible: boolean,
    viewportMetrics: {
        height?: number;
        offsetTop?: number;
        layoutViewportHeight?: number;
        usesKeyboardOverlay?: boolean;
    } = {},
): void {
    if (viewportMetrics.height !== undefined) {
        lastViewportHeight = viewportMetrics.height;
    }

    if (viewportMetrics.layoutViewportHeight !== undefined) {
        lastLayoutViewportHeight = viewportMetrics.layoutViewportHeight;
    }

    const footerReservedHeight = getFooterReservedHeight(isKeyboardVisible);
    const usesKeyboardOverlay = viewportMetrics.usesKeyboardOverlay === true;
    const shouldUseKeyboardViewportHeight =
        isKeyboardVisible &&
        !usesKeyboardOverlay &&
        lastViewportHeight !== undefined;
    const shouldUseKeyboardOverlay =
        isKeyboardVisible && usesKeyboardOverlay;

    syncKeyboardTouchScrollLock(
        shouldUseKeyboardViewportHeight || shouldUseKeyboardOverlay,
    );

    const keyboardButtonBarBottom = `${bottomPosition}px`;
    const reasonInputBottom = `${bottomPosition + KEYBOARD_BUTTON_BAR_HEIGHT}px`;
    const footerBottom = isKeyboardVisible
        ? `${-FOOTER_HEIGHT}px`
        : "0px";

    setRootStyleProperty(
        "--app-root-height",
        shouldUseKeyboardViewportHeight ? `${lastViewportHeight}px` : "100%",
    );
    setRootStyleProperty(
        "--app-root-top",
        "0px",
    );
    setRootStyleProperty(
        "--app-root-overflow-y",
        "visible",
    );
    setRootStyleProperty(
        "--app-main-height",
        shouldUseKeyboardViewportHeight ? `${lastViewportHeight}px` : "100svh",
    );
    setRootStyleProperty(
        "--app-body-position",
        "static",
    );
    setRootStyleProperty(
        "--app-body-inset",
        "auto",
    );
    setRootStyleProperty(
        "--app-body-width",
        "auto",
    );
    setRootStyleProperty(
        "--app-overlay-position",
        "fixed",
    );
    setRootStyleProperty(
        "--app-overscroll-behavior",
        "auto",
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
        shouldUseKeyboardViewportHeight ? "0px" : `${keyboardHeight}px`,
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
            { usesKeyboardOverlay: isVirtualKeyboardOverlayActive() },
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

interface ViewportDebugContext {
    viewport: VisualViewport;
    isSafariViewportMode: boolean;
    layoutViewportHeight: number;
    viewportOffsetTop: number;
    visibleBottom: number;
    calculatedKeyboardHeight: number;
    keyboardViewportReduction: number;
    virtualKeyboardRawHeight: number;
    virtualKeyboardLayoutInset: number;
    virtualKeyboardLegacyOriginCompensation: number;
    isKeyboardOpen: boolean;
    keyboardStoreHeight: number;
}

interface VirtualKeyboardDebugInfo {
    overlaysContent?: boolean;
    boundingRect?: DOMRectReadOnly;
    addEventListener?: (type: "geometrychange", listener: EventListener) => void;
    removeEventListener?: (type: "geometrychange", listener: EventListener) => void;
}

function logViewportDebugSnapshot(
    source: string,
    context: ViewportDebugContext,
    transition?: {
        type: string;
        propertyName: string;
        elapsedTime: number;
    },
): void {
    const {
        viewport,
        isSafariViewportMode,
        layoutViewportHeight,
        viewportOffsetTop,
        visibleBottom,
        calculatedKeyboardHeight,
        keyboardViewportReduction,
        virtualKeyboardRawHeight,
        virtualKeyboardLayoutInset,
        virtualKeyboardLegacyOriginCompensation,
        isKeyboardOpen,
        keyboardStoreHeight,
    } = context;
    const rootStyle = getComputedStyle(document.documentElement);
    const readElementLayout = (selector: string) => {
        const element = document.querySelector<HTMLElement>(selector);
        if (!element) return null;

        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const offsetParent = element.offsetParent;
        return {
            rect: {
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            },
            position: style.position,
            bottom: style.bottom,
            offsetParent: offsetParent
                ? `${offsetParent.tagName.toLowerCase()}${
                    offsetParent.id ? `#${offsetParent.id}` : ""
                }${
                    offsetParent instanceof HTMLElement && offsetParent.className
                        ? `.${String(offsetParent.className).trim().replace(/\s+/g, ".")}`
                        : ""
                }`
                : null,
        };
    };
    const barLayout = readElementLayout(".footer-button-bar");
    const visualViewportBottom = viewport.height + viewport.offsetTop;
    const virtualKeyboard = (
        navigator as Navigator & { virtualKeyboard?: VirtualKeyboardDebugInfo }
    ).virtualKeyboard;
    const virtualKeyboardRect = virtualKeyboard?.boundingRect;

    console.debug("[ViewportLayout Debug]", {
        sequence: ++debugSequence,
        timestamp: new Date().toISOString(),
        source,
        transition: transition ?? null,
        environment: {
            userAgent: navigator.userAgent,
            origin: window.location.origin,
            isSecureContext: window.isSecureContext === true,
            viewportMetaContent:
                document.querySelector<HTMLMetaElement>('meta[name="viewport"]')?.content ?? null,
            devicePixelRatio: window.devicePixelRatio,
            screen: {
                width: window.screen.width,
                height: window.screen.height,
                availWidth: window.screen.availWidth,
                availHeight: window.screen.availHeight,
            },
            displayModeStandalone:
                window.matchMedia?.("(display-mode: standalone)")?.matches === true,
            navigatorStandalone:
                (navigator as Navigator & { standalone?: boolean }).standalone === true,
            virtualKeyboard: virtualKeyboard
                ? {
                    supported: true,
                    overlaysContent: virtualKeyboard.overlaysContent ?? null,
                    boundingRect: virtualKeyboardRect
                        ? {
                            x: virtualKeyboardRect.x,
                            y: virtualKeyboardRect.y,
                            top: virtualKeyboardRect.top,
                            right: virtualKeyboardRect.right,
                            bottom: virtualKeyboardRect.bottom,
                            left: virtualKeyboardRect.left,
                            width: virtualKeyboardRect.width,
                            height: virtualKeyboardRect.height,
                        }
                        : null,
                }
                : { supported: false },
        },
        input: {
            windowInnerWidth: window.innerWidth,
            windowInnerHeight: window.innerHeight,
            windowOuterWidth: window.outerWidth,
            windowOuterHeight: window.outerHeight,
            windowScrollY: window.scrollY,
            documentClientHeight: document.documentElement.clientHeight,
            bodyClientHeight: document.body?.clientHeight ?? null,
            visualViewport: {
                width: viewport.width,
                height: viewport.height,
                offsetTop: viewport.offsetTop,
                offsetLeft: viewport.offsetLeft,
                pageTop: viewport.pageTop,
                pageLeft: viewport.pageLeft,
                scale: viewport.scale,
            },
        },
        calculation: {
            isSafariViewportMode,
            layoutViewportHeight,
            viewportOffsetTop,
            visibleBottom,
            visualViewportBottom,
            calculatedKeyboardHeight,
            keyboardViewportReduction,
            virtualKeyboardRawHeight,
            virtualKeyboardLayoutInset,
            virtualKeyboardLegacyOriginCompensation,
            isKeyboardOpen,
            keyboardStoreHeight,
        },
        state: {
            bottomPosition,
            keyboardHeight,
            lastViewportHeight,
            lastLayoutViewportHeight,
        },
        cssVariables: {
            appRootHeight: rootStyle.getPropertyValue("--app-root-height"),
            appMainHeight: rootStyle.getPropertyValue("--app-main-height"),
            appOverlayPosition: rootStyle.getPropertyValue("--app-overlay-position"),
            keyboardHeight: rootStyle.getPropertyValue("--keyboard-height"),
            keyboardButtonBarBottom: rootStyle.getPropertyValue(
                "--keyboard-button-bar-bottom",
            ),
            mainContentKeyboardAdjustment: rootStyle.getPropertyValue(
                "--main-content-keyboard-adjustment",
            ),
            footerBottom: rootStyle.getPropertyValue("--footer-bottom"),
        },
        layout: {
            html: readElementLayout("html"),
            body: readElementLayout("body"),
            app: readElementLayout("#app"),
            main: readElementLayout("main"),
            footerButtonBar: barLayout,
            footerBar: readElementLayout(".footer-bar"),
            reasonInput: readElementLayout(".reason-input-container"),
            barGapToVisualViewportBottom:
                barLayout === null
                    ? null
                    : visualViewportBottom - barLayout.rect.bottom,
        },
        focus: {
            tagName: document.activeElement?.tagName ?? null,
            id: document.activeElement?.id ?? null,
            className:
                document.activeElement instanceof HTMLElement
                    ? document.activeElement.className
                    : null,
        },
    });
}

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
    const virtualKeyboard = (
        navigator as Navigator & { virtualKeyboard?: VirtualKeyboardDebugInfo }
    ).virtualKeyboard;
    const usesKeyboardOverlay =
        isNonPwaAndroidChrome() &&
        virtualKeyboard?.boundingRect !== undefined &&
        typeof virtualKeyboard.addEventListener === "function" &&
        typeof virtualKeyboard.removeEventListener === "function";
    const previousOverlaysContent = virtualKeyboard?.overlaysContent;

    if (usesKeyboardOverlay && virtualKeyboard) {
        virtualKeyboard.overlaysContent = true;
    }

    let _rafId: number | null = null;
    let lastDebugContext: ViewportDebugContext | null = null;

    function scheduleViewportSync(source: string) {
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
            const virtualKeyboardRect = virtualKeyboard?.boundingRect;
            const virtualKeyboardRawHeight = usesKeyboardOverlay
                ? Math.max(0, virtualKeyboardRect?.height ?? 0)
                : 0;
            const virtualKeyboardInsetResult =
                usesKeyboardOverlay && virtualKeyboardRect
                    ? getVirtualKeyboardLayoutInset(
                        virtualKeyboardRect,
                        viewport.width,
                        layoutViewportHeight,
                    )
                    : { inset: 0, legacyOriginCompensation: 0 };
            const virtualKeyboardLayoutInset = virtualKeyboardInsetResult.inset;
            const isKeyboardOpen = usesKeyboardOverlay
                ? virtualKeyboardLayoutInset > KEYBOARD_THRESHOLD
                : isSafariViewportMode
                    ? keyboardViewportReduction > KEYBOARD_THRESHOLD
                    : calculatedKeyboardHeight > KEYBOARD_THRESHOLD;
            const keyboardStoreHeight = usesKeyboardOverlay
                ? virtualKeyboardLayoutInset
                : isSafariViewportMode
                    ? keyboardViewportReduction
                    : calculatedKeyboardHeight;

            // キーボードが開いている時はキーボードの直上、閉じている時はフッターの直上
            // 閾値を設けて、PWAモードでの小さな差分を無視する
            bottomPosition = isKeyboardOpen
                ? usesKeyboardOverlay
                    ? virtualKeyboardLayoutInset
                    : calculatedKeyboardHeight
                : FOOTER_HEIGHT;

            // キーボード高さストアを更新（閾値以下は 0 として扱う）
            keyboardHeight = isKeyboardOpen ? keyboardStoreHeight : 0;

            syncLayoutCssVariables(isKeyboardOpen, {
                height: viewport.height,
                offsetTop: isSafariViewportMode ? viewportOffsetTop : 0,
                layoutViewportHeight: isSafariViewportMode
                    ? layoutViewportHeight
                    : undefined,
                usesKeyboardOverlay,
            });

            lastDebugContext = {
                viewport,
                isSafariViewportMode,
                layoutViewportHeight,
                viewportOffsetTop,
                visibleBottom,
                calculatedKeyboardHeight,
                keyboardViewportReduction,
                virtualKeyboardRawHeight,
                virtualKeyboardLayoutInset,
                virtualKeyboardLegacyOriginCompensation:
                    virtualKeyboardInsetResult.legacyOriginCompensation,
                isKeyboardOpen,
                keyboardStoreHeight,
            };
            logViewportDebugSnapshot(source, lastDebugContext);
        });
    }

    const handleViewportResize = () => scheduleViewportSync("visualViewport.resize");
    const handleViewportScroll = () => scheduleViewportSync("visualViewport.scroll");
    const handleWindowResize = () => scheduleViewportSync("window.resize");
    const handleWindowScroll = () => scheduleViewportSync("window.scroll");
    const handleVirtualKeyboardGeometryChange = () =>
        scheduleViewportSync("virtualKeyboard.geometrychange");
    const handleLayoutTransition = (event: TransitionEvent) => {
        if (event.propertyName !== "bottom" || !lastDebugContext) {
            return;
        }

        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        const targetName = target.matches(".footer-button-bar")
            ? "footer-button-bar"
            : target.matches(".footer-bar")
                ? "footer-bar"
                : target.matches(".reason-input-container")
                    ? "reason-input"
                    : null;
        if (!targetName) return;

        logViewportDebugSnapshot(
            `${targetName}.${event.type}`,
            lastDebugContext,
            {
                type: event.type,
                propertyName: event.propertyName,
                elapsedTime: event.elapsedTime,
            },
        );
    };

    // 初期値を設定
    scheduleViewportSync("initial");

    window.visualViewport.addEventListener("resize", handleViewportResize);
    window.visualViewport.addEventListener("scroll", handleViewportScroll);
    if (usesKeyboardOverlay) {
        virtualKeyboard?.addEventListener?.(
            "geometrychange",
            handleVirtualKeyboardGeometryChange,
        );
    }
    document.addEventListener("transitionrun", handleLayoutTransition, true);
    document.addEventListener("transitioncancel", handleLayoutTransition, true);
    document.addEventListener("transitionend", handleLayoutTransition, true);

    if (isSafariViewportMode) {
        window.addEventListener("resize", handleWindowResize);
        window.addEventListener("scroll", handleWindowScroll, { passive: true });
    }

    return () => {
        keyboardTouchScrollLock?.dispose();
        window.visualViewport?.removeEventListener("resize", handleViewportResize);
        window.visualViewport?.removeEventListener("scroll", handleViewportScroll);
        if (usesKeyboardOverlay) {
            virtualKeyboard?.removeEventListener?.(
                "geometrychange",
                handleVirtualKeyboardGeometryChange,
            );
            if (virtualKeyboard && previousOverlaysContent !== undefined) {
                virtualKeyboard.overlaysContent = previousOverlaysContent;
            }
        }
        document.removeEventListener("transitionrun", handleLayoutTransition, true);
        document.removeEventListener("transitioncancel", handleLayoutTransition, true);
        document.removeEventListener("transitionend", handleLayoutTransition, true);

        if (isSafariViewportMode) {
            window.removeEventListener("resize", handleWindowResize);
            window.removeEventListener("scroll", handleWindowScroll);
        }

        if (_rafId) cancelAnimationFrame(_rafId);
        _rafId = null;
    };
}
