// --- UIダイアログ状態管理 ---
import type { MediaGalleryItem } from '../lib/types';

function createBooleanStore(getValue: () => boolean, setValue: (value: boolean) => void) {
    return {
        get value() { return getValue(); },
        set: (value: boolean) => { setValue(value); }
    };
}

function createValueStore<T>(getValue: () => T, setValue: (value: T) => void) {
    return {
        get value() { return getValue(); },
        set: (value: T) => { setValue(value); }
    };
}

let showLogin = $state(false);
let showLogout = $state(false);
let showSettings = $state(false);
let showWelcome = $state(false);
let showAddAccount = $state(false);

export const showLoginDialogStore = createBooleanStore(() => showLogin, (value) => { showLogin = value; });

export const showLogoutDialogStore = createBooleanStore(() => showLogout, (value) => { showLogout = value; });

export const showSettingsDialogStore = createBooleanStore(() => showSettings, (value) => { showSettings = value; });

export const showWelcomeDialogStore = createBooleanStore(() => showWelcome, (value) => { showWelcome = value; });

// --- 下書きダイアログ状態管理 ---
import type { DraftChannelData, DraftReplyQuoteData } from '../lib/types';

let showDraftList = $state(false);
let showDraftLimitConfirm = $state(false);
let pendingDraftContent = $state<{ content: string; galleryItems: MediaGalleryItem[]; channelData?: DraftChannelData; replyQuoteData?: DraftReplyQuoteData } | null>(null);

export const showDraftListDialogStore = createBooleanStore(() => showDraftList, (value) => { showDraftList = value; });

export const showDraftLimitConfirmStore = createBooleanStore(() => showDraftLimitConfirm, (value) => { showDraftLimitConfirm = value; });

export const pendingDraftContentStore = createValueStore(
    () => pendingDraftContent,
    (value: { content: string; galleryItems: MediaGalleryItem[]; channelData?: DraftChannelData; replyQuoteData?: DraftReplyQuoteData } | null) => { pendingDraftContent = value; }
);

// --- アカウント追加ダイアログ ---
export const showAddAccountDialogStore = createBooleanStore(() => showAddAccount, (value) => { showAddAccount = value; });

export function isAnyDialogOpen(): boolean {
    return showLogin ||
        showLogout ||
        showSettings ||
        showWelcome ||
        showAddAccount ||
        showDraftList ||
        showDraftLimitConfirm;
}
