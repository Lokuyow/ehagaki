<script lang="ts">
    import { Progress } from "bits-ui";
    import Button from "./Button.svelte";

    interface Props {
        text: string;
        value: number;
        ariaLabel: string;
        ariaValueText?: string;
        showAbort?: boolean;
        abortAriaLabel?: string;
        onAbort?: () => void;
    }

    let {
        text,
        value,
        ariaLabel,
        ariaValueText = text,
        showAbort = false,
        abortAriaLabel = "中止",
        onAbort,
    }: Props = $props();

    function clampProgressValue(currentValue: number): number {
        return Math.min(100, Math.max(0, Math.round(currentValue)));
    }

    function getProgressIndicatorStyle(currentValue: number): string {
        return `transform: translateX(-${100 - clampProgressValue(currentValue)}%);`;
    }

    let normalizedValue = $derived(clampProgressValue(value));
</script>

{#if showAbort}
    <div class="footer-progress-layout">
        <Button
            variant="danger"
            shape="circle"
            className="footer-progress-abort-button"
            ariaLabel={abortAriaLabel}
            onClick={() => onAbort?.()}
        >
            <div class="footer-progress-stop-icon svg-icon"></div>
        </Button>
        <div class="footer-progress-content">
            <div class="footer-progress-text">{text}</div>
            <Progress.Root
                value={normalizedValue}
                max={100}
                aria-label={ariaLabel}
                aria-valuetext={ariaValueText}
                class="footer-progress-root"
            >
                <div
                    class="footer-progress-indicator"
                    style={getProgressIndicatorStyle(normalizedValue)}
                ></div>
            </Progress.Root>
        </div>
    </div>
{:else}
    <div class="footer-progress-content">
        <div class="footer-progress-text">{text}</div>
        <Progress.Root
            value={normalizedValue}
            max={100}
            aria-label={ariaLabel}
            aria-valuetext={ariaValueText}
            class="footer-progress-root"
        >
            <div
                class="footer-progress-indicator"
                style={getProgressIndicatorStyle(normalizedValue)}
            ></div>
        </Progress.Root>
    </div>
{/if}

<style>
    .footer-progress-layout {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
    }

    .footer-progress-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        width: 100%;
        padding-bottom: 4px;
    }

    .footer-progress-text {
        font-size: 0.875rem;
        color: var(--text);
        text-align: center;
        white-space: normal;
        flex: 1;
    }

    :global(.footer-progress-abort-button) {
        width: 40px;
        height: 40px;
        flex-shrink: 0;
        cursor: pointer;
        pointer-events: auto;
        position: relative;
        z-index: 10;
    }

    .footer-progress-stop-icon {
        mask-image: url("/icons/stop-solid-full.svg");
        width: 22px;
        height: 22px;
        background-color: #f0f0f0;
    }

    :global(.footer-progress-root) {
        width: 100%;
        height: 14px;
        background-color: white;
        overflow: hidden;
    }

    :global(.footer-progress-indicator) {
        width: 100%;
        height: 100%;
        background-color: var(--theme);
        transition: transform 0.3s ease;
    }
</style>
