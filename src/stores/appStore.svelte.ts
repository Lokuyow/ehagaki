import type { SizeDisplayInfo, SharedImageMetadata, AuthState, SharedImageStoreState, ProfileData, HashtagData } from '../lib/types';
/// <reference types="vite/client" />
// @ts-expect-error: virtual module provided by Vite plugin
import { useRegisterSW } from "virtual:pwa-register/svelte";
import { writable } from "svelte/store";

// --- アプリ全体の状態管理 ---
let imageSizeInfo = $state<{ info: SizeDisplayInfo | null; visible: boolean }>({
    info: null,
    visible: false
});

export const imageSizeInfoStore = {
    get value() { return imageSizeInfo; },
    set: (value: { info: SizeDisplayInfo | null; visible: boolean }) => { imageSizeInfo = value; }
};

// --- 認証状態管理 ---
const initialAuthState: AuthState = {
    type: 'none',
    isAuthenticated: false,
    pubkey: '',
    npub: '',
    nprofile: '',
    isValid: false,
    isInitialized: false,
    isExtensionLogin: false
};

let authStateValue = $state<AuthState>({ ...initialAuthState }); // 確実に初期値をコピー

export const authState = {
    get value() {
        // undefinedの場合は初期値を返す
        return authStateValue || initialAuthState;
    },
    subscribe: (callback: (value: AuthState) => void) => {
        $effect(() => {
            callback(authStateValue || initialAuthState);
        });
    }
};

export function updateAuthState(newState: Partial<AuthState>): void {
    const current = authStateValue;
    const updated = { ...current, ...newState };
    updated.isAuthenticated = updated.type !== 'none' && updated.isValid;
    updated.isExtensionLogin =
        updated.isAuthenticated &&
        updated.type === 'nostr-login' &&
        typeof window !== 'undefined' &&
        typeof (window as any).nostr === 'object' &&
        typeof (window as any).nostr.signEvent === 'function';

    authStateValue = updated;

    console.log('[updateAuthState] 認証状態を更新:', {
        type: updated.type,
        isAuthenticated: updated.isAuthenticated,
        isValid: updated.isValid,
        pubkey: updated.pubkey ? updated.pubkey.substring(0, 8) + '...' : 'empty'
    });
}

export function clearAuthState(preserveInitialized: boolean = true): void {
    authStateValue = {
        ...initialAuthState,
        isInitialized: preserveInitialized ? authStateValue.isInitialized : false
    };
}

export function setNsecAuth(pubkey: string, npub: string, nprofile: string): void {
    if (!pubkey || !npub || !nprofile) {
        console.warn('setNsecAuth: All parameters are required');
        return;
    }
    updateAuthState({ type: 'nsec', pubkey, npub, nprofile, isValid: true });
}

export function setNostrLoginAuth(pubkey: string, npub: string, nprofile: string): void {
    if (!pubkey || !npub || !nprofile) {
        console.warn('setNostrLoginAuth: All parameters are required');
        return;
    }

    console.log('[setNostrLoginAuth] NostrLogin認証状態を更新:', {
        pubkey: pubkey.substring(0, 8) + '...',
        npub: npub.substring(0, 12) + '...',
        type: 'nostr-login'
    });

    updateAuthState({
        type: 'nostr-login',
        pubkey,
        npub,
        nprofile,
        isValid: true
    });
}

export function setAuthInitialized(): void {
    updateAuthState({ isInitialized: true });
}

// --- 共有画像管理 ---
export const sharedImageStore = $state<SharedImageStoreState>({
    file: null,
    metadata: undefined,
    received: false
});

export function updateSharedImageStore(file: File | null, metadata?: SharedImageMetadata): void {
    sharedImageStore.file = file;
    sharedImageStore.metadata = metadata;
    sharedImageStore.received = !!file;
}

export function clearSharedImageStore(): void {
    sharedImageStore.file = null;
    sharedImageStore.metadata = undefined;
    sharedImageStore.received = false;
}

export function getSharedImageFile(): File | null {
    return sharedImageStore.file;
}

export function getSharedImageMetadata(): SharedImageMetadata | undefined {
    return sharedImageStore.metadata;
}

// --- UIダイアログ状態管理 ---
let showLogin = $state(false);
let showLogout = $state(false);
let showSettings = $state(false);

export const showLoginDialogStore = {
    get value() { return showLogin; },
    set: (value: boolean) => { showLogin = value; }
};

export const showLogoutDialogStore = {
    get value() { return showLogout; },
    set: (value: boolean) => { showLogout = value; }
};

export const showSettingsDialogStore = {
    get value() { return showSettings; },
    set: (value: boolean) => { showSettings = value; }
};

// --- Service Worker管理 ---
// テスト環境やService Worker未対応環境での安全な処理
const swRegister = (() => {
    try {
        if (typeof useRegisterSW === 'function') {
            return useRegisterSW({
                onRegistered: (r: ServiceWorkerRegistration | undefined) => {
                    console.log("SW registered successfully", r);
                },
                onRegisterError(error: Error) {
                    console.warn("SW registration error", error);
                    // エラーログを出力するが、アプリケーションは継続
                },
                onNeedRefresh() {
                    console.log("SW needs refresh - showing prompt");
                },
                // Service Workerの登録オプションを明示的に指定
                immediate: true,
                onOfflineReady() {
                    console.log("App ready to work offline");
                }
            });
        }
    } catch (error) {
        console.warn("Failed to initialize Service Worker:", error);
    }

    // フォールバック（テスト環境やエラー時）
    return {
        needRefresh: { subscribe: () => { } },
        updateServiceWorker: () => { }
    };
})();

export const swNeedRefresh = swRegister.needRefresh;
export const swUpdateServiceWorker = swRegister.updateServiceWorker;

let swVersion = $state<string | null>(null);

export const swVersionStore = {
    get value() { return swVersion; },
    set: (value: string | null) => { swVersion = value; },
    subscribe: (callback: (value: string | null) => void) => {
        $effect(() => {
            callback(swVersion);
        });
    }
};

// --- プロフィール管理 ---
let profileData = $state<ProfileData>({ name: "", picture: "" });
let profileLoaded = $state(false);
let isLoadingProfile = $state(false);

export const profileDataStore = {
    get value() { return profileData; },
    set: (value: ProfileData) => { profileData = value; },
    subscribe: (callback: (value: ProfileData) => void) => {
        $effect(() => {
            callback(profileData);
        });
    }
};

export const profileLoadedStore = {
    get value() { return profileLoaded; },
    set: (value: boolean) => { profileLoaded = value; },
    subscribe: (callback: (value: boolean) => void) => {
        $effect(() => {
            callback(profileLoaded);
        });
    }
};

export const isLoadingProfileStore = {
    get value() { return isLoadingProfile; },
    set: (value: boolean) => { isLoadingProfile = value; },
    subscribe: (callback: (value: boolean) => void) => {
        $effect(() => {
            callback(isLoadingProfile);
        });
    }
};

// --- アップロード状態管理 ---
let isUploading = $state(false);

export const isUploadingStore = {
    get value() { return isUploading; },
    set: (value: boolean) => { isUploading = value; },
    subscribe: (callback: (value: boolean) => void) => {
        $effect(() => {
            callback(isUploading);
        });
    }
};

// --- 動画圧縮進捗管理 ---
let videoCompressionProgress = $state(0);

export const videoCompressionProgressStore = {
    get value() { return videoCompressionProgress; },
    set: (value: number) => { videoCompressionProgress = value; },
    subscribe: (callback: (value: number) => void) => {
        $effect(() => {
            callback(videoCompressionProgress);
        });
    }
};

// --- ハッシュタグ管理 ---
let hashtagData = $state<HashtagData>({
    content: '',
    hashtags: [],
    tags: []
});

export const hashtagDataStore = {
    get value() { return hashtagData; },
    set: (value: HashtagData) => { hashtagData = value; },
    update: (updater: (value: HashtagData) => HashtagData) => { hashtagData = updater(hashtagData); },
    subscribe: (callback: (value: HashtagData) => void) => {
        $effect(() => {
            callback(hashtagData);
        });
    }
};

// --- 秘密鍵管理 ---
let secretKey = $state<string | null>(null);

export const secretKeyStore = {
    get value() { return secretKey; },
    set: (value: string | null) => { secretKey = value; },
    subscribe: (callback: (value: string | null) => void) => {
        $effect(() => {
            callback(secretKey);
        });
    }
};

// --- 設定ダイアログ管理 ---
let writeRelays = $state<string[]>([]);
let showRelays = $state(false);
let isSwUpdating = $state(false);

export const writeRelaysStore = {
    get value() { return writeRelays; },
    set: (value: string[]) => { writeRelays = value; },
    subscribe: (callback: (value: string[]) => void) => {
        $effect(() => {
            callback(writeRelays);
        });
    }
};

export const showRelaysStore = {
    get value() { return showRelays; },
    set: (value: boolean) => { showRelays = value; }
};

export const isSwUpdatingStore = {
    get value() { return isSwUpdating; },
    set: (value: boolean) => { isSwUpdating = value; }
};

// --- リレーリスト更新通知 ---
let relayListUpdated = $state<number>(0);

export const relayListUpdatedStore = {
    get value() { return relayListUpdated; },
    set: (value: number) => { relayListUpdated = value; },
    subscribe: (callback: (value: number) => void) => {
        $effect(() => {
            callback(relayListUpdated);
        });
    }
};

// --- グローバルなコンテキストメニュー表示状態ストア ---
export const globalContextMenuStore = writable<{ open: boolean; nodeId?: string; src?: string }>({ open: false, nodeId: undefined, src: undefined });

// --- クリック/タップ位置管理 ---
let lastClickPosition = $state<{ x: number; y: number } | null>(null);

export const lastClickPositionStore = {
    get value() { return lastClickPosition; },
    set: (value: { x: number; y: number } | null) => { lastClickPosition = value; }
};

export function setLastClickPosition(pos: { x: number; y: number }) {
    lastClickPositionStore.set(pos);
}

export function clearLastClickPosition() {
    lastClickPositionStore.set(null);
}

// --- UI操作関数 ---
export function showImageSizeInfo(info: SizeDisplayInfo | null, duration: number = 3000): void {
    if (info === null) {
        hideImageSizeInfo();
        return;
    }
    imageSizeInfoStore.set({ info, visible: true });
}

export function hideImageSizeInfo(): void {
    imageSizeInfoStore.set({ info: null, visible: false });
}

export function showLoginDialog() { showLoginDialogStore.set(true); }
export function closeLoginDialog() { showLoginDialogStore.set(false); }
export function openLogoutDialog() { showLogoutDialogStore.set(true); }
export function closeLogoutDialog() { showLogoutDialogStore.set(false); }
export function openSettingsDialog() { showSettingsDialogStore.set(true); }
export function closeSettingsDialog() { showSettingsDialogStore.set(false); }

export function handleSwUpdate() {
    swUpdateServiceWorker(true);
}

export function fetchSwVersion(): Promise<string | null> {
    if (!navigator.serviceWorker?.controller) return Promise.resolve(null);
    return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
            if (event.data?.version) {
                swVersionStore.set(event.data.version);
                resolve(event.data.version);
            } else {
                resolve(null);
            }
        };
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage(
                { type: 'GET_VERSION' },
                [messageChannel.port2]
            );
        } else {
            resolve(null);
            return;
        }
        setTimeout(() => resolve(null), 2000);
    });
}
export function isSharedImageReceived(): boolean {
    return sharedImageStore.received;
}
