import { LONG_PRESS_DELAY, MOVE_CANCEL_THRESHOLD } from '../constants';
import { getEventPosition } from '../utils/appUtils';
import { blurEditorAndBody, isTouchDevice } from '../utils/appDomUtils';
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
        blurEditorAndBody();
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

    $effect(() => {
        const element = getElement();
        if (!isTouchCapable || !element) return;

        element.addEventListener('touchstart', handleTouchStart, { passive: false });
        element.addEventListener('touchmove', handleTouchMove, { passive: false });
        element.addEventListener('touchend', handleTouchEnd, { passive: false });
        element.addEventListener('touchcancel', handleTouchEnd, { passive: false });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
            element.removeEventListener('touchcancel', handleTouchEnd);
            clearLongPress();
            removeDragPreview(dragState.preview);
            dragState.preview = null;
        };
    });

    function cleanup(): void {
        clearLongPress();
        removeDragPreview(dragState.preview);
        dragState.preview = null;
    }

    return { cleanup };
}
