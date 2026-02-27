<script lang="ts">
    import type { MediaGalleryItem } from "../lib/types";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import MediaActionButtons from "./MediaActionButtons.svelte";
    import { postComponentUIStore } from "../stores/appStore.svelte";
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
    }: Props = $props();

    let cardEl: HTMLDivElement | undefined = $state();

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

    // プレースホルダーの表示サイズをアップロード後のメディア表示サイズに合わせる
    // ギャラリーの実メディアはheight:220px, min-width:100px, max-width:220px, object-fit:cover
    const GALLERY_HEIGHT = 220;
    const GALLERY_MIN_WIDTH = 100;
    const GALLERY_MAX_WIDTH = 220;

    let placeholderStyle = $derived.by(() => {
        if (!item.isPlaceholder) return undefined;
        const dims = item.dimensions;
        if (dims && dims.width > 0 && dims.height > 0) {
            // アスペクト比から幅を計算し、ギャラリー制約に収める
            const aspectRatio = dims.width / dims.height;
            const w = Math.round(GALLERY_HEIGHT * aspectRatio);
            const clampedWidth = Math.max(
                GALLERY_MIN_WIDTH,
                Math.min(GALLERY_MAX_WIDTH, w),
            );
            return `width: ${clampedWidth}px; height: ${GALLERY_HEIGHT}px;`;
        }
        // 寸法情報がない場合はデフォルト
        return `width: ${GALLERY_MAX_WIDTH}px; height: ${GALLERY_HEIGHT}px;`;
    });

    function handleImageClick() {
        if (item.isPlaceholder || item.type !== "image") return;
        postComponentUIStore.showImageFullscreen(item.src, item.alt || "");
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
</script>

<div
    bind:this={cardEl}
    class="gallery-item"
    class:is-placeholder={item.isPlaceholder}
    draggable="true"
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
</style>
