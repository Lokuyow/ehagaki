import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "../../lib/constants";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import {
    DexieUploadDestinationsRepository,
    type UploadDestinationsParentSync,
} from "../../lib/storage/uploadDestinationsRepository";
import { UPLOAD_DESTINATION_GLOBAL_SCOPE } from "../../lib/upload/uploadDestinationPresets";
import { MockStorage } from "../helpers";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-upload-destinations-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("uploadDestinationsRepository", () => {
    it("migrates legacy uploadEndpoint into a NIP-96 destination", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        storage.setItem(STORAGE_KEYS.UPLOAD_ENDPOINT, "https://nostr.build/api/v2/nip96/upload");
        const repository = new DexieUploadDestinationsRepository(db, () => 1234, () => storage);

        const destination = await repository.getDefault(null);

        expect(destination.protocol).toBe("nip96");
        expect(destination.presetId).toBe("nostr-build");
        expect(destination.resolvedUploadUrl).toBe("https://nostr.build/api/v2/nip96/upload");
        expect(destination.isDefault).toBe(true);

        db.close();
    });

    it("uses the locale-specific Blossom preset when no legacy uploadEndpoint exists", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        storage.setItem(STORAGE_KEYS.LOCALE, "ja");
        const repository = new DexieUploadDestinationsRepository(db, () => 1234, () => storage);

        const destination = await repository.getDefault(null);

        expect(destination.protocol).toBe("blossom");
        expect(destination.presetId).toBe("share-yabu-me-blossom");
        expect(destination.serverUrl).toBe("https://share.yabu.me/api/v2/media");
        expect(destination.isDefault).toBe(true);

        db.close();
    });

    it("falls back to navigator locale when no locale is stored yet", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const repository = new DexieUploadDestinationsRepository(
            db,
            () => 1234,
            () => storage,
            null,
            () => ({ language: "ja-JP" }),
        );

        const destination = await repository.getDefault(null);

        expect(destination.protocol).toBe("blossom");
        expect(destination.presetId).toBe("share-yabu-me-blossom");
        expect(destination.serverUrl).toBe("https://share.yabu.me/api/v2/media");
        expect(destination.isDefault).toBe(true);

        db.close();
    });

    it("keeps only one default destination per scope", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const repository = new DexieUploadDestinationsRepository(db, () => 1234, () => storage);
        const first = await repository.getDefault(null);

        await repository.put({
            ...first,
            id: "second",
            name: "Second",
            serverUrl: "https://example.com/upload",
            resolvedUploadUrl: "https://example.com/upload",
            isDefault: true,
            createdAt: 1235,
            updatedAt: 1235,
        });

        const destinations = await repository.getAll(null);

        expect(destinations.filter((destination) => destination.isDefault)).toHaveLength(1);
        expect(destinations.find((destination) => destination.isDefault)?.id).toBe("second");

        db.close();
    });

    it("appends newly added destinations after existing destinations", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const repository = new DexieUploadDestinationsRepository(db, () => 1234, () => storage);
        const first = await repository.getDefault(null);

        await repository.put({
            ...first,
            id: "second",
            name: "Second",
            serverUrl: "https://example.com/second",
            resolvedUploadUrl: "https://example.com/second",
            isDefault: false,
            createdAt: 1235,
            updatedAt: 1235,
        });

        await repository.put({
            ...first,
            id: "third",
            name: "Third",
            serverUrl: "https://example.com/third",
            resolvedUploadUrl: "https://example.com/third",
            isDefault: false,
            createdAt: 1236,
            updatedAt: 1236,
        });

        const destinations = await repository.getAll(null);

        expect(destinations.map((destination) => destination.id)).toEqual([
            first.id,
            "second",
            "third",
        ]);

        db.close();
    });

    it("keeps destination order when changing the default destination", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const repository = new DexieUploadDestinationsRepository(db, () => 1234, () => storage);
        const first = await repository.getDefault(null);

        await repository.put({
            ...first,
            id: "second",
            name: "Second",
            serverUrl: "https://example.com/second",
            resolvedUploadUrl: "https://example.com/second",
            isDefault: false,
            createdAt: 1235,
            updatedAt: 1235,
        });

        await repository.put({
            ...first,
            id: "third",
            name: "Third",
            serverUrl: "https://example.com/third",
            resolvedUploadUrl: "https://example.com/third",
            isDefault: false,
            createdAt: 1236,
            updatedAt: 1236,
        });

        await repository.setDefault("third", null);
        const destinations = await repository.getAll(null);

        expect(destinations.map((destination) => destination.id)).toEqual([
            first.id,
            "second",
            "third",
        ]);
        expect(destinations.find((destination) => destination.id === "third")?.isDefault).toBe(true);

        db.close();
    });

    it("stores plain records even when state-proxied nested values are passed", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const repository = new DexieUploadDestinationsRepository(db, () => 1234, () => storage);
        const destination = await repository.getDefault(null);
        const proxiedCapabilities = new Proxy(destination.capabilities, {});

        await repository.put({
            ...destination,
            capabilities: proxiedCapabilities,
            updatedAt: 2345,
        });

        const stored = await repository.getDefault(null);

        expect(stored.capabilities).toEqual(destination.capabilities);

        db.close();
    });

    it("promotes a later-added blossom.band destination over an untouched migrated legacy default", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        storage.setItem(STORAGE_KEYS.UPLOAD_ENDPOINT, "https://nostr.build/api/v2/nip96/upload");
        const nowValues = [1234, 1235, 1236, 1237];
        const repository = new DexieUploadDestinationsRepository(
            db,
            () => nowValues.shift() ?? 9999,
            () => storage,
        );
        const legacyDefault = await repository.getDefault(null);

        await repository.put({
            ...legacyDefault,
            id: "blossom-band",
            name: "blossom.band",
            protocol: "blossom",
            serverUrl: "https://blossom.band",
            resolvedUploadUrl: undefined,
            presetId: "blossom-band",
            isDefault: false,
            createdAt: 1235,
            updatedAt: 1235,
            capabilities: {
                ...legacyDefault.capabilities,
                supportsDelete: true,
                supportsList: true,
            },
            auth: { type: "blossom-bud11" },
        });

        const promoted = await repository.getDefault(null);
        const destinations = await repository.getAll(null);

        expect(promoted.id).toBe("blossom-band");
        expect(promoted.isDefault).toBe(true);
        expect(destinations.find((destination) => destination.id === "blossom-band")?.isDefault).toBe(true);
        expect(destinations.find((destination) => destination.id === legacyDefault.id)?.isDefault).toBe(false);

        db.close();
    });

    it("applies a parent uploadDestinations snapshot before local fallback", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        storage.setItem(STORAGE_KEYS.UPLOAD_ENDPOINT, "https://nostr.build/api/v2/nip96/upload");
        const parentRecord = {
            id: "parent-blossom",
            pubkeyHex: null,
            scopeKey: UPLOAD_DESTINATION_GLOBAL_SCOPE,
            name: "Parent Blossom",
            protocol: "blossom" as const,
            serverUrl: "https://blossom.band",
            presetId: "blossom-band" as const,
            isDefault: true,
            enabled: true,
            createdAt: 2000,
            updatedAt: 2000,
            capabilities: {
                maxUploadSize: null,
                supportedMimeTypes: [],
                supportsDelete: true,
                supportsList: true,
                supportsMirror: false,
                supportsMediaOptimization: false,
                authRequired: true,
                source: "preset" as const,
            },
            auth: { type: "blossom-bud11" as const },
            schemaVersion: 1 as const,
        };
        const parentSync: UploadDestinationsParentSync = {
            getSnapshot: async () => [parentRecord],
            setSnapshot: async () => undefined,
        };
        const repository = new DexieUploadDestinationsRepository(
            db,
            () => 1234,
            () => storage,
            parentSync,
        );

        const destination = await repository.getDefault(null);
        const stored = await db.uploadDestinations.toArray();

        expect(destination.id).toBe("parent-blossom");
        expect(stored).toHaveLength(1);
        expect(stored[0].id).toBe("parent-blossom");

        db.close();
    });

    it("mirrors local uploadDestinations to parent when parent has no snapshot", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const pushedSnapshots: string[][] = [];
        const parentSync: UploadDestinationsParentSync = {
            getSnapshot: async () => null,
            setSnapshot: async (_scopeKey, records) => {
                pushedSnapshots.push(records.map((record) => record.id));
            },
        };
        const repository = new DexieUploadDestinationsRepository(
            db,
            () => 1234,
            () => storage,
            parentSync,
        );

        const destination = await repository.getDefault(null);

        expect(pushedSnapshots).toContainEqual([destination.id]);

        db.close();
    });

    it("mirrors parent snapshot after put, delete, and setDefault", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const pushedSnapshots: string[][] = [];
        const parentSync: UploadDestinationsParentSync = {
            getSnapshot: async () => null,
            setSnapshot: async (_scopeKey, records) => {
                pushedSnapshots.push(records.map((record) => record.id).sort());
            },
        };
        const repository = new DexieUploadDestinationsRepository(
            db,
            () => 1234,
            () => storage,
            parentSync,
        );
        const first = await repository.getDefault(null);

        await repository.put({
            ...first,
            id: "second",
            name: "Second",
            serverUrl: "https://example.com/second",
            resolvedUploadUrl: "https://example.com/second",
            isDefault: false,
            createdAt: 1235,
            updatedAt: 1235,
        });
        await repository.setDefault("second", null);
        await repository.delete(first.id);

        expect(pushedSnapshots).toContainEqual([first.id, "second"].sort());
        expect(pushedSnapshots.at(-1)).toEqual(["second"]);

        db.close();
    });

    it("continues local IndexedDB behavior when parent sync fails", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const parentSync: UploadDestinationsParentSync = {
            getSnapshot: async () => {
                throw new Error("parent unavailable");
            },
            setSnapshot: async () => {
                throw new Error("parent unavailable");
            },
        };
        const repository = new DexieUploadDestinationsRepository(
            db,
            () => 1234,
            () => storage,
            parentSync,
        );

        const destination = await repository.getDefault(null);

        expect(destination.isDefault).toBe(true);
        await expect(db.uploadDestinations.toArray()).resolves.toHaveLength(1);

        db.close();
    });

    it("forced upload endpoint preference creates and defaults an IndexedDB destination", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const pushedSnapshots: string[][] = [];
        const parentSync: UploadDestinationsParentSync = {
            getSnapshot: async () => null,
            setSnapshot: async (_scopeKey, records) => {
                pushedSnapshots.push(records.map((record) => record.id));
            },
        };
        const repository = new DexieUploadDestinationsRepository(
            db,
            () => 1234,
            () => storage,
            parentSync,
        );

        const destination = await repository.applyUploadEndpointPreference({
            endpoint: "https://nostr.build/api/v2/nip96/upload",
            mode: "forced",
            pubkeyHex: null,
        });

        expect(destination?.presetId).toBe("nostr-build");
        expect(destination?.isDefault).toBe(true);
        expect(await repository.getDefault(null)).toEqual(expect.objectContaining({
            id: destination?.id,
            isDefault: true,
        }));
        expect(pushedSnapshots.at(-1)).toContain(destination?.id);

        db.close();
    });

    it("default upload endpoint preference does not override an existing destination", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const parentSync: UploadDestinationsParentSync = {
            getSnapshot: async () => null,
            setSnapshot: async () => undefined,
        };
        const repository = new DexieUploadDestinationsRepository(
            db,
            () => 1234,
            () => storage,
            parentSync,
        );
        const existing = await repository.getDefault(null);

        const result = await repository.applyUploadEndpointPreference({
            endpoint: "https://nostr.build/api/v2/nip96/upload",
            mode: "default",
            pubkeyHex: null,
        });
        const destinations = await repository.getAll(null);

        expect(result?.id).toBe(existing.id);
        expect(destinations).toHaveLength(1);
        expect(destinations[0].id).toBe(existing.id);

        db.close();
    });

    it("forced upload endpoint preference wins over a parent snapshot and mirrors the result", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const pushedSnapshots: string[][] = [];
        const parentRecord = {
            id: "parent-blossom",
            pubkeyHex: null,
            scopeKey: UPLOAD_DESTINATION_GLOBAL_SCOPE,
            name: "Parent Blossom",
            protocol: "blossom" as const,
            serverUrl: "https://blossom.band",
            presetId: "blossom-band" as const,
            isDefault: true,
            enabled: true,
            createdAt: 2000,
            updatedAt: 2000,
            capabilities: {
                maxUploadSize: null,
                supportedMimeTypes: [],
                supportsDelete: true,
                supportsList: true,
                supportsMirror: false,
                supportsMediaOptimization: false,
                authRequired: true,
                source: "preset" as const,
            },
            auth: { type: "blossom-bud11" as const },
            schemaVersion: 1 as const,
        };
        const parentSync: UploadDestinationsParentSync = {
            getSnapshot: async () => [parentRecord],
            setSnapshot: async (_scopeKey, records) => {
                pushedSnapshots.push(records.map((record) => record.id).sort());
            },
        };
        const repository = new DexieUploadDestinationsRepository(
            db,
            () => 3000,
            () => storage,
            parentSync,
        );

        const destination = await repository.applyUploadEndpointPreference({
            endpoint: "https://nostr.build/api/v2/nip96/upload",
            mode: "forced",
            pubkeyHex: null,
        });
        const destinations = await repository.getAll(null);

        expect(destination?.presetId).toBe("nostr-build");
        expect(destinations.find((item) => item.id === destination?.id)?.isDefault).toBe(true);
        expect(destinations.find((item) => item.id === "parent-blossom")?.isDefault).toBe(false);
        expect(pushedSnapshots.at(-1)).toEqual(["parent-blossom", destination?.id].sort());

        db.close();
    });
});
