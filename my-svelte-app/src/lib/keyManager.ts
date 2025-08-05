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

export interface NostrLoginAuth {
  type: 'login' | 'signup' | 'logout';
  pubkey?: string;
  npub?: string;
  otpData?: any;
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
    this._nsecStore.set(nsec || "");
    this._isNostrLoginStore.set(false);
  }

  setNostrLoginAuth(auth: NostrLoginAuth): void {
    if (auth.type === 'logout') {
      this.clear();
      return;
    }
    if (auth.pubkey) {
      const npub = auth.npub || nip19.npubEncode(auth.pubkey);
      const nprofile = nip19.nprofileEncode({ pubkey: auth.pubkey, relays: [] });
      this._dataStore.set({ hex: auth.pubkey, npub, nprofile });
      this._isValidStore.set(true);
      this._isNostrLoginStore.set(true);
      this._nsecStore.set("");
      setNostrLoginAuth(auth.pubkey, npub, nprofile);
    }
  }

  private updateFromNsec(nsec: string): void {
    if (!nsec || !isValidNsec(nsec)) {
      this._dataStore.set({ hex: "", npub: "", nprofile: "" });
      this._isValidStore.set(false);
      return;
    }
    const derivedData = derivePublicKeyFromNsec(nsec);
    if (derivedData.hex) {
      this._dataStore.set(derivedData);
      this._isValidStore.set(true);
      setNsecAuth(derivedData.hex, derivedData.npub, derivedData.nprofile);
    } else {
      this._dataStore.set({ hex: "", npub: "", nprofile: "" });
      this._isValidStore.set(false);
    }
  }

  clear(): void {
    this._nsecStore.set("");
    this._isNostrLoginStore.set(false);
    clearAuthState();
  }

  // getterは購読解除を即時実行
  get currentIsValid(): boolean {
    let value = false;
    const unsub = this.isValid.subscribe(val => value = val);
    unsub();
    return value;
  }
  get currentHex(): string {
    let value = "";
    const unsub = this.hex.subscribe(val => value = val);
    unsub();
    return value;
  }
  get currentIsNostrLogin(): boolean {
    let value = false;
    const unsub = this.isNostrLogin.subscribe(val => value = val);
    unsub();
    return value;
  }
}

export const keyManager = {
  isValidNsec,
  derivePublicKey: derivePublicKeyFromNsec,
  saveToStorage(key: string): boolean {
    try {
      localStorage.setItem("nostr-secret-key", key);
      return true;
    } catch (e) {
      console.error("鍵の保存に失敗:", e);
      return false;
    }
  },
  loadFromStorage(): string | null {
    return localStorage.getItem("nostr-secret-key");
  },
  hasStoredKey(): boolean {
    return !!localStorage.getItem("nostr-secret-key");
  },
  isWindowNostrAvailable(): boolean {
    return typeof window !== 'undefined' && 'nostr' in window && typeof window.nostr === 'object';
  },
  async getPublicKeyFromWindowNostr(): Promise<string | null> {
    try {
      if (!this.isWindowNostrAvailable()) return null;
      return await window.nostr.getPublicKey();
    } catch (e) {
      console.error("window.nostrから公開鍵の取得に失敗:", e);
      return null;
    }
  }
};

