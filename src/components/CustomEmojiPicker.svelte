<script lang="ts">
    import { onMount } from "svelte";
    import { Command, ScrollArea, Toolbar } from "bits-ui";
    import type { RxNostr } from "rx-nostr";
    import { _ } from "svelte-i18n";
    import {
        CUSTOM_EMOJI_PICKER_DEFAULT_HEIGHT,
        CUSTOM_EMOJI_GRID_CELL_SIZE,
        CUSTOM_EMOJI_PICKER_MIN_HEIGHT,
        CUSTOM_EMOJI_PICKER_RESIZE_HANDLE_HEIGHT,
        CUSTOM_EMOJI_PICKER_RESIZE_HANDLE_OVERLAP,
        CUSTOM_EMOJI_PICKER_SEARCH_ROW_HEIGHT,
        readCustomEmojiPickerHeight,
        writeCustomEmojiPickerHeight,
        type CustomEmojiItem,
    } from "../lib/customEmoji";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { customEmojiStore } from "../stores/customEmojiStore.svelte";
    import { preventKeyboardFocusChange } from "../lib/utils/keyboardFocusUtils";

    const VIRTUAL_OVERSCAN_ROWS = 3;
    const CUSTOM_EMOJI_GRID_TOP_PADDING = 8;

    interface Props {
        rxNostr?: RxNostr | null;
        pubkey?: string | null;
        open?: boolean;
        maxHeight?: number | null;
        onSelect?: (emoji: CustomEmojiItem) => void;
        onMoveCaretLeft?: () => void;
        onMoveCaretRight?: () => void;
        onDeleteBackward?: () => void;
        onInsertLineBreak?: () => void;
    }

    let {
        rxNostr,
        pubkey,
        open = false,
        maxHeight = null,
        onSelect,
        onMoveCaretLeft,
        onMoveCaretRight,
        onDeleteBackward,
        onInsertLineBreak,
    }: Props = $props();
    let search = $state("");
    let pickerHeight = $state(CUSTOM_EMOJI_PICKER_DEFAULT_HEIGHT);
    let resizing = $state(false);
    let renderItems = $state(false);
    let scrollTop = $state(0);
    let pickerWidth = $state(800);
    let renderItemsFrameId: number | null = null;
    let layoutFrameId: number | null = null;
    let pickerElement: HTMLDivElement | null = null;
    let lastLoadRxNostr: RxNostr | null | undefined = undefined;
    let lastLoadPubkey: string | null | undefined = undefined;

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
        Math.max(1, Math.floor(pickerWidth / CUSTOM_EMOJI_GRID_CELL_SIZE)),
    );
    let totalRowCount = $derived(Math.ceil(filteredItems.length / columnCount));
    let effectivePickerHeight = $derived(
        Math.max(CUSTOM_EMOJI_PICKER_MIN_HEIGHT, pickerHeight),
    );
    let visibleRowCount = $derived(
        Math.ceil(effectivePickerHeight / CUSTOM_EMOJI_GRID_CELL_SIZE) +
            VIRTUAL_OVERSCAN_ROWS * 2,
    );
    let startRow = $derived(
        Math.max(
            0,
            Math.min(
                Math.max(0, totalRowCount - visibleRowCount),
                Math.floor(scrollTop / CUSTOM_EMOJI_GRID_CELL_SIZE) -
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
        totalRowCount * CUSTOM_EMOJI_GRID_CELL_SIZE +
            CUSTOM_EMOJI_GRID_TOP_PADDING,
    );
    let virtualOffsetY = $derived(startRow * CUSTOM_EMOJI_GRID_CELL_SIZE);
    let pickerMaxHeight = $derived(
        Number.isFinite(maxHeight)
            ? Math.max(
                  CUSTOM_EMOJI_PICKER_MIN_HEIGHT,
                  Math.floor(maxHeight as number),
              )
            : undefined,
    );
    let pickerStorageMaxHeight = $derived(
        pickerMaxHeight === undefined ? undefined : pickerMaxHeight,
    );
    let pickerChromeStyle = $derived(
        `--custom-emoji-picker-resize-handle-height: ${CUSTOM_EMOJI_PICKER_RESIZE_HANDLE_HEIGHT}px; ` +
            `--custom-emoji-picker-resize-handle-overlap: ${CUSTOM_EMOJI_PICKER_RESIZE_HANDLE_OVERLAP}px; ` +
            `--custom-emoji-picker-search-row-height: ${CUSTOM_EMOJI_PICKER_SEARCH_ROW_HEIGHT}px;`,
    );

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

    function getPickerHeightClampViewport(): number {
        const visualViewportHeight = window.visualViewport?.height ?? 0;
        const keyboardHeight = readRootPixelValue("--keyboard-height");
        return Math.max(
            window.innerHeight || 0,
            visualViewportHeight + keyboardHeight,
            visualViewportHeight,
            800,
        );
    }

    function updatePickerLayout(): void {
        updatePickerWidth();
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
        pickerHeight = readCustomEmojiPickerHeight(
            localStorage,
            getPickerHeightClampViewport(),
            pickerStorageMaxHeight,
        );
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
            lastLoadRxNostr = undefined;
            lastLoadPubkey = undefined;
            return;
        }

        if (rxNostr !== lastLoadRxNostr || pubkey !== lastLoadPubkey) {
            lastLoadRxNostr = rxNostr;
            lastLoadPubkey = pubkey;
            void customEmojiStore.load({ rxNostr, pubkey });
        }
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

    $effect(() => {
        pickerStorageMaxHeight;
        pickerHeight = readCustomEmojiPickerHeight(
            localStorage,
            getPickerHeightClampViewport(),
            pickerStorageMaxHeight,
        );
    });

    function selectEmoji(emoji: CustomEmojiItem): void {
        onSelect?.(emoji);
    }

    function moveCaretLeft(): void {
        onMoveCaretLeft?.();
    }

    function moveCaretRight(): void {
        onMoveCaretRight?.();
    }

    function deleteBackward(): void {
        onDeleteBackward?.();
    }

    function insertLineBreak(): void {
        onInsertLineBreak?.();
    }

    function startResize(event: PointerEvent): void {
        event.preventDefault();
        updatePickerLayout();
        const startY = event.clientY;
        const startVisibleHeight = effectivePickerHeight;
        resizing = true;

        const move = (moveEvent: PointerEvent) => {
            moveEvent.preventDefault();
            const nextVisibleHeight =
                startVisibleHeight + (startY - moveEvent.clientY);
            pickerHeight = writeCustomEmojiPickerHeight(
                localStorage,
                nextVisibleHeight,
                getPickerHeightClampViewport(),
                pickerStorageMaxHeight,
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
    style={pickerChromeStyle}
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
                                style={`transform: translateY(${virtualOffsetY}px); grid-template-columns: repeat(${columnCount}, minmax(0, 1fr)); grid-auto-rows: ${CUSTOM_EMOJI_GRID_CELL_SIZE}px;`}
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
        <div class="custom-emoji-search-row">
            <Command.Input
                class="custom-emoji-search"
                bind:value={search}
                placeholder={$_("customEmoji.search_placeholder")}
            />
            <Toolbar.Root
                class="custom-emoji-editor-toolbar"
                orientation="horizontal"
                loop={false}
                aria-label={$_("customEmoji.editor_toolbar")}
            >
                <div class="arrow-keys">
                    <Toolbar.Button
                        class="custom-emoji-editor-button left"
                        aria-label={$_("customEmoji.move_left")}
                        onmousedown={preventKeyboardFocusChange}
                        ontouchstart={preventKeyboardFocusChange}
                        onclick={moveCaretLeft}
                    >
                        <span class="caret-left-icon svg-icon"></span>
                    </Toolbar.Button>
                    <Toolbar.Button
                        class="custom-emoji-editor-button right"
                        aria-label={$_("customEmoji.move_right")}
                        onmousedown={preventKeyboardFocusChange}
                        ontouchstart={preventKeyboardFocusChange}
                        onclick={moveCaretRight}
                    >
                        <span class="caret-right-icon svg-icon"></span>
                    </Toolbar.Button>
                </div>
                <div class="line-break-delete">
                    <Toolbar.Button
                        class="custom-emoji-editor-button line-break"
                        aria-label={$_("customEmoji.insert_line_break")}
                        onmousedown={preventKeyboardFocusChange}
                        ontouchstart={preventKeyboardFocusChange}
                        onclick={insertLineBreak}
                    >
                        <span class="enter-key-icon svg-icon"></span>
                    </Toolbar.Button>

                    <Toolbar.Button
                        class="custom-emoji-editor-button delete"
                        aria-label={$_("customEmoji.delete_backward")}
                        onmousedown={preventKeyboardFocusChange}
                        ontouchstart={preventKeyboardFocusChange}
                        onclick={deleteBackward}
                    >
                        <span class="delete-left-icon svg-icon"></span>
                    </Toolbar.Button>
                </div>
            </Toolbar.Root>
        </div>
    </Command.Root>
</div>

<style>
    .custom-emoji-picker {
        width: 100%;
        max-width: 800px;
        background: var(--dialog);
        color: var(--text);
        overflow: hidden;
    }

    .resize-handle {
        width: 100%;
        height: var(--custom-emoji-picker-resize-handle-height);
        margin-bottom: calc(
            var(--custom-emoji-picker-resize-handle-overlap) * -1
        );
        cursor: ns-resize;
        touch-action: none;
        position: relative;
        z-index: 1;
        background: transparent;
    }

    .resize-handle::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 12px;
        background: var(--bg-buttonbar);
    }

    .resize-handle::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 6px;
        width: 38px;
        height: 4px;
        border-radius: 999px;
        transform: translate(-50%, -50%);
        background: var(--border);
    }

    :global(.custom-emoji-command) {
        display: flex;
        flex-direction: column;
    }

    .custom-emoji-search-row {
        display: flex;
        align-items: center;
        width: 100%;
        min-height: var(--custom-emoji-picker-search-row-height);
        border-top: 1px solid var(--border);
        background: var(--input-bg, var(--dialog));
    }

    :global(.custom-emoji-search) {
        flex: 1 1 auto;
        min-width: 0;
        width: 100%;
        height: var(--custom-emoji-picker-search-row-height);
        padding: 0 8px;
        border: 0;
        background: transparent;
        color: var(--text);
        font-size: 1rem;
        outline: none;
    }

    :global(.custom-emoji-editor-toolbar) {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        height: var(--custom-emoji-picker-search-row-height);
        gap: 2px;

        .arrow-keys {
            display: flex;
            align-items: center;
            height: 100%;
            gap: 2px;
        }

        .line-break-delete {
            display: flex;
            align-items: center;
            height: 100%;
            gap: 2px;

            :global(.line-break) {
                width: 62px;
            }

            :global(.delete) {
                width: 62px;
            }
        }
    }

    :global(.custom-emoji-editor-button) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 100%;
        padding: 0;
        color: var(--text);
        touch-action: manipulation;
    }

    @media (min-width: 601px) {
        :global(.custom-emoji-editor-button:hover) {
            background: var(--btn-bg);
        }
    }

    :global(.custom-emoji-editor-button:active) {
        transform: scale(0.94);
    }

    :global(.custom-emoji-editor-button .svg-icon) {
        width: 34px;
        height: 34px;
        background-color: var(--svg, currentColor);
        mask-repeat: no-repeat;
        mask-position: center;
        mask-size: contain;
    }

    .caret-left-icon {
        mask-image: url("/icons/caret-left-solid-full.svg");
    }

    .caret-right-icon {
        mask-image: url("/icons/caret-right-solid-full.svg");
    }

    .delete-left-icon {
        mask-image: url("/icons/delete-left-solid-full.svg");
    }

    .enter-key-icon {
        mask-image: url("/icons/enter-key-arrow.svg");
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
        top: 8px;
        left: 4px;
        right: 4px;
        display: grid;
        justify-items: center;
    }

    :global(.emoji-item) {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        outline: none;
    }

    :global(.emoji-item:hover),
    :global(.emoji-item[data-highlighted]) {
        background: var(--btn-hover-bg);
    }

    .emoji-image {
        width: 32px;
        height: 32px;
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
