<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { ZOOM_CONFIG, TIMING, SELECTORS } from "../lib/constants";
    import Button from "./Button.svelte";
    import type { TransformState } from "../lib/types";
    import {
        setBodyStyle,
        focusEditor,
        isTouchDevice,
    } from "../lib/utils/appDomUtils";
    import {
        transformStore,
        createDragState,
        createPinchState,
    } from "../stores/imageFullscreenStore.svelte";
    import {
        calculateViewportInfo,
        calculateZoomFromEvent,
        calculateDragDelta,
        setImageContainerStyle,
        setImageContainerTransformDirect,
        setImageCursorByScale,
        setOverlayCursorByScale,
        setTransition,
        setBodyUserSelect,
        clearTapTimer,
        updateBoundaryConstraints,
        resetAllStates,
        handlePointerStart,
        handlePointerMove,
        handlePointerEnd,
        calculateDragVelocity,
        applyMomentumAnimation,
    } from "../lib/utils/imageFullscreenUtils";

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
    let momentumAnimationId: number | null = null; // 慣性アニメーション用のID
    let historyPushed = false;
    let lastTapTime = 0;
    let tapTimeoutId: number | null = null;
    let lastTapPosition: { x: number; y: number } | null = null;

    // タッチ処理の改善用の状態
    let touchStartTime = 0;
    let touchMoved = false; // Moved to component state for handlePointerMove
    let dragStartThreshold = 10; // ピクセル単位での移動閾値

    // 慣性アニメーション用の状態
    let lastDragTime = 0;
    let lastDragPosition = { x: 0, y: 0 };
    let dragVelocity = { x: 0, y: 0 };

    // --- Transform effect ---
    $effect(() => {
        transformState = transformStore.state;
        setImageContainerStyle(
            {
                scale: transformState.scale,
                translate: transformState.translate,
                useTransition: transformState.useTransition ?? false,
            },
            imageContainerElement,
        );
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
        setImageCursorByScale(transformState.scale, imageContainerElement);
        setOverlayCursorByScale(transformState.scale, containerElement);
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
            setImageCursorByScale(transformState.scale, imageContainerElement);
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
        lastDragTime = Date.now();
        lastDragPosition = { x: clientX, y: clientY };
        dragVelocity = { x: 0, y: 0 };
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
            // 速度計算
            const now = Date.now();
            const timeDelta = now - lastDragTime;
            if (timeDelta > 0) {
                dragVelocity = calculateDragVelocity(
                    lastDragPosition,
                    { x: clientX, y: clientY },
                    timeDelta,
                );
            }
            lastDragTime = now;
            lastDragPosition = { x: clientX, y: clientY };
        });
    }
    function stopDrag() {
        if (!dragState.isDragging) return;
        dragState.isDragging = false;
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        // 慣性アニメーションを開始（スマートフォンでのみ）
        if (isTouchDevice()) {
            applyMomentumAnimation(
                dragVelocity,
                transformState.translate,
                transformState.scale,
                (newTranslate) => {
                    transformStore.setDirectState({
                        ...transformState,
                        translate: newTranslate,
                        useTransition: false,
                    });
                },
                () => {
                    setTransition(true);
                    setImageCursorByScale(
                        transformState.scale,
                        imageContainerElement,
                    );
                    setOverlayCursorByScale(
                        transformState.scale,
                        containerElement,
                    );
                },
                momentumAnimationId,
                (id) => {
                    momentumAnimationId = id;
                },
            );
        } else {
            setImageCursorByScale(transformState.scale, imageContainerElement);
            setOverlayCursorByScale(transformState.scale, containerElement);
            setTimeout(() => setTransition(true), 50);
        }
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
                    imageContainerElement,
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
        setImageCursorByScale(transformState.scale, imageContainerElement);
    }

    // --- Tap/Pointer Handlers ---
    function handleTouchStart(event: TouchEvent) {
        // close-buttonのタッチを妨げないように
        if ((event.target as Element)?.closest(".close-button-container")) {
            return;
        }

        event.preventDefault(); // デフォルトの動作を防ぐ

        // 慣性アニメーションを停止
        if (momentumAnimationId !== null) {
            cancelAnimationFrame(momentumAnimationId);
            momentumAnimationId = null;
            setTransition(true);
            setImageCursorByScale(transformState.scale, imageContainerElement);
            setOverlayCursorByScale(transformState.scale, containerElement);
        }

        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const result = handlePointerStart(
                transformState.scale,
                transformState.translate,
                dragState,
                lastTapTime,
                lastTapPosition,
                tapTimeoutId,
                touch.clientX,
                touch.clientY,
                true,
                (x, y) => executeZoomToggle(x, y),
            );
            dragState = result.newDragState;
            lastTapTime = result.newLastTapTime;
            lastTapPosition = result.newLastTapPosition;
            tapTimeoutId = result.newTapTimeoutId;
        } else if (event.touches.length === 2) {
            stopDrag();
            clearTapTimer(tapTimeoutId);
            startPinch(event);
        }
    }

    function handleTouchMove(event: TouchEvent) {
        event.preventDefault(); // デフォルトの動作を防ぐ

        if (event.touches.length === 1) {
            const touch = event.touches[0];
            const result = handlePointerMove(
                dragState,
                touch.clientX,
                touch.clientY,
                true,
                dragStartThreshold,
                transformState.scale,
                startDrag,
                updateDrag,
            );
            dragState = result.newDragState;
            touchMoved = result.touchMoved;
        } else if (event.touches.length === 2 && pinchState.isPinching) {
            updatePinch(event);
        }
    }

    function handleTouchEnd(event: TouchEvent) {
        event.preventDefault(); // デフォルトの動作を防ぐ

        if (event.touches.length === 0) {
            handlePointerEnd(
                dragState,
                true,
                touchStartTime,
                touchMoved,
                stopDrag,
            );
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

        // 慣性アニメーションを停止
        if (momentumAnimationId !== null) {
            cancelAnimationFrame(momentumAnimationId);
            momentumAnimationId = null;
            setTransition(true);
            setImageCursorByScale(transformState.scale, imageContainerElement);
            setOverlayCursorByScale(transformState.scale, containerElement);
        }

        const result = handlePointerStart(
            transformState.scale,
            transformState.translate,
            dragState,
            lastTapTime,
            lastTapPosition,
            tapTimeoutId,
            event.clientX,
            event.clientY,
            false,
            (x, y) => executeZoomToggle(x, y),
        );
        dragState = result.newDragState;
        lastTapTime = result.newLastTapTime;
        lastTapPosition = result.newLastTapPosition;
        tapTimeoutId = result.newTapTimeoutId;
        startDrag(event.clientX, event.clientY);
    }

    function handleMouseMove(event: MouseEvent) {
        if (dragState.isDragging) {
            event.preventDefault();
            const result = handlePointerMove(
                dragState,
                event.clientX,
                event.clientY,
                false,
                dragStartThreshold,
                transformState.scale,
                startDrag,
                updateDrag,
            );
            dragState = result.newDragState;
            // touchMoved not used for mouse
        }
    }
    function handleMouseUp() {
        handlePointerEnd(
            dragState,
            false,
            touchStartTime,
            touchMoved,
            stopDrag,
        );
    }
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Escape") close();
    }
    function handlePopState(event: PopStateEvent) {
        if (show && historyPushed) {
            event.preventDefault();
            resetAllStates(
                animationFrameId,
                pinchAnimationFrameId,
                dragState,
                pinchState,
                lastTapTime,
            );
            animationFrameId = null;
            pinchAnimationFrameId = null;
            lastTapTime = 0;
            tapTimeoutId = null;
            show = false;
            onClose();
        }
    }
    function close() {
        resetAllStates(
            animationFrameId,
            pinchAnimationFrameId,
            dragState,
            pinchState,
            lastTapTime,
        );
        animationFrameId = null;
        pinchAnimationFrameId = null;
        lastTapTime = 0;
        tapTimeoutId = null;
        show = false;
        onClose();
        if (historyPushed) {
            historyPushed = false;
            history.back();
        }
        focusEditor(SELECTORS.EDITOR, TIMING.EDITOR_FOCUS_DELAY);
    }

    // --- Effect: show/hide ---
    $effect(() => {
        if (show) {
            resetAllStates(
                animationFrameId,
                pinchAnimationFrameId,
                dragState,
                pinchState,
                lastTapTime,
            );
            animationFrameId = null;
            pinchAnimationFrameId = null;
            lastTapTime = 0;
            tapTimeoutId = null;
            setBodyStyle("overflow", "hidden");
            if (!historyPushed) {
                history.pushState({ imageFullscreen: true }, "", "");
                historyPushed = true;
            }
            if (imageElement && imageElement.complete) {
                updateBoundaryConstraints(imageElement, containerElement);
            }
        } else {
            setBodyStyle("overflow", "");
            historyPushed = false;
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
            clearTapTimer(tapTimeoutId);
        };
    });

    onDestroy(() => {
        resetAllStates(
            animationFrameId,
            pinchAnimationFrameId,
            dragState,
            pinchState,
            lastTapTime,
        );
        historyPushed = false;
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
            <Button
                variant="close"
                shape="circle"
                onClick={close}
                ontouchstart={(e) => e.stopPropagation()}
                ontouchend={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // タッチイベントが完全に終了してから閉じる（背後の要素への伝播防止）
                    setTimeout(() => close(), 50);
                }}
                ariaLabel="Close fullscreen image"
            >
                <span class="svg-icon close-icon"></span>
            </Button>
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
                onload={(e) =>
                    updateBoundaryConstraints(imageElement, containerElement)}
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
        bottom: 15px;
        right: 50%;
        transform: translateX(50%);
        z-index: 10002;
    }

    .close-icon {
        mask-image: url("/icons/xmark-solid-full.svg");
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
