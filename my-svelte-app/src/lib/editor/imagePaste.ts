import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { validateAndNormalizeImageUrl } from './editorUtils';

export const ImagePasteExtension = Extension.create({
    name: 'imagePaste',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('image-paste'),
                props: {
                    handlePaste: (view, event) => {
                        const text = event.clipboardData?.getData('text/plain') || '';

                        // 複数画像URL: 改行または半角スペース区切り対応
                        const items = text.split(/[\n ]+/).map(line => line.trim()).filter(Boolean);

                        // 画像URLのみ抽出
                        const imageUrls = items
                            .map(line => validateAndNormalizeImageUrl(line))
                            .filter(Boolean);

                        if (imageUrls.length > 0) {
                            event.preventDefault();

                            const { state, dispatch } = view;
                            const { tr, selection, schema } = state;

                            const $from = state.doc.resolve(selection.from);
                            const isInEmptyParagraph = selection.empty &&
                                $from.parent.type.name === 'paragraph' &&
                                $from.parent.content.size === 0;

                            const imageNodes = imageUrls.map(url =>
                                schema.nodes.image.create({
                                    src: url,
                                    alt: 'Pasted image'
                                })
                            );

                            let transaction = tr;

                            if (isInEmptyParagraph && imageNodes.length > 0) {
                                // パラグラフの位置を正確に計算
                                const paragraphDepth = $from.depth;
                                const paragraphStart = $from.start(paragraphDepth);
                                const paragraphEnd = $from.end(paragraphDepth);

                                // 空のパラグラフノード全体を画像ノードで置換
                                transaction = transaction.replaceWith(paragraphStart, paragraphEnd, imageNodes[0]);

                                // 2枚目以降も挿入
                                let insertPos = paragraphStart + imageNodes[0].nodeSize;
                                for (let i = 1; i < imageNodes.length; i++) {
                                    transaction = transaction.insert(insertPos, imageNodes[i]);
                                    insertPos += imageNodes[i].nodeSize;
                                }
                            } else {
                                // 通常の挿入
                                imageNodes.forEach((imageNode, idx) => {
                                    if (idx === 0) {
                                        transaction = transaction.replaceSelectionWith(imageNode);
                                    } else {
                                        const pos = transaction.selection.$to.pos;
                                        transaction = transaction.insert(pos, imageNode);
                                    }
                                });
                            }

                            dispatch(transaction);
                            return true;
                        }

                        // 画像URLがなければ通常の貼り付け
                        return false;
                    }
                }
            })
        ];
    }
});
