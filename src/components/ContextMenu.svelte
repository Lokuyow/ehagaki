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

    let targetX = $derived(x);
    let targetY = $derived(y);
    let left: number = $state(0);
    let top: number = $state(0);
    let menuElement: HTMLDivElement | undefined = $state();

    // propsが変更されたら位置を初期化
    $effect(() => {
        left = x;
        top = y;
    });
    let justOpened = $state(true); // 追加: メニューが開いた直後かどうか

    // タッチ処理用の状態
    let lastTouchTime = 0;
    let isTouchDevice = false;

    // メニュー外クリックで閉じる
    function handleClickOutside(event: MouseEvent) {
        // メニューが開いた直後のクリックイベントは無視
        if (justOpened) {
            return;
        }

        // タッチデバイスの場合、タッチイベント後のクリックイベントを無視
        const now = Date.now();
        if (isTouchDevice && now - lastTouchTime < 500) {
            return;
        }

        if (menuElement && !menuElement.contains(event.target as Node)) {
            onClose();
            globalContextMenuStore.set({ open: false, nodeId: undefined });
        }
    }

    // タッチ外クリックで閉じる（Android対応）
    function handleTouchOutside(event: TouchEvent) {
        // メニューが開いた直後のタッチイベントは無視
        if (justOpened) {
            return;
        }

        isTouchDevice = true;
        lastTouchTime = Date.now();

        if (
            menuElement &&
            event.target instanceof Node &&
            !menuElement.contains(event.target)
        ) {
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

    // updateMenuPosition を非同期化して DOM 更新を待つようにする
    async function updateMenuPosition() {
        // DOM 更新を待つ（初回レンダリングで要素サイズが未確定なケースに対応）
        await tick();

        // menuElementが存在すればサイズを取得（getBoundingClientRect を優先）
        let width = menuElement ? menuElement.getBoundingClientRect().width : 0;
        let height = menuElement
            ? menuElement.getBoundingClientRect().height
            : 0;

        // フォールバック値（極端に小さい場合の保険）
        if (!width || width < 8) width = menuElement?.offsetWidth ?? 160;
        if (!height || height < 4) height = menuElement?.offsetHeight ?? 40;

        // 余白を少し取る（見た目調整／端寄せ回避）
        const margin = 8;
        const menuPos = calculateContextMenuPosition(
            targetX,
            targetY,
            margin,
            width,
            height,
        );

        left = menuPos.x;
        top = menuPos.y;
    }

    $effect(() => {
        targetX = x;
        targetY = y;
        updateMenuPosition();
    });

    // resizeイベント用のハンドラを変数に
    function handleResize() {
        updateMenuPosition();
    }

    onMount(() => {
        // クリックイベントリスナーを次のイベントループで登録
        // これにより、コンテキストメニューを開いたクリックイベントが処理された後に登録される
        setTimeout(() => {
            justOpened = false;
            document.addEventListener("click", handleClickOutside);
            document.addEventListener("touchend", handleTouchOutside);
        }, 0);

        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", handleResize);
        // 非同期関数なので呼び出しは void で（返り値の Promise を無視）
        void updateMenuPosition();
    });

    onDestroy(() => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("touchend", handleTouchOutside);
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", handleResize);
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

    // メニューの種類を判定（画像か動画か）
    const menuType = $derived(() => {
        // アイテムのラベルから推測
        const firstItem = items[0];
        if (firstItem && firstItem.label) {
            const label =
                typeof firstItem.label === "string" ? firstItem.label : "";
            // 動画コンテキストメニューのラベルを確認
            if (
                label === t("videoContextMenu.copyUrl") ||
                label === t("videoContextMenu.delete")
            ) {
                return "video";
            }
        }
        return "image";
    });

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
        const type = menuType();
        const messageKey =
            type === "video"
                ? "videoContextMenu.copySuccess"
                : "imageContextMenu.copySuccess";
        onShowPopup(pos.x, pos.y, t(messageKey));
        // devログ
        if (import.meta.env.MODE === "development") {
            console.log("[dev] ContextMenu.showCopySuccessPopup()", {
                initialPropsX: x,
                initialPropsY: y,
                source,
                calculated: pos,
                popupX: pos.x,
                popupY: pos.y,
                menuType: type,
                popupMessage: t(messageKey),
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
        const type = menuType();
        const messageKey =
            type === "video"
                ? "videoContextMenu.copyFailed"
                : "imageContextMenu.copyFailed";
        onShowPopup(pos.x, pos.y, t(messageKey));
        if (import.meta.env.MODE === "development") {
            console.log("[dev] ContextMenu.showCopyFailurePopup()", {
                source,
                calculated: pos,
                menuType: type,
                popupMessage: t(messageKey),
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
                        // コピーアクションは Promise を返すので await
                        item.action();
                        showCopySuccessPopup(event as MouseEvent);
                    } catch (error) {
                        console.warn("Copy failed:", error);
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
                    class:play-pause-icon={item.icon ===
                        "/icons/play_pause_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"}
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
        height: 32px;
        font-size: 0.9375rem;
        color: var(--text-light, #888);
        padding: 0 10px;
        margin-bottom: 2px;
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
        background: var(--dialog);
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

        @media (min-width: 601px) {
            &:hover:not(:disabled) {
                @media (prefers-color-scheme: light) {
                    filter: brightness(96%);
                }

                @media (prefers-color-scheme: dark) {
                    filter: brightness(130%);
                }
            }
        }
    }
    .expand-icon {
        mask-image: url("/icons/expand-solid-full.svg");
    }
    .copy-icon {
        mask-image: url("/icons/copy-solid-full.svg");
    }
    .menu-icon.play-pause-icon {
        mask-image: url("/icons/play_pause_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }
    .trash-icon {
        mask-image: url("/icons/trash-solid-full.svg");
    }
</style>
