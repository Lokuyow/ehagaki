import { writable } from 'svelte/store';
import type { SizeDisplayInfo } from './utils';
import { useRegisterSW } from "virtual:pwa-register/svelte";
import { HASHTAG_REGEX } from "./editorController";
import type { PostStatus } from './postManager';

// --- 型定義 ---
export interface AuthState {
    type: 'none' | 'nsec' | 'nostr-login';
    isAuthenticated: boolean;
    pubkey: string;
    npub: string;
    nprofile: string;
    isValid: boolean;
    isInitialized: boolean;
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

export interface EditorState {
    content: string;
    canPost: boolean;
    isUploading: boolean;
    uploadErrorMessage: string;
    postStatus: PostStatus;
    hasImage?: boolean; // 追加: 画像が含まれるか
}

// --- ストア定義 ---
export const imageSizeInfoStore = writable<{ info: SizeDisplayInfo | null; visible: boolean }>({
    info: null,
    visible: false
});

const initialAuthState: AuthState = {
    type: 'none',
    isAuthenticated: false,
    pubkey: '',
    npub: '',
    nprofile: '',
    isValid: false,
    isInitialized: false
};
export const authState = writable<AuthState>(initialAuthState);

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
export const isLoadingProfileStore = writable(true);
export const isUploadingStore = writable(false);

export const hashtagDataStore = writable<HashtagData>({
    content: '',
    hashtags: [],
    tags: []
});

// プレースホルダーテキスト用ストア
export const placeholderTextStore = writable<string>('');

// エディタ状態管理用ストア
export const editorState = writable<EditorState>({
    content: '',
    canPost: false,
    isUploading: false,
    uploadErrorMessage: '',
    postStatus: {
        sending: false,
        success: false,
        error: false,
        message: ''
    },
    hasImage: false // 追加
});

// --- エディタ状態更新関数 ---
export function updateEditorContent(content: string, hasImage: boolean = false): void {
    editorState.update(state => ({
        ...state,
        content,
        hasImage,
        canPost: !!content.trim() || hasImage // 画像のみでも投稿可
    }));
}

export function updatePostStatus(postStatus: PostStatus): void {
    editorState.update(state => ({ ...state, postStatus }));
}

export function updateUploadState(isUploading: boolean, errorMessage: string = ''): void {
    editorState.update(state => ({
        ...state,
        isUploading,
        uploadErrorMessage: errorMessage
    }));
}

export function resetEditorState(): void {
    editorState.update(state => ({
        ...state,
        content: '',
        canPost: false,
        uploadErrorMessage: '',
        postStatus: {
            sending: false,
            success: false,
            error: false,
            message: ''
        }
    }));
}

// プレースホルダーテキスト更新用関数
export function updatePlaceholderText(text: string): void {
    placeholderTextStore.set(text);
}

// --- 認証関連関数 ---
export function updateAuthState(newState: Partial<AuthState>): void {
    authState.update(current => {
        const updated = { ...current, ...newState };
        updated.isAuthenticated = updated.type !== 'none' && updated.isValid;
        return updated;
    });
}

export function clearAuthState(preserveInitialized: boolean = true): void {
    authState.update(current => ({
        ...initialAuthState,
        isInitialized: preserveInitialized ? current.isInitialized : false
    }));
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
    updateAuthState({ type: 'nostr-login', pubkey, npub, nprofile, isValid: true });
}

export function setAuthInitialized(): void {
    updateAuthState({ isInitialized: true });
}

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

// --- ハッシュタグデータ更新 ---
export function updateHashtagData(content: string): void {
    const hashtags = extractHashtagsFromContent(content);
    // "t"タグの値を小文字化
    const tags = hashtags.map(hashtag => ["t", hashtag.toLowerCase()]);

    hashtagDataStore.set({
        content,
        hashtags,
        tags
    });
}

// --- ハッシュタグ処理関数（内部使用） ---
function extractHashtagsFromContent(content: string): string[] {
    const hashtags: string[] = [];
    HASHTAG_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = HASHTAG_REGEX.exec(content)) !== null) {
        const hashtag = match[1];
        if (hashtag && hashtag.trim()) {
            hashtags.push(hashtag);
        }
    }

    return hashtags;
}

export function containsHashtags(content: string): boolean {
    HASHTAG_REGEX.lastIndex = 0;
    return HASHTAG_REGEX.test(content);
}
