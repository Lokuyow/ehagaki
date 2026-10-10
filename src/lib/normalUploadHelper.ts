import { tick } from "svelte";
import type { Editor as TipTapEditor } from "@tiptap/core";
import { FileUploadManager } from "./fileUploadManager";
import { ImageCompressionService } from "./imageCompressionService";
import { MimeTypeSupport } from "./mimeTypeSupport";
import { NostrAuthService } from "./nostrAuthService";
import { VideoCompressionService } from "./videoCompression/videoCompressionService";
import { setImageCompressionService, setVideoCompressionService } from "../stores/uploadStore.svelte";
import { extractImageBlurhashMap, getMimeTypeFromUrl, calculateImageHash, createImetaTag } from "./tags/imetaTag";
import { imageSizeMapStore } from "../stores/tagsStore.svelte";
import { getImageDimensions } from "./utils/fileUtils";
import type {
    AuthService,
    CompressionService,
    FileUploadDependencies,
    FileUploadManagerInterface,
    MimeTypeSupportInterface,
    UploadHelperDependencies,
    UploadHelperResult,
    UploadInfoCallbacks,
} from "./types";
import { buildUploadFailureMessage } from "./uploadResultUtils";
import { resolveCurrentUploadDestination } from "./upload/resolveCurrentUploadDestination";
export { resolveCurrentUploadDestination } from "./upload/resolveCurrentUploadDestination";
import { getAppStorage } from "./appStorage";

const DEFAULT_FILE_UPLOAD_MANAGER: UploadHelperDependencies["FileUploadManager"] = FileUploadManager;
import { showUploadErrorMessage, uploadHelper } from "./uploadHelper";
import { isDefaultUploadAborted } from "./uploadAbortUtils";

export interface UploadFilesParams {
    files: File[] | FileList;
    currentEditor: TipTapEditor | null;
    fileInput?: HTMLInputElement;
    uploadCallbacks?: UploadInfoCallbacks;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    setUploadErrorMessage: (message: string) => void;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    getUploadFailedText: (key: string) => string;
    dependencies?: UploadHelperDependencies;
}

function createDefaultDependencies(): UploadHelperDependencies {
    return {
        localStorage: getAppStorage(),
        crypto: window.crypto.subtle,
        tick,
        FileUploadManager: DEFAULT_FILE_UPLOAD_MANAGER,
        getImageDimensions,
        extractImageBlurhashMap,
        calculateImageHash,
        getMimeTypeFromUrl,
        createImetaTag,
        imageSizeMapStore,
        isUploadAborted: isDefaultUploadAborted,
        resolveUploadDestination: resolveCurrentUploadDestination,
    };
}

function createNormalFileUploadManager(
    dependencies: UploadHelperDependencies,
): FileUploadManagerInterface {
    const isUploadAborted = dependencies.isUploadAborted ?? isDefaultUploadAborted;
    if (dependencies.FileUploadManager !== DEFAULT_FILE_UPLOAD_MANAGER) {
        return new dependencies.FileUploadManager({
            localStorage: dependencies.localStorage,
            fetch: window.fetch.bind(window),
            crypto: dependencies.crypto,
            document: typeof document === "undefined" ? undefined : document,
            window: typeof window === "undefined" ? undefined : window,
            navigator: typeof navigator === "undefined" ? undefined : navigator,
            isUploadAborted,
        });
    }
    const mimeSupport = new MimeTypeSupport(typeof document === "undefined" ? undefined : document);
    const imageCompressionService = new ImageCompressionService(mimeSupport, dependencies.localStorage, isUploadAborted);
    const videoCompressionService = new VideoCompressionService(dependencies.localStorage, isUploadAborted);
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

/** Normal eHagaki transport composition. It is intentionally not imported by Lite. */
export async function uploadFiles(params: UploadFilesParams): Promise<UploadHelperResult | null> {
    if (!params.files || params.files.length === 0) return null;
    const dependencies = params.dependencies ?? createDefaultDependencies();
    const manager = createNormalFileUploadManager(dependencies);
    params.updateUploadState(true, "");
    try {
        const result = await uploadHelper({
            ...params,
            devMode: import.meta.env.MODE === "development",
            dependencies,
            fileUploadManagerInstance: manager,
            showUploadError: (message, duration) => showUploadErrorMessage(message, duration, {
                updateUploadState: params.updateUploadState,
                setUploadErrorMessage: params.setUploadErrorMessage,
                keepUploading: true,
            }),
            deferUploadStateClear: true,
        });
        Object.assign(params.imageOxMap, result.imageOxMap);
        Object.assign(params.imageXMap, result.imageXMap);
        if (result.failedResults.length) {
            showUploadErrorMessage(
                buildUploadFailureMessage(
                    result.failedResults,
                    params.getUploadFailedText("postComponent.upload_failed"),
                    (errorCode) => params.getUploadFailedText(`postComponent.${errorCode}`),
                ) || result.errorMessage,
                5000,
                { updateUploadState: params.updateUploadState, setUploadErrorMessage: params.setUploadErrorMessage },
            );
        }
        if (params.fileInput) params.fileInput.value = "";
        return result;
    } finally {
        params.updateUploadState(false);
    }
}

export interface PerformFileUploadParams extends UploadFilesParams {
    devMode: boolean;
}

/** Compatibility wrapper for callers that explicitly select a runtime mode. */
export async function performFileUpload(params: PerformFileUploadParams): Promise<UploadHelperResult | null> {
    return uploadFiles(params);
}
