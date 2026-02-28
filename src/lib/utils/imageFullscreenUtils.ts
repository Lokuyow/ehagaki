import { ZoomCalculation, ZoomParams, MousePosition, DragState, PinchState } from "../types";
import { TIMING, ZOOM_CONFIG, MOMENTUM_CONFIG } from "../constants"; // MOMENTUM_CONFIG を追加
import { transformStore } from "../../stores/imageFullscreenStore.svelte";
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

// image-container要素のスタイルを設定
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

// 即座にスタイルを反映させるためにtransitionを無効化してtransformを設定
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

// カーソルスタイルをズームレベルに応じて設定
export function setImageCursorByScale(scale: number, imageContainerElement?: HTMLDivElement) {
    const el = imageContainerElement ?? document.querySelector(".image-container") as HTMLDivElement | null;
    if (!el) return;
    el.style.cursor = scale > ZOOM_CONFIG.DEFAULT_SCALE ? "grab" : "default";
}

// オーバーレイ要素のカーソルスタイルをズームレベルに応じて設定
export function setOverlayCursorByScale(scale: number, containerElement?: HTMLDivElement) {
    const el = containerElement ?? document.querySelector(".fullscreen-overlay") as HTMLDivElement | null;
    if (!el) return;
    el.style.cursor = scale > ZOOM_CONFIG.DEFAULT_SCALE ? "grab" : "default";
}

// transformStoreのtransitionフラグを設定
export function setTransition(enable: boolean) {
    transformStore.setTransition(enable);
}

// body要素のuser-selectスタイルを設定
export function setBodyUserSelect(enable: boolean) {
    const value = enable ? "" : "none";
    setBodyStyle("user-select", value);
    setBodyStyle("-webkit-user-select", value);
}

// タップタイマーをクリア
export function clearTapTimer(tapTimeoutId: number | null) {
    if (tapTimeoutId !== null) {
        clearTimeout(tapTimeoutId);
        // 呼び出し元でtapTimeoutIdをnullにすること
    }
}

// 画像とコンテナの境界制約を更新
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

// 全ての状態をリセット
export function resetAllStates(
    animationFrameId: number | null,
    pinchAnimationFrameId: number | null,
    dragState: DragState,
    pinchState: PinchState,
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
    clearTapTimer(tapTimeoutId);
    clearBodyStyles();
}

// ダブルタップ/ダブルクリックの処理
export function handleTap(
    lastTapTime: number,
    lastTapPosition: { x: number; y: number } | null,
    tapTimeoutId: number | null,
    clientX: number,
    clientY: number,
    isTouch: boolean,
    onDoubleTap: (x: number, y: number) => void
): { isDoubleTap: boolean; newLastTapTime: number; newLastTapPosition: { x: number; y: number } | null; newTapTimeoutId: number | null } {
    if (!isTouch) {
        // マウスイベントではondblclickに任せるため、ダブルタップ検知をスキップ
        return { isDoubleTap: false, newLastTapTime: lastTapTime, newLastTapPosition: lastTapPosition, newTapTimeoutId: tapTimeoutId };
    }

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

// ポインタダウンの処理
export function handlePointerStart(
    transformStateScale: number,
    transformStateTranslate: { x: number; y: number },
    dragState: DragState,
    lastTapTime: number,
    lastTapPosition: { x: number; y: number } | null,
    tapTimeoutId: number | null,
    clientX: number,
    clientY: number,
    isTouch: boolean,
    onDoubleTap: (x: number, y: number) => void
): { newDragState: DragState; newLastTapTime: number; newLastTapPosition: { x: number; y: number } | null; newTapTimeoutId: number | null } {
    let newDragState = { ...dragState };
    let newLastTapTime = lastTapTime;
    let newLastTapPosition = lastTapPosition;
    let newTapTimeoutId = tapTimeoutId;

    const tapResult = handleTap(lastTapTime, lastTapPosition, tapTimeoutId, clientX, clientY, isTouch, onDoubleTap);
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

// ポインタムーブの処理
export function handlePointerMove(
    dragState: DragState,
    clientX: number,
    clientY: number,
    isTouch: boolean,
    dragStartThreshold: number,
    transformStateScale: number,
    onStartDrag: (x: number, y: number) => void,
    onUpdateDrag: (x: number, y: number) => void
): { newDragState: DragState; touchMoved: boolean } {
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

// ポインタアップの処理
export function handlePointerEnd(
    _dragState: DragState,
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

// =============================================================================
// Math Utilities (Pure Functions)
// =============================================================================

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function isNearScale(scale: number, target: number, threshold: number): boolean {
    return Math.abs(scale - target) < threshold;
}

/**
 * 2点間の距離を計算
 */
export function calculateDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * ピンチズーム用のパラメータを計算
 */
export function calculatePinchZoomParams(
    currentScale: number,
    scaleRatio: number,
    centerX: number,
    centerY: number,
    containerElement: HTMLElement
): ZoomParams {
    const rect = containerElement.getBoundingClientRect();
    const center = calculateElementCenter(rect);

    return {
        scale: clamp(currentScale * scaleRatio, 0.5, 5),
        offsetX: centerX - rect.left - center.x,
        offsetY: centerY - rect.top - center.y
    };
}

/**
 * ピンチズームの詳細な計算
 */
export function calculatePinchZoom(
    currentScale: number,
    currentTranslate: MousePosition,
    scaleRatio: number,
    centerX: number,
    centerY: number,
    containerElement: HTMLElement
): ZoomCalculation {
    const rect = containerElement.getBoundingClientRect();
    const center = calculateElementCenter(rect);
    const offsetX = centerX - rect.left - center.x;
    const offsetY = centerY - rect.top - center.y;

    const newScale = clamp(currentScale * scaleRatio, 0.5, 5);
    const actualScaleRatio = newScale / currentScale;

    return {
        newScale,
        newTranslate: {
            x: currentTranslate.x * actualScaleRatio - offsetX * (actualScaleRatio - 1),
            y: currentTranslate.y * actualScaleRatio - offsetY * (actualScaleRatio - 1)
        }
    };
}

// =============================================================================
// Coordinate and Zoom Utilities (Pure Functions)
// =============================================================================

/**
 * マウスイベントから相対座標を取得
 */
export function getMousePosition(event: MouseEvent): MousePosition {
    return {
        x: event.clientX,
        y: event.clientY
    };
}

/**
 * 要素の矩形情報から中心座標を計算
 */
export function calculateElementCenter(rect: DOMRect): MousePosition {
    return {
        x: rect.width / 2,
        y: rect.height / 2
    };
}

/**
 * ドラッグ速度を計算
 */
export function calculateDragVelocity(
    lastPosition: MousePosition,
    currentPosition: MousePosition,
    timeDelta: number
): MousePosition {
    const dx = currentPosition.x - lastPosition.x;
    const dy = currentPosition.y - lastPosition.y;
    return {
        x: dx / timeDelta * 16, // 約60FPS相当の速度に正規化
        y: dy / timeDelta * 16,
    };
}

/**
 * 慣性アニメーションを適用（減衰しながら移動）
 */
export function applyMomentumAnimation(
    initialVelocity: MousePosition,
    initialTranslate: MousePosition,
    scale: number,
    onUpdate: (translate: MousePosition) => void,
    onComplete: () => void,
    animationId: number | null,
    setAnimationId: (id: number | null) => void
) {
    if (animationId !== null) cancelAnimationFrame(animationId);
    let velocity = { ...initialVelocity };
    let translate = { ...initialTranslate };
    const friction = MOMENTUM_CONFIG.FRICTION; // 定数を使用
    const minVelocity = MOMENTUM_CONFIG.MIN_VELOCITY; // 定数を使用

    function animate() {
        // 速度を減衰
        velocity.x *= friction;
        velocity.y *= friction;

        // 速度が小さくなったら停止
        if (Math.abs(velocity.x) < minVelocity && Math.abs(velocity.y) < minVelocity) {
            setAnimationId(null);
            onComplete();
            return;
        }

        // 位置を更新
        translate.x += velocity.x;
        translate.y += velocity.y;

        // 境界制約を適用
        const constrainedTranslate = transformStore.applyBoundaryConstraints(translate, scale);
        translate = constrainedTranslate;

        onUpdate(translate);
        setAnimationId(requestAnimationFrame(animate));
    }

    setAnimationId(requestAnimationFrame(animate));
}