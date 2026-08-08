import { describe, expect, it } from "vitest";
import {
    blossomDescriptorToNip94,
    validateBlossomDescriptor,
} from "../../lib/upload/blossomDescriptor";

const SHA256 = "a".repeat(64);
const OTHER_SHA256 = "b".repeat(64);

function createDescriptor(overrides: Record<string, unknown> = {}) {
    return {
        url: `https://upload.example.com/${SHA256}.png`,
        sha256: SHA256,
        size: 4,
        type: "image/png",
        uploaded: 1_700_000_000,
        ...overrides,
    };
}

function validate(
    descriptor: unknown,
    overrides: Partial<Parameters<typeof validateBlossomDescriptor>[0]> = {},
) {
    return validateBlossomDescriptor({
        descriptor,
        expectedSha256: SHA256,
        expectedSize: 4,
        trustedServerUrl: "https://upload.example.com",
        pageProtocol: "https:",
        ...overrides,
    });
}

describe("validateBlossomDescriptor", () => {
    it("accepts an exact BUD-02 descriptor and builds core NIP-94 from verified values", () => {
        const verified = validate(createDescriptor({
            type: "application/octet-stream",
            nip94: {
                url: "https://attacker.example/other.png",
                x: OTHER_SHA256,
                size: "999",
                m: "text/html",
            },
            unknown: "allowed",
        }));

        expect(verified).toEqual({
            url: `https://upload.example.com/${SHA256}.png`,
            sha256: SHA256,
            size: 4,
            type: "application/octet-stream",
            uploaded: 1_700_000_000,
        });
        expect(blossomDescriptorToNip94(verified)).toEqual({
            url: `https://upload.example.com/${SHA256}.png`,
            x: SHA256,
            size: "4",
            m: "application/octet-stream",
        });
    });

    it("accepts a positive timestamp without applying a clock-skew policy", () => {
        expect(validate(createDescriptor({ uploaded: 9_999_999_999 })).uploaded).toBe(9_999_999_999);
    });

    it.each([
        ["missing", undefined],
        ["wrong type", 123],
        ["malformed", "not-a-hash"],
        ["mismatch", OTHER_SHA256],
    ])("rejects a %s sha256", (_description, sha256) => {
        expect(() => validate(createDescriptor({ sha256 }))).toThrow(/sha256/);
    });

    it.each([
        ["missing", undefined],
        ["string", "4"],
        ["mismatch", 5],
        ["NaN", Number.NaN],
        ["Infinity", Number.POSITIVE_INFINITY],
    ])("rejects a %s size", (_description, size) => {
        expect(() => validate(createDescriptor({ size }))).toThrow(/size/);
    });

    it.each([
        ["missing", undefined],
        ["non-string", 123],
        ["empty", ""],
        ["whitespace-only", "   "],
    ])("rejects a %s type", (_description, type) => {
        expect(() => validate(createDescriptor({ type }))).toThrow(/type/);
    });

    it.each([
        ["missing", undefined],
        ["string", "1700000000"],
        ["zero", 0],
        ["negative", -1],
        ["NaN", Number.NaN],
        ["Infinity", Number.POSITIVE_INFINITY],
    ])("rejects a %s uploaded timestamp", (_description, uploaded) => {
        expect(() => validate(createDescriptor({ uploaded }))).toThrow(/uploaded/);
    });

    it("accepts a public cross-origin HTTPS blob URL for the same hash", () => {
        const url = `https://cdn.example.net/${SHA256}.webp?download=1#preview`;
        expect(validate(createDescriptor({ url })).url).toBe(
            `https://cdn.example.net/${SHA256}.webp?download=1`,
        );
    });

    it.each([
        ["empty", ""],
        ["relative", `/${SHA256}.png`],
        ["data URL", `data:image/png;base64,${SHA256}`],
        ["blob URL", `blob:https://upload.example.com/${SHA256}`],
        ["JavaScript URL", `javascript:${SHA256}`],
        ["file URL", `file:///${SHA256}.png`],
        ["userinfo", `https://user:pass@upload.example.com/${SHA256}.png`],
        ["different path hash", `https://upload.example.com/${OTHER_SHA256}.png`],
        ["hash only in query", `https://upload.example.com/${OTHER_SHA256}.png?hash=${SHA256}`],
        ["hash only in fragment", `https://upload.example.com/${OTHER_SHA256}.png#${SHA256}`],
        ["hash only in hostname", `https://${SHA256}.example.com/${OTHER_SHA256}.png`],
        ["missing extension", `https://upload.example.com/${SHA256}`],
        ["non-root blob path", `https://upload.example.com/media/${SHA256}.png`],
        ["encoded non-root blob path", `https://upload.example.com/${SHA256}.png%2Fother`],
        ["cross-origin localhost", `https://localhost/${SHA256}.png`],
        ["cross-origin private IPv4", `https://192.168.1.10/${SHA256}.png`],
        ["cross-origin private IPv6", `https://[fd00::1]/${SHA256}.png`],
        ["cross-origin HTTP", `http://cdn.example.net/${SHA256}.png`],
    ])("rejects a URL that is %s", (_description, url) => {
        expect(() => validate(createDescriptor({ url }))).toThrow(/descriptor URL|descriptor url/);
    });

    it("allows same-origin HTTP for a trusted loopback development server", () => {
        const url = `http://localhost:3000/${SHA256}.png`;
        expect(validate(createDescriptor({ url }), {
            trustedServerUrl: "http://localhost:3000",
        }).url).toBe(url);
    });

    it("rejects same-origin HTTP downgrade outside trusted loopback development", () => {
        const url = `http://upload.example.com/${SHA256}.png`;
        expect(() => validate(createDescriptor({ url }), {
            trustedServerUrl: "http://upload.example.com",
        })).toThrow(/HTTPS page/);
    });
});
