<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Button from "./Button.svelte";

    export let show: boolean = false;
    export let onClose: () => void;
    export let ariaLabel: string = "Dialog";
    export let className: string = "";
    export let showFooter: boolean = false;
    export let useHistory: boolean = true;

    // --- history連動用 ---
    let pushedHistory = false;
    let ignoreNextPop = false;
    let popHandler: ((ev: PopStateEvent) => void) | null = null;
    let dialogId = Math.random().toString(36).substr(2, 9);
    let isClosing = false; // 閉じる処理中フラグ

    function pushDialogState() {
        if (!useHistory || pushedHistory) return;
        try {
            window.history.pushState({ ehagakiDialog: true, dialogId }, "");
            pushedHistory = true;
        } catch (e) {
            pushedHistory = false;
        }
    }

    function closeViaHistory() {
        if (isClosing) return; // 重複実行防止
        isClosing = true;

        const doClose = () => {
            try {
                onClose?.();
            } finally {
                isClosing = false;
            }
        };

        if (useHistory && pushedHistory) {
            // 自分で戻す popstate は無視しつつ、即時にUIを閉じる
            ignoreNextPop = true;
            pushedHistory = false;
            try {
                window.history.back();
            } catch (e) {
                // ignore
            }
            // 外部に閉じる通知
            setTimeout(doClose, 0);
        } else {
            setTimeout(doClose, 0);
        }
    }

    // showの変化を監視してhistory操作
    $: if (show && !pushedHistory && useHistory) {
        // ダイアログが開く時
        pushDialogState();
        isClosing = false;
    } else if (!show && pushedHistory && useHistory && !isClosing) {
        // 外部からプログラム的に閉じられた時
        ignoreNextPop = true;
        pushedHistory = false;
        setTimeout(() => {
            try {
                window.history.back();
            } catch (e) {
                ignoreNextPop = false;
            }
        }, 0);
    }

    onMount(() => {
        if (!useHistory) return;

        popHandler = (ev: PopStateEvent) => {
            if (ignoreNextPop) {
                ignoreNextPop = false;
                isClosing = false;
                return;
            }

            // ブラウザ戻るなどのpopstateで開いている場合は閉じる
            if (show && pushedHistory) {
                pushedHistory = false;
                isClosing = true;
                setTimeout(() => {
                    onClose?.();
                    isClosing = false;
                }, 0);
            }
        };

        window.addEventListener("popstate", popHandler);
    });

    onDestroy(() => {
        if (popHandler) {
            window.removeEventListener("popstate", popHandler);
            popHandler = null;
        }

        // コンポーネント破棄時のクリーンアップ
        if (pushedHistory && useHistory && !isClosing) {
            ignoreNextPop = true;
            pushedHistory = false;
            try {
                window.history.back();
            } catch (e) {
                // ignore
            }
        }
        isClosing = false;
    });
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
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .dialog-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-height: 85svh;
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
