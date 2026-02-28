// --- Upload, Compression, File handling関連型定義 ---

import type { Editor as TipTapEditor } from "@tiptap/core";
import { VIDEO_COMPRESSION_OPTIONS_MAP } from "../constants";
import type { ImageDimensions } from './media';

// Upload-related types
export interface UploadProgress {
    total: number;
    completed: number;
    failed: number;
    aborted: number;
    inProgress: boolean;
}

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

export interface SizeDisplayInfo {
    wasCompressed: boolean;
    originalSize: string;
    compressedSize: string;
    compressionRatio: number;
    originalFilename?: string;
    compressedFilename?: string;
    wasSkipped?: boolean;
}

export interface FileValidationResult {
    isValid: boolean;
    errorMessage?: string;
}

export interface FileUploadResponse {
    success: boolean;
    url?: string;
    error?: string;
    filename?: string;
    sizeInfo?: FileSizeInfo;
    nip94?: Record<string, string>;
    aborted?: boolean;
}

export interface UploadInfoCallbacks {
    onProgress?: (progress: UploadProgress) => void;
    onVideoCompressionProgress?: (progress: number) => void;
    onImageCompressionProgress?: (progress: number) => void;
}

export interface PlaceholderEntry {
    file: File;
    placeholderId: string;
    blurhash?: string;
    ox?: string;
    dimensions?: ImageDimensions;
}

export interface UploadHelperResult {
    placeholderMap: PlaceholderEntry[];
    results: FileUploadResponse[] | null;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    failedResults: FileUploadResponse[];
    errorMessage: string;
}

// Service and Manager interfaces
export interface FileUploadDependencies {
    localStorage: Storage;
    fetch: typeof fetch;
    crypto: SubtleCrypto;
    document?: Document;
    window?: Window;
    navigator?: Navigator;
}

export interface CompressionService {
    compress(file: File): Promise<VideoCompressionResult>;
    hasCompressionSettings?(): boolean;
    abort?(): void;
}

// Video Compression types
export interface VideoCompressionResult {
    file: File;
    wasCompressed: boolean;
    wasSkipped?: boolean;
    aborted?: boolean;
}

export type VideoCompressionLevel = keyof typeof VIDEO_COMPRESSION_OPTIONS_MAP;

export interface AuthService {
    buildAuthHeader(url: string, method: string): Promise<string>;
}

export interface MimeTypeSupportInterface {
    canEncodeWebpWithQuality(): Promise<boolean>;
    canEncodeMimeType(mime: string): boolean;
}

export interface FileUploadManagerInterface {
    validateImageFile: (file: File) => FileValidationResult;
    validateMediaFile: (file: File) => FileValidationResult;
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

export interface UploadHelperDependencies {
    localStorage: Storage;
    crypto: SubtleCrypto;
    tick: () => Promise<void>;
    FileUploadManager: new (
        deps?: FileUploadDependencies,
        auth?: AuthService,
        compression?: CompressionService,
        mime?: MimeTypeSupportInterface
    ) => FileUploadManagerInterface;
    getImageDimensions: (file: File) => Promise<ImageDimensions | null>;
    extractImageBlurhashMap: (editor: TipTapEditor) => Record<string, string>;
    calculateImageHash: (url: string) => Promise<string | null>;
    getMimeTypeFromUrl: (url: string) => string;
    createImetaTag: (params: any) => Promise<string[]>;
    imageSizeMapStore: {
        update: (updater: (map: Record<string, ImageDimensions>) => Record<string, ImageDimensions>) => void;
    };
}

export interface UploadHelperParams {
    files: File[] | FileList;
    currentEditor: TipTapEditor | null;
    fileInput?: HTMLInputElement | undefined;
    uploadCallbacks?: UploadInfoCallbacks | undefined;
    showUploadError: (msg: string, duration?: number) => void;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    devMode: boolean;
    dependencies?: UploadHelperDependencies;
}
