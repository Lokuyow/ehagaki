<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import "./i18n";
  import { _, locale, waitLocale } from "svelte-i18n";
  import { Tooltip } from "bits-ui";
  import { ProfileManager, ProfileUrlUtils } from "./lib/profileManager";
  import { RelayManager } from "./lib/relayManager";
  import { RelayProfileService } from "./lib/relayProfileService";
  import PostComponent from "./components/PostComponent.svelte";
  import SettingsDialog from "./components/SettingsDialog.svelte";
  import ProfileComponent from "./components/ProfileComponent.svelte";
  import LoginDialog from "./components/LoginDialog.svelte";
  import WelcomeDialog from "./components/WelcomeDialog.svelte";
  import DraftListDialog from "./components/DraftListDialog.svelte";
  import ConfirmDialog from "./components/ConfirmDialog.svelte";
  import { authService } from "./lib/authService";
  import { waitNostr } from "nip07-awaiter";
  import { AccountManager } from "./lib/accountManager";
  import { nip46Service } from "./lib/nip46Service";
  import HeaderComponent from "./components/HeaderComponent.svelte";
  import FooterComponent from "./components/FooterComponent.svelte";
  import KeyboardButtonBar from "./components/KeyboardButtonBar.svelte";
  import ReasonInput from "./components/ReasonInput.svelte";
  import ReplyQuotePreview from "./components/ReplyQuotePreview.svelte";
  import {
    authState,
    sharedMediaStore,
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
    relayListUpdatedStore,
    showWelcomeDialogStore,
    urlQueryContentStore,
    updateUrlQueryContentStore,
    clearUrlQueryContentStore,
    setRelayManager,
    showDraftListDialogStore,
    showDraftLimitConfirmStore,
    pendingDraftContentStore,
    mediaFreePlacementStore,
    clearAuthState,
    accountListStore,
    accountProfileCacheStore,
    showAddAccountDialogStore,
    openAddAccountDialog,
    closeAddAccountDialog,
    setSharedMediaError,
    clearSharedMediaError,
    resetUploadDisplayState,
  } from "./stores/appStore.svelte";
  import type { Draft } from "./lib/types";
  import { getDefaultEndpoint, STORAGE_KEYS } from "./lib/constants";
  import { useBalloonMessage } from "./lib/hooks/useBalloonMessage.svelte";
  import {
    checkServiceWorkerStatus,
    testServiceWorkerCommunication,
    getSharedMediaWithFallback,
  } from "./lib/utils/swCommunication";
  import { checkIfOpenedFromShare } from "./lib/shareHandler";
  import {
    getContentFromUrlQuery,
    hasContentQueryParam,
    cleanupAllQueryParams,
    getReplyQuoteFromUrlQuery,
    hasReplyQuoteQueryParam,
  } from "./lib/urlQueryHandler";
  import { saveDraft, saveDraftWithReplaceOldest } from "./lib/draftManager";
  import { mediaGalleryStore } from "./stores/mediaGalleryStore.svelte";
  import { generateMediaItemId } from "./lib/utils/appUtils";
  import {
    setReplyQuote,
    updateReferencedEvent,
    updateAuthorDisplayName,
    setReplyQuoteError,
    replyQuoteState,
    restoreReplyQuote,
    clearReplyQuote,
  } from "./stores/replyQuoteStore.svelte";
  import { relayConfigStore } from "./stores/relayStore.svelte";
  import { ReplyQuoteService } from "./lib/replyQuoteService";

  // --- 秘密鍵入力・保存・認証 ---
  let errorMessage = $state("");
  let secretKey = $state("");
  const publicKeyState = authService.getPublicKeyState();
  $effect(() => {
    publicKeyState.setNsec(secretKey);
  });

  let isAuthenticated = $derived(authState.value?.isAuthenticated ?? false);
  let isAuthInitialized = $derived(authState.value?.isInitialized ?? false);

  // --- 追加: 初回レンダリング時にローカルストレージで即時認証判定 ---
  let initialAuthChecked = false;

  // ローカルストレージから即時判定
  if (!initialAuthChecked) {
    const nsec = localStorage.getItem("nsec");
    if (nsec) {
    }
    initialAuthChecked = true;
  }

  let rxNostr: ReturnType<typeof createRxNostr> | undefined = $state();
  let relayProfileService: RelayProfileService;
  let isLoadingNip07 = $state(false);
  let isLoadingNip46 = $state(false);
  // NIP-07拡張機能の検出状態（nos2x等の遅延注入に対応するためリアクティブ）
  let nip07ExtensionAvailable = $state(authService.isNip07Available());
  let postComponentRef: any = $state();
  let isLoggingOut = $state(false); // 追加: ログアウト中の状態管理
  let isSwitchingAccount = $state(false); // アカウント切替中フラグ
  let showTransitionOverlay = $state(false); // ダイアログ切替時のちらつき防止用

  // AccountManager初期化
  const accountManager = new AccountManager({ localStorage });
  authService.setAccountManager(accountManager);

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

  /**
   * 認証成功後の共通処理: Nostr初期化 → リレー・プロフィール取得 → ストア更新
   */
  async function handlePostAuth(pubkeyHex: string): Promise<void> {
    isLoadingProfileStore.set(true);
    closeLoginDialog();
    closeAddAccountDialog();
    try {
      await initializeNostr(pubkeyHex);
      const profile = await relayProfileService.initializeForLogin(pubkeyHex);
      if (profile) {
        profileDataStore.set(profile);
        profileLoadedStore.set(true);
        // アカウントプロフィールキャッシュも更新
        accountProfileCacheStore.setProfile(pubkeyHex, {
          name: profile.name,
          displayName: profile.displayName,
          picture: profile.picture,
        });
      }
    } finally {
      isLoadingProfileStore.set(false);
      refreshAccountList();
    }
  }

  /** アカウントリストストアをlocalStorageから同期 */
  function refreshAccountList(): void {
    accountListStore.set(accountManager.getAccounts());
    // 各アカウントのプロフィールキャッシュを更新
    const accounts = accountManager.getAccounts();
    for (const account of accounts) {
      try {
        const profileData = localStorage.getItem(
          STORAGE_KEYS.NOSTR_PROFILE + account.pubkeyHex,
        );
        if (profileData) {
          const profile = JSON.parse(profileData);
          const picture =
            typeof profile.picture === "string"
              ? ProfileUrlUtils.ensureProfileMarker(profile.picture)
              : "";

          accountProfileCacheStore.setProfile(account.pubkeyHex, {
            name: profile.name || "",
            displayName: profile.displayName || "",
            picture,
          });
        }
      } catch {
        // ignore
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
    errorMessage = "";

    try {
      if (result.pubkeyHex) {
        await handlePostAuth(result.pubkeyHex);
      }
    } catch (e) {
      isLoadingProfileStore.set(false);
    }
  }

  /**
   * 指定アカウントのログアウト（マルチアカウント対応）
   */
  async function logoutAccount(pubkeyHex: string) {
    isLoggingOut = true;
    try {
      resetUploadDisplayState();
      const nextPubkey = authService.logoutAccount(pubkeyHex);

      if (nextPubkey) {
        // アクティブアカウントが削除された → 次のアカウントに切替
        if (rxNostr) {
          rxNostr.dispose();
          rxNostr = undefined;
        }
        await switchAccount(nextPubkey);
      } else if (nextPubkey === null) {
        // アカウントが残っていない → 未認証状態
        if (rxNostr) {
          rxNostr.dispose();
          rxNostr = undefined;
        }
        clearAuthState();
        profileDataStore.set({
          name: "",
          displayName: "",
          picture: "",
          npub: "",
          nprofile: "",
        });
        profileLoadedStore.set(false);
        await initializeNostr(); // pubkeyなしでブートストラップリレーのみ
        secretKey = "";
        errorMessage = "";
      }
      // undefined: 非アクティブアカウントの削除 → 現在のセッションは維持

      refreshAccountList();
      if (nextPubkey !== undefined) {
        closeLogoutDialog();
      }
    } catch (error) {
      console.error("ログアウト処理中にエラー:", error);
    } finally {
      isLoggingOut = false;
    }
  }

  /**
   * アカウント切替
   */
  async function switchAccount(pubkeyHex: string) {
    if (isSwitchingAccount) return;
    isSwitchingAccount = true;
    try {
      // rx-nostrを破棄
      if (rxNostr) {
        rxNostr.dispose();
        rxNostr = undefined;
      }

      accountManager.setActiveAccount(pubkeyHex);
      const accountType = accountManager.getAccountType(pubkeyHex);
      if (!accountType) {
        console.error("アカウントタイプが見つかりません:", pubkeyHex);
        return;
      }

      const result = await authService.restoreAccount(pubkeyHex, accountType);
      if (result.hasAuth && result.pubkeyHex) {
        await handlePostAuth(result.pubkeyHex);
      } else {
        console.error("アカウント復元に失敗:", pubkeyHex);
      }
    } catch (error) {
      console.error("アカウント切替中にエラー:", error);
    } finally {
      isSwitchingAccount = false;
    }
  }

  /**
   * アカウント追加ダイアログを表示
   * closeLogoutDialogのhistory.back()が非同期popstateを発火するため、
   * LoginDialogのpushStateが巻き戻されないよう遅延して開く。
   * 切替中はtransition overlayでちらつきを防止。
   */
  function handleAddAccount() {
    showTransitionOverlay = true;
    closeLogoutDialog();
    setTimeout(() => {
      openAddAccountDialog();
      showTransitionOverlay = false;
    }, 50);
  }

  async function handleNip07Login() {
    isLoadingNip07 = true;
    try {
      const result = await authService.authenticateWithNip07();
      if (!result.success) {
        console.error("NIP-07認証失敗:", result.error);
        return;
      }

      if (result.pubkeyHex) {
        await handlePostAuth(result.pubkeyHex);
      }
    } catch (error) {
      console.error("NIP-07ログインでエラー:", error);
    } finally {
      isLoadingNip07 = false;
    }
  }

  async function handleNip46Login(
    bunkerUrl: string,
  ): Promise<string | undefined> {
    isLoadingNip46 = true;
    try {
      const result = await authService.authenticateWithNip46(bunkerUrl);
      if (!result.success) {
        console.error("NIP-46認証失敗:", result.error);
        return result.error ?? "NIP-46 authentication failed";
      }

      if (result.pubkeyHex) {
        await handlePostAuth(result.pubkeyHex);
      }
      return undefined;
    } catch (error) {
      console.error("NIP-46ログインでエラー:", error);
      return error instanceof Error ? error.message : "NIP-46 login failed";
    } finally {
      isLoadingNip46 = false;
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

  function getSharedMediaErrorMessage(errorCode: string | null): string | null {
    switch (errorCode) {
      case "processing-error":
        return "共有メディアの処理中にエラーが発生しました";
      case "no-image":
        return "共有メディアが見つかりませんでした";
      case "upload-failed":
        return "メディアのアップロードに失敗しました";
      case "network-error":
        return "ネットワークエラーが発生しました";
      case "client-error":
        return "メディア共有処理でエラーが発生しました";
      default:
        return null;
    }
  }

  // 共有画像取得済みフラグ
  const sharedMediaAlreadyProcessed =
    localStorage.getItem("sharedMediaProcessed") === "1";

  onMount(() => {
    // NIP-07拡張機能の遅延注入を検出（nos2x等のdocument_endで注入される拡張機能に対応）
    if (!nip07ExtensionAvailable) {
      waitNostr(3000).then((nostr) => {
        if (nostr) nip07ExtensionAvailable = true;
      });
    }

    // Define an inner async function for initialization
    const init = async () => {
      const storedLocale = localStorage.getItem("locale");
      const urlParams = new URLSearchParams(window.location.search);
      const sharedError = urlParams.get("error");

      clearSharedMediaError();

      if (storedLocale && storedLocale !== $locale) locale.set(storedLocale);
      await waitLocale();
      localeInitialized = true;

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

      // --- 認証初期化（共有メディア処理の前に完了させる） ---
      try {
        const authResult = await authService.initializeAuth();

        if (authResult.hasAuth && authResult.pubkeyHex) {
          await handlePostAuth(authResult.pubkeyHex);
        } else {
          await initializeNostr();
          isLoadingProfileStore.set(false);
        }
        refreshAccountList();
      } catch (error) {
        console.error("認証初期化中にエラー:", error);
        await initializeNostr();
        isLoadingProfileStore.set(false);
      } finally {
        authService.markAuthInitialized();
      }
      // --- ここまで ---

      // 共有画像取得: エラーパラメータがあっても実際に画像が取得できるかチェック
      if (checkIfOpenedFromShare() && !sharedMediaAlreadyProcessed) {
        try {
          // まず実際に共有メディアが取得できるかチェック
          const shared = await getSharedMediaWithFallback();
          if (shared?.images?.length) {
            // メディアが取得できた場合は、エラーパラメータを無視して処理を続行
            sharedMediaStore.files = shared.images;
            sharedMediaStore.metadata = shared.metadata;
            sharedMediaStore.received = true;
            localStorage.setItem("sharedMediaProcessed", "1");
          } else {
            console.warn("No shared media data received");
            const sharedMediaErrorMessage =
              getSharedMediaErrorMessage(sharedError);
            if (sharedMediaErrorMessage) {
              setSharedMediaError(sharedMediaErrorMessage, 5000);
            }
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
          console.error("共有メディアの処理中にエラー:", error);
          const sharedMediaErrorMessage =
            getSharedMediaErrorMessage(sharedError);
          if (sharedMediaErrorMessage) {
            setSharedMediaError(sharedMediaErrorMessage, 5000);
          }
        }
      }

      // 初回アクセス判定
      const isFirstVisit = localStorage.getItem("firstVisit") !== "1";
      if (isFirstVisit) {
        showWelcomeDialogStore.set(true);
        localStorage.setItem("firstVisit", "1");
      }

      // URLクエリパラメータからコンテンツを取得
      if (hasContentQueryParam()) {
        const queryContent = getContentFromUrlQuery();
        if (queryContent) {
          updateUrlQueryContentStore(queryContent);
        }
      }

      // URLクエリパラメータからリプライ/引用情報を取得
      if (hasReplyQuoteQueryParam()) {
        const replyQuoteQuery = getReplyQuoteFromUrlQuery();
        if (replyQuoteQuery) {
          setReplyQuote(replyQuoteQuery);
          // イベント取得を非同期で開始
          if (rxNostr) {
            const rqService = new ReplyQuoteService();
            rqService
              .fetchReferencedEvent(
                replyQuoteQuery.eventId,
                replyQuoteQuery.relayHints,
                rxNostr,
                relayConfigStore.value,
              )
              .then((event) => {
                if (event) {
                  const threadInfo = rqService.extractThreadInfo(event);
                  updateReferencedEvent(event, threadInfo);
                  // 著者のプロフィールを取得して表示名を更新
                  if (event.pubkey && relayProfileService) {
                    relayProfileService
                      .fetchProfileRealtime(event.pubkey)
                      .then((profile) => {
                        if (profile) {
                          const displayName =
                            profile.displayName || profile.name;
                          if (displayName) {
                            updateAuthorDisplayName(displayName);
                          }
                        }
                      });
                  }
                } else {
                  setReplyQuoteError("Event not found");
                }
              });
          }
        }
      }

      // すべての不要なクエリパラメータをクリーンアップ
      // （空のcontentや想定外のパラメータを削除）
      cleanupAllQueryParams();
    };

    // Call the async initializer
    init();

    // NIP-46: バックグラウンド復帰時にWebSocket再接続
    function handleVisibilityChange() {
      if (
        document.visibilityState === "visible" &&
        authState.value.type === "nip46" &&
        nip46Service.isConnected()
      ) {
        nip46Service.ensureConnection().catch((err) => {
          console.error("NIP-46 reconnection failed:", err);
        });
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  });

  $effect(() => {
    if (
      sharedMediaStore.received &&
      sharedMediaStore.files.length > 0 &&
      postComponentRef
    ) {
      postComponentRef.uploadFiles(sharedMediaStore.files);
      sharedMediaStore.files = [];
      sharedMediaStore.metadata = undefined;
      sharedMediaStore.received = false;
      // 取得済みフラグをセット
      localStorage.setItem("sharedMediaProcessed", "1");
      // 受信直後に一度クリア（次回共有のため）
      setTimeout(() => localStorage.removeItem("sharedMediaProcessed"), 500);
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

  function handlePostSuccess() {
    // 投稿成功時にfooter情報を全て削除
    resetUploadDisplayState();
    // 共有メディアフラグをクリア
    localStorage.removeItem("sharedMediaProcessed");
  }

  // 追加: エディター内容クリア
  function handleResetPostContent() {
    postComponentRef?.resetPostContent();
  }

  // --- 下書き機能ハンドラ---
  function handleSaveDraft(): boolean {
    if (!postComponentRef?.getEditorHtml) return false;
    const htmlContent = postComponentRef.getEditorHtml();
    const galleryItems = mediaGalleryStore
      .getItems()
      .filter((item) => !item.isPlaceholder);
    // エディタ内容もギャラリー画像もない場合はスキップ
    if (
      (!htmlContent || htmlContent === "<p></p>") &&
      galleryItems.length === 0
    )
      return false;

    // リプライ/引用状態を取得
    const rqState = replyQuoteState.value;
    const replyQuoteData = rqState
      ? {
          mode: rqState.mode,
          eventId: rqState.eventId,
          relayHints: rqState.relayHints,
          authorPubkey: rqState.authorPubkey,
          authorDisplayName: rqState.authorDisplayName,
          referencedEvent: rqState.referencedEvent,
          rootEventId: rqState.rootEventId,
          rootRelayHint: rqState.rootRelayHint,
          rootPubkey: rqState.rootPubkey,
        }
      : undefined;

    const result = saveDraft(htmlContent, galleryItems, replyQuoteData);
    if (result.needsConfirmation) {
      // 上限に達している場合は確認ダイアログを表示
      pendingDraftContentStore.set({
        content: htmlContent,
        galleryItems,
        replyQuoteData,
      });
      showDraftLimitConfirmStore.set(true);
      return false;
    }
    return result.success;
  }

  function handleConfirmDraftReplace() {
    const pending = pendingDraftContentStore.value;
    if (pending) {
      saveDraftWithReplaceOldest(
        pending.content,
        pending.galleryItems,
        pending.replyQuoteData,
      );
    }
    pendingDraftContentStore.set(null);
    showDraftLimitConfirmStore.set(false);
  }

  function handleCancelDraftReplace() {
    pendingDraftContentStore.set(null);
    showDraftLimitConfirmStore.set(false);
  }

  function handleShowDraftList() {
    showDraftListDialogStore.set(true);
  }

  /**
   * HTML内の画像/動画ノードをギャラリーストアに移し、画像/動画を除去したHTMLを返す
   */
  function extractMediaToGallery(htmlContent: string): string {
    if (!htmlContent) return htmlContent;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    tempDiv.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      // プレースホルダー・未確定srcはスキップ
      if (!src || img.getAttribute("isPlaceholder") === "true") return;
      mediaGalleryStore.addItem({
        id: generateMediaItemId(),
        type: "image",
        src,
        isPlaceholder: false,
        blurhash: img.getAttribute("blurhash") ?? undefined,
        alt: img.getAttribute("alt") ?? undefined,
        dim: img.getAttribute("dim") ?? undefined,
      });
      // 親要素が画像のみのブロックなら親ごと削除、そうでなければ画像のみ削除
      const parent = img.parentElement;
      if (parent && parent !== tempDiv && parent.children.length === 1) {
        parent.remove();
      } else {
        img.remove();
      }
    });

    tempDiv.querySelectorAll("video").forEach((video) => {
      const src = video.getAttribute("src");
      if (!src || video.getAttribute("isPlaceholder") === "true") return;
      mediaGalleryStore.addItem({
        id: generateMediaItemId(),
        type: "video",
        src,
        isPlaceholder: false,
      });
      const parent = video.parentElement;
      if (parent && parent !== tempDiv && parent.children.length === 1) {
        parent.remove();
      } else {
        video.remove();
      }
    });

    return tempDiv.innerHTML;
  }

  function handleApplyDraft(draft: Draft) {
    const isGalleryMode = !mediaFreePlacementStore.value;

    if (isGalleryMode) {
      // ギャラリーモード: ギャラリーをリセットして画像を復元
      mediaGalleryStore.clearAll();
      // galleryItems（ギャラリーモード保存の下書き）を復元
      if (draft.galleryItems && draft.galleryItems.length > 0) {
        draft.galleryItems.forEach((item) => mediaGalleryStore.addItem(item));
      }
      // HTML内の画像/動画（フリーモード保存の下書き）をギャラリーに抽出
      const strippedHtml = extractMediaToGallery(draft.content);
      postComponentRef?.loadDraftContent(strippedHtml);
    } else {
      // フリーモード: HTMLをそのままロードし、galleryItemsがあれば末尾に追加
      postComponentRef?.loadDraftContent(draft.content);
      if (draft.galleryItems && draft.galleryItems.length > 0) {
        postComponentRef?.appendMediaToEditor(draft.galleryItems);
      }
    }

    // リプライ/引用状態を復元
    if (draft.replyQuoteData) {
      restoreReplyQuote(draft.replyQuoteData);
    } else {
      clearReplyQuote();
    }
  }

  // バルーンメッセージフック
  const balloon = useBalloonMessage(
    () => $_,
    () => localeInitialized,
  );

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
      accountProfileCacheStore.setProfile(authState.value.pubkey, {
        name: profile.name,
        displayName: profile.displayName,
        picture: profile.picture,
      });
    }
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
</script>

{#if $locale && localeInitialized}
  <Tooltip.Provider>
    <main>
      <div class="main-content">
        <HeaderComponent
          onResetPostContent={handleResetPostContent}
          onSaveDraft={handleSaveDraft}
          onShowDraftList={handleShowDraftList}
          balloonMessage={balloon.finalMessage}
        />
        {#if replyQuoteState.value?.mode === "reply"}
          <ReplyQuotePreview />
        {/if}
        <PostComponent
          bind:this={postComponentRef}
          {rxNostr}
          hasStoredKey={isAuthenticated}
          onPostSuccess={handlePostSuccess}
        />
        {#if replyQuoteState.value?.mode === "quote"}
          <ReplyQuotePreview />
        {/if}
      </div>
      <ReasonInput />
      <KeyboardButtonBar
        onUploadImage={() => postComponentRef?.openFileDialog()}
        onPostButtonTap={() => balloon.showTips()}
      />
      <FooterComponent
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
          onNip07Login={handleNip07Login}
          onNip46Login={handleNip46Login}
          isNip07ExtensionAvailable={nip07ExtensionAvailable}
          {isLoadingNip07}
          {isLoadingNip46}
        />
      {/if}
      {#if showTransitionOverlay}
        <div class="transition-overlay"></div>
      {/if}
      {#if showAddAccountDialogStore.value}
        <LoginDialog
          show={showAddAccountDialogStore.value}
          bind:secretKey
          onClose={closeAddAccountDialog}
          onSave={saveSecretKey}
          onNip07Login={handleNip07Login}
          onNip46Login={handleNip46Login}
          isNip07ExtensionAvailable={nip07ExtensionAvailable}
          {isLoadingNip07}
          {isLoadingNip46}
          isAddAccountMode={true}
        />
      {/if}
      {#if showLogoutDialogStore.value}
        <ProfileComponent
          show={showLogoutDialogStore.value}
          onClose={closeLogoutDialog}
          onLogout={logoutAccount}
          onSwitchAccount={switchAccount}
          onAddAccount={handleAddAccount}
          accounts={accountListStore.value}
          accountProfiles={accountProfileCacheStore.value}
          {isLoggingOut}
          {isSwitchingAccount}
        />
      {/if}
      {#if showWelcomeDialogStore.value}
        <WelcomeDialog
          show={showWelcomeDialogStore.value}
          onClose={() => showWelcomeDialogStore.set(false)}
        />
      {/if}
      {#if showDraftListDialogStore.value}
        <DraftListDialog
          show={showDraftListDialogStore.value}
          onClose={() => showDraftListDialogStore.set(false)}
          onApplyDraft={handleApplyDraft}
        />
      {/if}
      {#if showDraftLimitConfirmStore.value}
        <ConfirmDialog
          open={showDraftLimitConfirmStore.value}
          onOpenChange={(open) =>
            !open && showDraftLimitConfirmStore.set(false)}
          title={$_("common.confirm")}
          description={$_("draft.limit_reached")}
          confirmLabel={$_("common.ok")}
          cancelLabel={$_("common.cancel")}
          confirmVariant="danger"
          onConfirm={handleConfirmDraftReplace}
          onCancel={handleCancelDraftReplace}
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

  .transition-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--dialog-overlay);
    z-index: 100;
    pointer-events: none;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 12px;
    width: 100%;
    height: calc(100% - 128px);
    overflow: hidden;
  }
</style>
