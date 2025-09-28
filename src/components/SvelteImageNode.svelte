<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";
    import { onDestroy, onMount } from "svelte";
    import { LONG_PRESS_DELAY, MOVE_CANCEL_THRESHOLD } from "../lib/constants";
    import {
        calculateImageDisplaySize,
        parseDimString,
        getPlaceholderDefaultSize,
    } from "../lib/utils/imageUtils";
    import { imageSizeMapStore } from "../stores/tagsStore.svelte";
    import {
        renderBlurhash as renderBlurhashUtil,
        dispatchDragEvent,
        highlightDropZoneAtPosition,
        createDragPreview,
        updateDragPreview,
        removeDragPreview,
        checkMoveThreshold,
        handleImageInteraction,
    } from "../lib/utils/editorUtils";
    import {
        imageDragState,
        imageSelectionState,
    } from "../stores/editorStore.svelte";
    import { isTouchDevice, blurEditorAndBody } from "../lib/utils/appDomUtils";
    import type { ImageDimensions } from "../lib/types";
    import ContextMenu from "./ContextMenu.svelte";
    import PopupModal from "./PopupModal.svelte";
    import { _ } from "svelte-i18n";
    import {
        getImageContextMenuItems,
        createCloseContextMenuHandler,
        openContextMenuForImageNode, // 追加
    } from "../lib/utils/imageContextMenuUtl";
    import { getEventPosition } from "../lib/utils/appUtils";
    import {
        globalContextMenuStore,
        lastClickPositionStore,
    } from "../stores/appStore.svelte";

    interface Props {
        node: NodeViewProps["node"];
        selected: boolean;
        getPos: NodeViewProps["getPos"];
    }

    let { node, selected, getPos }: Props = $props();

    let dragState = imageDragState;
    let selectionState = imageSelectionState;
    // ローカルに変更
    let isImageLoaded = $state(false);
    let blurhashFadeOut = $state(false);

    // 個別のcanvas要素参照（グローバルストアではなくローカル）
    let localCanvasRef: HTMLCanvasElement | undefined = $state();

    // buttonElementの参照を追加
    let buttonElement: HTMLButtonElement | undefined = $state();

    const isTouchCapable = isTouchDevice();

    const JUST_SELECTED_DURATION = 400; // ms

    // blurhash関連の状態
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

    // コンテキストメニュー関連の状態
    let showContextMenu = $state(false);
    let contextMenuX = $state(0);
    let contextMenuY = $state(0);

    // ストアからクリック位置を取得
    let lastClickPosition = $derived(lastClickPositionStore.value);

    // ノード固有のID（src+posで一意化）
    const nodeId = `${node?.attrs?.src || ""}-${typeof getPos === "function" ? getPos() : ""}`;

    // グローバルストア監視
    $effect(() => {
        globalContextMenuStore.subscribe((state) => {
            // 他ノードでメニューが開かれたら自分のメニューを閉じる
            if (!state.open || state.nodeId !== nodeId) {
                showContextMenu = false;
            }
        });
    });

    // コンテキストメニュー項目（ユーティリティから取得）
    let contextMenuItems = $derived(
        getImageContextMenuItems(
            node?.attrs?.src || "",
            node?.attrs?.alt || "Image",
            getPos,
            node?.nodeSize ?? 1,
            selected,
        ),
    );

    // コンテキストメニューを閉じるハンドラー（ユーティリティから生成）
    let closeContextMenu = $derived(
        createCloseContextMenuHandler((value) => {
            showContextMenu = value;
            if (!value) {
                globalContextMenuStore.set({ open: false, nodeId: undefined });
            }
        }),
    );

    // コンテキストメニューを開く処理（ユーティリティ関数へ移譲）
    function openContextMenuAtPositionHandler() {
        if (!lastClickPosition) return;
        openContextMenuForImageNode(
            globalContextMenuStore,
            nodeId,
            lastClickPosition,
            (v) => (showContextMenu = v),
            (v) => (contextMenuX = v),
            (v) => (contextMenuY = v),
        );
    }

    // ポップアップモーダルの状態を追加
    let showPopupModal = $state(false);
    let popupX = $state(0);
    let popupY = $state(0);
    let popupMessage = $state("");

    // ポップアップを表示するコールバック
    function handleShowPopup(x: number, y: number, message: string) {
        popupX = Number.isFinite(x) ? x : 0;
        popupY = Number.isFinite(y) ? y : 0;
        popupMessage = message;
        showPopupModal = true;
        setTimeout(() => {
            showPopupModal = false;
        }, 1500);
    }

    // 統合されたタップ/クリック処理
    function handleInteraction(
        event: MouseEvent | TouchEvent,
        isTouch = false,
    ) {
        const pos = getEventPosition(event);
        lastClickPositionStore.set(pos); // ストアに保存

        const handled = handleImageInteraction(
            event,
            isTouch,
            dragState.isDragging,
            isPlaceholder,
            selected,
            selectionState.justSelected,
            node.attrs.src,
            node.attrs.alt || "Image",
            getPos,
        );

        if (handled && !selected) {
            // 選択状態の管理
            if (selectionState.justSelectedTimeout) {
                clearTimeout(selectionState.justSelectedTimeout);
            }
            selectionState.justSelected = true;
            selectionState.justSelectedTimeout = setTimeout(() => {
                selectionState.justSelected = false;
                selectionState.justSelectedTimeout = null;
            }, JUST_SELECTED_DURATION);
        }
    }

    // ドラッグ関連の統合処理（簡略化）
    function startDrag() {
        dragState.isDragging = true;
        dispatchDragEvent("start", {}, getPos);
        dragState.preview = createDragPreview(
            dragState.startTarget!,
            dragState.startPos.x,
            dragState.startPos.y,
            isPlaceholder,
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
            startDrag();
        }, LONG_PRESS_DELAY);
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
        // クリック位置でコンテキストメニューを開く
        openContextMenuAtPositionHandler();
    }

    function handleDragRelatedEvent(type: "start" | "end", event?: Event) {
        if (type === "start") {
            const dragEvent = event as DragEvent;
            if (!dragEvent?.dataTransfer && !isTouchCapable) return;
            if (isTouchCapable) {
                event?.preventDefault();
                return;
            }

            if (dragEvent?.dataTransfer) {
                dragEvent.dataTransfer.setData(
                    "application/x-tiptap-node",
                    JSON.stringify({
                        type: "image",
                        attrs: node.attrs,
                        pos: getPos(),
                    }),
                );
                dragEvent.dataTransfer.effectAllowed = "move";
            }
            dragState.isDragging = true;
            dispatchDragEvent("start");
        } else {
            dragState.isDragging = false;
            removeDragPreview(dragState.preview);
            dispatchDragEvent("end");
        }
    }

    // タッチイベントハンドラー（能動的なイベントリスナーで処理）
    function handleTouchStartActive(event: TouchEvent) {
        if (event.touches.length !== 1) return;

        // タッチ開始時にキーボードを隠す
        blurEditorAndBody();

        const pos = getEventPosition(event);
        lastClickPositionStore.set(pos); // ストアに保存
        startLongPress(event.currentTarget as HTMLElement, pos.x, pos.y);
    }

    function handleTouchMoveActive(event: TouchEvent) {
        if (event.touches.length !== 1) {
            clearLongPress();
            return;
        }

        const pos = getEventPosition(event);

        // 長押し前で移動距離が閾値を超えたらキャンセル
        if (!dragState.isDragging && dragState.longPressTimeout) {
            if (
                checkMoveThreshold(
                    pos.x,
                    pos.y,
                    dragState.startPos.x,
                    dragState.startPos.y,
                    MOVE_CANCEL_THRESHOLD,
                )
            ) {
                clearLongPress();
                return;
            }
        }

        if (!dragState.isDragging) return;

        event.preventDefault();
        updateDragPreview(dragState.preview, pos.x, pos.y);
        highlightDropZoneAtPosition(pos.x, pos.y);

        dispatchDragEvent("move", {
            touchX: pos.x,
            touchY: pos.y,
            nodePos: getPos(),
        });
    }

    function handleTouchEndActive(event: TouchEvent) {
        if (dragState.longPressTimeout) {
            clearLongPress();
            if (!dragState.isDragging) {
                // 通常のタップ処理（キーボードは既にblurEditorAndBodyで隠されている）
                handleInteraction(event, true);
                // タップ位置でコンテキストメニューを開く
                openContextMenuAtPositionHandler();
                return;
            }
        }

        if (!dragState.isDragging) return;

        event.preventDefault();
        const pos = getEventPosition(event);
        const elementBelow = document.elementFromPoint(pos.x, pos.y);

        if (elementBelow) {
            const dropZone = elementBelow.closest(".drop-zone-indicator");
            const targetDropPos = dropZone?.getAttribute("data-drop-pos");

            dispatchDragEvent("end", {
                nodeData: { type: "image", attrs: node.attrs, pos: getPos() },
                dropX: pos.x,
                dropY: pos.y,
                target: elementBelow,
                dropPosition: targetDropPos
                    ? parseInt(targetDropPos, 10)
                    : null,
            });
        }

        dragState.isDragging = false;
        removeDragPreview(dragState.preview);
        dragState.preview = null;
    }

    function preventContextMenu(event: Event) {
        event.preventDefault();
    }

    onMount(() => {
        if (node.attrs.blurhash && localCanvasRef) {
            renderBlurhashUtil(
                node.attrs.blurhash,
                localCanvasRef,
                imageDimensions || getPlaceholderDefaultSize(),
                isPlaceholder,
                devMode,
            );
        }

        // タッチデバイスの場合は能動的なイベントリスナーを追加
        if (isTouchCapable && buttonElement) {
            buttonElement.addEventListener(
                "touchstart",
                handleTouchStartActive,
                { passive: false },
            );
            buttonElement.addEventListener("touchmove", handleTouchMoveActive, {
                passive: false,
            });
            buttonElement.addEventListener("touchend", handleTouchEndActive, {
                passive: false,
            });
        }
    });

    $effect(() => {
        // previewモードでもログ出力するように修正

        if (node.attrs.blurhash && localCanvasRef) {
            renderBlurhashUtil(
                node.attrs.blurhash,
                localCanvasRef,
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
        removeDragPreview(dragState.preview);
        // コンテキストメニューを閉じる
        globalContextMenuStore.set({ open: false, nodeId: undefined });

        // タッチイベントリスナーを削除
        if (isTouchCapable && buttonElement) {
            buttonElement.removeEventListener(
                "touchstart",
                handleTouchStartActive,
            );
            buttonElement.removeEventListener(
                "touchmove",
                handleTouchMoveActive,
            );
            buttonElement.removeEventListener("touchend", handleTouchEndActive);
        }

        // 状態ストア初期化
        Object.assign(imageDragState, {
            isDragging: false,
            longPressTimeout: null,
            startTarget: null,
            preview: null,
        });
        Object.assign(imageSelectionState, {
            justSelected: false,
            justSelectedTimeout: null,
        });
        localCanvasRef = undefined;
    });
</script>

<NodeViewWrapper>
    <button
        bind:this={buttonElement}
        type="button"
        class="editor-image-button"
        data-highlighted={selected}
        data-dragging={dragState.isDragging}
        onclick={handleClick}
        tabindex="0"
        aria-label={node?.attrs?.alt || "Image"}
        draggable={!isTouchCapable}
        ondragstart={(e) => handleDragRelatedEvent("start", e)}
        ondragend={() => handleDragRelatedEvent("end")}
        ondragover={isTouchCapable ? (e) => e.preventDefault() : undefined}
        ondrop={isTouchCapable ? (e) => e.preventDefault() : undefined}
    >
        {#if showBlurhash}
            <canvas
                bind:this={localCanvasRef}
                class="blurhash-canvas"
                class:is-placeholder={isPlaceholder}
                class:fade-out={isImageLoaded &&
                    blurhashFadeOut &&
                    showActualImage}
            ></canvas>
        {/if}
        {#if showActualImage}
            <img
                src={node?.attrs?.src}
                alt={node?.attrs?.alt || ""}
                class="editor-image"
                class:image-loading={!isImageLoaded}
                draggable="false"
                onload={handleImageLoad}
                onerror={handleImageError}
                oncontextmenu={preventContextMenu}
                style="z-index:2; position:relative;"
            />
        {/if}
    </button>

    {#if showContextMenu}
        <ContextMenu
            x={contextMenuX}
            y={contextMenuY}
            items={contextMenuItems}
            onClose={closeContextMenu}
            onShowPopup={handleShowPopup}
        />
    {/if}

    {#if showPopupModal}
        <PopupModal
            show={showPopupModal}
            x={popupX}
            y={popupY}
            onClose={() => {
                showPopupModal = false;
            }}
        >
            <div class="copy-success-message">
                {popupMessage}
            </div>
        </PopupModal>
    {/if}
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
        max-height: 240px;
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
        touch-action: pan-y; /* 垂直スクロールを許可し、水平ドラッグはJavaScriptで制御 */
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
        max-width: 100%;
        max-height: 240px;
        line-height: 0;
        vertical-align: top;
        pointer-events: auto;
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

    /* 統合されたハイライト状態 */
    .editor-image-button[data-highlighted="true"] .editor-image,
    .editor-image-button[data-highlighted="true"]
        .blurhash-canvas.is-placeholder {
        outline: 2px solid var(--theme, #2196f3);
        outline-offset: -1px;
    }

    /* ドラッグ状態での追加スタイル */
    .editor-image-button[data-dragging="true"] .editor-image,
    .editor-image-button[data-dragging="true"] .blurhash-canvas.is-placeholder {
        opacity: 0.3;
        transform: scale(0.95);
        transition: all 0.2s ease;
    }

    /* blurhash関連スタイル（統合済み） */
    .blurhash-canvas {
        border-radius: 6px;
        object-fit: cover;
        z-index: 1;
        opacity: 0.8;
        filter: blur(1px);
        transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 100%;
        max-height: 240px;

        &:not(.is-placeholder) {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        &.is-placeholder {
            position: relative;
            border: 1px solid var(--border);
            opacity: 1;
            filter: blur(0.5px);
        }

        &.fade-out {
            opacity: 0;
            pointer-events: none;
        }
    }

    /* 画像要素 */
    img.editor-image {
        display: block;
        max-width: 100%;
        max-height: 240px;
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

        &.image-loading {
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        &:not(.image-loading) {
            opacity: 1;
        }
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
        width: 100%;
        height: fit-content;
        padding: 10px 0;
        background: none;
        border: none;
        box-shadow: none;
    }

    :global(.drop-zone-bar) {
        width: 90%;
        max-width: 260px;
        height: 6px;
        border-radius: 9999px;
        background: var(--blue);
        margin: 0 auto;
    }

    :global(.drop-zone-hover .drop-zone-bar) {
        background: var(--yellow);
        outline: 2px solid var(--yellow);
    }

    /* ドラッグプレビュー用のクラス */
    :global(.drag-preview) {
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transform-origin: center center;
        transition:
            transform 120ms ease,
            opacity 120ms ease;
        border-radius: 6px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        background: white;
    }
</style>
