<script lang="ts">
    export let show: boolean = false;
    export let onClose: () => void;
    export let ariaLabel: string = "Dialog";
    export let className: string = "";
</script>

{#if show}
    <div
        class="dialog-overlay"
        role="presentation"
        on:click={onClose}
        on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") onClose();
        }}
        aria-label={ariaLabel}
    >
        <div
            class="dialog {className} {$$props.class || ''}"
            role="dialog"
            aria-modal="true"
            tabindex="0"
            on:click|stopPropagation
            on:keydown={(e) => {
                if (e.key === "Escape") onClose();
            }}
        >
            <slot />
        </div>
    </div>
{/if}

<style>
    .dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    .dialog {
        background: var(--bg-dialog);
        color: var(--text);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 500px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 16px;
    }
</style>
