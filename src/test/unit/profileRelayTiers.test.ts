import { describe, expect, it } from "vitest";
import { BOOTSTRAP_RELAYS, FALLBACK_RELAYS } from "../../lib/constants";
import { buildProfileRelayTiers } from "../../lib/profileRelayTiers";

describe("buildProfileRelayTiers", () => {
    it("keeps bootstrap and fallback in dedicated tiers", () => {
        const tiers = buildProfileRelayTiers([
            FALLBACK_RELAYS[0],
            "wss://context.example.com",
            BOOTSTRAP_RELAYS[0],
        ], 1);

        expect(tiers.bootstrap).toEqual(BOOTSTRAP_RELAYS);
        expect(tiers.contextual).toEqual(["wss://context.example.com/"]);
        expect(tiers.fallback).toEqual(FALLBACK_RELAYS);
    });

    it("sanitizes, deduplicates, and limits contextual relays without limiting bootstrap", () => {
        const tiers = buildProfileRelayTiers([
            "wss://One.example.com////",
            "wss://one.example.com/",
            "https://invalid.example.com/",
            "wss://two.example.com/",
            "wss://three.example.com/",
        ], 2);

        expect(tiers.bootstrap).toHaveLength(BOOTSTRAP_RELAYS.length);
        expect(tiers.contextual).toEqual([
            "wss://one.example.com/",
            "wss://two.example.com/",
        ]);
    });
});
