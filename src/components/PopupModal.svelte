<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { tick } from "svelte";
    import { calculateContextMenuPosition } from "../lib/utils/appUtils"; // 追加

    // Runesモード: $props() で受ける（let にして親からの更新を反映）
    let {
        show = false,
        x = 0,
        y = 0,
        onClose = undefined,
        children = undefined,
    } = $props<{
        show?: boolean;
        x?: number;
        y?: number;
        onClose?: () => void;
        children?: () => any;
    }>();

    function close() {
        if (import.meta.env.MODE === "development") {
            console.log("[dev] PopupModal.close() before", { show, x, y });
        }
        try {
            onClose && onClose();
        } catch {}
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") {
            close();
        }
    }

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
    });

    onDestroy(() => {
        window.removeEventListener("keydown", handleKeydown);
    });

    // popup のルート要素参照（body に移動するため）
    let container: HTMLDivElement | undefined = $state();

    // show が true になったタイミングで要素を document.body に移動
    $effect(() => {
        if (show && container) {
            // DOM 更新を待ってから移動（確実に存在するように）
            (async () => {
                await tick();
                if (container.parentElement !== document.body) {
                    document.body.appendChild(container);
                }
            })();
        }
    });

    onDestroy(() => {
        // コンポーネント破棄時に body から取り除く（存在すれば）
        if (container && container.parentElement === document.body) {
            try {
                document.body.removeChild(container);
            } catch {}
        }
    });

    let popupX = $state(x);
    let popupY = $state(y);

    $effect(() => {
        // 非同期に DOM 更新を待ってからサイズを取得し位置計算する
        (async () => {
            await tick();
            // containerが存在する場合はサイズを取得して位置を計算
            let width = container?.offsetWidth ?? 0;
            let height = container?.offsetHeight ?? 0;
            // 初回は0なので fallback
            if (width < 10) width = 320;
            if (height < 10) height = 40;
            const pos = calculateContextMenuPosition(
                x,
                y,
                undefined,
                width,
                height,
            );
            popupX = pos.x;
            popupY = pos.y;
        })();
    });
</script>

{#if show}
    <div
        bind:this={container}
        class="popup-modal"
        style="left: {popupX}px; top: {popupY}px;"
        onclick={(e) =>
            (e as Event & { stopPropagation?: () => void }).stopPropagation?.()}
        onkeydown={(e) => {
            // Allow keyboard users to close modal with Enter or Space
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                close();
            }
        }}
        role="dialog"
        aria-modal="true"
        tabindex="0"
    >
        <!-- 変更: 左側にアイコンを置き、右側に children を表示 -->
        <div class="popup-body" role="document">
            <span class="info-icon svg-icon" aria-hidden="true"></span>
            <div class="popup-children">
                {@render children?.()}
            </div>
        </div>
    </div>
{/if}

<style>
    .popup-modal {
        background: var(--dialog, #fff);
        color: var(--text, #000);
        border: 1px solid var(--border, #ccc);
        border-radius: 8px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
        padding: 10px 12px;
        max-width: 320px;
        position: fixed;
        z-index: 100001;
        outline: none;
        display: inline-flex;
        align-items: flex-start;
        white-space: nowrap;
    }

    .popup-body {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: 100%;
    }
    .popup-children {
        padding: 0 2px;
    }

    .info-icon {
        mask-image: url("/icons/circle-info-solid-full.svg");
        width: 24px;
        height: 24px;
        min-width: 24px;
    }

    /* 追加: コピー成功メッセージのスタイル（ContextMenuと同じ） */
    :global(.copy-success-message) {
        font-size: 1rem;
        font-weight: bold;
        color: var(--text);
        text-align: center;
        padding: 0;
    }
</style>
