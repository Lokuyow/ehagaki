import { afterEach, describe, expect, it, vi } from "vitest";
import { Nip96UploadAdapter } from "../../lib/upload/Nip96UploadAdapter";
import type { UploadDestination } from "../../lib/types";
import { createJsonResponse } from "../uploadResponseTestUtils";

function createDestination(): UploadDestination {
    return {
        id: "share-yabu-me",
        pubkeyHex: null,
        name: "share.yabu.me",
        protocol: "nip96",
        serverUrl: "https://share.yabu.me/api/v1/upload",
        resolvedUploadUrl: "https://share.yabu.me/api/v1/upload",
        presetId: "share-yabu-me",
        isDefault: true,
        enabled: true,
        createdAt: 1,
        updatedAt: 1,
        capabilities: {
            maxUploadSize: null,
            supportedMimeTypes: [],
            supportsDelete: false,
            supportsList: false,
            supportsMirror: false,
            supportsMediaOptimization: false,
            authRequired: true,
            source: "preset",
        },
        auth: { type: "nip98" },
        schemaVersion: 1,
    };
}

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

describe("Nip96UploadAdapter", () => {
    it("uses one canonical URL for the NIP-98 upload token and initial fetch", async () => {
        const adapter = new Nip96UploadAdapter();
        const destination = createDestination();
        destination.serverUrl = "https://EXAMPLE.com:443/upload?b=2&a=hello%20world#ignored";
        destination.resolvedUploadUrl = destination.serverUrl;
        const mediaUrl = "https://cdn.example:8443/file%2Fname?signature=a%2Bb&part=2#preview";
        const fetchMock = vi.fn().mockResolvedValueOnce(createJsonResponse({
            status: "success",
            nip94_event: {
                tags: [["url", mediaUrl]],
            },
        }, { status: 200 })).mockResolvedValueOnce(new Response(null, {
            status: 200,
            headers: { "content-type": "image/png" },
        }));
        const authService = { buildAuthHeader: vi.fn(async () => "Nostr token") };

        const result = await adapter.upload({
            file: new File(["image"], "test.png", { type: "image/png" }),
            destination,
            authService,
            fetch: fetchMock as unknown as typeof fetch,
        });

        const canonicalUrl = "https://example.com/upload?b=2&a=hello%20world";
        expect(result).toEqual(expect.objectContaining({
            success: true,
            url: "https://cdn.example:8443/file%2Fname?signature=a%2Bb&part=2",
            nip94: expect.objectContaining({
                url: "https://cdn.example:8443/file%2Fname?signature=a%2Bb&part=2",
            }),
        }));
        expect(authService.buildAuthHeader).toHaveBeenCalledWith(canonicalUrl, "POST");
        expect(fetchMock).toHaveBeenNthCalledWith(1, canonicalUrl, expect.objectContaining({
            method: "POST",
            redirect: "error",
        }));
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            "https://cdn.example:8443/file%2Fname?signature=a%2Bb&part=2",
            expect.objectContaining({ method: "HEAD" }),
        );
    });

    it("rejects an invalid saved NIP-96 destination before signing or fetching", async () => {
        const destination = createDestination();
        destination.serverUrl = "relative/upload";
        destination.resolvedUploadUrl = "relative/upload";
        const authService = { buildAuthHeader: vi.fn(async () => "Nostr upload") };
        const fetchMock = vi.fn();

        const result = await new Nip96UploadAdapter().upload({
            file: new File(["image"], "test.png", { type: "image/png" }),
            destination,
            authService,
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            errorCode: "nip96InvalidDestinationUrl",
        }));
        expect(authService.buildAuthHeader).not.toHaveBeenCalled();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("returns a safe initial-upload failure without processing or media work when the POST is blocked", async () => {
        const fetchMock = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
        const authService = { buildAuthHeader: vi.fn(async () => "Nostr upload") };

        const result = await new Nip96UploadAdapter().upload({
            file: new File(["image"], "test.png", { type: "image/png" }),
            destination: createDestination(),
            authService,
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result).toEqual({
            success: false,
            errorCode: "nip96UploadRequestBlocked",
            error: "The upload request could not be completed safely",
        });
        expect(authService.buildAuthHeader).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            "https://share.yabu.me/api/v1/upload",
            expect.objectContaining({ method: "POST", redirect: "error" }),
        );
    });

    it("keeps same-origin processing authentication and protects its fetch options", async () => {
        const adapter = new Nip96UploadAdapter();
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createJsonResponse({
                status: "processing",
                processing_url: "https://share.yabu.me/status?job=abc%2Fdef",
            }, { status: 202 }))
            .mockResolvedValueOnce(createJsonResponse({
                status: "success",
                nip94_event: { tags: [["url", "https://cdn.example/file.png"]] },
            }, { status: 200 }))
            .mockResolvedValueOnce(new Response(null, {
                status: 200,
                headers: { "content-type": "image/png" },
            }));
        const authService = {
            buildAuthHeader: vi.fn(async (_url: string, method: string) => `Nostr ${method}`),
        };

        const result = await adapter.upload({
            file: new File(["image"], "test.png", { type: "image/png" }),
            destination: createDestination(),
            authService,
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result).toEqual(expect.objectContaining({ success: true }));
        expect(authService.buildAuthHeader).toHaveBeenNthCalledWith(
            1,
            "https://share.yabu.me/api/v1/upload",
            "POST",
        );
        expect(authService.buildAuthHeader).toHaveBeenNthCalledWith(
            2,
            "https://share.yabu.me/status?job=abc%2Fdef",
            "GET",
        );
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            "https://share.yabu.me/status?job=abc%2Fdef",
            {
                method: "GET",
                headers: { Authorization: "Nostr GET" },
                credentials: "omit",
                referrerPolicy: "no-referrer",
                redirect: "error",
            },
        );
    });

    it("does not sign a cross-origin processing URL even when the upload response reports that origin", async () => {
        const adapter = new Nip96UploadAdapter();
        const uploadResponse = createJsonResponse({
            status: "processing",
            processing_url: "https://queue.example/status?job=1",
        }, { status: 202 });
        Object.defineProperty(uploadResponse, "url", {
            value: "https://redirected.example/upload",
        });
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(uploadResponse)
            .mockResolvedValueOnce(createJsonResponse({
                status: "success",
                nip94_event: { tags: [["url", "https://cdn.example/file.png"]] },
            }, { status: 200 }))
            .mockResolvedValueOnce(new Response(null, {
                status: 200,
                headers: { "content-type": "image/png" },
            }));
        const authService = { buildAuthHeader: vi.fn(async () => "Nostr upload") };

        const result = await adapter.upload({
            file: new File(["image"], "test.png", { type: "image/png" }),
            destination: createDestination(),
            authService,
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result).toEqual(expect.objectContaining({ success: true }));
        expect(authService.buildAuthHeader).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenNthCalledWith(2, "https://queue.example/status?job=1", {
            method: "GET",
            credentials: "omit",
            referrerPolicy: "no-referrer",
            redirect: "error",
        });
    });

    it.each([401, 403])("does not sign a cross-origin processing %i response", async (status) => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createJsonResponse({
                status: "processing",
                processing_url: "https://queue.example/status",
            }, { status: 202 }))
            .mockResolvedValueOnce(new Response("Unauthorized", { status }));
        const authService = { buildAuthHeader: vi.fn(async () => "Nostr upload") };

        const result = await new Nip96UploadAdapter().upload({
            file: new File(["image"], "test.png", { type: "image/png" }),
            destination: createDestination(),
            authService,
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result).toEqual(expect.objectContaining({ success: false }));
        expect(authService.buildAuthHeader).toHaveBeenCalledTimes(1);
    });

    it("rejects an invalid first NIP-94 URL before availability polling", async () => {
        const fetchMock = vi.fn().mockResolvedValueOnce(createJsonResponse({
            status: "success",
            nip94_event: {
                tags: [
                    ["url", "javascript:alert(1)"],
                    ["url", "https://cdn.example/ignored.png"],
                ],
            },
        }, { status: 200 }));

        const result = await new Nip96UploadAdapter().upload({
            file: new File(["image"], "test.png", { type: "image/png" }),
            destination: createDestination(),
            authService: { buildAuthHeader: vi.fn(async () => "Nostr upload") },
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            errorCode: "nip96InvalidMediaUrl",
        }));
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("uses safe discovery, supports delegation, and reads nested NIP-98 capability", async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createJsonResponse({
                delegated_to_url: "https://delegate.example",
            }, { status: 200 }))
            .mockResolvedValueOnce(createJsonResponse({
                api_url: "https://api.example/upload",
                plans: { free: { is_nip98_required: false, max_byte_size: 1024 } },
            }, { status: 200 }));

        const result = await new Nip96UploadAdapter().testConnection({
            destination: createDestination(),
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result).toEqual(expect.objectContaining({
            success: true,
            capabilities: expect.objectContaining({
                authRequired: false,
                maxUploadSize: 1024,
                raw: expect.objectContaining({
                    plans: { free: { is_nip98_required: false, max_byte_size: 1024 } },
                }),
            }),
        }));
        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            "https://share.yabu.me/.well-known/nostr/nip96.json",
            {
                method: "GET",
                credentials: "omit",
                referrerPolicy: "no-referrer",
                redirect: "error",
            },
        );
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            "https://delegate.example/.well-known/nostr/nip96.json",
            expect.any(Object),
        );
    });

    it("rejects unsafe discovery api_url values and delegation loops", async () => {
        const unsafeResult = await new Nip96UploadAdapter().testConnection({
            destination: createDestination(),
            fetch: vi.fn().mockResolvedValue(createJsonResponse({
                api_url: "http://192.168.1.1/upload",
            }, { status: 200 })) as unknown as typeof fetch,
        });
        expect(unsafeResult).toEqual(expect.objectContaining({ success: false }));

        const loopFetch = vi.fn().mockResolvedValue(createJsonResponse({
            delegated_to_url: "https://share.yabu.me",
        }, { status: 200 }));
        const loopResult = await new Nip96UploadAdapter().testConnection({
            destination: createDestination(),
            fetch: loopFetch as unknown as typeof fetch,
        });
        expect(loopResult).toEqual(expect.objectContaining({
            success: false,
            message: "NIP-96 discovery delegation loop detected",
        }));
        expect(loopFetch).toHaveBeenCalledTimes(1);

        const unsafeDelegationFetch = vi.fn().mockResolvedValue(createJsonResponse({
            delegated_to_url: "https://user:password@delegate.example",
        }, { status: 200 }));
        const unsafeDelegationResult = await new Nip96UploadAdapter().testConnection({
            destination: createDestination(),
            fetch: unsafeDelegationFetch as unknown as typeof fetch,
        });
        expect(unsafeDelegationResult).toEqual(expect.objectContaining({ success: false }));
        expect(unsafeDelegationFetch).toHaveBeenCalledTimes(1);
    });

    it("limits NIP-96 discovery delegation to three hops", async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createJsonResponse({ delegated_to_url: "https://one.example" }, { status: 200 }))
            .mockResolvedValueOnce(createJsonResponse({ delegated_to_url: "https://two.example" }, { status: 200 }))
            .mockResolvedValueOnce(createJsonResponse({ delegated_to_url: "https://three.example" }, { status: 200 }))
            .mockResolvedValueOnce(createJsonResponse({ delegated_to_url: "https://four.example" }, { status: 200 }));

        const result = await new Nip96UploadAdapter().testConnection({
            destination: createDestination(),
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result).toEqual(expect.objectContaining({
            success: false,
            message: "NIP-96 discovery delegation limit exceeded",
        }));
        expect(fetchMock).toHaveBeenCalledTimes(4);
    });

    it("retries a temporary 404 processing_url and waits for the uploaded image to load", async () => {
        vi.useFakeTimers();

        const adapter = new Nip96UploadAdapter();
        const imageLoadStates = [false, true];
        const imageSpy = vi.spyOn(window, "Image").mockImplementation(function () {
            const image = {
                onload: null as (() => void) | null,
                onerror: null as (() => void) | null,
                src: "",
            };

            setTimeout(() => {
                const shouldLoad = imageLoadStates.shift();
                if (shouldLoad) {
                    image.onload?.();
                    return;
                }

                image.onerror?.();
            }, 0);

            return image as unknown as HTMLImageElement;
        });
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createJsonResponse({
                status: "processing",
                processing_url: "https://share.yabu.me/1811",
            }, {
                status: 202,
            }))
            .mockResolvedValueOnce(new Response("Not Found", {
                status: 404,
                statusText: "Not Found",
            }))
            .mockResolvedValueOnce(createJsonResponse({
                status: "success",
                nip94_event: {
                    tags: [
                        ["url", "https://share.yabu.me/files/mockhash.png"],
                        ["x", "a".repeat(64)],
                        ["m", "image/png"],
                    ],
                },
            }, {
                status: 200,
            }));
        const authService = {
            buildAuthHeader: vi.fn(async (_url: string, method: string) => `Bearer ${method}`),
        };

        const uploadPromise = adapter.upload({
            file: new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "test.png", {
                type: "image/png",
            }),
            destination: createDestination(),
            authService,
            fetch: fetchMock as unknown as typeof fetch,
        });

        await vi.runAllTimersAsync();

        const result = await uploadPromise;

        expect(result).toEqual(expect.objectContaining({
            success: true,
            url: "https://share.yabu.me/files/mockhash.png",
        }));
        expect(authService.buildAuthHeader).toHaveBeenNthCalledWith(
            1,
            "https://share.yabu.me/api/v1/upload",
            "POST",
        );
        expect(authService.buildAuthHeader).toHaveBeenNthCalledWith(
            2,
            "https://share.yabu.me/1811",
            "GET",
        );
        expect(fetchMock).toHaveBeenNthCalledWith(2, "https://share.yabu.me/1811", {
            method: "GET",
            headers: { Authorization: "Bearer GET" },
            credentials: "omit",
            referrerPolicy: "no-referrer",
            redirect: "error",
        });
        expect(fetchMock).toHaveBeenNthCalledWith(3, "https://share.yabu.me/1811", {
            method: "GET",
            headers: { Authorization: "Bearer GET" },
            credentials: "omit",
            referrerPolicy: "no-referrer",
            redirect: "error",
        });
        expect(imageSpy).toHaveBeenCalledTimes(2);
    });
});
