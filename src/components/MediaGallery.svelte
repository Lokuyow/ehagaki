<script lang="ts" generics="Item extends { id: string }">
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";
    import { _ } from "svelte-i18n";

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
</script>

{#if items.length > 0}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users can scroll the preview.) -->
    <div
        class={["media-gallery", className, { "media-gallery-preview": preview }]}
        bind:this={element}
        {ondragover}
        {ondrop}
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
{/if}

<style>
    .media-gallery {
        display: flex;
        align-items: stretch;
        flex-shrink: 0;
        width: 100%;
        min-width: 0;
        min-height: 180px;
        height: var(--post-gallery-height, auto);
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: thin;
        gap: 4px;
        background-color: var(--window);
    }

    .media-gallery-preview {
        height: var(--media-gallery-preview-height);
        background-color: transparent;
        overscroll-behavior-x: contain;
        --media-gallery-preview-height: 180px;
        --media-gallery-preview-width: 160px;
    }

    .media-gallery-preview:focus-visible {
        outline: 2px solid var(--theme);
        outline-offset: -2px;
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
