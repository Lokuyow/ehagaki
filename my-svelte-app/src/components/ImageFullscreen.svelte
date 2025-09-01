<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    // 定数定義
    const ZOOM_CONFIG = {
        MIN_SCALE: 0.5,
        MAX_SCALE: 5,
        DEFAULT_SCALE: 1,
        DOUBLE_CLICK_SCALE: 2.5,
        ZOOM_DELTA: { IN: 1.1, OUT: 0.9 },
        THRESHOLD: 0.5,
    } as const;

    const TIMING = {
        EDITOR_FOCUS_DELAY: 100,
        TRANSITION_DURATION: "0.3s",
    } as const;

    const SELECTORS = {
        EDITOR: ".tiptap-editor",
    } as const;

    // 型定義
    interface Position {
        x: number;
        y: number;
    }

    interface TransformState {
        scale: number;
        translate: Position;
    }

    // Props
    export let src: string = "";
    export let alt: string = "";
    export let show: boolean = false;
    export let onClose: () => void = () => {};

    // DOM要素の参照
    let imageElement: HTMLImageElement;
    let containerElement: HTMLDivElement;
    let imageContainerElement: HTMLDivElement;

    // 変換状態
    let transformState: TransformState = {
        scale: ZOOM_CONFIG.DEFAULT_SCALE,
        translate: { x: 0, y: 0 },
    };

    // ドラッグ状態
    let dragState = {
        isDragging: false,
        start: { x: 0, y: 0 },
        startTranslate: { x: 0, y: 0 },
    };

    // その他の状態
    let animationFrameId: number | null = null;
    let historyPushed = false;

    // ユーティリティ関数
    function clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    function isNearScale(scale: number, target: number): boolean {
        return Math.abs(scale - target) < ZOOM_CONFIG.THRESHOLD;
    }

    // 変換関数
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

        transformState.scale = ZOOM_CONFIG.DEFAULT_SCALE;
        transformState.translate = { x: 0, y: 0 };
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

    // フォーカス管理
    function focusEditor(): void {
        setTimeout(() => {
            const editorElement = document.querySelector(
                SELECTORS.EDITOR,
            ) as HTMLElement;
            if (editorElement) {
                editorElement.focus();
            }
        }, TIMING.EDITOR_FOCUS_DELAY);
    }

    // DOM操作ユーティリティ
    function setBodyStyle(property: string, value: string): void {
        document.body.style.setProperty(property, value);
    }

    function clearBodyStyles(): void {
        setBodyStyle("overflow", "");
        setBodyStyle("user-select", "");
        setBodyStyle("-webkit-user-select", "");
    }

    // メインの操作関数
    function close(): void {
        show = false;
        onClose();

        if (historyPushed) {
            clearHistoryState();
            history.back();
        }

        focusEditor();
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

    // イベントハンドラー
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

        if (newScale !== transformState.scale && imageContainerElement) {
            transformState.scale = newScale;

            if (
                transformState.scale === ZOOM_CONFIG.DEFAULT_SCALE ||
                isNearScale(transformState.scale, ZOOM_CONFIG.DEFAULT_SCALE)
            ) {
                resetTransform();
            } else {
                updateTransform();
                setImageCursor();
            }
        }
    }

    function handleMouseDown(event: MouseEvent): void {
        if (transformState.scale <= ZOOM_CONFIG.DEFAULT_SCALE) return;

        dragState.isDragging = true;
        dragState.start = { x: event.clientX, y: event.clientY };
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
            const deltaX = event.clientX - dragState.start.x;
            const deltaY = event.clientY - dragState.start.y;

            transformState.translate.x = dragState.startTranslate.x + deltaX;
            transformState.translate.y = dragState.startTranslate.y + deltaY;

            updateTransform();
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

    function handleDoubleClick(event: MouseEvent): void {
        if (!imageContainerElement || !containerElement) return;

        if (transformState.scale > ZOOM_CONFIG.DEFAULT_SCALE) {
            resetTransform();
        } else {
            // カーソル位置を取得
            const rect = containerElement.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // カーソル位置と画面中心の差分を計算
            const offsetX = event.clientX - rect.left - centerX;
            const offsetY = event.clientY - rect.top - centerY;

            // 拡大率を設定
            transformState.scale = ZOOM_CONFIG.DOUBLE_CLICK_SCALE;

            // カーソル位置が中心に来るように平移を調整
            // 拡大後の座標系で逆方向に移動
            transformState.translate = {
                x: -offsetX,
                y: -offsetY,
            };

            updateTransform();
            setImageCursor();
            imageContainerElement.style.transition = `transform ${TIMING.TRANSITION_DURATION} ease`;
        }
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
