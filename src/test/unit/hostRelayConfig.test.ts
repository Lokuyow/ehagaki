import { describe, expect, it } from "vitest";
import {
    HostRelayConfigError,
    parseHostRelayConfig,
    toHostRelayConfig,
} from "../../lib/hostRelayConfig";
import { DECOMMISSIONED_RELAYS } from "../../lib/relayLists";

describe("Host Relay Config", () => {
    it("normalizes a strict public entry array without applying a hint limit", () => {
        const config = parseHostRelayConfig([
            { url: "wss://One.example.com", read: true, write: false },
            { url: "ws://two.example.com/", read: false, write: true },
            ...Array.from({ length: 5 }, (_, index) => ({
                url: `wss://extra-${index}.example.com`,
                read: true,
                write: true,
            })),
        ]);

        expect(config).toEqual(expect.objectContaining({
            "wss://one.example.com/": { read: true, write: false },
            "ws://two.example.com/": { read: false, write: true },
        }));
        expect(Object.keys(config)).toHaveLength(7);
        expect(toHostRelayConfig(config)).toEqual(expect.arrayContaining([
            { url: "wss://one.example.com/", read: true, write: false },
        ]));
    });

    it.each([
        [[], "empty"],
        [[{ url: "https://relay.example", read: true, write: true }], "protocol"],
        [[{ url: "wss://user:password@relay.example", read: true, write: true }], "credential"],
        [[{ url: DECOMMISSIONED_RELAYS[0], read: true, write: true }], "decommissioned"],
        [[{ url: "wss://relay.example", read: false, write: false }], "no capability"],
        [[{ url: "wss://relay.example", read: true, write: true, extra: true }], "unknown key"],
        [
            [
                { url: "wss://relay.example", read: true, write: true },
                { url: "wss://RELAY.example/", read: true, write: true },
            ],
            "duplicate",
        ],
    ])("rejects the whole config for %s", (payload, _label) => {
        expect(() => parseHostRelayConfig(payload)).toThrow(HostRelayConfigError);
    });
});
