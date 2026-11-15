export interface ImageWebpEncodeWorkerRequest {
    type: "encode";
    /** RGBA pixels; transferred to the worker. */
    pixels: ArrayBuffer;
    width: number;
    height: number;
    /** libwebp quality, 0..100. */
    quality: number;
}

export type ImageWebpEncodeWorkerResponse =
    | { type: "complete"; bytes: ArrayBuffer }
    | { type: "error"; message: string };
