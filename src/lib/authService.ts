import { setAuthInitialized } from '../stores/authStore.svelte';
import type { AuthResult, AuthServiceDependencies } from './types';
import type { AccountManager } from './accountManager';
import {
    applyPublicKeyAuth,
    createManagedAuthRestoreDependencies,
    restoreManagedAccount,
    runManagedAuthRestore,
    runLegacyAuthChecks,
    type RestoreResult,
} from './authRestoreUtils';
import { createAuthServiceRuntime, type AuthServiceRuntime } from './authServiceRuntime';

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
        } catch (error) {
            this.runtime.console.error('nsec認証処理中にエラー:', error);
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
            applyPublicKeyAuth('nip46', pubkeyHex, {
                setNip07AuthFn: this.runtime.setNip07AuthFn,
                setNip46AuthFn: this.runtime.setNip46AuthFn,
            });
            this.runtime.nip46Svc.saveSession(this.runtime.localStorage, pubkeyHex);
            this.accountManager?.addAccount(pubkeyHex, 'nip46');
            return { success: true, pubkeyHex };
        } catch (error) {
            this.runtime.console.error('NIP-46認証エラー:', error);
            const msg = error instanceof Error ? error.message : 'nip46_connection_failed';
            return { success: false, error: msg };
        }
    }

    // --- ログアウト ---

    /**
     * 指定アカウントをログアウトする。
     * @returns 次のアクティブアカウントのpubkeyHex。アカウントが残っていない場合はnull。
     */
    logoutAccount(pubkeyHex: string): string | null | undefined {
        try {
            // NIP-46の場合は接続を切断
            const accountType = this.accountManager?.getAccountType(pubkeyHex);
            if (accountType === 'nip46') {
                this.runtime.nip46Svc.disconnect().catch(e => {
                    this.runtime.console.error('NIP-46切断エラー:', e);
                });
            }

            // per-accountデータを削除
            this.accountManager?.cleanupAccountData(pubkeyHex);

            // アカウントリストから削除
            const nextPubkey = this.accountManager?.removeAccount(pubkeyHex);

            this.clearProfileImageCache();

            // string: 次のアクティブアカウント, null: アカウント残なし, undefined: 非アクティブ削除
            return nextPubkey;
        } catch (error) {
            this.runtime.console.error('ログアウト処理中に予期しないエラー:', error);
            return null;
        }
    }

    // --- 初期化 ---

    async initializeAuth(): Promise<RestoreResult> {
        try {
            if (this.accountManager) {
                this.accountManager.cleanupNostrLoginData();
                this.accountManager.migrateFromSingleAccount();
                return await runManagedAuthRestore({
                    accountManager: this.accountManager,
                    restoreAccount: (pubkeyHex, type) => this.restoreAccount(pubkeyHex, type),
                });
            }

            return await this.initializeLegacyAuth();
        } catch (error) {
            this.runtime.console.error('認証初期化失敗:', error);
            return { hasAuth: false };
        }
    }

    /**
     * 指定アカウントの認証を復元する。
     */
    async restoreAccount(pubkeyHex: string, type: 'nsec' | 'nip07' | 'nip46'): Promise<RestoreResult> {
        return restoreManagedAccount(
            pubkeyHex,
            type,
            createManagedAuthRestoreDependencies(this.createRestoreDependencies()),
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
                    this.runtime.console.error('プロフィール画像キャッシュクリア失敗:', event.data.error);
                }
            };

            this.runtime.navigator.serviceWorker.controller.postMessage(
                { action: 'clearProfileCache' },
                [messageChannel.port2]
            );
        } catch (error) {
            this.runtime.console.error('プロフィール画像キャッシュクリア中にエラー:', error);
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
