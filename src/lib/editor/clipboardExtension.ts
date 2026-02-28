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

                            // リッチテキスト（太字、イタリック、リンク）を検出
                            // リッチテキストの場合はデフォルト処理に委譲して書式を保持
                            const hasRichFormatting =
                                html.includes('<strong>') ||
                                html.includes('<b>') ||
                                html.includes('<em>') ||
                                html.includes('<i>') ||
                                html.includes('<a ') || // リンクタグを検出
                                html.includes('<a>');

                            if (hasRichFormatting) {
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

                        // 常にインライン挿入（改行を保持したテキストとして挿入）
                        // ペースト内容の改行は保持されるが、新しい段落は作成しない
                        const textWithLineBreaks = lines.join('\n');
                        const textNode = state.schema.text(textWithLineBreaks);
                        const fragment = Fragment.from(textNode);
                        const customSlice = new Slice(fragment, 0, 0);

                        if (import.meta.env.MODE === 'development') {
                            console.log('📋 handlePaste: inline paste with line breaks', {
                                originalText: text,
                                lines: lines.length,
                                textWithLineBreaks
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
