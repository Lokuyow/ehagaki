import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

/** Keep the editable/focused surface while the composer owns a frozen document. */
export const EditorInputGuard = Extension.create<{
    isInputBlocked: () => boolean;
    isCompositionInputAllowed?: () => boolean;
}>({
    name: 'editorInputGuard',
    addOptions: () => ({
        isInputBlocked: () => false,
        isCompositionInputAllowed: () => false,
    }),
    addProseMirrorPlugins() {
        return [new Plugin({
            key: new PluginKey('editorInputGuard'),
            filterTransaction: (transaction) => {
                if (!transaction.docChanged || !this.options.isInputBlocked()) {
                    return true;
                }

                return Boolean(
                    this.options.isCompositionInputAllowed?.() &&
                    transaction.getMeta('composition') !== undefined,
                );
            },
        })];
    },
});
