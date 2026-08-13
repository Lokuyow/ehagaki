<script lang="ts">
    import { Tooltip } from "bits-ui";
    import type { Snippet } from "svelte";
    import Button from "./Button.svelte";
    import { getAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";

    interface Props {
        tooltipContent: string;
        children?: Snippet;
        className?: string;
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        ariaLabel?: string;
        style?: string;
        variant?:
            | "default"
            | "primary"
            | "danger"
            | "secondary"
            | "warning"
            | "header"
            | "footer"
            | "close"
            | "copy";
        shape?: "square" | "rounded" | "pill" | "circle";
        contentLayout?: "text" | "icon" | "iconText";
        onClick?: (event: MouseEvent) => unknown | Promise<unknown>;
        selected?: boolean;
    }

    let {
        tooltipContent,
        children,
        onClick = undefined,
        ariaLabel = "",
        ...buttonProps
    }: Props = $props();
    const overlayTarget = getAppRuntimeEnvironment().overlayTarget;
</script>

<Tooltip.Provider>
    <Tooltip.Root delayDuration={500}>
        <Tooltip.Trigger>
            {#snippet child({ props })}
                {@const { onclick: tooltipOnclick, ...restProps } = props}
                <Button
                    {...buttonProps}
                    {...restProps}
                    ariaLabel={ariaLabel}
                    onClick={(event) => {
                        const result = onClick?.(event);
                        if (typeof tooltipOnclick === "function") {
                            tooltipOnclick(event);
                        }
                        return result;
                    }}
                >
                    {@render children?.()}
                </Button>
            {/snippet}
        </Tooltip.Trigger>
        <Tooltip.Portal to={overlayTarget}>
            <Tooltip.Content
                sideOffset={8}
                class="tooltip-content post-preview-tooltip-content"
            >
                {tooltipContent}
            </Tooltip.Content>
        </Tooltip.Portal>
    </Tooltip.Root>
</Tooltip.Provider>
