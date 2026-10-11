<script lang="ts">
    import { _ } from "svelte-i18n";
    import { onDestroy } from "svelte";
    import type { UploadedMediaItem } from "../lib/upload/mediaManagementTypes";
    import { buildUploadMediaImageProxyUrl } from "../lib/uploadMediaImageUrl";
    import { evictUploadMediaImages } from "../lib/uploadMediaImageCacheClient";
    import { inViewportAction } from "../lib/hooks/inViewportAction.svelte";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";

    interface Props { item: UploadedMediaItem; cacheSupported: boolean | null; active: boolean; onOpenVideo: () => void; onCloseVideo: () => void }
    let { item, cacheSupported, active, onOpenVideo, onCloseVideo }: Props = $props();
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

<div class="preview" use:inViewportAction={{ enabled: true, rootMargin: "200px", onEnterView: () => { visible = true; } }}>
    {#if !item.url}
        <LoadingPlaceholder text={$_("uploadedMedia.previewUnavailable")} />
    {:else if item.kind === "image"}
        {#if failed}
            <LoadingPlaceholder text={$_("uploadedMedia.previewUnavailable")} />
            <Button onClick={() => { failed = false; }}>{$_("uploadedMedia.retry")}</Button>
        {:else if visible && cacheSupported !== null && imageSrc}
            <img src={imageSrc} alt={$_("uploadedMedia.image")} referrerpolicy="no-referrer" onerror={imageFailed} />
        {:else}
            <LoadingPlaceholder text={$_("uploadedMedia.image")} />
        {/if}
    {:else if active}
        <video bind:this={video} use:releaseVideo src={item.url} controls playsinline preload="metadata" onended={onCloseVideo}>
            <track kind="captions" />
        </video>
        <Button onClick={onCloseVideo}>{$_("uploadedMedia.closeVideo")}</Button>
    {:else}
        <LoadingPlaceholder text={$_("uploadedMedia.video")} />
        <Button onClick={onOpenVideo}>{$_("uploadedMedia.openVideo")}</Button>
    {/if}
</div>

<style>
    .preview { flex: none; width: 100%; min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 120px; }
    img, video { flex: none; max-width: 100%; width: 100%; max-height: 260px; object-fit: contain; }
</style>
