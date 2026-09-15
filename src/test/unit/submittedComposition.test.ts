import { afterEach, describe, expect, it } from 'vitest';
import { Editor, Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Plugin } from '@tiptap/pm/state';
import { EditorInputGuard, editorInputGuardKey } from '../../lib/editor/editorInputGuard';
import {
    SUBMITTED_COMPOSITION_CLEANUP_META,
    SubmittedCompositionController,
} from '../../lib/editor/submittedComposition';

describe('submitted composition transaction ownership', () => {
    let editor: Editor | undefined;

    afterEach(() => editor?.destroy());

    function createEditor(blocked: { value: boolean }, controller: SubmittedCompositionController) {
        editor = new Editor({
            extensions: [
                StarterKit,
                EditorInputGuard.configure({
                    isInputBlocked: () => blocked.value,
                    compositionController: controller,
                }),
            ],
            content: '<p>existing</p>',
        });
        controller.attach(editor);
        return editor;
    }

    it('does not capture the previous generation ID and binds the new ID on its first transaction', () => {
        const blocked = { value: false };
        const controller = new SubmittedCompositionController();
        const instance = createEditor(blocked, controller);
        instance.view.dom.dispatchEvent(new Event('compositionstart'));
        blocked.value = true;
        instance.view.dispatch(instance.state.tr.insertText(' A').setMeta('composition', 10));
        instance.view.dom.dispatchEvent(new Event('compositionend'));
        instance.view.dom.dispatchEvent(new Event('compositionstart'));

        controller.startSession(editorInputGuardKey.getState(instance.state)!);
        instance.view.dispatch(instance.state.tr.insertText(' B').setMeta('composition', 20));
        expect(instance.state.doc.textContent).toContain(' B');

        const afterBind = instance.state.doc;
        instance.view.dispatch(instance.state.tr.insertText(' old').setMeta('composition', 10));
        expect(instance.state.doc.eq(afterBind)).toBe(true);
        instance.view.dispatch(instance.state.tr.insertText(' other').setMeta('composition', 21));
        expect(instance.state.doc.eq(afterBind)).toBe(true);
    });

    it('tracks composition generation and DOM activity from the attached editor', async () => {
        const controller = new SubmittedCompositionController();
        const instance = createEditor({ value: false }, controller);

        instance.view.dom.dispatchEvent(new Event('compositionstart', { bubbles: true }));
        expect(controller.getCurrentGeneration()).toBe(1);
        controller.startSession(editorInputGuardKey.getState(instance.state)!);
        controller.markStale();
        expect(controller.isReadOnly()).toBe(true);

        instance.view.dom.dispatchEvent(new Event('compositionend', { bubbles: true }));
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        expect(controller.isReadOnly()).toBe(false);
    });

    it('uses the plugin state binding for later transactions in the same transaction chain', () => {
        const blocked = { value: false };
        const controller = new SubmittedCompositionController();
        const instance = new Editor({
            extensions: [
                StarterKit,
                EditorInputGuard.configure({
                    isInputBlocked: () => blocked.value,
                    compositionController: controller,
                }),
                Extension.create({
                    name: 'appendedComposition',
                    addProseMirrorPlugins() {
                        return [new Plugin({
                            appendTransaction: (transactions: readonly any[], _oldState: any, newState: any) => {
                                if (!transactions.some((transaction) => transaction.getMeta('composition') === 'A')) return null;
                                return newState.tr.insertText(' appended').setMeta('composition', 'A');
                            },
                        })];
                    },
                }),
            ],
            content: '<p>existing</p>',
        });
        editor = instance;
        controller.attach(instance);
        instance.view.dom.dispatchEvent(new Event('compositionstart'));
        blocked.value = true;
        controller.startSession(editorInputGuardKey.getState(instance.state)!);

        instance.view.dispatch(instance.state.tr.insertText(' root').setMeta('composition', 'A'));
        expect(instance.state.doc.textContent).toContain(' root appended');

        const frozen = instance.state.doc;
        instance.view.dispatch(instance.state.tr.insertText(' rejected').setMeta('composition', 'B'));
        expect(instance.state.doc.eq(frozen)).toBe(true);
    });

    it('enters stale after success and rejects old composition mutations without a second clear', () => {
        const blocked = { value: false };
        const controller = new SubmittedCompositionController();
        const instance = createEditor(blocked, controller);
        instance.view.dom.dispatchEvent(new Event('compositionstart'));
        controller.startSession(editorInputGuardKey.getState(instance.state)!);
        blocked.value = true;
        instance.view.dispatch(instance.state.tr.insertText(' sent').setMeta('composition', 1));
        controller.markStale();
        instance.view.dom.dispatchEvent(new Event('compositionstart'));
        expect(controller.isReadOnly()).toBe(true);

        const frozen = instance.state.doc;
        instance.view.dispatch(instance.state.tr.insertText(' stale').setMeta('composition', 1));
        expect(instance.state.doc.eq(frozen)).toBe(true);
        instance.view.dispatch(instance.state.tr.insertText(' cleanup').setMeta(SUBMITTED_COMPOSITION_CLEANUP_META, true));
        expect(instance.state.doc.textContent).toContain(' cleanup');
        expect(controller.isReadOnly()).toBe(true);
    });
});
