<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import Dialog from "./Dialog.svelte";

    interface Props {
        show?: boolean;
        onConfirm: () => void;
        onCancel: () => void;
    }

    let { show = $bindable(false), onConfirm, onCancel }: Props = $props();
</script>

<Dialog bind:show ariaLabel={$_("postComponent.warning")} onClose={onCancel}>
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
            <Button
                className="btn-cancel"
                variant="secondary"
                shape="square"
                onClick={onCancel}
            >
                {$_("postComponent.cancel")}
            </Button>
        </div>
    </div>
</Dialog>

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
