<script lang="ts">
    import { onDestroy, untrack } from 'svelte';
    import { _ } from 'svelte-i18n';
    import DialogWrapper from './DialogWrapper.svelte';
    import Button from './Button.svelte';
    import { resolveAppAssetUrl } from '../lib/appAssetUrl';
    import { createComponentLoader } from '../lib/appComponentLoader';
    import { importNotificationContent } from '../lib/notificationDialogImports';
    import type { NotificationDialogProps } from '../lib/notificationDialogTypes';
    import type { AppComponentLoadFailure } from '../lib/appComponentLoaders';
    import { useDialogHistory } from '../lib/hooks/useDialogHistory.svelte';
    interface Props extends NotificationDialogProps {
        isStaleAssetReloadRequired?: () => boolean;
        onLoadFailure?: (failure: AppComponentLoadFailure) => void;
    }
    let { show = $bindable(false), onClose, returnFocus = null, isStaleAssetReloadRequired = () => false, onLoadFailure, ...contentProps }: Props = $props();
    let restoreFocusOnClose = $state(true);
    const closeIconUrl = resolveAppAssetUrl('icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg');
    let Content = $state<typeof import('./NotificationDialogContent.svelte').default | null>(null);
    let contentRef = $state<{ invalidateSession(): void; isFullscreen(): boolean } | null>(null);
    let ready = $state(false), failed = $state(false), invalidated = $state(false);
    let epoch = $state(0), destroyed = false;
    const load = createComponentLoader('notifications-content', importNotificationContent, { isStale: () => destroyed || isStaleAssetReloadRequired() });
    export function invalidateSession() {
        contentRef?.invalidateSession(); invalidated = true; epoch++; ready = false;
    }
    function close(restoreFocus = true) {
        if (contentRef?.isFullscreen()) return false;
        // bits-ui は onOpenChange より先に open を false にする。
        // その再入では、先に close(false) が決めた戻り先を上書きしない。
        if (show) restoreFocusOnClose = restoreFocus;
        invalidateSession(); show = false; onClose();
        return true;
    }
    useDialogHistory(() => show, () => close());
    let scope = $derived({ owner: contentProps.pubkeyHex, runtime: contentProps.rxNostr, relays: contentProps.relayConfig });
    $effect.pre(() => {
        const current = scope;
        untrack(() => { contentRef?.invalidateSession(); epoch++; ready = false; invalidated = false; failed = false; });
    });
    $effect(() => {
        if (!show || invalidated) return;
        const current = epoch;
        void load().then(result => {
            if (destroyed || !show || invalidated || current !== epoch) return;
            if (result.status === 'loaded') Content = result.component;
            else { failed = true; onLoadFailure?.(result); }
        });
    });
    onDestroy(() => { destroyed = true; invalidateSession(); });
</script>
<DialogWrapper bind:open={show} onOpenChange={(open) => { if (!open) close(); }}
    title={$_('notifications.title')} description={$_('notifications.description')}
    contentClass="notification-dialog" footerVariant="close-button" initialFocus="content" trapFocus={false}
    onEscapeKeydown={(event) => { if (contentRef?.isFullscreen()) event.preventDefault(); }}
    onInteractOutside={(event) => { if (contentRef?.isFullscreen()) event.preventDefault(); }}
    returnFocus={returnFocus} bind:restoreFocusOnClose>
    <div class="notification-viewport" aria-busy={!ready && !failed}>
        <div inert={!ready} aria-hidden={!ready ? 'true' : undefined} class:hidden={!ready}>
            {#key epoch}
                {#if Content && show && !invalidated}
                    <Content {...contentProps} show={true} bind:this={contentRef} presentationReady={ready}
                        onClose={() => close(false)} onInitialReady={() => ready = true} />
                {/if}
            {/key}
        </div>
        {#if failed}
            <p role="status">{$_('notifications.partialFailure')}</p>
            <Button onClick={() => { failed = false; epoch++; }}>{$_('notifications.retry')}</Button>
        {:else if !ready}
            <div class="notification-opening-placeholder" aria-hidden="true">
                {#each [0, 1, 2] as row}
                    <div class="placeholder-entry">
                        <div class="placeholder-heading"><span class="placeholder-avatar"></span><span class="placeholder-chip"></span></div>
                        <div class="placeholder-card"><span class="placeholder-avatar"></span><span class="placeholder-line"></span><span class="placeholder-line short"></span></div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    {#snippet footer()}
        <Button className="modal-close" shape="square" ariaLabel={$_('global.close')} onClick={() => close()}>
            <span class="svg-icon" style:mask-image={`url("${closeIconUrl}")`} aria-hidden="true"></span>
        </Button>
    {/snippet}
</DialogWrapper>
<style>
    :global(.notification-dialog) { width: min(800px, calc(100% - 16px)); min-width: 0; }
    :global(.notification-dialog.dialog) { top: 0; translate: -50% 0; height: 100svh; max-height: 100svh; }
    :global(.notification-dialog.dialog.dialog-container-layout) { height: 100%; max-height: 100%; }
    :global(.notification-dialog .dialog-content) { flex: 1; min-height: 0; max-height: none; overflow-anchor: none; }
    :global(.notification-dialog .dialog-footer) { flex: none; }
    :global(.notification-dialog.dialog[data-state="open"]) { animation: notification-open 250ms ease-out; }
    @keyframes notification-open { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { :global(.notification-dialog.dialog[data-state="open"]) { animation: none; } }
    .notification-viewport { position: relative; width: 100%; min-width: 0; }
    .hidden { visibility: hidden; }
    .notification-opening-placeholder { position: absolute; inset: 0; min-height: 420px; overflow: hidden; pointer-events: none; }
    .notification-viewport[aria-busy="true"] { min-height: 420px; }
    .placeholder-entry { padding-block: 12px; border-bottom: 1px solid var(--border-hr); }
    .placeholder-heading { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
    .placeholder-avatar, .placeholder-chip, .placeholder-line { display: block; background: var(--text); opacity: .07; border-radius: 4px; }
    .placeholder-avatar { width: 24px; height: 24px; border-radius: 50%; }
    .placeholder-chip { width: 70px; height: 24px; border-radius: 20px; }
    .placeholder-card { display: grid; gap: 12px; padding: 8px; background: var(--bg-input); }
    .placeholder-line { width: 90%; height: 12px; }
    .placeholder-line.short { width: 55%; }
</style>
