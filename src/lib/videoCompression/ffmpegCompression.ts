import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { uploadAbortFlagStore } from '../../stores/appStore.svelte';
import type { VideoCompressionResult } from '../types';
import { BaseCompression } from './baseCompression';
import { createCompressedFile, devLog, devWarn } from './compressionUtils';

/**
 * FFmpegを使用した動画圧縮クラス
 */
export class FFmpegCompression extends BaseCompression {
    private ffmpeg: FFmpeg | null = null;
    private isLoaded = false;
    private loadPromise: Promise<void> | null = null;
    private isCompressing = false;

    constructor() {
        super('FFmpegCompression');
    }

    /**
     * 圧縮処理を中止
     */
    public abort(): void {
        this.log('Abort requested');
        this.resetProgress();

        // FFmpegが実行中の場合は終了させる
        if (this.ffmpeg && this.isCompressing) {
            this.log('Terminating FFmpeg');
            try {
                this.ffmpeg.terminate();
            } catch (error) {
                devWarn(this.context, 'Error terminating FFmpeg:', error);
            }
        }
    }

    /**
     * FFmpegのロード（シングルスレッド版）
     */
    private async loadFFmpeg(): Promise<void> {
        if (this.isLoaded) return;
        if (this.loadPromise) return this.loadPromise;

        this.loadPromise = (async () => {
            this.log('Loading FFmpeg from node_modules');

            this.ffmpeg = new FFmpeg();

            this.ffmpeg.on('log', ({ message }) => {
                console.log('[FFmpeg]', message);
            });

            this.ffmpeg.on('progress', ({ progress }) => {
                this.updateProgress(progress * 100);
            });

            try {
                // Viteの静的アセットimportを使用
                const base = import.meta.env.BASE_URL || '/';
                const baseURL = new URL(base, window.location.origin).href;
                const coreURL = new URL('ffmpeg-core/ffmpeg-core.js', baseURL).href;
                const wasmURL = new URL('ffmpeg-core/ffmpeg-core.wasm', baseURL).href;

                this.log('Base URL:', baseURL);
                this.log('Core URL:', coreURL);
                this.log('WASM URL:', wasmURL);

                await this.ffmpeg.load({ coreURL, wasmURL });
                this.isLoaded = true;
                this.log('FFmpeg loaded successfully');
            } catch (error) {
                devWarn(this.context, 'Failed to load FFmpeg:', error);
                throw error;
            }
        })();

        return this.loadPromise;
    }

    /**
     * Mediabunny出力と元動画のオーディオをFFmpegでマージ
     */
    public async mergeVideoAndAudioWithFFmpeg(videoBlob: Blob, originalFile: File): Promise<Blob | null> {
        const videoInputName = 'mediabunny-video.mp4';
        const audioInputName = 'mediabunny-audio-source.mp4';
        const outputName = 'mediabunny-merged.mp4';

        const runCleanup = async (instance: FFmpeg | null | undefined) => {
            if (!instance) return;
            const targets = [videoInputName, audioInputName, outputName];
            for (const target of targets) {
                try {
                    await instance.deleteFile(target);
                } catch {
                    // 無視
                }
            }
        };

        try {
            if (uploadAbortFlagStore.value) {
                this.log('Abort detected before audio mux');
                return null;
            }

            await this.loadFFmpeg();
            const ffmpegInstance = this.ffmpeg;
            if (!ffmpegInstance) {
                devWarn(this.context, 'FFmpeg instance unavailable for audio mux');
                return null;
            }

            await ffmpegInstance.writeFile(videoInputName, await fetchFile(videoBlob));
            await ffmpegInstance.writeFile(audioInputName, await fetchFile(originalFile));

            const args = [
                '-i', videoInputName,
                '-i', audioInputName,
                '-map', '0:v:0',
                '-map', '1:a:0',
                '-c:v', 'copy',
                '-c:a', 'copy',
                '-movflags', '+faststart',
                '-shortest',
                '-y', outputName,
            ];

            this.log('Executing FFmpeg audio mux with args:', args);

            this.isCompressing = true;
            await ffmpegInstance.exec(args);

            if (uploadAbortFlagStore.value) {
                this.log('Abort detected during audio mux');
                await runCleanup(ffmpegInstance);
                return null;
            }

            const mergedData = await ffmpegInstance.readFile(outputName);
            const mergedBlob = new Blob([mergedData as BlobPart], { type: 'video/mp4' });

            await runCleanup(ffmpegInstance);
            return mergedBlob;
        } catch (error) {
            if (uploadAbortFlagStore.value) {
                this.log('Audio mux aborted, returning null');
            } else {
                devWarn(this.context, 'Failed to mux audio with FFmpeg copy:', error);
            }
            await runCleanup(this.ffmpeg);
            return null;
        } finally {
            this.isCompressing = false;
        }
    }

    /**
     * FFmpegコマンドライン引数を構築
     */
    private buildFFmpegArgs(inputName: string, outputName: string, options: any): string[] {
        const args = [
            '-i', inputName,
            '-c:v', 'libx264',
            '-crf', String(options.crf),
            '-preset', options.preset,
            '-c:a', 'aac',
            '-b:a', options.audioBitrate || '128k',
        ];

        // オーディオサンプリングレート
        if (options.audioSampleRate) {
            args.push('-ar', String(options.audioSampleRate));
        }

        // オーディオチャンネル（モノラル化）
        if (options.audioChannels) {
            args.push('-ac', String(options.audioChannels));
        }

        // 最大画素数によるスケーリングフィルターの追加
        if (options.maxSize) {
            const scaleFilter = `scale='if(gte(iw,ih),min(${options.maxSize},iw),-2)':'if(lt(iw,ih),min(${options.maxSize},ih),-2)'`;
            args.push('-vf', scaleFilter);
        }

        args.push('-movflags', '+faststart', '-y', outputName);
        return args;
    }

    /**
     * FFmpegを使用して動画を圧縮
     */
    public async compressWithFFmpeg(file: File, options: any): Promise<VideoCompressionResult> {
        try {
            this.log('Loading FFmpeg...');
            await this.loadFFmpeg();

            // 中止チェック
            const abortResult = this.checkAbort(file);
            if (abortResult) return abortResult;

            if (!this.ffmpeg) {
                throw new Error('FFmpeg not loaded');
            }

            const inputName = 'input.mp4';
            const outputName = 'output.mp4';

            // 入力ファイルを書き込み
            await this.ffmpeg.writeFile(inputName, await fetchFile(file));

            // 圧縮コマンドを構築
            const args = this.buildFFmpegArgs(inputName, outputName, options);

            // 中止チェック
            const abortCheck = this.checkAbort(file);
            if (abortCheck) {
                await this.ffmpeg.deleteFile(inputName);
                return abortCheck;
            }

            this.log('Starting compression with args:', args);

            // 実行中フラグを設定
            this.isCompressing = true;

            try {
                await this.ffmpeg.exec(args);
            } catch (error) {
                // 中止による終了の場合はエラーログを出さない
                if (uploadAbortFlagStore.value) {
                    this.log('Compression aborted during execution');
                } else {
                    console.error('[FFmpegCompression] FFmpeg execution error:', error);
                    throw error;
                }
            } finally {
                this.isCompressing = false;
            }

            // 中止チェック（exec後の主要ポイントのみ）
            if (uploadAbortFlagStore.value) {
                this.log('Cleaning up after abort');
                try {
                    await this.ffmpeg.deleteFile(inputName);
                    await this.ffmpeg.deleteFile(outputName);
                } catch { }
                return { file, wasCompressed: false, wasSkipped: true, aborted: true };
            }

            const data = await this.ffmpeg.readFile(outputName);
            const blob = new Blob([data as BlobPart], { type: 'video/mp4' });

            // クリーンアップ
            await this.ffmpeg.deleteFile(inputName);
            await this.ffmpeg.deleteFile(outputName);

            // 圧縮ファイル生成と検証
            return createCompressedFile(blob, file, this.context);

        } catch (error) {
            this.isCompressing = false;

            // 中止による終了の場合
            if (uploadAbortFlagStore.value) {
                this.log('Compression aborted, using original file');
                return { file, wasCompressed: false, wasSkipped: true, aborted: true };
            }

            console.error('[FFmpegCompression] Compression failed:', error);
            return { file, wasCompressed: false, wasSkipped: true };
        }
    }

    /**
     * リソースのクリーンアップ
     */
    public async cleanup(): Promise<void> {
        if (this.ffmpeg && this.isLoaded) {
            try {
                // FFmpegのクリーンアップは特に必要なし
                this.isLoaded = false;
                this.ffmpeg = null;
                this.loadPromise = null;
            } catch (error) {
                console.error('[FFmpegCompression] Cleanup error:', error);
            }
        }
    }
}