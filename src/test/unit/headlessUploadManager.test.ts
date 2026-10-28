import { beforeEach, describe, expect, it, vi } from "vitest";
import { FileUploadManager } from "../../lib/fileUploadManager";
import type { CompressionService, FileUploadDependencies, UploadDestination } from "../../lib/types";
import { File as NodeFile } from "node:buffer";
import { MockStorage } from "../helpers";
import { createGifFixture } from "../gifFixture";
import { getImageDimensions } from "../../lib/utils/fileUtils";

const adapterMock = vi.hoisted(() => ({ upload: vi.fn() }));
const persistUploadedMediaMock = vi.hoisted(() => vi.fn());
const setImageSizeInfoMock = vi.hoisted(() => vi.fn());

vi.mock("../../lib/upload/uploadAdapterRegistry", () => ({
    getUploadAdapter: () => adapterMock,
}));
vi.mock("../../lib/postMediaCacheService", () => ({
    postMediaCacheService: { persistUploadedMedia: persistUploadedMediaMock },
}));
vi.mock("../../lib/utils/fileUtils", async (importOriginal) => ({
    ...await importOriginal<typeof import("../../lib/utils/fileUtils")>(),
    calculateSHA256Hex: vi.fn(async () => "a".repeat(64)),
    getImageDimensions: vi.fn(async () => ({ width: 640, height: 480 })),
}));
vi.mock("../../lib/tags/imetaTag", () => ({
    generateBlurhashForFile: vi.fn(async () => "LFE.@D9F01_2%LIVD*9G?b%2Tw=w"),
    createPlaceholderUrl: vi.fn(async () => "blob:placeholder"),
}));

const destination: UploadDestination = {
    id: "blossom-test",
    pubkeyHex: null,
    name: "Blossom",
    protocol: "blossom",
    serverUrl: "https://blossom.example",
    isDefault: true,
    enabled: true,
    createdAt: 1,
    updatedAt: 1,
    capabilities: {
        maxUploadSize: null,
        supportedMimeTypes: ["image/png"],
        supportsDelete: true,
        supportsList: true,
        supportsMirror: false,
        supportsMediaOptimization: false,
        authRequired: true,
        source: "test",
    },
    auth: { type: "blossom-bud11" },
    schemaVersion: 1,
};

describe("headless FileUploadManager", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it.each([false, true])("sends original GIF bytes and metadata (headless=%s)", async headless => {
        const bytes = createGifFixture();
        const file = new NodeFile([bytes], "animation.gif", { type: "image/gif", lastModified: 1234 }) as unknown as File;
        const storage = new MockStorage(); storage.setItem("imageQualityLevel", "low");
        const signal = new AbortController().signal;
        vi.mocked(getImageDimensions).mockResolvedValueOnce({ width: 256, height: 192, displayWidth: 256, displayHeight: 192 });
        adapterMock.upload.mockResolvedValue({ success: true, url: "https://blossom.example/animation.gif",
            nip94: { x: "a".repeat(64), m: "image/gif", size: String(file.size) } });
        const manager = new FileUploadManager({ localStorage: storage, fetch, crypto: crypto.subtle, document, window, navigator,
            isUploadAborted: () => signal.aborted, setImageSizeInfoFromFileSize: setImageSizeInfoMock }, { buildAuthHeader: vi.fn() });
        const result = headless ? await manager.uploadFileForHost(file, destination, signal)
            : await manager.uploadFile(file, undefined, false, undefined, undefined, destination);
        const sent = adapterMock.upload.mock.calls[0][0].file as File;
        expect(sent).toBe(file); expect(new Uint8Array(await sent.arrayBuffer())).toEqual(bytes);
        expect(sent.name).toBe("animation.gif"); expect(sent.type).toBe("image/gif");
        expect(result).toMatchObject({ success: true, nip94: { m: "image/gif", size: String(bytes.length), dim: "256x192" },
            sizeInfo: { originalSize: bytes.length, compressedSize: bytes.length, wasSkipped: true,
                originalFilename: "animation.gif", compressedFilename: "animation.gif" } });
        if (headless) expect(persistUploadedMediaMock).not.toHaveBeenCalled();
        else expect(persistUploadedMediaMock).toHaveBeenCalledWith(expect.objectContaining({ file, mimeType: "image/gif" }));
    });

    it("returns local image metadata only for Blossom's verified uploaded bytes and skips post cache", async () => {
        const signal = new AbortController().signal;
        adapterMock.upload.mockResolvedValue({
            success: true,
            url: "https://blossom.example/abc.png",
            nip94: { x: "a".repeat(64), m: "image/png", size: "3" },
        });
        const compression: CompressionService & { setProgressCallback: (callback?: unknown) => void } = {
            compress: vi.fn(async (file) => ({ file, wasCompressed: false })),
            hasCompressionSettings: vi.fn(() => false),
            setProgressCallback: vi.fn(),
        };
        const dependencies: FileUploadDependencies = {
            localStorage: window.localStorage,
            fetch: vi.fn() as unknown as typeof fetch,
            crypto: window.crypto.subtle,
            document,
            window,
            navigator,
            isUploadAborted: () => signal.aborted,
            setImageSizeInfoFromFileSize: setImageSizeInfoMock,
        };
        const manager = new FileUploadManager(
            dependencies,
            { buildAuthHeader: vi.fn() },
            compression,
        );
        const file = new File([new Uint8Array([1, 2, 3])], "avatar.png", { type: "image/png" });

        const result = await manager.uploadFileForHost(file, destination, signal);

        expect(result).toMatchObject({
            success: true,
            uploadProtocol: "blossom",
            url: "https://blossom.example/abc.png",
            dimensions: { width: 640, height: 480 },
            nip94: {
                x: "a".repeat(64),
                m: "image/png",
                size: "3",
                dim: "640x480",
                blurhash: "LFE.@D9F01_2%LIVD*9G?b%2Tw=w",
            },
        });
        expect(adapterMock.upload).toHaveBeenCalledWith(expect.objectContaining({ signal }));
        expect(compression.compress).toHaveBeenCalledWith(file, { signal });
        expect(persistUploadedMediaMock).not.toHaveBeenCalled();
        expect(setImageSizeInfoMock).not.toHaveBeenCalled();
    });
});
