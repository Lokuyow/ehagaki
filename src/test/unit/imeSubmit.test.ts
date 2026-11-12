import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { submitEditorShortcut } from '../../lib/editor/imeSubmit';

const editors: Editor[] = [];
afterEach(() => { editors.splice(0).forEach(editor => editor.destroy()); vi.useRealTimers(); });
function setup() {
    vi.useFakeTimers();
    const editor = new Editor({ extensions: [StarterKit], content: '<p>既存</p>' });
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
    it('retains the visible candidate when blur cancels it', async () => {
        const { editor, event, submit } = setup();
        vi.spyOn(editor.view.dom, 'blur').mockImplementation(() => {
            editor.view.dom.querySelector('p')!.textContent = '既存';
            editor.view.dom.dispatchEvent(new CompositionEvent('compositionend'));
        });
        submitEditorShortcut(event, editor.view, submit);
        await vi.runAllTimersAsync();
        expect(submit).not.toHaveBeenCalled();
        expect(editor.getText()).toBe('既存変換候補');
    });
    it('does not submit after editor destruction', async () => {
        const { editor, event, submit } = setup();
        submitEditorShortcut(event, editor.view, submit);
        editor.destroy();
        await vi.runAllTimersAsync();
        expect(submit).not.toHaveBeenCalled();
    });
});
