import { describe, expect, it } from "vitest";
import { UPLOAD_DESTINATION_PRESETS } from "../../lib/upload/uploadDestinationPresets";

describe("uploadDestinationPresets", () => {
    it("includes configured NIP-96 upload endpoints as service presets", () => {
        expect(UPLOAD_DESTINATION_PRESETS).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: "share-yabu-me",
                name: "share.yabu.me",
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
                name: "nostrcheck.me",
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

    it("includes generic Blossom presets from lumilumi for isolation testing", () => {
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
            expect.objectContaining({
                id: "cdn-satellite-earth",
                name: "cdn.satellite.earth",
                protocol: "blossom",
                serverUrl: "https://cdn.satellite.earth",
            }),
        ]));
    });
});
