import { describe, expect, it, vi } from "vitest";
import { Nip65RelayDirectory } from "../../lib/nip65RelayDirectory";
import type { RxNostr } from "rx-nostr";
import { activateHostRelayConfig, deactivateHostRelayConfig } from "../../lib/hostRelayRuntime";

const pubkey = "1".repeat(64);
const event = (created_at: number, id: string, tags: unknown[][], eventPubkey = pubkey) => ({
    kind: 10002,
    pubkey: eventPubkey,
    created_at,
    id: id.repeat(64),
    tags,
});

function createRxHarness() {
    const observers: any[] = [];
    const rxNostr = {
        use: vi.fn(() => ({
            subscribe: vi.fn((observer: unknown) => {
                observers.push(observer);
                return { unsubscribe: vi.fn() };
            }),
        })),
    } as unknown as RxNostr;
    return { rxNostr, observers };
}

describe("Nip65RelayDirectory", () => {
    it("collects EOSE responses and selects newest event with lexical id tie-break", async () => {
        const { rxNostr, observers } = createRxHarness();
        const directory = new Nip65RelayDirectory(rxNostr);
        const resultPromise = directory.lookup(pubkey);

        observers[0].next({ event: event(12, "f", [["r", "wss://newer-f.example/", "read"]]) });
        observers[0].next({ event: event(12, "a", [["r", "wss://newer-a.example/", "write"]]) });
        observers[0].next({ event: event(11, "0", [["r", "wss://older.example/"]]) });
        observers[0].complete();

        await expect(resultPromise).resolves.toMatchObject({
            status: "found",
            eventId: "a".repeat(64),
            readRelays: [],
            writeRelays: ["wss://newer-a.example/"],
        });
    });

    it("does not fall back to an older event when the selected latest list has no usable relay", async () => {
        const { rxNostr, observers } = createRxHarness();
        const directory = new Nip65RelayDirectory(rxNostr);
        const resultPromise = directory.lookup(pubkey);

        observers[0].next({ event: event(20, "f", [["r", "https://not-a-websocket.example/"]]) });
        observers[0].next({ event: event(19, "0", [["r", "wss://older.example/", "read"]]) });
        observers[0].complete();

        await expect(resultPromise).resolves.toMatchObject({
            status: "empty",
            eventId: "f".repeat(64),
            readRelays: [],
            writeRelays: [],
        });
    });

    it("coalesces in-flight lookups and caches the result for the session", async () => {
        const { rxNostr, observers } = createRxHarness();
        const directory = new Nip65RelayDirectory(rxNostr);
        const first = directory.lookup(pubkey);
        const second = directory.lookup(pubkey);
        expect(rxNostr.use).toHaveBeenCalledOnce();

        observers[0].next({ event: event(1, "a", [["r", "wss://read.example/", "read"]]) });
        observers[0].complete();
        await expect(Promise.all([first, second])).resolves.toMatchObject([
            { status: "found", readRelays: ["wss://read.example/"] },
            { status: "found", readRelays: ["wss://read.example/"] },
        ]);

        await directory.lookup(pubkey);
        expect(rxNostr.use).toHaveBeenCalledOnce();
    });

    it("searches a new contextual source after a bootstrap-only negative cache and then reuses it", async () => {
        const { rxNostr, observers } = createRxHarness();
        const directory = new Nip65RelayDirectory(rxNostr);
        const contextualRelay = "wss://reply-target.example/";
        const bootstrapLookup = directory.lookup(pubkey);
        observers[0].complete();
        await expect(bootstrapLookup).resolves.toMatchObject({ status: "not-found" });

        const contextualLookup = directory.lookup(pubkey, { discoveryRelays: [contextualRelay] });
        expect(rxNostr.use).toHaveBeenCalledTimes(2);
        expect(rxNostr.use).toHaveBeenLastCalledWith(
            expect.anything(),
            { on: { relays: [contextualRelay] } },
        );
        observers[1].next({
            from: contextualRelay,
            event: event(3, "b", [["r", "wss://recipient-read.example/", "read"]]),
        });
        observers[1].complete();
        await expect(contextualLookup).resolves.toMatchObject({
            status: "found",
            readRelays: ["wss://recipient-read.example/"],
        });

        await directory.lookup(pubkey, { discoveryRelays: [contextualRelay] });
        expect(rxNostr.use).toHaveBeenCalledTimes(2);
    });

    it("shares an in-flight pubkey lookup while searching a newly supplied contextual source", async () => {
        const { rxNostr, observers } = createRxHarness();
        const directory = new Nip65RelayDirectory(rxNostr);
        const first = directory.lookup(pubkey);
        const withContext = directory.lookup(pubkey, {
            discoveryRelays: ["wss://reply-target.example/"],
        });
        expect(first).toBe(withContext);

        observers[0].complete();
        await Promise.resolve();
        await Promise.resolve();
        expect(rxNostr.use).toHaveBeenCalledTimes(2);
        observers[1].next({
            event: event(4, "b", [["r", "wss://recipient-read.example/", "read"]]),
        });
        observers[1].complete();
        await expect(first).resolves.toMatchObject({
            status: "found",
            readRelays: ["wss://recipient-read.example/"],
        });
    });

    it("does not roll a cached route back to an older contextual event", async () => {
        const { rxNostr, observers } = createRxHarness();
        const directory = new Nip65RelayDirectory(rxNostr);
        const initial = directory.lookup(pubkey);
        observers[0].next({ event: event(10, "c", [["r", "wss://new-read.example/", "read"]]) });
        observers[0].complete();
        await initial;

        const contextual = directory.lookup(pubkey, { discoveryRelays: ["wss://context.example/"] });
        observers[1].next({ event: event(9, "d", [["r", "wss://old-read.example/", "read"]]) });
        observers[1].complete();
        await expect(contextual).resolves.toMatchObject({
            eventId: "c".repeat(64),
            readRelays: ["wss://new-read.example/"],
        });
    });

    it("updates from a newer contextual event and honors its empty route without older fallback", async () => {
        const { rxNostr, observers } = createRxHarness();
        const directory = new Nip65RelayDirectory(rxNostr);
        const initial = directory.lookup(pubkey);
        observers[0].next({ event: event(10, "c", [["r", "wss://old-read.example/", "read"]]) });
        observers[0].complete();
        await initial;

        const contextual = directory.lookup(pubkey, { discoveryRelays: ["wss://context.example/"] });
        observers[1].next({ event: event(12, "a", [["r", "https://invalid.example/", "read"]]) });
        observers[1].next({ event: event(11, "b", [["r", "wss://middle-read.example/", "read"]]) });
        observers[1].complete();
        await expect(contextual).resolves.toMatchObject({
            status: "empty",
            eventId: "a".repeat(64),
            readRelays: [],
        });
    });

    it("limits active lookups to four and starts the queued lookup when a slot frees", async () => {
        const { rxNostr, observers } = createRxHarness();
        const directory = new Nip65RelayDirectory(rxNostr);
        const lookups = Array.from({ length: 5 }, (_, index) =>
            directory.lookup(index.toString(16).padStart(64, "0")),
        );
        expect(rxNostr.use).toHaveBeenCalledTimes(4);

        observers[0].complete();
        await lookups[0];
        await Promise.resolve();
        expect(rxNostr.use).toHaveBeenCalledTimes(5);
        observers.slice(1).forEach((observer) => observer.complete());
        await Promise.all(lookups.slice(1));
    });

    it("uses only Host read defaults for discovery in an embedded runtime", async () => {
        const { rxNostr, observers } = createRxHarness();
        const hostReadRelay = "wss://host-read.example/";
        activateHostRelayConfig({
            [hostReadRelay]: { read: true, write: false },
            "wss://host-write.example/": { read: false, write: true },
        });
        try {
            const directory = new Nip65RelayDirectory(rxNostr);
            const contextualRelay = "wss://reply-target.example/";
            const pending = directory.lookup(pubkey, { discoveryRelays: [contextualRelay] });
            expect(rxNostr.use).toHaveBeenCalledWith(
                expect.anything(),
                { on: { relays: [hostReadRelay, contextualRelay] } },
            );
            observers[0].complete();
            await pending;
        } finally {
            deactivateHostRelayConfig();
        }
    });
});
