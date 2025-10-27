<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import { openContextMenuForVideoNode } from "../lib/utils/videoContextMenuUtils";
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

    let videoElement: HTMLVideoElement | undefined = $state();
    let isLoaded = $state(false);
    let wrapperElement: HTMLDivElement | undefined = $state();

    // プレースホルダーかどうかを判定（node.attrsの変更を監視）
    let isPlaceholder = $derived(
        node.attrs.isPlaceholder === true ||
            node.attrs.src?.startsWith("placeholder-") ||
            node.attrs.src?.startsWith("blob:") ||
            !node.attrs.src,
    );

    // ノード固有のID（id属性を使用、なければ位置）
    let nodeId = $derived(
        node.attrs.id || (typeof getPos === "function" ? (getPos() ?? "unknown").toString() : "unknown")
    );

    // 動画の読み込み完了時
    function handleVideoLoad() {
        isLoaded = true;
    }

    // 動画の読み込みエラー時
    function handleVideoError() {
        // プレースホルダーの場合はエラーログを出さない
        if (!isPlaceholder) {
            console.error("Failed to load video:", node.attrs.src);
        }
    }

    // 全画面状態を判定
    function isFullscreen(): boolean {
        return !!(
            document.fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).mozFullScreenElement ||
            (document as any).msFullscreenElement
        );
    }

    // クリックハンドラー（動画コントロールと干渉しないように）
    function handleWrapperClick(event: MouseEvent) {
        // プレースホルダーの場合もコンテキストメニューを表示しない
        if (isPlaceholder) {
            return;
        }

        // 全画面表示中はコンテキストメニューを無効化（通常の動画コントロールを優先）
        if (isFullscreen()) {
            return;
        }

        // 動画要素のクリックは handleVideoClick で処理されるのでここでは何もしない
        if (event.target === videoElement) {
            return;
        }

        // イベントの伝播を停止
        event.stopPropagation();
        event.preventDefault();

        const pos = getEventPosition(event);
        lastClickPositionStore.set(pos);

        // コンテキストメニューを開く
        openContextMenuForVideoNode(
            globalContextMenuStore,
            nodeId,
            pos,
            node.attrs.src || "",
            videoElement,
        );
    }

    // 動画要素のクリックハンドラー
    function handleVideoClick(event: MouseEvent) {
        if (isPlaceholder) {
            return;
        }

        // 全画面表示中はコンテキストメニューを無効化（通常の動画コントロールを優先）
        if (isFullscreen()) {
            return;
        }

        // コントロール領域のクリックかどうかを判定
        // 動画要素の下部（コントロールバー）をクリックした場合はコンテキストメニューを表示しない
        if (videoElement) {
            const rect = videoElement.getBoundingClientRect();
            const clickY = event.clientY;
            const videoBottom = rect.bottom;
            const controlBarHeight = 48; // コントロールバーの高さ（概算）

            // コントロールバー領域のクリックの場合は何もしない
            if (clickY > videoBottom - controlBarHeight) {
                return;
            }
        }

        // 右クリックの場合は何もしない（ブラウザのコンテキストメニューを優先）
        if (event.button === 2) {
            return;
        }

        // イベントの伝播を停止（重要！）
        event.stopPropagation();
        event.preventDefault();

        const pos = getEventPosition(event);
        lastClickPositionStore.set(pos);

        // コンテキストメニューを開く
        openContextMenuForVideoNode(
            globalContextMenuStore,
            nodeId,
            pos,
            node.attrs.src || "",
            videoElement,
        );
    }

    // キーボードイベントハンドラー
    function handleWrapperKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            // クリックイベントと同じ処理を実行
            const pos = { x: 0, y: 0 }; // キーボード操作の場合は座標が取れないため、デフォルト値
            lastClickPositionStore.set(pos);

            if (!isPlaceholder) {
                openContextMenuForVideoNode(
                    globalContextMenuStore,
                    nodeId,
                    pos,
                    node.attrs.src || "",
                    videoElement,
                );
            }
        }
    }

    // タッチイベントハンドラー（Android対応）
    let touchStartTime = 0;
    let touchStartPos = { x: 0, y: 0 };
    const TAP_THRESHOLD = 200; // タップと判定する時間（ミリ秒）
    const MOVE_THRESHOLD = 10; // 移動と判定する距離（ピクセル）

    function handleVideoTouchStart(event: TouchEvent) {
        if (isPlaceholder || event.touches.length !== 1) {
            return;
        }

        touchStartTime = Date.now();
        const touch = event.touches[0];
        touchStartPos = { x: touch.clientX, y: touch.clientY };
    }

    function handleVideoTouchEnd(event: TouchEvent) {
        if (isPlaceholder) {
            return;
        }

        // 全画面表示中はコンテキストメニューを無効化（通常の動画コントロールを優先）
        if (isFullscreen()) {
            return;
        }

        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;

        // タップ判定（短時間で指を離した）
        if (
            touchDuration < TAP_THRESHOLD &&
            event.changedTouches.length === 1
        ) {
            const touch = event.changedTouches[0];
            const touchEndPos = { x: touch.clientX, y: touch.clientY };

            // 移動距離を計算
            const moveDistance = Math.sqrt(
                Math.pow(touchEndPos.x - touchStartPos.x, 2) +
                    Math.pow(touchEndPos.y - touchStartPos.y, 2),
            );

            // ほとんど移動していない場合のみタップと判定
            if (moveDistance < MOVE_THRESHOLD) {
                // コントロール領域のチェック
                if (videoElement) {
                    const rect = videoElement.getBoundingClientRect();
                    const touchY = touch.clientY;
                    const videoBottom = rect.bottom;
                    const controlBarHeight = 48;

                    if (touchY > videoBottom - controlBarHeight) {
                        return;
                    }
                }

                // イベントの伝播を停止
                event.stopPropagation();
                event.preventDefault();

                const pos = { x: touch.clientX, y: touch.clientY };
                lastClickPositionStore.set(pos);

                // コンテキストメニューを開く
                openContextMenuForVideoNode(
                    globalContextMenuStore,
                    nodeId,
                    pos,
                    node.attrs.src || "",
                );
            }
        }
    }

    onMount(() => {
        // タッチデバイス用の能動的なイベントリスナーを追加（Android対応）
        if (videoElement) {
            // passive: false を指定して preventDefault() を有効にする
            videoElement.addEventListener(
                "touchstart",
                handleVideoTouchStart as EventListener,
                { passive: false },
            );
            videoElement.addEventListener(
                "touchend",
                handleVideoTouchEnd as EventListener,
                { passive: false },
            );
        }

        return () => {
            // クリーンアップ
            if (videoElement) {
                videoElement.removeEventListener(
                    "touchstart",
                    handleVideoTouchStart as EventListener,
                );
                videoElement.removeEventListener(
                    "touchend",
                    handleVideoTouchEnd as EventListener,
                );
            }
        };
    });
</script>

<NodeViewWrapper>
    <div
        class="video-wrapper"
        class:selected
        data-video-node
        bind:this={wrapperElement}
        onclick={handleWrapperClick}
        onkeydown={handleWrapperKeydown}
        role="button"
        tabindex="0"
    >
        {#if isPlaceholder}
            <!-- アップロード中のローディング表示 -->
            <LoadingPlaceholder
                text={$_("videoNode.uploading")}
                showLoader={true}
            />
        {:else}
            <!-- 実際の動画 -->
            <video
                bind:this={videoElement}
                src={node.attrs.src}
                controls
                playsinline
                autoplay
                muted
                loop
                class="editor-video"
                class:loaded={isLoaded}
                data-node-id={nodeId}
                onloadeddata={handleVideoLoad}
                onerror={handleVideoError}
                onclick={handleVideoClick}
                ontouchstart={handleVideoTouchStart}
                ontouchend={handleVideoTouchEnd}
                preload="metadata"
            >
                <track kind="captions" />
                {$_("videoNode.not_supported")}
            </video>
        {/if}
    </div>
</NodeViewWrapper>

<style>
    :global([data-node-view-wrapper]) {
        display: block;
        margin: 8px 0;
    }

    .video-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 100%;
        min-height: 150px;
        max-height: 380px;
        position: relative;
        border-radius: 6px;
        overflow: hidden;
        aspect-ratio: 16 / 9;
        cursor: pointer;

        &:active {
            transform: scale(1.0);
            transition: transform 0.1s cubic-bezier(0, 1, 0.5, 1);
        }
    }

    .video-wrapper.selected {
        outline: 2px solid var(--theme);

        :global(span.placeholder-text.loading-text) {
            font-size: 1.125rem;
        }
    }

    .editor-video {
        max-width: 100%;
        max-height: 380px;
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: auto;
        cursor: pointer;
    }

    .editor-video.loaded {
        opacity: 1;
    }

    @media (prefers-color-scheme: light) {
        .video-wrapper {
            background-color: rgba(0, 0, 0, 0.1);
        }
    }
    @media (prefers-color-scheme: dark) {
        .video-wrapper {
            background-color: rgba(0, 0, 0, 0.3);
        }
    }
</style>
