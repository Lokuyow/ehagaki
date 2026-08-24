import { tick } from "svelte";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { FileUploadManager } from "./fileUploadManager";
import { ImageCompressionService } from "./imageCompressionService";
import { MimeTypeSupport } from "./mimeTypeSupport";
import { NostrAuthService } from "./nostrAuthService";
import { VideoCompressionService } from "./videoCompression/videoCompressionService";
import {
    mediaFreePlacementStore,
    setVideoCompressionService,
    setImageCompressionService,
} from '../stores/uploadStore.svelte';
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
import { uploadDestinationsRepository } from "./storage/uploadDestinationsRepository";
import { authState } from "../stores/authStore.svelte";
import { resolveUploadDestinationForUse } from "./upload/uploadDestinationResolver";
import { getAppStorage } from "./appStorage";

const isHostOwnedLiteBuild = typeof __EHAGAKI_COMPOSER_LITE__ !== "undefined"
    && __EHAGAKI_COMPOSER_LITE__;

function createFileUploadManager(
    dependencies: UploadHelperDependencies,
    FileUploadManagerConstructor = dependencies.FileUploadManager,
): FileUploadManagerInterface {
    const isUploadAborted = dependencies.isUploadAborted ?? isDefaultUploadAborted;

    if (
        !isHostOwnedLiteBuild &&
        FileUploadManagerConstructor ===
        (FileUploadManager as unknown as UploadHelperDependencies["FileUploadManager"])
    ) {
        const mimeSupport = new MimeTypeSupport(
            typeof document === "undefined" ? undefined : document,
        );
        const imageCompressionService = new ImageCompressionService(
            mimeSupport,
            dependencies.localStorage,
            isUploadAborted,
        );
        const videoCompressionService = new VideoCompressionService(
            dependencies.localStorage,
            isUploadAborted,
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
                isUploadAborted,
            },
            new NostrAuthService(),
            imageCompressionService,
            videoCompressionService,
            mimeSupport,
        );
    }

    return new FileUploadManagerConstructor();
}

function getCurrentUploadDestinationIdentity(): {
    pubkeyHex: string | null;
    npub: string | null;
} {
    if (!authState.value.isAuthenticated) {
        return {
            pubkeyHex: null,
            npub: null,
        };
    }

    return {
        pubkeyHex: authState.value.pubkey || null,
        npub: authState.value.npub || null,
    };
}

export async function resolveCurrentUploadDestination(): Promise<UploadDestination> {
    const identity = getCurrentUploadDestinationIdentity();
    return resolveUploadDestinationForUse(
        await uploadDestinationsRepository.getDefault(identity.pubkeyHex),
        identity,
    );
}

function getDestinationUploadEndpoint(destination: UploadDestination | undefined): string | undefined {
    if (!destination) return undefined;
    if (destination.protocol === "nip96") {
        return destination.resolvedUploadUrl || destination.serverUrl;
    }
    return destination.serverUrl;
}

async function uploadValidFiles(
    fileUploadManager: FileUploadManagerInterface,
    validFiles: File[],
    endpoint: string,
    uploadCallbacks: UploadInfoCallbacks | undefined,
    metadataList: Array<Record<string, string | number | undefined>> | undefined,
    devMode: boolean,
    destination?: UploadDestination,
): Promise<FileUploadResponse[] | null> {
    try {
        if (validFiles.length === 1) {
            const response = destination
                ? await fileUploadManager.uploadFileWithCallbacks(
                    validFiles[0],
                    endpoint,
                    uploadCallbacks,
                    devMode,
                    metadataList?.[0],
                    destination,
                )
                : await fileUploadManager.uploadFileWithCallbacks(
                    validFiles[0],
                    endpoint,
                    uploadCallbacks,
                    devMode,
                    metadataList?.[0],
                );
            return [response];
        }

        if (validFiles.length > 1) {
            return destination
                ? await fileUploadManager.uploadMultipleFilesWithCallbacks(
                    validFiles,
                    endpoint,
                    uploadCallbacks,
                    metadataList,
                    destination,
                )
                : await fileUploadManager.uploadMultipleFilesWithCallbacks(
                    validFiles,
                    endpoint,
                    uploadCallbacks,
                    metadataList,
                );
        }
    } catch (error) {
        if (devMode) {
            const modeLabel = import.meta.env.MODE === "development" ? "[dev]" : "[preview]";
            console.error(`${modeLabel} [uploadHelper] Upload error`, {
                stage: 'upload',
                reason: 'unexpected',
            });
        }
        throw error;
    }

    return null;
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

// デフォルトの依存関係
const createDefaultDependencies = (): UploadHelperDependencies => ({
    localStorage: getAppStorage(),
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
    isUploadAborted: isDefaultUploadAborted,
    extractImageBlurhashMap,
    calculateImageHash,
    getMimeTypeFromUrl,
    createImetaTag: async (params: any) => await createImetaTag(params),
    imageSizeMapStore,
    resolveUploadDestination: resolveCurrentUploadDestination,
});

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
    deferUploadStateClear = false,
    isUploadAborted: operationAbortChecker,
}: UploadHelperParams): Promise<UploadHelperResult> {
    if (!dependencies) {
        if (isHostOwnedLiteBuild) {
            throw new Error("Host-owned Composer Lite requires explicit upload dependencies.");
        }
        dependencies = createDefaultDependencies();
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
    const endpoint = getDestinationUploadEndpoint(uploadDestination) || "";
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
    );

    try {
        const metadataList = prepareMetadataList(validFiles);
        results = uploadPreparedFiles
            ? await uploadPreparedFiles(validFiles, placeholderMap)
            : await uploadValidFiles(
                fileUploadManager,
                validFiles,
                endpoint,
                managedUploadCallbacks,
                metadataList,
                devMode,
                uploadDestination,
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

export interface PerformFileUploadParams {
    files: File[] | FileList;
    currentEditor: TipTapEditor | null;
    fileInput?: HTMLInputElement;
    uploadCallbacks?: UploadInfoCallbacks;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    setUploadErrorMessage: (message: string) => void;
    devMode: boolean;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    dependencies?: UploadHelperDependencies;
    getUploadFailedText: (key: string) => string;
}

export async function performFileUpload(params: PerformFileUploadParams): Promise<UploadHelperResult | null> {
    const {
        files,
        currentEditor,
        fileInput,
        uploadCallbacks,
        updateUploadState,
        setUploadErrorMessage,
        devMode,
        imageOxMap,
        imageXMap,
        dependencies,
        getUploadFailedText,
    } = params;

    if (!files || files.length === 0) return null;
    if (!dependencies && isHostOwnedLiteBuild) {
        throw new Error("Host-owned Composer Lite does not provide the normal uploader.");
    }

    updateUploadState(true, "");
    let result: UploadHelperResult;
    try {
        result = await uploadHelper({
            files,
            currentEditor,
            fileInput,
            uploadCallbacks,
            showUploadError: (msg: string, duration?: number) =>
                showUploadErrorMessage(msg, duration, {
                    updateUploadState,
                    setUploadErrorMessage,
                    keepUploading: true,
                }),
            updateUploadState,
            devMode,
            dependencies: dependencies ?? createDefaultDependencies(),
            deferUploadStateClear: true,
        });
    } finally {
        updateUploadState(false);
    }

    Object.assign(imageOxMap, result.imageOxMap);
    Object.assign(imageXMap, result.imageXMap);

    if (result.failedResults?.length) {
        showUploadErrorMessage(
            buildUploadFailureMessage(
                result.failedResults,
                getUploadFailedText("postComponent.upload_failed"),
                (errorCode) => getUploadFailedText(`postComponent.${errorCode}`),
            ) || result.errorMessage,
            5000,
            { updateUploadState, setUploadErrorMessage }
        );
    }
    if (fileInput) fileInput.value = "";
    return result;
}

export interface UploadFilesParams {
    files: File[] | FileList;
    currentEditor: TipTapEditor | null;
    fileInput?: HTMLInputElement;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    setUploadErrorMessage: (message: string) => void;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    getUploadFailedText: (key: string) => string;
    dependencies?: UploadHelperDependencies;
}

export async function uploadFiles(params: UploadFilesParams): Promise<UploadHelperResult | null> {
    const {
        files,
        currentEditor,
        fileInput,
        updateUploadState,
        setUploadErrorMessage,
        imageOxMap,
        imageXMap,
        getUploadFailedText,
        dependencies,
    } = params;

    return await performFileUpload({
        files,
        currentEditor,
        fileInput,
        updateUploadState,
        setUploadErrorMessage,
        devMode: import.meta.env.MODE === "development",
        imageOxMap,
        imageXMap,
        dependencies,
        getUploadFailedText,
    });
}
