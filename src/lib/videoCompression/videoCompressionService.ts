import type { VideoCompressionResult } from '../types';
import { isDefaultUploadAborted } from '../uploadAbortUtils';
import { getVideoCompressionLevelPreference } from '../utils/settingsStorage';
import type { MediaBunnyCompression } from './mediabunnyCompression';
import {
    MIN_VIDEO_COMPRESSION_FILE_SIZE_BYTES,
    VIDEO_COMPRESSION_OPTIONS_MAP,
    isEnabledVideoCompressionOptions,
    type EnabledVideoCompressionOptions,
} from './videoCompressionConfig';

export class VideoCompressionService {
    private readonly context = 'VideoCompressionService';
    private mediabunnyCompression: MediaBunnyCompression | null = null;
    private initPromise: Promise<void> | null = null;
    private onProgress?: (progress: number) => void;

    constructor(
        private localStorage: Storage,
        private isUploadAborted: () => boolean = isDefaultUploadAborted,
    ) { }

    private async ensureInitialized(): Promise<void> {
        if (this.mediabunnyCompression) return;
        if (!this.initPromise) {
            this.initPromise = import('./mediabunnyCompression').then(({ MediaBunnyCompression }) => {
                this.mediabunnyCompression = new MediaBunnyCompression(this.isUploadAborted);
                this.mediabunnyCompression.setProgressCallback(this.onProgress);
            });
        }
        await this.initPromise;
    }

    public abort(): void {
        if (import.meta.env.DEV) console.log(`[${this.context}] Abort requested`);
        this.onProgress?.(0);
        this.mediabunnyCompression?.abort();
    }

    public setProgressCallback(callback?: (progress: number) => void): void {
        this.onProgress = callback;
        this.mediabunnyCompression?.setProgressCallback(callback);
    }

    private getCompressionOptions(): EnabledVideoCompressionOptions | null {
        const level = getVideoCompressionLevelPreference(this.localStorage);
        const options = VIDEO_COMPRESSION_OPTIONS_MAP[level];
        return isEnabledVideoCompressionOptions(options) ? options : null;
    }

    public hasCompressionSettings(): boolean {
        return this.getCompressionOptions() !== null;
    }

    public async compress(file: File): Promise<VideoCompressionResult> {
        if (!file.type.startsWith('video/')) return { file, wasCompressed: false };
        if (file.size <= MIN_VIDEO_COMPRESSION_FILE_SIZE_BYTES) {
            return { file, wasCompressed: false, wasSkipped: true };
        }
        const options = this.getCompressionOptions();
        if (!options) return { file, wasCompressed: false, wasSkipped: true };
        if (this.isUploadAborted()) {
            this.onProgress?.(0);
            return { file, wasCompressed: false, wasSkipped: true, aborted: true };
        }

        try {
            await this.ensureInitialized();
            const compression = this.mediabunnyCompression;
            if (!compression) throw new Error('MediaBunny compression did not initialize.');
            return await compression.compress(file, options);
        } catch (error) {
            console.error('[VideoCompressionService] Compression failed:', error);
            return { file, wasCompressed: false, wasSkipped: true };
        }
    }

    public async cleanup(): Promise<void> {
        await this.mediabunnyCompression?.cleanup();
    }
}
