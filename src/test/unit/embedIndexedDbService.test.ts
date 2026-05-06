import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
} from "../../lib/embedProtocol";
import { EmbedIndexedDbService } from "../../lib/embedIndexedDbService";
import type { UploadDestinationRecord } from "../../lib/storage/ehagakiDb";
import { UPLOAD_DESTINATION_GLOBAL_SCOPE } from "../../lib/upload/uploadDestinationPresets";

function createMockWindow(search = "?parentOrigin=https%3A%2F%2Fparent.example.com") {
    const listeners = new Map<string, (event: MessageEvent) => void>();
    const parent = {
        postMessage: vi.fn(),
    };

    const windowObj = {
        self: {},
        top: {},
        parent,
        location: { search },
        addEventListener: vi.fn((type: string, handler: (event: MessageEvent) => void) => {
            listeners.set(type, handler);
        }),
    } as unknown as Window;

    return { windowObj, parent, listeners };
}

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
    let mockConsole: Console;

    beforeEach(() => {
        mockConsole = {
            log: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        } as unknown as Console;
    });

    it("iframe と parentOrigin がない場合は初期化しない", () => {
        const { windowObj } = createMockWindow("");
        const service = new EmbedIndexedDbService(windowObj, mockConsole);

        expect(service.initialize()).toBe(false);
    });

    it("idb.getSnapshot を送信し、uploadDestinations records を返す", async () => {
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
});
