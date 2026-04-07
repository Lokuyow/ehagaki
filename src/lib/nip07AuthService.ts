import { nip19 } from "nostr-tools";
import { waitNostr } from "nip07-awaiter";
import type { AuthResult, PublicKeyData } from "./types";

// --- NIP-07（ブラウザ拡張機能）認証サービス ---

/**
 * window.nostrの検出とNIP-07認証を担当するサービス
 * nip07-awaiterを利用してブラウザ拡張機能の注入タイミングを待機
 */
export class Nip07AuthService {
    /**
     * 捕捉したwindow.nostrの参照。
     */
    private capturedNostr: any;

    /** テスト用: waitNostrの代替関数 */
    private waitNostrFn: (timeout: number) => Promise<any>;

    constructor(
        private windowObj: Window = typeof window !== 'undefined' ? window : {} as Window,
        private console: Console = typeof window !== 'undefined' ? window.console : {} as Console,
        waitNostrFn?: (timeout: number) => Promise<any>,
    ) {
        // 構築時点でwindow.nostrを捕捉する
        this.capturedNostr = this.getValidNostr();
        this.waitNostrFn = waitNostrFn || waitNostr;
    }

    /**
     * windowObj.nostrが有効なNIP-07インターフェースを持つか確認し、持つなら返す
     */
    private getValidNostr(): any {
        const nostr = (this.windowObj as any)?.nostr;
        if (
            typeof nostr === 'object' &&
            nostr !== null &&
            typeof nostr.getPublicKey === 'function' &&
            typeof nostr.signEvent === 'function'
        ) {
            return nostr;
        }
        return null;
    }

    /**
     * 捕捉済みのwindow.nostrが利用可能かどうかを返す
     */
    isAvailable(): boolean {
        return this.capturedNostr !== null;
    }

    /**
     * window.nostrが利用可能になるまでnip07-awaiterで待機し、見つかり次第capturedNostrを更新する。
     * nos2x等のdocument_endで注入される拡張機能にも対応。
     */
    async waitForExtension(maxWaitMs: number = 3000): Promise<boolean> {
        if (this.isAvailable()) return true;

        const nostr = await this.waitNostrFn(maxWaitMs);
        if (nostr) {
            this.capturedNostr = nostr;
            return true;
        }
        return false;
    }

    /**
     * NIP-07拡張機能から公開鍵を取得し、npub/nprofileを導出
     */
    async authenticate(): Promise<AuthResult & { pubkeyData?: PublicKeyData }> {
        if (!this.isAvailable()) {
            return { success: false, error: 'nip07_not_available' };
        }

        try {
            const pubkeyHex: string = await this.capturedNostr.getPublicKey();

            if (!pubkeyHex) {
                return { success: false, error: 'nip07_no_pubkey' };
            }

            const npub = nip19.npubEncode(pubkeyHex);
            const nprofile = nip19.nprofileEncode({ pubkey: pubkeyHex, relays: [] });

            return {
                success: true,
                pubkeyHex,
                pubkeyData: { hex: pubkeyHex, npub, nprofile },
            };
        } catch (error) {
            this.console.error('NIP-07認証エラー:', error);
            return { success: false, error: 'nip07_auth_error' };
        }
    }

    /**
     * NIP-07経由でイベントに署名
     */
    async signEvent(event: any): Promise<any> {
        if (!this.isAvailable()) {
            throw new Error('NIP-07 extension is not available');
        }
        return await this.capturedNostr.signEvent(event);
    }
}
