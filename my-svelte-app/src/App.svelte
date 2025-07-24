<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import "./i18n";
  import { _, locale } from "svelte-i18n";
  import languageIcon from "./assets/language-solid.svg";
  import { ProfileManager, type ProfileData } from "./lib/profileManager";
  import ProfileComponent from "./components/ProfileComponent.svelte";
  import LoginDialog from "./components/LoginDialog.svelte";
  import { keyManager } from "./lib/keyManager";
  import { RelayManager } from "./lib/relayManager";

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
    <ProfileComponent
      {profileData}
      {profileLoaded}
      {hasStoredKey}
      {showLoginDialog}
    />

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

    <!-- 必要に応じて他のコンポーネントやUIをここに追加 -->
  </main>
{/if}

<style>
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
</style>
