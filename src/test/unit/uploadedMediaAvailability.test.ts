import { afterEach, describe, expect, it, vi } from "vitest";
import {
    UploadedMediaAvailabilityError,
    waitForUploadedMediaAvailability,
} from "../../lib/upload/uploadedMediaAvailability";

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

describe("waitForUploadedMediaAvailability", () => {
    it("uses the exact server URL for HEAD and GET probes", async () => {
        const presignedUrl = "https://cdn.example:8443/file%2Fname?X-Amz-Signature=a%2Bb&z=2&a=1";
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(new Response(null, { status: 405 }))
            .mockResolvedValueOnce(new Response("ok", {
                status: 200,
                headers: { "content-type": "image/png" },
            }));

        await waitForUploadedMediaAvailability({
            url: presignedUrl,
            mimeType: "image/png",
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(fetchMock).toHaveBeenNthCalledWith(1, presignedUrl, {
            method: "HEAD",
            cache: "no-store",
            credentials: "omit",
            referrerPolicy: "no-referrer",
        });
        expect(fetchMock).toHaveBeenNthCalledWith(2, presignedUrl, {
            method: "GET",
            cache: "no-store",
            credentials: "omit",
            referrerPolicy: "no-referrer",
        });
    });

    it("keeps the exact server URL and suppresses the referrer for Image fallback", async () => {
        const presignedUrl = "https://cdn.example/file.png?signature=a%2Bb&part=1";
        const images: Array<{ src: string; referrerPolicy: string }> = [];
        vi.spyOn(window, "Image").mockImplementation(function () {
            const image = {
                onload: null as (() => void) | null,
                onerror: null as (() => void) | null,
                src: "",
                referrerPolicy: "",
            };
            images.push(image);
            queueMicrotask(() => image.onload?.());
            return image as unknown as HTMLImageElement;
        });

        await waitForUploadedMediaAvailability({
            url: presignedUrl,
            mimeType: "image/png",
            fetch: vi.fn(async () => {
                throw new TypeError("Failed to fetch");
            }) as unknown as typeof fetch,
        });

        expect(images).toEqual([expect.objectContaining({
            src: presignedUrl,
            referrerPolicy: "no-referrer",
        })]);
    });

    it("distinguishes an inconclusive probe from an explicit unavailable response", async () => {
        await expect(waitForUploadedMediaAvailability({
            url: "https://cdn.example/file.mp4",
            mimeType: "video/mp4",
            fetch: vi.fn(async () => {
                throw new TypeError("Failed to fetch");
            }) as unknown as typeof fetch,
            maxWaitTime: 0,
        })).rejects.toEqual(expect.objectContaining({
            name: "UploadedMediaAvailabilityError",
            reason: "inconclusive",
        } satisfies Partial<UploadedMediaAvailabilityError>));
    });

    it("stops an in-flight availability probe with AbortError", async () => {
        const controller = new AbortController();
        let markStarted!: () => void;
        const started = new Promise<void>((resolve) => { markStarted = resolve; });
        const fetchMock = vi.fn((_url: string | URL, init?: RequestInit) => {
            markStarted();
            return new Promise<Response>((_resolve, reject) => {
                init?.signal?.addEventListener("abort", () => {
                    const error = new Error("aborted");
                    error.name = "AbortError";
                    reject(error);
                }, { once: true });
            });
        });
        const waiting = waitForUploadedMediaAvailability({
            url: "https://cdn.example/file.png",
            mimeType: "image/png",
            fetch: fetchMock as unknown as typeof fetch,
            signal: controller.signal,
        });

        await started;
        expect(fetchMock.mock.calls[0][1]?.signal).toBe(controller.signal);
        controller.abort();
        await expect(waiting).rejects.toMatchObject({ name: "AbortError" });
    });

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
        expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
            "https://share.yabu.me/api/v2/media/example.png",
            "https://share.yabu.me/api/v2/media/example.png",
        ]);
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
