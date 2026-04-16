import * as ipaddr from "ipaddr.js";

interface ProfilePictureUrlOptions {
    currentOrigin?: string | null;
}

interface ProfilePictureMarkerOptions extends ProfilePictureUrlOptions {
    forceRemote?: boolean;
    navigatorOnline?: boolean;
}

function resolveCurrentOrigin(currentOrigin?: string | null): URL | null {
    const origin = currentOrigin ?? globalThis.location?.origin;
    if (!origin) return null;

    try {
        return new URL(origin);
    } catch {
        return null;
    }
}

function normalizeIpHostname(hostname: string): string {
    return hostname.replace(/^\[/, "").replace(/\]$/, "").split("%")[0];
}

function isPrivateOrLocalIpHostname(hostname: string): boolean {
    const normalizedHostname = normalizeIpHostname(hostname);
    if (!normalizedHostname || !ipaddr.isValid(normalizedHostname)) {
        return false;
    }

    try {
        return ipaddr.parse(normalizedHostname).range() !== "unicast";
    } catch {
        return true;
    }
}

function isPublicHostname(hostname: string): boolean {
    const normalizedHostname = hostname.trim().toLowerCase();
    if (!normalizedHostname) return false;

    if (
        normalizedHostname === "localhost" ||
        normalizedHostname.endsWith(".localhost") ||
        normalizedHostname.endsWith(".local")
    ) {
        return false;
    }

    if (isPrivateOrLocalIpHostname(normalizedHostname)) {
        return false;
    }

    if (!normalizedHostname.includes(".")) {
        return false;
    }

    return true;
}

function isLocalDevelopmentOrigin(url: URL): boolean {
    const hostname = url.hostname.trim().toLowerCase();
    if (!hostname) return false;

    if (
        hostname === "localhost" ||
        hostname.endsWith(".localhost") ||
        hostname.endsWith(".local")
    ) {
        return true;
    }

    return isPrivateOrLocalIpHostname(hostname);
}

function isSameOrigin(url: URL, currentOriginUrl: URL | null): boolean {
    return !!currentOriginUrl && url.origin === currentOriginUrl.origin;
}

export function normalizeProfilePictureUrl(
    rawUrl: string,
    options: ProfilePictureUrlOptions = {},
): string | null {
    if (typeof rawUrl !== "string") return null;

    const trimmed = rawUrl.trim();
    if (!trimmed) return null;

    let parsedUrl: URL;
    try {
        parsedUrl = new URL(trimmed);
    } catch {
        return null;
    }

    if (trimmed.startsWith("//")) {
        return null;
    }

    if (parsedUrl.username || parsedUrl.password) {
        return null;
    }

    const currentOriginUrl = resolveCurrentOrigin(options.currentOrigin);
    const sameOrigin = isSameOrigin(parsedUrl, currentOriginUrl);
    const allowLocalSameOrigin =
        sameOrigin && !!currentOriginUrl && isLocalDevelopmentOrigin(currentOriginUrl);

    if (parsedUrl.protocol === "http:") {
        if (!allowLocalSameOrigin) {
            return null;
        }
    } else if (parsedUrl.protocol !== "https:") {
        return null;
    }

    if (!allowLocalSameOrigin && !isPublicHostname(parsedUrl.hostname)) {
        return null;
    }

    parsedUrl.hash = "";
    return parsedUrl.toString();
}

export function isSameOriginProfilePictureUrl(
    rawUrl: string | undefined | null,
    options: ProfilePictureUrlOptions = {},
): boolean {
    if (!rawUrl) return false;

    const normalizedUrl = normalizeProfilePictureUrl(rawUrl, options);
    if (!normalizedUrl) return false;

    const currentOriginUrl = resolveCurrentOrigin(options.currentOrigin);
    if (!currentOriginUrl) return false;

    try {
        return new URL(normalizedUrl).origin === currentOriginUrl.origin;
    } catch {
        return false;
    }
}

export function getProfilePictureCacheKeyUrl(
    rawUrl: string,
    options: ProfilePictureUrlOptions = {},
): string | null {
    const normalizedUrl = normalizeProfilePictureUrl(rawUrl, options);
    if (!normalizedUrl) return null;

    const parsedUrl = new URL(normalizedUrl);
    parsedUrl.search = "";
    parsedUrl.hash = "";
    return parsedUrl.toString();
}

export function addProfilePictureCacheBuster(
    rawUrl: string,
    options: ProfilePictureUrlOptions = {},
): string {
    const normalizedUrl = normalizeProfilePictureUrl(rawUrl, options);
    if (!normalizedUrl) return "";

    const parsedUrl = new URL(normalizedUrl);
    parsedUrl.searchParams.set("cb", Date.now().toString());
    return parsedUrl.toString();
}

export function addProfilePictureMarker(
    rawUrl: string,
    options: ProfilePictureMarkerOptions = {},
): string {
    const normalizedUrl = normalizeProfilePictureUrl(rawUrl, options);
    if (!normalizedUrl) return "";

    const parsedUrl = new URL(normalizedUrl);
    parsedUrl.searchParams.set("profile", "true");

    if (options.forceRemote && options.navigatorOnline !== false) {
        if (parsedUrl.searchParams.has("cb")) {
            parsedUrl.searchParams.set("cb", Date.now().toString());
        }
    } else {
        parsedUrl.searchParams.delete("cb");
    }

    return parsedUrl.toString();
}

export function ensureProfilePictureMarker(
    rawUrl: string,
    options: ProfilePictureUrlOptions = {},
): string {
    const normalizedUrl = normalizeProfilePictureUrl(rawUrl, options);
    if (!normalizedUrl) return "";

    const parsedUrl = new URL(normalizedUrl);
    if (!parsedUrl.searchParams.has("profile")) {
        parsedUrl.searchParams.set("profile", "true");
    }

    return parsedUrl.toString();
}
