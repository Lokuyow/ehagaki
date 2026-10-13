<script lang="ts">
    import { onDestroy, tick, untrack } from "svelte";
    import { Tabs } from "bits-ui";
    import { _ } from "svelte-i18n";
    import DialogWrapper from "./DialogWrapper.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { createComponentLoader } from "../lib/appComponentLoader";
    import { resolveAppAssetUrl } from "../lib/appAssetUrl";
    import type { AppComponentLoadFailure } from "../lib/appComponentLoaders";
    import type { PostHistoryDialogProps } from "../lib/postHistoryDialogTypes";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import { historyTabStore, type HistoryTab } from "../stores/historyTabStore.svelte";

    interface Props extends PostHistoryDialogProps {
        returnFocus?: HTMLElement | null;
        isStaleAssetReloadRequired?: () => boolean;
        onLoadFailure?: (failure: AppComponentLoadFailure) => void;
    }
    let { show = $bindable(false), onClose, returnFocus = null,
        isStaleAssetReloadRequired = () => false, onLoadFailure, ...postProps }: Props = $props();
    let activeTab = $state<HistoryTab>(untrack(() => historyTabStore.restore()));
    const closeIconUrl = resolveAppAssetUrl("icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    let Posts = $state<typeof import("./PostHistoryTabContent.svelte").default | null>(null);
    let Media = $state<typeof import("./UploadedMediaTabContent.svelte").default | null>(null);
    let postsRef: { activate(): void; suspend(): void; invalidateSession(): void; prepareClose(): void; isFullscreen(): boolean } | null = $state(null);
    let mediaRef: { activate(): void; suspend(): void; invalidateSession(): void; isBusy(): boolean } | null = $state(null);
    let postsVisited = $state(false);
    let mediaVisited = $state(false);
    let mediaBusy = $state(false);
    let accountEpoch = $state(0);
    let invalidated = $state(false);
    let closePrepared = false;
    let loadGeneration = 0;
    let destroyed = false;
    let loadFailed = $state(false);
    const options = { isStale: () => destroyed || isStaleAssetReloadRequired() };
    const loadPosts = createComponentLoader("post-history-posts", () => import("./PostHistoryTabContent.svelte"), options);
    const loadMedia = createComponentLoader("post-history-media", () => import("./UploadedMediaTabContent.svelte"), options);
    const busy = () => mediaRef?.isBusy() ?? mediaBusy;

    export function invalidateSession() {
        invalidated = true;
        loadGeneration++;
        postsRef?.invalidateSession();
        mediaRef?.invalidateSession();
        mediaBusy = false;
        postsVisited = false; mediaVisited = false;
        accountEpoch++;
    }
    function selectTab(value: string) {
        if (invalidated || (value !== "posts" && value !== "media") || value === activeTab || busy()) return;
        // Invalidate the old owner synchronously, before publishing the selection.
        if (activeTab === "posts") postsRef?.suspend(); else mediaRef?.suspend();
        loadGeneration++;
        activeTab = value;
        historyTabStore.select(value);
        if (value === "posts") postsRef?.activate(); else mediaRef?.activate();
    }
    function close(restoreFocus = true): boolean {
        if (busy()) return false;
        closePrepared = true;
        postsRef?.prepareClose();
        postsRef?.suspend();
        mediaRef?.suspend();
        loadGeneration++;
        show = false;
        onClose();
        const trigger = returnFocus;
        void tick().then(() => restoreFocus && trigger?.isConnected && trigger.focus({ preventScroll: true }));
        return true;
    }
    useDialogHistory(() => show, () => close());
    let previousOwner = untrack(() => postProps.pubkeyHex);
    let previousRuntime = untrack(() => postProps.rxNostr);
    $effect.pre(() => {
        const owner = postProps.pubkeyHex, runtime = postProps.rxNostr;
        if (owner !== previousOwner) {
            previousOwner = owner; previousRuntime = runtime;
            untrack(() => { invalidateSession(); invalidated = false; });
        } else if (runtime !== previousRuntime) {
            previousRuntime = runtime;
            untrack(() => {
                postsRef?.suspend();
                const epoch = accountEpoch, tab = activeTab;
                void tick().then(() => {
                    if (destroyed || !show || invalidated || epoch !== accountEpoch || activeTab !== tab || postProps.rxNostr !== runtime) return;
                    if (tab === "posts") postsRef?.activate();
                });
            });
        }
    });
    $effect.pre(() => {
        const open = show;
        untrack(() => {
            if (open) { closePrepared = false; return; }
            if (!closePrepared) { postsRef?.prepareClose(); postsRef?.suspend(); mediaRef?.suspend(); }
            postsVisited = false; mediaVisited = false;
        });
    });
    $effect(() => {
        const tab = activeTab, open = show, epoch = accountEpoch;
        if (!open || invalidated) return;
        const generation = ++loadGeneration;
        loadFailed = false;
        void (async () => {
            const result = tab === "posts" ? await loadPosts() : await loadMedia();
            if (destroyed || !show || activeTab !== tab || generation !== loadGeneration || epoch !== accountEpoch) return;
            if (result.status === "failed") {
                loadFailed = true;
                onLoadFailure?.(result);
                return;
            }
            if (tab === "posts") { Posts = result.component as typeof Posts; postsVisited = true; }
            else { Media = result.component as typeof Media; mediaVisited = true; }
        })();
        return () => { loadGeneration++; };
    });
    onDestroy(() => { destroyed = true; loadGeneration++; });
    function escape(event: KeyboardEvent) {
        if (busy() || postsRef?.isFullscreen()) event.preventDefault();
    }
    function outside(event: PointerEvent) {
        if (busy() || (event.target instanceof Element && event.target.closest(".ehagaki-pswp"))) event.preventDefault();
    }
</script>

<DialogWrapper bind:open={show} onOpenChange={(open) => { if (!open && !close()) show = true; }}
    title={$_("postHistory.title")} description={$_("postHistory.description")}
    contentClass="post-history-dialog" footerVariant="close-button" initialFocus="content" trapFocus={false}
    onEscapeKeydown={escape} onInteractOutside={outside}>
    <Tabs.Root value={activeTab} onValueChange={selectTab} activationMode="manual" class="history-tabs">
        <Tabs.List class="history-tab-list" aria-label={$_("postHistory.title")}>
            <Tabs.Trigger value="posts" disabled={mediaBusy}>{$_("postHistory.postsTab")}</Tabs.Trigger>
            <Tabs.Trigger value="media" disabled={mediaBusy}>{$_("postHistory.mediaTab")}</Tabs.Trigger>
        </Tabs.List>
        {#key accountEpoch}
            <Tabs.Content value="posts" class="history-tab-panel">
            {#if Posts && postsVisited}<Posts {...postProps} bind:this={postsRef} show={show && !invalidated && activeTab === "posts"} sessionOpen={show} onClose={() => close(false)} />{/if}
            </Tabs.Content>
            <Tabs.Content value="media" class="history-tab-panel">
            {#if Media && mediaVisited}<Media bind:this={mediaRef} show={show && !invalidated && activeTab === "media"} onBusyChange={(value) => mediaBusy = value} />{/if}
            </Tabs.Content>
        {/key}
        {#if (activeTab === "posts" && !Posts) || (activeTab === "media" && !Media)}
            {#if loadFailed}<Button onClick={() => accountEpoch++}>{$_("uploadedMedia.refresh")}</Button>
            {:else}<LoadingPlaceholder showLoader text={true} />{/if}
        {/if}
    </Tabs.Root>
    {#snippet footer()}
        <Button className="modal-close" shape="square" ariaLabel={$_("global.close")} disabled={mediaBusy} onClick={() => close()}>
            <span class="xmark-icon svg-icon" style:mask-image={`url("${closeIconUrl}")`} aria-hidden="true"></span>
        </Button>
    {/snippet}
</DialogWrapper>

<style>
    :global(.post-history-dialog.dialog) { top: 0; translate: -50% 0; height: 100svh; max-height: 100svh; --btn-post-preview-action-hover: var(--svg); }
    :global(.post-history-dialog.dialog.dialog-container-layout) { height: 100%; max-height: 100%; }
    :global(.post-history-dialog .dialog-content) { position: relative; display: flex; flex: 1; min-height: 0; max-height: none; overflow: hidden; padding: 0; }
    :global(.post-history-dialog .dialog-footer) { flex: none; }
    :global(.history-tabs) { display: flex; flex-direction: column; width: 100%; min-width: 0; min-height: 0; flex: 1; }
    :global(.history-tab-list) { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); flex: none; }
    :global(.history-tab-list button) { min-height: 44px; width: 100%; margin: 0; border-radius: 0; }
    :global(.history-tab-list button[data-state="active"]) { box-shadow: inset 0 -3px var(--text); }
    :global(.history-tab-panel:not([hidden])) { display: flex; flex: 1; min-height: 0; overflow: hidden; }
</style>
