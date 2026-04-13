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
  import type { Draft, MediaGalleryItem } from "./lib/types";
  import { useBalloonMessage } from "./lib/hooks/useBalloonMessage.svelte";
  import { saveDraft, saveDraftWithReplaceOldest } from "./lib/draftManager";
  import { mediaGalleryStore } from "./stores/mediaGalleryStore.svelte";
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
    applyDraftToComposer,
    createDraftSavePayload,
  } from "./lib/draftContentUtils";
  import {
    createDialogVisibilityHandlers,
    createDraftLimitConfirmHandlers,
  } from "./lib/appDialogUtils";
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
        showLogoutDialogStore.set(false);
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
    logoutDialog.close();
    setTimeout(() => {
      addAccountDialog.open();
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
    // NIP-07拡張機能の遅延注入を検出（nos2x等のdocument_endで注入される拡張機能に対応）
    if (!nip07ExtensionAvailable) {
      waitNostr(3000).then((nostr) => {
        if (nostr) nip07ExtensionAvailable = true;
      });
    }

    runAppInitializationBootstrap({
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
      getExternalInputBootstrapParams: () => ({
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
      }),
      console,
    });

    const cleanupVisibilityHandler = registerNip46VisibilityHandler({
      document,
      authState,
      nip46Service,
      console,
    });

    return () => {
      cleanupVisibilityHandler();
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
          onClose={addAccountDialog.close}
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
