<script lang="ts">
    import { _ } from 'svelte-i18n';
    import PostPreviewFooterActionButton from './PostPreviewFooterActionButton.svelte';
    interface Props { onReact: () => boolean | Promise<boolean>; }
    let { onReact }: Props = $props();
    let pending = $state(false);
    let failed = $state(false);
    async function react() {
        if (pending) return;
        pending = true; failed = false;
        try { failed = await onReact() === false; } catch { failed = true; }
        finally { pending = false; }
    }
</script>
<PostPreviewFooterActionButton type="button" className="post-history-action-button post-preview-action-button reaction-compose-button"
    ariaLabel={$_('reaction.action')} tooltipContent={$_(failed ? 'reaction.targetFailed' : 'reaction.action')}
    shape="circle" contentLayout="icon" disabled={pending} onClick={react}>
    <div class:failed class="reaction-compose-icon svg-icon" aria-hidden="true"></div>
</PostPreviewFooterActionButton>
{#if failed}<span class="reaction-action-error" role="alert">{$_('reaction.targetFailed')}</span>{/if}
<style>
    :global(.reaction-compose-button) { flex: 0 0 36px; min-width: 36px; }
    .reaction-compose-icon { --svg: currentColor; width: 20px; height: 20px; mask-image: url('/icons/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg'); }
    .failed { color: var(--danger); }
    .reaction-action-error { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); }
</style>
