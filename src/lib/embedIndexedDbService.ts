import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
    embedMessageRequiresRequestId,
    getParentOriginFromSearch,
    isEmbedMessageEnvelope,
    isValidEmbedRequestId,
    type EmbedIndexedDbErrorPayload,
    type EmbedIndexedDbGetSnapshotPayload,
    type EmbedIndexedDbResultPayload,
    type EmbedIndexedDbSetSnapshotPayload,
    type EmbedIndexedDbStoreName,
} from "./embedProtocol";
import type { UploadDestinationRecord } from "./storage/ehagakiDb";
import {
    UPLOAD_DESTINATION_GLOBAL_SCOPE,
    UPLOAD_DESTINATION_SCHEMA_VERSION,
} from "./upload/uploadDestinationPresets";

type PendingIndexedDbRequest = {
    resolve: (payload: EmbedIndexedDbResultPayload) => void;
    reject: (error: EmbedIndexedDbErrorPayload) => void;
    timeoutId: ReturnType<typeof setTimeout>;
};

type IndexedDbRequestPayload =
    | EmbedIndexedDbGetSnapshotPayload
    | EmbedIndexedDbSetSnapshotPayload;

const DEFAULT_REQUEST_TIMEOUT_MS = 1000;
const ALLOWED_INDEXEDDB_STORES = new Set<EmbedIndexedDbStoreName>([
    "uploadDestinations",
]);

function createRequestId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `idb-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isAllowedIndexedDbStore(value: unknown): value is EmbedIndexedDbStoreName {
    return typeof value === "string"
        && ALLOWED_INDEXEDDB_STORES.has(value as EmbedIndexedDbStoreName);
}

function isValidScopeKey(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isValidCapabilities(value: unknown): boolean {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }

    const capabilities = value as Record<string, unknown>;
    return (
        (typeof capabilities.maxUploadSize === "number" || capabilities.maxUploadSize === null)
        && isStringArray(capabilities.supportedMimeTypes)
        && typeof capabilities.supportsDelete === "boolean"
        && typeof capabilities.supportsList === "boolean"
        && typeof capabilities.supportsMirror === "boolean"
        && typeof capabilities.supportsMediaOptimization === "boolean"
        && typeof capabilities.authRequired === "boolean"
        && typeof capabilities.source === "string"
        && (
            capabilities.lastCheckedAt === undefined
            || typeof capabilities.lastCheckedAt === "number"
        )
    );
}

function isUploadDestinationRecord(value: unknown): value is UploadDestinationRecord {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }

    const record = value as Record<string, unknown>;
    const auth = record.auth as Record<string, unknown> | undefined;

    return (
        typeof record.id === "string"
        && (typeof record.pubkeyHex === "string" || record.pubkeyHex === null)
        && typeof record.scopeKey === "string"
        && (
            record.scopeKey === UPLOAD_DESTINATION_GLOBAL_SCOPE
            || record.scopeKey === record.pubkeyHex
        )
        && typeof record.name === "string"
        && typeof record.protocol === "string"
        && typeof record.serverUrl === "string"
        && (record.resolvedUploadUrl === undefined || typeof record.resolvedUploadUrl === "string")
        && (record.presetId === undefined || typeof record.presetId === "string")
        && typeof record.isDefault === "boolean"
        && typeof record.enabled === "boolean"
        && (record.sortIndex === undefined || typeof record.sortIndex === "number")
        && typeof record.createdAt === "number"
        && typeof record.updatedAt === "number"
        && isValidCapabilities(record.capabilities)
        && typeof auth === "object"
        && auth !== null
        && typeof auth.type === "string"
        && record.schemaVersion === UPLOAD_DESTINATION_SCHEMA_VERSION
    );
}

function isIndexedDbResultPayload(value: unknown): value is EmbedIndexedDbResultPayload {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }

    const payload = value as Record<string, unknown>;
    if (
        typeof payload.timestamp !== "number"
        || !isAllowedIndexedDbStore(payload.store)
        || !isValidScopeKey(payload.scopeKey)
        || (
            payload.applied !== undefined
            && typeof payload.applied !== "boolean"
        )
    ) {
        return false;
    }

    if (payload.records === undefined) {
        return true;
    }

    if (!Array.isArray(payload.records)) {
        return false;
    }

    return payload.store === "uploadDestinations"
        && payload.records.every(isUploadDestinationRecord);
}

function isIndexedDbErrorPayload(value: unknown): value is EmbedIndexedDbErrorPayload {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }

    const payload = value as Record<string, unknown>;
    return (
        typeof payload.timestamp === "number"
        && typeof payload.code === "string"
        && payload.code.trim().length > 0
        && (payload.message === undefined || typeof payload.message === "string")
        && (payload.store === undefined || isAllowedIndexedDbStore(payload.store))
        && (payload.scopeKey === undefined || isValidScopeKey(payload.scopeKey))
    );
}

export class EmbedIndexedDbService {
    private trustedParentOrigin: string | null = null;
    private isListening = false;
    private pendingRequests = new Map<string, PendingIndexedDbRequest>();

    constructor(
        private windowObj: Window = typeof window !== "undefined" ? window : ({} as Window),
        private console: Console = typeof window !== "undefined" ? window.console : ({} as Console),
        private requestTimeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
    ) { }

    initialize(options: {
        parentOrigin?: string;
        locationSearch?: string;
    } = {}): boolean {
        if (!this.isInIframe()) return false;

        const parentOrigin =
            options.parentOrigin
            ?? getParentOriginFromSearch(options.locationSearch ?? this.windowObj.location?.search);
        if (!parentOrigin) return false;

        this.trustedParentOrigin = parentOrigin;
        this.ensureMessageListener();
        return true;
    }

    async getUploadDestinationsSnapshot(scopeKey: string): Promise<UploadDestinationRecord[] | null> {
        const result = await this.sendRequest("idb.getSnapshot", {
            store: "uploadDestinations",
            scopeKey,
        });
        return result.records === undefined
            ? null
            : result.records as UploadDestinationRecord[];
    }

    async setUploadDestinationsSnapshot(
        scopeKey: string,
        records: UploadDestinationRecord[],
    ): Promise<EmbedIndexedDbResultPayload> {
        return this.sendRequest("idb.setSnapshot", {
            store: "uploadDestinations",
            scopeKey,
            records,
        });
    }

    private async sendRequest(
        type: "idb.getSnapshot" | "idb.setSnapshot",
        payload: IndexedDbRequestPayload,
    ): Promise<EmbedIndexedDbResultPayload> {
        if (!this.windowObj || !this.isInIframe() || !this.trustedParentOrigin) {
            return Promise.reject({
                timestamp: Date.now(),
                code: "idb_parent_unavailable",
                message: "parent indexedDB storage is not available",
                store: payload.store,
                scopeKey: payload.scopeKey,
            });
        }

        const requestId = createRequestId();
        const request = new Promise<EmbedIndexedDbResultPayload>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                reject({
                    timestamp: Date.now(),
                    code: "idb_request_timeout",
                    message: "parent indexedDB request timed out",
                    store: payload.store,
                    scopeKey: payload.scopeKey,
                });
            }, this.requestTimeoutMs);

            this.pendingRequests.set(requestId, { resolve, reject, timeoutId });
        });

        try {
            this.windowObj.parent.postMessage(
                {
                    namespace: EMBED_MESSAGE_NAMESPACE,
                    version: EMBED_MESSAGE_VERSION,
                    type,
                    requestId,
                    payload,
                },
                this.trustedParentOrigin,
            );
        } catch (error) {
            const pending = this.pendingRequests.get(requestId);
            if (pending) {
                clearTimeout(pending.timeoutId);
                this.pendingRequests.delete(requestId);
            }
            return Promise.reject({
                timestamp: Date.now(),
                code: "idb_post_message_failed",
                message: error instanceof Error ? error.message : String(error),
                store: payload.store,
                scopeKey: payload.scopeKey,
            });
        }

        return request.catch((error: EmbedIndexedDbErrorPayload) => {
            this.console.warn("親 IndexedDB request に失敗:", error);
            throw error;
        });
    }

    private handleMessage = (event: MessageEvent): void => {
        if (!this.windowObj) return;
        if (!isEmbedMessageEnvelope(event.data)) return;
        if (event.source !== this.windowObj.parent) return;
        if (this.trustedParentOrigin && event.origin !== this.trustedParentOrigin) return;

        const message = event.data;
        if (message.type !== "idb.result" && message.type !== "idb.error") {
            return;
        }

        if (
            embedMessageRequiresRequestId(message.type)
            && !isValidEmbedRequestId(message.requestId)
        ) {
            this.console.warn("requestId がない idb response を無視:", message);
            return;
        }

        if (!message.requestId) return;

        const pending = this.pendingRequests.get(message.requestId);
        if (!pending) return;

        if (message.type === "idb.result") {
            if (!isIndexedDbResultPayload(message.payload)) {
                this.console.warn("不正な idb.result payload を無視:", message.payload);
                return;
            }

            clearTimeout(pending.timeoutId);
            this.pendingRequests.delete(message.requestId);
            pending.resolve(message.payload);
            return;
        }

        if (!isIndexedDbErrorPayload(message.payload)) {
            this.console.warn("不正な idb.error payload を無視:", message.payload);
            return;
        }

        clearTimeout(pending.timeoutId);
        this.pendingRequests.delete(message.requestId);
        pending.reject(message.payload);
    };

    private ensureMessageListener(): void {
        if (this.isListening) return;
        this.windowObj?.addEventListener?.("message", this.handleMessage);
        this.isListening = true;
    }

    private isInIframe(): boolean {
        try {
            return this.windowObj?.self !== this.windowObj?.top;
        } catch {
            return true;
        }
    }
}

export const embedIndexedDbService = new EmbedIndexedDbService();
