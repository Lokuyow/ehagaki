import { beforeEach, describe, expect, it, vi } from "vitest";
import { encode } from "blurhash";
import { AuthenticationRequiredError } from "../../lib/sessionLiveness";

const managerMocks = vi.hoisted(() => ({
    instances: [] as Array<{ isUploadAborted?: () => boolean }>,
    validateMediaFile: vi.fn(),
    uploadFileForHost: vi.fn(),
}));
const destinationResolverMock = vi.hoisted(() => vi.fn());

vi.mock("../../lib/fileUploadManager", () => ({
    FileUploadManager: class {
        constructor(dependencies: { isUploadAborted?: () => boolean }) {
            managerMocks.instances.push(dependencies);
        }
        validateMediaFile(file: File) {
            return managerMocks.validateMediaFile(file);
        }
        uploadFileForHost(file: File, destination: unknown, signal: AbortSignal) {
            return managerMocks.uploadFileForHost(file, destination, signal);
        }
    },
}));
vi.mock("../../lib/imageCompressionService", () => ({ ImageCompressionService: class {} }));
vi.mock("../../lib/mimeTypeSupport", () => ({ MimeTypeSupport: class {} }));
vi.mock("../../lib/nostrAuthService", () => ({ NostrAuthService: class {} }));
vi.mock("../../lib/videoCompression/videoCompressionService", () => ({ VideoCompressionService: class {} }));
vi.mock("../../lib/appStorage", () => ({ getAppStorage: () => window.localStorage }));
vi.mock("../../lib/upload/resolveCurrentUploadDestination", () => ({
    resolveCurrentUploadDestination: destinationResolverMock,
}));

import { uploadFileForHost } from "../../lib/upload/headlessUpload";

const customDestination = {
    protocol: "custom-http",
    serverUrl: "https://upload.example.com",
} as any;
const nip96Destination = { protocol: "nip96", serverUrl: "https://upload.example.com" } as any;

function createFile(): File {
    return new File([new Uint8Array([1, 2, 3])], "profile.png", { type: "image/png" });
}

describe("Full headless upload composition", () => {
    beforeEach(() => {
        managerMocks.instances = [];
        managerMocks.validateMediaFile.mockReset().mockReturnValue({ isValid: true });
        managerMocks.uploadFileForHost.mockReset().mockResolvedValue({
            success: true,
            url: "https://cdn.example.com/profile.png",
            uploadProtocol: "custom-http",
        });
        destinationResolverMock.mockReset().mockResolvedValue(customDestination);
    });

    it("uses the resolved destination and operation-local signal, returning the final URL", async () => {
        const file = createFile();
        const controller = new AbortController();
        await expect(uploadFileForHost(file, controller.signal)).resolves.toEqual({
            url: "https://cdn.example.com/profile.png",
        });

        expect(destinationResolverMock).toHaveBeenCalledOnce();
        expect(managerMocks.uploadFileForHost).toHaveBeenCalledWith(file, customDestination, controller.signal);
        expect(managerMocks.instances[0].isUploadAborted?.()).toBe(false);
        controller.abort();
        expect(managerMocks.instances[0].isUploadAborted?.()).toBe(true);
    });

    it("does not construct upload processing for an already aborted signal", async () => {
        const controller = new AbortController();
        controller.abort();

        await expect(uploadFileForHost(createFile(), controller.signal)).rejects.toMatchObject({ name: "AbortError" });
        expect(managerMocks.instances).toHaveLength(0);
        expect(destinationResolverMock).not.toHaveBeenCalled();
    });

    it("rejects unsupported files before resolving a destination", async () => {
        managerMocks.validateMediaFile.mockReturnValue({ isValid: false, errorMessage: "file_too_large" });

        await expect(uploadFileForHost(createFile(), new AbortController().signal)).rejects.toMatchObject({
            name: "unsupported_media",
        });
        expect(destinationResolverMock).not.toHaveBeenCalled();
        expect(managerMocks.uploadFileForHost).not.toHaveBeenCalled();
    });

    it("rejects non-File inputs as unsupported media", async () => {
        await expect(uploadFileForHost(
            { type: "image/png", size: 3, name: "not-a-file.png" } as File,
            new AbortController().signal,
        )).rejects.toMatchObject({ name: "unsupported_media" });

        expect(managerMocks.instances).toHaveLength(0);
        expect(managerMocks.validateMediaFile).not.toHaveBeenCalled();
    });

    it("accepts a File created in another Window realm", async () => {
        const iframe = document.createElement("iframe");
        document.body.append(iframe);
        try {
            const ForeignFile = (iframe.contentWindow as unknown as { File: typeof File }).File;
            const foreignFile = new ForeignFile([new Uint8Array([1, 2, 3])], "foreign.png", {
                type: "image/png",
            });

            await expect(uploadFileForHost(foreignFile, new AbortController().signal))
                .resolves.toMatchObject({ url: "https://cdn.example.com/profile.png" });
            expect(managerMocks.validateMediaFile).toHaveBeenCalledWith(foreignFile);
        } finally {
            iframe.remove();
        }
    });

    it("returns only a valid absolute HTTP(S) URL from custom HTTP", async () => {
        managerMocks.uploadFileForHost.mockResolvedValue({
            success: true,
            url: "https://cdn.example.com/profile.png?size=1",
        });

        await expect(uploadFileForHost(createFile(), new AbortController().signal)).resolves.toEqual({
            url: "https://cdn.example.com/profile.png?size=1",
        });
    });

    it.each([
        ["relative", "/profile.png"],
        ["non-HTTP(S) scheme", "javascript:alert(1)"],
        ["userinfo", "https://user:secret@cdn.example.com/profile.png"],
    ])("rejects a custom HTTP result URL with %s", async (_description, url) => {
        managerMocks.uploadFileForHost.mockResolvedValue({ success: true, url });

        await expect(uploadFileForHost(createFile(), new AbortController().signal))
            .rejects.toMatchObject({ name: "upload_failed" });
    });

    it("maps required authentication and transport failures to stable public names", async () => {
        managerMocks.uploadFileForHost.mockRejectedValueOnce(new AuthenticationRequiredError());
        await expect(uploadFileForHost(createFile(), new AbortController().signal)).rejects.toMatchObject({
            name: "login_required",
        });

        managerMocks.uploadFileForHost.mockResolvedValueOnce({ success: false, error: "Upload failed: 413 Payload Too Large" });
        await expect(uploadFileForHost(createFile(), new AbortController().signal)).rejects.toMatchObject({
            name: "unsupported_media",
        });

        managerMocks.uploadFileForHost.mockResolvedValueOnce({ success: false, error: "The server could not be reached" });
        await expect(uploadFileForHost(createFile(), new AbortController().signal)).rejects.toMatchObject({
            name: "upload_failed",
        });
    });

    it("uses final NIP-96 x and valid server metadata, never the original ox", async () => {
        const blurhash = encode(new Uint8ClampedArray([32, 64, 96, 255]), 1, 1, 4, 4);
        destinationResolverMock.mockResolvedValue(nip96Destination);
        managerMocks.uploadFileForHost.mockResolvedValue({
            success: true,
            url: "https://cdn.example.com/transformed.png",
            uploadProtocol: "nip96",
            nip94: {
                x: "a".repeat(64),
                ox: "b".repeat(64),
                m: "image/webp",
                dim: "640x480",
                blurhash,
            },
        });

        await expect(uploadFileForHost(createFile(), new AbortController().signal)).resolves.toEqual({
            url: "https://cdn.example.com/transformed.png",
            mimeType: "image/webp",
            dim: "640x480",
            sha256: "a".repeat(64),
            blurhash,
        });
    });

    it("ignores unverified metadata returned from a custom HTTP transport", async () => {
        managerMocks.uploadFileForHost.mockResolvedValue({
            success: true,
            url: "https://cdn.example.com/custom.png",
            uploadProtocol: "custom-http",
            dimensions: { width: 100, height: 100 },
            nip94: { x: "a".repeat(64), m: "image/png", dim: "100x100", blurhash: "invalid" },
        });

        await expect(uploadFileForHost(createFile(), new AbortController().signal)).resolves.toEqual({
            url: "https://cdn.example.com/custom.png",
        });
    });

    it("checks cancellation after asynchronous destination resolution", async () => {
        const controller = new AbortController();
        destinationResolverMock.mockImplementation(async () => {
            controller.abort();
            return customDestination;
        });

        await expect(uploadFileForHost(createFile(), controller.signal)).rejects.toMatchObject({ name: "AbortError" });
        expect(managerMocks.uploadFileForHost).not.toHaveBeenCalled();
    });
});
