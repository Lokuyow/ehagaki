/**
 * useBalloonMessage - ヘッダーバルーンメッセージ管理フック
 *
 * BalloonMessageManagerの初期化、表示/非表示制御、
 * visibilitychange連携を担当します。
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   const balloon = useBalloonMessage(() => $_, () => localeInitialized);
 * </script>
 *
 * {#if balloon.show}
 *   <BalloonMessage message={balloon.message} />
 * {/if}
 * ```
 */

import { onMount } from "svelte";
import { BalloonMessageManager } from "../balloonMessageManager";
import type { BalloonMessage } from "../types";

interface UseBalloonMessageOptions {
    /** バルーン自動非表示のミリ秒（デフォルト: 3000） */
    hideDelay?: number;
    /** visibilitychangeのデバウンス間隔ms（デフォルト: 1000） */
    debounceMs?: number;
}

interface UseBalloonMessageReturn {
    /** バルーン表示中か */
    readonly show: boolean;
    /** 現在のバルーンメッセージ */
    readonly message: BalloonMessage | null;
}

/**
 * バルーンメッセージの表示管理フック
 *
 * @param getTranslate - $_翻訳関数を返すゲッター
 * @param getLocaleReady - localeの初期化完了状態を返すゲッター
 * @param options - オプション設定
 */
export function useBalloonMessage(
    getTranslate: () => ((key: string, options?: any) => string) | undefined,
    getLocaleReady: () => boolean,
    options: UseBalloonMessageOptions = {}
): UseBalloonMessageReturn {
    const { hideDelay = 3000, debounceMs = 1000 } = options;

    let balloonManager: BalloonMessageManager | null = null;
    let showBalloon = $state(false);
    let balloonMessage = $state<BalloonMessage | null>(null);
    let hasShownInitial = false;
    let wasHidden = false;
    let lastVisibilityChange = 0;

    function showMessage() {
        if (!balloonManager || showBalloon) return;

        balloonMessage = balloonManager.createMessage("info");
        showBalloon = true;

        balloonManager.scheduleHide(() => {
            showBalloon = false;
            balloonMessage = null;
        }, hideDelay);
    }

    function handleVisibilityChange() {
        const now = Date.now();

        if (now - lastVisibilityChange < debounceMs) {
            wasHidden = document.visibilityState === "hidden";
            return;
        }

        if (
            document.visibilityState === "visible" &&
            wasHidden &&
            getLocaleReady() &&
            balloonManager &&
            !showBalloon
        ) {
            showMessage();
            lastVisibilityChange = now;
        }
        wasHidden = document.visibilityState === "hidden";
    }

    // BalloonMessageManagerの初期化
    $effect(() => {
        const translate = getTranslate();
        if (translate && !balloonManager) {
            balloonManager = new BalloonMessageManager(translate);
        }
    });

    // 初回バルーン表示
    $effect(() => {
        if (
            getLocaleReady() &&
            balloonManager &&
            !showBalloon &&
            !hasShownInitial
        ) {
            showMessage();
            hasShownInitial = true;
        }
    });

    // visibilitychangeイベントリスナー
    onMount(() => {
        wasHidden = document.visibilityState === "hidden";
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    });

    // クリーンアップ
    $effect(() => {
        return () => {
            balloonManager?.dispose();
        };
    });

    return {
        get show() { return showBalloon; },
        get message() { return balloonMessage; },
    };
}
