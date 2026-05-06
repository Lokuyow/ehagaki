import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UploadDestination } from "../../lib/types";

const mockRepository = vi.hoisted(() => ({
    getAll: vi.fn(),
    getDefault: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    setDefault: vi.fn(),
    move: vi.fn(),
    replaceBlossomServers: vi.fn(),
}));

vi.mock("../../lib/storage/uploadDestinationsRepository", () => ({
    uploadDestinationsRepository: mockRepository,
}));

vi.mock("../../stores/authStore.svelte", () => ({
    authState: {
        value: {
            pubkey: null,
            npub: null,
        },
    },
}));

const { uploadDestinationStore } = await import("../../stores/uploadDestinationStore.svelte");

function createDestination(): UploadDestination {
    return {
        id: "share-yabu-me-blossom",
        pubkeyHex: null,
        name: "share.yabu.me(blossom)",
        protocol: "blossom",
        serverUrl: "https://share.yabu.me/api/v2/media",
        presetId: "share-yabu-me-blossom",
        isDefault: true,
        enabled: true,
        createdAt: 1234,
        updatedAt: 1234,
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
        auth: {
            type: "blossom-bud11",
        },
        schemaVersion: 1,
    };
}

describe("uploadDestinationStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("reloads destinations after default creation so the default entry appears in the list", async () => {
        let defaultCreated = false;
        const destination = createDestination();

        mockRepository.getDefault.mockImplementation(async () => {
            defaultCreated = true;
            return destination;
        });
        mockRepository.getAll.mockImplementation(async () =>
            defaultCreated ? [destination] : []);

        await uploadDestinationStore.load(null);

        expect(uploadDestinationStore.value.defaultDestination).toEqual(destination);
        expect(uploadDestinationStore.value.destinations).toEqual([destination]);
    });
});
