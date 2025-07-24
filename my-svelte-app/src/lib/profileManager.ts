import type { createRxNostr } from 'rx-nostr';
import { createRxForwardReq } from 'rx-nostr';

export interface ProfileData {
  name: string;
  picture: string;
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
      console.log("ローカルストレージからプロフィール情報を取得:", cachedProfile);
      return cachedProfile;
    }
    
    return new Promise((resolve) => {
      const rxReq = createRxForwardReq();
      
      const subscription = this.rxNostr.use(rxReq).subscribe((packet) => {
        if (packet.event?.kind === 0 && packet.event.pubkey === pubkeyHex) {
          try {
            // kind 0のcontentはJSONなのでパース
            const content = JSON.parse(packet.event.content);
            const profile: ProfileData = {
              name: content.name || "",
              picture: content.picture || ""
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
        resolve(null);
      }, 5000);
    });
  }
}
