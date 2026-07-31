import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ShareHandler, getSharedMediaFromServiceWorker, checkIfOpenedFromShare } from "../../lib/shareHandler";
import type { SharedMediaMetadata } from "../../lib/types";
import { createTestFile } from "../fileTestUtils";

vi.mock("../../stores/sharedContentStore.svelte", () => ({
    clearSharedMediaStore: vi.fn(),
    updateSharedMediaStore: vi.fn(),
    getSharedMediaFiles: vi.fn(() => []),
    getSharedMediaMetadata: vi.fn(() => undefined),
}));

const mockSharedContentStore = vi.mocked(await import("../../stores/sharedContentStore.svelte"));

vi.mock("../../lib/debug", () => ({
    showCompressedImagePreview: vi.fn()
}));

vi.mock("../../lib/storage/sharedMediaRepository", () => ({
    sharedMediaRepository: {
        deleteLatest: vi.fn().mockResolvedValue(undefined),
    },
}));

const mockSharedMediaRepository = vi.mocked(await import("../../lib/storage/sharedMediaRepository"));

describe("ShareHandler", () => {
    let handler: ShareHandler;

    beforeEach(() => {
        // window.location.searchを共有モードに
        Object.defineProperty(window, "location", {
            value: { search: "?shared=true" },
            writable: true
        });
        // navigator.serviceWorkerにaddEventListenerを追加
        Object.defineProperty(navigator, "serviceWorker", {
            value: {
                addEventListener: vi.fn(),
                // 必要に応じて他のプロパティも追加
            },
            configurable: true,
            writable: true
        });
        handler = new ShareHandler();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("共有パラメータが存在する場合はcheckIfOpenedFromShareがtrueを返す", () => {
        expect(handler.checkIfOpenedFromShare()).toBe(true);
        expect(checkIfOpenedFromShare()).toBe(true);
    });

    it("getSharedMediaFiles/getSharedMediaMetadataはデフォルトでnull/undefinedを返す", () => {
        expect(handler.getSharedMediaFiles()).toEqual([]);
        expect(handler.getSharedMediaMetadata()).toBeUndefined();
    });

    it("clearSharedMediaはclearSharedMediaStoreを呼び出す", () => {
        handler.clearSharedMedia();
        expect(mockSharedContentStore.clearSharedMediaStore).toHaveBeenCalled();
    });

    it("SHARED_MEDIAメッセージでupdateSharedMediaStoreが呼ばれる", () => {
        const file = createTestFile({ name: "test.jpg", type: "image/jpeg", content: new Uint8Array(1234) });
        expect(file.size).toBe(1234);
        const metadata: SharedMediaMetadata = { name: "test.jpg" };
        const event = { data: { type: "SHARED_MEDIA", data: { images: [file], metadata: [metadata] } } };
        // @ts-ignore
        handler["handleServiceWorkerMessage"](event);
        expect(mockSharedContentStore.updateSharedMediaStore).toHaveBeenCalledWith(expect.objectContaining({
            images: [file],
            metadata: [metadata],
        }));
        expect(mockSharedMediaRepository.sharedMediaRepository.deleteLatest).not.toHaveBeenCalled();
    });

    it("ServiceWorkerコントローラーが無い場合getSharedMediaFromServiceWorkerはnullを返す", async () => {
        // navigator.serviceWorker.controllerが未定義
        Object.defineProperty(navigator, "serviceWorker", {
            value: {},
            configurable: true
        });
        expect(await handler.getSharedMediaFromServiceWorker()).toBeNull();
        expect(await getSharedMediaFromServiceWorker()).toBeNull();
    });

    it("共有起動でない場合processSharedMediaOnLaunchはエラーを返す", async () => {
        Object.defineProperty(window, "location", { value: { search: "" } });
        const h = new ShareHandler();
        const result = await h.checkForSharedMediaOnLaunch();
        expect(result.success).toBe(false);
        expect(result.error).toMatch(/共有経由/);
    });

    it("既に処理中の場合processSharedMediaOnLaunchはエラーを返す", async () => {
        // isProcessingSharedMediaを強制true
        // @ts-ignore
        handler["isProcessingSharedMedia"] = true;
        const result = await handler.checkForSharedMediaOnLaunch();
        expect(result.success).toBe(false);
        expect(result.error).toMatch(/既に処理中/);
    });

    it("processSharedMediaOnLaunchが成功時にストアが更新される", async () => {
        // FileUploadManagerのprocessSharedMediaOnLaunchをモック
        const file = createTestFile({ name: "test.jpg", type: "image/jpeg", content: new Uint8Array(1234) });
        const metadata = { name: "test.jpg" };
        // @ts-ignore
        handler.fileUploadManager.processSharedMediaOnLaunch = vi.fn().mockResolvedValue({
            success: true,
            data: { images: [file], metadata: [{ name: "test.jpg" }] }
        });
        const result = await handler.checkForSharedMediaOnLaunch();
        expect(result.success).toBe(true);
        expect(mockSharedContentStore.updateSharedMediaStore).toHaveBeenCalledWith(expect.objectContaining({
            images: [file],
            metadata: [{ name: "test.jpg" }],
        }));
    });

    it("isProcessingは初期状態でfalseを返す", () => {
        expect(handler.isProcessing()).toBe(false);
    });
});
