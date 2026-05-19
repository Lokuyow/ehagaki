<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import PostHistoryRepliesActionButton from "./PostHistoryRepliesActionButton.svelte";
    import PostHistoryThreadGraphNodeView from "./PostHistoryThreadGraphNodeView.svelte";
    import PostHistoryThreadNode from "./PostHistoryThreadNode.svelte";
    import { formatPostedAt } from "../lib/postHistoryDialogUtils";
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

    let postedAt = $derived(formatPostedAt(state.node.event.created_at * 1000));

    function getRepliesActionLabel(): string {
        const actionState = state.repliesActionState;
        if (actionState.status === "loading") {
            return $_("postHistory.checkingReplies");
        }

        if (actionState.status === "failed") {
            return $_("postHistory.recheckReplies");
        }

        if (actionState.status === "loaded") {
            const count = actionState.replyCount;
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
                (actionState.replyCount === 0 || !actionState.visible))
        ) {
            onRetryChildren?.(state.node.eventId);
            return;
        }

        onToggleChildren?.(state.node.eventId);
    }
</script>

<div
    class="post-history-thread-node-view"
    style={`--thread-depth: ${Math.max(0, state.depthFromAnchor)}; --thread-parent-indent: ${Math.max(0, 1.3 - Math.max(0, -state.depthFromAnchor) * 0.25)}rem`}
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

    <PostHistoryThreadNode node={state.node} showHeaderDate={false}>
        {#snippet topActions()}
            {#if state.parentTargetId && !state.parentAlreadyInPath && !(state.parentExpansion.visibleParent && state.parentExpansion.parentDeleted)}
                <div class="post-history-thread-node-top-actions">
                    <Button
                        type="button"
                        className="post-history-context-button post-history-parent-toggle-button"
                        ariaLabel={state.parentExpansion.visibleParent
                            ? $_("postHistory.hideReplyTarget")
                            : $_("postHistory.showReplyTarget")}
                        title={state.parentExpansion.visibleParent
                            ? $_("postHistory.hideReplyTarget")
                            : $_("postHistory.showReplyTarget")}
                        contentLayout="icon"
                        shape="circle"
                        onClick={() => onToggleParent?.(state.node.eventId)}
                    >
                        <span
                            class="arrow-top-right-icon svg-icon"
                            aria-hidden="true"
                        ></span>
                    </Button>
                </div>
            {/if}
        {/snippet}

        <div class="post-preview-footer">
            <span class="post-history-related-date">{postedAt}</span>
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
        gap: 2px;
    }

    .post-history-thread-node-parent {
        padding-left: var(--thread-parent-indent);
    }

    .post-history-thread-node-children {
        padding-left: min(calc((var(--thread-depth) + 1) * 0.25rem), 1.3rem);
    }

    .post-preview-footer {
        display: flex;
        align-items: center;
        min-height: 28px;
    }

    :global(.post-preview-footer > .post-history-related-date) {
        color: var(--text-muted);
        font-size: 0.875rem;
    }

    :global(.post-preview-footer > .post-preview-replies-action-button) {
        margin: auto;
        --svg: var(--btn-post-preview-action);
        background: transparent;
    }

    :global(.post-history-context-button) {
        min-height: 28px;
        padding: 2px 6px;
        color: var(--text-muted);
        background: transparent;
        font-size: 0.82rem;
    }

    :global(.post-history-parent-toggle-button) {
        width: 28px;
        height: 28px;
        min-height: 28px;
        color: var(--text-muted);
    }

    :global(.post-history-parent-toggle-button .arrow-top-right-icon) {
        width: 20px;
        height: 20px;
        mask-image: url("/icons/arrow_top_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
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
