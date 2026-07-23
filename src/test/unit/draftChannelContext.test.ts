import { describe, expect, it } from "vitest";
import {
    decodeDraftChannelContext,
    getDraftEffectiveChannelContext,
    serializeDraftChannelContext,
} from "../../lib/draftChannelContext";

const eventId = "a".repeat(64);

describe("draftChannelContext", () => {
    it("V2はstable seedとmetadata overrideを分離し、relay overrideを保存しない", () => {
        const legacyRuntimeState = {
            eventId,
            relayHints: ["wss://read.example.com"],
            channelRelays: ["wss://verified-write.example.com"],
            name: "Verified",
            about: null,
            picture: "https://example.com/verified.png",
            isMetadataLoading: true,
        };
        const data = serializeDraftChannelContext(legacyRuntimeState, {
            source: "iframe",
            metadataOverrides: {
                name: "Parent",
                picture: null,
            },
            channelRelayOverrides: ["wss://external-write.example.com"],
        });

        expect(data).toEqual({
            version: 2,
            eventId,
            relayHints: ["wss://read.example.com/"],
            channelRelayCandidates: ["wss://verified-write.example.com/"],
            seedMetadata: {
                name: "Verified",
                about: null,
                picture: "https://example.com/verified.png",
            },
            overrides: {
                name: "Parent",
                picture: null,
            },
        });
        expect(data).not.toHaveProperty("channelRelayOverrides");
        expect(data).not.toHaveProperty("phase");
        expect(data).not.toHaveProperty("quality");
        expect(data).not.toHaveProperty("isMetadataLoading");
    });

    it("旧形式の表示値はoverrideでなく置換可能なseedとしてdecodeする", () => {
        const decoded = decodeDraftChannelContext({
            eventId,
            relayHints: ["wss://read.example.com"],
            channelRelays: ["wss://saved-write.example.com"],
            name: "Legacy",
            about: "Legacy about",
            picture: null,
            isMetadataLoading: true,
        });

        expect(decoded).toEqual({
            query: {
                eventId,
                relayHints: ["wss://read.example.com/"],
                channelRelays: ["wss://saved-write.example.com/"],
                name: "Legacy",
                about: "Legacy about",
                picture: null,
            },
            provenance: null,
        });
    });

    it("V2のmetadata overrideだけを通常画面での復元後も維持する", () => {
        const data = {
            version: 2 as const,
            eventId,
            relayHints: [],
            channelRelayCandidates: ["wss://saved-write.example.com"],
            seedMetadata: {
                name: "Seed",
                about: "Seed about",
                picture: "https://example.com/seed.png",
            },
            overrides: {
                name: "Persisted override",
                picture: null,
            },
        };

        expect(getDraftEffectiveChannelContext(data)).toEqual({
            eventId,
            relayHints: [],
            channelRelays: ["wss://saved-write.example.com/"],
            name: "Persisted override",
            about: "Seed about",
            picture: null,
        });
        expect(decodeDraftChannelContext(data).provenance).toEqual({
            source: "draft",
            metadataOverrides: {
                name: "Persisted override",
                picture: null,
            },
        });
    });
});
