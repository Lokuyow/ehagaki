import type { createRxNostr } from 'rx-nostr';
import { createRxForwardReq } from 'rx-nostr';
import { toNpub } from "./utils/appUtils"; // 追加

// --- 依存性注入用の型 ---
export interface ProfileManagerDeps {
  localStorage?: Storage;
  navigator?: Navigator;
  setTimeoutFn?: (fn: (...args: any[]) => void, ms?: number, ...args: any[]) => any;
  console?: Console;
}

// --- ProfileData型 ---
export interface ProfileData {
  name: string;
  picture: string;
  npub?: string;
}

export function addCacheBuster(imageUrl: string): string {
  if (!imageUrl) return imageUrl;
  try {
    const url = new URL(imageUrl);
    url.searchParams.set('cb', Date.now().toString());
    return url.toString();
  } catch {
    return imageUrl;
  }
}

export function addProfileMarker(imageUrl: string, forceRemote = false, navigatorObj: Navigator = navigator): string {
  if (!imageUrl) return imageUrl;
  try {
    const url = new URL(imageUrl);
    url.searchParams.set('profile', 'true');
    if (forceRemote && navigatorObj.onLine) {
      if (url.searchParams.has('cb')) {
        url.searchParams.set('cb', Date.now().toString());
      }
    } else {
      url.searchParams.delete('cb');
    }
    return url.toString();
  } catch {
    return imageUrl;
  }
}

export function createProfileDataWithCacheBuster(
  content: any,
  pubkeyHex: string,
  forceRemote = false,
  deps: ProfileManagerDeps = {}
): ProfileData {
  let picture = content?.picture || "";
  if (picture) {
    if (forceRemote) {
      picture = addCacheBuster(picture);
    }
    picture = addProfileMarker(picture, forceRemote, deps.navigator || navigator);
  }
  return {
    name: content?.name || "",
    picture,
    npub: toNpub(pubkeyHex) // ここでappUtils.tsのtoNpubを使用
  };
}

// --- ProfileManager本体 ---
export class ProfileManager {
  private localStorage: Storage;
  private navigatorObj: Navigator;
  private setTimeoutFn: (fn: (...args: any[]) => void, ms?: number, ...args: any[]) => any;
  private consoleObj: Console;

  constructor(
    private rxNostr: ReturnType<typeof createRxNostr>,
    deps: ProfileManagerDeps = {}
  ) {
    this.localStorage = deps.localStorage || localStorage;
    this.navigatorObj = deps.navigator || navigator;
    // 修正: setTimeoutFnのデフォルト値をラップ関数にする
    this.setTimeoutFn = deps.setTimeoutFn || ((fn, ms) => setTimeout(fn, ms));
    this.consoleObj = deps.console || console;
  }

  saveToLocalStorage(pubkeyHex: string, profile: ProfileData | null): void {
    try {
      if (profile === null) {
        this.localStorage.removeItem(`nostr-profile-${pubkeyHex}`);
        return;
      }
      this.localStorage.setItem(`nostr-profile-${pubkeyHex}`, JSON.stringify(profile));
      this.consoleObj.log("プロフィール情報をローカルストレージに保存:", pubkeyHex);
    } catch (e) {
      this.consoleObj.error("プロフィール情報の保存に失敗:", e);
    }
  }

  getFromLocalStorage(pubkeyHex: string): ProfileData | null {
    try {
      const profile = this.localStorage.getItem(`nostr-profile-${pubkeyHex}`);
      if (!profile) return null;
      const parsed = JSON.parse(profile);
      // ローカルストレージから取得時は常にキャッシュ優先
      const profileData = createProfileDataWithCacheBuster(parsed, pubkeyHex, false, {
        navigator: this.navigatorObj
      });
      return profileData;
    } catch (e) {
      this.consoleObj.error("プロフィール情報の取得に失敗:", e);
      return null;
    }
  }

  async fetchProfileData(pubkeyHex: string, opts?: { forceRemote?: boolean }): Promise<ProfileData | null> {
    this.consoleObj.log(`プロフィール取得開始: ${pubkeyHex}`);

    if (!opts?.forceRemote) {
      const cachedProfile = this.getFromLocalStorage(pubkeyHex);
      if (cachedProfile) {
        this.consoleObj.log("キャッシュからプロフィールを復元:", cachedProfile);
        return cachedProfile;
      }
    }

    this.consoleObj.log("リモートからプロフィール情報を取得中...");

    return new Promise((resolve) => {
      const rxReq = createRxForwardReq();
      let found = false;

      const subscription = this.rxNostr.use(rxReq).subscribe((packet) => {
        if (packet.event?.kind === 0 && packet.event.pubkey === pubkeyHex) {
          found = true;
          try {
            const content = JSON.parse(packet.event.content);
            const profile = createProfileDataWithCacheBuster(
              content,
              pubkeyHex,
              opts?.forceRemote,
              { navigator: this.navigatorObj }
            );
            this.consoleObj.log("Kind 0からプロフィール情報を取得:", profile);
            this.saveToLocalStorage(pubkeyHex, profile);
            subscription.unsubscribe();
            resolve(profile);
          } catch (e) {
            this.consoleObj.error("Kind 0のパースエラー:", e);
          }
        }
      });

      rxReq.emit({ authors: [pubkeyHex], kinds: [0] });

      this.setTimeoutFn(() => {
        subscription.unsubscribe();
        if (!found) {
          this.consoleObj.log("プロフィール取得タイムアウト、デフォルトプロフィールを使用");
          const defaultProfile = createProfileDataWithCacheBuster(
            {},
            pubkeyHex,
            opts?.forceRemote,
            { navigator: this.navigatorObj }
          );
          this.saveToLocalStorage(pubkeyHex, defaultProfile);
          resolve(defaultProfile);
        }
      }, 3000);
    });
  }
}
