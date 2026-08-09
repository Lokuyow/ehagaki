import { describe, expect, it, vi } from "vitest";
import {
    BUD03_KIND,
    buildBud03EventTemplate,
    fetchBud03ServerList,
    parseBud03ServerTags,
    publishBud03ServerList,
} from "../../lib/upload/bud03ServerList";
import { DECOMMISSIONED_RELAYS } from "../../lib/relayLists";

vi.mock("../../lib/signedEventResultValidator", async (importOriginal) => ({
    ...await importOriginal<typeof import("../../lib/signedEventResultValidator")>(),
    validateSignedEventResult: (_template: unknown, signedEvent: unknown) => signedEvent,
}));

describe("bud03ServerList", () => {
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
