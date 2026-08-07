import "fake-indexeddb/auto";
import Dexie from "dexie";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EHAGAKI_DB_NAME, EHagakiDB } from "../../lib/storage/ehagakiDb";
import { DexieUploadDestinationsRepository } from "../../lib/storage/uploadDestinationsRepository";
import { Nip96UploadAdapter } from "../../lib/upload/Nip96UploadAdapter";
import { resolveUploadDestinationForUse } from "../../lib/upload/uploadDestinationResolver";
import { createJsonResponse } from "../uploadResponseTestUtils";
import { MockStorage } from "../helpers";

const testDbNames = new Set<string>();

afterEach(async () => {
    for (const name of testDbNames) {
        await Dexie.delete(name);
    }
    testDbNames.clear();
});

describe("NIP-96 Phase B upload destination integration", () => {
    it("uses a direct endpoint for a legacy preset without changing its stored identity", async () => {
        const dbName = `${EHAGAKI_DB_NAME}-nip96-phase-b-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        testDbNames.add(dbName);
        const db = new EHagakiDB(dbName);
        const repository = new DexieUploadDestinationsRepository(db, () => 1, () => new MockStorage(), null);
        const legacyRecord = {
            id: "legacy-share-yabu-me",
            scopeKey: "__ehagaki_global__",
            pubkeyHex: null,
            name: "yabu.me",
            protocol: "nip96" as const,
            serverUrl: "https://share.yabu.me/api/v2/media",
            resolvedUploadUrl: "https://share.yabu.me/api/v2/media",
            presetId: "share-yabu-me" as const,
            isDefault: true,
            enabled: true,
            createdAt: 1,
            updatedAt: 1,
            capabilities: {
                maxUploadSize: null,
                supportedMimeTypes: ["image/*", "video/*"],
                supportsDelete: false,
                supportsList: false,
                supportsMirror: false,
                supportsMediaOptimization: false,
                authRequired: true,
                source: "preset" as const,
            },
            auth: { type: "nip98" as const },
            schemaVersion: 1 as const,
        };
        await db.uploadDestinations.put(legacyRecord);

        const storedBefore = await db.uploadDestinations.get(legacyRecord.id);
        const persistedDestination = await repository.getDefault(null);
        const runtimeDestination = resolveUploadDestinationForUse(persistedDestination, {});
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createJsonResponse({
                status: "success",
                nip94_event: { tags: [["url", "https://cdn.example/file.png"]] },
            }, { status: 200 }))
            .mockResolvedValueOnce(new Response(null, {
                status: 200,
                headers: { "content-type": "image/png" },
            }));
        const authService = { buildAuthHeader: vi.fn(async () => "Nostr token") };

        const result = await new Nip96UploadAdapter().upload({
            file: new File(["image"], "test.png", { type: "image/png" }),
            destination: runtimeDestination,
            authService,
            fetch: fetchMock as unknown as typeof fetch,
        });

        expect(persistedDestination).toEqual(expect.objectContaining({
            name: "share.yabu.me",
            serverUrl: "https://share.yabu.me/api/v2/media",
            resolvedUploadUrl: "https://share.yabu.me/api/v2/media",
        }));
        expect(runtimeDestination).toEqual(expect.objectContaining({
            name: "share.yabu.me",
            serverUrl: "https://share.yabu.me/api/v2/media",
            resolvedUploadUrl: "https://yabu.me/api/v2/media",
        }));
        expect(result).toEqual(expect.objectContaining({ success: true }));
        expect(authService.buildAuthHeader).toHaveBeenCalledWith(
            "https://yabu.me/api/v2/media",
            "POST",
        );
        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            "https://yabu.me/api/v2/media",
            expect.objectContaining({ method: "POST", redirect: "error" }),
        );
        expect(await db.uploadDestinations.get(legacyRecord.id)).toEqual(storedBefore);

        db.close();
    });
});
