<script lang="ts">
    import { _ } from "svelte-i18n";
    import type { Snippet } from "svelte";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import PostPreviewFooterActionButton from "./PostPreviewFooterActionButton.svelte";

    interface Props {
        post: PostHistoryRecord;
        onReplyPost?: (
            post: PostHistoryRecord,
        ) => boolean | void | Promise<boolean | void>;
        onQuotePost?: (post: PostHistoryRecord) => void;
        replyExtras?: Snippet;
    }

    let {
        post,
        onReplyPost = undefined,
        onQuotePost = undefined,
        replyExtras = undefined,
    }: Props = $props();
</script>

<div class="post-preview-action-buttons-group">
    {#if onReplyPost}
        <PostPreviewFooterActionButton
            type="button"
            className="post-preview-action-button post-history-action-button"
            ariaLabel={$_("replyQuote.reply_label")}
            contentLayout="icon"
            shape="circle"
            onClick={() => onReplyPost?.(post)}
            tooltipContent={$_("replyQuote.reply_label")}
        >
            <div class="reply-icon svg-icon" aria-hidden="true"></div>
        </PostPreviewFooterActionButton>
    {/if}
    {@render replyExtras?.()}
    {#if onQuotePost}
        <PostPreviewFooterActionButton
            type="button"
            className="post-preview-action-button post-history-action-button"
            ariaLabel={$_("replyQuote.quote_label")}
            contentLayout="icon"
            shape="circle"
            onClick={() => onQuotePost?.(post)}
            tooltipContent={$_("replyQuote.quote_label")}
        >
            <div class="quote-icon svg-icon" aria-hidden="true"></div>
        </PostPreviewFooterActionButton>
    {/if}
</div>
