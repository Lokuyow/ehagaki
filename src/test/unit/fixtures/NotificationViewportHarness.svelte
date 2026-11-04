<script lang="ts">
    import { useNotificationViewport } from '../../../lib/hooks/useNotificationViewport.svelte';
    let { ready, active = () => true }: { ready: (api: ReturnType<typeof useNotificationViewport>, root: HTMLElement, list: HTMLElement) => void; active?: () => boolean } = $props();
    let root = $state<HTMLElement | null>(null), list = $state<HTMLElement | null>(null);
    const viewport = useNotificationViewport(() => list, () => active());
    $effect(() => { if (root && list) { viewport.observe(list); ready(viewport, root, list); } });
</script>
<div class="dialog-content" bind:this={root}><div bind:this={list}></div></div>
