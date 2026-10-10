<script lang="ts">
    import { _ } from "svelte-i18n";
    import type { PostRepostResult } from "../lib/postRepostService";
    import FloatingMessage from "./FloatingMessage.svelte";
    import Button from "./Button.svelte";
    interface Props { result: PostRepostResult | null; saveFailure?: PostRepostResult | null; pending?: boolean; x?: number; y?: number;
        onRetrySave?: (result: PostRepostResult) => Promise<boolean> }
    let { result, saveFailure = null, pending = false, x = 20, y = 80, onRetrySave }: Props = $props();
    let visible = $state(false);
    let retrying = $state(false);
    let completedRetry = $state.raw<PostRepostResult | null>(null);
    const retryResult = $derived(saveFailure ?? (result?.retryInput ? result : null));
    $effect(() => {
        visible = pending || (!!result && result !== completedRetry && result.error !== "repost_stale");
        if (pending) return;
        if (!result || result.retryInput) return;
        const timeout = setTimeout(() => { visible = false; }, 4000);
        return () => clearTimeout(timeout);
    });
    const message = $derived(pending ? "repost.sending" : !result?.success
        ? result?.error === "repost_relay_missing" ? "repost.relayMissing"
            : result?.error === "repost_deletion_unconfirmed" ? "repost.deletionUnconfirmed" : "repost.failed"
        : result.historySaved === false ? "repost.saveFailed"
        : (result.rejectedRelays?.length || result.timedOutRelays?.length) ? "repost.partial" : "repost.sent");
    async function retry() {
        if (!retryResult || !onRetrySave || retrying) return;
        const failed = retryResult;
        retrying = true;
        try { if (await onRetrySave(failed)) { completedRetry = failed; if (result === failed) visible = false; } } finally { retrying = false; }
    }
</script>
{#if retryResult && retryResult !== completedRetry && onRetrySave}
    <div class="repost-save-feedback" role="status">
        <span>{$_("repost.saveFailed")}</span>
        <Button className="repost-retry-save" variant="default" shape="rounded" disabled={pending || retrying} onClick={() => void retry()}>{$_("repost.retrySave")}</Button>
    </div>
{/if}
<FloatingMessage show={visible && (pending || !result?.retryInput)} {x} {y}><div class="repost-message">{$_(message)}</div></FloatingMessage>
<style>
    .repost-message { white-space: normal; overflow-wrap: anywhere; }
    .repost-save-feedback {
        display: flex; flex: 0 0 auto; flex-wrap: wrap; align-items: center; gap: 8px;
        min-width: 0; width: 100%; padding: 8px 12px; box-sizing: border-box;
    }
    .repost-save-feedback :global(.repost-retry-save) { height: auto; min-height: 44px; padding: 8px 12px; }
</style>
