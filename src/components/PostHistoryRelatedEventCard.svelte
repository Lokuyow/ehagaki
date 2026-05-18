<script lang="ts">
    import { nip19 } from "nostr-tools";
    import type { Snippet } from "svelte";
    import type { NostrEvent, ProfileData } from "../lib/types";
    import { sanitizePlainText } from "../lib/utils/domSanitizer";
    import { shortenMiddle } from "../lib/utils/textDisplayUtils";
    import { formatPostedAt } from "../lib/postHistoryDialogUtils";

    interface Props {
        event: NostrEvent;
        profile?: ProfileData | null;
        showHeaderDate?: boolean;
        topActions?: Snippet;
        children?: Snippet;
    }

    let {
        event,
        profile = null,
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
    let content = $derived(sanitizePlainText(event.content));
    let postedAt = $derived(formatPostedAt(event.created_at * 1000));
</script>

<article class="post-history-related-card">
    {@render topActions?.()}
    {#if showHeaderDate}
        <header class="post-history-related-card-header">
            <span class="post-history-related-date">{postedAt}</span>
        </header>
    {/if}
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
    {#if content}
        <p class="post-history-related-content">{content}</p>
    {/if}
    {@render children?.()}
</article>

<style>
    .post-history-related-card {
        display: grid;
        gap: 4px;
        padding: 2px 10px 0;
        border-left: 2px solid color-mix(in srgb, var(--theme), transparent 45%);
        background: color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);
        color: var(--text);
        font-size: 0.9rem;
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
</style>
