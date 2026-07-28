<script lang="ts">
    import Button from "../../components/Button.svelte";

    interface Props {
        ariaLabel?: string;
        text?: string;
    }

    let { ariaLabel = undefined, text = "" }: Props = $props();
</script>

<Button ariaLabel={ariaLabel}>{text}</Button>
