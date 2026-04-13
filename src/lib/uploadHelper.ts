import { tick } from "svelte";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { FileUploadManager } from "./fileUploadManager";
import { ImageCompressionService } from "./imageCompressionService";
import { MimeTypeSupport } from "./mimeTypeSupport";
import { NostrAuthService } from "./nostrAuthService";
import { VideoCompressionService } from "./videoCompression/videoCompressionService";
import {
    uploadAbortFlagStore,
    mediaFreePlacementStore,
    videoCompressionProgressStore,
    imageCompressionProgressStore,
    setUploadProgress,
    setVideoCompressionService,
    setImageCompressionService,
} from '../stores/uploadStore.svelte';
import { removeAllPlaceholders } from './utils/editorNodeActions';
import { extractImageBlurhashMap, getMimeTypeFromUrl, calculateImageHash, createImetaTag } from "./tags/imetaTag";
import { imageSizeMapStore } from "../stores/tagsStore.svelte";
import { processFilesForUpload, prepareMetadataList, getImageDimensions } from "./utils/fileUtils";
import type {
    UploadHelperParams,
    UploadHelperResult,
    PlaceholderEntry,
    FileUploadResponse,
    UploadHelperDependencies,
    FileUploadManagerInterface,
    FileUploadDependencies,
    AuthService,
    CompressionService,
    MimeTypeSupportInterface,
    UploadProgress,
    UploadInfoCallbacks,
    ImageDimensions,
} from "./types";
import {
    insertPlaceholdersIntoEditor,
    generateBlurhashes,
    replacePlaceholdersWithResults,
    insertPlaceholdersIntoGallery,
    replacePlaceholdersInGallery,
    removeAllGalleryPlaceholders,
} from "./editor/placeholderManager";

function createFileUploadManager(
    dependencies: UploadHelperDependencies,
): FileUploadManagerInterface {
    if (
        dependencies.FileUploadManager ===
        (FileUploadManager as unknown as UploadHelperDependencies["FileUploadManager"])
    ) {
        const mimeSupport = new MimeTypeSupport(
            typeof document === "undefined" ? undefined : document,
        );
        const imageCompressionService = new ImageCompressionService(
            mimeSupport,
            dependencies.localStorage,
        );
        const videoCompressionService = new VideoCompressionService(
            dependencies.localStorage,
        );

        setImageCompressionService(imageCompressionService);
        setVideoCompressionService(videoCompressionService);

        return new FileUploadManager(
            {
                localStorage: dependencies.localStorage,
                fetch: window.fetch.bind(window),
                crypto: dependencies.crypto,
                document: typeof document === "undefined" ? undefined : document,
                window: typeof window === "undefined" ? undefined : window,
                navigator: typeof navigator === "undefined" ? undefined : navigator,
            },
            new NostrAuthService(),
            imageCompressionService,
            videoCompressionService,
            mimeSupport,
        );
    }

    return new dependencies.FileUploadManager();
}

async function uploadValidFiles(
    fileUploadManager: FileUploadManagerInterface,
    validFiles: File[],
    endpoint: string,
    uploadCallbacks: UploadInfoCallbacks | undefined,
    metadataList: Array<Record<string, string | number | undefined>> | undefined,
    devMode: boolean,
): Promise<FileUploadResponse[] | null> {
    try {
        if (validFiles.length === 1) {
            return [
                await fileUploadManager.uploadFileWithCallbacks(
                    validFiles[0],
                    endpoint,
                    uploadCallbacks,
                    devMode,
                    metadataList?.[0],
                ),
            ];
        }

        if (validFiles.length > 1) {
            return await fileUploadManager.uploadMultipleFilesWithCallbacks(
                validFiles,
                endpoint,
                uploadCallbacks,
                metadataList,
            );
        }
    } catch (error) {
        if (devMode) {
            const modeLabel = import.meta.env.MODE === "development" ? "[dev]" : "[preview]";
            console.error(`${modeLabel} [uploadHelper] Upload error:`, error);
        }
        throw error;
    }

    return null;
}

function createUploadProgress(
    total: number,
    overrides: Partial<UploadProgress> = {},
): UploadProgress {
    return {
        total,
        completed: 0,
        failed: 0,
        aborted: 0,
        inProgress: false,
        ...overrides,
    };
}

function notifyUploadProgress(
    uploadCallbacks: UploadInfoCallbacks | undefined,
    progress: UploadProgress,
): void {
    uploadCallbacks?.onProgress?.(progress);
}

function createManagedUploadCallbacks(
    uploadCallbacks?: UploadInfoCallbacks,
): UploadInfoCallbacks {
    return {
        onProgress: (progress: UploadProgress) => {
            setUploadProgress(progress);
            uploadCallbacks?.onProgress?.(progress);
        },
        onVideoCompressionProgress: (progress: number) => {
            videoCompressionProgressStore.set(progress);
            uploadCallbacks?.onVideoCompressionProgress?.(progress);
        },
        onImageCompressionProgress: (progress: number) => {
            imageCompressionProgressStore.set(progress);
            uploadCallbacks?.onImageCompressionProgress?.(progress);
        },
    };
}

// 中止チェック用のヘルパー関数
function handleAbortedUpload(
    fileArray: File[],
    placeholderMap: PlaceholderEntry[],
    currentEditor: TipTapEditor | null,
    updateUploadState: (isUploading: boolean, errorMessage?: string) => void,
    uploadCallbacks?: UploadInfoCallbacks,
    devMode: boolean = false,
    cleanupPlaceholders: boolean = false,
    galleryCleanup?: { imageSizeMapStore: { update: (fn: (map: Record<string, ImageDimensions>) => Record<string, ImageDimensions>) => void } }
): UploadHelperResult {
    updateUploadState(false);

    if (cleanupPlaceholders) {
        if (galleryCleanup) {
            removeAllGalleryPlaceholders(placeholderMap, galleryCleanup.imageSizeMapStore);
        } else if (currentEditor) {
            removeAllPlaceholders(currentEditor, devMode);
        }
    }

    notifyUploadProgress(
        uploadCallbacks,
        createUploadProgress(fileArray.length, {
            aborted: fileArray.length,
        }),
    );

    return {
        placeholderMap: cleanupPlaceholders ? [] : placeholderMap,
        results: null,
        imageOxMap: {},
        imageXMap: {},
        failedResults: [],
        errorMessage: "Upload aborted by user",
    };
}

function createGalleryCleanupContext(
    galleryMode: boolean,
    imageSizeMapStore: { update: (fn: (map: Record<string, ImageDimensions>) => Record<string, ImageDimensions>) => void },
): { imageSizeMapStore: { update: (fn: (map: Record<string, ImageDimensions>) => Record<string, ImageDimensions>) => void } } | undefined {
    return galleryMode ? { imageSizeMapStore } : undefined;
}

function getAbortCheckpointResult(
    fileArray: File[],
    placeholderMap: PlaceholderEntry[],
    currentEditor: TipTapEditor | null,
    updateUploadState: (isUploading: boolean, errorMessage?: string) => void,
    uploadCallbacks: UploadInfoCallbacks | undefined,
    devMode: boolean,
    cleanupPlaceholders: boolean,
    galleryCleanup?: { imageSizeMapStore: { update: (fn: (map: Record<string, ImageDimensions>) => Record<string, ImageDimensions>) => void } },
): UploadHelperResult | null {
    if (!uploadAbortFlagStore.value) {
        return null;
    }

    return handleAbortedUpload(
        fileArray,
        placeholderMap,
        currentEditor,
        updateUploadState,
        uploadCallbacks,
        devMode,
        cleanupPlaceholders,
        galleryCleanup,
    );
}

// デフォルトの依存関係
const createDefaultDependencies = (): UploadHelperDependencies => ({
    localStorage: window.localStorage,
    crypto: window.crypto.subtle,
    tick,
    FileUploadManager: FileUploadManager as unknown as new (
        deps?: FileUploadDependencies,
        auth?: AuthService,
        imageCompression?: CompressionService,
        videoCompression?: CompressionService,
        mime?: MimeTypeSupportInterface
    ) => FileUploadManagerInterface,
    getImageDimensions,
    extractImageBlurhashMap,
    calculateImageHash,
    getMimeTypeFromUrl,
    createImetaTag: async (params: any) => await createImetaTag(params),
    imageSizeMapStore,
});

export async function uploadHelper({
    files,
    currentEditor,
    fileInput,
    uploadCallbacks,
    showUploadError,
    updateUploadState,
    devMode,
    dependencies = createDefaultDependencies(),
}: UploadHelperParams): Promise<UploadHelperResult> {
    const fileArray = Array.from(files);
    const managedUploadCallbacks = createManagedUploadCallbacks(uploadCallbacks);
    const endpoint = dependencies.localStorage.getItem("uploadEndpoint") || "";
    const imageOxMap: Record<string, string> = {};
    const imageXMap: Record<string, string> = {};

    const modeLabel = import.meta.env.MODE === "development" ? "[dev]" : "[preview]";

    // 処理開始を即座に通知（プレースホルダー挿入前）
    notifyUploadProgress(
        managedUploadCallbacks,
        createUploadProgress(fileArray.length, { inProgress: true }),
    );

    // 中止フラグをリセット
    uploadAbortFlagStore.reset();

    // ファイル処理
    let fileProcessingResults;
    try {
        fileProcessingResults = await processFilesForUpload(fileArray, dependencies);
    } catch (error) {
        // 中止された場合
        if (error instanceof Error && error.message === 'Upload aborted by user') {
            return handleAbortedUpload(
                fileArray,
                [],
                currentEditor,
                updateUploadState,
                managedUploadCallbacks,
                devMode,
                false,
            );
        }
        // その他のエラーは再スロー
        throw error;
    }

    // 中止チェック（ファイル処理後）
    const abortAfterFileProcessing = getAbortCheckpointResult(
        fileArray,
        [],
        currentEditor,
        updateUploadState,
        managedUploadCallbacks,
        devMode,
        false,
    );
    if (abortAfterFileProcessing) {
        return abortAfterFileProcessing;
    }

    // プレースホルダー挿入（モードに応じてエディタまたはギャラリーへ）
    const galleryMode = !mediaFreePlacementStore.value;
    const galleryCleanup = createGalleryCleanupContext(
        galleryMode,
        dependencies.imageSizeMapStore,
    );
    let placeholderMap = galleryMode
        ? insertPlaceholdersIntoGallery(
            fileArray,
            fileProcessingResults,
            showUploadError,
            dependencies.imageSizeMapStore,
            dependencies.FileUploadManager,
            devMode
        )
        : insertPlaceholdersIntoEditor(
            fileArray,
            fileProcessingResults,
            currentEditor as TipTapEditor | null,
            showUploadError,
            dependencies.imageSizeMapStore,
            dependencies.FileUploadManager,
            devMode
        );

    // 有効ファイルがない場合は早期リターン
    if (placeholderMap.length === 0) {
        return {
            placeholderMap: [],
            results: null,
            imageOxMap,
            imageXMap,
            failedResults: [],
            errorMessage: "",
        };
    }

    // 中止チェック（プレースホルダー挿入後 & Blurhash生成前）
    const abortAfterPlaceholderInsert = getAbortCheckpointResult(
        fileArray,
        placeholderMap,
        currentEditor,
        updateUploadState,
        managedUploadCallbacks,
        devMode,
        true,
        galleryCleanup,
    );
    if (abortAfterPlaceholderInsert) {
        return abortAfterPlaceholderInsert;
    }

    // アップロード状態を更新（圧縮開始前に設定）
    updateUploadState(true, "");

    // Blurhash生成
    await generateBlurhashes(
        placeholderMap,
        dependencies.FileUploadManager,
        devMode
    );

    // 中止チェック（Blurhash生成後）
    const abortAfterBlurhash = getAbortCheckpointResult(
        fileArray,
        placeholderMap,
        currentEditor,
        updateUploadState,
        managedUploadCallbacks,
        devMode,
        true,
        galleryCleanup,
    );
    if (abortAfterBlurhash) {
        return abortAfterBlurhash;
    }

    // アップロード処理
    const validFiles = placeholderMap.map((entry: PlaceholderEntry) => entry.file);
    let results: FileUploadResponse[] | null = null;
    const fileUploadManager = createFileUploadManager(dependencies);

    try {
        const metadataList = prepareMetadataList(validFiles);
        results = await uploadValidFiles(
            fileUploadManager,
            validFiles,
            endpoint,
            managedUploadCallbacks,
            metadataList,
            devMode,
        );
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        showUploadError(errorMsg, 5000);
        results = null;
    } finally {
        updateUploadState(false);
    }

    // 中止された場合は後続処理をスキップ
    const abortAfterUpload = getAbortCheckpointResult(
        fileArray,
        placeholderMap,
        currentEditor,
        updateUploadState,
        managedUploadCallbacks,
        devMode,
        true,
        galleryCleanup,
    );
    if (abortAfterUpload) {
        if (fileInput) fileInput.value = "";
        return abortAfterUpload;
    }

    await dependencies.tick();

    // プレースホルダー置換・失敗時削除
    const failedResults: FileUploadResponse[] = [];
    let errorMessage = "";
    let imageServerBlurhashMap: Record<string, string> = {};

    if (results && placeholderMap.length > 0) {
        if (galleryMode) {
            const replacementResult = await replacePlaceholdersInGallery(
                results,
                placeholderMap,
                imageOxMap,
                imageXMap,
                dependencies.imageSizeMapStore,
                dependencies.calculateImageHash,
                dependencies.getMimeTypeFromUrl,
                devMode
            );
            failedResults.push(...replacementResult.failedResults);
            errorMessage = replacementResult.errorMessage;
        } else {
            const replacementResult = await replacePlaceholdersWithResults(
                results,
                placeholderMap,
                currentEditor as TipTapEditor | null,
                imageOxMap,
                imageXMap,
                dependencies.imageSizeMapStore,
                dependencies.calculateImageHash,
                devMode
            );
            failedResults.push(...replacementResult.failedResults);
            errorMessage = replacementResult.errorMessage;
            imageServerBlurhashMap = replacementResult.imageServerBlurhashMap;
        }

        // 置換処理後、placeholderMapをクリア
        placeholderMap = [];
    }

    // dev: imetaタグ出力
    if (devMode && currentEditor) {
        try {
            const rawImageBlurhashMap = dependencies.extractImageBlurhashMap(currentEditor);
            const urls = new Set<string>([...Object.keys(rawImageBlurhashMap), ...Object.keys(imageServerBlurhashMap)]);
            await Promise.all(
                Array.from(urls).map(async (url) => {
                    if (!imageXMap[url]) {
                        const x = await dependencies.calculateImageHash(url);
                        if (x) imageXMap[url] = x;
                    }
                }),
            );
            const imetaTags = await Promise.all(
                Array.from(urls).map(async (url) => {
                    const blurhash = imageServerBlurhashMap[url] ?? rawImageBlurhashMap[url];
                    const m = dependencies.getMimeTypeFromUrl(url);
                    const ox = imageOxMap[url];
                    const x = imageXMap[url];
                    const tag = await dependencies.createImetaTag({ url, m, blurhash, ox, x });
                    return tag.join(" ");
                }),
            );
        } catch (e) {
            console.warn(`${modeLabel} [dev] imetaタグ生成失敗`, e);
        }
    }

    if (fileInput) fileInput.value = "";

    return {
        placeholderMap,
        results,
        imageOxMap,
        imageXMap,
        failedResults,
        errorMessage,
    };
}

// --- 統合されたアップロード関連関数 ---

export interface ShowUploadErrorMessageParams {
    updateUploadState: (isUploading: boolean, message?: string) => void;
}

export function showUploadErrorMessage(
    message: string,
    duration = 3000,
    params: ShowUploadErrorMessageParams
) {
    params.updateUploadState(false, message);
    setTimeout(() => params.updateUploadState(false, ""), duration);
}

export interface PerformFileUploadParams {
    files: File[] | FileList;
    currentEditor: TipTapEditor | null;
    fileInput?: HTMLInputElement;
    uploadCallbacks?: UploadInfoCallbacks;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    devMode: boolean;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    dependencies?: UploadHelperDependencies;
    getUploadFailedText: (key: string) => string;
}

export async function performFileUpload(params: PerformFileUploadParams): Promise<void> {
    const {
        files,
        currentEditor,
        fileInput,
        uploadCallbacks,
        updateUploadState,
        devMode,
        imageOxMap,
        imageXMap,
        dependencies = createDefaultDependencies(),
        getUploadFailedText,
    } = params;

    if (!files || files.length === 0) return;

    const result: UploadHelperResult = await uploadHelper({
        files,
        currentEditor,
        fileInput,
        uploadCallbacks,
        showUploadError: (msg: string, duration?: number) =>
            showUploadErrorMessage(msg, duration, { updateUploadState }),
        updateUploadState,
        devMode,
        dependencies,
    });

    Object.assign(imageOxMap, result.imageOxMap);
    Object.assign(imageXMap, result.imageXMap);

    if (result.failedResults?.length) {
        showUploadErrorMessage(
            result.errorMessage ||
            (result.failedResults.length === 1
                ? result.failedResults[0].error || getUploadFailedText("postComponent.upload_failed")
                : `${result.failedResults.length}個のファイルのアップロードに失敗しました`),
            5000,
            { updateUploadState }
        );
    }
    if (fileInput) fileInput.value = "";
}

export interface UploadFilesParams {
    files: File[] | FileList;
    currentEditor: TipTapEditor | null;
    fileInput?: HTMLInputElement;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    getUploadFailedText: (key: string) => string;
    dependencies?: UploadHelperDependencies;
}

export async function uploadFiles(params: UploadFilesParams): Promise<void> {
    const {
        files,
        currentEditor,
        fileInput,
        updateUploadState,
        imageOxMap,
        imageXMap,
        getUploadFailedText,
        dependencies,
    } = params;

    await performFileUpload({
        files,
        currentEditor,
        fileInput,
        updateUploadState,
        devMode: import.meta.env.MODE === "development",
        imageOxMap,
        imageXMap,
        dependencies,
        getUploadFailedText,
    });
}
