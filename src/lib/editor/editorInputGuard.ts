import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, type EditorState, type Transaction } from '@tiptap/pm/state';
import type {
    CompositionObserverState,
    SubmittedCompositionController,
} from './submittedComposition';

export const editorInputGuardKey = new PluginKey<CompositionObserverState>('editorInputGuard');

/** Keep the editable/focused surface while the composer owns a frozen document. */
export const EditorInputGuard = Extension.create<{
    isInputBlocked: () => boolean;
    compositionController?: SubmittedCompositionController;
    isCompositionInputAllowed?: () => boolean;
}>({
    name: 'editorInputGuard',
    addOptions: () => ({
        isInputBlocked: () => false,
        compositionController: undefined,
        isCompositionInputAllowed: () => false,
    }),
    addProseMirrorPlugins() {
        const controller = this.options.compositionController;
        return [new Plugin({
            key: editorInputGuardKey,
            state: {
                init: () => ({ idsByGeneration: new Map() }),
                apply: (transaction: Transaction, value: CompositionObserverState) => {
                    const compositionId = transaction.getMeta('composition');
                    if (compositionId === undefined || !controller) return value;
                    const idsByGeneration = new Map(value.idsByGeneration);
                    idsByGeneration.set(controller.getCurrentGeneration(), compositionId);
                    return { idsByGeneration };
                },
            },
            filterTransaction: (transaction: Transaction, state: EditorState) => {
                if (!transaction.docChanged || !this.options.isInputBlocked()) {
                    return true;
                }

                if (controller) {
                    const decision = controller.decideTransaction({
                        transaction,
                        observerState: editorInputGuardKey.getState(state) ?? { idsByGeneration: new Map() },
                    });
                    if (decision !== 'default') return decision === 'allow';
                }

                return Boolean(
                    this.options.isCompositionInputAllowed?.() &&
                    transaction.getMeta('composition') !== undefined,
                );
            },
        })];
    },
});
