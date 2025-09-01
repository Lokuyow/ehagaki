<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { ZOOM_CONFIG, TIMING, SELECTORS } from "../lib/constants";
    import {
        clamp,
        isNearScale,
        setBodyStyle,
        clearBodyStyles,
        focusEditor,
        getMousePosition,
        calculateViewportInfo,
        calculateZoom,
        calculateDoubleClickZoom,
        calculateDragDelta,
        type MousePosition,
    } from "../lib/utils";
    import {
        transformStore,
        createDragState,
        type Position,
        type TransformState,
        type DragState,
    } from "../lib/stores/transformStore";

    // Props
    export let src: string = "";
    export let alt: string = "";
    export let show: boolean = false;
    export let onClose: () => void = () => {};

    // DOM要素の参照
    let imageElement: HTMLImageElement;
    let containerElement: HTMLDivElement;
    let imageContainerElement: HTMLDivElement;

    // 状態管理
    let transformState: TransformState;
    let dragState: DragState = createDragState();
    let animationFrameId: number | null = null;
    let historyPushed = false;

    // ストアの購読
    const unsubscribe = transformStore.subscribe((value) => {
        transformState = value;
        if (imageContainerElement) {
            updateTransform();
        }
    });

    // DOM操作関数
    function updateTransform(): void {
        if (!imageContainerElement) return;

        const { scale, translate } = transformState;
        imageContainerElement.style.transform = `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`;
        imageContainerElement.style.transformOrigin = "center";
    }

    function resetTransform(): void {
        if (!imageContainerElement) return;

        imageContainerElement.style.transform = "";
        imageContainerElement.style.transformOrigin = "";
        imageContainerElement.style.cursor = "default";
        imageContainerElement.style.transition = `transform ${TIMING.TRANSITION_DURATION} ease`;

        transformStore.reset();
    }

    function setImageCursor(): void {
        if (!imageContainerElement) return;
        imageContainerElement.style.cursor =
            transformState.scale > ZOOM_CONFIG.DEFAULT_SCALE
                ? "grab"
                : "default";
    }

    // 履歴管理
    function pushHistoryState(): void {
        if (!historyPushed) {
            history.pushState({ imageFullscreen: true }, "", "");
            historyPushed = true;
        }
    }

    function clearHistoryState(): void {
        if (historyPushed) {
            historyPushed = false;
        }
    }

    // メイン操作関数
    function close(): void {
        show = false;
        onClose();

        if (historyPushed) {
            clearHistoryState();
            history.back();
        }

        focusEditor(SELECTORS.EDITOR, TIMING.EDITOR_FOCUS_DELAY);
    }

    function reset(): void {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        resetTransform();
        dragState.isDragging = false;
        clearBodyStyles();
    }

    // イベントハンドラー - ナビゲーション
    function handlePopState(event: PopStateEvent): void {
        if (show && historyPushed) {
            event.preventDefault();
            clearHistoryState();
            show = false;
            onClose();
        }
    }

    function handleKeydown(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            close();
        }
    }

    function handleBackdropClick(event: MouseEvent): void {
        if (event.target === containerElement) {
            close();
        }
    }

    // イベントハンドラー - ズーム
    function handleWheel(event: WheelEvent): void {
        event.preventDefault();

        const delta =
            event.deltaY > 0
                ? ZOOM_CONFIG.ZOOM_DELTA.OUT
                : ZOOM_CONFIG.ZOOM_DELTA.IN;
        const newScale = clamp(
            transformState.scale * delta,
            ZOOM_CONFIG.MIN_SCALE,
            ZOOM_CONFIG.MAX_SCALE,
        );

        if (
            newScale !== transformState.scale &&
            imageContainerElement &&
            containerElement
        ) {
            const mousePos = getMousePosition(event);
            const viewport = calculateViewportInfo(
                containerElement,
                mousePos.x,
                mousePos.y,
            );

            if (
                newScale === ZOOM_CONFIG.DEFAULT_SCALE ||
                isNearScale(
                    newScale,
                    ZOOM_CONFIG.DEFAULT_SCALE,
                    ZOOM_CONFIG.THRESHOLD,
                )
            ) {
                resetTransform();
            } else {
                const zoomCalc = calculateZoom(
                    transformState.scale,
                    transformState.translate,
                    newScale,
                    viewport.offsetX,
                    viewport.offsetY,
                );

                transformStore.updateState({
                    scale: zoomCalc.newScale,
                    translate: zoomCalc.newTranslate,
                });
                setImageCursor();
            }
        }
    }

    function handleDoubleClick(event: MouseEvent): void {
        if (!imageContainerElement || !containerElement) return;

        if (transformState.scale > ZOOM_CONFIG.DEFAULT_SCALE) {
            resetTransform();
        } else {
            const mousePos = getMousePosition(event);
            const viewport = calculateViewportInfo(
                containerElement,
                mousePos.x,
                mousePos.y,
            );

            const zoomCalc = calculateDoubleClickZoom(
                ZOOM_CONFIG.DOUBLE_CLICK_SCALE,
                viewport.offsetX,
                viewport.offsetY,
            );

            transformStore.updateState({
                scale: zoomCalc.newScale,
                translate: zoomCalc.newTranslate,
            });

            setImageCursor();
            imageContainerElement.style.transition = `transform ${TIMING.TRANSITION_DURATION} ease`;
        }
    }

    // イベントハンドラー - ドラッグ
    function handleMouseDown(event: MouseEvent): void {
        if (transformState.scale <= ZOOM_CONFIG.DEFAULT_SCALE) return;

        const mousePos = getMousePosition(event);
        dragState.isDragging = true;
        dragState.start = mousePos;
        dragState.startTranslate = { ...transformState.translate };
        event.preventDefault();

        if (imageContainerElement) {
            imageContainerElement.style.cursor = "grabbing";
            imageContainerElement.style.transition = "none";
        }

        setBodyStyle("user-select", "none");
        setBodyStyle("-webkit-user-select", "none");
    }

    function handleMouseMove(event: MouseEvent): void {
        if (
            !dragState.isDragging ||
            transformState.scale <= ZOOM_CONFIG.DEFAULT_SCALE
        )
            return;

        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
            const currentMouse = getMousePosition(event);
            const delta = calculateDragDelta(currentMouse, dragState.start);

            transformStore.updateTranslate({
                x: dragState.startTranslate.x + delta.x,
                y: dragState.startTranslate.y + delta.y,
            });
        });
    }

    function handleMouseUp(): void {
        dragState.isDragging = false;

        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        if (imageContainerElement) {
            setImageCursor();
            imageContainerElement.style.transition = `transform ${TIMING.TRANSITION_DURATION} ease`;
        }

        setBodyStyle("user-select", "");
        setBodyStyle("-webkit-user-select", "");
    }

    // リアクティブ文
    $: if (show) {
        reset();
        setBodyStyle("overflow", "hidden");
        pushHistoryState();
    } else {
        setBodyStyle("overflow", "");
        clearHistoryState();
    }

    // ライフサイクル
    onMount(() => {
        const eventHandlers = [
            { event: "mousemove", handler: handleMouseMove, target: document },
            { event: "mouseup", handler: handleMouseUp, target: document },
            { event: "popstate", handler: handlePopState, target: window },
        ];

        eventHandlers.forEach(({ event, handler, target }) => {
            target.addEventListener(event, handler as EventListener);
        });

        return () => {
            eventHandlers.forEach(({ event, handler, target }) => {
                target.removeEventListener(event, handler as EventListener);
            });
        };
    });

    onDestroy(() => {
        unsubscribe();
        clearBodyStyles();

        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }

        window.removeEventListener("popstate", handlePopState);
        clearHistoryState();
    });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if show}
    <div
        class="fullscreen-overlay"
        bind:this={containerElement}
        on:click={handleBackdropClick}
        on:keydown={handleKeydown}
        on:wheel={handleWheel}
        tabindex="0"
        role="dialog"
        aria-label="画像全画面表示"
    >
        <button class="close-button" on:click={close} aria-label="閉じる">
            <span class="svg-icon close-icon"></span>
        </button>

        <div class="image-container" bind:this={imageContainerElement}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <img
                bind:this={imageElement}
                {src}
                {alt}
                class="fullscreen-image"
                on:mousedown={handleMouseDown}
                on:dblclick={handleDoubleClick}
                draggable="false"
            />
        </div>
    </div>
{/if}

<style>
    .fullscreen-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: black;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        outline: none;
        /* タッチデバイスでのフォーカス処理改善 */
        -webkit-tap-highlight-color: transparent;
        /* ブラウザ標準のピンチズームを有効化 */
        touch-action: pan-x pan-y pinch-zoom;
    }

    .close-button {
        position: absolute;
        top: 20px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        border: none;
        color: white;
        font-size: 24px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
        z-index: 10001;
    }

    .close-button:hover {
        background: rgba(25, 25, 25, 0.6);
    }

    .close-icon {
        mask-image: url("/ehagaki/icons/xmark-solid-full.svg");
        background-color: whitesmoke;
    }

    .image-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        overflow: hidden;
        /* ブラウザ標準のピンチズームを有効化 */
        touch-action: pan-x pan-y pinch-zoom;
        /* スムーズなトランジション */
        transition: transform 0.3s ease;
        transform-origin: center;
        cursor: default;
        /* GPU加速を有効化 */
        will-change: transform;
        transform: translateZ(0);
    }

    .fullscreen-image {
        max-width: 95vw;
        max-height: 85vh;
        object-fit: contain;
        user-select: none;
        -webkit-user-select: none;
        /* タッチデバイスでのフォーカス処理改善 */
        -webkit-tap-highlight-color: transparent;
        /* ブラウザ標準のピンチズームを有効化 */
        touch-action: pan-x pan-y pinch-zoom;
        pointer-events: auto;
        /* GPU加速を有効化 */
        will-change: transform;
        transform: translateZ(0);
    }
</style>
