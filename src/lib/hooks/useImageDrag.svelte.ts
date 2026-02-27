/**
 * useImageDrag.svelte.ts
 *
 * Svelte 5 runes フック: Tiptapエディター内の画像ノードに対する
 * タッチベースのドラッグ&ドロップ処理をカプセル化します。
 *
 * 責務:
 * - ロングプレスによるドラッグ開始
 * - タッチムーブによるドラッグプレビュー更新・ドロップゾーンのハイライト
 * - タッチエンドによるドラッグ完了・通常タップへのフォールバック
 * - コンポーネント破棄時のタイマー・プレビューのクリーンアップ
 */

import { LONG_PRESS_DELAY, MOVE_CANCEL_THRESHOLD } from '../constants';
import {
    dispatchDragEvent,
    highlightDropZoneAtPosition,
    createDragPreview,
    updateDragPreview,
    removeDragPreview,
    checkMoveThreshold,
} from '../utils/mediaNodeUtils';
import { isTouchDevice, blurEditorAndBody } from '../utils/appDomUtils';
import { getEventPosition } from '../utils/appUtils';

// ============================================================
// 型定義
// ============================================================

interface DragStateRef {
    isDragging: boolean;
    longPressTimeout: ReturnType<typeof setTimeout> | null;
    startTarget: HTMLElement | null;
    startPos: { x: number; y: number };
    preview: HTMLElement | null;
}

export interface UseImageDragOptions {
    /** リアクティブな buttonElement getter（$stateバインディング） */
    getButtonElement: () => HTMLButtonElement | undefined;
    /** Tiptapノードの現在位置を返す getter */
    getPos: () => number | undefined;
    /** ドラッグ中の状態ストア（共有参照） */
    dragState: DragStateRef;
    /** isPlaceholder のリアクティブ getter */
    getIsPlaceholder: () => boolean;
    /** node.attrs のリアクティブ getter */
    getNodeAttrs: () => Record<string, any>;
    /**
     * タップ・クリック処理コールバック
     * タッチエンド時に短押しと判定された場合に呼び出される
     */
    handleInteraction: (event: MouseEvent | TouchEvent, isTouch: boolean) => void;
}

// ============================================================
// フック本体
// ============================================================

export function useImageDrag({
    getButtonElement,
    getPos,
    dragState,
    getIsPlaceholder,
    getNodeAttrs,
    handleInteraction,
}: UseImageDragOptions): { cleanup: () => void } {
    const isTouchCapable = isTouchDevice();

    // --------------------------------------------------------
    // ドラッグ補助関数
    // --------------------------------------------------------

    function startDrag(): void {
        dragState.isDragging = true;
        dispatchDragEvent('start', {}, getPos);
        dragState.preview = createDragPreview(
            dragState.startTarget!,
            dragState.startPos.x,
            dragState.startPos.y,
            getIsPlaceholder(),
        );
    }

    function clearLongPress(): void {
        if (dragState.longPressTimeout) {
            clearTimeout(dragState.longPressTimeout);
            dragState.longPressTimeout = null;
        }
        dragState.startTarget = null;
    }

    function startLongPress(element: HTMLElement, x: number, y: number): void {
        clearLongPress();
        dragState.startPos = { x, y };
        dragState.startTarget = element;
        dragState.longPressTimeout = setTimeout(() => {
            startDrag();
        }, LONG_PRESS_DELAY);
    }

    // --------------------------------------------------------
    // タッチイベントハンドラー
    // --------------------------------------------------------

    function handleTouchStart(event: TouchEvent): void {
        if (event.touches.length !== 1) return;
        blurEditorAndBody();
        const pos = getEventPosition(event);
        startLongPress(event.currentTarget as HTMLElement, pos.x, pos.y);
    }

    function handleTouchMove(event: TouchEvent): void {
        if (event.touches.length !== 1) {
            clearLongPress();
            return;
        }

        const pos = getEventPosition(event);

        // ロングプレス中に移動閾値を超えたらキャンセル
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
        dispatchDragEvent('move', {
            touchX: pos.x,
            touchY: pos.y,
            nodePos: getPos(),
        });
    }

    function handleTouchEnd(event: TouchEvent): void {
        if (dragState.longPressTimeout) {
            clearLongPress();
            if (!dragState.isDragging) {
                // 短押し → 通常のタップとして処理
                handleInteraction(event, true);
                return;
            }
        }

        if (!dragState.isDragging) return;

        event.preventDefault();
        const pos = getEventPosition(event);
        const elementBelow = document.elementFromPoint(pos.x, pos.y);

        if (elementBelow) {
            const dropZone = elementBelow.closest('.drop-zone-indicator');
            const targetDropPos = dropZone?.getAttribute('data-drop-pos');
            const attrs = getNodeAttrs();

            dispatchDragEvent('end', {
                nodeData: { type: 'image', attrs, pos: getPos() },
                dropX: pos.x,
                dropY: pos.y,
                target: elementBelow,
                dropPosition: targetDropPos ? parseInt(targetDropPos, 10) : null,
            });
        }

        dragState.isDragging = false;
        removeDragPreview(dragState.preview);
        dragState.preview = null;
    }

    // --------------------------------------------------------
    // イベントリスナーのライフサイクル管理（$effect）
    // --------------------------------------------------------

    $effect(() => {
        const el = getButtonElement();
        if (!isTouchCapable || !el) return;

        el.addEventListener('touchstart', handleTouchStart, { passive: false });
        el.addEventListener('touchmove', handleTouchMove, { passive: false });
        el.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            el.removeEventListener('touchstart', handleTouchStart);
            el.removeEventListener('touchmove', handleTouchMove);
            el.removeEventListener('touchend', handleTouchEnd);
            // クリーンアップ（アンマウント時）
            clearLongPress();
            removeDragPreview(dragState.preview);
            dragState.preview = null;
        };
    });

    // コンポーネント外から呼べる手動クリーンアップ（onDestroy用）
    function cleanup(): void {
        clearLongPress();
        removeDragPreview(dragState.preview);
    }

    return { cleanup };
}
