<script lang="ts">
    import { onDestroy, onMount, tick, untrack } from 'svelte';
    import { resolveAppAssetUrl } from '../lib/appAssetUrl';
    import { useNotificationViewport } from '../lib/hooks/useNotificationViewport.svelte';
    import { liveQuery } from 'dexie';
    import { _ } from 'svelte-i18n';
    import type { RxNostr } from 'rx-nostr';
    import type { NotificationDialogProps } from '../lib/notificationDialogTypes';
    import { useNotificationPostInteractions } from '../lib/hooks/useNotificationPostInteractions.svelte';
    import PostRepostFeedback from './PostRepostFeedback.svelte';
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
    import { groupNotifications, notificationTargetReference, type NotificationGroup } from '../lib/notificationGrouping';
    import { syncNotifications } from '../lib/notificationSyncService';
    import { createPostHistoryProfileSyncCoordinator } from '../lib/postHistoryProfileSync';
    import { createPostHistoryRelatedTargetResolver, type RelatedTargetDescriptor } from '../lib/postHistoryRelatedTargetResolver.svelte';
    import { usePostHistoryQuotePreviews } from '../lib/hooks/usePostHistoryQuotePreviews.svelte';
    import { createSensitivePayloadBodyLoader } from '../lib/sensitiveContentPayloadReader';
    import { verifyRelatedEvent } from '../lib/relatedEventVerification';
    import { repostTargetToPost } from '../lib/postRepostUtils';
    import { shortenMiddle } from '../lib/utils/textDisplayUtils';
    import { getPostHistoryAuthoredRelayScopeKey } from '../lib/postHistoryRelayResolver';
    import type { FullscreenMediaItem, ProfileData, RelayConfig } from '../lib/types';
    import type { PostHistoryRecord } from '../lib/storage/ehagakiDb';
    import type { PostHistoryInboundInteractionsSyncRequest } from '../lib/postHistoryInboundInteractionsSyncService';

    interface Props extends NotificationDialogProps {
        presentationReady?: boolean;
        onInitialReady?: () => void;
    }
    let { show = $bindable(false), pubkeyHex, rxNostr, relayConfig, returnFocus = null,
        onClose, onReplyPost, onReactionPost, onOpenTarget, reconcileDirectReplyCandidates, onQuotePost, onRepostPost, repostPending, repostSaveFailure, onRetryRepostSave, presentationReady = false, onInitialReady }: Props = $props();
    let listElement = $state<HTMLElement | null>(null);
    const viewport = useNotificationViewport(() => listElement, () => show && visible && !invalidated);
    let records = $state.raw<NotificationRecord[]>([]);
    let limit = $state(100), localMore = $state(false), exhausted = $state(false);
    let loaded = $state(false), busy = $state(false), failed = $state(false), visible = $state(false);
    let invalidated = $state(false), profiles = $state.raw<Record<string, ProfileData>>({});
    let media = $state.raw<FullscreenMediaItem[]>([]), mediaIndex = $state(-1);
    let task: ReturnType<typeof syncNotifications> | null = null;
    let generation = $state(0);
    let listRevision = $state(0), localReadFailed = $state(false);
    const interactions = useNotificationPostInteractions(() => ({ show, pubkeyHex, rxNostr, relayConfig, onClose,
        onReplyPost: post => apply(post, false), onReactionPost: post => apply(post, true),
        onQuotePost: post => { const applied = onQuotePost?.(post) ?? false; if (applied) close(); return applied; },
        onRepostPost, repostPending }), () => show && visible && !invalidated);
    function openNotificationTarget(eventId: string) {
        const record = records.find(item => item.eventId === eventId);
        if (!record || !onOpenTarget) return;
        const post = repostTargetToPost(record.event, record.relayUrls);
        if (close()) onOpenTarget(post);
    }
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
    $effect(() => { if (listElement) viewport.observe(listElement); });
    $effect.pre(() => { notificationGroups; listElement; untrack(() => viewport.preserve()); });
    const posts = $derived(records.filter(record => [1, 42, 1111].includes(record.event.kind))
        .map(record => repostTargetToPost(record.event, record.relayUrls)));
    const quotes = usePostHistoryQuotePreviews({ getShow: () => show && !invalidated, getPosts: () => posts,
        getRxNostr: () => rxNostr, getRelayConfig: () => relayConfig, profileSyncCoordinator: profileSync, relatedTargetResolver: resolver });

    export function invalidateSession() {
        viewport.reset(); invalidated = true; generation++; task?.cancel(); task = null; busy = false;
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
    $effect(() => { if (!show || !visible || invalidated) untrack(() => viewport.reset()); });
    onMount(() => {
        const sync = () => { visible = document.visibilityState === 'visible'; };
        sync(); document.addEventListener('visibilitychange', sync);
        return () => document.removeEventListener('visibilitychange', sync);
    });
    $effect(() => {
        const owner = pubkeyHex, pageSize = limit;
        listRevision;
        if (!show || !owner || invalidated) return;
        let active = true, readVersion = 0;
        const subscription = liveQuery(() => notificationRepository.list(owner, pageSize + 1)).subscribe({
            next: value => {
                if (!active) return;
                const version = ++readVersion;
                const owned = () => active && version === readVersion;
                const apply = () => { if (owned()) { localReadFailed = false; records = value.slice(0, pageSize); localMore = value.length > pageSize; loaded = true; } };
                const anchors = viewport.visibleSourceIds();
                if (value.length > pageSize && anchors.length && !anchors.every(id => value.slice(0, pageSize).some(item => item.eventId === id))) {
                    const oldestAnchor = records.filter(item => anchors.includes(item.eventId)).at(-1)?.eventId ?? anchors.at(-1)!;
                    void notificationRepository.requiredLimitForEvent(owner, oldestAnchor).then(required => {
                        if (!owned()) return;
                        if (required && required > pageSize) limit = Math.max(limit, required);
                        else apply();
                    }).catch(() => { if (owned()) { failed = true; apply(); } });
                } else apply();
            },
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
        const reference = notificationTargetReference(record);
        return reference ? { targetEventId: reference.eventId, authorHint: reference.authorHint,
            authorHints: reference.authorHints, targetKindHint: reference.targetKindHint,
            excludedKinds: reference.excludedKinds,
            relayHints: [...reference.relayHints, ...record.relayUrls], relationKind: 'notification',
            scopeKey: 'notifications', sourceEventId: record.eventId } : null;
    }
    function groupDescriptor(group: NotificationGroup): RelatedTargetDescriptor | null {
        const value = descriptor(group.record);
        if (!value) return null;
        return { ...value, relayHints: [...new Set([...group.reactions, ...group.reposts].flatMap(record => descriptor(record)?.relayHints ?? []))] };
    }
    function targetSnapshot(record: NotificationRecord) {
        const reference = notificationTargetReference(record);
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
    async function refresh(older = false) {
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

    <PostRepostFeedback result={null} saveFailure={repostSaveFailure} pending={repostPending} onRetrySave={onRetryRepostSave} />
    <div class="notification-list" bind:this={listElement} aria-busy={busy}>
        {#if loaded && !records.length}<p>{$_('notifications.empty')}</p>{/if}
        {#each notificationGroups as group (group.id)}
            {@const record = group.record}
            {@const type = notificationType(record.event)}
            <article class="notification-entry" data-notification-id={group.id} data-notification-target={group.targetId} data-notification-events={JSON.stringify([...group.reactions, ...group.reposts].length ? [...group.reactions, ...group.reposts].map(item => item.eventId) : [record.eventId])}>
                {#if type === 'reaction' || type === 'repost'}
                    {#if group.reposts.length}
                        <div class="notification-actor">
                            <svelte:element this={group.reposts.length === 1 ? 'button' : 'div'}
                                type={group.reposts.length === 1 ? 'button' : undefined} role={group.reposts.length === 1 ? 'button' : undefined}
                                data-notification-event={group.reposts.length === 1 ? group.reposts[0].eventId : undefined}
                                class="notification-repost-chip post-preview-reaction-chip"
                                onclick={group.reposts.length === 1 ? () => openNotificationTarget(group.reposts[0].eventId) : undefined}>
                                <span class="notification-kind-icon notification-repost-icon svg-icon" role="img" aria-label={$_('notifications.repost')}></span>
                                <div class="post-preview-reaction-actors">
                                    {#each group.reposts as repost (repost.eventId)}
                                        {@const label = profiles[repost.event.pubkey]?.displayName || profiles[repost.event.pubkey]?.name || shortenMiddle(repost.event.pubkey, 12, 4)}
                                        <svelte:element this={group.reposts.length > 1 ? 'button' : 'span'}
                                            type={group.reposts.length > 1 ? 'button' : undefined} role={group.reposts.length > 1 ? 'button' : undefined}
                                            data-notification-event={repost.eventId} class="notification-reposter post-preview-reaction-actor" title={label} aria-label={label}
                                            onclick={group.reposts.length > 1 ? () => openNotificationTarget(repost.eventId) : undefined}>
                                            <ProfileAvatar pubkeyHex={repost.event.pubkey} displayName={profiles[repost.event.pubkey]?.displayName}
                                                src={profiles[repost.event.pubkey]?.picture} alt={label} rootClassName="notification-avatar"
                                                imageClassName="notification-avatar-image" fallbackDelayMs={0} />
                                        </svelte:element>
                                    {/each}
                                </div>
                                {#if group.reposts.length === 1}
                                    {@const repost = group.reposts[0]}
                                    <span class="notification-repost-name" title={profiles[repost.event.pubkey]?.displayName || profiles[repost.event.pubkey]?.name}>{profiles[repost.event.pubkey]?.displayName || profiles[repost.event.pubkey]?.name || shortenMiddle(repost.event.pubkey, 12, 4)}</span>
                                {/if}
                            </svelte:element>
                        </div>
                    {/if}
                    {#if group.reactions.length}
                        <div class="notification-reaction">
                            <PostHistoryReactionDetails readModel={reactionModel(group.reactions)} onSelectActor={openNotificationTarget} showSingleActorName={group.reactions.length === 1}
                                emojiLoadStateByUrl={reactionEmoji.emojiLoadStateByUrl} emojiImageMetaByUrl={reactionEmoji.emojiImageMetaByUrl} />
                        </div>
                    {/if}
                    {@const target = groupDescriptor(group)}
                    {@const snapshot = targetSnapshot(record)}
                    {#if snapshot?.event}
                        <NotificationPost plain={true} relayUrls={snapshot.relayHints} event={snapshot.event} profile={snapshot.profile} onImageOpen={openImage}
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
                        <div class="notification-reply-label">
                            <span class="notification-kind-icon notification-reply-icon svg-icon" aria-hidden="true"></span>
                            <span>{$_('notifications.reply')}</span>
                        </div>
                    {:else if type === 'mention'}
                        <div class="notification-reply-label">
                            <span class="notification-kind-icon notification-mention-icon svg-icon" style:mask-image={`url("${resolveAppAssetUrl('icons/alternate_email_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg')}")`} aria-hidden="true"></span>
                            <span>{$_('notifications.mention')}</span>
                        </div>
                    {:else if type === 'quote'}
                        <div class="notification-reply-label">
                            <span class="notification-kind-icon notification-quote-icon svg-icon" style:mask-image={`url("${resolveAppAssetUrl('icons/format_quote_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg')}")`} aria-hidden="true"></span>
                            <span>{$_('notifications.quote')}</span>
                        </div>
                    {:else}
                        <span class="notification-type">{$_(`notifications.${type}`)}</span>
                    {/if}
                    <NotificationPost plain={true} event={record.event} profile={profiles[record.event.pubkey]} relayUrls={record.relayUrls} loadSensitiveBody={sensitiveBody(record.event, record.relayUrls)}
                        onImageOpen={openImage} />
                    {#each quotes.getQuotePreviews(repostTargetToPost(record.event, record.relayUrls)) as preview (preview.eventId)}
                        {#if preview.status === 'resolved'}
                            <NotificationPost relayUrls={preview.relayHints} event={preview.event} profile={preview.profile} onImageOpen={openImage}
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
    .notification-list { width: 100%; display: grid; min-width: 0; overflow-wrap: anywhere; }
    .notification-entry { display: grid; min-width: 0; gap: 6px; padding-block: 8px; border-bottom: 1px solid var(--border-hr); }
    .notification-entry :global(.notification-post), .notification-entry :global(.post-history-quote-status-card), .notification-target-placeholder { margin-inline-start: 16px; }
    .notification-type { font-size: .85rem; opacity: .8; }
    .notification-reply-label { display: inline-flex; justify-self: start; align-items: center; gap: 6px; height: 34px; box-sizing: border-box; padding: 4px 8px; border-radius: 18px; background: color-mix(in srgb, var(--btn-bg), transparent 40%); }
    .notification-entry :global(.post-preview-reaction-chip) { height: 34px; min-height: 34px; box-sizing: border-box; }
    .notification-repost-chip { max-width: 100%; min-width: 0; font: inherit; }
    .notification-reposter { padding: 0; min-height: 0; border: 0; background: transparent; color: inherit; }
    button.notification-repost-chip > .post-preview-reaction-actors { flex-shrink: 0; }
    .notification-repost-name { min-width: 0; max-inline-size: 16ch; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .notification-actor { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
    .notification-reaction { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
    .notification-reaction :global(.post-preview-reactions-panel) { padding: 0; }
    .notification-actor :global(.notification-avatar) {
        display: block;
        width: 100%;
        height: 100%;
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
    .notification-reply-label .notification-kind-icon { --icon-size: 26px; width: 26px; height: 26px; flex-basis: 26px; }
    .notification-repost-icon { mask-image: url('/icons/repost.svg'); }
    .notification-reply-icon { mask-image: url('/icons/chat_bubble_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg'); }
</style>
