<script lang="ts">
    import Button from "../../../components/Button.svelte";

    let {
        onClick = undefined,
        floatingMessage = "コピーしました",
        floatingMessageDuration = 1800,
    }: {
        onClick?: (event: MouseEvent) => unknown | Promise<unknown>;
        floatingMessage?: string;
        floatingMessageDuration?: number;
    } = $props();
</script>

<Button
    ariaLabel="copy"
    {onClick}
    {floatingMessage}
    {floatingMessageDuration}
>
    <span>copy</span>
</Button>
