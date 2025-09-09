import { ZOOM_CONFIG } from '../../constants';
import { clamp, isNearScale } from '../../utils';

export interface Position {
    x: number;
    y: number;
}

export interface TransformState {
    scale: number;
    translate: Position;
    useTransition?: boolean;
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

let transform = $state<TransformState>({
    scale: ZOOM_CONFIG.DEFAULT_SCALE,
    translate: { x: 0, y: 0 },
    useTransition: true
});

export const transformStore = {
    get state() {
        return transform;
    },
    reset() {
        transform.scale = ZOOM_CONFIG.DEFAULT_SCALE;
        transform.translate = { x: 0, y: 0 };
        transform.useTransition = true;
    },
    setDirectState(newState: TransformState) {
        transform.scale = newState.scale;
        transform.translate = { ...newState.translate };
        transform.useTransition = newState.useTransition ?? transform.useTransition;
    },
    zoom(params: ZoomParams) {
        const newScale = clamp(params.scale, ZOOM_CONFIG.MIN_SCALE, ZOOM_CONFIG.MAX_SCALE);
        if (isNearScale(newScale, ZOOM_CONFIG.DEFAULT_SCALE, ZOOM_CONFIG.THRESHOLD)) {
            this.reset();
            return;
        }
        const scaleRatio = newScale / transform.scale;
        transform.translate.x = transform.translate.x * scaleRatio - params.offsetX * (scaleRatio - 1);
        transform.translate.y = transform.translate.y * scaleRatio - params.offsetY * (scaleRatio - 1);
        transform.scale = newScale;
    },
    zoomToPoint(targetScale: number, offsetX = 0, offsetY = 0) {
        if (transform.scale >= ZOOM_CONFIG.RESET_THRESHOLD) {
            this.reset();
            return;
        }
        const scaleRatio = targetScale / transform.scale;
        transform.translate.x = transform.translate.x * scaleRatio - offsetX * (scaleRatio - 1);
        transform.translate.y = transform.translate.y * scaleRatio - offsetY * (scaleRatio - 1);
        transform.scale = targetScale;
    },
    drag(deltaX: number, deltaY: number, startTranslate: Position) {
        transform.translate.x = startTranslate.x + deltaX;
        transform.translate.y = startTranslate.y + deltaY;
    },
    setTransition(useTransition: boolean) {
        transform.useTransition = useTransition;
    }
};

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
