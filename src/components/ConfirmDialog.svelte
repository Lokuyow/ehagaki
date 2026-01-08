<script lang="ts">
    import type { Snippet } from "svelte";
    import { _ } from "svelte-i18n";
    import { Dialog } from "bits-ui";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
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
        /** 確認ボタンに自動フォーカス（デフォルト: false） */
        autofocusConfirm?: boolean;
        /** 確認時のコールバック */
        onConfirm: () => void;
        /** キャンセル時のコールバック */
        onCancel?: () => void;
        /** Dialog.Contentに追加するCSSクラス */
        contentClass?: string;
        /** 本文のカスタムレンダリング */
        children?: Snippet;
        /** 確認ボタンのカスタムレンダリング */
        renderConfirm?: Snippet;
        /** キャンセルボタンのカスタムレンダリング */
        renderCancel?: Snippet;
        /** ブラウザ履歴に追加するか（デフォルト: false） */
        addToHistory?: boolean;
    }

    let {
        open = $bindable(false),
        title,
        description,
        confirmLabel,
        cancelLabel,
        confirmVariant = "danger",
        confirmDisabled = false,
        autofocusConfirm = false,
        onConfirm,
        onCancel,
        contentClass = "confirm-dialog",
        children,
        renderConfirm,
        renderCancel,
        addToHistory = false,
    }: Props = $props();

    // デフォルトのラベル（ローカライズ）
    const defaultConfirmLabel = $derived(confirmLabel || $_("common.ok"));
    const defaultCancelLabel = $derived(cancelLabel || $_("common.cancel"));
    const defaultTitle = $derived(title || $_("common.confirm"));

    // ダイアログを閉じるハンドラ
    function handleClose() {
        open = false;
        onCancel?.();
    }

    // 確認ボタンのハンドラ
    function handleConfirm() {
        onConfirm();
        open = false;
    }

    // ブラウザ履歴統合
    useDialogHistory(() => open, handleClose, addToHistory);
</script>

<DialogWrapper
    bind:open
    onOpenChange={(newOpen) => !newOpen && handleClose()}
    title={defaultTitle}
    {description}
    {contentClass}
>
    <div class="confirm-dialog-content">
        {#if children}
            {@render children()}
        {:else}
            <div class="confirm-dialog-message">
                {description}
            </div>
        {/if}
        <div class="confirm-dialog-buttons">
            {#if renderConfirm}
                {@render renderConfirm()}
            {:else}
                <Button
                    className="btn-confirm"
                    variant={confirmVariant}
                    shape="square"
                    onClick={handleConfirm}
                    disabled={confirmDisabled}
                    autofocus={autofocusConfirm}
                >
                    {defaultConfirmLabel}
                </Button>
            {/if}

            {#if renderCancel}
                {@render renderCancel()}
            {:else}
                <Dialog.Close>
                    {#snippet child({ props })}
                        <Button
                            {...props}
                            className="btn-cancel"
                            variant="secondary"
                            shape="square"
                            onClick={handleClose}
                        >
                            {defaultCancelLabel}
                        </Button>
                    {/snippet}
                </Dialog.Close>
            {/if}
        </div>
    </div>
</DialogWrapper>

<style>
    .confirm-dialog-content {
        text-align: center;
    }
    .confirm-dialog-message {
        margin: 46px 0;
        color: var(--text);
        font-size: 1.2rem;
        font-weight: bold;
        line-height: 1.5;
        word-break: auto-phrase;
    }
    .confirm-dialog-buttons {
        display: flex;
        justify-content: center;
        height: 60px;
        gap: 8px;

        :global(button) {
            flex: 1;
            font-size: 1.2rem;
        }

        :global(.btn-cancel.secondary.square) {
            @media (prefers-color-scheme: dark) {
                border: none;
            }
        }
    }
</style>
