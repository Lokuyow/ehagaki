import { afterEach, describe, expect, it, vi } from 'vitest';
import { insertCustomEmojiWithoutUnwantedKeyboard } from '../../lib/editor/customEmojiInsertion';

function createEditorMock(editorElement: HTMLElement) {
    const insertCommand = vi.fn();
    const run = vi.fn();
    const insertChain = vi.fn(() => ({ run }));
    const focus = vi.fn(() => ({ insertCustomEmoji: insertChain }));
    const chain = vi.fn(() => ({ focus }));

    return {
        editor: {
            view: { dom: editorElement },
            commands: { insertCustomEmoji: insertCommand },
            chain,
        } as any,
        insertCommand,
        chain,
        focus,
        insertChain,
        run,
    };
}

function setTouchDevice(enabled: boolean): void {
    Object.defineProperty(navigator, 'maxTouchPoints', {
        value: enabled ? 1 : 0,
        configurable: true,
    });
}

describe('insertCustomEmojiWithoutUnwantedKeyboard', () => {
    afterEach(() => {
        setTouchDevice(false);
    });

    it('touch device で editor が active でない時は focus せずに挿入する', () => {
        setTouchDevice(true);
        const editorElement = document.createElement('div');
        editorElement.className = 'tiptap-editor';
        editorElement.tabIndex = 0;
        const otherElement = document.createElement('button');
        document.body.append(editorElement, otherElement);
        otherElement.focus();

        const { editor, insertCommand, chain } = createEditorMock(editorElement);
        const emoji = { shortcode: 'blobcat', src: 'https://example.com/blobcat.png' };

        insertCustomEmojiWithoutUnwantedKeyboard(editor, emoji);

        expect(insertCommand).toHaveBeenCalledWith(emoji);
        expect(chain).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(otherElement);
    });

    it('touch device でも editor が active なら既存通り focus chain で挿入する', () => {
        setTouchDevice(true);
        const editorElement = document.createElement('div');
        editorElement.className = 'tiptap-editor';
        editorElement.tabIndex = 0;
        document.body.append(editorElement);
        editorElement.focus();

        const { editor, insertCommand, chain, focus, insertChain, run } =
            createEditorMock(editorElement);
        const emoji = { shortcode: 'blobcat', src: 'https://example.com/blobcat.png' };

        insertCustomEmojiWithoutUnwantedKeyboard(editor, emoji);

        expect(insertCommand).not.toHaveBeenCalled();
        expect(chain).toHaveBeenCalled();
        expect(focus).toHaveBeenCalled();
        expect(insertChain).toHaveBeenCalledWith(emoji);
        expect(run).toHaveBeenCalled();
    });

});
