import { writable } from 'svelte/store';
import { ZOOM_CONFIG } from '../constants';

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
        updateScale: (scale: number) => update(state => ({ ...state, scale })),
        updateTranslate: (translate: Position) => update(state => ({ ...state, translate })),
        updateState: (newState: Partial<TransformState>) => update(state => ({ ...state, ...newState }))
    };
}

export const transformStore = createTransformStore();

export function createDragState(): DragState {
    return {
        isDragging: false,
        start: { x: 0, y: 0 },
        startTranslate: { x: 0, y: 0 }
    };
}
