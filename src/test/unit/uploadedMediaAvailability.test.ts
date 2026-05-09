import { afterEach, describe, expect, it, vi } from "vitest";
import { waitForUploadedMediaAvailability } from "../../lib/upload/uploadedMediaAvailability";

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

describe("waitForUploadedMediaAvailability", () => {
    it("retries when HEAD returns a share.yabu.me style placeholder image response", async () => {
        vi.useFakeTimers();

        const fetchMock = vi.fn()
            .mockResolvedValueOnce(new Response(null, {
                status: 200,
                headers: {
                    "content-type": "image/webp",
                    "x-reason": "File not found",
                },
            }))
            .mockResolvedValueOnce(new Response(null, {
                status: 200,
                headers: {
                    "content-type": "image/png",
                },
            }));
        const imageSpy = vi.spyOn(window, "Image");

        const waitPromise = waitForUploadedMediaAvailability({
            url: "https://share.yabu.me/api/v2/media/example.png",
            mimeType: "image/png",
            fetch: fetchMock as unknown as typeof fetch,
        });

        await vi.runAllTimersAsync();
        await waitPromise;

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(imageSpy).not.toHaveBeenCalled();
    });

    it("treats textual placeholder bodies as unavailable before succeeding", async () => {
        vi.useFakeTimers();

        const fetchMock = vi.fn()
            .mockResolvedValueOnce(new Response(null, {
                status: 405,
            }))
            .mockResolvedValueOnce(new Response("<svg>FILE NOT FOUND</svg>", {
                status: 200,
                headers: {
                    "content-type": "image/svg+xml",
                },
            }))
            .mockResolvedValueOnce(new Response(null, {
                status: 405,
            }))
            .mockResolvedValueOnce(new Response("<svg>ok</svg>", {
                status: 200,
                headers: {
                    "content-type": "image/svg+xml",
                },
            }));
        const imageSpy = vi.spyOn(window, "Image");

        const waitPromise = waitForUploadedMediaAvailability({
            url: "https://example.com/file.svg",
            mimeType: "image/svg+xml",
            fetch: fetchMock as unknown as typeof fetch,
        });

        await vi.runAllTimersAsync();
        await waitPromise;

        expect(fetchMock).toHaveBeenCalledTimes(4);
        expect(imageSpy).not.toHaveBeenCalled();
    });
});