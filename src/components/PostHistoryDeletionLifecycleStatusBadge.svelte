<script lang="ts">
    import { _ } from "svelte-i18n";
    import {
        pendingDeletionRequestsState,
        type PendingDeletionRequestStatus,
    } from "../stores/postHistoryDeletionLifecycleStore.svelte";
    import PostHistoryStatusPill from "./PostHistoryStatusPill.svelte";

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
    <PostHistoryStatusPill
        label={statusLabel}
        tone={pendingStatus === "failed" ? "danger" : "muted"}
        className={`post-history-deletion-lifecycle-status ${pendingStatus ?? ""}`.trim()}
    />
{/if}
