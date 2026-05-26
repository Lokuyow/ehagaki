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
        return preview.status === "resolved"
            ? extractPostHistoryMedia(preview.event)
            : [];
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

{#if preview.status === "resolved"}
    <PostHistoryRelatedEventCard
        event={preview.event}
        profile={preview.profile}
        media={getMedia()}
        {scrollRoot}
        {onImageOpen}
    />
{:else}
    <article class="post-history-quote-status-card">
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
