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
const NIP46_LIVE_IDENTITY_TIMEOUT_MS = 5000;
const NIP46_GET_PUBLIC_KEY_TIMEOUT_MESSAGE =
    'Timed out waiting for get_public_key response';
const NIP46_LIVE_IDENTITY_AUTH_CHALLENGE_MESSAGE =
    'Remote signer requested authentication during automatic identity verification';
const NIP46_LIVE_IDENTITY_INVALID_MESSAGE =
    'Remote signer returned an invalid user public key';
const NIP46_LIVE_IDENTITY_MISMATCH_MESSAGE =
    'Remote signer returned an unexpected user public key';
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

type Nip46LogFailureReason =
    | 'unexpected'
    | 'identity-invalid'
    | 'identity-mismatch'
    | 'permission-denied'
    | 'timeout'
    | 'auth-challenge'
    | 'relay-unreachable'
    | 'relay-negotiation-invalid'
    | 'cancelled'
    | 'method-unsupported';

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

type Nip46RuntimeSnapshot = {
    pool: SimplePool | null;
    bunkerSigner: BunkerSigner | null;
    signerAdapter: Nip46SignerAdapter | null;
    userPubkey: string | null;
    clientSecretKeyHex: string | null;
};

type LiveIdentityAuthChallenge = {
    promise: Promise<never>;
    reject: () => void;
};

type Nip46OperationKind = 'manual-check' | 'auto-recovery';

type Nip46SessionIdentity = Pick<
    Nip46SessionData,
    'clientSecretKeyHex' | 'remoteSignerPubkey' | 'userPubkey'
>;

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
 * - sign_event:22242 — NIP-42 Relay Authentication（リレー認証）
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
    'sign_event:22242',
    'sign_event:27235',
    'sign_event:24242',
] as const;

export const NIP46_REQUESTED_PERMS = NIP46_REQUESTED_PERMISSIONS.join(',');

// --- rx-nostr EventSigner アダプタ ---
export class Nip46SignerAdapter {
    constructor(
        private bunkerSigner: BunkerSigner,
        private fallbackPubkey: string | null = null,
    ) { }

    async signEvent<K extends number>(params: {
        kind: K;
        content: string;
        tags?: string[][];
        created_at?: number;
        pubkey?: string;
    }): Promise<any> {
        const effectivePubkey =
            typeof params.pubkey === 'string' && params.pubkey.length > 0
                ? params.pubkey
                : this.fallbackPubkey;
        const template = {
            kind: params.kind,
            content: params.content,
            tags: params.tags ?? [],
            created_at: params.created_at ?? Math.floor(Date.now() / 1000),
            ...(effectivePubkey ? { pubkey: effectivePubkey } : {}),
        };
        const startedAt = Date.now();
        console.debug('[NIP-46] sign_event start', {
            method: 'sign_event',
            stage: 'start',
            kind: template.kind,
        });

        try {
            const signedEvent = await this.bunkerSigner.signEvent(template);
            const durationMs = Date.now() - startedAt;
            console.debug('[NIP-46] sign_event resolved', {
                method: 'sign_event',
                stage: 'success',
                kind: template.kind,
                durationMs,
            });
            return signedEvent;
        } catch (error) {
            const durationMs = Date.now() - startedAt;
            console.error('[NIP-46] sign_event failed', {
                method: 'sign_event',
                stage: 'failure',
                kind: template.kind,
                durationMs,
                reason: 'unexpected' satisfies Nip46LogFailureReason,
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
        this.addEventListener('open', () => {
            console.debug('[NIP-46 WS] open', { direction: 'transport' });
        });
        this.addEventListener('message', () => {
            console.debug('[NIP-46 WS] receive', { direction: 'inbound' });
        });
        this.addEventListener('close', (ev: CloseEvent) => {
            console.debug('[NIP-46 WS] close', {
                direction: 'transport',
                closeCode: ev.code,
            });
        });
        this.addEventListener('error', () => {
            console.debug('[NIP-46 WS] error', { direction: 'transport' });
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
        console.debug('[NIP-46 WS] send', { direction: 'outbound' });
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
    const uniqueRelays = [...new Set(sanitizeNip46NostrConnectRelays(relays))];
    if (uniqueRelays.length === 0) {
        throw new Error('Relay connection failed: no reachable relays');
    }

    // NIP-46用WebSocket(デバッグログ + limit:0パッチ)を設定
    const origWs = globalThis.WebSocket;
    useWebSocketImplementation(Nip46WebSocket);
    const pool = new SimplePool();
    useWebSocketImplementation(origWs);
    const connectedRelays: string[] = [];
    const connectionErrors: string[] = [];

    for (const [index, relay] of uniqueRelays.entries()) {
        try {
            console.debug('[NIP-46] relay connection attempt', {
                attempt: index + 1,
                total: uniqueRelays.length,
            });
            await pool.ensureRelay(relay, {
                connectionTimeout: RELAY_CONNECT_TIMEOUT_MS,
            });
            console.debug('[NIP-46] relay connection succeeded', {
                connected: connectedRelays.length + 1,
                total: uniqueRelays.length,
            });
            connectedRelays.push(relay);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.warn('[NIP-46] relay connection failed', {
                reason: 'relay-unreachable' satisfies Nip46LogFailureReason,
                failed: connectionErrors.length + 1,
                total: uniqueRelays.length,
            });
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
        console.warn('[NIP-46] continuing with reachable relays only', {
            connected: connectedRelays.length,
            failed: connectionErrors.length,
        });
    }

    return { pool, connectedRelays };
}

async function createConnectedPoolReadyOnFirstReachable(
    relays: string[],
    logMessages: RelayConnectionLogMessages =
        FIRST_REACHABLE_RELAY_CONNECTION_LOG_MESSAGES,
    collectReadyWindowMs: number = 0,
): Promise<{ pool: SimplePool; connectedRelays: string[] }> {
    const uniqueRelays = [...new Set(sanitizeNip46NostrConnectRelays(relays))];
    if (uniqueRelays.length === 0) {
        throw new Error('Relay connection failed: no reachable relays');
    }

    const origWs = globalThis.WebSocket;
    useWebSocketImplementation(Nip46WebSocket);
    const pool = new SimplePool();
    useWebSocketImplementation(origWs);

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

    const connectionAttempts = uniqueRelays.map(async (relay, index) => {
        try {
            console.debug(logMessages.connecting, {
                attempt: index + 1,
                total: uniqueRelays.length,
            });
            await pool.ensureRelay(relay, {
                connectionTimeout: RELAY_CONNECT_TIMEOUT_MS,
            });
            console.debug(logMessages.connected, {
                connected: connectedRelays.length + 1,
                total: uniqueRelays.length,
            });
            connectedRelaySet.add(relay);
            connectedRelays.push(relay);
            settleFirstReachable();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.warn(logMessages.failed, {
                reason: 'relay-unreachable' satisfies Nip46LogFailureReason,
                failed: connectionErrors.length + 1,
                total: uniqueRelays.length,
            });
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
        console.warn(logMessages.partial, {
            connected: finalizedConnectedRelays.length,
            failed: connectionErrors.length,
        });
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
    const uniqueRelays = [...new Set(sanitizeNip46NostrConnectRelays(relays))];
    if (uniqueRelays.length === 0) {
        throw new Error('Relay connection failed: no reachable relays');
    }

    const origWs = globalThis.WebSocket;
    useWebSocketImplementation(Nip46WebSocket);
    const pool = new SimplePool();
    useWebSocketImplementation(origWs);

    const connectedRelaySet = new Set<string>();
    const connectionErrors: string[] = [];

    await Promise.all(
        uniqueRelays.map(async (relay, index) => {
            try {
                console.debug(logMessages.connecting, {
                    attempt: index + 1,
                    total: uniqueRelays.length,
                });
                await pool.ensureRelay(relay, {
                    connectionTimeout: RELAY_CONNECT_TIMEOUT_MS,
                });
                console.debug(logMessages.connected, {
                    connected: connectedRelaySet.size + 1,
                    total: uniqueRelays.length,
                });
                connectedRelaySet.add(relay);
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                console.warn(logMessages.failed, {
                    reason: 'relay-unreachable' satisfies Nip46LogFailureReason,
                    failed: connectionErrors.length + 1,
                    total: uniqueRelays.length,
                });
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
        console.warn(logMessages.partial, {
            connected: finalizedConnectedRelays.length,
            failed: connectionErrors.length,
        });
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

function createLiveIdentityAuthChallenge(): LiveIdentityAuthChallenge {
    let rejected = false;
    let rejectChallenge: ((reason?: unknown) => void) | null = null;

    const promise = new Promise<never>((_, reject) => {
        rejectChallenge = reject;
    });

    return {
        promise,
        reject: () => {
            if (rejected) {
                return;
            }

            rejected = true;
            rejectChallenge?.(new Error(NIP46_LIVE_IDENTITY_AUTH_CHALLENGE_MESSAGE));
        },
    };
}

function isValidNip46UserPubkey(value: unknown): value is string {
    return typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
}

async function readLiveNip46UserPubkey(
    signer: BunkerSigner,
    authChallenge: LiveIdentityAuthChallenge,
    timeoutMs: number = NIP46_LIVE_IDENTITY_TIMEOUT_MS,
): Promise<string> {
    const response = await withTimeout(
        Promise.race([
            signer.sendRequest('get_public_key', []),
            authChallenge.promise,
        ]),
        timeoutMs,
        NIP46_GET_PUBLIC_KEY_TIMEOUT_MESSAGE,
    );

    if (!isValidNip46UserPubkey(response)) {
        throw new Error(NIP46_LIVE_IDENTITY_INVALID_MESSAGE);
    }

    return response;
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

function parseDeterministicRelayList(value: string): {
    supportedRelays: string[];
    parsedCount: number;
    unsupportedCount: number;
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

    const supportedRelays: string[] = [];
    let unsupportedCount = 0;
    const seen = new Set<string>();

    for (const relay of parsed) {
        if (typeof relay !== 'string') {
            console.warn(
                '[NIP-46] switch_relays returned malformed relay list response:',
                'relay entry was not a string',
            );
            throw new Error(NIP46_FINAL_RELAY_LIST_INVALID_MESSAGE);
        }

        const normalizedRelay = normalizeSupportedNip46FinalRelay(relay);
        if (!normalizedRelay) {
            unsupportedCount += 1;
            continue;
        }

        if (seen.has(normalizedRelay)) {
            continue;
        }

        seen.add(normalizedRelay);
        supportedRelays.push(normalizedRelay);
    }

    return {
        supportedRelays,
        parsedCount: parsed.length,
        unsupportedCount,
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
): { signer: BunkerSigner; authChallenge: LiveIdentityAuthChallenge } {
    const authChallenge = createLiveIdentityAuthChallenge();
    const signer = BunkerSigner.fromBunker(
        clientSecretKey,
        {
            pubkey: remoteSignerPubkey,
            relays,
            secret: sharedSecret,
        },
        {
            pool,
            onauth: authChallenge.reject,
        },
    );

    return { signer, authChallenge };
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
    authChallenge: LiveIdentityAuthChallenge,
    timeoutMs: number = NIP46_GET_PUBLIC_KEY_TIMEOUT_MS,
): Promise<string> {
    return await readLiveNip46UserPubkey(signer, authChallenge, timeoutMs);
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
            console.warn('[NIP-46] switch_relays not supported by signer', {
                method: 'switch_relays',
                outcome: 'method-unsupported',
                reason: 'method-unsupported' satisfies Nip46LogFailureReason,
            });
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
    console.debug('[NIP-46] switch_relays response classified', {
        method: 'switch_relays',
        parsed: relayList.parsedCount,
        supported: relayList.supportedRelays.length,
        unsupported: relayList.unsupportedCount,
    });

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

    private writeSessionSnapshot(
        storage: Storage,
        pubkeyHex: string | undefined,
        session: Nip46SessionData,
    ): void {
        storage.setItem(
            getNip46SessionStorageKey(pubkeyHex),
            JSON.stringify(session),
        );
    }

    private writeSession(storage: Storage, pubkeyHex?: string): void {
        if (!this.currentSession) {
            return;
        }

        this.writeSessionSnapshot(storage, pubkeyHex, this.currentSession);
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

    private snapshotRuntime(): Nip46RuntimeSnapshot {
        return {
            pool: this.pool,
            bunkerSigner: this.bunkerSigner,
            signerAdapter: this.signerAdapter,
            userPubkey: this.userPubkey,
            clientSecretKeyHex: this.clientSecretKeyHex,
        };
    }

    private isCurrentRuntime(snapshot: Nip46RuntimeSnapshot): boolean {
        return this.pool === snapshot.pool
            && this.bunkerSigner === snapshot.bunkerSigner
            && this.signerAdapter === snapshot.signerAdapter
            && this.userPubkey === snapshot.userPubkey
            && this.clientSecretKeyHex === snapshot.clientSecretKeyHex;
    }

    private isCurrentSessionSnapshot(snapshot: Nip46SessionData): boolean {
        const current = this.currentSession;
        return current !== null
            && current.clientSecretKeyHex === snapshot.clientSecretKeyHex
            && current.remoteSignerPubkey === snapshot.remoteSignerPubkey
            && current.userPubkey === snapshot.userPubkey
            && current.pingVerified === snapshot.pingVerified
            && current.relayResolution === snapshot.relayResolution
            && current.relays.length === snapshot.relays.length
            && current.relays.every((relay, index) => relay === snapshot.relays[index]);
    }

    private isCurrentPersistenceBinding(
        snapshot: SessionPersistenceBinding | null,
    ): boolean {
        const current = this.persistenceBinding;
        if (!snapshot || !current) {
            return snapshot === current;
        }

        return current.storage === snapshot.storage
            && current.pubkeyHex === snapshot.pubkeyHex;
    }

    private detachRuntimeIfCurrent(
        snapshot: Nip46RuntimeSnapshot,
    ): Nip46RuntimeSnapshot | null {
        if (!this.isCurrentRuntime(snapshot)) {
            return null;
        }

        this.bunkerSigner = null;
        this.signerAdapter = null;
        this.userPubkey = null;
        this.clientSecretKeyHex = null;
        this.pool = null;
        return snapshot;
    }

    private async closeRuntimeSnapshot(
        snapshot: Nip46RuntimeSnapshot,
    ): Promise<void> {
        if (snapshot.bunkerSigner) {
            try {
                await snapshot.bunkerSigner.close();
            } catch {
                // noop
            }
        }

        snapshot.pool?.destroy();
    }

    private isCurrentSession(
        identity: Nip46SessionIdentity,
        expectedPubkey: string = identity.userPubkey,
    ): boolean {
        return this.currentSession !== null
            && expectedPubkey === identity.userPubkey
            && this.currentSession.userPubkey === identity.userPubkey
            && this.currentSession.remoteSignerPubkey === identity.remoteSignerPubkey
            && this.currentSession.clientSecretKeyHex === identity.clientSecretKeyHex;
    }

    private getRuntimeSignerForSession(
        expectedPubkey: string,
    ): Nip46SignerAdapter | null {
        if (
            !this.currentSession
            || this.currentSession.userPubkey !== expectedPubkey
            || this.userPubkey !== expectedPubkey
            || !this.bunkerSigner
            || !this.signerAdapter
        ) {
            return null;
        }

        return this.signerAdapter;
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

        const session: Nip46SessionData = {
            ...this.currentSession,
            relays: [...this.currentSession.relays],
        };
        const runtime = this.snapshotRuntime();
        const binding = this.persistenceBinding
            ? { ...this.persistenceBinding }
            : null;
        let candidatePool: SimplePool | null = null;
        let candidateBunkerSigner: BunkerSigner | null = null;

        const closeCandidateResources = async (): Promise<void> => {
            if (candidateBunkerSigner) {
                try {
                    await candidateBunkerSigner.close();
                } catch {
                    // noop
                }
                candidateBunkerSigner = null;
            }

            candidatePool?.destroy();
            candidatePool = null;
        };

        const failCandidate = async (): Promise<boolean> => {
            await closeCandidateResources();

            if (
                !this.isCurrentSessionSnapshot(session)
                || !this.isCurrentRuntime(runtime)
            ) {
                return false;
            }

            const detachedRuntime = this.detachRuntimeIfCurrent(runtime);
            if (detachedRuntime) {
                await this.closeRuntimeSnapshot(detachedRuntime);
            }

            return false;
        };

        try {
            const clientSecretKey = hexToBytes(session.clientSecretKeyHex);
            const { pool, connectedRelays } = await createConnectedPool(session.relays);
            candidatePool = pool;
            const authChallenge = createLiveIdentityAuthChallenge();
            candidateBunkerSigner = BunkerSigner.fromBunker(clientSecretKey, {
                pubkey: session.remoteSignerPubkey,
                relays: connectedRelays,
                secret: null,
            }, {
                pool,
                onauth: authChallenge.reject,
            });
            const candidateSignerAdapter = new Nip46SignerAdapter(
                candidateBunkerSigner,
                session.userPubkey,
            );

            const liveUserPubkey = await readLiveNip46UserPubkey(
                candidateBunkerSigner,
                authChallenge,
            );
            if (liveUserPubkey !== session.userPubkey) {
                throw new Error(NIP46_LIVE_IDENTITY_MISMATCH_MESSAGE);
            }

            const nextSession: Nip46SessionData = {
                ...session,
                relays: [...connectedRelays],
            };

            if (
                !this.isCurrentSessionSnapshot(session)
                || !this.isCurrentRuntime(runtime)
                || !this.isCurrentPersistenceBinding(binding)
            ) {
                return await failCandidate();
            }

            if (binding) {
                this.writeSessionSnapshot(
                    binding.storage,
                    binding.pubkeyHex,
                    nextSession,
                );
            }

            this.pool = candidatePool;
            this.clientSecretKeyHex = session.clientSecretKeyHex;
            this.userPubkey = session.userPubkey;
            this.bunkerSigner = candidateBunkerSigner;
            this.signerAdapter = candidateSignerAdapter;
            this.setCurrentSession(nextSession);
            candidatePool = null;
            candidateBunkerSigner = null;
            await this.closeRuntimeSnapshot(runtime);
            console.debug('[NIP-46] rebuildConnection: pool + BunkerSigner rebuilt');
            return true;
        } catch {
            await failCandidate();
            console.warn('[NIP-46] rebuildConnection candidate verification failed');
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
        console.debug('[NIP-46] bunker connect parsing', {
            stage: 'start',
        });
        const bp = await parseBunkerInput(bunkerUrl);
        if (!bp) {
            throw new Error('Invalid bunker URL');
        }
        console.debug('[NIP-46] bunker connect input parsed', {
            stage: 'parsed',
            relays: bp.relays.length,
        });

        if (bp.relays.length === 0) {
            throw new Error('No relays specified in bunker URL');
        }

        let candidatePool: SimplePool | null = null;
        let candidateBunkerSigner: BunkerSigner | null = null;

        const closeCandidateResources = async (): Promise<void> => {
            if (candidateBunkerSigner) {
                try {
                    await candidateBunkerSigner.close();
                } catch {
                    // noop
                }
                candidateBunkerSigner = null;
            }

            candidatePool?.destroy();
            candidatePool = null;
        };

        try {
            const { pool, connectedRelays } = await createConnectedPool(bp.relays);
            candidatePool = pool;
            const bunkerPointer = {
                ...bp,
                relays: connectedRelays,
            };
            const clientSecretKey = generateSecretKey();
            const clientSecretKeyHex = bytesToHex(clientSecretKey);
            const authChallenge = createLiveIdentityAuthChallenge();
            candidateBunkerSigner = BunkerSigner.fromBunker(clientSecretKey, bunkerPointer, {
                pool,
                onauth: authChallenge.reject,
            });

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

            let connectError: unknown = null;
            let resolvedUserPubkey: string | null = null;
            for (const params of connectParamCandidates) {
                let connectSucceeded = false;
                try {
                    await withTimeout(
                        Promise.race([
                            candidateBunkerSigner.sendRequest('connect', params),
                            authChallenge.promise,
                        ]),
                        timeoutMs,
                        'Bunker did not respond. The relay is connected but the remote signer may be offline or the secret may have expired.',
                    );
                    connectSucceeded = true;

                    try {
                        resolvedUserPubkey = await readLiveNip46UserPubkey(
                            candidateBunkerSigner,
                            authChallenge,
                        );
                        connectError = null;
                    } catch (error) {
                        if (isNoPermissionError(error)) {
                            const signedProbe = await withTimeout(
                                Promise.race([
                                    candidateBunkerSigner.signEvent({
                                        kind: 1,
                                        content: '',
                                        tags: [],
                                        created_at: Math.floor(Date.now() / 1000),
                                    }),
                                    authChallenge.promise,
                                ]),
                                timeoutMs,
                                'Timed out waiting for sign_event pubkey fallback response',
                            ) as { pubkey?: unknown };

                            if (!isValidNip46UserPubkey(signedProbe.pubkey)) {
                                throw new Error(NIP46_LIVE_IDENTITY_INVALID_MESSAGE);
                            }
                            resolvedUserPubkey = signedProbe.pubkey;
                            connectError = null;
                        } else {
                            connectError = error;
                        }
                    }

                    // connect request already succeeded; re-sending connect can consume one-time secrets.
                    break;
                } catch (error) {
                    connectError = error;
                    if (connectSucceeded) {
                        break;
                    }
                }
            }

            if (connectError || !resolvedUserPubkey) {
                throw connectError ?? new Error('Failed to resolve user public key after connect');
            }

            const candidateSignerAdapter = new Nip46SignerAdapter(
                candidateBunkerSigner,
                resolvedUserPubkey,
            );
            await this.closeRuntimeResources();
            this.pool = candidatePool;
            this.clientSecretKeyHex = clientSecretKeyHex;
            this.userPubkey = resolvedUserPubkey;
            this.bunkerSigner = candidateBunkerSigner;
            this.signerAdapter = candidateSignerAdapter;
            this.setCurrentSession({
                clientSecretKeyHex,
                remoteSignerPubkey: bunkerPointer.pubkey,
                relays: [...connectedRelays],
                userPubkey: resolvedUserPubkey,
                pingVerified: false,
            });
            candidatePool = null;
            candidateBunkerSigner = null;
            return resolvedUserPubkey;
        } catch (error) {
            await closeCandidateResources();
            throw error;
        }
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

                const attemptCandidate = createNostrConnectBunkerSigner(
                    clientSecretKey,
                    remoteSignerPubkey,
                    connectedRelays,
                    sharedSecret,
                    pool,
                );
                const attemptSigner = attemptCandidate.signer;
                interimSigner = attemptSigner;

                try {
                    const userPubkey = await getNostrConnectPublicKeyWithTimeout(
                        attemptSigner,
                        attemptCandidate.authChallenge,
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
                    const finalCandidate = createNostrConnectBunkerSigner(
                        clientSecretKey,
                        remoteSignerPubkey,
                        [selectedRelay],
                        sharedSecret,
                        finalConnection.pool,
                    );
                    finalSignerCandidate = finalCandidate.signer;

                    const verifiedUserPubkey = await getNostrConnectPublicKeyWithTimeout(
                        finalSignerCandidate,
                        finalCandidate.authChallenge,
                    );
                    ensurePendingActive();

                    if (verifiedUserPubkey !== expectedUserPubkey) {
                        console.warn(
                            '[NIP-46] negotiated final relay identity mismatch',
                            {
                                reason: 'identity-mismatch' satisfies Nip46LogFailureReason,
                            },
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

                    console.warn('[NIP-46] negotiated final relay verification failed', {
                        reason: 'relay-negotiation-invalid' satisfies Nip46LogFailureReason,
                    });

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
                            console.debug('[NIP-46] handshake response received', {
                                stage: 'response-received',
                            });

                            if (settled) {
                                console.debug('[NIP-46] EVENT ignored: already settled');
                                return;
                            }

                            settleHandshakeStartedSuccess();

                            try {
                                console.debug('[NIP-46] handshake decrypt started', {
                                    stage: 'decrypt-start',
                                });
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
                                    console.debug('[NIP-46] handshake decrypt succeeded', {
                                        stage: 'decrypt-success',
                                    });
                                } catch (decryptErr) {
                                    console.debug('[NIP-46] handshake decrypt failed', {
                                        stage: 'decrypt-failure',
                                        reason: 'unexpected' satisfies Nip46LogFailureReason,
                                    });
                                    throw decryptErr;
                                }
                                const response = JSON.parse(decrypted) as {
                                    id?: string;
                                    method?: string;
                                    result?: unknown;
                                    error?: string;
                                };
                                const resultValue = response.result;
                                const isKnownAck = resultValue === 'ack';

                                const isSecretMatch = resultValue === sharedSecret;
                                if (!isSecretMatch && !isKnownAck) {
                                    console.debug('[NIP-46] handshake response rejected', {
                                        stage: 'response-rejected',
                                        reason: 'unexpected' satisfies Nip46LogFailureReason,
                                    });
                                    return;
                                }
                                if (isKnownAck && !isSecretMatch) {
                                    console.warn('[NIP-46] handshake accepted compatibility acknowledgement', {
                                        stage: 'compatibility-ack',
                                    });
                                }

                                console.debug('[NIP-46] handshake accepted', {
                                    stage: 'accepted',
                                });
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

                                    const fallbackCandidate = createNostrConnectBunkerSigner(
                                        clientSecretKey,
                                        event.pubkey,
                                        finalRelays,
                                        sharedSecret,
                                        fallbackPool,
                                    );
                                    fallbackSigner = fallbackCandidate.signer;
                                    finalSigner = fallbackSigner;
                                    resolvedUserPubkey = await getNostrConnectPublicKeyWithTimeout(
                                        finalSigner,
                                        fallbackCandidate.authChallenge,
                                    );
                                    ensurePendingActive();
                                    if (resolvedUserPubkey !== readiness.userPubkey) {
                                        throw new Error(
                                            NIP46_FINAL_RELAY_VERIFICATION_FAILED_MESSAGE,
                                        );
                                    }
                                    finalSessionRelays = [...finalRelays];
                                }

                                ensurePendingActive();

                                await this.closeRuntimeResources();
                                this.pool = finalPool;
                                this.clientSecretKeyHex = clientSecretKeyHex;
                                this.bunkerSigner = finalSigner;
                                this.userPubkey = resolvedUserPubkey;
                                this.signerAdapter = new Nip46SignerAdapter(
                                    finalSigner,
                                    resolvedUserPubkey,
                                );
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

                                console.debug('[NIP-46] auth completed after identity verification');
                                settled = true;
                                resolveCompletion?.(resolvedUserPubkey);
                            } catch (error) {
                                if (settled) {
                                    await closeHandshakeResources();
                                    return;
                                }

                                console.debug('[NIP-46] Nostr Connect candidate verification failed');
                                settled = true;
                                await closeHandshakeResources();
                                rejectCompletion?.(error);
                            }
                        },
                        onclose: async () => {
                            console.debug('[NIP-46] handshake subscription closed', {
                                stage: 'closed',
                            });
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
        const sessionSnapshot: Nip46SessionData = {
            ...session,
            relays: [...session.relays],
            pingVerified: session.pingVerified === true,
        };
        let candidatePool: SimplePool | null = null;
        let candidateBunkerSigner: BunkerSigner | null = null;

        const closeCandidateResources = async (): Promise<void> => {
            if (candidateBunkerSigner) {
                try {
                    await candidateBunkerSigner.close();
                } catch {
                    // noop
                }
                candidateBunkerSigner = null;
            }

            candidatePool?.destroy();
            candidatePool = null;
        };

        try {
            const clientSecretKey = hexToBytes(sessionSnapshot.clientSecretKeyHex);
            const { pool, connectedRelays } = await createConnectedPool(sessionSnapshot.relays);
            candidatePool = pool;
            const bunkerPointer = {
                pubkey: sessionSnapshot.remoteSignerPubkey,
                relays: connectedRelays,
                secret: null,
            };
            const authChallenge = createLiveIdentityAuthChallenge();
            candidateBunkerSigner = BunkerSigner.fromBunker(clientSecretKey, bunkerPointer, {
                pool,
                onauth: authChallenge.reject,
            });

            const reconnectConnectParamCandidates = [
                [bunkerPointer.pubkey, '', NIP46_REQUESTED_PERMS],
                [bunkerPointer.pubkey, ''],
            ];

            let reconnectConnectError: unknown = null;
            for (const params of reconnectConnectParamCandidates) {
                try {
                    await withTimeout(
                        Promise.race([
                            candidateBunkerSigner.sendRequest('connect', params),
                            authChallenge.promise,
                        ]),
                        NIP46_LIVE_IDENTITY_TIMEOUT_MS,
                        'Timed out waiting for reconnect connect response',
                    );
                    reconnectConnectError = null;
                    break;
                } catch (error) {
                    reconnectConnectError = error;
                }
            }

            if (reconnectConnectError) {
                throw reconnectConnectError;
            }

            const liveUserPubkey = await readLiveNip46UserPubkey(
                candidateBunkerSigner,
                authChallenge,
            );
            if (liveUserPubkey !== sessionSnapshot.userPubkey) {
                throw new Error(NIP46_LIVE_IDENTITY_MISMATCH_MESSAGE);
            }

            const candidateSignerAdapter = new Nip46SignerAdapter(
                candidateBunkerSigner,
                sessionSnapshot.userPubkey,
            );
            const nextSession: Nip46SessionData = {
                ...sessionSnapshot,
                relays: [...connectedRelays],
            };

            await this.closeRuntimeResources();
            this.pool = candidatePool;
            this.clientSecretKeyHex = sessionSnapshot.clientSecretKeyHex;
            this.userPubkey = sessionSnapshot.userPubkey;
            this.bunkerSigner = candidateBunkerSigner;
            this.signerAdapter = candidateSignerAdapter;
            this.setCurrentSession(nextSession);
            candidatePool = null;
            candidateBunkerSigner = null;

            // セッション復元時はping()を行わない。
            console.debug('[NIP-46] reconnect: session restored after live identity verification');
            return sessionSnapshot.userPubkey;
        } catch (error) {
            await closeCandidateResources();
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        this.operationKind = null;
        this.operationPromise = null;
        this.emitOperationState();
        this.setCurrentSession(null);
        this.persistenceBinding = null;
        await this.closeRuntimeResources();
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

    async getSignerForSession(
        expectedPubkey: string,
    ): Promise<Nip46SignerAdapter | null> {
        const session = this.currentSession;
        if (!session || session.userPubkey !== expectedPubkey) {
            return null;
        }

        const sessionIdentity: Nip46SessionIdentity = {
            clientSecretKeyHex: session.clientSecretKeyHex,
            remoteSignerPubkey: session.remoteSignerPubkey,
            userPubkey: session.userPubkey,
        };
        const pendingOperationPromise = this.operationPromise;
        const pendingOperationKind = this.operationKind;
        let pendingOperationSucceeded: boolean | null = null;

        if (pendingOperationPromise) {
            try {
                pendingOperationSucceeded = await pendingOperationPromise;
            } catch {
                pendingOperationSucceeded = false;
                console.warn('[NIP-46] signer request: pending operation failed', {
                    operationKind: pendingOperationKind,
                    reason: 'unexpected' satisfies Nip46LogFailureReason,
                });
            }
        }

        if (!this.isCurrentSession(sessionIdentity, expectedPubkey)) {
            return null;
        }

        if (
            pendingOperationPromise
            && pendingOperationKind === 'manual-check'
            && pendingOperationSucceeded === false
        ) {
            console.warn('[NIP-46] signer request: manual check failed');
            return null;
        }

        if (!pendingOperationPromise || pendingOperationSucceeded === true) {
            const signer = this.getRuntimeSignerForSession(expectedPubkey);
            if (signer) {
                return signer;
            }
        }

        console.debug('[NIP-46] signer request: starting limited reconnect', {
            operationKind: pendingOperationKind,
        });

        let recovered: boolean;
        try {
            recovered = await this.ensureConnection();
        } catch {
            console.error('[NIP-46] signer request: reconnect threw unexpectedly', {
                operationKind: pendingOperationKind,
                reason: 'unexpected' satisfies Nip46LogFailureReason,
            });
            return null;
        }

        if (!recovered) {
            console.warn('[NIP-46] signer request: limited reconnect failed', {
                operationKind: pendingOperationKind,
            });
            return null;
        }

        if (!this.isCurrentSession(sessionIdentity, expectedPubkey)) {
            return null;
        }

        const signer = this.getRuntimeSignerForSession(expectedPubkey);
        if (signer) {
            console.debug('[NIP-46] signer request: limited reconnect succeeded', {
                operationKind: pendingOperationKind,
            });
        }
        return signer;
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
                relays: sanitizeNip46NostrConnectRelays(
                    session.relays.filter((relay): relay is string => typeof relay === 'string'),
                ),
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
