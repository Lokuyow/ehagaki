<script lang="ts">
    import { _ } from "svelte-i18n";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import type { PostHistoryRepliesState } from "../lib/hooks/usePostHistoryReplies.svelte";

    interface Props {
        state: PostHistoryRepliesState;
    }

    let { state }: Props = $props();
</script>

{#if state.visible && state.status !== "failed" && state.replies.length > 0}
    <div class="post-history-replies-panel">
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
    </div>
{/if}

<style>
    .post-history-replies-panel {
        display: grid;
        gap: 6px;
        padding-left: 1rem;
    }

    .post-history-replies-list {
        display: grid;
        gap: 6px;
    }
</style>
