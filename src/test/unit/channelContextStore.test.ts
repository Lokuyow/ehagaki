import { afterEach, describe, expect, it } from "vitest";
import {
    channelContextProvenanceState,
    channelContextState,
    clearChannelContext,
    effectiveChannelContextState,
    getChannelContextOwnerToken,
    restoreChannelContext,
    setChannelContext,
    setChannelContextWithProvenance,
} from "../../stores/channelContextStore.svelte";

const stable = {
    eventId: "a".repeat(64),
    relayHints: ["wss://read.example.com/"],
    channelRelays: ["wss://verified.example.com/"],
    name: "Verified",
    about: null,
    picture: null,
};

describe("channelContextStore", () => {
    afterEach(() => clearChannelContext());

    it("stableとruntime provenanceからeffective contextだけを導出する", () => {
        const token = Symbol("external");
        setChannelContextWithProvenance(stable, {
            source: "iframe",
            metadataOverrides: { name: "Parent" },
            channelRelayOverrides: ["wss://external.example.com/"],
        }, token);

        expect(channelContextState.value).toEqual(stable);
        expect(effectiveChannelContextState.value).toEqual({
            ...stable,
            name: "Parent",
            channelRelays: [
                "wss://external.example.com/",
                "wss://verified.example.com/",
            ],
        });
        expect(getChannelContextOwnerToken()).toBe(token);
    });

    it.each(["set", "restore", "clear"])("%sはexternal ownershipとprovenanceを解除する", (action) => {
        setChannelContextWithProvenance(stable, {
            source: "url",
            metadataOverrides: { name: "External" },
        }, Symbol("external"));

        if (action === "set") setChannelContext({ ...stable, name: "Normal" });
        if (action === "restore") restoreChannelContext({ ...stable, name: "Draft" });
        if (action === "clear") clearChannelContext();

        expect(getChannelContextOwnerToken()).toBeNull();
        expect(channelContextProvenanceState.value).toBeNull();
    });
});
