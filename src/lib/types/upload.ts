// --- Upload, Compression, File handling関連型定義 ---

import type { Editor as TipTapEditor } from "@tiptap/core";
import type { Signer } from "nostr-tools/signer";
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
    dimensions?: ImageDimensions;
    uploadProtocol?: UploadProtocol;
    aborted?: boolean;
}

export type UploadProtocol = "blossom" | "nip96" | "custom-http";
export type UploadPresetId =
    | "nostr-build"
    | "share-yabu-me"
    | "share-yabu-me-blossom"
    | "nostpic-com"
    | "nostrcheck-me"
    | "files-sovbit-host"
    | "blossom-band"
    | "cdn-nostrcheck-me"
    | "nostr-download"
    | "blossom-primal-net"
    | "cdn-satellite-earth"
    | "custom";
export type UploadAuthType = "blossom-bud11" | "nip98" | "none" | "custom";
export type UploadCapabilitiesSource = "preset" | "protocol-discovery" | "test" | "manual";

export interface UploadDestinationCapabilities {
    maxUploadSize: number | null;
    supportedMimeTypes: string[];
    supportsDelete: boolean;
    supportsList: boolean;
    supportsMirror: boolean;
    supportsMediaOptimization: boolean;
    authRequired: boolean;
    lastCheckedAt?: number;
    source: UploadCapabilitiesSource;
    raw?: unknown;
}

export interface UploadDestination {
    id: string;
    pubkeyHex: string | null;
    name: string;
    protocol: UploadProtocol;
    serverUrl: string;
    resolvedUploadUrl?: string;
    presetId?: UploadPresetId;
    isDefault: boolean;
    enabled: boolean;
    sortIndex?: number;
    createdAt: number;
    updatedAt: number;
    capabilities: UploadDestinationCapabilities;
    auth: {
        type: UploadAuthType;
    };
    schemaVersion: 1;
}

export interface UploadConnectionTestResult {
    success: boolean;
    status?: number;
    message?: string;
    capabilities?: UploadDestinationCapabilities;
}

export interface UploadAdapterUploadParams {
    file: File;
    destination: UploadDestination;
    authService: AuthService;
    fetch: typeof fetch;
    metadata?: Record<string, string | number | undefined>;
    devMode?: boolean;
}

export interface UploadProtocolAdapter {
    protocol: UploadProtocol;
    upload(params: UploadAdapterUploadParams): Promise<FileUploadResponse>;
    testConnection(params: {
        destination: UploadDestination;
        fetch: typeof fetch;
        authService?: AuthService;
        sampleFile?: File;
    }): Promise<UploadConnectionTestResult>;
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
    isUploadAborted?: () => boolean;
    setImageSizeInfoFromFileSize?: (sizeInfo: FileSizeInfo | null) => void;
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
    getBlossomSigner?(): Promise<Signer>;
    buildBlossomAuthorizationHeader?(params: {
        serverUrl: string;
        method: string;
        sha256?: string;
        contentType?: string;
        contentLength?: number;
    }): Promise<string>;
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
        metadata?: Record<string, string | number | undefined>,
        destination?: UploadDestination
    ) => Promise<FileUploadResponse>;
    uploadMultipleFilesWithCallbacks: (
        files: File[],
        endpoint: string,
        callbacks?: UploadInfoCallbacks,
        metadataList?: Array<Record<string, string | number | undefined> | undefined>,
        destination?: UploadDestination
    ) => Promise<FileUploadResponse[]>;
}

export interface UploadHelperDependencies {
    localStorage: Storage;
    crypto: SubtleCrypto;
    tick: () => Promise<void>;
    FileUploadManager: new (
        deps?: FileUploadDependencies,
        auth?: AuthService,
        imageCompression?: CompressionService,
        videoCompression?: CompressionService,
        mime?: MimeTypeSupportInterface
    ) => FileUploadManagerInterface;
    getImageDimensions: (file: File) => Promise<ImageDimensions | null>;
    isUploadAborted?: () => boolean;
    extractImageBlurhashMap: (editor: TipTapEditor) => Record<string, string>;
    calculateImageHash: (url: string) => Promise<string | null>;
    getMimeTypeFromUrl: (url: string) => string;
    createImetaTag: (params: any) => Promise<string[]>;
    imageSizeMapStore: {
        update: (updater: (map: Record<string, ImageDimensions>) => Record<string, ImageDimensions>) => void;
    };
    resolveUploadDestination?: () => Promise<UploadDestination>;
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
