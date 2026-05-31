interface AccountManagerLike {
    getAccounts(): Array<{ pubkeyHex: string }>;
}

export interface AppAccountDialogControllerDependencies {
    accountManager: AccountManagerLike;
    requestLogoutAccount(pubkeyHex: string): Promise<void>;
    closeLogoutDialog(): void;
    openAddAccountDialog(): void;
    getPendingLastLogoutPubkey(): string | null;
    setPendingLastLogoutPubkey(next: string | null): void;
    setLastAccountLogoutError(next: string): void;
    setShowTransitionOverlay(next: boolean): void;
    getIsLoggingOut(): boolean;
    setIsLoggingOut(next: boolean): void;
    setShowLastAccountLogoutConfirm(next: boolean): void;
    resetUploadDisplayState(): void;
    getCurrentRxNostr(): unknown;
    setCurrentRxNostr(next: undefined): void;
    disposeNostrSession(session: unknown): undefined;
    logoutLastAccount(pubkeyHex: string): Promise<void>;
    reloadWindow(): void;
    logger: Pick<Console, 'error'>;
    transitionDelayMs?: number;
}

export interface AppAccountDialogController {
    requestLogoutAccount(pubkeyHex: string): void;
    cancelLastAccountLogout(): void;
    confirmLastAccountLogout(): Promise<void>;
    handleAddAccount(): void;
}

const DEFAULT_TRANSITION_DELAY_MS = 50;

export function createAppAccountDialogController(
    deps: AppAccountDialogControllerDependencies,
): AppAccountDialogController {
    const transitionDelayMs = deps.transitionDelayMs ?? DEFAULT_TRANSITION_DELAY_MS;

    function requestLogoutAccount(pubkeyHex: string): void {
        const accounts = deps.accountManager.getAccounts();
        const isLastAccount =
            accounts.length === 1 && accounts[0]?.pubkeyHex === pubkeyHex;

        if (!isLastAccount) {
            void deps.requestLogoutAccount(pubkeyHex);
            return;
        }

        deps.setPendingLastLogoutPubkey(pubkeyHex);
        deps.setLastAccountLogoutError('');
        deps.setShowTransitionOverlay(true);
        deps.closeLogoutDialog();
        setTimeout(() => {
            if (deps.getPendingLastLogoutPubkey() === pubkeyHex) {
                deps.setShowLastAccountLogoutConfirm(true);
            }
            deps.setShowTransitionOverlay(false);
        }, transitionDelayMs);
    }

    function cancelLastAccountLogout(): void {
        if (deps.getIsLoggingOut()) {
            return;
        }

        deps.setShowLastAccountLogoutConfirm(false);
        deps.setPendingLastLogoutPubkey(null);
        deps.setLastAccountLogoutError('');
    }

    async function confirmLastAccountLogout(): Promise<void> {
        const pendingLastLogoutPubkey = deps.getPendingLastLogoutPubkey();
        if (!pendingLastLogoutPubkey || deps.getIsLoggingOut()) {
            return;
        }

        deps.setIsLoggingOut(true);
        deps.setLastAccountLogoutError('');

        try {
            deps.resetUploadDisplayState();
            deps.setCurrentRxNostr(deps.disposeNostrSession(deps.getCurrentRxNostr()));
            await deps.logoutLastAccount(pendingLastLogoutPubkey);
            deps.reloadWindow();
        } catch (error) {
            deps.logger.error('最後のアカウントのリセット中にエラー:', error);
            deps.setLastAccountLogoutError(
                error instanceof Error ? error.message : 'reset_failed',
            );
        } finally {
            deps.setIsLoggingOut(false);
        }
    }

    function handleAddAccount(): void {
        deps.setShowTransitionOverlay(true);
        deps.closeLogoutDialog();
        setTimeout(() => {
            deps.openAddAccountDialog();
            deps.setShowTransitionOverlay(false);
        }, transitionDelayMs);
    }

    return {
        requestLogoutAccount,
        cancelLastAccountLogout,
        confirmLastAccountLogout,
        handleAddAccount,
    };
}
