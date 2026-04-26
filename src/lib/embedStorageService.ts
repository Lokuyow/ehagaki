import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
    embedMessageRequiresRequestId,
    getParentOriginFromSearch,
    isEmbedMessageEnvelope,
    isValidEmbedRequestId,
    type EmbedStorageErrorPayload,
    type EmbedStorageGetPayload,
    type EmbedStorageRemovePayload,
    type EmbedStorageResultPayload,
    type EmbedStorageSetPayload,
} from "./embedProtocol";
import {
    EMBED_STORAGE_KEYS,
    filterAllowedEmbedStorageKeys,
    isAllowedEmbedStorageKey,
} from "./embedStorageKeys";

type PendingStorageRequest = {
    resolve: (payload: EmbedStorageResultPayload) => void;
    reject: (error: EmbedStorageErrorPayload) => void;
    timeoutId: ReturnType<typeof setTimeout>;
};

type StorageRequestPayload =
    | EmbedStorageGetPayload
    | EmbedStorageSetPayload
    | EmbedStorageRemovePayload;

const DEFAULT_REQUEST_TIMEOUT_MS = 1000;

function createRequestId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `storage-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isStorageResultPayload(value: unknown): value is EmbedStorageResultPayload {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }

    const payload = value as Record<string, unknown>;
    if (typeof payload.timestamp !== "number") {
        return false;
    }

    if (payload.values !== undefined) {
        if (typeof payload.values !== "object" || payload.values === null || Array.isArray(payload.values)) {
            return false;
        }

        for (const [key, item] of Object.entries(payload.values)) {
            if (!isAllowedEmbedStorageKey(key)) {
                return false;
            }
            if (item !== null && typeof item !== "string") {
                return false;
            }
        }
    }

    for (const key of ["applied", "removed"]) {
        const items = payload[key];
        if (
            items !== undefined
            && (!Array.isArray(items) || !items.every((item) => typeof item === "string" && isAllowedEmbedStorageKey(item)))
        ) {
            return false;
        }
    }

    return true;
}

function isStorageErrorPayload(value: unknown): value is EmbedStorageErrorPayload {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }

    const payload = value as Record<string, unknown>;
    return (
        typeof payload.timestamp === "number"
        && typeof payload.code === "string"
        && payload.code.trim().length > 0
        && (payload.message === undefined || typeof payload.message === "string")
    );
}

export class EmbedStorageService {
    private trustedParentOrigin: string | null = null;
    private isListening = false;
    private pendingRequests = new Map<string, PendingStorageRequest>();

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

    async get(keys: string[]): Promise<EmbedStorageResultPayload> {
        const allowedKeys = filterAllowedEmbedStorageKeys(keys);
        if (allowedKeys.length === 0) {
            return { timestamp: Date.now(), values: {} };
        }

        return this.sendRequest("storage.get", { keys: allowedKeys });
    }

    persistLocalStorageKeys(keys: string[], storage: Pick<Storage, "getItem"> = localStorage): void {
        const values: Record<string, string> = {};
        const removeKeys: string[] = [];

        for (const key of filterAllowedEmbedStorageKeys(keys)) {
            const value = storage.getItem(key);
            if (value === null) {
                removeKeys.push(key);
            } else {
                values[key] = value;
            }
        }

        if (Object.keys(values).length > 0) {
            void this.set(values).catch(() => { });
        }

        if (removeKeys.length > 0) {
            void this.remove(removeKeys).catch(() => { });
        }
    }

    async set(values: Record<string, string>): Promise<EmbedStorageResultPayload | null> {
        const allowedValues: Record<string, string> = {};
        for (const [key, value] of Object.entries(values)) {
            if (isAllowedEmbedStorageKey(key)) {
                allowedValues[key] = value;
            }
        }

        if (Object.keys(allowedValues).length === 0) {
            return null;
        }

        return this.sendRequest("storage.set", { values: allowedValues });
    }

    async remove(keys: string[]): Promise<EmbedStorageResultPayload | null> {
        const allowedKeys = filterAllowedEmbedStorageKeys(keys);
        if (allowedKeys.length === 0) {
            return null;
        }

        return this.sendRequest("storage.remove", { keys: allowedKeys });
    }

    applySnapshotToLocalStorage(
        values: Record<string, string | null> | undefined,
        storage: Pick<Storage, "setItem"> = localStorage,
    ): string[] {
        if (!values) return [];

        const applied: string[] = [];
        for (const [key, value] of Object.entries(values)) {
            if (value === null || !isAllowedEmbedStorageKey(key)) {
                continue;
            }

            storage.setItem(key, value);
            applied.push(key);
        }

        return applied;
    }

    private async sendRequest(
        type: "storage.get" | "storage.set" | "storage.remove",
        payload: StorageRequestPayload,
    ): Promise<EmbedStorageResultPayload> {
        if (!this.windowObj || !this.isInIframe() || !this.trustedParentOrigin) {
            return Promise.reject({
                timestamp: Date.now(),
                code: "storage_parent_unavailable",
                message: "parent storage is not available",
            });
        }

        const requestId = createRequestId();
        const request = new Promise<EmbedStorageResultPayload>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                reject({
                    timestamp: Date.now(),
                    code: "storage_request_timeout",
                    message: "parent storage request timed out",
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
                code: "storage_post_message_failed",
                message: error instanceof Error ? error.message : String(error),
            });
        }

        return request.catch((error: EmbedStorageErrorPayload) => {
            this.console.warn("親 storage request に失敗:", error);
            throw error;
        });
    }

    private handleMessage = (event: MessageEvent): void => {
        if (!this.windowObj) return;
        if (!isEmbedMessageEnvelope(event.data)) return;
        if (event.source !== this.windowObj.parent) return;
        if (this.trustedParentOrigin && event.origin !== this.trustedParentOrigin) return;

        const message = event.data;
        if (message.type !== "storage.result" && message.type !== "storage.error") {
            return;
        }

        if (
            embedMessageRequiresRequestId(message.type)
            && !isValidEmbedRequestId(message.requestId)
        ) {
            this.console.warn("requestId がない storage response を無視:", message);
            return;
        }

        if (!message.requestId) return;

        const pending = this.pendingRequests.get(message.requestId);
        if (!pending) return;

        if (message.type === "storage.result") {
            if (!isStorageResultPayload(message.payload)) {
                this.console.warn("不正な storage.result payload を無視:", message.payload);
                return;
            }

            clearTimeout(pending.timeoutId);
            this.pendingRequests.delete(message.requestId);
            pending.resolve(message.payload);
            return;
        }

        if (!isStorageErrorPayload(message.payload)) {
            this.console.warn("不正な storage.error payload を無視:", message.payload);
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

export { EMBED_STORAGE_KEYS, isAllowedEmbedStorageKey };
export const embedStorageService = new EmbedStorageService();
