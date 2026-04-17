<script lang="ts">
    import type { MediaGalleryItem } from "../lib/types";
    import type { MediaGalleryLayout } from "../lib/mediaGalleryLayoutUtils";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import MediaActionButtons from "./MediaActionButtons.svelte";
    import { postComponentUIStore } from "../stores/postUIStore.svelte";
    import { _ } from "svelte-i18n";
    import { useLongPress } from "../lib/hooks/useLongPress.svelte";
    import { useMediaLoadState } from "../lib/hooks/useMediaLoadState.svelte";

    interface Props {
        item: MediaGalleryItem;
        layout: MediaGalleryLayout;
        index: number;
        onDelete: (id: string) => void;
        onDragStart: (index: number, event: DragEvent) => void;
        onDragOver: (index: number, event: DragEvent) => void;
        onDragEnd: () => void;
        onDrop: (toIndex: number) => void;
        onTouchDragStart?: (index: number, x: number, y: number) => void;
    }

    let {
        item,
        layout,
        index,
        onDelete,
        onDragStart,
        onDragOver,
        onDragEnd,
        onDrop,
        onTouchDragStart,
    }: Props = $props();

    let cardEl: HTMLDivElement | undefined = $state();
    let videoEl: HTMLVideoElement | undefined = $state();

    const mediaLoad = useMediaLoadState();

    // タッチ長押しドラッグ（親コンポーネントに委譲）
    useLongPress(() => cardEl, {
        onLongPress: (x, y) => {
            onTouchDragStart?.(index, x, y);
        },
    });

    let showActualImage = $derived(
        !item.isPlaceholder && item.type === "image" && !!item.src,
    );

    let showActualVideo = $derived(
        !item.isPlaceholder && item.type === "video" && !!item.src,
    );

    let galleryLayoutStyle = $derived(
        `--gallery-media-height: ${layout.height}px; --gallery-media-min-width: ${layout.minWidth}px; --gallery-media-max-width: ${layout.maxWidth}px; --gallery-action-button-size: ${layout.actionButtonSize}px; --gallery-copy-button-top: ${layout.copyButtonTop}px;`,
    );

    let placeholderStyle = $derived.by(() => {
        if (!item.isPlaceholder) return undefined;
        const dims = item.dimensions;
        if (dims && dims.width > 0 && dims.height > 0) {
            // アスペクト比から幅を計算し、ギャラリー制約に収める
            const aspectRatio = dims.width / dims.height;
            const w = Math.round(layout.height * aspectRatio);
            const clampedWidth = Math.max(
                layout.minWidth,
                Math.min(layout.maxWidth, w),
            );
            return `width: ${clampedWidth}px; height: ${layout.height}px;`;
        }
        // 寸法情報がない場合はデフォルト
        return `width: ${layout.maxWidth}px; height: ${layout.height}px;`;
    });

    function handleImageClick() {
        if (item.isPlaceholder || item.type !== "image") return;
        postComponentUIStore.showImageFullscreen(item.src, item.alt || "");
    }

    // PC ドラッグ＆ドロップ
    function handleDragStartEvent(event: DragEvent) {
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
    function handleOverlayClick() {
        if (!videoEl) return;
        if (videoEl.paused) {
            videoEl.play();
        } else {
            videoEl.pause();
        }
    }

    function handleDragOverEvent(event: DragEvent) {
        event.preventDefault();
        onDragOver(index, event);
    }

    function handleDropEvent(event: DragEvent) {
        event.preventDefault();
        onDrop(index);
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    bind:this={cardEl}
    class="gallery-item"
    class:is-placeholder={item.isPlaceholder}
    style={galleryLayoutStyle}
    draggable={item.type !== "video" || item.isPlaceholder}
    ondragstart={handleDragStartEvent}
    ondragover={handleDragOverEvent}
    ondrop={handleDropEvent}
    ondragend={() => onDragEnd()}
    role="listitem"
>
    <!-- メディア表示エリア -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
        class="gallery-item-media"
        style={placeholderStyle}
        onclick={item.type === "image" && !item.isPlaceholder
            ? handleImageClick
            : undefined}
        role={item.type === "image" && !item.isPlaceholder
            ? "button"
            : undefined}
        tabindex={item.type === "image" && !item.isPlaceholder ? 0 : undefined}
        aria-label={item.alt || item.src}
        onkeydown={(e) => {
            if (
                e.key === "Enter" &&
                item.type === "image" &&
                !item.isPlaceholder
            )
                handleImageClick();
        }}
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
                    draggable="true"
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
        />
    {/if}
</div>

<style>
    .gallery-item {
        position: relative;
        display: inline-flex;
        flex-shrink: 0;
        overflow: visible;
        cursor: grab;
        transition:
            transform 0.15s ease,
            opacity 0.15s ease;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;

        :global(.circle) {
            width: 40px;
            height: 40px;
        }
    }

    .gallery-item:active {
        cursor: grabbing;
    }

    .gallery-item-media {
        border-radius: 6px;
        overflow: hidden;
        background-color: transparent;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        -webkit-touch-callout: none;
    }

    .gallery-item-media[role="button"] {
        cursor: pointer;
    }

    .gallery-image {
        min-width: var(--gallery-media-min-width);
        max-width: var(--gallery-media-max-width);
        height: var(--gallery-media-height);
        object-fit: cover;
        display: block;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        -webkit-drag: none;

        &.image-loading {
            opacity: 0;
        }
    }

    .video-wrapper {
        position: relative;
        width: var(--gallery-media-max-width);
        height: var(--gallery-media-height);
    }

    .gallery-video {
        width: var(--gallery-media-max-width);
        height: var(--gallery-media-height);
        object-fit: cover;
        display: block;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
    }

    .video-drag-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 50px;
        cursor: grab;
        z-index: 1;
    }

    .video-drag-overlay:active {
        cursor: grabbing;
    }
</style>
