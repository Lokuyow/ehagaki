/**
 * useDialogHistory - ダイアログのブラウザ履歴統合フック
 *
 * ダイアログの開閉をブラウザの履歴APIと連携させ、
 * 戻るボタンでダイアログを閉じられるようにする。
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
 *
 *   let open = $state(false);
 *   const handleClose = () => { open = false; onClose?.(); };
 *
 *   // 履歴統合を有効化
 *   useDialogHistory(() => open, handleClose);
 * </script>
 * ```
 */

import { onMount, onDestroy } from "svelte";
import { generateSimpleUUID } from "../utils/appUtils";

/**
 * ダイアログのブラウザ履歴統合を管理するフック
 *
 * @param getOpen - 現在のダイアログ開閉状態を返すゲッター関数
 * @param onClose - ダイアログを閉じる際に呼び出されるコールバック
 * @param enabled - 履歴統合を有効にするかどうか（デフォルト: true）
 */
export function useDialogHistory(
    getOpen: () => boolean,
    onClose: () => void,
    enabled: boolean = true,
): void {
    // SSR環境では何もしない
    if (typeof window === "undefined") return;

    // 履歴統合が無効の場合は何もしない
    if (!enabled) return;

    let historyStateId: string | null = null;
    let wasOpen = false;

    // popstateイベント（戻る/進むボタン）のハンドラ
    const handlePopState = (event: PopStateEvent) => {
        const currentOpen = getOpen();
        // ダイアログが開いていて、履歴IDが一致しない場合は閉じる
        if (currentOpen && event.state?.modalId !== historyStateId) {
            onClose();
        }
    };

    // $effect で開閉状態の変化を監視
    $effect(() => {
        const currentOpen = getOpen();

        // 開く遷移（false -> true）の時だけpushState
        if (currentOpen && !wasOpen) {
            historyStateId = `modal-${generateSimpleUUID()}`;
            history.pushState(
                { modalId: historyStateId },
                "",
                window.location.href,
            );
            wasOpen = true;
            return;
        }

        // 閉じる遷移（true -> false）の時だけback
        if (!currentOpen && wasOpen) {
            const shouldGoBack = history.state?.modalId === historyStateId;
            historyStateId = null;
            wasOpen = false;
            if (shouldGoBack) {
                history.back();
            }
        }
    });

    onMount(() => {
        window.addEventListener("popstate", handlePopState);
    });

    onDestroy(() => {
        window.removeEventListener("popstate", handlePopState);
        // コンポーネント破棄時の履歴操作（現在の状態が自分のダイアログの場合のみ）
        if (wasOpen && history.state?.modalId === historyStateId) {
            history.back();
        }
    });
}
