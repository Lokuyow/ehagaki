import type { RxNostr } from "rx-nostr";
import type { ImageDimensions } from './utils/imageUtils';

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
    originalFilename?: string;
    compressedFilename?: string;
    wasSkipped?: boolean;
}

export type PartialFileSizeInfo = Partial<FileSizeInfo>;

export interface SizeDisplayInfo {
    wasCompressed: boolean;
    originalSize: string;
    compressedSize: string;
    compressionRatio: number;
    originalFilename?: string;
    compressedFilename?: string;
    wasSkipped?: boolean;
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
    // サーバーが返す NIP-94 / nip94_event のタグをそのまま参照できるようにする
    // 例: { x: '...', ox: '...', m: 'image/jpeg', dim: '800x600', url: '...' }
    nip94?: Record<string, string> | null;
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

// --- authService.ts から移動 ---
export interface AuthResult {
    success: boolean;
    error?: string;
    pubkeyHex?: string;
}

// --- SettingsDialog用型定義 ---
export interface SettingsDialogProps {
    show?: boolean;
    onClose: () => void;
    onRefreshRelaysAndProfile?: () => void;
    selectedCompression?: string;
    onSelectedCompressionChange?: (value: string) => void;
    selectedEndpoint?: string;
    onSelectedEndpointChange?: (value: string) => void;
}

export interface CompressionLevel {
    label: string;
    value: string;
}

export interface UploadEndpoint {
    label: string;
    url: string;
}

// --- editorUtils.ts から移動 ---
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
