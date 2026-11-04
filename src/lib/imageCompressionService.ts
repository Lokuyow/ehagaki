import { inspectWebp } from './utils/webpContainer';
import type { CompressionService, MimeTypeSupportInterface } from './types';
import { COMPRESSION_OPTIONS_MAP, IMAGE_RESIZE_LIMITS } from './constants';
import { renameByMimeType } from './utils/fileUtils';
import { getImageCompressionLevelPreference } from './utils/settingsStorage';
import { showCompressedImagePreview } from './debug';
import { isDefaultUploadAborted } from './uploadAbortUtils';
import { awaitUploadOperation, createUploadAbortError } from './upload/uploadOperation';

/** Bounds generated images, not originals returned by skip/failure/size comparison. */
export function calculateImageResizeDimensions(width: number, height: number, maxShortEdge: number) {
    if (![width, height, maxShortEdge].every(value => Number.isFinite(value) && value > 0)) {
        throw new Error('Invalid image dimensions');
    }
    const scale = Math.min(1, maxShortEdge / Math.min(width, height),
        Math.sqrt(IMAGE_RESIZE_LIMITS.maxPixels / (width * height)),
        IMAGE_RESIZE_LIMITS.maxLongEdge / Math.max(width, height));
    return { width: Math.max(1, Math.floor(width * scale)), height: Math.max(1, Math.floor(height * scale)) };
}

export class ImageCompressionService implements CompressionService {
    private onProgress?: (progress: number) => void;
    constructor(
        private mimeSupport: MimeTypeSupportInterface,
        private localStorage: Storage,
        private isUploadAborted: () => boolean = isDefaultUploadAborted,
    ) {}

    public abort(): void { this.onProgress?.(0); }
    public setProgressCallback(callback?: (progress: number) => void): void { this.onProgress = callback; }
    private getCompressionOptions() {
        const level = getImageCompressionLevelPreference(this.localStorage);
        const options = COMPRESSION_OPTIONS_MAP[level as keyof typeof COMPRESSION_OPTIONS_MAP] ?? COMPRESSION_OPTIONS_MAP.medium;
        return 'skip' in options ? null : options;
    }
    public hasCompressionSettings(): boolean { return this.getCompressionOptions() !== null; }

    async compress(file: File, operation?: { signal?: AbortSignal }): ReturnType<CompressionService["compress"]> {
        const isAborted = () => !!operation?.signal?.aborted || this.isUploadAborted();
        const check = () => { if (isAborted()) throw createUploadAbortError(); };
        const original = { file, wasCompressed: false };
        if (isAborted()) return { ...original, aborted: true };
        if (!file.type.startsWith('image/')) return original;
        const options = this.getCompressionOptions();
        if (!options || file.type === 'image/gif' || file.size <= 20 * 1024) {
            return { ...original, wasSkipped: true };
        }

        let image: HTMLImageElement | undefined;
        let url: string | undefined;
        let canvas: HTMLCanvasElement | undefined;
        try {
            if (file.type === 'image/webp') {
                const kind = await inspectWebp(file, operation?.signal);
                check();
                if (kind !== 'static') return { ...original, wasSkipped: true };
            }
            this.onProgress?.(5);
            check();
            image = new window.Image();
            const loaded = new Promise<void>((resolve, reject) => {
                image!.onload = () => resolve();
                image!.onerror = () => reject(new Error('Failed to decode image'));
            });
            url = URL.createObjectURL(file);
            image.src = url;
            await awaitUploadOperation(loaded, operation?.signal);
            check();
            // Supported browsers decode EXIF orientation before exposing natural dimensions/drawing.
            const dimensions = calculateImageResizeDimensions(image.naturalWidth, image.naturalHeight, options.maxShortEdge);
            canvas = document.createElement('canvas');
            canvas.width = dimensions.width;
            canvas.height = dimensions.height;
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Failed to create image canvas');
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            context.drawImage(image, 0, 0, dimensions.width, dimensions.height);
            this.onProgress?.(40);
            check();

            const encodeNative = async (mime: string): Promise<Blob | null> => {
                try {
                    const blob = await awaitUploadOperation(new Promise<Blob | null>((resolve) => {
                        canvas!.toBlob(resolve, mime, options.quality);
                    }), operation?.signal);
                    check();
                    return blob?.size && blob.type === mime ? blob : null;
                } catch (error) {
                    check();
                    return null;
                }
            };
            let encoded = this.mimeSupport.canEncodeMimeType('image/webp')
                ? await encodeNative('image/webp') : null;
            if (!encoded) {
                try {
                    const { encode } = await import('@jsquash/webp');
                    check();
                    const data = context.getImageData(0, 0, canvas.width, canvas.height);
                    const bytes = await awaitUploadOperation(encode(data, { quality: Math.round(options.quality * 100) }), operation?.signal);
                    check();
                    if (bytes.byteLength) encoded = new Blob([bytes], { type: 'image/webp' });
                } catch (error) {
                    check();
                    console.warn('[ImageCompressionService] WebP fallback failed:', error);
                }
            }
            check();
            if (!encoded) {
                const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                if (mime === 'image/jpeg') {
                    context.globalCompositeOperation = 'destination-over';
                    context.fillStyle = '#fff';
                    context.fillRect(0, 0, canvas.width, canvas.height);
                }
                encoded = await encodeNative(mime);
            }
            check();
            if (!encoded) throw new Error('Failed to encode image');
            this.onProgress?.(100);
            check();
            if (encoded.size >= file.size) return original;
            const output = new File([encoded], renameByMimeType(file.name, encoded.type), { type: encoded.type });
            if (!operation?.signal) showCompressedImagePreview(output);
            return { file: output, wasCompressed: true };
        } catch (error) {
            if (isAborted()) {
                this.onProgress?.(0);
                return { ...original, aborted: true };
            }
            console.warn('[ImageCompressionService] Compression failed:', error);
            return { ...original, wasSkipped: true };
        } finally {
            if (image) { image.onload = null; image.onerror = null; image.src = ''; }
            if (url) URL.revokeObjectURL(url);
            if (canvas) { canvas.width = 0; canvas.height = 0; }
        }
    }
}
