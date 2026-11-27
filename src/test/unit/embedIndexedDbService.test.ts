import { beforeEach, describe, expect, it } from "vitest";
import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
} from "../../lib/embedProtocol";
import { EmbedIndexedDbService } from "../../lib/embedIndexedDbService";
import type { UploadDestinationRecord } from "../../lib/storage/ehagakiDb";
import { UPLOAD_DESTINATION_GLOBAL_SCOPE } from "../../lib/upload/uploadDestinationPresets";
import { createMockConsole, type MockConsole } from "../helpers";
import { createMockWindow } from "../embedWindowTestUtils";

function createDestinationRecord(id = "destination"): UploadDestinationRecord {
    return {
        id,
        pubkeyHex: null,
        scopeKey: UPLOAD_DESTINATION_GLOBAL_SCOPE,
        name: "blossom.band",
        protocol: "blossom",
        serverUrl: "https://blossom.band",
        presetId: "blossom-band",
        isDefault: true,
        enabled: true,
        createdAt: 1000,
        updatedAt: 1000,
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

describe("EmbedIndexedDbService", () => {
    let mockConsole: MockConsole;

    beforeEach(() => {
        mockConsole = createMockConsole();
    });

    it("iframe と parentOrigin がない場合は初期化しない", () => {
        const { windowObj } = createMockWindow("");
        const service = new EmbedIndexedDbService(windowObj, mockConsole);

        expect(service.initialize()).toBe(false);
    });

    it.each([undefined, "direct", "discovery"] as const)("round-trips legacy and NIP-96 snapshot metadata (%s)", async mode => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedIndexedDbService(windowObj, mockConsole);
        service.initialize();

        const pending = service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE);
        const sentMessage = parent.postMessage.mock.calls[0][0];

        expect(sentMessage).toMatchObject({
            namespace: EMBED_MESSAGE_NAMESPACE,
            version: EMBED_MESSAGE_VERSION,
            type: "idb.getSnapshot",
            payload: {
                store: "uploadDestinations",
                scopeKey: UPLOAD_DESTINATION_GLOBAL_SCOPE,
            },
        });
        expect(parent.postMessage.mock.calls[0][1]).toBe("https://parent.example.com");

        const record = createDestinationRecord();
        if (mode) {
            record.protocol = "nip96";
            record.nip96UrlMode = mode;
            record.nip96ServerUrl = "https://files.example";
            record.resolvedUploadUrl = "https://files.example/api";
        }
        listeners.get("message")?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: EMBED_MESSAGE_VERSION,
                type: "idb.result",
                requestId: sentMessage.requestId,
                payload: {
                    timestamp: Date.now(),
                    store: "uploadDestinations",
                    scopeKey: UPLOAD_DESTINATION_GLOBAL_SCOPE,
                    records: [record],
                },
            },
            origin: "https://parent.example.com",
            source: parent,
        } as unknown as MessageEvent);

        await expect(pending).resolves.toEqual([record]);
    });

    it("records が省略された snapshot は未保存として null を返す", async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedIndexedDbService(windowObj, mockConsole);
        service.initialize();

        const pending = service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE);
        const sentMessage = parent.postMessage.mock.calls[0][0];

        listeners.get("message")?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: EMBED_MESSAGE_VERSION,
                type: "idb.result",
                requestId: sentMessage.requestId,
                payload: {
                    timestamp: Date.now(),
                    store: "uploadDestinations",
                    scopeKey: UPLOAD_DESTINATION_GLOBAL_SCOPE,
                },
            },
            origin: "https://parent.example.com",
            source: parent,
        } as unknown as MessageEvent);

        await expect(pending).resolves.toBeNull();
    });

    it("要求と異なる scopeKey の idb.result は snapshot として扱わず reject する", async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedIndexedDbService(windowObj, mockConsole);
        service.initialize();

        const pending = service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE);
        const sentMessage = parent.postMessage.mock.calls[0][0];
        const otherScope = "ab".repeat(32);

        listeners.get("message")?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: EMBED_MESSAGE_VERSION,
                type: "idb.result",
                requestId: sentMessage.requestId,
                payload: {
                    timestamp: Date.now(),
                    store: "uploadDestinations",
                    scopeKey: otherScope,
                    records: [],
                },
            },
            origin: "https://parent.example.com",
            source: parent,
        } as unknown as MessageEvent);

        await expect(pending).rejects.toMatchObject({
            code: "idb_response_mismatch",
            store: "uploadDestinations",
            scopeKey: UPLOAD_DESTINATION_GLOBAL_SCOPE,
        });
    });

    it("idb.* に応答しない親には、最初の timeout 以降は待たずに失敗する", async () => {
        const { windowObj, parent } = createMockWindow();
        const service = new EmbedIndexedDbService(windowObj, mockConsole, 10);
        service.initialize();

        await expect(service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE))
            .rejects.toMatchObject({ code: "idb_request_timeout" });
        expect(parent.postMessage).toHaveBeenCalledTimes(1);

        await expect(service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE))
            .rejects.toMatchObject({ code: "idb_parent_unavailable" });
        expect(parent.postMessage).toHaveBeenCalledTimes(1);
    });

    it("非対応と判断したあとも、書き込みの snapshot は親へ送り続ける", async () => {
        const { windowObj, parent } = createMockWindow();
        const service = new EmbedIndexedDbService(windowObj, mockConsole, 10);
        service.initialize();

        await expect(service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE))
            .rejects.toMatchObject({ code: "idb_request_timeout" });

        const write = service.setUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE, [createDestinationRecord()]);
        expect(parent.postMessage).toHaveBeenCalledTimes(2);
        expect(parent.postMessage.mock.calls[1][0]).toMatchObject({ type: "idb.setSnapshot" });
        await expect(write).rejects.toMatchObject({ code: "idb_request_timeout" });
    });

    it("timeout 後に遅れて届いた応答で、親を対応ありとして扱い直す", async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedIndexedDbService(windowObj, mockConsole, 10);
        service.initialize();

        await expect(service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE))
            .rejects.toMatchObject({ code: "idb_request_timeout" });
        const lateRequest = parent.postMessage.mock.calls[0][0];
        listeners.get("message")?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: EMBED_MESSAGE_VERSION,
                type: "idb.result",
                requestId: lateRequest.requestId,
                payload: {
                    timestamp: Date.now(),
                    store: "uploadDestinations",
                    scopeKey: UPLOAD_DESTINATION_GLOBAL_SCOPE,
                },
            },
            origin: "https://parent.example.com",
            source: parent,
        } as unknown as MessageEvent);

        const next = service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE);
        expect(parent.postMessage).toHaveBeenCalledTimes(2);
        const nextRequest = parent.postMessage.mock.calls[1][0];
        listeners.get("message")?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: EMBED_MESSAGE_VERSION,
                type: "idb.result",
                requestId: nextRequest.requestId,
                payload: {
                    timestamp: Date.now(),
                    store: "uploadDestinations",
                    scopeKey: UPLOAD_DESTINATION_GLOBAL_SCOPE,
                },
            },
            origin: "https://parent.example.com",
            source: parent,
        } as unknown as MessageEvent);
        await expect(next).resolves.toBeNull();
    });

    it("一度応答した親では、後の timeout で以降の要求を止めない", async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedIndexedDbService(windowObj, mockConsole, 10);
        service.initialize();

        const first = service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE);
        const firstMessage = parent.postMessage.mock.calls[0][0];
        listeners.get("message")?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: EMBED_MESSAGE_VERSION,
                type: "idb.error",
                requestId: firstMessage.requestId,
                payload: { timestamp: Date.now(), code: "idb_store_unavailable" },
            },
            origin: "https://parent.example.com",
            source: parent,
        } as unknown as MessageEvent);
        await expect(first).rejects.toMatchObject({ code: "idb_store_unavailable" });

        await expect(service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE))
            .rejects.toMatchObject({ code: "idb_request_timeout" });
        await expect(service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE))
            .rejects.toMatchObject({ code: "idb_request_timeout" });
        expect(parent.postMessage).toHaveBeenCalledTimes(3);
    });

    it("不正な idb.result payload は無視して timeout する", async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedIndexedDbService(windowObj, mockConsole, 10);
        service.initialize();

        const pending = service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE);
        const sentMessage = parent.postMessage.mock.calls[0][0];

        listeners.get("message")?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: EMBED_MESSAGE_VERSION,
                type: "idb.result",
                requestId: sentMessage.requestId,
                payload: {
                    timestamp: Date.now(),
                    store: "uploadDestinations",
                    scopeKey: UPLOAD_DESTINATION_GLOBAL_SCOPE,
                    records: [{ id: "broken" }],
                },
            },
            origin: "https://parent.example.com",
            source: parent,
        } as unknown as MessageEvent);

        await expect(pending).rejects.toMatchObject({
            code: "idb_request_timeout",
        });
    });

    it("origin が一致しない idb.result は無視して timeout する", async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedIndexedDbService(windowObj, mockConsole, 10);
        service.initialize();

        const pending = service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE);
        const sentMessage = parent.postMessage.mock.calls[0][0];

        listeners.get("message")?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: EMBED_MESSAGE_VERSION,
                type: "idb.result",
                requestId: sentMessage.requestId,
                payload: {
                    timestamp: Date.now(),
                    store: "uploadDestinations",
                    scopeKey: UPLOAD_DESTINATION_GLOBAL_SCOPE,
                    records: [createDestinationRecord()],
                },
            },
            origin: "https://other.example.com",
            source: parent,
        } as unknown as MessageEvent);

        await expect(pending).rejects.toMatchObject({
            code: "idb_request_timeout",
        });
    });

    it("sourceまたはenvelopeが不正なresponseではpendingを消費しない", async () => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedIndexedDbService(windowObj, mockConsole);
        service.initialize();

        const pending = service.getUploadDestinationsSnapshot(UPLOAD_DESTINATION_GLOBAL_SCOPE);
        const sentMessage = parent.postMessage.mock.calls[0][0];
        const response = {
            namespace: EMBED_MESSAGE_NAMESPACE,
            version: EMBED_MESSAGE_VERSION,
            type: "idb.result",
            requestId: sentMessage.requestId,
            payload: {
                timestamp: Date.now(),
                store: "uploadDestinations",
                scopeKey: UPLOAD_DESTINATION_GLOBAL_SCOPE,
                records: [createDestinationRecord()],
            },
        };

        listeners.get("message")?.({
            data: response,
            origin: "https://parent.example.com",
            source: {},
        } as unknown as MessageEvent);
        listeners.get("message")?.({
            data: { ...response, namespace: "other.embed" },
            origin: "https://parent.example.com",
            source: parent,
        } as unknown as MessageEvent);
        listeners.get("message")?.({
            data: { ...response, type: "settings.set" },
            origin: "https://parent.example.com",
            source: parent,
        } as unknown as MessageEvent);
        listeners.get("message")?.({
            data: response,
            origin: "https://parent.example.com",
            source: parent,
        } as unknown as MessageEvent);

        await expect(pending).resolves.toEqual(response.payload.records);
    });
});
