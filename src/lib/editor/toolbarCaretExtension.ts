import { Extension, type Editor as TipTapEditor } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

const toolbarCaretPluginKey = new PluginKey<boolean>('toolbarCaret');

export function showToolbarCaret(editor: TipTapEditor): void {
    editor.view.dispatch(
        editor.state.tr
            .setMeta(toolbarCaretPluginKey, true)
            .setMeta('addToHistory', false),
    );
}

function hideToolbarCaret(view: TipTapEditor['view']): void {
    if (!toolbarCaretPluginKey.getState(view.state)) {
        return;
    }

    view.dispatch(
        view.state.tr
            .setMeta(toolbarCaretPluginKey, false)
            .setMeta('addToHistory', false),
    );
}

export const ToolbarCaretExtension = Extension.create({
    name: 'toolbarCaret',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: toolbarCaretPluginKey,
                state: {
                    init: () => false,
                    apply(tr, visible) {
                        const nextVisible = tr.getMeta(toolbarCaretPluginKey);
                        return typeof nextVisible === 'boolean' ? nextVisible : visible;
                    },
                },
                props: {
                    decorations(state) {
                        if (!this.getState(state) || !state.selection.empty) {
                            return DecorationSet.empty;
                        }

                        const caret = Decoration.widget(
                            state.selection.from,
                            () => {
                                const element = document.createElement('span');
                                element.className = 'toolbar-caret';
                                element.setAttribute('aria-hidden', 'true');
                                element.contentEditable = 'false';
                                return element;
                            },
                            { key: 'toolbar-caret', side: -1 },
                        );

                        return DecorationSet.create(state.doc, [caret]);
                    },
                    handleDOMEvents: {
                        focus(view) {
                            hideToolbarCaret(view as TipTapEditor['view']);
                            return false;
                        },
                    },
                },
            }),
        ];
    },
});
