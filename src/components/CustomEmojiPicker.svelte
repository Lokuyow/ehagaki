<script lang="ts">
    import { onMount } from "svelte";
    import { Command, ScrollArea } from "bits-ui";
    import type { RxNostr } from "rx-nostr";
    import { _ } from "svelte-i18n";
    import {
        CUSTOM_EMOJI_PICKER_DEFAULT_HEIGHT,
        CUSTOM_EMOJI_PICKER_MIN_HEIGHT,
        readCustomEmojiPickerHeight,
        writeCustomEmojiPickerHeight,
        type CustomEmojiItem,
    } from "../lib/customEmoji";
    import { FOOTER_HEIGHT } from "../stores/uiStore.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { customEmojiStore } from "../stores/customEmojiStore.svelte";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";

    const EMOJI_GRID_COLUMN_WIDTH = 50;
    const EMOJI_GRID_ROW_HEIGHT = 40;
    const EMOJI_GRID_PADDING = 4;
    const VIRTUAL_OVERSCAN_ROWS = 3;

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
    let scrollTop = $state(0);
    let pickerWidth = $state(800);
    let keyboardLayoutLift = $state(0);
    let renderItemsFrameId: number | null = null;
    let layoutFrameId: number | null = null;
    let pickerElement: HTMLDivElement | null = null;

    let items = $derived(customEmojiStore.items);
    let loading = $derived(customEmojiStore.loading);
    let filteredItems = $derived.by(() => {
        const query = search.trim().toLowerCase();
        if (!query) return items;
        return items.filter((item) =>
            item.shortcode.toLowerCase().includes(query),
        );
    });
    let columnCount = $derived(
        Math.max(1, Math.floor(pickerWidth / EMOJI_GRID_COLUMN_WIDTH)),
    );
    let totalRowCount = $derived(Math.ceil(filteredItems.length / columnCount));
    let effectivePickerHeight = $derived(
        Math.max(
            CUSTOM_EMOJI_PICKER_MIN_HEIGHT,
            pickerHeight - keyboardLayoutLift,
        ),
    );
    let visibleRowCount = $derived(
        Math.ceil(effectivePickerHeight / EMOJI_GRID_ROW_HEIGHT) +
            VIRTUAL_OVERSCAN_ROWS * 2,
    );
    let startRow = $derived(
        Math.max(
            0,
            Math.min(
                Math.max(0, totalRowCount - visibleRowCount),
                Math.floor(scrollTop / EMOJI_GRID_ROW_HEIGHT) -
                    VIRTUAL_OVERSCAN_ROWS,
            ),
        ),
    );
    let endRow = $derived(Math.min(totalRowCount, startRow + visibleRowCount));
    let virtualStartIndex = $derived(startRow * columnCount);
    let virtualEndIndex = $derived(
        Math.min(filteredItems.length, endRow * columnCount),
    );
    let visibleItems = $derived(
        filteredItems.slice(virtualStartIndex, virtualEndIndex),
    );
    let virtualListHeight = $derived(
        totalRowCount * EMOJI_GRID_ROW_HEIGHT + EMOJI_GRID_PADDING * 2,
    );
    let virtualOffsetY = $derived(startRow * EMOJI_GRID_ROW_HEIGHT);

    function updatePickerWidth(): void {
        const viewportWidth =
            window.visualViewport?.width ?? window.innerWidth ?? 800;
        pickerWidth = Math.min(800, Math.max(1, viewportWidth));
    }

    function readRootPixelValue(name: string): number {
        if (typeof document === "undefined") return 0;
        const rawValue = getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim();
        const value = Number.parseFloat(rawValue);
        return Number.isFinite(value) ? value : 0;
    }

    function readKeyboardLayoutLift(): number {
        const buttonBarBottom = readRootPixelValue(
            "--keyboard-button-bar-bottom",
        );
        const keyboardHeight = readRootPixelValue("--keyboard-height");
        return Math.max(
            0,
            buttonBarBottom - FOOTER_HEIGHT,
            keyboardHeight - FOOTER_HEIGHT,
        );
    }

    function updatePickerLayout(): void {
        updatePickerWidth();
        keyboardLayoutLift = readKeyboardLayoutLift();
    }

    function schedulePickerLayoutUpdate(): void {
        if (layoutFrameId !== null) {
            cancelAnimationFrame(layoutFrameId);
        }
        layoutFrameId = requestAnimationFrame(() => {
            layoutFrameId = null;
            updatePickerLayout();
        });
    }

    onMount(() => {
        pickerHeight = readCustomEmojiPickerHeight(localStorage);
        updatePickerLayout();

        window.addEventListener("resize", schedulePickerLayoutUpdate);
        window.visualViewport?.addEventListener(
            "resize",
            schedulePickerLayoutUpdate,
        );
        window.visualViewport?.addEventListener(
            "scroll",
            schedulePickerLayoutUpdate,
        );

        return () => {
            if (layoutFrameId !== null) {
                cancelAnimationFrame(layoutFrameId);
                layoutFrameId = null;
            }
            window.removeEventListener("resize", schedulePickerLayoutUpdate);
            window.visualViewport?.removeEventListener(
                "resize",
                schedulePickerLayoutUpdate,
            );
            window.visualViewport?.removeEventListener(
                "scroll",
                schedulePickerLayoutUpdate,
            );
        };
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
        schedulePickerLayoutUpdate();
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
        scrollTop = 0;
        pickerElement
            ?.querySelector<HTMLElement>(".custom-emoji-scroll-viewport")
            ?.scrollTo({ top: 0 });
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

    function handleScroll(event: Event): void {
        scrollTop = (event.currentTarget as HTMLElement).scrollTop;
    }
</script>

<div
    class="custom-emoji-picker"
    data-resizing={resizing}
    bind:this={pickerElement}
>
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
            style={`height: ${effectivePickerHeight}px;`}
        >
            <ScrollArea.Viewport
                class="custom-emoji-scroll-viewport"
                onscroll={handleScroll}
            >
                <Command.List class="custom-emoji-list">
                    {#if loading || !renderItems}
                        <Command.Loading class="custom-emoji-message">
                            <LoadingPlaceholder
                                showLoader={true}
                                text={$_("customEmoji.loading")}
                                customClass="custom-emoji-loading"
                            />
                        </Command.Loading>
                    {:else if filteredItems.length === 0}
                        <Command.Empty class="custom-emoji-message">
                            {$_("customEmoji.empty")}
                        </Command.Empty>
                    {:else}
                        <div
                            class="emoji-virtual-list"
                            style={`height: ${virtualListHeight}px;`}
                        >
                            <div
                                class="emoji-grid"
                                style={`transform: translateY(${virtualOffsetY}px); grid-template-columns: repeat(${columnCount}, minmax(0, 1fr));`}
                            >
                                {#each visibleItems as emoji (emoji.shortcode)}
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
        width: min(100vw, 800px);
        background: var(--dialog);
        color: var(--text);
        border-radius: 8px 8px 0 0;
        overflow: hidden;
    }

    .resize-handle {
        width: 100%;
        height: 14px;
        cursor: ns-resize;
        touch-action: none;
        position: relative;
        background: var(--bg-buttonbar);
    }

    .resize-handle::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 5px;
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
        height: 34px;
        padding: 0 12px;
        border: 0;
        border-bottom: 1px solid var(--border);
        background: var(--input-bg, var(--dialog));
        color: var(--text);
        font-size: 1rem;
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

    .emoji-virtual-list {
        position: relative;
        width: 100%;
    }

    .emoji-grid {
        position: absolute;
        top: 4px;
        left: 4px;
        right: 4px;
        display: grid;
        grid-auto-rows: 38px;
        justify-items: center;
    }

    :global(.emoji-item) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 38px;
        cursor: pointer;
        outline: none;
    }

    :global(.emoji-item:hover),
    :global(.emoji-item[data-highlighted]) {
        background: var(--btn-hover-bg, rgba(127, 127, 127, 0.12));
    }

    .emoji-image {
        width: 34px;
        height: 34px;
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

    :global(.custom-emoji-loading) {
        min-height: 96px;

        :global(.placeholder-text.loading-text) {
            font-size: 1rem;
        }
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
