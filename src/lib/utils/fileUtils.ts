import { uploadAbortFlagStore } from '../../stores/appStore.svelte';
import type { ImageDimensions, UploadHelperDependencies } from "../types";
import { calculateImageDisplaySize } from './mediaNodeUtils';

// =============================================================================
// File Upload Utilities
// =============================================================================

/**
 * 画像のSHA-256ハッシュ計算
 */
export async function calculateSHA256Hex(file: File, crypto: SubtleCrypto = window.crypto.subtle): Promise<string> {
    // 中止フラグをチェック（計算開始前のみ）
    if (uploadAbortFlagStore.value) {
        throw new Error('Upload aborted by user');
    }

    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.digest("SHA-256", arrayBuffer);

    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

async function tryCalculateSHA256Hex(
    file: File,
    crypto: SubtleCrypto
): Promise<string | undefined> {
    try {
        return await calculateSHA256Hex(file, crypto);
    } catch {
        return undefined;
    }
}

/**
 * 画像サイズ取得関数
 */
export async function getImageDimensions(file: File): Promise<ImageDimensions | null> {
    return new Promise((resolve) => {
        if (!file.type.startsWith('image/')) {
            resolve(null);
            return;
        }

        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            try {
                const dimensions = calculateImageDisplaySize(img.naturalWidth, img.naturalHeight);
                URL.revokeObjectURL(url);
                resolve(dimensions);
            } catch (error) {
                console.error('Failed to calculate image display size:', error);
                URL.revokeObjectURL(url);
                resolve(null);
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(null);
        };

        img.src = url;
    });
}

/**
 * ファイル名をMIMEタイプに応じてリネーム
 */
export function renameByMimeType(filename: string, mime: string): string {
    const map: Record<string, string> = {
        "image/webp": ".webp",
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/gif": ".gif",
        "image/avif": ".avif",
        "image/bmp": ".bmp"
    };
    const ext = map[mime];
    if (!ext) return filename;
    const base = filename.replace(/\.[^.]+$/, "");
    return `${base}${ext}`;
}

/**
 * アップロードするファイルを処理し、ハッシュとサイズ情報を計算する
 * @param files 処理するファイル配列
 * @param dependencies 依存関係
 * @returns 処理結果の配列（ファイル、インデックス、ox、dimensions）
 */
export async function processFilesForUpload(
    files: File[],
    dependencies: UploadHelperDependencies
): Promise<Array<{ file: File; index: number; ox?: string; dimensions?: ImageDimensions }>> {
    const results: Array<{ file: File; index: number; ox?: string; dimensions?: ImageDimensions }> = [];

    // 処理前に1度だけ中止チェック
    if (uploadAbortFlagStore.value) {
        throw new Error('Upload aborted by user');
    }

    // 順次処理
    for (let index = 0; index < files.length; index++) {
        const file = files[index];

        const [oxResult, dimensionsResult] = await Promise.all([
            // ox計算
            tryCalculateSHA256Hex(file, dependencies.crypto),
            // サイズ計算
            dependencies.getImageDimensions(file)
        ]);

        results.push({ file, index, ox: oxResult, dimensions: dimensionsResult ?? undefined });
    }

    return results;
}

/**
 * アップロード用のメタデータリストを作成する
 * @param fileArray ファイル配列
 * @returns メタデータレコードの配列
 */
export function prepareMetadataList(fileArray: File[]): Array<Record<string, string | number | undefined>> {
    return fileArray.map((f) => ({
        caption: f.name,
        expiration: "",
        size: f.size,
        alt: f.name,
        media_type: undefined,
        content_type: f.type || "",
        no_transform: "true"
    }));
}
