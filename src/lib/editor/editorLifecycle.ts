import type { InitializeEditorParams, InitializeEditorResult, CleanupEditorParams } from '../types';
import { setupEventListeners, cleanupEventListeners } from './editorDomActions.svelte';
import type { Editor as TipTapEditor } from '@tiptap/core';
import { createEditorStore as createTiptapEditorStore } from './editorConfig';
import {
    placeholderTextStore,
    currentEditorStore,
    editorState,
    setPostSubmitter,
    clearPostSubmitter,
} from '../../stores/editorStore.svelte';

/**
 * エディターの初期化を行い、必要なリソースを返す
 */
export function initializeEditor(params: InitializeEditorParams): InitializeEditorResult {
    const {
        placeholderText,
        editorContainerEl,
        hasStoredKey,
        hasPostingCapability,
        submitPost,
        onCustomEmojiSelect,
        getCustomEmojiItems,
        enterKeyBehavior,
        hostOwnedLite,
        submitShortcuts,
        uploadFiles,
        eventCallbacks
    } = params;

    // プレースホルダーの設定
    placeholderTextStore.value = placeholderText;

    // エディターストアの作成
    const editor = createTiptapEditorStore({
        placeholderText,
        onSubmitPost: submitPost,
        onCustomEmojiSelect,
        getCustomEmojiItems,
        enterKeyBehavior,
        hostOwnedLite,
        submitShortcuts,
        onCreate: (editorInstance: TipTapEditor | null) => {
            currentEditorStore.set(editorInstance);
        }
    });

    // エディターインスタンスの購読
    let latestEditor: TipTapEditor | null = null;
    const unsubscribe = editor.subscribe((editorInstance: TipTapEditor | null) => {
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
            __hasPostingCapability: () => hasPostingCapability ?? hasStoredKey,
            __postStatus: () => editorState.postStatus,
            __submitPost: submitPost,
        });
    }

    return { editor, unsubscribe, handlers };
}

/**
 * エディターのクリーンアップを行う
 */
export function cleanupEditor(params: CleanupEditorParams): void {
    const {
        unsubscribe,
        componentUnsubscribe,
        handlers,
        currentEditor,
        editorContainerEl,
        submitPost,
    } = params;

    // イベントリスナーのクリーンアップ
    cleanupEventListeners(handlers, editorContainerEl);

    // The editor store is module-scoped across Web Component mounts. Release
    // this instance before destroying it so a new PostComponent never tries
    // to update a destroyed TipTap view.
    if (currentEditorStore.value === currentEditor) {
        currentEditorStore.set(null);
    }
    clearPostSubmitter(submitPost);

    // エディターの購読解除
    componentUnsubscribe();
    unsubscribe();

    // エディターの破棄
    if (currentEditor && !currentEditor.isDestroyed) {
        currentEditor.destroy();
    }

    // エディターコンテナのプロパティをクリア
    if (editorContainerEl) {
        delete (editorContainerEl as any).__uploadFiles;
        delete (editorContainerEl as any).__currentEditor;
        delete (editorContainerEl as any).__hasStoredKey;
        delete (editorContainerEl as any).__hasPostingCapability;
        delete (editorContainerEl as any).__postStatus;
        delete (editorContainerEl as any).__submitPost;
    }
}
