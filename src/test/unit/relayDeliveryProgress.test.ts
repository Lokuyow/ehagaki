import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Subject } from "rxjs";
import type { RxNostr } from "rx-nostr";
import { beginRelayDelivery, observeRelayDeliveries, resetRelayDeliveries, type RelayDeliveryProgress } from "../../lib/relay/deliveryProgress";
import { createRelayDeliveryToasts, type RelayDeliveryToast } from "../../lib/relay/deliveryToasts";
import { startRelayPublish, cancelRelayOperations } from "../../lib/relay/publish";
import { RelayOperation } from "../../lib/relay/operation";

const relays = ["wss://a.example/", "wss://b.example/", "wss://c.example/"];
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());
function ui(rx: RxNostr) {
    let rows: RelayDeliveryToast[] = [];
    const controller = createRelayDeliveryToasts(observeRelayDeliveries(rx), next => { rows = next; });
    return { controller, get rows() { return rows; } };
}
describe("relay delivery progress", () => {
    it("signals balloon readiness at the two-second idle limit even after manual dismissal", async () => {
        const rx = {} as RxNostr;
        const ready = vi.fn();
        const controller = createRelayDeliveryToasts(observeRelayDeliveries(rx), () => {}, ready);
        const delivery = beginRelayDelivery(rx, relays);
        delivery.update(relays, relays.slice(0, 1));
        expect(ready).not.toHaveBeenCalled();
        // The presentation deadline belongs to the operation, not its visible row.
        const snapshot: RelayDeliveryProgress[] = [];
        const sub = observeRelayDeliveries(rx).subscribe(e => { if (e.type === "progress") snapshot.push(e.progress); });
        controller.dismiss(snapshot[0].id);
        await vi.advanceTimersByTimeAsync(1999); expect(ready).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(1); expect(ready).toHaveBeenCalledOnce();
        delivery.update(relays, relays); delivery.finish();
        expect(ready).toHaveBeenCalledOnce();
        expect(vi.getTimerCount()).toBe(0);
        sub.unsubscribe(); controller.dispose();
    });
    it("retires stalled partial progress without cancelling delivery or reappearing on late ACKs", async () => {
        const source = new Subject<any>();
        const rx = { send: () => source } as unknown as RxNostr;
        const view = ui(rx);
        const task = startRelayPublish(rx, { id: "fixture", kind: 1, content: "fixture" }, { targetRelays: relays });
        const ack = (index: number) => source.next({ from: relays[index], ok: true, done: true, eventId: "fixture" });
        ack(0); ack(1);
        await vi.advanceTimersByTimeAsync(1700);
        ack(1); // Duplicate traffic must not extend the visible wait.
        await vi.advanceTimersByTimeAsync(299);
        expect(view.rows[0].fading).toBe(false);
        await vi.advanceTimersByTimeAsync(1);
        expect(view.rows[0]).toMatchObject({ fading: true, progress: { accepted: 2, state: "sending" } });
        await vi.advanceTimersByTimeAsync(300);
        expect(view.rows).toEqual([]);
        expect(source.observed).toBe(true);
        ack(2);
        expect((await task.settled).success).toBe(true);
        expect(view.rows).toEqual([]);
        expect(vi.getTimerCount()).toBe(0);
        view.controller.dispose();
    });
    it("renews the visible wait only when acceptance advances, after discovery closes", async () => {
        const rx = {} as RxNostr, view = ui(rx);
        const delivery = beginRelayDelivery(rx, relays, true);
        delivery.update(relays, relays.slice(0, 1), true);
        await vi.advanceTimersByTimeAsync(2000);
        expect(view.rows[0].fading).toBe(false);
        delivery.update(relays, relays.slice(0, 1), false);
        await vi.advanceTimersByTimeAsync(1000);
        delivery.update(relays, relays.slice(0, 2));
        await vi.advanceTimersByTimeAsync(1000);
        expect(view.rows[0].fading).toBe(false);
        delivery.update(relays, relays); delivery.finish();
        await vi.advanceTimersByTimeAsync(400);
        expect(view.rows).toEqual([]);
        expect(vi.getTimerCount()).toBe(0);
        view.controller.dispose();
    });
    it("counts only distinct successful final ACKs and dismissing does not stop sending", async () => {
        const source = new Subject<any>();
        const rx = { send: vi.fn(() => source) } as unknown as RxNostr;
        const view = ui(rx);
        const task = startRelayPublish(rx, { id: "fixture", kind: 1, content: "fixture" }, { targetRelays: relays });
        const ack = (from: string, ok = true, done = true) => source.next({ from, ok, done, eventId: "fixture", notice: "auth-required: fixture" });
        expect(view.rows[0].progress).toMatchObject({ total: 3, accepted: 0, state: "sending" });
        ack(relays[0]); ack(relays[0]); ack("wss://unrelated.example/"); ack(relays[1], false, false);
        expect(view.rows[0].progress.accepted).toBe(1);
        expect((await task.acknowledged).success).toBe(true);
        view.controller.dismiss(view.rows[0].progress.id);
        expect(source.observed).toBe(true);
        ack(relays[1]); expect(view.rows).toEqual([]);
        ack(relays[2]); await task.settled;
        expect(view.rows).toEqual([]);
        expect(rx.send).toHaveBeenCalledOnce();
        expect(vi.getTimerCount()).toBe(0);
        view.controller.dispose();
    });
    it("shows completion for 250ms, then fades for 150ms", async () => {
        const rx = {} as RxNostr, view = ui(rx);
        const delivery = beginRelayDelivery(rx, relays);
        delivery.update(relays, relays); delivery.finish();
        expect(view.rows[0]).toMatchObject({ progress: { state: "complete", accepted: 3 }, fading: false });
        await vi.advanceTimersByTimeAsync(249); expect(view.rows[0].fading).toBe(false);
        await vi.advanceTimersByTimeAsync(1); expect(view.rows[0]).toMatchObject({ fading: true, fadeMs: 150 });
        await vi.advanceTimersByTimeAsync(150); expect(view.rows).toEqual([]);
        view.controller.dispose();
    });
    it.each([false, true])("never fills incomplete delivery, including unresolved discovery=%s", async unresolved => {
        const rx = {} as RxNostr, view = ui(rx);
        const delivery = beginRelayDelivery(rx, relays, true);
        delivery.update(relays, unresolved ? relays : relays.slice(0, 1), false, unresolved);
        delivery.finish();
        expect(view.rows[0]).toMatchObject({ progress: { state: "incomplete" }, fading: true, fadeMs: 300 });
        await vi.advanceTimersByTimeAsync(299); expect(view.rows).toHaveLength(1);
        await vi.advanceTimersByTimeAsync(1); expect(view.rows).toEqual([]);
        view.controller.dispose();
    });
    it("limits visible operations to three without resurrecting an evicted operation", () => {
        const rx = {} as RxNostr, view = ui(rx);
        const deliveries = Array.from({ length: 4 }, () => beginRelayDelivery(rx, relays));
        const ids = view.rows.map(row => row.progress.id);
        expect(ids).toHaveLength(3);
        deliveries[0].update(relays, relays); deliveries[0].finish();
        expect(view.rows.map(row => row.progress.id)).toEqual(ids);
        resetRelayDeliveries(rx); expect(view.rows).toEqual([]);
        deliveries[1].update(relays, relays); deliveries[1].finish();
        expect(view.rows).toEqual([]);
        expect(vi.getTimerCount()).toBe(0); view.controller.dispose();
    });
    it("replays only active operations and resets the UI when the session ends", () => {
        const rx = {} as RxNostr;
        const delivery = beginRelayDelivery(rx, relays);
        delivery.update(relays, relays.slice(0, 1));
        const view = ui(rx);
        expect(view.rows[0].progress.accepted).toBe(1);
        cancelRelayOperations(rx); delivery.finish();
        expect(view.rows).toEqual([]);
        view.controller.dispose(); expect(vi.getTimerCount()).toBe(0);
    });
    it("does not expose internal waves or local relay batches as separate operations", async () => {
        const source = new Subject<any>();
        const rx = { send: () => source } as unknown as RxNostr;
        const snapshots: RelayDeliveryProgress[] = [];
        const subscription = observeRelayDeliveries(rx).subscribe(event => { if (event.type === "progress") snapshots.push(event.progress); });
        const operation = new RelayOperation(6000, () => {});
        const task = startRelayPublish(rx, { kind: 1, content: "fixture" }, { targetRelays: relays, operation });
        operation.finish("cancelled"); await task.settled;
        expect(snapshots).toEqual([]); subscription.unsubscribe();
    });
});
