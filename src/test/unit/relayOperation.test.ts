import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Subject } from "rxjs";
import { createRxBackwardReq, type RxNostr } from "rx-nostr";
import { RelayOperation, createRelayQueryCompletion } from "../../lib/relay/operation";
import { useRelayQuery, type RelayQuerySummary } from "../../lib/relay/query";
import { startRelayPublish, cancelRelayOperations } from "../../lib/relay/publish";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());
const urls = Array.from({ length: 5 }, (_, i) => `wss://relay-${i}.example/`);

describe("common relay waiting", () => {
    it("calls injected native timers without binding the operation as their receiver", async () => {
        const end = vi.fn();
        new RelayOperation(10, end, {
            setTimeoutFn: function(this: unknown, fn, ms) { expect(this).toBeUndefined(); return setTimeout(fn, ms); },
            clearTimeoutFn: function(this: unknown, timer) { expect(this).toBeUndefined(); clearTimeout(timer); },
        });
        await vi.advanceTimersByTimeAsync(10);
        expect(end).toHaveBeenCalledExactlyOnceWith("timeout");
    });
    it("finishes 300ms after 3/5 drained EOSEs, with a single active timer", async () => {
        const end = vi.fn();
        const operation = new RelayOperation(6_000, end);
        const states = urls.map(() => ({ eoseReceived: false, verificationDrained: false, finished: false }));
        const reconcile = createRelayQueryCompletion(operation, states, true);
        for (const state of states.slice(0, 3)) Object.assign(state, { eoseReceived: true, verificationDrained: true, finished: true });
        reconcile(); await Promise.resolve();
        expect(vi.getTimerCount()).toBe(1);
        await vi.advanceTimersByTimeAsync(299);
        expect(end).not.toHaveBeenCalled();
        reconcile();
        await vi.advanceTimersByTimeAsync(1);
        expect(end).toHaveBeenCalledExactlyOnceWith("quorum");
        expect(vi.getTimerCount()).toBe(0);
    });

    it("does not count undrained EOSE, lower the denominator, or extend the hard deadline", async () => {
        const end = vi.fn();
        const operation = new RelayOperation(6_000, end);
        const states = urls.map(() => ({ eoseReceived: false, verificationDrained: false, finished: false }));
        const reconcile = createRelayQueryCompletion(operation, states, true);
        Object.assign(states[0], { eoseReceived: true, verificationDrained: true, finished: true });
        Object.assign(states[1], { eoseReceived: true, verificationDrained: true, finished: true });
        states[2].eoseReceived = true;
        states[3].finished = true;
        reconcile(); await vi.advanceTimersByTimeAsync(5_900);
        expect(end).not.toHaveBeenCalled();
        Object.assign(states[2], { verificationDrained: true, finished: true });
        reconcile(); await vi.advanceTimersByTimeAsync(100);
        expect(end).toHaveBeenCalledExactlyOnceWith("timeout");
        expect(vi.getTimerCount()).toBe(0);
    });

    it("isolates subscriptions and retains partial results without claiming complete evidence", async () => {
        const messages = new Subject<any>();
        const streams = new Map<string, Subject<any>>();
        const rx = { createAllMessageObservable: () => messages, use: (_req: unknown, options: any) => {
            const source = new Subject<any>(); streams.set(options.on.relays[0], source); return source;
        } } as unknown as RxNostr;
        const req = createRxBackwardReq("common-query");
        const results: unknown[] = [];
        let summary: RelayQuerySummary | undefined;
        useRelayQuery(rx, req, { on: { relays: urls } }, { onEnd: value => { summary = value; } }).subscribe(value => results.push(value));
        req.emit({ kinds: [1] }); req.over();
        streams.get(urls[0])!.next({ event: { id: "one" }, from: urls[0] });
        messages.next({ type: "EOSE", subId: "other:0", from: urls[4] });
        for (const relay of urls.slice(0, 3)) {
            messages.next({ type: "EOSE", subId: `common-query-${urls.indexOf(relay)}:0`, from: relay }); streams.get(relay)!.complete();
        }
        await vi.advanceTimersByTimeAsync(300);
        expect(results).toHaveLength(1);
        expect(summary).toEqual({ reason: "quorum", complete: false, eoseRelays: urls.slice(0, 3) });
        expect([...streams.values()].every(source => !source.observed)).toBe(true);
        expect(messages.observed).toBe(false);
    });

    it("freezes default read relays and hints into one explicit target snapshot", () => {
        let current = urls[0];
        const source = new Subject<any>();
        const rx = { getDefaultRelays: () => ({ [current]: { url: current, read: true, write: true } }),
            use: vi.fn(() => source) } as unknown as RxNostr;
        const req = createRxBackwardReq();
        const subscription = useRelayQuery(rx, req, { on: { defaultReadRelays: true, relays: [urls[1]] } }, { quorum: false }).subscribe();
        current = urls[2];
        expect(rx.use).toHaveBeenCalledExactlyOnceWith(req, { on: { relays: [urls[1], urls[0]] } });
        subscription.unsubscribe();
        expect(vi.getTimerCount()).toBe(0);
    });
});

describe("publish acknowledgement and background settlement", () => {
    it("survives operation-signal cleanup after success, but still obeys session cancellation", async () => {
        const source = new Subject<any>();
        const rx = { send: () => source } as unknown as RxNostr;
        const controller = new AbortController();
        const task = startRelayPublish(rx, { id: "event", kind: 1, content: "" }, { targetRelays: urls, settleSignal: controller.signal });
        source.next({ from: urls[0], eventId: "event", ok: true, done: true });
        await expect(task.acknowledged).resolves.toMatchObject({ success: true, deliveryPending: true });
        controller.abort();
        expect(source.observed).toBe(true);
        source.next({ from: urls[1], eventId: "event", ok: true, done: true });
        cancelRelayOperations(rx);
        await expect(task.settled).resolves.toMatchObject({ success: true, acceptedRelays: urls.slice(0, 2) });
        expect(source.observed).toBe(false);
        expect(vi.getTimerCount()).toBe(0);
    });
    function setup() {
        const source = new Subject<any>();
        const rx = { send: vi.fn(() => source) } as unknown as RxNostr;
        const task = startRelayPublish(rx, { id: "event", kind: 1, content: "fixture" }, { targetRelays: urls });
        const ack = (index: number, ok = true, done = true) => source.next({ from: urls[index], eventId: "event", ok, done,
            notice: !ok && !done ? "auth-required: fixture" : "restricted: fixture" });
        return { source, rx, task, ack };
    }
    it("returns first acceptance while remaining deliveries continue until the 12s deadline", async () => {
        const h = setup(); h.ack(0);
        const early = await h.task.acknowledged;
        expect(early).toMatchObject({ success: true, acceptedRelays: [urls[0]], deliveryPending: true });
        expect(early.timedOutRelays).toBeUndefined();
        expect(h.source.observed).toBe(true);
        h.ack(1);
        await vi.advanceTimersByTimeAsync(12_000);
        await expect(h.task.settled).resolves.toMatchObject({ success: true, acceptedRelays: urls.slice(0, 2), timedOutRelays: urls.slice(2) });
        expect(h.source.observed).toBe(false);
    });
    it("bounds repeated AUTH by the original 30s deadline", async () => {
        const h = setup();
        await vi.advanceTimersByTimeAsync(11_000); h.ack(1, false, false);
        await vi.advanceTimersByTimeAsync(18_000); h.ack(1, false, false);
        await vi.advanceTimersByTimeAsync(1_000);
        await expect(h.task.settled).resolves.toMatchObject({ success: false, error: "post_timeout" });
        expect(vi.getTimerCount()).toBe(0);
    });
    it("cancels all owned deliveries on session disposal without retracting the first ACK", async () => {
        const h = setup(); h.ack(0);
        await expect(h.task.acknowledged).resolves.toMatchObject({ success: true });
        cancelRelayOperations(h.rx);
        await expect(h.task.settled).resolves.toMatchObject({ success: true, acceptedRelays: [urls[0]] });
        expect(h.source.observed).toBe(false);
        expect(vi.getTimerCount()).toBe(0);
    });
});
