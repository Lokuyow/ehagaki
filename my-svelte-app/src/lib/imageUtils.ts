/**
 * 画像サイズ計算ユーティリティ
 * SvelteImageNodeとImagePlaceholderで共通使用
 */

export interface ImageDimensions {
    width: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
}

/**
 * エディター内画像の最大サイズ制限（CSS値と一致させる）
 */
const EDITOR_IMAGE_CONSTRAINTS = {
    maxWidth: 780,
    maxHeight: 240 // img.editor-imageのmax-heightと一致
};

/**
 * 画像の元サイズから表示サイズを計算する
 * アスペクト比を維持しながらエディターの制約内に収める
 */
export function calculateImageDisplaySize(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number = EDITOR_IMAGE_CONSTRAINTS.maxWidth,
    maxHeight: number = EDITOR_IMAGE_CONSTRAINTS.maxHeight
): ImageDimensions {
    // 元サイズが制約内の場合はそのまま使用
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
        return {
            width: originalWidth,
            height: originalHeight,
            displayWidth: originalWidth,
            displayHeight: originalHeight
        };
    }

    // アスペクト比を計算
    const aspectRatio = originalWidth / originalHeight;

    let displayWidth: number;
    let displayHeight: number;

    // 幅と高さのどちらが制約に引っかかるかを判定
    if (originalWidth / maxWidth > originalHeight / maxHeight) {
        // 幅が制約のボトルネック
        displayWidth = maxWidth;
        displayHeight = Math.round(maxWidth / aspectRatio);
    } else {
        // 高さが制約のボトルネック
        displayHeight = maxHeight;
        displayWidth = Math.round(maxHeight * aspectRatio);
    }

    return {
        width: originalWidth,
        height: originalHeight,
        displayWidth,
        displayHeight
    };
}

/**
 * dimストリング（"1920x1080"形式）をパースする
 */
export function parseDimString(dimString: string | undefined): { width: number; height: number } | null {
    if (!dimString) return null;

    const match = dimString.match(/^(\d+)x(\d+)$/);
    if (!match) return null;

    return {
        width: parseInt(match[1], 10),
        height: parseInt(match[2], 10)
    };
}

/**
 * プレースホルダー用のデフォルトサイズを取得
 */
export function getPlaceholderDefaultSize(): ImageDimensions {
    return {
        width: 200,
        height: 150,
        displayWidth: 200,
        displayHeight: 150
    };
}
