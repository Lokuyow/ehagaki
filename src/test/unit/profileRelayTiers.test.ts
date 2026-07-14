import { describe, expect, it } from "vitest";
import { BOOTSTRAP_RELAYS, FALLBACK_RELAYS } from "../../lib/constants";
import {
    buildProfileRelayTiers,
    groupPubkeysByRelaySet,
} from "../../lib/profileRelayTiers";

describe("buildProfileRelayTiers", () => {
    it("keeps bootstrap and fallback in dedicated tiers", () => {
        const tiers = buildProfileRelayTiers({
            contextualRelays: [
                FALLBACK_RELAYS[0],
                "wss://context.example.com",
                BOOTSTRAP_RELAYS[0],
            ],
            contextualRelayLimit: 2,
        });

        expect(tiers.bootstrap).toEqual(BOOTSTRAP_RELAYS);
        expect(tiers.contextual).toEqual([
            "wss://context.example.com/",
            FALLBACK_RELAYS[0],
        ].sort());
        expect(tiers.fallback).toEqual(FALLBACK_RELAYS.slice(1));
    });

    it("sanitizes, deduplicates, and limits contextual relays without limiting bootstrap", () => {
        const tiers = buildProfileRelayTiers({
            contextualRelays: [
                "wss://One.example.com////",
                "wss://one.example.com/",
                "https://invalid.example.com/",
                "wss://two.example.com/",
                "wss://three.example.com/",
            ],
            contextualRelayLimit: 2,
        });

        expect(tiers.bootstrap).toHaveLength(BOOTSTRAP_RELAYS.length);
        expect(tiers.contextual).toEqual([
            "wss://one.example.com/",
            "wss://three.example.com/",
        ]);
    });

    it("places source=fallback relays in fallback even when they are not constants", () => {
        const tiers = buildProfileRelayTiers({
            contextualRelays: [],
            fallbackRelays: ["wss://custom-fallback.example.com"],
            contextualRelayLimit: 12,
        });

        expect(tiers.contextual).toEqual([]);
        expect(tiers.fallback).toContain("wss://custom-fallback.example.com/");
    });

    it("applies bootstrap then contextual then fallback precedence", () => {
        const contextualRelay = FALLBACK_RELAYS[0];
        const tiers = buildProfileRelayTiers({
            contextualRelays: [BOOTSTRAP_RELAYS[0], contextualRelay],
            fallbackRelays: [BOOTSTRAP_RELAYS[0], contextualRelay],
            contextualRelayLimit: 12,
        });

        expect(tiers.bootstrap).toContain(BOOTSTRAP_RELAYS[0]);
        expect(tiers.contextual).not.toContain(BOOTSTRAP_RELAYS[0]);
        expect(tiers.contextual).toContain(contextualRelay);
        expect(tiers.fallback).not.toContain(BOOTSTRAP_RELAYS[0]);
        expect(tiers.fallback).not.toContain(contextualRelay);
    });
});

describe("groupPubkeysByRelaySet", () => {
    it("groups only pubkeys with the same normalized relay array", () => {
        expect(groupPubkeysByRelaySet(["a", "b", "c", "empty"], {
            a: ["wss://second.example.com", "wss://shared.example.com/"],
            b: ["wss://other.example.com/"],
            c: ["wss://SHARED.example.com", "wss://second.example.com/"],
            empty: [],
        })).toEqual([
            {
                relays: ["wss://second.example.com/", "wss://shared.example.com/"],
                pubkeys: ["a", "c"],
            },
            {
                relays: ["wss://other.example.com/"],
                pubkeys: ["b"],
            },
        ]);
    });
});
