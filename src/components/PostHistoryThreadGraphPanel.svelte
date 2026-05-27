<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import PostHistoryThreadToggleButton from "./PostHistoryThreadToggleButton.svelte";
    import PostHistoryThreadGraphNodeView from "./PostHistoryThreadGraphNodeView.svelte";
    import { resolvePostHistoryThreadContextIndentRem } from "../lib/postHistoryThreadGraphUtils";
    import type {
        PostHistoryThreadGraphAnchorState,
        PostHistoryThreadGraphNodeState,
    } from "../lib/hooks/usePostHistoryThreadGraph.svelte";
    import type { FullscreenMediaItem } from "../lib/types";

    interface Props {
        state: PostHistoryThreadGraphAnchorState;
        section: "parent" | "children";
        scrollRoot?: HTMLElement | null;
        onImageOpen?: (params: {
            index: number;
            mediaList: FullscreenMediaItem[];
        }) => void;
        onToggleParent?: () => void;
        onRetryParent?: () => void;
        onToggleNodeParent?: (nodeEventId: string) => void;
        onRetryNodeParent?: (nodeEventId: string) => void;
        onToggleNodeChildren?: (nodeEventId: string) => void;
        onRetryNodeChildren?: (nodeEventId: string) => void;
        onCopyPointerDown?: (
            nodeState: PostHistoryThreadGraphNodeState,
            event: PointerEvent,
        ) => void;
        onCopyNevent?: (
            nodeState: PostHistoryThreadGraphNodeState,
            event: Event,
        ) => void;
        isCopyFailed?: (nodeEventId: string) => boolean;
        canDeleteNodePost?: (nodeState: PostHistoryThreadGraphNodeState) => boolean;
        isDeletionSending?: (nodeEventId: string) => boolean;
        onOpenDeleteConfirm?: (nodeState: PostHistoryThreadGraphNodeState) => void;
    }

    let {
        state,
        section,
        scrollRoot = null,
        onImageOpen = undefined,
        onToggleParent = undefined,
        onRetryParent = undefined,
        onToggleNodeParent = undefined,
        onRetryNodeParent = undefined,
        onToggleNodeChildren = undefined,
        onRetryNodeChildren = undefined,
        onCopyPointerDown = undefined,
        onCopyNevent = undefined,
        isCopyFailed = undefined,
        canDeleteNodePost = undefined,
        isDeletionSending = undefined,
        onOpenDeleteConfirm = undefined,
    }: Props = $props();

    const directParentIndent = `${resolvePostHistoryThreadContextIndentRem(-1)}rem`;

    let fallbackParentNodeState = $derived.by(() => {
        if (!state.parentNode) {
            return null;
        }

        return {
            anchorEventId: state.anchorEventId,
            node: state.parentNode,
            parentTargetId: null,
            parentNodeState: null,
            parentExpansion: {
                loadedParent: false,
                visibleParent: false,
                loadingParent: false,
                parentError: null,
                parentMissing: false,
                parentDeleted: false,
                showParentLoadingIndicator: false,
                revalidatingParent: false,
                loadedChildren: false,
                visibleChildren: false,
                loadingChildren: false,
                revalidatingChildren: false,
                childrenError: null,
                lastFetchedParentAt: null,
                lastFetchedChildrenAt: null,
            },
            parentAlreadyInPath: true,
            repliesActionState: {
                status: "unloaded",
                visible: false,
                replies: [],
                replyCount: 0,
                error: null,
            },
            replyNodeStates: [],
            isOwnReply: false,
            depthFromAnchor: -1,
            cycleDetected: false,
        } satisfies PostHistoryThreadGraphNodeState;
    });
</script>

{#if section === "parent" && state.parentTargetId}
    <div
        class="post-history-thread-parent-panel"
        style={`--thread-direct-parent-indent: ${directParentIndent}`}
    >
        {#if state.parentExpansion.visibleParent && state.parentNodeState}
            <PostHistoryThreadGraphNodeView
                state={state.parentNodeState}
                {scrollRoot}
                {onImageOpen}
                onToggleParent={onToggleNodeParent}
                onRetryParent={onRetryNodeParent}
                onToggleChildren={onToggleNodeChildren}
                onRetryChildren={onRetryNodeChildren}
                {onCopyPointerDown}
                {onCopyNevent}
                {isCopyFailed}
                {canDeleteNodePost}
                {isDeletionSending}
                {onOpenDeleteConfirm}
            />
        {:else if state.parentExpansion.visibleParent && fallbackParentNodeState}
            <PostHistoryThreadGraphNodeView
                state={fallbackParentNodeState}
                {scrollRoot}
                {onImageOpen}
                onToggleParent={onToggleNodeParent}
                onRetryParent={onRetryNodeParent}
                onToggleChildren={onToggleNodeChildren}
                onRetryChildren={onRetryNodeChildren}
                {onCopyPointerDown}
                {onCopyNevent}
                {isCopyFailed}
                {canDeleteNodePost}
                {isDeletionSending}
                {onOpenDeleteConfirm}
            />
        {:else if state.parentExpansion.visibleParent && state.parentExpansion.parentDeleted}
            <span
                class="post-history-context-deleted-label post-history-thread-direct-parent-context"
            >
                {$_("postHistory.replyTargetDeleted")}
            </span>
        {:else if state.parentExpansion.visibleParent && state.parentExpansion.parentMissing}
            <p
                class="post-history-context-message post-history-thread-direct-parent-context"
            >
                {$_("postHistory.contextNotFound")}
            </p>
        {:else if state.parentExpansion.visibleParent && state.parentExpansion.parentError}
            <p
                class="post-history-context-message post-history-context-error post-history-thread-direct-parent-context"
            >
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
                <PostHistoryThreadToggleButton
                    ariaLabel={state.parentExpansion.visibleParent
                        ? $_("postHistory.hideReplyTarget")
                        : $_("postHistory.showReplyTarget")}
                    title={state.parentExpansion.visibleParent
                        ? $_("postHistory.hideReplyTarget")
                        : $_("postHistory.showReplyTarget")}
                    expanded={state.parentExpansion.visibleParent}
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
                    {scrollRoot}
                    {onImageOpen}
                    onToggleParent={onToggleNodeParent}
                    onRetryParent={onRetryNodeParent}
                    onToggleChildren={onToggleNodeChildren}
                    onRetryChildren={onRetryNodeChildren}
                    {onCopyPointerDown}
                    {onCopyNevent}
                    {isCopyFailed}
                    {canDeleteNodePost}
                    {isDeletionSending}
                    {onOpenDeleteConfirm}
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
