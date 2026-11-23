/**
 * UI関連の共有ストア
 * キーボード追従などのレイアウト状態を管理
 */

import { untrack } from "svelte";
import {
    getComponentLocalKeyboardInset,
    getEffectiveViewportOffsetTop,
    getLayoutViewportHeight,
    isNonPwaAndroidChrome,
    isPwaAndroidChrome,
    isIPhoneSafari,
    measureKeyboardViewport,
} from "../lib/utils/viewportLayout";
import { createKeyboardTouchScrollLock } from "../lib/utils/keyboardTouchScrollLock";
import { isComposerInputFocusActive } from "../lib/utils/keyboardFocusUtils";
import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";

// --- 定数 ---
/** フッターの高さ（px） */
export const FOOTER_HEIGHT = 66;

/** キーボードボタンバーの高さ（px） */
export const KEYBOARD_BUTTON_BAR_HEIGHT = 50;

/** ReasonInput（Content Warning理由入力）の高さ（px） */
export const REASON_INPUT_HEIGHT = 50;

/** メインコンテンツ上部の余白（px） */
export const MAIN_CONTENT_TOP_SPACING = 6;

/**
 * キーボードの開閉時に、バーと理由欄をキーボードに付いてスライドさせる時間（ms）。
 * - 閉じる時: 即座に動かすと、まだ残っているキーボードの裏にバーが一瞬隠れてしまう。
 * - 開く時: エディタ領域を先に縮めるとバーとの間に隙間ができるため、スライドが終わるまで
 *   エディタ領域（とフッター）を閉じた時のレイアウトに保ち、バーがその上に重なって上がる。
 * 表示中のパン・高さ変化は即座に追従する。
 */
export const KEYBOARD_SLIDE_MS = 250;

const KEYBOARD_FOLLOW_INSTANT = "0ms";
const KEYBOARD_SLIDE = `${KEYBOARD_SLIDE_MS}ms`;

interface KeyboardFollowState {
    active: boolean;
    positions: string;
    duration: string;
}

const INITIAL_KEYBOARD_FOLLOW_STATE: KeyboardFollowState = {
    active: false,
    positions: "",
    duration: KEYBOARD_FOLLOW_INSTANT,
};

interface ViewportMetrics {
    height?: number;
    offsetTop?: number;
    usesKeyboardOverlay?: boolean;
    physicalKeyboardVisible?: boolean;
    physicalKeyboardHeight?: number;
    /** 計測済みの container inset。省略時は layout target から求める */
    containerKeyboardInset?: number;
    /**
     * 開く時にバーをスライドさせてよいか。setup 直後の最初の計測（既に開いている状態の
     * 復元）ではアニメーションさせない。
     */
    allowOpenSlide?: boolean;
}

let lastViewportHeight: number | undefined;
let lastViewportOffsetTop = 0;
let lastVisibleViewportBottom = 0;
let lastPhysicalKeyboardVisible = false;
let lastPhysicalKeyboardHeight = 0;
let lastUsesVirtualKeyboardGeometry = false;
let lastKeyboardFollow = INITIAL_KEYBOARD_FOLLOW_STATE;
/** 開く時のスライド中は、エディタ領域を縮めずに閉じた時のレイアウトを保つ */
let editorShrinkHeld = false;
let editorShrinkHoldTimer: ReturnType<typeof setTimeout> | null = null;
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

    const style = getAppRuntimeEnvironment().styleTarget.style;
    // Viewport syncs run on every caret move; skip writes that change nothing.
    if (style.getPropertyValue(name) === value) {
        return;
    }
    style.setProperty(name, value);
}

/**
 * 実行中に値が変わらない変数。styleTarget が切り替わる Web Component でも
 * 反映されるよう、import 時と setupViewportListener() の開始時に書く。
 */
function writeStaticLayoutVariables(): void {
    setRootStyleProperty("--app-root-top", "0px");
    setRootStyleProperty("--app-root-overflow-y", "visible");
    setRootStyleProperty("--app-body-position", "static");
    setRootStyleProperty("--app-body-inset", "auto");
    setRootStyleProperty("--app-body-width", "auto");
    setRootStyleProperty("--app-overscroll-behavior", "auto");
    setRootStyleProperty("--footer-height", `${FOOTER_HEIGHT}px`);
    setRootStyleProperty(
        "--reason-input-base-height",
        `${REASON_INPUT_HEIGHT}px`,
    );
}

function getFooterReservedHeight(
    isKeyboardOpen: boolean,
    hasFooter: boolean,
): number {
    return isKeyboardOpen || !hasFooter ? 0 : FOOTER_HEIGHT;
}

function getClosedLayoutBottom(): number {
    return layoutCapabilities.hasFooter ? FOOTER_HEIGHT : 0;
}

function getContainerKeyboardInset(
    isComposerKeyboardActive: boolean,
    visibleViewportBottom = lastVisibleViewportBottom,
): number {
    const runtimeEnvironment = getAppRuntimeEnvironment();
    if (
        !isComposerKeyboardActive ||
        runtimeEnvironment.layoutMode !== "container"
    ) {
        return 0;
    }

    const target = runtimeEnvironment.layoutTarget;
    if (typeof target.getBoundingClientRect !== "function") {
        return 0;
    }

    return getComponentLocalKeyboardInset(
        target.getBoundingClientRect(),
        visibleViewportBottom,
    );
}

function prefersReducedMotion(): boolean {
    return (
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches === true
    );
}

function releaseEditorShrinkHold(): void {
    if (editorShrinkHoldTimer !== null) {
        clearTimeout(editorShrinkHoldTimer);
        editorShrinkHoldTimer = null;
    }
    editorShrinkHeld = false;
}

function startEditorShrinkHold(): void {
    releaseEditorShrinkHold();
    editorShrinkHeld = true;
    editorShrinkHoldTimer = setTimeout(() => {
        editorShrinkHoldTimer = null;
        editorShrinkHeld = false;
        // バーが上がりきったので、エディタ領域をバーの上端まで縮める
        resyncLayoutCssVariables();
    }, KEYBOARD_SLIDE_MS);
}

/**
 * 開く時のエディタ領域の保持を開始・解除する。
 * 開く時のスライドを始めたかどうかを返す。
 */
function updateEditorShrinkHold(
    isComposerKeyboardActive: boolean,
    allowOpenSlide: boolean,
): boolean {
    if (!isComposerKeyboardActive) {
        releaseEditorShrinkHold();
        return false;
    }

    const isOpening = !lastKeyboardFollow.active;
    if (isOpening && allowOpenSlide && !prefersReducedMotion()) {
        startEditorShrinkHold();
        return true;
    }
    return false;
}

/**
 * バー・理由欄の transition 時間を決める。
 * - 閉じた、またはスライド付きで開いた: スライド
 * - それ以外で位置が変わった（スライドなしで開く・パン・高さ変化）: 即時
 * - 位置が変わらない同期: 前の値を維持（重複した同期でスライドを打ち消さない）
 */
function resolveKeyboardFollowDuration(
    isComposerKeyboardActive: boolean,
    positions: string,
    slidesOpen: boolean,
): string {
    let duration = lastKeyboardFollow.duration;
    if (
        (lastKeyboardFollow.active && !isComposerKeyboardActive) ||
        slidesOpen
    ) {
        duration = KEYBOARD_SLIDE;
    } else if (
        isComposerKeyboardActive !== lastKeyboardFollow.active ||
        positions !== lastKeyboardFollow.positions
    ) {
        duration = KEYBOARD_FOLLOW_INSTANT;
    }

    lastKeyboardFollow = {
        active: isComposerKeyboardActive,
        positions,
        duration,
    };
    return duration;
}

function syncLayoutCssVariables(
    isComposerKeyboardActive: boolean,
    viewportMetrics: ViewportMetrics = {},
): void {
    if (viewportMetrics.height !== undefined) {
        lastViewportHeight = viewportMetrics.height;
    }

    if (viewportMetrics.offsetTop !== undefined) {
        lastViewportOffsetTop = viewportMetrics.offsetTop;
    }

    if (viewportMetrics.physicalKeyboardVisible !== undefined) {
        lastPhysicalKeyboardVisible =
            viewportMetrics.physicalKeyboardVisible;
    }

    if (viewportMetrics.physicalKeyboardHeight !== undefined) {
        lastPhysicalKeyboardHeight = viewportMetrics.physicalKeyboardHeight;
    }

    if (viewportMetrics.usesKeyboardOverlay !== undefined) {
        lastUsesVirtualKeyboardGeometry = viewportMetrics.usesKeyboardOverlay;
    }

    const { layoutMode, runtimeKind } = getAppRuntimeEnvironment();
    const isContainerLayout = layoutMode === "container";
    const slidesOpen = updateEditorShrinkHold(
        isComposerKeyboardActive,
        viewportMetrics.allowOpenSlide === true,
    );
    // バー・理由欄はキーボードの状態どおりに置き、エディタ領域とフッターは
    // 開く時のスライドが終わるまで閉じた時のレイアウトを保つ
    const isEditorLayoutActive = isComposerKeyboardActive && !editorShrinkHeld;
    const footerReservedHeight = getFooterReservedHeight(
        isEditorLayoutActive,
        layoutCapabilities.hasFooter,
    );
    const usesKeyboardOverlay = viewportMetrics.usesKeyboardOverlay === true;
    const usesKeyboardViewportHeight =
        isComposerKeyboardActive &&
        !usesKeyboardOverlay &&
        lastViewportHeight !== undefined;
    const shouldUseKeyboardViewportHeight =
        isEditorLayoutActive && usesKeyboardViewportHeight;
    const anchorMainToKeyboard = !isContainerLayout && runtimeKind === "standalone" &&
        shouldUseKeyboardViewportHeight && isPwaAndroidChrome();
    const shouldUseKeyboardOverlay =
        isComposerKeyboardActive && usesKeyboardOverlay;
    const containerKeyboardInset =
        viewportMetrics.containerKeyboardInset ??
        getContainerKeyboardInset(isComposerKeyboardActive);
    const effectiveKeyboardInset = isContainerLayout
        ? containerKeyboardInset
        : bottomPosition;

    syncKeyboardTouchScrollLock(
        isContainerLayout
            ? isComposerKeyboardActive
            : usesKeyboardViewportHeight || shouldUseKeyboardOverlay,
    );

    const keyboardButtonBarHeight = layoutCapabilities.hasKeyboardButtonBar
        ? KEYBOARD_BUTTON_BAR_HEIGHT
        : 0;
    const barBottom = isComposerKeyboardActive
        ? effectiveKeyboardInset
        : getClosedLayoutBottom();
    const keyboardButtonBarBottom = `${barBottom}px`;
    const reasonInputBottom = `${barBottom + keyboardButtonBarHeight}px`;
    const footerBottom = !layoutCapabilities.hasFooter || isEditorLayoutActive
        ? `${-FOOTER_HEIGHT}px`
        : "0px";
    const keyboardFollowDuration = resolveKeyboardFollowDuration(
        isComposerKeyboardActive,
        `${keyboardButtonBarBottom}|${reasonInputBottom}`,
        slidesOpen,
    );

    setRootStyleProperty(
        "--app-root-height",
        isContainerLayout
            ? "100%"
            : shouldUseKeyboardViewportHeight
                ? `${lastViewportHeight}px`
                : "100%",
    );
    setRootStyleProperty(
        "--app-main-position",
        anchorMainToKeyboard ? "fixed" : "relative",
    );
    setRootStyleProperty(
        "--app-main-height",
        anchorMainToKeyboard
            ? "auto"
            : isContainerLayout
                ? "100%"
                : shouldUseKeyboardViewportHeight
                    ? `${lastViewportHeight}px`
                    : "100svh",
    );
    setRootStyleProperty(
        "--app-overlay-position",
        isContainerLayout ? "absolute" : "fixed",
    );
    setRootStyleProperty(
        "--keyboard-button-bar-height",
        `${keyboardButtonBarHeight}px`,
    );
    setRootStyleProperty(
        "--main-content-top-spacing",
        `${layoutCapabilities.hasHeader ? MAIN_CONTENT_TOP_SPACING : 0}px`,
    );
    setRootStyleProperty(
        "--composer-bottom-reserved-height",
        `${footerReservedHeight + keyboardButtonBarHeight}px`,
    );
    setRootStyleProperty(
        "--main-content-keyboard-adjustment",
        !isEditorLayoutActive
            ? "0px"
            : isContainerLayout
                ? `${containerKeyboardInset}px`
                : shouldUseKeyboardViewportHeight
                    ? "0px"
                    : `${keyboardHeight}px`,
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
    const visibleViewportHeight =
        lastViewportHeight === undefined
            ? undefined
            : Math.max(
                  0,
                  lastViewportHeight -
                      (usesKeyboardOverlay && lastPhysicalKeyboardVisible
                          ? lastPhysicalKeyboardHeight
                          : 0),
              );
    setRootStyleProperty(
        "--mobile-dialog-viewport-top",
        `${lastViewportOffsetTop}px`,
    );
    setRootStyleProperty(
        "--mobile-dialog-viewport-height",
        visibleViewportHeight === undefined
            ? "100dvh"
            : `${visibleViewportHeight}px`,
    );
    setRootStyleProperty(
        "--mobile-dialog-center-y",
        visibleViewportHeight === undefined
            ? "43dvh"
            : `${lastViewportOffsetTop + visibleViewportHeight * 0.43}px`,
    );
    // 位置と同じ同期で書き、同じ style 更新で transition の時間を確定させる
    setRootStyleProperty(
        "--keyboard-follow-duration",
        keyboardFollowDuration,
    );
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
        resyncLayoutCssVariables();
    },
};

/** 最後に観測した viewport の状態でレイアウト変数を書き直す */
function resyncLayoutCssVariables(): void {
    // 呼び出し元の effect が viewport 同期用の $state に依存し、
    // viewport 同期のたびに再実行されないよう追跡を外す
    untrack(() =>
        syncLayoutCssVariables(
            lastPhysicalKeyboardVisible && isComposerInputFocusActive(),
            { usesKeyboardOverlay: lastUsesVirtualKeyboardGeometry },
        ),
    );
}

// --- bottomPosition ストア ---
const layoutCapabilities = $state({
    hasHeader: true,
    hasFooter: true,
    hasKeyboardButtonBar: true,
});

let bottomPosition = $state(FOOTER_HEIGHT);

// --- keyboardHeight ストア ---
/** キーボードの高さ（px）。キーボードが閉じている時は 0 */
let keyboardHeight = $state(0);

writeStaticLayoutVariables();
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

interface VirtualKeyboardInfo {
    overlaysContent?: boolean;
    boundingRect?: DOMRectReadOnly;
    addEventListener?: (type: "geometrychange", listener: EventListener) => void;
    removeEventListener?: (type: "geometrychange", listener: EventListener) => void;
}

/**
 * visualViewportの監視を開始
 * コンポーネントの$effect内で呼び出す
 * @returns クリーンアップ関数
 */
export function setupViewportListener(
    capabilities: Partial<typeof layoutCapabilities> = {},
): (() => void) | undefined {
    layoutCapabilities.hasHeader = capabilities.hasHeader ?? true;
    layoutCapabilities.hasFooter = capabilities.hasFooter ?? true;
    layoutCapabilities.hasKeyboardButtonBar = capabilities.hasKeyboardButtonBar ?? true;
    bottomPosition = getClosedLayoutBottom();
    lastUsesVirtualKeyboardGeometry = false;
    lastKeyboardFollow = INITIAL_KEYBOARD_FOLLOW_STATE;
    releaseEditorShrinkHold();
    writeStaticLayoutVariables();
    syncLayoutCssVariables(false);

    if (typeof window === "undefined" || !window.visualViewport) {
        return undefined;
    }

    const isSafariViewportMode = isIPhoneSafari();
    const isContainerLayout =
        getAppRuntimeEnvironment().layoutMode === "container";
    const virtualKeyboard = (
        navigator as Navigator & { virtualKeyboard?: VirtualKeyboardInfo }
    ).virtualKeyboard;
    const canObserveVirtualKeyboardGeometry =
        isNonPwaAndroidChrome() &&
        virtualKeyboard?.boundingRect !== undefined &&
        typeof virtualKeyboard.addEventListener === "function" &&
        typeof virtualKeyboard.removeEventListener === "function";
    const managesVirtualKeyboardOverlay =
        !isContainerLayout && canObserveVirtualKeyboardGeometry;
    const previousOverlaysContent = managesVirtualKeyboardOverlay
        ? virtualKeyboard?.overlaysContent
        : undefined;

    if (managesVirtualKeyboardOverlay && virtualKeyboard) {
        virtualKeyboard.overlaysContent = true;
    }

    let _rafId: number | null = null;
    let hasMeasuredViewport = false;
    let removeContainerGeometryListeners: (() => void) | null = null;

    function stopContainerGeometryMonitoring(): void {
        removeContainerGeometryListeners?.();
        removeContainerGeometryListeners = null;
    }

    function syncContainerGeometryMonitoring(
        isComposerKeyboardActive: boolean,
    ): void {
        if (!isContainerLayout) {
            return;
        }

        if (!isComposerKeyboardActive) {
            stopContainerGeometryMonitoring();
            return;
        }

        if (removeContainerGeometryListeners) {
            return;
        }

        const handleContainerGeometryChange = () => scheduleViewportSync();
        if (!isSafariViewportMode) {
            window.addEventListener("scroll", handleContainerGeometryChange, {
                passive: true,
            });
        }

        let resizeObserver: ResizeObserver | undefined;
        const layoutTarget = getAppRuntimeEnvironment().layoutTarget;
        if (
            typeof ResizeObserver !== "undefined" &&
            typeof layoutTarget.getBoundingClientRect === "function"
        ) {
            resizeObserver = new ResizeObserver(handleContainerGeometryChange);
            resizeObserver.observe(layoutTarget);
        }

        removeContainerGeometryListeners = () => {
            if (!isSafariViewportMode) {
                window.removeEventListener(
                    "scroll",
                    handleContainerGeometryChange,
                );
            }
            resizeObserver?.disconnect();
        };
    }

    function syncViewport(): void {
        const viewport = window.visualViewport;
        if (!viewport) return;

        const viewportOffsetTop = isSafariViewportMode
            ? getEffectiveViewportOffsetTop(viewport)
            : (viewport.offsetTop ?? 0);
        const measurement = measureKeyboardViewport({
            viewportHeight: viewport.height,
            viewportWidth: viewport.width,
            viewportOffsetTop,
            layoutViewportHeight: isSafariViewportMode
                ? getLayoutViewportHeight()
                : window.innerHeight,
            safariViewportMode: isSafariViewportMode,
            virtualKeyboardRect: canObserveVirtualKeyboardGeometry
                ? virtualKeyboard?.boundingRect
                : undefined,
        });
        const isComposerKeyboardActive =
            measurement.isKeyboardOpen && isComposerInputFocusActive();

        lastVisibleViewportBottom = measurement.visibleViewportBottom;
        const containerKeyboardInset = getContainerKeyboardInset(
            isComposerKeyboardActive,
            measurement.visibleViewportBottom,
        );

        // キーボードが開いている時はキーボードの直上、閉じている時はフッターの直上
        bottomPosition = isComposerKeyboardActive
            ? isContainerLayout
                ? containerKeyboardInset
                : measurement.keyboardBottomInset
            : getClosedLayoutBottom();

        // キーボード高さストアを更新（閾値以下は 0 として扱う）
        keyboardHeight = isComposerKeyboardActive
            ? measurement.keyboardHeight
            : 0;

        syncLayoutCssVariables(isComposerKeyboardActive, {
            height: viewport.height,
            offsetTop: viewportOffsetTop,
            usesKeyboardOverlay: measurement.usesVirtualKeyboardGeometry,
            physicalKeyboardVisible: measurement.isKeyboardOpen,
            physicalKeyboardHeight: measurement.isKeyboardOpen
                ? measurement.keyboardHeight
                : 0,
            containerKeyboardInset,
            allowOpenSlide: hasMeasuredViewport,
        });
        hasMeasuredViewport = true;
        syncContainerGeometryMonitoring(isComposerKeyboardActive);
    }

    function scheduleViewportSync() {
        // throttle via requestAnimationFrame to avoid jank on iOS/Android
        if (_rafId) cancelAnimationFrame(_rafId);
        _rafId = requestAnimationFrame(syncViewport);
    }

    const handleViewportResize = () => scheduleViewportSync();
    const handleViewportScroll = () => scheduleViewportSync();
    const handleWindowResize = () => scheduleViewportSync();
    const handleWindowScroll = () => scheduleViewportSync();
    const handleVirtualKeyboardGeometryChange = () =>
        scheduleViewportSync();
    const handleDocumentFocusChange = () => scheduleViewportSync();
    const handleDocumentSelectionChange = () => scheduleViewportSync();

    // 初期値を設定
    scheduleViewportSync();

    window.visualViewport.addEventListener("resize", handleViewportResize);
    window.visualViewport.addEventListener("scroll", handleViewportScroll);
    document.addEventListener("focusin", handleDocumentFocusChange);
    document.addEventListener("focusout", handleDocumentFocusChange);
    document.addEventListener(
        "selectionchange",
        handleDocumentSelectionChange,
    );
    if (canObserveVirtualKeyboardGeometry) {
        virtualKeyboard?.addEventListener?.(
            "geometrychange",
            handleVirtualKeyboardGeometryChange,
        );
    }

    if (isSafariViewportMode) {
        window.addEventListener("resize", handleWindowResize);
        window.addEventListener("scroll", handleWindowScroll, { passive: true });
    }

    return () => {
        keyboardTouchScrollLock?.dispose();
        window.visualViewport?.removeEventListener("resize", handleViewportResize);
        window.visualViewport?.removeEventListener("scroll", handleViewportScroll);
        document.removeEventListener("focusin", handleDocumentFocusChange);
        document.removeEventListener("focusout", handleDocumentFocusChange);
        document.removeEventListener(
            "selectionchange",
            handleDocumentSelectionChange,
        );
        if (canObserveVirtualKeyboardGeometry) {
            virtualKeyboard?.removeEventListener?.(
                "geometrychange",
                handleVirtualKeyboardGeometryChange,
            );
        }
        if (
            managesVirtualKeyboardOverlay
            && virtualKeyboard
            && previousOverlaysContent !== undefined
        ) {
            virtualKeyboard.overlaysContent = previousOverlaysContent;
        }

        if (isSafariViewportMode) {
            window.removeEventListener("resize", handleWindowResize);
            window.removeEventListener("scroll", handleWindowScroll);
        }

        stopContainerGeometryMonitoring();
        releaseEditorShrinkHold();

        if (_rafId) cancelAnimationFrame(_rafId);
        _rafId = null;
    };
}
