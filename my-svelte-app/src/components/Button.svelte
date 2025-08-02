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
        font-weight: 500;
    }

    .btn-round {
        border-radius: 50%;
        width: 50px;
        height: 50px;
    }
</style>
