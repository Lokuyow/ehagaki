<script lang="ts">
    import { _ } from "svelte-i18n";
    export let text: string = "";
    export let showImage: boolean = true;
    export let showSpinner: boolean = false;
    export let customClass: string = "";

    // デフォルトテキストを国際化対応で設定
    $: displayText = text || $_("loading");
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
        gap: 8px;
        position: relative;
    }
    .placeholder-image {
        background: var(--darker);
        border-radius: 50%;
        animation: pulse 1.5s ease-in-out infinite;
        width: 32px;
        height: 32px;
        flex-shrink: 0;
    }
    .placeholder-text {
        color: var(--text);
        opacity: 0.6;
        font-size: 1rem;
        font-weight: 500;
    }
    .loading-text {
        animation: pulse-text 1.5s ease-in-out infinite;
    }
    .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid var(--text, white);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        flex-shrink: 0;
        background: transparent;
        margin-right: 2px;
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
