import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { validateAndNormalizeUrl, validateAndNormalizeImageUrl, isWordBoundary, cleanUrlEnd, isEditorDocEmpty, isParagraphWithOnlyImageUrl } from './editorUtils';
import { HASHTAG_REGEX } from '../constants';
import { updateHashtagData } from './store';

export const ContentTrackingExtension = Extension.create({
    name: 'contentTracking',

    addProseMirrorPlugins() {
        return [
            // ハッシュタグ装飾とURL再検証を統合したプラグイン
            new Plugin({
                key: new PluginKey('content-decoration-validation'),
                state: {
                    init() {
                        return DecorationSet.empty;
                    },
                    apply(tr) {
                        const doc = tr.doc;
                        const decorations: Decoration[] = [];

                        doc.descendants((node, pos) => {
                            if (node.isText && node.text) {
                                const text = node.text;

                                // ハッシュタグ装飾
                                const hashtagRegex = new RegExp(HASHTAG_REGEX.source, 'g');
                                let hashtagMatch;
                                while ((hashtagMatch = hashtagRegex.exec(text)) !== null) {
                                    const hashIndex = hashtagMatch[0].indexOf('#');
                                    if (hashIndex === -1) continue;
                                    const start = pos + hashtagMatch.index + hashIndex;
                                    const end = start + 1 + hashtagMatch[1].length;
                                    decorations.push(
                                        Decoration.inline(start, end, {
                                            class: 'hashtag'
                                        })
                                    );
                                }
                            }
                        });

                        return DecorationSet.create(doc, decorations);
                    }
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    }
                },
                // URL再検証のためのappendTransactionを追加
                appendTransaction: (transactions, oldState, newState) => {
                    if (!transactions.some(tr => tr.docChanged)) return;

                    const linkMark = newState.schema.marks.link;
                    const imageNodeType = newState.schema.nodes.image;
                    if (!linkMark) return;

                    let tr: any = null;

                    newState.doc.descendants((node, pos) => {
                        if (!node.isText || !node.text) return;

                        const text = node.text;
                        const hasLinkMark = node.marks?.some(m => m.type === linkMark);

                        // 既存のリンクマークを一旦すべて削除
                        if (hasLinkMark) {
                            tr = tr || newState.tr;
                            tr.removeMark(pos, pos + text.length, linkMark);
                        }

                        // より柔軟なURL検出パターン（入力中も考慮）
                        const urlRegex = /https?:\/\/[^\s\u3000]+/gi;
                        let urlMatch;

                        while ((urlMatch = urlRegex.exec(text)) !== null) {
                            if (typeof urlMatch.index !== 'number') continue;

                            const matchStart = urlMatch.index;
                            const matchEnd = matchStart + urlMatch[0].length;

                            // 前の文字が境界文字（スペース、改行、全角スペース、文字列開始）かチェック
                            const prevChar = matchStart > 0 ? text[matchStart - 1] : undefined;

                            // URLの前に境界文字以外がある場合はスキップ
                            if (!isWordBoundary(prevChar)) {
                                continue;
                            }

                            // URLの末尾処理（より柔軟に）
                            const originalUrl = urlMatch[0];
                            const { cleanUrl, actualLength } = cleanUrlEnd(originalUrl);
                            const actualEnd = matchStart + actualLength;

                            // 画像URLなら画像ノードに置換
                            const normalizedImageUrl = validateAndNormalizeImageUrl(cleanUrl);
                            if (normalizedImageUrl && imageNodeType) {
                                tr = tr || newState.tr;
                                const start = pos + matchStart;
                                const end = pos + actualEnd;

                                // 親ノードの詳細情報を取得
                                const $start = newState.doc.resolve(start);
                                const parentNode = $start.parent;

                                // より正確な空パラグラフ判定
                                const isInEmptyParagraph = parentNode.type.name === 'paragraph' &&
                                    parentNode.content.size === (end - start);

                                // パラグラフが画像URLのみを含むかも判定
                                const isOnlyImageUrlInParagraph = isParagraphWithOnlyImageUrl(parentNode, end - start);

                                // 全文書が空かどうかもチェック
                                const isDocEmpty = isEditorDocEmpty(newState);

                                // 画像ノードを作成してテキストを置換
                                const imageNode = imageNodeType.create({
                                    src: normalizedImageUrl,
                                    alt: 'Image'
                                });

                                // パラグラフが画像URLのみを含む場合、または空のパラグラフの場合
                                if (isInEmptyParagraph || isOnlyImageUrlInParagraph) {
                                    // より正確な位置計算
                                    const paragraphDepth = $start.depth;
                                    const paragraphStart = $start.start(paragraphDepth);
                                    const paragraphEnd = $start.end(paragraphDepth);

                                    // 文書全体が空の場合、または実質的に単一の画像URL用パラグラフの場合
                                    if (isDocEmpty || (newState.doc.childCount === 1 && isOnlyImageUrlInParagraph)) {
                                        // より確実な文書全体置換
                                        tr = tr.delete(0, newState.doc.content.size).insert(0, imageNode);
                                    } else {
                                        // 通常のパラグラフ置換
                                        tr = tr.replaceWith(paragraphStart, paragraphEnd, imageNode);
                                    }
                                } else {
                                    // 通常の置換
                                    tr = tr.replaceWith(start, end, imageNode);
                                }

                                // URLの処理が完了したらループを抜ける
                                break;
                            }

                            // より緩い検証（入力中のURLも考慮）
                            // 基本的なURL構造があれば受け入れる
                            const isValidUrl = /^https?:\/\/[a-zA-Z0-9]/.test(cleanUrl) && cleanUrl.length > 8;

                            if (isValidUrl) {
                                // utils関数でのバリデーションは最終確認のみ
                                const normalizedUrl = validateAndNormalizeUrl(cleanUrl);
                                const finalUrl = normalizedUrl || cleanUrl; // バリデーション失敗でも基本構造があれば使用

                                tr = tr || newState.tr;
                                const start = pos + matchStart;
                                const end = pos + actualEnd;
                                const mark = linkMark.create({ href: finalUrl });
                                tr.addMark(start, end, mark);
                            }
                        }
                    });

                    if (tr && tr.docChanged) {
                        return tr;
                    }
                    return null;
                }
            }),
            // コンテンツ更新追跡プラグイン
            new Plugin({
                key: new PluginKey('content-update-tracker'),
                state: {
                    init: () => null,
                    apply: (tr) => {
                        if (tr.docChanged) {
                            // デバウンス処理付きでハッシュタグデータを更新
                            this.storage.updateTimeout && clearTimeout(this.storage.updateTimeout);
                            this.storage.updateTimeout = setTimeout(() => {
                                const plainText = tr.doc.textContent;
                                updateHashtagData(plainText);

                                // カスタムイベント発火（外部コンポーネント用）
                                const event = new CustomEvent('editor-content-changed', {
                                    detail: { plainText }
                                });
                                window.dispatchEvent(event);
                            }, 300);
                        }
                        return null;
                    }
                }
            })
        ];
    },

    addStorage() {
        return {
            // setTimeout の戻り値型を明示（ブラウザ環境）
            updateTimeout: null as ReturnType<typeof setTimeout> | null
        };
    },

    onDestroy() {
        if (this.storage.updateTimeout) {
            clearTimeout(this.storage.updateTimeout);
        }
    }
});
