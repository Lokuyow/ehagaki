import { writable } from 'svelte/store';
import { ZOOM_CONFIG } from '../constants';
import { clamp, isNearScale } from '../utils';

export interface Position {
    x: number;
    y: number;
}

export interface TransformState {
    scale: number;
    translate: Position;
}

export interface DragState {
    isDragging: boolean;
    start: Position;
    startTranslate: Position;
}

export interface PinchState {
    isPinching: boolean;
    initialDistance: number;
    initialScale: number;
    centerX: number;
    centerY: number;
}

export interface ZoomParams {
    scale: number;
    offsetX: number;
    offsetY: number;
}

function createTransformStore() {
    const { subscribe, set, update } = writable<TransformState>({
        scale: ZOOM_CONFIG.DEFAULT_SCALE,
        translate: { x: 0, y: 0 }
    });

    return {
        subscribe,
        reset: () => set({
            scale: ZOOM_CONFIG.DEFAULT_SCALE,
            translate: { x: 0, y: 0 }
        }),
        
        // ズーム操作を統合
        zoom: (params: ZoomParams) => update(state => {
            const newScale = clamp(params.scale, ZOOM_CONFIG.MIN_SCALE, ZOOM_CONFIG.MAX_SCALE);
            
            if (isNearScale(newScale, ZOOM_CONFIG.DEFAULT_SCALE, ZOOM_CONFIG.THRESHOLD)) {
                return { scale: ZOOM_CONFIG.DEFAULT_SCALE, translate: { x: 0, y: 0 } };
            }

            const scaleRatio = newScale / state.scale;
            return {
                scale: newScale,
                translate: {
                    x: state.translate.x * scaleRatio - params.offsetX * (scaleRatio - 1),
                    y: state.translate.y * scaleRatio - params.offsetY * (scaleRatio - 1)
                }
            };
        }),

        // ダブルクリック/タップズーム
        zoomToPoint: (targetScale: number, offsetX: number = 0, offsetY: number = 0) => 
            update(state => {
                if (state.scale >= ZOOM_CONFIG.RESET_THRESHOLD) {
                    return { scale: ZOOM_CONFIG.DEFAULT_SCALE, translate: { x: 0, y: 0 } };
                }
                return {
                    scale: targetScale,
                    translate: { x: -offsetX, y: -offsetY }
                };
            }),

        // ドラッグ操作
        drag: (deltaX: number, deltaY: number, startTranslate: Position) => 
            update(state => ({
                ...state,
                translate: {
                    x: startTranslate.x + deltaX,
                    y: startTranslate.y + deltaY
                }
            })),

        updateScale: (scale: number) => update(state => ({ ...state, scale })),
        updateTranslate: (translate: Position) => update(state => ({ ...state, translate })),
        updateState: (newState: Partial<TransformState>) => update(state => ({ ...state, ...newState }))
    };
}

export const transformStore = createTransformStore();

// ファクトリー関数
export function createDragState(): DragState {
    return {
        isDragging: false,
        start: { x: 0, y: 0 },
        startTranslate: { x: 0, y: 0 }
    };
}

export function createPinchState(): PinchState {
    return {
        isPinching: false,
        initialDistance: 0,
        initialScale: 1,
        centerX: 0,
        centerY: 0
    };
}
