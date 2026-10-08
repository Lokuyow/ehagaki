import { afterEach, describe, expect, it } from "vitest";
import { createRxNostr, type RxNostr } from "rx-nostr";
import { verifyEvent } from "nostr-tools";
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
