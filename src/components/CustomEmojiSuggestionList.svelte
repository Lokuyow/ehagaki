<script lang="ts">
    import SuggestionCommandList from "./SuggestionCommandList.svelte";
    import type { CustomEmojiItem } from "../lib/customEmoji";

    interface Props {
        items: CustomEmojiItem[];
        onSelect: (item: CustomEmojiItem) => void;
    }

    let { items, onSelect }: Props = $props();
    let listComponent = $state<{
        moveUp?: () => void;
        moveDown?: () => void;
        confirmSelection?: () => boolean;
        resetIndex?: () => void;
    } | null>(null);

    export function moveDown(): void {
        listComponent?.moveDown?.();
    }

    export function moveUp(): void {
        listComponent?.moveUp?.();
    }

    export function confirmSelection(): boolean {
        return listComponent?.confirmSelection?.() ?? false;
    }

    export function resetIndex(): void {
        listComponent?.resetIndex?.();
    }
</script>

<SuggestionCommandList
    bind:this={listComponent}
    {items}
    getKey={(item) => item.shortcode}
    getValue={(item) => item.shortcode}
    {onSelect}
    rootClass="custom-emoji-suggestion-command"
    itemClass="custom-emoji-suggestion-item"
>
    {#snippet children(item)}
        <img
            src={item.src}
            alt={`:${item.shortcode}:`}
            class="custom-emoji-suggestion-image"
            draggable="false"
            loading="lazy"
            decoding="async"
        />
        <span class="custom-emoji-suggestion-shortcode">:{item.shortcode}:</span>
    {/snippet}
</SuggestionCommandList>

<style>
    :global(.custom-emoji-suggestion-command) {
        --suggestion-command-item-columns: 34px minmax(0, 1fr);
    }

    .custom-emoji-suggestion-image {
        width: 32px;
        height: 32px;
        object-fit: contain;
        user-select: none;
        -webkit-user-drag: none;
    }

    .custom-emoji-suggestion-shortcode {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.95rem;
        font-weight: 600;
    }
</style>
