<script lang="ts">
    import { onDestroy, onMount, tick, untrack } from 'svelte';
    import { SvelteMap } from 'svelte/reactivity';
    import { resolveAppAssetUrl } from '../lib/appAssetUrl';
    import { useNotificationViewport } from '../lib/hooks/useNotificationViewport.svelte';
    import { useNotificationRendering } from '../lib/hooks/useNotificationRendering.svelte';
    import { observeListEnd } from '../lib/listEdgeObserver';
    import { createNotificationTargetQueue } from '../lib/notificationTargetQueue';
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
    import { buildPostHistoryReactionReadModel, type PostHistoryReactionReadModel } from '../lib/postHistoryReactionReadModel';
    import { usePostHistoryEmojiState } from '../lib/hooks/usePostHistoryEmojiState.svelte';
    import { usePostHistoryPreviewCollapse } from '../lib/hooks/usePostHistoryPreviewCollapse.svelte';
    import { notificationRepository, type NotificationRecord } from '../lib/storage/notificationRepository';
    import { notificationType } from '../lib/notification';
    import { postHistoryReplyParentTargetDiscoveryAdapter } from '../lib/postHistoryRelatedTargetDiscoveryAdapter';
    import { buildThreadGraphNode } from '../lib/postHistoryThreadGraphUtils';
    import { groupNotifications, notificationGroupSourceIds, notificationTargetReference, reuseNotificationRecords, shareNotificationGroups, type NotificationGroup } from '../lib/notificationGrouping';
    import { syncNotifications } from '../lib/notificationSyncService';
    import { createPostHistoryProfileSyncCoordinator } from '../lib/postHistoryProfileSync';
    import { createPostHistoryRelatedTargetResolver, type RelatedTargetDescriptor } from '../lib/postHistoryRelatedTargetResolver.svelte';
    import { usePostHistoryQuotePreviews } from '../lib/hooks/usePostHistoryQuotePreviews.svelte';
    import { createSensitiveBodyLoaderCache } from '../lib/sensitiveBodyLoaderCache';
    import { shareStructure } from '../lib/utils/structuralSharing';
    import type { PostHistoryRelatedTargetSnapshot } from '../lib/postHistoryRelatedTargetResolver.svelte';
    import { verifyRelatedEvent } from '../lib/relatedEventVerification';
    import { repostTargetToPost } from '../lib/postRepostUtils';
    import { shortenMiddle } from '../lib/utils/textDisplayUtils';
    import { getPostHistoryAuthoredRelayScopeKey } from '../lib/postHistoryRelayResolver';
    import type { FullscreenMediaItem, NostrEvent, ProfileData } from '../lib/types';
    import type { PostHistoryRecord } from '../lib/storage/ehagakiDb';

    interface Props extends NotificationDialogProps {
        presentationReady?: boolean;
        onInitialReady?: () => void;
    }
    let { show = $bindable(false), pubkeyHex, rxNostr, relayConfig,
        onClose, onReplyPost, onReactionPost, onOpenTarget, reconcileDirectReplyCandidates, onQuotePost, onRepostPost, repostPending, repostSaveFailure, onRetryRepostSave, presentationReady = false, onInitialReady }: Props = $props();
    let listElement = $state<HTMLElement | null>(null);
    const replyTargetPrefix = $props.id();
    let expandedReplyTargets = $state<Record<string, boolean>>({});
    const viewport = useNotificationViewport(() => listElement, () => show && visible && !invalidated);
    let records = $state.raw<NotificationRecord[]>([]);
    let limit = $state(100), localMore = $state(false), exhausted = $state(false);
    let appliedLimit = $state(0);
    let loaded = $state(false), busy = $state(false), failed = $state(false), visible = $state(false);
    let retryOlder = $state(false);
    let invalidated = $state(false);
    // Keyed reactivity: a profile arriving re-renders only the cards showing that author.
    const profiles = new SvelteMap<string, ProfileData>();
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
    const reactionInput = (items: NotificationRecord[]) => items.map(({ event }) => ({ eventId: event.id, authorPubkey: event.pubkey,
        kind: event.kind, content: event.content, tags: event.tags, createdAt: event.created_at }));
    const reactionModelByGroup = new WeakMap<NotificationGroup, PostHistoryReactionReadModel>();
    /** Unchanged data keeps the previous model, so the reaction details are left alone. */
    function reactionModel(group: NotificationGroup) {
        const model = shareStructure(reactionModelByGroup.get(group), buildPostHistoryReactionReadModel(reactionInput(group.reactions), profiles));
        reactionModelByGroup.set(group, model);
        return model;
    }
    const reactionEmojiUrlsByGroup = new WeakMap<NotificationGroup, string[]>();
    function reactionEmojiUrls(group: NotificationGroup) {
        let urls = reactionEmojiUrlsByGroup.get(group);
        if (!urls) {
            urls = buildPostHistoryReactionReadModel(reactionInput(group.reactions)).groups.flatMap(item => item.emojiUrl ? [item.emojiUrl] : []);
            reactionEmojiUrlsByGroup.set(group, urls);
        }
        return urls;
    }
    const profileSync = createPostHistoryProfileSyncCoordinator({ getShow: () => show && visible && !invalidated, getRxNostr: () => rxNostr });
    const unsubscribeProfile = profileSync.subscribe((key, profile) => { if (profiles.get(key) !== profile) profiles.set(key, profile); });
    const resolver = createNotificationTargetQueue(createPostHistoryRelatedTargetResolver({ getShow: () => show && visible && !invalidated,
        getOwner: () => pubkeyHex,
        getRxNostr: () => rxNostr, getRelayConfig: () => relayConfig, profileSyncCoordinator: profileSync, notificationPreviews: true }), () => show && visible && !invalidated);
    let previousGroups: NotificationGroup[] = [];
    const notificationGroups = $derived.by(() => previousGroups = shareNotificationGroups(previousGroups,
        groupNotifications(records, id => resolver.getTargetSnapshot(id)?.event ?? null)));
    const rendering = useNotificationRendering(() => notificationGroups);
    const scrollRoot = $derived(listElement?.closest<HTMLElement>('.dialog-content') ?? null);
    const canAutoLoad = $derived(show && visible && presentationReady && !invalidated && mediaIndex < 0);
    const readingLocalPage = $derived(loaded && appliedLimit !== limit && !localReadFailed);

    function loadLocalPage() {
        if (!localMore || localReadFailed || appliedLimit !== limit) return false;
        limit += 100;
        return true;
    }

    function loadMore() {
        if (failed || localReadFailed) void refresh(retryOlder);
        else if (localMore) loadLocalPage();
        else void refresh(true);
    }
    // One collapse measurement and one emoji state for the whole list, as in post history.
    const previewCollapse = usePostHistoryPreviewCollapse<{ eventId: string; content: string }>({ getShow: () => show && !invalidated,
        getPosts: () => Object.values(interactions.previews), getContainer: () => listElement });
    // A string key, so a card mounting with already known emoji does not restart the loads.
    const emojiUrlKey = $derived([...new Set([
        ...rendering.cards.flatMap(({ group }) => reactionEmojiUrls(group)),
        ...Object.values(interactions.previews).flatMap(entry => entry.emojiUrls),
    ])].join('\n'));
    const emojiUrls = $derived(emojiUrlKey ? emojiUrlKey.split('\n') : []);
    const emoji = usePostHistoryEmojiState({ getShow: () => show && !invalidated, getEmojiUrls: () => emojiUrls,
        onStateChanged: () => previewCollapse.remeasure() });
    interactions.setPreviewSupport({ previewRef: previewCollapse.previewRef, isPostExpanded: previewCollapse.isPostExpanded,
        shouldCollapsePost: previewCollapse.shouldCollapsePost, togglePostExpanded: previewCollapse.togglePostExpanded,
        get emojiLoadStateByUrl() { return emoji.emojiLoadStateByUrl; }, get emojiImageMetaByUrl() { return emoji.emojiImageMetaByUrl; } });
    let previousPreparedRecords: NotificationRecord[] = [];
    const preparedRecords = $derived.by(() => {
        const ids = new Set(rendering.cards.flatMap(({ group }) => notificationGroupSourceIds(group)));
        const next = records.filter(record => ids.has(record.eventId));
        if (next.length !== previousPreparedRecords.length || next.some((record, index) => record !== previousPreparedRecords[index])) previousPreparedRecords = next;
        return previousPreparedRecords;
    });
    $effect(() => { if (listElement) viewport.observe(listElement); });
    $effect.pre(() => { notificationGroups; listElement; untrack(() => viewport.preserve()); });
    const postByRecord = new WeakMap<NotificationRecord, PostHistoryRecord>();
    function recordPost(record: NotificationRecord) {
        let post = postByRecord.get(record);
        if (!post) { post = repostTargetToPost(record.event, record.relayUrls); postByRecord.set(record, post); }
        return post;
    }
    let previousPosts: PostHistoryRecord[] = [];
    const posts = $derived.by(() => {
        const next = preparedRecords.filter(record => [1, 42, 1111].includes(record.event.kind)).map(recordPost);
        if (next.length !== previousPosts.length || next.some((post, index) => post !== previousPosts[index])) previousPosts = next;
        return previousPosts;
    });
    const quotes = usePostHistoryQuotePreviews({ getShow: () => show && visible && !invalidated, getPosts: () => posts,
        getRxNostr: () => rxNostr, getRelayConfig: () => relayConfig, profileSyncCoordinator: profileSync, relatedTargetResolver: resolver });

    export function invalidateSession() {
        viewport.reset(); invalidated = true; rendering.reset(); generation++; task?.cancel(); task = null; busy = false;
        records = []; profiles.clear(); media = []; mediaIndex = -1; sensitiveBodies.clear();
        expandedReplyTargets = {};
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
        const ownsPage = () => active && show && !invalidated && pubkeyHex === owner && limit === pageSize;
        const subscription = liveQuery(() => notificationRepository.list(owner, pageSize + 1)).subscribe({
            next: value => {
                if (!ownsPage()) return;
                const version = ++readVersion;
                const owned = () => ownsPage() && version === readVersion;
                const page = value.slice(0, pageSize);
                // Unchanged records keep their objects, so a read-state write re-renders nothing.
                const apply = () => {
                    if (!owned()) return;
                    localReadFailed = false;
                    records = reuseNotificationRecords(records, page);
                    localMore = value.length > pageSize;
                    appliedLimit = pageSize;
                    loaded = true;
                };
                const anchors = value.length > pageSize ? viewport.visibleSourceIds() : [];
                const pageIds = anchors.length ? new Set(page.map(item => item.eventId)) : null;
                if (pageIds && !anchors.every(id => pageIds.has(id))) {
                    const oldestAnchor = records.filter(item => anchors.includes(item.eventId)).at(-1)?.eventId ?? anchors.at(-1)!;
                    void notificationRepository.requiredLimitForEvent(owner, oldestAnchor).then(required => {
                        if (!owned()) return;
                        if (required && required > pageSize) limit = Math.max(limit, required);
                        else apply();
                    }).catch(() => { if (owned()) { failed = true; apply(); } });
                } else apply();
            },
            error: () => {
                if (ownsPage()) {
                    localReadFailed = true; failed = true; loaded = true;
                }
            },
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
        if (!show || !visible || invalidated) return;
        for (const record of preparedRecords) profileSync.ensureProfile(record.event.pubkey, record.relayUrls);
    });
    function descriptor(record: NotificationRecord): RelatedTargetDescriptor | null {
        const reference = notificationTargetReference(record);
        return reference ? { targetEventId: reference.eventId, authorHint: reference.authorHint,
            authorHints: reference.authorHints, targetKindHint: reference.targetKindHint,
            excludedKinds: reference.excludedKinds,
            relayHints: [...reference.relayHints, ...record.relayUrls], relationKind: 'notification',
            scopeKey: 'notifications', sourceEventId: record.eventId } : null;
    }
    const replyParentByRecord = new WeakMap<NotificationRecord, RelatedTargetDescriptor | null>();
    function replyParentDescriptor(record: NotificationRecord): RelatedTargetDescriptor | null {
        if (replyParentByRecord.has(record)) return replyParentByRecord.get(record)!;
        const node = buildThreadGraphNode({ event: record.event, relayUrls: record.relayUrls, sources: ['inbound-sync'] });
        const context = postHistoryReplyParentTargetDiscoveryAdapter.buildContext(recordPost(record), record.eventId, node);
        const result = context ? postHistoryReplyParentTargetDiscoveryAdapter.toDescriptor(context, 'notification-reply-parents') : null;
        replyParentByRecord.set(record, result);
        return result;
    }
    function toggleReplyParent(record: NotificationRecord) {
        if (!show || invalidated) return;
        const target = replyParentDescriptor(record);
        if (!target) return;
        const expanded = !expandedReplyTargets[record.eventId];
        expandedReplyTargets = { ...expandedReplyTargets, [record.eventId]: expanded };
        if (expanded) void resolver.ensureTarget(target);
    }
    const groupDescriptorByGroup = new WeakMap<NotificationGroup, RelatedTargetDescriptor | null>();
    function groupDescriptor(group: NotificationGroup): RelatedTargetDescriptor | null {
        if (groupDescriptorByGroup.has(group)) return groupDescriptorByGroup.get(group)!;
        const value = descriptor(group.record);
        const result = value ? { ...value, relayHints: [...new Set([...group.reactions, ...group.reposts].flatMap(record => descriptor(record)?.relayHints ?? []))] } : null;
        groupDescriptorByGroup.set(group, result);
        return result;
    }
    // Verification hashes the event, so its outcome is kept per snapshot and record.
    const checkedSnapshots = new WeakMap<PostHistoryRelatedTargetSnapshot, WeakMap<NotificationRecord, PostHistoryRelatedTargetSnapshot>>();
    function targetSnapshot(record: NotificationRecord) {
        const reference = notificationTargetReference(record);
        const snapshot = reference ? resolver.getTargetSnapshot(reference.eventId) : null;
        if (!snapshot?.event || !reference) return snapshot;
        let byRecord = checkedSnapshots.get(snapshot);
        const cached = byRecord?.get(record);
        if (cached) return cached;
        const kindValid = record.event.kind === 6 ? snapshot.event.kind === 1
            : record.event.kind === 16 ? snapshot.event.kind !== 1 : true;
        const result = kindValid && verifyRelatedEvent(snapshot.event, reference) ? snapshot : { ...snapshot, event: null, status: 'error' as const };
        if (!byRecord) { byRecord = new WeakMap(); checkedSnapshots.set(snapshot, byRecord); }
        byRecord.set(record, result);
        return result;
    }
    const sourceIdsJsonByGroup = new WeakMap<NotificationGroup, string>();
    function sourceIdsJson(group: NotificationGroup) {
        let value = sourceIdsJsonByGroup.get(group);
        if (value === undefined) { value = JSON.stringify(notificationGroupSourceIds(group)); sourceIdsJsonByGroup.set(group, value); }
        return value;
    }
    const typeByEvent = new WeakMap<NostrEvent, ReturnType<typeof notificationType>>();
    function recordType(record: NotificationRecord) {
        let value = typeByEvent.get(record.event);
        if (value === undefined) { value = notificationType(record.event); typeByEvent.set(record.event, value); }
        return value;
    }
    $effect(() => {
        if (!show || !visible || invalidated) return;
        preparedRecords;
        // The rendered cards already hold the groups of these records.
        const targets = untrack(() => rendering.cards.map(card => card.group).flatMap(group => {
            const record = group.record;
            if (![6, 7, 16].includes(record.event.kind)) return [];
            const value = groupDescriptor(group);
            if (value && resolver.getTargetSnapshot(value.targetEventId)?.event && targetSnapshot(record)?.status === 'error') return [];
            return value ? [value] : [];
        }));
        let active = true;
        const byTarget = new Map<string, RelatedTargetDescriptor[]>();
        for (const target of targets) byTarget.set(target.targetEventId, [...(byTarget.get(target.targetEventId) ?? []), target]);
        untrack(() => {
            void Promise.all([...byTarget.values()].map(async candidates => {
                let result = await resolver.ensureTarget(candidates[0]);
                for (const candidate of candidates.slice(1)) {
                    if (!active || result?.status !== 'error' || result.errorCode !== 'invalid_event') break;
                    result = await resolver.retryTarget(candidate);
                }
            }));
        });
        return () => { active = false; };
    });
    async function refresh(older = false) {
        if (localReadFailed) { localReadFailed = false; listRevision++; }
        if (busy || !show || !visible || invalidated || !pubkeyHex || !rxNostr) return;
        const epoch = generation, owner = pubkeyHex, runtime = rxNostr;
        const scope = getPostHistoryAuthoredRelayScopeKey(relayConfig);
        const owned = () => show && visible && !invalidated && epoch === generation && owner === pubkeyHex
            && runtime === rxNostr && scope === getPostHistoryAuthoredRelayScopeKey(relayConfig);
        busy = true; failed = false; retryOlder = older;
        const current = syncNotifications(runtime, { ownerPubkeyHex: owner, relayConfig, older,
            reconcileDirectReplyCandidates, isActive: owned });
        task = current;
        try {
            const result = await current.promise;
            if (!owned()) return;
            // Successful saturated pages continue through "more", using the saved pending interval.
            failed = !!result && result.status !== 'success';
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
        return () => { generation++; task?.cancel(); task = null; busy = false; expandedReplyTargets = {}; resolver.reset(); profileSync.reset(); };
    });
    async function apply(post: PostHistoryRecord, reaction: boolean) {
        const epoch = generation;
        const applied = await (reaction ? onReactionPost(post) : onReplyPost(post));
        if (applied && epoch === generation && !invalidated) close();
        return applied;
    }
    const sensitiveBodies = createSensitiveBodyLoaderCache();
    function sensitiveBody(structure: NostrEvent, relayHints: string[] = []) {
        return sensitiveBodies.get(structure, { ownerPubkey: pubkeyHex, rxNostr, relayConfig }, relayHints);
    }
    function openImage(value: { index: number; mediaList: FullscreenMediaItem[] }) { media = value.mediaList; mediaIndex = value.index; }
    onDestroy(() => { invalidateSession(); unsubscribeProfile(); profileSync.dispose(); });
</script>

    <PostRepostFeedback result={null} saveFailure={repostSaveFailure} pending={repostPending} onRetrySave={onRetryRepostSave} />
    <div class="notification-list" bind:this={listElement} aria-busy={busy}>
        {#if loaded && !busy && !failed && !localReadFailed && !records.length}<p>{$_('notifications.empty')}</p>{/if}
        {#each rendering.cards as card (card.key)}
            {@const group = card.group}
            {@const record = group.record}
            {@const type = recordType(record)}
            <article class="notification-entry" data-notification-id={group.id} data-notification-target={group.targetId} data-notification-events={sourceIdsJson(group)}>
                {#if type === 'reaction' || type === 'repost'}
                    {#if group.reposts.length}
                        <div class="notification-actor">
                            <svelte:element this={group.reposts.length === 1 ? 'button' : 'div'}
                                type={group.reposts.length === 1 ? 'button' : undefined} role={group.reposts.length === 1 ? 'button' : undefined}
                                data-notification-event={group.reposts.length === 1 ? group.reposts[0].eventId : undefined}
                                class="notification-repost-chip post-preview-reaction-chip"
                                onclick={group.reposts.length === 1 ? () => openNotificationTarget(group.reposts[0].eventId) : undefined}>
                                <span class="notification-kind-icon notification-repost-icon svg-icon" role="img" aria-label={$_('notifications.repost')}></span>
                                {#if group.reposts.length > 1}
                                    <span class="post-preview-reaction-count">{group.reposts.length}</span>
                                {/if}
                                <div class="post-preview-reaction-actors">
                                    {#each group.reposts as repost (repost.eventId)}
                                        {@const reposter = profiles.get(repost.event.pubkey)}
                                        {@const label = reposter?.displayName || reposter?.name || shortenMiddle(repost.event.pubkey, 12, 4)}
                                        <svelte:element this={group.reposts.length > 1 ? 'button' : 'span'}
                                            type={group.reposts.length > 1 ? 'button' : undefined} role={group.reposts.length > 1 ? 'button' : undefined}
                                            data-notification-event={repost.eventId} class="notification-reposter post-preview-reaction-actor" title={label} aria-label={label}
                                            onclick={group.reposts.length > 1 ? () => openNotificationTarget(repost.eventId) : undefined}>
                                            <ProfileAvatar pubkeyHex={repost.event.pubkey} displayName={reposter?.displayName}
                                                src={reposter?.picture} alt={label} rootClassName="notification-avatar"
                                                imageClassName="notification-avatar-image" fallbackDelayMs={0} />
                                        </svelte:element>
                                    {/each}
                                </div>
                                {#if group.reposts.length === 1}
                                    {@const repost = group.reposts[0]}
                                    {@const reposter = profiles.get(repost.event.pubkey)}
                                    <span class="notification-repost-name" title={reposter?.displayName || reposter?.name}>{reposter?.displayName || reposter?.name || shortenMiddle(repost.event.pubkey, 12, 4)}</span>
                                {/if}
                            </svelte:element>
                        </div>
                    {/if}
                    {#if group.reactions.length}
                        <div class="notification-reaction">
                            <PostHistoryReactionDetails readModel={reactionModel(group)} onSelectActor={openNotificationTarget} showSingleActorName={group.reactions.length === 1}
                                emojiLoadStateByUrl={emoji.emojiLoadStateByUrl} emojiImageMetaByUrl={emoji.emojiImageMetaByUrl} />
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
                    {#if type === 'reply' && expandedReplyTargets[record.eventId]}
                        {@const parent = replyParentDescriptor(record)}
                        {@const snapshot = parent ? resolver.getTargetSnapshot(parent.targetEventId, parent) : null}
                        <div class="notification-reply-parent" id={`${replyTargetPrefix}-${record.eventId}`}>
                            {#if snapshot?.status === 'resolved' && snapshot.event}
                                <NotificationPost event={snapshot.event} profile={snapshot.profile} relayUrls={snapshot.relayHints}
                                    loadSensitiveBody={sensitiveBody(snapshot.event, snapshot.relayHints)} onImageOpen={openImage} />
                            {:else if snapshot?.status === 'deleted'}
                                <p role="status">{$_('postHistory.replyTargetDeleted')}</p>
                            {:else if snapshot?.status === 'not-found' || snapshot?.status === 'error'}
                                <p role="status">{$_(snapshot.status === 'not-found' ? 'postHistory.contextNotFound' : 'postHistory.contextFetchFailed')}</p>
                                {#if parent}<Button className="notification-reply-retry" variant="default" shape="pill" onClick={() => resolver.retryTarget(parent)}>{$_('postHistory.contextRetry')}</Button>{/if}
                            {:else}
                                <p role="status">{$_('postHistory.contextLoading')}</p>
                            {/if}
                        </div>
                    {/if}
                    {#if type === 'reply'}
                        <button type="button" class="notification-reply-label notification-reply-toggle"
                            aria-expanded={!!expandedReplyTargets[record.eventId]} aria-controls={`${replyTargetPrefix}-${record.eventId}`}
                            aria-label={$_(expandedReplyTargets[record.eventId] ? 'postHistory.hideReplyTarget' : 'postHistory.showReplyTarget')}
                            title={$_(expandedReplyTargets[record.eventId] ? 'postHistory.hideReplyTarget' : 'postHistory.showReplyTarget')}
                            onclick={() => toggleReplyParent(record)}>
                            <span class="notification-kind-icon notification-reply-icon svg-icon" aria-hidden="true"></span>
                            <span>{$_('notifications.reply')}</span>
                        </button>
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
                    <NotificationPost plain={true} event={record.event} profile={profiles.get(record.event.pubkey)} relayUrls={record.relayUrls} loadSensitiveBody={sensitiveBody(record.event, record.relayUrls)}
                        onImageOpen={openImage} />
                    {#each quotes.getQuotePreviews(recordPost(record)) as preview (preview.eventId)}
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
        {#if rendering.hasMore}
            {#if canAutoLoad}
                {#key rendering.cards.length}
                    <div class="notification-render-sentinel" aria-hidden="true"
                        {@attach node => observeListEnd(scrollRoot, node, () => canAutoLoad && rendering.renderMore())}></div>
                {/key}
            {/if}
        {:else}
            {#if canAutoLoad && localMore && !readingLocalPage && !localReadFailed}
                {#key appliedLimit}
                    <div class="notification-local-sentinel" aria-hidden="true"
                        {@attach node => observeListEnd(scrollRoot, node, () => canAutoLoad && !rendering.hasMore && loadLocalPage())}></div>
                {/key}
            {/if}
            {#if failed || localReadFailed || localMore || !exhausted}
                <Button className="notification-load-more" variant="default" shape="pill" disabled={busy || readingLocalPage} onClick={loadMore}>{$_('notifications.more')}</Button>
            {/if}
        {/if}
    </div>

{#if mediaIndex >= 0}
    <ImageFullscreen show={true} mediaList={media} currentIndex={mediaIndex} onNavigate={(index) => mediaIndex = index} onClose={() => mediaIndex = -1} />
{/if}

<style>
    .notification-target-placeholder { height: 100px; border-radius: 4px; background: var(--text); opacity: .05; }
    .notification-list { width: 100%; display: grid; min-width: 0; overflow-wrap: anywhere; }
    .notification-render-sentinel, .notification-local-sentinel { height: 1px; }
    .notification-list :global(.notification-load-more) { margin-top: 8px; }
    .notification-entry { display: grid; min-width: 0; gap: 6px; padding-block: 8px; border-bottom: 1px solid var(--border-hr); }
    .notification-entry :global(.notification-post), .notification-entry :global(.post-history-quote-status-card), .notification-target-placeholder { margin-inline-start: 16px; }
    .notification-type { font-size: .85rem; opacity: .8; }
    .notification-reply-toggle { font: inherit; color: inherit; border: 0; }
    .notification-reply-parent { display: grid; gap: 6px; min-width: 0; margin-inline-start: 16px; }
    .notification-reply-parent p { margin: 0; }
    .notification-reply-parent :global(.notification-reply-retry) { height: 36px; justify-self: start; }
    .notification-reply-parent :global(.notification-post) { margin-inline-start: 0; }
    .notification-reply-label { display: inline-flex; justify-self: start; align-items: center; gap: 6px; height: 34px; box-sizing: border-box; padding: 4px 8px; border-radius: 18px; background: color-mix(in srgb, var(--btn-bg), transparent 40%); }
    .notification-entry :global(.post-preview-reaction-chip) { height: 34px; min-height: 34px; box-sizing: border-box; }
    .notification-repost-chip { max-width: 100%; min-width: 0; font: inherit; }
    .notification-reposter { padding: 0; min-height: 0; border: 0; background: transparent; color: inherit; }
    button.notification-repost-chip > .post-preview-reaction-actors { flex-shrink: 0; }
    .notification-repost-name { min-width: 0; max-inline-size: 16ch; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .notification-actor { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
    .notification-reaction { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; min-width: 0; }
    .notification-actor + .notification-reaction { margin-top: -2px; }
    .notification-reaction :global(.post-preview-reactions-panel) { padding: 0; }
    .notification-reaction :global(.post-preview-reaction-symbol) { --icon-hover-color: rgb(249, 24, 128); --icon-selected-hover-color: rgb(249, 24, 128); }
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
    .notification-kind-icon { --icon-size: 22px; --svg: currentColor; --icon-hover-color: var(--svg); --icon-selected-hover-color: var(--svg); width: 22px; height: 22px; flex: 0 0 22px; }
    .notification-reply-label .notification-kind-icon { --icon-size: 26px; --svg: var(--accent-color); width: 26px; height: 26px; flex-basis: 26px; }
    .notification-repost-icon { --svg: var(--accent-color); mask-image: url('/icons/repost.svg'); }
    .notification-reply-icon { mask-image: url('/icons/chat_bubble_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg'); }
</style>
