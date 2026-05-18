<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import PostHistoryThreadNode from "./PostHistoryThreadNode.svelte";
    import type { PostHistoryThreadGraphAnchorState } from "../lib/hooks/usePostHistoryThreadGraph.svelte";

    interface Props {
        state: PostHistoryThreadGraphAnchorState;
        section: "parent" | "children";
        onToggleParent?: () => void;
        onRetryParent?: () => void;
    }

    let {
        state,
        section,
        onToggleParent = undefined,
        onRetryParent = undefined,
    }: Props = $props();
</script>

{#if section === "parent" && state.parentTargetId}
    <div class="post-history-thread-parent-panel">
        {#if state.parentExpansion.visibleParent && state.parentExpansion.loadingParent && state.parentExpansion.showParentLoadingIndicator}
            <LoadingPlaceholder
                showLoader={true}
                text={$_("postHistory.contextLoading")}
                customClass="post-history-context-loading"
            />
        {:else if state.parentExpansion.visibleParent && state.parentNode}
            <PostHistoryThreadNode
                node={state.parentNode}
                label={$_("postHistory.replyTarget")}
            />
        {:else if state.parentExpansion.visibleParent && state.parentExpansion.parentMissing}
            <p class="post-history-context-message">
                {$_("postHistory.contextNotFound")}
            </p>
        {:else if state.parentExpansion.visibleParent && state.parentExpansion.parentError}
            <p class="post-history-context-message post-history-context-error">
                {$_("postHistory.contextFetchFailed")}
            </p>
            <Button
                type="button"
                className="post-history-context-button post-history-context-retry-button"
                onClick={() => onRetryParent?.()}
            >
                {$_("postHistory.contextRetry")}
            </Button>
        {/if}

        <div class="post-history-context-actions">
            <Button
                type="button"
                className="post-history-context-button"
                onClick={() => onToggleParent?.()}
            >
                {state.parentExpansion.visibleParent
                    ? $_("postHistory.hideReplyTarget")
                    : $_("postHistory.showReplyTarget")}
            </Button>
        </div>
    </div>
{:else if section === "children" && state.repliesActionState.visible && state.replyItems.length > 0}
    <div class="post-history-thread-replies-panel">
        <div class="post-history-thread-replies-list">
            {#each state.replyItems as reply (reply.event.id)}
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
    .post-history-thread-parent-panel,
    .post-history-thread-replies-panel {
        display: grid;
        gap: 6px;
        padding-left: 1rem;
    }

    .post-history-thread-replies-list {
        display: grid;
        gap: 6px;
    }

    .post-history-context-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    :global(.post-history-context-button) {
        min-height: 28px;
        padding: 2px 8px;
        color: var(--text-muted);
        background: transparent;
        font-size: 0.82rem;
    }

    @media (min-width: 601px) {
        :global(.post-history-context-button:hover:not(:disabled)) {
            color: var(--theme);
            background: color-mix(in srgb, var(--theme) 10%, transparent);
        }
    }

    :global(.post-history-context-loading) {
        justify-content: flex-start;
        width: auto;
        padding: 0;
        color: var(--text-muted);
        font-size: 0.82rem;
    }

    .post-history-context-message {
        margin: 0;
        color: var(--text-muted);
        font-size: 0.82rem;
    }

    .post-history-context-error {
        color: var(--danger);
    }
</style>
