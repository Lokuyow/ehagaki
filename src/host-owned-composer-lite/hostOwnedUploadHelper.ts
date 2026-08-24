import { mediaFreePlacementStore } from "../stores/uploadStore.svelte";
import { mediaGalleryStore } from "../stores/mediaGalleryStore.svelte";
import type { UploadHelperResult } from "../lib/types";

type HostUploadParams = {
    files: File[] | FileList;
    currentEditor: any;
    fileInput?: HTMLInputElement;
    updateUploadState: (isUploading: boolean, message?: string) => void;
    showUploadError: (message: string, duration?: number) => void;
    prepareFiles?: (files: File[], dependencies: any) => Promise<Array<{ file: File; ox?: string; dimensions?: { width: number; height: number } }>>;
    uploadPreparedFiles?: (files: File[], placeholders: Array<{ file: File }>) => Promise<Array<any>>;
    dependencies?: any;
};

function createMediaId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `host-media-${Date.now()}-${Math.random()}`;
}

/**
 * Lite's final transport is the host callback. Compression and validation are
 * still performed by createHostOwnedUploadExecutor before this small handoff.
 */
export async function uploadHelper(params: HostUploadParams): Promise<UploadHelperResult> {
    const files = Array.from(params.files);
    if (!params.prepareFiles || !params.uploadPreparedFiles || !params.dependencies) {
        throw new Error("Host-owned media requires the Lite upload executor.");
    }
    params.updateUploadState(true, "");
    try {
        const prepared = await params.prepareFiles(files, params.dependencies);
        const placeholders = prepared.map(({ file }) => ({ file }));
        const results = await params.uploadPreparedFiles(
            prepared.map(({ file }) => file),
            placeholders,
        );
        const imageOxMap: Record<string, string> = {};
        const imageXMap: Record<string, string> = {};
        results.forEach((result, index) => {
            if (!result?.success || !result.url) return;
            const source = prepared[index];
            const file = source.file;
            const type = file.type.startsWith("video/") ? "video" : "image";
            const metadata = result.nip94 ?? {};
            if (source.ox) imageOxMap[result.url] = source.ox;
            if (mediaFreePlacementStore.value && params.currentEditor) {
                const nodeType = type === "video" ? "video" : "image";
                params.currentEditor.commands.insertContent({
                    type: nodeType,
                    attrs: {
                        src: result.url,
                        ...(type === "image" ? { alt: metadata.alt ?? "Image" } : {}),
                        ...(metadata.blurhash ? { blurhash: metadata.blurhash } : {}),
                        ...(metadata.dim ? { dim: metadata.dim } : {}),
                        ...(metadata.size ? { size: Number(metadata.size) } : {}),
                        ...(metadata.m ? { mimeType: metadata.m } : {}),
                        ...(source.ox ? { ox: source.ox } : {}),
                        uploadProtocol: "custom-http",
                    },
                });
                return;
            }
            mediaGalleryStore.addItem({
                id: createMediaId(),
                type,
                src: result.url,
                isPlaceholder: false,
                mimeType: metadata.m ?? file.type,
                ...(metadata.blurhash ? { blurhash: metadata.blurhash } : {}),
                ...(metadata.dim ? { dim: metadata.dim } : {}),
                ...(metadata.alt ? { alt: metadata.alt } : {}),
                ...(metadata.size ? { size: Number(metadata.size) } : { size: file.size }),
                ...(source.ox ? { ox: source.ox } : {}),
                uploadProtocol: "custom-http",
            });
        });
        if (params.fileInput) params.fileInput.value = "";
        return { placeholderMap: [], results, imageOxMap, imageXMap, failedResults: [], errorMessage: "" };
    } catch (error) {
        const message = error instanceof Error ? error.message : "host_media_upload_failed";
        params.showUploadError(message, 5000);
        return { placeholderMap: [], results: null, imageOxMap: {}, imageXMap: {}, failedResults: [], errorMessage: message };
    } finally {
        params.updateUploadState(false, "");
    }
}

export function showUploadErrorMessage(
    message: string,
    duration = 3000,
    params: {
        updateUploadState: (isUploading: boolean, message?: string) => void;
        setUploadErrorMessage: (message: string) => void;
        keepUploading?: boolean;
    },
): void {
    params.updateUploadState(params.keepUploading ?? false, message);
    setTimeout(() => params.setUploadErrorMessage(""), duration);
}
