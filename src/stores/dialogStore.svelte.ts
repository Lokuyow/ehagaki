// --- UIダイアログ状態管理 ---
import type { MediaGalleryItem } from '../lib/types';

let showLogin = $state(false);
let showLogout = $state(false);
let showSettings = $state(false);
let showWelcome = $state(false);

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
let showDraftList = $state(false);
let showDraftLimitConfirm = $state(false);
let pendingDraftContent = $state<{ content: string; galleryItems: MediaGalleryItem[] } | null>(null);

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
    set: (value: { content: string; galleryItems: MediaGalleryItem[] } | null) => { pendingDraftContent = value; }
};

// --- ダイアログ操作ヘルパー ---
export function showLoginDialog() { showLoginDialogStore.set(true); }
export function closeLoginDialog() { showLoginDialogStore.set(false); }
export function openLogoutDialog() { showLogoutDialogStore.set(true); }
export function closeLogoutDialog() { showLogoutDialogStore.set(false); }
export function openSettingsDialog() { showSettingsDialogStore.set(true); }
export function closeSettingsDialog() { showSettingsDialogStore.set(false); }
