export function getLayoutViewportHeight(): number {
    if (typeof window === "undefined") {
        return 0;
    }

    return Math.max(
        document.documentElement?.clientHeight ?? 0,
        window.innerHeight,
        window.visualViewport?.height ?? 0,
    );
}

export function getEffectiveViewportOffsetTop(
    viewport?: VisualViewport | null,
): number {
    if (typeof window === "undefined") {
        return 0;
    }

    return Math.max(
        viewport?.offsetTop ?? 0,
        viewport?.pageTop ?? 0,
        window.scrollY,
        document.documentElement?.scrollTop ?? 0,
        document.scrollingElement?.scrollTop ?? 0,
    );
}

export function isIPhoneSafari(): boolean {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return false;
    }

    const userAgent = navigator.userAgent;
    const isIPhone = /iPhone/i.test(userAgent);
    const isWebKit = /WebKit/i.test(userAgent);
    const isCriOS = /CriOS/i.test(userAgent);
    const isFxiOS = /FxiOS/i.test(userAgent);
    const isEdgiOS = /EdgiOS/i.test(userAgent);
    return isIPhone && isWebKit && !isCriOS && !isFxiOS && !isEdgiOS;
}

function isAndroidChrome(): boolean {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return false;
    }

    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isChrome = /Chrome\/[\d.]+/i.test(userAgent);
    const isOtherChromiumBrowser =
        /(?:EdgA|OPR|SamsungBrowser)\/[\d.]+/i.test(userAgent) ||
        /; wv\)/i.test(userAgent);
    return isAndroid && isChrome && !isOtherChromiumBrowser;
}

function isStandaloneDisplayMode(): boolean {
    return (
        window.matchMedia?.("(display-mode: standalone)")?.matches === true ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true
    );
}

export function isNonPwaAndroidChrome(): boolean {
    return isAndroidChrome() && !isStandaloneDisplayMode();
}

export function isPwaAndroidChrome(): boolean {
    return isAndroidChrome() && isStandaloneDisplayMode();
}

export function getVirtualKeyboardLayoutInset(
    rect: Pick<DOMRectReadOnly, "top" | "bottom" | "width" | "height">,
    layoutViewportWidth: number,
    layoutViewportHeight: number,
): number {
    const height = Math.max(0, rect.height);
    const top = Math.max(0, rect.top);
    const spansViewportWidth =
        layoutViewportWidth > 0 && rect.width >= layoutViewportWidth - 1;
    const usesLegacyVisibleFrameOrigin =
        height > 0 &&
        top > 0 &&
        spansViewportWidth &&
        rect.bottom < layoutViewportHeight - 1;
    const legacyOriginCompensation = usesLegacyVisibleFrameOrigin
        ? Math.min(top, height)
        : 0;

    return height - legacyOriginCompensation;
}

/** キーボードが開いていると判定する最小の高さ（px） */
export const KEYBOARD_OPEN_THRESHOLD = 100;

export interface KeyboardViewportInput {
    viewportHeight: number;
    viewportWidth: number;
    /** Safari では scroll 量も含めた実効 offsetTop を渡す */
    viewportOffsetTop: number;
    layoutViewportHeight: number;
    safariViewportMode: boolean;
    /** VirtualKeyboard の geometry を観測できるときだけ渡す */
    virtualKeyboardRect?: Pick<
        DOMRectReadOnly,
        "top" | "bottom" | "width" | "height"
    > | null;
}

export interface KeyboardViewportMeasurement {
    /** 物理キーボードが開いているか（focus とは無関係） */
    isKeyboardOpen: boolean;
    /** キーボード高さとして公開する値 */
    keyboardHeight: number;
    /** viewport mode で固定バーをキーボード直上へ置くための bottom inset */
    keyboardBottomInset: number;
    /** 可視領域の下端（layout viewport 座標） */
    visibleViewportBottom: number;
    usesVirtualKeyboardGeometry: boolean;
}

/**
 * Viewport / VirtualKeyboard の観測値からキーボードの状態を求める。
 * DOM を読まない pure 関数で、観測値の読み取りは呼び出し側が担当する。
 */
export function measureKeyboardViewport(
    input: KeyboardViewportInput,
): KeyboardViewportMeasurement {
    const {
        viewportHeight,
        viewportWidth,
        viewportOffsetTop,
        layoutViewportHeight,
        safariViewportMode,
        virtualKeyboardRect,
    } = input;

    // visualViewport.offsetTop を考慮することで、キーボード表示時に
    // ビューがパン/スクロールしても正しいキーボード高さが得られる
    const visibleBottom = viewportHeight + viewportOffsetTop;

    // キーボード直上へ固定バーを置くための bottom gap
    const calculatedKeyboardHeight = Math.max(
        0,
        layoutViewportHeight - visibleBottom,
    );

    // Safari の自動パンで visibleBottom が layout viewport の下端へ近づいても、
    // viewport 自体が十分縮んでいればキーボード表示状態は継続している。
    const keyboardViewportReduction = Math.max(
        0,
        layoutViewportHeight - viewportHeight,
    );

    const virtualKeyboardLayoutInset = virtualKeyboardRect
        ? getVirtualKeyboardLayoutInset(
            virtualKeyboardRect,
            viewportWidth,
            layoutViewportHeight,
        )
        : 0;
    const usesVirtualKeyboardGeometry = virtualKeyboardLayoutInset > 0;

    const keyboardHeight = usesVirtualKeyboardGeometry
        ? virtualKeyboardLayoutInset
        : safariViewportMode
            ? keyboardViewportReduction
            : calculatedKeyboardHeight;

    return {
        isKeyboardOpen: keyboardHeight > KEYBOARD_OPEN_THRESHOLD,
        keyboardHeight,
        keyboardBottomInset: usesVirtualKeyboardGeometry
            ? virtualKeyboardLayoutInset
            : calculatedKeyboardHeight,
        visibleViewportBottom: usesVirtualKeyboardGeometry
            ? layoutViewportHeight - virtualKeyboardLayoutInset
            : visibleBottom,
        usesVirtualKeyboardGeometry,
    };
}

/**
 * Returns the part of a bounded layout target that is covered below the
 * visible viewport. The result is expressed in the target's local
 * coordinate system so it can be used as an `absolute` bottom inset.
 */
export function getComponentLocalKeyboardInset(
    targetRect: Pick<DOMRectReadOnly, "bottom" | "height">,
    visibleViewportBottom: number,
): number {
    const targetHeight = Math.max(0, targetRect.height);
    const coveredHeight = Math.max(
        0,
        targetRect.bottom - visibleViewportBottom,
    );

    return Math.min(targetHeight, coveredHeight);
}
