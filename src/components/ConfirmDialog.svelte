<script lang="ts">
    import type { Snippet } from "svelte";
    import { _ } from "svelte-i18n";
    import { AlertDialog } from "bits-ui";
    import Button from "./Button.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";

    interface Props {
        /** ダイアログの開閉状態 */
        open?: boolean;
        /** open状態変更時のコールバック */
        onOpenChange?: (open: boolean) => void;
        /** ダイアログのタイトル（スクリーンリーダー用） */
        title?: string;
        /** ダイアログの本文（短文）*/
        description: string;
        /** 確認ボタンのラベル（デフォルト: "OK"） */
        confirmLabel?: string;
        /** キャンセルボタンのラベル（デフォルト: "キャンセル"） */
        cancelLabel?: string;
        /** 確認ボタンのバリアント */
        confirmVariant?: "danger" | "primary" | "secondary";
        /** 確認ボタンの無効化 */
        confirmDisabled?: boolean;
        /** 確認時のコールバック */
        onConfirm: () => void | Promise<void>;
        /** キャンセル時のコールバック */
        onCancel?: () => void;
        /** Dialog.Contentに追加するCSSクラス */
        contentClass?: string;
        /** 本文のカスタムレンダリング */
        children?: Snippet;
        /** ブラウザ履歴に追加するか（デフォルト: true） */
        addToHistory?: boolean;
        /** 確認処理後に閉じるか（デフォルト: true） */
        closeOnConfirm?: boolean;
        /** 非同期確認中のキャンセル・外側クリック・Escape・履歴closeを禁止するか */
        preventCloseWhileConfirming?: boolean;
    }

    let {
        open = $bindable(false),
        title,
        description,
        confirmLabel,
        cancelLabel,
        confirmVariant = "danger",
        confirmDisabled = false,
        onOpenChange,
        onConfirm,
        onCancel,
        contentClass = "confirm-dialog",
        children,
        addToHistory = true,
        closeOnConfirm = true,
        preventCloseWhileConfirming = false,
    }: Props = $props();

    // デフォルトのラベル（ローカライズ）
    const defaultConfirmLabel = $derived(confirmLabel || $_("common.ok"));
    const defaultCancelLabel = $derived(cancelLabel || $_("common.cancel"));
    const defaultTitle = $derived(title || $_("common.confirm"));

    let isConfirming = $state(false);
    let isCancelling = $state(false);
    let closeLocked = $derived(
        preventCloseWhileConfirming && isConfirming,
    );

    function setOpen(newOpen: boolean) {
        if (open === newOpen) return;
        open = newOpen;
        onOpenChange?.(newOpen);
    }

    function handleOpenChange(newOpen: boolean) {
        if (!newOpen && closeLocked) {
            open = true;
            return;
        }

        if (open !== newOpen) {
            open = newOpen;
            onOpenChange?.(newOpen);
        }

        if (!newOpen && !isConfirming && !isCancelling) {
            onCancel?.();
        }
    }

    function handleCloseAutoFocus(event: Event) {
        event.preventDefault();
    }

    function handleCancel() {
        if (closeLocked) return;
        isCancelling = true;
        onCancel?.();
        setOpen(false);
        queueMicrotask(() => {
            isCancelling = false;
        });
    }

    function handleHistoryClose(): boolean {
        if (closeLocked) return false;
        handleCancel();
        return true;
    }

    function handleEscapeKeydown(event: KeyboardEvent) {
        if (closeLocked) {
            event.preventDefault();
        }
    }

    // 確認ボタンのハンドラ
    async function handleConfirm() {
        if (isConfirming) return;
        isConfirming = true;
        let confirmed = false;
        try {
            await onConfirm();
            confirmed = true;
        } finally {
            isConfirming = false;
        }
        if (confirmed && closeOnConfirm) {
            setOpen(false);
        }
    }

    // ブラウザ履歴統合
    useDialogHistory(
        () => open,
        handleHistoryClose,
        () => addToHistory,
    );
</script>

<AlertDialog.Root bind:open onOpenChange={handleOpenChange}>
    <AlertDialog.Portal>
        <AlertDialog.Overlay class="confirm-dialog-overlay" />
        <AlertDialog.Content
            class={`confirm-dialog-shell ${contentClass}`}
            preventScroll={false}
            interactOutsideBehavior={closeLocked ? "ignore" : "close"}
            onEscapeKeydown={handleEscapeKeydown}
            onCloseAutoFocus={handleCloseAutoFocus}
        >
            <AlertDialog.Title class="visually-hidden">
                {defaultTitle}
            </AlertDialog.Title>

            <AlertDialog.Description class="visually-hidden">
                {description}
            </AlertDialog.Description>

            <div class="confirm-dialog-content">
                {#if children}
                    {@render children()}
                {:else}
                    <div class="confirm-dialog-message">
                        {description}
                    </div>
                {/if}

                <div class="confirm-dialog-buttons">
                    <AlertDialog.Action>
                        {#snippet child({ props })}
                            <Button
                                {...props}
                                className="btn-confirm"
                                variant={confirmVariant}
                                shape="square"
                                onClick={handleConfirm}
                                disabled={confirmDisabled || isConfirming}
                            >
                                {defaultConfirmLabel}
                            </Button>
                        {/snippet}
                    </AlertDialog.Action>

                    <AlertDialog.Cancel>
                        {#snippet child({ props })}
                            <Button
                                {...props}
                                className="btn-cancel"
                                variant="secondary"
                                shape="square"
                                onClick={handleCancel}
                                disabled={closeLocked}
                            >
                                {defaultCancelLabel}
                            </Button>
                        {/snippet}
                    </AlertDialog.Cancel>
                </div>
            </div>
        </AlertDialog.Content>
    </AlertDialog.Portal>
</AlertDialog.Root>

<style>
    :global(.confirm-dialog-overlay) {
        position: fixed;
        inset: 0;
        background-color: var(--dialog-bg-overlay);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    :global(.confirm-dialog-shell) {
        position: fixed;
        top: 50%;
        left: 50%;
        translate: -50% -50%;
        background-color: var(--dialog-bg2);
        color: var(--text);
        width: 100%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 101;
        outline: none;
    }

    .confirm-dialog-content {
        width: 100%;
        max-height: 85svh;
        padding: 16px;
        overflow-y: auto;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    :global(.confirm-dialog-message) {
        margin: 46px 0;
        color: var(--text);
        font-size: 1.2rem;
        font-weight: bold;
        line-height: 1.5;
    }

    .confirm-dialog-buttons {
        display: flex;
        justify-content: center;
        width: auto;
        height: 60px;
        gap: 8px;

        :global(button) {
            flex: 1;
            font-size: 1.2rem;
        }

        :global(:root.dark .btn-cancel.secondary.square) {
            border: none;
        }
    }

    :global(.visually-hidden) {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
</style>
