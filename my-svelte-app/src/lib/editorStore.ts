import { createEditor } from 'svelte-tiptap';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import SvelteImageNode from '../components/SvelteImageNode.svelte';
import { validateAndNormalizeUrl } from './utils';
import { ContentTrackingExtension, ImagePasteExtension, ImageDragDropExtension } from './editorExtensions';

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
                    // utilsのバリデーション関数を利用
                    return !!validateAndNormalizeUrl(url);
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
            ImageDragDropExtension,
            placeholderExtension,
        ],
        // HTMLではなくJSONノード構造で初期化
        content: {
            type: 'doc',
            content: [
                {
                    type: 'paragraph'
                }
            ]
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor',
            },
            // タッチデバイス対応のイベントハンドリング
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
