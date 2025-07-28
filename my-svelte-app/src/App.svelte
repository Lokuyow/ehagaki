<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import "./i18n";
  import { _, locale } from "svelte-i18n";
  import settingsIcon from "./assets/gear-solid-full.svg";
  import { ProfileManager, type ProfileData } from "./lib/profileManager";
  import ProfileComponent from "./components/ProfileComponent.svelte";
  import LoginDialog from "./components/LoginDialog.svelte";
  import { keyManager } from "./lib/keyManager";
  import { RelayManager } from "./lib/relayManager";
  import PostComponent from "./components/PostComponent.svelte";
  import SettingsDialog from "./components/SettingsDialog.svelte";
  import LogoutDialog from "./components/LogoutDialog.svelte";
  import SwUpdateModal from "./components/SwUpdateModal.svelte";
  import { getShareHandler } from "./lib/shareHandler"; // シングルトンを使用

  // UI状態管理
  let showDialog = false;
  let errorMessage = "";
  let showLogoutDialog = false;
  let showSwUpdateModal = false;

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

  // 共有画像処理状態
  let processingSharedImage = false;
  let sharedImageReceived = false;

  // Service Worker関連
  let waitingSw: ServiceWorker | null = null;

  // Nostr関連の初期化処理
  async function initializeNostr(pubkeyHex?: string): Promise<void> {
    rxNostr = createRxNostr({ verifier });
    profileManager = new ProfileManager(rxNostr);
    relayManager = new RelayManager(rxNostr);

    if (pubkeyHex) {
      const savedRelays = relayManager.getFromLocalStorage(pubkeyHex);

      if (savedRelays) {
        rxNostr.setDefaultRelays(savedRelays);
        console.log("ローカルストレージのリレーリストを使用:", savedRelays);
      } else {
        relayManager.setBootstrapRelays();
        await relayManager.fetchUserRelays(pubkeyHex);
      }

      const profile = await profileManager.fetchProfileData(pubkeyHex);
      if (profile) {
        profileData = profile;
        profileLoaded = true;
      }
    } else {
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

  function openLogoutDialog() {
    showLogoutDialog = true;
  }

  function closeLogoutDialog() {
    showLogoutDialog = false;
  }

  function logout() {
    const localeValue = localStorage.getItem("locale");
    const uploadEndpointValue = localStorage.getItem("uploadEndpoint");
    localStorage.clear();
    if (localeValue !== null) localStorage.setItem("locale", localeValue);
    if (uploadEndpointValue !== null)
      localStorage.setItem("uploadEndpoint", uploadEndpointValue);

    hasStoredKey = false;
    secretKey = "";
    publicKeyHex = "";
    publicKeyNpub = "";
    publicKeyNprofile = "";
    profileData = { name: "", picture: "" };
    profileLoaded = false;

    showLogoutDialog = false;
  }

  let showSettings = false;

  function openSettings() {
    showSettings = true;
  }
  function closeSettings() {
    showSettings = false;
  }

  $: if ($locale) {
    localStorage.setItem("locale", $locale);
  }

  function handleSwUpdate(sw: ServiceWorker) {
    showSwUpdateModal = true;
    waitingSw = sw;
  }

  function reloadForSwUpdate() {
    if (waitingSw) {
      waitingSw.postMessage({ type: "SKIP_WAITING" });
    }
    showSwUpdateModal = false;
    location.reload();
  }

  function cancelSwUpdateModal() {
    showSwUpdateModal = false;
    waitingSw = null;
  }

  onMount(async () => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale && storedLocale !== $locale) {
      locale.set(storedLocale);
    }

    const storedKey = keyManager.loadFromStorage();
    hasStoredKey = !!storedKey;

    if (storedKey && keyManager.isValidNsec(storedKey)) {
      const { hex } = keyManager.derivePublicKey(storedKey);
      publicKeyHex = hex;
      await initializeNostr(hex);
    } else {
      await initializeNostr();
    }

    // ShareHandlerのシングルトンを取得して共有画像を処理（簡素化）
    try {
      console.log("共有画像の確認を開始します");
      processingSharedImage = true;

      const shareHandler = getShareHandler();
      const sharedImageData = await shareHandler.checkForSharedImageOnLaunch();

      if (sharedImageData && sharedImageData.image) {
        console.log(
          "共有画像を検出しました:",
          sharedImageData.image.name,
          `サイズ: ${Math.round(sharedImageData.image.size / 1024)}KB`,
          `タイプ: ${sharedImageData.image.type}`,
        );
        sharedImageReceived = true;

        setTimeout(() => {
          sharedImageReceived = false;
        }, 5000);
      } else {
        console.log("共有画像はありませんでした");
      }
    } catch (error) {
      console.error("共有画像の処理中にエラーが発生しました:", error);
    } finally {
      setTimeout(() => {
        processingSharedImage = false;
      }, 500);
    }

    // Service Worker更新検知
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        location.reload();
      });

      navigator.serviceWorker.ready.then((reg) => {
        if (reg && reg.waiting) {
          handleSwUpdate(reg.waiting);
        }
        reg.addEventListener("updatefound", () => {
          const newSw = reg.installing;
          if (newSw) {
            newSw.addEventListener("statechange", () => {
              if (
                newSw.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                handleSwUpdate(newSw);
              }
            });
          }
        });
      });
    }
  });

  // デバッグメッセージ用
  let debugMessages: string[] = [];

  // 画面に表示するconsole.log/console.errorをフック
  function addDebugMessage(msg: string) {
    debugMessages = [...debugMessages, msg].slice(-10); // 最新10件のみ表示
  }

  // window.consoleをフック
  onMount(() => {
    const origLog = console.log;
    const origError = console.error;
    console.log = (...args) => {
      origLog(...args);
      addDebugMessage(
        "[LOG] " +
          args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
      );
    };
    console.error = (...args) => {
      origError(...args);
      addDebugMessage(
        "[ERROR] " +
          args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
      );
    };
  });
</script>

{#if $locale}
  <main>
    <!-- ヘッダー領域 -->
    <div class="header">
      <ProfileComponent
        {profileData}
        {profileLoaded}
        {hasStoredKey}
        {showLoginDialog}
        showLogoutDialog={openLogoutDialog}
      />
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

    <!-- ログアウトダイアログ -->
    {#if showLogoutDialog}
      <LogoutDialog
        show={showLogoutDialog}
        onClose={closeLogoutDialog}
        onLogout={logout}
      />
    {/if}

    <!-- 設定ダイアログ -->
    <SettingsDialog show={showSettings} onClose={closeSettings} />

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

    {#if processingSharedImage}
      <div class="loading-overlay">
        <p>{$_("processing_shared_image")}</p>
      </div>
    {/if}

    <!-- 共有画像受信通知 -->
    {#if sharedImageReceived && !processingSharedImage}
      <div class="shared-image-notification">
        <p>{$_("shared_image_received")}</p>
      </div>
    {/if}

    <!-- SW更新モーダル（コンポーネント化） -->
    <SwUpdateModal
      show={showSwUpdateModal}
      onReload={reloadForSwUpdate}
      onCancel={cancelSwUpdateModal}
    />

    <!-- デバッグメッセージ表示領域 -->
    <div class="debug-messages">
      {#each debugMessages as msg}
        <div>{msg}</div>
      {/each}
    </div>
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
    padding: 8px 8px 0 8px;
    box-sizing: border-box;
    background: transparent;
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
    transition:
      background 0.2s,
      box-shadow 0.1s,
      transform 0.1s;
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
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .debug-messages {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #222c;
    color: #fff;
    font-size: 0.85rem;
    max-height: 120px;
    overflow-y: auto;
    z-index: 2000;
    padding: 6px 10px;
    touch-action: auto;
  }
  .shared-image-notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 900;
    animation: fadeOut 5s forwards;
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    70% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }
</style>
