import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    focusEditorWithoutKeyboardForCurrentTap,
    isIosTouchDevice,
    preserveKeyboardForScrollableTouch,
} from '../../lib/utils/keyboardFocusUtils';

function setNavigatorValue(name: keyof Navigator, value: unknown): void {
    Object.defineProperty(navigator, name, {
        value,
        configurable: true,
    });
}

describe('focusEditorWithoutKeyboardForCurrentTap', () => {
    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
        setNavigatorValue('userAgent', 'Mozilla/5.0');
        setNavigatorValue('platform', 'Win32');
        setNavigatorValue('maxTouchPoints', 0);
    });

    it('editor を inputmode none で focus してから元の inputmode に戻す', () => {
        vi.useFakeTimers();
        const editorElement = document.createElement('div');
        editorElement.className = 'tiptap-editor';
        editorElement.tabIndex = 0;
        const button = document.createElement('button');
        document.body.append(editorElement, button);
        button.focus();

        const didFocus = focusEditorWithoutKeyboardForCurrentTap(editorElement);

        expect(didFocus).toBe(true);
        expect(document.activeElement).toBe(editorElement);
        expect(editorElement.getAttribute('inputmode')).toBe('none');

        vi.advanceTimersByTime(400);

        expect(editorElement.hasAttribute('inputmode')).toBe(false);
    });

    it('既存の inputmode がある場合は restore で復元する', () => {
        vi.useFakeTimers();
        const editorElement = document.createElement('div');
        editorElement.className = 'tiptap-editor';
        editorElement.tabIndex = 0;
        editorElement.setAttribute('inputmode', 'text');
        const button = document.createElement('button');
        document.body.append(editorElement, button);
        button.focus();

        const didFocus = focusEditorWithoutKeyboardForCurrentTap(editorElement);

        expect(didFocus).toBe(true);
        expect(editorElement.getAttribute('inputmode')).toBe('none');

        vi.advanceTimersByTime(400);

        expect(editorElement.getAttribute('inputmode')).toBe('text');
    });

    it('iPhone では focus せず、キーボード抑止を呼び出し元の疑似 caret に委ねる', () => {
        setNavigatorValue(
            'userAgent',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        );
        setNavigatorValue('platform', 'iPhone');
        setNavigatorValue('maxTouchPoints', 1);

        const editorElement = document.createElement('div');
        editorElement.className = 'tiptap-editor';
        editorElement.tabIndex = 0;
        const button = document.createElement('button');
        document.body.append(editorElement, button);
        button.focus();

        const didFocus = focusEditorWithoutKeyboardForCurrentTap(editorElement);

        expect(isIosTouchDevice()).toBe(true);
        expect(didFocus).toBe(false);
        expect(document.activeElement).toBe(button);
        expect(editorElement.hasAttribute('inputmode')).toBe(false);
    });
});

describe('preserveKeyboardForScrollableTouch', () => {
    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
        document.documentElement.style.removeProperty('--keyboard-height');
    });

    it('touchstart のデフォルトスクロールを止めずに editor inputmode を一時抑制する', () => {
        vi.useFakeTimers();
        document.documentElement.style.setProperty('--keyboard-height', '0px');
        const editorElement = document.createElement('div');
        editorElement.className = 'tiptap-editor';
        editorElement.tabIndex = 0;
        document.body.append(editorElement);
        editorElement.focus();
        const preventDefault = vi.fn();

        preserveKeyboardForScrollableTouch({
            type: 'touchstart',
            preventDefault,
        } as unknown as Event);

        expect(preventDefault).not.toHaveBeenCalled();
        expect(editorElement.getAttribute('inputmode')).toBe('none');

        vi.advanceTimersByTime(400);

        expect(editorElement.hasAttribute('inputmode')).toBe(false);
    });
});
