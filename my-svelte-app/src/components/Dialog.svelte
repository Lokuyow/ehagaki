<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Button from "./Button.svelte";

    export let show: boolean = false;
    export let onClose: () => void;
    export let ariaLabel: string = "Dialog";
    export let className: string = "";
    export let showFooter: boolean = false;

    // --- history連動用 ---
    let pushedHistory = false; // このコンポーネントが pushState したか
    let ignoreNextPop = false; // programmatic に閉じるために次の pop を無視するフラグ
    let popHandler: (ev: PopStateEvent) => void;

    const externalOnClose = onClose; // 参照保存（親からの関数）

    function pushDialogState() {
        try {
            window.history.pushState({ ehagakiDialog: true }, "");
            pushedHistory = true;
        } catch (e) {
            // pushState が使えない環境では何もしない
            pushedHistory = false;
        }
    }

    function closeViaHistory() {
        // UI 側 (オーバーレイクリック / ESC / close ボタン) から閉じるときは history.back() を実行し、
        // popstate 側で externalOnClose を発火させる（ブラウザ戻ると同等の挙動）
        if (pushedHistory && window.history.length > 0) {
            ignoreNextPop = false; // ユーザー操作由来の close の場合は ignore しない
            window.history.back();
            // 万一 pop が発生しない場合のタイムアウトフォールバック
            setTimeout(() => {
                if (show) {
                    // pop が来ずまだ開いているなら直接閉じる
                    ignoreNextPop = true;
                    externalOnClose?.();
                    pushedHistory = false;
                }
            }, 400);
        } else {
            // 履歴エントリを作っていない場合は直接閉じる
            externalOnClose?.();
        }
    }

    // 外部/親コンポーネントが show を false にしてプログラム的に閉じた時は
    // 我々が push した履歴をクリアするために history.back() を行い、pop を無視する
    $: if (!show && pushedHistory) {
        // programmatic close -> ignore the upcoming pop
        ignoreNextPop = true;
        try {
            window.history.back();
        } catch (e) {
            // fallback: 直接呼ぶ
            ignoreNextPop = false;
            externalOnClose?.();
            pushedHistory = false;
        }
    }

    onMount(() => {
        popHandler = (ev: PopStateEvent) => {
            // 履歴戻しが来たらダイアログを閉じる（ただしフラグで制御）
            if (ignoreNextPop) {
                ignoreNextPop = false;
                pushedHistory = false;
                return;
            }
            if (pushedHistory) {
                pushedHistory = false;
                // pop による戻り（ユーザーの戻る操作） → ダイアログを閉じる
                externalOnClose?.();
            }
        };
        window.addEventListener("popstate", popHandler);
    });

    onDestroy(() => {
        if (popHandler) window.removeEventListener("popstate", popHandler);
    });

    // ダイアログが開くたびに履歴エントリを追加
    $: if (show) {
        pushDialogState();
    }
</script>

{#if show}
    <div
        class="dialog-overlay"
        role="presentation"
        on:click={closeViaHistory}
        aria-label={ariaLabel}
    >
        <div
            class="dialog {className} {$$props.class || ''}"
            role="dialog"
            aria-modal="true"
            tabindex="0"
            on:click|stopPropagation
            on:keydown={(e) => {
                if (e.key === "Escape") closeViaHistory();
            }}
        >
            <div class="dialog-content">
                <slot />
            </div>
            {#if showFooter}
                <div class="dialog-footer">
                    <slot name="footer">
                        <Button
                            className="modal-close btn-circle"
                            on:click={closeViaHistory}
                            ariaLabel="閉じる"
                        >
                            <div
                                class="xmark-icon svg-icon"
                                aria-label="閉じる"
                            ></div>
                        </Button>
                    </slot>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--dialog-overlay);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    .dialog {
        background: var(--dialog);
        color: var(--text);
        width: 100%;
        max-width: 500px;
        max-height: 90svh;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .dialog-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 16px;
        box-sizing: border-box;
    }

    .dialog-footer {
        width: 100%;
        height: 48px;
        border-top: 1px solid var(--border-hr);
        display: flex;
        justify-content: center;
        align-items: center;

        :global(.modal-close) {
            background-color: transparent;
            border: none;
            border-radius: 0;
            width: 100%;
            height: 47px;

            .xmark-icon {
                mask-image: url("/ehagaki/icons/xmark-solid-full.svg");
            }
        }
    }
</style>
