import type { PostStatus, EditorState } from '../lib/types';
import type { Editor as TipTapEditor } from '@tiptap/core';
import {
    updateEditorPlaceholder
} from '../lib/editor';
import { mediaGalleryStore } from './mediaGalleryStore.svelte';

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
    const galleryHasMedia = mediaGalleryStore.getItems().some(item => !item.isPlaceholder);
    return !!content.trim() || hasMedia || galleryHasMedia;
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


