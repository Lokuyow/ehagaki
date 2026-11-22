<script lang="ts" generics="Item extends { id: string }">
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";
    import { _ } from "svelte-i18n";
    import { canScrollMediaGalleryHorizontally } from "../lib/utils/mediaGalleryWheelUtils";

    interface Props {
        items: readonly Item[];
        renderItem: Snippet<[Item, number]>;
        element?: HTMLDivElement;
        class?: string;
        preview?: boolean;
        ondragover?: HTMLAttributes<HTMLDivElement>["ondragover"];
        ondrop?: HTMLAttributes<HTMLDivElement>["ondrop"];
    }

    let {
        items,
        renderItem,
        element = $bindable(),
        class: className,
        preview = false,
        ondragover,
        ondrop,
    }: Props = $props();

    let canPageLeft = $state(false);
    let canPageRight = $state(false);
    const arrowIcon = `${import.meta.env.BASE_URL}icons/arrow_back_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg`;

    function updatePageButtons() {
        canPageLeft = !!element && canScrollMediaGalleryHorizontally(element, -1);
        canPageRight = !!element && canScrollMediaGalleryHorizontally(element, 1);
    }

    function pageGallery(direction: -1 | 1) {
        if (!element || !canScrollMediaGalleryHorizontally(element, direction)) return;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        element.scrollBy({
            left: direction * element.clientWidth,
            behavior: reduceMotion ? "auto" : "smooth",
        });
    }

    $effect(() => {
        if (!element) return;
        const gallery = element;
        const itemCount = items.length;
        updatePageButtons();
        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(updatePageButtons);
        observer.observe(gallery);
        for (let index = 0; index < itemCount; index++) {
            // A card can change width while the scroll container stays the same size.
            const cell = gallery.children[index];
            if (cell) observer.observe(cell);
        }
        return () => observer.disconnect();
    });
</script>

{#if items.length > 0}
    <div class="gallery-shell">
        <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users can scroll the preview.) -->
        <div
            class={["media-gallery", className, { "media-gallery-preview": preview }]}
            bind:this={element}
            {ondragover}
            {ondrop}
            onscroll={updatePageButtons}
            role="list"
            tabindex={preview ? 0 : undefined}
            aria-label={$_("mediaGallery.aria_label")}
            data-media-gallery
        >
            {#each items as item, index (item.id)}
                <div class="media-gallery-cell" role="listitem">
                    {@render renderItem(item, index)}
                </div>
            {/each}
        </div>
        <button
            type="button"
            class="gallery-page-button gallery-page-left"
            aria-label={$_("mediaGallery.previous_page")}
            aria-disabled={!canPageLeft}
            tabindex={canPageLeft ? 0 : -1}
            onclick={() => pageGallery(-1)}
        >
            <span class="gallery-page-icon" style:mask-image={`url("${arrowIcon}")`} aria-hidden="true"></span>
        </button>
        <button
            type="button"
            class="gallery-page-button gallery-page-right"
            aria-label={$_("mediaGallery.next_page")}
            aria-disabled={!canPageRight}
            tabindex={canPageRight ? 0 : -1}
            onclick={() => pageGallery(1)}
        >
            <span class="gallery-page-icon" style:mask-image={`url("${arrowIcon}")`} aria-hidden="true"></span>
        </button>
    </div>
{/if}

<style>
    .media-gallery {
        display: flex;
        align-items: stretch;
        flex-shrink: 0;
        width: 100%;
        min-width: 0;
        min-height: 180px;
        height: var(--media-gallery-height, auto);
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: thin;
        gap: 4px;
        background-color: var(--window);
    }

    :global(.responsive-gallery) .media-gallery,
    .media-gallery-preview {
        /* Scale between the 360px and 560px viewport widths. */
        --media-gallery-height: clamp(180px, calc(70vw - 72px), 320px);
        --media-gallery-max-width: clamp(160px, calc(60vw - 56px), 280px);
        --media-gallery-item-height: 100%;
    }

    .media-gallery-preview {
        background-color: transparent;
        overscroll-behavior-x: contain;
    }

    .media-gallery-preview:focus-visible {
        outline: 2px solid var(--theme);
        outline-offset: -2px;
    }

    .gallery-shell {
        position: relative;
        flex-shrink: 0;
        width: 100%;
        min-width: 0;
    }

    .gallery-page-button {
        display: none;
    }

    @media (hover: hover) and (pointer: fine) {
        .gallery-page-button {
            position: absolute;
            top: 50%;
            translate: 0 -50%;
            z-index: 3;
            display: grid;
            place-items: center;
            width: 44px;
            height: 44px;
            padding: 0;
            border: 0;
            border-radius: 50%;
            background: rgb(28 32 36 / 88%);
            color: white;
            cursor: pointer;
            opacity: 0;
            pointer-events: none;
        }

        .gallery-shell:hover .gallery-page-button[aria-disabled="false"],
        .gallery-page-button:focus-visible {
            opacity: 1;
            pointer-events: auto;
        }

        .gallery-page-button:hover {
            background-color: rgb(28 32 36 / 98%);
            color: white;
        }

        .gallery-page-button:focus-visible {
            outline: 2px solid var(--theme);
            outline-offset: 2px;
        }

        .gallery-page-button[aria-disabled="true"] {
            cursor: default;
        }

        .gallery-page-left {
            left: 8px;
        }

        .gallery-page-right {
            right: 8px;
        }

        .gallery-page-icon {
            width: 20px;
            height: 20px;
            background: currentColor;
            mask-position: center;
            mask-repeat: no-repeat;
            mask-size: contain;
        }

        .gallery-page-right .gallery-page-icon {
            rotate: 180deg;
        }
    }

    .media-gallery-cell {
        display: flex;
        flex: none;
        max-width: 100%;
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
