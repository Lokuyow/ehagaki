import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRxNostr } from "rx-nostr";
import { finalizeEvent, matchFilter, type Filter } from "nostr-tools";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import { DexieSensitivePayloadRepository } from "../../lib/storage/sensitivePayloadRepository";
import { DexiePostHistoryDeletionRequestsRepository } from "../../lib/storage/postHistoryDeletionRequestsRepository";
import { getPostHistoryLocalRevision } from "../../lib/storage/postHistoryLocalWriteScope";
import { DexiePostHistoryRelayCoverageRepository } from "../../lib/storage/postHistoryRelayCoverageRepository";
import { DexiePostHistoryImportedRangesRepository } from "../../lib/storage/postHistoryImportedRangesRepository";
import { LocalRelayTransport } from "../../lib/localRelayTransport";
import { PostHistoryLocalRelayService } from "../../lib/postHistoryLocalRelayService";
import { attestFullyVerifiedPostHistoryRawEvent } from "../../lib/postHistoryRawEventVerification";
import { buildSensitivePayloadEvent, buildSensitiveStructureEvent } from "../../lib/sensitiveContentPayload";
import type { NostrEvent } from "../../lib/types";
import { seckeySigner } from "@rx-nostr/crypto";
import { of } from "rxjs";
import { PostManager } from "../../lib/postManager";
import { createMockRxNostr, MockKeyManager, createMockConsole } from "../helpers";
import { beginLocalRelayDiagnostic, clearLocalRelayDiagnostics, getLocalRelayDiagnostics,
    formatLocalRelayDiagnostics, diagnosticRelayReason, isLocalRelayDebugEnabled } from "../../lib/localRelayDiagnostics";
import { configureAppRuntimeEnvironment, getAppRuntimeEnvironment } from "../../lib/appRuntimeEnvironment";

// Synthetic fixtures; no user identity or data is used by this relay.
const key = new Uint8Array(32).fill(7);
const sign = (kind: number, time = 100, tags: string[][] = [], content = `fixture-${kind}`): NostrEvent =>
    finalizeEvent({ kind, created_at: time, tags, content }, key);
const owner = sign(1).pubkey;
const url = "ws://127.0.0.1:4869/";
type SocketEvent = { data?: string; code?: number; reason?: string };
class LocalSocket {
    static instances: LocalSocket[] = [];
    static corpus: NostrEvent[] = [];
    static mode: "normal" | "reject" | "auth" | "silent" = "normal";
    static sent: unknown[][] = [];
    readyState = 0;
    private listeners = new Map<string, Set<(event: SocketEvent) => void>>();
    constructor(readonly url: string) {
        LocalSocket.instances.push(this);
        queueMicrotask(() => { this.readyState = 1; this.emit("open", {}); });
    }
    addEventListener(type: string, listener: (event: SocketEvent) => void) {
        const set = this.listeners.get(type) ?? new Set(); set.add(listener); this.listeners.set(type, set);
    }
    removeEventListener(type: string, listener: (event: SocketEvent) => void) { this.listeners.get(type)?.delete(listener); }
    close() { this.readyState = 3; this.emit("close", { code: 1000, reason: "" }); }
    private emit(type: string, event: SocketEvent) { for (const listener of this.listeners.get(type) ?? []) listener(event); }
    receive(message: unknown[]) { this.emit("message", { data: JSON.stringify(message) }); }
    send(data: string) {
        const message = JSON.parse(data) as unknown[];
        LocalSocket.sent.push(message);
        if (LocalSocket.mode === "silent") return;
        if (message[0] === "REQ") {
            if (LocalSocket.mode === "auth") { this.receive(["AUTH", "fixture-challenge"]); this.receive(["CLOSED", message[1], "auth-required: fixture"]); return; }
            const filter = message[2] as Filter;
            const events = LocalSocket.corpus.filter((event) => matchFilter(filter, event)).sort((a, b) => b.created_at - a.created_at).slice(0, filter.limit);
            events.forEach((event) => this.receive(["EVENT", message[1], event]));
            this.receive(["EOSE", message[1]]);
        }
        if (message[0] === "EVENT") {
            const event = message[1] as NostrEvent;
            if (LocalSocket.mode === "auth") { this.receive(["OK", event.id, false, "auth-required: fixture"]); return; }
            this.receive(["OK", event.id, LocalSocket.mode !== "reject", ""]);
        }
    }
}

let db: EHagakiDB;
let repository: DexiePostHistoryRepository;
let service: PostHistoryLocalRelayService;
let transport: LocalRelayTransport;
let createClient: ReturnType<typeof vi.fn<typeof createRxNostr>>;
beforeEach(() => {
    LocalSocket.instances = []; LocalSocket.sent = []; LocalSocket.corpus = []; LocalSocket.mode = "normal";
    db = new EHagakiDB(`local-relay-test-${crypto.randomUUID()}`);
    repository = new DexiePostHistoryRepository(db);
    createClient = vi.fn<typeof createRxNostr>((config) => createRxNostr({ ...config, websocketCtor: LocalSocket as never }));
    transport = new LocalRelayTransport(createClient);
    service = new PostHistoryLocalRelayService({ transport, repository,
        payloads: new DexieSensitivePayloadRepository(db), deletions: new DexiePostHistoryDeletionRequestsRepository(db),
        getLocalRevision: (pubkey) => getPostHistoryLocalRevision(db, pubkey), runtimeKind: () => "standalone" });
});
afterEach(async () => { service.cancelSession(); vi.useRealTimers(); await db.delete(); clearLocalRelayDiagnostics(); window.history.replaceState({}, "", "/"); });
const configure = () => service.configureSession({ ownerPubkeyHex: owner, url, isActive: () => true });
const read = (until = 200, limit = 150) => service.read({ pubkeyHex: owner, until, limit, isActive: () => true });

describe("local relay with real rx-nostr verification and IndexedDB", () => {
    it("does no I/O when unset or in an embed runtime", async () => {
        expect(await read().promise).toBeNull();
        for (const runtimeKind of ["iframe", "web-component"]) {
            const embedded = new PostHistoryLocalRelayService({ transport, runtimeKind: () => runtimeKind });
            embedded.configureSession({ ownerPubkeyHex: owner, url, isActive: () => true });
            expect(await embedded.read({ pubkeyHex: owner, isActive: () => true }).promise).toBeNull();
            embedded.storeSignedEventBestEffort(attestFullyVerifiedPostHistoryRawEvent(sign(1))!);
        }
        expect(LocalSocket.instances).toHaveLength(0);
    });

    it("merges every authored kind, dedupes, and keeps local URLs out of provenance and coverage", async () => {
        configure();
        LocalSocket.corpus = [1, 6, 16, 42, 1111].map((kind) => sign(kind));
        LocalSocket.corpus.push({ ...sign(1, 101), sig: "0".repeat(128) }, sign(0), sign(7));
        const coverage = new DexiePostHistoryRelayCoverageRepository(db);
        const imported = new DexiePostHistoryImportedRangesRepository(db);
        const beforeCoverage = await coverage.get(owner, "1,6,16,42,1111");
        const beforeImported = await imported.get(owner, "1,6,16,42,1111");
        expect(await read().promise).toMatchObject({ changed: true, hasMore: false });
        expect(await read().promise).toMatchObject({ changed: false });
        const posts = await repository.getAll({ pubkeyHex: owner });
        expect(posts.map((post) => post.kind).sort((a, b) => a - b)).toEqual([1, 6, 16, 42, 1111]);
        expect(posts.every((post) => !post.acceptedRelays.length && !post.relayHints.length && !post.fetchedRelays?.length)).toBe(true);
        expect(await coverage.get(owner, "1,6,16,42,1111")).toEqual(beforeCoverage);
        expect(await imported.get(owner, "1,6,16,42,1111")).toEqual(beforeImported);
        expect(LocalSocket.sent.filter(([type]) => type === "EVENT")).toHaveLength(0);
        expect(LocalSocket.instances.every((socket) => socket.readyState === 3)).toBe(true);
    });

    it("uses the existing inclusive pagination and limit without a density algorithm", async () => {
        configure(); LocalSocket.corpus = [100, 99, 98, 97].map((time) => sign(1, time));
        const first = await read(200, 2).promise;
        expect(first).toMatchObject({ hasMore: true, nextUntil: 99 });
        await read(first!.nextUntil!, 2).promise;
        expect(await repository.countForPubkey(owner)).toBe(3);
        const filters = LocalSocket.sent.filter(([type]) => type === "REQ").map((message) => message[2] as Filter);
        expect(filters.filter((filter) => filter.kinds?.includes(1)).map((filter) => filter.limit)).toEqual([2, 2]);
    });

    it("reads only linked payloads and targeted deletions, including deletion of a saved row", async () => {
        configure();
        const payload = finalizeEvent(buildSensitivePayloadEvent(1, "fixture body", owner, 100), key);
        const structure = finalizeEvent(buildSensitiveStructureEvent({ kind: 1, created_at: 100,
            pubkey: owner, content: "fixture body", tags: [["content-warning", "fixture"]] }, payload.id), key);
        const saved = sign(1, 90);
        await repository.putPostedEvent({ event: saved });
        const deletion = sign(5, 110, [["e", saved.id], ["k", "1"]], "");
        LocalSocket.corpus = [structure, payload, deletion, sign(36, 120), sign(5, 120, [["e", "a".repeat(64)]])];
        await service.read({ pubkeyHex: owner, until: 200, targets: [saved], isActive: () => true }).promise;
        expect(await db.sensitivePayloads.count()).toBe(1);
        expect((await repository.getByEventId(saved.id))?.deletionEventId).toBe(deletion.id);
        expect((await repository.getByEventId(structure.id))?.deletedAt).toBeUndefined();
        expect(LocalSocket.sent.filter(([type]) => type === "EVENT")).toHaveLength(0);
        expect((await db.postHistoryDeletionRequests.toArray()).every((record) => !record.relayUrls.length)).toBe(true);
    });

    it("ends AUTH-required reads and stores without signing AUTH or retrying", async () => {
        configure(); LocalSocket.mode = "auth";
        expect(await read().promise).toBeNull();
        expect(await transport.storeSignedEvent(url, sign(1), new AbortController().signal).promise).toBe(false);
        expect(LocalSocket.sent.some(([type]) => type === "AUTH")).toBe(false);
        expect(LocalSocket.sent.filter(([type]) => type === "REQ")).toHaveLength(1);
        expect(await repository.countForPubkey(owner)).toBe(0);
    });

    it("disposes a stalled request on cancellation and never adopts its late response", async () => {
        configure(); LocalSocket.mode = "silent";
        const task = read();
        await vi.waitFor(() => expect(LocalSocket.sent.some(([type]) => type === "REQ")).toBe(true));
        service.cancelSession();
        expect(await task.promise).toBeNull();
        configure();
        const request = LocalSocket.sent.find(([type]) => type === "REQ")!;
        LocalSocket.instances[0].receive(["EVENT", request[1], sign(1)]);
        expect(await repository.countForPubkey(owner)).toBe(0);
        expect(LocalSocket.instances[0].readyState).toBe(3);
    });

    it("bounds a silent relay without reconnecting or retaining a delivery", async () => {
        configure(); LocalSocket.mode = "silent";
        const task = read();
        await vi.waitFor(() => expect(LocalSocket.sent.some(([type]) => type === "REQ")).toBe(true));
        vi.useFakeTimers();
        // Timers created before fake timers stay native; exercise the transport's
        // store deadline with controlled timers and cancel the read independently.
        const store = transport.storeSignedEvent(url, sign(1), new AbortController().signal);
        await vi.advanceTimersByTimeAsync(6000);
        expect(await store.promise).toBeNull();
        task.cancel(); expect(await task.promise).toBeNull();
        expect(LocalSocket.instances.every(socket => socket.readyState === 3)).toBe(true);
        expect(LocalSocket.sent.filter(([type]) => type === "EVENT")).toHaveLength(1);
    });

    it("URL and identity changes cancel the old read and reject mismatched store ownership", async () => {
        configure(); LocalSocket.mode = "silent";
        const task = read();
        await vi.waitFor(() => expect(LocalSocket.sent.some(([type]) => type === "REQ")).toBe(true));
        const other = finalizeEvent({ kind: 1, created_at: 100, content: "other fixture", tags: [] }, new Uint8Array(32).fill(9));
        service.configureSession({ ownerPubkeyHex: other.pubkey, url: "ws://localhost:4869/", isActive: () => true });
        expect(await task.promise).toBeNull();
        service.storeSignedEventBestEffort(attestFullyVerifiedPostHistoryRawEvent(sign(1))!);
        expect(LocalSocket.sent.filter(([type]) => type === "EVENT")).toHaveLength(0);
        LocalSocket.mode = "normal"; LocalSocket.corpus = [other, sign(1)];
        await service.read({ pubkeyHex: other.pubkey, isActive: () => true }).promise;
        expect((await repository.getAll({ pubkeyHex: other.pubkey })).map(post => post.eventId)).toEqual([other.id]);
        expect(await repository.countForPubkey(owner)).toBe(0);
    });

    it("rejects results after the local history revision changes", async () => {
        configure(); LocalSocket.mode = "silent";
        const task = read();
        await vi.waitFor(() => expect(LocalSocket.sent.some(([type]) => type === "REQ")).toBe(true));
        await repository.deleteLocalHistoryForPubkey(owner);
        const request = LocalSocket.sent.find(([type]) => type === "REQ")!;
        LocalSocket.instances[0].receive(["EVENT", request[1], sign(1)]);
        LocalSocket.instances[0].receive(["EOSE", request[1]]);
        expect(await task.promise).toBeNull();
        expect(await repository.countForPubkey(owner)).toBe(0);
    });

    it("archives only exact adopted authored events and never adds local hints", async () => {
        configure(); const event = sign(1);
        const attested = attestFullyVerifiedPostHistoryRawEvent(event)!;
        await service.archiveAdoptedAuthored([attested], { ownerPubkeyHex: owner, isActive: () => true });
        expect(LocalSocket.sent).toHaveLength(0);
        await repository.upsertFetchedEvents({ events: [{ ...attested, relayUrls: ["wss://external.example/"] }] });
        await service.archiveAdoptedAuthored([attested, { event: { ...event, content: "conflict" } }, { event: sign(7) }],
            { ownerPubkeyHex: owner, isActive: () => true });
        await vi.waitFor(() => expect(LocalSocket.sent.filter(([type]) => type === "EVENT")).toHaveLength(1));
        expect(LocalSocket.sent.find(([type]) => type === "EVENT")?.[1]).toEqual(JSON.parse(JSON.stringify(event)));
        expect((await repository.getByEventId(event.id))?.fetchedRelays).toEqual(["wss://external.example/"]);
    });

    it.each([150, 250])("archives %s unique events on one client/socket without awaiting ACKs", async (size) => {
        const payload = finalizeEvent(buildSensitivePayloadEvent(1, "shared batch payload", owner, 100), key);
        const structures = ["first", "second"].map(label => finalizeEvent(buildSensitiveStructureEvent({ kind: 1,
            created_at: 100, pubkey: owner, content: "shared batch payload", tags: [["content-warning", label]] }, payload.id), key));
        const authored = [...structures, ...Array.from({ length: size - 4 }, (_, index) => sign(1, 200 + index))];
        const deletion = sign(5, 600, [["e", authored[2].id], ["e", authored[3].id], ["k", "1"]], "");
        const attested = authored.map(event => attestFullyVerifiedPostHistoryRawEvent(event)!);
        await repository.upsertFetchedEvents({ events: attested });
        await new DexieSensitivePayloadRepository(db).putCandidate({ event: payload });
        await new DexiePostHistoryDeletionRequestsRepository(db).upsertValidDeletionRequests({
            targetEvents: authored.slice(2, 4), deletionEvents: [{ event: deletion }], fetchedAt: 100_000,
        });
        configure(); LocalSocket.mode = "silent";
        // Includes duplicate authored rows, a shared Payload, and two deletion
        // reference rows for the same signed kind 5 event.
        await service.archiveAdoptedAuthored([...attested, ...attested], { ownerPubkeyHex: owner, isActive: () => true });
        await vi.waitFor(() => expect(LocalSocket.sent.filter(([type]) => type === "EVENT")).toHaveLength(size));
        const actual = LocalSocket.sent.map(message => (message[1] as NostrEvent).id);
        expect(new Set(actual)).toEqual(new Set([...authored, payload, deletion].map(event => event.id)));
        expect(createClient).toHaveBeenCalledOnce();
        expect(LocalSocket.instances).toHaveLength(1);
        expect(LocalSocket.instances[0].readyState).toBe(1); // All ACKs are still withheld.
        await service.archiveAdoptedAuthored(attested, { ownerPubkeyHex: owner, isActive: () => true });
        expect(createClient).toHaveBeenCalledOnce(); // Overlapping in-flight IDs are not resent.
        service.cancelSession();
        await vi.waitFor(() => expect(LocalSocket.instances[0].readyState).toBe(3));
    });

    it("settles mixed batch ACKs on the shared socket, including rejection and duplicate IDs", async () => {
        LocalSocket.mode = "silent";
        const events = [sign(1, 100), sign(1, 101), sign(1, 102)];
        const task = transport.storeSignedEvents(url, [...events, events[0]], new AbortController().signal);
        await vi.waitFor(() => expect(LocalSocket.sent.filter(([type]) => type === "EVENT")).toHaveLength(3));
        const socket = LocalSocket.instances[0];
        let finished = false; void task.promise.then(() => { finished = true; });
        socket.receive(["OK", events[1].id, false, "restricted: fixture"]);
        socket.receive(["OK", events[0].id, true, ""]);
        await Promise.resolve(); expect(finished).toBe(false);
        socket.receive(["OK", events[2].id, true, ""]);
        expect(await task.promise).toBe(false);
        expect(createClient).toHaveBeenCalledOnce(); expect(LocalSocket.instances).toHaveLength(1);
        expect(socket.readyState).toBe(3);
    });

    it("times out one silent batch and never reconnects or retries its events", async () => {
        vi.useFakeTimers(); LocalSocket.mode = "silent";
        const task = transport.storeSignedEvents(url, [sign(1, 100), sign(1, 101)], new AbortController().signal);
        await vi.advanceTimersByTimeAsync(6000);
        expect(await task.promise).toBeNull();
        await vi.advanceTimersByTimeAsync(12_000);
        expect(createClient).toHaveBeenCalledOnce(); expect(LocalSocket.instances).toHaveLength(1);
        expect(LocalSocket.sent.filter(([type]) => type === "EVENT")).toHaveLength(2);
        expect(LocalSocket.instances[0].readyState).toBe(3);
    });

    it("retains a linked kind 36 deletion and archives only the adopted pair's auxiliary events", async () => {
        configure();
        const payload = finalizeEvent(buildSensitivePayloadEvent(1, "fixture body", owner, 100), key);
        const structure = finalizeEvent(buildSensitiveStructureEvent({ kind: 1, created_at: 100,
            pubkey: owner, content: "fixture body", tags: [["content-warning", "fixture"]] }, payload.id), key);
        const deletion = sign(5, 110, [["e", payload.id], ["k", "36"]], "");
        LocalSocket.corpus = [structure, payload, deletion];
        await read().promise;
        expect((await db.postHistoryDeletionRequests.toArray()).map(record => record.deletionEventId)).toEqual([deletion.id]);
        expect(LocalSocket.sent.filter(([type]) => type === "EVENT")).toHaveLength(0);
        const attested = attestFullyVerifiedPostHistoryRawEvent(structure)!;
        await repository.upsertFetchedEvents({ events: [{ ...attested, relayUrls: ["wss://external.example/"] }] });
        await service.archiveAdoptedAuthored([attested], { ownerPubkeyHex: owner, isActive: () => true });
        await vi.waitFor(() => expect(LocalSocket.sent.filter(([type]) => type === "EVENT").some(message =>
            (message[1] as NostrEvent).id === deletion.id)).toBe(true));
        expect(LocalSocket.sent.filter(([type]) => type === "EVENT").every(message =>
            [structure.id, payload.id, deletion.id].includes((message[1] as NostrEvent).id))).toBe(true);
    });
});

describe("temporary local relay diagnostics", () => {
    beforeEach(() => { window.history.replaceState({}, "", "/?localRelayDebug=1"); clearLocalRelayDiagnostics(); });
    const trace = () => beginLocalRelayDiagnostic("post-direct")!;
    const latest = () => getLocalRelayDiagnostics()[0];
    const input = () => attestFullyVerifiedPostHistoryRawEvent(sign(1, 100, [["fixture", "PRIVATE_TAG"]], "PRIVATE_CONTENT"))!;

    it("runs the real secret-key signer, hook, service, rx-nostr and socket through accepted", async () => {
        configure();
        const rx = createMockRxNostr();
        rx.getDefaultRelays = () => ({ "wss://external.example/": { url: "wss://external.example/", read: true, write: true } });
        rx.send = vi.fn<typeof rx.send>(event => of({ type: "OK", eventId: event.id!, from: "wss://external.example/",
            ok: true, done: true, message: ["OK", event.id!, true, ""] }));
        const manager = new PostManager(rx, {
            console: createMockConsole(),
            authStateStore: { value: { type: "nsec", isAuthenticated: true, pubkey: owner, npub: "fixture", nprofile: "fixture",
                isValid: true, isInitialized: true, isExtensionLogin: false } },
            keyManager: new MockKeyManager("07".repeat(32)), seckeySignerFn: seckeySigner,
            hashtagStore: { hashtags: [], tags: [] }, contentWarningStore: { value: false, reset() {} },
            contentWarningReasonStore: { value: "", reset() {} }, writeRelaysStore: { value: ["wss://external.example/"] },
            settingsStore: { quoteNotificationEnabled: false }, replyQuoteState: { value: { reply: null, quotes: [] } } as never,
            savePostHistoryFn: vi.fn(), storeSignedEventFn: (input, active, trace) => service.storeSignedEventBestEffort(input, active, trace),
            resetEditorStateFn() {}, resetPostStatusFn() {}, saveHashtagsToHistoryFn() {}, clearReplyQuoteFn() {},
            notificationPort: { notifyPostSuccess: () => true, notifyPostError: () => true },
        });
        expect((await manager.submitPost("PRIVATE_POST_BODY")).success).toBe(true);
        await vi.waitFor(() => expect(latest().terminal).toBe("accepted"));
        expect(latest().source).toBe("post-direct");
        expect(latest().entries.map(entry => entry.stage)).toEqual(expect.arrayContaining([
            "hook-invoked", "service-entered", "session-check", "candidate-accepted", "batch-microtask",
            "transport-call", "transport-entered", "client-created", "websocket-state", "event-socket-send-boundary", "relay-response", "terminal",
        ]));
        expect(latest().entries.some(entry => entry.details.state === "connected")).toBe(true);
        expect(LocalSocket.sent.filter(([type]) => type === "EVENT")).toHaveLength(1);
        expect(formatLocalRelayDiagnostics()).not.toContain("PRIVATE_POST_BODY");
    });

    it("reports a missing session", () => {
        service.storeSignedEventBestEffort(input(), () => true, trace());
        expect(latest().terminal).toBe("skipped-session");
        expect(latest().entries.some(entry => entry.details.reason === "no-configured-session")).toBe(true);
        expect(createClient).not.toHaveBeenCalled();
    });

    it.each(["app", "caller"])("reports %s inactive without extra callback evaluations", which => {
        const app = vi.fn(() => which !== "app"), caller = vi.fn(() => which !== "caller");
        service.configureSession({ ownerPubkeyHex: owner, url, isActive: app });
        service.storeSignedEventBestEffort(input(), caller, trace());
        expect(latest().terminal).toBe(which === "app" ? "skipped-session" : "skipped-inactive");
        expect(latest().entries.some(entry => entry.details.reason === `${which}-inactive`)).toBe(true);
        expect(app).toHaveBeenCalledTimes(which === "app" ? 1 : 2);
        expect(caller).toHaveBeenCalledTimes(which === "app" ? 0 : 1);
        expect(createClient).not.toHaveBeenCalled();
    });

    it("reports caller invalidation in the original microtask", async () => {
        configure(); let active = true;
        service.storeSignedEventBestEffort(input(), () => active, trace()); active = false;
        await Promise.resolve();
        expect(latest().terminal).toBe("skipped-inactive");
        expect(latest().entries.some(entry => entry.stage === "microtask-check" && entry.details.callerActive === false)).toBe(true);
        expect(createClient).not.toHaveBeenCalled();
    });

    it.each(["unsupported-kind", "attestation-invalid", "in-flight-duplicate"])("reports candidate filtering: %s", async reason => {
        configure(); const candidate = input();
        if (reason === "unsupported-kind") candidate.event = sign(7);
        if (reason === "attestation-invalid") candidate.event.content = "changed";
        if (reason === "in-flight-duplicate") { LocalSocket.mode = "silent"; service.storeSignedEventBestEffort(candidate, () => true, trace()); }
        service.storeSignedEventBestEffort(candidate, () => true, trace());
        expect(latest().terminal).toBe("filtered");
        expect(latest().entries.some(entry => entry.stage === "candidate-filtered" && entry.details.reason === reason)).toBe(true);
    });

    it("reports a transport deadline without retrying or altering its duration", async () => {
        vi.useFakeTimers(); configure(); LocalSocket.mode = "silent";
        service.storeSignedEventBestEffort(input(), () => true, trace());
        await vi.advanceTimersByTimeAsync(5999);
        expect(latest().terminal).toBeNull();
        await vi.advanceTimersByTimeAsync(1);
        expect(latest().terminal).toBe("timeout");
        expect(latest().entries.some(entry => entry.details.reason === "timeout-abort")).toBe(true);
        expect(createClient).toHaveBeenCalledOnce();
        expect(LocalSocket.instances).toHaveLength(1);
    });

    it("reports session AbortSignal and its cancellation cause", async () => {
        configure(); LocalSocket.mode = "silent";
        service.storeSignedEventBestEffort(input(), () => true, trace());
        await vi.waitFor(() => expect(LocalSocket.sent.some(([type]) => type === "EVENT")).toBe(true));
        service.cancelSession("url-change");
        await vi.waitFor(() => expect(latest().terminal).toBe("aborted"));
        expect(latest().entries.some(entry => entry.details.reason === "url-change")).toBe(true);
        expect(LocalSocket.instances.every(socket => socket.readyState === 3)).toBe(true);
    });

    it("reports rejected and AUTH-required responses", async () => {
        configure(); LocalSocket.mode = "auth";
        service.storeSignedEventBestEffort(input(), () => true, trace());
        await vi.waitFor(() => expect(latest().terminal).toBe("rejected"));
        expect(latest().entries.some(entry => entry.details.ok === false && entry.details.reason === "auth-required")).toBe(true);
        expect(LocalSocket.sent.some(([type]) => type === "AUTH")).toBe(false);
    });

    it("reports exceptions without retaining their message", async () => {
        configure(); createClient.mockImplementation(() => { throw new Error("SECRET_ERROR_CONTENT"); });
        service.storeSignedEventBestEffort(input(), () => true, trace());
        await vi.waitFor(() => expect(latest().terminal).toBe("exception"));
        expect(formatLocalRelayDiagnostics()).not.toContain("SECRET_ERROR_CONTENT");
    });

    it("correlates an adopted history archive separately through accepted", async () => {
        configure(); const candidate = input();
        await repository.upsertFetchedEvents({ events: [{ ...candidate, relayUrls: ["wss://external.example/"] }] });
        await service.archiveAdoptedAuthored([candidate], { ownerPubkeyHex: owner, isActive: () => true });
        await vi.waitFor(() => expect(latest().terminal).toBe("accepted"));
        expect(latest().source).toBe("history-archive");
        expect(latest().entries.map(entry => entry.stage)).toEqual(expect.arrayContaining([
            "archive-entered", "db-verification-passed", "archive-adopted", "archive-candidates", "batch-entered", "transport-call", "event-socket-send-boundary",
        ]));
        const diagnostic = formatLocalRelayDiagnostics();
        expect(diagnostic).not.toContain(candidate.event.content);
        expect(diagnostic).not.toContain("PRIVATE_TAG");
        expect(diagnostic).not.toContain(candidate.event.sig);
        expect(diagnostic).not.toContain(candidate.event.pubkey);
    });

    it("drops unknown fields, full IDs, URL secrets and arbitrary relay notices", () => {
        const candidate = input();
        const operation = trace();
        operation.record("hook-invoked", { eventId: candidate.event.id, content: "PRIVATE_CONTENT", tags: ["PRIVATE_TAG"],
            reason: "SECRET_REASON", errorType: "SECRET_ERROR", target: "ws://user:SECRET_CREDENTIAL@localhost:4869/PRIVATE_PATH?token=PRIVATE_TOKEN" } as never);
        operation.record("relay-response", { reason: diagnosticRelayReason("invalid: PRIVATE_CONTENT PRIVATE_TOKEN") });
        operation.record("relay-response", { reason: diagnosticRelayReason("PRIVATE_CONTENT PRIVATE_TOKEN") });
        operation.finish("accepted");
        const diagnostic = formatLocalRelayDiagnostics();
        for (const privateValue of ["PRIVATE_CONTENT", "PRIVATE_TAG", "SECRET_REASON", "SECRET_ERROR", "SECRET_CREDENTIAL", "PRIVATE_PATH", "PRIVATE_TOKEN", candidate.event.id])
            expect(diagnostic).not.toContain(privateValue);
        expect(diagnostic).toContain(candidate.event.id.slice(0, 12));
        expect(diagnostic).toContain("ws://localhost:4869/");
    });

    it("does not record or enable diagnostics for normal queries or embed runtimes", () => {
        window.history.replaceState({}, "", "/?localRelayDebug=0");
        expect(beginLocalRelayDiagnostic("post-direct")).toBeUndefined();
        window.history.replaceState({}, "", "/?localRelayDebug=1");
        const runtime = getAppRuntimeEnvironment();
        try {
            for (const runtimeKind of ["iframe", "web-component"] as const) {
                configureAppRuntimeEnvironment({ runtimeKind });
                expect(isLocalRelayDebugEnabled()).toBe(false);
                expect(beginLocalRelayDiagnostic("post-direct")).toBeUndefined();
            }
        } finally { configureAppRuntimeEnvironment(runtime); }
        expect(getLocalRelayDiagnostics()).toEqual([]);
    });
});
