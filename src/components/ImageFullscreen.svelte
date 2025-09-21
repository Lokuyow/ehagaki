<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { ZOOM_CONFIG, TIMING, SELECTORS } from "../lib/constants";
    import {
        calculateViewportInfo,
        calculateZoomFromEvent,
        calculateDragDelta,
    } from "../lib/utils/appUtils";
    import {
        setBodyStyle,
        clearBodyStyles,
        focusEditor,
    } from "../lib/utils/domUtils";
    import { isTouchDevice } from "../lib/utils/editorUtils";
    import {
        transformStore,
        createDragState,
        createPinchState,
        type TransformState,
        type BoundaryConstraints,
    } from "../stores/transformStore.svelte";

    interface Props {
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

    let imageElement: HTMLImageElement | undefined = $state();
    let containerElement: HTMLDivElement | undefined = $state();
    let imageContainerElement: HTMLDivElement | undefined = $state();

    let transformState: TransformState = transformStore.state;
    let dragState = createDragState();
    let pinchState = createPinchState();
    let animationFrameId: number | null = null;
    let pinchAnimationFrameId: number | null = null;
    let historyPushed = false;
    let lastTapTime = 0;
    let tapTimeoutId: number | null = null;
    let lastTapPosition: { x: number; y: number } | null = null;

    // タッチ処理の改善用の状態
    let touchStartTime = 0;
    let touchMoved = false;
    let dragStartThreshold = 10; // ピクセル単位での移動閾値

    // --- Utility functions ---
    function setImageContainerStyle({
        scale,
        translate,
        useTransition,
    }: TransformState) {
        if (!imageContainerElement) return;
        imageContainerElement.style.transition = useTransition
            ? `transform ${TIMING.TRANSITION_DURATION} ease`
            : "none";
        imageContainerElement.style.transform = `scale(${scale}) translate(${
            translate.x / scale
        }px, ${translate.y / scale}px)`;
        imageContainerElement.style.transformOrigin = "center";
    }
    function setImageContainerTransformDirect(
        scale: number,
        translateX: number,
        translateY: number,
    ) {
        if (!imageContainerElement) return;
        imageContainerElement.style.transition = "none";
        imageContainerElement.style.transform = `scale(${scale}) translate(${
            translateX / scale
        }px, ${translateY / scale}px)`;
    }
    function setImageCursorByScale(scale: number) {
        if (!imageContainerElement) return;
        imageContainerElement.style.cursor =
            scale > ZOOM_CONFIG.DEFAULT_SCALE ? "grab" : "default";
    }
    function setOverlayCursorByScale(scale: number) {
        if (!containerElement) return;
        containerElement.style.cursor =
            scale > ZOOM_CONFIG.DEFAULT_SCALE ? "grab" : "default";
    }
    function setTransition(enable: boolean) {
        transformStore.setTransition(enable);
    }
    function setBodyUserSelect(enable: boolean) {
        const value = enable ? "" : "none";
        setBodyStyle("user-select", value);
        setBodyStyle("-webkit-user-select", value);
    }
    function clearTapTimer() {
        if (tapTimeoutId !== null) {
            clearTimeout(tapTimeoutId);
            tapTimeoutId = null;
        }
    }
    function pushHistoryState() {
        if (!historyPushed) {
            history.pushState({ imageFullscreen: true }, "", "");
            historyPushed = true;
        }
    }
    function clearHistoryState() {
        historyPushed = false;
    }
    function updateBoundaryConstraints() {
        if (imageElement && containerElement) {
            const imageRect = imageElement.getBoundingClientRect();
            const containerRect = containerElement.getBoundingClientRect();
            const constraints: BoundaryConstraints = {
                imageWidth: imageRect.width,
                imageHeight: imageRect.height,
                containerWidth: containerRect.width,
                containerHeight: containerRect.height,
            };
            transformStore.setBoundaryConstraints(constraints);
        }
    }

    function resetAllStates() {
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
        if (pinchAnimationFrameId !== null)
            cancelAnimationFrame(pinchAnimationFrameId);
        animationFrameId = null;
        pinchAnimationFrameId = null;
        transformStore.reset();
        transformStore.setBoundaryConstraints(null);
        dragState.isDragging = false;
        pinchState.isPinching = false;
        lastTapTime = 0;
        clearTapTimer();
        clearBodyStyles();
    }

    // --- Transform effect ---
    $effect(() => {
        transformState = transformStore.state;
        setImageContainerStyle(transformState);
    });

    // --- Zoom/Drag/Pinch Handlers ---
    function handleWheel(event: WheelEvent) {
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
            newScale,
        );
        transformStore.zoom(zoomParams);
        setImageCursorByScale(transformState.scale);
        setOverlayCursorByScale(transformState.scale);
    }
    function executeZoomToggle(clientX?: number, clientY?: number) {
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
            setImageCursorByScale(transformState.scale);
        }, 100);
    }
    function handleDoubleClick(event: MouseEvent) {
        stopDragIfActive();
        executeZoomToggle(event.clientX, event.clientY);
    }
    function startDrag(clientX: number, clientY: number) {
        // 拡大されていない場合はドラッグしない
        if (transformState.scale <= ZOOM_CONFIG.DEFAULT_SCALE) {
            return;
        }

        dragState.isDragging = true;
        dragState.start = { x: clientX, y: clientY };
        dragState.startTranslate = { ...transformState.translate };
        if (imageContainerElement) {
            imageContainerElement.style.cursor = "grabbing";
            setTransition(false);
        }
        if (containerElement) {
            containerElement.style.cursor = "grabbing";
        }
        setBodyUserSelect(false);
    }
    function updateDrag(clientX: number, clientY: number) {
        if (!dragState.isDragging) return;
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
            const delta = calculateDragDelta(
                { x: clientX, y: clientY },
                dragState.start,
            );
            transformStore.drag(delta.x, delta.y, dragState.startTranslate);
        });
    }
    function stopDrag() {
        if (!dragState.isDragging) return;
        dragState.isDragging = false;
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        setImageCursorByScale(transformState.scale);
        setOverlayCursorByScale(transformState.scale);
        setTimeout(() => setTransition(true), 50);
        setBodyUserSelect(true);
    }
    function stopDragIfActive() {
        if (dragState.isDragging) stopDrag();
    }
    function startPinch(event: TouchEvent) {
        const [touch1, touch2] = [event.touches[0], event.touches[1]];
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
    function updatePinch(event: TouchEvent) {
        if (!pinchState.isPinching || !containerElement) return;
        if (pinchAnimationFrameId !== null)
            cancelAnimationFrame(pinchAnimationFrameId);
        pinchAnimationFrameId = requestAnimationFrame(() => {
            const [touch1, touch2] = [event.touches[0], event.touches[1]];
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
                if (!containerElement) return;
                const rect = containerElement.getBoundingClientRect();
                const containerCenterX = rect.width / 2;
                const containerCenterY = rect.height / 2;
                const offsetX =
                    pinchState.centerX - rect.left - containerCenterX;
                const offsetY =
                    pinchState.centerY - rect.top - containerCenterY;
                const actualScaleRatio = newScale / transformState.scale;
                const newTranslateX =
                    transformState.translate.x * actualScaleRatio -
                    offsetX * (actualScaleRatio - 1);
                const newTranslateY =
                    transformState.translate.y * actualScaleRatio -
                    offsetY * (actualScaleRatio - 1);
                setImageContainerTransformDirect(
                    newScale,
                    newTranslateX,
                    newTranslateY,
                );
            }
        });
    }
    function stopPinch() {
        if (!pinchState.isPinching) return;
        if (pinchAnimationFrameId !== null) {
            cancelAnimationFrame(pinchAnimationFrameId);
            pinchAnimationFrameId = null;
        }
        pinchState.isPinching = false;
        if (imageContainerElement) {
            const transform = imageContainerElement.style.transform;
            const scaleMatch = transform.match(/scale\(([^)]+)\)/);
            const translateMatch = transform.match(
                /translate\(([^,]+)px,\s*([^)]+)px\)/,
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
        setImageCursorByScale(transformState.scale);
    }

    // --- Tap/Pointer Handlers ---
    function handleTap(clientX: number, clientY: number) {
        const currentTime = Date.now();
        const tapDistance = lastTapPosition
            ? Math.sqrt(
                  Math.pow(clientX - lastTapPosition.x, 2) +
                      Math.pow(clientY - lastTapPosition.y, 2),
              )
            : 0;

        // ダブルタップ検出の条件を厳格化
        if (
            currentTime - lastTapTime < 200 &&
            tapDistance < 50 && // 50px以内での連続タップ
            tapTimeoutId !== null
        ) {
            clearTapTimer();
            stopDragIfActive();
            executeZoomToggle(clientX, clientY);
            lastTapTime = 0;
            lastTapPosition = null;
            return true; // ダブルタップを検出したことを示す
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
        return false; // シングルタップ
    }

    function handlePointerStart(
        clientX: number,
        clientY: number,
        isTouch = false,
    ) {
        if (isTouch) {
            touchStartTime = Date.now();
            touchMoved = false;
            const isDoubleTap = handleTap(clientX, clientY);
            if (isDoubleTap) {
                return; // ダブルタップの場合はドラッグを開始しない
            }
        } else {
            handleTap(clientX, clientY);
        }

        // 拡大時のみドラッグを開始準備
        if (transformState.scale > ZOOM_CONFIG.DEFAULT_SCALE) {
            dragState.start = { x: clientX, y: clientY };
            dragState.startTranslate = { ...transformState.translate };
        }
    }

    function handlePointerMove(
        clientX: number,
        clientY: number,
        isTouch = false,
    ) {
        if (isTouch) {
            const moveDistance = dragState.start
                ? Math.sqrt(
                      Math.pow(clientX - dragState.start.x, 2) +
                          Math.pow(clientY - dragState.start.y, 2),
                  )
                : 0;

            if (moveDistance > dragStartThreshold) {
                touchMoved = true;
                // 実際にドラッグを開始
                if (
                    !dragState.isDragging &&
                    transformState.scale > ZOOM_CONFIG.DEFAULT_SCALE
                ) {
                    startDrag(dragState.start.x, dragState.start.y);
                }
            }
        }

        if (dragState.isDragging) {
            updateDrag(clientX, clientY);
        }
    }

    function handlePointerEnd(isTouch = false) {
        if (isTouch) {
            const touchDuration = Date.now() - touchStartTime;

            // 短時間かつ移動が少ない場合はタップとして処理
            if (touchDuration < 200 && !touchMoved) {
                // タップ処理は既にhandlePointerStartで行われている
                return;
            }
        }

        stopDrag();
    }

    // --- Event Handlers ---
    function handleTouchStart(event: TouchEvent) {
        // close-buttonのタッチを妨げないように
        if ((event.target as Element)?.closest(".close-button-container")) {
            return;
        }

        event.preventDefault(); // デフォルトの動作を防ぐ

        if (event.touches.length === 1) {
            const touch = event.touches[0];
            handlePointerStart(touch.clientX, touch.clientY, true);
        } else if (event.touches.length === 2) {
            stopDrag();
            clearTapTimer();
            startPinch(event);
        }
    }

    function handleTouchMove(event: TouchEvent) {
        event.preventDefault(); // デフォルトの動作を防ぐ

        if (event.touches.length === 1) {
            const touch = event.touches[0];
            handlePointerMove(touch.clientX, touch.clientY, true);
        } else if (event.touches.length === 2 && pinchState.isPinching) {
            updatePinch(event);
        }
    }

    function handleTouchEnd(event: TouchEvent) {
        event.preventDefault(); // デフォルトの動作を防ぐ

        if (event.touches.length === 0) {
            handlePointerEnd(true);
            stopPinch();
        } else if (event.touches.length === 1 && pinchState.isPinching) {
            stopPinch();
        }
    }

    function handleMouseDown(event: MouseEvent) {
        // close-buttonのクリックを妨げないように
        if ((event.target as Element)?.closest(".close-button-container")) {
            return;
        }
        handlePointerStart(event.clientX, event.clientY);
        // マウスの場合は即座にドラッグを開始
        startDrag(event.clientX, event.clientY);
    }

    function handleMouseMove(event: MouseEvent) {
        if (dragState.isDragging) {
            event.preventDefault();
            handlePointerMove(event.clientX, event.clientY);
        }
    }
    function handleMouseUp() {
        handlePointerEnd();
    }
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") close();
    }
    function handlePopState(event: PopStateEvent) {
        if (show && historyPushed) {
            event.preventDefault();
            resetAllStates();
            clearHistoryState();
            show = false;
            onClose();
        }
    }
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

    // --- Effect: show/hide ---
    $effect(() => {
        if (show) {
            resetAllStates();
            setBodyStyle("overflow", "hidden");
            pushHistoryState();
            // 画像が読み込まれた後に境界制限を設定
            if (imageElement && imageElement.complete) {
                updateBoundaryConstraints();
            }
        } else {
            setBodyStyle("overflow", "");
            clearHistoryState();
        }
    });

    // --- Mount/Unmount ---
    function attachGlobalHandlers() {
        const handlers = [
            { event: "mousemove", handler: handleMouseMove, target: document },
            { event: "mouseup", handler: handleMouseUp, target: document },
            { event: "popstate", handler: handlePopState, target: window },
        ];
        handlers.forEach(({ event, handler, target }) =>
            target.addEventListener(event, handler as EventListener),
        );
        return handlers;
    }

    function detachGlobalHandlers(
        handlers: { event: string; handler: Function; target: EventTarget }[],
    ) {
        handlers.forEach(({ event, handler, target }) =>
            target.removeEventListener(event, handler as EventListener),
        );
    }

    onMount(() => {
        const handlers = attachGlobalHandlers();
        return () => {
            detachGlobalHandlers(handlers);
            clearTapTimer();
        };
    });

    onDestroy(() => {
        resetAllStates();
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
        onkeydown={handleKeydown}
        onwheel={handleWheel}
        onmousedown={handleMouseDown}
        ontouchstart={handleTouchStart}
        ontouchmove={handleTouchMove}
        ontouchend={handleTouchEnd}
        tabindex="0"
        role="dialog"
        aria-label="画像全画面表示"
    >
        <div class="close-button-container">
            <button
                type="button"
                class="close-button"
                onclick={close}
                ontouchstart={(e) => e.stopPropagation()}
                ontouchend={(e) => {
                    e.stopPropagation();
                    close();
                }}
                aria-label="Close fullscreen image"
            >
                <span class="svg-icon close-icon"></span>
            </button>
        </div>
        <div class="image-container" bind:this={imageContainerElement}>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <img
                bind:this={imageElement}
                {src}
                {alt}
                class="fullscreen-image"
                ondblclick={handleDoubleClick}
                onload={updateBoundaryConstraints}
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
        /* スクロールの慣性を無効化 */
        -webkit-overflow-scrolling: auto;
        overscroll-behavior: contain;
    }

    .close-button-container {
        position: absolute;
        bottom: 40px;
        right: 50%;
        transform: translateX(50%);
        z-index: 10002;
    }

    .close-button {
        background-color: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        opacity: 0.8;
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
        mask-image: url("/icons/xmark-solid-full.svg");
        background-color: whitesmoke;
        width: 32px;
        height: 32px;
    }

    .image-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: fit-content;
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
        max-width: 100vw;
        max-height: 100svh;
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
