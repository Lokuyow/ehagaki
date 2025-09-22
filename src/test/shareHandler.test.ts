import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ShareHandler, getShareHandler, getSharedImageFromServiceWorker, checkIfOpenedFromShare } from "../lib/shareHandler";
import * as appStore from "../stores/appStore.svelte";
import type { SharedImageData, SharedImageMetadata } from "../lib/types";

// appStore.svelte.tsの直接モック（pwa-register依存を回避）
vi.mock("../stores/appStore.svelte.ts", () => ({
    updateSharedImageStore: vi.fn(),
    clearSharedImageStore: vi.fn(),
    getSharedImageFile: vi.fn(() => null),
    getSharedImageMetadata: vi.fn(() => undefined)
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
        // appStoreの関数をクリア
        (appStore.updateSharedImageStore as any).mockClear();
        (appStore.clearSharedImageStore as any).mockClear();
        (appStore.getSharedImageFile as any).mockReturnValue(null);
        (appStore.getSharedImageMetadata as any).mockReturnValue(undefined);
        handler = new ShareHandler();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("共有パラメータが存在する場合はcheckIfOpenedFromShareがtrueを返す", () => {
        expect(handler.checkIfOpenedFromShare()).toBe(true);
        expect(checkIfOpenedFromShare()).toBe(true);
    });

    it("getSharedImageFile/getSharedImageMetadataはデフォルトでnull/undefinedを返す", () => {
        expect(handler.getSharedImageFile()).toBeNull();
        expect(handler.getSharedImageMetadata()).toBeUndefined();
    });

    it("clearSharedImageはclearSharedImageStoreを呼び出す", () => {
        handler.clearSharedImage();
        expect(appStore.clearSharedImageStore).toHaveBeenCalled();
    });

    it("SHARED_IMAGEメッセージでupdateSharedImageStoreが呼ばれる", () => {
        const file = createMockFile();
        const metadata: SharedImageMetadata = { name: "test.jpg" };
        const event = { data: { type: "SHARED_IMAGE", data: { image: file, metadata } } };
        // @ts-ignore
        handler["handleServiceWorkerMessage"](event);
        expect(appStore.updateSharedImageStore).toHaveBeenCalledWith(file, metadata);
    });

    it("ServiceWorkerコントローラーが無い場合getSharedImageFromServiceWorkerはnullを返す", async () => {
        // navigator.serviceWorker.controllerが未定義
        Object.defineProperty(navigator, "serviceWorker", {
            value: {},
            configurable: true
        });
        expect(await handler.getSharedImageFromServiceWorker()).toBeNull();
        expect(await getSharedImageFromServiceWorker()).toBeNull();
    });

    it("共有起動でない場合processSharedImageOnLaunchはエラーを返す", async () => {
        Object.defineProperty(window, "location", { value: { search: "" } });
        const h = new ShareHandler();
        const result = await h.checkForSharedImageOnLaunch();
        expect(result.success).toBe(false);
        expect(result.error).toMatch(/共有経由/);
    });

    it("既に処理中の場合processSharedImageOnLaunchはエラーを返す", async () => {
        // isProcessingSharedImageを強制true
        // @ts-ignore
        handler["isProcessingSharedImage"] = true;
        const result = await handler.checkForSharedImageOnLaunch();
        expect(result.success).toBe(false);
        expect(result.error).toMatch(/既に処理中/);
    });

    it("processSharedImageOnLaunchが成功時にストアが更新される", async () => {
        // FileUploadManagerのprocessSharedImageOnLaunchをモック
        const file = createMockFile();
        const metadata = { name: "test.jpg" };
        // @ts-ignore
        handler.fileUploadManager.processSharedImageOnLaunch = vi.fn().mockResolvedValue({
            success: true,
            data: { image: file, metadata }
        });
        const result = await handler.checkForSharedImageOnLaunch();
        expect(result.success).toBe(true);
        expect(appStore.updateSharedImageStore).toHaveBeenCalledWith(file, metadata);
    });

    it("isProcessingは初期状態でfalseを返す", () => {
        expect(handler.isProcessing()).toBe(false);
    });
});
