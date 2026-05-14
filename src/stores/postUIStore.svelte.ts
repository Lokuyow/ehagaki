// --- PostComponent UI状態管理 ---
let postComponentUI = $state<{
    showSecretKeyDialog: boolean;
    pendingPost: string;
    pendingEmojiTags: string[][];
    showImageFullscreen: boolean;
    fullscreenMediaId: string;
    fullscreenImageSrc: string;
    fullscreenImageAlt: string;
    showFloatingMessage: boolean;
    floatingMessageX: number;
    floatingMessageY: number;
    floatingMessageText: string;
}>({
    showSecretKeyDialog: false,
    pendingPost: '',
    pendingEmojiTags: [],
    showImageFullscreen: false,
    fullscreenMediaId: '',
    fullscreenImageSrc: '',
    fullscreenImageAlt: '',
    showFloatingMessage: false,
    floatingMessageX: 0,
    floatingMessageY: 0,
    floatingMessageText: ''
});

let floatingMessageTimeoutId: ReturnType<typeof setTimeout> | undefined;

function clearFloatingMessageTimeout() {
    if (floatingMessageTimeoutId !== undefined) {
        clearTimeout(floatingMessageTimeoutId);
        floatingMessageTimeoutId = undefined;
    }
}

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
    // フローティングメッセージ
    showFloatingMessage: (x: number, y: number, message: string, duration: number = 1800) => {
        clearFloatingMessageTimeout();
        postComponentUI.floatingMessageX = x;
        postComponentUI.floatingMessageY = y;
        postComponentUI.floatingMessageText = message;
        postComponentUI.showFloatingMessage = true;
        floatingMessageTimeoutId = setTimeout(() => {
            postComponentUI.showFloatingMessage = false;
            floatingMessageTimeoutId = undefined;
        }, duration);
    },
    hideFloatingMessage: () => {
        clearFloatingMessageTimeout();
        postComponentUI.showFloatingMessage = false;
    }
};
