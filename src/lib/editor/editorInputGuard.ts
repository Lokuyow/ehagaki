import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

/** Keep the editable/focused surface while the composer owns a frozen document. */
export const EditorInputGuard = Extension.create<{ isInputBlocked: () => boolean }>({
    name: 'editorInputGuard',
    addOptions: () => ({ isInputBlocked: () => false }),
    addProseMirrorPlugins() {
        return [new Plugin({
            key: new PluginKey('editorInputGuard'),
            filterTransaction: (transaction) =>
                !transaction.docChanged || !this.options.isInputBlocked(),
        })];
    },
});
