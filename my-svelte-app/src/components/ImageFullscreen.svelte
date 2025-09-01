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
        calculatePinchInfo,
        calculatePinchZoom,
        type MousePosition,
        type PinchInfo,
    } from "../lib/utils";
    import {
        transformStore,
        createDragState,
        createPinchState,
        type Position,
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
    let lastTapTime = 0;
    let tapTimeoutId: number | null = null;
    let tapCount = 0; // タップカウントを追加

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

        // 拡大率が一定以上の場合は1倍に戻す
        if (transformState.scale >= ZOOM_CONFIG.RESET_THRESHOLD) {
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

    // タッチイベントハンドラー - ピンチズーム対応
    function handleTouchStart(event: TouchEvent): void {
        event.preventDefault();

        if (event.touches.length === 1) {
            // シングルタッチ - ドラッグ開始またはタップ検出
            const touch = event.touches[0];

            // 常にタップ検出を行う（拡大時も縮小のためダブルタップを検出）
            handleTap();

            if (transformState.scale > ZOOM_CONFIG.DEFAULT_SCALE) {
                // 拡大時はドラッグも有効にする
                dragState.isDragging = true;
                dragState.start = { x: touch.clientX, y: touch.clientY };
                dragState.startTranslate = { ...transformState.translate };

                if (imageContainerElement) {
                    imageContainerElement.style.cursor = "grabbing";
                    imageContainerElement.style.transition = "none";
                }

                setBodyStyle("user-select", "none");
                setBodyStyle("-webkit-user-select", "none");
            }
        } else if (event.touches.length === 2) {
            // ピンチズーム開始
            dragState.isDragging = false;
            // タップ関連のタイマーをクリア
            if (tapTimeoutId !== null) {
                clearTimeout(tapTimeoutId);
                tapTimeoutId = null;
            }
            tapCount = 0;

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

                if (imageContainerElement) {
                    imageContainerElement.style.transition = "none";
                }
            }
        }
    }

    function handleTouchMove(event: TouchEvent): void {
        event.preventDefault();

        if (event.touches.length === 1 && dragState.isDragging) {
            // ドラッグ処理
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
            }

            animationFrameId = requestAnimationFrame(() => {
                const touch = event.touches[0];
                const currentTouch = { x: touch.clientX, y: touch.clientY };
                const delta = calculateDragDelta(currentTouch, dragState.start);

                transformStore.updateTranslate({
                    x: dragState.startTranslate.x + delta.x,
                    y: dragState.startTranslate.y + delta.y,
                });
            });
        } else if (event.touches.length === 2 && pinchState.isPinching) {
            // ピンチズーム処理
            const pinchInfo = calculatePinchInfo(
                event.touches[0],
                event.touches[1],
            );

            if (pinchInfo.distance > ZOOM_CONFIG.PINCH_MIN_DISTANCE) {
                const scaleRatio =
                    pinchInfo.distance / pinchState.initialDistance;
                const newScale = pinchState.initialScale * scaleRatio;

                if (
                    newScale >= ZOOM_CONFIG.MIN_SCALE &&
                    newScale <= ZOOM_CONFIG.MAX_SCALE
                ) {
                    const zoomCalc = calculatePinchZoom(
                        transformState.scale,
                        transformState.translate,
                        newScale / transformState.scale,
                        pinchState.centerX,
                        pinchState.centerY,
                        containerElement,
                    );

                    transformStore.updateState({
                        scale: zoomCalc.newScale,
                        translate: zoomCalc.newTranslate,
                    });
                }
            }
        }
    }

    function handleTouchEnd(event: TouchEvent): void {
        event.preventDefault();

        if (event.touches.length === 0) {
            // 全てのタッチが終了
            dragState.isDragging = false;
            pinchState.isPinching = false;

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

            // 1倍に近い場合は1倍に戻す
            if (
                isNearScale(
                    transformState.scale,
                    ZOOM_CONFIG.DEFAULT_SCALE,
                    ZOOM_CONFIG.THRESHOLD,
                )
            ) {
                resetTransform();
            }
        } else if (event.touches.length === 1 && pinchState.isPinching) {
            // ピンチからシングルタッチに移行
            pinchState.isPinching = false;
        }
    }

    function handleTap(): void {
        const currentTime = Date.now();

        // 前回のタップから300ms以内かつ、まだタイマーが動いている場合はダブルタップ
        if (currentTime - lastTapTime < 300 && tapTimeoutId !== null) {
            // ダブルタップ確定
            clearTimeout(tapTimeoutId);
            tapTimeoutId = null;

            // 拡大率が一定以上の場合は1倍に戻す
            if (transformState.scale >= ZOOM_CONFIG.RESET_THRESHOLD) {
                resetTransform();
            } else {
                // タッチ座標が取得できない場合は中央に拡大
                const zoomCalc = calculateDoubleClickZoom(
                    ZOOM_CONFIG.DOUBLE_CLICK_SCALE,
                    0,
                    0,
                );

                transformStore.updateState({
                    scale: zoomCalc.newScale,
                    translate: zoomCalc.newTranslate,
                });

                setImageCursor();
                if (imageContainerElement) {
                    imageContainerElement.style.transition = `transform ${TIMING.TRANSITION_DURATION} ease`;
                }
            }

            tapCount = 0;
            lastTapTime = 0;
            return;
        }

        // 新しいタップシーケンス開始
        tapCount = 1;
        lastTapTime = currentTime;

        // 既存のタイマーがあればクリア
        if (tapTimeoutId !== null) {
            clearTimeout(tapTimeoutId);
        }

        // シングルタップの処理を遅延実行（ダブルタップを待つ）
        tapTimeoutId = Number(
            setTimeout(() => {
                // シングルタップでは何もしない（拡大しない）
                tapCount = 0;
                tapTimeoutId = null;
            }, 300),
        );
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
    // マウスドラッグ用イベントハンドラー
    function handleMouseDown(event: MouseEvent): void {
        if (transformState.scale > ZOOM_CONFIG.DEFAULT_SCALE) {
            dragState.isDragging = true;
            dragState.start = { x: event.clientX, y: event.clientY };
            dragState.startTranslate = { ...transformState.translate };

            if (imageContainerElement) {
                imageContainerElement.style.cursor = "grabbing";
                imageContainerElement.style.transition = "none";
            }

            setBodyStyle("user-select", "none");
            setBodyStyle("-webkit-user-select", "none");
        }
    }

    function handleMouseMove(event: MouseEvent): void {
        if (dragState.isDragging && imageContainerElement) {
            event.preventDefault();
            const currentMouse = { x: event.clientX, y: event.clientY };
            const delta = calculateDragDelta(currentMouse, dragState.start);
            transformStore.updateTranslate({
                x: dragState.startTranslate.x + delta.x,
                y: dragState.startTranslate.y + delta.y,
            });
        }
    }

    function handleMouseUp(event: MouseEvent): void {
        if (dragState.isDragging) {
            dragState.isDragging = false;
            setImageCursor();
            if (imageContainerElement) {
                imageContainerElement.style.transition = `transform ${TIMING.TRANSITION_DURATION} ease`;
            }
            setBodyStyle("user-select", "");
            setBodyStyle("-webkit-user-select", "");
            // 1倍に近い場合は1倍に戻す
            if (
                isNearScale(
                    transformState.scale,
                    ZOOM_CONFIG.DEFAULT_SCALE,
                    ZOOM_CONFIG.THRESHOLD,
                )
            ) {
                resetTransform();
            }
        }
    }

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

            if (tapTimeoutId !== null) {
                clearTimeout(tapTimeoutId);
            }
        };
    });

    onDestroy(() => {
        unsubscribe();
        clearBodyStyles();

        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }

        if (tapTimeoutId !== null) {
            clearTimeout(tapTimeoutId);
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
