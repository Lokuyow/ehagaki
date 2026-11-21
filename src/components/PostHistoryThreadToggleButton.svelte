<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";

    interface Props {
        expanded: boolean;
        controls?: string;
        loading?: boolean;
        onClick: () => void;
    }

    let {
        expanded,
        controls,
        loading = false,
        onClick,
    }: Props = $props();

    const label = $derived(
        $_(expanded ? "postHistory.hideReplyTarget" : "postHistory.showReplyTarget"),
    );
</script>

<Button
    type="button"
    className={loading ? "post-history-thread-toggle-button is-loading" : "post-history-thread-toggle-button"}
    ariaLabel={label}
    title={label}
    aria-expanded={expanded}
    aria-controls={controls}
    contentLayout="iconText"
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
    <span class="post-history-thread-toggle-label">{$_("postHistory.replyTargetLabel")}</span>
</Button>

<style>
    :global(button.post-history-thread-toggle-button) {
        position: relative;
        justify-self: start;
        width: auto;
        padding: 0 8px;
        gap: 4px;
        white-space: nowrap;
        height: 28px;
        min-height: 28px;
        background: inherit;
        color: var(--btn-post-preview-action);
    }

    :global(.post-history-thread-toggle-button.selected) {
        --btn-bg: var(--post-history-preview-footer-surface, var(--dialog-bg));
        color: var(--text-light);
    }

    @media (hover: hover) and (pointer: fine) {
        :global(.post-history-thread-toggle-button.selected:hover:not(:disabled)) {
            background-color: light-dark(
                color-mix(in srgb, var(--dialog-bg), black 20%),
                color-mix(in srgb, var(--dialog-bg), white 30%)
            );
            color: light-dark(
                color-mix(in srgb, var(--text), black 20%),
                color-mix(in srgb, var(--text), white 30%)
            );
        }
    }

    .post-history-thread-toggle-icon-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 22px;
    }

    .post-history-thread-toggle-icon {
        --icon-size: 24px;
        --svg: currentColor;
    }

    .post-history-thread-toggle-icon-arrow-top-right {
        mask-image: url("/icons/arrow_top_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-history-thread-toggle-icon-collapse {
        --icon-size: 28px;
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

    @media (prefers-reduced-motion: reduce) {
        .post-history-thread-toggle-spinner {
            animation: none;
        }
    }

    @keyframes post-history-thread-toggle-spinner {
        to {
            rotate: 360deg;
        }
    }
</style>
