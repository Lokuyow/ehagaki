import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { validateAndNormalizeImageUrl } from '../utils/editorUtils';

// 画像URLリストをテキストから抽出
function extractImageUrls(text: string): string[] {
    return text
        .split(/[\n ]+/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => validateAndNormalizeImageUrl(line))
        .filter((url): url is string => typeof url === 'string' && Boolean(url));
}

// 空パラグラフ判定（改善版）
function isInEmptyParagraph(selection: any, $from: any): boolean {
    const parent = $from.parent;
    return parent.type.name === 'paragraph' &&
        parent.textContent.trim().length === 0;
}

// 現在の選択位置が空のパラグラフ内かどうか判定
function getCurrentEmptyParagraphRange(state: any): { start: number; end: number } | null {
    const { selection } = state;
    const $from = state.doc.resolve(selection.from);

    if (isInEmptyParagraph(selection, $from)) {
        const paragraphDepth = $from.depth;
        const paragraphStart = $from.start(paragraphDepth);
        const paragraphEnd = $from.end(paragraphDepth);
        return { start: paragraphStart, end: paragraphEnd };
    }

    return null;
}

// 画像ノード配列生成
function createImageNodes(urls: string[], schema: any) {
    return urls.map(url =>
        schema.nodes.image.create({
            src: url,
            alt: 'Pasted image'
        })
    );
}

// 空パラグラフを削除（改善版）
function removeEmptyParagraphs(tx: any) {
    const doc = tx.doc;
    if (!doc) return tx;

    const deletions: [number, number][] = [];

    doc.descendants((node: any, pos: number) => {
        if (node.type.name !== 'paragraph') return;

        // 空のパラグラフかつ画像を含まない場合に削除対象とする
        if (node.textContent.trim().length === 0) {
            // ドキュメント全体が空のパラグラフ1つだけの場合は削除しない
            if (doc.childCount === 1 && doc.firstChild === node) {
                return;
            }

            let hasImage = false;
            node.descendants((n: any) => {
                if (n.type && n.type.name === 'image') {
                    hasImage = true;
                    return false;
                }
                return true;
            });

            if (!hasImage) {
                deletions.push([pos, pos + node.nodeSize]);
            }
        }
    });

    // 逆順でソートして後ろから削除
    deletions.sort((a, b) => b[0] - a[0]);
    deletions.forEach(([start, end]) => {
        tx = tx.delete(start, end);
    });

    return tx;
}

export const ImagePasteExtension = Extension.create({
    name: 'imagePaste',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('image-paste'),
                props: {
                    handlePaste: (view, event) => {
                        const text = event.clipboardData?.getData('text/plain') || '';
                        const imageUrls = extractImageUrls(text);

                        if (imageUrls.length > 0) {
                            event.preventDefault();

                            const { state, dispatch } = view;
                            const { tr, selection, schema } = state;

                            const imageNodes = createImageNodes(imageUrls, schema);
                            let transaction = tr;

                            // 現在位置が空のパラグラフ内かチェック
                            const emptyParagraphRange = getCurrentEmptyParagraphRange(state);

                            if (emptyParagraphRange && imageNodes.length > 0) {
                                // 空のパラグラフを最初の画像で置換（フォーカスを維持）
                                transaction = transaction.replaceWith(
                                    emptyParagraphRange.start,
                                    emptyParagraphRange.end,
                                    imageNodes[0]
                                );

                                // 残りの画像を順次追加
                                let insertPos = emptyParagraphRange.start + imageNodes[0].nodeSize;
                                for (let i = 1; i < imageNodes.length; i++) {
                                    transaction = transaction.insert(insertPos, imageNodes[i]);
                                    insertPos += imageNodes[i].nodeSize;
                                }
                            } else {
                                // 通常の挿入処理（フォーカスを維持）
                                let insertPos = selection.from;

                                imageNodes.forEach((imageNode, idx) => {
                                    transaction = transaction.insert(insertPos, imageNode);
                                    insertPos += imageNode.nodeSize;
                                });
                            }

                            // 空のパラグラフを削除
                            transaction = removeEmptyParagraphs(transaction);

                            dispatch(transaction);
                            return true;
                        }

                        return false;
                    },

                    // スマートフォン対応: inputイベントも処理
                    handleTextInput: (view, from, to, text) => {
                        // 改行を含む長いテキストが入力された場合のみ処理
                        if (text.includes('\n') || text.length > 20) {
                            const imageUrls = extractImageUrls(text);

                            if (imageUrls.length > 0) {
                                const { state, dispatch } = view;
                                const { tr, schema } = state;

                                const imageNodes = createImageNodes(imageUrls, schema);
                                let transaction = tr;

                                // 入力されたテキストを削除
                                transaction = transaction.delete(from, to);

                                // 画像ノードを挿入（フォーカスを維持）
                                let insertPos = from;
                                imageNodes.forEach((imageNode) => {
                                    transaction = transaction.insert(insertPos, imageNode);
                                    insertPos += imageNode.nodeSize;
                                });

                                // 空のパラグラフを削除
                                transaction = removeEmptyParagraphs(transaction);

                                dispatch(transaction);
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
