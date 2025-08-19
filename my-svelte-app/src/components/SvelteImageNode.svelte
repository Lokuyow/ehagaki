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

    // ドラッグ開始イベント発火
    function dispatchDragStart() {
        const startEvent = new CustomEvent("touch-image-drag-start", {
            detail: { nodePos: getPos() },
            bubbles: true,
            cancelable: true,
        });

        console.log("Dispatching touch-image-drag-start:", startEvent.detail); // デバッグログ
        window.dispatchEvent(startEvent);
        document.dispatchEvent(
            new CustomEvent("touch-image-drag-start", {
                detail: startEvent.detail,
            }),
        );
    }

    // ドラッグ終了イベント発火
    function dispatchDragEnd() {
        const endEvent = new CustomEvent("touch-image-drop", {
            detail: {
                nodeData: {
                    type: "image",
                    attrs: node.attrs,
                    pos: getPos(),
                },
                dropX: 0,
                dropY: 0,
                target: null,
                dropPosition: null,
            },
            bubbles: true,
            cancelable: true,
        });

        console.log("Dispatching touch-image-drop:", endEvent.detail); // デバッグログ
        window.dispatchEvent(endEvent);
        document.dispatchEvent(
            new CustomEvent("touch-image-drop", {
                detail: endEvent.detail,
            }),
        );
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
        dispatchDragStart();
    }

    function handleDragEnd() {
        isDragging = false;
        removeDragPreview();
        dispatchDragEnd();
    }

    // タッチ開始処理
    function handleTouchStart(event: TouchEvent) {
        // PC/スマホ問わず1本指タッチで発火
        if (event.touches.length !== 1) return;

        console.log("Touch start on image"); // デバッグログ
        const touch = event.touches[0];
        touchStartPos = { x: touch.clientX, y: touch.clientY };
        touchStartTarget = event.currentTarget as HTMLElement;
        // 長押しタイマーをセット（発火時にドラッグ開始）
        longPressTimeout = setTimeout(() => {
            console.log("Long press detected, starting drag"); // デバッグログ
            // 長押しとして確定
            isDragging = true;
            dispatchDragStart();

            // 実際のドラッグプレビュー作成
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
        // PC/スマホ問わず1本指タッチで発火
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
                console.log("Touch moved too far, canceling long press"); // デバッグログ
                clearTimeout(longPressTimeout);
                longPressTimeout = null;
                touchStartTarget = null;
                return;
            }
        }

        if (!isDragging) return;

        console.log("Touch move during drag:", {
            x: touch.clientX,
            y: touch.clientY,
        }); // デバッグログ
        // ドラッグ中はスクロールを防止してプレビューを移動
        event.preventDefault();
        updateDragPreview(touch.clientX, touch.clientY);

        // ホバー中のドロップゾーンをハイライト
        highlightDropZoneAtPosition(touch.clientX, touch.clientY);

        // 自動スクロール用のイベントを確実に発火
        const moveEvent = new CustomEvent("touch-image-drag-move", {
            detail: {
                touchX: touch.clientX,
                touchY: touch.clientY,
                nodePos: getPos(),
            },
            bubbles: true,
            cancelable: true,
        });

        console.log("Dispatching touch-image-drag-move:", moveEvent.detail); // デバッグログ
        window.dispatchEvent(moveEvent);

        // 追加: 直接DOMイベントも発火（フォールバック）
        document.dispatchEvent(
            new CustomEvent("touch-image-drag-move", {
                detail: moveEvent.detail,
            }),
        );
    }

    // ドロップゾーンのホバーハイライト処理
    function highlightDropZoneAtPosition(x: number, y: number) {
        // 既存のハイライトをクリア
        document.querySelectorAll(".drop-zone-indicator").forEach((zone) => {
            zone.classList.remove("drop-zone-hover");
        });

        // カーソル位置の要素を取得
        const elementBelow = document.elementFromPoint(x, y);
        if (elementBelow) {
            const dropZone = elementBelow.closest(".drop-zone-indicator");
            if (dropZone) {
                dropZone.classList.add("drop-zone-hover");
            }
        }
    }

    // タッチ終了処理
    function handleTouchEnd(event: TouchEvent) {
        console.log("Touch end, isDragging:", isDragging); // デバッグログ

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

        console.log("Touch drop at:", { x: touch.clientX, y: touch.clientY }); // デバッグログ
        const elementBelow = document.elementFromPoint(
            touch.clientX,
            touch.clientY,
        );

        if (elementBelow) {
            // ドロップゾーンかその子要素を探す
            const dropZone = elementBelow.closest(".drop-zone-indicator");
            let targetDropPos = null;

            if (dropZone) {
                // ドロップゾーンの位置を取得
                const dropPosAttr = dropZone.getAttribute("data-drop-pos");
                targetDropPos = dropPosAttr ? parseInt(dropPosAttr, 10) : null;
                console.log("Drop zone found with position:", targetDropPos);
            }

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
                    dropPosition: targetDropPos,
                },
                bubbles: true,
                cancelable: true,
            });

            console.log(
                "Dispatching final touch-image-drop event:",
                touchDropEvent.detail,
            ); // デバッグログ
            window.dispatchEvent(touchDropEvent);
            document.dispatchEvent(
                new CustomEvent("touch-image-drop", {
                    detail: touchDropEvent.detail,
                }),
            );
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
        dragPreview.classList.add("image-drag-preview"); // クラスを追加

        updateDragPreview(x, y);
        document.body.appendChild(dragPreview);

        // プレビュー作成直後にアニメーション効果
        requestAnimationFrame(() => {
            if (dragPreview) {
                dragPreview.style.transform = "scale(0.9) rotate(0deg)";
            }
        });
    }

    // ドラッグプレビューの位置を更新
    function updateDragPreview(x: number, y: number) {
        if (!dragPreview) return;

        dragPreview.style.left = `${x - 70}px`; // 中央に配置
        dragPreview.style.top = `${y - 70}px`;
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
    <button
        type="button"
        class="editor-image-button"
        data-selected={selected}
        data-dragging={isDragging}
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
</NodeViewWrapper>

<style>
    /* NodeViewWrapperが生成するdata-node-view-wrapperを縦並び用に調整 */
    :global([data-node-view-wrapper]) {
        display: block;
        width: fit-content;
        padding: 0;
        pointer-events: none;
    }

    /* ProseMirrorが生成する外側のラッパーも制御 */
    :global(.node-image),
    :global(.node-image.svelte-renderer) {
        display: block;
        width: fit-content;
        line-height: 0;
        pointer-events: none;
        margin: 3px 0;
    }

    /* ボタンを画像サイズに完全に合わせる */
    .editor-image-button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: grab;
        display: inline;
        position: relative;
        touch-action: none;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        width: auto;
        height: auto;
        line-height: 0;
        vertical-align: top;
        pointer-events: auto;
    }

    .editor-image-button:active {
        cursor: grabbing;
    }

    /* data属性による状態制御 */
    .editor-image-button[data-selected="true"] .editor-image {
        outline: 2px solid var(--theme, #2196f3);
    }
    .editor-image-button[data-dragging="true"] .editor-image {
        opacity: 0.3;
        outline: 2px solid var(--theme, #2196f3);
        transform: scale(0.95);
        transition: all 0.2s ease;
    }

    /* 画像要素 */
    img.editor-image {
        display: block;
        max-width: 100%;
        max-height: 160px;
        border-radius: 6px;
        box-shadow: 0 1px 4px var(--shadow);
        background: #fff;
        cursor: pointer;
        outline: none;
        transition: opacity 0.2s ease;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        margin: 8px 0;
    }

    /* タッチデバイス用 */
    @media (hover: none) {
        .editor-image-button {
            cursor: default;
        }
        .editor-image-button:active {
            cursor: default;
        }
    }

    /* 改善されたドロップゾーンスタイル（シンプルなバーのみ） */
    :global(.drop-zone-indicator) {
        min-height: 0;
        margin: 0;
        border-radius: 3px;
        opacity: 1;
        position: relative;
        z-index: 1000;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 24px;
        padding: 0;
        background: none;
        border: none;
        box-shadow: none;
    }

    :global(.drop-zone-bar) {
        width: 90%;
        max-width: 240px;
        height: 4px;
        border-radius: 2px;
        background: var(--blue);
        margin: 0 auto;
        box-shadow: 0 1px 4px rgba(33, 150, 243, 0.1);
        transition: background 0.2s ease-out;
    }

    /* より分かりやすいハイライト色（鮮やかな黄色） */
    :global(.drop-zone-hover .drop-zone-bar) {
        background: var(--yellow);
        box-shadow: 0 0 0 3px var(--yellow);
    }

    :global(.image-drag-preview) {
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        opacity: 0.7;
        transform: scale(0.9) rotate(3deg);
        border-radius: 8px;
        max-width: 140px;
        max-height: 140px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        border: 2px solid var(--theme, #2196f3);
        transition: none;
    }
</style>
