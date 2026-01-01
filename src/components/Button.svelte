<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

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
            | "footer";
        shape?: "square" | "rounded" | "pill" | "circle";
        children?: import("svelte").Snippet;
        onClick?: (event: MouseEvent) => void;
        selected?: boolean;
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
        onClick = undefined,
        selected = false,
        ...restProps
    }: Props = $props();

    function handleClick(event: MouseEvent) {
        if (onClick) onClick(event);
    }
</script>

<button
    {type}
    class={`${className} ${variant} ${shape} ${selected ? "selected" : ""}`}
    {disabled}
    aria-label={ariaLabel}
    {style}
    onclick={handleClick}
    {...restProps}
>
    {@render children?.()}
</button>

<style>
    /* --- Variant Styles --- */
    .default {
        background-color: var(--btn-bg);
        padding: 12px 18px 12px 16px;
        gap: 8px;

        :global(.svg-icon) {
            width: 24px;
            height: 24px;
        }

        :global(.btn-text) {
            font-size: 1rem;
            font-weight: 500;
        }

        @media (prefers-color-scheme: light) {
            --text: hsl(0, 0%, 24%);
            --svg: hsl(0, 0%, 20%);
        }

        @media (prefers-color-scheme: dark) {
            --text: hsl(0, 0%, 92%);
            --svg: hsl(0, 0%, 99%);
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
                @media (prefers-color-scheme: light) {
                    filter: brightness(96%);
                }

                @media (prefers-color-scheme: dark) {
                    filter: brightness(90%);
                }
            }
        }
    }

    .secondary {
        border: 1px solid var(--btn-border);
        --btn-bg: white;
        --text: var(--text-black);
        --border: var(--light-gray);

        @media (min-width: 601px) {
            &:hover:not(:disabled) {
                @media (prefers-color-scheme: light) {
                    filter: brightness(97%);
                }

                @media (prefers-color-scheme: dark) {
                    filter: brightness(90%);
                }
            }
        }
    }

    .header {
        border: 1px solid var(--hagaki);
        @media (min-width: 601px) {
            @media (prefers-color-scheme: light) {
                &:hover:not(:disabled) {
                    border-color: color-mix(in srgb, var(--hagaki), black 3%);
                }
            }
        }

        @media (prefers-color-scheme: light) {
            --btn-bg: white;
        }
        /* @media (prefers-color-scheme: dark) {
            --btn-bg: black;
        } */
    }

    .danger {
        --btn-bg: var(--danger);
        --text: white;
        border: none;

        @media (min-width: 601px) {
            &:hover:not(:disabled) {
                @media (prefers-color-scheme: light) {
                    filter: brightness(94%);
                }

                @media (prefers-color-scheme: dark) {
                    filter: brightness(90%);
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
                @media (prefers-color-scheme: light) {
                    filter: brightness(96%);
                }

                @media (prefers-color-scheme: dark) {
                    filter: brightness(90%);
                }
            }
        }
    }

    .footer {
        --btn-bg: transparent;
        border: none;
        transition: all 0.2s ease;
        opacity: 0.5;

        @media (min-width: 601px) {
            &:hover:not(:disabled) {
                @media (prefers-color-scheme: light) {
                    --text: hsl(0, 0%, 24%);
                    --svg: hsl(0, 0%, 20%);
                }

                @media (prefers-color-scheme: dark) {
                    --text: hsl(0, 0%, 92%);
                    --svg: hsl(0, 0%, 99%);
                }
            }
        }

        &.selected {
            opacity: 1;
        }
    }

    /* --- Shape Styles --- */
    .square {
        border-radius: 0;
        padding: 0;
        min-height: 50px;
        min-width: 50px;

        :global(.svg-icon) {
            width: 30px;
            height: 30px;
        }
    }
    .rounded {
        border-radius: 6px;
        min-height: 50px;
        min-width: 50px;
    }
    .pill {
        border-radius: 50px;
        padding: 0;
    }
    .circle {
        border-radius: 50%;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        :global(.svg-icon) {
            width: 28px;
            height: 28px;
        }
    }

    /* --- Selected Styles --- */
    @media (prefers-color-scheme: light) {
        button.selected {
            filter: brightness(85%);
        }
    }

    @media (prefers-color-scheme: dark) {
        button.selected {
            filter: brightness(150%);
        }
    }
</style>
