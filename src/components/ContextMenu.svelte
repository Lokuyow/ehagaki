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
        if (typeof src === "string") {
            // プロトコルを除去
            let displayUrl = src.replace(/^https?:\/\//, "");
            if (displayUrl.length > 26) {
                imageUrlHeader = `${displayUrl.slice(0, 18)}...${displayUrl.slice(-8)}`;
            } else {
                imageUrlHeader = displayUrl;
            }
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
            {#if item.icon}
                <span
                    class="menu-icon svg-icon"
                    class:expand-icon={item.icon ===
                        "/icons/expand-solid-full.svg"}
                    class:copy-icon={item.icon === "/icons/copy-solid-full.svg"}
                    class:trash-icon={item.icon ===
                        "/icons/trash-solid-full.svg"}
                    aria-hidden="true"
                ></span>
            {/if}
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
        padding-bottom: 6px;
        pointer-events: auto;
    }

    .context-menu-header {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 34px;
        font-size: 0.9375rem;
        color: var(--text-light, #888);
        padding: 0 12px;
        margin-bottom: 4px;
        border-bottom: 1px solid var(--border, #eee);
        word-break: break-all;
        background: none;
        cursor: default;
    }

    .context-menu-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 14px;
        width: 100%;
        padding: 10px 16px;
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

        &:active {
            transform: scale(1);
        }

        .menu-icon {
            width: 24px;
            height: 24px;
        }
    }
    .expand-icon {
        mask-image: url("/icons/expand-solid-full.svg");
    }
    .copy-icon {
        mask-image: url("/icons/copy-solid-full.svg");
    }
    .trash-icon {
        mask-image: url("/icons/trash-solid-full.svg");
    }
</style>
