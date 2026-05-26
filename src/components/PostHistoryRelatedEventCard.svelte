<script lang="ts">
    import { nip19 } from "nostr-tools";
    import type { Snippet } from "svelte";
    import PostHistoryMediaList from "./PostHistoryMediaList.svelte";
    import {
        buildPreviewContent,
        formatPostedAt,
    } from "../lib/postHistoryDialogUtils";
    import type { PostHistoryMediaRecord } from "../lib/storage/ehagakiDb";
    import type {
        FullscreenMediaItem,
        NostrEvent,
        ProfileData,
    } from "../lib/types";
    import { shortenMiddle } from "../lib/utils/textDisplayUtils";

    interface Props {
        event: NostrEvent;
        profile?: ProfileData | null;
        media?: PostHistoryMediaRecord[];
        scrollRoot?: HTMLElement | null;
        onImageOpen?: (params: {
            index: number;
            mediaList: FullscreenMediaItem[];
        }) => void;
        showHeaderDate?: boolean;
        topActions?: Snippet;
        children?: Snippet;
    }

    let {
        event,
        profile = null,
        media = [],
        scrollRoot = null,
        onImageOpen = undefined,
        showHeaderDate = true,
        topActions = undefined,
        children = undefined,
    }: Props = $props();

    let authorName = $derived.by(() => {
        const displayName =
            profile?.displayName?.trim() || profile?.name?.trim();
        if (displayName) {
            return displayName;
        }

        return shortenMiddle(nip19.npubEncode(event.pubkey), 12, 4);
    });
    let content = $derived.by(() =>
        buildPreviewContent({
            content: event.content,
            tags: event.tags,
            media,
        })
            .segments.map((segment) => {
                if (segment.type === "text") {
                    return segment.text;
                }

                if (segment.type === "emoji") {
                    return segment.rawShortcodeText;
                }

                return "";
            })
            .join(""),
    );
    let hasContent = $derived(content.trim().length > 0);
    let postedAt = $derived(formatPostedAt(event.created_at * 1000));
</script>

<article class="post-history-related-card">
    {@render topActions?.()}
    <div class="post-history-related-card-body">
        <div class="post-history-related-author">
            {#if profile?.picture}
                <img
                    class="post-history-related-avatar"
                    src={profile.picture}
                    alt={authorName}
                />
            {:else}
                <span
                    class="post-history-related-avatar-placeholder"
                    aria-hidden="true"
                ></span>
            {/if}
            <span class="post-history-related-author-name">{authorName}</span>
        </div>
        {#if hasContent}
            <p class="post-history-related-content">{content}</p>
        {/if}
        {#if media.length > 0}
            <div class="post-history-related-media">
                <PostHistoryMediaList {media} {scrollRoot} {onImageOpen} />
            </div>
        {/if}
        {#if showHeaderDate}
            <header class="post-history-related-card-header">
                <span class="post-history-related-date">{postedAt}</span>
            </header>
        {/if}
        {@render children?.()}
    </div>
</article>

<style>
    .post-history-related-card {
        display: grid;
        border-left: 2px solid color-mix(in srgb, var(--theme), transparent 45%);
        background: color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);
        color: var(--text);
        font-size: 0.9rem;
    }

    .post-history-related-card-body {
        display: grid;
        gap: 2px;
        padding: 2px 10px 0 10px;
    }

    .post-history-related-card-header,
    .post-history-related-author {
        display: flex;
        align-items: center;
        min-width: 0;
        gap: 8px;
    }

    .post-history-related-card-header {
        justify-content: space-between;
        color: var(--text-muted);
        font-size: 0.78rem;
    }

    .post-history-related-date {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .post-history-related-avatar,
    .post-history-related-avatar-placeholder {
        width: 24px;
        height: 24px;
        flex: 0 0 auto;
        border-radius: 50%;
        background: var(--border-hr);
        object-fit: cover;
    }

    .post-history-related-avatar-placeholder {
        display: inline-block;
        mask-image: url("/icons/account_circle_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
        background-color: var(--text-muted);
    }

    .post-history-related-author-name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 600;
    }

    .post-history-related-content {
        margin: 0;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        line-height: 1.45;
    }

    .post-history-related-media {
        display: block;
        margin-top: 6px;
    }
</style>
