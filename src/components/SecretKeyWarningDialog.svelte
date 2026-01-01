<script lang="ts">
    import { _ } from "svelte-i18n";
    import { Dialog } from "bits-ui";
    import Button from "./Button.svelte";
    import DialogWrapper from "./DialogWrapper.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";

    interface Props {
        show?: boolean;
        onConfirm: () => void;
        onCancel: () => void;
    }

    let { show = $bindable(false), onConfirm, onCancel }: Props = $props();

    // ダイアログを閉じるハンドラ
    function handleClose() {
        show = false;
        onCancel?.();
    }

    // ブラウザ履歴統合（このダイアログは履歴に追加しない）
    useDialogHistory(() => show, handleClose, false);
</script>

<DialogWrapper
    bind:open={show}
    onOpenChange={(open) => !open && handleClose()}
    title={$_("postComponent.warning")}
    description={$_("postComponent.secret_key_detected")}
    contentClass="secretkey-warning-dialog"
>
    <div class="secretkey-dialog-content">
        <div class="secretkey-dialog-message">
            {$_("postComponent.secret_key_detected")}
        </div>
        <div class="secretkey-dialog-buttons">
            <Button
                className="btn-confirm"
                variant="danger"
                shape="square"
                onClick={onConfirm}
            >
                {$_("postComponent.post")}
            </Button>
            <Dialog.Close>
                {#snippet child({ props })}
                    <Button
                        {...props}
                        className="btn-cancel"
                        variant="secondary"
                        shape="square"
                    >
                        {$_("postComponent.cancel")}
                    </Button>
                {/snippet}
            </Dialog.Close>
        </div>
    </div>
</DialogWrapper>

<style>
    .secretkey-dialog-content {
        text-align: center;
    }
    .secretkey-dialog-message {
        margin: 46px 0;
        color: var(--text);
        font-size: 1.2rem;
        font-weight: bold;
        line-height: 1.5;
        word-break: auto-phrase;
    }
    .secretkey-dialog-buttons {
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
