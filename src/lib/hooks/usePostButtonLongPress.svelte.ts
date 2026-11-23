import {
    stopVibration,
    triggerProgressiveVibration,
    triggerVibration,
} from "../utils/appDomUtils";

/** 長押し投稿に必要な時間 (ms) */
export const POST_LONG_PRESS_DURATION_MS = 250;
/** 未完了で離してから巻き戻りを始めるまでの遅延 (ms) */
const REWIND_DELAY_MS = 150;
/** 完了後にプログレスリングを残す時間 (ms) */
const COMPLETED_RING_HOLD_MS = 200;

interface UsePostButtonLongPressOptions {
    isDisabled(): boolean;
    onComplete(): void;
    /** 長押しが完了する前に指を離したとき */
    onReleaseEarly?(): void;
}

/**
 * タッチ操作での投稿ボタン長押しを管理する。
 * プログレスリングの進捗・バイブレーション・巻き戻しを持ち、
 * コンポーネントの破棄時には進行中の長押しを止めて投稿しない。
 */
export function usePostButtonLongPress({
    isDisabled,
    onComplete,
    onReleaseEarly,
}: UsePostButtonLongPressOptions) {
    let progress = $state(0);
    let ringVisible = $state(false);
    let tooltipBlocked = false;
    let pressing = false;
    let completed = false;
    let suppressNextClick = false;
    let disposed = false;
    let startTime = 0;
    let lastVibrationTime = 0;
    let frameId: number | null = null;
    let rewindTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let ringHoldTimeoutId: ReturnType<typeof setTimeout> | null = null;

    function cancelFrame(): void {
        if (frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
    }

    function clearTimers(): void {
        if (rewindTimeoutId !== null) {
            clearTimeout(rewindTimeoutId);
            rewindTimeoutId = null;
        }
        if (ringHoldTimeoutId !== null) {
            clearTimeout(ringHoldTimeoutId);
            ringHoldTimeoutId = null;
        }
    }

    function resetRing(): void {
        progress = 0;
        ringVisible = false;
        tooltipBlocked = false;
    }

    function animate(now: number): void {
        frameId = null;
        if (disposed) return;

        const nextProgress = Math.min(
            Math.max(0, now - startTime) / POST_LONG_PRESS_DURATION_MS,
            1,
        );
        progress = nextProgress;

        // プログレッシブバイブレーション: 間隔が60ms→20msに縮まり体感強度が増す
        const vibrationInterval = 60 - nextProgress * 40;
        if (now - lastVibrationTime >= vibrationInterval) {
            triggerProgressiveVibration(nextProgress);
            lastVibrationTime = now;
        }

        if (nextProgress >= 1) {
            pressing = false;
            completed = true;
            triggerVibration(120);
            onComplete();
            ringHoldTimeoutId = setTimeout(() => {
                ringHoldTimeoutId = null;
                resetRing();
            }, COMPLETED_RING_HOLD_MS);
            return;
        }

        frameId = requestAnimationFrame(animate);
    }

    function start(event: PointerEvent): void {
        suppressNextClick = event.pointerType === "touch";
        if (event.pointerType !== "touch") return;
        if (disposed || isDisabled()) return;

        // 巻き戻し中や完了直後の表示が残っていても新しい長押しを優先する
        cancelFrame();
        clearTimers();

        pressing = true;
        completed = false;
        startTime = performance.now();
        lastVibrationTime = 0;
        progress = 0;
        ringVisible = true;
        tooltipBlocked = true;

        frameId = requestAnimationFrame(animate);
    }

    function cancel(): void {
        // pointerup の後に pointerleave も届くため、離した最初の 1 回だけ扱う
        if (!pressing) return;
        pressing = false;

        // 長押し未完了で指を離した場合
        onReleaseEarly?.();
        stopVibration();
        cancelFrame();

        const progressAtCancel = progress;
        rewindTimeoutId = setTimeout(() => {
            rewindTimeoutId = null;
            const rewindDuration = progressAtCancel * POST_LONG_PRESS_DURATION_MS;
            if (rewindDuration <= 0) {
                resetRing();
                return;
            }

            const rewindStart = performance.now();
            const rewind = (now: number) => {
                frameId = null;
                const ratio = Math.min(
                    Math.max(0, now - rewindStart) / rewindDuration,
                    1,
                );
                progress = progressAtCancel * (1 - ratio);
                if (ratio < 1) {
                    frameId = requestAnimationFrame(rewind);
                } else {
                    resetRing();
                }
            };
            frameId = requestAnimationFrame(rewind);
        }, REWIND_DELAY_MS);
    }

    function preventCompletedReleaseDefault(event: Event): void {
        if (!completed) return;
        if (event instanceof PointerEvent && event.pointerType !== "touch") return;
        event.preventDefault();
    }

    /** タッチ後の click を 1 回だけ無視する（投稿は長押しで行う） */
    function consumeSuppressedClick(): boolean {
        if (!suppressNextClick) return false;
        suppressNextClick = false;
        return true;
    }

    function dispose(): void {
        disposed = true;
        if (pressing) {
            stopVibration();
        }
        pressing = false;
        cancelFrame();
        clearTimers();
    }

    $effect(() => dispose);

    return {
        get progress() {
            return progress;
        },
        get ringVisible() {
            return ringVisible;
        },
        /** 長押し中は投稿ボタンのツールチップを開かない */
        get blocksTooltip() {
            return tooltipBlocked;
        },
        start,
        cancel,
        preventCompletedReleaseDefault,
        consumeSuppressedClick,
    };
}
