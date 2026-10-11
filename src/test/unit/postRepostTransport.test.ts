import "fake-indexeddb/auto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRxNostr, type RxNostr } from "rx-nostr";
import { finalizeEvent, generateSecretKey, getPublicKey, nip19, verifyEvent } from "nostr-tools";
import { seckeySigner } from "@rx-nostr/crypto";
import { PostRepostService } from "../../lib/postRepostService";
import { PostHistoryContextFetchService } from "../../lib/postHistoryContextFetchService";
import { PostHistoryDeletionFetchService } from "../../lib/postHistoryDeletionFetchService";
import { createPostHistoryRelatedTargetResolver } from "../../lib/postHistoryRelatedTargetResolver.svelte";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { DexiePostHistoryDeletionRequestsRepository } from "../../lib/storage/postHistoryDeletionRequestsRepository";

// The socket is synthetic; request completion, signature verification and the
// secret-key signer are the installed production implementations.
class RelaySocket {
    static instances: RelaySocket[] = [];
    readyState = 0;
    requests: unknown[][] = [];
    private listeners = new Map<string, Set<(event: unknown) => void>>();
    constructor(readonly url: string) {
        RelaySocket.instances.push(this);
        queueMicrotask(() => { this.readyState = 1; this.dispatch("open", { type: "open" }); });
    }
    addEventListener(type: string, callback: (event: unknown) => void) {
        const callbacks = this.listeners.get(type) ?? new Set();
        callbacks.add(callback); this.listeners.set(type, callbacks);
    }
    removeEventListener(type: string, callback: (event: unknown) => void) { this.listeners.get(type)?.delete(callback); }
    send(data: string) {
        const message = JSON.parse(data) as unknown[];
        if (message[0] === "REQ") this.requests.push(message);
    }
    close() { this.readyState = 3; this.dispatch("close", { type: "close", code: 1000, reason: "" }); }
    receive(message: unknown[]) { this.dispatch("message", { type: "message", data: JSON.stringify(message) }); }
    private dispatch(type: string, event: unknown) {
        for (const callback of this.listeners.get(type) ?? []) callback(event);
    }
}
const cleanups: (() => Promise<void>)[] = [];
async function drain<T>(promise: Promise<T>): Promise<T> {
    let settled = false;
    void promise.finally(() => { settled = true; });
    await vi.waitFor(() => expect(settled).toBe(true));
    return promise;
}
afterEach(async () => {
    await Promise.all(cleanups.splice(0).map(cleanup => cleanup()));
    RelaySocket.instances = [];
    vi.useRealTimers();
});

function setup(targetKind: number, eoseTimeout = 30_000, verifyDeletion?: () => Promise<void>) {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date"] });
    const targetKey = generateSecretKey(); const ownerKey = generateSecretKey();
    const target = finalizeEvent({ kind: targetKind, content: "fixture", tags: [], created_at: 100 }, targetKey);
    const urls = ["wss://fast.example.test/", "wss://slow.example.test/"];
    const rx: RxNostr = createRxNostr({ verifier: async event => {
        if (event.kind === 5) await verifyDeletion?.();
        return verifyEvent(event);
    }, skipFetchNip11: true,
        retry: { strategy: "off" }, websocketCtor: RelaySocket as never, eoseTimeout });
    const db = new EHagakiDB(`repost-transport-${crypto.randomUUID()}`);
    const repo = new DexiePostHistoryRepository(db);
    const deletions = new DexiePostHistoryDeletionRequestsRepository(db);
    const deletionFetch = new PostHistoryDeletionFetchService();
    const fetchDeletionRequests = vi.fn((...args: Parameters<typeof deletionFetch.fetchDeletionRequests>) => {
        return deletionFetch.fetchDeletionRequests(...args);
    });
    const resolver = createPostHistoryRelatedTargetResolver({ getShow: () => true, getRxNostr: () => rx,
        getRelayConfig: () => Object.fromEntries(urls.map(url => [url, { read: true, write: false }])),
        contextFetchService: new PostHistoryContextFetchService({ lookupAuthorWriteRelaysFn: async () => [] }),
        postHistoryRepositoryImpl: repo, deletionRequestsRepositoryImpl: deletions,
        deletionFetchService: { fetchDeletionRequests },
        profileSyncCoordinator: { ensureProfile: () => null, subscribe: () => () => undefined, reset() {} } as never });
    const signer = seckeySigner(nip19.nsecEncode(ownerKey));
    const signEvent = vi.fn(signer.signEvent);
    const sendEvent = vi.fn(async (event) => ({ success: true, eventId: event.id, acceptedRelays: [urls[0]!] }));
    const service = new PostRepostService({
        authStateStore: { value: { type: "nsec", isAuthenticated: true, pubkey: getPublicKey(ownerKey),
            npub: nip19.npubEncode(getPublicKey(ownerKey)), nprofile: "", isValid: true, isInitialized: true } },
        keyManager: { getFromStore: () => nip19.nsecEncode(ownerKey) } as never,
        seckeySignerFn: () => ({ signEvent }), getWriteRelays: () => [urls[0]!], getClientTag: () => null,
        getLocalRevision: async () => 0, saveHistory: input => repo.putPostedEvent(input), createSender: () => ({ sendEvent }),
    });
    const descriptor = { relationKind: "repost", scopeKey: "operation", targetEventId: target.id,
        authorHint: target.pubkey, relayHints: [urls[0]!] };
    const repost = (relayHints = descriptor.relayHints) => service.repost({ target, relayHints, rxNostr: rx,
        prepareTarget: (event, relayHints) => resolver.prepareRepostTarget({ ...descriptor, relayHints }, event) });
    const requests = async () => {
        await vi.waitFor(() => {
            expect(RelaySocket.instances).toHaveLength(2);
            expect(RelaySocket.instances.every(socket => socket.requests.length > 0)).toBe(true);
        });
        return RelaySocket.instances.map(socket => ({ socket, subId: socket.requests[0]![1] }));
    };
    cleanups.push(async () => { resolver.reset(); rx.dispose(); await db.delete(); });
    return { target, targetKey, repo, db, resolver, descriptor, repost, requests, signEvent, sendEvent, fetchDeletionRequests };
}

describe.each([1, 42, 1111])("Immediate kind %s Repost through real rx-nostr and secret-key signing", (targetKind) => {
    const outerKind = targetKind === 1 ? 6 : 16;
    const kindTags = targetKind === 1 ? [] : [["k", String(targetKind)]];
    it("signs and saves a verified target without issuing a deletion request", async () => {
        const fixture = setup(targetKind);
        const result = await drain(fixture.repost());
        expect(result).toMatchObject({ success: true, historySaved: true });
        expect(fixture.fetchDeletionRequests).not.toHaveBeenCalled();
        expect(RelaySocket.instances).toHaveLength(0);
        expect(fixture.signEvent).toHaveBeenCalledTimes(1); expect(fixture.sendEvent).toHaveBeenCalledTimes(1);
        expect(verifyEvent(result.event!)).toBe(true);
        expect(result.event).toMatchObject({ kind: outerKind, content: "", tags: [["e", fixture.target.id, "wss://fast.example.test/"], ["p", fixture.target.pubkey], ...kindTags] });
        expect((await fixture.repo.getByEventId(result.eventId!))?.repostTarget?.rawEvent.id).toBe(fixture.target.id);
    });
    it("obtains missing relay provenance by event ID before signing without querying deletions", async () => {
        const fixture = setup(targetKind);
        const operation = fixture.repost([]);
        const [, slow] = await fixture.requests();
        for (const socket of RelaySocket.instances) {
            expect(socket.requests).toHaveLength(1);
            expect(socket.requests[0]!.slice(2)).toEqual([{ ids: [fixture.target.id] }]);
        }
        expect(fixture.signEvent).not.toHaveBeenCalled(); expect(fixture.sendEvent).not.toHaveBeenCalled();
        slow!.socket.receive(["EVENT", slow!.subId, fixture.target]);
        const result = await drain(operation);
        expect(result).toMatchObject({ success: true, historySaved: true });
        expect(verifyEvent(result.event!)).toBe(true);
        expect(result.event).toMatchObject({ kind: outerKind, content: "", tags: [["e", fixture.target.id, "wss://slow.example.test/"], ["p", fixture.target.pubkey], ...kindTags] });
        expect(fixture.signEvent).toHaveBeenCalledTimes(1); expect(fixture.sendEvent).toHaveBeenCalledTimes(1);
        expect(fixture.fetchDeletionRequests).not.toHaveBeenCalled();
        expect((await fixture.repo.getByEventId(result.eventId!))?.repostTarget).toMatchObject({
            rawEvent: fixture.target, relayHints: ["wss://slow.example.test/"],
        });
    });
    it.each(["closed", "rx-timeout"])("publishes after an incomplete background lookup (%s)", async termination => {
        const fixture = setup(targetKind, 1_000);
        await drain(fixture.repo.putPostedEvent({ event: fixture.target, relayHints: fixture.descriptor.relayHints }));
        await drain(fixture.resolver.ensureTarget({ ...fixture.descriptor, scopeKey: "preview" }));
        const [fast, slow] = await fixture.requests();
        fast!.socket.receive(["EOSE", fast!.subId]);
        if (termination === "closed") slow!.socket.receive(["CLOSED", slow!.subId, "error: fixture"]);
        else await vi.advanceTimersByTimeAsync(1_100);
        await fixture.fetchDeletionRequests.mock.results[0]!.value.promise;
        expect((await drain(fixture.repost())).success).toBe(true);
        expect(fixture.signEvent).toHaveBeenCalledTimes(1); expect(fixture.sendEvent).toHaveBeenCalledTimes(1);
        expect(fixture.fetchDeletionRequests).toHaveBeenCalledTimes(1);
    });
    it("publishes while preview deletion requests are pending and never upgrades or duplicates them", async () => {
        const fixture = setup(targetKind);
        await drain(fixture.repo.putPostedEvent({ event: fixture.target, relayHints: fixture.descriptor.relayHints }));
        await drain(fixture.resolver.ensureTarget({ ...fixture.descriptor, relationKind: "quote", scopeKey: "preview" }));
        const [fast, slow] = await fixture.requests();
        let deletionFinished = false;
        const background = fixture.fetchDeletionRequests.mock.results[0]!.value.promise;
        void background.then(() => { deletionFinished = true; });
        fast!.socket.receive(["EOSE", fast!.subId]);
        expect((await drain(fixture.repost())).success).toBe(true);
        // The preview is still waiting for the slow relay; it owns its normal deadline.
        expect(deletionFinished).toBe(false);
        expect(fixture.fetchDeletionRequests).toHaveBeenCalledTimes(1);
        slow!.socket.receive(["EOSE", slow!.subId]);
        await background;
        expect(RelaySocket.instances.every(socket => socket.requests.length === 1)).toBe(true);
        expect(fixture.signEvent).toHaveBeenCalledTimes(1); expect(fixture.sendEvent).toHaveBeenCalledTimes(1);
    });
    it("allows Repost during background verification and rejects the target once its valid deletion is saved", async () => {
        let release!: () => void;
        const verification = new Promise<void>(resolve => { release = resolve; });
        const verifyDeletion = vi.fn(() => verification);
        const fixture = setup(targetKind, 30_000, verifyDeletion);
        await drain(fixture.repo.putPostedEvent({ event: fixture.target, relayHints: fixture.descriptor.relayHints }));
        await drain(fixture.resolver.ensureTarget({ ...fixture.descriptor, scopeKey: "preview" }));
        const [fast, slow] = await fixture.requests();
        fast!.socket.receive(["EOSE", fast!.subId]);
        slow!.socket.receive(["EVENT", slow!.subId, finalizeEvent({ kind: 5, content: "", created_at: 200,
            tags: [["e", fixture.target.id]] }, fixture.targetKey)]);
        slow!.socket.receive(["EOSE", slow!.subId]);
        await vi.waitFor(() => expect(verifyDeletion).toHaveBeenCalledTimes(1));
        expect((await drain(fixture.repost())).success).toBe(true);
        expect(await fixture.db.postHistoryDeletionRequests.count()).toBe(0);
        release();
        await vi.waitFor(async () => expect(await fixture.db.postHistoryDeletionRequests.count()).toBe(1));
        expect((await drain(fixture.repost())).success).toBe(false);
        expect(fixture.signEvent).toHaveBeenCalledTimes(1); expect(fixture.sendEvent).toHaveBeenCalledTimes(1);
        expect((await fixture.db.postHistory.toArray()).filter(row => row.kind === outerKind)).toHaveLength(1);
    });
    it("publishes even when the preview relays never respond", async () => {
        const fixture = setup(targetKind, 60_000);
        await drain(fixture.repo.putPostedEvent({ event: fixture.target, relayHints: fixture.descriptor.relayHints }));
        await drain(fixture.resolver.ensureTarget({ ...fixture.descriptor, scopeKey: "preview" }));
        await fixture.requests();
        expect((await drain(fixture.repost())).success).toBe(true);
        expect(fixture.signEvent).toHaveBeenCalledTimes(1); expect(fixture.sendEvent).toHaveBeenCalledTimes(1);
        expect(fixture.fetchDeletionRequests).toHaveBeenCalledTimes(1);
    });
});
