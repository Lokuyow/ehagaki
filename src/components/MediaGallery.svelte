<script lang="ts">
    import { mediaGalleryStore } from "../stores/mediaGalleryStore.svelte";
    import MediaGalleryItem from "./MediaGalleryItem.svelte";
    import { _ } from "svelte-i18n";

    // PC ドラッグ＆ドロップ状態
    let dragFromIndex = $state(-1);
    let dragOverIndex = $state(-1);

    // タッチドラッグ状態
    let touchDragIndex = $state(-1);
    let touchDragOverIndex = $state(-1);
    let touchPreviewEl: HTMLElement | null = null;
    let galleryEl: HTMLDivElement | undefined = $state();

    let items = $derived(mediaGalleryStore.items);

    // --- PC DnD ハンドラ ---
    function handleDragStart(index: number, event: DragEvent) {
        dragFromIndex = index;
        event.dataTransfer?.setData("text/plain", String(index));
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
        }
    }

    function handleDragOver(index: number, event: DragEvent) {
        event.preventDefault();
        dragOverIndex = index;
    }

    function handleDragEnd() {
        dragFromIndex = -1;
        dragOverIndex = -1;
    }

    function handleDrop(toIndex: number) {
        if (dragFromIndex !== -1 && dragFromIndex !== toIndex) {
            mediaGalleryStore.reorderItems(dragFromIndex, toIndex);
        }
        dragFromIndex = -1;
        dragOverIndex = -1;
    }

    function handleDelete(id: string) {
        mediaGalleryStore.removeItem(id);
    }

    // --- タッチ DnD ハンドラ ---
    function handleTouchDragStart(index: number, x: number, y: number) {
        touchDragIndex = index;

        // ドラッグプレビューの作成
        removeTouchPreview();
        const itemEl = galleryEl?.querySelectorAll(".gallery-item-wrapper")[
            index
        ] as HTMLElement | null;
        if (itemEl) {
            touchPreviewEl = itemEl.cloneNode(true) as HTMLElement;
            touchPreviewEl.style.cssText = `
                position: fixed;
                left: ${x - 60}px;
                top: ${y - 60}px;
                width: 120px;
                height: 120px;
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 8px;
                transform: scale(1.1);
            `;
            document.body.appendChild(touchPreviewEl);
        }

        // タッチイベントリスナーを追加
        document.addEventListener("touchmove", handleGlobalTouchMove, {
            passive: false,
        });
        document.addEventListener("touchend", handleGlobalTouchEnd, {
            passive: false,
        });
    }

    function handleGlobalTouchMove(event: TouchEvent) {
        if (touchDragIndex === -1 || event.touches.length !== 1) return;
        event.preventDefault();

        const touch = event.touches[0];

        // プレビュー位置更新
        if (touchPreviewEl) {
            touchPreviewEl.style.left = `${touch.clientX - 60}px`;
            touchPreviewEl.style.top = `${touch.clientY - 60}px`;
        }

        // ドロップ先の検出
        if (touchPreviewEl) touchPreviewEl.style.display = "none";
        const el = document.elementFromPoint(touch.clientX, touch.clientY);
        if (touchPreviewEl) touchPreviewEl.style.display = "";

        const wrapper = el?.closest(".gallery-item-wrapper");
        if (wrapper && galleryEl) {
            const wrappers = galleryEl.querySelectorAll(
                ".gallery-item-wrapper",
            );
            const idx = Array.from(wrappers).indexOf(wrapper as Element);
            if (idx !== -1) touchDragOverIndex = idx;
        }
    }

    function handleGlobalTouchEnd() {
        document.removeEventListener("touchmove", handleGlobalTouchMove);
        document.removeEventListener("touchend", handleGlobalTouchEnd);

        if (
            touchDragIndex !== -1 &&
            touchDragOverIndex !== -1 &&
            touchDragIndex !== touchDragOverIndex
        ) {
            mediaGalleryStore.reorderItems(touchDragIndex, touchDragOverIndex);
        }

        removeTouchPreview();
        touchDragIndex = -1;
        touchDragOverIndex = -1;
    }

    function removeTouchPreview() {
        if (touchPreviewEl) {
            touchPreviewEl.remove();
            touchPreviewEl = null;
        }
    }
</script>

{#if items.length > 0}
    <div
        class="media-gallery"
        bind:this={galleryEl}
        role="list"
        aria-label={$_("mediaGallery.aria_label") || "メディアギャラリー"}
    >
        {#each items as item, index (item.id)}
            <div class="gallery-item-wrapper">
                <MediaGalleryItem
                    {item}
                    {index}
                    isDragOver={(dragOverIndex === index &&
                        dragFromIndex !== index) ||
                        (touchDragOverIndex === index &&
                            touchDragIndex !== index)}
                    onDelete={handleDelete}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                    onTouchDragStart={handleTouchDragStart}
                />
            </div>
        {/each}
    </div>
{/if}

<style>
    .media-gallery {
        display: flex;
        align-items: center;
        flex-direction: row;
        padding: 4px;
        width: 100%;
        min-height: 240px;
        overflow-x: auto;
        overflow-y: visible;
        scrollbar-width: thin;
        gap: 4px;
    }

    .gallery-item-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        width: fit-content;
        height: fit-content;
    }

    @media (hover: none) and (pointer: coarse) {
        .media-gallery {
            scrollbar-width: none;
        }
        .media-gallery::-webkit-scrollbar {
            display: none;
        }
    }
</style>
