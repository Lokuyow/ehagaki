import { createEditor } from 'svelte-tiptap';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { updateHashtagData } from "./stores";
import Placeholder from '@tiptap/extension-placeholder'; // 追加

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
                    apply(tr, decorationSet) {
                        const doc = tr.doc;
                        const decorations: Decoration[] = [];

                        doc.descendants((node, pos) => {
                            if (node.isText && node.text) {
                                const text = node.text;
                                const regex = /(?:^|[\s\n\u3000])(#[^\s\n\u3000#]+)/g;
                                let match;

                                while ((match = regex.exec(text)) !== null) {
                                    const start = pos + match.index + (match[0].length - match[1].length);
                                    const end = pos + match.index + match[0].length;

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
            updateTimeout: null
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
        const imageUrlMatch = line.match(/^https?:\/\/[^\s]+\.(png|jpe?g|gif|webp|svg)(\?[^\s]*)?$/i);

        if (imageUrlMatch) {
            return `<img src="${line.trim()}" class="editor-image" />`;
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
export function createEditorStore() {
    return createEditor({
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
                    return /^https?:\/\//.test(url);
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'editor-image',
                },
                allowBase64: false,
            }),
            ContentTrackingExtension,
            ImagePasteExtension,
            Placeholder.configure({
                placeholder: 'テキストを入力してください...',
                emptyEditorClass: 'is-editor-empty',
                showOnlyWhenEditable: true,
                showOnlyCurrent: false,
                includeChildren: true,
            }),
        ],
        content: '<p></p>',
        editorProps: {
            attributes: {
                class: 'tiptap-editor',
            },
        },
    });
}

/**
 * 画像URLリストをエディターに挿入するヘルパー関数
 */
export function insertImagesToEditor(editor: any, urls: string) {
    if (!editor) return;

    const urlList = urls.split('\n').filter(Boolean);

    editor.chain().focus().run();

    urlList.forEach((url) => {
        const trimmedUrl = url.trim();
        if (trimmedUrl) {
            editor.chain()
                .setImage({ src: trimmedUrl, alt: 'Uploaded image' })
                .createParagraphNear()
                .run();
        }
    });
}

