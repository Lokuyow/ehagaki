<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";
    import { _ } from "svelte-i18n";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import MediaActionButtons from "./MediaActionButtons.svelte";
    import {
        requestNodeSelection,
        isMediaPlaceholder,
    } from "../lib/utils/mediaNodeUtils";
    import { useMediaLoadState } from "../lib/hooks/useMediaLoadState.svelte";
    import { useLongPress } from "../lib/hooks/useLongPress.svelte";

    interface Props {
        node: NodeViewProps["node"];
        selected: boolean;
        getPos: NodeViewProps["getPos"];
        deleteNode: NodeViewProps["deleteNode"];
    }

    let { node, selected, getPos, deleteNode }: Props = $props();

    let videoElement: HTMLVideoElement | undefined = $state();
    let wrapperElement: HTMLDivElement | undefined = $state();

    const mediaLoad = useMediaLoadState();

    // プレースホルダーかどうかを判定（node.attrsの変更を監視）
    let isPlaceholder = $derived(isMediaPlaceholder(node.attrs));

    // ノード固有のID（video要素のdata-node-id用）
    let nodeId = $derived(
        node.attrs.id ||
            (typeof getPos === "function"
                ? (getPos() ?? "unknown").toString()
                : "unknown"),
    );

    // 全画面状態を判定
    function isFullscreen(): boolean {
        return !!(
            document.fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).mozFullScreenElement ||
            (document as any).msFullscreenElement
        );
    }

    // タップ検出（Android 対応）— 動画の再生/停止を容許しつつノード選択
    const VIDEO_CONTROL_BAR_HEIGHT = 48;
    useLongPress(() => videoElement, {
        onTap: (event) => {
            if (isPlaceholder || isFullscreen()) return;
            const touch = event.changedTouches[0];
            if (videoElement) {
                const rect = videoElement.getBoundingClientRect();
                if (touch.clientY > rect.bottom - VIDEO_CONTROL_BAR_HEIGHT)
                    return;
            }
            event.stopPropagation();
            requestNodeSelection(getPos);
        },
        delay: 200,
        moveThreshold: 10,
    });

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
            const controlBarHeight = VIDEO_CONTROL_BAR_HEIGHT;

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
                    class:loaded={mediaLoad.isLoaded}
                    data-node-id={nodeId}
                    onloadeddata={mediaLoad.handleLoad}
                    onerror={mediaLoad.handleError}
                    onclick={handleVideoClick}
                    preload="metadata"
                >
                    <track kind="captions" />
                    {$_("videoNode.not_supported")}
                </video>
            {/if}
        </div>
        {#if !isPlaceholder}
            <MediaActionButtons
                src={node.attrs.src}
                onDelete={deleteNode}
                deleteAriaLabel={$_("videoContextMenu.delete")}
                copyAriaLabel={$_("videoContextMenu.copyUrl")}
                copySuccessMessage={$_("videoContextMenu.copySuccess")}
                layout="editor-video"
            />
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

    :global(:root.light) .video-wrapper {
        background-color: rgba(0, 0, 0, 0.1);
    }
    :global(:root.dark) .video-wrapper {
        background-color: rgba(0, 0, 0, 0.3);
    }
</style>
