import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { UPLOAD_MEDIA_IMAGE_SUPPORT_MESSAGE, UPLOAD_MEDIA_IMAGE_EVICT_MESSAGE } from "../../lib/uploadMediaImageCachePolicy";
const runtime = vi.hoisted(() => ({ serviceWorkerEnabled: true, controller: null as unknown }));
vi.mock("../../lib/appRuntimeEnvironment", () => ({ getAppRuntimeEnvironment: () => ({ serviceWorkerEnabled: runtime.serviceWorkerEnabled,
    window: { navigator: { serviceWorker: { controller: runtime.controller } } } }) }));
import { supportsUploadMediaImageCache, evictUploadMediaImages } from "../../lib/uploadMediaImageCacheClient";
class Channel {
    port1 = { onmessage: null as ((event: { data: unknown }) => void) | null, onmessageerror: null, close: vi.fn() };
    port2 = { deliver: (data: unknown) => queueMicrotask(() => this.port1.onmessage?.({ data })) };
}
function controller(version = 1, respond = true) {
    return { postMessage: vi.fn((data: { type: string; urls?: string[] }, ports: Channel["port2"][]) => {
        if (respond) ports[0].deliver({ version, supported: true, success: data.type === UPLOAD_MEDIA_IMAGE_EVICT_MESSAGE });
    }) };
}
beforeEach(() => { runtime.serviceWorkerEnabled = true; runtime.controller = controller(); vi.stubGlobal("MessageChannel", Channel); });
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });
describe("image cache SW client", () => {
    it("checks support once for each controller and refreshes it on worker replacement", async () => {
        const first = controller(); runtime.controller = first;
        expect(await supportsUploadMediaImageCache()).toBe(true); expect(await supportsUploadMediaImageCache()).toBe(true);
        expect(first.postMessage).toHaveBeenCalledExactlyOnceWith({ type: UPLOAD_MEDIA_IMAGE_SUPPORT_MESSAGE }, expect.any(Array));
        const second = controller(); runtime.controller = second;
        expect(await supportsUploadMediaImageCache()).toBe(true); expect(second.postMessage).toHaveBeenCalledTimes(1);
    });
    it("reports disabled, uncontrolled and old workers without sending eviction as a remote operation", async () => {
        runtime.serviceWorkerEnabled = false; expect(await supportsUploadMediaImageCache()).toBe(false);
        runtime.serviceWorkerEnabled = true; runtime.controller = null; expect(await supportsUploadMediaImageCache()).toBe(false);
        expect(await evictUploadMediaImages(["https://media.example/a.png"])).toBe(false);
        runtime.controller = controller(0); expect(await supportsUploadMediaImageCache()).toBe(false);
    });
    it("bounds missing worker replies and keeps cleanup failures independent", async () => {
        vi.useFakeTimers(); runtime.controller = controller(1, false);
        const result = evictUploadMediaImages(["https://media.example/a.png"]);
        await vi.advanceTimersByTimeAsync(1500); expect(await result).toBe(false);
    });
    it("deduplicates and cleans every URL across bounded message batches", async () => {
        const worker = controller(); runtime.controller = worker;
        const urls = Array.from({ length: 70 }, (_, index) => "https://media.example/" + index + ".png");
        expect(await evictUploadMediaImages([...urls, urls[0]])).toBe(true);
        expect(worker.postMessage.mock.calls.map(([data]) => data.urls?.length)).toEqual([64, 6]);
        expect(worker.postMessage.mock.calls.flatMap(([data]) => data.urls)).toEqual(urls);
    });
});
