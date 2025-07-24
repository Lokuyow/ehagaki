<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr, createRxForwardReq } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import "./i18n";
  import { _, locale } from "svelte-i18n";
  import languageIcon from "./assets/language-solid.svg";
  import { getPublicKey, nip19 } from "nostr-tools";

  // UI状態管理
  let showDialog = false;
  let errorMessage = "";

  // 認証関連
  let secretKey = "";
  let hasStoredKey = false;

  // ユーザー公開鍵情報
  let publicKeyHex = "";
  let publicKeyNpub = "";
  let publicKeyNprofile = "";

  // プロフィール情報
  interface ProfileData {
    name: string;
    picture: string;
  }

  let profileData: ProfileData = {
    name: "",
    picture: ""
  };
  
  let profileLoaded = false;

  // Nostrクライアントインスタンス
  let rxNostr: ReturnType<typeof createRxNostr>;
  
  // ブートストラップリレーの定義（一箇所に集約）
  const BOOTSTRAP_RELAYS = [
    "wss://purplepag.es/",
    "wss://directory.yabu.me/",
    "wss://indexer.coracle.social",
    "wss://user.kindpag.es/",
  ];

  // 言語切替用
  function toggleLang() {
    locale.set($locale === "ja" ? "en" : "ja");
  }

  // 公開鍵データの型定義
  interface PublicKeyData {
    hex: string;
    npub: string;
    nprofile: string;
  }

  // 鍵関連の処理をオブジェクトにまとめる
  const keyManager = {
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

  // プロフィール管理関連のロジックをオブジェクトにまとめる
  const profileManager = {
    saveToLocalStorage(pubkeyHex: string, profile: ProfileData): void {
      try {
        localStorage.setItem(`nostr-profile-${pubkeyHex}`, JSON.stringify(profile));
        console.log("プロフィール情報をローカルストレージに保存:", pubkeyHex);
      } catch (e) {
        console.error("プロフィール情報の保存に失敗:", e);
      }
    },

    getFromLocalStorage(pubkeyHex: string): ProfileData | null {
      try {
        const profile = localStorage.getItem(`nostr-profile-${pubkeyHex}`);
        return profile ? JSON.parse(profile) : null;
      } catch (e) {
        console.error("プロフィール情報の取得に失敗:", e);
        return null;
      }
    },

    async fetchProfileData(pubkeyHex: string): Promise<ProfileData | null> {
      // まずローカルストレージをチェック
      const cachedProfile = this.getFromLocalStorage(pubkeyHex);
      if (cachedProfile) {
        console.log("ローカルストレージからプロフィール情報を取得:", cachedProfile);
        return cachedProfile;
      }
      
      return new Promise((resolve) => {
        const rxReq = createRxForwardReq();
        
        const subscription = rxNostr.use(rxReq).subscribe((packet) => {
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
  };

  // リレー管理関連のロジックをオブジェクトにまとめる
  const relayManager = {
    saveToLocalStorage(pubkeyHex: string, relays: any): void {
      try {
        localStorage.setItem(`nostr-relays-${pubkeyHex}`, JSON.stringify(relays));
        console.log("リレーリストをローカルストレージに保存:", pubkeyHex);
      } catch (e) {
        console.error("リレーリストの保存に失敗:", e);
      }
    },

    getFromLocalStorage(pubkeyHex: string): any {
      try {
        const relays = localStorage.getItem(`nostr-relays-${pubkeyHex}`);
        return relays ? JSON.parse(relays) : null;
      } catch (e) {
        console.error("リレーリストの取得に失敗:", e);
        return null;
      }
    },

    // ブートストラップリレーを設定
    setBootstrapRelays(): void {
      rxNostr.setDefaultRelays(BOOTSTRAP_RELAYS);
    },

    // ユーザーのリレーリストを取得する関数（簡潔化）
    async fetchUserRelays(pubkeyHex: string): Promise<boolean> {
      // まずkind 10002からリレーリストを取得を試みる
      const foundKind10002 = await this.tryFetchKind10002(pubkeyHex);
      if (foundKind10002) return true;
      
      // kind 10002が見つからなければkind 3を試す
      return await this.tryFetchKind3(pubkeyHex);
    },

    // Kind 10002からのリレー取得を試みる
    async tryFetchKind10002(pubkeyHex: string): Promise<boolean> {
      return new Promise((resolve) => {
        const rxReq = createRxForwardReq();
        let found = false;

        const subscription = rxNostr.use(rxReq).subscribe((packet) => {
          if (packet.event?.kind === 10002 && packet.event.pubkey === pubkeyHex) {
            found = true;
            try {
              // リレーと読み書き権限を取得
              const relayConfigs: { [url: string]: { read: boolean; write: boolean } } = {};
              
              packet.event.tags
                .filter((tag) => tag.length >= 2 && tag[0] === "r")
                .forEach((tag) => {
                  const url = tag[1];
                  let read = true;  // デフォルトは読み書き両方許可
                  let write = true;
                  
                  // 明示的に指定されている場合
                  if (tag.length > 2) {
                    if (tag.length === 3) {
                      if (tag[2] === "read") write = false;
                      else if (tag[2] === "write") read = false;
                    } else {
                      read = tag.includes("read");
                      write = tag.includes("write");
                    }
                  }
                  
                  relayConfigs[url] = { read, write };
                });
              
              if (Object.keys(relayConfigs).length > 0) {
                rxNostr.setDefaultRelays(relayConfigs);
                console.log("Kind 10002からリレーを設定:", relayConfigs);
                this.saveToLocalStorage(pubkeyHex, relayConfigs);
                subscription.unsubscribe();
                resolve(true);
              }
            } catch (e) {
              console.error("Kind 10002のパースエラー:", e);
            }
          }
        });

        rxReq.emit({ authors: [pubkeyHex], kinds: [10002] });

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(false);
        }, 5000);
      });
    },

    // Kind 3からのリレー取得を試みる
    async tryFetchKind3(pubkeyHex: string): Promise<boolean> {
      return new Promise((resolve) => {
        const rxReq = createRxForwardReq();

        const subscription = rxNostr.use(rxReq).subscribe((packet) => {
          if (packet.event?.kind === 3 && packet.event.pubkey === pubkeyHex) {
            try {
              // contentはJSON文字列なので、まずパース
              const relayObj = JSON.parse(packet.event.content);
              if (relayObj && typeof relayObj === "object" && !Array.isArray(relayObj)) {
                rxNostr.setDefaultRelays(relayObj);
                console.log("Kind 3からリレーを設定:", relayObj);
                this.saveToLocalStorage(pubkeyHex, relayObj);
                subscription.unsubscribe();
                resolve(true);
              }
            } catch (e) {
              console.error("Kind 3のパースエラー:", e);
            }
          }
        });

        rxReq.emit({ authors: [pubkeyHex], kinds: [3] });

        setTimeout(() => {
          subscription.unsubscribe();
          resolve(false);
        }, 5000);
      });
    }
  };

  // Nostr関連の初期化処理
  async function initializeNostr(pubkeyHex?: string): Promise<void> {
    rxNostr = createRxNostr({ verifier });
    
    if (pubkeyHex) {
      // ローカルストレージからリレーリストを取得
      const savedRelays = relayManager.getFromLocalStorage(pubkeyHex);
      
      if (savedRelays) {
        // 保存済みのリレーリストがあればそれを使用
        rxNostr.setDefaultRelays(savedRelays);
        console.log("ローカルストレージのリレーリストを使用:", savedRelays);
      } else {
        // なければブートストラップリレーを設定してからユーザーのリレーを取得
        relayManager.setBootstrapRelays();
        await relayManager.fetchUserRelays(pubkeyHex);
      }
      
      // プロフィール情報の取得
      const profile = await profileManager.fetchProfileData(pubkeyHex);
      if (profile) {
        profileData = profile;
        profileLoaded = true;
      }
    } else {
      // 秘密鍵がない場合はブートストラップリレーを設定
      relayManager.setBootstrapRelays();
    }
  }

  async function saveSecretKey() {
    if (!keyManager.isValidNsec(secretKey)) {
      errorMessage = "invalid_key";
      publicKeyHex = "";
      publicKeyNpub = "";
      publicKeyNprofile = "";
      return;
    }
    
    const success = keyManager.saveToStorage(secretKey);
    if (success) {
      hasStoredKey = true;
      showDialog = false;
      errorMessage = "";
      const { hex, npub, nprofile } = keyManager.derivePublicKey(secretKey);
      publicKeyHex = hex;
      publicKeyNpub = npub;
      publicKeyNprofile = nprofile;

      // ログイン成功後、ユーザーのリレーリストとプロフィールを取得
      if (publicKeyHex) {
        await relayManager.fetchUserRelays(publicKeyHex);
        const profile = await profileManager.fetchProfileData(publicKeyHex);
        if (profile) {
          profileData = profile;
          profileLoaded = true;
        }
      }
    } else {
      errorMessage = "error_saving";
      publicKeyHex = "";
      publicKeyNpub = "";
      publicKeyNprofile = "";
    }
  }

  $: if (secretKey && keyManager.isValidNsec(secretKey)) {
    const { hex, npub, nprofile } = keyManager.derivePublicKey(secretKey);
    publicKeyHex = hex;
    publicKeyNpub = npub;
    publicKeyNprofile = nprofile;
  } else if (secretKey) {
    publicKeyHex = "";
    publicKeyNpub = "";
    publicKeyNprofile = "";
  }

  function showLoginDialog() {
    showDialog = true;
  }

  function closeDialog() {
    showDialog = false;
    errorMessage = "";
  }

  // ロケール変更時にローカルストレージへ保存
  $: if ($locale) {
    localStorage.setItem("locale", $locale);
  }

  onMount(async () => {
    // ローカルストレージに保存されたロケールがあればそれをセット
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale && storedLocale !== $locale) {
      locale.set(storedLocale);
    }

    // 秘密鍵の取得と検証
    const storedKey = keyManager.loadFromStorage();
    hasStoredKey = !!storedKey;

    // 公開鍵の取得とNostr初期化
    if (storedKey && keyManager.isValidNsec(storedKey)) {
      const { hex } = keyManager.derivePublicKey(storedKey);
      publicKeyHex = hex;
      await initializeNostr(hex);
    } else {
      await initializeNostr();
    }
  });
</script>

{#if $locale}
  <main>
    <!-- 言語切替ボタン（トグル） -->
    <button class="lang-btn" on:click={toggleLang} aria-label="Change language">
      <img src={languageIcon} alt="Language" class="lang-icon" />
    </button>
    
    <!-- ログインボタンまたはプロフィール表示 -->
    {#if hasStoredKey && profileLoaded && profileData.picture}
      <div class="profile-display">
        <img 
          src={profileData.picture} 
          alt={profileData.name || "User"} 
          class="profile-picture" 
        />
        <span class="profile-name">{profileData.name || "User"}</span>
      </div>
    {:else}
      <button class="login-btn" on:click={showLoginDialog}>
        {hasStoredKey ? $_("logged_in") : $_("login")}
      </button>
    {/if}

    {#if showDialog}
      <div class="dialog-overlay">
        <div class="dialog">
          <h2>{$_("input_secret")}</h2>
          <p>{$_("input_nostr_secret")}</p>
          <input
            type="password"
            bind:value={secretKey}
            placeholder="nsec1~"
            class="secret-input"
          />
          {#if publicKeyNpub}
            <p>
              公開鍵(npub): <span style="word-break:break-all"
                >{publicKeyNpub}</span
              >
            </p>
          {/if}
          {#if publicKeyNprofile}
            <p>
              公開鍵(nprofile): <span style="word-break:break-all"
                >{publicKeyNprofile}</span
              >
            </p>
          {/if}
          {#if errorMessage}
            <p class="error-message">{$_(errorMessage)}</p>
          {/if}
          <div class="dialog-buttons">
            <button on:click={closeDialog} class="cancel-btn"
              >{$_("cancel")}</button
            >
            <button on:click={saveSecretKey} class="save-btn"
              >{$_("save")}</button
            >
          </div>
        </div>
      </div>
    {/if}

    <!-- サイトタイトル -->
    <h1 class="site-title">eHagaki</h1>

    <!-- 必要に応じて他のコンポーネントやUIをここに追加 -->
  </main>
{/if}

<style>
  .login-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 0.5em 1.2em;
    font-size: 1em;
    border: none;
    border-radius: 4px;
    background: #646cff;
    color: #fff;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 8px #0001;
    transition: background 0.2s;
  }
  .login-btn:hover {
    background: #535bf2;
  }

  /* プロフィール表示のスタイル */
  .profile-display {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 10;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    padding: 5px 12px 5px 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .profile-picture {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .profile-name {
    font-size: 0.9em;
    font-weight: 500;
    color: #333;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ダイアログのスタイル */
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .dialog {
    background-color: white;
    color: #222;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 500px;
  }

  .secret-input {
    width: 100%;
    padding: 0.8rem;
    margin: 1rem 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .cancel-btn {
    padding: 0.6rem 1.2rem;
    border: 1px solid #ccc;
    background-color: #f5f5f5;
    color: #333;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .cancel-btn:hover {
    background-color: #e0e0e0;
  }

  .save-btn {
    padding: 0.6rem 1.2rem;
    background-color: #646cff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .save-btn:hover {
    background-color: #535bf2;
  }

  .error-message {
    color: #d32f2f;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  main {
    position: relative;
  }
  .lang-btn {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 12;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    padding: 6px;
    cursor: pointer;
    box-shadow: 0 2px 8px #0001;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background 0.2s,
      box-shadow 0.1s,
      transform 0.1s;
  }
  .lang-btn:hover {
    background: #f0f0f0;
  }
  .lang-btn:active {
    background: #e0e0e0;
    box-shadow: 0 1px 2px #0002;
    transform: scale(0.94);
  }
  .lang-icon {
    width: 24px;
    height: 24px;
    display: block;
  }

  .site-title {
    text-align: center;
    font-size: 2.5rem;
    margin: 2.5rem 0 1.5rem 0;
    font-weight: bold;
    letter-spacing: 0.08em;
    color: #646cff;
  }
</style>
