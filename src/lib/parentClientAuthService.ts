import { STORAGE_KEYS } from "./constants";
import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
    embedMessageRequiresRequestId,
    getParentOriginFromSearch,
    isValidEmbedRequestId,
    isEmbedMessageEnvelope,
} from "./embedProtocol";
import type { ParentClientCapability, ParentClientSessionData } from "./types";

const DEFAULT_TIMEOUT_MS = 10000;
const PUBKEY_HEX_PATTERN = /^[0-9a-f]{64}$/i;
const VALID_PARENT_CLIENT_CAPABILITIES = new Set<ParentClientCapability>([
    'signEvent',
    'nip44.encrypt',
    'nip44.decrypt',
]);

export const DEFAULT_PARENT_CLIENT_CAPABILITIES: ParentClientCapability[] = [
    "signEvent",
];

type ParentClientMessageType =
    | "ready"
    | "auth.login"
    | "auth.request"
    | "auth.error"
    | "auth.result"
    | "auth.logout"
    | "rpc.request"
    | "rpc.result"
    | "rpc.error";

interface ParentClientMessageEnvelope<TPayload = unknown> {
    namespace: typeof EMBED_MESSAGE_NAMESPACE;
    version: typeof EMBED_MESSAGE_VERSION;
    type: ParentClientMessageType;
    requestId?: string;
    payload?: TPayload;
}

interface ParentClientAuthRequestPayload {
    capabilities: ParentClientCapability[];
    silent?: boolean;
}

interface ParentClientAuthResultPayload {
    pubkeyHex: string;
    capabilities?: ParentClientCapability[];
}

interface ParentClientAuthErrorPayload {
    code?: string;
    message?: string;
}

interface ParentClientRpcRequestPayload {
    method: ParentClientCapability;
    params?: Record<string, unknown>;
}

interface ParentClientRpcResultPayload<T = unknown> {
    result: T;
}

interface ParentClientRpcErrorPayload {
    code?: string;
    message: string;
}

export interface ParentClientConnectOptions {
    parentOrigin?: string;
    locationSearch?: string;
    capabilities?: ParentClientCapability[];
    timeoutMs?: number;
    silent?: boolean;
}

type PendingRequest = {
    kind: 'auth' | 'rpc';
    requestedCapabilities?: ParentClientCapability[];
    rpcMethod?: ParentClientCapability;
    resolve: (value: any) => void;
    reject: (reason?: unknown) => void;
    timeoutId: ReturnType<typeof setTimeout>;
};

type RemoteLoginListener = (pubkeyHex: string | null) => void;
type RemoteLogoutListener = (pubkeyHex: string | null) => void;

function isParentClientCapability(value: string): value is ParentClientCapability {
    return VALID_PARENT_CLIENT_CAPABILITIES.has(value as ParentClientCapability);
}

function dedupeCapabilities(
    capabilities: readonly string[] | undefined,
): ParentClientCapability[] {
    const source = capabilities?.length
        ? capabilities
        : DEFAULT_PARENT_CLIENT_CAPABILITIES;
    return [...new Set(source)].filter(isParentClientCapability);
}

function isHex64(value: unknown): value is string {
    return typeof value === 'string' && PUBKEY_HEX_PATTERN.test(value);
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isCapabilityArray(value: unknown): value is ParentClientCapability[] {
    return Array.isArray(value)
        && value.every((item): item is ParentClientCapability =>
            VALID_PARENT_CLIENT_CAPABILITIES.has(item as ParentClientCapability),
        );
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidParentOrigin(value: unknown): value is string {
    if (typeof value !== 'string' || !value) {
        return false;
    }

    try {
        return new URL(value).origin === value;
    } catch {
        return false;
    }
}

function parseOptionalPubkeyHex(payload: unknown): string | null | undefined {
    if (payload === undefined) {
        return undefined;
    }
    if (!isRecord(payload)) {
        return undefined;
    }
    if (payload.pubkeyHex == null) {
        return null;
    }

    return isHex64(payload.pubkeyHex) ? payload.pubkeyHex : undefined;
}

function validateAuthResultPayload(
    payload: unknown,
    requestedCapabilities: ParentClientCapability[] | undefined,
): ParentClientAuthResultPayload | null {
    if (!isRecord(payload) || !isHex64(payload.pubkeyHex)) {
        return null;
    }
    if (payload.capabilities !== undefined && !isCapabilityArray(payload.capabilities)) {
        return null;
    }

    const returnedCapabilities = dedupeCapabilities(
        payload.capabilities as ParentClientCapability[] | undefined,
    );
    if (
        requestedCapabilities?.length
        && returnedCapabilities.some((capability) => !requestedCapabilities.includes(capability))
    ) {
        return null;
    }

    return {
        pubkeyHex: payload.pubkeyHex,
        ...(payload.capabilities !== undefined
            ? { capabilities: returnedCapabilities }
            : {}),
    };
}

function validateRpcResult(
    method: ParentClientCapability | undefined,
    payload: unknown,
): unknown {
    if (!isRecord(payload) || !('result' in payload)) {
        return undefined;
    }

    const result = payload.result;

    if (method === 'signEvent') {
        return isRecord(result)
            && typeof result.id === 'string'
            && typeof result.sig === 'string'
            ? result
            : undefined;
    }

    if (
        method === 'nip44.encrypt'
        || method === 'nip44.decrypt'
    ) {
        return typeof result === 'string' ? result : undefined;
    }

    return undefined;
}

function isParentClientMessageEnvelope(
    value: unknown,
): value is ParentClientMessageEnvelope {
    return isEmbedMessageEnvelope(value);
}

export class ParentClientSignerAdapter {
    constructor(private service: ParentClientAuthService) { }

    async signEvent<K extends number>(params: {
        kind: K;
        content: string;
        tags?: string[][];
        created_at?: number;
        pubkey?: string;
    }): Promise<any> {
        const template = {
            kind: params.kind,
            content: params.content,
            tags: params.tags ?? [],
            created_at: params.created_at ?? Math.floor(Date.now() / 1000),
            ...(params.pubkey ? { pubkey: params.pubkey } : {}),
        };

        return this.service.signEvent(template);
    }

    async getPublicKey(): Promise<string> {
        return this.service.getPublicKey();
    }
}

export class ParentClientAuthService {
    private trustedParentOrigin: string | null = null;
    private activeSession: ParentClientSessionData | null = null;
    private signerAdapter: ParentClientSignerAdapter | null = null;
    private pendingRequests = new Map<string, PendingRequest>();
    private remoteLoginListeners = new Set<RemoteLoginListener>();
    private remoteLogoutListeners = new Set<RemoteLogoutListener>();
    private isListening = false;

    constructor(
        private windowObj: Window = typeof window !== "undefined" ? window : ({} as Window),
        private console: Console = typeof window !== "undefined" ? window.console : ({} as Console),
    ) { }

    static loadSession(
        localStorage: Storage,
        pubkeyHex: string,
    ): ParentClientSessionData | null {
        try {
            const stored = localStorage.getItem(
                STORAGE_KEYS.NOSTR_PARENT_CLIENT_SESSION_PREFIX + pubkeyHex,
            );
            if (!stored) return null;

            const parsed = JSON.parse(stored) as ParentClientSessionData;
            const capabilities = isStringArray(parsed?.capabilities)
                ? dedupeCapabilities(parsed.capabilities)
                : [];
            if (
                parsed?.version !== 1
                || !isHex64(parsed.pubkeyHex)
                || !isValidParentOrigin(parsed.parentOrigin)
                || capabilities.length === 0
                || !capabilities.includes('signEvent')
            ) {
                return null;
            }

            return {
                ...parsed,
                capabilities,
            };
        } catch {
            return null;
        }
    }

    static saveSession(
        localStorage: Storage,
        session: ParentClientSessionData,
    ): void {
        localStorage.setItem(
            STORAGE_KEYS.NOSTR_PARENT_CLIENT_SESSION_PREFIX + session.pubkeyHex,
            JSON.stringify(session),
        );
    }

    static clearSession(localStorage: Storage, pubkeyHex: string): void {
        localStorage.removeItem(
            STORAGE_KEYS.NOSTR_PARENT_CLIENT_SESSION_PREFIX + pubkeyHex,
        );
    }

    initialize(options: {
        parentOrigin?: string;
        locationSearch?: string;
    } = {}): boolean {
        if (!this.isInIframe()) return false;

        const parentOrigin =
            options.parentOrigin ?? this.resolveParentOrigin(options.locationSearch);
        if (!parentOrigin) return false;

        this.trustedParentOrigin = parentOrigin;
        this.ensureMessageListener();
        return true;
    }

    isAvailable(options: {
        parentOrigin?: string;
        locationSearch?: string;
    } = {}): boolean {
        if (!this.isInIframe()) return false;

        const parentOrigin =
            options.parentOrigin ?? this.resolveParentOrigin(options.locationSearch);
        return !!parentOrigin;
    }

    announceReady(
        capabilities: ParentClientCapability[] = DEFAULT_PARENT_CLIENT_CAPABILITIES,
    ): boolean {
        if (!this.initialize()) return false;
        return this.postEnvelope("ready", {
            capabilities: dedupeCapabilities(capabilities),
        });
    }

    async connect(options: ParentClientConnectOptions = {}): Promise<string> {
        const capabilities = dedupeCapabilities(options.capabilities);
        const parentOrigin =
            options.parentOrigin ?? this.resolveParentOrigin(options.locationSearch);

        if (
            !this.initialize({
                parentOrigin: parentOrigin ?? undefined,
                locationSearch: options.locationSearch,
            })
        ) {
            throw new Error("parent_client_not_available");
        }

        this.announceReady(capabilities);

        const result = await this.requestAuth(
            {
                capabilities,
                silent: options.silent,
            },
            options.timeoutMs,
        );

        const session: ParentClientSessionData = {
            version: 1,
            parentOrigin: this.trustedParentOrigin!,
            pubkeyHex: result.pubkeyHex,
            capabilities: dedupeCapabilities(result.capabilities ?? capabilities),
            connectedAt: Date.now(),
        };

        this.activateSession(session);
        return result.pubkeyHex;
    }

    async reconnect(
        session: ParentClientSessionData,
        options: Omit<ParentClientConnectOptions, "parentOrigin"> = {},
    ): Promise<string> {
        return this.connect({
            ...options,
            parentOrigin: session.parentOrigin,
            capabilities: session.capabilities,
            silent: true,
        });
    }

    async getPublicKey(): Promise<string> {
        if (!this.activeSession?.pubkeyHex) {
            throw new Error("parent_client_not_authenticated");
        }

        return this.activeSession.pubkeyHex;
    }

    async signEvent(event: any): Promise<any> {
        this.assertCapability("signEvent");
        return this.requestRpc("signEvent", { event });
    }

    async nip44Encrypt(pubkey: string, plaintext: string): Promise<string> {
        this.assertCapability("nip44.encrypt");
        return this.requestRpc("nip44.encrypt", { pubkey, plaintext });
    }

    async nip44Decrypt(pubkey: string, ciphertext: string): Promise<string> {
        this.assertCapability("nip44.decrypt");
        return this.requestRpc("nip44.decrypt", { pubkey, ciphertext });
    }

    getSigner(): ParentClientSignerAdapter | null {
        return this.signerAdapter;
    }

    getSessionData(): ParentClientSessionData | null {
        return this.activeSession ? { ...this.activeSession } : null;
    }

    getUserPubkey(): string | null {
        return this.activeSession?.pubkeyHex ?? null;
    }

    getTrustedParentOrigin(): string | null {
        return this.trustedParentOrigin;
    }

    isConnected(): boolean {
        return this.activeSession !== null;
    }

    onRemoteLogin(listener: RemoteLoginListener): () => void {
        this.remoteLoginListeners.add(listener);
        return () => {
            this.remoteLoginListeners.delete(listener);
        };
    }

    onRemoteLogout(listener: RemoteLogoutListener): () => void {
        this.remoteLogoutListeners.add(listener);
        return () => {
            this.remoteLogoutListeners.delete(listener);
        };
    }

    disconnect(notifyParent: boolean = false): void {
        if (notifyParent && this.activeSession) {
            this.postEnvelope("auth.logout", {
                pubkeyHex: this.activeSession.pubkeyHex,
            });
        }

        this.activeSession = null;
        this.signerAdapter = null;
        this.rejectPendingRequests("parent_client_disconnected");
    }

    private activateSession(session: ParentClientSessionData): void {
        this.activeSession = session;
        this.trustedParentOrigin = session.parentOrigin;
        this.signerAdapter = new ParentClientSignerAdapter(this);
    }

    private requestAuth(
        payload: ParentClientAuthRequestPayload,
        timeoutMs: number = DEFAULT_TIMEOUT_MS,
    ): Promise<ParentClientAuthResultPayload> {
        return this.enqueueRequest<ParentClientAuthResultPayload>(
            "auth.request",
            payload,
            timeoutMs,
        );
    }

    private requestRpc<T>(
        method: ParentClientCapability,
        params?: Record<string, unknown>,
        timeoutMs: number = DEFAULT_TIMEOUT_MS,
    ): Promise<T> {
        return this.enqueueRequest<T>(
            "rpc.request",
            {
                method,
                params,
            } satisfies ParentClientRpcRequestPayload,
            timeoutMs,
        );
    }

    private enqueueRequest<T>(
        type: "auth.request" | "rpc.request",
        payload: ParentClientAuthRequestPayload | ParentClientRpcRequestPayload,
        timeoutMs: number,
    ): Promise<T> {
        if (!this.trustedParentOrigin) {
            return Promise.reject(new Error("parent_client_not_available"));
        }

        const requestId = this.createRequestId();

        return new Promise<T>((resolve, reject) => {
            const timeoutId = globalThis.setTimeout(() => {
                this.pendingRequests.delete(requestId);
                reject(new Error("parent_client_timeout"));
            }, timeoutMs);

            this.pendingRequests.set(requestId, {
                kind: type === 'auth.request' ? 'auth' : 'rpc',
                ...(type === 'auth.request'
                    ? { requestedCapabilities: (payload as ParentClientAuthRequestPayload).capabilities }
                    : { rpcMethod: (payload as ParentClientRpcRequestPayload).method }),
                resolve,
                reject,
                timeoutId,
            });

            const posted = this.postEnvelope(type, payload, requestId);
            if (!posted) {
                globalThis.clearTimeout(timeoutId);
                this.pendingRequests.delete(requestId);
                reject(new Error("parent_client_not_available"));
            }
        });
    }

    private handleMessage = (event: MessageEvent): void => {
        if (!this.windowObj) return;
        if (!isParentClientMessageEnvelope(event.data)) return;
        if (event.source !== this.windowObj.parent) return;
        if (this.trustedParentOrigin && event.origin !== this.trustedParentOrigin) {
            return;
        }

        const message = event.data;
        const requestId = message.requestId;

        if (message.type === "auth.login") {
            const pubkeyHex = parseOptionalPubkeyHex(message.payload);
            if (pubkeyHex === undefined) {
                return;
            }

            this.notifyRemoteLogin(pubkeyHex);
            return;
        }

        if (message.type === "auth.logout") {
            const pubkeyHex = parseOptionalPubkeyHex(message.payload);
            if (message.payload !== undefined && pubkeyHex === undefined) {
                return;
            }

            const targetPubkeyHex = pubkeyHex ?? this.activeSession?.pubkeyHex ?? null;
            this.disconnect(false);
            this.notifyRemoteLogout(targetPubkeyHex);
            return;
        }

        if (
            embedMessageRequiresRequestId(message.type)
            && !isValidEmbedRequestId(requestId)
        ) {
            this.console.warn(
                "requestId がない親クライアント応答を無視:",
                message,
            );
            return;
        }

        if (!requestId) {
            return;
        }

        const pending = this.pendingRequests.get(requestId);
        if (!pending) return;

        globalThis.clearTimeout(pending.timeoutId);
        this.pendingRequests.delete(requestId);

        if (message.type === "auth.result") {
            const payload = validateAuthResultPayload(
                message.payload,
                pending.requestedCapabilities,
            );
            if (!payload) {
                pending.reject(new Error("parent_client_invalid_response"));
                return;
            }

            pending.resolve(payload);
            return;
        }

        if (message.type === "auth.error") {
            const payload = message.payload as ParentClientAuthErrorPayload;
            pending.reject(
                new Error(
                    (typeof payload?.code === 'string' && payload.code)
                    || (typeof payload?.message === 'string' && payload.message)
                    || "parent_client_auth_error",
                ),
            );
            return;
        }

        if (message.type === "rpc.result") {
            const result = validateRpcResult(pending.rpcMethod, message.payload);
            if (result === undefined) {
                pending.reject(new Error("parent_client_invalid_response"));
                return;
            }

            pending.resolve(result);
            return;
        }

        if (message.type === "rpc.error") {
            const payload = message.payload as ParentClientRpcErrorPayload;
            pending.reject(
                new Error(
                    (typeof payload?.message === 'string' && payload.message)
                    || (typeof payload?.code === 'string' && payload.code)
                    || "parent_client_rpc_error",
                ),
            );
            return;
        }

        pending.reject(new Error("parent_client_invalid_response"));
    };

    private postEnvelope(
        type: ParentClientMessageType,
        payload?: unknown,
        requestId?: string,
    ): boolean {
        if (!this.windowObj?.parent || !this.trustedParentOrigin || !this.isInIframe()) {
            return false;
        }

        const message: ParentClientMessageEnvelope = {
            namespace: EMBED_MESSAGE_NAMESPACE,
            version: EMBED_MESSAGE_VERSION,
            type,
            ...(requestId ? { requestId } : {}),
            ...(payload !== undefined ? { payload } : {}),
        };

        try {
            this.windowObj.parent.postMessage(message, this.trustedParentOrigin);
            return true;
        } catch (error) {
            this.console.error("親クライアントへのpostMessage送信に失敗:", error);
            return false;
        }
    }

    private ensureMessageListener(): void {
        if (this.isListening) return;
        this.windowObj?.addEventListener?.("message", this.handleMessage);
        this.isListening = true;
    }

    private resolveParentOrigin(locationSearch?: string): string | null {
        return this.getParentOriginFromSearch(locationSearch);
    }

    private getParentOriginFromSearch(locationSearch?: string): string | null {
        return getParentOriginFromSearch(
            locationSearch ?? this.windowObj?.location?.search,
        );
    }

    private createRequestId(): string {
        if (typeof globalThis.crypto?.randomUUID === "function") {
            return globalThis.crypto.randomUUID();
        }

        return `pc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    private rejectPendingRequests(message: string): void {
        for (const pending of this.pendingRequests.values()) {
            globalThis.clearTimeout(pending.timeoutId);
            pending.reject(new Error(message));
        }
        this.pendingRequests.clear();
    }

    private isInIframe(): boolean {
        if (!this.windowObj) return false;

        try {
            return this.windowObj.self !== this.windowObj.top;
        } catch {
            return true;
        }
    }

    private assertCapability(capability: ParentClientCapability): void {
        if (!this.activeSession) {
            throw new Error("parent_client_not_authenticated");
        }

        if (!this.activeSession.capabilities.includes(capability)) {
            throw new Error("parent_client_capability_not_available");
        }
    }

    private notifyRemoteLogout(pubkeyHex: string | null): void {
        for (const listener of this.remoteLogoutListeners) {
            listener(pubkeyHex);
        }
    }

    private notifyRemoteLogin(pubkeyHex: string | null): void {
        for (const listener of this.remoteLoginListeners) {
            listener(pubkeyHex);
        }
    }
}

export const parentClientAuthService = new ParentClientAuthService();