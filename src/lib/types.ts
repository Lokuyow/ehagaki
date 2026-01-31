import type { createRxNostr } from "rx-nostr";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { VIDEO_COMPRESSION_OPTIONS_MAP } from "./constants";

// --- App Store types ---
export type NostrLoginAuthMethod = 'connect' | 'extension' | 'local' | undefined;

export interface AuthState {
    type: 'none' | 'nsec' | 'nostr-login';
    isAuthenticated: boolean;
    pubkey: string;
    npub: string;
    nprofile: string;
    isValid: boolean;
    isInitialized: boolean;
    isExtensionLogin?: boolean;
    nostrLoginAuthMethod?: NostrLoginAuthMethod; // Nostr Loginの認証方法
    serviceWorkerReady?: boolean;
}

export interface SharedImageStoreState {
    file: File | null;
    metadata?: SharedImageMetadata;
    received: boolean;
}

export interface HashtagData {
    content: string;
    hashtags: string[];
    tags: string[][];
}

// --- Image-related types ---
export interface ImageDimensions {
    width: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
}

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

export interface SharedImageProcessingResult {
    success: boolean;
    data?: SharedImageData;
    error?: string;
    fromServiceWorker?: boolean;
    fromIndexedDB?: boolean;
}

// --- Post and Editor types ---
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
    hasImage?: boolean; // 画像または動画が含まれているか（hasMediaとして使用）
}

export interface PostResult {
    success: boolean;
    error?: string;
}

// --- Upload-related types ---
export interface UploadProgress {
    total: number;
    completed: number;
    failed: number;
    aborted: number;
    inProgress: boolean;
}

export type MultipleUploadProgress = UploadProgress;

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

// --- Service and Manager interfaces ---
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
}

// --- Video Compression types ---
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

// --- Auth-related types ---
export interface AuthResult {
    success: boolean;
    error?: string;
    pubkeyHex?: string;
}

export interface PublicKeyData {
    hex: string;
    npub: string;
    nprofile: string;
}

export interface NostrLoginAuth {
    type: 'login' | 'signup' | 'logout';
    pubkey?: string;
    npub?: string;
    otpData?: unknown;
}

export interface NostrLoginOptions {
    theme?: 'default' | 'ocean' | 'lemonade' | 'purple';
    bunkers?: string[];
    perms?: string;
    noBanner?: boolean;
    startScreen?: string;
    methods?: string;
}

export type NostrLoginEventHandler = (auth: NostrLoginAuth) => void;

export interface NostrLoginError {
    type: 'initialization' | 'auth' | 'launch' | 'decode';
    message: string;
    originalError?: unknown;
}

export interface NostrLoginDependencies {
    window?: Window & { nostrLogin?: any };
    document?: Document;
    console?: Console;
    setTimeout?: (callback: () => void, delay: number) => void;
    importNostrLogin?: () => Promise<{ init: Function; launch: Function }>;
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

export interface AuthServiceDependencies {
    // Core services
    keyManager?: KeyManagerInterface;
    nostrLoginManager?: NostrLoginManagerInterface;

    // Browser APIs
    localStorage?: Storage;
    window?: Window;
    navigator?: Navigator;
    console?: Console;
    setTimeout?: (callback: () => void, delay: number) => void;

    // Store setters
    setNsecAuth?: (pubkey: string, npub: string, nprofile: string) => void;
    setAuthInitialized?: () => void;
    clearAuthState?: () => void;
    setNostrLoginAuth?: (pubkey: string, npub: string, nprofile: string, nostrLoginAuthMethod?: NostrLoginAuthMethod) => void;

    // Stores
    secretKeyStore?: {
        value: string | null;
        set: (value: string | null) => void;
        subscribe: (callback: (value: string | null) => void) => void;
    };

    // Utility functions
    debugLog?: (...args: any[]) => void;
}

export interface KeyManagerInterface {
    getFromStore(): string | null;
    loadFromStorage(): string | null;
    isWindowNostrAvailable(): boolean;
}

export interface KeyManagerDeps {
    localStorage?: Storage;
    console?: Console;
    secretKeyStore?: {
        value: string | null;
        set: (value: string | null) => void;
    };
    window?: Window;
    setNostrLoginAuthFn?: (pubkey: string, npub: string, nprofile: string, nostrLoginAuthMethod?: NostrLoginAuthMethod) => void;
    clearAuthStateFn?: () => void;
}

export interface KeyManagerError {
    type: 'storage' | 'network' | 'validation';
    message: string;
    originalError?: unknown;
}

// --- Relay and Profile types ---
export type RelayConfig = { [url: string]: { read: boolean; write: boolean } } | string[];

export interface RelayManagerDeps {
    localStorage?: Storage;
    console?: Console;
    setTimeoutFn?: (fn: (...args: any[]) => void, ms?: number, ...args: any[]) => any;
    clearTimeoutFn?: (timeoutId: any) => void;
    relayListUpdatedStore?: {
        value: number;
        set: (value: number) => void;
    };
}

export interface RelayFetchOptions {
    forceRemote?: boolean;
    timeoutMs?: number;
}

export interface RelayFetchResult {
    success: boolean;
    relayConfig?: RelayConfig;
    source?: 'localStorage' | 'kind10002' | 'kind3' | 'fallback';
    error?: string;
}

export interface UserRelaysFetchResult {
    success: boolean;
    relayConfig: RelayConfig;
    source: 'localStorage' | 'kind10002' | 'kind3' | 'fallback';
}

// --- Post Manager types ---
export interface HashtagStore {
    hashtags: string[];
    tags: string[][];
}

export interface PostManagerDeps {
    authStateStore?: {
        value: AuthState;
    };
    hashtagStore?: HashtagStore;
    hashtagSnapshotFn?: (store: HashtagStore) => HashtagData;
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
    extractContentWithImagesFn?: (editor: TipTapEditor) => string;
    extractImageBlurhashMapFn?: (editor: TipTapEditor) => Record<string, string>;
    resetEditorStateFn?: () => void;
    resetPostStatusFn?: () => void;
    iframeMessageService?: {
        notifyPostSuccess: () => boolean;
        notifyPostError: (error?: string) => boolean;
    };
}

// --- UI and Component types --

export interface SettingsDialogProps {
    show?: boolean;
    onClose: () => void;
    onRefreshRelaysAndProfile?: () => void;
    selectedCompression?: string;
    onSelectedCompressionChange?: (value: string) => void;
    selectedEndpoint?: string;
    onSelectedEndpointChange?: (value: string) => void;
    onOpenWelcomeDialog?: () => void;
}

export interface CompressionLevel {
    label: string;
    value: string;
}

export interface UploadEndpoint {
    label: string;
    url: string;
}

// --- BalloonMessage関連型定義 ---
export type BalloonMessageType = "success" | "error" | "info";

export interface BalloonMessage {
    type: "success" | "error" | "info";
    message: string;
}

export interface I18nFunction {
    (key: string): string | undefined;
}

// --- PostComponent UI状態型定義 ---
export interface PostComponentUIState {
    showSecretKeyDialog: boolean;
    pendingPost: string;
    showImageFullscreen: boolean;
    fullscreenImageSrc: string;
    fullscreenImageAlt: string;
    showPopupModal: boolean;
    popupX: number;
    popupY: number;
    popupMessage: string;
}

// --- Editor and Utils types ---
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

// --- ContentTracking Extension types ---
export interface ContentTrackingOptions {
    debounceDelay?: number;
    enableHashtags?: boolean;
    enableAutoLink?: boolean;
    enableImageConversion?: boolean;
}

// --- Service Worker types ---
export interface ServiceWorkerStatus {
    isReady: boolean;
    hasController: boolean;
    canCommunicate: boolean;
    error?: string;
}

// --- App Utils types ---
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

// --- profileManager.ts から移動した型定義 ---
export interface ProfileManagerDeps {
    localStorage?: Storage;
    navigator?: Navigator;
    setTimeoutFn?: (fn: (...args: any[]) => void, ms?: number, ...args: any[]) => any;
    clearTimeoutFn?: (timeoutId: any) => void;
    console?: Console;
    // RxNostrの抽象化（テスト用）
    rxNostrFactory?: () => ReturnType<typeof createRxNostr>;
}

export interface ProfileData {
    name: string;
    picture: string;
    npub: string;
    nprofile: string;
    profileRelays?: string[]; // kind:0を受信したリレーのリスト
}

// --- Global Window extensions ---
declare global {
    interface Window {
        nostr?: {
            getPublicKey(): Promise<string>;
            signEvent: (event: any) => Promise<any>;
        };
        nostrZap?: {
            initTargets: () => void;
        };
    }
}

// --- Menu Item types ---
export interface MenuItem {
    label: string;
    action: () => void;
    disabled?: boolean;
    src?: string; // 画像URLを追加
    icon?: string; // アイコンパス（任意）
}

// --- Editor Event Listener types ---
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

// --- Draft types ---
export interface Draft {
    id: string;
    content: string;
    preview: string;
    timestamp: number;
}

// --- TransformStore関連型定義 ---
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
