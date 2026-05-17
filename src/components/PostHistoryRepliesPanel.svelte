<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import type { PostHistoryRepliesState } from "../lib/hooks/usePostHistoryReplies.svelte";

    interface Props {
        state: PostHistoryRepliesState;
        onRetry: () => void;
    }

    let { state, onRetry }: Props = $props();
</script>

{#if state.visible}
    <div class="post-history-replies-panel">
        {#if state.status === "failed"}
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
    </div>
{/if}

<style>
    .post-history-replies-panel {
        display: grid;
        gap: 6px;
        padding-left: 1rem;
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
