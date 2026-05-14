<script lang="ts">
    import { tick } from "svelte";
    import { Portal } from "bits-ui";

    let {
        show = false,
        x = 0,
        y = 0,
        children = undefined,
    } = $props<{
        show?: boolean;
        x?: number;
        y?: number;
        children?: () => any;
    }>();

    let container: HTMLDivElement | undefined = $state();
    let messageX = $state(0);
    let messageY = $state(0);

    const SCREEN_PADDING = 10;

    $effect(() => {
        messageX = x;
        messageY = y;
    });

    $effect(() => {
        if (!show || !container) return;

        (async () => {
            await tick();
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            let finalX = x;
            let finalY = y;

            if (finalX + rect.width + SCREEN_PADDING > vw) {
                finalX = vw - rect.width - SCREEN_PADDING;
            }
            if (finalX - SCREEN_PADDING < 0) {
                finalX = SCREEN_PADDING;
            }

            if (finalY + rect.height + SCREEN_PADDING > vh) {
                finalY = vh - rect.height - SCREEN_PADDING;
            }
            if (finalY - SCREEN_PADDING < 0) {
                finalY = SCREEN_PADDING;
            }

            messageX = finalX;
            messageY = finalY;
        })();
    });
</script>

{#if show}
    <Portal>
        <div
            bind:this={container}
            class="floating-message"
            style="left: {messageX}px; top: {messageY}px;"
            role="status"
            aria-live="polite"
            aria-atomic="true"
        >
            <div class="floating-message-body">
                <span class="info-icon svg-icon" aria-hidden="true"></span>
                <div class="floating-message-content">
                    {@render children?.()}
                </div>
            </div>
        </div>
    </Portal>
{/if}

<style>
    .floating-message {
        background: var(--dialog-bg, #fff);
        color: var(--text, #000);
        border: 1px solid var(--border, #ccc);
        border-radius: 8px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
        padding: 10px 12px;
        max-width: 320px;
        position: fixed;
        z-index: 100001;
        display: inline-flex;
        align-items: flex-start;
        white-space: nowrap;
        pointer-events: none;
    }

    .floating-message-body {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        width: 100%;
    }

    .floating-message-content {
        padding: 0 2px;
        font-size: 1rem;
        font-weight: bold;
        color: var(--text);
        text-align: center;
    }

    .info-icon {
        mask-image: url("/icons/info_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
        width: 24px;
        height: 24px;
        min-width: 24px;
    }
</style>
