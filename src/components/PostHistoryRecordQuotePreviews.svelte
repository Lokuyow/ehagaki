<script lang="ts">
    import type { ComponentProps } from "svelte";
    import { _, locale } from "svelte-i18n";
    import type { PostHistoryQuotePreviewState } from "../lib/hooks/usePostHistoryQuotePreviews.svelte";
    import type { PostContentRenderModel } from "../lib/postContentPreview";
    import { formatPostedAtExact } from "../lib/postHistoryDialogUtils";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import type { NostrEvent } from "../lib/types";
    import PostHistoryActionMenu from "./PostHistoryActionMenu.svelte";
    import PostHistoryPostActions from "./PostHistoryPostActions.svelte";
    import PostHistoryQuotePreview from "./PostHistoryQuotePreview.svelte";
    import PostHistoryReactionActionButton from "./PostHistoryReactionActionButton.svelte";
    import PostHistoryReactionDetails from "./PostHistoryReactionDetails.svelte";
    import PostHistoryRecordActionItems from "./PostHistoryRecordActionItems.svelte";

    type QuotePreviewProps = ComponentProps<typeof PostHistoryQuotePreview>;
    type PostActionsProps = ComponentProps<typeof PostHistoryPostActions>;
    type ReactionReadModel = ComponentProps<typeof PostHistoryReactionDetails>["readModel"];

    interface Props {
        parentEventId: string;
        previews: PostHistoryQuotePreviewState[];
        emojiLoadStateByUrl: QuotePreviewProps["emojiLoadStateByUrl"];
        emojiImageMetaByUrl: QuotePreviewProps["emojiImageMetaByUrl"];
        scrollRoot: QuotePreviewProps["scrollRoot"];
        getSensitiveBodyLoader: (event: NostrEvent) => QuotePreviewProps["loadSensitiveBody"];
        getModel: (eventId: string) => PostContentRenderModel | undefined;
        onImageOpen: QuotePreviewProps["onImageOpen"];
        onRetry: (eventId: string) => void;
        onReactionPost: PostActionsProps["onReactionPost"];
        onReplyPost: PostActionsProps["onReplyPost"];
        onQuotePost: PostActionsProps["onQuotePost"];
        getReactionReadModel: (eventId: string) => ReactionReadModel | null | undefined;
        isReactionExpanded: (eventId: string) => boolean;
        getReactionLabel: (eventId: string) => string;
        onToggleReaction: (eventId: string) => void;
        /** Record used for the quoted event's actions and menu. */
        buildRecord: (event: NostrEvent) => PostHistoryRecord;
        buildMenuKey: (parentEventId: string, quoteEventId: string) => string;
        isMenuOpen: (menuKey: string) => boolean;
        onMenuOpenChange: (menuKey: string, open: boolean) => void;
        getActionItems: (
            record: PostHistoryRecord,
        ) => Omit<
            ComponentProps<typeof PostHistoryRecordActionItems>,
            "order" | "showDeleteSeparator"
        >;
    }

    let {
        parentEventId,
        previews,
        emojiLoadStateByUrl,
        emojiImageMetaByUrl,
        scrollRoot,
        getSensitiveBodyLoader,
        getModel,
        onImageOpen,
        onRetry,
        onReactionPost,
        onReplyPost,
        onQuotePost,
        getReactionReadModel,
        isReactionExpanded,
        getReactionLabel,
        onToggleReaction,
        buildRecord,
        buildMenuKey,
        isMenuOpen,
        onMenuOpenChange,
        getActionItems,
    }: Props = $props();
</script>

{#if previews.length > 0}
    <div class="post-preview-quotes">
        {#each previews as quotePreview (quotePreview.eventId)}
            <PostHistoryQuotePreview
                preview={quotePreview}
                loadSensitiveBody={quotePreview.status === "resolved"
                    ? getSensitiveBodyLoader(quotePreview.event)
                    : undefined}
                model={quotePreview.status ===
                "resolved"
                    ? getModel(quotePreview.event.id)
                    : undefined}
                {emojiLoadStateByUrl}
                {emojiImageMetaByUrl}
                {scrollRoot}
                {onImageOpen}
                onRetry={() => onRetry(quotePreview.eventId)}
            >
                {#snippet footerActions()}
                    {#if quotePreview.status === "resolved"}
                        {@const quoteActionPost = buildRecord(
                            quotePreview.event,
                        )}
                        <PostHistoryPostActions post={quoteActionPost} {onReplyPost} {onQuotePost} {onReactionPost}>
                            {#snippet reactionExtras()}
                                {@const reactionModel = getReactionReadModel(quotePreview.event.id)}
                                {#if reactionModel && reactionModel.totalCount > 0}
                                    <PostHistoryReactionActionButton
                                        count={reactionModel.totalCount}
                                        expanded={isReactionExpanded(quotePreview.event.id)}
                                        ariaLabel={getReactionLabel(quotePreview.event.id)}
                                        onToggle={() => onToggleReaction(quotePreview.event.id)}
                                    />
                                {/if}
                            {/snippet}
                        </PostHistoryPostActions>
                    {/if}
                {/snippet}
                {#snippet footerDetails()}
                    {#if quotePreview.status === "resolved"}
                        {@const reactionModel = getReactionReadModel(quotePreview.event.id)}
                        {#if reactionModel && reactionModel.totalCount > 0 && isReactionExpanded(quotePreview.event.id)}
                            <PostHistoryReactionDetails readModel={reactionModel} {emojiLoadStateByUrl} {emojiImageMetaByUrl} />
                        {/if}
                    {/if}
                {/snippet}
                {#snippet footerMenu()}
                    {#if quotePreview.status === "resolved"}
                        {@const quotePreviewPost =
                            buildRecord(
                                quotePreview.event,
                            )}
                        {@const quotePreviewMenuKey =
                            buildMenuKey(
                                parentEventId,
                                quotePreviewPost.eventId,
                            )}
                        {@const actionsLabel =
                            $_("common.showActions")}
                        <PostHistoryActionMenu
                            open={isMenuOpen(
                                quotePreviewMenuKey,
                            )}
                            onOpenChange={(
                                open: boolean,
                            ) =>
                                onMenuOpenChange(
                                    quotePreviewMenuKey,
                                    open,
                                )}
                            triggerAriaLabel={actionsLabel}
                            tooltipContent={actionsLabel}
                            enableTooltip={true}
                            timestamp={formatPostedAtExact(
                                quotePreviewPost.postedAt,
                                $locale,
                            )}
                        >
                            {#snippet items()}
                                <PostHistoryRecordActionItems
                                    order="standard"
                                    showDeleteSeparator={true}
                                    {...getActionItems(quotePreviewPost)}
                                />
                            {/snippet}
                        </PostHistoryActionMenu>
                    {/if}
                {/snippet}
            </PostHistoryQuotePreview>
        {/each}
    </div>
{/if}
<style>
    :global(.post-preview-body) .post-preview-quotes {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-inline-start: -1rem;
    }
</style>
