import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
    canScrollElement,
    canScrollElementInDirection,
    createKeyboardTouchScrollLock,
    resolveTouchScrollElements,
} from '../../lib/utils/keyboardTouchScrollLock';

function defineScrollMetrics(
    element: HTMLElement,
    metrics: { scrollHeight: number; clientHeight: number; scrollTop: number },
) {
    Object.defineProperty(element, 'scrollHeight', {
        configurable: true,
        value: metrics.scrollHeight,
    });
    Object.defineProperty(element, 'clientHeight', {
        configurable: true,
        value: metrics.clientHeight,
    });
    Object.defineProperty(element, 'scrollTop', {
        configurable: true,
        value: metrics.scrollTop,
        writable: true,
    });
}

describe('keyboardTouchScrollLock', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('editor と composer scroll region を優先順で解決する', () => {
        const composerScrollRegion = document.createElement('div');
        composerScrollRegion.className = 'composer-scroll-region';
        const editor = document.createElement('div');
        editor.className = 'tiptap-editor';
        const inner = document.createElement('span');

        editor.append(inner);
        composerScrollRegion.append(editor);
        document.body.append(composerScrollRegion);

        expect(resolveTouchScrollElements(inner)).toEqual([
            editor,
            composerScrollRegion,
        ]);
    });

    it('スクロール可否を方向付きで判定する', () => {
        const element = document.createElement('div');
        defineScrollMetrics(element, {
            scrollHeight: 600,
            clientHeight: 200,
            scrollTop: 100,
        });

        expect(canScrollElement(element)).toBe(true);
        expect(canScrollElementInDirection(element, 20)).toBe(true);
        expect(canScrollElementInDirection(element, -20)).toBe(true);

        defineScrollMetrics(element, {
            scrollHeight: 600,
            clientHeight: 200,
            scrollTop: 0,
        });

        expect(canScrollElementInDirection(element, 20)).toBe(false);
        expect(canScrollElementInDirection(element, -20)).toBe(true);
    });

    it('lock 中は editor 外の全体スクロールを抑止する', () => {
        const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
        const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
        const lock = createKeyboardTouchScrollLock(document);

        lock.sync(true);

        const touchStartHandler = addEventListenerSpy.mock.calls.find(
            ([type]) => type === 'touchstart',
        )?.[1] as ((event: TouchEvent) => void) | undefined;
        const touchMoveHandler = addEventListenerSpy.mock.calls.find(
            ([type]) => type === 'touchmove',
        )?.[1] as ((event: TouchEvent) => void) | undefined;

        const outside = document.createElement('div');
        document.body.append(outside);
        const preventDefault = vi.fn();

        touchStartHandler?.({
            target: outside,
            touches: [{ clientY: 100 }],
            changedTouches: [{ clientY: 100 }],
        } as unknown as TouchEvent);
        touchMoveHandler?.({
            target: outside,
            touches: [{ clientY: 80 }],
            changedTouches: [{ clientY: 80 }],
            preventDefault,
        } as unknown as TouchEvent);

        expect(preventDefault).toHaveBeenCalledTimes(1);

        lock.dispose();

        expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
    });

    it('document 上端での下方向 pull-to-refresh gesture は許可する', () => {
        const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
        const lock = createKeyboardTouchScrollLock(document);

        Object.defineProperty(window, 'scrollY', {
            configurable: true,
            value: 0,
        });
        Object.defineProperty(document.documentElement, 'scrollTop', {
            configurable: true,
            value: 0,
        });

        lock.sync(true);

        const touchStartHandler = addEventListenerSpy.mock.calls.find(
            ([type]) => type === 'touchstart',
        )?.[1] as ((event: TouchEvent) => void) | undefined;
        const touchMoveHandler = addEventListenerSpy.mock.calls.find(
            ([type]) => type === 'touchmove',
        )?.[1] as ((event: TouchEvent) => void) | undefined;

        const outside = document.createElement('div');
        document.body.append(outside);
        const preventDefault = vi.fn();

        touchStartHandler?.({
            target: outside,
            touches: [{ clientY: 100 }],
            changedTouches: [{ clientY: 100 }],
        } as unknown as TouchEvent);
        touchMoveHandler?.({
            target: outside,
            touches: [{ clientY: 130 }],
            changedTouches: [{ clientY: 130 }],
            preventDefault,
        } as unknown as TouchEvent);

        expect(preventDefault).not.toHaveBeenCalled();

        lock.dispose();
    });

    it('composer scroll region がスクロールできる場合は touchmove を許可する', () => {
        const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
        const lock = createKeyboardTouchScrollLock(document);

        lock.sync(true);

        const touchStartHandler = addEventListenerSpy.mock.calls.find(
            ([type]) => type === 'touchstart',
        )?.[1] as ((event: TouchEvent) => void) | undefined;
        const touchMoveHandler = addEventListenerSpy.mock.calls.find(
            ([type]) => type === 'touchmove',
        )?.[1] as ((event: TouchEvent) => void) | undefined;

        const composerScrollRegion = document.createElement('div');
        composerScrollRegion.className = 'composer-scroll-region';
        defineScrollMetrics(composerScrollRegion, {
            scrollHeight: 600,
            clientHeight: 200,
            scrollTop: 120,
        });
        const inner = document.createElement('div');
        composerScrollRegion.append(inner);
        document.body.append(composerScrollRegion);
        const preventDefault = vi.fn();

        touchStartHandler?.({
            target: inner,
            touches: [{ clientY: 100 }],
            changedTouches: [{ clientY: 100 }],
        } as unknown as TouchEvent);
        touchMoveHandler?.({
            target: inner,
            touches: [{ clientY: 80 }],
            changedTouches: [{ clientY: 80 }],
            preventDefault,
        } as unknown as TouchEvent);

        expect(preventDefault).not.toHaveBeenCalled();

        lock.dispose();
    });

    it('composer scroll region の上端で下方向へ引いた場合は document scroll へ伝播させない', () => {
        const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
        const lock = createKeyboardTouchScrollLock(document);

        Object.defineProperty(window, 'scrollY', {
            configurable: true,
            value: 0,
        });
        lock.sync(true);

        const touchStartHandler = addEventListenerSpy.mock.calls.find(
            ([type]) => type === 'touchstart',
        )?.[1] as ((event: TouchEvent) => void) | undefined;
        const touchMoveHandler = addEventListenerSpy.mock.calls.find(
            ([type]) => type === 'touchmove',
        )?.[1] as ((event: TouchEvent) => void) | undefined;

        const composerScrollRegion = document.createElement('div');
        composerScrollRegion.className = 'composer-scroll-region';
        defineScrollMetrics(composerScrollRegion, {
            scrollHeight: 600,
            clientHeight: 200,
            scrollTop: 0,
        });
        const inner = document.createElement('div');
        composerScrollRegion.append(inner);
        document.body.append(composerScrollRegion);
        const preventDefault = vi.fn();

        touchStartHandler?.({
            target: inner,
            touches: [{ clientY: 100 }],
            changedTouches: [{ clientY: 100 }],
        } as unknown as TouchEvent);
        touchMoveHandler?.({
            target: inner,
            touches: [{ clientY: 130 }],
            changedTouches: [{ clientY: 130 }],
            preventDefault,
        } as unknown as TouchEvent);

        expect(preventDefault).toHaveBeenCalledTimes(1);

        lock.dispose();
    });

    it('composer scroll region の下端で上方向へ引いた場合は document scroll へ伝播させない', () => {
        const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
        const lock = createKeyboardTouchScrollLock(document);

        lock.sync(true);

        const touchStartHandler = addEventListenerSpy.mock.calls.find(
            ([type]) => type === 'touchstart',
        )?.[1] as ((event: TouchEvent) => void) | undefined;
        const touchMoveHandler = addEventListenerSpy.mock.calls.find(
            ([type]) => type === 'touchmove',
        )?.[1] as ((event: TouchEvent) => void) | undefined;

        const composerScrollRegion = document.createElement('div');
        composerScrollRegion.className = 'composer-scroll-region';
        defineScrollMetrics(composerScrollRegion, {
            scrollHeight: 600,
            clientHeight: 200,
            scrollTop: 400,
        });
        const inner = document.createElement('div');
        composerScrollRegion.append(inner);
        document.body.append(composerScrollRegion);
        const preventDefault = vi.fn();

        touchStartHandler?.({
            target: inner,
            touches: [{ clientY: 100 }],
            changedTouches: [{ clientY: 100 }],
        } as unknown as TouchEvent);
        touchMoveHandler?.({
            target: inner,
            touches: [{ clientY: 70 }],
            changedTouches: [{ clientY: 70 }],
            preventDefault,
        } as unknown as TouchEvent);

        expect(preventDefault).toHaveBeenCalledTimes(1);

        lock.dispose();
    });
});
