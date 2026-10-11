import { Subject } from "rxjs";
import type { ConnectionStatePacket, MessagePacket, OutgoingMessagePacket, RxNostr } from "rx-nostr";
import { afterEach, describe, expect, it, vi } from "vitest";
import { observePostHistoryScanAuth } from "../../lib/postHistoryScanAuthObserver";

afterEach(() => vi.useRealTimers());
function setup() {
    const messages = new Subject<MessagePacket>();
    const outgoing = new Subject<OutgoingMessagePacket>();
    const connections = new Subject<ConnectionStatePacket>();
    const relay = "wss://auth.example/";
    const runtime = { createAllMessageObservable: () => messages, createOutgoingMessageObservable: () => outgoing,
        createConnectionStateObservable: () => connections } as unknown as RxNostr;
    const observer = observePostHistoryScanAuth(runtime, [relay]);
    const auth = (id: string) => outgoing.next({ to: relay, message: ["AUTH", { id }] } as unknown as OutgoingMessagePacket);
    const ok = (id: string, from = relay, accepted = true) => messages.next({ type: "OK", from, eventId: id, ok: accepted } as MessagePacket);
    return { messages, outgoing, connections, relay, runtime, observer, auth, ok };
}
describe("scan-scoped AUTH result observation", () => {
    it("invalidates IDs and prior successes when the connection or challenge changes", async () => {
        vi.useFakeTimers(); const h = setup();
        h.auth("old"); h.ok("old");
        h.connections.next({ from: h.relay, state: "terminated" });
        h.ok("old"); h.ok("publish");
        const wait = h.observer.wait(h.relay, 10, new AbortController().signal);
        await vi.advanceTimersByTimeAsync(11); expect(await wait).toBe("timeout");
        h.auth("new");
        h.messages.next({ type: "AUTH", from: h.relay } as MessagePacket);
        h.ok("new");
        const next = h.observer.wait(h.relay, 10, new AbortController().signal);
        await vi.advanceTimersByTimeAsync(11); expect(await next).toBe("timeout");
        h.observer.dispose();
    });
    it("bounds pending IDs, matches relay and releases all observers on completion", async () => {
        vi.useFakeTimers(); const h = setup();
        for (let index = 0; index < 5; index++) h.auth(`id-${index}`);
        h.ok("id-0"); h.ok("id-4", "wss://other.example/");
        const wait = h.observer.wait(h.relay, 10, new AbortController().signal);
        await vi.advanceTimersByTimeAsync(11); expect(await wait).toBe("timeout");
        h.ok("id-4"); expect(await h.observer.wait(h.relay, 10, new AbortController().signal)).toBe("success");
        h.observer.dispose();
        expect(h.messages.observed || h.outgoing.observed || h.connections.observed).toBe(false);
        const next = observePostHistoryScanAuth(h.runtime, [h.relay]);
        h.ok("id-4");
        const stale = next.wait(h.relay, 10, new AbortController().signal);
        await vi.advanceTimersByTimeAsync(11); expect(await stale).toBe("timeout"); next.dispose();
        const disposed = observePostHistoryScanAuth(h.runtime, [h.relay]);
        const pending = disposed.wait(h.relay, 100, new AbortController().signal);
        disposed.dispose(); expect(await pending).toBe("cancelled");
    });
    it("accepts early success but rejects success beyond the EOSE deadline", async () => {
        const h = setup(); h.auth("early"); h.ok("early");
        expect(await h.observer.wait(h.relay, 10, new AbortController().signal, Date.now() + 10)).toBe("success");
        expect(await h.observer.wait(h.relay, 10, new AbortController().signal, Date.now() - 100)).toBe("timeout");
        h.observer.dispose();
    });
});
