<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import PostHistoryThreadActionButton from "./PostHistoryThreadActionButton.svelte";
    import PostHistoryThreadGraphNodeView from "./PostHistoryThreadGraphNodeView.svelte";
    import PostHistoryThreadNode from "./PostHistoryThreadNode.svelte";
    import { resolvePostHistoryThreadContextIndentRem } from "../lib/postHistoryThreadGraphUtils";
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

    const directParentIndent =
        `${resolvePostHistoryThreadContextIndentRem(-1)}rem`;
</script>

{#if section === "parent" && state.parentTargetId}
    <div
        class="post-history-thread-parent-panel"
        style={`--thread-direct-parent-indent: ${directParentIndent}`}
    >
        {#if state.parentExpansion.visibleParent && state.parentNodeState}
            <PostHistoryThreadGraphNodeView
                state={state.parentNodeState}
                onToggleParent={onToggleNodeParent}
                onRetryParent={onRetryNodeParent}
                onToggleChildren={onToggleNodeChildren}
                onRetryChildren={onRetryNodeChildren}
            />
        {:else if state.parentExpansion.visibleParent && state.parentNode}
            <div class="post-history-thread-direct-parent-context">
                <PostHistoryThreadNode node={state.parentNode} />
            </div>
        {:else if state.parentExpansion.visibleParent && state.parentExpansion.parentDeleted}
            <span class="post-history-context-deleted-label post-history-thread-direct-parent-context">
                {$_("postHistory.replyTargetDeleted")}
            </span>
        {:else if state.parentExpansion.visibleParent && state.parentExpansion.parentMissing}
            <p class="post-history-context-message post-history-thread-direct-parent-context">
                {$_("postHistory.contextNotFound")}
            </p>
        {:else if state.parentExpansion.visibleParent && state.parentExpansion.parentError}
            <p class="post-history-context-message post-history-context-error post-history-thread-direct-parent-context">
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
                <PostHistoryThreadActionButton
                    icon={state.parentExpansion.visibleParent
                        ? "collapse-content"
                        : "arrow-top-right"}
                    className="post-history-parent-toggle-button"
                    ariaLabel={state.parentExpansion.visibleParent
                        ? $_("postHistory.hideReplyTarget")
                        : $_("postHistory.showReplyTarget")}
                    title={state.parentExpansion.visibleParent
                        ? $_("postHistory.hideReplyTarget")
                        : $_("postHistory.showReplyTarget")}
                    selected={state.parentExpansion.visibleParent}
                    loading={state.parentExpansion.visibleParent &&
                        state.parentExpansion.showParentLoadingIndicator}
                    onClick={() => onToggleParent?.()}
                />
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
    }

    .post-history-thread-parent-panel {
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

    :global(.post-history-thread-direct-parent-context) {
        margin-left: var(--thread-direct-parent-indent);
    }

    :global(.post-history-context-button) {
        min-height: 28px;
        padding: 2px 6px;
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
