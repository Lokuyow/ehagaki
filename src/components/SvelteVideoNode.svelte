<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import Button from "./Button.svelte";
    import { requestNodeSelection } from "../lib/utils/editorImageUtils";
    import { copyToClipboard } from "../lib/utils/clipboardUtils";
    import { postComponentUIStore } from "../stores/appStore.svelte";

    interface Props {
        node: NodeViewProps["node"];
        selected: boolean;
        getPos: NodeViewProps["getPos"];
        deleteNode: NodeViewProps["deleteNode"];
    }

    let { node, selected, getPos, deleteNode }: Props = $props();

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

    // ノード固有のID（video要素のdata-node-id用）
    let nodeId = $derived(
        node.attrs.id ||
            (typeof getPos === "function"
                ? (getPos() ?? "unknown").toString()
                : "unknown"),
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

    // クリックハンドラー（ノード選択のみ）
    function handleWrapperClick(event: MouseEvent) {
        // プレースホルダーの場合は何もしない
        if (isPlaceholder) {
            return;
        }

        // 全画面表示中は何もしない
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

        requestNodeSelection(getPos);
    }

    // 動画要素のクリックハンドラー
    function handleVideoClick(event: MouseEvent) {
        if (isPlaceholder) {
            return;
        }

        // 全画面表示中は何もしない
        if (isFullscreen()) {
            return;
        }

        // 右クリックの場合は何もしない（ブラウザのコンテキストメニューを優先）
        if (event.button === 2) {
            return;
        }

        // コントロール領域のクリックかどうかを判定
        // 動画要素の下部（コントロールバー）をクリックした場合は何もしない
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

        // イベントの伝播を停止（エディタ側への伝播を防ぐ）
        event.stopPropagation();
        // preventDefaultは呼ばない（動画の再生/停止を許可）

        requestNodeSelection(getPos);
    }

    // キーボードイベントハンドラー（ノード選択のみ）
    function handleWrapperKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            requestNodeSelection(getPos);
        }
    }

    // 動画ノード削除処理
    function handleDeleteNode(event: MouseEvent) {
        event.stopPropagation(); // 親のクリックイベントを阻止
        deleteNode();
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

        // 全画面表示中は何もしない
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

                // イベントの伝播を停止（エディタ側への伝播を防ぐ）
                event.stopPropagation();
                // preventDefaultは呼ばない（動画の再生/停止を許可）

                requestNodeSelection(getPos);
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
    <div class="video-node-container">
        <div
            class="video-wrapper"
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
        {#if !isPlaceholder}
            <Button
                variant="close"
                shape="circle"
                className="video-close-button"
                ariaLabel={$_("videoContextMenu.delete")}
                onClick={handleDeleteNode}
            >
                <div class="close-icon svg-icon"></div>
            </Button>
            <Button
                variant="copy"
                shape="circle"
                className="video-copy-button"
                ariaLabel={$_("videoContextMenu.copyUrl")}
                onClick={(event) => {
                    event.stopPropagation();
                    copyToClipboard(node.attrs.src, "video URL");
                    const pos = { x: event.clientX, y: event.clientY };
                    postComponentUIStore.showPopupMessage(
                        pos.x,
                        pos.y,
                        $_("videoContextMenu.copySuccess"),
                    );
                }}
            >
                <div class="copy-icon svg-icon"></div>
            </Button>
        {/if}
    </div>
</NodeViewWrapper>

<style>
    :global(.node-video) {
        margin: 12px 0;
    }
    :global([data-node-view-wrapper]) {
        display: block;
        margin: 0;
    }

    /* 動画ノードコンテナ */
    .video-node-container {
        position: relative;
        display: inline-block;
        width: 100%;
        max-width: 100%;

        :global(.video-close-button) {
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

        :global(.video-copy-button) {
            position: absolute;
            top: 52px;
            right: 6px;
            z-index: 10;
            width: 40px;
            height: 40px;
        }
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
            transform: scale(1);
        }
    }

    :global(.node-video.is-node-focused .video-wrapper) {
        outline: 2px solid var(--theme);
    }

    :global(.node-video.is-node-focused span.placeholder-text.loading-text) {
        font-size: 1.125rem;
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
