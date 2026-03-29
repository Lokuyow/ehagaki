import { BunkerSigner, parseBunkerInput, BUNKER_REGEX } from 'nostr-tools/nip46';
import { bytesToHex, hexToBytes } from 'nostr-tools/utils';
import { generateSecretKey } from 'nostr-tools/pure';
import type { Nip46SessionData } from './types';

export { BUNKER_REGEX };

const NIP46_STORAGE_KEY = 'nostr-nip46-session';

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

// --- NIP-46サービス ---
export class Nip46Service {
    private bunkerSigner: BunkerSigner | null = null;
    private signerAdapter: Nip46SignerAdapter | null = null;
    private userPubkey: string | null = null;
    private clientSecretKeyHex: string | null = null;

    async connect(bunkerUrl: string): Promise<string> {
        const bp = await parseBunkerInput(bunkerUrl);
        if (!bp) {
            throw new Error('Invalid bunker URL');
        }

        const clientSecretKey = generateSecretKey();
        this.clientSecretKeyHex = bytesToHex(clientSecretKey);

        this.bunkerSigner = BunkerSigner.fromBunker(clientSecretKey, bp);
        await this.bunkerSigner.connect();

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

        this.clientSecretKeyHex = session.clientSecretKeyHex;
        this.bunkerSigner = BunkerSigner.fromBunker(clientSecretKey, bp);
        await this.bunkerSigner.connect();

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
    }

    isConnected(): boolean {
        return this.bunkerSigner !== null && this.userPubkey !== null;
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
