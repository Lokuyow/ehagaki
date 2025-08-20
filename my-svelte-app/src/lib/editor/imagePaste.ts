import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { validateAndNormalizeImageUrl } from './editorUtils';

// 画像URLリストをテキストから抽出
function extractImageUrls(text: string): string[] {
    return text
        .split(/[\n ]+/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => validateAndNormalizeImageUrl(line))
        .filter((url): url is string => typeof url === 'string' && Boolean(url));
}

// 空パラグラフ判定
function isInEmptyParagraph(selection: any, $from: any): boolean {
    const parent = $from.parent;
    return selection.empty &&
        parent.type.name === 'paragraph' &&
        parent.textContent.trim().length === 0;
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

// 空パラグラフ削除
function removeEmptyParagraphs(tx: any) {
    const doc = tx.doc;
    if (!doc) return tx;
    const deletions: [number, number][] = [];
    doc.descendants((node: any, pos: number) => {
        if (node.type.name !== 'paragraph') return;
        if (node.textContent.trim().length === 0) {
            if (doc.childCount === 1) return;
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
                            const $from = state.doc.resolve(selection.from);

                            const imageNodes = createImageNodes(imageUrls, schema);

                            let transaction = tr;

                            if (isInEmptyParagraph(selection, $from) && imageNodes.length > 0) {
                                const paragraphDepth = $from.depth;
                                const paragraphStart = $from.start(paragraphDepth);
                                const paragraphEnd = $from.end(paragraphDepth);

                                transaction = transaction.replaceWith(paragraphStart, paragraphEnd, imageNodes[0]);

                                let insertPos = paragraphStart + imageNodes[0].nodeSize;
                                for (let i = 1; i < imageNodes.length; i++) {
                                    transaction = transaction.insert(insertPos, imageNodes[i]);
                                    insertPos += imageNodes[i].nodeSize;
                                }
                            } else {
                                imageNodes.forEach((imageNode, idx) => {
                                    if (idx === 0) {
                                        transaction = transaction.replaceSelectionWith(imageNode);
                                    } else {
                                        const pos = transaction.selection.$to.pos;
                                        transaction = transaction.insert(pos, imageNode);
                                    }
                                });
                            }

                            transaction = removeEmptyParagraphs(transaction);

                            dispatch(transaction);
                            return true;
                        }

                        return false;
                    }
                }
            })
        ];
    }
});
