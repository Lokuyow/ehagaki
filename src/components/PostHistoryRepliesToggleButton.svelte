<script lang="ts">
    import Button from "./Button.svelte";

    interface RepliesActionState {
        status: "unloaded" | "loading" | "loaded" | "failed";
        visible: boolean;
        replies: unknown[];
        replyCount: number;
    }

    interface Props {
        state: RepliesActionState;
        ariaLabel: string;
        onClick: () => void;
    }

    let { state, ariaLabel, onClick }: Props = $props();

    let stateClassName = $derived(
        [
            state.visible ? "is-selected" : "",
            state.status === "loading" ? "is-loading" : "",
        ]
            .filter(Boolean)
            .join(" "),
    );

    let hasBadge = $derived(state.status === "loaded" && state.replyCount > 0);
</script>

<Button
    type="button"
    className={`post-history-replies-toggle-button ${stateClassName}`.trim()}
    {ariaLabel}
    title={ariaLabel}
    contentLayout="icon"
    shape="square"
    selected={state.visible}
    disabled={state.status === "loading"}
    {onClick}
>
    {#if state.status === "loading"}
        <span class="post-history-replies-toggle-spinner" aria-hidden="true"
        ></span>
    {:else}
        <span
            class="post-history-replies-toggle-icon-wrapper post-preview-replies-icon-wrapper"
            aria-hidden="true"
        >
            <span
                class={`post-history-replies-toggle-icon ${
                    state.visible
                        ? "post-history-replies-toggle-icon-collapse"
                        : "post-history-replies-toggle-icon-find-in-page"
                } svg-icon`}
            ></span>
            {#if hasBadge}
                <span
                    class="post-history-replies-toggle-badge post-preview-replies-count post-preview-replies-badge"
                >
                    {state.replyCount}
                </span>
            {/if}
        </span>
    {/if}
</Button>

<style>
    :global(.post-history-replies-toggle-button) {
        position: relative;
        width: 36px;
        min-width: 36px;
        min-height: 28px;
        padding: 0;
    }

    .post-history-replies-toggle-icon-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 22px;
    }

    .post-history-replies-toggle-icon {
        width: 24px;
        height: 24px;
    }

    .post-history-replies-toggle-icon-find-in-page {
        mask-image: url("/icons/find_in_page_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-history-replies-toggle-icon-collapse {
        width: 28px;
        height: 28px;
        mask-image: url("/icons/collapse_content_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-history-replies-toggle-spinner {
        width: 22px;
        height: 22px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: post-history-replies-toggle-spinner 0.8s linear infinite;
    }

    .post-history-replies-toggle-badge {
        position: absolute;
        top: -4px;
        right: -5px;
        min-width: 14px;
        height: 14px;
        padding: 0 3px;
        border-radius: 999px;
        color: var(--dialog-bg);
        font-size: 0.68rem;
        font-weight: 700;
        line-height: 14px;
        text-align: center;
    }

    @keyframes post-history-replies-toggle-spinner {
        to {
            transform: rotate(360deg);
        }
    }
</style>
