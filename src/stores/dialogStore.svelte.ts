// --- UIダイアログ状態管理 ---

function createBooleanStore(getValue: () => boolean, setValue: (value: boolean) => void) {
    return {
        get value() { return getValue(); },
        set: (value: boolean) => { setValue(value); }
    };
}

let showLogin = $state(false);
let showLogout = $state(false);
let showSettings = $state(false);
let showWelcome = $state(false);
let showAddAccount = $state(false);
let showPostHistory = $state(false);
let showComposerTarget = $state(false);

export const showLoginDialogStore = createBooleanStore(() => showLogin, (value) => { showLogin = value; });

export const showLogoutDialogStore = createBooleanStore(() => showLogout, (value) => { showLogout = value; });

export const showSettingsDialogStore = createBooleanStore(() => showSettings, (value) => { showSettings = value; });

export const showWelcomeDialogStore = createBooleanStore(() => showWelcome, (value) => { showWelcome = value; });

export const showPostHistoryDialogStore = createBooleanStore(() => showPostHistory, (value) => { showPostHistory = value; });
export const showComposerTargetDialogStore = createBooleanStore(() => showComposerTarget, (value) => { showComposerTarget = value; });

let showDraftList = $state(false);
let showDraftLimitConfirm = $state(false);

export const showDraftListDialogStore = createBooleanStore(() => showDraftList, (value) => { showDraftList = value; });

export const showDraftLimitConfirmStore = createBooleanStore(() => showDraftLimitConfirm, (value) => { showDraftLimitConfirm = value; });

// --- アカウント追加ダイアログ ---
export const showAddAccountDialogStore = createBooleanStore(() => showAddAccount, (value) => { showAddAccount = value; });

export function isAnyDialogOpen(): boolean {
    return showLogin ||
        showLogout ||
        showSettings ||
        showWelcome ||
        showAddAccount ||
        showPostHistory ||
        showComposerTarget ||
        showDraftList ||
        showDraftLimitConfirm;
}
