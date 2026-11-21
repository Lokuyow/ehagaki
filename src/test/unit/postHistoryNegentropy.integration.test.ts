import "fake-indexeddb/auto";
import Dexie from "dexie";
import { finalizeEvent, generateSecretKey, getPublicKey, verifyEvent, type Filter } from "nostr-tools";
import { createRxNostr, type RxNostr } from "rx-nostr";
import { afterEach, describe, expect, it, vi } from "vitest";
import { persistPostHistoryAuthoredBatch } from "../../lib/postHistoryAuthoredFetchPersistence";
import { readPostHistoryNegentropySeeds, reconcilePostHistoryRelay } from "../../lib/postHistoryFullScanNegentropy";
import { PostHistoryRelayFullScanService } from "../../lib/postHistoryRelayFullScanService";
import { EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexiePostHistoryRelayCoverageRepository } from "../../lib/storage/postHistoryRelayCoverageRepository";
import { DexiePostHistoryRepository } from "../../lib/storage/postHistoryRepository";
import type { NostrEvent } from "../../lib/types";

const relayA = "wss://negentropy-a.example/";
const relayB = "wss://negentropy-b.example/";
const relayC = "wss://negentropy-c.example/";
const kindsKey = "1,6,16,42,1111";
const secret = generateSecretKey();
const owner = getPublicKey(secret);
const historicalEvent = (content: string, created_at = 50) => finalizeEvent({ kind: 1, created_at, content, tags: [] }, secret);

// V1 range covering the full timestamp domain, followed by an ID list.
function idList(events: NostrEvent[]): string {
    if (events.length >= 128) throw new Error("Fixture expects a one-byte count");
    return `61000002${events.length.toString(16).padStart(2, "0")}${events.map(({ id }) => id).join("")}`;
}

class HistorySocket extends EventTarget {
    static OPEN = 1;
    static respond: (socket: HistorySocket, frame: unknown[]) => void;
    static instances: HistorySocket[] = [];
    readyState = 0;
    sent: unknown[][] = [];
    readonly url: string;

    constructor(url: string) {
        super();
        this.url = new URL(url).href;
        HistorySocket.instances.push(this);
        queueMicrotask(() => {
            if (this.readyState !== 0) return;
            this.readyState = HistorySocket.OPEN;
            this.dispatchEvent(new Event("open"));
        });
    }

    send(data: string) {
        const frame = JSON.parse(data) as unknown[];
        this.sent.push(frame);
        queueMicrotask(() => HistorySocket.respond(this, frame));
    }

    receive(frame: unknown[]) {
        this.dispatchEvent(new MessageEvent("message", { data: JSON.stringify(frame) }));
    }

    close() {
        this.readyState = 3;
        this.dispatchEvent(new CloseEvent("close", { code: 1000 }));
    }
}

const databases: EHagakiDB[] = [];
const runtimes: RxNostr[] = [];
afterEach(async () => {
    runtimes.splice(0).forEach((runtime) => runtime.dispose());
    for (const db of databases.splice(0)) {
        db.close();
        await Dexie.delete(db.name);
    }
    HistorySocket.instances = [];
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

async function setup(relays = [relayA], existing: { event: NostrEvent; relayUrls: string[] }[] = []) {
    vi.stubGlobal("WebSocket", HistorySocket);
    const db = new EHagakiDB(`negentropy-${crypto.randomUUID()}`);
    databases.push(db);
    const repository = new DexiePostHistoryRepository(db);
    const coverage = new DexiePostHistoryRelayCoverageRepository(db);
    await repository.upsertFetchedEvents({ events: existing });
    const runtime = createRxNostr({ verifier: async (event) => verifyEvent(event), skipVerify: false, skipFetchNip11: true,
        retry: { strategy: "off" }, websocketCtor: HistorySocket as never });
    runtimes.push(runtime);
    const service = new PostHistoryRelayFullScanService({
        now: () => 100_000,
        options: { windowSeconds: 101, limit: 2 },
        createScope: async (input) => ({ ownerPubkeyHex: owner, kindsKey, isActive: input.isActive,
            expectedRevision: await coverage.getLocalRevision(owner) }),
        persistBatch: (events, at, ranges, scope) => persistPostHistoryAuthoredBatch(events, at, ranges, scope, repository),
        loadNegentropy: async () => ({
            reconcilePostHistoryRelay,
            readPostHistoryNegentropySeeds: (input) => readPostHistoryNegentropySeeds(input, repository),
        }),
    });
    const relayConfig = Object.fromEntries(relays.map((url) => [url, { read: true, write: true }]));
    return { repository, coverage, start: () => service.start({
        ownerPubkeyHex: owner, rxNostr: runtime, relayConfig,
        getCurrentScope: () => ({ ownerPubkeyHex: owner, rxNostr: runtime, relayConfig }),
    }) };
}

function respondWithEvents(socket: HistorySocket, subId: unknown, events: NostrEvent[]) {
    events.forEach((event) => socket.receive(["EVENT", subId, event]));
    socket.receive(["EOSE", subId, ["finish"]]);
}

function frames(verb: string, relayUrl?: string): unknown[][] {
    return HistorySocket.instances.filter((socket) => !relayUrl || socket.url === relayUrl)
        .flatMap((socket) => socket.sent.filter(([type]) => type === verb));
}

describe("NIP-77 manual history full scan", () => {
    it("downloads only relay differences in bounded batches and falls back per relay", async () => {
        const common = historicalEvent("already fetched from A");
        const otherRelay = historicalEvent("previously fetched from B");
        const future = historicalEvent("after upper bound", 101);
        const missing = [otherRelay, ...Array.from({ length: 100 }, (_, i) => historicalEvent(`new ${i}`))];
        const fixture = await setup([relayA, relayB], [
            { event: common, relayUrls: [relayA] },
            { event: otherRelay, relayUrls: [relayB] },
            { event: future, relayUrls: [relayA] },
        ]);
        HistorySocket.respond = (socket, [type, subId, filter]) => {
            if (socket.url === relayB) {
                if (type === "NEG-OPEN") socket.receive(["NEG-ERR", subId, "unsupported: fixture"]);
                if (type === "REQ") respondWithEvents(socket, subId, []);
                return;
            }
            if (type === "NEG-OPEN") socket.receive(["NEG-MSG", subId, `61000001${"00".repeat(16)}`]);
            if (type === "NEG-MSG") socket.receive(["NEG-MSG", subId, idList([common, ...missing])]);
            if (type === "REQ") {
                const ids = (filter as Filter).ids ?? [];
                respondWithEvents(socket, subId, missing.filter(({ id }) => ids.includes(id)));
            }
        };

        const result = await fixture.start().promise;
        expect(result.status).toBe("completed");
        expect(result.insertedCount).toBe(100);
        expect(result.receivedCount).toBe(101);
        expect(result.relays[0].hasMatchedLocalEvents).toBe(true);
        const [, , filter, initial] = frames("NEG-OPEN", relayA)[0];
        expect(filter).toEqual({ authors: [owner], kinds: [1, 6, 16, 42, 1111], since: 0, until: 100 });
        expect(initial).toBe(idList([common]));
        expect(frames("NEG-MSG", relayA)).toHaveLength(1);
        expect(frames("NEG-CLOSE", relayA)).toHaveLength(1);
        const batches = frames("REQ", relayA).map(([, , req]) => req as Filter);
        expect(batches.map(({ ids }) => ids?.length)).toEqual([100, 1]);
        expect(new Set(batches.flatMap(({ ids }) => ids ?? []))).toEqual(new Set(missing.map(({ id }) => id)));
        expect(frames("REQ", relayB).map(([, , req]) => req)).toEqual([expect.not.objectContaining({ ids: expect.anything() })]);
        expect((await fixture.repository.getByEventId(otherRelay.id))?.fetchedRelays).toEqual(expect.arrayContaining([relayA, relayB]));
        expect((await fixture.coverage.get(owner, kindsKey)).relays).toEqual([
            { relayUrl: relayA, ranges: [{ since: 0, until: 100 }] },
            { relayUrl: relayB, ranges: [{ since: 0, until: 100 }] },
        ]);
    });

    it("distinguishes existing matches, local-only posts, and truly empty relays", async () => {
        const common = historicalEvent("present");
        const localOnly = historicalEvent("removed from relay");
        const fixture = await setup([relayA, relayB, relayC], [
            { event: common, relayUrls: [relayA] }, { event: localOnly, relayUrls: [relayB] },
        ]);
        HistorySocket.respond = (socket, [type, subId]) => {
            if (type === "NEG-OPEN") socket.receive(["NEG-MSG", subId, idList(socket.url === relayA ? [common] : [])]);
        };
        const result = await fixture.start().promise;
        expect(result.status).toBe("completed");
        expect(result.receivedCount).toBe(0);
        expect(result.relays.map((relay) => relay.hasMatchedLocalEvents)).toEqual([true, false, false]);
        expect(frames("REQ")).toEqual([]);
        expect(await fixture.repository.countForPubkey(owner)).toBe(2);
    });

    it.each(["missing", "invalid signature"] as const)("retains verified events without recording incomplete coverage (%s)", async (mode) => {
        const valid = historicalEvent("valid");
        const unavailable = historicalEvent("unavailable");
        const fixture = await setup();
        HistorySocket.respond = (socket, [type, subId, filter]) => {
            if (type === "NEG-OPEN") socket.receive(["NEG-MSG", subId, idList([valid, unavailable])]);
            if (type !== "REQ") return;
            if (!(filter as Filter).ids) {
                socket.receive(["CLOSED", subId, "error: fixture"]);
                return;
            }
            respondWithEvents(socket, subId, mode === "missing" ? [valid] : [valid, { ...unavailable, sig: "0".repeat(128) }]);
        };
        const result = await fixture.start().promise;
        expect(result.status).toBe("partial");
        expect(await fixture.repository.countForPubkey(owner)).toBe(1);
        expect((await fixture.coverage.get(owner, kindsKey)).relays).toEqual([]);
        expect(frames("REQ").some(([, , req]) => !(req as Filter).ids)).toBe(true);
    });

    it.each([["AUTH", "synthetic challenge"], ["NEG-MSG", null, "61zz"]])("falls back after %s during negotiation", async (...frame) => {
        const fixture = await setup();
        HistorySocket.respond = (socket, [type, subId]) => {
            if (type === "NEG-OPEN") socket.receive(frame[0] === "AUTH" ? frame : [frame[0], subId, frame[2]]);
            if (type === "REQ") respondWithEvents(socket, subId, []);
        };
        expect((await fixture.start().promise).status).toBe("completed");
        expect(frames("AUTH")).toEqual([]);
        expect(frames("REQ")).toHaveLength(1);
    });

    it("falls back after five seconds without a matching first response", async () => {
        vi.stubGlobal("WebSocket", HistorySocket);
        vi.useFakeTimers();
        HistorySocket.respond = () => {};
        const pending = reconcilePostHistoryRelay({
            relayUrl: relayA, seed: [], filter: { authors: [owner], kinds: [1], since: 0, until: 100 },
            timeoutMs: 35_000, signal: new AbortController().signal,
        });
        await vi.advanceTimersByTimeAsync(5_000);
        await expect(pending).resolves.toBeNull();
        expect(frames("NEG-CLOSE")).toHaveLength(1);
        expect(HistorySocket.instances[0].readyState).toBe(3);
    });

    it("closes the negotiation immediately on cancel", async () => {
        const fixture = await setup();
        HistorySocket.respond = () => {};
        const task = fixture.start();
        await vi.waitFor(() => expect(frames("NEG-OPEN")).toHaveLength(1));
        task.cancel();
        expect((await task.promise).status).toBe("cancelled");
        expect(frames("NEG-CLOSE")).toHaveLength(1);
        expect(frames("REQ")).toEqual([]);
        expect(HistorySocket.instances[0].readyState).toBe(3);
    });

    it("does not use a negotiation result after history was cleared", async () => {
        const event = historicalEvent("stale");
        const fixture = await setup([relayA], [{ event, relayUrls: [relayA] }]);
        HistorySocket.respond = () => {};
        const task = fixture.start();
        await vi.waitFor(() => expect(frames("NEG-OPEN")).toHaveLength(1));
        await fixture.repository.deleteLocalHistoryForPubkey(owner);
        HistorySocket.instances[0].receive(["NEG-MSG", frames("NEG-OPEN")[0][1], idList([event])]);
        expect((await task.promise).status).toBe("stale-cancelled");
        expect(frames("REQ")).toEqual([]);
        expect(await fixture.repository.countForPubkey(owner)).toBe(0);
        expect((await fixture.coverage.get(owner, kindsKey)).relays).toEqual([]);
    });
});
