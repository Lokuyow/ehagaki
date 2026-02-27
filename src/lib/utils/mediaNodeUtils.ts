/**
 * mediaNodeUtils.ts
 *
 * Tiptapエディター内の画像・動画ノード共通ユーティリティ。
 * エディタ内画像ノード（SvelteImageNode）と動画ノード（SvelteVideoNode）の
 * 両方で利用するサイズ計算・ドラッグ・インタラクション処理を提供します。
 */

import type { ImageDimensions, DragEvent } from '../types';
import { domUtils, isTouchDevice, blurEditorAndBody } from "./appDomUtils";

// =============================================================================
// サイズ計算
// =============================================================================

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
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
        return {
            width: originalWidth,
            height: originalHeight,
            displayWidth: originalWidth,
            displayHeight: originalHeight
        };
    }

    const aspectRatio = originalWidth / originalHeight;
    let displayWidth: number;
    let displayHeight: number;

    if (originalWidth / maxWidth > originalHeight / maxHeight) {
        displayWidth = maxWidth;
        displayHeight = Math.round(maxWidth / aspectRatio);
    } else {
        displayHeight = maxHeight;
        displayWidth = Math.round(maxHeight * aspectRatio);
    }

    return { width: originalWidth, height: originalHeight, displayWidth, displayHeight };
}

/**
 * dimストリング（"1920x1080"形式）をパースする
 */
export function parseDimString(dimString: string | undefined): { width: number; height: number } | null {
    if (!dimString) return null;
    const match = dimString.match(/^(\d+)x(\d+)$/);
    if (!match) return null;
    return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
}

/**
 * プレースホルダー用のデフォルトサイズを取得
 */
export function getPlaceholderDefaultSize(): ImageDimensions {
    return { width: 200, height: 150, displayWidth: 200, displayHeight: 150 };
}

// =============================================================================
// ドラッグイベント処理
// =============================================================================

export function createDragEventDetail(
    type: DragEvent['type'],
    details?: any,
    getPos?: () => number | undefined
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

export function dispatchDragEvent(type: DragEvent['type'], details?: any, getPos?: () => number | undefined) {
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

// =============================================================================
// ドロップゾーン処理
// =============================================================================

export function findDropZoneAtPosition(x: number, y: number): Element | null {
    return document.elementFromPoint(x, y)?.closest(".drop-zone-indicator") || null;
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
    highlightDropZone(findDropZoneAtPosition(x, y));
}

// =============================================================================
// ドラッグプレビュー処理（内部ヘルパーは非公開）
// =============================================================================

function calculatePreviewDimensions(rect: DOMRect, maxSize: number = 140): { width: number; height: number } {
    const previewWidth = Math.min(maxSize, rect.width || maxSize);
    const previewHeight = rect.width > 0
        ? Math.round((rect.height / rect.width) * previewWidth)
        : previewWidth;
    return { width: previewWidth, height: previewHeight };
}

function createCanvasPreview(originalCanvas: HTMLCanvasElement): HTMLCanvasElement | null {
    if (!originalCanvas) return null;
    const newCanvas = document.createElement("canvas");
    newCanvas.width = originalCanvas.width;
    newCanvas.height = originalCanvas.height;
    newCanvas.getContext("2d")?.drawImage(originalCanvas, 0, 0);
    return newCanvas;
}

function createImagePreview(originalImg: HTMLImageElement): HTMLImageElement | null {
    if (!originalImg) return null;
    const newImg = document.createElement("img");
    newImg.src = originalImg.src;
    newImg.alt = originalImg.alt || "";
    return newImg;
}

function applyPreviewStyles(
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
        if (origCanvas) previewEl = createCanvasPreview(origCanvas);
    } else {
        const origImg = element.querySelector("img") as HTMLImageElement | null;
        if (origImg) previewEl = createImagePreview(origImg);
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

export function updateDragPreview(previewElement: HTMLElement | null, x: number, y: number) {
    if (!previewElement) return;
    const rect = previewElement.getBoundingClientRect();
    const w = rect.width || 100;
    const h = rect.height || 100;
    previewElement.style.left = `${x - w / 2}px`;
    previewElement.style.top = `${y - h / 2}px`;
}

export function removeDragPreview(previewElement: HTMLElement | null): void {
    previewElement?.parentNode?.removeChild(previewElement);
}

// =============================================================================
// インタラクション処理
// =============================================================================

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

/**
 * メディアノードがプレースホルダー状態かどうかを判定する
 * エディターノード属性およびデータベース属性の両方に対応
 */
export function isMediaPlaceholder(attrs: {
    isPlaceholder?: boolean;
    src?: string | null;
}): boolean {
    return (
        attrs.isPlaceholder === true ||
        attrs.src?.startsWith("placeholder-") === true ||
        attrs.src?.startsWith("blob:") === true ||
        !attrs.src
    );
}

export function requestNodeSelection(getPos: () => number | undefined) {
    const pos = getPos();
    if (pos === undefined) return;
    if (isTouchDevice()) blurEditorAndBody();
    const event = new CustomEvent("select-image-node", { detail: { pos } });
    window.dispatchEvent(event);
    document.dispatchEvent(event);
}

export function requestImageFullscreen(src: string, alt: string) {
    blurEditorAndBody();
    const event = new CustomEvent("image-fullscreen-request", { detail: { src, alt } });
    window.dispatchEvent(event);
    document.dispatchEvent(event);
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
    getPos: () => number | undefined
): boolean {
    if (shouldPreventInteraction(isDragging, isPlaceholder, justSelected, isTouch)) {
        event.preventDefault();
        return false;
    }

    if (selected) {
        event.preventDefault();
        if (!isTouch) event.stopPropagation();
        requestImageFullscreen(imageSrc, imageAlt);
        return true;
    }

    requestNodeSelection(getPos);
    event.preventDefault();
    if (!isTouch) event.stopPropagation();
    return true;
}
