import type { VideoCompressionResult } from '../types';
import { uploadAbortFlagStore } from '../../stores/appStore.svelte';

/**
 * 開発環境でのログ出力用ヘルパー
 */
export function devLog(context: string, ...args: any[]): void {
    if (import.meta.env.DEV) {
        console.log(`[${context}]`, ...args);
    }
}

/**
 * 開発環境での警告出力用ヘルパー
 */
export function devWarn(context: string, ...args: any[]): void {
    if (import.meta.env.DEV) {
        console.warn(`[${context}]`, ...args);
    }
}

/**
 * 圧縮後のファイルを生成・検証
 */
export function createCompressedFile(
    blob: Blob,
    originalFile: File,
    context: string
): VideoCompressionResult {
    // 圧縮後のサイズチェック
    if (blob.size >= originalFile.size) {
        devLog(context, 'Compressed file is larger, using original');
        return { file: originalFile, wasCompressed: false };
    }

    // ファイル名を生成
    const nameWithoutExt = originalFile.name.replace(/\.[^.]+$/, '');
    const compressedFile = new File([blob], `${nameWithoutExt}_compressed.mp4`, { type: 'video/mp4' });

    if (import.meta.env.DEV) {
        const ratio = ((1 - compressedFile.size / originalFile.size) * 100).toFixed(1);
        devLog(context, 'Compression successful:', {
            originalSize: originalFile.size,
            compressedSize: compressedFile.size,
            ratio: `${ratio}%`
        });
    }

    return { file: compressedFile, wasCompressed: true };
}

/**
 * 中止フラグをチェックして早期リターンするヘルパー
 */
export function checkAbort(
    file: File,
    context: string,
    onProgress?: (progress: number) => void
): VideoCompressionResult | null {
    if (uploadAbortFlagStore.value) {
        devLog(context, 'Compression aborted');
        if (onProgress) {
            onProgress(0);
        }
        return { file, wasCompressed: false, wasSkipped: true, aborted: true };
    }
    return null;
}

/**
 * 圧縮設定が有効かチェック
 */
export function shouldSkipCompression(options: any, context: string): boolean {
    if (!options) {
        devLog(context, 'No compression options provided');
        return true;
    }

    if (typeof options === 'object' && options && 'skip' in options && options.skip) {
        devLog(context, 'Compression disabled by skip flag');
        return true;
    }

    return false;
}

/**
 * ファイルサイズが圧縮閾値以下かチェック
 */
export function isFileTooSmall(file: File, threshold: number = 200 * 1024): boolean {
    return file.size <= threshold;
}

/**
 * ビデオファイルかチェック
 */
export function isVideoFile(file: File): boolean {
    return file.type.startsWith('video/');
}
