import { kinds, nip44 } from 'nostr-tools';
import * as ipaddr from 'ipaddr.js';
import {
    BunkerSigner,
    BUNKER_REGEX,
    createNostrConnectURI,
    parseBunkerInput,
} from 'nostr-tools/nip46';
import { SimplePool, useWebSocketImplementation } from 'nostr-tools/pool';
import { bytesToHex, hexToBytes } from 'nostr-tools/utils';
import { generateSecretKey, getPublicKey } from 'nostr-tools/pure';
import type {
    Nip46RelayResolution,
    Nip46SessionData,
} from './types';
import { getNip46SessionStorageKey } from './authStorageKeys';
import { RelayConfigUtils } from './relayConfigUtils';
import { EHAGAKI_APP_NAME } from './tags/clientTag';

export { BUNKER_REGEX };

const RELAY_CONNECT_TIMEOUT_MS = 5000;
export const NIP46_AUTO_PING_TIMEOUT_MS = 4000;
export const NIP46_MANUAL_PING_TIMEOUT_MS = 30000;
export const NIP46_NOSTRCONNECT_TIMEOUT_MS = 300000;
export const NIP46_INITIAL_READINESS_RETRY_WINDOW_MS = 40000;
export const NIP46_INITIAL_READINESS_ATTEMPT_TIMEOUT_MS = 5000;
export const NIP46_INITIAL_READINESS_RETRY_INTERVAL_MS = 1000;
export const NIP46_INITIAL_RELAY_COLLECTION_WINDOW_MS = 1500;
const NIP46_RELAY_RECONCILIATION_TIMEOUT_MS = 5000;
const NIP46_GET_PUBLIC_KEY_TIMEOUT_MS = 5000;
const NIP46_GET_PUBLIC_KEY_TIMEOUT_MESSAGE =
    'Timed out waiting for get_public_key response';
const LOCAL_NETWORK_IFRAME_ALLOW_VALUE = 'local-network-access; local-network; loopback-network';
const LOCAL_NETWORK_PERMISSION_FEATURES = [
    'loopback-network',
    'local-network',
    'local-network-access',
] as const;
const NIP46_FINAL_RELAY_LIST_MISSING_MESSAGE =
    'Remote signer did not return final relay list';
const NIP46_FINAL_RELAY_LIST_INVALID_MESSAGE =
    'Remote signer returned an invalid final relay list';
const NIP46_FINAL_RELAY_NO_USABLE_MESSAGE =
    'Remote signer did not return any usable connection relay';
const NIP46_FINAL_LOCAL_RELAY_UNREACHABLE_MESSAGE =
    'Could not connect to the local relay specified by the remote signer';
const NIP46_FINAL_RELAY_VERIFICATION_FAILED_MESSAGE =
    'Communication could not be verified on the relay selected by the remote signer';

type RelayConnectionLogMessages = {
    connecting: string;
    connected: string;
    failed: string;
    partial: string;
};

const FIRST_REACHABLE_RELAY_CONNECTION_LOG_MESSAGES: RelayConnectionLogMessages = {
    connecting: '[NIP-46] connecting to relay:',
    connected: '[NIP-46] relay connected:',
    failed: '[NIP-46] relay connection failed:',
    partial: '[NIP-46] continuing with first reachable relays only:',
};

const NEGOTIATED_FINAL_RELAY_CONNECTION_LOG_MESSAGES: RelayConnectionLogMessages = {
    connecting: '[NIP-46] connecting to negotiated final relay:',
    connected: '[NIP-46] negotiated final relay connected:',
    failed: '[NIP-46] negotiated final relay connection failed:',
    partial: '[NIP-46] continuing with first reachable negotiated final relays only:',
};

type SessionPersistenceBinding = {
    storage: Storage;
    pubkeyHex?: string;
};

type Nip46OperationKind = 'manual-check' | 'auto-recovery';

export interface Nip46ConnectionOperationState {
    kind: Nip46OperationKind | 'idle';
    inProgress: boolean;
}

export interface Nip46ManualConnectionCheckResult {
    success: boolean;
    skipped?: boolean;
}

export interface Nip46PendingNostrConnectSession {
    connectionUri: string;
    ready: Promise<void>;
    handshakeStarted: Promise<void>;
    completion: Promise<string>;
    cancel: () => Promise<void>;
}

type Nip46RelayResolutionResult =
    | {
        kind: 'signer-negotiated';
        finalRelays: string[];
        sessionRelayResolution: Nip46RelayResolution;
    }
    | {
        kind: 'signer-confirmed-unchanged';
        finalRelays: string[];
        sessionRelayResolution: Nip46RelayResolution;
    }
    | {
        kind: 'method-unsupported';
        finalRelays: string[];
        sessionRelayResolution: Nip46RelayResolution;
    }
    | {
        kind: 'client-initial-unconfirmed';
        finalRelays: string[];
        sessionRelayResolution: Nip46RelayResolution;
    };

type PermissionsPolicyLike = {
    allowedFeatures?: () => string[];
    allowsFeature?: (feature: string) => boolean;
};

function isRunningInIframe(): boolean {
    const windowObj = (globalThis as typeof globalThis & { window?: Window }).window;
    if (!windowObj) {
        return false;
    }

    try {
        return windowObj.self !== windowObj.top;
    } catch {
        return true;
    }
}

function getPermissionsPolicy(): PermissionsPolicyLike | null {
    const documentObj = (globalThis as typeof globalThis & { document?: Document }).document as
        | (Document & {
            permissionsPolicy?: PermissionsPolicyLike;
            featurePolicy?: PermissionsPolicyLike;
        })
        | undefined;

    return documentObj?.permissionsPolicy ?? documentObj?.featurePolicy ?? null;
}

function getBlockedLocalNetworkPermissionFeatures(): string[] {
    const policy = getPermissionsPolicy();
    if (!policy?.allowedFeatures || !policy.allowsFeature) {
        return [];
    }

    const availableFeatures = new Set(policy.allowedFeatures());
    const recognizedFeatures = LOCAL_NETWORK_PERMISSION_FEATURES.filter((feature) =>
        availableFeatures.has(feature),
    );

    return recognizedFeatures.filter((feature) => !policy.allowsFeature?.(feature));
}

function getIframeLoopbackPermissionHint(): string | null {
    if (!isRunningInIframe()) {
        return null;
    }

    const blockedFeatures = getBlockedLocalNetworkPermissionFeatures();
    if (blockedFeatures.length > 0) {
        return `This page is running inside an iframe and the browser reports that ${blockedFeatures.join(', ')} is not delegated to that frame. Add allow="${LOCAL_NETWORK_IFRAME_ALLOW_VALUE}" to the parent iframe and reload.`;
    }

    return `This page is running inside an iframe. On Chrome-based browsers, local ws://127.0.0.1 relays may require the parent iframe to delegate local/loopback network access. Add allow="${LOCAL_NETWORK_IFRAME_ALLOW_VALUE}" to the parent iframe and reload.`;
}

function normalizeIpHostname(hostname: string): string {
    return hostname
        .replace(/^\[/, '')
        .replace(/\]$/, '')
        .split('%')[0];
}

function isLoopbackRelayHostname(hostname: string): boolean {
    const normalized = hostname.trim().toLowerCase();
    if (!normalized) {
        return false;
    }

    if (
        normalized === 'localhost'
        || normalized.endsWith('.localhost')
    ) {
        return true;
    }

    const ipHostname = normalizeIpHostname(normalized);
    if (!ipHostname || !ipaddr.isValid(ipHostname)) {
        return false;
    }

    try {
        const address = ipaddr.parse(ipHostname);
        if (
            address.kind() === 'ipv6'
            && (address as ipaddr.IPv6).isIPv4MappedAddress()
        ) {
            return (address as ipaddr.IPv6).toIPv4Address().range() === 'loopback';
        }

        return address.range() === 'loopback';
    } catch {
        return false;
    }
}

function isLoopbackRelayUrl(relay: string): boolean {
    try {
        const relayUrl = new URL(relay);
        return relayUrl.protocol === 'ws:'
            && isLoopbackRelayHostname(relayUrl.hostname);
    } catch {
        return false;
    }
}

function getRelayConnectionFailureHint(relays: string[]): string | null {
    for (const relay of relays) {
        if (isLoopbackRelayUrl(relay)) {
            const iframeHint = getIframeLoopbackPermissionHint();
            const localRelayHint = '127.0.0.1/localhost points to the browser device itself, so confirm the local relay app is running and listening on that device.';

            if (iframeHint) {
                return `${iframeHint} ${localRelayHint}`;
            }

            return `The browser is attempting the local ws:// relay, but the connection is being refused. ${localRelayHint}`;
        }
    }

    return null;
}

/**
 * NIP-46 connect時にリモートサイナーへ要求するパーミッション。
 * 要求パーミッションを扱うリモートサイナーでは、
 * クライアントが利用する操作の許可設定に使われる。
 * リモートサイナー実装によっては、この要求を参照しない場合がある。
 * - get_public_key — ログイン完了時のユーザー公開鍵取得
 * - ping — 接続状態確認。手動の接続確認と、確認済み session の長時間バックグラウンド復帰で使用
 * - sign_event:1 — ショートテキストノート（投稿）
 * - sign_event:5 — NIP-09 Event Deletion Request（投稿削除リクエスト）
 * - sign_event:42 — NIP-28 チャンネルメッセージ（パブリックチャット投稿）
 * - sign_event:10063 — BUD-03 Blossom server list（アップロード先 publish）
 * - sign_event:27235 — NIP-98 HTTP認証（ファイルアップロード）
 * - sign_event:24242 — Blossom / BUD-11 HTTP認証（ファイルアップロード）
 */
export const NIP46_REQUESTED_PERMISSIONS = [
    'get_public_key',
    'ping',
    'sign_event:1',
    'sign_event:5',
    'sign_event:42',
    'sign_event:10063',
    'sign_event:27235',
    'sign_event:24242',
] as const;

export const NIP46_REQUESTED_PERMS = NIP46_REQUESTED_PERMISSIONS.join(',');

// --- rx-nostr EventSigner アダプタ ---
export class Nip46SignerAdapter {
    constructor(private bunkerSigner: BunkerSigner) { }

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
        const startedAt = Date.now();
        console.debug('[NIP-46] sign_event start', {
            kind: template.kind,
            created_at: template.created_at,
            tagsLength: template.tags.length,
            contentLength: template.content.length,
            hasPubkey: typeof params.pubkey === 'string' && params.pubkey.length > 0,
        });

        try {
            const signedEvent = await this.bunkerSigner.signEvent(template);
            const durationMs = Date.now() - startedAt;
            console.debug('[NIP-46] sign_event resolved', {
                durationMs,
                eventId: typeof signedEvent?.id === 'string' ? signedEvent.id : '(missing)',
                pubkey: typeof signedEvent?.pubkey === 'string' ? signedEvent.pubkey : '(missing)',
                kind: typeof signedEvent?.kind === 'number' ? signedEvent.kind : '(missing)',
            });
            return signedEvent;
        } catch (error) {
            const durationMs = Date.now() - startedAt;
            console.error('[NIP-46] sign_event failed', {
                durationMs,
                error,
            });
            throw error;
        }
    }

    async getPublicKey(): Promise<string> {
        return await this.bunkerSigner.getPublicKey();
    }
}

/**
 * NIP-46用WebSocketラッパー。
 * - デバッグログ: 送受信メッセージをコンソールに出力
 * - limit:0 修正: nostr-tools BunkerSignerがREQフィルタに limit:0 をハードコードするが、
 *   一部リレー(ephemeral.snowflare.cc等)がこれを "unsupported elements" として拒否する。
 *   limit:0 を since:<now> に置換して同等の動作を確保する。
 */
class Nip46WebSocket extends WebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
        super(url, protocols);
        const wsUrl = url.toString();
        this.addEventListener('open', () => {
            console.debug('[NIP-46 WS] connected:', wsUrl);
        });
        this.addEventListener('message', (ev: MessageEvent) => {
            const data = typeof ev.data === 'string' ? ev.data : '[binary]';
            console.debug('[NIP-46 WS] ←', data.length > 300 ? data.substring(0, 300) + '…' : data);
        });
        this.addEventListener('close', (ev: CloseEvent) => {
            console.debug('[NIP-46 WS] closed:', wsUrl, ev.code, ev.reason);
        });
        this.addEventListener('error', () => {
            console.debug('[NIP-46 WS] error:', wsUrl);
        });
    }
    send(data: string | Blob | BufferSource): void {
        let outData: string | Blob | BufferSource = data;
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed) && parsed[0] === 'REQ') {
                    let modified = false;
                    for (let i = 2; i < parsed.length; i++) {
                        if (parsed[i] && typeof parsed[i] === 'object' && parsed[i].limit === 0) {
                            delete parsed[i].limit;
                            parsed[i].since = Math.floor(Date.now() / 1000);
                            modified = true;
                        }
                    }
                    if (modified) {
                        outData = JSON.stringify(parsed);
                        console.debug('[NIP-46 WS] patched REQ: limit:0 → since');
                    }
                }
            } catch { /* not JSON, send as-is */ }
        }
        const msg = typeof outData === 'string' ? outData : '[binary]';
        console.debug('[NIP-46 WS] →', msg.length > 300 ? msg.substring(0, 300) + '…' : msg);
        super.send(outData);
    }
}

/**
 * リレーへのWebSocket接続を事前確認し、到達可能な relay だけを保持した SimplePool を返す。
 * nostr-tools の BunkerSigner は publish 時に Promise.any() を使うため、
 * relay が複数ある場合は 1 つでも到達できれば接続を継続できる。
 */
async function createConnectedPool(
    relays: string[],
): Promise<{ pool: SimplePool; connectedRelays: string[] }> {
    // NIP-46用WebSocket(デバッグログ + limit:0パッチ)を設定
    const origWs = globalThis.WebSocket;
    useWebSocketImplementation(Nip46WebSocket);
    const pool = new SimplePool();
    useWebSocketImplementation(origWs);
    const connectedRelays: string[] = [];
    const connectionErrors: string[] = [];

    for (const relay of [...new Set(relays)]) {
        try {
            console.debug('[NIP-46] connecting to relay:', relay);
            await pool.ensureRelay(relay, {
                connectionTimeout: RELAY_CONNECT_TIMEOUT_MS,
            });
            console.debug('[NIP-46] relay connected:', relay);
            connectedRelays.push(relay);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.warn('[NIP-46] relay connection failed:', relay, msg);
            connectionErrors.push(`${relay}: ${msg}`);
        }
    }

    if (connectedRelays.length === 0) {
        pool.destroy();
        const hint = getRelayConnectionFailureHint(relays);
        const message = connectionErrors.length > 0
            ? connectionErrors.join('; ')
            : 'no reachable relays';
        throw new Error(
            hint
                ? `Relay connection failed: ${message}. ${hint}`
                : `Relay connection failed: ${message}`,
        );
    }

    if (connectionErrors.length > 0) {
        console.warn(
            '[NIP-46] continuing with reachable relays only:',
            connectedRelays,
        );
    }

    return { pool, connectedRelays };
}

async function createConnectedPoolReadyOnFirstReachable(
    relays: string[],
    logMessages: RelayConnectionLogMessages =
        FIRST_REACHABLE_RELAY_CONNECTION_LOG_MESSAGES,
    collectReadyWindowMs: number = 0,
): Promise<{ pool: SimplePool; connectedRelays: string[] }> {
    const origWs = globalThis.WebSocket;
    useWebSocketImplementation(Nip46WebSocket);
    const pool = new SimplePool();
    useWebSocketImplementation(origWs);

    const uniqueRelays = [...new Set(relays)];
    const connectedRelays: string[] = [];
    const connectionErrors: string[] = [];

    let resolveFirstReachable: (() => void) | null = null;
    let rejectAllFailed: ((reason?: unknown) => void) | null = null;
    let firstReachableSettled = false;
    let remainingAttempts = uniqueRelays.length;
    const connectedRelaySet = new Set<string>();

    const firstReachable = new Promise<void>((resolve, reject) => {
        resolveFirstReachable = resolve;
        rejectAllFailed = reject;
    });

    const settleFirstReachable = (): void => {
        if (firstReachableSettled) {
            return;
        }

        firstReachableSettled = true;
        resolveFirstReachable?.();
        resolveFirstReachable = null;
        rejectAllFailed = null;
    };

    const settleAllFailed = (): void => {
        if (firstReachableSettled || remainingAttempts > 0 || connectedRelays.length > 0) {
            return;
        }

        firstReachableSettled = true;
        const hint = getRelayConnectionFailureHint(relays);
        const message = connectionErrors.length > 0
            ? connectionErrors.join('; ')
            : 'no reachable relays';
        rejectAllFailed?.(
            new Error(
                hint
                    ? `Relay connection failed: ${message}. ${hint}`
                    : `Relay connection failed: ${message}`,
            ),
        );
        resolveFirstReachable = null;
        rejectAllFailed = null;
    };

    const connectionAttempts = uniqueRelays.map(async (relay) => {
        try {
            console.debug(logMessages.connecting, relay);
            await pool.ensureRelay(relay, {
                connectionTimeout: RELAY_CONNECT_TIMEOUT_MS,
            });
            console.debug(logMessages.connected, relay);
            connectedRelaySet.add(relay);
            connectedRelays.push(relay);
            settleFirstReachable();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.warn(logMessages.failed, relay, msg);
            connectionErrors.push(`${relay}: ${msg}`);
        } finally {
            remainingAttempts -= 1;
            settleAllFailed();
        }
    });

    void Promise.allSettled(connectionAttempts);

    try {
        await firstReachable;
    } catch (error) {
        pool.destroy();
        throw error;
    }

    if (collectReadyWindowMs > 0 && remainingAttempts > 0) {
        await new Promise<void>((resolve) => {
            let settled = false;
            const timer = setTimeout(() => {
                if (settled) {
                    return;
                }

                settled = true;
                resolve();
            }, collectReadyWindowMs);

            void Promise.allSettled(connectionAttempts).then(() => {
                if (settled) {
                    return;
                }

                settled = true;
                clearTimeout(timer);
                resolve();
            });
        });
    }

    const finalizedConnectedRelays = uniqueRelays.filter((relay) =>
        connectedRelaySet.has(relay),
    );

    if (connectionErrors.length > 0) {
        console.warn(logMessages.partial, finalizedConnectedRelays);
    }

    return {
        pool,
        connectedRelays: finalizedConnectedRelays,
    };
}

async function createConnectedPoolForReachableRelays(
    relays: string[],
    logMessages: RelayConnectionLogMessages,
): Promise<{ pool: SimplePool; connectedRelays: string[] }> {
    const origWs = globalThis.WebSocket;
    useWebSocketImplementation(Nip46WebSocket);
    const pool = new SimplePool();
    useWebSocketImplementation(origWs);

    const uniqueRelays = [...new Set(relays)];
    const connectedRelaySet = new Set<string>();
    const connectionErrors: string[] = [];

    await Promise.all(
        uniqueRelays.map(async (relay) => {
            try {
                console.debug(logMessages.connecting, relay);
                await pool.ensureRelay(relay, {
                    connectionTimeout: RELAY_CONNECT_TIMEOUT_MS,
                });
                console.debug(logMessages.connected, relay);
                connectedRelaySet.add(relay);
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                console.warn(logMessages.failed, relay, msg);
                connectionErrors.push(`${relay}: ${msg}`);
            }
        }),
    );

    const finalizedConnectedRelays = uniqueRelays.filter((relay) =>
        connectedRelaySet.has(relay),
    );

    if (finalizedConnectedRelays.length === 0) {
        pool.destroy();
        const hint = getRelayConnectionFailureHint(relays);
        const message = connectionErrors.length > 0
            ? connectionErrors.join('; ')
            : 'no reachable relays';
        throw new Error(
            hint
                ? `Relay connection failed: ${message}. ${hint}`
                : `Relay connection failed: ${message}`,
        );
    }

    if (connectionErrors.length > 0) {
        console.warn(logMessages.partial, finalizedConnectedRelays);
    }

    return {
        pool,
        connectedRelays: finalizedConnectedRelays,
    };
}

function normalizePublicWssRelay(relay: string): string | null {
    const normalized = RelayConfigUtils.normalizeExternalRelayUrl(relay);
    if (!normalized) {
        return null;
    }

    try {
        const relayUrl = new URL(normalized);
        if (relayUrl.protocol === 'wss:') {
            return normalized;
        }

        // Allow local ws relays for signers that don't support
        // switch_relays negotiation.
        if (
            relayUrl.protocol === 'ws:'
            && (
                relayUrl.hostname === '~'
                || isLoopbackRelayHostname(relayUrl.hostname)
            )
        ) {
            return normalized;
        }

        return null;
    } catch {
        return null;
    }
}

export function normalizeSupportedNip46FinalRelay(relay: string): string | null {
    const normalized = RelayConfigUtils.normalizeExternalRelayUrl(relay);
    if (!normalized) {
        return null;
    }

    try {
        const relayUrl = new URL(normalized);
        if (relayUrl.protocol === 'wss:') {
            return normalized;
        }

        if (
            relayUrl.protocol === 'ws:'
            && isLoopbackRelayHostname(relayUrl.hostname)
        ) {
            return normalized;
        }

        return null;
    } catch {
        return null;
    }
}

function normalizeRelayResolution(
    value: unknown,
): Nip46RelayResolution | undefined {
    switch (value) {
        case 'signer-negotiated':
        case 'signer-confirmed-unchanged':
        case 'client-initial-fallback':
        case 'client-initial-unconfirmed':
            return value;
        default:
            return undefined;
    }
}

function withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutMessage: string,
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error(timeoutMessage));
        }, timeoutMs);

        void promise.then(
            (value) => {
                clearTimeout(timeoutId);
                resolve(value);
            },
            (error) => {
                clearTimeout(timeoutId);
                reject(error);
            },
        );
    });
}

export function sanitizeNip46NostrConnectRelays(relays: string[]): string[] {
    const seen = new Set<string>();
    const sanitized: string[] = [];

    for (const relay of relays) {
        const normalized = normalizePublicWssRelay(relay);
        if (!normalized || seen.has(normalized)) {
            continue;
        }

        seen.add(normalized);
        sanitized.push(normalized);
    }

    return sanitized;
}

function sanitizeRelayForLog(relay: string): string {
    const trimmed = relay.trim();
    if (!trimmed) {
        return '[empty relay]';
    }

    try {
        const relayUrl = new URL(trimmed);
        if (relayUrl.username || relayUrl.password) {
            relayUrl.username = '';
            relayUrl.password = '';
        }
        return relayUrl.toString();
    } catch {
        return '[invalid relay string]';
    }
}

function parseDeterministicRelayList(value: string): {
    parsedRelays: string[];
    supportedRelays: string[];
    unsupportedRelays: string[];
} {
    let parsed: unknown;

    try {
        parsed = JSON.parse(value) as unknown;
    } catch {
        console.warn(
            '[NIP-46] switch_relays returned malformed relay list response:',
            'invalid JSON',
        );
        throw new Error(NIP46_FINAL_RELAY_LIST_INVALID_MESSAGE);
    }

    if (!Array.isArray(parsed)) {
        console.warn(
            '[NIP-46] switch_relays returned malformed relay list response:',
            'response was not an array',
        );
        throw new Error(NIP46_FINAL_RELAY_LIST_MISSING_MESSAGE);
    }

    const parsedRelays: string[] = [];
    const supportedRelays: string[] = [];
    const unsupportedRelays: string[] = [];
    const seen = new Set<string>();

    for (const relay of parsed) {
        if (typeof relay !== 'string') {
            console.warn(
                '[NIP-46] switch_relays returned malformed relay list response:',
                'relay entry was not a string',
            );
            throw new Error(NIP46_FINAL_RELAY_LIST_INVALID_MESSAGE);
        }

        parsedRelays.push(sanitizeRelayForLog(relay));

        const normalizedRelay = normalizeSupportedNip46FinalRelay(relay);
        if (!normalizedRelay) {
            unsupportedRelays.push(sanitizeRelayForLog(relay));
            continue;
        }

        if (seen.has(normalizedRelay)) {
            continue;
        }

        seen.add(normalizedRelay);
        supportedRelays.push(normalizedRelay);
    }

    return {
        parsedRelays,
        supportedRelays,
        unsupportedRelays,
    };
}

function isUnsupportedSwitchRelaysError(error: unknown): boolean {
    const message = (
        error instanceof Error
            ? error.message
            : typeof error === 'string'
                ? error
                : ''
    ).trim().toLowerCase();

    if (!message) {
        return false;
    }

    return message.includes('unsupported')
        || message.includes('unknown method')
        || message.includes('not implemented')
        || message.includes('method not found')
        || message.includes('no such method')
        || message.includes('invalid method')
        || message.includes('no permission')
        || message.includes('not supported')
        || message.includes('not allowed')
        || /^no \S+ method$/.test(message);
}

function isNoPermissionError(error: unknown): boolean {
    const message = (
        error instanceof Error
            ? error.message
            : typeof error === 'string'
                ? error
                : ''
    ).trim().toLowerCase();

    if (!message) {
        return false;
    }

    return message.includes('no permission')
        || message.includes('permission denied')
        || message.includes('forbidden')
        || message.includes('not allowed');
}

function createNostrConnectBunkerSigner(
    clientSecretKey: Uint8Array,
    remoteSignerPubkey: string,
    relays: string[],
    sharedSecret: string,
    pool: SimplePool,
): BunkerSigner {
    return BunkerSigner.fromBunker(
        clientSecretKey,
        {
            pubkey: remoteSignerPubkey,
            relays,
            secret: sharedSecret,
        },
        {
            pool,
            onauth: (url: string) => {
                console.debug('[NIP-46] onauth URL:', url);
            },
        },
    );
}

async function closeNostrConnectTemporarySigner(
    signer: BunkerSigner | null,
): Promise<void> {
    if (!signer) {
        return;
    }

    try {
        await signer.close();
    } catch {
        // noop
    }
}

async function getNostrConnectPublicKeyWithTimeout(
    signer: BunkerSigner,
    timeoutMs: number = NIP46_GET_PUBLIC_KEY_TIMEOUT_MS,
): Promise<string> {
    return await withTimeout(
        signer.getPublicKey(),
        timeoutMs,
        NIP46_GET_PUBLIC_KEY_TIMEOUT_MESSAGE,
    );
}

function isNostrConnectPublicKeyTimeoutError(error: unknown): boolean {
    return error instanceof Error && error.message === NIP46_GET_PUBLIC_KEY_TIMEOUT_MESSAGE;
}

async function resolveNostrConnectRelayResolution(
    signer: BunkerSigner,
    fallbackRelays: string[],
): Promise<Nip46RelayResolutionResult> {
    const reconciliationResult = await Promise.race([
        signer.sendRequest('switch_relays', []).then((value) => ({
            type: 'response' as const,
            value,
        })).catch((error: unknown) => ({
            type: 'error' as const,
            error,
        })),
        new Promise<{ type: 'timeout' }>((resolve) => {
            setTimeout(() => {
                resolve({ type: 'timeout' });
            }, NIP46_RELAY_RECONCILIATION_TIMEOUT_MS);
        }),
    ]);

    if (reconciliationResult.type === 'timeout') {
        return {
            kind: 'client-initial-unconfirmed',
            finalRelays: [...fallbackRelays],
            sessionRelayResolution: 'client-initial-unconfirmed',
        };
    }

    if (reconciliationResult.type === 'error') {
        if (isUnsupportedSwitchRelaysError(reconciliationResult.error)) {
            console.warn('[NIP-46] switch_relays not supported by signer; using client initial relays:', reconciliationResult.error);
            return {
                kind: 'method-unsupported',
                finalRelays: [...fallbackRelays],
                sessionRelayResolution: 'client-initial-fallback',
            };
        }

        throw reconciliationResult.error;
    }

    const parsed = JSON.parse(reconciliationResult.value) as unknown;
    if (parsed === null) {
        return {
            kind: 'signer-confirmed-unchanged',
            finalRelays: [...fallbackRelays],
            sessionRelayResolution: 'signer-confirmed-unchanged',
        };
    }

    const relayList = parseDeterministicRelayList(
        reconciliationResult.value,
    );
    console.debug('[NIP-46] switch_relays returned relays:', relayList.parsedRelays);
    console.debug(
        '[NIP-46] supported final relay candidates:',
        relayList.supportedRelays,
    );
    console.debug(
        '[NIP-46] unsupported final relays:',
        relayList.unsupportedRelays,
    );

    if (relayList.supportedRelays.length === 0) {
        throw new Error(NIP46_FINAL_RELAY_NO_USABLE_MESSAGE);
    }

    return {
        kind: 'signer-negotiated',
        finalRelays: relayList.supportedRelays,
        sessionRelayResolution: 'signer-negotiated',
    };
}

function areRelaySetsEqual(left: string[], right: string[]): boolean {
    if (left.length !== right.length) {
        return false;
    }

    const leftSorted = [...left].sort();
    const rightSorted = [...right].sort();

    return leftSorted.every((relay, index) => relay === rightSorted[index]);
}

// --- NIP-46サービス ---
export class Nip46Service {
    private bunkerSigner: BunkerSigner | null = null;
    private signerAdapter: Nip46SignerAdapter | null = null;
    private userPubkey: string | null = null;
    private clientSecretKeyHex: string | null = null;
    private pool: SimplePool | null = null;
    private currentSession: Nip46SessionData | null = null;
    private persistenceBinding: SessionPersistenceBinding | null = null;
    private operationKind: Nip46OperationKind | null = null;
    private operationPromise: Promise<boolean> | null = null;
    private operationListeners = new Set<
        (state: Nip46ConnectionOperationState) => void
    >();

    private getOperationStateSnapshot(): Nip46ConnectionOperationState {
        if (!this.operationKind || !this.operationPromise) {
            return { kind: 'idle', inProgress: false };
        }

        return {
            kind: this.operationKind,
            inProgress: true,
        };
    }

    private emitOperationState(): void {
        const snapshot = this.getOperationStateSnapshot();
        for (const listener of this.operationListeners) {
            listener(snapshot);
        }
    }

    private setCurrentSession(session: Nip46SessionData | null): void {
        this.currentSession = session
            ? {
                ...session,
                pingVerified: session.pingVerified === true,
                relayResolution: normalizeRelayResolution(
                    session.relayResolution,
                ),
            }
            : null;
    }

    private updateCurrentSessionFromRuntime(pingVerified?: boolean): void {
        if (!this.bunkerSigner || !this.userPubkey || !this.clientSecretKeyHex) {
            return;
        }

        this.setCurrentSession({
            clientSecretKeyHex: this.clientSecretKeyHex,
            remoteSignerPubkey: this.currentSession?.remoteSignerPubkey
                ?? this.bunkerSigner.bp.pubkey,
            relays: this.currentSession?.relays
                ? [...this.currentSession.relays]
                : [...this.bunkerSigner.bp.relays],
            userPubkey: this.userPubkey,
            pingVerified: pingVerified ?? this.currentSession?.pingVerified === true,
            relayResolution: this.currentSession?.relayResolution,
        });
    }

    private setPingVerified(value: boolean): void {
        if (this.bunkerSigner && this.userPubkey && this.clientSecretKeyHex) {
            this.updateCurrentSessionFromRuntime(value);
            return;
        }

        if (!this.currentSession) {
            return;
        }

        this.setCurrentSession({
            ...this.currentSession,
            pingVerified: value,
        });
    }

    private writeSession(storage: Storage, pubkeyHex?: string): void {
        if (!this.currentSession) {
            return;
        }

        storage.setItem(
            getNip46SessionStorageKey(pubkeyHex),
            JSON.stringify(this.currentSession),
        );
    }

    private persistBoundSession(): void {
        if (!this.persistenceBinding || !this.currentSession) {
            return;
        }

        this.writeSession(
            this.persistenceBinding.storage,
            this.persistenceBinding.pubkeyHex,
        );
    }

    private async closeRuntimeResources(): Promise<void> {
        const signer = this.bunkerSigner;
        const pool = this.pool;

        this.bunkerSigner = null;
        this.signerAdapter = null;
        this.userPubkey = null;
        this.clientSecretKeyHex = null;
        this.pool = null;

        if (signer) {
            try {
                await signer.close();
            } catch {
                // noop
            }
        }

        if (pool) {
            pool.destroy();
        }
    }

    private async pingWithTimeout(timeoutMs: number): Promise<boolean> {
        if (!this.bunkerSigner) {
            return false;
        }

        try {
            const result = await Promise.race([
                this.bunkerSigner.sendRequest('ping', []),
                new Promise<never>((_, reject) => {
                    setTimeout(() => reject(new Error('NIP-46 ping timeout')), timeoutMs);
                }),
            ]);

            return result === 'pong';
        } catch {
            return false;
        }
    }

    private async rebuildConnection(): Promise<boolean> {
        if (!this.currentSession) {
            return false;
        }

        const session = { ...this.currentSession };

        try {
            await this.closeRuntimeResources();

            const clientSecretKey = hexToBytes(session.clientSecretKeyHex);
            const { pool, connectedRelays } = await createConnectedPool(session.relays);

            this.pool = pool;
            this.clientSecretKeyHex = session.clientSecretKeyHex;
            this.userPubkey = session.userPubkey;
            this.bunkerSigner = BunkerSigner.fromBunker(clientSecretKey, {
                pubkey: session.remoteSignerPubkey,
                relays: connectedRelays,
                secret: null,
            }, {
                pool,
                onauth: (url: string) => { console.debug('[NIP-46] onauth URL:', url); },
            });
            this.signerAdapter = new Nip46SignerAdapter(this.bunkerSigner);
            this.setCurrentSession({
                ...session,
                relays: connectedRelays,
            });
            this.persistBoundSession();
            console.debug('[NIP-46] rebuildConnection: pool + BunkerSigner rebuilt');
            return true;
        } catch {
            await this.closeRuntimeResources();
            return false;
        }
    }

    private async runOperation(
        kind: Nip46OperationKind,
        task: () => Promise<boolean>,
    ): Promise<boolean> {
        const promise = (async () => await task())();
        this.operationKind = kind;
        this.operationPromise = promise;
        this.emitOperationState();

        try {
            return await promise;
        } finally {
            if (this.operationPromise === promise) {
                this.operationKind = null;
                this.operationPromise = null;
                this.emitOperationState();
            }
        }
    }

    bindSessionPersistence(storage: Storage, pubkeyHex?: string): void {
        this.persistenceBinding = {
            storage,
            pubkeyHex,
        };
    }

    getOperationState(): Nip46ConnectionOperationState {
        return this.getOperationStateSnapshot();
    }

    subscribeOperationState(
        listener: (state: Nip46ConnectionOperationState) => void,
    ): () => void {
        this.operationListeners.add(listener);
        listener(this.getOperationStateSnapshot());

        return () => {
            this.operationListeners.delete(listener);
        };
    }

    isManualCheckInProgress(): boolean {
        return this.operationKind === 'manual-check' && this.operationPromise !== null;
    }

    isAutoRecoveryInProgress(): boolean {
        return this.operationKind === 'auto-recovery' && this.operationPromise !== null;
    }

    hasRecoverableSession(): boolean {
        return this.currentSession !== null;
    }

    async waitForPendingOperation(): Promise<boolean> {
        if (!this.operationPromise) {
            return true;
        }

        return await this.operationPromise;
    }

    async connect(bunkerUrl: string, timeoutMs: number = 30000): Promise<string> {
        console.debug('[NIP-46] connect: parsing bunker URL...');
        const bp = await parseBunkerInput(bunkerUrl);
        if (!bp) {
            throw new Error('Invalid bunker URL');
        }
        console.debug('[NIP-46] connect: parsed bp =', { pubkey: bp.pubkey, relays: bp.relays, secret: bp.secret ? '***' : null });

        if (bp.relays.length === 0) {
            throw new Error('No relays specified in bunker URL');
        }

        // リレーへの接続を事前に確認
        const { pool, connectedRelays } = await createConnectedPool(bp.relays);
        this.pool = pool;

        const bunkerPointer = {
            ...bp,
            relays: connectedRelays,
        };

        const clientSecretKey = generateSecretKey();
        this.clientSecretKeyHex = bytesToHex(clientSecretKey);
        console.debug('[NIP-46] connect: clientSecretKeyHex =', this.clientSecretKeyHex.substring(0, 8) + '…');

        this.bunkerSigner = BunkerSigner.fromBunker(clientSecretKey, bunkerPointer, {
            pool,
            onauth: (url: string) => { console.debug('[NIP-46] onauth URL:', url); },
        });
        console.debug('[NIP-46] connect: BunkerSigner created, subscription initiated (check WS logs for REQ)');

        const originalSecret = bunkerPointer.secret || '';
        const normalizedSecret = originalSecret.includes(' ')
            ? originalSecret.replace(/ /g, '+')
            : originalSecret;
        const secretCandidates = normalizedSecret === originalSecret
            ? [originalSecret]
            : [originalSecret, normalizedSecret];
        const connectParamCandidates = secretCandidates.flatMap((secret) => [
            [bunkerPointer.pubkey, secret, NIP46_REQUESTED_PERMS],
            [bunkerPointer.pubkey, secret],
        ]);

        console.debug('[NIP-46] connect: attempting bunker connect compatibility flow', {
            hasSecret: originalSecret.length > 0,
            secretLength: originalSecret.length,
            secretContainsSpace: originalSecret.includes(' '),
            secretContainsPlus: originalSecret.includes('+'),
            attemptCount: connectParamCandidates.length,
        });

        let connectError: unknown = null;
        let resolvedUserPubkey: string | null = null;
        for (let attemptIndex = 0; attemptIndex < connectParamCandidates.length; attemptIndex += 1) {
            const params = connectParamCandidates[attemptIndex];
            console.debug('[NIP-46] connect attempt', {
                attempt: attemptIndex + 1,
                total: connectParamCandidates.length,
                paramCount: params.length,
                usingNormalizedSecret: params[1] === normalizedSecret && normalizedSecret !== originalSecret,
                withPerms: params.length >= 3,
            });

            try {
                await Promise.race([
                    this.bunkerSigner.sendRequest('connect', params),
                    new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error('Bunker did not respond. The relay is connected but the remote signer may be offline or the secret may have expired.')), timeoutMs)
                    ),
                ]);

                try {
                    const candidateUserPubkey = await Promise.race([
                        this.bunkerSigner.getPublicKey(),
                        new Promise<never>((_, reject) =>
                            setTimeout(() => reject(new Error('Timed out waiting for get_public_key response')), timeoutMs)
                        ),
                    ]);
                    resolvedUserPubkey = candidateUserPubkey;
                    connectError = null;
                    break;
                } catch (error) {
                    let signEventFallbackPermissionDenied = false;
                    if (isNoPermissionError(error)) {
                        console.warn('[NIP-46] get_public_key returned no permission; trying sign_event pubkey fallback');
                        try {
                            const signedProbe = await Promise.race([
                                this.bunkerSigner.signEvent({
                                    kind: 1,
                                    content: '',
                                    tags: [],
                                    created_at: Math.floor(Date.now() / 1000),
                                }),
                                new Promise<never>((_, reject) =>
                                    setTimeout(() => reject(new Error('Timed out waiting for sign_event pubkey fallback response')), timeoutMs)
                                ),
                            ]) as { pubkey?: unknown };

                            if (typeof signedProbe.pubkey === 'string' && signedProbe.pubkey.length > 0) {
                                console.debug('[NIP-46] sign_event pubkey fallback succeeded');
                                resolvedUserPubkey = signedProbe.pubkey;
                                connectError = null;
                                break;
                            }

                            console.warn('[NIP-46] sign_event pubkey fallback returned invalid pubkey');
                        } catch (fallbackError) {
                            console.warn('[NIP-46] sign_event pubkey fallback failed', fallbackError);
                            signEventFallbackPermissionDenied = isNoPermissionError(fallbackError);
                        }

                        if (signEventFallbackPermissionDenied) {
                            console.warn('[NIP-46] get_public_key and sign_event are both denied; falling back to remote signer pubkey as user pubkey');
                            resolvedUserPubkey = bunkerPointer.pubkey;
                            connectError = null;
                            break;
                        }
                    }

                    connectError = error;
                    console.warn('[NIP-46] get_public_key failed after connect attempt', {
                        attempt: attemptIndex + 1,
                        total: connectParamCandidates.length,
                        withPerms: params.length >= 3,
                        error,
                    });
                    // connect request already succeeded; re-sending connect can consume one-time secrets.
                    break;
                }
            } catch (error) {
                connectError = error;
                console.warn('[NIP-46] connect attempt failed', {
                    attempt: attemptIndex + 1,
                    total: connectParamCandidates.length,
                    paramCount: params.length,
                    error,
                });
            }
        }

        if (connectError) {
            throw connectError;
        }
        console.debug('[NIP-46] connect: connected successfully');

        if (!resolvedUserPubkey) {
            throw new Error('Failed to resolve user public key after connect');
        }

        this.userPubkey = resolvedUserPubkey;
        this.signerAdapter = new Nip46SignerAdapter(this.bunkerSigner);
        this.updateCurrentSessionFromRuntime(false);

        return this.userPubkey;
    }

    async startNostrConnect(
        relays: string[],
        timeoutMs: number = NIP46_NOSTRCONNECT_TIMEOUT_MS,
    ): Promise<Nip46PendingNostrConnectSession> {
        const sanitizedRelays = sanitizeNip46NostrConnectRelays(relays);
        if (sanitizedRelays.length === 0) {
            throw new Error('At least one public wss relay is required for nostrconnect');
        }

        const clientSecretKey = generateSecretKey();
        const clientSecretKeyHex = bytesToHex(clientSecretKey);
        const clientPubkey = getPublicKey(clientSecretKey);
        const sharedSecret = bytesToHex(generateSecretKey());
        let connectionUri = createNostrConnectURI({
            clientPubkey,
            relays: sanitizedRelays,
            secret: sharedSecret,
            perms: [...NIP46_REQUESTED_PERMISSIONS],
            name: EHAGAKI_APP_NAME,
        });

        let handshakeClosed = false;
        let settled = false;
        let handshakeAccepted = false;
        let handshakeSubscription: { close: () => void } | null = null;
        let interimSigner: BunkerSigner | null = null;
        let negotiatedSigner: BunkerSigner | null = null;
        let fallbackSigner: BunkerSigner | null = null;
        let pendingPool: SimplePool | null = null;
        let connectedRelays: string[] = [];
        let readinessRetryDelayTimer: ReturnType<typeof setTimeout> | null = null;
        let rejectReadinessRetryDelay: ((reason?: unknown) => void) | null = null;

        const createNostrConnectCancellationError = (): Error =>
            new Error('Nostr Connect connection was cancelled');

        const closeHandshakeResources = async (): Promise<void> => {
            if (handshakeClosed) {
                return;
            }

            handshakeClosed = true;
            handshakeSubscription?.close();
            handshakeSubscription = null;

            if (readinessRetryDelayTimer) {
                clearTimeout(readinessRetryDelayTimer);
                readinessRetryDelayTimer = null;
            }
            if (rejectReadinessRetryDelay) {
                const rejectDelay = rejectReadinessRetryDelay;
                rejectReadinessRetryDelay = null;
                rejectDelay(createNostrConnectCancellationError());
            }

            await closeNostrConnectTemporarySigner(interimSigner);
            interimSigner = null;

            await closeNostrConnectTemporarySigner(negotiatedSigner);
            negotiatedSigner = null;

            await closeNostrConnectTemporarySigner(fallbackSigner);
            fallbackSigner = null;

            pendingPool?.destroy();
            pendingPool = null;
        };

        let resolveCompletion:
            | ((value: string | PromiseLike<string>) => void)
            | null = null;
        let rejectCompletion: ((reason?: unknown) => void) | null = null;
        let resolveReady: (() => void) | null = null;
        let rejectReady: ((reason?: unknown) => void) | null = null;
        let resolveHandshakeStarted: (() => void) | null = null;
        let rejectHandshakeStarted: ((reason?: unknown) => void) | null = null;
        let readySettled = false;
        let handshakeStartedSettled = false;

        const ensurePendingActive = (): void => {
            if (settled) {
                throw createNostrConnectCancellationError();
            }
        };

        const waitForReadinessRetryDelay = async (): Promise<void> => {
            ensurePendingActive();

            await new Promise<void>((resolve, reject) => {
                rejectReadinessRetryDelay = reject;
                readinessRetryDelayTimer = setTimeout(() => {
                    readinessRetryDelayTimer = null;
                    rejectReadinessRetryDelay = null;
                    resolve();
                }, NIP46_INITIAL_READINESS_RETRY_INTERVAL_MS);
            });
        };

        const establishReadyRelaySigner = async (
            remoteSignerPubkey: string,
            pool: SimplePool,
        ): Promise<{ signer: BunkerSigner; userPubkey: string }> => {
            const readinessDeadline =
                Date.now() + NIP46_INITIAL_READINESS_RETRY_WINDOW_MS;

            while (true) {
                ensurePendingActive();

                const attemptSigner = createNostrConnectBunkerSigner(
                    clientSecretKey,
                    remoteSignerPubkey,
                    connectedRelays,
                    sharedSecret,
                    pool,
                );
                interimSigner = attemptSigner;

                try {
                    const userPubkey = await getNostrConnectPublicKeyWithTimeout(
                        attemptSigner,
                        NIP46_INITIAL_READINESS_ATTEMPT_TIMEOUT_MS,
                    );
                    ensurePendingActive();
                    return { signer: attemptSigner, userPubkey };
                } catch (error) {
                    if (interimSigner === attemptSigner) {
                        interimSigner = null;
                    }
                    await closeNostrConnectTemporarySigner(attemptSigner);

                    if (settled) {
                        throw createNostrConnectCancellationError();
                    }

                    if (!isNostrConnectPublicKeyTimeoutError(error)) {
                        throw error;
                    }

                    const timeoutError = error instanceof Error
                        ? error
                        : new Error(String(error));

                    if (
                        Date.now()
                        + NIP46_INITIAL_READINESS_RETRY_INTERVAL_MS
                        + NIP46_INITIAL_READINESS_ATTEMPT_TIMEOUT_MS
                        > readinessDeadline
                    ) {
                        throw timeoutError;
                    }

                    console.debug(
                        '[NIP-46] get_public_key readiness timed out; retrying on initial ready relay',
                    );
                    await waitForReadinessRetryDelay();
                }
            }
        };

        const establishNegotiatedFinalRelaySigner = async (
            remoteSignerPubkey: string,
            expectedUserPubkey: string,
            finalRelayCandidates: string[],
        ): Promise<{
            pool: SimplePool;
            signer: BunkerSigner;
            userPubkey: string;
            selectedRelay: string;
        }> => {
            const containsLoopbackFinalRelay = finalRelayCandidates.some((relay) =>
                isLoopbackRelayUrl(relay),
            );
            let finalConnection: {
                pool: SimplePool;
                connectedRelays: string[];
            } | null = null;
            let finalSignerCandidate: BunkerSigner | null = null;

            try {
                finalConnection = await createConnectedPoolForReachableRelays(
                    finalRelayCandidates,
                    NEGOTIATED_FINAL_RELAY_CONNECTION_LOG_MESSAGES,
                );
                ensurePendingActive();
            } catch (error) {
                if (settled) {
                    throw createNostrConnectCancellationError();
                }

                if (containsLoopbackFinalRelay) {
                    throw new Error(NIP46_FINAL_LOCAL_RELAY_UNREACHABLE_MESSAGE);
                }

                throw error;
            }

            for (const selectedRelay of finalConnection.connectedRelays) {
                try {
                    finalSignerCandidate = createNostrConnectBunkerSigner(
                        clientSecretKey,
                        remoteSignerPubkey,
                        [selectedRelay],
                        sharedSecret,
                        finalConnection.pool,
                    );

                    const verifiedUserPubkey = await getNostrConnectPublicKeyWithTimeout(
                        finalSignerCandidate,
                    );
                    ensurePendingActive();

                    if (verifiedUserPubkey !== expectedUserPubkey) {
                        console.warn(
                            '[NIP-46] negotiated final relay returned unexpected public key:',
                            selectedRelay,
                        );
                        throw new Error(NIP46_FINAL_RELAY_VERIFICATION_FAILED_MESSAGE);
                    }

                    return {
                        pool: finalConnection.pool,
                        signer: finalSignerCandidate,
                        userPubkey: verifiedUserPubkey,
                        selectedRelay,
                    };
                } catch (error) {
                    if (settled) {
                        throw createNostrConnectCancellationError();
                    }

                    const message = error instanceof Error
                        ? error.message
                        : String(error);
                    console.warn(
                        '[NIP-46] negotiated final relay verification failed:',
                        selectedRelay,
                        message,
                    );

                    await closeNostrConnectTemporarySigner(finalSignerCandidate);
                    finalSignerCandidate = null;
                }
            }

            finalConnection.pool.destroy();
            throw new Error(NIP46_FINAL_RELAY_VERIFICATION_FAILED_MESSAGE);
        };

        const completion = new Promise<string>((resolve, reject) => {
            resolveCompletion = resolve;
            rejectCompletion = reject;
        });
        const ready = new Promise<void>((resolve, reject) => {
            resolveReady = resolve;
            rejectReady = reject;
        });

        const settleReadySuccess = (): void => {
            if (readySettled) {
                return;
            }

            readySettled = true;
            resolveReady?.();
            resolveReady = null;
            rejectReady = null;
        };

        const settleReadyFailure = (reason: unknown): void => {
            if (readySettled) {
                return;
            }

            readySettled = true;
            rejectReady?.(reason);
            resolveReady = null;
            rejectReady = null;
        };

        const settleHandshakeStartedSuccess = (): void => {
            if (handshakeStartedSettled) {
                return;
            }

            handshakeStartedSettled = true;
            resolveHandshakeStarted?.();
            resolveHandshakeStarted = null;
            rejectHandshakeStarted = null;
        };

        const settleHandshakeStartedFailure = (reason: unknown): void => {
            if (handshakeStartedSettled) {
                return;
            }

            handshakeStartedSettled = true;
            rejectHandshakeStarted?.(reason);
            resolveHandshakeStarted = null;
            rejectHandshakeStarted = null;
        };

        const handshakeStarted = new Promise<void>((resolve, reject) => {
            resolveHandshakeStarted = resolve;
            rejectHandshakeStarted = reject;
        });

        const pendingSession: Nip46PendingNostrConnectSession = {
            get connectionUri() {
                return connectionUri;
            },
            ready,
            handshakeStarted,
            completion,
            cancel: async () => {
                if (settled) {
                    return;
                }

                settled = true;
                await closeHandshakeResources();
                const cancellationError = createNostrConnectCancellationError();
                settleReadyFailure(cancellationError);
                settleHandshakeStartedFailure(cancellationError);
                rejectCompletion?.(cancellationError);
            },
        };

        void ready.catch(() => undefined);
        void handshakeStarted.catch(() => undefined);
        void completion.catch(() => undefined);

        void (async () => {
            try {
                const initialConnection = await createConnectedPoolReadyOnFirstReachable(
                    sanitizedRelays,
                    FIRST_REACHABLE_RELAY_CONNECTION_LOG_MESSAGES,
                    NIP46_INITIAL_RELAY_COLLECTION_WINDOW_MS,
                );
                if (settled) {
                    initialConnection.pool.destroy();
                    return;
                }

                pendingPool = initialConnection.pool;
                connectedRelays = [...initialConnection.connectedRelays];
                connectionUri = createNostrConnectURI({
                    clientPubkey,
                    relays: connectedRelays,
                    secret: sharedSecret,
                    perms: [...NIP46_REQUESTED_PERMISSIONS],
                    name: EHAGAKI_APP_NAME,
                });

                if (settled) {
                    const cancellationError = createNostrConnectCancellationError();
                    await closeHandshakeResources();
                    settleReadyFailure(cancellationError);
                    const rejectCurrentCompletion = rejectCompletion as
                        | ((reason?: unknown) => void)
                        | null;
                    if (rejectCurrentCompletion) {
                        rejectCurrentCompletion(cancellationError);
                    }
                    return;
                }

                handshakeSubscription = pendingPool.subscribe(
                    connectedRelays,
                    {
                        kinds: [kinds.NostrConnect],
                        '#p': [clientPubkey],
                        limit: 0,
                    },
                    {
                        oneose: () => {
                            console.debug('[NIP-46] EOSE received on handshake subscription; subscription remains open awaiting signer response');
                        },
                        onevent: async (event: { id?: string; content: string; pubkey: string }) => {
                            console.debug('[NIP-46] EVENT received', event.id ?? '(no id)', 'from', event.pubkey);

                            if (settled) {
                                console.debug('[NIP-46] EVENT ignored: already settled');
                                return;
                            }

                            settleHandshakeStartedSuccess();

                            try {
                                console.debug('[NIP-46] decrypt start', 'pubkey:', event.pubkey);
                                const temporaryConversationKey = nip44.getConversationKey(
                                    clientSecretKey,
                                    event.pubkey,
                                );
                                let decrypted: string;
                                try {
                                    decrypted = nip44.decrypt(
                                        event.content,
                                        temporaryConversationKey,
                                    );
                                    console.debug('[NIP-46] decrypt ok');
                                } catch (decryptErr) {
                                    console.debug('[NIP-46] decrypt fail', decryptErr);
                                    throw decryptErr;
                                }
                                const response = JSON.parse(decrypted) as {
                                    id?: string;
                                    method?: string;
                                    result?: unknown;
                                    error?: string;
                                };
                                const resultValue = response.result;
                                const resultType = typeof resultValue;
                                const isKnownAck = resultValue === 'ack';
                                console.debug('[NIP-46] parsed payload detail:', {
                                    keys: Object.keys(response),
                                    id: response.id ?? 'none',
                                    method: response.method ?? 'none',
                                    resultType,
                                    resultIsKnown: isKnownAck ? 'ack' : undefined,
                                    resultLength: resultType === 'string' ? (resultValue as string).length : 'n/a',
                                    expectedLength: sharedSecret.length,
                                    error: response.error ?? 'none',
                                });

                                const isSecretMatch = resultValue === sharedSecret;
                                if (!isSecretMatch && !isKnownAck) {
                                    console.debug('[NIP-46] result mismatch; ignoring event');
                                    return;
                                }
                                if (isKnownAck && !isSecretMatch) {
                                    console.warn('[NIP-46] remote signer responded with "ack" instead of the secret — accepting for compatibility (secret validation skipped)');
                                }

                                console.debug('[NIP-46] handshake accepted; isSecretMatch:', isSecretMatch, 'isAck:', isKnownAck);
                                handshakeAccepted = true;
                                handshakeSubscription?.close();
                                handshakeSubscription = null;

                                const activePool = pendingPool;
                                if (!activePool) {
                                    throw new Error('Nostr Connect handshake pool is unavailable');
                                }

                                const readiness = await establishReadyRelaySigner(
                                    event.pubkey,
                                    activePool,
                                );
                                interimSigner = readiness.signer;
                                let resolvedUserPubkey = readiness.userPubkey;

                                const relayResolution = await resolveNostrConnectRelayResolution(
                                    interimSigner,
                                    connectedRelays,
                                );
                                ensurePendingActive();
                                let finalRelays = relayResolution.finalRelays;
                                let finalSessionRelays = [...finalRelays];

                                let finalPool = pendingPool;
                                let finalSigner = interimSigner;

                                if (relayResolution.kind === 'signer-negotiated') {
                                    const previousPool = pendingPool;
                                    const negotiatedFinalRelay =
                                        await establishNegotiatedFinalRelaySigner(
                                            event.pubkey,
                                            resolvedUserPubkey,
                                            finalRelays,
                                        );

                                    finalPool = negotiatedFinalRelay.pool;
                                    pendingPool = finalPool;
                                    finalSigner = negotiatedFinalRelay.signer;
                                    negotiatedSigner = finalSigner;
                                    resolvedUserPubkey =
                                        negotiatedFinalRelay.userPubkey;
                                    finalRelays = [negotiatedFinalRelay.selectedRelay];
                                    finalSessionRelays = [...finalRelays];

                                    await closeNostrConnectTemporarySigner(interimSigner);
                                    interimSigner = null;
                                    if (previousPool && previousPool !== finalPool) {
                                        previousPool.destroy();
                                    }
                                }

                                if (
                                    relayResolution.kind ===
                                    'client-initial-unconfirmed'
                                ) {
                                    const fallbackPool = finalPool;
                                    if (!fallbackPool) {
                                        throw new Error(
                                            'Nostr Connect handshake pool is unavailable',
                                        );
                                    }

                                    console.debug(
                                        '[NIP-46] switch_relays timed out; verifying signer on initial ready relay',
                                    );
                                    await closeNostrConnectTemporarySigner(interimSigner);
                                    interimSigner = null;

                                    fallbackSigner = createNostrConnectBunkerSigner(
                                        clientSecretKey,
                                        event.pubkey,
                                        finalRelays,
                                        sharedSecret,
                                        fallbackPool,
                                    );
                                    finalSigner = fallbackSigner;
                                    resolvedUserPubkey = await getNostrConnectPublicKeyWithTimeout(
                                        finalSigner,
                                    );
                                    ensurePendingActive();
                                    finalSessionRelays = [...finalRelays];
                                }

                                ensurePendingActive();

                                await this.closeRuntimeResources();
                                this.pool = finalPool;
                                this.clientSecretKeyHex = clientSecretKeyHex;
                                this.bunkerSigner = finalSigner;
                                this.userPubkey = resolvedUserPubkey;
                                this.signerAdapter = new Nip46SignerAdapter(finalSigner);
                                if (finalSigner === fallbackSigner) {
                                    fallbackSigner = null;
                                }
                                if (finalSigner === negotiatedSigner) {
                                    negotiatedSigner = null;
                                }
                                if (finalSigner === interimSigner) {
                                    interimSigner = null;
                                }
                                this.setCurrentSession({
                                    clientSecretKeyHex,
                                    remoteSignerPubkey: event.pubkey,
                                    relays: [...finalSessionRelays],
                                    userPubkey: resolvedUserPubkey,
                                    pingVerified: false,
                                    relayResolution:
                                        relayResolution.sessionRelayResolution,
                                });

                                console.debug('[NIP-46] auth completed; user pubkey:', resolvedUserPubkey);
                                settled = true;
                                resolveCompletion?.(resolvedUserPubkey);
                            } catch (error) {
                                if (settled) {
                                    await closeHandshakeResources();
                                    return;
                                }

                                console.debug('[NIP-46] onevent error (not settled):', error);
                                settled = true;
                                await closeHandshakeResources();
                                rejectCompletion?.(error);
                            }
                        },
                        onclose: async (reasons?: string[]) => {
                            console.debug('[NIP-46] handshake subscription closed; settled:', settled, 'handshakeAccepted:', handshakeAccepted, 'reasons:', reasons);
                            if (settled || handshakeAccepted) {
                                return;
                            }

                            settled = true;
                            await closeHandshakeResources();
                            const timeoutError = new Error(
                                'Nostr Connect timed out before the remote signer connected',
                            );
                            settleHandshakeStartedFailure(timeoutError);
                            rejectCompletion?.(timeoutError);
                        },
                        maxWait: timeoutMs,
                    },
                );
                settleReadySuccess();
            } catch (error) {
                if (settled) {
                    return;
                }

                settled = true;
                await closeHandshakeResources();
                settleReadyFailure(error);
                settleHandshakeStartedFailure(error);
                const rejectCurrentCompletion = rejectCompletion as
                    | ((reason?: unknown) => void)
                    | null;
                if (rejectCurrentCompletion) {
                    rejectCurrentCompletion(error);
                }
            }
        })();

        return pendingSession;
    }

    async reconnect(session: Nip46SessionData): Promise<string> {
        this.setCurrentSession({
            ...session,
            pingVerified: session.pingVerified === true,
        });

        const clientSecretKey = hexToBytes(session.clientSecretKeyHex);
        const bp = {
            pubkey: session.remoteSignerPubkey,
            relays: session.relays,
            secret: null,
        };

        // リレーへの接続を事前に確認
        const { pool, connectedRelays } = await createConnectedPool(bp.relays);
        this.pool = pool;

        const bunkerPointer = {
            ...bp,
            relays: connectedRelays,
        };

        this.clientSecretKeyHex = session.clientSecretKeyHex;
        this.bunkerSigner = BunkerSigner.fromBunker(clientSecretKey, bunkerPointer, {
            pool,
            onauth: (url: string) => { console.debug('[NIP-46] onauth URL:', url); },
        });

        const reconnectConnectParamCandidates = [
            [bunkerPointer.pubkey, '', NIP46_REQUESTED_PERMS],
            [bunkerPointer.pubkey, ''],
        ];

        let reconnectConnectError: unknown = null;
        for (let attemptIndex = 0; attemptIndex < reconnectConnectParamCandidates.length; attemptIndex += 1) {
            const params = reconnectConnectParamCandidates[attemptIndex];
            console.debug('[NIP-46] reconnect connect attempt', {
                attempt: attemptIndex + 1,
                total: reconnectConnectParamCandidates.length,
                paramCount: params.length,
                withPerms: params.length >= 3,
            });
            try {
                const reconnectResponse = await this.bunkerSigner.sendRequest('connect', params);
                console.debug('[NIP-46] reconnect connect attempt succeeded', {
                    attempt: attemptIndex + 1,
                    total: reconnectConnectParamCandidates.length,
                    withPerms: params.length >= 3,
                    responseType: typeof reconnectResponse,
                    responsePreview:
                        typeof reconnectResponse === 'string'
                            ? reconnectResponse.slice(0, 120)
                            : reconnectResponse,
                });
                reconnectConnectError = null;
                break;
            } catch (error) {
                reconnectConnectError = error;
                console.warn('[NIP-46] reconnect connect attempt failed', {
                    attempt: attemptIndex + 1,
                    total: reconnectConnectParamCandidates.length,
                    paramCount: params.length,
                    error,
                });
            }
        }

        if (reconnectConnectError) {
            throw reconnectConnectError;
        }

        // セッション復元時はping()を行わない。
        // permission を扱うリモートサイナーでは ping に初回許可操作が必要になり得る一方、
        // permission を参照しないリモートサイナーも存在し得る。
        // eHagaki は signer 種別を推測せず、手動確認に成功した session だけを
        // 後続の auto ping 対象として扱う。
        // リレー接続の確認は createConnectedPool() で行われており、
        // 実際のリモートサイナーとの疎通は手動接続確認または確認済み session の auto ping で検証する。
        console.debug('[NIP-46] reconnect: session restored (relay connected, ping skipped)');

        this.userPubkey = session.userPubkey;
        this.signerAdapter = new Nip46SignerAdapter(this.bunkerSigner);
        this.updateCurrentSessionFromRuntime(session.pingVerified === true);

        return this.userPubkey;
    }

    async disconnect(): Promise<void> {
        this.operationKind = null;
        this.operationPromise = null;
        this.emitOperationState();
        await this.closeRuntimeResources();
        this.setCurrentSession(null);
        this.persistenceBinding = null;
    }

    isConnected(): boolean {
        return this.bunkerSigner !== null && this.userPubkey !== null;
    }

    /**
     * リレー接続が生きているか確認し、切れている場合はセッションから再接続する。
     * visibilitychange でバックグラウンド復帰時に呼び出す。
        * permission を扱うリモートサイナーでは ping に初回許可操作が必要になり得るが、
        * permission を参照しないリモートサイナーも存在し得る。
        * eHagaki は signer 種別を推測せず、30 秒以上バックグラウンドだった後でも
        * 手動確認に成功した session のみ auto ping を試す。
        * auto ping が成功した場合は既存 connection を維持し、failure の場合は
        * `pingVerified` を false に戻して pool + BunkerSigner の rebuild に fallback する。
        * 未確認 session では auto ping を送らず、従来どおり rebuild を使う。
        * nokandro のように無操作で応答する signer でも、この保守的フローで安全に扱う。
     *
     * バックグラウンド移行時にWebSocketが切断されると、SimplePool内のリレーオブジェクトが
     * 削除され（enableReconnect=false時）、BunkerSignerの内部サブスクリプションも失われる。
     * pool.ensureRelay()で再接続してもゾンビ接続（readyState=OPENだが実際は切断済み）の
     * 可能性があるため、常にpool + BunkerSignerを完全に再構築する。
     */
    async ensureConnection(): Promise<boolean> {
        if (this.operationPromise) {
            return await this.operationPromise;
        }

        return await this.runOperation('auto-recovery', async () => {
            if (!this.currentSession) {
                return false;
            }

            const hasLiveSigner =
                this.bunkerSigner !== null
                && this.userPubkey !== null
                && this.clientSecretKeyHex !== null;

            if (hasLiveSigner && this.currentSession.pingVerified === true) {
                const pingSucceeded = await this.pingWithTimeout(
                    NIP46_AUTO_PING_TIMEOUT_MS,
                );
                if (pingSucceeded) {
                    this.setPingVerified(true);
                    this.persistBoundSession();
                    return true;
                }

                this.setPingVerified(false);
                this.persistBoundSession();
                return await this.rebuildConnection();
            }

            return await this.rebuildConnection();
        });
    }

    async runManualConnectionCheck(): Promise<Nip46ManualConnectionCheckResult> {
        if (this.operationKind === 'manual-check' && this.operationPromise) {
            return {
                success: await this.operationPromise,
            };
        }

        if (this.operationPromise) {
            return {
                success: false,
                skipped: true,
            };
        }

        const success = await this.runOperation('manual-check', async () => {
            if (!this.currentSession || !this.bunkerSigner) {
                this.setPingVerified(false);
                this.persistBoundSession();
                return false;
            }

            const pingSucceeded = await this.pingWithTimeout(
                NIP46_MANUAL_PING_TIMEOUT_MS,
            );

            this.setPingVerified(pingSucceeded);
            this.persistBoundSession();
            return pingSucceeded;
        });

        return { success };
    }

    getSigner(): Nip46SignerAdapter | null {
        return this.signerAdapter;
    }

    getUserPubkey(): string | null {
        return this.userPubkey;
    }

    saveSession(storage: Storage, pubkeyHex?: string): void {
        this.bindSessionPersistence(storage, pubkeyHex);

        if (!this.currentSession) {
            this.updateCurrentSessionFromRuntime();
        }

        this.writeSession(storage, this.persistenceBinding?.pubkeyHex);
    }

    static loadSession(storage: Storage, pubkeyHex?: string): Nip46SessionData | null {
        const data = storage.getItem(getNip46SessionStorageKey(pubkeyHex));
        if (!data) return null;
        try {
            const session = JSON.parse(data) as Partial<Nip46SessionData> | null;
            if (
                !session
                || typeof session.clientSecretKeyHex !== 'string'
                || typeof session.remoteSignerPubkey !== 'string'
                || !Array.isArray(session.relays)
                || typeof session.userPubkey !== 'string'
            ) {
                return null;
            }

            return {
                clientSecretKeyHex: session.clientSecretKeyHex,
                remoteSignerPubkey: session.remoteSignerPubkey,
                relays: session.relays.filter((relay): relay is string => typeof relay === 'string'),
                userPubkey: session.userPubkey,
                pingVerified: session.pingVerified === true,
                ...(normalizeRelayResolution(session.relayResolution)
                    ? {
                        relayResolution: normalizeRelayResolution(
                            session.relayResolution,
                        ),
                    }
                    : {}),
            };
        } catch {
            return null;
        }
    }

    static clearSession(storage: Storage, pubkeyHex?: string): void {
        storage.removeItem(getNip46SessionStorageKey(pubkeyHex));
    }
}

export const nip46Service = new Nip46Service();
