import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    getEffectiveViewportOffsetTop,
    getLayoutViewportHeight,
    isNonPwaIPhoneSafari,
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

    it('非PWA iPhone Safari だけを true にする', () => {
        setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1');
        expect(isNonPwaIPhoneSafari()).toBe(true);

        setUserAgent('Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36');
        expect(isNonPwaIPhoneSafari()).toBe(false);
    });
});