import imageCompression from "browser-image-compression";
import type { CompressionService, MimeTypeSupportInterface } from './types';
import { COMPRESSION_OPTIONS_MAP } from './constants';
import { uploadAbortFlagStore } from '../stores/appStore.svelte';
import { renameByMimeType } from './utils/appUtils';
import { showCompressedImagePreview } from './debug';

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

    private getCompressionOptions(): Record<string, unknown> | null {
        const level = (this.localStorage.getItem("imageCompressionLevel") || "medium") as keyof typeof COMPRESSION_OPTIONS_MAP;
        const opt = COMPRESSION_OPTIONS_MAP[level];
        if (typeof opt === "object" && opt && "skip" in opt && opt.skip) {
            return null;
        }
        return opt ? { ...opt, preserveExif: false } : null;
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

        const options = this.getCompressionOptions();
        if (!options) return { file, wasCompressed: false, wasSkipped: true };

        let usedOptions: Record<string, unknown> = {
            ...options,
            onProgress: (progress: number) => {
                if (this.onProgress) {
                    this.onProgress(Math.round(progress * 100));
                }
            }
        };

        if (usedOptions.fileType === "image/webp") {
            const webpSupported = await this.mimeSupport.canEncodeWebpWithQuality();
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
            const compressed = await imageCompression(file, usedOptions as Parameters<typeof imageCompression>[1]);

            if (uploadAbortFlagStore.value) {
                if (this.onProgress) {
                    this.onProgress(0);
                }
                return { file, wasCompressed: false, aborted: true };
            }

            if ((compressed as File).size >= file.size) {
                return { file, wasCompressed: false };
            }

            const outType = (usedOptions.fileType as string) || (compressed as File).type || targetMime || file.type;
            const outName = renameByMimeType(file.name, outType);
            const outFile = new File([compressed], outName, { type: outType });

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
