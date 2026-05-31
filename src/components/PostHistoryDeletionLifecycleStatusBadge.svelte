<script lang="ts">
    import { _ } from "svelte-i18n";
    import {
        pendingDeletionRequestsState,
        type PendingDeletionRequestStatus,
    } from "../stores/postHistoryDeletionLifecycleStore.svelte";

    interface Props {
        eventId: string;
    }

    let { eventId }: Props = $props();

    let pendingStatus = $derived.by(() => {
        if (!eventId) {
            return undefined;
        }

        return pendingDeletionRequestsState[eventId];
    });

    function resolveStatusLabel(
        status: PendingDeletionRequestStatus | undefined,
    ): string | null {
        if (status === "pending" || status === "processing") {
            return $_("postHistory.deleteSending");
        }

        if (status === "failed") {
            return $_("postHistory.deleteFailed");
        }

        return null;
    }

    let statusLabel = $derived(resolveStatusLabel(pendingStatus));
</script>

{#if statusLabel}
    <span
        class={`post-history-deletion-lifecycle-status ${pendingStatus ?? ""}`.trim()}
        aria-label={statusLabel}
        title={statusLabel}
    >
        {statusLabel}
    </span>
{/if}

<style>
    .post-history-deletion-lifecycle-status {
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

    .post-history-deletion-lifecycle-status.pending,
    .post-history-deletion-lifecycle-status.processing {
        color: var(--text-muted, currentColor);
    }

    .post-history-deletion-lifecycle-status.failed {
        color: var(--destructive-fg, currentColor);
    }
</style>
