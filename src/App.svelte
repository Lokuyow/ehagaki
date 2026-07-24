<script lang="ts">
  import { onMount } from "svelte";
  import "./i18n";
  import { _, locale, waitLocale } from "svelte-i18n";
  import { Tooltip } from "bits-ui";
  import type { RelayProfileService } from "./lib/relayProfileService";
  import { createReplyQuoteProfileSyncController } from "./lib/replyQuoteProfileSync";
  import { useReplyQuoteProfileSync } from "./lib/hooks/useReplyQuoteProfileSync.svelte";
  import ConfirmDialog from "./components/ConfirmDialog.svelte";
  import { authService, type PendingNip46AuthSession } from "./lib/authService";
  import { iframeMessageService } from "./lib/iframeMessageService";
  import { waitNostr } from "nip07-awaiter";
  import { AccountManager } from "./lib/accountManager";
  import {
    nip46Service,
    type Nip46ConnectionOperationState,
  } from "./lib/nip46Service";
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
    showComposerTargetDialogStore,
    showDraftListDialogStore,
    showDraftLimitConfirmStore,
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
    clearSharedMediaStore,
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
  } from "./stores/settingsStore.svelte";
  import { sharedMediaRepository } from "./lib/storage/sharedMediaRepository";
  import { composeSharedText } from "./lib/sharedContentUtils";
  import { acknowledgeSharedMedia } from "./lib/utils/swCommunication";
  import type { AuthResult, Draft, NostrEvent, PostResult } from "./lib/types";
  import { useBalloonMessage } from "./lib/hooks/useBalloonMessage.svelte";
  import { saveDraft, saveDraftWithReplaceOldest } from "./lib/draftManager";
  import { editorState } from "./stores/editorStore.svelte";
  import { mediaGalleryStore } from "./stores/mediaGalleryStore.svelte";
  import {
    addQuoteReference,
    setReplyQuote,
    updateReferencedEvent,
    updateAuthorProfile,
    setReplyQuoteError,
    onReplyQuoteChanged,
    replyQuoteState,
    restoreReplyQuote,
    clearReplyQuote,
    clearReplyReference,
    removeQuoteReference,
    setQuoteNotificationEnabled,
    initializeReplyNotificationRecipients,
    updateReplyNotificationRecipientProfile,
    setReplyNotificationRecipientEnabled,
  } from "./stores/replyQuoteStore.svelte";
  import {
    channelContextState,
    channelContextProvenanceState,
    channelContextRuntimeState,
    effectiveChannelContextState,
    getChannelContextOwnerToken,
    clearChannelContext,
    onChannelContextChanged,
    setChannelContextRuntimeState,
    setChannelContextWithProvenance,
  } from "./stores/channelContextStore.svelte";
  import { relayConfigStore } from "./stores/relayStore.svelte";
  import {
    resolveInitialNip46ConnectionRelayCandidates,
    saveLastUsedNip46ConnectionRelayCandidates,
  } from "./lib/nip46ConnectUiUtils";
  import {
    completePostAuthBootstrap,
    refreshRelaysAndProfileForAccount,
    runInitializeNostrSession,
    syncAccountStores,
    type NostrSessionBootstrap,
  } from "./lib/bootstrap/authBootstrap";
  import {
    POST_EDITOR_COMPACT_MIN_HEIGHT,
    POST_EDITOR_MIN_HEIGHT,
  } from "./lib/postLayoutUtils";
  import { setupViewportListener } from "./stores/uiStore.svelte";
  import {
    runAppInitializationBootstrap,
    registerNip46VisibilityHandler,
  } from "./lib/bootstrap/appInitializationBootstrap";
  import {
    applyReplyQuoteQuery,
    applyReplyQuoteSelection,
    hydrateReplyQuoteReferences,
    type RunExternalInputBootstrapParams,
  } from "./lib/bootstrap/externalInputBootstrap";
  import { createChannelContextApplyController } from "./lib/channelContextApplyController";
  import type { EmbedSettingsSetPayload } from "./lib/embedProtocol";
  import { createDraftComposerController } from "./lib/draftComposerController";
  import { createPostHistoryDialogApplyController } from "./lib/postHistoryDialogApplyController";
  import {
    createComposerTargetApplyController,
    type ComposerEventTarget,
  } from "./lib/composerTargetApplyController";
  import type { ComposerTargetAction } from "./lib/composerTargetUtils";
  import type { PostHistoryRecord } from "./lib/storage/ehagakiDb";
  import {
    createAppEmbedController,
    type AppEmbedAppliedSettingKey,
  } from "./lib/appEmbedController";
  import { createAppComponentLoaders } from "./lib/appComponentLoaders";
  import { createNip46AuthFlowController } from "./lib/nip46AuthFlowCoordinator";
  import { createDialogVisibilityHandlers } from "./lib/appDialogUtils";
  import {
    clearNip46RuntimeForAuthChange,
    disposeNostrSession,
    handleSuccessfulAuthResult,
    resolveLogoutAccountAction,
    restoreManagedAccountSession,
  } from "./lib/appAuthUtils";
  import { createAppAccountSessionController } from "./lib/appAccountSessionController";
  import { createAppAuthLoginController } from "./lib/appAuthLoginController";
  import { createAppParentClientSyncController } from "./lib/appParentClientSyncController";
  import { createAppAuthInteractionController } from "./lib/appAuthInteractionController";
  import { createAppAccountDialogController } from "./lib/appAccountDialogController";
  import { setupAppRuntimeBindings } from "./lib/appRuntimeBindings";
  import { createAppAuthEffectController } from "./lib/appAuthEffectController";
  import { createParentClientAuthCoordinator } from "./lib/parentClientAuthCoordinator";
  import { focusEditor } from "./lib/utils/appDomUtils";
  import { generateMediaItemId } from "./lib/utils/appUtils";
  import { CUSTOM_EMOJI_PICKER_CHROME_HEIGHT } from "./lib/customEmoji";
  import type { CustomEmojiSelection } from "./lib/customEmojiUsage";
  import {
    prefetchLatestPostHistoryDescriptors,
    schedulePostHistoryWarmupOnIdle,
  } from "./lib/postHistoryPrefetch";
  import { createPostHistoryWarmupController } from "./lib/postHistoryWarmupController";
  import { usePostHistoryInboundInteractionsRealtime } from "./lib/hooks/usePostHistoryInboundInteractionsRealtime.svelte";
  import { usePostHistoryInboundReplyReconciliation } from "./lib/hooks/usePostHistoryInboundReplyReconciliation.svelte";
  import { usePostHistoryAuthoredPostsRealtime } from "./lib/hooks/usePostHistoryAuthoredPostsRealtime.svelte";
  import { usePostHistoryForegroundPeriodicSync } from "./lib/hooks/usePostHistoryForegroundPeriodicSync.svelte";
  import { usePostHistoryVisibilityResumeSync } from "./lib/hooks/usePostHistoryVisibilityResumeSync.svelte";
  import { useComposerLayoutMetrics } from "./lib/hooks/useComposerLayoutMetrics.svelte";
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
  type ComposerTargetDialogComponent =
    typeof import("./components/ComposerTargetDialog.svelte").default;
  type CustomEmojiPickerComponent =
    typeof import("./components/CustomEmojiPicker.svelte").default;
  let PostComponent: PostComponent | null = $state(null);
  let LoginDialogComponent: LoginDialogComponent | null = $state(null);
  let ProfileComponent: ProfileComponent | null = $state(null);
  let SettingsDialogComponent: SettingsDialogComponent | null = $state(null);
  let WelcomeDialogComponent: WelcomeDialogComponent | null = $state(null);
  let DraftListDialogComponent: DraftListDialogComponent | null = $state(null);
  let PostHistoryDialogComponent: PostHistoryDialogComponent | null =
    $state(null);
  let ComposerTargetDialogComponent: ComposerTargetDialogComponent | null =
    $state(null);
  let CustomEmojiPickerComponent: CustomEmojiPickerComponent | null =
    $state(null);

  const {
    loadPostComponent,
    loadLoginDialog,
    loadProfileDialog,
    loadSettingsDialog,
    loadWelcomeDialog,
    loadDraftListDialog,
    loadPostHistoryDialog,
    loadComposerTargetDialog,
    loadCustomEmojiPicker,
  } = createAppComponentLoaders({
    setPostComponent: (component) => {
      PostComponent = component;
    },
    setLoginDialogComponent: (component) => {
      LoginDialogComponent = component;
    },
    setProfileComponent: (component) => {
      ProfileComponent = component;
    },
    setSettingsDialogComponent: (component) => {
      SettingsDialogComponent = component;
    },
    setWelcomeDialogComponent: (component) => {
      WelcomeDialogComponent = component;
    },
    setDraftListDialogComponent: (component) => {
      DraftListDialogComponent = component;
    },
    setPostHistoryDialogComponent: (component) => {
      PostHistoryDialogComponent = component;
    },
    setComposerTargetDialogComponent: (component) => {
      ComposerTargetDialogComponent = component;
    },
    setCustomEmojiPickerComponent: (component) => {
      CustomEmojiPickerComponent = component;
    },
  });

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
  let relayProfileService = $state<RelayProfileService | undefined>();
  let isLoadingParentClient = $state(false);
  let isLoadingNip07 = $state(false);
  let isLoadingNip46 = $state(false);
  let hasPendingNip46AuthSession = $state(false);
  let pendingNip46ConnectionUri = $state<string | null>(null);
  let isHandshakeStartedNip46NostrConnect = $state(false);
  let nip46NostrConnectErrorMessage = $state("");
  let pendingNip46AuthSession: PendingNip46AuthSession | null = null;
  let parentClientAvailable = $state(false);
  // NIP-07拡張機能の検出状態（nos2x等の遅延注入に対応するためリアクティブ）
  let nip07ExtensionAvailable = $state(authService.isNip07Available());
  let postComponentRef: any = $state();
  let isLoggingOut = $state(false); // 追加: ログアウト中の状態管理
  let isSwitchingAccount = $state(false); // アカウント切替中フラグ
  let nip46OperationState = $state<Nip46ConnectionOperationState>(
    nip46Service.getOperationState(),
  );
  let nip46ConnectionCheckStatus = $state<"idle" | "success" | "failure">(
    "idle",
  );
  let showLastAccountLogoutConfirm = $state(false);
  let pendingLastLogoutPubkey: string | null = $state(null);
  let lastAccountLogoutError = $state("");
  let showTransitionOverlay = $state(false); // ダイアログ切替時のちらつき防止用
  let isBootstrappingApp = true;
  let latestInboundInteractionSave = $state<{
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
  let customEmojiPickerOpen = $state(false);
  const composerLayoutMetrics = useComposerLayoutMetrics({
    setupViewportListener,
    getComposerScrollRegionEl: () => composerScrollRegionEl,
    getComposerScrollContentEl: () => composerScrollContentEl,
    getCustomEmojiPickerRegionEl: () => customEmojiPickerRegionEl,
    getCustomEmojiPickerOpen: () => customEmojiPickerOpen,
    getReplyQuoteState: () => replyQuoteState.value,
    minHeight: POST_EDITOR_MIN_HEIGHT,
  });
  let composerAvailableHeight = $derived(
    composerLayoutMetrics.composerAvailableHeight,
  );
  let customEmojiPickerHeight = $derived(
    composerLayoutMetrics.customEmojiPickerHeight,
  );
  const parentClientAuthCoordinator = createParentClientAuthCoordinator({
    authenticateWithParentClient: (options) =>
      authService.authenticateWithParentClient(options),
    syncParentClientAccount,
    setLoading: (isLoading) => {
      isLoadingParentClient = isLoading;
    },
    onRequestSettled: () => {
      void flushPendingRemoteParentClientAndEmbedActions();
    },
  });
  const postHistoryWarmupController = createPostHistoryWarmupController({
    getCurrentPubkeyHex: () =>
      authState.value?.isAuthenticated
        ? (authState.value.pubkey ?? null)
        : null,
    prefetchLatestPostHistoryDescriptors: (pubkeyHex) =>
      prefetchLatestPostHistoryDescriptors({ pubkeyHex }),
  });
  const postHistoryDialogApplyController =
    createPostHistoryDialogApplyController({
      startChannelContextQuery: (channelContextQuery) =>
        channelContextApplyController.applyPostHistory({
          query: channelContextQuery,
          rxNostr,
          relayConfig: relayConfigStore.value,
        }),
      applyReplyQuoteQuery,
      hydrateReplyQuoteReferences,
      getReplyQuoteApplyParams: () => getReplyQuoteApplyParams(),
      clearChannelContext: () => channelContextApplyController.clear(),
      hasReplyOrQuotes: () =>
        replyQuoteState.value.reply !== null ||
        replyQuoteState.value.quotes.length > 0,
      clearReplyQuote,
      addQuoteReference,
      focusEditor: () => {
        focusEditor(".tiptap-editor", 100);
      },
      logger: console,
    });
  const appAuthEffectController = createAppAuthEffectController({
    customEmojiStore,
    customEmojiUsageStore,
  });
  const appAuthInteractionController = createAppAuthInteractionController({
    getCurrentAuthType: () => authState.value?.type,
    getCurrentPubkeyHex: () => authState.value?.pubkey,
    authenticateWithNip07: () => authService.authenticateWithNip07(),
    authenticateWithNip46: (bunkerUrl) =>
      authService.authenticateWithNip46(bunkerUrl),
    cancelPendingNip46Auth,
    clearNip46RuntimeForAuthChange,
    handlePostAuth,
    setNip07Loading: (next) => {
      isLoadingNip07 = next;
    },
    setNip46Loading: (next) => {
      isLoadingNip46 = next;
    },
    setNip46ConnectionCheckStatus: (next) => {
      nip46ConnectionCheckStatus = next;
    },
    nip46Service,
    logger: console,
  });
  const appAuthLoginController = createAppAuthLoginController({
    parentClientAuthCoordinator,
    getCurrentAuthType: () => authState.value?.type,
    getCurrentPubkeyHex: () => authState.value?.pubkey,
    getCurrentRxNostr: () => rxNostr,
    setCurrentRxNostr: (next) => {
      rxNostr = next;
    },
    clearNip46RuntimeForAuthChange,
    nip46Service,
    disposeNostrSession,
    handlePostAuth,
    cancelPendingNip46Auth,
    authenticateWithNsec: (targetSecretKey) =>
      authService.authenticateWithNsec(targetSecretKey),
    handleSuccessfulAuthResult,
    setErrorMessage: (next) => {
      errorMessage = next;
    },
    setProfileLoading: (next) => {
      isLoadingProfileStore.set(next);
    },
    logger: console,
  });
  const nip46AuthFlowCoordinator = createNip46AuthFlowController({
    startNip46NostrConnect: (relayCandidates) =>
      authService.startNip46NostrConnect(relayCandidates),
    finalizeNip46Authentication: (pubkeyHex) =>
      authService.finalizeNip46Authentication(pubkeyHex),
    onAuthenticated: handlePostAuth,
    saveLastUsedRelayCandidates: (relayCandidates) => {
      saveLastUsedNip46ConnectionRelayCandidates(
        typeof localStorage === "undefined" ? undefined : localStorage,
        relayCandidates,
      );
    },
    console,
    state: {
      setPendingAuthSession: (session) => {
        pendingNip46AuthSession = session;
      },
      setHasPendingAuthSession: (hasPendingSession) => {
        hasPendingNip46AuthSession = hasPendingSession;
      },
      setConnectionUri: (connectionUri) => {
        pendingNip46ConnectionUri = connectionUri;
      },
      setHandshakeStarted: (isHandshakeStarted) => {
        isHandshakeStartedNip46NostrConnect = isHandshakeStarted;
      },
      setLoading: (isLoading) => {
        isLoadingNip46 = isLoading;
      },
      setErrorMessage: (message) => {
        nip46NostrConnectErrorMessage = message;
      },
    },
  });
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
  const composerTargetDialog = createDialogVisibilityHandlers(
    showComposerTargetDialogStore,
  );
  const addAccountDialog = createDialogVisibilityHandlers(
    showAddAccountDialogStore,
  );
  const appAccountSessionController = createAppAccountSessionController({
    getIsSwitchingAccount: () => isSwitchingAccount,
    setIsSwitchingAccount: (next) => {
      isSwitchingAccount = next;
    },
    getIsLoggingOut: () => isLoggingOut,
    setIsLoggingOut: (next) => {
      isLoggingOut = next;
    },
    setProfileLoading: (next) => {
      isLoadingProfileStore.set(next);
    },
    getAuthStateSnapshot: () => authState.value,
    getCurrentRxNostr: () => rxNostr,
    setCurrentRxNostr: (next) => {
      rxNostr = next;
    },
    disposeNostrSession,
    clearNip46RuntimeForAuthChange,
    nip46Service,
    accountManager,
    restoreManagedAccountSession,
    restoreAccount: (pubkeyHex, type) =>
      authService.restoreAccount(pubkeyHex, type),
    handlePostAuth,
    resetUploadDisplayState,
    logoutAccountFromAuthService: (pubkeyHex, options) =>
      authService.logoutAccount(pubkeyHex, {
        notifyParentClient: options.notifyParentClient,
      }),
    resolveLogoutAccountAction,
    clearAuthState,
    setGuestProfile: (profile) => {
      profileDataStore.set(profile);
    },
    setProfileLoaded: (next) => {
      profileLoadedStore.set(next);
    },
    initializeNostr: () => initializeNostr(),
    setSecretKey: (next) => {
      secretKey = next;
    },
    setErrorMessage: (next) => {
      errorMessage = next;
    },
    refreshAccountList,
    reloadWindow: () => window.location.reload(),
    closeLogoutDialog: logoutDialog.close,
    logger: console,
  });
  const appAccountDialogController = createAppAccountDialogController({
    accountManager,
    requestLogoutAccount: (pubkeyHex) => logoutAccount(pubkeyHex),
    closeLogoutDialog: logoutDialog.close,
    openAddAccountDialog: addAccountDialog.open,
    getPendingLastLogoutPubkey: () => pendingLastLogoutPubkey,
    setPendingLastLogoutPubkey: (next) => {
      pendingLastLogoutPubkey = next;
    },
    setLastAccountLogoutError: (next) => {
      lastAccountLogoutError = next;
    },
    setShowTransitionOverlay: (next) => {
      showTransitionOverlay = next;
    },
    getIsLoggingOut: () => isLoggingOut,
    setIsLoggingOut: (next) => {
      isLoggingOut = next;
    },
    setShowLastAccountLogoutConfirm: (next) => {
      showLastAccountLogoutConfirm = next;
    },
    resetUploadDisplayState,
    getCurrentRxNostr: () => rxNostr,
    setCurrentRxNostr: (next) => {
      rxNostr = next;
    },
    disposeNostrSession,
    logoutLastAccount: (pubkeyHex) => authService.logoutLastAccount(pubkeyHex),
    reloadWindow: () => window.location.reload(),
    logger: console,
  });
  function getInitialNip46ConnectRelayCandidates(): string[] {
    return resolveInitialNip46ConnectionRelayCandidates(
      typeof localStorage === "undefined" ? undefined : localStorage,
    );
  }

  function resetPendingNip46State(
    options: { preserveError?: boolean } = {},
  ): void {
    nip46AuthFlowCoordinator.resetPendingState(options);
  }

  async function cancelPendingNip46Auth(
    session: PendingNip46AuthSession | null = pendingNip46AuthSession,
    options: { preserveError?: boolean } = {},
  ): Promise<void> {
    await nip46AuthFlowCoordinator.cancelPendingAuth(session, options);
  }

  function handleLoginDialogClose(): void {
    loginDialog.close();
    void cancelPendingNip46Auth();
  }

  function handleAddAccountDialogClose(): void {
    addAccountDialog.close();
    void cancelPendingNip46Auth();
  }

  async function handleNostrConnectStart(
    relayCandidates: string[],
  ): Promise<string | undefined> {
    return nip46AuthFlowCoordinator.handleNostrConnectStart(relayCandidates);
  }

  function handleNostrConnectCancel(): void {
    void nip46AuthFlowCoordinator.cancelPendingAuth();
  }

  let draftLimitConfirmError = $state(false);

  const draftComposerController = createDraftComposerController({
    getEditorHtml: () => postComponentRef?.getEditorHtml?.(),
    getGalleryItems: () => mediaGalleryStore.getItems(),
    getChannelContextState: () => channelContextState.value,
    getChannelContextProvenance: () => channelContextProvenanceState.value,
    getReplyQuoteState: () => replyQuoteState.value,
    getPubkeyHex: () => authState.value?.pubkey ?? null,
    saveDraft,
    saveDraftWithReplaceOldest,
    openDraftLimitConfirm: () => {
      draftLimitConfirmError = false;
      showDraftLimitConfirmStore.set(true);
    },
    closeDraftLimitConfirm: () => showDraftLimitConfirmStore.set(false),
    logger: console,
    isGalleryMode: () => !mediaFreePlacementStore.value,
    document,
    clearGallery: () => mediaGalleryStore.clearAll(),
    addGalleryItem: (item) => mediaGalleryStore.addItem(item),
    loadDraftContent: (content) => {
      postComponentRef?.loadDraftContent(content);
    },
    appendMediaToEditor: (items) => {
      postComponentRef?.appendMediaToEditor(items);
    },
    generateMediaItemId,
    restoreChannelContext: (channelData) => {
      channelContextApplyController.applyDraft({
        channelData,
        rxNostr,
        relayConfig: relayConfigStore.value,
      });
    },
    clearChannelContext: () => channelContextApplyController.clear(),
    restoreReplyQuote,
    clearReplyQuote,
  });

  function notifyInboundInteractionsSaved(parentEventIds: string[]): void {
    latestInboundInteractionSave = {
      revision: (latestInboundInteractionSave?.revision ?? 0) + 1,
      parentEventIds,
    };
  }

  const postHistoryInboundReplyReconciliation =
    usePostHistoryInboundReplyReconciliation({
      getIsAuthenticated: () => isAuthenticated,
      getPubkeyHex: () => authState.value?.pubkey ?? null,
      getRxNostr: () => rxNostr,
      getRelayConfig: () => relayConfigStore.value,
      onSavedInboundInteractions: notifyInboundInteractionsSaved,
    });

  usePostHistoryInboundInteractionsRealtime({
    getIsAuthenticated: () => isAuthenticated,
    getPubkeyHex: () => authState.value?.pubkey ?? null,
    getRxNostr: () => rxNostr,
    getRelayConfig: () => relayConfigStore.value,
    onSavedInboundInteractions: notifyInboundInteractionsSaved,
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

  usePostHistoryForegroundPeriodicSync({
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
    if (showComposerTargetDialogStore.value) {
      void loadComposerTargetDialog();
    }
  });

  $effect(() => {
    if (!showPostHistoryDialogStore.value || isBootstrappingApp) {
      return;
    }

    const scheduled = schedulePostHistoryWarmupOnIdle(() => {
      void postHistoryWarmupController.warmLatestPostHistoryDescriptors();
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

  async function initializeNostr(pubkeyHex?: string): Promise<void> {
    await runInitializeNostrSession({
      pubkeyHex,
      relayListUpdatedStore: {
        value: relayListUpdatedStore.value,
        set: (value: number) => relayListUpdatedStore.set(value),
      },
      setRelayManager,
      onRelayConfigSaved: (pubkeyHex, relayConfig) =>
        saveRelayConfigToStorage(pubkeyHex, relayConfig ?? {}),
      onSession: (session) => {
        rxNostr = session.rxNostr;
        relayProfileService = session.relayProfileService;
      },
    });
  }

  /**
   * 認証成功後の共通処理: Nostr初期化 → リレー・プロフィール取得 → ストア更新
   */
  async function handlePostAuth(pubkeyHex: string): Promise<void> {
    const session = await completePostAuthBootstrap({
      pubkeyHex,
      closeAuthDialogs: () => {
        nip46AuthFlowCoordinator.resetPendingState();
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

  async function activateParentClientAuth(
    options: {
      silent?: boolean;
      timeoutMs?: number;
    } = {},
  ): Promise<string | undefined> {
    return appAuthLoginController.activateParentClientAuth(options);
  }

  function getReplyQuoteApplyParams() {
    return {
      rxNostr,
      relayConfig: relayConfigStore.value,
      setReplyQuote,
      updateReferencedEvent,
      initializeReplyNotificationRecipients,
      setReplyQuoteError,
    };
  }

  const channelContextApplyController = createChannelContextApplyController({
    getCurrentChannelContext: () => channelContextState.value,
    getChannelContextOwnerToken,
    setChannelContext: (context, provenance, ownerToken) =>
      setChannelContextWithProvenance(context, provenance, ownerToken),
    setRuntimeState: setChannelContextRuntimeState,
    clearChannelContext,
    logger: console,
  });

  const composerTargetApplyController = createComposerTargetApplyController({
    startChannelContextQuery: (query) =>
      channelContextApplyController.applyExternal({
        query,
        source: "manual",
        rxNostr,
        relayConfig: relayConfigStore.value,
      }),
    applyReplyQuoteQuery,
    hydrateReplyQuoteReferences,
    getReplyQuoteApplyParams: () => getReplyQuoteApplyParams(),
    clearChannelContext: () => channelContextApplyController.clear(),
    hasReplyOrQuotes: () =>
      replyQuoteState.value.reply !== null ||
      replyQuoteState.value.quotes.length > 0,
    clearReplyQuote,
    clearReplyReference,
    addQuoteReference,
    focusEditor: () => {
      focusEditor(".tiptap-editor", 100);
    },
    logger: console,
  });

  const appEmbedController = createAppEmbedController({
    composerInput: {
      get: () =>
        postComponentRef
          ? {
              resetContent: () => postComponentRef?.resetPostContent?.(),
              insertText: (content: string) =>
                postComponentRef?.insertTextContent?.(content),
            }
          : null,
    },
    sharedContent: {
      clearUrlQueryContentStore,
      updateUrlQueryContentStore,
    },
    composerContextApply: {
      applyReplyQuoteSelection: (query) =>
        applyReplyQuoteSelection({
          replyQuoteQuery: query,
          setReplyQuote,
        }),
      hydrateReplyQuoteReferences: (references, runtime) =>
        hydrateReplyQuoteReferences({
          references,
          rxNostr: runtime.rxNostr,
          relayConfig: runtime.relayConfig,
          updateReferencedEvent,
          initializeReplyNotificationRecipients,
          setReplyQuoteError,
        }),
      clearReplyQuote,
      applyChannelContextQuery: (query, runtime) => {
        channelContextApplyController.applyExternal({
          query,
          source: "iframe",
          rxNostr: runtime.rxNostr,
          relayConfig: runtime.relayConfig,
        });
      },
      clearChannelContext: () => channelContextApplyController.clear(),
    },
    settingsApply: {
      applySettings: async (payload: EmbedSettingsSetPayload) => {
        const applied = settingsStore.applyParentSettings(
          payload,
          "parentForced",
        ) as AppEmbedAppliedSettingKey[];
        if (payload.uploadEndpoint !== undefined) {
          await uploadDestinationsRepository.applyUploadEndpointPreference({
            endpoint: payload.uploadEndpoint,
            mode: "forced",
            pubkeyHex: null,
          });
          applied.push("uploadEndpoint");
        }

        return applied;
      },
    },
    parentFrame: {
      notifyComposerContextApplied: (requestId: string) =>
        iframeMessageService.notifyComposerContextApplied(requestId),
      notifyComposerContextError: (error, requestId: string) =>
        iframeMessageService.notifyComposerContextError(
          {
            code: error.code,
            ...(error.message ? { message: error.message } : {}),
          },
          requestId,
        ),
      notifyComposerContextUpdated: (payload) =>
        iframeMessageService.notifyComposerContextUpdated(payload),
      notifySettingsApplied: (applied, requestId: string) =>
        iframeMessageService.notifySettingsApplied([...applied], requestId),
      notifySettingsError: (error, requestId: string) =>
        iframeMessageService.notifySettingsError(
          {
            code: error.code,
            ...(error.message ? { message: error.message } : {}),
          },
          requestId,
        ),
    },
    runtime: {
      isBootstrappingApp: () => isBootstrappingApp,
      hasPendingParentAuth: () =>
        parentClientAuthCoordinator.hasPendingRequest(),
      getReplyQuoteState: () => replyQuoteState.value,
      getChannelContextState: () => channelContextState.value,
      getChannelContextProvenance: () => channelContextProvenanceState.value,
      getRuntimeSnapshot: () => ({
        rxNostr,
        relayConfig: relayConfigStore.value,
      }),
    },
    storage: {
      getEmbedStorageSnapshot: async () => {
        const result = await embedStorageService.get([...EMBED_STORAGE_KEYS]);
        return result.values ?? {};
      },
      applyEmbedStorageSnapshot: (values) => ({
        appliedKeys: embedStorageService.applySnapshotToLocalStorage(values),
      }),
      applyStoredSettingsSnapshot: () => {
        settingsStore.applyStoredSnapshot();
      },
      persistEmbedStorageKeys: () => {
        embedStorageService.persistLocalStorageKeys([...EMBED_STORAGE_KEYS]);
      },
    },
    logger: {
      warn: (message: string, meta?: unknown) => {
        console.warn(message, meta);
      },
      error: (message: string, meta?: unknown) => {
        console.error(message, meta);
      },
    },
  });
  const appParentClientSyncController = createAppParentClientSyncController({
    isBootstrappingApp: () => isBootstrappingApp,
    hasPendingParentAuth: () => parentClientAuthCoordinator.hasPendingRequest(),
    isCurrentParentClientRuntime: (pubkeyHex) => {
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
    },
    activateParentClientAuth,
    flushPendingComposerAction: () =>
      appEmbedController.flushPendingComposerAction(),
    logger: console,
  });

  // Parent client login/logout の保留処理と embed action の flush をまとめる coordinator.
  async function flushPendingRemoteParentClientAndEmbedActions(): Promise<void> {
    await appParentClientSyncController.flushPendingRemoteParentClientAndEmbedActions();
  }

  async function handleRemoteParentClientLogin(
    pubkeyHex: string | null,
  ): Promise<void> {
    await appParentClientSyncController.handleRemoteParentClientLogin(
      pubkeyHex,
    );
  }

  async function handleRemoteParentClientLogout(
    pubkeyHex: string | null,
  ): Promise<void> {
    await appAccountSessionController.handleRemoteParentClientLogout(pubkeyHex);
  }

  // --- 秘密鍵認証・保存処理 ---
  async function saveSecretKey() {
    await appAuthLoginController.saveSecretKey(secretKey);
  }

  /**
   * 指定アカウントのログアウト（マルチアカウント対応）
   */
  async function logoutAccount(
    pubkeyHex: string,
    options: { closeDialog?: boolean; notifyParentClient?: boolean } = {},
  ) {
    await appAccountSessionController.logoutAccount(pubkeyHex, options);
  }

  function requestLogoutAccount(pubkeyHex: string) {
    appAccountDialogController.requestLogoutAccount(pubkeyHex);
  }

  function cancelLastAccountLogout() {
    appAccountDialogController.cancelLastAccountLogout();
  }

  async function confirmLastAccountLogout() {
    await appAccountDialogController.confirmLastAccountLogout();
  }

  /**
   * アカウント切替
   */
  async function switchAccount(pubkeyHex: string): Promise<boolean> {
    return appAccountSessionController.switchAccount(pubkeyHex);
  }

  /**
   * アカウント追加ダイアログを表示
   * closeLogoutDialogのhistory.back()が非同期popstateを発火するため、
   * LoginDialogのpushStateが巻き戻されないよう遅延して開く。
   * 切替中はtransition overlayでちらつきを防止。
   */
  function handleAddAccount() {
    appAccountDialogController.handleAddAccount();
  }

  async function handleNip07Login(): Promise<string | undefined> {
    return appAuthInteractionController.handleNip07Login();
  }

  async function handleParentClientLogin(): Promise<string | undefined> {
    return appAuthLoginController.handleParentClientLogin();
  }

  async function handleNip46Login(
    bunkerUrl: string,
  ): Promise<string | undefined> {
    return appAuthInteractionController.handleNip46Login(bunkerUrl);
  }

  async function handleNip46ConnectionCheck(pubkeyHex: string): Promise<void> {
    await appAuthInteractionController.handleNip46ConnectionCheck(pubkeyHex);
  }

  $effect(() => {
    appAuthEffectController.runAuthenticatedCustomEmojiPrefetch(
      authState.value,
    );
  });

  $effect(() => {
    authState.value?.pubkey;
    authState.value?.type;
    nip46ConnectionCheckStatus =
      appAuthEffectController.resolveNip46ConnectionCheckStatusOnAuthIdentityChange();
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
      void appEmbedController.initializeEmbedStorageSync();
    }
    embedIndexedDbService.initialize({
      locationSearch: window.location.search,
    });

    const cleanupRuntimeBindings = setupAppRuntimeBindings({
      parentClientAvailable,
      parentClientAuthService,
      nip46Service,
      embedComposerContextService,
      embedSettingsService,
      onReplyQuoteChanged,
      onChannelContextChanged,
      handleRemoteParentClientLogin,
      handleRemoteParentClientLogout,
      setNip46OperationState: (state) => {
        nip46OperationState = state as Nip46ConnectionOperationState;
      },
      handleRemoteComposerSetContext: (payload, requestId) => {
        if (!requestId) {
          return;
        }

        return appEmbedController.handleRemoteComposerSetContext(
          payload,
          requestId,
        );
      },
      handleRemoteSettingsSet: (payload, requestId) => {
        if (!requestId) {
          return;
        }

        return appEmbedController.handleRemoteSettingsSet(
          payload as Parameters<
            typeof appEmbedController.handleRemoteSettingsSet
          >[0],
          requestId,
        );
      },
      notifySettingsError: (error, requestId) =>
        iframeMessageService.notifySettingsError(
          error as Parameters<
            typeof iframeMessageService.notifySettingsError
          >[0],
          requestId,
        ),
      notifyComposerContextUpdatedIfChanged: () =>
        appEmbedController.notifyComposerContextUpdatedIfChanged(),
    });

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
      setSharedMediaError,
      consumeFirstVisitFlag,
      showWelcomeDialog: welcomeDialog.open,
      updateUrlQueryContentStore,
      applyChannelContextQuery: (query) => {
        channelContextApplyController.applyExternal({
          query,
          source: "url",
          rxNostr,
          relayConfig: relayConfigStore.value,
        });
      },
      setReplyQuote,
      updateReferencedEvent,
      initializeReplyNotificationRecipients,
      setReplyQuoteError,
      rxNostr,
      relayConfig: relayConfigStore.value,
      locationHref: window.location.href,
      allowSharedMediaRecovery: true,
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
      void flushPendingRemoteParentClientAndEmbedActions().finally(() => {
        appEmbedController.notifyComposerContextUpdatedIfChanged();
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
      cleanupRuntimeBindings();
      composerTargetApplyController.dispose();
      channelContextApplyController.dispose();
    };
  });

  let isProcessingSharedContent = false;

  function clearSharedMediaStoreForShare(shareId: string): void {
    if (sharedMediaStore.shareId === shareId) {
      clearSharedMediaStore();
    }
  }

  async function deleteSharedMediaForShare(shareId: string): Promise<void> {
    // Clear the mirror first. If that acknowledgement fails, retain the
    // authoritative IndexedDB record to prevent the stale mirror being used.
    if (!(await acknowledgeSharedMedia(shareId))) {
      return;
    }
    await sharedMediaRepository.deleteLatestForShare(shareId);
  }

  async function consumeSharedContent(): Promise<void> {
    if (
      isProcessingSharedContent ||
      !sharedMediaStore.received ||
      !sharedMediaStore.shareId ||
      !postComponentRef
    ) {
      return;
    }

    isProcessingSharedContent = true;
    const shareId = sharedMediaStore.shareId;
    const mediaFiles = [...sharedMediaStore.files];
    const metadata = sharedMediaStore.metadata;
    let bodyStatus = sharedMediaStore.bodyStatus;

    try {
      if (bodyStatus === "pending") {
        const content = composeSharedText(sharedMediaStore);
        if (content && !postComponentRef.appendSharedTextContent(content)) {
          throw new Error("Failed to apply shared text to the editor");
        }

        bodyStatus = "applied";
        const updateResult = await sharedMediaRepository.updateLatestForShare(
          shareId,
          {
            images: mediaFiles,
            metadata,
            bodyStatus,
            automaticRetryCount: sharedMediaStore.automaticRetryCount,
          },
        );
        if (updateResult === "stale") {
          clearSharedMediaStoreForShare(shareId);
          return;
        }
      }

      if (mediaFiles.length === 0) {
        await deleteSharedMediaForShare(shareId);
        clearSharedMediaStoreForShare(shareId);
        return;
      }

      const uploadResult = await postComponentRef.uploadFiles(mediaFiles);
      const uploadedAllFiles =
        uploadResult !== null &&
        uploadResult.failedResults.length === 0 &&
        uploadResult.results !== null;

      if (uploadedAllFiles) {
        await deleteSharedMediaForShare(shareId);
      } else if (sharedMediaStore.automaticRetryCount < 1) {
        await sharedMediaRepository.updateLatestForShare(shareId, {
          images: mediaFiles,
          metadata,
          bodyStatus,
          automaticRetryCount: sharedMediaStore.automaticRetryCount + 1,
        });
        setSharedMediaError(
          "共有メディアのアップロードに失敗しました。次回起動時に一度だけ再試行します。",
          5000,
        );
      } else {
        await deleteSharedMediaForShare(shareId);
        setSharedMediaError(
          "共有メディアのアップロードに失敗しました。元のアプリからもう一度共有してください。",
          5000,
        );
      }

      clearSharedMediaStoreForShare(shareId);
    } catch (error) {
      console.error("Failed to consume shared content:", error);
      setSharedMediaError("共有コンテンツの取り込みに失敗しました", 5000);
      // Keep the persistent record unchanged so a later startup can recover it.
      clearSharedMediaStoreForShare(shareId);
    } finally {
      isProcessingSharedContent = false;

      // A newer share can arrive while the current one is awaiting upload.
      // Its effect run returns while this guard is true, so explicitly resume
      // consumption after the current share has released the guard.
      if (
        sharedMediaStore.received &&
        sharedMediaStore.shareId &&
        sharedMediaStore.shareId !== shareId
      ) {
        queueMicrotask(() => {
          void consumeSharedContent();
        });
      }
    }
  }

  $effect(() => {
    void consumeSharedContent();
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
    latestPostedEvent = result?.event ?? null;
  }

  function handleResetPostContent() {
    postComponentRef?.resetPostContent();
    clearReplyQuote();
    channelContextApplyController.clear();
  }

  // --- 下書き機能ハンドラ---
  async function handleSaveDraft() {
    return draftComposerController.saveDraftFromComposer();
  }

  async function handleConfirmPendingDraftSave() {
    draftLimitConfirmError = false;
    const result = await draftComposerController.confirmPendingDraftSave();
    if (result.status === "failed") {
      draftLimitConfirmError = true;
    }
  }

  function handleCancelPendingDraftSave() {
    draftLimitConfirmError = false;
    draftComposerController.cancelPendingDraftSave();
  }

  function handleApplyDraft(draft: Draft) {
    draftComposerController.applyDraftToComposer(draft);
  }

  function handlePostHistoryReply(post: PostHistoryRecord): Promise<boolean> {
    return postHistoryDialogApplyController.applyReply(post);
  }

  function handlePostHistoryQuote(post: PostHistoryRecord): void {
    postHistoryDialogApplyController.applyQuote(post);
  }

  function handleComposerTargetApply(
    action: ComposerTargetAction,
    target: ComposerEventTarget,
  ): boolean {
    if (action === "reply") {
      return composerTargetApplyController.applyReply(target);
    }
    if (action === "quote") {
      return composerTargetApplyController.applyQuote(target);
    }
    return composerTargetApplyController.applyChannel(target);
  }

  function handleWarmPostHistoryDialog(): void {
    void postHistoryWarmupController.warmLatestPostHistoryDescriptors();
  }

  // バルーンメッセージフック
  const balloon = useBalloonMessage(
    () => $_,
    () => localeInitialized,
  );
  const showHeaderBalloonMessage = $derived(
    settingsStore.showMascot && settingsStore.showFlavorText,
  );
  useReplyQuoteProfileSync({
    getRelayProfileService: () => relayProfileService,
    getReplyQuoteState: () => replyQuoteState.value,
    onReplyQuoteChanged,
    createController: (service) =>
      createReplyQuoteProfileSyncController({
        relayProfileService: service,
        updateAuthorProfile,
        updateReplyNotificationRecipientProfile,
        logger: console,
      }),
  });

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
          onShowDraftList={draftListDialog.open}
          onChooseTarget={composerTargetDialog.open}
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
            {#if effectiveChannelContextState.value}
              <div class="composer-block composer-reference-block">
                <ChannelContextPreview
                  channel={effectiveChannelContextState.value}
                  runtime={channelContextRuntimeState.value}
                  onClear={() => channelContextApplyController.clear()}
                />
              </div>
            {/if}
            {#if replyQuoteState.value.reply}
              <div class="composer-block composer-reference-block">
                <ReplyQuotePreview
                  reference={replyQuoteState.value.reply}
                  mode="reply"
                  onToggleReplyNotification={(pubkey, enabled) =>
                    setReplyNotificationRecipientEnabled(
                      replyQuoteState.value.reply!.eventId,
                      pubkey,
                      enabled,
                    )}
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
          onClose={handleLoginDialogClose}
          onSave={saveSecretKey}
          onParentClientLogin={handleParentClientLogin}
          onNip07Login={handleNip07Login}
          onNip46Login={handleNip46Login}
          onNostrConnectStart={handleNostrConnectStart}
          onNostrConnectCancel={handleNostrConnectCancel}
          isParentClientAvailable={parentClientAvailable}
          {isLoadingParentClient}
          isNip07ExtensionAvailable={nip07ExtensionAvailable}
          {isLoadingNip07}
          {isLoadingNip46}
          isPreparingNip46NostrConnect={isLoadingNip46 &&
            hasPendingNip46AuthSession &&
            pendingNip46ConnectionUri === null}
          isWaitingNip46NostrConnect={hasPendingNip46AuthSession &&
            pendingNip46ConnectionUri !== null}
          {isHandshakeStartedNip46NostrConnect}
          nip46NostrConnectUri={pendingNip46ConnectionUri}
          {nip46NostrConnectErrorMessage}
          initialNostrConnectRelayCandidates={getInitialNip46ConnectRelayCandidates()}
        />
      {/if}
      {#if showTransitionOverlay}
        <div class="transition-overlay"></div>
      {/if}
      {#if showAddAccountDialogStore.value && LoginDialogComponent}
        <LoginDialogComponent
          show={showAddAccountDialogStore.value}
          bind:secretKey
          onClose={handleAddAccountDialogClose}
          onSave={saveSecretKey}
          onParentClientLogin={handleParentClientLogin}
          onNip07Login={handleNip07Login}
          onNip46Login={handleNip46Login}
          onNostrConnectStart={handleNostrConnectStart}
          onNostrConnectCancel={handleNostrConnectCancel}
          isParentClientAvailable={parentClientAvailable}
          {isLoadingParentClient}
          isNip07ExtensionAvailable={nip07ExtensionAvailable}
          {isLoadingNip07}
          {isLoadingNip46}
          isPreparingNip46NostrConnect={isLoadingNip46 &&
            hasPendingNip46AuthSession &&
            pendingNip46ConnectionUri === null}
          isWaitingNip46NostrConnect={hasPendingNip46AuthSession &&
            pendingNip46ConnectionUri !== null}
          {isHandshakeStartedNip46NostrConnect}
          nip46NostrConnectUri={pendingNip46ConnectionUri}
          {nip46NostrConnectErrorMessage}
          initialNostrConnectRelayCandidates={getInitialNip46ConnectRelayCandidates()}
          isAddAccountMode={true}
        />
      {/if}
      {#if showLogoutDialogStore.value && ProfileComponent}
        <ProfileComponent
          show={showLogoutDialogStore.value}
          onClose={logoutDialog.close}
          onLogout={requestLogoutAccount}
          fallbackRecoveryPubkeyHex={accountManager.getActiveAccountPubkey() ||
            accountManager.getAccounts()[0]?.pubkeyHex ||
            ""}
          onSwitchAccount={switchAccount}
          onAddAccount={handleAddAccount}
          onCheckNip46Connection={handleNip46ConnectionCheck}
          accounts={accountListStore.value}
          accountProfiles={accountProfileCacheStore.value}
          nip46ConnectionOperationState={nip46OperationState.kind}
          nip46ConnectionStatus={nip46ConnectionCheckStatus}
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
          onSaveDraft={handleSaveDraft}
          subscribeToDraftSaveCompleted={draftComposerController.subscribeToDraftSaveCompleted}
          canSaveDraft={editorState.canPost || hasDraftComposerContext}
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
          inboundInteractionSave={latestInboundInteractionSave}
          authoredSelfPostSave={latestAuthoredSelfPostSave}
          reconcileInboundDirectReplyCandidates={postHistoryInboundReplyReconciliation.reconcileDirectReplyCandidates}
          notifySavedAuthoredPosts={postHistoryInboundReplyReconciliation.notifySelfPostsSaved}
        />
      {/if}
      {#if showComposerTargetDialogStore.value && ComposerTargetDialogComponent}
        <ComposerTargetDialogComponent
          show={showComposerTargetDialogStore.value}
          onClose={composerTargetDialog.close}
          onApply={handleComposerTargetApply}
          {rxNostr}
          relayConfig={relayConfigStore.value}
          profileService={relayProfileService}
        />
      {/if}
      {#if showDraftLimitConfirmStore.value}
        <ConfirmDialog
          open={showDraftLimitConfirmStore.value}
          title={$_("common.confirm")}
          description={$_("draft.limit_reached")}
          confirmLabel={$_("common.ok")}
          cancelLabel={$_("common.cancel")}
          confirmVariant="danger"
          closeOnConfirm={false}
          preventCloseWhileConfirming={true}
          onConfirm={handleConfirmPendingDraftSave}
          onCancel={handleCancelPendingDraftSave}
        >
          <div class="draft-limit-confirm-content">
            <div class="confirm-dialog-message">
              {$_("draft.limit_reached")}
            </div>
            {#if draftLimitConfirmError}
              <div class="draft-limit-confirm-error" role="alert">
                {$_("draft.replace_save_failed")}
              </div>
            {/if}
          </div>
        </ConfirmDialog>
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

  .draft-limit-confirm-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .draft-limit-confirm-error {
    color: var(--error-color, #d32f2f);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .transition-overlay {
    position: fixed;
    inset: 0;
    background-color: var(--dialog-bg-overlay);
    z-index: 100;
    pointer-events: none;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
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
