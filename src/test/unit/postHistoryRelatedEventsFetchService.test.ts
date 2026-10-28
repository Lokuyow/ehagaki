import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { Subject } from "rxjs";
import { createEvent } from "../postHistoryEventTestUtils";
const requests = vi.hoisted(() => [] as any[]);
vi.mock("rx-nostr", () => ({ createRxBackwardReq: (id?: string) => {
    const req = { id: id ?? `delete-${requests.length}`, emit: vi.fn(), over: vi.fn() };
    requests.push(req); return req;
} }));
vi.mock("../../lib/postHistoryRawEventVerification", () => ({ usePostHistoryRelayEvents: (rx: any, req: any) => rx.use(req) }));
import { fetchPostHistoryRelatedEvents } from "../../lib/postHistoryRelatedEventsFetchService";

describe("bounded related event check", () => {
    let messages: Subject<any>;
    let streams: Map<any, Subject<any>>;
    const relay = "wss://relay.example/";
    const parent = createEvent({ kind: 1, tags: [] });
    const reply = createEvent({ id: "2".repeat(64), kind: 1, tags: [["e", parent.id, "", "reply"]] });
    const reaction = createEvent({ id: "3".repeat(64), kind: 7, tags: [["e", parent.id], ["p", parent.pubkey]], content: "+" });
    let rx: any;
    const start = (knownChildren: any[] = []) => fetchPostHistoryRelatedEvents(rx, { event: parent, knownChildren, relayHints: [relay] });
    const send = (index: number, event: any) => {
        messages.next({ from: relay, message: ["EVENT", `${requests[index].id}:0`, event] });
        streams.get(requests[index])!.next({ from: relay, event });
    };
    const complete = (index: number) => {
        messages.next({ from: relay, message: ["EOSE", `${requests[index].id}:0`] });
        streams.get(requests[index])!.complete();
    };
    beforeEach(() => {
        vi.useFakeTimers(); requests.length = 0; messages = new Subject(); streams = new Map();
        rx = { createAllMessageObservable: () => messages, use: (req: any) => { const s = new Subject(); streams.set(req, s); return s; } };
    });
    afterEach(() => vi.useRealTimers());
    it("uses separate reply/reaction filters and author-scoped known deletion filters, and finishes on EOSE", async () => {
        const task = start([{ event: reaction, relayUrls: [relay] }]);
        expect(requests[0].emit).toHaveBeenCalledWith({ kinds: [1, 1111], "#e": [parent.id], limit: 100 });
        expect(requests[1].emit).toHaveBeenCalledWith({ kinds: [7], "#e": [parent.id], limit: 100 });
        expect(requests[2].emit).toHaveBeenCalledWith(expect.objectContaining({ kinds: [5], authors: [parent.pubkey], "#e": expect.arrayContaining([parent.id]) }));
        complete(0); complete(1); complete(2);
        expect((await task.promise).status).toBe("success");
        expect(vi.getTimerCount()).toBe(0);
    });
    it("keeps deduplicated partial results and checks only newly discovered children in the last second", async () => {
        const task = start(); send(0, reply); send(0, reply); send(1, reaction);
        send(0, createEvent({ kind: 1, tags: [] }));
        await vi.advanceTimersByTimeAsync(2_000);
        expect(requests).toHaveLength(4);
        const deletion = createEvent({ kind: 5, pubkey: reply.pubkey, tags: [["e", reply.id]] });
        send(3, deletion);
        await vi.advanceTimersByTimeAsync(999);
        let finished = false; void task.promise.then(() => { finished = true; }); await Promise.resolve(); expect(finished).toBe(false);
        await vi.advanceTimersByTimeAsync(1);
        const result = await task.promise;
        expect(result.status).toBe("partial"); expect(result.events.map(x => x.event.id).sort()).toEqual([reply.id, reaction.id].sort());
        expect(result.deletions[0].event.id).toBe(deletion.id); expect(vi.getTimerCount()).toBe(0);
    });
    it("ends an empty no-response check after two seconds without negative deletion evidence", async () => {
        const task = start(); await vi.advanceTimersByTimeAsync(2_000);
        expect(await task.promise).toMatchObject({ status: "partial", events: [], deletions: [], repliesComplete: false });
        expect(vi.getTimerCount()).toBe(0);
    });
    it("cancels all subscriptions and timers", async () => {
        const task = start(); task.cancel(); expect((await task.promise).status).toBe("cancelled");
        expect(vi.getTimerCount()).toBe(0); expect([...streams.values()].every(s => !s.observed)).toBe(true);
    });
    it("does not treat a closed relay without EOSE as a complete snapshot", async () => {
        const task = start();
        complete(0); complete(1); streams.get(requests[2])!.complete();
        expect((await task.promise).status).toBe("partial");
        expect(vi.getTimerCount()).toBe(0);
    });
    it("preserves valid events if another subscription errors", async () => {
        const task = start(); send(0, reply);
        complete(0); streams.get(requests[1])!.error(new Error("relay unavailable")); complete(2);
        await vi.advanceTimersByTimeAsync(1_000);
        expect(await task.promise).toMatchObject({ status: "partial", events: [{ event: reply }] });
    });
    it("marks a saturated response partial even with EOSE", async () => {
        const task = start(); for (let i = 0; i < 100; i++) send(0, reply);
        complete(0); complete(1); complete(2); await Promise.resolve(); await Promise.resolve();
        if (requests.length > 3) complete(3);
        await vi.advanceTimersByTimeAsync(1_000);
        expect((await task.promise).status).toBe("partial");
    });
});
