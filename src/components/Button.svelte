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
            | "footer"
            | "close"
            | "copy";
        shape?: "none" | "square" | "rounded" | "pill" | "circle";
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
        shape = "none",
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
    }

    /* .default: ライトモード */
    :global(:root.light) .default {
        --text: hsl(0, 0%, 24%);
        --svg: hsl(0, 0%, 30%);
    }

    /* .default: ダークモード */
    :global(:root.dark) .default {
        --text: hsl(0, 0%, 92%);
        --svg: hsl(0, 0%, 99%);
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
                :global(:root.light) & {
                    background: color-mix(in srgb, var(--btn-bg), black 8%);
                }
                :global(:root.dark) & {
                    background: color-mix(in srgb, var(--btn-bg), black 12%);
                }
            }
        }
    }

    .secondary {
        border: 1px solid var(--btn-border);
        --btn-bg: white;
        --text: var(--text-black);
        --border: var(--light-gray);
    }

    .header {
        border: 1px solid var(--hagaki);
        @media (min-width: 601px) {
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

        @media (min-width: 601px) {
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

    .warning {
        --btn-bg: hsl(58, 99%, 74%);
        --text: var(--text-black);
        border: none;

        @media (min-width: 601px) {
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
        min-width: 40px;
        flex: 1 1 0;
        --btn-bg: transparent;
    }

    button.close {
        --btn-bg: rgba(0, 0, 0, 0.5);
        --svg: whitesmoke;
        backdrop-filter: blur(4px);
        opacity: 0.8;
        border: none;
        width: 50px;
        height: 50px;
        transition: background 0.2s ease;

        :global(.svg-icon) {
            width: 32px;
            height: 32px;
            mask-image: url("/icons/xmark-solid-full.svg");
        }

        @media (min-width: 601px) {
            &:hover:not(:disabled) {
                --btn-bg: rgba(25, 25, 25, 0.5);
                background: var(--btn-bg);
            }
        }
    }

    button.copy {
        --btn-bg: rgba(0, 0, 0, 0.45);
        --svg: whitesmoke;
        backdrop-filter: blur(4px);
        opacity: 0.8;
        border: none;
        width: 50px;
        height: 50px;
        transition: background 0.2s ease;

        :global(.svg-icon) {
            width: 28px;
            height: 28px;
            mask-image: url("/icons/copy-solid-full.svg");
        }

        @media (min-width: 601px) {
            &:hover:not(:disabled) {
                --btn-bg: rgba(25, 25, 25, 0.45);
                background: var(--btn-bg);
            }
        }
    }

    /* --- Shape Styles --- */
    .square {
        border-radius: 0;
        padding: 0;
        min-height: 50px;

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
</style>
