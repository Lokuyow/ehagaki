import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor, Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { submitEditorShortcut } from '../../lib/editor/imeSubmit';

const editors: Editor[] = [];
afterEach(() => { editors.splice(0).forEach(editor => editor.destroy()); vi.useRealTimers(); });
const UploadPlaceholder = Node.create({
    name: 'uploadPlaceholder',
    group: 'block',
    addAttributes: () => ({ uploadId: { default: null } }),
    addNodeView: () => () => {
        const dom = document.createElement('div');
        dom.textContent = 'Uploading…';
        return { dom };
    },
});
const InlinePlaceholder = UploadPlaceholder.extend({ name: 'inlinePlaceholder', inline: true, group: 'inline' });

function setup(placeholder?: 'block' | 'inline') {
    vi.useFakeTimers();
    const editor = new Editor({
        extensions: [StarterKit, UploadPlaceholder, InlinePlaceholder],
        content: { type: 'doc', content: [
            { type: 'paragraph', content: [
                { type: 'text', text: '既存' },
                ...(placeholder === 'inline' ? [{ type: 'inlinePlaceholder', attrs: { uploadId: 'pending-upload' } }] : []),
            ] },
            ...(placeholder === 'block' ? [{ type: 'uploadPlaceholder', attrs: { uploadId: 'pending-upload' } }] : []),
        ] },
    });
    editors.push(editor);
    vi.spyOn(editor.view.dom, "focus").mockImplementation(() => undefined);
    const text = editor.view.dom.querySelector('p')!.firstChild!;
    text.textContent = '既存変換候補';
    const event = new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, isComposing: true, cancelable: true });
    const submit = vi.fn(() => editor.getText());
    return { editor, event, submit };
}
describe('IME submit safety', () => {
    it('posts the visible candidate once after browser commit, across both routes', async () => {
        const { editor, event, submit } = setup();
        vi.spyOn(editor.view.dom, 'blur').mockImplementation(() => {
            editor.view.dom.dispatchEvent(new CompositionEvent('compositionend', { data: '変換候補' }));
        });
        submitEditorShortcut(event, editor.view, submit);
        submitEditorShortcut(event, editor.view, submit);
        await vi.runAllTimersAsync();
        expect(submit).toHaveBeenCalledOnce();
        expect(submit.mock.results[0].value).toBe('既存変換候補');
        editor.view.dom.dispatchEvent(new CompositionEvent('compositionend'));
        await vi.runAllTimersAsync();
        expect(submit).toHaveBeenCalledOnce();
    });
    it('keeps input without posting if the browser does not confirm composition', async () => {
        const { editor, event, submit } = setup();
        submitEditorShortcut(event, editor.view, submit);
        await vi.runAllTimersAsync();
        expect(submit).not.toHaveBeenCalled();
        expect(editor.view.dom.textContent).toBe('既存変換候補');
    });
    it.each(['block', 'inline'] as const)('restores a cancelled preedit without changing a %s placeholder', async (placement) => {
        const { editor, event, submit } = setup(placement);
        const paragraph = editor.view.dom.querySelector('p')!;
        const placeholder = () => (placement === 'block' ? editor.state.doc : editor.state.doc.firstChild!).child(1);
        const placeholderDOM = () => (placement === 'block' ? editor.view.dom : paragraph).childNodes[1];
        const original = placeholder();
        const originalDOM = placeholderDOM();
        vi.spyOn(editor.view.dom, 'blur').mockImplementation(() => {
            paragraph.firstChild!.textContent = '既存';
            editor.view.dom.dispatchEvent(new CompositionEvent('compositionend'));
        });
        submitEditorShortcut(event, editor.view, submit);
        await vi.runAllTimersAsync();
        expect(submit).not.toHaveBeenCalled();
        expect(editor.state.doc.firstChild?.textContent).toBe('既存変換候補');
        expect(placeholder()).toBe(original);
        expect(placeholderDOM()).toBe(originalDOM);
    });
    it('does not submit after editor destruction', async () => {
        const { editor, event, submit } = setup();
        submitEditorShortcut(event, editor.view, submit);
        editor.destroy();
        await vi.runAllTimersAsync();
        expect(submit).not.toHaveBeenCalled();
    });
});
