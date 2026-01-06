<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import "./i18n";
  import { _, locale, waitLocale } from "svelte-i18n";
  import { Tooltip } from "bits-ui";
  import { ProfileManager } from "./lib/profileManager";
  import { RelayManager } from "./lib/relayManager";
  import { RelayProfileService } from "./lib/relayProfileService";
  import PostComponent from "./components/PostComponent.svelte";
  import SettingsDialog from "./components/SettingsDialog.svelte";
  import ProfileComponent from "./components/ProfileComponent.svelte";
  import LoginDialog from "./components/LoginDialog.svelte";
  import WelcomeDialog from "./components/WelcomeDialog.svelte";
  import { authService } from "./lib/authService";
  import HeaderComponent from "./components/HeaderComponent.svelte";
  import FooterComponent from "./components/FooterComponent.svelte";
  import KeyboardButtonBar from "./components/KeyboardButtonBar.svelte";
  import ReasonInput from "./components/ReasonInput.svelte";
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
    relayListUpdatedStore,
    showWelcomeDialogStore,
    urlQueryContentStore,
    updateUrlQueryContentStore,
    clearUrlQueryContentStore,
    setRelayManager,
  } from "./stores/appStore.svelte";
  import type { UploadProgress, BalloonMessage } from "./lib/types";
  import { getDefaultEndpoint } from "./lib/constants";
  import { BalloonMessageManager } from "./lib/balloonMessageManager";
  import {
    checkServiceWorkerStatus,
    testServiceWorkerCommunication,
    getSharedImageWithFallback,
  } from "./lib/utils/appUtils";
  import { checkIfOpenedFromShare } from "./lib/shareHandler";
  import {
    getContentFromUrlQuery,
    hasContentQueryParam,
    cleanupAllQueryParams,
  } from "./lib/urlQueryHandler";

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
  let initialPubkey = "";

  // ローカルストレージから即時判定
  if (!initialAuthChecked) {
    const nsec = localStorage.getItem("nsec");
    const nip46Raw = localStorage.getItem("__nostrlogin_nip46");
    if (nsec) {
    } else if (nip46Raw) {
      try {
        const nip46 = JSON.parse(nip46Raw);
        if (nip46?.pubkey) {
          initialPubkey = nip46.pubkey;
        }
      } catch (e) {
        // ignore
      }
    }
    initialAuthChecked = true;
  }

  let rxNostr: ReturnType<typeof createRxNostr> | undefined = $state();
  let relayProfileService: RelayProfileService;
  let sharedImageReceived = false;
  let isLoadingNostrLogin = $state(false);
  let footerInfoDisplay: any;
  let postComponentRef: any = $state();
  let footerComponentRef: any = $state();
  let isLoggingOut = $state(false); // 追加: ログアウト中の状態管理

  async function initializeNostr(pubkeyHex?: string): Promise<void> {
    rxNostr = createRxNostr({ verifier });
    const profileManager = new ProfileManager(rxNostr);
    const relayManager = new RelayManager(rxNostr, {
      relayListUpdatedStore: {
        value: relayListUpdatedStore.value,
        set: (v: number) => relayListUpdatedStore.set(v),
      },
    });
    relayProfileService = new RelayProfileService(
      rxNostr,
      relayManager,
      profileManager,
    );

    // RelayManagerをappStoreに設定
    setRelayManager(relayManager);

    await relayProfileService.initializeRelays(pubkeyHex);
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

      // ダイアログを閉じる
      closeLoginDialog();

      try {
        await initializeNostr();
        // RelayProfileServiceを使用してリレーとプロフィールを取得
        const profile = await relayProfileService.initializeForLogin(
          result.pubkeyHex,
        );
        if (profile) {
          profileDataStore.set(profile);
          profileLoadedStore.set(true);
        }
        // プロフィール取得完了後にローディングを解除
        isLoadingProfileStore.set(false);
      } catch (error) {
        console.error("nostr-login認証処理中にエラー:", error);
        isLoadingProfileStore.set(false);
      } finally {
        isLoadingNostrLogin = false;
      }
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
        // RelayProfileServiceを使用してリレーとプロフィールを取得
        const profile = await relayProfileService.initializeForLogin(
          result.pubkeyHex,
        );
        if (profile) {
          profileDataStore.set(profile);
          profileLoadedStore.set(true);
        }
        // プロフィール取得完了後にローディングを解除
        isLoadingProfileStore.set(false);
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
    profileDataStore.set({ name: "", picture: "", npub: "", nprofile: "" });
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

  // 認証状態が変わったら自動的にリレー設定を読み込む
  $effect(() => {
    const pubkey = authState.value?.pubkey;
    if (pubkey && authState.value?.isAuthenticated && relayProfileService) {
      const result = relayProfileService
        .getRelayManager()
        .loadRelayConfigForUI(pubkey);
      if (result) {
        // TODO: 必要に応じてストアを更新
      }
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

      // 認証サービスの認証ハンドラーを先にセット
      authService.setNostrLoginHandler(handleNostrLoginAuth);

      // Service Worker状態チェック（本番環境でも実行）
      if (checkIfOpenedFromShare()) {
        const swStatus = await checkServiceWorkerStatus();
        const canCommunicate = await testServiceWorkerCommunication();

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
          const authResult = await authService.initializeAuth();

          if (authResult.hasAuth && authResult.pubkeyHex) {
            await initializeNostr(authResult.pubkeyHex);
            // RelayProfileServiceを使用してリレーとプロフィールを取得
            const profile = await relayProfileService.initializeForLogin(
              authResult.pubkeyHex,
            );
            if (profile) {
              profileDataStore.set(profile);
              profileLoadedStore.set(true);
            }
            // プロフィール取得完了後にローディングを解除
            isLoadingProfileStore.set(false);
          } else {
            await initializeNostr();
            isLoadingProfileStore.set(false);
          }
        } catch (error) {
          console.error("認証初期化中にエラー:", error);
          await initializeNostr();
          isLoadingProfileStore.set(false);
        } finally {
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

      // 初回アクセス判定
      const isFirstVisit = localStorage.getItem("firstVisit") !== "1";
      if (isFirstVisit) {
        showWelcomeDialogStore.set(true);
        localStorage.setItem("firstVisit", "1");
      } else {
        // 2回目以降のアクセス時はエディターにフォーカス
        setTimeout(() => {
          postComponentRef?.focusEditor();
        }, 300);
      }

      // URLクエリパラメータからコンテンツを取得
      if (hasContentQueryParam()) {
        const queryContent = getContentFromUrlQuery();
        if (queryContent) {
          updateUrlQueryContentStore(queryContent);
        }
      }

      // すべての不要なクエリパラメータをクリーンアップ
      // （空のcontentや想定外のパラメータを削除）
      cleanupAllQueryParams();
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

  // URLクエリコンテンツをエディターに挿入
  $effect(() => {
    if (
      urlQueryContentStore.received &&
      urlQueryContentStore.content &&
      postComponentRef
    ) {
      postComponentRef.insertTextContent(urlQueryContentStore.content);
      clearUrlQueryContentStore();
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
    if (!relayProfileService) {
      await initializeNostr(authState.value.pubkey);
    }

    // RelayProfileServiceを使用してリレーとプロフィールを強制的に再取得
    const profile = await relayProfileService.refreshRelaysAndProfile(
      authState.value.pubkey,
    );
    if (profile) {
      profileDataStore.set(profile);
      profileLoadedStore.set(true);
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
  <Tooltip.Provider>
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
      <ReasonInput />
      <KeyboardButtonBar />
      <FooterComponent
        bind:this={footerComponentRef}
        {isAuthenticated}
        {isAuthInitialized}
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
        <ProfileComponent
          show={showLogoutDialogStore.value}
          onClose={closeLogoutDialog}
          onLogout={logout}
          {isLoggingOut}
        />
      {/if}
      {#if showWelcomeDialogStore.value}
        <WelcomeDialog
          show={showWelcomeDialogStore.value}
          onClose={() => showWelcomeDialogStore.set(false)}
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
        onOpenWelcomeDialog={() => showWelcomeDialogStore.set(true)}
      />
    </main>
  </Tooltip.Provider>
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
