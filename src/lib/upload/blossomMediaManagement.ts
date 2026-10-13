import { UploadMediaError, type UploadMediaListParams, type UploadMediaDeleteParams, type UploadMediaContext, type UploadMediaPage } from "./mediaManagementTypes";
import {
    UPLOAD_MEDIA_PAGE_SIZE, assertMediaOperation, assertMediaContext, assertMediaDeleteItem,
    normalizeBlossomManagementServer, normalizeMediaHash, normalizeListedMedia,
    mediaAuthorization, mediaFetch, mediaJson, mediaRecord,
} from "./mediaManagementUtils";

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
    const data = await mediaJson(response);
    assertMediaOperation(params);
    if (response.status !== 200 || !Array.isArray(data) || data.length > limit) throw new UploadMediaError("invalidResponse");
    const last = data.at(-1);
    const cursor = mediaRecord(last) ? normalizeMediaHash(last.sha256) : null;
    if (data.length && (!cursor || cursor === previousCursor
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
        nextPage: cursor ? { protocol: "blossom", cursor, limit } : null };
}
export async function deleteBlossomMedia(params: UploadMediaDeleteParams): Promise<void> {
    assertMediaContext(params, params.context);
    if (params.context.protocol !== "blossom") throw new UploadMediaError("invalidDestination");
    const hash = assertMediaDeleteItem(params.item, params.context);
    const authorization = await authorize(params, "delete", hash, params.item.kind);
    const response = await mediaFetch(params, new URL(hash, params.context.endpoint).toString(), "DELETE", authorization.authorization, authorization.assertValid);
    if (response.status !== 200 && response.status !== 204) throw new UploadMediaError("unknownDelete");
}
