<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";
    import { onDestroy } from "svelte";
    import type { ImageDimensions } from "../lib/types";
    import { _ } from "svelte-i18n";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import MediaActionButtons from "./MediaActionButtons.svelte";
    import {
        calculateImageDisplaySize,
        parseDimString,
        dispatchDragEvent,
        removeDragPreview,
        handleImageInteraction,
        isMediaPlaceholder,
    } from "../lib/utils/mediaNodeUtils";
    import { isTouchDevice } from "../lib/utils/appDomUtils";
    import { useMediaLoadState } from "../lib/hooks/useMediaLoadState.svelte";
    import { useImageDrag } from "../lib/hooks/useImageDrag.svelte";
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
    // buttonElementの参照
    let buttonElement: HTMLButtonElement | undefined = $state();

    const mediaLoad = useMediaLoadState();

    const isTouchCapable = isTouchDevice();

    const JUST_SELECTED_DURATION = 400; // ms

    let isPlaceholder = $derived(isMediaPlaceholder(node.attrs));
    let showActualImage = $derived(!isPlaceholder && !!node.attrs.src);

    // プレースホルダー表示を維持する状態（実プレースホルダー or 画像読み込み中）
    let showAsPlaceholder = $derived(
        isPlaceholder || (showActualImage && !mediaLoad.isLoaded),
    );

    // 画像サイズ関連の状態
    let imageDimensions = $state<ImageDimensions | null>(null);

    // プレースホルダーの表示サイズ（寸法情報がない場合はデフォルト値にフォールバック）
    let placeholderWidth = $derived(imageDimensions?.displayWidth ?? 240);
    let placeholderHeight = $derived(imageDimensions?.displayHeight ?? 160);

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

    // useImageDragフックによるタッチドラッグ管理
    const { cleanup: cleanupDrag } = useImageDrag({
        getButtonElement: () => buttonElement,
        getPos: () => getPos(),
        dragState,
        getIsPlaceholder: () => isPlaceholder,
        getNodeAttrs: () => node.attrs,
        handleInteraction,
    });

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

    function preventContextMenu(event: Event) {
        event.preventDefault();
    }

    onDestroy(() => {
        cleanupDrag();
        if (selectionState.justSelectedTimeout) {
            clearTimeout(selectionState.justSelectedTimeout);
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
            class:is-placeholder={showAsPlaceholder}
            style={showAsPlaceholder
                ? `width: ${placeholderWidth}px; height: ${placeholderHeight}px;`
                : undefined}
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
            {#if showAsPlaceholder}
                <LoadingPlaceholder
                    text={$_("imageNode.uploading")}
                    showLoader={true}
                />
            {/if}
            {#if showActualImage}
                <img
                    src={node?.attrs?.src}
                    alt={node?.attrs?.alt || ""}
                    class="editor-image"
                    class:image-loading={!mediaLoad.isLoaded}
                    draggable="false"
                    onload={mediaLoad.handleLoad}
                    onerror={mediaLoad.handleError}
                    oncontextmenu={preventContextMenu}
                />
            {/if}
        </button>
        {#if !showAsPlaceholder}
            <MediaActionButtons
                src={node.attrs.src}
                onDelete={deleteNode}
                deleteAriaLabel={$_("imageContextMenu.delete")}
                copyAriaLabel={$_("imageContextMenu.copyUrl")}
                copySuccessMessage={$_("imageContextMenu.copySuccess")}
                layout="editor-image"
            />
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
        min-width: 100px;
        min-height: 100px;
        max-width: 100%;
        border: 1px solid var(--border);
        border-radius: 6px;
        background: var(--bg-input);
        cursor: default;
    }

    /* 画像読み込み中（プレースホルダー表示中）はレイアウトに影響させない */
    .editor-image-button.is-placeholder img.editor-image.image-loading {
        position: absolute;
        opacity: 0;
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
