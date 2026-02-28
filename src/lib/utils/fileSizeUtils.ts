import type { FileSizeInfo, SizeDisplayInfo } from "../types";

// =============================================================================
// File Size Utilities (Pure Functions)
// =============================================================================

/**
 * 内部ヘルパー: MB/KB切り替えでバイト数をフォーマット
 */
function formatSizeWithUnit(bytes: number, useMB: boolean): string {
    if (useMB) {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)}MB`;
    } else {
        const kb = Math.round(bytes / 1024);
        return `${kb}KB`;
    }
}

/**
 * ファイルサイズを人間に読みやすい形式に変換
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0KB';
    const kb = bytes / 1024;
    if (kb >= 1000) {
        // 1000KB以上の場合はMB表記、小数点以下第二位まで
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)}MB`;
    } else {
        // それ以下の場合はKB表記
        return `${Math.round(kb)}KB`;
    }
}

/**
 * 圧縮率を計算（有効数字2桁）
 */
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
    if (originalSize <= 0) return 100;
    const ratio = (compressedSize / originalSize) * 100;
    return Number(ratio.toPrecision(2));
}

/**
 * サイズ削減表示文字列を生成（圧縮前後の単位を統一）
 */
export function createSizeReductionText(originalSize: number, compressedSize: number): string {
    const useMB = (originalSize / 1024) >= 1000; // 圧縮前が1000KB以上の場合MB表記を使用

    return `${formatSizeWithUnit(originalSize, useMB)} → ${formatSizeWithUnit(compressedSize, useMB)}`;
}

/**
 * ファイルサイズ情報を生成
 */
export function createFileSizeInfo(
    originalSize: number,
    compressedSize: number,
    wasCompressed: boolean,
    originalFilename?: string,
    compressedFilename?: string,
    wasSkipped?: boolean
): FileSizeInfo {
    return {
        originalSize,
        compressedSize,
        wasCompressed,
        compressionRatio: calculateCompressionRatio(originalSize, compressedSize),
        sizeReduction: createSizeReductionText(originalSize, compressedSize),
        originalFilename,
        compressedFilename,
        wasSkipped
    };
}

/**
 * ファイルサイズ情報に変化があるかチェック
 */
export function hasFileSizeChanges(sizeInfo: FileSizeInfo): boolean {
    return sizeInfo.wasCompressed ||
        (sizeInfo.originalFilename !== sizeInfo.compressedFilename) ||
        (sizeInfo.originalSize !== sizeInfo.compressedSize) ||
        !!sizeInfo.wasSkipped;
}

/**
 * サイズ情報から表示用の構造化データを生成
 */
export function generateSizeDisplayInfo(sizeInfo: FileSizeInfo | null): SizeDisplayInfo | null {
    if (!sizeInfo || !hasFileSizeChanges(sizeInfo)) {
        return null;
    }

    const useMB = (sizeInfo.originalSize / 1024) >= 1000; // 圧縮前が1000KB以上の場合MB表記を使用

    return {
        wasCompressed: sizeInfo.wasCompressed,
        originalSize: formatSizeWithUnit(sizeInfo.originalSize, useMB),
        compressedSize: formatSizeWithUnit(sizeInfo.compressedSize, useMB),
        compressionRatio: sizeInfo.compressionRatio,
        originalFilename: sizeInfo.originalFilename,
        compressedFilename: sizeInfo.compressedFilename,
        wasSkipped: sizeInfo.wasSkipped
    };
}
