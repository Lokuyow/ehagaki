<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import "./i18n";
  import { _, locale } from "svelte-i18n";
  import { ProfileManager, type ProfileData } from "./lib/profileManager";
  import ProfileComponent from "./components/ProfileComponent.svelte";
  import LoginDialog from "./components/LoginDialog.svelte";
  import { keyManager, PublicKeyState } from "./lib/keyManager";
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

  // 公開鍵状態管理（統一・リアクティブ）
  const publicKeyState = new PublicKeyState();
  $: publicKeyState.setNsec(secretKey);

  // 公開鍵ストアをサブスクライブ
  let isValidKey = false;
  let currentHexKey = "";
  publicKeyState.isValid.subscribe((valid) => (isValidKey = valid));
  publicKeyState.hex.subscribe((hex) => (currentHexKey = hex));

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
    if (!isValidKey) {
      errorMessage = "";
      return;
    }

    const success = keyManager.saveToStorage(secretKey);
    if (success) {
      hasStoredKey = true;
      showDialog = false;
      errorMessage = "";

      if (currentHexKey) {
        await relayManager.fetchUserRelays(currentHexKey);
        const profile = await profileManager.fetchProfileData(currentHexKey);
        if (profile) {
          profileData = profile;
          profileLoaded = true;
        }
      }
    } else {
      errorMessage = "error_saving";
      publicKeyState.clear();
    }
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
    publicKeyState.clear();
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

  // SW更新通知メッセージ
  let swUpdateMessage = "Update available! Reloading...";

  function handleSwUpdate(sw: ServiceWorker) {
    showSwUpdateModal = true;
    waitingSw = sw;
    // 2秒後にskipWaitingしてリロード
    setTimeout(() => {
      if (waitingSw) {
        waitingSw.postMessage({ type: "SKIP_WAITING" });
      }
      showSwUpdateModal = false;
      location.reload();
    }, 2000);
  }

  onMount(async () => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale && storedLocale !== $locale) {
      locale.set(storedLocale);
    }

    const storedKey = keyManager.loadFromStorage();
    hasStoredKey = !!storedKey;

    if (storedKey) {
      publicKeyState.setNsec(storedKey);

      // ストアの値が更新されるまで少し待つ
      setTimeout(async () => {
        if (currentHexKey) {
          await initializeNostr(currentHexKey);
        } else {
          await initializeNostr();
        }
      }, 10);
    } else {
      await initializeNostr();
    }

    // ShareHandlerのシングルトンを取得して共有画像を処理（簡素化）
    try {
      console.log("共有画像の確認を開始します");

      const shareHandler = getShareHandler();
      const sharedImageData = await shareHandler.checkForSharedImageOnLaunch();

      if (sharedImageData && sharedImageData.image) {
        processingSharedImage = true; // 画像検出時のみtrueに
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
</script>

{#if $locale}
  <main>
    <!-- 投稿ボタン・画像アップロードボタンを最上部に配置 -->
    <div class="main-content">
      <PostComponent
        {rxNostr}
        {hasStoredKey}
        onPostSuccess={() => {
          // 必要に応じて投稿成功時の処理を追加
        }}
      />
    </div>

    <!-- 必要に応じて他のコンポーネントやUIをここに追加 -->

    {#if showDialog}
      <LoginDialog
        bind:secretKey
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

    <!-- SW更新モーダル（Popover API対応） -->
    <SwUpdateModal
      show={showSwUpdateModal}
      onReload={() => {}}
      message={swUpdateMessage}
    />

    <!-- ヘッダー領域を最下部に配置 -->
    <div class="footer-bar">
      <ProfileComponent
        {profileData}
        {profileLoaded}
        {hasStoredKey}
        {showLoginDialog}
        showLogoutDialog={openLogoutDialog}
      />
      <button class="settings-btn" on:click={openSettings} aria-label="設定">
        <img
          src="/ehagaki/icons/gear-solid-full.svg"
          alt="Settings"
          class="settings-icon"
        />
      </button>
    </div>
  </main>
{/if}

<style>
  main {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .main-content {
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* フッター分の下部余白を追加 */
    padding-bottom: 60px;
  }
  .footer-bar {
    width: 100%;
    height: 57px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 6px 6px 0 6px;
    background: #fff;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0 -2px 8px #0001;
    z-index: 100;
    padding-bottom: 6px;
  }
  .settings-btn {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 50%;
    width: 45px;
    height: 45px;
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
  .shared-image-notification {
    position: fixed;
    bottom: 80px; /* フッターの高さ分上に */
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
