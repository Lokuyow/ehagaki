import { setAuthInitialized } from '../stores/authStore.svelte';
import type { AuthResult, AuthServiceDependencies } from './types';
import type { AccountManager } from './accountManager';
import {
    applyPublicKeyAuth,
    createManagedAuthRestoreDependencies,
    restoreManagedAccount,
    runManagedAuthRestore,
    type ManagedRestoreResult,
    runLegacyAuthChecks,
    type RestoreResult,
} from './authRestoreUtils';
import { createAuthServiceRuntime, type AuthServiceRuntime } from './authServiceRuntime';
import { ParentClientAuthService, type ParentClientConnectOptions } from './parentClientAuthService';
import { resetManagedAccountData } from './accountDataReset';
import type { Nip46PendingNostrConnectSession } from './nip46Service';
import {
    captureLegacyNsecMigrationSnapshot,
    migrateLegacyNsec,
} from './legacyNsecMigration';

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

    // --- nsec認証 ---

    async authenticateWithNsec(secretKey: string): Promise<AuthResult> {
        if (!this.runtime.keyManager.isValidNsec(secretKey)) {
            return { success: false, error: 'invalid_secret' };
        }

        try {
            const derived = this.runtime.keyManager.derivePublicKey(secretKey);
            if (!derived.hex) {
                return { success: false, error: 'derivation_failed' };
            }

            // per-accountストレージに保存
            const { success } = this.runtime.keyManager.saveToStorage(secretKey, derived.hex) as { success?: boolean };
            if (!success) {
                return { success: false, error: 'error_saving' };
            }

            this.runtime.setNsecAuthFn(derived.hex, derived.npub, derived.nprofile);
            this.accountManager?.addAccount(derived.hex, 'nsec');
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

    async authenticateWithNip07(): Promise<AuthResult> {
        const available = await this.runtime.nip07Service.waitForExtension(3000);
        if (!available) {
            return { success: false, error: 'nip07_not_available' };
        }

        const result = await this.runtime.nip07Service.authenticate();
        if (!result.success || !result.pubkeyHex || !result.pubkeyData) {
            return { success: false, error: result.error || 'nip07_auth_error' };
        }

        this.runtime.setNip07AuthFn(result.pubkeyData.hex, result.pubkeyData.npub, result.pubkeyData.nprofile);
        this.accountManager?.addAccount(result.pubkeyHex, 'nip07');
        return { success: true, pubkeyHex: result.pubkeyHex };
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
            const isRuntimeParentClientAccount =
                this.runtime.parentClientSvc.isConnected()
                && this.runtime.parentClientSvc.getUserPubkey() === pubkeyHex;

            // NIP-46の場合は接続を切断
            const accountType = this.accountManager?.getAccountType(pubkeyHex);
            if (accountType === 'parentClient' || isRuntimeParentClientAccount) {
                this.runtime.parentClientSvc.disconnect(options.notifyParentClient ?? true);
                ParentClientAuthService.clearSession(this.runtime.localStorage, pubkeyHex);
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

    async initializeAuth(): Promise<RestoreResult> {
        try {
            if (this.accountManager) {
                const snapshotResult = captureLegacyNsecMigrationSnapshot(this.runtime.localStorage);
                if (snapshotResult.status === 'failed') {
                    return { hasAuth: false };
                }

                this.accountManager.cleanupNostrLoginData();
                if (!snapshotResult.snapshot.accountListExisted) {
                    this.accountManager.migrateFromSingleAccount();
                }
                migrateLegacyNsec({
                    localStorage: this.runtime.localStorage,
                    keyManager: this.runtime.keyManager,
                    snapshot: snapshotResult.snapshot,
                });
                return await runManagedAuthRestore({
                    accountManager: this.accountManager,
                    restoreAccount: (pubkeyHex, type) => this.restoreAccount(pubkeyHex, type),
                });
            }

            return await this.initializeLegacyAuth();
        } catch (error) {
            this.runtime.console.error('認証初期化失敗', {
                stage: 'restore',
                reason: 'unexpected',
            });
            return { hasAuth: false };
        }
    }

    async finalizeNip46Authentication(
        pubkeyHex: string,
    ): Promise<AuthResult> {
        applyPublicKeyAuth('nip46', pubkeyHex, {
            setNip07AuthFn: this.runtime.setNip07AuthFn,
            setNip46AuthFn: this.runtime.setNip46AuthFn,
            setParentClientAuthFn: this.runtime.setParentClientAuthFn,
        });
        this.runtime.nip46Svc.saveSession(this.runtime.localStorage, pubkeyHex);
        this.accountManager?.addAccount(pubkeyHex, 'nip46');
        return { success: true, pubkeyHex };
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
    ): Promise<ManagedRestoreResult> {
        if (!/^[0-9a-fA-F]{64}$/.test(pubkeyHex)) {
            return { hasAuth: false, reason: 'invalid-requested-pubkey' };
        }

        if (!this.accountManager || this.accountManager.getAccountType(pubkeyHex) !== type) {
            return { hasAuth: false, reason: 'account-record-mismatch' };
        }

        return restoreManagedAccount(
            pubkeyHex,
            type,
            createManagedAuthRestoreDependencies({
                ...this.createRestoreDependencies(),
                isExpectedAccount: (targetPubkeyHex, expectedType) =>
                    this.accountManager?.getAccountType(targetPubkeyHex) === expectedType,
            }),
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

    // --- プロフィール画像キャッシュクリア ---

    private clearProfileImageCache(): void {
        try {
            if (!('serviceWorker' in this.runtime.navigator) || !this.runtime.navigator.serviceWorker.controller) return;

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
