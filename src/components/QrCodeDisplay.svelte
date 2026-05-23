<script lang="ts">
    import { generateNip46ConnectionQrSvg } from "../lib/nip46ConnectUiUtils";

    interface Props {
        value: string;
        label: string;
    }

    let { value, label }: Props = $props();

    let qrSvg = $state("");
    let requestId = 0;

    $effect(() => {
        const targetValue = value;
        const currentRequestId = ++requestId;
        qrSvg = "";

        if (!targetValue) {
            return;
        }

        void generateNip46ConnectionQrSvg(targetValue)
            .then((svg) => {
                if (currentRequestId !== requestId || value !== targetValue) {
                    return;
                }

                qrSvg = svg;
            })
            .catch(() => {
                if (currentRequestId !== requestId) {
                    return;
                }

                qrSvg = "";
            });
    });
</script>

<div class="qr-code-frame" data-qr-value={value}>
    {#if qrSvg}
        <div class="qr-code-svg" role="img" aria-label={label}>
            {@html qrSvg}
        </div>
    {:else}
        <div class="qr-code-placeholder" aria-hidden="true"></div>
    {/if}
</div>

<style>
    .qr-code-frame {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        min-height: 320px;
        padding: 16px;
        border-radius: 16px;
        background: #ffffff;
        border: 1px solid color-mix(in srgb, var(--text) 12%, transparent);
        box-sizing: border-box;
    }

    .qr-code-svg {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .qr-code-svg :global(svg) {
        display: block;
        width: min(100%, 288px);
        height: auto;
        background: #ffffff;
    }

    .qr-code-placeholder {
        width: min(100%, 288px);
        aspect-ratio: 1;
        border-radius: 12px;
        background: color-mix(in srgb, var(--text) 6%, #ffffff);
    }
</style>
