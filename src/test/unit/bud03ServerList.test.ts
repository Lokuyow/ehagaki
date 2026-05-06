import { describe, expect, it, vi } from "vitest";
import {
    BUD03_KIND,
    buildBud03EventTemplate,
    fetchBud03ServerList,
    parseBud03ServerTags,
    publishBud03ServerList,
} from "../../lib/upload/bud03ServerList";

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
                            kind: BUD03_KIND,
                            pubkey: "pubkey",
                            created_at: 10,
                            tags: [["server", "https://old.example.com"]],
                        },
                    });
                    observer.next({
                        event: {
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
                    observer.next({ ok: true, eventId: "event-id" });
                    return { unsubscribe: vi.fn() };
                }),
            }),
        };

        const result = await publishBud03ServerList({
            rxNostr: rxNostr as never,
            signer: signer as never,
            servers: ["https://blossom.example.com"],
        });

        expect(result).toEqual({ success: true, eventId: "event-id" });
        expect(signer.signEvent).toHaveBeenCalledWith(expect.objectContaining({
            kind: BUD03_KIND,
            content: "",
        }));
        expect(rxNostr.send).toHaveBeenCalledWith(signedEvent, expect.objectContaining({
            completeOn: "all-ok",
        }));
    });
});
