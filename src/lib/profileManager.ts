import type { createRxNostr } from 'rx-nostr';
import { createRxForwardReq } from 'rx-nostr';
import { toNpub } from "./utils/appUtils";

// --- 依存性注入用の型定義を拡張 ---
export interface ProfileManagerDeps {
  localStorage?: Storage;
  navigator?: Navigator;
  setTimeoutFn?: (fn: (...args: any[]) => void, ms?: number, ...args: any[]) => any;
  clearTimeoutFn?: (timeoutId: any) => void;
  console?: Console;
  // RxNostrの抽象化（テスト用）
  rxNostrFactory?: () => ReturnType<typeof createRxNostr>;
}

// --- ProfileData型（変更なし） ---
export interface ProfileData {
  name: string;
  picture: string;
  npub?: string;
}

// --- URL処理の純粋関数（依存性なし） ---
export class ProfileUrlUtils {
  static addCacheBuster(imageUrl: string): string {
    if (!imageUrl) return imageUrl;
    try {
      const url = new URL(imageUrl);
      url.searchParams.set('cb', Date.now().toString());
      return url.toString();
    } catch {
      return imageUrl;
    }
  }

  static addProfileMarker(imageUrl: string, forceRemote = false, navigatorOnline = true): string {
    if (!imageUrl) return imageUrl;
    try {
      const url = new URL(imageUrl);
      url.searchParams.set('profile', 'true');
      if (forceRemote && navigatorOnline) {
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
}

// --- プロフィール変換ロジック（テストしやすい純粋関数） ---
export class ProfileDataFactory {
  constructor(private deps: ProfileManagerDeps = {}) { }

  createProfileData(
    content: any,
    pubkeyHex: string,
    forceRemote = false
  ): ProfileData {
    let picture = content?.picture || "";

    if (picture) {
      if (forceRemote) {
        picture = ProfileUrlUtils.addCacheBuster(picture);
      }
      const navigatorOnline = this.deps.navigator?.onLine ?? true;
      picture = ProfileUrlUtils.addProfileMarker(picture, forceRemote, navigatorOnline);
    }

    return {
      name: content?.name || "",
      picture,
      npub: toNpub(pubkeyHex)
    };
  }
}

// --- ストレージ操作の分離 ---
export class ProfileStorage {
  constructor(
    private localStorage: Storage,
    private console: Console,
    private profileDataFactory: ProfileDataFactory
  ) { }

  save(pubkeyHex: string, profile: ProfileData | null): void {
    try {
      if (profile === null) {
        this.localStorage.removeItem(`nostr-profile-${pubkeyHex}`);
        return;
      }
      this.localStorage.setItem(`nostr-profile-${pubkeyHex}`, JSON.stringify(profile));
      this.console.log("プロフィール情報をローカルストレージに保存:", pubkeyHex);
    } catch (e) {
      this.console.error("プロフィール情報の保存に失敗:", e);
    }
  }

  get(pubkeyHex: string): ProfileData | null {
    try {
      const profileString = this.localStorage.getItem(`nostr-profile-${pubkeyHex}`);
      if (!profileString) return null;

      const parsed = JSON.parse(profileString);
      // ローカルストレージから取得時は常にキャッシュ優先
      return this.profileDataFactory.createProfileData(parsed, pubkeyHex, false);
    } catch (e) {
      this.console.error("プロフィール情報の取得に失敗:", e);
      return null;
    }
  }

  clear(pubkeyHex: string): void {
    this.save(pubkeyHex, null);
  }
}

// --- ネットワーク取得の分離 ---
export class ProfileNetworkFetcher {
  constructor(
    private rxNostr: ReturnType<typeof createRxNostr>,
    private profileDataFactory: ProfileDataFactory,
    private setTimeoutFn: (fn: (...args: any[]) => void, ms?: number, ...args: any[]) => any,
    private clearTimeoutFn: (timeoutId: any) => void,
    private console: Console
  ) { }

  async fetchFromNetwork(
    pubkeyHex: string,
    opts?: { forceRemote?: boolean; timeoutMs?: number }
  ): Promise<ProfileData | null> {
    const timeoutMs = opts?.timeoutMs ?? 3000;

    return new Promise<ProfileData | null>((resolve) => {
      const rxReq = createRxForwardReq();
      let found = false;
      let timeoutId: any = null;
      let resolved = false;

      // サブスクリプションの型安全な保持
      let subscription: any = undefined;

      const cleanup = () => {
        if (timeoutId != null) {
          this.clearTimeoutFn(timeoutId);
          timeoutId = null;
        }
        if (subscription && typeof subscription.unsubscribe === "function") {
          subscription.unsubscribe();
          subscription = undefined;
        }
      };

      const safeResolve = (value: ProfileData | null) => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(value);
        }
      };

      subscription = this.rxNostr.use(rxReq).subscribe({
        next: (packet) => {
          if (resolved) return;
          if (packet.event?.kind === 0 && packet.event.pubkey === pubkeyHex) {
            found = true;
            try {
              const content = JSON.parse(packet.event.content);
              const profile = this.profileDataFactory.createProfileData(
                content,
                pubkeyHex,
                opts?.forceRemote
              );
              this.console.log("Kind 0からプロフィール情報を取得:", profile);
              safeResolve(profile);
            } catch (e) {
              this.console.error("Kind 0のパースエラー:", e);
              safeResolve(null);
            }
          }
        },
        error: (error) => {
          if (resolved) return;
          this.console.error("プロフィール取得エラー:", error);
          safeResolve(null);
        }
      });

      // タイムアウト設定
      timeoutId = this.setTimeoutFn(() => {
        if (resolved) return;
        if (!found) {
          this.console.log("プロフィール取得タイムアウト、デフォルトプロフィールを使用");
          const defaultProfile = this.profileDataFactory.createProfileData(
            {},
            pubkeyHex,
            opts?.forceRemote
          );
          safeResolve(defaultProfile);
        }
      }, timeoutMs);

      // リクエスト送信
      rxReq.emit({ authors: [pubkeyHex], kinds: [0] });
    });
  }
}

// --- メインのProfileManager（依存性を組み合わせ） ---
export class ProfileManager {
  private storage: ProfileStorage;
  private networkFetcher: ProfileNetworkFetcher;
  private profileDataFactory: ProfileDataFactory;

  constructor(
    private rxNostr: ReturnType<typeof createRxNostr>,
    deps: ProfileManagerDeps = {}
  ) {
    // デフォルト依存性の設定
    const localStorage = deps.localStorage || (typeof window !== 'undefined' ? window.localStorage : {} as Storage);
    const navigator = deps.navigator || (typeof window !== 'undefined' ? window.navigator : { onLine: true } as Navigator);
    const setTimeoutFn = deps.setTimeoutFn || ((fn, ms) => setTimeout(fn, ms));
    const clearTimeoutFn = deps.clearTimeoutFn || ((id) => clearTimeout(id));
    const console = deps.console || (typeof window !== 'undefined' ? window.console : {} as Console);

    // 依存関係の構築
    this.profileDataFactory = new ProfileDataFactory({ navigator });
    this.storage = new ProfileStorage(localStorage, console, this.profileDataFactory);
    this.networkFetcher = new ProfileNetworkFetcher(
      rxNostr,
      this.profileDataFactory,
      setTimeoutFn,
      clearTimeoutFn,
      console
    );
  }

  // 外部APIは変更なし（後方互換性のため）
  saveToLocalStorage(pubkeyHex: string, profile: ProfileData | null): void {
    this.storage.save(pubkeyHex, profile);
  }

  getFromLocalStorage(pubkeyHex: string): ProfileData | null {
    return this.storage.get(pubkeyHex);
  }

  async fetchProfileData(
    pubkeyHex: string,
    opts?: { forceRemote?: boolean; timeoutMs?: number }
  ): Promise<ProfileData | null> {
    const consoleObj = this.networkFetcher['console'];
    consoleObj.log(`プロフィール取得開始: ${pubkeyHex}`);

    // キャッシュチェック
    if (!opts?.forceRemote) {
      const cachedProfile = this.storage.get(pubkeyHex);
      if (cachedProfile) {
        consoleObj.log("キャッシュからプロフィールを復元:", cachedProfile);
        return cachedProfile;
      }
    }

    consoleObj.log("リモートからプロフィール情報を取得中...");

    // ネットワーク取得
    const profile = await this.networkFetcher.fetchFromNetwork(pubkeyHex, opts);

    // 取得できた場合はキャッシュに保存
    if (profile) {
      this.storage.save(pubkeyHex, profile);
    }

    return profile;
  }

  // テスト用の内部コンポーネントへのアクセス
  getStorage(): ProfileStorage {
    return this.storage;
  }

  getNetworkFetcher(): ProfileNetworkFetcher {
    return this.networkFetcher;
  }

  getProfileDataFactory(): ProfileDataFactory {
    return this.profileDataFactory;
  }
}
