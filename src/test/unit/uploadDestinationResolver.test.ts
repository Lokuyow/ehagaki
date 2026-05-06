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

describe("uploadDestinationResolver", () => {
    it("resolves blossom.band preset to the current user's npub subdomain", () => {
        expect(resolveBlossomBandServerUrl({ pubkeyHex })).toBe(`https://${npub}.blossom.band`);

        const destination = resolveUploadDestinationForUse(createBlossomBandDestination(), { pubkeyHex });

        expect(destination.serverUrl).toBe(`https://${npub}.blossom.band`);
        expect(destination).not.toHaveProperty("resolvedUploadUrl");
    });

    it("keeps generic Blossom destinations unchanged for non-blossom.band isolation", () => {
        const destination = resolveUploadDestinationForUse(createGenericBlossomDestination(), { pubkeyHex });

        expect(destination.serverUrl).toBe("https://nostr.download");
        expect(destination.presetId).toBe("nostr-download");
    });
});
