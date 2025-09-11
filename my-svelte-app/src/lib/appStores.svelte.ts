import type { SizeDisplayInfo } from './types';
import { useRegisterSW } from "virtual:pwa-register/svelte";

// --- 型定義 ---
export interface AuthState {
    type: 'none' | 'nsec' | 'nostr-login';
    isAuthenticated: boolean;
    pubkey: string;
    npub: string;
    nprofile: string;
    isValid: boolean;
    isInitialized: boolean;
    isExtensionLogin?: boolean; // 追加
}

export interface SharedImageStoreState {
    file: File | null;
    metadata?: import('./shareHandler').SharedImageMetadata;
    received: boolean;
}

export interface ProfileData {
    name: string;
    picture: string;
}

export interface HashtagData {
    content: string;
    hashtags: string[];
    tags: string[][];
}

// --- ストア定義 ---
let imageSizeInfo = $state<{ info: SizeDisplayInfo | null; visible: boolean }>({
    info: null,
    visible: false
});

export const imageSizeInfoStore = {
    get value() { return imageSizeInfo; },
    set: (value: { info: SizeDisplayInfo | null; visible: boolean }) => { imageSizeInfo = value; }
};

// --- 認証状態ストアと操作関数 ---
const initialAuthState: AuthState = {
    type: 'none',
    isAuthenticated: false,
    pubkey: '',
    npub: '',
    nprofile: '',
    isValid: false,
    isInitialized: false,
    isExtensionLogin: false // 追加
};

let authStateValue = $state<AuthState>(initialAuthState);

export const authState = {
    get value() { return authStateValue; },
    subscribe: (callback: (value: AuthState) => void) => {
        // Svelte 5では$effectでreactivityを実現
        $effect(() => {
            callback(authStateValue);
        });
    }
};

// --- 認証状態の更新 ---
export function updateAuthState(newState: Partial<AuthState>): void {
    const current = authStateValue;
    const updated = { ...current, ...newState };
    updated.isAuthenticated = updated.type !== 'none' && updated.isValid;
    // Extensionログイン判定: 認証済みかつ nostr-login かつ window.nostrが存在し、window.nostr.signEventがfunction
    updated.isExtensionLogin =
        updated.isAuthenticated &&
        updated.type === 'nostr-login' &&
        typeof window !== 'undefined' &&
        typeof (window as any).nostr === 'object' &&
        typeof (window as any).nostr.signEvent === 'function';
    authStateValue = updated;
}

// --- 認証状態のクリア ---
export function clearAuthState(preserveInitialized: boolean = true): void {
    authStateValue = {
        ...initialAuthState,
        isInitialized: preserveInitialized ? authStateValue.isInitialized : false
    };
}

// --- nsec認証セット ---
export function setNsecAuth(pubkey: string, npub: string, nprofile: string): void {
    if (!pubkey || !npub || !nprofile) {
        console.warn('setNsecAuth: All parameters are required');
        return;
    }
    updateAuthState({ type: 'nsec', pubkey, npub, nprofile, isValid: true });
}

// --- nostr-login認証セット ---
export function setNostrLoginAuth(pubkey: string, npub: string, nprofile: string): void {
    if (!pubkey || !npub || !nprofile) {
        console.warn('setNostrLoginAuth: All parameters are required');
        return;
    }
    updateAuthState({ type: 'nostr-login', pubkey, npub, nprofile, isValid: true });
}

// --- 認証初期化フラグセット ---
export function setAuthInitialized(): void {
    updateAuthState({ isInitialized: true });
}

export const sharedImageStore = $state<SharedImageStoreState>({
    file: null,
    metadata: undefined,
    received: false
});

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

const swRegister = useRegisterSW({
    onRegistered(r) { console.log("SW registered:", r); },
    onRegisterError(error) { console.log("SW registration error", error); },
    onNeedRefresh() { console.log("SW needs refresh - showing prompt"); },
    // typeプロパティは指定しない（undefinedを渡さない）
});
export const swNeedRefresh = swRegister.needRefresh;
export const swUpdateServiceWorker = swRegister.updateServiceWorker;

let profileData = $state<ProfileData>({ name: "", picture: "" });
let profileLoaded = $state(false);
let isLoadingProfile = $state(false);
let isUploading = $state(false);

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

export const isUploadingStore = {
    get value() { return isUploading; },
    set: (value: boolean) => { isUploading = value; },
    subscribe: (callback: (value: boolean) => void) => {
        $effect(() => {
            callback(isUploading);
        });
    }
};

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

// --- 秘密鍵ストア ---
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

// --- 画像サイズ情報表示 ---
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

// --- UIダイアログ制御 ---
export function showLoginDialog() { showLoginDialogStore.set(true); }
export function closeLoginDialog() { showLoginDialogStore.set(false); }
export function openLogoutDialog() { showLogoutDialogStore.set(true); }
export function closeLogoutDialog() { showLogoutDialogStore.set(false); }
export function openSettingsDialog() { showSettingsDialogStore.set(true); }
export function closeSettingsDialog() { showSettingsDialogStore.set(false); }

// --- Service Worker更新制御 ---
export function handleSwUpdate() {
    swUpdateServiceWorker(true);
}

// --- リレーリスト更新通知ストア ---
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

export async function fetchSwVersion(): Promise<string | null> {
    if (!navigator.serviceWorker?.controller) return null;
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
        setTimeout(() => resolve(null), 2000); // タイムアウト
    });
}

// imeta情報の一時保存ストア
export interface ImageImetaMap {
    [url: string]: {
        m: string; // MIME type (必須)
        blurhash?: string;
        dim?: string;
        alt?: string;
        ox?: string; // オリジナルファイルのSHA-256ハッシュを追加
        [key: string]: any;
    };
}

let imageImetaMap = $state<ImageImetaMap>({});
export const imageImetaMapStore = {
    get value() { return imageImetaMap; },
    set: (value: ImageImetaMap) => { imageImetaMap = value; },
    update: (updater: (value: ImageImetaMap) => ImageImetaMap) => { imageImetaMap = updater(imageImetaMap); },
    subscribe: (callback: (value: ImageImetaMap) => void) => {
        $effect(() => {
            callback(imageImetaMap);
        });
    }
};
