<script lang="ts">
    import { onDestroy, tick, untrack } from "svelte";
    import { Dialog } from "bits-ui";
    import { _ } from "svelte-i18n";
    import DialogWrapper from "./DialogWrapper.svelte";
    import ConfirmDialog from "./ConfirmDialog.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import UploadedMediaPreview from "./UploadedMediaPreview.svelte";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import { useUploadMediaManagement } from "../lib/hooks/useUploadMediaManagement.svelte";
    import { supportsUploadMediaImageCache } from "../lib/uploadMediaImageCacheClient";
    import { authState } from "../stores/authStore.svelte";
    import { uploadDestinationStore } from "../stores/uploadDestinationStore.svelte";
    import type { UploadedMediaItem } from "../lib/upload/mediaManagementTypes";
    import { resolveAppAssetUrl } from "../lib/appAssetUrl";

    interface Props { show: boolean; onClose: () => void; returnFocus?: HTMLElement | null }
    let { show, onClose, returnFocus = null }: Props = $props();
    const management = useUploadMediaManagement();
    const deleteIconUrl = resolveAppAssetUrl("icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    let current = $derived(management.value.current);
    let cacheSupported = $state<boolean | null>(null);
    let pending = $state<UploadedMediaItem | null>(null);
    let pendingEndpoint = $state<string | null>(null);
    let deleteTrigger: HTMLElement | null = null;
    let activeVideo = $state<string | null>(null);
    let listElement: HTMLElement | undefined = $state();
    let supportGeneration = 0;
    let uiEpoch = $state(0);
    let previousOwner: string | null = null;

    export function invalidateSession() {
        uiEpoch++;
        previousOwner = null;
        pending = null;
        activeVideo = null;
        management.controller.invalidate();
    }
    function close() {
        invalidateSession();
        onClose();
        void tick().then(() => returnFocus?.focus({ preventScroll: true }));
    }
    useDialogHistory(() => show, () => { if (!pending) close(); });
    $effect(() => {
        const open = show;
        const account = authState.value;
        const destinations = uploadDestinationStore.value.destinations;
        untrack(() => {
            if (!open) { supportGeneration++; invalidateSession(); cacheSupported = null; return; }
            management.controller.configure(account.isAuthenticated ? account.pubkey : null, destinations);
        });
    });
    $effect(() => {
        if (!show) return;
        const generation = ++supportGeneration;
        void supportsUploadMediaImageCache().then((supported) => {
            if (generation === supportGeneration) cacheSupported = supported;
        });
    });
    $effect(() => {
        const selected = management.value.selectedId;
        const pubkey = authState.value.pubkey;
        const owner = `${pubkey}\n${selected}\n${current?.destination.protocol}\n${current?.destination.serverUrl}\n${current?.context?.endpoint}`;
        untrack(() => {
            if (owner === previousOwner) return;
            previousOwner = owner;
            uiEpoch++;
            pending = null; activeVideo = null;
        });
        // Selection/account changes release the previous video and confirmation.
        void selected; void pubkey;
    });
    $effect(() => {
        const view = current;
        untrack(() => {
            if (pending && (view?.destination.serverUrl !== pending.serverUrl
                || view?.context?.endpoint !== pendingEndpoint
                || (!view.deletingId && !view.items.some((item) => item.id === pending?.id)))) pending = null;
            if (activeVideo && !view?.items.some((item) => item.id === activeVideo)) activeVideo = null;
        });
    });
    onDestroy(() => { supportGeneration++; invalidateSession(); });
    function cancelConfirm() {
        const epoch = uiEpoch, trigger = deleteTrigger;
        pending = null;
        void tick().then(() => epoch === uiEpoch && trigger?.isConnected && trigger.focus({ preventScroll: true }));
    }
    async function confirmDelete() {
        const item = pending;
        const epoch = uiEpoch, trigger = deleteTrigger;
        if (!item || current?.destination.serverUrl !== item.serverUrl || current.context?.endpoint !== pendingEndpoint
            || !current.items.some((entry) => entry.id === item.id && entry.deleteId?.sha256 === item.deleteId?.sha256)) {
            cancelConfirm(); return;
        }
        await management.controller.delete(item.id);
        if (epoch !== uiEpoch) return;
        pending = null;
        await tick();
        if (epoch !== uiEpoch) return;
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
        else listElement?.focus({ preventScroll: true });
    }
</script>

<DialogWrapper open={show} onOpenChange={(open) => { if (!open) close(); }}
    title={$_("uploadedMedia.title")} description={$_("uploadedMedia.description")} contentClass="uploaded-media-dialog" footerVariant="close-button">
    <div class="media-management">
        <h2>{$_("uploadedMedia.title")}</h2>
        <p>{$_("uploadedMedia.description")}</p>
        {#if !authState.value.isAuthenticated}
            <p role="status">{$_("uploadedMedia.errors.authentication")}</p>
        {:else if management.value.destinations.length === 0}
            <p role="status">{$_("uploadedMedia.noServers")}</p>
        {:else}
            <label class="server-picker">
                <span>{$_("uploadedMedia.server")}</span>
                <select value={management.value.selectedId ?? ""} onchange={(event) => management.controller.select(event.currentTarget.value)}>
                    {#each management.value.destinations as destination (destination.id)}
                        <option value={destination.id}>{destination.name} — {destination.protocol}</option>
                    {/each}
                </select>
            </label>
            {#if current}
                <p class="server-url">{current.context?.endpoint ?? current.destination.serverUrl}</p>
                {#if cacheSupported === false}<p role="status">{$_("uploadedMedia.cacheUnavailable")}</p>{/if}
                <div class="actions">
                    <Button onClick={() => { activeVideo = null; void management.controller.load(); }} disabled={current.loading || !!current.deletingId}>
                        {$_("uploadedMedia.refresh")}
                    </Button>
                </div>
                {#if current.loading}<LoadingPlaceholder showLoader text={true} />{/if}
                {#if current.error}
                    <p role="alert">{$_(`uploadedMedia.errors.${current.error.code}`)}</p>
                    {#if current.error.retryAt}<p>{$_("uploadedMedia.retryAfter", { values: { time: new Date(current.error.retryAt).toLocaleTimeString() } })}</p>{/if}
                    {#if current.error.diagnostic}<p class="diagnostic">{current.error.diagnostic}</p>{/if}
                {/if}
                {#if current.notice}<p role="status">{$_(`uploadedMedia.${current.notice}`)}</p>{/if}
                {#if current.loaded && current.items.length === 0}
                    <p>{$_("uploadedMedia.empty")}</p>
                    {#if current.nextPage}<p>{$_("uploadedMedia.moreUnseen")}</p>{/if}
                {/if}
                <div class="media-list" bind:this={listElement} tabindex="-1">
                    {#each current.items as item (item.id)}
                        <article data-media-kind={item.kind}>
                            <UploadedMediaPreview {item} {cacheSupported} active={activeVideo === item.id}
                                onOpenVideo={() => { activeVideo = item.id; }} onCloseVideo={() => { activeVideo = null; }} />
                            <p>{$_(`uploadedMedia.${item.kind}`)} · {current.destination.name} · {item.protocol}</p>
                            <p class="server-url">{current.context?.endpoint ?? item.serverUrl}</p>
                            <p>{$_("uploadedMedia.date")}: {item.uploadedAt === undefined ? $_("uploadedMedia.unknown") : new Date(item.uploadedAt * 1000).toLocaleString()}</p>
                            <p>{$_("uploadedMedia.size")}: {item.size === undefined ? $_("uploadedMedia.unknown") : `${item.size.toLocaleString()} B`}</p>
                            <Button variant="danger" shape="rounded" contentLayout="icon" className="media-delete-button"
                                ariaLabel={current.deletingId === item.id ? $_("uploadedMedia.deleting") : $_("uploadedMedia.delete")}
                                title={current.deletingId === item.id ? $_("uploadedMedia.deleting") : $_("uploadedMedia.delete")}
                                disabled={!item.deleteId || current.loading || !!current.deletingId}
                                onClick={(event) => { deleteTrigger = event.currentTarget as HTMLElement; pendingEndpoint = current?.context?.endpoint ?? null; pending = item; }}>
                                <span class="svg-icon media-delete-icon" aria-hidden="true" style:mask-image={`url("${deleteIconUrl}")`}></span>
                            </Button>
                        </article>
                    {/each}
                </div>
                {#if current.excludedCount || current.invalidCount}
                    <p>{$_("uploadedMedia.skipped", { values: { excluded: current.excludedCount, invalid: current.invalidCount } })}</p>
                {/if}
                {#if current.nextPage && !current.needsRefresh}
                    <div class="actions list-end-actions">
                        <Button onClick={() => management.controller.load(true)} disabled={current.loading || !!current.deletingId}>{$_("uploadedMedia.loadMore")}</Button>
                    </div>
                {/if}
            {/if}
        {/if}
    </div>
    {#snippet footer()}
        <Dialog.Close>
            {#snippet child({ props })}
                <Button {...props} className="modal-close" shape="square" ariaLabel={$_("global.close")}>
                    <span class="xmark-icon svg-icon" aria-hidden="true"></span>
                </Button>
            {/snippet}
        </Dialog.Close>
    {/snippet}
</DialogWrapper>
{#key uiEpoch}
<ConfirmDialog open={!!pending} onOpenChange={(open) => { if (!open) cancelConfirm(); }}
    title={$_("uploadedMedia.delete")} description={$_("uploadedMedia.confirmDescription")}
    confirmLabel={$_("uploadedMedia.delete")} onConfirm={confirmDelete} onCancel={cancelConfirm}
    preventCloseWhileConfirming showConfirmSpinner closeOnConfirm={false}>
    {#if pending}
        <p>{$_(`uploadedMedia.${pending.kind}`)}</p>
        <p class="server-url">{pendingEndpoint ?? pending.serverUrl}</p>
        {#if pending.deleteId}<p class="server-url">{pending.deleteId.sha256}</p>{/if}
        <p class="server-url">{pending.url ?? $_("uploadedMedia.previewUnavailable")}</p>
    {/if}
</ConfirmDialog>
{/key}

<style>
    :global(.dialog.uploaded-media-dialog) { background: var(--dialog-bg2); }
    .xmark-icon { mask-image: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"); }
    .media-management { flex: none; width: 100%; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
    :global(.uploaded-media-dialog button), select { height: auto; min-height: 44px; max-width: 100%; padding: 8px 12px; }
    h2, p { margin: 0; }
    .server-picker { display: flex; flex-direction: column; gap: 6px; }
    select { width: 100%; min-width: 0; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .list-end-actions { justify-content: center; }
    :global(.uploaded-media-dialog button.media-delete-button) {
        flex: none; align-self: flex-end; padding: 0;
        width: 44px; min-width: 44px; max-width: 44px;
        height: 44px; min-height: 44px; max-height: 44px;
    }
    .media-delete-icon { width: 24px; height: 24px; --svg: currentColor; }
    .server-url, .diagnostic { overflow-wrap: anywhere; font-size: .875rem; }
    .media-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); gap: 16px; }
    article { min-width: 0; display: flex; flex-direction: column; gap: 8px; padding: 12px; border: 1px solid var(--border); border-radius: 8px; }
</style>
