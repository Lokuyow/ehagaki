<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";
    import { onDestroy, onMount } from "svelte";
    import { LONG_PRESS_DELAY, MOVE_CANCEL_THRESHOLD } from "../lib/constants";
    import type { ImageDimensions } from "../lib/types";
    import { _ } from "svelte-i18n";
    import { getEventPosition } from "../lib/utils/appUtils";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import {
        calculateImageDisplaySize,
        parseDimString,
        dispatchDragEvent,
        highlightDropZoneAtPosition,
        createDragPreview,
        updateDragPreview,
        removeDragPreview,
        checkMoveThreshold,
        handleImageInteraction,
    } from "../lib/utils/editorImageUtils";
    import { isTouchDevice, blurEditorAndBody } from "../lib/utils/appDomUtils";
    import { copyToClipboard } from "../lib/utils/clipboardUtils";
    import { postComponentUIStore } from "../stores/appStore.svelte";
    import {
        imageDragState,
        imageSelectionState,
    } from "../stores/editorStore.svelte";
    import { imageSizeMapStore } from "../stores/tagsStore.svelte";

    interface Props {
        node: NodeViewProps["node"];
        selected: boolean;
        getPos: NodeViewProps["getPos"];
        deleteNode: NodeViewProps["deleteNode"];
    }

    let { node, selected, getPos, deleteNode }: Props = $props();

    let dragState = imageDragState;
    let selectionState = imageSelectionState;
    let isImageLoaded = $state(false);

    // buttonElementの参照を追加
    let buttonElement: HTMLButtonElement | undefined = $state();

    const isTouchCapable = isTouchDevice();

    const JUST_SELECTED_DURATION = 400; // ms

    let isPlaceholder = $derived(
        node.attrs.isPlaceholder === true ||
            (node.attrs.src && node.attrs.src.startsWith("placeholder-")),
    );
    let showActualImage = $derived(
        !isPlaceholder &&
            node.attrs.src &&
            !node.attrs.src.startsWith("placeholder-"),
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
        }
    });

    // 統合されたタップ/クリック処理
    function handleInteraction(
        event: MouseEvent | TouchEvent,
        isTouch = false,
    ) {
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
    }

    // 画像読み込みエラー時の処理
    function handleImageError() {
        isImageLoaded = false;
    }

    // イベントハンドラー
    function handleClick(event: MouseEvent) {
        handleInteraction(event, false);
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

    // 画像ノード削除処理
    function handleDeleteNode(event: MouseEvent) {
        event.stopPropagation(); // 親のクリックイベントを阻止
        deleteNode();
    }

    onMount(() => {
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

    onDestroy(() => {
        clearLongPress();
        if (selectionState.justSelectedTimeout) {
            clearTimeout(selectionState.justSelectedTimeout);
        }
        removeDragPreview(dragState.preview);

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
    });
</script>

<NodeViewWrapper>
    <div class="image-node-container">
        <button
            bind:this={buttonElement}
            type="button"
            class="editor-image-button"
            class:is-placeholder={isPlaceholder}
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
            {#if isPlaceholder}
                <LoadingPlaceholder
                    text={$_("imageNode.uploading")}
                    showLoader={true}
                />
            {:else if showActualImage}
                <img
                    src={node?.attrs?.src}
                    alt={node?.attrs?.alt || ""}
                    class="editor-image"
                    class:image-loading={!isImageLoaded}
                    draggable="false"
                    onload={handleImageLoad}
                    onerror={handleImageError}
                    oncontextmenu={preventContextMenu}
                />
            {/if}
        </button>
        {#if !isPlaceholder}
            <Button
                variant="copy"
                shape="circle"
                className="image-copy-button"
                ariaLabel={$_("imageContextMenu.copyUrl")}
                onClick={(event) => {
                    event.stopPropagation();
                    copyToClipboard(node.attrs.src, "image URL");
                    // コピー成功時のポップアップ表示
                    const pos = { x: event.clientX, y: event.clientY };
                    postComponentUIStore.showPopupMessage(
                        pos.x,
                        pos.y,
                        $_("imageContextMenu.copySuccess"),
                    );
                }}
            >
                <div class="copy-icon svg-icon"></div>
            </Button>
            <Button
                variant="close"
                shape="circle"
                className="image-close-button"
                ariaLabel={$_("imageContextMenu.delete")}
                onClick={handleDeleteNode}
            >
                <div class="close-icon svg-icon"></div>
            </Button>
        {/if}
    </div>
</NodeViewWrapper>

<style>
    /* ProseMirrorが生成する外側のラッパーも制御 */
    :global(.node-image) {
        display: block;
        width: fit-content;
        max-height: 240px;
        line-height: 0;
        margin: 10px 0;
    }

    /* NodeViewWrapperが生成するdata-node-view-wrapperを縦並び用に調整 */
    :global([data-node-view-wrapper]) {
        display: block;
        margin: 0;
        padding: 0;
    }

    /* 画像ノードコンテナ */
    .image-node-container {
        position: relative;
        display: inline-block;
        max-width: 100%;
        max-height: 240px;

        :global(.image-close-button) {
            position: absolute;
            top: 6px;
            right: 6px;
            z-index: 10;
            width: 40px;
            height: 40px;

            .close-icon {
                mask-image: url("/icons/xmark-solid-full.svg");
            }
        }

        :global(.image-copy-button) {
            position: absolute;
            bottom: 6px;
            right: 6px;
            z-index: 10;
            width: 40px;
            height: 40px;

            .copy-icon {
                mask-image: url("/icons/copy-solid-full.svg");
            }
        }
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
            transform: scale(1);
        }

        @media (prefers-color-scheme: light) {
            @media (min-width: 601px) {
                &:hover:not(:disabled) {
                    filter: brightness(100%);
                }
            }
        }

        @media (prefers-color-scheme: dark) {
            @media (min-width: 601px) {
                &:hover:not(:disabled) {
                    filter: brightness(100%);
                }
            }
        }
    }

    /* Focus extensionが付与するクラスで選択状態を表現 */
    :global(.node-image.is-node-focused .editor-image) {
        outline: 2px solid var(--theme, #2196f3);
        outline-offset: -1px;
    }

    /* ドラッグ状態での追加スタイル */
    .editor-image-button[data-dragging="true"] .editor-image {
        opacity: 0.3;
        transform: scale(0.95);
        transition: all 0.2s ease;
    }

    /* 画像要素 */
    img.editor-image {
        display: block;
        max-width: 100%;
        max-height: 240px;
        min-width: 100px;
        min-height: 100px;
        width: auto;
        border: 1px solid var(--border);
        border-radius: 6px;
        cursor: pointer;
        outline: none;
        transition: opacity 0.2s ease;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;

        &.image-loading {
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        &:not(.image-loading) {
            opacity: 1;
        }
    }

    /* プレースホルダー状態のボタン */
    .editor-image-button.is-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 240px;
        height: 160px;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--bg-input);
        cursor: default;
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
        background: dodgerblue;
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
