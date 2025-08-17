<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";
    import { onDestroy } from "svelte";

    export let node: NodeViewProps["node"];
    export let selected: boolean;
    export let getPos: NodeViewProps["getPos"];

    let isDragging = false;
    let touchStartPos = { x: 0, y: 0 };
    let dragPreview: HTMLElement | null = null;

    // 長押し判定（0.4秒）
    const LONG_PRESS_DELAY = 400; // ms
    const MOVE_CANCEL_THRESHOLD = 10; // px
    let longPressTimeout: ReturnType<typeof setTimeout> | null = null;
    let touchStartTarget: HTMLElement | null = null;

    // 画像クリック時の例（必要に応じて拡張）
    function handleClick() {
        // 例: 画像クリックで何かする
    }

    // ドラッグ開始処理
    function handleDragStart(event: DragEvent) {
        if (!event.dataTransfer) return;

        // ドラッグデータにノード情報と位置を設定
        event.dataTransfer.setData(
            "application/x-tiptap-node",
            JSON.stringify({
                type: "image",
                attrs: node.attrs,
                pos: getPos(),
            }),
        );
        event.dataTransfer.effectAllowed = "move";
        isDragging = true;
    }

    function handleDragEnd() {
        isDragging = false;
        removeDragPreview();
    }

    // タッチ開始処理
    function handleTouchStart(event: TouchEvent) {
        if (event.touches.length !== 1) return;

        const touch = event.touches[0];
        touchStartPos = { x: touch.clientX, y: touch.clientY };
        touchStartTarget = event.currentTarget as HTMLElement;
        // 長押しタイマーをセット（発火時にドラッグ開始）
        longPressTimeout = setTimeout(() => {
            // 長押しとして確定
            isDragging = true;
            // 実際のドラッグプレビュー作成（この時点でpreventDefaultしても良い）
            if (touchStartTarget) {
                createDragPreview(
                    touchStartTarget,
                    touch.clientX,
                    touch.clientY,
                );
            }
        }, LONG_PRESS_DELAY);
    }

    // タッチ移動処理
    function handleTouchMove(event: TouchEvent) {
        if (event.touches.length !== 1) {
            // 複数タッチならキャンセル
            if (longPressTimeout) {
                clearTimeout(longPressTimeout);
                longPressTimeout = null;
            }
            return;
        }

        const touch = event.touches[0];
        // 長押し前で一定距離移動したら長押しをキャンセル（スクロール意図と判断）
        if (!isDragging && longPressTimeout) {
            const dx = touch.clientX - touchStartPos.x;
            const dy = touch.clientY - touchStartPos.y;
            const distSq = dx * dx + dy * dy;
            if (distSq > MOVE_CANCEL_THRESHOLD * MOVE_CANCEL_THRESHOLD) {
                clearTimeout(longPressTimeout);
                longPressTimeout = null;
                touchStartTarget = null;
                return;
            }
        }

        if (!isDragging) return;

        // ドラッグ中はスクロールを防止してプレビューを移動
        event.preventDefault();
        updateDragPreview(touch.clientX, touch.clientY);
    }

    // タッチ終了処理
    function handleTouchEnd(event: TouchEvent) {
        // 長押しタイマーが残っていればクリア
        if (longPressTimeout) {
            clearTimeout(longPressTimeout);
            longPressTimeout = null;
            touchStartTarget = null;
        }

        // ドラッグしていた場合はドロップ処理を行う
        if (!isDragging) {
            return;
        }

        event.preventDefault();
        const touch = event.changedTouches[0];

        const elementBelow = document.elementFromPoint(
            touch.clientX,
            touch.clientY,
        );
        if (elementBelow) {
            const touchDropEvent = new CustomEvent("touch-image-drop", {
                detail: {
                    nodeData: {
                        type: "image",
                        attrs: node.attrs,
                        pos: getPos(),
                    },
                    dropX: touch.clientX,
                    dropY: touch.clientY,
                    target: elementBelow,
                },
            });
            window.dispatchEvent(touchDropEvent);
        }

        isDragging = false;
        removeDragPreview();
    }

    // コンテキストメニュー抑制
    function handleContextMenu(event: Event) {
        event.preventDefault();
    }

    // ドラッグプレビューを作成
    function createDragPreview(element: HTMLElement, x: number, y: number) {
        const img = element.querySelector("img");
        if (!img) return;

        dragPreview = img.cloneNode(true) as HTMLElement;
        dragPreview.style.position = "fixed";
        dragPreview.style.pointerEvents = "none";
        dragPreview.style.zIndex = "9999";
        dragPreview.style.opacity = "0.7";
        dragPreview.style.transform = "scale(0.8)";
        dragPreview.style.borderRadius = "6px";
        dragPreview.style.maxWidth = "120px";
        dragPreview.style.maxHeight = "120px";

        updateDragPreview(x, y);
        document.body.appendChild(dragPreview);
    }

    // ドラッグプレビューの位置を更新
    function updateDragPreview(x: number, y: number) {
        if (!dragPreview) return;

        dragPreview.style.left = `${x - 60}px`; // 中央に配置
        dragPreview.style.top = `${y - 60}px`;
    }

    // ドラッグプレビューを削除
    function removeDragPreview() {
        if (dragPreview && dragPreview.parentNode) {
            dragPreview.parentNode.removeChild(dragPreview);
            dragPreview = null;
        }
    }

    // コンポーネント破棄時のクリーンアップ
    onDestroy(() => {
        if (longPressTimeout) {
            clearTimeout(longPressTimeout);
            longPressTimeout = null;
        }
        removeDragPreview();
    });
</script>

<NodeViewWrapper>
    <div
        class="editor-image-wrapper"
        data-selected={selected}
        data-dragging={isDragging}
    >
        <button
            type="button"
            class="editor-image-button"
            on:click={handleClick}
            tabindex="0"
            aria-label={node.attrs.alt || "Image"}
            draggable="true"
            on:dragstart={handleDragStart}
            on:dragend={handleDragEnd}
            on:touchstart={handleTouchStart}
            on:touchmove={handleTouchMove}
            on:touchend={handleTouchEnd}
            on:contextmenu={handleContextMenu}
        >
            <img
                src={node.attrs.src}
                alt={node.attrs.alt || ""}
                class="editor-image"
                draggable="false"
                on:contextmenu={handleContextMenu}
            />
        </button>
    </div>
</NodeViewWrapper>

<style>
    .editor-image-wrapper {
        display: block;
        position: relative;
        margin: 0;
        padding: 0;
    }
    .editor-image {
        max-width: 100%;
        max-height: 160px;
        border-radius: 6px;
        box-shadow: 0 1px 4px #0001;
        background: #fff;
        cursor: pointer;
        outline: none;
        transition: opacity 0.2s ease;
        /* コンテキストメニュー抑制 */
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
    }
    .editor-image-wrapper[data-selected="true"] .editor-image {
        outline: 2px solid var(--theme, #2196f3);
    }
    .editor-image-wrapper[data-dragging="true"] .editor-image {
        opacity: 0.5;
    }
    .editor-image-button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: grab;
        display: inline-block;
        touch-action: none;
        /* コンテキストメニュー抑制 */
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
    }
    .editor-image-button:active {
        cursor: grabbing;
    }
    .editor-image-button:focus .editor-image {
        outline: 2px solid var(--theme, #2196f3);
    }

    /* タッチデバイス用のスタイル */
    @media (hover: none) {
        .editor-image-button {
            cursor: default;
        }
        .editor-image-button:active {
            cursor: default;
        }
    }
</style>
