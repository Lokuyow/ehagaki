// --- Editor, Post, Draft, ContentTracking, EditorEvents関連型定義 ---

import type { Editor as TipTapEditor } from "@tiptap/core";
import type { MediaGalleryItem } from "./media";

// Post and Editor types
export interface PostStatus {
    sending: boolean;
    success: boolean;
    error: boolean;
    message: string;
    completed?: boolean;
}

export interface EditorState {
    content: string;
    canPost: boolean;
    isUploading: boolean;
    uploadErrorMessage: string;
    postStatus: PostStatus;
    hasImage?: boolean;
}

export interface PostResult {
    success: boolean;
    error?: string;
}

// Editor and Utils types
export interface NodeData {
    type: string;
    attrs?: any;
    content?: any[];
}

export interface DragEvent {
    type: "start" | "move" | "end";
    details?: any;
    getPos?: () => number;
}

export interface CleanUrlResult {
    cleanUrl: string;
    actualLength: number;
}

// ContentTracking Extension types
export interface ContentTrackingOptions {
    debounceDelay?: number;
    enableHashtags?: boolean;
    enableAutoLink?: boolean;
    enableImageConversion?: boolean;
}

// Menu Item types
export interface MenuItem {
    label: string;
    action: () => void;
    disabled?: boolean;
    src?: string;
    icon?: string;
}

// Editor Event Listener types
export interface EditorEventCallbacks {
    onContentUpdate?: (plainText: string, hasMedia: boolean) => void;
    onImageFullscreenRequest?: (src: string, alt: string) => void;
    onSelectImageNode?: (pos: number) => void;
}

export interface EditorEventHandlers {
    handleContentUpdate: EventListener;
    handleImageFullscreenRequest: EventListener;
    handleSelectImageNode: EventListener;
}

export interface SetupEventListenersParams {
    currentEditor: TipTapEditor | null;
    editorContainerEl: HTMLElement | null;
    callbacks: EditorEventCallbacks;
}

export interface InitializeEditorParams {
    placeholderText: string;
    editorContainerEl: HTMLElement | null;
    currentEditor: TipTapEditor | null;
    hasStoredKey: boolean;
    submitPost: () => Promise<void>;
    uploadFiles: (files: File[] | FileList) => void;
    eventCallbacks: EditorEventCallbacks;
}

export interface InitializeEditorResult {
    editor: any;
    unsubscribe: () => void;
    handlers: EditorEventHandlers;
}

export interface CleanupEditorParams {
    unsubscribe: () => void;
    handlers: EditorEventHandlers;
    currentEditor: TipTapEditor | null;
    editorContainerEl: HTMLElement | null;
}

// Draft types
export interface Draft {
    id: string;
    content: string;
    preview: string;
    timestamp: number;
    galleryItems?: MediaGalleryItem[];
}

// TransformStore関連型定義
export interface Position {
    x: number;
    y: number;
}

export interface TransformState {
    scale: number;
    translate: Position;
    useTransition?: boolean;
}

export interface DragState {
    isDragging: boolean;
    start: Position;
    startTranslate: Position;
}

export interface PinchState {
    isPinching: boolean;
    initialDistance: number;
    initialScale: number;
    centerX: number;
    centerY: number;
}

export interface ZoomParams {
    scale: number;
    offsetX: number;
    offsetY: number;
}

export interface BoundaryConstraints {
    imageWidth: number;
    imageHeight: number;
    containerWidth: number;
    containerHeight: number;
}
