<script lang="ts">
    import { _ } from "svelte-i18n";
    import {
        resolvePostHistoryQuoteLifecycleStatus,
        type PostHistoryQuoteLifecycleStatus,
    } from "../lib/postHistoryQuoteLifecycleState";
    import type { PostHistoryQuotePreviewState } from "../lib/hooks/usePostHistoryQuotePreviews.svelte";

    interface Props {
        states: PostHistoryQuotePreviewState[];
    }

    let { states }: Props = $props();

    let status = $derived(resolvePostHistoryQuoteLifecycleStatus(states));

    function resolveStatusLabel(
        nextStatus: PostHistoryQuoteLifecycleStatus | null,
    ): string | null {
        switch (nextStatus) {
            case "loading":
                return $_("postHistory.quoteLoading");
            case "deleted":
                return $_("postHistory.quoteDeleted");
            case "not-found":
                return $_("postHistory.quoteNotFound");
            case "error":
                return $_("postHistory.quoteFetchFailed");
            default:
                return null;
        }
    }

    let statusLabel = $derived(resolveStatusLabel(status));
</script>

{#if statusLabel}
    <span
        class={`post-history-quote-lifecycle-status ${status ?? ""}`.trim()}
        aria-label={statusLabel}
        title={statusLabel}
    >
        {statusLabel}
    </span>
{/if}

<style>
    .post-history-quote-lifecycle-status {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 18px;
        padding: 0 8px;
        border-radius: 999px;
        font-size: 0.72rem;
        line-height: 1;
        white-space: nowrap;
        border: 1px solid color-mix(in srgb, currentColor 18%, transparent);
        background: color-mix(in srgb, currentColor 8%, transparent);
    }

    .post-history-quote-lifecycle-status.loading,
    .post-history-quote-lifecycle-status.not-found {
        color: var(--text-muted, currentColor);
    }

    .post-history-quote-lifecycle-status.deleted,
    .post-history-quote-lifecycle-status.error {
        color: var(--destructive-fg, currentColor);
    }
</style>
