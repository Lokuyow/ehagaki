import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    getComponentLocalKeyboardInset,
    getEffectiveViewportOffsetTop,
    getLayoutViewportHeight,
    getVirtualKeyboardLayoutInset,
    isNonPwaAndroidChrome,
    isPwaAndroidChrome,
    isIPhoneSafari,
    KEYBOARD_OPEN_THRESHOLD,
    measureKeyboardViewport,
} from '../../lib/utils/viewportLayout';

function setUserAgent(userAgent: string) {
    Object.defineProperty(navigator, 'userAgent', {
        configurable: true,
        value: userAgent,
    });
}

describe('viewportLayout', () => {
    beforeEach(() => {
        vi.restoreAllMocks();

        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 800,
        });
        Object.defineProperty(window, 'scrollY', {
            configurable: true,
            value: 0,
        });
        Object.defineProperty(document.documentElement, 'clientHeight', {
            configurable: true,
            value: 780,
        });
        Object.defineProperty(document.documentElement, 'scrollTop', {
            configurable: true,
            value: 0,
        });
        Object.defineProperty(document, 'scrollingElement', {
            configurable: true,
            value: document.documentElement,
        });
        Object.defineProperty(window, 'visualViewport', {
            configurable: true,
            value: { height: 640, offsetTop: 24, pageTop: 12 },
        });
        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: query === '(display-mode: standalone)' ? false : false,
            })),
        });
        Object.defineProperty(navigator, 'standalone', {
            configurable: true,
            value: false,
        });
    });

    it('layout viewport height は利用可能な最大値を返す', () => {
        expect(getLayoutViewportHeight()).toBe(800);
    });

    it('effective offset top は scroll と viewport の最大値を採用する', () => {
        Object.defineProperty(window, 'scrollY', {
            configurable: true,
            value: 56,
        });
        Object.defineProperty(document.documentElement, 'scrollTop', {
            configurable: true,
            value: 40,
        });

        expect(getEffectiveViewportOffsetTop(window.visualViewport)).toBe(56);
    });

    it('iPhone Safari は standalone を含めて true にする', () => {
        setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1');
        expect(isIPhoneSafari()).toBe(true);

        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: query === '(display-mode: standalone)',
            })),
        });
        expect(isIPhoneSafari()).toBe(true);

        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            value: vi.fn().mockReturnValue({ matches: false }),
        });
        Object.defineProperty(navigator, 'standalone', {
            configurable: true,
            value: true,
        });
        expect(isIPhoneSafari()).toBe(true);

        setUserAgent('Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36');
        expect(isIPhoneSafari()).toBe(false);
    });

    it('Android Chrome の通常タブとインストール済み PWA を区別する', () => {
        setUserAgent('Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36');
        expect(isNonPwaAndroidChrome()).toBe(true);
        expect(isPwaAndroidChrome()).toBe(false);

        setUserAgent('Mozilla/5.0 (Linux; Android 15; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36');
        expect(isNonPwaAndroidChrome()).toBe(false);

        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            value: vi.fn().mockReturnValue({ matches: true }),
        });
        expect(isPwaAndroidChrome()).toBe(false);
        setUserAgent('Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36');
        expect(isNonPwaAndroidChrome()).toBe(false);
        expect(isPwaAndroidChrome()).toBe(true);
    });

    it('正常な VirtualKeyboard 矩形では高さをそのままレイアウト inset にする', () => {
        expect(getVirtualKeyboardLayoutInset(
            { top: 481, bottom: 732, width: 411, height: 251 },
            411,
            732,
        )).toBe(251);
    });

    it('旧Chromeの visible frame 原点を含む矩形では top を除外する', () => {
        expect(getVirtualKeyboardLayoutInset(
            { top: 40, bottom: 291, width: 411, height: 251 },
            411,
            732,
        )).toBe(211);
    });

    describe('measureKeyboardViewport', () => {
        const base = {
            viewportWidth: 411,
            viewportOffsetTop: 0,
            layoutViewportHeight: 800,
            safariViewportMode: false,
        };

        it('visual viewport の縮小からキーボード高さと bottom inset を求める', () => {
            expect(measureKeyboardViewport({ ...base, viewportHeight: 500 })).toEqual({
                isKeyboardOpen: true,
                keyboardHeight: 300,
                keyboardBottomInset: 300,
                visibleViewportBottom: 500,
                usesVirtualKeyboardGeometry: false,
            });
        });

        it('閾値以下の差分ではキーボードを開いていると判定しない', () => {
            expect(measureKeyboardViewport({ ...base, viewportHeight: 700 }).isKeyboardOpen).toBe(false);
            expect(measureKeyboardViewport({ ...base, viewportHeight: 699 }).isKeyboardOpen).toBe(true);
            expect(KEYBOARD_OPEN_THRESHOLD).toBe(100);
        });

        it('VirtualKeyboard 矩形があれば visual viewport より優先し、旧原点を補正する', () => {
            expect(measureKeyboardViewport({
                ...base,
                viewportHeight: 800,
                layoutViewportHeight: 732,
                virtualKeyboardRect: { top: 40, bottom: 291, width: 411, height: 251 },
            })).toEqual({
                isKeyboardOpen: true,
                keyboardHeight: 211,
                keyboardBottomInset: 211,
                visibleViewportBottom: 521,
                usesVirtualKeyboardGeometry: true,
            });
        });

        it('高さ 0 の VirtualKeyboard 矩形は visual viewport の計測へフォールバックする', () => {
            const measurement = measureKeyboardViewport({
                ...base,
                viewportHeight: 500,
                virtualKeyboardRect: { top: 800, bottom: 800, width: 411, height: 0 },
            });
            expect(measurement.usesVirtualKeyboardGeometry).toBe(false);
            expect(measurement.keyboardHeight).toBe(300);
        });

        it('Safari の auto-pan 後もキーボード高さは保ち、bottom inset だけ縮める', () => {
            expect(measureKeyboardViewport({
                ...base,
                safariViewportMode: true,
                layoutViewportHeight: 549,
                viewportHeight: 314,
                viewportOffsetTop: 231,
            })).toEqual({
                isKeyboardOpen: true,
                keyboardHeight: 235,
                keyboardBottomInset: 4,
                visibleViewportBottom: 545,
                usesVirtualKeyboardGeometry: false,
            });
        });
    });

    it('component-local keyboard inset は重なりだけを返し、component 高さへ clamp する', () => {
        expect(
            getComponentLocalKeyboardInset(
                { bottom: 700, height: 600 },
                500,
            ),
        ).toBe(200);
        expect(
            getComponentLocalKeyboardInset(
                { bottom: 480, height: 600 },
                500,
            ),
        ).toBe(0);
        expect(
            getComponentLocalKeyboardInset(
                { bottom: 1400, height: 600 },
                500,
            ),
        ).toBe(600);
    });
});
