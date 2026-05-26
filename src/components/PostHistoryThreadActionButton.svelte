<script lang="ts">
    import Button from "./Button.svelte";

    interface Props {
        icon: "find_in_page" | "arrow-top-right" | "collapse-content";
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
        icon === "find_in_page"
            ? "find_in_page-icon"
            : icon === "arrow-top-right"
              ? "arrow-top-right-icon"
              : "collapse-content-icon",
    );
</script>

<Button
    type="button"
    className={`post-preview-action-button post-history-thread-action-button ${className}`.trim()}
    {ariaLabel}
    {title}
    contentLayout="icon"
    shape="square"
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
    :global(.post-history-thread-node-top-actions) {
        width: 100%;
        height: 28px;
    }
    :global(
            .post-history-context-actions .post-history-thread-action-button,
            .post-history-thread-node-top-actions
                .post-history-thread-action-button
        ) {
        position: relative;
        width: 40px;
        height: 28px;
        min-height: 28px;
        color: var(--btn-post-preview-action);
        background: inherit;

        :global(.svg-icon) {
            --svg: var(--btn-post-preview-action);
        }
    }

    :global(
            .post-preview-footer > .post-history-thread-action-button,
            .post-preview-action-buttons-group
                .post-history-thread-action-button
        ) {
        width: 36px;
    }

    :global(.post-preview-action-button.post-history-thread-action-button) {
        :global(
                &.post-history-parent-toggle-button.selected,
                &.post-preview-replies-action-button.selected
            ) {
            background-color: inherit;

            :global(.svg-icon) {
                background-color: var(--text-light);
            }
        }
    }

    :global(
            .post-preview-action-button.post-history-thread-action-button.post-history-parent-toggle-button.selected:not(
                    :hover
                )
        ) {
        background-color: transparent;
        :global(.svg-icon) {
            background-color: var(--text-light);
        }
    }

    @media (min-width: 601px) {
        :global(
                .light
                    button.post-preview-action-button.post-history-thread-action-button.post-history-parent-toggle-button.selected:where(
                        :hover:not(:disabled)
                    )
            ) {
            --btn-bg: var(--dialog-bg);
            background-color: color-mix(in srgb, var(--btn-bg), black 20%);
            color: color-mix(in srgb, var(--text), black 20%);

            :global(.svg-icon) {
                background-color: var(--text);
            }
        }

        :global(
                .dark
                    button.post-preview-action-button.post-history-thread-action-button.post-history-parent-toggle-button.selected:where(
                        :hover:not(:disabled)
                    )
            ) {
            --btn-bg: var(--dialog-bg);
            background-color: color-mix(in srgb, var(--btn-bg), white 30%);
            color: color-mix(in srgb, var(--text), white 30%);

            :global(.svg-icon) {
                background-color: var(--text);
            }
        }
    }

    :global(
            .post-history-thread-action-button.post-preview-replies-action-button.selected:not(
                    :hover
                )
        ) {
        background-color: transparent;

        :global(.svg-icon) {
            background-color: var(--text-light);
        }

        :global(.post-history-thread-action-badge) {
            background-color: var(--text-light);
        }
    }

    :global(
            .post-preview-action-button.post-history-thread-action-button.post-preview-replies-action-button:disabled
        ) {
        opacity: 1;
        color: var(--btn-post-preview-action);
        cursor: default;
    }

    @media (min-width: 601px) {
        :global(
                .post-preview-action-button.post-history-thread-action-button.post-preview-replies-action-button:hover:not(
                        :disabled
                    )
            ) {
            :global(.svg-icon) {
                --svg: color-mix(in srgb, var(--text), white 50%);
            }

            :global(.post-history-thread-action-badge) {
                background-color: var(--text);
            }
        }
    }

    .post-history-thread-action-icon-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 22px;
    }

    .post-history-thread-action-icon {
        width: 24px;
        height: 24px;
    }

    .post-history-thread-action-icon-find_in_page {
        mask-image: url("/icons/find_in_page_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-history-thread-action-icon-arrow-top-right {
        mask-image: url("/icons/arrow_top_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-history-thread-action-icon-collapse-content {
        mask-image: url("/icons/collapse_content_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        width: 28px;
        height: 28px;
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
