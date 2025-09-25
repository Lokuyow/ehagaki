<script lang="ts">
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
    relayListUpdatedStore, // 追加
  } from "./stores/appStore.svelte";
  import { updatePlaceholderText } from "./stores/editorStore.svelte";
  import { debugLog, debugAuthState } from "./lib/debug";
  import type { UploadProgress } from "./lib/types"; // 追加
  import { getDefaultEndpoint } from "./lib/constants";
  import {
    BalloonMessageManager,
    type BalloonMessage,
  } from "./lib/balloonMessageManager";
  import {
    checkServiceWorkerStatus,
    testServiceWorkerCommunication,
    getSharedImageWithFallback,
  } from "./lib/utils/appUtils";
  import { checkIfOpenedFromShare } from "./lib/shareHandler";

  // --- 秘密鍵入力・保存・認証 ---
  let errorMessage = $state("");
  let secretKey = $state("");
  const publicKeyState = authService.getPublicKeyState();
  $effect(() => {
    publicKeyState.setNsec(secretKey);
  });

  // --- 追加: ログインダイアログが開かれたら前の入力をクリア ---
  $effect(() => {
    if (showLoginDialogStore.value) {
      secretKey = "";
      errorMessage = "";
    }
  });

  let isAuthenticated = $derived(authState.value?.isAuthenticated ?? false);
  let isAuthInitialized = $derived(authState.value?.isInitialized ?? false);

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

  $effect(() => {
    // authStateの値が正常に設定されているかチェック
    const currentAuth = authState.value;
    if (currentAuth && typeof currentAuth === "object") {
      debugAuthState("Auth state changed", currentAuth);
    }
  });

  let rxNostr: ReturnType<typeof createRxNostr> | undefined = $state();
  let profileManager: ProfileManager;
  let relayManager: RelayManager;
  let sharedImageReceived = false;
  let isLoadingNostrLogin = $state(false);
  let footerInfoDisplay: any;
  let postComponentRef: any = $state();
  let footerComponentRef: any = $state();
  let isLoggingOut = $state(false); // 追加: ログアウト中の状態管理

  async function initializeNostr(pubkeyHex?: string): Promise<void> {
    rxNostr = createRxNostr({ verifier });
    profileManager = new ProfileManager(rxNostr);
    relayManager = new RelayManager(rxNostr, {
      relayListUpdatedStore: {
        value: relayListUpdatedStore.value,
        set: (v: number) => relayListUpdatedStore.set(v),
      },
    });
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
    debugLog("NostrLogin認証コールバック受信:", auth);

    const result = await authService.authenticateWithNostrLogin(auth);
    if (!result.success) {
      console.error("nostr-login認証失敗:", result.error);
      return;
    }

    debugLog("NostrLogin認証結果:", result);

    if (result.pubkeyHex) {
      isLoadingNostrLogin = true;
      isLoadingProfileStore.set(true);

      // ダイアログを閉じる
      closeLoginDialog();

      try {
        await initializeNostr();
        await relayManager.fetchUserRelays(result.pubkeyHex);
        await loadProfileForPubkey(result.pubkeyHex);
        debugLog("NostrLogin認証処理完了:", { pubkey: result.pubkeyHex });

        // 認証状態の反映を確認
        setTimeout(() => {
          const currentAuth = authState.value;
          debugLog("NostrLogin認証後の認証状態:", {
            type: currentAuth.type,
            isAuthenticated: currentAuth.isAuthenticated,
            pubkey: currentAuth.pubkey
              ? currentAuth.pubkey.substring(0, 8) + "..."
              : "empty",
          });
        }, 100);
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
    // ダイアログを閉じる
    closeLoginDialog();
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
    isLoggingOut = true; // 追加: ログアウト開始時にローディング状態をtrueに
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
    // 削除: closeLogoutDialog(); // ダイアログを開いたままにする

    // ログアウト時にも入力をクリアしておく
    secretKey = "";
    errorMessage = "";
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

  $effect(() => {
    if ($locale) localStorage.setItem("locale", $locale);
  });

  // locale変更時にプレースホルダーを更新
  $effect(() => {
    if ($locale) {
      const text =
        $_("postComponent.enter_your_text") || "テキストを入力してください";
      updatePlaceholderText(text);
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
      updatePlaceholderText(initialPlaceholder);

      // 認証サービスの認証ハンドラーを先にセット
      debugLog("NostrLogin認証ハンドラーをセット");
      authService.setNostrLoginHandler(handleNostrLoginAuth);

      // Service Worker状態チェック（本番環境でも実行）
      if (checkIfOpenedFromShare()) {
        const swStatus = await checkServiceWorkerStatus();
        const canCommunicate = await testServiceWorkerCommunication();

        console.log("Service Worker Status:", {
          isReady: swStatus.isReady,
          hasController: swStatus.hasController,
          canCommunicate,
          error: swStatus.error,
        });

        if (!swStatus.isReady || !swStatus.hasController || !canCommunicate) {
          console.warn(
            "Service Worker not ready for shared image processing:",
            swStatus,
          );
        }
      }

      // --- 修正: initializeAuthの処理を改善 ---
      (async () => {
        try {
          debugLog("認証初期化開始");
          const authResult = await authService.initializeAuth();
          debugLog("認証初期化結果:", authResult);

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

      // 共有画像取得: エラーパラメータがあっても実際に画像が取得できるかチェック
      if (checkIfOpenedFromShare() && !sharedImageAlreadyProcessed) {
        try {
          // まず実際に共有画像が取得できるかチェック
          const shared = await getSharedImageWithFallback();
          if (shared?.image) {
            // 画像が取得できた場合は、エラーパラメータを無視して処理を続行
            sharedImageStore.file = shared.image;
            sharedImageStore.metadata = shared.metadata;
            sharedImageStore.received = true;
            localStorage.setItem("sharedImageProcessed", "1");
            console.log(
              "Shared image successfully loaded despite error parameter:",
              {
                name: shared.image.name,
                size: shared.image.size,
                type: shared.image.type,
              },
            );

            // 成功した場合はエラーパラメータをクリア
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get("error")) {
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.delete("error");
              newUrl.searchParams.delete("shared");
              window.history.replaceState({}, "", newUrl.toString());
              console.log(
                "Cleared error parameters after successful image loading",
              );
            }
          } else {
            console.warn("No shared image data received");
            // 画像が取得できない場合のみエラーパラメータをログ出力
            const urlParams = new URLSearchParams(window.location.search);
            const sharedError = urlParams.get("error");
            if (sharedError) {
              console.error(
                "Shared image processing failed with error parameter:",
                {
                  error: sharedError,
                  location: window.location.href,
                },
              );
            }
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

  $effect(() => {
    if (
      sharedImageStore.received &&
      sharedImageStore.file &&
      postComponentRef
    ) {
      postComponentRef.uploadFiles([sharedImageStore.file]);
      sharedImageStore.file = null;
      sharedImageStore.metadata = undefined;
      sharedImageStore.received = false;
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

  // バルーンメッセージマネージャー
  let balloonManager: BalloonMessageManager | null = null;

  // --- 設定ダイアログからのリレー・プロフィール再取得ハンドラ ---
  async function handleRefreshRelaysAndProfile() {
    if (!isAuthenticated || !authState.value.pubkey) return;
    if (!relayManager || !profileManager) {
      await initializeNostr(authState.value.pubkey);
    }
    // ローカルストレージのキャッシュを使わず必ずリモート取得
    // 1. リレーリスト再取得
    if (relayManager) {
      await relayManager.fetchUserRelays(authState.value.pubkey, {
        forceRemote: true,
      });
    }
    // 2. プロフィール再取得
    if (profileManager) {
      // プロフィールキャッシュ削除
      profileManager.saveToLocalStorage(authState.value.pubkey, null);
      await loadProfileForPubkey(authState.value.pubkey, { forceRemote: true });
    }
  }

  let showHeaderBalloon = $state(false);
  let headerBalloonMessage = $state<BalloonMessage | null>(null);
  let hasShownInitialBalloon = $state(false); // 初回バルーン表示済みフラグ

  // バルーンメッセージマネージャーの初期化
  $effect(() => {
    if ($_ && !balloonManager) {
      balloonManager = new BalloonMessageManager($_);
    }
  });

  // localeInitializedがtrueになったタイミングでメッセージをセット（一度だけ）
  $effect(() => {
    if (
      localeInitialized &&
      balloonManager &&
      !showHeaderBalloon &&
      !hasShownInitialBalloon
    ) {
      showHeaderBalloonMessage();
      hasShownInitialBalloon = true;
    }
  });

  function showHeaderBalloonMessage() {
    if (!balloonManager || showHeaderBalloon) return;

    headerBalloonMessage = balloonManager.createMessage("info");
    showHeaderBalloon = true;

    balloonManager.scheduleHide(() => {
      showHeaderBalloon = false;
      headerBalloonMessage = null;
    }, 3000);
  }

  // --- visibilitychangeでアクティブ時のみバルーン表示 ---
  let wasHidden = false;
  let lastVisibilityChange = 0; // デバウンス用タイムスタンプ

  function showBalloonOnActive() {
    const now = Date.now();

    // デバウンス: 前回の実行から1秒以内は無視
    if (now - lastVisibilityChange < 1000) {
      wasHidden = document.visibilityState === "hidden";
      return;
    }

    // 「非アクティブ→アクティブ」になった瞬間のみ
    if (
      document.visibilityState === "visible" &&
      wasHidden &&
      localeInitialized &&
      balloonManager &&
      !showHeaderBalloon
    ) {
      showHeaderBalloonMessage();
      lastVisibilityChange = now;
    }
    wasHidden = document.visibilityState === "hidden";
  }

  // --- 追加: 設定ダイアログの画像圧縮設定を管理 ---
  let selectedCompression = $state(
    localStorage.getItem("imageCompressionLevel") || "medium",
  );

  function handleSelectedCompressionChange(value: string) {
    selectedCompression = value;
  }

  // --- 追加: 設定ダイアログのアップロード先設定を管理 ---

  let selectedEndpoint = $state(
    localStorage.getItem("uploadEndpoint") || getDefaultEndpoint($locale),
  );

  function handleSelectedEndpointChange(value: string) {
    selectedEndpoint = value;
  }

  // クリーンアップ
  $effect(() => {
    return () => {
      if (balloonManager) {
        balloonManager.dispose();
      }
    };
  });
</script>

{#if $locale && localeInitialized}
  <main>
    <div class="main-content">
      <HeaderComponent
        onUploadImage={() => postComponentRef?.openFileDialog()}
        onResetPostContent={handleResetPostContent}
        balloonMessage={showHeaderBalloon && headerBalloonMessage
          ? headerBalloonMessage
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
      isLoadingProfile={isLoadingProfileStore.value}
      profileLoaded={profileLoadedStore.value}
      profileData={profileDataStore.value}
      swNeedRefresh={$swNeedRefresh}
      onShowLoginDialog={showLoginDialog}
      onOpenSettingsDialog={openSettingsDialog}
      onOpenLogoutDialog={openLogoutDialog}
    />
    {#if showLoginDialogStore.value}
      <LoginDialog
        show={showLoginDialogStore.value}
        bind:secretKey
        onClose={closeLoginDialog}
        onSave={saveSecretKey}
        onNostrLogin={loginWithNostrLogin}
        {isLoadingNostrLogin}
      />
    {/if}
    {#if showLogoutDialogStore.value}
      <LogoutDialog
        show={showLogoutDialogStore.value}
        onClose={closeLogoutDialog}
        onLogout={logout}
        {isLoggingOut}
      />
    {/if}
    <SettingsDialog
      show={showSettingsDialogStore.value}
      onClose={closeSettingsDialog}
      onRefreshRelaysAndProfile={handleRefreshRelaysAndProfile}
      {selectedCompression}
      onSelectedCompressionChange={handleSelectedCompressionChange}
      {selectedEndpoint}
      onSelectedEndpointChange={handleSelectedEndpointChange}
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
