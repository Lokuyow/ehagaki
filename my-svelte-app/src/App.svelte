<script lang="ts">
  import { run } from "svelte/legacy";

  import { onMount } from "svelte";
  import { createRxNostr } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import "./i18n";
  import { _, locale, waitLocale } from "svelte-i18n";
  import { ProfileManager } from "./lib/profileManager";
  import { RelayManager } from "./lib/relayManager";
  import PostComponent from "./components/PostComponent.svelte";
  import SettingsDialog from "./components/SettingsDialog.svelte";
  import LogoutDialog from "./components/LogoutDialog.svelte";
  import LoginDialog from "./components/LoginDialog.svelte";
  import { FileUploadManager } from "./lib/fileUploadManager";
  import { authService } from "./lib/authService";
  import HeaderComponent from "./components/HeaderComponent.svelte";
  import FooterComponent from "./components/FooterComponent.svelte";
  import {
    authState,
    sharedImageStore,
    hideImageSizeInfo,
    showLoginDialogStore,
    showLogoutDialogStore,
    showSettingsDialogStore,
    showLoginDialog,
    closeLoginDialog,
    openLogoutDialog,
    closeLogoutDialog,
    openSettingsDialog,
    closeSettingsDialog,
    swNeedRefresh,
    profileDataStore,
    profileLoadedStore,
    isLoadingProfileStore,
    isUploadingStore,
  } from "./lib/stores";
  import { placeholderTextStore } from "./lib/editor/store";
  import { debugLog, debugAuthState } from "./lib/debug";
  import type { UploadProgress } from "./lib/types"; // 追加

  // --- 秘密鍵入力・保存・認証 ---
  let errorMessage = $state("");
  let secretKey = $state("");
  const publicKeyState = authService.getPublicKeyState();
  run(() => {
    publicKeyState.setNsec(secretKey);
  });

  // --- 追加: ログインダイアログが開かれたら前の入力をクリア ---
  run(() => {
    if ($showLoginDialogStore) {
      secretKey = "";
      errorMessage = "";
    }
  });

  let isAuthenticated = $derived($authState.isAuthenticated);
  let isAuthInitialized = $derived($authState.isInitialized);

  // --- 追加: 初回レンダリング時にローカルストレージで即時認証判定 ---
  let initialAuthChecked = false;
  let initialIsAuthenticated = false;
  let initialPubkey = "";

  // ローカルストレージから即時判定
  if (!initialAuthChecked) {
    const nsec = localStorage.getItem("nsec");
    const nip46Raw = localStorage.getItem("__nostrlogin_nip46");
    if (nsec) {
      initialIsAuthenticated = true;
    } else if (nip46Raw) {
      try {
        const nip46 = JSON.parse(nip46Raw);
        if (nip46?.pubkey) {
          initialIsAuthenticated = true;
          initialPubkey = nip46.pubkey;
        }
      } catch (e) {
        // ignore
      }
    }
    initialAuthChecked = true;
  }

  run(() => {
    debugAuthState("Auth state changed", $authState);
  });

  let rxNostr: ReturnType<typeof createRxNostr> | undefined = $state();
  let profileManager: ProfileManager;
  let relayManager: RelayManager;
  let sharedImageReceived = false;
  let isLoadingNostrLogin = $state(false);
  let footerInfoDisplay: any;
  let postComponentRef: any = $state();
  let footerComponentRef: any = $state();

  async function initializeNostr(pubkeyHex?: string): Promise<void> {
    rxNostr = createRxNostr({ verifier });
    profileManager = new ProfileManager(rxNostr);
    relayManager = new RelayManager(rxNostr);
    isLoadingProfileStore.set(true);
    if (pubkeyHex) {
      if (!relayManager.useRelaysFromLocalStorageIfExists(pubkeyHex)) {
        relayManager.setBootstrapRelays();
      }
    } else {
      relayManager.setBootstrapRelays();
    }
    isLoadingProfileStore.set(false);
  }

  async function handleNostrLoginAuth(auth: any) {
    const result = await authService.authenticateWithNostrLogin(auth);
    if (!result.success) {
      console.error("nostr-login認証失敗:", result.error);
      return;
    }

    if (result.pubkeyHex) {
      isLoadingNostrLogin = true;
      isLoadingProfileStore.set(true);
      // bind:showで管理されているので、storeを直接更新
      showLoginDialogStore.set(false);

      try {
        await initializeNostr();
        await relayManager.fetchUserRelays(result.pubkeyHex);
        await loadProfileForPubkey(result.pubkeyHex);
      } catch (error) {
        console.error("nostr-login認証処理中にエラー:", error);
        isLoadingProfileStore.set(false);
      } finally {
        isLoadingNostrLogin = false;
        isLoadingProfileStore.set(false);
      }
    }
  }

  async function loadProfileForPubkey(
    pubkeyHex: string,
    opts?: { forceRemote?: boolean },
  ) {
    if (!pubkeyHex) return;
    if (!relayManager || !profileManager) await initializeNostr();
    isLoadingProfileStore.set(true);
    try {
      const profile = await profileManager.fetchProfileData(pubkeyHex, opts);
      if (profile) {
        profileDataStore.set(profile);
        profileLoadedStore.set(true);
      }
    } catch (error) {
      console.error("プロフィール読み込み中にエラー:", error);
    } finally {
      isLoadingProfileStore.set(false);
    }
  }

  // --- 秘密鍵認証・保存処理 ---
  async function saveSecretKey() {
    const result = await authService.authenticateWithNsec(secretKey);
    if (!result.success) {
      errorMessage = result.error || "authentication_error";
      return;
    }
    isLoadingProfileStore.set(true);
    // bind:showで管理されているので、storeを直接更新
    showLoginDialogStore.set(false);
    errorMessage = "";

    try {
      if (result.pubkeyHex) {
        if (
          relayManager &&
          !relayManager.useRelaysFromLocalStorageIfExists(result.pubkeyHex)
        ) {
          await relayManager.fetchUserRelays(result.pubkeyHex);
        }
        await loadProfileForPubkey(result.pubkeyHex);
      } else {
        isLoadingProfileStore.set(false);
      }
    } catch (e) {
      isLoadingProfileStore.set(false);
    }
  }

  function logout() {
    authService.logout();
    profileDataStore.set({ name: "", picture: "" });
    profileLoadedStore.set(false);
    if (postComponentRef?.resetPostContent) postComponentRef.resetPostContent();
    if (footerInfoDisplay?.updateProgress) {
      footerInfoDisplay.updateProgress({
        total: 0,
        completed: 0,
        failed: 0,
        inProgress: false,
      });
    }
    hideImageSizeInfo();
    // bind:showで管理されているので、storeを直接更新
    showLogoutDialogStore.set(false);

    // --- 追加: ログアウト時にも入力をクリアしておく ---
    secretKey = "";
    errorMessage = "";

    // --- 追加: sharedImageProcessedも削除 ---
    localStorage.removeItem("sharedImageProcessed");
  }

  async function loginWithNostrLogin() {
    isLoadingNostrLogin = true;
    try {
      await authService.showNostrLoginDialog();
    } catch (error) {
      if (!(error instanceof Error && error.message === "Cancelled")) {
        console.error("nostr-loginでエラー:", error);
      }
    } finally {
      isLoadingNostrLogin = false;
    }
  }

  run(() => {
    if ($locale) localStorage.setItem("locale", $locale);
  });

  // locale変更時にプレースホルダーを更新
  run(() => {
    if ($locale) {
      const text =
        $_("postComponent.enter_your_text") || "テキストを入力してください";
      placeholderTextStore.set(text);
    }
  });

  let localeInitialized = $state(false);

  // 共有画像取得済みフラグ
  const sharedImageAlreadyProcessed =
    localStorage.getItem("sharedImageProcessed") === "1";

  onMount(() => {
    // Define an inner async function for initialization
    const init = async () => {
      const storedLocale = localStorage.getItem("locale");
      if (storedLocale && storedLocale !== $locale) locale.set(storedLocale);
      await waitLocale();
      localeInitialized = true;

      // プレースホルダーテキストを初期化
      const initialPlaceholder =
        $_("postComponent.enter_your_text") || "テキストを入力してください";
      placeholderTextStore.set(initialPlaceholder);

      // 認証サービスの認証ハンドラーを先にセット
      authService.setNostrLoginHandler(handleNostrLoginAuth);

      // --- 修正: initializeAuthの処理を改善 ---
      (async () => {
        try {
          const authResult = await authService.initializeAuth();
          if (authResult.hasAuth && authResult.pubkeyHex) {
            await initializeNostr(authResult.pubkeyHex);
            await loadProfileForPubkey(authResult.pubkeyHex);
          } else {
            await initializeNostr();
          }
        } catch (error) {
          console.error("認証初期化中にエラー:", error);
          await initializeNostr();
        } finally {
          isLoadingProfileStore.set(false);
          authService.markAuthInitialized();
        }
      })();
      // --- ここまで ---

      // 共有画像取得: 取得済みならスキップ
      if (
        FileUploadManager.checkIfOpenedFromShare() &&
        !sharedImageAlreadyProcessed
      ) {
        try {
          const shared =
            await FileUploadManager.getSharedImageFromServiceWorker();
          if (shared?.image) {
            sharedImageStore.set({
              file: shared.image,
              metadata: shared.metadata,
              received: true,
            });
            // 取得済みフラグをセット
            localStorage.setItem("sharedImageProcessed", "1");
          }
        } catch (error) {
          console.error("共有画像の処理中にエラー:", error);
        }
      }
      debugLog("初期化完了", { isAuthenticated, isAuthInitialized });
    };

    // Call the async initializer
    init();

    // visibilitychangeイベントリスナー追加
    wasHidden = document.visibilityState === "hidden";
    document.addEventListener("visibilitychange", showBalloonOnActive);
    return () => {
      // visibilitychangeイベントリスナー削除
      document.removeEventListener("visibilitychange", showBalloonOnActive);
    };
  });

  run(() => {
    if (
      $sharedImageStore.received &&
      $sharedImageStore.file &&
      postComponentRef
    ) {
      postComponentRef.uploadFiles([$sharedImageStore.file]);
      sharedImageStore.set({
        file: null,
        metadata: undefined,
        received: false,
      });
      // 取得済みフラグをセット
      localStorage.setItem("sharedImageProcessed", "1");
      // 受信直後に一度クリア（次回共有のため）
      setTimeout(() => localStorage.removeItem("sharedImageProcessed"), 500);
    }
  });

  function handleUploadStatusChange(uploading: boolean) {
    isUploadingStore.set(uploading);
    if (!uploading) sharedImageReceived = false;
  }

  function handleUploadProgress(progress: UploadProgress): void {
    // 型を利用
    if (footerComponentRef) {
      footerComponentRef.updateProgress(progress);
    }
  }

  function handlePostSuccess() {
    // 投稿成功時にfooter情報を全て削除
    if (footerComponentRef?.reset) {
      footerComponentRef.reset();
    }
    // 共有画像フラグをクリア
    localStorage.removeItem("sharedImageProcessed");
  }

  // 追加: エディター内容クリア
  function handleResetPostContent() {
    postComponentRef?.resetPostContent();
  }

  // --- 追加: 設定ダイアログからのリレー・プロフィール再取得ハンドラ ---
  async function handleRefreshRelaysAndProfile() {
    if (!isAuthenticated || !$authState.pubkey) return;
    if (!relayManager || !profileManager) {
      await initializeNostr($authState.pubkey);
    }
    // ローカルストレージのキャッシュを使わず必ずリモート取得
    // 1. リレーリスト再取得
    if (relayManager) {
      await relayManager.fetchUserRelays($authState.pubkey, {
        forceRemote: true,
      });
    }
    // 2. プロフィール再取得
    if (profileManager) {
      // プロフィールキャッシュ削除
      profileManager.saveToLocalStorage($authState.pubkey, null);
      await loadProfileForPubkey($authState.pubkey, { forceRemote: true });
    }
  }

  // --- サイトアクセス時バルーン表示用 ---
  function getRandomHeaderBalloon() {
    const keys = [
      "balloonMessage.hello",
      "balloonMessage.hello2",
      "balloonMessage.welcome",
      "balloonMessage.waited",
      "balloonMessage.relax",
      "balloonMessage.good_weather",
      "balloonMessage.thwomp",
      "balloonMessage.sleep_on_floor",
      "balloonMessage.home_here",
      "balloonMessage.donai",
      "balloonMessage.kita_na",
      "balloonMessage.no_licking",
      "balloonMessage.not_thwomp",
      "balloonMessage.kitte_origin",
      "balloonMessage.normal_stamp",
      "balloonMessage.backside_curious",
      "balloonMessage.corner_weapon",
      "balloonMessage.square_peace",
      "balloonMessage.how_much_stamp",
      "balloonMessage.cancellation_done",
      "balloonMessage.want_to_roll",
      "balloonMessage.want_candy",
      "balloonMessage.tetris_gone",
    ];
    const idx = Math.floor(Math.random() * keys.length);
    return $_(keys[idx]);
  }
  let showHeaderBalloon = $state(true);
  let headerBalloonMessage = $state("");

  // localeInitializedがtrueになったタイミングでメッセージをセット
  run(() => {
    if (localeInitialized) {
      headerBalloonMessage = getRandomHeaderBalloon();
      showHeaderBalloon = true;
      setTimeout(() => {
        showHeaderBalloon = false;
      }, 3000);
    }
  });

  // --- 追加: visibilitychangeでアクティブ時のみバルーン表示 ---
  let wasHidden = false;
  function showBalloonOnActive() {
    // 「非アクティブ→アクティブ」になった瞬間のみ
    if (
      document.visibilityState === "visible" &&
      wasHidden &&
      localeInitialized
    ) {
      if (!showHeaderBalloon) {
        headerBalloonMessage = getRandomHeaderBalloon();
        showHeaderBalloon = true;
        setTimeout(() => {
          showHeaderBalloon = false;
        }, 3000);
      }
    }
    wasHidden = document.visibilityState === "hidden";
  }
</script>

{#if $locale && localeInitialized}
  <main>
    <div class="main-content">
      <HeaderComponent
        onUploadImage={() => postComponentRef?.openFileDialog()}
        onResetPostContent={handleResetPostContent}
        balloonMessage={showHeaderBalloon && headerBalloonMessage
          ? { type: "info", message: headerBalloonMessage }
          : null}
      />
      <PostComponent
        bind:this={postComponentRef}
        {rxNostr}
        hasStoredKey={isAuthenticated}
        onPostSuccess={handlePostSuccess}
        onUploadStatusChange={handleUploadStatusChange}
        onUploadProgress={handleUploadProgress}
      />
    </div>
    <FooterComponent
      bind:this={footerComponentRef}
      {isAuthenticated}
      {isAuthInitialized}
      isLoadingProfile={$isLoadingProfileStore}
      profileLoaded={$profileLoadedStore}
      profileData={$profileDataStore}
      swNeedRefresh={$swNeedRefresh}
      onShowLoginDialog={showLoginDialog}
      onOpenSettingsDialog={openSettingsDialog}
      onOpenLogoutDialog={openLogoutDialog}
    />
    {#if $showLoginDialogStore}
      <LoginDialog
        bind:show={$showLoginDialogStore}
        bind:secretKey
        onClose={closeLoginDialog}
        onSave={saveSecretKey}
        onNostrLogin={loginWithNostrLogin}
        {isLoadingNostrLogin}
      />
    {/if}
    {#if $showLogoutDialogStore}
      <LogoutDialog
        bind:show={$showLogoutDialogStore}
        onClose={closeLogoutDialog}
        onLogout={logout}
      />
    {/if}
    <SettingsDialog
      show={$showSettingsDialogStore}
      onClose={closeSettingsDialog}
      onRefreshRelaysAndProfile={handleRefreshRelaysAndProfile}
    />
  </main>
{/if}

<style>
  main {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100svh;
    overflow: hidden;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 12px;
    width: 100%;
    height: calc(100% - 78px);
    overflow: hidden;
  }
</style>
