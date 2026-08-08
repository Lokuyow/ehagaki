const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder("utf-8", { fatal: true });

function bytesToBase64(bytes: Uint8Array): string {
    let binary = "";
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    return btoa(binary);
}

function base64ToBytes(token: string): Uint8Array {
    if (!token || !/^[A-Za-z0-9+/_-]*={0,2}$/.test(token)) {
        throw new Error("Invalid Blossom authorization");
    }

    const paddingIndex = token.indexOf("=");
    const unpaddedToken = paddingIndex === -1 ? token : token.slice(0, paddingIndex);
    const paddingLength = paddingIndex === -1 ? 0 : token.length - paddingIndex;
    const hasStandardAlphabet = /[+/]/.test(unpaddedToken);
    const hasUrlAlphabet = /[-_]/.test(unpaddedToken);
    const remainder = unpaddedToken.length % 4;

    if (
        hasStandardAlphabet && hasUrlAlphabet
        || remainder === 1
        || (paddingLength > 0 && token.length % 4 !== 0)
        || (paddingLength === 1 && remainder !== 3)
        || (paddingLength === 2 && remainder !== 2)
    ) {
        throw new Error("Invalid Blossom authorization");
    }

    const normalizedToken = unpaddedToken.replace(/-/g, "+").replace(/_/g, "/");
    const normalizedPaddingLength = (4 - (normalizedToken.length % 4)) % 4;

    try {
        const binary = atob(`${normalizedToken}${"=".repeat(normalizedPaddingLength)}`);
        return Uint8Array.from(binary, (character) => character.charCodeAt(0));
    } catch {
        throw new Error("Invalid Blossom authorization");
    }
}

function assertAuthorizationEvent(value: unknown): void {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error("Invalid Blossom authorization");
    }

    const event = value as Record<string, unknown>;
    if (
        typeof event.id !== "string"
        || typeof event.pubkey !== "string"
        || typeof event.sig !== "string"
        || typeof event.kind !== "number"
        || typeof event.created_at !== "number"
        || typeof event.content !== "string"
        || !Array.isArray(event.tags)
    ) {
        throw new Error("Invalid Blossom authorization");
    }
}

function parseAuthorizationHeader(authorization: unknown): Uint8Array {
    if (typeof authorization !== "string") {
        throw new Error("Invalid Blossom authorization");
    }

    const match = authorization.trim().match(/^([^\s]+)[ \t]+([^\s]+)$/);
    if (!match || match[1].toLowerCase() !== "nostr") {
        throw new Error("Invalid Blossom authorization");
    }

    const bytes = base64ToBytes(match[2]);
    let payload: string;
    try {
        payload = textDecoder.decode(bytes);
    } catch {
        throw new Error("Invalid Blossom authorization");
    }

    try {
        assertAuthorizationEvent(JSON.parse(payload));
    } catch {
        throw new Error("Invalid Blossom authorization");
    }

    return bytes;
}

function encodeBase64Url(bytes: Uint8Array): string {
    return bytesToBase64(bytes)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

export function encodeBlossomAuthorizationHeader(eventJson: string): string {
    return `Nostr ${encodeBase64Url(textEncoder.encode(eventJson))}`;
}

export function canonicalizeBlossomAuthorizationHeader(authorization: unknown): string {
    return `Nostr ${encodeBase64Url(parseAuthorizationHeader(authorization))}`;
}
