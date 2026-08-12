import { afterEach, describe, expect, it, vi } from "vitest";
import { BlossomUploadAdapter, createBlossomClient } from "../../lib/upload/BlossomUploadAdapter";
import { calculateSHA256Hex } from "../../lib/utils/fileUtils";
import type { UploadDestination } from "../../lib/types";
import { createJsonResponse } from "../uploadResponseTestUtils";

vi.mock("../../lib/utils/fileUtils", () => ({
    calculateSHA256Hex: vi.fn(async () => "a".repeat(64)),
}));

vi.mock("../../lib/signedEventResultValidator", async (importOriginal) => ({
    ...await importOriginal<typeof import("../../lib/signedEventResultValidator")>(),
    validateSignedEventResult: (_template: unknown, signedEvent: unknown) => signedEvent,
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

const SHA256 = "a".repeat(64);
const MIME_PROBE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
];

function createValidDescriptor(overrides: Record<string, unknown> = {}) {
    return {
        url: `https://npub1example.blossom.band/${SHA256}.png`,
        sha256: SHA256,
        size: 4,
        type: "image/png",
        uploaded: 1_700_000_000,
        ...overrides,
    };
}

function decodeBase64UrlHeader(header: string): string {
    const token = header.replace(/^Nostr /, "");
    const padded = token.replace(/-/g, "+").replace(/_/g, "/")
        + "=".repeat((4 - (token.length % 4)) % 4);
    return new TextDecoder().decode(Uint8Array.from(atob(padded), (character) => character.charCodeAt(0)));
}

function createConnectionTestAuthService(authorization: string) {
    return {
        buildAuthHeader: vi.fn(),
        buildBlossomAuthorizationHeader: vi.fn(async () => authorization),
        createBlossomConnectionTestAuthorization: vi.fn(async () => ({
            authorization,
            assertSession: vi.fn(),
        })),
    };
}

type BlossomHttpCall = {
    httpCall: (
        method: string,
        url: string,
        contentType?: string,
        addAuthorization?: () => Promise<string>,
        body?: File | Blob,
        result?: unknown,
    ) => Promise<unknown>;
};

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

function mockImageLoads(loadStates: boolean[]) {
    return vi.spyOn(window, "Image").mockImplementation(function () {
        const image = {
            onload: null as (() => void) | null,
            onerror: null as (() => void) | null,
            src: "",
        };

        setTimeout(() => {
            const shouldLoad = loadStates.shift() ?? true;
            if (shouldLoad) {
                image.onload?.();
                return;
            }

            image.onerror?.();
        }, 0);

        return image as unknown as HTMLImageElement;
    });
}

describe("BlossomUploadAdapter", () => {
    it("uses nostr-tools BlossomClient with an authService signer for uploads", async () => {
        mockImageLoads([true]);

        const adapter = new BlossomUploadAdapter();
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createJsonResponse(createValidDescriptor(), {
                status: 200,
            }))
            .mockResolvedValueOnce(new Response(null, {
                status: 200,
                headers: { "content-type": "image/png" },
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
                redirect: "error",
                credentials: "omit",
                referrerPolicy: "no-referrer",
            }),
        );
        const firstCall = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        const authorization = (firstCall[1].headers as Record<string, string>).Authorization;

        expect(authorization).toMatch(/^Nostr [A-Za-z0-9_-]+$/);
        expect(authorization).not.toMatch(/[+/=]/);
        expect(JSON.parse(decodeBase64UrlHeader(authorization))).toEqual(await signer.signEvent.mock.results[0].value);
        expect(result).toMatchObject({
            success: true,
            url: `https://npub1example.blossom.band/${SHA256}.png`,
            nip94: {
                url: `https://npub1example.blossom.band/${SHA256}.png`,
                x: SHA256,
                size: "4",
                m: "image/png",
            },
        });
    });

    it.each([
        { authorization: undefined, description: "a missing Authorization" },
        { authorization: "", description: "an empty Authorization" },
        { authorization: "   ", description: "a whitespace Authorization" },
        { authorization: "Bearer token", description: "a wrong Authorization scheme" },
        { authorization: "Nostr abc$", description: "a malformed Authorization token" },
        { authorization: "Nostr bm90IGpzb24=", description: "a non-JSON Authorization payload" },
    ])("does not start PUT for $description", async ({ authorization }) => {
        const fetchMock = vi.fn();
        const client = createBlossomClient(
            createDestination(),
            {
                getPublicKey: async () => "f".repeat(64),
                signEvent: async () => ({} as any),
            },
            fetchMock as unknown as typeof fetch,
        ) as unknown as BlossomHttpCall;

        await expect(client.httpCall(
            "PUT",
            "upload",
            "image/png",
            async () => authorization as string,
            new Blob(["test"], { type: "image/png" }),
            {},
        )).rejects.toThrow();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("keeps an already Base64url PUT Authorization header valid", async () => {
        const eventJson = JSON.stringify({
            id: "a".repeat(64),
            pubkey: "b".repeat(64),
            sig: "c".repeat(128),
            kind: 24242,
            created_at: 1_700_000_000,
            content: "blossom stuff",
            tags: [["t", "upload"]],
        });
        const token = btoa(eventJson).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
        const fetchMock = vi.fn(async () => new Response(null, { status: 200 }));
        const client = createBlossomClient(
            createDestination(),
            {
                getPublicKey: async () => "f".repeat(64),
                signEvent: async () => ({} as any),
            },
            fetchMock as unknown as typeof fetch,
        ) as unknown as BlossomHttpCall;

        await client.httpCall(
            "PUT",
            "upload",
            "image/png",
            async () => `Nostr ${token}`,
            new Blob(["test"], { type: "image/png" }),
            {},
        );

        const firstCall = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
        expect((firstCall[1].headers as Record<string, string>).Authorization).toBe(`Nostr ${token}`);
        expect(firstCall[1]).toEqual(expect.objectContaining({
            redirect: "error",
            credentials: "omit",
            referrerPolicy: "no-referrer",
        }));
    });

    it("hashes and sizes the exact body passed to BlossomClient.uploadBlob", async () => {
        mockImageLoads([true]);
        const fileWithoutArrayBuffer = new File(
            [new Uint8Array([0x89, 0x50, 0x4e, 0x47])],
            "test.png",
            { type: "image/png" },
        );
        Object.defineProperty(fileWithoutArrayBuffer, "arrayBuffer", { value: undefined });
        let uploadedBody: Blob | undefined;
        const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
            if (init?.method === "PUT") {
                uploadedBody = init.body as Blob;
                return createJsonResponse(createValidDescriptor(), { status: 200 });
            }
            return new Response(null, {
                status: 200,
                headers: { "content-type": "image/png" },
            });
        });
        const signer = {
            getPublicKey: vi.fn(async () => "f".repeat(64)),
            signEvent: vi.fn(async (event) => ({
                ...event,
                id: "signed-event",
                pubkey: "f".repeat(64),
                sig: "signature",
            })),
        };

        const result = await new BlossomUploadAdapter().upload({
            file: fileWithoutArrayBuffer,
            destination: createDestination(),
            authService: {
                buildAuthHeader: vi.fn(),
                getBlossomSigner: vi.fn(async () => signer),
            },
            fetch: fetchMock as unknown as typeof fetch,
        });

        const hashedBody = vi.mocked(calculateSHA256Hex).mock.calls.at(-1)?.[0];
        expect(result.success).toBe(true);
        expect(hashedBody).toBe(uploadedBody);
        expect(uploadedBody?.size).toBe(4);
    });

    it("uses verified descriptor MIME for NIP-94 and availability when it differs from File MIME", async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createJsonResponse(createValidDescriptor({
                type: "application/octet-stream",
                nip94: {
                    url: "https://attacker.example/other.png",
                    x: "b".repeat(64),
                    size: "999",
                    m: "text/html",
                },
            }), { status: 200 }))
            .mockResolvedValueOnce(new Response(null, {
                status: 200,
                headers: { "content-type": "application/octet-stream" },
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

        const result = await new BlossomUploadAdapter().upload({
            file: new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "test.png", {
                type: "image/png",
            }),
            destination: createDestination(),
            authService: {
                buildAuthHeader: vi.fn(),
                getBlossomSigner: vi.fn(async () => signer),
            },
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result.success).toBe(true);
        expect(result.nip94).toEqual({
            url: `https://npub1example.blossom.band/${SHA256}.png`,
            x: SHA256,
            size: "4",
            m: "application/octet-stream",
        });
        expect(fetchMock).toHaveBeenNthCalledWith(
            2,
            `https://npub1example.blossom.band/${SHA256}.png`,
            expect.objectContaining({ method: "HEAD" }),
        );
    });

    it("fails closed before availability when the server returns an invalid descriptor", async () => {
        const fetchMock = vi.fn().mockResolvedValueOnce(createJsonResponse(createValidDescriptor({
            sha256: "b".repeat(64),
        }), { status: 200 }));
        const signer = {
            getPublicKey: vi.fn(async () => "f".repeat(64)),
            signEvent: vi.fn(async (event) => ({
                ...event,
                id: "signed-event",
                pubkey: "f".repeat(64),
                sig: "signature",
            })),
        };

        const result = await new BlossomUploadAdapter().upload({
            file: new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "test.png", {
                type: "image/png",
            }),
            destination: createDestination(),
            authService: {
                buildAuthHeader: vi.fn(),
                getBlossomSigner: vi.fn(async () => signer),
            },
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect((fetchMock.mock.calls[0]?.[1] as RequestInit).method).toBe("PUT");
        expect(result).toMatchObject({ success: false });
        expect(result.url).toBeUndefined();
        expect(result.nip94).toBeUndefined();
    });

    it("waits until an uploaded image URL becomes loadable", async () => {
        vi.useFakeTimers();

        const adapter = new BlossomUploadAdapter();
        const imageSpy = mockImageLoads([false, true]);
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createJsonResponse(createValidDescriptor(), {
                status: 200,
            }))
            .mockRejectedValue(new TypeError("Failed to fetch"));
        const signer = {
            getPublicKey: vi.fn(async () => "f".repeat(64)),
            signEvent: vi.fn(async (event) => ({
                ...event,
                id: "signed-event",
                pubkey: "f".repeat(64),
                sig: "signature",
            })),
        };

        const uploadPromise = adapter.upload({
            file: new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "test.png", {
                type: "image/png",
            }),
            destination: createDestination(),
            authService: {
                buildAuthHeader: vi.fn(),
                getBlossomSigner: vi.fn(async () => signer),
            },
            fetch: fetchMock as unknown as typeof fetch,
        });

        await vi.runAllTimersAsync();

        const result = await uploadPromise;

        expect(result.success).toBe(true);
        expect(imageSpy).toHaveBeenCalledTimes(2);
    });

    it("uses an image/png probe for HEAD /upload connection tests", async () => {
        const adapter = new BlossomUploadAdapter();
        const fetchMock = vi.fn(async () => new Response(null, { status: 200 }));
        const authService = createConnectionTestAuthService(
            "Nostr eyJpZCI6ImEiLCJwdWJrZXkiOiJiIiwic2lnIjoiYyIsImtpbmQiOjI0MjQyLCJjcmVhdGVkX2F0IjoxLCJjb250ZW50IjoiYmxvc3NvbSBzdHVmZiIsInRhZ3MiOltdfQ",
        );

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
        const authorization = (firstCall[1].headers as Record<string, string>).Authorization;
        expect(authorization).toMatch(/^Nostr [A-Za-z0-9_-]+$/);
        expect(authorization).not.toMatch(/[+/=]/);
        expect(JSON.parse(decodeBase64UrlHeader(authorization))).toMatchObject({ kind: 24242 });
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
        const authService = createConnectionTestAuthService("Nostr mock-token");

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

    it("reuses one session-bound Authorization for the initial and MIME HEAD probes", async () => {
        const sampleFile = new File(["probe-body"], "probe.png", { type: "image/png" });
        const assertSession = vi.fn();
        const createAuthorization = vi.fn(async () => ({
            authorization: "Nostr connection-test-token",
            assertSession,
        }));
        const buildAuthorization = vi.fn();
        const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
            new Response(null, { status: 200 }));

        const result = await new BlossomUploadAdapter().testConnection({
            destination: createDestination(),
            fetch: fetchMock as unknown as typeof fetch,
            authService: {
                buildAuthHeader: vi.fn(),
                buildBlossomAuthorizationHeader: buildAuthorization,
                createBlossomConnectionTestAuthorization: createAuthorization,
            },
            sampleFile,
        });

        expect(result.success).toBe(true);
        expect(createAuthorization).toHaveBeenCalledOnce();
        expect(createAuthorization).toHaveBeenCalledWith(expect.objectContaining({
            sha256: SHA256,
            contentType: "image/png",
            contentLength: sampleFile.size,
        }));
        expect(buildAuthorization).not.toHaveBeenCalled();
        expect(assertSession).toHaveBeenCalledTimes(1 + MIME_PROBE_TYPES.length);
        expect(fetchMock).toHaveBeenCalledTimes(1 + MIME_PROBE_TYPES.length);

        const requestHeaders = fetchMock.mock.calls.map((call) =>
            (call[1] as RequestInit).headers as Record<string, string>);
        expect(requestHeaders.every((headers) =>
            headers.Authorization === "Nostr connection-test-token")).toBe(true);
        expect(requestHeaders.map((headers) => headers["X-SHA-256"])).toEqual(
            Array(1 + MIME_PROBE_TYPES.length).fill(SHA256),
        );
        expect(requestHeaders.map((headers) => headers["X-Content-Length"])).toEqual(
            Array(1 + MIME_PROBE_TYPES.length).fill(String(sampleFile.size)),
        );
        expect(requestHeaders.slice(1).map((headers) => headers["X-Content-Type"])).toEqual(
            MIME_PROBE_TYPES,
        );
    });

    it("creates an independent Authorization context for each connection test invocation", async () => {
        let invocation = 0;
        const createAuthorization = vi.fn(async () => ({
            authorization: `Nostr connection-test-token-${++invocation}`,
            assertSession: vi.fn(),
        }));
        const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
            new Response(null, { status: 200 }));
        const adapter = new BlossomUploadAdapter();
        const params = {
            destination: createDestination(),
            fetch: fetchMock as unknown as typeof fetch,
            authService: {
                buildAuthHeader: vi.fn(),
                createBlossomConnectionTestAuthorization: createAuthorization,
            },
        };

        await adapter.testConnection(params);
        await adapter.testConnection(params);

        expect(createAuthorization).toHaveBeenCalledTimes(2);
        const authorizations = fetchMock.mock.calls.map((call) =>
            ((call[1] as RequestInit).headers as Record<string, string>).Authorization);
        expect(authorizations.slice(0, 1 + MIME_PROBE_TYPES.length)).toEqual(
            Array(1 + MIME_PROBE_TYPES.length).fill("Nostr connection-test-token-1"),
        );
        expect(authorizations.slice(1 + MIME_PROBE_TYPES.length)).toEqual(
            Array(1 + MIME_PROBE_TYPES.length).fill("Nostr connection-test-token-2"),
        );
    });

    it("does not start an anonymous HEAD when Authorization context creation fails", async () => {
        const fetchMock = vi.fn();

        await expect(new BlossomUploadAdapter().testConnection({
            destination: createDestination(),
            fetch: fetchMock as unknown as typeof fetch,
            authService: {
                buildAuthHeader: vi.fn(),
                createBlossomConnectionTestAuthorization: vi.fn(async () => {
                    throw new Error("Authentication required");
                }),
            },
        })).rejects.toThrow("Authentication required");
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("fails closed when an Authorization builder has no session-bound context API", async () => {
        const fetchMock = vi.fn();
        const buildAuthorization = vi.fn(async () => "Nostr unsafe-token");

        await expect(new BlossomUploadAdapter().testConnection({
            destination: createDestination(),
            fetch: fetchMock as unknown as typeof fetch,
            authService: {
                buildAuthHeader: vi.fn(),
                buildBlossomAuthorizationHeader: buildAuthorization,
            },
        })).rejects.toThrow("Authentication required");
        expect(buildAuthorization).not.toHaveBeenCalled();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("preserves unauthenticated probes when authService is absent", async () => {
        const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
            new Response(null, { status: 401 }));

        const result = await new BlossomUploadAdapter().testConnection({
            destination: createDestination(),
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(result).toMatchObject({ success: false, status: 401 });
        const headers = (fetchMock.mock.calls[0]?.[1] as RequestInit).headers as Record<string, string>;
        expect(headers.Authorization).toBeUndefined();
    });

    it("uses explicit upload size headers when a Blossom server exposes them", async () => {
        const adapter = new BlossomUploadAdapter();
        const fetchMock = vi.fn(async () => new Response(null, {
            status: 200,
            headers: {
                "X-Max-Upload-Size": String(10 * 1024 * 1024),
            },
        }));
        const authService = createConnectionTestAuthService("Nostr mock-token");

        const result = await adapter.testConnection({
            destination: createDestination(),
            fetch: fetchMock as unknown as typeof fetch,
            authService,
        });

        expect(result.capabilities?.maxUploadSize).toBe(10 * 1024 * 1024);
    });
});
