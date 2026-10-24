import { getNip96DiscoveryServer } from "./nip96ServerIdentity";
import { canonicalizeNip96UploadUrl } from "./nip96UrlPolicy";
import { fetchNip96DiscoveryConfig } from "./nip96Discovery";
import { UploadMediaError, type UploadMediaContext, type UploadMediaListParams, type UploadMediaDeleteParams, type UploadMediaPage } from "./mediaManagementTypes";
import {
    UPLOAD_MEDIA_PAGE_SIZE, assertMediaOperation, assertMediaContext, assertMediaDeleteItem,
    mediaAuthorization, mediaFetch, mediaJson, mediaRecord, mediaInteger, normalizeListedMedia,
} from "./mediaManagementUtils";

function tagsOf(record: Record<string, unknown>): Map<string, string | null> | null {
    if (!Array.isArray(record.tags)) return null;
    const tags = new Map<string, string | null>();
    for (const tag of record.tags) {
        if (!Array.isArray(tag) || typeof tag[0] !== "string" || typeof tag[1] !== "string") continue;
        const current = tags.get(tag[0]);
        tags.set(tag[0], current !== undefined && current !== tag[1] ? null : tag[1]);
    }
    return tags;
}
async function contextFor(params: UploadMediaListParams): Promise<UploadMediaContext> {
    if (params.context) { assertMediaContext(params, params.context); return params.context; }
    let trustedUploadUrl;
    try { trustedUploadUrl = canonicalizeNip96UploadUrl(getNip96DiscoveryServer(params.destination)); }
    catch { throw new UploadMediaError("invalidDestination"); }
    const { apiUrl } = await fetchNip96DiscoveryConfig({ trustedUploadUrl, fetch: params.fetch, signal: params.signal });
    assertMediaOperation(params);
    return { protocol: "nip96", destinationId: params.destination.id, serverUrl: params.destination.serverUrl, endpoint: apiUrl };
}
export async function listNip96MediaPage(params: UploadMediaListParams): Promise<UploadMediaPage> {
    assertMediaOperation(params);
    if (params.destination.protocol !== "nip96" || (params.page && params.page.protocol !== "nip96")) throw new UploadMediaError("invalidDestination");
    const context = await contextFor(params);
    const page = params.page?.protocol === "nip96" ? params.page.page : 0;
    const count = params.page?.protocol === "nip96" ? params.page.count : UPLOAD_MEDIA_PAGE_SIZE;
    if (!Number.isSafeInteger(page) || page < 0 || !Number.isSafeInteger(count) || count < 1) throw new UploadMediaError("invalidResponse");
    const requestUrl = new URL(context.endpoint);
    requestUrl.searchParams.set("page", String(page));
    requestUrl.searchParams.set("count", String(count));
    const url = requestUrl.toString();
    const authorization = await mediaAuthorization(params, () => params.authService.buildAuthHeader(url, "GET"));
    const response = await mediaFetch(params, url, "GET", authorization);
    const data = await mediaJson(response);
    assertMediaOperation(params);
    if (response.status !== 200 || !mediaRecord(data) || !Array.isArray(data.files)
        || mediaInteger(data.page) !== page || !mediaInteger(data.count)
        || mediaInteger(data.total) === undefined || data.files.length > Number(data.count)
        || page * Number(data.count) + data.files.length > Number(data.total)
        || (params.page && data.count !== count)
        || (data.files.length === 0 && page * Number(data.count) < Number(data.total))) {
        throw new UploadMediaError("invalidResponse");
    }
    const items: UploadMediaPage["items"] = [];
    let excludedCount = 0, invalidCount = 0;
    data.files.forEach((record, index) => {
        if (!mediaRecord(record)) { invalidCount++; return; }
        const tags = tagsOf(record);
        if (!tags) { invalidCount++; return; }
        const size = tags.get("size");
        const item = normalizeListedMedia({
            url: tags.get("url"), mime: tags.get("m"), hash: tags.get("ox"),
            size: typeof size === "string" && /^\d+$/.test(size) ? Number(size) : undefined,
            uploaded: record.created_at,
        }, context, `${context.destinationId}:${page}:${index}`);
        if (!item) excludedCount++;
        else { items.push(item); if (!item.url || !item.deleteId) invalidCount++; }
    });
    return {
        items, rawCount: data.files.length, excludedCount, invalidCount, context,
        nextPage: (page + 1) * Number(data.count) < Number(data.total)
            ? { protocol: "nip96", page: page + 1, count: Number(data.count) } : null,
    };
}
export async function deleteNip96Media(params: UploadMediaDeleteParams): Promise<void> {
    assertMediaContext(params, params.context);
    if (params.context.protocol !== "nip96") throw new UploadMediaError("invalidDestination");
    const hash = assertMediaDeleteItem(params.item, params.context);
    const requestUrl = new URL(params.context.endpoint);
    requestUrl.pathname = `${requestUrl.pathname.replace(/\/$/, "")}/${hash}`;
    const url = requestUrl.toString();
    const authorization = await mediaAuthorization(params, () => params.authService.buildAuthHeader(url, "DELETE"));
    const response = await mediaFetch(params, url, "DELETE", authorization);
    const data = await mediaJson(response, true);
    if (response.status !== 200 || !mediaRecord(data) || data.status !== "success") throw new UploadMediaError("unknownDelete");
}
