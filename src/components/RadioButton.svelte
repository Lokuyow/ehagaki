<script lang="ts">
    import { RadioGroup } from "bits-ui";
    import Button from "./Button.svelte";

    interface Props {
        value: string; // 必須: ラジオボタンの値
        disabled?: boolean;
        variant?:
            | "default"
            | "primary"
            | "danger"
            | "secondary"
            | "warning"
            | "header";
        shape?: "square" | "rounded" | "pill" | "circle";
        className?: string;
        ariaLabel?: string;
        style?: string;
        children?: import("svelte").Snippet;
    }

    let {
        value,
        disabled = false,
        variant = "default",
        shape = "rounded",
        className = "",
        ariaLabel = "",
        style = "",
        children,
    }: Props = $props();
</script>

<RadioGroup.Item {value} {disabled} aria-label={ariaLabel}>
    {#snippet child({ props, checked })}
        <Button
            {...props}
            {variant}
            {shape}
            {className}
            {ariaLabel}
            {style}
            {disabled}
            selected={checked}
        >
            {@render children?.()}
        </Button>
    {/snippet}
</RadioGroup.Item>
