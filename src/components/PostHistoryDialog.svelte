<script lang="ts">
    import { onDestroy, tick, untrack } from "svelte";
    import { Tabs } from "bits-ui";
    import { _ } from "svelte-i18n";
    import DialogWrapper from "./DialogWrapper.svelte";
    import Button from "./Button.svelte";
    import { createComponentLoader } from "../lib/appComponentLoader";
    import { importPostHistoryPosts, importPostHistoryMedia } from "../lib/postHistoryTabImports";
    import { resolveAppAssetUrl } from "../lib/appAssetUrl";
    import type { AppComponentLoadFailure } from "../lib/appComponentLoaders";
    import type { PostHistoryDialogProps } from "../lib/postHistoryDialogTypes";
    import { useDialogHistory } from "../lib/hooks/useDialogHistory.svelte";
    import { usePostHistoryTabSwipe } from "../lib/hooks/usePostHistoryTabSwipe.svelte";
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
    let mediaRef: { activate(): void; suspend(): void; invalidateSession(): void; isBusy(): boolean; isFullscreen(): boolean } | null = $state(null);
    let postsVisited = $state(false);
    let mediaVisited = $state(false);
    let mediaBusy = $state(false);
    let accountEpoch = $state(0);
    let invalidated = $state(false);
    let closePrepared = false;
    let loadGeneration = 0;
    let destroyed = false;
    let loadFailed = $state(false);
    let postsReady = $state(false);
    let mediaReady = $state(false);
    let openingElapsed = $state(false);
    let openingComplete = $state(false);
    let revealLate = $state(false);
    const contentReady = $derived(loadFailed || (activeTab === "posts" ? postsReady : mediaReady));
    function readinessHandler(tab: HistoryTab, epoch: number) {
        return () => {
            if (destroyed || !show || invalidated || epoch !== accountEpoch || tab !== activeTab) return;
            if (tab === "posts") postsReady = true;
            else mediaReady = true;
        };
    }
    const onPostsReady = $derived(readinessHandler("posts", accountEpoch));
    const onMediaReady = $derived(readinessHandler("media", accountEpoch));
    const options = { isStale: () => destroyed || isStaleAssetReloadRequired() };
    const loadPosts = createComponentLoader("post-history-posts", importPostHistoryPosts, options);
    const loadMedia = createComponentLoader("post-history-media", importPostHistoryMedia, options);
    const busy = () => mediaRef?.isBusy() ?? mediaBusy;

    export function invalidateSession() {
        invalidated = true;
        loadGeneration++;
        postsRef?.invalidateSession();
        mediaRef?.invalidateSession();
        mediaBusy = false;
        postsVisited = false; mediaVisited = false;
        postsReady = false; mediaReady = false;
        loadFailed = false;
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
            postsReady = false; mediaReady = false;
        });
    });
    $effect(() => {
        const open = show, epoch = accountEpoch;
        openingElapsed = false;
        openingComplete = false;
        revealLate = false;
        if (!open) return;
        const timer = setTimeout(() => {
            if (!destroyed && show && epoch === accountEpoch) openingElapsed = true;
        }, 300);
        return () => clearTimeout(timer);
    });
    $effect(() => {
        if (!show || !contentReady || openingComplete) return;
        revealLate = openingElapsed;
        openingComplete = true;
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
    const tabSwipe = usePostHistoryTabSwipe({
        getOpen: () => show,
        getTab: () => activeTab,
        getGestureBlocked: () => invalidated || busy() || !!postsRef?.isFullscreen() || !!mediaRef?.isFullscreen(),
        onCommit: (tab) => selectTab(tab),
    });
    function escape(event: KeyboardEvent) {
        if (busy() || postsRef?.isFullscreen() || mediaRef?.isFullscreen()) event.preventDefault();
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
        <div class={["history-tab-gesture", { "is-swiping": tabSwipe.dragging, "is-offset": tabSwipe.dragPx !== 0 }]}
            {@attach tabSwipe.attachment} style:--history-tab-drag="{tabSwipe.dragPx}px">
            <div class="history-tab-switcher">
                <Tabs.List class="history-tab-list" aria-label={$_("postHistory.title")}>
                    <Tabs.Trigger value="posts" disabled={mediaBusy}>{$_("postHistory.postsTab")}</Tabs.Trigger>
                    <Tabs.Trigger value="media" disabled={mediaBusy}>{$_("postHistory.mediaTab")}</Tabs.Trigger>
                </Tabs.List>
                <span class="history-tab-indicator" style:transform="translateX({tabSwipe.indicatorProgress * 100}%)" aria-hidden="true"></span>
            </div>
            <div class="history-tab-viewport" aria-busy={!contentReady} data-opening-pending={!contentReady}>
                <div class="history-tab-panels" class:history-content-reveal={revealLate && openingComplete}
                    inert={!contentReady} aria-hidden={!contentReady ? "true" : undefined}>
                    {#key accountEpoch}
                        <Tabs.Content value="posts" class="history-tab-panel">
                        {#if Posts && postsVisited}<Posts {...postProps} bind:this={postsRef} show={show && !invalidated && activeTab === "posts"} sessionOpen={show} onClose={() => close(false)} onInitialReady={onPostsReady} />{/if}
                        </Tabs.Content>
                        <Tabs.Content value="media" class="history-tab-panel">
                        {#if Media && mediaVisited}<Media bind:this={mediaRef} show={show && !invalidated && activeTab === "media"} onBusyChange={(value) => mediaBusy = value} onInitialReady={onMediaReady} />{/if}
                        </Tabs.Content>
                    {/key}
                    {#if loadFailed}
                        <Button onClick={() => { invalidateSession(); invalidated = false; }}>{$_("uploadedMedia.refresh")}</Button>
                    {/if}
                </div>
                {#if !contentReady}
                    <div class="history-opening-placeholder" aria-hidden="true">
                        {#each [0, 1, 2] as row (row)}
                            <div class="history-opening-card">
                                <span class="history-opening-line short"></span>
                                <span class="history-opening-line"></span>
                                <span class="history-opening-line medium"></span>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </Tabs.Root>
    {#snippet footer()}
        <Button className="modal-close" shape="square" ariaLabel={$_("global.close")} disabled={mediaBusy} onClick={() => close()}>
            <span class="xmark-icon svg-icon" style:mask-image={`url("${closeIconUrl}")`} aria-hidden="true"></span>
        </Button>
    {/snippet}
</DialogWrapper>

<style>
    :global(.post-history-dialog.dialog) { top: 0; translate: -50% 0; height: 100svh; max-height: 100svh; --btn-post-preview-action-hover: var(--svg); }
    :global(.post-history-dialog.dialog[data-state="open"]) { animation: history-open 300ms ease-out; }
    :global(.post-history-dialog.dialog.dialog-container-layout) { height: 100%; max-height: 100%; }
    :global(.post-history-dialog .dialog-content) { position: relative; display: flex; flex: 1; min-height: 0; max-height: none; overflow: hidden; padding: 0; }
    :global(.post-history-dialog .dialog-footer) { flex: none; }
    :global(.history-tabs) { display: flex; flex-direction: column; width: 100%; min-width: 0; min-height: 0; flex: 1; }
    :global(.history-tab-list) {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        flex: none;
    }
    :global(.history-tab-list button) {
        position: relative;
        min-height: 44px;
        width: 100%;
        margin: 0;
        border-radius: 0;
        background-color: var(--dialog-bg2);
        --btn-bg: var(--dialog-bg2);
    }
    :global(.history-tab-list button[data-state="active"]) {
        background-color: var(--dialog-bg);
        --btn-bg: var(--dialog-bg);
    }
    .history-tab-gesture {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
        min-height: 0;
        background: var(--dialog-bg);
        touch-action: pan-y;
    }
    .history-tab-gesture.is-swiping { user-select: none; -webkit-user-select: none; }
    .history-tab-gesture :global(.post-history-container),
    .history-tab-gesture :global(.uploaded-media-content) {
        touch-action: pan-y;
        overscroll-behavior: none;
    }
    .history-tab-switcher { position: relative; flex: none; }
    .history-tab-indicator {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 50%;
        height: 4px;
        display: flex;
        justify-content: center;
        pointer-events: none;
        transition: transform 200ms cubic-bezier(0.2, 0, 0, 1);
    }
    .history-tab-gesture.is-swiping .history-tab-indicator,
    .history-tab-gesture.is-offset .history-tab-indicator { transition: none; }
    .history-tab-indicator::before {
        content: "";
        width: min(4.5rem, 55%);
        height: 4px;
        border-radius: 999px;
        background-color: var(--theme);
    }
    .history-tab-viewport {
        position: relative;
        flex: 1;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
        background: var(--dialog-bg);
    }
    .history-tab-panels {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-width: 0;
        min-height: 0;
    }
    .history-tab-gesture.is-offset .history-tab-panels { transform: translate3d(var(--history-tab-drag), 0, 0); }
    .history-tab-viewport[data-opening-pending="true"] .history-tab-panels { visibility: hidden; }
    .history-content-reveal { animation: history-open 80ms ease-out; }
    .history-opening-placeholder { position: absolute; inset: 0; overflow: hidden; padding: 16px; pointer-events: none; }
    .history-opening-card { display: grid; gap: 14px; padding: 18px 0 26px; }
    .history-opening-line { display: block; height: 12px; border-radius: 6px; background: var(--text); opacity: 0.07; }
    .history-opening-line.short { width: 30%; }
    .history-opening-line.medium { width: 70%; }
    @keyframes history-open { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) {
        .history-tab-indicator { transition: none; }
        :global(.post-history-dialog.dialog[data-state="open"]), .history-content-reveal { animation: none; }
    }
    :global(.history-tab-panel:not([hidden])) { display: flex; flex: 1; min-height: 0; overflow: hidden; }
</style>
