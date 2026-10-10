<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { finalizeEvent, generateSecretKey, getPublicKey, nip19, verifyEvent } from "nostr-tools";
    import { seckeySigner } from "@rx-nostr/crypto";
    import type { EventTemplate } from "nostr-tools";
    import { Observable, Subject, of } from "rxjs";
    import { createRxNostr, type RxNostr, type RxReq } from "rx-nostr";
    import PostHistoryDialog from "../../components/PostHistoryDialog.svelte";
    import ComposerTargetDialog from "../../components/ComposerTargetDialog.svelte";
    import { setNip07Auth, setNsecAuth, secretKeyStore } from "../../stores/authStore.svelte";
    import { writeRelaysStore } from "../../stores/relayStore.svelte";
    import { postHistoryRepository } from "../../lib/storage/postHistoryRepository";
    import { postHistoryDeletionRequestsRepository } from "../../lib/storage/postHistoryDeletionRequestsRepository";
    import { ehagakiDb } from "../../lib/storage/ehagakiDb";
    import { PostRepostService } from "../../lib/postRepostService";
    import { PostEventSender } from "../../lib/postEventBuilder";
    import { usePostRepostOperation } from "../../lib/hooks/usePostRepostOperation.svelte";
    import type { NostrEvent } from "../../lib/types";
    import type { ComposerResolvedTarget } from "../../lib/composerTargetResolver";
    import { PostHistoryJsonlImportService } from "../../lib/postHistoryJsonlImportService";
    import { PostHistoryRelayFetchService } from "../../lib/postHistoryRelayFetchService";
    import { PostHistoryAuthoredPostsRealtimeService } from "../../lib/postHistoryAuthoredPostsRealtimeService";

    const query = new URLSearchParams(location.search);
    const relay = "wss://relay.example.com/";
    const slowRelay = "wss://slow-relay.example.com/";
    const realTransport = query.has("transport");
    const relayConfig = { [relay]: { read: true, write: true },
        ...(realTransport ? { [slowRelay]: { read: true, write: false } } : {}) };
    const ownerKey = generateSecretKey();
    const targetKey = query.has("self-target") ? ownerKey
        : query.get("source") === "target" || query.has("external") ? generateSecretKey() : ownerKey;
    const fixtureTarget = finalizeEvent({ kind: 1, created_at: Math.floor(Date.now()/1000)-100,
        content: "original searchable post" + (query.has("cw") ? "\n" + "long fixture text ".repeat(100) + "\nhttps://media.example.com/repost.png" : ""),
        tags: [...(query.has("protected") ? [["-"]] : []), ...(query.has("cw") ? [["content-warning", "fixture CW"]] : [])] }, targetKey);
    let target = $state<NostrEvent>(fixtureTarget);
    let owner = $state(getPublicKey(ownerKey));
    let ready = $state(false);
    let historyOpen = $state(query.get("source") !== "target");
    let targetOpen = $state(query.get("source") === "target");
    let saved = $state<{ revision: number; eventIds: string[] } | null>(null);
    let allowTarget = !query.has("missing");
    let failSave = query.has("save-failure");
    let deletedOnRelay = false;
    let rejectPublish = false;
    let sends = 0;
    let signed = 0;
    let deletionRequests = 0;
    let holdHistory = query.has("hold-history");
    const historyResponses = new Set<() => void>();
    const publishResponses = new Set<() => void>();
    let lastResult: { success: boolean; error?: string; historySaved?: boolean } | null = null;
    const sentEvents: { id: string; kind: number; tags: string[][] }[] = [];
    let replyId: string | null = null;
    let quoteId: string | null = null;
    let incomingOuter: NostrEvent | null = null;
    const messages = new Subject<unknown>();
    const injectedRx = {
        createAllMessageObservable: () => messages,
        createAllErrorObservable: () => new Subject(),
        createConnectionStateObservable: () => new Subject(),
        send: (event: NostrEvent) => {
            sends++; sentEvents.push({ id: event.id, kind: event.kind, tags: event.tags });
            const ok = !rejectPublish; rejectPublish = false;
            if (query.has("hold-publish")) return new Observable(observer => {
                const respond = () => { observer.next({ ok, done: true, from: relay, eventId: event.id }); observer.complete(); };
                publishResponses.add(respond);
                return () => publishResponses.delete(respond);
            });
            return of({ ok, done: true, from: relay, eventId: event.id });
        },
        use: (req: RxReq) => new Observable((observer) => {
            const heldResponses = new Set<() => void>();
            const subscription = req.getReqPacketObservable().subscribe(({ filters }) => {
                const filter = filters[0];
                const respond = () => {
                    if (filter?.ids?.includes(target.id) && allowTarget) observer.next({ event: target, from: relay });
                    if (deletedOnRelay && filter?.kinds?.includes(5) && filter.authors?.includes(target.pubkey)
                        && filter["#e"]?.includes(target.id)) {
                        observer.next({ event: finalizeEvent({ kind: 5, created_at: target.created_at + 1,
                            content: "", tags: [["e", target.id], ["k", "1"]] }, targetKey), from: relay });
                    }
                    if (incomingOuter && filter?.authors?.includes(owner) && filter.kinds?.includes(6))
                        observer.next({ event: incomingOuter, from: relay });
                    observer.complete();
                    const subId = `${req.rxReqId}:0`;
                    messages.next({ type: "EOSE", from: relay, subId, message: ["EOSE", subId] });
                };
                if (holdHistory && filter?.authors?.includes(owner) && filter.kinds?.includes(6)) {
                    heldResponses.add(respond); historyResponses.add(respond);
                }
                else queueMicrotask(respond);
            });
            return () => { subscription.unsubscribe(); heldResponses.forEach(respond => historyResponses.delete(respond)); };
        }),
    } as unknown as RxNostr;
    // Exercise the actual rx-nostr request/EOSE/verification/publish path. Only
    // the socket is synthetic, and fixture keys stay in memory.
    class FixtureRelaySocket extends EventTarget {
        readyState = 0;
        private timers = new Map<string, ReturnType<typeof setTimeout>>();
        readonly url: string;
        constructor(url: string) {
            super();
            this.url = new URL(url).href;
            queueMicrotask(() => { this.readyState = 1; this.dispatchEvent(new Event("open")); });
        }
        private receive(message: unknown[]) {
            this.dispatchEvent(new MessageEvent("message", { data: JSON.stringify(message) }));
        }
        send(data: string) {
            const message = JSON.parse(data) as unknown[];
            if (message[0] === "REQ") {
                const subId = message[1] as string;
                const filter = message[2] as { kinds?: number[]; ids?: string[]; authors?: string[]; "#e"?: string[] };
                const deletion = filter.kinds?.includes(5);
                if (deletion) deletionRequests++;
                if (deletion && query.has("silent")) return;
                this.timers.set(subId, setTimeout(() => {
                    this.timers.delete(subId);
                    if (filter.ids?.includes(target.id) && allowTarget) this.receive(["EVENT", subId, target]);
                    if (deletion && deletedOnRelay && this.url === slowRelay && filter.authors?.includes(target.pubkey)
                        && filter["#e"]?.includes(target.id)) this.receive(["EVENT", subId, finalizeEvent({ kind: 5,
                            created_at: target.created_at + 1, content: "", tags: [["e", target.id], ["k", "1"]] }, targetKey)]);
                    this.receive(query.has("closed") && deletion && this.url === slowRelay
                        ? ["CLOSED", subId, "error: fixture"] : ["EOSE", subId]);
                }, deletion && this.url === slowRelay ? 5_000 : 0));
            } else if (message[0] === "EVENT") {
                const event = message[1] as NostrEvent;
                sends++; sentEvents.push({ id: event.id, kind: event.kind, tags: event.tags });
                const ok = !rejectPublish; rejectPublish = false;
                queueMicrotask(() => this.receive(["OK", event.id, ok, ""]));
            } else if (message[0] === "CLOSE") {
                const subId = message[1] as string;
                clearTimeout(this.timers.get(subId)); this.timers.delete(subId);
            }
        }
        close() {
            this.readyState = 3;
            this.timers.forEach(timer => clearTimeout(timer)); this.timers.clear();
            this.dispatchEvent(new CloseEvent("close", { code: 1000 }));
        }
    }
    const rx = realTransport ? createRxNostr({ verifier: async event => verifyEvent(event), skipFetchNip11: true,
        retry: { strategy: "off" }, websocketCtor: FixtureRelaySocket as never }) : injectedRx;
    if (realTransport) rx.setDefaultRelays(relayConfig);
    onDestroy(() => { if (realTransport) rx.dispose(); });
    const service = new PostRepostService({ getWriteRelays: () => [relay], getClientTag: () => null,
        getNip07Signer: () => ({ signEvent: async (template) => { signed++; return finalizeEvent(template, ownerKey); } }),
        seckeySignerFn: key => { const signer = seckeySigner(key); return {
            signEvent: async template => { signed++; return signer.signEvent(template); },
        }; },
        createSender: (runtime) => new PostEventSender(runtime, { log() {}, warn() {}, error() {} } as Console,
            { initialMs: query.has("hold-publish") ? 30_000 : 200, successMs: 10, authMs: 200 }),
        saveHistory: async (input) => {
            if (failSave) { failSave = false; throw new Error("test storage failure"); }
            await postHistoryRepository.putPostedEvent(input);
        } });
    const operation = usePostRepostOperation({ getPubkey: () => owner, getRxNostr: () => rx, service,
        onSaved: (eventIds) => { saved = { revision: (saved?.revision ?? 0)+1, eventIds }; } });
    const execute: typeof operation.execute = async (post, resolve) => {
        const result = await operation.execute(post, resolve);
        lastResult = { success: result.success, error: result.error, historySaved: result.historySaved };
        return result;
    };
    const resolver = {
        resolve: () => ({ promise: Promise.resolve({ status: "resolved" as const, target: {
            event: target, relayHints: [relay], fetchedRelayUrl: relay,
            authorProfile: { name: "original author", displayName: "original author", picture: "", npub: nip19.npubEncode(target.pubkey), nprofile: "" },
            channelContext: null, channelCreatorPubkey: null, channelCreatorProfile: null,
            channelQuery: null, channelPictureCacheEligible: false,
        } as ComposerResolvedTarget }), cancel() {} }),
    };
    async function signFixture<K extends number>(template: EventTemplate & { kind: K }) {
        return { ...finalizeEvent(template, ownerKey), kind: template.kind };
    }
    onMount(() => { void (async () => {
        const existing = await ehagakiDb.postHistory.toArray();
        const oldTarget = (existing.find((record) => record.kind === 1)?.rawEvent
            ?? existing.find((record) => record.kind === 6)?.repostTarget?.rawEvent) as NostrEvent | undefined;
        if (oldTarget) target = oldTarget;
        if (existing.length) owner = existing.find((record) => record.kind === 6)?.pubkeyHex ?? target.pubkey;
        if (realTransport) {
            secretKeyStore.set(nip19.nsecEncode(ownerKey));
            setNsecAuth(owner, nip19.npubEncode(owner), nip19.nprofileEncode({ pubkey: owner, relays: [relay] }));
        } else setNip07Auth(owner, nip19.npubEncode(owner), nip19.nprofileEncode({ pubkey: owner, relays: [relay] }));
        writeRelaysStore.set([relay]);
        window.nostr = { getPublicKey: async () => owner,
            signEvent: signFixture };
        if (!existing.length && !query.has("external") && query.get("source") !== "target")
            await postHistoryRepository.putPostedEvent({ event: target, acceptedRelays: [relay], relayHints: [relay] });
        if (!existing.length && query.has("external")) {
            const outer = finalizeEvent({ kind: 6, created_at: Math.floor(Date.now()/1000),
                content: "opaque content must never appear", tags: [["e", target.id, relay],
                    ...(query.has("extra-author") ? [["p", getPublicKey(generateSecretKey())]] : []), ["p", target.pubkey]] }, ownerKey);
            incomingOuter = outer;
            if (query.get("external") === "import") await new PostHistoryJsonlImportService().importFile({
                file: new File([JSON.stringify(outer)+"\n"], "repost.jsonl"), ownerPubkeyHex: owner, getCurrentPubkeyHex: () => owner });
            else if (query.get("external") === "realtime") {
                let finish: () => void = () => undefined;
                const saved = new Promise<void>(resolve => { finish = resolve; });
                const subscription = new PostHistoryAuthoredPostsRealtimeService().subscribe(rx, {
                    ownerPubkeyHex: owner, relayConfig: { [relay]: { read: true, write: true } }, onSavedSelfPosts: finish });
                await saved;
                subscription.stop();
            } else {
                const fetched = await new PostHistoryRelayFetchService().fetchLatest(rx, {
                    pubkeyHex: owner, relayConfig: { [relay]: { read: true, write: true } }, reason: "dialog-open-refresh" }).promise;
                await postHistoryRepository.upsertFetchedEvents({ events: fetched.events });
            }
        }
        (window as unknown as { __REPOST__: unknown }).__REPOST__ = {
            ready: true, targetId: target.id, targetInput: nip19.noteEncode(target.id), owner,
            read: async () => { const rows = await ehagakiDb.postHistory.toArray(); return {
                sends, signed, lastResult, sentEvents, replyId, quoteId, deletionRequests,
                deletionCount: await ehagakiDb.postHistoryDeletionRequests.count(),
                rows: rows.map((row) => ({ id: row.eventId, kind: row.kind, content: row.content,
                    targetId: row.repostTarget?.rawEvent.id, targetKind: row.repostTarget?.rawEvent.kind })),
            }; }, allowTarget: () => { allowTarget = true; },
            deleteOnRelay: () => { deletedOnRelay = true; },
            rememberDeletion: () => postHistoryDeletionRequestsRepository.upsertValidDeletionRequests({
                targetEvents: [target], deletionEvents: [{ event: finalizeEvent({ kind: 5,
                    created_at: target.created_at + 1, content: "", tags: [["e", target.id], ["k", "1"]] }, targetKey), relayUrls: [relay] }],
                fetchedAt: Date.now(),
            }),
            nextTarget: () => {
                target = finalizeEvent({ kind: 1, created_at: fixtureTarget.created_at + 1,
                    content: "another original post", tags: [] }, targetKey);
                return nip19.noteEncode(target.id);
            },
            rejectNextPublish: () => { rejectPublish = true; },
            releaseHistory: () => { holdHistory = false; [...historyResponses].forEach(respond => respond()); historyResponses.clear(); },
            releasePublish: () => { [...publishResponses].forEach(respond => respond()); },
        };
        ready = true;
    })(); });
</script>
{#if ready}
    <button onclick={() => { targetOpen = false; historyOpen = true; }}>Open history</button>
    <button onclick={() => { historyOpen = false; targetOpen = true; }}>Open target</button>
    <PostHistoryDialog show={historyOpen} onClose={() => historyOpen = false} pubkeyHex={owner} rxNostr={rx}
        {relayConfig} authoredSelfPostSave={saved}
        onReplyPost={post => { replyId = post.eventId; }} onQuotePost={post => { quoteId = post.eventId; }}
        onRepostPost={execute} repostPending={operation.pending} onRetryRepostSave={operation.retrySave}
        repostSaveFailure={operation.saveFailure} />
    <ComposerTargetDialog show={targetOpen} onClose={() => targetOpen = false} onApply={() => true}
        pubkeyHex={owner} rxNostr={rx} {relayConfig} {resolver}
        onRepostPost={execute} repostPending={operation.pending} onRetryRepostSave={operation.retrySave}
        repostSaveFailure={operation.saveFailure} />
{/if}
