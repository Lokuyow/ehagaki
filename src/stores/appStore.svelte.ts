/**
 * appStore.svelte.ts - バレルエクスポート（後方互換のため全ストアを再エクスポート）
 *
 * 各ストアは以下の専用ファイルに分割されています:
 * - authStore.svelte.ts    : 認証状態・秘密鍵
 * - uploadStore.svelte.ts  : アップロード・圧縮・メディア配置
 * - dialogStore.svelte.ts  : UIダイアログ状態
 * - swStore.svelte.ts      : Service Worker
 * - profileStore.svelte.ts : プロフィール
 * - relayStore.svelte.ts   : リレー設定
 * - sharedContentStore.svelte.ts : 共有画像・URLクエリ
 * - postUIStore.svelte.ts  : 投稿UI・ハッシュタグ
 */

export {
    authState,
    updateAuthState,
    clearAuthState,
    setNsecAuth,
    setNostrLoginAuth,
    setAuthInitialized,
    secretKeyStore,
} from './authStore.svelte';

export {
    imageSizeInfoStore,
    showImageSizeInfo,
    hideImageSizeInfo,
    uploadAbortFlagStore,
    setVideoCompressionService,
    getVideoCompressionService,
    abortVideoCompression,
    setImageCompressionService,
    getImageCompressionService,
    abortImageCompression,
    abortAllUploads,
    isUploadingStore,
    videoCompressionProgressStore,
    imageCompressionProgressStore,
    mediaFreePlacementStore,
} from './uploadStore.svelte';

export {
    showLoginDialogStore,
    showLogoutDialogStore,
    showSettingsDialogStore,
    showWelcomeDialogStore,
    showDraftListDialogStore,
    showDraftLimitConfirmStore,
    pendingDraftContentStore,
    showLoginDialog,
    closeLoginDialog,
    openLogoutDialog,
    closeLogoutDialog,
    openSettingsDialog,
    closeSettingsDialog,
} from './dialogStore.svelte';

export {
    swNeedRefresh,
    swUpdateServiceWorker,
    swVersionStore,
    handleSwUpdate,
    fetchSwVersion,
} from './swStore.svelte';

export {
    profileDataStore,
    profileLoadedStore,
    isLoadingProfileStore,
} from './profileStore.svelte';

export {
    writeRelaysStore,
    relayConfigStore,
    showRelaysStore,
    isSwUpdatingStore,
    relayListUpdatedStore,
    setRelayManager,
    loadRelayConfigFromStorage,
    saveRelayConfigToStorage,
} from './relayStore.svelte';

export {
    sharedImageStore,
    updateSharedImageStore,
    clearSharedImageStore,
    getSharedImageFiles,
    getSharedImageMetadata,
    isSharedImageReceived,
    urlQueryContentStore,
    updateUrlQueryContentStore,
    clearUrlQueryContentStore,
} from './sharedContentStore.svelte';

export {
    hashtagDataStore,
    postComponentUIStore,
} from './postUIStore.svelte';

export {
    darkModeStore,
} from './themeStore.svelte';
