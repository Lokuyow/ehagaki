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
</script>

{#if mediaCache.state.items.length > 0}
    <div class="post-history-media-section">
        <div class="post-history-media-heading">{$_("postHistory.media")}</div>
        <ul class="post-history-media-list">
            {#each mediaCache.state.items as item (item.url)}
                <li class="post-history-media-card">
                    {#if item.kind === "image" && item.previewObjectUrl}
                        <img
                            src={item.previewObjectUrl}
                            alt={item.alt || ""}
                            class="post-history-media-image"
                            loading="lazy"
                            decoding="async"
                        />
                    {:else if item.kind === "video" && item.previewObjectUrl}
                        <video
                            src={item.previewObjectUrl}
                            class="post-history-media-video"
                            controls
                            playsinline
                            preload="metadata"
                        >
                            <track kind="captions" />
                            {$_("videoNode.not_supported")}
                        </video>
                    {:else}
                        <div class="post-history-media-placeholder">
                            <span>{getLinkLabel(item)}</span>
                        </div>
                    {/if}

                    <div class="post-history-media-meta">
                        <span
                            class="post-history-media-badge"
                            class:post-history-media-badge-cached={item.cached}
                        >
                            {item.cached
                                ? $_("postHistory.mediaCached")
                                : $_("postHistory.mediaNotCached")}
                        </span>

                        {#if item.kind === "video" && item.cached && !item.previewObjectUrl}
                            <button
                                type="button"
                                class="post-history-media-action"
                                disabled={item.isLoadingPreview}
                                onclick={() =>
                                    void mediaCache.loadCachedVideo(item.url)}
                            >
                                {item.isLoadingPreview
                                    ? $_("postHistory.mediaLoading")
                                    : $_("postHistory.mediaLoadCachedVideo")}
                            </button>
                        {/if}

                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="post-history-media-link"
                        >
                            {$_("postHistory.mediaOpen")}
                        </a>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
{/if}

<style>
    .post-history-media-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 12px;
    }

    .post-history-media-heading {
        font-size: 0.875rem;
        color: var(--color-subtle-text, #666);
    }

    .post-history-media-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 10px;
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .post-history-media-card {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 0;
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

    .post-history-media-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 12px;
        text-align: center;
        color: var(--color-subtle-text, #666);
        overflow-wrap: anywhere;
    }

    .post-history-media-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
    }

    .post-history-media-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 3px 8px;
        border-radius: 999px;
        font-size: 0.75rem;
        background: color-mix(
            in srgb,
            var(--background-color, #fff) 90%,
            #000 10%
        );
        color: var(--color-subtle-text, #666);
    }

    .post-history-media-badge-cached {
        color: var(--accent-color, #2b664b);
    }

    .post-history-media-action,
    .post-history-media-link {
        font: inherit;
        color: var(--accent-color, #2b664b);
    }

    .post-history-media-action {
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
        text-decoration: underline;
    }

    .post-history-media-action:disabled {
        cursor: default;
        opacity: 0.7;
        text-decoration: none;
    }
</style>
