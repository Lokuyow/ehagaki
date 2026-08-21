import { describe, expect, it, vi } from "vitest";

import { createHostOwnedUploadExecutor } from "../../lib/hostOwnedUpload";

describe("Host-owned media handoff", () => {
    it("passes the same File instance to the host and accepts only an HTTP(S) result", async () => {
        const controller = new AbortController();
        const file = new File(["media"], "photo.png", { type: "image/png" });
        const uploadMedia = vi.fn(async (received: File) => {
            expect(received).toBe(file);
            return {
                url: "https://media.example/photo.png",
                imeta: { alt: "photo", ignored: "ignored" },
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
            originalName: "photo.png",
            processedName: "photo.png",
            blurhash: "blurhash-value",
        }), { signal: controller.signal });
        expect(result).toMatchObject({
            success: true,
            url: "https://media.example/photo.png",
            nip94: { alt: "photo" },
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
});
