import { describe, expect, it, vi } from "vitest";
import { ChannelContextCoordinator } from "../../lib/channelContextCoordinator";
import {
    decodeDraftChannelContext,
    getDraftEffectiveChannelContext,
    serializeDraftChannelContext,
} from "../../lib/draftChannelContext";

const eventId = "a".repeat(64);

describe("draftChannelContext", () => {
    it("V1 relayをwriteへ昇格せず、verified cache relayだけをV2へ再保存する", async () => {
        const legacyRelay = "wss://legacy-temporary.example.com/";
        const verifiedRelay = "wss://verified-write.example.com/";
        const decoded = decodeDraftChannelContext({
            eventId,
            relayHints: [],
            channelRelays: [legacyRelay],
            name: "Legacy",
            about: null,
            picture: null,
            isMetadataLoading: true,
        });
        const cache = {
            channelEventId: eventId,
            name: "Verified",
            about: null,
            picture: null,
            relays: [verifiedRelay],
            relayHints: ["wss://verified-source.example.com/"],
            resolutionQuality: "verified-metadata" as const,
        };
        const repository = {
            get: vi.fn().mockResolvedValue(cache),
            getMany: vi.fn(),
            upsertResolvedChannel: vi.fn(),
            shouldRefresh: vi.fn().mockReturnValue(false),
            markFetchFailed: vi.fn(),
        };
        const coordinator = new ChannelContextCoordinator({
            repository,
            service: {
                resolveChannelMetadataWithInternalHints: vi.fn(),
            },
        });

        const handle = coordinator.resolveInternal(decoded.query);
        expect(handle.initial.context.channelRelays).toBeUndefined();
        expect(handle.initial.context.relayHints).not.toContain(legacyRelay);
        expect(getDraftEffectiveChannelContext({
            eventId,
            relayHints: [],
            channelRelays: [legacyRelay],
            name: "Legacy",
            about: null,
            picture: null,
        }).channelRelays).toBeUndefined();

        const cached = await handle.cacheReady;
        expect(cached.context.channelRelays).toEqual([verifiedRelay]);
        expect(cached.context.channelRelays).not.toContain(legacyRelay);
        expect(getDraftEffectiveChannelContext(
            serializeDraftChannelContext(cached.context, decoded.provenance)!,
        ).channelRelays).toEqual([verifiedRelay]);
        expect(serializeDraftChannelContext(
            cached.context,
            decoded.provenance,
        )).toMatchObject({
            version: 2,
            channelRelayCandidates: [verifiedRelay],
        });
        expect(JSON.stringify(
            serializeDraftChannelContext(cached.context, decoded.provenance),
        )).not.toContain(legacyRelay);
    });

    it("cacheなし・network失敗でもV1 relayをread/write候補に利用しない", async () => {
        const legacyRelay = "wss://legacy-temporary.example.com/";
        const decoded = decodeDraftChannelContext({
            eventId,
            relayHints: [],
            channelRelays: [legacyRelay],
            name: "Legacy",
            about: null,
            picture: null,
        });
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn().mockResolvedValue({
                status: "failed",
                reason: "root-not-found",
            }),
        };
        const repository = {
            get: vi.fn().mockResolvedValue(null),
            getMany: vi.fn(),
            upsertResolvedChannel: vi.fn(),
            shouldRefresh: vi.fn().mockReturnValue(true),
            markFetchFailed: vi.fn().mockResolvedValue(undefined),
        };
        const coordinator = new ChannelContextCoordinator({
            repository,
            service,
        });

        const handle = coordinator.resolveInternal(
            decoded.query,
            {} as never,
        );
        expect(handle.initial.context.channelRelays).toBeUndefined();
        const result = await handle.refresh;

        expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledWith(
            expect.objectContaining({
                relayHints: [],
            }),
            expect.anything(),
            undefined,
            expect.anything(),
        );
        expect(result.status).toBe("failed");
        expect(result.snapshot.context.channelRelays).toBeUndefined();
        expect(result.snapshot.context.relayHints).toEqual([]);
        expect(serializeDraftChannelContext(
            result.snapshot.context,
            decoded.provenance,
        )).not.toHaveProperty("channelRelayCandidates");
    });

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

    it("旧形式の表示値はseedとし、由来不明のchannelRelaysは破棄する", () => {
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
                name: "Legacy",
                about: "Legacy about",
                picture: null,
            },
            provenance: null,
        });
    });

    it("V1の既存relayHintsだけを正規化・重複排除してread上限を維持する", () => {
        const relayHints = Array.from(
            { length: 8 },
            (_, index) => `wss://read-${index}.example.com`,
        );
        const decoded = decodeDraftChannelContext({
            eventId,
            relayHints: [
                ...relayHints,
                "wss://read-0.example.com/",
                "wss://overflow.example.com",
            ],
            channelRelays: [
                "wss://discarded.example.com/",
            ],
            name: null,
            about: null,
            picture: null,
        });

        expect(decoded.query.channelRelays).toBeUndefined();
        expect(decoded.query.relayHints).toHaveLength(8);
        expect(decoded.query.relayHints).toEqual([
            ...relayHints.map((relay) => `${relay}/`),
        ]);
        expect(decoded.query.relayHints).not.toContain(
            "wss://discarded.example.com/",
        );
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
