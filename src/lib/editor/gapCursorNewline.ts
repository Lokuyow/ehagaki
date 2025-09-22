import { Extension } from '@tiptap/core';
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import { isTouchDevice } from '../utils/appDomUtils';

// なぜかiPhoneでしか動作しない
export const GapCursorNewlineExtension = Extension.create({
    name: 'gapCursorNewline',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('gap-cursor-newline'),
                props: {
                    handleKeyDown(view, event) {
                        // Enterキーのみ処理
                        if (event.key !== 'Enter') return false;

                        // タッチデバイスでフォーカスが外れている場合は処理をスキップ
                        if (isTouchDevice() && document.activeElement !== view.dom) {
                            return false;
                        }

                        const { state } = view;
                        const { selection, schema } = state;

                        // GapCursorの場合の詳細な判定
                        if (selection.constructor.name === 'GapCursor') {
                            // 新しい空パラグラフを作成
                            const paragraph = schema.nodes.paragraph.create();

                            // ギャップカーソルの位置に空パラグラフを挿入
                            const transaction = state.tr.insert(selection.from, paragraph);

                            // カーソルを新しいパラグラフ内に移動
                            const newPos = selection.from + 1;
                            const $pos = transaction.doc.resolve(newPos);
                            const textSelection = TextSelection.near($pos, 1);

                            if (textSelection) {
                                transaction.setSelection(textSelection);
                            }

                            view.dispatch(transaction);
                            return true;
                        }

                        // 画像ノードの直前・直後での特別な処理
                        const $pos = state.doc.resolve(selection.from);
                        const before = $pos.nodeBefore;
                        const after = $pos.nodeAfter;

                        // 画像ノードの前後にいる場合
                        if ((before && before.type.name === 'image') ||
                            (after && after.type.name === 'image')) {

                            // 空パラグラフを作成して挿入
                            const paragraph = schema.nodes.paragraph.create();
                            const transaction = state.tr.insert(selection.from, paragraph);

                            // カーソルを新しいパラグラフ内に移動
                            const newPos = selection.from + 1;
                            const $newPos = transaction.doc.resolve(newPos);
                            const newSelection = TextSelection.near($newPos, 1);

                            if (newSelection) {
                                transaction.setSelection(newSelection);
                                view.dispatch(transaction);
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
