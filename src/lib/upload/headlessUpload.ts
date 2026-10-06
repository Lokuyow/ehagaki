import { FileUploadManager } from "../fileUploadManager";
import { decode as decodeBlurhash } from "blurhash";
import { ImageCompressionService } from "../imageCompressionService";
import { MimeTypeSupport } from "../mimeTypeSupport";
import { NostrAuthService } from "../nostrAuthService";
import { VideoCompressionService } from "../videoCompression/videoCompressionService";
import { getAppStorage } from "../appStorage";
import { resolveCurrentUploadDestination } from "./resolveCurrentUploadDestination";
import { AuthenticationRequiredError } from "../sessionLiveness";
import { throwIfUploadAborted } from "./uploadOperation";
import type { EHagakiUploadResult } from "../../web-component/types";
import type { UploadDestination } from "../types";

function createUploadError(
    name: "login_required" | "upload_in_progress" | "unsupported_media" | "upload_failed",
    message: string,
    cause?: unknown,
): Error {
    const error = new Error(message, cause === undefined ? undefined : { cause });
    error.name = name;
    return error;
}

function createHeadlessManager(signal: AbortSignal): FileUploadManager {
    const localStorage = getAppStorage();
    const isUploadAborted = () => signal.aborted;
    const mimeSupport = new MimeTypeSupport(document);
    return new FileUploadManager(
        {
            localStorage,
            fetch: window.fetch.bind(window),
            crypto: window.crypto.subtle,
            document,
            window,
            navigator,
            isUploadAborted,
        },
        new NostrAuthService({ signal }),
        new ImageCompressionService(mimeSupport, localStorage, isUploadAborted),
        new VideoCompressionService(localStorage, isUploadAborted),
        mimeSupport,
    );
}

function isValidMimeType(value: unknown): value is string {
    return typeof value === "string"
        && /^[A-Za-z0-9!#$%&'*+.^_`|~-]+\/[A-Za-z0-9!#$%&'*+.^_`|~-]+$/.test(value);
}

function isValidDimensions(value: unknown): value is string {
    if (typeof value !== "string") return false;
    const match = value.match(/^([1-9]\d*)x([1-9]\d*)$/);
    return !!match
        && Number.isSafeInteger(Number(match[1]))
        && Number.isSafeInteger(Number(match[2]));
}

function isValidBlurhash(value: unknown): boolean {
    if (
        typeof value !== "string"
        || value.length < 6
        || value.length > 180
        || ![...value].every((character) => "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~".includes(character))
    ) return false;
    try {
        decodeBlurhash(value, 1, 1);
        return true;
    } catch {
        return false;
    }
}

function isUnsupportedTransportFailure(message: string): boolean {
    return /\b(?:413|415)\b/.test(message);
}

function mapUploadFailure(message: string | undefined, cause?: unknown): Error {
    const safeMessage = message || "The file could not be uploaded.";
    return createUploadError(
        isUnsupportedTransportFailure(safeMessage) ? "unsupported_media" : "upload_failed",
        safeMessage,
        cause,
    );
}

function isNativeFile(value: unknown): value is File {
    if (typeof value !== "object" || value === null || typeof File === "undefined") return false;
    const nameGetter = Object.getOwnPropertyDescriptor(File.prototype, "name")?.get;
    if (!nameGetter) return false;
    try {
        return typeof nameGetter.call(value) === "string";
    } catch {
        return false;
    }
}

function validateCustomHttpResultUrl(value: string): string {
    try {
        const parsed = new URL(value);
        const authority = value.match(/^[A-Za-z][A-Za-z0-9+.-]*:\/\/([^/?#]*)/)?.[1];
        if (
            (parsed.protocol === "http:" || parsed.protocol === "https:")
            && !parsed.username
            && !parsed.password
            && !authority?.includes("@")
        ) {
            return parsed.href;
        }
    } catch {
        // Public results only accept parseable absolute HTTP(S) URLs.
    }
    throw createUploadError("upload_failed", "The custom HTTP upload returned an invalid URL.");
}

function createHeadlessMetadata(
    result: Awaited<ReturnType<FileUploadManager["uploadFileForHost"]>>,
    destination: UploadDestination,
): Promise<EHagakiUploadResult> {
    return (async () => {
        if (!result.success || !result.url) throw mapUploadFailure(result.error);
        const url = destination.protocol === "custom-http"
            ? validateCustomHttpResultUrl(result.url)
            : result.url;
        const nip94 = destination.protocol === "custom-http" ? {} : result.nip94 ?? {};
        const sha256 = typeof nip94.x === "string" && /^[0-9a-f]{64}$/i.test(nip94.x)
            ? nip94.x.toLowerCase()
            : undefined;
        const mimeType = isValidMimeType(nip94.m) ? nip94.m : undefined;
        const dimValue = nip94.dim
            ?? (destination.protocol === "blossom" && result.dimensions
                ? `${result.dimensions.width}x${result.dimensions.height}`
                : undefined);
        const dim = isValidDimensions(dimValue) ? dimValue : undefined;
        const candidateBlurhash = typeof nip94.blurhash === "string" ? nip94.blurhash : undefined;
        const blurhash = candidateBlurhash && isValidBlurhash(candidateBlurhash)
            ? candidateBlurhash
            : undefined;
        return {
            url,
            ...(mimeType ? { mimeType } : {}),
            ...(dim ? { dim } : {}),
            ...(sha256 ? { sha256 } : {}),
            ...(blurhash ? { blurhash } : {}),
        };
    })();
}

export async function uploadFileForHost(
    file: File,
    signal: AbortSignal,
): Promise<EHagakiUploadResult> {
    throwIfUploadAborted(signal);
    if (!isNativeFile(file)) {
        throw createUploadError("unsupported_media", "A File is required.");
    }
    const manager = createHeadlessManager(signal);
    if (
        typeof file.type !== "string"
        || typeof file.size !== "number"
        || !Number.isFinite(file.size)
        || file.size < 0
    ) {
        throw createUploadError("unsupported_media", "A valid File is required.");
    }
    const validation = manager.validateMediaFile(file);
    if (!validation.isValid) {
        throw createUploadError(
            "unsupported_media",
            validation.errorMessage || "This file type or size is not supported.",
        );
    }

    try {
        const destination = await resolveCurrentUploadDestination();
        throwIfUploadAborted(signal);
        const result = await manager.uploadFileForHost(file, destination, signal);
        throwIfUploadAborted(signal);
        return await createHeadlessMetadata(result, destination);
    } catch (error) {
        throwIfUploadAborted(signal);
        if (error instanceof AuthenticationRequiredError) {
            throw createUploadError("login_required", "Authentication is required for this upload.", error);
        }
        if (error instanceof Error && [
            "login_required",
            "upload_in_progress",
            "unsupported_media",
            "upload_failed",
        ].includes(error.name)) {
            throw error;
        }
        throw mapUploadFailure(error instanceof Error ? error.message : String(error), error);
    }
}
