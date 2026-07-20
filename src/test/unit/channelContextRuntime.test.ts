import { describe, expect, it } from "vitest";
import {
    buildEffectiveChannelContext,
    prepareExternalChannelContext,
} from "../../lib/channelContextRuntime";

const eventId = "a".repeat(64);

describe("channelContextRuntime", () => {
    it.each([
        { writes: 3, hints: 3, expectedWrites: 3, expectedHints: 0 },
        { writes: 2, hints: 3, expectedWrites: 2, expectedHints: 1 },
        { writes: 0, hints: 4, expectedWrites: 0, expectedHints: 3 },
    ])("外部relayの共有3件枠をwrite優先で配分する: $writes/$hints", ({
        writes,
        hints,
        expectedWrites,
        expectedHints,
    }) => {
        const prepared = prepareExternalChannelContext({
            eventId,
            channelRelays: Array.from({ length: writes }, (_, index) =>
                `wss://write-${index}.example.com`),
            relayHints: Array.from({ length: hints }, (_, index) =>
                `wss://read-${index}.example.com`),
        }, "iframe");

        expect(prepared.provenance.channelRelayOverrides ?? []).toHaveLength(expectedWrites);
        expect(prepared.coordinatorQuery.relayHints).toHaveLength(expectedHints);
    });

    it("正規化後に同じrelayはwrite overrideだけへ分類する", () => {
        const prepared = prepareExternalChannelContext({
            eventId,
            channelRelays: ["wss://shared.example.com"],
            relayHints: [
                "wss://shared.example.com/",
                "wss://read.example.com",
            ],
        }, "url");

        expect(prepared.provenance.channelRelayOverrides).toEqual([
            "wss://shared.example.com/",
        ]);
        expect(prepared.coordinatorQuery.relayHints).toEqual([
            "wss://read.example.com/",
        ]);
    });

    it("stableを変更せずmetadataとwrite relayのeffective contextを導出する", () => {
        const stable = {
            eventId,
            relayHints: ["wss://read.example.com/"],
            channelRelays: ["wss://verified.example.com/"],
            name: "Verified",
            about: "Verified about",
            picture: "https://example.com/verified.png",
        };
        const effective = buildEffectiveChannelContext(stable, {
            source: "iframe",
            metadataOverrides: { name: "Parent", picture: null },
            channelRelayOverrides: ["wss://external.example.com/"],
        });

        expect(effective).toEqual({
            ...stable,
            channelRelays: [
                "wss://external.example.com/",
                "wss://verified.example.com/",
            ],
            name: "Parent",
            picture: null,
        });
        expect(stable).toEqual(expect.objectContaining({
            channelRelays: ["wss://verified.example.com/"],
            name: "Verified",
            picture: "https://example.com/verified.png",
        }));
    });
});
