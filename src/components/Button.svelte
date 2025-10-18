<script lang="ts">
    interface Props {
        className?: string;
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        ariaLabel?: string;
        style?: string;
        variant?: "default" | "primary" | "danger" | "secondary" | "warning";
        shape?: "square" | "rounded" | "pill" | "circle";
        children?: import("svelte").Snippet;
        onClick?: (event: MouseEvent) => void; // 追加
    }

    let {
        className = "",
        disabled = false,
        type = "button",
        ariaLabel = "",
        style = "",
        variant = "default",
        shape = "rounded",
        children,
        onClick = undefined, // 追加
    }: Props = $props();

    function handleClick(event: MouseEvent) {
        if (onClick) onClick(event);
    }
</script>

<button
    {type}
    class={`${className} ${variant} ${shape}`}
    {disabled}
    aria-label={ariaLabel}
    {style}
    onclick={handleClick}
>
    {@render children?.()}
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
        --text: white;
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

        @media (min-width: 601px) {
            &:hover:not(:disabled) {
                background-color: color-mix(in srgb, var(--btn-bg), black 5%);
                color: color-mix(in srgb, var(--text), black 5%);
                :global(.btn-text) {
                    color: color-mix(in srgb, var(--text), black 5%);
                }
            }
        }
    }

    .secondary {
        --btn-bg: white;
        --text: var(--text-black);
        --border: var(--light-gray);

        @media (min-width: 601px) {
            &:hover:not(:disabled) {
                background-color: color-mix(in srgb, var(--btn-bg), black 5%);
                color: color-mix(in srgb, var(--text), black 5%);
                :global(.btn-text) {
                    color: color-mix(in srgb, var(--text), black 5%);
                }
            }
        }
    }

    .danger {
        --btn-bg: var(--danger);
        --text: white;
        border: none;

        @media (min-width: 601px) {
            &:hover:not(:disabled) {
                background-color: color-mix(in srgb, var(--btn-bg), black 5%);
                color: color-mix(in srgb, var(--text), black 5%);
                :global(.btn-text) {
                    color: color-mix(in srgb, var(--text), black 5%);
                }
            }
        }
    }

    .warning {
        --btn-bg: hsl(58, 99%, 74%);
        --text: var(--text-black);
        border: none;

        @media (min-width: 601px) {
            &:hover:not(:disabled) {
                background-color: color-mix(in srgb, var(--btn-bg), black 5%);
                color: color-mix(in srgb, var(--text), black 5%);
                :global(.btn-text) {
                    color: color-mix(in srgb, var(--text), black 5%);
                }
            }
        }
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
