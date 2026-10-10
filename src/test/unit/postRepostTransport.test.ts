import "fake-indexeddb/auto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createRxNostr, type RxNostr } from "rx-nostr";
import { finalizeEvent, generateSecretKey, getPublicKey, nip19, verifyEvent } from "nostr-tools";
import { seckeySigner } from "@rx-nostr/crypto";
import { PostRepostService } from "../../lib/postRepostService";
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

function setup(eoseTimeout = 30_000, verifyDeletion?: () => Promise<void>) {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date"] });
    const targetKey = generateSecretKey(); const ownerKey = generateSecretKey();
    const target = finalizeEvent({ kind: 1, content: "fixture", tags: [], created_at: 100 }, targetKey);
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
    const upgrade = vi.fn();
    const fetchDeletionRequests = vi.fn((...args: Parameters<typeof deletionFetch.fetchDeletionRequests>) => {
        const task = deletionFetch.fetchDeletionRequests(...args);
        return { ...task, requireComplete: () => { upgrade(); task.requireComplete?.(); } };
    });
    const resolver = createPostHistoryRelatedTargetResolver({ getShow: () => true, getRxNostr: () => rx,
        getRelayConfig: () => Object.fromEntries(urls.map(url => [url, { read: true, write: false }])),
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
    const repost = () => service.repost({ target, relayHints: descriptor.relayHints, rxNostr: rx,
        prepareTarget: (event, relayHints) => resolver.prepareRepostTarget({ ...descriptor, relayHints }, event) });
    const requests = async () => {
        await vi.waitFor(() => {
            expect(RelaySocket.instances).toHaveLength(2);
            expect(RelaySocket.instances.every(socket => socket.requests.length > 0)).toBe(true);
        });
        return RelaySocket.instances.map(socket => ({ socket, subId: socket.requests[0]![1] }));
    };
    cleanups.push(async () => { resolver.reset(); rx.dispose(); await db.delete(); });
    return { target, targetKey, repo, db, resolver, descriptor, repost, requests, signEvent, sendEvent, upgrade, fetchDeletionRequests };
}

describe("Repost deletion confirmation through real rx-nostr and secret-key signing", () => {
    it.each([false, true])("waits beyond the preview deadline and verifies a late deletion (%s)", async deleted => {
        const fixture = setup(); let settled = false;
        const operation = fixture.repost().then(result => { settled = true; return result; });
        const [fast, slow] = await fixture.requests();
        fast!.socket.receive(["EOSE", fast!.subId]);
        await vi.advanceTimersByTimeAsync(4_500);
        expect(settled).toBe(false);
        expect(fixture.signEvent).not.toHaveBeenCalled(); expect(fixture.sendEvent).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(500);
        if (deleted) slow!.socket.receive(["EVENT", slow!.subId, finalizeEvent({ kind: 5, content: "", created_at: 200,
            tags: [["e", fixture.target.id], ["k", "1"]] }, fixture.targetKey)]);
        slow!.socket.receive(["EOSE", slow!.subId]);
        const result = await drain(operation);
        expect(result.success).toBe(!deleted);
        expect(fixture.signEvent).toHaveBeenCalledTimes(deleted ? 0 : 1);
        expect(fixture.sendEvent).toHaveBeenCalledTimes(deleted ? 0 : 1);
        expect(await fixture.db.postHistoryDeletionRequests.count()).toBe(deleted ? 1 : 0);
        if (!deleted) {
            expect(verifyEvent(result.event!)).toBe(true);
            expect(result.event).toMatchObject({ kind: 6, content: "", tags: [["e", fixture.target.id, "wss://fast.example.test/"], ["p", fixture.target.pubkey]] });
            expect((await fixture.repo.getByEventId(result.eventId!))?.repostTarget?.rawEvent.id).toBe(fixture.target.id);
        }
    });
    it.each(["closed", "rx-timeout"])("does not treat %s without EOSE as confirmation", async termination => {
        const fixture = setup(1_000); const operation = fixture.repost();
        const [fast, slow] = await fixture.requests();
        fast!.socket.receive(["EOSE", fast!.subId]);
        if (termination === "closed") slow!.socket.receive(["CLOSED", slow!.subId, "error: fixture"]);
        else await vi.advanceTimersByTimeAsync(1_100);
        expect((await drain(operation)).success).toBe(false);
        expect(fixture.signEvent).not.toHaveBeenCalled(); expect(fixture.sendEvent).not.toHaveBeenCalled();
    });
    it("upgrades an in-flight preview check without issuing another deletion request", async () => {
        const fixture = setup();
        await drain(fixture.repo.putPostedEvent({ event: fixture.target, relayHints: fixture.descriptor.relayHints }));
        await drain(fixture.resolver.ensureTarget({ ...fixture.descriptor, relationKind: "quote", scopeKey: "preview" }));
        const [fast, slow] = await fixture.requests();
        fast!.socket.receive(["EOSE", fast!.subId]);
        const operation = fixture.repost();
        await vi.waitFor(() => expect(fixture.upgrade).toHaveBeenCalledTimes(1));
        await vi.advanceTimersByTimeAsync(4_500);
        slow!.socket.receive(["EOSE", slow!.subId]);
        expect((await drain(operation)).success).toBe(true);
        expect(RelaySocket.instances.every(socket => socket.requests.length === 1)).toBe(true);
        expect(fixture.signEvent).toHaveBeenCalledTimes(1);
    });
    it("waits for signature verification to drain after EOSE before checking the saved deletion", async () => {
        let release!: () => void;
        const verification = new Promise<void>(resolve => { release = resolve; });
        const verifyDeletion = vi.fn(() => verification);
        const fixture = setup(30_000, verifyDeletion);
        const operation = fixture.repost(); const [fast, slow] = await fixture.requests();
        fast!.socket.receive(["EOSE", fast!.subId]);
        slow!.socket.receive(["EVENT", slow!.subId, finalizeEvent({ kind: 5, content: "", created_at: 200,
            tags: [["e", fixture.target.id]] }, fixture.targetKey)]);
        slow!.socket.receive(["EOSE", slow!.subId]);
        await vi.waitFor(() => expect(verifyDeletion).toHaveBeenCalledTimes(1));
        expect(fixture.signEvent).not.toHaveBeenCalled(); expect(fixture.sendEvent).not.toHaveBeenCalled();
        release();
        expect((await drain(operation)).success).toBe(false);
        expect(await fixture.db.postHistoryDeletionRequests.count()).toBe(1);
        expect(fixture.signEvent).not.toHaveBeenCalled(); expect(fixture.sendEvent).not.toHaveBeenCalled();
    });
    it("cancels a foreground check during the final EOSE dispatch before signing", async () => {
        const fixture = setup(); const operation = fixture.repost();
        const requests = await fixture.requests();
        requests.forEach(({ socket, subId }) => socket.receive(["EOSE", subId]));
        fixture.resolver.invalidateScope(fixture.descriptor.scopeKey);
        expect((await drain(operation)).success).toBe(false);
        expect(fixture.signEvent).not.toHaveBeenCalled(); expect(fixture.sendEvent).not.toHaveBeenCalled();
    });
    it("keeps a bounded foreground deadline for a relay that never responds", async () => {
        const fixture = setup(60_000); const operation = fixture.repost();
        await fixture.requests();
        await vi.advanceTimersByTimeAsync(35_000);
        expect(await drain(operation)).toMatchObject({ success: false, error: "repost_deletion_unconfirmed" });
        expect(fixture.signEvent).not.toHaveBeenCalled(); expect(fixture.sendEvent).not.toHaveBeenCalled();
    });
});
