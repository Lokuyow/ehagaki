<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Button from "./Button.svelte";
    import { generateSimpleUUID } from "../lib/utils/appUtils";

    interface Props {
        show?: boolean;
        onClose: () => void;
        ariaLabel?: string;
        className?: string;
        // 'class' prop is not explicitly accepted; use className or $$restProps instead
        showFooter?: boolean;
        useHistory?: boolean;
        children?: import("svelte").Snippet<[any]>;
        footer?: import("svelte").Snippet<[any]>;
        [evt: string]: any; // Svelteイベント用
    }

    let {
        show = $bindable(false),
        onClose,
        ariaLabel = "Dialog",
        className = "",
        showFooter = false,
        useHistory = true,
        children,
        footer,
    }: Props = $props();

    let isModalVisible = $state(false);
    let historyStateId: string | null = $state(null);

    // スロットプロップで提供する閉じる関数
    const closeModal = () => {
        show = false;
    };

    // popstateイベント（戻る/進むボタン）のハンドラ
    const handlePopState = (event: PopStateEvent) => {
        // 現在のモーダルの履歴IDと一致しない場合、モーダルを閉じる
        if (isModalVisible && event.state?.modalId !== historyStateId) {
            closeModal();
        }
    };

    // showプロパティの変更を監視する（開閉の遷移時のみ履歴操作）
    $effect(() => {
        if (typeof window === "undefined") {
            isModalVisible = show;
            if (!show) onClose?.();
            return;
        }

        if (!useHistory) {
            isModalVisible = show;
            if (!show) onClose?.();
            return;
        }

        // 開く遷移（false -> true）の時だけpushState
        if (show && !isModalVisible) {
            isModalVisible = true;
            if (!historyStateId) {
                historyStateId = `modal-${generateSimpleUUID()}`;
                history.pushState(
                    { modalId: historyStateId },
                    "",
                    window.location.href,
                );
            }
            return;
        }

        // 閉じる遷移（true -> false）の時だけback
        if (!show && isModalVisible) {
            const shouldGoBack = history.state?.modalId === historyStateId;
            isModalVisible = false;
            historyStateId = null;
            if (shouldGoBack) history.back();
            onClose?.();
        }
    });

    onMount(() => {
        if (useHistory) {
            window.addEventListener("popstate", handlePopState);
        }
    });

    onDestroy(() => {
        if (useHistory) {
            window.removeEventListener("popstate", handlePopState);
            // コンポーネント破棄時の履歴操作（現在の状態が自分のモーダルの場合のみ）
            if (isModalVisible && history.state?.modalId === historyStateId) {
                history.back();
            }
        }
    });
</script>

{#if isModalVisible}
    <div
        class="dialog-overlay"
        role="presentation"
        onclick={closeModal}
        aria-label={ariaLabel}
    >
        <div
            class="dialog {className}"
            class:dialog={true}
            role="dialog"
            aria-modal="true"
            tabindex="0"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => {
                if (e.key === "Escape") closeModal();
            }}
        >
            <div class="dialog-content">
                {@render children?.({ close: closeModal })}
            </div>
            {#if showFooter}
                <div class="dialog-footer">
                    {#if footer}{@render footer({ close: closeModal })}{:else}
                        <Button
                            className="modal-close"
                            variant="default"
                            shape="square"
                            onClick={closeModal}
                            ariaLabel="閉じる"
                        >
                            <div
                                class="xmark-icon svg-icon"
                                aria-label="閉じる"
                            ></div>
                        </Button>
                    {/if}
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
        overflow-y: auto;
    }

    .dialog-footer {
        width: 100%;
        height: 48px;
        border-top: 1px solid var(--border-hr);
        display: flex;
        justify-content: center;
        align-items: center;

        :global(.modal-close) {
            background-color: var(--dialog);
            border: none;
            border-radius: 0;
            width: 100%;
            height: 47px;

            @media (min-width: 601px) {
                @media (prefers-color-scheme: light) {
                    :global(&:hover:not(:disabled)) {
                        background-color: color-mix(
                            in srgb,
                            var(--dialog),
                            black 5%
                        );
                    }
                }

                @media (prefers-color-scheme: dark) {
                    :global(&:hover:not(:disabled)) {
                        background-color: color-mix(
                            in srgb,
                            var(--dialog),
                            white 5%
                        );
                    }
                }
            }

            .xmark-icon {
                mask-image: url("/icons/xmark-solid-full.svg");
            }
        }
    }
</style>
