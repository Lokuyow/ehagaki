<script lang="ts">
    import DialogWrapper from "../../../components/DialogWrapper.svelte";

    interface Props {
        open?: boolean;
        restoreFocusOnClose?: boolean;
        returnFocus?: HTMLElement | null;
        onOpen?: () => void;
    }

    let {
        open = $bindable(false),
        restoreFocusOnClose = $bindable(true),
        returnFocus = null,
        onOpen,
    }: Props = $props();

    export function closeWithoutRestore(): void {
        restoreFocusOnClose = false;
        open = false;
    }
</script>

<button type="button" onclick={() => { onOpen?.(); open = true; }}>open-dialog</button>
<DialogWrapper
    bind:open
    title="Dialog title"
    description="Dialog description"
    bind:restoreFocusOnClose
    {returnFocus}
>
    <button type="button" data-testid="inside">inside</button>
    <button type="button" onclick={() => { open = false; }}>close-dialog</button>
</DialogWrapper>
