<script lang="ts">
    import { DropdownMenu } from "bits-ui";
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import PostHistoryActionMenu from "./PostHistoryActionMenu.svelte";
    import PostHistoryDeletionLifecycleStatusBadge from "./PostHistoryDeletionLifecycleStatusBadge.svelte";
    import PostHistoryRepliesBadgeButton from "./PostHistoryRepliesBadgeButton.svelte";
    import PostHistoryThreadToggleButton from "./PostHistoryThreadToggleButton.svelte";
    import PostHistoryThreadGraphNodeView from "./PostHistoryThreadGraphNodeView.svelte";
    import PostHistoryThreadNode from "./PostHistoryThreadNode.svelte";
    import {
        formatPostedAt,
        formatPostedAtExact,
    } from "../lib/postHistoryDialogUtils";
    import { resolvePostHistoryThreadContextIndentRem } from "../lib/postHistoryThreadGraphUtils";
    import type { PostHistoryThreadGraphNodeState } from "../lib/hooks/usePostHistoryThreadGraph.svelte";
    import type { FullscreenMediaItem } from "../lib/types";

    interface Props {
        state: PostHistoryThreadGraphNodeState;
        scrollRoot?: HTMLElement | null;
        onImageOpen?: (params: {
            index: number;
            mediaList: FullscreenMediaItem[];
        }) => void;
        onToggleParent?: (nodeEventId: string) => void;
        onRetryParent?: (nodeEventId: string) => void;
        onToggleChildren?: (nodeEventId: string) => void;
        onRetryChildren?: (nodeEventId: string) => void;
        onCopyPointerDown?: (
            nodeState: PostHistoryThreadGraphNodeState,
            event: PointerEvent,
        ) => void;
        onCopyNevent?: (
            nodeState: PostHistoryThreadGraphNodeState,
            event: Event,
        ) => void;
        isCopyFailed?: (nodeEventId: string) => boolean;
        onShowRawJson?: (nodeState: PostHistoryThreadGraphNodeState) => void;
        onBroadcastPointerDown?: (
            nodeState: PostHistoryThreadGraphNodeState,
            event: PointerEvent,
        ) => void;
        onBroadcastPost?: (
            nodeState: PostHistoryThreadGraphNodeState,
            event: Event,
        ) => void;
        isBroadcastSending?: (nodeEventId: string) => boolean;
        canDeleteNodePost?: (
            nodeState: PostHistoryThreadGraphNodeState,
        ) => boolean;
        isDeletionSending?: (nodeEventId: string) => boolean;
        onOpenDeleteConfirm?: (
            nodeState: PostHistoryThreadGraphNodeState,
        ) => void;
    }

    let {
        state,
        scrollRoot = null,
        onImageOpen = undefined,
        onToggleParent = undefined,
        onRetryParent = undefined,
        onToggleChildren = undefined,
        onRetryChildren = undefined,
        onCopyPointerDown = undefined,
        onCopyNevent = undefined,
        isCopyFailed = undefined,
        onShowRawJson = undefined,
        onBroadcastPointerDown = undefined,
        onBroadcastPost = undefined,
        isBroadcastSending = undefined,
        canDeleteNodePost = undefined,
        isDeletionSending = undefined,
        onOpenDeleteConfirm = undefined,
    }: Props = $props();

    let postedAtExact = $derived(
        formatPostedAtExact(state.node.event.created_at * 1000),
    );
    let contextIndent = $derived(
        `${resolvePostHistoryThreadContextIndentRem(state.depthFromAnchor)}rem`,
    );
    let showRepliesBadge = $derived(
        state.repliesActionState.status === "loaded" &&
            state.repliesActionState.replyCount > 0,
    );
    let copyFailed = $derived(isCopyFailed?.(state.node.eventId) ?? false);
    let broadcastSending = $derived(
        isBroadcastSending?.(state.node.eventId) ?? false,
    );
    let canDelete = $derived(canDeleteNodePost?.(state) ?? false);
    let deletionSending = $derived(
        isDeletionSending?.(state.node.eventId) ?? false,
    );

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
            (actionState.status === "loaded" && actionState.replyCount === 0)
        ) {
            onRetryChildren?.(state.node.eventId);
            return;
        }

        onToggleChildren?.(state.node.eventId);
    }

    function handleCopyPointerDown(event: PointerEvent): void {
        onCopyPointerDown?.(state, event);
    }

    function handleCopyNevent(event: Event): void {
        onCopyNevent?.(state, event);
    }

    function handleShowRawJson(): void {
        onShowRawJson?.(state);
    }

    function handleBroadcastPointerDown(event: PointerEvent): void {
        onBroadcastPointerDown?.(state, event);
    }

    function handleBroadcastPost(event: Event): void {
        onBroadcastPost?.(state, event);
    }

    function openDeleteConfirm(): void {
        onOpenDeleteConfirm?.(state);
    }
</script>

<div
    class="post-history-thread-node-view"
    style={`--thread-context-indent: ${contextIndent}`}
>
    {#if state.parentTargetId}
        <div class="post-history-thread-node-parent">
            {#if state.parentExpansion.visibleParent && state.parentNodeState}
                <PostHistoryThreadGraphNodeView
                    state={state.parentNodeState}
                    {scrollRoot}
                    {onImageOpen}
                    {onToggleParent}
                    {onRetryParent}
                    {onToggleChildren}
                    {onRetryChildren}
                    {onCopyPointerDown}
                    {onCopyNevent}
                    {isCopyFailed}
                    {onShowRawJson}
                    {onBroadcastPointerDown}
                    {onBroadcastPost}
                    {isBroadcastSending}
                    {canDeleteNodePost}
                    {isDeletionSending}
                    {onOpenDeleteConfirm}
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

    <div
        class="post-history-thread-node-anchor"
        data-post-history-thread-anchor-scope-id={state.anchorEventId}
        data-post-history-thread-anchor-event-id={state.node.eventId}
    >
        <PostHistoryThreadNode node={state.node} {scrollRoot} {onImageOpen}>
            {#snippet topActions()}
                {#if state.parentTargetId && !state.parentAlreadyInPath && !(state.parentExpansion.visibleParent && state.parentExpansion.parentDeleted)}
                    <div class="post-history-thread-node-top-actions">
                        <PostHistoryThreadToggleButton
                            ariaLabel={state.parentExpansion.visibleParent
                                ? $_("postHistory.hideReplyTarget")
                                : $_("postHistory.showReplyTarget")}
                            title={state.parentExpansion.visibleParent
                                ? $_("postHistory.hideReplyTarget")
                                : $_("postHistory.showReplyTarget")}
                            expanded={state.parentExpansion.visibleParent}
                            loading={state.parentExpansion.visibleParent &&
                                state.parentExpansion
                                    .showParentLoadingIndicator}
                            onClick={() => onToggleParent?.(state.node.eventId)}
                        />
                    </div>
                {/if}
            {/snippet}

            {#snippet footerLeftExtras()}
                <PostHistoryDeletionLifecycleStatusBadge
                    eventId={state.node.eventId}
                />
            {/snippet}

            {#snippet footerActions()}
                <div class="post-preview-footer-replies-slot">
                    {#if showRepliesBadge}
                        <PostHistoryRepliesBadgeButton
                            count={state.repliesActionState.replyCount}
                            selected={state.repliesActionState.visible}
                            ariaLabel={getRepliesActionLabel()}
                            onClick={handleRepliesAction}
                        />
                    {/if}
                </div>
            {/snippet}

            {#snippet footerMenu()}
                <PostHistoryActionMenu
                    triggerAriaLabel="アクションを表示"
                    timestamp={postedAtExact}
                >
                    {#snippet items()}
                        <DropdownMenu.Item
                            class="menu-action-button"
                            disabled={state.repliesActionState.status ===
                                "loading"}
                            onSelect={handleRepliesAction}
                        >
                            <div
                                class={`${
                                    state.repliesActionState.visible
                                        ? "collapse-content-icon"
                                        : "find_in_page-icon"
                                } svg-icon`}
                                aria-hidden="true"
                            ></div>
                            <span>{getRepliesActionLabel()}</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            class="menu-action-button"
                            onSelect={handleShowRawJson}
                        >
                            <div
                                class="raw-json-icon svg-icon"
                                aria-hidden="true"
                            ></div>
                            <span>{$_("postHistory.rawJson")}</span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            class="menu-action-button"
                            onpointerdown={handleCopyPointerDown}
                            onSelect={handleCopyNevent}
                        >
                            <div
                                class="copy-icon svg-icon"
                                aria-hidden="true"
                            ></div>
                            <span>
                                {copyFailed
                                    ? $_("postHistory.copyFailed")
                                    : $_("postHistory.copyNevent")}
                            </span>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            class="menu-action-button"
                            disabled={broadcastSending}
                            onpointerdown={handleBroadcastPointerDown}
                            onSelect={handleBroadcastPost}
                        >
                            <div
                                class="broadcast-icon svg-icon"
                                aria-hidden="true"
                            ></div>
                            <span>{$_("postHistory.broadcast")}</span>
                        </DropdownMenu.Item>
                        {#if canDelete}
                            <DropdownMenu.Separator
                                class="post-history-menu-separator"
                            />
                            <DropdownMenu.Item
                                class="menu-action-button menu-action-button-danger"
                                disabled={deletionSending}
                                onSelect={openDeleteConfirm}
                            >
                                <div
                                    class="trash-icon svg-icon"
                                    aria-hidden="true"
                                ></div>
                                <span>
                                    {deletionSending
                                        ? $_("postHistory.deleteSending")
                                        : $_("postHistory.delete")}
                                </span>
                            </DropdownMenu.Item>
                        {/if}
                    {/snippet}
                </PostHistoryActionMenu>
            {/snippet}
        </PostHistoryThreadNode>
    </div>

    {#if state.repliesActionState.visible && state.replyNodeStates.length > 0}
        <div class="post-history-thread-node-children">
            {#each state.replyNodeStates as replyState (replyState.node.eventId)}
                <PostHistoryThreadGraphNodeView
                    state={replyState}
                    {scrollRoot}
                    {onImageOpen}
                    {onToggleParent}
                    {onRetryParent}
                    {onToggleChildren}
                    {onRetryChildren}
                    {onCopyPointerDown}
                    {onCopyNevent}
                    {isCopyFailed}
                    {onShowRawJson}
                    {onBroadcastPointerDown}
                    {onBroadcastPost}
                    {isBroadcastSending}
                    {canDeleteNodePost}
                    {isDeletionSending}
                    {onOpenDeleteConfirm}
                />
            {/each}
        </div>
    {/if}
</div>

<style>
    .post-history-thread-node-view {
        display: grid;
        gap: 1px;
    }

    .post-history-thread-node-parent,
    .post-history-thread-node-children {
        display: grid;
        gap: 2px;
    }

    .post-history-thread-node-parent {
        padding-inline-start: 0;
    }

    .post-history-thread-node-anchor {
        display: grid;
        margin-left: var(--thread-context-indent);
    }

    .post-history-thread-node-children {
        padding-inline-start: 0;
    }

    :global(.post-history-context-button) {
        min-height: 28px;
        padding: 2px 6px;
        color: var(--text-muted);
        background: var(--btn-bg);
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
