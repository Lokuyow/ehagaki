type ManagedAccountType = 'nsec' | 'nip07' | 'nip46' | 'parentClient';

type LogoutAccountOptions = {
    closeDialog?: boolean;
    notifyParentClient?: boolean;
};

type LogoutActionResult =
    | { kind: 'switch'; pubkeyHex: string }
    | { kind: 'guest' }
    | { kind: 'keep-current' };

interface Nip46RuntimeController {
    disconnect: () => Promise<void>;
}

interface AccountManagerLike {
    getAccountType: (pubkeyHex: string) => ManagedAccountType | null;
    setActiveAccount: (pubkeyHex: string) => void;
}

interface ProfileGuestSnapshot {
    name: string;
    displayName: string;
    picture: string;
    npub: string;
    nprofile: string;
}

interface AuthStateSnapshot {
    type?: string;
    pubkey?: string;
}

export interface AppAccountSessionControllerDependencies {
    getIsSwitchingAccount(): boolean;
    setIsSwitchingAccount(next: boolean): void;
    getIsLoggingOut(): boolean;
    setIsLoggingOut(next: boolean): void;
    getAuthStateSnapshot(): AuthStateSnapshot | null | undefined;
    getCurrentRxNostr(): unknown;
    setCurrentRxNostr(next: undefined): void;
    disposeNostrSession(session: unknown): undefined;
    clearNip46RuntimeForAuthChange(params: {
        currentAuthType?: string;
        currentPubkeyHex?: string | null;
        nextAuthType: ManagedAccountType;
        nextPubkeyHex?: string | null;
        nip46Service: Nip46RuntimeController;
    }): Promise<void>;
    nip46Service: Nip46RuntimeController;
    accountManager: AccountManagerLike;
    restoreManagedAccountSession(params: {
        pubkeyHex: string;
        accountManager: AccountManagerLike;
        restoreAccount: (
            pubkeyHex: string,
            type: ManagedAccountType,
        ) => Promise<{ hasAuth: boolean; pubkeyHex?: string }>;
        handlePostAuth: (pubkeyHex: string) => Promise<void>;
        onMissingAccountType: () => void;
        onRestoreFailure: () => void;
    }): Promise<boolean>;
    restoreAccount(
        pubkeyHex: string,
        type: ManagedAccountType,
    ): Promise<{ hasAuth: boolean; pubkeyHex?: string }>;
    handlePostAuth(pubkeyHex: string): Promise<void>;
    resetUploadDisplayState(): void;
    logoutAccountFromAuthService(
        pubkeyHex: string,
        options: { notifyParentClient?: boolean },
    ): string | null | undefined;
    resolveLogoutAccountAction(nextPubkey: string | null | undefined): LogoutActionResult;
    clearAuthState(): void;
    setGuestProfile(profile: ProfileGuestSnapshot): void;
    setProfileLoaded(next: boolean): void;
    initializeNostr(): Promise<void>;
    setSecretKey(next: string): void;
    setErrorMessage(next: string): void;
    refreshAccountList(): void;
    closeLogoutDialog(): void;
    logger: Pick<Console, 'error'>;
}

export interface AppAccountSessionController {
    switchAccount(pubkeyHex: string): Promise<boolean>;
    logoutAccount(pubkeyHex: string, options?: LogoutAccountOptions): Promise<void>;
    handleRemoteParentClientLogout(pubkeyHex: string | null): Promise<void>;
}

export function createAppAccountSessionController(
    deps: AppAccountSessionControllerDependencies,
): AppAccountSessionController {
    async function switchAccount(pubkeyHex: string): Promise<boolean> {
        if (deps.getIsSwitchingAccount()) {
            return false;
        }

        deps.setIsSwitchingAccount(true);

        try {
            const currentAuth = deps.getAuthStateSnapshot();
            const nextAccountType = deps.accountManager.getAccountType(pubkeyHex);

            if (nextAccountType) {
                await deps.clearNip46RuntimeForAuthChange({
                    currentAuthType: currentAuth?.type,
                    currentPubkeyHex: currentAuth?.pubkey,
                    nextAuthType: nextAccountType,
                    nextPubkeyHex: pubkeyHex,
                    nip46Service: deps.nip46Service,
                });
            }

            deps.setCurrentRxNostr(deps.disposeNostrSession(deps.getCurrentRxNostr()));

            return await deps.restoreManagedAccountSession({
                pubkeyHex,
                accountManager: deps.accountManager,
                restoreAccount: deps.restoreAccount,
                handlePostAuth: deps.handlePostAuth,
                onMissingAccountType: () => {
                    deps.logger.error('アカウントタイプが見つかりません:', pubkeyHex);
                },
                onRestoreFailure: () => {
                    deps.logger.error('アカウント復元に失敗:', pubkeyHex);
                },
            });
        } catch (error) {
            deps.logger.error('アカウント切替中にエラー:', error);
            return false;
        } finally {
            deps.setIsSwitchingAccount(false);
        }
    }

    async function logoutAccount(
        pubkeyHex: string,
        options: LogoutAccountOptions = {},
    ): Promise<void> {
        deps.setIsLoggingOut(true);

        try {
            deps.resetUploadDisplayState();

            const nextAction = deps.resolveLogoutAccountAction(
                deps.logoutAccountFromAuthService(pubkeyHex, {
                    notifyParentClient: options.notifyParentClient,
                }),
            );

            if (nextAction.kind === 'switch') {
                deps.setCurrentRxNostr(
                    deps.disposeNostrSession(deps.getCurrentRxNostr()),
                );
                await switchAccount(nextAction.pubkeyHex);
            } else if (nextAction.kind === 'guest') {
                deps.setCurrentRxNostr(
                    deps.disposeNostrSession(deps.getCurrentRxNostr()),
                );
                deps.clearAuthState();
                deps.setGuestProfile({
                    name: '',
                    displayName: '',
                    picture: '',
                    npub: '',
                    nprofile: '',
                });
                deps.setProfileLoaded(false);
                await deps.initializeNostr();
                deps.setSecretKey('');
                deps.setErrorMessage('');
            }

            deps.refreshAccountList();
            if (options.closeDialog !== false && nextAction.kind !== 'keep-current') {
                deps.closeLogoutDialog();
            }
        } catch (error) {
            deps.logger.error('ログアウト処理中にエラー:', error);
        } finally {
            deps.setIsLoggingOut(false);
        }
    }

    async function handleRemoteParentClientLogout(
        pubkeyHex: string | null,
    ): Promise<void> {
        const auth = deps.getAuthStateSnapshot();
        const targetPubkey = pubkeyHex || auth?.pubkey;

        if (!targetPubkey) {
            return;
        }

        if (auth?.type !== 'parentClient') {
            return;
        }

        if (auth?.pubkey !== targetPubkey) {
            return;
        }

        const storedType = deps.accountManager.getAccountType(targetPubkey);
        if (storedType && storedType !== 'parentClient') {
            const restored = await switchAccount(targetPubkey);
            if (restored) {
                deps.refreshAccountList();
                return;
            }
        }

        await logoutAccount(targetPubkey, {
            closeDialog: false,
            notifyParentClient: false,
        });
    }

    return {
        switchAccount,
        logoutAccount,
        handleRemoteParentClientLogout,
    };
}
