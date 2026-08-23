import { VIDEO_COMPRESSION_OPTIONS_MAP } from '../constants';
import type { VideoCompressionResult, VideoCompressionLevel } from '../types';
import { isDefaultUploadAborted } from '../uploadAbortUtils';
import { getVideoCompressionLevelPreference } from '../utils/settingsStorage';
import { devLog, isFileTooSmall, isVideoFile, shouldSkipCompression } from './compressionUtils';
import type { MediaBunnyCompression } from './mediabunnyCompression';

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
        devLog(this.context, 'Abort requested');
        this.onProgress?.(0);
        this.mediabunnyCompression?.abort();
    }

    public setProgressCallback(callback?: (progress: number) => void): void {
        this.onProgress = callback;
        this.mediabunnyCompression?.setProgressCallback(callback);
    }

    private getCompressionOptions(): any {
        const level = getVideoCompressionLevelPreference(this.localStorage) as VideoCompressionLevel;
        const options = VIDEO_COMPRESSION_OPTIONS_MAP[level];
        return typeof options === 'object' && options && 'skip' in options && options.skip ? null : options ?? null;
    }

    public hasCompressionSettings(): boolean {
        return this.getCompressionOptions() !== null;
    }

    public async compress(file: File): Promise<VideoCompressionResult> {
        if (!isVideoFile(file)) return { file, wasCompressed: false };
        if (isFileTooSmall(file)) return { file, wasCompressed: false, wasSkipped: true };
        const options = this.getCompressionOptions();
        if (shouldSkipCompression(options, this.context)) return { file, wasCompressed: false, wasSkipped: true };
        if (this.isUploadAborted()) {
            this.onProgress?.(0);
            return { file, wasCompressed: false, wasSkipped: true, aborted: true };
        }

        try {
            await this.ensureInitialized();
            return await this.mediabunnyCompression!.compressWithMediabunny(file, options);
        } catch (error) {
            console.error('[VideoCompressionService] Compression failed:', error);
            return { file, wasCompressed: false, wasSkipped: true };
        }
    }

    public async cleanup(): Promise<void> {
        await this.mediabunnyCompression?.cleanup();
    }
}
