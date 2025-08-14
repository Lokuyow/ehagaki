<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import "./i18n";
  import { _, locale, waitLocale } from "svelte-i18n";
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
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import { nostrLoginManager } from "./lib/nostrLogin";
  import Button from "./components/Button.svelte";
  import LoadingPlaceholder from "./components/LoadingPlaceholder.svelte";
  // 認証状態ストアを追加
  import {
    authState,
    sharedImageStore,
    hideImageSizeInfo,
    setAuthInitialized,
    setNsecAuth
  } from "./lib/stores";
  import { debugLog, debugAuthState } from "./lib/debug";

  // Service Worker更新関連 - 公式実装を使用
  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(r) {
      console.log("SW registered:", r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
    onNeedRefresh() {
      console.log("SW needs refresh - showing prompt");
    },
  });

  // リアクティブに状態を監視
  $: {
    console.log("SW states:", {
      needRefresh: $needRefresh,
      showModal: $needRefresh,
    });
  }

  $: showSwUpdateModal = $needRefresh;

  function closeSwUpdateModal() {
    console.log("Closing SW update modal");
    needRefresh.set(false);
  }

  function handleSwUpdate() {
    console.log("Handling SW update - reloading page");
    updateServiceWorker(true);
  }

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
  $: currentHexKey = $authState.pubkey;
  $: isNostrLoginAuth = $authState.type === "nostr-login";
  $: isAuthInitialized = $authState.isInitialized; // 初期化完了フラグ

  // 認証状態変化のデバッグログ
  $: debugAuthState("Auth state changed", $authState);

  // プロフィール情報
  let profileData: ProfileData = {
    name: "",
    picture: "",
  };

  // 初期状態: 読み込み中
  let profileLoaded = false;
  let isLoadingProfile = true; // ← 初期値をtrueに

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

  // PostComponentへの参照を追加
  let postComponentRef: any;

  // Nostr関連の初期化処理
  async function initializeNostr(pubkeyHex?: string): Promise<void> {
    rxNostr = createRxNostr({ verifier });
    profileManager = new ProfileManager(rxNostr);
    relayManager = new RelayManager(rxNostr);

    isLoadingProfile = true; // ← 初期化開始時にtrue
    if (pubkeyHex) {
      // 共通化関数でローカルストレージのリレーリストを利用
      if (!relayManager.useRelaysFromLocalStorageIfExists(pubkeyHex)) {
        relayManager.setBootstrapRelays();
      }

      const profile = await profileManager.fetchProfileData(pubkeyHex);
      if (profile) {
        profileData = profile;
        profileLoaded = true;
      }
    } else {
      relayManager.setBootstrapRelays();
    }
    isLoadingProfile = false; // ← 初期化終了時にfalse
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

      // プレースホルダー表示開始
      isLoadingProfile = true;

      try {
        // Nostrクライアントを初期化
        await initializeNostr();

        // リレー情報を確実に取得
        console.log("nostr-loginユーザーのリレー情報を取得中...");
        await relayManager.fetchUserRelays(auth.pubkey);

        // リレー設定後、プロフィールを読み込み
        console.log("nostr-loginユーザーのプロフィールを取得中...");
        await loadProfileForPubkey(auth.pubkey);

        console.log("nostr-login認証処理完了");
      } catch (error) {
        console.error("nostr-login認証処理中にエラーが発生:", error);
        // エラーが発生してもローディング状態を解除
        isLoadingProfile = false;
      }

      // nostr-login認証が完了したらログインダイアログを閉じる
      showDialog = false;
    }
  }

  // 指定された公開鍵でプロフィールを読み込み
  async function loadProfileForPubkey(pubkeyHex: string) {
    if (!pubkeyHex) {
      console.warn("loadProfileForPubkey: pubkeyHexが空です");
      return;
    }

    console.log(`プロフィール読み込み開始: ${pubkeyHex}`);

    // relayManagerとprofileManagerが初期化されているかチェック
    if (!relayManager || !profileManager) {
      console.warn("relayManagerまたはprofileManagerが初期化されていません");
      await initializeNostr();
    }

    isLoadingProfile = true;

    try {
      const profile = await profileManager.fetchProfileData(pubkeyHex);
      if (profile) {
        profileData = profile;
        profileLoaded = true;
        console.log("プロフィール読み込み完了:", profile);
      } else {
        console.warn("プロフィール取得に失敗しました");
      }
    } catch (error) {
      console.error("プロフィール読み込み中にエラーが発生:", error);
    } finally {
      isLoadingProfile = false;
    }
  }

  async function saveSecretKey() {
    // 入力値で直接バリデーション（グローバル状態に依存しない）
    if (!keyManager.isValidNsec(secretKey)) {
      errorMessage = "invalid_secret";
      return;
    }

    // プレースホルダー表示開始
    isLoadingProfile = true;

    const { success } = keyManager.saveToStorage(secretKey);
    if (success) {
      showDialog = false;
      errorMessage = "";

      // 保存時のみグローバル認証状態を更新
      try {
        const derived = keyManager.derivePublicKey(secretKey);
        if (derived.hex) {
          setNsecAuth(derived.hex, derived.npub, derived.nprofile);

          // リレー設定とプロフィール取得
          if (
            relayManager &&
            !relayManager.useRelaysFromLocalStorageIfExists(derived.hex)
          ) {
            await relayManager.fetchUserRelays(derived.hex);
          }
          await loadProfileForPubkey(derived.hex);
        } else {
          console.warn("鍵の派生に失敗しました");
          isLoadingProfile = false;
        }
      } catch (e) {
        console.error("保存処理中の鍵派生でエラー:", e);
        isLoadingProfile = false;
      }
    } else {
      errorMessage = "error_saving";
      publicKeyState.clear();
      isLoadingProfile = false;
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
    debugLog("ログアウト処理開始");

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

    // PostComponentの投稿内容をクリア
    if (
      postComponentRef &&
      typeof postComponentRef.resetPostContent === "function"
    ) {
      postComponentRef.resetPostContent();
    }

    showLogoutDialog = false;

    // フッター情報をクリア
    if (
      footerInfoDisplay &&
      typeof footerInfoDisplay.updateProgress === "function"
    ) {
      footerInfoDisplay.updateProgress({
        total: 0,
        completed: 0,
        failed: 0,
        inProgress: false,
      });
    }
    // 画像サイズ情報もクリア
    hideImageSizeInfo();

    debugLog("ログアウト処理完了");
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

  // ロケール初期化フラグを追加
  let localeInitialized = false;

  onMount(async () => {
    // ロケール初期化を最優先で実行
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale && storedLocale !== $locale) {
      locale.set(storedLocale);
    }

    // 追加: 辞書ロード完了を待つ（これが完了するまで描画しない）
    await waitLocale();
    localeInitialized = true;

    let hasNostrLoginAuth = false;

    // nostr-loginを初期化
    try {
      await nostrLoginManager.init({
        theme: "default",
        darkMode: false,
        perms: "sign_event:1,sign_event:0",
        noBanner: true,
      });

      // 認証ハンドラーを設定
      nostrLoginManager.setAuthHandler(handleNostrLoginAuth);

      // nostr-loginの認証状態をより確実にチェック
      await new Promise((resolve) => setTimeout(resolve, 200)); // 初期化完了を少し長めに待つ

      const currentUser = nostrLoginManager.getCurrentUser();
      if (currentUser && currentUser.pubkey) {
        console.log("既存のnostr-login認証を復元:", currentUser);
        hasNostrLoginAuth = true;
        await handleNostrLoginAuth({
          type: "login",
          pubkey: currentUser.pubkey,
          npub: currentUser.npub,
        });
      }
    } catch (error) {
      console.error("nostr-login初期化失敗:", error);
    }

    // nsec認証のチェック（nostr-login認証がない場合のみ）
    if (!hasNostrLoginAuth) {
      const storedKey = keyManager.loadFromStorage();

      if (storedKey) {
        // 入力用のローカル状態は更新（UI用）
        publicKeyState.setNsec(storedKey);

        try {
          // 起動時の復元でも一度だけグローバル認証状態を更新
          const derived = keyManager.derivePublicKey(storedKey);
          if (derived.hex) {
            setNsecAuth(derived.hex, derived.npub, derived.nprofile);
            await initializeNostr(derived.hex);
            await loadProfileForPubkey(derived.hex);
          } else {
            await initializeNostr();
          }
        } catch (e) {
          console.error("起動時の鍵復元でエラー:", e);
          await initializeNostr();
        }

        isLoadingProfile = false;
        setAuthInitialized();
      } else {
        await initializeNostr();
        isLoadingProfile = false;
        setAuthInitialized();
      }
    } else {
      // nostr-login認証がある場合も初期化完了を設定
      setAuthInitialized();
    }

    try {
      console.log("共有画像の確認を開始します");
      const shareHandler = getShareHandler();
      await shareHandler.checkForSharedImageOnLaunch();
      // 以降の処理はストアのリアクティブで行う
    } catch (error) {
      console.error("共有画像の処理中にエラーが発生しました:", error);
    }

    // デバッグ用: 開発環境のみSW更新ダイアログ強制表示関数をwindowに追加
    if (import.meta.env.MODE === "development") {
      window.showSwUpdateModalDebug = () => {
        needRefresh.set(true);
        console.log("SW更新ダイアログを強制表示しました");
      };
    }

    debugLog("初期化完了", { isAuthenticated, isAuthInitialized });
  });

  // 共有画像ストアの購読
  $: if (
    $sharedImageStore.received &&
    $sharedImageStore.file &&
    postComponentRef
  ) {
    // 受信済みフラグを一度だけ処理
    postComponentRef.uploadFiles([$sharedImageStore.file]);
    // ストアをリセット
    sharedImageStore.set({ file: null, metadata: undefined, received: false });
  }

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

<!-- ロケールが初期化されてから描画 -->
{#if $locale && localeInitialized}
  <main>
    <!-- 投稿ボタン・画像アップロードボタンを最上部に配置 -->
    <div class="main-content">
      <PostComponent
        bind:this={postComponentRef}
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
        {isLoadingProfile}
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
    {#if showSwUpdateModal}
      <SwUpdateModal
        show={showSwUpdateModal}
        needRefresh={$needRefresh}
        onReload={handleSwUpdate}
        onClose={closeSwUpdateModal}
      />
    {/if}

    <!-- フッター -->
    <div class="footer-bar">
      {#if isAuthenticated && isLoadingProfile}
        <!-- プレースホルダー表示 -->
        <Button className="profile-display btn-round loading" disabled={true}>
          <LoadingPlaceholder text="" showImage={true} />
        </Button>
      {:else if isAuthenticated && (profileLoaded || isLoadingProfile)}
        <ProfileComponent
          {profileData}
          hasStoredKey={isAuthenticated}
          {isLoadingProfile}
          showLogoutDialog={openLogoutDialog}
        />
      {:else if !isLoadingProfile && !isAuthenticated && isAuthInitialized}
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
    height: 100svh;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    width: 100%;
    height: calc(100% - 10px - 66px);
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
    --btn-bg: var(--theme);
    width: 140px;
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

  :global(.profile-display.loading) {
    opacity: 0.7;
    padding: 0;
  }
</style>
