import { inspectWebp, type WebpKind } from '../utils/webpContainer';
import type { CompressionService, VideoCompressionResult } from '../types/upload';
import { awaitUploadOperation, throwIfUploadAborted } from './uploadOperation';

export const REACTION_WEBP_OPTIONS = { lossless: 1, quality: 100, near_lossless: 100, alpha_quality: 100 } as const;
const supported = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const unsupported = () => new Error('reactionUnsupportedImage');

/** GIF and animated WebP are validated and sent unchanged. */
export async function validateReactionImage(file: File, signal?: AbortSignal): Promise<WebpKind | undefined> {
    if (!supported.has(file.type)) throw unsupported();
    if (file.type === 'image/webp') {
        const kind = await inspectWebp(file, signal);
        if (kind === 'invalid') throw unsupported();
        return kind;
    }
    const bytes = new Uint8Array(await (file.type === 'image/gif' ? file.slice(0, 13) : file).arrayBuffer());
    const view = new DataView(bytes.buffer);
    const ascii = (offset: number, size: number) => String.fromCharCode(...bytes.subarray(offset, offset + size));
    if (file.type === 'image/gif') {
        if (bytes.length < 13 || !['GIF87a', 'GIF89a'].includes(ascii(0, 6))
            || view.getUint16(6, true) === 0 || view.getUint16(8, true) === 0) throw unsupported();
        return;
    }
    if (file.type === 'image/jpeg') {
        if (bytes.length < 4 || bytes[0] !== 255 || bytes[1] !== 216 || bytes[2] !== 255) throw unsupported();
        return;
    }
    if (file.type === 'image/png') {
        if (bytes.length < 33 || ![137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v)) throw unsupported();
        let position = 8;
        let ended = false;
        while (position + 12 <= bytes.length) {
            const size = view.getUint32(position);
            const type = ascii(position + 4, 4);
            if (position + 12 + size > bytes.length || type === 'acTL' || type === 'fcTL' || type === 'fdAT') throw unsupported();
            if (position === 8 && (type !== 'IHDR' || size !== 13)) throw unsupported();
            position += size + 12;
            if (type === 'IEND') { ended = true; break; }
        }
        if (!ended || position !== bytes.length) throw unsupported();
        return;
    }

}

export function getReactionResizeDimensions(width: number, height: number) {
    if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0)
        throw new Error('reactionImageTransformFailed');
    const scale = Math.min(1, 128 / Math.min(width, height));
    return { width: Math.max(1, Math.floor(width * scale)), height: Math.max(1, Math.floor(height * scale)) };
}

export class ReactionImageCompressionService implements CompressionService {
    private progress?: (value: number) => void;
    constructor(private readonly operation: { signal: AbortSignal; abort: () => void }) {}
    setProgressCallback(callback?: (value: number) => void): void { this.progress = callback; }
    hasCompressionSettings(): boolean { return true; }
    abort(): void { this.operation.abort(); }

    async compress(file: File, options?: { signal?: AbortSignal }): Promise<VideoCompressionResult> {
        const signal = options?.signal ?? this.operation.signal;
        const check = () => { throwIfUploadAborted(signal); throwIfUploadAborted(this.operation.signal); };
        let image: HTMLImageElement | undefined;
        let url: string | undefined;
        try {
            check(); this.progress?.(0);
            const kind = await awaitUploadOperation(validateReactionImage(file, signal), signal);
            check();
            image = new Image();
            const loaded = new Promise<void>((resolve, reject) => {
                image!.onload = () => resolve();
                image!.onerror = () => reject(new Error('reactionImageTransformFailed'));
            });
            url = URL.createObjectURL(file);
            image.src = url;
            await awaitUploadOperation(loaded, signal);
            check(); this.progress?.(25);
            if (file.type === 'image/gif' || kind === 'animated') {
                this.progress?.(100);
                return { file, wasCompressed: false, wasSkipped: true };
            }
            const dimensions = getReactionResizeDimensions(image.naturalWidth, image.naturalHeight);
            if (dimensions.width === image.naturalWidth && dimensions.height === image.naturalHeight) {
                this.progress?.(100);
                return { file, wasCompressed: false, wasSkipped: true };
            }
            const canvas = document.createElement('canvas');
            canvas.width = dimensions.width; canvas.height = dimensions.height;
            const context = canvas.getContext('2d', { willReadFrequently: file.type === 'image/webp' });
            if (!context) throw new Error('reactionImageTransformFailed');
            context.drawImage(image, 0, 0, dimensions.width, dimensions.height);
            check(); this.progress?.(50);
            let blob: Blob;
            if (file.type === 'image/webp') {
                const { default: encode } = await awaitUploadOperation(import('@jsquash/webp/encode'), signal);
                check();
                const encoded = await awaitUploadOperation(encode(context.getImageData(0, 0, dimensions.width, dimensions.height), REACTION_WEBP_OPTIONS), signal);
                blob = new Blob([encoded], { type: 'image/webp' });
            } else {
                blob = await awaitUploadOperation(new Promise<Blob>((resolve, reject) => {
                    canvas.toBlob(value => value && value.type === file.type && value.size > 0 ? resolve(value)
                        : reject(new Error('reactionImageTransformFailed')), file.type, 1);
                }), signal);
            }
            if (!blob.size || blob.type !== file.type) throw new Error('reactionImageTransformFailed');
            const output = new File([blob], file.name, { type: file.type });
            await awaitUploadOperation(validateReactionImage(output).catch(() => {
                throw new Error('reactionImageTransformFailed');
            }), signal);
            check(); this.progress?.(100);
            return { file: output, wasCompressed: true };
        } catch (error) {
            if (signal.aborted || this.operation.signal.aborted) return { file, wasCompressed: false, aborted: true };
            throw error instanceof Error && error.message === 'reactionUnsupportedImage' ? error : new Error('reactionImageTransformFailed');
        } finally {
            if (image) { image.onload = null; image.onerror = null; image.src = ''; }
            if (url) URL.revokeObjectURL(url);
        }
    }
}
