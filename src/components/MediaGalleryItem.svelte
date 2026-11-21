<script lang="ts">
    import type { MediaGalleryItem } from "../lib/types";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import MediaActionButtons from "./MediaActionButtons.svelte";
    import { postComponentUIStore } from "../stores/postUIStore.svelte";
    import { _ } from "svelte-i18n";
    import { useLongPress } from "../lib/hooks/useLongPress.svelte";
    import { useMediaLoadState } from "../lib/hooks/useMediaLoadState.svelte";

    interface Props {
        item: MediaGalleryItem;
        index: number;
        onDelete: (id: string) => void;
        onDragStart: (index: number, event: DragEvent) => void;
        onDragOver: (index: number, event: DragEvent) => void;
        onDragEnd: () => void;
        onDrop: (toIndex: number) => void;
        onTouchDragStart?: (index: number, x: number, y: number) => void;
        disabled?: boolean;
    }

    let {
        item,
        index,
        onDelete,
        onDragStart,
        onDragOver,
        onDragEnd,
        onDrop,
        onTouchDragStart,
        disabled = false,
    }: Props = $props();

    let cardEl: HTMLDivElement | undefined = $state();
    let videoEl: HTMLVideoElement | undefined = $state();

    const mediaLoad = useMediaLoadState();

    // タッチ長押しドラッグ（親コンポーネントに委譲）
    useLongPress(() => cardEl, {
        onLongPress: (x, y) => {
            if (disabled) return;
            onTouchDragStart?.(index, x, y);
        },
    });

    let showActualImage = $derived(
        !item.isPlaceholder && item.type === "image" && !!item.src,
    );

    let showActualVideo = $derived(
        !item.isPlaceholder && item.type === "video" && !!item.src,
    );

    let placeholderAspectRatio = $derived.by(() => {
        const dims = item.dimensions;
        if (item.isPlaceholder && dims && dims.width > 0 && dims.height > 0) {
            return dims.width / dims.height;
        }
        return undefined;
    });

    function handleImageClick() {
        if (item.isPlaceholder || item.type !== "image") return;
        postComponentUIStore.showImageFullscreen(
            item.src,
            item.alt || "",
            item.id,
        );
    }

    // PC ドラッグ＆ドロップ
    function handleDragStartEvent(event: DragEvent) {
        if (disabled) {
            event.preventDefault();
            return;
        }
        // オーバーレイからのドラッグ時はカード全体をゴースト画像に使用
        if (cardEl && event.dataTransfer) {
            const rect = cardEl.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
            event.dataTransfer.setDragImage(cardEl, offsetX, offsetY);
        }
        onDragStart(index, event);
    }

    // オーバーレイクリック時にビデオの再生/停止をトグル
    function handleOverlayClick(event: MouseEvent) {
        event.stopPropagation();
        if (!videoEl) return;
        if (videoEl.paused) {
            videoEl.play();
        } else {
            videoEl.pause();
        }
    }

    function handleDragOverEvent(event: DragEvent) {
        event.preventDefault();
        if (disabled) return;
        onDragOver(index, event);
    }

    function handleDropEvent(event: DragEvent) {
        event.preventDefault();
        if (disabled) return;
        onDrop(index);
    }

    function handleImageKeyDown(event: KeyboardEvent) {
        if (item.type !== "image" || item.isPlaceholder) return;

        if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
            event.preventDefault();
            handleImageClick();
        }
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    bind:this={cardEl}
    class="gallery-item"
    class:is-placeholder={item.isPlaceholder}
    class:is-disabled={disabled}
    draggable={!disabled && (item.type !== "video" || item.isPlaceholder)}
    ondragstart={handleDragStartEvent}
    ondragover={handleDragOverEvent}
    ondrop={handleDropEvent}
    ondragend={() => onDragEnd()}
    role="group"
>
    <!-- メディア表示エリア -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
        class={[
            "gallery-item-media",
            { "has-placeholder-dimensions": placeholderAspectRatio !== undefined },
        ]}
        style:--gallery-placeholder-aspect-ratio={placeholderAspectRatio}
        onclick={item.type === "image" && !item.isPlaceholder
            ? handleImageClick
            : undefined}
        role={item.type === "image" && !item.isPlaceholder
            ? "button"
            : undefined}
        tabindex={item.type === "image" && !item.isPlaceholder ? 0 : undefined}
        aria-label={item.alt || item.src}
        onkeydown={handleImageKeyDown}
    >
        {#if item.isPlaceholder}
            <!-- プレースホルダー（アップロード中） -->
            <LoadingPlaceholder
                text={item.type === "video"
                    ? $_("videoNode.uploading")
                    : $_("imageNode.uploading")}
                showLoader={true}
            />
        {/if}

        {#if showActualImage}
            <img
                src={item.src}
                alt={item.alt || ""}
                class="gallery-image"
                class:image-loading={!mediaLoad.isLoaded}
                onload={mediaLoad.handleLoad}
                onerror={mediaLoad.handleError}
                draggable="false"
                oncontextmenu={(e) => e.preventDefault()}
            />
        {/if}

        {#if showActualVideo}
            <div class="video-wrapper">
                <video
                    bind:this={videoEl}
                    src={item.src}
                    controls
                    playsinline
                    autoplay
                    muted
                    loop
                    preload="metadata"
                    class="gallery-video"
                    draggable="false"
                    oncontextmenu={(e) => e.preventDefault()}
                >
                    <track kind="captions" />
                </video>
                <!-- ビデオ上部のドラッグハンドル（コントロール領域を除く） -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="video-drag-overlay"
                    draggable={!disabled}
                    ondragstart={handleDragStartEvent}
                    onclick={handleOverlayClick}
                    aria-hidden="true"
                ></div>
            </div>
        {/if}
    </div>

    <!-- 削除・コピーボタン（プレースホルダー以外） -->
    {#if !item.isPlaceholder}
        <MediaActionButtons
            src={item.src}
            onDelete={() => onDelete(item.id)}
            deleteAriaLabel={$_("imageContextMenu.delete")}
            copyAriaLabel={$_("imageContextMenu.copyUrl")}
            copySuccessMessage={$_("imageContextMenu.copySuccess")}
            layout="gallery"
            deleteDisabled={disabled}
        />
    {/if}
</div>

<style>
    .gallery-item,
    .gallery-item-media,
    .video-wrapper {
        position: relative;
    }

    .gallery-item,
    .gallery-item-media,
    .gallery-image,
    .gallery-video {
        -webkit-touch-callout: none;
    }

    .gallery-item,
    .gallery-image,
    .gallery-video {
        -webkit-user-select: none;
        user-select: none;
    }

    .gallery-item,
    .video-drag-overlay {
        cursor: grab;
    }

    .gallery-item:active,
    .video-drag-overlay:active {
        cursor: grabbing;
    }

    .gallery-item.is-disabled,
    .gallery-item.is-disabled .gallery-item-media,
    .gallery-item.is-disabled .video-drag-overlay {
        cursor: not-allowed;
    }

    .gallery-item.is-disabled {
        opacity: 0.72;
    }

    .gallery-item {
        display: inline-flex;
        flex-shrink: 0;
        height: var(--media-gallery-item-height, 180px);
        overflow: visible;
        transition:
            transform 0.15s ease,
            opacity 0.15s ease;

        :global(.circle) {
            width: 40px;
            height: 40px;
        }
    }

    .gallery-item-media {
        height: 100%;
        border-radius: 6px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .gallery-item-media[role="button"] {
        cursor: pointer;
        background-color: transparent;
    }

    .gallery-image,
    .gallery-video {
        object-fit: cover;
        display: block;
        height: 100%;
    }

    .gallery-image,
    .is-placeholder .gallery-item-media {
        min-width: 100px;
        max-width: var(--media-gallery-max-width, 180px);
    }

    .is-placeholder .gallery-item-media {
        aspect-ratio: var(--gallery-placeholder-aspect-ratio, auto);
    }

    .is-placeholder .gallery-item-media:not(.has-placeholder-dimensions) {
        width: var(--media-gallery-max-width, 180px);
    }

    .gallery-image {
        -webkit-drag: none;

        &.image-loading {
            opacity: 0;
        }
    }

    .video-wrapper {
        width: var(--media-gallery-max-width, 180px);
        height: 100%;
    }

    .gallery-video {
        width: 100%;
    }

    .video-drag-overlay {
        position: absolute;
        inset: 0 0 50px;
        z-index: 1;
    }

    @media (hover: none) and (pointer: coarse) {
        .video-drag-overlay {
            display: none;
        }
    }
</style>
