import { uploadAbortFlagStore } from '../../stores/appStore.svelte';
import { VIDEO_COMPRESSION_OPTIONS_MAP } from '../constants';
import type { VideoCompressionResult, VideoCompressionLevel } from '../types';
import { MediaBunnyCompression, isMediaBunnySupported } from './mediabunnyCompression';
import { FFmpegCompression } from './ffmpegCompression';
import {
    devLog,
    shouldSkipCompression,
    isFileTooSmall,
    isVideoFile
} from './compressionUtils';

/**
 * 動画圧縮サービスクラス
 */
export class VideoCompressionService {
    private readonly context = 'VideoCompressionService';
    private mediabunnyCompression: MediaBunnyCompression;
    private ffmpegCompression: FFmpegCompression;
    private useMediabunny: boolean | null = null; // 遅延初期化
    private mediabunnyCheckPromise: Promise<boolean> | null = null;
    private onProgress?: (progress: number) => void;

    constructor(private localStorage: Storage) {
        this.ffmpegCompression = new FFmpegCompression();
        this.mediabunnyCompression = new MediaBunnyCompression(
            this.parseAudioBitrate.bind(this),
            this.ffmpegCompression.mergeVideoAndAudioWithFFmpeg.bind(this.ffmpegCompression),
            this.ffmpegCompression.compressWithFFmpeg.bind(this.ffmpegCompression)
        );
    }

    /**
     * MediaBunnyが使用可能かチェック（遅延初期化）
     */
    private async checkMediaBunnySupport(): Promise<boolean> {
        if (this.useMediabunny !== null) {
            return this.useMediabunny;
        }

        if (this.mediabunnyCheckPromise) {
            return this.mediabunnyCheckPromise;
        }

        this.mediabunnyCheckPromise = (async () => {
            const supported = await isMediaBunnySupported();
            this.useMediabunny = supported;
            devLog(this.context, `Using ${supported ? 'Mediabunny' : 'FFmpeg'} for compression`);
            return supported;
        })();

        return this.mediabunnyCheckPromise;
    }

    /**
     * 圧縮処理を中止（グローバルフラグで管理）
     */
    public abort(): void {
        devLog(this.context, 'Abort requested');

        // 進捗を0にリセット
        if (this.onProgress) {
            this.onProgress(0);
        }

        // 各圧縮クラスに中止を伝える
        this.mediabunnyCompression.abort();
        this.ffmpegCompression.abort();
    }

    /**
     * 進捗コールバックを設定
     */
    public setProgressCallback(callback?: (progress: number) => void): void {
        this.onProgress = callback;
        this.mediabunnyCompression.setProgressCallback(callback);
        this.ffmpegCompression.setProgressCallback(callback);
    }

    /**
     * 圧縮設定の取得
     */
    private getCompressionOptions(): any {
        const level = (this.localStorage.getItem('videoCompressionLevel') || 'medium') as VideoCompressionLevel;
        const opt = VIDEO_COMPRESSION_OPTIONS_MAP[level];

        if (typeof opt === 'object' && opt && 'skip' in opt && opt.skip) {
            return null;
        }

        return opt || null;
    }

    /**
     * 圧縮設定があるかチェック
     */
    public hasCompressionSettings(): boolean {
        return this.getCompressionOptions() !== null;
    }

    /**
     * オーディオビットレートを解析
     */
    private parseAudioBitrate(audioBitrate: any): number | null {
        if (typeof audioBitrate === 'number' && Number.isFinite(audioBitrate)) {
            return audioBitrate;
        }
        if (typeof audioBitrate === 'string') {
            const numeric = Number.parseInt(audioBitrate, 10);
            if (Number.isFinite(numeric) && numeric > 0) {
                return numeric * 1000;
            }
        }
        return null;
    }

    /**
     * 動画ファイルを圧縮
     */
    async compress(file: File): Promise<VideoCompressionResult> {
        // 動画ファイル以外はスキップ
        if (!isVideoFile(file)) {
            devLog(this.context, 'Skipping non-video file');
            return { file, wasCompressed: false };
        }

        // 小さいファイルはスキップ（200KB以下）
        if (isFileTooSmall(file)) {
            devLog(this.context, 'Skipping small video file');
            return { file, wasCompressed: false, wasSkipped: true };
        }

        // 圧縮設定を取得
        const options = this.getCompressionOptions();
        if (shouldSkipCompression(options, this.context)) {
            return { file, wasCompressed: false, wasSkipped: true };
        }

        // 中止チェック
        if (uploadAbortFlagStore.value) {
            devLog(this.context, 'Compression aborted');
            if (this.onProgress) {
                this.onProgress(0);
            }
            return { file, wasCompressed: false, wasSkipped: true, aborted: true };
        }

        try {
            // MediaBunnyが使用可能かチェック
            const useMediabunny = await this.checkMediaBunnySupport();

            if (useMediabunny) {
                devLog(this.context, 'Attempting compression with MediaBunny');
                const result = await this.mediabunnyCompression.compressWithMediabunny(file, options);

                // MediaBunnyが失敗した場合、FFmpegにフォールバック
                if (!result.wasCompressed && !result.wasSkipped) {
                    devLog(this.context, 'MediaBunny failed, falling back to FFmpeg');
                    return await this.ffmpegCompression.compressWithFFmpeg(file, options);
                }

                return result;
            } else {
                devLog(this.context, 'Using FFmpeg for compression');
                return await this.ffmpegCompression.compressWithFFmpeg(file, options);
            }
        } catch (error) {
            console.error('[VideoCompressionService] Compression failed:', error);
            return { file, wasCompressed: false, wasSkipped: true };
        }
    }

    /**
     * リソースのクリーンアップ
     */
    async cleanup(): Promise<void> {
        await this.ffmpegCompression.cleanup();
        await this.mediabunnyCompression.cleanup();
    }
}