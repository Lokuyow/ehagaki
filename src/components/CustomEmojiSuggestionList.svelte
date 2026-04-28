<script lang="ts">
    import { Command, ScrollArea } from "bits-ui";
    import type { CustomEmojiItem } from "../lib/customEmoji";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";

    interface Props {
        items: CustomEmojiItem[];
        onSelect: (item: CustomEmojiItem) => void;
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
        if (item) {
            onSelect(item);
            return true;
        }
        return false;
    }

    export function resetIndex(): void {
        selectedIndex = 0;
    }

    function selectItem(item: CustomEmojiItem): void {
        onSelect(item);
    }
</script>

{#if items.length > 0}
    <Command.Root
        class="custom-emoji-suggestion-command"
        shouldFilter={false}
        loop={true}
    >
        <Command.List class="custom-emoji-suggestion-list">
            <ScrollArea.Root type="auto" class="custom-emoji-suggestion-scroll">
                <ScrollArea.Viewport class="custom-emoji-suggestion-viewport">
                    {#each items as item, i (item.shortcode)}
                        <Command.Item
                            value={item.shortcode}
                            keywords={[item.shortcode]}
                            class={`custom-emoji-suggestion-item${i === selectedIndex ? " selected" : ""}`}
                            onSelect={() => selectItem(item)}
                            onmouseenter={() => {
                                selectedIndex = i;
                            }}
                            onmousedown={preventKeyboardFocusChange}
                            ontouchstart={preventKeyboardFocusChange}
                        >
                            <img
                                src={item.src}
                                alt={`:${item.shortcode}:`}
                                class="custom-emoji-suggestion-image"
                                draggable="false"
                                loading="lazy"
                                decoding="async"
                            />
                            <span class="custom-emoji-suggestion-shortcode"
                                >:{item.shortcode}:</span
                            >
                        </Command.Item>
                    {/each}
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical" class="scrollbar">
                    <ScrollArea.Thumb class="scrollbar-thumb" />
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>
        </Command.List>
    </Command.Root>
{/if}

<style>
    :global(.custom-emoji-suggestion-command) {
        width: min(320px, calc(100vw - 16px));
        background: var(--dialog);
        color: var(--text);
        box-shadow: 0 4px 16px var(--shadow);
        overflow: hidden;
    }

    :global(.custom-emoji-suggestion-list) {
        max-height: 220px;
    }

    :global(.custom-emoji-suggestion-scroll) {
        width: 100%;
        max-height: 220px;
        overflow: hidden;
    }

    :global(.custom-emoji-suggestion-viewport) {
        max-height: 220px;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
    }

    :global(.custom-emoji-suggestion-item) {
        display: grid;
        grid-template-columns: 34px minmax(0, 1fr);
        align-items: center;
        gap: 8px;
        width: 100%;
        min-height: 44px;
        padding: 6px 10px;
        cursor: pointer;
        color: var(--text);
        outline: none;
        user-select: none;
    }

    :global(.custom-emoji-suggestion-item:hover),
    :global(.custom-emoji-suggestion-item.selected),
    :global(.custom-emoji-suggestion-item[data-highlighted]) {
        background: var(--btn-hover-bg, rgba(127, 127, 127, 0.12));
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

    :global(.scrollbar) {
        display: flex;
        width: 8px;
        padding: 1px;
        background: transparent;
    }

    :global(.scrollbar-thumb) {
        flex: 1;
        border-radius: 999px;
        background: var(--border);
    }
</style>
