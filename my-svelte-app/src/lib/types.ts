export interface PostStatus {
    sending: boolean;
    success: boolean;
    error: boolean;
    message: string;
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
}

export interface SizeDisplayInfo {
    wasCompressed: boolean;
    originalSize: string;
    compressedSize: string;
    compressionRatio: number;
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

export interface MultipleUploadProgress {
    completed: number;
    failed: number;
    total: number;
    inProgress: boolean;
}

export interface UploadInfoCallbacks {
    onProgress?: (progress: MultipleUploadProgress) => void;
}

export interface FileValidationResult {
    isValid: boolean;
    errorMessage?: string;
}
