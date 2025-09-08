<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { ZOOM_CONFIG, TIMING, SELECTORS } from "../lib/constants";
    import {
        setBodyStyle,
        clearBodyStyles,
        focusEditor,
        calculateViewportInfo,
        calculateZoomFromEvent,
        calculateDragDelta,
    } from "../lib/utils";
    import {
        transformStore,
        createDragState,
        createPinchState,
        type TransformState,
        type DragState,
        type PinchState,
    } from "../lib/editor/stores/transformStore.svelte";

    interface Props {
        // Props
        src?: string;
        alt?: string;
        show?: boolean;
        onClose?: () => void;
    }

    let {
        src = "",
        alt = "",
        show = $bindable(false),
        onClose = () => {},
    }: Props = $props();

    // DOM要素の参照
    let imageElement: HTMLImageElement | undefined = $state();
    let containerElement: HTMLDivElement | undefined = $state();
    let imageContainerElement: HTMLDivElement | undefined = $state();

    // 状態管理
    let transformState: TransformState = transformStore.state;
    let dragState: DragState = createDragState();
    let pinchState: PinchState = createPinchState();
    let animationFrameId: number | null = null;
    let pinchAnimationFrameId: number | null = null; // ピンチ専用のrequestAnimationFrame
    let historyPushed = false;

    // タップ検出用の状態
    let lastTapTime = 0;
    let tapTimeoutId: number | null = null;
    let lastTapPosition: { x: number; y: number } | null = null;

    $effect(() => {
        // transformStateをtransformStore.stateで常に参照
        transformState = transformStore.state;
        if (imageContainerElement) {
            updateTransform();
        }
    });

    // DOM操作関数
    function updateTransform(): void {
        if (!imageContainerElement) return;

        const { scale, translate, useTransition } = transformState;

        imageContainerElement.style.transition = useTransition
            ? `transform ${TIMING.TRANSITION_DURATION} ease`
            : "none";

        imageContainerElement.style.transform = `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`;
        imageContainerElement.style.transformOrigin = "center";
    }

    // ピンチ操作中の直接DOM更新（ストア更新なし）
    function updateTransformDirect(
        scale: number,
        translateX: number,
        translateY: number,
    ): void {
        if (!imageContainerElement) return;

        imageContainerElement.style.transition = "none";
        imageContainerElement.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
    }

    function setImageCursor(): void {
        if (!imageContainerElement) return;
        imageContainerElement.style.cursor =
            transformState.scale > ZOOM_CONFIG.DEFAULT_SCALE
                ? "grab"
                : "default";
    }

    function setTransition(enable: boolean): void {
        transformStore.setTransition(enable);
    }

    // 履歴管理
    function pushHistoryState(): void {
        if (!historyPushed) {
            history.pushState({ imageFullscreen: true }, "", "");
            historyPushed = true;
        }
    }

    function clearHistoryState(): void {
        historyPushed = false;
    }

    // 状態リセット
    function resetAllStates(): void {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        if (pinchAnimationFrameId !== null) {
            cancelAnimationFrame(pinchAnimationFrameId);
            pinchAnimationFrameId = null;
        }

        transformStore.reset();
        dragState.isDragging = false;
        pinchState.isPinching = false;

        lastTapTime = 0;
        clearTapTimer();
        clearBodyStyles();
    }

    // メイン操作関数
    function close() {
        resetAllStates();
        show = false;
        onClose();

        if (historyPushed) {
            clearHistoryState();
            history.back();
        }

        focusEditor(SELECTORS.EDITOR, TIMING.EDITOR_FOCUS_DELAY);
    }

    // イベントハンドラー - ナビゲーション
    function handlePopState(event: PopStateEvent): void {
        if (show && historyPushed) {
            event.preventDefault();
            resetAllStates();
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

    // ズーム操作
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

    function executeZoomToggle(clientX?: number, clientY?: number): void {
        setTransition(true);

        setTimeout(() => {
            if (transformState.scale >= ZOOM_CONFIG.RESET_THRESHOLD) {
                transformStore.reset();
            } else {
                const viewport =
                    clientX !== undefined &&
                    clientY !== undefined &&
                    containerElement
                        ? calculateViewportInfo(
                              containerElement,
                              clientX,
                              clientY,
                          )
                        : { offsetX: 0, offsetY: 0, centerX: 0, centerY: 0 };

                transformStore.zoomToPoint(
                    ZOOM_CONFIG.DOUBLE_CLICK_SCALE,
                    viewport.offsetX,
                    viewport.offsetY,
                );
            }
            setImageCursor();
        }, 100);
    }

    function handleDoubleClick(event: MouseEvent): void {
        if (!imageContainerElement || !containerElement) return;

        stopDragIfActive();
        executeZoomToggle(event.clientX, event.clientY);
    }

    // 統一されたポインター操作
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

        setTimeout(() => {
            setTransition(true);
        }, 50);

        setBodyStyle("user-select", "");
        setBodyStyle("-webkit-user-select", "");
    }

    function stopDragIfActive(): void {
        if (dragState.isDragging) {
            stopDrag();
        }
    }

    // ピンチ操作
    function startPinch(event: TouchEvent): void {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];

        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > ZOOM_CONFIG.PINCH_MIN_DISTANCE) {
            pinchState.isPinching = true;
            pinchState.initialDistance = distance;
            pinchState.initialScale = transformState.scale;
            pinchState.centerX = (touch1.clientX + touch2.clientX) / 2;
            pinchState.centerY = (touch1.clientY + touch2.clientY) / 2;

            setTransition(false);
        }
    }

    function updatePinch(event: TouchEvent): void {
        if (!pinchState.isPinching || !containerElement) return;

        // 既存のアニメーションフレームをキャンセル
        if (pinchAnimationFrameId !== null) {
            cancelAnimationFrame(pinchAnimationFrameId);
        }

        pinchAnimationFrameId = requestAnimationFrame(() => {
            const touch1 = event.touches[0];
            const touch2 = event.touches[1];

            const dx = touch1.clientX - touch2.clientX;
            const dy = touch1.clientY - touch2.clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > ZOOM_CONFIG.PINCH_MIN_DISTANCE) {
                const scaleRatio = distance / pinchState.initialDistance;
                const newScale = Math.max(
                    ZOOM_CONFIG.MIN_SCALE,
                    Math.min(
                        ZOOM_CONFIG.MAX_SCALE,
                        pinchState.initialScale * scaleRatio,
                    ),
                );

                // コンテナの中心座標を取得
                if (!containerElement) return;
                const rect = containerElement.getBoundingClientRect();
                const containerCenterX = rect.width / 2;
                const containerCenterY = rect.height / 2;

                // ピンチ中心からコンテナ中心への相対位置
                const offsetX =
                    pinchState.centerX - rect.left - containerCenterX;
                const offsetY =
                    pinchState.centerY - rect.top - containerCenterY;

                // スケール変化に応じた座標調整
                const actualScaleRatio = newScale / transformState.scale;
                const newTranslateX =
                    transformState.translate.x * actualScaleRatio -
                    offsetX * (actualScaleRatio - 1);
                const newTranslateY =
                    transformState.translate.y * actualScaleRatio -
                    offsetY * (actualScaleRatio - 1);

                // 直接DOM更新（ストア更新なし）
                updateTransformDirect(newScale, newTranslateX, newTranslateY);
            }
        });
    }

    function stopPinch(): void {
        if (!pinchState.isPinching) return;

        // アニメーションフレームをキャンセル
        if (pinchAnimationFrameId !== null) {
            cancelAnimationFrame(pinchAnimationFrameId);
            pinchAnimationFrameId = null;
        }

        pinchState.isPinching = false;

        // 最終状態をストアに反映
        if (imageContainerElement) {
            const transform = imageContainerElement.style.transform;
            const scaleMatch = transform.match(/scale\(([\d.]+)\)/);
            const translateMatch = transform.match(
                /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/,
            );

            if (scaleMatch && translateMatch) {
                const finalScale = parseFloat(scaleMatch[1]);
                const finalTranslateX =
                    parseFloat(translateMatch[1]) * finalScale;
                const finalTranslateY =
                    parseFloat(translateMatch[2]) * finalScale;

                transformStore.setDirectState({
                    scale: finalScale,
                    translate: { x: finalTranslateX, y: finalTranslateY },
                    useTransition: true,
                });
            }
        }

        setTransition(true);
        setImageCursor();
    }

    // タップ検出
    function handleTap(clientX: number, clientY: number): void {
        const currentTime = Date.now();

        if (currentTime - lastTapTime < 300 && tapTimeoutId !== null) {
            clearTapTimer();
            stopDragIfActive();
            // ダブルタップ時は記録された座標を使用
            executeZoomToggle(clientX, clientY);
            lastTapTime = 0;
            lastTapPosition = null;
            return;
        }

        lastTapTime = currentTime;
        lastTapPosition = { x: clientX, y: clientY };
        clearTapTimer();

        tapTimeoutId = Number(
            setTimeout(() => {
                tapTimeoutId = null;
                lastTapPosition = null;
            }, 300),
        );
    }

    function clearTapTimer(): void {
        if (tapTimeoutId !== null) {
            clearTimeout(tapTimeoutId);
            tapTimeoutId = null;
        }
    }

    // 統一されたイベントハンドラー
    function handlePointerStart(
        clientX: number,
        clientY: number,
        isTouch = false,
    ): void {
        if (isTouch) {
            handleTap(clientX, clientY);
        }

        if (transformState.scale > ZOOM_CONFIG.DEFAULT_SCALE) {
            startDrag(clientX, clientY);
        }
    }

    function handlePointerMove(clientX: number, clientY: number): void {
        if (dragState.isDragging) {
            updateDrag(clientX, clientY);
        }
    }

    function handlePointerEnd(): void {
        stopDrag();
    }

    // タッチイベントハンドラー
    function handleTouchStart(event: TouchEvent): void {
        event.preventDefault();

        if (event.touches.length === 1) {
            const touch = event.touches[0];
            handlePointerStart(touch.clientX, touch.clientY, true);
        } else if (event.touches.length === 2) {
            stopDrag();
            clearTapTimer();
            startPinch(event);
        }
    }

    function handleTouchMove(event: TouchEvent): void {
        event.preventDefault();

        if (event.touches.length === 1 && dragState.isDragging) {
            handlePointerMove(
                event.touches[0].clientX,
                event.touches[0].clientY,
            );
        } else if (event.touches.length === 2 && pinchState.isPinching) {
            updatePinch(event);
        }
    }

    function handleTouchEnd(event: TouchEvent): void {
        event.preventDefault();

        if (event.touches.length === 0) {
            handlePointerEnd();
            stopPinch();
        } else if (event.touches.length === 1 && pinchState.isPinching) {
            stopPinch();
        }
    }

    // マウスイベントハンドラー
    function handleMouseDown(event: MouseEvent): void {
        handlePointerStart(event.clientX, event.clientY);
    }

    function handleMouseMove(event: MouseEvent): void {
        if (dragState.isDragging) {
            event.preventDefault();
            handlePointerMove(event.clientX, event.clientY);
        }
    }

    function handleMouseUp(): void {
        handlePointerEnd();
    }

    // リアクティブ文
    $effect(() => {
        if (show) {
            resetAllStates();
            setBodyStyle("overflow", "hidden");
            pushHistoryState();
        } else {
            setBodyStyle("overflow", "");
            clearHistoryState();
        }
    });

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
        clearBodyStyles();

        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }

        clearTapTimer();
        clearHistoryState();
        lastTapPosition = null;
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if show}
    <div
        class="fullscreen-overlay"
        bind:this={containerElement}
        onclick={handleBackdropClick}
        onkeydown={handleKeydown}
        onwheel={handleWheel}
        tabindex="0"
        role="dialog"
        aria-label="画像全画面表示"
    >
        <!-- Add your close button or logic here -->
        <button
            type="button"
            class="close-button"
            onclick={close}
            aria-label="Close fullscreen image"
        >
            <span class="svg-icon close-icon"></span>
        </button>
        <div class="image-container" bind:this={imageContainerElement}>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <img
                bind:this={imageElement}
                {src}
                {alt}
                class="fullscreen-image"
                onmousedown={handleMouseDown}
                ondblclick={handleDoubleClick}
                ontouchstart={handleTouchStart}
                ontouchmove={handleTouchMove}
                ontouchend={handleTouchEnd}
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
        bottom: 20px;
        right: 50%;
        transform: translateX(50%);
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

    .svg-icon {
        mask-image: url("/ehagaki/icons/xmark-solid-full.svg");
        background-color: whitesmoke;
        width: 32px;
        height: 32px;
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
        /* CSSのtransitionを削除（JavaScriptで制御） */
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
