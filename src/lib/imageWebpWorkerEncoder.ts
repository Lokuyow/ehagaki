import { createUploadAbortError } from "./upload/uploadOperation";
import type {
    ImageWebpEncodeWorkerRequest,
    ImageWebpEncodeWorkerResponse,
} from "./imageWebpEncodeWorkerProtocol";

/** The subset of Worker this module drives; kept structural so tests can supply a fake. */
export interface ImageWebpEncodeWorker {
    postMessage(message: ImageWebpEncodeWorkerRequest, transfer: Transferable[]): void;
    terminate(): void;
    onmessage: ((event: MessageEvent<ImageWebpEncodeWorkerResponse>) => void) | null;
    onerror: ((event: ErrorEvent) => void) | null;
    onmessageerror: ((event: MessageEvent) => void) | null;
}
export type ImageWebpEncodeWorkerFactory = () => ImageWebpEncodeWorker;

/**
 * Returns null where workers do not exist. Construction can still throw (for
 * example a cross-origin Web Component host) or fail to load (no module worker
 * support); callers fall back to main-thread encoding in both cases.
 */
export function getDefaultImageWebpEncodeWorkerFactory(): ImageWebpEncodeWorkerFactory | null {
    if (typeof Worker === "undefined") return null;
    return () => new Worker(
        new URL("./imageWebpEncodeWorker.ts", import.meta.url),
        { type: "module" },
    );
}

/**
 * Encodes RGBA pixels to WebP off the main thread. The pixel buffer is
 * transferred, so `imageData` is unusable afterwards. Rejects with an upload
 * abort error when `signal` aborts; any other rejection means the worker path
 * is unavailable or failed.
 */
export function encodeWebpInWorker(
    workerFactory: ImageWebpEncodeWorkerFactory,
    imageData: ImageData,
    quality: number,
    signal?: AbortSignal,
): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(createUploadAbortError());
            return;
        }

        let worker: ImageWebpEncodeWorker;
        try {
            worker = workerFactory();
        } catch (error) {
            reject(error);
            return;
        }

        let settled = false;
        const settle = (finish: () => void) => {
            if (settled) return;
            settled = true;
            worker.onmessage = null;
            worker.onerror = null;
            worker.onmessageerror = null;
            signal?.removeEventListener("abort", onAbort);
            worker.terminate();
            finish();
        };
        const onAbort = () => settle(() => reject(createUploadAbortError()));

        worker.onmessage = (event: MessageEvent<ImageWebpEncodeWorkerResponse>) => {
            const response = event.data;
            if (response?.type === "complete") {
                settle(() => resolve(response.bytes));
            } else {
                settle(() => reject(new Error(
                    response?.type === "error" ? response.message : "image_webp_encode_worker_failed",
                )));
            }
        };
        worker.onerror = (event) => {
            event.preventDefault?.();
            settle(() => reject(new Error("image_webp_encode_worker_unavailable")));
        };
        worker.onmessageerror = () => {
            settle(() => reject(new Error("image_webp_encode_worker_failed")));
        };
        signal?.addEventListener("abort", onAbort, { once: true });

        const pixels = imageData.data.buffer as ArrayBuffer;
        const request: ImageWebpEncodeWorkerRequest = {
            type: "encode",
            pixels,
            width: imageData.width,
            height: imageData.height,
            quality,
        };
        try {
            worker.postMessage(request, [pixels]);
        } catch (error) {
            settle(() => reject(error));
        }
    });
}
