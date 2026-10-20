import { canonicalizeNip96UploadUrl, validateNip96MediaUrl } from "./upload/nip96UrlPolicy";

export function normalizeUploadMediaImageUrl(rawUrl: string, serverUrl: string, pageProtocol?: string): string | null {
    try {
        const url = validateNip96MediaUrl({ rawUrl,
            trustedUploadUrl: canonicalizeNip96UploadUrl(serverUrl), pageProtocol,
        }).url;
        return new URL(url).toString();
    } catch { return null; }
}
export function isUploadMediaImageProxyUrl(url: URL, origin: string, basePath: string): boolean {
    return url.origin === origin
        && url.pathname === `${basePath.endsWith("/") ? basePath : `${basePath}/`}__ehagaki-image/upload-media`;
}
export function buildUploadMediaImageProxyUrl(params: {
    url: string; serverUrl: string; basePath: string; currentOrigin: string;
}): string | null {
    const origin = new URL(params.currentOrigin);
    const mediaUrl = normalizeUploadMediaImageUrl(params.url, params.serverUrl, origin.protocol);
    if (!mediaUrl) return null;
    const proxy = new URL(`${params.basePath.endsWith("/") ? params.basePath : `${params.basePath}/`}__ehagaki-image/upload-media`, origin);
    proxy.searchParams.set("url", mediaUrl);
    proxy.searchParams.set("server", params.serverUrl);
    return proxy.toString();
}

export function resolveUploadedMediaImageSrc(params: {
    url: string | null;
    serverUrl: string;
    cacheSupported: boolean | null;
    basePath: string;
    currentOrigin: string;
}): string | null {
    if (!params.url || params.cacheSupported === null) return null;
    if (!params.cacheSupported) return params.url;
    return buildUploadMediaImageProxyUrl({
        url: params.url,
        serverUrl: params.serverUrl,
        basePath: params.basePath,
        currentOrigin: params.currentOrigin,
    });
}
