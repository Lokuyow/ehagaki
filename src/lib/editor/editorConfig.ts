import { createEditor } from 'svelte-tiptap';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extensions';
import UniqueID from '@tiptap/extension-unique-id';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import { TextSelection } from '@tiptap/pm/state';
import SvelteImageNode from '../../components/SvelteImageNode.svelte';
import { Video } from './videoExtension';
import { ContentTrackingExtension, MediaPasteExtension, ImageDragDropExtension, SmartBackspaceExtension, ClipboardExtension } from '.';
import { GapCursorNewlineExtension } from './gapCursorNewline';

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
                // Tiptap v3: Link extension が StarterKit に含まれています
                link: {
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
                },
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
            ContentTrackingExtension,
            Video,
            ClipboardExtension, // ← クリップボード処理を追加（MediaPasteExtensionの前に配置）
            MediaPasteExtension,
            ImageDragDropExtension,
            SmartBackspaceExtension,
            GapCursorNewlineExtension,
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
            // タッチデバイス対応のイベントハンドリング
            handleClickOn(view, pos, _node, _nodePos, event, _direct) {
                // クリックターゲットがリンクかどうか判定
                let target = event.target as HTMLElement | null;
                while (target && target !== view.dom) {
                    if (target.tagName === 'A' && target.hasAttribute('href')) {
                        // Ctrl（またはCmd）+クリック時のみ遷移許可
                        if (event.ctrlKey || event.metaKey) {
                            return false;
                        }

                        // 通常タップ/クリックは編集モードで扱う
                        event.preventDefault();

                        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                        const mouseEvent = event as MouseEvent;
                        const coords = {
                            left: mouseEvent.clientX,
                            top: mouseEvent.clientY
                        };

                        const resolvedPos = (Number.isFinite(coords.left) && Number.isFinite(coords.top))
                            ? view.posAtCoords(coords)
                            : null;

                        const selectionPos = resolvedPos?.pos ?? pos;
                        const docSize = view.state.doc.content.size;
                        const clampedPos = Math.max(0, Math.min(selectionPos, docSize));
                        const textSelection = TextSelection.near(view.state.doc.resolve(clampedPos));

                        view.dispatch(view.state.tr.setSelection(textSelection).scrollIntoView());
                        view.focus();

                        // タッチ端末では直後にキーボードが表示されないことがあるため、リクエストを遅延
                        if (isTouchDevice && typeof requestAnimationFrame === 'function') {
                            requestAnimationFrame(() => view.focus());
                        }

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
