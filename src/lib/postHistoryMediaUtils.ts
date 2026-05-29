import type { PostHistoryMediaRecord } from "./storage/ehagakiDb";
import type { NostrEvent } from "./types";
import { normalizeSafeExternalMediaUrl } from "./postMediaCacheUtils";

function parseImetaTag(tag: string[]): PostHistoryMediaRecord | null {
    const fields = new Map<string, string>();

    for (const token of tag.slice(1)) {
        const separator = token.indexOf(" ");
        if (separator <= 0) continue;
        fields.set(token.slice(0, separator), token.slice(separator + 1));
    }

    const rawUrl = fields.get("url");
    const url = rawUrl ? normalizeSafeExternalMediaUrl(rawUrl) : "";
    if (!url) return null;

    const rawSize = fields.get("size");
    const size = rawSize ? Number(rawSize) : undefined;
    const normalizedSize =
        typeof size === "number" && Number.isFinite(size) && size > 0
            ? size
            : undefined;

    return {
        url,
        mimeType: fields.get("m") || undefined,
        alt: fields.get("alt") || undefined,
        blurhash: fields.get("blurhash") || undefined,
        dim: fields.get("dim") || undefined,
        size: normalizedSize,
        uploadProtocol: normalizeUploadProtocol(fields.get("uploadProtocol")),
    };
}

function normalizeUploadProtocol(
    value: string | undefined,
): PostHistoryMediaRecord["uploadProtocol"] {
    return value === "blossom" || value === "nip96" || value === "custom-http"
        ? value
        : undefined;
}

function inferMimeTypeFromUrl(url: string): string | undefined {
    const pathname = (() => {
        try {
            return new URL(url).pathname.toLowerCase();
        } catch {
            return url.toLowerCase();
        }
    })();

    if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
    if (pathname.endsWith(".png")) return "image/png";
    if (pathname.endsWith(".webp")) return "image/webp";
    if (pathname.endsWith(".gif")) return "image/gif";
    if (pathname.endsWith(".mp4")) return "video/mp4";
    if (pathname.endsWith(".webm")) return "video/webm";
    if (pathname.endsWith(".mov")) return "video/quicktime";
    return undefined;
}

function extractContentMedia(
    content: string,
    existingUrls: Set<string>,
): PostHistoryMediaRecord[] {
    const matches = content.match(/https?:\/\/[^\s<>"']+/g) ?? [];
    return matches
        .map((url) => url.replace(/[),.。、]+$/u, ""))
        .map((url) => normalizeSafeExternalMediaUrl(url))
        .filter((url) => url.length > 0)
        .filter((url) => {
            if (existingUrls.has(url)) return false;
            return /\.(jpe?g|png|webp|gif|mp4|webm|mov)(?:$|[?#])/i.test(url);
        })
        .map((url) => ({
            url,
            mimeType: inferMimeTypeFromUrl(url),
        }));
}

export function extractPostHistoryMedia(
    event: Pick<NostrEvent, "content" | "tags">,
): PostHistoryMediaRecord[] {
    const media = event.tags
        .filter((tag) => tag[0] === "imeta")
        .map(parseImetaTag)
        .filter((item): item is PostHistoryMediaRecord => item !== null);
    const seenUrls = new Set(media.map((item) => item.url));
    media.push(...extractContentMedia(event.content, seenUrls));
    return media;
}