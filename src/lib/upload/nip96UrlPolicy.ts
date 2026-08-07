import * as ipaddr from "ipaddr.js";

export type Nip96UrlPolicyErrorCode =
    | "invalid-upload-destination-url"
    | "invalid-processing-url"
    | "invalid-media-url"
    | "server-local-url-not-allowed"
    | "insecure-media-url";

export class Nip96UrlPolicyError extends Error {
    constructor(
        readonly code: Nip96UrlPolicyErrorCode,
        message: string,
    ) {
        super(message);
        this.name = "Nip96UrlPolicyError";
    }
}

type NetworkScope = "public" | "loopback" | "local-or-private";

export interface CanonicalNip96Url {
    url: string;
    origin: string;
    protocol: "http:" | "https:";
    networkScope: NetworkScope;
}

export interface ExactNip96MediaUrl extends CanonicalNip96Url {
    url: string;
}

function removeLiteralFragment(value: string): string {
    const fragmentIndex = value.indexOf("#");
    return fragmentIndex >= 0 ? value.slice(0, fragmentIndex) : value;
}

function normalizeIpHostname(hostname: string): string {
    return hostname
        .trim()
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split("%")[0];
}

function getNetworkScope(hostname: string): NetworkScope {
    const normalizedHostname = hostname.trim().toLowerCase().replace(/\.$/, "");
    if (!normalizedHostname) return "local-or-private";

    if (
        normalizedHostname === "localhost"
        || normalizedHostname.endsWith(".localhost")
    ) {
        return "loopback";
    }

    if (normalizedHostname.endsWith(".local")) {
        return "local-or-private";
    }

    const ipHostname = normalizeIpHostname(normalizedHostname);
    if (ipaddr.isValid(ipHostname)) {
        try {
            const address = ipaddr.parse(ipHostname);
            if (
                address.kind() === "ipv6"
                && (address as ipaddr.IPv6).isIPv4MappedAddress()
            ) {
                return (address as ipaddr.IPv6).toIPv4Address().range() === "loopback"
                    ? "loopback"
                    : (address as ipaddr.IPv6).toIPv4Address().range() === "unicast"
                        ? "public"
                        : "local-or-private";
            }

            return address.range() === "loopback"
                ? "loopback"
                : address.range() === "unicast"
                    ? "public"
                    : "local-or-private";
        } catch {
            return "local-or-private";
        }
    }

    return normalizedHostname.includes(".") ? "public" : "local-or-private";
}

function parseAbsoluteHttpUrl(
    rawUrl: string,
    errorCode: Nip96UrlPolicyErrorCode,
): { requestUrl: string; parsed: URL } {
    const requestUrl = removeLiteralFragment(rawUrl.trim());
    if (!requestUrl) {
        throw new Nip96UrlPolicyError(errorCode, "A NIP-96 URL is required");
    }

    let parsed: URL;
    try {
        parsed = new URL(requestUrl);
    } catch {
        throw new Nip96UrlPolicyError(
            errorCode,
            "NIP-96 URLs must be absolute HTTP(S) URLs",
        );
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Nip96UrlPolicyError(
            errorCode,
            "NIP-96 URLs must use HTTP(S)",
        );
    }

    if (parsed.username || parsed.password) {
        throw new Nip96UrlPolicyError(
            errorCode,
            "NIP-96 URLs must not include user information",
        );
    }

    return { requestUrl, parsed };
}

function toCanonicalNip96Url(parsed: URL): CanonicalNip96Url {
    const protocol = parsed.protocol as CanonicalNip96Url["protocol"];
    return {
        url: parsed.toString(),
        origin: parsed.origin,
        protocol,
        networkScope: getNetworkScope(parsed.hostname),
    };
}

function isSameOrigin(left: CanonicalNip96Url, right: CanonicalNip96Url): boolean {
    return left.origin === right.origin;
}

export function canonicalizeNip96UploadUrl(rawUrl: string): CanonicalNip96Url {
    const { parsed } = parseAbsoluteHttpUrl(rawUrl, "invalid-upload-destination-url");
    return toCanonicalNip96Url(parsed);
}

export function validateNip96ProcessingUrl(params: {
    rawUrl: string;
    trustedUploadUrl: CanonicalNip96Url;
}): CanonicalNip96Url & { sameOrigin: boolean } {
    const { parsed } = parseAbsoluteHttpUrl(params.rawUrl, "invalid-processing-url");
    const processingUrl = toCanonicalNip96Url(parsed);
    const sameOrigin = isSameOrigin(processingUrl, params.trustedUploadUrl);

    if (!sameOrigin && processingUrl.networkScope !== "public") {
        throw new Nip96UrlPolicyError(
            "server-local-url-not-allowed",
            "The upload server returned a local or private processing URL",
        );
    }

    if (!sameOrigin && processingUrl.protocol !== "https:") {
        throw new Nip96UrlPolicyError(
            "invalid-processing-url",
            "Cross-origin processing URLs must use HTTPS",
        );
    }

    return { ...processingUrl, sameOrigin };
}

export function validateNip96DiscoveryUrl(params: {
    rawUrl: string;
    trustedUploadUrl: CanonicalNip96Url;
}): CanonicalNip96Url {
    const { parsed } = parseAbsoluteHttpUrl(params.rawUrl, "invalid-processing-url");
    const discoveryUrl = toCanonicalNip96Url(parsed);
    if (isSameOrigin(discoveryUrl, params.trustedUploadUrl)) {
        return discoveryUrl;
    }

    if (discoveryUrl.networkScope !== "public" || discoveryUrl.protocol !== "https:") {
        throw new Nip96UrlPolicyError(
            "server-local-url-not-allowed",
            "Discovery must not redirect to a local, private, or insecure URL",
        );
    }

    return discoveryUrl;
}

export function validateNip96MediaUrl(params: {
    rawUrl: string;
    trustedUploadUrl: CanonicalNip96Url;
    pageProtocol?: string | null;
}): ExactNip96MediaUrl {
    const { requestUrl, parsed } = parseAbsoluteHttpUrl(params.rawUrl, "invalid-media-url");
    const parsedMediaUrl = toCanonicalNip96Url(parsed);
    const sameOrigin = isSameOrigin(parsedMediaUrl, params.trustedUploadUrl);

    if (!sameOrigin && parsedMediaUrl.networkScope !== "public") {
        throw new Nip96UrlPolicyError(
            "server-local-url-not-allowed",
            "The upload server returned a local or private media URL",
        );
    }

    const pageProtocol = params.pageProtocol
        ?? (typeof location !== "undefined" ? location.protocol : null);
    const allowedLoopbackHttp =
        pageProtocol === "https:"
        && parsedMediaUrl.protocol === "http:"
        && parsedMediaUrl.networkScope === "loopback"
        && sameOrigin
        && params.trustedUploadUrl.networkScope === "loopback";

    if (
        pageProtocol === "https:"
        && parsedMediaUrl.protocol === "http:"
        && !allowedLoopbackHttp
    ) {
        throw new Nip96UrlPolicyError(
            "insecure-media-url",
            "HTTP media URLs cannot be used from an HTTPS page",
        );
    }

    return {
        ...parsedMediaUrl,
        // Keep the server's query ordering, percent encoding, and explicit port for probes.
        url: requestUrl,
    };
}
