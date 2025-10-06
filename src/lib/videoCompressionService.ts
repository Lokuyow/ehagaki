import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

/**
 * 動画圧縮設定のマップ
 */
export const VIDEO_COMPRESSION_OPTIONS_MAP = {
    none: { skip: true },
    low: {
        crf: 20,
        preset: 'superfast',
        maxSize: 1280,
        audioBitrate: '128k',
    },
    medium: {
        crf: 26,
        preset: 'superfast',
        maxSize: 640,
        audioBitrate: '64k',
        audioSampleRate: 44100,
    },
    high: {
        crf: 28,
        preset: 'medium',
        maxSize: 320,
        audioBitrate: '32k',
        audioSampleRate: 16000,
        audioChannels: 1,
    },
} as const;

export type VideoCompressionLevel = keyof typeof VIDEO_COMPRESSION_OPTIONS_MAP;

/**
 * 動画圧縮サービスクラス
 */
export class VideoCompressionService {
    private ffmpeg: FFmpeg | null = null;
    private isLoaded = false;
    private loadPromise: Promise<void> | null = null;
    private onProgress?: (progress: number) => void;

    constructor(private localStorage: Storage) { }

    /**
     * 進捗コールバックを設定
     */
    public setProgressCallback(callback?: (progress: number) => void): void {
        this.onProgress = callback;
    }

    /**
     * FFmpegのロード（シングルスレッド版）
     */
    private async loadFFmpeg(): Promise<void> {
        if (this.isLoaded) return;
        if (this.loadPromise) return this.loadPromise;

        this.loadPromise = (async () => {
            try {
                this.ffmpeg = new FFmpeg();

                // 開発環境でのみログ出力
                if (import.meta.env.DEV) {
                    this.ffmpeg.on('log', ({ message }) => {
                        console.log('[FFmpeg]', message);
                    });
                    console.log('[VideoCompressionService] Loading FFmpeg from node_modules');
                }

                // 進捗イベントのリスナーを設定
                this.ffmpeg.on('progress', ({ progress }) => {
                    if (this.onProgress) {
                        this.onProgress(Math.round(progress * 100));
                    }
                });

                // Viteの静的アセットimportを使用
                // vite-plugin-static-copyでコピーされたファイルを参照
                const base = import.meta.env.BASE_URL || '/';
                // 絶対URLを構築（相対パスだとWorker内で解決できない）
                const baseURL = new URL(base, window.location.origin).href;
                const coreURL = new URL('ffmpeg-core/ffmpeg-core.js', baseURL).href;
                const wasmURL = new URL('ffmpeg-core/ffmpeg-core.wasm', baseURL).href;

                if (import.meta.env.DEV) {
                    console.log('[VideoCompressionService] Base URL:', baseURL);
                    console.log('[VideoCompressionService] Core URL:', coreURL);
                    console.log('[VideoCompressionService] WASM URL:', wasmURL);
                }

                await this.ffmpeg.load({
                    coreURL: coreURL,
                    wasmURL: wasmURL,
                });

                this.isLoaded = true;
                if (import.meta.env.DEV) {
                    console.log('[VideoCompressionService] FFmpeg loaded successfully');
                }
            } catch (error) {
                console.error('[VideoCompressionService] Failed to load FFmpeg:', error);
                this.loadPromise = null;
                throw error;
            }
        })();

        return this.loadPromise;
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
     * 動画ファイルを圧縮
     */
    async compress(file: File): Promise<{ file: File; wasCompressed: boolean; wasSkipped?: boolean }> {
        const isDev = import.meta.env.DEV;

        // 動画ファイル以外はスキップ
        if (!file.type.startsWith('video/')) {
            if (isDev) console.log('[VideoCompressionService] Not a video file, skipping:', file.type);
            return { file, wasCompressed: false };
        }

        // 小さいファイルはスキップ (200KB以下)
        if (file.size <= 200 * 1024) {
            if (isDev) console.log('[VideoCompressionService] File too small, skipping compression:', file.size);
            return { file, wasCompressed: false, wasSkipped: true };
        }

        const options = this.getCompressionOptions();
        if (!options) {
            if (isDev) console.log('[VideoCompressionService] No compression options, skipping');
            return { file, wasCompressed: false, wasSkipped: true };
        }

        if (isDev) console.log('[VideoCompressionService] Starting compression for:', file.name, 'Size:', file.size);

        try {
            // FFmpegをロード
            if (isDev) console.log('[VideoCompressionService] Loading FFmpeg...');
            await this.loadFFmpeg();

            if (!this.ffmpeg) {
                throw new Error('FFmpeg not loaded');
            }

            const inputName = 'input.mp4';
            const outputName = 'output.mp4';

            // 入力ファイルを書き込み
            await this.ffmpeg.writeFile(inputName, await fetchFile(file));

            // 圧縮コマンドを実行
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
                // アスペクト比を保持しながら最大サイズに収める
                // 'scale=W:H' で -2 はアスペクト比を維持しつつ2の倍数にする
                // 幅と高さの両方を制限するため、if文で条件分岐
                const scaleFilter = `scale='if(gte(iw,ih),min(${options.maxSize},iw),-2)':'if(lt(iw,ih),min(${options.maxSize},ih),-2)'`;
                args.push('-vf', scaleFilter);
            }

            args.push('-movflags', '+faststart', '-y', outputName);

            if (isDev) {
                console.log('[VideoCompressionService] Starting compression with args:', args);
            }
            await this.ffmpeg.exec(args);

            // 出力ファイルを読み取り
            const data = await this.ffmpeg.readFile(outputName);
            const blob = new Blob([data as BlobPart], { type: 'video/mp4' });

            // クリーンアップ
            await this.ffmpeg.deleteFile(inputName);
            await this.ffmpeg.deleteFile(outputName);

            // 圧縮後のサイズチェック
            if (blob.size >= file.size) {
                if (isDev) {
                    console.log('[VideoCompressionService] Compressed file is larger, using original');
                }
                return { file, wasCompressed: false };
            }

            // ファイル名を生成
            const originalName = file.name;
            const nameWithoutExt = originalName.replace(/\.[^.]+$/, '');
            const outputFile = new File([blob], `${nameWithoutExt}_compressed.mp4`, { type: 'video/mp4' });

            if (isDev) {
                console.log('[VideoCompressionService] Compression successful:', {
                    originalSize: file.size,
                    compressedSize: outputFile.size,
                    ratio: ((1 - outputFile.size / file.size) * 100).toFixed(1) + '%'
                });
            }

            return { file: outputFile, wasCompressed: true };

        } catch (error) {
            console.error('[VideoCompressionService] Compression failed:', error);
            return { file, wasCompressed: false, wasSkipped: true };
        }
    }

    /**
     * リソースのクリーンアップ
     */
    async cleanup(): Promise<void> {
        if (this.ffmpeg && this.isLoaded) {
            try {
                // FFmpegのクリーンアップは特に必要なし
                this.isLoaded = false;
                this.ffmpeg = null;
                this.loadPromise = null;
            } catch (error) {
                console.error('[VideoCompressionService] Cleanup error:', error);
            }
        }
    }
}
