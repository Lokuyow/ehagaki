/// <reference lib="webworker" />
import { encode } from "@jsquash/webp";

import type {
    ImageWebpEncodeWorkerRequest,
    ImageWebpEncodeWorkerResponse,
} from "./imageWebpEncodeWorkerProtocol";

function send(message: ImageWebpEncodeWorkerResponse): void {
    self.postMessage(message);
}

self.addEventListener("message", (message: MessageEvent<ImageWebpEncodeWorkerRequest>) => {
    const request = message.data;
    if (request?.type !== "encode") {
        return;
    }

    // The encoder only reads data/width/height, so a plain object avoids
    // depending on the ImageData constructor inside the worker.
    const pixels = {
        data: new Uint8ClampedArray(request.pixels),
        width: request.width,
        height: request.height,
    } as ImageData;

    void encode(pixels, { quality: request.quality })
        .then((bytes) => send({ type: "complete", bytes }))
        .catch((error: unknown) => send({
            type: "error",
            message: error instanceof Error ? error.message : "image_webp_encode_worker_failed",
        }));
});

export {};
