import type { createRxNostr } from 'rx-nostr';
import { createRxForwardReq } from 'rx-nostr';

export interface ProfileData {
  name: string;
  picture: string;
  npub?: string; // 追加
}

// npub変換関数（簡易実装。実際はbech32変換が必要）
function toNpub(pubkeyHex: string): string {
  // 本来はbech32変換が必要ですが、ここでは簡易的に
  return `npub1${pubkeyHex.slice(0, 10)}...`;
}

export class ProfileManager {
  constructor(private rxNostr: ReturnType<typeof createRxNostr>) {}

  saveToLocalStorage(pubkeyHex: string, profile: ProfileData): void {
    try {
      localStorage.setItem(`nostr-profile-${pubkeyHex}`, JSON.stringify(profile));
      console.log("プロフィール情報をローカルストレージに保存:", pubkeyHex);
    } catch (e) {
      console.error("プロフィール情報の保存に失敗:", e);
    }
  }

  getFromLocalStorage(pubkeyHex: string): ProfileData | null {
    try {
      const profile = localStorage.getItem(`nostr-profile-${pubkeyHex}`);
      return profile ? JSON.parse(profile) : null;
    } catch (e) {
      console.error("プロフィール情報の取得に失敗:", e);
      return null;
    }
  }

  async fetchProfileData(pubkeyHex: string): Promise<ProfileData | null> {
    // まずローカルストレージをチェック
    const cachedProfile = this.getFromLocalStorage(pubkeyHex);
    if (cachedProfile) {
      // npubがなければ付与
      if (!cachedProfile.npub) {
        cachedProfile.npub = toNpub(pubkeyHex);
      }
      if (!cachedProfile.picture) {
        cachedProfile.picture = "";
      }
      return cachedProfile;
    }
    
    return new Promise((resolve) => {
      const rxReq = createRxForwardReq();
      let found = false;

      const subscription = this.rxNostr.use(rxReq).subscribe((packet) => {
        if (packet.event?.kind === 0 && packet.event.pubkey === pubkeyHex) {
          found = true;
          try {
            // kind 0のcontentはJSONなのでパース
            const content = JSON.parse(packet.event.content);
            const profile: ProfileData = {
              name: content.name || "",
              picture: content.picture || "",
              npub: !content.name ? toNpub(pubkeyHex) : undefined
            };
            
            console.log("Kind 0からプロフィール情報を取得:", profile);
            this.saveToLocalStorage(pubkeyHex, profile);
            subscription.unsubscribe();
            resolve(profile);
          } catch (e) {
            console.error("Kind 0のパースエラー:", e);
          }
        }
      });

      rxReq.emit({ authors: [pubkeyHex], kinds: [0] });

      setTimeout(() => {
        subscription.unsubscribe();
        if (!found) {
          // kind0が見つからなかった場合
          const profile: ProfileData = {
            name: "",
            picture: "",
            npub: toNpub(pubkeyHex)
          };
          resolve(profile);
        }
      }, 3000);
    });
  }
}
