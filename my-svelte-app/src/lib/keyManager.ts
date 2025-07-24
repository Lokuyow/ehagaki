import { getPublicKey, nip19 } from "nostr-tools";

export interface PublicKeyData {
  hex: string;
  npub: string;
  nprofile: string;
}

export const keyManager = {
  /**
   * 秘密鍵がnsec形式として有効かチェックする
   */
  isValidNsec(key: string): boolean {
    return /^nsec1[023456789acdefghjklmnpqrstuvwxyz]{58,}$/.test(key);
  },

  /**
   * nsec形式の秘密鍵から公開鍵情報を導出する
   */
  derivePublicKey(nsec: string): PublicKeyData {
    try {
      const { type, data } = nip19.decode(nsec);
      if (type !== "nsec") {
        console.warn("無効なnsec形式です");
        return { hex: "", npub: "", nprofile: "" };
      }
      const hex = getPublicKey(data as Uint8Array);
      const npub = nip19.npubEncode(hex);
      const nprofile = nip19.nprofileEncode({ pubkey: hex, relays: [] });
      return { hex, npub, nprofile };
    } catch (e) {
      console.error("公開鍵の導出に失敗:", e);
      return { hex: "", npub: "", nprofile: "" };
    }
  },

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
  }
};
