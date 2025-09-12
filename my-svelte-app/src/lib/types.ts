import type { RxNostr } from "rx-nostr";
import type { ImageDimensions } from './imageUtils';

export interface PostStatus {
    sending: boolean;
    success: boolean;
    error: boolean;
    message: string;
    completed?: boolean; // 投稿完了フラグを追加
}

export interface EditorState {
    content: string;
    canPost: boolean;
    isUploading: boolean;
    uploadErrorMessage: string;
    postStatus: PostStatus;
    hasImage?: boolean;
}

// 投稿画像アップロード進捗用型
export interface UploadProgress {
    total: number;
    completed: number;
    failed: number;
    inProgress: boolean;
}

// --- utils.ts から移動 ---
export interface FileSizeInfo {
    originalSize: number;
    compressedSize: number;
    wasCompressed: boolean;
    compressionRatio: number;
    sizeReduction: string;
    originalFilename?: string;      // 追加
    compressedFilename?: string;    // 追加
    wasSkipped?: boolean; // 圧縮処理をスキップしたかどうか
}

export interface SizeDisplayInfo {
    wasCompressed: boolean;
    originalSize: string;
    compressedSize: string;
    compressionRatio: number;
    originalFilename?: string;      // 追加
    compressedFilename?: string;    // 追加
    wasSkipped?: boolean; // 圧縮処理をスキップしたかどうか
}

export interface PublicKeyData {
    hex: string;
    npub: string;
    nprofile: string;
}

// --- fileUploadManager.ts から移動 ---
export interface FileUploadResponse {
    success: boolean;
    url?: string;
    error?: string;
    sizeInfo?: FileSizeInfo;
}

// MultipleUploadProgress を UploadProgress のエイリアスに統一
export type MultipleUploadProgress = UploadProgress;

export interface UploadInfoCallbacks {
    // 統一された UploadProgress 型を使用
    onProgress?: (progress: UploadProgress) => void;
}

export interface FileValidationResult {
    isValid: boolean;
    errorMessage?: string;
}

// --- window.nostrZap 型拡張 ---
declare global {
    interface Window {
        nostrZap?: {
            initTargets: () => void;
            // 必要に応じて他のメソッドや型も追加
        };
    }
}

// --- PostComponent用Props型 ---
export interface Props {
    rxNostr?: RxNostr; // rx-nostr の型参照を使用
    hasStoredKey: boolean;
    onPostSuccess?: () => void;
    onUploadStatusChange?: (isUploading: boolean) => void;
    onUploadProgress?: (progress: UploadProgress) => void;
}

// uploadHelper 用の型定義を追加
export interface PlaceholderEntry {
    file: File;
    placeholderId: string;
    blurhash?: string;
    ox?: string;
    dimensions?: ImageDimensions; // 新規追加
}

export interface UploadHelperParams {
    files: File[] | FileList;
    currentEditor: import("@tiptap/core").Editor | null;
    fileInput?: HTMLInputElement | undefined;
    uploadCallbacks?: UploadInfoCallbacks | undefined;
    showUploadError: (msg: string, duration?: number) => void;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    devMode: boolean;
}

export interface UploadHelperResult {
    placeholderMap: PlaceholderEntry[];
    results: FileUploadResponse[] | null;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    failedResults: FileUploadResponse[];
    errorMessage: string;
}
