<script lang="ts">
    import { _ } from "svelte-i18n";
    import { nosskey } from "../lib/nosskeyService.svelte";

    let { onReconnect, reconnecting = false }: {
        onReconnect?: () => void;
        reconnecting?: boolean;
    } = $props();
</script>

{#if nosskey.state.notice && !nosskey.state.visible}
    <div class="notice" role="status">
        <span>{$_(`nosskey.${nosskey.state.notice}`)}</span>
        {#if nosskey.state.notice === "no_key" || nosskey.state.notice === "identity_mismatch"}
            <a href="https://nosskey.app/" target="_blank" rel="noopener noreferrer">{$_("nosskey.open_site")}</a>
        {/if}
        {#if nosskey.state.notice === "identity_mismatch" && onReconnect}
            <button type="button" disabled={reconnecting} onclick={onReconnect}>{$_("nosskey.reconnect")}</button>
        {/if}
        <button type="button" onclick={nosskey.clearNotice}>{$_("global.close")}</button>
    </div>
{/if}

<style>
    .notice { display: flex; flex-wrap: wrap; gap: 8px; }
    .notice span { width: 100%; }
</style>
