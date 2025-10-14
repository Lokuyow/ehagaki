/**
 * ClipboardExtension
 * 
 * クリップボードからのテキストペーストおよびコピー時の改行処理を適切に行うTiptap拡張機能
 * 
 * 機能:
 * - ペースト時に改行（\n）を正しく段落ノードに変換
 * - CRLF, CR, LFの改行コードを統一的に処理
 * - 末尾の改行を適切に処理（余分な空行を作成しない）
 * - 空白行（改行のみの行）を維持
 * - コピー時にエディタのコンテンツから改行を正しく抽出
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
import type { Node as PMNode } from 'prosemirror-model';
import { normalizeClipboardText, serializeParagraphs } from '../utils/clipboardUtils';
import { debugClipboardData, debugPasteResult } from '../utils/clipboardDebug';

export const ClipboardExtension = Extension.create({
    name: 'clipboardExtension',

    addProseMirrorPlugins() {
        const { editor } = this;

        return [
            new Plugin({
                key: new PluginKey('clipboardExtension'),
                props: {
                    /**
                     * handlePaste
                     * ペーストイベントをカスタム処理
                     * テキストを段落ノードとして適切に挿入
                     */
                    handlePaste(view, event, slice) {
                        const { state, dispatch } = view;
                        const { clipboardData } = event;

                        if (!clipboardData) {
                            return false;
                        }

                        // 開発モードでデバッグ情報を出力
                        if (import.meta.env.MODE === 'development') {
                            debugClipboardData(clipboardData, 'Paste');
                        }

                        // 画像ファイルのペーストは別処理に委譲
                        const hasFiles = clipboardData.files && clipboardData.files.length > 0;
                        if (hasFiles) {
                            // ImagePasteExtensionに処理を委譲
                            return false;
                        }

                        // プレーンテキストを取得
                        const text = clipboardData.getData('text/plain');
                        if (!text) {
                            return false;
                        }

                        // HTMLが含まれる場合の処理
                        const hasHtml = clipboardData.types.includes('text/html');
                        let collapseEmptyLines = false;
                        
                        if (hasHtml) {
                            const html = clipboardData.getData('text/html');
                            
                            // 基本的なリッチテキスト（太字、イタリック）を検出
                            // リッチテキストの場合はデフォルト処理に委譲して書式を保持
                            const hasRichFormatting = html.includes('<strong>') ||
                                                     html.includes('<b>') ||
                                                     html.includes('<em>') ||
                                                     html.includes('<i>');
                            
                            if (hasRichFormatting) {
                                return false; // デフォルト処理に委譲
                            }
                            
                            // 自アプリからのコピー（data-block + data-editor）を検出
                            // このパターンの場合、連続空行を制限する
                            const isFromOwnApp = html.includes('data-block="true"') && 
                                                html.includes('data-editor=');
                            
                            collapseEmptyLines = isFromOwnApp;
                            
                            if (import.meta.env.MODE === 'development') {
                                console.log('� From own app:', isFromOwnApp);
                            }
                        }

                        // 改行コードを統一し、末尾の改行を適切に処理
                        // 自アプリからのコピーの場合、連続した空行を1つに制限
                        const { lines } = normalizeClipboardText(text, {
                            collapseEmptyLines,
                            maxConsecutiveEmptyLines: 1
                        });
                        
                        // 空のテキストの場合はデフォルト処理に委譲
                        if (lines.length === 0) {
                            return false;
                        }
                        
                        // 各行を段落ノードに変換
                        const paragraphs: PMNode[] = [];
                        const schema = state.schema;

                        lines.forEach((line) => {
                            // 各行を段落として保持（空行も含む）
                            const textNodes = line.length > 0 
                                ? [schema.text(line)]
                                : [];
                            
                            paragraphs.push(
                                schema.nodes.paragraph.create(null, textNodes)
                            );
                        });

                        // 開発モードでペースト結果を出力
                        if (import.meta.env.MODE === 'development') {
                            debugPasteResult('handlePaste', text, lines, paragraphs.length);
                        }

                        // 段落ノードからSliceを作成
                        const fragment = Fragment.from(paragraphs);
                        const customSlice = new Slice(fragment, 0, 0);

                        // トランザクションを作成して挿入
                        const tr = state.tr.replaceSelection(customSlice);
                        dispatch(tr);

                        return true;
                    },

                    /**
                     * clipboardTextSerializer
                     * コピー時のテキストシリアライズ処理
                     * エディタのコンテンツを改行を保持してテキスト化
                     * 
                     * 注意: ブラウザは自動的にプラットフォームに応じた改行コードに変換するため、
                     * ここでは常に\nを使用する
                     */
                    clipboardTextSerializer(slice: Slice) {
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
                            } else if (node.type.name === 'image') {
                                // 画像ノードはURLとして出力
                                const src = node.attrs?.src;
                                if (src) {
                                    paragraphs.push(src);
                                }
                            } else if (node.type.name === 'video') {
                                // 動画ノードはURLとして出力
                                const src = node.attrs?.src;
                                if (src) {
                                    paragraphs.push(src);
                                }
                            } else if (node.isTextblock) {
                                // その他のテキストブロック
                                paragraphs.push(node.textContent);
                            }
                        });

                        // serializeParagraphsを使用して段落を結合
                        return serializeParagraphs(paragraphs);
                    },
                },
            }),
        ];
    },
});
