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

        console.log("Touch start on image"); // デバッグログ
        const touch = event.touches[0];
        touchStartPos = { x: touch.clientX, y: touch.clientY };
        touchStartTarget = event.currentTarget as HTMLElement;
        // 長押しタイマーをセット（発火時にドラッグ開始）
        longPressTimeout = setTimeout(() => {
            console.log("Long press detected, starting drag"); // デバッグログ
            // 長押しとして確定
            isDragging = true;

            // ドラッグ開始イベントを発火（ドロップゾーン表示用）
            const dragStartEvent = new CustomEvent("touch-image-drag-start", {
                detail: { nodePos: getPos() },
            });
            console.log(
                "Dispatching touch-image-drag-start event:",
                dragStartEvent.detail,
            ); // デバッグログ
            window.dispatchEvent(dragStartEvent);

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
                    dropPosition: targetDropPos, // 明示的なドロップ位置を追加
                },
            });
            console.log(
                "Dispatching touch-image-drop event:",
                touchDropEvent.detail,
            ); // デバッグログ
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
        dragPreview.style.zIndex = "10000";
        dragPreview.style.opacity = "0.8";
        dragPreview.style.transform = "scale(0.9) rotate(3deg)";
        dragPreview.style.borderRadius = "8px";
        dragPreview.style.maxWidth = "140px";
        dragPreview.style.maxHeight = "140px";
        dragPreview.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
        dragPreview.style.border = "2px solid var(--theme, #2196f3)";
        dragPreview.style.transition = "none";

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

    /* 改善されたドロップゾーンスタイル */
    :global(.drop-zone-indicator) {
        min-height: 40px;
        margin: 12px 0;
        border-radius: 8px;
        opacity: 0.9;
        position: relative;
        z-index: 1000;
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* トップドロップゾーン（最初に挿入） */
    :global(.drop-zone-top) {
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        border: 2px dashed #2e7d32;
        animation: dropZonePulseGreen 2s ease-in-out infinite;
    }

    /* 間のドロップゾーン */
    :global(.drop-zone-between) {
        background: linear-gradient(
            135deg,
            var(--theme, #2196f3) 0%,
            #1976d2 100%
        );
        border: 2px dashed #1565c0;
        animation: dropZonePulseBlue 2s ease-in-out infinite;
    }

    /* ホバー状態 */
    :global(.drop-zone-hover) {
        transform: scale(1.05);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        animation: dropZoneHighlight 0.6s ease-in-out infinite alternate;
    }

    /* ドロップゾーンの内容 */
    :global(.drop-zone-content) {
        display: flex;
        align-items: center;
        gap: 12px;
        color: white;
        font-weight: 600;
        font-size: 14px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        padding: 8px 16px;
    }

    /* 矢印 */
    :global(.drop-zone-arrow) {
        font-size: 18px;
        font-weight: bold;
        animation: arrowBounce 1.5s ease-in-out infinite;
    }

    /* テキスト */
    :global(.drop-zone-text) {
        flex: 1;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
    }

    /* アニメーション */
    @keyframes dropZonePulseBlue {
        0%,
        100% {
            opacity: 0.7;
            border-color: #1565c0;
        }
        50% {
            opacity: 1;
            border-color: #42a5f5;
        }
    }

    @keyframes dropZonePulseGreen {
        0%,
        100% {
            opacity: 0.7;
            border-color: #2e7d32;
        }
        50% {
            opacity: 1;
            border-color: #66bb6a;
        }
    }

    @keyframes dropZoneHighlight {
        0% {
            box-shadow: 0 8px 25px rgba(255, 193, 7, 0.4);
        }
        100% {
            box-shadow: 0 12px 35px rgba(255, 193, 7, 0.7);
        }
    }

    @keyframes arrowBounce {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-3px);
        }
    }

    /* レスポンシブ対応 */
    @media (max-width: 480px) {
        :global(.drop-zone-content) {
            font-size: 12px;
            gap: 8px;
            padding: 6px 12px;
        }

        :global(.drop-zone-text) {
            max-width: 150px;
        }

        :global(.drop-zone-arrow) {
            font-size: 16px;
        }
    }
</style>
