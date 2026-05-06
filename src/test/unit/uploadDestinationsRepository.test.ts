import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "../../lib/constants";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexieUploadDestinationsRepository } from "../../lib/storage/uploadDestinationsRepository";
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

    it("keeps a selected default at the top without moving newly added non-default destinations upward", async () => {
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
            isDefault: true,
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
            "second",
            first.id,
            "third",
        ]);

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
});
