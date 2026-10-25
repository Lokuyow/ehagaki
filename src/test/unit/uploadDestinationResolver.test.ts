import { describe, expect, it } from "vitest";
import { nip19 } from "nostr-tools";
import type { UploadDestination } from "../../lib/types";
import {
    resolveBlossomBandServerUrl,
    resolveUploadDestinationForUse,
} from "../../lib/upload/uploadDestinationResolver";

const pubkeyHex = "0a962eda42ab89270d4c0f6d62bc946ac6a93cff145805997be89f9ac269e90d";
const npub = nip19.npubEncode(pubkeyHex);

function createBlossomBandDestination(): UploadDestination {
    return {
        id: "blossom-band",
        pubkeyHex: null,
        name: "blossom.band",
        protocol: "blossom",
        serverUrl: "https://blossom.band",
        presetId: "blossom-band",
        isDefault: true,
        enabled: true,
        createdAt: 1,
        updatedAt: 1,
        capabilities: {
            maxUploadSize: null,
            supportedMimeTypes: [],
            supportsDelete: true,
            supportsList: true,
            supportsMirror: false,
            supportsMediaOptimization: false,
            authRequired: true,
            source: "preset",
        },
        auth: { type: "blossom-bud11" },
        schemaVersion: 1,
    };
}

function createGenericBlossomDestination(): UploadDestination {
    return {
        id: "nostr-download",
        pubkeyHex: null,
        name: "nostr.download",
        protocol: "blossom",
        serverUrl: "https://nostr.download",
        presetId: "nostr-download",
        isDefault: true,
        enabled: true,
        createdAt: 1,
        updatedAt: 1,
        capabilities: {
            maxUploadSize: null,
            supportedMimeTypes: [],
            supportsDelete: false,
            supportsList: false,
            supportsMirror: false,
            supportsMediaOptimization: false,
            authRequired: true,
            source: "preset",
        },
        auth: { type: "blossom-bud11" },
        schemaVersion: 1,
    };
}

function createNip96Destination(overrides: Partial<UploadDestination> = {}): UploadDestination {
    return {
        id: "share-yabu-me",
        pubkeyHex: null,
        name: "share.yabu.me",
        protocol: "nip96",
        serverUrl: "https://share.yabu.me/api/v2/media",
        resolvedUploadUrl: "https://share.yabu.me/api/v2/media",
        presetId: "share-yabu-me",
        isDefault: true,
        enabled: true,
        createdAt: 1,
        updatedAt: 1,
        capabilities: {
            maxUploadSize: null,
            supportedMimeTypes: [],
            supportsDelete: false,
            supportsList: false,
            supportsMirror: false,
            supportsMediaOptimization: false,
            authRequired: true,
            source: "preset",
        },
        auth: { type: "nip98" },
        schemaVersion: 1,
        ...overrides,
    };
}

describe("uploadDestinationResolver", () => {
    it("resolves blossom.band preset to the current user's npub subdomain", () => {
        expect(resolveBlossomBandServerUrl({ pubkeyHex })).toBe(`https://${npub}.blossom.band`);

        const destination = resolveUploadDestinationForUse(createBlossomBandDestination(), { pubkeyHex });

        expect(destination.serverUrl).toBe(`https://${npub}.blossom.band`);
        expect(destination).not.toHaveProperty("resolvedUploadUrl");
    });

    it("keeps generic Blossom destinations unchanged", () => {
        const destination = resolveUploadDestinationForUse(createGenericBlossomDestination(), { pubkeyHex });

        expect(destination.serverUrl).toBe("https://nostr.download");
        expect(destination.presetId).toBe("nostr-download");
    });

    it("resolves only safe legacy NIP-96 preset destinations to their direct upload URLs", () => {
        const legacyDestination = createNip96Destination();

        const resolved = resolveUploadDestinationForUse(legacyDestination, {});

        expect(resolved).toEqual(expect.objectContaining({
            name: "share.yabu.me",
            serverUrl: "https://share.yabu.me/api/v2/media",
            resolvedUploadUrl: "https://yabu.me/api/v2/media",
            presetId: "share-yabu-me",
        }));
        expect(legacyDestination.resolvedUploadUrl).toBe("https://share.yabu.me/api/v2/media");
    });

    it("keeps the cdn.nostrcheck.me direct endpoint in the NIP-96 context", () => {
        const destination = createNip96Destination({
            name: "nostrcheck.me",
            serverUrl: "https://cdn.nostrcheck.me/",
            resolvedUploadUrl: "https://cdn.nostrcheck.me/",
            presetId: "nostrcheck-me",
        });

        expect(resolveUploadDestinationForUse(destination, {})).toEqual(expect.objectContaining({
            protocol: "nip96",
            presetId: "nostrcheck-me",
            serverUrl: "https://cdn.nostrcheck.me/",
            resolvedUploadUrl: "https://cdn.nostrcheck.me/",
        }));
    });

    it.each([
        createNip96Destination({ presetId: "custom" }),
        createNip96Destination({ serverUrl: "https://custom.example/upload" }),
        createNip96Destination({ resolvedUploadUrl: "https://custom.example/upload" }),
    ])("does not resolve custom or user-edited NIP-96 destinations", (destination) => {
        expect(resolveUploadDestinationForUse(destination, {})).toEqual(destination);
    });

    it("keeps the existing non-NIP-96 runtime behavior of omitting resolvedUploadUrl", () => {
        const destination = resolveUploadDestinationForUse(
            createNip96Destination({ protocol: "custom-http" }),
            {},
        );

        expect(destination).not.toHaveProperty("resolvedUploadUrl");
        expect(destination.protocol).toBe("custom-http");
    });

    it.each(["https://files.sovbit.host", "https://files.sovbit.host/api/v2/media", "https://files.sovbit.host/upload/"])(
        "uses Blossom for a saved Sovbit NIP-96 destination at %s", (serverUrl) => {
            const legacy = createNip96Destination({ id: "saved-sovbit", pubkeyHex, serverUrl, presetId: "files-sovbit-host",
                resolvedUploadUrl: "https://files.sovbit.host/upload", nip96ServerUrl: "https://files.sovbit.host",
                nip96UrlMode: "discovery", enabled: false, sortIndex: 7,
                capabilities: { ...createNip96Destination().capabilities, source: "protocol-discovery", raw: { api_url: "old" } } });
            const resolved = resolveUploadDestinationForUse(legacy, { pubkeyHex });
            expect(resolved).toMatchObject({ id: legacy.id, pubkeyHex, name: "files.sovbit.host", protocol: "blossom",
                serverUrl: "https://files.sovbit.host", presetId: "files-sovbit-host", enabled: false,
                isDefault: true, sortIndex: 7, createdAt: legacy.createdAt, updatedAt: legacy.updatedAt,
                auth: { type: "blossom-bud11" }, capabilities: { source: "preset" } });
            expect(resolved.capabilities).not.toHaveProperty("raw");
            for (const key of ["resolvedUploadUrl", "nip96ServerUrl", "nip96UrlMode"]) expect(resolved).not.toHaveProperty(key);
            expect(legacy.protocol).toBe("nip96");
            expect(resolveUploadDestinationForUse(resolved, { pubkeyHex })).toEqual(resolved);
        },
    );

    it.each([
        { serverUrl: "https://files.sovbit.host/upload?custom=1" },
        { serverUrl: "https://files.sovbit.host/upload#custom" },
        { serverUrl: "https://user@files.sovbit.host/upload" },
        { serverUrl: "http://files.sovbit.host/upload" },
        { serverUrl: "https://files.sovbit.host/other-api" },
        { serverUrl: "https://files.sovbit.host.evil.example/upload" },
        { resolvedUploadUrl: "https://custom.example/upload" },
        { nip96ServerUrl: "https://custom.example" },
    ])("preserves edited or invalid Sovbit destinations for normal validation (%j)", (overrides) => {
        const destination = createNip96Destination({ presetId: "files-sovbit-host", serverUrl: "https://files.sovbit.host",
            resolvedUploadUrl: "https://files.sovbit.host/upload", ...overrides });
        expect(resolveUploadDestinationForUse(destination, {})).toEqual(destination);
    });

    it("does not change an explicit Sovbit Custom HTTP destination to Blossom", () => {
        const destination = createNip96Destination({ protocol: "custom-http", presetId: "custom",
            serverUrl: "https://files.sovbit.host/upload", resolvedUploadUrl: undefined });
        expect(resolveUploadDestinationForUse(destination, {})).toEqual(destination);
    });
});
