import { afterEach, describe, expect, it, vi } from "vitest";
import {
    channelContextProvenanceState,
    channelContextRuntimeState,
    channelContextState,
    clearChannelContext,
    effectiveChannelContextState,
    getChannelContextOwnerToken,
    onChannelContextChanged,
    restoreChannelContext,
    setChannelContext,
    setChannelContextRuntimeState,
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

    it("V2復元ではmetadata provenanceを維持し、runtime-only情報を別stateに置く", () => {
        restoreChannelContext({
            version: 2,
            eventId: stable.eventId,
            relayHints: stable.relayHints,
            channelRelayCandidates: stable.channelRelays,
            seedMetadata: {
                name: "Seed",
                about: null,
                picture: null,
            },
            overrides: {
                name: "Draft override",
            },
        });

        expect(channelContextState.value?.name).toBe("Seed");
        expect(channelContextProvenanceState.value).toEqual({
            source: "draft",
            metadataOverrides: { name: "Draft override" },
        });
        expect(effectiveChannelContextState.value?.name).toBe("Draft override");
        expect(channelContextRuntimeState.value).toEqual({
            phase: "ready",
            quality: null,
            source: "seed",
        });
    });

    it("phaseとqualityだけの変更ではstable context listenerを通知しない", () => {
        setChannelContext(stable);
        const listener = vi.fn();
        const unsubscribe = onChannelContextChanged(listener);

        setChannelContextRuntimeState({
            phase: "refreshing",
            quality: "legacy-seed",
            source: "cache",
        });

        expect(listener).not.toHaveBeenCalled();
        expect(channelContextRuntimeState.value.phase).toBe("refreshing");
        expect(channelContextState.value).toEqual(stable);
        unsubscribe();
    });
});
