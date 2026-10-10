<script lang="ts">
    import { _ } from "svelte-i18n";
    import type { Snippet } from "svelte";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import type { RepostPreviewState } from "../lib/hooks/usePostHistoryRepostPreviews.svelte";
    import type { FullscreenMediaItem } from "../lib/types";
    import { repostTargetToPost } from "../lib/postRepostUtils";
    import { formatPostedAt } from "../lib/postHistoryDialogUtils";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import PostHistoryPreviewFooter from "./PostHistoryPreviewFooter.svelte";
    import PostHistoryPostActions from "./PostHistoryPostActions.svelte";
    import Button from "./Button.svelte";
    interface Props {
        post: PostHistoryRecord; preview: RepostPreviewState;
        menu?: Snippet<[PostHistoryRecord, string]>;
        onRetry: () => void;
        onReplyPost?: (post: PostHistoryRecord) => void | Promise<void>;
        onQuotePost?: (post: PostHistoryRecord) => void;
        loadSensitiveBody?: () => Promise<string | null>;
        scrollRoot?: HTMLElement | null;
        onImageOpen?: (params: { index: number; mediaList: FullscreenMediaItem[] }) => void;
        emojiLoadStateByUrl?: Record<string, import("../lib/postContentPreview").PostContentEmojiLoadState | undefined>;
        emojiImageMetaByUrl?: Record<string, import("../lib/postContentPreview").PostContentEmojiImageMeta | undefined>;
    }
    let { post, preview, menu, onRetry, onReplyPost, onQuotePost, loadSensitiveBody,
        scrollRoot = null, onImageOpen, emojiLoadStateByUrl = {}, emojiImageMetaByUrl = {} }: Props = $props();
    const target = $derived(preview.event ? repostTargetToPost(preview.event, preview.relayHints) : null);
    const message = $derived(preview.status === "deleted" ? "repost.targetDeleted"
        : preview.status === "invalid-reference" || preview.status === "invalid-target" ? "repost.targetInvalid"
        : preview.status === "loading" ? "repost.targetLoading" : "repost.targetMissing");
</script>
<div class="post-history-repost" data-repost-event-id={post.eventId}>
    <div class="post-history-repost-label">↻ {$_("repost.entry")}</div>
    {#if post.deletedAt !== undefined}
        <p>{$_("postHistory.deleted")}</p>
    {:else if preview.status === "resolved" && preview.event && target}
        <PostHistoryRelatedEventCard event={preview.event} profile={preview.profile} {loadSensitiveBody}
            {scrollRoot} {onImageOpen} {emojiLoadStateByUrl} {emojiImageMetaByUrl}>
            {#snippet footerActions()}
                <PostHistoryPostActions post={target} {onReplyPost} {onQuotePost} />
            {/snippet}
            {#snippet footerMenu()}{@render menu?.(target, `repost-target:${post.eventId}:${target.eventId}`)}{/snippet}
        </PostHistoryRelatedEventCard>
        {#if "saveFailed" in preview && preview.saveFailed}
            <p role="status">{$_("repost.targetSaveFailed")}</p>
            <Button onClick={onRetry}>{$_("repost.retrySave")}</Button>
        {/if}
    {:else}
        <p role="status">{$_(message)}</p>
        {#if preview.status !== "loading" && preview.status !== "deleted" && preview.status !== "invalid-reference"}
            <Button onClick={onRetry}>{$_("postHistory.contextRetry")}</Button>
        {/if}
    {/if}
    <PostHistoryPreviewFooter formattedDate={formatPostedAt(post.postedAt)}>
        {#snippet trailing()}{@render menu?.(post, `repost-outer:${post.eventId}`)}{/snippet}
    </PostHistoryPreviewFooter>
</div>
<style>
    .post-history-repost { min-width: 0; }
    .post-history-repost-label { color: var(--text-muted); padding: 6px 10px; }
</style>
