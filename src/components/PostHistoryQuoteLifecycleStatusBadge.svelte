<script lang="ts">
    import { _ } from "svelte-i18n";
    import {
        resolvePostHistoryQuoteLifecycleStatus,
        type PostHistoryQuoteLifecycleStatus,
    } from "../lib/postHistoryQuoteLifecycleState";
    import type { PostHistoryQuotePreviewState } from "../lib/hooks/usePostHistoryQuotePreviews.svelte";
    import PostHistoryStatusPill from "./PostHistoryStatusPill.svelte";

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
    <PostHistoryStatusPill
        label={statusLabel}
        tone={status === "deleted" || status === "error" ? "danger" : "muted"}
        className={`post-history-quote-lifecycle-status ${status ?? ""}`.trim()}
    />
{/if}
