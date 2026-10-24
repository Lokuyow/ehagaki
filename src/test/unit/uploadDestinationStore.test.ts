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
    applyRelayServerLists: vi.fn(),
    updateTestCapabilities: vi.fn(),
}));
const syncMocks = vi.hoisted(() => ({ fetchUploadRelayLists: vi.fn(), publishUploadRelayLists: vi.fn() }));
const connectionTestMocks = vi.hoisted(() => ({
    testUploadDestinationConnection: vi.fn(),
}));
const authStateValue = vi.hoisted(() => ({
    pubkey: null as string | null,
    npub: null as string | null,
    isAuthenticated: false,
}));

vi.mock("../../lib/storage/uploadDestinationsRepository", () => ({
    uploadDestinationsRepository: mockRepository,
}));

vi.mock("../../lib/upload/relayUploadDestinationSync", () => syncMocks);

vi.mock("../../lib/upload/uploadDestinationConnectionTest", () => connectionTestMocks);

vi.mock("../../stores/authStore.svelte", () => ({
    authState: {
        get value() {
            return authStateValue;
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
        authStateValue.pubkey = "account-a";
        authStateValue.npub = null;
        authStateValue.isAuthenticated = true;
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

    it("invalidates a pending load without clearing the current destination state", async () => {
        const currentDestination = createDestination("account-a", "current");
        mockRepository.getDefault.mockResolvedValue(currentDestination);
        mockRepository.getAll.mockResolvedValueOnce([currentDestination]);
        await uploadDestinationStore.load("account-a");

        const staleDestinations = createDeferred<UploadDestination[]>();
        mockRepository.getAll.mockReturnValueOnce(staleDestinations.promise);
        const staleLoad = uploadDestinationStore.load("account-a");
        await vi.waitFor(() => expect(mockRepository.getAll).toHaveBeenCalledTimes(2));
        uploadDestinationStore.invalidatePendingOperations();
        staleDestinations.resolve([createDestination("account-a", "stale")]);
        await staleLoad;

        expect(uploadDestinationStore.value.destinations).toEqual([currentDestination]);
        expect(uploadDestinationStore.value.defaultDestination).toEqual(currentDestination);
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
        const aFetch = createDeferred<{ results: { blossom: { status: "success" }; nip96: { status: "skipped" } }; updates: { blossom: string[] } }>();
        const bDestination = createDestination("account-b", "b");
        syncMocks.fetchUploadRelayLists.mockReturnValue(aFetch.promise);
        mockRepository.getDefault.mockResolvedValue(bDestination);
        mockRepository.getAll.mockResolvedValue([bDestination]);

        const aFetchPromise = uploadDestinationStore.fetchFromRelays({} as never, "account-a");
        const bLoad = uploadDestinationStore.load("account-b");
        await bLoad;
        aFetch.resolve({ results: { blossom: { status: "success" }, nip96: { status: "skipped" } }, updates: { blossom: ["https://a.example.com"] } });
        await aFetchPromise;

        expect(mockRepository.applyRelayServerLists).not.toHaveBeenCalled();
        expect(uploadDestinationStore.value.destinations).toEqual([bDestination]);
        expect(uploadDestinationStore.value.relayFetching).toBe(false);
        expect(uploadDestinationStore.value.relaySyncResults).toBeNull();
    });

    it("keeps a pending list load current when a connection test finishes without capabilities", async () => {
        const destinations = createDeferred<UploadDestination[]>();
        const connectionTest = createDeferred<{ success: boolean }>();
        const destination = createDestination("account-a", "a");
        mockRepository.getDefault.mockResolvedValue(destination);
        mockRepository.getAll.mockReturnValue(destinations.promise);
        connectionTestMocks.testUploadDestinationConnection.mockReturnValue(connectionTest.promise);

        const load = uploadDestinationStore.load("account-a");
        await vi.waitFor(() => expect(mockRepository.getAll).toHaveBeenCalledOnce());
        const test = uploadDestinationStore.test(destination);
        connectionTest.resolve({ success: true });
        await test;

        expect(uploadDestinationStore.value.loading).toBe(true);
        destinations.resolve([destination]);
        await load;

        expect(uploadDestinationStore.value.destinations).toEqual([destination]);
        expect(uploadDestinationStore.value.loading).toBe(false);
    });

    it("keeps BUD-03 fetching active while a connection test completes", async () => {
        const fetch = createDeferred<{ results: { blossom: { status: "success" }; nip96: { status: "skipped" } }; updates: { blossom: string[] } }>();
        const destination = createDestination("account-a", "a");
        syncMocks.fetchUploadRelayLists.mockReturnValue(fetch.promise);
        connectionTestMocks.testUploadDestinationConnection.mockResolvedValue({ success: true });
        mockRepository.getDefault.mockResolvedValue(destination);
        mockRepository.getAll.mockResolvedValue([destination]);

        const fetchPromise = uploadDestinationStore.fetchFromRelays({} as never, "account-a");
        const test = uploadDestinationStore.test(destination);
        await test;
        expect(uploadDestinationStore.value.relayFetching).toBe(true);

        mockRepository.applyRelayServerLists.mockResolvedValue([destination]);
        fetch.resolve({ results: { blossom: { status: "success" }, nip96: { status: "skipped" } }, updates: { blossom: ["https://a.example.com"] } });
        await fetchPromise;
        expect(uploadDestinationStore.value.relayFetching).toBe(false);
        expect(mockRepository.applyRelayServerLists).toHaveBeenCalledWith("account-a", { blossom: ["https://a.example.com"] }, expect.any(Function));
    });

    it("keeps BUD-03 publishing active while an unrelated list load completes", async () => {
        const publishDestinations = createDeferred<UploadDestination[]>();
        const destination = {
            ...createDestination("account-a", "a"),
            protocol: "blossom" as const,
            serverUrl: "https://a.example.com",
        };
        mockRepository.getDefault.mockResolvedValue(destination);
        mockRepository.getAll
            .mockReturnValueOnce(publishDestinations.promise)
            .mockResolvedValue([destination]);

        const publish = uploadDestinationStore.publishToRelays({} as never, "account-a");
        await vi.waitFor(() => expect(mockRepository.getAll).toHaveBeenCalledOnce());
        const load = uploadDestinationStore.load("account-a");
        await load;
        expect(uploadDestinationStore.value.relayPublishing).toBe(true);

        syncMocks.publishUploadRelayLists.mockResolvedValue({ blossom: { status: "skipped", reason: "no_enabled_servers" }, nip96: { status: "skipped", reason: "no_enabled_servers" } });
        publishDestinations.resolve([]);
        await publish;
        expect(uploadDestinationStore.value.relayPublishing).toBe(false);
        expect(uploadDestinationStore.value.relaySyncResults?.blossom.status).toBe("skipped");
    });

    it("coalesces repeated fetch and publish operations while a sync is active", async () => {
        const deferred = createDeferred<Awaited<ReturnType<typeof syncMocks.fetchUploadRelayLists>>>();
        syncMocks.fetchUploadRelayLists.mockReturnValue(deferred.promise);
        const first = uploadDestinationStore.fetchFromRelays({} as never, "account-a");
        await uploadDestinationStore.fetchFromRelays({} as never, "account-a");
        await uploadDestinationStore.publishToRelays({} as never, "account-a");
        expect(syncMocks.fetchUploadRelayLists).toHaveBeenCalledOnce();
        expect(syncMocks.publishUploadRelayLists).not.toHaveBeenCalled();
        deferred.resolve({ results: { blossom: { status: "skipped" }, nip96: { status: "skipped" } }, updates: {} });
        await first;
        expect(uploadDestinationStore.value.relayFetching).toBe(false);
    });
    it("aborts a fetch when settings change and does not commit its delayed results", async () => {
        const deferred = createDeferred<Awaited<ReturnType<typeof syncMocks.fetchUploadRelayLists>>>();
        syncMocks.fetchUploadRelayLists.mockReturnValue(deferred.promise);
        const operation = uploadDestinationStore.fetchFromRelays({} as never, "account-a");
        const context = syncMocks.fetchUploadRelayLists.mock.calls[0][0];
        mockRepository.getDefault.mockResolvedValue(createDestination("account-a"));
        mockRepository.getAll.mockResolvedValue([]);
        await uploadDestinationStore.move("id", "up", "account-a");
        expect(context.signal.aborted).toBe(true);
        deferred.resolve({ results: { blossom: { status: "success" }, nip96: { status: "skipped" } }, updates: { blossom: ["https://new.example"] } });
        await operation;
        expect(mockRepository.applyRelayServerLists).not.toHaveBeenCalled();
        expect(uploadDestinationStore.value.relaySyncResults?.blossom.reason).toBe("settings_changed");
    });
    it("does not revive an old fetch after an A to B to A account transition", async () => {
        const deferred = createDeferred<Awaited<ReturnType<typeof syncMocks.fetchUploadRelayLists>>>();
        syncMocks.fetchUploadRelayLists.mockReturnValue(deferred.promise);
        const operation = uploadDestinationStore.fetchFromRelays({} as never, "account-a");
        const context = syncMocks.fetchUploadRelayLists.mock.calls[0][0];
        mockRepository.getDefault.mockResolvedValue(createDestination("account-b"));
        mockRepository.getAll.mockResolvedValue([]);
        await uploadDestinationStore.load("account-b");
        mockRepository.getDefault.mockResolvedValue(createDestination("account-a"));
        await uploadDestinationStore.load("account-a");
        deferred.resolve({ results: { blossom: { status: "success" }, nip96: { status: "skipped" } }, updates: { blossom: ["https://stale.example"] } });
        await operation;
        expect(context.signal.aborted).toBe(true);
        expect(mockRepository.applyRelayServerLists).not.toHaveBeenCalled();
        expect(uploadDestinationStore.value.relaySyncResults).toBeNull();
    });
});
