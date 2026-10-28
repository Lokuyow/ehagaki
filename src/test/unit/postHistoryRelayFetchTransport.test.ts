import { afterEach, describe, expect, it } from "vitest";
import { createRxNostr, createRxBackwardReq, type RxNostr } from "rx-nostr";
import { finalizeEvent, generateSecretKey, verifyEvent } from "nostr-tools";
import { useRelayQuery, type RelayQuerySummary } from "../../lib/relay/query";
import { PostHistoryRelayFetchService } from "../../lib/postHistoryRelayFetchService";
import { getPostHistoryQuorumCoverage } from "../../lib/postHistoryRelayCoverage";

// Only the socket boundary is synthetic: use(), auto-close and message ordering
// are the installed rx-nostr implementation, including its synchronous fin$.
class RelaySocket {
    static instances: RelaySocket[] = [];
    static onCreated: (() => void) | undefined;
    readyState = 0;
    readonly firstRequest: Promise<unknown[]>;
    private onRequest!: (request: unknown[]) => void;
    private listeners = new Map<string, Set<(event?: any) => void>>();
    constructor(readonly url: string) {
        this.firstRequest = new Promise((resolve) => { this.onRequest = resolve; });
        RelaySocket.instances.push(this);
        RelaySocket.onCreated?.();
        queueMicrotask(() => { this.readyState = 1; this.dispatch("open"); });
    }
    addEventListener(type: string, callback: (event?: any) => void) {
        const callbacks = this.listeners.get(type) ?? new Set();
        callbacks.add(callback); this.listeners.set(type, callbacks);
    }
    removeEventListener(type: string, callback: (event?: any) => void) { this.listeners.get(type)?.delete(callback); }
    send(data: string) {
        const message = JSON.parse(data) as unknown[];
        if (message[0] === "REQ") this.onRequest(message);
    }
    close() { this.readyState = 3; this.dispatch("close", { type: "close", code: 1000, reason: "" }); }
    receive(message: unknown[]) { this.dispatch("message", { type: "message", data: JSON.stringify(message) }); }
    private dispatch(type: string, event?: any) {
        for (const callback of this.listeners.get(type) ?? []) callback(event);
    }
}
const runtimes = new Set<RxNostr>();
afterEach(() => { for (const runtime of runtimes) runtime.dispose(); runtimes.clear(); RelaySocket.instances = []; RelaySocket.onCreated = undefined; });

function fetch(total: number) {
    const socketsReady = new Promise<RelaySocket[]>((resolve) => {
        RelaySocket.onCreated = () => {
            if (RelaySocket.instances.length === total) resolve([...RelaySocket.instances]);
        };
    });
    const rxNostr = createRxNostr({ verifier: async (event) => verifyEvent(event), skipFetchNip11: true,
        retry: { strategy: "off" }, websocketCtor: RelaySocket as never });
    runtimes.add(rxNostr);
    const urls = Array.from({ length: total }, (_, i) => `wss://transport-${i}.example.test/`);
    const task = new PostHistoryRelayFetchService().fetchLatest(rxNostr, {
        pubkeyHex: "a".repeat(64), relayConfig: Object.fromEntries(urls.map((url) => [url, { read: true, write: false }])),
        since: 10, until: 200,
    });
    return { task, urls, socketsReady };
}

describe("authored coverage with the real rx-nostr transport pipeline", () => {
    it("isolates per-relay REQs and drains signature verification before quorum settlement", async () => {
        const total = 5;
        const socketsReady = new Promise<RelaySocket[]>(resolve => {
            RelaySocket.onCreated = () => { if (RelaySocket.instances.length === total) resolve([...RelaySocket.instances]); };
        });
        let release!: () => void;
        const verification = new Promise<void>(resolve => { release = resolve; });
        const rx = createRxNostr({ verifier: async event => { await verification; return verifyEvent(event); },
            skipFetchNip11: true, retry: { strategy: "off" }, websocketCtor: RelaySocket as never });
        runtimes.add(rx);
        const urls = Array.from({ length: total }, (_, i) => `wss://query-${i}.example.test/`);
        const req = createRxBackwardReq("isolated-query");
        const events: string[] = [];
        let summary: RelayQuerySummary | undefined;
        let ended = false;
        const completed = new Promise<void>((resolve, reject) => {
            useRelayQuery(rx, req, { on: { relays: urls } }, { onEnd: result => { summary = result; } }).subscribe({
                next: packet => events.push(packet.event.id), error: reject, complete: () => { ended = true; resolve(); },
            });
        });
        req.emit({ kinds: [1] }); req.over();
        const sockets = await socketsReady;
        const requests = await Promise.all(sockets.map(socket => socket.firstRequest));
        expect(new Set(requests.map(request => request[1])).size).toBe(total);
        const event = finalizeEvent({ kind: 1, content: "synthetic query", created_at: 100, tags: [] }, generateSecretKey());
        sockets[0].receive(["EVENT", requests[0][1], event]);
        for (let i = 0; i < 3; i++) sockets[i].receive(["EOSE", requests[i][1]]);
        await Promise.resolve();
        expect(ended).toBe(false);
        release();
        await completed;
        expect(events).toEqual([event.id]);
        expect(summary).toEqual({ reason: "quorum", complete: false, eoseRelays: urls.slice(0, 3) });
    });
    it.each([[1, 1], [2, 1], [3, 2]])("retains empty EOSE quorum with %i relays and %i successes", async (total, successes) => {
        const { task, urls, socketsReady } = fetch(total);
        const sockets = await socketsReady;
        const requests = await Promise.all(sockets.map((socket) => socket.firstRequest));
        for (const [i, socket] of sockets.entries()) socket.receive(i < successes
            ? ["EOSE", requests[i][1]] : ["CLOSED", requests[i][1], "error: synthetic"]);
        const result = await task.promise;
        expect(result.events).toEqual([]);
        expect(result.completedByLocalTimeout).toBe(false);
        expect(result.eoseRelayUrls).toEqual(urls.slice(0, successes));
        expect(result.relayOutcomes?.filter((outcome) => outcome.termination === "eose")).toHaveLength(successes);
        expect(getPostHistoryQuorumCoverage(result.relayFetchCoverage!, urls)).toEqual([{ since: 10, until: 200 }]);
    });
    it("still suppresses an empty EOSE result when explicitly cancelled during packet dispatch", async () => {
        const { task, socketsReady } = fetch(1);
        const [socket] = await socketsReady;
        const request = await socket.firstRequest;
        socket.receive(["EOSE", request[1]]);
        task.cancel();
        expect(await task.promise).toMatchObject({ status: "cancelled", relayFetchCoverage: [] });
    });
});
