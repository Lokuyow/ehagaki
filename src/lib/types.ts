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
        nostr?: {
            getPublicKey(): Promise<string>;
            signEvent: (event: any) => Promise<any>;
        };
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
    FileUploadManager: new (
        deps?: FileUploadDependencies,
        auth?: AuthService,
        compression?: CompressionService,
        mime?: MimeTypeSupportInterface
    ) => FileUploadManagerInterface;
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
    sizeInfo?: FileSizeInfo;
    nip94?: Record<string, string>;
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
    dependencies?: UploadHelperDependencies;
}

export interface UploadHelperResult {
    placeholderMap: PlaceholderEntry[];
    results: FileUploadResponse[] | null;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    failedResults: FileUploadResponse[];
    errorMessage: string;
}

// SharedImageData関連の型統一
export interface SharedImageProcessingResult {
    success: boolean;
    data?: SharedImageData;
    error?: string;
    fromServiceWorker?: boolean;
    fromIndexedDB?: boolean;
}

// --- authService.ts から移動 ---
export interface AuthResult {
    success: boolean;
    error?: string;
    pubkeyHex?: string;
}

// --- authService.ts から移動した型定義 ---
export interface AuthServiceDependencies {
    keyManager?: typeof import('./keyManager').keyManager;
    localStorage?: Storage;
    window?: Window;
    navigator?: Navigator;
    console?: Console;
    debugLog?: typeof import('./debug').debugLog;
    setNsecAuth?: typeof import('../stores/appStore.svelte').setNsecAuth;
    setAuthInitialized?: typeof import('../stores/appStore.svelte').setAuthInitialized;
    clearAuthState?: typeof import('../stores/appStore.svelte').clearAuthState;
    setNostrLoginAuth?: typeof import('../stores/appStore.svelte').setNostrLoginAuth;
    nostrLoginManager?: NostrLoginManagerInterface;
    setTimeout?: (callback: () => void, delay: number) => void;
    secretKeyStore?: typeof import('../stores/appStore.svelte').secretKeyStore;
}

export interface NostrLoginManagerInterface {
    isInitialized: boolean;
    init(options: NostrLoginOptions): Promise<void>;
    showLogin(): Promise<void>;
    logout(): void;
    getCurrentUser(): { pubkey?: string; npub?: string } | null;
    setAuthHandler(handler: (auth: NostrLoginAuth) => void): void;
}

export interface LocalStorageData {
    pubkey?: string;
    npub?: string;
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

export interface ServiceWorkerStatus {
    isReady: boolean;
    hasController: boolean;
    canCommunicate: boolean;
    error?: string;
}

export interface SharedImageProcessingResult {
    success: boolean;
    data?: SharedImageData;
    error?: string;
    fromCache?: boolean;
}

// --- appUtils.ts から移動した型定義 ---
export interface StorageAdapter {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}

export interface NavigatorAdapter {
    language: string;
}

export interface WindowAdapter {
    location: {
        reload(): void;
    };
}

export interface TimeoutAdapter {
    setTimeout(callback: () => void, delay: number): void;
}

export interface MousePosition {
    x: number;
    y: number;
}

export interface ViewportInfo {
    centerX: number;
    centerY: number;
    offsetX: number;
    offsetY: number;
}

export interface ZoomCalculation {
    newScale: number;
    newTranslate: MousePosition;
}

export interface TouchPosition {
    x: number;
    y: number;
}

export interface PinchInfo {
    distance: number;
    centerX: number;
    centerY: number;
}

export interface ZoomParams {
    scale: number;
    offsetX: number;
    offsetY: number;
}

export interface ZoomCalculation {
    newScale: number;
    newTranslate: MousePosition;
}

export interface TouchPosition {
    x: number;
    y: number;
}

export interface PinchInfo {
    distance: number;
    centerX: number;
    centerY: number;
}

export interface ZoomParams {
    scale: number;
    offsetX: number;
    offsetY: number;
}

// --- postManager.ts から移動した型定義 ---
export interface PostResult {
    success: boolean;
    error?: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    type?: 'nsec' | 'nostr-login';
    pubkey?: string;
}

export interface HashtagStore {
    hashtags: string[];
    tags: string[][];
}

export interface KeyManagerInterface {
    getFromStore(): string | null;
    loadFromStorage(): string | null;
    isWindowNostrAvailable(): boolean;
}

export interface PostManagerDeps {
    authStateStore?: {
        value: AuthState;
    };
    hashtagStore?: HashtagStore;
    keyManager?: KeyManagerInterface;
    window?: {
        nostr?: {
            signEvent: (event: any) => Promise<any>;
        };
    };
    console?: Console;
    createImetaTagFn?: (meta: any) => Promise<string[]>;
    getClientTagFn?: () => string[] | null;
    seckeySignerFn?: (key: string) => any;
}

// --- keyManager.ts から移動した型定義 ---
export interface NostrLoginAuth {
    type: 'login' | 'signup' | 'logout';
    pubkey?: string;
    npub?: string;
    otpData?: unknown;
}

export interface KeyManagerDeps {
    localStorage?: Storage;
    console?: Console;
    secretKeyStore?: {
        value: string | null;
        set: (value: string | null) => void;
    };
    window?: Window;
    setNostrLoginAuthFn?: (pubkey: string, npub: string, nprofile: string) => void;
    clearAuthStateFn?: () => void;
}

export interface KeyManagerError {
    type: 'storage' | 'network' | 'validation';
    message: string;
    originalError?: unknown;
}

// --- nostrLogin.ts から移動した型定義 ---
export interface NostrLoginOptions {
    theme?: 'default' | 'ocean' | 'lemonade' | 'purple';
    bunkers?: string[];
    perms?: string;
    noBanner?: boolean;
    startScreen?: string;
    methods?: string;
}

export type NostrLoginEventHandler = (auth: NostrLoginAuth) => void;

export interface NostrLoginDependencies {
    window?: Window & { nostrLogin?: any };
    document?: Document;
    console?: Console;
    setTimeout?: (callback: () => void, delay: number) => void;
    importNostrLogin?: () => Promise<{ init: Function; launch: Function }>;
}

export interface NostrLoginError {
    type: 'initialization' | 'auth' | 'launch' | 'decode';
    message: string;
    originalError?: unknown;
}
