<script lang="ts">
    import { isPostHistoryFavoriteReactionContent } from "../lib/postHistoryDialogPresentation";
    import { formatPostHistoryReactionActorLabel, type PostHistoryReactionReadModel } from "../lib/postHistoryReactionReadModel";
    import type { PostContentEmojiImageMeta, PostContentEmojiLoadState } from "../lib/postContentPreview";
    import ProfileAvatar from "./ProfileAvatar.svelte";

    interface Props {
        readModel: PostHistoryReactionReadModel;
        emojiLoadStateByUrl?: Record<string, PostContentEmojiLoadState | undefined>;
        emojiImageMetaByUrl?: Record<string, PostContentEmojiImageMeta | undefined>;
    }
    let { readModel, emojiLoadStateByUrl = {}, emojiImageMetaByUrl = {} }: Props = $props();

    function slotStyle(url: string): string {
        const ratio = emojiImageMetaByUrl[url]?.aspectRatio;
        const width = typeof ratio === "number" && Number.isFinite(ratio) && ratio > 0 ? 18 * ratio : 18;
        return `width:${width}px;height:18px;vertical-align:bottom;`;
    }
</script>

{#if readModel.totalCount > 0}
    <div class="post-preview-reactions-panel">
        {#each readModel.groups as reactionGroup (reactionGroup.content)}
            <div class="post-preview-reaction-chip">
                <div class="post-preview-reaction-summary">
                    {#if isPostHistoryFavoriteReactionContent(reactionGroup.content)}
                        <div class="favorite-icon svg-icon post-preview-reaction-symbol" aria-hidden="true"></div>
                    {:else if reactionGroup.emojiUrl}
                        {#if emojiLoadStateByUrl[reactionGroup.emojiUrl] === "failed"}
                            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                            <span class="post-preview-reaction-emoji-slot post-preview-reaction-emoji-failed" style={slotStyle(reactionGroup.emojiUrl)} role="img" tabindex="0" aria-label={reactionGroup.content} title={reactionGroup.content}>{reactionGroup.content}</span>
                        {:else}
                            <span class="post-preview-reaction-emoji-slot" style={slotStyle(reactionGroup.emojiUrl)}>
                                {#if emojiLoadStateByUrl[reactionGroup.emojiUrl] === "ready"}
                                    <img src={reactionGroup.emojiUrl} alt={reactionGroup.content} title={reactionGroup.content} class="post-preview-reaction-emoji" draggable="false" loading="lazy" decoding="async" />
                                {:else}<span class="post-preview-reaction-emoji-placeholder" aria-hidden="true"></span>{/if}
                            </span>
                        {/if}
                    {:else}
                        <span class="post-preview-reaction-content">{reactionGroup.content}</span>
                    {/if}
                    <span class="post-preview-reaction-count">{reactionGroup.count}</span>
                </div>
                <div class="post-preview-reaction-actors">
                    {#each reactionGroup.reactors as actor (actor.eventId)}
                        {@const actorLabel = formatPostHistoryReactionActorLabel(actor)}
                        <span class="post-preview-reaction-actor" title={actorLabel} aria-label={actorLabel}>
                            <ProfileAvatar src={actor.profile?.picture || ""} alt={actorLabel} rootClassName="post-preview-reaction-avatar" imageClassName="post-preview-reaction-avatar-image" fallbackClassName="post-preview-reaction-avatar-fallback" fallbackAriaLabel={actorLabel} fallbackDelayMs={0} />
                        </span>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
{/if}

<style>
    :global(.post-preview-reactions-panel) {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 0 16px;
    }

    :global(.post-preview-reaction-chip) {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 32px;
        padding: 4px 8px;
        border-radius: 18px;
        background: color-mix(in srgb, var(--btn-bg), transparent 40%);
        color: var(--text);
    }

    :global(.post-preview-reaction-summary) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 2px;
        row-gap: 4px;
        flex-wrap: wrap;
    }

    :global(.post-preview-reaction-content) {
        font-size: 20px;
        line-height: 1;
    }

    :global(.post-preview-reaction-count) {
        font-size: 1rem;
        line-height: 1;
        color: var(--text-muted);
    }

    :global(.post-preview-reaction-emoji-slot) {
        display: inline-grid;
        margin: 0;
        padding: 0;
    }

    :global(.post-preview-reaction-emoji),
    :global(.post-preview-reaction-emoji-placeholder) {
        width: 100%;
        height: 100%;
    }

    :global(.post-preview-reaction-emoji) {
        display: block;
        margin: 0;
        padding: 0;
        object-fit: contain;
        user-select: none;
        -webkit-user-drag: none;
    }

    :global(.post-preview-reaction-emoji-placeholder) {
        display: block;
        border-radius: 4px;
        background: rgba(127, 127, 127, 0.18);
    }

    :global(.post-preview-reaction-emoji-failed) {
        display: inline-grid;
        place-items: center;
        overflow: hidden;
        border-radius: 4px;
        background: rgba(127, 127, 127, 0.18);
        font-size: 0.45em;
        line-height: 1;
        white-space: nowrap;
        cursor: help;
    }

    :global(.post-preview-reaction-actors) {
        display: inline-flex;
        flex-wrap: wrap;
        gap: 2px;
        align-items: center;
    }

    :global(.post-preview-reaction-actor) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        border-radius: 999px;
        overflow: hidden;
        flex: 0 0 auto;
    }

    :global(.post-preview-reaction-avatar),
    :global(.post-preview-reaction-avatar-image),
    :global(.post-preview-reaction-avatar-fallback) {
        width: 100%;
        height: 100%;
    }

    :global(.post-preview-reaction-avatar-image) {
        object-fit: cover;
    }

    :global(.post-preview-reaction-symbol) {
        width: 18px;
        height: 18px;
        background-color: rgb(249, 24, 128);
        mask-image: url("/icons/favorite_24dp_000000_FILL1_wght400_GRAD0_opsz24.svg");
    }
</style>
