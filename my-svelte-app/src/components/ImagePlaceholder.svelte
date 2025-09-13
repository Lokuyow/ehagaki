<!-- filepath: d:\ドキュメント\GitHub\ehagaki\my-svelte-app\src\components\ImagePlaceholder.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { renderBlurhashToCanvas } from "../lib/tags/imetaTag";
    import {
        getPlaceholderDefaultSize,
        type ImageDimensions,
    } from "../lib/imageUtils";

    interface Props {
        blurhash?: string;
        width?: number;
        height?: number;
        alt?: string;
        showLoadingIndicator?: boolean;
        dimensions?: ImageDimensions; // 新規追加
    }

    let {
        blurhash = "",
        width,
        height,
        showLoadingIndicator = true,
        dimensions, // 新規追加
    }: Props = $props();

    let canvasRef: HTMLCanvasElement | undefined = $state();

    // 使用するサイズを決定
    const finalDimensions = $derived(() => {
        if (dimensions) return dimensions;
        if (width && height) {
            return {
                width,
                height,
                displayWidth: width,
                displayHeight: height,
            };
        }
        return getPlaceholderDefaultSize();
    });

    // blurhashをデコードしてcanvasに描画
    function renderBlurhash() {
        if (!blurhash || !canvasRef) return;

        const dims = finalDimensions();
        renderBlurhashToCanvas(
            blurhash,
            canvasRef,
            dims.displayWidth,
            dims.displayHeight,
        );
    }

    onMount(() => {
        if (blurhash && canvasRef) {
            renderBlurhash();
        }
    });

    // blurhashが変更された時の再描画
    $effect(() => {
        if (blurhash && canvasRef) {
            renderBlurhash();
        }
    });

    onDestroy(() => {
        // キャンバスのクリーンアップ
        if (canvasRef) {
            const dims = finalDimensions();
            const ctx = canvasRef.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, dims.displayWidth, dims.displayHeight);
            }
        }
    });
</script>

<div
    class="image-placeholder"
    style="width: {finalDimensions().displayWidth}px; height: {finalDimensions()
        .displayHeight}px;"
>
    {#if blurhash}
        <canvas
            bind:this={canvasRef}
            width={finalDimensions().displayWidth}
            height={finalDimensions().displayHeight}
            class="blurhash-canvas"
        ></canvas>
    {/if}

    {#if showLoadingIndicator}
        <div class="loading-overlay">
            <div class="loading-spinner"></div>
        </div>
    {/if}
</div>

<style>
    .image-placeholder {
        position: relative;
        border: 1px solid var(--border);
        border-radius: 6px;
        overflow: hidden;
        margin: 8px 0;
        background: var(--bg-input);
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 100%;
        max-height: 240px; /* この値をimageUtils.tsの制約と一致させる */
    }

    .blurhash-canvas {
        max-width: 100%;
        max-height: 240px; /* この値をimageUtils.tsの制約と一致させる */
        object-fit: cover;
        filter: blur(1px);
        opacity: 0.8;
    }

    .loading-overlay {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        padding: 8px;
    }

    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    /* アニメーション効果 */
    .image-placeholder {
        animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
