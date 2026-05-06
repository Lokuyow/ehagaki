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
    it("uses nostr-tools BlossomClient with an authService signer for uploads", async () => {
        const adapter = new BlossomUploadAdapter();
        const fetchMock = vi.fn(async () => new Response(JSON.stringify({
            url: "https://npub1example.blossom.band/mockhash.png",
            sha256: "a".repeat(64),
            size: 4,
            type: "image/png",
        }), {
            status: 200,
            headers: { "content-type": "application/json" },
        }));
        const signer = {
            getPublicKey: vi.fn(async () => "f".repeat(64)),
            signEvent: vi.fn(async (event) => ({
                ...event,
                id: "signed-event",
                pubkey: "f".repeat(64),
                sig: "signature",
            })),
        };
        const authService = {
            buildAuthHeader: vi.fn(),
            getBlossomSigner: vi.fn(async () => signer),
        };

        const result = await adapter.upload({
            file: new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "test.png", {
                type: "image/png",
            }),
            destination: createDestination(),
            authService,
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result.success).toBe(true);
        expect(authService.getBlossomSigner).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            "https://npub1example.blossom.band/upload",
            expect.objectContaining({
                method: "PUT",
            }),
        );
    });

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

    it("infers supported MIME types from a bounded set of BUD-06 HEAD probes", async () => {
        const adapter = new BlossomUploadAdapter();
        const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
            const headers = init?.headers as Record<string, string>;
            const contentType = headers["X-Content-Type"];

            if (contentType === "video/mp4") {
                return new Response(null, { status: 415 });
            }
            return new Response(null, { status: 200 });
        });
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
        expect(result.capabilities?.supportedMimeTypes).toContain("image/png");
        expect(result.capabilities?.supportedMimeTypes).toContain("image/jpeg");
        expect(result.capabilities?.supportedMimeTypes).toContain("image/svg+xml");
        expect(result.capabilities?.supportedMimeTypes).toContain("audio/mp3");
        expect(result.capabilities?.supportedMimeTypes).not.toContain("video/mp4");
        expect(result.capabilities?.maxUploadSize).toBeNull();
        expect(fetchMock).toHaveBeenCalledTimes(1 + 11);
    });

    it("uses explicit upload size headers when a Blossom server exposes them", async () => {
        const adapter = new BlossomUploadAdapter();
        const fetchMock = vi.fn(async () => new Response(null, {
            status: 200,
            headers: {
                "X-Max-Upload-Size": String(10 * 1024 * 1024),
            },
        }));
        const authService = {
            buildAuthHeader: vi.fn(),
            buildBlossomAuthorizationHeader: vi.fn(async () => "Nostr mock-token"),
        };

        const result = await adapter.testConnection({
            destination: createDestination(),
            fetch: fetchMock as unknown as typeof fetch,
            authService,
        });

        expect(result.capabilities?.maxUploadSize).toBe(10 * 1024 * 1024);
    });
});
