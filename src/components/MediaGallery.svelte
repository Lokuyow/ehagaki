<script lang="ts">
    import { mediaGalleryStore } from "../stores/mediaGalleryStore.svelte";
    import MediaGalleryItem from "./MediaGalleryItem.svelte";
    import { _ } from "svelte-i18n";
    import {
        SCROLL_THRESHOLD,
        SCROLL_BASE_SPEED,
        SCROLL_MAX_SPEED,
    } from "../lib/constants";

    // PC ドラッグ＆ドロップ状態
    let dragFromIndex = $state(-1);
    // 挿入位置（0〜 items.length）、-1 は非アクティブ
    let pcInsertIndex = $state(-1);

    // タッチドラグ状態
    let touchDragIndex = $state(-1);
    let touchInsertIndex = $state(-1);
    let touchPreviewEl: HTMLElement | null = null;
    let touchPreviewOffsetX = 60;
    let touchPreviewOffsetY = 60;
    let galleryEl: HTMLDivElement | undefined = $state();

    // オートスクロール（タッチ・PC DnD共通）
    let autoScrollFrame: number | null = null;

    let items = $derived(mediaGalleryStore.items);

    // 現在有効な挿入位置（移動なしの場合は -1）
    let effectiveInsertIndex = $derived.by(() => {
        const from = dragFromIndex !== -1 ? dragFromIndex : touchDragIndex;
        const insert = dragFromIndex !== -1 ? pcInsertIndex : touchInsertIndex;
        if (from === -1 || insert === -1) return -1;
        // 挿入位置がドラッグ元の前後と同じなら移動なし → 表示しない
        if (insert === from || insert === from + 1) return -1;
        return insert;
    });

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
        // アイテムの左半分ならそのインデックス、右半分なら次の位置
        const wrappers = galleryEl?.querySelectorAll(".gallery-item-wrapper");
        const wrapperEl = wrappers?.[index] as HTMLElement | undefined;
        if (wrapperEl) {
            const rect = wrapperEl.getBoundingClientRect();
            pcInsertIndex =
                event.clientX < rect.left + rect.width / 2 ? index : index + 1;
        } else {
            pcInsertIndex = index;
        }
        // オートスクロールはギャラリーレベルの handleGalleryDragOver で処理
    }

    function handleDragEnd() {
        stopGalleryAutoScroll();
        dragFromIndex = -1;
        pcInsertIndex = -1;
    }

    function handleDrop(_itemIndex: number) {
        // 並べ替えはギャラリーレベルの ondrop (handleGalleryDrop) で処理
    }

    // --- ギャラリーコンテナレベルの DnD ハンドラ ---
    // アイテム外の空白エリアでもドロップ可能にし、端の挿入位置を検出する
    function handleGalleryDragOver(event: DragEvent) {
        if (dragFromIndex === -1) return;
        event.preventDefault();

        // アイテム外の空白エリアにカーソルがある場合、端の挿入位置を検出
        const wrappers = galleryEl?.querySelectorAll(".gallery-item-wrapper");
        if (wrappers && wrappers.length > 0) {
            const firstRect = (
                wrappers[0] as HTMLElement
            ).getBoundingClientRect();
            const lastRect = (
                wrappers[wrappers.length - 1] as HTMLElement
            ).getBoundingClientRect();
            if (event.clientX < firstRect.left) {
                pcInsertIndex = 0;
            } else if (event.clientX > lastRect.right) {
                pcInsertIndex = items.length;
            }
        }

        // エッジオートスクロール
        if (galleryEl) {
            const galleryRect = galleryEl.getBoundingClientRect();
            if (event.clientX - galleryRect.left < SCROLL_THRESHOLD) {
                startGalleryAutoScroll("left", event.clientX);
            } else if (galleryRect.right - event.clientX < SCROLL_THRESHOLD) {
                startGalleryAutoScroll("right", event.clientX);
            } else {
                stopGalleryAutoScroll();
            }
        }
    }

    function handleGalleryDrop(event: DragEvent) {
        event.preventDefault();
        stopGalleryAutoScroll();
        const insertIdx = pcInsertIndex;
        if (
            dragFromIndex !== -1 &&
            insertIdx !== -1 &&
            insertIdx !== dragFromIndex &&
            insertIdx !== dragFromIndex + 1
        ) {
            // splice が fromIndex を削除した後のインデックス計算
            const realToIndex =
                dragFromIndex < insertIdx ? insertIdx - 1 : insertIdx;
            mediaGalleryStore.reorderItems(dragFromIndex, realToIndex);
        }
        dragFromIndex = -1;
        pcInsertIndex = -1;
    }

    function handleDelete(id: string) {
        mediaGalleryStore.removeItem(id);
    }

    // --- オートスクロール ---
    function startGalleryAutoScroll(
        direction: "left" | "right",
        clientX: number,
    ) {
        if (!galleryEl) return;
        // 既存のスクロールループを停止してから新規開始
        if (autoScrollFrame !== null) {
            cancelAnimationFrame(autoScrollFrame);
            autoScrollFrame = null;
        }

        const rect = galleryEl.getBoundingClientRect();
        const distance =
            direction === "left" ? clientX - rect.left : rect.right - clientX;
        const normalizedDistance = Math.max(
            0,
            Math.min(1, distance / SCROLL_THRESHOLD),
        );
        const scrollSpeed =
            SCROLL_BASE_SPEED +
            (SCROLL_MAX_SPEED - SCROLL_BASE_SPEED) * (1 - normalizedDistance);

        const animate = () => {
            if (!galleryEl) return;
            const maxScroll = galleryEl.scrollWidth - galleryEl.clientWidth;
            if (direction === "left" && galleryEl.scrollLeft > 0) {
                galleryEl.scrollLeft = Math.max(
                    0,
                    galleryEl.scrollLeft - scrollSpeed,
                );
                autoScrollFrame = requestAnimationFrame(animate);
            } else if (
                direction === "right" &&
                galleryEl.scrollLeft < maxScroll
            ) {
                galleryEl.scrollLeft = Math.min(
                    maxScroll,
                    galleryEl.scrollLeft + scrollSpeed,
                );
                autoScrollFrame = requestAnimationFrame(animate);
            } else {
                autoScrollFrame = null;
            }
        };

        autoScrollFrame = requestAnimationFrame(animate);
    }

    function stopGalleryAutoScroll() {
        if (autoScrollFrame !== null) {
            cancelAnimationFrame(autoScrollFrame);
            autoScrollFrame = null;
        }
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
            const itemRect = itemEl.getBoundingClientRect();
            const targetSize = 120;
            const scale = Math.min(
                targetSize / itemRect.width,
                targetSize / itemRect.height,
            );
            touchPreviewOffsetX = (itemRect.width * scale) / 2;
            touchPreviewOffsetY = (itemRect.height * scale) / 2;

            touchPreviewEl = itemEl.cloneNode(true) as HTMLElement;
            touchPreviewEl.style.cssText = `
                position: fixed;
                left: ${x - touchPreviewOffsetX}px;
                top: ${y - touchPreviewOffsetY}px;
                width: ${itemRect.width}px;
                height: ${itemRect.height}px;
                transform-origin: top left;
                transform: scale(${scale});
                opacity: 0.75;
                pointer-events: none;
                z-index: 9999;
                border-radius: 6px;
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
            touchPreviewEl.style.left = `${touch.clientX - touchPreviewOffsetX}px`;
            touchPreviewEl.style.top = `${touch.clientY - touchPreviewOffsetY}px`;
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
            if (idx !== -1) {
                // アイテムの左半分ならそのインデックス、右半分なら次の位置
                const rect = (wrapper as HTMLElement).getBoundingClientRect();
                touchInsertIndex =
                    touch.clientX < rect.left + rect.width / 2 ? idx : idx + 1;
            }
        } else if (galleryEl) {
            // 指がアイテム外の空白エリアにある場合、端の挿入位置を検出
            const wrappers = galleryEl.querySelectorAll(
                ".gallery-item-wrapper",
            );
            if (wrappers.length > 0) {
                const firstRect = (
                    wrappers[0] as HTMLElement
                ).getBoundingClientRect();
                const lastRect = (
                    wrappers[wrappers.length - 1] as HTMLElement
                ).getBoundingClientRect();
                if (touch.clientX <= firstRect.left) {
                    touchInsertIndex = 0;
                } else if (touch.clientX >= lastRect.right) {
                    touchInsertIndex = items.length;
                }
            }
        }

        // 画面端でギャラリーをオートスクロール
        if (galleryEl) {
            const galleryRect = galleryEl.getBoundingClientRect();
            if (touch.clientX - galleryRect.left < SCROLL_THRESHOLD) {
                startGalleryAutoScroll("left", touch.clientX);
            } else if (galleryRect.right - touch.clientX < SCROLL_THRESHOLD) {
                startGalleryAutoScroll("right", touch.clientX);
            } else {
                stopGalleryAutoScroll();
            }
        }
    }

    function handleGlobalTouchEnd() {
        document.removeEventListener("touchmove", handleGlobalTouchMove);
        document.removeEventListener("touchend", handleGlobalTouchEnd);
        stopGalleryAutoScroll();

        const insertIdx = touchInsertIndex;
        if (
            touchDragIndex !== -1 &&
            insertIdx !== -1 &&
            insertIdx !== touchDragIndex &&
            insertIdx !== touchDragIndex + 1
        ) {
            const realToIndex =
                touchDragIndex < insertIdx ? insertIdx - 1 : insertIdx;
            mediaGalleryStore.reorderItems(touchDragIndex, realToIndex);
        }

        removeTouchPreview();
        touchDragIndex = -1;
        touchInsertIndex = -1;
    }

    function removeTouchPreview() {
        if (touchPreviewEl) {
            touchPreviewEl.remove();
            touchPreviewEl = null;
        }
    }

    // --- ホイールスクロール処理 ---
    function handleWheel(event: WheelEvent) {
        if (!galleryEl) return;
        // deltaYを横スクロール量に変換
        galleryEl.scrollLeft += event.deltaY;
        event.preventDefault();
    }

    // ホイールイベントをpassive: falseで登録
    $effect(() => {
        if (!galleryEl) return;
        galleryEl.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            galleryEl?.removeEventListener("wheel", handleWheel);
        };
    });
</script>

{#if items.length > 0}
    <div
        class="media-gallery"
        bind:this={galleryEl}
        ondragover={handleGalleryDragOver}
        ondrop={handleGalleryDrop}
        role="list"
        aria-label={$_("mediaGallery.aria_label") || "メディアギャラリー"}
    >
        {#each items as item, index (item.id)}
            <div
                class="gallery-item-wrapper"
                class:insert-bar-left={effectiveInsertIndex === index}
                class:insert-bar-right={effectiveInsertIndex === items.length &&
                    index === items.length - 1}
            >
                <MediaGalleryItem
                    {item}
                    {index}
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

    /* 挿入位置インジケーターバー */
    .gallery-item-wrapper.insert-bar-left::before,
    .gallery-item-wrapper.insert-bar-right::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        width: 8px;
        background: var(--theme, #2196f3);
        border-radius: 4px;
        z-index: 10;
        pointer-events: none;
    }

    .gallery-item-wrapper.insert-bar-left::before {
        left: -5px;
    }

    .gallery-item-wrapper.insert-bar-right::after {
        right: -5px;
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
