import * as ipaddr from "ipaddr.js";

type NetworkScope = "public" | "loopback" | "local-or-private";

export interface VerifiedBlossomDescriptor {
    url: string;
    sha256: string;
    size: number;
    type: string;
    uploaded: number;
}

export class BlossomDescriptorValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BlossomDescriptorValidationError";
    }
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

    const ipHostname = normalizedHostname
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split("%")[0];
    if (ipaddr.isValid(ipHostname)) {
        try {
            const address = ipaddr.parse(ipHostname);
            if (
                address.kind() === "ipv6"
                && (address as ipaddr.IPv6).isIPv4MappedAddress()
            ) {
                const range = (address as ipaddr.IPv6).toIPv4Address().range();
                return range === "loopback"
                    ? "loopback"
                    : range === "unicast"
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

function parseAbsoluteHttpUrl(rawUrl: string, field: string): URL {
    if (!rawUrl.trim()) {
        throw new BlossomDescriptorValidationError(`Blossom descriptor ${field} is required`);
    }

    let parsed: URL;
    try {
        parsed = new URL(rawUrl.trim());
    } catch {
        throw new BlossomDescriptorValidationError(
            `Blossom descriptor ${field} must be an absolute HTTP(S) URL`,
        );
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new BlossomDescriptorValidationError(
            `Blossom descriptor ${field} must use HTTP(S)`,
        );
    }

    if (parsed.username || parsed.password) {
        throw new BlossomDescriptorValidationError(
            `Blossom descriptor ${field} must not include user information`,
        );
    }

    return parsed;
}

function validateDescriptorUrl(params: {
    rawUrl: string;
    expectedSha256: string;
    trustedServerUrl: string;
    pageProtocol?: string | null;
}): string {
    const descriptorUrl = parseAbsoluteHttpUrl(params.rawUrl, "url");
    const trustedServerUrl = parseAbsoluteHttpUrl(params.trustedServerUrl, "server URL");
    const sameOrigin = descriptorUrl.origin === trustedServerUrl.origin;
    const descriptorScope = getNetworkScope(descriptorUrl.hostname);
    const trustedServerScope = getNetworkScope(trustedServerUrl.hostname);

    if (!sameOrigin && descriptorScope !== "public") {
        throw new BlossomDescriptorValidationError(
            "Blossom descriptor URL must not target a cross-origin local or private host",
        );
    }

    if (!sameOrigin && descriptorUrl.protocol !== "https:") {
        throw new BlossomDescriptorValidationError(
            "Cross-origin Blossom descriptor URLs must use HTTPS",
        );
    }

    const pageProtocol = params.pageProtocol
        ?? (typeof location !== "undefined" ? location.protocol : null);
    const allowedLoopbackHttp =
        pageProtocol === "https:"
        && descriptorUrl.protocol === "http:"
        && descriptorScope === "loopback"
        && sameOrigin
        && trustedServerScope === "loopback";
    if (
        pageProtocol === "https:"
        && descriptorUrl.protocol === "http:"
        && !allowedLoopbackHttp
    ) {
        throw new BlossomDescriptorValidationError(
            "HTTP Blossom descriptor URLs cannot be used from an HTTPS page",
        );
    }

    let decodedPathname: string;
    try {
        decodedPathname = decodeURIComponent(descriptorUrl.pathname);
    } catch {
        throw new BlossomDescriptorValidationError(
            "Blossom descriptor URL contains an invalid blob path",
        );
    }

    const blobFilename = decodedPathname.slice(1);
    if (
        blobFilename.includes("/")
        || !blobFilename.startsWith(`${params.expectedSha256}.`)
        || blobFilename.length === params.expectedSha256.length + 1
    ) {
        throw new BlossomDescriptorValidationError(
            "Blossom descriptor URL must identify the uploaded SHA-256 blob with a file extension",
        );
    }

    descriptorUrl.hash = "";
    return descriptorUrl.toString();
}

export function validateBlossomDescriptor(params: {
    descriptor: unknown;
    expectedSha256: string;
    expectedSize: number;
    trustedServerUrl: string;
    pageProtocol?: string | null;
}): VerifiedBlossomDescriptor {
    const descriptor = params.descriptor as Record<string, unknown> | null;
    if (!descriptor || typeof descriptor !== "object") {
        throw new BlossomDescriptorValidationError("Blossom descriptor must be an object");
    }

    if (typeof descriptor.sha256 !== "string" || descriptor.sha256 !== params.expectedSha256) {
        throw new BlossomDescriptorValidationError(
            "Blossom descriptor sha256 does not match the uploaded blob",
        );
    }

    if (
        typeof descriptor.size !== "number"
        || !Number.isFinite(descriptor.size)
        || descriptor.size !== params.expectedSize
    ) {
        throw new BlossomDescriptorValidationError(
            "Blossom descriptor size does not match the uploaded blob",
        );
    }

    if (typeof descriptor.type !== "string" || !descriptor.type.trim()) {
        throw new BlossomDescriptorValidationError(
            "Blossom descriptor type must be a non-empty string",
        );
    }

    if (
        typeof descriptor.uploaded !== "number"
        || !Number.isFinite(descriptor.uploaded)
        || descriptor.uploaded <= 0
    ) {
        throw new BlossomDescriptorValidationError(
            "Blossom descriptor uploaded must be a positive Unix timestamp",
        );
    }

    if (typeof descriptor.url !== "string") {
        throw new BlossomDescriptorValidationError("Blossom descriptor url is required");
    }

    const url = validateDescriptorUrl({
        rawUrl: descriptor.url,
        expectedSha256: params.expectedSha256,
        trustedServerUrl: params.trustedServerUrl,
        pageProtocol: params.pageProtocol,
    });

    return {
        url,
        sha256: descriptor.sha256,
        size: descriptor.size,
        type: descriptor.type,
        uploaded: descriptor.uploaded,
    };
}

export function blossomDescriptorToNip94(
    descriptor: VerifiedBlossomDescriptor,
): Record<string, string> {
    return {
        url: descriptor.url,
        x: descriptor.sha256,
        size: String(descriptor.size),
        m: descriptor.type,
    };
}
