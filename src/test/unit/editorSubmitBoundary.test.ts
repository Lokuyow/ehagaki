import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { EditorInputGuard } from '../../lib/editor/editorInputGuard';
import { waitForEditorComposition } from '../../lib/editor/waitForEditorComposition';

afterEach(() => vi.restoreAllMocks());

describe('submit composition boundary', () => {
    function setup() {
        const dom = document.createElement('div');
        const editor = { view: { dom, composing: true }, isDestroyed: false };
        let frame: FrameRequestCallback | undefined;
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
            frame = callback;
            return 1;
        });
        const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame');
        const wait = waitForEditorComposition(editor as unknown as Editor);
        return { dom, editor, wait, cancelFrame, frame: () => frame?.(0) };
    }

    it('waits for natural compositionend and a frame, including a restarted composition', async () => {
        const test = setup();
        const done = vi.fn();
        void test.wait.settled.then(done);
        test.dom.dispatchEvent(new CompositionEvent('compositionupdate'));
        await Promise.resolve();
        expect(done).not.toHaveBeenCalled();
        test.dom.dispatchEvent(new CompositionEvent('compositionend'));
        test.frame(); // Composition restarted before this frame.
        await Promise.resolve();
        expect(done).not.toHaveBeenCalled();
        test.editor.view.composing = false;
        test.dom.dispatchEvent(new CompositionEvent('compositionend'));
        expect(done).not.toHaveBeenCalled();
        test.frame();
        await expect(test.wait.settled).resolves.toBe(true);
    });

    it('cancels pending frames and listeners on owner destruction', async () => {
        const test = setup();
        test.dom.dispatchEvent(new CompositionEvent('compositionend'));
        test.wait.cancel();
        await expect(test.wait.settled).resolves.toBe(false);
        expect(test.cancelFrame).toHaveBeenCalledWith(1);
        vi.mocked(window.requestAnimationFrame).mockClear();
        test.dom.dispatchEvent(new CompositionEvent('compositionend'));
        expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    });
});

describe('sending document guard', () => {
    it('rejects user and composition document changes, allows selection, and unlocks success clear', () => {
        let blocked = false;
        const editor = new Editor({
            extensions: [StarterKit, EditorInputGuard.configure({ isInputBlocked: () => blocked })],
            content: '<p>before</p>',
        });
        try {
            editor.commands.insertContent('allowed');
            const frozen = editor.state.doc;
            blocked = true;
            editor.commands.insertContent('blocked');
            editor.view.dispatch(editor.state.tr.insertText('composition').setMeta('composition', 1));
            editor.commands.clearContent();
            expect(editor.state.doc.eq(frozen)).toBe(true);
            editor.commands.setTextSelection(2);
            expect(editor.state.selection.from).toBe(2);
            expect(editor.isEditable).toBe(true);
            blocked = false;
            editor.commands.clearContent();
            expect(editor.isEmpty).toBe(true);
        } finally {
            editor.destroy();
        }
    });
});
