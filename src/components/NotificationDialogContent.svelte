<script lang="ts">
    import { onDestroy, onMount, tick, untrack } from 'svelte';
    import { liveQuery } from 'dexie';
    import { _ } from 'svelte-i18n';
    import type { RxNostr } from 'rx-nostr';
    import type { NotificationDialogProps } from '../lib/notificationDialogTypes';
    import Button from './Button.svelte';
    import NotificationPost from './NotificationPost.svelte';
    import PostHistoryQuotePreview from './PostHistoryQuotePreview.svelte';
    import ImageFullscreen from './ImageFullscreen.svelte';
    import ProfileAvatar from './ProfileAvatar.svelte';
    import PostHistoryReactionDetails from './PostHistoryReactionDetails.svelte';
    import { buildPostHistoryReactionReadModel } from '../lib/postHistoryReactionReadModel';
    import { usePostHistoryEmojiState } from '../lib/hooks/usePostHistoryEmojiState.svelte';
    import { notificationRepository, type NotificationRecord } from '../lib/storage/notificationRepository';
    import { notificationType } from '../lib/notification';
    import { groupNotifications, type NotificationGroup } from '../lib/notificationGrouping';
    import { syncNotifications } from '../lib/notificationSyncService';
    import { createPostHistoryProfileSyncCoordinator } from '../lib/postHistoryProfileSync';
    import { createPostHistoryRelatedTargetResolver, type RelatedTargetDescriptor } from '../lib/postHistoryRelatedTargetResolver.svelte';
    import { usePostHistoryQuotePreviews } from '../lib/hooks/usePostHistoryQuotePreviews.svelte';
    import { createSensitivePayloadBodyLoader } from '../lib/sensitiveContentPayloadReader';
    import { verifyRelatedEvent } from '../lib/relatedEventVerification';
    import { parseReactionReference } from '../lib/reactionReference';
    import { getRepostReference, repostTargetToPost } from '../lib/postRepostUtils';
    import { shortenMiddle } from '../lib/utils/textDisplayUtils';
    import { getPostHistoryAuthoredRelayScopeKey } from '../lib/postHistoryRelayResolver';
    import type { FullscreenMediaItem, ProfileData, RelayConfig } from '../lib/types';
    import type { PostHistoryRecord } from '../lib/storage/ehagakiDb';
    import type { PostHistoryInboundInteractionsSyncRequest } from '../lib/postHistoryInboundInteractionsSyncService';

    interface Props extends NotificationDialogProps {
        presentationReady?: boolean;
        onInitialReady?: () => void;
        onBusyChange?: (busy: boolean) => void;
    }
    let { show = $bindable(false), pubkeyHex, rxNostr, relayConfig, returnFocus = null,
        onClose, onReplyPost, onReactionPost, reconcileDirectReplyCandidates, presentationReady = false, onInitialReady, onBusyChange }: Props = $props();
    let records = $state.raw<NotificationRecord[]>([]);
    let limit = $state(100), localMore = $state(false), exhausted = $state(false);
    let loaded = $state(false), busy = $state(false), failed = $state(false), visible = $state(false);
    let invalidated = $state(false), profiles = $state.raw<Record<string, ProfileData>>({});
    let media = $state.raw<FullscreenMediaItem[]>([]), mediaIndex = $state(-1);
    let task: ReturnType<typeof syncNotifications> | null = null;
    let generation = $state(0);
    let listRevision = $state(0), localReadFailed = $state(false);
    function reactionModel(items: NotificationRecord[]) {
        return buildPostHistoryReactionReadModel(items.map(({ event }) => ({ eventId: event.id, authorPubkey: event.pubkey,
            kind: event.kind, content: event.content, tags: event.tags, createdAt: event.created_at })), profiles);
    }
    const reactionEmoji = usePostHistoryEmojiState({ getShow: () => show && !invalidated,
        getEmojiUrls: () => records.filter(record => record.event.kind === 7)
            .flatMap(record => reactionModel([record]).groups.flatMap(group => group.emojiUrl ? [group.emojiUrl] : [])) });
    const profileSync = createPostHistoryProfileSyncCoordinator({ getShow: () => show && !invalidated, getRxNostr: () => rxNostr });
    const unsubscribeProfile = profileSync.subscribe((key, profile) => { profiles = { ...profiles, [key]: profile }; });
    const resolver = createPostHistoryRelatedTargetResolver({ getShow: () => show && !invalidated,
        getOwner: () => pubkeyHex,
        getRxNostr: () => rxNostr, getRelayConfig: () => relayConfig, profileSyncCoordinator: profileSync, requireFullVerification: true });
    const notificationGroups = $derived(groupNotifications(records, id => resolver.getTargetSnapshot(id)?.event ?? null));
    const posts = $derived(records.filter(record => [1, 42, 1111].includes(record.event.kind))
        .map(record => repostTargetToPost(record.event, record.relayUrls)));
    const quotes = usePostHistoryQuotePreviews({ getShow: () => show && !invalidated, getPosts: () => posts,
        getRxNostr: () => rxNostr, getRelayConfig: () => relayConfig, profileSyncCoordinator: profileSync, relatedTargetResolver: resolver });

    export function invalidateSession() {
        invalidated = true; generation++; task?.cancel(); task = null; busy = false;
        records = []; profiles = {}; media = []; mediaIndex = -1;
        resolver.reset(); profileSync.reset();
    }
    function close() { if (mediaIndex >= 0) return false; invalidateSession(); onClose(); return true; }
    export function isFullscreen() { return mediaIndex >= 0; }
    let readyReported = false;
    $effect(() => {
        if (!loaded || readyReported || !show || invalidated) return;
        const owner = pubkeyHex;
        void tick().then(() => {
            if (!show || invalidated || pubkeyHex !== owner || readyReported) return;
            readyReported = true; onInitialReady?.();
        });
    });
    $effect(() => { onBusyChange?.(busy); });
    onMount(() => {
        const sync = () => { visible = document.visibilityState === 'visible'; };
        sync(); document.addEventListener('visibilitychange', sync);
        return () => document.removeEventListener('visibilitychange', sync);
    });
    $effect(() => {
        const owner = pubkeyHex, pageSize = limit;
        listRevision;
        if (!show || !owner || invalidated) return;
        let active = true;
        const subscription = liveQuery(() => notificationRepository.list(owner, pageSize + 1)).subscribe({
            next: value => { if (active) { localReadFailed = false; records = value.slice(0, pageSize); localMore = value.length > pageSize; loaded = true; } },
            error: () => { if (active) { localReadFailed = true; failed = true; loaded = true; } },
        });
        return () => { active = false; subscription.unsubscribe(); };
    });
    $effect(() => {
        const owner = pubkeyHex, epoch = generation;
        if (!show || !visible || !presentationReady || localReadFailed || invalidated || !owner) return;
        let active = true;
        const owned = () => active && show && visible && presentationReady && !invalidated && generation === epoch && pubkeyHex === owner;
        // Opening the inbox acknowledges saved notifications, including later local pages.
        // Snapshot IDs keep arrivals after hiding/closing out of an already queued update.
        const subscription = liveQuery(() => notificationRepository.unreadEventIds(owner)).subscribe({
            next: ids => {
                if (!ids.length || !owned()) return;
                void tick().then(() => notificationRepository.markRead(owner, ids, owned))
                    .catch(() => { if (owned()) failed = true; });
            },
            error: () => { if (owned()) failed = true; },
        });
        return () => { active = false; subscription.unsubscribe(); };
    });
    $effect(() => {
        for (const record of records) profileSync.ensureProfile(record.event.pubkey, record.relayUrls);
    });
    function descriptor(record: NotificationRecord): RelatedTargetDescriptor | null {
        const reference = record.event.kind === 7 ? parseReactionReference(record.event).reference : getRepostReference(record.event);
        return reference ? { targetEventId: reference.eventId, authorHint: reference.authorHint,
            authorHints: reference.authorHints, targetKindHint: record.event.kind === 6 ? 1 : reference.targetKindHint,
            excludedKinds: record.event.kind === 16 ? [1] : undefined,
            relayHints: [...reference.relayHints, ...record.relayUrls], relationKind: 'notification',
            scopeKey: 'notifications', sourceEventId: record.eventId } : null;
    }
    function groupDescriptor(group: NotificationGroup): RelatedTargetDescriptor | null {
        const value = descriptor(group.record);
        if (!value || group.reactions.length < 2) return value;
        return { ...value, relayHints: [...new Set(group.reactions.flatMap(record => descriptor(record)?.relayHints ?? []))] };
    }
    function targetSnapshot(record: NotificationRecord) {
        const reference = record.event.kind === 7 ? parseReactionReference(record.event).reference : getRepostReference(record.event);
        const snapshot = reference ? resolver.getTargetSnapshot(reference.eventId) : null;
        if (!snapshot?.event || !reference) return snapshot;
        const kindValid = record.event.kind === 6 ? snapshot.event.kind === 1
            : record.event.kind === 16 ? snapshot.event.kind !== 1 : true;
        return kindValid && verifyRelatedEvent(snapshot.event, reference) ? snapshot : { ...snapshot, event: null, status: 'error' as const };
    }
    $effect(() => {
        if (!show || invalidated) return;
        const currentRecords = records;
        const targets = untrack(() => groupNotifications(currentRecords, id => resolver.getTargetSnapshot(id)?.event ?? null).flatMap(group => {
            const record = group.record;
            if (![6, 7, 16].includes(record.event.kind)) return [];
            const value = groupDescriptor(group);
            if (value && resolver.getTargetSnapshot(value.targetEventId)?.event && targetSnapshot(record)?.status === 'error') return [];
            return value ? [value] : [];
        }));
        let active = true;
        const byTarget = new Map<string, RelatedTargetDescriptor[]>();
        for (const target of targets) byTarget.set(target.targetEventId, [...(byTarget.get(target.targetEventId) ?? []), target]);
        void Promise.all([...byTarget.values()].map(async candidates => {
            let result = await resolver.ensureTarget(candidates[0]);
            for (const candidate of candidates.slice(1)) {
                if (!active || result?.status !== 'error' || result.errorCode !== 'invalid_event') break;
                result = await resolver.retryTarget(candidate);
            }
        }));
        return () => { active = false; };
    });
    export async function refresh(older = false) {
        if (localReadFailed) { localReadFailed = false; listRevision++; }
        if (busy || !show || !visible || invalidated || !pubkeyHex || !rxNostr) return;
        const epoch = generation, owner = pubkeyHex, runtime = rxNostr;
        const scope = getPostHistoryAuthoredRelayScopeKey(relayConfig);
        const owned = () => show && visible && !invalidated && epoch === generation && owner === pubkeyHex
            && runtime === rxNostr && scope === getPostHistoryAuthoredRelayScopeKey(relayConfig);
        busy = true; failed = false;
        const current = syncNotifications(runtime, { ownerPubkeyHex: owner, relayConfig, older,
            reconcileDirectReplyCandidates, isActive: owned });
        task = current;
        try {
            const result = await current.promise;
            if (!owned()) return;
            failed = !!result && (result.status !== 'success' || result.maybeIncomplete);
            if (result?.maybeIncomplete) exhausted = false;
            if (older) { exhausted = !result || result.notificationsExhausted === true; limit += 100; }
        } catch { if (owned()) failed = true; }
        finally { if (task === current) { task = null; busy = false; } }
    }
    $effect(() => {
        const open = show, owner = pubkeyHex, runtime = rxNostr, foreground = visible;
        getPostHistoryAuthoredRelayScopeKey(relayConfig);
        if (!open || !owner || !foreground || invalidated) return;
        untrack(() => { generation++; task?.cancel(); task = null; busy = false; void refresh(); });
        return () => { generation++; task?.cancel(); task = null; busy = false; resolver.reset(); };
    });
    async function apply(post: PostHistoryRecord, reaction: boolean) {
        const epoch = generation;
        const applied = await (reaction ? onReactionPost(post) : onReplyPost(post));
        if (applied && epoch === generation && !invalidated) close();
        return applied;
    }
    function sensitiveBody(structure: NotificationRecord['event'], relayHints: string[] = []) {
        return createSensitivePayloadBodyLoader({ structure, relayHints, rxNostr, relayConfig, ownerPubkey: pubkeyHex });
    }
    function openImage(value: { index: number; mediaList: FullscreenMediaItem[] }) { media = value.mediaList; mediaIndex = value.index; }
    onDestroy(() => { invalidateSession(); unsubscribeProfile(); profileSync.dispose(); });
</script>

    <div class="notification-list" aria-busy={busy}>
        {#if loaded && !records.length}<p>{$_('notifications.empty')}</p>{/if}
        {#each notificationGroups as group (group.id)}
            {@const record = group.record}
            {@const type = notificationType(record.event)}
            <article class="notification-entry" data-notification-id={group.reactions[0]?.eventId ?? record.eventId}>
                {#if type === 'reaction' || type === 'repost'}
                    {#if type === 'reaction'}
                        <div class="notification-reaction">
                            <PostHistoryReactionDetails readModel={reactionModel(group.reactions)}
                                emojiLoadStateByUrl={reactionEmoji.emojiLoadStateByUrl} emojiImageMetaByUrl={reactionEmoji.emojiImageMetaByUrl} />
                            {#if group.reactions.length === 1}<span>{profiles[record.event.pubkey]?.displayName || profiles[record.event.pubkey]?.name || shortenMiddle(record.event.pubkey, 12, 4)}</span>{/if}
                        </div>
                    {:else}
                    <div class="notification-actor">
                        <span class="notification-kind-icon notification-repost-icon svg-icon" role="img" aria-label={$_('notifications.repost')}></span>
                        <ProfileAvatar pubkeyHex={record.event.pubkey} displayName={profiles[record.event.pubkey]?.displayName}
                            src={profiles[record.event.pubkey]?.picture} alt="" rootClassName="notification-avatar"
                            imageClassName="notification-avatar-image" />
                        <span>{profiles[record.event.pubkey]?.displayName || profiles[record.event.pubkey]?.name || shortenMiddle(record.event.pubkey, 12, 4)}</span>
                    </div>
                    {/if}
                    {@const target = groupDescriptor(group)}
                    {@const snapshot = targetSnapshot(record)}
                    {#if snapshot?.event}
                        <NotificationPost event={snapshot.event} profile={snapshot.profile} onImageOpen={openImage}
                            loadSensitiveBody={sensitiveBody(snapshot.event, snapshot.relayHints)} />
                    {:else}
                        {#if !snapshot || snapshot.status === 'loading'}
                            <div class="notification-target-placeholder" aria-hidden="true"></div>
                        {:else}<p role="status">{$_('notifications.targetUnavailable')}</p>{/if}
                        {#if target && snapshot?.status !== 'loading'}
                            <Button variant="default" shape="pill" onClick={() => resolver.retryTarget(target)}>{$_('notifications.retry')}</Button>
                        {/if}
                    {/if}
                {:else}
                    {#if type === 'reply'}
                        <span class="notification-kind-icon notification-reply-icon svg-icon" role="img" aria-label={$_('notifications.reply')}></span>
                    {:else}
                        <span class="notification-type">{$_(`notifications.${type}`)}</span>
                    {/if}
                    <NotificationPost event={record.event} profile={profiles[record.event.pubkey]} relayUrls={record.relayUrls} loadSensitiveBody={sensitiveBody(record.event, record.relayUrls)}
                        onReply={(post) => apply(post, false)} onReaction={(post) => apply(post, true)} onImageOpen={openImage} />
                    {#each quotes.getQuotePreviews(repostTargetToPost(record.event, record.relayUrls)) as preview (preview.eventId)}
                        {#if preview.status === 'resolved'}
                            <NotificationPost event={preview.event} profile={preview.profile} onImageOpen={openImage}
                                loadSensitiveBody={sensitiveBody(preview.event, preview.relayHints)} />
                        {:else}
                            <PostHistoryQuotePreview {preview} onImageOpen={openImage} onRetry={(eventId) => quotes.retryQuotePreview(eventId)} />
                        {/if}
                    {/each}
                {/if}
            </article>
        {/each}
        {#if failed}<p role="status">{$_('notifications.partialFailure')}</p>
            <Button variant="default" shape="pill" onClick={() => refresh()} disabled={busy}>{$_('notifications.retry')}</Button>{/if}
        {#if localMore || !exhausted}<Button variant="default" shape="pill" disabled={busy} onClick={() => { if (localMore) limit += 100; else void refresh(true); }}>{$_('notifications.more')}</Button>{/if}
    </div>

{#if mediaIndex >= 0}
    <ImageFullscreen show={true} mediaList={media} currentIndex={mediaIndex} onNavigate={(index) => mediaIndex = index} onClose={() => mediaIndex = -1} />
{/if}

<style>
    .notification-target-placeholder { height: 100px; border-radius: 4px; background: var(--text); opacity: .05; }
    .notification-list { width: 100%; display: grid; min-width: 0; gap: 12px; overflow-wrap: anywhere; }
    .notification-entry { display: grid; min-width: 0; gap: 6px; padding-block: 8px; border-bottom: 1px solid var(--border-hr); }
    .notification-type { font-size: .85rem; opacity: .8; }
    .notification-actor { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
    .notification-reaction { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
    .notification-reaction :global(.post-preview-reactions-panel) { padding: 0; }
    .notification-actor :global(.notification-avatar) {
        display: block;
        width: 24px;
        height: 24px;
        flex: 0 0 auto;
        border-radius: 50%;
        overflow: hidden;
    }
    .notification-actor :global(.notification-avatar-image) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .notification-kind-icon { --icon-size: 22px; --svg: currentColor; width: 22px; height: 22px; flex: 0 0 22px; }
    .notification-repost-icon { mask-image: url('/icons/repost.svg'); }
    .notification-reply-icon { mask-image: url('/icons/chat_bubble_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg'); }
</style>
