import { TIMING, ZOOM_CONFIG } from "../constants";
import { transformStore } from "../../stores/transformStore.svelte";
import { setBodyStyle, clearBodyStyles } from "./appDomUtils";

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

export function handleTap(
    lastTapTime: number,
    lastTapPosition: { x: number; y: number } | null,
    tapTimeoutId: number | null,
    clientX: number,
    clientY: number,
    onDoubleTap: (x: number, y: number) => void
): { isDoubleTap: boolean; newLastTapTime: number; newLastTapPosition: { x: number; y: number } | null; newTapTimeoutId: number | null } {
    const currentTime = Date.now();
    const tapDistance = lastTapPosition
        ? Math.sqrt(
            Math.pow(clientX - lastTapPosition.x, 2) +
            Math.pow(clientY - lastTapPosition.y, 2),
        )
        : 0;

    if (
        currentTime - lastTapTime < 200 &&
        tapDistance < 50 &&
        tapTimeoutId !== null
    ) {
        clearTapTimer(tapTimeoutId);
        onDoubleTap(clientX, clientY);
        return { isDoubleTap: true, newLastTapTime: 0, newLastTapPosition: null, newTapTimeoutId: null };
    }

    const newLastTapTime = currentTime;
    const newLastTapPosition = { x: clientX, y: clientY };
    clearTapTimer(tapTimeoutId);
    const newTapTimeoutId = window.setTimeout(() => { }, 300); // Timeout handled by caller
    return { isDoubleTap: false, newLastTapTime, newLastTapPosition, newTapTimeoutId };
}

export function handlePointerStart(
    transformStateScale: number,
    transformStateTranslate: { x: number; y: number },
    dragState: any,
    lastTapTime: number,
    lastTapPosition: { x: number; y: number } | null,
    tapTimeoutId: number | null,
    clientX: number,
    clientY: number,
    isTouch: boolean,
    onDoubleTap: (x: number, y: number) => void
): { newDragState: any; newLastTapTime: number; newLastTapPosition: { x: number; y: number } | null; newTapTimeoutId: number | null } {
    let newDragState = { ...dragState };
    let newLastTapTime = lastTapTime;
    let newLastTapPosition = lastTapPosition;
    let newTapTimeoutId = tapTimeoutId;

    const tapResult = handleTap(lastTapTime, lastTapPosition, tapTimeoutId, clientX, clientY, onDoubleTap);
    newLastTapTime = tapResult.newLastTapTime;
    newLastTapPosition = tapResult.newLastTapPosition;
    newTapTimeoutId = tapResult.newTapTimeoutId;

    if (tapResult.isDoubleTap && isTouch) {
        return { newDragState, newLastTapTime, newLastTapPosition, newTapTimeoutId };
    }

    if (transformStateScale > ZOOM_CONFIG.DEFAULT_SCALE) {
        newDragState.start = { x: clientX, y: clientY };
        newDragState.startTranslate = { ...transformStateTranslate };
    }

    return { newDragState, newLastTapTime, newLastTapPosition, newTapTimeoutId };
}

export function handlePointerMove(
    dragState: any,
    clientX: number,
    clientY: number,
    isTouch: boolean,
    dragStartThreshold: number,
    transformStateScale: number,
    onStartDrag: (x: number, y: number) => void,
    onUpdateDrag: (x: number, y: number) => void
): { newDragState: any; touchMoved: boolean } {
    let newDragState = { ...dragState };
    let touchMoved = false;

    if (isTouch) {
        const moveDistance = newDragState.start
            ? Math.sqrt(
                Math.pow(clientX - newDragState.start.x, 2) +
                Math.pow(clientY - newDragState.start.y, 2),
            )
            : 0;

        if (moveDistance > dragStartThreshold) {
            touchMoved = true;
            if (!newDragState.isDragging && transformStateScale > ZOOM_CONFIG.DEFAULT_SCALE) {
                onStartDrag(newDragState.start.x, newDragState.start.y);
                newDragState.isDragging = true;
            }
        }
    }

    if (newDragState.isDragging) {
        onUpdateDrag(clientX, clientY);
    }

    return { newDragState, touchMoved };
}

export function handlePointerEnd(
    _dragState: any,
    isTouch: boolean,
    touchStartTime: number,
    touchMoved: boolean,
    onStopDrag: () => void
): void {
    if (isTouch) {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration < 200 && !touchMoved) {
            return; // Tap already handled
        }
    }
    onStopDrag();
}
