<script lang="ts">
    import { onDestroy, untrack } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { getNotificationPostInteractions } from '../lib/hooks/useNotificationPostInteractions.svelte';
    import PostEventMenu from './PostEventMenu.svelte';
    import PostHistoryRepliesBadgeButton from './PostHistoryRepliesBadgeButton.svelte';
    import PostHistoryReactionActionButton from './PostHistoryReactionActionButton.svelte';
    import PostHistoryReactionDetails from './PostHistoryReactionDetails.svelte';
    import NotificationPost from './NotificationPost.svelte';
    import type { FullscreenMediaItem, NostrEvent, ProfileData } from '../lib/types';
    import PostHistoryRelatedEventCard from './PostHistoryRelatedEventCard.svelte';
    import PostHistoryPostActions from './PostHistoryPostActions.svelte';
    import { repostTargetToPost } from '../lib/postRepostUtils';
    import { buildComposerInteractionRenderModel } from '../lib/composerTargetRelatedPreview';
    import { buildPostContentRenderModel, type SensitiveBodyLoader } from '../lib/postContentPreview';
    import { stripPostHistoryInlineQuoteUrisForDisplay } from '../lib/postHistoryQuoteUtils';
    import { usePostHistoryEmojiState } from '../lib/hooks/usePostHistoryEmojiState.svelte';
    import { usePostHistoryPreviewCollapse } from '../lib/hooks/usePostHistoryPreviewCollapse.svelte';
    import PostPreviewToggleButton from './PostPreviewToggleButton.svelte';
    interface Props {
        event: NostrEvent;
        profile?: ProfileData | null;
        relayUrls?: string[];
        plain?: boolean;
        ancestors?: string[];
        loadSensitiveBody?: SensitiveBodyLoader;
        onImageOpen: (value: { index: number; mediaList: FullscreenMediaItem[] }) => void;
    }
    let { event, profile = null, relayUrls = [], plain = false, ancestors = [], loadSensitiveBody, onImageOpen }: Props = $props();
    const componentId = $props.id();
    const previewId = `notification-preview-${componentId}`;
    let container = $state<HTMLElement | null>(null);
    const collapsePost = $derived({ eventId: previewId, content: event.content });
    const collapse = usePostHistoryPreviewCollapse({ getShow: () => true,
        getPosts: () => [collapsePost], getContainer: () => container });
    const interactions = getNotificationPostInteractions();
    const post = $derived({ ...repostTargetToPost(event, relayUrls), ...(interactions.isDeleted(event.id) ? { deletedAt: 1 } : {}) });
    const model = $derived(post.deletedAt ? buildPostContentRenderModel({ kind: event.kind, sourceContent: $_('postHistory.deleted'), tags: [] }) : [6, 7, 16].includes(event.kind) ? buildComposerInteractionRenderModel(event) : buildPostContentRenderModel({ kind: event.kind, sourceContent: event.content,
        tags: event.tags, displayContent: stripPostHistoryInlineQuoteUrisForDisplay(event) }));
    const graphState = $derived(interactions.graph.getAnchorState(post));
    let showReplies = $state(false), showReactions = $state(false);
    let entered = $state(false);
    $effect(() => {
        if (!entered) return;
        const current = post;
        untrack(() => interactions.register(previewId, current));
        return () => untrack(() => interactions.unregister(previewId));
    });
    function observe(node: HTMLElement) {
        const observer = new IntersectionObserver(entries => { entered = entries.some(entry => entry.isIntersecting); }, { rootMargin: '160px' });
        observer.observe(node);
        return { destroy: () => observer.disconnect() };
    }
    onDestroy(() => interactions.unregister(previewId));
    const callbacks = $derived(interactions.props());
    function replies() { showReplies = !showReplies; if (showReplies && !graphState.repliesActionState.visible) interactions.graph.toggleChildren(post); }

    const emoji = usePostHistoryEmojiState({ getShow: () => true, getEmojiUrls: () => model.previewContent.segments
        .flatMap(segment => segment.type === 'emoji' ? [segment.url] : []).concat(showReactions ? graphState.reactionReadModel.groups.flatMap(group => group.emojiUrl ? [group.emojiUrl] : []) : []), onStateChanged: () => collapse.remeasure() });
</script>

<div class="notification-post" use:observe bind:this={container} class:plain>
<PostHistoryRelatedEventCard {event} {profile} {model} {onImageOpen} {loadSensitiveBody}
    maxVisibleImages={3}
    previewCollapseAction={collapse.previewRef} previewCollapseEventId={previewId} previewContentId={previewId}
    isTextCollapsed={!collapse.isPostExpanded(collapsePost)}
    emojiLoadStateByUrl={emoji.emojiLoadStateByUrl} emojiImageMetaByUrl={emoji.emojiImageMetaByUrl}>
    {#snippet textOverlay()}
        <PostPreviewToggleButton placement="overlay" visible={collapse.shouldCollapsePost(collapsePost)}
            expanded={collapse.isPostExpanded(collapsePost)} controls={previewId}
            onToggle={() => collapse.togglePostExpanded(previewId)} />
    {/snippet}
    {#snippet footerActions()}
        <PostHistoryPostActions {post} onReplyPost={!post.deletedAt && event.kind !== 42 ? callbacks.onReplyPost : undefined}
            onQuotePost={!post.deletedAt && event.kind !== 42 ? callbacks.onQuotePost : undefined} onReactionPost={callbacks.onReactionPost}>
            {#snippet replyExtras()}
                {#if graphState.repliesActionState.status === 'loaded' && graphState.repliesActionState.replyCount > 0}
                    <PostHistoryRepliesBadgeButton count={graphState.repliesActionState.replyCount} selected={showReplies}
                        ariaLabel={$_('postHistory.showRepliesWithCount', { values: { count: graphState.repliesActionState.replyCount } })} onClick={replies} />
                {/if}
            {/snippet}
            {#snippet reactionExtras()}
                {#if graphState.reactionReadModel.totalCount > 0}
                    <PostHistoryReactionActionButton count={graphState.reactionReadModel.totalCount} expanded={showReactions}
                        ariaLabel={$_('postHistory.showReactionsWithCount', { values: { count: graphState.reactionReadModel.totalCount } })} onToggle={() => showReactions = !showReactions} />
                {/if}
            {/snippet}
        </PostHistoryPostActions>
    {/snippet}
    {#snippet footerMenu()}
        <PostEventMenu {post} owner={callbacks.pubkeyHex} rxNostr={callbacks.rxNostr} relayConfig={callbacks.relayConfig}
            operations={interactions.operations} active={interactions.active} onDeleted={interactions.deleted}
            onRefresh={() => interactions.refresh(post)} onRepost={callbacks.onRepostPost} repostPending={callbacks.repostPending} />
    {/snippet}
    {#snippet footerDetails()}
        {#if interactions.isIncomplete(event.id) || graphState.relatedEventsStatus === 'failed' || graphState.relatedEventsStatus === 'partial'}
            <p role="status">{$_('postHistory.relatedEventsFailed')}</p>
            <button disabled={graphState.relatedEventsStatus === 'loading'} onclick={() => void interactions.refresh(post)}>{$_('notifications.retry')}</button>
        {/if}
        {#if showReactions}<PostHistoryReactionDetails readModel={graphState.reactionReadModel} emojiLoadStateByUrl={emoji.emojiLoadStateByUrl} emojiImageMetaByUrl={emoji.emojiImageMetaByUrl} />{/if}
        {#if showReplies && ancestors.length < 20}
            {#each graphState.replyItems as reply (reply.event.id)}
                {#if ![...ancestors, event.id].includes(reply.event.id)}
                    <NotificationPost event={reply.event} profile={reply.profile} relayUrls={reply.relayUrls} loadSensitiveBody={interactions.sensitiveBody(reply.event, reply.relayUrls)} {onImageOpen} plain={true} ancestors={[...ancestors, event.id]} />
                {/if}
            {/each}
            {#if graphState.repliesActionState.status === 'loading'}<p role="status">{$_('postHistory.repliesLoading')}</p>{/if}
            {#if graphState.repliesActionState.status === 'failed'}<button onclick={() => interactions.graph.retryChildren(post)}>{$_('notifications.retry')}</button>{/if}
        {/if}
    {/snippet}
</PostHistoryRelatedEventCard>

</div>
<style>
    .notification-post { min-width: 0; }
    .plain :global(.post-history-related-card) { border-inline-start: 0; background: transparent; margin-inline-start: 0; }
    .plain :global(.post-history-related-card-body) { padding-inline: 0; }
    .plain :global(.post-preview-footer) { margin-inline: 0; padding-inline-start: 0; }
</style>
