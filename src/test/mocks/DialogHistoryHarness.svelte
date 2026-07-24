<script lang="ts">
    import { useDialogHistory } from "../../lib/hooks/useDialogHistory.svelte";

    interface Props {
        onHistoryClose: () => void | boolean;
    }

    let { onHistoryClose }: Props = $props();
    let open = $state(false);
    let closeAttempts = $state(0);

    function handleHistoryClose(): void | boolean {
        closeAttempts += 1;
        const result = onHistoryClose();
        if (result !== false) {
            open = false;
        }
        return result;
    }

    useDialogHistory(
        () => open,
        handleHistoryClose,
    );
</script>

<button type="button" onclick={() => (open = true)}>open</button>
<button type="button" onclick={() => (open = false)}>close</button>
<output data-testid="open-state">{open ? "open" : "closed"}</output>
<output data-testid="close-attempts">{closeAttempts}</output>
