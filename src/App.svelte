<script lang="ts">
  import { onMount } from "svelte";
  import "./i18n";
  import { _, locale, waitLocale } from "svelte-i18n";
  import { Tooltip } from "bits-ui";
  import type { RelayProfileService } from "./lib/relayProfileService";
  import ConfirmDialog from "./components/ConfirmDialog.svelte";
  import { authService } from "./lib/authService";
  import { iframeMessageService } from "./lib/iframeMessageService";
  import { waitNostr } from "nip07-awaiter";
  import { AccountManager } from "./lib/accountManager";
  import { nip46Service } from "./lib/nip46Service";
  import { parentClientAuthService } from "./lib/parentClientAuthService";
  import { embedComposerContextService } from "./lib/embedComposerContextService";
  import { embedIndexedDbService } from "./lib/embedIndexedDbService";
  import { embedSettingsService } from "./lib/embedSettingsService";
  import { uploadDestinationsRepository } from "./lib/storage/uploadDestinationsRepository";
  import {
    embedStorageService,
    EMBED_STORAGE_KEYS,
  } from "./lib/embedStorageService";
  import HeaderComponent from "./components/HeaderComponent.svelte";
  import FooterComponent from "./components/FooterComponent.svelte";
  import KeyboardButtonBar from "./components/KeyboardButtonBar.svelte";
  import ReasonInput from "./components/ReasonInput.svelte";
  import ChannelContextPreview from "./components/ChannelContextPreview.svelte";
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
    showPostHistoryDialogStore,
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
    saveRelayConfigToStorage,
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
  import type { AuthResult, Draft, MediaGalleryItem, NostrEvent, PostResult } from "./lib/types";
  import { useBalloonMessage } from "./lib/hooks/useBalloonMessage.svelte";
  import { saveDraft, saveDraftWithReplaceOldest } from "./lib/draftManager";
  import { mediaGalleryStore } from "./stores/mediaGalleryStore.svelte";
  import {
    addQuoteReference,
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
    setQuoteNotificationEnabled,
  } from "./stores/replyQuoteStore.svelte";
  import {
    channelContextState,
    clearChannelContext,
    onChannelContextChanged,
    restoreChannelContext,
    setChannelContext,
  } from "./stores/channelContextStore.svelte";
  import { relayConfigStore } from "./stores/relayStore.svelte";
  import {
    initializeNostrSession,
    completePostAuthBootstrap,
    refreshRelaysAndProfileForAccount,
    syncAccountStores,
    type NostrSessionBootstrap,
  } from "./lib/bootstrap/authBootstrap";
  import {
    POST_EDITOR_COMPACT_MIN_HEIGHT,
    POST_EDITOR_MIN_HEIGHT,
  } from "./lib/postLayoutUtils";
  import {
    resolveComposerAvailableHeight,
    resolveComposerSiblingHeight,
  } from "./lib/utils/composerLayoutUtils";
  import { setupViewportListener } from "./stores/uiStore.svelte";
  import {
    runAppInitializationBootstrap,
    registerNip46VisibilityHandler,
  } from "./lib/bootstrap/appInitializationBootstrap";
  import {
    applyChannelContextQuery,
    applyReplyQuoteQuery,
    hydrateReplyQuoteReferences,
    type RunExternalInputBootstrapParams,
  } from "./lib/bootstrap/externalInputBootstrap";
  import type {
    EmbedComposerSetContextPayload,
    EmbedSettingsSetPayload,
  } from "./lib/embedProtocol";
  import {
    buildComposerContextSignature,
    buildComposerContextUpdatedPayload,
  } from "./lib/embedComposerContextNotification";
  import {
    applyDraftToComposer,
    createDraftSavePayload,
  } from "./lib/draftContentUtils";
  import {
    buildPatchedChannelContext,
    buildPatchedReplyQuoteQuery,
  } from "./lib/embedComposerContextPatch";
  import {
    buildPostHistoryReferenceTarget,
    buildPostHistoryReplyChannelContextQuery,
    buildPostHistoryReplySeedEvents,
  } from "./lib/postHistoryReplyUtils";
  import type { PostHistoryRecord } from "./lib/storage/ehagakiDb";
  import {
    applyEmbedComposerContent,
    buildEmbedComposerContextPatch,
  } from "./lib/embedComposerContextApply";
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
  import { focusEditor } from "./lib/utils/appDomUtils";
  import { generateMediaItemId } from "./lib/utils/appUtils";
  import { CUSTOM_EMOJI_PICKER_CHROME_HEIGHT } from "./lib/customEmoji";
  import type { CustomEmojiSelection } from "./lib/customEmojiUsage";
  import {
    prefetchLatestPostHistoryDescriptors,
    schedulePostHistoryWarmupOnIdle,
    type PostHistoryWarmupResult,
  } from "./lib/postHistoryPrefetch";
  import { usePostHistoryInboundInteractionsRealtime } from "./lib/hooks/usePostHistoryInboundInteractionsRealtime.svelte";
  import { usePostHistoryInboundReplyReconciliation } from "./lib/hooks/usePostHistoryInboundReplyReconciliation.svelte";
  import { usePostHistoryAuthoredPostsRealtime } from "./lib/hooks/usePostHistoryAuthoredPostsRealtime.svelte";
  import { usePostHistoryVisibilityResumeSync } from "./lib/hooks/usePostHistoryVisibilityResumeSync.svelte";
  import { customEmojiStore } from "./stores/customEmojiStore.svelte";
  import { customEmojiUsageStore } from "./stores/customEmojiUsageStore.svelte";

  type PostComponent =
    typeof import("./components/PostComponent.svelte").default;
  type LoginDialogComponent =
    typeof import("./components/LoginDialog.svelte").default;
  type ProfileComponent =
    typeof import("./components/ProfileComponent.svelte").default;
  type SettingsDialogComponent =
    typeof import("./components/SettingsDialog.svelte").default;
  type WelcomeDialogComponent =
    typeof import("./components/WelcomeDialog.svelte").default;
  type DraftListDialogComponent =
    typeof import("./components/DraftListDialog.svelte").default;
  type PostHistoryDialogComponent =
    typeof import("./components/PostHistoryDialog.svelte").default;
  type CustomEmojiPickerComponent =
    typeof import("./components/CustomEmojiPicker.svelte").default;
  type ComponentImporter<T> = () => Promise<{ default: T }>;

  let PostComponent: PostComponent | null = $state(null);
  let LoginDialogComponent: LoginDialogComponent | null = $state(null);
  let ProfileComponent: ProfileComponent | null = $state(null);
  let SettingsDialogComponent: SettingsDialogComponent | null = $state(null);
  let WelcomeDialogComponent: WelcomeDialogComponent | null = $state(null);
  let DraftListDialogComponent: DraftListDialogComponent | null = $state(null);
  let PostHistoryDialogComponent: PostHistoryDialogComponent | null =
    $state(null);
  let CustomEmojiPickerComponent: CustomEmojiPickerComponent | null =
    $state(null);

  function createComponentLoader<T>(
    importer: ComponentImporter<T>,
    options: { eager?: boolean } = {},
  ): () => Promise<T> {
    let modulePromise: Promise<T> | null = options.eager
      ? importer().then((module) => module.default)
      : null;

    return async () => {
      modulePromise ??= importer().then((module) => module.default);
      return modulePromise;
    };
  }

  const loadPostComponentModule = createComponentLoader<PostComponent>(
    () => import("./components/PostComponent.svelte"),
    { eager: true },
  );
  const loadLoginDialogModule = createComponentLoader<LoginDialogComponent>(
    () => import("./components/LoginDialog.svelte"),
  );
  const loadProfileComponentModule = createComponentLoader<ProfileComponent>(
    () => import("./components/ProfileComponent.svelte"),
  );
  const loadSettingsDialogModule =
    createComponentLoader<SettingsDialogComponent>(
      () => import("./components/SettingsDialog.svelte"),
    );
  const loadWelcomeDialogModule = createComponentLoader<WelcomeDialogComponent>(
    () => import("./components/WelcomeDialog.svelte"),
  );
  const loadDraftListDialogModule =
    createComponentLoader<DraftListDialogComponent>(
      () => import("./components/DraftListDialog.svelte"),
    );
  const loadPostHistoryDialogModule =
    createComponentLoader<PostHistoryDialogComponent>(
      () => import("./components/PostHistoryDialog.svelte"),
    );
  const loadCustomEmojiPickerModule =
    createComponentLoader<CustomEmojiPickerComponent>(
      () => import("./components/CustomEmojiPicker.svelte"),
    );

  async function loadPostComponent(): Promise<void> {
    PostComponent = await loadPostComponentModule();
  }

  async function loadLoginDialog(): Promise<void> {
    LoginDialogComponent = await loadLoginDialogModule();
  }

  async function loadProfileDialog(): Promise<void> {
    ProfileComponent = await loadProfileComponentModule();
  }

  async function loadSettingsDialog(): Promise<void> {
    SettingsDialogComponent = await loadSettingsDialogModule();
  }

  async function loadWelcomeDialog(): Promise<void> {
    WelcomeDialogComponent = await loadWelcomeDialogModule();
  }

  async function loadDraftListDialog(): Promise<void> {
    DraftListDialogComponent = await loadDraftListDialogModule();
  }

  async function loadPostHistoryDialog(): Promise<void> {
    PostHistoryDialogComponent = await loadPostHistoryDialogModule();
  }

  async function loadCustomEmojiPicker(): Promise<void> {
    CustomEmojiPickerComponent = await loadCustomEmojiPickerModule();
  }

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
  let showLastAccountLogoutConfirm = $state(false);
  let pendingLastLogoutPubkey: string | null = $state(null);
  let lastAccountLogoutError = $state("");
  let showTransitionOverlay = $state(false); // ダイアログ切替時のちらつき防止用
  let isBootstrappingApp = true;
  let postHistoryWarmupPubkey: string | null = null;
  let postHistoryWarmupResult: PostHistoryWarmupResult | null = null;
  let postHistoryWarmupPromise: Promise<PostHistoryWarmupResult> | null = null;
  let latestInboundDirectReplySave = $state<{
    revision: number;
    parentEventIds: string[];
  } | null>(null);
  let latestAuthoredSelfPostSave = $state<{
    revision: number;
    eventIds: string[];
  } | null>(null);
  let latestPostedEvent: NostrEvent | null = $state(null);
  let composerScrollRegionEl: HTMLDivElement | null = $state(null);
  let composerScrollContentEl: HTMLDivElement | null = $state(null);
  let customEmojiPickerRegionEl: HTMLDivElement | null = $state(null);
  let composerAvailableHeight = $state(POST_EDITOR_MIN_HEIGHT);
  let customEmojiPickerHeight = $state(0);
  let customEmojiPickerOpen = $state(false);
  let postEditorMinHeight = $derived(
    customEmojiPickerOpen
      ? POST_EDITOR_COMPACT_MIN_HEIGHT
      : POST_EDITOR_MIN_HEIGHT,
  );
  let customEmojiPickerMaxHeight = $derived(
    Math.max(
      0,
      Math.floor(
        composerAvailableHeight -
          postEditorMinHeight -
          CUSTOM_EMOJI_PICKER_CHROME_HEIGHT,
      ),
    ),
  );
  let postAvailableComposerHeight = $derived(
    customEmojiPickerOpen
      ? Math.max(
          postEditorMinHeight,
          composerAvailableHeight - customEmojiPickerHeight,
        )
      : composerAvailableHeight,
  );
  let hasDraftComposerContext = $derived(
    !!channelContextState.value ||
      !!replyQuoteState.value.reply ||
      replyQuoteState.value.quotes.length > 0,
  );
  let parentClientAuthPromise: Promise<AuthResult> | null = null;
  let pendingRemoteParentLoginPubkey: string | null | undefined = undefined;
  let lastNotifiedComposerContextSignature: string | null = null;
  let pendingRemoteComposerAction:
    | {
        type: "set";
        payload: EmbedComposerSetContextPayload;
        requestId: string;
      }
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
  const postHistoryDialog = createDialogVisibilityHandlers(
    showPostHistoryDialogStore,
  );
  const addAccountDialog = createDialogVisibilityHandlers(
    showAddAccountDialogStore,
  );
  const draftLimitConfirm = createDraftLimitConfirmHandlers({
    pendingDraftContentStore,
    showDraftLimitConfirmStore,
    saveDraftWithReplaceOldest: async (
      content,
      galleryItems,
      replyQuoteData,
      channelData,
    ) => {
      await saveDraftWithReplaceOldest(
        content,
        galleryItems,
        replyQuoteData,
        channelData,
        {
          pubkeyHex: authState.value?.pubkey ?? null,
        },
      );
    },
  });

  const postHistoryInboundReplyReconciliation =
    usePostHistoryInboundReplyReconciliation({
      getIsAuthenticated: () => isAuthenticated,
      getPubkeyHex: () => authState.value?.pubkey ?? null,
      getRxNostr: () => rxNostr,
      getRelayConfig: () => relayConfigStore.value,
      onSavedDirectReplies: (parentEventIds) => {
        latestInboundDirectReplySave = {
          revision: (latestInboundDirectReplySave?.revision ?? 0) + 1,
          parentEventIds,
        };
      },
    });

  usePostHistoryInboundInteractionsRealtime({
    getIsAuthenticated: () => isAuthenticated,
    getPubkeyHex: () => authState.value?.pubkey ?? null,
    getRxNostr: () => rxNostr,
    getRelayConfig: () => relayConfigStore.value,
    reconcileDirectReplyCandidates:
      postHistoryInboundReplyReconciliation.reconcileDirectReplyCandidates,
  });

  async function handleSavedSelfPosts(eventIds: string[]): Promise<void> {
    await postHistoryInboundReplyReconciliation.notifySelfPostsSaved(eventIds);
    latestAuthoredSelfPostSave = {
      revision: (latestAuthoredSelfPostSave?.revision ?? 0) + 1,
      eventIds,
    };
  }

  usePostHistoryAuthoredPostsRealtime({
    getIsAuthenticated: () => isAuthenticated,
    getPubkeyHex: () => authState.value?.pubkey ?? null,
    getRxNostr: () => rxNostr,
    getRelayConfig: () => relayConfigStore.value,
    onSavedSelfPosts: handleSavedSelfPosts,
  });

  usePostHistoryVisibilityResumeSync({
    getIsAuthenticated: () => isAuthenticated,
    getPubkeyHex: () => authState.value?.pubkey ?? null,
    getRxNostr: () => rxNostr,
    getRelayConfig: () => relayConfigStore.value,
    getReconciliationPubkeyHex: () =>
      postHistoryInboundReplyReconciliation.state.activePubkeyHex,
    reconcileDirectReplyCandidates:
      postHistoryInboundReplyReconciliation.reconcileDirectReplyCandidates,
    onSavedSelfPosts: handleSavedSelfPosts,
  });

  $effect(() => {
    if ($locale && localeInitialized) {
      void loadPostComponent();
    }
  });

  $effect(() => {
    if (showLoginDialogStore.value || showAddAccountDialogStore.value) {
      void loadLoginDialog();
    }
  });

  $effect(() => {
    if (showLogoutDialogStore.value) {
      void loadProfileDialog();
    }
  });

  $effect(() => {
    if (showSettingsDialogStore.value) {
      void loadSettingsDialog();
    }
  });

  $effect(() => {
    if (showWelcomeDialogStore.value) {
      void loadWelcomeDialog();
    }
  });

  $effect(() => {
    if (showDraftListDialogStore.value) {
      void loadDraftListDialog();
    }
  });

  $effect(() => {
    if (showPostHistoryDialogStore.value) {
      void loadPostHistoryDialog();
    }
  });

  $effect(() => {
    const pubkeyHex =
      isAuthenticated && authState.value?.pubkey
        ? authState.value.pubkey
        : null;

    if (!pubkeyHex) {
      resetPostHistoryWarmupState(null);
      return;
    }

    if (postHistoryWarmupPubkey !== pubkeyHex) {
      resetPostHistoryWarmupState(pubkeyHex);
    }

    if (
      isBootstrappingApp ||
      (postHistoryWarmupResult && postHistoryWarmupResult.status !== "failed")
    ) {
      return;
    }

    const scheduled = schedulePostHistoryWarmupOnIdle(() => {
      void warmLatestPostHistoryDescriptors();
    });

    return () => {
      scheduled.cancel();
    };
  });

  $effect(() => {
    if (customEmojiPickerOpen) {
      void loadCustomEmojiPicker();
    }
  });

  function syncComposerAvailableHeight(): void {
    if (!composerScrollRegionEl || !composerScrollContentEl) {
      composerAvailableHeight = POST_EDITOR_MIN_HEIGHT;
      return;
    }

    const postBlock = composerScrollContentEl.querySelector(
      '[data-composer-block="post"]',
    );

    if (!(postBlock instanceof HTMLElement)) {
      composerAvailableHeight = POST_EDITOR_MIN_HEIGHT;
      return;
    }

    const siblingHeight = resolveComposerSiblingHeight(
      composerScrollContentEl,
      postBlock,
    );
    const nextHeight = resolveComposerAvailableHeight({
      composerViewportHeight: composerScrollRegionEl.clientHeight,
      siblingHeight,
      minHeight: POST_EDITOR_MIN_HEIGHT,
    });

    if (composerAvailableHeight !== nextHeight) {
      composerAvailableHeight = nextHeight;
    }
  }

  async function initializeNostr(pubkeyHex?: string): Promise<void> {
    const session = await initializeNostrSession({
      pubkeyHex,
      relayListUpdatedStore: {
        value: relayListUpdatedStore.value,
        set: (value: number) => relayListUpdatedStore.set(value),
      },
      setRelayManager,
      onRelayConfigSaved: (pubkeyHex, relayConfig) =>
        saveRelayConfigToStorage(pubkeyHex, relayConfig ?? {}),
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
      onRelayConfigSaved: (pubkeyHex, relayConfig) =>
        saveRelayConfigToStorage(pubkeyHex, relayConfig ?? {}),
      profileDataStore,
      profileLoadedStore,
      isLoadingProfileStore,
      accountManager,
      accountListStore,
      accountProfileCacheStore,
    });

    rxNostr = session.rxNostr;
    relayProfileService = session.relayProfileService;
  }

  /** アカウントリストストアを保存済みプロフィールキャッシュから同期 */
  function refreshAccountList(): void {
    void syncAccountStores({
      accountManager,
      accountListStore,
      accountProfileCacheStore,
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

  function getChannelContextApplyParams() {
    return {
      rxNostr,
      relayConfig: relayConfigStore.value,
      setChannelContext,
    };
  }

  function notifyRemoteComposerApplied(requestId: string): void {
    iframeMessageService.notifyComposerContextApplied(requestId);
  }

  function notifyRemoteComposerError(
    error: string | { code: string; message?: string },
    requestId: string,
  ): void {
    iframeMessageService.notifyComposerContextError(error, requestId);
  }

  function notifyRemoteComposerContextUpdated(): void {
    const payload = buildComposerContextUpdatedPayload(
      replyQuoteState.value,
      channelContextState.value,
    );
    const signature = buildComposerContextSignature(payload);

    if (signature === lastNotifiedComposerContextSignature) {
      return;
    }

    lastNotifiedComposerContextSignature = signature;
    iframeMessageService.notifyComposerContextUpdated({
      reply: payload.reply,
      quotes: payload.quotes,
      channel: payload.channel ?? null,
    });
  }

  async function applyRemoteComposerSetContext(
    payload: EmbedComposerSetContextPayload,
  ): Promise<void> {
    applyEmbedComposerContent(payload.content, {
      clearUrlQueryContentStore,
      updateUrlQueryContentStore,
      resetPostContent: () => postComponentRef?.resetPostContent?.(),
      insertTextContent: postComponentRef?.insertTextContent
        ? (content: string) => postComponentRef?.insertTextContent?.(content)
        : undefined,
    });

    const { channelContext, replyQuoteQuery } = buildEmbedComposerContextPatch(
      payload,
      replyQuoteState.value,
    );

    if (channelContext !== undefined) {
      if (channelContext === null) {
        clearChannelContext();
      } else {
        await applyChannelContextQuery({
          channelContextQuery: channelContext,
          ...getChannelContextApplyParams(),
        });
      }
    }

    if (replyQuoteQuery === undefined) {
      return;
    }

    if (replyQuoteQuery === null) {
      clearReplyQuote();
      return;
    }

    await applyReplyQuoteQuery({
      replyQuoteQuery,
      ...getReplyQuoteApplyParams(),
    });
  }

  async function handleRemoteComposerSetContext(
    payload: EmbedComposerSetContextPayload,
    requestId: string,
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

  async function handleRemoteSettingsSet(
    payload: EmbedSettingsSetPayload,
    requestId: string,
  ): Promise<void> {
    try {
      const applied = settingsStore.applyParentSettings(
        payload,
        "parentForced",
      );
      if (payload.uploadEndpoint !== undefined) {
        await uploadDestinationsRepository.applyUploadEndpointPreference({
          endpoint: payload.uploadEndpoint,
          mode: "forced",
          pubkeyHex: null,
        });
        applied.push("uploadEndpoint");
      }
      iframeMessageService.notifySettingsApplied(applied, requestId);
    } catch (error) {
      console.error("settings.set の適用に失敗:", error);
      iframeMessageService.notifySettingsError(
        {
          code: "settings_apply_failed",
          message: error instanceof Error ? error.message : String(error),
        },
        requestId,
      );
    }
  }

  async function initializeEmbedStorageSync(): Promise<void> {
    try {
      const result = await embedStorageService.get([...EMBED_STORAGE_KEYS]);
      const applied = embedStorageService.applySnapshotToLocalStorage(
        result.values,
      );
      if (applied.length > 0) {
        settingsStore.applyStoredSnapshot();
      }
      embedStorageService.persistLocalStorageKeys([...EMBED_STORAGE_KEYS]);
    } catch (error) {
      console.warn("親 storage の初期同期をスキップ:", error);
    }
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

  function requestLogoutAccount(pubkeyHex: string) {
    const accounts = accountManager.getAccounts();
    const isLastAccount =
      accounts.length === 1 && accounts[0]?.pubkeyHex === pubkeyHex;

    if (!isLastAccount) {
      void logoutAccount(pubkeyHex);
      return;
    }

    pendingLastLogoutPubkey = pubkeyHex;
    lastAccountLogoutError = "";
    showTransitionOverlay = true;
    logoutDialog.close();
    setTimeout(() => {
      if (pendingLastLogoutPubkey === pubkeyHex) {
        showLastAccountLogoutConfirm = true;
      }
      showTransitionOverlay = false;
    }, 50);
  }

  function cancelLastAccountLogout() {
    if (isLoggingOut) return;
    showLastAccountLogoutConfirm = false;
    pendingLastLogoutPubkey = null;
    lastAccountLogoutError = "";
  }

  async function confirmLastAccountLogout() {
    if (!pendingLastLogoutPubkey || isLoggingOut) return;

    isLoggingOut = true;
    lastAccountLogoutError = "";
    try {
      resetUploadDisplayState();
      rxNostr = disposeNostrSession(rxNostr);
      await authService.logoutLastAccount(pendingLastLogoutPubkey);
      window.location.reload();
    } catch (error) {
      console.error("最後のアカウントのリセット中にエラー:", error);
      lastAccountLogoutError =
        error instanceof Error ? error.message : "reset_failed";
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

  $effect(() => {
    const pubkey = authState.value?.pubkey;
    if (!pubkey || !authState.value?.isAuthenticated) {
      return;
    }

    void customEmojiStore.prefetchCache({ pubkey });
    void customEmojiUsageStore.load({ pubkey });
  });

  $effect(() => {
    return setupViewportListener();
  });

  $effect(() => {
    replyQuoteState.value.reply;
    replyQuoteState.value.quotes.length;
    composerScrollRegionEl;
    composerScrollContentEl;

    if (typeof window === "undefined") {
      composerAvailableHeight = POST_EDITOR_MIN_HEIGHT;
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      syncComposerAvailableHeight();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  });

  $effect(() => {
    replyQuoteState.value.reply;
    replyQuoteState.value.quotes.length;
    composerScrollRegionEl;
    composerScrollContentEl;

    if (
      !composerScrollRegionEl ||
      !composerScrollContentEl ||
      typeof ResizeObserver === "undefined"
    ) {
      return;
    }

    syncComposerAvailableHeight();

    const resizeObserver = new ResizeObserver(() => {
      syncComposerAvailableHeight();
    });

    resizeObserver.observe(composerScrollRegionEl);
    resizeObserver.observe(composerScrollContentEl);

    for (const child of Array.from(composerScrollContentEl.children)) {
      resizeObserver.observe(child);
    }

    return () => {
      resizeObserver.disconnect();
    };
  });

  $effect(() => {
    customEmojiPickerOpen;
    customEmojiPickerRegionEl;

    if (!customEmojiPickerOpen) {
      customEmojiPickerHeight = 0;
      return;
    }

    if (!customEmojiPickerRegionEl || typeof ResizeObserver === "undefined") {
      customEmojiPickerHeight = 0;
      return;
    }

    const syncCustomEmojiPickerHeight = () => {
      customEmojiPickerHeight = Math.ceil(
        customEmojiPickerRegionEl?.getBoundingClientRect().height ?? 0,
      );
    };

    syncCustomEmojiPickerHeight();

    const resizeObserver = new ResizeObserver(() => {
      syncCustomEmojiPickerHeight();
    });

    resizeObserver.observe(customEmojiPickerRegionEl);

    return () => {
      resizeObserver.disconnect();
    };
  });

  let localeInitialized = $state(false);

  onMount(() => {
    parentClientAvailable = parentClientAuthService.initialize({
      locationSearch: window.location.search,
    });
    embedComposerContextService.initialize({
      locationSearch: window.location.search,
    });
    embedSettingsService.initialize({
      locationSearch: window.location.search,
    });
    if (
      embedStorageService.initialize({ locationSearch: window.location.search })
    ) {
      void initializeEmbedStorageSync();
    }
    embedIndexedDbService.initialize({
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

    const cleanupRemoteSettingsSetHandler =
      embedSettingsService.onRemoteSetSettings((payload, requestId) => {
        void handleRemoteSettingsSet(payload, requestId);
      });

    const cleanupRemoteSettingsErrorHandler =
      embedSettingsService.onRemoteSettingsError((error, requestId) => {
        if (!requestId) {
          return;
        }

        iframeMessageService.notifySettingsError(error, requestId);
      });

    const cleanupReplyQuoteChangeHandler = onReplyQuoteChanged(() => {
      if (isBootstrappingApp) {
        return;
      }

      notifyRemoteComposerContextUpdated();
    });
    const cleanupChannelContextChangeHandler = onChannelContextChanged(() => {
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
      setChannelContext,
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
      cleanupRemoteSettingsSetHandler();
      cleanupRemoteSettingsErrorHandler();
      cleanupReplyQuoteChangeHandler();
      cleanupChannelContextChangeHandler();
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

  function handlePostSuccess(result?: PostResult) {
    // 投稿成功時にfooter情報を全て削除
    resetUploadDisplayState();
    // 共有メディアフラグをクリア
    clearSharedMediaProcessed();
    latestPostedEvent = result?.event ?? null;
  }

  function handleResetPostContent() {
    postComponentRef?.resetPostContent();
    clearReplyQuote();
    clearChannelContext();
  }

  // --- 下書き機能ハンドラ---
  async function handleSaveDraft(): Promise<boolean> {
    if (!postComponentRef?.getEditorHtml) return false;
    const payload = createDraftSavePayload({
      htmlContent: postComponentRef.getEditorHtml(),
      galleryItems: mediaGalleryStore.getItems(),
      channelContextState: channelContextState.value,
      replyQuoteState: replyQuoteState.value,
    });

    if (!payload) return false;

    const result = await saveDraft(
      payload.content,
      payload.galleryItems,
      payload.replyQuoteData,
      payload.channelData,
      { pubkeyHex: authState.value?.pubkey ?? null },
    );
    if (result.needsConfirmation) {
      draftLimitConfirm.stage({
        content: payload.content,
        galleryItems: payload.galleryItems,
        channelData: payload.channelData,
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
      restoreChannelContext,
      clearChannelContext,
      restoreReplyQuote,
      clearReplyQuote,
    });
  }

  function handlePostHistoryReply(post: PostHistoryRecord): void {
    const preloadedEvents = buildPostHistoryReplySeedEvents(post);
    const channelContextQuery = buildPostHistoryReplyChannelContextQuery(post);
    const referenceTarget = buildPostHistoryReferenceTarget(post);

    if (channelContextQuery) {
      void applyChannelContextQuery({
        channelContextQuery,
        ...getChannelContextApplyParams(),
      }).catch((error) => {
        console.error("投稿履歴からのチャンネル適用に失敗:", error);
      });
    } else {
      clearChannelContext();
    }

    void applyReplyQuoteQuery({
      replyQuoteQuery: {
        reply: {
          ...referenceTarget,
        },
        quotes: [],
      },
      ...getReplyQuoteApplyParams(),
      ...(preloadedEvents ? { preloadedEvents } : {}),
    }).catch((error) => {
      console.error("投稿履歴からのリプライ適用に失敗:", error);
    });

    focusEditor(".tiptap-editor", 100);
  }

  function handlePostHistoryQuote(post: PostHistoryRecord): void {
    const channelContextQuery = buildPostHistoryReplyChannelContextQuery(post);
    const referenceTarget = buildPostHistoryReferenceTarget(post);

    if (channelContextQuery) {
      void applyChannelContextQuery({
        channelContextQuery,
        ...getChannelContextApplyParams(),
      }).catch((error) => {
        console.error("投稿履歴からのチャンネル適用に失敗:", error);
      });
    } else {
      clearChannelContext();
    }

    if (
      replyQuoteState.value.reply !== null ||
      replyQuoteState.value.quotes.length > 0
    ) {
      clearReplyQuote();
    }

    if (!addQuoteReference(referenceTarget)) {
      focusEditor(".tiptap-editor", 100);
      return;
    }

    const preloadedEvents = buildPostHistoryReplySeedEvents(post);

    void hydrateReplyQuoteReferences({
      references: [referenceTarget],
      ...getReplyQuoteApplyParams(),
      ...(preloadedEvents ? { preloadedEvents } : {}),
    }).catch((error) => {
      console.error("投稿履歴からの引用適用に失敗:", error);
    });

    focusEditor(".tiptap-editor", 100);
  }

  function resetPostHistoryWarmupState(pubkeyHex: string | null): void {
    postHistoryWarmupPubkey = pubkeyHex;
    postHistoryWarmupResult = null;
    postHistoryWarmupPromise = null;
  }

  async function warmLatestPostHistoryDescriptors(): Promise<PostHistoryWarmupResult> {
    const pubkeyHex = authState.value?.isAuthenticated
      ? (authState.value.pubkey ?? null)
      : null;

    if (!pubkeyHex) {
      resetPostHistoryWarmupState(null);
      return { status: "skipped", urlCount: 0 };
    }

    if (postHistoryWarmupPubkey !== pubkeyHex) {
      resetPostHistoryWarmupState(pubkeyHex);
    }

    if (postHistoryWarmupPromise) {
      return postHistoryWarmupPromise;
    }

    if (
      postHistoryWarmupResult &&
      postHistoryWarmupResult.status !== "failed"
    ) {
      return postHistoryWarmupResult;
    }

    const activePubkeyHex = pubkeyHex;
    const warmupPromise = prefetchLatestPostHistoryDescriptors({
      pubkeyHex: activePubkeyHex,
    })
      .then((result) => {
        if (postHistoryWarmupPubkey === activePubkeyHex) {
          postHistoryWarmupResult = result;
        }

        return result;
      })
      .finally(() => {
        if (postHistoryWarmupPubkey === activePubkeyHex) {
          postHistoryWarmupPromise = null;
        }
      });

    postHistoryWarmupPromise = warmupPromise;
    return warmupPromise;
  }

  function handleWarmPostHistoryDialog(): void {
    void warmLatestPostHistoryDescriptors();
  }

  // バルーンメッセージフック
  const balloon = useBalloonMessage(
    () => $_,
    () => localeInitialized,
  );
  const showHeaderBalloonMessage = $derived(
    settingsStore.showMascot && settingsStore.showFlavorText,
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

  function recordCustomEmojiUse(emoji: CustomEmojiSelection): void {
    const pubkey = authState.value?.pubkey;
    if (!pubkey) return;

    void customEmojiUsageStore.recordUse({ pubkey, emoji });
  }

  function handleCustomEmojiSelect(emoji: CustomEmojiSelection): void {
    postComponentRef?.insertCustomEmoji?.({
      identityKey: emoji.identityKey,
      shortcode: emoji.shortcode,
      src: emoji.src,
      setAddress: emoji.setAddress,
    });
    recordCustomEmojiUse(emoji);
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
          canSaveDraft={hasDraftComposerContext || undefined}
          canResetPostContent={hasDraftComposerContext || undefined}
          balloonMessage={showHeaderBalloonMessage
            ? balloon.finalMessage
            : null}
          compactMessage={showHeaderBalloonMessage
            ? null
            : balloon.compactMessage}
          showMascot={settingsStore.showMascot}
          showFlavorText={showHeaderBalloonMessage}
        />
        <div class="composer-scroll-region" bind:this={composerScrollRegionEl}>
          <div
            class="composer-scroll-content"
            bind:this={composerScrollContentEl}
          >
            {#if channelContextState.value}
              <div class="composer-block composer-reference-block">
                <ChannelContextPreview
                  channel={channelContextState.value}
                  onClear={clearChannelContext}
                />
              </div>
            {/if}
            {#if replyQuoteState.value.reply}
              <div class="composer-block composer-reference-block">
                <ReplyQuotePreview
                  reference={replyQuoteState.value.reply}
                  mode="reply"
                  onClear={clearReplyReference}
                />
              </div>
            {/if}
            <div
              class="composer-block composer-post-block"
              data-composer-block="post"
            >
              <div class="composer-post-layout">
                {#if PostComponent}
                  <PostComponent
                    bind:this={postComponentRef}
                    {rxNostr}
                    hasStoredKey={isAuthenticated}
                    availableComposerHeight={postAvailableComposerHeight}
                    minEditorHeight={postEditorMinHeight}
                    onPostSuccess={handlePostSuccess}
                    onCustomEmojiSelect={recordCustomEmojiUse}
                  />
                {/if}
                {#if customEmojiPickerOpen && CustomEmojiPickerComponent}
                  <div
                    class="custom-emoji-picker-region"
                    bind:this={customEmojiPickerRegionEl}
                  >
                    <CustomEmojiPickerComponent
                      {rxNostr}
                      pubkey={authState.value.pubkey}
                      open={customEmojiPickerOpen}
                      maxHeight={customEmojiPickerMaxHeight}
                      onSelect={handleCustomEmojiSelect}
                      customEmojiUsageItems={customEmojiUsageStore.items}
                      onMoveCaretLeft={() =>
                        postComponentRef?.moveCaretLeft?.()}
                      onMoveCaretRight={() =>
                        postComponentRef?.moveCaretRight?.()}
                      onDeleteBackward={() =>
                        postComponentRef?.deleteBackward?.()}
                      onInsertLineBreak={() =>
                        postComponentRef?.insertLineBreak?.()}
                    />
                  </div>
                {/if}
              </div>
            </div>
            {#each replyQuoteState.value.quotes as quote (quote.eventId)}
              <div class="composer-block composer-reference-block">
                <ReplyQuotePreview
                  reference={quote}
                  mode="quote"
                  quoteNotificationEnabled={quote.quoteNotificationEnabled}
                  onToggleQuoteNotification={(enabled) =>
                    setQuoteNotificationEnabled(quote.eventId, enabled)}
                  onClear={() => removeQuoteReference(quote.eventId)}
                />
              </div>
            {/each}
          </div>
        </div>
      </div>
      <ReasonInput />
      <KeyboardButtonBar
        onUploadImage={() => postComponentRef?.openFileDialog()}
        onPostButtonTap={() => balloon.showTips()}
        {customEmojiPickerOpen}
        onCustomEmojiPickerOpenChange={(open) => (customEmojiPickerOpen = open)}
      />
      <FooterComponent
        {isAuthenticated}
        {isAuthInitialized}
        swNeedRefresh={$swNeedRefresh}
        onShowLoginDialog={loginDialog.open}
        onWarmPostHistoryDialog={handleWarmPostHistoryDialog}
        onOpenPostHistoryDialog={postHistoryDialog.open}
        onOpenSettingsDialog={settingsDialog.open}
        onOpenLogoutDialog={logoutDialog.open}
      />
      {#if showLoginDialogStore.value && LoginDialogComponent}
        <LoginDialogComponent
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
      {#if showAddAccountDialogStore.value && LoginDialogComponent}
        <LoginDialogComponent
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
      {#if showLogoutDialogStore.value && ProfileComponent}
        <ProfileComponent
          show={showLogoutDialogStore.value}
          onClose={logoutDialog.close}
          onLogout={requestLogoutAccount}
          onSwitchAccount={switchAccount}
          onAddAccount={handleAddAccount}
          accounts={accountListStore.value}
          accountProfiles={accountProfileCacheStore.value}
          {isLoggingOut}
          {isSwitchingAccount}
        />
      {/if}
      {#if showLastAccountLogoutConfirm}
        <ConfirmDialog
          open={showLastAccountLogoutConfirm}
          onOpenChange={(open) => {
            if (!open) cancelLastAccountLogout();
          }}
          title={$_("logoutDialog.last_account_reset_confirmation")}
          description={$_("logoutDialog.last_account_reset_warning")}
          confirmLabel={$_("logoutDialog.logout")}
          cancelLabel={$_("logoutDialog.cancel")}
          confirmVariant="danger"
          confirmDisabled={isLoggingOut}
          closeOnConfirm={false}
          onConfirm={confirmLastAccountLogout}
          onCancel={cancelLastAccountLogout}
        >
          <div class="last-account-logout-confirm-content">
            <div class="confirm-dialog-message">
              {$_("logoutDialog.last_account_reset_warning")}
            </div>
            {#if lastAccountLogoutError}
              <div class="last-account-logout-error">
                {$_("logoutDialog.last_account_reset_error")}
              </div>
            {/if}
          </div>
        </ConfirmDialog>
      {/if}
      {#if showWelcomeDialogStore.value && WelcomeDialogComponent}
        <WelcomeDialogComponent
          show={showWelcomeDialogStore.value}
          onClose={welcomeDialog.close}
        />
      {/if}
      {#if showDraftListDialogStore.value && DraftListDialogComponent}
        <DraftListDialogComponent
          show={showDraftListDialogStore.value}
          onClose={draftListDialog.close}
          onApplyDraft={handleApplyDraft}
          pubkeyHex={authState.value?.pubkey ?? null}
        />
      {/if}
      {#if showPostHistoryDialogStore.value && PostHistoryDialogComponent}
        <PostHistoryDialogComponent
          show={showPostHistoryDialogStore.value}
          onClose={postHistoryDialog.close}
          onReplyPost={handlePostHistoryReply}
          onQuotePost={handlePostHistoryQuote}
          pubkeyHex={authState.value?.pubkey ?? null}
          {rxNostr}
          relayConfig={relayConfigStore.value}
          {latestPostedEvent}
          inboundDirectReplySave={latestInboundDirectReplySave}
          authoredSelfPostSave={latestAuthoredSelfPostSave}
          reconcileInboundDirectReplyCandidates={postHistoryInboundReplyReconciliation.reconcileDirectReplyCandidates}
          notifySavedAuthoredPosts={postHistoryInboundReplyReconciliation.notifySelfPostsSaved}
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
      {#if SettingsDialogComponent}
        <SettingsDialogComponent
          show={showSettingsDialogStore.value}
          onClose={settingsDialog.close}
          onRefreshRelaysAndProfile={handleRefreshRelaysAndProfile}
          onOpenWelcomeDialog={welcomeDialog.open}
          {rxNostr}
        />
      {/if}
    </main>
  </Tooltip.Provider>
{/if}

<style>
  main {
    position: relative;
    display: flex;
    flex-direction: column;
    height: var(--app-main-height);
    overflow: hidden;
  }

  .last-account-logout-confirm-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .last-account-logout-error {
    color: var(--error-color, #d32f2f);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .transition-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--dialog-bg-overlay);
    z-index: 100;
    pointer-events: none;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding-top: var(--main-content-top-spacing);
    width: 100%;
    height: calc(
      100% - var(--composer-bottom-reserved-height) -
        var(--main-content-keyboard-adjustment) - var(--reason-input-height)
    );
    min-height: 0;
    overflow: hidden;
  }

  .composer-scroll-region {
    width: 100%;
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .composer-scroll-content {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex: 1 0 auto;
    flex-direction: column;
    gap: 4px;
  }

  .composer-block {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
  }

  .composer-post-block {
    flex: 1 1 auto;
    min-height: 0;
  }

  .composer-post-layout {
    width: 100%;
    max-width: 800px;
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .custom-emoji-picker-region {
    width: 100%;
    flex: 0 0 auto;
    min-height: 0;
    position: relative;
    z-index: 99;
  }
</style>
