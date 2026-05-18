<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import PostHistoryRepliesActionButton from "./PostHistoryRepliesActionButton.svelte";
    import PostHistoryThreadGraphNodeView from "./PostHistoryThreadGraphNodeView.svelte";
    import PostHistoryThreadNode from "./PostHistoryThreadNode.svelte";
    import type { PostHistoryThreadGraphNodeState } from "../lib/hooks/usePostHistoryThreadGraph.svelte";

    interface Props {
        state: PostHistoryThreadGraphNodeState;
        onToggleParent?: (nodeEventId: string) => void;
        onRetryParent?: (nodeEventId: string) => void;
        onToggleChildren?: (nodeEventId: string) => void;
        onRetryChildren?: (nodeEventId: string) => void;
    }

    let {
        state,
        onToggleParent = undefined,
        onRetryParent = undefined,
        onToggleChildren = undefined,
        onRetryChildren = undefined,
    }: Props = $props();

    function getRepliesActionLabel(): string {
        const actionState = state.repliesActionState;
        if (actionState.status === "loading") {
            return $_("postHistory.checkingReplies");
        }

        if (actionState.status === "failed") {
            return $_("postHistory.recheckReplies");
        }

        if (actionState.status === "loaded") {
            const count = actionState.replies.length;
            if (count === 0) {
                return $_("postHistory.recheckReplies");
            }

            if (actionState.visible) {
                return $_("postHistory.hideReplies");
            }

            return $_("postHistory.showRepliesWithCount", {
                values: { count },
            });
        }

        return $_("postHistory.checkReplies");
    }

    function handleRepliesAction(): void {
        const actionState = state.repliesActionState;
        if (
            actionState.status === "failed" ||
            (actionState.status === "loaded" &&
                (actionState.replies.length === 0 || !actionState.visible))
        ) {
            onRetryChildren?.(state.node.eventId);
            return;
        }

        onToggleChildren?.(state.node.eventId);
    }
</script>

<div
    class="post-history-thread-node-view"
    style={`--thread-depth: ${Math.max(0, state.depthFromAnchor)}`}
>
    {#if state.parentTargetId}
        <div class="post-history-thread-node-parent">
            {#if state.parentExpansion.visibleParent && state.parentExpansion.loadingParent && state.parentExpansion.showParentLoadingIndicator}
                <LoadingPlaceholder
                    showLoader={true}
                    text={$_("postHistory.contextLoading")}
                    customClass="post-history-context-loading"
                />
            {:else if state.parentExpansion.visibleParent && state.parentNodeState}
                <PostHistoryThreadGraphNodeView
                    state={state.parentNodeState}
                    {onToggleParent}
                    {onRetryParent}
                    {onToggleChildren}
                    {onRetryChildren}
                />
            {:else if state.parentExpansion.visibleParent && state.parentExpansion.parentDeleted}
                <span class="post-history-context-deleted-label">
                    {$_("postHistory.replyTargetDeleted")}
                </span>
            {:else if state.parentExpansion.visibleParent && state.parentExpansion.parentMissing}
                <p class="post-history-context-message">
                    {$_("postHistory.contextNotFound")}
                </p>
            {:else if state.parentExpansion.visibleParent && state.parentExpansion.parentError}
                <p
                    class="post-history-context-message post-history-context-error"
                >
                    {$_("postHistory.contextFetchFailed")}
                </p>
                <Button
                    type="button"
                    className="post-history-context-button post-history-context-retry-button"
                    onClick={() => onRetryParent?.(state.node.eventId)}
                >
                    {$_("postHistory.contextRetry")}
                </Button>
            {/if}
        </div>
    {/if}

    <PostHistoryThreadNode node={state.node}>
        <div class="post-history-thread-node-actions">
            {#if state.parentTargetId && !(state.parentExpansion.visibleParent && state.parentExpansion.parentDeleted)}
                <Button
                    type="button"
                    className="post-history-context-button"
                    onClick={() => onToggleParent?.(state.node.eventId)}
                >
                    {state.parentExpansion.visibleParent
                        ? $_("postHistory.hideReplyTarget")
                        : $_("postHistory.showReplyTarget")}
                </Button>
            {/if}
            <PostHistoryRepliesActionButton
                state={state.repliesActionState}
                ariaLabel={getRepliesActionLabel()}
                onClick={handleRepliesAction}
            />
        </div>
    </PostHistoryThreadNode>

    {#if state.repliesActionState.visible && state.replyNodeStates.length > 0}
        <div class="post-history-thread-node-children">
            {#each state.replyNodeStates as replyState (replyState.node.eventId)}
                <PostHistoryThreadGraphNodeView
                    state={replyState}
                    {onToggleParent}
                    {onRetryParent}
                    {onToggleChildren}
                    {onRetryChildren}
                />
            {/each}
        </div>
    {/if}
</div>

<style>
    .post-history-thread-node-view {
        display: grid;
        gap: 2px;
    }

    .post-history-thread-node-parent,
    .post-history-thread-node-children {
        display: grid;
        gap: 6px;
        padding-left: min(calc((var(--thread-depth) + 1) * 0.35rem), 1.4rem);
    }

    .post-history-thread-node-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        min-height: 28px;
    }

    :global(.post-history-context-button) {
        min-height: 28px;
        padding: 2px 6px;
        color: var(--text-muted);
        background: transparent;
        font-size: 0.82rem;
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

    .post-history-context-deleted-label {
        width: fit-content;
        min-height: 28px;
        padding: 2px 6px;
        color: var(--text-muted);
        background-color: transparent;
        border: 1px solid var(--btn-border);
        font-size: 0.82rem;
        font-weight: normal;
        cursor: default;
        user-select: none;
        display: flex;
        align-items: center;
    }

    .post-history-context-error {
        color: var(--danger);
    }
</style>
