import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { EditorInputGuard } from '../../lib/editor/editorInputGuard';

afterEach(() => vi.restoreAllMocks());

describe('sending document guard', () => {
    it('allows only the already active composition until it ends', () => {
        let blocked = false;
        let compositionActive = false;
        const editor = new Editor({
            extensions: [
                StarterKit,
                EditorInputGuard.configure({
                    isInputBlocked: () => blocked,
                    isCompositionInputAllowed: () => compositionActive,
                }),
            ],
            content: '<p>before</p>',
        });
        try {
            editor.commands.insertContent(' allowed');
            const frozen = editor.state.doc;
            blocked = true;

            editor.commands.insertContent(' blocked');
            expect(editor.state.doc.eq(frozen)).toBe(true);

            compositionActive = true;
            editor.view.dispatch(
                editor.state.tr.insertText(' composition').setMeta('composition', 1),
            );
            expect(editor.state.doc.textContent).toContain(' composition');

            compositionActive = false;
            const afterComposition = editor.state.doc;
            editor.view.dispatch(
                editor.state.tr.insertText(' blocked after end'),
            );
            expect(editor.state.doc.eq(afterComposition)).toBe(true);

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
