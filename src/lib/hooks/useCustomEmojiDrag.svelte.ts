import { LONG_PRESS_DELAY, MOVE_CANCEL_THRESHOLD } from '../constants';
import { getEventPosition } from '../utils/appUtils';
import { isTouchDevice } from '../utils/appDomUtils';
import {
    checkMoveThreshold,
    createDragPreview,
    highlightDropZoneAtPosition,
    removeDragPreview,
    updateDragPreview,
} from '../utils/mediaNodeUtils';

interface CustomEmojiDragStateRef {
    isDragging: boolean;
    longPressTimeout: ReturnType<typeof setTimeout> | null;
    startTarget: HTMLElement | null;
    startPos: { x: number; y: number };
    preview: HTMLElement | null;
}

export interface UseCustomEmojiDragOptions {
    getElement: () => HTMLElement | undefined;
    getPos: () => number | undefined;
    dragState: CustomEmojiDragStateRef;
    getNodeAttrs: () => Record<string, any>;
}

function dispatchCustomEmojiDragEvent(
    type: 'start' | 'move' | 'end',
    detail: Record<string, unknown>,
): void {
    const eventMap = {
        start: 'touch-custom-emoji-drag-start',
        move: 'touch-custom-emoji-drag-move',
        end: 'touch-custom-emoji-drop',
    };

    window.dispatchEvent(
        new CustomEvent(eventMap[type], {
            detail,
            bubbles: true,
            cancelable: true,
        }),
    );
}

export function useCustomEmojiDrag({
    getElement,
    getPos,
    dragState,
    getNodeAttrs,
}: UseCustomEmojiDragOptions): { cleanup: () => void } {
    const isTouchCapable = isTouchDevice();

    function clearLongPress(): void {
        if (dragState.longPressTimeout) {
            clearTimeout(dragState.longPressTimeout);
            dragState.longPressTimeout = null;
        }
        dragState.startTarget = null;
    }

    function startDrag(): void {
        const nodePos = getPos();
        if (typeof nodePos !== 'number' || !dragState.startTarget) return;

        dragState.isDragging = true;
        dispatchCustomEmojiDragEvent('start', { nodePos });
        dragState.preview = createDragPreview(
            dragState.startTarget,
            dragState.startPos.x,
            dragState.startPos.y,
        );
    }

    function handleTouchStart(event: TouchEvent): void {
        if (event.touches.length !== 1) return;
        const pos = getEventPosition(event);
        clearLongPress();
        dragState.startPos = { x: pos.x, y: pos.y };
        dragState.startTarget = event.currentTarget as HTMLElement;
        dragState.longPressTimeout = setTimeout(startDrag, LONG_PRESS_DELAY);
    }

    function handleTouchMove(event: TouchEvent): void {
        if (event.touches.length !== 1) {
            clearLongPress();
            return;
        }

        const pos = getEventPosition(event);
        if (!dragState.isDragging && dragState.longPressTimeout) {
            if (
                checkMoveThreshold(
                    pos.x,
                    pos.y,
                    dragState.startPos.x,
                    dragState.startPos.y,
                    MOVE_CANCEL_THRESHOLD,
                )
            ) {
                clearLongPress();
                return;
            }
        }

        if (!dragState.isDragging) return;

        event.preventDefault();
        updateDragPreview(dragState.preview, pos.x, pos.y);
        highlightDropZoneAtPosition(pos.x, pos.y);
        dispatchCustomEmojiDragEvent('move', {
            touchX: pos.x,
            touchY: pos.y,
            nodePos: getPos(),
        });
    }

    function handleTouchEnd(event: TouchEvent): void {
        if (dragState.longPressTimeout) {
            clearLongPress();
        }

        if (!dragState.isDragging) return;

        event.preventDefault();
        const pos = getEventPosition(event);
        const elementBelow = document.elementFromPoint(pos.x, pos.y);
        const dropZone = elementBelow?.closest('.drop-zone-indicator');
        const targetDropPos = dropZone?.getAttribute('data-drop-pos');

        dispatchCustomEmojiDragEvent('end', {
            nodeData: {
                type: 'customEmoji',
                attrs: getNodeAttrs(),
                pos: getPos(),
            },
            dropX: pos.x,
            dropY: pos.y,
            target: elementBelow,
            dropPosition: targetDropPos ? Number.parseInt(targetDropPos, 10) : null,
        });

        dragState.isDragging = false;
        removeDragPreview(dragState.preview);
        dragState.preview = null;
    }

    function handlePointerDown(event: PointerEvent): void {
        if (event.pointerType === 'touch' || event.button !== 0) return;

        event.preventDefault();
        event.stopPropagation();
        clearLongPress();
        dragState.startPos = { x: event.clientX, y: event.clientY };
        dragState.startTarget = event.currentTarget as HTMLElement;

        window.addEventListener('pointermove', handlePointerMove, { passive: false });
        window.addEventListener('pointerup', handlePointerUp, { passive: false });
        window.addEventListener('pointercancel', handlePointerUp, { passive: false });
    }

    function handlePointerMove(event: PointerEvent): void {
        if (event.pointerType === 'touch') return;

        if (!dragState.isDragging) {
            if (
                !checkMoveThreshold(
                    event.clientX,
                    event.clientY,
                    dragState.startPos.x,
                    dragState.startPos.y,
                    MOVE_CANCEL_THRESHOLD,
                )
            ) {
                return;
            }
            startDrag();
        }

        event.preventDefault();
        updateDragPreview(dragState.preview, event.clientX, event.clientY);
        highlightDropZoneAtPosition(event.clientX, event.clientY);
        dispatchCustomEmojiDragEvent('move', {
            touchX: event.clientX,
            touchY: event.clientY,
            nodePos: getPos(),
        });
    }

    function removePointerListeners(): void {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
    }

    function handlePointerUp(event: PointerEvent): void {
        if (event.pointerType === 'touch') return;
        removePointerListeners();

        if (!dragState.isDragging) {
            dragState.startTarget = null;
            return;
        }

        event.preventDefault();
        const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
        const dropZone = elementBelow?.closest('.drop-zone-indicator');
        const targetDropPos = dropZone?.getAttribute('data-drop-pos');

        dispatchCustomEmojiDragEvent('end', {
            nodeData: {
                type: 'customEmoji',
                attrs: getNodeAttrs(),
                pos: getPos(),
            },
            dropX: event.clientX,
            dropY: event.clientY,
            target: elementBelow,
            dropPosition: targetDropPos ? Number.parseInt(targetDropPos, 10) : null,
        });

        dragState.isDragging = false;
        dragState.startTarget = null;
        removeDragPreview(dragState.preview);
        dragState.preview = null;
    }

    $effect(() => {
        const element = getElement();
        if (!element) return;

        element.addEventListener('pointerdown', handlePointerDown, { passive: false });
        if (isTouchCapable) {
            element.addEventListener('touchstart', handleTouchStart, { passive: false });
            element.addEventListener('touchmove', handleTouchMove, { passive: false });
            element.addEventListener('touchend', handleTouchEnd, { passive: false });
            element.addEventListener('touchcancel', handleTouchEnd, { passive: false });
        }

        return () => {
            element.removeEventListener('pointerdown', handlePointerDown);
            if (isTouchCapable) {
                element.removeEventListener('touchstart', handleTouchStart);
                element.removeEventListener('touchmove', handleTouchMove);
                element.removeEventListener('touchend', handleTouchEnd);
                element.removeEventListener('touchcancel', handleTouchEnd);
            }
            removePointerListeners();
            clearLongPress();
            removeDragPreview(dragState.preview);
            dragState.preview = null;
        };
    });

    function cleanup(): void {
        removePointerListeners();
        clearLongPress();
        removeDragPreview(dragState.preview);
        dragState.preview = null;
    }

    return { cleanup };
}
