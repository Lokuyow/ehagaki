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

// --- fileUploadManager.ts から移動した型定義 ---
export interface FileUploadDependencies {
    localStorage: Storage;
    fetch: typeof fetch;
    crypto: SubtleCrypto;
    document?: Document;
    window?: Window;
    navigator?: Navigator;
}

export interface CompressionService {
    compress(file: File): Promise<{ file: File; wasCompressed: boolean; wasSkipped?: boolean }>;
    hasCompressionSettings?(): boolean; // オプションメソッドとして追加
}

export interface AuthService {
    buildAuthHeader(url: string, method: string): Promise<string>;
}

export interface MimeTypeSupportInterface {
    canEncodeWebpWithQuality(): Promise<boolean>;
    canEncodeMimeType(mime: string): boolean;
}

// SharedImageData型を追加（shareHandler.tsからインポートする代わりに）
export interface SharedImageMetadata {
    name?: string;
    type?: string;
    size?: number;
    timestamp?: string;
}

export interface SharedImageData {
    image: File;
    metadata?: SharedImageMetadata;
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

export interface UploadHelperDependencies {
    localStorage: Storage;
    crypto: SubtleCrypto;
    tick: () => Promise<void>;
    FileUploadManager: new () => FileUploadManagerInterface;
    getImageDimensions: (file: File) => Promise<ImageDimensions | null>;
    extractImageBlurhashMap: (editor: any) => Record<string, string>;
    calculateImageHash: (url: string) => Promise<string | null>;
    getMimeTypeFromUrl: (url: string) => string;
    createImetaTag: (params: any) => Promise<string>;
    imageSizeMapStore: {
        update: (updater: (map: Record<string, ImageDimensions>) => Record<string, ImageDimensions>) => void;
    };
}

export interface FileUploadResponse {
    success: boolean;
    url?: string;
    error?: string;
    filename?: string;
    [key: string]: any;
}

export interface FileUploadManagerInterface {
    validateImageFile: (file: File) => FileValidationResult;
    generateBlurhashForFile: (file: File) => Promise<string | null>;
    uploadFileWithCallbacks: (
        file: File,
        endpoint: string,
        callbacks?: UploadInfoCallbacks,
        devMode?: boolean,
        metadata?: Record<string, string | number | undefined>
    ) => Promise<FileUploadResponse>;
    uploadMultipleFilesWithCallbacks: (
        files: File[],
        endpoint: string,
        callbacks?: UploadInfoCallbacks,
        metadataList?: Array<Record<string, string | number | undefined> | undefined>
    ) => Promise<FileUploadResponse[]>;
}

export interface UploadHelperParams {
    files: File[] | FileList;
    currentEditor: import("@tiptap/core").Editor | null;
    fileInput?: HTMLInputElement | undefined;
    uploadCallbacks?: UploadInfoCallbacks | undefined;
    showUploadError: (msg: string, duration?: number) => void;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    devMode: boolean;
    dependencies?: UploadHelperDependencies; // 新規追加
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
