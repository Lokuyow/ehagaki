<script lang="ts">
    import Button from "./Button.svelte";

    interface Props {
        expanded: boolean;
        ariaLabel: string;
        title?: string;
        loading?: boolean;
        onClick: () => void;
    }

    let {
        expanded,
        ariaLabel,
        title = ariaLabel,
        loading = false,
        onClick,
    }: Props = $props();

    let stateClassName = $derived(
        [expanded ? "is-selected" : "", loading ? "is-loading" : ""]
            .filter(Boolean)
            .join(" "),
    );
</script>

<Button
    type="button"
    className={`post-history-thread-toggle-button ${stateClassName}`.trim()}
    {ariaLabel}
    {title}
    contentLayout="icon"
    shape="rounded"
    selected={expanded}
    disabled={loading}
    {onClick}
>
    {#if loading}
        <span
            class="post-history-thread-toggle-spinner post-history-thread-action-spinner"
            aria-hidden="true"
        ></span>
    {:else}
        <span
            class="post-history-thread-toggle-icon-wrapper"
            aria-hidden="true"
        >
            <span
                class={`post-history-thread-toggle-icon ${
                    expanded
                        ? "post-history-thread-toggle-icon-collapse"
                        : "post-history-thread-toggle-icon-arrow-top-right"
                } svg-icon`}
            ></span>
        </span>
    {/if}
</Button>

<style>
    :global(.post-history-thread-node-top-actions) {
        width: 100%;
        height: 28px;
    }

    :global(
            .post-history-context-actions .post-history-thread-toggle-button,
            .post-history-thread-node-top-actions
                .post-history-thread-toggle-button
        ) {
        position: relative;
        width: 40px;
        height: 28px;
        min-height: 28px;
        background: inherit;
    }

    .post-history-thread-toggle-icon-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 22px;
    }

    .post-history-thread-toggle-icon {
        width: 24px;
        height: 24px;
    }

    .post-history-thread-toggle-icon-arrow-top-right {
        mask-image: url("/icons/arrow_top_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-history-thread-toggle-icon-collapse {
        width: 28px;
        height: 28px;
        mask-image: url("/icons/collapse_content_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-history-thread-toggle-spinner {
        width: 22px;
        height: 22px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: post-history-thread-toggle-spinner 0.8s linear infinite;
    }

    @keyframes post-history-thread-toggle-spinner {
        to {
            transform: rotate(360deg);
        }
    }
</style>
