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

    it('iPhone Safari 以外でもキーボード表示中は visual viewport レイアウトへ切り替える', async () => {
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
        expect(document.documentElement.style.getPropertyValue('--app-root-overflow-y')).toBe('hidden');
        expect(document.documentElement.style.getPropertyValue('--app-main-height')).toBe('500px');
        expect(document.documentElement.style.getPropertyValue('--app-body-position')).toBe('fixed');
        expect(document.documentElement.style.getPropertyValue('--app-body-inset')).toBe('0');
        expect(document.documentElement.style.getPropertyValue('--app-body-width')).toBe('100%');
        expect(document.documentElement.style.getPropertyValue('--app-overlay-position')).toBe('absolute');
        expect(document.documentElement.style.getPropertyValue('--app-overscroll-behavior')).toBe('none');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('-66px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-height')).toBe('300px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe('50px');
        expect(document.documentElement.style.getPropertyValue('--main-content-keyboard-adjustment')).toBe('0px');
        expect(keyboardHeightStore.value).toBe(300);
        expect(bottomPositionStore.value).toBe(300);

        setWindowScroll(220);
        window.dispatchEvent(new Event('scroll'));

        expect(document.documentElement.style.getPropertyValue('--app-root-height')).toBe('500px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-height')).toBe('300px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('0px');
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

    it('非PWAの iPhone Safari では visual viewport を維持しつつ body 固定を適用する', async () => {
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
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('72px');
        expect(document.documentElement.style.getPropertyValue('--app-root-overflow-y')).toBe('hidden');
        expect(document.documentElement.style.getPropertyValue('--app-main-height')).toBe('500px');
        expect(document.documentElement.style.getPropertyValue('--app-body-position')).toBe('fixed');
        expect(document.documentElement.style.getPropertyValue('--app-body-inset')).toBe('0');
        expect(document.documentElement.style.getPropertyValue('--app-body-width')).toBe('100%');
        expect(document.documentElement.style.getPropertyValue('--app-overlay-position')).toBe('absolute');
        expect(document.documentElement.style.getPropertyValue('--app-overscroll-behavior')).toBe('none');
        expect(document.documentElement.style.getPropertyValue('--main-content-keyboard-adjustment')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('-66px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-height')).toBe('300px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe('50px');
        expect(keyboardHeightStore.value).toBe(300);
        expect(bottomPositionStore.value).toBe(228);

        reasonInputVisibleStore.set(true);

        expect(document.documentElement.style.getPropertyValue('--app-root-height')).toBe('500px');
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('72px');
        expect(document.documentElement.style.getPropertyValue('--app-root-overflow-y')).toBe('hidden');
        expect(document.documentElement.style.getPropertyValue('--app-main-height')).toBe('500px');
        expect(document.documentElement.style.getPropertyValue('--app-body-position')).toBe('fixed');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('-66px');
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe('50px');

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
        expect(document.documentElement.style.getPropertyValue('--app-overlay-position')).toBe('absolute');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe('50px');
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
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('231px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('0px');
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
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('308px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('0px');

        setWindowScroll(333);
        viewport.visualViewport.height = 216;
        viewport.visualViewport.offsetTop = 333;
        viewport.emit('scroll');

        expect(keyboardHeightStore.value).toBe(333);
        expect(bottomPositionStore.value).toBe(0);
        expect(document.documentElement.style.getPropertyValue('--app-root-height')).toBe('216px');
        expect(document.documentElement.style.getPropertyValue('--app-root-top')).toBe('333px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-height')).toBe('333px');
        expect(document.documentElement.style.getPropertyValue('--keyboard-button-bar-bottom')).toBe('0px');
        expect(document.documentElement.style.getPropertyValue('--reason-input-bottom')).toBe('50px');
        expect(document.documentElement.style.getPropertyValue('--footer-bottom')).toBe('-66px');
        expect(document.documentElement.style.getPropertyValue('--composer-bottom-reserved-height')).toBe('50px');

        cleanup?.();

        requestAnimationFrameSpy.mockRestore();
        cancelAnimationFrameSpy.mockRestore();
    });

    it('非PWAの iPhone Safari ではキーボード表示中に editor 外 touchmove を抑止する', async () => {
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
        const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

        createVisualViewportMock(314, 0);
        const { setupViewportListener } = await import('../../stores/uiStore.svelte');

        const cleanup = setupViewportListener();

        const touchStartHandler = addEventListenerSpy.mock.calls.find(
            ([type]) => type === 'touchstart',
        )?.[1] as ((event: TouchEvent) => void) | undefined;
        const touchMoveHandler = addEventListenerSpy.mock.calls.find(
            ([type]) => type === 'touchmove',
        )?.[1] as ((event: TouchEvent) => void) | undefined;

        expect(touchStartHandler).toBeDefined();
        expect(touchMoveHandler).toBeDefined();

        const outside = document.createElement('div');
        document.body.append(outside);
        const outsidePreventDefault = vi.fn();

        touchStartHandler?.({
            target: outside,
            touches: [{ clientY: 100 }],
            changedTouches: [{ clientY: 100 }],
        } as unknown as TouchEvent);
        touchMoveHandler?.({
            target: outside,
            touches: [{ clientY: 80 }],
            changedTouches: [{ clientY: 80 }],
            preventDefault: outsidePreventDefault,
        } as unknown as TouchEvent);

        expect(outsidePreventDefault).toHaveBeenCalledTimes(1);

        const composerScrollRegion = document.createElement('div');
        composerScrollRegion.className = 'composer-scroll-region';
        Object.defineProperty(composerScrollRegion, 'scrollHeight', {
            configurable: true,
            value: 600,
        });
        Object.defineProperty(composerScrollRegion, 'clientHeight', {
            configurable: true,
            value: 200,
        });
        Object.defineProperty(composerScrollRegion, 'scrollTop', {
            configurable: true,
            value: 120,
            writable: true,
        });
        const composerInner = document.createElement('div');
        composerScrollRegion.append(composerInner);
        document.body.append(composerScrollRegion);
        const composerPreventDefault = vi.fn();

        touchStartHandler?.({
            target: composerInner,
            touches: [{ clientY: 100 }],
            changedTouches: [{ clientY: 100 }],
        } as unknown as TouchEvent);
        touchMoveHandler?.({
            target: composerInner,
            touches: [{ clientY: 80 }],
            changedTouches: [{ clientY: 80 }],
            preventDefault: composerPreventDefault,
        } as unknown as TouchEvent);

        expect(composerPreventDefault).not.toHaveBeenCalled();

        const editor = document.createElement('div');
        editor.className = 'tiptap-editor';
        Object.defineProperty(editor, 'scrollHeight', {
            configurable: true,
            value: 600,
        });
        Object.defineProperty(editor, 'clientHeight', {
            configurable: true,
            value: 200,
        });
        Object.defineProperty(editor, 'scrollTop', {
            configurable: true,
            value: 100,
            writable: true,
        });
        const inner = document.createElement('span');
        editor.append(inner);
        document.body.append(editor);
        const editorPreventDefault = vi.fn();

        touchStartHandler?.({
            target: inner,
            touches: [{ clientY: 100 }],
            changedTouches: [{ clientY: 100 }],
        } as unknown as TouchEvent);
        touchMoveHandler?.({
            target: inner,
            touches: [{ clientY: 80 }],
            changedTouches: [{ clientY: 80 }],
            preventDefault: editorPreventDefault,
        } as unknown as TouchEvent);

        expect(editorPreventDefault).not.toHaveBeenCalled();

        Object.defineProperty(editor, 'scrollTop', {
            configurable: true,
            value: 0,
            writable: true,
        });
        const editorWithComposer = document.createElement('div');
        editorWithComposer.className = 'composer-scroll-region';
        Object.defineProperty(editorWithComposer, 'scrollHeight', {
            configurable: true,
            value: 900,
        });
        Object.defineProperty(editorWithComposer, 'clientHeight', {
            configurable: true,
            value: 220,
        });
        Object.defineProperty(editorWithComposer, 'scrollTop', {
            configurable: true,
            value: 140,
            writable: true,
        });
        const nestedEditor = document.createElement('div');
        nestedEditor.className = 'tiptap-editor';
        Object.defineProperty(nestedEditor, 'scrollHeight', {
            configurable: true,
            value: 600,
        });
        Object.defineProperty(nestedEditor, 'clientHeight', {
            configurable: true,
            value: 200,
        });
        Object.defineProperty(nestedEditor, 'scrollTop', {
            configurable: true,
            value: 0,
            writable: true,
        });
        const nestedInner = document.createElement('span');
        nestedEditor.append(nestedInner);
        editorWithComposer.append(nestedEditor);
        document.body.append(editorWithComposer);
        const nestedPreventDefault = vi.fn();

        touchStartHandler?.({
            target: nestedInner,
            touches: [{ clientY: 100 }],
            changedTouches: [{ clientY: 100 }],
        } as unknown as TouchEvent);
        touchMoveHandler?.({
            target: nestedInner,
            touches: [{ clientY: 130 }],
            changedTouches: [{ clientY: 130 }],
            preventDefault: nestedPreventDefault,
        } as unknown as TouchEvent);

        expect(nestedPreventDefault).not.toHaveBeenCalled();

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