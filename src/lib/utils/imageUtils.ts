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

// --- ImageFullscreen.svelteから移動したユーティリティ関数 ---

import { TIMING, ZOOM_CONFIG } from "../constants";
import { transformStore } from "../../stores/transformStore.svelte";
import { setBodyStyle, clearBodyStyles } from "./appDomUtils";

export function setImageContainerStyle(
    { scale, translate, useTransition }: { scale: number; translate: { x: number; y: number }; useTransition: boolean },
    imageContainerElement?: HTMLDivElement
) {
    const el = imageContainerElement ?? document.querySelector(".image-container") as HTMLDivElement | null;
    if (!el) return;
    el.style.transition = useTransition
        ? `transform ${TIMING.TRANSITION_DURATION} ease`
        : "none";
    el.style.transform = `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`;
    el.style.transformOrigin = "center";
}

export function setImageContainerTransformDirect(
    scale: number,
    translateX: number,
    translateY: number,
    imageContainerElement?: HTMLDivElement
) {
    const el = imageContainerElement ?? document.querySelector(".image-container") as HTMLDivElement | null;
    if (!el) return;
    el.style.transition = "none";
    el.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
}

export function setImageCursorByScale(scale: number, imageContainerElement?: HTMLDivElement) {
    const el = imageContainerElement ?? document.querySelector(".image-container") as HTMLDivElement | null;
    if (!el) return;
    el.style.cursor = scale > ZOOM_CONFIG.DEFAULT_SCALE ? "grab" : "default";
}

export function setOverlayCursorByScale(scale: number, containerElement?: HTMLDivElement) {
    const el = containerElement ?? document.querySelector(".fullscreen-overlay") as HTMLDivElement | null;
    if (!el) return;
    el.style.cursor = scale > ZOOM_CONFIG.DEFAULT_SCALE ? "grab" : "default";
}

export function setTransition(enable: boolean) {
    transformStore.setTransition(enable);
}

export function setBodyUserSelect(enable: boolean) {
    const value = enable ? "" : "none";
    setBodyStyle("user-select", value);
    setBodyStyle("-webkit-user-select", value);
}

export function clearTapTimer(tapTimeoutId: number | null) {
    if (tapTimeoutId !== null) {
        clearTimeout(tapTimeoutId);
        // 呼び出し元でtapTimeoutIdをnullにすること
    }
}

export function updateBoundaryConstraints(imageElement: HTMLImageElement | undefined, containerElement: HTMLDivElement | undefined) {
    if (imageElement && containerElement) {
        const imageRect = imageElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        const constraints = {
            imageWidth: imageRect.width,
            imageHeight: imageRect.height,
            containerWidth: containerRect.width,
            containerHeight: containerRect.height,
        };
        transformStore.setBoundaryConstraints(constraints);
    }
}

export function resetAllStates(
    animationFrameId: number | null,
    pinchAnimationFrameId: number | null,
    dragState: any,
    pinchState: any,
    lastTapTime: number,
    tapTimeoutId: number | null
) {
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    if (pinchAnimationFrameId !== null) cancelAnimationFrame(pinchAnimationFrameId);
    animationFrameId = null;
    pinchAnimationFrameId = null;
    transformStore.reset();
    transformStore.setBoundaryConstraints(null);
    dragState.isDragging = false;
    pinchState.isPinching = false;
    lastTapTime = 0;
    clearTapTimer(tapTimeoutId);
    clearBodyStyles();
}
