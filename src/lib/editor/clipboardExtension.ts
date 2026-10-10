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
 * - 外部rich pasteはclipboardのtext/plainをsourceとして軽量なmarkup cleanupを適用
 * - plain-only pasteはMarkdown記法を変更せず、改行だけを正規化
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
import { normalizeEmojiShortcode } from '../customEmoji';
import { cleanupExternalRichPasteLines } from './clipboardTextCleanup';

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

function isFromCurrentEditorClipboard(html: string): boolean {
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    return parsed.querySelector('p.editor-paragraph[data-pm-slice]') !== null;
}

// ================================================================================
// ClipboardExtension 定義
// ================================================================================

export const ClipboardExtension = Extension.create({
    name: 'clipboardExtension',

    addProseMirrorPlugins() {
        let pastedAsPlainText = false;

        return [
            new Plugin({
                key: new PluginKey('clipboardExtension'),
                props: {
                    transformPastedText(text, plain) {
                        pastedAsPlainText = plain;
                        return text;
                    },
                    transformPastedHTML(html) {
                        pastedAsPlainText = false;
                        return html;
                    },
                    /**
                     * handlePaste
                     * 
                     * ProseMirror仕様:
                     * - ペーストイベントをインターセプトしてカスタム処理を実行
                     * - trueを返すとデフォルト処理をスキップ
                     * - falseを返すとデフォルト処理に委譲
                     * 
                     * 処理フロー:
                     * 1. file/media clipboard は既存の経路へ委譲
                     * 2. HTML付き通常pasteだけplain textのmarkup cleanupを適用
                     * 3. plain textがなければHTMLの既定ProseMirror処理へ委譲
                     * 4. 1つのpaste transactionで選択範囲へ挿入
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

                        // 画像ファイルのペーストは別処理に委譲
                        const hasFiles = clipboardData.files && clipboardData.files.length > 0;
                        if (hasFiles) {
                            return false; // MediaPasteExtensionが処理
                        }

                        // プレーンテキストを取得
                        const text = clipboardData.getData('text/plain');

                        // HTMLはrich pasteのsignalとして扱い、本文はtext/plainから取得する。
                        // 自Editor clipboardだけは従来の空行正規化を維持する。
                        const hasHtml = clipboardData.types.includes('text/html');
                        let collapseEmptyLines = false;
                        let isSelfCopy = false;

                        if (hasHtml) {
                            const html = clipboardData.getData('text/html');
                            // Preserve this editor's own ProseMirror clipboard payloads.
                            const isFromCurrentEditor = isFromCurrentEditorClipboard(html);
                            const isFromLegacyEditor =
                                html.includes('data-block="true"') && html.includes('data-editor=');

                            isSelfCopy = isFromCurrentEditor || isFromLegacyEditor;
                            collapseEmptyLines = isFromCurrentEditor || isFromLegacyEditor;

                        }

                        if (!text) {
                            // HTMLのみのclipboardは独自変換せず、既定のProseMirror pasteへ委譲する。
                            return false;
                        }

                        // HTML付きclipboardも、既存plain-text pasteと同じ改行正規化・段落化を使う。
                        // HTMLは意味解釈せず、rich clipboardに限る軽量cleanup後のURL判定はContentTrackingに任せる。
                        let lines = normalizeClipboardText(text, {
                            collapseEmptyLines,
                            maxConsecutiveEmptyLines: 1
                        }).lines;

                        if (hasHtml && !pastedAsPlainText && !isSelfCopy) {
                            lines = cleanupExternalRichPasteLines(lines);
                        }

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

                        // トランザクションを作成
                        // 
                        // Tiptap v3 UndoRedo拡張の仕様:
                        // - paste: trueを設定すると、このトランザクションがペースト操作として認識される
                        // - addToHistory: trueで履歴に記録（デフォルト動作だが明示的に設定）
                        // - uiEvent: 'paste'でペーストイベントとして記録
                        //
                        // UndoRedoの grouping は既存の時間・隣接 transaction の規則に任せる。
                        // paste metadata 自体は独立した履歴グループを保証しない。
                        const tr = state.tr
                            .replaceSelection(customSlice)
                            .setMeta('paste', true)
                            .setMeta('uiEvent', 'paste')
                            .setMeta('addToHistory', true);

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
