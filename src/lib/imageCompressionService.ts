import type { CompressionService, MimeTypeSupportInterface } from './types';
import { COMPRESSION_OPTIONS_MAP } from './constants';
import { uploadAbortFlagStore } from '../stores/uploadStore.svelte';
import { renameByMimeType } from './utils/fileUtils';
import { getImageCompressionLevelPreference } from './utils/settingsStorage';
import { showCompressedImagePreview } from './debug';

type ImageCompressionLevel = keyof typeof COMPRESSION_OPTIONS_MAP;

const WEBP_MIME_TYPE = "image/webp";
const DEFAULT_WEBP_QUALITY = 0.8;

let imageCompressionModulePromise: Promise<typeof import("browser-image-compression")> | null = null;

const IMAGE_COMPRESSION_TARGET_RATIO_MAP: Partial<Record<ImageCompressionLevel, number>> = {
    low: 0.9,
    medium: 0.75,
    high: 0.6,
};

async function loadImageCompression() {
    if (!imageCompressionModulePromise) {
        imageCompressionModulePromise = import("browser-image-compression");
    }

    const module = await imageCompressionModulePromise;
    return module.default;
}

// --- 画像圧縮サービス ---
export class ImageCompressionService implements CompressionService {
    private onProgress?: (progress: number) => void;

    constructor(
        private mimeSupport: MimeTypeSupportInterface,
        private localStorage: Storage
    ) { }

    /**
     * 圧縮処理を中止（グローバルフラグで管理）
     */
    public abort(): void {
        const isDev = import.meta.env.DEV;
        if (isDev) console.log('[ImageCompressionService] Abort requested');

        if (this.onProgress) {
            this.onProgress(0);
        }
    }

    /**
     * 進捗コールバックを設定
     */
    public setProgressCallback(callback?: (progress: number) => void): void {
        this.onProgress = callback;
    }

    private getCompressionLevel(): ImageCompressionLevel {
        const normalizedLevel = getImageCompressionLevelPreference(this.localStorage);
        return normalizedLevel in COMPRESSION_OPTIONS_MAP
            ? normalizedLevel as ImageCompressionLevel
            : "medium";
    }

    private getCompressionOptions(level: ImageCompressionLevel = this.getCompressionLevel()): Record<string, unknown> | null {
        const opt = COMPRESSION_OPTIONS_MAP[level];
        if (typeof opt === "object" && opt && "skip" in opt && opt.skip) {
            return null;
        }
        return opt ? { ...opt, preserveExif: false } : null;
    }

    private getTargetMaxSizeMB(fileSize: number, level: ImageCompressionLevel): number | undefined {
        const ratio = IMAGE_COMPRESSION_TARGET_RATIO_MAP[level];
        if (!ratio) {
            return undefined;
        }

        const targetBytes = Math.floor(Math.min(fileSize * ratio, fileSize - 1024));
        if (targetBytes <= 0) {
            return undefined;
        }

        return targetBytes / (1024 * 1024);
    }

    private getWebpQuality(options: Record<string, unknown>): number {
        const quality = typeof options.initialQuality === "number"
            ? options.initialQuality
            : DEFAULT_WEBP_QUALITY;

        return Math.round(Math.min(Math.max(quality, 0), 1) * 100);
    }

    private createReadableCanvas(width: number, height: number): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) {
            throw new Error("Failed to create canvas context for WebP transcoding");
        }

        return { canvas, context };
    }

    private async loadImageData(file: Blob): Promise<ImageData> {
        const url = URL.createObjectURL(file);

        try {
            const image = await new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new window.Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error("Failed to load image for WebP transcoding"));
                img.src = url;
            });

            const { canvas, context } = this.createReadableCanvas(
                image.naturalWidth || image.width,
                image.naturalHeight || image.height,
            );

            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            return context.getImageData(0, 0, canvas.width, canvas.height);
        } finally {
            URL.revokeObjectURL(url);
        }
    }

    private async tryTranscodeToWebp(file: Blob, originalName: string, options: Record<string, unknown>): Promise<File | null> {
        try {
            const imageData = await this.loadImageData(file);
            const { encode } = await import("@jsquash/webp");
            const encoded = await encode(imageData, {
                quality: this.getWebpQuality(options),
            });

            return new File([encoded], renameByMimeType(originalName, WEBP_MIME_TYPE), {
                type: WEBP_MIME_TYPE,
            });
        } catch (error) {
            console.warn("[ImageCompressionService] WebP fallback transcoding failed:", error);
            return null;
        }
    }

    public hasCompressionSettings(): boolean {
        return this.getCompressionOptions() !== null;
    }

    async compress(file: File): Promise<{ file: File; wasCompressed: boolean; wasSkipped?: boolean; aborted?: boolean }> {
        if (uploadAbortFlagStore.value) {
            return { file, wasCompressed: false, aborted: true };
        }

        if (!file.type.startsWith("image/")) return { file, wasCompressed: false };
        if (file.size <= 20 * 1024) return { file, wasCompressed: false, wasSkipped: true };

        const level = this.getCompressionLevel();
        const options = this.getCompressionOptions(level);
        if (!options) return { file, wasCompressed: false, wasSkipped: true };

        const maxSizeMB = this.getTargetMaxSizeMB(file.size, level);

        const requestedTargetMime = (options.fileType as string) || file.type;

        let usedOptions: Record<string, unknown> = {
            ...options,
            ...(maxSizeMB ? { maxSizeMB } : {}),
            onProgress: (progress: number) => {
                if (this.onProgress) {
                    this.onProgress(Math.round(progress * 100));
                }
            }
        };

        if (usedOptions.fileType === WEBP_MIME_TYPE) {
            const webpSupported = this.mimeSupport.canEncodeMimeType(WEBP_MIME_TYPE);
            if (!webpSupported) {
                usedOptions.fileType = file.type === "image/png" ? "image/png" : "image/jpeg";
            }
        }

        if (uploadAbortFlagStore.value) {
            return { file, wasCompressed: false, aborted: true };
        }

        let targetMime: string = (usedOptions.fileType as string) || file.type;
        if (!this.mimeSupport.canEncodeMimeType(targetMime)) {
            targetMime = file.type;
            delete usedOptions.fileType;
        }

        try {
            const imageCompression = await loadImageCompression();
            const compressed = await imageCompression(file, usedOptions as Parameters<typeof imageCompression>[1]);
            const compressedBlob = compressed as Blob;

            if (uploadAbortFlagStore.value) {
                if (this.onProgress) {
                    this.onProgress(0);
                }
                return { file, wasCompressed: false, aborted: true };
            }

            let finalCompressedFile: Blob | File = compressedBlob;
            if (requestedTargetMime === WEBP_MIME_TYPE && compressedBlob.type !== WEBP_MIME_TYPE) {
                const webpFallbackFile = await this.tryTranscodeToWebp(compressedBlob, file.name, options);
                if (webpFallbackFile) {
                    finalCompressedFile = webpFallbackFile;
                }
            }

            if (finalCompressedFile.size >= file.size) {
                return { file, wasCompressed: false };
            }

            const outType = finalCompressedFile.type || (usedOptions.fileType as string) || targetMime || file.type;
            const outName = renameByMimeType(file.name, outType);
            const outFile = new File([finalCompressedFile], outName, { type: outType });

            showCompressedImagePreview(outFile);
            return { file: outFile, wasCompressed: true };
        } catch (error) {
            if (uploadAbortFlagStore.value) {
                if (this.onProgress) {
                    this.onProgress(0);
                }
                return { file, wasCompressed: false, aborted: true };
            }

            console.warn("[ImageCompressionService] Compression failed:", error);
            return { file, wasCompressed: false, wasSkipped: true };
        }
    }
}
