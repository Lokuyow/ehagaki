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

    interface Props {
        post: PostHistoryRecord;
        graphState: ComponentProps<typeof PostHistoryThreadGraphPanel>["state"];
        emojiLoadStateByUrl: ReactionDetailsProps["emojiLoadStateByUrl"];
        emojiImageMetaByUrl: ReactionDetailsProps["emojiImageMetaByUrl"];
        onReactionPost: PostActionsProps["onReactionPost"];
        onReplyPost: PostActionsProps["onReplyPost"];
        onQuotePost: PostActionsProps["onQuotePost"];
        repliesActionLabel: string;
        onRepliesAction: () => void;
        reactionsExpanded: boolean;
        reactionsActionLabel: string;
        onToggleReactions: () => void;
        menuOpen: boolean;
        onMenuOpenChange: (open: boolean) => void;
        externalClientLabel: string;
        onOpenExternalClient: () => void;
        onRefreshRelatedEvents: () => void;
        isSearchMode: boolean;
        onShowSurroundingPosts: () => void;
        /** Read only while the menu is open, so the items are built lazily. */
        getActionItems: () => Omit<
            ComponentProps<typeof PostHistoryRecordActionItems>,
            "order" | "showDeleteSeparator"
        >;
    }

    let {
        post,
        graphState,
        emojiLoadStateByUrl,
        emojiImageMetaByUrl,
        onReactionPost,
        onReplyPost,
        onQuotePost,
        repliesActionLabel,
        onRepliesAction,
        reactionsExpanded,
        reactionsActionLabel,
        onToggleReactions,
        menuOpen,
        onMenuOpenChange,
        externalClientLabel,
        onOpenExternalClient,
        onRefreshRelatedEvents,
        isSearchMode,
        onShowSurroundingPosts,
        getActionItems,
    }: Props = $props();
</script>

<PostHistoryPreviewFooter
        formattedDate={onReplyPost || onQuotePost ? formatPostedAt(
            post.postedAt,
        ) : ""}
        dimmed={!!post.deletedAt}
    >
        {#snippet actions()}
            <PostHistoryPostActions {onReactionPost}
                {post}
                {onReplyPost}
                {onQuotePost}
            >
                {#snippet replyExtras()}
                    {#if graphState.repliesActionState.status === "loaded" && graphState.repliesActionState.replyCount > 0}
                        <PostHistoryRepliesBadgeButton
                            count={graphState.repliesActionState.replyCount}
                            selected={graphState.repliesActionState.visible}
                            ariaLabel={repliesActionLabel}
                            tooltipContent={repliesActionLabel}
                            onClick={onRepliesAction}
                        />
                    {/if}
                {/snippet}
                {#snippet reactionExtras()}
                    {#if graphState.reactionSummary.totalCount > 0}
                        <PostHistoryReactionActionButton
                            count={graphState.reactionSummary.totalCount}
                            expanded={reactionsExpanded}
                            ariaLabel={reactionsActionLabel}
                            onToggle={onToggleReactions}
                        />
                    {/if}
                {/snippet}
            </PostHistoryPostActions>
        {/snippet}
        {#snippet trailing()}
            {@const actionsLabel =
                $_("common.showActions")}
            {#if onReplyPost || onQuotePost}
              <PostHistoryActionMenu
                lazy={true}
                open={menuOpen}
                onOpenChange={onMenuOpenChange}
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
                        onSelect={onOpenExternalClient}
                    >
                        <div
                            class="open-in-new-icon svg-icon"
                            aria-hidden="true"
                        ></div>
                        <span>{externalClientLabel}</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator
                        class="post-history-menu-separator"
                    />
                    <DropdownMenu.Item
                        class="menu-action-button"
                        disabled={graphState.relatedEventsStatus === "loading"}
                        onSelect={onRefreshRelatedEvents}
                    >
                        <div class="find_in_page-icon svg-icon" aria-hidden="true"></div>
                        <span>{$_("postHistory.checkRelatedEvents")}</span>
                    </DropdownMenu.Item>
                    {#if isSearchMode}
                        <DropdownMenu.Item
                            class="menu-action-button"
                            onSelect={onShowSurroundingPosts}
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
                        showDeleteSeparator={!!(onReplyPost || onQuotePost)}
                        {...getActionItems()}
                    />
                {/snippet}
              </PostHistoryActionMenu>
            {/if}
        {/snippet}
    </PostHistoryPreviewFooter>
    {#if graphState.relatedEventsStatus === "failed"}
        <p role="status">{$_("postHistory.relatedEventsFailed")}</p>
    {/if}
    {#if graphState.reactionSummary.totalCount > 0 && reactionsExpanded}
        <PostHistoryReactionDetails
            readModel={graphState.reactionReadModel}
            {emojiLoadStateByUrl}
            {emojiImageMetaByUrl}
        />
    {/if}
