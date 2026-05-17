<script lang="ts">
    import { _ } from "svelte-i18n";
    import Button from "./Button.svelte";
    import LoadingPlaceholder from "./LoadingPlaceholder.svelte";
    import PostHistoryRelatedEventCard from "./PostHistoryRelatedEventCard.svelte";
    import type {
        PostHistoryContextItemState,
        PostHistoryContextTargetKind,
        PostHistoryContextTargetState,
    } from "../lib/hooks/usePostHistoryContext.svelte";

    interface Props {
        context: PostHistoryContextItemState;
        onLoad: (kind: PostHistoryContextTargetKind) => void;
    }

    let { context, onLoad }: Props = $props();

    function shouldShowTarget(target: PostHistoryContextTargetState | null): boolean {
        return !!target;
    }
</script>

{#if shouldShowTarget(context.reply) || shouldShowTarget(context.root)}
    <div class="post-history-context-panel">
        <div class="post-history-context-actions">
            {#if context.reply}
                <Button
                    type="button"
                    className="post-history-context-button"
                    disabled={context.reply.status === "loading"}
                    onClick={() => onLoad("reply")}
                >
                    {$_("postHistory.showReplyTarget")}
                </Button>
            {/if}
            {#if context.root}
                <Button
                    type="button"
                    className="post-history-context-button"
                    disabled={context.root.status === "loading"}
                    onClick={() => onLoad("root")}
                >
                    {$_("postHistory.showConversationRoot")}
                </Button>
            {/if}
        </div>

        {#if context.reply?.status === "loading"}
            <LoadingPlaceholder
                showLoader={true}
                text={$_("postHistory.contextLoading")}
                customClass="post-history-context-loading"
            />
        {:else if context.reply?.status === "loaded" && context.reply.event}
            <PostHistoryRelatedEventCard
                event={context.reply.event}
                profile={context.reply.profile}
                label={$_("postHistory.replyTarget")}
            />
        {:else if context.reply?.status === "missing"}
            <p class="post-history-context-message">
                {$_("postHistory.contextNotFound")}
            </p>
        {:else if context.reply?.status === "failed"}
            <p class="post-history-context-message post-history-context-error">
                {$_("postHistory.contextFetchFailed")}
            </p>
        {/if}

        {#if context.root?.status === "loading"}
            <LoadingPlaceholder
                showLoader={true}
                text={$_("postHistory.contextLoading")}
                customClass="post-history-context-loading"
            />
        {:else if context.root?.status === "loaded" && context.root.event}
            <PostHistoryRelatedEventCard
                event={context.root.event}
                profile={context.root.profile}
                label={$_("postHistory.conversationRoot")}
            />
        {:else if context.root?.status === "missing"}
            <p class="post-history-context-message">
                {$_("postHistory.contextNotFound")}
            </p>
        {:else if context.root?.status === "failed"}
            <p class="post-history-context-message post-history-context-error">
                {$_("postHistory.contextFetchFailed")}
            </p>
        {/if}
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
