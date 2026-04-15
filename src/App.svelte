<script lang="ts">
  import { onMount } from "svelte";
  import "./i18n";
  import { _, locale, waitLocale } from "svelte-i18n";
  import { Tooltip } from "bits-ui";
  import type { RelayProfileService } from "./lib/relayProfileService";
  import PostComponent from "./components/PostComponent.svelte";
  import SettingsDialog from "./components/SettingsDialog.svelte";
  import ProfileComponent from "./components/ProfileComponent.svelte";
  import LoginDialog from "./components/LoginDialog.svelte";
  import WelcomeDialog from "./components/WelcomeDialog.svelte";
  import DraftListDialog from "./components/DraftListDialog.svelte";
  import ConfirmDialog from "./components/ConfirmDialog.svelte";
  import { authService } from "./lib/authService";
  import { iframeMessageService } from "./lib/iframeMessageService";
  import { waitNostr } from "nip07-awaiter";
  import { AccountManager } from "./lib/accountManager";
  import { nip46Service } from "./lib/nip46Service";
  import { parentClientAuthService } from "./lib/parentClientAuthService";
  import { embedComposerContextService } from "./lib/embedComposerContextService";
  import HeaderComponent from "./components/HeaderComponent.svelte";
  import FooterComponent from "./components/FooterComponent.svelte";
  import KeyboardButtonBar from "./components/KeyboardButtonBar.svelte";
  import ReasonInput from "./components/ReasonInput.svelte";
  import ReplyQuotePreview from "./components/ReplyQuotePreview.svelte";
  import {
    authState,
    clearAuthState,
    accountListStore,
    accountProfileCacheStore,
  } from "./stores/authStore.svelte";
  import {
    showLoginDialogStore,
    showLogoutDialogStore,
    showSettingsDialogStore,
    showWelcomeDialogStore,
    showDraftListDialogStore,
    showDraftLimitConfirmStore,
    pendingDraftContentStore,
    showAddAccountDialogStore,
  } from "./stores/dialogStore.svelte";
  import { swNeedRefresh } from "./stores/swStore.svelte";
  import {
    profileDataStore,
    profileLoadedStore,
    isLoadingProfileStore,
  } from "./stores/profileStore.svelte";
  import {
    setRelayManager,
    relayListUpdatedStore,
  } from "./stores/relayStore.svelte";
  import {
    sharedMediaStore,
    urlQueryContentStore,
    updateUrlQueryContentStore,
    clearUrlQueryContentStore,
  } from "./stores/sharedContentStore.svelte";
  import {
    mediaFreePlacementStore,
    setSharedMediaError,
    clearSharedMediaError,
    resetUploadDisplayState,
  } from "./stores/uploadStore.svelte";
  import {
    settingsStore,
    consumeFirstVisitFlag,
    isSharedMediaProcessed,
    markSharedMediaProcessed,
    clearSharedMediaProcessed,
  } from "./stores/settingsStore.svelte";
  import type { AuthResult, Draft, MediaGalleryItem } from "./lib/types";
  import { useBalloonMessage } from "./lib/hooks/useBalloonMessage.svelte";
  import { saveDraft, saveDraftWithReplaceOldest } from "./lib/draftManager";
  import { mediaGalleryStore } from "./stores/mediaGalleryStore.svelte";
  import {
    setReplyQuote,
    updateReferencedEvent,
    updateAuthorDisplayName,
    setReplyQuoteError,
    onReplyQuoteChanged,
    replyQuoteState,
    restoreReplyQuote,
    clearReplyQuote,
    clearReplyReference,
    removeQuoteReference,
  } from "./stores/replyQuoteStore.svelte";
  import { relayConfigStore } from "./stores/relayStore.svelte";
  import {
    initializeNostrSession,
    completePostAuthBootstrap,
    refreshRelaysAndProfileForAccount,
    syncAccountStores,
    type NostrSessionBootstrap,
  } from "./lib/bootstrap/authBootstrap";
  import {
    runAppInitializationBootstrap,
    registerNip46VisibilityHandler,
  } from "./lib/bootstrap/appInitializationBootstrap";
  import {
    applyReplyQuoteQuery,
    type RunExternalInputBootstrapParams,
  } from "./lib/bootstrap/externalInputBootstrap";
  import type { EmbedComposerSetContextPayload } from "./lib/embedProtocol";
  import {
    buildComposerContextSignature,
    buildComposerContextUpdatedPayload,
  } from "./lib/embedComposerContextNotification";
  import {
    applyDraftToComposer,
    createDraftSavePayload,
  } from "./lib/draftContentUtils";
  import { getReplyQuoteFromEmbedPayload } from "./lib/urlQueryHandler";
  import {
    createDialogVisibilityHandlers,
    createDraftLimitConfirmHandlers,
  } from "./lib/appDialogUtils";
  import {
    disposeNostrSession,
    handleSuccessfulAuthResult,
    resolveLogoutAccountAction,
    restoreManagedAccountSession,
  } from "./lib/appAuthUtils";
  import { generateMediaItemId } from "./lib/utils/appUtils";

  // --- 秘密鍵入力・保存・認証 ---
  let errorMessage = $state("");
  let secretKey = $state("");
  const publicKeyState = authService.getPublicKeyState();
  $effect(() => {
    publicKeyState.setNsec(secretKey);
  });

  let isAuthenticated = $derived(authState.value?.isAuthenticated ?? false);
  let isAuthInitialized = $derived(authState.value?.isInitialized ?? false);

  let rxNostr: NostrSessionBootstrap["rxNostr"] | undefined = $state();
  let relayProfileService: RelayProfileService;
  let isLoadingParentClient = $state(false);
  let isLoadingNip07 = $state(false);
  let isLoadingNip46 = $state(false);
  let parentClientAvailable = $state(false);
  // NIP-07拡張機能の検出状態（nos2x等の遅延注入に対応するためリアクティブ）
  let nip07ExtensionAvailable = $state(authService.isNip07Available());
  let postComponentRef: any = $state();
  let isLoggingOut = $state(false); // 追加: ログアウト中の状態管理
  let isSwitchingAccount = $state(false); // アカウント切替中フラグ
  let showTransitionOverlay = $state(false); // ダイアログ切替時のちらつき防止用
  let isBootstrappingApp = true;

  let parentClientAuthPromise: Promise<AuthResult> | null = null;
  let pendingRemoteParentLoginPubkey: string | null | undefined = undefined;
  let lastNotifiedComposerContextSignature: string | null = null;
  let pendingRemoteComposerAction:
    | {
        type: "set";
        payload: EmbedComposerSetContextPayload;
        requestId?: string;
      }
    | { type: "clear"; requestId?: string }
    | undefined = undefined;

  const PARENT_CLIENT_REMOTE_SYNC_TIMEOUT_MS = 5000;

  // AccountManager初期化
  const accountManager = new AccountManager({ localStorage });
  authService.setAccountManager(accountManager);

  const loginDialog = createDialogVisibilityHandlers(showLoginDialogStore);
  const logoutDialog = createDialogVisibilityHandlers(showLogoutDialogStore);
  const settingsDialog = createDialogVisibilityHandlers(
    showSettingsDialogStore,
  );
  const welcomeDialog = createDialogVisibilityHandlers(showWelcomeDialogStore);
  const draftListDialog = createDialogVisibilityHandlers(
    showDraftListDialogStore,
  );
  const addAccountDialog = createDialogVisibilityHandlers(
    showAddAccountDialogStore,
  );
  const draftLimitConfirm = createDraftLimitConfirmHandlers({
    pendingDraftContentStore,
    showDraftLimitConfirmStore,
    saveDraftWithReplaceOldest,
  });

  async function initializeNostr(pubkeyHex?: string): Promise<void> {
    const session = await initializeNostrSession({
      pubkeyHex,
      relayListUpdatedStore: {
        value: relayListUpdatedStore.value,
        set: (value: number) => relayListUpdatedStore.set(value),
      },
      setRelayManager,
    });

    rxNostr = session.rxNostr;
    relayProfileService = session.relayProfileService;
  }

  /**
   * 認証成功後の共通処理: Nostr初期化 → リレー・プロフィール取得 → ストア更新
   */
  async function handlePostAuth(pubkeyHex: string): Promise<void> {
    const session = await completePostAuthBootstrap({
      pubkeyHex,
      closeAuthDialogs: () => {
        loginDialog.close();
        addAccountDialog.close();
      },
      relayListUpdatedStore: {
        value: relayListUpdatedStore.value,
        set: (value: number) => relayListUpdatedStore.set(value),
      },
      setRelayManager,
      profileDataStore,
      profileLoadedStore,
      isLoadingProfileStore,
      accountManager,
      accountListStore,
      accountProfileCacheStore,
      localStorage,
    });

    rxNostr = session.rxNostr;
    relayProfileService = session.relayProfileService;
  }

  /** アカウントリストストアをlocalStorageから同期 */
  function refreshAccountList(): void {
    syncAccountStores({
      accountManager,
      accountListStore,
      accountProfileCacheStore,
      localStorage,
    });
  }

  function syncParentClientAccount(pubkeyHex: string): void {
    if (accountManager.hasAccount(pubkeyHex)) {
      accountManager.setActiveAccount(pubkeyHex);
      return;
    }

    accountManager.addAccount(pubkeyHex, "parentClient");
  }

  function isCurrentParentClientRuntime(pubkeyHex?: string | null): boolean {
    const currentPubkey = authState.value?.pubkey;
    const connectedPubkey = parentClientAuthService.getUserPubkey();

    if (
      authState.value?.type !== "parentClient" ||
      !parentClientAuthService.isConnected() ||
      !currentPubkey ||
      !connectedPubkey
    ) {
      return false;
    }

    if (!pubkeyHex) {
      return currentPubkey === connectedPubkey;
    }

    return currentPubkey === pubkeyHex && connectedPubkey === pubkeyHex;
  }

  async function requestParentClientAuth(
    options: {
      silent?: boolean;
      timeoutMs?: number;
    } = {},
  ): Promise<AuthResult> {
    if (parentClientAuthPromise) {
      return parentClientAuthPromise;
    }

    isLoadingParentClient = true;
    parentClientAuthPromise = authService
      .authenticateWithParentClient(options)
      .finally(() => {
        isLoadingParentClient = false;
        parentClientAuthPromise = null;
        void flushPendingRemoteEmbedActions();
      });

    return parentClientAuthPromise;
  }

  async function synchronizeParentClientAuth(
    options: {
      silent?: boolean;
      timeoutMs?: number;
    } = {},
  ): Promise<AuthResult> {
    const result = await requestParentClientAuth(options);
    if (result.success && result.pubkeyHex) {
      syncParentClientAccount(result.pubkeyHex);
    }

    return result;
  }

  async function activateParentClientAuth(
    options: {
      silent?: boolean;
      timeoutMs?: number;
    } = {},
  ): Promise<string | undefined> {
    const result = await synchronizeParentClientAuth(options);
    if (!result.success || !result.pubkeyHex) {
      return result.error ?? "parent_client_auth_error";
    }

    rxNostr = disposeNostrSession(rxNostr);
    await handlePostAuth(result.pubkeyHex);
    return undefined;
  }

  function getReplyQuoteApplyParams() {
    return {
      relayProfileService,
      rxNostr,
      relayConfig: relayConfigStore.value,
      setReplyQuote,
      updateReferencedEvent,
      updateAuthorDisplayName,
      setReplyQuoteError,
    };
  }

  function notifyRemoteComposerApplied(requestId?: string): void {
    iframeMessageService.notifyComposerContextApplied(requestId);
  }

  function notifyRemoteComposerError(
    error: string | { code: string; message?: string },
    requestId?: string,
  ): void {
    iframeMessageService.notifyComposerContextError(error, requestId);
  }

  function notifyRemoteComposerContextUpdated(): void {
    const payload = buildComposerContextUpdatedPayload(replyQuoteState.value);
    const signature = buildComposerContextSignature(payload);

    if (signature === lastNotifiedComposerContextSignature) {
      return;
    }

    lastNotifiedComposerContextSignature = signature;
    iframeMessageService.notifyComposerContextUpdated({
      reply: payload.reply,
      quotes: payload.quotes,
    });
  }

  function applyRemoteComposerContent(
    content: string | null | undefined,
  ): void {
    if (content === undefined) {
      return;
    }

    if (content === null) {
      clearUrlQueryContentStore();
      postComponentRef?.resetPostContent?.();
      return;
    }

    if (postComponentRef?.insertTextContent) {
      postComponentRef.insertTextContent(content);
      clearUrlQueryContentStore();
      return;
    }

    updateUrlQueryContentStore(content);
  }

  async function applyRemoteComposerSetContext(
    payload: EmbedComposerSetContextPayload,
  ): Promise<void> {
    applyRemoteComposerContent(payload.content);

    const replyQuoteQuery = getReplyQuoteFromEmbedPayload(payload);
    const hasReplyQuoteContext =
      payload.reply !== undefined ||
      (Array.isArray(payload.quotes) && payload.quotes.length > 0);

    if (!replyQuoteQuery) {
      if (!hasReplyQuoteContext) {
        return;
      }
      console.warn("親ページから無効な composer.setContext を受信:", payload);
      throw new Error("invalid_composer_context");
    }

    await applyReplyQuoteQuery({
      replyQuoteQuery,
      ...getReplyQuoteApplyParams(),
    });
  }

  async function handleRemoteComposerSetContext(
    payload: EmbedComposerSetContextPayload,
    requestId?: string,
  ): Promise<void> {
    if (isBootstrappingApp || parentClientAuthPromise) {
      pendingRemoteComposerAction = {
        type: "set",
        payload,
        requestId,
      };
      return;
    }

    try {
      await applyRemoteComposerSetContext(payload);
      notifyRemoteComposerApplied(requestId);
    } catch (error) {
      console.error("composer.setContext の適用に失敗:", error);
      notifyRemoteComposerError(
        {
          code: "composer_context_apply_failed",
          message: error instanceof Error ? error.message : String(error),
        },
        requestId,
      );
    }
  }

  async function handleRemoteComposerClearContext(
    requestId?: string,
  ): Promise<void> {
    if (isBootstrappingApp || parentClientAuthPromise) {
      pendingRemoteComposerAction = {
        type: "clear",
        requestId,
      };
      return;
    }

    clearReplyQuote();
    notifyRemoteComposerApplied(requestId);
  }

  async function flushPendingRemoteComposerAction(): Promise<void> {
    if (isBootstrappingApp || parentClientAuthPromise) {
      return;
    }

    const pendingAction = pendingRemoteComposerAction;
    pendingRemoteComposerAction = undefined;
    if (!pendingAction) {
      return;
    }

    if (pendingAction.type === "clear") {
      clearReplyQuote();
      notifyRemoteComposerApplied(pendingAction.requestId);
      return;
    }

    try {
      await applyRemoteComposerSetContext(pendingAction.payload);
      notifyRemoteComposerApplied(pendingAction.requestId);
    } catch (error) {
      console.error("保留中の composer.setContext の適用に失敗:", error);
      notifyRemoteComposerError(
        {
          code: "composer_context_apply_failed",
          message: error instanceof Error ? error.message : String(error),
        },
        pendingAction.requestId,
      );
    }
  }

  async function flushPendingRemoteEmbedActions(): Promise<void> {
    if (isBootstrappingApp || parentClientAuthPromise) {
      return;
    }

    if (pendingRemoteParentLoginPubkey !== undefined) {
      const queuedPubkey = pendingRemoteParentLoginPubkey;
      pendingRemoteParentLoginPubkey = undefined;
      await handleRemoteParentClientLogin(queuedPubkey);
    }

    await flushPendingRemoteComposerAction();
  }

  async function handleRemoteParentClientLogin(
    pubkeyHex: string | null,
  ): Promise<void> {
    if (isBootstrappingApp) {
      pendingRemoteParentLoginPubkey = pubkeyHex;
      return;
    }

    if (isCurrentParentClientRuntime(pubkeyHex)) {
      return;
    }

    const error = await activateParentClientAuth({
      silent: true,
      timeoutMs: PARENT_CLIENT_REMOTE_SYNC_TIMEOUT_MS,
    });

    if (error) {
      console.error("親クライアント連携の自動同期に失敗:", error);
    }

    await flushPendingRemoteEmbedActions();
  }

  async function handleRemoteParentClientLogout(
    pubkeyHex: string | null,
  ): Promise<void> {
    const targetPubkey = pubkeyHex || authState.value?.pubkey;
    if (!targetPubkey) return;
    if (authState.value?.type !== "parentClient") return;
    if (authState.value?.pubkey !== targetPubkey) return;

    const storedType = accountManager.getAccountType(targetPubkey);
    if (storedType && storedType !== "parentClient") {
      const restored = await switchAccount(targetPubkey);
      if (restored) {
        refreshAccountList();
        return;
      }
    }

    await logoutAccount(targetPubkey, {
      closeDialog: false,
      notifyParentClient: false,
    });
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
      await handleSuccessfulAuthResult(result, handlePostAuth);
    } catch (e) {
      isLoadingProfileStore.set(false);
    }
  }

  /**
   * 指定アカウントのログアウト（マルチアカウント対応）
   */
  async function logoutAccount(
    pubkeyHex: string,
    options: { closeDialog?: boolean; notifyParentClient?: boolean } = {},
  ) {
    isLoggingOut = true;
    try {
      resetUploadDisplayState();
      const nextAction = resolveLogoutAccountAction(
        authService.logoutAccount(pubkeyHex, {
          notifyParentClient: options.notifyParentClient,
        }),
      );

      if (nextAction.kind === "switch") {
        rxNostr = disposeNostrSession(rxNostr);
        await switchAccount(nextAction.pubkeyHex);
      } else if (nextAction.kind === "guest") {
        rxNostr = disposeNostrSession(rxNostr);
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

      refreshAccountList();
      if (options.closeDialog !== false && nextAction.kind !== "keep-current") {
        logoutDialog.close();
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
  async function switchAccount(pubkeyHex: string): Promise<boolean> {
    if (isSwitchingAccount) return false;
    isSwitchingAccount = true;
    try {
      rxNostr = disposeNostrSession(rxNostr);

      return await restoreManagedAccountSession({
        pubkeyHex,
        accountManager,
        restoreAccount: (
          nextPubkeyHex: string,
          type: "nsec" | "nip07" | "nip46" | "parentClient",
        ) => authService.restoreAccount(nextPubkeyHex, type),
        handlePostAuth,
        onMissingAccountType: () => {
          console.error("アカウントタイプが見つかりません:", pubkeyHex);
        },
        onRestoreFailure: () => {
          console.error("アカウント復元に失敗:", pubkeyHex);
        },
      });
    } catch (error) {
      console.error("アカウント切替中にエラー:", error);
      return false;
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
    logoutDialog.close();
    setTimeout(() => {
      addAccountDialog.open();
      showTransitionOverlay = false;
    }, 50);
  }

  async function handleNip07Login(): Promise<string | undefined> {
    isLoadingNip07 = true;
    try {
      const result = await authService.authenticateWithNip07();
      if (!result.success) {
        console.error("NIP-07認証失敗:", result.error);
        return result.error ?? "nip07_auth_error";
      }

      await handleSuccessfulAuthResult(result, handlePostAuth);
      return undefined;
    } catch (error) {
      console.error("NIP-07ログインでエラー:", error);
      return error instanceof Error ? error.message : "nip07_auth_error";
    } finally {
      isLoadingNip07 = false;
    }
  }

  async function handleParentClientLogin(): Promise<string | undefined> {
    try {
      return await activateParentClientAuth();
    } catch (error) {
      console.error("親クライアント連携ログインでエラー:", error);
      return error instanceof Error
        ? error.message
        : "parent_client_auth_error";
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

      await handleSuccessfulAuthResult(result, handlePostAuth);
      return undefined;
    } catch (error) {
      console.error("NIP-46ログインでエラー:", error);
      return error instanceof Error ? error.message : "NIP-46 login failed";
    } finally {
      isLoadingNip46 = false;
    }
  }

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

  onMount(() => {
    parentClientAvailable = parentClientAuthService.initialize({
      locationSearch: window.location.search,
    });
    embedComposerContextService.initialize({
      locationSearch: window.location.search,
    });

    const cleanupParentClientLoginHandler =
      parentClientAuthService.onRemoteLogin((pubkeyHex) => {
        void handleRemoteParentClientLogin(pubkeyHex);
      });

    const cleanupParentClientLogoutHandler =
      parentClientAuthService.onRemoteLogout((pubkeyHex) => {
        void handleRemoteParentClientLogout(pubkeyHex);
      });

    const cleanupRemoteComposerSetContextHandler =
      embedComposerContextService.onRemoteSetContext((payload, requestId) => {
        void handleRemoteComposerSetContext(payload, requestId);
      });

    const cleanupRemoteComposerClearContextHandler =
      embedComposerContextService.onRemoteClearContext((requestId) => {
        void handleRemoteComposerClearContext(requestId);
      });

    const cleanupReplyQuoteChangeHandler = onReplyQuoteChanged(() => {
      if (isBootstrappingApp) {
        return;
      }

      notifyRemoteComposerContextUpdated();
    });

    if (parentClientAvailable) {
      parentClientAuthService.announceReady();
    }

    // NIP-07拡張機能の遅延注入を検出（nos2x等のdocument_endで注入される拡張機能に対応）
    if (!nip07ExtensionAvailable) {
      waitNostr(3000).then((nostr) => {
        if (nostr) nip07ExtensionAvailable = true;
      });
    }

    const getExternalInputBootstrapParams = (): Omit<
      RunExternalInputBootstrapParams,
      "sharedError"
    > => ({
      sharedMediaStore,
      isSharedMediaProcessed,
      markSharedMediaProcessed,
      setSharedMediaError,
      consumeFirstVisitFlag,
      showWelcomeDialog: welcomeDialog.open,
      updateUrlQueryContentStore,
      setReplyQuote,
      updateReferencedEvent,
      updateAuthorDisplayName,
      setReplyQuoteError,
      relayProfileService,
      rxNostr,
      relayConfig: relayConfigStore.value,
      locationHref: window.location.href,
    });

    void runAppInitializationBootstrap({
      reloadSettings: () => settingsStore.reload(),
      locationSearch: window.location.search,
      clearSharedMediaError,
      waitForLocale: waitLocale,
      markLocaleInitialized: () => {
        localeInitialized = true;
      },
      initializeAuth: () => authService.initializeAuth(),
      handleAuthenticated: handlePostAuth,
      initializeGuestSession: () => initializeNostr(),
      stopProfileLoading: () => isLoadingProfileStore.set(false),
      refreshAccountList,
      markAuthInitialized: () => authService.markAuthInitialized(),
      getExternalInputBootstrapParams,
      console,
    }).finally(() => {
      isBootstrappingApp = false;
      void flushPendingRemoteEmbedActions().finally(() => {
        notifyRemoteComposerContextUpdated();
      });
    });

    const cleanupVisibilityHandler = registerNip46VisibilityHandler({
      document,
      authState,
      nip46Service,
      console,
    });

    return () => {
      cleanupVisibilityHandler();
      cleanupParentClientLoginHandler();
      cleanupParentClientLogoutHandler();
      cleanupRemoteComposerSetContextHandler();
      cleanupRemoteComposerClearContextHandler();
      cleanupReplyQuoteChangeHandler();
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
      markSharedMediaProcessed();
      // 受信直後に一度クリア（次回共有のため）
      setTimeout(() => clearSharedMediaProcessed(), 500);
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
    clearSharedMediaProcessed();
  }

  // 追加: エディター内容クリア
  function handleResetPostContent() {
    postComponentRef?.resetPostContent();
  }

  // --- 下書き機能ハンドラ---
  function handleSaveDraft(): boolean {
    if (!postComponentRef?.getEditorHtml) return false;
    const payload = createDraftSavePayload({
      htmlContent: postComponentRef.getEditorHtml(),
      galleryItems: mediaGalleryStore.getItems(),
      replyQuoteState: replyQuoteState.value,
    });

    if (!payload) return false;

    const result = saveDraft(
      payload.content,
      payload.galleryItems,
      payload.replyQuoteData,
    );
    if (result.needsConfirmation) {
      draftLimitConfirm.stage({
        content: payload.content,
        galleryItems: payload.galleryItems,
        replyQuoteData: payload.replyQuoteData,
      });
      return false;
    }
    return result.success;
  }

  function handleApplyDraft(draft: Draft) {
    applyDraftToComposer({
      draft,
      isGalleryMode: !mediaFreePlacementStore.value,
      document,
      clearGallery: () => mediaGalleryStore.clearAll(),
      addGalleryItem: (item: MediaGalleryItem) =>
        mediaGalleryStore.addItem(item),
      loadDraftContent: (content: string) =>
        postComponentRef?.loadDraftContent(content),
      appendMediaToEditor: (items: MediaGalleryItem[]) =>
        postComponentRef?.appendMediaToEditor(items),
      generateMediaItemId,
      restoreReplyQuote,
      clearReplyQuote,
    });
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

    if (!relayProfileService) {
      return;
    }

    await refreshRelaysAndProfileForAccount({
      pubkeyHex: authState.value.pubkey,
      relayProfileService,
      profileDataStore,
      profileLoadedStore,
      accountProfileCacheStore,
    });
  }
</script>

{#if $locale && localeInitialized}
  <Tooltip.Provider>
    <main>
      <div class="main-content">
        <HeaderComponent
          onResetPostContent={handleResetPostContent}
          onSaveDraft={handleSaveDraft}
          onShowDraftList={draftListDialog.open}
          balloonMessage={settingsStore.showBalloonMessage
            ? balloon.finalMessage
            : null}
          showMascot={settingsStore.showMascot}
          showBalloonMessage={settingsStore.showBalloonMessage}
        />
        {#if replyQuoteState.value.reply}
          <ReplyQuotePreview
            reference={replyQuoteState.value.reply}
            mode="reply"
            onClear={clearReplyReference}
          />
        {/if}
        <PostComponent
          bind:this={postComponentRef}
          {rxNostr}
          hasStoredKey={isAuthenticated}
          onPostSuccess={handlePostSuccess}
        />
        {#each replyQuoteState.value.quotes as quote (quote.eventId)}
          <ReplyQuotePreview
            reference={quote}
            mode="quote"
            onClear={() => removeQuoteReference(quote.eventId)}
          />
        {/each}
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
        onShowLoginDialog={loginDialog.open}
        onOpenSettingsDialog={settingsDialog.open}
        onOpenLogoutDialog={logoutDialog.open}
      />
      {#if showLoginDialogStore.value}
        <LoginDialog
          show={showLoginDialogStore.value}
          bind:secretKey
          onClose={loginDialog.close}
          onSave={saveSecretKey}
          onParentClientLogin={handleParentClientLogin}
          onNip07Login={handleNip07Login}
          onNip46Login={handleNip46Login}
          isParentClientAvailable={parentClientAvailable}
          {isLoadingParentClient}
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
          onClose={addAccountDialog.close}
          onSave={saveSecretKey}
          onParentClientLogin={handleParentClientLogin}
          onNip07Login={handleNip07Login}
          onNip46Login={handleNip46Login}
          isParentClientAvailable={parentClientAvailable}
          {isLoadingParentClient}
          isNip07ExtensionAvailable={nip07ExtensionAvailable}
          {isLoadingNip07}
          {isLoadingNip46}
          isAddAccountMode={true}
        />
      {/if}
      {#if showLogoutDialogStore.value}
        <ProfileComponent
          show={showLogoutDialogStore.value}
          onClose={logoutDialog.close}
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
          onClose={welcomeDialog.close}
        />
      {/if}
      {#if showDraftListDialogStore.value}
        <DraftListDialog
          show={showDraftListDialogStore.value}
          onClose={draftListDialog.close}
          onApplyDraft={handleApplyDraft}
        />
      {/if}
      {#if showDraftLimitConfirmStore.value}
        <ConfirmDialog
          open={showDraftLimitConfirmStore.value}
          onOpenChange={draftLimitConfirm.handleOpenChange}
          title={$_("common.confirm")}
          description={$_("draft.limit_reached")}
          confirmLabel={$_("common.ok")}
          cancelLabel={$_("common.cancel")}
          confirmVariant="danger"
          onConfirm={draftLimitConfirm.confirm}
          onCancel={draftLimitConfirm.cancel}
        />
      {/if}
      <SettingsDialog
        show={showSettingsDialogStore.value}
        onClose={settingsDialog.close}
        onRefreshRelaysAndProfile={handleRefreshRelaysAndProfile}
        onOpenWelcomeDialog={welcomeDialog.open}
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
