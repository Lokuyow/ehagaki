import type { VideoCompressionResult } from '../types';
import { isDefaultUploadAborted, type UploadAbortChecker } from '../uploadAbortUtils';
import { checkAbort, devLog } from './compressionUtils';

/**
 * 動画圧縮の基底クラス
 * 共通の進捗管理と中止処理を提供
 */
export abstract class BaseCompression {
    protected onProgress?: (progress: number) => void;
    protected readonly context: string;

    constructor(
        context: string,
        private isUploadAborted: UploadAbortChecker = isDefaultUploadAborted,
    ) {
        this.context = context;
    }

    /**
     * 進捗コールバックを設定
     */
    public setProgressCallback(callback?: (progress: number) => void): void {
        this.onProgress = callback;
    }

    /**
     * 中止フラグをチェック
     */
    protected checkAbort(file: File): VideoCompressionResult | null {
        return checkAbort(file, this.context, this.onProgress, this.isUploadAborted);
    }

    protected isAborted(): boolean {
        return this.isUploadAborted();
    }

    /**
     * 進捗をリセット
     */
    protected resetProgress(): void {
        if (this.onProgress) {
            this.onProgress(0);
        }
    }

    /**
     * 進捗を更新
     */
    protected updateProgress(progress: number): void {
        if (this.onProgress) {
            this.onProgress(Math.round(progress));
        }
    }

    /**
     * ログ出力
     */
    protected log(...args: any[]): void {
        devLog(this.context, ...args);
    }

    /**
     * 圧縮処理を中止（サブクラスで実装）
     */
    public abstract abort(): void;

    /**
     * リソースのクリーンアップ（サブクラスで実装）
     */
    public abstract cleanup(): Promise<void>;
}
