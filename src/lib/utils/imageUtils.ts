import type { ImageDimensions } from '../types';

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
) {
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

/**
 * 要素の中心からのオフセットを計算
 */
export function calculateViewportInfo(
    element: HTMLElement,
    mouseX: number,
    mouseY: number
): { centerX: number; centerY: number; offsetX: number; offsetY: number } {
    const rect = element.getBoundingClientRect();
    const center = { x: rect.width / 2, y: rect.height / 2 };
    return {
        centerX: center.x,
        centerY: center.y,
        offsetX: mouseX - rect.left - center.x,
        offsetY: mouseY - rect.top - center.y
    };
}

/**
 * ドラッグの移動量計算
 */
export function calculateDragDelta(
    currentMouse: { x: number; y: number },
    startMouse: { x: number; y: number }
): { x: number; y: number } {
    return {
        x: currentMouse.x - startMouse.x,
        y: currentMouse.y - startMouse.y
    };
}

/**
 * イベントとコンテナ要素からズームパラメータを計算
 */
export function calculateZoomFromEvent(
    event: MouseEvent | WheelEvent,
    containerElement: HTMLElement,
    targetScale: number
): { scale: number; offsetX: number; offsetY: number } {
    const rect = containerElement.getBoundingClientRect();
    const center = { x: rect.width / 2, y: rect.height / 2 };
    return {
        scale: targetScale,
        offsetX: event.clientX - rect.left - center.x,
        offsetY: event.clientY - rect.top - center.y
    };
}
