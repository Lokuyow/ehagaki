<script lang="ts">
    import SuggestionCommandList from "./SuggestionCommandList.svelte";

    interface Props {
        items: string[];
        onSelect: (item: string) => void;
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
    getKey={(item) => item}
    getValue={(item) => item}
    {onSelect}
    rootClass="hashtag-suggestion-command"
    itemClass="hashtag-suggestion-item"
>
    {#snippet children(item)}
        <span class="hashtag-prefix">#</span>
        <span class="hashtag-label">{item}</span>
    {/snippet}
</SuggestionCommandList>

<style>
    :global(.hashtag-suggestion-command) {
        --suggestion-command-item-columns: auto minmax(0, 1fr);
    }

    .hashtag-prefix {
        opacity: 0.65;
    }

    .hashtag-label {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.95rem;
        font-weight: 600;
    }
</style>
