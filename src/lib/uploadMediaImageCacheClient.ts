import { getAppRuntimeEnvironment } from "./appRuntimeEnvironment";
import {
    UPLOAD_MEDIA_IMAGE_CACHE_VERSION, UPLOAD_MEDIA_IMAGE_EVICT_MESSAGE,
    UPLOAD_MEDIA_IMAGE_SUPPORT_MESSAGE,
    UPLOAD_MEDIA_IMAGE_CACHE_POLICY,
} from "./uploadMediaImageCachePolicy";

function getController(): ServiceWorker | null {
    const runtime = getAppRuntimeEnvironment();
    return runtime.serviceWorkerEnabled ? runtime.window?.navigator.serviceWorker?.controller ?? null : null;
}
function message(controller: ServiceWorker, data: Record<string, unknown>): Promise<unknown> {
    const channel = new MessageChannel();
    return new Promise((resolve) => {
        const finish = (value: unknown) => { clearTimeout(timer); channel.port1.close(); resolve(value); };
        const timer = setTimeout(() => finish(null), 1500);
        channel.port1.onmessage = (event: MessageEvent<unknown>) => finish(event.data);
        channel.port1.onmessageerror = () => finish(null);
        try { controller.postMessage(data, [channel.port2]); } catch { finish(null); }
    });
}
function record(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}
let checkedController: ServiceWorker | null = null;
let support: Promise<boolean> | null = null;
export async function supportsUploadMediaImageCache(): Promise<boolean> {
    const controller = getController();
    if (!controller) { checkedController = null; support = null; return false; }
    if (controller !== checkedController || !support) {
        checkedController = controller;
        support = message(controller, { type: UPLOAD_MEDIA_IMAGE_SUPPORT_MESSAGE }).then((value) =>
            record(value) && value.version === UPLOAD_MEDIA_IMAGE_CACHE_VERSION && value.supported === true,
        );
    }
    return await support;
}
export async function evictUploadMediaImages(urls: string[]): Promise<boolean> {
    if (!urls.length) return true;
    const controller = getController();
    if (!controller) return false;
    const keys = [...new Set(urls)];
    let success = true;
    for (let index = 0; index < keys.length; index += UPLOAD_MEDIA_IMAGE_CACHE_POLICY.maxEntries) {
        const value = await message(controller, { type: UPLOAD_MEDIA_IMAGE_EVICT_MESSAGE,
            urls: keys.slice(index, index + UPLOAD_MEDIA_IMAGE_CACHE_POLICY.maxEntries) });
        success = record(value) && value.version === UPLOAD_MEDIA_IMAGE_CACHE_VERSION && value.success === true && success;
    }
    return success;
}
