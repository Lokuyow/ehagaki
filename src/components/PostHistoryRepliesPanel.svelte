<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import type { PostHistoryRepliesState } from "../lib/hooks/usePostHistoryReplies.svelte";

    interface Props {
        state: PostHistoryRepliesState;
        onToggle: () => void;
        onRetry: () => void;
    }

    let { state, onToggle, onRetry }: Props = $props();
</script>

<div class="post-history-replies-panel">
    <div class="post-history-replies-actions">
        <Button
            type="button"
            className="post-history-replies-button"
            disabled={state.status === "loading"}
            onClick={onToggle}
        >
            {state.visible
                ? $_("postHistory.hideReplies")
                : $_("postHistory.showReplies")}
        </Button>
    </div>

    {#if state.visible}
        {#if state.status === "loading"}
            <LoadingPlaceholder
                showLoader={true}
                text={$_("postHistory.repliesLoading")}
                customClass="post-history-replies-loading"
            />
        {:else if state.status === "failed"}
            <p class="post-history-replies-message post-history-replies-error">
                {$_("postHistory.repliesFetchFailed")}
            </p>
            <Button
                type="button"
                className="post-history-replies-button post-history-replies-retry-button"
                onClick={onRetry}
            >
                {$_("postHistory.contextRetry")}
            </Button>
        {:else if state.status === "loaded" && state.replies.length === 0}
            <p class="post-history-replies-message">
                {$_("postHistory.repliesNotFound")}
            </p>
            <Button
                type="button"
                className="post-history-replies-button post-history-replies-retry-button"
                onClick={onRetry}
            >
                {$_("postHistory.contextRetry")}
            </Button>
        {:else if state.status === "loaded"}
            <div class="post-history-replies-list">
                {#each state.replies as reply (reply.event.id)}
                    <PostHistoryRelatedEventCard
                        event={reply.event}
                        profile={reply.profile}
                        label={reply.isOwnReply
                            ? $_("postHistory.ownReply")
                            : $_("postHistory.directReply")}
                    />
                {/each}
            </div>
        {/if}
    {/if}
</div>

<style>
    .post-history-replies-panel {
        display: grid;
        gap: 6px;
        padding-left: 1rem;
    }

    .post-history-replies-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    :global(.post-history-replies-button) {
        min-height: 28px;
        padding: 2px 8px;
        color: var(--text-muted);
        background: transparent;
        font-size: 0.82rem;
    }

    @media (min-width: 601px) {
        :global(.post-history-replies-button:hover:not(:disabled)) {
            color: var(--theme);
            background: color-mix(in srgb, var(--theme) 10%, transparent);
        }
    }

    :global(.post-history-replies-loading) {
        justify-content: flex-start;
        width: auto;
        padding: 0;
        color: var(--text-muted);
        font-size: 0.82rem;
    }

    .post-history-replies-message {
        margin: 0;
        color: var(--text-muted);
        font-size: 0.82rem;
    }

    .post-history-replies-error {
        color: var(--danger);
    }

    .post-history-replies-list {
        display: grid;
        gap: 6px;
    }
</style>
