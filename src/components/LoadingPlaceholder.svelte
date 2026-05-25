<script lang="ts">
    import { _ } from "svelte-i18n";
    import { sanitizeHtmlAllowingWbr } from "../lib/utils/htmlSanitizer";
    interface Props {
        text?: string | boolean;
        showLoader?: boolean;
        customClass?: string;
        state?: "loading" | "complete";
        loaderSize?: number | string;
    }

    let {
        text = false,
        showLoader = false,
        customClass = "",
        state = undefined,
        loaderSize = 40,
    }: Props = $props();

    // デフォルトテキストを国際化対応で設定
    let displayText = $derived(
        typeof text === "string"
            ? text
            : text === true
              ? $_("loadingPlaceholder.loading")
              : "",
    );

    let safeDisplayText = $derived(sanitizeHtmlAllowingWbr(displayText));
    let isLoading = $derived(state ? state === "loading" : showLoader);
    let loaderSizeValue = $derived(
        typeof loaderSize === "number" ? `${loaderSize}px` : loaderSize,
    );
</script>

<div class="loading-placeholder {customClass}" aria-label={displayText}>
    {#if isLoading}
        <div class="loader-container" style:--loader-size={loaderSizeValue}>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
        </div>
    {/if}
    {#if displayText}
        <span class="placeholder-text" class:loading-text={isLoading}
            >{@html safeDisplayText}</span
        >
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
        column-gap: 8px;
        position: relative;
        width: 100%;
    }
    .placeholder-text {
        padding: 0 4px;
        color: var(--text);
        opacity: 0.8;
        font-size: 0.875rem;
        font-weight: 500;
    }

    :global(.primary .loading-placeholder .placeholder-text) {
        color: whitesmoke;
        opacity: 0.9;
    }

    .loading-text {
        animation: pulse-text 1.5s ease-in-out infinite;
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
        width: var(--loader-size);
        height: var(--loader-size);
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

    :global(.primary.loading .loader-container .square) {
        background-color: whitesmoke;
    }

    /* アニメーションの定義 */
    @keyframes compactFloatAndRotate {
        0% {
            transform: translate(-25%, -25%) scale(1) rotate(0deg);
        }
        20% {
            transform: translate(
                    calc(var(--loader-size) * 0.3),
                    calc(var(--loader-size) * 0.25)
                )
                scale(0.6) rotate(-170deg);
        }
        40% {
            transform: translate(
                    calc(var(--loader-size) * 0.2),
                    calc(var(--loader-size) * -0.05)
                )
                scale(1.05) rotate(200deg);
        }
        60% {
            transform: translate(
                    calc(var(--loader-size) * -0.05),
                    calc(var(--loader-size) * -0.1)
                )
                scale(0.9) rotate(-220deg);
        }
        80% {
            transform: translate(0, calc(var(--loader-size) * 0.3)) scale(0.5)
                rotate(0deg);
        }
        100% {
            transform: translate(-25%, -25%) scale(1) rotate(360deg);
        }
    }
    /* 各正方形のサイズとアニメーション開始タイミングを個別に設定 */
    .square:nth-child(1) {
        width: calc(var(--loader-size) * 0.2);
        height: calc(var(--loader-size) * 0.2);
        animation-delay: -4s;
    }
    .square:nth-child(2) {
        width: calc(var(--loader-size) * 0.3);
        height: calc(var(--loader-size) * 0.3);
        animation-delay: -3s;
    }
    .square:nth-child(3) {
        width: calc(var(--loader-size) * 0.35);
        height: calc(var(--loader-size) * 0.35);
        animation-delay: -1s;
    }
    .square:nth-child(4) {
        width: calc(var(--loader-size) * 0.45);
        height: calc(var(--loader-size) * 0.45);
        animation-delay: -2s;
    }
</style>
