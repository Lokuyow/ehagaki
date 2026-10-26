<script lang="ts">
    import { onDestroy, tick, untrack } from "svelte";
    import { _ } from "svelte-i18n";
    import ConfirmDialog from "./ConfirmDialog.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import FloatingMessage from "./FloatingMessage.svelte";
    import ImageFullscreen from "./ImageFullscreen.svelte";
    import UploadedMediaPreview from "./UploadedMediaPreview.svelte";
    import UploadServerRegistration from "./UploadServerRegistration.svelte";
    import { profileDataStore } from "../stores/profileStore.svelte";
    import { useUploadMediaManagement } from "../lib/hooks/useUploadMediaManagement.svelte";
    import { supportsUploadMediaImageCache } from "../lib/uploadMediaImageCacheClient";
    import { resolveUploadedMediaImageSrc } from "../lib/uploadMediaImageUrl";
    import { authState } from "../stores/authStore.svelte";
    import { uploadDestinationStore } from "../stores/uploadDestinationStore.svelte";
    import type { UploadedMediaItem } from "../lib/upload/mediaManagementTypes";
    import type { FullscreenMediaItem } from "../lib/types";
    import { resolveAppAssetUrl } from "../lib/appAssetUrl";
    import { tryCopyToClipboard } from "../lib/utils/clipboardUtils";

    interface Props { show: boolean; onBusyChange?: (busy: boolean) => void; onInitialReady?: () => void }
    let { show: active, onBusyChange = () => undefined, onInitialReady }: Props = $props();
    let configurationStarted = $state(false);
    let initialReadyReported = $state(false);
    let suspended = $state(false);
    let show = $derived(active && !suspended);
    export function activate() { suspended = false; management.controller.activate(); }
    export function suspend() {
        suspended = true; supportGeneration++; uiEpoch++; pending = null; activeVideo = null;
        noticeExpired = true;
        closeFullscreen();
        management.controller.suspend();
    }
    export function isBusy() { return management.controller.busy; }
    export function isFullscreen() { return showImageFullscreen; }
    const management = useUploadMediaManagement();
    const deleteIconUrl = resolveAppAssetUrl("icons/delete_forever_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    const refreshIconUrl = resolveAppAssetUrl("icons/refresh_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    const copyIconUrl = resolveAppAssetUrl("icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    let current = $derived(management.value.current);
    let isNostpic = $derived(!!current && /^https?:\/\/nostpic\.com(?::\d+)?(?:\/|$)/i.test(current.destination.serverUrl));
    function isNostrBuildNip96Url(rawUrl: string): boolean {
        try {
            const url = new URL(rawUrl);
            return url.origin === "https://nostr.build" && !url.username && !url.password && !url.search && !url.hash
                && ["/", "/api/v2/nip96/upload"].includes(url.pathname.replace(/\/$/, "") || "/");
        } catch { return false; }
    }
    const showNostrBuildHelp = $derived(current?.destination.protocol === "nip96"
        && isNostrBuildNip96Url(current.destination.serverUrl)
        && current.error?.code === "unavailable" && current.error.status === 405);
    let cacheSupported = $state<boolean | null>(null);
    let pending = $state<UploadedMediaItem | null>(null);
    let pendingEndpoint = $state<string | null>(null);
    let deleteTrigger: HTMLElement | null = null;
    let activeVideo = $state<string | null>(null);
    let fullscreenMediaItems = $state<FullscreenMediaItem[]>([]);
    let fullscreenIndex = $state(-1);
    let showImageFullscreen = $state(false);
    let fullscreenFocusOrigin = $state<HTMLElement | null>(null);
    let listElement: HTMLElement | undefined = $state();
    let supportGeneration = 0;
    let uiEpoch = $state(0);
    let previousOwner: string | null = null;
    let toolbarElement = $state<HTMLDivElement | null>(null);
    let noticeExpired = $state(false);
    let noticeOwner: string | null = null;
    const mediaNotice = $derived(current?.notice ?? null);
    const deleting = $derived(!!current?.deletingId);
    const registering = $derived(current?.registration?.phase === "submitting");
    const feedbackOwner = $derived([authState.value.pubkey, current?.destination.id, current?.destination.protocol,
        current?.destination.serverUrl, current?.destination.resolvedUploadUrl,
        current?.destination.nip96ServerUrl, current?.destination.nip96UrlMode].join("\n"));
    const showFeedback = $derived(show && !pending && !deleting && !showNostrBuildHelp
        && !!((current?.error && !current.registration) || (current?.loading && current.loaded) || (mediaNotice && !noticeExpired)));

    $effect(() => {
        const notice = mediaNotice;
        const busy = deleting;
        const owner = feedbackOwner;
        const ownerChanged = noticeOwner !== null && noticeOwner !== owner;
        noticeOwner = owner;
        const hidden = ownerChanged || !untrack(() => show);
        noticeExpired = hidden;
        if (!notice || busy || hidden) return;
        const timeout = setTimeout(() => { noticeExpired = true; }, 3500);
        return () => clearTimeout(timeout);
    });

    $effect(() => { const enabled = active; untrack(() => enabled ? activate() : suspend()); });
    function formatSize(bytes: number) {
        const units = ["B", "KB", "MB", "GB", "TB"];
        let value = bytes, unit = 0;
        while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit++; }
        return `${value.toLocaleString(undefined, { maximumFractionDigits: unit === 0 ? 0 : 1 })} ${units[unit]}`;
    }

    function formatDate(uploadedAt: number) {
        return new Date(uploadedAt * 1000).toLocaleString(undefined, {
            year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
        });
    }

    export function invalidateSession() {
        uiEpoch++;
        previousOwner = null;
        pending = null;
        activeVideo = null;
        closeFullscreen();
        management.controller.invalidate();
    }
    $effect(() => {
        const open = show;
        const account = authState.value;
        const destinations = uploadDestinationStore.value.destinations;
        untrack(() => {
            if (!open) return;
            management.controller.activate();
            const pubkey = account.isAuthenticated ? account.pubkey : null;
            if (destinations.length) management.controller.configure(pubkey, destinations);
            else void management.controller.configureSaved(pubkey);
            configurationStarted = true;
        });
    });
    $effect(() => {
        if (!show || initialReadyReported || !onInitialReady || !configurationStarted || management.value.configuring) return;
        if (!authState.value.isAuthenticated || management.value.configurationError || management.value.destinations.length === 0
            || current?.loaded || current?.items.length || current?.error) {
            initialReadyReported = true;
            onInitialReady();
        }
    });
    $effect(() => {
        if (!show || cacheSupported !== null) return;
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
            pending = null; activeVideo = null; closeFullscreen();
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
            const openId = fullscreenMediaItems[fullscreenIndex]?.id;
            if (showImageFullscreen && openId && !view?.items.some((item) => item.id === openId && item.kind === "image")) closeFullscreen();
        });
    });
    $effect(() => { onBusyChange(!!current?.deletingId || registering); });
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
    async function registerServer(username: string) {
        const owner = feedbackOwner;
        await management.controller.register(username);
        await tick();
        if (show && owner === feedbackOwner && !current?.registration) listElement?.focus({ preventScroll: true });
    }
    function closeFullscreen() {
        showImageFullscreen = false;
        fullscreenMediaItems = [];
        fullscreenIndex = -1;
        fullscreenFocusOrigin = null;
    }
    function imageSrcFor(item: UploadedMediaItem): string | null {
        return resolveUploadedMediaImageSrc({
            url: item.url,
            serverUrl: item.serverUrl,
            cacheSupported,
            basePath: import.meta.env.BASE_URL,
            currentOrigin: window.location.origin,
        });
    }
    function copyUrl(item: UploadedMediaItem, event: MouseEvent): Promise<boolean> | boolean {
        event.stopPropagation();
        return item.url ? tryCopyToClipboard(item.url, "URL", navigator, window) : false;
    }
    function handleImageOpen(item: UploadedMediaItem, focusOrigin: HTMLElement) {
        const mediaList = (current?.items ?? []).flatMap((entry): FullscreenMediaItem[] => {
            if (entry.kind !== "image") return [];
            const src = imageSrcFor(entry);
            if (!src) return [];
            return [{ id: entry.id, src, alt: $_("uploadedMedia.image"), type: "image" }];
        });
        const index = mediaList.findIndex((entry) => entry.id === item.id);
        if (index < 0) return;
        fullscreenMediaItems = mediaList;
        fullscreenIndex = index;
        fullscreenFocusOrigin = focusOrigin;
        showImageFullscreen = true;
    }
</script>

{#if show}
<div class="uploaded-media-dialog uploaded-media-content">
    <div class="media-management">
        {#if !authState.value.isAuthenticated}
            <p class="media-status" role="status">{$_("uploadedMedia.errors.authentication")}</p>
        {:else if management.value.configuring}
            <LoadingPlaceholder showLoader text={true} />
        {:else if management.value.configurationError}
            <p class="media-status" role="alert">{$_("uploadedMedia.errors.invalidDestination")}</p>
            <Button onClick={() => management.controller.configureSaved(authState.value.pubkey)}>{$_("uploadedMedia.refresh")}</Button>
        {:else if management.value.destinations.length === 0}
            <p class="media-status" role="status">{$_("uploadedMedia.noServers")}</p>
        {:else}
            <div class="media-toolbar" bind:this={toolbarElement}>
                <select class="media-server-select" aria-label={$_("uploadedMedia.server")} disabled={!!current?.deletingId || registering} value={management.value.selectedId ?? ""}
                    onchange={(event) => management.controller.select(event.currentTarget.value)}>
                    {#each management.value.destinations as destination (destination.id)}
                        <option value={destination.id}>{destination.name}</option>
                    {/each}
                </select>
                {#if current}
                    <Button shape="square" contentLayout="icon" className="media-refresh-button"
                        ariaLabel={$_("uploadedMedia.refresh")} title={$_("uploadedMedia.refresh")}
                        onClick={() => { activeVideo = null; closeFullscreen(); void management.controller.load(); }} disabled={current.loading || !!current.deletingId || registering}>
                        <span class="svg-icon" aria-hidden="true" style:mask-image={`url("${refreshIconUrl}")`}></span>
                    </Button>
                {/if}
            </div>
            {#if current}
                {#if showNostrBuildHelp}
                    <div class="media-status nostr-build-help" role="status">
                        <p>{$_("uploadedMedia.nostrBuild.unavailable")}</p>
                        <a href="https://account.nostr.build/" target="_blank" rel="noopener noreferrer" tabindex="0">{$_("uploadedMedia.nostrBuild.account")}</a>
                        <a href="https://nostr.build/delete/" target="_blank" rel="noopener noreferrer" tabindex="0">{$_("uploadedMedia.nostrBuild.deleteFree")}</a>
                    </div>
                {/if}
                {#if current.registration}
                    {#key feedbackOwner}
                        <UploadServerRegistration registration={current.registration}
                            initialUsername={profileDataStore.value.displayName || profileDataStore.value.name || ""}
                            onOpen={() => management.controller.openRegistration()} onCancel={() => management.controller.cancelRegistration()}
                            onRegister={registerServer} onRefresh={async () => {
                                const owner = feedbackOwner;
                                await management.controller.load(); await tick();
                                if (show && owner === feedbackOwner) toolbarElement?.querySelector("button")?.focus({ preventScroll: true });
                            }} />
                    {/key}
                {/if}
                {#if current.loading && !current.loaded && (!onInitialReady || initialReadyReported)}<LoadingPlaceholder showLoader text={true} />{/if}
                {#if current.loaded && current.items.length === 0}
                    <p class="media-status">{$_("uploadedMedia.empty")}</p>
                    {#if current.hasMore}<p class="media-status">{$_("uploadedMedia.moreUnseen")}</p>{/if}
                {/if}
                <div class="media-list" bind:this={listElement} tabindex="-1">
                    {#each current.items as item (item.id)}
                        <article data-media-kind={item.kind} class:video-active={item.kind === "video" && activeVideo === item.id}>
                            <UploadedMediaPreview {item} {cacheSupported} active={activeVideo === item.id}
                                onOpenImage={(focusOrigin) => handleImageOpen(item, focusOrigin)}
                                onOpenVideo={() => { activeVideo = item.id; }} onCloseVideo={() => { activeVideo = null; }} />
                            <Button variant="copy" shape="circle" contentLayout="icon" className="media-copy-button"
                                ariaLabel={$_(`${item.kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copyUrl`)}
                                title={$_(`${item.kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copyUrl`)}
                                floatingMessage={$_(`${item.kind === "video" ? "videoContextMenu" : "imageContextMenu"}.copySuccess`)}
                                disabled={!item.url} onClick={(event) => copyUrl(item, event)}>
                                <span class="svg-icon" aria-hidden="true" style:mask-image={`url("${copyIconUrl}")`}></span>
                            </Button>
                            <div class="media-overlay">
                                <div class="media-metadata">
                                    <span>{item.size === undefined ? $_("uploadedMedia.unknown") : formatSize(item.size)}</span>
                                    <span>{#if item.uploadedAt !== undefined}<time datetime={new Date(item.uploadedAt * 1000).toISOString()}>{formatDate(item.uploadedAt)}</time>{:else}{$_("uploadedMedia.unknown")}{/if}</span>
                                </div>
                                <Button shape="square" contentLayout="icon" className="media-delete-button"
                                    ariaLabel={current.deletingId === item.id ? $_("uploadedMedia.deleting") : $_("uploadedMedia.delete")}
                                    title={current.deletingId === item.id ? $_("uploadedMedia.deleting") : $_("uploadedMedia.delete")}
                                    disabled={!item.deleteId || current.loading || !!current.deletingId || registering}
                                    onClick={(event) => { deleteTrigger = event.currentTarget as HTMLElement; pendingEndpoint = current?.context?.endpoint ?? null; pending = item; }}>
                                    <span class="svg-icon media-delete-icon" aria-hidden="true" style:mask-image={`url("${deleteIconUrl}")`}></span>
                                </Button>
                            </div>
                        </article>
                    {/each}
                </div>
                {#if current.hasMore && !current.needsRefresh}
                    <div class="list-end-actions">
                        <Button className="media-load-more-button" onClick={() => management.controller.load(true)} disabled={current.loading || !!current.deletingId || registering}>{$_("uploadedMedia.loadMore")}</Button>
                    </div>
                {/if}
            {/if}
        {/if}
    </div>
</div>

<FloatingMessage show={showFeedback} variant="anchor-bottom-right" anchor={toolbarElement} anchorRightOffset={16}
    showInfoIcon={!current?.loading || !!current?.error}
    role={current?.error ? "alert" : "status"}>
    <div class="media-feedback">
        {#if current?.error}
            {#if mediaNotice}<p>{$_(`uploadedMedia.${mediaNotice}`)}</p>{/if}
            <p>{$_(`uploadedMedia.errors.${current.error.code === "invalidResponse" && isNostpic && !current.loaded ? "unavailable" : current.error.code}`)}</p>
            {#if current.error.retryAt}<p>{$_("uploadedMedia.retryAfter", { values: { time: new Date(current.error.retryAt).toLocaleTimeString() } })}</p>{/if}
            {#if current.error.diagnostic}<p class="diagnostic">{current.error.diagnostic}</p>{/if}
        {:else if current?.loading}
            <LoadingPlaceholder showLoader text={true} loaderSize={30} />
        {:else if mediaNotice}
            <p>{$_(`uploadedMedia.${mediaNotice}`)}</p>
        {/if}
    </div>
</FloatingMessage>

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
<ImageFullscreen
    bind:show={showImageFullscreen}
    src={fullscreenMediaItems[fullscreenIndex]?.src ?? ""}
    alt={fullscreenMediaItems[fullscreenIndex]?.alt ?? ""}
    onClose={closeFullscreen}
    mediaList={fullscreenMediaItems}
    currentIndex={fullscreenIndex}
    onNavigate={(index) => { fullscreenIndex = index; }}
    openingFocusOrigin={fullscreenFocusOrigin}
/>
{/if}

<style>
    .uploaded-media-content { background: var(--dialog-bg); flex: 1; min-height: 0; overflow: auto; width: 100%; }
    .media-management { flex: none; width: 100%; min-width: 0; display: flex; flex-direction: column; }
    :global(.uploaded-media-dialog button) { height: auto; min-height: 44px; max-width: 100%; padding: 8px 12px; }
    :global(.uploaded-media-dialog button.image-open) {
        display: block; width: 100%; height: 100%; min-height: 0; max-width: none;
        margin: 0; padding: 0; border: none; background: transparent; cursor: pointer;
    }
    p { margin: 0; }
    .media-toolbar { display: grid; grid-template-columns: minmax(0, 1fr) 44px; gap: 4px; padding: 8px; }
    .media-status { margin: 8px 12px; }
    .nostr-build-help { display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 12px;
        border: 1px solid var(--border); border-radius: 6px; overflow-wrap: anywhere; }
    .nostr-build-help a { display: flex; align-items: center; align-self: flex-start; min-height: 44px; max-width: 100%; }
    .media-feedback { overflow-wrap: anywhere; }
    .media-server-select {
        width: 100%;
        min-width: 0;
        min-height: 44px;
        max-width: 100%;
        padding: 8px 32px 8px 10px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--dialog-bg);
        color: var(--text);
        font: inherit;
    }
    .media-server-select option {
        background: var(--dialog-bg);
        color: var(--text);
    }
    .list-end-actions { display: flex; width: 100%; padding: 10px; box-sizing: border-box; }
    :global(.uploaded-media-dialog button.media-load-more-button) { width: 100%; }
    :global(.uploaded-media-dialog button.media-refresh-button) { width: 44px; height: 44px; padding: 0; background: transparent; border: none; }
    :global(.uploaded-media-dialog button.media-delete-button) {
        flex: none; padding: 0; background: transparent; border: none; color: white; --text: white;
        width: 44px; min-width: 44px; max-width: 44px;
        height: 44px; min-height: 44px; max-height: 44px;
    }
    :global(.uploaded-media-dialog button.media-delete-button:hover:not(:disabled)) { background: rgb(255 255 255 / 15%); color: white; }
    :global(.uploaded-media-dialog button.media-delete-button:hover:not(:disabled) .svg-icon) { background-color: white; }
    :global(.uploaded-media-dialog button.media-delete-button:focus-visible) { outline: 2px solid white; outline-offset: -2px; }
    .media-delete-icon { width: 24px; height: 24px; --svg: currentColor; }
    .server-url, .diagnostic { overflow-wrap: anywhere; font-size: .875rem; }
    .media-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px; }
    article { position: relative; min-width: 0; align-self: start; }
    :global(.uploaded-media-dialog button.media-copy-button) {
        position: absolute; top: 4px; right: 4px; z-index: 1;
        width: 44px; min-width: 44px; height: 44px; min-height: 44px; padding: 0;
        color: white; --text: white;
    }
    :global(.uploaded-media-dialog button.media-copy-button:hover:not(:disabled) .svg-icon) { background-color: white; }
    .video-active :global(button.media-copy-button) { top: 52px; }
    .media-overlay { position: absolute; inset: auto 0 0; display: flex; align-items: flex-end; justify-content: space-between; gap: 4px; padding: 16px 4px 4px 8px; color: white; background: linear-gradient(transparent, rgb(0 0 0 / 70%)); pointer-events: none; }
    .media-metadata { min-width: 0; align-self: center; display: flex; flex-direction: column; font-size: .6875rem; line-height: 1.5; overflow-wrap: anywhere; text-shadow: 0 1px 2px rgb(0 0 0 / 70%); }
    .media-overlay :global(button) { pointer-events: auto; }
    /* Keep native video playback controls available beneath the overlay. */
    .video-active .media-overlay { bottom: 56px; }
</style>
