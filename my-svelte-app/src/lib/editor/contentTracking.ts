import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { validateAndNormalizeUrl, validateAndNormalizeImageUrl, isWordBoundary, cleanUrlEnd, isEditorDocEmpty, isParagraphWithOnlyImageUrl } from './editorUtils';
import { HASHTAG_REGEX } from '../constants';
import { updateHashtagData } from './stores/editorStore';

// ハッシュタグのデコレーション（装飾）を生成する関数
interface HashtagMatch extends RegExpExecArray {
    1: string; // The hashtag text (without #)
}

function getHashtagDecorations(doc: import('@tiptap/pm/model').Node): DecorationSet {
    const decorations: Decoration[] = [];
    doc.descendants((node: import('@tiptap/pm/model').Node, pos: number) => {
        if (!node.isText || !node.text) return;
        const text: string = node.text;
        const hashtagRegex: RegExp = new RegExp(HASHTAG_REGEX.source, 'g');
        let match: HashtagMatch | null;
        while ((match = hashtagRegex.exec(text) as HashtagMatch | null) !== null) {
            const hashIndex: number = match[0].indexOf('#');
            if (hashIndex === -1) continue;
            const start: number = pos + match.index + hashIndex;
            const end: number = start + 1 + match[1].length;
            decorations.push(
                Decoration.inline(start, end, { class: 'hashtag' })
            );
        }
    });
    return DecorationSet.create(doc, decorations);
}

// テキスト中のURLや画像URLを検出し、リンクや画像ノードへ変換する関数
function processLinksAndImages(
    newState: import('@tiptap/pm/state').EditorState
): import('@tiptap/pm/state').Transaction | null {
    const linkMark = newState.schema.marks.link;
    const imageNodeType = newState.schema.nodes.image;
    if (!linkMark) return null;

    let tr: import('@tiptap/pm/state').Transaction | null = null;
    newState.doc.descendants((node: import('@tiptap/pm/model').Node, pos: number) => {
        if (!node.isText || !node.text) return;
        const text: string = node.text;
        const hasLinkMark: boolean = node.marks?.some(m => m.type === linkMark) ?? false;

        if (hasLinkMark) {
            tr = tr || newState.tr;
            tr.removeMark(pos, pos + text.length, linkMark);
        }

        const urlRegex: RegExp = /https?:\/\/[^\s\u3000]+/gi;
        let urlMatch: RegExpExecArray | null;
        while ((urlMatch = urlRegex.exec(text)) !== null) {
            if (typeof urlMatch.index !== 'number') continue;
            const matchStart: number = urlMatch.index;
            const originalUrl: string = urlMatch[0];
            const prevChar: string | undefined = matchStart > 0 ? text[matchStart - 1] : undefined;
            if (!isWordBoundary(prevChar)) continue;

            const { cleanUrl, actualLength }: { cleanUrl: string; actualLength: number } = cleanUrlEnd(originalUrl);
            const matchEnd: number = matchStart + actualLength;

            // 画像URLの場合
            const normalizedImageUrl: string | null = validateAndNormalizeImageUrl(cleanUrl);
            if (normalizedImageUrl && imageNodeType) {
                tr = tr || newState.tr;
                const start: number = pos + matchStart;
                const end: number = pos + matchEnd;
                const $start = newState.doc.resolve(start);
                const parentNode = $start.parent;
                const isInEmptyParagraph: boolean = parentNode.type.name === 'paragraph' &&
                    parentNode.textContent.trim().length === 0;
                const isOnlyImageUrlInParagraph: boolean = isParagraphWithOnlyImageUrl(parentNode, end - start);
                const isDocEmpty: boolean = isEditorDocEmpty(newState);
                const imageNode = imageNodeType.create({
                    src: normalizedImageUrl,
                    alt: 'Image'
                });

                if (isInEmptyParagraph || isOnlyImageUrlInParagraph) {
                    const paragraphDepth: number = $start.depth;
                    const paragraphStart: number = $start.start(paragraphDepth);
                    const paragraphEnd: number = $start.end(paragraphDepth);
                    if (isDocEmpty || (newState.doc.childCount === 1 && isOnlyImageUrlInParagraph)) {
                        tr = tr.delete(0, newState.doc.content.size).insert(0, imageNode);
                    } else {
                        tr = tr.replaceWith(paragraphStart, paragraphEnd, imageNode);
                    }
                } else {
                    tr = tr.replaceWith(start, end, imageNode);
                }
                break;
            }

            // 通常のURLの場合
            const isValidUrl: boolean = /^https?:\/\/[a-zA-Z0-9]/.test(cleanUrl) && cleanUrl.length > 8;
            if (isValidUrl) {
                const normalizedUrl: string | null = validateAndNormalizeUrl(cleanUrl);
                const finalUrl: string = normalizedUrl || cleanUrl;
                tr = tr || newState.tr;
                const start: number = pos + matchStart;
                const end: number = pos + matchEnd;
                const mark = linkMark.create({ href: finalUrl });
                tr.addMark(start, end, mark);
            }
        }
    });
    return tr !== null && (tr as import('@tiptap/pm/state').Transaction).docChanged ? tr : null;
}

export const ContentTrackingExtension = Extension.create({
    name: 'contentTracking',

    // ProseMirrorプラグインを追加するメソッド
    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('content-decoration-validation'),
                state: {
                    init: (_, { doc }) => getHashtagDecorations(doc),
                    apply(tr, _old) {
                        return getHashtagDecorations(tr.doc);
                    }
                },
                props: {
                    decorations(state) {
                        return getHashtagDecorations(state.doc);
                    }
                },
                appendTransaction: (transactions, _oldState, newState) => {
                    if (!transactions.some(tr => tr.docChanged)) return;
                    return processLinksAndImages(newState);
                }
            }),
            new Plugin({
                key: new PluginKey('content-update-tracker'),
                state: {
                    init: () => null,
                    apply: (tr) => {
                        if (tr.docChanged) {
                            this.storage.updateTimeout && clearTimeout(this.storage.updateTimeout);
                            this.storage.updateTimeout = setTimeout(() => {
                                const plainText = tr.doc.textContent;
                                updateHashtagData(plainText);
                                window.dispatchEvent(new CustomEvent('editor-content-changed', {
                                    detail: { plainText }
                                }));
                            }, 300);
                        }
                        return null;
                    }
                }
            })
        ];
    },

    // ストレージ（内部状態）を初期化するメソッド
    addStorage() {
        return {
            updateTimeout: null as ReturnType<typeof setTimeout> | null
        };
    },

    // 拡張破棄時にクリーンアップ処理を行うメソッド
    onDestroy() {
        if (this.storage.updateTimeout) {
            clearTimeout(this.storage.updateTimeout);
        }
    }
});
