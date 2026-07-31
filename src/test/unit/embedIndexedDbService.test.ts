import { beforeEach, describe, expect, it } from "vitest";
import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
} from "../../lib/embedProtocol";
import { EmbedIndexedDbService } from "../../lib/embedIndexedDbService";
import type { UploadDestinationRecord } from "../../lib/storage/ehagakiDb";
import { UPLOAD_DESTINATION_GLOBAL_SCOPE } from "../../lib/upload/uploadDestinationPresets";
import { createEmbedTestWindow, createMockConsole, type MockConsole } from "../helpers";

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
        const { windowObj } = createEmbedTestWindow("");
        const service = new EmbedIndexedDbService(windowObj, mockConsole);

        expect(service.initialize()).toBe(false);
    });

    it("idb.getSnapshot を送信し、uploadDestinations records を返す", async () => {
        const { windowObj, parent, listeners } = createEmbedTestWindow();
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
        const { windowObj, parent, listeners } = createEmbedTestWindow();
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

    it("不正な idb.result payload は無視して timeout する", async () => {
        const { windowObj, parent, listeners } = createEmbedTestWindow();
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
        const { windowObj, parent, listeners } = createEmbedTestWindow();
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
});
