<script lang="ts">
    import { _ } from "svelte-i18n";
    interface Props {
        text?: string | boolean;
        showImage?: boolean;
        showLoader?: boolean;
        customClass?: string;
    }

    let {
        text = false,
        showImage = false,
        showLoader = false,
        customClass = "",
    }: Props = $props();

    // デフォルトテキストを国際化対応で設定
    let displayText = $derived(
        typeof text === "string"
            ? text
            : text === true
              ? $_("loadingPlaceholder.loading")
              : "",
    );
</script>

<div class="loading-placeholder {customClass}" aria-label={displayText}>
    {#if showLoader}
        <div class="loader-container">
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
        </div>
    {/if}
    {#if showImage}
        <div class="placeholder-image" aria-hidden="true"></div>
    {/if}
    {#if displayText}
        <span class="placeholder-text loading-text">{displayText}</span>
    {/if}
</div>

<style>
    :global(button:disabled.loading) {
        opacity: 1;
    }
    .loading-placeholder {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        padding: 8px;
        column-gap: 8px;
        position: relative;
        width: 100%;
    }
    .placeholder-image {
        background: var(--darker);
        border-radius: 50%;
        animation: pulse 1.5s ease-in-out infinite;
        width: 46px;
        height: 46px;
        flex-shrink: 0;
    }
    .placeholder-text {
        color: var(--text);
        opacity: 0.6;
        font-weight: 500;
    }
    .loading-text {
        animation: pulse-text 1.5s ease-in-out infinite;
        line-height: 1.5;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 0.6;
        }
        50% {
            opacity: 0.3;
        }
    }
    @keyframes pulse-text {
        0%,
        100% {
            opacity: 0.9;
        }
        50% {
            opacity: 0.6;
        }
    }
    /* shimmer animation for button loading (if needed) */
    :global(.shimmer) {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
        );
        animation: shimmer 1.5s infinite;
        pointer-events: none;
    }
    @keyframes shimmer {
        0% {
            left: -100%;
        }
        100% {
            left: 100%;
        }
    }
    /* 正方形たちをまとめるコンテナ */
    .loader-container {
        position: relative;
        width: 40px;
        height: 40px;
    }
    /* 正方形の基本スタイル */
    .square {
        position: absolute;
        top: 25%;
        left: 25%;
        border: none;
        border-radius: 20%;
        opacity: 1;
        background-color: var(--theme);
        animation: compactFloatAndRotate 4s infinite ease-in-out;
    }
    /* アニメーションの定義 */
    @keyframes compactFloatAndRotate {
        0% {
            transform: translate(-25%, -25%) scale(1) rotate(0deg);
        }
        20% {
            transform: translate(12px, 10px) scale(0.6) rotate(-170deg);
        }
        40% {
            transform: translate(8px, -2px) scale(1.05) rotate(200deg);
        }
        60% {
            transform: translate(-2px, -4px) scale(0.9) rotate(-220deg);
        }
        80% {
            transform: translate(0px, 12px) scale(0.5) rotate(0deg);
        }
        100% {
            transform: translate(-25%, -25%) scale(1) rotate(360deg);
        }
    }
    /* 各正方形のサイズとアニメーション開始タイミングを個別に設定 */
    .square:nth-child(1) {
        width: 8px;
        height: 8px;
        animation-delay: -4s;
    }
    .square:nth-child(2) {
        width: 12px;
        height: 12px;
        animation-delay: -3s;
    }
    .square:nth-child(3) {
        width: 14px;
        height: 14px;
        animation-delay: -1s;
    }
    .square:nth-child(4) {
        width: 18px;
        height: 18px;
        animation-delay: -2s;
    }
</style>
