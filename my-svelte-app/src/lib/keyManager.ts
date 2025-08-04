import { writable, derived, type Readable } from "svelte/store";
import { setNsecAuth, setNostrLoginAuth, clearAuthState } from "./stores";
import { derivePublicKeyFromNsec, isValidNsec, type PublicKeyData } from "./utils";
import { nip19 } from "nostr-tools";

declare global {
  interface Window {
    nostr: {
      getPublicKey(): Promise<string>;
    };
  }
}

// nostr-login認証状態の型定義
export interface NostrLoginAuth {
  type: 'login' | 'signup' | 'logout';
  pubkey?: string;
  npub?: string;
  otpData?: any;
}

// 公開鍵状態を管理するクラス（リアクティブ対応）
export class PublicKeyState {
  private _nsecStore = writable<string>("");
  private _dataStore = writable<PublicKeyData>({ hex: "", npub: "", nprofile: "" });
  private _isValidStore = writable<boolean>(false);
  private _isNostrLoginStore = writable<boolean>(false);

  // リーダブルストアとして公開
  readonly nsec: Readable<string> = { subscribe: this._nsecStore.subscribe };
  readonly data: Readable<PublicKeyData> = { subscribe: this._dataStore.subscribe };
  readonly isValid: Readable<boolean> = { subscribe: this._isValidStore.subscribe };
  readonly isNostrLogin: Readable<boolean> = { subscribe: this._isNostrLoginStore.subscribe };

  // 派生ストア
  readonly hex = derived(this._dataStore, ($data) => $data.hex);
  readonly npub = derived(this._dataStore, ($data) => $data.npub);
  readonly nprofile = derived(this._dataStore, ($data) => $data.nprofile);

  constructor() {
    // nsecの変更を監視して自動的に公開鍵を更新
    this._nsecStore.subscribe((nsec) => {
      this.updateFromNsec(nsec);
    });
  }

  // nsecを設定（リアクティブに更新される）
  setNsec(nsec: string): void {
    this._nsecStore.set(nsec || "");
    this._isNostrLoginStore.set(false);
  }

  // nostr-loginからの認証情報を設定
  setNostrLoginAuth(auth: NostrLoginAuth): void {
    if (auth.type === 'logout') {
      this.clear();
      return;
    }

    if (auth.pubkey) {
      const npub = auth.npub || nip19.npubEncode(auth.pubkey);
      const nprofile = nip19.nprofileEncode({ pubkey: auth.pubkey, relays: [] });

      this._dataStore.set({
        hex: auth.pubkey,
        npub,
        nprofile
      });
      this._isValidStore.set(true);
      this._isNostrLoginStore.set(true);
      this._nsecStore.set(""); // nostr-loginの場合はnsecは空

      // グローバル認証状態を更新
      setNostrLoginAuth(auth.pubkey, npub, nprofile);
    }
  }

  private updateFromNsec(nsec: string): void {
    if (!nsec) {
      this._dataStore.set({ hex: "", npub: "", nprofile: "" });
      this._isValidStore.set(false);
      return;
    }

    if (!isValidNsec(nsec)) {
      this._dataStore.set({ hex: "", npub: "", nprofile: "" });
      this._isValidStore.set(false);
      return;
    }

    const derivedData = derivePublicKeyFromNsec(nsec);
    if (derivedData.hex) {
      this._dataStore.set(derivedData);
      this._isValidStore.set(true);

      // グローバル認証状態を更新
      setNsecAuth(derivedData.hex, derivedData.npub, derivedData.nprofile);
    } else {
      this._dataStore.set({ hex: "", npub: "", nprofile: "" });
      this._isValidStore.set(false);
    }
  }

  clear(): void {
    this._nsecStore.set("");
    this._isNostrLoginStore.set(false);
    // グローバル認証状態をクリア
    clearAuthState();
  }

  // 現在の値を同期的に取得（コンポーネント外での使用用）
  get currentIsValid(): boolean {
    let value = false;
    this.isValid.subscribe(val => value = val)();
    return value;
  }

  get currentHex(): string {
    let value = "";
    this.hex.subscribe(val => value = val)();
    return value;
  }

  get currentIsNostrLogin(): boolean {
    let value = false;
    this.isNostrLogin.subscribe(val => value = val)();
    return value;
  }
}

export const keyManager = {
  /**
   * 秘密鍵がnsec形式として有効かチェックする
   */
  isValidNsec,

  /**
   * nsec形式の秘密鍵から公開鍵情報を導出する
   */
  derivePublicKey: derivePublicKeyFromNsec,

  /**
   * 秘密鍵をローカルストレージに保存する
   */
  saveToStorage(key: string): boolean {
    try {
      localStorage.setItem("nostr-secret-key", key);
      return true;
    } catch (e) {
      console.error("鍵の保存に失敗:", e);
      return false;
    }
  },

  /**
   * ローカルストレージから秘密鍵を読み込む
   */
  loadFromStorage(): string | null {
    return localStorage.getItem("nostr-secret-key");
  },

  /**
   * キーがストレージに存在するか確認する
   */
  hasStoredKey(): boolean {
    return !!this.loadFromStorage();
  },

  /**
   * window.nostrが利用可能かチェック
   */
  isWindowNostrAvailable(): boolean {
    return typeof window !== 'undefined' && 'nostr' in window && typeof window.nostr === 'object';
  },

  /**
   * window.nostrから公開鍵を取得
   */
  async getPublicKeyFromWindowNostr(): Promise<string | null> {
    try {
      if (!this.isWindowNostrAvailable()) {
        return null;
      }
      return await window.nostr.getPublicKey();
    } catch (e) {
      console.error("window.nostrから公開鍵の取得に失敗:", e);
      return null;
    }
  }
};

