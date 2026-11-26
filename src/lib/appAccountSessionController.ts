import type { AccountAuthType } from './types';
import type { ManagedAccountSessionRestoreResult } from './appAuthUtils';

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
    getAccountType: (pubkeyHex: string) => AccountAuthType | null;
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

function isAccountAuthType(
    type: string | undefined,
): type is AccountAuthType {
    return type === 'npub'
        || type === 'nosskey'
        || type === 'nsec'
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
    nosskey?: {
        getGeneration(): number;
        isGenerationCurrent(generation: number): boolean;
        beginSwitchTransition(): void;
        readPublicKey(isCurrent: () => boolean, expectedPubkey: string): Promise<string>;
        reportError(error: unknown): void;
        setConfirming(confirming: boolean): void;
    };
    restoreManagedAccountSession(params: {
        requestedPubkeyHex: string;
        accountType: AccountAuthType;
        restoreAccount: (
            pubkeyHex: string,
            type: AccountAuthType,
        ) => Promise<{ hasAuth: boolean; pubkeyHex?: string }>;
        handlePostAuth: (pubkeyHex: string) => Promise<void>;
    }): Promise<ManagedAccountSessionRestoreResult>;
    restoreAccount(
        pubkeyHex: string,
        type: AccountAuthType,
    ): Promise<{ hasAuth: boolean; pubkeyHex?: string }>;
    handlePostAuth(pubkeyHex: string): Promise<void>;
    resetUploadDisplayState(): void;
    invalidatePendingAccountScopedAsyncState?(): void;
    clearAccountScopedAsyncState?(): void;
    clearPersistedPostHistoryListingSnapshots(): void;
    logoutAccountFromAuthService(
        pubkeyHex: string,
        options: { notifyParentClient?: boolean },
    ): Promise<string | null | undefined>;
    resolveLogoutAccountAction(nextPubkey: string | null | undefined): LogoutActionResult;
    clearAuthState(): void;
    setGuestProfile(profile: ProfileGuestSnapshot): void;
    setProfileLoaded(next: boolean): void;
    initializeNostr(): Promise<void>;
    setSecretKey(next: string): void;
    refreshAccountList(): void;
    reloadWindow(): void;
    closeLogoutDialog(): void;
    logger: Pick<Console, 'error'>;
}

export interface AppAccountSessionController {
    switchAccount(pubkeyHex: string): Promise<boolean>;
    switchNosskeyAccount(pubkeyHex: string): Promise<boolean>;
    confirmNosskeyAccount(pubkeyHex: string): Promise<boolean>;
    cancelNosskeyConfirmation(): void;
    logoutAccount(pubkeyHex: string, options?: LogoutAccountOptions): Promise<void>;
    handleRemoteParentClientLogout(pubkeyHex: string | null): Promise<void>;
    /**
     * Ends the NIP-46 session whose signer now reports a different user. The
     * account and its saved data are kept; only the running session is dropped.
     */
    handleNip46IdentityMismatch(
        pubkeyHex: string,
        options?: { beforeConverge?: () => void },
    ): Promise<void>;
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
        deps.clearAccountScopedAsyncState?.();

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
            deps.clearPersistedPostHistoryListingSnapshots();
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

    // The account transition that currently owns the runtime: a switch, or
    // the convergence to guest after a NIP-46 identity mismatch.
    let activeSwitch: Promise<unknown> | null = null;

    function switchAccount(pubkeyHex: string): Promise<boolean> {
        if (deps.getIsSwitchingAccount()) {
            return Promise.resolve(false);
        }

        const switching = runSwitchAccount(pubkeyHex);
        activeSwitch = switching;
        void switching.finally(() => {
            if (activeSwitch === switching) {
                activeSwitch = null;
            }
        });
        return switching;
    }

    let pendingNosskeyConfirmation: { generation: number } | null = null;

    function cancelNosskeyConfirmation(): void {
        if (!pendingNosskeyConfirmation) return;
        pendingNosskeyConfirmation = null;
        deps.nosskey?.setConfirming(false);
    }

    async function confirmNosskeyAccount(pubkeyHex: string, activate = false): Promise<boolean> {
        const { nosskey } = deps;
        if (!nosskey || pendingNosskeyConfirmation || deps.getIsSwitchingAccount()) return false;

        const request = { generation: nosskey.getGeneration() };
        const isCurrent = () => pendingNosskeyConfirmation === request
            && nosskey.isGenerationCurrent(request.generation);
        pendingNosskeyConfirmation = request;
        nosskey.setConfirming(true);
        try {
            await nosskey.readPublicKey(isCurrent, pubkeyHex);
            if (!isCurrent() || deps.getIsSwitchingAccount() || deps.accountManager.getAccountType(pubkeyHex) !== 'nosskey') {
                return false;
            }
            if (!activate) return true;

            nosskey.beginSwitchTransition();
            return switchAccount(pubkeyHex);
        } catch (error) {
            if (isCurrent()) nosskey.reportError(error);
            return false;
        } finally {
            if (pendingNosskeyConfirmation === request) cancelNosskeyConfirmation();
        }
    }

    async function runSwitchAccount(pubkeyHex: string): Promise<boolean> {
        deps.setIsSwitchingAccount(true);
        deps.setProfileLoading(false);
        let transactionStarted = false;

        try {
            const currentAuth = deps.getAuthStateSnapshot();
            const currentRuntime = deps.getCurrentRxNostr();
            const targetAccountType = deps.accountManager.getAccountType(pubkeyHex);
            const rollbackPubkeyHex = isAccountAuthType(currentAuth?.type)
                && currentAuth?.pubkey
                ? currentAuth.pubkey
                : null;
            const rollbackAccountType = rollbackPubkeyHex
                ? deps.accountManager.getAccountType(rollbackPubkeyHex)
                : null;

            if (!targetAccountType) {
                deps.logger.error('アカウントタイプが見つかりません', {
                    stage: 'switch-account',
                    reason: 'account-not-found',
                });
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
        } catch {
            deps.logger.error('アカウント切替中にエラー', {
                stage: 'switch-account',
                reason: 'unexpected',
            });
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
            const isCurrentAccount = deps.getAuthStateSnapshot()?.pubkey === pubkeyHex;
            if (isCurrentAccount) deps.invalidatePendingAccountScopedAsyncState?.();

            const nextPubkey = await deps.logoutAccountFromAuthService(pubkeyHex, {
                notifyParentClient: options.notifyParentClient,
            });
            const nextAction = deps.resolveLogoutAccountAction(
                nextPubkey,
            );

            if (nextAction.kind === 'switch') {
                if (isCurrentAccount) deps.clearAccountScopedAsyncState?.();
                deps.setCurrentRxNostr(
                    deps.disposeNostrSession(deps.getCurrentRxNostr()),
                );
                deps.setProfileLoading(false);
                deps.clearPersistedPostHistoryListingSnapshots();
                deps.reloadWindow();
                return;
            } else if (nextAction.kind === 'guest') {
                if (isCurrentAccount) deps.clearAccountScopedAsyncState?.();
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
                try {
                    await deps.initializeNostr();
                } finally {
                    deps.clearPersistedPostHistoryListingSnapshots();
                }
                deps.setSecretKey('');
            }

            deps.refreshAccountList();
            if (options.closeDialog !== false && nextAction.kind !== 'keep-current') {
                deps.closeLogoutDialog();
            }
        } catch {
            deps.logger.error('ログアウト処理中にエラー', {
                stage: 'logout-account',
                reason: 'unexpected',
            });
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

    function isCurrentNip46Session(pubkeyHex: string): boolean {
        const auth = deps.getAuthStateSnapshot();
        return auth?.type === 'nip46' && auth.pubkey === pubkeyHex;
    }

    async function handleNip46IdentityMismatch(
        pubkeyHex: string,
        options: { beforeConverge?: () => void } = {},
    ): Promise<void> {
        // A transition in progress owns the runtime; let it settle before
        // judging whether the mismatched session is still the current one.
        while (activeSwitch) {
            await activeSwitch;
        }
        if (!isCurrentNip46Session(pubkeyHex) || deps.getIsSwitchingAccount()) {
            return;
        }

        const converging = convergeAfterNip46IdentityMismatch(options);
        activeSwitch = converging;
        try {
            await converging;
        } finally {
            if (activeSwitch === converging) {
                activeSwitch = null;
            }
        }
    }

    async function convergeAfterNip46IdentityMismatch(
        options: { beforeConverge?: () => void },
    ): Promise<void> {
        deps.logger.error('NIP-46 signerのidentityが保存済みセッションと一致しません', {
            stage: 'nip46-identity-mismatch',
            reason: 'identity-mismatch',
        });
        // Held for the whole convergence so switchAccount() rejects a switch
        // that would otherwise have its runtime replaced by the guest runtime.
        deps.setIsSwitchingAccount(true);
        try {
            options.beforeConverge?.();
            // beforeConverge may abort a profile bootstrap that would otherwise
            // have cleared this flag; a guest left "loading" cannot log in.
            deps.setProfileLoading(false);
            deps.resetUploadDisplayState();
            await convergeToGuest();
            deps.refreshAccountList();
        } catch {
            deps.logger.error('NIP-46 identity不一致後のセッション終了に失敗しました', {
                stage: 'nip46-identity-mismatch',
                reason: 'unexpected',
            });
        } finally {
            deps.setIsSwitchingAccount(false);
        }
    }

    return {
        switchAccount,
        switchNosskeyAccount: (pubkeyHex) => confirmNosskeyAccount(pubkeyHex, true),
        confirmNosskeyAccount,
        cancelNosskeyConfirmation,
        logoutAccount,
        handleRemoteParentClientLogout,
        handleNip46IdentityMismatch,
    };
}
