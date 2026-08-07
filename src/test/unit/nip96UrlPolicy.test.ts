import { describe, expect, it } from "vitest";
import {
    Nip96UrlPolicyError,
    canonicalizeNip96UploadUrl,
    validateNip96MediaUrl,
    validateNip96ProcessingUrl,
} from "../../lib/upload/nip96UrlPolicy";

describe("nip96UrlPolicy", () => {
    it("canonicalizes NIP-98 request URLs once while preserving query order", () => {
        expect(canonicalizeNip96UploadUrl(
            "https://EXAMPLE.com:443/upload?b=2&a=hello%20world#ignored",
        )).toEqual(expect.objectContaining({
            url: "https://example.com/upload?b=2&a=hello%20world",
            origin: "https://example.com",
        }));
    });

    it("keeps non-default ports and paths in canonical upload request URLs", () => {
        expect(canonicalizeNip96UploadUrl(
            "https://upload.example:8443/api/v1/upload?first=%2B&second=2",
        ).url).toBe("https://upload.example:8443/api/v1/upload?first=%2B&second=2");
    });

    it.each([
        "relative/upload",
        "data:text/plain,test",
        "https://user:password@example.com/upload",
    ])("rejects an invalid upload destination URL: %s", (url) => {
        expect(() => canonicalizeNip96UploadUrl(url)).toThrow(Nip96UrlPolicyError);
    });

    it("allows an explicit local destination while rejecting server-returned private processing URLs", () => {
        const trustedUploadUrl = canonicalizeNip96UploadUrl("http://127.0.0.1:8080/upload");

        expect(validateNip96ProcessingUrl({
            rawUrl: "http://127.0.0.1:8080/status?job=1",
            trustedUploadUrl,
        })).toEqual(expect.objectContaining({
            sameOrigin: true,
            url: "http://127.0.0.1:8080/status?job=1",
        }));

        expect(() => validateNip96ProcessingUrl({
            rawUrl: "http://192.168.1.1/status",
            trustedUploadUrl,
        })).toThrow(Nip96UrlPolicyError);
    });

    it("allows a same-origin LAN URL selected by the user", () => {
        const trustedUploadUrl = canonicalizeNip96UploadUrl("http://192.168.1.20:8080/upload");

        expect(validateNip96ProcessingUrl({
            rawUrl: "http://192.168.1.20:8080/status",
            trustedUploadUrl,
        })).toEqual(expect.objectContaining({ sameOrigin: true }));
        expect(validateNip96MediaUrl({
            rawUrl: "http://192.168.1.20:8080/media.png?signature=a%2Bb",
            trustedUploadUrl,
            pageProtocol: "http:",
        }).url).toBe("http://192.168.1.20:8080/media.png?signature=a%2Bb");
    });

    it.each([
        "http://localhost/status",
        "http://preview.localhost/status",
        "http://127.0.0.2/status",
        "http://192.168.1.1/status",
        "http://169.254.1.1/status",
        "http://[::1]/status",
        "http://[fd12:3456::1]/status",
        "http://[fe80::1]/status",
    ])("rejects server-returned local or private processing URLs: %s", (rawUrl) => {
        const trustedUploadUrl = canonicalizeNip96UploadUrl("https://upload.example/api");

        expect(() => validateNip96ProcessingUrl({ rawUrl, trustedUploadUrl }))
            .toThrow(Nip96UrlPolicyError);
    });

    it("allows public HTTPS cross-origin processing without granting it the upload origin", () => {
        const trustedUploadUrl = canonicalizeNip96UploadUrl("https://upload.example/api");

        expect(validateNip96ProcessingUrl({
            rawUrl: "https://queue.example/status?job=abc%2Fdef",
            trustedUploadUrl,
        })).toEqual(expect.objectContaining({
            sameOrigin: false,
            url: "https://queue.example/status?job=abc%2Fdef",
        }));
    });

    it("keeps the server media URL text intact apart from a literal fragment", () => {
        const trustedUploadUrl = canonicalizeNip96UploadUrl("https://upload.example/api");
        const rawUrl = "https://cdn.example:443/file%2Fname?X-Amz-Signature=a%2Bb&z=2&a=1#preview";

        expect(validateNip96MediaUrl({
            rawUrl,
            trustedUploadUrl,
            pageProtocol: "https:",
        }).url).toBe("https://cdn.example:443/file%2Fname?X-Amz-Signature=a%2Bb&z=2&a=1");
    });

    it("rejects public HTTP media from an HTTPS page before availability polling", () => {
        const trustedUploadUrl = canonicalizeNip96UploadUrl("https://upload.example/api");

        expect(() => validateNip96MediaUrl({
            rawUrl: "http://cdn.example/file.png",
            trustedUploadUrl,
            pageProtocol: "https:",
        })).toThrow(expect.objectContaining({ code: "insecure-media-url" }));
    });

    it("allows HTTP media from an HTTP page while retaining the exact URL", () => {
        const trustedUploadUrl = canonicalizeNip96UploadUrl("http://upload.example/api");
        const mediaUrl = "http://cdn.example:8080/file?token=a%2Bb&part=2";

        expect(validateNip96MediaUrl({
            rawUrl: mediaUrl,
            trustedUploadUrl,
            pageProtocol: "http:",
        }).url).toBe(mediaUrl);
    });

    it("allows loopback HTTP media only when it shares the explicit loopback upload origin", () => {
        const trustedUploadUrl = canonicalizeNip96UploadUrl("http://localhost:8080/upload");

        expect(validateNip96MediaUrl({
            rawUrl: "http://localhost:8080/file.png?token=a%2Bb",
            trustedUploadUrl,
            pageProtocol: "https:",
        }).url).toBe("http://localhost:8080/file.png?token=a%2Bb");

        expect(() => validateNip96MediaUrl({
            rawUrl: "http://localhost:9090/file.png",
            trustedUploadUrl,
            pageProtocol: "https:",
        })).toThrow(Nip96UrlPolicyError);
    });
});
