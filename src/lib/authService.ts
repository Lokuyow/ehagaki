import { isHex64 } from './utils/nostrHexUtils';
import { setAuthInitialized } from '../stores/authStore.svelte';
import type { AuthResult, AuthServiceDependencies } from './types';
import type { AccountManager } from './accountManager';
import {
    applyPublicKeyAuth,
    createManagedAuthRestoreDependencies,
    restoreManagedAccount,
    runManagedAuthRestore,
    type AuthInitializationResult,
    type ManagedRestoreResult,
    runLegacyAuthChecks,
    MANAGED_NIP07_IDENTITY_READ_TIMEOUT_MS,
    type RestoreResult,
} from './authRestoreUtils';
import { createAuthServiceRuntime, type AuthServiceRuntime } from './authServiceRuntime';
import { ParentClientAuthService, type ParentClientConnectOptions } from './parentClientAuthService';
import { resetManagedAccountData } from './accountDataReset';
import { Nip46Service, type Nip46PendingNostrConnectSession } from './nip46Service';
import {
    captureLegacyNsecMigrationSnapshot,
    migrateLegacyNsec,
} from './legacyNsecMigration';
import { getNsecStorageKey } from './authStorageKeys';
import { AUTH_SUPERSEDED_ERROR } from './constants';
import type { PublicKeyData, StoredAccount } from './types';

type ParentClientAuthOptions = Pick<ParentClientConnectOptions, 'silent' | 'timeoutMs'>;

export interface PendingNip46AuthSession {
    connectionUri: string;
    ready: Promise<void>;
    handshakeStarted: Promise<void>;
    completion: Promise<AuthResult>;
    cancel: () => Promise<void>;
}

// --- メインのAuthServiceクラス ---
export class AuthService {
    private readonly runtime: AuthServiceRuntime;
    private accountManager: AccountManager | null = null;

    constructor(dependencies: AuthServiceDependencies = {}) {
        this.runtime = createAuthServiceRuntime(dependencies);
    }

    // --- AccountManager設定 ---

    setAccountManager(accountManager: AccountManager): void {
        this.accountManager = accountManager;
    }

    getNip07Service() {
        return this.runtime.nip07Service;
    }

    // --- nsec認証 ---

    async authenticateWithNsec(secretKey: string): Promise<AuthResult> {
        if (!this.runtime.localNsecAuthEnabled) {
            return { success: false, error: 'local-nsec-auth-disabled' };
        }

        if (!this.runtime.keyManager.isValidNsec(secretKey)) {
            return { success: false, error: 'invalid_secret' };
        }

        try {
            const derived = this.runtime.keyManager.derivePublicKey(secretKey);
            if (!derived.hex) {
                return { success: false, error: 'derivation_failed' };
            }

            // Persist the credential first without touching the runtime key or
            // auth state, so a later failure cannot leave another account's
            // session signing with this key.
            const existingKey = this.runtime.keyManager.readStoredKey(derived.hex);
            if (existingKey.status === 'error') {
                return { success: false, error: 'error_saving' };
            }
            const keyAlreadyStored = existingKey.status === 'found'
                && existingKey.secretKey === secretKey;
            if (
                !keyAlreadyStored
                && this.runtime.keyManager.writeStoredKeyForMigration(derived.hex, secretKey).status !== 'saved'
            ) {
                return { success: false, error: 'error_saving' };
            }

            let previousType: StoredAccount['type'] | null;
            try {
                previousType = this.recordAccount(derived.hex, 'nsec');
            } catch {
                // Never leave a secret key in storage without an account record.
                if (existingKey.status === 'missing') {
                    this.runtime.keyManager.removeStoredKeyForMigration(derived.hex);
                }
                this.runtime.console.error('nsec認証処理中にエラー', {
                    stage: 'account-record',
                    reason: 'unexpected',
                });
                return { success: false, error: 'error_saving' };
            }

            this.runtime.keyManager.setCurrentSecretKey(secretKey);
            this.runtime.setNsecAuthFn(derived.hex, derived.npub, derived.nprofile);
            await this.cleanupReplacedAuthData(derived.hex, previousType, 'nsec');
            return { success: true, pubkeyHex: derived.hex };
        } catch {
            this.runtime.console.error('nsec認証処理中にエラー', {
                stage: 'nsec-authentication',
                reason: 'unexpected',
            });
            return { success: false, error: 'authentication_error' };
        }
    }

    // --- NIP-07認証 ---

    isNip07Available(): boolean {
        return this.runtime.nip07Service.isAvailable();
    }

    /**
     * @param options.isCurrent Checked after the extension answers and before
     * anything is committed, so an answer that arrives after the user started
     * another login cannot replace that login.
     */
    async authenticateWithNip07(
        options: { isCurrent?: () => boolean } = {},
    ): Promise<AuthResult> {
        const available = await this.runtime.nip07Service.waitForExtension(3000);
        if (!available) {
            return { success: false, error: 'nip07_not_available' };
        }

        const result = await this.runtime.nip07Service.authenticate();
        if (!result.success || !result.pubkeyHex || !result.pubkeyData) {
            return { success: false, error: result.error || 'nip07_auth_error' };
        }
        if (options.isCurrent && !options.isCurrent()) {
            return { success: false, error: AUTH_SUPERSEDED_ERROR };
        }

        return this.commitNip07Identity(result.pubkeyData);
    }

    async authenticateWithNip07ForAutoLogin(
        identity?: PublicKeyData,
    ): Promise<AuthResult> {
        let resolvedIdentity = identity;
        if (!resolvedIdentity) {
            const available = await this.runtime.nip07Service.waitForExtension(3000);
            if (!available) {
                return { success: false, error: 'nip07_not_available' };
            }

            const result = await this.runtime.nip07Service.authenticate({ timeoutMs: 3000 });
            if (!result.success || !result.pubkeyHex || !result.pubkeyData) {
                return { success: false, error: result.error || 'nip07_auth_error' };
            }
            if (result.pubkeyHex !== result.pubkeyData.hex) {
                return { success: false, error: 'nip07_auth_error' };
            }
            resolvedIdentity = result.pubkeyData;
        }

        return this.commitNip07Identity(resolvedIdentity);
    }

    private async commitNip07Identity(identity: PublicKeyData): Promise<AuthResult> {
        let previousType: StoredAccount['type'] | null;
        try {
            previousType = this.recordAccount(identity.hex, 'nip07');
            this.runtime.setNip07AuthFn(identity.hex, identity.npub, identity.nprofile);
        } catch {
            this.runtime.console.error('NIP-07認証の確定に失敗しました', {
                stage: 'commit',
                reason: 'unexpected',
            });
            return { success: false, error: 'nip07_auth_error' };
        }

        await this.cleanupReplacedAuthData(identity.hex, previousType, 'nip07');
        return { success: true, pubkeyHex: identity.hex };
    }

    /** Reads the NIP-07 identity without changing auth, account, or active state. */
    async readNip07Identity(): Promise<PublicKeyData | null> {
        const result = await this.runtime.nip07Service.authenticate({
            timeoutMs: MANAGED_NIP07_IDENTITY_READ_TIMEOUT_MS,
        });
        return result.success && result.pubkeyData ? result.pubkeyData : null;
    }

    // --- NIP-46認証 ---

    async authenticateWithNip46(bunkerUrl: string): Promise<AuthResult> {
        try {
            const pubkeyHex = await this.runtime.nip46Svc.connect(bunkerUrl);
            return this.finalizeNip46Authentication(pubkeyHex);
        } catch (error) {
            this.runtime.console.error('NIP-46認証エラー', {
                stage: 'bunker-connect',
                reason: 'unexpected',
            });
            const msg = error instanceof Error ? error.message : 'nip46_connection_failed';
            return { success: false, error: msg };
        }
    }

    async startNip46NostrConnect(
        relays: string[],
        timeoutMs?: number,
    ): Promise<PendingNip46AuthSession> {
        const pending = await this.runtime.nip46Svc.startNostrConnect(
            relays,
            timeoutMs,
        );

        return {
            get connectionUri() {
                return pending.connectionUri;
            },
            ready: pending.ready,
            handshakeStarted: pending.handshakeStarted,
            completion: this.wrapPendingNip46Connection(pending),
            cancel: pending.cancel,
        };
    }

    // --- 親クライアント連携認証 ---

    async authenticateWithParentClient(
        options: ParentClientAuthOptions = {},
    ): Promise<AuthResult> {
        try {
            const pubkeyHex = await this.runtime.parentClientSvc.connect(options);
            applyPublicKeyAuth('parentClient', pubkeyHex, {
                setNip07AuthFn: this.runtime.setNip07AuthFn,
                setNip46AuthFn: this.runtime.setNip46AuthFn,
                setParentClientAuthFn: this.runtime.setParentClientAuthFn,
            });

            const session = this.runtime.parentClientSvc.getSessionData();
            if (session) {
                ParentClientAuthService.saveSession(
                    this.runtime.localStorage,
                    session,
                );
            }

            return { success: true, pubkeyHex };
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'parent_client_auth_error';
            if (!options.silent) {
                this.runtime.console.error('親クライアント連携認証エラー', {
                    stage: 'parent-client-connect',
                    reason: 'unexpected',
                });
            }
            return { success: false, error: msg };
        }
    }

    // --- ログアウト ---

    /**
     * 指定アカウントをログアウトする。
     * @returns 次のアクティブアカウントのpubkeyHex。アカウントが残っていない場合はnull。
     */
    async logoutAccount(
        pubkeyHex: string,
        options: { notifyParentClient?: boolean } = {},
    ): Promise<string | null | undefined> {
        try {
            const parentClientConnected = this.runtime.parentClientSvc.isConnected();
            const isRuntimeParentClientAccount =
                parentClientConnected
                && this.runtime.parentClientSvc.getUserPubkey() === pubkeyHex;

            // NIP-46の場合は接続を切断
            const accountType = this.accountManager?.getAccountType(pubkeyHex);
            if (accountType === 'parentClient' || isRuntimeParentClientAccount) {
                if (
                    isRuntimeParentClientAccount
                    || (!parentClientConnected && this.accountManager?.getActiveAccountPubkey() === pubkeyHex)
                ) {
                    this.runtime.parentClientSvc.disconnect(options.notifyParentClient ?? true);
                }
                try {
                    ParentClientAuthService.clearSession(this.runtime.localStorage, pubkeyHex);
                } catch {
                    this.runtime.console.error('アカウントデータ削除に失敗しました', {
                        stage: 'local-storage',
                        target: 'parent-client-session',
                        reason: 'unexpected',
                    });
                }
            } else if (accountType === 'nip46') {
                try {
                    await this.runtime.nip46Svc.disconnect();
                } catch {
                    this.runtime.console.error('NIP-46切断エラー', {
                        stage: 'disconnect',
                        reason: 'unexpected',
                    });
                }
            }

            // per-accountデータを削除
            await this.accountManager?.cleanupAccountData(pubkeyHex);

            // アカウントリストから削除
            const nextPubkey = this.accountManager?.removeAccount(pubkeyHex);

            this.clearProfileImageCache();

            // string: 次のアクティブアカウント, null: アカウント残なし, undefined: 非アクティブ削除
            return nextPubkey;
        } catch {
            this.runtime.console.error('ログアウト処理中に予期しないエラー', {
                stage: 'logout',
                reason: 'unexpected',
            });
            return null;
        }
    }

    async logoutLastAccount(
        pubkeyHex: string,
        options: { notifyParentClient?: boolean } = {},
    ): Promise<void> {
        const accountType = this.accountManager?.getAccountType(pubkeyHex);
        const isRuntimeParentClientAccount =
            this.runtime.parentClientSvc.isConnected()
            && this.runtime.parentClientSvc.getUserPubkey() === pubkeyHex;

        if (accountType === 'parentClient' || isRuntimeParentClientAccount) {
            this.runtime.parentClientSvc.disconnect(options.notifyParentClient ?? true);
        } else if (accountType === 'nip46') {
            await this.runtime.nip46Svc.disconnect();
        }

        await resetManagedAccountData({
            localStorage: this.runtime.localStorage,
            indexedDB: this.runtime.indexedDB,
            caches: this.runtime.caches,
            console: this.runtime.console,
        });
    }

    // --- 初期化 ---

    async initializeAuth(): Promise<AuthInitializationResult> {
        try {
            if (this.accountManager) {
                if (!this.runtime.localNsecAuthEnabled) {
                    this.accountManager.cleanupLocalNsecAuthData();
                }
                const snapshotResult = captureLegacyNsecMigrationSnapshot(this.runtime.localStorage);
                if (snapshotResult.status === 'failed') {
                    return { hasAuth: false, restoreOutcome: 'infrastructure-failure' };
                }

                this.accountManager.cleanupNostrLoginData();
                if (!snapshotResult.snapshot.accountListExisted) {
                    this.accountManager.migrateFromSingleAccount();
                }
                const migrationResult = migrateLegacyNsec({
                    localStorage: this.runtime.localStorage,
                    keyManager: this.runtime.keyManager,
                    snapshot: snapshotResult.snapshot,
                });
                const migrationInfrastructureFailure = ![
                    'legacy-credential-missing',
                    'migrated',
                    'already-migrated',
                ].includes(migrationResult.status);

                const restoreSnapshotResult = this.accountManager.getAuthRestoreSnapshot();
                if (restoreSnapshotResult.status === 'failed') {
                    return { hasAuth: false, restoreOutcome: 'infrastructure-failure' };
                }
                return await runManagedAuthRestore({
                    restoreSnapshot: restoreSnapshotResult.snapshot,
                    infrastructureFailureDetected: migrationInfrastructureFailure,
                    accountManager: this.accountManager,
                    restoreAccount: (pubkeyHex, type, nip07Identity) =>
                        this.restoreAccount(pubkeyHex, type, {
                            nip07Identity,
                            expectedAccounts: restoreSnapshotResult.snapshot.accounts,
                        }),
                });
            }

            const result = await this.initializeLegacyAuth();
            return result.hasAuth
                ? result
                : { ...result, restoreOutcome: 'completed' };
        } catch (error) {
            this.runtime.console.error('認証初期化失敗', {
                stage: 'restore',
                reason: 'unexpected',
            });
            return { hasAuth: false, restoreOutcome: 'infrastructure-failure' };
        }
    }

    async finalizeNip46Authentication(
        pubkeyHex: string,
    ): Promise<AuthResult> {
        // Credential, then account record, then runtime state.
        this.runtime.nip46Svc.saveSession(this.runtime.localStorage, pubkeyHex);
        const previousType = this.recordAccount(pubkeyHex, 'nip46');
        applyPublicKeyAuth('nip46', pubkeyHex, {
            setNip07AuthFn: this.runtime.setNip07AuthFn,
            setNip46AuthFn: this.runtime.setNip46AuthFn,
            setParentClientAuthFn: this.runtime.setParentClientAuthFn,
        });
        await this.cleanupReplacedAuthData(pubkeyHex, previousType, 'nip46');
        return { success: true, pubkeyHex };
    }

    /** Records the account as active and returns the auth type it replaces. */
    private recordAccount(
        pubkeyHex: string,
        type: StoredAccount['type'],
    ): StoredAccount['type'] | null {
        const previousType = this.accountManager?.getAccountType(pubkeyHex) ?? null;
        this.accountManager?.addAccount(pubkeyHex, type);
        return previousType;
    }

    private async wrapPendingNip46Connection(
        pending: Nip46PendingNostrConnectSession,
    ): Promise<AuthResult> {
        try {
            const pubkeyHex = await pending.completion;
            return { success: true, pubkeyHex };
        } catch (error) {
            this.runtime.console.error('NIP-46 nostrconnect認証エラー', {
                stage: 'nostrconnect-completion',
                reason: 'unexpected',
            });
            return {
                success: false,
                error: error instanceof Error
                    ? error.message
                    : 'nip46_connection_failed',
            };
        }
    }

    /**
     * 指定アカウントの認証を復元する。
     */
    async restoreAccount(
        pubkeyHex: string,
        type: 'nsec' | 'nip07' | 'nip46' | 'parentClient',
        options: {
            nip07Identity?: PublicKeyData;
            expectedAccounts?: Array<Pick<StoredAccount, 'pubkeyHex' | 'type'>>;
        } = {},
    ): Promise<ManagedRestoreResult> {
        if (type === 'nsec' && !this.runtime.localNsecAuthEnabled) {
            return { hasAuth: false, reason: 'local-nsec-auth-disabled' };
        }

        if (!isHex64(pubkeyHex)) {
            return { hasAuth: false, reason: 'invalid-requested-pubkey' };
        }

        const isExpectedAccount = (targetPubkeyHex: string, expectedType: StoredAccount['type']) =>
            options.expectedAccounts
                ? options.expectedAccounts.some((account) =>
                    account.pubkeyHex === targetPubkeyHex && account.type === expectedType)
                : this.accountManager?.getAccountType(targetPubkeyHex) === expectedType;

        if (!this.accountManager || !isExpectedAccount(pubkeyHex, type)) {
            return { hasAuth: false, reason: 'account-record-mismatch' };
        }

        return restoreManagedAccount(
            pubkeyHex,
            type,
            createManagedAuthRestoreDependencies({
                ...this.createRestoreDependencies(),
                isExpectedAccount,
            }),
            options.nip07Identity,
        );
    }

    private async initializeLegacyAuth(): Promise<RestoreResult> {
        return runLegacyAuthChecks({
            ...this.createRestoreDependencies(),
            accountManager: this.accountManager,
        });
    }

    private createRestoreDependencies() {
        return {
            ...this.runtime,
            accountManager: this.accountManager,
        };
    }

    /**
     * Removes the credentials of the auth method an account just stopped using,
     * so a secret key or remote-signer session does not outlive the switch.
     */
    private async cleanupReplacedAuthData(
        pubkeyHex: string,
        previousType: StoredAccount['type'] | null,
        nextType: StoredAccount['type'],
    ): Promise<void> {
        if (!previousType || previousType === nextType) return;

        const cleanupActions: Array<{ target: string; run: () => void | Promise<void> }> = [];
        if (previousType === 'nsec') {
            cleanupActions.push({
                target: 'nsec-credential',
                run: () => this.runtime.localStorage.removeItem(getNsecStorageKey(pubkeyHex)),
            });
        } else if (previousType === 'nip46') {
            cleanupActions.push(
                { target: 'nip46-runtime', run: () => this.runtime.nip46Svc.disconnect() },
                {
                    target: 'nip46-session',
                    run: () => Nip46Service.clearSession(this.runtime.localStorage, pubkeyHex),
                },
            );
        } else if (previousType === 'parentClient') {
            cleanupActions.push(
                {
                    target: 'parent-client-runtime',
                    run: () => {
                        // Another account may own the live parent-client session.
                        if (this.runtime.parentClientSvc.getUserPubkey() === pubkeyHex) {
                            this.runtime.parentClientSvc.disconnect(false);
                        }
                    },
                },
                {
                    target: 'parent-client-session',
                    run: () => ParentClientAuthService.clearSession(this.runtime.localStorage, pubkeyHex),
                },
            );
        }

        for (const action of cleanupActions) {
            try {
                await action.run();
            } catch {
                this.runtime.console.error('認証方式固有データの削除に失敗しました', {
                    stage: 'auth-replacement',
                    target: action.target,
                    reason: 'unexpected',
                });
            }
        }
    }

    // --- プロフィール画像キャッシュクリア ---

    private clearProfileImageCache(): void {
        try {
            if (
                !this.runtime.serviceWorkerEnabled
                || !('serviceWorker' in this.runtime.navigator)
                || !this.runtime.navigator.serviceWorker.controller
            ) return;

            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
                if (event.data.success) {
                    this.runtime.console.log('プロフィール画像キャッシュをクリアしました');
                } else {
                    this.runtime.console.error('プロフィール画像キャッシュクリア失敗', {
                        stage: 'profile-image-cache',
                        reason: 'unexpected',
                    });
                }
            };

            this.runtime.navigator.serviceWorker.controller.postMessage(
                { action: 'clearProfileCache' },
                [messageChannel.port2]
            );
        } catch {
            this.runtime.console.error('プロフィール画像キャッシュクリア中にエラー', {
                stage: 'profile-image-cache',
                reason: 'unexpected',
            });
        }
    }

    // --- ユーティリティ ---

    getPublicKeyState() {
        return this.runtime.publicKeyState;
    }

    markAuthInitialized(): void {
        setAuthInitialized();
    }
}

export const authService = new AuthService();
