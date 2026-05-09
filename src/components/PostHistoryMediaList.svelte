<script lang="ts">
    import { _ } from "svelte-i18n";
    import { usePostHistoryMediaCache } from "../lib/hooks/usePostHistoryMediaCache.svelte";
    import type { PostHistoryMediaRecord } from "../lib/storage/ehagakiDb";

    interface Props {
        media: PostHistoryMediaRecord[];
    }

    let { media }: Props = $props();

    const mediaCache = usePostHistoryMediaCache({
        getMedia: () => media,
    });

    const clickableMedia = $derived(mediaCache.state.items[0]);

    function getLinkLabel(item: { url: string; alt?: string }): string {
        const alt = item.alt?.trim();
        if (alt) {
            return alt;
        }

        try {
            const pathname = new URL(item.url).pathname;
            const filename = pathname.split("/").filter(Boolean).at(-1);
            return filename || item.url;
        } catch {
            return item.url;
        }
    }

    function getSurfaceAriaLabel(item: { url: string; alt?: string }): string {
        return getLinkLabel(item);
    }
</script>

{#if clickableMedia}
    <div class="post-history-inline-media">
        {#if clickableMedia.cached}
            <a
                href={clickableMedia.url}
                target="_blank"
                rel="noopener noreferrer"
                class="post-history-media-surface post-history-media-link-surface"
                aria-label={getSurfaceAriaLabel(clickableMedia)}
                title={getLinkLabel(clickableMedia)}
            >
                {#if clickableMedia.kind === "image" && clickableMedia.previewObjectUrl}
                    <img
                        src={clickableMedia.previewObjectUrl}
                        alt={clickableMedia.alt || ""}
                        class="post-history-media-image"
                        loading="lazy"
                        decoding="async"
                    />
                {:else if clickableMedia.kind === "video" && clickableMedia.previewObjectUrl}
                    <video
                        src={clickableMedia.previewObjectUrl}
                        class="post-history-media-video"
                        muted
                        playsinline
                        preload="metadata"
                    >
                        <track kind="captions" />
                    </video>
                {:else}
                    <div
                        class="post-history-media-placeholder post-history-media-placeholder-cached"
                    >
                        <span class="post-history-media-placeholder-status"
                            >{$_("postHistory.mediaCached")}</span
                        >
                        <span class="post-history-media-placeholder-label"
                            >{getLinkLabel(clickableMedia)}</span
                        >
                    </div>
                {/if}
            </a>
        {:else}
            <button
                type="button"
                class="post-history-media-surface post-history-media-fetch-surface"
                disabled={clickableMedia.isCaching}
                aria-label={getSurfaceAriaLabel(clickableMedia)}
                title={getLinkLabel(clickableMedia)}
                onclick={() =>
                    void mediaCache.fetchAndCacheMedia(clickableMedia.url)}
            >
                <div
                    class="post-history-media-placeholder post-history-media-placeholder-uncached"
                >
                    <span class="post-history-media-placeholder-status">
                        {clickableMedia.isCaching
                            ? $_("postHistory.mediaLoading")
                            : $_("postHistory.mediaNotCached")}
                    </span>
                    <span class="post-history-media-placeholder-label"
                        >{getLinkLabel(clickableMedia)}</span
                    >
                </div>
            </button>
        {/if}
    </div>
{/if}

<style>
    .post-history-inline-media {
        display: block;
        width: min(100%, 320px);
    }

    .post-history-media-surface {
        display: block;
        width: 100%;
        padding: 0;
        border: 0;
        background: transparent;
        text-align: left;
        cursor: pointer;
    }

    .post-history-media-link-surface {
        cursor: pointer;
        text-decoration: none;
    }

    .post-history-media-image,
    .post-history-media-video,
    .post-history-media-placeholder {
        width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 10px;
        border: 1px solid var(--border-hr);
        background: color-mix(
            in srgb,
            var(--background-color, #fff) 92%,
            #000 8%
        );
    }

    .post-history-media-image,
    .post-history-media-video {
        object-fit: cover;
    }

    .post-history-media-video {
        display: block;
    }

    .post-history-media-placeholder {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
        justify-content: center;
        padding: 12px;
        text-align: left;
        color: var(--color-subtle-text, #666);
        overflow-wrap: anywhere;
    }

    .post-history-media-placeholder-cached {
        background: color-mix(
            in srgb,
            var(--background-color, #fff) 88%,
            var(--theme, #2b664b) 12%
        );
    }

    .post-history-media-placeholder-uncached {
        background: repeating-linear-gradient(
            -45deg,
            color-mix(in srgb, var(--background-color, #fff) 94%, #000 6%),
            color-mix(in srgb, var(--background-color, #fff) 94%, #000 6%) 10px,
            color-mix(in srgb, var(--background-color, #fff) 88%, #000 12%) 10px,
            color-mix(in srgb, var(--background-color, #fff) 88%, #000 12%) 20px
        );
    }

    .post-history-media-placeholder-status {
        display: inline-flex;
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.78);
        color: var(--text-muted, #666);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    .post-history-media-placeholder-label {
        font: inherit;
        color: var(--text, #111);
        overflow-wrap: anywhere;
    }

    .post-history-media-fetch-surface:disabled {
        cursor: default;
        opacity: 0.7;
    }
</style>
