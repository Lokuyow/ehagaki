<script lang="ts">
    import { SvelteSet } from "svelte/reactivity";
    import MediaGallery from "./MediaGallery.svelte";
    import BlurhashPlaceholder from "./BlurhashPlaceholder.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import Button from "./Button.svelte";
    import { _ } from "svelte-i18n";
    import { inViewportAction } from "../lib/hooks/inViewportAction.svelte";
    import { usePostHistoryMediaCache } from "../lib/hooks/usePostHistoryMediaCache.svelte";
    import {
        buildPostHistoryMediaLayout,
        type PostHistoryMediaLayout,
        type PostHistoryDisplayMediaKind,
        type PostHistoryMediaRenderState,
        type PostHistoryResolvedMedia,
        resolvePostHistoryMediaDimensionHints,
        resolvePostHistoryMediaRenderState,
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
            focusOrigin: HTMLElement | null;
        }) => void;
        mediaLayout?: PostHistoryMediaLayout;
    }

    type DisplayMediaItem = PostHistoryResolvedMedia & {
        hasResolvedCache: boolean;
        cached: boolean;
        previewObjectUrl?: string;
        isLoadingPreview: boolean;
        isCaching: boolean;
        hasFetchFailed: boolean;
    };

    const AUTO_FETCH_ROOT_MARGIN = "160px 0px";

    let {
        media,
        scrollRoot = null,
        onImageOpen = undefined,
        mediaLayout = undefined,
    }: Props = $props();

    let copyStateByUrl = $state<
        Record<string, "copied" | "failed" | undefined>
    >({});
    const autoRequestedUrls = new Set<string>();
    const visibleUrls = new SvelteSet<string>();
    const initialImageRatios = new Map<string, number>();
    const resolvedMediaLayout = $derived.by(
        () => mediaLayout ?? buildPostHistoryMediaLayout(media),
    );

    const mediaCache = usePostHistoryMediaCache({
        getMedia: () => resolvedMediaLayout.items,
    });

    const mediaStateByUrl = $derived.by(
        () =>
            new Map(
                mediaCache.state.items.map((item) => [item.url, item] as const),
            ),
    );

    const visualItems = $derived.by(() =>
        resolvedMediaLayout.items
            .filter((item) => item.kind === "image" || item.kind === "video")
            .map((item) => {
                return {
                    ...toDisplayMediaItem(item),
                    aspectRatio: item.kind === "image" ? getInitialImageRatio(item) : undefined,
                };
            }),
    );

    function getInitialImageRatio(item: PostHistoryResolvedMedia): number {
        const initialRatio = initialImageRatios.get(item.id);
        if (initialRatio !== undefined) return initialRatio;

        const { width, height } = resolvePostHistoryMediaDimensionHints(item);
        const ratio = width && height ? width / height : 1;
        initialImageRatios.set(item.id, ratio);
        return ratio;
    }
    const otherItems = $derived.by(() =>
        resolvedMediaLayout.others.map((item) => toDisplayMediaItem(item)),
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
            alt: cachedState?.alt ?? item.alt,
            mimeType: cachedState?.mimeType ?? item.mimeType,
            blurhash: cachedState?.blurhash ?? item.blurhash,
            dim: cachedState?.dim ?? item.dim,
            size: cachedState?.size ?? item.size,
            uploadProtocol: cachedState?.uploadProtocol ?? item.uploadProtocol,
            hasResolvedCache: cachedState?.hasResolvedCache ?? false,
            cached: cachedState?.cached ?? false,
            previewObjectUrl: cachedState?.previewObjectUrl,
            isLoadingPreview: cachedState?.isLoadingPreview ?? false,
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

    function getCopyButtonFloatingMessage(
        kind: PostHistoryDisplayMediaKind,
    ): string {
        return $_(`${getCopyKey(kind)}.copySuccess`);
    }

    function getImageSurfaceAriaLabel(item: {
        url: string;
        alt?: string;
    }): string {
        return `${$_("postHistory.mediaOpen")} ${getLinkLabel(item)}`;
    }

    function hasMetadataHint(item: DisplayMediaItem): boolean {
        return Boolean(item.blurhash?.trim() || item.dim?.trim());
    }

    function getRenderState(
        item: DisplayMediaItem,
    ): PostHistoryMediaRenderState {
        return resolvePostHistoryMediaRenderState({
            hasResolvedCache: item.hasResolvedCache,
            cached: item.cached,
            previewObjectUrl: item.previewObjectUrl,
            isLoadingPreview: item.isLoadingPreview,
            isCaching: item.isCaching,
            hasFetchFailed: item.hasFetchFailed,
            hasMetadataHint: hasMetadataHint(item),
        });
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
    ): Promise<boolean> {
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

        return copied;
    }

    function handleRetry(item: DisplayMediaItem): void {
        void mediaCache.fetchAndCacheMedia(item.url);
    }

    function handleImageOpen(
        item: DisplayMediaItem,
        focusOrigin: HTMLElement | null,
    ): void {
        if (!item.cached) {
            return;
        }

        const index = resolvedMediaLayout.fullscreenMediaItems.findIndex(
            (candidate) => candidate.id === item.id,
        );
        if (index < 0) {
            return;
        }

        onImageOpen?.({
            index,
            mediaList: resolvedMediaLayout.fullscreenMediaItems,
            focusOrigin,
        });
    }

    function isDirectPreview(item: DisplayMediaItem): boolean {
        return item.previewObjectUrl === item.url;
    }

    function shouldAutoFetch(item: DisplayMediaItem): boolean {
        return (
            item.hasResolvedCache &&
            !item.cached &&
            !item.isCaching &&
            !item.hasFetchFailed
        );
    }

    function shouldShowPlaceholderLoader(
        item: DisplayMediaItem,
        renderState: PostHistoryMediaRenderState,
    ): boolean {
        return (
            renderState !== "ready" &&
            renderState !== "cache-materializing" &&
            (!item.hasResolvedCache || renderState === "loading")
        );
    }

    function shouldShowBlurhashPlaceholder(
        item: DisplayMediaItem,
        renderState: PostHistoryMediaRenderState,
    ): boolean {
        return (
            Boolean(item.blurhash) &&
            renderState !== "ready" &&
            renderState !== "cache-materializing" &&
            (item.kind === "image" || item.kind === "video")
        );
    }

    function getPlaceholderAriaLabel(item: DisplayMediaItem): string {
        return `${getMediaStatusLabel(item)} ${getLinkLabel(item)}`;
    }

    function getMediaStatusLabel(item: DisplayMediaItem): string {
        if (!item.hasResolvedCache || item.isLoadingPreview) {
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

{#snippet mediaCopyButton(item: DisplayMediaItem, className: string)}
    <Button
        variant="copy"
        shape="circle"
        className={`post-history-media-copy-button ${className}`}
        ariaLabel={getCopyButtonLabel(item.kind, item.url)}
        title={getCopyButtonLabel(item.kind, item.url)}
        onClick={(event) => handleCopyUrl(item, event)}
        floatingMessage={getCopyButtonFloatingMessage(item.kind)}
    >
        <div class="copy-icon svg-icon"></div>
    </Button>
{/snippet}

{#if resolvedMediaLayout.items.length > 0}
    <div class="post-history-media-section">
        <MediaGallery items={visualItems} preview>
            {#snippet renderItem(item)}
                {@const renderState = getRenderState(item)}
                {@const source = isDirectPreview(item) && !visibleUrls.has(item.url)
                    ? undefined
                    : item.previewObjectUrl}
                {@const showBlurhash = shouldShowBlurhashPlaceholder(item, renderState)}
                <div
                    class={[
                        "post-preview-gallery-card",
                        item.kind === "image" ? "post-history-image-cell" : "post-history-video-media-frame",
                    ]}
                    style:--post-preview-gallery-aspect-ratio={item.aspectRatio}
                    use:inViewportAction={{
                        enabled: shouldAutoFetch(item) || (isDirectPreview(item) && !visibleUrls.has(item.url)),
                        once: true,
                        root: scrollRoot,
                        rootMargin: AUTO_FETCH_ROOT_MARGIN,
                        onEnterView: () => {
                            visibleUrls.add(item.url);
                            if (shouldAutoFetch(item)) requestAutoFetch(item.url);
                        },
                    }}
                >
                    {#if source && item.kind === "image"}
                        {#if onImageOpen}
                            <button
                                type="button"
                                class="post-history-media-surface"
                                aria-label={getImageSurfaceAriaLabel(item)}
                                title={getLinkLabel(item)}
                                onclick={(event) => handleImageOpen(item, event.currentTarget)}
                            >
                                <img src={source} alt={item.alt || getLinkLabel(item)} draggable="false" />
                            </button>
                        {:else}
                            <img src={source} alt={item.alt || getLinkLabel(item)} draggable="false" />
                        {/if}
                    {:else if source && item.kind === "video"}
                        <video src={source} controls playsinline preload="metadata" aria-label={getLinkLabel(item)}>
                            <track kind="captions" />
                        </video>
                    {:else if renderState !== "cache-materializing"}
                        <div
                            class={[
                                "post-history-media-placeholder",
                                {
                                    "post-history-media-placeholder-failed": item.hasFetchFailed,
                                    "post-history-media-placeholder-blurhash": showBlurhash,
                                },
                            ]}
                            aria-label={getPlaceholderAriaLabel(item)}
                            title={getLinkLabel(item)}
                        >
                            {#if showBlurhash}
                                <BlurhashPlaceholder blurhash={item.blurhash} />
                            {/if}
                            {#if item.hasFetchFailed}
                                <button
                                    type="button"
                                    class="post-history-media-retry-button"
                                    onclick={() => handleRetry(item)}
                                >
                                    {$_("postHistory.mediaFetchAndCache")}
                                </button>
                            {:else if shouldShowPlaceholderLoader(item, renderState)}
                                <div class="post-history-media-placeholder-loader">
                                    <LoadingPlaceholder showLoader={true} text={false} loaderSize={34} />
                                </div>
                            {/if}
                        </div>
                    {/if}
                    {@render mediaCopyButton(item, "post-preview-gallery-copy")}
                </div>
            {/snippet}
        </MediaGallery>

        {#if otherItems.length > 0}
            <div class="post-history-other-media-list">
                {#each otherItems as item (item.id)}
                    {@const otherRenderState = getRenderState(item)}
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
                            {@render mediaCopyButton(
                                item,
                                "",
                            )}
                        </div>

                        <div
                            class="post-history-media-placeholder"
                            class:post-history-media-placeholder-cached={item.cached}
                            class:post-history-media-placeholder-uncached={!item.cached &&
                                !item.hasFetchFailed}
                            class:post-history-media-placeholder-failed={item.hasFetchFailed}
                            aria-label={getPlaceholderAriaLabel(item)}
                            title={getLinkLabel(item)}
                        >
                            <div class="post-history-media-placeholder-content">
                                {#if item.hasFetchFailed}
                                    <button
                                        type="button"
                                        class="post-history-media-retry-button"
                                        onclick={() => handleRetry(item)}
                                    >
                                        {$_("postHistory.mediaFetchAndCache")}
                                    </button>
                                {/if}
                            </div>
                            {#if shouldShowPlaceholderLoader(item, otherRenderState)}
                                <div
                                    class="post-history-media-placeholder-loader"
                                >
                                    <LoadingPlaceholder
                                        showLoader={true}
                                        text={false}
                                        loaderSize={34}
                                    />
                                </div>
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
        min-width: 0;
        gap: 10px;
    }

    .post-preview-gallery-card {
        position: relative;
        width: clamp(
            100px,
            calc(var(--media-gallery-height) * var(--post-preview-gallery-aspect-ratio, 1)),
            var(--media-gallery-max-width)
        );
        max-width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 6px;
    }

    .post-preview-gallery-card :is(img, video, .post-history-media-surface) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .post-history-media-surface {
        padding: 0;
        border: 0;
        border-radius: inherit;
        background: transparent;
        cursor: zoom-in;
    }

    .post-history-media-surface:focus-visible,
    .post-history-media-retry-button:focus-visible {
        outline: 2px solid var(--theme);
        outline-offset: -2px;
    }

    .post-preview-gallery-card .post-history-media-placeholder {
        display: grid;
        height: 100%;
        place-items: center;
        padding: 6px;
    }

    :global(button.post-preview-gallery-copy) {
        position: absolute;
        top: 4px;
        right: 4px;
        z-index: 2;
    }

    .post-history-media-placeholder {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
        justify-content: center;
        padding: 12px;
        text-align: start;
        position: relative;
        isolation: isolate;
        height: auto;
        aspect-ratio: var(--post-history-media-aspect-ratio, 1 / 1);
        overflow-wrap: anywhere;
        margin-inline: auto;
    }

    .post-history-media-placeholder-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }

    .post-history-media-placeholder-loader {
        position: absolute;
        inset: auto 8px 8px auto;
        z-index: 2;
        pointer-events: none;
    }

    .post-history-media-placeholder-uncached {
        --post-history-placeholder-stripe-soft: light-dark(
            color-mix(in srgb, var(--background-color, #fff) 94%, #000 6%),
            color-mix(in srgb, var(--background-color, #111) 94%, #fff 6%)
        );
        --post-history-placeholder-stripe-strong: light-dark(
            color-mix(in srgb, var(--background-color, #fff) 88%, #000 12%),
            color-mix(in srgb, var(--background-color, #111) 88%, #fff 12%)
        );

        background: repeating-linear-gradient(
            -45deg,
            var(--post-history-placeholder-stripe-soft),
            var(--post-history-placeholder-stripe-soft) 10px,
            var(--post-history-placeholder-stripe-strong) 10px,
            var(--post-history-placeholder-stripe-strong) 20px
        );
    }

    .post-history-media-placeholder-blurhash {
        background: color-mix(
            in srgb,
            var(--background-color, #fff) 18%,
            #000 82%
        );
    }

    .post-history-media-retry-button {
        width: 100%;
        height: 100%;
        padding: 6px 12px;
        border: 1px solid var(--border, #ccc);
        border-radius: 10px;
        color: var(--text, #111);
        font: inherit;
        cursor: pointer;
    }

    .post-history-other-media-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .post-history-other-media-card {
        display: flex;
        flex-direction: column;
        width: 100%;
        border-radius: 12px;
        border: 1px solid var(--border-hr);
        background: var(--bg-input);
        overflow: hidden;
    }

    .post-history-other-media-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .post-history-other-media-label {
        min-width: 0;
        padding: 4px 8px;
        overflow-wrap: anywhere;
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.2;
    }

    :global(button.post-history-media-copy-button.circle.copy) {
        min-width: 36px;
        width: 36px;
        height: 36px;
        min-height: 36px;
        z-index: 2;
    }

</style>
