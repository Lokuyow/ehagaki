<script lang="ts">
    interface Props {
        items: string[];
        onSelect: (item: string) => void;
    }

    let { items, onSelect }: Props = $props();
    let selectedIndex = $state(0);

    export function moveDown(): void {
        if (items.length > 0) {
            selectedIndex = (selectedIndex + 1) % items.length;
        }
    }

    export function moveUp(): void {
        if (items.length > 0) {
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        }
    }

    export function confirmSelection(): boolean {
        const item = items[selectedIndex];
        if (item !== undefined) {
            onSelect(item);
            return true;
        }
        return false;
    }

    export function resetIndex(): void {
        selectedIndex = 0;
    }
</script>

{#if items.length > 0}
    <ul class="hashtag-suggestion-list" role="listbox">
        {#each items as item, i (item)}
            <li
                class="hashtag-suggestion-item"
                class:selected={i === selectedIndex}
                role="option"
                aria-selected={i === selectedIndex}
                onmouseenter={() => {
                    selectedIndex = i;
                }}
                onmousedown={(e) => {
                    e.preventDefault();
                    onSelect(item);
                }}
            >
                <span class="hashtag-prefix">#</span>{item}
            </li>
        {/each}
    </ul>
{/if}

<style>
    .hashtag-suggestion-list {
        list-style: none;
        margin: 0;
        padding: 4px 0;
        background: var(--dialog);
        box-shadow: 0 4px 16px var(--shadow);
        overflow: hidden;
        min-width: 120px;
        max-width: 300px;
        max-height: 200px;
        overflow-y: auto;
    }

    .hashtag-suggestion-item {
        display: flex;
        align-items: center;
        padding: 10px 12px;
        cursor: pointer;
        font-size: 1.125rem;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        transition:
            background 0.1s,
            color 0.1s;
    }

    .hashtag-suggestion-item:hover,
    .hashtag-suggestion-item.selected {
        background: var(--hashtag-bg);
        color: var(--hashtag-text);
    }

    .hashtag-prefix {
        opacity: 0.65;
        margin-right: 1px;
        flex-shrink: 0;
    }
</style>
