import { tick } from "svelte";
import type { Editor as TipTapEditor } from "@tiptap/core";
import {
    mediaFreePlacementStore,
} from '../stores/uploadStore.svelte';
import { prepareMetadataList, processFilesForUpload } from "./utils/fileUtils";
import type {
    UploadHelperParams,
    UploadHelperResult,
    PlaceholderEntry,
    FileUploadResponse,
    UploadHelperDependencies,
    FileUploadManagerInterface,
    UploadProgress,
    UploadInfoCallbacks,
    ImageDimensions,
    UploadDestination,
} from "./types";
import {
    insertPlaceholdersIntoEditor,
    generateBlurhashes,
    replacePlaceholdersWithResults,
    insertPlaceholdersIntoGallery,
    replacePlaceholdersInGallery,
} from "./editor/placeholderManager";
import { buildUploadFailureMessage } from "./uploadResultUtils";
import { isDefaultUploadAborted, resetDefaultUploadAbort } from "./uploadAbortUtils";
import { generateDevImetaTags } from './uploadImetaUtils';
import {
    createAbortCheckpointChecker,
    createGalleryCleanupContext,
    handleAbortedUpload,
} from './uploadAbortHandling';
import {
    createManagedUploadCallbacks,
    createUploadProgress,
    notifyUploadProgress,
} from './uploadProgressUtils';
function createFileUploadManager(
    dependencies: UploadHelperDependencies,
    FileUploadManagerConstructor = dependencies.FileUploadManager,
    fileUploadManagerInstance?: FileUploadManagerInterface,
): FileUploadManagerInterface {
    return fileUploadManagerInstance ?? new FileUploadManagerConstructor();
}

function getDestinationUploadEndpoint(destination: UploadDestination | undefined): string {
    if (!destination) return "";
    return destination.protocol === "nip96"
        ? destination.resolvedUploadUrl || destination.serverUrl
        : destination.serverUrl;
}

async function uploadWithManager(
    manager: FileUploadManagerInterface,
    files: File[],
    destination: UploadDestination | undefined,
    callbacks: UploadInfoCallbacks | undefined,
    devMode: boolean,
): Promise<FileUploadResponse[] | null> {
    if (files.length === 0) return null;
    const endpoint = getDestinationUploadEndpoint(destination);
    const metadataList = prepareMetadataList(files);
    if (files.length === 1) {
        return [await manager.uploadFileWithCallbacks(
            files[0], endpoint, callbacks, devMode, metadataList[0], destination,
        )];
    }
    return await manager.uploadMultipleFilesWithCallbacks(
        files, endpoint, callbacks, metadataList, destination,
    );
}

interface PlaceholderReplacementOutcome {
    failedResults: FileUploadResponse[];
    errorMessage: string;
    imageServerBlurhashMap: Record<string, string>;
}

async function replaceUploadedPlaceholders(params: {
    results: FileUploadResponse[] | null;
    placeholderMap: PlaceholderEntry[];
    galleryMode: boolean;
    currentEditor: TipTapEditor | null;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    imageSizeMapStore: UploadHelperDependencies["imageSizeMapStore"];
    calculateImageHash: UploadHelperDependencies["calculateImageHash"];
    getMimeTypeFromUrl: UploadHelperDependencies["getMimeTypeFromUrl"];
    devMode: boolean;
}): Promise<PlaceholderReplacementOutcome> {
    const {
        results,
        placeholderMap,
        galleryMode,
        currentEditor,
        imageOxMap,
        imageXMap,
        imageSizeMapStore,
        calculateImageHash,
        getMimeTypeFromUrl,
        devMode,
    } = params;

    if (!results || placeholderMap.length === 0) {
        return {
            failedResults: [],
            errorMessage: "",
            imageServerBlurhashMap: {},
        };
    }

    if (galleryMode) {
        const replacementResult = await replacePlaceholdersInGallery(
            results,
            placeholderMap,
            imageOxMap,
            imageXMap,
            imageSizeMapStore,
            calculateImageHash,
            getMimeTypeFromUrl,
            devMode,
        );

        return {
            failedResults: replacementResult.failedResults,
            errorMessage: replacementResult.errorMessage,
            imageServerBlurhashMap: {},
        };
    }

    const replacementResult = await replacePlaceholdersWithResults(
        results,
        placeholderMap,
        currentEditor,
        imageOxMap,
        imageXMap,
        imageSizeMapStore,
        calculateImageHash,
        devMode,
    );

    return {
        failedResults: replacementResult.failedResults,
        errorMessage: replacementResult.errorMessage,
        imageServerBlurhashMap: replacementResult.imageServerBlurhashMap,
    };
}

export async function uploadHelper({
    files,
    currentEditor,
    fileInput,
    uploadCallbacks,
    showUploadError,
    updateUploadState,
    devMode,
    dependencies,
    prepareFiles,
    uploadPreparedFiles,
    fileUploadManager: fileUploadManagerOverride,
    fileUploadManagerInstance,
    deferUploadStateClear = false,
    isUploadAborted: operationAbortChecker,
}: UploadHelperParams): Promise<UploadHelperResult> {
    if (!dependencies) {
        throw new Error("Upload helper requires explicit runtime dependencies.");
    }
    const effectiveDependencies = operationAbortChecker
        ? { ...dependencies, isUploadAborted: operationAbortChecker }
        : dependencies;
    const isUploadAborted = operationAbortChecker
        ?? dependencies.isUploadAborted
        ?? isDefaultUploadAborted;
    const fileArray = Array.from(files);
    const FileUploadManagerConstructor = fileUploadManagerOverride
        ?? effectiveDependencies.FileUploadManager;
    const managedUploadCallbacks = createManagedUploadCallbacks(uploadCallbacks);
    // Host-owned transport deliberately has no eHagaki upload-destination,
    // authentication, or relay resolution path.
    const uploadDestination = uploadPreparedFiles
        ? undefined
        : await dependencies.resolveUploadDestination?.();
    const imageOxMap: Record<string, string> = {};
    const imageXMap: Record<string, string> = {};

    const modeLabel = import.meta.env.MODE === "development" ? "[dev]" : "[preview]";

    // 処理開始を即座に通知（プレースホルダー挿入前）
    notifyUploadProgress(
        managedUploadCallbacks,
        createUploadProgress(fileArray.length, { inProgress: true }),
    );

    // 中止フラグをリセット
    resetDefaultUploadAbort();

    // ファイル処理
    let fileProcessingResults;
    try {
        fileProcessingResults = prepareFiles
            ? await prepareFiles(fileArray, effectiveDependencies)
            : await processFilesForUpload(fileArray, effectiveDependencies);
    } catch (error) {
        // 中止された場合
        if (error instanceof Error && error.message === 'Upload aborted by user') {
            return handleAbortedUpload(
                {
                    fileArray,
                    currentEditor,
                    updateUploadState,
                    deferUploadStateClear,
                    devMode,
                    notifyAbortProgress: (fileCount) => {
                        notifyUploadProgress(
                            managedUploadCallbacks,
                            createUploadProgress(fileCount, {
                                aborted: fileCount,
                            }),
                        );
                    },
                },
                {
                    placeholderMap: [],
                    cleanupPlaceholders: false,
                },
            );
        }
        // その他のエラーは再スロー
        throw error;
    }

    // プレースホルダー挿入（モードに応じてエディタまたはギャラリーへ）
    const galleryMode = !mediaFreePlacementStore.value;
    const galleryCleanup = createGalleryCleanupContext(
        galleryMode,
        effectiveDependencies.imageSizeMapStore,
    );
    const checkAbort = createAbortCheckpointChecker({
        fileArray,
        currentEditor,
        updateUploadState,
        devMode,
        galleryCleanup,
        isUploadAborted,
        deferUploadStateClear,
        notifyAbortProgress: (fileCount) => {
            notifyUploadProgress(
                managedUploadCallbacks,
                createUploadProgress(fileCount, {
                    aborted: fileCount,
                }),
            );
        },
    });

    // 中止チェック（ファイル処理後）
    const abortAfterFileProcessing = checkAbort({
        placeholderMap: [],
        cleanupPlaceholders: false,
    });
    if (abortAfterFileProcessing) {
        return abortAfterFileProcessing;
    }

    let placeholderMap = galleryMode
        ? insertPlaceholdersIntoGallery(
            fileArray,
            fileProcessingResults,
            showUploadError,
            dependencies.imageSizeMapStore,
            FileUploadManagerConstructor,
            devMode
        )
        : insertPlaceholdersIntoEditor(
            fileArray,
            fileProcessingResults,
            currentEditor as TipTapEditor | null,
            showUploadError,
            dependencies.imageSizeMapStore,
            FileUploadManagerConstructor,
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
    const abortAfterPlaceholderInsert = checkAbort({
        placeholderMap,
        cleanupPlaceholders: true,
    });
    if (abortAfterPlaceholderInsert) {
        return abortAfterPlaceholderInsert;
    }

    // アップロード状態を更新（圧縮開始前に設定）
    updateUploadState(true, "");

    // Blurhash生成
    await generateBlurhashes(
        placeholderMap,
        FileUploadManagerConstructor,
        devMode,
        isUploadAborted,
    );

    // 中止チェック（Blurhash生成後）
    const abortAfterBlurhash = checkAbort({
        placeholderMap,
        cleanupPlaceholders: true,
    });
    if (abortAfterBlurhash) {
        return abortAfterBlurhash;
    }

    // アップロード処理
    const validFiles = placeholderMap.map((entry: PlaceholderEntry) => entry.file);
    let results: FileUploadResponse[] | null = null;
    const fileUploadManager = createFileUploadManager(
        effectiveDependencies,
        FileUploadManagerConstructor,
        fileUploadManagerInstance,
    );

    try {
        results = uploadPreparedFiles
            ? await uploadPreparedFiles(validFiles, placeholderMap)
            : await uploadWithManager(
                fileUploadManager,
                validFiles,
                uploadDestination,
                managedUploadCallbacks,
                devMode,
            );
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        showUploadError(errorMsg, 5000);
        results = null;
    } finally {
        // The caller owns the operation lifetime. Keeping this state true
        // through placeholder replacement prevents submit from racing media.
    }

    // 中止された場合は後続処理をスキップ
    const abortAfterUpload = checkAbort({
        placeholderMap,
        cleanupPlaceholders: true,
    });
    if (abortAfterUpload) {
        if (fileInput) fileInput.value = "";
        return abortAfterUpload;
    }

    await effectiveDependencies.tick();

    // プレースホルダー置換・失敗時削除
    const replacementOutcome = await replaceUploadedPlaceholders({
        results,
        placeholderMap,
        galleryMode,
        currentEditor: currentEditor as TipTapEditor | null,
        imageOxMap,
        imageXMap,
        imageSizeMapStore: effectiveDependencies.imageSizeMapStore,
        calculateImageHash: effectiveDependencies.calculateImageHash,
        getMimeTypeFromUrl: effectiveDependencies.getMimeTypeFromUrl,
        devMode,
    });
    const failedResults = [...replacementOutcome.failedResults];
    const errorMessage = replacementOutcome.errorMessage;
    let imageServerBlurhashMap = replacementOutcome.imageServerBlurhashMap;

    if (results && placeholderMap.length > 0) {
        // 置換処理後、placeholderMapをクリア
        placeholderMap = [];
    }

    // dev: imetaタグ出力
    if (devMode && currentEditor) {
        try {
            await generateDevImetaTags({
                editor: currentEditor,
                imageServerBlurhashMap,
                imageOxMap,
                imageXMap,
                dependencies: effectiveDependencies,
            });
        } catch {
            console.warn(`${modeLabel} [dev] imetaタグ生成失敗`, {
                stage: 'imeta-tag',
                reason: 'unexpected',
            });
        }
    }

    if (fileInput) fileInput.value = "";

    if (!deferUploadStateClear) {
        updateUploadState(false);
    }

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
    setUploadErrorMessage: (message: string) => void;
    keepUploading?: boolean;
}

export function showUploadErrorMessage(
    message: string,
    duration = 3000,
    params: ShowUploadErrorMessageParams
) {
    const isUploading = params.keepUploading ?? false;
    params.updateUploadState(isUploading, message);
    setTimeout(() => params.setUploadErrorMessage(""), duration);
}
