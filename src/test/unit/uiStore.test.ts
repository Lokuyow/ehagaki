import { beforeEach, describe, expect, it, vi } from 'vitest';

type ViewportListener = () => void;

function createMatchMediaMock(displayModeStandalone = false) {
    return vi.fn().mockImplementation((query: string) => ({
        matches: query === '(display-mode: standalone)' ? displayModeStandalone : false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }));
}

function setUserAgent(userAgent: string) {
    Object.defineProperty(navigator, 'userAgent', {
        configurable: true,
        value: userAgent,
    });
}

function setDocumentClientHeight(height: number) {
    Object.defineProperty(document.documentElement, 'clientHeight', {
        configurable: true,
        value: height,
    });
}

function setWindowScroll(scrollY: number) {
    Object.defineProperty(window, 'scrollY', {
        configurable: true,
        value: scrollY,
    });

    Object.defineProperty(document.documentElement, 'scrollTop', {
        configurable: true,
        value: scrollY,
    });
}

function createVisualViewportMock(height: number, offsetTop = 0) {
    const listeners = new Map<string, Set<ViewportListener>>();

    const visualViewport = {
        height,
        offsetTop,
        addEventListener: vi.fn((type: string, listener: ViewportListener) => {
            if (!listeners.has(type)) {
                listeners.set(type, new Set());
            }

            listeners.get(type)?.add(listener);
        }),
        removeEventListener: vi.fn((type: string, listener: ViewportListener) => {
            listeners.get(type)?.delete(listener);
        }),
    };

    Object.defineProperty(window, 'visualViewport', {
        configurable: true,
        value: visualViewport,
    });

    return {
        visualViewport,
        emit(type: string) {
            for (const listener of listeners.get(type) ?? []) {
                listener();
            }
        },
    };
}

describe('uiStore', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.restoreAllMocks();
        document.documentElement.removeAttribute('style');

        setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36');

        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 800,
        });

        setWindowScroll(0);

        setDocumentClientHeight(0);

        Object.defineProperty(window, 'matchMedia', {
            configurable: true,
            value: createMatchMediaMock(false),
        });

        Object.defineProperty(window, 'visualViewport', {
            configurable: true,
            value: undefined,
        });

        Object.defineProperty(navigator, 'standalone', {
            configurable: true,
            value: false,
        });
    });

    it('Android Chrome ではキーボード表示中も document を固定せず visual viewport 高さへ合わせる', async () => {
        setUserAgent('Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36');

        const requestAnimationFrameSpy = vi
            .spyOn(window, 'requestAnimationFrame')
            .mockImplementation((callback: FrameRequestCallback) => {
                callback(0);
                return 1;
            });
        const cancelAnimationFrameSpy = vi
            .spyOn(window, 'cancelAnimationFrame')
            .mockImplementation(() => { });

        const viewport = createVisualViewportMock(500);
        const {
            FOOTER_HEIGHT,
            bottomPositionStore,
            keyboardHeightStore,
            setupViewportListener,
        } = await import('../../stores/uiStore.svelte');

        const cleanup = setupViewportListener();

        expect(document.documentElement.style.getPropertyValue('--app-root-height')).toBe('500px');
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--app-root-overflow-y')).toBe('visible');
        expect(document.documentElement.style.getPropertyValue('--app-main-height')).toBe('500px');
        expect(document.documentElement.style.getPropertyValue('--app-body-position')).toBe('static');
        expect(document.documentElement.style.getPropertyValue('--app-body-inset')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--app-body-width')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--app-overlay-position')).toBe('fixed');
        expect(document.documentElement.style.getPropertyValue('--app-overscroll-behavior')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('-66px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-height')).toBe('300px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('300px');
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe('350px');
        expect(document.documentElement.style.getPropertyValue('--main-content-keyboard-adjustment')).toBe('0px');
        expect(keyboardHeightStore.value).toBe(300);
        expect(bottomPositionStore.value).toBe(300);

        setWindowScroll(220);
        window.dispatchEvent(new Event('scroll'));

        expect(document.documentElement.style.getPropertyValue('--app-root-height')).toBe('500px');
        expect(document.documentElement.style.getPropertyValue('--app-root-overflow-y')).toBe('visible');
        expect(document.documentElement.style.getPropertyValue('--app-body-position')).toBe('static');
        expect(document.documentElement.style.getPropertyValue('--keyboard-height')).toBe('300px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('300px');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('-66px');
        expect(document.documentElement.style.getPropertyValue('--main-content-keyboard-adjustment')).toBe('0px');
        expect(keyboardHeightStore.value).toBe(300);
        expect(bottomPositionStore.value).toBe(300);

        viewport.visualViewport.height = 760;
        viewport.emit('resize');

        expect(document.documentElement.style.getPropertyValue('--app-root-height')).toBe('100%');
        expect(document.documentElement.style.getPropertyValue('--app-root-overflow-y')).toBe('visible');
        expect(document.documentElement.style.getPropertyValue('--app-main-height')).toBe('100svh');
        expect(document.documentElement.style.getPropertyValue('--app-body-position')).toBe('static');
        expect(document.documentElement.style.getPropertyValue('--app-body-inset')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--app-body-width')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--app-overlay-position')).toBe('fixed');
        expect(document.documentElement.style.getPropertyValue('--app-overscroll-behavior')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-height')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe(`${FOOTER_HEIGHT}px`);
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe(`${FOOTER_HEIGHT + 50}px`);
        expect(keyboardHeightStore.value).toBe(0);
        expect(bottomPositionStore.value).toBe(FOOTER_HEIGHT);

        cleanup?.();

        expect(viewport.visualViewport.removeEventListener).toHaveBeenCalledTimes(2);

        requestAnimationFrameSpy.mockRestore();
        cancelAnimationFrameSpy.mockRestore();
    });

    it('非PWAの iPhone Safari でも Android と同じ visual viewport レイアウトへ切り替える', async () => {
        setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1');

        const requestAnimationFrameSpy = vi
            .spyOn(window, 'requestAnimationFrame')
            .mockImplementation((callback: FrameRequestCallback) => {
                callback(0);
                return 1;
            });
        const cancelAnimationFrameSpy = vi
            .spyOn(window, 'cancelAnimationFrame')
            .mockImplementation(() => { });

        const viewport = createVisualViewportMock(500, 72);
        const {
            FOOTER_HEIGHT,
            bottomPositionStore,
            keyboardHeightStore,
            reasonInputVisibleStore,
            setupViewportListener,
        } = await import('../../stores/uiStore.svelte');

        const cleanup = setupViewportListener();

        expect(document.documentElement.style.getPropertyValue('--app-root-height')).toBe('500px');
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--app-root-overflow-y')).toBe('visible');
        expect(document.documentElement.style.getPropertyValue('--app-main-height')).toBe('500px');
        expect(document.documentElement.style.getPropertyValue('--app-body-position')).toBe('static');
        expect(document.documentElement.style.getPropertyValue('--app-body-inset')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--app-body-width')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--app-overlay-position')).toBe('fixed');
        expect(document.documentElement.style.getPropertyValue('--app-overscroll-behavior')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--main-content-keyboard-adjustment')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('-66px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-height')).toBe('300px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('228px');
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe('278px');
        expect(keyboardHeightStore.value).toBe(300);
        expect(bottomPositionStore.value).toBe(228);

        reasonInputVisibleStore.set(true);

        expect(document.documentElement.style.getPropertyValue('--app-root-height')).toBe('500px');
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--app-root-overflow-y')).toBe('visible');
        expect(document.documentElement.style.getPropertyValue('--app-main-height')).toBe('500px');
        expect(document.documentElement.style.getPropertyValue('--app-body-position')).toBe('static');
        expect(document.documentElement.style.getPropertyValue('--app-overscroll-behavior')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('-66px');
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe('278px');

        viewport.visualViewport.height = 800;
        viewport.visualViewport.offsetTop = 0;
        viewport.emit('resize');

        expect(document.documentElement.style.getPropertyValue('--app-root-height')).toBe('100%');
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--app-root-overflow-y')).toBe('visible');
        expect(document.documentElement.style.getPropertyValue('--app-main-height')).toBe('100svh');
        expect(document.documentElement.style.getPropertyValue('--app-body-position')).toBe('static');
        expect(document.documentElement.style.getPropertyValue('--app-body-inset')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--app-body-width')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--app-overlay-position')).toBe('fixed');
        expect(document.documentElement.style.getPropertyValue('--app-overscroll-behavior')).toBe('auto');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-height')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe(`${FOOTER_HEIGHT}px`);
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe(`${FOOTER_HEIGHT + 50}px`);
        expect(keyboardHeightStore.value).toBe(0);
        expect(bottomPositionStore.value).toBe(FOOTER_HEIGHT);

        cleanup?.();

        requestAnimationFrameSpy.mockRestore();
        cancelAnimationFrameSpy.mockRestore();
    });

    it('非PWAの iPhone Safari では auto-pan 後もキーボード表示レイアウトを維持する', async () => {
        setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1');
        setDocumentClientHeight(549);

        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 549,
        });

        const requestAnimationFrameSpy = vi
            .spyOn(window, 'requestAnimationFrame')
            .mockImplementation((callback: FrameRequestCallback) => {
                callback(0);
                return 1;
            });
        const cancelAnimationFrameSpy = vi
            .spyOn(window, 'cancelAnimationFrame')
            .mockImplementation(() => { });

        const viewport = createVisualViewportMock(314, 0);
        const {
            bottomPositionStore,
            keyboardHeightStore,
            setupViewportListener,
        } = await import('../../stores/uiStore.svelte');

        const cleanup = setupViewportListener();

        expect(keyboardHeightStore.value).toBe(235);
        expect(bottomPositionStore.value).toBe(235);
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--app-root-overflow-y')).toBe('visible');
        expect(document.documentElement.style.getPropertyValue('--app-body-position')).toBe('static');
        expect(document.documentElement.style.getPropertyValue('--app-overlay-position')).toBe('fixed');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('235px');
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe('285px');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('-66px');
        expect(document.documentElement.style.getPropertyValue('--composer-bottom-reserved-height')).toBe('50px');

        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 318,
        });
        viewport.visualViewport.offsetTop = 231;
        viewport.emit('scroll');

        expect(keyboardHeightStore.value).toBe(235);
        expect(bottomPositionStore.value).toBe(4);
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('4px');
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe('54px');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('-66px');
        expect(document.documentElement.style.getPropertyValue('--composer-bottom-reserved-height')).toBe('50px');

        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 216,
        });
        setWindowScroll(308);
        viewport.visualViewport.offsetTop = 199.5;
        window.dispatchEvent(new Event('scroll'));

        expect(keyboardHeightStore.value).toBe(235);
        expect(bottomPositionStore.value).toBe(0);
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('0px');

        setWindowScroll(333);
        viewport.visualViewport.height = 216;
        viewport.visualViewport.offsetTop = 333;
        viewport.emit('scroll');

        expect(keyboardHeightStore.value).toBe(333);
        expect(bottomPositionStore.value).toBe(0);
        expect(document.documentElement.style.getPropertyValue('--app-root-height')).toBe('216px');
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-height')).toBe('333px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe('50px');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('-66px');
        expect(document.documentElement.style.getPropertyValue('--composer-bottom-reserved-height')).toBe('50px');

        cleanup?.();

        requestAnimationFrameSpy.mockRestore();
        cancelAnimationFrameSpy.mockRestore();
    });

    it('キーボード表示中は document touch lock を追加し、解除時に外す', async () => {
        setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1');
        setDocumentClientHeight(549);

        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            value: 549,
        });

        const requestAnimationFrameSpy = vi
            .spyOn(window, 'requestAnimationFrame')
            .mockImplementation((callback: FrameRequestCallback) => {
                callback(0);
                return 1;
            });
        const cancelAnimationFrameSpy = vi
            .spyOn(window, 'cancelAnimationFrame')
            .mockImplementation(() => { });
        const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

        createVisualViewportMock(314, 0);
        const { setupViewportListener } = await import('../../stores/uiStore.svelte');

        const cleanup = setupViewportListener();

        const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'touchstart',
            expect.any(Function),
            expect.anything(),
        );
        expect(addEventListenerSpy).toHaveBeenCalledWith(
            'touchmove',
            expect.any(Function),
            expect.anything(),
        );
        expect(document.documentElement.style.getPropertyValue('--app-root-height')).toBe('314px');
        expect(document.documentElement.style.getPropertyValue('--app-root-overflow-y')).toBe('visible');
        expect(document.documentElement.style.getPropertyValue('--app-body-position')).toBe('static');
        expect(document.documentElement.style.getPropertyValue('--app-main-height')).toBe('314px');

        cleanup?.();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));

        requestAnimationFrameSpy.mockRestore();
        cancelAnimationFrameSpy.mockRestore();
    });

    it('reason input の表示状態を CSS 変数へ同期する', async () => {
        const {
            REASON_INPUT_HEIGHT,
            reasonInputVisibleStore,
        } = await import('../../stores/uiStore.svelte');

        reasonInputVisibleStore.set(true);

        expect(document.documentElement.style.getPropertyValue('--reason-input-height')).toBe(
            `${REASON_INPUT_HEIGHT}px`,
        );

        reasonInputVisibleStore.set(false);

        expect(document.documentElement.style.getPropertyValue('--reason-input-height')).toBe('0px');
    });
});
