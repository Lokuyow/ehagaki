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

    /**
     * What the quote previews need from the history tab. The tab owns the
     * state behind these; they are read here while rendering, so they stay
     * reactive.
     */
    interface QuotePreviewView {
        getSensitiveBodyLoader: (event: NostrEvent) => QuotePreviewProps["loadSensitiveBody"];
        getModel: (eventId: string) => PostContentRenderModel | undefined;
        onImageOpen: QuotePreviewProps["onImageOpen"];
        retry: (eventId: string) => void;
        readonly onReactionPost: PostActionsProps["onReactionPost"];
        readonly onReplyPost: PostActionsProps["onReplyPost"];
        readonly onQuotePost: PostActionsProps["onQuotePost"];
        getReactionReadModel: (eventId: string) => ReactionReadModel | null | undefined;
        isReactionExpanded: (eventId: string) => boolean;
        getReactionLabel: (eventId: string) => string;
        toggleReactions: (eventId: string) => void;
        /** Record used for the quoted event's actions and menu. */
        buildRecord: (event: NostrEvent) => PostHistoryRecord;
        buildMenuKey: (parentEventId: string, quoteEventId: string) => string;
        isMenuOpen: (menuKey: string) => boolean;
        setMenuOpen: (menuKey: string, open: boolean) => void;
        getActionItems: (
            record: PostHistoryRecord,
        ) => Omit<
            ComponentProps<typeof PostHistoryRecordActionItems>,
            "order" | "showDeleteSeparator"
        >;
    }

    interface Props {
        parentEventId: string;
        previews: PostHistoryQuotePreviewState[];
        emojiLoadStateByUrl: QuotePreviewProps["emojiLoadStateByUrl"];
        emojiImageMetaByUrl: QuotePreviewProps["emojiImageMetaByUrl"];
        scrollRoot: QuotePreviewProps["scrollRoot"];
        view: QuotePreviewView;
    }

    let {
        parentEventId,
        previews,
        emojiLoadStateByUrl,
        emojiImageMetaByUrl,
        scrollRoot,
        view,
    }: Props = $props();
</script>

{#if previews.length > 0}
    <div class="post-preview-quotes">
        {#each previews as quotePreview (quotePreview.eventId)}
            <PostHistoryQuotePreview
                preview={quotePreview}
                loadSensitiveBody={quotePreview.status === "resolved"
                    ? view.getSensitiveBodyLoader(quotePreview.event)
                    : undefined}
                model={quotePreview.status ===
                "resolved"
                    ? view.getModel(quotePreview.event.id)
                    : undefined}
                {emojiLoadStateByUrl}
                {emojiImageMetaByUrl}
                {scrollRoot}
                onImageOpen={view.onImageOpen}
                onRetry={() => view.retry(quotePreview.eventId)}
            >
                {#snippet footerActions()}
                    {#if quotePreview.status === "resolved" &&
                        (quotePreview.event.kind !== 42 ||
                            view.onReactionPost ||
                            (view.getReactionReadModel(quotePreview.event.id)?.totalCount ?? 0) > 0)}
                        {@const quoteActionPost = view.buildRecord(
                            quotePreview.event,
                        )}
                        <PostHistoryPostActions onReactionPost={view.onReactionPost}
                            post={quoteActionPost}
                            onReplyPost={
                                quotePreview.event.kind !== 42
                                    ? view.onReplyPost
                                    : undefined
                            }
                            onQuotePost={
                                quotePreview.event.kind !== 42
                                    ? view.onQuotePost
                                    : undefined
                            }
                        >
                            {#snippet reactionExtras()}
                                {@const reactionModel = view.getReactionReadModel(quotePreview.event.id)}
                                {#if reactionModel && reactionModel.totalCount > 0}
                                    <PostHistoryReactionActionButton
                                        count={reactionModel.totalCount}
                                        expanded={view.isReactionExpanded(quotePreview.event.id)}
                                        ariaLabel={view.getReactionLabel(quotePreview.event.id)}
                                        onToggle={() => view.toggleReactions(quotePreview.event.id)}
                                    />
                                {/if}
                            {/snippet}
                        </PostHistoryPostActions>
                    {/if}
                {/snippet}
                {#snippet footerDetails()}
                    {#if quotePreview.status === "resolved"}
                        {@const reactionModel = view.getReactionReadModel(quotePreview.event.id)}
                        {#if reactionModel && reactionModel.totalCount > 0 && view.isReactionExpanded(quotePreview.event.id)}
                            <PostHistoryReactionDetails readModel={reactionModel} {emojiLoadStateByUrl} {emojiImageMetaByUrl} />
                        {/if}
                    {/if}
                {/snippet}
                {#snippet footerMenu()}
                    {#if quotePreview.status === "resolved"}
                        {@const quotePreviewPost =
                            view.buildRecord(
                                quotePreview.event,
                            )}
                        {@const quotePreviewMenuKey =
                            view.buildMenuKey(
                                parentEventId,
                                quotePreviewPost.eventId,
                            )}
                        {@const actionsLabel =
                            $_("common.showActions")}
                        <PostHistoryActionMenu
                            open={view.isMenuOpen(
                                quotePreviewMenuKey,
                            )}
                            onOpenChange={(
                                open: boolean,
                            ) =>
                                view.setMenuOpen(
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
                                    {...view.getActionItems(quotePreviewPost)}
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
