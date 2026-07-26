import { normalizeProfilePictureUrl } from "./profilePictureUrlUtils";

export interface ChannelPictureUrlOptions {
    currentOrigin?: string | null;
}

export function normalizeChannelPictureUrl(
    rawUrl: string,
    options: ChannelPictureUrlOptions = {},
): string | null {
    return normalizeProfilePictureUrl(rawUrl, options);
}

export function isChannelEventId(value: string): boolean {
    return /^[0-9a-f]{64}$/.test(value);
}

export function buildChannelPictureProxyUrl({
    eventId,
    pictureUrl,
    baseUrl,
    currentOrigin,
}: {
    eventId: string;
    pictureUrl: string;
    baseUrl: string;
    currentOrigin?: string | null;
}): string | null {
    if (!isChannelEventId(eventId)) return null;
    const normalizedUrl = normalizeChannelPictureUrl(pictureUrl, {
        currentOrigin,
    });
    if (!normalizedUrl) return null;

    const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const proxyUrl = new URL(
        `${normalizedBase}__ehagaki-image/channel`,
        currentOrigin ?? globalThis.location?.origin,
    );
    proxyUrl.searchParams.set("eventId", eventId);
    proxyUrl.searchParams.set("url", normalizedUrl);
    return proxyUrl.toString();
}
