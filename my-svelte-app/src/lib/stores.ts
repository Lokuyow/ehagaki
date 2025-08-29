import { writable } from 'svelte/store';
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
export const imageSizeInfoStore = writable<{ info: SizeDisplayInfo | null; visible: boolean }>({
    info: null,
    visible: false
});

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
export const authState = writable<AuthState>(initialAuthState);

// --- 認証状態の更新 ---
export function updateAuthState(newState: Partial<AuthState>): void {
    authState.update(current => {
        const updated = { ...current, ...newState };
        updated.isAuthenticated = updated.type !== 'none' && updated.isValid;
        // Extensionログイン判定: 認証済みかつ nostr-login かつ window.nostrが存在し、window.nostr.signEventがfunction
        updated.isExtensionLogin =
            updated.isAuthenticated &&
            updated.type === 'nostr-login' &&
            typeof window !== 'undefined' &&
            typeof (window as any).nostr === 'object' &&
            typeof (window as any).nostr.signEvent === 'function';
        return updated;
    });
}

// --- 認証状態のクリア ---
export function clearAuthState(preserveInitialized: boolean = true): void {
    authState.update(current => ({
        ...initialAuthState,
        isInitialized: preserveInitialized ? current.isInitialized : false
    }));
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

export const sharedImageStore = writable<SharedImageStoreState>({
    file: null,
    metadata: undefined,
    received: false
});

export const showLoginDialogStore = writable(false);
export const showLogoutDialogStore = writable(false);
export const showSettingsDialogStore = writable(false);

const swRegister = useRegisterSW({
    onRegistered(r) { console.log("SW registered:", r); },
    onRegisterError(error) { console.log("SW registration error", error); },
    onNeedRefresh() { console.log("SW needs refresh - showing prompt"); },
});
export const swNeedRefresh = swRegister.needRefresh;
export const swUpdateServiceWorker = swRegister.updateServiceWorker;
export const showSwUpdateModalStore = writable(false);

export const profileDataStore = writable<ProfileData>({ name: "", picture: "" });
export const profileLoadedStore = writable(false);
export const isLoadingProfileStore = writable(false);
export const isUploadingStore = writable(false);

export const hashtagDataStore = writable<HashtagData>({
    content: '',
    hashtags: [],
    tags: []
});

export const swVersionStore = writable<string | null>(null);

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
export function openSwUpdateModal() { showSwUpdateModalStore.set(true); }
export function closeSwUpdateModal() {
    showSwUpdateModalStore.set(false);
    swNeedRefresh.set(false);
}
export function handleSwUpdate() { swUpdateServiceWorker(true); }

// --- リレーリスト更新通知ストア ---
export const relayListUpdatedStore = writable<number>(0);

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
