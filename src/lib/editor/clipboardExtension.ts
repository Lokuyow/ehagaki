/**
 * ClipboardExtension
 * 
 * 責務:
 * - ProseMirrorのクリップボードイベント処理
 * - テキスト→ProseMirror段落ノード変換（ペースト時）
 * - ProseMirrorノード→テキスト変換（コピー時）
 * 
 * 機能:
 * - ペースト時に改行（\n）を段落ノードに変換
 * - CRLF, CR, LFの改行コードを統一的に処理
 * - 末尾の改行を適切に処理（余分な空行を作成しない）
 * - 空白行（改行のみの行）を維持
 * - コピー時にノードのコンテンツから改行を正しく抽出
 * - リッチテキスト（太字、イタリック）の場合は書式を保持
 * - 自アプリからのコピーの場合は連続空行を制限
 * 
 * Tiptap v2 / ProseMirror仕様:
 * - handlePaste: ペーストイベントのカスタム処理
 * - clipboardTextSerializer: テキストコピー時のシリアライズ処理
 */

import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Slice, Fragment } from 'prosemirror-model';
import type { Node as PMNode, Schema } from 'prosemirror-model';
import { normalizeClipboardText, serializeParagraphs } from '../utils/clipboardUtils';
import { debugClipboardData } from '../utils/clipboardDebug';
import { normalizeEmojiShortcode } from '../customEmoji';

// ================================================================================
// 内部ヘルパー関数
// ================================================================================

/**
 * テキスト行の配列をProseMirror段落ノードの配列に変換
 * 
 * ProseMirror仕様:
 * - 空行も空の段落ノードとして表現（空のテキストノード配列）
 * - 各段落は独立したブロックレベルノード
 * 
 * @param lines - テキスト行の配列
 * @param schema - ProseMirrorスキーマ
 * @returns ProseMirror段落ノードの配列
 */
function createParagraphNodes(lines: string[], schema: Schema): PMNode[] {
    return lines.map((line) => {
        // 空行の場合は空のテキストノード配列、それ以外はテキストノードを作成
        const textNodes = line.length > 0 ? [schema.text(line)] : [];
        return schema.nodes.paragraph.create(null, textNodes);
    });
}

/**
 * ProseMirrorノードからテキスト段落配列を抽出
 * 
 * ProseMirror仕様:
 * - paragraph: テキストブロック（空の場合もある）
 * - image/video: メディアノード（URLとして出力）
 * - その他のtextblock: テキストコンテンツを抽出
 * 
 * @param slice - ProseMirror Slice（コピー範囲のコンテンツ）
 * @returns 段落テキストの配列
 */
function extractParagraphsFromSlice(slice: Slice): string[] {
    const paragraphs: string[] = [];

    slice.content.forEach((node: PMNode) => {
        if (node.type.name === 'paragraph') {
            // 段落の内容をテキスト化（空の段落も空文字列として追加）
            let text = '';
            node.content.forEach((child: PMNode) => {
                if (child.isText) {
                    text += child.text || '';
                } else if (child.type.name === 'customEmoji') {
                    const shortcode = normalizeEmojiShortcode(child.attrs?.shortcode);
                    if (shortcode) {
                        text += `:${shortcode}:`;
                    }
                }
            });
            paragraphs.push(text);
        } else if (node.type.name === 'image' || node.type.name === 'video') {
            // メディアノードはURLとして出力
            const src = node.attrs?.src;
            if (src) {
                paragraphs.push(src);
            }
        } else if (node.isTextblock) {
            // その他のテキストブロック
            paragraphs.push(node.textContent);
        }
    });

    return paragraphs;
}

const NON_CONTENT_HTML_TAGS = new Set([
    'base',
    'head',
    'link',
    'meta',
    'noscript',
    'script',
    'style',
    'template',
    'title',
]);

const NON_TEXTUAL_LINK_TAGS = new Set([
    'audio',
    'br',
    'canvas',
    'embed',
    'iframe',
    'img',
    'object',
    'svg',
    'video',
]);

const SUBSTANTIVE_NON_TEXTUAL_HTML_TAGS = new Set([
    'audio',
    'button',
    'canvas',
    'embed',
    'iframe',
    'img',
    'input',
    'object',
    'picture',
    'select',
    'svg',
    'textarea',
    'video',
]);

function parseHttpUrl(value: string): URL | null {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
    } catch {
        return null;
    }
}

function hasOnlyNamedTextContent(anchor: Element): boolean {
    let hasText = false;

    const visit = (node: Node): boolean => {
        if (node.nodeType === Node.TEXT_NODE) {
            hasText ||= (node.textContent ?? '').trim().length > 0;
            return true;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return true;
        }

        const element = node as Element;
        if (NON_TEXTUAL_LINK_TAGS.has(element.tagName.toLowerCase())) {
            return false;
        }

        return Array.from(element.childNodes).every(visit);
    };

    return visit(anchor) && hasText;
}

function hasSubstantiveContentOutsideAnchor(node: Node, insideAnchor = false): boolean {
    if (node.nodeType === Node.TEXT_NODE) {
        return !insideAnchor && (node.textContent ?? '').trim().length > 0;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }

    const element = node as Element;
    const tagName = element.tagName.toLowerCase();
    if (NON_CONTENT_HTML_TAGS.has(tagName)) {
        return false;
    }

    if (SUBSTANTIVE_NON_TEXTUAL_HTML_TAGS.has(tagName)) {
        return !insideAnchor;
    }

    const isAnchor = tagName === 'a';
    return Array.from(element.childNodes).some((child) =>
        hasSubstantiveContentOutsideAnchor(child, insideAnchor || isAnchor),
    );
}

/**
 * Detects the address-bar "titled hyperlink" shape without depending on a
 * browser-specific UA or a particular HTML serialization.
 *
 * The original text is intentionally required to be exactly one URL. That
 * keeps the fallback insertion identical to the existing plain-text path.
 */
function isFriendlyUrlClipboard(text: string, html: string): boolean {
    if (!text || text.trim() !== text || /\s/.test(text)) {
        return false;
    }

    const plainUrl = parseHttpUrl(text);
    if (!plainUrl) {
        return false;
    }

    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const anchors = Array.from(parsed.querySelectorAll('a'));
    if (anchors.length !== 1) {
        return false;
    }

    const [anchor] = anchors;
    const href = anchor.getAttribute('href');
    const linkedUrl = href ? parseHttpUrl(href) : null;
    if (!linkedUrl || linkedUrl.href !== plainUrl.href || !hasOnlyNamedTextContent(anchor)) {
        return false;
    }

    const root = parsed.body ?? parsed.documentElement;
    return !hasSubstantiveContentOutsideAnchor(root);
}

// ================================================================================
// ClipboardExtension 定義
// ================================================================================

export const ClipboardExtension = Extension.create({
    name: 'clipboardExtension',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('clipboardExtension'),
                props: {
                    /**
                     * handlePaste
                     * 
                     * ProseMirror仕様:
                     * - ペーストイベントをインターセプトしてカスタム処理を実行
                     * - trueを返すとデフォルト処理をスキップ
                     * - falseを返すとデフォルト処理に委譲
                     * 
                     * 処理フロー:
                     * 1. ClipboardDataからプレーンテキストを取得
                     * 2. HTMLが含まれる場合はリッチテキストかチェック
                     * 3. URLを含む場合はTiptapのLink機能に委譲
                     * 4. テキストを正規化して行配列に変換
                     * 5. 行配列を段落ノードに変換
                     * 6. Sliceを作成してエディタに挿入
                     */
                    handlePaste(view, event, slice) {
                        if (view.editable === false) {
                            event.preventDefault();
                            return true;
                        }

                        const { state, dispatch } = view;
                        const { clipboardData } = event;

                        if (!clipboardData) {
                            return false;
                        }

                        // デバッグ情報を出力（開発環境のみ）
                        if (import.meta.env.MODE === 'development') {
                            debugClipboardData(clipboardData, 'Paste');
                        }

                        // 画像ファイルのペーストは別処理に委譲
                        const hasFiles = clipboardData.files && clipboardData.files.length > 0;
                        if (hasFiles) {
                            return false; // MediaPasteExtensionが処理
                        }

                        // プレーンテキストを取得
                        const text = clipboardData.getData('text/plain');
                        if (!text) {
                            return false; // テキストがない場合はデフォルト処理
                        }

                        // HTMLが含まれる場合の処理
                        const hasHtml = clipboardData.types.includes('text/html');
                        let collapseEmptyLines = false;

                        if (hasHtml) {
                            const html = clipboardData.getData('text/html');

                            // Edge and similar address bars may expose a URL as
                            // plain text while the HTML representation contains
                            // only a titled link. Route this narrow shape through
                            // the existing plain-text paste path so the title is
                            // not inserted as the document content.
                            const isFriendlyUrl = isFriendlyUrlClipboard(text, html);

                            // リッチテキスト（太字、イタリック、リンク）を検出
                            // リッチテキストの場合はデフォルト処理に委譲して書式を保持
                            const hasRichFormatting =
                                html.includes('<strong>') ||
                                html.includes('<b>') ||
                                html.includes('<em>') ||
                                html.includes('<i>') ||
                                html.includes('<a ') || // リンクタグを検出
                                html.includes('<a>');

                            if (hasRichFormatting && !isFriendlyUrl) {
                                return false; // デフォルト処理で書式を保持（Tiptap Link機能が処理）
                            }

                            // 自アプリからのコピー（data-block + data-editor）を検出
                            // このパターンの場合、連続空行を制限する
                            const isFromOwnApp =
                                html.includes('data-block="true"') &&
                                html.includes('data-editor=');

                            collapseEmptyLines = isFromOwnApp;

                            if (import.meta.env.MODE === 'development') {
                                console.log('📋 From own app:', isFromOwnApp);
                            }
                        }

                        // テキストを正規化して行配列に変換
                        // 注意: URLを含むプレーンテキストの場合も段落ノードとして挿入し、
                        // ContentTrackingExtensionがappendTransactionでリンク化する
                        const { lines } = normalizeClipboardText(text, {
                            collapseEmptyLines,
                            maxConsecutiveEmptyLines: 1
                        });

                        // 空のテキストの場合はデフォルト処理に委譲
                        if (lines.length === 0) {
                            return false;
                        }

                        // 段落ノードベースで挿入（改行を段落境界として扱う）
                        // openStart=1, openEnd=1: 先頭段落はカーソル前テキストとマージ、
                        // 末尾段落はカーソル後テキストとマージ（標準エディタ動作）
                        const paragraphNodes = createParagraphNodes(lines, state.schema);
                        const fragment = Fragment.from(paragraphNodes);
                        const customSlice = new Slice(fragment, 1, 1);

                        if (import.meta.env.MODE === 'development') {
                            console.log('📋 handlePaste: paragraph-based paste', {
                                originalText: text,
                                lines: lines.length,
                                paragraphCount: paragraphNodes.length
                            });
                        }

                        // トランザクションを作成
                        // 
                        // Tiptap v3 UndoRedo拡張の仕様:
                        // - paste: trueを設定すると、このトランザクションがペースト操作として認識される
                        // - addToHistory: trueで履歴に記録（デフォルト動作だが明示的に設定）
                        // - uiEvent: 'paste'でペーストイベントとして記録
                        //
                        // UndoRedoの動作:
                        // - ペースト操作は自動的に独立した履歴グループとして扱われる
                        // - newGroupDelay内でも、ペースト操作は必ず新しいグループを開始する
                        const tr = state.tr
                            .replaceSelection(customSlice)
                            .setMeta('paste', true)
                            .setMeta('uiEvent', 'paste')
                            .setMeta('addToHistory', true);

                        if (import.meta.env.MODE === 'development') {
                            console.log('📋 handlePaste: dispatching transaction', {
                                docChanged: tr.docChanged,
                                steps: tr.steps.length,
                                linesCount: lines.length
                            });
                        }

                        dispatch(tr);

                        return true;
                    },

                    /**
                     * clipboardTextSerializer
                     * 
                     * ProseMirror仕様:
                     * - コピー時のテキストシリアライズをカスタマイズ
                     * - Slice（コピー範囲）をプレーンテキストに変換
                     * 
                     * 注意: ブラウザClipboard APIが自動的にプラットフォームに応じた
                     *      改行コード（Windows: CRLF, Unix/Mac: LF）に変換するため、
                     *      ここでは常にLF(\n)を使用
                     */
                    clipboardTextSerializer(slice: Slice) {
                        const paragraphs = extractParagraphsFromSlice(slice);
                        return serializeParagraphs(paragraphs);
                    },
                },
            }),
        ];
    },
});
