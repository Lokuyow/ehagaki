<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte";
    import { _ } from "svelte-i18n";
    import type { MenuItem } from "../lib/types";
    import { globalContextMenuStore } from "../stores/appStore.svelte";

    interface Props {
        x: number;
        y: number;
        items: MenuItem[];
        onClose: () => void;
    }

    let { x, y, items, onClose }: Props = $props();
    let targetX = x;
    let targetY = y;
    let left: number = $state(x);
    let top: number = $state(y);
    let menuElement: HTMLDivElement | undefined = $state();

    // メニュー外クリックで閉じる
    function handleClickOutside(event: MouseEvent) {
        if (menuElement && !menuElement.contains(event.target as Node)) {
            onClose();
            globalContextMenuStore.set({ open: false, nodeId: undefined });
        }
    }

    // ESCキーで閉じる
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            onClose();
            globalContextMenuStore.set({ open: false, nodeId: undefined });
        }
    }

    async function updatePosition() {
        await tick();
        if (!menuElement) return;
        const { offsetWidth, offsetHeight } = menuElement;
        const viewportWidth =
            window.innerWidth || document.documentElement.clientWidth || 0;
        const viewportHeight =
            window.innerHeight || document.documentElement.clientHeight || 0;
        const rect = menuElement.getBoundingClientRect();
        const correctedX = targetX - (rect.left - targetX);
        const correctedY = targetY - (rect.top - targetY);
        const maxX = Math.max(0, viewportWidth - offsetWidth);
        const maxY = Math.max(0, viewportHeight - offsetHeight);

        left = Math.min(Math.max(0, correctedX), maxX);
        top = Math.min(Math.max(0, correctedY), maxY);
    }

    $effect(() => {
        targetX = x;
        targetY = y;
        left = targetX;
        top = targetY;
        updatePosition();
    });

    onMount(() => {
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        updatePosition();
        window.addEventListener("resize", updatePosition);
    });

    onDestroy(() => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", updatePosition);
    });

    // 画像URLヘッダー表示用
    let imageUrlHeader: string | null = $state(null);
    $effect(() => {
        const src = items[0]?.src;
        if (typeof src === "string" && src.length > 30) {
            imageUrlHeader = `${src.slice(0, 20)}...${src.slice(-10)}`;
        } else if (typeof src === "string") {
            imageUrlHeader = src;
        } else {
            imageUrlHeader = null;
        }
    });
</script>

<div
    bind:this={menuElement}
    class="context-menu"
    style="left: {left}px; top: {top}px;"
    role="menu"
    aria-label="Image context menu"
>
    {#if imageUrlHeader}
        <div class="context-menu-header">{imageUrlHeader}</div>
    {/if}
    {#each items as item (item.label)}
        <button
            class="context-menu-item"
            class:disabled={item.disabled}
            onclick={() => {
                item.action();
                onClose();
            }}
            disabled={item.disabled}
            role="menuitem"
        >
            {item.label}
        </button>
    {/each}
</div>

<style>
    .context-menu {
        position: fixed;
        background: var(--dialog);
        border: 1px solid var(--border);
        border-radius: 6px;
        box-shadow: 0 4px 12px var(--shadow);
        z-index: 10000;
        min-width: 160px;
        padding: 0;
        pointer-events: auto;
    }

    /* 変更: ヘッダーの高さがコンテンツに応じて確実に取れるように調整 */
    .context-menu-header {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 34px;
        font-size: 0.9375rem;
        color: var(--text-light, #888);
        padding: 0 12px;
        border-bottom: 1px solid var(--border, #eee);
        word-break: break-all;
        background: none;
    }

    .context-menu-item {
        display: block;
        width: 100%;
        padding: 12px 16px;
        background: none;
        border: none;
        text-align: left;
        cursor: pointer;
        color: var(--text);
        transition: background-color 0.2s ease;

        &.disabled {
            color: var(--text-disabled);
            cursor: not-allowed;
        }

        &:focus {
            outline: 1px solid var(--theme);
            outline-offset: -2px;
        }

        &:active {
            transform: scale(1);
        }
    }
</style>
