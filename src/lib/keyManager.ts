import { writable, derived, type Readable, get } from "svelte/store";
import type { PublicKeyData } from "./types";
import { nip19 } from "nostr-tools";

// テスト環境を考慮したインポート
let setNostrLoginAuth: ((pubkey: string, npub: string, nprofile: string) => void) | undefined;
let clearAuthState: (() => void) | undefined;
let secretKeyStore: { value: string | null; set: (value: string | null) => void };
let derivePublicKeyFromNsec: (nsec: string) => PublicKeyData;
let isValidNsec: (key: string) => boolean;
let toNpub: (pubkey: string) => string;

try {
  const appStore = await import("../stores/appStore.svelte");
  setNostrLoginAuth = appStore.setNostrLoginAuth;
  clearAuthState = appStore.clearAuthState;
  secretKeyStore = appStore.secretKeyStore;

  const appUtils = await import("./utils/appUtils");
  derivePublicKeyFromNsec = appUtils.derivePublicKeyFromNsec;
  isValidNsec = appUtils.isValidNsec;
  toNpub = appUtils.toNpub;
} catch (error) {
  // テスト環境などでインポートが失敗した場合のフォールバック
  console.warn('Failed to import dependencies:', error);
  secretKeyStore = { value: null, set: () => { } };
  derivePublicKeyFromNsec = () => ({ hex: "", npub: "", nprofile: "" });
  isValidNsec = () => false;
  toNpub = () => "";
}

declare global {
  interface Window {
    nostr: {
      getPublicKey(): Promise<string>;
    };
  }
}

export interface NostrLoginAuth {
  type: 'login' | 'signup' | 'logout';
  pubkey?: string;
  npub?: string;
  otpData?: unknown;
}

// --- 依存性注入用のインターフェース ---
export interface KeyManagerDeps {
  localStorage?: Storage;
  console?: Console;
  secretKeyStore?: {
    value: string | null;
    set: (value: string | null) => void;
  };
  window?: Window;
  setNostrLoginAuthFn?: (pubkey: string, npub: string, nprofile: string) => void;
  clearAuthStateFn?: () => void;
}

export interface KeyManagerError {
  type: 'storage' | 'network' | 'validation';
  message: string;
  originalError?: unknown;
}

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

  saveToStorage(key: string): { success: boolean; error?: KeyManagerError } {
    if (!key?.trim()) {
      return {
        success: false,
        error: { type: 'validation', message: 'Key cannot be empty' }
      };
    }
    try {
      const trimmedKey = key.trim();
      this.localStorage.setItem("nostr-secret-key", trimmedKey);
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

  loadFromStorage(): string | null {
    // まずストアから取得を試行
    let key = this.secretKeyStore.value;
    if (key) return key;

    // ストアが空の場合はローカルストレージから取得してストアに保存
    try {
      key = this.localStorage.getItem("nostr-secret-key");
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

  hasStoredKey(): boolean {
    try {
      return !!this.localStorage.getItem("nostr-secret-key");
    } catch (error) {
      this.console.error("ストレージアクセスエラー:", error);
      return false;
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
  // --- nsec（秘密鍵）管理 ---
  private _nsecStore = writable<string>("");
  // 公開鍵データ
  private _dataStore = writable<PublicKeyData>({ hex: "", npub: "", nprofile: "" });
  // バリデーション状態
  private _isValidStore = writable(false);
  // nostr-login認証状態
  private _isNostrLoginStore = writable(false);

  readonly nsec: Readable<string> = { subscribe: this._nsecStore.subscribe };
  readonly data: Readable<PublicKeyData> = { subscribe: this._dataStore.subscribe };
  readonly isValid: Readable<boolean> = { subscribe: this._isValidStore.subscribe };
  readonly isNostrLogin: Readable<boolean> = { subscribe: this._isNostrLoginStore.subscribe };

  readonly hex = derived(this._dataStore, ($data) => $data.hex);
  readonly npub = derived(this._dataStore, ($data) => $data.npub);
  readonly nprofile = derived(this._dataStore, ($data) => $data.nprofile);

  constructor(
    private deps: {
      setNostrLoginAuthFn?: (pubkey: string, npub: string, nprofile: string) => void;
      clearAuthStateFn?: () => void;
    } = {}
  ) {
    // nsecが変更されたら自動的に公開鍵情報を更新
    this._nsecStore.subscribe((nsec) => this.updateFromNsec(nsec));
  }

  // --- nsec（秘密鍵）セット ---
  setNsec(nsec: string): void {
    const sanitizedNsec = nsec?.trim() || "";
    this._nsecStore.set(sanitizedNsec);
    this._isNostrLoginStore.set(false);
  }

  // --- nostr-login認証セット ---
  setNostrLoginAuth(auth: NostrLoginAuth): void {
    if (auth.type === 'logout') {
      this.clear();
      return;
    }
    if (!auth.pubkey) {
      console.warn("NostrLoginAuth: pubkey is required for login/signup");
      return;
    }
    try {
      const npub = auth.npub || nip19.npubEncode(auth.pubkey);
      const nprofile = nip19.nprofileEncode({ pubkey: auth.pubkey, relays: [] });
      this._dataStore.set({ hex: auth.pubkey, npub, nprofile });
      this._isValidStore.set(true);
      this._isNostrLoginStore.set(true);
      this._nsecStore.set("");

      // 依存性注入されたコールバックを使用
      if (this.deps.setNostrLoginAuthFn) {
        this.deps.setNostrLoginAuthFn(auth.pubkey, npub, nprofile);
      }
    } catch (error) {
      console.error("Failed to set NostrLogin auth:", error);
      this.clear();
    }
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
        this._dataStore.set(derivedData);
        this._isValidStore.set(true);
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
    this._dataStore.set({ hex: "", npub: "", nprofile: "" });
    this._isValidStore.set(false);
  }

  // --- 全クリア ---
  clear(): void {
    this._nsecStore.set("");
    this._isNostrLoginStore.set(false);

    // 依存性注入されたコールバックを使用
    if (this.deps.clearAuthStateFn) {
      this.deps.clearAuthStateFn();
    }
  }

  // --- 現在値取得（パフォーマンス用） ---
  get currentIsValid(): boolean {
    return get(this._isValidStore);
  }
  get currentHex(): string {
    return get(this.hex);
  }
  get currentIsNostrLogin(): boolean {
    return get(this._isNostrLoginStore);
  }
}

// --- メインのKeyManager（依存性を組み合わせ） ---
export class KeyManager {
  private storage: KeyStorage;
  private externalAuth: ExternalAuthChecker;

  constructor(deps: KeyManagerDeps = {}) {
    // デフォルト依存性の設定
    const localStorage = deps.localStorage || (typeof window !== 'undefined' ? window.localStorage : {} as Storage);
    const console = deps.console || (typeof window !== 'undefined' ? window.console : {} as Console);
    const secretKeyStoreObj = deps.secretKeyStore || secretKeyStore;
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
  saveToStorage(key: string): { success: boolean; error?: KeyManagerError } {
    return this.storage.saveToStorage(key);
  }

  loadFromStorage(): string | null {
    return this.storage.loadFromStorage();
  }

  getFromStore(): string | null {
    return this.storage.getFromStore();
  }

  hasStoredKey(): boolean {
    return this.storage.hasStoredKey();
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
  setNostrLoginAuthFn: setNostrLoginAuth,
  clearAuthStateFn: clearAuthState
});

