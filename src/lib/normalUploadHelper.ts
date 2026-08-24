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
    FileUploadResponse,
    MimeTypeSupportInterface,
    UploadDestination,
    UploadHelperDependencies,
    UploadHelperResult,
    UploadInfoCallbacks,
} from "./types";
import { buildUploadFailureMessage } from "./uploadResultUtils";
import { uploadDestinationsRepository } from "./storage/uploadDestinationsRepository";
import { authState } from "../stores/authStore.svelte";
import { resolveUploadDestinationForUse } from "./upload/uploadDestinationResolver";
import { getAppStorage } from "./appStorage";
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
        FileUploadManager: FileUploadManager as unknown as new (
            deps?: FileUploadDependencies,
            auth?: AuthService,
            imageCompression?: CompressionService,
            videoCompression?: CompressionService,
            mime?: MimeTypeSupportInterface,
        ) => FileUploadManagerInterface,
        getImageDimensions,
        extractImageBlurhashMap,
        calculateImageHash,
        getMimeTypeFromUrl,
        createImetaTag: async (params: any) => await createImetaTag(params),
        imageSizeMapStore,
        isUploadAborted: isDefaultUploadAborted,
        resolveUploadDestination: resolveCurrentUploadDestination,
    };
}

function createNormalFileUploadManager(
    dependencies: UploadHelperDependencies,
): FileUploadManagerInterface {
    const isUploadAborted = dependencies.isUploadAborted ?? isDefaultUploadAborted;
    if (dependencies.FileUploadManager !== (FileUploadManager as unknown as UploadHelperDependencies["FileUploadManager"])) {
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

export async function resolveCurrentUploadDestination(): Promise<UploadDestination> {
    const identity = authState.value.isAuthenticated
        ? { pubkeyHex: authState.value.pubkey || null, npub: authState.value.npub || null }
        : { pubkeyHex: null, npub: null };
    return resolveUploadDestinationForUse(
        await uploadDestinationsRepository.getDefault(identity.pubkeyHex),
        identity,
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
