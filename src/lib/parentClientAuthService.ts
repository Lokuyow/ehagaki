import { STORAGE_KEYS } from "./constants";
import type { ParentClientCapability, ParentClientSessionData } from "./types";

const PARENT_CLIENT_NAMESPACE = "ehagaki.parentClient";
const PARENT_CLIENT_MESSAGE_VERSION = 1;
const DEFAULT_TIMEOUT_MS = 10000;

export const DEFAULT_PARENT_CLIENT_CAPABILITIES: ParentClientCapability[] = [
    "signEvent",
    "nip04.encrypt",
    "nip04.decrypt",
    "nip44.encrypt",
    "nip44.decrypt",
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
    namespace: typeof PARENT_CLIENT_NAMESPACE;
    version: typeof PARENT_CLIENT_MESSAGE_VERSION;
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
    resolve: (value: any) => void;
    reject: (reason?: unknown) => void;
    timeoutId: ReturnType<typeof setTimeout>;
};

type RemoteLoginListener = (pubkeyHex: string | null) => void;
type RemoteLogoutListener = (pubkeyHex: string | null) => void;

function dedupeCapabilities(
    capabilities: ParentClientCapability[] | undefined,
): ParentClientCapability[] {
    const source = capabilities?.length
        ? capabilities
        : DEFAULT_PARENT_CLIENT_CAPABILITIES;
    return [...new Set(source)];
}

function isParentClientMessageEnvelope(
    value: unknown,
): value is ParentClientMessageEnvelope {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const message = value as Record<string, unknown>;
    return (
        message.namespace === PARENT_CLIENT_NAMESPACE
        && message.version === PARENT_CLIENT_MESSAGE_VERSION
        && typeof message.type === "string"
    );
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
            if (
                parsed?.version !== 1
                || typeof parsed.pubkeyHex !== "string"
                || typeof parsed.parentOrigin !== "string"
                || !Array.isArray(parsed.capabilities)
            ) {
                return null;
            }

            return {
                ...parsed,
                capabilities: dedupeCapabilities(parsed.capabilities),
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

    async nip04Encrypt(peer: string, plaintext: string): Promise<string> {
        this.assertCapability("nip04.encrypt");
        return this.requestRpc("nip04.encrypt", { peer, plaintext });
    }

    async nip04Decrypt(peer: string, ciphertext: string): Promise<string> {
        this.assertCapability("nip04.decrypt");
        return this.requestRpc("nip04.decrypt", { peer, ciphertext });
    }

    async nip44Encrypt(peer: string, plaintext: string): Promise<string> {
        this.assertCapability("nip44.encrypt");
        return this.requestRpc("nip44.encrypt", { peer, plaintext });
    }

    async nip44Decrypt(peer: string, ciphertext: string): Promise<string> {
        this.assertCapability("nip44.decrypt");
        return this.requestRpc("nip44.decrypt", { peer, ciphertext });
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
            const payload = message.payload as { pubkeyHex?: string } | undefined;
            this.notifyRemoteLogin(payload?.pubkeyHex ?? null);
            return;
        }

        if (message.type === "auth.logout") {
            const payload = message.payload as { pubkeyHex?: string } | undefined;
            const pubkeyHex = payload?.pubkeyHex ?? this.activeSession?.pubkeyHex ?? null;
            this.disconnect(false);
            this.notifyRemoteLogout(pubkeyHex);
            return;
        }

        if (!requestId) return;

        const pending = this.pendingRequests.get(requestId);
        if (!pending) return;

        globalThis.clearTimeout(pending.timeoutId);
        this.pendingRequests.delete(requestId);

        if (message.type === "auth.result") {
            const payload = message.payload as ParentClientAuthResultPayload;
            if (!payload?.pubkeyHex) {
                pending.reject(new Error("parent_client_auth_rejected"));
                return;
            }

            pending.resolve(payload);
            return;
        }

        if (message.type === "auth.error") {
            const payload = message.payload as ParentClientAuthErrorPayload;
            pending.reject(
                new Error(
                    payload?.code
                    || payload?.message
                    || "parent_client_auth_error",
                ),
            );
            return;
        }

        if (message.type === "rpc.result") {
            const payload = message.payload as ParentClientRpcResultPayload;
            pending.resolve(payload?.result);
            return;
        }

        if (message.type === "rpc.error") {
            const payload = message.payload as ParentClientRpcErrorPayload;
            pending.reject(
                new Error(payload?.message || "parent_client_rpc_error"),
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
            namespace: PARENT_CLIENT_NAMESPACE,
            version: PARENT_CLIENT_MESSAGE_VERSION,
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
        const fromSearch = this.getParentOriginFromSearch(locationSearch);
        if (fromSearch) return fromSearch;

        const referrer = this.windowObj?.document?.referrer;
        if (!referrer) return null;

        try {
            return new URL(referrer).origin;
        } catch {
            return null;
        }
    }

    private getParentOriginFromSearch(locationSearch?: string): string | null {
        const rawSearch = locationSearch ?? this.windowObj?.location?.search ?? "";
        if (!rawSearch) return null;

        const params = new URLSearchParams(rawSearch);
        const parentOrigin = params.get("parentOrigin");
        if (!parentOrigin) return null;

        try {
            return new URL(parentOrigin).origin;
        } catch {
            return null;
        }
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