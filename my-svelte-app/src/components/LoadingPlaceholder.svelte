<script lang="ts">
    import { _ } from "svelte-i18n";
    export let text: string = "";
    export let showImage: boolean = true;
    export let showSpinner: boolean = false;
    export let customClass: string = "";

    // デフォルトテキストを国際化対応で設定
    $: displayText = text || $_("loadingPlaceholder.loading");
</script>

<div class="loading-placeholder {customClass}" aria-label={displayText}>
    {#if showSpinner}
        <span class="loading-spinner" aria-hidden="true"></span>
    {/if}
    {#if showImage}
        <div class="placeholder-image" aria-hidden="true"></div>
    {/if}
    <span class="placeholder-text loading-text">{displayText}</span>
</div>

<style>
    .loading-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        position: relative;
        width: 100%;
        height: 100%;
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
        font-size: 0.95rem;
        font-weight: 500;
    }
    .loading-text {
        animation: pulse-text 1.5s ease-in-out infinite;
    }
    .loading-spinner {
        width: 20px;
        height: 20px;
        border: 4px solid hsl(0, 0%, 60%);
        border-top: 4px solid hsl(0, 0%, 90%);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        flex-shrink: 0;
        background: transparent;
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
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
</style>
