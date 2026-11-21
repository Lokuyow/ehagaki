<script lang="ts">
    import { _ } from "svelte-i18n";
    import { authState } from "../stores/authStore.svelte";
    import { resolveAppAssetUrl } from "../lib/appAssetUrl";
    import type { Snippet } from "svelte";
    import type { PostHistoryRecord } from "../lib/storage/ehagakiDb";
    import PostPreviewFooterActionButton from "./PostPreviewFooterActionButton.svelte";
    import PostReactionActionButton from './PostReactionActionButton.svelte';
    import { isReactionTargetKind } from '../lib/postReactionUtils';
    import { extractPostHistoryChannelReference } from '../lib/postHistoryEventUtils';

    interface Props {
        post: PostHistoryRecord;
        resolvedChannelEventId?: string;
        onReactionPost?: (post: PostHistoryRecord) => boolean | Promise<boolean>;
        onReplyPost?: (
            post: PostHistoryRecord,
        ) => boolean | void | Promise<boolean | void>;
        onQuotePost?: (post: PostHistoryRecord) => void;
        replyExtras?: Snippet;
        reactionExtras?: Snippet;
    }

    let {
        post,
        resolvedChannelEventId,
        onReactionPost = undefined,
        onReplyPost = undefined,
        onQuotePost = undefined,
        replyExtras = undefined,
        reactionExtras = undefined,
    }: Props = $props();

    const isPublicKeyLogin = $derived(authState.value.type === "npub");
    const replyIcon = resolveAppAssetUrl("icons/chat_bubble_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    const reactionIcon = resolveAppAssetUrl("icons/favorite_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");

    const canReplyOrQuote = $derived(
        post.deletedAt === undefined &&
            (post.kind !== 42 ||
                !!resolvedChannelEventId ||
                !!extractPostHistoryChannelReference(post).channelEventId),
    );
</script>

<div class="post-preview-action-buttons-group">
    <div class="post-preview-action-cell post-preview-reply-action-cell">
        <div class="post-preview-reply-button-slot">
            {#if onReplyPost && canReplyOrQuote}
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
            {:else if isPublicKeyLogin && replyExtras}
                <span class="count-kind-icon svg-icon" aria-hidden="true"
                    style:mask-image={`url("${replyIcon}")`}></span>
            {/if}
        </div>
        <div class="post-preview-footer-replies-slot">
            {@render replyExtras?.()}
        </div>
    </div>
    <div class="post-preview-action-cell post-preview-quote-action-cell">
        {#if onQuotePost && canReplyOrQuote}
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
    <div class="post-preview-action-cell post-preview-reaction-action-cell">
        {#if onReactionPost && post.deletedAt === undefined && isReactionTargetKind(post.kind)}
            <PostReactionActionButton onReact={() => onReactionPost!(post)} />
        {:else if isPublicKeyLogin && reactionExtras}
            <span class="count-kind-icon svg-icon" aria-hidden="true"
                style:mask-image={`url("${reactionIcon}")`}></span>
        {/if}
        <div class="post-preview-footer-reaction-slot">
            {@render reactionExtras?.()}
        </div>
    </div>
</div>

<style>
    .count-kind-icon {
        display: none;
        align-self: center;
        justify-self: center;
        inline-size: 18px;
        block-size: 18px;
        --svg: var(--text-muted);
        pointer-events: none;
    }

    .post-preview-reply-action-cell:has(.post-preview-footer-replies-slot > :global(.post-preview-replies-badge-button))
        .count-kind-icon,
    .post-preview-reaction-action-cell:has(.post-preview-footer-reaction-slot > :global(.post-preview-reactions-button))
        .count-kind-icon {
        display: block;
    }

    .post-preview-reaction-action-cell:has(> .count-kind-icon):has(.post-preview-footer-reaction-slot > :global(.post-preview-reactions-button)) {
        display: grid;
        grid-template-columns: minmax(0, 36px) 36px;
    }
</style>
