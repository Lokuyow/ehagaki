import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { validateAndNormalizeUrl, validateAndNormalizeImageUrl, isWordBoundary, cleanUrlEnd, isEditorDocEmpty, isParagraphWithOnlyImageUrl } from '../utils/editorUtils';
import { updateHashtagData, getHashtagRangesFromDoc } from '../tags/hashtagManager';

/**
 * ハッシュタグのデコレーション（装飾）を生成する関数
 * ProseMirror DecorationSet: ドキュメント内の範囲にスタイル/属性を適用
 */
function createHashtagDecorations(doc: import('@tiptap/pm/model').Node): DecorationSet {
    const ranges = getHashtagRangesFromDoc(doc);
    const decorations = ranges.map(({ from, to }) =>
        Decoration.inline(from, to, { class: 'hashtag' })
    );
    return DecorationSet.create(doc, decorations);
}

/**
 * 画像URL処理: 画像URLを画像ノードに置換
 * 段落が空または画像URLのみの場合は段落全体を置換
 */
function processImageUrl(
    tr: import('@tiptap/pm/state').Transaction,
    state: import('@tiptap/pm/state').EditorState,
    imageNodeType: import('@tiptap/pm/model').NodeType,
    normalizedImageUrl: string,
    start: number,
    end: number
): import('@tiptap/pm/state').Transaction {
    const $start = state.doc.resolve(start);
    const parentNode = $start.parent;
    const isInEmptyParagraph = parentNode.type.name === 'paragraph' &&
        parentNode.textContent.trim().length === 0;
    const isOnlyImageUrlInParagraph = isParagraphWithOnlyImageUrl(parentNode, end - start);
    const isDocEmpty = isEditorDocEmpty(state);

    const imageNode = imageNodeType.create({
        src: normalizedImageUrl,
        alt: 'Image'
    });

    // 段落が空またはURLのみの場合は段落全体を置換
    if (isInEmptyParagraph || isOnlyImageUrlInParagraph) {
        const paragraphDepth = $start.depth;
        const paragraphStart = $start.start(paragraphDepth);
        const paragraphEnd = $start.end(paragraphDepth);

        // ドキュメント全体が空または1段落のみの場合
        if (isDocEmpty || (state.doc.childCount === 1 && isOnlyImageUrlInParagraph)) {
            return tr.delete(0, state.doc.content.size).insert(0, imageNode);
        }
        return tr.replaceWith(paragraphStart, paragraphEnd, imageNode);
    }

    // インライン置換
    return tr.replaceWith(start, end, imageNode);
}

/**
 * リンクマーク処理: URLにリンクマークを適用
 */
function processLinkMark(
    tr: import('@tiptap/pm/state').Transaction,
    linkMark: import('@tiptap/pm/model').MarkType,
    normalizedUrl: string,
    start: number,
    end: number
): import('@tiptap/pm/state').Transaction {
    const mark = linkMark.create({ href: normalizedUrl });
    return tr.addMark(start, end, mark);
}

/**
 * テキスト中のURLや画像URLを検出し、リンクや画像ノードへ変換する関数
 * ProseMirror appendTransaction: ドキュメント変更後に追加のトランザクションを適用
 */
function processLinksAndImages(
    newState: import('@tiptap/pm/state').EditorState
): import('@tiptap/pm/state').Transaction | null {
    const linkMark = newState.schema.marks.link;
    const imageNodeType = newState.schema.nodes.image;

    if (!linkMark) return null;

    let tr = newState.tr;
    let hasChanges = false;
    const urlRegex = /https?:\/\/[^\s\u3000]+/gi;

    newState.doc.descendants((node, pos) => {
        if (!node.isText || !node.text) return;

        const text = node.text;
        const hasLinkMark = node.marks?.some(m => m.type === linkMark) ?? false;

        // 既存のリンクマークを削除（再処理のため）
        if (hasLinkMark) {
            tr.removeMark(pos, pos + text.length, linkMark);
            hasChanges = true;
        }

        // URL検出と処理
        let urlMatch: RegExpExecArray | null;
        while ((urlMatch = urlRegex.exec(text)) !== null) {
            if (typeof urlMatch.index !== 'number') continue;

            const matchStart = urlMatch.index;
            const originalUrl = urlMatch[0];
            const prevChar = matchStart > 0 ? text[matchStart - 1] : undefined;

            // 単語境界チェック
            if (!isWordBoundary(prevChar)) continue;

            const { cleanUrl, actualLength } = cleanUrlEnd(originalUrl);
            const matchEnd = matchStart + actualLength;
            const start = pos + matchStart;
            const end = pos + matchEnd;

            // 画像URL処理
            const normalizedImageUrl = validateAndNormalizeImageUrl(cleanUrl);
            if (normalizedImageUrl && imageNodeType) {
                tr = processImageUrl(tr, newState, imageNodeType, normalizedImageUrl, start, end);
                hasChanges = true;
                break; // 画像ノード挿入後は処理を中断
            }

            // 通常のURL処理
            const isValidUrl = /^https?:\/\/[a-zA-Z0-9]/.test(cleanUrl) && cleanUrl.length > 8;
            if (isValidUrl) {
                const normalizedUrl = validateAndNormalizeUrl(cleanUrl) || cleanUrl;
                tr = processLinkMark(tr, linkMark, normalizedUrl, start, end);
                hasChanges = true;
            }
        }
    });

    // トランザクションに変更があり、かつドキュメントが変更された場合のみ返す
    return (hasChanges && tr.docChanged) ? tr : null;
}

/**
 * ContentTracking Extension
 * 
 * 責務:
 * 1. ハッシュタグの装飾 (HashtagDecorationPlugin)
 * 2. URL/画像URLの自動変換 (LinkAndImagePlugin)
 * 3. コンテンツ変更の追跡・通知 (ContentUpdatePlugin)
 */
export const ContentTrackingExtension = Extension.create({
    name: 'contentTracking',

    addStorage() {
        return {
            updateTimeout: null as ReturnType<typeof setTimeout> | null
        };
    },

    // ProseMirrorプラグインを追加するメソッド
    addProseMirrorPlugins() {
        const storage = this.storage;

        return [
            // Plugin 1: ハッシュタグの装飾
            // ProseMirror Decoration: ドキュメントの見た目を変更（DOMに反映）
            new Plugin({
                key: new PluginKey('hashtag-decoration'),
                state: {
                    init: (_, { doc }) => createHashtagDecorations(doc),
                    apply(tr, oldDecoSet) {
                        // ドキュメント変更時のみ再計算
                        if (tr.docChanged) {
                            return createHashtagDecorations(tr.doc);
                        }
                        // マッピング: 位置の変更を追跡（挿入・削除時にデコレーションの位置を調整）
                        return oldDecoSet.map(tr.mapping, tr.doc);
                    }
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    }
                }
            }),

            // Plugin 2: URL/画像URLの自動変換
            // ProseMirror appendTransaction: 他のトランザクション後に追加処理を実行
            new Plugin({
                key: new PluginKey('link-and-image-conversion'),
                appendTransaction: (transactions, _oldState, newState) => {
                    // ドキュメント変更がある場合のみ処理
                    if (!transactions.some(tr => tr.docChanged)) return null;
                    return processLinksAndImages(newState);
                }
            }),

            // Plugin 3: コンテンツ更新の追跡・通知
            // Debounce処理: 連続した変更を一定時間後にまとめて処理
            new Plugin({
                key: new PluginKey('content-update-tracker'),
                state: {
                    init: () => null,
                    apply(tr) {
                        if (tr.docChanged) {
                            // 既存のタイムアウトをクリア
                            if (storage.updateTimeout) {
                                clearTimeout(storage.updateTimeout);
                            }

                            // 300ms後にハッシュタグデータ更新とイベント発火
                            storage.updateTimeout = setTimeout(() => {
                                updateHashtagData(tr.doc);
                                window.dispatchEvent(new CustomEvent('editor-content-changed', {
                                    detail: { plainText: tr.doc.textContent }
                                }));
                            }, 300);
                        }
                        return null;
                    }
                }
            })
        ];
    },

    // 拡張破棄時にクリーンアップ処理を行うメソッド
    onDestroy() {
        if (this.storage.updateTimeout) {
            clearTimeout(this.storage.updateTimeout);
        }
    }
});
