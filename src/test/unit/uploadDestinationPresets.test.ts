import { describe, expect, it } from "vitest";
import {
    UPLOAD_DESTINATION_PRESETS,
    createUploadDestinationFromPreset,
    createLegacyUploadDestination,
    findUploadPresetByEndpoint,
    getUploadDestinationDisplayName,
} from "../../lib/upload/uploadDestinationPresets";

describe("uploadDestinationPresets", () => {
    it("exposes presets in the configured order for the settings dialog", () => {
        expect(UPLOAD_DESTINATION_PRESETS.map((preset) => preset.id)).toEqual([
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

    it("keeps NIP-96 preset server identities separate from direct upload endpoints", () => {
        const expectedPresets = [
            ["share-yabu-me", "share.yabu.me", "https://share.yabu.me/api/v2/media", "https://yabu.me/api/v2/media"],
            ["nostrcheck-me", "nostrcheck.me", "https://nostrcheck.me/api/v2/media", "https://cdn.nostrcheck.me/"],
            ["nostr-build", "nostr.build", "https://nostr.build/api/v2/nip96/upload", "https://nostr.build/api/v2/nip96/upload"],
            ["nostpic-com", "nostpic.com", "https://nostpic.com/api/v2/media", "https://nostpic.com/api/v2/media"],
            ["files-sovbit-host", "files.sovbit.host", "https://files.sovbit.host/api/v2/media", "https://files.sovbit.host/upload"],
        ] as const;

        for (const [id, name, serverUrl, resolvedUploadUrl] of expectedPresets) {
            const preset = UPLOAD_DESTINATION_PRESETS.find((candidate) => candidate.id === id)!;
            expect(preset).toEqual(expect.objectContaining({
                id,
                name,
                protocol: "nip96",
                serverUrl,
                resolvedUploadUrl,
            }));
            expect(findUploadPresetByEndpoint(serverUrl)).toBe(preset);
            expect(findUploadPresetByEndpoint(resolvedUploadUrl)).toBe(preset);
            expect(createUploadDestinationFromPreset({ preset, now: 1 })).toEqual(expect.objectContaining({
                name,
                serverUrl,
                resolvedUploadUrl,
            }));
            expect(createLegacyUploadDestination({ endpoint: serverUrl, now: 1 })).toEqual(expect.objectContaining({
                name,
                serverUrl,
                resolvedUploadUrl,
            }));
        }
    });

    it("uses a preset name only while its protocol and fixed or resolved endpoint still match", () => {
        expect(getUploadDestinationDisplayName({
            protocol: "nip96",
            presetId: "share-yabu-me",
            serverUrl: "https://share.yabu.me/api/v2/media",
            resolvedUploadUrl: "https://yabu.me/api/v2/media",
        })).toBe("share.yabu.me");
        expect(getUploadDestinationDisplayName({
            protocol: "custom-http",
            presetId: "share-yabu-me",
            serverUrl: "https://share.yabu.me/api/v2/media",
            resolvedUploadUrl: "https://yabu.me/api/v2/media",
        })).toBe("share.yabu.me");
        expect(getUploadDestinationDisplayName({
            protocol: "nip96",
            presetId: "share-yabu-me",
            serverUrl: "https://custom.example/upload",
            resolvedUploadUrl: "https://yabu.me/api/v2/media",
        })).toBe("custom.example");
    });

    it("includes generic Blossom presets for alternate Blossom servers", () => {
        expect(UPLOAD_DESTINATION_PRESETS).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: "blossom-band",
                name: "blossom.band",
                protocol: "blossom",
                serverUrl: "https://blossom.band",
            }),
            expect.objectContaining({
                id: "cdn-nostrcheck-me",
                name: "cdn.nostrcheck.me",
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

    it("derives fallback destination names from the endpoint hostname", () => {
        expect(createLegacyUploadDestination({
            endpoint: "https://example.com/upload",
        })).toEqual(expect.objectContaining({
            name: "example.com",
            protocol: "nip96",
            presetId: "custom",
        }));
    });
});
