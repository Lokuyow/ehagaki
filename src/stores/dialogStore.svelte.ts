// --- UIダイアログ状態管理 ---
import type { MediaGalleryItem } from '../lib/types';

let showLogin = $state(false);
let showLogout = $state(false);
let showSettings = $state(false);
let showWelcome = $state(false);
let showAddAccount = $state(false);

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

export const showWelcomeDialogStore = {
    get value() { return showWelcome; },
    set: (value: boolean) => { showWelcome = value; }
};

// --- 下書きダイアログ状態管理 ---
import type { DraftReplyQuoteData } from '../lib/types';

let showDraftList = $state(false);
let showDraftLimitConfirm = $state(false);
let pendingDraftContent = $state<{ content: string; galleryItems: MediaGalleryItem[]; replyQuoteData?: DraftReplyQuoteData } | null>(null);

export const showDraftListDialogStore = {
    get value() { return showDraftList; },
    set: (value: boolean) => { showDraftList = value; }
};

export const showDraftLimitConfirmStore = {
    get value() { return showDraftLimitConfirm; },
    set: (value: boolean) => { showDraftLimitConfirm = value; }
};

export const pendingDraftContentStore = {
    get value() { return pendingDraftContent; },
    set: (value: { content: string; galleryItems: MediaGalleryItem[]; replyQuoteData?: DraftReplyQuoteData } | null) => { pendingDraftContent = value; }
};

// --- アカウント追加ダイアログ ---
export const showAddAccountDialogStore = {
    get value() { return showAddAccount; },
    set: (value: boolean) => { showAddAccount = value; }
};
