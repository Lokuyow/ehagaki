import { createEditor } from 'svelte-tiptap';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import SvelteImageNode from '../components/SvelteImageNode.svelte';
import { validateAndNormalizeUrl } from '../lib/utils/editorUtils';
import { ContentTrackingExtension, ImagePasteExtension, ImageDragDropExtension, SmartBackspaceExtension } from '../lib/editor';
import { GapCursorNewlineExtension } from '../lib/editor/gapCursorNewline';
import type { PostStatus, EditorState } from '../lib/types';
import { updateHashtagData } from '../lib/tags/hashtagManager';

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
                addAttributes() {
                    return {
                        src: { default: null },
                        blurhash: { default: null },
                        isPlaceholder: { default: false },
                    };
                },
                addNodeView() {
                    return SvelteNodeViewRenderer(SvelteImageNode as any);
                },
            }),
            ContentTrackingExtension.configure({
                onContentChanged: (plainText: string) => {
                    updateHashtagData(plainText);
                    // カスタムイベントもここで発火
                    const event = new CustomEvent('editor-content-changed', {
                        detail: { plainText }
                    });
                    window.dispatchEvent(event);
                }
            }),
            ImagePasteExtension,
            ImageDragDropExtension,
            SmartBackspaceExtension, // ←追加
            GapCursorNewlineExtension,
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
                'data-placeholder': placeholderText,
            },
            // タッチデバイス対応のイベントハンドリング
            handleClickOn(view, _pos, _node, _nodePos, event, _direct) {
                // クリックターゲットがリンクかどうか判定
                let target = event.target as HTMLElement | null;
                while (target && target !== view.dom) {
                    if (target.tagName === 'A' && target.hasAttribute('href')) {
                        // タッチデバイスでのリンククリック時にキーボードを隠す
                        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                        if (isTouchDevice) {
                            // エディターからフォーカスを外してキーボードを隠す
                            const editorElement = view.dom as HTMLElement;
                            if (editorElement) {
                                editorElement.blur();
                            }
                            document.body.focus();
                        }

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
        onCreate({ editor }) {
            // エディター作成時にグローバル参照を設定
            (window as any).__currentEditor = editor;

            // プレースホルダー属性を設定
            const editorElement = editor.view.dom as HTMLElement;
            if (editorElement) {
                editorElement.setAttribute('data-placeholder', placeholderText);

                // 段落要素にもプレースホルダー属性を設定
                const paragraphs = editorElement.querySelectorAll('p');
                paragraphs.forEach((p: HTMLElement) => {
                    p.setAttribute('data-placeholder', placeholderText);
                });

                // 次のフレームでも再設定（レンダリングタイミング対応）
                setTimeout(() => {
                    const updatedParagraphs = editorElement.querySelectorAll('p');
                    updatedParagraphs.forEach((p: HTMLElement) => {
                        if (!p.getAttribute('data-placeholder')) {
                            p.setAttribute('data-placeholder', placeholderText);
                        }
                    });
                }, 0);
            }
        },
        onUpdate({ editor }) {
            // 更新時にも段落要素のプレースホルダー属性を確認・設定
            const editorElement = editor.view.dom as HTMLElement;
            if (editorElement) {
                const emptyParagraphs = editorElement.querySelectorAll('p.is-editor-empty, p.is-empty');
                emptyParagraphs.forEach((p) => {
                    const paragraph = p as HTMLElement;
                    if (!paragraph.getAttribute('data-placeholder')) {
                        const placeholder = editorElement.getAttribute('data-placeholder') || placeholderText;
                        paragraph.setAttribute('data-placeholder', placeholder);
                    }
                });
            }
        },
        onDestroy() {
            // エディター破棄時にグローバル参照をクリア
            delete (window as any).__currentEditor;
        }
    });

    // プレースホルダー更新機能を修正
    const updatePlaceholder = (newPlaceholder: string) => {
        const currentEditor = (window as any).__currentEditor;
        if (currentEditor && currentEditor.view) {
            // エディターDOM要素のdata-placeholder属性を更新
            const editorElement = currentEditor.view.dom as HTMLElement;
            if (editorElement) {
                editorElement.setAttribute('data-placeholder', newPlaceholder);

                // すべての段落要素のプレースホルダー属性も更新
                const paragraphs = editorElement.querySelectorAll('p');
                paragraphs.forEach((p: HTMLElement) => {
                    p.setAttribute('data-placeholder', newPlaceholder);
                });
            }

            // Placeholder拡張の設定も更新
            const placeholderExt = currentEditor.extensionManager.extensions.find(
                (ext: any) => ext.name === 'placeholder'
            );
            if (placeholderExt) {
                placeholderExt.options.placeholder = newPlaceholder;
                // 強制的に再描画
                currentEditor.view.dispatch(
                    currentEditor.state.tr.setMeta('addToHistory', false)
                );
            }
        }
    };

    // ストアにメソッドを追加
    (editorStore as any).updatePlaceholder = updatePlaceholder;

    return editorStore;
}

// --- エディター専用状態管理 ---
export let placeholderTextStore = $state({ value: '' });

export let editorState = $state<EditorState>({
    content: '',
    canPost: false,
    isUploading: false,
    uploadErrorMessage: '',
    postStatus: {
        sending: false,
        success: false,
        error: false,
        message: ''
    },
    hasImage: false
});

// SvelteImageNode用状態管理
export const imageDragState = $state({
    isDragging: false,
    startPos: { x: 0, y: 0 },
    longPressTimeout: null as ReturnType<typeof setTimeout> | null,
    startTarget: null as HTMLElement | null,
    preview: null as HTMLElement | null,
});

export const imageSelectionState = $state({
    justSelected: false,
    justSelectedTimeout: null as ReturnType<typeof setTimeout> | null,
});

export const imageLoadState = $state({
    isImageLoaded: false,
    blurhashFadeOut: false,
    canvasRef: undefined as HTMLCanvasElement | undefined,
});

// --- エディター状態更新関数 ---
function canPostByContent(content: string, hasImage: boolean): boolean {
    return !!content.trim() || hasImage;
}

export function updateEditorContent(content: string, hasImage: boolean = false): void {
    editorState.content = content;
    editorState.hasImage = hasImage;
    editorState.canPost = canPostByContent(content, hasImage);
}

export function updatePostStatus(postStatus: PostStatus): void {
    editorState.postStatus = postStatus;
}

export function updateUploadState(isUploading: boolean, errorMessage: string = ''): void {
    editorState.isUploading = isUploading;
    editorState.uploadErrorMessage = errorMessage;
}

export function resetEditorState(): void {
    editorState.content = '';
    editorState.canPost = false;
    editorState.uploadErrorMessage = '';
    editorState.postStatus = {
        sending: false,
        success: false,
        error: false,
        message: '',
        completed: false
    };
    editorState.hasImage = false;
}

export function resetPostStatus(): void {
    editorState.postStatus = {
        sending: false,
        success: false,
        error: false,
        message: '',
        completed: false
    };
}

export function updatePlaceholderText(text: string): void {
    placeholderTextStore.value = text;
}

// --- 投稿機能の統合 ---
let postComponentSubmit: (() => Promise<void>) | undefined = undefined;

export function setPostSubmitter(submitter: () => Promise<void>) {
    postComponentSubmit = submitter;
}

export async function submitPost() {
    if (postComponentSubmit) {
        await postComponentSubmit();
    }
}
