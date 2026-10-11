import { Extension, type Editor } from '@tiptap/core';
import { Plugin, PluginKey, Selection } from '@tiptap/pm/state';
import { isHistoryTransaction } from '@tiptap/pm/history';
import type { Node as PMNode } from '@tiptap/pm/model';
import { inspectReactionDocument } from '../reactionValue';

const reactionInputKey = new PluginKey<boolean>('reactionInput');
export function isReactionComposing(editor: Editor): boolean { return reactionInputKey.getState(editor.state) === true; }

export const ReactionInput = Extension.create<{ isActive: () => boolean }>({
    name: 'reactionInput',
    addOptions: () => ({ isActive: () => false }),
    addProseMirrorPlugins() {
        let baseline: { doc: PMNode; selection: Selection } | null = null;
        let frame: number | undefined;
        return [new Plugin<boolean>({
            key: reactionInputKey,
            state: { init: () => false, apply: (tr, value) => tr.getMeta(reactionInputKey)?.composing ?? value },
            filterTransaction: (tr, state) => {
                if (!tr.docChanged || !this.options.isActive() || tr.getMeta(reactionInputKey)?.rollback || isHistoryTransaction(tr)) return true;
                if (reactionInputKey.getState(state)) return true;
                const before = inspectReactionDocument(state.doc);
                const after = inspectReactionDocument(tr.doc);
                if (after.forbidden === 0 && after.count <= 1) return true;
                return (before.count > 1 || before.forbidden > 0)
                    && after.count <= before.count && after.forbidden <= before.forbidden;
            },
            view: view => {
                const win = view.dom.ownerDocument.defaultView!;
                const start = () => {
                    if (!this.options.isActive()) return;
                    if (frame !== undefined) win.cancelAnimationFrame(frame);
                    baseline = { doc: view.state.doc, selection: view.state.selection };
                    view.dispatch(view.state.tr.setMeta(reactionInputKey, { composing: true }).setMeta('addToHistory', false));
                };
                const end = () => {
                    if (!baseline) return;
                    // Reconcile after ProseMirror has consumed the composition's DOM mutations.
                    frame = win.requestAnimationFrame(() => {
                        frame = undefined;
                        const original = baseline;
                        baseline = null;
                        const current = inspectReactionDocument(view.state.doc);
                        const before = original && inspectReactionDocument(original.doc);
                        const tr = view.state.tr.setMeta(reactionInputKey, { composing: false, rollback: true }).setMeta('addToHistory', false);
                        if (original && before && this.options.isActive()
                            && !(current.forbidden === 0 && current.count <= 1)
                            && !(before.count > 1 || before.forbidden > 0 ? current.count <= before.count && current.forbidden <= before.forbidden : false)) {
                            tr.replaceWith(0, tr.doc.content.size, original.doc.content);
                            tr.setSelection(Selection.fromJSON(tr.doc, original.selection.toJSON()));
                        }
                        view.dispatch(tr);
                    });
                };
                view.dom.addEventListener('compositionstart', start, true);
                view.dom.addEventListener('compositionend', end, true);
                return { destroy() {
                    view.dom.removeEventListener('compositionstart', start, true);
                    view.dom.removeEventListener('compositionend', end, true);
                    if (frame !== undefined) win.cancelAnimationFrame(frame);
                    baseline = null;
                } };
            },
        })];
    },
});
