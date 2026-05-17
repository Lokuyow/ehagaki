<script lang="ts">
    import Button from "./Button.svelte";
    import type { PostHistoryRepliesState } from "../lib/hooks/usePostHistoryReplies.svelte";

    interface Props {
        state: PostHistoryRepliesState;
        ariaLabel: string;
        onClick: () => void;
    }

    let { state, ariaLabel, onClick }: Props = $props();
</script>

<Button
    type="button"
    class="post-preview-action-button post-preview-replies-action-button"
    {ariaLabel}
    title={ariaLabel}
    contentLayout="icon"
    shape="circle"
    selected={state.visible}
    disabled={state.status === "loading"}
    {onClick}
>
    {#if state.status === "loading"}
        <span class="post-preview-replies-spinner" aria-hidden="true"></span>
    {:else}
        <span class="pageview-icon svg-icon" aria-hidden="true"></span>
        {#if state.status === "loaded" && state.replies.length > 0}
            <span class="post-preview-replies-count" aria-hidden="true">
                {state.replies.length}
            </span>
        {/if}
    {/if}
</Button>

<style>
    .pageview-icon.svg-icon {
        width: 22px;
        height: 22px;
        mask-image: url("/icons/pageview_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    .post-preview-replies-spinner {
        width: 22px;
        height: 22px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: post-preview-replies-spinner 0.8s linear infinite;
    }

    .post-preview-replies-count {
        position: absolute;
        top: 2px;
        right: 2px;
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

    @keyframes post-preview-replies-spinner {
        to {
            transform: rotate(360deg);
        }
    }
</style>
