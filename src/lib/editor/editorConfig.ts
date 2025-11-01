import { createEditor } from 'svelte-tiptap';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Placeholder, Focus } from '@tiptap/extensions';
import UniqueID from '@tiptap/extension-unique-id';
import { Extension } from '@tiptap/core';
import { GapCursor } from '@tiptap/pm/gapcursor';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import SvelteImageNode from '../../components/SvelteImageNode.svelte';
import { Video } from './videoExtension';
import { ContentTrackingExtension, MediaPasteExtension, ImageDragDropExtension, SmartBackspaceExtension, ClipboardExtension } from '.';

const MEDIA_NODE_TYPES = new Set(['image', 'video']);
const MEDIA_FOCUS_SELECTOR = '.node-image.is-node-focused, .node-video.is-node-focused';

const GapCursorFocusReset = Extension.create({
    name: 'gapCursorFocusReset',

    onSelectionUpdate() {
        const { state, view } = this.editor;
        const selection = state.selection;

        const clearFocus = (keep?: Element | null) => {
            view.dom.querySelectorAll(MEDIA_FOCUS_SELECTOR).forEach((node) => {
                if (keep && node === keep) return;
                node.classList.remove('is-node-focused');
            });
        };

        if (
            selection instanceof NodeSelection &&
            MEDIA_NODE_TYPES.has(selection.node.type.name)
        ) {
            const dom = view.nodeDOM(selection.from) as HTMLElement | null;
            const target = dom?.matches('.node-image, .node-video')
                ? dom
                : (dom?.closest('.node-image, .node-video') as HTMLElement | null);

            if (target) {
                clearFocus(target);
                target.classList.add('is-node-focused');
                return;
            }
        }

        if (selection instanceof GapCursor) {
            clearFocus();
            return;
        }

        clearFocus();
    },

    // エディター外のクリック/タッチでフォーカスを外す
    onCreate() {
        const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
            const { view } = this.editor;
            const target = event.target as HTMLElement;

            // エディターDOM内のクリックは無視
            if (view.dom.contains(target)) {
                return;
            }

            // エディター外のクリック/タッチならメディアノードのフォーカスを全てクリア
            view.dom.querySelectorAll(MEDIA_FOCUS_SELECTOR).forEach((node) => {
                node.classList.remove('is-node-focused');
            });

            // 選択をテキスト選択に戻す（メディアノードの選択を解除）
            const { state } = view;
            const { selection } = state;
            if (selection instanceof NodeSelection && MEDIA_NODE_TYPES.has(selection.node.type.name)) {
                // エディターの最後の位置にテキストカーソルを移動
                const endPos = state.doc.content.size;
                const $pos = state.doc.resolve(endPos);
                const tr = state.tr.setSelection(
                    TextSelection.near($pos)
                ).setMeta('addToHistory', false);
                view.dispatch(tr);
            }
        };

        // マウスとタッチの両方に対応
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);

        // クリーンアップ用に参照を保存
        (this.editor as any).__outsideClickHandler = handleOutsideClick;
    },

    onDestroy() {
        const handleOutsideClick = (this.editor as any).__outsideClickHandler;
        if (handleOutsideClick) {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
            delete (this.editor as any).__outsideClickHandler;
        }
    },
});

export interface EditorConfigOptions {
    placeholderText: string;
    onSubmitPost: () => Promise<void>;
    onUpdate?: () => void;
    onCreate?: (editor: any) => void;
    onDestroy?: () => void;
}

/**
 * Tiptap v3のエディターストアを作成
 */
export function createEditorStore(options: EditorConfigOptions) {
    const { placeholderText, onSubmitPost, onUpdate, onCreate, onDestroy } = options;

    const editorStore = createEditor({
        extensions: [
            StarterKit.configure({
                paragraph: {
                    HTMLAttributes: {
                        class: 'editor-paragraph',
                    },
                },
                // Tiptap v3: UndoRedo extension が StarterKit に含まれています
                undoRedo: {
                    depth: 100, // 履歴の最大保存数
                    newGroupDelay: 500, // 連続入力を同じグループにまとめる時間（ミリ秒）
                },
                dropcursor: {
                    color: 'dodgerblue',
                    width: 5,
                },
                // Link extensionは個別に設定するため無効化
                link: false,
            }),
            // Link拡張を個別に設定（href属性の明示的な制御）
            Link.extend({
                renderHTML({ mark, HTMLAttributes }) {
                    return [
                        'a',
                        {
                            ...HTMLAttributes,
                            href: mark.attrs.href,
                        },
                        0,
                    ];
                },
            }).configure({
                HTMLAttributes: {
                    class: 'preview-link',
                    rel: null,
                    target: '_blank',
                },
                autolink: false, // ContentTrackingExtensionで動的な判定・判定解除を行うため無効化
                linkOnPaste: false, // ペースト時のリンク化を無効化（TiptapデフォルトのLink機能）
                defaultProtocol: 'https',
                // Tiptap v3の新しいAPI: URL検証をより詳細に制御
                // ペースト時のリンク検証に使用される
                isAllowedUri: (url: string, ctx: any) => {
                    // デフォルトの検証を実行
                    if (!ctx.defaultValidate(url)) return false;

                    // 相対URLを拒否
                    if (url.startsWith('./') || url.startsWith('../')) return false;

                    // 許可されたプロトコルのみ（http, https）
                    // protocols配列に含まれているかチェック
                    try {
                        const urlObj = new URL(url, `${ctx.defaultProtocol}://`);
                        return ctx.protocols.includes(urlObj.protocol.replace(':', ''));
                    } catch {
                        return false;
                    }
                },
                // Tiptap v3の新しいAPI: 自動リンク化の条件を制御
                // ペースト時のリンク判定に使用される
                shouldAutoLink: (url: string) => {
                    // 最小長チェック
                    if (url.length < 8) return false;

                    // 有効なドメイン形式かチェック
                    try {
                        const urlObj = new URL(url);
                        // ドメイン名が存在し、適切な形式であることを確認
                        return urlObj.hostname.length > 0 &&
                            /^https?:\/\/[a-zA-Z0-9]/.test(url);
                    } catch {
                        return false;
                    }
                },
                protocols: [
                    { scheme: 'http', optionalSlashes: false },
                    { scheme: 'https', optionalSlashes: false }
                ]
            }),
            // Image拡張の設定
            Image.configure({
                HTMLAttributes: {
                    class: 'editor-image',
                },
                allowBase64: false,
            }).extend({
                addAttributes() {
                    return {
                        src: { default: null },
                        blurhash: { default: null },
                        isPlaceholder: { default: null },
                        dim: { default: null },
                        alt: { default: null },
                    };
                },
                addNodeView() {
                    return SvelteNodeViewRenderer(SvelteImageNode as any);
                },
            }),
            // UniqueID extension: 画像・動画ノードに自動的にIDを付与
            UniqueID.configure({
                types: ['image', 'video'],
                attributeName: 'id',
            }),
            Focus.configure({
                className: 'is-node-focused',
                mode: 'all',
            }),
            GapCursorFocusReset,
            ContentTrackingExtension,
            Video,
            ClipboardExtension, // ← クリップボード処理を追加（MediaPasteExtensionの前に配置）
            MediaPasteExtension,
            ImageDragDropExtension,
            SmartBackspaceExtension,
            // Placeholderエクステンションの設定
            Placeholder.configure({
                placeholder: placeholderText,
                emptyEditorClass: 'is-editor-empty',
                showOnlyWhenEditable: true,
                showOnlyCurrent: false,
                includeChildren: false,
            }),
        ],
        // カスタムのClipboardExtensionのみ有効化（他のペーストルールを無効化して競合を回避）
        enablePasteRules: ['clipboardExtension'],
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
            // リンクのクリック動作を制御
            handleClickOn(view, _pos, _node, _nodePos, event, _direct) {
                // クリックターゲットがリンクかどうか判定
                let target = event.target as HTMLElement | null;
                while (target && target !== view.dom) {
                    if (target.tagName === 'A' && target.hasAttribute('href')) {
                        // Ctrl（またはCmd）+クリック時のみリンク先に遷移
                        if (event.ctrlKey || event.metaKey) {
                            // デフォルトの動作（新しいタブで開く）を許可
                            return false;
                        }

                        // 通常クリックは遷移を防ぎ、編集モードとして扱う
                        event.preventDefault();
                        return true;
                    }
                    target = target.parentElement;
                }
                return false;
            },
            handleKeyDown: (_view, event) => {
                if ((event.ctrlKey || event.metaKey) && (event.key === 'Enter' || event.key === 'NumpadEnter')) {
                    event.preventDefault();
                    onSubmitPost();
                    return true;
                }
                return false;
            },
        },
        onCreate({ editor }) {
            // エディター作成時にグローバル参照を設定
            (window as any).__currentEditor = editor;
            onCreate?.(editor);
        },
        onUpdate() {
            onUpdate?.();
        },
        onDestroy() {
            // エディター破棄時にグローバル参照をクリア
            delete (window as any).__currentEditor;
            onDestroy?.();
        }
    });

    return editorStore;
}

/**
 * プレースホルダーテキストを更新
 */
export function updateEditorPlaceholder(editor: any, text: string): void {
    if (!editor) return;

    const placeholderExt = editor.extensionManager.extensions.find(
        (ext: any) => ext.name === 'placeholder'
    );
    if (placeholderExt && placeholderExt.options) {
        placeholderExt.options.placeholder = text;
        // エディターの状態を更新してプレースホルダーを再描画
        editor.view.dispatch(
            editor.state.tr.setMeta('addToHistory', false)
        );
    }
}
