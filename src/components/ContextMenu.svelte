<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte";
    import { _ } from "svelte-i18n";
    import { get } from "svelte/store"; // 追加: ストア値を取得するため
    import type { MenuItem } from "../lib/types";
    import { globalContextMenuStore } from "../stores/appStore.svelte";
    import { calculateContextMenuPosition } from "../lib/utils/appUtils"; // 追加: 位置計算関数をインポート

    interface Props {
        x: number;
        y: number;
        items: MenuItem[];
        onClose: () => void;
        onShowPopup: (x: number, y: number, message: string) => void;
    }

    let { x, y, items, onClose, onShowPopup }: Props = $props(); // 変更: lastClickPosition を受け取らない

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

    // 位置更新でエディター境界を考慮しない（ビューポート全体）
    async function updatePosition() {
        await tick();
        if (!menuElement) return;
        const { offsetWidth, offsetHeight } = menuElement;
        const viewportWidth =
            window.innerWidth || document.documentElement.clientWidth || 0;
        const viewportHeight =
            window.innerHeight || document.documentElement.clientHeight || 0;
        const maxX = Math.max(0, viewportWidth - offsetWidth);
        const maxY = Math.max(0, viewportHeight - offsetHeight);

        left = Math.min(Math.max(0, targetX), maxX);
        top = Math.min(Math.max(0, targetY), maxY);
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

    // スクリプト内で安全に翻訳を取得するヘルパー
    const t = (key: string) => {
        const translator = get(_);
        return typeof translator === "function" ? translator(key) : String(key);
    };

    // 追加: コピー成功時のポップアップ表示関数（親に通知）
    function showCopySuccessPopup(event?: MouseEvent) {
        // 簡素化: イベント座標があればそれを使用し、なければコンポーネントに渡された x,y を使用する（ストアや menu の近傍フォールバックは削除）
        let source: { x: number; y: number };
        if (
            event &&
            typeof event.clientX === "number" &&
            typeof event.clientY === "number"
        ) {
            source = { x: event.clientX, y: event.clientY };
        } else {
            source = { x: x, y: y };
        }

        const pos = calculateContextMenuPosition(source.x, source.y);
        onShowPopup(pos.x, pos.y, t("imageContextMenu.copySuccess"));
        // devログ
        if (import.meta.env.MODE === "development") {
            console.log("[dev] ContextMenu.showCopySuccessPopup()", {
                initialPropsX: x,
                initialPropsY: y,
                source,
                calculated: pos,
                popupX: pos.x,
                popupY: pos.y,
                popupMessage: t("imageContextMenu.copySuccess"),
            });
        }
    }

    // 追加: コピー失敗時のポップアップ表示（親に通知）
    function showCopyFailurePopup(event?: MouseEvent) {
        let source: { x: number; y: number };
        if (
            event &&
            typeof event.clientX === "number" &&
            typeof event.clientY === "number"
        ) {
            source = { x: event.clientX, y: event.clientY };
        } else {
            source = { x: x, y: y };
        }
        const pos = calculateContextMenuPosition(source.x, source.y);
        onShowPopup(pos.x, pos.y, t("imageContextMenu.copyFailed"));
        if (import.meta.env.MODE === "development") {
            console.log("[dev] ContextMenu.showCopyFailurePopup()", {
                source,
                calculated: pos,
                popupMessage: t("imageContextMenu.copyFailed"),
            });
        }
    }
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
            onclick={async (event) => {
                if (import.meta.env.MODE === "development") {
                    console.log("[dev] ContextMenu.item.click", {
                        label: item.label,
                        icon: item.icon,
                        disabled: item.disabled,
                    });
                }
                // コピーアクションの判定をラベル比較からアイコン比較へ変更（翻訳差異に頑強）
                const isCopyAction =
                    item.icon === "/icons/copy-solid-full.svg" ||
                    /copy/i.test(String(item.label));
                if (isCopyAction) {
                    try {
                        item.action();
                        // ストアにある「メニューを開いたときのクリック位置」を優先してポップアップ位置を決定
                        showCopySuccessPopup(event as MouseEvent);
                    } catch (error) {
                        console.warn("Copy failed:", error);
                        // 失敗時は失敗メッセージをポップアップで表示
                        showCopyFailurePopup(event as MouseEvent);
                    }
                } else {
                    item.action();
                }
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
        white-space: nowrap;
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
            min-width: 24px;
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

    /* 追加: コピー成功メッセージのスタイル */
    :global(.copy-success-message) {
        font-size: 1rem;
        font-weight: bold;
        color: var(--text);
        text-align: center;
        padding: 0;
    }
</style>
