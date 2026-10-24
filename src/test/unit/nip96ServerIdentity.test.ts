import { describe, expect, it, vi } from "vitest";
import { normalizeNip96ServerUrl } from "../../lib/upload/nip96ServerIdentity";
import { fetchRelayServerList, parseNip96ServerTags } from "../../lib/upload/bud03ServerList";

describe("NIP-96 relay server identities", () => {
    it("normalizes server identities and deduplicates without changing their preference order", () => {
        expect(parseNip96ServerTags([["server", "https://EXAMPLE.com:443/"], ["other", "ignored"], ["server", "https://second.example"], ["server", "https://example.com"]])).toEqual(["https://example.com", "https://second.example"]);
    });
    it.each(["http://example.com", "https://user:password@example.com", "https://127.0.0.1", "https://2130706433", "https://[::1]", "https://[::ffff:127.0.0.1]", "https://192.168.1.1", "https://localhost", "https://files.local", "https://intranet", "https://example.com/upload", "https://example.com/?token=private", "relative/path", "wss://example.com"])("rejects unsafe or non-server relay input %s", url => {
        expect(() => normalizeNip96ServerUrl(url)).toThrow();
    });
    it("does not silently discard invalid servers from a mixed preference list", () => {
        expect(() => parseNip96ServerTags([["server", "https://good.example"], ["server", "https://127.0.0.1"]])).toThrow();
    });
    it("selects the newest valid event independently of packet order and keeps an empty latest list", async () => {
        const events = [
            { id: "b".repeat(64), kind: 10096, pubkey: "owner", created_at: 10, tags: [["server", "https://old.example"]] },
            { id: "c".repeat(64), kind: 10096, pubkey: "owner", created_at: 30, tags: [["server", "https://127.0.0.1"]] },
            { id: "d".repeat(64), kind: 10096, pubkey: "owner", created_at: 20, tags: [] },
            { id: "e".repeat(64), kind: 10096, pubkey: "other", created_at: 40, tags: [["server", "https://other.example"]] },
        ];
        const unsubscribe = vi.fn();
        const rxNostr = { use: () => ({ subscribe: (observer: { next: (packet: { event: typeof events[number] }) => void; complete: () => void }) => {
            events.forEach(event => observer.next({ event })); observer.complete(); return { unsubscribe };
        } }) };
        const result = await fetchRelayServerList({ rxNostr: rxNostr as never, pubkeyHex: "owner", kind: 10096 });
        expect(result).toMatchObject({ success: true, servers: [], event: { id: "d".repeat(64) } });
        expect(unsubscribe).toHaveBeenCalledOnce();
    });
    it("aborts relay subscriptions and releases their timeout", async () => {
        vi.useFakeTimers();
        try {
            const controller = new AbortController(), unsubscribe = vi.fn();
            const rxNostr = { use: () => ({ subscribe: () => ({ unsubscribe }) }) };
            const operation = fetchRelayServerList({ rxNostr: rxNostr as never, pubkeyHex: "owner", kind: 10096, signal: controller.signal });
            controller.abort();
            expect((await operation).success).toBe(false);
            expect(unsubscribe).toHaveBeenCalledOnce();
            expect(vi.getTimerCount()).toBe(0);
        } finally { vi.useRealTimers(); }
    });
});
