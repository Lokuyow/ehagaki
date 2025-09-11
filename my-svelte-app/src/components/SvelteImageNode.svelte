<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";
    import { onDestroy, onMount } from "svelte";
    import { LONG_PRESS_DELAY, MOVE_CANCEL_THRESHOLD } from "../lib/constants";
    import { renderBlurhashToCanvas } from "../lib/imeta";

    interface Props {
        node: NodeViewProps["node"];
        selected: boolean;
        getPos: NodeViewProps["getPos"];
    }

    let { node, selected, getPos }: Props = $props();

    let isDragging = $state(false);
    let touchStartPos = { x: 0, y: 0 };
    let dragPreview: HTMLElement | null = null;

    let longPressTimeout: ReturnType<typeof setTimeout> | null = null;
    let touchStartTarget: HTMLElement | null = null;

    // blurhash関連の状態
    let isImageLoaded = $state(false);
    let blurhashFadeOut = $state(false);
    let canvasRef: HTMLCanvasElement | undefined = $state();
    let isPlaceholder = $derived(
        node.attrs.isPlaceholder === true ||
            (node.attrs.src && node.attrs.src.startsWith("placeholder-")),
    );
    let showActualImage = $derived(
        !isPlaceholder &&
            node.attrs.src &&
            !node.attrs.src.startsWith("placeholder-"),
    );
    let showBlurhash = $derived(
        node.attrs.blurhash &&
            (isPlaceholder || !isImageLoaded || blurhashFadeOut),
    );

    const devMode = import.meta.env.MODE === "development";

    // blurhashをcanvasに描画
    function renderBlurhash() {
        if (!node.attrs.blurhash || !canvasRef) {
            if (devMode) {
                console.log(
                    "[blurhash] renderBlurhash: blurhash or canvasRef missing",
                    {
                        blurhash: node.attrs.blurhash,
                        canvasRef: !!canvasRef,
                        isPlaceholder,
                        showBlurhash,
                    },
                );
            }
            return;
        }

        // プレースホルダーの場合は適切なサイズで描画
        const width = isPlaceholder ? 200 : 100;
        const height = isPlaceholder ? 150 : 100;

        canvasRef.width = width;
        canvasRef.height = height;

        if (devMode) {
            console.log("[blurhash] renderBlurhash: rendering", {
                blurhash: node.attrs.blurhash,
                width,
                height,
                isPlaceholder,
            });
        }

        const success = renderBlurhashToCanvas(
            node.attrs.blurhash,
            canvasRef,
            width,
            height,
        );
        if (devMode) {
            console.log("[blurhash] renderBlurhash: result", success);
        }
    } // 画像読み込み完了時の処理
    function handleImageLoad() {
        isImageLoaded = true;
        // blurhashキャンバスをフェードアウト
        blurhashFadeOut = true;
        setTimeout(() => {
            blurhashFadeOut = false;
        }, 400); // CSSアニメーションと合わせる
    }

    // 画像読み込みエラー時の処理
    function handleImageError() {
        isImageLoaded = false;
    }

    onMount(() => {
        if (node.attrs.blurhash && canvasRef) {
            renderBlurhash();
        }
    });

    // blurhashが変更された時の再描画
    $effect(() => {
        if (devMode) {
            console.log(
                "[blurhash] $effect: blurhash=",
                node.attrs.blurhash,
                "canvasRef=",
                !!canvasRef,
            );
        }
        if (node.attrs.blurhash && canvasRef) {
            renderBlurhash();
        }
    });

    // 画像クリック時の例（必要に応じて拡張）
    function handleClick(event: MouseEvent) {
        // ドラッグ中の場合はクリックを無視
        if (isDragging) {
            event.preventDefault();
            return;
        }

        // プレースホルダーの場合は全画面表示を無効化
        if (isPlaceholder) {
            event.preventDefault();
            return;
        }

        // エディターからフォーカスを外す（キーボードを隠す）
        const editorElement = document.querySelector(
            ".tiptap-editor",
        ) as HTMLElement;
        if (editorElement) {
            editorElement.blur();
        }

        // body要素にフォーカスを移す（より確実にキーボードを隠す）
        document.body.focus();

        // 全画面表示イベントを発火
        const fullscreenEvent = new CustomEvent("image-fullscreen-request", {
            detail: {
                src: node.attrs.src,
                alt: node.attrs.alt || "Image",
            },
            bubbles: true,
            cancelable: true,
        });

        window.dispatchEvent(fullscreenEvent);
        event.preventDefault();
        event.stopPropagation();
    }

    // ドラッグ開始イベント発火
    function dispatchDragStart() {
        const startEvent = new CustomEvent("touch-image-drag-start", {
            detail: { nodePos: getPos() },
            bubbles: true,
            cancelable: true,
        });

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

        const touch = event.touches[0];
        touchStartPos = { x: touch.clientX, y: touch.clientY };
        touchStartTarget = event.currentTarget as HTMLElement;

        // 長押しタイマーをセット
        longPressTimeout = setTimeout(() => {
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
        // 長押し前で一定距離移動したら長押しをキャンセル
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

        // ホバー中のドロップゾーンをハイライト
        highlightDropZoneAtPosition(touch.clientX, touch.clientY);

        // 自動スクロール用のイベントを発火
        const moveEvent = new CustomEvent("touch-image-drag-move", {
            detail: {
                touchX: touch.clientX,
                touchY: touch.clientY,
                nodePos: getPos(),
            },
            bubbles: true,
            cancelable: true,
        });

        window.dispatchEvent(moveEvent);
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
        // 長押しタイマーが残っていればクリア
        if (longPressTimeout) {
            clearTimeout(longPressTimeout);
            longPressTimeout = null;
            touchStartTarget = null;

            // 長押しでない通常のタップの場合、エディターのフォーカスを外す
            if (!isDragging) {
                const editorElement = document.querySelector(
                    ".tiptap-editor",
                ) as HTMLElement;
                if (editorElement) {
                    editorElement.blur();
                }
                document.body.focus();
            }
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
            // ドロップゾーンかその子要素を探す
            const dropZone = elementBelow.closest(".drop-zone-indicator");
            let targetDropPos = null;

            if (dropZone) {
                // ドロップゾーンの位置を取得
                const dropPosAttr = dropZone.getAttribute("data-drop-pos");
                targetDropPos = dropPosAttr ? parseInt(dropPosAttr, 10) : null;
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
        if (isPlaceholder) {
            // プレースホルダーの場合はcanvasを使用
            const canvas = element.querySelector("canvas");
            if (!canvas) return;

            dragPreview = canvas.cloneNode(true) as HTMLElement;
        } else {
            // 通常の画像の場合
            const img = element.querySelector("img");
            if (!img) return;

            dragPreview = img.cloneNode(true) as HTMLElement;
        }

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
        onclick={handleClick}
        tabindex="0"
        aria-label={node.attrs.alt || "Image"}
        draggable="true"
        ondragstart={handleDragStart}
        ondragend={handleDragEnd}
        ontouchstart={handleTouchStart}
        ontouchmove={handleTouchMove}
        ontouchend={handleTouchEnd}
        oncontextmenu={handleContextMenu}
    >
        {#if showBlurhash}
            <canvas
                bind:this={canvasRef}
                width={isPlaceholder ? 200 : 100}
                height={isPlaceholder ? 150 : 100}
                class="blurhash-canvas"
                class:is-placeholder={isPlaceholder}
                class:fade-out={isImageLoaded &&
                    blurhashFadeOut &&
                    showActualImage}
            ></canvas>
        {/if}
        {#if showActualImage}
            <img
                src={node.attrs.src}
                alt={node.attrs.alt || ""}
                class="editor-image"
                class:image-loading={!isImageLoaded}
                draggable="false"
                onload={handleImageLoad}
                onerror={handleImageError}
                oncontextmenu={handleContextMenu}
                style="z-index:2; position:relative;"
            />
        {/if}
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
        /* フォーカス時のアウトラインを無効化 */
        outline: none;
        -webkit-tap-highlight-color: transparent;

        &:focus {
            outline: none;
        }
        &:active {
            transform: scale(0.98);
        }
    }

    /* data属性による状態制御 */
    .editor-image-button[data-selected="true"] .editor-image {
        outline: 2px solid var(--theme, #2196f3);
        outline-offset: -1px;
    }
    .editor-image-button[data-dragging="true"] .editor-image {
        opacity: 0.3;
        outline: 2px solid var(--theme, #2196f3);
        outline-offset: -1px;
        transform: scale(0.95);
        transition: all 0.2s ease;
    }

    /* プレースホルダー選択時の状態制御 */
    .editor-image-button[data-selected="true"] .blurhash-canvas.is-placeholder {
        outline: 2px solid var(--theme, #2196f3);
        outline-offset: -1px;
    }
    .editor-image-button[data-dragging="true"] .blurhash-canvas.is-placeholder {
        opacity: 0.3;
        outline: 2px solid var(--theme, #2196f3);
        outline-offset: -1px;
        transform: scale(0.95);
        transition: all 0.2s ease;
    }

    /* blurhashキャンバス */
    .blurhash-canvas {
        border-radius: 6px;
        object-fit: cover;
        z-index: 1;
        opacity: 0.8;
        filter: blur(1px);
        transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* 実際の画像に重なるblurhashキャンバス */
    .blurhash-canvas:not(.is-placeholder) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .blurhash-canvas.fade-out {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* プレースホルダー時のblurhashキャンバス */
    .blurhash-canvas.is-placeholder {
        position: relative;
        width: 200px;
        height: 150px;
        border: 1px solid var(--border);
        margin: 8px 0;
        opacity: 1;
        filter: blur(0.5px);
    }

    /* 画像要素 */
    img.editor-image {
        display: block;
        max-width: 100%;
        max-height: 240px;
        border: 1px solid var(--border);
        border-radius: 6px;
        cursor: pointer;
        outline: none;
        transition: opacity 0.2s ease;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        margin: 8px 0;
        position: relative;
        z-index: 2;
    }

    /* 画像ローディング状態 */
    img.editor-image.image-loading {
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    /* 画像がロードされた時のフェードイン */
    img.editor-image:not(.image-loading) {
        opacity: 1;
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
