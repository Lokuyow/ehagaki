<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { ZOOM_CONFIG, TIMING, SELECTORS } from "../lib/constants";
    import {
        setBodyStyle,
        clearBodyStyles,
        focusEditor,
        getMousePosition,
        calculateViewportInfo,
        calculateZoomFromEvent,
        calculateDragDelta,
        calculatePinchInfo,
        calculatePinchZoomParams,
    } from "../lib/utils";
    import {
        transformStore,
        createDragState,
        createPinchState,
        type TransformState,
        type DragState,
        type PinchState,
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
    let pinchState: PinchState = createPinchState();
    let animationFrameId: number | null = null;
    let historyPushed = false;

    // タップ検出用の状態
    let lastTapTime = 0;
    let tapTimeoutId: number | null = null;

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

    function setTransition(enable: boolean): void {
        if (!imageContainerElement) return;
        imageContainerElement.style.transition = enable
            ? `transform ${TIMING.TRANSITION_DURATION} ease`
            : "none";
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

    // イベントハンドラー - ズーム（簡素化）
    function handleWheel(event: WheelEvent): void {
        event.preventDefault();
        if (!imageContainerElement || !containerElement) return;

        const delta =
            event.deltaY > 0
                ? ZOOM_CONFIG.ZOOM_DELTA.OUT
                : ZOOM_CONFIG.ZOOM_DELTA.IN;
        const newScale = transformState.scale * delta;

        const zoomParams = calculateZoomFromEvent(
            event,
            containerElement,
            transformState.scale,
            transformState.translate,
            newScale,
        );

        transformStore.zoom(zoomParams);
        setImageCursor();
    }

    function handleDoubleClick(event: MouseEvent): void {
        if (!imageContainerElement || !containerElement) return;

        if (transformState.scale >= ZOOM_CONFIG.RESET_THRESHOLD) {
            resetTransform();
        } else {
            const viewport = calculateViewportInfo(
                containerElement,
                event.clientX,
                event.clientY,
            );

            transformStore.zoomToPoint(
                ZOOM_CONFIG.DOUBLE_CLICK_SCALE,
                viewport.offsetX,
                viewport.offsetY,
            );

            setImageCursor();
            setTransition(true);
        }
    }

    // タッチイベントハンドラー（簡素化）
    function handleTouchStart(event: TouchEvent): void {
        event.preventDefault();

        if (event.touches.length === 1) {
            const touch = event.touches[0];
            handleTap();

            if (transformState.scale > ZOOM_CONFIG.DEFAULT_SCALE) {
                startDrag(touch.clientX, touch.clientY);
            }
        } else if (event.touches.length === 2) {
            stopDrag();
            clearTapTimer();
            startPinch(event);
        }
    }

    function handleTouchMove(event: TouchEvent): void {
        event.preventDefault();

        if (event.touches.length === 1 && dragState.isDragging) {
            updateDrag(event.touches[0].clientX, event.touches[0].clientY);
        } else if (event.touches.length === 2 && pinchState.isPinching) {
            updatePinch(event);
        }
    }

    function handleTouchEnd(event: TouchEvent): void {
        event.preventDefault();

        if (event.touches.length === 0) {
            stopDrag();
            stopPinch();
        } else if (event.touches.length === 1 && pinchState.isPinching) {
            pinchState.isPinching = false;
        }
    }

    // ドラッグ操作の統合
    function startDrag(clientX: number, clientY: number): void {
        dragState.isDragging = true;
        dragState.start = { x: clientX, y: clientY };
        dragState.startTranslate = { ...transformState.translate };

        if (imageContainerElement) {
            imageContainerElement.style.cursor = "grabbing";
            setTransition(false);
        }

        setBodyStyle("user-select", "none");
        setBodyStyle("-webkit-user-select", "none");
    }

    function updateDrag(clientX: number, clientY: number): void {
        if (!dragState.isDragging) return;

        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(() => {
            const delta = calculateDragDelta(
                { x: clientX, y: clientY },
                dragState.start,
            );

            transformStore.drag(delta.x, delta.y, dragState.startTranslate);
        });
    }

    function stopDrag(): void {
        if (!dragState.isDragging) return;

        dragState.isDragging = false;

        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        setImageCursor();
        setTransition(true);
        setBodyStyle("user-select", "");
        setBodyStyle("-webkit-user-select", "");
    }

    // ピンチ操作の統合
    function startPinch(event: TouchEvent): void {
        const pinchInfo = calculatePinchInfo(
            event.touches[0],
            event.touches[1],
        );

        if (pinchInfo.distance > ZOOM_CONFIG.PINCH_MIN_DISTANCE) {
            pinchState.isPinching = true;
            pinchState.initialDistance = pinchInfo.distance;
            pinchState.initialScale = transformState.scale;
            pinchState.centerX = pinchInfo.centerX;
            pinchState.centerY = pinchInfo.centerY;

            setTransition(false);
        }
    }

    function updatePinch(event: TouchEvent): void {
        if (!pinchState.isPinching || !containerElement) return;

        const pinchInfo = calculatePinchInfo(
            event.touches[0],
            event.touches[1],
        );

        if (pinchInfo.distance > ZOOM_CONFIG.PINCH_MIN_DISTANCE) {
            const scaleRatio = pinchInfo.distance / pinchState.initialDistance;

            const zoomParams = calculatePinchZoomParams(
                transformState.scale,
                (pinchState.initialScale * scaleRatio) / transformState.scale,
                pinchState.centerX,
                pinchState.centerY,
                containerElement,
            );

            transformStore.zoom(zoomParams);
        }
    }

    function stopPinch(): void {
        pinchState.isPinching = false;
        setTransition(true);
    }

    // タップ検出の統合
    function handleTap(): void {
        const currentTime = Date.now();

        if (currentTime - lastTapTime < 300 && tapTimeoutId !== null) {
            clearTimeout(tapTimeoutId);
            tapTimeoutId = null;

            transformStore.zoomToPoint(ZOOM_CONFIG.DOUBLE_CLICK_SCALE);
            setImageCursor();
            setTransition(true);

            lastTapTime = 0;
            return;
        }

        lastTapTime = currentTime;
        clearTapTimer();

        tapTimeoutId = Number(
            setTimeout(() => {
                tapTimeoutId = null;
            }, 300),
        );
    }

    function clearTapTimer(): void {
        if (tapTimeoutId !== null) {
            clearTimeout(tapTimeoutId);
            tapTimeoutId = null;
        }
    }

    // マウスイベント（簡素化）
    function handleMouseDown(event: MouseEvent): void {
        if (transformState.scale > ZOOM_CONFIG.DEFAULT_SCALE) {
            startDrag(event.clientX, event.clientY);
        }
    }

    function handleMouseMove(event: MouseEvent): void {
        if (dragState.isDragging) {
            event.preventDefault();
            updateDrag(event.clientX, event.clientY);
        }
    }

    function handleMouseUp(): void {
        stopDrag();
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

            clearTapTimer();
        };
    });

    onDestroy(() => {
        unsubscribe();
        clearBodyStyles();

        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }

        clearTapTimer();
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
                on:touchstart={handleTouchStart}
                on:touchmove={handleTouchMove}
                on:touchend={handleTouchEnd}
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
        /* ブラウザ標準のピンチズームを無効化して独自実装を使用 */
        touch-action: none;
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
        /* ブラウザ標準のピンチズームを無効化して独自実装を使用 */
        touch-action: none;
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
        /* ブラウザ標準のピンチズームを無効化して独自実装を使用 */
        touch-action: none;
        pointer-events: auto;
        /* GPU加速を有効化 */
        will-change: transform;
        transform: translateZ(0);
    }
</style>
