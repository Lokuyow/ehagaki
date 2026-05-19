<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import type {
        PostHistoryContextItemState,
        PostHistoryContextTargetKind,
    } from "../lib/hooks/usePostHistoryContext.svelte";

    interface Props {
        context: PostHistoryContextItemState;
        onToggle: (kind: PostHistoryContextTargetKind) => void;
        onRetry: (kind: PostHistoryContextTargetKind) => void;
    }

    let { context, onToggle, onRetry }: Props = $props();

    let reply = $derived(context.reply);
</script>

{#if reply}
    <div class="post-history-context-panel">
        {#if reply.visible && reply.status === "loading" && reply.showLoadingIndicator}
            <LoadingPlaceholder
                showLoader={true}
                text={$_("postHistory.contextLoading")}
                customClass="post-history-context-loading"
            />
        {:else if reply.visible && reply.status === "loaded" && reply.event}
            <PostHistoryRelatedEventCard
                event={reply.event}
                profile={reply.profile}
            />
        {:else if reply.visible && reply.status === "missing"}
            <p class="post-history-context-message">
                {$_("postHistory.contextNotFound")}
            </p>
        {:else if reply.visible && reply.status === "failed"}
            <p class="post-history-context-message post-history-context-error">
                {$_("postHistory.contextFetchFailed")}
            </p>
            <Button
                type="button"
                className="post-history-context-button post-history-context-retry-button"
                onClick={() => onRetry("reply")}
            >
                {$_("postHistory.contextRetry")}
            </Button>
        {/if}

        <div class="post-history-context-actions">
            <Button
                type="button"
                className="post-history-context-button post-history-parent-toggle-button"
                ariaLabel={reply.visible
                    ? $_("postHistory.hideReplyTarget")
                    : $_("postHistory.showReplyTarget")}
                title={reply.visible
                    ? $_("postHistory.hideReplyTarget")
                    : $_("postHistory.showReplyTarget")}
                contentLayout="icon"
                shape="square"
                onClick={() => onToggle("reply")}
            >
                <span class="arrow-top-right-icon svg-icon" aria-hidden="true"
                ></span>
            </Button>
        </div>
    </div>
{/if}

<style>
    .post-history-context-panel {
        display: grid;
        gap: 6px;
        padding-left: 1rem;
    }

    .post-history-context-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    :global(.post-history-context-button) {
        min-height: 28px;
        padding: 2px 8px;
        color: var(--text-muted);
        background: transparent;
        font-size: 0.82rem;
    }

    :global(.post-history-parent-toggle-button) {
        width: 28px;
        height: 28px;
        min-height: 28px;
        color: var(--text-muted);
    }

    :global(.post-history-parent-toggle-button .arrow-top-right-icon) {
        width: 20px;
        height: 20px;
        mask-image: url("/icons/arrow_top_right_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg");
    }

    @media (min-width: 601px) {
        :global(.post-history-context-button:hover:not(:disabled)) {
            color: var(--theme);
            background: color-mix(in srgb, var(--theme) 10%, transparent);
        }
    }

    :global(.post-history-context-loading) {
        justify-content: flex-start;
        width: auto;
        padding: 0;
        color: var(--text-muted);
        font-size: 0.82rem;
    }

    .post-history-context-message {
        margin: 0;
        color: var(--text-muted);
        font-size: 0.82rem;
    }

    .post-history-context-error {
        color: var(--danger);
    }
</style>
