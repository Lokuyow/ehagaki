import { writable, derived, type Readable, get } from "svelte/store";
import { setNostrLoginAuth, clearAuthState } from "./stores";
import { derivePublicKeyFromNsec, isValidNsec } from "./utils";
import type { PublicKeyData } from "./types";
import { nip19 } from "nostr-tools";

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

export class PublicKeyState {
  private _nsecStore = writable<string>("");
  private _dataStore = writable<PublicKeyData>({ hex: "", npub: "", nprofile: "" });
  private _isValidStore = writable(false);
  private _isNostrLoginStore = writable(false);

  readonly nsec: Readable<string> = { subscribe: this._nsecStore.subscribe };
  readonly data: Readable<PublicKeyData> = { subscribe: this._dataStore.subscribe };
  readonly isValid: Readable<boolean> = { subscribe: this._isValidStore.subscribe };
  readonly isNostrLogin: Readable<boolean> = { subscribe: this._isNostrLoginStore.subscribe };

  readonly hex = derived(this._dataStore, ($data) => $data.hex);
  readonly npub = derived(this._dataStore, ($data) => $data.npub);
  readonly nprofile = derived(this._dataStore, ($data) => $data.nprofile);

  constructor() {
    this._nsecStore.subscribe((nsec) => this.updateFromNsec(nsec));
  }

  setNsec(nsec: string): void {
    const sanitizedNsec = nsec?.trim() || "";
    this._nsecStore.set(sanitizedNsec);
    this._isNostrLoginStore.set(false);
  }

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

      setNostrLoginAuth(auth.pubkey, npub, nprofile);
    } catch (error) {
      console.error("Failed to set NostrLogin auth:", error);
      this.clear();
    }
  }

  private updateFromNsec(nsec: string): void {
    if (!nsec || !isValidNsec(nsec)) {
      this._resetState();
      return;
    }

    try {
      const derivedData = derivePublicKeyFromNsec(nsec);
      if (derivedData.hex) {
        this._dataStore.set(derivedData);
        this._isValidStore.set(true);
        // 入力中はグローバル認証状態を更新しない（保存時にのみ更新）
        // setNsecAuth(derivedData.hex, derivedData.npub, derivedData.nprofile);
      } else {
        this._resetState();
      }
    } catch (error) {
      console.error("Failed to derive public key from nsec:", error);
      this._resetState();
    }
  }

  private _resetState(): void {
    this._dataStore.set({ hex: "", npub: "", nprofile: "" });
    this._isValidStore.set(false);
  }

  clear(): void {
    this._nsecStore.set("");
    this._isNostrLoginStore.set(false);
    clearAuthState();
  }

  // パフォーマンス改善: get()を使用
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

interface KeyManagerError {
  type: 'storage' | 'network' | 'validation';
  message: string;
  originalError?: unknown;
}

export const keyManager = {
  isValidNsec,
  derivePublicKey: derivePublicKeyFromNsec,

  saveToStorage(key: string): { success: boolean; error?: KeyManagerError } {
    if (!key?.trim()) {
      return {
        success: false,
        error: { type: 'validation', message: 'Key cannot be empty' }
      };
    }

    try {
      localStorage.setItem("nostr-secret-key", key.trim());
      return { success: true };
    } catch (error) {
      const keyError: KeyManagerError = {
        type: 'storage',
        message: '鍵の保存に失敗しました',
        originalError: error
      };
      console.error("鍵の保存に失敗:", error);
      return { success: false, error: keyError };
    }
  },

  loadFromStorage(): string | null {
    try {
      return localStorage.getItem("nostr-secret-key");
    } catch (error) {
      console.error("鍵の読み込みに失敗:", error);
      return null;
    }
  },

  hasStoredKey(): boolean {
    try {
      return !!localStorage.getItem("nostr-secret-key");
    } catch (error) {
      console.error("ストレージアクセスエラー:", error);
      return false;
    }
  },

  isWindowNostrAvailable(): boolean {
    return typeof window !== 'undefined' &&
      'nostr' in window &&
      typeof window.nostr === 'object' &&
      window.nostr !== null &&
      typeof window.nostr.getPublicKey === 'function';
  },

  async getPublicKeyFromWindowNostr(): Promise<{ success: boolean; pubkey?: string; error?: KeyManagerError }> {
    if (!this.isWindowNostrAvailable()) {
      return {
        success: false,
        error: { type: 'validation', message: 'window.nostr is not available' }
      };
    }

    try {
      const pubkey = await window.nostr.getPublicKey();
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
};

