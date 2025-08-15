import { writable } from 'svelte/store';
import type { SizeDisplayInfo } from './utils';

/**
 * ファイルサイズ情報表示用のグローバルストア
 */
export const imageSizeInfoStore = writable<{
    info: SizeDisplayInfo | null;
    visible: boolean;
}>({
    info: null,
    visible: false
});

/**
 * 認証状態の型定義
 */
export interface AuthState {
    type: 'none' | 'nsec' | 'nostr-login';
    isAuthenticated: boolean;
    pubkey: string;
    npub: string;
    nprofile: string;
    isValid: boolean;
    isInitialized: boolean; // 初期化完了フラグを追加
}

/**
 * 初期認証状態
 */
const initialAuthState: AuthState = {
    type: 'none',
    isAuthenticated: false,
    pubkey: '',
    npub: '',
    nprofile: '',
    isValid: false,
    isInitialized: false // 初期化未完了
};

/**
 * 認証状態を管理するグローバルストア
 */
export const authState = writable<AuthState>(initialAuthState);

/**
 * 認証状態を更新する関数
 */
export function updateAuthState(newState: Partial<AuthState>): void {
    authState.update(current => {
        const updated = { ...current, ...newState };
        updated.isAuthenticated = updated.type !== 'none' && updated.isValid;
        return updated;
    });
}

/**
 * 認証状態をクリア（ログアウト）
 */
export function clearAuthState(): void {
    authState.update(current => ({
        ...initialAuthState,
        isInitialized: current.isInitialized // 初期化フラグは保持
    }));
}

/**
 * nsec認証用の状態更新
 */
export function setNsecAuth(pubkey: string, npub: string, nprofile: string): void {
    if (!pubkey || !npub || !nprofile) {
        console.warn('setNsecAuth: All parameters are required');
        return;
    }

    updateAuthState({
        type: 'nsec',
        pubkey,
        npub,
        nprofile,
        isValid: true
    });
}

/**
 * nostr-login認証用の状態更新
 */
export function setNostrLoginAuth(pubkey: string, npub: string, nprofile: string): void {
    if (!pubkey || !npub || !nprofile) {
        console.warn('setNostrLoginAuth: All parameters are required');
        return;
    }

    updateAuthState({
        type: 'nostr-login',
        pubkey,
        npub,
        nprofile,
        isValid: true
    });
}

/**
 * ファイルサイズ情報を表示する
 * @param info 表示する構造化データ
 * @param duration 表示時間（ミリ秒）
 */
export function showImageSizeInfo(info: SizeDisplayInfo | null, duration: number = 3000): void {
    if (info === null) {
        hideImageSizeInfo();
        return;
    }

    imageSizeInfoStore.set({ info, visible: true });
}

/**
 * ファイルサイズ情報を非表示にする
 */
export function hideImageSizeInfo(): void {
    imageSizeInfoStore.set({ info: null, visible: false });
}

/**
 * 共有画像の状態ストア
 */
export interface SharedImageStoreState {
    file: File | null;
    metadata?: import('./shareHandler').SharedImageMetadata; // 型を明示
    received: boolean;
}

export const sharedImageStore = writable<SharedImageStoreState>({
    file: null,
    metadata: undefined,
    received: false
});

/**
 * 認証状態の初期化完了を設定
 */
export function setAuthInitialized(): void {
    updateAuthState({ isInitialized: true });
}

// --- UI状態管理ストアを追加 ---

/**
 * ログインダイアログ表示状態
 */
export const showLoginDialogStore = writable(false);

/**
 * ログアウトダイアログ表示状態
 */
export const showLogoutDialogStore = writable(false);

/**
 * 設定ダイアログ表示状態
 */
export const showSettingsDialogStore = writable(false);

/**
 * ログインダイアログを開く
 */
export function showLoginDialog() {
    showLoginDialogStore.set(true);
}

/**
 * ログインダイアログを閉じる
 */
export function closeLoginDialog() {
    showLoginDialogStore.set(false);
}

/**
 * ログアウトダイアログを開く
 */
export function openLogoutDialog() {
    showLogoutDialogStore.set(true);
}

/**
 * ログアウトダイアログを閉じる
 */
export function closeLogoutDialog() {
    showLogoutDialogStore.set(false);
}

/**
 * 設定ダイアログを開く
 */
export function openSettingsDialog() {
    showSettingsDialogStore.set(true);
}

/**
 * 設定ダイアログを閉じる
 */
export function closeSettingsDialog() {
    showSettingsDialogStore.set(false);
}

// --- Service Worker更新管理ストアを追加 ---
import { useRegisterSW } from "virtual:pwa-register/svelte";

// SW登録・更新状態管理
const swRegister = useRegisterSW({
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

// SW更新状態ストア
export const swNeedRefresh = swRegister.needRefresh;
export const swUpdateServiceWorker = swRegister.updateServiceWorker;

// SW更新モーダル表示状態ストア
export const showSwUpdateModalStore = writable(false);

// SW更新モーダルを開く
export function openSwUpdateModal() {
    showSwUpdateModalStore.set(true);
}

// SW更新モーダルを閉じる
export function closeSwUpdateModal() {
    showSwUpdateModalStore.set(false);
    swNeedRefresh.set(false);
}

// SW更新を実行
export function handleSwUpdate() {
    swUpdateServiceWorker(true);
}
