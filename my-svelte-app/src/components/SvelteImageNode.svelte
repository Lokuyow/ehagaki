<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";
    import { onDestroy, onMount } from "svelte";
    import { LONG_PRESS_DELAY, MOVE_CANCEL_THRESHOLD } from "../lib/constants";
    import {
        calculateImageDisplaySize,
        parseDimString,
        getPlaceholderDefaultSize,
        type ImageDimensions,
    } from "../lib/imageUtils";
    import { imageSizeMapStore } from "../lib/tags/tags.svelte";
    import {
        blurEditorAndBody as blurEditorAndBodyUtil,
        requestFullscreenImage as requestFullscreenImageUtil,
        requestNodeSelection as requestNodeSelectionUtil,
        renderBlurhash as renderBlurhashUtil,
    } from "../lib/editor/editorUtils";

    interface Props {
        node: NodeViewProps["node"];
        selected: boolean;
        getPos: NodeViewProps["getPos"];
    }

    let { node, selected, getPos }: Props = $props();

    // 状態管理の統合
    let dragState = $state({
        isDragging: false,
        startPos: { x: 0, y: 0 },
        longPressTimeout: null as ReturnType<typeof setTimeout> | null,
        startTarget: null as HTMLElement | null,
        preview: null as HTMLElement | null,
    });

    // 選択状態管理の統合
    let selectionState = $state({
        justSelected: false,
        justSelectedTimeout: null as ReturnType<typeof setTimeout> | null,
    });

    // Detect if the device is touch-capable
    const isTouchDevice =
        typeof window !== "undefined" &&
        ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const JUST_SELECTED_DURATION = 400; // ms

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

    // 画像サイズ関連の状態
    let imageDimensions = $state<ImageDimensions | null>(null);

    const devMode = import.meta.env.MODE === "development";

    // 画像サイズを計算・取得
    $effect(() => {
        const imageUrl = node.attrs.src;
        if (!imageUrl) return;

        // ストアから既存のサイズ情報を確認
        const storedSize = imageSizeMapStore.value[imageUrl];
        if (storedSize) {
            imageDimensions = storedSize;
            return;
        }

        // dimストリングから元画像サイズを取得
        const dimParsed = parseDimString(node.attrs.dim);
        if (dimParsed) {
            const calculated = calculateImageDisplaySize(
                dimParsed.width,
                dimParsed.height,
            );
            imageDimensions = calculated;

            // ストアに保存
            imageSizeMapStore.update((map) => ({
                ...map,
                [imageUrl]: calculated,
            }));
        } else if (isPlaceholder) {
            // プレースホルダーの場合はデフォルトサイズ
            imageDimensions = getPlaceholderDefaultSize();
        }
    });

    // 統合されたタップ/クリック処理
    function handleInteraction(
        event: MouseEvent | TouchEvent,
        isTouch = false,
    ) {
        // ドラッグ中やプレースホルダーの場合は何もしない
        if (dragState.isDragging || isPlaceholder) {
            event.preventDefault();
            return;
        }

        // 直前の選択による抑制期間中はクリックを無視
        if (selectionState.justSelected && !isTouch) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        if (selected) {
            // 既に選択済みなら全画面表示
            requestFullscreenImageUtil(
                node.attrs.src,
                node.attrs.alt || "Image",
            );
        } else {
            // 未選択なら選択要求
            requestNodeSelectionUtil(getPos);
            if (selectionState.justSelectedTimeout) {
                clearTimeout(selectionState.justSelectedTimeout);
            }
            selectionState.justSelected = true;
            selectionState.justSelectedTimeout = setTimeout(() => {
                selectionState.justSelected = false;
                selectionState.justSelectedTimeout = null;
            }, JUST_SELECTED_DURATION);
        }

        event.preventDefault();
        if (!isTouch) {
            event.stopPropagation();
        }
    }

    // ドラッグ関連の統合処理
    function dispatchDragEvent(type: "start" | "move" | "end", details?: any) {
        const eventMap = {
            start: "touch-image-drag-start",
            move: "touch-image-drag-move",
            end: "touch-image-drop",
        };

        const eventDetails = {
            start: { nodePos: getPos() },
            move: details,
            end: {
                nodeData: { type: "image", attrs: node.attrs, pos: getPos() },
                dropX: 0,
                dropY: 0,
                target: null,
                dropPosition: null,
                ...details,
            },
        };

        const customEvent = new CustomEvent(eventMap[type], {
            detail: eventDetails[type],
            bubbles: true,
            cancelable: true,
        });

        window.dispatchEvent(customEvent);
        document.dispatchEvent(
            new CustomEvent(eventMap[type], { detail: customEvent.detail }),
        );
    }

    function clearLongPress() {
        if (dragState.longPressTimeout) {
            clearTimeout(dragState.longPressTimeout);
            dragState.longPressTimeout = null;
        }
        dragState.startTarget = null;
    }

    function startLongPress(element: HTMLElement, x: number, y: number) {
        clearLongPress();
        dragState.startPos = { x, y };
        dragState.startTarget = element;

        dragState.longPressTimeout = setTimeout(() => {
            blurEditorAndBodyUtil();
            dragState.isDragging = true;
            dispatchDragEvent("start");
            createDragPreview(element, x, y);
        }, LONG_PRESS_DELAY);
    }

    function checkMoveThreshold(x: number, y: number): boolean {
        const dx = x - dragState.startPos.x;
        const dy = y - dragState.startPos.y;
        return (
            dx * dx + dy * dy > MOVE_CANCEL_THRESHOLD * MOVE_CANCEL_THRESHOLD
        );
    }

    // 画像読み込み完了時の処理
    function handleImageLoad() {
        isImageLoaded = true;
        blurhashFadeOut = true;
        setTimeout(() => {
            blurhashFadeOut = false;
        }, 400); // CSSアニメーションと合わせる
    }

    // 画像読み込みエラー時の処理
    function handleImageError() {
        isImageLoaded = false;
    }

    // イベントハンドラー
    function handleClick(event: MouseEvent) {
        handleInteraction(event, false);
    }

    function handleDragStart(event: DragEvent) {
        if (!event.dataTransfer) return;
        if (isTouchDevice) {
            event.preventDefault();
            return;
        }

        event.dataTransfer.setData(
            "application/x-tiptap-node",
            JSON.stringify({
                type: "image",
                attrs: node.attrs,
                pos: getPos(),
            }),
        );
        event.dataTransfer.effectAllowed = "move";
        dragState.isDragging = true;
        dispatchDragEvent("start");
    }

    function handleDragEnd() {
        dragState.isDragging = false;
        removeDragPreview();
        dispatchDragEvent("end");
    }

    function handleTouchStart(event: TouchEvent) {
        if (event.touches.length !== 1) return;

        const touch = event.touches[0];
        startLongPress(
            event.currentTarget as HTMLElement,
            touch.clientX,
            touch.clientY,
        );
    }

    function handleTouchMove(event: TouchEvent) {
        if (event.touches.length !== 1) {
            clearLongPress();
            return;
        }

        const touch = event.touches[0];

        // 長押し前で移動距離が閾値を超えたらキャンセル
        if (!dragState.isDragging && dragState.longPressTimeout) {
            if (checkMoveThreshold(touch.clientX, touch.clientY)) {
                clearLongPress();
                return;
            }
        }

        if (!dragState.isDragging) return;

        event.preventDefault();
        updateDragPreview(touch.clientX, touch.clientY);
        highlightDropZoneAtPosition(touch.clientX, touch.clientY);

        dispatchDragEvent("move", {
            touchX: touch.clientX,
            touchY: touch.clientY,
            nodePos: getPos(),
        });
    }

    function handleTouchEnd(event: TouchEvent) {
        if (dragState.longPressTimeout) {
            clearLongPress();
            if (!dragState.isDragging) {
                // 通常のタップ処理
                handleInteraction(event, true);
                return;
            }
        }

        if (!dragState.isDragging) return;

        event.preventDefault();
        const touch = event.changedTouches[0];
        const elementBelow = document.elementFromPoint(
            touch.clientX,
            touch.clientY,
        );

        if (elementBelow) {
            const dropZone = elementBelow.closest(".drop-zone-indicator");
            const targetDropPos = dropZone?.getAttribute("data-drop-pos");

            dispatchDragEvent("end", {
                dropX: touch.clientX,
                dropY: touch.clientY,
                target: elementBelow,
                dropPosition: targetDropPos
                    ? parseInt(targetDropPos, 10)
                    : null,
            });
        }

        dragState.isDragging = false;
        removeDragPreview();
    }

    function handleContextMenu(event: Event) {
        event.preventDefault();
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

    // ドラッグプレビューを作成
    function createDragPreview(element: HTMLElement, x: number, y: number) {
        removeDragPreview();

        const rect = element.getBoundingClientRect();
        const MAX_PREVIEW = 140;
        const previewWidth = Math.min(MAX_PREVIEW, rect.width || MAX_PREVIEW);
        const previewHeight =
            rect.width > 0
                ? Math.round((rect.height / rect.width) * previewWidth)
                : previewWidth;

        let previewEl: HTMLElement | null = null;

        if (isPlaceholder) {
            const origCanvas = element.querySelector(
                "canvas",
            ) as HTMLCanvasElement | null;
            if (!origCanvas) return;
            const newCanvas = document.createElement("canvas");
            newCanvas.width = origCanvas.width;
            newCanvas.height = origCanvas.height;
            const ctx = newCanvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(origCanvas, 0, 0);
            }
            previewEl = newCanvas;
        } else {
            const origImg = element.querySelector(
                "img",
            ) as HTMLImageElement | null;
            if (!origImg) return;
            const newImg = document.createElement("img");
            newImg.src = origImg.src;
            newImg.alt = origImg.alt || "";
            previewEl = newImg;
        }

        previewEl.classList.add("drag-preview");
        previewEl.style.width = `${previewWidth}px`;
        previewEl.style.height = `${previewHeight}px`;
        previewEl.style.left = `${x - previewWidth / 2}px`;
        previewEl.style.top = `${y - previewHeight / 2}px`;
        previewEl.style.transformOrigin = "center center";
        previewEl.style.transition = "transform 120ms ease, opacity 120ms ease";

        dragState.preview = previewEl;
        document.body.appendChild(dragState.preview);

        requestAnimationFrame(() => {
            if (dragState.preview) {
                dragState.preview.style.transform = "scale(0.8) rotate(0deg)";
                dragState.preview.style.opacity = "0.95";
            }
        });
    }

    // ドラッグプレビューの位置を更新
    function updateDragPreview(x: number, y: number) {
        if (!dragState.preview) return;

        const rect = dragState.preview.getBoundingClientRect();
        const w = rect.width || 100;
        const h = rect.height || 100;

        dragState.preview.style.left = `${x - w / 2}px`;
        dragState.preview.style.top = `${y - h / 2}px`;
    }

    // ドラッグプレビューを削除
    function removeDragPreview() {
        if (dragState.preview?.parentNode) {
            dragState.preview.parentNode.removeChild(dragState.preview);
            dragState.preview = null;
        }
    }

    onMount(() => {
        if (node.attrs.blurhash && canvasRef) {
            renderBlurhashUtil(
                node.attrs.blurhash,
                canvasRef,
                imageDimensions || getPlaceholderDefaultSize(),
                isPlaceholder,
                devMode,
            );
        }
    });

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
            renderBlurhashUtil(
                node.attrs.blurhash,
                canvasRef,
                imageDimensions || getPlaceholderDefaultSize(),
                isPlaceholder,
                devMode,
            );
        }
    });

    onDestroy(() => {
        clearLongPress();
        if (selectionState.justSelectedTimeout) {
            clearTimeout(selectionState.justSelectedTimeout);
        }
        removeDragPreview();
    });
</script>

<NodeViewWrapper>
    <button
        type="button"
        class="editor-image-button"
        data-selected={selected}
        data-dragging={dragState.isDragging}
        onclick={handleClick}
        tabindex="0"
        aria-label={node.attrs.alt || "Image"}
        draggable={!isTouchDevice}
        ondragstart={isTouchDevice
            ? (e) => e.preventDefault()
            : handleDragStart}
        ondragend={isTouchDevice ? undefined : handleDragEnd}
        ondragover={isTouchDevice ? (e) => e.preventDefault() : undefined}
        ondrop={isTouchDevice ? (e) => e.preventDefault() : undefined}
        ontouchstart={handleTouchStart}
        ontouchmove={handleTouchMove}
        ontouchend={handleTouchEnd}
        oncontextmenu={handleContextMenu}
    >
        {#if showBlurhash}
            <canvas
                bind:this={canvasRef}
                width={imageDimensions?.displayWidth ||
                    getPlaceholderDefaultSize().displayWidth}
                height={imageDimensions?.displayHeight ||
                    getPlaceholderDefaultSize().displayHeight}
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
                style="z-index:2; position:relative; {imageDimensions
                    ? `width: ${imageDimensions.displayWidth}px; height: ${imageDimensions.displayHeight}px;`
                    : ''}"
            />
        {/if}
    </button>
</NodeViewWrapper>

<style>
    /* NodeViewWrapperが生成するdata-node-view-wrapperを縦並び用に調整 */
    :global([data-node-view-wrapper]) {
        display: block;
        width: 100%;
        padding: 0;
        pointer-events: none;
    }

    /* ProseMirrorが生成する外側のラッパーも制御 */
    :global(.node-image),
    :global(.node-image.svelte-renderer) {
        display: block;
        max-width: 100%;
        max-height: 240px; /* この値をimageUtils.tsの制約と一致させる */
        line-height: 0;
        pointer-events: none;
        margin: 8px 0;
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
        max-width: 100%;
        max-height: 240px; /* この値をimageUtils.tsの制約と一致させる */
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
            transform: scale(0.99);
            transition: transform 0.1s cubic-bezier(0, 1, 0.5, 1);
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
        max-width: 100%;
        max-height: 240px; /* この値をimageUtils.tsの制約と一致させる */
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
        border: 1px solid var(--border);
        opacity: 1;
        filter: blur(0.5px);
    }

    /* 画像要素 */
    img.editor-image {
        display: block;
        max-width: 100%;
        max-height: 240px; /* この値をimageUtils.tsの制約と一致させる */
        width: auto;
        border: 1px solid var(--border);
        border-radius: 6px;
        cursor: pointer;
        outline: none;
        transition: opacity 0.2s ease;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
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

    /* ドラッグプレビュー用のクラス */
    :global(.drag-preview) {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        /* width, height, left, top, transform, opacity はJSで動的に設定 */
        /* transform-origin, transition もJSで上書きされるが、念のため記述 */
        transform-origin: center center;
        transition:
            transform 120ms ease,
            opacity 120ms ease;
        border-radius: 6px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        background: white;
    }
</style>
