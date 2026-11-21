<script lang="ts">
    import type { ComponentProps } from "svelte";
    import { DropdownMenu } from "bits-ui";
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import PostHistoryActionMenu from "./PostHistoryActionMenu.svelte";
    import PostHistoryRecordActionItems from "./PostHistoryRecordActionItems.svelte";
    import PostHistoryDeletionLifecycleStatusBadge from "./PostHistoryDeletionLifecycleStatusBadge.svelte";
    import PostHistoryRepliesBadgeButton from "./PostHistoryRepliesBadgeButton.svelte";
    import PostHistoryThreadToggleButton from "./PostHistoryThreadToggleButton.svelte";
    import PostHistoryThreadGraphNodeView from "./PostHistoryThreadGraphNodeView.svelte";
    import PostHistoryThreadNode from "./PostHistoryThreadNode.svelte";
    import PostHistoryPostActions from "./PostHistoryPostActions.svelte";
    import PostHistoryReactionActionButton from "./PostHistoryReactionActionButton.svelte";
    import PostHistoryReactionDetails from "./PostHistoryReactionDetails.svelte";
    import type { PostHistoryReactionReadModel } from "../lib/postHistoryReactionReadModel";
    import {
        formatPostedAt,
        formatPostedAtExact,
    } from "../lib/postHistoryDialogUtils";
    import { resolvePostHistoryThreadContextIndentRem } from "../lib/postHistoryThreadGraphUtils";
    import type { PostHistoryThreadGraphNodeState } from "../lib/hooks/usePostHistoryThreadGraph.svelte";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import type {
        PostContentEmojiImageMeta,
        PostContentEmojiLoadState,
        PostContentRenderModel,
    } from "../lib/postContentPreview";
    import type { FullscreenMediaItem, NostrEvent } from "../lib/types";

    interface Props {
        state: PostHistoryThreadGraphNodeState;
        previewModelByEventId?: Record<string, PostContentRenderModel>;
        getSensitiveBodyLoader?: (event: NostrEvent) => (() => Promise<string | null>) | undefined;
        emojiLoadStateByUrl?: Record<
            string,
            PostContentEmojiLoadState | undefined
        >;
        emojiImageMetaByUrl?: Record<
            string,
            PostContentEmojiImageMeta | undefined
        >;
        scrollRoot?: HTMLElement | null;
        onImageOpen?: (params: {
            index: number;
            mediaList: FullscreenMediaItem[];
        }) => void;
        buildPostRecordForNode?: (
            nodeState: PostHistoryThreadGraphNodeState,
        ) => PostHistoryRecord;
        onReplyPost?: (
            post: PostHistoryRecord,
        ) => boolean | void | Promise<boolean | void>;
        onQuotePost?: (post: PostHistoryRecord) => void;
        onReactionPost?: (post: PostHistoryRecord) => boolean | Promise<boolean>;
        getReactionReadModel?: (eventId: string) => PostHistoryReactionReadModel | null;
        isReactionExpanded?: (eventId: string) => boolean;
        getReactionLabel?: (eventId: string) => string;
        onToggleReaction?: (eventId: string) => void;
        onToggleParent?: (nodeEventId: string) => void;
        onRetryParent?: (nodeEventId: string) => void;
        onRefreshRelatedEvents?: (nodeEventId: string) => void;
        onToggleChildren?: (nodeEventId: string) => void;
        onRetryChildren?: (nodeEventId: string) => void;
        getActionItems: (nodeState: PostHistoryThreadGraphNodeState) => Omit<
            ComponentProps<typeof PostHistoryRecordActionItems>,
            "order" | "showDeleteSeparator" | "afterExternalClient"
        >;
    }

    let {
        state,
        previewModelByEventId = {},
        getSensitiveBodyLoader = undefined,
        emojiLoadStateByUrl = {},
        emojiImageMetaByUrl = {},
        scrollRoot = null,
        onImageOpen = undefined,
        buildPostRecordForNode = undefined,
        onReplyPost = undefined,
        onQuotePost = undefined,
        onReactionPost = undefined,
        getReactionReadModel = undefined,
        isReactionExpanded = undefined,
        getReactionLabel = undefined,
        onToggleReaction = undefined,
        onToggleParent = undefined,
        onRetryParent = undefined,
        onRefreshRelatedEvents = undefined,
        onToggleChildren = undefined,
        onRetryChildren = undefined,
        getActionItems,
    }: Props = $props();

    let postedAtExact = $derived(
        formatPostedAtExact(state.node.event.created_at * 1000),
    );
    const replyIndent = $derived(
        `${resolvePostHistoryThreadContextIndentRem(Math.max(0, state.depthFromAnchor))}rem`,
    );
    let showRepliesBadge = $derived(
        state.repliesActionState.status === "loaded" &&
            state.repliesActionState.replyCount > 0,
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
</script>

<div
    class="post-history-thread-node-view"
>
    {#if state.parentTargetId}
        <div class="post-history-thread-node-parent">
            {#if state.parentExpansion.visibleParent && state.parentNodeState}
                <PostHistoryThreadGraphNodeView
                    state={state.parentNodeState}
                    {previewModelByEventId}
                    {getSensitiveBodyLoader}
                    {emojiLoadStateByUrl}
                    {emojiImageMetaByUrl}
                    {scrollRoot}
                    {onImageOpen}
                    {buildPostRecordForNode}
                    {onReplyPost}
                    {onQuotePost}
                    {onReactionPost}
                    {getReactionReadModel}
                    {isReactionExpanded}
                    {getReactionLabel}
                    {onToggleReaction}
                    {onToggleParent}
                    {onRetryParent}
                    {onRefreshRelatedEvents}
                    {onToggleChildren}
                    {onRetryChildren}
                    {getActionItems}
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
        style:--thread-reply-indent={replyIndent}
        data-post-history-thread-anchor-scope-id={state.anchorEventId}
        data-post-history-thread-anchor-event-id={state.node.eventId}
    >
        <PostHistoryThreadNode
            node={state.node}
            model={previewModelByEventId[state.node.eventId]}
            loadSensitiveBody={getSensitiveBodyLoader?.(state.node.event)}
            {emojiLoadStateByUrl}
            {emojiImageMetaByUrl}
            {scrollRoot}
            {onImageOpen}
        >
            {#snippet topActions()}
                {#if state.parentTargetId && !state.parentAlreadyInPath && !(state.parentExpansion.visibleParent && state.parentExpansion.parentDeleted)}
                    <div class="post-history-thread-node-top-actions">
                        <PostHistoryThreadToggleButton
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
                {#if buildPostRecordForNode}
                    <PostHistoryPostActions {onReplyPost} {onQuotePost} {onReactionPost}
                        post={buildPostRecordForNode(state)}
                    >
                        {#snippet replyExtras()}
                            {#if showRepliesBadge}
                                <PostHistoryRepliesBadgeButton
                                    count={state.repliesActionState.replyCount}
                                    selected={state.repliesActionState.visible}
                                    ariaLabel={getRepliesActionLabel()}
                                    tooltipContent={getRepliesActionLabel()}
                                    onClick={handleRepliesAction}
                                />
                            {/if}
                        {/snippet}
                        {#snippet reactionExtras()}
                            {@const reactionModel = getReactionReadModel?.(state.node.eventId)}
                            {#if reactionModel && reactionModel.totalCount > 0}
                                <PostHistoryReactionActionButton
                                    count={reactionModel.totalCount}
                                    expanded={isReactionExpanded?.(state.node.eventId) ?? false}
                                    ariaLabel={getReactionLabel?.(state.node.eventId) ?? ""}
                                    onToggle={() => onToggleReaction?.(state.node.eventId)}
                                />
                            {/if}
                        {/snippet}
                    </PostHistoryPostActions>
                {/if}
            {/snippet}

            {#snippet footerDetails()}
                {@const reactionModel = getReactionReadModel?.(state.node.eventId)}
                {#if reactionModel && reactionModel.totalCount > 0 && (isReactionExpanded?.(state.node.eventId) ?? false)}
                    <PostHistoryReactionDetails readModel={reactionModel} {emojiLoadStateByUrl} {emojiImageMetaByUrl} />
                {/if}
            {/snippet}

            {#snippet footerMenu()}
                {@const actionsLabel = $_("common.showActions")}
                <PostHistoryActionMenu
                    triggerAriaLabel={actionsLabel}
                    tooltipContent={actionsLabel}
                    enableTooltip={true}
                    timestamp={postedAtExact}
                >
                    {#snippet items()}
                        <PostHistoryRecordActionItems
                            order="raw-json-first"
                            showDeleteSeparator={true}
                            {...getActionItems(state)}
                        >
                            {#snippet afterExternalClient()}
                                <DropdownMenu.Item
                                    class="menu-action-button"
                                    disabled={state.relatedEventsStatus === "loading"}
                                    onSelect={() => onRefreshRelatedEvents?.(state.node.eventId)}
                                >
                                    <div class="find_in_page-icon svg-icon" aria-hidden="true"></div>
                                    <span>{$_("postHistory.checkRelatedEvents")}</span>
                                </DropdownMenu.Item>
                            {/snippet}
                        </PostHistoryRecordActionItems>
                    {/snippet}
                </PostHistoryActionMenu>
            {/snippet}
        </PostHistoryThreadNode>
    </div>

    {#if state.relatedEventsStatus === "failed"}
        <p role="status">{$_("postHistory.relatedEventsFailed")}</p>
    {/if}

    {#if state.repliesActionState.visible && state.replyNodeStates.length > 0}
        <div class="post-history-thread-node-children">
            {#each state.replyNodeStates as replyState (replyState.node.eventId)}
                <PostHistoryThreadGraphNodeView
                    state={replyState}
                    {previewModelByEventId}
                    {getSensitiveBodyLoader}
                    {emojiLoadStateByUrl}
                    {emojiImageMetaByUrl}
                    {scrollRoot}
                    {onImageOpen}
                    {buildPostRecordForNode}
                    {onReplyPost}
                    {onQuotePost}
                    {onReactionPost}
                    {getReactionReadModel}
                    {isReactionExpanded}
                    {getReactionLabel}
                    {onToggleReaction}
                    {onToggleParent}
                    {onRetryParent}
                    {onRefreshRelatedEvents}
                    {onToggleChildren}
                    {onRetryChildren}
                    {getActionItems}
                />
            {/each}
        </div>
    {/if}
</div>

<style>
    .post-history-thread-node-top-actions {
        width: 100%;
        height: 28px;
    }

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
        min-width: 0;
        margin-inline-start: min(var(--thread-reply-indent), 12%);
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
