import { UploadMediaError, type UploadMediaListParams, type UploadMediaDeleteParams, type UploadMediaContext, type UploadMediaPage } from "./mediaManagementTypes";
import {
    UPLOAD_MEDIA_PAGE_SIZE, assertMediaOperation, assertMediaContext, assertMediaDeleteItem,
    normalizeBlossomManagementServer, normalizeMediaHash, normalizeListedMedia,
    mediaAuthorization, mediaFetch, mediaRecord,
} from "./mediaManagementUtils";

export const BLOSSOM_LIST_MAX_BYTES = 8 * 1024 * 1024;
export const BLOSSOM_LIST_MAX_DESCRIPTORS = 10_000;

async function listJson(response: Response, params: UploadMediaListParams): Promise<unknown> {
    const length = Number(response.headers.get("Content-Length"));
    if (Number.isFinite(length) && length > BLOSSOM_LIST_MAX_BYTES) {
        void response.body?.cancel().catch(() => undefined);
        throw new UploadMediaError("invalidResponse");
    }
    const reader = response.body?.getReader();
    if (!reader) throw new UploadMediaError("invalidResponse");
    const decoder = new TextDecoder();
    let bytes = 0, text = "", done = false;
    try {
        while (true) {
            assertMediaOperation(params);
            const chunk = await reader.read();
            assertMediaOperation(params);
            if (chunk.done) { done = true; break; }
            bytes += chunk.value.byteLength;
            if (bytes > BLOSSOM_LIST_MAX_BYTES) throw new UploadMediaError("invalidResponse");
            text += decoder.decode(chunk.value, { stream: true });
        }
        return JSON.parse(text + decoder.decode());
    } catch {
        assertMediaOperation(params);
        throw new UploadMediaError("invalidResponse");
    } finally {
        if (!done) void reader.cancel().catch(() => undefined);
        reader.releaseLock();
    }
}

async function authorize(params: UploadMediaListParams, action: "list" | "delete", sha256?: string, kind?: "image" | "video") {
    let assertValid = () => {};
    const authorization = await mediaAuthorization(params, async () => {
        const create = params.authService.createBlossomManagementAuthorization;
        if (!create) throw new UploadMediaError("authentication");
        const context = await create.call(params.authService, {
            serverUrl: params.destination.serverUrl, action, expectedPubkey: params.expectedPubkey, sha256, kind,
        });
        context.assertSession();
        assertValid = context.assertSession;
        return context.authorization;
    });
    return { authorization, assertValid };
}
export async function listBlossomMediaPage(params: UploadMediaListParams): Promise<UploadMediaPage> {
    assertMediaOperation(params);
    if (params.destination.protocol !== "blossom" || (params.page && params.page.protocol !== "blossom")) throw new UploadMediaError("invalidDestination");
    const origin = normalizeBlossomManagementServer(params.destination.serverUrl);
    const context: UploadMediaContext = params.context ?? {
        protocol: "blossom", destinationId: params.destination.id, serverUrl: params.destination.serverUrl, endpoint: `${origin}/`,
    };
    assertMediaContext(params, context);
    const limit = params.page?.protocol === "blossom" ? params.page.limit : UPLOAD_MEDIA_PAGE_SIZE;
    if (!Number.isSafeInteger(limit) || limit < 1) throw new UploadMediaError("invalidResponse");
    const url = new URL(`/list/${params.expectedPubkey}`, origin);
    url.searchParams.set("limit", String(limit));
    const previousCursor = params.page?.protocol === "blossom" ? params.page.cursor : undefined;
    if (previousCursor) {
        if (!normalizeMediaHash(previousCursor)) throw new UploadMediaError("invalidResponse");
        url.searchParams.set("cursor", previousCursor);
    }
    const authorization = await authorize(params, "list");
    const response = await mediaFetch(params, url.toString(), "GET", authorization.authorization, authorization.assertValid);
    if (response.status !== 200) throw new UploadMediaError("invalidResponse");
    const data = await listJson(response, params);
    assertMediaOperation(params);
    if (!Array.isArray(data) || data.length > BLOSSOM_LIST_MAX_DESCRIPTORS) throw new UploadMediaError("invalidResponse");
    const last = data.at(-1);
    const cursor = mediaRecord(last) ? normalizeMediaHash(last.sha256) : null;
    // A server that ignores the cursor may repeat its final page. Consume that
    // response as a bounded snapshot, with no further remote continuation.
    const localSnapshot = data.length > limit || Boolean(previousCursor && cursor === previousCursor);
    if (!localSnapshot && data.length && (!cursor
        || data.some((entry) => mediaRecord(entry) && normalizeMediaHash(entry.sha256) === previousCursor))) {
        throw new UploadMediaError("invalidResponse");
    }
    const items: UploadMediaPage["items"] = [];
    let excludedCount = 0, invalidCount = 0;
    data.forEach((descriptor, index) => {
        if (!mediaRecord(descriptor)) { invalidCount++; return; }
        const item = normalizeListedMedia({ url: descriptor.url, mime: descriptor.type,
            hash: descriptor.sha256, size: descriptor.size, uploaded: descriptor.uploaded,
        }, context, `${context.destinationId}:${previousCursor ?? "first"}:${index}`);
        if (!item) excludedCount++;
        else { items.push(item); if (!item.url || !item.deleteId) invalidCount++; }
    });
    return { items, rawCount: data.length, excludedCount, invalidCount, context,
        ...(localSnapshot ? { localSnapshot: true as const } : {}),
        nextPage: !localSnapshot && cursor ? { protocol: "blossom", cursor, limit } : null };
}
export async function deleteBlossomMedia(params: UploadMediaDeleteParams): Promise<void> {
    assertMediaContext(params, params.context);
    if (params.context.protocol !== "blossom") throw new UploadMediaError("invalidDestination");
    const hash = assertMediaDeleteItem(params.item, params.context);
    const authorization = await authorize(params, "delete", hash, params.item.kind);
    const response = await mediaFetch(params, new URL(hash, params.context.endpoint).toString(), "DELETE", authorization.authorization, authorization.assertValid);
    if (response.status !== 200 && response.status !== 204) throw new UploadMediaError("unknownDelete");
}
