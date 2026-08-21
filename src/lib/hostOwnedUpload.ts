import { ImageCompressionService } from "./imageCompressionService";
import { MimeTypeSupport } from "./mimeTypeSupport";
import { VideoCompressionService } from "./videoCompression/videoCompressionService";
import { calculateSHA256Hex, getImageDimensions } from "./utils/fileUtils";
import { calculateImageDisplaySize } from "./utils/mediaNodeUtils";
import { MAX_FILE_SIZE } from "./constants";
import { generateBlurhashForFile } from "./tags/imetaTag";
import type {
    FileUploadManagerInterface,
    FileValidationResult,
    FileUploadResponse,
    PlaceholderEntry,
    PreparedUploadFile,
    UploadHelperDependencies,
} from "./types";
import type {
    EHagakiHostMediaMetadata,
    EHagakiHostMediaUploadResult,
} from "../web-component/types";

const ALLOWED_IMETA_FIELDS = new Set([
    "alt",
    "blurhash",
    "dim",
    "m",
    "ox",
    "size",
    "x",
]);

function isHttpUrl(value: unknown): value is string {
    if (typeof value !== "string") return false;
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function sanitizeImeta(value: unknown): Record<string, string> {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const result: Record<string, string> = {};
    for (const [key, field] of Object.entries(value as Record<string, unknown>)) {
        if (ALLOWED_IMETA_FIELDS.has(key) && typeof field === "string") {
            result[key] = field;
        }
    }
    return result;
}

export interface HostOwnedUploadExecutor {
    prepareFiles(files: File[], deps: UploadHelperDependencies): Promise<PreparedUploadFile[]>;
    uploadPreparedFiles(files: File[], placeholders: PlaceholderEntry[]): Promise<FileUploadResponse[]>;
    fileUploadManager: UploadHelperDependencies["FileUploadManager"];
}

/**
 * Placeholder validation and blurhash generation do not need a transport or
 * Nostr authentication. Keeping this small class local prevents the generic
 * FileUploadManager from constructing a NostrAuthService in Host-owned mode.
 */
class HostOwnedMediaFileUploadManager implements FileUploadManagerInterface {
    validateImageFile(file: File): FileValidationResult {
        if (!file.type.startsWith("image/")) {
            return { isValid: false, errorMessage: "only_images_allowed" };
        }
        return file.size > MAX_FILE_SIZE
            ? { isValid: false, errorMessage: "file_too_large" }
            : { isValid: true };
    }

    validateMediaFile(file: File): FileValidationResult {
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
            return { isValid: false, errorMessage: "only_images_or_videos_allowed" };
        }
        return file.size > MAX_FILE_SIZE
            ? { isValid: false, errorMessage: "file_too_large" }
            : { isValid: true };
    }

    async generateBlurhashForFile(file: File): Promise<string | null> {
        return await generateBlurhashForFile(file);
    }

    async uploadFileWithCallbacks(): Promise<FileUploadResponse> {
        throw new Error("Host-owned media never uses eHagaki upload transport.");
    }

    async uploadMultipleFilesWithCallbacks(): Promise<FileUploadResponse[]> {
        throw new Error("Host-owned media never uses eHagaki upload transport.");
    }
}

/**
 * Keeps compression in this bundle and delegates only the final, same-realm
 * File handoff. This is intentionally a local Host-owned composition seam,
 * not a general upload-provider layer.
 */
export function createHostOwnedUploadExecutor(params: {
    uploadMedia: (
        file: File,
        metadata: Readonly<EHagakiHostMediaMetadata>,
        options: { signal: AbortSignal },
    ) => Promise<EHagakiHostMediaUploadResult> | EHagakiHostMediaUploadResult;
    signal: AbortSignal;
}): HostOwnedUploadExecutor {
    const metadataByFile = new WeakMap<File, EHagakiHostMediaMetadata>();
    const dimensionsByFile = new WeakMap<File, { width: number; height: number; displayWidth: number; displayHeight: number }>();

    return {
        fileUploadManager: HostOwnedMediaFileUploadManager,
        async prepareFiles(files, deps) {
            const mimeSupport = new MimeTypeSupport(
                typeof document === "undefined" ? undefined : document,
            );
            const isAborted = () => params.signal.aborted || !!deps.isUploadAborted?.();
            const imageCompression = new ImageCompressionService(
                mimeSupport,
                deps.localStorage,
                isAborted,
            );
            const videoCompression = new VideoCompressionService(
                deps.localStorage,
                isAborted,
            );
            const prepared: PreparedUploadFile[] = [];

            for (let index = 0; index < files.length; index += 1) {
                const original = files[index];
                if (params.signal.aborted) {
                    throw new DOMException("The host media operation was aborted.", "AbortError");
                }
                if (
                    original.size > MAX_FILE_SIZE ||
                    (!original.type.startsWith("image/") && !original.type.startsWith("video/"))
                ) {
                    // Let the existing placeholder validation present the localized error.
                    prepared.push({ file: original, index });
                    continue;
                }

                const ox = await calculateSHA256Hex(original, deps.crypto, isAborted)
                    .catch(() => undefined);
                const compression = original.type.startsWith("video/")
                    ? videoCompression
                    : imageCompression;
                const result = await compression.compress(original);
                if (result.aborted || params.signal.aborted) {
                    throw new DOMException("The host media operation was aborted.", "AbortError");
                }
                const dimensions = result.file.type.startsWith("image/")
                    ? await getImageDimensions(result.file)
                    : null;
                metadataByFile.set(result.file, {
                    originalName: original.name,
                    originalSize: original.size,
                    originalType: original.type,
                    processedName: result.file.name,
                    processedSize: result.file.size,
                    processedType: result.file.type,
                    ...(ox ? { ox } : {}),
                    ...(dimensions ? { width: dimensions.width, height: dimensions.height } : {}),
                });
                if (dimensions) dimensionsByFile.set(result.file, dimensions);
                prepared.push({
                    file: result.file,
                    index,
                    ...(ox ? { ox } : {}),
                    ...(dimensions ? { dimensions } : {}),
                });
            }

            return prepared;
        },

        async uploadPreparedFiles(files, placeholders) {
            const placeholderByFile = new Map(
                placeholders.map((placeholder) => [placeholder.file, placeholder]),
            );
            const results: FileUploadResponse[] = [];
            for (const file of files) {
                if (params.signal.aborted) {
                    results.push({ success: false, aborted: true });
                    continue;
                }
                const placeholder = placeholderByFile.get(file);
                const base = metadataByFile.get(file) ?? {
                    originalName: file.name,
                    originalSize: file.size,
                    originalType: file.type,
                    processedName: file.name,
                    processedSize: file.size,
                    processedType: file.type,
                };
                const metadata: EHagakiHostMediaMetadata = {
                    ...base,
                    ...(placeholder?.blurhash ? { blurhash: placeholder.blurhash } : {}),
                };

                try {
                    const response = await params.uploadMedia(file, metadata, {
                        signal: params.signal,
                    });
                    if (params.signal.aborted) {
                        results.push({ success: false, aborted: true });
                        continue;
                    }
                    if (!isHttpUrl(response?.url)) {
                        results.push({ success: false, error: "host_media_invalid_result" });
                        continue;
                    }
                    const imeta = sanitizeImeta(response.imeta);
                    results.push({
                        success: true,
                        url: response.url,
                        nip94: {
                            ...imeta,
                            m: imeta.m ?? metadata.processedType ?? file.type,
                            ...(metadata.ox && !imeta.ox ? { ox: metadata.ox } : {}),
                            ...(metadata.blurhash && !imeta.blurhash
                                ? { blurhash: metadata.blurhash }
                                : {}),
                            size: imeta.size ?? String(file.size),
                            ...(metadata.width && metadata.height
                                ? { dim: imeta.dim ?? `${metadata.width}x${metadata.height}` }
                                : {}),
                        },
                        ...(dimensionsByFile.get(file)
                            ? { dimensions: dimensionsByFile.get(file)! }
                            : metadata.width && metadata.height
                                ? { dimensions: calculateImageDisplaySize(metadata.width, metadata.height) }
                                : {}),
                        uploadProtocol: "custom-http",
                        sizeInfo: {
                            originalSize: metadata.originalSize,
                            compressedSize: file.size,
                            wasCompressed: metadata.originalSize !== file.size,
                            compressionRatio: metadata.originalSize
                                ? file.size / metadata.originalSize
                                : 1,
                            sizeReduction: "",
                            originalFilename: metadata.originalName,
                            compressedFilename: file.name,
                        },
                    });
                } catch (error) {
                    results.push({
                        success: false,
                        ...(params.signal.aborted ? { aborted: true } : {}),
                        error: error instanceof Error ? error.message : "host_media_upload_failed",
                    });
                }
            }
            return results;
        },
    };
}
