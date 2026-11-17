<script lang="ts">
    import { untrack } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { getNotificationPostInteractions } from '../lib/hooks/useNotificationPostInteractions.svelte';
    import { inViewportAction } from '../lib/hooks/inViewportAction.svelte';
    import PostEventMenu from './PostEventMenu.svelte';
    import type { FullscreenMediaItem, NostrEvent, ProfileData } from '../lib/types';
    import PostHistoryRelatedEventCard from './PostHistoryRelatedEventCard.svelte';
    import PostHistoryPostActions from './PostHistoryPostActions.svelte';
    import { repostTargetToPost } from '../lib/postRepostUtils';
    import { buildComposerInteractionRenderModel } from '../lib/composerTargetRelatedPreview';
    import { buildPostContentRenderModel, type SensitiveBodyLoader } from '../lib/postContentPreview';
    import { stripPostHistoryInlineQuoteUrisForDisplay } from '../lib/postHistoryQuoteUtils';
    import PostPreviewToggleButton from './PostPreviewToggleButton.svelte';
    interface Props {
        event: NostrEvent;
        profile?: ProfileData | null;
        relayUrls?: string[];
        plain?: boolean;
        loadSensitiveBody?: SensitiveBodyLoader;
        onImageOpen: (value: { index: number; mediaList: FullscreenMediaItem[] }) => void;
    }
    let { event, profile = null, relayUrls = [], plain = false, loadSensitiveBody, onImageOpen }: Props = $props();
    const componentId = $props.id();
    const previewId = `notification-preview-${componentId}`;
    const interactions = getNotificationPostInteractions();
    // Collapse measurement and emoji loading are owned by the list, as in post history.
    const preview = interactions.preview!;
    const collapsePost = $derived({ eventId: previewId, content: event.content });
    const basePost = $derived(repostTargetToPost(event, relayUrls));
    const deleted = $derived(interactions.isDeleted(event.id));
    const post = $derived(deleted ? { ...basePost, deletedAt: 1 } : basePost);
    const model = $derived(deleted ? buildPostContentRenderModel({ kind: event.kind, sourceContent: $_('postHistory.deleted'), tags: [] }) : [6, 7, 16].includes(event.kind) ? buildComposerInteractionRenderModel(event) : buildPostContentRenderModel({ kind: event.kind, sourceContent: event.content,
        tags: event.tags, displayContent: stripPostHistoryInlineQuoteUrisForDisplay(event) }));
    const emojiUrls = $derived(model.previewContent.segments.flatMap(segment => segment.type === 'emoji' ? [segment.url] : []));
    $effect(() => {
        const entry = { eventId: previewId, content: event.content, emojiUrls };
        untrack(() => interactions.registerPreview(entry));
    });
    $effect(() => () => untrack(() => interactions.unregisterPreview(previewId)));
    let entered = $state(false);
    // Deletion is watched once a card has been near the viewport; leaving it keeps the watch.
    $effect(() => {
        if (!entered) return;
        const target = { eventId: event.id, pubkeyHex: event.pubkey };
        untrack(() => interactions.register(previewId, target));
    });
    $effect(() => () => untrack(() => interactions.unregister(previewId)));
    const callbacks = $derived(interactions.props());
</script>

<div class="notification-post" use:inViewportAction={{ enabled: true, once: true, rootMargin: '160px', onEnterView: () => { entered = true; } }} class:plain>
<PostHistoryRelatedEventCard {event} {profile} {model} {onImageOpen} {loadSensitiveBody}
    maxVisibleImages={3}
    previewCollapseAction={preview.previewRef} previewCollapseEventId={previewId} previewContentId={previewId}
    isTextCollapsed={!preview.isPostExpanded(collapsePost)}
    emojiLoadStateByUrl={preview.emojiLoadStateByUrl} emojiImageMetaByUrl={preview.emojiImageMetaByUrl}>
    {#snippet textOverlay()}
        <PostPreviewToggleButton placement="overlay" visible={preview.shouldCollapsePost(collapsePost)}
            expanded={preview.isPostExpanded(collapsePost)} controls={previewId}
            onToggle={() => preview.togglePostExpanded(previewId)} />
    {/snippet}
    {#snippet footerActions()}
        <PostHistoryPostActions {post} onReplyPost={!post.deletedAt && event.kind !== 42 ? callbacks.onReplyPost : undefined}
            onQuotePost={!post.deletedAt && event.kind !== 42 ? callbacks.onQuotePost : undefined} onReactionPost={callbacks.onReactionPost} />
    {/snippet}
    {#snippet footerMenu()}
        <PostEventMenu {post} owner={callbacks.pubkeyHex} rxNostr={callbacks.rxNostr} relayConfig={callbacks.relayConfig}
            operations={interactions.operations} active={interactions.active} onDeleted={interactions.deleted}
            onRepost={callbacks.onRepostPost} repostPending={callbacks.repostPending} />
    {/snippet}
</PostHistoryRelatedEventCard>

</div>
<style>
    .notification-post { min-width: 0; }
    .plain :global(.post-history-related-card) { --post-history-related-card-bg: var(--dialog-bg); border-inline-start: 0; background: transparent; margin-inline-start: 0; }
    .plain :global(.post-history-related-card-body) { padding-inline: 0; }
    .plain :global(.post-preview-footer) { margin-inline: 0; padding-inline-start: 0; }
</style>
