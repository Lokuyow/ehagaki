import type { ManagedAccountSessionRestoreResult } from './appAuthUtils';

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

interface ParentClientRuntimeController {
    disconnect: (notifyParent?: boolean) => void;
}

interface AccountManagerLike {
    getAccountType: (pubkeyHex: string) => ManagedAccountType | null;
    hasAccount: (pubkeyHex: string) => boolean;
    setActiveAccount: (pubkeyHex: string) => void;
    getActiveAccountPubkey: () => string | null;
    clearActiveAccount: () => void;
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

function isManagedAccountType(
    type: string | undefined,
): type is ManagedAccountType {
    return type === 'nsec'
        || type === 'nip07'
        || type === 'nip46'
        || type === 'parentClient';
}

export interface AppAccountSessionControllerDependencies {
    getIsSwitchingAccount(): boolean;
    setIsSwitchingAccount(next: boolean): void;
    getIsLoggingOut(): boolean;
    setIsLoggingOut(next: boolean): void;
    setProfileLoading(next: boolean): void;
    getAuthStateSnapshot(): AuthStateSnapshot | null | undefined;
    getCurrentRxNostr(): unknown;
    setCurrentRxNostr(next: undefined): void;
    disposeNostrSession(session: unknown): undefined;
    nip46Service: Nip46RuntimeController;
    parentClientService: ParentClientRuntimeController;
    accountManager: AccountManagerLike;
    restoreManagedAccountSession(params: {
        requestedPubkeyHex: string;
        accountType: ManagedAccountType;
        restoreAccount: (
            pubkeyHex: string,
            type: ManagedAccountType,
        ) => Promise<{ hasAuth: boolean; pubkeyHex?: string }>;
        handlePostAuth: (pubkeyHex: string) => Promise<void>;
    }): Promise<ManagedAccountSessionRestoreResult>;
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
    reloadWindow(): void;
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
    async function runCleanupStep(action: () => void | Promise<void>): Promise<void> {
        try {
            await action();
        } catch {
            deps.logger.error('アカウント切替のruntime cleanupに失敗しました');
        }
    }

    async function disposeSession(session: unknown): Promise<void> {
        try {
            await deps.disposeNostrSession(session);
        } catch {
            deps.logger.error('アカウント切替のNostr runtime cleanupに失敗しました');
        } finally {
            deps.setCurrentRxNostr(undefined);
        }
    }

    async function cleanupRuntime(
        authType: string | undefined,
        session: unknown,
    ): Promise<void> {
        if (authType === 'nip46') {
            await runCleanupStep(() => deps.nip46Service.disconnect());
        } else if (authType === 'parentClient') {
            await runCleanupStep(() => deps.parentClientService.disconnect(false));
        }

        await disposeSession(session);
        await runCleanupStep(() => deps.clearAuthState());
    }

    async function convergeToGuest(): Promise<void> {
        await cleanupRuntime(
            deps.getAuthStateSnapshot()?.type,
            deps.getCurrentRxNostr(),
        );
        await runCleanupStep(() => deps.accountManager.clearActiveAccount());
        deps.setGuestProfile({
            name: '',
            displayName: '',
            picture: '',
            npub: '',
            nprofile: '',
        });
        deps.setProfileLoaded(false);

        try {
            await deps.initializeNostr();
        } catch {
            deps.logger.error('ゲストruntimeの初期化に失敗しました');
            await disposeSession(deps.getCurrentRxNostr());
        } finally {
            deps.setSecretKey('');
            deps.setErrorMessage('');
        }
    }

    function commitActiveAccount(pubkeyHex: string): boolean {
        try {
            if (!deps.accountManager.hasAccount(pubkeyHex)) {
                return false;
            }

            deps.accountManager.setActiveAccount(pubkeyHex);
            return deps.accountManager.hasAccount(pubkeyHex)
                && deps.accountManager.getActiveAccountPubkey() === pubkeyHex;
        } catch {
            deps.logger.error('アクティブアカウントの保存に失敗しました');
            return false;
        }
    }

    async function switchAccount(pubkeyHex: string): Promise<boolean> {
        if (deps.getIsSwitchingAccount()) {
            return false;
        }

        deps.setIsSwitchingAccount(true);
        deps.setProfileLoading(false);
        let transactionStarted = false;

        try {
            const currentAuth = deps.getAuthStateSnapshot();
            const currentRuntime = deps.getCurrentRxNostr();
            const targetAccountType = deps.accountManager.getAccountType(pubkeyHex);
            const rollbackPubkeyHex = isManagedAccountType(currentAuth?.type)
                && currentAuth?.pubkey
                ? currentAuth.pubkey
                : null;
            const rollbackAccountType = rollbackPubkeyHex
                ? deps.accountManager.getAccountType(rollbackPubkeyHex)
                : null;

            if (!targetAccountType) {
                deps.logger.error('アカウントタイプが見つかりません:', pubkeyHex);
                return false;
            }

            transactionStarted = true;
            await cleanupRuntime(currentAuth?.type, currentRuntime);

            const targetRestore = await deps.restoreManagedAccountSession({
                requestedPubkeyHex: pubkeyHex,
                accountType: targetAccountType,
                restoreAccount: deps.restoreAccount,
                handlePostAuth: deps.handlePostAuth,
            });

            if (targetRestore.success && commitActiveAccount(targetRestore.pubkeyHex)) {
                return true;
            }

            deps.logger.error(
                'アカウント復元に失敗:',
                targetRestore.success ? 'active-pointer-commit-failed' : targetRestore.reason,
            );
            await cleanupRuntime(targetAccountType, deps.getCurrentRxNostr());

            let rollbackAttempted = false;
            if (rollbackPubkeyHex && rollbackAccountType) {
                rollbackAttempted = true;
                const rollbackRestore = await deps.restoreManagedAccountSession({
                    requestedPubkeyHex: rollbackPubkeyHex,
                    accountType: rollbackAccountType,
                    restoreAccount: deps.restoreAccount,
                    handlePostAuth: deps.handlePostAuth,
                });

                if (rollbackRestore.success && commitActiveAccount(rollbackRestore.pubkeyHex)) {
                    return true;
                }

                deps.logger.error(
                    'アカウントrollbackに失敗:',
                    rollbackRestore.success
                        ? 'active-pointer-commit-failed'
                        : rollbackRestore.reason,
                );
                await cleanupRuntime(rollbackAccountType, deps.getCurrentRxNostr());
            }

            if (!rollbackAttempted) {
                deps.logger.error('アカウントrollbackの対象がありません');
            }
            await convergeToGuest();
            return false;
        } catch (error) {
            deps.logger.error('アカウント切替中にエラー:', error);
            if (transactionStarted) {
                await convergeToGuest();
            }
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
                deps.setProfileLoading(false);
                deps.reloadWindow();
                return;
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
