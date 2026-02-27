/**
 * useLongPress - タッチ長押し・タップ判定フック
 *
 * 指定要素に対するタッチ長押しとタップを検出します。
 * 移動距離が閾値を超えた場合は長押し判定をキャンセルします。
 * `$effect` で要素の変化に追従するため、条件付きレンダリングにも対応します。
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   let el: HTMLElement | undefined = $state();
 *
 *   useLongPress(() => el, {
 *     onLongPress: (x, y) => startDrag(x, y),
 *     onTap: (event) => handleTap(event),
 *   });
 * </script>
 * ```
 */

import { LONG_PRESS_DELAY, MOVE_CANCEL_THRESHOLD } from "../constants";
import { checkMoveThreshold } from "../utils/mediaNodeUtils";

interface UseLongPressOptions {
    /** 長押し成立時に呼ばれるコールバック */
    onLongPress?: (x: number, y: number, event: TouchEvent) => void;
    /** 素早いタップ（長押し未成立の指離し）時に呼ばれるコールバック */
    onTap?: (event: TouchEvent) => void;
    /** 長押し判定までの遅延 ms（デフォルト: LONG_PRESS_DELAY） */
    delay?: number;
    /** この距離（px）を超えて移動したら長押しをキャンセル（デフォルト: MOVE_CANCEL_THRESHOLD） */
    moveThreshold?: number;
}

/**
 * タッチ長押し・タップを検出するフック
 *
 * @param getElement - 対象要素を返すゲッター関数（`$state` 変数を返すと要素変化に追従）
 * @param options - コールバック・閾値オプション
 */
export function useLongPress(
    getElement: () => HTMLElement | undefined,
    options: UseLongPressOptions,
): void {
    const delay = options.delay ?? LONG_PRESS_DELAY;
    const moveThreshold = options.moveThreshold ?? MOVE_CANCEL_THRESHOLD;

    let longPressTimeout: ReturnType<typeof setTimeout> | null = null;
    let startPos = { x: 0, y: 0 };

    function cancel() {
        if (longPressTimeout !== null) {
            clearTimeout(longPressTimeout);
            longPressTimeout = null;
        }
    }

    function handleTouchStart(event: TouchEvent) {
        if (event.touches.length !== 1) {
            cancel();
            return;
        }

        const touch = event.touches[0];
        startPos = { x: touch.clientX, y: touch.clientY };

        cancel();
        longPressTimeout = setTimeout(() => {
            longPressTimeout = null;
            options.onLongPress?.(startPos.x, startPos.y, event);
        }, delay);
    }

    function handleTouchMove(event: TouchEvent) {
        if (event.touches.length !== 1) {
            cancel();
            return;
        }

        // 長押しタイマーが動いている間だけ移動距離チェック
        if (longPressTimeout === null) return;

        const touch = event.touches[0];

        if (checkMoveThreshold(touch.clientX, touch.clientY, startPos.x, startPos.y, moveThreshold)) {
            cancel();
        }
    }

    function handleTouchEnd(event: TouchEvent) {
        if (longPressTimeout !== null) {
            // タイマー発火前に指を離した → タップ
            cancel();
            options.onTap?.(event);
        }
    }

    // $effect: 要素が変わるたびにリスナーを再登録。条件付きレンダリング対応。
    $effect(() => {
        const el = getElement();
        if (!el) return;

        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchmove", handleTouchMove, { passive: true });
        el.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            cancel();
            el.removeEventListener("touchstart", handleTouchStart);
            el.removeEventListener("touchmove", handleTouchMove);
            el.removeEventListener("touchend", handleTouchEnd);
        };
    });
}
