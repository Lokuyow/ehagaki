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
    useTransition?: boolean; // 追加: トランジション制御
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
        translate: { x: 0, y: 0 },
        useTransition: true // 追加: デフォルトでトランジション有効
    });

    return {
        subscribe,
        reset: () => set({
            scale: ZOOM_CONFIG.DEFAULT_SCALE,
            translate: { x: 0, y: 0 },
            useTransition: true // 常にトランジション有効でリセット
        }),

        // ズーム操作を統合（修正）
        zoom: (params: ZoomParams) => update(state => {
            const newScale = clamp(params.scale, ZOOM_CONFIG.MIN_SCALE, ZOOM_CONFIG.MAX_SCALE);

            if (isNearScale(newScale, ZOOM_CONFIG.DEFAULT_SCALE, ZOOM_CONFIG.THRESHOLD)) {
                return {
                    scale: ZOOM_CONFIG.DEFAULT_SCALE,
                    translate: { x: 0, y: 0 },
                    useTransition: state.useTransition // 既存のトランジション状態を保持
                };
            }

            const scaleRatio = newScale / state.scale;
            return {
                scale: newScale,
                translate: {
                    x: state.translate.x * scaleRatio - params.offsetX * (scaleRatio - 1),
                    y: state.translate.y * scaleRatio - params.offsetY * (scaleRatio - 1)
                },
                useTransition: state.useTransition // 既存のトランジション状態を保持
            };
        }),

        // ダブルクリック/タップズーム（改善）
        zoomToPoint: (targetScale: number, offsetX: number = 0, offsetY: number = 0) =>
            update(state => {
                if (state.scale >= ZOOM_CONFIG.RESET_THRESHOLD) {
                    // 縮小時は必ず中央にリセット（トランジション保持）
                    return {
                        scale: ZOOM_CONFIG.DEFAULT_SCALE,
                        translate: { x: 0, y: 0 },
                        useTransition: state.useTransition // 既存のトランジション状態を保持
                    };
                }

                // 拡大時は現在の移動量を考慮してオフセットを調整
                const scaleRatio = targetScale / state.scale;
                return {
                    scale: targetScale,
                    translate: {
                        x: state.translate.x * scaleRatio - offsetX * (scaleRatio - 1),
                        y: state.translate.y * scaleRatio - offsetY * (scaleRatio - 1)
                    },
                    useTransition: state.useTransition // 既存のトランジション状態を保持
                };
            }),

        // ドラッグ操作（修正）
        drag: (deltaX: number, deltaY: number, startTranslate: Position) =>
            update(state => ({
                ...state, // 既存のuseTransitionを含む全ての状態を保持
                translate: {
                    x: startTranslate.x + deltaX,
                    y: startTranslate.y + deltaY
                }
            })),

        // トランジション制御用メソッドを追加
        setTransition: (useTransition: boolean) =>
            update(state => ({ ...state, useTransition })),

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
