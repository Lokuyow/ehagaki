import { afterEach, describe, expect, it, vi } from "vitest";
import { createRxNostr, type RxNostr } from "rx-nostr";
import { finalizeEvent, generateSecretKey, getPublicKey, verifyEvent } from "nostr-tools";
import { PostHistoryRelayFullScanService, type PostHistoryFullScanProgress } from "../../lib/postHistoryRelayFullScanService";
import { PostHistoryRelayFetchService } from "../../lib/postHistoryRelayFetchService";
import { createNip42Authenticator, NostrAuthService } from "../../lib/nostrAuthService";
import { createPostHistoryScanVerifier, registerPostHistoryScanVerifier } from "../../lib/postHistoryRawEventVerification";
import { mockAuthStoreModule } from "../mocks/storeModules";
import type { NostrEvent } from "../../lib/types";
import { asapScheduler, mergeMap, of, scheduled } from "rxjs";

type SocketEvent = { data?: string; type?: string; code?: number; reason?: string };
class ScanSocket {
    static instances: ScanSocket[] = [];
    static respond: (socket: ScanSocket, message: unknown[]) => void;
    readyState = 0;
    requestIds: string[] = [];
    requestFilters: unknown[] = [];
    private listeners = new Map<string, Set<(event?: SocketEvent) => void>>();
    constructor(readonly url: string) {
        ScanSocket.instances.push(this);
        queueMicrotask(() => { this.readyState = 1; this.dispatch("open"); });
    }
    addEventListener(type: string, callback: (event?: SocketEvent) => void) {
        const callbacks = this.listeners.get(type) ?? new Set(); callbacks.add(callback); this.listeners.set(type, callbacks);
    }
    removeEventListener(type: string, callback: (event?: SocketEvent) => void) { this.listeners.get(type)?.delete(callback); }
    send(data: string) {
        const message = JSON.parse(data) as unknown[];
        if (message[0] === "REQ") { this.requestIds.push(message[1] as string); this.requestFilters.push(message[2]); }
        queueMicrotask(() => ScanSocket.respond(this, message));
    }
    receive(message: unknown[]) { this.dispatch("message", { type: "message", data: JSON.stringify(message) }); }
    close() { this.readyState = 3; this.dispatch("close", { type: "close", code: 1000, reason: "" }); }
    private dispatch(type: string, event?: SocketEvent) { this.listeners.get(type)?.forEach((callback) => callback(event)); }
}
const runtimes = new Set<RxNostr>();
afterEach(() => { runtimes.forEach((runtime) => runtime.dispose()); runtimes.clear(); ScanSocket.instances = []; vi.restoreAllMocks(); vi.useRealTimers(); });

function setup(mode: "eose" | "closed" | "early" | "reject" | "timeout" | "still-auth" | "closed-still-auth" | "wrong-ok" | "overflow", count = 1, deferRequestObserver = false) {
    const secret = generateSecretKey(); const owner = getPublicKey(secret);
    mockAuthStoreModule.authState.value = { ...mockAuthStoreModule.authState.value, isAuthenticated: true, pubkey: owner, type: "nip07" };
    vi.spyOn(NostrAuthService.prototype, "getEventSigner").mockResolvedValue({
        getPublicKey: async () => owner, signEvent: async (template) => finalizeEvent(template, secret),
    });
    vi.spyOn(console, "debug").mockImplementation(() => undefined);
    const cache = createPostHistoryScanVerifier(async (event) => verifyEvent(event));
    const runtime = createRxNostr({ verifier: cache.verify, authenticator: createNip42Authenticator(owner), skipVerify: false,
        skipFetchNip11: true, retry: { strategy: "off" }, websocketCtor: ScanSocket as never });
    runtimes.add(runtime); registerPostHistoryScanVerifier(runtime, cache);
    if (deferRequestObserver) {
        const outgoing = runtime.createOutgoingMessageObservable.bind(runtime);
        vi.spyOn(runtime, "createOutgoingMessageObservable").mockImplementation(() => outgoing().pipe(
            mergeMap((packet) => packet.message[0] === "REQ" ? scheduled([packet], asapScheduler) : of(packet)),
        ));
    }
    const relayUrls = Array.from({ length: count }, (_, index) => `wss://auth-${index}.example/`);
    const saved = new Map<string, NostrEvent>();
    const coverage: { since: number; until: number }[] = [];
    let pendingEose: (() => void) | null = null;
    let pendingAuthId: string | null = null;
    const extra = finalizeEvent({ kind: 1, created_at: 50, content: "only disclosed after AUTH", tags: [] }, secret);
    ScanSocket.respond = (socket, message) => {
        if (message[0] === "REQ") {
            const subId = message[1] as string;
            if (mode === "overflow") {
                for (let index = 0; index < 3; index++) socket.receive(["EVENT", subId, finalizeEvent({ kind: 1, created_at: 50, content: `overflow-${index}`, tags: [] }, secret)]);
                socket.receive(["EOSE", subId, ["finish"]]); return;
            }
            if (socket.requestIds.length === 1) {
                socket.receive(["AUTH", "synthetic challenge"]);
                if (mode === "closed" || mode === "closed-still-auth") socket.receive(["CLOSED", subId, "auth-required: fixture"]);
                else if (mode === "early") pendingEose = () => socket.receive(["EOSE", subId, ["auth", "finish"]]);
                else socket.receive(["EOSE", subId, ["auth", "finish"]]);
            } else {
                socket.receive(["EVENT", subId, extra]);
                socket.receive(["EOSE", subId, mode === "still-auth" || mode === "closed-still-auth" ? ["auth", "finish"] : ["finish"]]);
            }
        } else if (message[0] === "AUTH") {
            // Synthetic relay answers the real existing authenticator's message;
            // production scan must correlate this OK, not unrelated publish OKs.
            const id = (message[1] as { id: string }).id; pendingAuthId = id;
            socket.receive(["OK", "f".repeat(64), true, ""]);
            if (mode === "wrong-ok") {
                const other = ScanSocket.instances.find((candidate) => candidate !== socket);
                other?.receive(["OK", id, true, ""]); return;
            }
            if (mode !== "timeout") socket.receive(["OK", id, mode !== "reject", ""]);
            pendingEose?.();
        }
    };
    const fetchService = new PostHistoryRelayFetchService();
    const scan = new PostHistoryRelayFullScanService({ now: () => 100_000,
        options: { windowSeconds: 101, pageTimeoutMs: 1000, authTimeoutMs: 30, limit: mode === "overflow" ? 2 : 250 },
        fetchRelayPage: fetchService.fetchRelayPage.bind(fetchService),
        createScope: async (params) => ({ ownerPubkeyHex: owner, kindsKey: params.kinds.join(","), expectedRevision: 0, isActive: params.isActive }),
        persistBatch: async (events, _at, ranges) => {
            let insertedCount = 0;
            events.forEach(({ event }) => { if (!saved.has(event.id)) insertedCount++; saved.set(event.id, event); });
            ranges.forEach((relay) => coverage.push(...relay.ranges));
            return { insertedCount, updatedCount: 0, unchangedCount: 0, appliedDeletionCount: 0 };
        },
    });
    const relayConfig = Object.fromEntries(relayUrls.map((url) => [url, { read: true, write: true }]));
    const progress: PostHistoryFullScanProgress[] = [];
    const task = scan.start({ ownerPubkeyHex: owner, rxNostr: runtime, relayConfig,
        getCurrentScope: () => ({ ownerPubkeyHex: owner, rxNostr: runtime, relayConfig }), onProgress: (snapshot) => progress.push(snapshot) });
    return { task, saved, coverage, extra, progress, pendingId: () => pendingAuthId };
}

describe("full scan with installed rx-nostr and existing NIP-42 authenticator", () => {
    it.each(["eose", "early", "closed"] as const)("recovers post-auth events without duplicate REQ (%s)", async (mode) => {
        const state = setup(mode); const result = await state.task.promise;
        expect(result.status).toBe("completed"); expect(state.saved.has(state.extra.id)).toBe(true);
        const requests = ScanSocket.instances[0].requestIds;
        expect(requests).toHaveLength(2);
        expect(ScanSocket.instances[0].requestFilters[1]).toEqual(ScanSocket.instances[0].requestFilters[0]);
        if (mode === "closed") expect(requests[1]).toBe(requests[0]);
        else expect(requests[1]).not.toBe(requests[0]);
        expect(state.coverage).toEqual([{ since: 0, until: 100 }]);
        expect(result.relays[0].requestCount).toBe(2);
        expect(result.relays[0].receivedCount).toBe(1);
        if (mode !== "closed") expect(state.progress.some((snapshot) => snapshot.relays[0].phase === "auth" && snapshot.relays[0].status === "running")).toBe(true);
    });
    it("does not add a manual REQ when OK is observed before the automatic resend", async () => {
        const state = setup("closed-still-auth", 1, true);
        const result = await state.task.promise;
        expect(result.status).toBe("partial"); expect(result.relays[0].requestCount).toBe(2);
        expect(ScanSocket.instances[0].requestIds).toHaveLength(2); expect(state.coverage).toEqual([]);
    });
    it.each(["reject", "still-auth", "closed-still-auth"] as const)("keeps auth failure partial without looping (%s)", async (mode) => {
        const state = setup(mode); const result = await state.task.promise;
        expect(result.status).toBe("partial"); expect(state.coverage).toEqual([]);
        expect(ScanSocket.instances[0].requestIds).toHaveLength(mode === "reject" ? 1 : 2);
    });
    it.each(["timeout", "wrong-ok"] as const)("does not mistake other OKs for AUTH success (%s)", async (mode) => {
        vi.useFakeTimers(); const state = setup(mode, mode === "wrong-ok" ? 2 : 1);
        await vi.waitFor(() => expect(state.pendingId()).not.toBeNull());
        await vi.advanceTimersByTimeAsync(40);
        const result = await state.task.promise;
        expect(result.status).toBe("partial"); expect(state.coverage).toEqual([]);
        expect(ScanSocket.instances.every((socket) => socket.requestIds.length === 1)).toBe(true);
    });
    it("cancels AUTH waiting and does not apply a late matching OK", async () => {
        vi.useFakeTimers();
        const state = setup("timeout");
        await vi.waitFor(() => expect(state.pendingId()).not.toBeNull());
        expect(state.progress.at(-1)!.relays[0].phase).toBe("auth");
        state.task.cancel();
        const result = await state.task.promise;
        ScanSocket.instances[0].receive(["OK", state.pendingId(), true, ""]);
        expect(result.status).toBe("cancelled"); expect(ScanSocket.instances[0].requestIds).toHaveLength(1);
    });
    it("bounds an over-returning relay page and grants no coverage", async () => {
        const state = setup("overflow"); const result = await state.task.promise;
        expect(result.status).toBe("partial"); expect(state.saved.size).toBe(2); expect(state.coverage).toEqual([]);
    });
});
