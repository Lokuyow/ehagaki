<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto"; 
  import "./i18n";
  import { _, locale } from "svelte-i18n";
  import languageIcon from "./assets/language-solid.svg";
  import settingsIcon from "./assets/gear-solid-full.svg"; // 設定アイコンを追加（SVGファイルを用意してください）
  import { ProfileManager, type ProfileData } from "./lib/profileManager";
  import ProfileComponent from "./components/ProfileComponent.svelte";
  import LoginDialog from "./components/LoginDialog.svelte";
  import { keyManager } from "./lib/keyManager";
  import { RelayManager } from "./lib/relayManager";
  import PostComponent from "./components/PostComponent.svelte"; // 追加

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
  let profileData: ProfileData = {
    name: "",
    picture: "",
  };

  let profileLoaded = false;

  // Nostrクライアントインスタンス
  let rxNostr: ReturnType<typeof createRxNostr>;

  // プロフィールマネージャーインスタンス
  let profileManager: ProfileManager;

  // リレーマネージャーインスタンス
  let relayManager: RelayManager;

  // 言語切替用
  function toggleLang() {
    locale.set($locale === "ja" ? "en" : "ja");
  }

  // Nostr関連の初期化処理
  async function initializeNostr(pubkeyHex?: string): Promise<void> {
    rxNostr = createRxNostr({ verifier });
    // プロフィールマネージャーの初期化
    profileManager = new ProfileManager(rxNostr);
    // リレーマネージャーの初期化
    relayManager = new RelayManager(rxNostr);

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

  // 設定ダイアログ状態
  let showSettings = false;

  // アップロード先候補
  const uploadEndpoints = [
    { label: "yabu.me", url: "https://yabu.me/api/v2/media" },
    { label: "nostpic.com", url: "https://nostpic.com/api/v2/media" },
    { label: "nostrcheck.me", url: "https://nostrcheck.me/api/v2/media" },
    { label: "nostr.build", url: "https://nostr.build/api/v2/nip96/upload" }
  ];

  function getDefaultEndpoint(loc: string | null | undefined) {
    if (loc === "ja") return "https://yabu.me/api/v2/media";
    return "https://nostrcheck.me/api/v2/media";
  }

  let selectedEndpoint: string;

  onMount(() => {
    // ブラウザの言語設定から初期アップロードエンドポイントを設定
    const storedLocale = localStorage.getItem("locale");
    const browserLocale = navigator.language;
    const effectiveLocale = storedLocale || (browserLocale && browserLocale.startsWith("ja") ? "ja" : "en");
    
    // ローカルストレージからエンドポイントを取得
    const saved = localStorage.getItem("uploadEndpoint");
    if (saved && uploadEndpoints.some(ep => ep.url === saved)) {
      selectedEndpoint = saved;
    } else {
      // 言語設定に基づいて適切なエンドポイントを設定
      selectedEndpoint = getDefaultEndpoint(effectiveLocale);
    }
  });

  $: if ($locale) {
    const saved = localStorage.getItem("uploadEndpoint");
    if (!saved) {
      selectedEndpoint = getDefaultEndpoint($locale);
    }
  }
  $: if (selectedEndpoint) {
    localStorage.setItem("uploadEndpoint", selectedEndpoint);
  }

  function openSettings() {
    showSettings = true;
  }
  function closeSettings() {
    showSettings = false;
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
    <!-- ヘッダー領域 -->
    <div class="header">
      <button class="lang-btn" on:click={toggleLang} aria-label="Change language">
        <img src={languageIcon} alt="Language" class="lang-icon" />
      </button>
      <ProfileComponent
        {profileData}
        {profileLoaded}
        {hasStoredKey}
        {showLoginDialog}
      />
      <!-- 設定ボタン -->
      <button class="settings-btn" on:click={openSettings} aria-label="設定">
        <img src={settingsIcon} alt="Settings" class="settings-icon" />
      </button>
    </div>

    {#if showDialog}
      <LoginDialog
        bind:secretKey
        {publicKeyNpub}
        {publicKeyNprofile}
        {errorMessage}
        onClose={closeDialog}
        onSave={saveSecretKey}
      />
    {/if}

    <!-- 設定ダイアログ -->
    {#if showSettings}
      <button
        type="button"
        class="modal-backdrop"
        aria-label="設定ダイアログを閉じる"
        on:click={closeSettings}
        tabindex="0"
      ></button>
      <div class="modal-dialog" role="dialog" aria-modal="true">
        <div class="modal-header">
          <span>アップロード先設定</span>
          <button class="modal-close" on:click={closeSettings} aria-label="閉じる">&times;</button>
        </div>
        <div class="modal-body">
          <label for="endpoint-select">アップロード先:</label>
          <select
            id="endpoint-select"
            bind:value={selectedEndpoint}
            style="margin-left: 8px;"
          >
            {#each uploadEndpoints as ep}
              <option value={ep.url}>{ep.label}</option>
            {/each}
          </select>
        </div>
      </div>
    {/if}

    <!-- メインコンテンツ -->
    <div class="main-content">
      <!-- 投稿コンポーネントを使用 -->
      <PostComponent
        {rxNostr}
        {hasStoredKey}
        onPostSuccess={() => {
          // 必要に応じて投稿成功時の処理を追加
        }}
      />
    </div>
    <!-- 必要に応じて他のコンポーネントやUIをここに追加 -->
  </main>
{/if}

<style>
  main {
    position: relative;
  }
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 16px 8px 0 8px;
    box-sizing: border-box;
    background: transparent;
  }
  .lang-btn {
    position: static;
    /* 位置をheader内に */
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
  .settings-btn {
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
    transition: background 0.2s, box-shadow 0.1s, transform 0.1s;
  }
  .settings-btn:hover {
    background: #f0f0f0;
  }
  .settings-btn:active {
    background: #e0e0e0;
    box-shadow: 0 1px 2px #0002;
    transform: scale(0.94);
  }
  .settings-icon {
    width: 24px;
    height: 24px;
    display: block;
  }
  .main-content {
    margin-top: 24px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: #0006;
    z-index: 1000;
  }
  .modal-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1001;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 24px #0002;
    transform: translate(-50%, -50%);
    min-width: 320px;
    max-width: 90vw;
    padding: 0;
    animation: fadeIn 0.2s;
    color: #222; /* 追加: 文字色を明示 */
  }
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
    font-weight: bold;
    font-size: 1.1rem;
    color: #222; /* 追加: 文字色を明示 */
  }
  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #888;
    padding: 0 4px;
    line-height: 1;
  }
  .modal-body {
    padding: 16px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    color: #222; /* 追加: 文字色を明示 */
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -46%);}
    to { opacity: 1; transform: translate(-50%, -50%);}
  }
</style>
