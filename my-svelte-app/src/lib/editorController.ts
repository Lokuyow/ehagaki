import { createEditor } from 'svelte-tiptap';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { updateHashtagData } from "./stores";
import Placeholder from '@tiptap/extension-placeholder';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import SvelteImageNode from '../components/SvelteImageNode.svelte';

// ハッシュタグ共通正規表現
export const HASHTAG_REGEX = /(?:^|[\s\n\u3000])#([^\s\n\u3000#]+)/g;

// ハッシュタグ装飾とコンテンツ更新を統合したExtension
export const ContentTrackingExtension = Extension.create({
    name: 'contentTracking',

    addProseMirrorPlugins() {
        return [
            // ハッシュタグ装飾プラグイン
            new Plugin({
                key: new PluginKey('hashtag-decoration'),
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
                                // 既存の共通定数を利用して重複を排除
                                const regex = new RegExp(HASHTAG_REGEX.source, 'g');
                                let match;

                                while ((match = regex.exec(text)) !== null) {
                                    // match[0]: 前後の空白＋#＋タグ本体, match[1]: タグ本体
                                    // ハッシュタグの「#」からタグ本体までを装飾し、スペースは含めない
                                    // match.index: マッチ開始位置（空白含む）
                                    // match[0].indexOf('#'): 「#」の位置（空白の後）
                                    const hashIndex = match[0].indexOf('#');
                                    if (hashIndex === -1) continue;
                                    const start = pos + match.index + hashIndex;
                                    const end = start + 1 + match[1].length; // 「#」+タグ本体
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
                }
            }),
            // 追加: link マークの再検証プラグイン
            new Plugin({
                key: new PluginKey('link-validator'),
                // transactions がドキュメントを変更した場合に走る appendTransaction を使う
                appendTransaction: (transactions, _oldState, newState) => {
                    if (!transactions.some(tr => tr.docChanged)) return;
                    const linkMark = newState.schema.marks.link;
                    if (!linkMark) return;

                    // ノード内の部分的な URL を検出するための正規表現（改行・半角/全角空白で分断されると分割される）
                    const urlPartRegex = /https?:\/\/[^\s\u3000]+/gi;

                    let tr: any = null;

                    newState.doc.descendants((node, pos) => {
                        if (!node.isText || !node.marks || node.marks.length === 0) return;

                        const hasLink = node.marks.some(m => m.type === linkMark);
                        if (!hasLink) return;

                        const text = node.text || '';
                        const matches = Array.from(text.matchAll(urlPartRegex));

                        // 1) リンクマークを一旦削除
                        tr = tr || newState.tr;
                        tr.removeMark(pos, pos + text.length, linkMark);

                        // 2) URL と判断できる部分だけ再付与（href 属性はマッチした文字列そのものを使用）
                        for (const m of matches) {
                            if (typeof m.index !== 'number') continue;
                            const start = pos + m.index;
                            const end = start + m[0].length;
                            const mark = linkMark.create({ href: m[0] });
                            tr.addMark(start, end, mark);
                        }
                    });

                    return tr && tr.docChanged ? tr : null;
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

// 画像自動挿入用のPasteハンドラーExtension
export const ImagePasteExtension = Extension.create({
    name: 'imagePaste',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('image-paste'),
                props: {
                    handlePaste: (view, event) => {
                        const text = event.clipboardData?.getData('text/plain') || '';
                        const imageUrlMatch = text.match(/^https?:\/\/[^\s]+\.(png|jpe?g|gif|webp|svg)(\?[^\s]*)?$/i);

                        if (imageUrlMatch) {
                            event.preventDefault();
                            const { tr } = view.state;
                            const imageNode = view.state.schema.nodes.image.create({
                                src: text.trim(),
                                alt: 'Pasted image'
                            });

                            const transaction = tr.replaceSelectionWith(imageNode);
                            view.dispatch(transaction);
                            return true;
                        }
                        return false;
                    }
                }
            })
        ];
    }
});

/**
 * プレーンテキストをTiptap用のHTMLコンテンツに変換
 */
export function textToTiptapContent(text: string): string {
    const lines = text.split('\n');
    const content = lines.map(line => {
        const trimmed = line.trim();
        const imageUrlMatch = trimmed.match(/^https?:\/\/[^\s]+\.(png|jpe?g|gif|webp|svg)(\?[^\s]*)?$/i);

        if (imageUrlMatch) {
            // src 属性を encodeURI で安全化（簡易）
            return `<img src="${encodeURI(trimmed)}" class="editor-image" />`;
        } else if (line.trim()) {
            return `<p>${escapeHtml(line)}</p>`;
        } else {
            return '<p></p>';
        }
    }).join('');

    return content;
}

/**
 * HTMLエスケープ処理
 */
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Tiptap v2のエディターストアを作成
 */
export function createEditorStore(placeholderText: string) {
    let placeholderExtension = Placeholder.configure({
        placeholder: placeholderText,
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
        showOnlyCurrent: false,
        includeChildren: true,
    });

    const editorStore = createEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: {
                        class: 'editor-paragraph',
                    },
                },
            }),
            Link.configure({
                HTMLAttributes: {
                    class: 'preview-link',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
                autolink: true,
                linkOnPaste: true,
                validate: (url) => {
                    // 指定された正規表現を使用してURLを検証
                    return /^https?:\/\/[\w!\?\/\+\-_~=;\.,\*&@#$%\(\)'\[\]]+/.test(url);
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'editor-image',
                },
                allowBase64: false,
            }).extend({
                addNodeView() {
                    return SvelteNodeViewRenderer(SvelteImageNode);
                },
            }),
            ContentTrackingExtension,
            ImagePasteExtension,
            placeholderExtension,
        ],
        content: '<p></p>',
        editorProps: {
            attributes: {
                class: 'tiptap-editor',
            },
            // --- ここから追加: Ctrl+クリックのみリンク遷移 ---
            handleClickOn(view, _pos, _node, _nodePos, event, _direct) {
                // クリックターゲットがリンクかどうか判定
                let target = event.target as HTMLElement | null;
                while (target && target !== view.dom) {
                    if (target.tagName === 'A' && target.hasAttribute('href')) {
                        // Ctrl（またはCmd）+クリック時のみ遷移許可
                        if (event.ctrlKey || event.metaKey) {
                            // 通常遷移
                            return false;
                        } else {
                            // デフォルト遷移を抑制
                            event.preventDefault();
                            return true;
                        }
                    }
                    target = target.parentElement;
                }
                return false;
            },
            // --- ここまで追加 ---
        },
    });

    // プレースホルダー更新機能を簡潔に修正
    const updatePlaceholder = (newPlaceholder: string) => {
        // editorStoreから現在のエディターインスタンスを取得
        let currentEditor: any;
        const unsubscribe = editorStore.subscribe(editor => {
            currentEditor = editor;
        });
        unsubscribe();

        if (currentEditor) {
            // DOM要素に直接プレースホルダーを設定
            const editorElement = currentEditor.view.dom;
            if (editorElement) {
                editorElement.setAttribute('data-placeholder', newPlaceholder);
            }

            // プレースホルダー拡張のオプションも更新
            const placeholderExt = currentEditor.extensionManager.extensions.find(
                (ext: any) => ext.name === 'placeholder'
            );
            if (placeholderExt) {
                placeholderExt.options.placeholder = newPlaceholder;
                // エディターを再描画
                currentEditor.view.dispatch(
                    currentEditor.state.tr.setMeta('forceUpdate', true)
                );
            }
        }
    };

    // ストアにメソッドを追加
    (editorStore as any).updatePlaceholder = updatePlaceholder;

    return editorStore;
}

/**
 * 画像URLリストをエディターに挿入するヘルパー関数
 */
export function insertImagesToEditor(editor: any, urls: string | string[]) {
    if (!editor) return;

    const urlList = Array.isArray(urls) ? urls : urls.split('\n').map(s => s.trim()).filter(Boolean);

    if (urlList.length === 0) return;

    // 一回フォーカスしてからバッチ挿入
    editor.chain().focus().run();

    const { state, dispatch } = editor.view;
    const { tr, schema } = state;
    let transaction = tr;

    // 現在のカーソル位置を取得
    const { from } = state.selection;
    let insertPos = from;

    // --- ここから修正: エディタが空の場合は改行を入れない ---
    // ドキュメントが空かどうか判定
    const isDocEmpty = state.doc.childCount === 1 && state.doc.firstChild?.type.name === 'paragraph' && state.doc.firstChild.content.size === 0;

    urlList.forEach((url, index) => {
        const trimmedUrl = (typeof url === 'string') ? url.trim() : '';
        if (trimmedUrl) {
            const imageNode = schema.nodes.image.create({
                src: trimmedUrl,
                alt: 'Uploaded image'
            });

            // 最初の画像かつエディタが空の場合はパラグラフを置き換える
            if (index === 0 && isDocEmpty) {
                // 空パラグラフを画像ノードで置き換え
                transaction = transaction.replaceWith(0, state.doc.content.size, imageNode);
                insertPos = imageNode.nodeSize;
            } else {
                transaction = transaction.insert(insertPos, imageNode);
                insertPos += imageNode.nodeSize;
            }
        }
    });
    // --- ここまで修正 ---

    dispatch(transaction);
}

/**
 * エディターからプレーンテキストと画像URLを抽出して結合
 */
export function extractContentWithImages(editor: any): string {
    if (!editor) return '';

    const doc = editor.state.doc;
    const fragments: string[] = [];

    doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'paragraph') {
            // パラグラフ内のテキストを取得
            const textContent = node.textContent;
            if (textContent.trim()) {
                fragments.push(textContent);
            }
        } else if (node.type.name === 'image') {
            // 画像ノードからURLを抽出
            const src = node.attrs.src;
            if (src) {
                fragments.push(src);
            }
        }
    });

    return fragments.join('\n');
}

