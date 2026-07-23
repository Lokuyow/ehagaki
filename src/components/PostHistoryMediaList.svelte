<script lang="ts">
    import BlurhashPlaceholder from "./BlurhashPlaceholder.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import Button from "./Button.svelte";
    import { _ } from "svelte-i18n";
    import { inViewportAction } from "../lib/hooks/inViewportAction.svelte";
    import { usePostHistoryMediaCache } from "../lib/hooks/usePostHistoryMediaCache.svelte";
    import {
        buildPostHistoryMediaLayout,
        type PostHistoryDisplayMediaKind,
        type PostHistoryMediaDimensionHints,
        type PostHistoryMediaRenderState,
        type PostHistoryResolvedMedia,
        resolvePostHistoryMediaDimensionHints,
        resolvePostHistoryMediaAspectRatio,
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
        }) => void;
    }

    type DisplayMediaItem = PostHistoryResolvedMedia & {
        hasResolvedCache: boolean;
        cached: boolean;
        previewObjectUrl?: string;
        isLoadingPreview: boolean;
        isCaching: boolean;
        hasFetchFailed: boolean;
    };

    type ImagePresentation = {
        aspectRatio: string;
        dimensionHints: PostHistoryMediaDimensionHints;
        isSingleImage: boolean;
        frameStyle?: string;
        surfaceStyle: string;
        layoutFrameStyle?: string;
        imageStyle?: string;
    };

    const AUTO_FETCH_ROOT_MARGIN = "160px 0px";
    const SINGLE_IMAGE_MAX_HEIGHT = 300;
    const SINGLE_IMAGE_MIN_SIZE = 100;
    const SINGLE_IMAGE_MIN_STAGE_ASPECT_RATIO =
        SINGLE_IMAGE_MIN_SIZE / SINGLE_IMAGE_MAX_HEIGHT;

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

    function getAspectRatioValue(aspectRatio: string): number {
        const [widthText, heightText] = aspectRatio.split("/");
        const width = Number(widthText?.trim());
        const height = Number(heightText?.trim());

        if (
            !Number.isFinite(width) ||
            !Number.isFinite(height) ||
            height <= 0
        ) {
            return 1;
        }

        return width / height;
    }

    function formatPixelValue(value: number): string {
        return Number.isInteger(value)
            ? `${value}`
            : value
                  .toFixed(6)
                  .replace(/\.0+$/, "")
                  .replace(/(\.\d*?)0+$/, "$1");
    }

    function getSingleImageWidth(aspectRatio: string): string {
        const maxWidth =
            SINGLE_IMAGE_MAX_HEIGHT * getAspectRatioValue(aspectRatio);

        return `min(100%, ${formatPixelValue(maxWidth)}px)`;
    }

    function getSingleImageMinimumWidth(aspectRatio: string): string {
        const minimumWidth = Math.max(
            SINGLE_IMAGE_MIN_SIZE,
            SINGLE_IMAGE_MIN_SIZE * getAspectRatioValue(aspectRatio),
        );

        return `min(100%, ${formatPixelValue(minimumWidth)}px)`;
    }

    function getSingleImageFrameStyle(aspectRatio: string): string {
        return `width: max(${getSingleImageWidth(aspectRatio)}, ${getSingleImageMinimumWidth(aspectRatio)});`;
    }

    function getSingleImageSurfaceStyle(): string {
        return ["width: 100%;", `min-height: ${SINGLE_IMAGE_MIN_SIZE}px;`].join(
            " ",
        );
    }

    function getSingleImageLayoutAspectRatio(aspectRatio: string): string {
        return getAspectRatioValue(aspectRatio) <
            SINGLE_IMAGE_MIN_STAGE_ASPECT_RATIO
            ? `${SINGLE_IMAGE_MIN_SIZE} / ${SINGLE_IMAGE_MAX_HEIGHT}`
            : aspectRatio;
    }

    function getSingleImageLayoutFrameStyle(aspectRatio: string): string {
        const stageAspectRatio = getSingleImageLayoutAspectRatio(aspectRatio);

        return [
            `aspect-ratio: ${stageAspectRatio};`,
            "width: 100%;",
            `max-height: ${SINGLE_IMAGE_MAX_HEIGHT}px;`,
            `min-height: ${SINGLE_IMAGE_MIN_SIZE}px;`,
            "padding: 0;",
        ].join(" ");
    }

    function getSingleImageLayoutImageStyle(aspectRatio: string): string {
        return [
            "position: absolute;",
            "inset: 0;",
            "width: 100%;",
            "height: 100%;",
            "max-width: 100%;",
            "object-fit: cover;",
            "object-position: center;",
        ].join(" ");
    }

    function getMediaSurfaceStyle(aspectRatio: string): string {
        return [`aspect-ratio: ${aspectRatio};`, "width: 100%;"].join(" ");
    }

    function hasMetadataHint(item: DisplayMediaItem): boolean {
        return Boolean(item.blurhash?.trim() || item.dim?.trim());
    }

    function getImageRenderState(
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

    function getImagePresentation(params: {
        item: DisplayMediaItem;
        slotCount: number;
        isSingleImage: boolean;
    }): ImagePresentation {
        const aspectRatio = getImageAspectRatio(params.item, params.slotCount);
        const dimensionHints = resolvePostHistoryMediaDimensionHints({
            dim: params.item.dim,
            kind: params.item.kind,
        });

        if (!params.isSingleImage) {
            const surfaceStyle = getMediaSurfaceStyle(aspectRatio);

            return {
                aspectRatio,
                dimensionHints,
                isSingleImage: false,
                surfaceStyle,
            };
        }

        return {
            aspectRatio,
            dimensionHints,
            isSingleImage: true,
            frameStyle: getSingleImageFrameStyle(aspectRatio),
            surfaceStyle: getSingleImageSurfaceStyle(),
            layoutFrameStyle: getSingleImageLayoutFrameStyle(aspectRatio),
            imageStyle: getSingleImageLayoutImageStyle(aspectRatio),
        };
    }

    function shouldShowInlinePlaceholderLoader(
        item: DisplayMediaItem,
        presentation: ImagePresentation,
        renderState: PostHistoryMediaRenderState,
    ): boolean {
        return (
            !presentation.isSingleImage &&
            shouldShowPlaceholderLoader(item, renderState)
        );
    }

    function shouldShowFloatingPlaceholderLoader(
        item: DisplayMediaItem,
        presentation: ImagePresentation,
        renderState: PostHistoryMediaRenderState,
    ): boolean {
        return (
            presentation.isSingleImage &&
            shouldShowPlaceholderLoader(item, renderState)
        );
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

    function shouldRenderReadyMedia(
        renderState: PostHistoryMediaRenderState,
    ): boolean {
        return renderState === "ready" || renderState === "cache-materializing";
    }

    function getImagePlaceholderVariantClass(
        renderState: PostHistoryMediaRenderState,
    ): string {
        if (renderState === "error") {
            return "post-history-media-placeholder-failed";
        }

        return "post-history-media-placeholder-uncached";
    }

    function getPlaceholderAriaLabel(item: DisplayMediaItem): string {
        return `${getMediaStatusLabel(item)} ${getLinkLabel(item)}`;
    }

    function getImageAspectRatio(
        item: DisplayMediaItem,
        slotCount: number,
    ): string {
        if (mediaLayout.images.length === 4) {
            return "4 / 3";
        }

        if (slotCount !== 1) {
            return "1 / 1";
        }

        return resolvePostHistoryMediaAspectRatio({
            dim: item.dim,
            kind: item.kind,
        });
    }

    function getVideoAspectRatio(item: DisplayMediaItem): string {
        return resolvePostHistoryMediaAspectRatio({
            dim: item.dim,
            kind: item.kind,
        });
    }

    function getVideoTypeHint(item: DisplayMediaItem): string {
        return item.mimeType?.trim() || "video";
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

{#snippet imagePlaceholder(
    item: DisplayMediaItem,
    presentation: ImagePresentation,
    variantClassName: string,
    showBlurhashPlaceholder: boolean,
    showRetry: boolean,
)}
    <div
        class={`post-history-media-placeholder ${variantClassName}`}
        class:post-history-media-placeholder-blurhash={showBlurhashPlaceholder}
        class:post-history-image-placeholder-single={presentation.isSingleImage}
        style={presentation.isSingleImage
            ? undefined
            : presentation.surfaceStyle}
        aria-label={getPlaceholderAriaLabel(item)}
        title={getLinkLabel(item)}
    >
        {#if showBlurhashPlaceholder}
            <BlurhashPlaceholder blurhash={item.blurhash} />
        {/if}
        {#if showRetry}
            <div class="post-history-media-placeholder-content">
                <button
                    type="button"
                    class="post-history-media-retry-button"
                    onclick={() => handleRetry(item)}
                >
                    {$_("postHistory.mediaFetchAndCache")}
                </button>
            </div>
        {/if}
        {#if shouldShowInlinePlaceholderLoader(item, presentation, getImageRenderState(item))}
            <div class="post-history-media-placeholder-loader">
                <LoadingPlaceholder
                    showLoader={true}
                    text={false}
                    loaderSize={34}
                />
            </div>
        {/if}
    </div>
{/snippet}

{#if mediaLayout.items.length > 0}
    <div class="post-history-media-section">
        {#if imageRows.length > 0}
            <div
                class="post-history-image-grid"
                class:post-history-image-grid-single={mediaLayout.images
                    .length === 1}
            >
                {#each imageRows as row, rowIndex (rowIndex)}
                    <div
                        class="post-history-image-row"
                        style={`--post-history-image-columns: ${row.slotCount};`}
                    >
                        {#each row.items as item (item.id)}
                            {@const isSingleImage =
                                mediaLayout.images.length === 1}
                            {@const imagePresentation = getImagePresentation({
                                item,
                                slotCount: row.slotCount,
                                isSingleImage,
                            })}
                            {@const imageRenderState =
                                getImageRenderState(item)}
                            {@const showBlurhashPlaceholder =
                                shouldShowBlurhashPlaceholder(
                                    item,
                                    imageRenderState,
                                )}
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
                                <div
                                    class="post-history-image-surface-frame"
                                    class:post-history-image-surface-frame-single={isSingleImage}
                                    style={isSingleImage
                                        ? imagePresentation.frameStyle
                                        : undefined}
                                >
                                    {#if shouldRenderReadyMedia(imageRenderState)}
                                        <button
                                            type="button"
                                            class="post-history-media-surface post-history-image-surface"
                                            class:post-history-image-surface-single={isSingleImage}
                                            style={imagePresentation.surfaceStyle}
                                            aria-label={getImageSurfaceAriaLabel(
                                                item,
                                            )}
                                            title={getLinkLabel(item)}
                                            onclick={() =>
                                                handleImageOpen(item)}
                                        >
                                            {#if isSingleImage}
                                                <div
                                                    class="post-history-media-layout-frame post-history-single-image-layout-frame"
                                                    style={imagePresentation.layoutFrameStyle}
                                                >
                                                    {#if item.previewObjectUrl}
                                                        <img
                                                            src={item.previewObjectUrl}
                                                            alt={item.alt ||
                                                                getLinkLabel(
                                                                    item,
                                                                )}
                                                            class="post-history-media-image post-history-media-image-single-stage"
                                                            style={imagePresentation.imageStyle}
                                                            width={imagePresentation
                                                                .dimensionHints
                                                                .width}
                                                            height={imagePresentation
                                                                .dimensionHints
                                                                .height}
                                                            loading="lazy"
                                                            decoding="async"
                                                        />
                                                    {/if}
                                                </div>
                                            {:else if item.previewObjectUrl}
                                                <img
                                                    src={item.previewObjectUrl}
                                                    alt={item.alt ||
                                                        getLinkLabel(item)}
                                                    class="post-history-media-image"
                                                    width={imagePresentation
                                                        .dimensionHints.width}
                                                    height={imagePresentation
                                                        .dimensionHints.height}
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            {/if}
                                        </button>
                                    {:else if isSingleImage}
                                        <div
                                            class="post-history-media-layout-frame post-history-single-image-layout-frame"
                                            style={imagePresentation.layoutFrameStyle}
                                        >
                                            {@render imagePlaceholder(
                                                item,
                                                imagePresentation,
                                                getImagePlaceholderVariantClass(
                                                    imageRenderState,
                                                ),
                                                showBlurhashPlaceholder,
                                                imageRenderState === "error",
                                            )}
                                        </div>
                                    {:else}
                                        {@render imagePlaceholder(
                                            item,
                                            imagePresentation,
                                            getImagePlaceholderVariantClass(
                                                imageRenderState,
                                            ),
                                            showBlurhashPlaceholder,
                                            imageRenderState === "error",
                                        )}
                                    {/if}

                                    {#if shouldShowFloatingPlaceholderLoader(item, imagePresentation, imageRenderState)}
                                        <div
                                            class="post-history-media-placeholder-loader post-history-media-placeholder-loader-single"
                                        >
                                            <LoadingPlaceholder
                                                showLoader={true}
                                                text={false}
                                                loaderSize={34}
                                            />
                                        </div>
                                    {/if}

                                    {@render mediaCopyButton(
                                        item,
                                        "post-history-media-copy-button-image",
                                    )}
                                </div>
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        {/if}

        {#if videoItems.length > 0}
            <div class="post-history-video-list">
                {#each videoItems as item (item.id)}
                    {@const videoAspectRatio = getVideoAspectRatio(item)}
                    {@const videoRenderState = getImageRenderState(item)}
                    {@const showBlurhashPlaceholder =
                        shouldShowBlurhashPlaceholder(item, videoRenderState)}
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
                            {@render mediaCopyButton(
                                item,
                                "post-history-video-copy-button",
                            )}
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
                        {:else}
                            <div
                                class="post-history-media-placeholder post-history-video-placeholder"
                                class:post-history-media-placeholder-cached={item.cached}
                                class:post-history-media-placeholder-uncached={!item.cached &&
                                    !item.hasFetchFailed}
                                class:post-history-media-placeholder-failed={item.hasFetchFailed}
                                class:post-history-media-placeholder-blurhash={showBlurhashPlaceholder}
                                style={getMediaSurfaceStyle(videoAspectRatio)}
                                aria-label={getPlaceholderAriaLabel(item)}
                                title={getLinkLabel(item)}
                            >
                                {#if showBlurhashPlaceholder}
                                    <BlurhashPlaceholder
                                        blurhash={item.blurhash}
                                    />
                                {/if}
                                <div
                                    class="post-history-media-placeholder-content"
                                >
                                    {#if item.hasFetchFailed}
                                        <button
                                            type="button"
                                            class="post-history-media-retry-button"
                                            onclick={() => handleRetry(item)}
                                        >
                                            {$_(
                                                "postHistory.mediaFetchAndCache",
                                            )}
                                        </button>
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    </article>
                {/each}
            </div>
        {/if}

        {#if otherItems.length > 0}
            <div class="post-history-other-media-list">
                {#each otherItems as item (item.id)}
                    {@const otherRenderState = getImageRenderState(item)}
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
                                "post-history-video-copy-button",
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
        gap: 10px;
    }

    .post-history-image-grid {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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

    .post-history-image-surface-frame {
        position: relative;
        width: 100%;

        .post-history-media-surface {
            font-size: 0;
            display: block;
            width: 100%;
            padding: 0;
            border: 0;
            background-color: transparent;
            text-align: left;
            cursor: pointer;
            margin-inline: auto;

            &:active:not(:disabled) {
                scale: 1;
            }
        }
    }

    /* 単体画像のときグリッド側のボーダーを無効化 */
    .post-history-image-grid-single {
        border: none;
        border-radius: 0;
        overflow: visible;
    }

    .post-history-image-surface-frame-single {
        max-width: 100%;
        margin-inline: 0;
        border-radius: 12px;
        overflow: hidden;
    }

    .post-history-image-surface {
        overflow: hidden;
    }

    .post-history-image-surface-single {
        display: block;
        min-height: 100px;
    }

    .post-history-media-layout-frame {
        position: relative;
        width: 100%;
        max-width: 100%;
        overflow: hidden;
        background: transparent;
    }

    .post-history-single-image-layout-frame {
        position: relative;
        padding: 0;
        display: grid;
        place-items: center;
        justify-self: stretch;
        align-self: stretch;
        overflow: hidden;
        background: transparent;
    }

    .post-history-image-placeholder-single {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        width: 100%;
        height: 100%;
        min-height: 0;
    }

    .post-history-media-image,
    .post-history-media-placeholder,
    .post-history-media-layout-frame {
        width: 100%;
        max-width: 100%;
    }

    .post-history-media-image {
        display: block;
        height: 100%;
        object-fit: cover;
    }

    .post-history-media-image-single {
        height: auto;
        margin-inline: auto;
    }

    .post-history-media-image-single-stage {
        position: relative;
        z-index: 1;
    }

    .post-history-media-video {
        display: block;
        width: 100%;
        max-height: 300px;
        height: 100%;
        object-fit: contain;
        border-radius: 10px;
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
        text-align: left;
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

    .post-history-media-placeholder-loader-single {
        z-index: 3;
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

    .post-history-image-placeholder-single.post-history-media-placeholder {
        height: 100%;
        margin-inline: 0;
        aspect-ratio: auto;
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
        width: 100%;
        border-radius: 12px;
        border: 1px solid var(--border-hr);
        background: var(--bg-input);
        overflow: hidden;
    }

    .post-history-video-card-header,
    .post-history-other-media-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .post-history-video-card-label,
    .post-history-other-media-label {
        min-width: 0;
        padding: 4px 8px;
        overflow-wrap: anywhere;
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.2;
    }

    .post-history-video-placeholder {
        aspect-ratio: var(--post-history-media-aspect-ratio, 16 / 9);
    }

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

    :global(.post-history-media-video) {
        background-color: light-dark(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
    }
</style>
