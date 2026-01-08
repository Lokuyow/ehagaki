<script lang="ts">
    import { _ } from "svelte-i18n";
    import ConfirmDialog from "./ConfirmDialog.svelte";

    interface Props {
        show?: boolean;
        onConfirm: () => void;
        onCancel: () => void;
    }

    let { show = $bindable(false), onConfirm, onCancel }: Props = $props();
</script>

<ConfirmDialog
    bind:open={show}
    title={$_("postComponent.warning")}
    description={$_("postComponent.secret_key_detected")}
    confirmLabel={$_("postComponent.post")}
    cancelLabel={$_("postComponent.cancel")}
    confirmVariant="danger"
    {onConfirm}
    {onCancel}
    contentClass="secretkey-warning-dialog"
    addToHistory={false}
/>
