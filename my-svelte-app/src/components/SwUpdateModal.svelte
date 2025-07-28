<script lang="ts">
    export let show: boolean;
    export let onReload: () => void;
    export let message: string; // i18n対応メッセージ
    let popoverEl: HTMLDivElement | null = null;

    $: if (show && popoverEl) {
        popoverEl.showPopover?.();
        setTimeout(() => {
            onReload();
        }, 2000);
    }
</script>

{#if show}
    <div class="sw-update-popover" popover="manual" bind:this={popoverEl}>
        <div class="sw-update-popover-content">
            <p>{message}</p>
        </div>
    </div>
{/if}

<style>
    .sw-update-popover {
        position: fixed;
        left: 50%;
        bottom: 32px;
        transform: translateX(-50%);
        z-index: 3000;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 12px;
        box-shadow: 0 2px 16px #0005;
        padding: 24px 32px;
        color: #fff;
        text-align: center;
        min-width: 280px;
        max-width: 90vw;
        font-size: 1.1rem;
        pointer-events: auto;
    }
</style>
