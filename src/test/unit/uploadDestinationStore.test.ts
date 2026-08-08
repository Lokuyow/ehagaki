import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UploadDestination } from "../../lib/types";
import { createDeferred } from "../deferredTestUtils";

const mockRepository = vi.hoisted(() => ({
    getAll: vi.fn(),
    getDefault: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    setDefault: vi.fn(),
    move: vi.fn(),
    replaceBlossomServers: vi.fn(),
}));
const bud03Mocks = vi.hoisted(() => ({
    fetchBud03ServerList: vi.fn(),
    publishBud03ServerList: vi.fn(),
}));

vi.mock("../../lib/storage/uploadDestinationsRepository", () => ({
    uploadDestinationsRepository: mockRepository,
}));

vi.mock("../../lib/upload/bud03ServerList", () => bud03Mocks);

vi.mock("../../stores/authStore.svelte", () => ({
    authState: {
        value: {
            pubkey: null,
            npub: null,
        },
    },
}));

const { uploadDestinationStore } = await import("../../stores/uploadDestinationStore.svelte");

function createDestination(pubkeyHex: string | null = null, id = "share-yabu-me"): UploadDestination {
    return {
        id,
        pubkeyHex,
        name: "share.yabu.me",
        protocol: "nip96",
        serverUrl: "https://share.yabu.me/api/v2/media",
        resolvedUploadUrl: "https://share.yabu.me/api/v2/media",
        presetId: "share-yabu-me",
        isDefault: true,
        enabled: true,
        createdAt: 1234,
        updatedAt: 1234,
        capabilities: {
            maxUploadSize: null,
            supportedMimeTypes: ["image/*", "video/*"],
            supportsDelete: false,
            supportsList: false,
            supportsMirror: false,
            supportsMediaOptimization: false,
            authRequired: true,
            source: "preset",
        },
        auth: {
            type: "nip98",
        },
        schemaVersion: 1,
    };
}

describe("uploadDestinationStore", () => {
    beforeEach(() => {
        uploadDestinationStore.reset();
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

    it("keeps B destinations when an older A load succeeds after an account switch", async () => {
        const aDestinations = createDeferred<UploadDestination[]>();
        const bDestinations = createDeferred<UploadDestination[]>();
        const aDestination = createDestination("account-a", "a");
        const bDestination = createDestination("account-b", "b");
        mockRepository.getDefault.mockImplementation(async (pubkeyHex: string) =>
            pubkeyHex === "account-a" ? aDestination : bDestination,
        );
        mockRepository.getAll.mockImplementation((pubkeyHex: string) =>
            pubkeyHex === "account-a" ? aDestinations.promise : bDestinations.promise,
        );

        const aLoad = uploadDestinationStore.load("account-a");
        const bLoad = uploadDestinationStore.load("account-b");
        bDestinations.resolve([bDestination]);
        await bLoad;
        aDestinations.resolve([aDestination]);
        await aLoad;

        expect(uploadDestinationStore.value.destinations).toEqual([bDestination]);
        expect(uploadDestinationStore.value.defaultDestination).toEqual(bDestination);
        expect(uploadDestinationStore.value.error).toBeNull();
        expect(uploadDestinationStore.value.loading).toBe(false);
    });

    it("does not let an older failed A load update B error or loading", async () => {
        const aDefault = createDeferred<UploadDestination>();
        const bDestination = createDestination("account-b", "b");
        mockRepository.getDefault.mockImplementation((pubkeyHex: string) =>
            pubkeyHex === "account-a" ? aDefault.promise : Promise.resolve(bDestination),
        );
        mockRepository.getAll.mockResolvedValue([bDestination]);

        const aLoad = uploadDestinationStore.load("account-a");
        const bLoad = uploadDestinationStore.load("account-b");
        await bLoad;
        aDefault.reject(new Error("A failed"));
        await aLoad;

        expect(uploadDestinationStore.value.destinations).toEqual([bDestination]);
        expect(uploadDestinationStore.value.error).toBeNull();
        expect(uploadDestinationStore.value.loading).toBe(false);
    });

    it("does not restore destinations after reset invalidates a pending load", async () => {
        const destinations = createDeferred<UploadDestination[]>();
        const destination = createDestination("account-a", "a");
        mockRepository.getDefault.mockResolvedValue(destination);
        mockRepository.getAll.mockReturnValue(destinations.promise);

        const load = uploadDestinationStore.load("account-a");
        await Promise.resolve();
        uploadDestinationStore.reset();
        destinations.resolve([destination]);
        await load;

        expect(uploadDestinationStore.value.destinations).toEqual([]);
        expect(uploadDestinationStore.value.defaultDestination).toBeNull();
        expect(uploadDestinationStore.value.error).toBeNull();
        expect(uploadDestinationStore.value.loading).toBe(false);
    });

    it("does not let an older same-account reload overwrite the newer result", async () => {
        const firstDestinations = createDeferred<UploadDestination[]>();
        const secondDestinations = createDeferred<UploadDestination[]>();
        const firstDestination = createDestination("account-a", "first");
        const secondDestination = createDestination("account-a", "second");
        mockRepository.getDefault.mockResolvedValue(secondDestination);
        mockRepository.getAll
            .mockReturnValueOnce(firstDestinations.promise)
            .mockReturnValueOnce(secondDestinations.promise);

        const firstLoad = uploadDestinationStore.load("account-a");
        await vi.waitFor(() => expect(mockRepository.getAll).toHaveBeenCalledTimes(1));
        const secondLoad = uploadDestinationStore.load("account-a");
        await vi.waitFor(() => expect(mockRepository.getAll).toHaveBeenCalledTimes(2));
        secondDestinations.resolve([secondDestination]);
        await secondLoad;
        firstDestinations.resolve([firstDestination]);
        await firstLoad;

        expect(uploadDestinationStore.value.destinations).toEqual([secondDestination]);
        expect(uploadDestinationStore.value.defaultDestination).toEqual(secondDestination);
    });

    it("does not persist a stale A BUD-03 fetch after B becomes current", async () => {
        const aFetch = createDeferred<{ success: boolean; servers: string[] }>();
        const bDestination = createDestination("account-b", "b");
        bud03Mocks.fetchBud03ServerList.mockReturnValue(aFetch.promise);
        mockRepository.getDefault.mockResolvedValue(bDestination);
        mockRepository.getAll.mockResolvedValue([bDestination]);

        const aFetchPromise = uploadDestinationStore.fetchBud03({} as never, "account-a");
        const bLoad = uploadDestinationStore.load("account-b");
        await bLoad;
        aFetch.resolve({ success: true, servers: ["https://a.example.com"] });
        await aFetchPromise;

        expect(mockRepository.replaceBlossomServers).not.toHaveBeenCalled();
        expect(uploadDestinationStore.value.destinations).toEqual([bDestination]);
        expect(uploadDestinationStore.value.bud03Fetching).toBe(false);
        expect(uploadDestinationStore.value.bud03Status).toBeNull();
    });
});
