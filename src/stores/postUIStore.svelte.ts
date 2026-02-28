import type { HashtagData } from '../lib/types';

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

// --- PostComponent UI状態管理 ---
let postComponentUI = $state<{
    showSecretKeyDialog: boolean;
    pendingPost: string;
    showImageFullscreen: boolean;
    fullscreenImageSrc: string;
    fullscreenImageAlt: string;
    showPopupModal: boolean;
    popupX: number;
    popupY: number;
    popupMessage: string;
}>({
    showSecretKeyDialog: false,
    pendingPost: '',
    showImageFullscreen: false,
    fullscreenImageSrc: '',
    fullscreenImageAlt: '',
    showPopupModal: false,
    popupX: 0,
    popupY: 0,
    popupMessage: ''
});

export const postComponentUIStore = {
    get value() { return postComponentUI; },
    subscribe: (callback: (value: typeof postComponentUI) => void) => {
        $effect(() => {
            callback(postComponentUI);
        });
    },
    // 秘密鍵ダイアログ
    showSecretKeyDialog: (post: string) => {
        postComponentUI.pendingPost = post;
        postComponentUI.showSecretKeyDialog = true;
    },
    hideSecretKeyDialog: () => {
        postComponentUI.showSecretKeyDialog = false;
        postComponentUI.pendingPost = '';
    },
    getPendingPost: () => postComponentUI.pendingPost,
    // 画像フルスクリーン
    showImageFullscreen: (src: string, alt: string = '') => {
        postComponentUI.fullscreenImageSrc = src;
        postComponentUI.fullscreenImageAlt = alt;
        postComponentUI.showImageFullscreen = true;
    },
    hideImageFullscreen: () => {
        postComponentUI.showImageFullscreen = false;
        postComponentUI.fullscreenImageSrc = '';
        postComponentUI.fullscreenImageAlt = '';
    },
    // ポップアップメッセージ
    showPopupMessage: (x: number, y: number, message: string, duration: number = 1800) => {
        postComponentUI.popupX = x;
        postComponentUI.popupY = y;
        postComponentUI.popupMessage = message;
        postComponentUI.showPopupModal = true;
        setTimeout(() => {
            postComponentUI.showPopupModal = false;
        }, duration);
    },
    hidePopupMessage: () => {
        postComponentUI.showPopupModal = false;
    }
};
