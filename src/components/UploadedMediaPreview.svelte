<script lang="ts">
    import { _ } from "svelte-i18n";
    import { onDestroy } from "svelte";
    import type { UploadedMediaItem } from "../lib/upload/mediaManagementTypes";
    import { buildUploadMediaImageProxyUrl } from "../lib/uploadMediaImageUrl";
    import { evictUploadMediaImages } from "../lib/uploadMediaImageCacheClient";
    import { inViewportAction } from "../lib/hooks/inViewportAction.svelte";
    import { resolveAppAssetUrl } from "../lib/appAssetUrl";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";

    interface Props { item: UploadedMediaItem; cacheSupported: boolean | null; active: boolean; onOpenVideo: () => void; onCloseVideo: () => void }
    let { item, cacheSupported, active, onOpenVideo, onCloseVideo }: Props = $props();
    const playIconUrl = resolveAppAssetUrl("icons/play_arrow_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    let visible = $state(false);
    let failed = $state(false);
    let video: HTMLVideoElement | undefined = $state();
    let imageSrc = $derived(item.url && cacheSupported
        ? buildUploadMediaImageProxyUrl({ url: item.url, serverUrl: item.serverUrl,
            basePath: import.meta.env.BASE_URL, currentOrigin: window.location.origin })
        : item.url);
    function releaseVideo(node: HTMLVideoElement) {
        return { destroy() { node.pause(); node.removeAttribute("src"); node.load(); } };
    }
    async function imageFailed() {
        failed = true;
        if (item.url && cacheSupported) await evictUploadMediaImages([item.url]);
    }
    onDestroy(() => { video?.pause(); });
</script>

<div class="preview" class:preview-empty={!item.url || (item.kind === "image" && (failed || !visible || cacheSupported === null))}
    use:inViewportAction={{ enabled: true, rootMargin: "200px", onEnterView: () => { visible = true; } }}>
    {#if !item.url}
        <LoadingPlaceholder text={$_("uploadedMedia.previewUnavailable")} />
    {:else if item.kind === "image"}
        {#if failed}
            <LoadingPlaceholder text={$_("uploadedMedia.previewUnavailable")} />
            <Button onClick={() => { failed = false; }}>{$_("uploadedMedia.retry")}</Button>
        {:else if visible && cacheSupported !== null && imageSrc}
            <img src={imageSrc} alt={$_("uploadedMedia.image")} referrerpolicy="no-referrer" onerror={imageFailed} />
        {:else}
            <LoadingPlaceholder showLoader loaderSize={24} />
        {/if}
    {:else if active}
        <video bind:this={video} use:releaseVideo src={item.url} controls playsinline preload="metadata" onended={onCloseVideo}>
            <track kind="captions" />
        </video>
        <Button variant="close" shape="circle" contentLayout="icon" className="media-video-button video-close"
            ariaLabel={$_("uploadedMedia.closeVideo")} title={$_("uploadedMedia.closeVideo")} onClick={onCloseVideo}>
            <span class="svg-icon" aria-hidden="true"></span>
        </Button>
    {:else}
        <div class="video-placeholder">
            <Button variant="close" shape="circle" contentLayout="icon" className="media-video-button video-open"
                ariaLabel={$_("uploadedMedia.openVideo")} title={$_("uploadedMedia.openVideo")} onClick={onOpenVideo}>
                <span class="svg-icon" aria-hidden="true" style:mask-image={`url("${playIconUrl}")`}></span>
            </Button>
        </div>
    {/if}
</div>

<style>
    .preview { position: relative; width: 100%; min-width: 0; aspect-ratio: 1; }
    .preview-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
    img, video { display: block; width: 100%; height: 100%; }
    img { object-fit: cover; }
    video { object-fit: contain; }
    video, .video-placeholder { background: #181818; }
    .video-placeholder { width: 100%; height: 100%; display: grid; place-items: center; }
    .preview :global(button.media-video-button) { padding: 0; width: 44px; height: 44px; min-width: 44px; color: white; }
    .preview :global(button.media-video-button:hover:not(:disabled) .svg-icon) { background-color: white; }
    .preview :global(button.video-close) { position: absolute; top: 4px; right: 4px; }
    .preview :global(button.video-open) { width: 56px; height: 56px; }
</style>
