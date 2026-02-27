import type { PostStatus, EditorState, InitializeEditorParams, InitializeEditorResult, CleanupEditorParams } from '../lib/types';
import { setupEventListeners, cleanupEventListeners } from '../lib/editor/editorDomActions.svelte';
import type { Editor as TipTapEditor } from '@tiptap/core';
import {
    createEditorStore as createTiptapEditorStore,
    updateEditorPlaceholder
} from '../lib/editor';

// プレースホルダー管理関数を再エクスポート（下位互換性のため）
export {
    insertPlaceholdersIntoEditor,
    generateBlurhashes,
    replacePlaceholdersWithResults,
    insertPlaceholdersIntoGallery,
    replacePlaceholdersInGallery,
    removeAllGalleryPlaceholders,
} from '../lib/editor/placeholderManager';

// --- エディター専用状態管理 ---
export let placeholderTextStore = $state({ value: '' });

// エディターインスタンスの管理
let currentEditorInstance = $state<TipTapEditor | null>(null);

export const currentEditorStore = {
    get value() { return currentEditorInstance; },
    set: (editor: TipTapEditor | null) => { currentEditorInstance = editor; }
};

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

// --- エディター状態更新関数 ---
function canPostByContent(content: string, hasMedia: boolean): boolean {
    return !!content.trim() || hasMedia;
}

export function updateEditorContent(content: string, hasMedia: boolean = false): void {
    editorState.content = content;
    editorState.hasImage = hasMedia;
    editorState.canPost = canPostByContent(content, hasMedia);
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

    // エディターインスタンスがあれば、Placeholderエクステンションのオプションを更新
    if (currentEditorInstance) {
        updateEditorPlaceholder(currentEditorInstance, text);
    }
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

// --- エディター初期化・クリーンアップ関数 ---
export function initializeEditor(params: InitializeEditorParams): InitializeEditorResult {
    const {
        placeholderText,
        editorContainerEl,
        hasStoredKey,
        submitPost,
        uploadFiles,
        eventCallbacks
    } = params;

    // プレースホルダーの設定
    placeholderTextStore.value = placeholderText;

    // エディターストアの作成
    const editor = createTiptapEditorStore({
        placeholderText,
        onSubmitPost: submitPost,
        onCreate: (editorInstance: any) => {
            currentEditorStore.set(editorInstance);
        }
    });

    // エディターインスタンスの購読
    let latestEditor: any = null;
    const unsubscribe = editor.subscribe((editorInstance: any) => {
        latestEditor = editorInstance;
    });

    // イベントリスナーのセットアップ
    const handlers = setupEventListeners({
        currentEditor: latestEditor,
        editorContainerEl,
        callbacks: eventCallbacks,
    });

    // ポスト送信関数の登録
    setPostSubmitter(submitPost);

    // エディターコンテナに必要なプロパティを設定
    if (editorContainerEl) {
        Object.assign(editorContainerEl, {
            __uploadFiles: uploadFiles,
            __currentEditor: () => latestEditor,
            __hasStoredKey: () => hasStoredKey,
            __postStatus: () => editorState.postStatus,
            __submitPost: submitPost,
        });
    }

    return { editor, unsubscribe, handlers };
}

export function cleanupEditor(params: CleanupEditorParams): void {
    const { unsubscribe, handlers, currentEditor, editorContainerEl } = params;

    // イベントリスナーのクリーンアップ
    cleanupEventListeners(handlers, editorContainerEl);

    // エディターの購読解除
    unsubscribe();

    // エディターの破棄
    currentEditor?.destroy?.();

    // エディターコンテナのプロパティをクリア
    if (editorContainerEl) {
        delete (editorContainerEl as any).__uploadFiles;
        delete (editorContainerEl as any).__currentEditor;
        delete (editorContainerEl as any).__hasStoredKey;
        delete (editorContainerEl as any).__postStatus;
        delete (editorContainerEl as any).__submitPost;
    }
}
