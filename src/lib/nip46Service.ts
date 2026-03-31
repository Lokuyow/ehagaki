import { BunkerSigner, parseBunkerInput, BUNKER_REGEX } from 'nostr-tools/nip46';
import { SimplePool, useWebSocketImplementation } from 'nostr-tools/pool';
import { bytesToHex, hexToBytes } from 'nostr-tools/utils';
import { generateSecretKey } from 'nostr-tools/pure';
import type { Nip46SessionData } from './types';

export { BUNKER_REGEX };

const NIP46_STORAGE_KEY = 'nostr-nip46-session';
const RELAY_CONNECT_TIMEOUT_MS = 5000;

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
    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
        let outData = data;
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
 * リレーへのWebSocket接続を事前確認し、接続済みのSimplePoolを返す。
 * BunkerSigner内部でSimplePoolが新規生成されるとリレー接続の成否が不透明になるため、
 * 事前接続済みのpoolを渡す。
 */
async function createConnectedPool(relays: string[]): Promise<SimplePool> {
    // NIP-46用WebSocket(デバッグログ + limit:0パッチ)を設定
    const origWs = globalThis.WebSocket;
    useWebSocketImplementation(Nip46WebSocket);
    const pool = new SimplePool();
    useWebSocketImplementation(origWs);
    try {
        for (const relay of relays) {
            console.debug('[NIP-46] connecting to relay:', relay);
            await pool.ensureRelay(relay, { connectionTimeout: RELAY_CONNECT_TIMEOUT_MS });
            console.debug('[NIP-46] relay connected:', relay);
        }
    } catch (err) {
        pool.destroy();
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Relay connection failed: ${msg}`);
    }
    return pool;
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
        const pool = await createConnectedPool(bp.relays);
        this.pool = pool;

        const clientSecretKey = generateSecretKey();
        this.clientSecretKeyHex = bytesToHex(clientSecretKey);
        console.debug('[NIP-46] connect: clientSecretKeyHex =', this.clientSecretKeyHex.substring(0, 8) + '…');

        this.bunkerSigner = BunkerSigner.fromBunker(clientSecretKey, bp, {
            pool,
            onauth: (url: string) => { console.debug('[NIP-46] onauth URL:', url); },
        });
        console.debug('[NIP-46] connect: BunkerSigner created, subscription initiated (check WS logs for REQ)');

        console.debug('[NIP-46] connect: calling bunkerSigner.connect()...');
        await Promise.race([
            this.bunkerSigner.connect(),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Bunker did not respond. The relay is connected but the remote signer may be offline or the secret may have expired.')), timeoutMs)
            ),
        ]);
        console.debug('[NIP-46] connect: connected successfully');

        this.userPubkey = await this.bunkerSigner.getPublicKey();
        this.signerAdapter = new Nip46SignerAdapter(this.bunkerSigner);

        return this.userPubkey;
    }

    async reconnect(session: Nip46SessionData, timeoutMs: number = 10000): Promise<string> {
        const clientSecretKey = hexToBytes(session.clientSecretKeyHex);
        const bp = {
            pubkey: session.remoteSignerPubkey,
            relays: session.relays,
            secret: null,
        };

        // リレーへの接続を事前に確認
        const pool = await createConnectedPool(bp.relays);
        this.pool = pool;

        this.clientSecretKeyHex = session.clientSecretKeyHex;
        this.bunkerSigner = BunkerSigner.fromBunker(clientSecretKey, bp, {
            pool,
            onauth: (url: string) => { console.debug('[NIP-46] onauth URL:', url); },
        });

        // connect() がハングしないようタイムアウトを設ける
        await Promise.race([
            this.bunkerSigner.connect(),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('NIP-46 reconnect timeout')), timeoutMs)
            ),
        ]);

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
     * 接続が生きているか確認し、切れている場合はセッションから再接続する。
     * visibilitychange でバックグラウンド復帰時に呼び出す。
     */
    async ensureConnection(storage?: Storage): Promise<boolean> {
        if (!this.bunkerSigner || !this.userPubkey) return false;

        try {
            // ping で接続確認（タイムアウト付き）
            await Promise.race([
                this.bunkerSigner.ping(),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('ping timeout')), 5000)
                ),
            ]);
            return true;
        } catch {
            // 接続切れ → セッションから再接続
            const resolvedStorage = storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);
            if (!resolvedStorage) return false;

            const session = Nip46Service.loadSession(resolvedStorage);
            if (!session) return false;

            try {
                // 古い signer を静かに閉じる
                try { await this.bunkerSigner.close(); } catch { /* ignore */ }
                if (this.pool) {
                    this.pool.destroy();
                    this.pool = null;
                }

                // 新しい pool + BunkerSigner を作成し接続
                const clientSecretKey = hexToBytes(session.clientSecretKeyHex);
                const bp = {
                    pubkey: session.remoteSignerPubkey,
                    relays: session.relays,
                    secret: null,
                };
                const pool = await createConnectedPool(bp.relays);
                this.pool = pool;
                this.bunkerSigner = BunkerSigner.fromBunker(clientSecretKey, bp, {
                    pool,
                    onauth: (url: string) => { console.debug('[NIP-46] onauth URL:', url); },
                });
                await this.bunkerSigner.connect();
                this.signerAdapter = new Nip46SignerAdapter(this.bunkerSigner);
                return true;
            } catch {
                return false;
            }
        }
    }

    getSigner(): Nip46SignerAdapter | null {
        return this.signerAdapter;
    }

    getUserPubkey(): string | null {
        return this.userPubkey;
    }

    saveSession(storage: Storage): void {
        if (!this.bunkerSigner || !this.userPubkey || !this.clientSecretKeyHex) return;

        const session: Nip46SessionData = {
            clientSecretKeyHex: this.clientSecretKeyHex,
            remoteSignerPubkey: this.bunkerSigner.bp.pubkey,
            relays: this.bunkerSigner.bp.relays,
            userPubkey: this.userPubkey,
        };
        storage.setItem(NIP46_STORAGE_KEY, JSON.stringify(session));
    }

    static loadSession(storage: Storage): Nip46SessionData | null {
        const data = storage.getItem(NIP46_STORAGE_KEY);
        if (!data) return null;
        try {
            return JSON.parse(data) as Nip46SessionData;
        } catch {
            return null;
        }
    }

    static clearSession(storage: Storage): void {
        storage.removeItem(NIP46_STORAGE_KEY);
    }
}

export const nip46Service = new Nip46Service();
