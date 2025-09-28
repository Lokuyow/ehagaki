<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte";
    import { _ } from "svelte-i18n";
    import type { MenuItem } from "../lib/types";

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
        }
    }

    // ESCキーで閉じる
    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            onClose();
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
</script>

<div
    bind:this={menuElement}
    class="context-menu"
    style="left: {left}px; top: {top}px;"
    role="menu"
    aria-label="Image context menu"
>
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
        padding: 4px 0;
        font-size: 1rem;
        pointer-events: auto;
    }

    .context-menu-item {
        display: block;
        width: 100%;
        padding: 8px 16px;
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
