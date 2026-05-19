<script lang="ts">
    import Button from "./Button.svelte";

    interface Props {
        icon: "subdirectory-arrow-right" | "arrow-top-right";
        ariaLabel: string;
        title?: string;
        selected?: boolean;
        disabled?: boolean;
        loading?: boolean;
        badgeCount?: number;
        onClick: () => void;
        className?: string;
        shape?: "circle" | "square";
    }

    let {
        icon,
        ariaLabel,
        title = ariaLabel,
        selected = false,
        disabled = false,
        loading = false,
        badgeCount = 0,
        onClick,
        className = "",
        shape = "circle",
    }: Props = $props();

    let hasBadge = $derived(badgeCount > 0);
    let legacyIconClass = $derived(
        icon === "subdirectory-arrow-right"
            ? "subdirectory-arrow-right-icon"
            : "arrow-top-right-icon",
    );
</script>

<Button
    type="button"
    className={`post-preview-action-button post-history-thread-action-button ${className}`.trim()}
    {ariaLabel}
    {title}
    contentLayout="icon"
    {shape}
    {selected}
    disabled={disabled || loading}
    {onClick}
>
    {#if loading}
        <span
            class="post-history-thread-action-spinner post-preview-replies-spinner"
            aria-hidden="true"
        ></span>
    {:else}
        <span
            class="post-history-thread-action-icon-wrapper post-preview-replies-icon-wrapper"
            aria-hidden="true"
        >
            <span
                class={`post-history-thread-action-icon post-history-thread-action-icon-${icon} ${legacyIconClass} svg-icon`}
            ></span>
            {#if hasBadge}
                <span
                    class="post-history-thread-action-badge post-preview-replies-count"
                >
                    {badgeCount}
                </span>
            {/if}
        </span>
    {/if}
</Button>

<style>
    :global(.post-history-thread-action-button) {
        position: relative;
        width: 28px;
        height: 28px;
        min-height: 28px;
        color: var(--btn-post-preview-action);
        background: transparent;

        :global(.svg-icon) {
            --svg: var(--btn-post-preview-action);
        }
    }

    :global(.post-history-thread-action-button.selected) {
        background: color-mix(in srgb, var(--theme) 12%, transparent);
        color: var(--theme);

        :global(.svg-icon) {
            --svg: var(--theme);
        }

        :global(.post-history-thread-action-badge) {
            background-color: var(--theme);
        }
    }

    :global(.post-history-thread-action-button:disabled) {
        opacity: 1;
        color: var(--btn-post-preview-action);
        cursor: default;
    }

    @media (min-width: 601px) {
        :global(.post-history-thread-action-button:hover:not(:disabled)) {
            background: color-mix(in srgb, var(--theme) 10%, transparent);

            :global(.svg-icon) {
                --svg: var(--theme);
            }

            :global(.post-history-thread-action-badge) {
                background-color: var(--theme);
            }
        }
    }

    .post-history-thread-action-icon-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        flex: 0 0 22px;
    }

    .post-history-thread-action-icon {
        width: 22px;
        height: 22px;
    }

    .post-history-thread-action-icon-subdirectory-arrow-right {
        mask-image: url("/icons/subdirectory_arrow_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-history-thread-action-icon-arrow-top-right {
        mask-image: url("/icons/arrow_top_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-history-thread-action-spinner {
        width: 22px;
        height: 22px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: post-history-thread-action-spinner 0.8s linear infinite;
    }

    .post-history-thread-action-badge {
        position: absolute;
        top: -4px;
        right: -5px;
        min-width: 14px;
        height: 14px;
        padding: 0 3px;
        border-radius: 999px;
        background: var(--btn-post-preview-action);
        color: var(--dialog-bg);
        font-size: 0.68rem;
        font-weight: 700;
        line-height: 14px;
        text-align: center;
    }

    @keyframes post-history-thread-action-spinner {
        to {
            transform: rotate(360deg);
        }
    }
</style>
