/**
 * useBalloonMessage - バルーンメッセージ一元管理フック
 *
 * すべてのバルーンメッセージ（info/tips/success/error/serviceWorkerError/debug）を一元管理し、
 * 優先度に基づいて最終的なメッセージを提供します。
 *
 * 優先度: serviceWorkerError > debug > info/tips > error > success
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   const balloon = useBalloonMessage(() => $_, () => localeInitialized);
 * </script>
 *
 * <HeaderComponent balloonMessage={balloon.finalMessage} />
 * <KeyboardButtonBar onPostButtonTap={() => balloon.showTips()} />
 * ```
 */

import { onMount } from "svelte";
import { BalloonMessageManager } from "../balloonMessageManager";
import type { BalloonMessage } from "../types";
import { editorState, updatePostStatus } from "../../stores/editorStore.svelte";
import { shouldShowDevLog } from "../debug";

interface UseBalloonMessageOptions {
    /** バルーン自動非表示のミリ秒（デフォルト: 3000） */
    hideDelay?: number;
    /** visibilitychangeのデバウンス間隔ms（デフォルト: 1000） */
    debounceMs?: number;
}

interface UseBalloonMessageReturn {
    /** 優先度を適用した最終バルーンメッセージ（null = 非表示） */
    readonly finalMessage: BalloonMessage | null;
    /** Tipsメッセージを表示 */
    showTips: () => void;
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

    // $stateにすることで、設定後に依存エフェクトが再実行される
    let balloonManager = $state<BalloonMessageManager | null>(null);

    // 各メッセージ種別の状態（優先度: serviceWorkerError > debug > info/tips > error > success）
    let infoMessage = $state<BalloonMessage | null>(null);
    let successMessage = $state<BalloonMessage | null>(null);
    let serviceWorkerErrorMessage = $state<BalloonMessage | null>(null);
    let debugMessage = $state<BalloonMessage | null>(null);
    let hasProcessedSuccess = $state(false);

    // タイムアウト管理（直接管理）
    let infoHideTimeout: ReturnType<typeof setTimeout> | null = null;
    let successHideTimeout: ReturnType<typeof setTimeout> | null = null;

    // visibilitychange状態
    let hasShownInitial = false;
    let wasHidden = false;
    let lastVisibilityChange = 0;

    // 投稿エラーメッセージ（postStatusから自動更新）
    const errorMessage = $derived(
        editorState.postStatus.error && balloonManager
            ? balloonManager.createErrorMessage(editorState.postStatus.message)
            : null
    );

    // 最終的な表示メッセージ（優先度順）
    const finalMessage = $derived(
        serviceWorkerErrorMessage ||
        debugMessage ||
        infoMessage ||
        errorMessage ||
        successMessage ||
        null
    );

    function scheduleInfoHide() {
        if (infoHideTimeout) clearTimeout(infoHideTimeout);
        infoHideTimeout = setTimeout(() => {
            infoMessage = null;
            infoHideTimeout = null;
        }, hideDelay);
    }

    function showInfoMessage() {
        if (!balloonManager || infoMessage) return;
        infoMessage = balloonManager.createMessage("info");
        scheduleInfoHide();
    }

    function showTips() {
        if (!balloonManager || infoMessage) return;
        const msg = balloonManager.createMessage("tips");
        if (!msg.message) return;
        infoMessage = msg;
        scheduleInfoHide();
    }

    function showSuccess() {
        if (!balloonManager || hasProcessedSuccess) return;
        successMessage = balloonManager.createMessage("success");
        hasProcessedSuccess = true;
        if (successHideTimeout) clearTimeout(successHideTimeout);
        successHideTimeout = setTimeout(() => {
            successMessage = null;
            hasProcessedSuccess = false;
            successHideTimeout = null;
            updatePostStatus({
                ...editorState.postStatus,
                success: false,
                message: "",
                completed: false,
            });
        }, hideDelay);
    }

    function clearSuccess() {
        if (successMessage || hasProcessedSuccess) {
            successMessage = null;
            hasProcessedSuccess = false;
            if (successHideTimeout) {
                clearTimeout(successHideTimeout);
                successHideTimeout = null;
            }
        }
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
            !infoMessage
        ) {
            showInfoMessage();
            lastVisibilityChange = now;
        }
        wasHidden = document.visibilityState === "hidden";
    }

    function handleSharedError() {
        if (typeof window === "undefined") return;
        const urlParams = new URLSearchParams(window.location.search);
        const sharedError = urlParams.get("error");
        if (!sharedError || urlParams.get("shared") !== "true") return;

        const skipBalloonErrors = [
            "processing-error",
            "no-image",
            "upload-failed",
            "network-error",
            "client-error",
        ];

        function clearUrlParams() {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("error");
            newUrl.searchParams.delete("shared");
            window.history.replaceState({}, "", newUrl.toString());
        }

        if (skipBalloonErrors.includes(sharedError)) {
            setTimeout(clearUrlParams, 1000);
            return;
        }

        let errorText = "";
        switch (sharedError) {
            case "messaging-error":
                errorText = "Service Workerとの通信でエラーが発生しました。ページを更新してもう一度お試しください。";
                break;
            case "window-error":
                errorText = "新しいウィンドウの作成に失敗しました";
                break;
            default:
                setTimeout(clearUrlParams, 1000);
                return;
        }

        serviceWorkerErrorMessage = { type: "error", message: errorText };
        setTimeout(() => {
            clearUrlParams();
            setTimeout(() => {
                serviceWorkerErrorMessage = null;
            }, 5000);
        }, 1000);
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
        if (getLocaleReady() && balloonManager && !infoMessage && !hasShownInitial) {
            showInfoMessage();
            hasShownInitial = true;
        }
    });

    // postStatus監視: 投稿成功バルーン表示
    $effect(() => {
        const postStatus = editorState.postStatus;
        if (
            postStatus.success &&
            postStatus.completed &&
            !successMessage &&
            !hasProcessedSuccess &&
            balloonManager
        ) {
            showSuccess();
        }
    });

    // postStatus監視: 成功状態がリセットされたらバルーンをクリア
    $effect(() => {
        const postStatus = editorState.postStatus;
        if (!postStatus.success || !postStatus.completed) {
            clearSuccess();
        }
    });

    // マウント時の初期化（イベントリスナー・SWエラーチェック・デバッグ登録）
    onMount(() => {
        wasHidden = document.visibilityState === "hidden";
        document.addEventListener("visibilitychange", handleVisibilityChange);
        handleSharedError();
        if (shouldShowDevLog()) {
            (window as any).showInfoBalloonDebug = (msg: string) => {
                debugMessage = { type: "info", message: msg };
            };
            (window as any).hideInfoBalloonDebug = () => {
                debugMessage = null;
            };
        }
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            balloonManager?.dispose();
            if (infoHideTimeout) clearTimeout(infoHideTimeout);
            if (successHideTimeout) clearTimeout(successHideTimeout);
        };
    });

    return {
        get finalMessage() { return finalMessage; },
        showTips,
    };
}
