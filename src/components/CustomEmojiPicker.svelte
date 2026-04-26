<script lang="ts">
    import { onMount } from "svelte";
    import { Command, ScrollArea } from "bits-ui";
    import type { RxNostr } from "rx-nostr";
    import { _ } from "svelte-i18n";
    import {
        CUSTOM_EMOJI_PICKER_DEFAULT_HEIGHT,
        readCustomEmojiPickerHeight,
        writeCustomEmojiPickerHeight,
        type CustomEmojiItem,
    } from "../lib/customEmoji";
    import { customEmojiStore } from "../stores/customEmojiStore.svelte";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";

    interface Props {
        rxNostr?: RxNostr | null;
        pubkey?: string | null;
        open?: boolean;
        onSelect?: (emoji: CustomEmojiItem) => void;
    }

    let { rxNostr, pubkey, open = false, onSelect }: Props = $props();
    let search = $state("");
    let pickerHeight = $state(CUSTOM_EMOJI_PICKER_DEFAULT_HEIGHT);
    let resizing = $state(false);
    let renderItems = $state(false);
    let renderItemsFrameId: number | null = null;

    let items = $derived(customEmojiStore.items);
    let loading = $derived(customEmojiStore.loading);
    let filteredItems = $derived.by(() => {
        const query = search.trim().toLowerCase();
        if (!query) return items;
        return items.filter((item) =>
            item.shortcode.toLowerCase().includes(query),
        );
    });

    onMount(() => {
        pickerHeight = readCustomEmojiPickerHeight(localStorage);
    });

    $effect(() => {
        if (renderItemsFrameId !== null) {
            cancelAnimationFrame(renderItemsFrameId);
            renderItemsFrameId = null;
        }

        renderItems = false;
        if (!open) {
            return;
        }

        void customEmojiStore.load({ rxNostr, pubkey });
        renderItemsFrameId = requestAnimationFrame(() => {
            renderItemsFrameId = null;
            renderItems = true;
        });

        return () => {
            if (renderItemsFrameId !== null) {
                cancelAnimationFrame(renderItemsFrameId);
                renderItemsFrameId = null;
            }
        };
    });

    $effect(() => {
        search;
        open;
        items.length;
    });

    function selectEmoji(emoji: CustomEmojiItem): void {
        onSelect?.(emoji);
    }

    function startResize(event: PointerEvent): void {
        event.preventDefault();
        const startY = event.clientY;
        const startHeight = pickerHeight;
        resizing = true;

        const move = (moveEvent: PointerEvent) => {
            const nextHeight = startHeight + (startY - moveEvent.clientY);
            pickerHeight = writeCustomEmojiPickerHeight(
                localStorage,
                nextHeight,
            );
        };

        const stop = () => {
            resizing = false;
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", stop);
            window.removeEventListener("pointercancel", stop);
        };

        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", stop);
        window.addEventListener("pointercancel", stop);
    }
</script>

<div class="custom-emoji-picker" data-resizing={resizing}>
    <div
        class="resize-handle"
        role="separator"
        aria-orientation="horizontal"
        aria-label={$_("customEmoji.resize")}
        onpointerdown={startResize}
    ></div>
    <Command.Root
        class="custom-emoji-command"
        label={$_("customEmoji.search_label")}
        shouldFilter={false}
        loop={true}
    >
        <Command.Input
            class="custom-emoji-search"
            bind:value={search}
            placeholder={$_("customEmoji.search_placeholder")}
        />
        <ScrollArea.Root
            type="auto"
            class="custom-emoji-scroll-root"
            style={`height: ${pickerHeight}px;`}
        >
            <ScrollArea.Viewport class="custom-emoji-scroll-viewport">
                <Command.List class="custom-emoji-list">
                    {#if loading || !renderItems}
                        <Command.Loading class="custom-emoji-message">
                            {$_("customEmoji.loading")}
                        </Command.Loading>
                    {:else if filteredItems.length === 0}
                        <Command.Empty class="custom-emoji-message">
                            {$_("customEmoji.empty")}
                        </Command.Empty>
                    {:else}
                        <div class="emoji-grid">
                            {#each filteredItems as emoji (emoji.shortcode)}
                                <Command.Item
                                    value={emoji.shortcode}
                                    keywords={[emoji.shortcode]}
                                    class="emoji-item"
                                    onSelect={() => selectEmoji(emoji)}
                                    onmousedown={preventKeyboardFocusChange}
                                    ontouchstart={preventKeyboardFocusChange}
                                >
                                    <img
                                        src={emoji.src}
                                        alt={`:${emoji.shortcode}:`}
                                        title={`:${emoji.shortcode}:`}
                                        class="emoji-image"
                                        draggable="false"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </Command.Item>
                            {/each}
                        </div>
                    {/if}
                </Command.List>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical" class="scrollbar">
                <ScrollArea.Thumb class="scrollbar-thumb" />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    </Command.Root>
</div>

<style>
    .custom-emoji-picker {
        width: min(800px, calc(100vw - 24px));
        background: var(--dialog);
        color: var(--text);
        border: 1px solid var(--border);
        border-radius: 8px;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
        overflow: hidden;
    }

    .resize-handle {
        width: 100%;
        height: 12px;
        cursor: ns-resize;
        touch-action: none;
        position: relative;
        background: var(--bg-buttonbar);
    }

    .resize-handle::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 4px;
        width: 38px;
        height: 4px;
        border-radius: 999px;
        transform: translateX(-50%);
        background: var(--border);
    }

    :global(.custom-emoji-command) {
        display: flex;
        flex-direction: column;
    }

    :global(.custom-emoji-search) {
        width: 100%;
        height: 42px;
        padding: 0 12px;
        border: 0;
        border-bottom: 1px solid var(--border);
        background: var(--input-bg, var(--dialog));
        color: var(--text);
        font-size: 0.95rem;
        outline: none;
    }

    :global(.custom-emoji-scroll-root),
    :global(.custom-emoji-scroll-viewport) {
        width: 100%;
    }

    :global(.custom-emoji-scroll-root) {
        overflow: hidden;
    }

    :global(.custom-emoji-scroll-viewport) {
        height: 100%;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
    }

    :global(.custom-emoji-list) {
        min-height: 100%;
    }

    .emoji-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
        gap: 4px;
        padding: 8px;
    }

    :global(.emoji-item) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 6px;
        cursor: pointer;
        outline: none;
    }

    :global(.emoji-item:hover),
    :global(.emoji-item[data-highlighted]) {
        background: var(--btn-hover-bg, rgba(127, 127, 127, 0.12));
    }

    .emoji-image {
        width: 30px;
        height: 30px;
        object-fit: contain;
        user-select: none;
        -webkit-user-drag: none;
    }

    :global(.custom-emoji-message) {
        padding: 18px 12px;
        text-align: center;
        color: var(--text-muted, var(--text));
        font-size: 0.9rem;
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
