<script lang="ts">
  import { onMount } from "svelte";
  import { createRxNostr } from "rx-nostr";
  import { verifier } from "@rx-nostr/crypto";
  import "./i18n";
  import { _, locale, waitLocale } from "svelte-i18n";
  import { ProfileManager } from "./lib/profileManager";
  import ProfileComponent from "./components/ProfileComponent.svelte";
  import { keyManager, PublicKeyState } from "./lib/keyManager";
  import { RelayManager } from "./lib/relayManager";
  import PostComponent from "./components/PostComponent.svelte";
  import SettingsDialog from "./components/SettingsDialog.svelte";
  import LogoutDialog from "./components/LogoutDialog.svelte";
  import LoginDialog from "./components/LoginDialog.svelte";
  import SwUpdateModal from "./components/SwUpdateModal.svelte";
  import FooterInfoDisplay from "./components/FooterInfoDisplay.svelte";
  import { FileUploadManager } from "./lib/fileUploadManager";
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import { nostrLoginManager } from "./lib/nostrLogin";
  import Button from "./components/Button.svelte";
  import LoadingPlaceholder from "./components/LoadingPlaceholder.svelte";
  import {
    authState,
    sharedImageStore,
    hideImageSizeInfo,
    setAuthInitialized,
    setNsecAuth,
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
    showSwUpdateModalStore,
    openSwUpdateModal,
    closeSwUpdateModal,
    handleSwUpdate,
    profileDataStore,
    profileLoadedStore,
    isLoadingProfileStore,
    isUploadingStore,
  } from "./lib/stores";
  import { debugLog, debugAuthState } from "./lib/debug";

  const { needRefresh } = useRegisterSW({
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

  $: {
    console.log("SW states:", {
      needRefresh: $needRefresh,
      showModal: $needRefresh,
    });
  }

  $: showSwUpdateModal = $showSwUpdateModalStore;
  $: if ($swNeedRefresh) openSwUpdateModal();

  let errorMessage = "";
  let secretKey = "";
  const publicKeyState = new PublicKeyState();
  $: publicKeyState.setNsec(secretKey);

  $: isAuthenticated = $authState.isAuthenticated;
  $: isNostrLoginAuth = $authState.type === "nostr-login";
  $: isAuthInitialized = $authState.isInitialized;

  $: debugAuthState("Auth state changed", $authState);

  let rxNostr: ReturnType<typeof createRxNostr>;
  let profileManager: ProfileManager;
  let relayManager: RelayManager;
  let sharedImageReceived = false;
  let isLoadingNostrLogin = false;
  let footerInfoDisplay: any;
  let postComponentRef: any;

  async function initializeNostr(pubkeyHex?: string): Promise<void> {
    rxNostr = createRxNostr({ verifier });
    profileManager = new ProfileManager(rxNostr);
    relayManager = new RelayManager(rxNostr);
    isLoadingProfileStore.set(true);
    if (pubkeyHex) {
      if (!relayManager.useRelaysFromLocalStorageIfExists(pubkeyHex)) {
        relayManager.setBootstrapRelays();
      }
      const profile = await profileManager.fetchProfileData(pubkeyHex);
      if (profile) {
        profileDataStore.set(profile);
        profileLoadedStore.set(true);
      }
    } else {
      relayManager.setBootstrapRelays();
    }
    isLoadingProfileStore.set(false);
  }

  async function handleNostrLoginAuth(auth: any) {
    if (auth.type === "logout") {
      logoutInternal();
      return;
    }
    if (auth.pubkey) {
      publicKeyState.setNostrLoginAuth(auth);
      isLoadingNostrLogin = true;
      isLoadingProfileStore.set(true);
      try {
        await initializeNostr();
        await relayManager.fetchUserRelays(auth.pubkey);
        await loadProfileForPubkey(auth.pubkey);
      } catch (error) {
        console.error("nostr-login認証処理中にエラー:", error);
        isLoadingProfileStore.set(false);
      } finally {
        isLoadingNostrLogin = false;
        isLoadingProfileStore.set(false);
      }
      showLoginDialogStore.set(false);
    }
  }

  async function loadProfileForPubkey(pubkeyHex: string) {
    if (!pubkeyHex) return;
    if (!relayManager || !profileManager) await initializeNostr();
    isLoadingProfileStore.set(true);
    try {
      const profile = await profileManager.fetchProfileData(pubkeyHex);
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

  async function saveSecretKey() {
    if (!keyManager.isValidNsec(secretKey)) {
      errorMessage = "invalid_secret";
      return;
    }
    isLoadingProfileStore.set(true);
    const { success } = keyManager.saveToStorage(secretKey);
    if (success) {
      showLoginDialogStore.set(false);
      errorMessage = "";
      try {
        const derived = keyManager.derivePublicKey(secretKey);
        if (derived.hex) {
          setNsecAuth(derived.hex, derived.npub, derived.nprofile);
          if (
            relayManager &&
            !relayManager.useRelaysFromLocalStorageIfExists(derived.hex)
          ) {
            await relayManager.fetchUserRelays(derived.hex);
          }
          await loadProfileForPubkey(derived.hex);
        } else {
          isLoadingProfileStore.set(false);
        }
      } catch (e) {
        isLoadingProfileStore.set(false);
      }
    } else {
      errorMessage = "error_saving";
      publicKeyState.clear();
      isLoadingProfileStore.set(false);
    }
  }

  function logout() {
    logoutInternal();
    if (nostrLoginManager.isInitialized) nostrLoginManager.logout();
    closeLogoutDialog();
  }

  function logoutInternal() {
    debugLog("ログアウト処理開始");
    const localeValue = localStorage.getItem("locale");
    const uploadEndpointValue = localStorage.getItem("uploadEndpoint");
    localStorage.clear();
    if (localeValue !== null) localStorage.setItem("locale", localeValue);
    if (uploadEndpointValue !== null)
      localStorage.setItem("uploadEndpoint", uploadEndpointValue);
    secretKey = "";
    publicKeyState.clear();
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
    debugLog("ログアウト処理完了");
  }

  async function loginWithNostrLogin() {
    if (!nostrLoginManager.isInitialized) return;
    isLoadingNostrLogin = true;
    try {
      await nostrLoginManager.showLogin();
    } catch (error) {
      if (!(error instanceof Error && error.message === "Cancelled")) {
        console.error("nostr-loginでエラー:", error);
      }
    } finally {
      isLoadingNostrLogin = false;
    }
  }

  $: if ($locale) localStorage.setItem("locale", $locale);

  let localeInitialized = false;

  onMount(async () => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale && storedLocale !== $locale) locale.set(storedLocale);
    await waitLocale();
    localeInitialized = true;
    let hasNostrLoginAuth = false;
    try {
      await nostrLoginManager.init({
        theme: "default",
        darkMode: false,
        perms: "sign_event:1,sign_event:0",
        noBanner: true,
      });
      nostrLoginManager.setAuthHandler(handleNostrLoginAuth);
      await new Promise((resolve) => setTimeout(resolve, 200));
      const currentUser = nostrLoginManager.getCurrentUser();
      if (currentUser?.pubkey) {
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
    if (!hasNostrLoginAuth) {
      const storedKey = keyManager.loadFromStorage();
      if (storedKey) {
        publicKeyState.setNsec(storedKey);
        try {
          const derived = keyManager.derivePublicKey(storedKey);
          if (derived.hex) {
            setNsecAuth(derived.hex, derived.npub, derived.nprofile);
            await initializeNostr(derived.hex);
            await loadProfileForPubkey(derived.hex);
          } else {
            await initializeNostr();
          }
        } catch (e) {
          await initializeNostr();
        }
        isLoadingProfileStore.set(false);
        setAuthInitialized();
      } else {
        await initializeNostr();
        isLoadingProfileStore.set(false);
        setAuthInitialized();
      }
    } else {
      setAuthInitialized();
    }
    try {
      const shared = await FileUploadManager.getSharedImageFromServiceWorker();
      if (shared?.image) {
        sharedImageStore.set({
          file: shared.image,
          metadata: shared.metadata,
          received: true,
        });
      }
    } catch (error) {
      console.error("共有画像の処理中にエラー:", error);
    }
    if (import.meta.env.MODE === "development") {
      window.showSwUpdateModalDebug = () => {
        needRefresh.set(true);
        console.log("SW更新ダイアログを強制表示しました");
      };
    }
    debugLog("初期化完了", { isAuthenticated, isAuthInitialized });
  });

  $: if (
    $sharedImageStore.received &&
    $sharedImageStore.file &&
    postComponentRef
  ) {
    postComponentRef.uploadFiles([$sharedImageStore.file]);
    sharedImageStore.set({ file: null, metadata: undefined, received: false });
  }

  function handleUploadStatusChange(uploading: boolean) {
    isUploadingStore.set(uploading);
    if (!uploading) sharedImageReceived = false;
  }

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

{#if $locale && localeInitialized}
  <main>
    <div class="main-content">
      <PostComponent
        bind:this={postComponentRef}
        {rxNostr}
        hasStoredKey={isAuthenticated}
        {isNostrLoginAuth}
        onPostSuccess={() => {}}
        onUploadStatusChange={handleUploadStatusChange}
        onUploadProgress={handleUploadProgress}
      />
    </div>

    {#if $showLoginDialogStore}
      <LoginDialog
        bind:secretKey
        {errorMessage}
        onClose={closeLoginDialog}
        onSave={saveSecretKey}
        onNostrLogin={loginWithNostrLogin}
        {isLoadingNostrLogin}
      />
    {/if}

    {#if $showLogoutDialogStore}
      <LogoutDialog
        show={$showLogoutDialogStore}
        onClose={closeLogoutDialog}
        onLogout={logout}
      />
    {/if}

    <SettingsDialog
      show={$showSettingsDialogStore}
      onClose={closeSettingsDialog}
    />

    {#if showSwUpdateModal}
      <SwUpdateModal
        show={showSwUpdateModal}
        needRefresh={$swNeedRefresh}
        onReload={handleSwUpdate}
        onClose={closeSwUpdateModal}
      />
    {/if}

    <div class="footer-bar">
      {#if isAuthenticated && $isLoadingProfileStore}
        <Button className="profile-display btn-round loading" disabled={true}>
          <LoadingPlaceholder text="" showImage={true} />
        </Button>
      {:else if isAuthenticated && ($profileLoadedStore || $isLoadingProfileStore)}
        <ProfileComponent
          profileData={$profileDataStore}
          hasStoredKey={isAuthenticated}
          isLoadingProfile={$isLoadingProfileStore}
          showLogoutDialog={openLogoutDialog}
        />
      {:else if !$isLoadingProfileStore && !isAuthenticated && isAuthInitialized}
        <Button className="login-btn btn-round" on:click={showLoginDialog}>
          {$_("login")}
        </Button>
      {/if}

      <FooterInfoDisplay bind:this={footerInfoDisplay} />

      <Button
        className="settings-btn btn-circle"
        on:click={openSettingsDialog}
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
    padding: 0 10px;
    gap: 2px;
  }
</style>
