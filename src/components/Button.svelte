<script lang="ts">
    import { onDestroy } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";
    import FloatingMessage from "./FloatingMessage.svelte";

    interface Props extends HTMLButtonAttributes {
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
        children?: import("svelte").Snippet;
        onClick?: (event: MouseEvent) => unknown | Promise<unknown>;
        selected?: boolean;
        floatingMessage?: string;
        floatingMessageDuration?: number;
    }

    let {
        className = "",
        class: classAttr = "",
        disabled = false,
        type = "button",
        ariaLabel = "",
        style = "",
        variant = undefined,
        shape = undefined,
        contentLayout = undefined,
        children,
        onClick = undefined,
        selected = false,
        floatingMessage = "",
        floatingMessageDuration = 1800,
        ...restProps
    }: Props = $props();

    let showFloatingMessage = $state(false);
    let floatingMessageX = $state(0);
    let floatingMessageY = $state(0);
    let floatingMessageTimeout: ReturnType<typeof setTimeout> | undefined;

    let variantClass = $derived(variant ?? "");
    let contentLayoutClass = $derived(
        contentLayout ? `content-${contentLayout}` : "",
    );
    let computedClassName = $derived(`${classAttr} ${className}`.trim());
    let shapeClass = $derived(shape ?? "");

    function clearFloatingMessageTimeout() {
        if (floatingMessageTimeout !== undefined) {
            clearTimeout(floatingMessageTimeout);
            floatingMessageTimeout = undefined;
        }
    }

    function resolveFloatingMessagePosition(event: MouseEvent): {
        x: number;
        y: number;
    } {
        if (event.detail !== 0) {
            return {
                x: event.clientX,
                y: event.clientY,
            };
        }

        const rect = (
            event.currentTarget as HTMLElement
        ).getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.bottom + 8,
        };
    }

    function showClickFloatingMessage(position: { x: number; y: number }) {
        if (!floatingMessage) {
            return;
        }

        clearFloatingMessageTimeout();
        floatingMessageX = position.x;
        floatingMessageY = position.y;
        showFloatingMessage = true;
        floatingMessageTimeout = setTimeout(() => {
            showFloatingMessage = false;
            floatingMessageTimeout = undefined;
        }, floatingMessageDuration);
    }

    async function handleClick(event: MouseEvent) {
        const floatingMessagePosition = floatingMessage
            ? resolveFloatingMessagePosition(event)
            : null;
        const result = onClick ? await onClick(event) : undefined;
        if (result !== false && floatingMessagePosition) {
            showClickFloatingMessage(floatingMessagePosition);
        }
    }

    onDestroy(clearFloatingMessageTimeout);
</script>

<button
    {type}
    class={`${computedClassName} ${variantClass} ${shapeClass} ${contentLayoutClass} ${selected ? "selected" : ""}`}
    {disabled}
    aria-label={ariaLabel}
    {style}
    onclick={handleClick}
    {...restProps}
>
    {@render children?.()}
</button>

<FloatingMessage
    show={showFloatingMessage}
    x={floatingMessageX}
    y={floatingMessageY}
>
    <div>{floatingMessage}</div>
</FloatingMessage>

<style>
    button {
        background-color: var(--btn-bg);
    }
    /* --- Variant Styles --- */
    :global(html body :where(.default)) {
        padding: 8px 12px;

        :global(:where(.svg-icon)) {
            width: 24px;
            height: 24px;
        }

        :global(.btn-text) {
            font-size: 1rem;
            font-weight: 500;
        }
    }

    :global(html body :where(.primary)) {
        --btn-bg: var(--theme);
        --text: white;
        font-weight: 500;
        padding: 8px 12px;
        gap: 8px;
        border: none;

        :global(.svg-icon) {
            --svg: white;
            width: 28px;
            height: 28px;
        }

        :global(.btn-text) {
            color: white;
            font-size: 1rem;
            font-weight: 500;
        }

        :global(
                .loading-placeholder.post-button-loading
                    .loader-container
                    .square
            ) {
            background-color: white;
        }

        @media (hover: hover) and (pointer: fine) {
            &:hover:not(:disabled) {
                :global(:root.light) & {
                    color: color-mix(in srgb, white, black 6%);
                    background-color: color-mix(
                        in srgb,
                        var(--btn-bg),
                        black 4%
                    );

                    :global(.svg-icon) {
                        background-color: currentColor;
                    }

                    :global(.btn-text) {
                        color: currentColor;
                    }
                }
                :global(:root.dark) & {
                    color: color-mix(in srgb, white, black 10%);
                    background-color: color-mix(
                        in srgb,
                        var(--btn-bg),
                        black 7%
                    );

                    :global(.svg-icon) {
                        background-color: currentColor;
                    }

                    :global(.btn-text) {
                        color: currentColor;
                    }
                }
            }
        }
    }

    :global(html body :where(.secondary)) {
        padding: 8px 12px;
        border: 1px solid var(--btn-border);
        --btn-bg: white;
        --text: var(--text-black);
        --border: var(--light-gray);

        @media (hover: hover) and (pointer: fine) {
            &:hover:not(:disabled) {
                :global(:root.light) & {
                    background: color-mix(in srgb, var(--btn-bg), black 3%);
                    color: color-mix(in srgb, var(--text), black 6%);
                }
                :global(:root.dark) & {
                    background: color-mix(in srgb, var(--btn-bg), black 8%);
                    color: black;
                }
            }
        }
    }

    .header {
        border: 1px solid var(--hagaki);
        @media (hover: hover) and (pointer: fine) {
            :global(:root.light) & {
                &:hover:not(:disabled) {
                    border-color: color-mix(in srgb, var(--hagaki), black 3%);
                }
            }
        }

        :global(:root.light) & {
            --btn-bg: white;
        }
    }

    .danger {
        --btn-bg: var(--danger);
        --text: white;
        border: none;

        @media (hover: hover) and (pointer: fine) {
            &:hover:not(:disabled) {
                :global(:root.light) & {
                    background-color: color-mix(
                        in srgb,
                        var(--btn-bg),
                        black 8%
                    );
                    color: color-mix(in srgb, white, black 8%);
                }
                :global(:root.dark) & {
                    background-color: color-mix(
                        in srgb,
                        var(--btn-bg),
                        black 12%
                    );
                    color: color-mix(in srgb, white, black 12%);
                }
            }
        }
    }

    .warning {
        --btn-bg: hsl(58, 99%, 74%);
        --text: var(--text-black);
        border: none;

        @media (hover: hover) and (pointer: fine) {
            &:hover:not(:disabled) {
                :global(:root.light) & {
                    background: color-mix(in srgb, var(--btn-bg), black 8%);
                }
                :global(:root.dark) & {
                    background: color-mix(in srgb, var(--btn-bg), black 12%);
                }
            }
        }
    }

    .footer {
        max-width: 100px;
        flex: 1 1 0;
        --btn-bg: transparent;
    }

    button:is(.close, .copy) {
        --btn-bg: rgb(0 0 0 / var(--overlay-opacity));
        --svg: whitesmoke;
        width: 50px;
        height: 50px;
        padding: 0;
        border: none;
        opacity: 0.8;
        backdrop-filter: blur(4px);
        transition: background 0.2s ease;
        background: var(--btn-bg);

        :global(.svg-icon) {
            width: var(--icon-size);
            height: var(--icon-size);
            mask-image: var(--icon-mask);
        }

        @media (hover: hover) and (pointer: fine) {
            &:hover:not(:disabled) {
                --btn-bg: rgb(25 25 25 / var(--hover-overlay-opacity));
                background: var(--btn-bg);
            }
        }
    }

    button.close {
        --overlay-opacity: 0.5;
        --hover-overlay-opacity: 0.5;
        --icon-size: 32px;
        --icon-mask: url("/icons/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    button.copy {
        --overlay-opacity: 0.45;
        --hover-overlay-opacity: 0.45;
        --icon-size: 20px;
        --icon-mask: url("/icons/file_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    /* --- Shape Styles --- */
    .square {
        border-radius: 0;
        padding: 0;

        :global(:where(.svg-icon)) {
            width: 30px;
            height: 30px;
        }
    }
    .rounded {
        border-radius: 6px;
    }
    .pill {
        border-radius: 50px;
    }
    .circle {
        border-radius: 50%;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;

        :global(.svg-icon) {
            width: 28px;
            height: 28px;
        }
    }

    /* --- Content Layout Styles --- */
    :global(html body :where(.content-iconText)) {
        gap: 8px;
        padding: 12px 18px 12px 14px;
    }

    .content-icon {
        padding: 0;

        :global(:where(.svg-icon)) {
            width: 30px;
            height: 30px;
        }
    }
</style>
