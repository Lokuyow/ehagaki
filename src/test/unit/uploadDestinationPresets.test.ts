import { describe, expect, it } from "vitest";
import {
    UPLOAD_DESTINATION_PRESETS,
    createLegacyUploadDestination,
    findUploadPresetByEndpoint,
} from "../../lib/upload/uploadDestinationPresets";

describe("uploadDestinationPresets", () => {
    it("exposes presets in the configured order for the settings dialog", () => {
        expect(UPLOAD_DESTINATION_PRESETS.map((preset) => preset.id)).toEqual([
            "share-yabu-me-blossom",
            "share-yabu-me",
            "cdn-nostrcheck-me",
            "nostrcheck-me",
            "blossom-band",
            "nostr-download",
            "blossom-primal-net",
            "nostr-build",
            "nostpic-com",
            "files-sovbit-host",
        ]);
    });

    it("includes configured NIP-96 upload endpoints as service presets", () => {
        expect(UPLOAD_DESTINATION_PRESETS).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: "share-yabu-me",
                name: "share.yabu.me(NIP-96)",
                protocol: "nip96",
                resolvedUploadUrl: "https://share.yabu.me/api/v2/media",
            }),
            expect.objectContaining({
                id: "nostpic-com",
                name: "nostpic.com",
                protocol: "nip96",
                resolvedUploadUrl: "https://nostpic.com/api/v2/media",
            }),
            expect.objectContaining({
                id: "nostrcheck-me",
                name: "nostrcheck.me(NIP-96)",
                protocol: "nip96",
                resolvedUploadUrl: "https://nostrcheck.me/api/v2/media",
            }),
            expect.objectContaining({
                id: "files-sovbit-host",
                name: "files.sovbit.host",
                protocol: "nip96",
                resolvedUploadUrl: "https://files.sovbit.host/api/v2/media",
            }),
        ]));
    });

    it("includes generic Blossom presets for alternate Blossom servers", () => {
        expect(UPLOAD_DESTINATION_PRESETS).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: "share-yabu-me-blossom",
                name: "share.yabu.me(blossom)",
                protocol: "blossom",
                serverUrl: "https://share.yabu.me/api/v2/media",
            }),
            expect.objectContaining({
                id: "blossom-band",
                name: "blossom.band",
                protocol: "blossom",
                serverUrl: "https://blossom.band",
            }),
            expect.objectContaining({
                id: "cdn-nostrcheck-me",
                name: "nostrcheck.me(blossom)",
                protocol: "blossom",
                serverUrl: "https://cdn.nostrcheck.me",
            }),
            expect.objectContaining({
                id: "nostr-download",
                name: "nostr.download",
                protocol: "blossom",
                serverUrl: "https://nostr.download",
            }),
            expect.objectContaining({
                id: "blossom-primal-net",
                name: "blossom.primal.net",
                protocol: "blossom",
                serverUrl: "https://blossom.primal.net",
            }),
        ]));
    });

    it("prefers the NIP-96 preset when a Blossom preset shares the same server URL", () => {
        expect(findUploadPresetByEndpoint("https://share.yabu.me/api/v2/media")?.id).toBe("share-yabu-me");
        expect(createLegacyUploadDestination({
            endpoint: "https://share.yabu.me/api/v2/media",
        }).presetId).toBe("share-yabu-me");
    });
});
