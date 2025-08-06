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
    isValid: false
};

/**
 * 認証状態を管理するグローバルストア
 */
export const authState = writable<AuthState>(initialAuthState);

/**
 * 認証状態を更新する関数
 */
export function updateAuthState(newState: Partial<AuthState>): void {
    authState.update(current => ({
        ...current,
        ...newState,
        isAuthenticated: newState.type !== 'none' && (newState.isValid ?? current.isValid)
    }));
}

/**
 * 認証状態をクリア（ログアウト）
 */
export function clearAuthState(): void {
    authState.set(initialAuthState);
}

/**
 * nsec認証用の状態更新
 */
export function setNsecAuth(pubkey: string, npub: string, nprofile: string): void {
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
    imageSizeInfoStore.set({ info, visible: true });
    // タイマーによる自動非表示を削除
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
    metadata?: any;
    received: boolean;
}
export const sharedImageStore = writable<SharedImageStoreState>({
    file: null,
    metadata: undefined,
    received: false
});
