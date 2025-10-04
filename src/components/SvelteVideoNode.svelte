<script lang="ts">
    import type { NodeViewProps } from "@tiptap/core";
    import { NodeViewWrapper } from "svelte-tiptap";
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";

    interface Props {
        node: NodeViewProps["node"];
        selected: boolean;
        getPos: NodeViewProps["getPos"];
    }

    let { node, selected }: Props = $props();

    let videoElement: HTMLVideoElement | undefined = $state();
    let isLoaded = $state(false);

    // プレースホルダーかどうかを判定
    let isPlaceholder = $derived(
        node.attrs.src?.startsWith("placeholder-") ||
            node.attrs.src?.startsWith("blob:") ||
            !node.attrs.src,
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

    onMount(() => {
        // 必要に応じて初期化処理
    });
</script>

<NodeViewWrapper>
    <div class="video-wrapper" class:selected data-video-node>
        {#if isPlaceholder}
            <!-- アップロード中のローディング表示 -->
            <div class="video-placeholder">
                <div class="loading-spinner"></div>
                <p class="loading-text">{$_("videoNode.uploading")}</p>
            </div>
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
                onloadeddata={handleVideoLoad}
                onerror={handleVideoError}
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
    }

    .video-wrapper.selected {
        outline: 2px solid var(--theme);
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
    }

    .editor-video.loaded {
        opacity: 1;
    }

    /* プレースホルダー（ローディング）表示 */
    .video-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 40px;
        border-radius: 6px;
        box-sizing: border-box;
    }

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(128, 128, 128, 0.2);
        border-top-color: var(--theme, #333);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .loading-text {
        margin-top: 16px;
        font-size: 1rem;
        color: var(--text);
        opacity: 0.8;
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
