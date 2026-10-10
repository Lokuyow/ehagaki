import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { createRxNostr, noopSigner, type RxNostr, type OkPacketAgainstEvent } from "rx-nostr";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { afterEach, describe, expect, it, vi } from "vitest";

const require = createRequire(import.meta.url);
const root = dirname(require.resolve("rx-nostr/package.json"));
const builds: [string, typeof import("rx-nostr")][] = [
    ["ESM", { createRxNostr, noopSigner } as typeof import("rx-nostr")],
    ["CJS", require("rx-nostr")],
    ["UMD", require(resolve(root, "dist/rx-nostr.umd.cjs"))],
];

class RelaySocket {
    static instances: RelaySocket[] = [];
    readyState = 0;
    sent: unknown[][] = [];
    private listeners = new Map<string, Set<(event: unknown) => void>>();
    constructor(readonly url: string) {
        RelaySocket.instances.push(this);
        queueMicrotask(() => { this.readyState = 1; this.emit("open", { type: "open" }); });
    }
    addEventListener(type: string, callback: (event: unknown) => void) {
        const callbacks = this.listeners.get(type) ?? new Set();
        callbacks.add(callback); this.listeners.set(type, callbacks);
    }
    removeEventListener(type: string, callback: (event: unknown) => void) { this.listeners.get(type)?.delete(callback); }
    send(data: string) { this.sent.push(JSON.parse(data)); }
    close() { this.readyState = 3; this.emit("close", { type: "close", code: 1000, reason: "" }); }
    receive(message: unknown[]) { this.emit("message", { type: "message", data: JSON.stringify(message) }); }
    private emit(type: string, event: unknown) { for (const cb of this.listeners.get(type) ?? []) cb(event); }
}
const clients: RxNostr[] = [];
afterEach(() => { clients.splice(0).forEach(rx => rx.dispose()); RelaySocket.instances = []; });

describe("rx-nostr #204 target relay isolation (real send)", () => {
    it.each(builds)("%s: B ACK cannot complete A or confirm its pending publish", async (_build, api) => {
        const rx = api.createRxNostr({ skipFetchNip11: true, skipVerify: true,
            websocketCtor: RelaySocket as never, retry: { strategy: "off" }, okTimeout: 60_000 });
        clients.push(rx);
        const event = finalizeEvent({ kind: 1, content: "isolation fixture", tags: [], created_at: 100 }, generateSecretKey());
        const a: OkPacketAgainstEvent[] = [], b: OkPacketAgainstEvent[] = [];
        let completeA = false, completeB = false;
        rx.send(event, { signer: api.noopSigner(), on: { relays: ["wss://a.example/"] }, completeOn: "all-ok" })
            .subscribe({ next: packet => a.push(packet), complete: () => { completeA = true; } });
        rx.send(event, { signer: api.noopSigner(), on: { relays: ["wss://b.example/"] }, completeOn: "all-ok" })
            .subscribe({ next: packet => b.push(packet), complete: () => { completeB = true; } });
        await vi.waitFor(() => {
            expect(RelaySocket.instances).toHaveLength(2);
            expect(RelaySocket.instances.every(socket => socket.sent.some(message => message[0] === "EVENT"))).toBe(true);
        });
        const socketA = RelaySocket.instances.find(socket => socket.url.includes("a.example"))!;
        const socketB = RelaySocket.instances.find(socket => socket.url.includes("b.example"))!;
        socketB.receive(["OK", event.id, true, ""]);
        expect(b.map(packet => packet.from)).toEqual(["wss://b.example"]);
        expect(completeB).toBe(true);
        expect(a).toEqual([]);
        expect(completeA).toBe(false);
        socketA.receive(["OK", event.id, true, ""]);
        expect(a.map(packet => packet.from)).toEqual(["wss://a.example"]);
        expect(completeA).toBe(true);
    });

    it.each(["all-ok", "any-ok"] as const)("ESM: resolved defaults and multiple targets remain scoped (%s)", async completeOn => {
        const rx = createRxNostr({ skipFetchNip11: true, skipVerify: true, websocketCtor: RelaySocket as never,
            retry: { strategy: "off" }, okTimeout: 60_000 });
        clients.push(rx);
        rx.setDefaultRelays([{ url: "wss://a.example/", read: false, write: true }]);
        const event = finalizeEvent({ kind: 1, content: "fixture", tags: [], created_at: 100 }, generateSecretKey());
        const a: string[] = [], b: string[] = [];
        let done = false;
        const sub = rx.send(event, { signer: noopSigner(), on: { defaultWriteRelays: true, relays: ["wss://c.example/"] }, completeOn })
            .subscribe({ next: packet => a.push(packet.from), complete: () => { done = true; } });
        rx.send(event, { signer: noopSigner(), on: { relays: ["wss://b.example/"] }, completeOn: "all-ok" }).subscribe(packet => b.push(packet.from));
        await vi.waitFor(() => expect(RelaySocket.instances.filter(socket => socket.sent.length)).toHaveLength(3));
        const socket = (host: string) => RelaySocket.instances.find(item => item.url.includes(host))!;
        socket("b.example").receive(["OK", event.id, true, ""]);
        expect(a).toEqual([]); expect(done).toBe(false);
        socket("a.example").receive(["OK", event.id, true, ""]);
        expect(done).toBe(completeOn === "any-ok");
        if (completeOn === "all-ok") {
            socket("c.example").receive(["OK", event.id, true, ""]);
            expect(done).toBe(true);
            expect(a).toEqual(["wss://a.example", "wss://c.example"]);
        }
        sub.unsubscribe();
        expect(b).toEqual(["wss://b.example"]);
    });

    it("unsubscribing A leaves disjoint B's publish pending and able to receive its ACK", async () => {
        const rx = createRxNostr({ skipFetchNip11: true, skipVerify: true, websocketCtor: RelaySocket as never, retry: { strategy: "off" } });
        clients.push(rx);
        const event = finalizeEvent({ kind: 1, content: "fixture", tags: [], created_at: 100 }, generateSecretKey());
        const a = rx.send(event, { signer: noopSigner(), on: { relays: ["wss://a.example/"] } }).subscribe();
        const received: string[] = []; let done = false;
        rx.send(event, { signer: noopSigner(), on: { relays: ["wss://b.example/"] } })
            .subscribe({ next: packet => received.push(packet.from), complete: () => { done = true; } });
        await vi.waitFor(() => expect(RelaySocket.instances.filter(socket => socket.sent.length)).toHaveLength(2));
        a.unsubscribe(); expect(done).toBe(false);
        RelaySocket.instances.find(socket => socket.url.includes("b.example"))!.receive(["OK", event.id, true, ""]);
        expect(received).toEqual(["wss://b.example"]); expect(done).toBe(true);
    });
});
