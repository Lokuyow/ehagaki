import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { validateAndNormalizeImageUrl, validateAndNormalizeVideoUrl } from '../utils/editorUtils';

// メディアURL（画像または動画）をテキストから抽出
interface MediaUrl {
    url: string;
    type: 'image' | 'video';
}

function extractMediaUrls(text: string): MediaUrl[] {
    return text
        .split(/[\n ]+/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            const imageUrl = validateAndNormalizeImageUrl(line);
            if (imageUrl) {
                return { url: imageUrl, type: 'image' as const };
            }
            const videoUrl = validateAndNormalizeVideoUrl(line);
            if (videoUrl) {
                return { url: videoUrl, type: 'video' as const };
            }
            return null;
        })
        .filter((item): item is MediaUrl => item !== null);
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

// メディアノード配列生成（画像または動画）
function createMediaNodes(mediaUrls: MediaUrl[], schema: any) {
    return mediaUrls.map((media, index) => {
        const timestamp = Date.now();
        if (media.type === 'image') {
            return schema.nodes.image.create({
                src: media.url,
                alt: 'Pasted image'
            });
        } else {
            // 動画ノードにはid属性を追加（削除機能のため）
            const videoId = `pasted-video-${timestamp}-${index}`;
            return schema.nodes.video.create({
                src: media.url,
                id: videoId
            });
        }
    });
}

// 空パラグラフを削除（改善版）
function removeEmptyParagraphs(tx: any) {
    const doc = tx.doc;
    if (!doc) return tx;

    const deletions: [number, number][] = [];

    doc.descendants((node: any, pos: number) => {
        if (node.type.name !== 'paragraph') return;

        // 空のパラグラフかつメディア（画像・動画）を含まない場合に削除対象とする
        if (node.textContent.trim().length === 0) {
            // ドキュメント全体が空のパラグラフ1つだけの場合は削除しない
            if (doc.childCount === 1 && doc.firstChild === node) {
                return;
            }

            let hasMedia = false;
            node.descendants((n: any) => {
                if (n.type && (n.type.name === 'image' || n.type.name === 'video')) {
                    hasMedia = true;
                    return false;
                }
                return true;
            });

            if (!hasMedia) {
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
                        const mediaUrls = extractMediaUrls(text);

                        if (mediaUrls.length > 0) {
                            event.preventDefault();

                            const { state, dispatch } = view;
                            const { tr, selection, schema } = state;

                            const mediaNodes = createMediaNodes(mediaUrls, schema);
                            let transaction = tr;

                            // 現在位置が空のパラグラフ内かチェック
                            const emptyParagraphRange = getCurrentEmptyParagraphRange(state);

                            if (emptyParagraphRange && mediaNodes.length > 0) {
                                // 空のパラグラフを最初のメディアで置換（フォーカスを維持）
                                transaction = transaction.replaceWith(
                                    emptyParagraphRange.start,
                                    emptyParagraphRange.end,
                                    mediaNodes[0]
                                );

                                // 残りのメディアを順次追加
                                let insertPos = emptyParagraphRange.start + mediaNodes[0].nodeSize;
                                for (let i = 1; i < mediaNodes.length; i++) {
                                    transaction = transaction.insert(insertPos, mediaNodes[i]);
                                    insertPos += mediaNodes[i].nodeSize;
                                }
                            } else {
                                // 通常の挿入処理（フォーカスを維持）
                                let insertPos = selection.from;

                                mediaNodes.forEach((mediaNode: any) => {
                                    transaction = transaction.insert(insertPos, mediaNode);
                                    insertPos += mediaNode.nodeSize;
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
                            const mediaUrls = extractMediaUrls(text);

                            if (mediaUrls.length > 0) {
                                const { state, dispatch } = view;
                                const { tr, schema } = state;

                                const mediaNodes = createMediaNodes(mediaUrls, schema);
                                let transaction = tr;

                                // 入力されたテキストを削除
                                transaction = transaction.delete(from, to);

                                // メディアノードを挿入（フォーカスを維持）
                                let insertPos = from;
                                mediaNodes.forEach((mediaNode: any) => {
                                    transaction = transaction.insert(insertPos, mediaNode);
                                    insertPos += mediaNode.nodeSize;
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
