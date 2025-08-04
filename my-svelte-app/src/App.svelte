<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import "./i18n";
  import { _, locale } from "svelte-i18n";
  import { ProfileManager, type ProfileData } from "./lib/profileManager";
  import ProfileComponent from "./components/ProfileComponent.svelte";
  import { keyManager, PublicKeyState } from "./lib/keyManager";
  import { RelayManager } from "./lib/relayManager";
  import PostComponent from "./components/PostComponent.svelte";
  import SettingsDialog from "./components/SettingsDialog.svelte";
  import LogoutDialog from "./components/LogoutDialog.svelte";
  import LoginDialog from "./components/LoginDialog.svelte";
  import SwUpdateModal from "./components/SwUpdateModal.svelte";
  import FooterInfoDisplay from "./components/FooterInfoDisplay.svelte";
  import { getShareHandler } from "./lib/shareHandler";
  import { useSwUpdate } from "./lib/useSwUpdate";
  import { nostrLoginManager } from "./lib/nostrLogin";
  import Button from "./components/Button.svelte";
  // 認証状態ストアを追加
  import { authState, clearAuthState } from "./lib/stores";

  // Service Worker更新関連
  const {
    showSwUpdateModal: swUpdateStore,
    reloadForSwUpdate,
    handleSwUpdate,
  } = useSwUpdate();
  let showSwUpdateModal = false;

  // UI状態管理
  let showDialog = false;
  let errorMessage = "";
  let showLogoutDialog = false;

  // 認証関連 - ストアから取得するように変更
  let secretKey = "";

  // 公開鍵状態管理（統一・リアクティブ）
  const publicKeyState = new PublicKeyState();
  $: publicKeyState.setNsec(secretKey);

  // 認証状態をストアから取得
  $: isAuthenticated = $authState.isAuthenticated;
  $: authType = $authState.type;
  $: currentHexKey = $authState.pubkey;
  $: isNostrLoginAuth = $authState.type === "nostr-login";

  // プロフィール情報
  let profileData: ProfileData = {
    name: "",
    picture: "",
  };

  let profileLoaded = false;
  let isLoadingProfile = false; // 追加: プロフィール読み込み状態

  // Nostrクライアントインスタンス
  let rxNostr: ReturnType<typeof createRxNostr>;

  // プロフィールマネージャーインスタンス
  let profileManager: ProfileManager;

  // リレーマネージャーインスタンス
  let relayManager: RelayManager;

  // 共有画像処理状態
  let sharedImageReceived = false;
  let isUploading = false;

  // FooterInfoDisplayコンポーネントへの参照
  let footerInfoDisplay: any;

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

  // nostr-login認証ハンドラー
  async function handleNostrLoginAuth(auth: any) {
    if (auth.type === "logout") {
      // nostr-loginからのログアウト時は、nostrLoginManager.logout()を呼ばない
      logoutInternal();
      return;
    }

    if (auth.pubkey) {
      console.log("nostr-login認証成功:", auth);
      publicKeyState.setNostrLoginAuth(auth);

      // Nostrクライアントを初期化してからプロフィール読み込み
      await initializeNostr(auth.pubkey);

      // リレーが確実に設定されるまで少し待つ
      setTimeout(async () => {
        await loadProfileForPubkey(auth.pubkey);
      }, 500);
    }
  }

  // 指定された公開鍵でプロフィールを読み込み
  async function loadProfileForPubkey(pubkeyHex: string) {
    if (!pubkeyHex) return;

    // relayManagerとprofileManagerが初期化されているかチェック
    if (!relayManager || !profileManager) {
      console.warn("relayManagerまたはprofileManagerが初期化されていません");
      await initializeNostr(pubkeyHex);
    }

    isLoadingProfile = true;
    await relayManager.fetchUserRelays(pubkeyHex);
    const profile = await profileManager.fetchProfileData(pubkeyHex);
    if (profile) {
      profileData = profile;
    }
    profileLoaded = true;
    isLoadingProfile = false;
  }

  async function saveSecretKey() {
    // ストアの状態を確認
    if (!$authState.isValid) {
      errorMessage = "";
      return;
    }

    const success = keyManager.saveToStorage(secretKey);
    if (success) {
      showDialog = false;
      errorMessage = "";

      if (currentHexKey) {
        await loadProfileForPubkey(currentHexKey);
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
    logoutInternal();

    // nostr-loginからもログアウト（手動ログアウトの場合のみ）
    if (nostrLoginManager.isInitialized) {
      nostrLoginManager.logout();
    }
  }

  // 内部ログアウト処理（nostr-loginManager.logout()を呼ばない）
  function logoutInternal() {
    const localeValue = localStorage.getItem("locale");
    const uploadEndpointValue = localStorage.getItem("uploadEndpoint");
    localStorage.clear();
    if (localeValue !== null) localStorage.setItem("locale", localeValue);
    if (uploadEndpointValue !== null)
      localStorage.setItem("uploadEndpoint", uploadEndpointValue);

    secretKey = "";
    publicKeyState.clear(); // これでclearAuthState()も呼ばれる
    profileData = { name: "", picture: "" };
    profileLoaded = false;

    showLogoutDialog = false;
  }

  // nostr-loginを使ったログイン
  function loginWithNostrLogin() {
    if (nostrLoginManager.isInitialized) {
      nostrLoginManager.showLogin();
    } else {
      console.error("nostr-loginが初期化されていません");
    }
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
  let swUpdateMessage = "Updating...";

  // サービスワーカーのストアを監視
  swUpdateStore.subscribe((value) => {
    showSwUpdateModal = value;
  });

  onMount(async () => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale && storedLocale !== $locale) {
      locale.set(storedLocale);
    }

    // nostr-loginを初期化
    try {
      await nostrLoginManager.init({
        theme: "default",
        darkMode: false,
        perms: "sign_event:1,sign_event:0",
        noBanner: true, // 明示的にバナーを無効化
      });

      // 認証ハンドラーを設定
      nostrLoginManager.setAuthHandler(handleNostrLoginAuth);

      // 初期化時の自動認証チェックは削除
      // window.nostrの自動チェックによるダイアログ表示を防ぐ
    } catch (error) {
      console.error("nostr-login初期化失敗:", error);
    }

    const storedKey = keyManager.loadFromStorage();

    if (storedKey) {
      publicKeyState.setNsec(storedKey);

      // ストアの値が更新されるまで少し待つ
      setTimeout(async () => {
        if (currentHexKey) {
          await initializeNostr(currentHexKey);
          await loadProfileForPubkey(currentHexKey);
        } else {
          await initializeNostr();
        }
      }, 10);
    } else {
      await initializeNostr();
    }

    // 共有画像処理（ShareHandler）- 統合された機能を使用
    try {
      console.log("共有画像の確認を開始します");

      const shareHandler = getShareHandler();
      const sharedImageData = await shareHandler.checkForSharedImageOnLaunch();

      if (sharedImageData && sharedImageData.image) {
        console.log(
          "共有画像を検出しました:",
          sharedImageData.image.name,
          `サイズ: ${Math.round(sharedImageData.image.size / 1024)}KB`,
          `タイプ: ${sharedImageData.image.type}`,
        );

        // カスタムイベントでPostComponentに共有画像を通知
        window.dispatchEvent(
          new CustomEvent("shared-image-received", {
            detail: { file: sharedImageData.image },
          }),
        );
      } else {
        console.log("共有画像はありませんでした");
      }
    } catch (error) {
      console.error("共有画像の処理中にエラーが発生しました:", error);
    }

    // Service Worker更新検知を即時に行う
    if ("serviceWorker" in navigator) {
      // 即座に更新チェック
      handleSwUpdate();

      // ページの表示状態が変わった時に再チェック
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          navigator.serviceWorker.ready.then((reg) => {
            if (reg.waiting) {
              handleSwUpdate(reg.waiting);
            }
          });
        }
      });
    }
  });

  function handleUploadStatusChange(uploading: boolean) {
    isUploading = uploading;
    if (!uploading) {
      sharedImageReceived = false;
    }
  }

  // アップロード進捗情報を受け取る関数（FooterInfoDisplayに転送）
  function handleUploadProgress(progress: {
    total: number;
    completed: number;
    failed: number;
    inProgress: boolean;
  }): void {
    if (footerInfoDisplay) {
      footerInfoDisplay.updateProgress(progress);
    }
  }
</script>

{#if $locale}
  <main>
    <!-- 投稿ボタン・画像アップロードボタンを最上部に配置 -->
    <div class="main-content">
      <PostComponent
        {rxNostr}
        hasStoredKey={isAuthenticated}
        {isNostrLoginAuth}
        onPostSuccess={() => {
          // 必要に応じて投稿成功時の処理を追加
        }}
        onUploadStatusChange={handleUploadStatusChange}
        onUploadProgress={handleUploadProgress}
      />
    </div>

    <!-- 必要に応じて他のコンポーネントやUIをここに追加 -->

    {#if showDialog}
      <LoginDialog
        bind:secretKey
        {errorMessage}
        onClose={closeDialog}
        onSave={saveSecretKey}
        onNostrLogin={loginWithNostrLogin}
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

    <!-- SW更新モーダル -->
    <SwUpdateModal
      show={showSwUpdateModal}
      onReload={reloadForSwUpdate}
      message={swUpdateMessage}
    />

    <!-- フッター -->
    <div class="footer-bar">
      {#if isAuthenticated && (profileLoaded || isLoadingProfile)}
        <ProfileComponent
          {profileData}
          {profileLoaded}
          hasStoredKey={isAuthenticated}
          {isLoadingProfile}
          showLogoutDialog={openLogoutDialog}
        />
      {:else}
        <Button className="login-btn btn-round" on:click={showLoginDialog}>
          {$_("login")}
        </Button>
      {/if}

      <FooterInfoDisplay bind:this={footerInfoDisplay} />

      <Button
        className="settings-btn btn-circle"
        on:click={openSettings}
        ariaLabel="設定"
      >
        <div class="settings-icon svg-icon" aria-label="Settings"></div>
      </Button>
    </div>
  </main>
{/if}

<style>
  main {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100dvh;
  }
  .main-content {
    margin-top: 10px;
    width: 100%;
    height: calc(100% - 10px - 66px);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .footer-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 800px;
    height: 66px;
    gap: 8px;
    margin: auto;
    padding: 8px;
    background: var(--bg-footer);
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0 -2px 8px var(--shadow);
    z-index: 99;
  }

  :global(.login-btn) {
    background: var(--theme);
    width: 110px;
    border: none;
    color: #fff;
    font-weight: 500;
    font-size: 1.1rem;
    z-index: 10;
  }

  :global(.settings-btn) {
    border: 1px solid var(--border);
  }

  .settings-icon {
    mask-image: url("/ehagaki/icons/gear-solid-full.svg");
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
