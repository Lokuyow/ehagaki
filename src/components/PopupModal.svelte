<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { tick } from "svelte";

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
</script>

{#if show}
    <div
        bind:this={container}
        class="popup-modal"
        style="left: {x}px; top: {y}px;"
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
    }

    .popup-body {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: 100%;
    }
    .popup-children {
        min-width: 0;
        padding: 0 2px;
    }

    .info-icon {
        mask-image: url("/icons/circle-info-solid-full.svg");
        width: 24px;
        height: 24px;
    }
</style>
