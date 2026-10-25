import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "../../lib/constants";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import {
    DexieUploadDestinationsRepository,
    type UploadDestinationsParentSync,
} from "../../lib/storage/uploadDestinationsRepository";
import { DEFAULT_UPLOAD_CAPABILITIES, UPLOAD_DESTINATION_GLOBAL_SCOPE } from "../../lib/upload/uploadDestinationPresets";
import type { UploadDestination } from "../../lib/types";
import { MockStorage } from "../helpers";

const testDbNames = new Set<string>();

function createTestDb(): EHagakiDB {
    const name = `${EHAGAKI_DB_NAME}-upload-destinations-test-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    testDbNames.add(name);
    return new EHagakiDB(name);
}

function legacySovbit(pubkeyHex: string | null = null): UploadDestination {
    return { id: "legacy-sovbit", pubkeyHex, name: "files.sovbit.host", protocol: "nip96",
        serverUrl: "https://files.sovbit.host/api/v2/media", resolvedUploadUrl: "https://files.sovbit.host/upload",
        nip96ServerUrl: "https://files.sovbit.host", nip96UrlMode: "direct", presetId: "files-sovbit-host",
        enabled: true, isDefault: true, sortIndex: 3, createdAt: 1000, updatedAt: 2000,
        capabilities: { ...DEFAULT_UPLOAD_CAPABILITIES, source: "protocol-discovery", raw: { api_url: "old-api" } },
        auth: { type: "nip98" }, schemaVersion: 1 };
}

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("uploadDestinationsRepository", () => {
    it.each([null, "owner"])("reads saved Sovbit NIP-96 settings as Blossom without resetting scope %s", async pubkeyHex => {
        const db = createTestDb();
        const repository = new DexieUploadDestinationsRepository(db, () => 3000, () => new MockStorage(), null);
        const legacy = { ...legacySovbit(pubkeyHex), enabled: false, isDefault: false };
        await db.uploadDestinations.put({ ...legacy, scopeKey: pubkeyHex ?? UPLOAD_DESTINATION_GLOBAL_SCOPE });
        const [destination] = await repository.getAll(pubkeyHex);
        expect(destination).toMatchObject({ id: legacy.id, pubkeyHex, protocol: "blossom", serverUrl: "https://files.sovbit.host",
            enabled: false, isDefault: false, sortIndex: 3, createdAt: 1000, updatedAt: 2000, auth: { type: "blossom-bud11" } });
        expect(destination).not.toHaveProperty("resolvedUploadUrl");
        expect(destination).not.toHaveProperty("nip96ServerUrl");
        expect(destination).not.toHaveProperty("nip96UrlMode");
        expect(destination.capabilities).not.toHaveProperty("raw");
        expect(await repository.getAll(pubkeyHex)).toEqual([destination]);
        expect(await db.uploadDestinations.get(legacy.id)).toMatchObject(legacy);
        db.close();
    });

    it("normalizes a parent Sovbit snapshot and retains its default and ID", async () => {
        const db = createTestDb();
        const legacy = legacySovbit("owner");
        const parentSync: UploadDestinationsParentSync = {
            getSnapshot: async () => [{ ...legacy, scopeKey: "owner" }], setSnapshot: async () => {},
        };
        const repository = new DexieUploadDestinationsRepository(db, () => 3000, () => new MockStorage(), parentSync);
        expect(await repository.getDefault("owner")).toMatchObject({ id: legacy.id, protocol: "blossom",
            serverUrl: "https://files.sovbit.host", isDefault: true, enabled: true, createdAt: 1000, updatedAt: 2000 });
        expect(await db.uploadDestinations.get(legacy.id)).toMatchObject({ protocol: "blossom", scopeKey: "owner" });
        db.close();
    });

    it("reuses Sovbit for repeated forced legacy endpoint preferences", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        storage.setItem(STORAGE_KEYS.UPLOAD_ENDPOINT, "https://files.sovbit.host/api/v2/media");
        const repository = new DexieUploadDestinationsRepository(db, () => 3000, () => storage, null);
        const initial = await repository.getDefault(null);
        for (const endpoint of ["https://files.sovbit.host/api/v2/media", "https://files.sovbit.host/upload", "https://files.sovbit.host"]) {
            expect(await repository.applyUploadEndpointPreference({ endpoint, mode: "forced" }))
                .toMatchObject({ id: initial.id, protocol: "blossom", serverUrl: "https://files.sovbit.host" });
        }
        expect(await repository.getAll(null)).toHaveLength(1);
        db.close();
    });

    it("stores current Blossom capability results for an old Sovbit record", async () => {
        const db = createTestDb();
        const repository = new DexieUploadDestinationsRepository(db, () => 3000, () => new MockStorage(), null);
        const legacy = legacySovbit("owner");
        await db.uploadDestinations.put({ ...legacy, scopeKey: "owner" });
        const [destination] = await repository.getAll("owner");
        const capabilities = { ...destination.capabilities, supportsList: true, maxUploadSize: 1024 };
        await repository.updateTestCapabilities(destination, capabilities, () => {});
        expect((await repository.getAll("owner"))[0]).toMatchObject({ protocol: "blossom", capabilities, updatedAt: 3000 });
        db.close();
    });

    it.each([false, true])("imports legacy Sovbit relay preferences into Blossom without duplicates (both lists: %s)", async both => {
        const db = createTestDb();
        const repository = new DexieUploadDestinationsRepository(db, () => 3000, () => new MockStorage(), null);
        const base = await repository.getDefault("owner");
        const other = { ...base, protocol: "blossom" as const, presetId: "custom" as const, serverUrl: "https://other.example" };
        await repository.put(other);
        const legacy = { ...legacySovbit("owner"), enabled: false, isDefault: false };
        await db.uploadDestinations.put({ ...legacy, scopeKey: "owner" });
        const updates = { ...(both ? { blossom: ["https://other.example", "https://files.sovbit.host"] } : {}),
            nip96: [{ serverUrl: "https://files.sovbit.host", apiUrl: "https://files.sovbit.host/upload" }] };
        for (let attempt = 0; attempt < 2; attempt++) {
            const result = await repository.applyRelayServerLists("owner", updates, () => {});
            expect(result).toHaveLength(2);
            expect(result.find(destination => destination.id === legacy.id)).toMatchObject({
                protocol: "blossom", serverUrl: "https://files.sovbit.host", enabled: false, isDefault: false, createdAt: 1000,
            });
            expect(result.find(destination => destination.id === other.id)).toMatchObject({ protocol: "blossom", isDefault: true });
            expect(await repository.getAll("owner")).toEqual(result);
        }
        db.close();
    });

    it("atomically merges both protocols, preserves disabled matching IDs and the current default", async () => {
        const db = createTestDb();
        const repository = new DexieUploadDestinationsRepository(db, () => 3000, () => new MockStorage(), null);
        const base = await repository.getDefault("owner");
        const blossom = { ...base, id: "blossom", protocol: "blossom" as const, serverUrl: "https://blossom.example", presetId: "custom" as const, isDefault: false, sortIndex: 0 };
        const custom = { ...base, id: "custom", protocol: "custom-http" as const, isDefault: true, sortIndex: 1 };
        const nip96 = { ...base, id: "nip96", protocol: "nip96" as const, presetId: "custom" as const, serverUrl: "https://api.example/upload", resolvedUploadUrl: "https://api.example/upload", enabled: false, isDefault: false, sortIndex: 2 };
        await db.uploadDestinations.where("scopeKey").equals("owner").delete();
        await repository.put(blossom);
        await repository.put(custom);
        await repository.put(nip96);
        const result = await repository.applyRelayServerLists("owner", {
            blossom: ["https://new.example", "https://blossom.example"],
            nip96: [{ serverUrl: "https://files.example", apiUrl: "https://api.example/upload" }],
        }, () => {});
        expect(result.find(destination => destination.id === "nip96")).toMatchObject({ enabled: false, nip96ServerUrl: "https://files.example", nip96UrlMode: "direct", resolvedUploadUrl: "https://api.example/upload" });
        expect(result.filter(destination => destination.protocol === "blossom").map(destination => destination.serverUrl)).toEqual(["https://new.example", "https://blossom.example"]);
        expect(result.find(destination => destination.id === "blossom")?.createdAt).toBe(blossom.createdAt);
        expect(result.filter(destination => destination.isDefault).map(destination => destination.id)).toEqual(["custom"]);
        expect((await repository.getDefault("owner")).id).toBe("custom");
        expect((await repository.getAll("owner")).find(destination => destination.id === "nip96")?.nip96ServerUrl).toBe("https://files.example");
        db.close();
    });

    it("preserves untouched protocols and creates a usable discovery destination with a single default", async () => {
        const db = createTestDb();
        const repository = new DexieUploadDestinationsRepository(db, () => 3000, () => new MockStorage(), null);
        const base = { ...await repository.getDefault("owner"), protocol: "nip96" as const, presetId: "custom" as const, serverUrl: "https://old.example/upload" };
        await repository.put(base);
        const otherAccount = await repository.getAll("other-owner");
        const result = await repository.applyRelayServerLists("owner", {
            blossom: ["https://blossom.example"],
        }, () => {});
        expect(result.find(destination => destination.id === base.id)).toMatchObject({ protocol: base.protocol, serverUrl: base.serverUrl, enabled: true, isDefault: true });
        const second = await repository.applyRelayServerLists("owner", { nip96: [{ serverUrl: "https://files.example", apiUrl: "https://api.example/upload" }] }, () => {});
        expect(second.find(destination => destination.protocol === "nip96")).toMatchObject({ serverUrl: "https://files.example", nip96ServerUrl: "https://files.example", nip96UrlMode: "discovery", resolvedUploadUrl: "https://api.example/upload" });
        expect(second.filter(destination => destination.isDefault)).toHaveLength(1);
        expect((await repository.getDefault("owner")).enabled).toBe(true);
        expect(await repository.getAll("other-owner")).toEqual(otherAccount);
        db.close();
    });

    it("uses the existing fallback policy when only matching disabled destinations remain", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        storage.setItem(STORAGE_KEYS.UPLOAD_ENDPOINT, "https://fallback.example/upload");
        const repository = new DexieUploadDestinationsRepository(db, () => 3000, () => storage, null);
        const base = await repository.getDefault("owner");
        await repository.put({ ...base, enabled: false, isDefault: false, presetId: "custom", serverUrl: "https://files.example", nip96ServerUrl: "https://files.example", resolvedUploadUrl: "https://files.example/api" });
        const result = await repository.applyRelayServerLists("owner", { nip96: [{ serverUrl: "https://files.example", apiUrl: "https://files.example/api" }] }, () => {});
        expect(result.find(destination => destination.id === base.id)?.enabled).toBe(false);
        expect(result.find(destination => destination.isDefault)).toMatchObject({ enabled: true, serverUrl: "https://fallback.example/upload" });
        expect((await repository.getDefault("owner")).serverUrl).toBe("https://fallback.example/upload");
        db.close();
    });

    it("rolls back both lists and defaults when the operation becomes stale during the write", async () => {
        const db = createTestDb();
        const repository = new DexieUploadDestinationsRepository(db, () => 3000, () => new MockStorage(), null);
        const before = await repository.getAll("owner");
        let deleted = false;
        const hook = () => { deleted = true; };
        db.uploadDestinations.hook("deleting", hook);
        await expect(repository.applyRelayServerLists("owner", { blossom: ["https://new.example"], nip96: [{ serverUrl: "https://files.example", apiUrl: "https://files.example/api" }] }, () => { if (deleted) throw new Error("stale"); })).rejects.toThrow("stale");
        db.uploadDestinations.hook("deleting").unsubscribe(hook);
        expect(await repository.getAll("owner")).toEqual(before);
        db.close();
    });

    it("does not overwrite a synchronized destination with stale connection-test settings", async () => {
        const db = createTestDb();
        const repository = new DexieUploadDestinationsRepository(db, () => 3000, () => new MockStorage(), null);
        const before = await repository.getDefault("owner");
        await repository.put({ ...before, serverUrl: "https://changed.example/upload", updatedAt: 4000 });
        await repository.updateTestCapabilities(before, { ...before.capabilities, supportsList: true }, () => {});
        expect((await repository.getAll("owner"))[0]).toMatchObject({ serverUrl: "https://changed.example/upload", capabilities: { supportsList: false } });
        db.close();
    });
    it("normalizes legacy share.yabu.me Blossom destinations into the NIP-96 preset", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const repository = new DexieUploadDestinationsRepository(db, () => 1234, () => storage, null);

        await repository.put({
            id: "legacy-share-yabu-me",
            pubkeyHex: null,
            name: "share.yabu.me(blossom)",
            protocol: "blossom",
            serverUrl: "https://share.yabu.me/api/v2/media",
            presetId: "share-yabu-me-blossom" as any,
            isDefault: true,
            enabled: true,
            createdAt: 1234,
            updatedAt: 1234,
            capabilities: {
                ...DEFAULT_UPLOAD_CAPABILITIES,
            },
            auth: { type: "blossom-bud11" },
            schemaVersion: 1,
        } as UploadDestination);

        const defaultDestination = await repository.getDefault(null);
        const result = await repository.applyUploadEndpointPreference({
            endpoint: "https://nostr.build/api/v2/nip96/upload",
            mode: "default",
            pubkeyHex: null,
        });

        expect(defaultDestination).toEqual(expect.objectContaining({
            name: "share.yabu.me",
            protocol: "nip96",
            presetId: "share-yabu-me",
            resolvedUploadUrl: "https://yabu.me/api/v2/media",
            auth: { type: "nip98" },
        }));
        expect(defaultDestination.capabilities.supportedMimeTypes).toEqual(["image/*", "video/*"]);
        expect(result).toEqual(expect.objectContaining({
            name: "share.yabu.me",
            protocol: "nip96",
            presetId: "share-yabu-me",
        }));

        db.close();
    });

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

    it("keeps the cdn.nostrcheck.me legacy endpoint as Blossom during migration", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        storage.setItem(STORAGE_KEYS.UPLOAD_ENDPOINT, "https://cdn.nostrcheck.me");
        const repository = new DexieUploadDestinationsRepository(db, () => 1234, () => storage);

        const destination = await repository.getDefault(null);

        expect(destination).toEqual(expect.objectContaining({
            protocol: "blossom",
            presetId: "cdn-nostrcheck-me",
            auth: { type: "blossom-bud11" },
        }));
        expect(destination).not.toHaveProperty("resolvedUploadUrl");

        db.close();
    });

    it("uses the locale-specific share.yabu.me preset when no legacy uploadEndpoint exists", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        storage.setItem(STORAGE_KEYS.LOCALE, "ja");
        const repository = new DexieUploadDestinationsRepository(db, () => 1234, () => storage);

        const destination = await repository.getDefault(null);

        expect(destination.protocol).toBe("nip96");
        expect(destination.presetId).toBe("share-yabu-me");
        expect(destination.name).toBe("share.yabu.me");
        expect(destination.serverUrl).toBe("https://share.yabu.me/api/v2/media");
        expect(destination.resolvedUploadUrl).toBe("https://yabu.me/api/v2/media");
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

        expect(destination.protocol).toBe("nip96");
        expect(destination.presetId).toBe("share-yabu-me");
        expect(destination.name).toBe("share.yabu.me");
        expect(destination.serverUrl).toBe("https://share.yabu.me/api/v2/media");
        expect(destination.resolvedUploadUrl).toBe("https://yabu.me/api/v2/media");
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

    it("derives saved destination names from the destination URL", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const repository = new DexieUploadDestinationsRepository(db, () => 1234, () => storage);
        const first = await repository.getDefault(null);

        await repository.put({
            ...first,
            id: "second",
            name: "Ignored name",
            serverUrl: "https://example.com/upload",
            resolvedUploadUrl: "https://example.com/upload",
            presetId: "custom",
            isDefault: false,
            createdAt: 1235,
            updatedAt: 1235,
        });

        const destination = await repository.getAll(null).then((destinations) =>
            destinations.find((item) => item.id === "second"),
        );

        expect(destination?.name).toBe("example.com");

        db.close();
    });

    it("copies global upload destinations into a user scope on first authenticated load", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const repository = new DexieUploadDestinationsRepository(db, () => 1234, () => storage);
        const globalDestination = await repository.getDefault(null);

        const scopedDestinations = await repository.getAll("pubkey-1");

        expect(scopedDestinations).toHaveLength(1);
        expect(scopedDestinations[0]).toEqual(expect.objectContaining({
            pubkeyHex: "pubkey-1",
            protocol: globalDestination.protocol,
            serverUrl: globalDestination.serverUrl,
            isDefault: true,
        }));
        expect(scopedDestinations[0].id).not.toBe(globalDestination.id);

        db.close();
    });

    it("replaces only Blossom destinations from BUD-03 servers", async () => {
        const db = createTestDb();
        const storage = new MockStorage();
        const repository = new DexieUploadDestinationsRepository(db, () => 1234, () => storage);
        const first = await repository.getDefault("pubkey-1");

        await repository.put({
            ...first,
            id: "nip96-destination",
            protocol: "nip96",
            name: "NIP-96",
            serverUrl: "https://example.com/nip96",
            resolvedUploadUrl: "https://example.com/nip96",
            presetId: "custom",
            auth: { type: "nip98" },
            isDefault: false,
            createdAt: 1235,
            updatedAt: 1235,
        });

        const destinations = await repository.replaceBlossomServers("pubkey-1", [
            "https://new-one.example.com/",
            "https://new-two.example.com",
        ]);

        expect(destinations.map((destination) => destination.serverUrl)).toEqual([
            "https://new-one.example.com",
            "https://new-two.example.com",
            "https://example.com/nip96",
        ]);
        expect(destinations.filter((destination) => destination.protocol === "blossom")).toHaveLength(2);
        expect(destinations.find((destination) => destination.id === "nip96-destination")).toBeTruthy();

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
