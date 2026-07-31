import { afterEach, describe, expect, it, vi } from "vitest";
import { Nip96UploadAdapter } from "../../lib/upload/Nip96UploadAdapter";
import type { UploadDestination } from "../../lib/types";
import { createNip96ProcessingResponse, createNip96SuccessResponse, createTextResponse } from "../jsonResponseTestHelper";

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
            .mockResolvedValueOnce(createNip96ProcessingResponse({
                processing_url: "https://share.yabu.me/1811",
            }))
            .mockResolvedValueOnce(createTextResponse("Not Found", 404))
            .mockResolvedValueOnce(createNip96SuccessResponse({
                nip94_event: {
                    tags: [
                        ["url", "https://share.yabu.me/files/mockhash.png"],
                        ["x", "a".repeat(64)],
                        ["m", "image/png"],
                    ],
                },
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
        expect(imageSpy).toHaveBeenCalledTimes(2);
    });
});