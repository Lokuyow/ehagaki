<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let className: string = "";
    export let disabled: boolean = false;
    export let type: "button" | "submit" | "reset" = "button";
    export let ariaLabel: string = "";
    export let style: string = "";
    export let variant:
        | "default"
        | "primary"
        | "danger"
        | "secondary"
        | "warning" = "default";
    // shapeプロパティ追加
    export let shape: "square" | "rounded" | "pill" | "circle" = "rounded";

    const dispatch = createEventDispatcher();

    function handleClick(event: MouseEvent) {
        dispatch("click", event);
    }
</script>

<button
    {type}
    class={`${className} ${variant} ${shape}`}
    {disabled}
    aria-label={ariaLabel}
    {style}
    on:click={handleClick}
>
    <slot />
</button>

<style>
    /* --- Variant Styles --- */
    .default {
        border: 1px solid var(--btn-border);
        background-color: var(--btn-bg);
        padding: 12px 18px 12px 16px;
        gap: 8px;

        :global(.svg-icon) {
            width: 24px;
            height: 24px;
        }

        :global(.btn-text) {
            color: var(--text-light);
            font-size: 1rem;
            font-weight: 500;
        }
    }

    .primary {
        --btn-bg: var(--theme);
        color: white;
        font-weight: 500;
        padding: 12px 18px 12px 16px;
        gap: 8px;
        border: none;
        z-index: 10;

        :global(.svg-icon) {
            --svg: white;
            width: 28px;
            height: 28px;
        }

        :global(.btn-text) {
            color: whitesmoke;
            font-size: 1rem;
            font-weight: 500;
        }
    }

    .secondary {
        background-color: #fff;
        --text: var(--text-black);
        --btn-border: hsl(0, 0%, 86%);
    }

    .danger {
        background-color: #ef4444;
        color: white;
        border: 1px solid #ef4444;
    }

    .warning {
        --btn-bg: hsl(58, 99%, 68%);
        --text: var(--text-black);
        border: none;
    }

    .btn-danger {
        --btn-bg: var(--danger);
        color: #fff;
        border: none;
    }

    /* --- Shape Styles --- */
    .square {
        border-radius: 0;
        padding: 0;

        :global(.svg-icon) {
            width: 30px;
            height: 30px;
        }
    }
    .rounded {
        border-radius: 6px;
    }
    .pill {
        border-radius: 50px;
        padding: 0;
    }
    .circle {
        border-radius: 50%;
        width: 50px;
        height: 50px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        :global(.svg-icon) {
            width: 28px;
            height: 28px;
        }
    }
</style>
