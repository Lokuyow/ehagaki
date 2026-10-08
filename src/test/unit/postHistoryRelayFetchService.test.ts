import { afterEach, describe, expect, it, vi } from "vitest";
import { Subject, Observable } from "rxjs";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import type { RxNostr, RxReq } from "rx-nostr";
import { PostHistoryRelayFetchService, POST_HISTORY_DIALOG_OPEN_REFRESH_MAX_RELAY_COUNT } from "../../lib/postHistoryRelayFetchService";
import { getPostHistoryQuorumCoverage } from "../../lib/postHistoryRelayCoverage";
import { FALLBACK_RELAYS } from "../../lib/relayLists";
import { activateHostRelayConfig, deactivateHostRelayConfig } from "../../lib/hostRelayRuntime";
import type { NostrEvent } from "../../lib/types";

const signer = generateSecretKey();
const owner = getPublicKey(signer);
const urls = Array.from({ length: 9 }, (_, i) => `wss://relay-${i}.example.com/`);
const signed = (created_at = 100, content = "synthetic history") => finalizeEvent({ kind: 1, created_at, content, tags: [] }, signer) as NostrEvent;
const config = (count: number) => Object.fromEntries(urls.slice(0, count).map((url) => [url, { read: true, write: false }]));

afterEach(() => deactivateHostRelayConfig());

function harness(count = 5, request: Record<string, unknown> = {}) {
    const messages = new Subject<any>();
    const errors = new Subject<any>();
    const connections = new Subject<any>();
    const streams = new Map<string, { stream: Subject<any>; subId: string; filters: any[] }>();
    let hardTimeout!: () => void;
    const clearTimeoutFn = vi.fn();
    const rxNostr = {
        createAllMessageObservable: () => messages,
        createAllErrorObservable: () => errors,
        createConnectionStateObservable: () => connections,
        use: vi.fn((req: RxReq, options: any) => {
            const relayUrl = options.on.relays[0];
            const stream = new Subject<any>();
            const entry = { stream, subId: `${req.rxReqId}:0`, filters: [] as any[] };
            streams.set(relayUrl, entry);
            req.getReqPacketObservable().subscribe(({ filters }) => { entry.filters.push(...filters); });
            return stream;
        }),
    } as unknown as RxNostr;
    const service = new PostHistoryRelayFetchService({ now: () => 1_000_000,
        setTimeoutFn: (callback) => { hardTimeout = callback; return 1 as any; }, clearTimeoutFn });
    const task = service.fetchLatest(rxNostr, { pubkeyHex: owner, relayConfig: config(count), since: 10, until: 200, ...request });
    const entry = (index: number) => streams.get(urls[index])!;
    return { task, rxNostr, streams, clearTimeoutFn, timeout: () => hardTimeout(),
        event: (index: number, event = signed(), rawOnly = false) => {
            messages.next({ type: "EVENT", from: urls[index], subId: entry(index).subId, message: ["EVENT", entry(index).subId, event] });
            if (!rawOnly) entry(index).stream.next({ from: urls[index], event });
        },
        verified: (index: number, event: NostrEvent) => entry(index).stream.next({ from: urls[index], event }),
        eose: (index: number, drain = true) => {
            messages.next({ type: "EOSE", from: urls[index], subId: entry(index).subId, message: ["EOSE", entry(index).subId] });
            if (drain) entry(index).stream.complete();
        },
        complete: (index: number) => entry(index).stream.complete(),
        fail: (index: number) => { errors.next({ from: urls[index] }); entry(index).stream.complete(); },
        down: (index: number) => { connections.next({ from: urls[index], state: "error" }); entry(index).stream.complete(); },
        closed: (index: number, notice: string) => messages.next({ type: "CLOSED", from: urls[index], subId: entry(index).subId, notice }),
        wrongEose: (index: number) => messages.next({ type: "EOSE", from: urls[index], subId: "unrelated:0" }),
    };
}

describe("PostHistoryRelayFetchService", () => {
    it.each([[1,1], [2,1], [3,2], [4,2], [5,3], [6,3]])("retains %i-relay quorum evidence across remaining timeouts", async (total, required) => {
        const h = harness(total);
        for (let i = 0; i < required; i++) h.eose(i);
        if (required < total) h.timeout();
        const result = await h.task.promise;
        expect(getPostHistoryQuorumCoverage(result.relayFetchCoverage!, urls.slice(0, total))).toEqual([{ since: 10, until: 200 }]);
        expect(result.relayOutcomes!.filter((outcome) => outcome.termination === "eose")).toHaveLength(required);
        expect(h.clearTimeoutFn).toHaveBeenCalledOnce();
    });
    it.each(["timeout", "error"])("fewer than half EOSE does not reach quorum with %s", async (failure) => {
        const h = harness();
        h.eose(0); h.eose(1);
        if (failure === "timeout") h.timeout();
        else for (let i = 2; i < 5; i++) h.fail(i);
        const result = await h.task.promise;
        expect(result.relayFetchCoverage).toHaveLength(2);
        expect(getPostHistoryQuorumCoverage(result.relayFetchCoverage!, urls.slice(0, 5))).toEqual([]);
    });
    it("finishes all terminal relays without waiting for the hard timeout", async () => {
        const h = harness();
        h.eose(0); h.eose(1); h.eose(2); h.fail(3); h.down(4);
        const result = await h.task.promise;
        expect(result.completedByLocalTimeout).toBe(false);
        expect(getPostHistoryQuorumCoverage(result.relayFetchCoverage!, urls.slice(0, 5))).toEqual([{ since: 10, until: 200 }]);
    });
    it("does not stop other relays immediately on quorum and includes their additional events", async () => {
        const h = harness();
        h.eose(0); h.eose(1); h.eose(2);
        let settled = false;
        void h.task.promise.then(() => { settled = true; });
        await Promise.resolve();
        expect(settled).toBe(false);
        const event = signed(90);
        h.event(4, event); h.eose(4); h.eose(3);
        expect((await h.task.promise).events.map((item) => item.event.id)).toEqual([event.id]);
    });
    it("waits for verification after raw EOSE and retains no undrained coverage at timeout", async () => {
        const h = harness(2);
        const event = signed();
        h.event(0, event, true); h.eose(0, false);
        h.complete(1);
        let settled = false;
        void h.task.promise.then(() => { settled = true; });
        await Promise.resolve(); expect(settled).toBe(false);
        h.verified(0, event); h.complete(0);
        expect((await h.task.promise).relayFetchCoverage).toEqual([{ relayUrl: urls[0], ranges: [{ since: 10, until: 200 }] }]);
        const pending = harness(1); pending.event(0, event, true); pending.eose(0, false); pending.timeout();
        expect((await pending.task.promise).relayFetchCoverage).toEqual([]);
    });
    it("Observable completion without EOSE is not relay-query evidence", async () => {
        const h = harness(1); h.complete(0);
        expect((await h.task.promise).relayFetchCoverage).toEqual([]);
    });
    it("keeps AUTH-required CLOSED recoverable and isolates unrelated subscription EOSE", async () => {
        const h = harness(1);
        h.closed(0, "auth-required: synthetic"); h.wrongEose(0);
        h.eose(0);
        expect((await h.task.promise).relayFetchCoverage).toHaveLength(1);
        const unrelated = harness(1); unrelated.wrongEose(0); unrelated.complete(0);
        expect((await unrelated.task.promise).relayFetchCoverage).toEqual([]);
    });
    it("saturation is per relay and excludes the oldest verified second", async () => {
        const h = harness(2, { limit: 2 });
        h.event(0, signed(100)); h.event(0, signed(80)); h.event(1, signed(60));
        h.eose(0); h.eose(1);
        const result = await h.task.promise;
        expect(result.relayFetchCoverage).toEqual([
            { relayUrl: urls[0], ranges: [{ since: 81, until: 200 }] },
            { relayUrl: urls[1], ranges: [{ since: 10, until: 200 }] },
        ]);
        expect(result.hasMore).toBe(true);
        const aggregate = harness(2, { limit: 3 });
        aggregate.event(0, signed(100)); aggregate.event(0, signed(80)); aggregate.event(1, signed(60));
        aggregate.eose(0); aggregate.eose(1);
        expect((await aggregate.task.promise).hasMore).toBe(false);
    });
    it("dedupes verified events and counts raw invalid/duplicate packets conservatively", async () => {
        const h = harness(2, { limit: 3 }); const event = signed();
        h.event(0, event); h.event(0, event); h.event(0, event, true); h.event(1, event);
        h.eose(0); h.eose(1);
        const result = await h.task.promise;
        expect(result.events).toEqual([{ event: expect.objectContaining({ id: event.id }), relayUrls: urls.slice(0, 2) }]);
        expect(result.rawCount).toBe(4); expect(result.uniqueCount).toBe(1);
        expect(result.relayOutcomes![0].saturated).toBe(true);
    });
    it("cancellation suppresses drained coverage, all failures and timeout alone grant none", async () => {
        const h = harness(); h.eose(0); h.eose(1); h.eose(2); h.task.cancel();
        expect((await h.task.promise).relayFetchCoverage).toEqual([]);
        const errors = harness(2); errors.fail(0); errors.down(1);
        expect(await errors.task.promise).toMatchObject({ allRelaysFailed: true, relayFetchCoverage: [] });
        const timeout = harness(); timeout.timeout();
        expect((await timeout.task.promise).relayFetchCoverage).toEqual([]);
    });
    it("head coverage has a finite observed lower bound and captured upper bound", async () => {
        const h = harness(1, { since: undefined, until: undefined }); h.event(0, signed(100)); h.eose(0);
        expect((await h.task.promise).relayFetchCoverage).toEqual([{ relayUrl: urls[0], ranges: [{ since: 100, until: 1000 }] }]);
        const empty = harness(1, { since: undefined, until: undefined }); empty.eose(0);
        expect((await empty.task.promise).relayFetchCoverage).toEqual([]);
    });
    it("recent query cap never shrinks the canonical quorum denominator", async () => {
        const h = harness(9, { reason: "dialog-open-refresh" });
        expect(h.streams.size).toBe(POST_HISTORY_DIALOG_OPEN_REFRESH_MAX_RELAY_COUNT);
        for (let i = 0; i < h.streams.size; i++) h.eose(i);
        const result = await h.task.promise;
        expect(result.canonicalRelayUrls).toHaveLength(9);
        expect(getPostHistoryQuorumCoverage(result.relayFetchCoverage!, result.canonicalRelayUrls!)).toEqual([]);
    });
    it("open catchup queries all canonical relays with the older page limit", async () => {
        const h = harness(9, { reason: "dialog-open-catchup" });
        expect(h.streams.size).toBe(9);
        expect(h.streams.get(urls[0])!.filters[0]).toMatchObject({ since: 10, until: 200, limit: 150 });
        for (let i = 0; i < 5; i++) h.eose(i);
        for (let i = 5; i < 9; i++) h.fail(i);
        const result = await h.task.promise;
        expect(getPostHistoryQuorumCoverage(result.relayFetchCoverage!, result.canonicalRelayUrls!))
            .toEqual([{ since: 10, until: 200 }]);
    });
    it("Host read defaults override user config and are not capped, including empty Host config", async () => {
        activateHostRelayConfig(config(9));
        const h = harness(1, { reason: "dialog-open-refresh" });
        expect(h.streams.size).toBe(9);
        for (let i = 0; i < 9; i++) h.eose(i);
        expect((await h.task.promise).canonicalRelayUrls).toEqual(urls);
        activateHostRelayConfig({});
        const empty = harness();
        expect(empty.streams.size).toBe(0);
        expect((await empty.task.promise).relayFetchCoverage).toEqual([]);
    });
    it("fallback and read/write destinations use canonical deduplicated history selection", async () => {
        const fallback = harness(0);
        expect([...fallback.streams.keys()]).toHaveLength(new Set(FALLBACK_RELAYS).size);
        fallback.timeout(); await fallback.task.promise;
        const h = harness(2, { reason: "repair-visible-range", relayConfig: {
            [urls[0]]: { read: false, write: true }, [urls[1]]: { read: true, write: false },
        } });
        h.eose(0); h.event(1); h.eose(1);
        expect((await h.task.promise).events).toHaveLength(1);
    });
    it("synchronous disposal clears its timer and never certifies coverage", async () => {
        const clear = vi.fn();
        const source = { use: () => new Observable((observer) => observer.complete()) } as unknown as RxNostr;
        const task = new PostHistoryRelayFetchService({ setTimeoutFn: () => 1 as any, clearTimeoutFn: clear })
            .fetchLatest(source, { pubkeyHex: owner, relayConfig: config(1) });
        expect((await task.promise).relayFetchCoverage).toEqual([]);
        expect(clear).toHaveBeenCalledOnce();
    });
});
