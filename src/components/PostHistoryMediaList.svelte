<script lang="ts">
    import Button from "./Button.svelte";
    import { _ } from "svelte-i18n";
    import { inViewportAction } from "../lib/hooks/inViewportAction.svelte";
    import { usePostHistoryMediaCache } from "../lib/hooks/usePostHistoryMediaCache.svelte";
    import {
        buildPostHistoryMediaLayout,
        type PostHistoryDisplayMediaKind,
        type PostHistoryResolvedMedia,
    } from "../lib/postHistoryDialogUtils";
    import type { PostHistoryMediaRecord } from "../lib/storage/ehagakiDb";
    import type { FullscreenMediaItem } from "../lib/types";
    import { tryCopyToClipboard } from "../lib/utils/clipboardUtils";

    interface Props {
        media: PostHistoryMediaRecord[];
        scrollRoot?: HTMLElement | null;
        onImageOpen?: (params: {
            index: number;
            mediaList: FullscreenMediaItem[];
        }) => void;
    }

    type DisplayMediaItem = PostHistoryResolvedMedia & {
        hasResolvedCache: boolean;
        cached: boolean;
        previewObjectUrl?: string;
        isCaching: boolean;
        hasFetchFailed: boolean;
    };

    const AUTO_FETCH_ROOT_MARGIN = "160px 0px";

    let { media, scrollRoot = null, onImageOpen = undefined }: Props = $props();

    let copyStateByUrl = $state<
        Record<string, "copied" | "failed" | undefined>
    >({});
    const autoRequestedUrls = new Set<string>();

    const mediaLayout = $derived.by(() => buildPostHistoryMediaLayout(media));

    const mediaCache = usePostHistoryMediaCache({
        getMedia: () => mediaLayout.items,
    });

    const mediaStateByUrl = $derived.by(
        () =>
            new Map(
                mediaCache.state.items.map((item) => [item.url, item] as const),
            ),
    );

    const imageRows = $derived.by(() =>
        mediaLayout.imageRows.map((row) => ({
            ...row,
            items: row.items.map((item) => toDisplayMediaItem(item)),
        })),
    );
    const videoItems = $derived.by(() =>
        mediaLayout.videos.map((item) => toDisplayMediaItem(item)),
    );
    const otherItems = $derived.by(() =>
        mediaLayout.others.map((item) => toDisplayMediaItem(item)),
    );

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

    function toDisplayMediaItem(
        item: PostHistoryResolvedMedia,
    ): DisplayMediaItem {
        const cachedState = mediaStateByUrl.get(item.url);

        return {
            ...item,
            hasResolvedCache: cachedState?.hasResolvedCache ?? false,
            cached: cachedState?.cached ?? false,
            previewObjectUrl: cachedState?.previewObjectUrl,
            isCaching: cachedState?.isCaching ?? false,
            hasFetchFailed: cachedState?.hasFetchFailed ?? false,
        };
    }

    function getCopyKey(
        kind: PostHistoryDisplayMediaKind,
    ): "imageContextMenu" | "videoContextMenu" {
        return kind === "video" ? "videoContextMenu" : "imageContextMenu";
    }

    function getCopyButtonLabel(
        kind: PostHistoryDisplayMediaKind,
        url: string,
    ): string {
        const namespace = getCopyKey(kind);
        const currentState = copyStateByUrl[url];

        if (currentState === "copied") {
            return $_(`${namespace}.copySuccess`);
        }

        if (currentState === "failed") {
            return $_(`${namespace}.copyFailed`);
        }

        return $_(`${namespace}.copyUrl`);
    }

    function getImageSurfaceAriaLabel(item: {
        url: string;
        alt?: string;
    }): string {
        return `${$_("postHistory.mediaOpen")} ${getLinkLabel(item)}`;
    }

    function requestAutoFetch(url: string): void {
        if (autoRequestedUrls.has(url)) {
            return;
        }

        autoRequestedUrls.add(url);
        void mediaCache.fetchAndCacheMedia(url);
    }

    async function handleCopyUrl(
        item: DisplayMediaItem,
        event: MouseEvent,
    ): Promise<void> {
        event.stopPropagation();
        event.preventDefault();

        const copied = await tryCopyToClipboard(
            item.url,
            "URL",
            navigator,
            window,
        );

        copyStateByUrl = {
            ...copyStateByUrl,
            [item.url]: copied ? "copied" : "failed",
        };

        setTimeout(() => {
            copyStateByUrl = {
                ...copyStateByUrl,
                [item.url]: undefined,
            };
        }, 1800);
    }

    function handleRetry(item: DisplayMediaItem): void {
        void mediaCache.fetchAndCacheMedia(item.url);
    }

    function handleImageOpen(item: DisplayMediaItem): void {
        if (!item.cached) {
            return;
        }

        const index = mediaLayout.fullscreenMediaItems.findIndex(
            (candidate) => candidate.id === item.id,
        );
        if (index < 0) {
            return;
        }

        onImageOpen?.({
            index,
            mediaList: mediaLayout.fullscreenMediaItems,
        });
    }

    function shouldAutoFetch(item: DisplayMediaItem): boolean {
        return (
            item.hasResolvedCache &&
            !item.cached &&
            !item.isCaching &&
            !item.hasFetchFailed
        );
    }

    function getMediaStatusLabel(item: DisplayMediaItem): string {
        if (!item.hasResolvedCache) {
            return $_("postHistory.mediaLoading");
        }

        if (item.cached) {
            return $_("postHistory.mediaCached");
        }

        if (item.hasFetchFailed) {
            return $_("postHistory.mediaLoadFailed");
        }

        return item.isCaching
            ? $_("postHistory.mediaLoading")
            : $_("postHistory.mediaNotCached");
    }
</script>

{#if mediaLayout.items.length > 0}
    <div class="post-history-media-section">
        {#if imageRows.length > 0}
            <div class="post-history-image-grid">
                {#each imageRows as row, rowIndex (rowIndex)}
                    <div
                        class="post-history-image-row"
                        style={`--post-history-image-columns: ${row.slotCount};`}
                    >
                        {#each row.items as item (item.id)}
                            <div
                                class="post-history-image-cell"
                                use:inViewportAction={{
                                    enabled: shouldAutoFetch(item),
                                    once: true,
                                    root: scrollRoot,
                                    rootMargin: AUTO_FETCH_ROOT_MARGIN,
                                    onEnterView: () =>
                                        requestAutoFetch(item.url),
                                }}
                            >
                                {#if item.cached}
                                    <button
                                        type="button"
                                        class="post-history-media-surface post-history-image-surface"
                                        aria-label={getImageSurfaceAriaLabel(
                                            item,
                                        )}
                                        title={getLinkLabel(item)}
                                        onclick={() => handleImageOpen(item)}
                                    >
                                        {#if item.previewObjectUrl}
                                            <img
                                                src={item.previewObjectUrl}
                                                alt={item.alt ||
                                                    getLinkLabel(item)}
                                                class="post-history-media-image"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        {:else}
                                            <div
                                                class="post-history-media-placeholder post-history-media-placeholder-cached"
                                            >
                                                <span
                                                    class="post-history-media-placeholder-status"
                                                    >{$_(
                                                        "postHistory.mediaCached",
                                                    )}</span
                                                >
                                                <span
                                                    class="post-history-media-placeholder-label"
                                                    >{getLinkLabel(item)}</span
                                                >
                                            </div>
                                        {/if}
                                    </button>
                                {:else if item.hasFetchFailed}
                                    <div
                                        class="post-history-media-placeholder post-history-media-placeholder-failed"
                                    >
                                        <span
                                            class="post-history-media-placeholder-status"
                                            >{$_(
                                                "postHistory.mediaLoadFailed",
                                            )}</span
                                        >
                                        <span
                                            class="post-history-media-placeholder-label"
                                            >{getLinkLabel(item)}</span
                                        >
                                        <button
                                            type="button"
                                            class="post-history-media-retry-button"
                                            onclick={() => handleRetry(item)}
                                        >
                                            {$_(
                                                "postHistory.mediaFetchAndCache",
                                            )}
                                        </button>
                                    </div>
                                {:else}
                                    <div
                                        class="post-history-media-placeholder post-history-media-placeholder-uncached"
                                        class:post-history-media-placeholder-loading={!item.hasResolvedCache ||
                                            item.isCaching}
                                    >
                                        <span
                                            class="post-history-media-placeholder-status"
                                            >{getMediaStatusLabel(item)}</span
                                        >
                                        <span
                                            class="post-history-media-placeholder-label"
                                            >{getLinkLabel(item)}</span
                                        >
                                        {#if !item.hasResolvedCache || item.isCaching}
                                            <span
                                                class="post-history-media-loading-bar"
                                                aria-hidden="true"
                                            ></span>
                                        {/if}
                                    </div>
                                {/if}

                                <Button
                                    variant="copy"
                                    shape="circle"
                                    className="post-history-media-copy-button post-history-media-copy-button-image"
                                    ariaLabel={getCopyButtonLabel(
                                        item.kind,
                                        item.url,
                                    )}
                                    title={getCopyButtonLabel(
                                        item.kind,
                                        item.url,
                                    )}
                                    onClick={(event) =>
                                        void handleCopyUrl(item, event)}
                                >
                                    <div class="copy-icon svg-icon"></div>
                                </Button>
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        {/if}

        {#if videoItems.length > 0}
            <div class="post-history-video-list">
                {#each videoItems as item (item.id)}
                    <article
                        class="post-history-video-card"
                        use:inViewportAction={{
                            enabled: shouldAutoFetch(item),
                            once: true,
                            root: scrollRoot,
                            rootMargin: AUTO_FETCH_ROOT_MARGIN,
                            onEnterView: () => requestAutoFetch(item.url),
                        }}
                    >
                        <div class="post-history-video-card-header">
                            <span class="post-history-video-card-label"
                                >{getLinkLabel(item)}</span
                            >
                            <Button
                                variant="copy"
                                shape="circle"
                                className="post-history-media-copy-button post-history-video-copy-button"
                                ariaLabel={getCopyButtonLabel(
                                    item.kind,
                                    item.url,
                                )}
                                title={getCopyButtonLabel(item.kind, item.url)}
                                onClick={(event) =>
                                    void handleCopyUrl(item, event)}
                            >
                                <div class="copy-icon svg-icon"></div>
                            </Button>
                        </div>

                        {#if item.cached && item.previewObjectUrl}
                            <video
                                src={item.previewObjectUrl}
                                class="post-history-media-video"
                                controls
                                playsinline
                                preload="metadata"
                            >
                                <track kind="captions" />
                            </video>
                        {:else if item.hasFetchFailed}
                            <div
                                class="post-history-media-placeholder post-history-media-placeholder-failed post-history-video-placeholder"
                            >
                                <span
                                    class="post-history-media-placeholder-status"
                                    >{$_("postHistory.mediaLoadFailed")}</span
                                >
                                <span
                                    class="post-history-media-placeholder-label"
                                    >{getLinkLabel(item)}</span
                                >
                                <button
                                    type="button"
                                    class="post-history-media-retry-button"
                                    onclick={() => handleRetry(item)}
                                >
                                    {$_("postHistory.mediaFetchAndCache")}
                                </button>
                            </div>
                        {:else}
                            <div
                                class="post-history-media-placeholder post-history-media-placeholder-uncached post-history-video-placeholder"
                                class:post-history-media-placeholder-loading={!item.hasResolvedCache ||
                                    item.isCaching}
                            >
                                <span
                                    class="post-history-media-placeholder-status"
                                    >{getMediaStatusLabel(item)}</span
                                >
                                <span
                                    class="post-history-media-placeholder-label"
                                    >{getLinkLabel(item)}</span
                                >
                                {#if !item.hasResolvedCache || item.isCaching}
                                    <span
                                        class="post-history-media-loading-bar"
                                        aria-hidden="true"
                                    ></span>
                                {/if}
                            </div>
                        {/if}
                    </article>
                {/each}
            </div>
        {/if}

        {#if otherItems.length > 0}
            <div class="post-history-other-media-list">
                {#each otherItems as item (item.id)}
                    <div
                        class="post-history-other-media-card"
                        use:inViewportAction={{
                            enabled: shouldAutoFetch(item),
                            once: true,
                            root: scrollRoot,
                            rootMargin: AUTO_FETCH_ROOT_MARGIN,
                            onEnterView: () => requestAutoFetch(item.url),
                        }}
                    >
                        <div class="post-history-other-media-header">
                            <span class="post-history-other-media-label"
                                >{getLinkLabel(item)}</span
                            >
                            <Button
                                variant="copy"
                                shape="circle"
                                className="post-history-media-copy-button post-history-video-copy-button"
                                ariaLabel={getCopyButtonLabel(
                                    item.kind,
                                    item.url,
                                )}
                                title={getCopyButtonLabel(item.kind, item.url)}
                                onClick={(event) =>
                                    void handleCopyUrl(item, event)}
                            >
                                <div class="copy-icon svg-icon"></div>
                            </Button>
                        </div>

                        <div
                            class="post-history-media-placeholder"
                            class:post-history-media-placeholder-cached={item.cached}
                            class:post-history-media-placeholder-uncached={!item.cached &&
                                !item.hasFetchFailed}
                            class:post-history-media-placeholder-failed={item.hasFetchFailed}
                            class:post-history-media-placeholder-loading={!item.hasResolvedCache ||
                                item.isCaching}
                        >
                            <span class="post-history-media-placeholder-status"
                                >{getMediaStatusLabel(item)}</span
                            >
                            <span class="post-history-media-placeholder-label"
                                >{getLinkLabel(item)}</span
                            >
                            {#if item.hasFetchFailed}
                                <button
                                    type="button"
                                    class="post-history-media-retry-button"
                                    onclick={() => handleRetry(item)}
                                >
                                    {$_("postHistory.mediaFetchAndCache")}
                                </button>
                            {:else if !item.hasResolvedCache || item.isCaching}
                                <span
                                    class="post-history-media-loading-bar"
                                    aria-hidden="true"
                                ></span>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
{/if}

<style>
    .post-history-media-section {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .post-history-media-surface {
        font-size: 0;
        display: block;
        width: 100%;
        padding: 0;
        border: 0;
        background: transparent;
        text-align: left;
        cursor: pointer;

        &:active:not(:disabled) {
            transform: scale(1);
        }
    }

    .post-history-image-grid {
        display: flex;
        flex-direction: column;
        width: 100%;
        border: 1px solid var(--border-hr);
        border-radius: 12px;
        overflow: hidden;
        gap: 2px;
    }

    .post-history-image-row {
        display: grid;
        grid-template-columns: repeat(
            var(--post-history-image-columns),
            minmax(0, 1fr)
        );
        width: 100%;
        gap: 2px;
    }

    .post-history-image-cell {
        position: relative;
        min-width: 0;
    }

    .post-history-image-surface {
        overflow: hidden;
    }

    .post-history-media-image,
    .post-history-media-placeholder {
        width: 100%;
        aspect-ratio: 1 / 1;
    }

    .post-history-media-image {
        object-fit: cover;
    }

    .post-history-media-video {
        display: block;
        width: 100%;
        max-height: 480px;
        height: 100%;
        object-fit: contain;
        border-radius: 10px;
        border: 1px solid var(--border-hr);
        background: color-mix(
            in srgb,
            var(--background-color, #fff) 92%,
            #000 8%
        );
    }

    .post-history-media-placeholder {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
        justify-content: center;
        padding: 12px;
        box-sizing: border-box;
        text-align: left;
        overflow-wrap: anywhere;
    }

    .post-history-media-placeholder-loading {
        position: relative;
        overflow: hidden;
    }

    .post-history-media-placeholder-cached {
        border: 1px solid var(--btn-border);
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

    .post-history-media-loading-bar {
        display: block;
        width: 100%;
        height: 8px;
        border-radius: 999px;
        background: linear-gradient(
            90deg,
            color-mix(in srgb, var(--theme) 10%, transparent),
            color-mix(in srgb, var(--theme) 28%, transparent),
            color-mix(in srgb, var(--theme) 10%, transparent)
        );
        background-size: 200% 100%;
        animation: post-history-media-loading 1.4s linear infinite;
    }

    .post-history-media-retry-button {
        min-height: 32px;
        padding: 6px 12px;
        border: 1px solid var(--border, #ccc);
        border-radius: 999px;
        color: var(--text, #111);
        font: inherit;
        cursor: pointer;
    }

    .post-history-video-list,
    .post-history-other-media-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .post-history-video-card,
    .post-history-other-media-card {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        padding: 10px;
        border-radius: 14px;
        border: 1px solid var(--border-hr);
        background: var(--bg-input);
        box-sizing: border-box;
    }

    .post-history-video-card-header,
    .post-history-other-media-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .post-history-video-card-label,
    .post-history-other-media-label {
        min-width: 0;
        overflow-wrap: anywhere;
        color: var(--text, #111);
        font-size: 0.92rem;
    }

    /* .post-history-video-placeholder {
        aspect-ratio: 16 / 9;
    } */

    :global(button.post-history-media-copy-button.circle.copy) {
        min-width: 36px;
        width: 36px;
        height: 36px;
        min-height: 36px;
        z-index: 2;
    }

    :global(button.post-history-media-copy-button-image.circle.copy) {
        position: absolute;
        top: 8px;
        right: 8px;
    }

    :global(button.post-history-video-copy-button.circle.copy) {
        position: relative;
        top: auto;
        right: auto;
        flex-shrink: 0;
    }

    @keyframes post-history-media-loading {
        0% {
            background-position: 100% 50%;
        }
        100% {
            background-position: -100% 50%;
        }
    }

    :global(:root.light) .post-history-media-video {
        background-color: rgba(0, 0, 0, 0.1);
    }
    :global(:root.dark) .post-history-media-video {
        background-color: rgba(0, 0, 0, 0.3);
    }
</style>
