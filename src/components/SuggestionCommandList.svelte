<script lang="ts" generics="T">
    import type { Snippet } from "svelte";
    import { tick } from "svelte";
    import { Command, ScrollArea } from "bits-ui";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";

    interface Props {
        items: T[];
        getKey: (item: T) => string;
        getValue: (item: T) => string;
        onSelect: (item: T) => void;
        onDismiss?: () => void;
        dismissWhen?: boolean;
        rootClass?: string;
        itemClass?: string;
        children: Snippet<[item: T, index: number, selected: boolean]>;
    }

    let {
        items,
        getKey,
        getValue,
        onSelect,
        onDismiss,
        dismissWhen = false,
        rootClass = "",
        itemClass = "",
        children,
    }: Props = $props();

    let selectedIndex = $state(0);
    let viewportElement = $state<HTMLElement | null>(null);

    $effect(() => {
        if (dismissWhen) {
            onDismiss?.();
        }
    });

    export function moveDown(): void {
        if (items.length > 0) {
            selectedIndex = (selectedIndex + 1) % items.length;
            scheduleSelectedItemScroll();
        }
    }

    export function moveUp(): void {
        if (items.length > 0) {
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            scheduleSelectedItemScroll();
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
        scheduleSelectedItemScroll();
    }

    function selectItem(item: T): void {
        onSelect(item);
    }

    function scheduleSelectedItemScroll(): void {
        void tick().then(scrollSelectedItemIntoView);
    }

    function scrollSelectedItemIntoView(): void {
        if (!viewportElement) return;
        const selectedItem = viewportElement.querySelector<HTMLElement>(
            ".suggestion-command-item.selected",
        );
        if (!selectedItem) return;

        const itemTop = selectedItem.offsetTop;
        const itemBottom = itemTop + selectedItem.offsetHeight;
        const viewportTop = viewportElement.scrollTop;
        const viewportBottom = viewportTop + viewportElement.clientHeight;

        if (itemTop < viewportTop) {
            viewportElement.scrollTop = itemTop;
        } else if (itemBottom > viewportBottom) {
            viewportElement.scrollTop = itemBottom - viewportElement.clientHeight;
        }
    }
</script>

{#if items.length > 0}
    <Command.Root
        class={`suggestion-command ${rootClass}`.trim()}
        shouldFilter={false}
        loop={true}
    >
        <Command.List class="suggestion-command-list">
            <ScrollArea.Root type="auto" class="suggestion-command-scroll">
                <ScrollArea.Viewport
                    class="suggestion-command-viewport"
                    bind:ref={viewportElement}
                >
                    {#each items as item, i (getKey(item))}
                        <Command.Item
                            value={getValue(item)}
                            keywords={[getValue(item)]}
                            class={`suggestion-command-item ${itemClass}${i === selectedIndex ? " selected" : ""}`.trim()}
                            onSelect={() => selectItem(item)}
                            onmouseenter={() => {
                                selectedIndex = i;
                            }}
                            onmousedown={preventKeyboardFocusChange}
                            ontouchstart={preventKeyboardFocusChange}
                        >
                            {@render children(item, i, i === selectedIndex)}
                        </Command.Item>
                    {/each}
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                    orientation="vertical"
                    class="suggestion-command-scrollbar"
                >
                    <ScrollArea.Thumb class="suggestion-command-scrollbar-thumb" />
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>
        </Command.List>
    </Command.Root>
{/if}

<style>
    :global(.suggestion-command) {
        width: min(320px, calc(100vw - 16px));
        background: var(--dialog);
        color: var(--text);
        box-shadow: 0 4px 16px var(--shadow);
        overflow: hidden;
    }

    :global(.suggestion-command-list) {
        --suggestion-command-row-height: 40px;
        --suggestion-command-visible-rows: 10;
        max-height: calc(
            var(--suggestion-command-row-height) *
                var(--suggestion-command-visible-rows)
        );
    }

    :global(.suggestion-command-scroll) {
        width: 100%;
        max-height: calc(
            var(--suggestion-command-row-height) *
                var(--suggestion-command-visible-rows)
        );
        overflow: hidden;
    }

    :global(.suggestion-command-viewport) {
        max-height: calc(
            var(--suggestion-command-row-height) *
                var(--suggestion-command-visible-rows)
        );
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
    }

    :global(.suggestion-command-item) {
        display: grid;
        grid-template-columns: var(
            --suggestion-command-item-columns,
            minmax(0, 1fr)
        );
        align-items: center;
        gap: 8px;
        width: 100%;
        min-height: var(--suggestion-command-row-height);
        padding: 4px 10px;
        cursor: pointer;
        color: var(--text);
        outline: none;
        user-select: none;
    }

    :global(.suggestion-command-item:hover),
    :global(.suggestion-command-item.selected),
    :global(.suggestion-command-item[data-highlighted]) {
        background: var(--btn-hover-bg, rgba(127, 127, 127, 0.12));
    }

    :global(.suggestion-command-scrollbar) {
        display: flex;
        width: 8px;
        padding: 1px;
        background: transparent;
    }

    :global(.suggestion-command-scrollbar-thumb) {
        flex: 1;
        border-radius: 999px;
        background: var(--border);
    }
</style>
