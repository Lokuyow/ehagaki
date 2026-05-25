<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import { extractPostHistoryMedia } from "../lib/postHistoryMediaUtils";
    import type { PostHistoryQuotePreviewState } from "../lib/hooks/usePostHistoryQuotePreviews.svelte";
    import type { PostHistoryMediaRecord } from "../lib/storage/ehagakiDb";
    import type { FullscreenMediaItem } from "../lib/types";

    interface Props {
        preview: PostHistoryQuotePreviewState;
        scrollRoot?: HTMLElement | null;
        onImageOpen?: (params: {
            index: number;
            mediaList: FullscreenMediaItem[];
        }) => void;
        onRetry?: (eventId: string) => void;
    }

    let {
        preview,
        scrollRoot = null,
        onImageOpen = undefined,
        onRetry = undefined,
    }: Props = $props();

    function getMedia(): PostHistoryMediaRecord[] {
        return preview.event ? extractPostHistoryMedia(preview.event) : [];
    }

    function getStatusMessage(): string {
        switch (preview.status) {
            case "deleted":
                return $_("postHistory.quoteDeleted");
            case "not-found":
                return $_("postHistory.quoteNotFound");
            case "error":
                return $_("postHistory.quoteFetchFailed");
            default:
                return $_("postHistory.quoteLoading");
        }
    }
</script>

{#if preview.status === "resolved" && preview.event}
    <PostHistoryRelatedEventCard
        event={preview.event}
        profile={preview.profile}
        media={getMedia()}
        {scrollRoot}
        {onImageOpen}
    >
        {#snippet topActions()}
            <div class="post-history-quote-top-actions">
                <span class="post-history-quote-badge">
                    <span
                        class="post-history-quote-badge-icon svg-icon"
                        aria-hidden="true"
                    ></span>
                    {$_("replyQuote.quote_label")}
                </span>
            </div>
        {/snippet}
    </PostHistoryRelatedEventCard>
{:else}
    <article class="post-history-quote-status-card">
        <div class="post-history-quote-top-actions">
            <span class="post-history-quote-badge">
                <span
                    class="post-history-quote-badge-icon svg-icon"
                    aria-hidden="true"
                ></span>
                {$_("replyQuote.quote_label")}
            </span>
        </div>
        <div class="post-history-quote-status-body">
            <p
                class="post-history-quote-status-message"
                class:post-history-quote-status-error={preview.status ===
                    "error"}
            >
                {getStatusMessage()}
            </p>
            {#if preview.status === "error"}
                <Button
                    type="button"
                    className="post-history-quote-retry-button"
                    onClick={() => onRetry?.(preview.eventId)}
                >
                    {$_("postHistory.contextRetry")}
                </Button>
            {/if}
        </div>
    </article>
{/if}

<style>
    .post-history-quote-top-actions {
        display: flex;
        align-items: center;
        padding: 6px 10px 0 10px;
    }

    .post-history-quote-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--text-muted);
        font-size: 0.76rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        text-transform: uppercase;
    }

    .post-history-quote-badge-icon {
        width: 16px;
        height: 16px;
        background-color: currentColor;
        mask-image: url("/icons/format_quote_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
    }

    .post-history-quote-status-card {
        display: grid;
        border-left: 2px solid color-mix(in srgb, var(--theme), transparent 45%);
        background: color-mix(in srgb, var(--dialog-bg), var(--border-hr) 24%);
        color: var(--text);
        font-size: 0.9rem;
    }

    .post-history-quote-status-body {
        display: grid;
        gap: 8px;
        padding: 2px 10px 10px 10px;
    }

    .post-history-quote-status-message {
        margin: 0;
        color: var(--text-muted);
        line-height: 1.45;
    }

    .post-history-quote-status-error {
        color: var(--danger);
    }

    :global(.post-history-quote-retry-button) {
        justify-self: start;
    }
</style>
