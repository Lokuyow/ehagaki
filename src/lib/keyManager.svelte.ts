import type { PublicKeyData, KeyManagerDeps, KeyManagerError } from "./types";
import { isValidNsec, derivePublicKeyFromNsec, toNpub } from './utils/nostrUtils';
import { STORAGE_KEYS } from './constants';
import { secretKeyStore } from '../stores/authStore.svelte';

// --- 純粋関数（テストしやすい） ---
export class KeyValidator {
    static isValidNsec(key: string): boolean {
        return isValidNsec(key);
    }

    static derivePublicKey(secretKey: string): PublicKeyData {
        return derivePublicKeyFromNsec(secretKey);
    }

    static pubkeyToNpub(pubkey: string): string {
        try {
            if (!pubkey) return '';
            return toNpub(pubkey);
        } catch (error) {
            console.error('pubkeyからnpubへの変換エラー:', error);
            return '';
        }
    }
}

// --- ストレージ操作の分離 ---
export class KeyStorage {
    constructor(
        private localStorage: Storage,
        private console: Console,
        private secretKeyStore: { value: string | null; set: (value: string | null) => void }
    ) { }

    private getStorageKey(pubkeyHex?: string): string {
        return pubkeyHex
            ? STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX + pubkeyHex
            : STORAGE_KEYS.NOSTR_SECRET_KEY_LEGACY;
    }

    saveToStorage(key: string, pubkeyHex?: string): { success: boolean; error?: KeyManagerError } {
        if (!key?.trim()) {
            return {
                success: false,
                error: { type: 'validation', message: 'Key cannot be empty' }
            };
        }
        try {
            const trimmedKey = key.trim();
            this.localStorage.setItem(this.getStorageKey(pubkeyHex), trimmedKey);
            this.secretKeyStore.set(trimmedKey);
            return { success: true };
        } catch (error) {
            const keyError: KeyManagerError = {
                type: 'storage',
                message: '鍵の保存に失敗しました',
                originalError: error
            };
            this.console.error("鍵の保存に失敗:", error);
            return { success: false, error: keyError };
        }
    }

    loadFromStorage(pubkeyHex?: string): string | null {
        // pubkeyHex未指定の場合のみストアから取得を試行
        if (!pubkeyHex) {
            let key = this.secretKeyStore.value;
            if (key) return key;
        }

        try {
            const key = this.localStorage.getItem(this.getStorageKey(pubkeyHex));
            if (key) {
                this.secretKeyStore.set(key);
            }
            return key;
        } catch (error) {
            this.console.error("鍵の読み込みに失敗:", error);
            return null;
        }
    }

    getFromStore(): string | null {
        return this.secretKeyStore.value;
    }

    hasStoredKey(pubkeyHex?: string): boolean {
        try {
            return !!this.localStorage.getItem(this.getStorageKey(pubkeyHex));
        } catch (error) {
            this.console.error("ストレージアクセスエラー:", error);
            return false;
        }
    }

    removeFromStorage(pubkeyHex: string): void {
        try {
            this.localStorage.removeItem(STORAGE_KEYS.NOSTR_SECRET_KEY_PREFIX + pubkeyHex);
        } catch (error) {
            this.console.error("鍵の削除に失敗:", error);
        }
    }
}

// --- 外部認証の分離 ---
export class ExternalAuthChecker {
    constructor(private window?: Window) { }

    isWindowNostrAvailable(): boolean {
        return typeof this.window !== 'undefined' &&
            'nostr' in this.window &&
            typeof this.window.nostr === 'object' &&
            this.window.nostr !== null &&
            typeof this.window.nostr.getPublicKey === 'function';
    }

    async getPublicKeyFromWindowNostr(): Promise<{ success: boolean; pubkey?: string; error?: KeyManagerError }> {
        if (!this.isWindowNostrAvailable() || !this.window?.nostr) {
            return {
                success: false,
                error: { type: 'validation', message: 'window.nostr is not available' }
            };
        }
        try {
            const pubkey = await this.window.nostr.getPublicKey();
            return { success: true, pubkey };
        } catch (error) {
            const keyError: KeyManagerError = {
                type: 'network',
                message: 'window.nostrから公開鍵の取得に失敗しました',
                originalError: error
            };
            console.error("window.nostrから公開鍵の取得に失敗:", error);
            return { success: false, error: keyError };
        }
    }
}

export class PublicKeyState {
    // --- Svelte 5 runesベースのリアクティブ状態 ---
    private _nsec = $state("");
    private _data = $state<PublicKeyData>({ hex: "", npub: "", nprofile: "" });
    private _isValid = $state(false);

    // --- 公開ゲッター（コンポーネントから $derived で参照可能） ---
    get nsec() { return this._nsec; }
    get data() { return this._data; }
    get isValid() { return this._isValid; }
    get hex() { return this._data.hex; }
    get npub() { return this._data.npub; }
    get nprofile() { return this._data.nprofile; }

    // --- 後方互換 / パフォーマンス用のゲッター（getを使わない同期アクセス） ---
    get currentIsValid(): boolean { return this._isValid; }
    get currentHex(): string { return this._data.hex; }

    constructor(
        private deps: {
            clearAuthStateFn?: () => void;
        } = {}
    ) { }

    // --- nsec（秘密鍵）セット ---
    setNsec(nsec: string): void {
        const sanitizedNsec = nsec?.trim() || "";
        this._nsec = sanitizedNsec;
        // subscribe コールバックの代わりに直接更新
        this.updateFromNsec(sanitizedNsec);
    }

    // --- nsecから公開鍵情報を導出 ---
    private updateFromNsec(nsec: string): void {
        if (!nsec || !KeyValidator.isValidNsec(nsec)) {
            this._resetState();
            return;
        }
        try {
            const derivedData = KeyValidator.derivePublicKey(nsec);
            if (derivedData.hex) {
                this._data = derivedData;
                this._isValid = true;
                // 入力中はグローバル認証状態を更新しない（保存時にのみ更新）
            } else {
                this._resetState();
            }
        } catch (error) {
            console.error("Failed to derive public key from nsec:", error);
            this._resetState();
        }
    }

    // --- 内部状態リセット ---
    private _resetState(): void {
        this._data = { hex: "", npub: "", nprofile: "" };
        this._isValid = false;
    }

    // --- 全クリア ---
    clear(): void {
        this._nsec = "";

        // 依存性注入されたコールバックを優先使用
        if (this.deps.clearAuthStateFn) {
            this.deps.clearAuthStateFn();
        }
    }
}

// --- メインのKeyManagerクラス ---
export class KeyManager {
    private storage: KeyStorage;
    private externalAuth: ExternalAuthChecker;

    constructor(deps: KeyManagerDeps = {}) {
        // デフォルト依存性の設定
        const localStorage = deps.localStorage || (typeof window !== 'undefined' ? window.localStorage : {} as Storage);
        const console = deps.console || (typeof window !== 'undefined' ? window.console : {} as Console);
        const secretKeyStoreObj = deps.secretKeyStore || { value: null, set: () => { } };
        const windowObj = deps.window || (typeof window !== 'undefined' ? window : undefined);

        this.storage = new KeyStorage(localStorage, console, secretKeyStoreObj);
        this.externalAuth = new ExternalAuthChecker(windowObj);
    }

    // --- バリデーション ---
    isValidNsec(key: string): boolean {
        return KeyValidator.isValidNsec(key);
    }

    derivePublicKey(secretKey: string): PublicKeyData {
        return KeyValidator.derivePublicKey(secretKey);
    }

    pubkeyToNpub(pubkey: string): string {
        return KeyValidator.pubkeyToNpub(pubkey);
    }

    // --- ストレージ操作 ---
    saveToStorage(key: string, pubkeyHex?: string): { success: boolean; error?: KeyManagerError } {
        return this.storage.saveToStorage(key, pubkeyHex);
    }

    loadFromStorage(pubkeyHex?: string): string | null {
        return this.storage.loadFromStorage(pubkeyHex);
    }

    getFromStore(): string | null {
        return this.storage.getFromStore();
    }

    hasStoredKey(pubkeyHex?: string): boolean {
        return this.storage.hasStoredKey(pubkeyHex);
    }

    removeFromStorage(pubkeyHex: string): void {
        return this.storage.removeFromStorage(pubkeyHex);
    }

    // --- 外部認証 ---
    isWindowNostrAvailable(): boolean {
        return this.externalAuth.isWindowNostrAvailable();
    }

    async getPublicKeyFromWindowNostr(): Promise<{ success: boolean; pubkey?: string; error?: KeyManagerError }> {
        return await this.externalAuth.getPublicKeyFromWindowNostr();
    }

    // --- テスト用の内部コンポーネントへのアクセス ---
    getStorage(): KeyStorage {
        return this.storage;
    }

    getExternalAuth(): ExternalAuthChecker {
        return this.externalAuth;
    }
}

// --- 既存のkeyManagerインスタンス（後方互換性のため） ---
export const keyManager = new KeyManager({
    secretKeyStore
});
