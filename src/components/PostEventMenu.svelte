<script lang="ts">
    import { _, locale } from 'svelte-i18n';
    import type { PostHistoryRecord } from '../lib/storage/ehagakiDb';
    import type { RxNostr } from 'rx-nostr';
    import type { RepostPostHandler } from '../lib/hooks/usePostRepostOperation.svelte';
    import type { usePostEventOperations } from '../lib/hooks/usePostEventOperations.svelte';
    import { usePostHistoryCopyNevent } from '../lib/hooks/usePostHistoryCopyNevent.svelte';
    import { canRequestPostDeletion } from '../lib/postDeletionService';
    import { resolveBroadcastEvent } from '../lib/postBroadcastService';
    import { settingsStore } from '../stores/settingsStore.svelte';
    import { writeRelaysStore } from '../stores/relayStore.svelte';
    import { buildPostHistoryExternalClientUrl, getExternalNostrClientDisplayName } from '../lib/postHistoryExternalClient';
    import { formatPostedAtExact } from '../lib/postHistoryDialogUtils';
    import { isRepostTargetKind } from '../lib/postRepostUtils';
    import { isPostHistoryRawEventConsistent } from '../lib/postHistoryEventUtils';
    import { createPostHistoryRelatedTargetResolver } from '../lib/postHistoryRelatedTargetResolver.svelte';
    import { onDestroy } from 'svelte';
    import { loadVerifiedSensitivePayloadEvent } from '../lib/sensitiveContentPayloadReader';
    import PostHistoryActionMenu from './PostHistoryActionMenu.svelte';
    import PostHistoryRecordActionItems from './PostHistoryRecordActionItems.svelte';
    import PostHistoryRawJsonDialog from './PostHistoryRawJsonDialog.svelte';
    import ConfirmDialog from './ConfirmDialog.svelte';
    import FloatingMessage from './FloatingMessage.svelte';
    import { DropdownMenu } from 'bits-ui';
    interface Props { post: PostHistoryRecord; owner?: string | null; rxNostr?: RxNostr; relayConfig?: import('../lib/types').RelayConfig | null;
        operations: ReturnType<typeof usePostEventOperations>; active?: () => boolean; onDeleted?: (id: string, deletedAt: number, deletionEventId: string) => void;
        open?: boolean; onOpenChange?: (open: boolean) => void; triggerLabel?: string; onDelete?: () => void; onRequestRepost?: () => void; onRefresh?: () => Promise<void>; onRepost?: RepostPostHandler; repostPending?: boolean; }
    let { post, owner, rxNostr, relayConfig, operations, active = () => true, onDeleted, open = false, onOpenChange, triggerLabel, onDelete, onRequestRepost, onRefresh, onRepost, repostPending = false }: Props = $props();
    let disposed = false;
    const isActive = () => !disposed && active();
    onDestroy(() => { disposed = true; });
    const copy = usePostHistoryCopyNevent();
    let raw = $state(false), confirm = $state(false), refreshing = $state(false);
    let message = $state('');
    const preference = $derived({ client: settingsStore.externalNostrClient, customUrlTemplate: settingsStore.externalNostrClientCustomUrl });
    const externalLabel = $derived(getExternalNostrClientDisplayName(preference));
    const deletePending = $derived(operations.isPending(`delete:${post.eventId}`));
    async function refresh() { if (!onRefresh || refreshing) return; refreshing = true; try { await onRefresh(); } finally { refreshing = false; } }
    async function broadcast() { const result = await operations.broadcast(post); if (result && isActive()) message = result.success ? 'postHistory.broadcastSent' : 'postHistory.broadcastFailed'; }
    async function remove() { const result = await operations.deletePost(post); if (!result || !isActive()) return; message = result.success ? '' : 'postHistory.deleteFailed'; if (result.success) { onDeleted?.(post.eventId, result.deletedAt ?? Date.now(), result.deletionEventId ?? ''); confirm = false; } }
    const resolver = createPostHistoryRelatedTargetResolver({ getShow: () => isActive(), getOwner: () => owner, getRxNostr: () => rxNostr, getRelayConfig: () => relayConfig });
    async function repost() { if (onRequestRepost) { onRequestRepost(); return; } if (!onRepost || repostPending) return; const result = await onRepost(post, (event, relayHints) => resolver.prepareRepostTarget({ targetEventId: event.id, authorHint: event.pubkey, relayHints, relationKind: 'repost', scopeKey: 'event-menu' }, event)); if (isActive()) message = result.success ? 'repost.sent' : 'repost.failed'; }
    onDestroy(() => { copy.resetState(); resolver.reset(); });
</script>
<PostHistoryActionMenu {open} {onOpenChange} lazy={true} restoreFocusOnClose={true} triggerAriaLabel={triggerLabel ?? $_('common.showActions')} timestamp={formatPostedAtExact(post.postedAt, $locale)}>
    {#snippet items()}
        {#if onRefresh}<DropdownMenu.Item class="menu-action-button" disabled={refreshing} onSelect={() => void refresh()}>{$_('postHistory.checkRelatedEvents')}</DropdownMenu.Item>{/if}
        <PostHistoryRecordActionItems order="standard" copyFailed={copy.copyState[post.eventId] === 'failed'}
            showBroadcast={!!resolveBroadcastEvent(post)} broadcastSending={operations.isPending(`broadcast:${post.eventId}`)}
            showDelete={canRequestPostDeletion(post, owner)} showDeleteSeparator={true} deletionSending={deletePending}
            onCopyPointerDown={(event) => copy.captureCopyPointerPosition(post, event)} onCopyNevent={(event) => void copy.handleCopyNevent(post, event)}
            externalClientLabel={externalLabel ? $_('postHistory.openInExternalClient', { values: { client: externalLabel } }) : $_('postHistory.openInExternalClientFallback')}
            onOpenExternalClient={() => { const url = buildPostHistoryExternalClientUrl(post, preference, writeRelaysStore.value); if (url) window.open(url, '_blank', 'noopener,noreferrer'); }}
            onShowRawJson={() => raw = true} onRepost={onRepost && !post.deletedAt && isRepostTargetKind(post.kind) && isPostHistoryRawEventConsistent(post.rawEvent, post) ? () => void repost() : undefined} {repostPending}
            onBroadcastPointerDown={() => {}} onBroadcastPost={() => void broadcast()} onOpenDeleteConfirm={() => { if (onDelete) onDelete(); else confirm = true; }} />
    {/snippet}
</PostHistoryActionMenu>
{#if raw}<PostHistoryRawJsonDialog open={true} rawEvent={post.rawEvent} onOpenChange={(value) => raw = value}
    loadPayloadEvent={(structure, signal) => loadVerifiedSensitivePayloadEvent({ structure, signal, rxNostr, relayConfig, relayHints: post.relayHints })} />{/if}
{#if confirm}<ConfirmDialog open={true} onOpenChange={value => confirm = value} title={$_('postHistory.deleteRequestTitle')} description={$_('postHistory.deleteRequestDescription')}
    confirmLabel={$_('postHistory.deleteConfirm')} cancelLabel={$_('postHistory.deleteCancel')} confirmDisabled={deletePending} preventCloseWhileConfirming={true}
    closeOnConfirm={false} onConfirm={remove} />{/if}
{#if message}<p role="status">{$_(message)}</p>{/if}
<FloatingMessage show={copy.showCopyFloatingMessage} x={copy.copyFloatingMessageX} y={copy.copyFloatingMessageY}>{$_('postHistory.copied')}</FloatingMessage>
