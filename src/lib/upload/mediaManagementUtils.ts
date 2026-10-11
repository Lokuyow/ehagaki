import { inferPostMediaKind } from "../postMediaCacheUtils";
import { AuthenticationRequiredError } from "../sessionLiveness";
import { throwIfUploadAborted } from "./uploadOperation";
import {
    canonicalizeNip96UploadUrl,
    validateNip96DiscoveryUrl,
    validateNip96MediaUrl,
} from "./nip96UrlPolicy";
import { validateDescriptorUrl } from "./blossomDescriptor";
import {
    UploadMediaError,
    type UploadMediaContext,
    type UploadedMediaItem,
    type UploadMediaOperationParams,
} from "./mediaManagementTypes";

export const UPLOAD_MEDIA_PAGE_SIZE = 24;
export function mediaRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function normalizeMediaHash(value: unknown): string | null {
    return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value)
        ? value.toLowerCase() : null;
}
export function mediaInteger(value: unknown): number | undefined {
    return typeof value === "number" && Number.isSafeInteger(value) && value >= 0
        ? value : undefined;
}
export function assertMediaOperation(params: UploadMediaOperationParams): void {
    throwIfUploadAborted(params.signal);
    params.assertSession();
    if (!normalizeMediaHash(params.expectedPubkey)) throw new UploadMediaError("authentication");
}
export function normalizeBlossomManagementServer(rawUrl: string): string {
    try {
        const parsed = new URL(canonicalizeNip96UploadUrl(rawUrl).url);
        if (parsed.pathname !== "/" || parsed.search) throw new Error();
        return parsed.origin;
    } catch {
        throw new UploadMediaError("invalidDestination");
    }
}
export function assertMediaContext(params: UploadMediaOperationParams, context: UploadMediaContext): void {
    assertMediaOperation(params);
    if (context.protocol !== params.destination.protocol
        || context.destinationId !== params.destination.id
        || context.serverUrl !== params.destination.serverUrl) {
        throw new UploadMediaError("invalidDestination");
    }
    try {
        const trustedUploadUrl = canonicalizeNip96UploadUrl(params.destination.serverUrl);
        const validated = validateNip96DiscoveryUrl({ rawUrl: context.endpoint, trustedUploadUrl });
        if (validated.url !== context.endpoint) throw new Error();
        if (context.protocol === "blossom"
            && context.endpoint !== `${normalizeBlossomManagementServer(context.serverUrl)}/`) throw new Error();
    } catch {
        throw new UploadMediaError("invalidDestination");
    }
}
export function assertMediaDeleteItem(item: UploadedMediaItem, context: UploadMediaContext): string {
    const hash = normalizeMediaHash(item.deleteId?.sha256);
    if (!hash || item.protocol !== context.protocol || item.deleteId?.protocol !== context.protocol
        || item.destinationId !== context.destinationId || item.serverUrl !== context.serverUrl) {
        throw new UploadMediaError("invalidResponse");
    }
    return hash;
}
export async function mediaAuthorization(params: UploadMediaOperationParams, create: () => Promise<string>): Promise<string> {
    assertMediaOperation(params);
    try {
        const authorization = await create();
        assertMediaOperation(params);
        if (!authorization) throw new UploadMediaError("authentication");
        return authorization;
    } catch {
        throwIfUploadAborted(params.signal);
        throw new UploadMediaError("authentication");
    }
}
export function mediaHttpError(response: Response, listing: boolean, authorization?: string): UploadMediaError {
    const status = response.status;
    const code = listing && [404, 405, 501].includes(status) ? "unavailable"
        : status === 401 ? "authentication" : status === 403 ? "forbidden"
        : status === 402 ? "payment" : status === 429 ? "rateLimited"
        : status >= 500 ? "serverError" : "invalidResponse";
    let reason = response.headers.get("X-Reason") ?? "";
    if (authorization) {
        reason = reason.replaceAll(authorization, "[redacted]");
        const credential = authorization.replace(/^Nostr\s+/i, "");
        if (credential) reason = reason.replaceAll(credential, "[redacted]");
    }
    reason = reason.replace(/Nostr\s+[A-Za-z0-9+/_=-]+/gi, "[redacted]")
        .replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, 200);
    const retry = response.headers.get("Retry-After");
    const retryAt = retry && /^\d+$/.test(retry) ? Date.now() + Number(retry) * 1000
        : retry ? Date.parse(retry) : undefined;
    return new UploadMediaError(code, status, reason || undefined,
        retryAt !== undefined && Number.isFinite(retryAt) ? retryAt : undefined);
}
export async function mediaFetch(params: UploadMediaOperationParams, url: string, method: "GET" | "DELETE", authorization: string, assertAuthorization?: () => void): Promise<Response> {
    assertMediaOperation(params);
    try { assertAuthorization?.(); }
    catch { throwIfUploadAborted(params.signal); throw new UploadMediaError("authentication"); }
    if (method === "DELETE") params.onDeleteDispatched?.();
    let response: Response;
    try {
        response = await params.fetch(url, {
            method, headers: { Authorization: authorization }, signal: params.signal,
            credentials: "omit", referrerPolicy: "no-referrer", redirect: "error",
            cache: "no-store",
        });
    } catch {
        if (method === "GET") throwIfUploadAborted(params.signal);
        throw new UploadMediaError(method === "DELETE" ? "unknownDelete" : "network");
    }
    // A confirmed remote delete remains meaningful even after its UI owner closes.
    if (method === "GET") assertMediaOperation(params);
    if (!response.ok) throw mediaHttpError(response, method === "GET", authorization);
    return response;
}
export async function mediaJson(response: Response, deleting = false): Promise<unknown> {
    try { return await response.json(); }
    catch { throw new UploadMediaError(deleting ? "unknownDelete" : "invalidResponse"); }
}
export function normalizeMediaOperationError(error: unknown): UploadMediaError {
    return error instanceof UploadMediaError ? error
        : new UploadMediaError(error instanceof AuthenticationRequiredError ? "authentication" : "network");
}

type MediaFields = { url?: unknown; mime?: unknown; hash?: unknown; size?: unknown; uploaded?: unknown };
export function normalizeListedMedia(fields: MediaFields, context: UploadMediaContext, fallbackId: string): UploadedMediaItem | null {
    const mimeType = typeof fields.mime === "string" ? fields.mime.split(";")[0].trim().toLowerCase() : "";
    const rawUrl = typeof fields.url === "string" ? fields.url : "";
    // A provided non-media or malformed MIME must never be overridden by a suffix.
    const kind = mimeType ? (/^image\/[a-z0-9!#$&^_.+-]+$/.test(mimeType) ? "image"
        : /^video\/[a-z0-9!#$&^_.+-]+$/.test(mimeType) ? "video" : "unknown")
        : fields.mime !== undefined ? "unknown" : inferPostMediaKind({ url: rawUrl });
    if (kind !== "image" && kind !== "video") return null;
    const hash = normalizeMediaHash(fields.hash);
    let url: string | null = null;
    try {
        if (context.protocol === "blossom") {
            if (hash) url = validateDescriptorUrl({ rawUrl, expectedSha256: hash, trustedServerUrl: context.serverUrl });
        } else {
            url = validateNip96MediaUrl({ rawUrl, trustedUploadUrl: canonicalizeNip96UploadUrl(context.endpoint) }).url;
        }
    } catch { /* The item can still be deleted by a verified management hash. */ }
    const size = mediaInteger(fields.size);
    const uploadedAt = mediaInteger(fields.uploaded);
    return {
        id: hash ? `${context.destinationId}:${hash}:${url ?? "missing-url"}` : fallbackId,
        destinationId: context.destinationId, protocol: context.protocol, serverUrl: context.serverUrl,
        kind, url, ...(mimeType ? { mimeType } : {}),
        ...(size !== undefined ? { size } : {}),
        ...(uploadedAt !== undefined && Number.isFinite(new Date(uploadedAt * 1000).getTime()) ? { uploadedAt } : {}),
        deleteId: hash ? { protocol: context.protocol, sha256: hash } : null,
    };
}
