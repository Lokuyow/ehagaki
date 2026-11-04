<script lang="ts">
    import type { FullscreenMediaItem, NostrEvent, ProfileData } from '../lib/types';
    import PostHistoryRelatedEventCard from './PostHistoryRelatedEventCard.svelte';
    import PostHistoryPostActions from './PostHistoryPostActions.svelte';
    import { repostTargetToPost } from '../lib/postRepostUtils';
    import { buildComposerInteractionRenderModel } from '../lib/composerTargetRelatedPreview';
    import { buildPostContentRenderModel, type SensitiveBodyLoader } from '../lib/postContentPreview';
    import { stripPostHistoryInlineQuoteUrisForDisplay } from '../lib/postHistoryQuoteUtils';
    import { usePostHistoryEmojiState } from '../lib/hooks/usePostHistoryEmojiState.svelte';
    import type { PostHistoryRecord } from '../lib/storage/ehagakiDb';
    interface Props {
        event: NostrEvent;
        profile?: ProfileData | null;
        relayUrls?: string[];
        loadSensitiveBody?: SensitiveBodyLoader;
        onReply?: (post: PostHistoryRecord) => Promise<boolean>;
        onReaction?: (post: PostHistoryRecord) => Promise<boolean>;
        onImageOpen: (value: { index: number; mediaList: FullscreenMediaItem[] }) => void;
    }
    let { event, profile = null, relayUrls = [], loadSensitiveBody, onReply, onReaction, onImageOpen }: Props = $props();
    const model = $derived([6, 7, 16].includes(event.kind) ? buildComposerInteractionRenderModel(event) : buildPostContentRenderModel({ kind: event.kind, sourceContent: event.content,
        tags: event.tags, displayContent: stripPostHistoryInlineQuoteUrisForDisplay(event) }));
    const post = $derived(repostTargetToPost(event, relayUrls));
    const emoji = usePostHistoryEmojiState({ getShow: () => true, getEmojiUrls: () => model.previewContent.segments
        .flatMap(segment => segment.type === 'emoji' ? [segment.url] : []) });
</script>

<div class="notification-post" class:has-actions={Boolean(onReply || onReaction)}>
<PostHistoryRelatedEventCard {event} {profile} {model} {onImageOpen} {loadSensitiveBody}
    emojiLoadStateByUrl={emoji.emojiLoadStateByUrl} emojiImageMetaByUrl={emoji.emojiImageMetaByUrl}>
    {#snippet footerActions()}
        {#if onReply || onReaction}
            <PostHistoryPostActions {post} onReplyPost={onReply} onReactionPost={onReaction} />
        {/if}
    {/snippet}
</PostHistoryRelatedEventCard>

</div>
<style>
    .notification-post { min-width: 0; }
    .has-actions :global(.post-preview-footer) {
        grid-template-columns: minmax(0, 1fr) 80px 0;
    }
    .notification-post :global(.post-preview-action-buttons-group) { grid-template-columns: 36px 0 36px; gap: 4px; }
    .notification-post :global(.post-preview-reply-action-cell),
    .notification-post :global(.post-preview-reaction-action-cell) { grid-template-columns: 36px; }
    .notification-post :global(.post-preview-footer-replies-slot),
    .notification-post :global(.post-preview-footer-reaction-slot) { display: none; }
</style>
