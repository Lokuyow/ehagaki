import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor, Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { closeHistory } from '@tiptap/pm/history';
import { ReactionInput, isReactionComposing } from '../../lib/editor/reactionInput';
import { inspectReactionDocument, type ReactionInputMode } from '../../lib/reactionValue';

const editors: Editor[] = [];
afterEach(() => { editors.splice(0).forEach(editor => editor.destroy()); vi.restoreAllMocks(); });
const customEmoji = Node.create({ name: 'customEmoji', group: 'inline', inline: true, atom: true,
    addAttributes: () => ({ shortcode: { default: 'blob' }, src: { default: 'https://emoji.example/blob.png' }, setAddress: { default: null } }),
    renderHTML: () => ['span', { 'data-emoji': 'blob' }] });
function fixture(content = '') {
    let active = false;
    let mode: ReactionInputMode = 'singleValue';
    const editor = new Editor({ element: document.createElement('div'), extensions: [StarterKit, customEmoji, ReactionInput.configure({ isActive: () => active, getInputMode: () => mode })], content: `<p>${content}</p>` });
    editors.push(editor);
    const insert = (text: string, meta?: string) => editor.view.dispatch(editor.state.tr.insertText(text, editor.state.doc.content.size - 1).setMeta(meta ?? 'input', true));
    return { editor, insert, activate: () => active = true, setMode: (value: ReactionInputMode) => { mode = value; } };
}
describe('Reaction document transactions', () => {
    it.each(['cat', ':cat:', '::cat::', ':', 'cat ', '猫'])('allows incremental shortcode editing even before regex validity: %s', text => {
        const f = fixture(); f.activate(); f.setMode('uploadedShortcode');
        for (const character of text) f.insert(character);
        expect(f.editor.getText()).toBe(text);
    });
    it('rejects rich nodes and line breaks in shortcode mode', () => {
        const f = fixture('cat'); f.activate(); f.setMode('uploadedShortcode');
        for (const content of [{ type: 'customEmoji' }, { type: 'hardBreak' }, { type: 'paragraph', content: [{ type: 'text', text: 'B' }] }]) {
            f.editor.commands.insertContent(content);
            expect(f.editor.getText()).toBe('cat');
        }
        f.insert('\n'); expect(f.editor.getText()).toBe('cat');
        f.editor.commands.setTextSelection({ from: 1, to: 4 });
        f.editor.commands.toggleBold();
        expect(f.editor.getHTML()).toBe('<p>cat</p>');
    });
    it('keeps long text when the image is deleted and allows repair, undo and redo', () => {
        const f = fixture(); f.activate(); f.setMode('uploadedShortcode'); f.insert('cat');
        f.setMode('singleValue');
        expect(f.editor.getText()).toBe('cat'); expect(inspectReactionDocument(f.editor.state.doc).value).toBeNull();
        f.insert('s'); expect(f.editor.getText()).toBe('cat');
        f.editor.view.dispatch(closeHistory(f.editor.state.tr.delete(2, 4)));
        expect(f.editor.getText()).toBe('c'); expect(inspectReactionDocument(f.editor.state.doc).value).not.toBeNull();
        f.editor.commands.undo(); expect(f.editor.getText()).toBe('cat');
        f.editor.commands.redo(); expect(f.editor.getText()).toBe('c');
    });
    it.each([false, true])('composition reconciles with the current shortcode mode, changed during composition=%s', change => {
        const f = fixture(); f.activate(); if (!change) f.setMode('uploadedShortcode');
        let reconcile: FrameRequestCallback | undefined;
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { reconcile = callback; return 1; });
        f.editor.view.dom.dispatchEvent(new Event('compositionstart')); f.insert('cat');
        if (change) f.setMode('uploadedShortcode');
        f.editor.view.dom.dispatchEvent(new Event('compositionend')); reconcile!(0);
        expect(f.editor.getText()).toBe('cat'); expect(isReactionComposing(f.editor)).toBe(false);
    });
    it.each(['A', 'あ', '👍', '👍🏽', '👨‍👩‍👧‍👦', 'e\u0301'])('accepts one grapheme %s and blocks input/paste/drop adding a second', text => {
        const f = fixture(); f.activate(); f.insert(text);
        expect(inspectReactionDocument(f.editor.state.doc).value).toEqual({ type: 'text', text });
        for (const meta of ['input', 'paste', 'drop']) { f.insert('B', meta); expect(f.editor.getText()).toBe(text); }
        f.editor.view.dispatch(f.editor.state.tr.insertText('あ', 1, f.editor.state.doc.content.size - 1));
        expect(f.editor.getText()).toBe('あ');
    });
    it('joins adjacent marked text before counting combining graphemes', () => {
        const f = fixture(); f.editor.commands.setContent('<p>e<strong>́</strong></p>'); f.activate();
        expect(inspectReactionDocument(f.editor.state.doc).value).toEqual({ type: 'text', text: 'é' });
    });
    it('preserves preexisting invalid content; undo restores it and redo restores sending eligibility', () => {
        const f = fixture('AB'); f.activate();
        expect(inspectReactionDocument(f.editor.state.doc).value).toBeNull();
        f.editor.view.dispatch(closeHistory(f.editor.state.tr.delete(2, 3)));
        expect(f.editor.getText()).toBe('A'); expect(inspectReactionDocument(f.editor.state.doc).value).not.toBeNull();
        expect(f.editor.commands.undo()).toBe(true);
        expect(f.editor.getText()).toBe('AB'); expect(inspectReactionDocument(f.editor.state.doc).value).toBeNull();
        expect(f.editor.commands.redo()).toBe(true);
        expect(f.editor.getText()).toBe('A'); f.insert('B', 'paste'); expect(f.editor.getText()).toBe('A');
    });
    it('allows one custom token, rejects mixing, and preserves selection replacement', () => {
        const f = fixture(); f.activate();
        f.editor.commands.insertContent({ type: 'customEmoji', attrs: { shortcode: 'blob', src: 'https://emoji.example/blob.png' } });
        expect(inspectReactionDocument(f.editor.state.doc).value?.type).toBe('customEmoji');
        f.insert('A'); expect(inspectReactionDocument(f.editor.state.doc).count).toBe(1);
        f.editor.commands.insertContent({ type: 'customEmoji' }); expect(inspectReactionDocument(f.editor.state.doc).count).toBe(1);
        f.editor.commands.setTextSelection({ from: 1, to: 2 }); f.editor.commands.insertContent('A');
        expect(f.editor.getText()).toBe('A');
        f.editor.commands.insertContent('<p>B</p>'); expect(f.editor.getText()).toBe('A');
        expect(inspectReactionDocument(f.editor.state.doc, true).value).toBeNull();
    });
    it('allows IME preedit but rolls invalid commit back to the original document and selection', () => {
        const f = fixture('A'); f.activate();
        let reconcile: FrameRequestCallback | undefined;
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { reconcile = callback; return 1; });
        const originalSelection = f.editor.state.selection;
        f.editor.view.dom.dispatchEvent(new Event('compositionstart'));
        expect(isReactionComposing(f.editor)).toBe(true);
        f.insert('あ'); expect(f.editor.getText()).toBe('Aあ');
        f.editor.view.dom.dispatchEvent(new Event('compositionend'));
        reconcile!(0);
        expect(isReactionComposing(f.editor)).toBe(false);
        expect(f.editor.getText()).toBe('A'); expect(f.editor.state.selection.eq(originalSelection)).toBe(true);
    });
});
