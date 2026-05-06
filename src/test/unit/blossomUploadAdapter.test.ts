import { describe, expect, it, vi } from "vitest";
import { BlossomUploadAdapter } from "../../lib/upload/BlossomUploadAdapter";
import type { UploadDestination } from "../../lib/types";

vi.mock("../../lib/utils/fileUtils", () => ({
    calculateSHA256Hex: vi.fn(async () => "a".repeat(64)),
}));

function createDestination(): UploadDestination {
    return {
        id: "blossom-band",
        pubkeyHex: null,
        name: "blossom.band",
        protocol: "blossom",
        serverUrl: "https://npub1example.blossom.band",
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

describe("BlossomUploadAdapter", () => {
    it("uses an image/png probe for HEAD /upload connection tests", async () => {
        const adapter = new BlossomUploadAdapter();
        const fetchMock = vi.fn(async () => new Response(null, { status: 200 }));
        const authService = {
            buildAuthHeader: vi.fn(),
            buildBlossomAuthorizationHeader: vi.fn(async () => "Nostr mock-token"),
        };

        const result = await adapter.testConnection({
            destination: createDestination(),
            fetch: fetchMock as unknown as typeof fetch,
            authService,
        });

        expect(result.success).toBe(true);
        expect(fetchMock).toHaveBeenCalledWith(
            "https://npub1example.blossom.band/upload",
            expect.objectContaining({
                method: "HEAD",
                headers: expect.objectContaining({
                    "X-Content-Type": "image/png",
                }),
            }),
        );
        const firstCall = fetchMock.mock.calls[0] as unknown as [string, RequestInit];

        expect(firstCall[1].headers).toEqual(
            expect.objectContaining({
                "X-Content-Type": "image/png",
            }),
        );
    });
});