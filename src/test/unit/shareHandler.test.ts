import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ShareHandler, getSharedMediaFromServiceWorker, checkIfOpenedFromShare } from "../../lib/shareHandler";
import type { SharedMediaMetadata } from "../../lib/types";

vi.mock("../../stores/appStore.svelte", () => ({
    clearSharedMediaStore: vi.fn(),
    updateSharedMediaStore: vi.fn(),
    getSharedMediaFiles: vi.fn(() => []),
    getSharedMediaMetadata: vi.fn(() => undefined),
    getVideoCompressionService: vi.fn(() => null),
    getImageCompressionService: vi.fn(() => null),
    setVideoCompressionService: vi.fn(),
    setImageCompressionService: vi.fn()
}));

const mockAppStore = vi.mocked(await import("../../stores/appStore.svelte"));

vi.mock("../../lib/debug", () => ({
    showCompressedImagePreview: vi.fn()
}));

// モック用ファイル生成
function createMockFile(name = "test.jpg", type = "image/jpeg", size = 1234): File {
    return new File([new Uint8Array(size)], name, { type });
}

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
        expect(mockAppStore.clearSharedMediaStore).toHaveBeenCalled();
    });

    it("SHARED_MEDIAメッセージでupdateSharedMediaStoreが呼ばれる", () => {
        const file = createMockFile();
        const metadata: SharedMediaMetadata = { name: "test.jpg" };
        const event = { data: { type: "SHARED_MEDIA", data: { images: [file], metadata: [metadata] } } };
        // @ts-ignore
        handler["handleServiceWorkerMessage"](event);
        expect(mockAppStore.updateSharedMediaStore).toHaveBeenCalledWith([file], [metadata]);
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
        const file = createMockFile();
        const metadata = { name: "test.jpg" };
        // @ts-ignore
        handler.fileUploadManager.processSharedMediaOnLaunch = vi.fn().mockResolvedValue({
            success: true,
            data: { images: [file], metadata: [{ name: "test.jpg" }] }
        });
        const result = await handler.checkForSharedMediaOnLaunch();
        expect(result.success).toBe(true);
        expect(mockAppStore.updateSharedMediaStore).toHaveBeenCalledWith([file], [{ name: "test.jpg" }]);
    });

    it("isProcessingは初期状態でfalseを返す", () => {
        expect(handler.isProcessing()).toBe(false);
    });
});
