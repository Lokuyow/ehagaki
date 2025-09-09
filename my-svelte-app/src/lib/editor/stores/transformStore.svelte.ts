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

export interface BoundaryConstraints {
    imageWidth: number;
    imageHeight: number;
    containerWidth: number;
    containerHeight: number;
}

let transform = $state<TransformState>({
    scale: ZOOM_CONFIG.DEFAULT_SCALE,
    translate: { x: 0, y: 0 },
    useTransition: true
});

let boundaryConstraints: BoundaryConstraints | null = null;

function applyBoundaryConstraints(translate: Position, scale: number): Position {
    if (!boundaryConstraints) {
        return translate;
    }

    const { imageWidth, imageHeight, containerWidth, containerHeight } = boundaryConstraints;
    const scaledImageWidth = imageWidth * scale;
    const scaledImageHeight = imageHeight * scale;

    let x = translate.x;
    let y = translate.y;

    // 横方向の制限 - 常に適用
    if (scaledImageWidth > containerWidth) {
        const maxX = (scaledImageWidth - containerWidth) / 2;
        const minX = -maxX;
        x = clamp(x, minX, maxX);
    } else {
        x = 0;
    }

    // 縦方向の制限 - 常に適用（画像の中心まで見切れても良いように緩い制限）
    const maxY = scaledImageHeight / 2;
    const minY = -maxY;
    y = clamp(y, minY, maxY);

    return { x, y };
}

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
        const newTranslate = { x: startTranslate.x + deltaX, y: startTranslate.y + deltaY };
        const constrainedTranslate = applyBoundaryConstraints(newTranslate, transform.scale);
        transform.translate.x = constrainedTranslate.x;
        transform.translate.y = constrainedTranslate.y;
    },
    setTransition(useTransition: boolean) {
        transform.useTransition = useTransition;
    },
    setBoundaryConstraints(constraints: BoundaryConstraints | null) {
        boundaryConstraints = constraints;
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
