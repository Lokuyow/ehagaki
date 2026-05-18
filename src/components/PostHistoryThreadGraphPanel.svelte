<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import PostHistoryThreadGraphNodeView from "./PostHistoryThreadGraphNodeView.svelte";
    import PostHistoryThreadNode from "./PostHistoryThreadNode.svelte";
    import type { PostHistoryThreadGraphAnchorState } from "../lib/hooks/usePostHistoryThreadGraph.svelte";

    interface Props {
        state: PostHistoryThreadGraphAnchorState;
        section: "parent" | "children";
        onToggleParent?: () => void;
        onRetryParent?: () => void;
        onToggleNodeParent?: (nodeEventId: string) => void;
        onRetryNodeParent?: (nodeEventId: string) => void;
        onToggleNodeChildren?: (nodeEventId: string) => void;
        onRetryNodeChildren?: (nodeEventId: string) => void;
    }

    let {
        state,
        section,
        onToggleParent = undefined,
        onRetryParent = undefined,
        onToggleNodeParent = undefined,
        onRetryNodeParent = undefined,
        onToggleNodeChildren = undefined,
        onRetryNodeChildren = undefined,
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
        {:else if state.parentExpansion.visibleParent && state.parentNodeState}
            <PostHistoryThreadGraphNodeView
                state={state.parentNodeState}
                ancestorIndex={0}
                onToggleParent={onToggleNodeParent}
                onRetryParent={onRetryNodeParent}
                onToggleChildren={onToggleNodeChildren}
                onRetryChildren={onRetryNodeChildren}
            />
        {:else if state.parentExpansion.visibleParent && state.parentNode}
            <PostHistoryThreadNode node={state.parentNode} parentOffsetRem={3} />
        {:else if state.parentExpansion.visibleParent && state.parentExpansion.parentDeleted}
            <span class="post-history-context-deleted-label">
                {$_("postHistory.replyTargetDeleted")}
            </span>
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
            {#if !(state.parentExpansion.visibleParent && state.parentExpansion.parentDeleted)}
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
                    onClick={() => onToggleParent?.()}
                >
                    <span
                        class="arrow-top-left-icon svg-icon"
                        aria-hidden="true"
                    ></span>
                </Button>
            {/if}
        </div>
    </div>
{:else if section === "children" && state.repliesActionState.visible && state.replyNodeStates.length > 0}
    <div class="post-history-thread-replies-panel">
        <div class="post-history-thread-replies-list">
            {#each state.replyNodeStates as replyState (replyState.node.eventId)}
                <PostHistoryThreadGraphNodeView
                    state={replyState}
                    onToggleParent={onToggleNodeParent}
                    onRetryParent={onRetryNodeParent}
                    onToggleChildren={onToggleNodeChildren}
                    onRetryChildren={onRetryNodeChildren}
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

    .post-history-thread-parent-panel {
        padding-left: 0;
        padding-bottom: 4px;
    }

    .post-history-thread-replies-list {
        display: grid;
    }

    .post-history-context-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
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

    :global(.post-history-parent-toggle-button .arrow-top-left-icon) {
        width: 20px;
        height: 20px;
        mask-image: url("/icons/arrow_top_left_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
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
