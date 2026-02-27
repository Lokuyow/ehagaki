<script lang="ts">
    import type { MediaGalleryItem } from "../lib/types";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { postComponentUIStore } from "../stores/appStore.svelte";
    import { copyToClipboard } from "../lib/utils/clipboardUtils";
    import { _ } from "svelte-i18n";
    import { onDestroy } from "svelte";
    import { LONG_PRESS_DELAY } from "../lib/constants";

    interface Props {
        item: MediaGalleryItem;
        index: number;
        isDragOver?: boolean;
        onDelete: (id: string) => void;
        onDragStart: (index: number, event: DragEvent) => void;
        onDragOver: (index: number, event: DragEvent) => void;
        onDragEnd: () => void;
        onDrop: (toIndex: number) => void;
        onTouchDragStart?: (index: number, x: number, y: number) => void;
    }

    let {
        item,
        index,
        isDragOver = false,
        onDelete,
        onDragStart,
        onDragOver,
        onDragEnd,
        onDrop,
        onTouchDragStart,
    }: Props = $props();

    let isImageLoaded = $state(false);
    let cardEl: HTMLDivElement | undefined = $state();

    let showActualImage = $derived(
        !item.isPlaceholder && item.type === "image" && !!item.src,
    );

    let showActualVideo = $derived(
        !item.isPlaceholder && item.type === "video" && !!item.src,
    );

    // タッチ長押しドラッグ用
    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let touchStartPos = { x: 0, y: 0 };

    function handleImageLoad() {
        isImageLoaded = true;
    }

    function handleImageError() {
        isImageLoaded = false;
    }

    function handleImageClick() {
        if (item.isPlaceholder || item.type !== "image") return;
        postComponentUIStore.showImageFullscreen(item.src, item.alt || "");
    }

    function handleDelete(event: MouseEvent) {
        event.stopPropagation();
        onDelete(item.id);
    }

    function handleCopyUrl(event: MouseEvent) {
        event.stopPropagation();
        copyToClipboard(item.src, "URL");
        const pos = { x: event.clientX, y: event.clientY };
        postComponentUIStore.showPopupMessage(
            pos.x,
            pos.y,
            $_("imageContextMenu.copySuccess"),
        );
    }

    // PC ドラッグ＆ドロップ
    function handleDragStartEvent(event: DragEvent) {
        onDragStart(index, event);
    }

    function handleDragOverEvent(event: DragEvent) {
        event.preventDefault();
        onDragOver(index, event);
    }

    function handleDropEvent(event: DragEvent) {
        event.preventDefault();
        onDrop(index);
    }

    // タッチ長押しドラッグ
    function handleTouchStart(event: TouchEvent) {
        if (event.touches.length !== 1) return;
        const touch = event.touches[0];
        touchStartPos = { x: touch.clientX, y: touch.clientY };

        longPressTimer = setTimeout(() => {
            onTouchDragStart?.(index, touchStartPos.x, touchStartPos.y);
        }, LONG_PRESS_DELAY);
    }

    function handleTouchMove(event: TouchEvent) {
        if (!longPressTimer) return;
        const touch = event.touches[0];
        const dx = Math.abs(touch.clientX - touchStartPos.x);
        const dy = Math.abs(touch.clientY - touchStartPos.y);
        // 少し動いたらキャンセル
        if (dx > 10 || dy > 10) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    }

    function handleTouchEnd() {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    }

    onDestroy(() => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    });
</script>

<div
    bind:this={cardEl}
    class="gallery-item"
    class:drag-over={isDragOver}
    class:is-placeholder={item.isPlaceholder}
    draggable="true"
    ondragstart={handleDragStartEvent}
    ondragover={handleDragOverEvent}
    ondrop={handleDropEvent}
    ondragend={() => onDragEnd()}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    role="listitem"
>
    <!-- メディア表示エリア -->
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <div
        class="gallery-item-media"
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
                class:image-loading={!isImageLoaded}
                onload={handleImageLoad}
                onerror={handleImageError}
                draggable="false"
            />
        {/if}

        {#if showActualVideo}
            <video
                src={item.src}
                controls
                playsinline
                autoplay
                muted
                loop
                preload="metadata"
                class="gallery-video"
            >
                <track kind="captions" />
            </video>
        {/if}
    </div>

    <!-- 削除ボタン -->
    <Button
        variant="close"
        shape="circle"
        className="gallery-delete-button"
        ariaLabel={$_("imageContextMenu.delete")}
        onClick={handleDelete}
    >
        <div class="close-icon svg-icon"></div>
    </Button>

    <!-- URLコピーボタン（プレースホルダー以外） -->
    {#if !item.isPlaceholder}
        <Button
            variant="copy"
            shape="circle"
            className="gallery-copy-button"
            ariaLabel={$_("imageContextMenu.copyUrl")}
            onClick={handleCopyUrl}
        >
            <div class="copy-icon svg-icon"></div>
        </Button>
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

    .gallery-item.drag-over {
        outline: 2px solid var(--theme, #2196f3);
        outline-offset: 2px;
        transform: scale(0.97);
    }

    .gallery-item-media {
        border-radius: 6px;
        overflow: hidden;
        background: var(--bg-input);
        border: 1px solid var(--border);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .gallery-item-media[role="button"] {
        cursor: pointer;
    }

    .gallery-image {
        min-width: 100px;
        max-width: 220px;
        height: 220px;
        object-fit: cover;
        display: block;
        -webkit-user-select: none;
        user-select: none;
        -webkit-drag: none;

        &.image-loading {
            opacity: 0;
        }
    }

    .gallery-video {
        min-width: 100px;
        max-width: 220px;
        height: 220px;
        object-fit: cover;
        display: block;
    }

    /* ボタン共通スタイル */
    :global(.gallery-delete-button) {
        position: absolute;
        top: 2px;
        right: 2px;
        z-index: 10;
        width: 28px;
        height: 28px;

        .close-icon {
            mask-image: url("/icons/xmark-solid-full.svg");
            width: 28px;
            height: 28px;
        }
    }

    :global(.gallery-copy-button) {
        position: absolute;
        bottom: 2px;
        right: 2px;
        z-index: 10;
        width: 28px;
        height: 28px;

        .copy-icon {
            width: 28px;
            height: 28px;
        }
    }
</style>
