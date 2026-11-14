<script lang="ts">
    import type { ComponentProps } from "svelte";
    import { DropdownMenu } from "bits-ui";
    import { _, locale } from "svelte-i18n";
    import {
        formatPostedAt,
        formatPostedAtExact,
    } from "../lib/postHistoryDialogUtils";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import PostHistoryActionMenu from "./PostHistoryActionMenu.svelte";
    import PostHistoryPostActions from "./PostHistoryPostActions.svelte";
    import PostHistoryPreviewFooter from "./PostHistoryPreviewFooter.svelte";
    import PostHistoryReactionActionButton from "./PostHistoryReactionActionButton.svelte";
    import PostHistoryReactionDetails from "./PostHistoryReactionDetails.svelte";
    import PostHistoryRecordActionItems from "./PostHistoryRecordActionItems.svelte";
    import PostHistoryRepliesBadgeButton from "./PostHistoryRepliesBadgeButton.svelte";
    import PostHistoryThreadGraphPanel from "./PostHistoryThreadGraphPanel.svelte";

    type PostActionsProps = ComponentProps<typeof PostHistoryPostActions>;
    type ReactionDetailsProps = ComponentProps<typeof PostHistoryReactionDetails>;

    /**
     * What the post footer needs from the history tab. The tab owns the state
     * behind these; they are read here while rendering, so they stay reactive.
     */
    interface RecordFooterView {
        readonly onReactionPost: PostActionsProps["onReactionPost"];
        readonly onReplyPost: PostActionsProps["onReplyPost"];
        readonly onQuotePost: PostActionsProps["onQuotePost"];
        getRepliesActionLabel: (post: PostHistoryRecord) => string;
        onRepliesAction: (post: PostHistoryRecord) => void;
        isReactionsExpanded: (post: PostHistoryRecord) => boolean;
        getReactionsActionLabel: (post: PostHistoryRecord) => string;
        toggleReactions: (post: PostHistoryRecord) => void;
        isMenuOpen: (menuKey: string) => boolean;
        setMenuOpen: (menuKey: string, open: boolean) => void;
        getExternalClientOpenLabel: () => string;
        onOpenExternalClient: (post: PostHistoryRecord) => void;
        onRefreshRelatedEvents: (post: PostHistoryRecord) => void;
        readonly isSearchMode: boolean;
        onShowSurroundingPosts: (post: PostHistoryRecord) => void;
        getActionItems: (
            post: PostHistoryRecord,
        ) => Omit<
            ComponentProps<typeof PostHistoryRecordActionItems>,
            "order" | "showDeleteSeparator"
        >;
    }

    interface Props {
        post: PostHistoryRecord;
        graphState: ComponentProps<typeof PostHistoryThreadGraphPanel>["state"];
        emojiLoadStateByUrl: ReactionDetailsProps["emojiLoadStateByUrl"];
        emojiImageMetaByUrl: ReactionDetailsProps["emojiImageMetaByUrl"];
        view: RecordFooterView;
    }

    let {
        post,
        graphState,
        emojiLoadStateByUrl,
        emojiImageMetaByUrl,
        view,
    }: Props = $props();
</script>

<PostHistoryPreviewFooter
        formattedDate={view.onReplyPost || view.onQuotePost ? formatPostedAt(
            post.postedAt,
        ) : ""}
        dimmed={!!post.deletedAt}
    >
        {#snippet actions()}
            <PostHistoryPostActions onReactionPost={view.onReactionPost}
                {post}
                onReplyPost={view.onReplyPost}
                onQuotePost={view.onQuotePost}
            >
                {#snippet replyExtras()}
                    {#if graphState.repliesActionState.status === "loaded" && graphState.repliesActionState.replyCount > 0}
                        <PostHistoryRepliesBadgeButton
                            count={graphState.repliesActionState.replyCount}
                            selected={graphState.repliesActionState.visible}
                            ariaLabel={view.getRepliesActionLabel(post)}
                            tooltipContent={view.getRepliesActionLabel(post)}
                            onClick={() => view.onRepliesAction(post)}
                        />
                    {/if}
                {/snippet}
                {#snippet reactionExtras()}
                    {#if graphState.reactionSummary.totalCount > 0}
                        <PostHistoryReactionActionButton
                            count={graphState.reactionSummary.totalCount}
                            expanded={view.isReactionsExpanded(post)}
                            ariaLabel={view.getReactionsActionLabel(post)}
                            onToggle={() => view.toggleReactions(post)}
                        />
                    {/if}
                {/snippet}
            </PostHistoryPostActions>
        {/snippet}
        {#snippet trailing()}
            {@const actionsLabel =
                $_("common.showActions")}
            {#if view.onReplyPost || view.onQuotePost}
              <PostHistoryActionMenu
                lazy={true}
                open={view.isMenuOpen(
                    post.eventId,
                )}
                onOpenChange={(
                    open: boolean,
                ) =>
                    view.setMenuOpen(
                        post.eventId,
                        open,
                    )}
                triggerAriaLabel={actionsLabel}
                tooltipContent={actionsLabel}
                enableTooltip={true}
                timestamp={formatPostedAtExact(
                    post.postedAt,
                    $locale,
                )}
            >
                {#snippet items()}
                    <DropdownMenu.Item
                        class="menu-action-button"
                        onSelect={() => view.onOpenExternalClient(post)}
                    >
                        <div
                            class="open-in-new-icon svg-icon"
                            aria-hidden="true"
                        ></div>
                        <span>{view.getExternalClientOpenLabel()}</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator
                        class="post-history-menu-separator"
                    />
                    <DropdownMenu.Item
                        class="menu-action-button"
                        disabled={graphState.relatedEventsStatus === "loading"}
                        onSelect={() => view.onRefreshRelatedEvents(post)}
                    >
                        <div class="find_in_page-icon svg-icon" aria-hidden="true"></div>
                        <span>{$_("postHistory.checkRelatedEvents")}</span>
                    </DropdownMenu.Item>
                    {#if view.isSearchMode}
                        <DropdownMenu.Item
                            class="menu-action-button"
                            onSelect={() => view.onShowSurroundingPosts(post)}
                        >
                            <div
                                class="calendar-icon svg-icon"
                                aria-hidden="true"
                            ></div>
                            <span>
                                {$_(
                                    "postHistory.showSurroundingPosts",
                                )}
                            </span>
                        </DropdownMenu.Item>
                    {/if}
                    <PostHistoryRecordActionItems
                        order="standard"
                        showDeleteSeparator={!!(view.onReplyPost || view.onQuotePost)}
                        {...view.getActionItems(post)}
                    />
                {/snippet}
              </PostHistoryActionMenu>
            {/if}
        {/snippet}
    </PostHistoryPreviewFooter>
    {#if graphState.relatedEventsStatus === "failed"}
        <p role="status">{$_("postHistory.relatedEventsFailed")}</p>
    {/if}
    {#if graphState.reactionSummary.totalCount > 0 && view.isReactionsExpanded(post)}
        <PostHistoryReactionDetails
            readModel={graphState.reactionReadModel}
            {emojiLoadStateByUrl}
            {emojiImageMetaByUrl}
        />
    {/if}
