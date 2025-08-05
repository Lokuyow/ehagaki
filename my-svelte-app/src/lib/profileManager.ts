import type { createRxNostr } from 'rx-nostr';
import { createRxForwardReq } from 'rx-nostr';

export interface ProfileData {
  name: string;
  picture: string;
  npub?: string;
}

// npub変換関数
function toNpub(pubkeyHex: string): string {
  return `npub1${pubkeyHex.slice(0, 10)}...`;
}

// ProfileData生成の共通化
function createProfileData(content: any, pubkeyHex: string): ProfileData {
  return {
    name: content?.name || "",
    picture: content?.picture || "",
    npub: content?.name ? undefined : toNpub(pubkeyHex)
  };
}

export class ProfileManager {
  constructor(private rxNostr: ReturnType<typeof createRxNostr>) { }

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
      if (!profile) return null;
      const parsed = JSON.parse(profile);
      return createProfileData(parsed, pubkeyHex);
    } catch (e) {
      console.error("プロフィール情報の取得に失敗:", e);
      return null;
    }
  }

  async fetchProfileData(pubkeyHex: string): Promise<ProfileData | null> {
    const cachedProfile = this.getFromLocalStorage(pubkeyHex);
    if (cachedProfile) return cachedProfile;

    return new Promise((resolve) => {
      const rxReq = createRxForwardReq();
      let found = false;

      const subscription = this.rxNostr.use(rxReq).subscribe((packet) => {
        if (packet.event?.kind === 0 && packet.event.pubkey === pubkeyHex) {
          found = true;
          try {
            const content = JSON.parse(packet.event.content);
            const profile = createProfileData(content, pubkeyHex);
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
          resolve(createProfileData({}, pubkeyHex));
        }
      }, 3000);
    });
  }
}
