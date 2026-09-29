import { describe, expect, it, vi } from "vitest";
import { Nip65RelayDirectory } from "../../lib/nip65RelayDirectory";
import type { RxNostr } from "rx-nostr";
import { activateHostRelayConfig, deactivateHostRelayConfig } from "../../lib/hostRelayRuntime";

const pubkey = "1".repeat(64);
const event = (created_at: number, id: string, tags: unknown[][]) => ({
    kind: 10002,
    pubkey,
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
            const pending = directory.lookup(pubkey);
            expect(rxNostr.use).toHaveBeenCalledWith(
                expect.anything(),
                { on: { relays: [hostReadRelay] } },
            );
            observers[0].complete();
            await pending;
        } finally {
            deactivateHostRelayConfig();
        }
    });
});
