import { describe, expect, it, vi } from "vitest";
import { Subject } from "rxjs";
import type { MessagePacket, OutgoingMessagePacket } from "rx-nostr";
import {
    BUD03_KIND,
    NIP96_KIND,
    buildBud03EventTemplate,
    fetchBud03ServerList,
    fetchRelayServerList,
    parseBud03ServerTags,
    publishBud03ServerList,
} from "../../lib/upload/bud03ServerList";
import { DECOMMISSIONED_RELAYS } from "../../lib/relayLists";
import { fetchUploadRelayLists } from "../../lib/upload/relayUploadDestinationSync";

vi.mock("../../lib/signedEventResultValidator", async (importOriginal) => ({
    ...await importOriginal<typeof import("../../lib/signedEventResultValidator")>(),
    validateSignedEventResult: (_template: unknown, signedEvent: unknown) => signedEvent,
}));

describe("bud03ServerList", () => {
    it.each(["success", "timeout", "cancel", "rejected", "no_response"])("bounds NIP-42 waiting and cleans up after %s", async outcome => {
        vi.useFakeTimers();
        try {
            const outgoing = new Subject<OutgoingMessagePacket>();
            const messages = new Subject<MessagePacket>();
            const controller = new AbortController();
            const removeListener = vi.spyOn(controller.signal, "removeEventListener");
            let requestId = "";
            let observer!: { next(packet: unknown): void; complete(): void };
            const unsubscribe = vi.fn();
            const rxNostr = {
                getDefaultRelays: () => ({ "wss://one.example/": { read: true }, "wss://two.example/": { read: true } }),
                createOutgoingMessageObservable: () => outgoing,
                createAllMessageObservable: () => messages,
                use: (request: { rxReqId: string }) => { requestId = request.rxReqId; return { subscribe: (next: typeof observer) => { observer = next; return { unsubscribe }; } }; },
            };
            let settled = false;
            const operation = fetchBud03ServerList({ rxNostr: rxNostr as never, pubkeyHex: "owner", signal: controller.signal })
                .then(result => { settled = true; return result; });
            const send = (relay: string, id = requestId) => outgoing.next({ to: relay, message: ["REQ", `${id}:0`, { kinds: [BUD03_KIND] }] });
            const requireAuth = (relay: string, id = requestId) => messages.next({ from: relay, type: "CLOSED", subId: `${id}:0`,
                notice: "auth-required: fixture", message: ["CLOSED", `${id}:0`, "auth-required: fixture"] });
            send("wss://one.example/"); send("wss://two.example/");
            requireAuth("wss://one.example/");
            if (outcome === "success") observer.next({ event: { id: "a".repeat(64), kind: BUD03_KIND, pubkey: "owner", created_at: 10, tags: [["server", "https://files.example"]] } });
            await vi.advanceTimersByTimeAsync(5_000);
            send("wss://one.example/", "unrelated");
            expect(settled).toBe(false);
            if (outcome === "timeout") {
                // Further challenges, including another target relay, cannot renew the deadline.
                requireAuth("wss://two.example/");
                await vi.advanceTimersByTimeAsync(24_999);
                expect(settled).toBe(false);
                requireAuth("wss://one.example/");
                await vi.advanceTimersByTimeAsync(1);
                expect(await operation).toEqual({ success: false, servers: [], error: "timeout" });
            } else if (outcome === "cancel") {
                controller.abort();
                expect((await operation).error).toBe("request_error");
            } else if (outcome === "rejected") {
                observer.complete(); // rx-nostr closes the subscription when AUTH is rejected.
                expect((await operation).error).toBe("request_error");
            } else {
                send("wss://one.example/"); // rx-nostr's authenticated retransmission
                requireAuth("wss://two.example/", "unrelated");
                requireAuth("wss://unrelated.example/");
                await vi.advanceTimersByTimeAsync(3_999);
                expect(settled).toBe(false);
                if (outcome === "success") {
                    observer.complete();
                    // The public EOSE notification can follow stream completion.
                    for (const relay of ["wss://one.example/", "wss://two.example/"]) messages.next({
                        from: relay, type: "EOSE", subId: `${requestId}:0`, message: ["EOSE", `${requestId}:0`],
                    });
                    expect(await operation).toMatchObject({ success: true, servers: ["https://files.example"] });
                    expect((await operation).incomplete).toBeUndefined();
                } else {
                    send("wss://one.example/"); // duplicate REQ must not extend response time
                    await vi.advanceTimersByTimeAsync(1);
                    expect((await operation).error).toBe("timeout");
                }
            }
            send("wss://one.example/"); requireAuth("wss://one.example/");
            expect(unsubscribe).toHaveBeenCalledOnce();
            expect(outgoing.observed).toBe(false);
            expect(messages.observed).toBe(false);
            expect(removeListener).toHaveBeenCalledWith("abort", expect.any(Function));
            expect(vi.getTimerCount()).toBe(0);
        } finally { vi.useRealTimers(); }
    });
    it.each([BUD03_KIND, NIP96_KIND].flatMap(kind =>
        ["preparation", "response", "network", "auth", "terminal", "cancel"].map(phase => ({ kind, phase })),
    ))("retains the newest verified kind $kind candidate when another relay stalls in $phase", async ({ kind, phase }) => {
        vi.useFakeTimers();
        try {
            const outgoing = new Subject<OutgoingMessagePacket>();
            const messages = new Subject<MessagePacket>();
            const controller = new AbortController();
            let requestId = "";
            let observer!: { next(packet: unknown): void; complete(): void; error(): void };
            const unsubscribe = vi.fn();
            const rxNostr = {
                getDefaultRelays: () => ({ "wss://healthy.example/": { read: true }, "wss://offline.example/": { read: true } }),
                createOutgoingMessageObservable: () => outgoing,
                createAllMessageObservable: () => messages,
                use: (request: { rxReqId: string }) => { requestId = request.rxReqId; return { subscribe: (next: typeof observer) => { observer = next; return { unsubscribe }; } }; },
            };
            const operation = fetchRelayServerList({ rxNostr: rxNostr as never, pubkeyHex: "owner", kind, signal: controller.signal });
            outgoing.next({ to: "wss://healthy.example/", message: ["REQ", `${requestId}:0`, { kinds: [kind] }] });
            if (phase !== "preparation") outgoing.next({ to: "wss://offline.example/", message: ["REQ", `${requestId}:0`, { kinds: [kind] }] });
            for (const created_at of [10, 20]) observer.next({ from: "wss://healthy.example/", event: {
                kind, pubkey: "owner", id: String(created_at).repeat(32), created_at,
                tags: [["server", created_at === 20 ? "https://new.example" : "https://old.example"]],
            } });
            messages.next({ from: "wss://healthy.example/", type: "EOSE", subId: `${requestId}:0`, message: ["EOSE", `${requestId}:0`] });
            if (phase === "auth") messages.next({ from: "wss://offline.example/", type: "CLOSED", subId: `${requestId}:0`,
                notice: "auth-required: fixture", message: ["CLOSED", `${requestId}:0`, "auth-required: fixture"] });
            if (phase === "network") observer.error();
            else if (phase === "terminal") observer.complete();
            else if (phase === "cancel") controller.abort();
            else await vi.advanceTimersByTimeAsync(phase === "preparation" ? 10_000 : phase === "auth" ? 30_000 : 4_000);
            const result = await operation;
            expect(result).toMatchObject(phase === "cancel"
                ? { success: false, servers: [], error: "request_error" }
                : { success: true, servers: ["https://new.example"], incomplete: true, event: { created_at: 20 } });
            observer.next({ event: { kind, pubkey: "owner", id: "f".repeat(64), created_at: 30, tags: [["server", "https://late.example"]] } });
            observer.complete();
            expect(result.servers).not.toContain("https://late.example");
            expect(unsubscribe).toHaveBeenCalledOnce();
            expect(outgoing.observed).toBe(false);
            expect(messages.observed).toBe(false);
            expect(vi.getTimerCount()).toBe(0);
        } finally { vi.useRealTimers(); }
    });
    it("does not report a missing list when a relay failed and no valid candidate arrived", async () => {
        const messages = new Subject<MessagePacket>();
        const rxNostr = {
            getDefaultRelays: () => ({ "wss://offline.example/": { read: true } }),
            createOutgoingMessageObservable: () => new Subject<OutgoingMessagePacket>(),
            createAllMessageObservable: () => messages,
            use: () => ({ subscribe: (observer: { complete(): void }) => { observer.complete(); return { unsubscribe: vi.fn() }; } }),
        };
        expect(await fetchBud03ServerList({ rxNostr: rxNostr as never, pubkeyHex: "owner" }))
            .toEqual({ success: false, servers: [], error: "network_error" });
        expect(messages.observed).toBe(false);
    });
    it("allows cold relay preparation before starting the four-second response budget", async () => {
        vi.useFakeTimers();
        try {
            const outgoing = new Subject<OutgoingMessagePacket>();
            let requestId = "";
            let observer!: { complete(): void };
            const unsubscribe = vi.fn();
            const rxNostr = {
                getDefaultRelays: vi.fn(() => ({ "wss://relay.example/": { read: true, write: true } })),
                createOutgoingMessageObservable: () => outgoing,
                use: vi.fn((request) => { requestId = request.rxReqId; return { subscribe: (next: typeof observer) => { observer = next; return { unsubscribe }; } }; }),
            };
            let settled = false;
            const operation = fetchBud03ServerList({ rxNostr: rxNostr as never, pubkeyHex: "owner" }).then(result => { settled = true; return result; });
            await vi.advanceTimersByTimeAsync(5_000);
            expect(settled).toBe(false);
            outgoing.next({ to: "wss://relay.example/", message: ["REQ", `${requestId}:0`, { kinds: [BUD03_KIND] }] });
            observer.complete();
            expect((await operation).error).toBe("not_found");
            expect(rxNostr.getDefaultRelays).toHaveBeenCalledWith({ filter: "read-all" });
            expect(rxNostr.use).toHaveBeenCalledWith(expect.anything(), { on: { relays: ["wss://relay.example/"] } });
            expect(unsubscribe).toHaveBeenCalledOnce();
            expect(outgoing.observed).toBe(false);
            expect(vi.getTimerCount()).toBe(0);
        } finally { vi.useRealTimers(); }
    });
    it.each(["preparation", "response", "cancel"])("bounds %s and releases dispatch observation", async phase => {
        vi.useFakeTimers();
        try {
            const outgoing = new Subject<OutgoingMessagePacket>();
            const controller = new AbortController();
            let requestId = "";
            const unsubscribe = vi.fn();
            const rxNostr = {
                getDefaultRelays: () => ({ "wss://one.example/": { read: true }, "wss://two.example/": { read: true } }),
                createOutgoingMessageObservable: () => outgoing,
                use: (request: { rxReqId: string }) => { requestId = request.rxReqId; return { subscribe: () => ({ unsubscribe }) }; },
            };
            const operation = fetchBud03ServerList({ rxNostr: rxNostr as never, pubkeyHex: "owner", signal: controller.signal });
            await vi.advanceTimersByTimeAsync(5_000);
            const send = (relay: string, id = requestId) => outgoing.next({ to: relay, message: ["REQ", `${id}:0`, { kinds: [BUD03_KIND] }] });
            if (phase === "cancel") {
                controller.abort();
                send("wss://one.example/"); send("wss://two.example/");
            } else {
                send("wss://one.example/");
                if (phase === "response") {
                    send("wss://two.example/");
                    await vi.advanceTimersByTimeAsync(2_000);
                    send("wss://two.example/");
                    send("wss://one.example/", "unrelated-query");
                    await vi.advanceTimersByTimeAsync(2_000);
                } else {
                    send("wss://two.example/", "unrelated-query");
                    await vi.advanceTimersByTimeAsync(5_000);
                }
            }
            expect((await operation).error).toBe(phase === "preparation" ? "preparation_timeout" : phase === "response" ? "timeout" : "request_error");
            expect(unsubscribe).toHaveBeenCalledOnce();
            expect(outgoing.observed).toBe(false);
            expect(vi.getTimerCount()).toBe(0);
        } finally { vi.useRealTimers(); }
    });
    it.each([false, true])("keeps the newest empty Blossom list instead of reviving older relay data (reverse=%s)", async reverse => {
        const old = { id: "b".repeat(64), kind: BUD03_KIND, pubkey: "owner", created_at: 10,
            tags: [["server", "https://old.example"]] };
        const empty = { id: "a".repeat(64), kind: BUD03_KIND, pubkey: "owner", created_at: 20, tags: [] };
        const packets = [{ from: "wss://old-relay.example", event: old }, { from: "wss://new-relay.example", event: empty }];
        if (reverse) packets.reverse();
        const unsubscribe = vi.fn();
        const rxNostr = { use: () => ({ subscribe: (observer: { next: (packet: typeof packets[number]) => void; complete: () => void }) => {
            packets.forEach(packet => observer.next(packet)); observer.complete(); return { unsubscribe };
        } }) };
        const result = await fetchBud03ServerList({ rxNostr: rxNostr as never, pubkeyHex: "owner" });

        expect(result).toMatchObject({ success: true, servers: [], event: { id: empty.id } });
        expect(unsubscribe).toHaveBeenCalledOnce();
    });

    it("passes the latest empty Blossom event to synchronization as a skip with no replacement", async () => {
        const rxNostr = { use: vi.fn()
            .mockReturnValueOnce({ subscribe: (observer: { next: (packet: { event: { id: string; kind: number; pubkey: string; created_at: number; tags: string[][] } }) => void; complete: () => void }) => {
                observer.next({ event: { id: "b".repeat(64), kind: BUD03_KIND, pubkey: "owner", created_at: 10, tags: [["server", "https://old.example"]] } });
                observer.next({ event: { id: "a".repeat(64), kind: BUD03_KIND, pubkey: "owner", created_at: 20, tags: [] } });
                observer.complete(); return { unsubscribe: vi.fn() };
            } })
            .mockReturnValueOnce({ subscribe: (observer: { complete: () => void }) => { observer.complete(); return { unsubscribe: vi.fn() }; } }),
        };
        const result = await fetchUploadRelayLists({ rxNostr: rxNostr as never, pubkeyHex: "owner",
            signal: new AbortController().signal, assertCurrent: () => {}, fetch: vi.fn() });

        expect(result.results.blossom).toEqual({ status: "skipped", reason: "empty_list" });
        expect(result.updates).toEqual({});
    });
    it("parses server tags with normalization, de-duplication, and ordering", () => {
        expect(parseBud03ServerTags([
            ["server", "https://blossom.example.com/"],
            ["server", "https://cdn.example.com/path"],
            ["server", "https://blossom.example.com"],
            ["server", "wss://relay.example.com"],
            ["other", "https://ignored.example.com"],
        ])).toEqual([
            "https://blossom.example.com",
            "https://cdn.example.com/path",
        ]);
    });

    it("builds kind 10063 event templates", () => {
        expect(buildBud03EventTemplate([
            "https://blossom.example.com/",
            "https://cdn.example.com",
        ], 1234)).toEqual({
            kind: BUD03_KIND,
            content: "",
            tags: [
                ["server", "https://blossom.example.com"],
                ["server", "https://cdn.example.com"],
            ],
            created_at: 1234,
        });
    });

    it("rejects empty publish lists", () => {
        expect(() => buildBud03EventTemplate(["ftp://invalid.example.com"])).toThrow(
            "BUD-03 server list requires at least one server",
        );
    });

    it("fetches the newest kind 10063 event", async () => {
        const rxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer) => {
                    observer.next({
                        event: {
                            id: "a".repeat(64),
                            kind: BUD03_KIND,
                            pubkey: "pubkey",
                            created_at: 10,
                            tags: [["server", "https://old.example.com"]],
                        },
                    });
                    observer.next({
                        event: {
                            id: "b".repeat(64),
                            kind: BUD03_KIND,
                            pubkey: "pubkey",
                            created_at: 20,
                            tags: [["server", "https://new.example.com"]],
                        },
                    });
                    observer.complete();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        };

        const result = await fetchBud03ServerList({
            rxNostr: rxNostr as never,
            pubkeyHex: "pubkey",
        });

        expect(result.success).toBe(true);
        expect(result.servers).toEqual(["https://new.example.com"]);
    });

    it.each([
        ["high then low", ["b", "a"]],
        ["low then high", ["a", "b"]],
    ])("selects the lowest event ID for same-created_at candidates (%s)", async (_label, ids) => {
        const events = ids.map((id) => ({
            id: id.repeat(64),
            kind: BUD03_KIND,
            pubkey: "pubkey",
            created_at: 20,
            tags: [["server", id === "a" ? "https://low.example.com" : "https://high.example.com"]],
        }));
        const rxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer) => {
                    for (const event of events) observer.next({ event });
                    observer.complete();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        };

        const result = await fetchBud03ServerList({ rxNostr: rxNostr as never, pubkeyHex: "pubkey" });

        expect(result.event?.id).toBe("a".repeat(64));
        expect(result.servers).toEqual(["https://low.example.com"]);
    });

    it("prefers a newer created_at regardless of event ID", async () => {
        const rxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer) => {
                    observer.next({ event: {
                        id: "a".repeat(64), kind: BUD03_KIND, pubkey: "pubkey", created_at: 100,
                        tags: [["server", "https://old.example.com"]],
                    } });
                    observer.next({ event: {
                        id: "f".repeat(64), kind: BUD03_KIND, pubkey: "pubkey", created_at: 101,
                        tags: [["server", "https://new.example.com"]],
                    } });
                    observer.complete();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        };

        const result = await fetchBud03ServerList({ rxNostr: rxNostr as never, pubkeyHex: "pubkey" });

        expect(result.event?.id).toBe("f".repeat(64));
        expect(result.servers).toEqual(["https://new.example.com"]);
    });

    it("explicit relay が終了済みのみならデフォルト relay を使わず即時に失敗する", async () => {
        const rxNostr = { use: vi.fn() };

        await expect(fetchBud03ServerList({
            rxNostr: rxNostr as never,
            pubkeyHex: "pubkey",
            relays: [DECOMMISSIONED_RELAYS[0]],
        })).resolves.toEqual({ success: false, servers: [], error: "not_found" });

        expect(rxNostr.use).not.toHaveBeenCalled();
    });

    it("explicit relay の混在時は有効 relay だけを rx-nostr に渡す", async () => {
        const rxNostr = {
            use: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer) => {
                    observer.complete();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        };

        await fetchBud03ServerList({
            rxNostr: rxNostr as never,
            pubkeyHex: "pubkey",
            relays: [DECOMMISSIONED_RELAYS[0], "wss://relay.example.com"],
        });

        expect(rxNostr.use).toHaveBeenCalledWith(expect.anything(), {
            on: { relays: ["wss://relay.example.com/"] },
        });
    });

    it("signs and sends a BUD-03 event", async () => {
        const signedEvent = {
            id: "event-id",
            kind: BUD03_KIND,
            content: "",
            tags: [["server", "https://blossom.example.com"]],
        };
        const signer = {
            signEvent: vi.fn(async () => signedEvent),
            getPublicKey: vi.fn(async () => "pubkey"),
        };
        const rxNostr = {
            send: vi.fn().mockReturnValue({
                subscribe: vi.fn((observer) => {
                    observer.next({
                        from: "wss://write.example.com/",
                        ok: true,
                        done: true,
                        eventId: "event-id",
                    });
                    observer.complete();
                    return { unsubscribe: vi.fn() };
                }),
            }),
        };

        const result = await publishBud03ServerList({
            rxNostr: rxNostr as never,
            signer: signer as never,
            servers: ["https://blossom.example.com"],
        });

        expect(result).toEqual({
            success: true,
            eventId: "event-id",
            acceptedRelays: ["wss://write.example.com/"],
        });
        expect(signer.signEvent).toHaveBeenCalledWith(expect.objectContaining({
            kind: BUD03_KIND,
            content: "",
        }));
        expect(rxNostr.send).toHaveBeenCalledWith(signedEvent, expect.objectContaining({
            completeOn: "all-ok",
        }));
    });
});
