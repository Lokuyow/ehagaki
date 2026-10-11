<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { Tooltip } from 'bits-ui';
    import { finalizeEvent, generateSecretKey, getPublicKey, nip19, type EventTemplate } from 'nostr-tools';
    import { Observable, Subject, of } from 'rxjs';
    import type { RxNostr, RxReq } from 'rx-nostr';
    import PostComponent from '../../components/PostComponent.svelte';
    import KeyboardButtonBar from '../../components/KeyboardButtonBar.svelte';
    import ReactionTargetPreview from '../../components/ReactionTargetPreview.svelte';
    import ComposerTargetDialog from '../../components/ComposerTargetDialog.svelte';
    import PostHistoryDialog from '../../components/PostHistoryDialog.svelte';
    import CustomEmojiPicker from '../../components/CustomEmojiPicker.svelte';
    import { authState, setNip07Auth } from '../../stores/authStore.svelte';
    import { currentEditorStore, editorState, resetPostStatus } from '../../stores/editorStore.svelte';
    import { reactionComposerState, clearReactionTarget, setReactionTarget } from '../../stores/reactionComposerStore.svelte';
    import { createComposerTargetApplyController, type ComposerEventTarget } from '../../lib/composerTargetApplyController';
    import { buildPostHistoryComposerEventTarget } from '../../lib/postHistoryReplyUtils';
    import { PostManager } from '../../lib/postManager';
    import { postReactionService, type PostReactionResult } from '../../lib/postReactionService';
    import { postHistoryRepository } from '../../lib/storage/postHistoryRepository';
    import { postHistoryChildInteractionsRepository } from '../../lib/storage/postHistoryChildInteractionsRepository';
    import { ehagakiDb, type PostHistoryRecord } from '../../lib/storage/ehagakiDb';
    import type { NostrEvent } from '../../lib/types';
    import type { ComposerResolvedTarget } from '../../lib/composerTargetResolver';
    import { focusEditor as focusEditorElement } from '../../lib/utils/appDomUtils';
    import { buildReactionEvent } from '../../lib/postReactionUtils';
    import { postHistoryContextFetchService } from '../../lib/postHistoryContextFetchService';

    const query = new URLSearchParams(location.search);
    const key = generateSecretKey(); const owner = getPublicKey(key);
    const otherKey = generateSecretKey();
    const relay = 'wss://author.example/'; const recipient = 'wss://recipient.example/';
    const relayConfig = { [relay]: { read: true, write: true } };
    const original = finalizeEvent({ kind: Number(query.get('kind')) === 16 || query.has('quote-kind42') ? 42 : 1, content: 'Original fixture', tags: [], created_at: 100 }, otherKey);
    const kind = Number(query.get('kind') ?? '1');
    const target = finalizeEvent({ kind, content: kind === 6 || kind === 16 ? JSON.stringify(original) : kind === 7 ? '+' : 'Main fixture',
        tags: kind === 6 || kind === 7 || kind === 16 ? [['e', original.id, relay, original.pubkey], ['p', original.pubkey], ['k', String(original.kind)]]
            : query.has('quote-kind42') ? [['q', original.id, relay, original.pubkey]] : [], created_at: 200 }, key);
    const next = finalizeEvent({ kind: 1, content: 'Next fixture', tags: [], created_at: 201 }, key);
    let targetOpen = $state(false); let historyOpen = $state(false); let ready = $state(false);
    let mounted = $state(true); let pickerOpen = $state(false);
    let revision = $state(0); let inbound = $state<{ revision: number; parentEventIds: string[] } | null>(null);
    let failure = $state.raw<PostReactionResult | null>(null);
    let post: ReturnType<typeof PostComponent> | undefined = $state();
    let signs = 0; const sends: { eventId: string; kind: number; relays: string[] }[] = [];
    let reject = query.has('reject'); let holdSave = query.has('hold-save'); let saveEntered = false;
    let failSave = query.has('fail-save'); let releaseSave: (() => void) | undefined;
    let lastResult: PostReactionResult | null = null;
    const messages = new Subject();
    const rx = {
        getDefaultRelays: () => ({ [relay]: { url: relay, read: true, write: true } }),
        createAllMessageObservable: () => messages,
        createAllErrorObservable: () => new Subject(), createConnectionStateObservable: () => new Subject(),
        send: (event: NostrEvent, options: { on?: { relays?: string[] } }) => {
            const relays = options?.on?.relays ?? [relay]; sends.push({ eventId: event.id, kind: event.kind, relays });
            return of(...relays.map(from => ({ ok: !reject, done: true, from, eventId: event.id, notice: '' })));
        },
        use: (req: RxReq) => new Observable(observer => {
            const subscription = req.getReqPacketObservable().subscribe(({ filters }) => {
                const filter = filters[0];
                if (query.has('hold-reactions') && filter.kinds?.includes(7)) return;
                queueMicrotask(() => {
                    for (const event of [target, original, next]) if (filter.ids?.includes(event.id)) observer.next({ event, from: relay });
                    observer.complete(); const subId = `${req.rxReqId}:0`;
                    messages.next({ type: 'EOSE', from: relay, subId, message: ['EOSE', subId] });
                });
            });
            return () => subscription.unsubscribe();
        }),
    } as unknown as RxNostr;
    const originalPublish = PostManager.prototype.publishSignedEvent;
    const originalSave = postHistoryChildInteractionsRepository.upsertChildInteractions.bind(postHistoryChildInteractionsRepository);
    const manager = new PostManager(rx, { authStateStore: authState,
        nip65ReadRelayLookupFn: async () => ({ readRelays: [recipient] }) });
    PostManager.prototype.publishSignedEvent = function(params) { return originalPublish.call(manager, params); };
    postHistoryChildInteractionsRepository.upsertChildInteractions = async input => {
        saveEntered = true;
        if (holdSave) await new Promise<void>(resolve => releaseSave = resolve);
        if (failSave) { failSave = false; throw new Error('fixture quota'); }
        return originalSave(input);
    };
    const controller = createComposerTargetApplyController({
        captureReactionOwnership: () => { const session = authState.value; const editor = currentEditorStore.value; return () => authState.value === session && currentEditorStore.value === editor; },
        prepareReactionTarget: async target => {
            const result = await postHistoryContextFetchService.fetchEventById(rx, { eventId: target.eventId,
                authorHint: target.authorPubkey, relayHints: target.relayHints, relayConfig }).promise;
            return result.event ? { event: result.event, relayHints: result.relayUrl ? [result.relayUrl, ...target.relayHints] : target.relayHints } : null;
        },
        startChannelContextQuery: () => ({ release() {} }) as never,
        applyReplyQuoteQuery: async () => {}, hydrateReplyQuoteReferences: async () => {},
        getReplyQuoteApplyParams: () => ({}) as never, clearChannelContext() {}, hasReplyOrQuotes: () => false,
        clearReplyQuote() {}, clearReplyReference() {}, addQuoteReference: () => null,
        focusEditor: () => focusEditorElement('.tiptap-editor', 100),
    });
    function apply(action: string, eventTarget: ComposerEventTarget) {
        return action === 'reaction' ? controller.applyReaction(query.has('bad-apply')
            ? { ...eventTarget, event: { ...eventTarget.event!, sig: '0'.repeat(128) } } : eventTarget) : false;
    }
    function react(post: PostHistoryRecord) { return controller.applyReaction(buildPostHistoryComposerEventTarget(post)); }
    function result(value?: PostReactionResult) {
        if (!value) return; lastResult = value; failure = value.retryInput ? value : null;
        if (value.cacheSaved) inbound = { revision: ++revision, parentEventIds: [value.targetEventId!] };
    }
    async function retry() { if (failure && await postReactionService.retrySave(failure)) { inbound = { revision: ++revision, parentEventIds: [failure.targetEventId!] }; failure = null; } }
    const resolved = (event: NostrEvent): ComposerResolvedTarget => ({ event, relayHints: [relay], fetchedRelayUrl: relay,
        authorProfile: null, channelContext: null, channelCreatorPubkey: null, channelCreatorProfile: null, channelQuery: null, channelPictureCacheEligible: false });
    const resolver = { resolve: ({ pointer }: { pointer: { eventId: string } }) => ({ cancel() {},
        promise: Promise.resolve({ status: 'resolved' as const, target: resolved(pointer.eventId === next.id ? next : target) }) }) };
    const emoji = { shortcode: 'blob', shortcodeLower: 'blob', src: new URL('/ehagaki_icon_x192.png', location.origin).href,
        identityKey: 'blob', setAddress: null, sortIndex: 0, sourceType: 'kind10030' as const, sourceAddress: null };
    onMount(async () => {
        window.nostr = { getPublicKey: async () => owner, signEvent: async (template: EventTemplate) => { signs++; return finalizeEvent(template, key); } } as typeof window.nostr;
        setNip07Auth(owner, nip19.npubEncode(owner), nip19.nprofileEncode({ pubkey: owner })); resetPostStatus();
        await postHistoryRepository.putPostedEvent({ event: target, ...(kind === 6 || kind === 16 ? { repostTarget: { event: original, relayHints: [relay] } } : {}) });
        if (query.has('invalid')) currentEditorStore.value?.commands.setContent('<p>AB</p>');
        (window as unknown as { __REACTION__: unknown }).__REACTION__ = {
            targetId: target.id, relatedId: original.id, nextId: next.id, targetInput: nip19.noteEncode(target.id),
            read: async () => ({ signs, sends, saveEntered, result: lastResult ? { success: lastResult.success, cacheSaved: lastResult.cacheSaved } : null,
                targetId: reactionComposerState.value?.eventId, canPost: editorState.canPost, status: { ...editorState.postStatus },
                children: (await ehagakiDb.postHistoryChildInteractions.toArray()).map(row => ({ parent: row.parentEventId, eventId: row.eventId })),
                authored: await ehagakiDb.postHistory.count() }),
            switchTarget: () => { setReactionTarget(next, [relay]); resetPostStatus(); },
            switchAccount: () => { setNip07Auth(getPublicKey(otherKey), nip19.npubEncode(getPublicKey(otherKey)), nip19.nprofileEncode({ pubkey: getPublicKey(otherKey) })); clearReactionTarget(); resetPostStatus(); },
            destroy: () => { mounted = false; resetPostStatus(); },
            releaseSave: () => { holdSave = false; releaseSave?.(); },
            retryPublish: () => { reject = false; },
            saveIncomingReaction: async (toRelated = false) => {
                const parent = toRelated ? original : target;
                const event = finalizeEvent(buildReactionEvent(parent, owner, { type: 'text', text: '+' }, [relay], 300), key);
                await originalSave({ parentEventId: parent.id, reactionTarget: { eventId: parent.id, targetAuthorPubkey: parent.pubkey, targetKind: parent.kind }, events: [{ event }] });
                inbound = { revision: ++revision, parentEventIds: [parent.id] };
            },
        };
        ready = true;
    });
    onDestroy(() => { controller.dispose(); manager.cancelActiveNip65Operations(); clearReactionTarget();
        PostManager.prototype.publishSignedEvent = originalPublish; postHistoryChildInteractionsRepository.upsertChildInteractions = originalSave; });
</script>
<Tooltip.Provider>
<main>
    <button data-testid="open-target" onclick={() => targetOpen = true}>Target</button>
    <button data-testid="open-history" onclick={() => historyOpen = true}>History</button>
    {#if reactionComposerState.value}<ReactionTargetPreview target={reactionComposerState.value} onClear={() => { clearReactionTarget(); resetPostStatus(); }} />{/if}
    {#if failure}<button data-testid="retry-save" onclick={retry}>Retry local save</button>{/if}
    {#if mounted}<PostComponent bind:this={post} rxNostr={rx} hasStoredKey onReactionResult={result} />{/if}
    <KeyboardButtonBar hasPostingCapability customEmojiPickerOpen={pickerOpen} mediaEnabled={!reactionComposerState.value} onCustomEmojiPickerOpenChange={open => pickerOpen = open} />
    {#if pickerOpen}<CustomEmojiPicker open={pickerOpen} hostCustomEmojiItems={[emoji]} onSelect={selection => { post?.insertCustomEmoji(selection); pickerOpen = false; }} />{/if}
</main>
{#if ready}
    <ComposerTargetDialog show={targetOpen} onClose={() => targetOpen = false} onApply={apply}
        pubkeyHex={owner} rxNostr={rx} {relayConfig} {resolver} inboundInteractionSave={inbound} />
    <PostHistoryDialog show={historyOpen} onClose={() => historyOpen = false} pubkeyHex={owner} rxNostr={rx} {relayConfig}
        onReactionPost={react} inboundInteractionSave={inbound} />
{/if}
</Tooltip.Provider>
<style>main { width: 100%; min-width: 0; max-width: 800px; margin: 0 auto; padding: 8px; box-sizing: border-box; }</style>
