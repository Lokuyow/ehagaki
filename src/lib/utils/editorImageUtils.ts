import type { ImageDimensions, DragEvent } from '../types';
import { domUtils, isTouchDevice, blurEditorAndBody } from "./appDomUtils";
import { renderBlurhashToCanvas } from "../tags/imetaTag";

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

// === ドラッグイベント処理 ===
export function createDragEventDetail(
    type: DragEvent['type'],
    details?: any,
    getPos?: () => number
): any {
    const eventDetails = {
        start: { nodePos: getPos?.() },
        move: details,
        end: {
            nodeData: details?.nodeData || { pos: getPos?.() },
            dropX: 0,
            dropY: 0,
            target: null,
            dropPosition: null,
            ...details,
        },
    };

    return eventDetails[type];
}

export function getEventName(type: DragEvent['type']): string {
    const eventMap = {
        start: "touch-image-drag-start",
        move: "touch-image-drag-move",
        end: "touch-image-drop",
    };
    return eventMap[type];
}

export function dispatchDragEvent(type: DragEvent['type'], details?: any, getPos?: () => number) {
    const eventName = getEventName(type);
    const eventDetail = createDragEventDetail(type, details, getPos);

    const customEvent = new CustomEvent(eventName, {
        detail: eventDetail,
        bubbles: true,
        cancelable: true,
    });

    window.dispatchEvent(customEvent);
    document.dispatchEvent(new CustomEvent(eventName, { detail: customEvent.detail }));
}

// === ドロップゾーン処理 ===
export function findDropZoneAtPosition(x: number, y: number): Element | null {
    const elementBelow = document.elementFromPoint(x, y);
    return elementBelow?.closest(".drop-zone-indicator") || null;
}

export function clearAllDropZoneHighlights(): void {
    domUtils.querySelectorAll(".drop-zone-indicator").forEach(zone => {
        zone.classList.remove("drop-zone-hover");
    });
}

export function highlightDropZone(dropZone: Element | null): void {
    dropZone?.classList.add("drop-zone-hover");
}

export function highlightDropZoneAtPosition(x: number, y: number) {
    clearAllDropZoneHighlights();
    const dropZone = findDropZoneAtPosition(x, y);
    highlightDropZone(dropZone);
}

// === ドラッグプレビュー処理 ===
export function calculatePreviewDimensions(
    rect: DOMRect,
    maxSize: number = 140
): { width: number; height: number } {
    const previewWidth = Math.min(maxSize, rect.width || maxSize);
    const previewHeight = rect.width > 0
        ? Math.round((rect.height / rect.width) * previewWidth)
        : previewWidth;

    return { width: previewWidth, height: previewHeight };
}

export function createCanvasPreview(originalCanvas: HTMLCanvasElement): HTMLCanvasElement | null {
    if (!originalCanvas) return null;

    const newCanvas = document.createElement("canvas");
    newCanvas.width = originalCanvas.width;
    newCanvas.height = originalCanvas.height;

    const ctx = newCanvas.getContext("2d");
    if (ctx) {
        ctx.drawImage(originalCanvas, 0, 0);
    }

    return newCanvas;
}

export function createImagePreview(originalImg: HTMLImageElement): HTMLImageElement | null {
    if (!originalImg) return null;

    const newImg = document.createElement("img");
    newImg.src = originalImg.src;
    newImg.alt = originalImg.alt || "";

    return newImg;
}

export function applyPreviewStyles(
    element: HTMLElement,
    dimensions: { width: number; height: number },
    position: { x: number; y: number }
): void {
    Object.assign(element.style, {
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        left: `${position.x - dimensions.width / 2}px`,
        top: `${position.y - dimensions.height / 2}px`,
        transformOrigin: "center center",
        transition: "transform 120ms ease, opacity 120ms ease"
    });
}

export function createDragPreview(
    element: HTMLElement,
    x: number,
    y: number,
    isPlaceholder: boolean = false
): HTMLElement | null {
    const rect = element.getBoundingClientRect();
    const dimensions = calculatePreviewDimensions(rect);

    let previewEl: HTMLElement | null = null;

    if (isPlaceholder) {
        const origCanvas = element.querySelector("canvas") as HTMLCanvasElement | null;
        if (origCanvas) {
            previewEl = createCanvasPreview(origCanvas);
        }
    } else {
        const origImg = element.querySelector("img") as HTMLImageElement | null;
        if (origImg) {
            previewEl = createImagePreview(origImg);
        }
    }

    if (!previewEl) return null;

    applyPreviewStyles(previewEl, dimensions, { x, y });
    previewEl.classList.add("drag-preview");
    document.body.appendChild(previewEl);

    requestAnimationFrame(() => {
        previewEl!.style.transform = "scale(0.8) rotate(0deg)";
        previewEl!.style.opacity = "0.95";
    });

    return previewEl;
}

// ドラッグプレビューの位置を更新
export function updateDragPreview(previewElement: HTMLElement | null, x: number, y: number) {
    if (!previewElement) return;

    const rect = previewElement.getBoundingClientRect();
    const w = rect.width || 100;
    const h = rect.height || 100;

    previewElement.style.left = `${x - w / 2}px`;
    previewElement.style.top = `${y - h / 2}px`;
}

// ドラッグプレビューを削除
export function removeDragPreview(previewElement: HTMLElement | null): void {
    previewElement?.parentNode?.removeChild(previewElement);
}

// === ドラッグ移動閾値チェック ===
export function checkMoveThreshold(
    currentX: number,
    currentY: number,
    startX: number,
    startY: number,
    threshold: number
): boolean {
    const dx = currentX - startX;
    const dy = currentY - startY;
    return dx * dx + dy * dy > threshold * threshold;
}

// === 画像クリック・タッチ処理 ===
export function shouldPreventInteraction(
    isDragging: boolean,
    isPlaceholder: boolean,
    justSelected: boolean,
    isTouch: boolean
): boolean {
    if (isDragging || isPlaceholder) return true;
    if (justSelected && !isTouch) return true;
    return false;
}

export function requestNodeSelection(getPos: () => number) {
    const pos = getPos();
    // スマートフォン（タッチデバイス）ではキーボードを閉じる
    if (isTouchDevice()) {
        blurEditorAndBody();
    }
    const event = new CustomEvent("select-image-node", { detail: { pos } });
    window.dispatchEvent(event);
    document.dispatchEvent(event); // ← 追加: documentにも発火
}

export function handleImageInteraction(
    event: MouseEvent | TouchEvent,
    isTouch: boolean,
    isDragging: boolean,
    isPlaceholder: boolean,
    selected: boolean,
    justSelected: boolean,
    imageSrc: string,
    imageAlt: string,
    getPos: () => number
): boolean {
    if (shouldPreventInteraction(isDragging, isPlaceholder, justSelected, isTouch)) {
        event.preventDefault();
        return false;
    }

    if (!selected) {
        requestNodeSelection(getPos);
    }

    event.preventDefault();
    if (!isTouch) {
        event.stopPropagation();
    }

    return true;
}

// === blurhash描画 ===
export interface BlurhashRenderer {
    renderBlurhashToCanvas(blurhash: string, canvas: HTMLCanvasElement, width: number, height: number): void;
}

export function validateBlurhashParams(
    blurhash: string,
    canvasRef: HTMLCanvasElement,
    dimensions: { displayWidth: number; displayHeight: number }
): boolean {
    return !!(blurhash && canvasRef && dimensions.displayWidth > 0 && dimensions.displayHeight > 0);
}

export function setupCanvas(
    canvasRef: HTMLCanvasElement,
    dimensions: { displayWidth: number; displayHeight: number }
): void {
    canvasRef.width = dimensions.displayWidth;
    canvasRef.height = dimensions.displayHeight;
}

export function renderBlurhash(
    blurhash: string,
    canvasRef: HTMLCanvasElement,
    dimensions: { displayWidth: number; displayHeight: number },
    _isPlaceholder: boolean,
    _devMode: boolean = false
) {
    if (!validateBlurhashParams(blurhash, canvasRef, dimensions)) {
        return;
    }

    setupCanvas(canvasRef, dimensions);

    renderBlurhashToCanvas(blurhash, canvasRef, dimensions.displayWidth, dimensions.displayHeight);
}