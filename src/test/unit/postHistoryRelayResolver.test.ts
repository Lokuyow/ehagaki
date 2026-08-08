import { describe, expect, it } from "vitest";
import { FALLBACK_RELAYS } from "../../lib/relayLists";
import { resolvePostHistoryRelayUrls } from "../../lib/postHistoryRelayResolver";

describe("resolvePostHistoryRelayUrls", () => {
    it("keeps read relays first, preserves first duplicate position, and appends write-only relays", () => {
        expect(resolvePostHistoryRelayUrls({
            "wss://read-a.example": { read: true, write: false },
            "wss://shared.example": { read: true, write: true },
            "wss://write-only.example": { read: false, write: true },
        }, 10)).toEqual([
            "wss://read-a.example/",
            "wss://shared.example/",
            "wss://write-only.example/",
        ]);
    });

    it("keeps the existing array RelayConfig behavior", () => {
        expect(resolvePostHistoryRelayUrls([
            "wss://read-a.example",
            "wss://shared.example",
        ], 10)).toEqual([
            "wss://read-a.example/",
            "wss://shared.example/",
        ]);
    });

    it("delegates normalization and rejects malformed, non-WS(S), and credential URLs", () => {
        expect(resolvePostHistoryRelayUrls([
            "wss://normalized.example////",
            "not a url",
            "https://not-a-relay.example",
            "wss://user:password@credential.example",
        ], 10)).toEqual(["wss://normalized.example/"]);
    });

    it("does not fall back when one configured candidate remains valid", () => {
        expect(resolvePostHistoryRelayUrls([
            "not a url",
            "wss://valid.example",
        ], 10)).toEqual(["wss://valid.example/"]);
    });

    it.each([
        [null, "null"],
        [undefined, "undefined"],
        [[], "empty"],
        [["not a url"], "fully sanitized"],
    ])("uses sanitized fallback for %s configuration", (relayConfig, _label) => {
        expect(resolvePostHistoryRelayUrls(relayConfig as null | undefined | string[], 2))
            .toEqual(FALLBACK_RELAYS.slice(0, 2));
    });

    it("applies the same limit to configured and fallback relays after sanitize order", () => {
        expect(resolvePostHistoryRelayUrls([
            "wss://first.example",
            "wss://first.example/",
            "wss://second.example",
            "wss://third.example",
        ], 2)).toEqual([
            "wss://first.example/",
            "wss://second.example/",
        ]);
        expect(resolvePostHistoryRelayUrls(null, 3)).toEqual(FALLBACK_RELAYS.slice(0, 3));
    });

    it("retains representative policy ordering through invalid candidates and limit", () => {
        expect(resolvePostHistoryRelayUrls({
            "wss://read-a.example": { read: true, write: false },
            "wss://shared.example": { read: true, write: true },
            "wss://write-only.example": { read: false, write: true },
            "https://malformed.example": { read: true, write: true },
            "wss://read-b.example": { read: true, write: false },
        }, 3)).toEqual([
            "wss://read-a.example/",
            "wss://shared.example/",
            "wss://read-b.example/",
        ]);
    });
});
