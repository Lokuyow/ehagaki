import { BunkerSigner, parseBunkerInput, BUNKER_REGEX } from 'nostr-tools/nip46';
import { SimplePool, useWebSocketImplementation } from 'nostr-tools/pool';
import { bytesToHex, hexToBytes } from 'nostr-tools/utils';
import { generateSecretKey } from 'nostr-tools/pure';
import type { Nip46SessionData } from './types';
import { STORAGE_KEYS } from './constants';

export { BUNKER_REGEX };

const RELAY_CONNECT_TIMEOUT_MS = 5000;
const LOCAL_NETWORK_IFRAME_ALLOW_VALUE = 'local-network-access; local-network; loopback-network';
const LOCAL_NETWORK_PERMISSION_FEATURES = [
    'loopback-network',
    'local-network',
    'local-network-access',
] as const;

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

function isLoopbackRelayHostname(hostname: string): boolean {
    const normalized = hostname.trim().toLowerCase();
    if (!normalized) {
        return false;
    }

    return normalized === 'localhost'
        || normalized.endsWith('.localhost')
        || normalized === '::1'
        || /^127(?:\.\d{1,3}){3}$/.test(normalized);
}

function getRelayConnectionFailureHint(relays: string[]): string | null {
    for (const relay of relays) {
        try {
            const relayUrl = new URL(relay);
            if (
                relayUrl.protocol === 'ws:'
                && isLoopbackRelayHostname(relayUrl.hostname)
            ) {
                const iframeHint = getIframeLoopbackPermissionHint();
                const localRelayHint = '127.0.0.1/localhost points to the browser device itself, so confirm the local relay app is running and listening on that device.';

                if (iframeHint) {
                    return `${iframeHint} ${localRelayHint}`;
                }

                return `The browser is attempting the local ws:// relay, but the connection is being refused. ${localRelayHint}`;
            }
        } catch {
            continue;
        }
    }

    return null;
}

/**
 * NIP-46 connect時にリモートサイナーへ要求するパーミッション。
 * Amberなどのリモートサイナーで「アプリが要求するkindのみ許可」を選択した場合に使われる。
 * - sign_event:1 — ショートテキストノート（投稿）
 * - sign_event:42 — NIP-28 チャンネルメッセージ（パブリックチャット投稿）
 * - sign_event:27235 — NIP-98 HTTP認証（ファイルアップロード）
 */
const NIP46_REQUESTED_PERMS = 'sign_event:1,sign_event:42,sign_event:27235';

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
        };
        return await this.bunkerSigner.signEvent(template);
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

// --- NIP-46サービス ---
export class Nip46Service {
    private bunkerSigner: BunkerSigner | null = null;
    private signerAdapter: Nip46SignerAdapter | null = null;
    private userPubkey: string | null = null;
    private clientSecretKeyHex: string | null = null;
    private pool: SimplePool | null = null;

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

        console.debug('[NIP-46] connect: calling bunkerSigner.connect() with perms...');
        await Promise.race([
            this.bunkerSigner.sendRequest('connect', [bunkerPointer.pubkey, bunkerPointer.secret || '', NIP46_REQUESTED_PERMS]),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Bunker did not respond. The relay is connected but the remote signer may be offline or the secret may have expired.')), timeoutMs)
            ),
        ]);
        console.debug('[NIP-46] connect: connected successfully');

        this.userPubkey = await this.bunkerSigner.getPublicKey();
        this.signerAdapter = new Nip46SignerAdapter(this.bunkerSigner);

        return this.userPubkey;
    }

    async reconnect(session: Nip46SessionData): Promise<string> {
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

        // セッション復元時はping()を行わない。
        // Amber等のリモートサイナーはping含む全リクエストにユーザー承認が必要で、
        // タイムアウトでセッションが破棄されてしまうため。
        // リレー接続の確認はcreateConnectedPool()で行われており、
        // 実際の署名時にリモートサイナーとの通信が検証される。
        console.debug('[NIP-46] reconnect: session restored (relay connected, ping skipped)');

        this.userPubkey = session.userPubkey;
        this.signerAdapter = new Nip46SignerAdapter(this.bunkerSigner);

        return this.userPubkey;
    }

    async disconnect(): Promise<void> {
        if (this.bunkerSigner) {
            await this.bunkerSigner.close();
            this.bunkerSigner = null;
            this.signerAdapter = null;
            this.userPubkey = null;
            this.clientSecretKeyHex = null;
        }
        if (this.pool) {
            this.pool.destroy();
            this.pool = null;
        }
    }

    isConnected(): boolean {
        return this.bunkerSigner !== null && this.userPubkey !== null;
    }

    /**
     * リレー接続が生きているか確認し、切れている場合はセッションから再接続する。
     * visibilitychange でバックグラウンド復帰時に呼び出す。
     * Amber等のリモートサイナーはping含む全リクエストにユーザー承認が必要なため、
     * pingは使用せず、pool + BunkerSignerの完全再構築で確実な接続復元を行う。
     *
     * バックグラウンド移行時にWebSocketが切断されると、SimplePool内のリレーオブジェクトが
     * 削除され（enableReconnect=false時）、BunkerSignerの内部サブスクリプションも失われる。
     * pool.ensureRelay()で再接続してもゾンビ接続（readyState=OPENだが実際は切断済み）の
     * 可能性があるため、常にpool + BunkerSignerを完全に再構築する。
     */
    async ensureConnection(): Promise<boolean> {
        if (!this.bunkerSigner || !this.userPubkey || !this.clientSecretKeyHex) return false;

        // 再構築に必要なデータを事前に保存（close()後もアクセスできるように）
        const relays = [...this.bunkerSigner.bp.relays];
        const remotePubkey = this.bunkerSigner.bp.pubkey;
        const clientSecretKeyHex = this.clientSecretKeyHex;

        try {
            // 古い signer と pool を閉じる
            try { await this.bunkerSigner.close(); } catch { /* ignore */ }
            if (this.pool) {
                this.pool.destroy();
                this.pool = null;
            }

            // 新しい pool + BunkerSigner を作成
            const clientSecretKey = hexToBytes(clientSecretKeyHex);
            const bp = {
                pubkey: remotePubkey,
                relays,
                secret: null,
            };
            const { pool, connectedRelays } = await createConnectedPool(relays);
            this.pool = pool;
            this.bunkerSigner = BunkerSigner.fromBunker(clientSecretKey, {
                ...bp,
                relays: connectedRelays,
            }, {
                pool,
                onauth: (url: string) => { console.debug('[NIP-46] onauth URL:', url); },
            });
            this.signerAdapter = new Nip46SignerAdapter(this.bunkerSigner);
            console.debug('[NIP-46] ensureConnection: pool + BunkerSigner rebuilt');
            return true;
        } catch {
            return false;
        }
    }

    getSigner(): Nip46SignerAdapter | null {
        return this.signerAdapter;
    }

    getUserPubkey(): string | null {
        return this.userPubkey;
    }

    saveSession(storage: Storage, pubkeyHex?: string): void {
        if (!this.bunkerSigner || !this.userPubkey || !this.clientSecretKeyHex) return;

        const session: Nip46SessionData = {
            clientSecretKeyHex: this.clientSecretKeyHex,
            remoteSignerPubkey: this.bunkerSigner.bp.pubkey,
            relays: this.bunkerSigner.bp.relays,
            userPubkey: this.userPubkey,
        };
        const key = pubkeyHex
            ? STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX + pubkeyHex
            : STORAGE_KEYS.NOSTR_NIP46_SESSION_LEGACY;
        storage.setItem(key, JSON.stringify(session));
    }

    static loadSession(storage: Storage, pubkeyHex?: string): Nip46SessionData | null {
        const key = pubkeyHex
            ? STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX + pubkeyHex
            : STORAGE_KEYS.NOSTR_NIP46_SESSION_LEGACY;
        const data = storage.getItem(key);
        if (!data) return null;
        try {
            return JSON.parse(data) as Nip46SessionData;
        } catch {
            return null;
        }
    }

    static clearSession(storage: Storage, pubkeyHex?: string): void {
        const key = pubkeyHex
            ? STORAGE_KEYS.NOSTR_NIP46_SESSION_PREFIX + pubkeyHex
            : STORAGE_KEYS.NOSTR_NIP46_SESSION_LEGACY;
        storage.removeItem(key);
    }
}

export const nip46Service = new Nip46Service();
