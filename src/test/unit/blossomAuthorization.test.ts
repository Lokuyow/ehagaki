import { describe, expect, it } from "vitest";
import {
    canonicalizeBlossomAuthorizationHeader,
    encodeBlossomAuthorizationHeader,
} from "../../lib/upload/blossomAuthorization";

function bytesToBase64(bytes: Uint8Array): string {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
}

function decodeBase64UrlHeader(header: string): Uint8Array {
    const token = header.replace(/^Nostr /, "");
    const padded = token.replace(/-/g, "+").replace(/_/g, "/")
        + "=".repeat((4 - (token.length % 4)) % 4);
    return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function createSignedEventJson(content = "blossom stuff"): string {
    return JSON.stringify({
        id: "a".repeat(64),
        pubkey: "b".repeat(64),
        sig: "c".repeat(128),
        kind: 24242,
        created_at: 1_700_000_000,
        content,
        tags: [["expiration", "1700000060"], ["t", "upload"]],
    });
}

describe("Blossom BUD-11 Authorization codec", () => {
    it("encodes Unicode signed event JSON as an unpadded Base64url Nostr header", () => {
        const eventJson = createSignedEventJson("こんにちは🌸");
        const header = encodeBlossomAuthorizationHeader(eventJson);

        expect(header).toMatch(/^Nostr [A-Za-z0-9_-]+$/);
        expect(header).not.toMatch(/[+/=]/);
        expect(new TextDecoder().decode(decodeBase64UrlHeader(header))).toBe(eventJson);
    });

    it("canonicalizes padded regular Base64 without changing the JSON bytes", () => {
        const eventJson = createSignedEventJson();
        const originalBytes = new TextEncoder().encode(eventJson);
        const regularHeader = `Nostr ${bytesToBase64(originalBytes)}`;

        const header = canonicalizeBlossomAuthorizationHeader(regularHeader);

        expect(header).toMatch(/^Nostr [A-Za-z0-9_-]+$/);
        expect(header).not.toMatch(/[+/=]/);
        expect(Array.from(decodeBase64UrlHeader(header))).toEqual(Array.from(originalBytes));
    });

    it("accepts an already unpadded Base64url header", () => {
        const eventJson = createSignedEventJson();
        const originalHeader = encodeBlossomAuthorizationHeader(eventJson);

        expect(canonicalizeBlossomAuthorizationHeader(originalHeader)).toBe(originalHeader);
    });

    it.each([
        undefined,
        "",
        "   ",
        "Nostr",
        "Bearer token",
        "Nostr abc$",
        "Nostr ab-_+/",
        "Nostr ab=",
        "Nostr a",
        `Nostr ${bytesToBase64(new Uint8Array([0xc3, 0x28]))}`,
        `Nostr ${bytesToBase64(new TextEncoder().encode("not json"))}`,
        `Nostr ${bytesToBase64(new TextEncoder().encode("42"))}`,
        `Nostr ${bytesToBase64(new TextEncoder().encode("[]"))}`,
        `Nostr ${bytesToBase64(new TextEncoder().encode("{}"))}`,
    ])("rejects an invalid Authorization value: %s", (authorization) => {
        expect(() => canonicalizeBlossomAuthorizationHeader(authorization)).toThrow(
            "Invalid Blossom authorization",
        );
    });
});
