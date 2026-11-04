<script lang="ts">
    import { onMount } from 'svelte';
    import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';
    import { Observable } from 'rxjs';
    import type { RxNostr } from 'rx-nostr';
    import FooterComponent from '../../components/FooterComponent.svelte';
    import ComposerTargetDialog from '../../components/ComposerTargetDialog.svelte';
    import { buildPostHistoryNevent } from '../../lib/postHistoryNevent';
    import NotificationDialog from '../../components/NotificationDialog.svelte';
    import { notificationRepository } from '../../lib/storage/notificationRepository';
    import { postHistoryVisibleRangeChildInteractionRepairService as relatedRepair } from '../../lib/postHistoryVisibleRangeChildInteractionRepairService';
    import { postHistoryChildInteractionsRepository } from '../../lib/storage/postHistoryChildInteractionsRepository';
    import { EventRepository } from '../../lib/storage/eventRepository';
    import { profilesRepository } from '../../lib/storage/profilesRepository';
    import { ehagakiDb } from '../../lib/storage/ehagakiDb';
    import { useNotifications } from '../../lib/hooks/useNotifications.svelte';
    import { usePostHistoryInboundInteractionsRealtime } from '../../lib/hooks/usePostHistoryInboundInteractionsRealtime.svelte';
    import { profileLoadedStore } from '../../stores/profileStore.svelte';
    import { footerSettingShortcutsStore } from '../../stores/footerSettingShortcutsStore.svelte';
    import type { NostrEvent } from '../../lib/types';
    import { configureAppRuntimeEnvironment } from '../../lib/appRuntimeEnvironment';

    const relatedActivity = { childReads: 0, repairs: 0 };
    const readChildren = postHistoryChildInteractionsRepository.getChildInteractionsForParents.bind(postHistoryChildInteractionsRepository);
    postHistoryChildInteractionsRepository.getChildInteractionsForParents = (...args) => { relatedActivity.childReads++; return readChildren(...args); };
    const repairChildren = relatedRepair.repairVisibleRangeChildInteractions.bind(relatedRepair);
    relatedRepair.repairVisibleRangeChildInteractions = (...args) => { relatedActivity.repairs++; return repairChildren(...args); };
    const repairReactions = relatedRepair.repairRelatedCardReactions.bind(relatedRepair);
    relatedRepair.repairRelatedCardReactions = (...args) => { relatedActivity.repairs++; return repairReactions(...args); };
    let releaseInitialList = () => {};
    const listGate = new Promise<void>(resolve => releaseInitialList = resolve);
    const listMethod = notificationRepository.list.bind(notificationRepository);
    const openingMode = new URLSearchParams(location.search).get('opening');
    if (openingMode) notificationRepository.list = async (...args) => {
        if (openingMode === 'delay') await listGate;
        if (openingMode === 'fail') throw new Error('Fixture local read failure');
        if (openingMode === 'empty') return [];
        return listMethod(...args);
    };
    const authorKey = generateSecretKey();
    const now = Math.floor(Date.now() / 1000), relay = 'wss://fixture.example/';
    const config = { [relay]: { read: true, write: false } };
    // Persist public signed fixture events only, so reloads and a second tab
    // exercise the same account without storing any fixture signing keys.
    const savedFixture = localStorage.getItem('notificationPublicFixture');
    const fixture = savedFixture ? JSON.parse(savedFixture) as { owner: string; original: NostrEvent; incoming: NostrEvent[] } : (() => {
        const ownerKey = generateSecretKey(), owner = getPublicKey(ownerKey);
        const original = finalizeEvent({ kind: 1, created_at: now - 10, tags: [], content: 'Original notification target' }, ownerKey);
        const sign = (content: string, tags: string[][], kind = 1) => finalizeEvent({ kind, content, tags, created_at: now }, authorKey);
        const incoming = [sign('A mention addressed to you', [['p', owner]]),
            sign('Quote notification text', [['p', owner], ['q', original.id, relay]]),
            sign('+', [['p', owner], ['e', original.id, relay]], 7), sign('', [['p', owner], ['e', original.id, relay]], 6)];
        const result = { owner, original, incoming };
        localStorage.setItem('notificationPublicFixture', JSON.stringify(result));
        return result;
    })();
    const { owner, original, incoming } = fixture;
    const sign = (content: string) => finalizeEvent({ kind: 1, content, tags: [['p', owner]], created_at: now + 1 }, authorKey);
    let open = $state(false), ready = $state(false), applied = $state('');
    let targetOpen = $state(false), targetInput = $state('');
    let trigger = $state<HTMLElement | null>(null);
    const requests: Array<Array<{ kinds?: number[]; ids?: string[] }>> = [];
    const runtime = { use: (req: { getReqPacketObservable: () => Observable<{ filters: Array<{ ids?: string[] }> }> }) => new Observable(observer => {
        const subscription = req.getReqPacketObservable().subscribe(({ filters }) => {
            requests.push(filters);
            queueMicrotask(() => {
                if (!new URLSearchParams(location.search).has('missing') && filters.some(filter => filter.ids?.includes(original.id))) observer.next({ event: original, from: relay });
                observer.complete();
            });
        });
        return () => subscription.unsubscribe();
    }) } as unknown as RxNostr;
    if (new URLSearchParams(location.search).has('container')) configureAppRuntimeEnvironment({ layoutMode: 'container' });
    useNotifications({ getEnabled: () => footerSettingShortcutsStore.notificationsEnabled, getOwner: () => ready ? owner : null, getRxNostr: () => runtime, getRelayConfig: () => config });
    usePostHistoryInboundInteractionsRealtime({ getIsAuthenticated: () => ready, getPubkeyHex: () => owner,
        getRxNostr: () => runtime, getRelayConfig: () => config, getNotificationsEnabled: () => footerSettingShortcutsStore.notificationsEnabled });
    $effect(() => { if (!footerSettingShortcutsStore.notificationsEnabled) open = false; });
    onMount(() => {
        document.body.classList.add('ehagaki-app-root');
        profileLoadedStore.set(true);
        document.documentElement.classList.add('light');
        if (!savedFixture) footerSettingShortcutsStore.set({ left: 'image-quality', right: 'notifications' });
        void profilesRepository.put(incoming[0]!.pubkey, {
            name: 'Fixture sender', displayName: 'Fixture sender',
            picture: 'https://profiles.example/large-avatar.png', npub: '', nprofile: '',
        }).then(() => notificationRepository.upsert(owner, incoming.map(event => ({ event, relayUrls: [relay] }))))
            .then(() => ready = true);
        Reflect.set(window, '__NOTIFICATIONS__', {
            releaseInitialList,
            seedInteractions: async () => {
                const child = finalizeEvent({ kind: 1, content: 'Shared footer child reply', tags: [['p', original.pubkey], ['e', original.id, relay, 'reply']], created_at: now + 9 }, authorKey);
                const reaction = finalizeEvent({ kind: 7, content: ':fixture:', tags: [['p', original.pubkey], ['e', original.id], ['k', '1'], ['emoji', 'fixture', 'https://profiles.example/large-avatar.png']], created_at: now + 10 }, authorKey);
                await postHistoryChildInteractionsRepository.upsertChildInteractions({ parentEventId: original.id, events: [child, reaction].map(event => ({ event, relayUrls: [relay] })),
                    reactionTarget: { eventId: original.id, targetAuthorPubkey: original.pubkey, targetKind: 1 }, fetchedAt: Date.now() });
            },
            addOlder: async (count: number) => notificationRepository.upsert(owner, Array.from({ length: count }, (_, index) => ({
                event: finalizeEvent({ kind: 1, content: `Older notification ${index}`, tags: [['p', owner]], created_at: now - index - 100 }, authorKey),
            }))),
            add: async () => notificationRepository.upsert(owner, [{ event: sign('New incoming notification') }]),
            addReply: async () => notificationRepository.upsert(owner, [{ event: finalizeEvent({ kind: 1, content: 'Reply notification text', tags: [['p', owner], ['e', original.id, relay, 'reply']], created_at: now + 1 }, authorKey) }]),
            addRepost: async () => {
                const key = generateSecretKey(), pubkey = getPublicKey(key);
                await profilesRepository.put(pubkey, { name: 'Second reposter', displayName: 'Second reposter', picture: 'https://profiles.example/second-reposter.png', npub: '', nprofile: '' });
                await notificationRepository.upsert(owner, [{ event: finalizeEvent({ kind: 6, content: '', tags: [['p', owner], ['e', original.id, relay]], created_at: now + 8 }, key) }]);
            },
            addReaction: async () => notificationRepository.upsert(owner, [{ event: finalizeEvent({ kind: 7,
                content: ':demo:', tags: [['p', owner], ['e', original.id], ['k', '1'], ['emoji', 'demo', 'https://profiles.example/large-avatar.png']],
                created_at: now + 2 }, authorKey) }]),
            addGroupedReaction: async () => notificationRepository.upsert(owner, [{ event: finalizeEvent({ kind: 7,
                content: '+', tags: [['p', owner], ['e', original.id]], created_at: now + 3 }, authorKey) }]),
            addMismatchedReaction: async () => notificationRepository.upsert(owner, [{ event: finalizeEvent({ kind: 7,
                content: '-', tags: [['p', owner], ['e', original.id], ['k', '42']], created_at: now + 4 }, authorKey) }]),
            addLongPosts: async () => {
                const lines = Array.from({ length: 24 }, (_, index) => `Long line ${index + 1}`).join('\n');
                const target = finalizeEvent({ kind: 30023, content: `LONG-ARTICLE-START\n${lines}\nLONG-ARTICLE-END`, tags: [], created_at: now }, authorKey);
                const mention = finalizeEvent({ kind: 1, content: `LONG-NOTE-START\n${lines}\nLONG-NOTE-END`, tags: [['p', owner]], created_at: now + 5 }, authorKey);
                const warning = finalizeEvent({ kind: 1, content: `LONG-CW-START\n${lines}\nLONG-CW-END`, tags: [['p', owner], ['content-warning']], created_at: now + 6 }, authorKey);
                const reaction = finalizeEvent({ kind: 7, content: '+', tags: [['p', owner], ['p', target.pubkey], ['e', target.id], ['k', '30023']], created_at: now + 7 }, generateSecretKey());
                await new EventRepository(ehagakiDb).save(target, [relay], () => true);
                await notificationRepository.upsert(owner, [mention, warning, reaction].map(event => ({ event, relayUrls: [relay] })));
            },
            addImagePosts: async () => {
                const images = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => `https://profiles.example/${prefix}-${index}.png`).join('\n');
                const target = finalizeEvent({ kind: 30023, content: `MANY-ARTICLE-IMAGES\n${images('article', 8)}`, tags: [], created_at: now }, authorKey);
                const mention = finalizeEvent({ kind: 1, content: `MANY-NOTE-IMAGES\n${images('note', 5)}`, tags: [['p', owner]], created_at: now + 5 }, authorKey);
                const reaction = finalizeEvent({ kind: 7, content: '+', tags: [['p', owner], ['p', target.pubkey], ['e', target.id], ['k', '30023']], created_at: now + 6 }, generateSecretKey());
                await new EventRepository(ehagakiDb).save(target, [relay], () => true);
                await notificationRepository.upsert(owner, [mention, reaction].map(event => ({ event, relayUrls: [relay] })));
            },
            unread: () => notificationRepository.hasUnread(owner),
            replay: () => notificationRepository.upsert(owner, incoming.map(event => ({ event }))),
            setShortcuts: (value: unknown) => footerSettingShortcutsStore.set(value),
            requests: () => requests,
            sourceEvents: async () => (await notificationRepository.list(owner, 100)).map(({ event }) => ({ id: event.id, pubkey: event.pubkey, kind: event.kind })),
            relatedActivity: () => ({ ...relatedActivity }),
            cachedChildCount: () => ehagakiDb.postHistoryChildInteractions.count(),
            storage: async () => ({ event: await ehagakiDb.events.get(original.id), notifications: await ehagakiDb.notifications.toArray() }),
            count: () => ehagakiDb.notifications.where('ownerPubkeyHex').equals(owner).count(),
        });
    });
</script>
<div class="ehagaki-app-root">
    <p data-testid="applied">{applied}</p>
    {#if ready}
        <FooterComponent isAuthenticated={true} isAuthInitialized={true} isSwitchingAccount={false} swNeedRefresh={false}
            onShowLoginDialog={() => {}} onOpenPostHistoryDialog={() => {}} onOpenSettingsDialog={() => {}} onOpenLogoutDialog={() => {}}
            onOpenNotificationDialog={(element) => { trigger = element; open = true; }} />
        {#if open}
            <NotificationDialog show={true} pubkeyHex={owner} rxNostr={runtime} relayConfig={config} returnFocus={trigger}
                onOpenTarget={post => { targetInput = buildPostHistoryNevent(post, []); targetOpen = true; }}
                onClose={() => open = false} onReplyPost={async post => { applied = `reply:${post.content}`; return true; }}
                onQuotePost={post => { applied = `quote:${post.content}`; return true; }}
                onReactionPost={async post => { applied = `reaction:${post.content}`; return true; }} />
        {/if}
        {#if targetOpen}
            <ComposerTargetDialog show={true} initialInput={targetInput} rxNostr={runtime} relayConfig={config} pubkeyHex={owner}
                onClose={() => targetOpen = false} onApply={() => true} />
        {/if}
    {/if}
</div>
