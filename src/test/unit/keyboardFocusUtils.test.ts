import { afterEach, describe, expect, it, vi } from 'vitest';
import { focusEditorWithoutKeyboardForCurrentTap } from '../../lib/utils/keyboardFocusUtils';

describe('focusEditorWithoutKeyboardForCurrentTap', () => {
    afterEach(() => {
        vi.useRealTimers();
        document.body.innerHTML = '';
    });

    it('editor を inputmode none で focus してから元の inputmode に戻す', () => {
        vi.useFakeTimers();
        const editorElement = document.createElement('div');
        editorElement.className = 'tiptap-editor';
        editorElement.tabIndex = 0;
        const button = document.createElement('button');
        document.body.append(editorElement, button);
        button.focus();

        focusEditorWithoutKeyboardForCurrentTap(editorElement);

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

        focusEditorWithoutKeyboardForCurrentTap(editorElement);

        expect(editorElement.getAttribute('inputmode')).toBe('none');

        vi.advanceTimersByTime(400);

        expect(editorElement.getAttribute('inputmode')).toBe('text');
    });
});
