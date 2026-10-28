<script lang="ts">
    import { onMount, onDestroy, tick } from 'svelte';
    import { uploadFiles as normalUploadFiles } from '../../lib/normalUploadHelper';
    import { FileUploadManager } from '../../lib/fileUploadManager';
    import { getImageDimensions } from '../../lib/utils/fileUtils';
    import { extractImageBlurhashMap, getMimeTypeFromUrl, createImetaTag } from '../../lib/tags/imetaTag';
    import { imageSizeMapStore } from '../../stores/tagsStore.svelte';
    import { settingsStore } from '../../stores/settingsStore.svelte';
    import { mediaGalleryStore } from '../../stores/mediaGalleryStore.svelte';
    import { customEmojiStore } from '../../stores/customEmojiStore.svelte';
    import { writeCachedCustomEmojiItems } from '../../lib/customEmoji';
    import { createLegacyUploadDestination } from '../../lib/upload/uploadDestinationPresets';
    import type { UploadFilesParams } from '../../lib/postUploadUtils';
    import encodeWebp from '@jsquash/webp/encode';
    import { Tooltip } from 'bits-ui';
    import { finalizeEvent, generateSecretKey, getPublicKey, nip19, type EventTemplate } from 'nostr-tools';
    import { Observable, Subject, of } from 'rxjs';
    import type { RxNostr, RxReq } from 'rx-nostr';
    import PostComponent from '../../components/PostComponent.svelte';
    import KeyboardButtonBar from '../../components/KeyboardButtonBar.svelte';
    import ReactionTargetPreview from '../../components/ReactionTargetPreview.svelte';
    import ReplyQuotePreview from '../../components/ReplyQuotePreview.svelte';
    import ComposerTargetDialog from '../../components/ComposerTargetDialog.svelte';
    import PostHistoryDialog from '../../components/PostHistoryDialog.svelte';
    import CustomEmojiPicker from '../../components/CustomEmojiPicker.svelte';
    import { authState, setNip07Auth } from '../../stores/authStore.svelte';
    import { currentEditorStore, editorState, resetPostStatus } from '../../stores/editorStore.svelte';
    import { postComponentUIStore } from '../../stores/postUIStore.svelte';
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
    import { RelayProfileService } from '../../lib/relayProfileService';
    import { RelayManager } from '../../lib/relayManager';

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
    const profileName = 'Reaction target profile with a long display name for truncation';
    const profilePicture = new URL(`${import.meta.env.BASE_URL}ehagaki_icon_x192.png`, location.origin).href;
    const profiles = [key, otherKey].map((secret, index) => finalizeEvent({ kind: 0,
        content: JSON.stringify({ name: index === 0 ? 'main-author' : 'original-author', display_name: index === 0 ? profileName : 'Original target profile', picture: profilePicture }),
        tags: [], created_at: Math.floor(Date.now() / 1000) }, secret));
    let targetOpen = $state(false); let historyOpen = $state(false); let ready = $state(false);
    let mounted = $state(true); let pickerOpen = $state(false);
    let revision = $state(0); let inbound = $state<{ revision: number; parentEventIds: string[] } | null>(null);
    let failure = $state.raw<PostReactionResult | null>(null);
    let post: ReturnType<typeof PostComponent> | undefined = $state();
    let signs = 0; const sends: { eventId: string; kind: number; relays: string[] }[] = [];
    let reject = query.has('reject'); let holdSave = query.has('hold-save'); let saveEntered = false;
    let failSave = query.has('fail-save'); let releaseSave: (() => void) | undefined;
    let lastResult: PostReactionResult | null = null;
    const uploads: { width: number; height: number; type: string; size: number; name: string; sha256: string; lossless: boolean; alpha: number }[] = [];
    const uploadEndpoint = new URL('reaction-fixture-upload', location.href).href;
    const originalFetch = window.fetch;
    if (query.has('uploaded')) window.fetch = async (input, init) => {
        if (String(input) === uploadEndpoint && init?.body instanceof FormData) {
            const file = init.body.get('file') as File;
            const bitmap = await createImageBitmap(file);
            const bytes = new Uint8Array(await file.arrayBuffer());
            // Lossless WebP contains a VP8L image chunk (optionally after VP8X).
            let lossless = false;
            if (file.type === 'image/webp') {
                const view = new DataView(bytes.buffer);
                for (let offset = 12; offset + 8 <= bytes.length;) {
                    const name = String.fromCharCode(...bytes.slice(offset, offset + 4));
                    if (name === 'VP8L') lossless = true;
                    const size = view.getUint32(offset + 4, true); offset += 8 + size + size % 2;
                }
            }
            const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height;
            const context = canvas.getContext('2d')!; context.drawImage(bitmap, 0, 0);
            const alpha = context.getImageData(bitmap.width - 1, 0, 1, 1).data[3];
            const sha256 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), byte => byte.toString(16).padStart(2, '0')).join('');
            uploads.push({ width: bitmap.width, height: bitmap.height, type: file.type, size: file.size, name: file.name, sha256, lossless, alpha }); bitmap.close();
        }
        return await originalFetch.call(window, input, init);
    };
    function upload(params: UploadFilesParams) {
        return normalUploadFiles({ ...params, dependencies: {
            localStorage, crypto: crypto.subtle, tick, FileUploadManager, getImageDimensions,
            extractImageBlurhashMap, getMimeTypeFromUrl, createImetaTag, imageSizeMapStore,
            calculateImageHash: async () => null,
            resolveUploadDestination: async () => ({ ...createLegacyUploadDestination({ endpoint: uploadEndpoint }), protocol: 'custom-http',
                serverUrl: uploadEndpoint, auth: { type: 'none' } }),
        } });
    }
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
                    for (const event of [target, original, next, ...profiles]) {
                        if ((filter.ids?.includes(event.id) || (filter.kinds?.includes(0) && event.kind === 0 && filter.authors?.includes(event.pubkey)))) observer.next({ event, from: relay });
                    }
                    observer.complete(); const subId = `${req.rxReqId}:0`;
                    messages.next({ type: 'EOSE', from: relay, subId, message: ['EOSE', subId] });
                });
            });
            return () => subscription.unsubscribe();
        }),
    } as unknown as RxNostr;
    const profileService = new RelayProfileService(rx as never, new RelayManager(rx, { hostRelayConfig: relayConfig }));
    const replyReference = { mode: 'reply' as const, eventId: target.id, relayHints: [relay], authorPubkey: owner,
        authorDisplayName: profileName, authorPicture: profilePicture, quoteNotificationEnabled: false,
        referencedEvent: target, rootEventId: null, rootRelayHint: null, rootPubkey: null, loading: false, error: null };
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
    const emoji = { shortcode: 'blob', shortcodeLower: 'blob', src: profilePicture,
        identityKey: 'blob', setAddress: null, sortIndex: 0, sourceType: 'kind10030' as const, sourceAddress: null };
    onMount(async () => {
        window.nostr = { getPublicKey: async () => owner, signEvent: async (template: EventTemplate) => { signs++; return finalizeEvent(template, key); } } as typeof window.nostr;
        setNip07Auth(owner, nip19.npubEncode(owner), nip19.nprofileEncode({ pubkey: owner })); resetPostStatus();
        if (query.has('uploaded')) {
            settingsStore.mediaFreePlacement = query.has('free');
            await writeCachedCustomEmojiItems(owner, [emoji]);
            await customEmojiStore.prefetchCache({ pubkey: owner });
        }
        await postHistoryRepository.putPostedEvent({ event: target, ...(kind === 6 || kind === 16 ? { repostTarget: { event: original, relayHints: [relay] } } : {}) });
        if (query.has('compare-reply')) {
            const reply = finalizeEvent({ kind: 1, content: 'Reply fixture', created_at: 300,
                tags: [['e', target.id, relay, 'reply'], ['p', target.pubkey]] }, otherKey);
            await originalSave({ parentEventId: target.id, events: [{ event: reply }] });
        }
        if (query.has('invalid')) currentEditorStore.value?.commands.setContent('<p>AB</p>');
        (window as unknown as { __REACTION__: unknown }).__REACTION__ = {
            targetId: target.id, relatedId: original.id, nextId: next.id, targetInput: nip19.noteEncode(target.id), profileName, profilePicture,
            read: async () => ({ signs, sends, saveEntered, result: lastResult ? { success: lastResult.success, cacheSaved: lastResult.cacheSaved } : null,
                uploads, gallery: mediaGalleryStore.items.map(item => ({ ...item })), isUploading: editorState.isUploading,
                freePlacement: settingsStore.mediaFreePlacement,
                fullscreen: { id: postComponentUIStore.value.fullscreenMediaId, src: postComponentUIStore.value.fullscreenImageSrc },
                inlineMedia: (() => {
                    const items: { id: string; src: string }[] = [];
                    currentEditorStore.value?.state.doc.descendants(node => {
                        if (node.type.name === 'image' || node.type.name === 'video') items.push({ id: node.attrs.id, src: node.attrs.src });
                    });
                    return items;
                })(),
                wire: lastResult?.event ? { content: lastResult.event.content, emoji: lastResult.event.tags.filter(tag => tag[0] === 'emoji') } : null,
                targetId: reactionComposerState.value?.eventId, canPost: editorState.canPost, status: { ...editorState.postStatus },
                children: (await ehagakiDb.postHistoryChildInteractions.toArray()).map(row => ({ parent: row.parentEventId, eventId: row.eventId })),
                authored: await ehagakiDb.postHistory.count() }),
            switchTarget: () => { setReactionTarget(next, [relay]); resetPostStatus(); },
            startReaction: () => { setReactionTarget(target, [relay]); resetPostStatus(); },
            createImage: async (type: string, width: number, height: number) => {
                const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
                const context = canvas.getContext('2d')!; context.fillStyle = '#ff8000'; context.fillRect(0, 0, width / 2, height);
                const blob = type === 'image/webp' ? new Blob([await encodeWebp(context.getImageData(0, 0, width, height), { lossless: 1 })], { type })
                    : await new Promise<Blob>(resolve => canvas.toBlob(value => resolve(value!), type, 1));
                return Array.from(new Uint8Array(await blob.arrayBuffer()));
            },
            cancelReaction: () => { clearReactionTarget(); resetPostStatus(); },
            removeImages: () => mediaGalleryStore.clearAll(),
            addExistingImage: () => mediaGalleryStore.addItem({ id: 'existing', src: profilePicture, type: 'image', isPlaceholder: false }),
            selectInlineImage: () => {
                let position: number | undefined;
                currentEditorStore.value?.state.doc.descendants((node, pos) => {
                    if (position === undefined && node.type.name === 'image') position = pos;
                });
                if (position !== undefined) currentEditorStore.value?.commands.setNodeSelection(position);
            },
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
    onDestroy(() => { window.fetch = originalFetch; controller.dispose(); manager.cancelActiveNip65Operations(); clearReactionTarget('ownership');
        PostManager.prototype.publishSignedEvent = originalPublish; postHistoryChildInteractionsRepository.upsertChildInteractions = originalSave; });
</script>
<Tooltip.Provider>
<main class="ehagaki-app-root">
    <button data-testid="open-target" onclick={() => targetOpen = true}>Target</button>
    <button data-testid="open-history" onclick={() => historyOpen = true}>History</button>
    {#if query.has('compare-reply')}<ReplyQuotePreview reference={replyReference} mode="reply" onClear={() => {}} />{/if}
    {#if reactionComposerState.value}<ReactionTargetPreview target={reactionComposerState.value} {profileService} onClear={() => { clearReactionTarget(); resetPostStatus(); }} />{/if}
    {#if failure}<button data-testid="retry-save" onclick={retry}>Retry local save</button>{/if}
    {#if mounted}<PostComponent bind:this={post} rxNostr={rx} hasStoredKey onReactionResult={result} normalUploadFiles={query.has('uploaded') ? upload : undefined} />{/if}
    <KeyboardButtonBar hasPostingCapability customEmojiPickerOpen={pickerOpen} mediaEnabled onUploadImage={() => post?.openFileDialog()} onCustomEmojiPickerOpenChange={open => pickerOpen = open} />
    {#if pickerOpen}<CustomEmojiPicker open={pickerOpen} hostCustomEmojiItems={[emoji]} onSelect={selection => { post?.insertCustomEmoji(selection); pickerOpen = false; }} />{/if}
</main>
{#if ready}
    <ComposerTargetDialog show={targetOpen} onClose={() => targetOpen = false} onApply={apply}
        pubkeyHex={owner} rxNostr={rx} {relayConfig} {resolver} inboundInteractionSave={inbound} />
    <PostHistoryDialog show={historyOpen} onClose={() => historyOpen = false} pubkeyHex={owner} rxNostr={rx} {relayConfig}
        onReplyPost={() => false} onQuotePost={() => {}} onReactionPost={react} inboundInteractionSave={inbound} />
{/if}
</Tooltip.Provider>
<style>main { width: 100%; min-width: 0; max-width: 800px; margin: 0 auto; padding: 8px; box-sizing: border-box; }</style>
