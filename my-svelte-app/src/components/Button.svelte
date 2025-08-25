<script lang="ts">
    export let className: string = "";
    export let disabled: boolean = false;
    export let type: "button" | "submit" | "reset" = "button";
    export let ariaLabel: string = "";
    export let style: string = "";
</script>

<button
    {type}
    class={className}
    {disabled}
    aria-label={ariaLabel}
    {style}
    on:click
>
    <slot />
</button>

<style>
    .btn {
        border-radius: 6px;
        padding: 12px 18px 12px 14px;
        gap: 6px;

        :global(.svg-icon) {
            width: 26px;
            height: 26px;
        }

        :global(.btn-text) {
            color: var(--text-light);
            font-size: 1.1rem;
            font-weight: 500;
        }
    }

    .btn-angular {
        border-radius: 0;
    }

    .btn-round {
        border-radius: 50px;
    }

    .btn-circle {
        border-radius: 50%;
        width: 50px;
        height: 50px;
    }
</style>
