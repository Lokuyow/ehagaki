<script lang="ts">
    import { DropdownMenu } from "bits-ui";
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import PostHistoryDeletionLifecycleStatusBadge from "./PostHistoryDeletionLifecycleStatusBadge.svelte";
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
        canDeleteNodePost = undefined,
        isDeletionSending = undefined,
        onOpenDeleteConfirm = undefined,
    }: Props = $props();

    let postedAt = $derived(formatPostedAt(state.node.event.created_at * 1000));
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
        <PostHistoryThreadNode
            node={state.node}
            {scrollRoot}
            {onImageOpen}
            showHeaderDate={false}
        >
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

            <div class="post-preview-footer">
                <div class="post-preview-footer-left">
                    <span class="post-history-related-date">{postedAt}</span>
                    <PostHistoryDeletionLifecycleStatusBadge
                        eventId={state.node.eventId}
                    />
                </div>
                <div class="post-preview-footer-actions">
                    <div class="post-preview-footer-replies-slot">
                        {#if showRepliesBadge}
                            <Button
                                type="button"
                                class="post-preview-replies-badge-button"
                                ariaLabel={getRepliesActionLabel()}
                                title={getRepliesActionLabel()}
                                contentLayout="icon"
                                shape="circle"
                                selected={state.repliesActionState.visible}
                                onClick={handleRepliesAction}
                            >
                                <span
                                    class="post-preview-replies-badge"
                                    aria-hidden="true"
                                >
                                    {state.repliesActionState.replyCount}
                                </span>
                            </Button>
                        {/if}
                    </div>
                </div>
                <div class="post-preview-footer-right">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger
                            class="menu-trigger post-history-menu-trigger"
                            aria-label="アクションを表示"
                        >
                            <div class="more-icon svg-icon"></div>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                side="bottom"
                                align="start"
                                sideOffset={8}
                                class="post-history-menu-content"
                                trapFocus={false}
                                preventScroll={false}
                                onCloseAutoFocus={(event: Event) =>
                                    event.preventDefault()}
                            >
                                <div class="post-history-menu-body">
                                    <div class="post-history-menu-timestamp">
                                        {postedAtExact}
                                    </div>
                                    <DropdownMenu.Separator
                                        class="post-history-menu-separator"
                                    />
                                    <DropdownMenu.Item
                                        class="menu-action-button"
                                        disabled={state.repliesActionState
                                            .status === "loading"}
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
                                                    ? $_(
                                                          "postHistory.deleteSending",
                                                      )
                                                    : $_("postHistory.delete")}
                                            </span>
                                        </DropdownMenu.Item>
                                    {/if}
                                </div>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>
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
        padding-left: 0;
    }

    .post-history-thread-node-anchor {
        display: grid;
        margin-left: var(--thread-context-indent);
    }

    .post-history-thread-node-children {
        padding-left: 0;
    }

    .post-preview-footer {
        display: flex;
        align-items: stretch;
        justify-content: space-between;
        height: 28px;
        --post-history-related-card-action-bg: var(
            --post-history-related-card-bg,
            var(--dialog-bg)
        );
        --post-history-related-card-action-hover-bg-light: color-mix(
            in srgb,
            var(--post-history-related-card-action-bg),
            black 4%
        );
        --post-history-related-card-action-hover-bg-dark: color-mix(
            in srgb,
            var(--post-history-related-card-action-bg),
            white 5%
        );
        --post-history-related-card-action-hover-color-light: color-mix(
            in srgb,
            var(--text),
            black 40%
        );
        --post-history-related-card-action-hover-color-dark: color-mix(
            in srgb,
            var(--text),
            white 50%
        );
    }

    .post-preview-footer-left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .post-preview-footer-actions {
        display: flex;
        align-items: stretch;
        justify-content: center;
        flex: 1 0 auto;
    }

    .post-preview-footer-replies-slot {
        display: flex;
        align-items: stretch;
        justify-content: center;
        flex: 0 0 36px;
        min-width: 36px;
    }

    .post-preview-footer-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .post-history-menu-timestamp {
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.35;
        user-select: text;
        white-space: nowrap;
        margin-inline: auto;
        width: fit-content;
    }

    .post-preview-footer :global(.post-preview-replies-badge-button),
    .post-preview-footer :global(.menu-trigger.post-history-menu-trigger) {
        --btn-bg: var(--post-history-related-card-action-bg);
        background-color: var(--post-history-related-card-action-bg);
    }

    .post-preview-footer :global(.post-preview-replies-badge-button) {
        aspect-ratio: 1;
        min-height: auto;
        color: var(--btn-post-preview-action);
    }

    .post-preview-footer .post-preview-replies-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 999px;
        background: var(--btn-post-preview-action);
        color: var(--post-history-related-card-action-bg);
        font-size: 0.6875rem;
        font-weight: 700;
        text-align: center;
    }

    @media (min-width: 601px) {
        .post-preview-footer
            :global(.post-preview-replies-badge-button:hover:not(:disabled)),
        .post-preview-footer-right
            :global(
                .menu-trigger.post-history-menu-trigger:hover:not(:disabled)
            ) {
            :global(:root.light) & {
                background-color: var(
                    --post-history-related-card-action-hover-bg-light
                );
                color: var(
                    --post-history-related-card-action-hover-color-light
                );
            }

            :global(:root.dark) & {
                background-color: var(
                    --post-history-related-card-action-hover-bg-dark
                );
                color: var(--post-history-related-card-action-hover-color-dark);
            }
        }

        .post-preview-footer
            :global(
                .post-preview-replies-badge-button:hover:not(:disabled)
                    .post-preview-replies-badge
            ) {
            background-color: var(--text);
        }
    }

    :global(.post-preview-footer > .post-history-related-date) {
        font-size: 0.875rem;
    }

    :global(.post-history-context-button) {
        min-height: 28px;
        padding: 2px 6px;
        color: var(--text-muted);
        background: var(--btn-bg);
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
