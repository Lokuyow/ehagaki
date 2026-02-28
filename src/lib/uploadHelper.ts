import { tick } from "svelte";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { FileUploadManager } from "./fileUploadManager";
import { uploadAbortFlagStore, mediaFreePlacementStore } from '../stores/appStore.svelte';
import { removeAllPlaceholders } from './utils/editorUtils';
import { extractImageBlurhashMap, getMimeTypeFromUrl, calculateImageHash, createImetaTag } from "./tags/imetaTag";
import { imageSizeMapStore } from "../stores/tagsStore.svelte";
import { processFilesForUpload, prepareMetadataList, getImageDimensions } from "./utils/appUtils";
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
} from "../stores/editorStore.svelte";

// UploadManagerクラス: アップロード処理を統合
export class UploadManager {
    private dependencies: UploadHelperDependencies;
    private devMode: boolean;
    private fileUploadManager: FileUploadManagerInterface;

    constructor(dependencies: UploadHelperDependencies, devMode: boolean) {
        this.dependencies = dependencies;
        this.devMode = devMode;
        this.fileUploadManager = new this.dependencies.FileUploadManager();
    }

    async uploadFiles(
        validFiles: File[],
        endpoint: string,
        uploadCallbacks?: UploadInfoCallbacks,
        metadataList?: Array<Record<string, string | number | undefined>>
    ): Promise<FileUploadResponse[] | null> {
        try {
            if (validFiles.length === 1) {
                return [
                    await this.fileUploadManager.uploadFileWithCallbacks(
                        validFiles[0],
                        endpoint,
                        uploadCallbacks,
                        this.devMode,
                        metadataList?.[0],
                    ),
                ];
            } else if (validFiles.length > 1) {
                return await this.fileUploadManager.uploadMultipleFilesWithCallbacks(
                    validFiles,
                    endpoint,
                    uploadCallbacks,
                    metadataList,
                );
            }
        } catch (error) {
            if (this.devMode) {
                const isPreview = window.location.port === "4173" || window.location.hostname === "localhost";
                const modeLabel = isPreview ? "[preview]" : "[dev]";
                console.error(`${modeLabel} [uploadHelper] Upload error:`, error);
            }
            throw error;
        }
        return null;
    }
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

    if (uploadCallbacks?.onProgress) {
        uploadCallbacks.onProgress({
            completed: 0,
            failed: 0,
            aborted: fileArray.length,
            total: fileArray.length,
            inProgress: false
        });
    }

    return {
        placeholderMap: cleanupPlaceholders ? [] : placeholderMap,
        results: null,
        imageOxMap: {},
        imageXMap: {},
        failedResults: [],
        errorMessage: "Upload aborted by user",
    };
}

// デフォルトの依存関係
const createDefaultDependencies = (): UploadHelperDependencies => ({
    localStorage: window.localStorage,
    crypto: window.crypto.subtle,
    tick,
    FileUploadManager: FileUploadManager as unknown as new (
        deps?: FileUploadDependencies,
        auth?: AuthService,
        compression?: CompressionService,
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
    const endpoint = dependencies.localStorage.getItem("uploadEndpoint") || "";
    const imageOxMap: Record<string, string> = {};
    const imageXMap: Record<string, string> = {};

    const isPreview = window.location.port === "4173" || window.location.hostname === "localhost";
    const modeLabel = isPreview ? "[preview]" : "[dev]";

    // 処理開始を即座に通知（プレースホルダー挿入前）
    if (uploadCallbacks?.onProgress) {
        uploadCallbacks.onProgress({
            completed: 0,
            failed: 0,
            aborted: 0,
            total: fileArray.length,
            inProgress: true
        });
    }

    // 中止フラグをリセット
    uploadAbortFlagStore.reset();

    // マネージャーの初期化
    const uploadManager = new UploadManager(dependencies, devMode);

    // ファイル処理
    let fileProcessingResults;
    try {
        fileProcessingResults = await processFilesForUpload(fileArray, dependencies);
    } catch (error) {
        // 中止された場合
        if (error instanceof Error && error.message === 'Upload aborted by user') {
            updateUploadState(false);
            if (uploadCallbacks?.onProgress) {
                uploadCallbacks.onProgress({
                    completed: 0,
                    failed: 0,
                    aborted: fileArray.length,
                    total: fileArray.length,
                    inProgress: false
                });
            }
            return {
                placeholderMap: [],
                results: null,
                imageOxMap,
                imageXMap,
                failedResults: [],
                errorMessage: "Upload aborted by user",
            };
        }
        // その他のエラーは再スロー
        throw error;
    }

    // 中止チェック（ファイル処理後）
    if (uploadAbortFlagStore.value) {
        return handleAbortedUpload(fileArray, [], currentEditor, updateUploadState, uploadCallbacks, devMode, false);
    }

    // プレースホルダー挿入（モードに応じてエディタまたはギャラリーへ）
    const galleryMode = !mediaFreePlacementStore.value;
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
    if (uploadAbortFlagStore.value) {
        return handleAbortedUpload(
            fileArray, placeholderMap, currentEditor, updateUploadState, uploadCallbacks, devMode, true,
            galleryMode ? { imageSizeMapStore: dependencies.imageSizeMapStore } : undefined
        );
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
    if (uploadAbortFlagStore.value) {
        return handleAbortedUpload(
            fileArray, placeholderMap, currentEditor, updateUploadState, uploadCallbacks, devMode, true,
            galleryMode ? { imageSizeMapStore: dependencies.imageSizeMapStore } : undefined
        );
    }

    // アップロード処理
    const validFiles = placeholderMap.map((entry: PlaceholderEntry) => entry.file);
    let results: FileUploadResponse[] | null = null;

    try {
        const metadataList = prepareMetadataList(validFiles);
        results = await uploadManager.uploadFiles(validFiles, endpoint, uploadCallbacks, metadataList);
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        showUploadError(errorMsg, 5000);
        results = null;
    } finally {
        updateUploadState(false);
    }

    // 中止された場合は後続処理をスキップ
    if (uploadAbortFlagStore.value) {
        if (fileInput) fileInput.value = "";
        return {
            placeholderMap: [],
            results: null,
            imageOxMap,
            imageXMap,
            failedResults: [],
            errorMessage: "Upload aborted by user",
        };
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

export interface CreateUploadCallbacksParams {
    onUploadProgress?: (progress: UploadProgress) => void;
    videoCompressionProgressStore: {
        set: (value: number) => void;
    };
    imageCompressionProgressStore: {
        set: (value: number) => void;
    };
}

export function createUploadCallbacks(params: CreateUploadCallbacksParams): UploadInfoCallbacks | undefined {
    const { onUploadProgress, videoCompressionProgressStore, imageCompressionProgressStore } = params;
    return onUploadProgress
        ? {
            onProgress: onUploadProgress,
            onVideoCompressionProgress: (progress: number) => {
                videoCompressionProgressStore.set(progress);
            },
            onImageCompressionProgress: (progress: number) => {
                imageCompressionProgressStore.set(progress);
            },
        }
        : undefined;
}

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
    onUploadProgress?: (progress: UploadProgress) => void;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    videoCompressionProgressStore: {
        set: (value: number) => void;
    };
    imageCompressionProgressStore: {
        set: (value: number) => void;
    };
    getUploadFailedText: (key: string) => string;
    dependencies?: UploadHelperDependencies;
}

export async function uploadFiles(params: UploadFilesParams): Promise<void> {
    const {
        files,
        currentEditor,
        fileInput,
        onUploadProgress,
        updateUploadState,
        imageOxMap,
        imageXMap,
        videoCompressionProgressStore,
        imageCompressionProgressStore,
        getUploadFailedText,
        dependencies,
    } = params;

    const uploadCallbacks = createUploadCallbacks({
        onUploadProgress,
        videoCompressionProgressStore,
        imageCompressionProgressStore,
    });

    await performFileUpload({
        files,
        currentEditor,
        fileInput,
        uploadCallbacks,
        updateUploadState,
        devMode: import.meta.env.MODE === "development",
        imageOxMap,
        imageXMap,
        dependencies,
        getUploadFailedText,
    });
}
