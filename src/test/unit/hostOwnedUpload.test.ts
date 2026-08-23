import { describe, expect, it, vi } from "vitest";

const videoCompressionState = vi.hoisted(() => ({
    processedFile: null as File | null,
    receivedFiles: [] as File[],
}));

vi.mock("../../lib/videoCompression/videoCompressionService", () => ({
    VideoCompressionService: class {
        async compress(file: File) {
            videoCompressionState.receivedFiles.push(file);
            if (!videoCompressionState.processedFile) throw new Error("Missing processed video fixture");
            return { file: videoCompressionState.processedFile, wasCompressed: true };
        }
    },
}));

import { createHostOwnedUploadExecutor } from "../../lib/hostOwnedUpload";
import type { UploadHelperDependencies } from "../../lib/types";

describe("Host-owned media handoff", () => {
    it("passes the same File instance to the host and accepts only an HTTP(S) result", async () => {
        const controller = new AbortController();
        const file = new File(["media"], "photo.webp", { type: "image/webp" });
        const uploadMedia = vi.fn(async (received: File) => {
            expect(received).toBe(file);
            return {
                url: "https://media.example/abcdef",
                imeta: {
                    m: "image/webp",
                    alt: "photo",
                    blurhash: "server-blurhash",
                    dim: "1x1",
                    size: "12",
                    x: "a".repeat(64),
                    ignored: "ignored",
                },
            };
        });
        const executor = createHostOwnedUploadExecutor({
            uploadMedia,
            signal: controller.signal,
        });

        const [result] = await executor.uploadPreparedFiles([file], [{
            file,
            placeholderId: "placeholder-1",
            blurhash: "blurhash-value",
        }]);

        expect(uploadMedia).toHaveBeenCalledWith(file, expect.objectContaining({
            originalName: "photo.webp",
            processedName: "photo.webp",
            blurhash: "blurhash-value",
        }), { signal: controller.signal });
        expect(result).toMatchObject({
            success: true,
            hostOwnedMedia: true,
            url: "https://media.example/abcdef",
            nip94: {
                m: "image/webp",
                alt: "photo",
                blurhash: "server-blurhash",
                dim: "1x1",
                size: "12",
                x: "a".repeat(64),
            },
            uploadProtocol: "custom-http",
        });
        expect(result.nip94).not.toHaveProperty("ignored");
    });

    it("does not turn invalid or aborted host responses into media nodes", async () => {
        const invalidController = new AbortController();
        const file = new File(["media"], "photo.png", { type: "image/png" });
        const invalid = createHostOwnedUploadExecutor({
            uploadMedia: async () => ({ url: "javascript:alert(1)" }),
            signal: invalidController.signal,
        });
        const [invalidResult] = await invalid.uploadPreparedFiles([file], [{
            file,
            placeholderId: "placeholder-1",
        }]);
        expect(invalidResult).toMatchObject({ success: false, error: "host_media_invalid_result" });

        const abortController = new AbortController();
        const aborted = createHostOwnedUploadExecutor({
            uploadMedia: async () => {
                abortController.abort();
                return { url: "https://media.example/photo.png" };
            },
            signal: abortController.signal,
        });
        const [abortedResult] = await aborted.uploadPreparedFiles([file], [{
            file,
            placeholderId: "placeholder-2",
        }]);
        expect(abortedResult).toMatchObject({ success: false, aborted: true });
    });

    it("preprocesses a large video before handing the processed file to the host transport", async () => {
        const controller = new AbortController();
        const original = new File([new Uint8Array(201 * 1024)], "original.mov", { type: "video/quicktime" });
        const processed = new File([new Uint8Array(32 * 1024)], "original_compressed.mp4", { type: "video/mp4" });
        videoCompressionState.processedFile = processed;
        videoCompressionState.receivedFiles = [];
        const selfUploadManager = vi.fn(() => {
            throw new Error("Host-owned preprocessing must not construct self-upload transport");
        });
        const uploadMedia = vi.fn(async () => ({ url: "https://host.example/media/processed.mp4" }));
        const executor = createHostOwnedUploadExecutor({ uploadMedia, signal: controller.signal });
        const storage = new Map<string, string>();
        const dependencies = {
            localStorage: {
                getItem: (key: string) => storage.get(key) ?? null,
                setItem: (key: string, value: string) => storage.set(key, value),
                removeItem: (key: string) => storage.delete(key),
                clear: () => storage.clear(),
                key: () => null,
                get length() { return storage.size; },
            },
            crypto: { digest: vi.fn(async () => new ArrayBuffer(32)) },
            tick: async () => { },
            FileUploadManager: selfUploadManager,
            getImageDimensions: vi.fn(async () => null),
            extractImageBlurhashMap: vi.fn(() => ({})),
            calculateImageHash: vi.fn(async () => null),
            getMimeTypeFromUrl: vi.fn(() => ""),
            createImetaTag: vi.fn(async () => []),
            imageSizeMapStore: { update: vi.fn() },
        } as unknown as UploadHelperDependencies;

        const prepared = await executor.prepareFiles([original], dependencies);
        const results = await executor.uploadPreparedFiles(
            prepared.map(({ file }) => file),
            prepared.map(({ file }, index) => ({ file, placeholderId: `placeholder-${index}` })),
        );

        expect(videoCompressionState.receivedFiles).toEqual([original]);
        expect(uploadMedia).toHaveBeenCalledWith(processed, expect.objectContaining({
            originalName: "original.mov",
            originalType: "video/quicktime",
            processedName: "original_compressed.mp4",
            processedType: "video/mp4",
        }), { signal: controller.signal });
        expect(results[0]).toMatchObject({ success: true, hostOwnedMedia: true });
        expect(selfUploadManager).not.toHaveBeenCalled();
    });
});
