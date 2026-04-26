// --- PostComponent UI状態管理 ---
let postComponentUI = $state<{
    showSecretKeyDialog: boolean;
    pendingPost: string;
    pendingEmojiTags: string[][];
    showImageFullscreen: boolean;
    fullscreenMediaId: string;
    fullscreenImageSrc: string;
    fullscreenImageAlt: string;
    showPopupModal: boolean;
    popupX: number;
    popupY: number;
    popupMessage: string;
}>({
    showSecretKeyDialog: false,
    pendingPost: '',
    pendingEmojiTags: [],
    showImageFullscreen: false,
    fullscreenMediaId: '',
    fullscreenImageSrc: '',
    fullscreenImageAlt: '',
    showPopupModal: false,
    popupX: 0,
    popupY: 0,
    popupMessage: ''
});

export const postComponentUIStore = {
    get value() { return postComponentUI; },
    // 秘密鍵ダイアログ
    showSecretKeyDialog: (post: string, emojiTags: string[][] = []) => {
        postComponentUI.pendingPost = post;
        postComponentUI.pendingEmojiTags = emojiTags.map((tag) => [...tag]);
        postComponentUI.showSecretKeyDialog = true;
    },
    hideSecretKeyDialog: () => {
        postComponentUI.showSecretKeyDialog = false;
        postComponentUI.pendingPost = '';
        postComponentUI.pendingEmojiTags = [];
    },
    getPendingPost: () => postComponentUI.pendingPost,
    getPendingEmojiTags: () => postComponentUI.pendingEmojiTags.map((tag) => [...tag]),
    // 画像フルスクリーン
    showImageFullscreen: (src: string, alt: string = '', mediaId: string = '') => {
        postComponentUI.fullscreenMediaId = mediaId;
        postComponentUI.fullscreenImageSrc = src;
        postComponentUI.fullscreenImageAlt = alt;
        postComponentUI.showImageFullscreen = true;
    },
    hideImageFullscreen: () => {
        postComponentUI.showImageFullscreen = false;
        postComponentUI.fullscreenMediaId = '';
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
