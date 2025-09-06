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

export class ProfileManager {
  constructor(private rxNostr: ReturnType<typeof createRxNostr>) { }

  // プロフィール画像のキャッシュバスティング
  private addCacheBuster(imageUrl: string): string {
    if (!imageUrl) return imageUrl;
    try {
      const url = new URL(imageUrl);
      url.searchParams.set('cb', Date.now().toString());
      return url.toString();
    } catch {
      // URLが不正な場合はそのまま返す
      return imageUrl;
    }
  }

  // プロフィール画像にマーカーを追加（改良版）
  private addProfileMarker(imageUrl: string, forceRemote = false): string {
    if (!imageUrl) return imageUrl;
    try {
      const url = new URL(imageUrl);
      
      // プロフィール画像であることを示すクエリパラメータを追加
      url.searchParams.set('profile', 'true');
      
      // forceRemoteの場合のみキャッシュバスターを追加
      // オフライン時やキャッシュ優先時は削除してキャッシュヒット率を向上
      if (forceRemote && navigator.onLine) {
        // 既存のキャッシュバスターがある場合は更新
        if (url.searchParams.has('cb')) {
          url.searchParams.set('cb', Date.now().toString());
        }
      } else {
        // キャッシュ優先の場合はキャッシュバスターを削除
        url.searchParams.delete('cb');
      }
      
      return url.toString();
    } catch {
      // URLが不正な場合はそのまま返す
      return imageUrl;
    }
  }

  // ProfileData生成時にキャッシュバスターを適用
  private createProfileDataWithCacheBuster(content: any, pubkeyHex: string, forceRemote = false): ProfileData {
    let picture = content?.picture || "";
    
    // プロフィール画像にマーカーを追加
    if (picture) {
      // forceRemoteの場合のみキャッシュバスターを追加
      if (forceRemote) {
        picture = this.addCacheBuster(picture);
      }
      picture = this.addProfileMarker(picture, forceRemote);
    }
    
    return {
      name: content?.name || "",
      picture,
      npub: content?.name ? undefined : toNpub(pubkeyHex)
    };
  }

  saveToLocalStorage(pubkeyHex: string, profile: ProfileData | null): void {
    try {
      if (profile === null) {
        localStorage.removeItem(`nostr-profile-${pubkeyHex}`);
        return;
      }
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
      
      // ローカルストレージから取得時は常にキャッシュ優先
      const profileData = this.createProfileDataWithCacheBuster(parsed, pubkeyHex, false);
      
      return profileData;
    } catch (e) {
      console.error("プロフィール情報の取得に失敗:", e);
      return null;
    }
  }

  async fetchProfileData(pubkeyHex: string, opts?: { forceRemote?: boolean }): Promise<ProfileData | null> {
    console.log(`プロフィール取得開始: ${pubkeyHex}`);

    // forceRemoteがfalseまたは未指定ならローカルストレージ利用
    if (!opts?.forceRemote) {
      const cachedProfile = this.getFromLocalStorage(pubkeyHex);
      if (cachedProfile) {
        console.log("キャッシュからプロフィールを復元:", cachedProfile);
        return cachedProfile;
      }
    }

    console.log("リモートからプロフィール情報を取得中...");

    return new Promise((resolve) => {
      const rxReq = createRxForwardReq();
      let found = false;

      const subscription = this.rxNostr.use(rxReq).subscribe((packet) => {
        if (packet.event?.kind === 0 && packet.event.pubkey === pubkeyHex) {
          found = true;
          try {
            const content = JSON.parse(packet.event.content);
            const profile = this.createProfileDataWithCacheBuster(content, pubkeyHex, opts?.forceRemote);
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
          console.log("プロフィール取得タイムアウト、デフォルトプロフィールを使用");
          const defaultProfile = this.createProfileDataWithCacheBuster({}, pubkeyHex, opts?.forceRemote);
          this.saveToLocalStorage(pubkeyHex, defaultProfile); // デフォルトも保存
          resolve(defaultProfile);
        }
      }, 3000);
    });
  }
}
