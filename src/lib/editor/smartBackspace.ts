import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { isTouchDevice } from '../utils/appDomUtils';

export const SmartBackspaceExtension = Extension.create({
    name: 'smartBackspace',
    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('smart-backspace'),
                props: {
                    handleKeyDown(view, event) {
                        // Backspaceキーのみ
                        if (event.key !== 'Backspace') return false;

                        // タッチデバイスでフォーカスが外れている場合は処理をスキップ
                        if (isTouchDevice() && document.activeElement !== view.dom) {
                            return false;
                        }

                        const { state } = view;
                        const { selection, doc } = state;
                        // キャレットが先頭かつパラグラフの先頭
                        if (selection.empty && selection.from === 1) {
                            const firstNode = doc.firstChild;
                            const secondNode = doc.childCount > 1 ? doc.child(1) : null;
                            // 先頭が空パラグラフ、次が画像ノード
                            if (
                                firstNode &&
                                firstNode.type.name === 'paragraph' &&
                                firstNode.content.size === 0 &&
                                secondNode &&
                                secondNode.type.name === 'image'
                            ) {
                                // パラグラフを削除
                                view.dispatch(
                                    state.tr.delete(0, firstNode.nodeSize)
                                );
                                return true;
                            }
                        }
                        return false;
                    }
                }
            })
        ];
    }
});
